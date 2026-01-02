export interface CompanyResponse {
  id: number
  userId: number
  name: string
  email: string
  phone?: string | null
  description?: string | null
  createdAt: string
  updatedAt: string
}
