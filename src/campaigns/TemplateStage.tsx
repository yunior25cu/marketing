import type { CampaignRecord } from '@/orchestrator/contracts'
import { KineticText } from '@/primitives/KineticText'
import { SceneCanvas } from '@/renderer/SceneCanvas'
import type { SceneDefinition, SceneRatio } from '@/renderer/scene'
import { saleFlow } from '@/scenes/SaleFlow'
import { inventoryFlow } from '@/scenes/InventoryFlow'
import { accountingFlow } from '@/scenes/AccountingFlow'
import { purchaseFlow } from '@/scenes/PurchaseFlow'
import { collectionFlow } from '@/scenes/CollectionFlow'
import './launch-01/campaign.css'

const sceneMap: Record<string, SceneDefinition> = {
  'sale-flow': saleFlow,
  'inventory-flow': inventoryFlow,
  'accounting-flow': accountingFlow,
  'purchase-flow': purchaseFlow,
  'collection-flow': collectionFlow,
}

export function TemplateStage({
  record,
  timeMs,
  ratio,
}: {
  record: CampaignRecord
  timeMs: number
  ratio: SceneRatio
}) {
  const scene = sceneMap[record.playback.sceneId] ?? saleFlow
  const eventEnd = record.brief.duration - record.playback.outroMs
  const eventDuration = eventEnd - record.playback.introMs
  const phase = timeMs < record.playback.introMs ? 'intro' : timeMs < eventEnd ? 'event' : 'close'
  const sceneTime =
    eventDuration > 0
      ? ((timeMs - record.playback.introMs) / eventDuration) * scene.duration
      : scene.duration
  return (
    <div
      className={`campaign-stage campaign-stage--${ratio.replace(':', '-')}`}
      aria-label={`${record.brief.title}, ${record.brief.duration / 1000} segundos`}
    >
      {phase === 'intro' && (
        <div className="campaign-stage__statement">
          <span className="eyebrow">BALAXYS / BUSINESS IN MOTION</span>
          <KineticText
            lines={record.copy.introLines}
            accent={record.copy.introLines.length - 1}
            visibleCount={timeMs < record.playback.introMs / 2 ? 1 : record.copy.introLines.length}
          />
          <span className="micro-label">DATOS DE DEMOSTRACIÓN</span>
        </div>
      )}
      {phase === 'event' && <SceneCanvas scene={scene} timeMs={sceneTime} ratio={ratio} compact />}
      {phase === 'close' && (
        <div className="campaign-stage__statement campaign-stage__statement--end">
          <span className="eyebrow">EVENTO → CONSECUENCIA</span>
          <KineticText
            lines={record.copy.closingLines}
            accent={record.copy.closingLines.length - 1}
            visibleCount={
              timeMs < eventEnd + record.playback.outroMs / 2 ? 1 : record.copy.closingLines.length
            }
          />
          <span className="campaign-stage__signature">
            BALAXYS <b>✳</b>
          </span>
        </div>
      )}
    </div>
  )
}
