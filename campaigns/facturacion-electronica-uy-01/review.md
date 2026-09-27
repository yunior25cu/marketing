# Revisión — Facturación electrónica Uruguay

**Campaña:** `facturacion-electronica-uy-01`, versión 1. **Estado:** `IN_REVIEW`. **MOTION_GRAPHICS_QUALITY=FAIL** hasta completar la revisión perceptual. Ninguna persona aprobó la publicación.

## Entregables

Vista con controles y ficha: `/campaigns/facturacion-electronica-uy-01` y `/lab/campaigns/facturacion-electronica-uy-01`. Cuatro MP4 de 10 s, 24 fps y audio AAC:

| Ratio | Archivo                                             | Píxeles     |
| ----- | --------------------------------------------------- | ----------- |
| 16:9  | `renders/facturacion-electronica-uy-01-16x9-av.mp4` | 1920 × 1080 |
| 9:16  | `renders/facturacion-electronica-uy-01-9x16-av.mp4` | 1080 × 1920 |
| 4:5   | `renders/facturacion-electronica-uy-01-4x5-av.mp4`  | 1080 × 1350 |
| 1:1   | `renders/facturacion-electronica-uy-01-1x1-av.mp4`  | 1080 × 1080 |

Los MP4 son artefactos locales de revisión e ignorados por Git. El código fuente, la ficha, las evidencias y el plan de sonido sí están en el proyecto.

## Evidencia y auditorías

- **Claims:** `product-evidence.md` reúne fuentes públicas oficiales de Balaxys para emisión desde ventas y relaciones con contabilidad y cuenta del cliente. La respuesta DGI se representa sin aceptación definitiva ni actualizaciones automáticas. La etiqueta «Funciones según plan y configuración» limita el alcance.
- **Brand Guardian:** `PENDING` para la pieza completa. Cuatro composiciones usan la paleta, las familias tipográficas y una señal funcional coherentes con la constitución.
- **Visual QA:** `PENDING` para el juicio de movimiento completo. `scripts/qa-facturacion.mjs` comprueba 17 checkpoints por ratio, seek determinista, controles de movimiento reducido, dimensiones y errores de navegador. Capturas e informe: `.cache/facturacion-qa/`.
- **Quality Auditor:** `PENDING` por el gate artístico. La prueba de claims y los controles técnicos no sustituyen el juicio sobre el video en reproducción.
- **Audio Engineer:** `PASS` técnico. Los cuatro MP4 tienen una pista H.264 y una AAC, duración cercana a 10.005 s, once cues medibles por RMS y ausencia de clipping de muestras. PCM master: pico 0.397; último cue termina antes de 9.27 s. Ver `sound-plan.md`.
- **AV Quality Auditor:** `PENDING` para escucha crítica, sincronía percibida y sensación profesional. `scripts/verify-av.mjs --facturacion` pasó en los cuatro archivos; la herramienta de esta sesión no admite escucha de audio.
- **Performance Auditor:** `PASS` en Chrome headless local; cuatro ratios alrededor de 59.7–59.9 FPS, p95 de 16.8 ms durante reproducción. Esta medición de rAF no garantiza rendimiento en dispositivos reales.
- **Técnica:** formato, lint, tipos, 23 pruebas, build y regresión de rutas existentes pasan. Vite informa un chunk Three.js grande preexistente que esta campaña SVG no importa.

## Gate de motion graphics

| Criterio                       | Estado          | Evidencia y límite                                                            |
| ------------------------------ | --------------- | ----------------------------------------------------------------------------- |
| Dirección de arte              | PASS preliminar | Retícula sobria, Obsidian/Bone y lima causal en cuatro ratios.                |
| Composición dinámica           | PASS preliminar | Reflow propio y documento/cámara cambian escala y posición.                   |
| Transformación visual          | PASS preliminar | Subrayado → contorno documental; borde → máscara de cierre.                   |
| Continuidad temporal           | PASS preliminar | Objetos persistentes y seek repetido idéntico.                                |
| Ritmo                          | FAIL pendiente  | Los intervalos y holds están definidos; falta juzgar el MP4 a velocidad real. |
| Tipografía, formas y datos     | PASS preliminar | VENTA, CFE y trazo se relacionan sin cifras ficticias.                        |
| Transiciones diseñadas         | PASS preliminar | Morph, envío/retorno, pullout y reveal del borde.                             |
| Integración audiovisual        | FAIL pendiente  | Cues técnicamente sincronizados; falta escucha crítica.                       |
| Experiencia profesional global | FAIL pendiente  | No se certifica con fotogramas, compilación o métricas.                       |

**MOTION_CONTINUITY=NEEDS_REVISION** hasta mirar el video completo. **POWERPOINT_RISK=LOW** en los checkpoints: un objeto central viaja y se transforma; este valor no equivale a calidad profesional. La publicación requiere revisión audiovisual humana de los cuatro MP4, resolución de cualquier hallazgo y aprobación explícita.

## Reproducción de controles

`pnpm quality`, `node scripts/regression-check.mjs`, `node scripts/qa-facturacion.mjs` y `node scripts/verify-av.mjs renders/facturacion-electronica-uy-01-16x9-av.mp4 --facturacion` (repetir el último comando por ratio). Para regenerar: `node scripts/render-av.mjs --campaign=facturacion-electronica-uy-01 --ratio=16:9 --fps=24` y sustituir el ratio en cada ejecución.

## Propuesta de audio V2

V1 permanece congelada como referencia. V2 mantiene la misma animación y el mismo reloj visual: baja de once a seis cues, agrega cama tonal procedural a 96 BPM con ducking moderado, textura ambiente discreta y cola en silencio antes del cierre. Plan: `sound-plan-v2.md`; bloqueo de versiones/hash: `audio-lock.json`. Consola A/B: `/lab/campaigns/facturacion-electronica-uy-01`, controles AUDIO V1 / AUDIO V2.

### Human Audio Review — requerida para V2

1. ¿Los seis cues coinciden con las transformaciones y desplazamientos?
2. ¿La cama musical mejora el relato o distrae del copy?
3. ¿La textura ambiente se percibe como profundidad útil o como ruido?
4. ¿Algún SFX resulta genérico, exagerado o ambiguo respecto a la respuesta DGI?
5. ¿La resolución y el silencio final dejan respirar la marca?
6. ¿Volverías a reproducir la pieza con sonido activado?

**AV_PERCEPTUAL_QA=NEEDS_HUMAN_REVIEW** hasta responder la escucha completa de V1 y V2. No se declara calidad artística PASS a partir de RMS, espectro, build o inspección de código.

| Dimensión AV perceptual | Estado                                                          |
| ----------------------- | --------------------------------------------------------------- |
| RHYTHM                  | NEEDS_HUMAN_REVIEW                                              |
| SYNC                    | NEEDS_HUMAN_REVIEW (sync técnico PASS; percepción no escuchada) |
| DENSITY                 | NEEDS_HUMAN_REVIEW                                              |
| MUSIC_FIT               | NEEDS_HUMAN_REVIEW                                              |
| SFX_FIT                 | NEEDS_HUMAN_REVIEW                                              |
| BALANCE                 | NEEDS_HUMAN_REVIEW                                              |
| FATIGUE                 | NEEDS_HUMAN_REVIEW                                              |
| BRAND_FIT               | NEEDS_HUMAN_REVIEW                                              |
| FINAL_RESOLVE           | NEEDS_HUMAN_REVIEW                                              |
