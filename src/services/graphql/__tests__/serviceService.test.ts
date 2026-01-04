import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getAllServices, getServiceById } from '../serviceService'
import { apolloClient } from '@/config/apolloClient'
import type { ServiceGraphQL } from '@/types'

vi.mock('@/config/apolloClient', () => ({
  apolloClient: {
    query: vi.fn(),
  },
}))
vi.mock('@/mappers', () => ({
  serviceFromGraphQL: vi.fn(service => ({
    id: service.id,
    name: service.name,
    icon: service.icon,
  })),
}))

describe('GraphQL serviceService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllServices', () => {
    it('should fetch all services successfully', async () => {
      const mockServices: ServiceGraphQL[] = [
        { id: '1', name: 'WiFi', icon: 'wifi' },
        { id: '2', name: 'Pool', icon: 'waves' },
        { id: '3', name: 'Parking', icon: 'car' },
      ]

      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: { getAllServices: mockServices },
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      const result = await getAllServices()

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.anything(),
        variables: { name: undefined },
        fetchPolicy: 'network-only',
      })

      expect(result).toHaveLength(3)
      expect(result[0].name).toBe('WiFi')
    })

    it('should fetch services with name filter', async () => {
      const mockServices: ServiceGraphQL[] = [{ id: '1', name: 'WiFi', icon: 'wifi' }]

      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: { getAllServices: mockServices },
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      const result = await getAllServices('WiFi')

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.anything(),
        variables: { name: 'WiFi' },
        fetchPolicy: 'network-only',
      })

      expect(result).toHaveLength(1)
    })

    it('should throw error when fetching fails', async () => {
      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: null,
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      await expect(getAllServices()).rejects.toThrow('Failed to fetch services')
    })
  })

  describe('getServiceById', () => {
    it('should fetch service by id successfully', async () => {
      const mockService: ServiceGraphQL = {
        id: '1',
        name: 'Gym',
        icon: 'dumbbell',
      }

      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: { getServiceById: mockService },
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      const result = await getServiceById(1)

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.anything(),
        variables: { id: '1' },
        fetchPolicy: 'network-only',
      })

      expect(result.name).toBe('Gym')
      expect(result.icon).toBe('dumbbell')
    })

    it('should throw error when service not found', async () => {
      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: { getServiceById: null },
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      await expect(getServiceById(1)).rejects.toThrow('Service not found')
    })
  })
})
