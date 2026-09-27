# Revisión — Una venta deja rastro

**Estado:** IN_REVIEW / Lista para revisión técnica y comercial. **No es una campaña oficial.**

## Qué comunica

Una venta deja rastro. El prototipo usa la escena existente de venta para comprobar el pipeline completo del Orchestrator en una pieza de 6 segundos. No acredita todavía que el ERP real actualice existencias automáticamente.

## Qué sucede

- 0.0–1.2 s: premisa; tipografía cinética.
- 1.2–4.8 s: demostración; venta → inventario → cuenta por cobrar → registro.
- 4.8–6.0 s: resolución; cierre tipográfico.

**Formatos:** 16:9.

## Claims

- UNVERIFIED PRODUCT CLAIM: mostrar que una venta actualiza existencias

## Validaciones

- Brand Guardian: PASS para prototipo. Retícula, tipografía, Signal Lime y uso causal de datos consistentes con Brand OS.
- Quality Auditor: PASS para prototipo. Hay premisa, demostración y cierre; la vista 16:9 se inspeccionó en navegador. Datos de demostración rotulados. El claim sigue bloqueando aprobación comercial.
- Performance Auditor: PASS sin problema grave observado. Build correcto y reproducción disponible. No se midió FPS en hardware de gama baja.
- Formato, lint, typecheck, tests y build: PASS. La prueba automática cubre creación, bloqueo de aprobación y congelamiento de versión.

## Revisión humana necesaria

Validar con evidencia que una venta actualiza existencias y revisar el tratamiento visual antes de solicitar aprobación. Vista: `/lab/campaigns/orchestrator-smoke-test`.
