# Ideias do Hackathon — Onfly

> Consolidado de arch-v2.md + anotações do monitor + análise competitiva + observações da plataforma.
> Última atualização: 2026-04-08

---

## Ranking atual

| # | Ideia | Recomendação | Risco 8h | Expense alinhado |
|---|---|---|---|---|
| 1 | **Policy Audit Agent** | ✅ Aposta principal | Médio | Muito alto |
| 2 | **Onfly Forecast** | ✅ Segunda opção ou feature embarcada | Baixo | Muito alto |
| 3 | **Onfly Copilot v3** | ⚠️ Viável mas com ressalvas | Baixo | Médio |
| 4 | **Carbon Travel** | ℹ️ Diferencial futuro | Médio | Baixo |
| 5 | **Smart Rebooking** | ❌ Evitar como principal | Médio | Médio |

---

## Ideia 1 — Policy Audit Agent (ex-Policy Optimizer)

### Conceito original (arch-v2)

Agente que analisa padrões de gastos históricos e sugere ajustes **sistêmicos** na política de viagens para maximizar economia sem prejudicar colaboradores.

> Diferente do Trust Expense (que detecta problemas individuais): Policy Audit Agent sugere mudanças na política como um todo.

**Funcionalidades:**
- "Seus colaboradores gastam 30% mais em hotel SP do que média do mercado. Sugestão: aumentar teto de R$300 para R$350 mas exigir reserva com 7 dias de antecedência — economia estimada: R$15k/mês"
- Detecta políticas muito restritivas (causam exceções demais)
- Detecta políticas muito frouxas (causam gastos acima do necessário)
- Benchmark anônimo com empresas similares

**MVP original:** Análise de dataset mockado + 3 sugestões de ajuste com economia estimada.

### Evolução pós-plataforma: Policy Audit Agent

Após ver a plataforma, o escopo se expande e se torna mais concreto:

1. **Audita despesas em tempo real** — detecta violações de política antes da aprovação (dor direta: expense é 100% manual hoje)
2. **Identifica anomalias** — gasto fora do padrão, duplicatas, categorização errada nos 1.344 centros de custo e 276 tags
3. **Transforma dashboard passivo em proativo** — "Sua empresa poderia ter economizado R$X este mês"
4. **Prioriza aprovações** — scoring de risco automático, não tudo com o mesmo peso

### Anotações do monitor

- Expense ganha pontos com os jurados — este é o mais alinhado de todos
- Ideia é original (Trust Expense audita o passado; este audita em tempo real e ajusta política)

### Posicionamento competitivo

- VOLL tem ExpenseAudit mas voltado a enterprise — Onfly democratiza para mid-market
- Ramp tem community.ai (benchmarking vs peers) mas sem LATAM
- Nenhum player brasileiro tem isso nativo hoje
- SAP Concur Analytics chega perto mas apenas para enterprise com SAP

### Alinhamento com jurados

| Jurado | Argumento |
|---|---|
| Marcelo (CEO) | Demo ao vivo: processa um recibo real e mostra flag de violação |
| Elvis (Comercial) | "Nenhum concorrente BR tem isso nativo" — diferencial de vendas |
| Manzinho (CFO) | ROI direto: "X% das despesas violam política hoje sem ser detectadas" |

---

## Ideia 2 — Onfly Forecast

### Conceito (arch-v2)

Usar dados históricos para prever o orçamento de viagens dos próximos 3-6 meses e alertar gestores sobre desvios antes que aconteçam.

> Trust Expense audita o PASSADO. Forecast prevê o FUTURO — não é sobreposição.

**Funcionalidades:**
- Dashboard com previsão de gastos por centro de custo/área
- Alertas proativos: "Com base nas viagens agendadas, vocês vão estourar o budget em 15 dias"
- Simulador: "Se trocar voos de manhã por voos à tarde, economiza 12%"
- Recomendação automática de ajustes na política
- Benchmark anônimo: "Empresas do mesmo porte gastam 20% menos em hospedagem"

**MVP:** Gráfico de previsão para os próximos 30 dias com dados mockados + alerta de estouro.

### Anotações do monitor

- Expense ganha pontos — Forecast é expense inteligente
- Narrativa forte: "de reativo a preditivo"
- Alinhamento direto com Manzinho (CFO): "Sonho do CFO — previsibilidade total"

### Posicionamento competitivo

- Nenhum player brasileiro tem forecast sofisticado hoje
- Navan e SAP Concur têm analytics avançados, mas sem localização BR e sem foco preditivo para mid-market
- Clara tem relatórios, mas sem forecasting
- **Vantagem Onfly:** dados reais de 3.200+ empresas — treinamento de modelo sem mock

### Combinação sugerida

Pode ser embarcado no Policy Audit Agent: "o agente não só detecta violações — ele sabe que você está próximo do limite do orçamento do trimestre."

---

## Ideia 3 — Onfly Copilot v3

### Conceito (arch-v2)

Agente que **executa reservas completas** via WhatsApp/chat — diferente do Assistente de Suporte atual (que responde dúvidas e resolve chamados).

**Funcionalidades:**
- "Preciso ir para São Paulo terça e voltar quinta" → busca, compara, sugere opções dentro da política → reserva com um "ok"
- Entende contexto: "o mesmo hotel que fiquei da última vez"
- Altera reservas: "muda meu voo para 2h mais tarde"
- Multi-modal: recebe foto de convite de evento e extrai datas/local
- Integra com Duty of Care: "seu voo atrasou, achei alternativa, quer que eu reserve?"

**MVP:** Bot WhatsApp + busca de voos mock + confirmar booking.

### Anotações do monitor (críticas)

- A v2 tentou isso e **deu muito errado** — histórico negativo interno
- Estamos na v3, que seria mais viável tecnicamente
- **Penalidade de originalidade:** ideia não é original — perde pontos na avaliação
- **Mitigante:** negócio tem interesse real e futuro; Onfly já tem APIs, agentes e dados prontos para reaproveitar
- Narrativa correta: "execução madura de algo que o negócio precisa", não "ideia nova"

### Posicionamento competitivo

- Nenhum player brasileiro tem booking conversacional end-to-end via WhatsApp hoje
- VOLL tem Smart Hub com agentes, mas não conversacional executando reservas
- Perk/Navan têm algo próximo mas sem LATAM
- **Risco:** VOLL pode lançar similar com R$700M disponíveis — janela curta

---

## Ideia 4 — Carbon Travel

### Conceito (arch-v2)

Calcular automaticamente a pegada de carbono de cada viagem e sugerir alternativas mais sustentáveis.

**Funcionalidades:**
- Score de carbono por viagem (kg CO2)
- Sugestões: "Trocar voo por ônibus nessa rota reduz 80% CO2"
- Relatório ESG automático para compliance
- Gamificação: ranking de colaboradores/áreas mais sustentáveis
- Compensação automática via parceiros

**MVP:** Calculadora de carbono comparando voo vs. ônibus vs. carro.

### Anotações

- Nenhum player brasileiro tem feature de ESG/carbono hoje
- Perk tem GreenPerk mas sem presença no Brasil
- Fontes de dados de emissões de CO2 não estão especificadas — risco de setup em 8h
- Menor urgência de negócio imediata — Manzinho vai querer número financeiro, CO2 é mais difícil de transformar em R$

---

## Ideia 5 — Smart Rebooking

### Conceito (arch-v2)

IA que monitora preços após a reserva confirmada e sugere (ou executa) re-reservas quando encontra opções melhores dentro da política.

**Funcionalidades:**
- Monitora preços de voos/hotéis após reserva confirmada
- Calcula economia líquida (considerando taxas de remarcação)
- Modo automático: re-reserva se economia > X% e dentro da política
- Dashboard de "savings" gerados pelo agente

**MVP:** Script monitorando booking mock e mostrando quando teria economizado.

### Por que evitar como principal

- **VOLL já tem o AirSave** — a Onfly estaria seguindo a VOLL, não diferenciando
- Coupa também tem Travel Saver com funcionalidade similar
- Elvis pode questionar diretamente: "a VOLL já tem isso"
- **Salvação se necessário:** posicionar como "Smart Rebooking para mid-market" — VOLL faz para enterprise, Onfly democratiza

---

## Critérios de avaliação do hackathon (inferidos)

| Critério | Peso | O que impressiona |
|---|---|---|
| Inovação | Alto | Algo que a VOLL ou TravelPerk não tem |
| Viabilidade Técnica | Alto | Marcelo quer ver código funcionando |
| Impacto no Negócio | **Muito alto** | ROI claro, economia mensurável |
| Experiência do Usuário | Alto | Autonomia, simplicidade |
| Alinhamento Estratégico | Alto | Expansão LATAM, enterprise, diferenciação |
| Uso de IA | **Obrigatório** | Sem IA = desclassificado |

---

## Perfil dos jurados

### Marcelo Linhares — CEO & Co-founder
- Engenharia de Computação (PUC Minas), Mestrado em Finanças (FECAP)
- Desenvolvedor que voltou a colocar código em produção usando IA
- "A IA é excelente em permitir que caras medianos como eu façam coisas úteis de verdade"
- **→ Quer ver IA que FUNCIONA. Demo ao vivo, código real, nada de slide.**

### Elvis Soares — Diretor Comercial & Co-founder
- MBA FGV, experiência em franchising e expansão retail
- **→ Quer features que ajudem a VENDER mais. Diferencial competitivo em demos para prospects.**

### Elvimar "Manzinho" Martins Soares — CFO
- Contabilidade, MBA em Custos
- **→ Quer ROI mensurável, economia comprovada, métricas financeiras claras.**
