import { describe, expect, it } from 'vitest'
import { saleFlow } from '@/scenes/SaleFlow'
import { inventoryFlow } from '@/scenes/InventoryFlow'
import { accountingFlow } from '@/scenes/AccountingFlow'
import { sceneState, validateScene } from '@/renderer/scene'
import { campaignPhase, launch01 } from '@/campaigns/launch-01/definition'

describe('scene engine', () => {
  it('keeps every event inside its scene and supports all required ratios', () => {
    for (const scene of [saleFlow, inventoryFlow, accountingFlow]) {
      expect(validateScene(scene)).toEqual([])
      expect(scene.viewport.ratios).toEqual(['16:9', '1:1', '4:5', '9:16'])
    }
  })

  it('resolves causal states at timeline boundaries and clamps input', () => {
    expect(sceneState(saleFlow, -100).activeIndex).toBe(-1)
    expect(sceneState(saleFlow, 400).activeIndex).toBe(0)
    expect(sceneState(saleFlow, 1599).activeIndex).toBe(0)
    expect(sceneState(saleFlow, 1600).activeIndex).toBe(1)
    expect(sceneState(saleFlow, 99999).activeIndex).toBe(3)
    expect(sceneState(saleFlow, 99999).time).toBe(6000)
  })
})

describe('launch campaign', () => {
  it('covers exactly ten seconds with contiguous phases', () => {
    expect(launch01.duration).toBe(10000)
    expect(launch01.phases[0].from).toBe(0)
    for (let i = 1; i < launch01.phases.length; i++)
      expect(launch01.phases[i].from).toBe(launch01.phases[i - 1].to)
    expect(launch01.phases.at(-1)?.to).toBe(launch01.duration)
    expect(campaignPhase(1699)).toBe('premise')
    expect(campaignPhase(1700)).toBe('event')
    expect(campaignPhase(7700)).toBe('resolution')
    expect(campaignPhase(10000)).toBe('resolution')
  })
})
