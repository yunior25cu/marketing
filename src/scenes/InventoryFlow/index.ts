import type { SceneDefinition } from '@/renderer/scene'
export const inventoryFlow: SceneDefinition = {
  id: 'inventory-flow',
  title: 'Una unidad cambia de estado.',
  kicker: '02 / INVENTARIO',
  description: 'El movimiento físico adquiere contexto en la operación.',
  duration: 6000,
  background: 'graphite',
  viewport: { ratios: ['16:9', '1:1', '4:5', '9:16'], focus: 'center' },
  document: {
    kind: 'MOVIMIENTO',
    id: '#INV-042',
    rows: [
      { label: 'Artículo', value: 'A-104' },
      { label: 'Origen', value: 'ALMACÉN' },
      { label: 'Destino', value: 'DESPACHO' },
    ],
  },
  nodes: [
    {
      id: 'reserve',
      title: 'Reserva',
      at: 400,
      before: '0',
      after: '1',
      note: 'Unidad comprometida',
    },
    {
      id: 'available',
      title: 'Disponible',
      at: 1600,
      before: '18',
      after: '17',
      note: 'Saldo disponible',
    },
    {
      id: 'dispatch',
      title: 'Despacho',
      at: 2950,
      before: 'Pendiente',
      after: 'En curso',
      note: 'Movimiento registrado',
    },
    {
      id: 'trace',
      title: 'Trazabilidad',
      at: 4300,
      before: '—',
      after: '#INV-042',
      note: 'Origen identificable',
    },
  ],
  events: [
    { id: 'e1', at: 400, kind: 'origin', label: 'Reserva iniciada' },
    { id: 'e2', at: 1600, kind: 'change', label: 'Disponible actualizado' },
    { id: 'e3', at: 2950, kind: 'propagate', label: 'Despacho en curso' },
    { id: 'e4', at: 4300, kind: 'record', label: 'Movimiento trazado' },
  ],
  disclosure:
    'Secuencia conceptual · datos de demostración. Validar automatizaciones con producto antes de publicar claims.',
}
