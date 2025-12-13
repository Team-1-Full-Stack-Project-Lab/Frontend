import { gql } from '@apollo/client'
import { apolloClient } from '@/config/apolloClient'
import type {
  Stay,
  StayUnit,
  StayType,
  Page,
  StayGraphQL,
  PaginationParams,
  SearchNearbyParams,
  GetStaysParams,
} from '@/types'
import { stayFromGraphQL, stayUnitFromGraphQL, stayTypeFromGraphQL, pageFromResponse } from '@/mappers'

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
    description
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
    images {
      id
      link
      stayId
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

export async function getAllStays(params?: GetStaysParams): Promise<Page<Stay>> {
  const { data } = await apolloClient.query<{ getAllStays: StayPageGraphQL }>({
    query: GET_ALL_STAYS_QUERY,
    variables: {
      cityId: params?.cityId?.toString(),
      serviceIds: params?.serviceIds?.map(id => id.toString()),
      minPrice: params?.minPrice,
      maxPrice: params?.maxPrice,
      page: params?.page,
      size: params?.size,
    },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch stays')

  return pageFromResponse(
    {
      content: data.getAllStays.content,
      totalElements: data.getAllStays.totalElements,
      totalPages: data.getAllStays.totalPages,
      number: data.getAllStays.number,
      size: data.getAllStays.size,
      first: data.getAllStays.first,
      last: data.getAllStays.last,
      empty: data.getAllStays.empty,
    },
    dto => stayFromGraphQL(dto, true)
  )
}

export async function getStayById(id: number): Promise<Stay> {
  const { data } = await apolloClient.query<{ getStayById: StayGraphQL | null }>({
    query: GET_STAY_BY_ID_QUERY,
    variables: { id: id.toString() },
    fetchPolicy: 'network-only',
  })

  if (!data?.getStayById) throw new Error('Stay not found')

  return stayFromGraphQL(data.getStayById)
}

export async function getStaysByCity(cityId: number, params?: PaginationParams): Promise<Page<Stay>> {
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

  return pageFromResponse(
    {
      content: data.getStaysByCity.content,
      totalElements: data.getStaysByCity.totalElements,
      totalPages: data.getStaysByCity.totalPages,
      number: data.getStaysByCity.number,
      size: data.getStaysByCity.size,
      first: data.getStaysByCity.first,
      last: data.getStaysByCity.last,
      empty: data.getStaysByCity.empty,
    },
    dto => stayFromGraphQL(dto, true)
  )
}

export async function searchStaysNearby(params: SearchNearbyParams): Promise<Page<Stay>> {
  const { data } = await apolloClient.query<{ searchStaysNearby: StayPageGraphQL }>({
    query: SEARCH_STAYS_NEARBY_QUERY,
    variables: {
      latitude: params.latitude,
      longitude: params.longitude,
      radius: params.radiusKm,
      page: params.page,
      size: params.size,
    },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to search nearby stays')

  return pageFromResponse(
    {
      content: data.searchStaysNearby.content,
      totalElements: data.searchStaysNearby.totalElements,
      totalPages: data.searchStaysNearby.totalPages,
      number: data.searchStaysNearby.number,
      size: data.searchStaysNearby.size,
      first: data.searchStaysNearby.first,
      last: data.searchStaysNearby.last,
      empty: data.searchStaysNearby.empty,
    },
    dto => stayFromGraphQL(dto, true)
  )
}

export async function getAllStayTypes(name?: string): Promise<StayType[]> {
  const { data } = await apolloClient.query<{ getAllStayTypes: Array<{ id: string; name: string }> }>({
    query: GET_ALL_STAY_TYPES_QUERY,
    variables: { name },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch stay types')

  return data.getAllStayTypes.map(stayTypeFromGraphQL)
}

export async function getStayTypeById(id: number): Promise<StayType> {
  const { data } = await apolloClient.query<{ getStayTypeById: { id: string; name: string } | null }>({
    query: GET_STAY_TYPE_BY_ID_QUERY,
    variables: { id: id.toString() },
    fetchPolicy: 'network-only',
  })

  if (!data?.getStayTypeById) throw new Error('Stay type not found')

  return stayTypeFromGraphQL(data.getStayTypeById)
}

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

  return stayUnitFromGraphQL(data.getStayUnitById, true)
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

  return data.getStayUnitsByStayId.map(u => stayUnitFromGraphQL(u, true))
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

  return data.searchAvailableUnits.map(u => stayUnitFromGraphQL(u, true))
}
