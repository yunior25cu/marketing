import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import ffmpegPath from 'ffmpeg-static'
import { preview } from 'vite'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const renderRoot = join(root, 'renders')
const options = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=')
    return [key, value ?? true]
  }),
)
const formats = {
  '16:9': [1920, 1080],
  '1:1': [1080, 1080],
  '4:5': [1080, 1350],
  '9:16': [1080, 1920],
}
const ratio = options.ratio ?? '16:9'
const fps = Number(options.fps ?? 30)
const poster = options.poster === undefined ? null : Number(options.poster)
if (!(ratio in formats)) throw new Error(`Formato inválido: ${ratio}`)
if (!Number.isInteger(fps) || fps < 1 || fps > 60)
  throw new Error('fps debe ser un entero de 1 a 60')
if (poster !== null && (!Number.isFinite(poster) || poster < 0 || poster > 10000))
  throw new Error('poster debe estar entre 0 y 10000 ms')
if (!ffmpegPath && poster === null)
  throw new Error('FFmpeg no está instalado. Ejecutá pnpm install.')

const [width, height] = formats[ratio]
const baseName = `launch-01-${ratio.replace(':', 'x')}`
const output = resolve(
  root,
  String(
    options.out ?? join('renders', `${baseName}${poster === null ? '.mp4' : `-${poster}.png`}`),
  ),
)
if (!output.startsWith(root + sep)) throw new Error('La salida debe estar dentro del proyecto')
await mkdir(resolve(output, '..'), { recursive: true })
await mkdir(renderRoot, { recursive: true })
const frameDir = poster === null ? await mkdtemp(join(renderRoot, '.frames-')) : null
const server = await preview({ preview: { host: '127.0.0.1', port: 4173 } })
const address = server.httpServer.address()
const port = typeof address === 'object' && address ? address.port : 4173
let browser

async function encode(pattern, count) {
  await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(
      ffmpegPath,
      [
        '-y',
        '-framerate',
        String(fps),
        '-start_number',
        '0',
        '-i',
        pattern,
        '-frames:v',
        String(count),
        '-c:v',
        'libx264',
        '-preset',
        'medium',
        '-crf',
        '18',
        '-pix_fmt',
        'yuv420p',
        '-movflags',
        '+faststart',
        output,
      ],
      { stdio: 'inherit' },
    )
    child.once('error', rejectPromise)
    child.once('exit', (code) =>
      code === 0 ? resolvePromise() : rejectPromise(new Error(`FFmpeg salió con código ${code}`)),
    )
  })
}

try {
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(
    `http://127.0.0.1:${port}/campaigns/launch-01?render=1&ratio=${encodeURIComponent(ratio)}`,
    { waitUntil: 'networkidle' },
  )
  await page.waitForFunction(() => Boolean(window.__BALAXYS_RENDER))
  await page.evaluate(() => document.fonts.ready)
  const stage = page.locator('[data-render-stage]')
  const bounds = await stage.boundingBox()
  if (Math.round(bounds?.width ?? 0) !== width || Math.round(bounds?.height ?? 0) !== height)
    throw new Error(
      `Viewport incorrecto: ${bounds?.width}×${bounds?.height}, esperado ${width}×${height}`,
    )

  async function capture(ms, path) {
    await page.evaluate(async (timeMs) => {
      window.__BALAXYS_RENDER.seek(timeMs)
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
    }, ms)
    await stage.screenshot({ path, animations: 'disabled', scale: 'css' })
    const footer = page.locator('.scene-canvas__footer')
    if (await footer.count()) {
      const footerBounds = await footer.boundingBox()
      if (footerBounds && footerBounds.y + footerBounds.height > height) {
        throw new Error(`El pie de escena queda fuera del formato ${ratio}`)
      }
    }
    if (errors.length) throw new Error(`Error del navegador: ${errors.join('; ')}`)
  }

  if (poster !== null) {
    await capture(poster, output)
    process.stdout.write(`Poster: ${output} (${width}×${height}, t=${poster} ms)\n`)
  } else {
    const count = 10 * fps
    for (let i = 0; i < count; i++) {
      await capture((i * 1000) / fps, join(frameDir, `${String(i).padStart(5, '0')}.png`))
      if ((i + 1) % fps === 0) process.stdout.write(`Capturados ${(i + 1) / fps}/10 s\n`)
    }
    await encode(join(frameDir, '%05d.png'), count)
    process.stdout.write(`Video: ${output} (${width}×${height}, ${fps} fps, 10 s)\n`)
  }
} finally {
  if (browser) await browser.close()
  await new Promise((resolvePromise) => server.httpServer.close(resolvePromise))
  if (frameDir && frameDir.startsWith(renderRoot + sep))
    await rm(frameDir, { recursive: true, force: true })
}
