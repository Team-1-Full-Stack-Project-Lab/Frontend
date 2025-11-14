import { gql } from '@apollo/client'
import { apolloClient } from '@/config/apolloClient'
import type { Stay, StayGraphQL, StayType, Service, StayUnit } from '@/types'
import type { SimplePage, PaginationParams } from '@/types/api'

export interface SearchNearbyParams extends PaginationParams {
  latitude: number
  longitude: number
  radius?: number
}

interface StayPageGraphQL {
  content: StayGraphQL[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

const STAY_FRAGMENT = gql`
  fragment StayFields on Stay {
    id
    name
    address
    latitude
    longitude
    city {
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
    stayType {
      id
      name
    }
    services {
      id
      name
      icon
    }
    units {
      id
      stayNumber
      numberOfBeds
      capacity
      pricePerNight
      roomType
    }
  }
`

const GET_ALL_STAYS_QUERY = gql`
  ${STAY_FRAGMENT}
  query GetAllStays($page: Int, $size: Int) {
    getAllStays(page: $page, size: $size) {
      content {
        ...StayFields
      }
      totalElements
      totalPages
      number
      size
      first
      last
      empty
    }
  }
`

const GET_STAY_BY_ID_QUERY = gql`
  ${STAY_FRAGMENT}
  query GetStayById($id: ID!) {
    getStayById(id: $id) {
      ...StayFields
    }
  }
`

const GET_STAYS_BY_CITY_QUERY = gql`
  ${STAY_FRAGMENT}
  query GetStaysByCity($cityId: ID!, $page: Int, $size: Int) {
    getStaysByCity(cityId: $cityId, page: $page, size: $size) {
      content {
        ...StayFields
      }
      totalElements
      totalPages
      number
      size
      first
      last
      empty
    }
  }
`

const SEARCH_STAYS_NEARBY_QUERY = gql`
  ${STAY_FRAGMENT}
  query SearchStaysNearby($latitude: Float!, $longitude: Float!, $radius: Float, $page: Int, $size: Int) {
    searchStaysNearby(latitude: $latitude, longitude: $longitude, radius: $radius, page: $page, size: $size) {
      content {
        ...StayFields
      }
      totalElements
      totalPages
      number
      size
      first
      last
      empty
    }
  }
`

const GET_ALL_STAY_TYPES_QUERY = gql`
  query GetAllStayTypes($name: String) {
    getAllStayTypes(name: $name) {
      id
      name
    }
  }
`

const GET_STAY_TYPE_BY_ID_QUERY = gql`
  query GetStayTypeById($id: ID!) {
    getStayTypeById(id: $id) {
      id
      name
    }
  }
`

const GET_ALL_SERVICES_QUERY = gql`
  query GetAllServices($name: String) {
    getAllServices(name: $name) {
      id
      name
      icon
    }
  }
`

const GET_SERVICE_BY_ID_QUERY = gql`
  query GetServiceById($id: ID!) {
    getServiceById(id: $id) {
      id
      name
      icon
    }
  }
`

const GET_STAY_UNIT_BY_ID_QUERY = gql`
  query GetStayUnitById($id: ID!) {
    getStayUnitById(id: $id) {
      id
      stayNumber
      numberOfBeds
      capacity
      pricePerNight
      roomType
    }
  }
`

const GET_STAY_UNITS_BY_STAY_ID_QUERY = gql`
  query GetStayUnitsByStayId($stayId: ID!) {
    getStayUnitsByStayId(stayId: $stayId) {
      id
      stayNumber
      numberOfBeds
      capacity
      pricePerNight
      roomType
    }
  }
`

const SEARCH_AVAILABLE_UNITS_QUERY = gql`
  query SearchAvailableUnits($stayId: ID!, $minCapacity: Int!, $maxPrice: Float!) {
    searchAvailableUnits(stayId: $stayId, minCapacity: $minCapacity, maxPrice: $maxPrice) {
      id
      stayNumber
      numberOfBeds
      capacity
      pricePerNight
      roomType
    }
  }
`

function mapStayFromGraphQL(stay: StayGraphQL): Stay {
  return {
    id: parseInt(stay.id),
    name: stay.name,
    address: stay.address,
    latitude: stay.latitude,
    longitude: stay.longitude,
    city: stay.city
      ? {
          id: parseInt(stay.city.id),
          name: stay.city.name,
          nameAscii: stay.city.nameAscii,
          latitude: stay.city.latitude,
          longitude: stay.city.longitude,
          timezone: stay.city.timezone,
          googlePlaceId: stay.city.googlePlaceId,
          population: stay.city.population,
          isCapital: stay.city.isCapital,
          isFeatured: stay.city.isFeatured,
          country: stay.city.country
            ? {
                id: parseInt(stay.city.country.id),
                name: stay.city.country.name,
                iso2Code: stay.city.country.iso2Code,
                iso3Code: stay.city.country.iso3Code,
                phoneCode: stay.city.country.phoneCode || '',
                currencyCode: stay.city.country.currencyCode || '',
                currencySymbol: stay.city.country.currencySymbol || '',
              }
            : undefined,
          state: stay.city.state
            ? {
                id: parseInt(stay.city.state.id),
                name: stay.city.state.name,
                code: stay.city.state.code,
                latitude: stay.city.state.latitude || 0,
                longitude: stay.city.state.longitude || 0,
              }
            : undefined,
        }
      : undefined,
    stayType: stay.stayType
      ? {
          id: parseInt(stay.stayType.id),
          name: stay.stayType.name,
        }
      : undefined,
    services: stay.services?.map(service => ({
      id: parseInt(service.id),
      name: service.name,
      icon: service.icon,
    })),
    units: stay.units?.map(unit => ({
      id: parseInt(unit.id),
      stayNumber: unit.stayNumber,
      numberOfBeds: unit.numberOfBeds,
      capacity: unit.capacity,
      pricePerNight: unit.pricePerNight,
      roomType: unit.roomType,
    })),
  }
}

export async function getAllStays(params?: PaginationParams): Promise<SimplePage<Stay>> {
  const { data } = await apolloClient.query<{ getAllStays: StayPageGraphQL }>({
    query: GET_ALL_STAYS_QUERY,
    variables: {
      page: params?.page,
      size: params?.size,
    },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch stays')

  return {
    content: data.getAllStays.content.map(mapStayFromGraphQL),
    totalElements: data.getAllStays.totalElements,
    totalPages: data.getAllStays.totalPages,
    number: data.getAllStays.number,
    size: data.getAllStays.size,
    first: data.getAllStays.first,
    last: data.getAllStays.last,
    empty: data.getAllStays.empty,
  }
}

export async function getStayById(id: number): Promise<Stay> {
  const { data } = await apolloClient.query<{ getStayById: StayGraphQL | null }>({
    query: GET_STAY_BY_ID_QUERY,
    variables: { id: id.toString() },
    fetchPolicy: 'network-only',
  })

  if (!data?.getStayById) throw new Error('Stay not found')

  return mapStayFromGraphQL(data.getStayById)
}

export async function getStaysByCity(cityId: number, params?: PaginationParams): Promise<SimplePage<Stay>> {
  const { data } = await apolloClient.query<{ getStaysByCity: StayPageGraphQL }>({
    query: GET_STAYS_BY_CITY_QUERY,
    variables: {
      cityId: cityId.toString(),
      page: params?.page,
      size: params?.size,
    },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch stays')

  return {
    content: data.getStaysByCity.content.map(mapStayFromGraphQL),
    totalElements: data.getStaysByCity.totalElements,
    totalPages: data.getStaysByCity.totalPages,
    number: data.getStaysByCity.number,
    size: data.getStaysByCity.size,
    first: data.getStaysByCity.first,
    last: data.getStaysByCity.last,
    empty: data.getStaysByCity.empty,
  }
}

export async function searchStaysNearby(params: SearchNearbyParams): Promise<SimplePage<Stay>> {
  const { data } = await apolloClient.query<{ searchStaysNearby: StayPageGraphQL }>({
    query: SEARCH_STAYS_NEARBY_QUERY,
    variables: {
      latitude: params.latitude,
      longitude: params.longitude,
      radius: params.radius,
      page: params.page,
      size: params.size,
    },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to search nearby stays')

  return {
    content: data.searchStaysNearby.content.map(mapStayFromGraphQL),
    totalElements: data.searchStaysNearby.totalElements,
    totalPages: data.searchStaysNearby.totalPages,
    number: data.searchStaysNearby.number,
    size: data.searchStaysNearby.size,
    first: data.searchStaysNearby.first,
    last: data.searchStaysNearby.last,
    empty: data.searchStaysNearby.empty,
  }
}

// StayType endpoints
export async function getAllStayTypes(name?: string): Promise<StayType[]> {
  const { data } = await apolloClient.query<{ getAllStayTypes: Array<{ id: string; name: string }> }>({
    query: GET_ALL_STAY_TYPES_QUERY,
    variables: { name },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch stay types')

  return data.getAllStayTypes.map(type => ({
    id: parseInt(type.id),
    name: type.name,
  }))
}

export async function getStayTypeById(id: number): Promise<StayType> {
  const { data } = await apolloClient.query<{ getStayTypeById: { id: string; name: string } | null }>({
    query: GET_STAY_TYPE_BY_ID_QUERY,
    variables: { id: id.toString() },
    fetchPolicy: 'network-only',
  })

  if (!data?.getStayTypeById) throw new Error('Stay type not found')

  return {
    id: parseInt(data.getStayTypeById.id),
    name: data.getStayTypeById.name,
  }
}

// Service endpoints
export async function getAllServices(name?: string): Promise<Service[]> {
  const { data } = await apolloClient.query<{
    getAllServices: Array<{ id: string; name: string; icon?: string }>
  }>({
    query: GET_ALL_SERVICES_QUERY,
    variables: { name },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch services')

  return data.getAllServices.map(service => ({
    id: parseInt(service.id),
    name: service.name,
    icon: service.icon,
  }))
}

export async function getServiceById(id: number): Promise<Service> {
  const { data } = await apolloClient.query<{
    getServiceById: { id: string; name: string; icon?: string } | null
  }>({
    query: GET_SERVICE_BY_ID_QUERY,
    variables: { id: id.toString() },
    fetchPolicy: 'network-only',
  })

  if (!data?.getServiceById) throw new Error('Service not found')

  return {
    id: parseInt(data.getServiceById.id),
    name: data.getServiceById.name,
    icon: data.getServiceById.icon,
  }
}

// StayUnit endpoints
export async function getStayUnitById(id: number): Promise<StayUnit> {
  const { data } = await apolloClient.query<{
    getStayUnitById: {
      id: string
      stayNumber: string
      numberOfBeds: number
      capacity: number
      pricePerNight: number
      roomType: string
    } | null
  }>({
    query: GET_STAY_UNIT_BY_ID_QUERY,
    variables: { id: id.toString() },
    fetchPolicy: 'network-only',
  })

  if (!data?.getStayUnitById) throw new Error('Stay unit not found')

  return {
    id: parseInt(data.getStayUnitById.id),
    stayNumber: data.getStayUnitById.stayNumber,
    numberOfBeds: data.getStayUnitById.numberOfBeds,
    capacity: data.getStayUnitById.capacity,
    pricePerNight: data.getStayUnitById.pricePerNight,
    roomType: data.getStayUnitById.roomType,
  }
}

export async function getStayUnitsByStayId(stayId: number): Promise<StayUnit[]> {
  const { data } = await apolloClient.query<{
    getStayUnitsByStayId: Array<{
      id: string
      stayNumber: string
      numberOfBeds: number
      capacity: number
      pricePerNight: number
      roomType: string
    }>
  }>({
    query: GET_STAY_UNITS_BY_STAY_ID_QUERY,
    variables: { stayId: stayId.toString() },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch stay units')

  return data.getStayUnitsByStayId.map(unit => ({
    id: parseInt(unit.id),
    stayNumber: unit.stayNumber,
    numberOfBeds: unit.numberOfBeds,
    capacity: unit.capacity,
    pricePerNight: unit.pricePerNight,
    roomType: unit.roomType,
  }))
}

export async function searchAvailableUnits(stayId: number, minCapacity: number, maxPrice: number): Promise<StayUnit[]> {
  const { data } = await apolloClient.query<{
    searchAvailableUnits: Array<{
      id: string
      stayNumber: string
      numberOfBeds: number
      capacity: number
      pricePerNight: number
      roomType: string
    }>
  }>({
    query: SEARCH_AVAILABLE_UNITS_QUERY,
    variables: {
      stayId: stayId.toString(),
      minCapacity,
      maxPrice,
    },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to search available units')

  return data.searchAvailableUnits.map(unit => ({
    id: parseInt(unit.id),
    stayNumber: unit.stayNumber,
    numberOfBeds: unit.numberOfBeds,
    capacity: unit.capacity,
    pricePerNight: unit.pricePerNight,
    roomType: unit.roomType,
  }))
}
