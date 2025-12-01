import type { PaginationParams } from '../../common'

export interface RegionResponse {
  id: number
  name: string
  code?: string
  countries?: CountryResponse[]
}

export interface CountryResponse {
  id: number
  name: string
  iso2Code: string
  iso3Code?: string
  phoneCode?: string
  currencyCode?: string
  currencySymbol?: string
  region?: RegionResponse
  states?: StateResponse[]
  cities?: CityResponse[]
}

export interface StateResponse {
  id: number
  name: string
  code?: string
  country?: CountryResponse
  latitude?: number
  longitude?: number
}

export interface CityResponse {
  id: number
  name: string
  nameAscii?: string
  country?: CountryResponse
  state?: StateResponse
  latitude: number
  longitude: number
  timezone?: string
  googlePlaceId?: string
  population?: number
  isCapital: boolean
  isFeatured: boolean
}

export interface GetCitiesParams extends PaginationParams {
  name?: string
  country?: number
  state?: number
  featured?: boolean
}
