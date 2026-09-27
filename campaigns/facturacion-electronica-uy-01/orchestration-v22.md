# Orchestration record — V2.2

Pedido: reemplazar las mezclas y beds anteriores por el fragmento exacto de Rhythm Magnet; insertar 1 s de pre-roll musical y 1 s de post-roll manteniendo intactos los 10 s visuales V2.1; exportar únicamente 16:9 para revisión.

Los agentes especialistas no se invocaron como procesos separados en esta sesión. Se aplican explícitamente sus contratos:

| Fase                              | Contrato aplicado                                                                                            | Resultado                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Campaign Orchestrator             | Cambios de audio aislados a campaña; mantener claims, copy y visuales; registrar revisión y no aprobar.      | `campaign.json` V2.2, estado `IN_REVIEW`, visual version 2.1, `visualChanged=false`.                             |
| Sound Designer                    | Respetar selección obligatoria del operador; definir fuente, rango, función y exclusiones.                   | Música continua como única pista, fuente 08.000–20.000 s; sin cues, SFX ni ambiente.                             |
| Audio Engineer                    | Recorte exacto, un reloj master, preview y export; medir clipping/true peak/duración.                        | 12 s, imagen 01–11 s, source MP3 existente, atenuación técnica mínima de 1.9 dB por true peak original positivo. |
| Motion Designer / Visual Engineer | Conservar exactamente la imagen fuente; implementar solo preroll/hold de master alrededor de la composición. | No se alteran los 10 s de la composición V2.1.                                                                   |
| Brand Guardian / Quality Auditor  | Identidad, claims y gate Motion Graphics; distinguir estatus técnico del creativo.                           | Claims/copy sin cambios; `MOTION_GRAPHICS_QUALITY=FAIL` hasta revisión audiovisual completa.                     |
| Visual QA / AV Quality Auditor    | Revisar render completo y sincronía; no inferir escucha.                                                     | Checks técnicos tras export; escucha y juicio profesional pendientes de revisión humana.                         |
| Performance Auditor               | Confirmar que el reproductor y preview no bloqueen el uso.                                                   | Build y chequeos reproducibles se registran en `review.md`; rendimiento de dispositivos reales no certificado.   |

La biblioteca mantiene los assets globales intactos. Las variantes anteriores se quitan de la consola activa y sus locks quedan archivados en `audio-lock.json`. La licencia de la pista externa sigue pendiente de certificado/código y bloquea publicación.
