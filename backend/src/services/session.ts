import { v4 as uuidv4 } from 'uuid';

export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  currency: string;
  class: string;
  stops: number;
}

export interface HotelOption {
  id: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  amenities: string[];
  checkin: string;
  checkout: string;
}

export interface TripState {
  status: 'idle' | 'searching_flight' | 'flight_selected' | 'searching_hotel' | 'hotel_selected' | 'confirmed';
  flight?: FlightOption;
  hotel?: HotelOption;
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Session {
  id: string;
  messages: Message[];
  trip: TripState;
  createdAt: Date;
  updatedAt: Date;
}

class SessionStore {
  private sessions = new Map<string, Session>();

  create(): Session {
    const session: Session = {
      id: uuidv4(),
      messages: [],
      trip: { status: 'idle' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(session.id, session);
    return session;
  }

  get(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  getOrCreate(id?: string): Session {
    if (id) {
      const existing = this.sessions.get(id);
      if (existing) return existing;
    }
    return this.create();
  }

  addMessage(sessionId: string, message: Message): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    session.messages.push(message);
    session.updatedAt = new Date();
  }

  updateTrip(sessionId: string, update: Partial<TripState>): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    session.trip = { ...session.trip, ...update };
    session.updatedAt = new Date();
  }
}

export const sessionStore = new SessionStore();
