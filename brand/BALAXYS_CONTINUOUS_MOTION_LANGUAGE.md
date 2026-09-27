# BALAXYS MOTION LANGUAGE — CONTINUOUS TRANSFORMATION

**Autoridad de motion del Brand OS.** Se consulta junto con la Creative Constitution, el Motion System y Visual Memory. Versión 1.0, septiembre de 2026.

> Una campaña Balaxys no es una sucesión de diapositivas. Es una composición continua que evoluciona.

Una campaña completa es una **MASTER COMPOSITION**. Sus **BEATS** son estados narrativos de esa composición. Una **SCENE** sigue siendo una unidad técnica reutilizable y no implica una pantalla independiente.

## Principios obligatorios

1. **Transformation over replacement.** Un objeto existente cambia de forma o significado y causa el siguiente estado. Reemplazarlo por otro sólo se justifica cuando la historia requiere una entidad nueva.
2. **Camera over pagination.** Pan, tracking, push, pull, reframe, parallax, reveal y cambios de foco conducen la atención dentro del mismo espacio. La cámara puede ser DOM, SVG, Canvas o Three.js.
3. **Choreography over entrance animation.** La causalidad, interacción y coordinación llevan la narración. Opacity, translate y stagger son recursos secundarios, no la estructura principal.
4. **Typography as material.** Escala, crop, máscara, tracking, reflow y transformación de números deben aportar significado sin perder lectura ni accesibilidad.
5. **Object permanence.** Venta, stock, señal y registro permanecen mientras cambian de posición, tamaño, función o profundidad. Lo que queda fuera de cuadro debe poder reencontrarse.
6. **One visual journey.** Beats solapados y acciones simultáneas forman una sola experiencia. El timeline no divide automáticamente la pieza en pantallas.

## Transición semántica

Antes de elegir un efecto, el Motion Designer identifica qué objeto enlaza los dos estados.

| Tipo                         | Acción narrativa                                                         |
| ---------------------------- | ------------------------------------------------------------------------ |
| `MORPH`                      | Una forma se vuelve otra.                                                |
| `CARRY`                      | Un elemento transporta mirada o dato a otro lugar.                       |
| `REVEAL`                     | Un movimiento descubre información que ya habitaba la composición.       |
| `CONTINUATION`               | Una línea, forma o dato conserva su trayectoria y adquiere otra función. |
| `MATCH`                      | Posición, forma, escala, color o dirección enlazan dos estados.          |
| `SPLIT` / `MERGE`            | Un elemento genera varios o varios forman uno con causa visible.         |
| `CAMERA_DISCOVERY`           | La cámara descubre otra zona del mismo campo.                            |
| `MASK_TRANSITION`            | Un objeto existente abre una máscara para el contenido siguiente.        |
| `TYPOGRAPHIC_TRANSFORMATION` | Letras o números se vuelven estructura, dato o forma.                    |

Un match cut programático conserva una propiedad concreta. Círculo → moneda → nodo comparte silueta y centro; línea vertical → separador → borde de documento → barra comparte posición, peso y dirección. No es aleatorio ni exige reemplazar la composición.

## Cámara

Moverla cuando revela causa, consecuencia o contexto espacial. Mantenerla quieta cuando el cambio necesita lectura, precisión numérica o reposo. Favorecer aceleración y desaceleración suaves, trayectos motivados, profundidad discreta y parallax sólo si aclara planos. No mover para exhibir tecnología. En formatos verticales, reencuadrar el mismo viaje sin alterar la causalidad.

`VirtualCamera` expresa posición, escala, rotación, foco, profundidad y keyframes. DOM/SVG consumen una transformación CSS; Canvas y Three pueden adaptar el mismo estado a su cámara nativa. El fallback mantiene el orden de los beats.

## Ritmo y espacio

Choreografiar anticipación → acción → reacción → hold → aceleración → release. No animar todo a la vez ni sostener velocidad constante. Dejar zonas simultáneas fuera de cuadro cuando la continuidad las haga reencontrables. Un crop es intencional sólo cuando la información esencial sigue completa y Visual QA identifica el recorte como elección compositiva.

## Datos y transformación

Los datos son materia: pueden crecer, dividirse, viajar, alimentar una entidad, cambiar longitud o volverse geometría. La cifra y su significado contable nunca divergen. Todo storyboard avanzado declara beats, objetos persistentes, mapa de transformaciones, ruta de cámara, transiciones, ritmo y cues alineados al tiempo común.

## Revisión

El Quality Auditor registra `MOTION_CONTINUITY`: `PASS`, `NEEDS_REVISION` o `FAIL`, con evidencia cualitativa de permanencia, transformación, cámara, relación entre beats y uso de fades. Visual QA ejecuta POWERPOINT DETECTION y revisa transiciones antes/durante/después. Cinco a ocho screenshots no deberían conservar casi toda la narrativa si el motion aporta significado.

La aceptación exige una sola composición legible, transformaciones causales, continuidad espacial percibida durante al menos el 70% de la pieza, movimiento de cámara motivado y ausencia de una secuencia de entradas/salidas como estructura principal. Build PASS no sustituye la observación visual.
