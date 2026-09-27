# BALAXYS MOTION LANGUAGE — CONTINUOUS TRANSFORMATION

**Autoridad de motion del Brand OS.** Se consulta junto con la Creative Constitution, el Motion System y Visual Memory. Versión 2.0, septiembre de 2026.

> Toda campaña audiovisual de Balaxys debe ser diseñada y producida como una pieza profesional de motion graphics.

La pregunta principal de aceptación es: **¿esto se siente y se ve como una pieza profesional de motion graphics?** Si la respuesta es no, iterar aunque compile, esté animada y se vea limpia. Evitar un aspecto de PowerPoint es un anti-pattern secundario, no el objetivo creativo.

## Estándar obligatorio de Motion Graphics

Cada campaña es una composición audiovisual en evolución, no una colección de pantallas ni una interfaz simplemente animada. La dirección creativa define una gramática visual propia para la pieza y combina según el concepto:

- dirección de arte audiovisual y composición gráfica dinámica;
- transformación continua, morphing, shape animation, máscaras, reveals y transiciones diseñadas;
- kinetic typography y motion typography, con datos animados como materia gráfica;
- camera choreography, match cuts, scale y transiciones espaciales; profundidad 2.5D/3D y parallax sólo cuando aportan;
- ritmo y timing cinematográfico, con anticipación, acción, reacción, pausa y release;
- sonido diseñado y sincronizado con la composición y sus eventos visuales.

Los elementos pueden transformarse, dividirse, fusionarse, viajar, construir otros objetos, convertirse en tipografía/datos/geometría, revelar otra composición y conducir al siguiente momento audiovisual. No se limitan a aparecer, permanecer y desaparecer. Cada recurso debe expresar el concepto, respetar la identidad Balaxys y conservar legibilidad.

### Gate `MOTION_GRAPHICS_QUALITY`

Brand Guardian, Quality Auditor y AV Quality Auditor informan `MOTION_GRAPHICS_QUALITY=PASS|FAIL` y evidencia concreta para los nueve criterios:

1. Dirección de arte coherente.
2. Composición dinámica.
3. Transformación visual.
4. Continuidad temporal.
5. Ritmo.
6. Uso expresivo de tipografía, formas y datos.
7. Transiciones diseñadas.
8. Integración audiovisual.
9. Experiencia claramente concebida como motion graphics profesional.

PASS exige evidencia positiva en los nueve. Un criterio fallido, sin evidencia o no inspeccionado implica FAIL. El orquestador bloquea aprobación y devuelve la pieza a iteración. Calidad visual no se infiere de build, limpieza, duración o de que existan animaciones.

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

El Quality Auditor registra `MOTION_CONTINUITY` como una dimensión de soporte y `MOTION_GRAPHICS_QUALITY=PASS|FAIL` como el gate creativo principal. Visual QA observa el render en movimiento y documenta evidencia de los nueve criterios antes de emitir PASS. Cinco a ocho screenshots pueden revelar un problema secundario de composición por pantallas, pero no sustituyen la revisión del video completo.

PowerPoint Detection se conserva como un anti-pattern secundario. Un riesgo bajo no implica calidad profesional; un riesgo alto sí puede ayudar a detectar que la composición se dividió en pantallas, pero el veredicto principal siempre responde si la pieza se siente y se ve como motion graphics profesional. Si no, iterar.
