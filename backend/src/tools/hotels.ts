import type { ToolInput, ToolContext } from './index.js';
import { refreshOnflyToken } from '../services/onfly-auth.js';

const QUOTE_URL = 'https://toguro-app-prod.onfly.com/bff/quote/create';

// Fallback city ID mapping
const CITY_IDS: Record<string, string> = {
  'rio de janeiro': 'aae40b6d-8e78-4336-a87b-430b489b1292',
  'rio': 'aae40b6d-8e78-4336-a87b-430b489b1292',
  'são paulo': '3e4b07c1-0e69-4dec-b940-4b94a0a08b02',
  'sao paulo': '3e4b07c1-0e69-4dec-b940-4b94a0a08b02',
  'belo horizonte': 'dd00e19c-5a21-4773-a8ca-def1e073ed0e',
  'brasília': '28e18414-95e5-4a3b-88e2-f0c0489c3e2e',
  'brasilia': '28e18414-95e5-4a3b-88e2-f0c0489c3e2e',
  'salvador': 'b30ca24f-94bf-4c4a-9f85-f4fe45368b70',
  'recife': '0fb6ac28-69ff-4e1d-a5c0-2aa57bf0a74e',
  'fortaleza': 'e9dc2e3e-63e6-4f56-b6f0-e93f14e8e32e',
  'curitiba': '81e0a00d-e3a6-43e5-9db8-7fba7fb6e6e6',
  'porto alegre': '44ee6a24-4c95-4a53-b5f5-c3e93dd4a4d0',
  'florianópolis': '0d8e3c5b-5d57-4e42-9c95-f1f0e3a1ef8b',
  'florianopolis': '0d8e3c5b-5d57-4e42-9c95-f1f0e3a1ef8b',
};

function resolveCityId(city: string, context: ToolContext): string {
  // Prefer destCityId from flight search context
  if (context.destCityId) return context.destCityId;
  const normalized = city.toLowerCase().trim();
  return CITY_IDS[normalized] || '';
}

function calculateNights(checkin: string, checkout: string): number {
  const d1 = new Date(checkin);
  const d2 = new Date(checkout);
  const diff = d2.getTime() - d1.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// Mock hotels fallback
function getMockHotels(city: string, checkin: string, checkout: string, guests: number) {
  const nights = calculateNights(checkin, checkout);
  const mockHotels = [
    { id: 'HT001', name: 'Ibis Budget Centro', address: 'Rua da Consolação, 2303', rating: 3.5, pricePerNight: 189.90, amenities: ['Wi-Fi', 'Ar-condicionado', 'Cafe da manha'] },
    { id: 'HT002', name: 'Mercure Business', address: 'Av. Paulista, 1150', rating: 4.0, pricePerNight: 320.00, amenities: ['Wi-Fi', 'Ar-condicionado', 'Cafe da manha', 'Academia', 'Restaurante'] },
    { id: 'HT003', name: 'Holiday Inn Express', address: 'Rua Vergueiro, 2740', rating: 4.2, pricePerNight: 385.00, amenities: ['Wi-Fi', 'Ar-condicionado', 'Cafe da manha', 'Academia', 'Estacionamento'] },
    { id: 'HT004', name: 'Novotel Center', address: 'Rua da Quitanda, 86', rating: 4.5, pricePerNight: 450.00, amenities: ['Wi-Fi', 'Ar-condicionado', 'Cafe da manha', 'Academia', 'Piscina', 'Bar', 'Room Service'] },
  ];

  const results = mockHotels.map(h => ({
    ...h,
    city,
    checkin,
    checkout,
    currency: 'BRL',
    pricePerNight: Math.round(h.pricePerNight * (0.85 + Math.random() * 0.3) * 100) / 100,
    totalPrice: Math.round(h.pricePerNight * nights * (0.85 + Math.random() * 0.3) * 100) / 100,
  }));

  return {
    success: true,
    source: 'mock',
    city,
    checkin,
    checkout,
    nights,
    guests,
    results,
    total: results.length,
  };
}

export async function searchHotels(input: ToolInput, context: ToolContext = {}) {
  const city = input.city as string;
  const checkin = input.checkin as string;
  const checkout = input.checkout as string;
  const guests = (input.guests as number) || 1;
  const nights = calculateNights(checkin, checkout);

  const token = context.onflyToken;
  const cityId = resolveCityId(city, context);

  if (!token || !cityId) {
    if (!token) console.log('⚠️ [Hotels] Sem token Onfly, usando mock');
    if (!cityId) console.log('⚠️ [Hotels] City ID não encontrado, usando mock');
    return getMockHotels(city, checkin, checkout, guests);
  }

  console.log(`🏨 [Hotels] Buscando hoteis em ${city} (cityId=${cityId}): ${checkin} → ${checkout}`);

  const travellers = Array.from({ length: guests }, () => ({
    birthday: '2000-01-01',
    roomIndex: 0,
  }));

  const payload = {
    owners: [null],
    hotels: [
      {
        checkIn: checkin,
        checkOut: checkout,
        destination: {
          type: 'cityId',
          value: cityId,
        },
        travelers: travellers,
      },
    ],
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
      console.log('🔄 [Hotels] Token expirado, renovando...');
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
    console.log('❌ [Hotels] Erro de rede:', (err as Error).message);
    return getMockHotels(city, checkin, checkout, guests);
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    console.log(`❌ [Hotels] API error ${response.status}: ${errText.substring(0, 200)}`);
    return getMockHotels(city, checkin, checkout, guests);
  }

  const apiData = await response.json() as any;
  const quoteData = Array.isArray(apiData) ? apiData[0] : apiData?.data?.[0];

  if (!quoteData?.response?.data) {
    console.log('⚠️ [Hotels] Resposta vazia da API, usando mock');
    return getMockHotels(city, checkin, checkout, guests);
  }

  const quoteId = quoteData.item?.quotation?.id;
  const hotelsList = quoteData.response.data || [];

  const results = hotelsList.map((hotel: any) => {
    // Price fields: cheapestPrice (total in centavos), cheapestDailyPrice (per night in centavos)
    const totalCentavos = hotel.cheapestPrice || hotel.cheapestTotalPrice || 0;
    const dailyCentavos = hotel.cheapestDailyPrice || 0;
    const totalPrice = totalCentavos / 100;
    const pricePerNight = dailyCentavos > 0
      ? dailyCentavos / 100
      : (nights > 0 ? Math.round((totalPrice / nights) * 100) / 100 : totalPrice);

    // Address: can be object { street, number, district, addressLine } or string
    const address = typeof hotel.address === 'object' && hotel.address
      ? hotel.address.addressLine || `${hotel.address.street || ''}, ${hotel.address.number || ''} - ${hotel.address.district || ''}`
      : hotel.address || '';

    // Amenities: array of { code, label } objects
    const amenities = (hotel.amenities || [])
      .map((a: any) => typeof a === 'string' ? a : a.label || a.name || '')
      .filter((a: string) => a.length > 0);

    return {
      id: hotel.id || '',
      name: hotel.name || '',
      address,
      city,
      rating: hotel.stars || hotel.rating || 0,
      score: hotel.score || 0,
      pricePerNight,
      totalPrice,
      currency: 'BRL',
      amenities,
      breakfast: hotel.breakfast || false,
      refundable: hotel.refundable || false,
      thumb: hotel.thumb || '',
      checkin,
      checkout,
      _booking: {
        hotelId: hotel.id,
        quoteId,
      },
    };
  });

  console.log(`✅ [Hotels] ${results.length} hoteis encontrados (quoteId=${quoteId})`);

  return {
    success: true,
    source: 'onfly',
    city,
    checkin,
    checkout,
    nights,
    guests,
    results,
    total: results.length,
  };
}
