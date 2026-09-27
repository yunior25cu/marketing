import type { ReactNode } from 'react'
import { SignalPulse } from '../Signal'
export interface EntityNodeProps {
  index: string
  title: string
  active?: boolean
  children?: ReactNode
  className?: string
}
export function EntityNode({
  index,
  title,
  active = false,
  children,
  className = '',
}: EntityNodeProps) {
  return (
    <article className={`entity-node ${active ? 'is-active' : ''} ${className}`}>
      <div className="entity-node__top">
        <span className="micro-label">
          {index} / {title}
        </span>
        <SignalPulse active={active} />
      </div>
      <div className="entity-node__body">{children}</div>
    </article>
  )
}
