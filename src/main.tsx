import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('🚀 Iniciando aplicação ClinicaOS...')

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('❌ Elemento root não encontrado!')
} else {
  console.log('✅ Elemento root encontrado, renderizando app...')
}

ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
