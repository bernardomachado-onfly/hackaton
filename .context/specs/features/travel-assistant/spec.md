# Travel Assistant — Especificação de Produto

> Feature: Onfly Copilot v3 — Agente de Reservas Conversacional
> Prioridade: P0 — core do hackathon

---

## Problema

O viajante corporativo precisa abrir a plataforma, navegar por múltiplas telas, preencher formulários e tomar decisões sem assistência contextual. O processo leva 5-10 minutos por reserva.

**Dor confirmada ao vivo:** nenhuma automação no fluxo de reserva para o viajante.

---

## Solução

Chat em linguagem natural que entende a intenção de viagem e executa a reserva completa — sem formulários, sem navegação.

---

## User Stories

### P1 — Core (deve funcionar no demo)

**US-001: Reserva de voo por linguagem natural**
```
Como viajante corporativo
Quero digitar "Preciso ir a São Paulo terça que vem e voltar quinta"
Para que o agente entenda minha intenção e busque voos disponíveis
Sem que eu precise preencher formulário ou selecionar origem/destino manualmente
```

**Critérios de aceite:**
- Agente extrai origem, destino, datas e passageiros da mensagem
- Confirma parâmetros com o viajante antes de buscar
- Apresenta no máximo 3 opções em formato legível
- Indica se a opção está dentro da política da empresa

---

**US-002: Seleção e confirmação de voo**
```
Como viajante
Quero responder "opção 1" ou "o mais barato"
Para que o agente selecione o voo e prossiga para hotel
Sem que eu precise voltar a uma tela de listagem
```

**Critérios de aceite:**
- Agente entende seleção por número, descrição ou critério
- Confirma a seleção antes de avançar
- Transição natural para busca de hotel

---

**US-003: Busca e seleção de hotel**
```
Como viajante
Quero que o agente automaticamente sugira hotéis no destino
Para completar minha reserva em sequência natural
Sem ter que iniciar nova busca
```

**Critérios de aceite:**
- Agente propõe hotel automaticamente após seleção do voo
- Apresenta opções com nome, preço e indicação de política
- Aceita seleção por linguagem natural

---

**US-004: Confirmação de booking**
```
Como viajante
Quero confirmar toda a reserva com uma mensagem simples
Para receber o número de confirmação sem burocracia
```

**Critérios de aceite:**
- Agente apresenta resumo completo (voo + hotel + datas + custo total)
- Solicita confirmação explícita antes de reservar
- Retorna número de reserva após confirmação

---

### P2 — Melhorias (se sobrar tempo)

**US-005: Retomada de sessão**
```
Como viajante
Quero continuar uma conversa anterior
Para não precisar repetir informações já fornecidas
```

**US-006: Contexto histórico**
```
Como viajante frequente
Quero dizer "o mesmo hotel que fiquei na última vez em SP"
Para que o agente entenda referências a viagens anteriores
```

**US-007: Alteração de reserva**
```
Como viajante
Quero digitar "muda meu voo para 2h mais tarde"
Para alterar reservas sem navegar pela plataforma
```

---

## Edge cases a tratar no MVP

| Situação | Comportamento esperado |
|---|---|
| Viajante não informa origem | Agente pergunta: "De qual cidade você vai partir?" |
| Datas ambíguas ("semana que vem") | Agente confirma datas específicas |
| Sem voos disponíveis | Agente informa e sugere datas alternativas |
| Voo fora da política | Agente indica e explica. Pode oferecer opção de solicitar exceção. |
| Viajante muda de ideia | Agente aceita e reinicia a busca |

---

## Não escopo (explícito)

- Aprovação do gestor (fora do fluxo do hackathon)
- Pagamento e faturamento
- Emissão real de bilhete (confirmar via mock)
- Multi-viajante na mesma reserva
- Integração com WhatsApp (UI web apenas)
