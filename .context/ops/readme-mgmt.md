# README Management — Protocolo Automático

> O agente NUNCA precisa ser lembrado de atualizar o README.
> A atualização é automática sempre que o estado do projeto mudar.

---

## Regra central

**O README.md na raiz é o espelho do projeto.** Qualquer pessoa que abrir o repositório
deve entender imediatamente: o que está construído, o que falta, e como rodar.

Se o código avançou mas o README não reflete isso, o README está errado — corrija sempre.

---

## Gatilhos obrigatórios de atualização

O agente atualiza o README **imediatamente** após qualquer um destes eventos:

| Evento | O que atualizar no README |
|---|---|
| Feature implementada | Seção "Implementado" — adicionar linha com feature, data, arquivos, status |
| Fase do roadmap concluída | Seção "Status atual" — atualizar fase e próximo passo |
| Decisão de produto tomada | Seção "Status atual" — refletir mudança |
| Arquivo de contexto criado | Seção "Estrutura do repositório" — adicionar entrada |
| Dependência adicionada | Seção "Como rodar" — atualizar instruções se necessário |
| MVP redefinido | Seção "Ideia principal" — atualizar escopo |
| Demo script definido | Seção "Status atual" — próximo passo atualizado |

---

## Seções do README e o que cada uma deve refletir

### "Status atual"
```markdown
**Fase:** [fase atual do ROADMAP — ex: F2 em andamento]
**Progresso:** [X% — baseado em tasks concluídas]
**Último entregável:** [última feature implementada]
**Próximo passo:** [próxima task do ROADMAP.md]
```
→ Atualizar sempre que uma task for concluída ou fase mudar.

### "Implementado"
```markdown
| Feature | Data | Arquivos | Status |
|---|---|---|---|
| Nome da feature | YYYY-MM-DD | `src/caminho/arquivo.ts` | ✅ Funcional |
```
→ Adicionar linha a cada task concluída. Nunca remover linhas — apenas adicionar.

### "Estrutura do repositório"
→ Atualizar quando novos arquivos ou diretórios forem criados em `src/`.
→ `.context/` só muda se nova subpasta for criada.

### "Como rodar" (criar quando src/ tiver código)
```markdown
## Como rodar

\`\`\`bash
npm install
cp .env.example .env   # adicionar ANTHROPIC_API_KEY
npm run dev
\`\`\`
```
→ Criar esta seção quando T1 (scaffolding) for concluído.
→ Atualizar sempre que o processo de setup mudar.

---

## Formato de entrada na seção "Implementado"

```markdown
| [Nome da feature] | [YYYY-MM-DD] | `src/[caminho]` | ✅ Funcional |
| [Nome da feature] | [YYYY-MM-DD] | `src/[caminho]` | 🚧 Em andamento |
| [Nome da feature] | [YYYY-MM-DD] | `src/[caminho]` | ⚠️ Mock — sem API real |
```

---

## O que NÃO mudar no README

- Seção "Ideia principal" — só muda se o time mudar a ideia selecionada
- Seção "Jurados" — estática
- Seção "Contexto rápido" — estática
- Seção "Como usar o contexto" — estática

---

## Checklist antes de cada commit

```
[ ] README.md reflete o estado real do código?
[ ] Seção "Status atual" tem a fase e progresso corretos?
[ ] Toda feature implementada tem entrada na seção "Implementado"?
[ ] Se src/ foi criado, seção "Como rodar" existe?
[ ] Estrutura do repositório bate com o que existe em disco?
```

Se qualquer item for "não" — atualizar antes de commitar.
