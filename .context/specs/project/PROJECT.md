# Onfly Copilot v3 — Project Vision

> Hackathon Onfly Tech 100% IA | 2026-04-08
> Stack: Node.js + TypeScript + Claude API + React + Express + SSE

---

## O que é

Agente conversacional que **executa reservas corporativas completas** via chat.

O viajante digita em linguagem natural. O agente busca, valida contra a política da empresa, apresenta opções e confirma a reserva — sem abrir a plataforma.

---

## O que não é

- Não é o Agente de Suporte atual (responde dúvidas, não reserva)
- Não é um chatbot de FAQ
- Não é uma melhoria de UX da plataforma existente

---

## Problema que resolve

```
ANTES: Viajante acessa plataforma → pesquisa voos → filtra por política →
       seleciona hotel → preenche formulário → confirma → 5-10 minutos

DEPOIS: "Preciso ir a SP terça e voltar quinta" → agente busca, valida,
        propõe opções → viajante diz "ok" → reservado → 30 segundos
```

---

## Fluxo completo

```
1. Viajante inicia chat com intenção de viagem
2. Agente extrai: origem, destino, datas, passageiros
3. Agente busca voos (tool: search_flights)
4. Agente apresenta opções dentro da política
5. Viajante seleciona ou pede alternativas
6. Agente busca hotéis no destino (tool: search_hotels)
7. Viajante seleciona hotel
8. Agente confirma booking completo (tool: create_booking)
9. Confirmação com número de reserva
10. Sessão salva — viajante pode retomar conversa
```

---

## Scopo do hackathon (8h)

### IN — deve funcionar no demo

- [ ] Chat em linguagem natural PT-BR
- [ ] Extração de parâmetros de viagem
- [ ] Busca de voos (mock da API Onfly)
- [ ] Busca de hotéis (mock)
- [ ] Confirmação de booking (mock)
- [ ] SSE para streaming de resposta
- [ ] Retomada de sessão

### OUT — não entra neste MVP

- API Onfly real (usar mocks até receber credenciais)
- Autenticação de usuário
- Integração com WhatsApp
- Validação de política da empresa (simplificar)
- Multi-idioma
- Mobile-first UI

---

## Stack técnica

```
Frontend:  React + TypeScript
           └── Chat UI com streaming via SSE
           └── Página standalone (sem integração com plataforma)

Backend:   Express + TypeScript
           └── POST /api/chat → SSE stream
           └── SessionStore: in-memory Map<string, Session>
           └── AgentService: tool use loop com Claude API

AI:        Anthropic SDK (claude-sonnet-4-6)
           └── Tool use: search_flights, search_hotels, create_booking
           └── System prompt com contexto de viagens corporativas
```

---

## Interface da Session

```typescript
interface Session {
  id: string
  messages: Message[]
  trip: {
    status: 'idle' | 'searching_flights' | 'searching_hotels' | 'confirming' | 'booked'
    flight?: FlightOption
    hotel?: HotelOption
    origin?: string
    destination?: string
    dates?: { departure: string; return?: string }
    passengers?: number
  }
}
```

---

## Definição das Tools

```typescript
search_flights: {
  origin: string        // IATA code (ex: "GRU")
  destination: string   // IATA code (ex: "CGH")
  departure_date: string // YYYY-MM-DD
  return_date?: string  // YYYY-MM-DD (opcional para ida e volta)
  passengers: number
}

search_hotels: {
  city: string          // destino em texto (ex: "São Paulo")
  checkin: string       // YYYY-MM-DD
  checkout: string      // YYYY-MM-DD
  guests: number
}

create_booking: {
  session_id: string
  flight_id?: string    // ID retornado pelo search_flights
  hotel_id?: string     // ID retornado pelo search_hotels
}
```

---

## Critérios de sucesso para o demo

1. Viajante diz "Preciso ir a SP terça" → agente confirma parâmetros
2. Agente apresenta 3 opções de voo dentro da política
3. Viajante escolhe → agente busca hotel automaticamente
4. Booking confirmado com número de reserva em < 60 segundos de conversa
5. Streaming visível na tela (palavras aparecendo em tempo real)
