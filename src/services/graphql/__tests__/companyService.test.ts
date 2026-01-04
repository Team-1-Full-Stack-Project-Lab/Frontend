import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getCompanyById, createCompany, updateCompany, deleteCompany } from '../companyService'
import { apolloClient } from '@/config/apolloClient'
import type { CompanyCreateRequest, CompanyUpdateRequest, CompanyGraphQL } from '@/types'

vi.mock('@/config/apolloClient', () => ({
  apolloClient: {
    query: vi.fn(),
    mutate: vi.fn(),
  },
}))
vi.mock('@/mappers', () => ({
  companyFromGraphQL: vi.fn(company => ({
    id: company.id,
    name: company.name,
    email: company.email,
    phone: company.phone,
    description: company.description,
  })),
}))

describe('GraphQL companyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCompanyById', () => {
    it('should fetch company by id successfully', async () => {
      const mockCompany: CompanyGraphQL = {
        id: '1',
        userId: '1',
        name: 'Test Company',
        email: 'company@test.com',
        phone: '+1234567890',
        description: 'Test description',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: { getCompanyById: mockCompany },
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      const result = await getCompanyById(1)

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.anything(),
        variables: { id: '1' },
        fetchPolicy: 'network-only',
      })

      expect(result.name).toBe('Test Company')
    })

    it('should throw error when company not found', async () => {
      vi.mocked(apolloClient.query).mockResolvedValueOnce({
        data: { getCompanyById: null },
      } as Awaited<ReturnType<typeof apolloClient.query>>)

      await expect(getCompanyById(1)).rejects.toThrow('Company not found')
    })
  })

  describe('createCompany', () => {
    it('should create company successfully', async () => {
      const request: CompanyCreateRequest = {
        name: 'New Company',
        email: 'new@company.com',
        phone: '+9876543210',
        description: 'A new company',
      }

      const mockResponse: CompanyGraphQL = {
        id: '2',
        userId: '1',
        name: 'New Company',
        email: 'new@company.com',
        phone: '+9876543210',
        description: 'A new company',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { createCompany: mockResponse },
      })

      const result = await createCompany(request)

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.anything(),
        variables: { request },
      })

      expect(result.name).toBe('New Company')
    })

    it('should throw error when creation fails', async () => {
      const request: CompanyCreateRequest = {
        name: 'New Company',
        email: 'new@company.com',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { createCompany: null },
      })

      await expect(createCompany(request)).rejects.toThrow('Failed to create company')
    })
  })

  describe('updateCompany', () => {
    it('should update company successfully', async () => {
      const request: CompanyUpdateRequest = {
        name: 'Updated Company',
      }

      const mockResponse: CompanyGraphQL = {
        id: '1',
        userId: '1',
        name: 'Updated Company',
        email: 'company@test.com',
        phone: '+1234567890',
        description: 'Test description',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { updateCompany: mockResponse },
      })

      const result = await updateCompany(1, request)

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.anything(),
        variables: {
          id: '1',
          request,
        },
      })

      expect(result.name).toBe('Updated Company')
    })

    it('should throw error when update fails', async () => {
      const request: CompanyUpdateRequest = {
        name: 'Updated Company',
      }

      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { updateCompany: null },
      })

      await expect(updateCompany(1, request)).rejects.toThrow('Failed to update company')
    })
  })

  describe('deleteCompany', () => {
    it('should delete company successfully', async () => {
      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { deleteCompany: { _empty: '' } },
      })

      await deleteCompany(1)

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.anything(),
        variables: { id: '1' },
      })
    })

    it('should throw error when deletion fails', async () => {
      vi.mocked(apolloClient.mutate).mockResolvedValueOnce({
        data: { deleteCompany: null },
      })

      await expect(deleteCompany(1)).rejects.toThrow('Failed to delete company')
    })
  })
})
