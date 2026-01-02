import type { Chat, Hotel, Message } from "@/types/domain/agent"
import type {
  ChatResponse,
  HotelData,
  ConversationMessage,
  ChatResponseGraphQL,
  HotelDataGraphQL,
  ConversationMessageGraphQL
} from "@/types"

export function chatFromResponse(dto: ChatResponse): Chat {
  return {
    response: dto.response,
    sessionId: dto.sessionId,
    hotels: dto.hotels ? dto.hotels.map(hotelFromResponse) : undefined,
  }
}

export function messageFromResponse(dto: ConversationMessage): Message {
  return {
    role: dto.role,
    content: dto.content,
    timestamp: dto.timestamp,
  }
}

export function hotelFromResponse(dto: HotelData): Hotel {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    latitude: dto.latitude,
    longitude: dto.longitude,
    imageUrl: dto.imageUrl,
  }
}

export function chatFromGraphQL(dto: ChatResponseGraphQL): Chat {
  return {
    response: dto.response,
    sessionId: dto.sessionId,
    hotels: dto.hotels ? dto.hotels.map(hotelFromGraphQL) : undefined,
  }
}
export function messageFromGraphQL(dto: ConversationMessageGraphQL): Message {
  return {
    role: dto.role,
    content: dto.content,
    timestamp: dto.timestamp,
  }
}
export function hotelFromGraphQL(dto: HotelDataGraphQL): Hotel {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    latitude: dto.latitude,
    longitude: dto.longitude,
    imageUrl: dto.imageUrl,
  }
}