# Química · Nivel 1 · Bloque 1 «Fundamentos de la química» (estructura «libro»)

Fecha: 2026-11-19. Modo: escribir y ejecutar. Atestación: NO. Autorización: META del propietario.

## A. Resumen

23 subtemas con la tríada: 23 lecciones «libro», 69 prácticas, capítulo, 6 integradores, 7 figuras, 46 ejemplos con segundo método y una escena nueva: **«Densidad y flotación»** (ρ en g/mL y kg/m³, condición de flotación y fracción sumergida). Se reutilizan las escenas N1 «combustion», «calorimetria», «gas-ideal» y «concentraciones».

## B. Cambios

Nuevos: `aprender/n1/fundamentos/*`; `practicas-n1/b01-{comun,s01-s08,s09-s16,s17-s23,integradores}.ts`; `escenas-n1/modelos/densidad.ts`; `tests/quimica/nivel1-b01-fundamentos.test.ts` y `nivel1-b01-segundos.ts`. Modificados (líneas añadidas): registros de lecciones, escenas y prácticas; `correspondencias.ts` (bloque 1 por subtema); `retiradas-n1.ts` (12 decisiones); listas de subtemas de cuatro escenas N1 existentes; `nivel1-libro.test.ts`; `bloque-libro.mjs` (línea `CONF` y comprobación de la escena).

## C. Cobertura (generada)

Bloque 1: 23/23 lecciones y prácticas (69) + 6 integradores, **16/23 con simulación**, 0 por revisar, 23 Parcial. Tríada: (b) «densidad» en 3, 5, 7, 14, 16, 17, 20 y 21; «combustion» en 2 y 15; «calorimetria» en 4 y 9; «gas-ideal» en 8 y 22; «concentraciones» en 12 y 13; (c) 1, 6, 10, 11, 18, 19 y 23 sin simulación (la Mesa «Explorar», la tabla periódica y el catálogo de peligros son consulta, no simulación). Paso 0: 7 confirmaciones y 5 retiradas (decisión 53).

## D. Pruebas (ejecutadas)

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | 0 errores |
| `npm test` | `Test Files  81 passed (81)` · `Tests  4375 passed (4375)` |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built` |
| `node scripts/informe-nivel1.mjs --comprobar` | `la cobertura coincide con los recursos reales` |
| `bloque-libro.mjs --bloque 1` con y sin WebGL | `TODO OK` (149 y 149) |

Incidencias corregidas: 24 retroalimentaciones, 3 líneas de resumen y 3 errores frecuentes cortos; una pregunta con enunciado corto; una lección con un solo término de glosario; 13 pistas y un mensaje de error cortos; un segundo método con descripción corta; dos prácticas de densidad media cuya respuesta y error típico quedaban a menos de 0,15 g/mL (decisión 55); dos listas con 11 variantes (se añadieron un par de óxidos y dos objetos que flotan); un error típico artificial (división entre 10) sustituido por una regla de tres al revés real; las plantillas con comillas invertidas de una práctica se perdieron al editar con el shell y se repusieron con el editor.

## E. Verificación científica

Segundos métodos independientes: conversiones con el catálogo de unidades de la app (`rengConvertir`, con fuentes NIST); masas y recuentos con `rengMasaMolarDe` y `rengAnalizarFormula` del núcleo; combustiones ajustadas con `rengAjustarEcuacion`; densidades, volúmenes y presiones con las escenas «densidad», «gas-ideal» y «calorimetria» (a menudo por bisección inversa); cifras significativas con un contador propio de la prueba (quitar coma y ceros iniciales) y exponentes con `log10`. Escena «densidad»: ρ = m/V, conversión a kg/m³, condición de flotación, fracción sumergida y carácter intensivo con tolerancia 10⁻⁹ en todas las combinaciones; sabotaje (factor 10⁶ en lugar de 10³) detectado.

## F. No verificado

Revisión docente; lector de pantalla real; densidades, calores latentes y concentraciones de ácidos comerciales (valores redondeados, declarados sin verificar).

## G. Riesgos

Unas 3 500 líneas nuevas. Varias prácticas de este bloque son de cálculo sencillo (conversiones), coherentes con un primer bloque.

## H. Siguiente

Bloque 2.
