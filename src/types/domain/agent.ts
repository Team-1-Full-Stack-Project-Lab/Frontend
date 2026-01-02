export interface Chat {
  response: string
  sessionId?: string
  hotels?: Hotel[]
}

export interface Hotel {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  imageUrl?: string
}

export interface Message {
  role: 'user' | 'agent'
  content: string
  timestamp?: number
}