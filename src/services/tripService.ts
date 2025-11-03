import type { Trip } from '@/shared/types'
import { getToken } from './authService'
import { handleResponse } from '@/shared/helpers'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export interface CreateTripRequest {
  name?: string
  cityId?: number
  startDate?: string
  endDate?: string
}

export interface UpdateTripRequest {
  name?: string
  cityId?: number
  startDate?: string
  endDate?: string
}

export interface TripResponse {
  id: number
  name: string
  cityId: number
  cityName: string
  countryName: string
  startDate: string
  finishDate: string
}

export interface TripsResponse {
  trips: TripResponse[]
}

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
