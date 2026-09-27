export type SemanticTransition =
  | 'MORPH'
  | 'CARRY'
  | 'REVEAL'
  | 'CONTINUATION'
  | 'MATCH'
  | 'SPLIT'
  | 'MERGE'
  | 'CAMERA_DISCOVERY'
  | 'MASK_TRANSITION'
  | 'TYPOGRAPHIC_TRANSFORMATION'

export interface CameraKeyframe {
  at: number
  x: number
  y: number
  scale: number
  rotation?: number
  focus?: number
  depth?: number
}

export interface CameraState extends Omit<CameraKeyframe, 'at'> {
  rotation: number
  focus: number
  depth: number
}

export interface MotionBeat {
  id: string
  from: number
  to: number
  label: string
  persistentObjects: string[]
  transformation: string
  camera: string
  transition: SemanticTransition
  audioCue?: string
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const smooth = (value: number) => value * value * (3 - 2 * value)

export function interpolate(from: number, to: number, progress: number) {
  return from + (to - from) * clamp(progress, 0, 1)
}

export function cameraAt(keyframes: CameraKeyframe[], timeMs: number): CameraState {
  if (!keyframes.length) return { x: 0, y: 0, scale: 1, rotation: 0, focus: 0, depth: 0 }
  const time = clamp(timeMs, keyframes[0].at, keyframes.at(-1)!.at)
  let index = keyframes.findIndex((frame) => frame.at >= time)
  if (index < 0) index = keyframes.length - 1
  const before = keyframes[Math.max(0, index - 1)]
  const after = keyframes[index]
  const progress = before === after ? 1 : smooth((time - before.at) / (after.at - before.at))
  return {
    x: interpolate(before.x, after.x, progress),
    y: interpolate(before.y, after.y, progress),
    scale: interpolate(before.scale, after.scale, progress),
    rotation: interpolate(before.rotation ?? 0, after.rotation ?? 0, progress),
    focus: interpolate(before.focus ?? 0, after.focus ?? 0, progress),
    depth: interpolate(before.depth ?? 0, after.depth ?? 0, progress),
  }
}

export function cameraCssTransform(state: CameraState) {
  return `translate3d(${state.x}%, ${state.y}%, ${state.depth * 80}px) scale(${state.scale}) rotate(${state.rotation}deg)`
}

export function canvasCameraPose(state: CameraState, viewport: { width: number; height: number }) {
  return {
    x: viewport.width * (0.5 + state.x / 100),
    y: viewport.height * (0.5 + state.y / 100),
    scale: state.scale,
    rotation: (state.rotation * Math.PI) / 180,
    depth: state.depth,
    focus: state.focus,
  }
}

export function threeCameraPose(state: CameraState, baseDistance = 11.5) {
  return {
    x: state.x,
    y: state.y,
    z: baseDistance / Math.max(0.1, state.scale) + state.depth,
    targetX: state.focus,
    targetY: 0,
    targetZ: 0,
  }
}

export function progressBetween(timeMs: number, from: number, to: number) {
  if (to <= from) return timeMs >= to ? 1 : 0
  return clamp((timeMs - from) / (to - from), 0, 1)
}

export function morphNumber(from: number, to: number, progress: number, decimals = 0) {
  return interpolate(from, to, progress).toFixed(decimals)
}

export interface ContinuityEvidence {
  persistentObjectCount: number
  transformations: number
  cameraChoreography: boolean
  beatCount: number
  fadeAsPrimaryTransitionShare: number
  independentBeatCount: number
  explicitProductDemo?: boolean
}

export function scoreMotionContinuity(evidence: ContinuityEvidence) {
  const failures: string[] = []
  if (evidence.persistentObjectCount < 2) failures.push('Pocos objetos persisten entre beats')
  if (evidence.transformations < Math.max(1, evidence.beatCount - 2))
    failures.push('Los objetos no generan suficientes transformaciones')
  if (evidence.fadeAsPrimaryTransitionShare > 0.35) failures.push('Dependencia excesiva de fades')
  if (evidence.independentBeatCount > Math.ceil(evidence.beatCount / 2))
    failures.push('Los beats se sienten como composiciones independientes')
  if (evidence.beatCount > 1 && !evidence.cameraChoreography)
    failures.push('La cámara no descubre ni reencuadra la composición')
  const status = failures.length >= 3 ? 'FAIL' : failures.length > 0 ? 'NEEDS_REVISION' : 'PASS'
  return { status, failures }
}

export function detectPowerpointPattern(evidence: ContinuityEvidence) {
  const tests = {
    screenshotNarrative: evidence.independentBeatCount >= 5,
    enterWaitExit: evidence.fadeAsPrimaryTransitionShare > 0.5,
    fadeTranslatePrimary: evidence.fadeAsPrimaryTransitionShare > 0.5,
    independentCompositions: evidence.independentBeatCount > Math.ceil(evidence.beatCount / 2),
    objectsGenerateNextBeat: evidence.transformations > 0 && evidence.persistentObjectCount >= 2,
    continuousSeventyPercent: evidence.persistentObjectCount >= 2 && evidence.transformations >= 2,
    animatedInterface: evidence.explicitProductDemo !== true && evidence.independentBeatCount >= 3,
  }
  const highRisk = tests.screenshotNarrative || tests.enterWaitExit || tests.independentCompositions
  const mediumRisk = tests.fadeTranslatePrimary || !tests.objectsGenerateNextBeat
  return {
    tests,
    risk: highRisk ? 'HIGH' : mediumRisk ? 'MEDIUM' : 'LOW',
    status: highRisk ? 'FAIL' : mediumRisk ? 'NEEDS_REVISION' : 'PASS',
  }
}
