import { useEffect, useState } from 'react'
import { useAudioPlayer } from '@/audio/useAudioPlayer'
import { advancedAudioTimeline } from '../../../scripts/audio-core.mjs'
import { useTimeline } from '@/renderer/useTimeline'
import type { SceneRatio } from '@/renderer/scene'
import { AdvancedSmokeStage } from './AdvancedSmokeStage'

declare global {
  interface Window {
    __BALAXYS_AV_RENDER?: { seek: (timeMs: number) => void }
  }
}

export function AdvancedCampaign() {
  const query = new URLSearchParams(window.location.search)
  const renderMode = query.get('render') === '1'
  const ratio: SceneRatio = query.get('ratio') === '9:16' ? '9:16' : '16:9'
  const initial = Number(query.get('t')) || 0
  const timeline = useTimeline(8000, false, initial)
  const audio = useAudioPlayer(advancedAudioTimeline)
  const [inspect, setInspect] = useState(query.get('inspect') === '1' && import.meta.env.DEV)
  useEffect(() => {
    if (!renderMode) return
    window.__BALAXYS_AV_RENDER = { seek: timeline.seek }
    return () => {
      delete window.__BALAXYS_AV_RENDER
    }
  }, [renderMode, timeline.seek])
  const stage = (
    <AdvancedSmokeStage timeMs={timeline.time} ratio={ratio} reduced={timeline.reduced} />
  )
  if (renderMode)
    return (
      <main className={`advanced-render advanced-render--${ratio.replace(':', '-')}`}>{stage}</main>
    )
  return (
    <main className="shell advanced-page">
      <header className="lab__header">
        <a className="wordmark" href="/">
          BALAXYS<span>✳</span>
        </a>
        <a href="/lab#campaign-console">← VOLVER AL LAB</a>
      </header>
      <span className="eyebrow">EXPERIMENTO / VISUAL ENGINE + SOUND</span>
      <h1>UNA OPERACIÓN SE PROPAGA.</h1>
      <p>
        Prueba interna. La secuencia representa relaciones conceptuales; las capacidades del ERP
        siguen sin verificar.
      </p>
      {stage}
      <div className="advanced-page__controls">
        <button
          className="button button--signal"
          onClick={() => {
            if (timeline.playing) {
              timeline.pause()
              audio.stop()
            } else {
              const start = timeline.time >= 8000 ? 0 : timeline.time
              void audio.playAt(start)
              timeline.play()
            }
          }}
        >
          {timeline.playing ? 'Pausar' : 'Reproducir'}
        </button>
        <button
          className="button"
          onClick={() => {
            audio.stop()
            timeline.replay()
            void audio.playAt(0)
          }}
        >
          Reiniciar
        </button>
        <input
          type="range"
          min="0"
          max="8000"
          step="10"
          value={timeline.time}
          onChange={(event) => {
            audio.stop()
            timeline.seek(Number(event.target.value))
          }}
          aria-label="Posición"
        />
        <button className="button" onClick={() => audio.setMuted(!audio.muted)}>
          {audio.muted ? 'Activar audio' : 'Silenciar'}
        </button>
        <label>
          Volumen{' '}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audio.volume}
            onChange={(event) => audio.setVolume(Number(event.target.value))}
          />
        </label>
        {import.meta.env.DEV && (
          <button className="button" onClick={() => setInspect(!inspect)}>
            Inspect
          </button>
        )}
      </div>
      {audio.error && <p role="alert">{audio.error}</p>}
      {inspect && (
        <pre>
          t={timeline.time.toFixed(0)} ms · ratio={ratio} · audio={audio.mode} · visual=THREE_D
        </pre>
      )}
    </main>
  )
}
