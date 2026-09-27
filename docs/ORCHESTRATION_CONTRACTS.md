# Contratos del Campaign Orchestrator

El archivo de ejecución es `agents/00-campaign-orchestrator.md`; el manifiesto legible por máquina es `agents/orchestration.config.json`. Los especialistas originales mantienen sus prompts. Los contratos tipados y el registro de campañas viven en `src/orchestrator/`.

## Objetos de intercambio

| Objeto                     | Contenido mínimo                                                                        | Responsable                 |
| -------------------------- | --------------------------------------------------------------------------------------- | --------------------------- |
| `CampaignBrief`            | objetivo, público, mensaje, duración, formatos, canal, CTA, capacidades y restricciones | Orchestrator                |
| `CampaignPlan`             | objetivo, storyboard y formatos                                                         | Campaign Director           |
| `CampaignConcept`          | idea dominante, mecanismo visual, narrativa, cierre y prueba de originalidad            | Creative Director           |
| `CampaignCopy`             | líneas de apertura/cierre y CTA                                                         | Copywriter                  |
| `MotionPlan`               | duración y cues absolutos con evento y efecto                                           | Motion Designer             |
| `CampaignImplementation`   | escena, ruta de preview y formatos                                                      | Frontend Engineer           |
| `BrandReview`              | PASS/FAIL/PENDING, evidencia y bloqueo                                                  | Brand Guardian              |
| `QualityReview`            | PASS/FAIL/PENDING, evidencia y bloqueo                                                  | Quality Auditor             |
| `PerformanceReview`        | PASS/FAIL/PENDING, severidad y bloqueo                                                  | Performance Auditor         |
| `VisualImplementationPlan` | medio elegido, justificación, fallback y presupuesto                                    | Visual Engineer             |
| `SoundPalette`             | carácter, energía, densidad, selección semántica y decisión de silencio/música          | Sound Director              |
| `AudioCompositionPlan`     | beats, timeline, capas, silencio, mezcla, fades, ducking y resolución                   | Sound Director              |
| `AudioImplementation`      | timeline, preview, draft/master, stems, lock y mediciones técnicas                      | Audio Engineer              |
| `VisualQAReview`           | checkpoints, ratios, hallazgos y veredicto                                              | Visual QA Director          |
| `AVReview`                 | sincronía, ritmo, clipping, duración y veredicto                                        | AV Quality Auditor          |
| `MOTION_GRAPHICS_QUALITY`  | PASS/FAIL y evidencia para los nueve criterios profesionales de motion graphics         | Quality + Visual QA + AV QA |

Cada entrega debe referirse a la versión y al ID de campaña. Un agente puede devolver `PENDING` si falta evidencia, pero no convertirlo en `PASS`. El Orchestrator reconcilia contradicciones; una escena que el copy llama «automática» mientras el registro de capacidades dice «sin verificar» debe volver a copy/producto antes de aprobación.

Sound Director entrega Sound Palette y Audio Composition Plan antes de mezclar. Audio Engineer no altera decisiones artísticas unilateralmente. Licencia pendiente o asset faltante bloquea. El gate perceptual AV debe citar escucha del master completo.

## Selección de roles

- **Crear:** estrategia → idea → copy → motion → implementación → tres auditorías.
- **Mejorar:** incluir idea/copy sólo si cambia el mensaje; siempre revisar el resultado.
- **Adaptar:** conservar concepto/copy; revisar composición, implementación y auditorías por formato.
- **Evolucionar marca:** concepto y Brand Guardian producen una propuesta; no se modifica la constitución ni los tokens.
- **Aprobar:** no genera creatividad; inspecciona estado, auditorías, claims y checks técnicos, y congela la versión sólo tras una orden humana explícita.

El manifiesto es una ruta recomendada, no evidencia de que agentes externos hayan corrido. Si el entorno no permite invocarlos, el Orchestrator aplica cada contrato como una fase documentada y lo declara así.

## Workspace y ciclo de vida

`campaigns/<id>/campaign.json` contiene el estado estructurado. Los seis documentos humanos son `brief.md`, `concept.md`, `storyboard.md`, `copy.md`, `review.md` y `changelog.md`. `orchestration.md` conserva las fases y sus responsables. `src/campaigns/` contiene el código de reproducción. La consola de `/lab` descubre las fichas automáticamente.

`scripts/campaign-workspace.mjs` normaliza peticiones, crea workspaces, registra mejoras/adaptaciones y aplica el gate de aprobación. Las nuevas campañas se inician en `DRAFT`. `IN_REVIEW` significa que hay implementación y revisiones para inspección; `NEEDS_CHANGES` registra una corrección; `APPROVED` requiere orden humana y gate completo; `ARCHIVED` retira la pieza del flujo activo. Antes de aprobar deben pasar Brand Guardian, Quality Auditor, checks técnicos, verificación de claims y ausencia de bloqueo grave de Performance.

La aprobación copia `concept.md`, `storyboard.md` y `copy.md` a `releases/vN/` y registra SHA-256, fecha y operador. Una revisión posterior incrementa versión y conserva el snapshot aprobado. La memoria visual sólo cambia después de aprobación humana explícita de un aprendizaje permanente.

`MOTION_GRAPHICS_QUALITY=PASS` es un gate obligatorio para toda campaña audiovisual. Los nueve criterios están en `brand/BALAXYS_CONTINUOUS_MOTION_LANGUAGE.md`; falta de evidencia equivale a FAIL e iteración. AV Quality Auditor participa en toda pieza audiovisual y evalúa el render completo, incluido el diseño intencional de audio o silencio. Visual QA revisa checkpoints y movimiento real. La selección de Visual Engineer y tecnologías depende del concepto; el estándar profesional no obliga a usar 3D o música. PowerPoint detection es sólo anti-pattern secundario. Ver `docs/AV_CAMPAIGN_GUIDE.md`.

## Validación del orquestador

`launch-01` fue reconstruida desde la implementación original y permanece `IN_REVIEW` porque sus capacidades representadas carecen de evidencia de producto. `orchestrator-smoke-test` se genera desde `tests/fixtures/orchestrator-smoke-request.txt` con el CLI, dura 6 segundos, usa 16:9 y se presenta como prototipo; no es campaña oficial.
