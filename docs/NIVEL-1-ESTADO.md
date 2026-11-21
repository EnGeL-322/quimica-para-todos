# Química · Nivel 1 del temario · Estado del cierre por bloques

Documento vivo. Orden fijado por el propietario (2026-11-18): **8 Gases (piloto)** → 7 Estequiometría → 9 Soluciones → 10 Ácidos, bases y equilibrio → 11 Termoquímica y electroquímica → 5 Nomenclatura → 6 Reacciones → 1 → 2 → 3 → 4 → 12. Se trabaja **un bloque por sesión** y no se pasa al siguiente sin OK.

Objetivo por subtema (258 en el Nivel 1): (a) lección por capas (Comprender, Formalizar, Aplicar con ejemplo resuelto y segundo método, Explorar solo con recurso real); (b) tres prácticas (básica, intermedia, avanzada) con respuesta calculada por semilla, errores típicos y corrección; (c) enlace a simulación, Mesa, tabla o laboratorio solo si el recurso lo muestra con honestidad. Los criterios de «Completado» y «Verificado» de `temario/estado.ts` no se relajan.

## Punto exacto para continuar

- **META del propietario (2026-11-18):** bloques en este orden, sin pedir permiso entre ellos: 8 (actualización «libro») → 7 → 9 → 10 → 11 → 5 → 6 → 1 → 2 → 3 → 4 → 12. Modo escribir y ejecutar; atestación NO; sin paralelismo. Al cerrar cada lote: informe corto en «Registro de lotes», releer la META y empezar el Paso 0 del siguiente.
- **Lote 8-v2 (bloque 8 en estructura «libro»): CERRADO** (ver «Registro de lotes»).
- **Bloque 7 (Estequiometría): CERRADO** (ver «Registro de lotes»).
- **Bloque 9 (Soluciones y concentraciones): CERRADO** (ver «Registro de lotes»).
- **Bloque 10 (Ácidos, bases y equilibrio elemental): CERRADO** (ver «Registro de lotes»).
- **Bloque 11 (Termoquímica y electroquímica introductoria): CERRADO** (ver «Registro de lotes»).
- **Bloque 5 (Nomenclatura inorgánica): CERRADO** (ver «Registro de lotes»).
- **Bloque 6 (Reacciones químicas): CERRADO** (ver «Registro de lotes»).
- **Bloque 1 (Fundamentos de la química): CERRADO** (ver «Registro de lotes»).
- **Bloque 2 (Estructura atómica): CERRADO** (ver «Registro de lotes»).
- **Bloque 3 (Tabla periódica): CERRADO** (ver «Registro de lotes»).
- **Bloque 4 (Enlace químico): CERRADO** (ver «Registro de lotes»).
- **Bloque 12 (Química orgánica introductoria): CERRADO** (ver «Registro de lotes»).
- **META CUMPLIDA (2026-11-19):** los doce bloques del Nivel 1 tienen lección «libro», tres prácticas por subtema, integradores y capítulo. No hay ningún bloque en curso. Lo siguiente lo decide el propietario: atestaciones (siguen sin registrar, por lo que todos los subtemas quedan en «Parcial»), revisión docente, contraste de los datos «sin verificar» con sus fuentes, y las incidencias abiertas del núcleo anotadas en la decisión 76.

## Decisiones tomadas

1. **Modo y atestación.** Sesión en modo «solo escribir» (solo lectura, escritura y edición de archivos; ningún comando). Atestación = NO: no se registra ninguna en `temario/atestaciones.datos.ts` y la interfaz no menciona atestaciones.
2. **Paso 0 del bloque 8.** Había un vínculo «por revisar» (subtema 1 «Propiedades de los gases» → sustancia «oxígeno» y caso «El aire que respiras»). **Se retiran los dos del subtema 1**: la sustancia es una entrada de la Mesa que no enseña propiedades de los gases y el caso trata la composición del aire. **Se confirma el caso «El aire que respiras» en el subtema 12** (presiones parciales) como recurso de consulta: muestra la composición del aire seco (21 % de O₂), que la lección usa como fracción molar; una prueba fija ese valor. Las decisiones quedan registradas con motivo y fecha en `temario/retiradas-n1.ts`.
3. **Sin escena de gases.** Química no tiene ninguna simulación de gases (el núcleo `rengGasIdeal` existe pero no tiene vista). Ninguna lección del bloque 8 enlaza «Simular» y solo la del subtema 12 tiene capa Explorar (el caso real, de consulta, con sus límites declarados).
4. **Infraestructura N1 de Química (reutilizable por bloques).** `aprender/n1/` (tipos, procedencia, constructor `rengLeccionN1`, numéricos RK4 y bisección, registro único de lecciones y ejemplos) y `practicas-n1/` (tipos, generador por semilla sobre `rengCrearAzar` existente, fábrica declarativa `rengFabricarPracticaN1` con comprobación de separación, adaptador de corrección sobre `rengCorregirNumero` existente, progreso en clave nueva y registro de grupos). Las vistas son `vista/LeccionN1.tsx`, `vista/PracticasN1.tsx` y `vista/IndiceN1.tsx`. Cada bloque nuevo añade su carpeta `aprender/n1/<bloque>/`, sus archivos `practicas-n1/bNN-*.ts` y **una línea** en cada registro.
5. **Corrección: sin motor paralelo.** Las prácticas N1 se corrigen con la corrección numérica que ya tenía Química (unidades del catálogo, conversión, detección de factor 10, «cerca», error frecuente). El adaptador solo añade el rechazo de números no finitos y el identificador del error típico.
6. **Nuevos tipos de recurso del temario:** `leccion-n1` (capa Aprender) y `practica-n1` (capa Prácticas). «Completado» acepta, además de un tema con lección y práctica, el par lección N1 + lista de prácticas N1 del subtema, con atestación (tema = id de la lección, familia = id del subtema) y, si la lección explora una escena, esa escena confirmada. Las definiciones visibles de los estados no cambian.
7. **Desacople de recuentos** (como la decisión 21 de Física): `entrega-1-temario.test.ts` deja de fijar 163/150, el reparto del Nivel 1, la lista exacta de bloques ≥ 40 % y los 163 «Verificados» del sabotaje; ahora compara con un recuento independiente del mapa, exige cotas en el sentido del cierre (confirmados ≥ 163, por revisar ≤ 150) y mantiene fijos los Niveles 2–8. La prueba de «En desarrollo» pasa del subtema 1 del bloque 8 (que ya tiene recursos) a `n3-b25-s1`. `entrega-2-atestaciones.test.ts` usa `n1-b9-s1` como subtema «por revisar». `entrega-e-simulaciones-libres.test.ts` cuenta los tipos nuevos en su recuento independiente. `scripts/verificacion-d/e1.mjs` comprueba cotas en lugar de 163 y 150.
8. **Progreso de prácticas N1** en la clave nueva `ciencia.practicas-n1.simulador-quimica` (versión 1, validada al leer, con tamaño máximo). Las claves antiguas se leen solo donde ya se leían; una prueba comprueba byte a byte que no cambian.
9. **Rutas.** Lección: `#/simulador-quimica/aprender-<id>` (id de 32 caracteres como máximo; el shell admite 41 en la subruta). Prácticas: `#/simulador-quimica/practicas-<subtema>`. `navegacion.ts` no cambia; `View.tsx` abre la vista N1 cuando el id no es un tema.
10. **Ecuaciones como texto** (sustituida por la decisión 12 el 2026-11-18). Hasta la Entrega 0, Química no tenía renderizador de fórmulas y las ecuaciones iban en texto con subíndices Unicode; ese texto se conserva como versión legible.
11. **Constantes.** R = 8,314462618 J/(mol·K) de `datos/electroquimica.ts`; 1 atm = 101 325 Pa y 760 Torr, ρ(Hg) = 13,5951 g/cm³ y g = 9,80665 m/s² del catálogo de unidades; N_A y k_B de `nucleo/estequiometria.ts`. Todas «bibliográfica declarada» (no se reabrió ninguna fuente). Masas molares de la tabla de la app («sin verificar»). Presiones de vapor del agua, densidades de líquidos y parámetros de van der Waals: **didácticos**.
12. **Ecuaciones con Temml 0.14.0** (autorizado el 2026-11-18, Entrega 0). Cada ecuación de una lección N1 lleva `texto` (Unicode, legible y copiable) y `tex` (opcional). La vista la dibuja en MathML con carga diferida de Temml y numeración `bloque.subtema.n`; el texto queda en el DOM para el lector de pantalla y se muestra si Temml no carga o si el estudiante elige «Ver ecuaciones como texto». Las fórmulas y reacciones se escriben con `RengFormulaQuimica` (`\ce{}` de mhchem, incluido en Temml; licencia Apache 2.0 registrada). Una prueba exige que el TeX y el texto tengan los mismos símbolos en el mismo orden. Los pasos de los ejemplos y los enunciados siguen en Unicode.
13. **Kit de figuras** en `aprender/figuras/geometria.ts` (puro) y `vista/figuras/Figuras.tsx`: ejes, diagrama de niveles y flechas de reacción, siempre con `<figure>`, pie numerado, título y texto alternativo; las series se distinguen por trazo y marcador, no solo por color. Las figuras nuevas reutilizan el kit.
14. **Kit de escenas N1** en `escenas-n1/` (contrato, utilidades puras, registro con una línea por escena) y `vista/EscenaN1.tsx`. Independiente del Cuaderno y de las escenas existentes (no se toca su huella). Cada escena nueva necesita: modelo puro validado por `rengValidarModeloEscenaN1`, comprobación analítica o de conservación con `rengComprobarEscenaN1` **y** su sabotaje, y un guion CDP. La ruta para abrir una escena N1 desde «Explorar» se cablea con la primera escena real.
15. **Página interna de pruebas** `#/prueba-kit` (y `#/prueba-kit-sabotaje`) solo en la compilación `--mode pruebas`; la compilación normal no la contiene. La usa `scripts/verificacion-n1/entrega0.mjs`.
16. **Bloque 8 a la estructura «libro»** (decidido por el propietario el 2026-11-18): se actualiza antes del bloque 7, y todos los bloques siguientes nacen con esa estructura.
17. **Contrato «libro» de la lección N1** (`aprender/n1/tipos.ts`, `constructor.ts`, `calidad.ts`). Campos nuevos obligatorios: `objetivos` (2–4), `porQueImporta`, `comprender.analogia` y `analogiaLimite`, `ejemplos` (≥ 2; el primero es el antiguo `ejemplo`, que se conserva), `figuras` (≥ 1), `errores` (≥ 2 con corrección; `comprender.errorFrecuente` es el primero), `resumen` (4–6 líneas), `glosario` (≥ 2, sin colisiones en el bloque), `comprobar` (exactamente 3 preguntas de opción cerrada, 3–4 opciones, una correcta y retroalimentación propia ≥ 26 caracteres por opción), `conexiones` (anterior, siguiente y prerrequisitos que existen en el temario, sin ciclos) y `escena` opcional. El constructor lanza un error con la lista de lo que falta. Las rutas `aprender-<id>`, los ids y la clave de progreso no cambian.
18. **Bloque 8 con envoltorio.** Para no reescribir textos ya verificados, `gases/lecciones.ts` conserva sus especificaciones y `rengLeccionGas` las fusiona con la ficha «libro» de cada lección (`gases/libro-a.ts`, `libro-b.ts`, glosario común en `libro-comun.ts`). Los bloques nuevos escriben la especificación completa directamente.
19. **Capítulo por bloque** (`aprender/n1/capitulo.ts`): id `capitulo-b<n>` (ruta `aprender-capitulo-b<n>`), portada (introducción, 3–8 objetivos, mapa de subtemas con prerrequisitos y ruta sugerida, que se presenta como recomendación y nunca bloquea) y cierre (resumen, glosario del capítulo derivado de las lecciones y grupo de integradores). La ruta debe recorrer los subtemas con lección y respetar los prerrequisitos.
20. **Problemas integradores** (`practicas-n1/integradores.ts`): id `n1-b<n>-i<k>`, grupo `n1-b<n>-int` (ruta `practicas-n1-b<n>-int`), ≥ 6 por capítulo (2 básicos, 2 intermedios, 2 avanzados), cada uno combina ≥ 2 subtemas del bloque, con la misma fábrica, corrección y segundo método en las pruebas. Su progreso va en la misma clave `ciencia.practicas-n1.simulador-quimica` (mismo formato, versión 1; solo se admiten ids nuevos).
21. **Figuras** registradas por bloque (`gases/figuras.ts`), calculadas con el modelo y validadas (`aprender/n1/figuras.ts`: título, pie, texto alternativo, puntos finitos dentro de los ejes). Se numeran por lección (`bloque.subtema.k`) y se reutilizan entre subtemas de la misma familia. Colores de serie: `--accent`, `--accent-2`, `--text-2`, `--text` (se quitó `--accent-3`, que en Día daba 2,91:1 sobre el fondo de la figura) y además trazo y marcador distintos.
22. **«Para comprobar» no guarda estado**: las respuestas viven solo mientras la lección está abierta; no se creó clave nueva ni se tocó el progreso de Aprender.
23. **Similitud entre lecciones de un bloque**: Jaccard de grupos de 4 palabras sobre «por qué importa», idea, analogía, límite, resumen y correcciones; umbral 0,30 (`RENG_UMBRAL_SIMILITUD_N1`). Bloque 8: máximo 0,165 (efusión frente a Graham). El sabotaje (copiar un párrafo) da 1,0.
24. **Escena N1 «gas ideal»** (`escenas-n1/modelos/gas-ideal.ts`), primera real del kit; reutiliza `rengGasIdeal` del núcleo. Tipo de recurso nuevo del temario `escena-n1` (capa simulación; acción «Simular» que abre `aprender-escena-<id>`). La lección la muestra en su capa Explorar con valores propuestos. En el bloque 8, (a)/(b)/(c): **(b)** escena nueva en los subtemas 1, 4–11 y 14–16; **(a)** recurso existente en el 12 (caso «El aire que respiras», de consulta); **(c)** sin simulación en 2 y 3 (la escena no modela manómetros ni barómetros), 13 (no modela mezclas ni vapor de agua), 17–19 (un solo gas, sin orificio ni difusión) y 20 (el modelo es ideal: precisamente lo que no sirve para mostrar desviaciones).
25. **Ajustes de pruebas y guiones por cambio de diseño** (sin quitar lo que protegían): `entrega-1-temario` admite el tipo `escena-n1`; `entrega-e-simulaciones-libres` cuenta `escena-n1` como simulación en su recuento independiente; `nivel1-b08-gases` espera 12 simulaciones en el bloque 8; `nivel1-comun` reconoce ids de integradores y exige pistas ≥ 11 y mensajes ≥ 26; `b08.mjs` espera la capa Explorar con la escena en el subtema 4, 12 botones «Simular», el índice con la portada y los integradores, y mide el texto SVG por su `fill` (antes leía `color`, que en la leyenda no es el color pintado); `entrega0.mjs` excluye la portada del recuento de lecciones.
26. **Cuestiones del prompt sin equivalente:** el mensaje del propietario cita las secciones 7.4 (causas de parada) y 7.7 (trampas) del prompt maestro; la copia pegada en esta sesión no tiene esas subsecciones. Se aplican como causas de parada las de las secciones 2, 4 y 7 de esa copia (contradicción con CLAUDE.md, choque con el esquema persistido, recorte honesto > 30 % en N1–N3) y las trampas se registran abajo.

27. **Bloque 7: correspondencias reescritas por subtema.** El índice de correspondencias admite un solo grupo por posición, así que el bloque 7 pasa a una línea `rengN1(...)` por subtema que incluye la lección, las prácticas y los recursos ya confirmados (temas `mol` y `estequiometria`, Mesa) más la escena correspondiente. Ningún recurso confirmado se pierde; el único retirado es el tema `concentracion` del subtema 18 (decisión del Paso 0).
28. **Escena «reactivo limitante»** (`escenas-n1/modelos/reactivo-limitante.ts`): reutiliza `rengAjustarEcuacion` y `rengReactivoLimitante` del núcleo; cuatro reacciones benignas; el rendimiento es un parámetro y se aplica solo al primer producto (declarado en sus límites). La escena del gas ideal añade los subtemas 7.12 y 7.20 a su lista.
29. **Prácticas con respuestas diminutas o enormes**: la fábrica exige una separación absoluta de 0,15 entre respuesta y errores, así que no admite respuestas del orden de 10⁻²³. Las prácticas se formulan con magnitudes de escala humana (moléculas por gramo en lugar de gramos por molécula) en lugar de relajar la separación.
30. **Comprobador común**: la unidad «ajena» para prácticas de masa es «s» (antes siempre «kg», que es compatible con «g»); se añaden alternativas g→mg y mol→mmol. No se relaja ningún criterio.
31. **Guion de Electron genérico** `scripts/verificacion-n1/bloque-libro.mjs --bloque N` (derivado de `b08-libro.mjs`, que se conserva): lección con escena, cuestionario con teclado, ejemplo integrador, temario y «Simular», capítulo, integradores y matriz visual con contraste de texto y de trazos. Cada bloque nuevo añade una línea a su tabla `CONF`.

32. **Unidades de concentración en las prácticas** (bloque 9): el catálogo de unidades entiende mol/L, mmol/L, µmol/L, mol/kg, mg/kg y µg/kg, pero no «ppm», «ppb» ni «eq». Las ppm se piden como mg/kg y las ppb como µg/kg (el enunciado dice «ppm (mg/kg)»); la normalidad se pide sin unidad («escribe solo el número, en eq/L»); la fracción molar se pide como porcentaje molar (x × 100), porque con valores entre 0 y 1 los errores típicos no alcanzan la separación absoluta de 0,15 de la fábrica. No se toca el catálogo (archivo compartido) ni se relaja la fábrica.
33. **Sabotajes que usaban el bloque 9 como «sin contenido»**: `entrega-2-atestaciones`, `nivel1-b08-gases` y `nivel1-infra` comprobaban que un subtema del bloque 9 (o el 5.16) no tenía recursos. Ahora usan subtemas del bloque 13 (`n2-b13-s1`, `-s2`, `-s3`), que no entran en la META y seguirán sin contenido; la comprobación es la misma.
34. **Sonda de texto `NaN`**: la prueba común busca `/NaN|undefined/` en los enunciados; la fórmula «NaNO₃» la dispara. Se evita esa sal en los enunciados generados (se usa NaBr) en vez de relajar la sonda.
35. **Botones «Simular» del temario**: además de las escenas N1, un tema con escena (como `dilucion`) añade su propio «Simular». La línea `CONF` del guion genérico cuenta todos (bloque 9: 9 + 3 = 12).
36. **Escena «concentraciones»** (`escenas-n1/modelos/concentraciones.ts`): la densidad de la disolución es un control libre (no se calcula), K_f = 1,86 K·kg/mol e i son parámetros didácticos; la ficha lo dice en «Límites». Las lecciones 3, 5, 6 y 7 enlazan la escena de solubilidad existente en Explorar y las 17–19 la de dilución.

37. **Kw en el bloque 10**: las escenas usan el valor del núcleo de la app (pKw = 13,9965, agua pura a pH 6,998); los ejercicios y prácticas usan Kw = 1,0·10⁻¹⁴ redondeado, declarado «sin verificar». Las lecciones 2, 8 y 11 lo dicen. Por eso los segundos métodos de ejemplos y prácticas resuelven el mismo modelo (bisección o núcleo con `Kw = 1e-14` como argumento), no el núcleo con su Kw propio.
38. **Magnitudes muy pequeñas** (Ka, Kb, Ksp, [OH⁻] en medio ácido): la fábrica exige separación absoluta de 0,15, así que las prácticas piden pKa, pKb, pKsp o pH, o concentraciones en mmol/L, µmol/L o nmol/L; nunca Ka o Ksp directamente.
39. **Escenas nuevas del bloque 10**: «acido-base» (balance de carga con `rengConcentracionH` del núcleo; HA/A⁻ con NaA y NaOH; con pKa −6 HA se comporta como fuerte; indicador como segundo par) para 17 subtemas, y «equilibrio-gas» (A ⇌ 2B con `rengKcDeKp` y `rengGradoDisociacionDimero` del núcleo) para 19–21. s3 queda con la Mesa «Enlaces» (enlace dativo) y sin simulación; s22 con la escena de solubilidad existente.
40. **Paso 0 del bloque 10**: confirmada la Mesa «enlaces» para s3; retiradas la escena `acidobase` de s8 y los temas `ph` (s13), `valoracion` (s15) y `equilibrio` (s20), cada uno con el texto concreto que lo justifica en `retiradas-n1.ts`.

41. **Escenas del bloque 11**: «calorimetria» (balance de calor con `RENG_C_AGUA` del núcleo; cuerpo, agua y capacidad del calorímetro) para s1–s4, y «electrolisis» (leyes de Faraday con `RENG_FARADAY` del proyecto; corriente, tiempo, z, M y eficiencia) para s17–s19. Las lecciones de entalpía, Hess, formación, espontaneidad, entropía y Gibbs enlazan la escena `termo` existente; la 10, la de `cinetica`; la 9, la Mesa «Enlaces»; las 14–16 y 20, la de `electroquimica`.
42. **Potenciales en milivoltios**: la corrección de Nernst es de pocas decenas de mV, por debajo de la separación absoluta (0,15) y relativa (1,5 %) de la fábrica si la respuesta se pide en V. Las prácticas de Nernst y de pilas de concentración piden E − E° o E en mV (decisión análoga a la 38).
43. **Paso 0 del bloque 11**: confirmadas la Mesa «enlaces» para s9 (muestra D₀ de enlaces múltiples) y la escena `electroquimica` para s20 (cada combinación es una pila); retirada la escena `electroquimica` de s18 (celda en circuito abierto, sin corriente ni Faraday).
44. **Escena del bloque 5**: «formula-ionica» (cargas del catión y del anión y sus masas molares; da subíndices cruzados y simplificados, carga total, masa fórmula y % del catión) para s2, s6, s13, s14, s18 y s19. Las demás lecciones enlazan la herramienta «Formulación» de la Mesa (s1, la tabla periódica).
45. **Paso 0 del bloque 5**: no había correspondencias por revisar; se conservan las confirmadas (tabla, temas `oxidacion` y `formular-nombrar`, Mesa «Formulación»). La s16 (sales básicas) queda solo con lección y prácticas: ni la Mesa ni el tema cubren sales básicas y el núcleo no las nombra; sus 16 fórmulas son parámetro didáctico y el segundo método usa el analizador de fórmulas del núcleo.
46. **Límite del núcleo en números de oxidación**: `rengEstadosOxidacion` devuelve null para sales de metales de transición con aniones poliatómicos (Fe₂(SO₄)₃, Cr₂(SO₄)₃, CuSO₄, AgNO₃, Fe(NO₃)₃, (NH₄)₂SO₄) y para Fe₂S₃. No se tocó el núcleo: esas fórmulas se retiraron de la práctica s2-p2 y en s14-p3 el segundo método calcula el estado en el ácido de origen (H₂SO₄, HNO₃…).
47. **Variantes suficientes**: las prácticas s5-p2 y s14-p1 piden la masa de una cantidad en mol en lugar de la masa fórmula sola; con la lista de compuestos no se alcanzaban 12 variantes distintas.
48. **Escenas del bloque 6**: nueva «combustion» (combustión completa de CₓHᵧO_z: coeficientes enteros mínimos, átomos de O a cada lado y masas que se conservan) para s3–s6 y s14; se reutilizan «reactivo-limitante» (s2 y s8) y «acido-base» (s13), añadiendo esos subtemas a su lista. Las lecciones 12, 15–20 enlazan escenas existentes (solubilidad, equilibrio, termo y electroquímica); 1, 7, 9, 10 y 11, la Mesa «Reacciones».
49. **Paso 0 del bloque 6**: confirmadas las 12 correspondencias por revisar (Mesa «Reacciones» en s1, s2, s8, s10 y s14; tema `ajuste` en s6; escenas `solubilidad` (s12), `equilibrio` (s15) y `termo` (s16, s17); tema `redox` en s19 y s20), con motivo en `retiradas-n1.ts`. Se añade la escena `electroquimica` a s18–s20 (identifica oxidante y reductor en cada pila).
50. **Concentraciones pequeñas en mmol/L**: la práctica s13-p2 y el integrador 5 piden la concentración en mmol/L; en mol/L las respuestas (0,01–0,4) quedan por debajo de la separación absoluta de la fábrica (decisión análoga a la 38).
51. **Entalpías didácticas**: las ΔH de combustión, formación y descomposición del bloque 6 son valores redondeados de uso común declarados «sin verificar»; las prácticas no dependen de su exactitud.
52. **Escena del bloque 1**: nueva «densidad» (masa, volumen y densidad del líquido; da ρ en g/mL y kg/m³, si flota y la fracción sumergida) para s3, s5, s7, s14, s16, s17, s20 y s21. Se reutilizan «combustion» (s2, s15), «calorimetria» (s4, s9), «gas-ideal» (s8, s22) y «concentraciones» (s12, s13), añadiendo esos subtemas a sus listas.
53. **Paso 0 del bloque 1**: confirmadas la tabla periódica en s8 (estado de cada elemento) y s21 (densidad en la ficha), la Mesa «Explorar» en s10 y s11, la práctica «Error de unidades en una preparación» en s16, s17 y s20 y el catálogo de peligros en s23; retiradas la Mesa «Explorar» de s12 (no representa mezclas), el tema `mol` de s18 y s19 (no trata notación ni cifras significativas) y la escena `termo` de s22 (no trata escalas ni unidades de presión). Motivos en `retiradas-n1.ts`.
54. **Respuestas enteras sin ambigüedad**: las prácticas de notación científica piden el exponente del resultado y las de cifras significativas el número de cifras o de decimales; las listas usan medidas con ceros iniciales para que los errores típicos («todos los dígitos», «solo los no nulos») no coincidan con la respuesta.
55. **Densidades de mezclas en kg/m³**: en las prácticas s7-p3 y s14-p1 la respuesta y los errores típicos (media simple) difieren menos de 0,15 en g/mL; se piden en kg/m³ (decisión análoga a la 38).
56. **Escenas del bloque 2**: tres escenas nuevas. «atomo» (Z, N y carga; da protones, neutrones, electrones, A, suma de masas, electrones de la capa externa y carga) para s1, s7–s16 y s25; «espectro-hidrogeno» (niveles de partida y llegada; da ΔE, λ, ν y si la línea es visible) para s5, s6, s17 y s18; y «config-electronica» (Z hasta 36; da electrones s, p y d, subniveles y orbitales ocupados, desapareados y capa externa, con las configuraciones de la tabla de la app) para s19–s24. La tercera se añadió para no dejar seis subtemas solo con consulta de la tabla. Quedan sin simulación s2, s3 y s4 (modelos de Dalton, Thomson y Rutherford): son modelos históricos que la app no simula; sus prácticas calculan proporciones, cargas y tamaños.
57. **Paso 0 del bloque 2**: se confirma la tabla periódica en s16 (masas en u) y s21 (configuración con excepciones); se retiran la Mesa «Explorar» de s8 y s10 (no muestra partículas subatómicas ni A) y la tabla de s11 (no muestra isótopos). Además la tabla se enlaza como consulta en s19, s20, s22 y s23.
58. **Aufbau por dos vías**: las prácticas usan un llenado propio por la regla de n + l (`rengLlenarAt`, sin excepciones) y sus listas excluyen el cromo y el cobre; el segundo método usa `rengOcupacion` de la tabla periódica, que sí incluye las excepciones. En los cationes de transición, los electrones 3d se calculan como Z − 18 − q (válido también para Cr³⁺ y Cu²⁺) y el segundo método parte de la ocupación real del átomo neutro (3d + 4s − q).
59. **Isótopos y separación de respuestas**: la media simple y la media ponderada de dos isótopos difieren menos del 1,5 % en los elementos pesados, así que (a) la práctica de masa media usa mezclas preparadas con fracción variable y la fábrica descarta las combinaciones que no se separan (quedan Li, B, N y Cl), y (b) las de masa atómica natural usan como errores típicos la suma sin ponderar y el olvido de una abundancia. Las respuestas de magnitudes muy pequeñas o muy grandes se piden «en múltiplos de 10ⁿ» con unidad vacía (decisión análoga a la 38).
60. **Fórmulas dadas en el enunciado**: cuatro prácticas usan relaciones que la lección solo menciona (De Broglie λ = h/(m·v), momento magnético de solo espín √(n(n + 2)), 1 u = 931,494 MeV y radio nuclear 1,2·A^(1/3) fm); la fórmula y los datos van en el enunciado y los valores quedan declarados sin verificar.
61. **Unidad «u» en la prueba común**: la comprobación de «unidad ajena» de `tests/quimica/nivel1-comun.ts` usaba «kg» como unidad incompatible, que es compatible con «u» (masa); se añadió «u» a la lista de unidades de masa para que use «s».
62. **Escenas del bloque 3**: nueva «tendencias-periodicas» (periodo 2 a 5 y electrones de valencia 1 a 8; da Z, grupo, valencia, radio atómico, primera energía de ionización, electronegatividad de Pauling y carácter metal/metaloide/no metal) para s2, s3, s5–s11, s15, s17, s19, s20, s22 y s23. Se reutilizan «config-electronica» (s4 y s12) y «atomo» (s16 y s21), añadiendo esos subtemas a sus listas. Quedan sin simulación s1 (historia), s13 y s14 (lantánidos y actínidos, fuera del alcance de las escenas) y s18 (afinidad electrónica: no se incluyó como lectura por tener datos menos fiables para varios elementos).
63. **Datos periódicos**: la app no guardaba radios, energías de ionización ni afinidades. Se añadieron en la escena, como valores de tablas de libros de texto recordados y declarados **sin verificar** (radios atómicos y primeras energías de ionización de H, He y los 32 representativos de los periodos 2 a 5; afinidades de 22 elementos; radios iónicos de 17 iones). La electronegatividad y los estados de oxidación salen de los datos de PubChem ya guardados en la app, y los años de descubrimiento, de los de Wikidata (ambos «bibliográfica declarada»). El boro se excluyó de la práctica de años porque el dato guardado (1892) no es fiable.
64. **Paso 0 del bloque 3**: se confirma la tabla periódica en s2, s4, s5, s20 y s22 y se retira en s17 (no muestra energías de ionización). La lección de afinidad electrónica (s18) no enlaza la tabla, que tampoco muestra afinidades.
65. **Bloques d y f en los periodos 6 y 7**: la tabla de la app clasifica 15 lantánidos y 15 actínidos, así que sus recuentos por bloque no coinciden con las capacidades ideales (14 y 10). Las prácticas de bloques usan las capacidades ideales 2(2l + 1) y su segundo método es un recuento de m_l, no un recuento en la tabla.
66. **Modelos simplificados dados en el enunciado**: la carga nuclear efectiva se estima como Z menos los electrones internos (apantallamiento total), el carácter iónico con la relación empírica de Pauling y el paso a energía por átomo con 96,485 kJ/mol por eV; las tres relaciones se dan en el enunciado y quedan declaradas como aproximaciones.
67. **Escenas del bloque 4**: cinco escenas nuevas. «carga-formal» (valencia, electrones no enlazantes y enlaces; da carga formal, electrones alrededor y octeto) para s1–s4 y s8; «polaridad-enlace» (dos electronegatividades y longitud; da Δχ, carácter iónico, tipo y momento dipolar estimado) para s6, s7, s10, s11 y s21; «geometria-vsepr» (átomos unidos y pares libres; da dominios, ángulo ideal, híbridos y simetría, y nombra la forma) para s12–s14; «interaccion-molecular» (potencial de Lennard-Jones) para s17–s20; y «orden-enlace» (electrones enlazantes y antienlazantes; da orden, estabilidad y reparto en σ y π) para s15, s16 y s22. Quedan sin simulación s5 (resonancia) y s9 (enlace metálico; la Mesa «Enlaces» tiene su secuencia, que cuenta como consulta).
68. **Datos de enlace**: se reutilizan los datos con fuente del núcleo (`nucleo/datosEnlace.ts` y `nucleo/electronegatividad.ts`: moléculas diatómicas, geometrías, energías de interacción, puntos de ebullición, parámetros de red, ley de Coulomb, umbrales 0,4 y 1,7 y relación de Pauling), como «bibliográfica declarada». Lo que el núcleo no tiene (energías medias de enlace, momentos dipolares, puntos de ebullición y fusión, entalpías de vaporización, longitudes típicas, pozos de otros gases) son valores de tablas de texto recordados, **sin verificar**, y siempre se dan en el enunciado.
69. **Paso 0 del bloque 4**: nueve confirmaciones (Mesa «Enlaces» en s2 y s3; visor de la Mesa en s4, s12 y s13; glosario «dipolo» en s11, «VSEPR» en s12 y s13 e «hibridación» en s14) y una retirada (tema «enlace» en s21, que clasifica enlaces pero no trata propiedades).
70. **Listas estructurales**: las estructuras de Lewis, los recuentos de enlaces σ y π, las formas VSEPR y las ocupaciones de orbitales moleculares son resultados de libro recordados. Una prueba cruza las listas de especies y de moléculas con dos cálculos independientes (pares enlazantes que exige el octeto y grado de insaturación menos anillos). Los iones con manganeso o cromo se excluyen de las prácticas de recuento de valencia, porque la regla «valencia = grupo − 10» solo vale para elementos representativos.
71. **Modelos aproximados del bloque 4**: el momento dipolar estimado toma la carga parcial igual al carácter iónico; el puente de hidrógeno se representa con un pozo de Lennard-Jones que solo reproduce su profundidad y su distancia; la energía de un par de iones aislado no es la energía de red; y varias prácticas dan en el enunciado relaciones que la lección solo menciona (entropía de vaporización ΔH/T, carácter s de un híbrido, interpolación lineal de la longitud con el orden de enlace). Todo queda declarado como aproximación.
72. **Escenas del bloque 12**: tres escenas nuevas. «hidrocarburo» (carbonos, enlaces dobles, triples y anillos; da hidrógenos, masa molar, grado de insaturación, enlaces σ y π, O₂ de la combustión, H₂ para saturar y % de carbono, y avisa si el esqueleto es imposible) para s1–s4, s6–s11, s20 y s21; «familia-organica» (carbonos y una de ocho familias saturadas; da la fórmula, la masa molar, el grado de insaturación y los hidrógenos unidos a O o N) para s5 y s12–s19; y «polimero» (masa del monómero, número de unidades y adición o condensación) para s22. Los 22 subtemas quedan con simulación.
73. **Segundo método con el motor de estructuras**: las prácticas calculan con la fórmula molecular y las reglas de valencia; las pruebas recalculan cada respuesta sobre la molécula real, construida a partir de su SMILES con el motor de estructuras de la app (openchemlib), de su nombre con el analizador de nomenclatura del núcleo o de su fórmula semidesarrollada con el analizador del núcleo. Las prácticas y las lecciones no importan ese motor (pesa y se carga bajo demanda): solo lo usan las pruebas.
74. **Paso 0 del bloque 12**: cuatro confirmaciones (visor de la Mesa en s1, s2 y s3; ficha de la glucosa en s22). Se conservan los temas de ejercicios ya confirmados («estructura», «grupos», «isomeria», «nomenclatura» y «reacciones-organicas»).
75. **Isómeros**: la serie de isómeros de los alcanos (1, 1, 1, 2, 3, 5, 9, 18, 35, 75, 159, 355, 802) deja de ser un dato recordado: una prueba la recalcula contando esqueletos con un algoritmo de árboles con centro, y pasa a «dato calculado». Los isómeros de posición de los cloroalcanos se comprueban sustituyendo carbono a carbono y contando estructuras distintas con el identificador canónico del motor. Solo se cuentan isómeros estructurales, no estereoisómeros.
76. **Límites del núcleo encontrados y no tocados**: (a) el analizador de fórmulas semidesarrolladas (`nucleo/semidesarrollada.ts`) lee mal «CH2OH-CH2OH» (da un peróxido de éter, COCO), «CH3-CHOH-CH3» (da un éter) y «CH2Cl-CH3» (da C₂H₇Cl), y falla con «(CH2)4»; las listas del bloque usan solo la notación con paréntesis, «CH(OH)», que sí lee bien. (b) El analizador de nombres (`nucleo/organica.ts`) no reconoce cadenas de más de diez carbonos, cicloalquenos, aminas secundarias o terciarias, amidas N-sustituidas ni hidrocarburos de varios anillos; esos nombres se comprueban solo por su fórmula. No se corrigió nada del núcleo: queda a decisión del propietario.

## Trampas conocidas (equivalente a la sección 7.7)

- Pistas con **exactamente 10 caracteres** violan «más de 10»: mínimo 11. Mensajes de error: mínimo 26. Se comprueba al escribirlas (el constructor y `nivel1-comun` las rechazan).
- El `<title>` y el `<desc>` de las figuras SVG no se dibujan: se excluyen de la sonda de contraste sin bajar ningún umbral; no sirven para ocultar un fallo real. El texto SVG se mide por su `fill`.
- Temml: mantener `texto` Unicode y `tex` con los mismos símbolos en el mismo orden (prueba existente); fórmulas y reacciones con `RengFormulaQuimica`.
- `tsconfig.node.json` no tiene alias `@/` ni JSX: las pruebas importan con rutas relativas y cargan los `.tsx` con `import(/* @vite-ignore */ RUTA)`.
- En Windows, escribir archivos con Python cambia LF por CRLF salvo con `newline=''`; varios archivos del proyecto son CRLF (p. ej. `View.tsx`): las sustituciones deben respetar `
`.
- Datos derivados mostrados con redondeo (p. ej. `V1·f` con 3 cifras) hacen que el estudiante calcule con otro número: generar directamente el dato que se muestra.
- Las variables de entorno de los guiones se pasan con `env VAR=1 node …` en bash y con `$env:VAR='1'` en PowerShell.

## Cobertura del Nivel 1 (generada; no se escribe a mano)

La sección siguiente la escribe `node scripts/informe-nivel1.mjs` a partir de los recursos reales y `node scripts/informe-nivel1.mjs --comprobar` (o `npm test`) falla si no coincide. Generada y comprobada el 2026-11-18.

<!-- COBERTURA:INICIO -->

Nivel 1: 258 subtemas · con lección por capas 258 · con prácticas nuevas 258 (774 prácticas) · Estados: Parcial 258.

### Bloque 1 · Fundamentos generales de química

Lecciones por capas 23/23 · Prácticas nuevas 23/23 (69) · Simulaciones 16/23 · Por revisar 0 · Estados: Parcial 23.

| Subtema | Lección por capas | Prácticas nuevas | Otros recursos confirmados | Simulaciones | Estado |
|---|---|---|---|---|---|
| 1. Concepto de química. | ✓ | 3 | 1 | — | Parcial |
| 2. Historia de la química. | ✓ | 3 | — | — | Parcial |
| 3. Método científico. | ✓ | 3 | — | — | Parcial |
| 4. Materia y energía. | ✓ | 3 | — | — | Parcial |
| 5. Propiedades generales y específicas de la materia. | ✓ | 3 | — | — | Parcial |
| 6. Propiedades físicas y químicas. | ✓ | 3 | 1 | — | Parcial |
| 7. Propiedades intensivas y extensivas. | ✓ | 3 | — | — | Parcial |
| 8. Estados de agregación. | ✓ | 3 | 1 | — | Parcial |
| 9. Cambios físicos y químicos. | ✓ | 3 | — | — | Parcial |
| 10. Sustancias puras. | ✓ | 3 | 1 | — | Parcial |
| 11. Elementos y compuestos. | ✓ | 3 | 1 | — | Parcial |
| 12. Mezclas homogéneas y heterogéneas. | ✓ | 3 | — | — | Parcial |
| 13. Métodos de separación de mezclas. | ✓ | 3 | — | — | Parcial |
| 14. Sistemas materiales. | ✓ | 3 | — | — | Parcial |
| 15. Fenómenos físicos y químicos. | ✓ | 3 | — | — | Parcial |
| 16. Magnitudes y unidades. | ✓ | 3 | 1 | — | Parcial |
| 17. Sistema Internacional. | ✓ | 3 | 1 | — | Parcial |
| 18. Notación científica. | ✓ | 3 | 1 | — | Parcial |
| 19. Cifras significativas. | ✓ | 3 | 1 | — | Parcial |
| 20. Análisis dimensional. | ✓ | 3 | 1 | — | Parcial |
| 21. Densidad. | ✓ | 3 | 1 | — | Parcial |
| 22. Temperatura y presión. | ✓ | 3 | — | — | Parcial |
| 23. Seguridad química elemental. | ✓ | 3 | 1 | — | Parcial |

### Bloque 2 · Estructura atómica

Lecciones por capas 25/25 · Prácticas nuevas 25/25 (75) · Simulaciones 22/25 · Por revisar 0 · Estados: Parcial 25.

| Subtema | Lección por capas | Prácticas nuevas | Otros recursos confirmados | Simulaciones | Estado |
|---|---|---|---|---|---|
| 1. Teorías atómicas. | ✓ | 3 | — | — | Parcial |
| 2. Modelo de Dalton. | ✓ | 3 | — | — | Parcial |
| 3. Modelo de Thomson. | ✓ | 3 | — | — | Parcial |
| 4. Modelo de Rutherford. | ✓ | 3 | — | — | Parcial |
| 5. Modelo de Bohr. | ✓ | 3 | — | — | Parcial |
| 6. Modelo mecánico-cuántico. | ✓ | 3 | — | — | Parcial |
| 7. Partículas subatómicas. | ✓ | 3 | — | — | Parcial |
| 8. Protones, neutrones y electrones. | ✓ | 3 | — | — | Parcial |
| 9. Número atómico. | ✓ | 3 | 1 | — | Parcial |
| 10. Número másico. | ✓ | 3 | — | — | Parcial |
| 11. Isótopos. | ✓ | 3 | — | — | Parcial |
| 12. Isóbaros. | ✓ | 3 | — | — | Parcial |
| 13. Isótonos. | ✓ | 3 | — | — | Parcial |
| 14. Iones. | ✓ | 3 | 2 | — | Parcial |
| 15. Masa atómica. | ✓ | 3 | 1 | — | Parcial |
| 16. Unidad de masa atómica. | ✓ | 3 | 1 | — | Parcial |
| 17. Radiación electromagnética. | ✓ | 3 | — | — | Parcial |
| 18. Espectros atómicos. | ✓ | 3 | — | — | Parcial |
| 19. Números cuánticos. | ✓ | 3 | 1 | — | Parcial |
| 20. Orbitales atómicos. | ✓ | 3 | 1 | — | Parcial |
| 21. Principio de Aufbau. | ✓ | 3 | 1 | — | Parcial |
| 22. Principio de exclusión de Pauli. | ✓ | 3 | 1 | — | Parcial |
| 23. Regla de Hund. | ✓ | 3 | 1 | — | Parcial |
| 24. Configuración electrónica. | ✓ | 3 | 1 | — | Parcial |
| 25. Electrones de valencia. | ✓ | 3 | 2 | — | Parcial |

### Bloque 3 · Tabla periódica

Lecciones por capas 23/23 · Prácticas nuevas 23/23 (69) · Simulaciones 19/23 · Por revisar 0 · Estados: Parcial 23.

| Subtema | Lección por capas | Prácticas nuevas | Otros recursos confirmados | Simulaciones | Estado |
|---|---|---|---|---|---|
| 1. Historia de la clasificación periódica. | ✓ | 3 | 1 | — | Parcial |
| 2. Ley periódica moderna. | ✓ | 3 | 1 | — | Parcial |
| 3. Grupos y periodos. | ✓ | 3 | 1 | — | Parcial |
| 4. Bloques s, p, d y f. | ✓ | 3 | 1 | — | Parcial |
| 5. Metales. | ✓ | 3 | 1 | — | Parcial |
| 6. No metales. | ✓ | 3 | 1 | — | Parcial |
| 7. Metaloides. | ✓ | 3 | 1 | — | Parcial |
| 8. Alcalinos. | ✓ | 3 | 1 | — | Parcial |
| 9. Alcalinotérreos. | ✓ | 3 | 1 | — | Parcial |
| 10. Halógenos. | ✓ | 3 | 1 | — | Parcial |
| 11. Gases nobles. | ✓ | 3 | 1 | — | Parcial |
| 12. Metales de transición. | ✓ | 3 | 1 | — | Parcial |
| 13. Lantánidos. | ✓ | 3 | 1 | — | Parcial |
| 14. Actínidos. | ✓ | 3 | 1 | — | Parcial |
| 15. Radio atómico. | ✓ | 3 | — | — | Parcial |
| 16. Radio iónico. | ✓ | 3 | — | — | Parcial |
| 17. Energía de ionización. | ✓ | 3 | — | — | Parcial |
| 18. Afinidad electrónica. | ✓ | 3 | — | — | Parcial |
| 19. Electronegatividad. | ✓ | 3 | 3 | — | Parcial |
| 20. Carácter metálico. | ✓ | 3 | 1 | — | Parcial |
| 21. Estados de oxidación. | ✓ | 3 | 2 | — | Parcial |
| 22. Tendencias periódicas. | ✓ | 3 | 1 | — | Parcial |
| 23. Predicción de propiedades químicas. | ✓ | 3 | — | — | Parcial |

### Bloque 4 · Enlace químico

Lecciones por capas 22/22 · Prácticas nuevas 22/22 (66) · Simulaciones 20/22 · Por revisar 0 · Estados: Parcial 22.

| Subtema | Lección por capas | Prácticas nuevas | Otros recursos confirmados | Simulaciones | Estado |
|---|---|---|---|---|---|
| 1. Electrones de valencia. | ✓ | 3 | 2 | — | Parcial |
| 2. Regla del octeto. | ✓ | 3 | 1 | — | Parcial |
| 3. Estructuras de Lewis. | ✓ | 3 | 1 | — | Parcial |
| 4. Carga formal. | ✓ | 3 | 1 | — | Parcial |
| 5. Resonancia. | ✓ | 3 | — | — | Parcial |
| 6. Enlace iónico. | ✓ | 3 | 2 | — | Parcial |
| 7. Enlace covalente. | ✓ | 3 | 2 | — | Parcial |
| 8. Enlace covalente coordinado. | ✓ | 3 | 1 | — | Parcial |
| 9. Enlace metálico. | ✓ | 3 | 1 | — | Parcial |
| 10. Polaridad de enlace. | ✓ | 3 | 2 | — | Parcial |
| 11. Momento dipolar. | ✓ | 3 | 1 | — | Parcial |
| 12. Geometría molecular. | ✓ | 3 | 2 | — | Parcial |
| 13. Teoría VSEPR. | ✓ | 3 | 2 | — | Parcial |
| 14. Hibridación de orbitales. | ✓ | 3 | 1 | — | Parcial |
| 15. Enlaces sigma. | ✓ | 3 | 2 | — | Parcial |
| 16. Enlaces pi. | ✓ | 3 | 2 | — | Parcial |
| 17. Fuerzas de dispersión de London. | ✓ | 3 | 3 | — | Parcial |
| 18. Interacciones dipolo-dipolo. | ✓ | 3 | 3 | — | Parcial |
| 19. Enlaces de hidrógeno. | ✓ | 3 | 3 | — | Parcial |
| 20. Fuerzas intermoleculares. | ✓ | 3 | 3 | — | Parcial |
| 21. Relación entre enlace y propiedades. | ✓ | 3 | — | — | Parcial |
| 22. Introducción a orbitales moleculares. | ✓ | 3 | — | — | Parcial |

### Bloque 5 · Nomenclatura inorgánica

Lecciones por capas 20/20 · Prácticas nuevas 20/20 (60) · Simulaciones 6/20 · Por revisar 0 · Estados: Parcial 20.

| Subtema | Lección por capas | Prácticas nuevas | Otros recursos confirmados | Simulaciones | Estado |
|---|---|---|---|---|---|
| 1. Símbolos químicos. | ✓ | 3 | 1 | — | Parcial |
| 2. Valencia y número de oxidación. | ✓ | 3 | 2 | — | Parcial |
| 3. Nomenclatura sistemática. | ✓ | 3 | 2 | — | Parcial |
| 4. Nomenclatura de Stock. | ✓ | 3 | 2 | — | Parcial |
| 5. Nomenclatura tradicional. | ✓ | 3 | 2 | — | Parcial |
| 6. Óxidos metálicos. | ✓ | 3 | 2 | — | Parcial |
| 7. Óxidos no metálicos. | ✓ | 3 | 2 | — | Parcial |
| 8. Peróxidos. | ✓ | 3 | 2 | — | Parcial |
| 9. Hidruros. | ✓ | 3 | 2 | — | Parcial |
| 10. Hidróxidos. | ✓ | 3 | 2 | — | Parcial |
| 11. Ácidos hidrácidos. | ✓ | 3 | 2 | — | Parcial |
| 12. Oxoácidos. | ✓ | 3 | 2 | — | Parcial |
| 13. Sales binarias. | ✓ | 3 | 2 | — | Parcial |
| 14. Oxisales. | ✓ | 3 | 2 | — | Parcial |
| 15. Sales ácidas. | ✓ | 3 | 2 | — | Parcial |
| 16. Sales básicas. | ✓ | 3 | — | — | Parcial |
| 17. Compuestos hidratados. | ✓ | 3 | 2 | — | Parcial |
| 18. Fórmulas químicas. | ✓ | 3 | 2 | — | Parcial |
| 19. Formulación de compuestos. | ✓ | 3 | 2 | — | Parcial |
| 20. Interpretación de nombres químicos. | ✓ | 3 | 2 | — | Parcial |

### Bloque 6 · Reacciones químicas

Lecciones por capas 20/20 · Prácticas nuevas 20/20 (60) · Simulaciones 15/20 · Por revisar 0 · Estados: Parcial 20.

| Subtema | Lección por capas | Prácticas nuevas | Otros recursos confirmados | Simulaciones | Estado |
|---|---|---|---|---|---|
| 1. Concepto de reacción química. | ✓ | 3 | 1 | — | Parcial |
| 2. Reactivos y productos. | ✓ | 3 | 1 | — | Parcial |
| 3. Ecuaciones químicas. | ✓ | 3 | 1 | — | Parcial |
| 4. Ley de conservación de la masa. | ✓ | 3 | 1 | — | Parcial |
| 5. Balanceo por tanteo. | ✓ | 3 | 2 | — | Parcial |
| 6. Balanceo algebraico. | ✓ | 3 | 1 | — | Parcial |
| 7. Balanceo redox. | ✓ | 3 | 2 | — | Parcial |
| 8. Reacciones de síntesis. | ✓ | 3 | 1 | — | Parcial |
| 9. Reacciones de descomposición. | ✓ | 3 | 1 | — | Parcial |
| 10. Desplazamiento simple. | ✓ | 3 | 1 | — | Parcial |
| 11. Doble desplazamiento. | ✓ | 3 | 1 | — | Parcial |
| 12. Precipitación. | ✓ | 3 | — | 1 | Parcial |
| 13. Neutralización. | ✓ | 3 | 1 | 1 | Parcial |
| 14. Combustión. | ✓ | 3 | 1 | — | Parcial |
| 15. Reacciones reversibles. | ✓ | 3 | — | 1 | Parcial |
| 16. Reacciones exotérmicas. | ✓ | 3 | — | 1 | Parcial |
| 17. Reacciones endotérmicas. | ✓ | 3 | — | 1 | Parcial |
| 18. Oxidación y reducción. | ✓ | 3 | 2 | 1 | Parcial |
| 19. Agentes oxidantes. | ✓ | 3 | 1 | 1 | Parcial |
| 20. Agentes reductores. | ✓ | 3 | 1 | 1 | Parcial |

### Bloque 7 · Estequiometría

Lecciones por capas 21/21 · Prácticas nuevas 21/21 (63) · Simulaciones 10/21 · Por revisar 0 · Estados: Parcial 21.

| Subtema | Lección por capas | Prácticas nuevas | Otros recursos confirmados | Simulaciones | Estado |
|---|---|---|---|---|---|
| 1. Concepto de mol. | ✓ | 3 | 1 | — | Parcial |
| 2. Número de Avogadro. | ✓ | 3 | 1 | — | Parcial |
| 3. Masa molar. | ✓ | 3 | 1 | — | Parcial |
| 4. Masa molecular. | ✓ | 3 | 2 | — | Parcial |
| 5. Masa fórmula. | ✓ | 3 | 1 | — | Parcial |
| 6. Composición porcentual. | ✓ | 3 | 1 | — | Parcial |
| 7. Fórmula empírica. | ✓ | 3 | — | — | Parcial |
| 8. Fórmula molecular. | ✓ | 3 | — | — | Parcial |
| 9. Relaciones mol-mol. | ✓ | 3 | 1 | — | Parcial |
| 10. Relaciones masa-masa. | ✓ | 3 | 1 | — | Parcial |
| 11. Relaciones masa-mol. | ✓ | 3 | 1 | — | Parcial |
| 12. Relaciones volumen-volumen. | ✓ | 3 | — | — | Parcial |
| 13. Reactivo limitante. | ✓ | 3 | 1 | — | Parcial |
| 14. Reactivo en exceso. | ✓ | 3 | 1 | — | Parcial |
| 15. Rendimiento teórico. | ✓ | 3 | 1 | — | Parcial |
| 16. Rendimiento real. | ✓ | 3 | 1 | — | Parcial |
| 17. Rendimiento porcentual. | ✓ | 3 | 1 | — | Parcial |
| 18. Pureza de reactivos. | ✓ | 3 | — | — | Parcial |
| 19. Estequiometría de mezclas. | ✓ | 3 | — | — | Parcial |
| 20. Estequiometría de gases. | ✓ | 3 | — | — | Parcial |
| 21. Problemas con reacciones consecutivas. | ✓ | 3 | — | — | Parcial |

### Bloque 8 · Gases

Lecciones por capas 20/20 · Prácticas nuevas 20/20 (60) · Simulaciones 12/20 · Por revisar 0 · Estados: Parcial 20.

| Subtema | Lección por capas | Prácticas nuevas | Otros recursos confirmados | Simulaciones | Estado |
|---|---|---|---|---|---|
| 1. Propiedades de los gases. | ✓ | 3 | — | — | Parcial |
| 2. Presión gaseosa. | ✓ | 3 | — | — | Parcial |
| 3. Presión atmosférica. | ✓ | 3 | — | — | Parcial |
| 4. Ley de Boyle. | ✓ | 3 | — | — | Parcial |
| 5. Ley de Charles. | ✓ | 3 | — | — | Parcial |
| 6. Ley de Gay-Lussac. | ✓ | 3 | — | — | Parcial |
| 7. Ley de Avogadro. | ✓ | 3 | — | — | Parcial |
| 8. Ley combinada de los gases. | ✓ | 3 | — | — | Parcial |
| 9. Ecuación del gas ideal. | ✓ | 3 | — | — | Parcial |
| 10. Densidad de gases. | ✓ | 3 | — | — | Parcial |
| 11. Masa molar de gases. | ✓ | 3 | — | — | Parcial |
| 12. Presiones parciales. | ✓ | 3 | 1 | — | Parcial |
| 13. Ley de Dalton. | ✓ | 3 | — | — | Parcial |
| 14. Volumen molar. | ✓ | 3 | — | — | Parcial |
| 15. Teoría cinético-molecular. | ✓ | 3 | — | — | Parcial |
| 16. Velocidad molecular. | ✓ | 3 | — | — | Parcial |
| 17. Difusión gaseosa. | ✓ | 3 | — | — | Parcial |
| 18. Efusión. | ✓ | 3 | — | — | Parcial |
| 19. Ley de Graham. | ✓ | 3 | — | — | Parcial |
| 20. Desviaciones del comportamiento ideal. | ✓ | 3 | — | — | Parcial |

### Bloque 9 · Soluciones y concentraciones

Lecciones por capas 20/20 · Prácticas nuevas 20/20 (60) · Simulaciones 16/20 · Por revisar 0 · Estados: Parcial 20.

| Subtema | Lección por capas | Prácticas nuevas | Otros recursos confirmados | Simulaciones | Estado |
|---|---|---|---|---|---|
| 1. Soluto y disolvente. | ✓ | 3 | — | — | Parcial |
| 2. Tipos de soluciones. | ✓ | 3 | — | — | Parcial |
| 3. Solubilidad. | ✓ | 3 | — | 1 | Parcial |
| 4. Factores que afectan la solubilidad. | ✓ | 3 | — | — | Parcial |
| 5. Soluciones saturadas. | ✓ | 3 | — | 1 | Parcial |
| 6. Soluciones insaturadas. | ✓ | 3 | — | 1 | Parcial |
| 7. Soluciones sobresaturadas. | ✓ | 3 | — | 1 | Parcial |
| 8. Porcentaje en masa. | ✓ | 3 | — | — | Parcial |
| 9. Porcentaje en volumen. | ✓ | 3 | — | — | Parcial |
| 10. Porcentaje masa-volumen. | ✓ | 3 | — | — | Parcial |
| 11. Molaridad. | ✓ | 3 | 1 | — | Parcial |
| 12. Molalidad. | ✓ | 3 | — | — | Parcial |
| 13. Fracción molar. | ✓ | 3 | — | — | Parcial |
| 14. Normalidad y equivalentes. | ✓ | 3 | — | — | Parcial |
| 15. Partes por millón. | ✓ | 3 | — | — | Parcial |
| 16. Partes por mil millones. | ✓ | 3 | — | — | Parcial |
| 17. Diluciones. | ✓ | 3 | 1 | 1 | Parcial |
| 18. Mezclas de soluciones. | ✓ | 3 | 1 | 1 | Parcial |
| 19. Preparación de soluciones. | ✓ | 3 | 1 | 1 | Parcial |
| 20. Introducción a propiedades coligativas. | ✓ | 3 | — | — | Parcial |

### Bloque 10 · Ácidos, bases y equilibrio elemental

Lecciones por capas 22/22 · Prácticas nuevas 22/22 (66) · Simulaciones 21/22 · Por revisar 0 · Estados: Parcial 22.

| Subtema | Lección por capas | Prácticas nuevas | Otros recursos confirmados | Simulaciones | Estado |
|---|---|---|---|---|---|
| 1. Definiciones de Arrhenius. | ✓ | 3 | — | — | Parcial |
| 2. Definiciones de Brønsted-Lowry. | ✓ | 3 | — | — | Parcial |
| 3. Introducción a Lewis. | ✓ | 3 | 1 | — | Parcial |
| 4. Ácidos fuertes. | ✓ | 3 | 1 | 1 | Parcial |
| 5. Ácidos débiles. | ✓ | 3 | 1 | 1 | Parcial |
| 6. Bases fuertes. | ✓ | 3 | 1 | 1 | Parcial |
| 7. Bases débiles. | ✓ | 3 | 1 | 1 | Parcial |
| 8. Autoionización del agua. | ✓ | 3 | — | — | Parcial |
| 9. pH. | ✓ | 3 | 1 | 1 | Parcial |
| 10. pOH. | ✓ | 3 | 1 | 1 | Parcial |
| 11. Producto iónico del agua. | ✓ | 3 | 1 | 1 | Parcial |
| 12. Constantes de acidez. | ✓ | 3 | 1 | 1 | Parcial |
| 13. Constantes de basicidad. | ✓ | 3 | — | — | Parcial |
| 14. Neutralización. | ✓ | 3 | 1 | 1 | Parcial |
| 15. Indicadores ácido-base. | ✓ | 3 | — | — | Parcial |
| 16. Hidrólisis de sales. | ✓ | 3 | — | — | Parcial |
| 17. Soluciones amortiguadoras. | ✓ | 3 | 1 | 1 | Parcial |
| 18. Efecto del ion común. | ✓ | 3 | — | 1 | Parcial |
| 19. Equilibrio químico. | ✓ | 3 | 1 | 1 | Parcial |
| 20. Constantes Kc y Kp. | ✓ | 3 | — | — | Parcial |
| 21. Principio de Le Châtelier. | ✓ | 3 | 1 | 1 | Parcial |
| 22. Equilibrio de solubilidad. | ✓ | 3 | — | 1 | Parcial |

### Bloque 11 · Termoquímica y electroquímica introductoria

Lecciones por capas 20/20 · Prácticas nuevas 20/20 (60) · Simulaciones 19/20 · Por revisar 0 · Estados: Parcial 20.

| Subtema | Lección por capas | Prácticas nuevas | Otros recursos confirmados | Simulaciones | Estado |
|---|---|---|---|---|---|
| 1. Calor y temperatura. | ✓ | 3 | — | — | Parcial |
| 2. Capacidad calorífica. | ✓ | 3 | — | — | Parcial |
| 3. Calor específico. | ✓ | 3 | — | — | Parcial |
| 4. Calorimetría. | ✓ | 3 | — | — | Parcial |
| 5. Entalpía. | ✓ | 3 | 1 | 1 | Parcial |
| 6. Entalpía de reacción. | ✓ | 3 | 1 | 1 | Parcial |
| 7. Ley de Hess. | ✓ | 3 | 1 | 1 | Parcial |
| 8. Entalpía de formación. | ✓ | 3 | 1 | 1 | Parcial |
| 9. Energía de enlace. | ✓ | 3 | 1 | — | Parcial |
| 10. Energía de activación. | ✓ | 3 | 1 | 1 | Parcial |
| 11. Reacciones espontáneas y no espontáneas. | ✓ | 3 | 1 | 1 | Parcial |
| 12. Entropía introductoria. | ✓ | 3 | 1 | 1 | Parcial |
| 13. Energía libre de Gibbs introductoria. | ✓ | 3 | 1 | 1 | Parcial |
| 14. Celdas galvánicas. | ✓ | 3 | — | 1 | Parcial |
| 15. Ánodo y cátodo. | ✓ | 3 | — | 1 | Parcial |
| 16. Potencial electroquímico. | ✓ | 3 | — | 1 | Parcial |
| 17. Electrólisis. | ✓ | 3 | — | — | Parcial |
| 18. Leyes de Faraday. | ✓ | 3 | — | — | Parcial |
| 19. Corrosión. | ✓ | 3 | — | — | Parcial |
| 20. Baterías y pilas. | ✓ | 3 | — | 1 | Parcial |

### Bloque 12 · Química orgánica introductoria

Lecciones por capas 22/22 · Prácticas nuevas 22/22 (66) · Simulaciones 22/22 · Por revisar 0 · Estados: Parcial 22.

| Subtema | Lección por capas | Prácticas nuevas | Otros recursos confirmados | Simulaciones | Estado |
|---|---|---|---|---|---|
| 1. Características del carbono. | ✓ | 3 | 1 | — | Parcial |
| 2. Tetravalencia. | ✓ | 3 | 1 | — | Parcial |
| 3. Cadenas carbonadas. | ✓ | 3 | 1 | — | Parcial |
| 4. Fórmulas estructurales. | ✓ | 3 | 1 | — | Parcial |
| 5. Grupos funcionales. | ✓ | 3 | 1 | — | Parcial |
| 6. Hidrocarburos. | ✓ | 3 | 1 | — | Parcial |
| 7. Alcanos. | ✓ | 3 | 1 | — | Parcial |
| 8. Alquenos. | ✓ | 3 | 1 | — | Parcial |
| 9. Alquinos. | ✓ | 3 | 1 | — | Parcial |
| 10. Hidrocarburos aromáticos. | ✓ | 3 | 1 | — | Parcial |
| 11. Isomería estructural. | ✓ | 3 | 1 | — | Parcial |
| 12. Alcoholes. | ✓ | 3 | 1 | — | Parcial |
| 13. Éteres. | ✓ | 3 | 1 | — | Parcial |
| 14. Aldehídos. | ✓ | 3 | 1 | — | Parcial |
| 15. Cetonas. | ✓ | 3 | 1 | — | Parcial |
| 16. Ácidos carboxílicos. | ✓ | 3 | 1 | — | Parcial |
| 17. Ésteres. | ✓ | 3 | 1 | — | Parcial |
| 18. Aminas. | ✓ | 3 | 1 | — | Parcial |
| 19. Amidas. | ✓ | 3 | 1 | — | Parcial |
| 20. Nomenclatura orgánica básica. | ✓ | 3 | 1 | — | Parcial |
| 21. Reacciones orgánicas elementales. | ✓ | 3 | 1 | — | Parcial |
| 22. Polímeros y biomoléculas introductorias. | ✓ | 3 | 1 | — | Parcial |

<!-- COBERTURA:FIN -->

## Registro de lotes

- **Lote 8-v2 · bloque 8 en estructura «libro» (2026-11-18): cerrado.** Contrato «libro» (decisiones 17–23), capítulo y 6 integradores, 20 ejemplos integradores, 12 figuras, escena «gas ideal» en 12 subtemas (decisión 24). Typecheck 0 errores; `npm test` 2258/2258; exhaustivo 1/1; build; informe `--comprobar` coincide; guiones `b08-libro` (149) y `b08` (119) con y sin WebGL, `entrega0` (75/75/3) y `e1` (59) en verde; perfil real intacto. Informe: `docs/ENTREGA-N1-B08-V2-LIBRO.md`.
- **Bloque 7 · Estequiometría (2026-11-18): cerrado.** 21 lecciones «libro», 63 prácticas, 6 integradores, 8 figuras, escena «reactivo limitante» (decisiones 27–31). Typecheck 0; `npm test` 2562/2562; exhaustivo 1/1; build; informe `--comprobar` coincide; `bloque-libro --bloque 7` con y sin WebGL 150/150; regresiones `bloque-libro --bloque 8` (149), `b08` (119), `e1` con y sin WebGL (59) en verde. `entrega0` falló 3 comprobaciones porque contaba todas las lecciones del índice como si fueran del bloque 8; se corrigió el guion (filtra `gas-`) y quedó en verde (75). Informe: `docs/ENTREGA-N1-B07-ESTEQUIOMETRIA.md`.
- **Bloque 9 · Soluciones y concentraciones (2026-11-18): cerrado.** 20 lecciones «libro», 60 prácticas, 6 integradores, 8 figuras, 40 ejemplos, escena «concentraciones»; Paso 0: 4 confirmaciones (escena de solubilidad) y 4 retiradas (tema `concentracion`) (decisiones 32–36). Typecheck 0; `npm test` 2853/2853; exhaustivo 1/1; build; informe `--comprobar` coincide; `bloque-libro --bloque 9` con y sin WebGL 149/149; regresiones `bloque-libro --bloque 7` (150) y `--bloque 8` (149), `b08` (119), `entrega0` (75) y `e1` (59) en verde; perfil real intacto. Informe: `docs/ENTREGA-N1-B09-SOLUCIONES.md`.
- **Bloque 10 · Ácidos, bases y equilibrio elemental (2026-11-19): cerrado.** 22 lecciones, 66 prácticas, 6 integradores, 9 figuras, 44 ejemplos, escenas «acido-base» y «equilibrio-gas»; Paso 0: 1 confirmación y 4 retiradas (decisiones 37–40). Typecheck 0; `npm test` 3171/3171; exhaustivo 1/1; build; informe `--comprobar` coincide; `bloque-libro --bloque 10` con y sin WebGL 149/149 (la primera ejecución falló por un recuento de «Simular» mal previsto y dejó Electron abierto; se corrigió y se repitió). Informe: `docs/ENTREGA-N1-B10-ACIDOS-BASES.md`.
- **Bloque 11 · Termoquímica y electroquímica (2026-11-19): cerrado.** 20 lecciones, 60 prácticas, 6 integradores, 7 figuras, 40 ejemplos, escenas «calorimetria» y «electrolisis»; Paso 0: 2 confirmaciones y 1 retirada (decisiones 41–43). Typecheck 0; `npm test` 3463/3463; exhaustivo 1/1; build; informe coincide; `bloque-libro --bloque 11` con y sin WebGL 149/149. Informe: `docs/ENTREGA-N1-B11-TERMOQUIMICA.md`.
- **Bloque 5 · Nomenclatura inorgánica (2026-11-19): cerrado.** 20 lecciones, 60 prácticas, 6 integradores, 6 figuras, 40 ejemplos, escena «formula-ionica»; Paso 0 sin por revisar (decisiones 44–47). Typecheck 0; `npm test` 3754/3754; exhaustivo 1/1; build; informe coincide; `bloque-libro --bloque 5` con y sin WebGL 150/150. Informe: `docs/ENTREGA-N1-B05-NOMENCLATURA.md`.
- **Bloque 6 · Reacciones químicas (2026-11-19): cerrado.** 20 lecciones, 60 prácticas, 6 integradores, 8 figuras, 40 ejemplos, escena «combustion» (y «reactivo-limitante» y «acido-base» ampliadas); Paso 0: 12 confirmaciones (decisiones 48–51). Typecheck 0; `npm test` 4045/4045; exhaustivo 1/1; build; informe coincide; `bloque-libro --bloque 6` con y sin WebGL 150/150. Informe: `docs/ENTREGA-N1-B06-REACCIONES.md`.
- **Bloque 1 · Fundamentos de la química (2026-11-19): cerrado.** 23 lecciones, 69 prácticas, 6 integradores, 7 figuras, 46 ejemplos, escena «densidad» (y cuatro escenas N1 ampliadas); Paso 0: 7 confirmaciones y 5 retiradas (decisiones 52–55). Typecheck 0; `npm test` 4375/4375; exhaustivo 1/1; build; informe coincide; `bloque-libro --bloque 1` con y sin WebGL 149/149. Informe: `docs/ENTREGA-N1-B01-FUNDAMENTOS.md`.
- **Bloque 2 · Estructura atómica (2026-11-19): cerrado.** 25 lecciones, 75 prácticas, 6 integradores, 7 figuras, 50 ejemplos, escenas «atomo», «espectro-hidrogeno» y «config-electronica»; Paso 0: 2 confirmaciones y 3 retiradas (decisiones 56–61). Typecheck 0; `npm test` 4733/4733; exhaustivo 1/1; build; informe coincide; `bloque-libro --bloque 2` con y sin WebGL 149/149. Incidencias: 65 textos cortos de lecciones y 14 pistas o métodos cortos alargados; 4 prácticas con menos de 12 variantes (lista de emisores beta ampliada, errores típicos sustituidos, intervalo ampliado); la comprobación de la escena «atomo» no redondeaba los valores de muestreo (corregida en la prueba). Informe: `docs/ENTREGA-N1-B02-ATOMO.md`.
- **Bloque 3 · Tabla periódica (2026-11-19): cerrado.** 23 lecciones, 69 prácticas, 6 integradores, 7 figuras, 46 ejemplos, escena «tendencias-periodicas» (y «config-electronica» y «atomo» ampliadas); Paso 0: 5 confirmaciones y 1 retirada (decisiones 62–66). Typecheck 0; `npm test` 5064/5064; exhaustivo 1/1; build; informe coincide; `bloque-libro --bloque 3` con y sin WebGL 149/149. Incidencias: 9 retroalimentaciones cortas alargadas; una práctica con 11 variantes (se sustituyó un error típico que coincidía con otro); se quitó de la lección de afinidad un enlace a la tabla que no mostraba ese dato. Informe: `docs/ENTREGA-N1-B03-TABLA.md`. Después del cierre se añadió una prueba que contrasta los valores recordados con los datos con fuente del núcleo.
- **Bloque 4 · Enlace químico (2026-11-19): cerrado.** 22 lecciones, 66 prácticas, 6 integradores, 8 figuras, 44 ejemplos y cinco escenas nuevas; Paso 0: 9 confirmaciones y 1 retirada (decisiones 67–71). Typecheck 0; `npm test` 5387/5387; exhaustivo 1/1; build; informe coincide; `bloque-libro --bloque 4` con y sin WebGL 149/149. Incidencias: 9 retroalimentaciones cortas y una pista corta; 5 prácticas con menos de 12 variantes (se añadieron especies, pares de compuestos y reacciones, y se sustituyeron errores típicos que coincidían); un enunciado componía fórmulas juntando símbolos y daba fórmulas falsas (se reescribió antes de ejecutar); los iones con Mn y Cr se excluyeron de dos prácticas. Informe: `docs/ENTREGA-N1-B04-ENLACE.md`.
- **Bloque 12 · Química orgánica introductoria (2026-11-19): cerrado. Último de la META.** 22 lecciones, 66 prácticas, 6 integradores, 7 figuras, 44 ejemplos y tres escenas nuevas; Paso 0: 4 confirmaciones (decisiones 72–76). Typecheck 0; `npm test` 5710/5710 (85 archivos); exhaustivo 1/1; build; informe coincide; `bloque-libro --bloque 12` con y sin WebGL 149/149. Incidencias: dos retroalimentaciones cortas; la plantilla de moléculas de las pruebas fallaba con familias de un carbono (corregida en la prueba, no afectaba a la app); se hallaron lecturas erróneas del analizador de fórmulas semidesarrolladas del núcleo, que no se tocó (decisión 76); parte de los nombres no los reconoce el analizador de nomenclatura y se comprueban solo por fórmula. Informe: `docs/ENTREGA-N1-B12-ORGANICA.md`.

## Qué no se ha verificado (acumulado)

- Ninguna lección, enunciado ni mensaje de error típico ha sido revisado por una persona docente.
- Las secciones de OpenStax *Chemistry 2e* citadas son «sin verificar»: no se abrieron; el título se recuerda de la estructura del libro.
- Lector de pantalla real (NVDA, Narrador): sin probar; la accesibilidad de ecuaciones, figuras y escenas está comprobada solo estructuralmente.
- Ecuaciones: solo en Windows 11 con Cambria Math; otros sistemas, sin probar.
- Botón «Copiar el texto» de las escenas N1: implementado, no pulsado por el guion.
- Bloque 12: los nombres que el analizador de nomenclatura del núcleo no reconoce (aromáticos de varios anillos, aminas secundarias y terciarias, amidas N-sustituidas, éteres de seis y ocho carbonos, productos halogenados de adición) se comprueban solo por su fórmula; las fórmulas de los monómeros y de los aminoácidos de s22 son recordadas y no tienen estructura contrastada.
