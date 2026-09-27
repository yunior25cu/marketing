# Changelog — Una venta deja rastro

## v1 — 2026-09-27

- Pedido normalizado por Campaign Orchestrator.
- Concepto y storyboard iniciales creados.
- Estado DRAFT.

## v1 — 2026-09-27, entrega en revisión

- Brief original conservado en `request.txt`; claims limitados documentados con fuentes oficiales en `product-evidence.md`.
- Dirección, copy, storyboard, implementación SVG continua y sonido procedural integrados.
- Cuatro MP4 exportados, consola y vista individual disponibles; mediciones técnicas AV y QA de formatos ejecutadas.
- Estado `IN_REVIEW`; `MOTION_GRAPHICS_QUALITY=FAIL` hasta la revisión perceptual completa y aprobación humana.

## Audio V2 — 2026-09-27

- V1 preservada como referencia; V2 aporta Sound Palette, Audio Composition Plan y audio-lock con seis cues, ambience tenue y cama procedural 96 BPM.
- Exportados draft 960×540, WAV master, stems y cuatro masters MP4 de V2; la imagen conserva las mismas escenas y reloj visual.
- QA técnico de los cuatro ratios pasó. La escucha perceptual V1/V2 sigue pendiente; ningún audio fue aprobado para publicación.

## V2.1 — 2026-09-27

- Se mantuvieron concepto, estructura, claims, copy, identidad y cuatro formatos.
- Se reforzó el tramo central con push/travelling de cámara, carriles espaciales de datos, expansión de llegada DGI y respuesta de retorno.
- Se preservó AUDIO V2 como referencia A y se implementaron B (SFX + ambience) y C (SFX + ambience + microcomposición procedural a 104 BPM). Los nuevos cues y definiciones tienen catálogo, hashes y licencia procedural documentados.
- Se añadieron controles A/B/C y opciones de export a −18 LUFS y −16 LUFS con techo objetivo −1.2 dBTP.
- Typecheck, ESLint afectado y validador de catálogo pasan. Los borradores audiovisuales de V2.1 se registran en la actualización de entregables de abajo. No se seleccionó mezcla. Ver `review-v21.md` y `audio-ab-review.md`.
- Estado continúa `IN_REVIEW`; `MOTION_GRAPHICS_QUALITY=FAIL` hasta la revisión integral humana.

### Actualización de entregables V2.1

- Tras autorización del operador se generaron cinco drafts 16:9 a 960×540/24 fps: A/B/C a loudness objetivo −18 LUFS y B/C a −16 LUFS.
- Los drafts se regeneraron después del build de producción V2.1 para asegurar que todos contienen el source visual actualizado.
- Verificación de MP4 AAC: duración 10.005 s, 48 kHz, true peak −1.2 dBTP; LUFS observados: A −18.2, B −18.4, C −18.3, B−16 −16.9 y C−16 −16.7. Los cinco pasan AV técnico.
- QA browser: 68 checkpoints en cuatro ratios, seek/reduced motion y reproducción sin issues. Vitest 30/30, typecheck, ESLint y build pasan.
- A/B/C y mediciones: `audio-ab-review.md`. Falta escucha humana, selección de B/C, revisión artística integral y validación móvil. No se exportan masters ni se declara aprobación.

## V2.2 — 2026-09-27

- Se conserva la composición visual V2.1 sin cambios; el master mide 12 s con 1 s de preroll Obsidian y 1 s de hold del frame final.
- Se retira A/B/C y audio anterior de la consola activa. La única pista vigente usa el segmento 00:08.000–00:20.000 de Rhythm Magnet, proporcionado por el operador.
- Se registra hash, origen reportado, autor y página/estado de licencia en el manifest. Falta certificado/código: uso comercial pendiente de verificación.
- El único export de esta revisión es 16:9; formatos adicionales esperan revisión humana. Campaña `IN_REVIEW`, sin aprobación.
