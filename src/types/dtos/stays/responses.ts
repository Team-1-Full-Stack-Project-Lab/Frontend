import type { CityResponse, ServiceResponse, PaginationParams } from '@/types'

export interface StayTypeResponse {
  id: number
  name: string
}

export interface StayUnitResponse {
  id: number
  stayNumber: string
  numberOfBeds: number
  capacity: number
  pricePerNight: number
  roomType: string
  stay?: StayResponse
}

export interface StayResponse {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  description: string
  city?: CityResponse
  stayType?: StayTypeResponse
  services?: ServiceResponse[]
  units?: StayUnitResponse[]
  images?: StayImageResponse[]
}

export interface StayImageResponse {
  id: number
  link: string
  stayId?: number
}

export interface GetStaysParams extends PaginationParams {
  cityId?: number
  serviceIds?: number[]
  minPrice?: number
  maxPrice?: number
}
