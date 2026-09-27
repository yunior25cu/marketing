# Sound Plan — V2.2 · Rhythm Magnet

## Selección única

El operador solicita usar exclusivamente el archivo existente `assets/audio/music/bensound-rhythmmagnet.mp3`; no se descargó ni sustituyó la fuente. El segmento fuente es `[8.000, 20.000) s`, duración exacta de 12 s. Se inicia en el master a `0.000 s` y se recorta al segundo 20 de origen.

## Composición master

| Master          | Imagen                                            | Música                 |
| --------------- | ------------------------------------------------- | ---------------------- |
| 0.000–1.000 s   | Solo Obsidian (#0B0D0E)                           | Fuente 08.000–09.000 s |
| 1.000–11.000 s  | Visual V2.1 completa, reloj visual 0.000–10.000 s | Fuente 09.000–19.000 s |
| 11.000–12.000 s | Hold del último frame visual                      | Fuente 19.000–20.000 s |

No se añaden SFX, ambiente, clicks, impactos, confirmaciones, sonido UI ni firma sonora. La música es la única pista.

## Procesamiento técnico

La fuente mide `+0.9 dBTP` en el fragmento seleccionado. Se reduce la ganancia `1.9 dB` —atenuación lineal, sin compresión ni normalización de loudness— para apuntar a `−1.0 dBTP`. Solo se permite el resampling requerido por el exportador (`48 kHz`) y codificación AAC. No se cambian tempo ni pitch, no hay loops ni fades. Si la escucha detecta click en los cortes, se evaluará un fade extremadamente corto como corrección técnica.

Medición del MP4 AAC: `−13.9 LUFS`, `−0.8 dBTP`, sample peak `0.910`, sin clipping. Música presente antes del video y en el segundo posterior. El reproductor limita el fragmento a 12 s de master también con movimiento reducido.

## Procedencia y licencia

- Archivo: `assets/audio/music/bensound-rhythmmagnet.mp3`
- Origen reportado: archivo proporcionado manualmente por el operador.
- Página del track: https://www.bensound.com/royalty-free-music/track/rhythm-magnet-happy-organ
- Autor listado: Marcus P.
- Licencia descargada, certificado y código: no presentes en el workspace.
- Estado: `PENDING_PROOF`; el audio puede revisarse localmente, la publicación no se habilita hasta comprobar derechos comerciales aplicables.
- Hash: `f453902b0ada15d10361a8bdc767ef9b4499a3dabac279e7b9121e299372dee1`.

El manifest de la biblioteca registra este elemento como fuente pendiente; no pasa a la colección de assets licenciados de uso general.
