import type { SceneDefinition } from '@/renderer/scene'
import { inventoryFlow } from '../InventoryFlow'
export const purchaseFlow: SceneDefinition = {
  ...inventoryFlow,
  id: 'purchase-flow',
  title: 'Una compra abre otra cadena.',
  kicker: '04 / COMPRA',
  description: 'Una orden confirma un origen para existencias y obligaciones.',
  document: {
    kind: 'COMPRA',
    id: '#OC-042',
    rows: [
      { label: 'Artículo', value: 'A-104' },
      { label: 'Cantidad', value: '01' },
      { label: 'Estado', value: 'RECIBIDA' },
    ],
  },
  nodes: [
    { id: 'purchase', title: 'Compra', at: 400, before: 'Orden', after: 'Recibida' },
    { id: 'stock', title: 'Inventario', at: 1600, before: '17', after: '18' },
    { id: 'payable', title: 'Cuenta por pagar', at: 2950, before: '0', after: '+1' },
    { id: 'cost', title: 'Costo', at: 4300, before: '—', after: 'Registrado' },
  ],
  events: [
    { id: 'e1', at: 400, kind: 'origin', label: 'Compra recibida' },
    { id: 'e2', at: 1600, kind: 'change', label: 'Inventario actualizado' },
    { id: 'e3', at: 2950, kind: 'propagate', label: 'Cuenta por pagar creada' },
    { id: 'e4', at: 4300, kind: 'record', label: 'Costo registrado' },
  ],
}
