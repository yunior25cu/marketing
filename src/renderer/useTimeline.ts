import { useCallback, useEffect, useRef, useState } from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

export function useTimeline(duration: number, autoplay = false, initialTime = 0) {
  const reduced = useReducedMotion()
  const [time, setTime] = useState(
    reduced ? duration : Math.max(0, Math.min(duration, initialTime)),
  )
  const [playing, setPlaying] = useState(autoplay && !reduced)
  const timeRef = useRef(time)
  const startRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (reduced) {
      setPlaying(false)
      timeRef.current = duration
      setTime(duration)
    }
  }, [duration, reduced])
  useEffect(() => {
    if (!playing || reduced) return
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now - timeRef.current
      const next = Math.min(duration, now - startRef.current)
      timeRef.current = next
      setTime(next)
      if (next >= duration) {
        setPlaying(false)
        startRef.current = null
        return
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      startRef.current = null
    }
  }, [playing, duration, reduced])

  const play = useCallback(() => {
    if (!reduced) {
      if (timeRef.current >= duration) {
        timeRef.current = 0
        setTime(0)
      }
      setPlaying(true)
    }
  }, [duration, reduced])
  const pause = useCallback(() => setPlaying(false), [])
  const seek = useCallback(
    (next: number) => {
      setPlaying(false)
      timeRef.current = Math.max(0, Math.min(duration, next))
      setTime(timeRef.current)
    },
    [duration],
  )
  const replay = useCallback(() => {
    timeRef.current = 0
    setTime(0)
    setPlaying(!reduced)
  }, [reduced])
  return { time, playing, play, pause, seek, replay, reduced }
}
