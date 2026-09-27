import { spawnSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpegPath from 'ffmpeg-static'
import { advancedAudioTimeline, audioStats, continuousAudioTimeline } from './audio-core.mjs'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const input = resolve(root, process.argv[2] ?? 'renders/visual-engine-smoke-test-16x9-av.mp4')
const continuous = process.argv.includes('--continuous')
const timeline = continuous ? continuousAudioTimeline : advancedAudioTimeline
const expectedDuration = timeline.duration / 1000
const probe = spawnSync(ffmpegPath, ['-hide_banner', '-i', input], { encoding: 'utf8' })
const text = probe.stderr ?? ''
const duration = Number(
  text
    .match(/Duration: (\d+):(\d+):(\d+\.\d+)/)
    ?.slice(1)
    .reduce((seconds, part) => seconds * 60 + Number(part), 0) ?? NaN,
)
const videoTracks = (text.match(/Stream #0:\d+.*Video:/g) ?? []).length
const audioTracks = (text.match(/Stream #0:\d+.*Audio:/g) ?? []).length
const decode = spawnSync(
  ffmpegPath,
  [
    '-v',
    'error',
    '-i',
    input,
    '-map',
    '0:a:0',
    '-f',
    'f32le',
    '-ac',
    '1',
    '-ar',
    '48000',
    'pipe:1',
  ],
  { maxBuffer: 16 * 1024 * 1024 },
)
if (decode.status !== 0)
  throw new Error(`No se pudo decodificar audio: ${decode.stderr?.toString()}`)
const raw = decode.stdout
const samples = new Float32Array(raw.length / 4)
for (let index = 0; index < samples.length; index++) samples[index] = raw.readFloatLE(index * 4)
const stats = audioStats(samples, 48000)
function rmsAround(ms, windowMs = 100) {
  const start = Math.max(0, Math.round((ms / 1000) * 48000))
  const end = Math.min(samples.length, start + Math.round((windowMs / 1000) * 48000))
  let squares = 0
  for (let index = start; index < end; index++) squares += samples[index] ** 2
  return Math.sqrt(squares / Math.max(1, end - start))
}
const cueChecks = timeline.cues.map((cue) => ({
  id: cue.id,
  at: cue.at,
  rms: rmsAround(cue.at + 30),
}))
const issues = []
if (videoTracks !== 1 || audioTracks !== 1)
  issues.push(`pistas video/audio: ${videoTracks}/${audioTracks}`)
if (Math.abs(duration - expectedDuration) > 0.05) issues.push(`duración contenedor: ${duration}`)
if (Math.abs(stats.duration - expectedDuration) > 0.05)
  issues.push(`duración audio: ${stats.duration}`)
if (stats.clipped || stats.peak > 0.99) issues.push(`peak/clipping: ${stats.peak}`)
if (stats.rms < 0.002) issues.push('Audio casi silencioso')
for (const cue of cueChecks) if (cue.rms < 0.025) issues.push(`Cue inaudible: ${cue.id}`)
if (rmsAround(expectedDuration * 1000 - 100) > 0.03)
  issues.push('Audio final demasiado alto; revisar fade')
const report = {
  file: input,
  duration,
  videoTracks,
  audioTracks,
  ...stats,
  cueChecks,
  syncStatus: issues.length ? 'FAIL' : 'PASS',
  issues,
}
const output = join(root, '.cache', 'av-qa')
await mkdir(output, { recursive: true })
await writeFile(join(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
if (issues.length) process.exitCode = 1
