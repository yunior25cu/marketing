export type VisualLevel = 'STANDARD' | 'ADVANCED_2D' | 'CANVAS' | 'THREE_D' | 'SHADER'

export interface VisualDecision {
  level: VisualLevel
  reason: string
  fallback: 'DOM' | 'SVG' | 'CANVAS'
}

/** Choose the least complex medium that can express the requested relationship. */
export function selectVisualLevel(request: string): VisualDecision {
  const text = request.toLocaleLowerCase('es')
  if (/distorsi[oó]n de datos|campo procedural|data wave|m[aá]scara por p[ií]xel/i.test(text))
    return { level: 'SHADER', reason: 'El campo requiere cálculo por píxel.', fallback: 'CANVAS' }
  if (/profundidad espacial|c[aá]mara|perspectiva 3d|relaciones tridimensionales/i.test(text))
    return {
      level: 'THREE_D',
      reason: 'La posición en profundidad comunica la propagación entre áreas.',
      fallback: 'CANVAS',
    }
  if (/miles de|part[ií]culas|campo de puntos|trails/i.test(text))
    return {
      level: 'CANVAS',
      reason: 'Muchos elementos móviles hacen costoso el DOM.',
      fallback: 'SVG',
    }
  if (/m[aá]scara|morph|wipe|reveal/i.test(text))
    return {
      level: 'ADVANCED_2D',
      reason: 'SVG resuelve la transición con control vectorial.',
      fallback: 'DOM',
    }
  return {
    level: 'STANDARD',
    reason: 'DOM y SVG expresan el concepto con menor complejidad.',
    fallback: 'DOM',
  }
}

export function canUseWebGL2() {
  if (typeof document === 'undefined') return false
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'))
  } catch {
    return false
  }
}
