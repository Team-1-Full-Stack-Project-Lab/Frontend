import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripStayUnits,
  addStayUnitToTrip,
  removeStayUnitFromTrip,
} from '../tripService'
import { apolloClient } from '@/config/apolloClient'
import type {
  CreateTripRequest,
  UpdateTripRequest,
  AddStayUnitRequest,
  TripGraphQL,
  TripStayUnitGraphQL,
} from '@/types'

vi.mock('@/config/apolloClient', () => ({
  apolloClient: {
    query: vi.fn(),
    mutate: vi.fn(),
  },
}))
vi.mock('@/mappers', () => ({
  tripFromGraphQL: vi.fn(trip => ({
    id: trip.id,
    name: trip.name,
    cityId: trip.city?.id,
    cityName: trip.city?.name,
    countryId: trip.country?.id,
    countryName: trip.country?.name,
    startDate: trip.startDate,
    endDate: trip.endDate,
  })),
  tripStayUnitFromGraphQL: vi.fn(tsu => {
    if (!tsu.trip || !tsu.stayUnit) return null
    return {
      trip: {
        id: tsu.trip.id,
        name: tsu.trip.name,
      },
      stayUnit: {
        id: tsu.stayUnit.id,
        stayNumber: tsu.stayUnit.stayNumber,
      },
      startDate: tsu.startDate,
      endDate: tsu.endDate,
    }
  }),
  dateToLocalString: vi.fn(date => date.toISOString().split('T')[0]),
}))

describe('GraphQL tripService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTrips', () => {
    it('should fetch all trips successfully', async () => {
      const mockTrips: TripGraphQL[] = [
        {
          id: '1',
          name: 'Paris Trip',
          city: { id: '1', name: 'Paris' },
          country: { id: '1', name: 'France' },
          startDate: '2024-07-01',
          endDate: '2024-07-10',
        },
        {
          id: '2',
          name: 'London Trip',
          city: { id: '2', name: 'London' },
          country: { id: '2', name: 'UK' },
          startDate: '2024-08-01',
          endDate: '2024-08-05',
        },
      ]

      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: { getUserItineraries: mockTrips },
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      const result = await getTrips()

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.anything(),
        fetchPolicy: 'network-only',
      })

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Paris Trip')
    })

    it('should throw error when fetching trips fails', async () => {
      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: null,
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      await expect(getTrips()).rejects.toThrow('Failed to fetch trips')
    })
  })

  describe('createTrip', () => {
    it('should create trip successfully', async () => {
      const request: CreateTripRequest = {
        name: 'New Trip',
        cityId: 1,
        startDate: '2024-07-01',
        endDate: '2024-07-10',
      }

      const mockResponse: TripGraphQL = {
        id: '3',
        name: 'New Trip',
        city: { id: '1', name: 'Paris' },
        country: { id: '1', name: 'France' },
        startDate: '2024-07-01',
        endDate: '2024-07-10',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { createItinerary: mockResponse },
      })

      const result = await createTrip(request)

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.anything(),
        variables: {
          request: expect.objectContaining({
            name: 'New Trip',
            cityId: 1,
          }),
        },
      })

      expect(result.name).toBe('New Trip')
    })

    it('should throw error when creation fails', async () => {
      const request: CreateTripRequest = {
        name: 'New Trip',
        cityId: 1,
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: null,
      })

      await expect(createTrip(request)).rejects.toThrow('Failed to create trip')
    })
  })

  describe('updateTrip', () => {
    it('should update trip successfully', async () => {
      const request: UpdateTripRequest = {
        name: 'Updated Trip',
      }

      const mockResponse: TripGraphQL = {
        id: '1',
        name: 'Updated Trip',
        city: { id: '1', name: 'Paris' },
        country: { id: '1', name: 'France' },
        startDate: '2024-07-01',
        endDate: '2024-07-10',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { updateItinerary: mockResponse },
      })

      const result = await updateTrip(1, request)

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.anything(),
        variables: {
          id: '1',
          request: expect.objectContaining({
            name: 'Updated Trip',
          }),
        },
      })

      expect(result.name).toBe('Updated Trip')
    })

    it('should throw error when update fails', async () => {
      const request: UpdateTripRequest = {
        name: 'Updated Trip',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: null,
      })

      await expect(updateTrip(1, request)).rejects.toThrow('Failed to update trip')
    })
  })

  describe('deleteTrip', () => {
    it('should delete trip successfully', async () => {
      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { deleteItinerary: { _empty: '' } },
      })

      await deleteTrip(1)

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.anything(),
        variables: { id: '1' },
      })
    })
  })

  describe('getTripStayUnits', () => {
    it('should fetch trip stay units successfully', async () => {
      const mockStayUnits: TripStayUnitGraphQL[] = [
        {
          trip: {
            id: '1',
            name: 'Paris Trip',
            city: { id: '1', name: 'Paris' },
            country: { id: '1', name: 'France' },
            startDate: '2024-07-01',
            endDate: '2024-07-10',
          },
          stayUnit: {
            id: '1',
            stayNumber: 'A101',
            numberOfBeds: 2,
            capacity: 2,
            pricePerNight: 100,
            roomType: 'Double',
          },
          startDate: '2024-07-01',
          endDate: '2024-07-05',
        },
      ]

      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: { getItineraryStayUnits: mockStayUnits },
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      const result = await getTripStayUnits(1)

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.anything(),
        variables: { tripId: '1' },
        fetchPolicy: 'network-only',
      })

      expect(result).toHaveLength(1)
    })

    it('should throw error when fetching fails', async () => {
      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: null,
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      await expect(getTripStayUnits(1)).rejects.toThrow('Failed to fetch trip stay units')
    })
  })

  describe('addStayUnitToTrip', () => {
    it('should add stay unit to trip successfully', async () => {
      const request: AddStayUnitRequest = {
        stayUnitId: 1,
        startDate: '2024-07-01',
        endDate: '2024-07-05',
      }

      const mockResponse: TripStayUnitGraphQL = {
        trip: {
          id: '1',
          name: 'Paris Trip',
          city: { id: '1', name: 'Paris' },
          country: { id: '1', name: 'France' },
          startDate: '2024-07-01',
          endDate: '2024-07-10',
        },
        stayUnit: {
          id: '1',
          stayNumber: 'A101',
          numberOfBeds: 2,
          capacity: 2,
          pricePerNight: 100,
          roomType: 'Double',
        },
        startDate: '2024-07-01',
        endDate: '2024-07-05',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { addStayUnitToItinerary: mockResponse },
      })

      const result = await addStayUnitToTrip(1, request)

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.anything(),
        variables: {
          tripId: '1',
          request: expect.objectContaining({
            stayUnitId: '1',
          }),
        },
      })

      expect(result.stayUnit.id).toBe('1')
    })

    it('should throw error when adding fails', async () => {
      const request: AddStayUnitRequest = {
        stayUnitId: 1,
        startDate: '2024-07-01',
        endDate: '2024-07-05',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: null,
      })

      await expect(addStayUnitToTrip(1, request)).rejects.toThrow('Failed to add stay unit to trip')
    })
  })

  describe('removeStayUnitFromTrip', () => {
    it('should remove stay unit from trip successfully', async () => {
      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { removeStayUnitFromItinerary: { _empty: '' } },
      })

      await removeStayUnitFromTrip(1, 1)

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.anything(),
        variables: {
          tripId: '1',
          stayUnitId: '1',
        },
      })
    })
  })
})
