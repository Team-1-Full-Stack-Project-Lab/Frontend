import { gql } from '@apollo/client'
import { apolloClient } from '@/config/apolloClient'
import type { UserGraphQL, User } from '@/types'
import { userFromGraphQL } from '@/mappers'

const GET_USER_QUERY = gql`
  query GetUser {
    getUser {
      email
      firstName
      lastName
    }
  }
`

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($request: UserUpdateRequest!) {
    updateUser(request: $request) {
      email
      firstName
      lastName
    }
  }
`

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser {
    deleteUser {
      _empty
    }
  }
`

export async function getUserProfile(): Promise<User> {
  const { data } = await apolloClient.query<{ getUser: UserGraphQL }>({
    query: GET_USER_QUERY,
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch user profile')

  return userFromGraphQL(data.getUser)
}

export async function updateUserProfile(userData: Partial<User>): Promise<User> {
  const { data } = await apolloClient.mutate<{ updateUser: UserGraphQL }>({
    mutation: UPDATE_USER_MUTATION,
    variables: {
      request: {
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    },
  })

  if (!data) throw new Error('Failed to update user profile')

  return userFromGraphQL(data.updateUser)
}

export async function deleteUserAccount(): Promise<void> {
  const { data } = await apolloClient.mutate<{
    deleteUser: { _empty?: string }
  }>({
    mutation: DELETE_USER_MUTATION,
  })

  if (!data?.deleteUser) {
    throw new Error('Failed to delete user account')
  }
}
