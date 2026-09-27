# Revisión — Continuous Motion Smoke Test

**Estado técnico:** PASS · **Motion continuity:** PASS · **PowerPoint risk:** LOW · **AV artístico:** pendiente de escucha humana.

**MOTION_GRAPHICS_QUALITY=PASS.** Se documentó evidencia para los nueve criterios en `campaign.json`. El gate de aprobación sigue bloqueado hasta que AV Quality complete la escucha artística y los demás requisitos de publicación.

## Hallazgos y correcciones de QA

- El primer pase mostró una descripción accesible visible como texto de escena. Se añadió el patrón `sr-only` de recorte visual manteniendo el nombre accesible.
- El primer cambio de inventario dejó una cifra secundaria que podía leerse como un valor suelto. La composición conserva el dígito `1` y anima el `8` como unidad desprendida durante su recorrido; `17` queda como inventario resultante.
- En vertical, el escalado global deformaba y comprimía los elementos. Se cambió a una composición reencuadrada para 9:16 con escalas uniformes por grupo.
- En el reencuadre vertical, título y capas de relación se solaparon. Se ajustaron posiciones y orden de capas; los checkpoints finales no presentan clipping.
- La comprobación de scrubbing detectaba diferencias de antialiasing del navegador al capturar el mismo estado. La tolerancia de 32 píxeles permite esa variación; se exige igualdad del estado temporal y cero errores funcionales.

## Resultados

- `qa:continuous-motion`: 30 capturas en transiciones antes/durante/después para 16:9 y 9:16; 0 issues. Incluye repetición determinista por screenshot.
- Motion continuity: 8 objetos persistentes, 7 transformaciones, 5 beats, mapa de cámara presente, 15/15 checkpoints completos, transición primaria fade = 0 %, 0 beats independientes.
- PowerPoint Detector: 7 pruebas; narración por slides, enter/wait/exit, fade/translate, composiciones independientes y UI animada = no; los objetos generan el siguiente beat y continuidad supera 70 %. Riesgo LOW.
- Capturas revisadas: carry a 3.0 s, descubrimiento de cámara a 6.8 s y resolución a 9.99 s, en ambos formatos. Ruta, cifra, documento, asiento y firma se mantienen dentro del área visible.
- 16:9: H.264 1920×1080, 24 fps, 10 s; una pista AAC; pico 0.540, RMS 0.079, sin clipping. Los seis cues pasan sincronización por energía.
- 9:16: H.264 1080×1920, 24 fps, 10 s; una pista AAC; pico 0.540, RMS 0.079, sin clipping. Los seis cues pasan sincronización por energía.
- AV humano pendiente: los cues se sintetizan proceduralmente y la sincronización/decodificación se validó automáticamente; no se declara aprobada la escucha artística.
- `qa:visual`: 12 checkpoints existentes, 0 problemas. `qa:regression`: rutas `/`, `/lab`, launch-01, visual engine, consola AV y labs OK.
- Quality gate: format, lint, typecheck, 22 tests y build pasan.

## Transformation Map

`18 → 17 + unidad desprendida` → la unidad se propaga como trazo → `$13.490` → el trazo continúa como documento de venta → el documento se abre en asiento contable → pull-out revela stock/venta/contabilidad conectados → el recorrido se convierte en titular y firma Balaxys.

## Límites

- Las cifras y el asiento son datos demostrativos. Claims/capacidades del producto siguen `UNVERIFIED`; no publicar sin validación de producto.
- La escucha artística humana sigue pendiente. El QA automático demuestra sincronía y niveles, no gusto ni calidad subjetiva del diseño sonoro.
- No transferir el insight a `BALAXYS_VISUAL_MEMORY.md` sin aprobación humana.
