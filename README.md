# Hackathon Onfly Tech 100% IA

> Última atualização: 2026-04-08

Repositório do time para o Hackathon Onfly — 100% IA.

---

## Status atual

**Fase:** Pré-desenvolvimento — contexto estratégico completo, MVP a definir
**Recomendação principal:** Policy Audit Agent + Onfly Zero (combinação)
**Próximo passo:** Definir MVP e iniciar implementação

---

## Ideia principal

**Policy Audit Agent + Onfly Zero**

O expense management da Onfly é 100% manual hoje. A combinação resolve a jornada completa:

- **Onfly Zero** — viajante tira foto do recibo no WhatsApp → agente extrai, categoriza e submete automaticamente. Zero app, zero formulário.
- **Policy Audit Agent** — agente audita a despesa em tempo real antes da aprovação, detecta violações de política, dá score de risco ao aprovador, transforma dashboard passivo em insights acionáveis.

```
Foto no WhatsApp → capturado → validado → aprovado
Do recibo à aprovação: ~45 segundos. Sem toque humano.
```

---

## Ideias rankeadas

| # | Ideia | Score | Status |
|---|---|---|---|
| 1 | Policy Audit Agent | 42/50 | Recomendada |
| 2 | Onfly Forecast | 41/50 | Recomendada (combo) |
| 3 | Onfly Zero | 44/50 | Recomendada |
| 4 | Onfly AutoConfig | 40/50 | Backup |
| 5 | Onfly Concilia | 38/50 | Backup |
| 6 | Onfly Copilot v3 | 38/50 | Ressalvas |
| 7 | Carbon Travel | 33/50 | Descartada |
| 8 | Smart Rebooking | 30/50 | Descartada (VOLL já tem) |

---

## Implementado

| Feature | Data | Arquivos | Status |
|---|---|---|---|
| — | — | — | Em planejamento |

---

## Estrutura do repositório

```
hackaton/
├── README.md                    ← este arquivo (sempre atualizado)
├── .context/                    ← contexto estratégico completo
│   ├── 00-estado-atual.md       ← fonte da verdade corrente
│   ├── 01-produto-onfly.md      ← o que a Onfly já tem (não repetir)
│   ├── 02-concorrentes.md       ← análise competitiva BR/MX/global
│   ├── 03-ideias.md             ← top 5 ideias com anotações
│   ├── 04-plataforma.md         ← observações da plataforma por dentro
│   ├── 05-monitor.md            ← feedback do monitor
│   ├── 06-perfil-socios.md      ← psicologia dos 3 jurados
│   ├── 07-novas-ideias.md       ← 3 novas ideias (rodada 2)
│   ├── 08-prompt-engineering.md ← boas práticas Anthropic
│   ├── 09-meta-prompt.md        ← meta-prompt para usar em sessões
│   ├── 10-context-management.md ← protocolo de atualização de contexto
│   ├── RELATORIO_FINAL_IDEIAS.md← relatório completo com scoring
│   └── _source/                 ← documentos originais (imutável)
│       ├── arch-v2.md
│       └── ARCHITECTURE.md
└── src/                         ← código (a criar)
```

---

## Como usar o contexto em novas sessões

1. Abra o arquivo `.context/09-meta-prompt.md`
2. Cole o bloco `<system_prompt>` no início da sessão com Claude
3. Qualquer prompt enviado depois será automaticamente contextualizado

---

## Jurados

| Jurado | Cargo | O que mais valoriza |
|---|---|---|
| **Marcelo Linhares** | CEO & Co-founder | Demo funcionando ao vivo, código real, elimina ineficiência |
| **Elvis Soares** | Dir. Comercial & Co-founder | Diferencial vs. VOLL, potencial de crescimento |
| **Elvimar "Manzinho"** | Part Owner / CFO | ROI mensurável, compliance, número financeiro concreto |

**Regra de ouro:** expense management ganha pontos. IA é obrigatória — sem IA = desclassificado.

---

## Contexto rápido

- **Onfly:** maior Travel Tech B2B da LATAM, 3.200+ clientes, R$240M Série B
- **Maior ameaça:** VOLL (R$700M Warburg Pincus, Smart Hub com agentes de IA)
- **Dor confirmada:** expense 100% manual, dashboard passivo, aprovações binárias
- **Não repetir:** Trust Expense, Agente de Suporte, Duty of Care, Flow Expense (já existem)
