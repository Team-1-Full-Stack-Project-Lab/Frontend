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
  mutation UpdateUser($request: UserUpdateRequestGraphQL!) {
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
      success
      message
    }
  }
`

export async function getUserProfile(): Promise<UserProfile> {
  const { data } = await apolloClient.query<{ getUser: Omit<UserProfile, 'id'> }>({
    query: GET_USER_QUERY,
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch user profile')

  return { ...data.getUser, id: 0 }
}

export async function updateUserProfile(userData: UpdateUserProfile): Promise<UserProfile> {
  const { data } = await apolloClient.mutate<{ updateUser: Omit<UserProfile, 'id'> }>({
    mutation: UPDATE_USER_MUTATION,
    variables: {
      request: {
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    },
  })

  if (!data) throw new Error('Failed to update user profile')

  return { ...data.updateUser, id: 0 }
}

export async function deleteUserAccount(): Promise<void> {
  const { data } = await apolloClient.mutate<{
    deleteUser: { success: boolean; message: string }
  }>({
    mutation: DELETE_USER_MUTATION,
  })

  if (!data?.deleteUser.success) {
    throw new Error(data?.deleteUser.message || 'Failed to delete user account')
  }
}
