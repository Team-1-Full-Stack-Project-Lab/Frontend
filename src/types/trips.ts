import type { StayUnitGraphQL } from './stays'

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
  cityId: number
  cityName: string
  countryName: string
  startDate: string
  finishDate: string
}

export interface TripsResponse {
  trips: TripResponse[]
}

export interface DeleteTripResponse {
  success: boolean
  message: string
}

export interface TripGraphQL {
  id: string
  name: string
  cityId: string
  cityName: string
  countryName: string
  startDate: string
  finishDate: string
}

export interface StayUnitSimple {
  id: number
  stayNumber: string
  numberOfBeds: number
  capacity: number
  pricePerNight: number
  roomType: string
}

export interface TripStayUnit {
  trip: TripResponse
  stayUnit: StayUnitSimple
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
