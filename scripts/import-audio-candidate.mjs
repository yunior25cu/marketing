import { createHash } from 'node:crypto'
import { copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...parts] = arg.replace(/^--/, '').split('=')
    return [key, parts.join('=') || true]
  }),
)
const required = [
  'candidate',
  'file',
  'license',
  'commercial-use',
  'attribution-required',
  'author',
  'redistributable',
]
for (const key of required) if (args[key] === undefined) throw new Error(`Falta --${key}`)
if (
  !['true', 'false'].includes(String(args['commercial-use'])) ||
  args['commercial-use'] !== 'true'
)
  throw new Error(
    'AUDIO_LICENSE_GATE=FAIL: sólo se aceptan candidatos con commercialUse=true explícito',
  )
if (!['true', 'false'].includes(String(args['attribution-required'])))
  throw new Error('--attribution-required debe ser true|false')
if (!['true', 'false'].includes(String(args.redistributable)))
  throw new Error('--redistributable debe ser true|false')
const candidatePath = resolve(root, 'assets/audio/manifests/candidate-manifest.json')
const catalog = JSON.parse(await readFile(candidatePath, 'utf8'))
const candidate = catalog.candidates.find((item) => item.id === args.candidate)
if (!candidate) throw new Error(`Candidato desconocido: ${args.candidate}`)
const sourcePath = resolve(String(args.file))
const info = await stat(sourcePath)
const ext = extname(sourcePath).toLowerCase()
if (!info.isFile() || info.size <= 44 || info.size > 80 * 1024 * 1024)
  throw new Error('Archivo de audio inválido o mayor a 80 MiB')
if (!['.wav', '.mp3', '.m4a', '.aac', '.ogg', '.flac'].includes(ext))
  throw new Error('Formato no admitido')
const bytes = await readFile(sourcePath)
const sha256 = createHash('sha256').update(bytes).digest('hex')
const safeBase = basename(sourcePath).replace(/[^a-zA-Z0-9._-]/g, '-')
const folder = args.redistributable === 'true' ? 'imported' : 'local-imports'
const storedName = `${candidate.id}-${safeBase}`
const storedPath = resolve(root, 'assets/audio', folder, storedName)
await mkdir(resolve(storedPath, '..'), { recursive: true })
await copyFile(sourcePath, storedPath)
const record = {
  id: candidate.id,
  filename: `${folder}/${storedName}`,
  type: candidate.type,
  category: candidate.category,
  tags: candidate.tags,
  duration: candidate.duration,
  source: candidate.source,
  sourceUrl: candidate.sourceUrl,
  license: String(args.license),
  commercialUse: true,
  attributionRequired: args['attribution-required'] === 'true',
  author: String(args.author),
  downloadDate: new Date().toISOString().slice(0, 10),
  sha256,
  bpm: candidate.bpm,
  energy: candidate.energy,
  mood: candidate.mood,
  redistributable: args.redistributable === 'true',
  status: 'IMPORTED_NEEDS_AUDIO_REVIEW',
  notes: String(
    args.notes ??
      'Manual import. Confirm attribution text and restrictions against the saved item license before activation.',
  ),
}
if (!record.license.trim() || !record.author.trim())
  throw new Error('Licencia y autor concretos obligatorios')
const output = resolve(root, 'assets/audio/manifests/imported', `${candidate.id}.json`)
await mkdir(resolve(output, '..'), { recursive: true })
await writeFile(output, `${JSON.stringify(record, null, 2)}\n`)
process.stdout.write(
  `${JSON.stringify({ status: record.status, manifestDraft: output, storedFile: storedPath, sha256, redistributable: record.redistributable }, null, 2)}\n`,
)
process.stdout.write(
  'La pista queda fuera del catálogo activo hasta revisión de licencia, metadatos y formato de integración. No se descargó ningún recurso automáticamente.\n',
)
