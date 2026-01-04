import { describe, it, expect, beforeEach, vi } from 'vitest'
import { login, register, getCurrentUser, logout, getToken, isAuthenticated } from '../authService'
import * as userService from '../userService'
import Cookies from 'js-cookie'
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types'

vi.mock('js-cookie')
vi.mock('@/config/api', () => ({
  BACKEND_URL: 'http://localhost:8080',
  TOKEN_COOKIE_NAME: 'token',
  TOKEN_EXPIRY_DAYS: 7,
}))
vi.mock('@/utils/helpers', () => ({
  handleResponse: vi.fn(res => res.json()),
}))
vi.mock('../userService', () => ({
  getUserProfile: vi.fn(),
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn()
  })

  describe('login', () => {
    it('should login successfully and set token cookie', async () => {
      const mockRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      }

      const mockResponse: AuthResponse = {
        token: 'jwt-token-123',
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await login(mockRequest)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockRequest),
          credentials: 'include',
        })
      )

      expect(Cookies.set).toHaveBeenCalledWith('token', 'jwt-token-123', {
        expires: 7,
        secure: false,
        sameSite: 'strict',
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('register', () => {
    it('should register successfully and set token cookie', async () => {
      const mockRequest: RegisterRequest = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
      }

      const mockResponse: AuthResponse = {
        token: 'jwt-token-456',
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await register(mockRequest)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockRequest),
        })
      )

      expect(Cookies.set).toHaveBeenCalledWith('token', 'jwt-token-456', {
        expires: 7,
        secure: false,
        sameSite: 'strict',
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('getCurrentUser', () => {
    it('should get current user profile', async () => {
      const mockUser: User = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
      }

      vi.mocked(userService.getUserProfile).mockResolvedValueOnce(mockUser)

      const result = await getCurrentUser()

      expect(userService.getUserProfile).toHaveBeenCalled()
      expect(result).toEqual(mockUser)
    })
  })

  describe('logout', () => {
    it('should remove token cookie', () => {
      logout()
      expect(Cookies.remove).toHaveBeenCalledWith('token')
    })
  })

  describe('getToken', () => {
    it('should return token from cookies', () => {
      vi.mocked(Cookies.get).mockImplementation(() => 'test-token' as unknown as ReturnType<typeof Cookies.get>)

      const token = getToken()

      expect(Cookies.get).toHaveBeenCalledWith('token')
      expect(token).toBe('test-token')
    })

    it('should return undefined when no token exists', () => {
      vi.mocked(Cookies.get).mockImplementation(() => undefined as unknown as ReturnType<typeof Cookies.get>)

      const token = getToken()

      expect(token).toBeUndefined()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      vi.mocked(Cookies.get).mockImplementation(() => 'test-token' as unknown as ReturnType<typeof Cookies.get>)

      const result = isAuthenticated()

      expect(result).toBe(true)
    })

    it('should return false when no token exists', () => {
      vi.mocked(Cookies.get).mockImplementation(() => undefined as unknown as ReturnType<typeof Cookies.get>)

      const result = isAuthenticated()

      expect(result).toBe(false)
    })
  })
})
