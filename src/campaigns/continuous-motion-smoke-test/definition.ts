import type { CameraKeyframe, MotionBeat } from '@/motion/continuous'

export const continuousDuration = 10000

export const continuousCameraPath: CameraKeyframe[] = [
  { at: 0, x: 13, y: 0, scale: 1.38, focus: 0.9, depth: 0.1 },
  { at: 1400, x: 10, y: 0, scale: 1.3, focus: 0.8, depth: 0.18 },
  { at: 3900, x: 1, y: -1, scale: 1.18, focus: 0.65, depth: 0.32 },
  { at: 6000, x: -7, y: -2, scale: 1.04, focus: 0.35, depth: 0.5 },
  { at: 8000, x: -2, y: 0, scale: 0.98, focus: 0.2, depth: 0.24 },
  { at: 10000, x: 0, y: 0, scale: 0.94, focus: 0, depth: 0.12 },
]

export const continuousBeats: MotionBeat[] = [
  {
    id: 'trigger',
    from: 0,
    to: 1400,
    label: 'El stock contiene una unidad',
    persistentObjects: ['stock-18', 'stock-17'],
    transformation: '18 se convierte en 17; una unidad se desprende.',
    camera: 'Push-in inicial; el 18 ocupa el campo.',
    transition: 'MORPH',
    audioCue: 'stock-origin',
  },
  {
    id: 'propagation',
    from: 1400,
    to: 4000,
    label: 'La unidad transporta el valor',
    persistentObjects: ['stock-17', 'value-line', 'sale-value'],
    transformation: 'El fragmento viaja, se extiende como línea y revela $13.490.',
    camera: 'Tracking suave hacia la derecha siguiendo el trazo.',
    transition: 'CARRY',
    audioCue: 'line-build',
  },
  {
    id: 'record',
    from: 4000,
    to: 6000,
    label: 'El valor toma forma de documento',
    persistentObjects: ['stock-17', 'value-line', 'sale-value', 'document'],
    transformation: 'La línea continúa el borde del documento; el valor entra en el registro.',
    camera: 'Reencuadre gradual, mantiene origen y destino en el mismo campo.',
    transition: 'CONTINUATION',
    audioCue: 'document-record',
  },
  {
    id: 'discovery',
    from: 6000,
    to: 8000,
    label: 'Una composición mayor aparece',
    persistentObjects: ['stock-17', 'document', 'accounting-entry', 'continuity-link'],
    transformation: 'El documento se abre en estructura contable y revela relaciones alrededor.',
    camera: 'Pull-out para descubrir stock, venta, cuenta y registro conectados.',
    transition: 'CAMERA_DISCOVERY',
    audioCue: 'accounting-resolve',
  },
  {
    id: 'resolve',
    from: 8000,
    to: 10000,
    label: 'Los elementos forman una sola idea',
    persistentObjects: [
      'stock-17',
      'document',
      'accounting-entry',
      'continuity-link',
      'brand-signature',
    ],
    transformation: 'La ruta de datos conduce a la frase final y la firma.',
    camera: 'La cámara estabiliza el mapa sin cortar la composición.',
    transition: 'TYPOGRAPHIC_TRANSFORMATION',
    audioCue: 'brand-resolve',
  },
]

export const continuousTransitionCheckpoints = [
  0, 950, 1100, 1400, 2200, 3000, 3850, 4000, 4700, 5500, 5950, 6000, 6800, 7900, 8000, 8600, 9300,
  9990,
]

export function continuousState(timeMs: number) {
  const time = Math.min(continuousDuration, Math.max(0, timeMs))
  const eased = (from: number, to: number) => {
    const raw = Math.min(1, Math.max(0, (time - from) / (to - from)))
    return raw * raw * (3 - 2 * raw)
  }
  return {
    time,
    stockChange: eased(900, 1450),
    fragmentTravel: eased(1200, 2900),
    lineDraw: eased(1400, 3900),
    valueReveal: eased(2450, 3900),
    documentDraw: eased(4000, 5850),
    ledgerReveal: eased(5600, 7100),
    mapReveal: eased(6100, 7900),
    closingReveal: eased(8100, 9700),
    closingProgress: eased(8000, 10000),
  }
}
