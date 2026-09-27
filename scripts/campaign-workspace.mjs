import { createHash } from 'node:crypto'
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  approvalBlockers,
  createRecord,
  inferIntent,
  normalizeBrief,
  parseFormats,
  selectedAgentIds,
  validateRecord,
} from './orchestrator-core.mjs'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const campaignsRoot = process.env.BALAXYS_CAMPAIGNS_ROOT
  ? resolve(process.env.BALAXYS_CAMPAIGNS_ROOT)
  : join(root, 'campaigns')
const manifest = JSON.parse(
  await readFile(join(root, 'agents', 'orchestration.config.json'), 'utf8'),
)
const argv = process.argv.slice(2)
const flags = Object.fromEntries(
  argv
    .filter((arg) => arg.startsWith('--'))
    .map((arg) => {
      const [name, ...value] = arg.slice(2).split('=')
      return [name, value.join('=') || true]
    }),
)
const words = argv.filter((arg) => !arg.startsWith('--'))
const known = ['create', 'approve', 'adapt', 'improve', 'evolve', 'inspect', 'list']
const explicitAction = known.includes(words[0]) ? words.shift() : null
const request = flags.requestFile
  ? await readFile(resolve(root, String(flags.requestFile)), 'utf8')
  : words.join(' ')
const intent = explicitAction?.toUpperCase() ?? inferIntent(request)
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function workspace(id) {
  if (!idPattern.test(id)) throw new Error('El ID sólo admite letras minúsculas, números y guiones')
  const target = resolve(campaignsRoot, id)
  if (!target.startsWith(campaignsRoot + sep)) throw new Error('Workspace fuera de campaigns/')
  return target
}

function slug(text) {
  return (
    text
      .toLocaleLowerCase('es')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 42) || 'campaign'
  )
}

async function loadRecord(id) {
  const record = JSON.parse(await readFile(join(workspace(id), 'campaign.json'), 'utf8'))
  const errors = validateRecord(record)
  if (errors.length) throw new Error(`${id}: ${errors.join(', ')}`)
  if (record.status === 'APPROVED') {
    const releasePath = join(workspace(id), 'releases', `v${record.version}`)
    const release = JSON.parse(await readFile(join(releasePath, 'manifest.json'), 'utf8'))
    for (const [file, hash] of Object.entries(release.hashes)) {
      for (const location of [workspace(id), releasePath]) {
        const actual = createHash('sha256')
          .update(await readFile(join(location, file)))
          .digest('hex')
        if (actual !== hash) throw new Error(`${id}: ${file} cambió después de la aprobación`)
      }
    }
  }
  return record
}

async function saveRecord(record) {
  const errors = validateRecord(record)
  if (errors.length) throw new Error(errors.join(', '))
  await writeFile(
    join(workspace(record.id), 'campaign.json'),
    `${JSON.stringify(record, null, 2)}\n`,
    'utf8',
  )
}

async function appendChangelog(id, entry) {
  const path = join(workspace(id), 'changelog.md')
  const previous = await readFile(path, 'utf8')
  await writeFile(path, `${previous.trimEnd()}\n\n${entry}\n`, 'utf8')
}

async function create() {
  if (!request.trim()) throw new Error('Escribí una petición de campaña')
  const brief = normalizeBrief(request)
  const base = slug(brief.title)
  let id = flags.id ? String(flags.id) : base
  if (!flags.id) {
    const existing = new Set(await readdir(campaignsRoot).catch(() => []))
    let index = 1
    while (existing.has(id)) id = `${base}-${String(index++).padStart(2, '0')}`
  }
  const target = workspace(id)
  await mkdir(campaignsRoot, { recursive: true })
  await mkdir(target, { recursive: false })
  const now = new Date().toISOString()
  const record = createRecord(id, brief, now)
  await saveRecord(record)
  const agents = selectedAgentIds('CREATE', manifest)
  const claimText = record.brief.productCapabilities.length
    ? record.brief.productCapabilities
        .map((claim) => `- UNVERIFIED PRODUCT CLAIM: ${claim.statement}`)
        .join('\n')
    : '- No se identificó un claim funcional explícito; verificar el mecanismo de la escena antes de publicar.'
  await writeFile(
    join(target, 'brief.md'),
    `# Brief — ${record.brief.title}\n\n- Objetivo: ${record.brief.objective}\n- Público: ${record.brief.audience}\n- Mensaje: ${record.brief.message}\n- Duración: ${record.brief.duration / 1000} segundos\n- Formatos: ${record.brief.formats.join(', ')}\n- Canal: ${record.brief.channel}\n- CTA: ${record.brief.cta ?? 'ninguno'}\n- Idioma: español\n\n## Capacidades\n\n${claimText}\n`,
    'utf8',
  )
  await writeFile(
    join(target, 'concept.md'),
    `# Concepto — ${record.brief.title}\n\n**Idea:** ${record.concept.idea}\n\n**Mecanismo visual:** ${record.concept.visualMechanism}.\n\n**Narrativa:** ${record.concept.narrative}\n\n**Cierre:** ${record.concept.closing}\n\n**Prueba de originalidad:** ${record.concept.originalityCheck}\n\nEstado: borrador conceptual. Revisar con Creative Director y Brand Guardian.\n`,
    'utf8',
  )
  await writeFile(
    join(target, 'storyboard.md'),
    `# Storyboard — ${record.brief.title}\n\n| Tiempo | Función | Visual | Copy |\n| --- | --- | --- | --- |\n${record.storyboard.map((phase) => `| ${(phase.from / 1000).toFixed(1)}–${(phase.to / 1000).toFixed(1)} s | ${phase.label} | ${phase.visual} | ${phase.copy} |`).join('\n')}\n\nLa misma composición se adapta a ${record.brief.formats.join(', ')}.\n`,
    'utf8',
  )
  await writeFile(
    join(target, 'copy.md'),
    `# Copy — ${record.brief.title}\n\n## Apertura\n\n${record.copy.introLines.join('\n\n')}\n\n## Cierre\n\n${record.copy.closingLines.join('\n\n')}\n\nCTA: ${record.copy.cta ?? 'ninguno para awareness'}.\n\nTexto sujeto a revisión de claims y producto.\n`,
    'utf8',
  )
  await writeFile(
    join(target, 'review.md'),
    `# Revisión — ${record.brief.title}\n\n**Estado:** DRAFT / Borrador.\n\n## Qué comunica\n\n${record.concept.idea}\n\n## Qué sucede\n\n${record.storyboard.map((phase) => `- ${(phase.from / 1000).toFixed(1)}–${(phase.to / 1000).toFixed(1)} s: ${phase.label.toLowerCase()}; ${phase.visual.toLowerCase()}.`).join('\n')}\n\n**Formatos:** ${record.brief.formats.join(', ')}.\n\n## Claims\n\n${claimText}\n\n## Validaciones\n\n- Brand Guardian: PENDING.\n- Quality Auditor: PENDING.\n- Performance Auditor: PENDING.\n- Lint, typecheck, tests y build: pendientes para esta revisión.\n\n## Revisión humana necesaria\n\nValidar capacidades del ERP y el resultado visual antes de solicitar aprobación. Vista: /lab/campaigns/${id}.\n`,
    'utf8',
  )
  await writeFile(
    join(target, 'changelog.md'),
    `# Changelog — ${record.brief.title}\n\n## v1 — ${now.slice(0, 10)}\n\n- Pedido normalizado por Campaign Orchestrator.\n- Concepto y storyboard iniciales creados.\n- Estado DRAFT.\n`,
    'utf8',
  )
  await writeFile(
    join(target, 'orchestration.md'),
    `# Handoffs — ${record.brief.title}\n\nRoles seleccionados en orden: ${agents.join(' → ')}.\n\n${agents
      .map((id) => {
        const agent = manifest.agents.find((item) => item.id === id)
        return `- **${id}** (${agent.prompt}): ${agent.inputs.join(' + ')} → ${agent.outputs.join(' + ')}.`
      })
      .join(
        '\n',
      )}\n\nEl registro de roles indica trabajo pendiente; no acredita invocaciones todavía. El Orchestrator debe ejecutar cada fase necesaria, actualizar review.md y pasar quality gates.\n`,
    'utf8',
  )
  process.stdout.write(
    `CAMPAÑA CREADA\nNombre: ${record.brief.title}\nDuración: ${record.brief.duration / 1000} segundos\nFormatos: ${record.brief.formats.join(', ')}\nEstado: Borrador\nPara revisar: /lab/campaigns/${id}\n`,
  )
}

async function approve() {
  const id = String(flags.id ?? words[0] ?? '')
  const operator = String(flags.by ?? '')
  if (!operator) throw new Error('La aprobación requiere --by=<nombre del operador humano>')
  const record = await loadRecord(id)
  const blockers = approvalBlockers(record)
  if (blockers.length) throw new Error(`No se puede aprobar ${id}: ${blockers.join('; ')}`)
  const releasePath = join(workspace(id), 'releases', `v${record.version}`)
  await mkdir(join(workspace(id), 'releases'), { recursive: true })
  await mkdir(releasePath, { recursive: false })
  const files = ['concept.md', 'storyboard.md', 'copy.md']
  const hashes = {}
  for (const file of files) {
    const source = join(workspace(id), file)
    const content = await readFile(source)
    hashes[file] = createHash('sha256').update(content).digest('hex')
    await copyFile(source, join(releasePath, file))
  }
  const now = new Date().toISOString()
  await writeFile(
    join(releasePath, 'manifest.json'),
    `${JSON.stringify({ id, version: record.version, approvedAt: now, approvedBy: operator, hashes }, null, 2)}\n`,
  )
  record.status = 'APPROVED'
  record.approvedAt = now
  record.approvedBy = operator
  record.updatedAt = now
  await saveRecord(record)
  await appendChangelog(
    id,
    `## v${record.version} — ${now.slice(0, 10)}\n\n- Aprobada por ${operator}. Concepto, storyboard y copy congelados en releases/v${record.version}/.`,
  )
  process.stdout.write(`CAMPAÑA APROBADA: ${id}, versión ${record.version}.\n`)
}

async function adapt() {
  const id = String(flags.id ?? words[0] ?? '')
  const record = await loadRecord(id)
  const formats = parseFormats(request)
  if (!formats.length) throw new Error('Indicá al menos un formato: 16:9, 1:1, 4:5 o 9:16')
  const added = formats.filter((format) => !record.brief.formats.includes(format))
  if (!added.length) {
    process.stdout.write(`Los formatos ya existen para ${id}.\n`)
    return
  }
  if (record.status === 'APPROVED') record.version += 1
  record.brief.formats.push(...added)
  record.status = 'DRAFT'
  record.approvedAt = null
  record.approvedBy = null
  record.updatedAt = new Date().toISOString()
  for (const audit of ['brand', 'quality', 'performance'])
    record.reviews[audit] = {
      status: 'PENDING',
      summary: 'Revisar adaptación de formato.',
      blocking: false,
    }
  record.reviews.technical = { lint: false, typecheck: false, tests: false, build: false }
  await saveRecord(record)
  await appendChangelog(
    id,
    `## v${record.version} — ${record.updatedAt.slice(0, 10)}\n\n- Solicitada adaptación a ${added.join(', ')}.\n- Estado DRAFT; requiere revisión por formato.`,
  )
  process.stdout.write(`ADAPTACIÓN REGISTRADA: ${id} → ${added.join(', ')}. Estado: Borrador.\n`)
}

async function improve() {
  const id = String(flags.id ?? words[0] ?? '')
  const record = await loadRecord(id)
  const change = String(flags.change ?? words.slice(1).join(' ')).trim()
  if (!change) throw new Error('Describí el cambio en palabras simples')
  if (record.status === 'APPROVED') record.version += 1
  record.status = 'NEEDS_CHANGES'
  record.approvedAt = null
  record.approvedBy = null
  record.updatedAt = new Date().toISOString()
  for (const audit of ['brand', 'quality', 'performance'])
    record.reviews[audit] = {
      status: 'PENDING',
      summary: 'Revisar la versión modificada.',
      blocking: false,
    }
  record.reviews.technical = { lint: false, typecheck: false, tests: false, build: false }
  await saveRecord(record)
  await writeFile(
    join(workspace(id), `revision-v${record.version}.md`),
    `# Pedido de mejora — ${record.brief.title}\n\n${change}\n\nRoles sugeridos: ${selectedAgentIds('IMPROVE', manifest, change).join(' → ')}.\n\nEl Orchestrator debe implementar el cambio y volver a auditar. La versión aprobada anterior, si existe, permanece congelada.\n`,
  )
  await appendChangelog(
    id,
    `## v${record.version} — ${record.updatedAt.slice(0, 10)}\n\n- Mejora solicitada: ${change}.\n- Estado NEEDS_CHANGES.`,
  )
  process.stdout.write(`MEJORA REGISTRADA: ${id}. Estado: Necesita cambios.\n`)
}

async function evolve() {
  const problem = String(flags.problem ?? request).trim()
  if (!problem) throw new Error('Describí el problema de marca')
  const id = String(flags.id ?? `${slug(problem)}-${new Date().toISOString().slice(0, 10)}`)
  if (!idPattern.test(id)) throw new Error('ID de propuesta inválido')
  const path = join(root, 'brand', 'proposals', `${id}.md`)
  await writeFile(
    path,
    `# Propuesta de evolución — ${id}\n\n**Estado:** PENDING HUMAN APPROVAL\n\n## Problema\n\n${problem}\n\n## Propuesta\n\nPendiente de Creative Director y Brand Guardian.\n\n## Impacto\n\nPendiente de evaluación.\n\n## Campañas afectadas\n\nPor identificar.\n\n## Ejemplos\n\nPendientes.\n\n## Riesgo\n\nNo aplicar cambios permanentes sin aprobación humana.\n`,
  )
  process.stdout.write(`PROPUESTA CREADA: brand/proposals/${id}.md. No se modificó la marca.\n`)
}

try {
  if (intent === 'CREATE') await create()
  else if (intent === 'APPROVE') await approve()
  else if (intent === 'ADAPT') await adapt()
  else if (intent === 'IMPROVE') await improve()
  else if (intent === 'EVOLVE') await evolve()
  else if (intent === 'INSPECT') {
    const record = await loadRecord(String(flags.id ?? words[0]))
    process.stdout.write(
      `${JSON.stringify({ id: record.id, status: record.status, version: record.version, blockers: approvalBlockers(record) }, null, 2)}\n`,
    )
  } else if (intent === 'LIST') {
    const items = await readdir(campaignsRoot)
    process.stdout.write(`${items.join('\n')}\n`)
  }
} catch (error) {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
}
