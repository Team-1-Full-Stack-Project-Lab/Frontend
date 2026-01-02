import type { City, Country } from './location'
import type { StayUnit } from './stay'

export interface Trip {
  id: number
  name: string
  city?: City
  country?: Country
  startDate: Date
  endDate: Date
  destination: string
  durationDays: number
}

export interface TripStayUnit {
  trip: Trip
  stayUnit: StayUnit
  startDate: Date
  endDate: Date
  durationDays: number
}
