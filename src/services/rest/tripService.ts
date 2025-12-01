import type {
  CreateTripRequest,
  UpdateTripRequest,
  AddStayUnitRequest,
  TripResponse,
  TripsResponse,
  TripStayUnitResponse,
  Trip,
  TripStayUnit,
} from '@/types'
import { tripFromResponse, tripStayUnitFromResponse } from '@/mappers'
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
  return result.map(tripFromResponse)
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
  return tripFromResponse(result)
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
  return tripFromResponse(result)
}

export async function deleteTrip(id: number): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/trips/itineraries/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(`Failed to delete trip: ${res.statusText}`)
  }
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

  const result = await handleResponse<TripStayUnitResponse[]>(res)
  return result.map(tripStayUnitFromResponse)
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

  const result = await handleResponse<TripStayUnitResponse>(res)
  return tripStayUnitFromResponse(result)
}

export async function removeStayUnitFromTrip(tripId: number, stayUnitId: number): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/trips/itineraries/${tripId}/stayunits/${stayUnitId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(`Failed to remove stay unit from trip: ${res.statusText}`)
  }
}
