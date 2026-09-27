export const soundRegistry = {
  'signal-pulse': {
    category: 'SFX',
    semanticCategory: 'signal',
    tags: ['trigger', 'precise', 'digital', 'operation'],
    energy: 'LOW',
    character: 'DIGITAL',
    duration: 0.24,
    frequency: 620,
    description: 'Inicio de operación',
  },
  connection: {
    category: 'SFX',
    semanticCategory: 'connection',
    tags: ['connection', 'movement', 'digital', 'precise'],
    energy: 'LOW',
    character: 'PRECISE',
    duration: 0.32,
    frequency: 440,
    description: 'Relación entre áreas',
  },
  confirmation: {
    category: 'SFX',
    semanticCategory: 'confirmation',
    tags: ['confirmation', 'positive', 'precise', 'tonal'],
    energy: 'LOW',
    character: 'TONAL',
    duration: 0.36,
    frequency: 740,
    description: 'Estado confirmado',
  },
  warning: {
    category: 'SFX',
    semanticCategory: 'warning',
    tags: ['warning', 'dark', 'technical'],
    energy: 'MEDIUM',
    character: 'TONAL',
    duration: 0.42,
    frequency: 290,
    description: 'Advertencia discreta',
  },
  'final-impact': {
    category: 'SFX',
    semanticCategory: 'impact',
    tags: ['impact', 'resolve', 'low', 'tonal'],
    energy: 'MEDIUM',
    character: 'TONAL',
    duration: 0.62,
    frequency: 220,
    description: 'Convergencia final',
  },
  'line-build': {
    category: 'SFX',
    semanticCategory: 'transition',
    tags: ['transition', 'construction', 'document', 'precise'],
    energy: 'LOW',
    character: 'TEXTURAL',
    duration: 0.58,
    frequency: 360,
    description: 'Trazo que se convierte en valor',
  },
  'data-glide': {
    category: 'SFX',
    duration: 0.42,
    frequency: 510,
    description: 'Desplazamiento de datos',
    semanticCategory: 'data',
    tags: ['digital', 'movement', 'data', 'precise'],
    energy: 'LOW',
    character: 'DIGITAL',
  },
  'transaction-tick': {
    category: 'SFX',
    duration: 0.28,
    frequency: 390,
    description: 'Transferencia contenida',
    semanticCategory: 'transaction',
    tags: ['transaction', 'technical', 'financial', 'precise'],
    energy: 'LOW',
    character: 'PRECISE',
  },
  'soft-confirm': {
    category: 'SFX',
    duration: 0.48,
    frequency: 660,
    description: 'Respuesta controlada, sin tono de aprobación fiscal',
    semanticCategory: 'confirmation',
    tags: ['confirmation', 'soft', 'positive', 'precise'],
    energy: 'LOW',
    character: 'TONAL',
  },
  'resolve-harmonic': {
    category: 'SFX',
    duration: 0.82,
    frequency: 330,
    description: 'Resolución armónica breve',
    semanticCategory: 'brand',
    tags: ['brand', 'resolve', 'tonal', 'minimal'],
    energy: 'LOW',
    character: 'TONAL',
  },
}

const originalLicense = {
  source: 'Balaxys Brand OS',
  sourceUrl: null,
  license: 'Original procedural synthesis; no third-party samples',
  commercialUse: true,
  attributionRequired: false,
  author: 'Balaxys Brand OS',
  downloadDate: null,
  sha256: null,
  generatorVersion: '2.0',
}
export const audioAssetRegistry = Object.fromEntries(
  Object.entries(soundRegistry).map(([id, sound]) => [
    id,
    {
      id,
      filename: null,
      type: 'SFX',
      category: sound.semanticCategory ?? sound.category,
      tags: sound.tags ?? ['precise', 'digital'],
      duration: sound.duration,
      energy: sound.energy ?? 'LOW',
      character: sound.character ?? 'DIGITAL',
      mood: ['precise', 'modern'],
      ...originalLicense,
      notes: 'Deterministic synthesis generated in memory.',
    },
  ]),
)
audioAssetRegistry['balaxys-minimal-pulse-v1'] = {
  id: 'balaxys-minimal-pulse-v1',
  filename: null,
  type: 'MUSIC',
  category: 'MUSIC',
  tags: ['minimal', 'electronic', 'rhythmic', 'technological'],
  duration: 10,
  bpm: 96,
  energy: 'LOW',
  character: 'TONAL',
  mood: ['precise', 'modern', 'controlled'],
  ...originalLicense,
  notes: 'Procedural sound bed; original prototype; not a stock library recording.',
}
audioAssetRegistry['balaxys-tech-room-v1'] = {
  id: 'balaxys-tech-room-v1',
  filename: null,
  type: 'AMBIENCE',
  category: 'AMBIENCE',
  tags: ['technology', 'minimal', 'abstract', 'texture'],
  duration: 10,
  energy: 'LOW',
  character: 'TEXTURAL',
  mood: ['controlled', 'modern'],
  ...originalLicense,
  notes: 'Low-level procedural tonal texture generated in memory.',
}

export function searchAudioAssets(query = {}) {
  const terms = String(query.q ?? '')
    .toLowerCase()
    .replace(/\blow-energy\b/g, 'low energy')
    .replace(/[^a-z0-9 -]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  return Object.values(audioAssetRegistry).filter((asset) => {
    const searchable = [
      asset.id,
      asset.category,
      asset.type,
      asset.energy,
      `${asset.energy} energy`,
      asset.character,
      ...asset.tags,
      ...asset.mood,
    ]
      .join(' ')
      .toLowerCase()
    return (
      terms.every((term) => searchable.includes(term)) &&
      (!query.type || asset.type === query.type) &&
      (!query.category || asset.category === query.category) &&
      (!query.energy || asset.energy === query.energy) &&
      (!query.commercialUse || asset.commercialUse === true) &&
      (query.minDuration == null || asset.duration >= query.minDuration) &&
      (query.maxDuration == null || asset.duration <= query.maxDuration) &&
      (!query.mood || asset.mood.includes(query.mood)) &&
      (!query.license || asset.license === query.license) &&
      (query.attributionRequired == null || asset.attributionRequired === query.attributionRequired)
    )
  })
}

export function validateAudioLicenseGate(assetIds) {
  const errors = []
  for (const id of assetIds) {
    const asset = audioAssetRegistry[id]
    if (!asset) errors.push(`MISSING_AUDIO_ASSET: ${id}`)
    else if (!asset.license || asset.commercialUse !== true)
      errors.push(`AUDIO_LICENSE_GATE: ${id}`)
  }
  return errors
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

// Absolute timestamps are shared with the campaign's continuous visual transformation.
// All tracks are SFX: deliberate gaps provide hierarchy without an ambience bed.
export const facturacionAudioTimeline = {
  id: 'facturacion-electronica-uy-01',
  duration: 10000,
  tracks: [
    { id: 'operation', category: 'SFX', gain: 0.4 },
    { id: 'detail', category: 'SFX', gain: 0.21 },
    { id: 'flow', category: 'SFX', gain: 0.28 },
  ],
  cues: [
    {
      id: 'sale-origin',
      at: 350,
      sound: 'signal-pulse',
      track: 'operation',
      event: 'venta:origen',
    },
    {
      id: 'document-outline',
      at: 1550,
      sound: 'line-build',
      track: 'detail',
      event: 'importe:trazo-documental',
    },
    {
      id: 'document-lines',
      at: 2150,
      sound: 'connection',
      track: 'detail',
      event: 'trazos:documento',
    },
    { id: 'cfe-form', at: 2900, sound: 'signal-pulse', track: 'detail', event: 'documento:cfe' },
    {
      id: 'signature-pass',
      at: 3750,
      sound: 'line-build',
      track: 'flow',
      event: 'firma:recorrido',
    },
    { id: 'outbound', at: 4450, sound: 'connection', track: 'flow', event: 'documento:envio' },
    { id: 'dgi-arrival', at: 5350, sound: 'signal-pulse', track: 'detail', event: 'ruta:dgi' },
    {
      id: 'response-origin',
      at: 6050,
      sound: 'connection',
      track: 'flow',
      event: 'respuesta:regreso',
    },
    {
      id: 'response-return',
      at: 6700,
      sound: 'signal-pulse',
      track: 'operation',
      event: 'respuesta:documento',
    },
    {
      id: 'origin-link',
      at: 7600,
      sound: 'line-build',
      track: 'flow',
      event: 'documento:vinculo-origen',
    },
    {
      id: 'brand-resolution',
      at: 8650,
      sound: 'final-impact',
      track: 'operation',
      event: 'composicion:balaxys',
    },
  ],
}

// V2 keeps the exact visual clock and deliberately reduces eleven V1 accents to six.
// MUSIC is an original procedural bed, not an external stock track.
export const facturacionAudioTimelineV2 = {
  id: 'facturacion-electronica-uy-01-v2',
  version: 2,
  duration: 10000,
  palette: {
    character: ['precise', 'technological', 'controlled'],
    energy: 'LOW → MEDIUM → resolve',
    bpm: 96,
    density: 'LOW',
    music: 'balaxys-minimal-pulse-v1',
  },
  tracks: [
    { id: 'operation', category: 'SFX', gain: 0.46 },
    { id: 'detail', category: 'SFX', gain: 0.26 },
    {
      id: 'ambience',
      category: 'AMBIENCE',
      gain: 0.045,
      assetId: 'balaxys-tech-room-v1',
      start: 350,
      end: 9350,
      fadeIn: 800,
      fadeOut: 800,
    },
    { id: 'music', category: 'MUSIC', gain: 0.12 },
  ],
  cues: [
    {
      id: 'origin-trigger',
      at: 350,
      sound: 'signal-pulse',
      track: 'operation',
      event: 'VENTA:trigger',
    },
    {
      id: 'document-construct',
      at: 1680,
      sound: 'line-build',
      track: 'detail',
      event: 'document:construction',
    },
    {
      id: 'cfe-transform',
      at: 2920,
      sound: 'transaction-tick',
      track: 'detail',
      event: 'CFE:tonal-transformation',
    },
    {
      id: 'transmission',
      at: 4450,
      sound: 'data-glide',
      track: 'operation',
      event: 'transmission:spatial-movement',
    },
    {
      id: 'response',
      at: 6050,
      sound: 'soft-confirm',
      track: 'detail',
      event: 'response:controlled-return',
    },
    {
      id: 'brand-resolve',
      at: 8650,
      sound: 'resolve-harmonic',
      track: 'operation',
      event: 'brand:resolve',
    },
  ],
  music: {
    id: 'balaxys-minimal-pulse-v1',
    bpm: 96,
    start: 0.25,
    end: 9.35,
    fadeIn: 0.55,
    fadeOut: 0.8,
    ducking: { at: 6050, duration: 700, gain: 0.62 },
  },
}

export function validateAudioTimeline(timeline) {
  const errors = []
  if (!Number.isInteger(timeline.duration) || timeline.duration <= 0)
    errors.push('Duración inválida')
  const tracks = new Set(timeline.tracks.map((track) => track.id))
  for (const track of timeline.tracks)
    if (
      !['SFX', 'AMBIENCE', 'MUSIC'].includes(track.category) ||
      !Number.isFinite(track.gain) ||
      track.gain < 0 ||
      track.gain > 1
    )
      errors.push(`Pista inválida: ${track.id}`)
  if (
    timeline.music &&
    (!(timeline.music.end > timeline.music.start) ||
      timeline.music.start < 0 ||
      timeline.music.end > timeline.duration / 1000 ||
      timeline.music.fadeIn < 0 ||
      timeline.music.fadeOut < 0)
  )
    errors.push('MusicTimeline inválida')
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
  if (timeline.cues.some((cue) => cue.silence === true && cue.sound))
    errors.push('NO_SOUND no puede referir un sonido')
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
  if (['data-glide', 'transaction-tick', 'soft-confirm', 'resolve-harmonic'].includes(sound)) {
    const progress = seconds / length
    const base = definition.frequency
    if (sound === 'data-glide') {
      const frequency = base * (0.78 + progress * 0.42)
      return (
        (Math.sin(2 * Math.PI * frequency * seconds) +
          Math.sin(2 * Math.PI * frequency * 1.5 * seconds) * 0.18) *
        envelope
      )
    }
    if (sound === 'transaction-tick') {
      const transient = Math.exp(-seconds * 85) * Math.sin(2 * Math.PI * base * 2.8 * seconds)
      return (Math.sin(2 * Math.PI * base * seconds) * 0.5 + transient * 0.5) * envelope
    }
    if (sound === 'soft-confirm') {
      return (
        (Math.sin(2 * Math.PI * base * seconds) * 0.72 +
          Math.sin(2 * Math.PI * base * 1.25 * seconds) * 0.28) *
        envelope
      )
    }
    return (
      (Math.sin(2 * Math.PI * base * seconds) * 0.48 +
        Math.sin(2 * Math.PI * base * 1.25 * seconds) * 0.32 +
        Math.sin(2 * Math.PI * base * 1.5 * seconds) * 0.2) *
      envelope
    )
  }
  const frequency =
    definition.frequency * (sound === 'final-impact' ? 1 - (0.22 * seconds) / length : 1)
  const tone = Math.sin(2 * Math.PI * frequency * seconds)
  const harmonic = Math.sin(2 * Math.PI * frequency * 2 * seconds) * 0.16
  return (tone + harmonic) * envelope
}

/** Deterministic PCM shared by browser preview and offline WAV export. */
export function renderAudio(
  timeline,
  { sampleRate = 48000, mode = 'mix', volume = 1, enabledCategories } = {},
) {
  const length = Math.round((timeline.duration / 1000) * sampleRate)
  const samples = new Float32Array(length)
  const enabled = (track) =>
    enabledCategories
      ? enabledCategories.includes(track.category)
      : mode === 'mix' || mode === track.category.toLowerCase()
  for (const track of timeline.tracks) {
    if (!enabled(track)) continue
    if (track.category === 'AMBIENCE' || track.category === 'MUSIC') {
      for (let index = 0; index < length; index++) {
        const time = index / sampleRate
        const config =
          track.category === 'MUSIC'
            ? (timeline.music ?? {
                start: 0,
                end: timeline.duration / 1000,
                fadeIn: 0.55,
                fadeOut: 0.8,
              })
            : {
                start: (track.start ?? 0) / 1000,
                end: (track.end ?? timeline.duration) / 1000,
                fadeIn: (track.fadeIn ?? 350) / 1000,
                fadeOut: (track.fadeOut ?? 450) / 1000,
              }
        let fade = Math.min(
          1,
          (time - config.start) / config.fadeIn,
          (config.end - time) / config.fadeOut,
        )
        let bed
        if (track.category === 'MUSIC') {
          const music = timeline.music ?? { start: 0, end: timeline.duration / 1000, bpm: 96 }
          fade *= time < music.start || time > music.end ? 0 : 1
          const beat = time * (music.bpm / 60)
          const duck =
            music.ducking &&
            time >= music.ducking.at / 1000 &&
            time <= (music.ducking.at + music.ducking.duration) / 1000
              ? music.ducking.gain
              : 1
          bed =
            (Math.sin(2 * Math.PI * 110 * time) * 0.34 +
              Math.sin(2 * Math.PI * 164.8 * time) * 0.19 +
              Math.sin(2 * Math.PI * 220 * time) *
                (0.1 + 0.08 * Math.max(0, Math.sin(2 * Math.PI * beat)))) *
            duck
        } else
          bed = Math.sin(2 * Math.PI * 55 * time) * 0.55 + Math.sin(2 * Math.PI * 82.4 * time) * 0.3
        samples[index] += bed * track.gain * Math.max(0, fade)
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
