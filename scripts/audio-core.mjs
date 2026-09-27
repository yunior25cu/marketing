export const soundRegistry = {
  'signal-pulse': {
    category: 'SFX',
    duration: 0.24,
    frequency: 620,
    description: 'Inicio de operación',
  },
  connection: {
    category: 'SFX',
    duration: 0.32,
    frequency: 440,
    description: 'Relación entre áreas',
  },
  confirmation: {
    category: 'SFX',
    duration: 0.36,
    frequency: 740,
    description: 'Estado confirmado',
  },
  warning: { category: 'SFX', duration: 0.42, frequency: 290, description: 'Advertencia discreta' },
  'final-impact': {
    category: 'SFX',
    duration: 0.62,
    frequency: 220,
    description: 'Convergencia final',
  },
  'line-build': {
    category: 'SFX',
    duration: 0.58,
    frequency: 360,
    description: 'Trazo que se convierte en valor',
  },
}

export const advancedAudioTimeline = {
  duration: 8000,
  tracks: [
    { id: 'sfx', category: 'SFX', gain: 0.58 },
    { id: 'ambience', category: 'AMBIENCE', gain: 0.045 },
  ],
  cues: [
    { id: 'origin', at: 200, sound: 'signal-pulse', track: 'sfx', event: 'venta:confirmada' },
    { id: 'stock', at: 1600, sound: 'connection', track: 'sfx', event: 'inventario:activado' },
    { id: 'finance', at: 3200, sound: 'connection', track: 'sfx', event: 'finanzas:activado' },
    { id: 'accounting', at: 4800, sound: 'confirmation', track: 'sfx', event: 'registro:activado' },
    { id: 'convergence', at: 6600, sound: 'final-impact', track: 'sfx', event: 'cadena:completa' },
  ],
}

export const continuousAudioTimeline = {
  duration: 10000,
  tracks: [
    { id: 'sfx', category: 'SFX', gain: 0.54 },
    { id: 'ambience', category: 'AMBIENCE', gain: 0.035 },
  ],
  cues: [
    { id: 'stock-origin', at: 180, sound: 'signal-pulse', track: 'sfx', event: 'stock:18' },
    { id: 'stock-split', at: 1160, sound: 'connection', track: 'sfx', event: 'stock:18->17' },
    { id: 'line-build', at: 2450, sound: 'line-build', track: 'sfx', event: 'fragmento:linea' },
    {
      id: 'document-record',
      at: 4050,
      sound: 'connection',
      track: 'sfx',
      event: 'linea:documento',
    },
    {
      id: 'accounting-resolve',
      at: 6160,
      sound: 'confirmation',
      track: 'sfx',
      event: 'documento:registro',
    },
    {
      id: 'brand-resolve',
      at: 8620,
      sound: 'final-impact',
      track: 'sfx',
      event: 'composicion:balaxys',
    },
  ],
}

export function validateAudioTimeline(timeline) {
  const errors = []
  if (!Number.isInteger(timeline.duration) || timeline.duration <= 0)
    errors.push('Duración inválida')
  const tracks = new Set(timeline.tracks.map((track) => track.id))
  for (const cue of timeline.cues) {
    const sound = soundRegistry[cue.sound]
    if (!sound) errors.push(`Sonido desconocido: ${cue.sound}`)
    if (!tracks.has(cue.track)) errors.push(`Pista desconocida: ${cue.track}`)
    if (
      !Number.isFinite(cue.at) ||
      cue.at < 0 ||
      cue.at + (sound?.duration ?? 0) * 1000 > timeline.duration
    )
      errors.push(`Cue fuera de la campaña: ${cue.id}`)
  }
  return errors
}

export function activeAudioCues(timeline, timeMs) {
  return timeline.cues.filter((cue) => {
    const sound = soundRegistry[cue.sound]
    return sound && timeMs >= cue.at && timeMs < cue.at + sound.duration * 1000
  })
}

function synthSample(sound, seconds) {
  const definition = soundRegistry[sound]
  const length = definition.duration
  const envelope = Math.min(1, seconds / 0.014) * Math.pow(Math.max(0, 1 - seconds / length), 2.2)
  const frequency =
    definition.frequency * (sound === 'final-impact' ? 1 - (0.22 * seconds) / length : 1)
  const tone = Math.sin(2 * Math.PI * frequency * seconds)
  const harmonic = Math.sin(2 * Math.PI * frequency * 2 * seconds) * 0.16
  return (tone + harmonic) * envelope
}

/** Deterministic PCM shared by browser preview and offline WAV export. */
export function renderAudio(timeline, { sampleRate = 48000, mode = 'mix', volume = 1 } = {}) {
  const length = Math.round((timeline.duration / 1000) * sampleRate)
  const samples = new Float32Array(length)
  const enabled = (track) => mode === 'mix' || mode === track.category.toLowerCase()
  for (const track of timeline.tracks) {
    if (!enabled(track)) continue
    if (track.category === 'AMBIENCE') {
      for (let index = 0; index < length; index++) {
        const time = index / sampleRate
        const fade = Math.min(1, time / 0.35, (timeline.duration / 1000 - time) / 0.45)
        samples[index] +=
          (Math.sin(2 * Math.PI * 55 * time) * 0.55 + Math.sin(2 * Math.PI * 82.4 * time) * 0.3) *
          track.gain *
          Math.max(0, fade)
      }
    }
    for (const cue of timeline.cues.filter((item) => item.track === track.id)) {
      const sound = soundRegistry[cue.sound]
      if (!sound) continue
      const start = Math.round((cue.at / 1000) * sampleRate)
      const count = Math.round(sound.duration * sampleRate)
      for (let offset = 0; offset < count && start + offset < length; offset++)
        samples[start + offset] += synthSample(cue.sound, offset / sampleRate) * track.gain
    }
  }
  for (let index = 0; index < length; index++) samples[index] *= volume
  const peak = samples.reduce((highest, sample) => Math.max(highest, Math.abs(sample)), 0)
  if (peak > 0.9) for (let index = 0; index < length; index++) samples[index] *= 0.9 / peak
  return samples
}

export function audioStats(samples, sampleRate) {
  let peak = 0
  let squares = 0
  for (const sample of samples) {
    peak = Math.max(peak, Math.abs(sample))
    squares += sample * sample
  }
  return {
    duration: samples.length / sampleRate,
    peak,
    rms: Math.sqrt(squares / samples.length),
    clipped: peak >= 0.999,
  }
}

export function encodeWav(samples, sampleRate = 48000) {
  const bytes = new Uint8Array(44 + samples.length * 2)
  const view = new DataView(bytes.buffer)
  const put = (offset, text) => {
    for (let index = 0; index < text.length; index++) bytes[offset + index] = text.charCodeAt(index)
  }
  put(0, 'RIFF')
  view.setUint32(4, bytes.length - 8, true)
  put(8, 'WAVE')
  put(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  put(36, 'data')
  view.setUint32(40, samples.length * 2, true)
  for (let index = 0; index < samples.length; index++)
    view.setInt16(
      44 + index * 2,
      Math.round(Math.max(-1, Math.min(1, samples[index])) * 32767),
      true,
    )
  return bytes
}
