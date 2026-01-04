import { describe, it, expect, beforeEach, vi } from 'vitest'
import { login, register, getCurrentUser, logout, getToken, isAuthenticated } from '../authService'
import { apolloClient } from '@/config/apolloClient'
import Cookies from 'js-cookie'
import type { LoginRequest, RegisterRequest, AuthResponse, UserGraphQL } from '@/types'

vi.mock('js-cookie')
vi.mock('@/config/api', () => ({
  BACKEND_URL: 'http://localhost:8080',
  TOKEN_COOKIE_NAME: 'token',
  TOKEN_EXPIRY_DAYS: 7,
}))
vi.mock('@/config/apolloClient', () => ({
  apolloClient: {
    mutate: vi.fn(),
    query: vi.fn(),
    clearStore: vi.fn(),
  },
}))
vi.mock('@/mappers', () => ({
  userFromGraphQL: vi.fn(user => ({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
  })),
}))

describe('GraphQL authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { login: mockResponse },
      })

      const result = await login(mockRequest)

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.anything(),
        variables: { request: mockRequest },
      })

      expect(Cookies.set).toHaveBeenCalledWith('token', 'jwt-token-123', {
        expires: 7,
        secure: false,
        sameSite: 'strict',
      })

      expect(result).toEqual(mockResponse)
    })

    it('should throw error when login fails', async () => {
      const mockRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: null,
      })

      await expect(login(mockRequest)).rejects.toThrow('Login failed')
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

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { register: mockResponse },
      })

      const result = await register(mockRequest)

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.anything(),
        variables: { request: mockRequest },
      })

      expect(Cookies.set).toHaveBeenCalledWith('token', 'jwt-token-456', {
        expires: 7,
        secure: false,
        sameSite: 'strict',
      })

      expect(result).toEqual(mockResponse)
    })

    it('should throw error when registration fails', async () => {
      const mockRequest: RegisterRequest = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: null,
      })

      await expect(register(mockRequest)).rejects.toThrow('Registration failed')
    })
  })

  describe('getCurrentUser', () => {
    it('should get current user profile', async () => {
      const mockUserGraphQL: UserGraphQL = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      }

      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: { getUser: mockUserGraphQL },
      })

      const result = await getCurrentUser()

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.anything(),
        fetchPolicy: 'network-only',
      })

      expect(result).toEqual({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
      })
    })

    it('should throw error when fetching user fails', async () => {
      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: null,
      })

      await expect(getCurrentUser()).rejects.toThrow('Failed to fetch user profile')
    })
  })

  describe('logout', () => {
    it('should remove token cookie and clear apollo store', () => {
      logout()

      expect(Cookies.remove).toHaveBeenCalledWith('token')
      expect(apolloClient.clearStore).toHaveBeenCalled()
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
