import type { SceneDefinition } from '@/renderer/scene'
import { saleFlow } from '../SaleFlow'
export const collectionFlow: SceneDefinition = {
  ...saleFlow,
  id: 'collection-flow',
  title: 'Un cobro cierra un ciclo.',
  kicker: '05 / COBRO',
  description: 'El pago modifica el saldo y deja un rastro de caja.',
  document: {
    kind: 'COBRO',
    id: '#COB-019',
    rows: [
      { label: 'Cliente', value: 'C-104' },
      { label: 'Documento', value: '#FAC-092' },
      { label: 'Estado', value: 'APLICADO' },
    ],
  },
  nodes: [
    { id: 'collection', title: 'Cobro', at: 400, before: 'Pendiente', after: 'Aplicado' },
    { id: 'balance', title: 'Saldo cliente', at: 1600, before: '1', after: '0' },
    { id: 'cash', title: 'Caja', at: 2950, before: '—', after: 'Ingreso' },
    { id: 'accounting', title: 'Contabilidad', at: 4300, before: '—', after: 'Referencia' },
  ],
  events: [
    { id: 'e1', at: 400, kind: 'origin', label: 'Cobro aplicado' },
    { id: 'e2', at: 1600, kind: 'change', label: 'Saldo cliente actualizado' },
    { id: 'e3', at: 2950, kind: 'propagate', label: 'Ingreso de caja registrado' },
    { id: 'e4', at: 4300, kind: 'record', label: 'Referencia contable vinculada' },
  ],
}
