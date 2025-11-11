import { gql } from '@apollo/client'
import { apolloClient } from '@/config/apolloClient'
import type { City, GetCitiesParams, CityGraphQL } from '@/types'

const GET_CITIES_QUERY = gql`
  query GetAllCities($name: String, $country: ID, $state: ID, $featured: Boolean, $page: Int, $size: Int) {
    getAllCities(name: $name, country: $country, state: $state, featured: $featured, page: $page, size: $size) {
      content {
        id
        name
        nameAscii
        latitude
        longitude
        timezone
        googlePlaceId
        population
        isCapital
        isFeatured
        country {
          id
          name
          iso2Code
          iso3Code
          phoneCode
          currencyCode
          currencySymbol
        }
        state {
          id
          name
          code
          latitude
          longitude
        }
      }
      totalElements
      totalPages
      number
      size
      first
      last
    }
  }
`

const GET_CITY_BY_ID_QUERY = gql`
  query GetCityById($id: ID!) {
    getCityById(id: $id) {
      id
      name
      nameAscii
      latitude
      longitude
      timezone
      googlePlaceId
      population
      isCapital
      isFeatured
      country {
        id
        name
        iso2Code
        iso3Code
        phoneCode
        currencyCode
        currencySymbol
      }
      state {
        id
        name
        code
        latitude
        longitude
      }
    }
  }
`

export async function getCities(params?: GetCitiesParams): Promise<City[]> {
  const variables: Record<string, unknown> = {
    page: 0,
    size: 20,
  }

  if (params) {
    if (params.name) variables.name = params.name
    if (params.country) variables.country = params.country.toString()
    if (params.state) variables.state = params.state.toString()
    if (params.featured !== undefined) variables.featured = params.featured
    if (params.page !== undefined) variables.page = params.page
    if (params.size !== undefined) variables.size = params.size
  }

  const { data } = await apolloClient.query<{
    getAllCities: {
      content: CityGraphQL[]
      totalElements: number
      totalPages: number
    }
  }>({
    query: GET_CITIES_QUERY,
    variables,
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch cities')

  return data.getAllCities.content.map(city => ({
    id: parseInt(city.id),
    name: city.name,
    nameAscii: city.nameAscii,
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone,
    googlePlaceId: city.googlePlaceId,
    population: city.population,
    isCapital: city.isCapital,
    isFeatured: city.isFeatured,
    country: {
      id: parseInt(city.country.id),
      name: city.country.name,
      iso2Code: city.country.iso2Code,
      iso3Code: city.country.iso3Code,
      phoneCode: city.country.phoneCode || '',
      currencyCode: city.country.currencyCode || '',
      currencySymbol: city.country.currencySymbol || '',
    },
    state: city.state
      ? {
          id: parseInt(city.state.id),
          name: city.state.name,
          code: city.state.code,
          latitude: city.state.latitude || 0,
          longitude: city.state.longitude || 0,
        }
      : undefined,
  }))
}

export async function getCityById(id: number): Promise<City> {
  const { data } = await apolloClient.query<{ getCityById: CityGraphQL }>({
    query: GET_CITY_BY_ID_QUERY,
    variables: { id: id.toString() },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch city')

  const city = data.getCityById
  return {
    id: parseInt(city.id),
    name: city.name,
    nameAscii: city.nameAscii,
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone,
    googlePlaceId: city.googlePlaceId,
    population: city.population,
    isCapital: city.isCapital,
    isFeatured: city.isFeatured,
    country: {
      id: parseInt(city.country.id),
      name: city.country.name,
      iso2Code: city.country.iso2Code,
      iso3Code: city.country.iso3Code,
      phoneCode: city.country.phoneCode || '',
      currencyCode: city.country.currencyCode || '',
      currencySymbol: city.country.currencySymbol || '',
    },
    state: city.state
      ? {
          id: parseInt(city.state.id),
          name: city.state.name,
          code: city.state.code,
          latitude: city.state.latitude || 0,
          longitude: city.state.longitude || 0,
        }
      : undefined,
  }
}
