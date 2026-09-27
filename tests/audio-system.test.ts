import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import {
  audioAssetRegistry,
  audioStats,
  facturacionAudioTimeline,
  facturacionAudioTimelineV2,
  renderAudio,
  searchAudioAssets,
  validateAudioLicenseGate,
  validateAudioTimeline,
} from '../scripts/audio-core.mjs'

describe('Balaxys audio system', () => {
  it('searches by semantic tags and filters commercial assets', () => {
    expect(
      searchAudioAssets({ q: 'confirmation', commercialUse: true }).map((asset) => asset.id),
    ).toContain('soft-confirm')
    expect(
      searchAudioAssets({ q: 'confirmation / precise / low-energy' }).map((asset) => asset.id),
    ).toContain('soft-confirm')
    expect(searchAudioAssets({ type: 'MUSIC', energy: 'LOW' }).map((asset) => asset.id)).toContain(
      'balaxys-minimal-pulse-v1',
    )
  })

  it('blocks missing or unlicensed assets without fallback', () => {
    expect(validateAudioLicenseGate(['not-in-catalog'])).toContain(
      'MISSING_AUDIO_ASSET: not-in-catalog',
    )
    expect(validateAudioLicenseGate(['balaxys-minimal-pulse-v1'])).toEqual([])
    expect(audioAssetRegistry['balaxys-minimal-pulse-v1'].commercialUse).toBe(true)
  })

  it('keeps stock candidates outside the active licensed catalog', async () => {
    const candidates = JSON.parse(
      await readFile('assets/audio/manifests/candidate-manifest.json', 'utf8'),
    )
    expect(candidates.candidates).toHaveLength(3)
    expect(
      candidates.candidates.every(
        (item: { commercialUse: boolean | null; status: string }) =>
          item.commercialUse === null && item.status === 'CANDIDATE_NOT_DOWNLOADED',
      ),
    ).toBe(true)
  })

  it('pins exact V1 and V2 assets and their deterministic definitions', async () => {
    const lock = JSON.parse(
      await readFile('campaigns/facturacion-electronica-uy-01/audio-lock.json', 'utf8'),
    )
    expect(lock.versions.map((item: { version: number }) => item.version)).toEqual([1, 2])
    for (const version of lock.versions)
      for (const entry of version.assets) {
        expect(audioAssetRegistry[entry.id], `MISSING_AUDIO_ASSET: ${entry.id}`).toBeTruthy()
        expect(
          createHash('sha256').update(JSON.stringify(audioAssetRegistry[entry.id])).digest('hex'),
        ).toBe(entry.sha256)
      }
  })

  it('preserves V1 and validates the six-cue V2 music timeline', () => {
    expect(facturacionAudioTimeline.cues).toHaveLength(11)
    expect(audioStats(renderAudio(facturacionAudioTimeline), 48000).peak).toBeCloseTo(0.39698, 5)
    expect(facturacionAudioTimelineV2.cues).toHaveLength(6)
    expect(facturacionAudioTimelineV2.tracks.map((track) => track.category)).toEqual([
      'SFX',
      'SFX',
      'AMBIENCE',
      'MUSIC',
    ])
    expect(validateAudioTimeline(facturacionAudioTimeline)).toEqual([])
    expect(validateAudioTimeline(facturacionAudioTimelineV2)).toEqual([])
  })

  it('renders exact duration, deterministic cue scheduling and a faded music tail', () => {
    const one = renderAudio(facturacionAudioTimelineV2)
    const two = renderAudio(facturacionAudioTimelineV2)
    expect(one).toEqual(two)
    expect(audioStats(one, 48000).duration).toBe(10)
    expect(one[Math.round(9.8 * 48000)]).toBeCloseTo(0, 2)
    expect(renderAudio(facturacionAudioTimelineV2, { mode: 'music' })).not.toEqual(
      renderAudio(facturacionAudioTimelineV2, { mode: 'sfx' }),
    )
  })
})
