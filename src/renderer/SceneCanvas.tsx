import { DocumentCard } from '@/primitives/DocumentCard'
import { EntityNode } from '@/primitives/EntityNode'
import { EventMarker } from '@/primitives/Event'
import { FlowLine } from '@/primitives/FlowLine'
import { MetricCounter } from '@/primitives/Metric'
import { StatusIndicator } from '@/primitives/Status'
import type { SceneDefinition, SceneRatio } from './scene'
import { sceneState } from './scene'
import './scene.css'

export interface SceneCanvasProps {
  scene: SceneDefinition
  timeMs: number
  ratio?: SceneRatio
  compact?: boolean
}
export function SceneCanvas({ scene, timeMs, ratio = '16:9', compact = false }: SceneCanvasProps) {
  const state = sceneState(scene, timeMs)
  return (
    <section
      className={`scene-canvas scene-canvas--${ratio.replace(':', '-')} ${compact ? 'scene-canvas--compact' : ''}`}
      aria-label={scene.title}
    >
      <div className="scene-canvas__grid" aria-hidden="true" />
      <div className="scene-canvas__header">
        <span className="eyebrow">BALAXYS / BUSINESS IN MOTION</span>
        <span className="mono scene-canvas__id">{scene.kicker}</span>
      </div>
      <div className="scene-canvas__intro">
        <div>
          <span className="micro-label">SECUENCIA / {scene.id.toUpperCase()}</span>
          <h3>{scene.title}</h3>
        </div>
        <StatusIndicator
          label={
            state.activeIndex >= scene.nodes.length - 1 ? 'Cadena visible' : 'Evento en proceso'
          }
          status={state.activeIndex >= 0 ? 'active' : 'idle'}
        />
      </div>
      <div className="scene-canvas__track">
        <FlowLine
          progress={Math.max(0, Math.min(1, (state.activeIndex + 0.4) / scene.nodes.length))}
          label="Secuencia de cambios"
        />
        <div className="scene-canvas__nodes">
          {scene.nodes.map((node, index) => (
            <EntityNode
              key={node.id}
              index={String(index + 1).padStart(2, '0')}
              title={node.title}
              active={state.activeIndex >= index}
            >
              <MetricCounter
                label={node.title}
                before={node.before}
                after={node.after}
                active={state.activeIndex >= index}
                note={node.note}
              />
            </EntityNode>
          ))}
        </div>
      </div>
      <div className="scene-canvas__lower">
        <DocumentCard {...scene.document} active={state.activeIndex >= 0} />
        <div className="scene-canvas__eventlog">
          <span className="micro-label">
            EVENT LOG / {String(state.activeEvents.length).padStart(2, '0')}
          </span>
          {scene.events.map((event) => (
            <EventMarker
              key={event.id}
              id={event.id.toUpperCase()}
              label={event.label}
              active={state.time >= event.at}
              time={`${(event.at / 1000).toFixed(1)}S`}
            />
          ))}
        </div>
      </div>
      <div className="scene-canvas__footer">
        <span className="micro-label">{scene.disclosure}</span>
        <span className="mono">
          {(state.time / 1000).toFixed(1)} / {(scene.duration / 1000).toFixed(1)}S
        </span>
      </div>
    </section>
  )
}
