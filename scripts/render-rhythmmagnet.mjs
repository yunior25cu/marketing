import { copyFile, mkdtemp, rm } from 'node:fs/promises'
import { spawn, spawnSync } from 'node:child_process'
import { join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import ffmpegPath from 'ffmpeg-static'
import { preview } from 'vite'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const renderRoot = join(root, 'renders')
const input = join(root, 'assets/audio/music/bensound-rhythmmagnet.mp3')
const output = join(root, 'renders/facturacion-electronica-uy-01-16x9-rhythmmagnet.mp4')
const sourceStart = 8
const sourceEnd = 20
const duration = sourceEnd - sourceStart
const videoStart = 1
const videoEnd = 11
const fps = 24
const width = 1920
const height = 1080
const frames = duration * fps
const attenuationDb = 1.9
const frameDir = await mkdtemp(join(renderRoot, '.rhythmmagnet-'))

if (!ffmpegPath) throw new Error('FFmpeg no disponible')
if (videoEnd - videoStart !== duration - 2)
  throw new Error('El segmento visual debe ocupar el master sin cambiar sus 10 s originales')
const sourceProbe = spawnSync(ffmpegPath, ['-hide_banner', '-i', input], { encoding: 'utf8' })
const sourceInfo = sourceProbe.stderr ?? ''
const sourceDuration = Number(
  sourceInfo
    .match(/Duration: (\d+):(\d+):(\d+\.\d+)/)
    ?.slice(1)
    .reduce((seconds, part) => seconds * 60 + Number(part), 0) ?? NaN,
)
if (!Number.isFinite(sourceDuration) || sourceDuration < sourceEnd)
  throw new Error(`El archivo fuente no cubre 00:${sourceEnd.toFixed(3)}: ${input}`)

let server
let browser
try {
  server = await preview({ preview: { host: '127.0.0.1', port: 4178 } })
  const address = server.httpServer.address()
  const port = typeof address === 'object' && address ? address.port : 4178
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(
    `http://127.0.0.1:${port}/campaigns/facturacion-electronica-uy-01?render=1&ratio=16%3A9`,
    { waitUntil: 'networkidle' },
  )
  await page.waitForFunction(() => Boolean(window.__BALAXYS_AV_RENDER?.seek))
  await page.waitForFunction(
    () =>
      document.querySelector('[data-render-stage]')?.getAttribute('data-continuity') ===
      'continuous',
  )
  await page.evaluate(() => document.fonts.ready)
  const stage = page.locator('[data-render-stage]')
  const bounds = await stage.boundingBox()
  if (Math.round(bounds?.width ?? 0) !== width || Math.round(bounds?.height ?? 0) !== height)
    throw new Error(`Viewport inválido: ${bounds?.width}×${bounds?.height}`)

  let frozenFrame
  for (let index = 0; index < frames; index++) {
    const framePath = join(frameDir, `${String(index).padStart(5, '0')}.png`)
    if (index >= videoEnd * fps) {
      if (!frozenFrame) {
        await page.evaluate(async (time) => {
          window.__BALAXYS_AV_RENDER.seek(time)
          await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
        }, videoEnd * 1000)
        frozenFrame = join(frameDir, `${String(index).padStart(5, '0')}.png`)
        await stage.screenshot({ path: frozenFrame })
      } else {
        await copyFile(frozenFrame, framePath)
      }
      if (errors.length) throw new Error(`Navegador: ${errors.join('; ')}`)
      continue
    }
    const masterTimeMs = (index * 1000) / fps
    await page.evaluate(async (time) => {
      window.__BALAXYS_AV_RENDER.seek(time)
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
    }, masterTimeMs)
    await stage.screenshot({ path: framePath })
    if (errors.length) throw new Error(`Navegador: ${errors.join('; ')}`)
    if ((index + 1) % fps === 0) process.stdout.write(`Fotogramas ${index + 1}/${frames}\n`)
  }

  const render = spawn(
    ffmpegPath,
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'warning',
      '-framerate',
      String(fps),
      '-start_number',
      '0',
      '-i',
      join(frameDir, '%05d.png'),
      '-ss',
      sourceStart.toFixed(3),
      '-i',
      input,
      '-map',
      '0:v:0',
      '-map',
      '1:a:0',
      '-frames:v',
      String(frames),
      '-t',
      duration.toFixed(3),
      '-vf',
      'setpts=PTS-STARTPTS',
      '-af',
      `atrim=start=0:end=${duration},asetpts=PTS-STARTPTS,volume=-${attenuationDb}dB,aresample=48000`,
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
      '-ar',
      '48000',
      '-movflags',
      '+faststart',
      output,
    ],
    { stdio: 'inherit' },
  )
  const code = await new Promise((done, fail) => {
    render.once('error', fail)
    render.once('exit', done)
  })
  if (code !== 0) throw new Error(`FFmpeg salió con ${code}`)
  process.stdout.write(
    `AV exportado: ${output}; ${width}×${height}, ${fps} fps, ${duration.toFixed(3)} s; source ${sourceStart.toFixed(3)}→${sourceEnd.toFixed(3)} s; gain -${attenuationDb} dB por true peak > 0 dBTP\n`,
  )
} finally {
  if (browser) await browser.close()
  if (server) await new Promise((done) => server.httpServer.close(done))
  if (frameDir.startsWith(renderRoot + sep)) await rm(frameDir, { recursive: true, force: true })
}
