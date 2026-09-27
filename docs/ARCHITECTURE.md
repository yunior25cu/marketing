# Arquitectura del Brand OS

React + TypeScript + Vite + CSS moderno. pnpm fija dependencias; Git conserva decisiones. El sitio tiene `/` para la experiencia pública, `/lab` para inspección y `/campaigns/launch-01` para la primera campaña. Las rutas de laboratorio y campaña se cargan de forma diferida.

`src/brand/tokens` guarda valores de identidad. `styles/globals.css` expone el mismo contrato a CSS; si se agrega un token, actualizar ambas ubicaciones. `src/primitives` contiene piezas semánticas tipadas. `src/scenes` define datos narrativos. `src/renderer` transforma definición y tiempo en estado visible. `src/campaigns` compone escenas y copy dentro de una duración comercial. `agents` contiene prompts autónomos; `brand` fija el criterio visual.

El motor es deliberadamente pequeño. `SceneDefinition` fija duración, viewport, ratio, documento, nodos y eventos. `sceneState(scene, t)` es puro y devuelve el estado de cualquier instante. `useTimeline` administra reproducción, pausa y búsqueda; se detiene al llegar al final. Una escena no lleva cuatro implementaciones: `SceneCanvas` cambia su composición con reglas CSS según el ratio. Los datos de demostración no representan capacidades confirmadas del producto.

La jerarquía de animación es CSS → Web Animations/Motion → SVG → Canvas → WebGL. La implementación actual usa CSS y `requestAnimationFrame` para el reloj; Motion queda disponible cuando una pieza necesite interpolación controlada. Canvas y WebGL no están justificados en las escenas actuales.

## Ejecución

```sh
pnpm install
pnpm dev
pnpm quality
```

Node 22.12+ satisface la exigencia actual de Vite. El proyecto fue construido en Node 22.22.0. En un entorno sin comando `pnpm` global, `corepack pnpm` o `npm exec --package=pnpm@12.6.0 -- pnpm` ejecutan la versión fijada.

## Riesgos conocidos

El wordmark es provisional. Claims y automatizaciones deben confirmarse con producto antes de publicar material comercial. La página muestra explícitamente «datos de demostración». Las escenas son prototipos visuales, no capturas del ERP.
