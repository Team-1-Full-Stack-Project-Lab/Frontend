import { BACKEND_URL } from '@/config/api'
import { getToken } from './authService'
import { handleResponse } from '@/utils/helpers'
import type { UserResponse, UpdateUserRequest } from '@/types'

export type UserProfile = UserResponse
export type UpdateUserProfile = UpdateUserRequest

export async function getUserProfile() {
  const token = getToken()
  if (!token) throw new Error('No token found')
  const res = await fetch(`${BACKEND_URL}/user/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  })
  if (res.status === 401 || res.status === 403) {
    throw new Error('Invalid or expired token')
  }
  const result = await handleResponse<UserProfile>(res)
  return result
}

export async function updateUserProfile(data: UpdateUserProfile) {
  const token = getToken()
  if (!token) throw new Error('No token found')
  const res = await fetch(`${BACKEND_URL}/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (res.status === 401 || res.status === 403) {
    throw new Error('Invalid or expired token')
  }
  const result = await handleResponse<UserProfile>(res)
  return result
}

export async function deleteUserAccount() {
  const token = getToken()
  if (!token) throw new Error('No token found')
  const res = await fetch(`${BACKEND_URL}/user/profile`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  })
  if (res.status === 401 || res.status === 403) {
    throw new Error('Invalid or expired token')
  }
  if (!res.ok) throw new Error('Failed to delete user account')
  return
}
