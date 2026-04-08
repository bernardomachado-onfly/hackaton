# Novas Ideias — Hackathon Onfly (Rodada 2)

> Gerado em: 2026-04-08
> Base: todos os contextos anteriores + gaps não explorados pelo top 5 original
> Premissa: nenhuma das 3 ideias abaixo existe na plataforma atual nem no top 5 anterior

---

## Raciocínio de geração

O top 5 original cobriu: auditoria de expense (Policy Audit Agent), forecasting, booking conversacional, ESG e rebooking. O que ficou de fora:

| Gap identificado | Fonte da evidência |
|---|---|
| Criação de despesa 100% manual — mas o problema real é o **momento de captura** (recibo na mão, longe do computador) | 04-plataforma.md |
| 1.344 centros de custo criados manualmente — 500+ novos clientes em 2025, cada um precisou configurar tudo do zero | 01-produto-onfly.md + 04-plataforma.md |
| Azulzinho gera transações → expense reports são submetidos separados → **ninguém cruza os dois** | 01-produto-onfly.md |
| arch-v2 lista "Negociação automática" e "Conciliação automática" como áreas abertas que nenhuma ideia anterior cobriu | _source/arch-v2.md |

---

## Ranking das 3 novas ideias

| # | Ideia | Score Jurados | Score Critérios | Viabilidade 8h |
|---|---|---|---|---|
| 1 | **Onfly Zero** — Expense sem app, só WhatsApp | 26/30 | 44/50 | Alta |
| 2 | **Onfly AutoConfig** — IA que configura a empresa automaticamente | 23/30 | 40/50 | Alta |
| 3 | **Onfly Concilia** — Reconciliação automática Azulzinho + NF-e | 23/30 | 38/50 | Alta |

---

## 🥇 Ideia 1 — Onfly Zero: Expense Sem App, Só WhatsApp

### O problema

A criação de despesa na Onfly é 100% manual — confirmado ao vivo. Mas o problema real não é o app: é o **momento de captura**. O viajante tem o recibo na mão ao sair do restaurante, no lobby do hotel, na saída do estacionamento. Por isso não registra na hora. Quando finalmente abre o app, já perdeu a motivação, está com 5 recibos acumulados e preenche com pressa — daí os erros de categorização, centro de custo errado, valores aproximados.

A solução não é melhorar o app. É **eliminar o app da equação** no momento de captura.

> **Diferente do Flow Expense** (que automatiza o *workflow* de prestação de contas): o Onfly Zero resolve o *momento de registro*, não o fluxo de aprovação. São camadas complementares, não sobrepostas.

### O que é

Agente de IA acessível via WhatsApp. O viajante tira foto do recibo e manda. O agente faz o resto:

1. **OCR + extração** — lê valor, data, fornecedor, CNPJ
2. **Match com a viagem** — identifica automaticamente a viagem ativa do viajante (SP, terça a quinta)
3. **Categorização inteligente** — sugere categoria e centro de custo baseado em: tipo de estabelecimento, histórico do viajante, viagens anteriores ao mesmo destino
4. **Submissão automática** — envia para aprovação sem o viajante abrir o app
5. **Aprovador no WhatsApp** — gestor recebe mensagem: "João submeteu jantar R$87 — aprovar?" → responde "sim"

**Flow completo em menos de 30 segundos. Zero app, zero formulário, zero esforço.**

### Por que não existe ainda

Flow Expense automatiza o workflow (quem aprova, qual sequência). O problema que o Onfly Zero resolve — captura zero-fricção no momento do gasto — não está coberto. A evidência é a própria plataforma: expense ainda é 100% manual mesmo com Flow Expense existindo.

### Por que vence — na voz de cada jurado

**Marcelo (CEO):**
> "Isso é o que eu chamo de resolver o problema certo. A gente fez o app, fez o Flow Expense, mas o viajante ainda preenche tudo à mão. Por quê? Porque o problema não é o app — é o momento. WhatsApp resolve o momento. Demo ao vivo com celular vai deixar a sala em silêncio."

**Elvis (Comercial):**
> "Esse produto retém o viajante. Ele para de odiar a parte de expense da viagem. Quando a gente for numa demo e mostrar isso ao vivo no celular, o prospect fecha na hora. E é diferencial direto que a VOLL não tem — o ExpenseAudit deles é backend, não é experiência do viajante."

**Elvimar (CFO):**
> "Quantas despesas chegam fora do prazo porque o viajante 'esqueceu'? Quantas chegam com dados errados porque ele preencheu de memória 3 dias depois? Isso tem custo. Se o agente captura na hora, a taxa de completude sobe, os dados ficam corretos, o fechamento fica mais limpo. Quero o número de despesas submetidas com erro hoje vs. o que seria com isso."

### Pontuação estimada

| Critério | Nota | Justificativa |
|---|---|---|
| Inovação | 8/10 | WhatsApp como canal de expense é novo no BR. OCR existe mas não integrado assim |
| Viabilidade | 8/10 | WhatsApp Business API (Twilio) + OCR (Claude Vision) + match de viagem. 8h é factível |
| Impacto | 9/10 | Resolve a dor #1 confirmada ao vivo: expense 100% manual. Escala com toda a base |
| Usabilidade | 10/10 | WhatsApp no Brasil = 99% de penetração. Zero download, zero aprendizado |
| Apresentação | 9/10 | Demo ao vivo com celular: foto do recibo → despesa aprovada em 30 segundos na frente dos jurados |
| **TOTAL** | **44/50** | |

**Pontuação por jurado:**

| Jurado | Nota | Por quê |
|---|---|---|
| Marcelo | 9/10 | Resolve ineficiência óbvia com código simples. Demo ao vivo irresistível |
| Elvis | 9/10 | Experiência do viajante muda completamente. Diferencial em demos comerciais |
| Elvimar | 8/10 | Melhora qualidade dos dados de expense. Tempo economizado por viajante × base total = R$ |

### Implementação para as 8h

```
Stack: WhatsApp Business API (Twilio) + FastAPI + Claude Vision API (OCR) + dados mock Onfly

Hora 0-1: Setup WhatsApp Business via Twilio sandbox (funciona em minutos para demo)
Hora 1-2: Pipeline de OCR: imagem → Claude Vision → JSON estruturado (valor, data, fornecedor, CNPJ)
Hora 2-4: Lógica de match: viajante identificado por número → viagens ativas → sugestão de CC e categoria
Hora 4-5: Auto-submissão: POST no endpoint mock de criação de despesa
Hora 5-6: Notificação do aprovador: WhatsApp do gestor com resumo + botão de aprovação por reply
Hora 6-7: Tratamento de edge cases: recibo ilegível, viajante sem viagem ativa, categoria ambígua
Hora 7-8: Ensaiar demo ao vivo no celular — esse é o momento que vai ganhar o hackathon
```

**MVP mínimo aceitável:**
1. WhatsApp recebe foto de recibo
2. Extrai valor, data, fornecedor corretamente
3. Associa à viagem ativa do usuário
4. Submete para aprovação (mock) com categoria sugerida
5. Gestor recebe notificação no WhatsApp

### Riscos e mitigações

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Jurado pergunta: "e o Flow Expense?" | Alta | "Flow Expense automatiza quem aprova. Onfly Zero automatiza quem registra — são camadas diferentes. Um não substitui o outro." |
| OCR falha em recibo de baixa qualidade | Média | Ter 3-4 recibos de alta qualidade preparados para o demo. Falha ao vivo mata a apresentação. |
| WhatsApp API com instabilidade no demo | Baixa | Ter fallback: versão web que simula o mesmo fluxo como backup |
| Overlap com Trust Expense | Baixa | Trust Expense valida DEPOIS da submissão. Onfly Zero captura ANTES. São momentos diferentes na jornada. |

---

## 🥈 Ideia 2 — Onfly AutoConfig: IA que Configura a Empresa Automaticamente

### O problema

A Onfly tem 1.344 centros de custo e 276 tags na plataforma. Alguém criou tudo isso manualmente. Cada uma das 500+ empresas que migraram da Argo para a Onfly em 2025 precisou configurar do zero: hierarquia de centros de custo, tags por departamento, políticas de gasto por nível hierárquico, fluxos de aprovação, limites por categoria.

Esse processo leva dias a semanas. É a principal causa de churn nos primeiros 90 dias de qualquer SaaS B2B — o cliente assina, não consegue configurar, desiste antes de ver valor.

> **Diferente do "Assistente de Onboarding"** que a plataforma já tem (cards de orientação para o usuário): o AutoConfig é sobre configuração da **empresa**, não do usuário. São problemas opostos — um é aprender a usar, o outro é configurar a estrutura organizacional inteira.

### O que é

Agente de IA que lê a estrutura organizacional da empresa e gera automaticamente toda a configuração inicial da Onfly:

1. **Ingesta o org chart** — aceita PDF, CSV, Excel ou pull direto do Omie/ERP integrado
2. **Gera centros de custo** — mapeados para a hierarquia real da empresa (Financeiro > FP&A > Controlling)
3. **Cria tags e categorias** — baseadas nos departamentos e funções identificados
4. **Sugere políticas por perfil** — "Diretores: hotel até R$450/noite. Analistas: hotel até R$280/noite. Viagens internacionais: pré-aprovação obrigatória."
5. **Configura fluxo de aprovação** — baseado na hierarquia detectada (analista → gerente → diretor)
6. **Benchmark de políticas** — compara com empresas do mesmo porte e setor na base Onfly: "Sua política de diárias está 23% acima da média para empresas de 200-500 funcionários"

O admin revisa e aprova — em vez de criar do zero, ele só valida o que o agente sugeriu.

### Por que não existe ainda

Está explicitamente listado como área aberta em arch-v2: *"Onboarding inteligente (configura a empresa automaticamente baseado em perfil)"*. Nenhuma ideia do top 5 cobriu esse ângulo — todas focaram em uso da plataforma, não na configuração dela.

### Por que vence — na voz de cada jurado

**Marcelo (CEO):**
> "Isso resolve o problema que a gente nunca fala em público mas sabe que existe: o cliente demora semanas para configurar e às vezes desiste. Se a IA faz isso em 1 hora, a gente reduz churn nos primeiros 90 dias e aumenta o NPS de ativação. Demo: sobe um CSV com 50 funcionários e vê 50 centros de custo aparecerem na tela."

**Elvis (Comercial):**
> "Isso muda o discurso de vendas completamente. 'Você assina hoje e amanhã está operacional' vs. 'você assina e em 3 semanas termina de configurar'. Time-to-value é o argumento número 1 para trocar de fornecedor. Isso diferencia da Argo, do Paytrack, de todo mundo."

**Elvimar (CFO):**
> "500 empresas migraram da Argo pra Onfly em 2025. Quantas demoraram mais de 30 dias para ativar? Cada dia sem ativação é churn potencial. Se o AutoConfig reduz esse tempo de 3 semanas para 2 horas, tem ROI direto em retenção."

### Pontuação estimada

| Critério | Nota | Justificativa |
|---|---|---|
| Inovação | 8/10 | Área aberta listada em arch-v2. Ninguém em T&E B2B no Brasil faz isso com IA |
| Viabilidade | 7/10 | Parsing de org chart + geração de config + benchmark é doable. Precisa de bom dataset de políticas |
| Impacto | 8/10 | Reduz churn de ativação. ROI mensurável: dias de ativação antes vs. depois |
| Usabilidade | 9/10 | Admin vai de semanas de trabalho manual para 1 hora de revisão |
| Apresentação | 8/10 | Demo: upload CSV com 50 funcionários → tela com centros de custo gerados automaticamente |
| **TOTAL** | **40/50** | |

**Pontuação por jurado:**

| Jurado | Nota | Por quê |
|---|---|---|
| Marcelo | 7/10 | Produto menos "sexy" tecnicamente mas resolve problema real de produto |
| Elvis | 9/10 | Muda o discurso de vendas. "Operacional em 2 horas" é argumento de fechamento |
| Elvimar | 7/10 | ROI mensurável em churn de ativação. Estrutura escalável para 3.200+ clientes |

### Implementação para as 8h

```
Stack: FastAPI + Claude API + parser de CSV/PDF + dataset de benchmark de políticas (mock)

Hora 0-1: Definir schema de input (CSV com: nome, cargo, departamento, nível hierárquico, gestor)
Hora 1-2: Parser: CSV → grafo de hierarquia organizacional
Hora 2-4: Geração de config: grafo → centros de custo + tags + políticas por nível
Hora 4-5: Benchmark: comparar políticas geradas com médias do setor (dataset mockado com 10 perfis)
Hora 5-6: UI de revisão: tela onde admin vê tudo gerado e aprova/edita item por item
Hora 6-7: Export para formato de importação da Onfly (ou simulação)
Hora 7-8: Polir demo, preparar CSV de empresa fictícia realista para o pitch
```

**MVP mínimo aceitável:**
1. Upload de CSV com estrutura organizacional
2. Geração automática de centros de custo em hierarquia
3. Sugestão de políticas por nível (analista, gerente, diretor, C-level)
4. Fluxo de aprovação sugerido baseado na hierarquia detectada
5. Tela de revisão onde admin aprova ou edita

### Riscos e mitigações

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Jurado pergunta: "não é onboarding que já existe?" | Alta | "O que existe são dicas para o usuário. Isso é configuração da empresa — criar 1.344 centros de custo. São coisas diferentes." |
| Dataset de benchmark insuficiente para comparação | Média | Usar os dados das 3.200 empresas da base Onfly (anonimizados) como benchmark real |
| Parsing de org chart complexo em 8h | Média | Simplificar: aceitar apenas CSV estruturado (nome, departamento, nível, gestor). PDF como bônus. |
| Onfly já tem isso em roadmap não divulgado | Baixa | Se for o caso, reposicionar como "aceleração do roadmap com IA" — ainda válido |

---

## 🥉 Ideia 3 — Onfly Concilia: Reconciliação Automática Azulzinho + NF-e

### O problema

A Onfly tem um cartão corporativo (Azulzinho) que gera transações. Os viajantes submetem expense reports com recibos e NF-e. O departamento financeiro precisa cruzar os dois manualmente: cada transação do cartão precisa ter um recibo correspondente, cada recibo precisa ter uma transação correspondente.

Hoje isso é feito manualmente, por planilha, no final do mês. É a parte mais tediosa — e mais crítica — do fechamento financeiro. **Ninguém está cruzando esses dados automaticamente.**

> **Diferente do Trust Expense** (que valida se a despesa está dentro da política): o Concilia valida se a despesa *existiu de verdade* — se o cartão foi usado, se a NF-e bate com a transação, se há gastos do cartão sem recibo correspondente (que é o sinal de fraude mais comum).

### O que é

Agente de IA que opera sobre três fontes de dados que a Onfly já possui:

1. **Extrato Azulzinho** — transações do cartão corporativo (data, valor, estabelecimento, CNPJ)
2. **Expense reports** — despesas submetidas pelos viajantes (data, valor, categoria, recibo)
3. **NF-e/DANFE** — notas fiscais anexadas às despesas

O agente cruza os três e produz:

- **Match confirmado** ✅ — transação + recibo + NF-e batem
- **Transação sem recibo** ⚠️ — alguém usou o Azulzinho mas não submeteu despesa (mais comum: viajante esqueceu ou está escondendo)
- **Recibo sem transação** ⚠️ — despesa submetida sem transação no cartão (reembolso em dinheiro ou possível fraude)
- **Divergência de valor** ⚠️ — NF-e com valor diferente da transação (erro de troco, taxa de serviço não declarada)
- **Relatório de fechamento** — pronto para importar no ERP, sem trabalho manual

### Por que não existe ainda

Está listado em arch-v2 como área aberta: *"Conciliação automática (IA que cruza NFs com extratos bancários)"*. O Trust Expense valida política. A Conciliação valida realidade financeira. São camadas completamente diferentes — um é compliance, o outro é controladoria.

### Por que vence — na voz de cada jurado

**Marcelo (CEO):**
> "Esse produto tem o tipo de utilidade silenciosa que eu respeito — ninguém fala dele mas todo mundo precisa. É o tipo de coisa que o contador da empresa vai usar todo mês e nunca mais vai conseguir viver sem. Demo: extrato com 50 transações + 47 recibos → reconciliação em 10 segundos → 3 discrepâncias detectadas."

**Elvis (Comercial):**
> "Esse é o argumento para o CFO de uma empresa grande. 'A Onfly não só gerencia suas viagens — ela fecha seu mês.' Isso é positioning de plataforma financeira, não de OBT. Diferencia completamente da Argo, do Paytrack, de todo mundo que só faz booking e expense."

**Elvimar (CFO):**
> "Isso é o que eu faço há 20 anos na mão, no Excel. Levava dias. Se um agente faz em 30 segundos com a mesma precisão, isso não é produto — é religião. E o valor não é só tempo: é a detecção dos 'esquecimentos' que ninguém fala. Todo CFO sabe que tem transações do cartão sem recibo. Ninguém quer admitir. Esse produto coloca isso na tela."

### Pontuação estimada

| Critério | Nota | Justificativa |
|---|---|---|
| Inovação | 7/10 | Área aberta no arch-v2. Reconciliação com IA é novo no mid-market BR |
| Viabilidade | 8/10 | Matching de dados estruturados é tecnicamente simples. Azulzinho data já existe |
| Impacto | 9/10 | Fecha o loop financeiro completo. Detecta fraude. ROI direto em horas de trabalho eliminadas |
| Usabilidade | 7/10 | Produto de background para o financeiro — menos UX-heavy, mais relatório-focused |
| Apresentação | 7/10 | "3 dias de trabalho manual → 30 segundos" é impactante mas menos visual que WhatsApp demo |
| **TOTAL** | **38/50** | |

**Pontuação por jurado:**

| Jurado | Nota | Por quê |
|---|---|---|
| Marcelo | 7/10 | Produto útil e simples de implementar. Menos wow mas resolve dor real |
| Elvis | 6/10 | Posiciona Onfly como plataforma financeira — diferenciador de categoria, não de feature |
| Elvimar | 10/10 | É literalmente o trabalho do CFO/Controller automatizado. ROI imediato e irrefutável |

### Implementação para as 8h

```
Stack: Python/FastAPI + pandas para matching + Claude para análise de anomalias + relatório em HTML/PDF

Hora 0-1: Definir schemas: extrato Azulzinho (CSV), expense report (JSON mock), NF-e (XML ou mock)
Hora 1-3: Engine de matching: fuzzy match por valor + data + CNPJ (tolerância de ±R$0,01 e ±1 dia)
Hora 3-4: Classificação de resultados: match ✅ / transação sem recibo ⚠️ / recibo sem transação ⚠️ / divergência ⚠️
Hora 4-5: Lógica de anomalia com IA: Claude analisa padrões suspeitos ("3 refeições no mesmo estabelecimento no mesmo dia")
Hora 5-6: Relatório de fechamento: HTML visual com resumo + lista de discrepâncias + ação recomendada por item
Hora 6-7: Export para CSV pronto para importar no ERP (Omie format)
Hora 7-8: Preparar dataset realista com anomalias intencionais para o demo
```

**MVP mínimo aceitável:**
1. Upload de extrato Azulzinho (CSV) + expense reports (mock JSON)
2. Match automático por valor + data + estabelecimento
3. Lista de discrepâncias com classificação (sem recibo / sem transação / divergência)
4. Número de horas economizadas estimado ("processo manual levaria X horas")
5. Relatório exportável

### Riscos e mitigações

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Acesso ao extrato Azulzinho para demo | Média | Usar dataset sintético realista — CVS com 50 transações e 47 recibos matching |
| Jurado pergunta: "isso não é só um VLOOKUP?" | Alta | "Um VLOOKUP não detecta que o mesmo CNPJ aparece 3x no mesmo dia. Não analisa padrão de comportamento. Não gera o relatório de fechamento com recomendações." |
| Elvimar adorar mas Marcelo e Elvis não engajarem | Média | Posicionar como "camada financeira da Onfly" — upgrade de positioning, não só feature |
| Trust Expense já faz parte disso | Baixa | Trust Expense valida política (R$300 de hotel está acima do limite). Concilia valida existência (a transação realmente aconteceu?). São perguntas diferentes. |

---

## Matriz comparativa — novas ideias vs. top 3 original

| Ideia | Marcelo | Elvis | Elvimar | Score Jurados | Score Critérios |
|---|---|---|---|---|---|
| Policy Audit Agent (top 1) | 9 | 8 | 10 | 27/30 | 42/50 |
| **Onfly Zero** (nova #1) | 9 | 9 | 8 | **26/30** | **44/50** |
| Onfly Forecast (top 2) | 8 | 8 | 10 | 26/30 | 41/50 |
| **Onfly AutoConfig** (nova #2) | 7 | 9 | 7 | **23/30** | **40/50** |
| Onfly Copilot v3 (top 3) | 8 | 9 | 6 | 23/30 | 38/50 |
| **Onfly Concilia** (nova #3) | 7 | 6 | 10 | **23/30** | **38/50** |

### Insight de combinação

**Onfly Zero + Policy Audit Agent** é a combinação mais poderosa:
- Zero resolve o MOMENTO DE CAPTURA (viajante tira foto no WhatsApp)
- Policy Audit resolve o MOMENTO DE VALIDAÇÃO (agente audita antes de aprovar)
- Juntos: a jornada de expense inteira, do recibo na mão até a aprovação, sem toque humano

> "Você tira foto no WhatsApp → o agente captura → valida contra a política → sugere aprovação → gestor aprova no WhatsApp. Do recibo ao aprovado: 45 segundos. Sem app, sem formulário, sem erro de categorização."

Se a equipe tiver pessoas suficientes, essa combinação é o pitch mais forte possível.

---

## Por que essas 3 ideias não foram geradas antes

| Ideia | Por que não apareceu no top 5 original |
|---|---|
| Onfly Zero | O foco estava em auditoria e inteligência de dados — ninguém parou para perguntar "por que o expense ainda é manual se o Flow Expense existe?" |
| Onfly AutoConfig | A discussão foi sobre USO da plataforma. Ninguém olhou para a DOR DE CONFIGURAÇÃO — o trabalho que precede o uso |
| Onfly Concilia | O arch-v2 listou como área aberta mas nenhuma ideia a desenvolveu. Estava escondida entre as áreas abertas, sem elaboração |

Os melhores produtos de hackathon surgem de perguntas que ninguém fez. Essas três perguntas eram: *"E o momento de captura?"*, *"E o onboarding da empresa?"*, e *"E o fechamento financeiro?"*
