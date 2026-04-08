import Anthropic from '@anthropic-ai/sdk';
import { searchFlights } from './flights.js';
import { searchHotels } from './hotels.js';
import { createBooking } from './booking.js';
import { searchDestinations } from './destinations.js';

export const toolDefinitions: Anthropic.Tool[] = [
  {
    name: 'search_destinations',
    description: 'Busca cidades e aeroportos na plataforma Onfly. Use ANTES de buscar voos para resolver o código correto da cidade/aeroporto.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Nome da cidade ou aeroporto para buscar' },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_flights',
    description: 'Busca voos disponíveis na plataforma Onfly. Use o código da cidade retornado por search_destinations. SEMPRE chame search_destinations antes.',
    input_schema: {
      type: 'object' as const,
      properties: {
        origin: { type: 'string', description: 'Código da cidade de origem (ex: BHZ, SAO, RIO)' },
        destination: { type: 'string', description: 'Código da cidade de destino' },
        departure_date: { type: 'string', description: 'Data de ida YYYY-MM-DD' },
        return_date: { type: 'string', description: 'Data de volta YYYY-MM-DD (opcional)' },
        passengers: { type: 'number', description: 'Número de passageiros (padrão: 1)' },
      },
      required: ['origin', 'destination', 'departure_date'],
    },
  },
  {
    name: 'search_hotels',
    description: 'Busca hotéis disponíveis na plataforma Onfly.',
    input_schema: {
      type: 'object' as const,
      properties: {
        city: { type: 'string', description: 'Nome da cidade de destino' },
        checkin: { type: 'string', description: 'Data de check-in YYYY-MM-DD' },
        checkout: { type: 'string', description: 'Data de check-out YYYY-MM-DD' },
        guests: { type: 'number', description: 'Número de hóspedes (padrão: 1)' },
      },
      required: ['city', 'checkin', 'checkout'],
    },
  },
  {
    name: 'create_booking',
    description: 'Cria/confirma a reserva na Onfly. Use SOMENTE após coletar TODOS os dados do viajante E confirmação do usuário.',
    input_schema: {
      type: 'object' as const,
      properties: {
        session_id: { type: 'string', description: 'ID da sessão' },
        flight_id: { type: 'string', description: 'ID do voo selecionado' },
        hotel_id: { type: 'string', description: 'ID do hotel (opcional)' },
        traveler: {
          type: 'object',
          description: 'Dados do viajante — OBRIGATÓRIO',
          properties: {
            firstName: { type: 'string', description: 'Primeiro nome' },
            lastName: { type: 'string', description: 'Sobrenome' },
            email: { type: 'string', description: 'E-mail' },
            cpf: { type: 'string', description: 'CPF' },
            birthday: { type: 'string', description: 'Nascimento YYYY-MM-DD' },
            gender: { type: 'string', description: 'Male ou Female' },
            phone: { type: 'string', description: 'Telefone com DDD' },
          },
          required: ['firstName', 'lastName', 'email', 'cpf', 'birthday', 'gender', 'phone'],
        },
      },
      required: ['session_id', 'traveler'],
    },
  },
];

export type ToolInput = Record<string, unknown>;

export interface ToolContext {
  onflyToken?: string;
  destCityId?: string;
  destCityName?: string;
}

export async function executeTool(name: string, input: ToolInput, context: ToolContext = {}): Promise<string> {
  switch (name) {
    case 'search_destinations':
      return JSON.stringify(await searchDestinations(input, context));
    case 'search_flights':
      return JSON.stringify(await searchFlights(input, context));
    case 'search_hotels':
      return JSON.stringify(await searchHotels(input, context));
    case 'create_booking':
      return JSON.stringify(await createBooking(input));
    default:
      return JSON.stringify({ error: `Tool "${name}" não encontrada` });
  }
}
