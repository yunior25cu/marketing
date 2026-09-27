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
import { useSourceSegmentPlayer } from '@/audio/useSourceSegmentPlayer'
import {
  rhythmMagnetDurationMs,
  rhythmMagnetSourceEndSeconds,
  rhythmMagnetSourceStartSeconds,
  rhythmMagnetSourceUrl,
  rhythmMagnetVideoEndMs,
  rhythmMagnetVideoStartMs,
} from '@/audio/rhythmMagnet'
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
  const currentMusic = record.audioTimelineId === 'facturacion-electronica-rhythmmagnet-v1'
  const [ratio, setRatio] = useState<SceneRatio>(() => {
    const query = new URLSearchParams(window.location.search).get('ratio')
    return record.brief.formats.find((format) => format === query) ?? record.brief.formats[0]
  })
  const [tab, setTab] = useState<'brief' | 'storyboard' | 'review'>('brief')
  const [copied, setCopied] = useState(false)
  const initialTime = Number(new URLSearchParams(window.location.search).get('t')) || 0
  const timeline = useTimeline(record.brief.duration, false, initialTime)
  const hasAudio = [
    'advanced-smoke-v1',
    'continuous-motion-v1',
    'facturacion-electronica-rhythmmagnet-v1',
  ].includes(record.audioTimelineId ?? '')
  const campaignAudio = record.audioTimelineId === 'facturacion-electronica-uy-01'
  const audioTimeline =
    record.audioTimelineId === 'continuous-motion-v1'
      ? continuousAudioTimeline
      : advancedAudioTimeline
  const audio = useAudioPlayer(hasAudio && !currentMusic ? audioTimeline : null)
  const music = useSourceSegmentPlayer(
    rhythmMagnetSourceStartSeconds,
    rhythmMagnetSourceEndSeconds - rhythmMagnetSourceStartSeconds,
  )
  const [inspect, setInspect] = useState(false)
  const frameMetrics = useFrameMetrics(inspect && import.meta.env.DEV)
  const prompt = `MEJORAR CAMPAÑA\nCampaña: ${record.id}\nCambios: [describí qué querés mejorar]`
  const blockers = record.brief.productCapabilities.filter((claim) => claim.status !== 'VERIFIED')
  const CustomStage = record.playback.kind === 'custom' ? customStages[record.id] : undefined
  const visualTime = currentMusic
    ? Math.max(0, Math.min(10000, timeline.time - rhythmMagnetVideoStartMs))
    : timeline.time
  useEffect(() => {
    if (currentMusic && !timeline.playing) music.pause()
  }, [currentMusic, timeline.playing, music.pause])
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
        ) : currentMusic && timeline.time < rhythmMagnetVideoStartMs ? (
          <div
            className="fe-stage"
            style={{ aspectRatio: `${formats[ratio].width}/${formats[ratio].height}` }}
            data-render-stage
            data-ratio={ratio}
          />
        ) : CustomStage ? (
          <CustomStage timeMs={visualTime} ratio={ratio} />
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
              if (currentMusic) music.pause()
              else audio.stop()
            } else {
              const start = timeline.time >= record.brief.duration ? 0 : timeline.time
              if (currentMusic) void music.playAtMaster(start)
              else void audio.playAt(start)
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
            if (currentMusic) void music.playAtMaster(0)
            else void audio.playAt(0)
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
            if (currentMusic) music.seekToMaster(Number(event.target.value))
            else audio.stop()
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
        <span>
          AUDIO / {currentMusic ? 'CURRENT AUDIO / RHYTHM MAGNET' : (record.audioLevel ?? 'NONE')}
        </span>
        <span>CHECKPOINTS / {record.visualCheckpoints?.length ?? 0}</span>
      </div>
      {hasAudio && (
        <div className="campaign-console__audio">
          {currentMusic ? (
            <>
              <audio
                ref={music.element}
                src={rhythmMagnetSourceUrl}
                preload="auto"
                hidden
                aria-hidden="true"
              />
              <div className="micro-label">CURRENT AUDIO / RHYTHM MAGNET</div>
              <span className="micro-label">SOURCE / bensound-rhythmmagnet.mp3</span>
              <span className="micro-label">
                USED RANGE / 00:{rhythmMagnetSourceStartSeconds.toFixed(3).padStart(6, '0')} → 00:
                {rhythmMagnetSourceEndSeconds.toFixed(3).padStart(6, '0')}
              </span>
              <span className="micro-label">MASTER / 12.000 s</span>
              <span className="micro-label">
                VIDEO / {(rhythmMagnetVideoStartMs / 1000).toFixed(3)} →{' '}
                {(rhythmMagnetVideoEndMs / 1000).toFixed(3)} s
              </span>
              <span className="micro-label">
                SFX / NONE · AMBIENCE / NONE · ADDITIONAL AUDIO / NONE
              </span>
              <span className="micro-label">
                LICENSE / PENDING PROOF · COMMERCIAL USE / NOT CLEARED
              </span>
              <button
                className="button button--signal"
                onClick={() => {
                  if (music.playing || timeline.playing) {
                    timeline.pause()
                    music.pause()
                  } else {
                    const start = timeline.time >= rhythmMagnetDurationMs ? 0 : timeline.time
                    void music.playAtMaster(start)
                    if (!timeline.reduced) timeline.play()
                  }
                }}
              >
                {music.playing || timeline.playing ? 'Pausar' : 'Escuchar'}
              </button>
              <label>
                Volumen{' '}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={music.volume}
                  onChange={(event) => music.setVolume(Number(event.target.value))}
                />
              </label>
              <button
                className="button"
                onClick={() => music.setMuted(!music.muted)}
                aria-pressed={!music.muted}
              >
                {music.muted ? 'MUSIC · MUTED' : 'MUSIC · ON'}
              </button>
              {music.error && <p role="alert">{music.error}</p>}
            </>
          ) : campaignAudio ? (
            <div role="group" aria-label="Comparar versiones de audio">
              <span className="micro-label">Archived campaign audio is unavailable.</span>
            </div>
          ) : null}
          {!currentMusic && (
            <>
              <button
                className="button"
                onClick={() => audio.setMuted(!audio.muted)}
                aria-pressed={!audio.muted}
              >
                {audio.muted ? 'MASTER AUDIO · OFF' : 'MASTER AUDIO · ON'}
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
                  {audioTimeline.tracks.some((track) => track.category === 'AMBIENCE') && (
                    <option value="ambience">Solo ambiente</option>
                  )}
                  {audioTimeline.tracks.some((track) => track.category === 'MUSIC') && (
                    <option value="music">Solo música</option>
                  )}
                </select>
              </label>
              {!audioTimeline.tracks.some((track) => track.category === 'MUSIC') && (
                <span className="micro-label">MUSIC · NONE / esta versión no usa música</span>
              )}
              {!audioTimeline.tracks.some((track) => track.category === 'AMBIENCE') && (
                <span className="micro-label">AMBIENCE · NONE</span>
              )}
              {audio.mode === 'mix' &&
                (['SFX', 'AMBIENCE', 'MUSIC'] as const).map((category) => {
                  const exists = audioTimeline.tracks.some((track) => track.category === category)
                  if (!exists)
                    return (
                      <span key={category} className="micro-label">
                        {category} · NONE
                      </span>
                    )
                  return (
                    <label key={category}>
                      <input
                        type="checkbox"
                        checked={audio.layers[category]}
                        onChange={(event) => {
                          audio.stop()
                          timeline.pause()
                          audio.setLayerEnabled(category, event.target.checked)
                        }}
                      />{' '}
                      {category} · {audio.layers[category] ? 'ON' : 'OFF'}
                    </label>
                  )
                })}
              {audio.error && <p role="alert">{audio.error}</p>}
            </>
          )}
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
            {currentMusic
              ? 'continuous music only'
              : hasAudio
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
