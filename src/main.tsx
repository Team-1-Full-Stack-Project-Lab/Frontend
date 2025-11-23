import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store'
import { Toaster } from './components/ui/sonner.tsx'
import { apolloClient } from './config/apolloClient.ts'
import { ThemeProvider } from './contexts/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="wanderlust-ui-theme">
        <ApolloProvider client={apolloClient}>
          <App />
          <Toaster position="top-right" />
        </ApolloProvider>
      </ThemeProvider>
    </StrictMode>
  </Provider>
)
