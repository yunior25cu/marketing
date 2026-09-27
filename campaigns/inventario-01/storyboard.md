# Storyboard — NO SE QUEDA EN VENTAS.

| Tiempo     | Función      | Qué ocurre                                                                                                                  | Copy                                           |
| ---------- | ------------ | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 0.0–2.4 s  | Premisa      | Retícula dividida en VENTAS / INVENTARIO. La frase empieza en Ventas y su segunda mitad aparece del otro lado de la línea.  | LO QUE PASA EN VENTAS / NO SE QUEDA EN VENTAS. |
| 2.4–7.4 s  | Demostración | Venta #18492 se confirma; el dato −3 · A-104 cruza la divisoria; existencias 18 → 15; movimiento M-0417 con origen visible. | Datos de demostración                          |
| 7.4–10.0 s | Resolución   | La frase vuelve a ocupar ambas áreas; la secuencia completa queda escrita; firma.                                           | UNA VENTA SE CIERRA. / EL STOCK SE MUEVE.      |

La demostración usa la escena `sale-stock-link` (`src/scenes/SaleStockLink/`) con tiempo relativo `t − 2400`. El reloj se detiene en 10 000 ms.

## Plan de motion (ms absolutos)

| ms        | Elemento                                      | Estado inicial → final                                                                          | Transición               | Duración        | Easing   | Razón narrativa                                   |
| --------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------ | --------------- | -------- | ------------------------------------------------- |
| 0         | Premisa, primer tiempo (área Ventas)          | opacidad 0 → 1, 24 px → 0                                                                       | entrada                  | 280             | standard | Abre el origen: Ventas                            |
| 1000      | Premisa, segundo tiempo (área Inventario)     | oculto → visible                                                                                | entrada tipográfica      | 540             | standard | La frase cruza la divisoria                       |
| 2120      | Premisa                                       | 1 → 0                                                                                           | salida                   | 280             | exit     | Cerrar la cadena anterior                         |
| 2400      | Documento, existencias 18, libro              | 0 → 1, 24 px → 0                                                                                | entrada                  | 280             | standard | Estado inicial legible antes del evento           |
| 2900      | Venta #18492                                  | BORRADOR → CONFIRMADA; tarjeta −2° → 0°; área Ventas activa                                     | cambio de estado + pulso | 540 / 720 pulso | standard | Evento de origen                                  |
| 3400      | Línea Ventas → Inventario y dato −3 · A-104   | trazo 0 → 1 desde el documento; el dato viaja en la punta                                       | propagación              | 540             | standard | La consecuencia no se anticipa a su causa         |
| 3400      | Leyenda de la línea                           | 0 → 1: «SALIDA · 3 UNIDADES»                                                                    | entrada                  | 280             | standard | Nombra lo que viaja                               |
| 4000      | Existencias A-104                             | 18 → — pasa a 18 → 15; área Inventario activa                                                   | cambio + pulso           | 720 pulso       | —        | El destino cambia después de la llegada           |
| 4280      | Dato −3 · A-104                               | 1 → 0                                                                                           | salida                   | 150             | exit     | El dato se consume en el cambio                   |
| 4700      | Fila M-0417 · SALIDA · −3 · VENTA #18492 · 15 | 0 → 1, 16 px → 0                                                                                | registro                 | 280             | standard | El cambio queda registrado                        |
| 5400      | Origen                                        | celda y ID del documento resaltados; leyenda «ORIGEN · VENTA #18492»; estado «Relación visible» | resolución + pulso       | 720 pulso       | —        | La relación entre venta y stock se vuelve visible |
| 5400–7120 | Lectura                                       | estado estable                                                                                  | —                        | 1720            | —        | Tiempo para leer la cadena completa               |
| 7120      | Demostración                                  | 1 → 0                                                                                           | salida                   | 280             | exit     | Cerrar la cadena                                  |
| 7400      | Cierre, primer tiempo (área Ventas)           | 0 → 1                                                                                           | entrada                  | 280             | standard | Hecho                                             |
| 8000      | Cierre, segundo tiempo (área Inventario)      | oculto → visible                                                                                | entrada tipográfica      | 540             | standard | Consecuencia                                      |
| 8600      | Secuencia en texto y firma                    | 0 → 1, 16 px → 0                                                                                | entrada                  | 280             | standard | Registro legible; estado final de reduced motion  |
| 10000     | Fin                                           | reloj detenido                                                                                  | —                        | —               | —        | —                                                 |

Easing standard `[.22, 1, .36, 1]` y exit `[.55, 0, 1, .45]`, leídos de `src/brand/tokens/motion.ts`. Todos los valores se calculan desde el tiempo (`inventario01Frame`), sin timers por componente; sólo se animan `opacity` y `transform`. En 16:9 un registro de eventos E1–E5 se activa a 2.9, 3.4, 4.0, 4.7 y 5.4 s.

## Formatos

- **16:9 (1920×1080):** Ventas a la izquierda, Inventario a la derecha, divisoria vertical al centro. La línea recorre 400 px y cruza la divisoria. Registro de eventos al pie.
- **9:16 (1080×1920):** Ventas arriba, Inventario abajo, divisoria horizontal al centro. La línea baja 304 px y cruza la divisoria. Sin registro de eventos, para dejar libres las zonas que ocupan las interfaces de Stories y Reels. El texto clave queda en la franja central.

Ambos formatos comparten definición, copy y tiempos: cambia la composición, no el contenido. 1:1 y 4:5 no se pidieron y no están compuestos.

## Movimiento reducido

Se muestra el estado final (10 s): las dos frases de cierre y la secuencia completa en texto. Un resumen para lectores de pantalla narra toda la historia.
