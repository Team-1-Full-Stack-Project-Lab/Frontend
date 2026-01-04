import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getAllStays, getStayById, getStaysByCity, searchStaysNearby, getAllStayTypes } from '../stayService'
import type { GetStaysParams, SearchNearbyParams, StayResponse, PageResponse, StayTypeResponse } from '@/types'

vi.mock('@/config/api', () => ({
  BACKEND_URL: 'http://localhost:8080',
}))
vi.mock('@/utils/helpers', () => ({
  handleResponse: vi.fn(res => res.json()),
}))
vi.mock('@/mappers', () => ({
  stayFromResponse: vi.fn(dto => ({
    id: dto.id,
    name: dto.name,
    description: dto.description,
    address: dto.address,
    pricePerNight: dto.pricePerNight,
  })),
  stayTypeFromResponse: vi.fn(dto => ({
    id: dto.id,
    name: dto.name,
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

describe('stayService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn()
  })

  describe('getAllStays', () => {
    it('should fetch all stays with filters', async () => {
      const params: GetStaysParams = {
        cityId: 1,
        serviceIds: [1, 2],
        minPrice: 50,
        maxPrice: 200,
        page: 0,
        size: 10,
      }

      const mockResponse: PageResponse<StayResponse> = {
        content: [
          {
            id: 1,
            name: 'Luxury Hotel',
            description: 'A luxury hotel',
            address: '123 Main St',
            latitude: 48.8566,
            longitude: 2.3522,
            city: { id: 1, name: 'Paris', latitude: 48.8566, longitude: 2.3522, isCapital: true, isFeatured: true },
            stayType: { id: 1, name: 'Hotel' },
            services: [],
            images: [],
            units: [],
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

      const result = await getAllStays(params)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:8080/api/stays?'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )

      const calledUrl = vi.mocked(globalThis.fetch).mock.calls[0][0] as string
      expect(calledUrl).toContain('cityId=1')
      expect(calledUrl).toContain('serviceIds=1')
      expect(calledUrl).toContain('serviceIds=2')
      expect(calledUrl).toContain('minPrice=50')
      expect(calledUrl).toContain('maxPrice=200')
      expect(calledUrl).toContain('page=0')
      expect(calledUrl).toContain('size=10')

      expect(result.content).toHaveLength(1)
      expect(result.totalElements).toBe(1)
    })

    it('should fetch all stays without filters', async () => {
      const mockResponse: PageResponse<StayResponse> = {
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

      const result = await getAllStays()

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/stays?', expect.any(Object))

      expect(result.content).toHaveLength(0)
    })
  })

  describe('getStayById', () => {
    it('should fetch stay by id', async () => {
      const mockResponse: StayResponse = {
        id: 1,
        name: 'Luxury Hotel',
        description: 'A luxury hotel',
        address: '123 Main St',
        latitude: 48.8566,
        longitude: 2.3522,
        city: { id: 1, name: 'Paris', latitude: 48.8566, longitude: 2.3522, isCapital: true, isFeatured: true },
        stayType: { id: 1, name: 'Hotel' },
        services: [],
        images: [],
        units: [],
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getStayById(1)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/stays/1',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )

      expect(result.id).toBe(1)
      expect(result.name).toBe('Luxury Hotel')
    })
  })

  describe('getStaysByCity', () => {
    it('should fetch stays by city with pagination', async () => {
      const mockResponse: PageResponse<StayResponse> = {
        content: [
          {
            id: 1,
            name: 'Paris Hotel',
            description: 'Hotel in Paris',
            address: '456 Paris St',
            latitude: 48.8566,
            longitude: 2.3522,
            city: { id: 1, name: 'Paris', latitude: 48.8566, longitude: 2.3522, isCapital: true, isFeatured: true },
            stayType: { id: 1, name: 'Hotel' },
            services: [],
            images: [],
            units: [],
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

      const result = await getStaysByCity(1, { page: 0, size: 10 })

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:8080/api/stays/city/1?'),
        expect.any(Object)
      )

      expect(result.content).toHaveLength(1)
      expect(result.content[0].name).toBe('Paris Hotel')
    })
  })

  describe('searchStaysNearby', () => {
    it('should search stays nearby with coordinates', async () => {
      const params: SearchNearbyParams = {
        latitude: 48.8566,
        longitude: 2.3522,
        radiusKm: 10,
        page: 0,
        size: 10,
      }

      const mockResponse: PageResponse<StayResponse> = {
        content: [
          {
            id: 1,
            name: 'Nearby Hotel',
            description: 'Close hotel',
            address: '789 Near St',
            latitude: 48.8566,
            longitude: 2.3522,
            city: { id: 1, name: 'Paris', latitude: 48.8566, longitude: 2.3522, isCapital: true, isFeatured: true },
            stayType: { id: 1, name: 'Hotel' },
            services: [],
            images: [],
            units: [],
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

      const result = await searchStaysNearby(params)

      const calledUrl = vi.mocked(globalThis.fetch).mock.calls[0][0] as string
      expect(calledUrl).toContain('latitude=48.8566')
      expect(calledUrl).toContain('longitude=2.3522')
      expect(calledUrl).toContain('radiusKm=10')

      expect(result.content).toHaveLength(1)
    })
  })

  describe('getAllStayTypes', () => {
    it('should fetch all stay types', async () => {
      const mockResponse: StayTypeResponse[] = [
        { id: 1, name: 'Hotel' },
        { id: 2, name: 'Apartment' },
        { id: 3, name: 'Villa' },
      ]

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getAllStayTypes()

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/stay-types?', expect.any(Object))

      expect(result).toHaveLength(3)
    })

    it('should fetch stay types with name filter', async () => {
      const mockResponse: StayTypeResponse[] = [{ id: 1, name: 'Hotel' }]

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await getAllStayTypes('Hotel')

      const calledUrl = vi.mocked(globalThis.fetch).mock.calls[0][0] as string
      expect(calledUrl).toContain('name=Hotel')
    })
  })
})
