# Revisión — Facturación electrónica Uruguay · V2.2

**CAMPAIGN:** `facturacion-electronica-uy-01` · **ESTADO:** `IN_REVIEW` · **MASTER:** 12.000 s · **EXPORT REVISABLE:** 16:9. No hay aprobación de publicación.

## Entregable

[MP4 16:9 Rhythm Magnet, 1920×1080, 24 fps, 12 s](../../renders/facturacion-electronica-uy-01-16x9-rhythmmagnet.mp4). No se exportaron 9:16, 4:5 ni 1:1; esperan la revisión humana del 16:9.

## Imagen y sincronización

`VISUAL_VERSION=2.1 (última fuente disponible; IN_REVIEW, sin snapshot aprobado)` · `VISUAL_CHANGED=NO`. La composición conserva su reloj de 10.000 s. El master usa Obsidian solo de 00.000 a 01.000; el video corre de 01.000 a 11.000 sin alterar sus timings y sostiene el frame final hasta 12.000. La verificación de frame confirma Obsidian uniforme en el preroll y hold estable durante el segundo final.

## Audio medido

`MUSIC=bensound-rhythmmagnet.mp3` · fuente `00:08.000–00:20.000` → master `00.000–12.000`. Una sola pista AAC estéreo a 48 kHz. No hay SFX, ambiente ni pista adicional. Hay audio antes del video (RMS 0.128) y después (RMS 0.099).

- Integrado: `−13.9 LUFS` (nivel propio del fragmento; sin normalización de loudness).
- True peak AAC: `−0.8 dBTP`; sample peak `0.910`; clipping: `NO`.
- Fuente medida: `+0.9 dBTP`. Se aplicaron `−1.9 dB` de ganancia, la atenuación mínima configurada para contener ese pico. Resampling 48 kHz y AAC son las otras operaciones; no se aplicaron fades ni efectos creativos.
- `SFX=NONE` · `AMBIENCE=NONE` · `ADDITIONAL_AUDIO=NONE`.

## Procedencia y licencia

`AUDIO_LICENSE_REGISTERED=YES` en cuanto a procedencia reportada, hash, autor listado y términos actuales asentados en el manifest. El MP3 fue proporcionado manualmente por el operador. No hay certificado/código que acredite la licencia de esta descarga: `LICENSE_CLEARANCE=PENDING_PROOF` y `commercialUse=null`. Bensound indica que su Free License es para proyectos limitados sin ingresos; los anuncios online requieren Professional y la reventa del proyecto a varios clientes puede requerir Business. La revisión local es posible; la publicación sigue bloqueada hasta recibir y verificar la licencia concreta. [Página oficial del tema](https://www.bensound.com/royalty-free-music/track/rhythm-magnet-happy-organ) · [Términos de Bensound](https://www.bensound.com/terms-and-conditions).

## Validaciones y estado creativo

`FFMPEG_PROBE_VALIDATION=PASS` (12.000 s, H.264 1920×1080/24 fps, una pista AAC/48 kHz, preroll/hold y presencia de música antes/después) · `NO_CLIPPING=PASS` · `LISTEN_CONTROL=PASS` (consola comprobada en navegador) · `BUILD=PASS` · `LINT=PASS` · `TYPECHECK=PASS` · `TESTS=PASS (31/31)` · `REGRESSION=PASS`.

`MOTION_GRAPHICS_QUALITY=FAIL` hasta escuchar y mirar la pieza completa y completar la revisión de los nueve criterios. La escucha perceptual del MP4 también sigue pendiente. Estado `IN_REVIEW`; no aprobada.

## Registro pedido

```text
CAMPAIGN=facturacion-electronica-uy-01
VISUAL_VERSION=2.1 source; not previously approved
VISUAL_CHANGED=NO
MUSIC=bensound-rhythmmagnet.mp3
SOURCE_RANGE=00:08.000-00:20.000
MASTER_DURATION=12.000
VIDEO_START=1.000
VIDEO_END=11.000
MUSIC_START=0.000
MUSIC_END=12.000
SFX=NONE
AMBIENCE=NONE
OLD_AUDIO_VARIANTS_REMOVED_FROM_ACTIVE_CAMPAIGN=YES
LISTEN_CONTROL=PASS
AUDIO_LICENSE_REGISTERED=YES; LICENSE_CLEARANCE=PENDING_PROOF
FFMPEG_VALIDATION=PASS
BUILD=PASS
MOTION_GRAPHICS_QUALITY=FAIL
STATUS=IN_REVIEW
```
