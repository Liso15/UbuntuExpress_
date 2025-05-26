
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx loading...')

try {
  const rootElement = document.getElementById("root")
  if (!rootElement) {
    console.error('Root element not found!')
    document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found in DOM</div>'
  } else {
    console.log('Root element found, creating React app...')
    const root = createRoot(rootElement)
    console.log('React root created, rendering App...')
    root.render(<App />)
    console.log('App rendered successfully')
  }
} catch (error) {
  console.error('Critical error in main.tsx:', error)
  document.body.innerHTML = `<div style="padding: 20px; color: red;">Critical Error: ${error instanceof Error ? error.message : 'Unknown error'}</div>`
}
