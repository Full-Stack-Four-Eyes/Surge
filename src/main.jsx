import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.jsx'
import { DarkModeProvider } from './hooks/useDarkMode.jsx'
import App from './App'
import './index.css'

// Check if root element exists
const rootElement = document.getElementById('app')
if (!rootElement) {
  console.error('Root element with id "app" not found!')
  throw new Error('Root element not found')
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <DarkModeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </DarkModeProvider>
      </BrowserRouter>
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Error rendering app:', error)
  rootElement.innerHTML = `
    <div style="padding: 2rem; text-align: center;">
      <h1>Error Loading App</h1>
      <p>Check the browser console for details.</p>
      <pre style="text-align: left; background: #f5f5f5; padding: 1rem; margin-top: 1rem; border-radius: 0.5rem;">${error.message}</pre>
    </div>
  `
}

