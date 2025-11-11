import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import Cookies from 'js-cookie'
import { TOKEN_COOKIE_NAME, BACKEND_URL } from './api'

const httpLink = new HttpLink({
  uri: `${BACKEND_URL}/graphql`,
})

const authLink = new ApolloLink((operation, forward) => {
  const token = Cookies.get(TOKEN_COOKIE_NAME)

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  })

  return forward(operation)
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
