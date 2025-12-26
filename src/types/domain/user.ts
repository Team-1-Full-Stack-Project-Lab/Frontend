import type { Company } from './company'

export interface User {
  email: string
  firstName: string
  lastName: string
  fullName: string
  company?: Company | null
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}
