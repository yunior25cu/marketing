import { useEffect, useRef } from 'react'
import { advancedNodes, advancedState } from '../core/timeline'

export function SignalField({ timeMs, className = '' }: { timeMs: number; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const element = canvas.current
    if (!element) return
    const width = Math.max(1, Math.round(element.clientWidth))
    const height = Math.max(1, Math.round(element.clientHeight))
    element.width = width
    element.height = height
    const context = element.getContext('2d')
    if (!context) return
    const { activeIndex, time, convergence } = advancedState(timeMs)
    context.clearRect(0, 0, width, height)
    const points = advancedNodes.map((node, index) => ({
      x: width * (0.16 + index * 0.225),
      y: height * (0.53 + node.y * 0.12),
      radius: 13 + (node.z + 1.5) * 4,
    }))
    context.lineWidth = Math.max(2, width / 600)
    for (let index = 0; index < points.length - 1; index++) {
      const from = points[index]
      const to = points[index + 1]
      const progress = Math.max(0, Math.min(1, (time - advancedNodes[index + 1].at + 700) / 700))
      context.strokeStyle = index < activeIndex ? '#c2ff39' : '#56605a'
      context.globalAlpha = index < activeIndex ? 0.9 : 0.42
      context.beginPath()
      context.moveTo(from.x, from.y)
      context.lineTo(from.x + (to.x - from.x) * progress, from.y + (to.y - from.y) * progress)
      context.stroke()
    }
    points.forEach((point, index) => {
      context.globalAlpha = index <= activeIndex ? 1 : 0.32
      context.fillStyle = index <= activeIndex ? '#c2ff39' : '#777f7b'
      context.beginPath()
      context.arc(point.x, point.y, point.radius + convergence * 3, 0, Math.PI * 2)
      context.fill()
      context.fillStyle = '#0c1010'
      context.beginPath()
      context.arc(point.x, point.y, point.radius * 0.42, 0, Math.PI * 2)
      context.fill()
    })
    context.globalAlpha = 1
  }, [timeMs])
  return <canvas ref={canvas} className={className} aria-hidden="true" />
}
