import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import {
  approvalBlockers,
  createRecord,
  inferIntent,
  normalizeBrief,
  selectedAgentIds,
  validateRecord,
} from '../scripts/orchestrator-core.mjs'
import type { CampaignRecord } from '@/orchestrator/contracts'

const root = process.cwd()
const manifest = JSON.parse(readFileSync(join(root, 'agents', 'orchestration.config.json'), 'utf8'))
const launch = JSON.parse(
  readFileSync(join(root, 'campaigns', 'launch-01', 'campaign.json'), 'utf8'),
) as CampaignRecord
const smokeRequest = readFileSync(
  join(root, 'tests', 'fixtures', 'orchestrator-smoke-request.txt'),
  'utf8',
)
const tempRoot = mkdtempSync(join(tmpdir(), 'balaxys-orchestrator-'))
afterAll(() => {
  if (tempRoot.startsWith(tmpdir()) && tempRoot.includes('balaxys-orchestrator-'))
    rmSync(tempRoot, { recursive: true, force: true })
})

function cli(...args: string[]) {
  return execFileSync(
    process.execPath,
    [join(root, 'scripts', 'campaign-workspace.mjs'), ...args],
    {
      cwd: root,
      env: { ...process.env, BALAXYS_CAMPAIGNS_ROOT: tempRoot },
      encoding: 'utf8',
    },
  )
}

describe('Campaign Orchestrator', () => {
  it('recognizes intents and limits handoffs to relevant roles', () => {
    expect(inferIntent('Pasá launch-01 a Stories')).toBe('ADAPT')
    expect(inferIntent('El inicio es demasiado lento')).toBe('IMPROVE')
    expect(inferIntent('Quiero explorar una nueva forma de representar alertas')).toBe('EVOLVE')
    expect(inferIntent('Aprobar esta campaña')).toBe('APPROVE')
    expect(inferIntent('Quiero una campaña sobre cobranza')).toBe('CREATE')
    expect(selectedAgentIds('ADAPT', manifest)).not.toContain('copywriter')
    expect(selectedAgentIds('IMPROVE', manifest, 'acelerar el inicio')).not.toContain(
      'creative-director',
    )
    expect(selectedAgentIds('IMPROVE', manifest, 'cambiar el copy')).toContain('copywriter')
  })

  it('normalizes a short human request and blocks unsupported product claims', () => {
    const brief = normalizeBrief('Quiero una campaña sobre cobranza')
    expect(brief.duration).toBe(10000)
    expect(brief.formats).toEqual(['16:9'])
    expect(brief.cta).toBeNull()
    expect(brief.language).toBe('es')
    expect(brief.productCapabilities[0].status).toBe('UNVERIFIED')
    expect(normalizeBrief('Tema: cobranza\nFormato: Stories y cuadrado').formats).toEqual([
      '1:1',
      '9:16',
    ])
    const record = createRecord('cobranza', brief, '2026-01-01T00:00:00.000Z')
    expect(validateRecord(record)).toEqual([])
    expect(approvalBlockers(record)).toContain('Hay un claim de producto sin verificar')
    expect(record.storyboard.at(-1)?.to).toBe(10000)
  })

  it('reconstructs launch-01 without allowing premature approval', () => {
    expect(validateRecord(launch)).toEqual([])
    expect(launch.storyboard.map((phase) => [phase.from, phase.to])).toEqual([
      [0, 1700],
      [1700, 7700],
      [7700, 10000],
    ])
    expect(launch.reviews.brand.status).toBe('PASS')
    expect(launch.reviews.quality.status).toBe('PASS')
    expect(approvalBlockers(launch)).toEqual(['Hay un claim de producto sin verificar'])
  })

  it('creates the smoke campaign, gates approval, and freezes an approved version', () => {
    expect(
      cli(
        'create',
        '--id=orchestrator-smoke-test',
        '--requestFile=tests/fixtures/orchestrator-smoke-request.txt',
      ),
    ).toContain('CAMPAÑA CREADA')
    const campaignPath = join(tempRoot, 'orchestrator-smoke-test')
    const recordPath = join(campaignPath, 'campaign.json')
    const record = JSON.parse(readFileSync(recordPath, 'utf8')) as CampaignRecord
    expect(record.brief.duration).toBe(6000)
    expect(record.brief.formats).toEqual(['16:9'])
    expect(record.playback.sceneId).toBe('sale-flow')
    expect(record.brief.productCapabilities[0].status).toBe('UNVERIFIED')
    expect(() => cli('approve', '--id=orchestrator-smoke-test', '--by=Prueba')).toThrow()

    record.status = 'IN_REVIEW'
    record.reviews.brand.status = 'PASS'
    record.reviews.quality.status = 'PASS'
    record.reviews.performance.status = 'PASS'
    record.reviews.technical = { lint: true, typecheck: true, tests: true, build: true }
    record.audioLevel = 'NONE'
    record.brief.productCapabilities[0] = {
      ...record.brief.productCapabilities[0],
      status: 'VERIFIED',
      evidence: 'Evidencia de prueba aislada',
    }
    writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`)
    expect(cli('approve', '--id=orchestrator-smoke-test', '--by=Prueba')).toContain(
      'CAMPAÑA APROBADA',
    )
    const releasePath = join(campaignPath, 'releases', 'v1')
    const frozenCopy = readFileSync(join(releasePath, 'copy.md'))
    const release = JSON.parse(readFileSync(join(releasePath, 'manifest.json'), 'utf8'))
    expect(release.hashes['copy.md']).toBe(createHash('sha256').update(frozenCopy).digest('hex'))
    writeFileSync(join(campaignPath, 'copy.md'), 'Cambio silencioso')
    expect(() => cli('inspect', '--id=orchestrator-smoke-test')).toThrow()
    writeFileSync(join(campaignPath, 'copy.md'), frozenCopy)
    expect(cli('improve', '--id=orchestrator-smoke-test', '--change=Inicio más rápido')).toContain(
      'MEJORA REGISTRADA',
    )
    const revised = JSON.parse(readFileSync(recordPath, 'utf8')) as CampaignRecord
    expect(revised.version).toBe(2)
    expect(revised.status).toBe('NEEDS_CHANGES')
    expect(revised.reviews.brand.status).toBe('PENDING')
    expect(revised.reviews.technical.tests).toBe(false)
    expect(
      cli('adapt', '--id=orchestrator-smoke-test', 'Pasá a Stories y formato cuadrado'),
    ).toContain('ADAPTACIÓN REGISTRADA')
    const adapted = JSON.parse(readFileSync(recordPath, 'utf8')) as CampaignRecord
    expect(adapted.brief.formats).toEqual(['16:9', '1:1', '9:16'])
    expect(adapted.status).toBe('DRAFT')
    expect(readFileSync(join(releasePath, 'copy.md'))).toEqual(frozenCopy)
    expect(smokeRequest).toContain('INVENTARIO')
  })
})
