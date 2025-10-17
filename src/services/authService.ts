import Cookies from 'js-cookie'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const TOKEN_COOKIE_NAME = 'token'
const TOKEN_EXPIRY_DAYS = 7

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  firstName: string
  lastName: string
  password: string
}

export interface AuthResponse {
  token: string
}

export interface UserResponse {
  id: number
  email: string
  firstName: string
  lastName: string
}

export async function login(data: LoginRequest) {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  if (!res.ok) throw new Error('Invalid credentials')

  const result = (await res.json()) as AuthResponse

  Cookies.set(TOKEN_COOKIE_NAME, result.token, {
    expires: TOKEN_EXPIRY_DAYS,
    secure: true,
    sameSite: 'strict',
  })

  return result
}

export async function register(data: RegisterRequest) {
  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error('Registration error')

  const result = (await res.json()) as AuthResponse

  Cookies.set(TOKEN_COOKIE_NAME, result.token, {
    expires: TOKEN_EXPIRY_DAYS,
    secure: true,
    sameSite: 'strict',
  })

  return result
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
    logout()
    throw new Error('Invalid token')
  }

  if (!res.ok) throw new Error('Failed to fetch user data')

  const result = (await res.json()) as UserResponse

  return result
}

export function logout() {
  Cookies.remove(TOKEN_COOKIE_NAME)
}

export function getToken() {
  return Cookies.get(TOKEN_COOKIE_NAME)
}

export function isAuthenticated() {
  return !!getToken()
}
