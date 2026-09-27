import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import ffmpegPath from 'ffmpeg-static'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const videoPath = resolve(
  root,
  process.argv[2] ?? 'renders/facturacion-electronica-uy-01-16x9-rhythmmagnet.mp4',
)
const sourcePath = resolve(root, 'assets/audio/music/bensound-rhythmmagnet.mp3')
const lockPath = resolve(root, 'campaigns/facturacion-electronica-uy-01/audio-lock.json')
const manifestPath = resolve(root, 'assets/audio/manifest.json')
const issues = []
const probe = spawnSync(ffmpegPath, ['-hide_banner', '-i', videoPath], { encoding: 'utf8' })
const probeText = probe.stderr ?? ''
const durationParts = probeText.match(/Duration: (\d+):(\d+):(\d+\.\d+)/)?.slice(1)
const duration = durationParts?.reduce((seconds, part) => seconds * 60 + Number(part), 0) ?? NaN
const videoTracks = [...probeText.matchAll(/Stream #0:\d+.*Video:/g)]
const audioStreams = [...probeText.matchAll(/Stream #0:\d+.*Audio:\s*([^,\s]+)/g)]
const videoShape = probeText.match(/Video:.*?(\d{3,5})x(\d{3,5}).*?(\d+(?:\.\d+)?) fps/)
const audioInfo = probeText.match(/Audio:.*?(\d{4,6}) Hz,\s*(mono|stereo)/)

if (Math.abs(duration - 12) > 0.02) issues.push(`Duración master inválida: ${duration}`)
if (videoTracks.length !== 1) issues.push(`Pistas de video: ${videoTracks.length}`)
if (audioStreams.length !== 1) issues.push(`Pistas de audio: ${audioStreams.length}`)
if (!videoShape || Number(videoShape[1]) !== 1920 || Number(videoShape[2]) !== 1080)
  issues.push('El video no es 1920×1080')
if (!/24 fps/.test(probeText)) issues.push('El video no es 24 fps')
if (!audioInfo || Number(audioInfo[1]) !== 48000) issues.push('El audio no está a 48 kHz')

const loudness = spawnSync(
  ffmpegPath,
  ['-hide_banner', '-nostats', '-i', videoPath, '-af', 'ebur128=peak=true', '-f', 'null', '-'],
  { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 },
)
const loudnessText = loudness.stderr ?? ''
const lastValue = (pattern) => {
  const matches = [...loudnessText.matchAll(pattern)]
  return matches.length ? Number(matches.at(-1)[1]) : null
}
const integratedLufs = lastValue(/\bI:\s*(-?\d+(?:\.\d+)?)\s+LUFS/g)
const truePeakDbtp = lastValue(/Peak:\s*(-?\d+(?:\.\d+)?)\s*dBFS/g)
if (truePeakDbtp == null || truePeakDbtp > 0)
  issues.push(`True peak fuera de rango: ${truePeakDbtp}`)

const decoded = spawnSync(
  ffmpegPath,
  [
    '-v',
    'error',
    '-i',
    videoPath,
    '-map',
    '0:a:0',
    '-f',
    'f32le',
    '-ac',
    '2',
    '-ar',
    '48000',
    'pipe:1',
  ],
  { maxBuffer: 32 * 1024 * 1024 },
)
if (decoded.status !== 0) throw new Error(`No se pudo decodificar audio: ${decoded.stderr}`)
const samples = new Float32Array(decoded.stdout.length / 4)
for (let index = 0; index < samples.length; index++)
  samples[index] = decoded.stdout.readFloatLE(index * 4)
const frameCount = samples.length / 2
let samplePeak = 0
for (const value of samples) samplePeak = Math.max(samplePeak, Math.abs(value))
const rms = (startSeconds, durationSeconds) => {
  const start = Math.max(0, Math.floor(startSeconds * 48000)) * 2
  const end = Math.min(frameCount, Math.floor((startSeconds + durationSeconds) * 48000)) * 2
  let squares = 0
  for (let index = start; index < end; index++) squares += samples[index] ** 2
  return Math.sqrt(squares / Math.max(1, end - start))
}
const beforeVideoRms = rms(0.1, 0.1)
const afterVideoRms = rms(11.1, 0.1)
if (samplePeak >= 1) issues.push(`Clipping de muestras: peak=${samplePeak}`)
if (beforeVideoRms < 0.001) issues.push('No hay música antes del inicio visual')
if (afterVideoRms < 0.001) issues.push('No hay música después del final visual')

const rawFrameAt = (seconds) => {
  const frameIndex = Math.round(seconds * 24)
  const frame = spawnSync(
    ffmpegPath,
    [
      '-v',
      'error',
      '-i',
      videoPath,
      '-vf',
      `select=eq(n\\,${frameIndex})`,
      '-fps_mode',
      'passthrough',
      '-frames:v',
      '1',
      '-f',
      'rawvideo',
      '-pix_fmt',
      'rgb24',
      'pipe:1',
    ],
    { maxBuffer: 16 * 1024 * 1024 },
  )
  if (frame.status !== 0) throw new Error(`No se pudo inspeccionar el frame ${seconds}s`)
  return frame.stdout
}
const preRoll = rawFrameAt(0.5)
const firstVisual = rawFrameAt(1.25)
const finalHoldA = rawFrameAt(11.25)
const finalHoldB = rawFrameAt(11.75)
const preRollColor = [preRoll[0], preRoll[1], preRoll[2]]
let holdDifferenceSum = 0
let pixelsWithVisibleDifference = 0
let maxHoldDifference = 0
for (let index = 0; index < finalHoldA.length; index += 3) {
  const difference = Math.max(
    Math.abs(finalHoldA[index] - finalHoldB[index]),
    Math.abs(finalHoldA[index + 1] - finalHoldB[index + 1]),
    Math.abs(finalHoldA[index + 2] - finalHoldB[index + 2]),
  )
  holdDifferenceSum +=
    Math.abs(finalHoldA[index] - finalHoldB[index]) +
    Math.abs(finalHoldA[index + 1] - finalHoldB[index + 1]) +
    Math.abs(finalHoldA[index + 2] - finalHoldB[index + 2])
  maxHoldDifference = Math.max(maxHoldDifference, difference)
  if (difference > 5) pixelsWithVisibleDifference++
}
const holdMeanDifference = holdDifferenceSum / finalHoldA.length
const holdVisibleDifferenceRate = pixelsWithVisibleDifference / (finalHoldA.length / 3)
const finalHoldStable = holdMeanDifference <= 0.25 && holdVisibleDifferenceRate <= 0.01
const colors = new Set()
for (let index = 0; index < preRoll.length; index += 3)
  colors.add(`${preRoll[index]},${preRoll[index + 1]},${preRoll[index + 2]}`)
if (colors.size > 8)
  issues.push(`El preroll no es un fondo Obsidian vacío (${colors.size} colores)`)
if (preRollColor.some((channel, index) => Math.abs(channel - [11, 13, 14][index]) > 2))
  issues.push(`El preroll no usa Obsidian #0B0D0E: ${preRollColor.join(',')}`)
if (!finalHoldStable) issues.push('El frame final no se mantiene durante el segundo de salida')
if (
  createHash('sha256').update(firstVisual).digest('hex') ===
  createHash('sha256').update(preRoll).digest('hex')
)
  issues.push('El video no aparece en el master al segundo 1')

const [sourceBytes, lock, manifest] = await Promise.all([
  readFile(sourcePath),
  readFile(lockPath, 'utf8').then(JSON.parse),
  readFile(manifestPath, 'utf8').then(JSON.parse),
])
const sha256 = createHash('sha256').update(sourceBytes).digest('hex')
const current = lock.versions
const asset = manifest.pendingAssets?.find((item) => item.id === 'bensound-rhythm-magnet')
if (current.length !== 1 || current[0].version !== '2.2')
  issues.push('Hay más de una versión de audio activa')
if (!asset || asset.sha256 !== sha256 || current[0]?.sha256 !== sha256)
  issues.push('Hash de la música no coincide con la fuente bloqueada')
if (current[0]?.sourceStartMs !== 8000 || current[0]?.sourceEndMs !== 20000)
  issues.push('El lock no fija el rango 08.000–20.000')
if (current[0]?.gainDb !== -1.9) issues.push('La atenuación aplicada no coincide con el audio lock')

const report = {
  file: videoPath,
  duration,
  video: {
    tracks: videoTracks.length,
    width: Number(videoShape?.[1]),
    height: Number(videoShape?.[2]),
    fps: 24,
    sourceVideoMasterStart: 1,
    sourceVideoMasterEnd: 11,
    prerollBackgroundColors: colors.size,
    prerollRGB: preRollColor,
    finalHoldStable,
    finalHoldMeanPixelDifference: holdMeanDifference,
    finalHoldVisibleDifferenceRate: holdVisibleDifferenceRate,
    finalHoldMaxChannelDifference: maxHoldDifference,
  },
  audio: {
    tracks: audioStreams.length,
    codec: audioStreams[0]?.[1],
    sampleRate: Number(audioInfo?.[1]),
    channels: audioInfo?.[2],
    source: 'bensound-rhythmmagnet.mp3',
    sourceRange: '00:08.000–00:20.000',
    sourceStartAtMaster: 0,
    integratedLufs,
    truePeakDbtp,
    samplePeak,
    clipped: samplePeak >= 1,
    rmsBeforeVideo: beforeVideoRms,
    rmsAfterVideo: afterVideoRms,
    sfx: 0,
    ambience: 0,
    gainDb: -1.9,
  },
  licenseClearance: current[0]?.licenseStatus ?? 'MISSING',
  technicalStatus: issues.length ? 'FAIL' : 'PASS',
  issues,
}
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
if (issues.length) process.exitCode = 1
