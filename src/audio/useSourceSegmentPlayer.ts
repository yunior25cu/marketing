import { useCallback, useEffect, useRef, useState } from 'react'

export function useSourceSegmentPlayer(sourceStartSeconds: number, segmentDurationSeconds: number) {
  const element = useRef<HTMLAudioElement>(null)
  const stopTimer = useRef<number | null>(null)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!element.current) return
    element.current.muted = muted
    element.current.volume = volume
  }, [muted, volume])

  useEffect(() => {
    const player = element.current
    if (!player) return
    const updatePlaying = () => setPlaying(!player.paused && !player.ended)
    player.addEventListener('play', updatePlaying)
    player.addEventListener('pause', updatePlaying)
    player.addEventListener('ended', updatePlaying)
    return () => {
      player.removeEventListener('play', updatePlaying)
      player.removeEventListener('pause', updatePlaying)
      player.removeEventListener('ended', updatePlaying)
    }
  }, [])

  const seekToMaster = useCallback(
    (masterTimeMs: number) => {
      if (!element.current) return
      if (stopTimer.current !== null) window.clearTimeout(stopTimer.current)
      stopTimer.current = null
      element.current.pause()
      element.current.currentTime =
        sourceStartSeconds +
        Math.max(0, Math.min(segmentDurationSeconds * 1000, masterTimeMs)) / 1000
      setError(null)
    },
    [segmentDurationSeconds, sourceStartSeconds],
  )

  const playAtMaster = useCallback(
    async (masterTimeMs: number) => {
      if (!element.current) return
      const time = Math.max(0, masterTimeMs)
      const boundedTime = Math.min(segmentDurationSeconds * 1000, time)
      if (stopTimer.current !== null) window.clearTimeout(stopTimer.current)
      stopTimer.current = null
      if (boundedTime >= segmentDurationSeconds * 1000) {
        element.current.pause()
        return
      }
      element.current.currentTime = sourceStartSeconds + boundedTime / 1000
      try {
        await element.current.play()
        const remainingMs = segmentDurationSeconds * 1000 - boundedTime
        stopTimer.current = window.setTimeout(() => {
          element.current?.pause()
          if (element.current)
            element.current.currentTime = sourceStartSeconds + segmentDurationSeconds
          stopTimer.current = null
        }, remainingMs)
        setError(null)
      } catch {
        setError('No se pudo iniciar la música. Volvé a pulsar Escuchar.')
      }
    },
    [segmentDurationSeconds, sourceStartSeconds],
  )

  const pause = useCallback(() => {
    if (stopTimer.current !== null) window.clearTimeout(stopTimer.current)
    stopTimer.current = null
    element.current?.pause()
  }, [])

  useEffect(
    () => () => {
      if (stopTimer.current !== null) window.clearTimeout(stopTimer.current)
    },
    [],
  )

  return {
    element,
    muted,
    setMuted,
    playing,
    volume,
    setVolume,
    error,
    playAtMaster,
    seekToMaster,
    pause,
  }
}
