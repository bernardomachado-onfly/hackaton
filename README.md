# Hackathon Onfly Tech 100% IA

> Última atualização: 2026-04-08

Repositório do time para o Hackathon Onfly — 100% IA.

---

## Status atual

**Fase:** Desenvolvimento
**Ideia selecionada:** Onfly Copilot v3 — agente conversacional de reservas
**Stack:** Node.js + TypeScript + Claude API + React + Express + SSE

---

## Arquitetura

```
├── backend/          # API Express + Claude AI
│   ├── src/
│   │   ├── config.ts    # Configurações e variáveis de ambiente
│   │   ├── routes/      # Endpoints HTTP (SSE streaming)
│   │   ├── services/    # Agent service + Session store
│   │   └── tools/       # Flight search, Hotel search, Booking
│   └── package.json
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── components/  # Header, MessageBubble, InputBar, ToolStatus
│   │   ├── App.tsx      # Main chat application
│   │   └── api.ts       # SSE client
│   └── package.json
```

## Setup local

```bash
# Backend
cd backend
cp .env.example .env  # Configure ANTHROPIC_API_KEY
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Widget embedável

O chat pode ser inserido em qualquer página existente com uma linha:

```html
<script src="https://seu-frontend.vercel.app/widget.js" data-api="https://seu-backend.railway.app"></script>
```

### Atributos opcionais

| Atributo | Padrão | Descrição |
|----------|--------|-----------|
| `data-api` | `""` | URL do backend |
| `data-position` | `bottom-right` | Posição do botão (`bottom-right` ou `bottom-left`) |
| `data-title` | `Travel Assistant` | Título no header do chat |
| `data-subtitle` | `by Onfly` | Badge no header |
| `data-color` | `#0ea5e9` | Cor principal |

### Demo local

Acesse `http://localhost:5173/widget-demo.html` para testar o widget em uma página de exemplo.

## Deploy

- **Frontend**: Vercel (auto-deploy from `frontend/`)
- **Backend**: Railway (auto-deploy from `backend/`)

## Stack

- **LLM**: Claude API (Anthropic) com tool use
- **Backend**: Node.js 22, TypeScript, Express, SSE
- **Frontend**: React 19, Vite, CSS Modules
