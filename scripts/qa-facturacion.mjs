/* global Image, setTimeout, clearTimeout, performance, cancelAnimationFrame, navigator */
import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { preview } from 'vite'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const campaign = 'facturacion-electronica-uy-01'
const output = join(root, '.cache', 'facturacion-qa')
const checkpoints = [
  350, 1400, 2000, 2150, 2900, 3750, 4450, 4900, 5350, 6050, 6150, 6700, 7600, 8500, 8850, 9200,
  9999,
]
const formats = [
  ['16:9', 1920, 1080],
  ['9:16', 1080, 1920],
  ['4:5', 1080, 1350],
  ['1:1', 1080, 1080],
]
const persistentObjects = ['fiscal-plane', 'document', 'operational-links', 'resolution']
const report = {
  campaign,
  generatedAt: new Date().toISOString(),
  scope:
    'Technical snapshots, deterministic seek, reduced motion and browser frame intervals. No artistic approval.',
  captures: [],
  determinism: [],
  reducedMotion: [],
  performance: [],
  issues: [],
  antialiasPixelTolerance: 32,
}
await mkdir(output, { recursive: true })
const server = await preview({ preview: { host: '127.0.0.1', port: 4182, strictPort: true } })
const base = 'http://127.0.0.1:4182'
let browser

async function seek(page, time) {
  await page.evaluate(async (position) => {
    window.__BALAXYS_AV_RENDER.seek(position)
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
  }, time)
}

async function differingPixels(page, first, second) {
  if (first.equals(second)) return 0
  return page.evaluate(
    async ({ a, b }) => {
      const decode = (source) =>
        new Promise((resolveImage, reject) => {
          const image = new Image()
          const timeout = setTimeout(() => reject(new Error('PNG decode timed out')), 5000)
          image.onload = () => {
            clearTimeout(timeout)
            resolveImage(image)
          }
          image.onerror = () => {
            clearTimeout(timeout)
            reject(new Error('PNG decode failed'))
          }
          image.src = `data:image/png;base64,${source}`
        })
      const [left, right] = await Promise.all([decode(a), decode(b)])
      if (left.width !== right.width || left.height !== right.height) return Number.MAX_SAFE_INTEGER
      const canvas = document.createElement('canvas')
      canvas.width = left.width
      canvas.height = left.height
      const context = canvas.getContext('2d', { willReadFrequently: true })
      context.drawImage(left, 0, 0)
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(right, 0, 0)
      const repeated = context.getImageData(0, 0, canvas.width, canvas.height).data
      let changes = 0
      for (let index = 0; index < pixels.length; index += 4)
        if ([0, 1, 2, 3].some((channel) => pixels[index + channel] !== repeated[index + channel]))
          changes++
      return changes
    },
    { a: first.toString('base64'), b: second.toString('base64') },
  )
}

function observeErrors(page, ratio, mode) {
  page.on('pageerror', (error) => report.issues.push(`${ratio}/${mode}: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error')
      report.issues.push(`${ratio}/${mode}: console: ${message.text()}`)
  })
  page.setDefaultTimeout(20000)
  page.setDefaultNavigationTimeout(30000)
}

try {
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  for (const [ratio, width, height] of formats) {
    process.stdout.write(`Facturacion QA: ${ratio}\n`)
    const stem = ratio.replace(':', 'x')
    const route = `${base}/campaigns/${campaign}?render=1&ratio=${encodeURIComponent(ratio)}`
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
    observeErrors(page, ratio, 'render')
    await page.goto(route, { waitUntil: 'networkidle' })
    await page.waitForFunction(() => Boolean(window.__BALAXYS_AV_RENDER?.seek))
    await page.evaluate(() => document.fonts.ready)
    const stage = page.locator('[data-render-stage]')
    const box = await stage.boundingBox()
    if (Math.round(box?.width ?? 0) !== width || Math.round(box?.height ?? 0) !== height)
      report.issues.push(`${ratio}: expected ${width}x${height}, got ${box?.width}x${box?.height}`)
    const originalObjects = await page.evaluateHandle(() => [
      ...document.querySelectorAll('[data-object]'),
    ])
    const objectNames = await page
      .locator('[data-object]')
      .evaluateAll((elements) => elements.map((element) => element.getAttribute('data-object')))
    for (const name of persistentObjects)
      if (!objectNames.includes(name))
        report.issues.push(`${ratio}: missing persistent object ${name}`)

    for (const time of checkpoints) {
      await seek(page, time)
      const persistent = await page.evaluate(
        (objects) =>
          objects.every((element) => element.isConnected) &&
          document.querySelectorAll('[data-object]').length === objects.length,
        originalObjects,
      )
      if (!persistent)
        report.issues.push(`${ratio}/${time}: persistent object replaced or unmounted`)
      const path = join(output, `${stem}-${time}.png`)
      const screenshot = await stage.screenshot({ path, animations: 'disabled' })
      report.captures.push({
        ratio,
        timeMs: time,
        path,
        persistentObjects: objectNames,
        persistent,
      })
      if ([2000, 5350, 8500, 9999].includes(time)) {
        await seek(page, time < 5000 ? 9400 : 300)
        await seek(page, time)
        const repeat = await stage.screenshot({ animations: 'disabled' })
        const changedPixels = await differingPixels(page, screenshot, repeat)
        report.determinism.push({ ratio, timeMs: time, changedPixels })
        if (changedPixels > report.antialiasPixelTolerance) {
          await writeFile(join(output, `${stem}-${time}-repeat.png`), repeat)
          report.issues.push(`${ratio}/${time}: non-deterministic seek (${changedPixels} pixels)`)
        }
      }
    }
    await originalObjects.dispose()
    await page.close()

    const reduced = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    })
    observeErrors(reduced, ratio, 'reduced')
    await reduced.goto(route, { waitUntil: 'networkidle' })
    await reduced.waitForFunction(() => Boolean(window.__BALAXYS_AV_RENDER?.seek))
    await reduced.evaluate(() => document.fonts.ready)
    await seek(reduced, 0)
    const reducedStage = reduced.locator('[data-render-stage]')
    const staticFrame = await reducedStage.screenshot({
      path: join(output, `${stem}-reduced.png`),
      animations: 'disabled',
    })
    for (const time of [3750, 10000]) {
      await seek(reduced, time)
      const changedPixels = await differingPixels(
        reduced,
        staticFrame,
        await reducedStage.screenshot({ animations: 'disabled' }),
      )
      report.reducedMotion.push({ ratio, timeMs: time, changedPixels })
      if (changedPixels > report.antialiasPixelTolerance)
        report.issues.push(`${ratio}: reduced motion changes after seek ${time}`)
    }
    await reduced.goto(`${base}/campaigns/${campaign}?ratio=${encodeURIComponent(ratio)}`, {
      waitUntil: 'networkidle',
    })
    if (!(await reduced.getByRole('button', { name: 'Reproducir', exact: true }).isDisabled()))
      report.issues.push(`${ratio}: reduced motion play control remains enabled`)
    await reduced.close()

    // One page at a time: simultaneous captures would distort playback measurements.
    const playback = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
    observeErrors(playback, ratio, 'playback')
    await playback.goto(`${base}/campaigns/${campaign}?ratio=${encodeURIComponent(ratio)}`, {
      waitUntil: 'networkidle',
    })
    await playback.evaluate(() => document.fonts.ready)
    await playback.getByRole('button', { name: 'Reproducir', exact: true }).click()
    await playback.getByRole('button', { name: 'Pausar', exact: true }).waitFor()
    const metrics = await playback.evaluate(
      () =>
        new Promise((resolveMetrics) => {
          const start = performance.now()
          const intervals = []
          let previous
          let frameId
          const finish = (timedOut) => {
            cancelAnimationFrame(frameId)
            clearTimeout(timeout)
            const sorted = [...intervals].sort((a, b) => a - b)
            const meanMs =
              intervals.reduce((sum, interval) => sum + interval, 0) / Math.max(1, intervals.length)
            resolveMetrics({
              measuredMs: performance.now() - start,
              sampleCount: intervals.length,
              meanMs,
              approximateFps: meanMs ? 1000 / meanMs : 0,
              p95Ms: sorted[Math.floor((sorted.length - 1) * 0.95)] ?? 0,
              maxMs: sorted.at(-1) ?? 0,
              intervalsOver33Ms: intervals.filter((interval) => interval > 33.34).length,
              timedOut,
              userAgent: navigator.userAgent,
            })
          }
          const timeout = setTimeout(() => finish(true), 12000)
          const frame = (now) => {
            if (previous !== undefined) intervals.push(now - previous)
            previous = now
            if (now - start >= 9500) finish(false)
            else frameId = requestAnimationFrame(frame)
          }
          frameId = requestAnimationFrame(frame)
        }),
    )
    report.performance.push({
      ratio,
      ...metrics,
      method:
        'rAF intervals during actual preview playback; headless local Chrome; not GPU frame-render duration or a device guarantee',
    })
    if (metrics.timedOut || metrics.sampleCount < 20)
      report.issues.push(`${ratio}: playback frame sampling failed`)
    await playback
      .getByRole('button', { name: 'Reproducir', exact: true })
      .waitFor({ timeout: 5000 })
    const finalTime = await playback.getByLabel('Posición de la campaña').inputValue()
    if (Number(finalTime) !== 10000)
      report.issues.push(`${ratio}: playback ended at ${finalTime} ms`)
    await playback.close()
  }
} catch (error) {
  report.issues.push(error.stack ?? error.message)
} finally {
  if (browser) await browser.close()
  server.httpServer.closeAllConnections()
  await new Promise((done) => server.httpServer.close(done))
  report.status = report.issues.length ? 'FAIL' : 'PASS'
  await writeFile(join(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
}
process.stdout.write(
  `Facturacion technical QA: ${report.captures.length} captures; ${report.issues.length} issues; ${report.status}\n`,
)
if (report.issues.length) process.exitCode = 1
