import { gql } from '@apollo/client'
import { apolloClient } from '@/config/apolloClient'
import type { Trip, CreateTripRequest, UpdateTripRequest, TripGraphQL as TripGQL } from '@/types'
import { toLocalDate } from '@/utils/helpers'

const GET_TRIPS_QUERY = gql`
  query GetUserItineraries {
    getUserItineraries {
      trips {
        id
        name
        cityId
        cityName
        countryName
        startDate
        finishDate
      }
    }
  }
`

const CREATE_TRIP_MUTATION = gql`
  mutation CreateItinerary($request: CreateTripRequest!) {
    createItinerary(request: $request) {
      id
      name
      cityId
      cityName
      countryName
      startDate
      finishDate
    }
  }
`

const UPDATE_TRIP_MUTATION = gql`
  mutation UpdateItinerary($id: ID!, $request: UpdateTripRequest!) {
    updateItinerary(id: $id, request: $request) {
      id
      name
      cityId
      cityName
      countryName
      startDate
      finishDate
    }
  }
`

const DELETE_TRIP_MUTATION = gql`
  mutation DeleteItinerary($id: ID!) {
    deleteItinerary(id: $id) {
      success
      message
    }
  }
`

export async function getTrips(): Promise<Trip[]> {
  const { data } = await apolloClient.query<{
    getUserItineraries: { trips: TripGQL[] }
  }>({
    query: GET_TRIPS_QUERY,
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch trips')

  return data.getUserItineraries.trips.map(trip => ({
    id: parseInt(trip.id),
    name: trip.name,
    cityId: parseInt(trip.cityId),
    destination: `${trip.cityName}, ${trip.countryName}`,
    startDate: trip.startDate,
    endDate: trip.finishDate,
  }))
}

export async function createTrip(data: CreateTripRequest): Promise<Trip> {
  const request = {
    ...data,
    startDate: toLocalDate(data.startDate),
    endDate: toLocalDate(data.endDate),
  }

  const { data: result } = await apolloClient.mutate<{
    createItinerary: TripGQL
  }>({
    mutation: CREATE_TRIP_MUTATION,
    variables: { request },
  })

  if (!result) throw new Error('Failed to create trip')

  const trip = result.createItinerary
  return {
    id: parseInt(trip.id),
    name: trip.name,
    cityId: parseInt(trip.cityId),
    destination: `${trip.cityName}, ${trip.countryName}`,
    startDate: trip.startDate,
    endDate: trip.finishDate,
  }
}

export async function updateTrip(id: number, data: UpdateTripRequest): Promise<Trip> {
  const request = {
    ...data,
    startDate: toLocalDate(data.startDate),
    endDate: toLocalDate(data.endDate),
  }

  const { data: result } = await apolloClient.mutate<{
    updateItinerary: TripGQL
  }>({
    mutation: UPDATE_TRIP_MUTATION,
    variables: {
      id: id.toString(),
      request,
    },
  })

  if (!result) throw new Error('Failed to update trip')

  const trip = result.updateItinerary
  return {
    id: parseInt(trip.id),
    name: trip.name,
    cityId: parseInt(trip.cityId),
    destination: `${trip.cityName}, ${trip.countryName}`,
    startDate: trip.startDate,
    endDate: trip.finishDate,
  }
}

export async function deleteTrip(id: number): Promise<boolean> {
  const { data } = await apolloClient.mutate<{
    deleteItinerary: { success: boolean; message: string }
  }>({
    mutation: DELETE_TRIP_MUTATION,
    variables: { id: id.toString() },
  })

  return data?.deleteItinerary.success || false
}
