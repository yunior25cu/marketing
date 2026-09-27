# Balaxys Sound Engine

El sistema sonoro se rige por `brand/BALAXYS_SOUND_SYSTEM.md`. `scripts/audio-core.mjs` contiene `SoundRegistry`, `AudioCue`, `AudioTrack`, `AudioTimeline`, síntesis y mezcla PCM determinista. El navegador y FFmpeg usan muestras generadas desde la misma definición temporal; no hay una segunda lista de cues. El smoke test incluye cinco SFX y una cama tenue, sin música. `assets/audio/manifest.json` declara el origen procedural y reservará entradas para futuros assets con licencia.

## Preview y exportación

En Campaign Console, Reproducir inicia Web Audio desde un gesto humano. Hay mute, volumen, escucha de mezcla/SFX/ambiente y sincronización al pausar o mover la posición. Autoplay puede estar bloqueado; el control informa y permite reintentar. Los cues derivan de los milisegundos de la campaña.

`pnpm render:av` construye la campaña experimental con audio AAC en un MP4 de 8 s. `--ratio=9:16` cambia formato; `--fps=30` cambia frecuencia. `--wav=renders/master.wav` guarda WAV master; `--stems=renders/stems` guarda sólo SFX y ambiente. El WAV y los stems son opcionales. El exportador trunca audio y video a 8 s y limpia fotogramas temporales. `pnpm qa:av` decodifica el MP4 real y mide duración, pistas, peak, RMS, presencia de cues y nivel al final; guarda `.cache/av-qa/report.json`.

## Límites

La medición técnica no sustituye escuchar en parlantes y teléfono. El master actual es mono PCM antes de AAC, sin voz ni música. Para campañas externas, confirmar plataforma de destino, especificación de loudness y licencias. No descargar audio arbitrario. Si hay clipping, bajar ganancia de pista en el timeline, regenerar y volver a medir; no normalizar un archivo ya distorsionado.
