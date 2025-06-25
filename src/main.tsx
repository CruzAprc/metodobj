import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 🧹 Limpar cache de dados antigos para garantir dados frescos do Supabase
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      if (cacheName.includes('api') || cacheName.includes('v1.0.0')) {
        console.log('🧹 Limpando cache antigo:', cacheName);
        caches.delete(cacheName);
      }
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
