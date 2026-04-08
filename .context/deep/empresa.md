# Onfly — Produto e Stack Atual

> Extraído de arch-v2.md. Use como referência antes de propor qualquer ideia.
> Ideias que já existem são descartadas pelos jurados.

---

## Empresa

- Fundada em 2018, +3.200 empresas (Vivara, PicPay, Hotmart, Vtex)
- R$240 milhões em Série B (Tidemark, abril/2025)
- Projeção R$1,5 bilhão em GMV para 2025
- DNA: Quase morreu na pandemia (queda 99% abril/2020, demitiu 18/22). Voltou mais forte.
- Missão implícita: "Digitalizar o analógico, simplificar o burocrático"
- Anti-padrões: emails para cotação, Excel para reembolso, processos de 12 etapas

---

## Stack de produtos atual

- Reservas: aéreo, hotel, ônibus, aluguel de veículos, short-term rentals
- Gestão de despesas e reembolsos
- Cartão corporativo "Azulzinho" (pré-pago, cartões virtuais ilimitados)
- Políticas de compliance personalizáveis
- Integrações com ERPs (Omie, etc.)
- Onfly Partners Hub (rede de hotéis parceiros)
- OnHappy (benefício de viagens a lazer para colaboradores)
- Onfly Corporate (enterprise)

---

## Produtos de IA já lançados (NÃO REPETIR)

| Produto | O que faz | Status |
|---|---|---|
| **Trust Expense** | Auditoria inteligente: detecta notas repetidas, valores divergentes, datas erradas, moeda incorreta | ✅ Em produção (200 empresas) |
| **Agente de Suporte** | Chatbot que resolve 77% dos chamados sem humano, CSAT 81% | ✅ Liberado para 70% da base |
| **Onflynho – Operações** | Copiloto interno para funcionários da Onfly | ✅ Disponível para todos Onflyers |
| **Recomendação de Hotel** | Ao comprar voo, sugere hotel no mesmo destino/período | ✅ 110.995 reservas recomendadas |
| **Servidores MCP** | Model Context Protocol para escalar IA na jornada | ✅ Lançado |
| **Tradução automática (Gemini)** | App mobile traduzido automaticamente para PT/EN/ES | ✅ Em produção |
| **Duty of Care** | Mapa em tempo real com status de voos e alertas de incidentes globais | ✅ Em produção |

---

## Funcionalidades recentes 2025 (NÃO REPETIR)

| Feature | Descrição |
|---|---|
| **Bagagem automática no checkout** | Compra junto com a passagem, sem chamado |
| **Alteração de voo automática** | Remarca direto na plataforma, sem concierge |
| **Busca 33% mais rápida** | Otimização de performance (30s → 20s) |
| **Spend Control** | Regras personalizadas para cartões corporativos |
| **Flow Expense (app gratuito)** | Automatiza prestação de contas |
| **Pix MED** | Mecanismo de devolução para contestação |
| **Agendamento de recarga** | Programa pagamento de recarga futura |
| **Exportação assíncrona** | Extratos CSV/Excel/OFX sem travar |
| **Auditoria de aprovação** | Histórico completo de quem aprovou/reprovou |
| **Rateio de centro de custo** | Em implementação (v0.5) |
| **Bloqueio de locadoras** | Cliente bloqueia sozinho, sem chamado |
| **App offline-first** | Funciona sem internet, sincroniza depois |

---

## Roadmap declarado (provavelmente já em desenvolvimento — cuidado)

- ⚠️ IA para entender **conteúdo semântico** de notas (itens não permitidos, fraudes, padrões)
- ⚠️ Recomendação de **assentos** personalizada
- ⚠️ Streaming de dados em tempo real (Airflow)
- ⚠️ "Dezenas de agentes inteligentes" em diferentes pontos da jornada (2026)

---

## Áreas abertas para inovação (identificadas no briefing)

1. Agente conversacional end-to-end (WhatsApp que RESERVA, não só responde) ← **SELECIONADA**
2. Previsão de orçamento (forecast financeiro preditivo)
3. Smart Rebooking (monitora preços e re-reserva automaticamente)
4. ESG/Carbono (cálculo de pegada e alternativas sustentáveis)
5. Negociação automática (agente que negocia tarifas)
6. Insights para política (IA que sugere ajustes na política)
7. Onboarding inteligente (configura empresa automaticamente)
8. Conciliação automática (IA que cruza NFs com extratos)

---

## O que a plataforma mostra por dentro (observado em 2026-04-08)

| Área | Realidade atual |
|---|---|
| Criação de despesa | 100% manual — sem OCR, sem auto-categorização |
| Dashboard | Dados estáticos — sem insights proativos |
| Aprovações | Binárias — sem scoring de risco ou priorização |
| Configurações | 1.344 centros de custo + 276 tags — campo minado de erros |

> Detalhe completo em `ops/plataforma.md`.
