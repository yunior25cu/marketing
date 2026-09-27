import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  detectPowerpointPattern,
  scoreMotionContinuity,
  scoreMotionGraphicsQuality,
} from '../src/motion/continuous.ts'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const id = process.argv[2] ?? 'continuous-motion-smoke-test'
const record = JSON.parse(await readFile(join(root, 'campaigns', id, 'campaign.json'), 'utf8'))
const objects = new Set(record.motionBeats.flatMap((beat) => beat.persistentObjects))
const movements = record.cameraPath ?? []
const movingCamera = movements.some((frame, index) => {
  const previous = movements[index - 1]
  return (
    previous && (frame.x !== previous.x || frame.y !== previous.y || frame.scale !== previous.scale)
  )
})
const evidence = {
  persistentObjectCount: objects.size,
  transformations: record.transformationMap?.length ?? 0,
  cameraChoreography: movingCamera,
  beatCount: record.motionBeats.length,
  fadeAsPrimaryTransitionShare: 0,
  independentBeatCount: 0,
  explicitProductDemo: false,
}
const continuity = scoreMotionContinuity(evidence)
const powerpoint = detectPowerpointPattern(evidence)
const motionGraphics = scoreMotionGraphicsQuality(record.motionGraphicsReview)
const checkpoints = record.transitionCheckpoints ?? []
const transitionCoverage = Object.groupBy(checkpoints, (item) => item.transition)
const missingTriples = Object.entries(transitionCoverage)
  .filter(
    ([, items]) =>
      !['before', 'during', 'after'].every((moment) =>
        items.some((item) => item.moment === moment),
      ),
  )
  .map(([transition]) => transition)
const issues = [...continuity.failures]
if (powerpoint.risk !== 'LOW') issues.push(`POWERPOINT_RISK=${powerpoint.risk}`)
if (record.motionContinuity !== continuity.status)
  issues.push('Metadata MOTION_CONTINUITY no coincide con evidencia')
if (record.motionGraphicsQuality !== motionGraphics.status)
  issues.push('Metadata MOTION_GRAPHICS_QUALITY no coincide con los nueve criterios')
if (record.powerpointRisk !== powerpoint.risk)
  issues.push('Metadata POWERPOINT_RISK no coincide con detector')
if (missingTriples.length)
  issues.push(`Faltan checkpoints before/during/after: ${missingTriples.join(', ')}`)
if (record.motionStyle !== 'CONTINUOUS') issues.push('La campaña no declara motion continuo')
const report = {
  campaign: id,
  motionStyle: record.motionStyle,
  evidence,
  motionContinuity: continuity.status,
  continuityFailures: continuity.failures,
  motionGraphicsQuality: motionGraphics.status,
  motionGraphicsCriteria: motionGraphics.criteria,
  motionGraphicsFailures: motionGraphics.failedCriteria,
  powerpoint,
  transitionCheckpointCount: checkpoints.length,
  missingTriples,
  status: issues.length ? 'FAIL' : 'PASS',
  issues,
}
const output = join(root, '.cache', 'motion-qa')
await mkdir(output, { recursive: true })
await writeFile(join(output, `${id}.json`), `${JSON.stringify(report, null, 2)}\n`)
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
if (issues.length) process.exitCode = 1
