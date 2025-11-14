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
  pageable: Pageable
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: Sort
  first: boolean
  numberOfElements: number
  empty: boolean
}

export interface SimplePage<T> {
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
