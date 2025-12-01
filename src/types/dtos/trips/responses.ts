import type { CityResponse, CountryResponse } from '../locations'
import type { StayUnitResponse } from '../stays'

export interface Trip {
  id: number
  name: string
  cityId: number
  destination: string
  startDate: string
  endDate: string
}

export interface TripResponse {
  id: number
  name: string
  city?: CityResponse
  country?: CountryResponse
  startDate: string
  endDate: string
}

export type TripsResponse = TripResponse[]

export interface TripStayUnitResponse {
  trip: TripResponse
  stayUnit: StayUnitResponse
  startDate: string
  endDate: string
}

export type TripStayUnitsResponse = TripStayUnitResponse[]
