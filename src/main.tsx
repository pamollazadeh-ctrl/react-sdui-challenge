import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/design-system/styles/index.css'
import { App } from './app/App'

/**
 * Starts the MSW worker before the first render so the form request is never
 * sent to a backend that does not exist yet. The mock code is imported lazily,
 * so it is left out of the bundle once mocking is disabled.
 */
async function enableMocking(): Promise<void> {
  if (import.meta.env.VITE_API_MOCKING !== 'enabled') return
  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  })
}

function mount(): void {
  const container = document.getElementById('root')
  if (!container) throw new Error('Root element "#root" is missing from index.html')
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// Render even if the worker fails to register: the form then shows its own error state.
void enableMocking().catch(console.error).then(mount)
