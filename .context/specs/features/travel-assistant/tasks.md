# Travel Assistant — Task Breakdown

> Plano de execução para as 8h do hackathon.
> Status: [ ] pendente | [→] em andamento | [✓] concluído

---

## F1 — Setup + Core (00:00–02:00)

### T1 — Scaffolding do projeto
**Duração:** 30 min | **Depende de:** nada | **Paralelo com:** nada

```bash
# Estrutura a criar:
mkdir -p src/{agent,tools,store,routes,types}
# package.json com: express, @anthropic-ai/sdk, typescript, cors, uuid
# tsconfig.json
# .env com ANTHROPIC_API_KEY
```

**Entregável:** projeto compilando com `npm run dev`

---

### T2 — SessionStore
**Duração:** 30 min | **Depende de:** T1 | **Paralelo com:** nada

Arquivo: `src/store/SessionStore.ts`

```typescript
// Interface mínima:
class SessionStore {
  create(id?: string): Session
  get(id: string): Session | undefined
  update(id: string, trip: Partial<TripState>): void
  addMessage(id: string, message: Message): void
}
```

**Entregável:** SessionStore funcional com testes manuais via console

---

### T3 — AgentService base
**Duração:** 60 min | **Depende de:** T1, T2 | **Paralelo com:** nada

Arquivo: `src/agent/AgentService.ts`

```typescript
// Loop principal:
async function run(session: Session, userMessage: string): AsyncIterable<string> {
  // 1. Adiciona mensagem do usuário ao histórico
  // 2. Chama Claude com tool_use + streaming
  // 3. Se tool_use → executa tool → adiciona resultado → continua loop
  // 4. Faz yield do texto gerado
}
```

**Entregável:** AgentService respondendo em texto sem tools ainda

---

## F2 — Tools (02:00–04:00) — PARALELO

### T4 — search_flights
**Duração:** 60 min | **Depende de:** T1 | **Paralelo com:** T5, T6

Arquivo: `src/tools/searchFlights.ts`

Mock data (3 voos para rota GRU→CGH):
```typescript
const mockFlights = [
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

---

### T5 — search_hotels
**Duração:** 60 min | **Depende de:** T1 | **Paralelo com:** T4, T6

Arquivo: `src/tools/searchHotels.ts`

Mock data (3 hotéis em SP):
```typescript
const mockHotels = [
  { id: "h001", name: "Ibis Paulista", stars: 3,
    price_per_night: 220, address: "Av. Paulista, 2355",
    policy_compliant: true },
  { id: "h002", name: "Pullman São Paulo Ibirapuera", stars: 5,
    price_per_night: 680, address: "Av. Ibirapuera, 2534",
    policy_compliant: false },
  { id: "h003", name: "Novotel São Paulo Jaraguá", stars: 4,
    price_per_night: 380, address: "Rua Martins Fontes, 71",
    policy_compliant: true }
]
```

---

### T6 — create_booking
**Duração:** 45 min | **Depende de:** T1 | **Paralelo com:** T4, T5

Arquivo: `src/tools/createBooking.ts`

```typescript
// Gera número de booking realista e retorna confirmação
function createBooking(params: CreateBookingInput): BookingConfirmation {
  const bookingId = `ONF-${Date.now().toString(36).toUpperCase()}`
  return { booking_id: bookingId, status: 'confirmed', ... }
}
```

---

## F3 — Integração (04:00–06:30) — SEQUENCIAL

### T7 — SSE endpoint
**Duração:** 45 min | **Depende de:** T3, T4, T5, T6

Arquivo: `src/routes/chat.ts`

```typescript
router.post('/api/chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  
  const { sessionId, message } = req.body
  const session = sessionStore.getOrCreate(sessionId)
  
  for await (const chunk of agentService.run(session, message)) {
    res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
  }
  
  res.write('data: {"type":"done"}\n\n')
  res.end()
})
```

---

### T8 — React Chat UI
**Duração:** 60 min | **Depende de:** T7

Componentes mínimos:
- `ChatWindow` — container principal
- `MessageList` — lista de mensagens com suporte a streaming
- `MessageBubble` — bolha de mensagem (viajante / agente)
- `InputBar` — campo de texto + botão enviar

```typescript
// Hook de streaming:
async function sendMessage(text: string) {
  const response = await fetch('/api/chat', { method: 'POST', body: ... })
  const reader = response.body.getReader()
  // lê chunks e atualiza estado da mensagem em andamento
}
```

---

### T9 — End-to-end e testes
**Duração:** 45 min | **Depende de:** T8

- [ ] Testar fluxo completo: "Preciso ir a SP terça" → voo → hotel → confirmação
- [ ] Testar edge cases: datas ambíguas, viajante muda de ideia
- [ ] Testar retomada de sessão com sessionId existente
- [ ] Garantir que streaming aparece em tempo real na UI

---

## F4 — Polimento (06:30–08:00) — PARALELO

### T10 — UX polish
- [ ] Estilo visual do chat (cores Onfly: azul #0066CC)
- [ ] Loading state enquanto agente responde
- [ ] Indicador "digitando..." com dots animados
- [ ] Mensagem de boas-vindas automática ao iniciar

### T11 — Landing page
- [ ] Título: "Onfly Copilot — Reserve com uma mensagem"
- [ ] Problema (antes) vs. Solução (depois)
- [ ] Stats: "30 segundos. Zero formulário."
- [ ] CTA para o chat

### T12 — Ensaio do demo
Script de 3 minutos:
1. Abrir chat
2. Digitar: "Preciso ir a São Paulo na terça-feira 15/04 e voltar quinta 17/04"
3. Agente confirma e busca voos
4. Selecionar: "o mais barato que esteja dentro da política"
5. Agente busca hotel automaticamente
6. Selecionar: "o Ibis"
7. Confirmar: "sim, pode confirmar"
8. Mostrar número de reserva

---

## Riscos e contingências

| Risco | Mitigação |
|---|---|
| API Onfly não disponível | Mocks prontos em T4/T5/T6 — demo funciona igual |
| SSE não funciona no ambiente | Fallback: polling a cada 500ms |
| Streaming com latência alta | Reduzir max_tokens ou usar haiku para demo |
| Erro ao vivo no demo | Ter sessão pré-aquecida com conversa já iniciada como backup |
