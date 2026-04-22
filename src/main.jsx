import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/NextGen.css'
import './styles/NextGenAdmin.css'
import './styles/GlobalEnhancements.css'
import './styles/Responsive.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
