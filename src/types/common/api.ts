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

export interface Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface Pageable {
  pageNumber: number
  pageSize: number
  sort: Sort
  offset: number
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
}

export interface SearchPaginationParams extends PaginationParams {
  search?: string
}

export interface SearchNearbyParams extends PaginationParams {
  latitude: number
  longitude: number
  radiusKm?: number
}
