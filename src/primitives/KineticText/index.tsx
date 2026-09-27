export interface KineticTextProps {
  lines: string[]
  active?: boolean
  accent?: number
  visibleCount?: number
}
export function KineticText({
  lines,
  active = true,
  accent = -1,
  visibleCount = lines.length,
}: KineticTextProps) {
  return (
    <div className={`kinetic-text ${active ? 'is-active' : ''}`}>
      {lines.map((line, i) => (
        <span
          className={`${i === accent ? 'signal-text' : ''} ${i < visibleCount ? 'is-visible' : ''}`}
          aria-hidden={i >= visibleCount}
          key={`${line}-${i}`}
        >
          {line}
        </span>
      ))}
    </div>
  )
}
