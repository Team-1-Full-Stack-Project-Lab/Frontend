import { gql } from '@apollo/client'
import { apolloClient } from '@/config/apolloClient'
import type {
  CreateTripRequest,
  UpdateTripRequest,
  AddStayUnitRequest,
  TripGraphQL,
  TripStayUnitGraphQL,
  Trip,
  TripStayUnit,
} from '@/types'
import { tripFromGraphQL, tripStayUnitFromGraphQL, dateToLocalString } from '@/mappers'

const GET_TRIPS_QUERY = gql`
  query GetUserItineraries {
    getUserItineraries {
      id
      name
      city {
        id
        name
      }
      country {
        id
        name
      }
      startDate
      endDate
    }
  }
`

const CREATE_TRIP_MUTATION = gql`
  mutation CreateItinerary($request: CreateTripRequest!) {
    createItinerary(request: $request) {
      id
      name
      city {
        id
        name
        country {
          name
        }
      }
      country {
        name
      }
      startDate
      endDate
    }
  }
`

const UPDATE_TRIP_MUTATION = gql`
  mutation UpdateItinerary($id: ID!, $request: UpdateTripRequest!) {
    updateItinerary(id: $id, request: $request) {
      id
      name
      city {
        id
        name
        country {
          name
        }
      }
      country {
        name
      }
      startDate
      endDate
    }
  }
`

const DELETE_TRIP_MUTATION = gql`
  mutation DeleteItinerary($id: ID!) {
    deleteItinerary(id: $id) {
      _empty
    }
  }
`

const GET_TRIP_STAY_UNITS_QUERY = gql`
  query GetItineraryStayUnits($tripId: ID!) {
    getItineraryStayUnits(id: $tripId) {
      trip {
        id
        name
        city {
          id
          name
        }
        country {
          id
          name
        }
        startDate
        endDate
      }
      stayUnit {
        id
        stayNumber
        numberOfBeds
        capacity
        pricePerNight
        roomType
      }
      startDate
      endDate
    }
  }
`

const ADD_STAY_UNIT_TO_TRIP_MUTATION = gql`
  mutation AddStayUnitToItinerary($tripId: ID!, $request: AddStayUnitToTripRequest!) {
    addStayUnitToItinerary(id: $tripId, request: $request) {
      trip {
        id
        name
        city {
          id
          name
          country {
            name
          }
        }
        country {
          name
        }
        startDate
        endDate
      }
      stayUnit {
        id
        stayNumber
        numberOfBeds
        capacity
        pricePerNight
        roomType
      }
      startDate
      endDate
    }
  }
`

const REMOVE_STAY_UNIT_FROM_TRIP_MUTATION = gql`
  mutation RemoveStayUnitFromItinerary($tripId: ID!, $stayUnitId: ID!) {
    removeStayUnitFromItinerary(tripId: $tripId, stayUnitId: $stayUnitId) {
      _empty
    }
  }
`

export async function getTrips(): Promise<Trip[]> {
  const { data } = await apolloClient.query<{
    getUserItineraries: TripGraphQL[]
  }>({
    query: GET_TRIPS_QUERY,
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch trips')

  return data.getUserItineraries.map(tripFromGraphQL)
}

export async function createTrip(request: CreateTripRequest): Promise<Trip> {
  const requestData = {
    ...request,
    startDate: request.startDate ? dateToLocalString(new Date(request.startDate)) : undefined,
    endDate: request.endDate ? dateToLocalString(new Date(request.endDate)) : undefined,
  }

  const { data: result } = await apolloClient.mutate<{
    createItinerary: TripGraphQL
  }>({
    mutation: CREATE_TRIP_MUTATION,
    variables: { request: requestData },
  })

  if (!result) throw new Error('Failed to create trip')

  return tripFromGraphQL(result.createItinerary)
}

export async function updateTrip(id: number, request: UpdateTripRequest): Promise<Trip> {
  const requestData = {
    ...request,
    startDate: request.startDate ? dateToLocalString(new Date(request.startDate)) : undefined,
    endDate: request.endDate ? dateToLocalString(new Date(request.endDate)) : undefined,
  }

  const { data: result } = await apolloClient.mutate<{
    updateItinerary: TripGraphQL
  }>({
    mutation: UPDATE_TRIP_MUTATION,
    variables: {
      id: id.toString(),
      request: requestData,
    },
  })

  if (!result) throw new Error('Failed to update trip')

  return tripFromGraphQL(result.updateItinerary)
}

export async function deleteTrip(id: number): Promise<void> {
  await apolloClient.mutate<{
    deleteItinerary: { _empty?: string }
  }>({
    mutation: DELETE_TRIP_MUTATION,
    variables: { id: id.toString() },
  })

  return
}

export async function getTripStayUnits(tripId: number): Promise<TripStayUnit[]> {
  const { data } = await apolloClient.query<{
    getItineraryStayUnits: TripStayUnitGraphQL[]
  }>({
    query: GET_TRIP_STAY_UNITS_QUERY,
    variables: { tripId: tripId.toString() },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch trip stay units')

  return data.getItineraryStayUnits.map(tripStayUnitFromGraphQL).filter((tsu): tsu is TripStayUnit => tsu !== null)
}

export async function addStayUnitToTrip(tripId: number, request: AddStayUnitRequest): Promise<TripStayUnit> {
  const requestData = {
    stayUnitId: request.stayUnitId.toString(),
    startDate: dateToLocalString(new Date(request.startDate)),
    endDate: dateToLocalString(new Date(request.endDate)),
  }

  const { data: result } = await apolloClient.mutate<{
    addStayUnitToItinerary: TripStayUnitGraphQL
  }>({
    mutation: ADD_STAY_UNIT_TO_TRIP_MUTATION,
    variables: {
      tripId: tripId.toString(),
      request: requestData,
    },
  })

  if (!result) throw new Error('Failed to add stay unit to trip')

  const tsu = tripStayUnitFromGraphQL(result.addStayUnitToItinerary)
  if (!tsu) {
    throw new Error('Invalid response: missing trip or stayUnit data')
  }

  return tsu
}

export async function removeStayUnitFromTrip(tripId: number, stayUnitId: number): Promise<void> {
  await apolloClient.mutate<{
    removeStayUnitFromItinerary: { _empty?: string }
  }>({
    mutation: REMOVE_STAY_UNIT_FROM_TRIP_MUTATION,
    variables: {
      tripId: tripId.toString(),
      stayUnitId: stayUnitId.toString(),
    },
  })

  return
}
