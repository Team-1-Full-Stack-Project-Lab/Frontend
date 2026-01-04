import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getAllServices, getServiceById } from '../serviceService'
import type { ServiceResponse } from '@/types'

vi.mock('@/config/api', () => ({
  BACKEND_URL: 'http://localhost:8080',
}))
vi.mock('@/utils/helpers', () => ({
  handleResponse: vi.fn(res => res.json()),
}))
vi.mock('@/mappers', () => ({
  serviceFromResponse: vi.fn(dto => ({
    id: dto.id,
    name: dto.name,
    icon: dto.icon,
  })),
}))

describe('serviceService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn()
  })

  describe('getAllServices', () => {
    it('should fetch all services', async () => {
      const mockResponse: ServiceResponse[] = [
        {
          id: 1,
          name: 'WiFi',
          icon: 'wifi',
        },
        {
          id: 2,
          name: 'Pool',
          icon: 'waves',
        },
        {
          id: 3,
          name: 'Parking',
          icon: 'car',
        },
      ]

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getAllServices()

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/services?',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )

      expect(result).toHaveLength(3)
      expect(result[0].name).toBe('WiFi')
      expect(result[1].name).toBe('Pool')
      expect(result[2].name).toBe('Parking')
    })

    it('should fetch services with name filter', async () => {
      const mockResponse: ServiceResponse[] = [
        {
          id: 1,
          name: 'WiFi',
          icon: 'wifi',
        },
      ]

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getAllServices('WiFi')

      const calledUrl = vi.mocked(globalThis.fetch).mock.calls[0][0] as string
      expect(calledUrl).toContain('name=WiFi')

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('WiFi')
    })

    it('should return empty array when no services exist', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response)

      const result = await getAllServices()

      expect(result).toEqual([])
    })
  })

  describe('getServiceById', () => {
    it('should fetch service by id', async () => {
      const mockResponse: ServiceResponse = {
        id: 1,
        name: 'Gym',
        icon: 'dumbbell',
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getServiceById(1)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/services/1',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )

      expect(result.id).toBe(1)
      expect(result.name).toBe('Gym')
      expect(result.icon).toBe('dumbbell')
    })
  })
})
