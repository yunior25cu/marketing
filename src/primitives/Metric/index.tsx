export interface MetricCounterProps {
  label: string
  before?: string
  after: string
  active?: boolean
  note?: string
}
export function MetricCounter({ label, before, after, active = false, note }: MetricCounterProps) {
  return (
    <div
      className="metric-counter"
      aria-label={`${label}: ${active ? after : (before ?? 'pendiente')}`}
    >
      <span className="micro-label">{label}</span>
      <div className="metric-counter__row">
        <span className="data-value">{before ?? '—'}</span>
        <span className="metric-arrow">→</span>
        <strong className={`data-value ${active ? 'signal-text' : ''}`}>
          {active ? after : '—'}
        </strong>
      </div>
      {note && <span className="metric-note">{note}</span>}
    </div>
  )
}
