import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { approvalBlockers, validateRecord } from '../scripts/orchestrator-core.mjs'
import { demoCues, inventario01, inventario01Frame } from '@/campaigns/inventario-01/definition'
import { customStages } from '@/campaigns/stages'
import type { CampaignRecord } from '@/orchestrator/contracts'
import { validateScene } from '@/renderer/scene'
import { saleStockLink } from '@/scenes/SaleStockLink'

const record = JSON.parse(
  readFileSync(join(process.cwd(), 'campaigns', 'inventario-01', 'campaign.json'), 'utf8'),
) as CampaignRecord
const [, event] = inventario01.phases

describe('inventario-01', () => {
  it('covers exactly ten seconds and matches its campaign record', () => {
    expect(inventario01.duration).toBe(10000)
    expect(inventario01.phases[0].from).toBe(0)
    for (let i = 1; i < inventario01.phases.length; i++)
      expect(inventario01.phases[i].from).toBe(inventario01.phases[i - 1].to)
    expect(inventario01.phases.at(-1)?.to).toBe(inventario01.duration)
    expect(record.storyboard.map((phase) => [phase.id, phase.from, phase.to])).toEqual(
      inventario01.phases.map((phase) => [phase.id, phase.from, phase.to]),
    )
    expect(record.brief.duration).toBe(inventario01.duration)
    expect(record.brief.formats).toEqual(['16:9', '9:16'])
    expect(record.playback).toMatchObject({ kind: 'custom', sceneId: saleStockLink.id })
    expect(customStages[record.id]).toBeDefined()
    expect(validateRecord(record)).toEqual([])
  })

  it('keeps the demonstration causal: origin → propagation → change → record → resolution', () => {
    expect(validateScene(saleStockLink)).toEqual([])
    expect(saleStockLink.duration).toBe(event.to - event.from)
    const order = saleStockLink.events.map((item) => item.kind)
    expect(order).toEqual(['origin', 'propagate', 'change', 'record', 'resolve'])
    const times = saleStockLink.events.map((item) => item.at)
    expect([...times].sort((a, b) => a - b)).toEqual(times)
    // Cada nodo se activa exactamente con el evento que lo causa.
    expect(saleStockLink.nodes.map((node) => node.at)).toEqual([
      demoCues.sale,
      demoCues.stock,
      demoCues.movement,
      demoCues.origin,
    ])
  })

  it('never shows a consequence before its cause', () => {
    const at = (sceneMs: number) => inventario01Frame(event.from + sceneMs).demo
    expect(at(demoCues.sale - 1).confirmed).toBe(false)
    expect(at(demoCues.sale).confirmed).toBe(true)
    expect(at(demoCues.dispatch - 1).link).toBe(0)
    expect(at(demoCues.dispatch - 1).token).toBe(0)
    // El stock cambia sólo después de que el dato llega a Inventario.
    expect(at(demoCues.stock - 1).stockChanged).toBe(false)
    expect(at(demoCues.stock - 1).link).toBeGreaterThan(0.99)
    expect(at(demoCues.stock).stockChanged).toBe(true)
    expect(at(demoCues.stock).link).toBe(1)
    expect(at(demoCues.movement - 1).movement).toBe(0)
    expect(at(demoCues.movement + 280).movement).toBe(1)
    expect(at(demoCues.origin - 1).linked).toBe(false)
    expect(at(demoCues.origin).linked).toBe(true)
    expect(at(demoCues.origin).status).toBe('Relación visible')
  })

  it('resolves phases at boundaries and clamps time', () => {
    expect(inventario01Frame(-50).phase).toBe('intro')
    expect(inventario01Frame(2399).phase).toBe('intro')
    expect(inventario01Frame(2400).phase).toBe('event')
    expect(inventario01Frame(7399).phase).toBe('event')
    expect(inventario01Frame(7400).phase).toBe('close')
    expect(inventario01Frame(99999).time).toBe(10000)
    expect(inventario01Frame(999).premise.beat).toBe(1)
    expect(inventario01Frame(1000).premise.beat).toBe(2)
  })

  it('keeps the whole story in the final frame for reduced motion', () => {
    const final = inventario01Frame(inventario01.duration)
    expect(final.phase).toBe('close')
    expect(final.close).toEqual({ visibility: 1, beat: 2, trail: 1 })
    const trail = inventario01.copy.trail.map((item) => item.value).join(' ')
    for (const fact of ['#18492', 'CONFIRMADA', 'A-104', '−3', '18 → 15', 'M-0417'])
      expect(trail).toContain(fact)
  })

  it('stays in review while product claims lack evidence', () => {
    expect(record.brief.campaignType).toBe('awareness')
    expect(record.brief.cta).toBeNull()
    expect(record.brief.productCapabilities.length).toBeGreaterThan(0)
    for (const claim of record.brief.productCapabilities) {
      expect(claim.status).toBe('UNVERIFIED')
      expect(claim.evidence).toBeNull()
    }
    expect(approvalBlockers(record)).toContain('Hay un claim de producto sin verificar')
    expect(record.status).not.toBe('APPROVED')
  })
})
