import { describe, it, expect, beforeEach, vi } from 'vitest'
import { chatWithAgent, clearSession, getSessionHistory } from '../agentService'
import type { ChatRequest, ChatResponse, ConversationMessage } from '@/types'

vi.mock('@/config/api', () => ({
  BACKEND_URL: 'http://localhost:8080',
}))
vi.mock('@/utils/helpers', () => ({
  handleResponse: vi.fn(res => res.json()),
}))
vi.mock('@/mappers', () => ({
  chatFromResponse: vi.fn(dto => ({
    sessionId: dto.sessionId,
    response: dto.response,
  })),
  messageFromResponse: vi.fn(dto => ({
    role: dto.role,
    content: dto.content,
    timestamp: dto.timestamp,
  })),
}))

describe('agentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn()
  })

  describe('chatWithAgent', () => {
    it('should send chat message and receive response', async () => {
      const chatRequest: ChatRequest = {
        message: 'Hello, I need help finding a hotel',
        sessionId: 'session-123',
      }

      const mockResponse: ChatResponse = {
        sessionId: 'session-123',
        response: 'Hello! I can help you find a hotel. What city are you interested in?',
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await chatWithAgent(chatRequest)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/agent/chat',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chatRequest),
          credentials: 'include',
        })
      )

      expect(result.sessionId).toBe('session-123')
      expect(result.response).toContain('help you find a hotel')
    })

    it('should handle first message without session id', async () => {
      const chatRequest: ChatRequest = {
        message: 'What hotels are available?',
      }

      const mockResponse: ChatResponse = {
        sessionId: 'new-session-456',
        response: 'Let me help you find available hotels.',
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await chatWithAgent(chatRequest)

      expect(result.sessionId).toBe('new-session-456')
    })
  })

  describe('clearSession', () => {
    it('should clear chat session successfully', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response)

      await clearSession('session-123')

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/agent/session/session-123',
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
      )
    })

    it('should throw error when session deletion fails', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response)

      await expect(clearSession('invalid-session')).rejects.toThrow('Failed to delete trip: Not Found')
    })
  })

  describe('getSessionHistory', () => {
    it('should fetch session history', async () => {
      const mockResponse: ConversationMessage[] = [
        {
          role: 'user',
          content: 'I want to book a hotel in Paris',
          timestamp: 1704103200000,
        },
        {
          role: 'agent',
          content: 'I can help you with that. When would you like to stay?',
          timestamp: 1704103205000,
        },
        {
          role: 'user',
          content: 'Next week',
          timestamp: 1704103260000,
        },
      ]

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getSessionHistory('session-123')

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/agent/session/session-123/history',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
      )

      expect(result).toHaveLength(3)
      expect(result[0].role).toBe('user')
      expect(result[1].role).toBe('agent')
    })

    it('should return empty array when no history exists', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response)

      const result = await getSessionHistory('new-session')

      expect(result).toEqual([])
    })
  })
})
