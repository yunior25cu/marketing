import { motionTokens } from '@/brand/tokens/motion'
import type { SceneEventKind } from '@/renderer/scene'
import { sceneState } from '@/renderer/scene'
import { saleStockLink } from '@/scenes/SaleStockLink'

const { durations, easings, pulse } = motionTokens

export const inventario01 = {
  id: 'inventario-01',
  title: 'NO SE QUEDA EN VENTAS.',
  duration: 10000,
  phases: [
    { id: 'intro', from: 0, to: 2400, label: 'Premisa' },
    { id: 'event', from: 2400, to: 7400, label: 'Demostración' },
    { id: 'close', from: 7400, to: 10000, label: 'Resolución' },
  ],
  cues: { premiseSecondBeat: 1000, closeSecondBeat: 8000, closeTrail: 8600 },
  copy: {
    zones: ['01 / VENTAS', '02 / INVENTARIO'],
    /** Cada frase tiene dos tiempos: el primero ocupa Ventas; el segundo, Inventario. */
    premise: {
      beats: [
        ['LO QUE PASA', 'EN VENTAS'],
        ['NO SE QUEDA', 'EN VENTAS.'],
      ],
      accent: 0,
    },
    close: {
      beats: [
        ['UNA VENTA', 'SE CIERRA.'],
        ['EL STOCK', 'SE MUEVE.'],
      ],
      accent: 1,
    },
    trail: [
      { label: '01 / VENTA', value: '#18492 · CONFIRMADA' },
      { label: '02 / SALIDA', value: 'A-104 · −3' },
      { label: '03 / EXISTENCIAS', value: '18 → 15' },
      { label: '04 / MOVIMIENTO', value: 'M-0417 · ORIGEN #18492' },
    ],
    disclosure: 'SECUENCIA CONCEPTUAL · DATOS DE DEMOSTRACIÓN',
  },
} as const

export type Inventario01Phase = (typeof inventario01.phases)[number]['id']

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const sample = (a: number, b: number, t: number) =>
    3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3
  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let low = 0
    let high = 1
    let t = x
    for (let i = 0; i < 24; i++) {
      t = (low + high) / 2
      if (sample(x1, x2, t) < x) low = t
      else high = t
    }
    return sample(y1, y2, t)
  }
}

const easeStandard = bezier(...easings.standard)
const easeExit = bezier(...easings.exit)
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const enter = (t: number, at: number, duration: number = durations.standard) =>
  easeStandard(clamp((t - at) / duration))
const leave = (t: number, at: number, duration: number = durations.standard) =>
  1 - easeExit(clamp((t - at) / duration))
const ring = (t: number, at: number) => (t < at || t > at + pulse ? null : (t - at) / pulse)

function cue(kind: SceneEventKind) {
  const event = saleStockLink.events.find((item) => item.kind === kind)
  if (!event) throw new Error(`La escena no define el evento ${kind}`)
  return event.at
}

/** Tiempos relativos a la escena de demostración: origen → propagación → cambio → registro → resolución. */
export const demoCues = {
  sale: cue('origin'),
  dispatch: cue('propagate'),
  stock: cue('change'),
  movement: cue('record'),
  origin: cue('resolve'),
}

/** Estado visual completo de un instante. Puro: no depende de timers ni del DOM. */
export function inventario01Frame(timeMs: number) {
  const time = clamp(timeMs, 0, inventario01.duration)
  const [intro, event, close] = inventario01.phases
  const phase: Inventario01Phase = time < intro.to ? 'intro' : time < event.to ? 'event' : 'close'
  const sceneTime = clamp(time - event.from, 0, saleStockLink.duration)
  const scene = sceneState(saleStockLink, sceneTime)
  const linked = scene.activeIndex >= 3
  return {
    time,
    phase,
    premise: {
      visibility: Math.min(enter(time, intro.from), leave(time, intro.to - durations.standard)),
      beat: time >= inventario01.cues.premiseSecondBeat ? 2 : 1,
    },
    demo: {
      visibility: Math.min(enter(time, event.from), leave(time, event.to - durations.standard)),
      sceneTime,
      confirmed: scene.activeIndex >= 0,
      link: enter(sceneTime, demoCues.dispatch, durations.narrative),
      token: Math.min(
        enter(sceneTime, demoCues.dispatch, durations.micro),
        leave(sceneTime, demoCues.stock + durations.standard, durations.micro),
      ),
      caption: enter(sceneTime, demoCues.dispatch),
      stockChanged: scene.activeIndex >= 1,
      movement: scene.activeIndex >= 2 ? enter(sceneTime, demoCues.movement) : 0,
      linked,
      pulses: {
        sale: ring(sceneTime, demoCues.sale),
        stock: ring(sceneTime, demoCues.stock),
        origin: ring(sceneTime, demoCues.origin),
      },
      events: scene.activeEvents.length,
      status: !scene.activeEvents.length
        ? 'Venta en borrador'
        : linked
          ? 'Relación visible'
          : 'Evento en proceso',
    },
    close: {
      visibility: enter(time, close.from),
      beat: time >= inventario01.cues.closeSecondBeat ? 2 : 1,
      trail: enter(time, inventario01.cues.closeTrail),
    },
  }
}

export type Inventario01Frame = ReturnType<typeof inventario01Frame>

/** Secuencia completa en texto: lectores de pantalla y movimiento reducido. */
export const inventario01Summary = [
  inventario01.copy.premise.beats.flat().join(' '),
  'Venta #18492 del artículo A-104, 3 unidades, pasa de borrador a confirmada.',
  'La salida de 3 unidades cruza de Ventas a Inventario.',
  'Existencias de A-104: de 18 a 15.',
  'Se registra el movimiento M-0417 con origen en la venta #18492.',
  inventario01.copy.close.beats.flat().join(' '),
  'Secuencia conceptual con datos de demostración.',
].join(' ')
