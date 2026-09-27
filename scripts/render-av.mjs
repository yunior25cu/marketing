import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import ffmpegPath from 'ffmpeg-static'
import { preview } from 'vite'
import {
  advancedAudioTimeline,
  audioStats,
  continuousAudioTimeline,
  encodeWav,
  renderAudio,
  validateAudioTimeline,
} from './audio-core.mjs'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const renderRoot = join(root, 'renders')
const options = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=')
    return [key, value ?? true]
  }),
)
const campaign = options.campaign ?? 'visual-engine-smoke-test'
if (!['visual-engine-smoke-test', 'continuous-motion-smoke-test'].includes(campaign))
  throw new Error('Campaña no disponible para exportación AV')
const isContinuous = campaign === 'continuous-motion-smoke-test'
const durationSeconds = isContinuous ? 10 : 8
const audioTimeline = isContinuous ? continuousAudioTimeline : advancedAudioTimeline
const ratio = options.ratio ?? '16:9'
const sizes = { '16:9': [1920, 1080], '9:16': [1080, 1920] }
if (!(ratio in sizes)) throw new Error('Ratio no disponible para esta campaña')
const fps = Number(options.fps ?? 24)
if (!Number.isInteger(fps) || fps < 1 || fps > 60) throw new Error('FPS inválido')
const issues = validateAudioTimeline(audioTimeline)
if (issues.length) throw new Error(issues.join('; '))
if (!ffmpegPath) throw new Error('FFmpeg no disponible')
const [width, height] = sizes[ratio]
const output = resolve(
  root,
  String(options.out ?? join('renders', `${campaign}-${ratio.replace(':', 'x')}-av.mp4`)),
)
if (!output.startsWith(root + sep)) throw new Error('La salida debe estar dentro del proyecto')
await mkdir(resolve(output, '..'), { recursive: true })
await mkdir(renderRoot, { recursive: true })
const frameDir = await mkdtemp(join(renderRoot, '.av-frames-'))
const master = join(frameDir, 'master.wav')
const samples = renderAudio(audioTimeline)
const stats = audioStats(samples, 48000)
if (stats.clipped || Math.abs(stats.duration - durationSeconds) > 0.001)
  throw new Error('Audio inválido')
await writeFile(master, encodeWav(samples))
if (options.wav) {
  const wavPath = resolve(root, String(options.wav))
  if (!wavPath.startsWith(root + sep)) throw new Error('WAV fuera del proyecto')
  await mkdir(resolve(wavPath, '..'), { recursive: true })
  await writeFile(wavPath, encodeWav(samples))
}
if (options.stems) {
  const stemDir = resolve(root, String(options.stems))
  if (!stemDir.startsWith(root + sep)) throw new Error('Stems fuera del proyecto')
  await mkdir(stemDir, { recursive: true })
  for (const mode of ['sfx', 'ambience'])
    await writeFile(join(stemDir, `${mode}.wav`), encodeWav(renderAudio(audioTimeline, { mode })))
}
const server = await preview({ preview: { host: '127.0.0.1', port: 4178 } })
const address = server.httpServer.address()
const port = typeof address === 'object' && address ? address.port : 4178
let browser
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(
    `http://127.0.0.1:${port}/campaigns/${campaign}?render=1&ratio=${encodeURIComponent(ratio)}`,
    { waitUntil: 'networkidle' },
  )
  await page.waitForFunction(() => Boolean(window.__BALAXYS_AV_RENDER))
  await page.waitForFunction(
    () =>
      document.querySelector('[data-render-stage]')?.getAttribute('data-continuity') ===
        'continuous' ||
      document.querySelector('[data-engine]')?.getAttribute('data-visual-ready') === 'true' ||
      document.querySelector('[data-engine]')?.getAttribute('data-engine') === 'canvas-fallback',
  )
  await page.evaluate(() => document.fonts.ready)
  const stage = page.locator('[data-render-stage]')
  const bounds = await stage.boundingBox()
  if (Math.round(bounds?.width ?? 0) !== width || Math.round(bounds?.height ?? 0) !== height)
    throw new Error(`Viewport inválido: ${bounds?.width}×${bounds?.height}`)
  const frames = durationSeconds * fps
  for (let index = 0; index < frames; index++) {
    await page.evaluate(
      async (ms) => {
        window.__BALAXYS_AV_RENDER.seek(ms)
        await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
      },
      (index * 1000) / fps,
    )
    await stage.screenshot({
      path: join(frameDir, `${String(index).padStart(5, '0')}.png`),
      animations: 'disabled',
    })
    if (errors.length) throw new Error(`Navegador: ${errors.join('; ')}`)
    if ((index + 1) % fps === 0)
      process.stdout.write(`Capturados ${(index + 1) / fps}/${durationSeconds} s\n`)
  }
  await new Promise((done, fail) => {
    const child = spawn(
      ffmpegPath,
      [
        '-y',
        '-framerate',
        String(fps),
        '-start_number',
        '0',
        '-i',
        join(frameDir, '%05d.png'),
        '-i',
        master,
        '-frames:v',
        String(frames),
        '-t',
        String(durationSeconds),
        '-c:v',
        'libx264',
        '-preset',
        'medium',
        '-crf',
        '19',
        '-pix_fmt',
        'yuv420p',
        '-c:a',
        'aac',
        '-b:a',
        '192k',
        '-af',
        `atrim=0:${durationSeconds}`,
        '-movflags',
        '+faststart',
        output,
      ],
      { stdio: 'inherit' },
    )
    child.once('error', fail)
    child.once('exit', (code) =>
      code === 0 ? done() : fail(new Error(`FFmpeg salió con ${code}`)),
    )
  })
  process.stdout.write(
    `AV exportado: ${output}; ${width}×${height}, ${fps} fps, ${durationSeconds} s; audio peak=${stats.peak.toFixed(3)}\n`,
  )
} finally {
  if (browser) await browser.close()
  await new Promise((done) => server.httpServer.close(done))
  if (frameDir.startsWith(renderRoot + sep)) await rm(frameDir, { recursive: true, force: true })
}
