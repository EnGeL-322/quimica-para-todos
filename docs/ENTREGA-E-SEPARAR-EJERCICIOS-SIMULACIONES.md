# Entrega E · Separar ejercicios por niveles de las simulaciones (Química)

Fecha: 2026-11-16. Alcance: `quimica-para-todos`. Sin commits. Física espera el OK del propietario.

## Paso 0 · Diagnóstico (hecho antes de tocar código)

Rutas relativas a `src/renderer/modules/simulador-quimica/`.

### A. Dónde se mezclan simulaciones y ejercicios/niveles

| # | Punto | Archivo:línea | Qué hace |
|---|---|---|---|
| 1 | Botón «Simular este ejercicio» | `modos/VistaEjercicios.tsx:379-381` (se ofrece solo tras revisar: `:371`) | Llama a `onSimular` con `{escena, entradas}` derivados por `rengSimulacionDeEjercicio` (`practica/modelosSimulacion.ts:705`). |
| 2 | Transferencia con identidad del ejercicio | `View.tsx:194-199`, `:62-67` | Guarda `{n, escena, entradas, ejercicioId}` en `sessionStorage` (`quimica.transferencia-activa`, `practica/transferenciaGuardada.ts`) y la hace «vigente» solo mientras el ejercicio actual sea el mismo (`rengTransferenciaVigente`). |
| 3 | Restauración desde el Cuaderno | `View.tsx:59-65`, `practica/transferenciaGuardada.ts:56` | Si hay una petición «Reabrir y repetir» pendiente de esa escena y una transferencia guardada, restaura el «vengo de un ejercicio». Lee `cuaderno.reabrir` (`lib/cuaderno/reapertura.ts:rengVerReapertura`) sin consumirla. |
| 4 | Botón y aviso de «volver» dentro de la escena | `modos/Simulaciones.tsx:126-130` (botón), `:146` (aviso «Esta simulación viene de un ejercicio de práctica…» / «Datos copiados del ejercicio…»), `:132-140` (aviso «No se pudieron copiar los datos del ejercicio») | La escena enseña el estado del intento. |
| 5 | Textos de ejercicio dentro de escenas | `modos/simulacion/EscenaCinetica.tsx:157` («Datos copiados del ejercicio…»), `EscenaDilucion.tsx:174` («cargar los datos de un ejercicio en esta mesa») | |
| 6 | Dependencia del nivel de práctica | `View.tsx:229` (`RengNivelPracticaContext.Provider value={rengNivel}`), selector `q-nivel-global` en `View.tsx:234` (visible en Simulación y Casos); atajos 1–4/B/A en `View.tsx:~150` | El nivel elegido en Prácticas gobierna los controles de las escenas (ver B). |
| 7 | Predicción que bloquea «Calcular» | `EscenaColorimetria.tsx:68,141-170`, `EscenaSolubilidad.tsx:58,93-123`, `EscenaElectroquimica.tsx:92,137-166`, `EscenaIsomeros.tsx:83,132-156` | `rengFaltaPrediccion` deshabilita «Calcular» salvo que se marque «Prefiero ver el resultado sin predecir» (apagado por defecto → la predicción es **obligatoria por defecto**). Dilución (`EscenaDilucion.tsx:332-335`) ya ofrece «Ver el resultado sin predecir», aunque el paso 4 muestra la predicción por defecto. |
| 8 | Contadores del temario | `temario/catalogo.ts:57-70`, `modos/Temario.tsx:121,217,270` | Solo cuentan «subtemas con algún recurso confirmado» (lección, práctica, simulación o consulta juntos). No hay desglose por tipo; un recurso `tema` aporta `aprender`+`practica` y la escena es un recurso aparte (`temario/recursos.ts:56-66`), pero la interfaz no lo separa. |
| 9 | Acción «Simular» colgada del tema | `temario/recursos.ts:111-112`, `modos/Catalogo.tsx:28-31` | El tema ofrece «Practicar» y «Simular» juntos; es un enlace de ida (no pasa estado). |
| 10 | Rutas y menú | `navegacion.ts`, `menu.ts` | Ya son destinos separados: `practicas` y `simulacion/<escena>`. Sin acoplamiento. |

### B. Qué cambia hoy con el nivel dentro de las escenas

Todo sale de `useRengNivelPractica()` + `rengNivelPermite` (preuniversitario < universitario < químico < científico):

- `modos/simulacion/comunes.tsx:57-61` (`RengNum`): selector de **unidades alternas** desde Universitario.
- `comunes.tsx:252-325` (`RengPanelModelo`): secciones del panel «Modelo, dominio y supuestos» desde Universitario, Químico y Científico (ficha de modelo, fuentes y límites).
- `comunes.tsx:425-431` (`RengDiagnosticos`): los diagnósticos de severidad `info` y el «dentro del dominio» solo desde Químico.
- `comunes.tsx:444-446` (`RengComparaCasos`): comparar casos desde Universitario.
- `comunes.tsx:512-523` (`RengSensibilidadPanel`): sensibilidad e incertidumbre desde Científico.
- `EscenaIsomeros.tsx:57-60,232-257`: tres bloques propios según Universitario/Químico/Científico.
- `quimica.css:130`: `data-nivel` solo afecta al tamaño de una tarjeta de la **Mesa** (no a escenas).

Es decir, un estudiante en Preuniversitario **no ve** diagnósticos informativos, comparación de casos, sensibilidad ni parte de la ficha del modelo en ninguna simulación. Eso recorta rigor visible.

**Propuesta.** Las simulaciones muestran siempre todo lo anterior (equivalente a Científico), con el nivel de práctica fuera de su alcance: se aísla con el mismo contexto que ya usan (`RengNivelPracticaContext`) fijado a `cientifico` dentro del destino Simulación. No se quita ni se mueve nada: el rigor (diagnósticos, ficha de modelo, fuentes) pasa a estar disponible para todos y los paneles avanzados ya están en `<details>`. El selector de nivel deja de mostrarse en Simulación (se conserva en Casos). **Mesa molecular** (Básico/Avanzado, `View.tsx:~312`) queda fuera de este encargo: no es una escena ligada a ejercicios; si quieres liberarla, es una segunda decisión.

### C. De qué depende cada pieza guardada

| Pieza | ¿Depende del enlace ejercicio→simulación? | Evidencia |
|---|---|---|
| **Cuaderno / corridas guardadas** | **No.** Una corrida guarda `origen: {modulo, sub: escena, entradas}` (`practica/corridaEscena.ts:159,280`) y no tiene ningún campo de ejercicio. «Reabrir y repetir» usa `cuaderno.reabrir` (`lib/cuaderno/reapertura.ts`, `laboratorio/cuaderno/Cuaderno.tsx:81-82`) y navega a `simulador-quimica/<escena>`. | Lectura de esos archivos; no se toca el esquema. |
| **Huella de las prácticas (3840 casos)** | **No directamente.** `rengHuellaEjercicio` = hash de `JSON.stringify(RengEjercicio)` (`practica/banco.ts:178`). Algunos ejercicios llevan el campo `simulacion` (p. ej. `practica/familias/analitica.ts:42,65,96,119,147`), así que **ese campo forma parte de la huella: no se toca**. La rama derivada (`rengSimulacionDeEjercicio`, calibración y dilución) es pura y no entra en la huella. | Por eso el botón sigue usando `rengSimulacionDeEjercicio` sin modificar `RengEjercicio`. |
| **Progresos guardados** (`logros`, intentos, borrador) | **No.** Se indexan por `ejercicioId`/huella (`practica/estado.ts`, `persistencia.ts`); ninguna clave referencia simulaciones. | |
| **«Reabrir y repetir»** | **Solo de forma lateral**: la restauración «vengo de un ejercicio» (punto 3) lee la petición pendiente sin consumirla. Es una función añadida (D3/D4b0), no parte de la reapertura. | `View.tsx:62-64`. |
| `sessionStorage` `quimica.transferencia-activa` | Es lo único «guardado» del enlace; vive solo en la sesión y no es un esquema persistente. | |

**Conclusión del diagnóstico: separar no exige tocar ningún esquema guardado, la huella ni la identidad de las prácticas.** No hay que parar.

### D. Decisión sobre el enlace

**Se conserva como botón de ida sin estado**, renombrado «Probarlo en el laboratorio», y se elimina todo lo demás:

- Se abre la escena con los **valores** del ejercicio como valores iniciales editables (dato numérico, no estado del intento). Evidencia: el botón solo aparece tras comprobar o ver la resolución (no adelanta la respuesta), el cálculo es una función pura ya cubierta por pruebas (D4a/D4c), y no toca la identidad del ejercicio.
- La escena **no recibe** `ejercicioId`, no guarda nada en `sessionStorage`, no muestra aviso de ejercicio ni botón «Volver a la práctica» y no consulta la petición de reapertura.
- «Volver» es navegación normal: el destino «Prácticas por nivel» conserva el ejercicio, la respuesta y las pistas porque ese estado vive en el módulo de prácticas, no en la escena.
- Alternativa descartada: eliminar el botón. Perdería una ayuda útil sin ganar independencia, porque la independencia se consigue quitando el estado, no el enlace.

## Paso 1 · Implementación (hecha)

### Cambios

| Qué | Dónde |
|---|---|
| La transferencia ya no se guarda ni lleva el identificador del ejercicio; es un estado efímero de la vista `{n, escena, entradas}` que solo da valores iniciales. Se eliminó `practica/transferenciaGuardada.ts` y la lectura de la petición de reapertura. | `View.tsx` (`rengProbarEnLaboratorio`), borrado `practica/transferenciaGuardada.ts` |
| La escena no recibe `ejercicioId`, no muestra «Volver a la práctica», ni «Esta simulación viene de un ejercicio…», ni «Datos copiados del ejercicio», ni «No se pudieron copiar los datos del ejercicio». | `modos/Simulaciones.tsx`, `modos/simulacion/EscenaCinetica.tsx:157`, `EscenaDilucion.tsx:174` |
| El destino Simulación se aísla del nivel de práctica: `RengNivelPracticaContext` fijado a `cientifico` (todo el rigor visible: ficha de modelo, diagnósticos informativos, comparar casos, sensibilidad, unidades alternas, bloques de Isómeros) y el selector de nivel ya no aparece en Simulación (queda en Casos). | `View.tsx` (`RENG_NIVEL_SIMULACION`) |
| Predicción previa **opcional y apagada por defecto**: casilla «Quiero predecir antes de calcular (opcional)»; los campos de predicción solo aparecen si se activa y solo entonces «Calcular» los exige. Colorimetría, Solubilidad, Electroquímica, Isómeros y Dilución (paso 4: un único «Ver el resultado»). Guías y avisos reescritos sin «predice» como paso previo. | `modos/simulacion/Escena*.tsx`, `modos/Simulaciones.tsx` |
| Botón del ejercicio: «Probarlo en el laboratorio» (de ida, sin estado). | `modos/VistaEjercicios.tsx:379` |
| Temario: contadores por tipo (Aprender · Prácticas · Simulaciones) en nivel, bloque y resumen general, derivados de `evaluacion.capas`, sin tocar ninguna regla de cobertura. | `temario/catalogo.ts` (`porCapa`, `rengTextoCapas`), `modos/Temario.tsx` |

**No se tocó:** el esquema del Cuaderno, `corridaEscena.ts`, `RengEjercicio` (ni el campo `simulacion`), la huella de las prácticas, `fisica.*`/`quimica.*` guardados, `temario/estado.ts` (reglas de cobertura), ni `lib/cuaderno/reapertura.ts`.

### Pruebas que cambiaron a propósito (y por qué)

| Prueba | Cambio |
|---|---|
| `entrega-d4b0-transferencia.test.ts` | Reescrita: ya no prueba restaurar la transferencia (la función se eliminó). Se conservan las 3 pruebas de reapertura (ver/tomar, petición dañada, otra escena/módulo) y se añaden 5 que fijan la separación (sin módulo ni clave de transferencia, sin «Volver»/avisos de ejercicio en escenas, nivel aislado, botón de ida) con sabotaje del patrón. |
| `entrega-d3-dilucion.test.ts` | Se retiró el bloque «D3 · la transferencia … sobrevive a ir al Cuaderno y volver» (3 pruebas de la persistencia eliminada). El resto (derivación de dilución desde el ejercicio) se conserva. |
| `entrega-a-navegacion.test.ts` | El selector global de nivel ya no aparece en Simulación: `rengDestino === 'casos' &&`. |
| `practica-estado.test.ts` | El texto del botón: «Probarlo en el laboratorio». |
| `practica-identidad.test.ts` | «Volver a la práctica» sigue exigido en Lección y Mesa y **ahora se exige su ausencia** en `Simulaciones.tsx`. |

Nuevas: `entrega-e-simulaciones-libres.test.ts` (9 pruebas: predicción opcional por defecto en las cinco escenas, textos, contadores por tipo contra recuento independiente en todos los bloques, sabotajes, reglas de cobertura intactas). **No se debilitó ninguna prueba**: ninguna otra cambió. Quedan 1880 pruebas (antes 1872).

### Verificación

- `npm run typecheck`: sin errores. `npm test`: `Test Files 67 passed (67)`, `Tests 1880 passed (1880)`. `npm run test:exhaustivo`: `Tests 1 passed (1)`. `npm run build`: correcto.
- Electron, guion nuevo `scripts/verificacion-e/e1.mjs` (perfil temporal; `RENG_USERDATA` comprobado **antes** de escribir; el perfil real `%APPDATA%\Química para Todos` se midió antes y después: 980 archivos, misma marca de tiempo):
  - **Con WebGL y sin WebGL: 151 comprobaciones en cada modo, «Todo en orden».**
  - A) Las 11 escenas (10 del marco + Mesa libre) se abren directamente desde su destino con nivel Preuniversitario, sin selector de nivel, sin «Volver», sin avisos de ejercicio, sin transferencia en `sessionStorage`, y se calculan sin predecir.
  - B) Colorimetría, Solubilidad, Electroquímica, Isómeros y Dilución: la predicción está apagada, «Calcular» habilitado; al activarla aparece y se exige; al desactivarla vuelve.
  - C) **Independencia del nivel:** para cada escena, la «firma» de controles (campos, botones, paneles plegables, paneles de diagnóstico/sensibilidad) es idéntica con Preuniversitario y con Científico; con Preuniversitario siguen visibles la ficha del modelo y la sensibilidad.
  - D) Ejercicio → «Probarlo en el laboratorio» → escena sin vínculo con el ejercicio, con los valores del ejercicio editables → «Prácticas por nivel» → «Práctica en curso … «2» · Continuar práctica» → el mismo ejercicio con la respuesta.
  - E) Guardar una corrida, recargar la aplicación y «Reabrir y repetir»: vuelve a la escena en pausa en el instante guardado, sin nada de ejercicio.
  - F) 11 escenas × Día/Noche × 1360×860 y 1024×680 con la sonda de contraste y desbordes (contraste < 4,5:1: 0; desborde 0; fuera de vista 0; campos recortados 0) y ventana nunca 0×0.
  - Consola: 0 mensajes con WebGL; sin WebGL, 412 mensajes, todos del contexto WebGL de la Mesa molecular (montada oculta en toda ruta de Química; es el comportamiento ya conocido en D4.5, no de este cambio).
- **Sabotaje del guion:** con el contexto de nivel reconectado al nivel de práctica, el guion falla en 11 comprobaciones (10 escenas con firma distinta y la ficha/sensibilidad que desaparece con Preuniversitario). Esto también es la evidencia de que **antes** del cambio las 10 escenas mostraban controles distintos según el nivel.

### Decisión de «volver» (efecto visible)

Sin el botón dentro de la escena, volver se hace por el destino «Prácticas por nivel». Ese destino entra siempre por la lista de temas y muestra el intento guardado como «Práctica en curso … Continuar práctica» (comportamiento previo). Es **un clic más** que antes («Volver a la práctica» abría el ejercicio directo). Si prefieres evitarlo, la alternativa que no acopla la escena es recordar la última vista de Prácticas al volver; no la implementé porque cambia el comportamiento de entrada de ese destino.

### Lo que no pude verificar ni queda pendiente

- **Corrida creada con la versión anterior:** no existe en este equipo ninguna corrida guardada antes del cambio; verifiqué una guardada con la versión nueva. El esquema y `corridaEscena.ts` no cambiaron, y las pruebas del Cuaderno (incluida la fixture de proyecto original) siguen en verde, pero no es la misma prueba que reabrir un archivo real antiguo.
- **Mesa molecular:** su Básico/Avanzado sigue ligado al nivel de práctica (fuera del alcance de «simulaciones»). Te lo señalo por si quieres liberarla igual.
- **Catálogo:** la tarjeta de tema conserva su botón «Simular» (enlace de ida del tema a la escena; no pasa estado). No lo cambié.
- **Guiones antiguos `scripts/verificacion-d/d3, d4a–d4d`** asumen la predicción obligatoria, «Volver a la práctica» y «Simular este ejercicio»; ya no valen en esos pasos y **no los actualicé** (los sustituye `verificacion-e/e1.mjs`). Eliminé `d4b0.mjs`, que solo comprobaba la transferencia retirada.
- No probé lector de pantalla ni la lectura humana de los nuevos textos; no hice capturas nuevas.
- Física **no se tocó**: espero tu OK.
