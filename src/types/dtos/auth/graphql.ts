import type { CompanyGraphQL } from '../companies'

export interface UserGraphQL {
  email: string
  firstName: string
  lastName: string
  company?: CompanyGraphQL | null
}
