# Handoffs — UNA OPERACIÓN SE PROPAGA.

Roles seleccionados en orden: campaign-director → creative-director → copywriter → motion-designer → visual-engineer → sound-designer → frontend-engineer → audio-engineer → brand-guardian → visual-qa-director → quality-auditor → av-quality-auditor → performance-auditor.

- **campaign-director** (agents/06-campaign-director.md): CampaignBrief → CampaignPlan.
- **creative-director** (agents/01-creative-director.md): CampaignBrief + CampaignPlan → CampaignConcept.
- **copywriter** (agents/03-copywriter.md): CampaignConcept + CampaignBrief → CampaignCopy.
- **motion-designer** (agents/04-motion-designer.md): CampaignConcept + CampaignCopy → MotionPlan.
- **visual-engineer** (agents/09-visual-engineer.md): CampaignConcept + MotionPlan → VisualImplementationPlan.
- **sound-designer** (agents/10-sound-designer.md): CampaignConcept + MotionPlan → SoundPlan.
- **frontend-engineer** (agents/05-frontend-engineer.md): MotionPlan + CampaignCopy → CampaignImplementation.
- **audio-engineer** (agents/11-audio-engineer.md): SoundPlan + MotionPlan → AudioImplementation.
- **brand-guardian** (agents/02-brand-guardian.md): CampaignImplementation + CampaignConcept → BrandReview.
- **visual-qa-director** (agents/12-visual-qa-director.md): CampaignImplementation + CampaignPlan → VisualQAReview.
- **quality-auditor** (agents/07-quality-auditor.md): CampaignImplementation + BrandReview → QualityReview.
- **av-quality-auditor** (agents/13-av-quality-auditor.md): CampaignImplementation + AudioImplementation → AVReview.
- **performance-auditor** (agents/08-performance-auditor.md): CampaignImplementation → PerformanceReview.

Los contratos se aplicaron como fases en esta ejecución; **no se invocaron agentes externos separados**. Visual Engineer eligió Three.js para distinguir áreas en profundidad con Canvas como fallback; Sound Designer definió cinco SFX y ambiente sin música; Audio Engineer conectó preview y exportación; Visual QA y AV QA usan capturas y análisis del MP4 real. Evidencias y pendientes están en `review.md`.
