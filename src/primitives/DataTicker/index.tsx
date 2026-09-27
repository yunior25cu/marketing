export interface DataTickerProps {
  items: { label: string; value: string }[]
}
export function DataTicker({ items }: DataTickerProps) {
  return (
    <div className="data-ticker" aria-label="Datos de la operación">
      {items.map((item) => (
        <div key={item.label}>
          <span className="micro-label">{item.label}</span>
          <strong className="mono">{item.value}</strong>
        </div>
      ))}
    </div>
  )
}
