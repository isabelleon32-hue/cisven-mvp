import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CisvenProvider } from './context/CisvenContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CisvenProvider>
      <App />
    </CisvenProvider>
  </StrictMode>,
)
