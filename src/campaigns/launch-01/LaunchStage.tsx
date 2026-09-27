import { KineticText } from '@/primitives/KineticText'
import { SceneCanvas } from '@/renderer/SceneCanvas'
import type { SceneRatio } from '@/renderer/scene'
import { saleFlow } from '@/scenes/SaleFlow'
import { campaignPhase } from './definition'
import './campaign.css'

export function LaunchStage({ timeMs, ratio }: { timeMs: number; ratio: SceneRatio }) {
  const phase = campaignPhase(timeMs)
  return (
    <div
      className={`campaign-stage campaign-stage--${ratio.replace(':', '-')}`}
      data-render-stage
      aria-label="Campaña NO SON MÓDULOS de 10 segundos"
    >
      {phase === 'premise' && (
        <div className="campaign-stage__statement">
          <span className="eyebrow">BALAXYS / BUSINESS IN MOTION</span>
          <KineticText
            lines={['NO SON', 'MÓDULOS.']}
            accent={1}
            visibleCount={timeMs < 700 ? 1 : 2}
          />
          <span className="micro-label">01 / LA PREMISA</span>
        </div>
      )}
      {phase === 'event' && (
        <SceneCanvas scene={saleFlow} timeMs={timeMs - 1700} ratio={ratio} compact />
      )}
      {phase === 'resolution' && (
        <div className="campaign-stage__statement campaign-stage__statement--end">
          <span className="eyebrow">UNA OPERACIÓN / MÚLTIPLES CONSECUENCIAS</span>
          <KineticText
            lines={['ES UNA', 'EMPRESA', 'EN MOVIMIENTO.']}
            accent={2}
            visibleCount={timeMs < 8400 ? 1 : timeMs < 9100 ? 2 : 3}
          />
          <span className="campaign-stage__signature">
            BALAXYS <b>✳</b>
          </span>
        </div>
      )}
    </div>
  )
}
