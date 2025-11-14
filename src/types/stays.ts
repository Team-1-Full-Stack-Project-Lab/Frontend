import type { CityResponse } from './location'

export interface StayType {
  id: number
  name: string
}

export interface Service {
  id: number
  name: string
  icon?: string
}

export interface StayUnit {
  id: number
  stayNumber: string
  numberOfBeds: number
  capacity: number
  pricePerNight: number
  roomType: string
  stay?: Stay
}

export interface Stay {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  city?: CityResponse
  stayType?: StayType
  services?: Service[]
  units?: StayUnit[]
}

export interface StayTypeGraphQL {
  id: string
  name: string
}

export interface ServiceGraphQL {
  id: string
  name: string
  icon?: string
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

export interface StayGraphQL {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
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
    country: {
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
}
