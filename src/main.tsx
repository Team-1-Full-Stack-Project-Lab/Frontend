import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store'
import { Toaster } from './components/ui/sonner.tsx'
import { apolloClient } from './config/apolloClient.ts'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <StrictMode>
      <ApolloProvider client={apolloClient}>
        <App />
        <Toaster position="top-right" />
      </ApolloProvider>
    </StrictMode>
  </Provider>
)
