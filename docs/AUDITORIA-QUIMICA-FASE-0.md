# Auditoría de Química para Todos · Fase 0

Fecha: 2026-11-16. Solo lectura: no se modificó código, datos, dependencias ni almacenamiento; no se hicieron commits. Se crearon únicamente este documento y `docs/TEMARIO-MAESTRO.md`. No se usó la red ni se consultó ninguna fuente nueva: todo lo que dice «fuente» o «verificación» viene de lo que el propio proyecto ya declara (código, `docs/`, `licencias/`), y se indica cuando no lo abrí yo.

Método y límites: leí el código de los módulos `simulador-quimica`, `tabla-periodica` y `laboratorio`, los documentos `docs/*.md` y `licencias/*`, y ejecuté la línea base. **No abrí la app en pantalla** en esta fase ni recorrí cada lección o escena; las afirmaciones sobre «qué muestra» se apoyan en el código y en los informes de entregas anteriores. Los «confirmado» del mapa significan «el proyecto tiene un recurso específico que trata ese subtema», **no** «completado» ni «verificado»: la correspondencia no evalúa la calidad ni la fuente del recurso.

## 1. Línea base (resultado literal)

| Comando | Resultado |
|---|---|
| `npm run typecheck` | sin errores (salida de `tsc` vacía, código 0) |
| `npm test` | `Test Files 64 passed (64)` · `Tests 1817 passed (1817)` · duración 11,86 s |
| `npm run test:exhaustivo` | `Test Files 1 passed (1)` · `Tests 1 passed (1)` |
| `npm run build` | `✓ built in 443ms`, código 0 (`electron-vite build` regeneró `out/`, artefacto de compilación) |

Todo verde; no hubo que detenerse. (Las entregas anteriores contaban 1478 y luego más pruebas: 1817 es el estado actual.)

## 2. Auditoría de lo existente

### 2.1 Estructura de la app

Módulo `simulador-quimica` (menú: Catálogo → Aprender → Prácticas por nivel → Simulación → Casos reales → Mesa molecular), módulo `tabla-periodica` («Consulta») y módulo `laboratorio` (Cuaderno y «Datos y estadística»). Rutas `#/simulador-quimica/<sub>`: `catalogo`, `aprender`, `practicas`, `simulacion`, escenas (`acidobase`, `mezcla`, `cinetica`, `equilibrio`, `termo`, `dilucion`, `colorimetria`, `solubilidad`, `electroquimica`, `isomeros`, `mesalibre`), `casos`, `mesa`, `enlaces`, `formulacion`, `reacciones`; alias antiguos `ejercicios` y `experimentos`; enlaces profundos `practicas-<tema>` y `aprender-<tema>` (fuente: `docs/QUIMICA-NIVELES-Y-EJERCICIOS.md`, `src/renderer/modules/simulador-quimica/menu.ts`).

### 2.2 Niveles actuales (4)

`preuniversitario`, `universitario`, `quimico`, `cientifico` (`practica/niveles.ts`). Son **niveles de dificultad de una práctica**, no de currículo: un mismo tema (p. ej. pH) tiene ejercicios en los cuatro. Preferencia en `ciencia.nivel.simulador-quimica` (migra desde `quimica.nivel` básico/avanzado, que no se borra); atajos de teclado `1`–`4`. La Mesa usa además «Básico / Avanzado» (`rengDetalleDeNivel`).

### 2.3 Los 22 temas con corrección

5 ramas, 22 temas (`practica/banco.ts`, `RENG_TEMAS`), 32 familias de ejercicios (22 originales + 10 de razonamiento con 45 variantes) y una lección por tema. Todos los datos de los enunciados son **didácticos** (ninguna medición publicada; `docs/DATOS.md`). Niveles = unión de los niveles de las familias del tema (leído en el código).

| Rama | Tema (id) | Niveles con práctica | Escena asociada | Lección | Depende de |
|---|---|---|---|---|---|
| General | Mol y masa molar (`mol`) | 1–4 | — | sí | masas atómicas de la tabla (fuente no registrada) |
| General | Concentración y dilución (`concentracion`) | 1–4 | — | sí | `mol`; masas atómicas |
| General | Ajuste de ecuaciones (`ajuste`) | 1–3 | — | sí | `nucleo/ajuste.ts` |
| General | Estequiometría y rendimiento (`estequiometria`) | 1–3 | — | sí | `mol`, `ajuste` |
| Inorgánica | Formular y nombrar (`formular-nombrar`) | 1–3 (componente heredado) | — | sí | `nucleo/nomenclatura.ts`; **no participa en el progreso guardado** |
| Inorgánica | Números de oxidación (`oxidacion`) | 1–3 | — | sí | `formular-nombrar` |
| Inorgánica | Enlace iónico y covalente (`enlace`) | 1–3 | — | sí | electronegatividades de `nucleo/electronegatividad.ts` |
| Inorgánica | Redox y semirreacciones (`redox`) | 1–3 | — (Electroquímica existe pero no está enlazada al tema) | sí | `oxidacion`, `ajuste` |
| Orgánica | Grupos funcionales (`grupos`) | 1–2 | — | sí | openchemlib, `nucleo/organica.ts` |
| Orgánica | Nomenclatura IUPAC (`nomenclatura`) | 1–3 | — | sí | `nucleo/organica.ts` |
| Orgánica | Escribir estructuras (`estructura`) | 1–3 | — | sí | openchemlib |
| Orgánica | Isomería constitucional (`isomeria`) | 1–3 | — | sí | recuentos de isómeros «de libro» |
| Orgánica | Estereoquímica R/S y E/Z (`estereo`) | 2–3 | — | sí | openchemlib (CIP) |
| Orgánica | Reacciones orgánicas (`reacciones-organicas`) | 1–3 | — | sí | lista de reacciones escrita a mano |
| Analítica | pH de ácidos y bases (`ph`) | 1–4 | `acidobase` | sí | pKa (Wikipedia / libro sin consultar) |
| Analítica | Valoración ácido–base (`valoracion`) | 1–4 | `mezcla` | sí | `ph` |
| Analítica | Dilución y patrones (`dilucion`) | 1–3 | `dilucion` | sí | `concentracion` |
| Analítica | Calibración e incertidumbre (`calibracion`) | 3–4 | `colorimetria` | sí | `dilucion`; regresión de `solucionadores.ts` |
| Fisicoquímica | Cinética química (`cinetica`) | 1–3 | `cinetica` | sí | R (CODATA 2018) |
| Fisicoquímica | Equilibrio químico (`equilibrio`) | 1–4 | `equilibrio` | sí | K ilustrativas (no medidas) |
| Fisicoquímica | Termoquímica y energía libre (`termo`) | 1–4 | `termo` | sí | ΔfH° (Wikipedia, 12 sustancias), S° sin consultar |
| Fisicoquímica | Ajuste de datos cinéticos (`ajuste-cinetico`) | 3–4 | `cinetica` | sí | `cinetica`, `calibracion` |

Corrección (`practica/correccion.ts`, `numeros.ts`): tipos de respuesta `numero` (con unidad y conversión), `formula`, `nombre`, `ecuacion`, `estructura` y `opcion`; veredictos `correcto`, `incorrecto`, `entrada-invalida`, `unidad-incompatible`, `ambigua`, `simplificable`. Verificación declarada: las pruebas recalculan cada respuesta por otro camino (`docs/ENTREGA-C-PRACTICAS.md`). **No reverifiqué esas pruebas más allá de que pasan hoy.**

### 2.4 Aprender

22 lecciones (`aprender/lecciones/*.ts`), cada una con objetivo, conceptos, ejemplo resuelto, comprobación, `porNivel`, prerrequisitos (sin ciclos), «observar» y fuentes; 5 recorridos completos (uno por rama); ruta de iniciación de 10 lecciones; progreso en `ciencia.aprender.simulador-quimica` (v1). **Fuentes declaradas**: OpenStax *Chemistry 2e* (CC BY-NC-SA 4.0, **solo se consultó el índice** del capítulo, no el contenido), CIAAW *Standard Atomic Weights 2024* (valores abreviados) e IUPAC Gold Book (definiciones leídas en resultados del buscador; una lectura directa dio 403). El texto es propio y **no está revisado por un docente** (`docs/ENTREGA-B-APRENDER.md`). Dependen del banco: `porNivel` debe coincidir con los niveles del tema (prueba).

### 2.5 Prácticas

Motor en capas (bancos → generadores por familia con semilla → solucionadores → corrección → vista → estado). Identidad de un ejercicio: `ejercicioId = familia~nivel~semilla` y `huella` (hash FNV-1a del contenido generado). Persistencia `ciencia.practica.simulador-quimica` v2 (borrador separado del logro: Pendiente / Revisada / Resuelta, aciertos y repeticiones). Los registros v1 se resuelven con la lista **congelada** de las 22 familias originales (`RENG_FAMILIAS_ORIGINALES`) contra la instantánea `tests/fixtures/practica-v1-instantanea.json` (3 840 filas).

### 2.6 Laboratorio virtual

Diez escenas del marco (ficha de modelo versionada, validación, diagnósticos, guardado y reapertura en el Cuaderno), más la Mesa libre fuera del marco. Evidencia declarada en `RENG_MODELOS_ESCENA` (leída en el código):

| Escena | Núcleo | Evidencia declarada | Fuentes y límites declarados |
|---|---|---|---|
| Ácidos y bases (`acidobase`) | `nucleo/acidoBase.ts` | cálculo verificado | pKa acético y fosfórico y pKw de Wikipedia/CRC (consulta secundaria); HF, fórmico, NH₄⁺ «libro sin consultar» |
| Mezcla ácido–base (`mezcla`) | `nucleo/mezclaAcidoBase.ts` | cálculo verificado | idem; balance de carga con Kw = 10⁻¹⁴ |
| Velocidad de reacción (`cinetica`) | `nucleo/cinetica.ts` | modelo calculado | R CODATA 2018; datos didácticos |
| Equilibrio (`equilibrio`) | `nucleo/equilibrio.ts` | modelo calculado | K ilustrativas, **no medidas** |
| Isómeros (`isomeros`) | `nucleo/isomeros.ts`, `datos/isomeros.ts` (4 pares) | modelo calculado | geometría MMFF94s de openchemlib; licencia de los parámetros **sin verificar** |
| Electroquímica (`electroquimica`) | `nucleo/electroquimica.ts` | cálculo verificado | 6 potenciales (Wikipedia, CC BY-SA 4.0 con «términos adicionales»), F y R (CODATA, términos de uso de NIST sin abrir) |
| Solubilidad (`solubilidad`) | `nucleo/solubilidad.ts` | cálculo verificado | 3 Ksp de Harvey (CC BY-NC-SA 4.0) |
| Colorimetría (`colorimetria`) | `nucleo/colorimetria.ts` | cálculo verificado | datos de ejemplo; recomendación de absorbancia 0,1–0,8 sin licencia registrada |
| Dilución (`dilucion`) | `nucleo/dilucion.ts` | cálculo verificado | valores didácticos propios |
| Energía de reacción (`termo`) | `nucleo/termoquimica.ts` | modelo calculado | ΔfH° Wikipedia (12 sustancias); S° y K sin verificar |

**Mesa libre** (`practica/mesaLibre.ts`, `modos/MesaLibre.tsx`): superficie dentro de Simulación, **no** escena del marco, no escribe en el Cuaderno. Regla estricta de peligro (`rengPoliticaMesa`): una sustancia solo se puede poner si el catálogo de peligros tiene al menos una ficha contrastada y **todas** dicen «Sin clasificación de peligro según la fuente»; hoy son 8 (agua, cloruro de sodio, glucosa, glicerina, carbonato de calcio, hidrogenocarbonato de sodio, óxido de magnesio, sulfato de magnesio heptahidratado), fijadas por una prueba. Cualquier otra combinación responde «No hay datos o modelo para predecir esta mezcla» sin cifras. **Isómeros**: 4 pares (cis/trans-but-2-eno, etanol/éter dimetílico, butano/isobutano, propan-1-ol/propan-2-ol); sin camino a la Mesa libre.

### 2.7 Mesa molecular, tabla periódica, catálogo de sustancias y casos

- **Mesa molecular**: Construir, Enlaces (iónico, covalente, dativo —4 ejemplos—, metálico, múltiple, intermoleculares, secuencias), Formulación (tres nomenclaturas: sistemática, Stock, tradicional; 18 funciones inorgánicas), Reacciones (10 conocidas, cuyas referencias a Greenwood–Earnshaw y Petrucci **nadie abrió**), visor 2D/3D (openchemlib), historial, glosario (37 entradas con fuente IUPAC Gold Book / Libro Rojo), 11 estructuras cristalinas.
- **Tabla periódica**: 118 elementos con símbolo, nombre, masa (**fuente no registrada, sin verificar**), categoría y posición; ficha con configuración electrónica **calculada por Aufbau, sin contrastar**, fusión/ebullición/densidad/año de Wikidata (CC0, con marca de referencia), electronegatividad y estados de oxidación de PubChem, peligros GHS.
- **Catálogo de sustancias**: biblioteca de **104** sustancias (9 categorías: 20 gases, 14 ácidos, 5 bases, 19 sales, 1 otras inorgánicas, 21 orgánicas, 7 biomoléculas, 7 fármacos, 10 elementos; contadas con `grep`), 13 «cotidianos» (vinagre, azúcar…) y **114 entradas** en el catálogo de peligros (edición `2026-11-09.1`: 104 de la biblioteca; 95 verificadas, 3 parciales, 16 pendientes; 103 formas con ficha contrastada). «114 sustancias» del encargo = esas 114 entradas del catálogo de peligros (`docs/TABLA-PERIODICA-PELIGROS.md`, `docs/ENTREGA-D-LABORATORIO.md`). Clasificación de la Mesa libre sobre ellas: 53 «Peligro», 29 «Peligros documentados», 8 «Atención», 16 sin ficha, 8 permitidas.
- **Casos reales**: 15 casos (naturaleza 4, espacio 5, hogar 2, Tesla 4), cada afirmación «consultada» (con fuente y fecha) o «conocimiento general»; algunas fuentes solo se vieron en resumen de búsqueda (marcadas en ámbar).

### 2.8 Cuaderno y almacenamiento

**Cuaderno** (módulo `laboratorio`, `src/shared/cuaderno.ts`, `src/main/modules/laboratorio`): esquema `ciencia-sin-limites/cuaderno` **versión 1** (compatible con proyectos de la app original); `RengProyecto` con `corridas` (modelo con id y versión, parámetros, serie, resultados, diagnósticos, fuentes, estado, `origen`) y `mediciones`; límites (500 corridas, 200 mediciones, 100 000 filas…); guarda en `<userData>/cuaderno/<id>.json`, id validado `^[a-z0-9][a-z0-9-]{7,63}$`; niveles de evidencia `modelo-calculado`, `calculo-verificado`, `comparado-con-mediciones`. Incluye importador/comparador CSV y «Datos y estadística» (descriptiva, histograma, regresión lineal, evaluador de expresiones con derivada e integral numéricas).

**Claves de almacenamiento halladas en el código** (`grep`; el tipo de almacén de las marcadas con * no lo abrí una a una):

| Clave | Contenido | Almacén |
|---|---|---|
| `ciencia.nivel.simulador-quimica` | nivel preferido (4 valores) | localStorage |
| `quimica.nivel` | nivel antiguo `basico/avanzado` (se sigue escribiendo, no se borra) | localStorage |
| `ciencia.practica.simulador-quimica` | prácticas v2: borrador, pendientes (≤ 5) y logros | localStorage* |
| `ciencia.aprender.simulador-quimica` | progreso de lecciones v1 | localStorage* |
| `quimica.historial` | historial de la Mesa (máx. 50) | localStorage* |
| `quimica.transferencia-activa` | transferencia práctica → escena | sessionStorage según `docs/ENTREGA-D-LABORATORIO.md` |
| `quimica.recorrido.visto` | recorrido inicial visto | localStorage* |
| `ciencia.menu`, `ciencia.trabajo-reciente`, `ciencia.unidades-propias` | menú, accesos recientes y unidades propias (shell/lib compartida) | localStorage* |
| petición de reapertura del Cuaderno | `sessionStorage` (`lib/cuaderno/reapertura.ts`) | sessionStorage |

### 2.9 Qué NO debe tocarse sin una decisión explícita de la persona responsable

1. **Cuaderno**: esquema y versión 1, límites, formato de ids, `RengModeloCorrida` (id, versión `'1'` de cada escena), listas de categorías congeladas (`RENG_CODIGOS_V1`) y los tres valores de `evidencia`.
2. **Huella y persistencia de Prácticas**: `ciencia.practica.simulador-quimica` v2, la forma `familia~nivel~semilla`, el cálculo de `huella`, los ids de familia, `RENG_FAMILIAS_ORIGINALES` (congelada) y la instantánea de 3 840 filas. Cualquier cambio en los generadores que altere enunciado, datos u orden de opciones cambia la huella y descarta borradores guardados con aviso. La semilla de cada intento depende de `${familia.id}|${nivel}|${semilla}|${intento}`.
3. **Reglas de peligro de la Mesa libre**: `rengPoliticaMesa`, `RENG_ROLES_MESA` y la prueba que fija las 8 sustancias permitidas (relajarlas requiere antes una ficha contrastada que hoy no existe).
4. **Niveles**: `ciencia.nivel.simulador-quimica`, la migración desde `quimica.nivel` y las teclas 1–4.
5. **Progreso de Aprender** v1 y los ids de tema/ruta (`#/simulador-quimica/aprender-<tema>`).
6. **Límites de licencias** (`licencias/PENDIENTES-ANTES-DE-DISTRIBUIR.md`): Ksp CC BY-NC-SA (3 + tablas de contraste), potenciales CC BY-SA con términos adicionales, F y R de NIST sin verificar, MMFF94 sin verificar, masas atómicas sin fuente registrada. No añadir más datos de esas fuentes sin decidir.
7. **Catálogo de peligros** (versión `2026-11-09.1`; las pruebas fijan totales) y los pictogramas.

## 3. Mapa de correspondencias propuesto (temario ↔ lo que ya existe)

Resumen y criterios:

- **Subtema «confirmado»**: hay un tema, escena, función o dato **específico** que lo trata de forma directa.
- **Subtema «por revisar»**: hay relación parcial o indirecta (el recurso lo toca pero no lo enseña, solo hay un ejemplo, o solo existe como herramienta o dato). Ante la duda, «por revisar».
- **Subtema «sin contenido»**: no hay ningún recurso conocido.
- **Bloque «confirmado»** si ≥ 40 % de sus subtemas están confirmados; **«por revisar»** si tiene alguno confirmado o por revisar pero menos; **«sin contenido»** si ninguno. El 40 % es un umbral mío, a revisar.
- La asignación subtema a subtema es **mi lectura del código y los documentos**, no una prueba automática ni una revisión docente. «Confirmado» no implica que la lección sea completa.

**Totales (1 504 subtemas)**: **163 confirmados**, **151 por revisar** y **1 190 sin recurso** (314 con algún recurso, 20,9 %; 1 190, 79,1 %). Bloques: **8 confirmados**, **28 por revisar**, **28 sin contenido**. Sin el bloque 64 (problemas, no temas): 1 468 subtemas.

| Nivel del temario | Subtemas | Confirmados | Por revisar | Sin recurso |
|---|---|---|---|---|
| Nivel 1 | 258 | 110 | 70 | 78 |
| Nivel 2 | 183 | 23 | 31 | 129 |
| Nivel 3 | 315 | 30 | 43 | 242 |
| Nivel 4 | 227 | 0 | 5 | 222 |
| Nivel 5 | 196 | 0 | 0 | 196 |
| Nivel 6 | 166 | 0 | 0 | 166 |
| Nivel 7 | 123 | 0 | 2 | 121 |
| Nivel 8 | 36 | 0 | 0 | 36 |

Los 163 subtemas confirmados están todos en los Niveles 1–3 (110, 23 y 30); en los Niveles 4 y 7 solo hay 7 subtemas «por revisar» (cristales y casos reales) y ninguno confirmado; los Niveles 5, 6 y 8 están completamente sin contenido.

### 3.1 Tabla por bloque

| Id | Bloque | Subtemas | Conf. | Rev. | Sin | Estado | Recursos existentes |
|---|---|---|---|---|---|---|---|
| n1-b1 | Fundamentos generales de química | 23 | 0 | 12 | 11 | **por revisar** | Tabla periódica (estado), Mesa (tipo de sustancia, mezclador), lib/unidades, práctica (lectura de notación científica y unidades), catálogo de peligros |
| n1-b2 | Estructura atómica | 25 | 5 | 5 | 15 | **por revisar** | Tabla periódica (Z, masa, configuración calculada por Aufbau), Mesa (iones), Enlaces (electrones de valencia) |
| n1-b3 | Tabla periódica | 23 | 12 | 6 | 5 | **confirmado** | Tabla periódica (118 elementos, 10 categorías, periodo y grupo, electronegatividad y estados de oxidación de PubChem, 4 energías de ionización NIST) |
| n1-b4 | Enlace químico | 22 | 12 | 8 | 2 | **confirmado** | Mesa · Enlaces (iónico, covalente, dativo, metálico, múltiple σ/π, intermoleculares), tema Enlace iónico y covalente, visor 2D/3D, glosario |
| n1-b5 | Nomenclatura inorgánica | 20 | 19 | 0 | 1 | **confirmado** | Mesa · Formulación (3 nomenclaturas), tema Formular y nombrar, tema Números de oxidación, lección |
| n1-b6 | Reacciones químicas | 20 | 6 | 12 | 2 | **por revisar** | Temas Ajuste y Redox, Mesa · Reacciones (10 reacciones), Ajuste manual, escenas Mezcla, Solubilidad, Equilibrio, Energía |
| n1-b7 | Estequiometría | 21 | 9 | 6 | 6 | **confirmado** | Temas Mol y masa molar, Estequiometría y rendimiento, Concentración; lecciones; fórmula/masa molar de la Mesa |
| n1-b8 | Gases | 20 | 0 | 1 | 19 | **por revisar** | Biblioteca (20 gases), caso «El aire que respiras»; ninguna lección ni escena de gases |
| n1-b9 | Soluciones y concentraciones | 20 | 4 | 8 | 8 | **por revisar** | Temas Concentración y Dilución y patrones, escena Dilución, escena Solubilidad |
| n1-b10 | Ácidos, bases y equilibrio elemental | 22 | 14 | 5 | 3 | **confirmado** | Temas pH y Valoración, escenas Ácidos y bases, Mezcla, Equilibrio, Solubilidad (incluye serie de ion común) |
| n1-b11 | Termoquímica y electroquímica introductoria | 20 | 11 | 3 | 6 | **confirmado** | Tema Termoquímica y energía libre, escenas Energía y Electroquímica, tema Cinética (Ea), datos ΔfH°, S°, 6 potenciales |
| n1-b12 | Química orgánica introductoria | 22 | 18 | 4 | 0 | **confirmado** | Temas Grupos funcionales, Nomenclatura IUPAC, Escribir estructuras, Isomería, Reacciones orgánicas; Mesa (visor 2D/3D) |
| n2-b13 | Matemáticas aplicadas a la química | 24 | 0 | 7 | 17 | **por revisar** | Solo herramientas: evaluador de expresiones, derivada e integral numéricas (Laboratorio · Datos), logaritmos dentro de pH y cinética; sin enseñanza de matemáticas |
| n2-b14 | Estadística y análisis de datos químicos | 24 | 9 | 3 | 12 | **por revisar** | Laboratorio · Datos y estadística (descriptiva, histograma, regresión lineal), tema Calibración e incertidumbre, escena Colorimetría, tema Ajuste cinético |
| n2-b15 | Seguridad y buenas prácticas de laboratorio | 21 | 2 | 3 | 16 | **por revisar** | Catálogo de peligros (114 entradas: pictogramas GHS, palabras de advertencia, códigos H, ICSC/ECHA), regla de peligro de la Mesa libre |
| n2-b16 | Técnicas básicas de laboratorio | 24 | 4 | 5 | 15 | **por revisar** | Escena Dilución (pipeta, matraz aforado), tema Dilución y patrones, tema Mol (incertidumbre de pesada), Cuaderno |
| n2-b17 | Metrología química y control de calidad | 24 | 1 | 3 | 20 | **por revisar** | Escena Colorimetría (intervalo de trabajo, saturación), tema Calibración e incertidumbre, Cuaderno (versión de modelo y procedencia) |
| n2-b18 | Fundamentos de instrumentación científica | 22 | 0 | 2 | 20 | **por revisar** | Importador CSV del Cuaderno; curva de calibración de la escena Colorimetría |
| n2-b19 | Computación científica para química | 22 | 6 | 4 | 12 | **por revisar** | Laboratorio · Datos, escenas Cinética y Equilibrio, entrada SMILES, visor 3D (openchemlib), Cuaderno reproducible, biblioteca |
| n2-b20 | Diseño de experimentos y metodología científica | 22 | 1 | 4 | 17 | **por revisar** | Cuaderno; predicción previa en la escena Dilución; réplicas de la Colorimetría |
| n3-b21 | Química general universitaria avanzada | 20 | 1 | 4 | 15 | **por revisar** | Escena Solubilidad, cristales (NaCl, CsCl, MgO, fluorita, rutilo, metales), temas pH y Redox |
| n3-b22 | Termodinámica química I | 22 | 3 | 2 | 17 | **por revisar** | Tema Termoquímica y energía libre, escena Energía (ΔH, ΔS, ΔG(T)) |
| n3-b23 | Termodinámica química II | 22 | 0 | 1 | 21 | **por revisar** | Escena Solubilidad (equilibrio heterogéneo de una sal) |
| n3-b24 | Cinética química | 24 | 10 | 2 | 12 | **confirmado** | Temas Cinética y Ajuste cinético, escena Velocidad de reacción (núcleo con A→B→C) |
| n3-b25 | Química cuántica introductoria | 22 | 0 | 0 | 22 | **sin contenido** | — |
| n3-b26 | Química inorgánica I | 20 | 1 | 5 | 14 | **por revisar** | Cristales 3D, Formulación (hidruros, óxidos), tabla periódica, Enlaces dativos |
| n3-b27 | Química inorgánica II — Coordinación | 22 | 0 | 1 | 21 | **por revisar** | Un solo ejemplo en Enlaces: [Cu(NH₃)₄]²⁺ |
| n3-b28 | Química orgánica I | 24 | 7 | 9 | 8 | **por revisar** | Temas Isomería y Estereoquímica R/S y E/Z, escena Isómeros, tema Reacciones orgánicas |
| n3-b29 | Química orgánica II | 24 | 0 | 8 | 16 | **por revisar** | Temas Grupos funcionales y Reacciones orgánicas; biblioteca (glucosa, aminoácidos) |
| n3-b30 | Química analítica clásica | 22 | 4 | 4 | 14 | **por revisar** | Temas Valoración y Calibración, escenas Mezcla y Colorimetría |
| n3-b31 | Química analítica instrumental | 24 | 0 | 2 | 22 | **por revisar** | Escena Colorimetría (ley de Beer con datos de ejemplo) |
| n3-b32 | Electroquímica universitaria | 24 | 4 | 2 | 18 | **por revisar** | Escena Electroquímica (celda galvánica, Nernst, 6 potenciales estándar, F y R) |
| n3-b33 | Bioquímica I | 23 | 0 | 2 | 21 | **por revisar** | Biblioteca de biomoléculas (glucosa, glicina, alanina, serina, urea, adenina, ácido palmítico) |
| n3-b34 | Bioquímica II — Metabolismo | 22 | 0 | 1 | 21 | **por revisar** | Caso real de ATP (PubChem); sin metabolismo |
| n4-b35 | Espectroscopia molecular avanzada | 20 | 0 | 0 | 20 | **sin contenido** | — |
| n4-b36 | Resonancia magnética nuclear y elucidación estructural | 22 | 0 | 0 | 22 | **sin contenido** | — |
| n4-b37 | Espectrometría de masas avanzada | 20 | 0 | 0 | 20 | **sin contenido** | — |
| n4-b38 | Síntesis orgánica avanzada | 24 | 0 | 0 | 24 | **sin contenido** | — |
| n4-b39 | Química orgánica física | 22 | 0 | 0 | 22 | **sin contenido** | — |
| n4-b40 | Química organometálica y catálisis | 23 | 0 | 0 | 23 | **sin contenido** | — |
| n4-b41 | Química del estado sólido | 23 | 0 | 2 | 21 | **por revisar** | Cristales 3D (celda unitaria y parámetro de red) |
| n4-b42 | Química de polímeros | 25 | 0 | 0 | 25 | **sin contenido** | — |
| n4-b43 | Química de superficies, interfaces y coloides | 24 | 0 | 0 | 24 | **sin contenido** | — |
| n4-b44 | Química ambiental y geoquímica | 24 | 0 | 3 | 21 | **por revisar** | Casos reales (aire, capa de ozono, mar) |
| n5-b45 | Química cuántica avanzada | 26 | 0 | 0 | 26 | **sin contenido** | — |
| n5-b46 | Teoría del funcional de la densidad (DFT) | 24 | 0 | 0 | 24 | **sin contenido** | — |
| n5-b47 | Catálisis avanzada y diseño de catalizadores | 26 | 0 | 0 | 26 | **sin contenido** | — |
| n5-b48 | Química medicinal y diseño de fármacos | 24 | 0 | 0 | 24 | **sin contenido** | — |
| n5-b49 | Química bioorgánica y bioinorgánica avanzada | 24 | 0 | 0 | 24 | **sin contenido** | — |
| n5-b50 | Química supramolecular | 22 | 0 | 0 | 22 | **sin contenido** | — |
| n5-b51 | Química de materiales funcionales | 24 | 0 | 0 | 24 | **sin contenido** | — |
| n5-b52 | Ingeniería de reacciones y procesos químicos | 26 | 0 | 0 | 26 | **sin contenido** | — |
| n6-b53 | Métodos avanzados de estructura electrónica | 24 | 0 | 0 | 24 | **sin contenido** | — |
| n6-b54 | Dinámica molecular y mecánica estadística computacional | 30 | 0 | 0 | 30 | **sin contenido** | — |
| n6-b55 | Dinámica cuántica molecular y fotoquímica teórica | 26 | 0 | 0 | 26 | **sin contenido** | — |
| n6-b56 | Termodinámica estadística y mecánica estadística química | 28 | 0 | 0 | 28 | **sin contenido** | — |
| n6-b57 | Teoría matemática de reacciones químicas | 28 | 0 | 0 | 28 | **sin contenido** | — |
| n6-b58 | Quimioinformática, inteligencia artificial y diseño molecular | 30 | 0 | 0 | 30 | **sin contenido** | — |
| n7-b59 | Nanoquímica y química molecular de precisión | 24 | 0 | 0 | 24 | **sin contenido** | — |
| n7-b60 | Química sostenible, energética y de carbono | 26 | 0 | 0 | 26 | **sin contenido** | — |
| n7-b61 | Química de sistemas, origen de la vida y química prebiótica | 24 | 0 | 0 | 24 | **sin contenido** | — |
| n7-b62 | Astroquímica y química del espacio | 24 | 0 | 2 | 22 | **por revisar** | Casos reales del espacio (moléculas interestelares, Venus, Marte, Titán) |
| n7-b63 | Química cuántica de frontera y tecnologías moleculares emergentes | 25 | 0 | 0 | 25 | **sin contenido** | — |
| n8-b64 | Problemas científicos y tecnológicos abiertos | 36 | 0 | 0 | 36 | **sin contenido** | — |

### 3.2 Detalle por subtema (posición dentro del bloque)

Posiciones según `docs/TEMARIO-MAESTRO.md`. Los bloques no listados no tienen ningún subtema con recurso.

- **n1-b1 Fundamentos generales de química** — confirmado: — · por revisar: 8, 10, 11, 12, 16, 17, 18, 19, 20, 21, 22, 23
- **n1-b2 Estructura atómica** — confirmado: 9, 14, 15, 24, 25 · por revisar: 8, 10, 11, 16, 21
- **n1-b3 Tabla periódica** — confirmado: 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 19, 21 · por revisar: 2, 4, 5, 17, 20, 22
- **n1-b4 Enlace químico** — confirmado: 1, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20 · por revisar: 2, 3, 4, 11, 12, 13, 14, 21
- **n1-b5 Nomenclatura inorgánica** — confirmado: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20 · por revisar: —
- **n1-b6 Reacciones químicas** — confirmado: 3, 4, 5, 7, 13, 18 · por revisar: 1, 2, 6, 8, 10, 12, 14, 15, 16, 17, 19, 20
- **n1-b7 Estequiometría** — confirmado: 1, 2, 3, 4, 6, 10, 13, 15, 17 · por revisar: 5, 9, 11, 14, 16, 18
- **n1-b8 Gases** — confirmado: — · por revisar: 1
- **n1-b9 Soluciones y concentraciones** — confirmado: 11, 17, 18, 19 · por revisar: 1, 3, 5, 6, 7, 8, 9, 10
- **n1-b10 Ácidos, bases y equilibrio elemental** — confirmado: 4, 5, 6, 7, 9, 10, 11, 12, 14, 17, 18, 19, 21, 22 · por revisar: 3, 8, 13, 15, 20
- **n1-b11 Termoquímica y electroquímica introductoria** — confirmado: 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16 · por revisar: 9, 18, 20
- **n1-b12 Química orgánica introductoria** — confirmado: 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 · por revisar: 1, 2, 3, 22
- **n2-b13 Matemáticas aplicadas a la química** — confirmado: — · por revisar: 3, 4, 7, 8, 11, 22, 24
- **n2-b14 Estadística y análisis de datos químicos** — confirmado: 1, 2, 3, 4, 5, 6, 13, 15, 16 · por revisar: 12, 14, 19
- **n2-b15 Seguridad y buenas prácticas de laboratorio** — confirmado: 4, 6 · por revisar: 3, 5, 7
- **n2-b16 Técnicas básicas de laboratorio** — confirmado: 1, 2, 4, 8 · por revisar: 3, 5, 7, 9, 24
- **n2-b17 Metrología química y control de calidad** — confirmado: 14 · por revisar: 3, 8, 13
- **n2-b18 Fundamentos de instrumentación científica** — confirmado: — · por revisar: 8, 15
- **n2-b19 Computación científica para química** — confirmado: 7, 12, 13, 15, 17, 18 · por revisar: 8, 10, 19, 22
- **n2-b20 Diseño de experimentos y metodología científica** — confirmado: 18 · por revisar: 1, 12, 16, 17
- **n3-b21 Química general universitaria avanzada** — confirmado: 16 · por revisar: 6, 8, 13, 15
- **n3-b22 Termodinámica química I** — confirmado: 7, 16, 21 · por revisar: 9, 13
- **n3-b23 Termodinámica química II** — confirmado: — · por revisar: 14
- **n3-b24 Cinética química** — confirmado: 1, 2, 3, 5, 6, 7, 15, 16, 19, 24 · por revisar: 8, 10
- **n3-b26 Química inorgánica I** — confirmado: 18 · por revisar: 7, 8, 13, 14, 15
- **n3-b27 Química inorgánica II — Coordinación** — confirmado: — · por revisar: 1
- **n3-b28 Química orgánica I** — confirmado: 7, 8, 9, 10, 11, 12, 13 · por revisar: 6, 14, 17, 18, 19, 20, 21, 22, 23
- **n3-b29 Química orgánica II** — confirmado: — · por revisar: 1, 5, 6, 7, 9, 19, 21, 22
- **n3-b30 Química analítica clásica** — confirmado: 8, 12, 19, 20 · por revisar: 5, 7, 13, 14
- **n3-b31 Química analítica instrumental** — confirmado: — · por revisar: 2, 4
- **n3-b32 Electroquímica universitaria** — confirmado: 4, 6, 7, 8 · por revisar: 5, 24
- **n3-b33 Bioquímica I** — confirmado: — · por revisar: 4, 16
- **n3-b34 Bioquímica II — Metabolismo** — confirmado: — · por revisar: 2
- **n4-b41 Química del estado sólido** — confirmado: — · por revisar: 2, 5
- **n4-b44 Química ambiental y geoquímica** — confirmado: — · por revisar: 2, 5, 7
- **n7-b62 Astroquímica y química del espacio** — confirmado: — · por revisar: 2, 10

### 3.3 Recurso → bloques que toca (lectura inversa)

- **Temas con corrección (22)**: General (`mol`, `concentracion`, `ajuste`, `estequiometria`) → bloques 6, 7, 9; Inorgánica (`formular-nombrar`, `oxidacion`, `enlace`, `redox`) → 4, 5, 6, 26; Orgánica (6 temas) → 12, 28, 29; Analítica (`ph`, `valoracion`, `dilucion`, `calibracion`) → 9, 10, 14, 16, 17, 30; Fisicoquímica (`cinetica`, `equilibrio`, `termo`, `ajuste-cinetico`) → 10, 11, 22, 24.
- **Escenas**: Ácidos y bases, Mezcla → 10, 30; Cinética → 24, 19; Equilibrio → 10, 19; Energía de reacción → 11, 22; Dilución → 9, 16; Colorimetría → 14, 17, 30, 31; Solubilidad → 9, 10, 21, 23; Electroquímica → 11, 32; Isómeros → 28; Mesa libre → 15 (política de peligro).
- **Mesa molecular y glosario** → 2, 4, 5, 12, 26; **tabla periódica** → 1, 2, 3; **catálogo de peligros** → 15; **casos reales** → 8, 44, 62; **Cuaderno y Datos** → 14, 17, 18, 19, 20.

Un mismo subtema repetido en el temario (39 títulos) recibe asignación propia en cada bloque; no se contó una sola vez. Si se contara por título distinto (1 463) los porcentajes cambian poco.

## 4. Decisiones propuestas (no implementadas)

**D1 · Relación entre los 8 niveles del temario y los 4 niveles actuales.**
*Recomendación*: son dos ejes distintos y se mantienen los dos. Los 4 actuales son **dificultad de práctica por tema** (siguen siendo la única preferencia guardada); los 8 son **niveles de ruta/currículo** y se guardan como metadato del bloque. Equivalencia orientativa solo para sugerir dificultad: N1 → preuniversitario (con parte de universitario), N2–N3 → universitario, N4–N5 → químico, N6–N7 → científico, N8 → sin práctica. *Alternativa*: sustituir los 4 por los 8: rompe `ciencia.nivel.simulador-quimica`, los atajos 1–4, la migración desde `quimica.nivel` y el texto «porNivel» de las 22 lecciones; no la recomiendo. *Nota*: hoy un tema del Nivel 1 del temario (pH) ya ofrece práctica «científico»; el eje de dificultad no coincide con el del currículo.

**D2 · Cómo se cuenta el Nivel 8 (bloque 64).**
*Recomendación*: es una lista de problemas abiertos, no un curso: se muestra como «mapa de problemas abiertos» de solo lectura (títulos del temario, sin afirmaciones ni ejercicios) y **se excluye del denominador de cobertura** (1 468 subtemas en lugar de 1 504), con una línea que lo diga. *Alternativa*: contarlo siempre «sin contenido» (más sencillo, pero deprime la cobertura con 36 elementos que nunca serán curso).

**D3 · Ids estables `n{nivel}-b{bloque}-s{posición}`.**
*Recomendación*: adoptarlo tal cual, **congelando el temario como versión 1**: nunca se reordena ni se reutiliza una posición; un subtema nuevo recibe la siguiente posición libre; el título no forma parte del id y puede corregirse (ortografía). Se genera por script desde `docs/TEMARIO-MAESTRO.md`. Los 39 títulos repetidos se tratan como subtemas distintos con un campo opcional `mismoConcepto` (decisión posterior). Los ids de tema y familia existentes (`ph`, `analitica.ph`) **no se renombran**: se enlazan con una tabla de correspondencias. *Alternativa*: slugs semánticos (`n1-b10-ph`): más legibles, pero cambian con los títulos y chocan con los 39 repetidos.

**D4 · Estados de cobertura.**
*Recomendación*: calcular por código, no escribir a mano, salvo «en desarrollo»; separar **cobertura** (qué existe) de **verificación** (nivel de fuente): 
- *sin contenido*: ningún recurso asociado; 
- *en desarrollo*: marcado manualmente en el registro de fases cuando hay trabajo en curso aún sin entregar; 
- *parcial*: al menos una capa funcional (lección por capas, práctica con corrección, o simulación honesta) pero no todas las que corresponden; 
- *completado*: lección por capas + práctica con corrección (+ simulación o recurso interactivo si existe una honesta) con pruebas que pasan; 
- *verificado*: completado **y** cada dato con fuente abierta y fechada o calculado con prueba independiente **y** revisión humana registrada. 
Los estados «confirmado / por revisar» de este informe son del **mapa de correspondencias**, no de cobertura, y desaparecen cuando se calcule la cobertura real. *Alternativa*: un solo porcentaje: oculta la diferencia entre «existe» y «es correcto».

**D5 · Matemáticas, Estadística, Seguridad y laboratorio (bloques 13–20).**
*Recomendación* (según mis notas del proyecto: Física para Todos es una app independiente con su propio módulo de matemáticas; **no abrí esa app en esta fase**): no duplicar el módulo de matemáticas. El bloque 13 se marca «cubierto en otra app» con una referencia textual y no navegable (la app no abre las otras) y en Química solo se cubre lo propio (logaritmos en pH y cinética, análisis dimensional con unidades, propagación de incertidumbre). Estadística (14), metrología (17) y diseño experimental (20) crecen dentro de **Laboratorio · Datos y estadística y el Cuaderno** (ya hay descriptiva, regresión e importador). Seguridad (15) se apoya en el catálogo de peligros y en la regla de la Mesa libre (datos y reglas existentes, sin duplicarlos). Técnicas de laboratorio (16) en las escenas del Laboratorio virtual (Dilución ya modela pipeta y matraz). Instrumentación (18) y computación científica (19) se difieren: dependen de decisiones D6 y de contenido que no existe. *Alternativa*: crear en Química un módulo propio «Fundamentos matemáticos»: duplica trabajo, y su mantenimiento se separaría de la app que ya lo tiene.

**D6 · Niveles 4–7 con datos o cálculo que la app no puede respaldar.**
*Recomendación*: mostrarlos **plegados y «sin contenido»** (los títulos son del temario, no afirmaciones científicas); no crear lecciones, ejercicios ni simulaciones sin fuente verificable; los bloques que exigen motores de cálculo (estructura electrónica, DFT, dinámica molecular, bloques 45, 46, 53–58 y 63) quedan fuera de alcance de una app de escritorio sin motores validados, salvo decisión expresa. Un bloque pasa a «en desarrollo» solo cuando existan una fuente y un criterio de verificación. *Alternativa*: ocultar niveles sin contenido por defecto con un filtro «Mostrar todo»: más limpio, pero esconde lo que falta.

**D7 · Piloto con el Nivel 1 y qué bloque.**
*Recomendación*: sí, Nivel 1 (12 bloques, 258 subtemas, 180 con algún recurso). En dos pasos: **(a) piloto técnico en el bloque 5 «Nomenclatura inorgánica»** (19 de 20 subtemas ya confirmados): valida registro de ids, estados calculados y catálogo plegable con casi cero contenido nuevo; **(b) piloto de contenido en el bloque 8 «Gases»** (20 subtemas, ninguna lección ni escena; las leyes de los gases son matemáticas cerradas con R ya registrada, lo que minimiza las necesidades de fuente; las desviaciones del gas ideal requerirían los parámetros a y b de van der Waals con fuente, que se dejarían fuera al principio). *Alternativa*: bloque 7 «Estequiometría» (9 confirmados + 6 por revisar): aprovecha más, pero no pone a prueba la creación de contenido.

**D8 · Bloques que necesitan datos con fuente nueva antes de enseñarse.** (Fuentes **candidatas**, ninguna abierta ni con licencia comprobada en esta fase.)

| Bloque | Dato que falta | Fuente candidata a verificar |
|---|---|---|
| 3 Tabla periódica | radios atómico e iónico, afinidad electrónica, energías de ionización completas | NIST Atomic Spectra Database (ya se usa para 4 valores); Shannon (1976) para radios iónicos |
| 8 Gases | parámetros de van der Waals, constantes | CRC Handbook (derechos de autor: solo hechos y cita), NIST |
| 9 Soluciones | tabla de solubilidades, constantes crioscópica y ebulloscópica | CRC; LibreTexts (CC BY-NC-SA) |
| 10 Ácidos y bases | pKa/Kb verificados, intervalos de viraje de indicadores | tablas de Harvey/CRC; ya hay pKa «sin consultar» |
| 11 y 22–23 Termodinámica | calores específicos, ΔfH°, S°, ΔG°f, energías de enlace, datos de fase | NIST Chemistry WebBook / tablas NBS-JANAF |
| 21 y 32 Equilibrios y electroquímica | coeficientes de actividad, potenciales estándar completos | CRC; Bard-Parsons-Jordan (derechos) |
| 31, 35–37 Espectroscopia y masas | espectros IR, RMN, UV-Vis, MS de referencia | NIST WebBook, SDBS (AIST; términos de uso sin revisar), Cologne CDMS |
| 41 Estado sólido | estructuras cristalinas y parámetros | Crystallography Open Database (CC0, ya en openchemlib); Materials Project |
| 44 y 62 Ambiental y espacio | constantes de reacción atmosférica y astroquímica | NASA JPL Data Evaluation, KIDA/UMIST (licencias sin revisar) |
| 45–47, 53–58, 63 Cuántica, DFT, MD, ML | funciones base, funcionales, campos de fuerza, benchmarks | sin fuente definida; ver D6 |

**D9 · Vocabulario de niveles de verificación.**
La app ya usa **tres vocabularios**: `DATOS.md` (fuente consultada / Wikidata con o sin referencia / calculada sin contrastar / conocimiento general / sin verificar), los ejercicios (`didactico` / `referencia` / `publicado`) y el Cuaderno (`modelo-calculado` / `calculo-verificado` / `comparado-con-mediciones`). Las reglas de este proyecto piden seis: fuente verificada / bibliográfica declarada / dato calculado / parámetro didáctico / ejemplo idealizado / sin verificar. *Recomendación*: una **tabla de equivalencias** en el código nuevo (sin cambiar el esquema del Cuaderno ni los valores guardados): `didactico` → parámetro didáctico (o ejemplo idealizado si es un modelo simple); `referencia` → bibliográfica declarada; `publicado` → fuente verificada (hoy ninguno se usa); «Calculada · sin contrastar» → dato calculado; «Fuente consultada» solo cuenta como verificada si **se abrió** la página (los casos reales ya distinguen «abierta» de «resumen de búsqueda»). *Alternativa*: añadir un cuarto vocabulario: más confusión.

**D10 · Dónde viven los datos del temario y qué se guarda del usuario.**
*Recomendación*: el temario se importa como datos TypeScript tipados generados por script (`datos/temario/`), sin eval ni red; la cobertura es derivada (código), no se guarda. No se usa ninguna clave de almacenamiento existente; si se guarda el plegado del catálogo, una clave nueva y validada al leer (como `ciencia.aprender…`). El progreso por **subtema** del estudiante no se crea ahora: lo que existe (lección y práctica por tema) se agrega por cálculo. *Alternativa*: guardar progreso por subtema: obliga a migración y a decidir qué significa «completar» un subtema.

**D11 · Restricción para temas nuevos que combinen sustancias** (no es opción): cualquier nueva escena o tema que ponga sustancias en la mesa debe pasar por `rengPoliticaMesa`; los contenidos de Gases (bloque 8) o precipitación (bloque 6, subtema 12) que impliquen sustancias con peligro quedarían como consulta, nunca como combinación libre.

## 5. Riesgos y huecos

**Datos que hoy no tenemos con fuente** (y que el temario exigiría):
- Ya declarados débiles: masas atómicas de la tabla **sin fuente registrada** (las lecciones usan CIAAW 2024 abreviado); pKa de HF, fórmico y NH₄⁺ y S° «de libro, sin consultar»; K de los equilibrios de ejemplo **ilustrativas, no medidas**; ΔfH° de 12 sustancias de Wikipedia (fuente secundaria, sin fuente primaria por fila); configuración electrónica «calculada, sin contrastar»; reacciones de `reaccionesConocidas.ts` que citan capítulos que nadie abrió; recuentos de isómeros «de libro» sin obra concreta. La electronegatividad tiene **dos orígenes** en el código (`nucleo/electronegatividad.ts`, que cita Pauling/Allred y el CRC, y el JSON de PubChem de la ficha): **no los comparé**.
- Sin ningún dato hoy: tablas termodinámicas amplias (calores específicos, ΔfH°/S°/ΔG° de más sustancias), energías de enlace, radios, afinidades electrónicas, parámetros de gases reales, coeficientes de actividad, diagramas de fase, constantes coligativas, tablas de potenciales completas, espectros (IR, RMN, UV-Vis, masas), parámetros de campos de fuerza y de funcionales, constantes de reacciones atmosféricas e interestelares y cualquier dato de los Niveles 5–8.
- Los modelos asumen actividades ≈ concentraciones, volúmenes aditivos, agua a 25 °C y ΔH°, ΔS° constantes: todo el contenido de los bloques 21 y 23 (actividad, fugacidad, Debye-Hückel) queda **fuera de esos supuestos** y no se podría presentar con las escenas actuales.

**Licencias que podrían complicar su uso** (todas por declaración de la fuente según `licencias/`; no abrí ninguna de nuevo): OpenStax y LibreTexts son CC BY-NC-SA 4.0 (**no comercial + compartir igual**: ya condicionan el uso comercial por tres Ksp, sus tablas de contraste y los títulos de OpenStax); Wikipedia es CC BY-SA 4.0 (atribución + compartir igual, y la página de potenciales avisa de «términos adicionales» de los libros citados); el CRC Handbook y Bard-Parsons-Jordan son obras con derechos: se pueden citar hechos pero no copiar tablas; NIST (F, R, ionización) **sin política de uso revisada**; SDBS, NASA JPL, KIDA/UMIST, ChEMBL y similares: **licencia sin revisar** (candidatas de D8); los parámetros MMFF94 de openchemlib **sin licencia verificada**. Ampliar el contenido con tablas de esas fuentes ampliaría el número de condiciones de distribución. Hoy no hay distribución prevista; si se activara, el punto 1 de `PENDIENTES-ANTES-DE-DISTRIBUIR.md` ya obliga a una revisión.

**Riesgos técnicos y de proceso**:
- **Huella de Prácticas**: cualquier cambio en el texto, los datos o el orden de opciones de una familia existente invalida los borradores guardados (con aviso, sin pérdida de logros). Añadir familias a un tema cambia qué ejercicio sale para intentos **nuevos** con la regla «alternando familias»; los antiguos se resuelven por la lista congelada.
- **Pruebas con conjuntos exactos**: 22 lecciones, 22 temas, 8 sustancias permitidas, totales del catálogo de peligros y la instantánea de 3 840 filas fallarán al ampliar (es intencionado: obligan a revisar).
- **Tamaño**: el build ya produce fragmentos de 3,2 MB (`View`), 2,9 MB (`Sustancias`) y 1,35 MB (JSON de recursos); la entrega C ya anotó que el módulo es un «fragmento grande». 1 504 subtemas como datos son pequeños, pero cientos de lecciones no lo serán.
- **Inflar la cobertura**: los 39 títulos repetidos y los solapes entre bloques permiten contar dos veces un mismo recurso; el mapa de arriba lo hace deliberadamente por subtema, pero la métrica pública debería mostrar también bloques.
- **Calidad pedagógica**: las 22 lecciones no están revisadas por un docente; el criterio de «Resuelta tras ver la resolución» sigue pendiente de decisión (Entrega C).

## 6. Qué NO verifiqué

- No abrí la app en pantalla ni recorrí lecciones o escenas en esta fase: «qué cubre» sale de código y documentos. Puede haber subtemas mal clasificados (en ambos sentidos) en el mapa de la sección 3; está hecho a mano por mi lectura.
- No leí el contenido de cada una de las 22 lecciones ni de las 32 familias; usé sus títulos, claves, niveles y fuentes. Por eso, p. ej., «agentes oxidantes/reductores» o «Ley de Hess» pueden estar mejor o peor cubiertos de lo anotado.
- No comprobé en los bloques 31–34, 41, 44 y 62 más que los recursos con nombre claro (Colorimetría, Electroquímica, biblioteca, cristales, casos); las celdas unitarias de los cristales y el contenido textual de los casos no los abrí.
- No ejecuté la app ni ninguna verificación visual; la línea base son los comandos del `package.json`.
- No consulté la red ni abrí ninguna fuente o licencia nueva (D8 son candidatas, no verificadas).
- No abrí la app de Física: lo que digo de ella viene de mis notas del proyecto.
- La transcripción del temario es manual desde el texto pegado; los recuentos (8, 64, 1 504, 39 repetidos) salen de un guion sobre mi archivo. Si algún título se transcribió mal, los números podrían cambiar en uno o dos. Conviene una comparación con el original.
- No medí el efecto de rendimiento de ninguna ampliación.

## 7. Siguiente paso recomendado

Esperar tus decisiones **D1, D2, D3, D4, D7 y D10** (condicionan todo lo demás). Con ellas, la Entrega 1 sería: (a) generar los ids y el registro del temario desde `docs/TEMARIO-MAESTRO.md`; (b) cargar este mapa como datos revisados (tras tu revisión de los «por revisar»); (c) catálogo plegable con el estado calculado y el piloto del bloque 5; sin tocar Cuaderno, huella, reglas de peligro ni claves de almacenamiento.
