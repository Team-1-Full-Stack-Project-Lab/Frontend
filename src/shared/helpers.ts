import { ApiException } from './exceptions'
import type { ApiError } from './types'

export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const apiError = (await res.json()) as ApiError
    throw new ApiException(res.status, apiError)
  }
  return (await res.json()) as T
}
