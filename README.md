# Travel Assistant — Onfly

Agente conversacional com IA que permite reservar viagens corporativas (voos + hotéis) via linguagem natural, integrado à plataforma Onfly.

> Hackathon Onfly Tech — 100% IA | 8 de Abril de 2026

---

## O problema

Reservar uma viagem corporativa na Onfly requer navegar por menus, preencher formulários com múltiplos campos, selecionar entre 1.344 centros de custo e 276 tags. O processo envolve muitos cliques e conhecimento da plataforma.

## A solução

Um agente conversacional onde o usuário diz:

```
"Preciso de um voo de BH para SP dia 22/04, volta dia 24"
```

E o agente busca voos, apresenta opções, busca hotel, mostra resumo e confirma a reserva — tudo via chat.

---

## Como funciona

### Fluxo de reserva

```
Usuário envia mensagem
       │
       ▼
  Claude API (LLM)
  Interpreta a intenção do usuário
       │
       ▼
  Tool Use ─────────────────────────┐
       │                            │
       ├── search_flights ──► Busca voos (mock / API Onfly)
       ├── search_hotels  ──► Busca hotéis (mock / API Onfly)
       └── create_booking ──► Cria reserva (mock / API Onfly)
       │
       ▼
  Resposta formatada via streaming (SSE)
       │
       ▼
  Frontend renderiza em tempo real
```

### Etapas da conversa

1. Usuário informa destino, datas e origem
2. Agente busca e apresenta opções de **voo**
3. Usuário seleciona um voo
4. Agente pergunta sobre **hotel**
5. Usuário seleciona hotel (ou pula)
6. Agente mostra **resumo** com valores totais
7. Usuário **confirma** a reserva

O usuário pode retomar uma conversa incompleta — se já selecionou o voo, o agente sugere continuar com o hotel.

---

## Arquitetura

```
hackathon/
├── backend/                          # API Node.js + Express
│   ├── src/
│   │   ├── config.ts                 # Variáveis de ambiente
│   │   ├── index.ts                  # Server entry point
│   │   ├── routes/
│   │   │   └── chat.ts              # POST /api/chat (SSE streaming)
│   │   ├── services/
│   │   │   ├── agent.ts             # Claude API + tool use loop
│   │   │   └── session.ts           # Session store (in-memory)
│   │   └── tools/
│   │       ├── index.ts             # Tool registry + executor
│   │       ├── flights.ts           # search_flights (mock)
│   │       ├── hotels.ts            # search_hotels (mock)
│   │       └── booking.ts           # create_booking (mock)
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                         # React + Vite
│   ├── src/
│   │   ├── main.tsx                 # Entry point
│   │   ├── App.tsx                  # Chat application
│   │   ├── api.ts                   # SSE client
│   │   ├── types.ts                 # TypeScript types
│   │   ├── styles.css               # Global styles
│   │   └── components/
│   │       ├── Header.tsx           # Header com stepper de progresso
│   │       ├── MessageBubble.tsx    # Bolha de mensagem (user/assistant)
│   │       ├── InputBar.tsx         # Campo de input + botão enviar
│   │       └── ToolStatus.tsx       # Indicador de loading das tools
│   ├── public/
│   │   ├── widget.js               # Widget embedável (standalone)
│   │   └── widget-demo.html        # Página de demo do widget
│   ├── index.html
│   ├── vite.config.ts
│   ├── .env.example
│   └── package.json
│
├── .context/                         # Documentação estratégica do hackathon
├── CLAUDE.md                         # Instruções para Claude Code
└── README.md
```

---

## Stack técnica

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| **LLM** | Claude API (Anthropic) | Tool use nativo, streaming, português fluente |
| **Backend** | Node.js 22 + TypeScript + Express | SSE streaming, tipagem forte |
| **Frontend** | React 19 + Vite + CSS Modules | Componentes isolados, hot reload |
| **Comunicação** | Server-Sent Events (SSE) | Streaming unidirecional do servidor, mais simples que WebSocket |
| **Sessão** | In-memory (Map) | Suficiente para MVP, migrável para Redis |

---

## Setup local

### Pré-requisitos

- Node.js 22+
- API key do Anthropic ([console.anthropic.com](https://console.anthropic.com))

### Backend

```bash
cd backend
cp .env.example .env
# Edite .env e configure ANTHROPIC_API_KEY
npm install
npm run dev
# Roda em http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Roda em http://localhost:5173
```

O Vite faz proxy de `/api/*` para o backend automaticamente.

### Variáveis de ambiente

**Backend** (`.env`):

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `ANTHROPIC_API_KEY` | Sim* | Chave da API Claude. Sem ela, usa agente mock |
| `PORT` | Não | Porta do servidor (padrão: 3001) |
| `CORS_ORIGINS` | Não | Origens permitidas, separadas por vírgula |
| `NODE_ENV` | Não | `development` ou `production` |

*Se `ANTHROPIC_API_KEY` não estiver definida, o sistema usa um agente mock com respostas inteligentes pré-programadas — útil para desenvolvimento e demo sem custo de API.

**Frontend** (`.env`):

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_API_URL` | Não | URL do backend (padrão: usa proxy do Vite em dev) |

---

## API

### `POST /api/chat`

Endpoint principal. Recebe mensagem do usuário e retorna streaming SSE.

**Request:**
```json
{
  "message": "Preciso de um voo de SP para RJ dia 20/04",
  "sessionId": "uuid-opcional"
}
```

**Response:** Stream de eventos SSE:

```
data: {"type":"session","sessionId":"uuid"}
data: {"type":"tool_start","tool":"search_flights"}
data: {"type":"tool_end","tool":"search_flights"}
data: {"type":"text","content":"Encontrei 4 voos..."}
data: {"type":"text","content":" de GRU para GIG"}
data: {"type":"done","trip":{"status":"searching_flight","origin":"GRU","destination":"GIG"}}
```

| Evento | Descrição |
|--------|-----------|
| `session` | ID da sessão (salvar para retomada) |
| `text` | Chunk de texto da resposta (streaming) |
| `tool_start` | Início da execução de uma tool |
| `tool_end` | Fim da execução de uma tool |
| `done` | Resposta completa + estado da viagem |
| `error` | Erro no processamento |

### `GET /api/session/:id`

Retorna o estado de uma sessão.

### `GET /health`

Health check do servidor.

---

## Widget embedável

O chat pode ser inserido em **qualquer página** com uma tag script:

```html
<script
  src="https://seu-frontend.vercel.app/widget.js"
  data-api="https://seu-backend.railway.app"
></script>
```

Isso renderiza um botão flutuante (✈️) que abre o chat ao clicar.

### Atributos de configuração

| Atributo | Padrão | Descrição |
|----------|--------|-----------|
| `data-api` | `""` | URL do backend (obrigatório em produção) |
| `data-position` | `bottom-right` | Posição: `bottom-right` ou `bottom-left` |
| `data-title` | `Travel Assistant` | Título no header do chat |
| `data-subtitle` | `by Onfly` | Badge no header |
| `data-color` | `#0ea5e9` | Cor principal do widget |
| `data-z-index` | `99999` | z-index do widget |

### Demo local

```
http://localhost:5173/widget-demo.html
```

---

## Dados e integrações

### Estado atual: Mock

As tools retornam dados simulados:

- **Voos**: 4 opções fixas (LATAM, GOL, Azul) com preços aleatorizados
- **Hotéis**: 4 opções fixas (Ibis, Mercure, Holiday Inn, Novotel) com preços aleatorizados
- **Cidades**: ~20 cidades brasileiras mapeadas para código IATA (hardcoded)
- **Reserva**: Gera um ID de booking simulado

Nenhuma busca na internet é feita pelas tools. O Claude API é usado apenas para interpretar linguagem natural e orquestrar as tools.

### Próximo passo: API real da Onfly

Os arquivos de tools (`backend/src/tools/flights.ts`, `hotels.ts`, `booking.ts`) são adapters — basta substituir a implementação mock pela chamada à API real da Onfly sem alterar o restante do sistema.

---

## Deploy

| Serviço | Plataforma | Diretório |
|---------|-----------|-----------|
| Frontend | Vercel | `frontend/` |
| Backend | Railway | `backend/` |

### Vercel (frontend)

1. Conecte o repo no Vercel
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`

### Railway (backend)

1. Conecte o repo no Railway
2. Root Directory: `backend`
3. Build Command: `npm run build`
4. Start Command: `npm start`
5. Configure variável `ANTHROPIC_API_KEY`
6. Configure `CORS_ORIGINS` com a URL do Vercel

Após deploy, atualize o `VITE_API_URL` no Vercel para apontar para a URL do Railway.

---

## Scripts

### Backend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor com hot reload (tsx watch) |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Roda o servidor compilado (produção) |

### Frontend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server com hot reload (Vite) |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build de produção |
