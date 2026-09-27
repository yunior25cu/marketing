# Concepto — NO SE QUEDA EN VENTAS.

**Idea dominante (una oración):** lo que pasa en Ventas cruza la línea que lo separa de Inventario; una venta confirmada llega al stock y deja un movimiento que conserva su origen.

**Hecho de origen:** venta #18492, artículo A-104, cantidad 3, pasa de Borrador a Confirmada.

**Cadena causa → efecto:** venta confirmada → salida de 3 unidades → existencias de A-104 de 18 a 15 → movimiento M-0417 registrado → origen visible: venta #18492.

**Mecanismo visual:** la retícula de Balaxys divide el cuadro en dos áreas, `01 / VENTAS` y `02 / INVENTARIO`. La divisoria es la frontera entre áreas de la empresa. El dato `−3 · A-104` nace en el documento de venta y cruza esa línea; sólo cuando llega, el stock cambia. En 16:9 las áreas son izquierda y derecha; en 9:16, arriba y abajo. La misma frontera organiza la premisa y el cierre: la primera mitad de cada frase está en Ventas y la segunda en Inventario.

**Narrativa:** premisa escrita a ambos lados de la divisoria → demostración causal en cinco eventos → resolución que repite la frontera y deja la secuencia completa en texto.

**Cierre:** «UNA VENTA SE CIERRA. / EL STOCK SE MUEVE.» más la secuencia `#18492 CONFIRMADA → A-104 −3 → 18 → 15 → M-0417 ORIGEN #18492` y la firma.

## Rutas evaluadas

| Ruta                     | Idea                                                                             | Decisión                                                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. La frontera**       | La retícula separa Ventas de Inventario; la venta la cruza como dato.            | **Seleccionada.** Traduce literalmente el mensaje del operador a un mecanismo visual, muestra origen antes que consecuencia y no necesita listar módulos. |
| B. Contador protagonista | Un número gigante de existencias baja con cada venta.                            | Descartada. No muestra el origen del cambio, sugiere tiempo real (claim adicional sin evidencia) y cualquier ERP o punto de venta podría firmarla.        |
| C. Pantallas espejo      | La misma venta vista en dos pantallas del ERP, Ventas e Inventario, lado a lado. | Descartada. Parece captura del producto sin evidencia de su interfaz, reintroduce la lógica de «módulos» y convierte la pieza en un dashboard.            |

## Prueba de originalidad

¿Podría sustituirse BALAXYS por cualquier ERP y la pieza seguiría funcionando? **Riesgo presente, resultado: pasa con reserva.** El hecho «una venta descuenta stock» es común en la categoría. La pieza no se sostiene sobre ese hecho sino sobre la gramática Balaxys: retícula como frontera, documento con identidad, dato que viaja y llega antes de cambiar el destino, Signal Lime reservado para el cambio y un registro que conserva su origen. La diferencia más propia, **el origen conservado**, depende del claim 3, que está sin verificar. Si producto no lo confirma, la pieza pierde parte de su singularidad y debe revisarse.

## Claims a validar

Ver `brief.md`: descuento de existencias al confirmar la venta, momento exacto del descuento y referencia de origen en el movimiento. Todos `UNVERIFIED`.

## Candidate insight (no es regla)

La divisoria de la retícula puede funcionar como frontera entre áreas de la empresa y organizar premisa, demostración y cierre con una sola gramática. Registrar como patrón aprobado sólo con aprobación humana explícita.
