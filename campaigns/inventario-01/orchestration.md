# Handoffs — NO SE QUEDA EN VENTAS.

Roles seleccionados en orden: campaign-director → creative-director → copywriter → motion-designer → frontend-engineer → brand-guardian → quality-auditor → performance-auditor.

- **campaign-director** (agents/06-campaign-director.md): CampaignBrief → CampaignPlan.
- **creative-director** (agents/01-creative-director.md): CampaignBrief + CampaignPlan → CampaignConcept.
- **copywriter** (agents/03-copywriter.md): CampaignConcept + CampaignBrief → CampaignCopy.
- **motion-designer** (agents/04-motion-designer.md): CampaignConcept + CampaignCopy → MotionPlan.
- **frontend-engineer** (agents/05-frontend-engineer.md): MotionPlan + CampaignCopy → CampaignImplementation.
- **brand-guardian** (agents/02-brand-guardian.md): CampaignImplementation + CampaignConcept → BrandReview.
- **quality-auditor** (agents/07-quality-auditor.md): CampaignImplementation + BrandReview → QualityReview.
- **performance-auditor** (agents/08-performance-auditor.md): CampaignImplementation → PerformanceReview.

El registro de roles indica trabajo pendiente; no acredita invocaciones todavía. El Orchestrator debe ejecutar cada fase necesaria, actualizar review.md y pasar quality gates.
