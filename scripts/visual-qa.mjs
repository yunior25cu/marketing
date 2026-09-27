import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { preview } from 'vite'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const campaign = JSON.parse(
  await readFile(join(root, 'campaigns', 'visual-engine-smoke-test', 'campaign.json'), 'utf8'),
)
const output = join(root, '.cache', 'visual-qa', campaign.id)
await mkdir(output, { recursive: true })
const server = await preview({ preview: { host: '127.0.0.1', port: 4179 } })
const address = server.httpServer.address()
const port = typeof address === 'object' && address ? address.port : 4179
let browser
const report = { campaign: campaign.id, checks: [], issues: [] }
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  for (const [ratio, width, height] of [
    ['16:9', 1920, 1080],
    ['9:16', 1080, 1920],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
    const browserErrors = []
    page.on('pageerror', (error) => browserErrors.push(error.message))
    await page.goto(
      `http://127.0.0.1:${port}/campaigns/${campaign.id}?render=1&ratio=${encodeURIComponent(ratio)}`,
      { waitUntil: 'networkidle' },
    )
    await page.waitForFunction(() => Boolean(window.__BALAXYS_AV_RENDER))
    await page.waitForFunction(
      () =>
        document.querySelector('[data-engine]')?.getAttribute('data-visual-ready') === 'true' ||
        document.querySelector('[data-engine]')?.getAttribute('data-engine') === 'canvas-fallback',
    )
    await page.evaluate(() => document.fonts.ready)
    const stage = page.locator('[data-render-stage]')
    const stageBox = await stage.boundingBox()
    if (Math.round(stageBox?.width ?? 0) !== width || Math.round(stageBox?.height ?? 0) !== height)
      report.issues.push(`${ratio}: viewport incorrecto`)
    for (const time of campaign.visualCheckpoints) {
      await page.evaluate(async (ms) => {
        window.__BALAXYS_AV_RENDER.seek(ms)
        await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
      }, time)
      const file = join(output, `${ratio.replace(':', 'x')}-${time}.png`)
      await stage.screenshot({ path: file, animations: 'disabled' })
      const boxes = await page
        .locator('.advanced-stage__headline, .advanced-stage__nodes, .advanced-stage__footer')
        .evaluateAll((items) =>
          items.map((item) => {
            const box = item.getBoundingClientRect()
            return {
              name: item.className,
              x: box.x,
              y: box.y,
              right: box.right,
              bottom: box.bottom,
            }
          }),
        )
      for (const box of boxes)
        if (box.x < 0 || box.y < 0 || box.right > width || box.bottom > height)
          report.issues.push(`${ratio} @ ${time}: ${box.name} fuera del viewport`)
      const active = await page.locator('.advanced-stage__nodes .is-active').count()
      const visualOverflow = await page
        .locator('.advanced-stage__spatial')
        .getAttribute('data-visual-overflow')
      if (visualOverflow === 'true')
        report.issues.push(`${ratio} @ ${time}: geometría 3D fuera del viewport`)
      const drawCalls = Number(
        await page.locator('.advanced-stage__spatial').getAttribute('data-draw-calls'),
      )
      const triangles = Number(
        await page.locator('.advanced-stage__spatial').getAttribute('data-triangles'),
      )
      if (drawCalls > 12 || triangles > 10000)
        report.issues.push(
          `${ratio} @ ${time}: presupuesto WebGL excedido (${drawCalls} calls, ${triangles} triángulos)`,
        )
      const expected = time < 1600 ? 1 : time < 3200 ? 2 : time < 4800 ? 3 : 4
      if (active !== expected)
        report.issues.push(`${ratio} @ ${time}: nodos activos ${active}, esperados ${expected}`)
      report.checks.push({
        ratio,
        time,
        file,
        active,
        drawCalls,
        triangles,
        phase:
          campaign.storyboard.find((phase) => time >= phase.from && time < phase.to)?.id ?? 'close',
      })
    }
    report.issues.push(...browserErrors.map((message) => `${ratio}: ${message}`))
    await page.close()
  }
  const noWebGL = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  await noWebGL.addInitScript(() => {
    const original = window.HTMLCanvasElement.prototype.getContext
    window.HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
      if (kind === 'webgl2') return null
      return original.call(this, kind, ...args)
    }
  })
  await noWebGL.goto(`http://127.0.0.1:${port}/campaigns/${campaign.id}?render=1&t=4800`, {
    waitUntil: 'networkidle',
  })
  const fallbackEngine = await noWebGL
    .locator('.advanced-stage__spatial')
    .getAttribute('data-engine')
  if (fallbackEngine !== 'canvas-fallback') report.issues.push('Fallback sin WebGL no activado')
  await noWebGL
    .locator('[data-render-stage]')
    .screenshot({ path: join(output, 'fallback-no-webgl.png') })
  await noWebGL.close()
  const reducedPage = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    reducedMotion: 'reduce',
  })
  await reducedPage.goto(`http://127.0.0.1:${port}/campaigns/${campaign.id}?render=1`, {
    waitUntil: 'networkidle',
  })
  if (
    (await reducedPage.locator('.advanced-stage__spatial').getAttribute('data-engine')) !==
    'canvas-fallback'
  )
    report.issues.push('Fallback reduced motion no activado')
  if ((await reducedPage.locator('.advanced-stage__nodes .is-active').count()) !== 4)
    report.issues.push('Reduced motion no conserva estado final')
  await reducedPage
    .locator('[data-render-stage]')
    .screenshot({ path: join(output, 'fallback-reduced-motion.png') })
  await reducedPage.close()
  report.fallbacks = { noWebGL: fallbackEngine, reducedMotion: 'canvas-fallback' }
  await writeFile(join(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
  process.stdout.write(
    `Visual QA: ${report.checks.length} checkpoints; ${report.issues.length} problemas. ${output}\n`,
  )
  if (report.issues.length) {
    process.stderr.write(`${report.issues.join('\n')}\n`)
    process.exitCode = 1
  }
} finally {
  if (browser) await browser.close()
  await new Promise((done) => server.httpServer.close(done))
}
