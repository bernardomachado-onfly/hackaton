# Plataforma Onfly — Observações + Feedback do Monitor

> Evidências de primeira mão. Exploração da plataforma feita em 2026-04-08.
> Feedback do monitor do hackathon coletado em 2026-04-08.

---

## Observações da plataforma (por dentro)

| Área | O que existe | Observação crítica |
|---|---|---|
| **Home** | Cards de ação rápida: Reservar, Despesas, Relatórios, Duty of Care, Dashboard, Adiantamentos, Requisições | Interface limpa mas muitos cliques para chegar a ações |
| **Aprovações** | Tabs: Reservas, Relatórios, Adiantamentos, Cartão. Filtros por status | Funcional mas básico — sem insights, sem automação |
| **Criar Despesa** | Upload de recibos (PNG/JPEG/PDF), categorias, rateio, centro de custo, tags | **100% manual** — sem OCR visível, sem auto-categorização |
| **Criar Relatório** | Título, motivo, centro de custo, datas da viagem, campos customizados | Consolidação manual de despesas + reservas |
| **Dashboard** | Reservas por tipo, relatórios (pago/a pagar/a aprovar), mapa de viagens, top trechos, share cias aéreas | **Dados estáticos** — sem insights proativos |
| **Configurações** | 1.344 centros de custo, 276 tags, categorias de despesas com grupos | Complexidade altíssima — campo minado de erros de categorização |
| **Duty of Care** | Já existe como feature | ✅ Confirma: ideia "API de Riscos" é redundante — eliminar |

---

## O que isso revela

**Criação de despesa é 100% manual.** O viajante preenche tudo à mão: categoria, valor, descrição, centro de custo. Não foi identificado OCR nem auto-categorização. Maior dor de expense management não resolvida.

**O dashboard é passivo.** Mostra números, não diz: "você gastou 30% acima da média" ou "3 despesas violaram a política". Os dados estão lá — falta inteligência proativa em cima deles.

**1.344 centros de custo + 276 tags** = erros de categorização inevitáveis em escala. Um agente que detecta e corrige automaticamente tem valor imediato.

**Aprovações são binárias** — pendente ou aprovada. Não há scoring de risco, priorização por valor ou flag automático de anomalias.

---

## Ideias que perdem força após ver a plataforma

| Ideia | Por que perde |
|---|---|
| Buscador de Preço / Price Drop Agent | Onfly já tem multi-broker. Ganho marginal. |
| Ultra Buscador | Melhoria de UX, não dor de negócio. |
| Assistente de Onboarding | Já tem cards de orientação na home. Dor fraca. |
| API de Riscos | Duty of Care já existe — redundante. |
| Reports de Saving de Hotel | Dashboard já tem dados de reservas. Incremental. |
| Skills no Claude Cowork | Depende de integração com terceiro. |
| Marketplace de Mini-Apps | Ambicioso demais para 8h. |

---

## Feedback do monitor

### Expense ganha pontos
Ideias ligadas a expense management são bem vistas pelos jurados. Ângulos válidos:
auditoria de despesas, reembolso, categorização de gastos, política de despesas, forecasting.

### Onfly Copilot — histórico crítico
- A ideia do agente executor de reservas já foi tentada na **v2** e **deu muito errado**
- Estamos na **v3**, tecnicamente mais viável com os LLMs atuais
- **Penalidade de originalidade confirmada** — a ideia não é nova, perde pontos na avaliação
- **Mitigante:** negócio tem **interesse extremo** em realizar isso no futuro
- **Argumento positivo:** Onfly já tem APIs, IA, dados e agentes prontos para integrar

### Implicação para o pitch
A narrativa correta não é "temos uma ideia nova" mas sim:
> **"A v2 falhou porque os LLMs não eram bons o suficiente. Agora com Claude, finalmente funciona."**

Para ideias de expense: sem penalidade de originalidade — tema aberto e bem-vindo.
