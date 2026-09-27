import { useEffect, useState } from 'react'
import { useSourceSegmentPlayer } from '@/audio/useSourceSegmentPlayer'
import {
  rhythmMagnetDurationMs,
  rhythmMagnetSourceEndSeconds,
  rhythmMagnetSourceStartSeconds,
  rhythmMagnetSourceUrl,
  rhythmMagnetVideoStartMs,
} from '@/audio/rhythmMagnet'
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
  const timeline = useTimeline(rhythmMagnetDurationMs, false, Number(query.get('t')) || 0)
  const music = useSourceSegmentPlayer(
    rhythmMagnetSourceStartSeconds,
    rhythmMagnetSourceEndSeconds - rhythmMagnetSourceStartSeconds,
  )
  useEffect(() => {
    if (!render) return
    window.__BALAXYS_AV_RENDER = { seek: timeline.seek }
    return () => {
      delete window.__BALAXYS_AV_RENDER
    }
  }, [render, timeline.seek])
  useEffect(() => {
    if (!timeline.playing) music.pause()
  }, [timeline.playing, music.pause])
  const visualTimeMs = Math.max(
    0,
    Math.min(facturacionDuration, timeline.time - rhythmMagnetVideoStartMs),
  )
  const stage =
    timeline.time < rhythmMagnetVideoStartMs ? (
      <div
        className="fe-stage"
        style={{
          aspectRatio:
            ratio === '16:9' ? '16/9' : ratio === '9:16' ? '9/16' : ratio === '4:5' ? '4/5' : '1/1',
        }}
        data-render-stage
        data-continuity="continuous"
        data-ratio={ratio}
      />
    ) : (
      <FacturacionStage timeMs={visualTimeMs} ratio={ratio} />
    )
  if (render) return <main className="fe-render">{stage}</main>
  return (
    <main className="shell fe-page">
      <header className="lab__header">
        <a className="wordmark" href="/">
          BALAXYS
        </a>
        <a href="/lab/campaigns/facturacion-electronica-uy-01">Revisar campaña ↗</a>
      </header>
      <span className="eyebrow">URUGUAY / IN_REVIEW / 12 S</span>
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
        <audio
          ref={music.element}
          src={rhythmMagnetSourceUrl}
          preload="auto"
          hidden
          aria-hidden="true"
        />
        <button
          className="button button--signal"
          disabled={timeline.reduced}
          onClick={() => {
            if (timeline.playing) {
              timeline.pause()
              music.pause()
            } else {
              const start = timeline.time >= rhythmMagnetDurationMs ? 0 : timeline.time
              void music.playAtMaster(start)
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
            void music.playAtMaster(0)
          }}
        >
          Reiniciar
        </button>
        <input
          aria-label="Posición de la campaña"
          type="range"
          min="0"
          max={rhythmMagnetDurationMs}
          step="1"
          value={timeline.time}
          disabled={timeline.reduced}
          onChange={(e) => {
            music.seekToMaster(Number(e.target.value))
            timeline.seek(Number(e.target.value))
          }}
        />
        <span className="timecode">{(timeline.time / 1000).toFixed(2)} / 12 s</span>
        <button className="button" onClick={() => music.setMuted(!music.muted)}>
          {music.muted ? 'Activar sonido' : 'Silenciar'}
        </button>
      </div>
      <div className="fe-audio-meta">
        MUSIC / RHYTHM MAGNET · SOURCE / bensound-rhythmmagnet.mp3 · USED RANGE / 00:08.000 →
        00:20.000 · VIDEO / 01.000 → 11.000 · SFX / NONE · AMBIENCE / NONE
      </div>
      {music.error && <p role="alert">{music.error}</p>}
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
