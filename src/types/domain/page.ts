export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  isFirst: boolean
  isLast: boolean
  isEmpty: boolean
}
