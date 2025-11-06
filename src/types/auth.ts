export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
