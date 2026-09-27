import type { CampaignRecord } from './contracts'
import { validateRecord } from '../../scripts/orchestrator-core.mjs'

const recordModules = import.meta.glob('../../campaigns/*/campaign.json', {
  eager: true,
  import: 'default',
})
const documents = import.meta.glob('../../campaigns/*/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export const campaignRecords = Object.values(recordModules)
  .map((record) => record as CampaignRecord)
  .filter((record) => validateRecord(record).length === 0)
  .sort((a, b) => a.id.localeCompare(b.id))

export function campaignDocument(id: string, name: 'brief' | 'storyboard' | 'review') {
  const match = Object.entries(documents).find(([path]) => path.endsWith(`/${id}/${name}.md`))
  return (match?.[1] as string | undefined) ?? 'Documento pendiente.'
}
