import type { SceneDefinition } from '@/renderer/scene'
export const accountingFlow: SceneDefinition = {
  id: 'accounting-flow',
  title: 'Cada registro tiene origen.',
  kicker: '03 / CONTABILIDAD',
  description: 'La consecuencia contable se conecta con el evento que la produjo.',
  duration: 6000,
  background: 'graphite',
  viewport: { ratios: ['16:9', '1:1', '4:5', '9:16'], focus: 'center' },
  document: {
    kind: 'REFERENCIA',
    id: '#FAC-092',
    rows: [
      { label: 'Origen', value: 'VENTA #18492' },
      { label: 'Documento', value: '#FAC-092' },
      { label: 'Estado', value: 'VINCULADO' },
    ],
  },
  nodes: [
    {
      id: 'source',
      title: 'Operación',
      at: 400,
      before: '—',
      after: '#18492',
      note: 'Evento comercial',
    },
    {
      id: 'document',
      title: 'Documento',
      at: 1600,
      before: '—',
      after: '#FAC-092',
      note: 'Referencia documental',
    },
    {
      id: 'entry',
      title: 'Asiento',
      at: 2950,
      before: '—',
      after: 'Vinculado',
      note: 'Consecuencia contable',
    },
    {
      id: 'trace',
      title: 'Origen',
      at: 4300,
      before: '—',
      after: 'Visible',
      note: 'Cadena identificable',
    },
  ],
  events: [
    { id: 'e1', at: 400, kind: 'origin', label: 'Operación confirmada' },
    { id: 'e2', at: 1600, kind: 'propagate', label: 'Documento vinculado' },
    { id: 'e3', at: 2950, kind: 'record', label: 'Asiento relacionado' },
    { id: 'e4', at: 4300, kind: 'resolve', label: 'Origen visible' },
  ],
  disclosure:
    'Secuencia conceptual · datos de demostración. Validar automatizaciones con producto antes de publicar claims.',
}
