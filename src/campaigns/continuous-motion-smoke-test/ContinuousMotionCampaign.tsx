import { useEffect } from 'react'
import { continuousAudioTimeline } from '../../../scripts/audio-core.mjs'
import { useAudioPlayer } from '@/audio/useAudioPlayer'
import { useTimeline } from '@/renderer/useTimeline'
import type { SceneRatio } from '@/renderer/scene'
import { ContinuousMotionStage } from './ContinuousMotionStage'
import { continuousDuration } from './definition'

declare global {
  interface Window {
    __BALAXYS_AV_RENDER?: { seek: (timeMs: number) => void }
  }
}

export function ContinuousMotionCampaign() {
  const query = new URLSearchParams(window.location.search)
  const renderMode = query.get('render') === '1'
  const ratio: SceneRatio = query.get('ratio') === '9:16' ? '9:16' : '16:9'
  const initial = Number(query.get('t')) || 0
  const timeline = useTimeline(continuousDuration, false, initial)
  const audio = useAudioPlayer(continuousAudioTimeline)
  useEffect(() => {
    if (!renderMode) return
    window.__BALAXYS_AV_RENDER = { seek: timeline.seek }
    return () => {
      delete window.__BALAXYS_AV_RENDER
    }
  }, [renderMode, timeline.seek])
  const stage = <ContinuousMotionStage timeMs={timeline.time} ratio={ratio} />
  if (renderMode)
    return (
      <main className={`continuous-render continuous-render--${ratio.replace(':', '-')}`}>
        {stage}
      </main>
    )
  return (
    <main className="shell continuous-page">
      <header className="lab__header">
        <a className="wordmark" href="/">
          BALAXYS<span>✳</span>
        </a>
        <a href="/lab#campaign-console">← VOLVER AL LAB</a>
      </header>
      <span className="eyebrow">EXPERIMENTO / CONTINUOUS TRANSFORMATION</span>
      <h1>UNA VENTA NUNCA ES SÓLO UNA VENTA.</h1>
      <p>
        Un único campo visual. Los objetos persisten; la venta nace de la unidad que se desprende
        del stock.
      </p>
      {stage}
      <div className="continuous-page__controls">
        <button
          className="button button--signal"
          onClick={() => {
            if (timeline.playing) {
              timeline.pause()
              audio.stop()
            } else {
              void audio.playAt(timeline.time >= continuousDuration ? 0 : timeline.time)
              timeline.play()
            }
          }}
        >
          {timeline.playing ? 'Pausar' : 'Reproducir'}
        </button>
        <button
          className="button"
          onClick={() => {
            timeline.replay()
            void audio.playAt(0)
          }}
        >
          Reiniciar
        </button>
        <input
          type="range"
          min="0"
          max={continuousDuration}
          step="1"
          value={timeline.time}
          onChange={(event) => {
            audio.stop()
            timeline.seek(Number(event.target.value))
          }}
          aria-label="Posición del motion"
        />
        <span className="timecode">{(timeline.time / 1000).toFixed(2)} / 10.00 s</span>
        <button className="button" onClick={() => audio.setMuted(!audio.muted)}>
          {audio.muted ? 'Activar audio' : 'Silenciar'}
        </button>
        {import.meta.env.DEV && (
          <pre>
            scrub determinista · cámara{' '}
            {document.querySelector('[data-camera-scale]')?.getAttribute('data-camera-scale')}
          </pre>
        )}
      </div>
      {audio.error && <p role="alert">{audio.error}</p>}
      <p className="continuous-page__note">
        Prototipo conceptual con datos de demostración. No afirma capacidades del ERP.
      </p>
    </main>
  )
}
