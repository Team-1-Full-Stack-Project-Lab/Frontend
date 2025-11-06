export interface ValidationError {
  [field: string]: string[]
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  errors?: ValidationError
  path: string
}
