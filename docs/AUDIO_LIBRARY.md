# Audio Library

El catálogo activo vive en `assets/audio/manifest.json` y el registro semántico ejecutable en `scripts/audio-core.mjs`. Buscar por tipo, categoría, tags, energía, carácter o mood; nunca por nombre de archivo únicamente. Cada ficha incluye procedencia, licencia y permiso comercial. Favoritos de Sound Lab son locales al navegador.

## Catálogo inicial

Los sonidos activos actuales son síntesis procedural original reproducible en memoria, no WAV externos. Incluye la familia Signal, Connection, Confirmation, Warning, Final Impact, Line Build, Data Glide, Transaction Tick, Soft Confirm y Resolve Harmonic, más una cama musical Minimal Pulse. Los candidatos externos no forman parte del inventario activo hasta importarse manualmente y registrar su archivo/hash/licencia concreta.

Mixkit permite ciertos usos comerciales bajo licencias específicas, pero sus términos prohíben bots/scripts de descarga masiva; Pixabay permite usos adaptados sujetos a su licencia, prohíbe distribución standalone y restringe extracción automatizada no autorizada. No se automatiza ni se descargó contenido de esos servicios. La fuente externa no equivale a aprobación de una pista concreta.

Validación: `node scripts/audio-library-validate.mjs`. Importación: adquirir manualmente desde página oficial, guardar evidencia/licencia y hash SHA-256, completar ficha, verificar commercialUse y ejecutar validación. No subir binarios cuya licencia no permita redistribución.
