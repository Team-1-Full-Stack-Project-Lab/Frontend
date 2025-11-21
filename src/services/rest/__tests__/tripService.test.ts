import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getTrips, createTrip, updateTrip, deleteTrip } from '../tripService'
import type { TripsResponse, TripResponse, CreateTripRequest, UpdateTripRequest } from '@/types'

/**
 * LEARNING: Testing API Services
 *
 * When testing services that make HTTP requests, we need to:
 * 1. Mock the fetch function to avoid real API calls
 * 2. Test that requests are made with correct parameters
 * 3. Test that responses are properly transformed
 * 4. Test error handling
 */

// Mock the auth service to provide a fake token
vi.mock('./authService', () => ({
  getToken: () => 'fake-token-12345',
}))

// Mock the backend URL config
vi.mock('@/config/api', () => ({
  BACKEND_URL: 'http://localhost:3000',
}))

// Mock the handleResponse utility
vi.mock('@/utils/helpers', () => ({
  handleResponse: vi.fn(res => res.json()),
}))

describe('tripService', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock globalThis fetch
    globalThis.fetch = vi.fn()
  })

  describe('getTrips', () => {
    it('should fetch and transform trips data', async () => {
      // LEARNING: Mock API response
      const mockResponse: TripsResponse = {
        trips: [
          {
            id: 1,
            name: 'Summer Vacation',
            cityId: 101,
            cityName: 'Paris',
            countryName: 'France',
            startDate: '2024-07-01',
            finishDate: '2024-07-10',
          },
          {
            id: 2,
            name: 'Winter Trip',
            cityId: 202,
            cityName: 'Tokyo',
            countryName: 'Japan',
            startDate: '2024-12-20',
            finishDate: '2024-12-28',
          },
        ],
      }

      // LEARNING: Setup fetch mock to return our mock data
      ;(globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await getTrips()

      // LEARNING: Verify fetch was called correctly
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/trips/itineraries',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token-12345',
          }),
        })
      )

      // LEARNING: Verify data transformation
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 1,
        name: 'Summer Vacation',
        cityId: 101,
        destination: 'Paris, France',
        startDate: '2024-07-01',
        endDate: '2024-07-10',
      })
    })

    it('should return empty array when no trips exist', async () => {
      ;(globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ trips: [] }),
      })

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
        cityId: 303,
        cityName: 'Honolulu',
        countryName: 'USA',
        startDate: '2024-08-01',
        finishDate: '2024-08-15',
      }

      ;(globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await createTrip(mockRequest)

      // LEARNING: Verify POST request
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/trips/itineraries',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token-12345',
          }),
          body: JSON.stringify(mockRequest),
        })
      )

      expect(result).toEqual({
        id: 3,
        name: 'Beach Vacation',
        cityId: 303,
        destination: 'Honolulu, USA',
        startDate: '2024-08-01',
        endDate: '2024-08-15',
      })
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
        cityId: 101,
        cityName: 'Paris',
        countryName: 'France',
        startDate: '2024-09-01',
        finishDate: '2024-09-10',
      }

      ;(globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await updateTrip(tripId, mockRequest)

      // LEARNING: Verify PUT request with ID in URL
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/trips/itineraries/${tripId}`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(mockRequest),
        })
      )

      expect(result.name).toBe('Updated Trip Name')
    })
  })

  describe('deleteTrip', () => {
    it('should delete a trip and return true on success', async () => {
      const tripId = 1

      ;(globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      const result = await deleteTrip(tripId)

      // LEARNING: Verify DELETE request
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/trips/itineraries/${tripId}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      )

      expect(result).toBe(true)
    })

    it('should return false when delete fails', async () => {
      ;(globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
      })

      const result = await deleteTrip(999)
      expect(result).toBe(false)
    })
  })
})
