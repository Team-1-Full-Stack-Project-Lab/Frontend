import type { CityResponse, CitiesResponse, GetCitiesParams } from '@/types'
import { getToken } from './authService'
import { handleResponse } from '@/utils/helpers'
import { BACKEND_URL } from '@/config/api'

export async function getCities(params?: GetCitiesParams): Promise<CityResponse[]> {
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

export async function getCityById(id: number): Promise<CityResponse> {
  const res = await fetch(`${BACKEND_URL}/cities/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: 'include',
  })

  return handleResponse<CityResponse>(res)
}
