import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getUserProfile, updateUserProfile, deleteUserAccount } from '../userService'
import type { UserResponse, UpdateUserRequest } from '@/types'

vi.mock('../authService', () => ({
  getToken: vi.fn(() => 'fake-token-123'),
}))
vi.mock('@/config/api', () => ({
  BACKEND_URL: 'http://localhost:8080',
}))
vi.mock('@/utils/helpers', () => ({
  handleResponse: vi.fn(res => res.json()),
}))
vi.mock('@/mappers/userMapper', () => ({
  userFromResponse: vi.fn(dto => ({
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    company: dto.company,
  })),
}))

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn()
  })

  describe('getUserProfile', () => {
    it('should fetch user profile successfully', async () => {
      const mockResponse: UserResponse = {
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response)

      const result = await getUserProfile()

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/user/profile',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token-123',
          },
          credentials: 'include',
        })
      )

      expect(result).toMatchObject({
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
      })
    })

    it('should throw error when no token is found', async () => {
      const { getToken } = await import('../authService')
      vi.mocked(getToken).mockReturnValueOnce(undefined)

      await expect(getUserProfile()).rejects.toThrow('No token found')
    })

    it('should throw error on 401 response', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response)

      await expect(getUserProfile()).rejects.toThrow('Invalid or expired token')
    })
  })

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const updateData: UpdateUserRequest = {
        email: 'user@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      }

      const mockResponse: UserResponse = {
        email: 'user@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response)

      const result = await updateUserProfile(updateData)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/user/profile',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token-123',
          },
          credentials: 'include',
          body: JSON.stringify(updateData),
        })
      )

      expect(result.firstName).toBe('Jane')
      expect(result.lastName).toBe('Smith')
    })

    it('should throw error when no token is found', async () => {
      const { getToken } = await import('../authService')
      vi.mocked(getToken).mockReturnValueOnce(undefined)

      await expect(
        updateUserProfile({ email: 'test@example.com', firstName: 'Test', lastName: 'User' })
      ).rejects.toThrow('No token found')
    })
  })

  describe('deleteUserAccount', () => {
    it('should delete user account successfully', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response)

      await deleteUserAccount()

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/user/profile',
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token-123',
          },
          credentials: 'include',
        })
      )
    })

    it('should throw error when no token is found', async () => {
      const { getToken } = await import('../authService')
      vi.mocked(getToken).mockReturnValueOnce(undefined)

      await expect(deleteUserAccount()).rejects.toThrow('No token found')
    })

    it('should throw error on failed deletion', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(deleteUserAccount()).rejects.toThrow('Failed to delete user account')
    })
  })
})
