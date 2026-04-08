import Anthropic from '@anthropic-ai/sdk';
import { toolDefinitions, executeTool, type ToolContext } from '../tools/index.js';
import { sessionStore, bookingStore, type Session, type FlightOption, type HotelOption } from './session.js';

const USE_CLAUDE = !!process.env.ANTHROPIC_API_KEY;
const client = USE_CLAUDE ? new Anthropic() : null;

function getSystemPrompt(timezone: string): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
  });
  const dateStr = formatter.format(now);
  const timeStr = timeFormatter.format(now);

  // Get day of week index (0=Sunday) for relative date calculations
  const dayOfWeek = new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'long' }).format(now);

  return `Você é o Travel Assistant da Onfly, um assistente inteligente especializado em reservas de viagens corporativas.

## Data e hora atual
Hoje é **${dateStr}**, ${timeStr} (fuso: ${timezone}).
Dia da semana atual: ${dayOfWeek}.

Use essa informação para resolver datas relativas:
- "amanhã" = o dia seguinte a hoje
- "depois de amanhã" = dois dias após hoje
- "segunda", "terça", etc. = o próximo dia da semana mencionado (se hoje é o dia mencionado, considere a próxima semana)
- "semana que vem" = 7 dias a partir de hoje
- "próxima segunda" = a próxima segunda-feira
- "daqui a X dias" = hoje + X dias

**IMPORTANTE**: Ao chamar as tools search_flights e search_hotels, SEMPRE converta datas relativas para o formato YYYY-MM-DD. Nunca passe "amanhã" ou "segunda" como parâmetro — calcule a data absoluta.

## Idioma
- Detecte automaticamente o idioma do usuário e responda no mesmo idioma
- Se o usuário escrever em inglês, responda em inglês
- Se escrever em espanhol, responda em espanhol
- Por padrão, responda em português do Brasil
- Mantenha o mesmo idioma durante toda a conversa, a menos que o usuário mude

## Seu papel
Você ajuda clientes da Onfly a reservar viagens completas (voos e hotéis) de forma conversacional e natural.

## Fluxo de reserva
1. **Entender a necessidade**: Pergunte origem, destino, datas e número de passageiros
2. **Buscar voos**: Use a tool search_flights para encontrar opções
3. **Apresentar opções de voo**: Mostre as opções de forma clara com preços, horários e cias aéreas
4. **Após seleção do voo**: Pergunte se o usuário precisa de hospedagem
5. **Buscar hotéis**: Se sim, use search_hotels para encontrar opções
6. **Apresentar opções de hotel**: Mostre nome, preço por noite, total, rating e amenidades
7. **Confirmar reserva**: Apresente um resumo completo (voo + hotel + valores) e peça confirmação
8. **Criar reserva**: Use create_booking para finalizar

## Regras importantes
- Seja conciso e profissional, mas amigável
- Sempre apresente preços em Reais (R$)
- Quando apresentar opções de voo, numere-as (1, 2, 3...) para facilitar a seleção
- Quando apresentar hotéis, numere-os também
- Se o usuário não especificar todos os dados, pergunte o que falta antes de buscar
- Se o usuário quiser pular o hotel, vá direto para confirmação
- Se o usuário quiser alterar algo, permita voltar a qualquer etapa
- Use emojis com moderação para tornar a conversa mais visual (✈️ para voos, 🏨 para hotéis, ✅ para confirmação)
- Quando o usuário mencionar datas relativas, confirme a data absoluta calculada antes de buscar (ex: "Entendi, amanhã dia 09/04, correto?")

## Retomada de conversa
Se o usuário já tem um voo selecionado mas não hotel, sugira continuar com a hospedagem.
Se a viagem já está confirmada, informe e pergunte se precisa de algo mais.

## Informações da sessão
O session_id do usuário será fornecido no contexto. Use-o ao criar a reserva.`;
}

export interface PassengerSummaryData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthdate: string;
  gender: string;
}

export interface StreamCallback {
  onText: (text: string) => void;
  onToolUse: (toolName: string) => void;
  onToolResult: (toolName: string) => void;
  onFlightOptions: (flights: FlightOption[]) => void;
  onHotelOptions: (hotels: HotelOption[]) => void;
  onPassengerSummary: (data: PassengerSummaryData) => void;
  onEnd: () => void;
  onError: (error: Error) => void;
}

// ============================================================
// MOCK AGENT — fluxo inteligente sem API key
// ============================================================

interface ParsedIntent {
  type: 'greeting' | 'search_flight' | 'select_flight' | 'search_hotel' | 'select_hotel' | 'skip_hotel' | 'confirm' | 'cancel' | 'unknown';
  origin?: string;
  destination?: string;
  date?: string;
  returnDate?: string;
  selection?: number;
}

const CITY_PATTERNS: Record<string, { name: string; iata: string }> = {
  'são paulo': { name: 'São Paulo', iata: 'GRU' },
  'sao paulo': { name: 'São Paulo', iata: 'GRU' },
  'sp': { name: 'São Paulo', iata: 'GRU' },
  'rio de janeiro': { name: 'Rio de Janeiro', iata: 'GIG' },
  'rio': { name: 'Rio de Janeiro', iata: 'GIG' },
  'rj': { name: 'Rio de Janeiro', iata: 'GIG' },
  'belo horizonte': { name: 'Belo Horizonte', iata: 'CNF' },
  'bh': { name: 'Belo Horizonte', iata: 'CNF' },
  'brasília': { name: 'Brasília', iata: 'BSB' },
  'brasilia': { name: 'Brasília', iata: 'BSB' },
  'salvador': { name: 'Salvador', iata: 'SSA' },
  'recife': { name: 'Recife', iata: 'REC' },
  'fortaleza': { name: 'Fortaleza', iata: 'FOR' },
  'curitiba': { name: 'Curitiba', iata: 'CWB' },
  'porto alegre': { name: 'Porto Alegre', iata: 'POA' },
  'florianópolis': { name: 'Florianópolis', iata: 'FLN' },
  'florianopolis': { name: 'Florianópolis', iata: 'FLN' },
  'manaus': { name: 'Manaus', iata: 'MAO' },
  'campinas': { name: 'Campinas', iata: 'VCP' },
  'goiânia': { name: 'Goiânia', iata: 'GYN' },
  'goiania': { name: 'Goiânia', iata: 'GYN' },
};

function findCities(text: string): { origin?: { name: string; iata: string }; destination?: { name: string; iata: string } } {
  const lower = text.toLowerCase();
  const found: Array<{ name: string; iata: string; pos: number }> = [];

  for (const [pattern, city] of Object.entries(CITY_PATTERNS)) {
    const idx = lower.indexOf(pattern);
    if (idx !== -1) {
      // Avoid duplicates (e.g. "sp" and "são paulo")
      if (!found.some(f => f.iata === city.iata)) {
        found.push({ ...city, pos: idx });
      }
    }
  }
  found.sort((a, b) => a.pos - b.pos);

  // Detect which is origin/destination using context words
  const hasParaPara = /\bpara\b/.test(lower) || /\bpra\b/.test(lower);
  const hasDe = /\bde\b/.test(lower) || /\bsaindo\b/.test(lower);

  if (found.length >= 2) {
    return { origin: found[0], destination: found[1] };
  }
  if (found.length === 1) {
    if (hasParaPara || /\bir\b/.test(lower) || /\bviajar\b/.test(lower)) {
      return { destination: found[0] };
    }
    return { destination: found[0] };
  }
  return {};
}

function findDate(text: string): string | undefined {
  // dd/mm, dd/mm/yyyy, dd/mm/yy
  const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/);
  if (dateMatch) {
    const day = dateMatch[1].padStart(2, '0');
    const month = dateMatch[2].padStart(2, '0');
    const year = dateMatch[3] ? (dateMatch[3].length === 2 ? '20' + dateMatch[3] : dateMatch[3]) : '2026';
    return `${year}-${month}-${day}`;
  }
  // "dia 15" pattern
  const diaMatch = text.match(/dia\s+(\d{1,2})(?:\s+de\s+(\w+))?/i);
  if (diaMatch) {
    const day = diaMatch[1].padStart(2, '0');
    const monthNames: Record<string, string> = {
      janeiro: '01', fevereiro: '02', março: '03', marco: '03', abril: '04',
      maio: '05', junho: '06', julho: '07', agosto: '08', setembro: '09',
      outubro: '10', novembro: '11', dezembro: '12',
    };
    const month = diaMatch[2] ? (monthNames[diaMatch[2].toLowerCase()] || '04') : '04';
    return `2026-${month}-${day}`;
  }
  return undefined;
}

function parseIntent(text: string, session: Session): ParsedIntent {
  const lower = text.toLowerCase().trim();

  // Greetings
  if (/^(oi|olá|ola|hey|hello|hi|bom dia|boa tarde|boa noite|e aí|eai)\b/.test(lower)) {
    return { type: 'greeting' };
  }

  // Confirm
  if (/^(sim|confirmo|confirmar|pode confirmar|isso|fechar|pode fechar|bora|vamos)\b/.test(lower) &&
      (session.trip.status === 'hotel_selected' || session.trip.status === 'flight_selected')) {
    return { type: 'confirm' };
  }

  // Cancel
  if (/^(não|nao|cancelar|cancela|desistir)\b/.test(lower) && session.trip.status !== 'idle') {
    return { type: 'cancel' };
  }

  // Skip hotel
  if (session.trip.status === 'flight_selected' &&
      (/não preciso|nao preciso|sem hotel|só voo|so voo|pular hotel|skip|só o voo|so o voo|não quero hotel|nao quero hotel/.test(lower))) {
    return { type: 'skip_hotel' };
  }

  // Select flight (by number)
  if (session.trip.status === 'searching_flight') {
    const numMatch = lower.match(/\b([1-4])\b|opção\s*([1-4])|primeiro|segundo|terceiro|quarto/);
    if (numMatch) {
      const wordToNum: Record<string, number> = { primeiro: 1, segundo: 2, terceiro: 3, quarto: 4 };
      const num = numMatch[1] ? parseInt(numMatch[1]) : numMatch[2] ? parseInt(numMatch[2]) : wordToNum[lower.match(/primeiro|segundo|terceiro|quarto/)?.[0] || ''] || 1;
      return { type: 'select_flight', selection: num };
    }
  }

  // Select hotel (by number)
  if (session.trip.status === 'searching_hotel') {
    const numMatch = lower.match(/\b([1-4])\b|opção\s*([1-4])|primeiro|segundo|terceiro|quarto/);
    if (numMatch) {
      const wordToNum: Record<string, number> = { primeiro: 1, segundo: 2, terceiro: 3, quarto: 4 };
      const num = numMatch[1] ? parseInt(numMatch[1]) : numMatch[2] ? parseInt(numMatch[2]) : wordToNum[lower.match(/primeiro|segundo|terceiro|quarto/)?.[0] || ''] || 1;
      return { type: 'select_hotel', selection: num };
    }
  }

  // Want hotel after flight selected
  if (session.trip.status === 'flight_selected' &&
      (/sim|hotel|preciso|quero|hospedagem|reservar hotel/.test(lower))) {
    return { type: 'search_hotel' };
  }

  // Search flight — detect cities/dates in message
  const cities = findCities(text);
  const date = findDate(text);
  if (cities.destination || /voo|passagem|voar|viajar|ir para|ir pra|reservar/.test(lower)) {
    return {
      type: 'search_flight',
      origin: cities.origin?.iata,
      destination: cities.destination?.iata,
      date,
    };
  }

  return { type: 'unknown' };
}

async function mockChat(session: Session, userMessage: string, callbacks: StreamCallback) {
  sessionStore.addMessage(session.id, { role: 'user', content: userMessage });

  const intent = parseIntent(userMessage, session);
  let response = '';

  const streamText = async (text: string) => {
    // Simulate streaming word by word
    const words = text.split(' ');
    for (const word of words) {
      const chunk = word + ' ';
      callbacks.onText(chunk);
      response += chunk;
      await new Promise(r => setTimeout(r, 30));
    }
  };

  try {
    switch (intent.type) {
      case 'greeting': {
        await streamText('Olá! 👋 Sou o Travel Assistant da Onfly.\n\nPosso ajudar você a reservar **voos** e **hotéis** de forma rápida.\n\nMe conta: **para onde você precisa viajar?** Pode me dizer a cidade de origem, destino e as datas.');
        break;
      }

      case 'search_flight': {
        const origin = intent.origin || session.trip.origin;
        const destination = intent.destination || session.trip.destination;
        const date = intent.date || session.trip.departureDate;

        if (!destination) {
          await streamText('Para buscar voos, preciso saber: **qual é o destino da viagem?**');
          break;
        }
        if (!origin) {
          await streamText(`Ótimo, destino anotado! E **de qual cidade você vai sair?**`);
          sessionStore.updateTrip(session.id, { destination });
          break;
        }
        if (!date) {
          await streamText(`Perfeito! Viagem de **${origin}** para **${destination}**. **Qual a data de ida?** (ex: 20/04)`);
          sessionStore.updateTrip(session.id, { origin, destination });
          break;
        }

        callbacks.onToolUse('search_flights');
        const flightResult = await executeTool('search_flights', {
          origin, destination, departure_date: date,
        });
        callbacks.onToolResult('search_flights');

        const flights = JSON.parse(flightResult);
        sessionStore.updateTrip(session.id, {
          status: 'searching_flight',
          origin, destination, departureDate: date,
        });

        await streamText(`✈️ Encontrei **${flights.total} voos** de **${origin}** para **${destination}** em ${formatDate(date)}:\n\n`);

        callbacks.onFlightOptions(flights.results as FlightOption[]);

        break;
      }

      case 'select_flight': {
        const flightResult = await executeTool('search_flights', {
          origin: session.trip.origin || 'GRU',
          destination: session.trip.destination || 'GIG',
          departure_date: session.trip.departureDate || '2026-04-20',
        });
        const flights = JSON.parse(flightResult);
        const idx = (intent.selection || 1) - 1;
        const selected = flights.results[idx] || flights.results[0];

        sessionStore.updateTrip(session.id, {
          status: 'flight_selected',
          flight: selected as FlightOption,
        });

        await streamText(`✅ Voo selecionado: **${selected.airline} ${selected.flightNumber}** — ${selected.departureTime} → ${selected.arrivalTime} por **R$ ${selected.price.toFixed(2)}**\n\n🏨 Você também precisa de **hospedagem** no destino? (sim/não)`);
        break;
      }

      case 'search_hotel': {
        const destination = session.trip.destination || 'Rio de Janeiro';
        const checkin = session.trip.departureDate || '2026-04-20';
        const checkout = session.trip.returnDate || addDays(checkin, 2);

        callbacks.onToolUse('search_hotels');
        const hotelResult = await executeTool('search_hotels', {
          city: destination, checkin, checkout,
        });
        callbacks.onToolResult('search_hotels');

        const hotels = JSON.parse(hotelResult);
        sessionStore.updateTrip(session.id, { status: 'searching_hotel' });

        await streamText(`🏨 Encontrei **${hotels.total} hotéis** em **${destination}** (${hotels.nights} noite${hotels.nights > 1 ? 's' : ''}):\n\n`);

        callbacks.onHotelOptions(hotels.results as HotelOption[]);

        break;
      }

      case 'select_hotel': {
        const destination = session.trip.destination || 'Rio de Janeiro';
        const checkin = session.trip.departureDate || '2026-04-20';
        const checkout = session.trip.returnDate || addDays(checkin, 2);

        const hotelResult = await executeTool('search_hotels', {
          city: destination, checkin, checkout,
        });
        const hotels = JSON.parse(hotelResult);
        const idx = (intent.selection || 1) - 1;
        const selected = hotels.results[idx] || hotels.results[0];

        sessionStore.updateTrip(session.id, {
          status: 'hotel_selected',
          hotel: selected as HotelOption,
        });

        const flight = session.trip.flight;
        const totalPrice = (flight?.price || 0) + selected.totalPrice;

        await streamText(`✅ Hotel selecionado: **${selected.name}** — R$ ${selected.totalPrice.toFixed(2)}\n\n`);
        await streamText(`📋 **Resumo da viagem:**\n\n`);
        if (flight) {
          await streamText(`✈️ **Voo:** ${flight.airline} ${flight.flightNumber} — ${flight.departureTime} → ${flight.arrivalTime} — R$ ${flight.price.toFixed(2)}\n`);
        }
        await streamText(`🏨 **Hotel:** ${selected.name} — R$ ${selected.totalPrice.toFixed(2)}\n\n`);
        await streamText(`💰 **Total: R$ ${totalPrice.toFixed(2)}**\n\n`);
        await streamText(`Deseja **confirmar a reserva**? (sim/não)`);
        break;
      }

      case 'skip_hotel': {
        const flight = session.trip.flight;
        sessionStore.updateTrip(session.id, { status: 'flight_selected' });

        await streamText(`Sem problemas! Vamos só com o voo.\n\n📋 **Resumo da viagem:**\n\n`);
        if (flight) {
          await streamText(`✈️ **Voo:** ${flight.airline} ${flight.flightNumber} — ${flight.departureTime} → ${flight.arrivalTime} — R$ ${flight.price.toFixed(2)}\n\n`);
          await streamText(`💰 **Total: R$ ${flight.price.toFixed(2)}**\n\n`);
        }
        await streamText(`Deseja **confirmar a reserva**? (sim/não)`);
        break;
      }

      case 'confirm': {
        callbacks.onToolUse('create_booking');
        const bookingResult = await executeTool('create_booking', {
          session_id: session.id,
          flight_id: session.trip.flight?.id,
          hotel_id: session.trip.hotel?.id,
        });
        callbacks.onToolResult('create_booking');

        const booking = JSON.parse(bookingResult);
        const bookingCode = booking.bookingId as string;
        sessionStore.updateTrip(session.id, { status: 'confirmed', bookingCode });

        // Populate bookingStore so the pass page can render the boarding pass
        bookingStore.set(bookingCode, {
          bookingCode,
          origin: session.trip.flight?.origin || session.trip.origin || 'GRU',
          originCity: session.trip.origin || 'São Paulo',
          destination: session.trip.flight?.destination || session.trip.destination || 'GIG',
          destCity: session.trip.destination || 'Rio de Janeiro',
          flightNumber: session.trip.flight ? `${session.trip.flight.airline} ${session.trip.flight.flightNumber}` : 'N/A',
          date: session.trip.departureDate || '',
          time: session.trip.flight?.departureTime || '',
          gate: 'A12',
          seat: '14A',
          passenger: 'Passageiro',
          bookingClass: 'Economy',
        });

        await streamText(`🎉 **Reserva confirmada!**\n\n📋 Código da reserva: **${bookingCode}**\n\n`);
        if (session.trip.flight) {
          await streamText(`✈️ ${session.trip.flight.airline} ${session.trip.flight.flightNumber}\n`);
        }
        if (session.trip.hotel) {
          await streamText(`🏨 ${session.trip.hotel.name}\n\n`);
        }
        await streamText(`A reserva foi enviada para aprovação. Você receberá uma confirmação por e-mail.\n\nPrecisa de mais alguma coisa?`);

        // Emitir resumo do passageiro com dados mock (em prod, viriam da sessão/perfil)
        callbacks.onPassengerSummary({
          name: booking.passenger?.name || 'João Silva',
          email: booking.passenger?.email || 'joao.silva@empresa.com',
          cpf: booking.passenger?.cpf || '123.456.789-00',
          phone: booking.passenger?.phone || '(11) 99999-9999',
          birthdate: booking.passenger?.birthdate || '15/03/1985',
          gender: booking.passenger?.gender || 'Masculino',
        });

        break;
      }

      case 'cancel': {
        sessionStore.updateTrip(session.id, { status: 'idle' });
        await streamText('Entendido, reserva cancelada. Se precisar de algo, é só falar! ✌️');
        break;
      }

      default: {
        if (session.trip.status === 'confirmed') {
          await streamText('Sua viagem já está confirmada! 🎉 Posso ajudar com uma **nova reserva** ou algo mais?');
        } else if (session.trip.status === 'flight_selected') {
          await streamText('Você já tem um voo selecionado. Deseja buscar um **hotel** para a viagem ou **confirmar** só com o voo?');
        } else {
          await streamText('Posso ajudar você a reservar uma viagem! Me diga:\n\n- **Origem** (de onde sai)\n- **Destino** (para onde vai)\n- **Data** da viagem\n\nExemplo: "Preciso de um voo de São Paulo para Rio de Janeiro dia 20/04"');
        }
      }
    }

    sessionStore.addMessage(session.id, { role: 'assistant', content: response.trim() });
    callbacks.onEnd();
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  }
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ============================================================
// CLAUDE AGENT — com API key
// ============================================================

async function claudeChat(session: Session, userMessage: string, timezone: string, callbacks: StreamCallback) {
  sessionStore.addMessage(session.id, { role: 'user', content: userMessage });

  const tripContext = buildTripContext(session);

  const messages: Anthropic.MessageParam[] = session.messages.map(m => ({
    role: m.role,
    content: m.content,
  }));

  let fullResponse = '';

  try {
    let continueLoop = true;

    while (continueLoop) {
      const stream = client!.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: `${getSystemPrompt(timezone)}\n\n## Contexto da sessão\nSession ID: ${session.id}\n${tripContext}`,
        tools: toolDefinitions,
        messages,
      });

      let hasToolUse = false;
      const toolUseBlocks: Array<{ id: string; name: string; input: Record<string, unknown> }> = [];

      for await (const event of stream) {
        if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            fullResponse += event.delta.text;
            callbacks.onText(event.delta.text);
          }
        } else if (event.type === 'content_block_start') {
          if (event.content_block.type === 'tool_use') {
            hasToolUse = true;
            callbacks.onToolUse(event.content_block.name);
            toolUseBlocks.push({
              id: event.content_block.id,
              name: event.content_block.name,
              input: {},
            });
          }
        }
      }

      const finalMessage = await stream.finalMessage();

      for (const block of finalMessage.content) {
        if (block.type === 'tool_use') {
          const existing = toolUseBlocks.find(t => t.id === block.id);
          if (existing) {
            existing.input = block.input as Record<string, unknown>;
          }
        }
      }

      if (hasToolUse && toolUseBlocks.length > 0) {
        messages.push({ role: 'assistant', content: finalMessage.content });

        const toolContext: ToolContext = {
          onflyToken: session.onflyToken,
          destCityId: session.trip.destCityId,
          destCityName: session.trip.destCityName,
        };

        const toolResults: Anthropic.ToolResultBlockParam[] = [];
        for (const tool of toolUseBlocks) {
          const result = await executeTool(tool.name, tool.input, toolContext);
          callbacks.onToolResult(tool.name);
          updateSessionFromToolResult(session, tool.name, tool.input, result, callbacks);

          toolResults.push({
            type: 'tool_result',
            tool_use_id: tool.id,
            content: result,
          });
        }

        messages.push({ role: 'user', content: toolResults });
      } else {
        continueLoop = false;
      }
    }

    sessionStore.addMessage(session.id, { role: 'assistant', content: fullResponse });
    callbacks.onEnd();
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  }
}

function buildTripContext(session: Session): string {
  const { trip } = session;
  if (trip.status === 'idle') {
    return 'Estado da viagem: Nenhuma viagem em andamento.';
  }

  const parts = [`Estado da viagem: ${trip.status}`];
  if (trip.origin) parts.push(`Origem: ${trip.origin}`);
  if (trip.destination) parts.push(`Destino: ${trip.destination}`);
  if (trip.departureDate) parts.push(`Data ida: ${trip.departureDate}`);
  if (trip.returnDate) parts.push(`Data volta: ${trip.returnDate}`);
  if (trip.flight) {
    parts.push(`Voo selecionado: ${trip.flight.airline} ${trip.flight.flightNumber} - R$ ${trip.flight.price}`);
  }
  if (trip.hotel) {
    parts.push(`Hotel selecionado: ${trip.hotel.name} - R$ ${trip.hotel.totalPrice}`);
  }

  return parts.join('\n');
}

function updateSessionFromToolResult(session: Session, toolName: string, input: Record<string, unknown>, resultStr: string, callbacks: StreamCallback) {
  try {
    const result = JSON.parse(resultStr);
    if (!result.success) return;

    if (toolName === 'search_flights') {
      const flights = result.results || [];
      sessionStore.updateTrip(session.id, {
        status: 'searching_flight',
        origin: input.origin as string,
        destination: input.destination as string,
        departureDate: input.departure_date as string,
        returnDate: input.return_date as string | undefined,
        passengers: input.passengers as number || 1,
        lastFlightResults: flights,
        destCityId: result._meta?.destCityId || session.trip.destCityId,
        destCityName: result._meta?.destCityName || session.trip.destCityName,
      });
      callbacks.onFlightOptions(flights);
    } else if (toolName === 'search_hotels') {
      const hotels = result.results || [];
      sessionStore.updateTrip(session.id, {
        status: 'searching_hotel',
        lastHotelResults: hotels,
      });
      callbacks.onHotelOptions(hotels);
    } else if (toolName === 'create_booking') {
      const bookingCode = (result.bookingId || result.booking_id || `BK-${Date.now()}`) as string;
      sessionStore.updateTrip(session.id, { status: 'confirmed', bookingCode });
      const airlineName = typeof session.trip.flight?.airline === 'object' && session.trip.flight?.airline !== null
        ? (session.trip.flight.airline as unknown as { name: string }).name
        : String(session.trip.flight?.airline || '');
      bookingStore.set(bookingCode, {
        bookingCode,
        origin: session.trip.flight?.origin || session.trip.origin || 'GRU',
        originCity: session.trip.origin || 'São Paulo',
        destination: session.trip.flight?.destination || session.trip.destination || 'GIG',
        destCity: session.trip.destination || 'Rio de Janeiro',
        flightNumber: session.trip.flight ? `${airlineName} ${session.trip.flight.flightNumber}` : 'N/A',
        date: session.trip.departureDate || '',
        time: session.trip.flight?.departureTime || '',
        gate: 'A12',
        seat: result.seat || '14A',
        passenger: result.passenger || 'Passageiro',
        bookingClass: 'Economy',
      });
      callbacks.onPassengerSummary({
        name: result.passenger || 'Passageiro',
        email: '',
        cpf: '',
        phone: '',
        birthdate: '',
        gender: '',
      });
    }
  } catch {
    // ignore parse errors
  }
}

// ============================================================
// EXPORT — escolhe automaticamente mock ou Claude
// ============================================================

export async function chat(session: Session, userMessage: string, timezone: string, callbacks: StreamCallback) {
  if (USE_CLAUDE) {
    console.log('🤖 Usando Claude API');
    return claudeChat(session, userMessage, timezone, callbacks);
  } else {
    console.log('🎭 Usando mock agent (configure ANTHROPIC_API_KEY para usar Claude)');
    return mockChat(session, userMessage, callbacks);
  }
}
