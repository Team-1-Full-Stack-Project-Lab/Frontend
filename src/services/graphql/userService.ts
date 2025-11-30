import { gql } from '@apollo/client'
import { apolloClient } from '@/config/apolloClient'
import type { UserResponse, UpdateUserRequest } from '@/types'

export type UserProfile = UserResponse
export type UpdateUserProfile = UpdateUserRequest

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

export async function getUserProfile(): Promise<UserProfile> {
  const { data } = await apolloClient.query<{ getUser: UserProfile }>({
    query: GET_USER_QUERY,
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch user profile')

  return data.getUser
}

export async function updateUserProfile(userData: UpdateUserProfile): Promise<UserProfile> {
  const { data } = await apolloClient.mutate<{ updateUser: UserProfile }>({
    mutation: UPDATE_USER_MUTATION,
    variables: {
      request: {
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    },
  })

  if (!data) throw new Error('Failed to update user profile')

  return data.updateUser
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
