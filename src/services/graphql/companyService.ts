import { gql } from '@apollo/client'
import { apolloClient } from '@/config/apolloClient'
import { companyFromGraphQL } from '@/mappers'
import type { Company, CompanyCreateRequest, CompanyGraphQL, CompanyUpdateRequest } from '@/types'

const COMPANY_FRAGMENT = gql`
  fragment CompanyFields on Company {
    id
    userId
    name
    email
    phone
    description
    createdAt
    updatedAt
  }
`

const GET_COMPANY_QUERY = gql`
  ${COMPANY_FRAGMENT}
  query GetCompany($id: ID!) {
    getCompanyById(id: $id) {
      ...CompanyFields
    }
  }
`

const CREATE_COMPANY_MUTATION = gql`
  ${COMPANY_FRAGMENT}
  mutation CreateCompany($request: CompanyCreateRequest!) {
    createCompany(request: $request) {
      ...CompanyFields
    }
  }
`

const UPDATE_COMPANY_MUTATION = gql`
  ${COMPANY_FRAGMENT}
  mutation UpdateCompany($id: ID!, $request: CompanyUpdateRequest!) {
    updateCompany(id: $id, request: $request) {
      ...CompanyFields
    }
  }
`

const DELETE_COMPANY_MUTATION = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      _empty
    }
  }
`

export async function getCompanyById(id: number): Promise<Company> {
  const { data } = await apolloClient.query<{ getCompanyById: CompanyGraphQL | null }>({
    query: GET_COMPANY_QUERY,
    variables: { id: id.toString() },
    fetchPolicy: 'network-only',
  })

  if (!data?.getCompanyById) {
    throw new Error('Company not found')
  }

  return companyFromGraphQL(data.getCompanyById)
}

export async function createCompany(payload: CompanyCreateRequest): Promise<Company> {
  const { data } = await apolloClient.mutate<{ createCompany: CompanyGraphQL }>({
    mutation: CREATE_COMPANY_MUTATION,
    variables: { request: payload },
  })

  if (!data?.createCompany) {
    throw new Error('Failed to create company')
  }

  return companyFromGraphQL(data.createCompany)
}

export async function updateCompany(id: number, payload: CompanyUpdateRequest): Promise<Company> {
  const { data } = await apolloClient.mutate<{ updateCompany: CompanyGraphQL }>({
    mutation: UPDATE_COMPANY_MUTATION,
    variables: { id: id.toString(), request: payload },
  })

  if (!data?.updateCompany) {
    throw new Error('Failed to update company')
  }

  return companyFromGraphQL(data.updateCompany)
}

export async function deleteCompany(id: number): Promise<void> {
  const { data } = await apolloClient.mutate<{ deleteCompany: { _empty?: string } }>({
    mutation: DELETE_COMPANY_MUTATION,
    variables: { id: id.toString() },
  })

  if (!data?.deleteCompany) {
    throw new Error('Failed to delete company')
  }
}
