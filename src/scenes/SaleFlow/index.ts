import type { SceneDefinition } from '@/renderer/scene'
export const saleFlow: SceneDefinition = {
  id: 'sale-flow',
  title: 'Una venta mueve todo.',
  kicker: '01 / FLUJO DE VENTA',
  description: 'Un evento comercial inicia una cadena visible de cambios.',
  duration: 6000,
  background: 'graphite',
  viewport: { ratios: ['16:9', '1:1', '4:5', '9:16'], focus: 'start' },
  document: {
    kind: 'VENTA',
    id: '#18492',
    rows: [
      { label: 'Producto', value: 'A-104' },
      { label: 'Cantidad', value: '01' },
      { label: 'Estado', value: 'CONFIRMADA' },
    ],
  },
  nodes: [
    {
      id: 'sale',
      title: 'Venta',
      at: 400,
      before: 'Borrador',
      after: 'Confirmada',
      note: 'El evento de origen',
    },
    {
      id: 'stock',
      title: 'Inventario',
      at: 1600,
      before: '18',
      after: '17',
      note: 'Una unidad asignada',
    },
    {
      id: 'receivable',
      title: 'Cuenta por cobrar',
      at: 2950,
      before: '0',
      after: '+1',
      note: 'Nuevo documento pendiente',
    },
    {
      id: 'accounting',
      title: 'Contabilidad',
      at: 4300,
      before: '—',
      after: 'Asiento',
      note: 'Registro asociado',
    },
  ],
  events: [
    { id: 'e1', at: 400, kind: 'origin', label: 'Venta confirmada' },
    { id: 'e2', at: 1600, kind: 'change', label: 'Inventario actualizado' },
    { id: 'e3', at: 2950, kind: 'propagate', label: 'Cuenta por cobrar creada' },
    { id: 'e4', at: 4300, kind: 'record', label: 'Asiento asociado' },
  ],
  disclosure:
    'Secuencia conceptual · datos de demostración. Validar automatizaciones con producto antes de publicar claims.',
}
