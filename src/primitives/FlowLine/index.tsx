export interface FlowLineProps {
  progress: number
  label?: string
}
export function FlowLine({ progress, label = 'Propagación del evento' }: FlowLineProps) {
  return (
    <div className="flow-line" role="img" aria-label={`${label}: ${Math.round(progress * 100)}%`}>
      <span style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress))})` }} />
    </div>
  )
}
