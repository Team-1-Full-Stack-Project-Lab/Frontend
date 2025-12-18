import { BACKEND_URL } from '@/config/api'
import type {
  ChatRequest,
  ChatResponse,
  ConversationMessage
} from '@/types'
import { handleResponse } from '@/utils/helpers'

export async function chatWithAgent(data: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${BACKEND_URL}/agent/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })
  const result = await handleResponse<ChatResponse>(res)
  return result
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

export async function getSessionHistory(sessionId: string): Promise<ConversationMessage[]> {
  const res = await fetch(`${BACKEND_URL}/agent/session/${sessionId}/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  const result = await handleResponse<ConversationMessage[]>(res)
  return result
}
