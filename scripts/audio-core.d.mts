export interface AudioCue {
  id: string
  at: number
  sound: string
  track: string
  event: string
}
export interface AudioTrack {
  id: string
  category: 'SFX' | 'AMBIENCE' | 'MUSIC'
  gain: number
}
export interface AudioTimeline {
  duration: number
  tracks: AudioTrack[]
  cues: AudioCue[]
}
export const soundRegistry: Record<
  string,
  { category: string; duration: number; frequency: number; description: string }
>
export const advancedAudioTimeline: AudioTimeline
export const continuousAudioTimeline: AudioTimeline
export function validateAudioTimeline(timeline: AudioTimeline): string[]
export function activeAudioCues(timeline: AudioTimeline, timeMs: number): AudioCue[]
export function renderAudio(
  timeline: AudioTimeline,
  options?: { sampleRate?: number; mode?: string; volume?: number },
): Float32Array
export function audioStats(
  samples: Float32Array,
  sampleRate: number,
): { duration: number; peak: number; rms: number; clipped: boolean }
export function encodeWav(samples: Float32Array, sampleRate?: number): Uint8Array
