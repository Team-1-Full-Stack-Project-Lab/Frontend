import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getTrips, createTrip, updateTrip, deleteTrip } from '../tripService'
import type { TripsResponse, TripResponse, CreateTripRequest, UpdateTripRequest } from '@/types'

vi.mock('../authService', () => ({
  getToken: () => 'fake-token-12345',
}))
vi.mock('@/config/api', () => ({
  BACKEND_URL: 'http://localhost:3000',
}))
vi.mock('@/utils/helpers', () => ({
  handleResponse: vi.fn(res => res.json()),
}))

describe('tripService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn()
  })

  describe('getTrips', () => {
    it('should fetch and transform trips data', async () => {
      const mockResponse: TripsResponse = [
        {
          id: 1,
          name: 'Summer Vacation',
          city: {
            id: 101,
            name: 'Paris',
            latitude: 0,
            longitude: 0,
            isCapital: true,
            isFeatured: true,
            country: {
              id: 1,
              name: 'France',
              iso2Code: 'FR',
            },
          },
          country: {
            id: 1,
            name: 'France',
            iso2Code: 'FR',
          },
          startDate: '2024-07-01',
          endDate: '2024-07-10',
        },
        {
          id: 2,
          name: 'Winter Trip',
          city: {
            id: 202,
            name: 'Tokyo',
            latitude: 0,
            longitude: 0,
            isCapital: true,
            isFeatured: true,
            country: {
              id: 2,
              name: 'Japan',
              iso2Code: 'JP',
            },
          },
          country: {
            id: 2,
            name: 'Japan',
            iso2Code: 'JP',
          },
          startDate: '2024-12-20',
          endDate: '2024-12-28',
        },
      ]

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getTrips()

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/trips/itineraries',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token-12345',
          }),
          credentials: 'include',
        })
      )

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        id: 1,
        name: 'Summer Vacation',
        destination: 'Paris, France',
      })
      expect(result[0].city?.id).toBe(101)
      expect(result[0].startDate).toBeInstanceOf(Date)
      expect(result[0].endDate).toBeInstanceOf(Date)
    })

    it('should return empty array when no trips exist', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response)

      const result = await getTrips()
      expect(result).toEqual([])
    })
  })

  describe('createTrip', () => {
    it('should create a new trip', async () => {
      const mockRequest: CreateTripRequest = {
        name: 'Beach Vacation',
        cityId: 303,
        startDate: '2024-08-01',
        endDate: '2024-08-15',
      }

      const mockResponse: TripResponse = {
        id: 3,
        name: 'Beach Vacation',
        city: {
          id: 303,
          name: 'Honolulu',
          latitude: 0,
          longitude: 0,
          isCapital: false,
          isFeatured: true,
          country: {
            id: 3,
            name: 'USA',
            iso2Code: 'US',
          },
        },
        country: {
          id: 3,
          name: 'USA',
          iso2Code: 'US',
        },
        startDate: '2024-08-01',
        endDate: '2024-08-15',
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await createTrip(mockRequest)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/trips/itineraries',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token-12345',
          }),
          body: JSON.stringify(mockRequest),
          credentials: 'include',
        })
      )

      expect(result).toMatchObject({
        id: 3,
        name: 'Beach Vacation',
      })
      expect(result.city?.id).toBe(303)
      expect(result.startDate).toBeInstanceOf(Date)
      expect(result.endDate).toBeInstanceOf(Date)
    })
  })

  describe('updateTrip', () => {
    it('should update an existing trip', async () => {
      const tripId = 1
      const mockRequest: UpdateTripRequest = {
        name: 'Updated Trip Name',
        startDate: '2024-09-01',
      }

      const mockResponse: TripResponse = {
        id: tripId,
        name: 'Updated Trip Name',
        city: {
          id: 101,
          name: 'Paris',
          latitude: 0,
          longitude: 0,
          isCapital: true,
          isFeatured: true,
          country: {
            id: 1,
            name: 'France',
            iso2Code: 'FR',
          },
        },
        startDate: '2024-09-01',
        endDate: '2024-09-10',
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await updateTrip(tripId, mockRequest)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/trips/itineraries/${tripId}`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(mockRequest),
          credentials: 'include',
        })
      )

      expect(result.name).toBe('Updated Trip Name')
    })
  })

  describe('deleteTrip', () => {
    it('should delete a trip successfully', async () => {
      const tripId = 1

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response)

      await deleteTrip(tripId)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/trips/itineraries/${tripId}`,
        expect.objectContaining({
          method: 'DELETE',
          credentials: 'include',
        })
      )
    })

    it('should throw error when delete fails', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response)

      await expect(deleteTrip(999)).rejects.toThrow('Failed to delete trip: Not Found')
    })
  })
})
