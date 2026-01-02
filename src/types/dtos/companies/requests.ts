export interface CompanyCreateRequest {
  name: string
  email: string
  phone?: string | null
  description?: string | null
}

export interface CompanyUpdateRequest {
  name?: string | null
  email?: string | null
  phone?: string | null
  description?: string | null
}
