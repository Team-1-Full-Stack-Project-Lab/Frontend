import { describe, it, expect, beforeEach, vi } from 'vitest'
import { chatWithAgent, getSessionHistory } from '../agentService'
import { apolloClient } from '@/config/apolloClient'
import type { ChatRequest, ChatResponseGraphQL, ConversationMessageGraphQL } from '@/types'

vi.mock('@/config/apolloClient', () => ({
  apolloClient: {
    mutate: vi.fn(),
    query: vi.fn(),
  },
}))
vi.mock('@/mappers', () => ({
  chatFromGraphQL: vi.fn(chat => ({
    response: chat.response,
    sessionId: chat.sessionId,
    hotels: chat.hotels,
  })),
  messageFromGraphQL: vi.fn(msg => ({
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp,
  })),
}))

describe('GraphQL agentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('chatWithAgent', () => {
    it('should send chat message successfully', async () => {
      const request: ChatRequest = {
        message: 'Hello, I need help finding a hotel',
        sessionId: 'session-123',
      }

      const mockResponse: ChatResponseGraphQL = {
        response: 'Hello! I can help you find a hotel.',
        sessionId: 'session-123',
        hotels: [],
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { chatWithAgent: mockResponse },
      })

      const result = await chatWithAgent(request)

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.anything(),
        variables: {
          message: 'Hello, I need help finding a hotel',
          sessionId: 'session-123',
        },
      })

      expect(result.response).toBe('Hello! I can help you find a hotel.')
      expect(result.sessionId).toBe('session-123')
    })

    it('should handle message without session id', async () => {
      const request: ChatRequest = {
        message: 'What hotels are available?',
      }

      const mockResponse: ChatResponseGraphQL = {
        response: 'Let me help you find available hotels.',
        sessionId: 'new-session-456',
        hotels: [],
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { chatWithAgent: mockResponse },
      })

      const result = await chatWithAgent(request)

      expect(result.sessionId).toBe('new-session-456')
    })

    it('should throw error when chat fails', async () => {
      const request: ChatRequest = {
        message: 'Hello',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: null,
      })

      await expect(chatWithAgent(request)).rejects.toThrow('Failed to chat with agent')
    })
  })

  describe('getSessionHistory', () => {
    it('should fetch session history successfully', async () => {
      const mockHistory: ConversationMessageGraphQL[] = [
        {
          role: 'user',
          content: 'I want to book a hotel in Paris',
          timestamp: 1704103200000,
        },
        {
          role: 'agent',
          content: 'I can help you with that.',
          timestamp: 1704103205000,
        },
      ]

      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: { getSessionHistory: mockHistory },
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      const result = await getSessionHistory('session-123')

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.anything(),
        variables: { sessionId: 'session-123' },
        fetchPolicy: 'network-only',
      })

      expect(result).toHaveLength(2)
      expect(result[0].role).toBe('user')
      expect(result[1].role).toBe('agent')
    })

    it('should throw error when fetching history fails', async () => {
      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: null,
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      await expect(getSessionHistory('session-123')).rejects.toThrow('Failed to fetch session history')
    })
  })
})
