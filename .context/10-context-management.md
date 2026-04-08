# Protocolo de Gerenciamento de Contexto

> Este arquivo define como o Claude deve gerenciar, atualizar e manter os contextos
> ao longo das sessões e da evolução do produto no repositório.

---

## Princípio central

**O contexto é um produto vivo.** Assim como o código evolui, os arquivos em `.context/`
devem evoluir junto. Claude é responsável por manter essa sincronização — nunca deixar
contexto desatualizado, nunca criar conflito entre arquivos, nunca perder decisão importante.

---

## Quando atualizar contextos

### Gatilhos obrigatórios de atualização

| Evento | Arquivo(s) a atualizar |
|---|---|
| Nova decisão de produto tomada | `00-estado-atual.md` |
| Feature nova implementada no repo | `01-produto-onfly.md` (seção "já existe") + `00-estado-atual.md` |
| Feedback novo do monitor ou jurados | `05-monitor.md` + `00-estado-atual.md` |
| Nova ideia gerada ou descartada | `03-ideias.md` ou `07-novas-ideias.md` + `00-estado-atual.md` |
| Mudança de recomendação principal | `00-estado-atual.md` (registrar a evolução, não sobrescrever) |
| Concorrente lança algo relevante | `02-concorrentes.md` |
| Observação nova da plataforma | `04-plataforma.md` |
| Qualquer mudança relevante | `README.md` (manter sempre sincronizado) |

### Gatilhos de atualização do README

O `README.md` deve ser atualizado sempre que:
- Uma nova feature for implementada no produto
- O status de uma ideia mudar (em desenvolvimento → entregue)
- Um novo arquivo de contexto for adicionado
- A recomendação principal mudar
- O MVP for definido ou alterado

---

## Como atualizar sem conflito

### Regras de não-conflito

1. **`00-estado-atual.md` é a fonte da verdade corrente** — quando houver dúvida sobre
   qual é a recomendação atual ou decisão vigente, este arquivo prevalece.

2. **Nunca sobrescreva histórico** — use tabelas de evolução ou seções datadas.
   Exemplo em `00-estado-atual.md`:
   ```
   | Data | Recomendação | Motivo da mudança |
   |---|---|---|
   | 2026-04-08 | Policy Audit Agent | Dor confirmada ao vivo na plataforma |
   ```

3. **Nunca mova ideias para "descartadas" sem registrar o motivo** — o arquivo
   `03-ideias.md` deve manter o histórico de por que cada ideia foi descartada ou promovida.

4. **Novos arquivos de contexto recebem número sequencial** — `11-`, `12-`, etc.
   Nunca reutilize números de arquivos deletados.

5. **`_source/` é imutável** — arquivos em `_source/` são documentos originais.
   Nunca edite, mova ou delete. Apenas adicione.

6. **`09-meta-prompt.md` deve refletir o estado atual** — quando `00-estado-atual.md`
   mudar, verifique se o meta-prompt precisa ser atualizado também (seção `top_ideas_ranked`).

---

## Protocolo por tipo de sessão

### Início de sessão
Antes de qualquer trabalho, Claude deve:
1. Ler `00-estado-atual.md` para saber onde o projeto está
2. Verificar se há código novo no repo que não está refletido nos contextos
3. Identificar qualquer conflito entre arquivos existentes e corrigi-lo

```
Checklist de início de sessão:
[ ] Ler 00-estado-atual.md
[ ] git log --oneline -10 (ver o que mudou desde a última sessão)
[ ] Verificar se produto implementado ≠ contexto registrado
[ ] Corrigir conflitos antes de começar nova tarefa
```

### Durante a sessão
- A cada decisão importante tomada → atualizar `00-estado-atual.md` imediatamente
- A cada feature implementada → atualizar `01-produto-onfly.md` e `README.md`
- A cada insight novo → registrar no arquivo de contexto mais relevante

### Fim de sessão
Antes de fechar, Claude deve verificar:
1. `00-estado-atual.md` reflete o estado real do projeto?
2. `README.md` está sincronizado com o que foi feito?
3. Há decisões ou descobertas importantes que precisam ser persistidas?
4. O `09-meta-prompt.md` precisa de atualização?

```
Checklist de fim de sessão:
[ ] 00-estado-atual.md atualizado
[ ] README.md sincronizado
[ ] Novas ideias ou descobertas registradas
[ ] Nenhum conflito entre arquivos
[ ] Commit dos contextos atualizados
```

---

## Como registrar evolução do produto

Quando uma feature for implementada no repositório, Claude deve:

1. **Adicionar à seção "Implementado" de `00-estado-atual.md`:**
   ```markdown
   ## Implementado
   | Feature | Data | Arquivo(s) | Status |
   |---|---|---|---|
   | Policy Audit Agent MVP | 2026-04-08 | src/agents/policy_audit.py | ✅ Demo-ready |
   ```

2. **Mover de "ideia" para "produto" em `03-ideias.md`:**
   ```markdown
   > ✅ IMPLEMENTADO em 2026-04-08 — ver src/agents/policy_audit.py
   ```

3. **Atualizar `README.md`** com a feature na seção correta.

4. **Atualizar `01-produto-onfly.md`** adicionando a feature na lista
   "já existe" para evitar que futuras sessões tentem reimplementar.

---

## Estrutura de arquivos e responsabilidade

```
.context/
  00-estado-atual.md       → FONTE DA VERDADE. Atualizar a cada decisão.
  01-produto-onfly.md      → Atualizar quando feature for implementada.
  02-concorrentes.md       → Atualizar quando concorrente lançar algo relevante.
  03-ideias.md             → Atualizar status das ideias (ideia → em dev → implementado).
  04-plataforma.md         → Atualizar quando nova observação da plataforma for feita.
  05-monitor.md            → Atualizar com cada nova conversa com o monitor.
  06-perfil-socios.md      → Atualizar se novos insights sobre os jurados surgirem.
  07-novas-ideias.md       → Adicionar novas ideias geradas em sessões futuras.
  08-prompt-engineering.md → Raramente atualiza (referência estável).
  09-meta-prompt.md        → Atualizar quando top_ideas_ranked ou contexto mudar.
  10-context-management.md → Este arquivo. Atualizar se o protocolo evoluir.
  _source/                 → IMUTÁVEL. Apenas adicionar novos docs originais.

README.md                  → Sempre sincronizado com o estado atual do produto.
```

---

## Evitando perda de contexto entre sessões

### O problema
Cada sessão do Claude começa sem memória da anterior. Sem um protocolo,
decisões importantes se perdem, contexto é duplicado ou contradito.

### A solução
`00-estado-atual.md` funciona como **memória persistente entre sessões**.
Tudo que foi decidido, descoberto ou implementado deve estar lá — datado e com motivo.

### Template de entrada em `00-estado-atual.md`
```markdown
### [DATA] — [Título da decisão/descoberta]
**O que:** [descrição objetiva]
**Por quê:** [motivação ou evidência]
**Impacto:** [o que muda a partir disso]
**Arquivos afetados:** [lista de arquivos de contexto ou código]
```

---

## Anti-padrões a evitar

| Anti-padrão | Por que é ruim | O que fazer em vez |
|---|---|---|
| Sobrescrever histórico em `00-estado-atual.md` | Perde rastro de por que decisões foram tomadas | Adicionar entrada datada, manter histórico |
| Criar novo arquivo de contexto sem atualizar o índice no README | Contexto fica oculto | Sempre atualizar README ao criar arquivo |
| Marcar ideia como descartada sem motivo | Próxima sessão pode resgatar a ideia por não saber por que foi descartada | Registrar motivo do descarte em `03-ideias.md` |
| Atualizar meta-prompt sem atualizar `00-estado-atual.md` | Cria conflito entre os dois | Atualizar ambos na mesma sessão |
| Implementar feature sem registrar em `01-produto-onfly.md` | Próxima sessão pode reimplementar | Atualizar imediatamente após implementar |
| Deixar README desatualizado | Time não sabe o que está implementado | README é o primeiro arquivo a atualizar |
