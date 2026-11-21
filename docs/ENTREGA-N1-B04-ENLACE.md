# Química · Nivel 1 · Bloque 4 «Enlace químico» (estructura «libro»)

Fecha: 2026-11-19. Modo: escribir y ejecutar. Atestación: NO. Autorización: META del propietario.

## A. Resumen

22 subtemas con la tríada: 22 lecciones «libro», 66 prácticas, capítulo, 6 integradores, 8 figuras, 44 ejemplos con segundo método y cinco escenas nuevas: **«Carga formal y octeto»**, **«Polaridad de un enlace»**, **«Geometría molecular (VSEPR)»**, **«Interacción entre dos moléculas»** y **«Orden de enlace»**.

## B. Cambios

Nuevos: `aprender/n1/enlace/*`; `practicas-n1/b04-{comun,s01-s08,s09-s16,s17-s22,integradores}.ts`; `escenas-n1/modelos/{carga-formal,polaridad-enlace,geometria-vsepr,interaccion-molecular,orden-enlace}.ts`; `tests/quimica/nivel1-b04-enlace.test.ts` y `nivel1-b04-segundos.ts`. Modificados (líneas añadidas): registros de lecciones, escenas y prácticas; `correspondencias.ts` (bloque 4 por subtema); `retiradas-n1.ts` (10 decisiones); `nivel1-libro.test.ts`; `nivel1-b03-tabla.test.ts` (prueba de contraste con el núcleo); `bloque-libro.mjs` (línea `CONF` y comprobación de la escena).

## C. Cobertura (generada)

Bloque 4: 22/22 lecciones y prácticas (66) + 6 integradores, **20/22 con simulación**, 0 por revisar, 22 Parcial. Tríada: (a) «carga-formal» en 1–4 y 8; «polaridad-enlace» en 6, 7, 10, 11 y 21; «geometria-vsepr» en 12–14; «orden-enlace» en 15, 16 y 22; «interaccion-molecular» en 17–20; (c) 5 y 9 sin simulación (decisión 67). Paso 0: 9 confirmaciones y 1 retirada (decisión 69).

## D. Pruebas (ejecutadas)

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | 0 errores |
| `npm test` | `Test Files  84 passed (84)` · `Tests  5387 passed (5387)` |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built` |
| `node scripts/informe-nivel1.mjs --comprobar` | `la cobertura coincide con los recursos reales` |
| `bloque-libro.mjs --bloque 4` con y sin WebGL | `TODO OK` (149 y 149) |

Incidencias corregidas: 9 retroalimentaciones cortas y una pista corta; 5 prácticas con menos de 12 variantes (más especies con enlaces múltiples, más pares de compuestos iónicos y más reacciones; dos errores típicos sustituidos por coincidir con otro); un enunciado que componía fórmulas juntando símbolos (habría dado «MgBr» o «CaF») se reescribió antes de ejecutar; los iones con manganeso y cromo se excluyeron de dos prácticas de recuento de valencia.

## E. Verificación científica

Segundos métodos independientes: cargas formales y recuentos de electrones con la escena «carga-formal»; Δχ, carácter iónico y umbrales con la escena «polaridad-enlace» y las funciones del núcleo; energías de pares de iones con `rengEnergiaCoulombPar`; energías de enlace con los datos del núcleo y el catálogo de unidades; geometría con el teorema del coseno; dominios, ángulos e híbridos con la escena «geometria-vsepr»; enlaces σ y π con el recuento de átomos, el grado de insaturación y la fórmula del octeto mediante el analizador del núcleo; órdenes de enlace con la escena «orden-enlace»; temperaturas con conversión a kelvin. Las cinco escenas tienen prueba de contrato, comprobación en todo su dominio y sabotaje detectado. Una prueba adicional cruza las listas estructurales recordadas con la fórmula del octeto y el grado de insaturación.

## F. No verificado

Revisión docente; lector de pantalla real; todos los valores de tablas de texto recordados (energías medias de enlace, momentos dipolares, puntos de fusión y ebullición, entalpías de vaporización, longitudes y ángulos que no proceden del núcleo) y las listas estructurales.

## G. Riesgos

Unas 4 000 líneas nuevas. Varias prácticas usan modelos aproximados o relaciones que la lección solo menciona (decisión 71). El puente de hidrógeno se representa con un potencial sin orientación.

## H. Siguiente

Bloque 12, el último de la META.
