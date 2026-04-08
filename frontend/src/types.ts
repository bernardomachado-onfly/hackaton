export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  flightOptions?: FlightOption[];
  hotelOptions?: HotelOption[];
  passengerSummary?: PassengerSummaryData;
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

export interface PassengerSummaryData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthdate: string;
  gender: string;
}

export interface SSEEvent {
  type: 'session' | 'text' | 'tool_start' | 'tool_end' | 'done' | 'error' | 'flight_options' | 'hotel_options' | 'passenger_summary';
  sessionId?: string;
  content?: string;
  tool?: string;
  trip?: TripState;
  message?: string;
  flights?: FlightOption[];
  hotels?: HotelOption[];
  data?: PassengerSummaryData;
}
