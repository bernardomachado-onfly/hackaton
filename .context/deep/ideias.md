# Ideias do Hackathon — Ranking Completo

> Consolidado de arch-v2.md + anotações do monitor + análise competitiva + observações da plataforma.
> Rodada 1 (briefing original) + Rodada 2 (geradas em sessão).
> Última atualização: 2026-04-08

---

## Ranking geral

| # | Ideia | Score | Status |
|---|---|---|---|
| 1 | Onfly Zero | 44/50 | Recomendada (não selecionada) |
| 2 | Policy Audit Agent | 42/50 | Recomendada (não selecionada) |
| 3 | Onfly Forecast | 41/50 | Recomendada (não selecionada) |
| 4 | Onfly AutoConfig | 40/50 | Backup |
| 5 | **Onfly Copilot v3** | 38/50 | **🚀 SELECIONADA PARA DESENVOLVIMENTO** |
| 6 | Onfly Concilia | 38/50 | Backup |
| 7 | Carbon Travel | 33/50 | Diferencial futuro — ROI indireto |
| 8 | Smart Rebooking | 30/50 | ❌ VOLL já tem AirSave — evitar |

---

## RODADA 1 — Ideias do briefing original

### Ideia 1 — Policy Audit Agent (42/50)

**Conceito:** Agente que audita despesas em tempo real antes da aprovação, detecta anomalias e violações de política, corrige categorizações erradas nos 1.344 centros de custo, transforma dashboard passivo em alertas proativos, dá scoring de risco ao aprovador.

**Por que difere do Trust Expense:** Trust Expense audita despesas *já aprovadas* (passado). Policy Audit atua *antes da aprovação* (presente) e sugere ajustes sistêmicos na política (futuro).

**Por jurado:**
- Marcelo: Demo ao vivo com recibo real → flag de violação → score de risco
- Elvis: "Democratiza o ExpenseAudit da VOLL para mid-market"
- Elvimar: ROI direto — "X% das despesas violam política sem ser detectadas = R$ saindo sem rastreamento"

**Implementação 8h:** FastAPI + Claude API + mock JSON com despesas + políticas

---

### Ideia 2 — Onfly Forecast (41/50)

**Conceito:** Plataforma de previsão preditiva de orçamento de viagens. Usa dados históricos para projetar gastos por centro de custo nos próximos 30-90 dias, alerta sobre estouros antes que aconteçam.

**Narrativa:** "De reativo a preditivo" — Trust Expense olha o passado; Forecast olha o futuro.

**Por jurado:**
- Marcelo: Dados que já existem na plataforma, modelo preditivo simples, resultado visual imediato
- Elvis: Gestor financeiro usa Forecast na reunião de budget → Onfly vira ferramenta estratégica
- Elvimar: "Previsibilidade financeira é o sonho de qualquer CFO"

**Implementação 8h:** Python + modelo de forecast simples (média móvel) + dashboard HTML

---

### Ideia 3 — Onfly Copilot v3 (38/50) — 🚀 SELECIONADA

Ver `MASTER.md` seção `<selected_idea>` para spec completa e narrativa de pitch.

**Ressalvas críticas:**
- v2 falhou internamente — penalidade de originalidade confirmada pelo monitor
- Narrativa correta: "v2 falhou pq LLMs não eram bons o suficiente. v3 usa Claude — finalmente funciona."
- Interesse estratégico do negócio é extremo
- VOLL não tem booking conversacional end-to-end — gap real de mercado

---

### Ideia 4 — Carbon Travel (33/50)

**Conceito:** Calcular automaticamente pegada de carbono de cada viagem, sugerir alternativas sustentáveis, relatório ESG automático.

**Por que descartada como principal:** ROI indireto, difícil transformar CO2 em R$ para Elvimar, fontes de dados de emissões não especificadas. Diferencial futuro válido mas sem urgência imediata.

---

### Ideia 5 — Smart Rebooking (30/50) — EVITAR

**Por que evitar:** VOLL já tem AirSave. Coupa tem Travel Saver. Onfly estaria seguindo, não diferenciando. Elvis vai questionar diretamente.

**Salvação se necessário:** posicionar como "democratização para mid-market" — VOLL faz para enterprise.

---

## RODADA 2 — Novas ideias geradas (2026-04-08)

### Ideia 6 — Onfly Zero (44/50) — Maior score geral

**Conceito:** Expense sem app via WhatsApp. Viajante tira foto do recibo → agente extrai dados (OCR), identifica viagem ativa, categoriza, submete para aprovação. Aprovador recebe no WhatsApp e responde "sim". Do recibo à aprovação: 30 segundos.

**Por que difere do Flow Expense:** Flow automatiza o *workflow* de aprovação. Zero resolve o *momento de captura* — são camadas complementares.

**Por jurado:**
- Marcelo: Demo ao vivo com celular = sala em silêncio
- Elvis: "Experiência do viajante muda completamente. Diferencial direto vs. VOLL"
- Elvimar: Melhora qualidade dos dados → fechamento mais limpo

**Implementação 8h:** WhatsApp Business API (Twilio) + Claude Vision OCR + match de viagem ativa

---

### Ideia 7 — Onfly AutoConfig (40/50)

**Conceito:** IA que lê a estrutura organizacional (CSV/org chart) e gera automaticamente toda a configuração inicial: centros de custo, tags, políticas por nível, fluxo de aprovação. Admin revisa e aprova em vez de criar do zero.

**Dor:** 500+ empresas migraram da Argo em 2025. Cada uma configurou tudo do zero. Churn nos primeiros 90 dias.

**Implementação 8h:** FastAPI + Claude + parser CSV + dataset benchmark de políticas por setor

---

### Ideia 8 — Onfly Concilia (38/50)

**Conceito:** Reconciliação automática cruzando extrato Azulzinho + expense reports + NF-e. Detecta: match confirmado ✅ / transação sem recibo ⚠️ / recibo sem transação ⚠️ / divergência de valor ⚠️. Relatório pronto para ERP.

**Por que difere do Trust Expense:** Trust valida *política* (está acima do limite?). Concilia valida *existência* (a transação realmente aconteceu?).

**Por jurado:**
- Marcelo: "Produto de utilidade silenciosa — ninguém fala mas todo mundo precisa"
- Elvis: "Posiciona Onfly como plataforma financeira, não só OBT"
- Elvimar 10/10: "É literalmente o trabalho do CFO/Controller automatizado"

---

## Combinação mais forte (não desenvolvida neste hackathon)

**Onfly Zero + Policy Audit Agent:**
> "Foto no WhatsApp → capturado → validado → aprovado. Do recibo à aprovação: 45 segundos. Sem app, sem formulário, sem erro de categorização."
