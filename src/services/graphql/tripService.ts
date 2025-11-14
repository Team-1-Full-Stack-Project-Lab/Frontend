import { gql } from '@apollo/client'
import { apolloClient } from '@/config/apolloClient'
import type {
  Trip,
  CreateTripRequest,
  UpdateTripRequest,
  TripGraphQL as TripGQL,
  TripStayUnit,
  TripStayUnitGraphQL,
  TripStayUnitsListGraphQL,
  AddStayUnitRequest,
} from '@/types'
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

const GET_TRIP_STAY_UNITS_QUERY = gql`
  query GetItineraryStayUnits($tripId: ID!) {
    getItineraryStayUnits(tripId: $tripId) {
      tripStayUnits {
        trip {
          id
          name
          cityId
          cityName
          countryName
          startDate
          finishDate
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
  }
`

const ADD_STAY_UNIT_TO_TRIP_MUTATION = gql`
  mutation AddStayUnitToItinerary($tripId: ID!, $stayUnitId: ID!, $startDate: Date!, $endDate: Date!) {
    addStayUnitToItinerary(tripId: $tripId, stayUnitId: $stayUnitId, startDate: $startDate, endDate: $endDate) {
      trip {
        id
        name
        cityId
        cityName
        countryName
        startDate
        finishDate
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

export async function getTripStayUnits(tripId: number): Promise<TripStayUnit[]> {
  const { data } = await apolloClient.query<{
    getItineraryStayUnits: TripStayUnitsListGraphQL
  }>({
    query: GET_TRIP_STAY_UNITS_QUERY,
    variables: { tripId: tripId.toString() },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch trip stay units')

  return data.getItineraryStayUnits.tripStayUnits
    .filter(tsu => tsu.trip && tsu.stayUnit)
    .map(tsu => ({
      trip: {
        id: parseInt(tsu.trip!.id),
        name: tsu.trip!.name,
        cityId: parseInt(tsu.trip!.cityId),
        cityName: tsu.trip!.cityName,
        countryName: tsu.trip!.countryName,
        startDate: tsu.trip!.startDate,
        finishDate: tsu.trip!.finishDate,
      },
      stayUnit: {
        id: parseInt(tsu.stayUnit!.id),
        stayNumber: tsu.stayUnit!.stayNumber,
        numberOfBeds: tsu.stayUnit!.numberOfBeds,
        capacity: tsu.stayUnit!.capacity,
        pricePerNight: tsu.stayUnit!.pricePerNight,
        roomType: tsu.stayUnit!.roomType,
      },
      startDate: tsu.startDate,
      endDate: tsu.endDate,
    }))
}

export async function addStayUnitToTrip(tripId: number, data: AddStayUnitRequest): Promise<TripStayUnit> {
  const { data: result } = await apolloClient.mutate<{
    addStayUnitToItinerary: TripStayUnitGraphQL
  }>({
    mutation: ADD_STAY_UNIT_TO_TRIP_MUTATION,
    variables: {
      tripId: tripId.toString(),
      stayUnitId: data.stayUnitId.toString(),
      startDate: toLocalDate(data.startDate),
      endDate: toLocalDate(data.endDate),
    },
  })

  if (!result) throw new Error('Failed to add stay unit to trip')

  const tsu = result.addStayUnitToItinerary
  if (!tsu.trip || !tsu.stayUnit) {
    throw new Error('Invalid response: missing trip or stayUnit data')
  }

  return {
    trip: {
      id: parseInt(tsu.trip.id),
      name: tsu.trip.name,
      cityId: parseInt(tsu.trip.cityId),
      cityName: tsu.trip.cityName,
      countryName: tsu.trip.countryName,
      startDate: tsu.trip.startDate,
      finishDate: tsu.trip.finishDate,
    },
    stayUnit: {
      id: parseInt(tsu.stayUnit.id),
      stayNumber: tsu.stayUnit.stayNumber,
      numberOfBeds: tsu.stayUnit.numberOfBeds,
      capacity: tsu.stayUnit.capacity,
      pricePerNight: tsu.stayUnit.pricePerNight,
      roomType: tsu.stayUnit.roomType,
    },
    startDate: tsu.startDate,
    endDate: tsu.endDate,
  }
}

export async function removeStayUnitFromTrip(tripId: number, stayUnitId: number): Promise<boolean> {
  const { data } = await apolloClient.mutate<{
    removeStayUnitFromItinerary: { success: boolean; message: string }
  }>({
    mutation: REMOVE_STAY_UNIT_FROM_TRIP_MUTATION,
    variables: {
      tripId: tripId.toString(),
      stayUnitId: stayUnitId.toString(),
    },
  })

  return data?.removeStayUnitFromItinerary.success || false
}
