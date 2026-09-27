import { useEffect, useState } from 'react'
import { facturacionAudioTimeline } from '../../../scripts/audio-core.mjs'
import { useAudioPlayer } from '@/audio/useAudioPlayer'
import { useTimeline } from '@/renderer/useTimeline'
import { ratios } from '@/compositions/formats'
import type { SceneRatio } from '@/renderer/scene'
import { FacturacionStage } from './FacturacionStage'
import { facturacionDuration } from './definition'

export function FacturacionCampaign() {
  const query = new URLSearchParams(window.location.search)
  const render = query.get('render') === '1'
  const [ratio, setRatio] = useState<SceneRatio>(
    ratios.find((r) => r === query.get('ratio')) ?? '16:9',
  )
  const timeline = useTimeline(facturacionDuration, false, Number(query.get('t')) || 0)
  const audio = useAudioPlayer(facturacionAudioTimeline)
  useEffect(() => {
    if (!render) return
    window.__BALAXYS_AV_RENDER = { seek: timeline.seek }
    return () => {
      delete window.__BALAXYS_AV_RENDER
    }
  }, [render, timeline.seek])
  useEffect(() => {
    if (!timeline.playing) audio.stop()
  }, [timeline.playing, audio.stop])
  const stage = <FacturacionStage timeMs={timeline.time} ratio={ratio} />
  if (render) return <main className="fe-render">{stage}</main>
  return (
    <main className="shell fe-page">
      <header className="lab__header">
        <a className="wordmark" href="/">
          BALAXYS
        </a>
        <a href="/lab/campaigns/facturacion-electronica-uy-01">Revisar campaña ↗</a>
      </header>
      <span className="eyebrow">URUGUAY / IN_REVIEW / 10 S</span>
      <h1>
        Facturación electrónica.
        <br />
        Parte de tu operación.
      </h1>
      <div className="fe-controls" role="group" aria-label="Formato">
        {ratios.map((r) => (
          <button className="button" key={r} aria-pressed={r === ratio} onClick={() => setRatio(r)}>
            {r}
          </button>
        ))}
      </div>
      {stage}
      <div className="fe-controls">
        <button
          className="button button--signal"
          disabled={timeline.reduced}
          onClick={() => {
            if (timeline.playing) {
              timeline.pause()
              audio.stop()
            } else {
              void audio.playAt(timeline.time >= 10000 ? 0 : timeline.time)
              timeline.play()
            }
          }}
        >
          {timeline.playing ? 'Pausar' : 'Reproducir'}
        </button>
        <button
          className="button"
          disabled={timeline.reduced}
          onClick={() => {
            timeline.replay()
            void audio.playAt(0)
          }}
        >
          Reiniciar
        </button>
        <input
          aria-label="Posición de la campaña"
          type="range"
          min="0"
          max="10000"
          step="1"
          value={timeline.time}
          disabled={timeline.reduced}
          onChange={(e) => {
            audio.stop()
            timeline.seek(Number(e.target.value))
          }}
        />
        <span className="timecode">{(timeline.time / 1000).toFixed(2)} / 10 s</span>
        <button className="button" onClick={() => audio.setMuted(!audio.muted)}>
          {audio.muted ? 'Activar sonido' : 'Silenciar'}
        </button>
      </div>
      {audio.error && <p role="alert">{audio.error}</p>}
      <p>
        Secuencia conceptual: venta → CFE → firma → envío a DGI → respuesta → documento vinculado a
        la operación. La respuesta no implica aprobación fiscal ni dispara los vínculos operativos.
      </p>
      {timeline.reduced && (
        <p>
          Movimiento reducido: composición final estática. La secuencia completa se describe arriba.
        </p>
      )}
    </main>
  )
}
