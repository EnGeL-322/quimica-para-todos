# Entrega C · Prácticas por nivel

Encargo «Química para Todos · Entrega C — Prácticas por nivel», 2026-11-15. Sin commit; se conservan los cambios locales, las 22 lecciones, las rutas antiguas, la preferencia de nivel y los instaladores. Continúa `docs/ENTREGA-A-NAVEGACION.md` y `docs/ENTREGA-B-APRENDER.md`.

## Qué se implementó

### C1 · Banco ampliado: 10 tipos nuevos, 45 variantes

Lagunas detectadas en el banco anterior: no había ejercicios de **diagnóstico** (unidades, carga, balance), de **leer una gráfica o una tabla**, de **decidir si los datos bastan**, de **comparar dos estructuras** ni de **elegir un modelo con observaciones**. Los tipos nuevos cubren esas lagunas; cada uno se integra en un tema existente y conserva su lección y sus accesos.

| Rama | Tipo (familia) | Tema | Niveles | Variantes |
|---|---|---|---|---|
| General | Error de unidades en una preparación (`general.unidades-preparacion`) | Concentración y dilución | Preuniv., Univ. | 4: mg como g · mL como L · mmol/L como mol/L · µL como mL |
| General | Reactivo limitante a partir de una tabla (`general.limitante-tabla`) | Estequiometría | Univ., Químico | 4: tabla de moles · diagrama de partículas · masa sobrante · moles sobrantes en disoluciones |
| Inorgánica | Coherencia entre fórmula y carga (`inorganica.formula-carga`) | Números de oxidación | Preuniv., Univ., Químico | 4: subíndices omitidos (×2) · ion poliatómico cruzado · cuál de cuatro fórmulas es incoherente |
| Inorgánica | Error de balance en una semirreacción (`inorganica.semirreaccion-balance`) | Redox | Univ., Químico | 4: electrones · agua · protones · medio básico |
| Orgánica | Comparar dos estructuras (`organica.comparar-estructuras`) | Isomería | Preuniv., Univ., Químico | 4: idéntica o isómero · fórmula y conectividad · constitucional o estereoisómero · enantiómeros o diastereoisómeros |
| Orgánica | ¿Basta la información para asignar R/S o E/Z? (`organica.estereo-suficiencia`) | Estereoquímica | Univ., Químico | 5: centro sin marca · centro definido · sin centro · doble enlace · información parcial |
| Analítica | Interpretar la equivalencia en una curva (`analitica.curva-equivalencia`) | Valoración | Preuniv., Univ., Químico | 4: leer V(eq) (×2) · concentración desde la curva · pKa de un ácido débil |
| Analítica | Interpolar o no interpolar (`analitica.interpolar-calibracion`) | Calibración | Químico, Científico | 4: dentro del intervalo · por encima · saturación del último patrón · por debajo del patrón mínimo |
| Fisicoquímica | Elegir un modelo cinético (`fisicoquimica.modelo-cinetico`) | Ajuste cinético | Químico, Científico | 6: semividas de orden 0/1/2 · residuos de orden 0/1/2 |
| Fisicoquímica | Datos suficientes para predecir el equilibrio (`fisicoquimica.equilibrio-suficiencia`) | Equilibrio | Univ., Químico, Científico | 6: falta K · datos suficientes (×2) · K a otra temperatura · falta una concentración · aproximación √(Ka·C) |

Inventario por rama y nivel de **variantes nuevas** (45 en total): General — Preuniv. 2, Univ. 4, Químico 2 · Inorgánica — 1, 4, 3 · Orgánica — 2, 4, 3 · Analítica — 1, 2, 3, Científico 2 · Fisicoquímica — Univ. 2, Químico 6, Científico 4. Científico incluye interpretación de datos y justificación del modelo (residuos, saturación de la calibración y revisión de la aproximación). El banco pasa de 22 a 32 familias. «Ajuste de datos cinéticos» gana el nivel Químico (antes solo Científico) y su lección lo describe.

Cada actividad incluye enunciado, datos (o tabla / estructuras / gráfica), respuesta esperada, **tres pistas progresivas**, resolución, error frecuente y fuente (todas *dato didáctico*). Cuando se exige elegir o justificar un método, la pantalla dice qué cuenta como respuesta completa («Cuenta como respuesta completa: …») y la actividad solo se da por resuelta con **resultado y método correctos**; las opciones de método se redactan para no revelar la respuesta (criterios generales, no nombres de reactivos ni del orden).

- **Gráficas**: componente `RengGraficaXY` con marcadores de forma (● ■ ◆ ▲) en leyenda y trazo, ejes con magnitud y unidad, descripción para lector de pantalla y **tabla equivalente** visible debajo con los mismos valores.
- **Dos estructuras** (A y B) con su SMILES en texto; el dibujo 2D de los ejercicios **ya no muestra las etiquetas CIP** (R/S/E/Z), que antes delataban la respuesta (también en «Estereoquímica R/S y E/Z», ejercicio anterior).
- **Distinguir veredictos** (ya existente, comprobado también con los tipos nuevos): entrada ilegible, unidad incompatible («20 g» para un volumen) y estructura ambigua no se tratan como «incorrecto».

### C2 · Identidad, progreso y borradores

**Problema encontrado.** El estado identificaba el intento por tema, nivel y semilla y la familia se elegía con `(semilla − 1) mod nFamilias`; al añadir familias, la misma tripleta pasa a resolver otro ejercicio (se comprobó: de 3 840 combinaciones tema–nivel–semilla de 21 temas, 690 de 10 temas pasarían a resolver otro ejercicio). Antes de la entrega **no había persistencia en disco** (los intentos vivían en memoria), de modo que «intentos anteriores» son los del estado en memoria y los enlaces `familia~nivel~semilla`.

**Solución.**
- Cada intento guarda `ejercicioId` (`familia~nivel~semilla`, los mismos identificadores de siempre) y `huella` (hash FNV del contenido generado: enunciado, datos y orden de las opciones). Se reconstruye con `rengEjercicioPorId`.
- Los registros sin identidad (formato v1: tema, nivel, semilla) se resuelven con `rengEjercicioLegado`, que repite la regla antigua sobre la lista **congelada** de las 22 familias originales (`RENG_FAMILIAS_ORIGINALES`). Si no se puede resolver con certeza (tema o nivel inexistente, semilla inválida, tema heredado «Formular y nombrar») se **informa** y no se asocia a otro ejercicio.
- Si el identificador ya no existe o la huella no coincide (otra versión de la app cambió el problema), el borrador se descarta con un aviso visible («El ejercicio … cambió desde que guardaste tu borrador: no se asoció tu respuesta al problema nuevo»).
- Para intentos nuevos se usa la regla actual (todas las familias del tema, alternando).

**Formato guardado** (`ciencia.practica.simulador-quimica`, versión 2; validado campo a campo al leer, con topes de tamaño):

```
{ v: 2, rama,
  actual: Borrador | null, pendientes: Borrador[≤5],
  logros: { [ejercicioId]: { estado: 'revisada'|'resuelta', aciertos, repeticiones, conResolucion, comprobaciones } } }
Borrador = { id, huella, respuesta (con su unidad escrita), metodo, pistas, resolucion, comprobaciones,
             comprobada: { respuesta, metodo } | null, resuelto, acertado }
```

La corrección que se muestra al reabrir **se recalcula** con la respuesta comprobada (no se guarda texto). La unidad es la que el usuario escribe en la respuesta (no hay control de unidad aparte). El **borrador** (activo y pendientes) está separado del **logro**.

**Criterios de progreso.** *Pendiente* al comenzar (sin registro); *Revisada* al abrir la resolución (sin crédito); *Resuelta* tras una comprobación **completa** (resultado correcto y, si hay método, método correcto). Volver a comprobar, o editar la respuesta aceptada y comprobar de nuevo, **no suma** un acierto; un error posterior no borra el logro. «Rehacer esta variante» limpia el borrador y suma una **repetición**; el nuevo acierto se cuenta una vez. Si se resuelve tras abrir la resolución se anota «con la resolución a la vista» (decisión: sigue siendo *Resuelta*, porque la respuesta la produjo la persona, pero queda constancia).

**Interfaz.** «Práctica en curso» con **Continuar práctica** y **Elegir tema**; las tarjetas muestran «Resueltas: n · Revisadas: n»; el ejercicio muestra el estado con texto y símbolo (○ Pendiente, ◐ Revisada, ✓ Resuelta) y «n aciertos · n repeticiones». **Nivel temporal**: los botones de nivel dentro del ejercicio abren una variante de ese nivel sin tocar la preferencia («Nivel temporal: X. Solo para este ejercicio; tu nivel preferido sigue siendo Y»); volver a temas respeta el nivel preferido. Los avisos de lectura (registro dañado, ejercicio cambiado) aparecen arriba del selector.

### C3 · Recorridos

«Practicar este tema» (Aprender), el Catálogo, el menú y Ctrl+K abren una actividad compatible. **Repasar la lección** abre la lección con «← Volver a la práctica». **Simular este ejercicio** copia solo entradas validadas y la escena ofrece «Volver a la práctica» (antes «Volver al ejercicio»). **Abrir en Mesa molecular** conserva fórmula, carga y estereoquímica (incluida la parcial); con la Mesa ocupada pregunta Añadir / Reemplazar / Cancelar, y la Mesa muestra «Volver a la práctica» mientras se llegó desde una práctica. Las prácticas de modelo o interpretación no tienen «Simular» y funcionan por sí solas.

## Verificación

Comandos (Windows, `npm.cmd`), resultados reales:

| Comando | Resultado |
|---|---|
| `npm run typecheck` | sin errores |
| `npm test` | 54 archivos, **1478 pruebas** (1360 al cerrar la Entrega B) |
| `npm run test:exhaustivo` | 1 de 1 |
| `npm run build` | correcto |

**Pruebas nuevas** (118): `tests/quimica/practica-razonamiento.test.ts` y `practica-identidad.test.ts`, más la instantánea `tests/fixtures/practica-v1-instantanea.json` (3 840 filas: tema, nivel, semilla, id y huella del ejercicio que resolvía el banco **antes** de la entrega).
1. *Reconstruir la misma variante tras añadir familias*: las 3 840 filas se reproducen con el mismo id y contenido (`rengEjercicioLegado`); los ids siguen resolviendo el mismo problema; y se comprueba que la regla nueva **sí** habría cambiado 690 de ellas (por eso se guarda la identidad).
2. *30 variantes nuevas (son 45)*: cada una se alcanza con una semilla, es reproducible y su respuesta se recalcula **por otro camino**: análisis dimensional con los datos del enunciado (unidades); mayor avance por reactivo, masa y moles sobrantes (limitante); carga neta con una tabla de iones propia y recuento de átomos y carga con otra tabla de especies, comprobando que **un único término** arregla el balance (fórmula y semirreacción); pares de estructuras etiquetados a mano con L-láctico y L-alanina como (S) y but-2-eno trans como E (orgánica); equivalente por mayor salto de la tabla y por n(ácido) = n(base), pH por exceso de reactivo y pKa por semiequivalencia (curva); regresión por sumas y por residuos, con el último patrón por debajo de la recta sin él (calibración); semividas y regresiones por sumas, signos de los residuos y residuos normalizados de la tabla (modelo cinético); Q y K recalculados, y x/C con la ecuación de segundo grado (equilibrio).
3. *Almacenamiento válido, antiguo y dañado*: v2 (ida y vuelta), v1 (migración con 4 avisos), huella distinta, identificador desconocido, JSON roto, versiones desconocidas, tipos incorrectos, cadenas de 5 000 caracteres, almacén que lanza al leer o escribir.
4. *Respuesta, unidad, método y pistas al reabrir*; borrador separado del logro.
5. *Revisar, resolver y repetir sin duplicar aciertos* (9 casos).
6. *Nivel preferido y regreso al mismo intento* (verificación de código y de Electron).
7. *Regresiones*: las pruebas anteriores de unidades, ecuaciones equivalentes, isómeros, iones y estereoquímica parcial siguen en verde (solo se cambiaron los textos «Continuar práctica» / «Elegir tema» y el nivel más cercano de «Ajuste cinético»).

**Electron compilado** (`electron .` con `RENG_PERFIL_PRUEBA` a una carpeta temporal absoluta; el proceso principal imprimió `RENG_USERDATA <ruta>` y el guion comprobó que coincide **antes** de cualquier escritura; el Cuaderno real no se tocó). Guiones en el directorio temporal de la sesión:
- **c1 (31 comprobaciones)**: un problema por rama resuelto con ratón y teclado (General: estados Pendiente → Resuelta, 1 acierto, recomprobar no suma, «Rehacer esta variante» → 1 repetición, 2 aciertos; Orgánica con dos estructuras y su SMILES; Analítica leyendo V(eq) de la tabla, con «20 g» → *unidad incompatible* y Intro para enviar; Fisicoquímica con tres series distinguibles por forma); **cierre ordenado y reapertura** con «Continuar práctica» (Intro), respuesta con su unidad, 2 pistas y método conservados; almacenamiento v2 con borrador y 5 logros; nivel temporal y preferencia intacta; foco de vuelta a la tarjeta.
- **c2 (25)**: ida y vuelta a la simulación (misma variante, respuesta y pistas), a la lección y a la Mesa; diálogo Añadir / Reemplazar / Cancelar (Cancelar conserva Mesa e intento; Añadir conserva lo anterior; Reemplazar lo sustituye); Catálogo, Aprender, menú y Ctrl+K.
- **c3 (68 vistas)**: 17 actividades nuevas × 4 combinaciones (1360 × 860 Día/menú abierto, 1024 × 680 Noche/plegado, 1024 × 680 Día, 1360 × 860 Noche) con las pistas y la resolución abiertas: 0 desbordes, 0 controles fuera, 0 fallos de contraste (sonda propia), consola vacía. Regresión A/B: 152 vistas de Química y los 27 pasos de Aprender siguen en verde.
- Capturas en `docs/capturas-entrega-c/` (selector con «Continuar práctica», borrador recuperado, nivel temporal, una por rama, gráficas en ambos temas y tamaños, simulación, lección y diálogo de la Mesa).

## Límites y pendientes

- **Datos didácticos**: Ka, Kc, absorbancias, semividas, residuos y pH de las curvas se generan con modelos simples (no son mediciones publicadas) y así se etiquetan. Los pH de las curvas usan el balance de carga con Kw = 10⁻¹⁴ y actividades ≈ concentraciones.
- **Criterios convencionales**: el 5 % de la aproximación, la lectura del equivalente como punto medio del mayor salto y los intervalos de residuos son criterios didácticos. La validez de «forma de los residuos» con 7 puntos es orientativa.
- **Decisión pendiente de revisión pedagógica**: una variante resuelta tras ver la resolución cuenta como *Resuelta* («con la resolución a la vista»). Un docente podría preferir que no cuente.
- «Formular y nombrar» (tema heredado con su propio componente) **no** participa en el progreso guardado.
- Entrar a Prácticas pulsando de nuevo el destino ya abierto (menú) no vuelve al selector: hay que usar «Volver a temas» (comportamiento previo).
- La cobertura de variantes por semilla es pseudoaleatoria: «Otra variante» no garantiza ver todas en pocas pulsaciones (las pruebas las recorren por semilla).
- No se probó con lector de pantalla. No se midió la respuesta antes/después: no se tocaron rutas de carga, pero las 10 familias nuevas añaden código al mismo fragmento del módulo (el fragmento ya era grande).

## Punto exacto para continuar

**Entrega D · Simulaciones y laboratorio virtual.** Primer paso: auditar los cinco módulos actuales (`modos/simulacion/*`, `modos/MezclaAcidoBase.tsx`, `practica/modelosSimulacion.ts`) contra «pregunta medible → Elegir caso → Ajustar → Calcular o iniciar → Medir → Interpretar → Guardar», empezando por la **declaración del modelo** (ecuaciones, entradas, unidades, temperatura, fases, supuestos, dominio, fuente y nivel de evidencia) y por los **diagnósticos** (falta de datos, fuera de dominio, resultado desactualizado al editar entradas, recuperar el montaje tras un error). Archivo de entrada: `practica/modelosSimulacion.ts` (`RENG_MODELOS_ESCENA`) y su prueba `tests/quimica/practica-referencias.test.ts`. Después, la dilución con material de vidrio dibujado (reutiliza `analitica.dilucion` y la lección de dilución como contenido).
