import './styles/main.css'
import './styles/tailwind.css'

import { createRoot } from 'react-dom/client'
import App from './App'

// FIXME: If `createRoot` and `App` are in the same file, pages with a `loader` will execute `createRoot` twice.
createRoot(document.querySelector('#root')!).render(<App />)
