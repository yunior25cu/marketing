# Evidencia de producto y terminología fiscal

Revisión: 2026-09-27. Investigación delegada real para Campaign Director, Copywriter y Quality Auditor. Alcance: claims; no constituye aprobación audiovisual ni una prueba del servicio en producción.

## Resultado

El registro permanente de marca no contiene capacidades verificadas. Para esta campaña se encontraron fuentes públicas oficiales de Balaxys que respaldan emisión electrónica desde el flujo comercial y relaciones con clientes, cuentas corrientes, contabilidad e inventario. Esta evidencia queda acotada a la campaña; no se modifica `brand/`.

`VERIFIED` en este informe significa respaldado por documentación pública del proveedor, consultada en la fecha indicada. No significa que se ejecutó una venta real ni se certificó una instalación concreta. No se accedió a cuentas, certificados ni datos de clientes.

## Matriz de claims

| Claim limitado que puede utilizarse                                                | Estado                 | Evidencia primaria y alcance                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Balaxys permite emitir comprobantes electrónicos desde el flujo comercial.         | VERIFIED               | [Sitio oficial, sección Facturación](https://www.balaxys.com/): emisión de facturas y notas electrónicas desde la operativa comercial.                                                                                                               |
| El documento conserva una relación con el cliente y su cuenta corriente.           | VERIFIED               | [Gestión de ventas](https://www.balaxys.com/modulos/facturacion), secciones Documentos del ciclo de ventas y preguntas frecuentes: la documentación comercial está vinculada a ficha y cuenta del cliente.                                           |
| La contabilidad puede estar vinculada con la operación comercial.                  | VERIFIED               | [Gestión contable](https://www.balaxys.com/modulos/contabilidad), sección Automatización: asientos ligados a ventas, compras y otras operaciones. El [sitio principal](https://www.balaxys.com/) precisa configuración de la generación de asientos. |
| Ventas e inventario mantienen información conectada sobre productos y existencias. | VERIFIED               | [Gestión de ventas](https://www.balaxys.com/modulos/facturacion), sección Inventario conectado y FAQ. No hace falta representar una cifra de stock ni el instante exacto de su descuento.                                                            |
| La solución contempla firma digital, configuración y habilitación para emitir CFE. | VERIFIED               | [Facturación electrónica](https://www.balaxys.com/solucion), introducción y FAQ sobre certificado y habilitación.                                                                                                                                    |
| La respuesta de DGI dispara automáticamente asientos, cuentas e inventario.        | UNVERIFIED — EXCLUIR   | Ninguna fuente consultada establece ese disparador. La cámara puede revelar conexiones que ya existían; la respuesta sólo cambia la representación del intercambio fiscal.                                                                           |
| Toda respuesta DGI equivale a aprobación fiscal definitiva.                        | INCORRECTO — EXCLUIR   | La [Resolución DGI 798/012, numeral 21](https://www.impo.com.uy/bases/resoluciones-dgi-interes-general/798-2012) distingue recepción y rechazo; el acuse inicial no implica aceptación definitiva.                                                   |
| Todas las funciones están incluidas en cualquier plan.                             | NO SOSTENIDO — EXCLUIR | [Planes ERP + e-Factura](https://www.balaxys.com/planes/sistema-erp-mas-efactura) distingue alcance por plan; [solución](https://www.balaxys.com/solucion) condiciona stock al plan.                                                                 |

## Alcance fiscal de la representación

La [guía DGI sobre documentación electrónica](https://www.gub.uy/direccion-general-impositiva/comunicacion/publicaciones/se-documenta-regimen-facturacion-electronica) identifica la e-Factura como CFE utilizado en operaciones con contribuyentes identificados por RUC. El concepto puede ser una venta entre empresas; no mostrar una compra de consumidor final con etiqueta e-Factura.

La [Resolución DGI 798/012](https://www.impo.com.uy/bases/resoluciones-dgi-interes-general/798-2012), numerales 13, 20 y 21, respalda firma electrónica avanzada, envío y mensajes de recepción/rechazo. La secuencia comprimida representa estos intercambios de forma conceptual; sus diez segundos no prometen un plazo real del servicio. Una respuesta visual de retorno no acredita validez fiscal definitiva ni conformidad tributaria total.

La búsqueda también localizó el [Formato de mensajes de respuesta v19](https://www.efactura.dgi.gub.uy/files/formato_mensajes_respuesta_v19-pdf?es=), pero la descarga completa agotó el tiempo de acceso. No se lo usa como evidencia del detalle de estados. El wording se apoya en la resolución oficial efectivamente leída.

## Decisión de dirección y copy

Una sola operación construye su documento y viaja por el intercambio fiscal. El pullback revela relaciones operativas que estaban fuera de cuadro. No emitir pulsos causales desde DGI hacia inventario o contabilidad; evitar checks de aprobación fiscal.

Etiquetas recomendadas: `VENTA`, `CFE`, `e-Factura`, `FIRMA`, `DGI`, `RESPUESTA`. La última es una descripción narrativa, no un estado oficial del producto. El cambio de estado consiste en la recepción del pulso de retorno, sin sello ni promesa de aceptación.

Al abrir la composición pueden aparecer `VENTA`, `CONTABILIDAD`, `CUENTA DEL CLIENTE` e `INVENTARIO` como relaciones existentes. No usar `EMPRESA ACTUALIZADA` como resultado automático del acuse fiscal. No añadir números contables, saldos o descuentos de stock que impliquen ejecución real.

Copy recomendado para el cierre, surgido de la composición: **FACTURACIÓN ELECTRÓNICA. / PARTE DE TU OPERACIÓN. / BALAXYS**. Breve, afirmativo y consistente con las relaciones documentadas. El tiempo de lectura final debe validarse en los cuatro formatos; conviene anticipar el descriptor antes de 8,5 s.

Rotular la secuencia **Representación conceptual**. Cuando aparezca un importe o un identificador ficticio, incluir **Datos de demostración**. Para el alcance comercial: **Funciones según plan y configuración**. Evitar una cantidad decorativa si no es necesaria para construir el documento.

## Condición de entrega

Mantener `IN_REVIEW`. Estas fuentes respaldan los claims limitados; no otorgan aprobación humana de la pieza, `MOTION_GRAPHICS_QUALITY=PASS` ni validación sonora. La revisión final debe inspeccionar si el montaje respeta la diferencia entre intercambio fiscal y relaciones operativas.
