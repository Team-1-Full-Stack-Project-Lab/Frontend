import Cookies from 'js-cookie'

const BACKEND_URL = "http://localhost:8080" //import.meta.env.VITE_BACKEND_URL
const TOKEN_COOKIE_NAME = 'token'

export interface UserProfile {
  id: number
  email: string
  firstName: string
  lastName: string
}
export interface UpdateUserProfile {
  email: string
  firstName: string
  lastName: string
}
export interface AuthResponse {
  token: string
}

export async function getCurrentUser() {
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
  if (!res.ok) throw new Error('Failed to fetch user profile')
  const result = (await res.json()) as UserProfile
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
  if (!res.ok) throw new Error('Failed to update user profile')
  const result = (await res.json()) as UserProfile
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

export function getToken() {
  return Cookies.get(TOKEN_COOKIE_NAME)
}
export function isAuthenticated() {
  return !!getToken()
}