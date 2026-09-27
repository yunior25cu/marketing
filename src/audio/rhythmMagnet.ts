import sourceUrl from '../../assets/audio/music/bensound-rhythmmagnet.mp3?url'

export const rhythmMagnetSourceUrl = sourceUrl
export const rhythmMagnetSourceStartSeconds = 8
export const rhythmMagnetSourceEndSeconds = 20
export const rhythmMagnetDurationMs =
  (rhythmMagnetSourceEndSeconds - rhythmMagnetSourceStartSeconds) * 1000
export const rhythmMagnetVideoStartMs = 1000
export const rhythmMagnetVideoEndMs = rhythmMagnetVideoStartMs + 10000
