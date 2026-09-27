import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import {
  audioAssetRegistry,
  audioStats,
  facturacionAudioTimeline,
  facturacionAudioTimelineV2,
  facturacionAudioTimelineV21B,
  facturacionAudioTimelineV21C,
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

  it('keeps unlicensed candidates outside the active licensed catalog', async () => {
    const candidates = JSON.parse(
      await readFile('assets/audio/manifests/candidate-manifest.json', 'utf8'),
    )
    expect(candidates.candidates).toHaveLength(4)
    expect(
      candidates.candidates.filter(
        (item: { status: string }) => item.status === 'CANDIDATE_NOT_DOWNLOADED',
      ),
    ).toHaveLength(3)
    const rhythmMagnet = candidates.candidates.find(
      (item: { id: string }) => item.id === 'bensound-rhythm-magnet',
    )
    expect(rhythmMagnet).toMatchObject({
      status: 'SELECTED_LICENSE_PENDING',
      commercialUse: null,
      sha256: expect.stringMatching(/^[a-f0-9]{64}$/),
    })
    expect(
      candidates.candidates
        .filter((item: { id: string }) => item.id !== 'bensound-rhythm-magnet')
        .every(
          (item: { commercialUse: boolean | null; status: string }) =>
            item.commercialUse === null && item.status === 'CANDIDATE_NOT_DOWNLOADED',
        ),
    ).toBe(true)
  })

  it('keeps only V2.2 active and archives prior deterministic definitions', async () => {
    const lock = JSON.parse(
      await readFile('campaigns/facturacion-electronica-uy-01/audio-lock.json', 'utf8'),
    )
    expect(lock.versions.map((item: { version: number | string }) => item.version)).toEqual(['2.2'])
    expect(lock.versions[0]).toMatchObject({
      type: 'EXTERNAL_TRACK',
      sourceStartMs: 8000,
      sourceEndMs: 20000,
      masterDurationMs: 12000,
      videoStartMs: 1000,
      videoEndMs: 11000,
    })
    expect(lock.archivedVersions.map((item: { version: number | string }) => item.version)).toEqual(
      [1, 2, '2.1-A', '2.1-B', '2.1-C'],
    )
    for (const version of lock.archivedVersions)
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

  it('provides comparable seven-cue V2.1 B/C mixes with music isolated to C', () => {
    expect(facturacionAudioTimelineV21B.cues).toHaveLength(7)
    expect(facturacionAudioTimelineV21C.cues).toHaveLength(7)
    expect(facturacionAudioTimelineV21B.tracks.some((track) => track.category === 'MUSIC')).toBe(
      false,
    )
    expect(facturacionAudioTimelineV21C.tracks.some((track) => track.category === 'MUSIC')).toBe(
      true,
    )
    expect(validateAudioTimeline(facturacionAudioTimelineV21B)).toEqual([])
    expect(validateAudioTimeline(facturacionAudioTimelineV21C)).toEqual([])
    expect(audioStats(renderAudio(facturacionAudioTimelineV21B), 48000).duration).toBe(10)
    expect(audioStats(renderAudio(facturacionAudioTimelineV21C), 48000).duration).toBe(10)
  })
})
