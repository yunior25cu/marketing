import type { SceneRatio } from '@/renderer/scene'
import type {
  CameraKeyframe,
  MotionBeat,
  MotionGraphicsReview,
  SemanticTransition,
} from '@/motion/continuous'

export type CampaignIntent = 'CREATE' | 'IMPROVE' | 'ADAPT' | 'EVOLVE' | 'APPROVE'
export type CampaignStatus = 'DRAFT' | 'IN_REVIEW' | 'NEEDS_CHANGES' | 'APPROVED' | 'ARCHIVED'
export type ReviewVerdict = 'PASS' | 'FAIL' | 'PENDING'

export interface ProductCapability {
  statement: string
  status: 'VERIFIED' | 'UNVERIFIED'
  evidence: string | null
}

export interface CampaignBrief {
  title: string
  objective: string
  audience: string
  message: string
  duration: number
  formats: SceneRatio[]
  channel: string
  cta: string | null
  tone: string
  productCapabilities: ProductCapability[]
  constraints: string[]
  references: string[]
  campaignType: string
  audio: 'optional' | 'none' | 'required'
  language: 'es'
}

export interface CampaignConcept {
  idea: string
  visualMechanism: string
  narrative: string
  closing: string
  originalityCheck: string
}

export interface CampaignPhase {
  id: string
  from: number
  to: number
  label: string
  visual: string
  copy: string
}

export interface CampaignCopy {
  introLines: string[]
  closingLines: string[]
  cta: string | null
}

export interface AgentReview {
  status: ReviewVerdict
  summary: string
  blocking: boolean
}

export interface CampaignRecord {
  schemaVersion: 1
  id: string
  version: number
  status: CampaignStatus
  createdAt: string
  updatedAt: string
  approvedAt: string | null
  approvedBy: string | null
  brief: CampaignBrief
  concept: CampaignConcept
  storyboard: CampaignPhase[]
  copy: CampaignCopy
  visualLevel?: 'STANDARD' | 'ADVANCED_2D' | 'CANVAS' | 'THREE_D' | 'SHADER'
  audioLevel?: 'NONE' | 'SFX' | 'SFX_AMBIENCE' | 'MUSIC_ONLY' | 'FULL'
  visualCheckpoints?: number[]
  transitionCheckpoints?: {
    at: number
    transition: SemanticTransition
    moment: 'before' | 'during' | 'after'
  }[]
  motionStyle?: 'CONTINUOUS' | 'DISCRETE'
  powerpointRisk?: 'LOW' | 'MEDIUM' | 'HIGH'
  motionContinuity?: 'PASS' | 'NEEDS_REVISION' | 'FAIL'
  motionGraphicsQuality?: 'PASS' | 'FAIL'
  motionGraphicsReview?: MotionGraphicsReview
  motionBeats?: MotionBeat[]
  cameraPath?: CameraKeyframe[]
  transformationMap?: { from: string; transition: SemanticTransition; to: string; at: number }[]
  audioTimelineId?: string
  currentAudio?: {
    id: string
    title: string
    filename: string
    source: string
    author: string
    sourceStartMs: number
    sourceEndMs: number
    masterDurationMs: number
    videoStartMs: number
    videoEndMs: number
    sfx: 'NONE'
    ambience: 'NONE'
    additionalAudio: 'NONE'
    licenseStatus: 'PENDING_PROOF' | 'CLEARED'
    commercialUse: boolean | null
  }
  playback: {
    kind: 'launch-01' | 'template' | 'custom'
    sceneId: string
    introMs: number
    outroMs: number
  }
  reviews: {
    brand: AgentReview
    quality: AgentReview
    performance: AgentReview
    visual?: AgentReview
    audio?: AgentReview
    av?: AgentReview
    technical: { lint: boolean; typecheck: boolean; tests: boolean; build: boolean }
  }
}

export interface AgentContract<Input, Output> {
  input: Input
  output: Output
  criteria: string[]
}

export type CampaignPlan = { objective: string; storyboard: CampaignPhase[]; formats: SceneRatio[] }
export type MotionPlan = {
  duration: number
  motionStyle: 'CONTINUOUS' | 'DISCRETE'
  beats: MotionBeat[]
  transformationMap: { from: string; transition: SemanticTransition; to: string; at: number }[]
  cameraPath: CameraKeyframe[]
  transitionCheckpoints: {
    at: number
    transition: SemanticTransition
    moment: 'before' | 'during' | 'after'
  }[]
  cues: { at: number; event: string; effect: string }[]
}
export type CampaignImplementation = { sceneId: string; previewPath: string; formats: SceneRatio[] }
export type BrandReview = AgentReview
export type QualityReview = AgentReview
export type PerformanceReview = AgentReview
