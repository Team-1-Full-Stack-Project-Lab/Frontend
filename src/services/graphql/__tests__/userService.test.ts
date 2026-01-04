import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getUserProfile, updateUserProfile, deleteUserAccount } from '../userService'
import { apolloClient } from '@/config/apolloClient'
import type { UserGraphQL } from '@/types'

vi.mock('@/config/apolloClient', () => ({
  apolloClient: {
    query: vi.fn(),
    mutate: vi.fn(),
  },
}))
vi.mock('@/mappers', () => ({
  userFromGraphQL: vi.fn(user => ({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    company: user.company,
  })),
}))

describe('GraphQL userService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUserProfile', () => {
    it('should fetch user profile successfully', async () => {
      const mockUser: UserGraphQL = {
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
      }

      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: { getUser: mockUser },
      })

      const result = await getUserProfile()

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.anything(),
        fetchPolicy: 'network-only',
      })

      expect(result).toEqual({
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        company: undefined,
      })
    })

    it('should throw error when fetching fails', async () => {
      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: null,
      })

      await expect(getUserProfile()).rejects.toThrow('Failed to fetch user profile')
    })
  })

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
      }

      const mockResponse: UserGraphQL = {
        email: 'user@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { updateUser: mockResponse },
      })

      const result = await updateUserProfile(updateData)

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.anything(),
        variables: {
          request: {
            firstName: 'Jane',
            lastName: 'Smith',
          },
        },
      })

      expect(result.firstName).toBe('Jane')
      expect(result.lastName).toBe('Smith')
    })

    it('should throw error when update fails', async () => {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: null,
      })

      await expect(updateUserProfile(updateData)).rejects.toThrow('Failed to update user profile')
    })
  })

  describe('deleteUserAccount', () => {
    it('should delete user account successfully', async () => {
      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { deleteUser: { _empty: '' } },
      })

      await deleteUserAccount()

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.anything(),
      })
    })

    it('should throw error when deletion fails', async () => {
      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: null,
      })

      await expect(deleteUserAccount()).rejects.toThrow('Failed to delete user account')
    })

    it('should throw error when deleteUser is null', async () => {
      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { deleteUser: null },
      })

      await expect(deleteUserAccount()).rejects.toThrow('Failed to delete user account')
    })
  })
})
