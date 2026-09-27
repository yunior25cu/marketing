# Sistema de motion de Balaxys

La unidad narrativa es `evento → propagación → estado → registro → resolución`. Ningún cambio visual puede anticipar su causa. Los tiempos son absolutos en milisegundos dentro de `SceneDefinition`; se pueden derivar offsets relativos desde un evento al construir nuevas secuencias.

| Escala    | Valor inicial | Uso                                   |
| --------- | ------------: | ------------------------------------- |
| Micro     |        150 ms | cambio de estado, feedback de control |
| Standard  |        280 ms | aparición o salida de dato            |
| Narrative |        540 ms | número, línea, documento              |
| Scene     |        900 ms | cambio de foco entre escenas          |

Tokens: `src/brand/tokens/motion.ts`. Easing estándar `[.22, 1, .36, 1]`, salida `[.55, 0, 1, .45]`; stagger de 110 ms sólo cuando cada elemento expresa un paso distinto. Estos valores son el punto de partida: inspeccionar legibilidad en pantalla real y ajustar el evento, no reemplazar la gramática.

## Gramática

- **Entrada:** opacidad 0→1 y desplazamiento vertical pequeño. Se completa antes de pedir lectura.
- **Salida:** opacidad 1→0 sin rebote ni dispersión.
- **Propagación:** línea desde origen hasta destino; el destino se activa después de la llegada.
- **Pulso:** una expansión breve de Signal Lime confirma el evento. No repetir indefinidamente.
- **Contador:** conservar valor anterior, mostrar dirección y fijar el nuevo valor; evitar números que giran sin relación con un dato.
- **Número:** reservar ancho o usar cifras tabulares para impedir saltos de layout.
- **Línea:** revelar mediante escala horizontal o trazo SVG desde el origen, nunca en dirección ambigua.
- **Documento:** aparece al confirmar el evento; cambia de estado después de recibir los datos.
- **Nodo:** pasa de pendiente a activo cuando el evento correspondiente alcanza su `at`.
- **Éxito:** estado final estable, sin confetti.
- **Warning:** ámbar sobrio y texto del motivo; nunca flashes.
- **Error:** rojo sobrio, texto explícito y vía de recuperación.
- **Transición entre escenas:** cerrar cadena actual, dar un breve intervalo y abrir el siguiente origen.

## Timeline y campañas

El motor usa `duration`, eventos con `at` absoluto y un tiempo de reproducción controlable. `sceneState` resuelve estados de forma determinista para cualquier fotograma; no depende de timers por componente. Para 6, 10, 15 o 30 segundos, reservar tiempo de lectura antes de añadir detalle. La campaña `launch-01` dura **10 000 ms exactos**: premisa 0–1700, demostración 1700–7700, resolución 7700–10 000. El reloj se detiene en 10 000 ms.

## Accesibilidad y rendimiento

Con `prefers-reduced-motion`, fijar el estado final, conservar todos los cambios como texto y desactivar playback. Los controles permiten pausar y scrub. No crear flashes. Favorecer `transform` y `opacity`, evitar animaciones de layout y efectos constantes. Medir en dispositivos reales antes de introducir Canvas o WebGL.
