# Sound Palette & Audio Composition Plan — V2

**Audio V2 avanzada · propuesta en revisión · visual V1 idéntico.**

## Sound Palette

- Carácter: preciso, tecnológico, controlado; sin “corporate uplift”, jingle o sonido fiscal de aprobación.
- Energía: baja → media durante la transmisión → resolución breve.
- Densidad: baja. Seis cues, una textura ambiente tenue y una cama tonal procedural a 96 BPM.
- Music selection: `balaxys-minimal-pulse-v1`, original y generada en memoria. El patrón grave armónico aporta pulso al trayecto; no representa una pista externa ni fue elegida por etiqueta genérica. Ducking a 0.62 por 700 ms al inicio de respuesta.
- Ambience: `balaxys-tech-room-v1`, textura tonal de muy bajo nivel; se abre gradualmente y sostiene espacio, no “ruido de oficina”.
- Silencio: huecos entre ataques, especialmente antes del origen y durante la respiración del cierre. La cama termina con fade a 9.35 s; el último tramo permite leer el end card.

## Composition plan

| Tiempo     | Beat visual                            | Audio                    | Intención                                                      |
| ---------- | -------------------------------------- | ------------------------ | -------------------------------------------------------------- |
| 0.00–0.35  | Negro / activación de VENTA            | silencio                 | Dejar que la entrada visual abra el relato                     |
| 0.35       | VENTA y trazo causal                   | `signal-pulse`           | Origen preciso                                                 |
| 1.68       | Segmentos construyen documento         | `line-build`             | Textura breve de construcción                                  |
| 2.92       | Morfosis a CFE                         | `transaction-tick`       | Punto tonal, sin sonido de “éxito”                             |
| 4.45       | Documento viaja                        | `data-glide` + bed abre  | Dar dirección y distancia al movimiento                        |
| 6.05       | Retorno de respuesta                   | `soft-confirm` + ducking | Recibir respuesta controlada, no inferir aceptación definitiva |
| 7.60–8.65  | Relación con operación / cierre visual | bed y textura            | Expandir espacio con baja densidad                             |
| 8.65       | Resolución de marca                    | `resolve-harmonic`       | Acorde corto, cola ordenada                                    |
| 9.35–10.00 | End card                               | silencio                 | Dejar respirar copy y marca                                    |

Los tiempos se derivan de la animación existente; no se alteró motion. Revisar sincronía y calidad de la cola por escucha humana. La bed se sintetiza in situ; el nombre de selección identifica una versión del instrumento procedural, no un archivo musical de terceros.
