import { BACKEND_URL } from '@/config/api'
import { getToken } from './authService'
import { handleResponse } from '@/utils/helpers'
import { companyFromResponse } from '@/mappers'
import type { Company, CompanyCreateRequest, CompanyResponse, CompanyUpdateRequest } from '@/types'

function withAuthHeaders() {
  const token = getToken()
  if (!token) throw new Error('No token found')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export async function getCompanyById(id: number): Promise<Company> {
  const res = await fetch(`${BACKEND_URL}/companies/${id}`, {
    method: 'GET',
    headers: withAuthHeaders(),
    credentials: 'include',
  })

  const result = await handleResponse<CompanyResponse>(res)
  return companyFromResponse(result)
}

export async function createCompany(payload: CompanyCreateRequest): Promise<Company> {
  const res = await fetch(`${BACKEND_URL}/companies`, {
    method: 'POST',
    headers: withAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const result = await handleResponse<CompanyResponse>(res)
  return companyFromResponse(result)
}

export async function updateCompany(id: number, payload: CompanyUpdateRequest): Promise<Company> {
  const res = await fetch(`${BACKEND_URL}/companies/${id}`, {
    method: 'PUT',
    headers: withAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const result = await handleResponse<CompanyResponse>(res)
  return companyFromResponse(result)
}

export async function deleteCompany(id: number): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/companies/${id}`, {
    method: 'DELETE',
    headers: withAuthHeaders(),
    credentials: 'include',
  })

  if (!res.ok) {
    await handleResponse(res)
  }
}
