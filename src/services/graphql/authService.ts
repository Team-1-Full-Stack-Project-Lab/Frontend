import { gql } from '@apollo/client'
import { apolloClient } from '@/config/apolloClient'
import { TOKEN_COOKIE_NAME, TOKEN_EXPIRY_DAYS } from '@/config/api'
import Cookies from 'js-cookie'
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types'

const LOGIN_MUTATION = gql`
  mutation Login($request: LoginRequest!) {
    login(request: $request) {
      token
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation Register($request: RegisterRequest!) {
    register(request: $request) {
      token
    }
  }
`

const GET_USER_QUERY = gql`
  query GetUser {
    getUser {
      email
      firstName
      lastName
    }
  }
`

export async function login(data: LoginRequest) {
  const { data: result } = await apolloClient.mutate<{ login: AuthResponse }>({
    mutation: LOGIN_MUTATION,
    variables: { request: data },
  })

  if (!result) throw new Error('Login failed')

  Cookies.set(TOKEN_COOKIE_NAME, result.login.token, {
    expires: TOKEN_EXPIRY_DAYS,
    secure: true,
    sameSite: 'strict',
  })

  return result.login
}

export async function register(data: RegisterRequest) {
  const { data: result } = await apolloClient.mutate<{ register: AuthResponse }>({
    mutation: REGISTER_MUTATION,
    variables: { request: data },
  })

  if (!result) throw new Error('Registration failed')

  Cookies.set(TOKEN_COOKIE_NAME, result.register.token, {
    expires: TOKEN_EXPIRY_DAYS,
    secure: true,
    sameSite: 'strict',
  })

  return result.register
}

export async function getCurrentUser() {
  const { data } = await apolloClient.query<{
    getUser: { email: string; firstName: string; lastName: string }
  }>({
    query: GET_USER_QUERY,
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch user profile')

  return { ...data.getUser, id: 0 }
}

export function logout() {
  Cookies.remove(TOKEN_COOKIE_NAME)
  apolloClient.clearStore()
}

export function getToken() {
  return Cookies.get(TOKEN_COOKIE_NAME)
}

export function isAuthenticated() {
  return !!getToken()
}
