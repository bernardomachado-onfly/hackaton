# Travel Assistant — Design Técnico

> Arquitetura detalhada do Onfly Copilot v3

---

## Diagrama de componentes

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React)                  │
│  ┌──────────────────────────────────────────────┐   │
│  │  ChatWindow                                  │   │
│  │  ├── MessageList (streaming)                 │   │
│  │  ├── InputBar                                │   │
│  │  └── TypingIndicator                         │   │
│  └──────────────────────────────────────────────┘   │
│                POST /api/chat (body: { sessionId, message })  │
│                ← SSE stream (text/event-stream)      │
└─────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│                   BACKEND (Express)                  │
│                                                      │
│  POST /api/chat                                      │
│  ├── SessionStore.getOrCreate(sessionId)             │
│  └── AgentService.run(session, message) → SSE stream │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  AgentService                                │   │
│  │  ├── Prepara messages[] com histórico        │   │
│  │  ├── Chama Claude API (streaming + tool_use) │   │
│  │  ├── Loop: tool_calls → executa → continua   │   │
│  │  └── Faz stream do texto para o cliente      │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  SessionStore (in-memory Map)                │   │
│  │  Map<string, Session>                        │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│                 TOOLS (mock ou API real)              │
│  ├── search_flights(params) → FlightOption[]         │
│  ├── search_hotels(params) → HotelOption[]           │
│  └── create_booking(params) → BookingConfirmation    │
└─────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│              ANTHROPIC API (Claude Sonnet)            │
│  Model: claude-sonnet-4-6                            │
│  Features: tool_use + streaming                      │
└─────────────────────────────────────────────────────┘
```

---

## Data models

```typescript
// Session
interface Session {
  id: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
  trip: TripState
}

interface TripState {
  status: 'idle' | 'searching_flights' | 'searching_hotels' | 'confirming' | 'booked'
  origin?: string
  destination?: string
  dates?: {
    departure: string    // ISO date
    return?: string      // ISO date, optional
  }
  passengers?: number
  selectedFlight?: FlightOption
  selectedHotel?: HotelOption
}

// Tool outputs
interface FlightOption {
  id: string
  airline: string
  flight_number: string
  departure: string        // ISO datetime
  arrival: string          // ISO datetime
  price: number            // BRL
  available_seats: number
  policy_compliant: boolean
  policy_notes?: string    // ex: "acima do limite da política em R$50"
}

interface HotelOption {
  id: string
  name: string
  stars: number
  price_per_night: number  // BRL
  address: string
  policy_compliant: boolean
}

interface BookingConfirmation {
  booking_id: string
  status: 'confirmed' | 'pending' | 'failed'
  flight?: FlightOption
  hotel?: HotelOption
  total_cost: number
  created_at: string
}
```

---

## Tool definitions (para Claude API)

```typescript
const tools = [
  {
    name: "search_flights",
    description: "Busca voos disponíveis para a rota e datas especificadas. Retorna lista de opções com preço e indicação se está dentro da política da empresa.",
    input_schema: {
      type: "object",
      properties: {
        origin: { type: "string", description: "Código IATA do aeroporto de origem (ex: GRU, CNF, SDU)" },
        destination: { type: "string", description: "Código IATA do aeroporto de destino" },
        departure_date: { type: "string", description: "Data de partida no formato YYYY-MM-DD" },
        return_date: { type: "string", description: "Data de retorno no formato YYYY-MM-DD (apenas para ida e volta)" },
        passengers: { type: "number", description: "Número de passageiros" }
      },
      required: ["origin", "destination", "departure_date", "passengers"]
    }
  },
  {
    name: "search_hotels",
    description: "Busca hotéis disponíveis no destino para o período da viagem.",
    input_schema: {
      type: "object",
      properties: {
        city: { type: "string", description: "Cidade de destino" },
        checkin: { type: "string", description: "Data de check-in no formato YYYY-MM-DD" },
        checkout: { type: "string", description: "Data de check-out no formato YYYY-MM-DD" },
        guests: { type: "number", description: "Número de hóspedes" }
      },
      required: ["city", "checkin", "checkout", "guests"]
    }
  },
  {
    name: "create_booking",
    description: "Confirma e cria a reserva completa com voo e/ou hotel selecionados.",
    input_schema: {
      type: "object",
      properties: {
        session_id: { type: "string", description: "ID da sessão do viajante" },
        flight_id: { type: "string", description: "ID do voo selecionado (do search_flights)" },
        hotel_id: { type: "string", description: "ID do hotel selecionado (do search_hotels)" }
      },
      required: ["session_id"]
    }
  }
]
```

---

## System prompt do agente

```
Você é o Onfly Copilot, assistente de reservas corporativas da Onfly.

Seu objetivo é ajudar viajantes corporativos a reservar viagens de forma rápida e simples por chat.

Diretrizes:
- Seja conciso e direto. Evite mensagens longas.
- Confirme parâmetros antes de buscar (origem, destino, datas, passageiros)
- Sempre indique se uma opção está dentro ou fora da política da empresa
- Apresente no máximo 3 opções por busca, formatadas de forma clara
- Após o viajante selecionar o voo, busque hotel automaticamente
- Antes de confirmar o booking, apresente um resumo e peça confirmação
- Use linguagem informal e amigável — como um colega de trabalho prestativo

Formato de apresentação de voos:
✈️ Opção [N]: [Cia] [Número] | [HH:MM] → [HH:MM] | R$ [valor] | [dentro/fora da política]

Formato de apresentação de hotéis:
🏨 Opção [N]: [Nome] [⭐ estrelas] | R$ [valor]/noite | [dentro/fora da política]
```

---

## Fluxo SSE

```
Cliente → POST /api/chat { sessionId, message }
Servidor →
  Content-Type: text/event-stream
  Cache-Control: no-cache
  
  data: {"type": "text", "content": "Vou buscar voos para..."}
  
  data: {"type": "tool_call", "tool": "search_flights", "status": "running"}
  
  data: {"type": "tool_result", "tool": "search_flights", "count": 3}
  
  data: {"type": "text", "content": "Encontrei 3 opções:..."}
  
  data: {"type": "done"}
```

---

## Estrutura de pastas

```
src/
├── agent/
│   └── AgentService.ts       ← tool use loop principal
├── tools/
│   ├── searchFlights.ts
│   ├── searchHotels.ts
│   └── createBooking.ts
├── store/
│   └── SessionStore.ts       ← in-memory Map de sessões
├── routes/
│   └── chat.ts               ← POST /api/chat → SSE
├── types/
│   └── index.ts              ← interfaces compartilhadas
└── index.ts                  ← Express app
```
