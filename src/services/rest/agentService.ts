import { BACKEND_URL } from '@/config/api'
import { chatFromResponse, messageFromResponse } from '@/mappers/agentMapper'
import type {
  ChatRequest,
  ChatResponse,
  ConversationMessage,
  Chat,
  Message
} from '@/types'
import { handleResponse } from '@/utils/helpers'

export async function chatWithAgent(data: ChatRequest): Promise<Chat> {
  const res = await fetch(`${BACKEND_URL}/agent/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })
  const result = await handleResponse<ChatResponse>(res)
  return chatFromResponse(result)
}

export async function clearSession(sessionId: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/agent/session/${sessionId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error(`Failed to delete trip: ${res.statusText}`)
  }
}

export async function getSessionHistory(sessionId: string): Promise<Message[]> {
  const res = await fetch(`${BACKEND_URL}/agent/session/${sessionId}/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  const result = await handleResponse<ConversationMessage[]>(res)
  return result.map(messageFromResponse)
}
