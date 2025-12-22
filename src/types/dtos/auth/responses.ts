import type { CompanyResponse } from '../companies'

export interface BaseUser {
  email: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  token: string
}

export interface DeleteUserResponse {
  success: boolean
  message: string
}

export interface AuthState {
  user: BaseUser | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

export type User = BaseUser

export type UserResponse = BaseUser & {
  company?: CompanyResponse | null
}
