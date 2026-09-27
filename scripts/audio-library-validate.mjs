import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  audioAssetRegistry,
  facturacionAudioTimeline,
  facturacionAudioTimelineV2,
  validateAudioLicenseGate,
  validateAudioTimeline,
} from './audio-core.mjs'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const manifest = JSON.parse(await readFile(resolve(root, 'assets/audio/manifest.json'), 'utf8'))
const lock = JSON.parse(
  await readFile(resolve(root, 'campaigns/facturacion-electronica-uy-01/audio-lock.json'), 'utf8'),
)
const errors = []
const required = [
  'id',
  'filename',
  'type',
  'category',
  'tags',
  'duration',
  'source',
  'sourceUrl',
  'license',
  'commercialUse',
  'attributionRequired',
  'author',
  'downloadDate',
  'sha256',
  'notes',
]
for (const asset of manifest.assets)
  for (const field of required)
    if (!(field in asset)) errors.push(`Manifest field missing: ${asset.id}.${field}`)
for (const asset of manifest.assets)
  if (!asset.license || asset.commercialUse !== true) errors.push(`AUDIO_LICENSE_GATE: ${asset.id}`)
for (const asset of manifest.assets) {
  if (asset.filename === null) {
    const source = audioAssetRegistry[asset.id]
    if (
      !source ||
      createHash('sha256').update(JSON.stringify(source)).digest('hex') !== asset.sha256
    )
      errors.push(`Procedural definition hash mismatch: ${asset.id}`)
  } else {
    try {
      const bytes = await readFile(resolve(root, 'assets/audio', asset.filename))
      if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256)
        errors.push(`File hash mismatch: ${asset.id}`)
    } catch {
      errors.push(`MISSING_AUDIO_ASSET: ${asset.id}`)
    }
  }
}
for (const [id, asset] of Object.entries(audioAssetRegistry))
  if (!manifest.assets.some((item) => item.id === id) || asset.commercialUse !== true)
    errors.push(`Unregistered or unlicensed asset: ${id}`)
for (const timeline of [facturacionAudioTimeline, facturacionAudioTimelineV2])
  errors.push(...validateAudioTimeline(timeline))
for (const version of lock.versions) {
  const timeline = version.version === 1 ? facturacionAudioTimeline : facturacionAudioTimelineV2
  const assetIds = [
    ...new Set([
      ...timeline.cues.map((cue) => cue.sound),
      ...timeline.tracks.map((track) => track.assetId).filter(Boolean),
      ...(timeline.music ? [timeline.music.id] : []),
    ]),
  ]
  errors.push(...validateAudioLicenseGate(assetIds))
  for (const id of assetIds)
    if (!version.assets.some((item) => item.id === id))
      errors.push(`Audio lock missing asset: V${version.version}/${id}`)
  for (const item of version.assets) {
    const asset = audioAssetRegistry[item.id]
    if (!asset) errors.push(`MISSING_AUDIO_ASSET: ${item.id}`)
    else if (createHash('sha256').update(JSON.stringify(asset)).digest('hex') !== item.sha256)
      errors.push(`Audio lock hash changed: ${item.id}`)
  }
  if (
    createHash('sha256').update(JSON.stringify(timeline)).digest('hex') !== version.timelineSha256
  )
    errors.push(`Audio timeline lock changed: V${version.version}`)
}
process.stdout.write(
  `${errors.length ? 'FAIL' : 'PASS'}: ${manifest.assets.length} manifest entries; ${Object.keys(audioAssetRegistry).length} active assets\n${errors.join('\n')}`,
)
if (errors.length) process.exitCode = 1
