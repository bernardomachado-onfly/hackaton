# Observações da Plataforma Onfly (por dentro)

> Exploração real feita em 2026-04-08. Evidência de primeira mão.

---

## O que foi visto por área

| Área | O que existe | Observação |
|---|---|---|
| **Home** | Cards de ação rápida: Reservar, Despesas, Relatórios, Duty of Care, Dashboard, Adiantamentos, Requisições | Interface limpa mas com muitos cliques para chegar a ações |
| **Aprovações** | Tabs: Reservas, Relatórios, Adiantamentos, Cartão. Filtros por status | Funcional mas básico — sem insights, sem automação |
| **Criar Despesa** | Upload de recibos (PNG/JPEG/PDF), categorias, rateio, centro de custo, tags | Processo 100% manual, sem OCR visível, sem auto-categorização |
| **Criar Relatório** | Título, motivo, centro de custo, datas da viagem, campos customizados | Consolidação manual de despesas + reservas |
| **Dashboard** | Reservas por tipo, relatórios (pago/a pagar/a aprovar), mapa de viagens, top trechos, share cias aéreas | Dados estáticos — sem insights proativos |
| **Configurações** | 1.344 centros de custo, 276 tags, categorias de despesas com grupos | Complexidade alta — muita configuração manual |
| **Duty of Care** | Já existe como feature na plataforma | Elimina ideia "API de Riscos" como diferencial — redundante |

---

## Recomendação revisada: Policy Audit Agent

Após ver a plataforma por dentro, a recomendação se consolida no **Policy Audit Agent** (evolução do Policy Optimizer).

### Por quê cada área reforça essa escolha

1. **Criação de despesa é 100% manual** — o viajante preenche tudo à mão: categoria, valor, descrição, centro de custo. Não há OCR nem auto-categorização visível. Um agente que audita e valida automaticamente resolve a dor mais concreta da plataforma.

2. **Dashboard é passivo** — mostra números, mas não diz "você gastou 30% acima da média neste trecho" ou "3 despesas violaram a política este mês". Policy Audit Agent transforma dados passivos em insights acionáveis.

3. **1.344 centros de custo + 276 tags** — complexidade enorme. Erros de categorização são inevitáveis. O agente detecta e corrige automaticamente.

4. **Aprovações são binárias** — pendente ou aprovada. Sem scoring de risco, priorização por valor ou flag automático de anomalias.

5. **Duty of Care já existe** — elimina a ideia "API de Riscos" como diferencial.

### O que o Policy Audit Agent faria concretamente

1. Audita despesas em tempo real — detecta violações de política antes da aprovação
2. Identifica anomalias — gasto fora do padrão, duplicatas, categorização errada
3. Quantifica savings — "Sua empresa poderia ter economizado R$X este mês"
4. Prioriza aprovações — flag automático para o aprovador focar no que importa

---

## Ideias que perdem força após ver a plataforma

| Ideia | Por que perde |
|---|---|
| Buscador de Preço / Price Drop Agent | Onfly já tem multi-broker. Ganho marginal |
| Ultra Buscador | Melhoria de UX, não dor de negócio |
| Assistente de Onboarding | Já tem cards de orientação na home. Dor fraca |
| API de Riscos | Duty of Care já existe — redundante |
| Reports de Saving de Hotel | Dashboard já tem dados de reservas por tipo. Incremental |
| Skills no Claude Cowork | Depende de integração com terceiro |
| Marketplace de Mini-Apps | Ambicioso demais para 8h |
