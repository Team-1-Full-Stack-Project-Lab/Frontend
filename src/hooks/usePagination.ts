import { useState, useMemo, useCallback, type MouseEvent } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  maxPagesToShow?: number
}

interface UsePaginationReturn {
  page: number
  setPage: (page: number | ((prev: number) => number)) => void
  totalPages: number
  setTotalPages: (pages: number) => void
  paginationRange: Array<number | 'ellipsis'>
  handlePageSelect: (targetPage: number) => void
  handlePrevious: (event: MouseEvent<HTMLAnchorElement>) => void
  handleNext: (event: MouseEvent<HTMLAnchorElement>) => void
  canGoPrevious: boolean
  canGoNext: boolean
  resetPage: () => void
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 0, maxPagesToShow = 5 } = options
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(0)

  const paginationRange = useMemo(() => {
    if (totalPages <= 1) return [] as Array<number | 'ellipsis'>
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, index) => index)
    }

    if (page <= 2) {
      return [0, 1, 2, 'ellipsis', totalPages - 1] as Array<number | 'ellipsis'>
    }

    if (page >= totalPages - 3) {
      return [0, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1] as Array<number | 'ellipsis'>
    }

    return [0, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages - 1] as Array<number | 'ellipsis'>
  }, [page, totalPages, maxPagesToShow])

  const canGoPrevious = page > 0
  const canGoNext = totalPages > 0 && page < totalPages - 1

  const handlePageSelect = useCallback(
    (targetPage: number) => {
      setPage(currentPage => {
        if (totalPages === 0) return currentPage
        if (targetPage === currentPage) return currentPage
        if (targetPage < 0 || targetPage >= totalPages) return currentPage
        return targetPage
      })
    },
    [totalPages]
  )

  const handlePrevious = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setPage(prev => Math.max(0, prev - 1))
  }, [])

  const handleNext = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setPage(prev => prev + 1)
  }, [])

  const resetPage = useCallback(() => {
    setPage(initialPage)
  }, [initialPage])

  return {
    page,
    setPage,
    totalPages,
    setTotalPages,
    paginationRange,
    handlePageSelect,
    handlePrevious,
    handleNext,
    canGoPrevious,
    canGoNext,
    resetPage,
  }
}
