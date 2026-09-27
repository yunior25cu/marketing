import { lazy, Suspense } from 'react'
import { Home } from './Home'
import '@/primitives/primitives.css'

const Lab = lazy(() => import('./Lab').then((module) => ({ default: module.Lab })))
const LaunchCampaign = lazy(() =>
  import('@/campaigns/launch-01/LaunchCampaign').then((module) => ({
    default: module.LaunchCampaign,
  })),
)
const CampaignConsole = lazy(() =>
  import('./CampaignConsole').then((module) => ({ default: module.CampaignConsole })),
)
const AdvancedCampaign = lazy(() =>
  import('@/campaigns/visual-engine-smoke-test/AdvancedCampaign').then((module) => ({
    default: module.AdvancedCampaign,
  })),
)
const ContinuousMotionCampaign = lazy(() =>
  import('@/campaigns/continuous-motion-smoke-test/ContinuousMotionCampaign').then((module) => ({
    default: module.ContinuousMotionCampaign,
  })),
)
const FacturacionCampaign = lazy(() =>
  import('@/campaigns/facturacion-electronica-uy-01/FacturacionCampaign').then((module) => ({
    default: module.FacturacionCampaign,
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
      {path === '/lab' ? (
        <Lab />
      ) : path.startsWith('/lab/campaigns/') ? (
        <main className="lab shell">
          <header className="lab__header">
            <a className="wordmark" href="/">
              BALAXYS<span>✳</span>
            </a>
            <a className="micro-label" href="/lab">
              ← VOLVER AL LAB
            </a>
          </header>
          <CampaignConsole initialId={path.split('/').at(-1)} />
        </main>
      ) : path === '/campaigns/launch-01' ? (
        <LaunchCampaign />
      ) : path === '/campaigns/visual-engine-smoke-test' ? (
        <AdvancedCampaign />
      ) : path === '/campaigns/continuous-motion-smoke-test' ? (
        <ContinuousMotionCampaign />
      ) : path === '/campaigns/facturacion-electronica-uy-01' ? (
        <FacturacionCampaign />
      ) : (
        <Home />
      )}
    </Suspense>
  )
}
