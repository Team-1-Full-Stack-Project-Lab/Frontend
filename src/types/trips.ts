import type { StayUnitGraphQL, StayUnitResponse } from './stays'
import type { CityResponse, CountryResponse } from './location'

export interface Trip {
  id: number
  name: string
  cityId: number
  destination: string
  startDate: string
  endDate: string
}

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
  city?: CityResponse
  country?: CountryResponse
  startDate: string
  endDate: string
}

export type TripsResponse = TripResponse[]

export interface DeleteTripResponse {
  success: boolean
  message: string
}

export interface TripGraphQL {
  id: string
  name: string
  city: {
    id: string
    name: string
    country: {
      name: string
    }
  }
  country: {
    name: string
  }
  startDate: string
  endDate: string
}

export interface TripStayUnit {
  trip: TripResponse
  stayUnit: StayUnitResponse
  startDate: string
  endDate: string
}

export interface TripStayUnitsResponse {
  tripStayUnits: TripStayUnit[]
}

export interface AddStayUnitRequest {
  stayUnitId: number
  startDate: string
  endDate: string
}

export interface TripStayUnitGraphQL {
  trip: TripGraphQL | null
  stayUnit: StayUnitGraphQL | null
  startDate: string
  endDate: string
}

export interface TripStayUnitsListGraphQL {
  tripStayUnits: TripStayUnitGraphQL[]
}
