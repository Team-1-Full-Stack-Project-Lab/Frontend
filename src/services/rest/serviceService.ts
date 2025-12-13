import { BACKEND_URL } from '@/config/api'
import { serviceFromResponse } from '@/mappers'
import type { Service, ServiceResponse } from '@/types'
import { handleResponse } from '@/utils/helpers'

export async function getAllServices(name?: string): Promise<Service[]> {
  const searchParams = new URLSearchParams()
  if (name) searchParams.append('name', name)

  const res = await fetch(`${BACKEND_URL}/services?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await handleResponse<ServiceResponse[]>(res)
  return result.map(serviceFromResponse)
}

export async function getServiceById(id: number): Promise<Service> {
  const res = await fetch(`${BACKEND_URL}/services/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await handleResponse<ServiceResponse>(res)
  return serviceFromResponse(result)
}
