import { lazy, Suspense, useEffect, useState } from 'react'
import { formats, ratios } from '@/compositions/formats'
import { LaunchStage } from '@/campaigns/launch-01/LaunchStage'
import { TemplateStage } from '@/campaigns/TemplateStage'
import { customStages } from '@/campaigns/stages'
import { motionGraphicsCriteria, motionGraphicsCriterionLabels } from '@/motion/continuous'
import {
  activeAudioCues,
  advancedAudioTimeline,
  continuousAudioTimeline,
} from '../../scripts/audio-core.mjs'
import { useAudioPlayer } from '@/audio/useAudioPlayer'
import { campaignDocument, campaignRecords } from '@/orchestrator/registry'
import type { CampaignRecord } from '@/orchestrator/contracts'
import { useTimeline } from '@/renderer/useTimeline'
import type { SceneRatio } from '@/renderer/scene'
import { seconds } from '@/utils/time'
import './console.css'

const AdvancedSmokeStage = lazy(() =>
  import('@/campaigns/visual-engine-smoke-test/AdvancedSmokeStage').then((module) => ({
    default: module.AdvancedSmokeStage,
  })),
)
const ContinuousMotionStage = lazy(() =>
  import('@/campaigns/continuous-motion-smoke-test/ContinuousMotionStage').then((module) => ({
    default: module.ContinuousMotionStage,
  })),
)

const statusLabels = {
  DRAFT: 'Borrador',
  IN_REVIEW: 'Lista para revisión',
  NEEDS_CHANGES: 'Necesita cambios',
  APPROVED: 'Aprobada',
  ARCHIVED: 'Archivada',
}

function useFrameMetrics(enabled: boolean) {
  const [metrics, setMetrics] = useState({ fps: 0, frameMs: 0 })
  useEffect(() => {
    if (!enabled) return
    let frame = 0
    let last = performance.now()
    let count = 0
    const tick = (now: number) => {
      count++
      if (now - last >= 500) {
        setMetrics({
          fps: Math.round((count * 1000) / (now - last)),
          frameMs: Number(((now - last) / count).toFixed(1)),
        })
        count = 0
        last = now
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [enabled])
  return metrics
}

function ReviewText({ source }: { source: string }) {
  return (
    <div className="console-review-text">
      {source
        .split('\n')
        .filter(Boolean)
        .map((line, index) => {
          const clean = line.replace(/\*\*/g, '').replace(/`/g, '')
          if (line.startsWith('#')) return <h4 key={index}>{clean.replace(/^#+\s*/, '')}</h4>
          return <p key={index}>{clean}</p>
        })}
    </div>
  )
}

function CampaignConsolePlayer({ record }: { record: CampaignRecord }) {
  const [ratio, setRatio] = useState<SceneRatio>(() => {
    const query = new URLSearchParams(window.location.search).get('ratio')
    return record.brief.formats.find((format) => format === query) ?? record.brief.formats[0]
  })
  const [tab, setTab] = useState<'brief' | 'storyboard' | 'review'>('brief')
  const [copied, setCopied] = useState(false)
  const initialTime = Number(new URLSearchParams(window.location.search).get('t')) || 0
  const timeline = useTimeline(record.brief.duration, false, initialTime)
  const hasAudio = ['advanced-smoke-v1', 'continuous-motion-v1'].includes(
    record.audioTimelineId ?? '',
  )
  const audioTimeline =
    record.audioTimelineId === 'continuous-motion-v1'
      ? continuousAudioTimeline
      : advancedAudioTimeline
  const audio = useAudioPlayer(hasAudio ? audioTimeline : null)
  const [inspect, setInspect] = useState(false)
  const frameMetrics = useFrameMetrics(inspect && import.meta.env.DEV)
  const prompt = `MEJORAR CAMPAÑA\nCampaña: ${record.id}\nCambios: [describí qué querés mejorar]`
  const blockers = record.brief.productCapabilities.filter((claim) => claim.status !== 'VERIFIED')
  const CustomStage = record.playback.kind === 'custom' ? customStages[record.id] : undefined
  return (
    <div className="campaign-console__body">
      <div className="campaign-console__meta">
        <div>
          <span className="eyebrow">CAMPAÑA / {record.id.toUpperCase()}</span>
          <h3>{record.brief.title}</h3>
          <p>{record.brief.objective}</p>
        </div>
        <div className="campaign-console__status">
          <span className={`console-state console-state--${record.status.toLowerCase()}`}>
            {statusLabels[record.status]}
          </span>
          <span className="micro-label">
            VERSIÓN {record.version} / {seconds(record.brief.duration)}
          </span>
        </div>
      </div>
      <div className="campaign-console__ratios">
        <span className="micro-label">FORMATO</span>
        <div className="ratio-switch" role="group" aria-label="Formato de campaña">
          {ratios.map((item) => (
            <button
              key={item}
              className={ratio === item ? 'is-active' : ''}
              disabled={!record.brief.formats.includes(item)}
              onClick={() => setRatio(item)}
              aria-pressed={ratio === item}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="micro-label">
          {formats[ratio].width} × {formats[ratio].height}
        </span>
      </div>
      <div
        className={`campaign-console__stage ${inspect && import.meta.env.DEV ? 'campaign-console__stage--inspect' : ''}`}
      >
        {record.playback.kind === 'launch-01' ? (
          <LaunchStage timeMs={timeline.time} ratio={ratio} />
        ) : record.id === 'continuous-motion-smoke-test' ? (
          <Suspense
            fallback={<div className="campaign-console__stage-loading">Cargando vista…</div>}
          >
            <ContinuousMotionStage timeMs={timeline.time} ratio={ratio} />
          </Suspense>
        ) : record.id === 'visual-engine-smoke-test' ? (
          <Suspense
            fallback={<div className="campaign-console__stage-loading">Cargando vista…</div>}
          >
            <AdvancedSmokeStage timeMs={timeline.time} ratio={ratio} reduced={timeline.reduced} />
          </Suspense>
        ) : CustomStage ? (
          <CustomStage timeMs={timeline.time} ratio={ratio} />
        ) : (
          <TemplateStage record={record} timeMs={timeline.time} ratio={ratio} />
        )}
        {inspect && import.meta.env.DEV && (
          <div className="campaign-console__safe-area" aria-hidden="true" />
        )}
      </div>
      <div className="campaign-console__controls">
        <button
          className="button button--signal"
          disabled={timeline.reduced}
          onClick={() => {
            if (timeline.playing) {
              timeline.pause()
              audio.stop()
            } else {
              void audio.playAt(timeline.time >= record.brief.duration ? 0 : timeline.time)
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
          type="range"
          min="0"
          max={record.brief.duration}
          step={record.motionStyle === 'CONTINUOUS' ? '1' : '10'}
          value={timeline.time}
          onChange={(event) => {
            audio.stop()
            timeline.seek(Number(event.target.value))
          }}
          aria-label="Posición de la campaña"
        />
        <span className="timecode">
          {seconds(timeline.time)} / {seconds(record.brief.duration)}
        </span>
      </div>
      <div className="campaign-console__av-meta">
        <span>MOTION STYLE / {record.motionStyle ?? 'DISCRETE'}</span>
        <span>MOTION GRAPHICS QUALITY / {record.motionGraphicsQuality ?? 'FAIL'}</span>
        {record.motionStyle === 'CONTINUOUS' && (
          <>
            <span>POWERPOINT RISK / {record.powerpointRisk ?? 'PENDING'}</span>
            <span>MOTION CONTINUITY / {record.motionContinuity ?? 'PENDING'}</span>
          </>
        )}
        <span>VISUAL / {record.visualLevel ?? 'STANDARD'}</span>
        <span>AUDIO / {record.audioLevel ?? 'NONE'}</span>
        <span>CHECKPOINTS / {record.visualCheckpoints?.length ?? 0}</span>
      </div>
      {hasAudio && (
        <div className="campaign-console__audio">
          <button className="button" onClick={() => audio.setMuted(!audio.muted)}>
            {audio.muted ? 'Activar sonido' : 'Silenciar'}
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
          <label>
            Escuchar{' '}
            <select
              value={audio.mode}
              onChange={(event) => {
                audio.stop()
                timeline.pause()
                audio.setMode(event.target.value as typeof audio.mode)
              }}
            >
              <option value="mix">Mezcla final</option>
              <option value="sfx">Solo SFX</option>
              <option value="ambience">Solo ambiente</option>
              <option value="music" disabled>
                No hay música
              </option>
            </select>
          </label>
          {audio.error && <p role="alert">{audio.error}</p>}
        </div>
      )}
      {import.meta.env.DEV && (
        <button
          className="button campaign-console__inspect-button"
          onClick={() => setInspect(!inspect)}
        >
          Inspect {inspect ? 'ON' : 'OFF'}
        </button>
      )}
      {inspect && import.meta.env.DEV && (
        <div className="campaign-console__inspect">
          <span>t={timeline.time.toFixed(0)} ms</span>
          <span>ratio={ratio}</span>
          <span>
            {frameMetrics.fps} FPS / {frameMetrics.frameMs} ms
          </span>
          <span>escena={record.playback.sceneId}</span>
          <span>
            fase=
            {record.storyboard.find(
              (phase) => timeline.time >= phase.from && timeline.time < phase.to,
            )?.id ?? 'close'}
          </span>
          <span>
            cue=
            {hasAudio
              ? activeAudioCues(audioTimeline, timeline.time)
                  .map((cue) => cue.id)
                  .join(', ') || '—'
              : '—'}
          </span>
        </div>
      )}
      {timeline.reduced && (
        <p className="campaign-console__notice">
          Movimiento reducido: se muestra el estado final de la historia.
        </p>
      )}
      <div className="campaign-console__detail">
        <div className="campaign-console__tabs" role="tablist" aria-label="Documentos de campaña">
          {(['brief', 'storyboard', 'review'] as const).map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={tab === item}
              className={tab === item ? 'is-active' : ''}
              onClick={() => setTab(item)}
            >
              {item === 'brief' ? 'Brief' : item === 'storyboard' ? 'Storyboard' : 'Review'}
            </button>
          ))}
        </div>
        {tab === 'brief' && (
          <div className="campaign-console__brief">
            <div>
              <span className="micro-label">OBJETIVO</span>
              <p>{record.brief.objective}</p>
            </div>
            <div>
              <span className="micro-label">PÚBLICO</span>
              <p>{record.brief.audience}</p>
            </div>
            <div>
              <span className="micro-label">MENSAJE</span>
              <p>{record.brief.message}</p>
            </div>
            <div>
              <span className="micro-label">CLAIMS</span>
              <p>
                {blockers.length
                  ? `${blockers.length} pendiente(s) de verificar con producto`
                  : 'Sin claims pendientes registrados'}
              </p>
            </div>
          </div>
        )}
        {tab === 'storyboard' && (
          <ol className="campaign-console__storyboard">
            {record.storyboard.map((phase) => (
              <li key={phase.id}>
                <span className="mono">
                  {seconds(phase.from)}–{seconds(phase.to)}
                </span>
                <strong>{phase.label}</strong>
                <p>{phase.visual}</p>
                <em>{phase.copy}</em>
              </li>
            ))}
          </ol>
        )}
        {tab === 'review' && (
          <div className="campaign-console__review">
            <section
              className="campaign-console__motion-quality"
              aria-label="Motion graphics quality"
            >
              <span className="micro-label">MOTION_GRAPHICS_QUALITY</span>
              <strong className={record.motionGraphicsQuality === 'PASS' ? 'signal-text' : ''}>
                {record.motionGraphicsQuality ?? 'FAIL'}
              </strong>
              <ol>
                {motionGraphicsCriteria.map((criterion) => {
                  const evidence = record.motionGraphicsReview?.[criterion]
                  return (
                    <li key={criterion}>
                      <span>{motionGraphicsCriterionLabels[criterion]}</span>
                      <strong>
                        {evidence?.pass && evidence.evidence?.trim() ? 'PASS' : 'FAIL'}
                      </strong>
                      <p>{evidence?.evidence || 'Pendiente de evidencia e inspección.'}</p>
                    </li>
                  )
                })}
              </ol>
            </section>
            <div className="campaign-console__audits">
              {(['brand', 'quality', 'performance'] as const).map((agent) => (
                <div key={agent}>
                  <span className="micro-label">{agent.toUpperCase()}</span>
                  <strong className={record.reviews[agent].status === 'PASS' ? 'signal-text' : ''}>
                    {record.reviews[agent].status}
                  </strong>
                  <p>{record.reviews[agent].summary}</p>
                </div>
              ))}
              {(['visual', 'audio', 'av'] as const).map(
                (agent) =>
                  record.reviews[agent] && (
                    <div key={agent}>
                      <span className="micro-label">{agent.toUpperCase()} QA</span>
                      <strong
                        className={record.reviews[agent]?.status === 'PASS' ? 'signal-text' : ''}
                      >
                        {record.reviews[agent]?.status}
                      </strong>
                      <p>{record.reviews[agent]?.summary}</p>
                    </div>
                  ),
              )}
            </div>
            <ReviewText source={campaignDocument(record.id, 'review')} />
          </div>
        )}
      </div>
      <div className="campaign-console__bottom">
        <details>
          <summary>Prompt de operación</summary>
          <p>
            Hablá con el Campaign Orchestrator para pedir cambios. Podés empezar con este texto:
          </p>
          <textarea readOnly value={prompt} aria-label="Texto para pedir cambios" />
          <button
            className="button"
            onClick={async () => {
              await navigator.clipboard.writeText(prompt)
              setCopied(true)
            }}
          >
            {copied ? 'Copiado' : 'Copiar texto'}
          </button>
          <p>
            Para crear o adaptar otra campaña, consultá <code>docs/CAMPAIGN_OPERATOR_GUIDE.md</code>
            .
          </p>
        </details>
        <a
          className="button"
          href={record.id === 'launch-01' ? '/campaigns/launch-01' : `/lab/campaigns/${record.id}`}
        >
          Abrir vista individual ↗
        </a>
      </div>
    </div>
  )
}

export function CampaignConsole({ initialId }: { initialId?: string }) {
  const [selectedId, setSelectedId] = useState(initialId ?? campaignRecords[0]?.id ?? '')
  const record = campaignRecords.find((item) => item.id === selectedId)
  return (
    <section id="campaign-console" className="campaign-console" aria-label="Campaign Console">
      <div className="campaign-console__head">
        <div>
          <span className="eyebrow">07 / CAMPAIGN CONSOLE</span>
          <h2>Campañas en revisión.</h2>
          <p>Elegí una pieza, mirá su secuencia y revisá lo que falta para aprobarla.</p>
        </div>
        <label>
          <span className="micro-label">CAMPAÑA</span>
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            {campaignRecords.map((item) => (
              <option key={item.id} value={item.id}>
                {item.brief.title} / {statusLabels[item.status]}
              </option>
            ))}
          </select>
        </label>
      </div>
      {record ? (
        <CampaignConsolePlayer key={record.id} record={record} />
      ) : (
        <p>No hay campañas registradas.</p>
      )}
    </section>
  )
}
