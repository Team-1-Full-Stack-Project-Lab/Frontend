import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getCities, getCityById } from '../cityService'
import { apolloClient } from '@/config/apolloClient'
import type { CityGraphQL, GetCitiesParams } from '@/types'

vi.mock('@/config/apolloClient', () => ({
  apolloClient: {
    query: vi.fn(),
  },
}))
vi.mock('@/mappers', () => ({}))

describe('GraphQL cityService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCities', () => {
    it('should fetch cities with default params', async () => {
      const mockCities: CityGraphQL[] = [
        {
          id: '1',
          name: 'Paris',
          nameAscii: 'Paris',
          latitude: 48.8566,
          longitude: 2.3522,
          timezone: 'Europe/Paris',
          googlePlaceId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
          population: 2161000,
          isCapital: true,
          isFeatured: true,
          country: {
            id: '1',
            name: 'France',
            iso2Code: 'FR',
            iso3Code: 'FRA',
            phoneCode: '+33',
            currencyCode: 'EUR',
            currencySymbol: '€',
          },
          state: {
            id: '1',
            name: 'Île-de-France',
            code: 'IDF',
            latitude: 48.8499,
            longitude: 2.637,
          },
        },
      ]

      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: {
          getAllCities: {
            content: mockCities,
          },
        },
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      const result = await getCities()

      expect(apolloClient.query).toHaveBeenCalled()
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Paris')
    })

    it('should fetch cities with filters', async () => {
      const params: GetCitiesParams = {
        name: 'Tokyo',
        country: 2,
        state: 2,
        featured: true,
        page: 1,
        size: 5,
        sort: 'name,asc',
      }

      const mockCities: CityGraphQL[] = [
        {
          id: '2',
          name: 'Tokyo',
          nameAscii: 'Tokyo',
          latitude: 35.6895,
          longitude: 139.6917,
          timezone: 'Asia/Tokyo',
          googlePlaceId: 'ChIJXSModoWLGGARYL4GyKFOPck',
          population: 13960000,
          isCapital: true,
          isFeatured: true,
          country: {
            id: '2',
            name: 'Japan',
            iso2Code: 'JP',
            iso3Code: 'JPN',
            phoneCode: '+81',
            currencyCode: 'JPY',
            currencySymbol: '¥',
          },
          state: {
            id: '2',
            name: 'Kanto',
            code: 'KT',
            latitude: 36.5,
            longitude: 139.5,
          },
        },
      ]

      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: {
          getAllCities: {
            content: mockCities,
          },
        },
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      const result = await getCities(params)

      expect(apolloClient.query).toHaveBeenCalled()
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Tokyo')
    })

    it('should return empty array when no cities found', async () => {
      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: {
          getAllCities: {
            content: [],
          },
        },
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      const result = await getCities({ name: 'NonexistentCity' })

      expect(result).toHaveLength(0)
    })

    it('should throw error when fetching fails', async () => {
      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: null,
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      await expect(getCities()).rejects.toThrow('Failed to fetch cities')
    })
  })

  describe('getCityById', () => {
    it('should fetch city by id successfully', async () => {
      const mockCity: CityGraphQL = {
        id: '1',
        name: 'London',
        nameAscii: 'London',
        latitude: 51.5074,
        longitude: -0.1278,
        timezone: 'Europe/London',
        googlePlaceId: 'ChIJdd4hrwug2EcRmSrV3Vo6llI',
        population: 8982000,
        isCapital: true,
        isFeatured: true,
        country: {
          id: '3',
          name: 'United Kingdom',
          iso2Code: 'GB',
          iso3Code: 'GBR',
          phoneCode: '+44',
          currencyCode: 'GBP',
          currencySymbol: '£',
        },
        state: {
          id: '3',
          name: 'England',
          code: 'ENG',
          latitude: 52.3555,
          longitude: -1.1743,
        },
      }

      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: { getCityById: mockCity },
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      const result = await getCityById(1)

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.anything(),
        variables: { id: '1' },
        fetchPolicy: 'network-only',
      })

      expect(result.name).toBe('London')
      expect(result.country?.name).toBe('United Kingdom')
    })

    it('should throw error when city not found', async () => {
      vi.mocked(apolloClient.query).mockRejectedValueOnce(new Error('City not found'))

      await expect(getCityById(999)).rejects.toThrow('City not found')
    })
  })
})
