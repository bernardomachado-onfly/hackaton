# Prompt Engineering — Boas Práticas Anthropic

> Fonte: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
> Referência oficial para construção dos prompts deste hackathon.

---

## Princípios fundamentais

### 1. Seja claro e direto
- Instruções explícitas superam instruções implícitas
- **Regra de ouro:** mostre o prompt para um colega sem contexto. Se ficar confuso, o Claude também ficará.

| Fraco | Forte |
|---|---|
| "Crie um dashboard" | "Crie um dashboard de analytics. Inclua as features relevantes. Vá além do básico." |
| "Nunca use reticências" | "Sua resposta será lida por TTS, então nunca use reticências pois o engine não sabe pronunciá-las." |

### 2. Use tags XML para estruturar
- Tags eliminam ambiguidade em prompts complexos
- Use tags consistentes: `<instructions>`, `<context>`, `<input>`, `<examples>`

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

### 3. Atribua um papel (role)
Uma frase já faz diferença:
`"Você é um analista estratégico sênior especializado em travel tech B2B."`

### 4. Use exemplos efetivos
- 3–5 exemplos = melhor resultado
- Envoltos em `<example>` ou `<examples>`
- Relevantes + diversos + estruturados

---

## Controle de output

### Diga o que fazer, não o que não fazer
| Fraco | Forte |
|---|---|
| "Não use markdown" | "Escreva em prosa clara com parágrafos completos." |

### Contexto longo (20k+ tokens)
- **Coloque dados longos no topo** do prompt (melhoria de até 30% na qualidade)
- Estruture com `<documents>` → `<document>` → `<source>` + `<document_content>`

---

## Raciocínio e chain of thought

- Use `<thinking>` quando quiser raciocínio explícito
- "Reflita cuidadosamente sobre a qualidade dos resultados antes de prosseguir."
- Autocorreção: gere rascunho → revise contra critérios → refine

---

## Sistemas agênticos

```xml
<default_to_action>
Por padrão, implemente mudanças em vez de apenas sugerir. Infira a ação
mais útil e prossiga. Use ferramentas para descobrir detalhes faltantes.
</default_to_action>

<use_parallel_tool_calls>
Se pretende chamar múltiplas ferramentas sem dependência entre elas,
faça todas as chamadas independentes em paralelo.
</use_parallel_tool_calls>

<action_safety>
Ações locais e reversíveis são encorajadas. Para ações difíceis de reverter
ou que afetam sistemas compartilhados, confirme com o usuário.
</action_safety>

<no_overengineering>
Faça apenas mudanças diretamente solicitadas. Não adicione features além
do pedido. Não crie abstrações para operações únicas.
</no_overengineering>

<investigate_before_answering>
Nunca especule sobre código ou arquivos que não abriu. Se o usuário
referenciar um arquivo específico, LEIA-O antes de responder.
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
  <constraints>[Restrições]</constraints>
  <output_format>[Como estruturar a resposta]</output_format>
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
