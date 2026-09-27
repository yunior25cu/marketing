import { useEffect, useRef, useState } from 'react'
import { soundRegistry, renderAudio } from '../../scripts/audio-core.mjs'
import { SignalField } from '@/visual-engine/canvas/SignalField'
import { SpatialNetwork } from '@/visual-engine/three/SpatialNetwork'
import { useReducedMotion } from '@/renderer/useTimeline'
import './advanced-labs.css'

export function VisualEngineLab() {
  const reduced = useReducedMotion()
  return (
    <section className="lab-section">
      <div className="lab-section__head">
        <span className="eyebrow">08 / VISUAL ENGINE</span>
        <h2>El medio sigue al concepto.</h2>
        <p>
          Cinco técnicas, una misma relación operativa. La profundidad sólo aparece cuando ayuda a
          leer la propagación.
        </p>
      </div>
      <div className="engine-grid">
        <article>
          <span className="micro-label">DOM / ESTADO</span>
          <div className="engine-grid__sample engine-grid__dom">
            VENTA <b>CONFIRMADA</b>
          </div>
          <p>Texto y estados discretos.</p>
        </article>
        <article>
          <span className="micro-label">SVG / CONEXIÓN</span>
          <div className="engine-grid__sample">
            <svg viewBox="0 0 300 120" role="img" aria-label="Venta conectada con inventario">
              <circle cx="45" cy="60" r="15" fill="#c2ff39" />
              <path d="M60 60 H240" stroke="#c2ff39" strokeWidth="3" />
              <circle cx="255" cy="60" r="15" fill="#c2ff39" />
            </svg>
          </div>
          <p>Línea nítida entre dos eventos.</p>
        </article>
        <article>
          <span className="micro-label">CANVAS / CAMPO</span>
          <div className="engine-grid__sample">
            <SignalField timeMs={4800} />
          </div>
          <p>Muchas señales con dibujo 2D.</p>
        </article>
        <article>
          <span className="micro-label">THREE.JS / PROFUNDIDAD</span>
          <div className="engine-grid__sample">
            <SpatialNetwork timeMs={4800} reduced={reduced} shader={false} />
          </div>
          <p>Cámara y nodos a distintas profundidades.</p>
        </article>
        <article>
          <span className="micro-label">SHADER / GRID DE DATOS</span>
          <div className="engine-grid__sample">
            <SpatialNetwork timeMs={6400} reduced={reduced} shader />
          </div>
          <p>Campo procedural tenue para orientar el espacio.</p>
        </article>
      </div>
    </section>
  )
}

export function SoundLab() {
  const context = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const [playing, setPlaying] = useState<string | null>(null)
  useEffect(
    () => () => {
      try {
        sourceRef.current?.stop()
      } catch {
        /* source already ended */
      }
      sourceRef.current?.disconnect()
      void context.current?.close()
    },
    [],
  )
  const play = async (id: string) => {
    if (!context.current) context.current = new AudioContext({ sampleRate: 48000 })
    await context.current.resume()
    const duration = Math.ceil((soundRegistry[id].duration + 0.1) * 1000)
    const samples = renderAudio(
      {
        duration,
        tracks: [{ id: 'sfx', category: 'SFX', gain: 0.55 }],
        cues: [{ id, at: 0, sound: id, track: 'sfx', event: id }],
      },
      { sampleRate: context.current.sampleRate },
    )
    const buffer = context.current.createBuffer(1, samples.length, context.current.sampleRate)
    buffer.copyToChannel(new Float32Array(samples), 0)
    const source = context.current.createBufferSource()
    try {
      sourceRef.current?.stop()
    } catch {
      /* source already ended */
    }
    sourceRef.current?.disconnect()
    source.buffer = buffer
    source.connect(context.current.destination)
    source.onended = () => setPlaying(null)
    source.start()
    sourceRef.current = source
    setPlaying(id)
  }
  return (
    <section className="lab-section">
      <div className="lab-section__head">
        <span className="eyebrow">09 / SOUND LAB</span>
        <h2>Sonido con función.</h2>
        <p>Escuchá cinco señales originales. Son síntesis procedural, sin archivos externos.</p>
      </div>
      <div className="sound-grid">
        {Object.entries(soundRegistry).map(([id, sound]) => (
          <button key={id} className="sound-grid__item" onClick={() => void play(id)}>
            <span className="micro-label">
              {sound.category} / {Math.round(sound.duration * 1000)} MS
            </span>
            <strong>{id.replace('-', ' ').toUpperCase()}</strong>
            <span>{sound.description}</span>
            <em>{playing === id ? 'SONANDO' : 'ESCUCHAR ↗'}</em>
          </button>
        ))}
      </div>
    </section>
  )
}
