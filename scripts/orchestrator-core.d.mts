import type { CampaignBrief, CampaignIntent, CampaignRecord } from '../src/orchestrator/contracts'

export const supportedFormats: string[]
export const statuses: string[]
export function parseFormats(request: string): string[]
export function inferIntent(request: string): CampaignIntent
export function interpretMotionDirection(request: string): {
  motionStyle: 'CONTINUOUS'
  reviseSlideRisk: boolean
  actions: string[]
  requestedMotion: string
}
export function chooseScene(request: string): string
export function normalizeBrief(request: string): CampaignBrief & { sceneId: string }
export function selectedAgentIds(
  intent: CampaignIntent,
  manifest: { recommendedOrder: string[]; agents: { id: string; invokeFor: string[] }[] },
  request?: string,
): string[]
export function approvalBlockers(record: CampaignRecord): string[]
export function validateRecord(record: CampaignRecord): string[]
export function createRecord(
  id: string,
  brief: CampaignBrief & { sceneId: string },
  now: string,
): CampaignRecord
