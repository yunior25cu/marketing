import { chromium } from 'playwright-core'
import { preview } from 'vite'

const server = await preview({ preview: { host: '127.0.0.1', port: 4180 } })
const address = server.httpServer.address()
const port = typeof address === 'object' && address ? address.port : 4180
let browser
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const paths = ['/', '/lab', '/campaigns/launch-01', '/lab/campaigns/visual-engine-smoke-test']
  for (const path of paths) {
    const response = await page.goto(`http://127.0.0.1:${port}${path}`, {
      waitUntil: 'networkidle',
    })
    if (response?.status() !== 200) throw new Error(`${path}: HTTP ${response?.status()}`)
    if (!(await page.locator('main').count())) throw new Error(`${path}: main ausente`)
  }
  await page.locator('.campaign-console__audio select').selectOption('sfx')
  await page.getByRole('button', { name: 'Reproducir' }).first().click()
  await page.getByRole('button', { name: 'Pausar' }).first().click()
  await page.getByRole('button', { name: 'Reiniciar' }).first().click()
  await page.getByRole('tab', { name: 'Review' }).click()
  if (!(await page.getByText('VISUAL QA').count())) throw new Error('Review avanzado ausente')
  await page.goto(`http://127.0.0.1:${port}/lab`, { waitUntil: 'networkidle' })
  for (const selector of ['#visual-engine', '#sound-lab']) {
    await page.locator(selector).scrollIntoViewIfNeeded()
    await page.locator(selector).locator('section').waitFor({ state: 'visible' })
  }
  if (errors.length) throw new Error(errors.join('; '))
  process.stdout.write(`Regresión UI: ${paths.join(', ')}, consola AV y labs OK\n`)
} finally {
  if (browser) await browser.close()
  await new Promise((done) => server.httpServer.close(done))
}
