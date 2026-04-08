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

## Deploy

- **Frontend**: Vercel (auto-deploy from `frontend/`)
- **Backend**: Railway (auto-deploy from `backend/`)

## Stack

- **LLM**: Claude API (Anthropic) com tool use
- **Backend**: Node.js 22, TypeScript, Express, SSE
- **Frontend**: React 19, Vite, CSS Modules
