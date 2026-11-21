# Química · Nivel 1 · Lote 8-v2 · Bloque 8 «Gases» en estructura «libro»

Fecha: 2026-11-18. Modo: escribir y ejecutar. Atestación: NO. Autorización: META del propietario (bloques 8-v2 → 7 → 9 → 10 → 11 → 5 → 6 → 1 → 2 → 3 → 4 → 12 sin pedir permiso entre ellos).

## A. Resumen

- **Paso A (contrato):** la lección N1 tiene ahora la estructura «libro» completa y validada por el constructor: objetivos, por qué importa, analogía con su límite, ≥ 2 ejemplos con segundo método, ≥ 1 figura, ≥ 2 errores con corrección, resumen, glosario, 3 preguntas con retroalimentación por opción y conexiones (anterior, siguiente y prerrequisitos sin ciclos). Capítulo por bloque (portada y cierre) y problemas integradores (≥ 6, 2/2/2, ≥ 2 subtemas cada uno).
- **Paso B (bloque 8):** las 20 lecciones se completaron con esas secciones sin cambiar sus textos ni resultados anteriores; 20 ejemplos integradores nuevos; 12 figuras calculadas con el modelo; capítulo con portada, mapa, ruta, resumen y glosario (36 términos); 6 problemas integradores.
- **Primera escena real del kit:** «Gas ideal en un recipiente» (reutiliza `rengGasIdeal` del núcleo), en la capa Explorar de 12 lecciones y con botón «Simular» en el temario.

## B. Cambios

Nuevos: `aprender/n1/calidad.ts`, `capitulo.ts`, `figuras.ts`; `aprender/n1/gases/{libro-comun,libro-a,libro-b,ejemplos-integradores,figuras,capitulo}.ts`; `practicas-n1/{integradores,b08-integradores}.ts`; `escenas-n1/modelos/gas-ideal.ts`; `vista/LeccionN1Partes.tsx`; `tests/quimica/nivel1-libro.test.ts`; `scripts/verificacion-n1/b08-libro.mjs`.
Modificados: `aprender/n1/{tipos,constructor,registro}.ts`, `aprender/n1/n1.css`, `gases/lecciones.ts` (envoltorio `rengLeccionGas`; textos intactos), `practicas-n1/{tipos,fabrica,registro}.ts`, `escenas-n1/registro.ts`, `temario/{tipos,recursos,verificacion,estado,informeNivel1,correspondencias}.ts` (tipo `escena-n1`), `vista/{LeccionN1,PracticasN1,IndiceN1,EscenaN1}.tsx`, `vista/figuras/Figuras.tsx` (colores de serie), `View.tsx`; pruebas `entrega-1-temario`, `entrega-e-simulaciones-libres`, `nivel1-b08-gases`, `nivel1-comun`; guiones `b08.mjs`, `entrega0.mjs`.
Reutilizado: fábrica de prácticas, corrección sobre `rengCorregirNumero`, `rengRK4`, kit de figuras y de escenas, Temml, `rengGasIdeal`.

## C. Cobertura (generada por `node scripts/informe-nivel1.mjs`)

Bloque 8: 20/20 lecciones, 20/20 subtemas con prácticas (60) + 6 integradores, **12/20 con simulación** (escena nueva), 0 por revisar, 20 Parcial (falta solo la atestación, decisión NO). Tríada: (b) 1, 4–11, 14–16; (a) 12 (caso real, consulta); (c) 2, 3, 13, 17–20 con su motivo (decisión 24 del estado).

## D. Pruebas (ejecutadas)

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | 0 errores |
| `npm test` | `Test Files  74 passed (74)` · `Tests  2258 passed (2258)` |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built` |
| `node scripts/informe-nivel1.mjs --comprobar` | `la cobertura coincide con los recursos reales` |
| `node scripts/verificacion-n1/b08-libro.mjs` (con y sin WebGL) | `TODO OK`, 149 comprobaciones cada una |
| `node scripts/verificacion-n1/b08.mjs` (con y sin WebGL) | `TODO OK`, 119 comprobaciones cada una |
| `node scripts/verificacion-n1/entrega0.mjs` (con y sin WebGL) y `--sabotaje` | `TODO OK` (75, 75 y 3) |
| `node scripts/verificacion-d/e1.mjs` (con y sin WebGL) | `TODO OK` (59) |

Incidencias detectadas y corregidas durante el lote (ninguna descartada): una retroalimentación de 18 caracteres (la rechazó el constructor), una pista de 10 caracteres en un ejemplo nuevo (la rechazó la prueba), un factor 1000 sobrante en un segundo método de prueba, el color de serie `--accent-3` con 2,91:1 en Día (sustituido; el guion nuevo comprueba ≥ 3:1 en trazos y marcadores), la sonda de `b08.mjs` que medía el texto SVG por `color` en vez de `fill`, y los recuentos de los índices (ahora con portada e integradores).

Sabotajes nuevos: constructor (15 casos: pregunta de menos, un solo ejemplo, sin figura, un error, resumen corto, colisión de glosario, anterior/siguiente inexistente, prerrequisito propio, sin analogía, sin límite, sin «por qué importa», un objetivo, dos correctas, retro corta), figura sin texto alternativo / con NaN / fuera de ejes, ciclo de prerrequisitos, similitud con párrafo copiado, ruta de capítulo invertida, integradores de menos o de un solo subtema o sin segundo método, escena de gas ideal con temperatura en °C.

## E. Verificación científica

Segundo método de cada ejemplo integrador: RK4 de la forma diferencial (Boyle, Gay-Lussac), camino SI con N_A·k_B, moles intermedios, conversión con el catálogo, fórmula reordenada (Z de van der Waals). Integradores: RK4 dP/dV, presión implícita con N_A·k_B, número de moléculas, densidad numérica × masa molecular, volumen en m³ con N_A·k_B, razón de Graham sobre u_rms de referencia. Escena: P frente a N·k_B·T/V, R, densidad, u_rms, energía molar y V_m·n con tolerancia relativa 10⁻⁹ en 256 combinaciones. Afirmaciones de figuras comprobadas con números (p. ej. Z de van der Waals a 400 K: mínimo 0,64 hacia 175 atm y 1,79 a 1000 atm; máximo de Maxwell-Boltzmann del N₂ cerca de 422 m/s a 300 K). Fuentes: las mismas categorías del bloque 8 (R, atm, N_A, k_B «bibliográfica declarada»; masas de la tabla «sin verificar»; densidades y parámetros a, b «didácticos»).

## F. No verificado

Lector de pantalla real; revisión docente de textos y preguntas; botón «Copiar el texto» de la escena (no se pulsa para no tocar el portapapeles).

## G. Riesgos

Más texto en el fragmento principal; las 12 figuras se calculan al cargar el módulo (milisegundos). Las preguntas «Para comprobar» no guardan respuestas (decisión 22).

## H. Siguiente

Bloque 7 (Estequiometría), ya en curso según la META.
