export interface CompanyGraphQL {
  id: string
  userId: string
  name: string
  email: string
  phone?: string | null
  description?: string | null
  createdAt: string
  updatedAt: string
}
