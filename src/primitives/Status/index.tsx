export interface StatusIndicatorProps {
  label: string
  status?: 'idle' | 'active' | 'warning' | 'error'
}
export function StatusIndicator({ label, status = 'idle' }: StatusIndicatorProps) {
  return (
    <span className={`status status--${status}`}>
      <i aria-hidden="true" />
      {label}
    </span>
  )
}
