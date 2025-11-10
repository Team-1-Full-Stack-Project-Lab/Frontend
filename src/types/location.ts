import type { PageResponse, PaginationParams } from './api'

export interface Country {
  id: number
  name: string
  iso2Code: string
  iso3Code: string
  phoneCode: string
  currencyCode: string
  currencySymbol: string
}

export interface State {
  id: number
  name: string
  code: string
  latitude: number
  longitude: number
}

export interface City {
  id: number
  name: string
  nameAscii: string
  country?: Country
  state?: State
  latitude: number
  longitude: number
  timezone: string
  googlePlaceId?: string
  population: number
  isCapital: boolean
  isFeatured: boolean
}

export interface GetCitiesParams extends PaginationParams {
  name?: string
  country?: number
  state?: number
  featured?: boolean
}

export interface CityResponse {
  id: number
  name: string
  nameAscii: string
  country?: Country
  state?: State
  latitude: number
  longitude: number
  timezone: string
  googlePlaceId?: string
  population: number
  isCapital: boolean
  isFeatured: boolean
}

export type CitiesResponse = PageResponse<CityResponse>
