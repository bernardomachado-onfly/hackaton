export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface TripState {
  status: string;
  flight?: {
    airline: string;
    flightNumber: string;
    price: number;
    departureTime: string;
    arrivalTime: string;
  };
  hotel?: {
    name: string;
    totalPrice: number;
    rating: number;
  };
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
}

export interface SSEEvent {
  type: 'session' | 'text' | 'tool_start' | 'tool_end' | 'done' | 'error' | 'pass_link';
  sessionId?: string;
  content?: string;
  tool?: string;
  trip?: TripState;
  message?: string;
  url?: string;
}
