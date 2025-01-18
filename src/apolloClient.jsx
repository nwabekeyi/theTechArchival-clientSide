import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Create HTTP link for standard queries and mutations
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',  // Your HTTP endpoint
});

// Initialize the Apollo Client
const client = new ApolloClient({
  link: httpLink,  // Use the HTTP link for all operations
  cache: new InMemoryCache(),  // Caching mechanism
});

export default client;
