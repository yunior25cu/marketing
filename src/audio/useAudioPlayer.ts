import { useEffect, useRef, useState } from 'react'
import { renderAudio } from '../../scripts/audio-core.mjs'
import type { AudioTimeline } from '../../scripts/audio-core.mjs'

export type AudioMode = 'mix' | 'sfx' | 'ambience' | 'music'

export function useAudioPlayer(timeline: AudioTimeline | null) {
  const context = useRef<AudioContext | null>(null)
  const source = useRef<AudioBufferSourceNode | null>(null)
  const gain = useRef<GainNode | null>(null)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [mode, setMode] = useState<AudioMode>('mix')
  const [layers, setLayers] = useState<Record<'SFX' | 'AMBIENCE' | 'MUSIC', boolean>>({
    SFX: true,
    AMBIENCE: true,
    MUSIC: true,
  })
  const [error, setError] = useState<string | null>(null)

  const stop = () => {
    try {
      source.current?.stop()
    } catch {
      /* already stopped */
    }
    source.current?.disconnect()
    source.current = null
  }

  const playAt = async (timeMs: number) => {
    if (!timeline || timeMs >= timeline.duration) return
    try {
      if (!context.current) context.current = new AudioContext({ sampleRate: 48000 })
      await context.current.resume()
      stop()
      const samples = renderAudio(timeline, {
        sampleRate: context.current.sampleRate,
        mode,
        enabledCategories:
          mode === 'mix'
            ? Object.entries(layers)
                .filter(([, enabled]) => enabled)
                .map(([category]) => category as 'SFX' | 'AMBIENCE' | 'MUSIC')
            : undefined,
      })
      const buffer = context.current.createBuffer(1, samples.length, context.current.sampleRate)
      buffer.copyToChannel(new Float32Array(samples), 0)
      const next = context.current.createBufferSource()
      const nextGain = context.current.createGain()
      next.buffer = buffer
      nextGain.gain.value = muted ? 0 : volume
      next.connect(nextGain).connect(context.current.destination)
      next.start(0, Math.max(0, timeMs / 1000))
      source.current = next
      gain.current = nextGain
      setError(null)
    } catch {
      setError('El navegador requiere un gesto para habilitar audio. Volvé a pulsar Reproducir.')
    }
  }

  useEffect(() => {
    if (gain.current) gain.current.gain.value = muted ? 0 : volume
  }, [muted, volume])
  useEffect(
    () => () => {
      stop()
      void context.current?.close()
    },
    [],
  )
  const setLayerEnabled = (category: 'SFX' | 'AMBIENCE' | 'MUSIC', enabled: boolean) =>
    setLayers((current) => ({ ...current, [category]: enabled }))
  return {
    muted,
    setMuted,
    volume,
    setVolume,
    mode,
    setMode,
    layers,
    setLayerEnabled,
    error,
    playAt,
    stop,
  }
}
