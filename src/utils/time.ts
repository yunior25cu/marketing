export function seconds(ms: number) {
  return `${(Math.max(0, ms) / 1000).toFixed(1)}s`
}
