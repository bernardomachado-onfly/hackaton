import type { ToolInput } from './index.js';
import type { HotelOption } from '../services/session.js';

const MOCK_HOTELS: Record<string, HotelOption[]> = {
  default: [
    {
      id: 'HT001',
      name: 'Ibis Budget Centro',
      address: 'Rua da Consolação, 2303',
      city: '',
      rating: 3.5,
      pricePerNight: 189.9,
      totalPrice: 0,
      currency: 'BRL',
      amenities: ['Wi-Fi', 'Ar-condicionado', 'Café da manhã'],
      checkin: '',
      checkout: '',
    },
    {
      id: 'HT002',
      name: 'Mercure Business',
      address: 'Av. Paulista, 1150',
      city: '',
      rating: 4.0,
      pricePerNight: 320.0,
      totalPrice: 0,
      currency: 'BRL',
      amenities: ['Wi-Fi', 'Ar-condicionado', 'Café da manhã', 'Academia', 'Restaurante'],
      checkin: '',
      checkout: '',
    },
    {
      id: 'HT003',
      name: 'Holiday Inn Express',
      address: 'Rua Vergueiro, 2740',
      city: '',
      rating: 4.2,
      pricePerNight: 385.0,
      totalPrice: 0,
      currency: 'BRL',
      amenities: ['Wi-Fi', 'Ar-condicionado', 'Café da manhã', 'Academia', 'Estacionamento'],
      checkin: '',
      checkout: '',
    },
    {
      id: 'HT004',
      name: 'Novotel Center',
      address: 'Rua da Quitanda, 86',
      city: '',
      rating: 4.5,
      pricePerNight: 450.0,
      totalPrice: 0,
      currency: 'BRL',
      amenities: ['Wi-Fi', 'Ar-condicionado', 'Café da manhã', 'Academia', 'Piscina', 'Bar', 'Room Service'],
      checkin: '',
      checkout: '',
    },
  ],
};

function calculateNights(checkin: string, checkout: string): number {
  const d1 = new Date(checkin);
  const d2 = new Date(checkout);
  const diff = d2.getTime() - d1.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export async function searchHotels(input: ToolInput) {
  const city = input.city as string;
  const checkin = input.checkin as string;
  const checkout = input.checkout as string;
  const guests = (input.guests as number) || 1;

  await new Promise(r => setTimeout(r, 800));

  const nights = calculateNights(checkin, checkout);

  const hotels = MOCK_HOTELS.default.map(h => ({
    ...h,
    city,
    checkin,
    checkout,
    pricePerNight: Math.round(h.pricePerNight * (0.85 + Math.random() * 0.3) * 100) / 100,
    totalPrice: Math.round(h.pricePerNight * nights * (0.85 + Math.random() * 0.3) * 100) / 100,
  }));

  return {
    success: true,
    city,
    checkin,
    checkout,
    nights,
    guests,
    results: hotels,
    total: hotels.length,
  };
}
