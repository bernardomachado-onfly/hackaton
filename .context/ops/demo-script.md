# Script da Demo — Hackathon Onfly

> Happy path exato para a apresentação de 4 minutos.
> Definir e ensaiar antes de iniciar F3 (integração end-to-end).

---

## Estrutura do tempo (4 min)

```
0:00 – 0:30  Abertura verbal (sem código)
0:30 – 3:00  Demo ao vivo no chat
3:00 – 4:00  Números e diferencial competitivo
```

---

## Abertura (0:00 – 0:30)

> "Abrimos a plataforma ontem. Para reservar uma viagem: 5 telas, 3 formulários, 8 minutos.
> Com o Copilot v3: uma mensagem, 30 segundos. Vou mostrar ao vivo."

---

## Demo ao vivo (0:30 – 3:00)

### Input do viajante
```
"Preciso ir a São Paulo na terça-feira e voltar na quinta."
```

### Resposta esperada do agente
```
Entendido! Vou buscar voos de [origem] para São Paulo.

Só confirmar: partindo de qual cidade? E quantos passageiros?
```

### Input 2
```
"Belo Horizonte, só eu mesmo."
```

### Resposta esperada (após tool call search_flights)
```
Encontrei 3 opções ✈️

✈️ Opção 1: LATAM LA3520 | 07:00 → 08:05 | R$ 380 | ✅ dentro da política
✈️ Opção 2: GOL G13821   | 10:30 → 11:35 | R$ 420 | ✅ dentro da política
✈️ Opção 3: LATAM LA3550 | 18:45 → 19:50 | R$ 290 | ✅ dentro da política

Qual prefere?
```

### Input 3
```
"O mais barato."
```

### Resposta esperada (após selecionar opção 3, aciona search_hotels)
```
Ótimo! LATAM LA3550, R$ 290.

Buscando hotéis em São Paulo para ter-qui... 🏨

🏨 Opção 1: Ibis Paulista ⭐⭐⭐ | R$ 220/noite | ✅ dentro da política
🏨 Opção 2: Novotel Jaraguá ⭐⭐⭐⭐ | R$ 380/noite | ✅ dentro da política
🏨 Opção 3: Pullman Ibirapuera ⭐⭐⭐⭐⭐ | R$ 680/noite | ⚠️ fora da política

Qual hotel?
```

### Input 4
```
"Ibis tá ótimo."
```

### Resposta esperada (resumo antes de confirmar)
```
Perfeito! Resumo da sua viagem:

✈️ LATAM LA3550 | CNF → GRU | Ter 15/04 18:45
✈️ Retorno: Qui 17/04 (voo a confirmar)
🏨 Ibis Paulista | Ter-Qui | R$ 220/noite × 2 = R$ 440
💰 Total estimado: R$ 730

Confirmo a reserva?
```

### Input 5
```
"Sim, pode confirmar."
```

### Resposta esperada (após create_booking)
```
✅ Reserva confirmada!

Número: ONF-X7K2M9
Voo: LATAM LA3550 | 15/04 18:45
Hotel: Ibis Paulista | 15-17/04

Boa viagem! 🚀
```

---

## Fechamento (3:00 – 4:00)

> "Do zero à reserva confirmada: menos de 2 minutos de conversa.
>
> Isso é o Onfly Copilot v3. A v2 tentou isso em 2022 — não funcionou porque
> os LLMs não eram bons o suficiente. Com Claude, finalmente funciona.
>
> Nenhum player mid-market brasileiro tem isso. A VOLL automatiza tarefas —
> a Onfly conversa e executa.
>
> Para as 3.200 empresas na base: sem onboarding, sem treinamento.
> É uma mensagem no chat."

---

## Contingências

| Problema | Plano B |
|---|---|
| SSE travar ao vivo | Ter sessão pré-aquecida com conversa já iniciada |
| API lenta | Reduzir max_tokens ou usar mock local sem latência |
| Agente retornar resposta errada | Ter screenshot da demo funcionando como fallback |
| Internet cair | Rodar backend local com mocks — sem dependência externa |

---

## Checklist pré-demo

- [ ] Sessão de teste rodada pelo menos 2x sem erro
- [ ] Mocks com dados realistas (CNF → GRU, datas futuras válidas)
- [ ] Backend rodando localmente (não depender de deploy)
- [ ] Tela limpa — sem console aberto, sem notificações
- [ ] Input do viajante digitado devagar (juiz precisa ler)
