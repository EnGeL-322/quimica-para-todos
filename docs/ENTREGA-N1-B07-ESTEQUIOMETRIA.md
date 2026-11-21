# Química · Nivel 1 · Bloque 7 «Estequiometría» (estructura «libro»)

Fecha: 2026-11-18. Modo: escribir y ejecutar. Atestación: NO. Autorización: META del propietario.

## A. Resumen

21 subtemas con la tríada completa: 21 lecciones «libro» (objetivos, por qué importa, idea, analogía con su límite, ecuaciones TeX numeradas, figura, 2 ejemplos con segundo método, errores con corrección, preguntas con retroalimentación por opción, resumen, glosario y conexiones), 63 prácticas (3 por subtema), capítulo con portada y cierre, 6 problemas integradores y una escena nueva, **«Reactivo limitante y rendimiento»**, que reutiliza el ajuste de ecuaciones y `rengReactivoLimitante` del núcleo (sin motor paralelo).

## B. Cambios

Nuevos: `aprender/n1/estequiometria/{datos,glosario,ejemplos,ejemplos-integradores,figuras,lecciones-a,lecciones-b,lecciones,capitulo}.ts`; `practicas-n1/{b07-comun,b07-s01-s07,b07-s08-s14,b07-s15-s21,b07-integradores}.ts`; `escenas-n1/modelos/reactivo-limitante.ts`; `tests/quimica/nivel1-b07-estequiometria.test.ts` y `nivel1-b07-segundos.ts`; guion genérico `scripts/verificacion-n1/bloque-libro.mjs` (parámetro `--bloque`).
Modificados (una línea por registro): `aprender/n1/registro.ts`, `practicas-n1/registro.ts`, `escenas-n1/registro.ts`, `escenas-n1/modelos/gas-ideal.ts` (subtemas 7.12 y 7.20 en su lista), `temario/correspondencias.ts` (bloque 7 reescrito con una línea por subtema que conserva los temas confirmados), `temario/retiradas-n1.ts` (6 decisiones); pruebas `nivel1-comun.ts` (unidad ajena «s» para prácticas de masa; alternativas g→mg y mol→mmol), `nivel1-libro.test.ts` (segundos métodos de los integradores del bloque 7), `nivel1-b08-gases.test.ts` (el bucle de decisiones se acota al bloque 8).

## C. Cobertura (generada)

Bloque 7: 21/21 lecciones, 21/21 subtemas con prácticas (63) + 6 integradores, **10/21 con simulación**, 0 por revisar, 21 Parcial (solo falta la atestación). Nivel 1: 41 lecciones, 123 prácticas, Parcial 142, Sin contenido 116.

Tríada (a)/(b)/(c):
- **(b) escena nueva «reactivo limitante»**: 9, 10, 11, 13, 14, 15, 16, 17.
- **(a) recurso existente**: 12 y 20 (escena «gas ideal»: el volumen a 1 atm es proporcional a n), 4 (Mesa molecular, ya confirmada: muestra la composición y la masa de una molécula).
- **(c) sin simulación**, con motivo: 1, 2 (conteo y constante: no hay modelo que simular, solo definiciones); 3, 5, 6 (sumas de masas atómicas: lo honesto es el cálculo guiado de la lección); 7, 8 (deducción de fórmulas a partir de datos de análisis); 18 (la escena no modela impurezas); 19 (la escena no modela mezclas de dos reactivos que dan el mismo producto); 21 (la escena calcula una sola reacción, no secuencias).

Paso 0 (registrado en `temario/retiradas-n1.ts`): **confirmados** s5 (tema `mol`), s9, s11, s14 y s16 (tema `estequiometria`), cada uno con el texto concreto del tema que lo cubre; **retirado** s18 del tema `concentracion` (trata molaridad y dilución, no la pureza estequiométrica). Los temas ya confirmados (s1–s4, s6, s10, s13, s15, s17) se conservan junto a la lección N1.

## D. Pruebas (ejecutadas)

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | 0 errores |
| `npm test` | `Test Files  75 passed (75)` · `Tests  2562 passed (2562)` |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built` |
| `node scripts/informe-nivel1.mjs --comprobar` | `la cobertura coincide con los recursos reales` |
| `node scripts/verificacion-n1/bloque-libro.mjs --bloque 7` | `TODO OK` (150 comprobaciones) |

Las demás ejecuciones de guiones (sin WebGL, bloque 8 con el guion genérico y regresiones) se registran en el estado al terminar.

Incidencias detectadas y corregidas (ninguna descartada): el constructor rechazó una línea de resumen corta, un error frecuente corto y tres retroalimentaciones cortas; dos pistas de exactamente 10 caracteres (la trampa conocida); cuatro prácticas tenían errores típicos que coinciden siempre con la respuesta o entre sí (la fábrica no encontraba variantes; se sustituyeron por errores distintos); una práctica pedía la masa de una molécula en gramos (≈ 10⁻²³ g), incompatible con la separación absoluta de 0,15 de la fábrica: se reformuló como «moléculas por gramo»; la unidad «ajena» del comprobador común (kg) era compatible con prácticas en gramos: ahora se usa «s».

## E. Verificación científica

Segundo método de cada práctica (en `nivel1-b07-segundos.ts`, ninguno llama a la función de la práctica): analizador de fórmulas del núcleo frente a suma manual de masas atómicas; función del núcleo para el reactivo limitante (avance, productos, sobrantes) frente a las fórmulas directas; bisección para las incógnitas inversas (reactivo necesario, pureza, composición de mezclas); conservación de la masa o de un elemento; camino SI con N_A·k_B para los gases; simulación etapa a etapa para rendimientos encadenados. Ejemplos: 42, todos con segundo método (núcleo, conservación, SI, bisección o cálculo paso a paso). Escena: comprobación con un balance de átomos propio (lectura de la ecuación) en 256 combinaciones, tolerancia 10⁻⁹, y sabotaje (modelo que iguala las cantidades) detectado.

Fuentes y categorías: masas atómicas de la tabla de la app → **sin verificar**; N_A, R → **bibliográfica declarada** (registradas en el proyecto); composición del aire (21 % de O₂) → **bibliográfica declarada** (caso real del proyecto); OpenStax *Chemistry 2e* secciones 3.1, 3.2, 4.3–4.5 → **sin verificar** (títulos recordados, no abiertos); datos de enunciados (porcentajes, masas de muestras, rendimientos, purezas) → **parámetro didáctico**; resultados → **dato calculado**. Comparaciones cotidianas de las lecciones comprobadas con cálculo propio (p. ej. 6·10²³ granos de 1 mm³ cubren la Tierra con algo más de 1 m; 0,85⁶ ≈ 38 %).

## F. No verificado

Revisión docente de textos y preguntas; lector de pantalla real.

## G. Riesgos

El bloque añade unas 3 600 líneas de código y datos (lecciones, prácticas y escena) al fragmento principal. Las prácticas dependen de que el analizador de fórmulas lea los compuestos elegidos (comprobado en 300 semillas por práctica).

## H. Siguiente

Bloque 9 (Soluciones y concentraciones), según la META.
