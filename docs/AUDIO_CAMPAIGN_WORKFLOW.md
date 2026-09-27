# Audio Campaign Workflow

1. Leer concepto, copy, audiencia y mapa de transformaciones.
2. Sound Director entrega `SOUND PALETTE`: carácter, energía, densidad, referencias y selección semántica; puede elegir `NO_SOUND`.
3. Antes de mezclar, entregar `AUDIO COMPOSITION PLAN`: beats, timeline absoluta, música/ambience/SFX, silencios y resolución.
4. Resolver licencias y fijar `audio-lock.json` con IDs y hashes. Asset ausente bloquea como `MISSING_AUDIO_ASSET`.
5. Audio Engineer renderiza draft 960×540 con timeline visual intacta. Ajustar cues, balance, fades/ducking; luego emitir MP4/WAV masters y stems no versionados.
6. Probar duración, pistas, codec, sample rate, peak, clipping, cue schedule, sync técnico y cola.
7. Escuchar el render audiovisual completo y contestar Human Audio Review. Sin escucha perceptual, conservar `NEEDS_HUMAN_REVIEW`.

## Comparación

V1/V2 deben compartir exactamente el mismo render visual y los mismos timestamps de animación. En Campaign Console se cambia sólo la timeline de audio. Toda edición a una pista produce nueva versión y review.

### Caso Facturación Electrónica Uruguay

V1 se conserva como referencia original de once cues SFX. V2 usa seis eventos: origen, construcción documental, transformación CFE, transmisión, respuesta controlada y resolución Balaxys. La cama original de 96 BPM empieza después del origen, abre energía con discreción, baja 38% alrededor de la respuesta y termina con fade antes del cuadro final. Una textura ambiente muy baja sostiene continuidad. Debe revisarse por escucha antes de adoptar V2.
