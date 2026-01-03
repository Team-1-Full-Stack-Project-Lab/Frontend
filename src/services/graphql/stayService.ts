import { gql } from '@apollo/client'
import { apolloClient } from '@/config/apolloClient'
import type {
  Stay,
  StayUnit,
  StayType,
  Page,
  StayGraphQL,
  StayUnitGraphQL,
  PaginationParams,
  SearchNearbyParams,
  GetStaysParams,
  CreateStayRequest,
  CreateStayUnitRequest,
  UpdateStayRequest,
  UpdateStayUnitRequest,
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
    }
    company {
      id
      userId
      name
      email
      phone
      description
      createdAt
      updatedAt
    }
  }
`

const GET_ALL_STAYS_QUERY = gql`
  ${STAY_FRAGMENT}
  query GetAllStays(
    $companyId: ID
    $cityId: ID
    $serviceIds: [ID!]
    $minPrice: Float
    $maxPrice: Float
    $page: Int
    $size: Int
  ) {
    getAllStays(
      companyId: $companyId
      cityId: $cityId
      serviceIds: $serviceIds
      minPrice: $minPrice
      maxPrice: $maxPrice
      page: $page
      size: $size
    ) {
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
const GET_POPULAR_STAYS_QUERY = gql`
  query GetPopularStays {
    getPopularStays(limit: 6) {
      id
      name
      address
      description
      latitude
      longitude
      city {
        id
        name
        country {
          id
          name
        }
      }
      stayType {
        id
        name
      }
      images {
        id
        link
      }
      units {
        id
        stayNumber
        numberOfBeds
        capacity
        pricePerNight
        roomType
      }
      services {
        id
        name
        icon
      }
    }
  }
`
const CREATE_STAY_MUTATION = gql`
  ${STAY_FRAGMENT}
  mutation CreateStay($request: StayCreateRequest!) {
    createStay(request: $request) {
      ...StayFields
    }
  }
`

const UPDATE_STAY_MUTATION = gql`
  ${STAY_FRAGMENT}
  mutation UpdateStay($id: ID!, $request: StayUpdateRequest!) {
    updateStay(id: $id, request: $request) {
      ...StayFields
    }
  }
`

const DELETE_STAY_MUTATION = gql`
  mutation DeleteStay($id: ID!) {
    deleteStay(id: $id)
  }
`

const CREATE_STAY_UNIT_MUTATION = gql`
  mutation CreateStayUnit($request: StayUnitCreateRequest!) {
    createStayUnit(request: $request) {
      id
      stayNumber
      numberOfBeds
      capacity
      pricePerNight
      roomType
    }
  }
`

const UPDATE_STAY_UNIT_MUTATION = gql`
  mutation UpdateStayUnit($id: ID!, $request: StayUnitUpdateRequest!) {
    updateStayUnit(id: $id, request: $request) {
      id
      stayNumber
      numberOfBeds
      capacity
      pricePerNight
      roomType
    }
  }
`

const DELETE_STAY_UNIT_MUTATION = gql`
  mutation DeleteStayUnit($id: ID!) {
    deleteStayUnit(id: $id)
  }
`

export async function getAllStays(params?: GetStaysParams): Promise<Page<Stay>> {
  const { data } = await apolloClient.query<{ getAllStays: StayPageGraphQL }>({
    query: GET_ALL_STAYS_QUERY,
    variables: {
      companyId: params?.companyId?.toString(),
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

export async function createStay(request: CreateStayRequest, _token: string): Promise<Stay> {
  const { data } = await apolloClient.mutate<{ createStay: StayGraphQL }>({
    mutation: CREATE_STAY_MUTATION,
    variables: {
      request: {
        ...request,
        cityId: request.cityId.toString(),
        stayTypeId: request.stayTypeId.toString(),
        serviceIds: request.serviceIds?.map(id => id.toString()) || [],
      },
    },
  })

  if (!data?.createStay) throw new Error('Failed to create stay')
  return stayFromGraphQL(data.createStay, true)
}

export async function updateStay(id: number, request: UpdateStayRequest, _token: string): Promise<Stay> {
  const { data } = await apolloClient.mutate<{ updateStay: StayGraphQL }>({
    mutation: UPDATE_STAY_MUTATION,
    variables: {
      id: id.toString(),
      request: {
        ...request,
        cityId: request.cityId?.toString(),
        stayTypeId: request.stayTypeId?.toString(),
        serviceIds: request.serviceIds?.map(id => id.toString()),
      },
    },
  })

  if (!data?.updateStay) throw new Error('Failed to update stay')
  return stayFromGraphQL(data.updateStay, true)
}

export async function deleteStay(id: number, _token: string): Promise<void> {
  const { data } = await apolloClient.mutate<{ deleteStay: boolean }>({
    mutation: DELETE_STAY_MUTATION,
    variables: { id: id.toString() },
  })

  if (!data?.deleteStay) throw new Error('Failed to delete stay')
}

export async function createStayUnit(request: CreateStayUnitRequest, _token: string): Promise<StayUnit> {
  const { data } = await apolloClient.mutate<{ createStayUnit: StayUnitGraphQL }>({
    mutation: CREATE_STAY_UNIT_MUTATION,
    variables: {
      request: {
        ...request,
        stayId: request.stayId.toString(),
      },
    },
  })

  if (!data?.createStayUnit) throw new Error('Failed to create stay unit')
  return stayUnitFromGraphQL(data.createStayUnit, true)
}

export async function updateStayUnit(id: number, request: UpdateStayUnitRequest, _token: string): Promise<StayUnit> {
  const { data } = await apolloClient.mutate<{ updateStayUnit: StayUnitGraphQL }>({
    mutation: UPDATE_STAY_UNIT_MUTATION,
    variables: {
      id: id.toString(),
      request,
    },
  })

  if (!data?.updateStayUnit) throw new Error('Failed to update stay unit')
  return stayUnitFromGraphQL(data.updateStayUnit, true)
}

export async function deleteStayUnit(id: number, _token: string): Promise<void> {
  const { data } = await apolloClient.mutate<{ deleteStayUnit: boolean }>({
    mutation: DELETE_STAY_UNIT_MUTATION,
    variables: { id: id.toString() },
  })

  if (!data?.deleteStayUnit) throw new Error('Failed to delete stay unit')
}

export async function getPopularStays(): Promise<Stay[]> {
  const { data } = await apolloClient.query<{ getPopularStays: StayGraphQL[] }>({
    query: GET_POPULAR_STAYS_QUERY,
    fetchPolicy: 'network-only',
  })

  if (!data?.getPopularStays) throw new Error('Failed to fetch popular stays')

  return data.getPopularStays.map(dto => stayFromGraphQL(dto, true))
}
