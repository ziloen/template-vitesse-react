import { createRoot } from 'react-dom/client'
import App from './App'

import './styles/tailwind.css'

import './styles/main.css'

createRoot(document.querySelector('#root')!).render(<App />)
