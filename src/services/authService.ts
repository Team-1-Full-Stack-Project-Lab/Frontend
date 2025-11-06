import { BACKEND_URL, TOKEN_COOKIE_NAME, TOKEN_EXPIRY_DAYS } from '@/config/api'
import { handleResponse } from '@/utils/helpers'
import Cookies from 'js-cookie'
import { getUserProfile } from './userService'

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

export async function login(data: LoginRequest) {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  const result = await handleResponse<AuthResponse>(res)

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

  const result = await handleResponse<AuthResponse>(res)

  Cookies.set(TOKEN_COOKIE_NAME, result.token, {
    expires: TOKEN_EXPIRY_DAYS,
    secure: true,
    sameSite: 'strict',
  })

  return result
}

export async function getCurrentUser() {
  return getUserProfile()
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
