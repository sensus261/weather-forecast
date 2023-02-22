import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import fetch from 'cross-fetch'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:3001/api',
  fetch,
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})
