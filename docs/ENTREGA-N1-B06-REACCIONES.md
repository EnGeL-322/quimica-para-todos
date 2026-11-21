# Química · Nivel 1 · Bloque 6 «Reacciones químicas» (estructura «libro»)

Fecha: 2026-11-19. Modo: escribir y ejecutar. Atestación: NO. Autorización: META del propietario.

## A. Resumen

20 subtemas con la tríada: 20 lecciones «libro», 60 prácticas, capítulo, 6 integradores, 8 figuras, 40 ejemplos con segundo método y una escena nueva: **«Ajuste de una combustión»** (coeficientes enteros mínimos de CₓHᵧO_z + O₂ → CO₂ + H₂O, átomos de oxígeno a cada lado y conservación de la masa). Se reutilizan las escenas N1 «reactivo-limitante» y «acido-base».

## B. Cambios

Nuevos: `aprender/n1/reacciones/*`; `practicas-n1/b06-{comun,s01-s07,s08-s14,s15-s20,integradores}.ts`; `escenas-n1/modelos/combustion.ts`; `tests/quimica/nivel1-b06-reacciones.test.ts` y `nivel1-b06-segundos.ts`. Modificados (líneas añadidas): registros de lecciones, escenas y prácticas; `correspondencias.ts` (bloque 6 por subtema); `retiradas-n1.ts` (12 decisiones); lista de subtemas de las escenas «reactivo-limitante» y «acido-base»; `nivel1-libro.test.ts`; `bloque-libro.mjs` (línea `CONF` y comprobación de la escena).

## C. Cobertura (generada)

Bloque 6: 20/20 lecciones y prácticas (60) + 6 integradores, **15/20 con simulación**, 0 por revisar, 20 Parcial. Tríada: (b) «combustion» en 3–6 y 14, «reactivo-limitante» en 2 y 8, «acido-base» en 13; (a) escenas `solubilidad` (12), `mezcla` (13), `equilibrio` (15), `termo` (16, 17) y `electroquimica` (18–20); (c) 1, 7, 9, 10 y 11 sin simulación: la Mesa «Reacciones» ajusta y calcula, pero no es una simulación. Paso 0: 12 confirmaciones (decisión 49).

## D. Pruebas (ejecutadas)

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | 0 errores |
| `npm test` | `Test Files  80 passed (80)` · `Tests  4045 passed (4045)` |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built` |
| `node scripts/informe-nivel1.mjs --comprobar` | `la cobertura coincide con los recursos reales` |
| `bloque-libro.mjs --bloque 6` con y sin WebGL | `TODO OK` (150 y 150) |

Incidencias corregidas: 18 retroalimentaciones, 7 líneas de resumen y 1 error frecuente cortos; 8 lecciones con un solo término de glosario (se exigen 2); un texto alternativo de figura corto; 6 pistas cortas; tres prácticas sin combinaciones válidas (errores típicos iguales a la respuesta en reacciones 1:1, y concentraciones por debajo de la separación absoluta: decisión 50); dos prácticas con menos de 12 variantes (se ampliaron las listas de ecuaciones, oxidantes y cambios de número de oxidación); dos integradores con errores típicos casi iguales o respuestas pequeñas. En la primera ejecución CDP falló una sola comprobación: el recuento esperado de botones «Simular» del guion (puse 16 contando escenas antiguas; solo cuentan las escenas N1, 8). Se corrigió la línea `CONF` y se repitió con y sin WebGL.

## E. Verificación científica

Las ecuaciones de las prácticas se escriben ajustadas a mano; el segundo método las ajusta de nuevo con el módulo del núcleo (`rengAjustarEcuacion`, algebraico) a partir de las fórmulas sin coeficientes, y las redox con `rengAjustarIonElectron`; las masas usan `rengMasaMolarDe` y los números de oxidación `rengEstadosOxidacion`. Así cada coeficiente escrito a mano queda contrastado. Escena: igualdad de átomos de C, H y O, coeficientes primos entre sí y masa conservada con tolerancia 10⁻⁹ en todas las combinaciones; sabotaje (un O₂ de más) detectado.

## F. No verificado

Revisión docente; lector de pantalla real; entalpías de reacción (valores redondeados, decisión 51); existencia de algunas reacciones didácticas en las condiciones del enunciado.

## G. Riesgos

Unas 3 000 líneas nuevas. La serie de actividad se presenta simplificada y la lección lo dice.

## H. Siguiente

Bloque 1.
