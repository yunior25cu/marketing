# Sound Plan — Facturación electrónica Uruguay

## Dirección sonora

`audioLevel: SFX`. Duración: 10 000 ms. Sin música, voz ni cama ambiente: la narración necesita que se distinga el origen, la construcción, el viaje de ida y vuelta y la resolución. Los huecos entre ataques separan esas funciones. Las once señales se agrupan en siete gestos narrativos; no se sonoriza cada línea, letra o microacción.

El sonido se diseña con la misma línea de tiempo absoluta que el movimiento. `facturacionAudioTimeline` se exporta desde `scripts/audio-core.mjs`, con declaración TypeScript en `scripts/audio-core.d.mts` e identificador `facturacion-electronica-uy-01`. Preview y exportación deben consumir ese mismo objeto.

## Cues y sincronía prevista

| Inicio  | Sonido       | Ganancia | Transformación que debe coincidir con el ataque               |
| ------- | ------------ | -------- | ------------------------------------------------------------- |
| 350 ms  | signal-pulse | 0.40     | VENTA y su subrayado cobran actividad; pulso de origen.       |
| 1550 ms | line-build   | 0.21     | Los trazos de VENTA comienzan a construir el documento.       |
| 2150 ms | connection   | 0.21     | Las líneas completan su relación documental.                  |
| 2900 ms | signal-pulse | 0.21     | La estructura se lee como CFE.                                |
| 3750 ms | line-build   | 0.28     | El recorrido de firma atraviesa el documento.                 |
| 4450 ms | connection   | 0.28     | El envío comienza su recorrido espacial.                      |
| 5350 ms | signal-pulse | 0.21     | El recorrido llega a la referencia abstracta DGI.             |
| 6050 ms | connection   | 0.28     | La respuesta inicia el recorrido inverso.                     |
| 6700 ms | signal-pulse | 0.40     | La respuesta regresa al documento y cambia su lectura visual. |
| 7600 ms | line-build   | 0.28     | La apertura de cámara revela el vínculo con el origen.        |
| 8650 ms | final-impact | 0.40     | La geometría converge en la resolución de marca.              |

La respuesta se representa con conexión y pulso; no se utiliza el sonido `confirmation` ni una fanfarria de éxito. El audio no declara aceptación de DGI, aprobación fiscal ni una capacidad de Balaxys. Los eventos describen gestos visuales conceptuales.

## Mezcla y silencios

Tres pistas de categoría SFX: `operation` (0.40), `detail` (0.21), `flow` (0.28). Comparten registro tímbrico; la diferencia de nivel sostiene jerarquía entre protagonistas y microtransformaciones. El modo SFX reproduce las tres. No se crean stems de ambiente o música vacíos.

Ataque de 14 ms y caída procedural ya definidos por el Sound System. La cola final termina a 9270 ms: los últimos 730 ms quedan en silencio mientras la resolución visual respira. La pista PCM mantiene exactamente 10 segundos, evitando truncar una cola activa. Los cuatro formatos comparten timing y mezcla; su recomposición espacial no cambia los eventos sonoros.

## Origen y licencia

Síntesis procedural original del registro existente, sin muestras externas. Referencia de procedencia: `assets/audio/manifest.json`; autor registrado: Balaxys Brand OS; licencia registrada: «Proyecto Balaxys; síntesis original, sin muestras de terceros». Se conserva la restricción del manifiesto de revisar el uso comercial con el titular de marca antes de publicar. No se incorporaron assets que requieran otra entrada.

## Verificación ejecutada

Sobre el PCM de la timeline a 48 kHz, generado directamente con `renderAudio`:

- `validateAudioTimeline`: sin errores; los once cues tienen sonido, pista y ventana temporal válidos.
- Duración: 10.000 s; 480 000 muestras mono.
- Pico de muestras: 0.396980, equivalente a −8.025 dBFS.
- RMS: 0.056181, equivalente a −25.008 dBFS.
- Clipping de muestras: no detectado.
- Dos renderizados consecutivos: muestras idénticas.
- Último cue y cola dentro del video: 9270 ms.

Estas mediciones corresponden a PCM, no a true peak, LUFS ni al archivo AAC final. No se ha realizado escucha humana del MP4 ni comprobación perceptual de sincronía; quedan pendientes de la revisión audiovisual. La existencia de cues y una pista técnicamente válida no concede `MOTION_GRAPHICS_QUALITY=PASS`.
