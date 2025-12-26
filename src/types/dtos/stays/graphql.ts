import type { ServiceGraphQL } from '../services'
import type { CompanyGraphQL } from '../companies'

export interface StayTypeGraphQL {
  id: string
  name: string
}

export interface StayUnitGraphQL {
  id: string
  stayNumber: string
  numberOfBeds: number
  capacity: number
  pricePerNight: number
  roomType: string
  stay?: StayGraphQL
}

export interface StayImageGraphQL {
  id: string
  link: string
  stayId?: string
}

export interface StayGraphQL {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  description: string
  city?: {
    id: string
    name: string
    nameAscii: string
    latitude: number
    longitude: number
    timezone: string
    googlePlaceId?: string
    population: number
    isCapital: boolean
    isFeatured: boolean
    country?: {
      id: string
      name: string
      iso2Code: string
      iso3Code: string
      phoneCode?: string
      currencyCode?: string
      currencySymbol?: string
    }
    state?: {
      id: string
      name: string
      code: string
      latitude?: number
      longitude?: number
    }
  }
  stayType?: StayTypeGraphQL
  services?: ServiceGraphQL[]
  units?: StayUnitGraphQL[]
  images?: StayImageGraphQL[]
  company?: CompanyGraphQL
}
