# Nivel 1 · Bloque 8 «Gases» · lecciones por capas y prácticas (piloto D7)

Fecha: 2026-11-18. Modo **SOLO ESCRIBIR**: no se ejecutó ningún comando (ni lectura con terminal). Todo lo que sigue está **escrito sin ejecutar**; ningún resultado de prueba de este documento es real. Atestación de cobertura: **NO** (los 20 subtemas quedan en Parcial). Sin commits. Física para Todos se usó solo como referencia de lectura; no se modificó.

## A. Resumen

- 20 subtemas del bloque 8 → **20 lecciones por capas** (Comprender, Formalizar, Aplicar con ejemplo que se revela paso a paso; Explorar solo en el subtema 12), **20 ejemplos** con solución analítica y segundo método independiente, **60 prácticas** (3 por subtema: básica, intermedia, avanzada) con respuesta calculada por semilla, errores típicos separados y corrección de unidades.
- Paso 0: el único vínculo «por revisar» del bloque (subtema 1) se **retira**; el caso real «El aire que respiras» se **confirma** en el subtema 12 como consulta, con su valor fijado por prueba.
- Infraestructura N1 de Química reutilizable por los demás bloques (fábrica de prácticas, adaptador sobre la corrección existente, progreso en clave nueva, registros, vistas, informe de cobertura derivado).
- Navegación: Temario → subtema → «Aprender» / «Practicar» (no hay «Simular»: Química no tiene escena de gases). Aprender y Prácticas ganan un índice del Nivel 1 por bloque; no se quitó nada.
- Estado esperado del bloque 8: 20 Parcial, 0 Completado, 0 Verificado. Lo único que falta para «Completado» es la atestación (decisión del propietario).

## B. Cambios

**Creados**

| Archivo | Para qué |
|---|---|
| `src/.../simulador-quimica/aprender/n1/tipos.ts` | Tipos de lección por capas, ejemplo y procedencia; patrón de id (≤ 32 caracteres). |
| `aprender/n1/procedencia.ts` | Categorías de procedencia (vocabulario D9 del proyecto) y fuentes declaradas: secciones de OpenStax (sin verificar), R, atm, kelvin, N_A y k_B, masas molares. |
| `aprender/n1/constructor.ts` | `rengLeccionN1`: arma la lección y añade texto didáctico, modelo idealizado y cálculo comprobado. |
| `aprender/n1/numericos.ts` | Runge–Kutta 4 y bisección (segundos métodos). |
| `aprender/n1/registro.ts` | Registro único de lecciones y ejemplos N1 (una línea por bloque). |
| `aprender/n1/gases/constantes.ts`, `ejemplos.ts`, `lecciones.ts` | Constantes del bloque, 20 ejemplos y 20 lecciones. |
| `aprender/n1/n1.css` | Estilos de las vistas N1 (solo variables CSS). |
| `practicas-n1/tipos.ts`, `aleatorio.ts`, `fabrica.ts`, `correccion.ts`, `progreso.ts`, `registro.ts` | Motor de prácticas N1. |
| `practicas-n1/b08-comun.ts`, `b08-s01-s05.ts`, `b08-s06-s10.ts`, `b08-s11-s15.ts`, `b08-s16-s20.ts` | Las 60 prácticas. |
| `vista/LeccionN1.tsx`, `vista/PracticasN1.tsx`, `vista/IndiceN1.tsx` | Lección por capas, lista de prácticas del subtema e índice por bloque. |
| `temario/retiradas-n1.ts` | Decisiones del Paso 0 con motivo y fecha. |
| `temario/informeNivel1.ts` | Genera la sección de cobertura de `NIVEL-1-ESTADO.md` desde los recursos reales. |
| `tests/quimica/nivel1-comun.ts` | Arnés reutilizable de prácticas (300 semillas, separación, corrección, unidades, no finitos, segundo método). |
| `tests/quimica/nivel1-b08-gases.test.ts` | Bloque 8: 60 segundos métodos, lecciones, ejemplos, Paso 0, cobertura y sabotajes. |
| `tests/quimica/nivel1-infra.test.ts` | Fábrica, semillas, corrección, progreso y claves, registros; sabotajes. |
| `tests/quimica/nivel1-informe.test.ts` | Comprueba (o regenera) la cobertura del documento. |
| `scripts/informe-nivel1.mjs` | `node scripts/informe-nivel1.mjs [--comprobar]` (no se tocó `package.json`). |
| `scripts/verificacion-n1/b08.mjs` | Guion CDP en Electron con perfil temporal. |
| `docs/NIVEL-1-ESTADO.md`, este informe | Estado vivo e informe. |

**Modificados** (solo con Edit, añadiendo líneas propias)

| Archivo | Cambio |
|---|---|
| `temario/tipos.ts` | Tipos de recurso `leccion-n1` y `practica-n1`. |
| `temario/recursos.ts` | Existencia, capas, etiqueta y acciones de los dos tipos nuevos. |
| `temario/verificacion.ts` | Nivel de verificación de los tipos nuevos = el más débil de su procedencia declarada. |
| `temario/estado.ts` | «Completado» acepta el par lección N1 + prácticas N1 con atestación (tema = lección, familia = subtema) y la escena de Explorar si la hubiera. Criterios y textos visibles intactos. |
| `temario/atestaciones.ts` | El validador acepta atestaciones N1. |
| `temario/correspondencias.ts` | Bloque 8: 20 grupos confirmados (lección + prácticas; caso «aire» en el 12). Se retira el «por revisar» del subtema 1. |
| `View.tsx` | Estado de la vista N1, apertura por ruta y desde los índices; ningún destino nuevo. |
| `modos/Aprender.tsx`, `modos/EjerciciosQuimica.tsx` | Prop opcional `extra` para mostrar el índice N1. Nada se quitó. |
| `tests/quimica/entrega-1-temario.test.ts`, `entrega-2-atestaciones.test.ts`, `entrega-e-simulaciones-libres.test.ts` | Desacople de recuentos (decisión 7 de `NIVEL-1-ESTADO.md`). |
| `scripts/verificacion-d/e1.mjs` | Cotas en lugar de 163 y 150. |
| `docs/DATOS.md` | Datos del bloque 8 y su nivel. |

**Reutilizados sin cambios:** `practica/correccion.ts` (`rengCorregirNumero`), `practica/numeros.ts` (`rengCrearAzar`, `rengEntre`, `rengTextoNumero`, lectura de números), `lib/unidades` (análisis y conversión de unidades), `nucleo/estequiometria.ts` (N_A, k_B; `rengGasIdeal` y `rengDensidadGas` como tercer contraste en pruebas), `nucleo/formula.ts` (masas molares), `datos/electroquimica.ts` (R), `datos/casos` (caso «aire»), arnés CDP `scripts/verificacion-d/cdp.mjs` y `sonda.mjs`.

**No tocados:** Cuaderno, huella y persistencia de Prácticas (`ciencia.practica.simulador-quimica`), `rengPoliticaMesa`, los 4 niveles y `ciencia.nivel.simulador-quimica`, progreso de Aprender (`ciencia.aprender.simulador-quimica`) y sus 22 lecciones, licencias, catálogo de peligros, `package*.json`, `src/main`, `shell/`.

**Inventario de lo existente del bloque:** no había ninguna lección ni banco de gases que reutilizar (los 22 temas no tratan gases). Se reutilizan funciones del núcleo (`rengGasIdeal`, `rengDensidadGas`, `RENG_VM_CN`) solo como contraste en pruebas: no tienen vista.

## C. Cobertura

La cobertura real la escribe `node scripts/informe-nivel1.mjs` en `NIVEL-1-ESTADO.md` (no se ha ejecutado). Lo **esperado**, leído de los registros y sin ejecutar: bloque 8 con 20/20 lecciones por capas, 20/20 subtemas con prácticas nuevas (60 prácticas), 0/20 simulaciones, 0 «por revisar», 20 Parcial. Mapa global esperado: 183 confirmados (163 + 20), 149 por revisar (150 − 1), 1 136 sin recurso sobre 1 468; Nivel 1: 130 / 69 / 59; Completado 0, Verificado 0. Si el script dice otra cosa, vale el script.

Pendiente del bloque: atestación (decisión del propietario) y, si se quisiera, una escena de gases (no existe; proponerla exige otra entrega).

## D. Pruebas

**Ninguna se ejecutó.** No hay resultados literales. Qué comprueba cada archivo nuevo:

- `nivel1-b08-gases.test.ts`: para cada una de las 60 prácticas (con `nivel1-comun.ts`), en 300 semillas: reproducibilidad, respuesta finita, ≥ 12 variantes distintas, datos ≥ 2 filas, pistas > 10 caracteres, mensajes > 25, errores separados de la respuesta y entre sí (≥ 0,15, ≥ 1,5 % y ventanas de corrección sin solape), texto sin `NaN`/`undefined`, **segundo método** coincidente (10⁻⁵ relativo); la corrección acepta la respuesta (con y sin unidad y en otra unidad compatible, con «equivale»), identifica cada error típico por su id, señala unidad incompatible, factor 100 como error de unidades, «alto/bajo» fuera de tolerancia, y rechaza `1e400`, `Infinity` y vacío; semillas no válidas lanzan error. Lecciones: una por subtema, título del temario, ids y rutas dentro del límite del shell, capas completas, procedencia sin «fuente verificada». Ejemplos: analítico = segundo método; tercer contraste con funciones previas del núcleo. Paso 0 y cobertura del bloque.
- `nivel1-infra.test.ts`: fábrica, semillas, corrección, progreso y claves, registros.
- `nivel1-informe.test.ts`: documento = informe generado.

**Sabotajes escritos** (cada uno rompe la regla a propósito y comprueba que se detecta):

| Regla | Prueba |
|---|---|
| Corrección | respuesta guardada alterada un 7 % → la correcta deja de aceptarse (`nivel1-infra`) |
| Tolerancias | tolerancia relajada al 5 % aceptaría un error; tolerancia del 60 % impide generar variantes |
| Separación respuesta/errores | error igual a la respuesta, errores con el mismo mensaje y valores pegados → rechazados |
| Semilla no reproducible | práctica con `Math.random` → `rengEsReproducible` = false |
| Migración/claves | claves antiguas byte a byte; escritura en la clave antigua se detecta; progreso con versión, ids, semillas o tamaño inválidos → vacío |
| Vínculo roto | lección o lista de prácticas inexistentes → no existen, sin acciones y «Sin contenido» |
| Criterio de estado relajado | sin exigir atestación, el bloque 8 saldría «Completado»; con los criterios reales, no |
| Contador a mano | quitar una lección cambia el informe; un «20/20» retocado en el documento se detecta |
| Ids/rutas fuera de patrón | id de 37 caracteres: el patrón lo rechaza y el shell anula la subruta; `Gas_Mal` rechazado |

**Correcciones hechas al escribir** (revisión a mano, sin ejecutar): se eligieron intervalos de datos que dejan la respuesta lejos de cero y separada de los errores (por ejemplo, volúmenes en mL en la ley de Charles, temperaturas ≥ 5 °C donde un error usa °C en un denominador, cotas de P en el factor Z); `T₁ ≠ 0 °C` en la razón de energías; se reubicó el caso «aire» del subtema 1 al 12.

## E. Verificación científica

Ecuaciones (todas del modelo de gas ideal salvo el 20): P = F/A; P = ρgh; P₁V₁ = P₂V₂; V/T, P/T y V/n constantes; P₁V₁/T₁ = P₂V₂/T₂; PV = nRT; ρ = PM/(RT); M = mRT/(PV); p_i = x_i·P; Dalton; V_m = RT/P; E_c = (3/2)RT y E = (3/2)PV; u_rms = √(3RT/M), ū = √(8RT/(πM)); Graham r₁/r₂ = √(M₂/M₁); Z = PV/(nRT); van der Waals P = nRT/(V − nb) − an²/V².

**Segundo método de cada ejemplo** (comparación en las pruebas, no ejecutada):

| Subtema | Ejemplo (esperado) | Segundo método |
|---|---|---|
| 1 | 5,00 g/L | densidad por catálogo de unidades × V₁/V₂ |
| 2 | 99,3 kPa | conversión del catálogo (mmHg convencional) |
| 3 | 739,6 mm | proporción con 760 mm ↔ 101,325 kPa |
| 4 | 3,13 atm | RK4 de dP/dV = −P/V |
| 5 | 1,81 L | RK4 de dV/dT = V/T |
| 6 | 233,5 kPa | RK4 de dP/dT = P/T |
| 7 | 3,00 L | RK4 de dV/dn = V/n |
| 8 | 443 mL | dos tramos RK4 (isotérmico + isobárico) |
| 9 | 176,4 kPa | P = N·k_B·T/V |
| 10 | 1,80 g/L | ρ = P·m/(k_B·T) |
| 11 | 49,3 g/mol | m = ρ·k_B·T/P, M = m·N_A |
| 12 | 20 kPa (19,95) | moles en un volumen auxiliar |
| 13 | 9,82 mmol | moles totales × fracción del gas seco |
| 14 | 24,47 L/mol | V = N_A·k_B·T/P |
| 15 | 3,72 kJ | (3/2)k_B·T × N_A |
| 16 | ≈ 515 m/s | (1/2)mu² = (3/2)k_BT |
| 17 | ≈ 76,0 cm | simulación paso a paso de los frentes |
| 18 | ≈ 28,3 s | cociente de velocidades medias absolutas |
| 19 | ≈ 3,98 | cociente de u_rms absolutas |
| 20 | 0,894 | cociente en SI con R = N_A·k_B |

Valores «≈» dependen de las masas de la tabla (sin verificar).

**Segundo método de las prácticas** (en `RENG_SEGUNDOS_B08`): conversiones con el catálogo de unidades (1–3, 13-p1); integración RK4 de las leyes en forma diferencial (4–8); **simulación directa con bisección** para las incógnitas inversas (4-p3, 5-p2, 5-p3, 6-p3, 8-p3, 9-p3, 16-p3, 19-p1, 19-p2, 19-p3); camino SI con N_A y k_B (9–16, 20); moles en volumen auxiliar (7-p3, 12, 13-p3, 15-p3); simulación de frentes (17-p2), cociente de velocidades medias absolutas (17, 18), simulación etapa a etapa (18-p3); van der Waals en SI (20-p2, 20-p3). Ninguno llama a la función de la práctica.

**Fuentes y categorías:** OpenStax *Chemistry 2e*, cap. 9, secciones 9.1–9.6 → **sin verificar** (no abiertas; títulos recordados). R → **bibliográfica declarada** (registrada en el proyecto como CODATA exacta; no reabierta). 1 atm, 760 Torr, ρ(Hg) convencional, g estándar → **bibliográfica declarada** (catálogo de unidades). N_A, k_B → **bibliográfica declarada** (valores exactos del SI tal como están en el proyecto). Composición del aire (21 % O₂) → **bibliográfica declarada** (caso real del proyecto). Masas molares → **sin verificar**. Datos de enunciados, presiones de vapor del agua, densidades de líquidos, parámetros a y b → **parámetro didáctico**. Resultados → **dato calculado**. Ningún dato es «fuente verificada».

**Supuestos y límites** (declarados en cada lección): gas ideal; cantidad fija; procesos lentos; temperaturas en kelvin; 1 mmHg ≈ 1 Torr (diferencia < 2·10⁻⁷); difusión con frentes a rapidez constante (modelo idealizado; la ley de Graham es exacta solo para efusión); efusión molecular ideal; van der Waals también es aproximado y sus parámetros aquí son de un gas hipotético.

## F. No verificado

- **No implementado:** escena o simulación de gases; atestaciones (decisión: NO); renderizado de fórmulas (Química no tiene Temml; propuesta: Temml 0.14.0 como en Física, pendiente de autorización); progreso de lectura de las lecciones N1 (no se guarda).
- **Implementado sin probar:** todo lo de este bloque (código, vistas, pruebas, guion CDP, informe).
- **Probado con limitaciones:** nada (no se ejecutó).
- **Verificado:** nada.

## G. Riesgos

1. **Tipado y pruebas sin ejecutar**: puede haber errores de TypeScript, de importación o de inferencia del genérico de la fábrica. Prioridad al ejecutar.
2. **Generación de variantes**: algunas prácticas rechazan muchas combinaciones (p. ej. 13-p2, 20-p3); si alguna semilla agota los 400 intentos, la prueba lo dirá y habrá que ensanchar intervalos.
3. **Rendimiento de las pruebas**: 60 prácticas × 300 semillas con RK4, bisección y simulaciones; si superan el tiempo límite habrá que reducir pasos o semillas en el segundo método.
4. **Masas de la tabla sin verificar**: afectan a los ejemplos y prácticas con M.
5. **Navegación**: la vista N1 no persiste al recargar (la ruta se reescribe a `aprender`/`practicas`); Escape cierra la vista.
6. **Ventana 1024×640**: el arnés no baja de unos 1012×643 interiores (ya documentado en la Entrega 1).
7. **Tamaño del módulo**: más texto en el fragmento principal.

## H. Próximo bloque recomendado (no ejecutado)

**Bloque 7 · Estequiometría**, según el orden fijado. Tiene 9 confirmados y 6 «por revisar» que apoyan en los temas `mol`, `estequiometria` y `concentracion`; la infraestructura N1 ya existe y el núcleo `nucleo/estequiometria.ts` sirve de contraste. Riesgo propio: convivir con los temas existentes sin duplicarlos (las lecciones N1 se añaden por subtema y los temas siguen).

## Comandos para que los ejecute el propietario (en este orden)

```powershell
cd D:\appescritorio\quimica-para-todos
npm run typecheck
node scripts/informe-nivel1.mjs
npm test
npm run test:exhaustivo
npm run build
node scripts/informe-nivel1.mjs --comprobar
node scripts/verificacion-n1/b08.mjs
$env:N1_SIN_WEBGL='1'; node scripts/verificacion-n1/b08.mjs; Remove-Item Env:N1_SIN_WEBGL
node scripts/verificacion-d/e1.mjs
$env:E1_SIN_WEBGL='1'; node scripts/verificacion-d/e1.mjs; Remove-Item Env:E1_SIN_WEBGL
```

El segundo comando escribe la sección de cobertura de `docs/NIVEL-1-ESTADO.md` (por eso va antes de `npm test`). Los guiones de Electron necesitan `npm run build` antes, usan un perfil temporal (comprueban `RENG_USERDATA`) y fallan si cambia el perfil real `%APPDATA%\Química para Todos` (cierra la app antes de lanzarlos). Las capturas quedan en `docs/capturas-n1-b08/`.

## Anexo · Ejecución (2026-11-18, sesión siguiente)

El propietario autorizó ejecutar. Resultados literales:

- `npm run typecheck`: sin errores.
- `node scripts/informe-nivel1.mjs`: «cobertura regenerada desde los recursos reales».
- `npm test` (1.ª vez): `Tests  2 failed | 2179 passed (2181)`. Fallos: `n1-b8-s11-p1 semilla 0 pista: expected 10 to be greater than 10` y `ej-gas-masa-molar: expected 10 to be greater than 10` (la pista «M = m / n.» tiene 10 caracteres y la regla exige más de 10). Corrección: «M = m / n, en g/mol.» en `practicas-n1/b08-s11-s15.ts` y `aprender/n1/gases/ejemplos.ts`.
- `npm test` (tras corregir): `Test Files  70 passed (70)` · `Tests  2181 passed (2181)`.
- `npm run test:exhaustivo`: `Tests  1 passed (1)`. `npm run build`: compilado. `node scripts/informe-nivel1.mjs --comprobar`: «la cobertura coincide con los recursos reales».
- `node scripts/verificacion-n1/b08.mjs` con y sin WebGL: `TODO OK`; perfil real con 1462 archivos antes y después. `node scripts/verificacion-d/e1.mjs` con y sin WebGL: `TODO OK`.

Las cifras «esperadas» de §C coinciden con las generadas (bloque 8: 20/20 lecciones, 20/20 prácticas nuevas (60), 0/20 simulaciones, 0 por revisar, 20 Parcial; Nivel 1: Parcial 130, Sin contenido 128). Después, la Entrega 0 migró las ecuaciones de este bloque a TeX (ver `ENTREGA-0-ECUACIONES-Y-KITS.md`) y se repitieron los dos guiones con el mismo resultado. §F «Implementado sin probar» queda superado por esta ejecución salvo lo que no cubren las pruebas (revisión docente, lector de pantalla).
