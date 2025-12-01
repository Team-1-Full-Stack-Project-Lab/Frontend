import type { City } from './location'

export interface StayType {
  id: number
  name: string
}

export interface Service {
  id: number
  name: string
  icon?: string
}

export interface StayImage {
  id: number
  link: string
  stayId?: number
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
  description: string
  city?: City
  stayType?: StayType
  services: Service[]
  units: StayUnit[]
  images: StayImage[]
}
