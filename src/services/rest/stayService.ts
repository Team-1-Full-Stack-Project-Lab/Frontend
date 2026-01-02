import type {
  GetStaysParams,
  Stay,
  StayUnit,
  StayType,
  Page,
  StayResponse,
  StayTypeResponse,
  StayUnitResponse,
  PageResponse,
  PaginationParams,
  SearchNearbyParams,
  CreateStayRequest,
  CreateStayUnitRequest,
  UpdateStayRequest,
  UpdateStayUnitRequest,
} from '@/types'
import { stayFromResponse, stayUnitFromResponse, stayTypeFromResponse, pageFromResponse } from '@/mappers'
import { handleResponse } from '@/utils/helpers'
import { BACKEND_URL } from '@/config/api'

export async function getAllStays(params?: GetStaysParams): Promise<Page<Stay>> {
  const searchParams = new URLSearchParams()
  if (params?.cityId !== undefined) searchParams.append('cityId', params.cityId.toString())
  if (params?.serviceIds && params.serviceIds.length > 0) {
    params.serviceIds.forEach(id => searchParams.append('serviceIds', id.toString()))
  }
  if (params?.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString())
  if (params?.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString())
  if (params?.companyId !== undefined) searchParams.append('companyId', params.companyId.toString())
  if (params?.page !== undefined) searchParams.append('page', params.page.toString())
  if (params?.size !== undefined) searchParams.append('size', params.size.toString())

  const res = await fetch(`${BACKEND_URL}/api/stays?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await handleResponse<PageResponse<StayResponse>>(res)
  return pageFromResponse(result, dto => stayFromResponse(dto, true))
}

export async function getStayById(id: number): Promise<Stay> {
  const res = await fetch(`${BACKEND_URL}/api/stays/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await handleResponse<StayResponse>(res)
  return stayFromResponse(result)
}

export async function getStaysByCity(cityId: number, params?: PaginationParams): Promise<Page<Stay>> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) searchParams.append('page', params.page.toString())
  if (params?.size !== undefined) searchParams.append('size', params.size.toString())

  const res = await fetch(`${BACKEND_URL}/api/stays/city/${cityId}?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await handleResponse<PageResponse<StayResponse>>(res)
  return pageFromResponse(result, dto => stayFromResponse(dto, true))
}

export async function searchStaysNearby(params: SearchNearbyParams): Promise<Page<Stay>> {
  const searchParams = new URLSearchParams()
  searchParams.append('latitude', params.latitude.toString())
  searchParams.append('longitude', params.longitude.toString())
  if (params.radiusKm !== undefined) searchParams.append('radiusKm', params.radiusKm.toString())
  if (params.page !== undefined) searchParams.append('page', params.page.toString())
  if (params.size !== undefined) searchParams.append('size', params.size.toString())

  const res = await fetch(`${BACKEND_URL}/api/stays/nearby?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await handleResponse<PageResponse<StayResponse>>(res)
  return pageFromResponse(result, dto => stayFromResponse(dto, true))
}

export async function getAllStayTypes(name?: string): Promise<StayType[]> {
  const searchParams = new URLSearchParams()
  if (name) searchParams.append('name', name)

  const res = await fetch(`${BACKEND_URL}/api/stay-types?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await handleResponse<StayTypeResponse[]>(res)
  return result.map(stayTypeFromResponse)
}

export async function getStayTypeById(id: number): Promise<StayType> {
  const res = await fetch(`${BACKEND_URL}/api/stay-types/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await handleResponse<StayTypeResponse>(res)
  return stayTypeFromResponse(result)
}

export async function getStayUnitById(id: number): Promise<StayUnit> {
  const res = await fetch(`${BACKEND_URL}/api/stay-units/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await handleResponse<StayUnitResponse>(res)
  return stayUnitFromResponse(result, true)
}

export async function getStayUnitsByStayId(stayId: number): Promise<StayUnit[]> {
  const res = await fetch(`${BACKEND_URL}/api/stay-units/stay/${stayId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await handleResponse<StayUnitResponse[]>(res)
  return result.map(u => stayUnitFromResponse(u, true))
}

export async function searchAvailableUnits(stayId: number, minCapacity: number, maxPrice: number): Promise<StayUnit[]> {
  const searchParams = new URLSearchParams()
  searchParams.append('stayId', stayId.toString())
  searchParams.append('minCapacity', minCapacity.toString())
  searchParams.append('maxPrice', maxPrice.toString())

  const res = await fetch(`${BACKEND_URL}/api/stay-units/search?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await handleResponse<StayUnitResponse[]>(res)
  return result.map(u => stayUnitFromResponse(u, true))
}

export async function createStay(request: CreateStayRequest, token: string): Promise<Stay> {
  const res = await fetch(`${BACKEND_URL}/api/stays`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  const result = await handleResponse<StayResponse>(res)
  return stayFromResponse(result, true)
}

export async function createStayUnit(request: CreateStayUnitRequest, token: string): Promise<StayUnit> {
  const res = await fetch(`${BACKEND_URL}/api/stay-units`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  const result = await handleResponse<StayUnitResponse>(res)
  return stayUnitFromResponse(result, true)
}

export async function updateStay(id: number, request: UpdateStayRequest, token: string): Promise<Stay> {
  const res = await fetch(`${BACKEND_URL}/api/stays/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  const result = await handleResponse<StayResponse>(res)
  return stayFromResponse(result, true)
}

export async function deleteStay(id: number, token: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/stays/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    await handleResponse(res)
  }
}

export async function updateStayUnit(id: number, request: UpdateStayUnitRequest, token: string): Promise<StayUnit> {
  const res = await fetch(`${BACKEND_URL}/api/stay-units/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  const result = await handleResponse<StayUnitResponse>(res)
  return stayUnitFromResponse(result, true)
}

export async function deleteStayUnit(id: number, token: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/stay-units/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    await handleResponse(res)
  }
}
