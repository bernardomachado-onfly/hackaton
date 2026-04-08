export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  flightOptions?: FlightOption[];
  hotelOptions?: HotelOption[];
  passengerSummary?: PassengerSummaryData;
  bookingConfirmed?: BookingConfirmedData;
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
  airline: string | { code: string; name: string; imageUrl?: string };
  flightNumber: string | number;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration?: number;
  price: number;
  currency: string;
  class?: string;
  stops: number;
  departureDate?: string;
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

export interface BookingConfirmedData {
  bookingCode: string;
  flight?: { airline: string; flightNumber: string; origin: string; destination: string; date: string; price: number };
  hotel?: { name: string; checkin: string; checkout: string; nights: number; price: number };
  total: number;
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
  type: 'session' | 'text' | 'tool_start' | 'tool_end' | 'done' | 'error' | 'pass_link' | 'flight_options' | 'hotel_options' | 'passenger_summary' | 'booking_confirmed';
  sessionId?: string;
  content?: string;
  tool?: string;
  trip?: TripState;
  message?: string;
  url?: string;
  flights?: FlightOption[];
  hotels?: HotelOption[];
  data?: PassengerSummaryData;
  booking?: BookingConfirmedData;
}
