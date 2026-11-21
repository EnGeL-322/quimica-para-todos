# Química · Nivel 1 · Bloque 11 «Termoquímica y electroquímica introductoria» (estructura «libro»)

Fecha: 2026-11-19. Modo: escribir y ejecutar. Atestación: NO. Autorización: META del propietario.

## A. Resumen

20 subtemas con la tríada: 20 lecciones «libro», 60 prácticas, capítulo, 6 integradores, 7 figuras, 40 ejemplos con segundo método y dos escenas nuevas: **«Calorímetro de mezclas»** (balance de calor con `RENG_C_AGUA` del núcleo) y **«Electrólisis y leyes de Faraday»** (`RENG_FARADAY` del proyecto).

## B. Cambios

Nuevos: `aprender/n1/termo/*`; `practicas-n1/b11-{comun,s01-s07,s08-s14,s15-s20,integradores}.ts`; `escenas-n1/modelos/{calorimetria,electrolisis}.ts`; `tests/quimica/nivel1-b11-termo.test.ts` y `nivel1-b11-segundos.ts`. Modificados (líneas añadidas): registros, `correspondencias.ts` (bloque 11 por subtema), `retiradas-n1.ts` (3 decisiones), `nivel1-libro.test.ts`, `bloque-libro.mjs` (línea `CONF` y comprobación de la escena del calorímetro).

## C. Cobertura (generada)

Bloque 11: 20/20 lecciones y prácticas (60) + 6 integradores, **19/20 con simulación**, 0 por revisar, 20 Parcial. Tríada: (b) «calorimetria» en 1–4 y «electrolisis» en 17–19; (a) escena `termo` y tema `termo` (5–8, 11–13), `cinetica` (10), `electroquimica` (14–16, 20); (c) 9 sin simulación (la energía de enlace la muestra la Mesa «Enlaces»; no hay escena de enlaces con energía honesta). Paso 0: confirmadas Mesa «enlaces» (s9) y escena `electroquimica` (s20); retirada `electroquimica` de s18 (decisión 43).

## D. Pruebas (ejecutadas)

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | 0 errores |
| `npm test` | `Test Files  78 passed (78)` · `Tests  3463 passed (3463)` |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built` |
| `node scripts/informe-nivel1.mjs --comprobar` | `la cobertura coincide con los recursos reales` |
| `bloque-libro.mjs --bloque 11` con y sin WebGL | `TODO OK` (149 y 149) |

Incidencias corregidas: 17 retroalimentaciones, 7 líneas de resumen, 2 errores frecuentes y 1 pregunta cortos; 14 pistas cortas; dos segundos métodos con un signo o un factor equivocados (Arrhenius con −Ea; batería con la carga contada dos veces) que la prueba detectó; tres prácticas sin combinaciones válidas porque la corrección de Nernst (decenas de mV) queda por debajo de la separación exigida si se pide en V: ahora se piden en mV (decisión 42); una práctica de Arrhenius con dos errores típicos casi iguales: se cambió uno.

## E. Verificación científica

Segundos métodos: escena del calorímetro y de electrólisis (bisección inversa), funciones del núcleo de termoquímica (`rengCalorLiberado`, `rengEntalpiaReaccion`, `rengEntropiaReaccion`, `rengEnergiaLibre`, `rengConstanteDeG`, `rengVanTHoff`), sumas explícitas de etapas y enlaces, forma decimal de Nernst y conversiones del catálogo. Escenas: suma de calores nula y T_f entre las iniciales (730 combinaciones); m = I·t·M·η/(zF) y proporcionalidad con t (244 combinaciones), tolerancia 10⁻⁹; sabotajes detectados (calorímetro ignorado; tiempo en minutos).

## F. No verificado

Revisión docente; lector de pantalla real; potenciales estándar, calores específicos de metales y energías de enlace no contrastados (declarados didácticos).

## G. Riesgos

Unas 3 000 líneas nuevas. Las prácticas de Nernst en mV son menos habituales en los libros; las lecciones explican la conversión.

## H. Siguiente

Bloque 5 (Nomenclatura inorgánica).
