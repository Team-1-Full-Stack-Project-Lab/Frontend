export interface HotelDataGraphQL {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  imageUrl: string
}
export interface ChatResponseGraphQL {
  response: string
  sessionId: string
  hotels?: HotelDataGraphQL[]
}
export interface ConversationMessageGraphQL {
  role: string
  content: string
  timestamp: number
}