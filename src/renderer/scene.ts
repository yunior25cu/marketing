export type SceneRatio = '16:9' | '1:1' | '4:5' | '9:16'
export type SceneEventKind = 'origin' | 'propagate' | 'change' | 'record' | 'resolve'

export interface SceneEvent {
  id: string
  at: number
  kind: SceneEventKind
  label: string
}
export interface SceneNode {
  id: string
  title: string
  at: number
  before: string
  after: string
  note?: string
}
export interface SceneDefinition {
  id: string
  title: string
  kicker: string
  description: string
  duration: number
  background: 'obsidian' | 'graphite'
  viewport: { ratios: SceneRatio[]; focus: 'center' | 'start' }
  document: { kind: string; id: string; rows: { label: string; value: string }[] }
  nodes: SceneNode[]
  events: SceneEvent[]
  disclosure: string
}

export function validateScene(scene: SceneDefinition): string[] {
  const errors: string[] = []
  if (scene.duration <= 0) errors.push('La duración debe ser positiva')
  if (scene.nodes.length < 2) errors.push('La escena necesita al menos dos nodos')
  for (const event of scene.events)
    if (event.at < 0 || event.at > scene.duration)
      errors.push(`Evento ${event.id} fuera de la duración`)
  for (const node of scene.nodes)
    if (node.at < 0 || node.at > scene.duration) errors.push(`Nodo ${node.id} fuera de la duración`)
  return errors
}

export function sceneState(scene: SceneDefinition, timeMs: number) {
  const time = Math.min(scene.duration, Math.max(0, timeMs))
  const activeIndex = scene.nodes.reduce(
    (last, node, index) => (time >= node.at ? index : last),
    -1,
  )
  const first = scene.nodes[0]?.at ?? 0
  const last = scene.nodes.at(-1)?.at ?? scene.duration
  const flowProgress = Math.min(1, Math.max(0, (time - first) / Math.max(1, last - first)))
  return {
    time,
    activeIndex,
    progress: time / scene.duration,
    flowProgress,
    activeEvents: scene.events.filter((event) => event.at <= time),
  }
}
