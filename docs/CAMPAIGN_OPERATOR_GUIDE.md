# Guía para operar campañas Balaxys

Hablá con **Balaxys Campaign Orchestrator** en el chat de este proyecto. Contale qué querés comunicar; el agente organiza diseño, texto, movimiento, implementación y revisión. No tenés que elegir especialistas ni explicar cómo se programa la pieza. Podés escribir una frase o usar estas plantillas.

## Crear una campaña

```text
CREAR CAMPAÑA
Tema: cobranza
Objetivo: mostrar cómo un cobro cambia el saldo del cliente
Público: pequeñas empresas
Duración: 10 segundos
Formato: 9:16
Mensaje importante: el cambio tiene un origen visible
```

Si omitís duración o formato, el agente empieza con 10 segundos y 16:9. También podés decir simplemente: «Quiero una campaña sobre cobranza». El agente hará una pregunta sólo si una respuesta cambia realmente la campaña.

Si querés más profundidad o sonido, describí la sensación y la función: «Quiero que se vea cómo una operación se propaga entre áreas, con movimiento espacial sutil y sonido discreto». El Orchestrator decidirá cómo producirlo. También podés pedir silencio. No necesitás elegir programas ni técnicas. En Campaign Console podés revisar el sonido y la imagen antes de aprobar.

El motion es continuo por defecto: una composición evoluciona en beats conectados. Si «se siente como slides», «parece un dashboard», «está demasiado estático» o querés «más continuidad visual», «una transición orgánica» o «más sensación de cámara», el Orchestrator traducirá el pedido en objetos persistentes, transformaciones causales y revisión de transiciones. No hace falta pedir una tecnología concreta.

## Pedir cambios

```text
MEJORAR CAMPAÑA
Campaña: launch-01
Cambios: el inicio se siente lento y quiero un cierre más claro
```

Describí el efecto que querés lograr. El agente decidirá qué partes revisar y guardará una nueva versión. Una versión aprobada no se cambia en silencio.

## Adaptar formatos

```text
ADAPTAR CAMPAÑA
Campaña: launch-01
Formatos: 9:16 y 1:1
```

La idea y el mensaje se conservan; el agente revisa que se lean bien en cada formato.

## Evolucionar la marca

```text
EVOLUCIONAR MARCA
Problema: las alertas necesitan una representación más clara
Objetivo: distinguir mejor una advertencia de un error
```

Esto genera una propuesta para revisar. No cambia las reglas de Balaxys hasta que la apruebes explícitamente.

## Revisar y aprobar

Abrí **Campaign Console** en `/lab#campaign-console`. Elegí una campaña para verla, pausarla, reiniciarla, cambiar formato y leer su brief, storyboard y revisión. Su estado aparece en palabras simples. Si estás conforme, decile al agente **«APROBAR [nombre de campaña]»**. Si quedan claims del producto sin verificar o falló una revisión, el agente explicará qué falta y no la aprobará.

Los ejemplos de venta, inventario y contabilidad usan datos de demostración. Antes de publicar una afirmación sobre funciones reales del ERP, entregá al agente la evidencia del producto o pedile que solicite esa validación.
