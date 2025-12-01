export interface User {
  email: string
  firstName: string
  lastName: string
  fullName: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}
