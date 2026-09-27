import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  cameraAt,
  detectPowerpointPattern,
  morphNumber,
  scoreMotionContinuity,
  scoreMotionGraphicsQuality,
} from '@/motion/continuous'
import { KineticText } from '@/primitives/KineticText'
import {
  continuousBeats,
  continuousCameraPath,
  continuousState,
  continuousTransitionCheckpoints,
} from '@/campaigns/continuous-motion-smoke-test/definition'
import { approvalBlockers, validateRecord } from '../scripts/orchestrator-core.mjs'

const root = process.cwd()
const campaign = JSON.parse(
  readFileSync(join(root, 'campaigns/continuous-motion-smoke-test/campaign.json'), 'utf8'),
)
const facturacionCampaign = JSON.parse(
  readFileSync(join(root, 'campaigns/facturacion-electronica-uy-01/campaign.json'), 'utf8'),
)

describe('Balaxys continuous transformation language', () => {
  it('keeps the ten-second visual map intact inside the twelve-second music master', () => {
    expect(facturacionCampaign.version).toBe(2.2)
    expect(facturacionCampaign.brief.duration).toBe(12000)
    expect(facturacionCampaign.visualVersion).toBe('2.1')
    expect(facturacionCampaign.visualChanged).toBe(false)
    expect(facturacionCampaign.currentAudio).toMatchObject({
      sourceStartMs: 8000,
      sourceEndMs: 20000,
      masterDurationMs: 12000,
      videoStartMs: 1000,
      videoEndMs: 11000,
      sfx: 'NONE',
      ambience: 'NONE',
      additionalAudio: 'NONE',
    })
    expect(facturacionCampaign.storyboard.at(-1).to).toBe(10000)
    expect(validateRecord(facturacionCampaign)).toEqual([])
  })

  it('requires evidence for all nine professional motion graphics criteria', () => {
    const review = Object.fromEntries(
      [
        'artDirection',
        'dynamicComposition',
        'visualTransformation',
        'temporalContinuity',
        'rhythm',
        'expressiveTypographyShapesData',
        'designedTransitions',
        'audiovisualIntegration',
        'professionalMotionGraphicsExperience',
      ].map((criterion) => [criterion, { pass: true, evidence: `Inspected ${criterion}` }]),
    )
    expect(scoreMotionGraphicsQuality(review).status).toBe('PASS')
    expect(scoreMotionGraphicsQuality(undefined).status).toBe('FAIL')
    delete review.rhythm
    expect(scoreMotionGraphicsQuality(review).failedCriteria).toContain('rhythm')
  })

  it('interpolates camera deterministically, clamps edges and exposes Canvas/Three adapters', async () => {
    const { canvasCameraPose, threeCameraPose } = await import('@/motion/continuous')
    const start = cameraAt(continuousCameraPath, 0)
    const middle = cameraAt(continuousCameraPath, 3000)
    expect(cameraAt(continuousCameraPath, 3000)).toEqual(middle)
    expect(middle.x).not.toBe(start.x)
    expect(cameraAt(continuousCameraPath, -10)).toEqual(start)
    expect(cameraAt(continuousCameraPath, 12000)).toEqual(cameraAt(continuousCameraPath, 10000))
    expect(canvasCameraPose(middle, { width: 1920, height: 1080 }).scale).toBe(middle.scale)
    expect(threeCameraPose(middle).z).toBeGreaterThan(0)
    expect(morphNumber(18, 17, 0.5, 3)).toBe('17.500')
  })

  it('keeps beats, transformations, audio and 10-second coverage on the same campaign map', () => {
    expect(campaign.brief.duration).toBe(10000)
    expect(campaign.motionStyle).toBe('CONTINUOUS')
    expect(campaign.motionBeats).toHaveLength(5)
    expect(campaign.motionBeats[0].from).toBe(0)
    expect(campaign.motionBeats.at(-1).to).toBe(10000)
    expect(campaign.transformationMap.length).toBeGreaterThanOrEqual(5)
    expect(campaign.cameraPath).toEqual(continuousCameraPath)
    expect(
      campaign.motionBeats.every(
        (beat: (typeof continuousBeats)[number]) => beat.persistentObjects.length > 0,
      ),
    ).toBe(true)
    expect(campaign.audioTimelineId).toBe('continuous-motion-v1')
    expect(continuousTransitionCheckpoints.length).toBeGreaterThan(12)
    expect(continuousState(3000)).toEqual(continuousState(3000))
    expect(continuousState(-1).time).toBe(0)
    expect(continuousState(12000).time).toBe(10000)
    expect(validateRecord(campaign)).toEqual([])
    const missingMap = { ...campaign, transformationMap: [] }
    expect(validateRecord(missingMap)).toContain('Falta Transformation Map')
  })

  it('scores connected choreography low-risk and rejects fade-led independent beats', () => {
    const connected = {
      persistentObjectCount: 6,
      transformations: 7,
      cameraChoreography: true,
      beatCount: 5,
      fadeAsPrimaryTransitionShare: 0,
      independentBeatCount: 0,
    }
    expect(scoreMotionContinuity(connected).status).toBe('PASS')
    expect(detectPowerpointPattern(connected).risk).toBe('LOW')
    const slides = {
      ...connected,
      persistentObjectCount: 0,
      transformations: 0,
      cameraChoreography: false,
      fadeAsPrimaryTransitionShare: 0.8,
      independentBeatCount: 5,
    }
    expect(scoreMotionContinuity(slides).status).toBe('FAIL')
    expect(detectPowerpointPattern(slides).risk).toBe('HIGH')
  })

  it('blocks approval until both continuity and professional motion graphics pass', () => {
    const incomplete = {
      ...campaign,
      reviews: {
        ...campaign.reviews,
        brand: { status: 'PASS', summary: '', blocking: false },
        quality: { status: 'PASS', summary: '', blocking: false },
        performance: { status: 'PASS', summary: '', blocking: false },
        visual: { status: 'PASS', summary: '', blocking: false },
        audio: { status: 'PASS', summary: '', blocking: false },
        av: { status: 'PASS', summary: '', blocking: false },
        technical: { lint: true, typecheck: true, tests: true, build: true },
      },
      brief: {
        ...campaign.brief,
        productCapabilities: [{ statement: 'demo', status: 'VERIFIED', evidence: 'test' }],
      },
      motionContinuity: 'NEEDS_REVISION',
      motionGraphicsQuality: 'FAIL',
    }
    expect(approvalBlockers(incomplete)).toContain('MOTION_CONTINUITY NEEDS_REVISION')
    expect(approvalBlockers(incomplete)).toContain('MOTION_GRAPHICS_QUALITY=FAIL')
  })

  it('renders word-level kinetic type with a complete accessible text alternative', () => {
    const html = renderToStaticMarkup(
      createElement(KineticText, {
        lines: ['UNA VENTA', 'NUNCA ES SÓLO'],
        granularity: 'word',
        revealProgress: 0.5,
        mask: true,
      }),
    )
    expect(html).toContain('aria-label="UNA VENTA NUNCA ES SÓLO"')
    expect(html).toContain('kinetic-text__unit')
    expect(html).toContain('kinetic-text--controlled')
    const transforming = renderToStaticMarkup(
      createElement(KineticText, {
        lines: ['18'],
        numericTransform: { from: 18, to: 17, progress: 1 },
      }),
    )
    expect(transforming).toContain('aria-label="17"')
    expect(transforming).toContain('17')
  })
})
