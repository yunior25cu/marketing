export const advancedDuration = 8000
export const advancedCheckpoints = [0, 1600, 3200, 4800, 6400, 7990] as const

export const advancedNodes = [
  { id: 'venta', label: 'VENTA', x: -3.2, y: 0.25, z: 0.8, at: 0 },
  { id: 'inventario', label: 'INVENTARIO', x: -1.05, y: 0.95, z: -0.8, at: 1600 },
  { id: 'finanzas', label: 'FINANZAS', x: 1.1, y: -0.8, z: -1.4, at: 3200 },
  { id: 'registro', label: 'REGISTRO', x: 3.15, y: 0.4, z: 0.4, at: 4800 },
] as const

export function advancedState(timeMs: number) {
  const time = Math.max(0, Math.min(advancedDuration, timeMs))
  return {
    time,
    activeIndex: advancedNodes.reduce(
      (result, node, index) => (time >= node.at ? index : result),
      -1,
    ),
    convergence: Math.max(0, Math.min(1, (time - 6100) / 1300)),
    cameraX: Math.sin((time / 8000) * Math.PI) * 0.28,
  }
}
