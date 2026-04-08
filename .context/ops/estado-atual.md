# Estado Atual — Hackathon Onfly

> Fonte da verdade corrente. Atualizar a cada decisão importante.
> Última atualização: 2026-04-08

**PROGRESSO: 0% — Nenhum código implementado. Apenas contexto e specs prontos.**

---

## Decisão principal

**Ideia selecionada para desenvolvimento: Onfly Copilot v3**

| Data | Decisão | Motivo |
|---|---|---|
| 2026-04-08 | Análise inicial → Onfly Copilot v3 | Briefing arch-v2 |
| 2026-04-08 | Copilot com ressalvas (após monitor) | v2 falhou, penalidade originalidade |
| 2026-04-08 | Recomendação técnica → Policy Audit Agent | Dor confirmada ao vivo na plataforma |
| 2026-04-08 | **SELECIONADO: Onfly Copilot v3** | Decisão do time para desenvolvimento |

---

## O que está sendo construído

**Onfly Copilot v3** — agente conversacional que executa reservas completas via chat.

- Fluxo: aéreo → hotel → confirmação, com retomada de sessão
- Stack: Node.js + TypeScript + Claude API + React + Express + SSE
- Specs completas: `.context/specs/` na raiz do repositório

### Pendências críticas
- [ ] Documentação da API Onfly (Postman) — usar mocks até receber
- [ ] Definir quais endpoints da API Onfly estão disponíveis no hackathon
- [ ] Testar fluxo completo end-to-end antes do pitch

---

## Decisões tomadas

- **Duty of Care já existe** → ideia "API de Riscos" eliminada
- **Expense ganha pontos** com os jurados (confirmado pelo monitor)
- **Copilot v2 falhou** internamente → narrativa de pitch deve ser "finalmente funciona com LLMs"
- **Ativos disponíveis para reuso:** APIs de booking, Agente de Suporte, Trust Expense, dados 3.200+ empresas
- **Ideia selecionada:** Copilot v3, mesmo com penalidade de originalidade

---

## Implementado

| Feature | Data | Arquivos | Status |
|---|---|---|---|
| Estrutura do projeto | 2026-04-08 | `.context/specs/` | ✅ Planejado |
| Contextos estratégicos | 2026-04-08 | `.context/` | ✅ Completo |

---

## Em aberto

- [ ] Temas oficiais do hackathon ainda não divulgados (seção 8 de arch-v2 vazia)
- [ ] Confirmar disponibilidade das APIs Onfly para uso no hackathon
- [ ] Definir MVP mínimo para a demo de 4 minutos
- [ ] Preparar pitch com narrativa: "v2 falhou pq LLMs não eram bons. v3 usa Claude."
- [ ] Documentação de concorrentes para Q&A: "e a VOLL?" → "VOLL não tem booking conversacional"

---

## Alinhamento com jurados para o Copilot

| Jurado | Argumento principal |
|---|---|
| Marcelo (CEO) | Demo ao vivo no chat: "Preciso ir a SP terça" → voo reservado em 30s. Código real. |
| Elvis (Comercial) | "A VOLL tem agentes. Nenhum player BR tem booking conversacional. Esse é o diferencial." |
| Elvimar (CFO) | "Viajante economiza X min/reserva × Y reservas/mês × 3.200 empresas = R$Z/mês em produtividade." |

---

## Protocolo de atualização deste arquivo

Adicionar entrada sempre que:
- Uma decisão de produto for tomada
- Uma feature for implementada
- O status do MVP mudar
- Algo relevante for descoberto (API, concorrente, monitor)

Formato de entrada:
```
### [DATA] — [Título]
**O que:** [descrição]
**Por quê:** [motivação/evidência]
**Impacto:** [o que muda]
**Arquivos afetados:** [lista]
```
