import { useState } from 'react'
import { formats, ratios } from '@/compositions/formats'
import { LaunchStage } from '@/campaigns/launch-01/LaunchStage'
import { TemplateStage } from '@/campaigns/TemplateStage'
import { campaignDocument, campaignRecords } from '@/orchestrator/registry'
import type { CampaignRecord } from '@/orchestrator/contracts'
import { useTimeline } from '@/renderer/useTimeline'
import type { SceneRatio } from '@/renderer/scene'
import { seconds } from '@/utils/time'
import './console.css'

const statusLabels = {
  DRAFT: 'Borrador',
  IN_REVIEW: 'Lista para revisión',
  NEEDS_CHANGES: 'Necesita cambios',
  APPROVED: 'Aprobada',
  ARCHIVED: 'Archivada',
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
  const [ratio, setRatio] = useState<SceneRatio>(record.brief.formats[0])
  const [tab, setTab] = useState<'brief' | 'storyboard' | 'review'>('brief')
  const [copied, setCopied] = useState(false)
  const initialTime = Number(new URLSearchParams(window.location.search).get('t')) || 0
  const timeline = useTimeline(record.brief.duration, false, initialTime)
  const prompt = `MEJORAR CAMPAÑA\nCampaña: ${record.id}\nCambios: [describí qué querés mejorar]`
  const blockers = record.brief.productCapabilities.filter((claim) => claim.status !== 'VERIFIED')
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
      <div className="campaign-console__stage">
        {record.playback.kind === 'launch-01' ? (
          <LaunchStage timeMs={timeline.time} ratio={ratio} />
        ) : (
          <TemplateStage record={record} timeMs={timeline.time} ratio={ratio} />
        )}
      </div>
      <div className="campaign-console__controls">
        <button
          className="button button--signal"
          disabled={timeline.reduced}
          onClick={timeline.playing ? timeline.pause : timeline.play}
        >
          {timeline.playing ? 'Pausar' : 'Reproducir'}
        </button>
        <button className="button" disabled={timeline.reduced} onClick={timeline.replay}>
          Reiniciar
        </button>
        <input
          type="range"
          min="0"
          max={record.brief.duration}
          step="10"
          value={timeline.time}
          onChange={(event) => timeline.seek(Number(event.target.value))}
          aria-label="Posición de la campaña"
        />
        <span className="timecode">
          {seconds(timeline.time)} / {seconds(record.brief.duration)}
        </span>
      </div>
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
