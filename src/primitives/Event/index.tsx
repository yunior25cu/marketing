export interface EventMarkerProps {
  id: string
  label: string
  active?: boolean
  time?: string
}
export function EventMarker({ id, label, active = false, time }: EventMarkerProps) {
  return (
    <div className={`event-marker ${active ? 'is-active' : ''}`}>
      <span className="event-marker__dot" />
      <span className="micro-label">{label}</span>
      <strong className="mono">{id}</strong>
      {time && <span className="micro-label">{time}</span>}
    </div>
  )
}
