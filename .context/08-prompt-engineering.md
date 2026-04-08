# Prompt Engineering — Boas Práticas Anthropic

> Fonte: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
> Referência oficial para construção dos prompts deste hackathon.

---

## Princípios fundamentais

### 1. Seja claro e direto
- Instruções explícitas superam instruções implícitas
- Use listas numeradas quando a ordem importa
- **Regra de ouro:** mostre o prompt para um colega sem contexto. Se ele ficar confuso, o Claude também ficará.

| Fraco | Forte |
|---|---|
| "Crie um dashboard" | "Crie um dashboard de analytics. Inclua o máximo de features relevantes. Vá além do básico." |
| "Nunca use reticências" | "Sua resposta será lida por TTS, então nunca use reticências pois o engine não sabe pronunciá-las." |

### 2. Dê contexto e motivação
- Explique o **porquê** — o Claude generaliza bem a partir de explicações
- Contexto ajuda o modelo a entender seus objetivos e entregar respostas direcionadas

### 3. Use tags XML para estruturar
- Tags eliminam ambiguidade em prompts complexos
- Envolva cada tipo de conteúdo em sua própria tag: `<instructions>`, `<context>`, `<input>`, `<examples>`
- Use tags consistentes e descritivas em todos os prompts
- Aninhe tags quando o conteúdo tem hierarquia natural

```xml
<context>
  [informações de fundo]
</context>

<instructions>
  [o que fazer]
</instructions>

<input>
  {{PROMPT_DO_USUARIO}}
</input>
```

### 4. Atribua um papel (role)
- Definir um papel no system prompt foca o comportamento e o tom
- Uma frase já faz diferença
- Exemplo: `"Você é um analista estratégico sênior especializado em travel tech B2B."`

### 5. Use exemplos efetivos
- **Relevantes:** espelham o caso de uso real
- **Diversos:** cobrem edge cases
- **Estruturados:** envoltos em `<example>` ou `<examples>`
- 3–5 exemplos = melhor resultado

---

## Controle de output e formato

### Diga o que fazer, não o que não fazer
| Fraco | Forte |
|---|---|
| "Não use markdown" | "Sua resposta deve ser composta de parágrafos fluidos em prosa." |

### Formato com XML
```xml
<avoid_excessive_markdown>
Escreva em prosa clara com parágrafos completos. Reserve markdown para
`código inline`, blocos de código e títulos simples (###). Evite **bold**,
*itálico* e listas com bullet excessivas. Incorpore itens naturalmente
em frases em vez de usar listas numeradas — a menos que o usuário peça
explicitamente ou os itens sejam verdadeiramente discretos.
</avoid_excessive_markdown>
```

### Contexto longo (20k+ tokens)
- **Coloque dados longos no topo** do prompt (melhoria de até 30% na qualidade)
- Estruture com `<documents>` → `<document>` → `<source>` + `<document_content>`
- Peça ao Claude para citar trechos relevantes antes de executar a tarefa

---

## Raciocínio e chain of thought

### Pensamento adaptativo (Claude 4.6)
- Use `<thinking>` quando quiser raciocínio explícito
- Peça ao Claude para pensar passo a passo antes de responder
- Após resultados de ferramentas: "Reflita cuidadosamente sobre a qualidade dos resultados antes de prosseguir."

### Autocorreção
1. Gere um rascunho
2. Peça ao Claude para revisar contra critérios específicos
3. Peça refinamento baseado na revisão
(Cada etapa é uma chamada separada — permite avaliação e logging)

### Verificação ao final
```
Antes de finalizar, verifique sua resposta contra [critérios de teste].
```

---

## Sistemas agênticos

### Ação vs. sugestão
```xml
<default_to_action>
Por padrão, implemente mudanças em vez de apenas sugerir. Se a intenção
do usuário for ambígua, infira a ação mais útil e prossiga. Use ferramentas
para descobrir detalhes faltantes em vez de adivinhar.
</default_to_action>
```

### Paralelismo de ferramentas
```xml
<use_parallel_tool_calls>
Se você pretende chamar múltiplas ferramentas e não há dependência entre
elas, faça todas as chamadas independentes em paralelo. Maximize o uso
de chamadas paralelas para aumentar velocidade e eficiência. Para chamadas
dependentes, execute sequencialmente.
</use_parallel_tool_calls>
```

### Segurança em ações reversíveis
```xml
<action_safety>
Considere a reversibilidade e o impacto potencial de suas ações.
Ações locais e reversíveis (editar arquivos, rodar testes) são encorajadas.
Para ações difíceis de reverter, que afetam sistemas compartilhados ou
são destrutivas, confirme com o usuário antes de prosseguir.
</action_safety>
```

### Evitar overengineering
```xml
<no_overengineering>
Faça apenas mudanças diretamente solicitadas ou claramente necessárias.
Não adicione features, refatore código ou faça "melhorias" além do pedido.
Não crie helpers ou utilidades para operações únicas.
Não desenhe para requisitos hipotéticos futuros.
</no_overengineering>
```

### Minimizar alucinações
```xml
<investigate_before_answering>
Nunca especule sobre código ou arquivos que não abriu. Se o usuário
referenciar um arquivo específico, LEIA-O antes de responder.
Investigue arquivos relevantes ANTES de responder sobre a codebase.
Dê respostas fundamentadas e livres de alucinação.
</investigate_before_answering>
```

---

## Template de prompt bem estruturado

```xml
<role>
  [Papel específico com expertise relevante]
</role>

<context>
  [Informações de fundo essenciais]
</context>

<instructions>
  [O que fazer, passo a passo se necessário]
  
  <constraints>
    [Restrições e limites]
  </constraints>
  
  <output_format>
    [Como estruturar a resposta]
  </output_format>
</instructions>

<examples>
  <example>
    <input>[exemplo de entrada]</input>
    <output>[exemplo de saída esperada]</output>
  </example>
</examples>

<input>
  {{PROMPT_DO_USUARIO}}
</input>

<thinking>
  Antes de responder, pense passo a passo:
  1. O que o usuário realmente precisa?
  2. Qual contexto é mais relevante aqui?
  3. Qual é a resposta mais direta e útil?
</thinking>
```

---

## Checklist antes de usar um prompt

- [ ] O papel está definido?
- [ ] O contexto relevante está incluído?
- [ ] As instruções são específicas e sem ambiguidade?
- [ ] O formato de output está especificado?
- [ ] Há exemplos quando necessário?
- [ ] O prompt diz o que FAZER (não o que não fazer)?
- [ ] Dados longos estão no topo?
- [ ] Tags XML estruturam as seções?
