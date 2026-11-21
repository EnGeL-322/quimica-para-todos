# Química · Nivel 1 · Bloque 9 «Soluciones y concentraciones» (estructura «libro»)

Fecha: 2026-11-18. Modo: escribir y ejecutar. Atestación: NO. Autorización: META del propietario.

## A. Resumen

20 subtemas con la tríada completa: 20 lecciones «libro», 60 prácticas (3 por subtema), capítulo con portada y cierre, 6 problemas integradores, 8 figuras, 40 ejemplos resueltos (uno directo y uno integrador por subtema, todos con segundo método) y una escena nueva, **«Concentraciones de una disolución»**, que calcula con las funciones de concentración del núcleo (sin motor paralelo) el % m/m, el volumen, el % m/v, la molaridad, la molalidad, la fracción molar, la normalidad, las ppm y el descenso crioscópico de una misma disolución.

## B. Cambios

Nuevos: `aprender/n1/soluciones/{comun,figuras,ejemplos,ejemplos-integradores,lecciones-a,lecciones-b,lecciones,capitulo}.ts`; `practicas-n1/{b09-comun,b09-s01-s07,b09-s08-s14,b09-s15-s20,b09-integradores}.ts`; `escenas-n1/modelos/concentraciones.ts`; `tests/quimica/nivel1-b09-soluciones.test.ts` y `nivel1-b09-segundos.ts`.
Modificados (líneas añadidas): `aprender/n1/registro.ts`, `practicas-n1/registro.ts`, `escenas-n1/registro.ts`, `temario/correspondencias.ts` (bloque 9 reescrito con una línea por subtema), `temario/retiradas-n1.ts` (8 decisiones), `scripts/verificacion-n1/bloque-libro.mjs` (línea `CONF` del bloque 9 y comprobación propia de la escena de concentraciones), `scripts/verificacion-n1/entrega0.mjs` (filtra el índice a las lecciones del bloque 8: antes suponía que el índice solo tenía ese bloque), pruebas `nivel1-libro.test.ts` (segundos métodos de los integradores del bloque 9), `entrega-2-atestaciones`, `nivel1-b08-gases` y `nivel1-infra` (sus sabotajes usaban subtemas del bloque 9 como «sin contenido»; ahora usan `n2-b13-*`, que no entra en la META; decisión 33).

## C. Cobertura (generada)

Bloque 9: 20/20 lecciones, 20/20 subtemas con prácticas (60) + 6 integradores, **16/20 con simulación**, 0 por revisar, 20 Parcial (solo falta la atestación). Nivel 1: 61 lecciones, 183 prácticas, Parcial 158, Sin contenido 100.

Tríada (a)/(b)/(c):
- **(b) escena nueva «concentraciones»**: 8, 10, 11, 12, 13, 14, 15, 16, 20.
- **(a) recurso existente**: 3, 5, 6, 7 (escena de solubilidad, Q frente a Ksp; la lección 7 aclara que la escena predice precipitación inmediata y no modela la metaestabilidad); 17, 18, 19 (escena de dilución en matraz aforado y tema «dilucion», ya confirmados).
- **(c) sin simulación**, con motivo: 1 (soluto y disolvente son definiciones y una suma de masas); 2 (los tipos de disolución y el recuento de iones no tienen un modelo que simular sin inventar una animación); 4 (ninguna escena modela la temperatura ni la ley de Henry; la escena de solubilidad usa Ksp a 25 °C); 9 (la escena calcula con masas: un porcentaje en volumen exigiría volúmenes no aditivos que no modela).

Paso 0 (registrado en `temario/retiradas-n1.ts`): **confirmados** s3, s5, s6 y s7 con la escena de solubilidad (texto de la guía y del diagnóstico citado en cada motivo); **retirados** del tema `concentracion` s1, s8, s9 y s10 (el tema solo enseña molaridad, dilución y la conversión de reactivos comerciales). Se conservan s11 (tema `concentracion`) y s17–s19 (tema y escena `dilucion`), ya confirmados.

## D. Pruebas (ejecutadas)

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | 0 errores |
| `npm test` | `Test Files  76 passed (76)` · `Tests  2853 passed (2853)` |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built` |
| `node scripts/informe-nivel1.mjs --comprobar` | `la cobertura coincide con los recursos reales` |
| `node scripts/verificacion-n1/bloque-libro.mjs --bloque 9` | `TODO OK` (149 comprobaciones) |
| `N1_SIN_WEBGL=1 … bloque-libro.mjs --bloque 9` | `TODO OK` (149 comprobaciones) |

Regresiones de los guiones de los bloques 7 y 8: en el «Registro de lotes» del estado.

Incidencias detectadas y corregidas (ninguna descartada):
- 13 retroalimentaciones de opción de menos de 26 caracteres y 2 líneas de resumen cortas (el constructor las rechazó); 4 pistas de menos de 11 caracteres (la trampa conocida, en ejemplos y en una práctica).
- La sonda de texto de las pruebas (`/NaN|undefined/`) saltaba con «NaNO₃»: la sal se cambió por NaBr en esa práctica (decisión 34).
- Una práctica tenía dos errores típicos con el mismo valor siempre (volumen × densidad): la fábrica no encontraba variantes. Se cambió uno por «reactivo como soluto puro».
- Una práctica tenía un solo dato; se añadió la referencia «100 g de agua saturados».
- El guion `entrega0.mjs` esperaba 20 lecciones en el índice (ahora hay 61): se filtra por el prefijo `gas-` de las lecciones del bloque 8.
- El guion genérico esperaba 9 botones «Simular» y hay 12: el tema `dilucion` aporta su propio «Simular» en los subtemas 17–19 (decisión 35).
- Observación (no es de este bloque): la columna «Simulaciones» de la tabla generada solo cuenta las escenas antiguas; las escenas N1 sí cuentan en el resumen del bloque («16/20»). Ocurre igual en los bloques 7 y 8.

## E. Verificación científica

Segundo método de cada práctica (en `nivel1-b09-segundos.ts`; ninguno llama a la función de la práctica): funciones de concentración del núcleo (`rengPorcentajeMasa`, `rengMolaridad`, `rengMolalidad`, `rengFraccionesMolares`, `rengNormalidad`, `rengPpm`, `rengDilucion`, `rengMolaridadDesdePorcentaje`, `rengMolalidadDesdeMolaridad`) frente a las fórmulas directas de la práctica; masas molares sumando masas atómicas de la tabla frente al analizador de fórmulas; neutralidad eléctrica para contar iones; catálogo de unidades para mL↔L, g↔kg, mg↔g, µg↔g, mg/kg↔µg/kg, mol/L↔mmol/L↔µmol/L y atm↔kPa; bisección para todas las incógnitas inversas; balances de masas de disolución para cristalizaciones. 66 prácticas × 300 semillas. Ejemplos: 40, todos con segundo método. Escena: comprobación con las definiciones y con la relación independiente c = 10·%·ρ/M en 3⁶ + 1 combinaciones, tolerancia 10⁻⁹; dos sabotajes detectados (molalidad con la masa de disolución; ppm por volumen).

Fuentes y categorías: masas atómicas de la tabla de la app → **sin verificar**; OpenStax *Chemistry 2e* secciones 3.3, 3.4, 11.1–11.4 → **sin verificar** (títulos recordados, no abiertos); K_f = 1,86 K·kg/mol y densidad del etanol 0,789 g/mL → **parámetro didáctico / sin verificar** (valores de uso común no contrastados en esta entrega); curvas de solubilidad, solubilidades en g/L de sales poco solubles, constantes de Henry, porcentajes y densidades de reactivos, ppm y ppb de contaminantes → **parámetro didáctico** (declarado en cada enunciado: no son datos de tabla ni límites normativos); resultados → **dato calculado**.

## F. No verificado

Revisión docente de textos y preguntas; lector de pantalla real; ningún dato de solubilidad, densidad o límite legal se ha contrastado con una fuente: todos se presentan como didácticos.

## G. Riesgos

El bloque añade unas 2 600 líneas de datos y código. La normalidad se pregunta sin unidad («escribe solo el número»), porque el catálogo de unidades no tiene «eq»; las ppm y ppb se piden como mg/kg y µg/kg (decisión 32).

## H. Siguiente

Bloque 10 (Ácidos, bases y equilibrio elemental), según la META.
