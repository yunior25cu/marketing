import { useEffect, useRef, useState } from 'react'
import {
  soundRegistry,
  audioAssetRegistry,
  searchAudioAssets,
  renderAudio,
} from '../../scripts/audio-core.mjs'
import type { AudioTimeline } from '../../scripts/audio-core.mjs'
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
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('ALL')
  const [musicEnergy, setMusicEnergy] = useState('ALL')
  const [musicMood, setMusicMood] = useState('ALL')
  const [musicLicense, setMusicLicense] = useState('ALL')
  const [musicSource, setMusicSource] = useState('ALL')
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('balaxys-audio-favorites') ?? '[]')
    } catch {
      return []
    }
  })
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
    if (playing === id) {
      sourceRef.current?.stop()
      setPlaying(null)
      return
    }
    if (!context.current) context.current = new AudioContext({ sampleRate: 48000 })
    await context.current.resume()
    const isMusic = id === 'balaxys-minimal-pulse-v1'
    const duration = isMusic ? 5000 : Math.ceil((soundRegistry[id].duration + 0.1) * 1000)
    const timeline: AudioTimeline = isMusic
      ? {
          duration,
          tracks: [{ id: 'music', category: 'MUSIC', gain: 0.5 }],
          cues: [],
          music: { id, bpm: 96, start: 0, end: 4.6, fadeIn: 0.2, fadeOut: 0.7 },
        }
      : {
          duration,
          tracks: [{ id: 'sfx', category: 'SFX', gain: 0.55 }],
          cues: [{ id, at: 0, sound: id, track: 'sfx', event: id }],
        }
    const samples = renderAudio(timeline, { sampleRate: context.current.sampleRate })
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
  const sfxAssets = searchAudioAssets({ q: query, type: 'SFX' }).filter(
    (asset) => category === 'ALL' || asset.category === category,
  )
  const musicAsset = audioAssetRegistry['balaxys-minimal-pulse-v1']
  const musicVisible =
    (musicEnergy === 'ALL' || musicAsset.energy === musicEnergy) &&
    (musicMood === 'ALL' || musicAsset.mood.includes(musicMood)) &&
    (musicLicense === 'ALL' || musicAsset.license === musicLicense) &&
    (musicSource === 'ALL' || musicAsset.source === musicSource)
  return (
    <section className="lab-section">
      <div className="lab-section__head">
        <span className="eyebrow">09 / SOUND LAB</span>
        <h2>Sonido con función.</h2>
        <p>Buscá por función y carácter. Las previews son síntesis procedural original.</p>
      </div>
      <label>
        Buscar categoría o tags{' '}
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="confirmation, precise, data..."
        />
      </label>
      <label>
        Category{' '}
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="ALL">All categories</option>
          {Array.from(
            new Set(searchAudioAssets({ type: 'SFX' }).map((asset) => asset.category)),
          ).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <div className="sound-grid">
        {sfxAssets.map((asset) => {
          const { id } = asset
          const sound = soundRegistry[id]
          if (!sound) return null
          return (
            <article key={id} className="sound-grid__item">
              <span className="micro-label">
                {asset.category} / {Math.round(sound.duration * 1000)} MS / {asset.energy} /{' '}
                {asset.character}
              </span>
              <strong>{id.replace('-', ' ').toUpperCase()}</strong>
              <span>{sound.description}</span>
              <span>Tags: {asset.tags.join(', ')}</span>
              <span>
                Origen: {asset.source} / Licencia: {asset.license} / Uso comercial: sí
              </span>
              <button className="button" onClick={() => void play(id)}>
                {playing === id ? 'Pausar' : 'Escuchar'}
              </button>
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation()
                  const next = favoriteIds.includes(id)
                    ? favoriteIds.filter((item) => item !== id)
                    : [...favoriteIds, id]
                  setFavoriteIds(next)
                  localStorage.setItem('balaxys-audio-favorites', JSON.stringify(next))
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    event.stopPropagation()
                    const next = favoriteIds.includes(id)
                      ? favoriteIds.filter((item) => item !== id)
                      : [...favoriteIds, id]
                    setFavoriteIds(next)
                    localStorage.setItem('balaxys-audio-favorites', JSON.stringify(next))
                  }
                }}
              >
                {favoriteIds.includes(id) ? '★ Favorito' : '☆ Marcar favorito'}
              </span>
            </article>
          )
        })}
      </div>
      <section aria-label="Music Lab">
        <h3>Music Lab / sound beds</h3>
        <div className="music-lab-filters">
          <label>
            Mood{' '}
            <select value={musicMood} onChange={(event) => setMusicMood(event.target.value)}>
              <option value="ALL">All moods</option>
              <option value="precise">Precise</option>
              <option value="modern">Modern</option>
              <option value="controlled">Controlled</option>
            </select>
          </label>
          <label>
            Energy{' '}
            <select value={musicEnergy} onChange={(event) => setMusicEnergy(event.target.value)}>
              <option value="ALL">All energies</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
          <label>
            License{' '}
            <select value={musicLicense} onChange={(event) => setMusicLicense(event.target.value)}>
              <option value="ALL">Any resolved license</option>
              <option value="Original procedural synthesis; no third-party samples">
                Balaxys original
              </option>
            </select>
          </label>
          <label>
            Source{' '}
            <select value={musicSource} onChange={(event) => setMusicSource(event.target.value)}>
              <option value="ALL">All sources</option>
              <option value="Balaxys Brand OS">Balaxys Brand OS</option>
            </select>
          </label>
        </div>
        {musicVisible ? (
          <article className="sound-grid__item">
            <span className="micro-label">MUSIC / 96 BPM / LOW ENERGY / PROCEDURAL</span>
            <strong>BALAXYS MINIMAL PULSE V1</strong>
            <span>
              Textura tonal sobria, pulso lento y resolución contenida; no usa muestras externas.
            </span>
            <span>
              Origen: {audioAssetRegistry['balaxys-minimal-pulse-v1'].source} / Licencia:{' '}
              {audioAssetRegistry['balaxys-minimal-pulse-v1'].license}
            </span>
            <button className="button" onClick={() => void play('balaxys-minimal-pulse-v1')}>
              {playing === 'balaxys-minimal-pulse-v1' ? 'Sonando' : 'Escuchar preview'}
            </button>
          </article>
        ) : (
          <p>No hay pistas que coincidan con estos filtros.</p>
        )}
      </section>
    </section>
  )
}
