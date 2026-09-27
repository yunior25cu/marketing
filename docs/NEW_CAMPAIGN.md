# Crear una campaña nueva

1. Formular una única idea dominante en una oración operativa. Verificarla con `brand/BALAXYS_CREATIVE_CONSTITUTION.md` y `brand/BALAXYS_COPY_SYSTEM.md`.
2. Elegir un evento real y escribir su cadena de consecuencias. Producto valida que Balaxys soporta cada paso. Rotular datos ficticios como demostrativos.
3. Reutilizar una `SceneDefinition` o crear otra en `src/scenes/`. Definir `duration`, `viewport.ratios`, documento, nodos y eventos con tiempos dentro de la duración.
4. Componer fases en `src/campaigns/<id>/definition.ts`. La suma debe ser la duración exacta del anuncio. En la UI, alimentar `SceneCanvas` con tiempo relativo a la fase.
5. Revisar 16:9, 1:1, 4:5 y 9:16 en `/lab` o en el control de ratio de la campaña. Reorganizar composición, sin duplicar contenido.
6. Revisar estado final con reduced motion, contraste, pausa/scrub y foco de teclado. Ejecutar `pnpm quality`.
7. Aplicar el Creative Check del auditor. Si se puede cambiar el logo por otro ERP sin pérdida de sentido, rehacer la idea.

## Ejemplo de tiempo

En `launch-01`, 0–1700 ms presenta la premisa, 1700–7700 ms muestra `SaleFlow` con tiempo relativo `t - 1700`, y 7700–10 000 ms cierra la idea. `campaignPhase(10000)` devuelve resolución y el reloj se detiene exactamente en 10 000 ms.

## Exportación

`pnpm build` seguido de `pnpm render:launch -- --ratio=16:9` captura fotogramas deterministas a 30 fps y codifica un MP4 de 10 segundos exactos. Los otros valores de `--ratio` son `1:1`, `4:5` y `9:16`; `--fps=60` cambia la frecuencia. `--poster=5000` genera un PNG en lugar de MP4. El exportador requiere Chrome instalado, usa Playwright Core y FFmpeg estático, y guarda las salidas en `renders/`. No hay audio ni claim de capacidades del ERP verificado; la pieza sigue rotulada como demostración.
