import type { ToolInput, ToolContext } from './index.js';
import { refreshOnflyToken } from '../services/onfly-auth.js';

const QUOTE_URL = 'https://toguro-app-prod.onfly.com/bff/quote/create';

// Fallback city code mapping
const CITY_CODES: Record<string, string> = {
  'são paulo': 'SAO', 'sao paulo': 'SAO', 'sp': 'SAO', 'guarulhos': 'SAO', 'congonhas': 'SAO',
  'rio de janeiro': 'RIO', 'rio': 'RIO', 'rj': 'RIO', 'galeão': 'RIO', 'santos dumont': 'RIO',
  'belo horizonte': 'BHZ', 'bh': 'BHZ', 'confins': 'BHZ',
  'brasília': 'BSB', 'brasilia': 'BSB',
  'salvador': 'SSA', 'recife': 'REC', 'fortaleza': 'FOR',
  'curitiba': 'CWB', 'porto alegre': 'POA', 'florianópolis': 'FLN', 'florianopolis': 'FLN',
  'manaus': 'MAO', 'belém': 'BEL', 'belem': 'BEL',
  'campinas': 'VCP', 'goiânia': 'GYN', 'goiania': 'GYN',
};

function resolveCityCode(input: string): string {
  const normalized = input.toLowerCase().trim();
  return CITY_CODES[normalized] || input.toUpperCase();
}

// Mock flights fallback
function getMockFlights(origin: string, destination: string, departureDate: string, returnDate?: string, passengers = 1) {
  const mockFlights = [
    { id: 'FL001', airline: 'LATAM', flightNumber: 'LA3456', departureTime: '08:30', arrivalTime: '09:40', price: 489.90, stops: 0, duration: '1h10' },
    { id: 'FL002', airline: 'GOL', flightNumber: 'G31278', departureTime: '11:15', arrivalTime: '12:25', price: 412.50, stops: 0, duration: '1h10' },
    { id: 'FL003', airline: 'Azul', flightNumber: 'AD4502', departureTime: '14:00', arrivalTime: '15:15', price: 527.00, stops: 0, duration: '1h15' },
    { id: 'FL004', airline: 'LATAM', flightNumber: 'LA3490', departureTime: '18:45', arrivalTime: '19:55', price: 598.00, stops: 1, duration: '2h30' },
  ];

  const results = mockFlights.map(f => ({
    ...f,
    origin,
    destination,
    price: Math.round(f.price * (0.8 + Math.random() * 0.4) * passengers * 100) / 100,
    currency: 'BRL',
    class: 'Econômica',
    departureDate,
    returnDate,
  }));

  return {
    success: true,
    source: 'mock',
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    results,
    total: results.length,
  };
}

export async function searchFlights(input: ToolInput, context: ToolContext = {}) {
  const origin = resolveCityCode(input.origin as string);
  const destination = resolveCityCode(input.destination as string);
  const departureDate = input.departure_date as string;
  const returnDate = input.return_date as string | undefined;
  const passengers = (input.passengers as number) || 1;

  const token = context.onflyToken;

  if (!token) {
    console.log('⚠️ [Flights] Sem token Onfly, usando mock');
    return getMockFlights(origin, destination, departureDate, returnDate, passengers);
  }

  console.log(`✈️ [Flights] Buscando voos: ${origin} → ${destination} em ${departureDate}`);

  const travellers = Array.from({ length: passengers }, () => ({
    birthday: '2000-01-01',
  }));

  const payload: Record<string, unknown> = {
    flights: [
      {
        from: origin,
        to: destination,
        departure: departureDate,
        ...(returnDate ? { return: returnDate } : {}),
        travelers: passengers,
      },
    ],
    groupFlights: true,
  };

  let response: Response;
  try {
    response = await fetch(QUOTE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'authorization': `Bearer ${token}`,
        'origin': 'https://app.onfly.com',
      },
      body: JSON.stringify(payload),
    });

    // Retry on 401
    if (response.status === 401) {
      console.log('🔄 [Flights] Token expirado, renovando...');
      const newToken = await refreshOnflyToken();
      response = await fetch(QUOTE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'authorization': `Bearer ${newToken}`,
          'origin': 'https://app.onfly.com',
        },
        body: JSON.stringify(payload),
      });
    }
  } catch (err) {
    console.log('❌ [Flights] Erro de rede:', (err as Error).message);
    return getMockFlights(origin, destination, departureDate, returnDate, passengers);
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    console.log(`❌ [Flights] API error ${response.status}: ${errText.substring(0, 200)}`);
    return getMockFlights(origin, destination, departureDate, returnDate, passengers);
  }

  const apiData = await response.json() as { data: any[] };
  const quoteData = apiData.data?.[0];

  if (!quoteData?.item?.id) {
    console.log('⚠️ [Flights] Resposta vazia da API, usando mock');
    return getMockFlights(origin, destination, departureDate, returnDate, passengers);
  }

  const flightQuoteId = quoteData.item.id;
  const quoteId = quoteData.item.quotation?.id;
  const flightGroups = quoteData.response?.data || [];

  // Extract destination city ID for hotel search
  let destCityId = '';
  let destCityName = '';
  if (flightGroups.length > 0) {
    const firstGroup = flightGroups[0];
    const outbound = firstGroup?.options?.outbounds?.[0];
    if (outbound?.to?.city) {
      destCityId = outbound.to.city.id || '';
      destCityName = outbound.to.city.name || '';
    }
  }

  const results = flightGroups.map((group: any) => {
    const packageId = group.id;
    const priceInCentavos = group.cheapestTotalPrice || 0;
    const price = priceInCentavos / 100;
    const fareId = group.fares?.[0]?.id || '';

    const outbound = group.options?.outbounds?.[0];
    const segments = outbound?.segments || [];
    const flightIds = segments.map((s: any) => s.id).filter(Boolean);

    return {
      id: packageId,
      airline: outbound?.ciaManaging || '',
      flightNumber: outbound?.flightNumber || '',
      origin: outbound?.departure?.iata || origin,
      destination: outbound?.arrival?.iata || destination,
      departureTime: outbound?.departure?.dateTime || '',
      arrivalTime: outbound?.arrival?.dateTime || '',
      duration: outbound?.duration || '',
      price,
      currency: 'BRL',
      stops: outbound?.stopsCount || 0,
      departureDate,
      returnDate,
      _booking: {
        quoteId,
        flightQuoteId,
        packageId,
        fareId,
        flightIds,
        segments,
      },
    };
  });

  console.log(`✅ [Flights] ${results.length} voos encontrados (quoteId=${quoteId})`);

  return {
    success: true,
    source: 'onfly',
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    results,
    total: results.length,
    _meta: {
      quoteId,
      destCityId,
      destCityName,
    },
  };
}
