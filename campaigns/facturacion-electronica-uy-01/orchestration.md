# Orquestación — Facturación electrónica Uruguay

Campaña `facturacion-electronica-uy-01`, versión 1. El encargo autoriza al Orchestrator a invocar especialistas. El workspace se creó mediante `scripts/campaign-workspace.mjs`; la petición original se conserva en `request.txt`.

## Ejecución real y límites de este registro

El Orchestrator delegó tres tareas independientes: `evidence` (evidencia fiscal y de producto), `audio` (diseño e implementación sonora) y `direction` (dirección y documentos). El agente principal coordina integración visual y frontend. Estos son agentes de trabajo reales, no trece ejecuciones independientes: cada uno aplica los contratos indicados abajo como fases explícitas.

`direction` leyó el brief, constitución, copy, motion, continuous motion, memoria visual, registro de capacidades, configuración y contratos, y los prompts de Campaign Director, Creative Director, Copywriter, Motion Designer y Brand Guardian. Su entrega son `brief.md`, `concept.md`, `storyboard.md`, `copy.md` y este registro. La consulta de Brand Guardian durante dirección establece restricciones; no equivale a una auditoría del render.

La investigación `evidence` entregó `product-evidence.md`, leído e incorporado por `direction`: las fuentes públicas oficiales respaldan los claims limitados de emisión y relaciones operativas. La asignación de `audio` y del principal acredita responsabilidad, no terminación. Sus resultados y revisiones efectivamente realizadas deben registrarse en `review.md` y los entregables correspondientes.

## Selección de roles y contratos

| Rol evaluado        | Decisión / responsable                                      | Entrega o condición                                                                                      |
| ------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Campaign Director   | Seleccionado; fase de `direction`.                          | Brief, 10 segundos, cuatro formatos y storyboard.                                                        |
| Creative Director   | Seleccionado; fase de `direction`.                          | «El documento conserva su origen», mecanismo y alternativas descartadas.                                 |
| Copywriter          | Seleccionado; fase de `direction`.                          | Copy mínimo y claim central limitado a evidencia documental del proveedor.                               |
| Motion Designer     | Seleccionado; fase de `direction`, integrado por principal. | Beats, objetos persistentes, Transformation Map, cámara y checkpoints.                                   |
| Visual Engineer     | Seleccionado; fase del principal.                           | Evaluación SVG/Canvas/Three/WebGL; SVG y cámara determinista propuestos.                                 |
| Sound Designer      | Seleccionado; delegado `audio`.                             | Plan causal con once cues; música no requerida.                                                          |
| Audio Engineer      | Seleccionado; delegado `audio`, integración principal.      | Timeline sincronizado, exportación y mediciones; verificar entrega real.                                 |
| Frontend Engineer   | Seleccionado; principal.                                    | Stage, consola, cuatro recomposiciones y reduced motion.                                                 |
| Brand Guardian      | Obligatorio; auditoría pendiente al emitir este documento.  | Identidad, claims, nueve criterios y veredicto con evidencia de render.                                  |
| Visual QA Director  | Obligatorio; auditoría pendiente al emitir este documento.  | Checkpoints y revisión de movimiento en los cuatro ratios.                                               |
| Quality Auditor     | Obligatorio; auditoría pendiente al emitir este documento.  | Claims, técnica, accesibilidad y gate creativo. `evidence` aporta investigación, no sustituye auditoría. |
| AV Quality Auditor  | Obligatorio; auditoría pendiente al emitir este documento.  | Render completo, sincronía, escucha, ritmo y veredicto audiovisual.                                      |
| Performance Auditor | Obligatorio; auditoría pendiente al emitir este documento.  | Mediciones, límites de equipo, recursos y bloqueos.                                                      |

## Handoffs y decisiones

1. `direction` entrega el viaje VENTA → DOCUMENTO. Tras incorporar `product-evidence.md`, el pullout revela CONTABILIDAD y CUENTA DEL CLIENTE como conexiones preexistentes. Inventario se omite por densidad narrativa. La respuesta DGI no genera esas conexiones.
2. `evidence` separa documentación DGI de evidencia de producto. Ninguna fuente fiscal transforma por sí sola el claim Balaxys en VERIFIED.
3. Motion y audio comparten cues absolutos: 350, 1 550, 2 150, 2 900, 3 750, 4 450, 5 350, 6 050, 6 700, 7 600 y 8 650 ms. La implementación y estos hitos quedaron reconciliados antes del render.
4. El principal integra el SVG, la trayectoria por formato y el sonido existente sin cambiar `brand/` ni tokens permanentes.
5. Las auditorías observan los renders y documentan resultados reales. `MOTION_GRAPHICS_QUALITY` exige evidencia positiva para las nueve dimensiones; ninguna tabla de planificación ni check técnico concede PASS.

Objetivo de entrega: `IN_REVIEW`. Claims limitados respaldados por evidencia documental del proveedor en `product-evidence.md`; no se ha ejecutado una venta real. No hay autorización humana de publicación. La memoria visual permanece sin modificaciones.
