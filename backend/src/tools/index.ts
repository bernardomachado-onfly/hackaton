import Anthropic from '@anthropic-ai/sdk';
import { searchFlights } from './flights.js';
import { searchHotels } from './hotels.js';
import { createBooking } from './booking.js';

export const toolDefinitions: Anthropic.Tool[] = [
  {
    name: 'search_flights',
    description: 'Busca voos disponíveis na plataforma Onfly. Use quando o usuário quiser reservar um voo ou buscar passagens aéreas.',
    input_schema: {
      type: 'object' as const,
      properties: {
        origin: { type: 'string', description: 'Código IATA do aeroporto de origem (ex: GRU, CGH, SDU, GIG)' },
        destination: { type: 'string', description: 'Código IATA do aeroporto de destino' },
        departure_date: { type: 'string', description: 'Data de ida no formato YYYY-MM-DD' },
        return_date: { type: 'string', description: 'Data de volta no formato YYYY-MM-DD (opcional para só ida)' },
        passengers: { type: 'number', description: 'Número de passageiros (padrão: 1)' },
      },
      required: ['origin', 'destination', 'departure_date'],
    },
  },
  {
    name: 'search_hotels',
    description: 'Busca hotéis disponíveis na plataforma Onfly. Use quando o usuário quiser reservar hospedagem.',
    input_schema: {
      type: 'object' as const,
      properties: {
        city: { type: 'string', description: 'Cidade de destino para buscar hotéis' },
        checkin: { type: 'string', description: 'Data de check-in no formato YYYY-MM-DD' },
        checkout: { type: 'string', description: 'Data de check-out no formato YYYY-MM-DD' },
        guests: { type: 'number', description: 'Número de hóspedes (padrão: 1)' },
      },
      required: ['city', 'checkin', 'checkout'],
    },
  },
  {
    name: 'create_booking',
    description: 'Cria/confirma a reserva na plataforma Onfly. Use após o usuário confirmar voo e/ou hotel.',
    input_schema: {
      type: 'object' as const,
      properties: {
        session_id: { type: 'string', description: 'ID da sessão do usuário' },
        flight_id: { type: 'string', description: 'ID do voo selecionado (opcional se só hotel)' },
        hotel_id: { type: 'string', description: 'ID do hotel selecionado (opcional se só voo)' },
      },
      required: ['session_id'],
    },
  },
];

export type ToolInput = Record<string, unknown>;

export async function executeTool(name: string, input: ToolInput): Promise<string> {
  switch (name) {
    case 'search_flights':
      return JSON.stringify(await searchFlights(input));
    case 'search_hotels':
      return JSON.stringify(await searchHotels(input));
    case 'create_booking':
      return JSON.stringify(await createBooking(input));
    default:
      return JSON.stringify({ error: `Tool "${name}" não encontrada` });
  }
}
