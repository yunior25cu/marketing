# Balaxys Brand OS

Sistema visual programable para campañas, escenas y visualización comercial de Balaxys ERP. La idea central es **mostrar causa y efecto dentro de una empresa**.

## Iniciar

```sh
pnpm install
pnpm dev
```

Abrir `/` para la experiencia pública, `/lab` para tokens y primitives, y `/campaigns/launch-01` para la campaña de 10 segundos. En la campaña, `?ratio=9:16&t=4500` abre un formato y un instante concretos para revisión de fotogramas.

Para exportar la campaña a MP4, primero ejecutar `pnpm build` y luego `pnpm render:launch -- --ratio=16:9`. Las opciones `1:1`, `4:5` y `9:16` generan las otras dimensiones. `--poster=5000` guarda un PNG del fotograma a 5 segundos. El exportador usa Chrome instalado y FFmpeg estático; guarda archivos en `renders/`.

## Calidad

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm quality` ejecuta los cuatro controles. Node 22.12+ y pnpm 12.6.0.

## Mapa

- `brand/`: constitución, motion y copy.
- `src/brand/`: tokens y estilos.
- `src/primitives/`: componentes tipados.
- `src/scenes/`: escenas con eventos y tiempos absolutos.
- `src/compositions/`: dimensiones y reglas de formatos.
- `src/renderer/`: resolución de estados y reproducción.
- `src/campaigns/`: composición comercial de escenas.
- `agents/`: ocho system prompts independientes.
- `docs/NEW_CAMPAIGN.md`: procedimiento de extensión.

Las escenas usan datos de demostración. El wordmark es provisional. Ver [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) para decisiones y límites.
