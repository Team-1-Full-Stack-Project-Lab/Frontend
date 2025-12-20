import { gql } from '@apollo/client'
import { apolloClient } from '@/config/apolloClient'
import type {
  ChatRequest,
  ChatResponseGraphQL,
  ConversationMessageGraphQL,
  Chat,
  Message
} from '@/types'
import { chatFromGraphQL, messageFromGraphQL } from '@/mappers'

const CHAT_WITH_AGENT_MUTATION = gql`
  mutation ChatWithAgent($message: String!, $sessionId: String) {
    chatWithAgent(message: $message, sessionId: $sessionId) {
      response
      sessionId
      hotels {
        id
        name
        address
        latitude
        longitude
        imageUrl
      }
    }
  }
`

const GET_SESSION_HISTORY_QUERY = gql`
  query GetSessionHistory($sessionId: String!) {
    getSessionHistory(sessionId: $sessionId) {
      role
      content
      timestamp
    }
  }
`

export async function chatWithAgent(data: ChatRequest): Promise<Chat> {
  const { data: responseData } = await apolloClient.mutate<{
    chatWithAgent: ChatResponseGraphQL
  }>({
    mutation: CHAT_WITH_AGENT_MUTATION,
    variables: {
      message: data.message,
      sessionId: data.sessionId
    },
  })

  if (!responseData) throw new Error('Failed to chat with agent')

  return chatFromGraphQL(responseData.chatWithAgent)
}

export async function getSessionHistory(
  sessionId: string
): Promise<Message[]> {
  const { data } = await apolloClient.query<{
    getSessionHistory: ConversationMessageGraphQL[]
  }>({
    query: GET_SESSION_HISTORY_QUERY,
    variables: { sessionId },
    fetchPolicy: 'network-only',
  })

  if (!data) throw new Error('Failed to fetch session history')

  return data.getSessionHistory.map(messageFromGraphQL)
}