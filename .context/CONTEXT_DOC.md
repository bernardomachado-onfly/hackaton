# Documentação dos Contextos — Hackathon Onfly

> Índice e guia de uso de todos os arquivos de contexto.
> Leia este arquivo para entender a estrutura antes de navegar.

---

## Como usar em novas sessões

**Forma mais simples:** Cole o system prompt de `.context/prompts/meta-prompt.md` no início da sessão.

**Forma completa:** Leia `.context/MASTER.md` — contém todo o contexto em formato XML otimizado para IA.

---

## Estrutura

```
.context/
├── MASTER.md              ← ENTRY POINT — ler primeiro em qualquer sessão
│
├── deep/                  ← contexto profundo (detalhes, histórico, análises)
│   ├── empresa.md         ← stack atual Onfly + lista do que NÃO repetir
│   ├── concorrentes.md    ← análise competitiva BR/MX/global
│   ├── jurados.md         ← psicologia dos 3 fundadores + argumentos por jurado
│   ├── ideias.md          ← ranking completo (rodadas 1 e 2) com análise
│   └── recomendacao.md    ← relatório final + narrativa de pitch
│
├── ops/                   ← operacional da sessão atual
│   ├── estado-atual.md    ← FONTE DA VERDADE — decisões, status, pendências
│   ├── plataforma.md      ← observações diretas da plataforma + feedback monitor
│   └── context-mgmt.md    ← protocolo de atualização de contextos
│
├── prompts/               ← prompts prontos para uso
│   ├── meta-prompt.md     ← system prompt completo para novas sessões
│   └── eng-prompt.md      ← boas práticas de prompt engineering (Anthropic)
│
├── _source/               ← IMUTÁVEL — documentos originais
│   ├── arch-v2.md
│   └── ARCHITECTURE.md
└── specs/                 ← especificações técnicas do produto
├── project/
│   ├── PROJECT.md         ← visão, escopo, stack, critérios de sucesso
│   └── ROADMAP.md         ← linha do tempo das 8h com tarefas
└── features/
    └── travel-assistant/
        ├── spec.md        ← user stories P1/P2 + edge cases
        ├── design.md      ← arquitetura, data models, tool definitions, SSE
        └── tasks.md       ← task breakdown com código inicial + riscos
```

---

## Índice de arquivos — o que encontrar onde

| Preciso de... | Arquivo |
|---|---|
| Contexto completo para nova sessão | `.context/MASTER.md` |
| Status atual do projeto | `.context/ops/estado-atual.md` |
| System prompt pronto | `.context/prompts/meta-prompt.md` |
| O que a Onfly já tem (não repetir) | `.context/deep/empresa.md` |
| Análise de concorrentes | `.context/deep/concorrentes.md` |
| Argumentos por jurado | `.context/deep/jurados.md` |
| Ranking de ideias | `.context/deep/ideias.md` |
| Narrativa de pitch | `.context/deep/recomendacao.md` |
| Observações da plataforma | `.context/ops/plataforma.md` |
| Feedback do monitor | `.context/ops/plataforma.md` |
| Arquitetura técnica | `.context/specs/features/travel-assistant/design.md` |
| Tasks com código | `.context/specs/features/travel-assistant/tasks.md` |
| User stories | `.context/specs/features/travel-assistant/spec.md` |
| Boas práticas de prompt | `.context/prompts/eng-prompt.md` |

---

## Hierarquia de autoridade

Quando houver conflito entre arquivos:

1. `.context/ops/estado-atual.md` — DECISÕES (o que foi decidido)
2. `.context/MASTER.md` — CONTEXTO (o que é verdade)
3. `.context/specs/` — IMPLEMENTAÇÃO (como fazer)
4. `.context/deep/` — REFERÊNCIA (detalhes e histórico)

---

## Protocolo de atualização

Ver `.context/ops/context-mgmt.md` para regras completas.

Resumo:
- A cada decisão importante → atualizar `ops/estado-atual.md`
- A cada feature implementada → atualizar `deep/empresa.md` + `ops/estado-atual.md` + `README.md`
- `_source/` nunca é editado — apenas leitura
