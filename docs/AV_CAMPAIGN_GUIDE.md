# Campañas audiovisuales avanzadas

1. Definir objetivo comercial, evento, consecuencia y storyboard. Verificar cada capacidad del ERP antes de afirmarla.
2. Pedir `VisualDecision` al Visual Engineer. Elegir DOM/SVG/Canvas/Three/shader por claridad, con fallback y presupuesto medible.
3. Definir `SoundPlan`: unos pocos cues dominantes, silencio, SFX/ambiente/música y origen de assets. `AudioTimeline` comparte los tiempos visuales.
4. Implementar la campaña en `src/campaigns/` y declarar `visualLevel`, `audioLevel`, `visualCheckpoints`, `audioTimelineId` y reviews en `campaign.json`.
5. Revisar preview en Campaign Console: formatos, sonido encendido/apagado, volumen, capas y reduced motion. El modo Inspect de desarrollo muestra tiempo, fase y cue.
6. Ejecutar `pnpm quality`, `pnpm qa:visual`, `pnpm render:av` y `pnpm qa:av`. Inspeccionar screenshots y escuchar el MP4, corregir y repetir.
7. Registrar evidencia y límites en `review.md`. Un claim de producto sin verificar o un QA pendiente bloquea aprobación.

`visual-engine-smoke-test` sirve de referencia técnica, no de campaña pública. El exportador AV actual admite esta campaña y ratios 16:9/9:16; para otra campaña se debe añadir su stage, timeline y configuración al exportador. `launch-01` mantiene su exportador original sin audio.
