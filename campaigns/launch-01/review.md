# Revisión — launch-01

**Estado:** IN_REVIEW / Lista para revisión, sin aprobación comercial.

## Qué intenta comunicar

Una venta desencadena una cadena legible de consecuencias; la empresa se entiende por relaciones entre hechos.

## Qué ocurre en 10 segundos

- 0–1.7 s: premisa «NO SON MÓDULOS.»
- 1.7–7.7 s: documento Venta #18492 y cambios en inventario, cuenta por cobrar y registro.
- 7.7–10 s: resolución «ES UNA EMPRESA EN MOVIMIENTO.»

**Formatos:** 1920×1080, 1080×1080, 1080×1350 y 1080×1920. Hay MP4 de 10.00 s por formato en `renders/`.

## Claims

`UNVERIFIED PRODUCT CLAIM`: venta → inventario, cuenta por cobrar y registro contable automático. La visualización lleva aviso de datos de demostración. No publicar como afirmación funcional hasta obtener evidencia de producto.

## Brand Review

**PASS para prototipo.** Hay una idea dominante, retícula operativa, tipografía Geist, Signal Lime reservado para actividad y una secuencia de causa y efecto. No aparecen antipatrones prohibidos. El wordmark sigue siendo provisional.

## Quality Review

**PASS para prototipo.** Los datos tienen función, el origen es visible y la animación conecta estados. Reduced motion muestra el estado final. Los cuatro ratios se inspeccionaron visualmente. El claim comercial continúa pendiente y bloquea aprobación.

## Performance Review

**PASS sin bloqueo grave observado.** Se completaron build y cuatro exportaciones de 300 fotogramas a 30 fps. Esto no sustituye una medición de FPS en dispositivos de gama baja.

## Validaciones técnicas

Formato, lint, typecheck, tests y build pasaron. El exportador produjo archivos de 10.00 s. Tras extraer el escenario compartido para Campaign Console, se volvió a renderizar el fotograma 16:9 de 5.0 s: su SHA-256 coincide exactamente con el poster anterior (`B2E316BA0F6171B4F3C1F477B2A23621E96E73428308C180AD360F6BF00AA5D6`).

## Revisión humana necesaria

Confirmar capacidades del ERP y aprobar el tratamiento de marca provisional antes de publicar. Vista: `/lab/campaigns/launch-01`.
