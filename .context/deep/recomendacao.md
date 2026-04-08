# Recomendação Técnica — Relatório Final

> Análise estratégica completa. Gerado em 2026-04-08.
> Base: observação direta da plataforma + feedback do monitor + análise competitiva.

---

## Sumário executivo

O contexto completo converge para uma conclusão: **as melhores apostas estão no expense management, não em booking**. A plataforma tem buraco operacional evidente: criação de despesas 100% manual, dashboard passivo, aprovações binárias. O monitor confirmou que expense ganha pontos. A VOLL tem R$700M e agentes de IA no ar — o diferencial precisa ser no mid-market.

**Time selecionou: Onfly Copilot v3** — com consciência das ressalvas de originalidade e narrativa clara.

---

## A decisão de pitch para o Copilot

### Narrativa correta

```
NÃO DIZER: "Temos uma ideia nova de agente de reservas."
DIZER:      "A v2 falhou porque os LLMs não eram bons o suficiente.
             Agora com Claude, finalmente funciona."
```

### Por que ainda compete

1. Interesse estratégico do negócio é extremo — negócio quer isso
2. Onfly já tem todos os ativos: APIs booking, Agente de Suporte, dados 3.200+ empresas
3. Nenhum player BR tem booking conversacional end-to-end — gap real de mercado
4. VOLL automatiza, mas não conversa — diferencial direto

---

## Argumentos por jurado (Copilot v3)

| Jurado | Argumento principal |
|---|---|
| **Marcelo (CEO)** | Demo ao vivo no chat: "Preciso ir a SP terça" → voo reservado em 30s. Código real. |
| **Elvis (Comercial)** | "A VOLL tem agentes. Nenhum player BR tem booking conversacional. Esse é o diferencial." |
| **Elvimar (CFO)** | "Viajante economiza X min/reserva × Y reservas/mês × 3.200 empresas = R$Z/mês em produtividade." |

---

## Posicionamento competitivo

```
HOJE:         "A Onfly é onde você reserva viagens e registra despesas."
              → Reativo. Operacional.

COM COPILOT:  "A Onfly é o sistema onde você conversa e a reserva acontece."
              → Conversacional. Instantâneo. Sem atrito.
```

**Q&A preparado:**

| Pergunta | Resposta |
|---|---|
| "E a VOLL?" | "VOLL automatiza tarefas. Onfly conversa — nenhum player BR faz booking por chat end-to-end." |
| "Isso não deu errado antes?" | "A v2 falhou porque o modelo não entendia contexto. LLMs de 2026 resolvem exatamente isso." |
| "Qual o ROI?" | "8 min/reserva × 50 reservas/mês × 800 colaboradores = X horas. Custo hora × X = R$ em produtividade." |
| "Por que não Policy Audit?" | "Copilot é o diferencial de produto que ninguém tem no BR. Expense pode ser v2 embarcada." |

---

## Ideias recomendadas (não selecionadas — referência)

### Policy Audit Agent (42/50) — recomendação técnica original

- Audita despesas em tempo real antes da aprovação
- Score de risco na fila de aprovações
- Insights proativos no dashboard passivo
- Diferenciação clara do Trust Expense: prevenção vs. auditoria
- Elvimar: 10/10 — "ROI direto e mensurável"

### Onfly Zero (44/50) — maior score geral

- Foto do recibo no WhatsApp → despesa aprovada em 30s
- Zero app, zero formulário, zero esforço
- WhatsApp = 99% penetração no Brasil
- Demo ao vivo com celular irresistível para Marcelo

### Combinação ótima (não implementada)

Onfly Zero + Policy Audit Agent = jornada completa sem toque humano:
> "Do recibo na mão até a aprovação: 45 segundos."

---

## Ideias descartadas

| Ideia | Por que descartada |
|---|---|
| Smart Rebooking | VOLL já tem AirSave — Onfly estaria seguindo, não diferenciando |
| Carbon Travel | ROI indireto, CO2 difícil de transformar em R$ para Elvimar |
| Buscador de Preço | Onfly já tem multi-broker — ganho marginal |
| Assistente de Onboarding | Já tem cards de orientação na home |
| API de Riscos | Duty of Care já existe na plataforma |
| Marketplace de Mini-Apps | Ambicioso demais para 8h |
