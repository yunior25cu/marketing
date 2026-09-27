import { describe, expect, it, vi } from 'vitest'
import {
  activeAudioCues,
  advancedAudioTimeline,
  audioStats,
  encodeWav,
  renderAudio,
  validateAudioTimeline,
} from '../scripts/audio-core.mjs'
import { advancedCheckpoints, advancedState } from '@/visual-engine/core/timeline'
import { canUseWebGL2, selectVisualLevel } from '@/visual-engine/core/selection'
import { selectedAgentIds } from '../scripts/orchestrator-core.mjs'
import manifest from '../agents/orchestration.config.json'

describe('advanced visual and audio timeline', () => {
  it('selects the simplest useful visual level and preserves a fallback', () => {
    expect(selectVisualLevel('mostrar una venta').level).toBe('STANDARD')
    expect(selectVisualLevel('miles de partículas').level).toBe('CANVAS')
    expect(selectVisualLevel('profundidad espacial y cámara sutil')).toEqual({
      level: 'THREE_D',
      reason: expect.any(String),
      fallback: 'CANVAS',
    })
    expect(selectVisualLevel('campo procedural de datos').level).toBe('SHADER')
    expect(selectVisualLevel('quiero un shader').level).toBe('STANDARD')
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    expect(canUseWebGL2()).toBe(false)
    getContext.mockRestore()
  })

  it('keeps visual checkpoints and node activation inside eight seconds', () => {
    expect(advancedCheckpoints[0]).toBe(0)
    expect(advancedCheckpoints.at(-1)).toBeLessThan(8000)
    expect(advancedState(-10).activeIndex).toBe(0)
    expect(advancedState(1599).activeIndex).toBe(0)
    expect(advancedState(1600).activeIndex).toBe(1)
    expect(advancedState(4800).activeIndex).toBe(3)
    expect(advancedState(9000).time).toBe(8000)
  })

  it('schedules five cues on one timeline and exports a bounded PCM WAV', () => {
    expect(validateAudioTimeline(advancedAudioTimeline)).toEqual([])
    expect(activeAudioCues(advancedAudioTimeline, 1600).map((cue) => cue.id)).toEqual(['stock'])
    const samples = renderAudio(advancedAudioTimeline, { sampleRate: 8000 })
    const stats = audioStats(samples, 8000)
    expect(stats.duration).toBe(8)
    expect(stats.peak).toBeGreaterThan(0.1)
    expect(stats.clipped).toBe(false)
    const wav = encodeWav(samples, 8000)
    expect(new TextDecoder().decode(wav.slice(0, 4))).toBe('RIFF')
    expect(wav.length).toBe(44 + 8 * 8000 * 2)
    const sfx = renderAudio(advancedAudioTimeline, { sampleRate: 8000, mode: 'sfx' })
    const ambience = renderAudio(advancedAudioTimeline, { sampleRate: 8000, mode: 'ambience' })
    expect(audioStats(ambience, 8000).peak).toBeLessThan(audioStats(sfx, 8000).peak)
  })

  it('selects new specialists only when the request needs them', () => {
    const standard = selectedAgentIds('CREATE', manifest, 'campaña simple sin sonido')
    expect(standard).not.toContain('visual-engineer')
    expect(standard).not.toContain('audio-engineer')
    const advanced = selectedAgentIds('CREATE', manifest, 'profundidad espacial y sonido')
    expect(advanced).toContain('visual-engineer')
    expect(advanced).toContain('sound-designer')
    expect(advanced).toContain('audio-engineer')
    expect(advanced).toContain('visual-qa-director')
    expect(advanced).toContain('av-quality-auditor')
  })
})
