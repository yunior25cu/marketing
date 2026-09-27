export interface CounterProps {
  current: number
  total: number
  label?: string
}
export function Counter({ current, total, label = 'Paso' }: CounterProps) {
  return (
    <span className="counter mono" aria-label={`${label} ${current} de ${total}`}>
      {String(current).padStart(2, '0')} <span>/ {String(total).padStart(2, '0')}</span>
    </span>
  )
}
