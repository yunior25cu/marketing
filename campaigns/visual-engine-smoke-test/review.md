# Revisión — UNA OPERACIÓN SE PROPAGA.

**Estado:** IN_REVIEW / Experimento interno, no es campaña pública ni aprobada.

## Qué comunica

Una operación se propaga desde un origen por inventario, finanzas y registro. Los nodos y sus conexiones representan una narrativa conceptual, no evidencia de una automatización real de Balaxys.

## Qué sucede

- 0.0–1.6 s: título y evento de venta.
- 1.6–3.2 s: conexión a inventario.
- 3.2–4.8 s: conexión a finanzas.
- 4.8–6.4 s: conexión al registro.
- 6.4–8.0 s: convergencia y cierre.

**Formatos:** 16:9, 9:16.

## Claims

- UNVERIFIED PRODUCT CLAIM: una operación conecta estados de varias áreas con un origen visible

## Validaciones

- Brand Guardian: PASS para prototipo. Signal Lime marca cambios; no hay color, tipo o regla permanente nueva.
- Quality Auditor: PASS para prueba conceptual. El claim está declarado UNVERIFIED y rotulado como demostración; no se puede publicar funcionalmente.
- Performance Auditor: PASS en el dispositivo de exportación. 8 draw calls, 50 triángulos, 0 texturas. El render de 192 cuadros a 24 fps terminó sin error. El chunk Three.js queda en 536.7 kB minificados / 134.6 kB gzip.
- Visual QA Director: PASS técnico. 12 checkpoints en 16:9 y 9:16, sin overflow DOM ni geometría, 0 problemas automáticos; WebGL y reduced motion tienen fallback Canvas. Capturas en `.cache/visual-qa/visual-engine-smoke-test/`.
- Audio QA: PASS técnico. MP4 decodificado con una pista AAC, duración 8.00 s, peak 0.590, RMS 0.083, sin clipping; cinco cues detectados en sus ventanas.
- AV Quality: PENDING evaluación auditiva artística en parlantes y teléfono. El entorno permitió decodificar y medir, pero no escuchar.
- Formato, lint, typecheck, 17 tests y build: PASS.
- Exportaciones AV: `renders/visual-engine-smoke-test-16x9-av.mp4` y `renders/visual-engine-smoke-test-9x16-av.mp4`, ambas H.264 + AAC, 8.00 s a 24 fps.

## Revisión humana necesaria

Obtener evidencia del producto antes de convertir el relato en un claim funcional; escuchar la mezcla en parlantes/teléfono y cerrar AV Quality. Vista: `/lab/campaigns/visual-engine-smoke-test`. La prueba sigue en IN_REVIEW.
