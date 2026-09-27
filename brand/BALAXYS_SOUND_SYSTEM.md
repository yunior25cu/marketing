# Balaxys Sound System

## Principio

El audio se diseña como parte de la coreografía audiovisual. Sound Director y Motion Designer comparten beats, transformaciones, energía y silencios antes de mezclar. Cada pieza obtiene una Sound Palette y un Audio Composition Plan; `NO_SOUND` es una decisión válida. Música sólo se incluye cuando mejora el relato.

## Roles y formato

Sound Designer actúa como Sound Director: interpreta concepto, copy, audiencia, MotionPlan y TransformationMap, busca por semántica y decide música, ambience, SFX y silencio. Audio Engineer ejecuta esa intención: timeline absoluta en ms, síntesis/edición, mixer, sincronía, FFmpeg, export WAV/MP4 y mediciones. AV Quality Auditor valora el resultado completo en reproducción.

Los niveles son `NONE`, `SFX`, `SFX_AMBIENCE` y `FULL`. `FULL` admite SFX, ambience/sound bed y música cuando corresponda. Pistas disponibles: SFX, AMBIENCE y MUSIC con ganancia 0–1. Las beds aplican fade in/out y ducking moderado cuando el plan define un cue crítico. Un beat puede marcar silencio sin añadir un archivo mudo.

## Registro y gates

`assets/audio/manifest.json` es la fuente del catálogo activo. Todo medio externo necesita fuente, URL, licencia concreta, permiso comercial y restricciones revisadas; sin esos datos no se incorpora. El gate de publicación exige commercialUse=true. Un asset ausente da `MISSING_AUDIO_ASSET` y nunca se reemplaza silenciosamente. El `audio-lock.json` fija versión e IDs para cada render.

Los sonidos procedurales listados como originales se generan en tiempo de ejecución y no incluyen muestras externas. Su uso comercial queda registrado para revisión del titular; una propuesta de firma sonora no cambia la marca sin aprobación humana.

## Revisión

Técnica: duración, formato, peak/clipping, silencio, pistas, codec, sample rate, sincronía, fades y cola. Perceptual: RHYTHM, SYNC, DENSITY, MUSIC_FIT, SFX_FIT, BALANCE, FATIGUE, BRAND_FIT y FINAL_RESOLVE, cada uno `PASS`, `NEEDS_REVISION` o `FAIL`. RMS no sustituye escuchar la pieza completa. Sin escucha humana, AV perceptual queda `NEEDS_HUMAN_REVIEW`.
