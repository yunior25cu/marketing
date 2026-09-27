export const supportedFormats = ['16:9', '1:1', '4:5', '9:16']
export const statuses = ['DRAFT', 'IN_REVIEW', 'NEEDS_CHANGES', 'APPROVED', 'ARCHIVED']

export function parseFormats(request) {
  const formats = supportedFormats.filter((format) => request.includes(format))
  if (/stories|reels|vertical/i.test(request) && !formats.includes('9:16')) formats.push('9:16')
  if (/cuadrad[oa]/i.test(request) && !formats.includes('1:1')) formats.push('1:1')
  return formats.sort((a, b) => supportedFormats.indexOf(a) - supportedFormats.indexOf(b))
}

const templates = {
  'sale-flow': {
    title: 'Una venta deja rastro',
    introLines: ['UNA VENTA.', 'VARIOS CAMBIOS.'],
    closingLines: ['EL CAMBIO', 'TIENE ORIGEN.'],
    mechanism: 'Venta → inventario → cuenta por cobrar → registro',
  },
  'inventory-flow': {
    title: 'Una unidad cambia de estado',
    introLines: ['UNA UNIDAD.', 'UN CAMBIO.'],
    closingLines: ['EL STOCK', 'TIENE HISTORIA.'],
    mechanism: 'Reserva → disponible → despacho → trazabilidad',
  },
  'collection-flow': {
    title: 'Un cobro cierra un ciclo',
    introLines: ['UN COBRO.', 'OTRO SALDO.'],
    closingLines: ['EL SALDO', 'TIENE ORIGEN.'],
    mechanism: 'Cobro → saldo cliente → caja → registro',
  },
  'purchase-flow': {
    title: 'Una compra abre otra cadena',
    introLines: ['UNA COMPRA.', 'OTRA CADENA.'],
    closingLines: ['CADA CAMBIO', 'TIENE ORIGEN.'],
    mechanism: 'Compra → inventario → cuenta por pagar → costo',
  },
  'accounting-flow': {
    title: 'Cada registro tiene origen',
    introLines: ['UN REGISTRO.', 'UN ORIGEN.'],
    closingLines: ['EL DATO', 'TIENE HISTORIA.'],
    mechanism: 'Operación → documento → asiento → origen visible',
  },
}

export function inferIntent(request) {
  const text = request.toLocaleLowerCase('es')
  if (/\b(aprob[ao]r?|aprobaci[oó]n)\b/.test(text)) return 'APPROVE'
  if (
    /\b(evolucionar marca|cambiar la marca|cambio permanente|nueva forma de representar)\b/.test(
      text,
    )
  )
    return 'EVOLVE'
  if (/\b(adapt[aoá]|pas[áa]|otro formato|formato cuadrado|stories)\b/.test(text)) return 'ADAPT'
  if (
    /\b(mejor[aoá]|ajust[aoá]|correg[íi]|más impacto|demasiado lento|se siente como slides|parece un dashboard|más motion graphics|transición más orgánica|escena nazca|más sensación de cámara|transformación continua|demasiado estático|más continuidad visual)\b/.test(
      text,
    )
  )
    return 'IMPROVE'
  return 'CREATE'
}

function field(request, names) {
  const lines = request.split(/\r?\n/)
  for (const line of lines) {
    const match = line.match(/^\s*([^:]+):\s*(.+?)\s*$/)
    if (match && names.some((name) => match[1].trim().toLocaleLowerCase('es') === name))
      return match[2].trim()
  }
  return null
}

export function chooseScene(request) {
  const text = request.toLocaleLowerCase('es')
  if (/\bventa\b/.test(text) && /stock|inventario|existencias/.test(text)) return 'sale-flow'
  if (/cobro|cobranza|saldo cliente/.test(text)) return 'collection-flow'
  if (/compra|proveedor/.test(text)) return 'purchase-flow'
  if (/contab|asiento/.test(text)) return 'accounting-flow'
  if (/stock|inventario|existencias/.test(text)) return 'inventory-flow'
  return 'sale-flow'
}

export function normalizeBrief(request) {
  const sceneId = chooseScene(request)
  const template = templates[sceneId]
  const durationText = field(request, ['duración', 'duracion']) ?? request
  const durationMatch = durationText.match(/\b(\d+(?:[.,]\d+)?)\s*(?:segundos?|s)\b/i)
  const requestedDuration = Number(durationMatch?.[1]?.replace(',', '.') ?? 10)
  const duration =
    requestedDuration >= 3 && requestedDuration <= 60 ? Math.round(requestedDuration * 1000) : 10000
  const formatField = field(request, ['formato', 'formatos']) ?? request
  const formats = parseFormats(formatField)
  const objective =
    field(request, ['objetivo']) ?? 'Reconocimiento de marca mediante una operación visible'
  const message = field(request, ['mensaje', 'mensaje importante']) ?? objective
  const audience =
    field(request, ['público', 'publico', 'audiencia']) ??
    'Empresas que evalúan software de gestión'
  const title = field(request, ['título', 'titulo']) ?? template.title
  const channel = field(request, ['canal']) ?? 'Digital genérico'
  const cta = field(request, ['cta', 'llamado a la acción'])
  const claimVerb = /actualiza|automatiza|genera|integra|sincroniza|calcula|conecta/i
  const claimStatement = claimVerb.test(message)
    ? message
    : claimVerb.test(objective)
      ? objective
      : template.mechanism
  return {
    title,
    objective,
    audience,
    message,
    duration,
    formats: formats.length ? formats : ['16:9'],
    channel,
    cta: cta ?? null,
    tone: 'Preciso, sobrio y operativo',
    productCapabilities: [{ statement: claimStatement, status: 'UNVERIFIED', evidence: null }],
    constraints: ['No publicar capacidades sin verificar', 'Rotular datos de demostración'],
    references: [],
    campaignType: /venta|conversiones|leads/i.test(objective) ? 'conversion' : 'awareness',
    audio: 'optional',
    language: 'es',
    sceneId,
  }
}

export function selectedAgentIds(intent, manifest, request = '') {
  if (intent === 'APPROVE')
    return [
      'brand-guardian',
      'visual-qa-director',
      'quality-auditor',
      'av-quality-auditor',
      'performance-auditor',
    ]
  const selected = manifest.recommendedOrder.filter((id) =>
    manifest.agents.find((agent) => agent.id === id)?.invokeFor.includes(intent),
  )
  const advanced =
    /profundidad|espacial|c[aá]mara|canvas|three|shader|part[ií]culas|procedural/i.test(request)
  const sound =
    intent === 'CREATE'
      ? !/sin sonido|sin audio|silencio total/i.test(request)
      : /audio|sonido|sfx|m[uú]sica|mezcla|av\b/i.test(request)
  return selected.filter((id) => {
    if (id === 'visual-engineer' && !advanced) return false
    if (id === 'audio-engineer' && !sound) return false
    if (
      intent === 'IMPROVE' &&
      !/copy|texto|mensaje|concepto|idea/i.test(request) &&
      ['creative-director', 'copywriter'].includes(id)
    )
      return false
    return true
  })
}

export function interpretMotionDirection(request) {
  const text = request.toLocaleLowerCase('es')
  const slideLike = /slides|diapositivas|powerpoint|presentación|dashboard/.test(text)
  return {
    motionStyle: 'CONTINUOUS',
    creativeStandard: 'PROFESSIONAL_MOTION_GRAPHICS',
    motionGraphicsQuality: 'FAIL',
    reviseSlideRisk: slideLike,
    actions: [
      'set_audiovisual_art_direction',
      'design_dynamic_graphic_composition',
      'choreograph_visual_transformations',
      'design_kinetic_type_and_shape_animation',
      'compose_transitions_and_camera_choreography',
      'set_cinematic_rhythm_and_sound_design',
      'review_professional_motion_graphics_quality',
    ],
    requestedMotion: request.trim(),
  }
}

export function approvalBlockers(record) {
  const blockers = []
  if (record.status !== 'IN_REVIEW') blockers.push('La campaña debe estar en revisión')
  if (record.reviews.brand.status !== 'PASS') blockers.push('Brand Guardian no aprobó la pieza')
  if (record.reviews.quality.status !== 'PASS') blockers.push('Quality Auditor no aprobó la pieza')
  if (record.reviews.performance.blocking || record.reviews.performance.status === 'FAIL')
    blockers.push('Performance detectó un problema grave')
  if (record.reviews.visual && record.reviews.visual.status !== 'PASS')
    blockers.push('Visual QA no aprobó la pieza')
  if (record.motionContinuity && record.motionContinuity !== 'PASS')
    blockers.push(`MOTION_CONTINUITY ${record.motionContinuity}`)
  if (record.motionGraphicsQuality !== 'PASS')
    blockers.push(`MOTION_GRAPHICS_QUALITY=${record.motionGraphicsQuality ?? 'FAIL'}`)
  else {
    for (const criterion of [
      'artDirection',
      'dynamicComposition',
      'visualTransformation',
      'temporalContinuity',
      'rhythm',
      'expressiveTypographyShapesData',
      'designedTransitions',
      'audiovisualIntegration',
      'professionalMotionGraphicsExperience',
    ]) {
      const item = record.motionGraphicsReview?.[criterion]
      if (item?.pass !== true || !item.evidence?.trim())
        blockers.push(`MOTION_GRAPHICS_QUALITY sin evidencia: ${criterion}`)
    }
  }
  if (record.powerpointRisk === 'HIGH') blockers.push('POWERPOINT_RISK alto')
  if (record.audioLevel && record.audioLevel !== 'NONE') {
    if (record.reviews.audio?.status !== 'PASS') blockers.push('Audio QA no aprobó la pieza')
    if (record.reviews.av?.status !== 'PASS') blockers.push('AV Quality no aprobó la pieza')
  }
  for (const [check, passed] of Object.entries(record.reviews.technical))
    if (!passed) blockers.push(`Falta validación técnica: ${check}`)
  if (
    record.brief.productCapabilities.some((claim) => claim.status !== 'VERIFIED' || !claim.evidence)
  )
    blockers.push('Hay un claim de producto sin verificar')
  return blockers
}

export function validateRecord(record) {
  const errors = []
  const visualDuration = record.currentAudio
    ? record.currentAudio.videoEndMs - record.currentAudio.videoStartMs
    : record.brief.duration
  if (record.motionGraphicsQuality === 'PASS') {
    const requiredCriteria = [
      'artDirection',
      'dynamicComposition',
      'visualTransformation',
      'temporalContinuity',
      'rhythm',
      'expressiveTypographyShapesData',
      'designedTransitions',
      'audiovisualIntegration',
      'professionalMotionGraphicsExperience',
    ]
    for (const criterion of requiredCriteria) {
      const evidence = record.motionGraphicsReview?.[criterion]
      if (evidence?.pass !== true || !evidence.evidence?.trim())
        errors.push(`MOTION_GRAPHICS_QUALITY PASS requiere evidencia: ${criterion}`)
    }
  }
  if (
    record.motionGraphicsQuality !== undefined &&
    !['PASS', 'FAIL'].includes(record.motionGraphicsQuality)
  )
    errors.push('MOTION_GRAPHICS_QUALITY debe ser PASS o FAIL')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.id)) errors.push('ID inválido')
  if (!statuses.includes(record.status)) errors.push('Estado inválido')
  if (!Number.isInteger(record.brief.duration) || record.brief.duration <= 0)
    errors.push('Duración inválida')
  if (
    !record.brief.formats.length ||
    record.brief.formats.some((format) => !supportedFormats.includes(format))
  )
    errors.push('Formato inválido')
  if (record.visualCheckpoints?.some((time) => time < 0 || time >= visualDuration))
    errors.push('Checkpoint fuera de la campaña')
  if (record.motionStyle === 'CONTINUOUS' && record.motionBeats?.length) {
    if (record.motionBeats[0].from !== 0 || record.motionBeats.at(-1).to !== visualDuration)
      errors.push('Los motion beats no cubren la duración')
    for (let index = 1; index < record.motionBeats.length; index++)
      if (record.motionBeats[index].from > record.motionBeats[index - 1].to)
        errors.push('Los motion beats tienen una discontinuidad temporal')
    if (!record.transformationMap?.length) errors.push('Falta Transformation Map')
  }
  if (record.transitionCheckpoints?.some((item) => item.at < 0 || item.at >= visualDuration))
    errors.push('Transition checkpoint fuera de la campaña')
  if (record.storyboard[0]?.from !== 0 || record.storyboard.at(-1)?.to !== visualDuration)
    errors.push('El storyboard no cubre la duración')
  for (let index = 1; index < record.storyboard.length; index++)
    if (record.storyboard[index].from !== record.storyboard[index - 1].to)
      errors.push('El storyboard tiene una interrupción')
  return errors
}

export function createRecord(id, brief, now) {
  const template = templates[brief.sceneId]
  const introMs = Math.round((brief.duration * 0.2) / 100) * 100
  const outroMs = introMs
  const eventEnd = brief.duration - outroMs
  const { sceneId, ...publicBrief } = brief
  return {
    schemaVersion: 1,
    id,
    version: 1,
    status: 'DRAFT',
    createdAt: now,
    updatedAt: now,
    approvedAt: null,
    approvedBy: null,
    brief: publicBrief,
    visualLevel: 'STANDARD',
    audioLevel: 'SFX',
    motionStyle: 'CONTINUOUS',
    powerpointRisk: 'MEDIUM',
    motionContinuity: 'NEEDS_REVISION',
    motionGraphicsQuality: 'FAIL',
    concept: {
      idea: `${template.title}. ${template.mechanism}.`,
      visualMechanism: template.mechanism,
      narrative: 'Un evento activa una secuencia de estados y datos con origen visible.',
      closing: template.closingLines.join(' '),
      originalityCheck:
        'La identidad depende de la coreografía de datos y de la retícula operativa Balaxys.',
    },
    storyboard: [
      {
        id: 'intro',
        from: 0,
        to: introMs,
        label: 'Premisa',
        visual: 'Tipografía cinética',
        copy: template.introLines.join(' '),
      },
      {
        id: 'event',
        from: introMs,
        to: eventEnd,
        label: 'Demostración',
        visual: template.mechanism,
        copy: 'Datos de demostración',
      },
      {
        id: 'close',
        from: eventEnd,
        to: brief.duration,
        label: 'Resolución',
        visual: 'Cierre tipográfico',
        copy: template.closingLines.join(' '),
      },
    ],
    copy: {
      introLines: template.introLines,
      closingLines: template.closingLines,
      cta: publicBrief.cta,
    },
    playback: { kind: 'template', sceneId, introMs, outroMs },
    reviews: {
      brand: { status: 'PENDING', summary: 'Pendiente de Brand Guardian.', blocking: false },
      quality: { status: 'PENDING', summary: 'Pendiente de Quality Auditor.', blocking: false },
      performance: {
        status: 'PENDING',
        summary: 'Pendiente de Performance Auditor.',
        blocking: false,
      },
      technical: { lint: false, typecheck: false, tests: false, build: false },
    },
  }
}
