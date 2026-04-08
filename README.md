# Hackathon Onfly Tech 100% IA

> Última atualização: 2026-04-08

Repositório do time para o Hackathon Onfly — 100% IA.

---

## Status atual

**Fase:** Desenvolvimento
**Ideia selecionada:** Onfly Copilot v3 — agente conversacional de reservas
**Stack:** Node.js + TypeScript + Claude API + React + Express + SSE
**Próximo passo:** Implementar AgentService + Tools conforme `.specs/`

---

## Ideia principal

**Onfly Copilot v3** — agente conversacional que executa reservas corporativas completas via chat.

```
"Preciso ir a SP terça e voltar quinta"
→ agente busca voos, apresenta opções, busca hotel, confirma booking
→ Do zero à reserva: 30 segundos. Sem formulário, sem navegação.
```

**Narrativa de pitch:**
> "A v2 falhou porque os LLMs não eram bons o suficiente. Agora com Claude, finalmente funciona."

**Gap competitivo:** nenhum player mid-market BR tem booking conversacional end-to-end.

---

## Implementado

| Feature | Data | Arquivos | Status |
|---|---|---|---|
| Contextos estratégicos | 2026-04-08 | `.context/` | ✅ Completo |
| Specs técnicas | 2026-04-08 | `.specs/` | ✅ Completo |

---

## Estrutura do repositório

```
hackathon/
├── README.md                       ← este arquivo
├── CONTEXT_DOC.md                  ← índice e guia dos contextos
├── .context/                       ← contexto estratégico completo
│   ├── MASTER.md                   ← entry point XML (ler primeiro)
│   ├── deep/                       ← análises profundas
│   │   ├── empresa.md              ← stack atual + o que não repetir
│   │   ├── concorrentes.md         ← análise BR/MX/global
│   │   ├── jurados.md              ← psicologia dos 3 fundadores
│   │   ├── ideias.md               ← ranking completo rodadas 1 e 2
│   │   └── recomendacao.md         ← relatório final + pitch
│   ├── ops/                        ← operacional
│   │   ├── estado-atual.md         ← fonte da verdade corrente
│   │   ├── plataforma.md           ← observações + feedback monitor
│   │   └── context-mgmt.md        ← protocolo de atualização
│   ├── prompts/                    ← prompts prontos
│   │   ├── meta-prompt.md          ← system prompt para novas sessões
│   │   └── eng-prompt.md           ← boas práticas Anthropic
│   └── _source/                    ← documentos originais (imutável)
│       ├── arch-v2.md
│       └── ARCHITECTURE.md
├── .specs/                         ← especificações técnicas
│   ├── project/
│   │   ├── PROJECT.md              ← visão, escopo, stack
│   │   └── ROADMAP.md              ← linha do tempo 8h
│   └── features/
│       └── travel-assistant/
│           ├── spec.md             ← user stories P1/P2
│           ├── design.md           ← arquitetura, models, tools
│           └── tasks.md            ← tasks com código inicial
└── src/                            ← código (a implementar)
```

---

## Como iniciar o desenvolvimento

1. Ler `.specs/features/travel-assistant/tasks.md` — tasks com código inicial
2. Seguir a ordem do `.specs/project/ROADMAP.md`
3. Consultar `.specs/features/travel-assistant/design.md` para arquitetura

## Como usar o contexto em novas sessões

1. Abrir `.context/prompts/meta-prompt.md`
2. Cole o bloco `<system_prompt>` como system prompt
3. Ou simplesmente ler `.context/MASTER.md` (versão compacta XML)

---

## Jurados

| Jurado | Cargo | Argumento principal |
|---|---|---|
| **Marcelo Linhares** | CEO & Co-founder | Demo ao vivo no chat: reserva em 30s. Código real. |
| **Elvis Soares** | Dir. Comercial & Co-founder | "A VOLL não tem booking conversacional. Esse é o diferencial." |
| **Elvimar "Manzinho"** | Part Owner / CFO | "X min/reserva × Y reservas/mês × 3.200 empresas = R$Z em produtividade." |

---

## Contexto rápido

- **Onfly:** maior Travel Tech B2B da LATAM, 3.200+ clientes, R$240M Série B
- **Maior ameaça:** VOLL (R$700M Warburg Pincus, Smart Hub com agentes de IA)
- **Regra de ouro:** IA é obrigatória — sem IA = desclassificado
- **Não repetir:** Trust Expense, Agente de Suporte, Duty of Care, Flow Expense (já existem)
