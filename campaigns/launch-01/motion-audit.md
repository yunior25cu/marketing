# Motion audit — launch-01 (sin modificar)

Auditoría estática del código actual `src/campaigns/launch-01/LaunchStage.tsx`, `definition.ts`, `campaign.css` y `campaigns/launch-01/campaign.json`. No se cambió ningún archivo de la campaña original.

| Criterio          | Hallazgo                                                                                                                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Slide risk        | **HIGH.** `campaignPhase()` separa premisa 0–1700, evento 1700–7700 y resolución 7700–10000; `LaunchStage` monta una rama distinta por fase. Tres capturas retienen premisa, demostración y cierre. |
| Fade dependency   | **MEDIUM.** KineticText usa transiciones de opacity/translate. La escena central aparece como un bloque independiente; la transición no conserva un objeto a ambos lados.                           |
| Object permanence | **LOW.** No hay objetos que persistan entre statement, SceneCanvas y cierre; el renderer de la venta existe sólo en el beat central.                                                                |
| Camera usage      | **LOW.** `LaunchStage` no define ruta de cámara.                                                                                                                                                    |
| Transformations   | **LOW.** El flujo de venta tiene movimiento de nodos/líneas, pero no transforma el objeto terminal hacia la escena siguiente.                                                                       |
| Typography        | **MEDIUM.** KineticText revela líneas y jerarquiza copy, pero no interactúa con datos/forma ni funciona como máscara.                                                                               |
| Continuity        | **NEEDS_REVISION.** La cadena interna del evento comunica causalidad; la master composition se divide en tres montajes discretos.                                                                   |

## Diagnóstico

El storyboard nombra tres períodos temporales, mientras `LaunchStage` los implementa como tres composiciones mutuamente excluyentes. Al cruzar 1700 y 7700 ms, el DOM reemplaza el contenido completo; no existe cámara común ni ancla compartida. El sistema anterior permitía el resultado tipo presentación porque el contrato no pedía beat overlap, Transformation Map, objetos persistentes, cámara ni transition checkpoints.

**Acción:** conservar `launch-01` tal cual. Ver propuesta no aplicada en `campaigns/launch-01-v2-proposal/`.
