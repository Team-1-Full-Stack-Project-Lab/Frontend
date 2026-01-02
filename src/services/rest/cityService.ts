import type { City, Page, CityResponse, GetCitiesParams, PageResponse } from '@/types'
import { cityFromResponse, pageFromResponse } from '@/mappers'
import { getToken } from './authService'
import { handleResponse } from '@/utils/helpers'
import { BACKEND_URL } from '@/config/api'

export async function getCities(params?: GetCitiesParams): Promise<Page<City>> {
  const searchParams = new URLSearchParams()

  if (params) {
    if (params.name) searchParams.append('name', params.name)
    if (params.country) searchParams.append('country', params.country.toString())
    if (params.state) searchParams.append('state', params.state.toString())
    if (params.featured !== undefined) searchParams.append('featured', params.featured.toString())
    if (params.page !== undefined) searchParams.append('page', params.page.toString())
    if (params.size !== undefined) searchParams.append('size', params.size.toString())
  }

  const res = await fetch(`${BACKEND_URL}/api/cities${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: 'include',
  })

  const result = await handleResponse<PageResponse<CityResponse>>(res)
  return pageFromResponse(result, cityFromResponse)
}

export async function getCityById(id: number): Promise<City> {
  const res = await fetch(`${BACKEND_URL}/api/cities/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: 'include',
  })

  const result = await handleResponse<CityResponse>(res)
  return cityFromResponse(result)
}
