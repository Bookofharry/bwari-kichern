import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './Context/StoreContext'
// Load Speed Insights only on the client to avoid any server-side evaluation

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </BrowserRouter>,
)
// Register service worker only in the browser environment
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => console.log('Service worker registered:', reg.scope))
        .catch((err) => console.log('Service worker registration failed:', err));
    });
  } catch (err) {
    // Defensive: some build/runtime environments may evaluate this file; guard against crashes
    console.warn('Service worker registration skipped (not supported):', err);
  }
}
// Dynamically import and mount Speed Insights in the browser only
if (typeof window !== 'undefined') {
  import('@vercel/speed-insights/react')
    .then(({ SpeedInsights }) => {
      try {
        const el = document.createElement('div');
        document.body.appendChild(el);
        ReactDOM.createRoot(el).render(<SpeedInsights />);
      } catch (err) {
        // If rendering fails, swallow the error — non-critical
        console.warn('SpeedInsights mount failed:', err);
      }
    })
    .catch(() => {
      /* ignore dynamic import failures */
    });
}
