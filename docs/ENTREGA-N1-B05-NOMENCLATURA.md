# Química · Nivel 1 · Bloque 5 «Nomenclatura inorgánica» (estructura «libro»)

Fecha: 2026-11-19. Modo: escribir y ejecutar. Atestación: NO. Autorización: META del propietario.

## A. Resumen

20 subtemas con la tríada: 20 lecciones «libro», 60 prácticas, capítulo, 6 integradores, 6 figuras, 40 ejemplos con segundo método y una escena nueva: **«Fórmula de un compuesto iónico»** (cargas cruzadas y simplificadas, carga total, masa fórmula y porcentaje del catión).

## B. Cambios

Nuevos: `aprender/n1/nomenclatura/*`; `practicas-n1/b05-{comun,s01-s07,s08-s14,s15-s20,integradores}.ts`; `escenas-n1/modelos/formula-ionica.ts`; `tests/quimica/nivel1-b05-nomenclatura.test.ts` y `nivel1-b05-segundos.ts`. Modificados (líneas añadidas): registros de lecciones, escenas y prácticas, `correspondencias.ts` (bloque 5 por subtema), `nivel1-libro.test.ts`, `bloque-libro.mjs` (línea `CONF` y comprobación de la escena).

## C. Cobertura (generada)

Bloque 5: 20/20 lecciones y prácticas (60) + 6 integradores, **6/20 con simulación** (la escena «formula-ionica» en 2, 6, 13, 14, 18 y 19), 0 por revisar, 20 Parcial. El resto de lecciones enlaza la herramienta «Formulación» de la Mesa, que no es una simulación; la s16 (sales básicas) no tiene recurso porque ni la Mesa ni el tema las cubren (decisión 45).

## D. Pruebas (ejecutadas)

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | 0 errores |
| `npm test` | `Test Files  79 passed (79)` · `Tests  3754 passed (3754)` |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built` |
| `node scripts/informe-nivel1.mjs --comprobar` | `la cobertura coincide con los recursos reales` |
| `bloque-libro.mjs --bloque 5` con y sin WebGL | `TODO OK` (150 y 150) |

Incidencias corregidas: 38 retroalimentaciones, 1 línea de resumen y 2 errores frecuentes cortos; 9 pistas cortas; tres títulos de lección distintos del temario (s11, s18, s19); dificultades de las prácticas fuera del orden básica–intermedia–avanzada; dos integradores pasados a básicos (mínimo 2); dos prácticas con menos de 12 variantes (decisión 47); 6 preguntas que dependían del compuesto escritas como texto fijo (error de tipos); el núcleo no da números de oxidación para algunas sales (decisión 46). Dos pruebas antiguas del piloto de la Entrega 1 fijaban el estado anterior del bloque 5 (19 confirmados, «Sales básicas» sin recurso, capas de la s2 sin simulación): se actualizaron al estado nuevo, declarándolo en su título.

## E. Verificación científica

Las respuestas de las prácticas se calculan con un analizador de fórmulas propio del bloque (`rengAtomosNo`) y fórmulas escritas a mano; el segundo método pasa del **nombre** a la fórmula con el módulo de nomenclatura del núcleo (`rengFormularDesdeNombre`) y cuenta átomos, masas y números de oxidación con el núcleo (`rengAnalizarFormula`, `rengMasaMolarDe`, `rengEstadosOxidacion`). Así cada fórmula escrita a mano queda contrastada con el nombre. Para las sales básicas (que el núcleo no nombra) el segundo método recuenta con el núcleo y suma números de oxidación fijos de los no metales; para los pares de iones de las prácticas 18 y 19, la prueba construye la fórmula por su cuenta (mínimo común múltiplo) y la analiza con el núcleo. Escena: carga total nula, subíndices enteros y primos entre sí, masa fórmula y porcentaje con tolerancia 10⁻⁹ en todas las combinaciones; sabotaje (subíndices sin simplificar) detectado.

## F. No verificado

Revisión docente; lector de pantalla real; existencia de las sales básicas y de algunos pares de iones de las prácticas 18 y 19 (declarados didácticos).

## G. Riesgos

Unas 2 500 líneas nuevas. El núcleo no asigna números de oxidación a sales de metales de transición con aniones poliatómicos (decisión 46); se esquivó sin tocar el núcleo.

## H. Siguiente

Bloque 6.
