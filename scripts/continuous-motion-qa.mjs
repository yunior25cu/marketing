import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { preview } from 'vite'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const campaignId = 'continuous-motion-smoke-test'
const record = JSON.parse(
  await (
    await import('node:fs/promises')
  ).readFile(join(root, 'campaigns', campaignId, 'campaign.json'), 'utf8'),
)
const output = join(root, '.cache', 'visual-qa', campaignId)
await mkdir(output, { recursive: true })
const server = await preview({ preview: { host: '127.0.0.1', port: 4181 } })
const address = server.httpServer.address()
const port = typeof address === 'object' && address ? address.port : 4181
const report = {
  campaign: campaignId,
  checks: [],
  issues: [],
  deterministicScrub: true,
  deterministicMismatches: [],
  deterministicPixelTolerance: 32,
}
let browser
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  for (const [ratio, width, height] of [
    ['16:9', 1920, 1080],
    ['9:16', 1080, 1920],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(
      `http://127.0.0.1:${port}/campaigns/${campaignId}?render=1&ratio=${encodeURIComponent(ratio)}`,
      { waitUntil: 'networkidle' },
    )
    await page.waitForFunction(() => Boolean(window.__BALAXYS_AV_RENDER))
    await page.evaluate(() => document.fonts.ready)
    const stage = page.locator('[data-render-stage]')
    const box = await stage.boundingBox()
    if (Math.round(box?.width ?? 0) !== width || Math.round(box?.height ?? 0) !== height)
      report.issues.push(`${ratio}: viewport ${box?.width}x${box?.height}`)
    const cameraValues = []
    const persistentCount = await page.locator('[data-persistent]').count()
    for (const point of record.transitionCheckpoints) {
      await page.evaluate(async (time) => {
        window.__BALAXYS_AV_RENDER.seek(time)
        await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
      }, point.at)
      const camera = await stage.evaluate((element) => ({
        x: element.getAttribute('data-camera-x'),
        y: element.getAttribute('data-camera-y'),
        scale: element.getAttribute('data-camera-scale'),
      }))
      cameraValues.push(camera)
      const screenshotPath = join(
        output,
        `${ratio.replace(':', 'x')}-${point.at}-${point.transition}-${point.moment}.png`,
      )
      const shot = await stage.screenshot({ path: screenshotPath, animations: 'disabled' })
      const headline = await page.locator('.continuous-stage__closing').boundingBox()
      if (point.at >= 8000 && (!headline || headline.width === 0 || headline.height === 0))
        report.issues.push(`${ratio} @ ${point.at}: cierre tipográfico sin caja visible`)
      report.checks.push({ ratio, ...point, screenshotPath, camera, persistentCount })
      if (errors.length) report.issues.push(`${ratio}: ${errors.join('; ')}`)
      if ([1100, 3000, 4700, 6800, 8800].includes(point.at)) {
        await page.evaluate(async (time) => {
          window.__BALAXYS_AV_RENDER.seek(time + 23)
          await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
          window.__BALAXYS_AV_RENDER.seek(time)
          await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
        }, point.at)
        const repeated = await stage.screenshot({ animations: 'disabled' })
        const differingPixels = await page.evaluate(
          async ({ first, second }) => {
            const decode = (base64) =>
              new Promise((resolve, reject) => {
                const image = document.createElement('img')
                image.onload = () => resolve(image)
                image.onerror = reject
                image.src = `data:image/png;base64,${base64}`
              })
            const [a, b] = await Promise.all([decode(first), decode(second)])
            const canvas = document.createElement('canvas')
            canvas.width = a.width
            canvas.height = a.height
            const context = canvas.getContext('2d')
            context.drawImage(a, 0, 0)
            const left = context.getImageData(0, 0, canvas.width, canvas.height).data
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.drawImage(b, 0, 0)
            const right = context.getImageData(0, 0, canvas.width, canvas.height).data
            let changed = 0
            for (let index = 0; index < left.length; index += 4)
              if (
                left[index] !== right[index] ||
                left[index + 1] !== right[index + 1] ||
                left[index + 2] !== right[index + 2] ||
                left[index + 3] !== right[index + 3]
              )
                changed++
            return changed
          },
          { first: shot.toString('base64'), second: repeated.toString('base64') },
        )
        if (differingPixels > report.deterministicPixelTolerance) {
          report.deterministicScrub = false
          const repeatPath = join(output, `${ratio.replace(':', 'x')}-${point.at}-repeat.png`)
          await writeFile(repeatPath, repeated)
          report.deterministicMismatches.push({
            ratio,
            time: point.at,
            differingPixels,
            screenshotPath,
            repeatPath,
          })
        }
      }
    }
    if (persistentCount < 7) report.issues.push(`${ratio}: faltan objetos persistentes en el DOM`)
    if (new Set(cameraValues.map((item) => `${item.x}/${item.y}/${item.scale}`)).size < 4)
      report.issues.push(`${ratio}: cámara sin desplazamiento interpolado`)
    await page.close()
  }
} finally {
  if (browser) await browser.close()
  await new Promise((done) => server.httpServer.close(done))
}
if (!report.deterministicScrub) report.issues.push('Scrub no determinista')
report.status = report.issues.length ? 'FAIL' : 'PASS'
await writeFile(
  join(output, 'continuous-motion-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
)
process.stdout.write(
  `Continuous Visual QA: ${report.checks.length} transition captures; ${report.issues.length} issues; ${report.status}\n`,
)
if (report.issues.length) process.exitCode = 1
