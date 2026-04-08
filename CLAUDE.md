# Hackathon Onfly — Instruções para Claude

> Este arquivo é lido automaticamente pelo Claude Code em toda sessão.

---

## Primeiro passo obrigatório

Antes de qualquer tarefa, leia:

1. `.context/MASTER.md` — contexto completo em XML (empresa, ideia, jurados, stack)
2. `.context/ops/estado-atual.md` — decisões tomadas e status atual

---

## Contexto do projeto

**Hackathon Onfly Tech 100% IA** — 8 horas, produto funcional + demo ao vivo.

**Ideia selecionada:** Onfly Copilot v3 — agente conversacional que executa reservas
corporativas completas via chat (aéreo → hotel → confirmação).

**Stack:** Node.js + TypeScript + Claude API (claude-sonnet-4-6) + React + Express + SSE

**Specs técnicas:** `.context/specs/` — PROJECT.md, ROADMAP.md, spec, design, tasks.

---

## Diretrizes obrigatórias

- **IA é obrigatória** — toda implementação deve ter componente de IA explícito
- **Não repetir** o que a Onfly já tem em produção (lista em `.context/deep/empresa.md`)
- **MVP em 8h** — sem overengineering, sem features especulativas
- **Demo ao vivo é o critério** — o que não funciona ao vivo não conta
- Antes de implementar qualquer coisa, verificar se não existe já na plataforma

## Diretrizes de código

- TypeScript strict em todo o projeto
- Mocks realistas quando API Onfly não estiver disponível
- SSE para streaming (não WebSocket — mais simples para demo)
- SessionStore in-memory (sem banco de dados no hackathon)

## Atualizar contexto ao longo do trabalho

- A cada feature implementada → atualizar `.context/ops/estado-atual.md`
- A cada decisão importante → registrar em `.context/ops/estado-atual.md`
- Protocolo completo em `.context/ops/context-mgmt.md`

---

## Navegação rápida

| Preciso de... | Arquivo |
|---|---|
| Contexto completo | `.context/MASTER.md` |
| Status atual | `.context/ops/estado-atual.md` |
| Arquitetura técnica | `.context/specs/features/travel-assistant/design.md` |
| Tasks com código inicial | `.context/specs/features/travel-assistant/tasks.md` |
| Linha do tempo 8h | `.context/specs/project/ROADMAP.md` |
| Argumentos por jurado | `.context/deep/jurados.md` |
| O que não repetir | `.context/deep/empresa.md` |
