import type { Service } from '@/types'
import type { ServiceResponse } from '@/types/dtos/services'
import type { ServiceGraphQL } from '@/types/dtos/services'

export function serviceFromResponse(dto: ServiceResponse): Service {
  return {
    id: dto.id,
    name: dto.name,
    icon: dto.icon,
  }
}

export function serviceFromGraphQL(dto: ServiceGraphQL): Service {
  return {
    id: parseInt(dto.id),
    name: dto.name,
    icon: dto.icon,
  }
}
