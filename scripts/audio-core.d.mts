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
  id?: string
  version?: number | string
  palette?: Record<string, unknown>
  ambience?: { transmissionLift: number; liftStart: number; liftEnd: number }
  duration: number
  tracks: (AudioTrack & Record<string, unknown>)[]
  cues: AudioCue[]
  music?: {
    id: string
    bpm: number
    start: number
    end: number
    fadeIn: number
    fadeOut: number
    ducking?: { at: number; duration: number; gain: number }
  }
}
export const soundRegistry: Record<
  string,
  { category: string; duration: number; frequency: number; description: string }
>
export const advancedAudioTimeline: AudioTimeline
export const continuousAudioTimeline: AudioTimeline
export const facturacionAudioTimeline: AudioTimeline & { id: 'facturacion-electronica-uy-01' }
export const facturacionAudioTimelineV2: AudioTimeline & {
  id: 'facturacion-electronica-uy-01-v2'
  version: 2
}
export const facturacionAudioTimelineV21B: AudioTimeline & {
  id: 'facturacion-electronica-uy-01-v2.1-b'
  version: '2.1'
}
export const facturacionAudioTimelineV21C: AudioTimeline & {
  id: 'facturacion-electronica-uy-01-v2.1-c'
  version: '2.1'
  music: NonNullable<AudioTimeline['music']> & { timbre: string }
}
export interface AudioAsset {
  id: string
  filename: string | null
  type: string
  category: string
  tags: string[]
  duration: number
  source: string
  sourceUrl: string | null
  license: string
  commercialUse: boolean
  attributionRequired: boolean
  author: string
  downloadDate: string | null
  sha256: string | null
  energy: string
  character: string
  mood: string[]
  notes: string
}
export const audioAssetRegistry: Record<string, AudioAsset>
export function searchAudioAssets(query?: {
  q?: string
  type?: string
  category?: string
  energy?: string
  commercialUse?: boolean
  minDuration?: number
  maxDuration?: number
  mood?: string
  license?: string
  attributionRequired?: boolean
}): AudioAsset[]
export function validateAudioLicenseGate(assetIds: string[]): string[]
export function validateAudioTimeline(timeline: AudioTimeline): string[]
export function activeAudioCues(timeline: AudioTimeline, timeMs: number): AudioCue[]
export function renderAudio(
  timeline: AudioTimeline,
  options?: {
    sampleRate?: number
    mode?: string
    volume?: number
    enabledCategories?: Array<'SFX' | 'AMBIENCE' | 'MUSIC'>
  },
): Float32Array
export function audioStats(
  samples: Float32Array,
  sampleRate: number,
): { duration: number; peak: number; rms: number; clipped: boolean }
export function encodeWav(samples: Float32Array, sampleRate?: number): Uint8Array
