import type { ApiError } from './types'

export class ApiException extends Error {
  status: number
  apiError: ApiError

  constructor(status: number, apiError: ApiError, message?: string) {
    super(message || apiError.message)
    this.status = status
    this.apiError = apiError
    this.name = 'ApiException'
  }
}
