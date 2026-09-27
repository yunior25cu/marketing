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
  const paths = [
    '/',
    '/lab',
    '/campaigns/launch-01',
    '/lab/campaigns/visual-engine-smoke-test',
    '/campaigns/continuous-motion-smoke-test',
    '/lab/campaigns/inventario-01',
    '/campaigns/facturacion-electronica-uy-01',
    '/lab/campaigns/facturacion-electronica-uy-01',
  ]
  for (const path of paths) {
    const response = await page.goto(`http://127.0.0.1:${port}${path}`, {
      waitUntil: 'networkidle',
    })
    if (response?.status() !== 200) throw new Error(`${path}: HTTP ${response?.status()}`)
    if (!(await page.locator('main').count())) throw new Error(`${path}: main ausente`)
  }
  await page.goto(`http://127.0.0.1:${port}/lab/campaigns/visual-engine-smoke-test`, {
    waitUntil: 'networkidle',
  })
  await page.locator('.campaign-console__audio select').selectOption('sfx')
  await page.getByRole('button', { name: 'Reproducir' }).first().click()
  await page.getByRole('button', { name: 'Pausar' }).first().click()
  await page.getByRole('button', { name: 'Reiniciar' }).first().click()
  await page.getByRole('tab', { name: 'Review' }).click()
  if (!(await page.getByText('VISUAL QA').count())) throw new Error('Review avanzado ausente')
  if (!(await page.getByText('MOTION_GRAPHICS_QUALITY').count()))
    throw new Error('Motion graphics quality gate ausente')
  if (!(await page.getByText('Composición dinámica').count()))
    throw new Error('Criterios de motion graphics ausentes')
  await page.goto(`http://127.0.0.1:${port}/lab/campaigns/facturacion-electronica-uy-01`, {
    waitUntil: 'networkidle',
  })
  await page.locator('[data-render-stage][data-ratio="16:9"]').waitFor()
  await page.getByRole('button', { name: '9:16', exact: true }).click()
  await page.locator('[data-render-stage][data-ratio="9:16"]').waitFor()
  if (!(await page.locator('.campaign-console__audio').count()))
    throw new Error('Audio de facturación ausente en consola')
  await page.goto(`http://127.0.0.1:${port}/lab#campaign-console`, { waitUntil: 'networkidle' })
  await page
    .locator('#campaign-console .campaign-console__head select')
    .selectOption('facturacion-electronica-uy-01')
  const listenControl = page.getByRole('button', { name: 'Escuchar', exact: true })
  if (!(await listenControl.isEnabled())) throw new Error('Control Escuchar deshabilitado')
  for (const detail of [
    'CURRENT AUDIO / RHYTHM MAGNET',
    'SOURCE / bensound-rhythmmagnet.mp3',
    'MASTER / 12.000 s',
    'VIDEO / 1.000 → 11.000 s',
    'SFX / NONE',
    'AMBIENCE / NONE',
    'LICENSE / PENDING PROOF',
  ])
    if (!(await page.getByText(detail, { exact: false }).count()))
      throw new Error(`Metadato de audio vigente ausente: ${detail}`)
  if (await page.getByRole('button', { name: /AUDIO [ABC]/ }).count())
    throw new Error('Hay variantes de audio antiguas expuestas en la consola')
  await listenControl.click()
  await page.waitForFunction(() => {
    const player = document.querySelector('#campaign-console audio')
    return player?.tagName === 'AUDIO' && !player.paused && player.currentTime >= 8
  })
  await page.locator('.campaign-console__audio').getByRole('button', { name: 'Pausar' }).click()
  await page.goto(`http://127.0.0.1:${port}/lab`, { waitUntil: 'networkidle' })
  for (const selector of ['#visual-engine', '#sound-lab']) {
    await page.locator(selector).scrollIntoViewIfNeeded()
    await page
      .locator(
        selector === '#sound-lab' ? '#sound-lab > section.lab-section' : `${selector} section`,
      )
      .waitFor({ state: 'visible' })
  }
  if (errors.length) throw new Error(errors.join('; '))
  await page.goto(`http://127.0.0.1:${port}/campaigns/continuous-motion-smoke-test?render=1&t=3000`)
  await page.locator('[data-render-stage][data-continuity="continuous"]').waitFor()
  if (!(await page.locator('[data-persistent="value-line"]').count()))
    throw new Error('Master composition continua ausente')
  process.stdout.write(
    `Regresión UI: ${paths.join(', ')}, consola AV, labs y master composition OK\n`,
  )
} finally {
  if (browser) await browser.close()
  await new Promise((done) => server.httpServer.close(done))
}
