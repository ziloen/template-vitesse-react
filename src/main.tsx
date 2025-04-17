import { createRoot } from 'react-dom/client'
import { scan } from 'react-scan'
import App from './App'

import './styles/tailwind.css'

import './styles/main.css'

if (import.meta.env.DEV) {
  scan({ enabled: true, animationSpeed: 'off' })
}

createRoot(document.querySelector('#root')!).render(<App />)
