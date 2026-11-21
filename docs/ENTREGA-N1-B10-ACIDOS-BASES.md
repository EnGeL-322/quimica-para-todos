# Química · Nivel 1 · Bloque 10 «Ácidos, bases y equilibrio elemental» (estructura «libro»)

Fecha: 2026-11-19. Modo: escribir y ejecutar. Atestación: NO. Autorización: META del propietario.

## A. Resumen

22 subtemas con la tríada completa: 22 lecciones «libro», 66 prácticas, capítulo con portada y cierre, 6 integradores, 9 figuras, 44 ejemplos con segundo método y dos escenas nuevas: **«Ácidos, bases y pH en disolución»** (balance de carga con `rengConcentracionH` del núcleo; HA/A⁻, sal NaA, NaOH e indicador) y **«Equilibrio en fase gaseosa A ⇌ 2B»** (`rengKcDeKp` y `rengGradoDisociacionDimero` del núcleo).

## B. Cambios

Nuevos: `aprender/n1/acidos/{comun,figuras,ejemplos,ejemplos-integradores,lecciones-a,lecciones-b,lecciones,capitulo}.ts`; `practicas-n1/{b10-comun,b10-s01-s08,b10-s09-s15,b10-s16-s22,b10-integradores}.ts`; `escenas-n1/modelos/{acido-base,equilibrio-gas}.ts`; `tests/quimica/nivel1-b10-acidos-bases.test.ts` y `nivel1-b10-segundos.ts`.
Modificados (líneas añadidas): registros de lecciones, prácticas y escenas; `temario/correspondencias.ts` (bloque 10 por subtema); `temario/retiradas-n1.ts` (5 decisiones); `nivel1-libro.test.ts` (segundos de los integradores del bloque 10); `scripts/verificacion-n1/bloque-libro.mjs` (línea `CONF` y comprobación propia de la escena ácido-base).

## C. Cobertura (generada)

Bloque 10: 22/22 lecciones, 22/22 con prácticas (66) + 6 integradores, **21/22 con simulación**, 0 por revisar, 22 Parcial. Nivel 1: 83 lecciones, 249 prácticas.

Tríada: (b) escena «acido-base» en 1, 2, 4–18 y «equilibrio-gas» en 19–21; (a) existentes: escena `acidobase` y tema `ph` (4–7, 9–12, 17), `mezcla`/`valoracion` (14), `solubilidad` (18, 22), `equilibrio` (19, 21) y Mesa «Enlaces» (3); (c) sin simulación: 3 (la idea de Lewis la muestra la Mesa paso a paso; no hay modelo numérico honesto que simular).

Paso 0: **confirmada** la Mesa «enlaces» para s3 (enlaces dativos NH₃ + H⁺, H₃N·BF₃); **retiradas** la escena `acidobase` de s8 y los temas `ph` (s13), `valoracion` (s15) y `equilibrio` (s20), con el texto concreto en `retiradas-n1.ts`.

## D. Pruebas (ejecutadas)

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | 0 errores |
| `npm test` | `Test Files  77 passed (77)` · `Tests  3171 passed (3171)` |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built` |
| `node scripts/informe-nivel1.mjs --comprobar` | `la cobertura coincide con los recursos reales` |
| `bloque-libro.mjs --bloque 10` | `TODO OK` (149) |
| `N1_SIN_WEBGL=1 … --bloque 10` | `TODO OK` (149) |

Incidencias detectadas y corregidas (ninguna descartada): 29 retroalimentaciones, 5 líneas de resumen, 1 error frecuente y 1 pregunta por debajo del mínimo; 8 pistas cortas; un ejemplo cuyo segundo método usaba el Kw del núcleo (13,9965) frente al 14,00 del ejemplo (diferencia 1,6·10⁻⁴ > 10⁻⁵): se cambió por una bisección del mismo modelo (decisión 37); cuatro prácticas sin combinaciones válidas (errores típicos idénticos o demasiado cercanos a la respuesta: s4-p2, s5-p3, s8-p3, s11-p1), corregidas cambiando el error típico o acotando el intervalo; el recuento de botones «Simular» era 32 (no 33): las lecciones 19–21 llevan una escena N1 y no 22; la primera ejecución del guion CDP terminó con excepción por esa comprobación y dejó abierta su instancia de Electron, que bloqueó la segunda: se cerraron solo los procesos del guion (perfil temporal `reng-verificacion-n1-libro-b10*`; los de la sesión de Física no se tocaron) y se repitió.

## E. Verificación científica

Segundos métodos (`nivel1-b10-segundos.ts`): balance de carga del núcleo con `Kw = 10⁻¹⁴` como argumento, bisección de la tabla ICE, potencias de 10 frente a logaritmos naturales, neutralidad eléctrica, conversiones del catálogo (mol/L ↔ mmol/L ↔ µmol/L ↔ nmol/L), `rengKcDeKp` resuelta al revés, presiones parciales con Qp = Kp y método de Newton para la solubilidad con ion común. 72 prácticas × 300 semillas. Ejemplos: 44. Escenas: balance de carga y pH + pOH = pKw (243 combinaciones) y Qp = Kp, Kc = Kp/RT y conservación de A (82 combinaciones), con tolerancia 10⁻⁹; sabotajes detectados (pH desplazado un 1 %; Kp sin convertir).

Fuentes: pKw del núcleo (13,9965) y Kw = 1,0·10⁻¹⁴ de los ejercicios → **sin verificar**; R → bibliográfica declarada; Ka, Kb, Ksp, Kp, pK de indicadores → **parámetro didáctico**; potenciales y pKa «de uso común» → parámetro didáctico (sin verificar); OpenStax → **sin verificar**.

## F. No verificado

Revisión docente; lector de pantalla real; ningún valor de constante ácida, básica o de solubilidad se contrastó con una fuente.

## G. Riesgos

Unas 3 000 líneas nuevas. Las respuestas en pH dependen de la convención pKw = 14,00 de los ejercicios, distinta de la del núcleo (13,9965); está dicho en las lecciones 2, 8 y 11.

## H. Siguiente

Bloque 11 (Termoquímica y electroquímica introductoria).
