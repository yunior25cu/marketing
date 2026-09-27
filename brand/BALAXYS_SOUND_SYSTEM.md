# Balaxys Sound System — v1 experimental

## Filosofía

El sonido hace legible una relación temporal: origen, propagación, confirmación y cierre. Debe sentirse preciso, técnico, limpio, sofisticado y discreto. El silencio separa ideas. Evitar estética de videojuego, casino, tráiler, techno agresivo, crypto y música corporativa genérica.

## Capas

- **SFX:** señales breves para eventos dominantes: pulse, connection, confirmation, warning y final impact. No sonorizar cada microacción.
- **Ambience:** cama muy tenue que sostiene continuidad y deja respirar al copy.
- **Music:** opcional; sólo si mejora narrativa o ritmo. No usarla por defecto ni para llenar silencio.

## Diseño y sincronía

Cada cue usa el mismo `timeMs` que el storyboard. Ataque corto, cola controlada y fade de salida antes del corte. SFX deben evitar enmascarar voz o información. Voz sólo cuando agrega claridad; prioridad de mezcla: voz → evento principal → ambiente/música. No se asume voz en una campaña.

## Mezcla y entrega

Para pruebas digitales, apuntar a pico verdadero conservador por debajo de −1 dBFS y nivel percibido razonable, sin perseguir volumen máximo. Medir peak, RMS, duración y clipping en cada exportación; escuchar el MP4 final antes de publicar. Exportar AAC dentro de MP4 y WAV PCM master opcional. Stems sólo para capas utilizadas. Audio y video terminan en el mismo instante; no dejar colas fuera de duración. Estas referencias no reemplazan requisitos de una plataforma de distribución específica.

## Origen y licencias

`assets/audio/manifest.json` registra nombre, fuente, licencia, autor, restricciones y ubicación de cada archivo incorporado. La primera biblioteca es síntesis procedural original, sin samples externos. Música comercial protegida y descargas arbitrarias quedan fuera. Cualquier asset generado por IA debe registrar su origen y condiciones de uso conocidas antes de integrarse.
