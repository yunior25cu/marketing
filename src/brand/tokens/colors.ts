export const colors = {
  obsidian: '#0B0D0E',
  graphite: '#16191C',
  surface: '#1D2125',
  bone: '#F3F0E8',
  mist: '#C9CED2',
  signal: '#C7FF3D',
  signalSoft: '#E3FFA0',
  warning: '#E8B866',
  danger: '#DF7873',
  muted: '#818A8C',
  line: '#343B3E',
  signalDark: '#637F1B',
} as const

export type ColorToken = keyof typeof colors
