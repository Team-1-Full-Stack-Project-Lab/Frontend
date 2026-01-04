import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getCompanyById, createCompany, updateCompany, deleteCompany } from '../companyService'
import type { CompanyCreateRequest, CompanyUpdateRequest, CompanyResponse } from '@/types'

vi.mock('../authService', () => ({
  getToken: vi.fn(() => 'fake-token-123'),
}))
vi.mock('@/config/api', () => ({
  BACKEND_URL: 'http://localhost:8080',
}))
vi.mock('@/utils/helpers', () => ({
  handleResponse: vi.fn(res => res.json()),
}))
vi.mock('@/mappers', () => ({
  companyFromResponse: vi.fn(dto => ({
    id: dto.id,
    name: dto.name,
    phone: dto.phone,
    email: dto.email,
  })),
}))

describe('companyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn()
  })

  describe('getCompanyById', () => {
    it('should fetch company by id successfully', async () => {
      const mockResponse: CompanyResponse = {
        id: 1,
        userId: 1,
        name: 'Test Company',
        phone: '+1234567890',
        email: 'company@test.com',
        description: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getCompanyById(1)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/companies/1',
        expect.objectContaining({
          method: 'GET',
          headers: {
            Authorization: 'Bearer fake-token-123',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
      )

      expect(result).toMatchObject({
        id: 1,
        name: 'Test Company',
      })
    })

    it('should throw error when no token is found', async () => {
      const { getToken } = await import('../authService')
      vi.mocked(getToken).mockReturnValueOnce(undefined)

      await expect(getCompanyById(1)).rejects.toThrow('No token found')
    })
  })

  describe('createCompany', () => {
    it('should create a new company successfully', async () => {
      const createData: CompanyCreateRequest = {
        name: 'New Company',
        phone: '+9876543210',
        email: 'new@company.com',
        description: 'A new startup company',
      }

      const mockResponse: CompanyResponse = {
        id: 2,
        userId: 1,
        name: 'New Company',
        phone: '+9876543210',
        email: 'new@company.com',
        description: 'A new startup company',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await createCompany(createData)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/companies',
        expect.objectContaining({
          method: 'POST',
          headers: {
            Authorization: 'Bearer fake-token-123',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(createData),
        })
      )

      expect(result.id).toBe(2)
      expect(result.name).toBe('New Company')
    })

    it('should throw error when no token is found', async () => {
      const { getToken } = await import('../authService')
      vi.mocked(getToken).mockReturnValueOnce(undefined)

      await expect(
        createCompany({
          name: 'Test',
          phone: 'Test',
          email: 'test@test.com',
        })
      ).rejects.toThrow('No token found')
    })
  })

  describe('updateCompany', () => {
    it('should update company successfully', async () => {
      const updateData: CompanyUpdateRequest = {
        name: 'Updated Company Name',
        phone: '+1111111111',
      }

      const mockResponse: CompanyResponse = {
        id: 1,
        userId: 1,
        name: 'Updated Company Name',
        phone: '+1111111111',
        email: 'company@test.com',
        description: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z',
      }

      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await updateCompany(1, updateData)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/companies/1',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            Authorization: 'Bearer fake-token-123',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updateData),
        })
      )

      expect(result.name).toBe('Updated Company Name')
      expect(result.phone).toBe('+1111111111')
    })
  })

  describe('deleteCompany', () => {
    it('should delete company successfully', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response)

      await deleteCompany(1)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/companies/1',
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer fake-token-123',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
      )
    })

    it('should throw error when no token is found', async () => {
      const { getToken } = await import('../authService')
      vi.mocked(getToken).mockReturnValueOnce(undefined)

      await expect(deleteCompany(1)).rejects.toThrow('No token found')
    })
  })
})
