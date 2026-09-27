import { useEffect, useRef, useState } from 'react'
import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  Color,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { canUseWebGL2 } from '../core/selection'
import { advancedNodes, advancedState } from '../core/timeline'
import { SignalField } from '../canvas/SignalField'
import { createDataFieldMaterial } from '../shaders/dataField'
import { cameraAt, threeCameraPose } from '@/motion/continuous'

const spatialCameraPath = [
  { at: 0, x: 0, y: 0, scale: 1 },
  { at: 4000, x: 0.28, y: 0, scale: 1 },
  { at: 8000, x: 0, y: 0, scale: 1 },
]

interface SpatialNetworkProps {
  timeMs: number
  reduced?: boolean
  shader?: boolean
  className?: string
}

export function SpatialNetwork({
  timeMs,
  reduced = false,
  shader = true,
  className = '',
}: SpatialNetworkProps) {
  const host = useRef<HTMLDivElement>(null)
  const renderTime = useRef<(time: number) => void>(() => {})
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const element = host.current
    const memoryGb = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    if (!element || reduced || !canUseWebGL2() || (memoryGb !== undefined && memoryGb < 4)) {
      setFallback(true)
      return
    }
    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
        preserveDrawingBuffer: true,
      })
    } catch {
      setFallback(true)
      return
    }
    const width = Math.max(1, element.clientWidth)
    const height = Math.max(1, element.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setSize(width, height)
    renderer.setClearColor(0x0b1010, 0)
    element.appendChild(renderer.domElement)
    const scene = new Scene()
    const camera = new PerspectiveCamera(38, width / height, 0.1, 100)
    camera.position.set(0, 0, width < height ? 18 : 11.5)
    scene.add(new AmbientLight(0xffffff, 2.5))
    const group = new Group()
    group.scale.setScalar(width < height ? 0.72 : 1)
    scene.add(group)
    const nodes = advancedNodes.map((node) => {
      const geometry = new BoxGeometry(1.05, 0.68, 0.26)
      const material = new MeshStandardMaterial({
        color: 0x39423f,
        emissive: 0x121a14,
        metalness: 0.25,
        roughness: 0.65,
      })
      const mesh = new Mesh(geometry, material)
      mesh.position.set(node.x, node.y, node.z)
      group.add(mesh)
      return { mesh, geometry, material }
    })
    const links = advancedNodes.slice(0, -1).map((node, index) => {
      const next = advancedNodes[index + 1]
      const geometry = new BufferGeometry().setFromPoints([
        new Vector3(node.x, node.y, node.z),
        new Vector3(next.x, next.y, next.z),
      ])
      const material = new LineBasicMaterial({ color: 0xc2ff39, transparent: true, opacity: 0 })
      const line = new Line(geometry, material)
      group.add(line)
      return { line, geometry, material }
    })
    const fieldMaterial = shader ? createDataFieldMaterial() : null
    const fieldGeometry = shader ? new PlaneGeometry(15, 8) : null
    if (fieldMaterial && fieldGeometry) {
      const field = new Mesh(fieldGeometry, fieldMaterial)
      field.position.z = -3.2
      scene.add(field)
    }
    const draw = (ms: number) => {
      const state = advancedState(ms)
      const virtual = cameraAt(spatialCameraPath, reduced ? 8000 : ms)
      const pose = threeCameraPose(virtual, width < height ? 18 : 11.5)
      camera.position.set(pose.x, pose.y, pose.z)
      camera.lookAt(pose.targetX, pose.targetY, pose.targetZ)
      camera.updateMatrixWorld(true)
      nodes.forEach(({ mesh, material }, index) => {
        const active = index <= state.activeIndex
        material.color.set(active ? new Color(0x8dab65) : new Color(0x39423f))
        material.emissive.set(active ? new Color(0x304518) : new Color(0x121a14))
        mesh.scale.setScalar(active ? 1.05 : 1)
      })
      links.forEach(({ material }, index) => {
        material.opacity = index < state.activeIndex ? 0.85 : 0.08
      })
      if (fieldMaterial) fieldMaterial.uniforms.uTime.value = ms
      scene.updateMatrixWorld(true)
      let overflow = false
      for (const { mesh, geometry } of nodes) {
        geometry.computeBoundingBox()
        const box = geometry.boundingBox
        if (!box) continue
        for (const x of [box.min.x, box.max.x])
          for (const y of [box.min.y, box.max.y]) {
            const projected = new Vector3(x, y, 0).applyMatrix4(mesh.matrixWorld).project(camera)
            if (Math.abs(projected.x) > 0.96 || Math.abs(projected.y) > 0.96) overflow = true
          }
      }
      element.dataset.visualOverflow = overflow ? 'true' : 'false'
      renderer.render(scene, camera)
      element.dataset.visualReady = 'true'
      element.dataset.drawCalls = String(renderer.info.render.calls)
      element.dataset.triangles = String(renderer.info.render.triangles)
      element.dataset.geometries = String(renderer.info.memory.geometries)
    }
    renderTime.current = draw
    draw(timeMs)
    const resize = new ResizeObserver(() => {
      const nextWidth = Math.max(1, element.clientWidth)
      const nextHeight = Math.max(1, element.clientHeight)
      camera.aspect = nextWidth / nextHeight
      camera.position.z = nextWidth < nextHeight ? 18 : 11.5
      group.scale.setScalar(nextWidth < nextHeight ? 0.72 : 1)
      camera.updateProjectionMatrix()
      renderer.setSize(nextWidth, nextHeight)
      draw(timeMs)
    })
    resize.observe(element)
    return () => {
      resize.disconnect()
      renderTime.current = () => {}
      nodes.forEach(({ geometry, material }) => {
        geometry.dispose()
        material.dispose()
      })
      links.forEach(({ geometry, material }) => {
        geometry.dispose()
        material.dispose()
      })
      fieldGeometry?.dispose()
      fieldMaterial?.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [reduced, shader])

  useEffect(() => {
    renderTime.current(timeMs)
  }, [timeMs])
  return (
    <div
      className={className}
      ref={host}
      data-engine={fallback || reduced ? 'canvas-fallback' : 'three'}
    >
      {(fallback || reduced) && (
        <SignalField timeMs={timeMs} className="spatial-network__fallback" />
      )}
    </div>
  )
}
