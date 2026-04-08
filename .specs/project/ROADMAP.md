# Roadmap — Hackathon 8h

> Data: 2026-04-08
> Critério de sucesso: demo funcionando ao vivo para os jurados

---

## Linha do tempo

```
00:00 ─── F1: Setup + Core  ────────────────────────────────────── 02:00
           Setup projeto, SessionStore, AgentService base

02:00 ─── F2: Tools (paralelo) ─────────────────────────────────── 04:00
           search_flights ┐
           search_hotels  ├── em paralelo por pessoas do time
           create_booking ┘

04:00 ─── F3: Integração ──────────────────────────────────────── 06:30
           SSE endpoint → React UI → integração end-to-end

06:30 ─── F4: Polimento + Landing ─────────────────────────────── 08:00
           UX polish, landing page, ensaio demo
```

---

## F1 — Setup + Core (00:00–02:00) — SEQUENCIAL

| Tarefa | Responsável | Entrega |
|---|---|---|
| T1: Scaffolding do projeto | Dev 1 | `package.json`, `tsconfig.json`, estrutura de pastas |
| T2: SessionStore in-memory | Dev 1 | `src/store/SessionStore.ts` — CRUD de sessões |
| T3: AgentService base | Dev 2 | `src/agent/AgentService.ts` — tool use loop sem tools reais |

**Dependências:** T2 antes de T3. T1 antes de T2 e T3.

---

## F2 — Tools (02:00–04:00) — PARALELO

| Tarefa | Responsável | Entrega |
|---|---|---|
| T4: search_flights | Dev 1 | `src/tools/searchFlights.ts` — retorna array de FlightOption |
| T5: search_hotels | Dev 2 | `src/tools/searchHotels.ts` — retorna array de HotelOption |
| T6: create_booking | Dev 3 | `src/tools/createBooking.ts` — confirma e retorna número |

**Mocks:** usar dados estáticos realistas se API Onfly não estiver disponível.

**Saída esperada por tool:**

```typescript
// search_flights retorna:
FlightOption[] = [
  { id, airline, flight_number, departure, arrival, price, available_seats, policy_compliant }
]

// search_hotels retorna:
HotelOption[] = [
  { id, name, stars, price_per_night, address, policy_compliant }
]

// create_booking retorna:
BookingConfirmation = { booking_id, status: 'confirmed', details }
```

---

## F3 — Integração (04:00–06:30) — SEQUENCIAL

| Tarefa | Dependências | Entrega |
|---|---|---|
| T7: SSE endpoint | T3 + T4 + T5 + T6 | `POST /api/chat` → streaming via SSE |
| T8: React Chat UI | T7 | Componente de chat com streaming visível |
| T9: End-to-end | T8 | Fluxo completo: mensagem → tool calls → resposta streamada |

---

## F4 — Polimento + Landing (06:30–08:00) — PARALELO

| Tarefa | Responsável | Entrega |
|---|---|---|
| T10: UX polish | Dev UI | CSS/estilos do chat, loading states, mensagens de erro |
| T11: Landing page | Dev 2 | One-pager com pitch: problema, solução, stats |
| T12: Ensaio demo | Time completo | Script de demo de 3 minutos ensaiado 2x |

---

## MVP mínimo aceitável (se o tempo apertar)

Priorizar na ordem:

1. ✅ Tool `search_flights` funcionando e retornando opções
2. ✅ Claude apresentando opções ao viajante em linguagem natural
3. ✅ Viajante seleciona → Claude confirma booking (mesmo que hotel seja pulado)
4. ✅ SSE streaming visível na tela
5. ⭕ Tool `search_hotels` (bônus)
6. ⭕ Retomada de sessão (bônus)
7. ⭕ Landing page (bônus)

---

## Pendências críticas

- [ ] Documentação da API Onfly (Postman) — usar mocks até receber
- [ ] Definir quais endpoints da API Onfly estão disponíveis
- [ ] Testar fluxo end-to-end antes do pitch
- [ ] Preparar dataset de mock realista (3 voos, 3 hotéis por rota de demo)
