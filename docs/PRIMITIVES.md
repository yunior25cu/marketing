# Contrato de primitives

| Primitive         | Entrada principal                      | Significado                 |
| ----------------- | -------------------------------------- | --------------------------- |
| `FlowLine`        | `progress: 0..1`                       | progreso de una relación    |
| `SignalPulse`     | `active`                               | evento que se activa        |
| `EntityNode`      | `index`, `title`, `active`, `children` | entidad en una cadena       |
| `MetricCounter`   | `label`, `before`, `after`, `active`   | cambio de cantidad o estado |
| `DocumentCard`    | `kind`, `id`, `rows`, `active`         | documento con identidad     |
| `EventMarker`     | `id`, `label`, `time`, `active`        | hecho en un tiempo          |
| `StatusIndicator` | `label`, `status`                      | estado semántico            |
| `DataTicker`      | `items`                                | resumen compacto de datos   |
| `KineticText`     | `lines`, `accent`                      | premisa tipográfica         |
| `ConnectionGraph` | `labels`, `activeIndex`                | cadena de relaciones        |
| `Counter`         | `current`, `total`                     | posición de secuencia       |

Todos usan los tokens CSS. No introducir colores propios en un componente. Mantener las etiquetas de accesibilidad y distinguir datos demostrativos de datos publicados. El laboratorio `/lab` muestra cada primitive con estados reales de ejemplo.
