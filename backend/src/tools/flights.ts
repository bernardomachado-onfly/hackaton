import type { ToolInput } from './index.js';
import type { FlightOption } from '../services/session.js';

const MOCK_FLIGHTS: Record<string, FlightOption[]> = {
  default: [
    {
      id: 'FL001',
      airline: 'LATAM',
      flightNumber: 'LA3456',
      origin: 'GRU',
      destination: 'GIG',
      departureTime: '08:30',
      arrivalTime: '09:40',
      price: 489.9,
      currency: 'BRL',
      class: 'Econômica',
      stops: 0,
    },
    {
      id: 'FL002',
      airline: 'GOL',
      flightNumber: 'G31278',
      origin: 'GRU',
      destination: 'GIG',
      departureTime: '11:15',
      arrivalTime: '12:25',
      price: 412.5,
      currency: 'BRL',
      class: 'Econômica',
      stops: 0,
    },
    {
      id: 'FL003',
      airline: 'Azul',
      flightNumber: 'AD4502',
      origin: 'GRU',
      destination: 'GIG',
      departureTime: '14:00',
      arrivalTime: '15:15',
      price: 527.0,
      currency: 'BRL',
      class: 'Econômica',
      stops: 0,
    },
    {
      id: 'FL004',
      airline: 'LATAM',
      flightNumber: 'LA3490',
      origin: 'GRU',
      destination: 'GIG',
      departureTime: '18:45',
      arrivalTime: '19:55',
      price: 598.0,
      currency: 'BRL',
      class: 'Executiva',
      stops: 0,
    },
  ],
};

const CITY_TO_IATA: Record<string, string> = {
  'são paulo': 'GRU', 'sao paulo': 'GRU', 'sp': 'GRU', 'guarulhos': 'GRU', 'congonhas': 'CGH',
  'rio de janeiro': 'GIG', 'rio': 'GIG', 'rj': 'GIG', 'galeão': 'GIG', 'santos dumont': 'SDU',
  'belo horizonte': 'CNF', 'bh': 'CNF', 'confins': 'CNF',
  'brasília': 'BSB', 'brasilia': 'BSB',
  'salvador': 'SSA', 'recife': 'REC', 'fortaleza': 'FOR',
  'curitiba': 'CWB', 'porto alegre': 'POA', 'florianópolis': 'FLN', 'florianopolis': 'FLN',
  'manaus': 'MAO', 'belém': 'BEL', 'belem': 'BEL',
  'campinas': 'VCP', 'goiânia': 'GYN', 'goiania': 'GYN',
};

function resolveIATA(input: string): string {
  const normalized = input.toLowerCase().trim();
  return CITY_TO_IATA[normalized] || input.toUpperCase();
}

export async function searchFlights(input: ToolInput) {
  const origin = resolveIATA(input.origin as string);
  const destination = resolveIATA(input.destination as string);
  const departureDate = input.departure_date as string;
  const returnDate = input.return_date as string | undefined;
  const passengers = (input.passengers as number) || 1;

  // Simulate API delay
  await new Promise(r => setTimeout(r, 800));

  const flights = MOCK_FLIGHTS.default.map(f => ({
    ...f,
    origin,
    destination,
    price: Math.round(f.price * (0.8 + Math.random() * 0.4) * passengers * 100) / 100,
    departureDate,
    returnDate,
  }));

  return {
    success: true,
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    results: flights,
    total: flights.length,
  };
}
