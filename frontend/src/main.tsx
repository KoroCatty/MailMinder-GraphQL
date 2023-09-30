import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Apollo Client (アプリ全体で useQuery を使えるようにする)
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';

// Apollo で header に tokenと Authorization を付与できるようにする setContext
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: 'http://localhost:5001'
  // uri: '/graphql'
});

// get the authentication token from local storage if it exists
const authLink = setContext((_, {headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      // token があれば header に追加
      Authorization: localStorage.getItem("token_GraphQL") ||  "" 
    }
  }
})


const client = new ApolloClient({
  // uri: 'http://localhost:5001',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)
