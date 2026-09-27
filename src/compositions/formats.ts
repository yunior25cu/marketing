import type { SceneRatio } from '@/renderer/scene'

export const formats: Record<SceneRatio, { width: number; height: number; label: string }> = {
  '16:9': { width: 1920, height: 1080, label: 'Horizontal' },
  '1:1': { width: 1080, height: 1080, label: 'Cuadrado' },
  '4:5': { width: 1080, height: 1350, label: 'Feed vertical' },
  '9:16': { width: 1080, height: 1920, label: 'Historia vertical' },
}

export const ratios = Object.keys(formats) as SceneRatio[]
