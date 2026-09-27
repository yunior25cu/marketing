import { useEffect, useState } from 'react'
import { formats, ratios } from '@/compositions/formats'
import type { SceneRatio } from '@/renderer/scene'
import { useTimeline } from '@/renderer/useTimeline'
import { launch01 } from './definition'
import { LaunchStage } from './LaunchStage'
import { seconds } from '@/utils/time'
import './campaign.css'

declare global {
  interface Window {
    __BALAXYS_RENDER?: { seek: (timeMs: number) => void }
  }
}

export function LaunchCampaign() {
  const renderMode = new URLSearchParams(window.location.search).get('render') === '1'
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
  useEffect(() => {
    if (!renderMode) return
    window.__BALAXYS_RENDER = { seek: timeline.seek }
    return () => {
      delete window.__BALAXYS_RENDER
    }
  }, [renderMode, timeline.seek])
  return (
    <main className={`campaign-page shell ${renderMode ? 'campaign-page--render' : ''}`}>
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
      <LaunchStage timeMs={timeline.time} ratio={ratio} />
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
