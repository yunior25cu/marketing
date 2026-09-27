# Balaxys Visual Engine

`src/visual-engine/` amplía el renderer actual sin sustituir escenas, primitives ni tokens. `selectVisualLevel()` decide el medio más simple: DOM para texto/estados, SVG para relaciones vectoriales, Canvas para muchos elementos móviles, Three.js para profundidad que explique relaciones y shader para un cálculo por píxel justificado. Un pedido de mayor ambición visual no equivale automáticamente a 3D.

## Implementaciones actuales

| Medio    | Ejemplo              | Cuándo usarlo                          | Evitar cuando                   |
| -------- | -------------------- | -------------------------------------- | ------------------------------- |
| DOM      | estado de venta      | texto y semántica accesible            | miles de objetos móviles        |
| SVG      | conexión entre áreas | trazos nítidos y pocos nodos           | gran volumen de partículas      |
| Canvas   | `SignalField`        | campo 2D determinista por `timeMs`     | se necesita texto seleccionable |
| Three.js | `SpatialNetwork`     | el eje Z muestra la propagación        | una línea 2D cuenta lo mismo    |
| Shader   | `dataField`          | grid procedural tenue ligado al tiempo | sólo aporta decoración          |

La escena experimental de 8 s usa geometría simple, cámara de movimiento lateral mínimo y una señal por nodos. La misma historia tiene fallback Canvas cuando falta WebGL 2 o se pide reduced motion. Three.js se carga en los bundles del laboratorio y de campañas avanzadas; `three` y `@types/three` fueron las únicas dependencias visuales añadidas. React Three Fiber y Drei no aportaban valor para esta escena imperativa pequeña. Three.js actual requiere WebGL 2 según su [documentación](https://threejs.org/docs/pages/WebGLRenderer.html).

## Presupuestos y QA

Medir, no suponer: FPS/frame time, draw calls, tamaño de bundle, texturas y memoria GPU. La primera escena usa cuatro cajas, tres líneas, una luz ambiente y un plano shader; limita `devicePixelRatio` a 1.5 y libera geometría, materiales y renderer al desmontar. El chunk Three.js mide aproximadamente 536 kB minificados / 134 kB gzip en el build actual; vigilar antes de añadir escenas o librerías.

`pnpm qa:visual` captura los checkpoints declarados de `visual-engine-smoke-test` en 16:9 y 9:16 y guarda imágenes y reporte en `.cache/visual-qa/`. Comprueba viewport, cajas de texto, progresión de nodos, geometría proyectada y errores del navegador. El Visual QA Director debe inspeccionar las imágenes, detectar contraste, espacios muertos y ritmo, pedir correcciones y repetir el ciclo. El script automatiza sólo lo medible; no certifica calidad artística.

## Troubleshooting

- Si el navegador no crea WebGL 2, se usa Canvas. Comprobar `data-engine` en la escena.
- Si una figura se corta en vertical, revisar escala/cámara y `data-visual-overflow`, no limitarse a reducir todo el DOM.
- Si reduced motion está activo, mostrar estado final legible mediante Canvas y texto persistente.
- Si aparecen errores de shader, revisar compilación WebGL y el fallback antes de aprobar.
