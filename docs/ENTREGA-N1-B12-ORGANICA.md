# Química · Nivel 1 · Bloque 12 «Química orgánica introductoria» (estructura «libro»)

Fecha: 2026-11-19. Modo: escribir y ejecutar. Atestación: NO. Autorización: META del propietario. Es el último bloque de la META.

## A. Resumen

22 subtemas con la tríada: 22 lecciones «libro», 66 prácticas, capítulo, 6 integradores, 7 figuras, 44 ejemplos con segundo método y tres escenas nuevas: **«Fórmula de un hidrocarburo»**, **«Familias de compuestos orgánicos»** y **«Masa molar de un polímero»**.

## B. Cambios

Nuevos: `aprender/n1/organica/*`; `practicas-n1/b12-{comun,s01-s08,s09-s16,s17-s22,integradores}.ts`; `escenas-n1/modelos/{hidrocarburo,familia-organica,polimero}.ts`; `tests/quimica/nivel1-b12-organica.test.ts` y `nivel1-b12-segundos.ts`. Modificados (líneas añadidas): registros de lecciones, escenas y prácticas; `correspondencias.ts` (bloque 12 por subtema); `retiradas-n1.ts` (4 decisiones); `nivel1-libro.test.ts`; `bloque-libro.mjs` (línea `CONF` y comprobación de la escena). No se tocó el núcleo.

## C. Cobertura (generada)

Bloque 12: 22/22 lecciones y prácticas (66) + 6 integradores, **22/22 con simulación**, 0 por revisar, 22 Parcial. Tríada: (a) «hidrocarburo» en 1–4, 6–11, 20 y 21; «familia-organica» en 5 y 12–19; «polimero» en 22. Paso 0: 4 confirmaciones (decisión 74).

## D. Pruebas (ejecutadas)

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | 0 errores |
| `npm test` | `Test Files  85 passed (85)` · `Tests  5710 passed (5710)` |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built` |
| `node scripts/informe-nivel1.mjs --comprobar` | `la cobertura coincide con los recursos reales` |
| `bloque-libro.mjs --bloque 12` con y sin WebGL | `TODO OK` (149 y 149) |

Incidencias: dos retroalimentaciones de menos de 26 caracteres (alargadas); la plantilla de moléculas de las pruebas lanzaba un error con familias de un solo carbono (corregida; estaba en la prueba, no en la app). Al sondear el núcleo se vio que el analizador de fórmulas semidesarrolladas lee mal tres notaciones y falla con una cuarta (decisión 76): no se corrigió y las listas del bloque las evitan.

## E. Verificación científica

Cada respuesta se recalcula sobre la molécula real: recuentos de átomos, órdenes de enlace, enlaces π, anillos y masa de la estructura construida con el motor de la app a partir de su SMILES, de su nombre (analizador de nomenclatura del núcleo) o de su fórmula semidesarrollada (analizador del núcleo). Las combustiones se contrastan con el ajustador de ecuaciones del núcleo; las reacciones, por conservación de la masa y con la fórmula del producto; los polímeros, con la escena. Pruebas adicionales: cada fórmula de las listas coincide con su estructura; los nombres que el núcleo reconoce llevan a la misma estructura (identificador canónico); los recuentos declarados de enlaces múltiples, anillos, grupos funcionales y clase de amina coinciden con la estructura y con el detector de grupos del núcleo; los pares de isómeros tienen la misma fórmula y distinta estructura; la serie de isómeros de los alcanos y los isómeros de posición de los cloroalcanos se recalculan; las ecuaciones de las reacciones están ajustadas. Las tres escenas tienen prueba de contrato, comprobación en todo su dominio frente a moléculas reales y sabotaje detectado.

## F. No verificado

Revisión docente; lector de pantalla real; los nombres que el analizador del núcleo no reconoce (comprobados solo por fórmula); las fórmulas de monómeros y aminoácidos del subtema 22; los puntos de ebullición de las dos figuras; los datos de usos y toxicidad de las lecciones.

## G. Riesgos

Unas 3 200 líneas nuevas. La química orgánica se presenta sin estereoquímica ni mecanismos. Las prácticas de isómeros de los alcanos dan la serie en el enunciado (no se pide deducirla). Las esterificaciones y condensaciones se tratan como completas o con un rendimiento dado.

## H. Siguiente

La META está cumplida. Decide el propietario: atestaciones, revisión docente, contraste de datos «sin verificar» y las incidencias del núcleo de la decisión 76.
