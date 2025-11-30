import type { StayResponse, StayTypeResponse, ServiceResponse, StayUnitResponse } from '@/types'
import type { PageResponse, PaginationParams } from '@/types/api'
import { handleResponse } from '@/utils/helpers'
import { BACKEND_URL } from '@/config/api'

export interface GetStaysParams extends PaginationParams {
  cityId?: number
}

export interface SearchNearbyParams extends PaginationParams {
  latitude: number
  longitude: number
  radiusKm?: number
}

export async function getAllStays(params?: PaginationParams): Promise<PageResponse<StayResponse>> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) searchParams.append('page', params.page.toString())
  if (params?.size !== undefined) searchParams.append('size', params.size.toString())

  const res = await fetch(`${BACKEND_URL}/stays?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<PageResponse<StayResponse>>(res)
}

export async function getStayById(id: number): Promise<StayResponse> {
  const res = await fetch(`${BACKEND_URL}/stays/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<StayResponse>(res)
}

export async function getStaysByCity(cityId: number, params?: PaginationParams): Promise<PageResponse<StayResponse>> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) searchParams.append('page', params.page.toString())
  if (params?.size !== undefined) searchParams.append('size', params.size.toString())

  const res = await fetch(`${BACKEND_URL}/stays/city/${cityId}?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<PageResponse<StayResponse>>(res)
}

export async function searchStaysNearby(params: SearchNearbyParams): Promise<PageResponse<StayResponse>> {
  const searchParams = new URLSearchParams()
  searchParams.append('latitude', params.latitude.toString())
  searchParams.append('longitude', params.longitude.toString())
  if (params.radiusKm !== undefined) searchParams.append('radiusKm', params.radiusKm.toString())
  if (params.page !== undefined) searchParams.append('page', params.page.toString())
  if (params.size !== undefined) searchParams.append('size', params.size.toString())

  const res = await fetch(`${BACKEND_URL}/stays/nearby?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<PageResponse<StayResponse>>(res)
}

// StayType endpoints
export async function getAllStayTypes(name?: string): Promise<StayTypeResponse[]> {
  const searchParams = new URLSearchParams()
  if (name) searchParams.append('name', name)

  const res = await fetch(`${BACKEND_URL}/stay-types?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<StayTypeResponse[]>(res)
}

export async function getStayTypeById(id: number): Promise<StayTypeResponse> {
  const res = await fetch(`${BACKEND_URL}/stay-types/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<StayTypeResponse>(res)
}

// Service endpoints
export async function getAllServices(name?: string): Promise<ServiceResponse[]> {
  const searchParams = new URLSearchParams()
  if (name) searchParams.append('name', name)

  const res = await fetch(`${BACKEND_URL}/services?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<ServiceResponse[]>(res)
}

export async function getServiceById(id: number): Promise<ServiceResponse> {
  const res = await fetch(`${BACKEND_URL}/services/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<ServiceResponse>(res)
}

// StayUnit endpoints
export async function getStayUnitById(id: number): Promise<StayUnitResponse> {
  const res = await fetch(`${BACKEND_URL}/stay-units/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<StayUnitResponse>(res)
}

export async function getStayUnitsByStayId(stayId: number): Promise<StayUnitResponse[]> {
  const res = await fetch(`${BACKEND_URL}/stay-units/stay/${stayId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<StayUnitResponse[]>(res)
}

export async function searchAvailableUnits(
  stayId: number,
  minCapacity: number,
  maxPrice: number
): Promise<StayUnitResponse[]> {
  const searchParams = new URLSearchParams()
  searchParams.append('stayId', stayId.toString())
  searchParams.append('minCapacity', minCapacity.toString())
  searchParams.append('maxPrice', maxPrice.toString())

  const res = await fetch(`${BACKEND_URL}/stay-units/search?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<StayUnitResponse[]>(res)
}
