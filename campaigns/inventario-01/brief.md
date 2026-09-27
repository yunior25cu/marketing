# Brief — NO SE QUEDA EN VENTAS.

- Objetivo: mostrar de manera visual que una operación de venta puede modificar las existencias del producto y que Balaxys mantiene relacionada la operación comercial con el inventario.
- Público: dueños, administradores y responsables operativos de pequeñas y medianas empresas.
- Mensaje: sin lista de funcionalidades; demostrar con movimiento y datos que lo que sucede en ventas tiene consecuencias en el resto de la operación.
- Duración: 10 segundos exactos.
- Formatos: 16:9 (1920×1080) y 9:16 (1080×1920).
- Tipo: reconocimiento de marca. Sin CTA.
- Canal: digital genérico, video corto; audio opcional (la pieza se entiende sin sonido).
- Tono: preciso, sobrio y operativo.
- Idioma: español.

## Capacidades y claims

Se contrastó el pedido con `brand/BALAXYS_PRODUCT_CAPABILITIES.md`. El registro no contiene **ninguna capacidad verificada**; «Venta → actualización de inventario» figura como claim pendiente. La pieza representa una secuencia conceptual con datos de demostración y la campaña queda en revisión hasta obtener evidencia de:

1. `UNVERIFIED PRODUCT CLAIM` — Al confirmar una venta en Balaxys, las existencias del artículo vendido disminuyen en la cantidad vendida.
2. `UNVERIFIED PRODUCT CLAIM` — Ese descuento ocurre en el paso de confirmación de la venta (Borrador → Confirmada), no en otro momento como facturación, despacho o entrega.
3. `UNVERIFIED PRODUCT CLAIM` — Balaxys registra la salida de inventario como un movimiento identificado que conserva la referencia a la venta de origen. Este claim no figura siquiera en la lista de pendientes del registro.

La pieza **no** afirma automatización, tiempo real, sincronización, cuenta por cobrar ni contabilidad.

## Restricciones

- No inventar capacidades; validar todos los claims contra el registro de capacidades.
- Mantener `IN_REVIEW` mientras falte evidencia.
- No modificar Brand OS, tokens ni reglas permanentes de marca.
- No aprobar automáticamente.

## Normalización del pedido

El CLI registró el pedido con dos valores incorrectos que el Orchestrator corrigió: tipo `conversion` (la palabra «venta» del objetivo activó esa regla; el pedido es de reconocimiento) y un claim de plantilla «Venta → inventario → cuenta por cobrar → registro», que agregaba afirmaciones fuera del alcance. Se reemplazó por los tres claims anteriores.

## Pedido original

> CREAR CAMPAÑA. Tema: control de inventario. Objetivo: mostrar de manera visual que una operación de venta puede modificar las existencias del producto y que Balaxys mantiene relacionada la operación comercial con el inventario. Público: dueños, administradores y responsables operativos de pequeñas y medianas empresas. Duración: 10 segundos. Formatos: 16:9 y 9:16. Tipo: reconocimiento de marca. Mensaje: «No quiero vender una lista de funcionalidades. Quiero demostrar mediante movimiento y datos que lo que sucede en ventas tiene consecuencias en el resto de la operación.» Restricciones: no inventar ninguna capacidad de Balaxys; validar todos los claims contra BALAXYS_PRODUCT_CAPABILITIES.md; si falta evidencia, mantener IN_REVIEW e indicar qué afirmación necesita validación; usar exclusivamente Balaxys Brand OS y el Campaign Orchestrator; no modificar Brand OS, tokens ni reglas permanentes; implementar la campaña completa en Campaign Console para revisión visual; no aprobarla automáticamente.
