# MASTER — Contexto Hackathon Onfly

> Arquivo de entrada principal. Contém TUDO em formato XML otimizado para IA.
> Para detalhes profundos, ver arquivos em deep/, ops/, prompts/.
> Última atualização: 2026-04-08

---

<hackathon>

<status>
  FASE: Desenvolvimento em andamento
  IDEIA SELECIONADA: Onfly Copilot v3 — agente conversacional de reservas
  STACK: Node.js + TypeScript + Claude API (Anthropic SDK) + React + Express + SSE
  TEMPO: 8 horas | Data: 2026-04-08
  ENTREGÁVEIS: Produto funcional + Landing page + Post LinkedIn
  SPECS: Ver .specs/ na raiz do repo
</status>

<company>
  Nome: Onfly | Travel Tech B2B #1 LATAM | Fundação: 2018, Belo Horizonte
  Clientes: 3.200+ empresas (Vivara, PicPay, Hotmart, Vtex)
  Funding: R$240M Série B — Tidemark (Vale do Silício), abr/2025 | GMV: R$1,5bi/2025
  DNA: Quase morreu na pandemia (queda 99% abr/2020, demitiu 18/22). Voltou mais forte.
  Missão: "Digitalizar o analógico, simplificar o burocrático"
  Anti-padrões: emails para cotação, Excel para reembolso, processos de 12 etapas
</company>

<do_not_repeat>
  IA em produção (desclassificam se repetir):
  - Trust Expense: auditoria IA de despesas (notas repetidas, valores divergentes, datas)
  - Agente de Suporte: 77% resolutividade, CSAT 81% — chatbot de suporte
  - Onflynho: copiloto interno para funcionários
  - Recomendação de Hotel: sugere hotel ao comprar voo (110.995 reservas)
  - Servidores MCP: Model Context Protocol
  - Tradução automática Gemini: PT/EN/ES no app mobile
  - Duty of Care: mapa em tempo real de voos e incidentes globais

  Features 2025 lançadas (não repetir):
  Bagagem automática | Alteração de voo automática | Busca 33% mais rápida
  Spend Control | Flow Expense | Pix MED | Agendamento de recarga
  Exportação assíncrona | Auditoria de aprovação | Rateio CC (v0.5) | App offline-first
</do_not_repeat>

<platform_evidence>
  Observado diretamente na plataforma em 2026-04-08 — evidência, não hipótese:
  - Criar Despesa: 100% MANUAL. Sem OCR, sem auto-categorização visível.
  - Dashboard: PASSIVO. Dados estáticos, zero insight proativo.
  - Aprovações: BINÁRIAS. Sem scoring de risco ou priorização.
  - Configurações: 1.344 centros de custo + 276 tags. Campo minado de erros.
  - Duty of Care: JÁ EXISTE → elimina qualquer ideia de "API de Riscos".
</platform_evidence>

<monitor_feedback>
  - Expense management ganha pontos — tema aberto e bem-vindo pelos jurados.
  - Onfly Copilot: v2 tentou e falhou internamente → penalidade de originalidade confirmada.
  - Mitigante do Copilot: negócio tem interesse extremo, v3 mais viável, ativos disponíveis.
  - Sem penalidade de originalidade para ideias de expense.
</monitor_feedback>

<judges>
  <marcelo role="CEO" arquetipo="Desenvolvedor-Estrategista">
    Background: Ciência da Computação PUC Minas, ex-diretor e-commerce, voltou a codar com IA.
    QUER: demo ao vivo funcionando, código real, elimina ineficiência óbvia, dados concretos.
    NÃO QUER: slides sem demo, blá blá blá, promessas sem evidência, formalidade excessiva.
    PERGUNTA: "Funciona? Resolve dor real? É simples de usar?"
    Livros: Lean Startup, The Hard Thing About Hard Things.
  </marcelo>
  <elvis role="Comercial" arquetipo="Expansionista Relacional">
    Background: MBA FGV, ex-diretor de expansão/franchising.
    QUER: diferencial vs VOLL, ajuda a vender, potencial de crescimento, wow factor em demos.
    NÃO QUER: sem impacto em vendas/retenção, abordagem fria, falta de fit cultural.
    PERGUNTA: "Isso ajuda a vender mais? Retém clientes? Diferencia da VOLL?"
  </elvis>
  <elvimar role="CFO" apelido="Manzinho" arquetipo="CFO Operacional-Estruturador">
    Background: 20 anos controlling/auditoria, Big Four (PWC, KPMG, EY).
    QUER: ROI claro e mensurável, compliance robusto, número financeiro, estrutura escalável.
    NÃO QUER: sem projeção financeira, risco não mapeado, falta de processo/metodologia.
    PERGUNTA: "Qual o ROI? Como escala? Quais os riscos? Tem compliance?"
  </elvimar>
</judges>

<evaluation_criteria>
  Inovação (0-10): originalidade, uso criativo de IA, diferenciação de mercado.
  Viabilidade Técnica (0-10): implementação realista, arquitetura sólida, integração com stack.
  Impacto no Negócio (0-10): potencial de economia/receita, resolução de dor real.
  Usabilidade (0-10): experiência do usuário, curva de aprendizado, adoção facilitada.
  Apresentação (0-10): clareza, demo funcional, storytelling convincente.
  MÁXIMO: 50 pontos | OBRIGATÓRIO: 100% IA — sem IA = desclassificado.
</evaluation_criteria>

<competitive_landscape>
  VOLL (ameaça ALTA BR): R$700M Warburg Pincus | Smart Hub: AirSave + RatesAudit + ExpenseAudit
    → Agentes de IA mas SEM booking conversacional end-to-end.
  Paytrack: R$240M Série B (igual Onfly), 7k empresas, OBT lançado em 2025.
  VExpenses (VR Benefícios): distribuição massiva da base VR, OBT sem taxas em 2025.
  Argo: legado, 500+ migraram para Onfly em 2025. Forte no México (CFDI).
  Clara (México): 20k clientes, CFDI nativo, cartão MXN/BRL — SEM booking → GAP.
  Perk (ex-TravelPerk): AI-nativa €192M, SEM LATAM.
  Navan: IPO 2025 US$9.2bi, SEM localização LATAM.

  GAP COPILOT: nenhum player mid-market BR tem booking conversacional end-to-end.
  GAP EXPENSE: nenhum player mid-market BR tem Policy Audit Agent ou Zero-Touch Expense.
</competitive_landscape>

<available_assets>
  APIs de booking: aéreo, hotel, ônibus, aluguel de veículos.
  Agente de Suporte: base técnica de agente conversacional (77% resolutividade).
  Trust Expense: infraestrutura de análise de expense.
  Dados: 3.200+ empresas para benchmark real.
  Azulzinho: transações do cartão corporativo.
  Duty of Care: viagens em tempo real.
  Integrações ERP: Omie e outros.
  Servidores MCP: Model Context Protocol.
</available_assets>

<all_ideas_summary>
  RODADA 1 (briefing original):
  #1 Policy Audit Agent — 42/50 | M:9 E:8 EL:10 | ✅ Recomendada (não selecionada)
  #2 Onfly Forecast     — 41/50 | M:8 E:8 EL:10 | ✅ Recomendada (não selecionada)
  #3 Onfly Copilot v3   — 38/50 | M:8 E:9 EL:6  | 🚀 SELECIONADA PARA DESENVOLVIMENTO
  #4 Carbon Travel      — 33/50 | Diferencial futuro, ROI indireto.
  #5 Smart Rebooking    — 30/50 | ❌ VOLL já tem AirSave — evitar.

  RODADA 2 (novas ideias):
  #6 Onfly Zero         — 44/50 | M:9 E:9 EL:8  | Expense via WhatsApp, melhor score.
  #7 Onfly AutoConfig   — 40/50 | M:7 E:9 EL:7  | Config empresa automática via org chart.
  #8 Onfly Concilia     — 38/50 | M:7 E:6 EL:10 | Reconciliação Azulzinho + NF-e.
</all_ideas_summary>

<selected_idea>
  NOME: Onfly Copilot v3
  DECISÃO: 2026-04-08 — selecionada pelo time para desenvolvimento.

  CONCEITO:
  Agente conversacional que EXECUTA reservas completas via chat (página standalone).
  Fluxo coberto: aéreo → hospedagem → confirmação, com possibilidade de retomar conversa.
  Diferente do Agente de Suporte atual (responde dúvidas): este RESERVA.

  RESSALVAS PARA O PITCH:
  - Ideia não original (v2 falhou) → penalidade de originalidade confirmada pelo monitor.
  - Narrativa correta: "temos os ativos para finalmente fazer isso funcionar."
  - Argumento: "v2 falhou pq LLMs não eram bons o suficiente. v3 usa Claude — mudou o jogo."

  DIFERENCIAIS:
  - VOLL tem Smart Hub com agentes mas SEM booking conversacional end-to-end.
  - Nenhum player BR tem "reserva por chat" completa (voo + hotel + política).
  - Onfly já tem: APIs de booking, Agente de Suporte como base, dados de preferência.

  IMPLEMENTAÇÃO (8h):
  Stack: Node.js + TypeScript + Claude API + React + Express + SSE
  Tools: search_flights | search_hotels | create_booking
  Fases:
    F1 (sequential): Setup → SessionStore → AgentService
    F2 (parallel):   search_flights + search_hotels + create_booking tools
    F3 (sequential): SSE endpoint → React UI → Integração end-to-end
    F4 (parallel):   Landing page
  Pendente: Documentação da API Onfly (Postman) — usar mocks até receber.
  Specs completas: ver .specs/ na raiz do repo.
</selected_idea>

</hackathon>
