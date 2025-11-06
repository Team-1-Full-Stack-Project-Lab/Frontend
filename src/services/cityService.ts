import type { City, Country, State } from '@/types/location'
import { getToken } from './authService'
import { handleResponse } from '@/utils/helpers'
import { BACKEND_URL } from '@/config/api'

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

export interface CitiesResponse {
  content: CityResponse[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
  }
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  numberOfElements: number
}

export interface GetCitiesParams {
  name?: string
  country?: number
  state?: number
  featured?: boolean
  page?: number
  size?: number
}

export async function getCities(params?: GetCitiesParams): Promise<City[]> {
  const searchParams = new URLSearchParams()

  if (params) {
    if (params.name) searchParams.append('name', params.name)
    if (params.country) searchParams.append('country', params.country.toString())
    if (params.state) searchParams.append('state', params.state.toString())
    if (params.featured !== undefined) searchParams.append('featured', params.featured.toString())
    if (params.page !== undefined) searchParams.append('page', params.page.toString())
    if (params.size !== undefined) searchParams.append('size', params.size.toString())
  }

  const res = await fetch(`${BACKEND_URL}/cities${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: 'include',
  })

  const result = await handleResponse<CitiesResponse>(res)

  return result.content
}
