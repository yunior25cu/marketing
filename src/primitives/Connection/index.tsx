export interface ConnectionGraphProps {
  labels: string[]
  activeIndex: number
}
export function ConnectionGraph({ labels, activeIndex }: ConnectionGraphProps) {
  return (
    <div
      className="connection-graph"
      role="img"
      aria-label={labels
        .map((label, i) => `${label}: ${i <= activeIndex ? 'activo' : 'pendiente'}`)
        .join(', ')}
    >
      {labels.map((label, i) => (
        <div
          className={`connection-graph__item ${i <= activeIndex ? 'is-active' : ''}`}
          key={label}
        >
          <span className="connection-graph__point" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
