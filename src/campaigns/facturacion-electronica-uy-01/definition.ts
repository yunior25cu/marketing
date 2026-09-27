import type { SceneRatio } from '@/renderer/scene'
import { cameraAt, progressBetween } from '@/motion/continuous'

export const facturacionDuration = 10000
export const ease = (t: number, a: number, b: number) => {
  const p = progressBetween(t, a, b)
  return p * p * (3 - 2 * p)
}
export const mix = (a: number, b: number, p: number) => a + (b - a) * p
export const curvePoint = (points: number[], p: number) =>
  (1 - p) ** 3 * points[0] +
  3 * (1 - p) ** 2 * p * points[1] +
  3 * (1 - p) * p * p * points[2] +
  p ** 3 * points[3]
export const layouts = {
  '16:9': {
    w: 1600,
    h: 900,
    docX: 680,
    docY: 415,
    gateX: 1190,
    gateY: 395,
    endX: 1220,
    endY: 415,
    title: 116,
    closeX: 100,
    closeY: 350,
    nodes: [
      [1040, 165],
      [1430, 415],
      [1040, 665],
    ],
  },
  '9:16': {
    w: 900,
    h: 1600,
    docX: 450,
    docY: 680,
    gateX: 450,
    gateY: 1060,
    endX: 450,
    endY: 540,
    title: 88,
    closeX: 72,
    closeY: 1030,
    nodes: [
      [170, 390],
      [720, 390],
      [450, 805],
    ],
  },
  '4:5': {
    w: 1000,
    h: 1250,
    docX: 420,
    docY: 530,
    gateX: 740,
    gateY: 785,
    endX: 570,
    endY: 395,
    title: 92,
    closeX: 76,
    closeY: 830,
    nodes: [
      [205, 300],
      [840, 300],
      [570, 640],
    ],
  },
  '1:1': {
    w: 1000,
    h: 1000,
    docX: 430,
    docY: 445,
    gateX: 785,
    gateY: 530,
    endX: 700,
    endY: 325,
    title: 86,
    closeX: 70,
    closeY: 670,
    nodes: [
      [350, 180],
      [870, 480],
      [350, 465],
    ],
  },
} satisfies Record<
  SceneRatio,
  {
    w: number
    h: number
    docX: number
    docY: number
    gateX: number
    gateY: number
    endX: number
    endY: number
    title: number
    closeX: number
    closeY: number
    nodes: number[][]
  }
>

export function facturacionFrame(time: number, ratio: SceneRatio) {
  const t = Math.max(0, Math.min(facturacionDuration, time))
  const l = layouts[ratio]
  const narrow = ratio === '9:16'
  const document = ease(t, 1400, 2550)
  const discover = ease(t, 6950, 8100)
  const close = ease(t, 8150, 8750)
  const send = ease(t, 4450, 5350)
  const response = ease(t, 6050, 6700)
  const travel = send * (1 - response)
  const destinationX = narrow ? l.gateX : l.gateX - 170
  const destinationY = narrow ? l.gateY - 220 : l.gateY - 55
  const flightX = curvePoint(
    [l.docX, l.docX + (narrow ? 0 : 130), destinationX, destinationX],
    travel,
  )
  const flightY = curvePoint(
    [l.docY, l.docY + (narrow ? 130 : 0), destinationY - 100, destinationY],
    travel,
  )
  const camera = cameraAt(
    [
      { at: 0, x: 0, y: 0, scale: 1 },
      { at: 1400, x: 0, y: 0, scale: 1 },
      { at: 2950, x: 0, y: 0, scale: 1.1 },
      { at: 3750, x: 0, y: 0, scale: 1.1 },
      { at: 4300, x: narrow ? 0 : -3, y: narrow ? -2 : 0, scale: 1.18 },
      { at: 5350, x: narrow ? 0 : -8, y: narrow ? -7 : 0, scale: 1.08 },
      { at: 5650, x: narrow ? 0 : -7, y: narrow ? -5 : 0, scale: 1.14 },
      { at: 6100, x: narrow ? 0 : -5, y: narrow ? -5 : 0, scale: 1.02 },
      { at: 6800, x: 0, y: 0, scale: 0.94 },
      { at: 8050, x: 0, y: 0, scale: 1 },
      { at: 10000, x: 0, y: 0, scale: 1 },
    ],
    t,
  )
  return {
    t,
    l,
    narrow,
    document,
    discover,
    close,
    camera,
    x: mix(flightX, l.endX, discover),
    y: mix(flightY, l.endY, discover),
    docScale: mix(mix(1, narrow ? 0.65 : 0.57, travel), ratio === '16:9' ? 0.7 : 0.62, discover),
    send,
    response,
    signature: ease(t, 3500, 4000),
  }
}
