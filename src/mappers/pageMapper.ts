import type { Page } from '@/types/domain'
import type { PageResponse } from '@/types'

export function pageFromResponse<TDto, TDomain>(
  dto: PageResponse<TDto>,
  mapper: (item: TDto) => TDomain
): Page<TDomain> {
  return {
    content: dto.content.map(mapper),
    totalElements: dto.totalElements,
    totalPages: dto.totalPages,
    currentPage: dto.number,
    pageSize: dto.size,
    isFirst: dto.first,
    isLast: dto.last,
    isEmpty: dto.empty,
  }
}
