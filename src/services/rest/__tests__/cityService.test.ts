import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getCities, getCityById } from '../cityService'
import type { GetCitiesParams, CityResponse, PageResponse } from '@/types'

vi.mock('../authService', () => ({
  getToken: vi.fn(() => 'fake-token-123'),
}))
vi.mock('@/config/api', () => ({
  BACKEND_URL: 'http://localhost:8080',
}))
vi.mock('@/utils/helpers', () => ({
  handleResponse: vi.fn(res => res.json()),
}))
vi.mock('@/mappers', () => ({
  cityFromResponse: vi.fn(dto => ({
    id: dto.id,
    name: dto.name,
    country: dto.country,
  })),
  pageFromResponse: vi.fn((pageDto, mapper) => ({
    content: pageDto.content.map(mapper),
    number: pageDto.number,
    size: pageDto.size,
    totalElements: pageDto.totalElements,
    totalPages: pageDto.totalPages,
    first: pageDto.first,
    last: pageDto.last,
    empty: pageDto.empty,
  })),
}))

describe('cityService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn()
  })

  describe('getCities', () => {
    it('should fetch cities with filters', async () => {
      const params: GetCitiesParams = {
        name: 'Paris',
        country: 1,
        featured: true,
        page: 0,
        size: 10,
      }

      const mockResponse: PageResponse<CityResponse> = {
        content: [
          {
            id: 1,
            name: 'Paris',
            country: {
              id: 1,
              name: 'France',
              iso2Code: 'FR',
            },
            latitude: 48.8566,
            longitude: 2.3522,
            isCapital: true,
            isFeatured: true,
          },
        ],
        number: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true,
        empty: false,
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getCities(params)

      const calledUrl = vi.mocked(globalThis.fetch).mock.calls[0][0] as string
      expect(calledUrl).toContain('name=Paris')
      expect(calledUrl).toContain('country=1')
      expect(calledUrl).toContain('featured=true')
      expect(calledUrl).toContain('page=0')
      expect(calledUrl).toContain('size=10')

      expect(result.content).toHaveLength(1)
      expect(result.content[0].name).toBe('Paris')
    })

    it('should fetch cities without filters', async () => {
      const mockResponse: PageResponse<CityResponse> = {
        content: [],
        number: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        empty: true,
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getCities()

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/cities',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token-123',
          },
          credentials: 'include',
        })
      )

      expect(result.content).toHaveLength(0)
    })
  })

  describe('getCityById', () => {
    it('should fetch city by id', async () => {
      const mockResponse: CityResponse = {
        id: 1,
        name: 'Tokyo',
        country: {
          id: 2,
          name: 'Japan',
          iso2Code: 'JP',
        },
        latitude: 35.6762,
        longitude: 139.6503,
        isCapital: true,
        isFeatured: true,
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getCityById(1)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/cities/1',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token-123',
          },
          credentials: 'include',
        })
      )

      expect(result.id).toBe(1)
      expect(result.name).toBe('Tokyo')
    })
  })
})
