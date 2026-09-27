# Sistema de motion de Balaxys

## Estándar principal

Toda campaña audiovisual es una pieza profesional de motion graphics con dirección de arte, composición en movimiento y evolución durante toda su duración. Combina transformaciones, kinetic typography, shape animation/morphing, máscaras/reveals, transiciones diseñadas, coreografía de cámara, espacio 2.5D/3D y parallax cuando aporten, match cuts, visualización de datos como lenguaje gráfico, ritmo cinematográfico y sound design sincronizado. Los objetos pueden construir el siguiente momento. «Evitar PowerPoint» es sólo una revisión anti-pattern secundaria.

La aprobación exige `MOTION_GRAPHICS_QUALITY=PASS` con evidencia en los nueve criterios de `BALAXYS_CONTINUOUS_MOTION_LANGUAGE.md`; cualquier duda, falta de inspección o criterio fallido implica FAIL e iteración.

Autoridad complementaria: [`BALAXYS_CONTINUOUS_MOTION_LANGUAGE.md`](BALAXYS_CONTINUOUS_MOTION_LANGUAGE.md). Una campaña es una master composition continua; beats son estados narrativos, `scenes/` sigue nombrando unidades técnicas reutilizables.

La unidad narrativa es `evento → propagación → estado → registro → resolución`. Ningún cambio visual puede anticipar su causa. Los tiempos son absolutos en milisegundos; keyframes y acciones pueden solaparse siempre que el resultado para un `timeMs` sea determinista.

| Escala    | Valor inicial | Uso                            |
| --------- | ------------: | ------------------------------ |
| Micro     |        150 ms | cambio de estado y feedback    |
| Standard  |        280 ms | transformación breve y legible |
| Narrative |        540 ms | número, línea, documento       |
| Focus     |        900 ms | reencuadre o atención motivada |

Tokens: `src/brand/tokens/motion.ts`. Easing estándar `[.22, 1, .36, 1]`, salida `[.55, 0, 1, .45]`; stagger de 110 ms sólo cuando cada elemento expresa una consecuencia distinta.

## Gramática de transformación

- **Transformación:** conservar el objeto y su ancla; morph, split o cambio de función explican el siguiente dato.
- **Entrada/salida:** opacity y translate son secundarios. No encadenarlos como estructura narrativa.
- **Propagación:** una línea nace en el origen; el destino responde después de su llegada.
- **Contador/dato:** conservar valor anterior, dirección y nuevo estado. El significado contable no se deforma.
- **Línea:** mantener origen, trayectoria y peso cuando pasa a otra función.
- **Documento:** hereda sus datos de la acción precedente y conserva la relación visible.
- **Éxito/error:** estado legible y estable; sin flashes ni confetti.
- **Entre beats:** MORPH, CARRY, REVEAL, CONTINUATION, MATCH, SPLIT, MERGE, CAMERA DISCOVERY, MASK TRANSITION o TYPOGRAPHIC TRANSFORMATION. Un objeto actual motiva el estado siguiente.

## CAMERA LANGUAGE

Usar pan/tracking para seguir una causa, push-in para detalle que requiere lectura, pull-out para revelar relaciones, reframe para equilibrar jerarquía, parallax/depth sólo para distinguir planos y foco para guiar atención. Reposar cámara durante cifras y holds. Velocidad y aceleración siguen al objeto causal; cada trayecto termina estable. `VirtualCamera` interpola posición, escala, rotación, foco y profundidad de forma determinista; DOM/SVG usa transform, Canvas/Three adaptan su cámara.

## RHYTHMIC STRUCTURE

Planificar anticipation → action → reaction → hold → acceleration → release. Alternar movimiento con pausas de lectura. Los beats pueden solaparse; no asignarles automáticamente pantallas. Los datos pueden crecer, dividirse, desplazarse o volverse geometría sin cambiar su valor real.

## Timeline y campañas

El timeline usa duración, beats solapables, keyframes de cámara, objetos persistentes, morph progress y cues absolutos. Cada estado deriva de `timeMs`, sin timers por componente, para que el scrub reproduzca siempre el mismo fotograma. Reservar holds de lectura en piezas de 6, 10, 15 o 30 segundos. `launch-01` conserva 10 000 ms y su montaje actual hasta que una propuesta nueva sea aprobada; esta evolución no la rediseña.

## Accesibilidad y rendimiento

Con `prefers-reduced-motion`, presentar un estado final que conserve todos los cambios como texto y desactivar playback. Los controles permiten pausar y scrub con pasos de 1–10 ms según el uso. No crear flashes. Favorecer transform y opacity, evitar layout thrashing y medir en dispositivos reales antes de Canvas o WebGL.
