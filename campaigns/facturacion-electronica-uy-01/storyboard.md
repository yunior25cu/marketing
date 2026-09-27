# Motion plan — El documento conserva su origen

Campaña `facturacion-electronica-uy-01`, versión 1. Master composition de **0 a 10 000 ms**. Los rangos son beats solapables de un mismo espacio. Todo estado se deriva del tiempo absoluto; no usar timers independientes.

## Beats y sonido compartido

| Tiempo          | Objeto y transformación                                                                                                                           | Cámara / ritmo                                                                        | Cue absoluto                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 0–1 500 ms      | VENTA y su subrayado de cinco segmentos dan origen al trazo que construye el documento; sin importes.                                             | Encuadre amplio; pulso, reacción y lectura breve.                                     | 350 ms: venta.                                   |
| 1 500–3 500 ms  | Los segmentos se separan y se recomponen como contorno documental; las líneas interiores llevan a CFE. No se animan cifras ni importes contables. | Push-in suave; reposo al resolver CFE.                                                | 1 550 ms: construcción; 2 900 ms: CFE.           |
| 3 500–5 500 ms  | Un pulso atraviesa el documento y conduce su viaje hasta el plano abstracto DGI. La línea conserva el origen fuera de cuadro.                     | Tracking motivado por el documento; aceleración de envío y desaceleración al destino. | 3 750 ms: firma; 4 450 ms: envío; 5 350 ms: DGI. |
| 5 500–7 000 ms  | Una señal regresa por la misma trayectoria. RESPUESTA identifica el retorno; el documento redistribuye el acento.                                 | Breve reposo en destino, retorno y reacción.                                          | 6 050 ms: respuesta; 6 700 ms: regreso.          |
| 7 000–8 500 ms  | Se recuperan venta y documento; se revelan conexiones existentes con CONTABILIDAD y CUENTA DEL CLIENTE, sin activarlas por el retorno fiscal.     | Pullout que revela contexto, seguido de estabilidad.                                  | 7 600 ms: recuperación del origen.               |
| 8 500–10 000 ms | El borde del documento se expande y abre una máscara para el cierre tipográfico y el wordmark. La línea compartida permanece.                     | Release; lectura final estable.                                                       | 8 650 ms: resolución; cola dentro de 10 000 ms.  |

## Transformation Map

| Origen persistente                  | Transición semántica | Destino / propiedad conservada                                                                          |
| ----------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------- |
| Cinco segmentos del subrayado VENTA | SPLIT + MORPH        | Contorno documental; mismos segmentos, peso y ancla.                                                    |
| Líneas y rótulo documentales        | TRACKING + REVEAL    | CFE dentro del documento; ajuste de tracking y dibujo de líneas, sin morph literal de trazos en letras. |
| Trazo documental                    | CONTINUATION + CARRY | Trayecto de transmisión; origen visible o reencontrable.                                                |
| Pulso en plano DGI                  | MATCH + CARRY        | Señal de regreso; misma ruta, sentido inverso.                                                          |
| Documento y origen fuera de foco    | CAMERA DISCOVERY     | Relación VENTA → DOCUMENTO y conexiones documentadas; geometría persistente.                            |
| Borde del documento                 | MASK TRANSITION      | Cierre tipográfico; borde convertido en límite de revelado.                                             |

## Cámara y recomposición por formato

| Formato | Campo y trayectoria                                                                                                | Cierre                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| 16:9    | Venta a izquierda, documento al centro, DGI a derecha; tracking lateral y pullout horizontal.                      | Titular amplio en dos líneas; la línea de origen ocupa el ancho disponible.                   |
| 9:16    | Venta en tercio superior, documento central, destino en tercio inferior; tracking vertical y regreso hacia arriba. | Tres bloques de lectura apilados, wordmark separado del margen inferior; área útil protegida. |
| 4:5     | Diagonal corta de origen superior izquierdo a destino inferior derecho; el documento mantiene escala suficiente.   | Titular recompuesto con menos ancho; no reutilizar el encuadre 9:16 recortado.                |
| 1:1     | Arco compacto alrededor del documento central; origen y DGI en esquinas opuestas con rótulos legibles.             | Cierre centrado en anchura, con interlínea y escala propias.                                  |

Cada formato cambia anclas, ruta, escala documental, distancia de cámara y saltos del titular. Conserva causalidad y cues, no coordenadas del master escaladas. El plano DGI carece de edificio, escudo, sello e interfaz oficial. No usar rotación ornamental que dificulte la lectura.

## Checkpoints antes / durante / después

| Transformación      | Milisegundos          | Evidencia que debe inspeccionarse                                                           |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------- |
| Venta → documento   | 1 300 / 2 150 / 2 950 | Segmentos reconocibles atraviesan el morph; no hay sustitución por una tarjeta.             |
| Documento → envío   | 3 450 / 4 450 / 5 400 | Pulso precede al desplazamiento; documento y ruta conservan relación.                       |
| Destino → respuesta | 5 550 / 6 150 / 6 800 | Señal vuelve por la ruta existente y causa una respuesta visible, sin aceptación inventada. |
| Regreso → origen    | 6 850 / 7 600 / 8 200 | El pullout recupera entidades preexistentes y su conexión.                                  |
| Documento → cierre  | 8 350 / 8 850 / 9 650 | Borde impulsa máscara; texto legible y línea causal presente.                               |

Verificar los 15 checkpoints en los cuatro ratios y revisar cada render completo con audio. En reduced motion: detener cámara y reproducción; mostrar composición final más descripción accesible «Venta → documento electrónico → firma y envío → DGI → respuesta → vínculo con la operación de origen. Secuencia conceptual». Los checkpoints y esta planificación no constituyen un PASS creativo.
