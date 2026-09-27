import type { ComponentType } from 'react'
import type { SceneRatio } from '@/renderer/scene'
import { InventarioStage } from './inventario-01/InventarioStage'
import { FacturacionStage } from './facturacion-electronica-uy-01/FacturacionStage'

export interface CampaignStageProps {
  timeMs: number
  ratio: SceneRatio
}

/** Escenarios propios de campañas con `playback.kind: 'custom'`, indexados por ID de campaña. */
export const customStages: Record<string, ComponentType<CampaignStageProps>> = {
  'inventario-01': InventarioStage,
  'facturacion-electronica-uy-01': FacturacionStage,
}
