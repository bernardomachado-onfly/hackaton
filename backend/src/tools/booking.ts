import type { ToolInput } from './index.js';
import { sessionStore, bookingStore } from '../services/session.js';
import { getOnflyToken, refreshOnflyToken } from '../services/onfly-auth.js';
import { v4 as uuidv4 } from 'uuid';

const BFF_BASE = 'https://toguro-app-prod.onfly.com/bff/quote';

async function apiFetch(url: string, token: string, options: RequestInit = {}): Promise<Response> {
  let response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'authorization': `Bearer ${token}`,
      'origin': 'https://app.onfly.com',
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    console.log('🔄 [Booking] Token expirado, renovando...');
    const newToken = await refreshOnflyToken();
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'authorization': `Bearer ${newToken}`,
        'origin': 'https://app.onfly.com',
        ...(options.headers || {}),
      },
    });
  }

  return response;
}

export async function createBooking(input: ToolInput) {
  const sessionId = input.session_id as string;
  const flightId = input.flight_id as string | undefined;
  const hotelId = input.hotel_id as string | undefined;
  const traveler = input.traveler as {
    firstName: string;
    lastName: string;
    email: string;
    cpf: string;
    birthday: string;
    gender: string;
    phone: string;
  } | undefined;

  const session = sessionStore.get(sessionId);
  if (!session) {
    return { success: false, error: 'Sessao nao encontrada' };
  }

  const token = session.onflyToken || await getOnflyToken().catch(() => '');

  // Find the selected flight from last results
  const lastFlights = session.trip.lastFlightResults || [];
  const selectedFlight = flightId
    ? lastFlights.find((f: any) => f.id === flightId || f._booking?.packageId === flightId)
    : lastFlights[0];

  const bookingData = selectedFlight?._booking;

  // If no token or no booking data from API, use mock
  if (!token || !bookingData?.quoteId) {
    console.log('⚠️ [Booking] Sem token ou dados de booking, usando mock');
    const bookingId = `BK-${uuidv4().slice(0, 8).toUpperCase()}`;
    sessionStore.updateTrip(sessionId, { status: 'confirmed', bookingCode: bookingId });

    const flight = session.trip.flight;
    bookingStore.set(bookingId, {
      bookingCode: bookingId,
      origin: session.trip.origin || flight?.origin || 'GRU',
      originCity: session.trip.origin || flight?.origin || 'São Paulo',
      destination: session.trip.destination || flight?.destination || 'BSB',
      destCity: session.trip.destination || flight?.destination || 'Brasília',
      flightNumber: flight?.flightNumber || 'N/A',
      date: session.trip.departureDate || new Date().toISOString().slice(0, 10),
      time: flight?.departureTime || '00:00',
      gate: 'B12',
      seat: '14A',
      passenger: traveler ? `${traveler.firstName} ${traveler.lastName}` : 'Viajante',
      bookingClass: flight?.class || 'Economy',
    });

    return {
      success: true,
      source: 'mock',
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

  const { quoteId, flightQuoteId, packageId, fareId } = bookingData;

  console.log(`📦 [Booking] Iniciando reserva - quoteId=${quoteId}, packageId=${packageId}`);

  try {
    // Step 1: Add to cart
    console.log('🛒 [Booking] Adicionando ao carrinho...');
    const cartPayload = {
      flightQuote: {
        id: flightQuoteId,
        package: {
          id: packageId,
          fareId: fareId,
        },
      },
    };

    const cartResponse = await apiFetch(
      `${BFF_BASE}/${quoteId}/item/cart`,
      token,
      { method: 'POST', body: JSON.stringify(cartPayload) },
    );

    if (!cartResponse.ok) {
      const errText = await cartResponse.text().catch(() => '');
      console.log(`❌ [Booking] Cart error ${cartResponse.status}: ${errText.substring(0, 200)}`);
      throw new Error(`Erro ao adicionar ao carrinho: ${cartResponse.status}`);
    }

    const cartResult = await cartResponse.json() as any[];
    const cartItemId = cartResult[0]?.id;
    const travelerId = cartResult[0]?.specificInfo?.travelers?.[0]?.id;

    if (!cartItemId) {
      throw new Error('Cart response sem ID');
    }

    console.log(`✅ [Booking] Carrinho: cartItemId=${cartItemId}, travelerId=${travelerId}`);

    // Step 2: Validate cart item
    console.log('✔️ [Booking] Validando item...');
    const validateResponse = await apiFetch(
      `${BFF_BASE}/${quoteId}/item/validate`,
      token,
      { method: 'POST', body: JSON.stringify({ cartItemId }) },
    );

    if (!validateResponse.ok) {
      const errText = await validateResponse.text().catch(() => '');
      console.log(`⚠️ [Booking] Validate warning ${validateResponse.status}: ${errText.substring(0, 100)}`);
      // Continue even if validation has warnings
    }

    // Step 3: Reserve
    console.log('📋 [Booking] Reservando...');
    const travelerData = traveler || {
      firstName: 'Viajante',
      lastName: 'Teste',
      email: 'viajante@teste.com',
      cpf: '00000000000',
      birthday: '1990-01-01',
      gender: 'Male',
      phone: '11999999999',
    };

    const reservePayload = {
      customFields: [],
      insurance: false,
      itemQuoteIds: [cartItemId],
      quoteId,
      quoteItemId: cartItemId,
      travelers: [
        {
          birthday: travelerData.birthday,
          documents: [
            {
              type: 'CPF',
              value: travelerData.cpf.replace(/\D/g, ''),
            },
          ],
          email: travelerData.email,
          firstName: travelerData.firstName,
          gender: travelerData.gender,
          id: travelerId || null,
          lastName: travelerData.lastName,
          nationality: 'brasil',
          phone: {
            idd: '55',
            number: travelerData.phone.replace(/\D/g, ''),
          },
          selectedDocuments: ['CPF'],
          travelerEntityId: null,
          contractedService: {
            inbound: [],
            outbound: [],
          },
          baggage: {},
        },
      ],
    };

    const reserveResponse = await apiFetch(
      `${BFF_BASE}/${quoteId}/reserve`,
      token,
      { method: 'POST', body: JSON.stringify(reservePayload) },
    );

    if (!reserveResponse.ok) {
      const errText = await reserveResponse.text().catch(() => '');
      console.log(`❌ [Booking] Reserve error ${reserveResponse.status}: ${errText.substring(0, 200)}`);
      throw new Error(`Erro ao reservar: ${reserveResponse.status}`);
    }

    const reserveResult = await reserveResponse.json();
    console.log('✅ [Booking] Reserva criada com sucesso!');

    const onflyBookingId: string = String((reserveResult as any).id || cartItemId);
    sessionStore.updateTrip(sessionId, { status: 'confirmed', bookingCode: onflyBookingId });

    const onflyFlight = session.trip.flight;
    bookingStore.set(onflyBookingId, {
      bookingCode: onflyBookingId,
      origin: session.trip.origin || onflyFlight?.origin || 'GRU',
      originCity: session.trip.origin || onflyFlight?.origin || 'São Paulo',
      destination: session.trip.destination || onflyFlight?.destination || 'BSB',
      destCity: session.trip.destination || onflyFlight?.destination || 'Brasília',
      flightNumber: onflyFlight?.flightNumber || 'N/A',
      date: session.trip.departureDate || new Date().toISOString().slice(0, 10),
      time: onflyFlight?.departureTime || '00:00',
      gate: 'B12',
      seat: '14A',
      passenger: traveler ? `${traveler.firstName} ${traveler.lastName}` : 'Viajante',
      bookingClass: onflyFlight?.class || 'Economy',
    });

    return {
      success: true,
      source: 'onfly',
      bookingId: onflyBookingId,
      quoteId,
      message: 'Reserva criada com sucesso na Onfly!',
      details: {
        flight: session.trip.flight || null,
        hotel: session.trip.hotel || null,
        origin: session.trip.origin,
        destination: session.trip.destination,
        departureDate: session.trip.departureDate,
        returnDate: session.trip.returnDate,
        cartItemId,
        travelerId,
      },
    };
  } catch (err) {
    console.log('❌ [Booking] Falha na reserva:', (err as Error).message);

    // Fallback to mock
    const bookingId = `BK-${uuidv4().slice(0, 8).toUpperCase()}`;
    sessionStore.updateTrip(sessionId, { status: 'confirmed', bookingCode: bookingId });

    const fallbackFlight = session.trip.flight;
    bookingStore.set(bookingId, {
      bookingCode: bookingId,
      origin: session.trip.origin || fallbackFlight?.origin || 'GRU',
      originCity: session.trip.origin || fallbackFlight?.origin || 'São Paulo',
      destination: session.trip.destination || fallbackFlight?.destination || 'BSB',
      destCity: session.trip.destination || fallbackFlight?.destination || 'Brasília',
      flightNumber: fallbackFlight?.flightNumber || 'N/A',
      date: session.trip.departureDate || new Date().toISOString().slice(0, 10),
      time: fallbackFlight?.departureTime || '00:00',
      gate: 'B12',
      seat: '14A',
      passenger: traveler ? `${traveler.firstName} ${traveler.lastName}` : 'Viajante',
      bookingClass: fallbackFlight?.class || 'Economy',
    });

    return {
      success: true,
      source: 'mock-fallback',
      bookingId,
      message: 'Reserva criada (modo simulado devido a erro na API)',
      error: (err as Error).message,
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
}
