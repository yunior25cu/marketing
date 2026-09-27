export interface KineticTextProps {
  lines: string[]
  active?: boolean
  accent?: number
}
export function KineticText({ lines, active = true, accent = -1 }: KineticTextProps) {
  return (
    <div className={`kinetic-text ${active ? 'is-active' : ''}`}>
      {lines.map((line, i) => (
        <span className={i === accent ? 'signal-text' : ''} key={`${line}-${i}`}>
          {line}
        </span>
      ))}
    </div>
  )
}
