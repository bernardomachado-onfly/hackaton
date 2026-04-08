# Protocolo de Gerenciamento de Contexto

> Define como Claude deve gerenciar, atualizar e manter os contextos ao longo das sessões.

---

## Princípio central

**O contexto é um produto vivo.** Assim como o código evolui, os arquivos em `.context/` devem evoluir junto. Claude é responsável por manter essa sincronização.

---

## Estrutura dos contextos

```
.context/
  MASTER.md              ← XML entry point — ler PRIMEIRO em qualquer sessão
  deep/                  ← detalhes profundos (consultar quando necessário)
    empresa.md           ← stack atual Onfly + o que não repetir
    concorrentes.md      ← análise competitiva BR/MX/global
    jurados.md           ← psicologia dos 3 fundadores
    ideias.md            ← ranking completo rodadas 1 e 2
    recomendacao.md      ← relatório final + argumentos de pitch
  ops/                   ← operacional da sessão
    estado-atual.md      ← FONTE DA VERDADE — decisões e status
    plataforma.md        ← observações da plataforma + feedback monitor
    context-mgmt.md      ← este arquivo
  prompts/               ← prompts prontos para uso
    meta-prompt.md       ← system prompt completo para novas sessões
    eng-prompt.md        ← boas práticas de prompt engineering
  _source/               ← IMUTÁVEL — documentos originais
```

---

## Quando atualizar

| Evento | Arquivo(s) a atualizar |
|---|---|
| Nova decisão de produto | `ops/estado-atual.md` |
| Feature implementada | `deep/empresa.md` + `ops/estado-atual.md` + `README.md` |
| Feedback do monitor | `ops/plataforma.md` + `ops/estado-atual.md` |
| Nova ideia ou descarte | `deep/ideias.md` + `ops/estado-atual.md` |
| Mudança de recomendação | `ops/estado-atual.md` (registrar evolução, não sobrescrever) |
| Concorrente lança algo | `deep/concorrentes.md` |
| Observação da plataforma | `ops/plataforma.md` |
| Qualquer mudança relevante | `README.md` |

---

## Checklist de início de sessão

```
[ ] Ler MASTER.md (entry point — carrega tudo)
[ ] Ler ops/estado-atual.md (fonte da verdade corrente)
[ ] git log --oneline -5 (verificar código novo não refletido nos contextos)
[ ] Verificar branch atual — se for main, criar feature/nome-funcional antes de codar
[ ] Corrigir conflitos antes de começar nova tarefa
```

## Checklist de fim de sessão

```
[ ] ops/estado-atual.md atualizado com decisões da sessão
[ ] README.md sincronizado com features implementadas
[ ] Novas descobertas registradas no arquivo relevante
[ ] Nenhum conflito entre arquivos
[ ] Commit dos contextos atualizados
```

---

## Regras de não-conflito

1. **`ops/estado-atual.md` é a fonte da verdade** — quando houver dúvida, prevalece.
2. **Nunca sobrescreva histórico** — use tabelas de evolução com datas.
3. **Nunca mova ideias para "descartadas" sem registrar o motivo.**
4. **`_source/` é imutável** — apenas adicionar, nunca editar ou deletar.
5. **`MASTER.md` deve refletir o estado atual** — quando `estado-atual.md` mudar, atualizar MASTER.md também.

## Trabalho paralelo (múltiplos agentes/pessoas)

Quando o time trabalha em paralelo no mesmo repo:

- Cada agente atualiza apenas a seção de `estado-atual.md` correspondente à sua feature.
- Nenhum agente reescreve seções que não são de sua responsabilidade.
- Conflitos de merge em `estado-atual.md` são resolvidos **manualmente pelo humano** antes do próximo commit — nunca pelo agente.
- Em caso de dúvida sobre o estado real do projeto, rodar `git log --oneline -5` antes de começar.

---

## Como registrar feature implementada

1. Adicionar à seção "Implementado" de `ops/estado-atual.md`
2. Atualizar `deep/empresa.md` (seção "já existe")
3. Atualizar `README.md`

Template de entrada em `estado-atual.md`:
```markdown
### [DATA] — [Título]
**O que:** [descrição]
**Por quê:** [motivação]
**Impacto:** [o que muda]
**Arquivos afetados:** [lista]
```

---

## Anti-padrões a evitar

| Anti-padrão | O que fazer |
|---|---|
| Sobrescrever histórico em `estado-atual.md` | Adicionar entrada datada |
| Criar arquivo sem atualizar README | Sempre atualizar README |
| Marcar ideia como descartada sem motivo | Registrar motivo em `deep/ideias.md` |
| Atualizar MASTER.md sem atualizar `estado-atual.md` | Atualizar ambos |
| Implementar feature sem registrar em `deep/empresa.md` | Atualizar imediatamente |
