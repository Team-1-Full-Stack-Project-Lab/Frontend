export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
}

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

export interface UpdateUserRequest {
  email: string
  firstName: string
  lastName: string
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

export interface DeleteUserResponse {
  success: boolean
  message: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

export interface UserGraphQL {
  email: string
  firstName: string
  lastName: string
}
