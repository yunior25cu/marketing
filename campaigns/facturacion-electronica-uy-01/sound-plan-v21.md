> ARCHIVED: this audio plan is retained for traceability; V2.2 Rhythm Magnet is the only current audio version. See `review.md` and `sound-plan-v22.md`.

# Sound Palette & Audio Composition Plan — V2.1

**Estado:** tres mezclas de draft para escucha; ninguna seleccionada. El audio V2 queda congelado como AUDIO A. Las tres comparativas usan idéntico video y siete eventos principales.

## Dirección

Tecnológica, precisa, digital, sobria y premium. La mezcla pasa de anticipación a aceleración espacial, pausa de procesamiento, respuesta y resolución de marca. El centro perceptivo permanece en el relato; la anchura sonora es moderada. No hay samples externos: todos los sonidos se sintetizan proceduralmente en Balaxys Brand OS. Las definiciones y hashes están en `audio-lock.json`; el uso comercial queda registrado como síntesis original pendiente de revisión del titular.

## A/B/C

| Versión | Contenido                                                                         | Función                                                 |
| ------- | --------------------------------------------------------------------------------- | ------------------------------------------------------- |
| A       | V2 preservada: seis cues, ambience tonal y bed procedural original a 96 BPM.      | Referencia sonora sin cambios.                          |
| B       | Siete SFX rediseñados + ambience espacial; sin música.                            | Evaluar diseño sonoro y movimiento sin cama musical.    |
| C       | Misma composición que B + micro-percussion tonal, pulso y capa digital a 104 BPM. | Evaluar si la microcomposición eleva ritmo y presencia. |

104 BPM se eligió para probar pulsación y articulación en una pieza de 10 s, sin melodía protagonista. No representa todavía una selección final: compararlo con B en escucha nivelada.

## Timeline común B/C

| Tiempo | Cue                         | Origen            | Intención                                                                                  |
| ------ | --------------------------- | ----------------- | ------------------------------------------------------------------------------------------ |
| 0.35 s | `origin-trigger`            | síntesis original | Activación contenida de VENTA.                                                             |
| 1.68 s | `document-morph`            | síntesis original | Datos adquieren estructura documental.                                                     |
| 2.92 s | `cfe-resolve`               | síntesis original | Primer acento relevante, sin señal de aprobación fiscal.                                   |
| 4.24 s | `transmission-acceleration` | síntesis original | Barrido textural anticipa por unos frames el push y acompaña el viaje CFE → DGI.           |
| 5.58 s | `processing-breath`         | síntesis original | Tensión breve y contenida; el espacio entre este y la respuesta es deliberado.             |
| 6.20 s | `response-release`          | síntesis original | Subgrave corto, medios tonales y detalle alto discreto; retorno, no aprobación definitiva. |
| 9.10 s | `brand-resolve`             | síntesis original | Capas sub + acorde armónico + detalle alto breve, cola hasta el end card.                  |

La bed de C y la textura de B se abren durante el movimiento central. C hace ducking durante la pausa/respuesta y su cola se apaga cerca de 9.97 s. A conserva su timeline anterior y no se altera.

## Loudness y mezcla

Los A/B/C principales se exportan con normalización de dos pasadas a −18 LUFS y true peak ≤ −1.2 dBTP. B y C también tienen variantes de comparación a −16 LUFS. El PCM procedural previo a codificación permanece por debajo de 0 dBFS. Medición e inspección por archivo se registran en `.cache/av-qa/` y se resumen en `review.md`.

El renderizador actual mezcla a mono. No se aplica paneo estéreo artificial; la transmisión usa variación tímbrica y el campo visual lleva el desplazamiento. Un master estéreo requiere una implementación separada de mezcla y validación de canales.

## Revisión requerida

Comparar A/B/C a −18 LUFS sobre el mismo draft; comprobar B/C a −16 LUFS por presencia y fatiga. Escuchar con auriculares, altavoz de laptop y simulación móvil. Evaluar RHYTHM, SYNC, DENSITY, MUSIC_FIT, SFX_FIT, BALANCE, FATIGUE, BRAND_FIT y FINAL_RESOLVE. Elegir B o C sólo después de escuchar; hasta entonces `SELECTED_AUDIO=NONE / NEEDS_HUMAN_REVIEW`.
