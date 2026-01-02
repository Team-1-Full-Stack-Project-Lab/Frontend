import { gql } from '@apollo/client'
import { apolloClient } from '@/config/apolloClient'
import type { Service, ServiceGraphQL } from '@/types'
import { serviceFromGraphQL } from '@/mappers'

const GET_ALL_SERVICES_QUERY = gql`
  query GetAllServices($name: String) {
    getAllServices(name: $name) {
      id
      name
      icon
    }
  }
`

const GET_SERVICE_BY_ID_QUERY = gql`
  query GetServiceById($id: ID!) {
    getServiceById(id: $id) {
      id
      name
      icon
    }
  }
`

export async function getAllServices(name?: string): Promise<Service[]> {
  const { data } = await apolloClient.query<{
    getAllServices: Array<ServiceGraphQL>
  }>({
    query: GET_ALL_SERVICES_QUERY,
    variables: { name },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch services')

  return data.getAllServices.map(serviceFromGraphQL)
}

export async function getServiceById(id: number): Promise<Service> {
  const { data } = await apolloClient.query<{
    getServiceById: ServiceGraphQL | null
  }>({
    query: GET_SERVICE_BY_ID_QUERY,
    variables: { id: id.toString() },
    fetchPolicy: 'network-only',
  })

  if (!data?.getServiceById) throw new Error('Service not found')

  return serviceFromGraphQL(data.getServiceById)
}
