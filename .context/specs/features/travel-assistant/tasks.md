# Travel Assistant — Task Breakdown

> Plano de execução para as 8h do hackathon.
> Status: [ ] pendente | [→] em andamento | [✓] concluído
>
> **IMPORTANTE:** Todas as interfaces estão em `.context/specs/types.ts`.
> Ler antes de implementar qualquer tool ou serviço.

---

## F1 — Setup + Core (00:00–02:00)

### T1 — Scaffolding do projeto
**Duração:** 30 min | **Depende de:** nada | **Owner:** quem iniciar primeiro

```bash
mkdir -p src/{agent,tools,store,routes,types}
# package.json com: express, @anthropic-ai/sdk, typescript, cors, uuid
# tsconfig.json com strict: true
# .env com ANTHROPIC_API_KEY
```

**Done when:**
```bash
npm run dev   # servidor sobe sem erro na porta 3000
npx tsc --noEmit  # zero erros de tipagem
```

---

### T2 — SessionStore
**Duração:** 30 min | **Depende de:** T1 | **Owner:** Dev F1

Arquivo: `src/store/SessionStore.ts`
Tipos: importar `Session`, `Message`, `TripState` de `.context/specs/types.ts`

```typescript
class SessionStore {
  create(id?: string): Session
  get(id: string): Session | undefined
  getOrCreate(id?: string): Session
  update(id: string, trip: Partial<TripState>): void
  addMessage(id: string, message: Message): void
}
```

**Done when:**
```typescript
const store = new SessionStore()
const s = store.create()
store.addMessage(s.id, { role: 'user', content: 'teste', timestamp: new Date() })
console.log(store.get(s.id)?.messages.length) // → 1
```

---

### T3 — AgentService base
**Duração:** 60 min | **Depende de:** T1, T2 | **Owner:** Dev F1

Arquivo: `src/agent/AgentService.ts`
Tipos: importar de `.context/specs/types.ts`

```typescript
async function* run(session: Session, userMessage: string): AsyncIterable<string> {
  // 1. Adiciona mensagem do usuário ao histórico
  // 2. Chama Claude com tool_use + streaming
  // 3. Se tool_use → executa tool → adiciona resultado → continua loop
  // 4. yield do texto gerado
}
```

**Done when:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "oi"}' \
  --no-buffer
# → stream de texto aparece no terminal
```

---

## F2 — Tools (02:00–04:00) — PARALELO

> **Antes de começar:** todos os tipos já estão em `.context/specs/types.ts`.
> Importar de lá — não redefinir interfaces localmente.

### T4 — search_flights
**Duração:** 60 min | **Depende de:** T1 | **Paralelo com:** T5, T6 | **Owner:** Dev A

Arquivo: `src/tools/searchFlights.ts`

```typescript
import { SearchFlightsInput, FlightOption } from '../types'

export function searchFlights(input: SearchFlightsInput): FlightOption[] { ... }
```

Mock data (3 voos CNF→CGH):
```typescript
[
  { id: "f001", airline: "LATAM", flight_number: "LA3520",
    departure: "2026-04-15T07:00:00", arrival: "2026-04-15T08:05:00",
    price: 380, available_seats: 4, policy_compliant: true },
  { id: "f002", airline: "GOL", flight_number: "G13821",
    departure: "2026-04-15T10:30:00", arrival: "2026-04-15T11:35:00",
    price: 420, available_seats: 2, policy_compliant: true },
  { id: "f003", airline: "LATAM", flight_number: "LA3550",
    departure: "2026-04-15T18:45:00", arrival: "2026-04-15T19:50:00",
    price: 290, available_seats: 6, policy_compliant: true }
]
```

**Done when:**
```typescript
const result = searchFlights({ origin: "CNF", destination: "CGH",
  departure_date: "2026-04-15", passengers: 1 })
console.log(result.length)        // → 3
console.log(result[0].id)         // → "f001"
console.log(result[2].price)      // → 290
```

---

### T5 — search_hotels
**Duração:** 60 min | **Depende de:** T1 | **Paralelo com:** T4, T6 | **Owner:** Dev B

Arquivo: `src/tools/searchHotels.ts`

```typescript
import { SearchHotelsInput, HotelOption } from '../types'

export function searchHotels(input: SearchHotelsInput): HotelOption[] { ... }
```

Mock data (3 hotéis em SP):
```typescript
[
  { id: "h001", name: "Ibis Paulista", stars: 3,
    price_per_night: 220, address: "Av. Paulista, 2355",
    policy_compliant: true },
  { id: "h002", name: "Pullman Ibirapuera", stars: 5,
    price_per_night: 680, address: "Av. Ibirapuera, 2534",
    policy_compliant: false },
  { id: "h003", name: "Novotel Jaraguá", stars: 4,
    price_per_night: 380, address: "Rua Martins Fontes, 71",
    policy_compliant: true }
]
```

**Done when:**
```typescript
const result = searchHotels({ city: "São Paulo",
  checkin: "2026-04-15", checkout: "2026-04-17", guests: 1 })
console.log(result.length)               // → 3
console.log(result[0].policy_compliant)  // → true
console.log(result[1].policy_compliant)  // → false
```

---

### T6 — create_booking
**Duração:** 45 min | **Depende de:** T1 | **Paralelo com:** T4, T5 | **Owner:** Dev C

Arquivo: `src/tools/createBooking.ts`

```typescript
import { CreateBookingInput, BookingConfirmation } from '../types'

export function createBooking(input: CreateBookingInput): BookingConfirmation { ... }
```

**Done when:**
```typescript
const result = createBooking({ session_id: "abc", flight_id: "f001", hotel_id: "h001" })
console.log(result.status)              // → "confirmed"
console.log(result.booking_id)          // → "ONF-XXXXXX" (formato)
console.log(typeof result.total_cost)   // → "number"
```

---

## F3 — Integração (04:00–06:30) — SEQUENCIAL

### T7 — SSE endpoint
**Duração:** 45 min | **Depende de:** T3, T4, T5, T6 | **Owner:** Dev F1

Arquivo: `src/routes/chat.ts`

```typescript
import { ChatRequest, SSEEvent } from '../types'

router.post('/api/chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  const { sessionId, message }: ChatRequest = req.body
  // ...
})
```

**Done when:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Preciso ir a SP terça"}' \
  --no-buffer
# → linhas "data: {...}" aparecem progressivamente
# → última linha: data: {"type":"done"}
```

---

### T8 — React Chat UI
**Duração:** 60 min | **Depende de:** T7 | **Owner:** Dev UI

Componentes: `ChatWindow`, `MessageList`, `MessageBubble`, `InputBar`

**Done when:**
- Mensagem enviada → resposta aparece em streaming (palavras chegando uma a uma)
- Sessão persiste entre mensagens (mesmo `sessionId`)
- Sem erros no console do browser

---

### T9 — End-to-end
**Duração:** 45 min | **Depende de:** T8 | **Owner:** Time completo

**Done when:** fluxo completo sem intervenção:
1. `"Preciso ir a SP terça"` → agente pede confirmação de parâmetros
2. Confirmação → 3 voos aparecem
3. `"o mais barato"` → hotel buscado automaticamente
4. `"o Ibis"` → resumo apresentado
5. `"sim"` → `booking_id` no formato `ONF-XXXXXX` exibido

---

## F4 — Polimento (06:30–08:00) — PARALELO

### T10 — UX polish | **Owner:** Dev UI
- [ ] Cores Onfly: azul `#0066CC`
- [ ] Loading state + indicador "digitando..."
- [ ] Mensagem de boas-vindas automática

### T11 — Landing page | **Owner:** Dev B
- [ ] Título, antes/depois, stats, CTA para o chat

### T12 — Ensaio do demo | **Owner:** Time completo
- [ ] Script completo em `ops/demo-script.md` — ensaiar 2x sem erro

---

## Riscos e contingências

| Risco | Mitigação |
|---|---|
| API Onfly não disponível | Mocks em T4/T5/T6 — demo funciona igual |
| SSE com problema | Fallback: polling a cada 500ms |
| Streaming lento | Reduzir `max_tokens` ou trocar para `claude-haiku-4-5` no demo |
| Erro ao vivo | Sessão pré-aquecida como backup |
