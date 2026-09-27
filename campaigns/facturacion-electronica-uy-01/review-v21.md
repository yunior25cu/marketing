# Revisión — V2.1

**Campaña:** `facturacion-electronica-uy-01` · **CAMPAIGN_VERSION=2.1** · **Estado:** `IN_REVIEW`.

V2.1 conserva concepto, claims, copy, paleta, tipografía, cierre y duración. El tramo CFE → DGI incorpora movimiento de cámara, carriles de transmisión, expansión de llegada, respiración y retorno de respuesta. Se mantienen las composiciones 16:9, 9:16, 4:5 y 1:1 en source.

## Entregables

| Entregable                                                    | Estado                                                                                                                                                                                                      |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fuente visual V2.1                                            | Implementada en `src/campaigns/facturacion-electronica-uy-01/`.                                                                                                                                             |
| A — V2 preservada sobre imagen V2.1                           | [Draft 960×540, −18 LUFS](../../renders/facturacion-electronica-uy-01-16x9-audio-2-draft-lufs-18-av.mp4).                                                                                                   |
| B — SFX + ambience                                            | [Draft 960×540, −18 LUFS](../../renders/facturacion-electronica-uy-01-16x9-audio-2-1b-draft-lufs-18-av.mp4) y [−16 LUFS](../../renders/facturacion-electronica-uy-01-16x9-audio-2-1b-draft-lufs-16-av.mp4). |
| C — SFX + ambience + cama musical                             | [Draft 960×540, −18 LUFS](../../renders/facturacion-electronica-uy-01-16x9-audio-2-1c-draft-lufs-18-av.mp4) y [−16 LUFS](../../renders/facturacion-electronica-uy-01-16x9-audio-2-1c-draft-lufs-16-av.mp4). |
| Selección / WAV final / stems / masters 16:9, 9:16, 4:5 y 1:1 | Pendientes de escucha A/B/C y selección humana.                                                                                                                                                             |

## Cambios frente a V2

- Cámara: push al trayecto a 4,3 s, avance hacia DGI, expansión de llegada y release antes del pullback.
- Imagen: tres carriles nacen de los trazos del documento, se desplazan hacia DGI y convergen en ondas contenidas. Sin copy central nuevo ni estado fiscal ficticio.
- Audio A conserva V2. B usa siete cues, barrido espacial, microtensión, respuesta multicapa y ambiente, sin música. C agrega microcomposición procedural a 104 BPM, pulso, micropercusión y ducking en la respuesta.
- Los nuevos sonidos son síntesis original, sin muestras externas. El mezclador permanece mono; no se fuerza paneo estéreo artificial.

## Medición de drafts

Los cinco MP4 tienen 960×540, 24 fps, duración contenedora de 10,005 s, una pista H.264 y una pista AAC mono a 48 kHz. Todos pasan la verificación técnica: sin clipping de muestras, cues medibles y true peak −1,2 dBTP.

| Draft           | LUFS integrado | True peak | Tail RMS últimos 100 ms | AV técnico |
| --------------- | -------------: | --------: | ----------------------: | ---------- |
| A, objetivo −18 |          −18,2 | −1,2 dBTP |                       0 | PASS       |
| B, objetivo −18 |          −18,4 | −1,2 dBTP |                  0,0030 | PASS       |
| C, objetivo −18 |          −18,3 | −1,2 dBTP |                  0,0037 | PASS       |
| B, objetivo −16 |          −16,9 | −1,2 dBTP |                  0,0041 | PASS       |
| C, objetivo −16 |          −16,7 | −1,2 dBTP |                  0,0051 | PASS       |

Todos los sonidos son generados proceduralmente en el proyecto; no se importó audio externo. C usa `balaxys-motion-bed-v21`. La resolución `brand-resolve-v21` empieza en 9,10 s y su cola llega al límite de 10 s. WAV/stems finales se difieren hasta elegir mezcla.

## Curva y revisión visual

| Tiempo    | Energía / evento                                   |
| --------- | -------------------------------------------------- |
| 0–1,5 s   | Intriga controlada: VENTA.                         |
| 1,5–3,5 s | Aceleración: morfosis al CFE.                      |
| 3,5–5,5 s | Máximo movimiento: cámara y transmisión CFE → DGI. |
| 5,5–7 s   | Contención y respuesta de retorno.                 |
| 7–8,5 s   | Expansión de relaciones operativas.                |
| 8,5–10 s  | Resolución de copy y marca.                        |

La curva está implementada; Visual QA del source y del draft en movimiento sigue pendiente. Los MP4 son revisión 16:9 en baja resolución, no masters. 9:16 requiere inspección especial antes de exportar formatos finales.

## QA y gates

- Typecheck: PASS. ESLint completo: PASS. Validador de catálogo/licencias/hashes: PASS (18 assets). Registro de campaña válido: PASS. `git diff --check`: PASS.
- Vitest: PASS, 30/30 tests. Build Vite: PASS.
- QA browser: PASS, 68 checkpoints en cuatro ratios, cero issues, seek determinista y reduced motion estático.
- Playback/rAF local: p95 16.8–17.1 ms; promedio 45.7–59.9 FPS. 16:9 registró 18 intervalos >33 ms y un outlier máximo de 550.5 ms; 9:16 tuvo 10 outliers y máximo 216.9 ms. 4:5 y 1:1 no registraron intervalos >33 ms. El p95 se mantiene cerca del frame budget; verificar en hardware real.
- Audio técnico: PASS en cinco drafts, medido tras AAC con ebur128. Loudnorm se ejecuta con análisis y segunda pasada; true peak −1.2 dBTP.
- Escucha crítica A/B/C, sincronía percibida, compatibilidad real en móvil y Brand Guardian: NEEDS_HUMAN_REVIEW.
- Claims y copy no cambiaron; se mantienen las evidencias de producto existentes.

`MOTION_GRAPHICS_QUALITY=FAIL` hasta revisar la pieza completa, demostrar los nueve criterios y resolver cualquier hallazgo. No implica rechazo de los drafts; mantiene bloqueada la certificación profesional y publicación. `VISUAL_QA=NEEDS_HUMAN_REVIEW` para el juicio artístico (checkpoints técnicos PASS), `AUDIO_QA=PASS` técnico / `NEEDS_HUMAN_REVIEW` perceptual, `AV_QA=NEEDS_HUMAN_REVIEW`. Campaña IN_REVIEW; no aprobada.

## Registro de salida

```text
CAMPAIGN_VERSION=2.1
VISUAL_MIDSECTION_IMPROVED=YES (source y draft generados; juicio perceptual pendiente)
ENERGY_CURVE=NEEDS_HUMAN_REVIEW
MOTION_GRAPHICS_QUALITY=FAIL
AUDIO_V2_PRESERVED=YES
AUDIO_A_CREATED=YES (draft 16:9)
AUDIO_B_CREATED=YES (drafts -18/-16)
AUDIO_C_CREATED=YES (drafts -18/-16)
SELECTED_AUDIO=NONE
MUSIC_USED=NO (sin selección; candidato C)
AMBIENCE_USED=YES (B/C)
STEREO_MASTER=NO (mezclador mono)
LOUDNESS_LUFS=A -18.2 / B -18.4 / C -18.3; B -16.9 / C -16.7
TRUE_PEAK_DBTP=-1.2 en los cinco drafts
FINAL_AUDIO_TAIL=A ~9.47 s; B/C hasta 10.00 s
SFX_COUNT=7 (B/C); A conserva seis
MUSIC_TRACK=balaxys-motion-bed-v21 (candidato C)
SONIC_SIGNATURE=proposal / brand-resolve-v21
MOBILE_AUDIO_CHECK=NEEDS_HUMAN_REVIEW
VISUAL_QA=NEEDS_HUMAN_REVIEW (68 checkpoints técnicos PASS)
AUDIO_QA=PASS técnico / NEEDS_HUMAN_REVIEW perceptual
AV_QA=NEEDS_HUMAN_REVIEW
16X9=PASS (draft 960x540; master pendiente)
9X16=PASS (source/layout QA; master pendiente)
4X5=PASS (source/layout QA; master pendiente)
1X1=PASS (source/layout QA; master pendiente)
LINT=PASS
TYPECHECK=PASS
TESTS=PASS (30/30)
BUILD=PASS
```
