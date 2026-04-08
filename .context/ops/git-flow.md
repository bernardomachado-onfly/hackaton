# Git Flow — Protocolo do Projeto

> Regras de branching e merge para o hackathon.
> O agente segue este protocolo automaticamente — sem precisar ser lembrado.

---

## Regra central

**`main` é sempre estável e demo-ready.** Nenhum código quebrado vai para a main.
Todo desenvolvimento acontece em branches `feature/`.

---

## Estrutura de branches

```
main                          ← estável, demo-ready, sempre funciona
└── feature/nome-funcional    ← desenvolvimento de cada feature
```

---

## Nomenclatura de branches

O nome da branch deve refletir a **funcionalidade que ela entrega** — não o número da task.

```
✅ feature/session-store
✅ feature/agent-service-tool-loop
✅ feature/search-flights-tool
✅ feature/search-hotels-tool
✅ feature/create-booking-tool
✅ feature/sse-chat-endpoint
✅ feature/react-chat-ui
✅ feature/landing-page

❌ feature/T2
❌ feature/task-4
❌ feature/fix
❌ feature/wip
```

**Regra:** lendo o nome da branch, qualquer membro do time entende o que ela faz.

---

## Fluxo obrigatório

```
1. Antes de codar — criar branch a partir da main atualizada:
   git checkout main
   git pull origin main
   git checkout -b feature/nome-funcional

2. Durante o desenvolvimento — commits pequenos e descritivos na branch:
   git add <arquivos específicos>
   git commit -m "feat: descrição do que foi implementado"

3. Ao concluir a feature — merge na main:
   git checkout main
   git pull origin main
   git merge feature/nome-funcional
   git push origin main

4. Após o merge — deletar a branch local:
   git branch -d feature/nome-funcional
```

---

## Regras de commit na branch

- Commits pequenos e frequentes — um commit por mudança lógica
- Mensagem no formato: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`
- Nunca commitar arquivos de ambiente (`.env`, credenciais)
- Sempre incluir os arquivos de contexto atualizados no mesmo commit da feature

---

## Regras para merge na main

- [ ] Feature funciona localmente sem erro
- [ ] Fluxo de demo testado na branch antes do merge
- [ ] `README.md` atualizado (ver `readme-mgmt.md`)
- [ ] `ops/estado-atual.md` atualizado com a feature
- [ ] Nenhum `console.log` de debug esquecido

---

## Trabalho paralelo entre membros do time

Cada pessoa/agente trabalha em sua própria branch `feature/`. Nunca duas pessoas
na mesma branch ao mesmo tempo. Conflitos são resolvidos no merge — não antes.

```
Dev 1: feature/search-flights-tool    ──┐
Dev 2: feature/search-hotels-tool     ──┼── merge na main em sequência
Dev 3: feature/agent-service-tool-loop─┘
```

---

## Referência rápida

| Situação | Comando |
|---|---|
| Iniciar nova feature | `git checkout -b feature/nome-funcional` |
| Ver branches locais | `git branch` |
| Atualizar branch com main | `git merge main` |
| Mergear na main | `git checkout main && git merge feature/nome-funcional` |
| Deletar branch após merge | `git branch -d feature/nome-funcional` |
