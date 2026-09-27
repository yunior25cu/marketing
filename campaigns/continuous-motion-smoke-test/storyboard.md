# Motion storyboard — Master composition / 10 s

Los beats son intervalos narrativos; las acciones se solapan y comparten objetos, cámara y cue.

| Beat / intervalo          | Objeto persistente → transformación                                              | Dirección / cámara                                                          | Jerarquía y audio                                             |
| ------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------- |
| A · 0–1.4 s / trigger     | `18` se vuelve `17`; la unidad retirada conserva ancla y origen.                 | Push-in al stock; se contiene el movimiento al fijar 17.                    | Stock domina. Pulso en 0.18 s; transient de split en 1.16 s.  |
| B · 1.4–4 s / propagation | Unidad → punto en viaje → línea → cifra `$13.490`. El 17 queda atrás conectado.  | Tracking hacia la derecha, easing suave; el trazo progresa desde el origen. | La línea lleva la mirada; textura ascendente en 2.45 s.       |
| C · 4–6 s / record        | La línea sigue como borde de documento; la cifra se reencuadra dentro del mismo. | Reframe gradual, origen todavía visible.                                    | Documento recibe el total; conexión en 4.05 s.                |
| D · 6–8 s / discovery     | Documento → estructura contable; línea de stock a venta y registro permanece.    | Pull-out descubre el mapa simultáneo; hold para leer.                       | Debe/Haber aparece como consecuencia; confirmación en 6.16 s. |
| E · 8–10 s / resolve      | El recorrido guía el titular y la firma, que quedan en el campo final.           | Cámara estabiliza; release final sin corte.                                 | Revelado tipográfico por palabra; firma en 8.62 s.            |

## Transformation Map

`stock 18` → **MORPH** → `stock 17 + unidad desprendida` → **CONTINUATION** → `línea en viaje` → **TYPOGRAPHIC_TRANSFORMATION** → `$13.490` → **CONTINUATION** → `documento de venta` → **MORPH** → `estructura contable` → **CAMERA_DISCOVERY** → `stock · venta · registro en un mismo mapa` → **TYPOGRAPHIC_TRANSFORMATION** → `UNA VENTA NUNCA ES SÓLO UNA VENTA · BALAXYS`.

Mapa completo y cues verificables: [`campaign.json`](campaign.json). Capturas de transición: cada tramo tiene checkpoint antes, durante y después.
