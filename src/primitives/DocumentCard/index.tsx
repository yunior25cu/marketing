export interface DocumentCardProps {
  kind: string
  id: string
  rows: { label: string; value: string }[]
  active?: boolean
}
export function DocumentCard({ kind, id, rows, active = false }: DocumentCardProps) {
  return (
    <article className={`document-card ${active ? 'is-active' : ''}`} aria-label={`${kind} ${id}`}>
      <div className="document-card__head">
        <span className="micro-label">{kind}</span>
        <span className="mono">{id}</span>
      </div>
      {rows.map((row) => (
        <div className="document-card__row" key={row.label}>
          <span>{row.label}</span>
          <strong className="mono">{row.value}</strong>
        </div>
      ))}
      <div className="document-card__foot">
        <span className="micro-label">REGISTRO / BALAXYS</span>
        <span className="document-card__bars">▥▥▥▥▥</span>
      </div>
    </article>
  )
}
