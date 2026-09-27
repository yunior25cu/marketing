import type { CSSProperties, ReactNode } from 'react'
import type { CameraState } from '@/motion/continuous'
import { cameraCssTransform } from '@/motion/continuous'

export function CameraLayer({
  camera,
  children,
  className = '',
  label,
}: {
  camera: CameraState
  children: ReactNode
  className?: string
  label?: string
}) {
  const style = {
    '--camera-x': `${camera.x}%`,
    '--camera-y': `${camera.y}%`,
    '--camera-scale': camera.scale,
    '--camera-rotation': `${camera.rotation}deg`,
    '--camera-focus': camera.focus,
    '--camera-depth': camera.depth,
    '--camera-origin-x': `${50 + (camera.focus - 0.5) * 12}%`,
    transform: cameraCssTransform(camera),
  } as CSSProperties
  return (
    <div className={`camera-layer ${className}`} style={style} aria-label={label}>
      {children}
    </div>
  )
}
