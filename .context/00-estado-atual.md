# Estado Atual — Hackathon Onfly

> Última atualização: 2026-04-08

---

## Recomendação atual

**Policy Audit Agent** — evoluído a partir do Policy Optimizer original.

### Por que mudou

| Fase | Recomendação | Base |
|---|---|---|
| Análise inicial dos docs | Onfly Copilot v3 | Briefing estratégico arch-v2 |
| Após conversa com monitor | Onfly Copilot v3 (com ressalvas) | Copilot v2 falhou, v3 mais viável |
| Após ver a plataforma por dentro | **Policy Audit Agent** | Dor confirmada ao vivo: expense 100% manual, dashboard passivo, aprovações binárias |

### Argumento central

A criação de despesa na Onfly é 100% manual — sem OCR, sem auto-categorização. O dashboard mostra dados estáticos, sem insights proativos. Aprovações são binárias, sem scoring de risco. Com 1.344 centros de custo e 276 tags, erros de categorização são inevitáveis em escala.

Isso não é hipótese — é evidência observada diretamente na plataforma.

O Policy Audit Agent transforma tudo isso: audita em tempo real, identifica anomalias, quantifica savings, prioriza aprovações.

---

## Decisões tomadas

- **Duty of Care já existe** → ideia "API de Riscos" eliminada
- **Expense ganha pontos** com os jurados (confirmado pelo monitor)
- **Copilot v2 falhou** internamente — apresentar como ideia principal tem risco de histórico negativo
- **Ativos disponíveis para reuso:** APIs de booking, Agente de Suporte, Trust Expense, dados de 3.200+ empresas

---

## Em aberto

- [ ] Temas oficiais do hackathon ainda não divulgados (seção 8 de arch-v2 vazia) — se houver restrição temática, reavalie o ranking
- [ ] Confirmar se Trust Expense já cobre alguma parte do Policy Audit Agent (risco de sobreposição)
- [ ] Definir MVP concreto para as 8h: quais features entram, o que vai ser mockado
- [ ] Mapear quais APIs Onfly estão disponíveis vs. precisam ser mockadas
- [ ] Criar spec técnica com modelo de dados, endpoints e fluxo de demo

---

## Alinhamento com jurados

| Jurado | O que valoriza | Como o Policy Audit Agent atende |
|---|---|---|
| Marcelo (CEO) | Demo funcionando ao vivo, código real | Processa um recibo real e mostra flag de violação ao vivo |
| Elvis (Comercial) | Diferencial competitivo vs. VOLL | VOLL tem ExpenseAudit mas enterprise — Onfly democratiza para mid-market |
| Manzinho (CFO) | ROI mensurável, número financeiro | "X% das despesas violam política hoje sem ser detectadas — custo estimado R$Y/mês" |
