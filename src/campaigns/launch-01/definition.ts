export const launch01 = {
  id: 'launch-01',
  title: 'NO SON MÓDULOS.',
  duration: 10000,
  phases: [
    { id: 'premise', from: 0, to: 1700, label: 'Premisa' },
    { id: 'event', from: 1700, to: 7700, label: 'Demostración' },
    { id: 'resolution', from: 7700, to: 10000, label: 'Resolución' },
  ],
} as const

export function campaignPhase(timeMs: number) {
  const t = Math.max(0, Math.min(launch01.duration, timeMs))
  return launch01.phases.find((phase) => t >= phase.from && t < phase.to)?.id ?? 'resolution'
}
