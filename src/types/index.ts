// Shared TypeScript interfaces — fonte única de verdade para todos os módulos.
// Qualquer alteração aqui afeta tools, AgentService, SessionStore e UI.
// Definir antes de qualquer implementação paralela.

// ─── Session ─────────────────────────────────────────────────────────────────

export type TripStatus =
  | 'idle'
  | 'searching_flights'
  | 'searching_hotels'
  | 'confirming'
  | 'booked'

export interface TripState {
  status: TripStatus
  origin?: string
  destination?: string
  dates?: {
    departure: string   // ISO date: YYYY-MM-DD
    return?: string     // ISO date: YYYY-MM-DD
  }
  passengers?: number
  selectedFlight?: FlightOption
  selectedHotel?: HotelOption
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Session {
  id: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
  trip: TripState
}

// ─── Tool Inputs ─────────────────────────────────────────────────────────────

export interface SearchFlightsInput {
  origin: string        // IATA code (ex: "GRU", "CNF", "SDU")
  destination: string   // IATA code
  departure_date: string // YYYY-MM-DD
  return_date?: string   // YYYY-MM-DD — apenas para ida e volta
  passengers: number
}

export interface SearchHotelsInput {
  city: string          // nome da cidade (ex: "São Paulo")
  checkin: string       // YYYY-MM-DD
  checkout: string      // YYYY-MM-DD
  guests: number
}

export interface CreateBookingInput {
  session_id: string
  flight_id?: string    // retornado por search_flights
  hotel_id?: string     // retornado por search_hotels
}

// ─── Tool Outputs ─────────────────────────────────────────────────────────────

export interface FlightOption {
  id: string
  airline: string
  flight_number: string
  departure: string       // ISO datetime: YYYY-MM-DDTHH:MM:SS
  arrival: string         // ISO datetime
  price: number           // BRL
  available_seats: number
  policy_compliant: boolean
  policy_notes?: string   // ex: "acima do limite em R$50"
}

export interface HotelOption {
  id: string
  name: string
  stars: number           // 1-5
  price_per_night: number // BRL
  address: string
  policy_compliant: boolean
  policy_notes?: string
}

export interface BookingConfirmation {
  booking_id: string      // formato: ONF-XXXXXX
  status: 'confirmed' | 'pending' | 'failed'
  flight?: FlightOption
  hotel?: HotelOption
  total_cost: number      // BRL
  created_at: string      // ISO datetime
}

// ─── SSE Events ──────────────────────────────────────────────────────────────

export type SSEEventType = 'text' | 'tool_call' | 'tool_result' | 'done' | 'error'

export interface SSEEvent {
  type: SSEEventType
  content?: string
  tool?: string
  status?: 'running' | 'done'
  count?: number
  error?: string
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ChatRequest {
  sessionId?: string    // ausente = nova sessão
  message: string
}
