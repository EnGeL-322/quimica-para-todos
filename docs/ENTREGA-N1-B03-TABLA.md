# Química · Nivel 1 · Bloque 3 «Tabla periódica» (estructura «libro»)

Fecha: 2026-11-19. Modo: escribir y ejecutar. Atestación: NO. Autorización: META del propietario.

## A. Resumen

23 subtemas con la tríada: 23 lecciones «libro», 69 prácticas, capítulo, 6 integradores, 7 figuras, 46 ejemplos con segundo método y una escena nueva: **«Tendencias periódicas»** (radio, energía de ionización, electronegatividad y carácter metálico de los elementos representativos de los periodos 2 a 5). Se reutilizan «config-electronica» y «atomo».

## B. Cambios

Nuevos: `aprender/n1/tabla/*`; `practicas-n1/b03-{comun,s01-s08,s09-s16,s17-s23,integradores}.ts`; `escenas-n1/modelos/tendencias-periodicas.ts`; `tests/quimica/nivel1-b03-tabla.test.ts` y `nivel1-b03-segundos.ts`. Modificados (líneas añadidas): registros de lecciones, escenas y prácticas; `correspondencias.ts` (bloque 3 por subtema); `retiradas-n1.ts` (6 decisiones); listas de subtemas de «config-electronica» y «atomo»; `nivel1-libro.test.ts`; `bloque-libro.mjs` (línea `CONF` y comprobación de la escena).

## C. Cobertura (generada)

Bloque 3: 23/23 lecciones y prácticas (69) + 6 integradores, **19/23 con simulación**, 0 por revisar, 23 Parcial. Tríada: (a) «tendencias-periodicas» en 2, 3, 5–11, 15, 17, 19, 20, 22 y 23; (b) «config-electronica» en 4 y 12, y «atomo» en 16 y 21; (c) 1, 13, 14 y 18 sin simulación (decisión 62). Paso 0: 5 confirmaciones y 1 retirada (decisión 64).

## D. Pruebas (ejecutadas)

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | 0 errores |
| `npm test` | `Test Files  83 passed (83)` · `Tests  5064 passed (5064)` |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built` |
| `node scripts/informe-nivel1.mjs --comprobar` | `la cobertura coincide con los recursos reales` |
| `bloque-libro.mjs --bloque 3` con y sin WebGL | `TODO OK` (149 y 149) |

Incidencias corregidas: 9 retroalimentaciones cortas; una práctica con 11 variantes porque dos errores típicos coincidían (se sustituyó uno); se quitó de la lección de afinidad electrónica un enlace a la tabla periódica, que no muestra ese dato; una figura describía mal el orden de sus series en el texto alternativo.

## E. Verificación científica

Segundos métodos independientes: posiciones y recuentos con la tabla periódica de la app; radios, energías de ionización, electronegatividad y valencia con la escena «tendencias-periodicas»; electronegatividades leídas directamente de los datos de PubChem; años leídos directamente del archivo de Wikidata; masas con `rengMasaMolarDe` y `rengAnalizarFormula` del núcleo; estados de oxidación con `rengEstadosOxidacion`; volúmenes y densidades de gases con la escena «gas-ideal» por bisección; conversiones con el catálogo de unidades; recuentos de bloques con bucles de m_l. La escena se comprueba en las 32 posiciones contra la tabla de datos y la tabla de la app, con sabotaje detectado; una prueba aparte comprueba que la tabla de datos es coherente con las tendencias generales que enseñan las lecciones.

## F. No verificado

Revisión docente; lector de pantalla real; todos los radios, energías de ionización, afinidades y radios iónicos (recordados, sin verificar); datos históricos; fórmulas de minerales y núclidos de actínidos.

## G. Riesgos

Unas 3 400 líneas nuevas. Los radios atómicos dependen de la definición y varían entre libros; las prácticas dan siempre el dato en el enunciado. Las tendencias tienen excepciones que las lecciones mencionan pero la escena no explica.

## H. Siguiente

Bloque 4.
