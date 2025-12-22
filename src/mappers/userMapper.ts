import type { User } from '@/types/domain'
import type { UserResponse, UserGraphQL } from '@/types/dtos/auth'
import { companyFromGraphQL, companyFromResponse } from './companyMapper'

export function userFromResponse(dto: UserResponse): User {
  return {
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    fullName: `${dto.firstName} ${dto.lastName}`,
    company: dto.company ? companyFromResponse(dto.company) : null,
  }
}

export function userFromGraphQL(dto: UserGraphQL): User {
  return {
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    fullName: `${dto.firstName} ${dto.lastName}`,
    company: dto.company ? companyFromGraphQL(dto.company) : null,
  }
}

export function userToUpdateRequest(user: User) {
  return {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  }
}
