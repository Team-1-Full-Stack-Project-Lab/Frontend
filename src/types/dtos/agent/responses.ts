export interface ChatResponse {
  response: string
  sessionId?: string
  hotels?: HotelData[]
}

export interface HotelData {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  imageUrl?: string
}

export interface ConversationMessage {
  role: 'user' | 'agent'
  content: string
  timestamp?: number
}