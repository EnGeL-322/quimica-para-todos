# Química · Nivel 1 · Bloque 2 «Estructura atómica» (estructura «libro»)

Fecha: 2026-11-19. Modo: escribir y ejecutar. Atestación: NO. Autorización: META del propietario.

## A. Resumen

25 subtemas con la tríada: 25 lecciones «libro», 75 prácticas, capítulo, 6 integradores, 7 figuras, 50 ejemplos con segundo método y tres escenas nuevas: **«Composición de un átomo»** (`atomo`), **«Espectro del hidrógeno»** (`espectro-hidrogeno`) y **«Configuración electrónica»** (`config-electronica`).

## B. Cambios

Nuevos: `aprender/n1/atomo/*`; `practicas-n1/b02-{comun,s01-s08,s09-s16,s17-s25,integradores}.ts`; `escenas-n1/modelos/{atomo,espectro-hidrogeno,config-electronica}.ts`; `tests/quimica/nivel1-b02-atomo.test.ts` y `nivel1-b02-segundos.ts`. Modificados (líneas añadidas): registros de lecciones, escenas y prácticas; `correspondencias.ts` (bloque 2 por subtema); `retiradas-n1.ts` (5 decisiones); `nivel1-libro.test.ts`; `nivel1-comun.ts` («u» como unidad de masa en la comprobación de unidad ajena); `bloque-libro.mjs` (línea `CONF` y comprobación de la escena).

## C. Cobertura (generada)

Bloque 2: 25/25 lecciones y prácticas (75) + 6 integradores, **22/25 con simulación**, 0 por revisar, 25 Parcial. Tríada: (a) «atomo» en 1, 7–16 y 25; «espectro-hidrogeno» en 5, 6, 17 y 18; «config-electronica» en 19–24; (c) 2, 3 y 4 (modelos de Dalton, Thomson y Rutherford) sin simulación: son modelos históricos que la app no simula. Paso 0: 2 confirmaciones y 3 retiradas (decisión 57).

## D. Pruebas (ejecutadas)

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | 0 errores |
| `npm test` | `Test Files  82 passed (82)` · `Tests  4733 passed (4733)` |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built` |
| `node scripts/informe-nivel1.mjs --comprobar` | `la cobertura coincide con los recursos reales` |
| `bloque-libro.mjs --bloque 2` con y sin WebGL | `TODO OK` (149 y 149) |

Incidencias corregidas: 65 textos cortos de lecciones (retroalimentaciones, líneas de resumen, errores frecuentes y un enunciado) y 14 pistas o descripciones de método cortas; 4 prácticas con menos de 12 variantes (se amplió la lista de emisores beta, se sustituyeron dos errores típicos que coincidían con la respuesta y se amplió un intervalo); la comprobación de unidad ajena usaba «kg», compatible con «u»; la comprobación de la escena «atomo» no redondeaba los valores de muestreo (se corrigió la prueba, no la escena).

## E. Verificación científica

Segundos métodos independientes: recuentos de partículas con la escena «atomo»; energías, longitudes de onda y frecuencias con la escena «espectro-hidrogeno»; configuraciones con `rengOcupacion` de la tabla periódica frente al llenado propio de las prácticas; conversiones con el catálogo de unidades (`rengConvertir`: u, eV, nm); recuentos de números cuánticos con bucles explícitos; despejes por bisección. Escenas: «atomo» (A = Z + N, carga, masa y valencia frente a la tabla), «espectro-hidrogeno» (ΔE de Bohr, λ·ΔE = hc, c = λ·ν, línea Hα entre 655 y 657 nm) y «config-electronica» (los electrones suman Z, capacidades, orbitales y desapareados por reparto explícito; Cr con 6 desapareados), cada una con sabotaje detectado.

## F. No verificado

Revisión docente; lector de pantalla real; masas y abundancias isotópicas, masas de núclidos, constantes recordadas (masas de partículas, 931,494 MeV/u, 13,6 eV, r₀) y la lista de emisores beta, todas declaradas sin verificar.

## G. Riesgos

Unas 3 300 líneas nuevas. Cuatro prácticas usan fórmulas que la lección solo menciona (decisión 60). Las prácticas de Aufbau no incluyen el cromo ni el cobre (decisión 58).

## H. Siguiente

Bloque 3.
