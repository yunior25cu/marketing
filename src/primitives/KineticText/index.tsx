import type { CSSProperties } from 'react'
import { morphNumber } from '@/motion/continuous'

export interface KineticTextProps {
  lines: string[]
  active?: boolean
  accent?: number
  visibleCount?: number
  granularity?: 'line' | 'word' | 'character'
  revealProgress?: number
  scale?: number
  tracking?: string
  x?: string
  y?: string
  mask?: boolean
  className?: string
  replacement?: { from: string; to: string; progress: number }
  numericTransform?: { from: number; to: number; progress: number; decimals?: number }
}
export function KineticText({
  lines,
  active = true,
  accent = -1,
  visibleCount = lines.length,
  granularity = 'line',
  revealProgress,
  scale = 1,
  tracking,
  x = '0',
  y = '0',
  mask = false,
  className = '',
  replacement,
  numericTransform,
}: KineticTextProps) {
  const controlled = revealProgress !== undefined || mask || scale !== 1 || tracking !== undefined
  const transformedNumber = numericTransform
    ? morphNumber(
        numericTransform.from,
        numericTransform.to,
        numericTransform.progress,
        numericTransform.decimals,
      )
    : undefined
  const fullText = replacement?.to ?? transformedNumber ?? lines.join(' ')
  const style = {
    '--type-scale': scale,
    '--type-tracking': tracking,
    '--type-x': x,
    '--type-y': y,
    '--type-reveal': revealProgress ?? 1,
    '--type-clip': `${Math.max(0, Math.min(1, 1 - (revealProgress ?? 1))) * 100}%`,
  } as CSSProperties
  return (
    <div
      className={`kinetic-text ${active ? 'is-active' : ''} ${controlled ? 'kinetic-text--controlled' : ''} ${className}`}
      style={controlled ? style : undefined}
      aria-label={fullText}
    >
      {lines.map((line, i) => (
        <span
          className={`${i === accent ? 'signal-text' : ''} ${i < visibleCount ? 'is-visible' : ''}`}
          aria-hidden="true"
          key={`${line}-${i}`}
        >
          {replacement && i === 0 ? (
            <span className="kinetic-text__replacement" aria-hidden="true">
              <span
                style={{
                  clipPath: `inset(0 0 0 ${Math.max(0, Math.min(1, replacement.progress)) * 100}%)`,
                }}
              >
                {replacement.from}
              </span>
              <span
                style={{
                  clipPath: `inset(0 ${(1 - Math.max(0, Math.min(1, replacement.progress))) * 100}% 0 0)`,
                }}
              >
                {replacement.to}
              </span>
            </span>
          ) : numericTransform && i === 0 ? (
            transformedNumber
          ) : granularity === 'line' ? (
            line
          ) : (
            (() => {
              const units =
                granularity === 'word' ? (line.match(/\s+|[^\s]+/g) ?? []) : Array.from(line)
              const revealUnits =
                granularity === 'word'
                  ? units.filter((unit) => !/^\s+$/.test(unit)).length
                  : units.length
              let revealIndex = 0
              return units.map((unit, index) => {
                const whitespace = granularity === 'word' && /^\s+$/.test(unit)
                const local = whitespace
                  ? 1
                  : Math.max(0, Math.min(1, (revealProgress ?? 1) * revealUnits - revealIndex++))
                return (
                  <span
                    className="kinetic-text__unit"
                    key={`${index}-${unit}`}
                    style={
                      {
                        '--unit-opacity': local,
                        '--unit-y': `${(1 - local) * 0.18}em`,
                        '--unit-scale': 0.88 + local * 0.12,
                      } as CSSProperties
                    }
                  >
                    {unit}
                  </span>
                )
              })
            })()
          )}
        </span>
      ))}
    </div>
  )
}
