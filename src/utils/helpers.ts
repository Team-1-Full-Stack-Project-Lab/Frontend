import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ApiError } from '@/types'
import { ApiException } from './exceptions'

export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const apiError = (await res.json()) as ApiError
    throw new ApiException(res.status, apiError)
  }
  return (await res.json()) as T
}

export function toLocalDate(isoDateTime?: string): string | undefined {
  if (!isoDateTime) return undefined
  return isoDateTime.split('T')[0]
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
