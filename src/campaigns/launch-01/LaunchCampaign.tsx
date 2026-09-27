import { useState } from 'react'
import { formats, ratios } from '@/compositions/formats'
import { KineticText } from '@/primitives/KineticText'
import { SceneCanvas } from '@/renderer/SceneCanvas'
import type { SceneRatio } from '@/renderer/scene'
import { useTimeline } from '@/renderer/useTimeline'
import { saleFlow } from '@/scenes/SaleFlow'
import { campaignPhase, launch01 } from './definition'
import { seconds } from '@/utils/time'
import './campaign.css'

export function LaunchCampaign() {
  const [ratio, setRatio] = useState<SceneRatio>(() => {
    const query = new URLSearchParams(window.location.search).get('ratio')
    return ratios.includes(query as SceneRatio) ? (query as SceneRatio) : '16:9'
  })
  const initialTime = Number(new URLSearchParams(window.location.search).get('t') ?? 0)
  const timeline = useTimeline(
    launch01.duration,
    false,
    Number.isFinite(initialTime) ? initialTime : 0,
  )
  const phase = campaignPhase(timeline.time)
  return (
    <main className="campaign-page shell">
      <header className="campaign-page__header">
        <a href="/" className="wordmark">
          BALAXYS<span>✳</span>
        </a>
        <a className="micro-label" href="/lab">
          ← VOLVER AL LAB
        </a>
      </header>
      <div className="campaign-page__title">
        <div>
          <span className="eyebrow">CAMPAÑA / LANZAMIENTO 01</span>
          <h1>
            NO SON
            <br />
            <em>MÓDULOS.</em>
          </h1>
        </div>
        <p>
          Diez segundos para mostrar una idea: cada movimiento de una empresa produce el siguiente.
        </p>
      </div>
      <div className="campaign-page__toolbar">
        <div className="ratio-switch" role="group" aria-label="Formato de composición">
          {ratios.map((item) => (
            <button
              key={item}
              className={ratio === item ? 'is-active' : ''}
              onClick={() => setRatio(item)}
              aria-pressed={ratio === item}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="micro-label">
          {formats[ratio].width} × {formats[ratio].height} / COMPOSICIÓN ADAPTATIVA
        </span>
      </div>
      <div
        className={`campaign-stage campaign-stage--${ratio.replace(':', '-')}`}
        aria-label="Campaña NO SON MÓDULOS de 10 segundos"
      >
        {phase === 'premise' && (
          <div className="campaign-stage__statement">
            <span className="eyebrow">BALAXYS / BUSINESS IN MOTION</span>
            <KineticText lines={['NO SON', 'MÓDULOS.']} accent={1} />
            <span className="micro-label">01 / LA PREMISA</span>
          </div>
        )}
        {phase === 'event' && (
          <SceneCanvas scene={saleFlow} timeMs={timeline.time - 1700} ratio={ratio} compact />
        )}
        {phase === 'resolution' && (
          <div className="campaign-stage__statement campaign-stage__statement--end">
            <span className="eyebrow">UNA OPERACIÓN / MÚLTIPLES CONSECUENCIAS</span>
            <KineticText lines={['ES UNA', 'EMPRESA', 'EN MOVIMIENTO.']} accent={2} />
            <span className="campaign-stage__signature">
              BALAXYS <b>✳</b>
            </span>
          </div>
        )}
      </div>
      <div className="campaign-controls">
        <button
          className="button button--signal"
          onClick={
            timeline.playing
              ? timeline.pause
              : timeline.time >= launch01.duration
                ? timeline.replay
                : timeline.play
          }
          disabled={timeline.reduced}
        >
          {timeline.playing
            ? 'Pausar'
            : timeline.time >= launch01.duration
              ? 'Repetir'
              : 'Reproducir'}{' '}
          <span aria-hidden="true">{timeline.playing ? 'Ⅱ' : '↗'}</span>
        </button>
        <input
          type="range"
          min="0"
          max={launch01.duration}
          value={timeline.time}
          step="10"
          onChange={(e) => timeline.seek(Number(e.target.value))}
          aria-label="Posición de campaña"
        />
        <span className="timecode">
          {seconds(timeline.time)} / {seconds(launch01.duration)}
        </span>
      </div>
      <p className="campaign-disclosure">
        {timeline.reduced ? 'Movimiento reducido: se presenta el estado final. ' : ''}Los
        identificadores y estados son demostrativos. Confirmar las capacidades exactas del producto
        antes de publicar esta pieza como claim comercial.
      </p>
    </main>
  )
}
