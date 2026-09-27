import { advancedNodes, advancedState } from '@/visual-engine/core/timeline'
import { SpatialNetwork } from '@/visual-engine/three/SpatialNetwork'
import type { SceneRatio } from '@/renderer/scene'
import './advanced.css'

export function AdvancedSmokeStage({
  timeMs,
  ratio,
  reduced = false,
}: {
  timeMs: number
  ratio: SceneRatio
  reduced?: boolean
}) {
  const state = advancedState(timeMs)
  return (
    <div className={`advanced-stage advanced-stage--${ratio.replace(':', '-')}`} data-render-stage>
      <SpatialNetwork className="advanced-stage__spatial" timeMs={state.time} reduced={reduced} />
      <div className="advanced-stage__top">
        <span>BALAXYS / BUSINESS IN MOTION</span>
        <span>EXPERIMENTO / 08.0 S</span>
      </div>
      <div className="advanced-stage__headline">
        <span className="micro-label">01 / CAUSA Y CONSECUENCIA</span>
        <strong>
          UNA OPERACIÓN
          <br />
          <em>SE PROPAGA.</em>
        </strong>
        <p>Una transacción. Cuatro áreas conectadas.</p>
      </div>
      <div className="advanced-stage__nodes">
        {advancedNodes.map((node, index) => (
          <div key={node.id} className={index <= state.activeIndex ? 'is-active' : ''}>
            <span className="mono">
              0{index + 1} / {node.label}
            </span>
            <b>{index <= state.activeIndex ? '●' : '○'}</b>
          </div>
        ))}
      </div>
      <div className="advanced-stage__footer">
        <span>SECUENCIA CONCEPTUAL · DATOS DE DEMOSTRACIÓN · VALIDAR CAPACIDADES CON PRODUCTO</span>
        <span>{(state.time / 1000).toFixed(1)} / 8.0 S</span>
      </div>
    </div>
  )
}
