import type { Company, CompanyGraphQL, CompanyResponse } from '@/types'

export function companyFromResponse(dto: CompanyResponse): Company {
  return {
    id: dto.id,
    userId: dto.userId,
    name: dto.name,
    email: dto.email,
    phone: dto.phone ?? null,
    description: dto.description ?? null,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }
}

export function companyFromGraphQL(dto: CompanyGraphQL): Company {
  return {
    id: Number(dto.id),
    userId: Number(dto.userId),
    name: dto.name,
    email: dto.email,
    phone: dto.phone ?? null,
    description: dto.description ?? null,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }
}
