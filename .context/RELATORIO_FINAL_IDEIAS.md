# 🏆 RELATÓRIO FINAL — HACKATHON ONFLY TECH 100% IA

> Gerado em: 2026-04-08
> Base: 7 arquivos de contexto analisados + pesquisa de mercado 2025-2026

---

## Sumário Executivo

O contexto completo — briefing estratégico, observação direta da plataforma, feedback do monitor e análise competitiva — converge para uma conclusão clara: **as melhores apostas estão no expense management, não em booking**. A plataforma atual tem um buraco operacional evidente: criação de despesas 100% manual, dashboard passivo e aprovações binárias sem inteligência. O monitor confirmou que expense ganha pontos. A VOLL acabou de receber R$700M e tem agentes de IA no ar — o diferencial da Onfly precisa ser no mid-market, não copiar enterprise.

**Top 3:** Policy Audit Agent (42/50), Onfly Forecast (41/50), Onfly Copilot v3 (38/50 — viável, mas com risco de originalidade).

---

## Contexto Analisado

### Arquivos Processados

| Arquivo | Tipo | Principais Insights |
|---|---|---|
| `00-estado-atual.md` | Decisões | Recomendação evoluiu: Copilot → Policy Audit Agent após ver plataforma por dentro |
| `01-produto-onfly.md` | Produto | 6 produtos IA em produção + 14 features 2025 a evitar. Áreas abertas mapeadas |
| `02-concorrentes.md` | Mercado | VOLL (R$700M Warburg) é maior ameaça. Paytrack com mesmo funding. Clara domina MX |
| `03-ideias.md` | Ideias | 5 ideias rankeadas com anotações acumuladas do monitor + análise competitiva |
| `04-plataforma.md` | Evidência | Observação real: expense 100% manual, 1.344 centros de custo, aprovações binárias |
| `05-monitor.md` | Intel | Expense ganha pontos. Copilot v2 falhou. Não há penalidade para ideias de expense |
| `06-perfil-socios.md` | Psicologia | Marcelo = execução, Elvis = crescimento, Elvimar = ROI/compliance. DNA de sobrevivência |

### Síntese do Desafio

A Onfly não precisa de mais uma feature. Precisa de um **agente que transforme dados que já tem em inteligência que ainda não entrega**. A plataforma coleta tudo — despesas, reservas, centros de custo, políticas — mas não faz nada proativo com isso. O viajante ainda preenche tudo à mão. O gestor ainda aprova no escuro. O CFO ainda descobre o problema depois que aconteceu.

O hackathon é uma oportunidade de mostrar que a Onfly não é só um sistema de booking — é uma **plataforma de inteligência financeira de viagens corporativas**.

---

## Top 3 Ideias Recomendadas

---

### 🥇 1ª LUGAR: Policy Audit Agent

**Descrição:** Agente de IA que opera sobre o fluxo de expense existente da Onfly — audita despesas em tempo real antes da aprovação, detecta anomalias e violações de política, corrige categorizações erradas nos 1.344 centros de custo, transforma o dashboard passivo em alertas proativos e dá ao aprovador um score de risco em vez de uma fila binária.

**Por que é diferente do Trust Expense:** o Trust Expense audita despesas *já aprovadas*, procurando fraudes depois do fato. O Policy Audit Agent atua *antes da aprovação*, em tempo real, e além de detectar problemas individuais, **sugere ajustes sistêmicos na política** — "suas políticas de hotel em SP causam 47 exceções por mês, custo estimado R$18k".

---

**Por que vence — na voz de cada jurado:**

**Marcelo (CEO — Desenvolvedor-Estrategista):**
> "Isso é exatamente o que eu queria quando a gente construiu o Trust Expense mas ficou pra v2. Sem pirotécnica — pega um recibo, manda pro agente, ele fala se violou política, qual o risco, e sugere a correção. Demo ao vivo, sem slide. Isso funciona."

**Elvis (Comercial — Expansionista Relacional):**
> "Isso é o que a gente usa pra derrubar a VOLL em PME. O ExpenseAudit deles é enterprise, caro, pesado. A gente entrega a mesma inteligência pra empresa de 200 funcionários. É diferencial direto em demo de vendas."

**Elvimar (CFO — Estruturador Operacional):**
> "Finalmente alguém me dá número. Se X% das despesas violam política e ninguém sabe, isso é dinheiro saindo sem rastreamento. Quero ver: empresas com N colaboradores têm em média Y% de despesas fora da política. Isso é auditoria de verdade."

---

**Pontuação Estimada:**

| Critério | Nota | Justificativa |
|---|---|---|
| Inovação | 8/10 | Original no BR — Trust Expense é diferente. Gap competitivo real vs. VOLL enterprise |
| Viabilidade | 8/10 | Dor confirmada ao vivo. Trust Expense como infraestrutura base. Demo em 8h factível |
| Impacto | 9/10 | ROI direto e mensurável. Escala com 3.200 clientes já na base |
| Usabilidade | 8/10 | Zero treinamento — integra no fluxo de aprovações existente |
| Apresentação | 9/10 | Demo ao vivo: recibo real → agente → flag de violação → score de risco. Irresistível pra Marcelo |
| **TOTAL** | **42/50** | |

**Pontuação por jurado:**

| Jurado | Nota | Por quê |
|---|---|---|
| Marcelo | 9/10 | Demo funcionando ao vivo com código real. Resolve ineficiência óbvia |
| Elvis | 8/10 | Diferencial direto vs. VOLL em demos comerciais. "Democratiza o enterprise" |
| Elvimar | 10/10 | ROI mensurável, compliance nativo, governança de despesas — é tudo que ele quer |

---

**Implementação sugerida para as 8h:**

```
Stack: FastAPI + Claude API + mock de dados Onfly (JSON com despesas + políticas)

Hora 0-1: Setup do ambiente + definir estrutura de dados (despesa, política, centro de custo)
Hora 1-3: Construir o pipeline: recibo (upload PNG) → OCR → extração de campos → validação contra política
Hora 3-5: Lógica de scoring de risco + categorização automática + sugestão de correção
Hora 5-6: Dashboard mínimo: fila de aprovações com score de risco + 3 insights proativos
Hora 6-7: Funcionalidade de "política sistêmica": "Suas 5 políticas que mais geram exceções"
Hora 7-8: Polir demo, preparar dataset com casos reais, ensaiar apresentação
```

**MVP mínimo aceitável para o demo:**
1. Upload de recibo → extração automática de dados (sem preenchimento manual)
2. Validação contra política → flag colorido (verde/amarelo/vermelho)
3. Score de risco na fila de aprovações
4. 1 insight proativo: "Este mês: R$X em despesas fora da política"

**Risco de sobreposição com Trust Expense:** confirmar antes que o Trust Expense não já faz validação em tempo real. Se fizer, o diferencial do Policy Audit Agent é a **camada sistêmica** (ajuste de políticas) e o **scoring de aprovações** — focar nessa parte no pitch.

---

**Riscos e Mitigações:**

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Trust Expense já cobre parte do escopo | Média | Diferenciar explicitamente: "Trust Expense = auditoria do passado. Policy Audit = prevenção no presente + otimização do futuro" |
| Demo com dados mockados pouco convincente | Baixa | Usar dataset real de uma empresa cliente (anonimizado) — 3.200 empresas na base |
| 8h não é suficiente para o pipeline completo | Média | Priorizar: OCR + validação são o core. Scoring e insights sistêmicos são bônus |
| Jurado pergunta: "isso não é Trust Expense 2.0?" | Alta | Preparar resposta: "Trust Expense detecta. Policy Audit previne E otimiza — três camadas acima" |

---

### 🥈 2ª LUGAR: Onfly Forecast

**Descrição:** Plataforma de previsão preditiva de orçamento de viagens corporativas. Usa dados históricos da Onfly para projetar gastos por centro de custo nos próximos 30-90 dias, alerta gestores sobre estouros antes que aconteçam, e simula o impacto financeiro de mudanças na política de viagens.

**Por que não existe ainda:** o Trust Expense olha para o passado. O Forecast olha para o futuro. Não há sobreposição — são produtos complementares e podem ser vendidos juntos.

---

**Por que vence — na voz de cada jurado:**

**Marcelo (CEO):**
> "Isso é o que os nossos clientes precisam e ninguém entrega. Dados que já temos na plataforma, modelo preditivo simples, resultado visual imediato. É a demonstração de que dados de viagens têm mais valor do que as pessoas percebem."

**Elvis (Comercial):**
> "Esse é o produto que faz o gestor financeiro defender a Onfly internamente. Ele vai na reunião de budget e mostra o dashboard de forecast — a Onfly virou ferramenta estratégica, não só operacional. Retenção e upsell garantidos."

**Elvimar (CFO):**
> "Previsibilidade financeira é o sonho de qualquer CFO. 'Você vai estourar o budget em 15 dias' dito antes de acontecer vale mais do que qualquer relatório de auditoria. Isso é gestão proativa."

---

**Pontuação Estimada:**

| Critério | Nota | Justificativa |
|---|---|---|
| Inovação | 9/10 | Nenhum player BR tem forecast de T&E. Gap real de mercado confirmado |
| Viabilidade | 7/10 | Modelo preditivo simples (regressão ou média móvel) é suficiente para MVP. Dados mockados no hackathon |
| Impacto | 9/10 | Narrativa "de reativo a preditivo" ressoa com CFO e CEO. ROI de prevenção > ROI de correção |
| Usabilidade | 8/10 | Dashboard visual com gráfico de previsão + alerta colorido. Zero treinamento |
| Apresentação | 8/10 | "Essa empresa vai estourar o budget em 12 dias" dito ao vivo é difícil de ignorar |
| **TOTAL** | **41/50** | |

**Pontuação por jurado:**

| Jurado | Nota | Por quê |
|---|---|---|
| Marcelo | 8/10 | Tecnologia que funciona com dados reais. Demonstrável em código simples |
| Elvis | 8/10 | Produto que cria stickiness — gestor passa a depender do forecast |
| Elvimar | 10/10 | Previsibilidade financeira é o núcleo do que CFO precisa. ROI de prevenção |

---

**Implementação sugerida para as 8h:**

```
Stack: Python/FastAPI + modelo de forecast simples (Prophet ou média ponderada) + dashboard Streamlit/HTML

Hora 0-1: Definir estrutura de dados: histórico de gastos por CC, tipo, período
Hora 1-3: Modelo de forecast: média móvel + sazonalidade simples. Não precisa ser sofisticado
Hora 3-5: Dashboard: linha de previsão 30 dias + banda de confiança + linha de orçamento aprovado
Hora 5-6: Alertas: "Em X dias você atinge 90% do budget" + simulador "e se mudar política?"
Hora 6-7: Benchmark anônimo: "Empresas similares gastam Y% menos em hospedagem"
Hora 7-8: Polir visualização, preparar cenários para demo
```

**Combinação estratégica com o 1º lugar:** o Forecast pode ser posicionado como camada de inteligência do Policy Audit Agent — "o agente não só detecta violações hoje, ele sabe que você está a 12 dias de estourar o orçamento". Juntos, formam um produto mais robusto se a equipe tiver time.

---

**Riscos e Mitigações:**

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Modelo preditivo com dados mockados pouco convincente | Média | Usar dados reais anonimizados de clientes (com permissão) ou construir dataset sintético realista |
| Jurado pergunta: "o dashboard não já mostra isso?" | Alta | "O dashboard atual mostra o que aconteceu. O Forecast mostra o que vai acontecer — são produtos opostos" |
| Complexidade do modelo preditivo em 8h | Baixa | Média móvel ponderada é suficiente para MVP. Sofisticação vem depois |

---

### 🥉 3ª LUGAR: Onfly Copilot v3

**Descrição:** Agente conversacional que **executa reservas completas** via WhatsApp ou chat — não responde dúvidas (isso o assistente atual já faz com 77% de resolução), mas age: busca voos dentro da política, compara opções, reserva com um "ok" do viajante, altera itinerários por conversa, entende contexto ("o mesmo hotel da última vez").

**Por que ainda está no top 3 apesar das ressalvas:** o interesse estratégico do negócio é extremo. Onfly tem os ativos (APIs de booking, Agente de Suporte como base, Duty of Care, dados de preferência). A narrativa de "finalmente fizemos funcionar" pode ser poderosa se bem executada.

**Ressalva crítica:** a v2 tentou isso e falhou internamente. O monitor confirmou que a ideia não é original e perde pontos de inovação. Apresentar como ideia nova é o erro — a narrativa correta é **"temos os ativos para entregar o que o negócio precisa desde 2022"**.

---

**Por que ainda compete — na voz de cada jurado:**

**Marcelo (CEO):**
> "A gente tentou isso antes e não deu certo. Mas agora com os modelos que existem e as APIs que a gente já tem... pode ser que a v3 funcione de verdade. Se funcionar ao vivo, é game changer."
> *Risco: se lembrar que a v2 falhou, o sinal é ambíguo.*

**Elvis (Comercial):**
> "Esse é o produto que derruba a VOLL em demo. Cliente vê o WhatsApp reservar uma passagem em 30 segundos e fecha. Isso viraliza. A VOLL não tem isso."

**Elvimar (CFO):**
> "É bonito, mas como eu meço o ROI? A reserva por WhatsApp é mais barata que pela plataforma? Economiza tempo do viajante? Quanto? Preciso de número."
> *Risco: Elvimar vai pedir número que é difícil de provar em 8h.*

---

**Pontuação Estimada:**

| Critério | Nota | Justificativa |
|---|---|---|
| Inovação | 6/10 | Penalidade explícita de originalidade confirmada pelo monitor. v2 falhou |
| Viabilidade | 7/10 | WhatsApp bot + mock APIs é factível em 8h. Integração real é mais complexa |
| Impacto | 8/10 | Interesse estratégico alto. Janela competitiva diminuindo com VOLL |
| Usabilidade | 9/10 | WhatsApp é o canal mais familiar do Brasil. Zero curva de aprendizado |
| Apresentação | 8/10 | Demo conversacional ao vivo é visualmente impactante para Marcelo e Elvis |
| **TOTAL** | **38/50** | |

**Pontuação por jurado:**

| Jurado | Nota | Por quê |
|---|---|---|
| Marcelo | 8/10 | Demo ao vivo funciona, mas sabe do histórico da v2. Sinal ambíguo |
| Elvis | 9/10 | Maior wow factor para demos comerciais. Potencial viral |
| Elvimar | 6/10 | ROI indireto, difícil de quantificar. v2 falhou é flag de risco |

---

**Implementação sugerida para as 8h:**

```
Stack: WhatsApp Business API (Twilio ou Meta) + FastAPI + Claude API + mock de APIs Onfly

Hora 0-1: Setup WhatsApp Business API (usar Twilio para agilizar)
Hora 1-3: Flow conversacional: intenção → extração de parâmetros → busca mock → apresentação de opções
Hora 3-5: Lógica de políticas: validar opções contra política da empresa do usuário
Hora 5-6: Confirmação e "reserva" (mock mas com número de confirmação real)
Hora 6-7: Contexto: "o mesmo destino da última vez", alteração de itinerário por chat
Hora 7-8: Ensaiar demo ao vivo no WhatsApp — isso é o que vai impressionar
```

**Narrativa de pitch recomendada:**
> "A gente tentou isso em 2022. Não deu certo — a tecnologia não estava pronta. Hoje a Onfly tem APIs de booking, um agente com 77% de resolução, dados de 3.200 empresas e os LLMs mudaram o jogo. Essa é a v3. E ela funciona."

---

**Riscos e Mitigações:**

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Jurado menciona a v2 que falhou | Alta | Preparar resposta: "A v2 falhou porque o modelo não conseguia entender contexto. Os LLMs de 2026 resolvem exatamente isso." |
| Demo ao vivo falha no WhatsApp | Média | Ter fallback: tela web conversacional como backup |
| Elvimar pede ROI e não há número pronto | Alta | Preparar: "viajante economiza 8 minutos por reserva × 50 reservas/mês × 800 colaboradores = X horas/mês" |
| VOLL lança algo similar antes do pitch | Baixa | Se acontecer: "A VOLL acabou de lançar — o mercado validou que isso é o futuro. A Onfly entrega para mid-market." |

---

## Matriz Comparativa Final

| Ideia | Marcelo | Elvis | Elvimar | Score Jurados | Score Critérios | Viabilidade 8h |
|---|---|---|---|---|---|---|
| **Policy Audit Agent** | 9/10 | 8/10 | 10/10 | **27/30** | **42/50** | Alta |
| **Onfly Forecast** | 8/10 | 8/10 | 10/10 | **26/30** | **41/50** | Alta |
| **Onfly Copilot v3** | 8/10 | 9/10 | 6/10 | **23/30** | **38/50** | Alta |
| Smart Rebooking | 7/10 | 6/10 | 8/10 | 21/30 | 35/50 | Média |
| Carbon Travel | 6/10 | 7/10 | 5/10 | 18/30 | 32/50 | Média |

---

## Recomendação de Pitch

### Estratégia: "De Plataforma Operacional a Plataforma de Inteligência"

O pitch vencedor não apresenta uma feature — apresenta uma **mudança de posicionamento** da Onfly.

```
HOJE:         "A Onfly é onde você reserva viagens e registra despesas."
              → Reativo. Operacional. Commodity.

COM O AGENTE: "A Onfly é o sistema que detecta problemas de compliance
               antes deles custarem dinheiro, prevê quando você vai 
               estourar o budget, e otimiza suas políticas de viagem."
              → Proativo. Estratégico. Insubstituível.
```

### Abertura (30 segundos — para Marcelo)
> "Abrimos a plataforma ontem. Criação de despesa: 100% manual. Dashboard: passivo. Aprovações: binárias. Com 1.344 centros de custo na base. Quantas despesas chegam com centro de custo errado por mês? Ninguém sabe. Isso é o problema."

### Desenvolvimento (para Elvimar)
> "Em média, empresas B2B têm 12-18% das despesas fora da política sem saber. Para uma empresa com R$500k/mês em T&E, isso é R$60-90k/mês que sai sem rastreamento. O Policy Audit Agent detecta isso antes da aprovação — em tempo real, sem mudar o fluxo existente."

### Fechamento (para Elvis)
> "Nenhum concorrente mid-market brasileiro faz isso. A VOLL faz para enterprise a preço enterprise. A gente entrega para as 3.200 empresas que já estão na Onfly hoje. Sem onboarding, sem treinamento — já está no fluxo delas."

### Demo ao vivo (3 minutos — o que Marcelo mais quer)
1. Abrir tela de criação de despesa
2. Upload de recibo real (ou foto ao vivo)
3. Agente extrai dados automaticamente — sem preenchimento manual
4. Flag de violação aparece: "Categoria incorreta. Valor 23% acima da política para este destino."
5. Sugestão de correção automática
6. Dashboard: "Este mês: 47 despesas fora da política. Custo estimado: R$34.200"

---

## Apêndice: Ideias Descartadas

| Ideia | Por que não entrou | Descartada por |
|---|---|---|
| **Smart Rebooking** | VOLL já tem AirSave. Onfly estaria seguindo, não diferenciando | Análise competitiva |
| **Carbon Travel** | Menor urgência de negócio imediata. CO2 difícil de transformar em R$ para Elvimar. Fontes de dados não especificadas | ROI fraco + risco de setup |
| **Buscador de Preço** | Onfly já tem multi-broker. Ganho marginal | Plataforma já resolve |
| **Ultra Buscador** | Melhoria de UX, não dor de negócio | Observação da plataforma |
| **Assistente de Onboarding** | Já tem cards de orientação na home | Plataforma já resolve |
| **API de Riscos** | Duty of Care já existe na plataforma | Plataforma já resolve |
| **Marketplace de Mini-Apps** | Ambicioso demais para 8h | Viabilidade |

---

## Nota Final

Os três arquivos mais importantes para o dia do hackathon:

1. `04-plataforma.md` — evidências concretas da dor (use no pitch de abertura)
2. `06-perfil-socios.md` — como falar com cada jurado no Q&A
3. `02-concorrentes.md` — quando Elvis perguntar "e a VOLL?"

A diferença entre ganhar e perder um hackathon interno não está na ideia — está em quanto a equipe entende a dor *antes* de começar a codar. Essa análise mostra que a dor foi validada ao vivo. Use isso.

---

*Análise baseada em: arch-v2.md, ARCHITECTURE.md, analise dos contextos consolidados, pesquisa de mercado 2025-2026, observação direta da plataforma e feedback do monitor do hackathon.*
