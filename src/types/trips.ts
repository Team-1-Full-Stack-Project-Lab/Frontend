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
