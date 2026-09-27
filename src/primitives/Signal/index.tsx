export interface SignalPulseProps {
  active?: boolean
  label?: string
}
export function SignalPulse({ active = false, label = 'Señal activa' }: SignalPulseProps) {
  return (
    <span
      className={`signal-pulse${active ? ' is-active' : ''}`}
      role="img"
      aria-label={active ? label : 'Sin actividad'}
    />
  )
}
