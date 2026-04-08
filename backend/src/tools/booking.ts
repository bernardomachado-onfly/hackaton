import type { ToolInput } from './index.js';
import { sessionStore } from '../services/session.js';
import { v4 as uuidv4 } from 'uuid';

export async function createBooking(input: ToolInput) {
  const sessionId = input.session_id as string;
  const flightId = input.flight_id as string | undefined;
  const hotelId = input.hotel_id as string | undefined;

  await new Promise(r => setTimeout(r, 600));

  const session = sessionStore.get(sessionId);
  if (!session) {
    return { success: false, error: 'Sessão não encontrada' };
  }

  const bookingId = `BK-${uuidv4().slice(0, 8).toUpperCase()}`;

  sessionStore.updateTrip(sessionId, { status: 'confirmed' });

  return {
    success: true,
    bookingId,
    message: 'Reserva criada com sucesso!',
    details: {
      flight: session.trip.flight || null,
      hotel: session.trip.hotel || null,
      origin: session.trip.origin,
      destination: session.trip.destination,
      departureDate: session.trip.departureDate,
      returnDate: session.trip.returnDate,
    },
  };
}
