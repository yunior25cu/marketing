# Constitución creativa de Balaxys

**Autoridad visual del Brand OS.** En caso de conflicto con una campaña, componente o prompt, prevalece este documento. Versión 0.1, septiembre de 2026.

## Filosofía y propósito

**Balaxys no ilustra empresas. Visualiza cómo funcionan.** Cada pieza revela un evento y al menos una consecuencia verificable. Una venta puede afectar inventario, una cuenta por cobrar y registros; la representación muestra la cadena, no un catálogo de módulos.

La identidad comunica precisión, seguridad y sofisticación técnica. Debe sentirse como software industrial digital muy bien diseñado: interfaces legibles, estructura operativa, decisiones visuales justificadas.

## Principios de composición

1. **Una idea dominante.** El espectador debe poder nombrarla en una frase.
2. **Origen antes de consecuencia.** No mostrar un estado como si apareciera sin causa.
3. **Datos con significado.** Cada número, etiqueta y línea corresponde a una entidad o transición.
4. **Jerarquía por función.** Lo que cambia ocupa el centro visual; lo accesorio se retira.
5. **Pocas superficies.** Preferir rieles, divisiones y espacios a acumulaciones de tarjetas.
6. **Una sola gramática.** Tokens, tipografía y ritmos compartidos en todos los formatos.

## Lenguaje visual

La retícula sugiere estructura, no espectáculo. Líneas muestran relaciones. Nodos muestran estados. Un pulso marca un evento activo. Documentos son objetos con origen, identidad y estado. Tipografía cinética transforma la premisa en secuencia. Todo movimiento responde a una causa.

El nombre interno es **BALAXYS / BUSINESS IN MOTION**. «Data choreography» designa la sucesión legible `evento → propagación → cambio → registro → resolución`.

## Color

Los colores oficiales viven en `src/brand/tokens/colors.ts` y en variables CSS sincronizadas en `src/brand/styles/globals.css`. Obsidian `#0B0D0E`, Graphite `#16191C`, Surface `#1D2125`, Bone `#F3F0E8`, Mist `#C9CED2`, Signal Lime `#C7FF3D`, Signal Soft `#E3FFA0`. Warning y Danger sólo expresan estados reales. Signal Lime marca actividad, conexión o cambio; nunca cubre grandes superficies oscuras como relleno decorativo. Sobre Bone se usa Signal Dark para texto legible.

## Tipografía

Geist Sans Variable para titulares, UI y textos. Geist Mono Variable para IDs, datos, tiempos y etiquetas técnicas. Cargar únicamente los archivos necesarios y mantener `font-display: swap`. Fallbacks: Inter/system UI y IBM Plex Mono/monospace. Titulares compactos, gran escala y tracking ajustado; textos funcionales con amplitud suficiente. No usar tipografías futuristas decorativas.

## Fotografía e ilustración

La marca funciona sin imágenes de stock. Si una historia requiere fotografía, mostrar contexto operativo real, procesos, objetos o infraestructura con permiso y procedencia. Evitar sonrisas actuadas, escritorios genéricos y ejecutivos mirando pantallas. La ilustración sólo se admite si explica un mecanismo que las entidades de datos no pueden mostrar; no usar personajes 3D, blobs o iconos decorativos.

## Motion

La animación muestra causalidad. Un evento precede a la línea, la línea precede al cambio y el cambio precede al registro. Usar duraciones y curvas de `src/brand/tokens/motion.ts`; una escena puede precisar ritmos propios cuando la lectura lo exige. Preferir `transform` y `opacity`. No usar parpadeos ni bucles sin función. En reduced motion, presentar el estado final con el texto que conserva la secuencia.

## Datos y claims

No inventar métricas, clientes, rendimientos ni capacidades. Los identificadores y cantidades de los prototipos se rotulan **datos de demostración**. Antes de publicar una campaña, el equipo de producto debe validar cada automatización y cada claim. Si una secuencia es conceptual, debe decirlo claramente.

## Logo y firma

El wordmark tipográfico `BALAXYS` y la marca de actividad provisional `✳` identifican el laboratorio y prototipo. No estirar, inclinar ni aplicar gradientes. Mantener contraste y espacio libre de al menos la altura de una letra B. Reemplazar este tratamiento por el activo oficial si se aprueba uno; ninguna pieza debe depender del símbolo para ser reconocible.

## Antipatrones

Azul corporativo SaaS, degradado azul-violeta, bancos visuales, crypto, videojuegos, glassmorphism gratuito, dashboards flotantes sin narrativa, partículas, confetti, iconos decorativos, esferas arbitrarias, exceso de tarjetas, gráficos falsos, listados de módulos y slogans vacíos. «Todo en un solo lugar», «potencia tu negocio», «transforma tu negocio» y equivalentes se rechazan.

## Ejemplos

**Correcto:** «UNA VENTA NUNCA ES SÓLO UNA VENTA.» → Venta #18492 se confirma → Inventario 18→17 → aparece una cuenta por cobrar → un registro conserva el origen. Datos rotulados como demostrativos hasta su validación.

**Incorrecto:** «TRANSFORMA TU NEGOCIO CON EL ERP TODO EN UNO» sobre un dashboard flotante y un gráfico sin fuente. No explica qué pasó ni por qué.

## Criterio de aceptación

Una pieza pasa si: tiene una idea dominante; muestra causa y efecto; todos los datos significan algo y sus claims están verificados; la animación añade comprensión; usa tokens; se reconoce como Balaxys sin logo; funciona en 16:9, 1:1, 4:5 y 9:16 cuando aplica; conserva la narrativa con reduced motion; cumple contraste y rendimiento. **Si se puede sustituir BALAXYS por cualquier ERP sin que la pieza pierda su sentido, falla.**
