import type {
  Trip,
  CreateTripRequest,
  UpdateTripRequest,
  TripResponse,
  TripsResponse,
  TripStayUnit,
  TripStayUnitsResponse,
  AddStayUnitRequest,
} from '@/types'
import { getToken } from './authService'
import { handleResponse } from '@/utils/helpers'
import { BACKEND_URL } from '@/config/api'

export async function getTrips(): Promise<Trip[]> {
  const res = await fetch(`${BACKEND_URL}/trips/itineraries`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: 'include',
  })

  const result = await handleResponse<TripsResponse>(res)

  return result.trips.map(trip => ({
    id: trip.id,
    name: trip.name,
    cityId: trip.cityId,
    destination: `${trip.cityName}, ${trip.countryName}`,
    startDate: trip.startDate,
    endDate: trip.finishDate,
  }))
}

export async function createTrip(data: CreateTripRequest): Promise<Trip> {
  const res = await fetch(`${BACKEND_URL}/trips/itineraries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  const result = await handleResponse<TripResponse>(res)

  return {
    id: result.id,
    name: result.name,
    cityId: result.cityId,
    destination: `${result.cityName}, ${result.countryName}`,
    startDate: result.startDate,
    endDate: result.finishDate,
  }
}

export async function updateTrip(id: number, data: UpdateTripRequest): Promise<Trip> {
  const res = await fetch(`${BACKEND_URL}/trips/itineraries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  const result = await handleResponse<TripResponse>(res)

  return {
    id: result.id,
    name: result.name,
    cityId: result.cityId,
    destination: `${result.cityName}, ${result.countryName}`,
    startDate: result.startDate,
    endDate: result.finishDate,
  }
}

export async function deleteTrip(id: number): Promise<boolean> {
  const res = await fetch(`${BACKEND_URL}/trips/itineraries/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: 'include',
  })

  return res.ok
}

export async function getTripStayUnits(tripId: number): Promise<TripStayUnit[]> {
  const res = await fetch(`${BACKEND_URL}/trips/itineraries/${tripId}/stayunits`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: 'include',
  })

  const result = await handleResponse<TripStayUnitsResponse>(res)
  return result.tripStayUnits
}

export async function addStayUnitToTrip(tripId: number, data: AddStayUnitRequest): Promise<TripStayUnit> {
  const res = await fetch(`${BACKEND_URL}/trips/itineraries/${tripId}/stayunits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  return handleResponse<TripStayUnit>(res)
}

export async function removeStayUnitFromTrip(tripId: number, stayUnitId: number): Promise<boolean> {
  const res = await fetch(`${BACKEND_URL}/trips/itineraries/${tripId}/stayunits/${stayUnitId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: 'include',
  })

  return res.ok
}
