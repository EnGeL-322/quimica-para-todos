# Química · Entrega 0 · Ecuaciones (Temml 0.14.0), kit de figuras y kit de escenas N1

Fecha: 2026-11-18. Modo: **escribir y ejecutar**. Autorización del propietario: ECUACIONES = AUTORIZO; ATESTACIÓN = NO. Antes de empezar se ejecutó el bloque 8 (que estaba escrito sin ejecutar) y se corrigió lo que falló (§D.1).

## A. Resumen

1. **Bloque 8 ejecutado por primera vez.** Tipado en verde; `npm test` dio 2 fallos (dos pistas de exactamente 10 caracteres, la regla exige más); corregidas. Después: pruebas, exhaustivo, compilación, informe de cobertura y los cuatro guiones de Electron en verde.
2. **Temml 0.14.0** añadido como en Física (versión exacta, dependencia de producción, mismo `integrity` en el lock). Su compilación ESM **ya trae mhchem 3.3.0** (`\ce`, `\pu`): comprobado renderizando reacciones, iones y unidades. Esa parte de mhchem está bajo **Apache 2.0** (cabecera dentro de `temml/dist/temml.mjs`), no solo MIT: se registró en `licencias/` con el texto completo de la licencia.
3. **Componente de ecuación y de fórmula química** (`RengEcuacionTex`, `RengFormulaQuimica`): Temml se carga **de forma diferida** (fragmento propio de 367 kB, fuera del principal); mientras carga, si el TeX falla o en «modo texto» se ve el **texto legible** de la ecuación, que además siempre está en el DOM para lectores de pantalla (el MathML lleva `aria-hidden`). Sin red, sin `innerHTML`, `trust: false`.
4. **Migración del bloque 8:** las 48 ecuaciones de las 20 lecciones tienen ahora TeX, se dibujan en MathML, van **numeradas** (8.s.n) con ancla propia, y la lección tiene un botón «Ver ecuaciones como texto». Los textos anteriores no cambiaron (huella SHA-256 idéntica) y una prueba compara, ecuación por ecuación, los símbolos del MathML con los del texto.
5. **Kit de figuras** (geometría pura + componentes SVG con `<figure>`, pie numerado, `role="img"`, título y texto alternativo; series distinguidas por trazo y marcador, no solo por color): ejes con marcas «bonitas», diagrama de niveles sin solapes de etiquetas y flechas de reacción (directa, equilibrio, resonancia).
6. **Kit de escenas N1** (no existía uno independiente del Cuaderno): contrato de modelo puro, utilidades puras (lectura, validación, comprobación por rejilla con sabotaje), vista que solo dibuja (controles con unidad, iniciar/pausar, «Reiniciar (t = 0)», lecturas con unidad, «En palabras» copiable, gráfica, comparación de casos, ficha con ecuaciones, supuestos, límites, condiciones iniciales y procedencia). Registro vacío: cada bloque añadirá una línea.

## B. Cambios

**Nuevos**

| Archivo | Qué es |
|---|---|
| `src/renderer/lib/ecuaciones/validarTex.ts` | Lógica pura: opciones seguras de Temml, `rengValidarTex` (motivos estables), `rengValidarFormulaQuimica`, `rengTextoDeMathml`. |
| `src/renderer/lib/ecuaciones/formula.ts` | `rengTexDeFormulaQuimica`: envuelve en `\ce{}` solo fórmulas sin `\` ni llaves (no admite órdenes TeX). Sin Temml. |
| `src/renderer/lib/ecuaciones/dibujar.ts` | Dibujo con `temml.render` (carga diferida); devuelve `mathml` o `reserva`. |
| `src/renderer/lib/ecuaciones/temml-local.css` | Copia del CSS de Temml sin la fuente `Temml.woff2` (licencia no verificada); una prueba repite la derivación. Idéntica a la de Física salvo la cabecera. |
| `modules/simulador-quimica/vista/tex/EcuacionTex.tsx`, `ecuacion-tex.css` | Componentes de ecuación y fórmula química. Las ecuaciones de bloque largas se vuelven enfocables y desplazables. |
| `modules/simulador-quimica/aprender/figuras/geometria.ts` | Geometría pura del kit de figuras. |
| `modules/simulador-quimica/vista/figuras/Figuras.tsx`, `figuras.css` | `RengFigura`, `RengEjesFigura`, `RengDiagramaNiveles`, `RengFlechaReaccion`. |
| `modules/simulador-quimica/escenas-n1/tipos.ts`, `kit.ts`, `registro.ts` | Contrato, utilidades puras y registro (vacío) de escenas N1. |
| `modules/simulador-quimica/vista/EscenaN1.tsx`, `escena-n1.css` | Vista genérica de escena N1. |
| `src/renderer/pruebas/PruebaKitQuimica.tsx`, `modeloDemo.ts` | Página interna y modelo de demostración (A → B de primer orden, fuera del temario) **solo** para la compilación `--mode pruebas`. Comprobado: sus textos no aparecen en `out/renderer` de la compilación normal. |
| `licencias/LICENCIA-APACHE-2.0.txt` | Texto de la Licencia Apache 2.0 (términos), copiado de `node_modules/detect-libc/LICENSE` y comparado con la copia de `exponential-backoff` (idénticos salvo una línea en blanco inicial). No comparado con la página oficial de Apache. |
| `tests/quimica/entrega-0-ecuaciones.test.ts` (16), `entrega-0-figuras.test.ts` (10), `entrega-0-escenas-n1.test.ts` (9) | 35 pruebas nuevas con sabotajes. |
| `scripts/verificacion-n1/entrega0.mjs` | Guion de Electron (app real + compilación de pruebas), con `--sabotaje`. Capturas en `docs/capturas-entrega-0/`. |

**Modificados**

| Archivo | Cambio |
|---|---|
| `package.json`, `package-lock.json` | Solo `"temml": "0.14.0"` (autorizado para la Entrega 0). Comprobado con `diff` contra copias previas: nada más cambió. |
| `src/renderer/main.tsx` | Rama `#/prueba-kit` solo si `import.meta.env.MODE === 'pruebas'` (igual que Física). |
| `aprender/n1/tipos.ts`, `aprender/n1/constructor.ts` | `RengEcuacionN1.tex: string \| null`; la especificación admite un cuarto elemento opcional (TeX). |
| `aprender/n1/gases/lecciones.ts` | Cuarto elemento `String.raw` en las 48 ecuaciones. Comprobado con `diff`: quitando ese elemento el archivo es idéntico al anterior. |
| `aprender/n1/gases/ejemplos.ts`, `practicas-n1/b08-s11-s15.ts` | Pista «M = m / n.» (10 caracteres) → «M = m / n, en g/mol.» (corrección del bloque 8). |
| `vista/LeccionN1.tsx` | Ecuaciones con `RengEcuacionTex`, numeradas, y botón «Ver ecuaciones como texto» (`aria-pressed`). |
| `scripts/generar-avisos.mjs` | Origen de Temml y su parte mhchem; anexa la Licencia Apache 2.0. `licencias/AVISOS-TERCEROS.txt` regenerado con `npm run avisos`. |
| `licencias/PENDIENTES-ANTES-DE-DISTRIBUIR.md` | Fila 12 (Temml + mhchem). |
| `scripts/verificacion-d/cdp.mjs` | `abrirApp` acepta un cuarto parámetro opcional (carpeta de la app; por defecto la del proyecto). Los 19 usos existentes no cambian. |

**Reutilizado:** integración de Temml de Física (opciones, derivación del CSS, patrón de la página de pruebas), `rengRK4` de `aprender/n1/numericos.ts` como segundo método de la escena de demostración, procedencias N1, `cdp.mjs`, `sonda.mjs`. **No tocado:** Cuaderno, `rengPoliticaMesa`, niveles de práctica, progreso de Aprender, catálogo de peligros, `src/main`, `shell/`, `temario/datos.generado.ts`, Física.

## C. Cobertura

No cambia (la Entrega 0 no añade contenido). Generada por `node scripts/informe-nivel1.mjs` y comprobada con `--comprobar`: Nivel 1 = 258 subtemas, 20 con lección por capas, 20 con prácticas nuevas (60), Parcial 130, Sin contenido 128; bloque 8 = 20/20 lecciones, 20/20 prácticas, 0/20 simulaciones, 0 por revisar, 20 Parcial. Completado 0, Verificado 0.

## D. Pruebas (ejecutadas el 2026-11-18)

### D.1 Bloque 8 (antes de la Entrega 0)

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | sin errores |
| `node scripts/informe-nivel1.mjs` | `NIVEL-1-ESTADO: cobertura regenerada desde los recursos reales` |
| `npm test` (1.ª vez) | `Tests  2 failed \| 2179 passed (2181)`: `n1-b8-s11-p1 semilla 0 pista: expected 10 to be greater than 10` y `ej-gas-masa-molar: expected 10 to be greater than 10` |
| `npm test` (tras corregir las dos pistas) | `Test Files  70 passed (70)` · `Tests  2181 passed (2181)` |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built` |
| `node scripts/informe-nivel1.mjs --comprobar` | `NIVEL-1-ESTADO: la cobertura coincide con los recursos reales` |
| `node scripts/verificacion-n1/b08.mjs` (con y sin WebGL) | `TODO OK` las dos veces; perfil real: 1462 archivos antes y después |
| `node scripts/verificacion-d/e1.mjs` (con y sin WebGL) | `TODO OK` las dos veces |

### D.2 Entrega 0

| Comando | Resultado literal |
|---|---|
| `npm run typecheck` | sin errores (0 `error TS`) |
| `npm test` | `Test Files  73 passed (73)` · `Tests  2216 passed (2216)` (2181 + 35 nuevas) |
| `npm run test:exhaustivo` | `Tests  1 passed (1)` |
| `npm run build` | `✓ built`; Temml en `dibujar-*.js` (367,27 kB) y `dibujar-*.css` (9,23 kB), fuera de `index-*.js`; ningún `.woff2` de Temml; la página interna no está en `out/renderer` |
| `npm run avisos` | `licencias/AVISOS-TERCEROS.txt: openchemlib@9.25.2, react@19.3.1, react-dom@19.3.1, scheduler@0.28.0, temml@0.14.0, three@0.187.0` |
| `node scripts/informe-nivel1.mjs --comprobar` | `la cobertura coincide con los recursos reales` |
| `node scripts/verificacion-n1/entrega0.mjs` | `TODO OK` (75 comprobaciones) |
| `$env:E0_SIN_WEBGL='1'; node scripts/verificacion-n1/entrega0.mjs` | `TODO OK` (75 comprobaciones) |
| `node scripts/verificacion-n1/entrega0.mjs --sabotaje` | `OK el guion detecta la escena rota (8 problemas)` · `TODO OK` |
| `node scripts/verificacion-n1/b08.mjs` (con y sin WebGL) y `node scripts/verificacion-d/e1.mjs` (con y sin WebGL), repetidos tras los cambios | `TODO OK` las cuatro veces |

**Qué comprueba el guion `entrega0.mjs`.** Parte A (app real): las 20 lecciones del bloque 8 muestran 48 ecuaciones, todas MathML con tamaño > 0, sin marca de error, numeradas (8.s.n), con su texto legible presente para el lector y el MathML oculto al lector; fuente usada «Cambria Math»; el botón de modo texto se activa con Intro, anuncia `aria-pressed`, deja el texto visible y copiable y vuelve con Intro; foco visible; matriz 1280×720 y 1024×640 × Día/Noche en tres lecciones (contraste ≥ 4,5:1 incluido el texto del MathML, sin desbordes, sin controles fuera, ecuaciones largas desplazables); consola vacía; perfil real intacto. Parte B (compilación `--mode pruebas` en carpeta temporal fuera del repositorio): ecuaciones, reacción con `\ce` (contiene NH y ⇌), TeX roto → texto legible, fórmula con órdenes no admitidas → rechazada con texto legible, ecuación larga enfocable y desplazada con las flechas del teclado; dos figuras con tamaño, `role="img"`, título, texto alternativo y pie; tres flechas con nombre accesible; escena: empieza en t = 0, lecturas con unidad, «En palabras», Iniciar hace avanzar t y bajar [A], Reiniciar vuelve a t = 0, cambiar k a 0,2 1/s da vida media 3,47 s (= ln 2/0,2), gráfica dibujada, dos casos comparados; matriz visual de las tres secciones; consola vacía. Con `--sabotaje` abre la escena con el modelo roto y exige que el mismo comprobador falle.

**Ajuste del guion durante la ejecución (declarado):** la primera ejecución dio 4 fallos de contraste, todos en `<title>` y `<desc>` de los SVG en modo Noche. Esos elementos no se pintan nunca (solo dan el nombre accesible), así que la sonda los excluye ahora; el resto del texto SVG se mide con su `fill`. No se relajó ningún umbral.

**Sabotajes de pruebas unitarias:** TeX roto y orden inexistente rechazados; numerador/denominador intercambiados y subíndices cambiados detectados por la comparación TeX-texto; CSS original con la fuente ≠ derivación; disponedor de niveles que no separa etiquetas → «etiquetas solapadas»; serie con NaN → error; escena con NaN, con k duplicada (falla contra RK4), con una magnitud ausente, sin «En palabras» y que lanza excepción → detectadas; contrato sin límites, sin unidad, con id fuera de patrón, intervalo vacío, escena temporal sin t o sin procedencia → rechazado; la vista con el modelo roto avisa y no dibuja gráfica ni «NaN».

## E. Verificación científica

- **Ecuaciones del bloque 8:** mismas que antes (huella de los textos idéntica). El TeX se contrastó con el texto: tras normalizar subíndices y quitar espacios, paréntesis, barras, puntos de multiplicación y raíces, la secuencia de símbolos del MathML coincide con la del texto en las 48 (prueba con sabotajes). Esto comprueba símbolos y orden, no la estructura completa de la fracción más allá de numerador-antes-que-denominador.
- **Resultados:** no cambia ningún número; las 2181 pruebas previas siguen pasando.
- **Escena de demostración:** [A] = [A]₀·e^(−kt) comprobada contra la integración RK4 de d[A]/dt = −k[A] (4000 pasos, tolerancia 10⁻⁸·[A]₀ absoluta) en 64 combinaciones de parámetros y tiempos (4 valores de [A]₀ × 4 de k × 4 instantes); conservación [A] + [B] = [A]₀ (10⁻¹²) y t½·k = ln 2 (10⁻¹²). Es un modelo idealizado sin sustancia real (procedencia: «ejemplo idealizado» y «dato calculado»); no es contenido del temario.
- **Fuentes:** licencia MIT de Temml y cabecera Apache 2.0 de mhchem leídas en los archivos del paquete instalado (`node_modules/temml/LICENSE`, `dist/temml.mjs`). No se consultó ninguna fuente externa.

## F. No verificado

- **No implementado:** ruta de la app para abrir una escena N1 desde «Explorar» (no hay ninguna escena aún; se conectará con la primera que se escriba); botón «Copiar TeX»; migración a TeX de los pasos de los ejemplos y de los enunciados (son texto calculado; siguen en Unicode); figuras dentro de las lecciones del bloque 8.
- **Implementado sin probar:** botón «Copiar el texto» de «En palabras» (usa el portapapeles; el guion no lo pulsa para no tocar el portapapeles del usuario).
- **Probado con limitaciones:** accesibilidad comprobada estructuralmente (texto legible en el DOM, `aria-hidden` en MathML, `role`, `aria-label`, foco); **ningún lector de pantalla real** (NVDA, Narrador) se probó. Fuente: solo Windows 11 con Cambria Math. La ventana de «1024×640» es 1012×643 interior (límite ya conocido del arnés).
- **Verificado:** lo listado en §D con su salida literal.

## G. Riesgos

1. **mhchem bajo Apache 2.0:** la distribución debe llevar `licencias/` completa (ya lo hace `extraFiles` del instalador; no se probó un instalador). Física usa el mismo paquete y su `AVISOS-TERCEROS.txt` **no menciona** la parte Apache 2.0 de mhchem: hallazgo que afecta a Física (solo lectura en esta sesión; no se tocó).
2. **Campos de número del navegador** muestran el punto decimal («0.1») aunque la app escribe con coma; es el comportamiento del control nativo.
3. **El bloque 8 no sigue todavía la estructura «libro» del prompt maestro** (§3.1): le faltan «Por qué importa», 2 ejemplos por subtema, figuras, glosario, resumen, 3 preguntas conceptuales con retroalimentación y la conexión anterior/siguiente; y no tiene portada ni cierre de capítulo (§5). Para el bloque 7 hay que ampliar el contrato de lección; queda por decidir si se actualiza también el bloque 8.
4. El componente de ecuaciones depende de la carga diferida: si el fragmento de Temml no cargara, el estudiante vería el texto Unicode (comprobado con el modo texto y con TeX roto, no con un fallo real de carga).

## H. Próximo paso recomendado (no ejecutado)

**Bloque 7 · Estequiometría**, según el orden fijado, empezando por su Paso 0. Antes conviene decidir dos cosas: (1) el contrato ampliado de lección «libro» (§3.1) que usará el bloque 7 y si se aplica también al bloque 8; (2) que la ruta para abrir escenas N1 se cablee con la primera escena real.

## Comandos (orden usado)

```powershell
cd D:\appescritorio\quimica-para-todos
npm run typecheck
npm test
npm run test:exhaustivo
npm run build
npm run avisos
node scripts/informe-nivel1.mjs --comprobar
node scripts/verificacion-n1/entrega0.mjs
$env:E0_SIN_WEBGL='1'; node scripts/verificacion-n1/entrega0.mjs; Remove-Item Env:E0_SIN_WEBGL
node scripts/verificacion-n1/entrega0.mjs --sabotaje
node scripts/verificacion-n1/b08.mjs
node scripts/verificacion-d/e1.mjs
```
