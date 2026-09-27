import { lazy, Suspense } from 'react'
import { Home } from './Home'
import '@/primitives/primitives.css'

const Lab = lazy(() => import('./Lab').then((module) => ({ default: module.Lab })))
const LaunchCampaign = lazy(() =>
  import('@/campaigns/launch-01/LaunchCampaign').then((module) => ({
    default: module.LaunchCampaign,
  })),
)

export function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  return (
    <Suspense
      fallback={
        <main className="shell" style={{ paddingBlock: '5rem' }}>
          Cargando sistema…
        </main>
      }
    >
      {path === '/lab' ? <Lab /> : path === '/campaigns/launch-01' ? <LaunchCampaign /> : <Home />}
    </Suspense>
  )
}
