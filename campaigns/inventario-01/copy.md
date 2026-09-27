# Copy — NO SE QUEDA EN VENTAS.

Estructura `HECHO → CONSECUENCIA → LECTURA`. Una afirmación por pantalla. Cada frase se parte en dos tiempos: el primero ocupa el área Ventas y el segundo, el área Inventario.

## Premisa · 0.0–2.4 s

LO QUE PASA

EN VENTAS

_(1.0 s, en el área Inventario, acento Signal Lime en la primera línea)_

NO SE QUEDA

EN VENTAS.

## Demostración · 2.4–7.4 s (rótulos de datos)

- Áreas: `01 / VENTAS` · `02 / INVENTARIO`
- Documento: `VENTA #18492` · Artículo `A-104` · Cantidad `3` · Estado `BORRADOR` → `CONFIRMADA`
- Dato en tránsito: `−3 · A-104`
- Leyenda de la línea: `SALIDA · 3 UNIDADES` → `ORIGEN · VENTA #18492`
- Existencias: `EXISTENCIAS · A-104` `18 → 15` · nota `Saldo actual` → `Salida de 3 unidades`
- Libro: `MOV. · TIPO · CANT. · ORIGEN · SALDO` · `— · SALDO ANTERIOR · 18` · `M-0417 · SALIDA · −3 · VENTA #18492 · 15`
- Estado: `Venta en borrador` → `Evento en proceso` → `Relación visible`
- Eventos (16:9): `Venta confirmada` · `Salida −3` · `Existencias 15` · `Movimiento M-0417` · `Origen #18492`

## Resolución · 7.4–10.0 s

UNA VENTA

SE CIERRA.

_(8.0 s, en el área Inventario, acento en la segunda línea)_

EL STOCK

SE MUEVE.

Secuencia: `01 / VENTA #18492 · CONFIRMADA` · `02 / SALIDA A-104 · −3` · `03 / EXISTENCIAS 18 → 15` · `04 / MOVIMIENTO M-0417 · ORIGEN #18492`

Firma: `BALAXYS ✳`

Pie permanente: `SECUENCIA CONCEPTUAL · DATOS DE DEMOSTRACIÓN`

CTA: ninguno (reconocimiento de marca).

## Lectura estimada por pantalla

- Premisa: 9 palabras en 2.4 s. La primera mitad está visible 2.1 s; la segunda aparece a 1.0 s y queda 1.1 s en pantalla antes de la salida (0.6 s en reposo, después de su entrada de 540 ms).
- Demostración: 5 eventos en 3 s y 1.7 s de lectura con la cadena completa.
- Resolución: 8 palabras más la secuencia; la secuencia completa queda 1.1 s en reposo hasta el final.

## Alternativas no recomendadas

1. Cierre «LA VENTA TERMINA. / LA OPERACIÓN SIGUE.» — más abstracto; habla de «operación» sin mostrar qué cambió.
2. Premisa «TRES VENDIDAS. / TRES MENOS.» — muy concreta, pero anticipa la demostración y pierde la idea de frontera entre áreas.

## Palabras evitadas

«automáticamente», «en tiempo real», «sincroniza», «integrado», «todo», «siempre», «control total». Ninguna está verificada y todas ampliarían el claim.

## Claims que el copy expresa

- «EL STOCK SE MUEVE» y la demostración afirman que una venta modifica existencias → claims 1 y 2 de `brief.md` (`UNVERIFIED`).
- «ORIGEN · VENTA #18492» y la fila del libro afirman que el movimiento conserva su origen → claim 3 (`UNVERIFIED`).

Texto sujeto a validación de producto. No publicar hasta resolver los tres claims.
