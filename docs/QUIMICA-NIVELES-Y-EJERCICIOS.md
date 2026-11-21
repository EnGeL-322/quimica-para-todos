# Química: navegación, niveles, ejercicios y simulaciones

Este documento describe el rediseño de Química para Todos. Hay dos rondas: el rediseño anterior (niveles, motor de ejercicios y simulaciones) y el encargo «Aprender, Prácticas y Laboratorio virtual», que avanza por entregas A–E (estado en `docs/ENTREGA-A-NAVEGACION.md`). Lo que no se ha podido comprobar está marcado como pendiente en la última sección.

## Navegación (Entrega A del encargo «Aprender, Prácticas y Laboratorio virtual»)

Orden en el menú lateral, en la fila de pestañas de Química y en el buscador Ctrl+K:

1. **Catálogo** (vista por defecto): tarjetas con miniatura por tema y rama; toda la tarjeta abre la práctica y, si hay un fenómeno asociado, «Simular» abre su escena. Filtros: texto, rama y nivel.
2. **Aprender**: ruta de iniciación (10 lecciones, con progreso), buscador, filtros por rama y nivel y 22 lecciones (una por tema del banco). Cada lección sigue Entender el concepto → Ver un ejemplo → Resolverlo paso a paso → Comprobar qué entendí → Practicar → Simular u observar. El detalle técnico, los datos y las fuentes están en `docs/ENTREGA-B-APRENDER.md`.
3. **Prácticas por nivel** (antes «Ejercicios de química»): selector visual de temas y pantalla de resolución. «Nivel preferido» es la única fila de nivel de esta pantalla.
4. **Simulación**: tarjetas de los diez fenómenos (cinco de cálculo, la mesa de dilución, la colorimetría, la solubilidad, la electroquímica y la comparación de isómeros).
5. **Casos reales**.
6. **Mesa molecular** (Construir, Enlaces, Formulación, Reacciones, visores 2D/3D e historial), siempre al final. La tabla periódica es un acceso aparte, en «Consulta». «Formular y nombrar» se sigue abriendo desde la Formulación de la Mesa («Practicar formular y nombrar» / «O practica formular y nombrar en «Prácticas por nivel»»).

Rutas (`#/simulador-quimica/<sub>`): `catalogo`, `aprender`, `practicas`, `simulacion`, `acidobase`, `mezcla`, `cinetica`, `equilibrio`, `termo`, `dilucion`, `colorimetria`, `solubilidad`, `electroquimica`, `isomeros`, `casos`, `mesa`, `enlaces`, `formulacion`, `reacciones`. Rutas antiguas vivas: `ejercicios` abre Prácticas por nivel y `experimentos` abre la Simulación conservando la escena. Enlaces profundos a un tema: `practicas-<tema>`, `ejercicios-<tema>` (alias antiguo) y `aprender-<tema>`, con el identificador del banco (por ejemplo `practicas-ph`, `aprender-isomeria`). La pantalla consume el tema una sola vez (valida que exista en el banco) y la dirección queda en `practicas` o `aprender`; un tema desconocido abre el selector. Sin subruta se abre el Catálogo.

Cambiar de sección no desmonta los paneles (solo se ocultan): la molécula de la Mesa, el intento de práctica y las escenas de simulación ya visitadas se conservan.

Criterio visual común: el explorador de temas (`vista/ExploradorTemas.tsx`) y la tarjeta (`vista/TarjetaTema.tsx`) sirven al Catálogo, Aprender y Prácticas. El filtro por nivel («Todos los niveles», Preuniv., Univ., Químico, Científico) solo aparece donde no hay un «Nivel preferido»: Catálogo y Aprender. La fila global de nivel (Preuniv.–Científico) queda solo en Simulación y Casos reales; la Mesa usa su propio «Básico / Avanzado» y Catálogo, Aprender y Prácticas no la repiten. Las pantallas titulan distinto su contenido («Elige un tema», «Aprender química», «Elige un tema para practicar»).

## Niveles (rediseño anterior, Entrega B)

| Nivel | Qué cambia |
|---|---|
| Preuniversitario | Enunciado breve, datos guiados con unidades visibles, una incógnita, pistas progresivas. |
| Universitario | Varios pasos, elección del método, conversiones de unidades, datos experimentales sencillos. |
| Químico | Problemas integrados: método, especies o modelo relevante, supuestos a la vista y comprobación. |
| Científico | Ajuste, incertidumbre, residuos, sensibilidad o comparación de modelos, con los supuestos a la vista. |

Cada tema muestra solo los niveles que tienen ejercicios válidos (se comprueba generando). Si el nivel elegido no existe en un tema se usa el más cercano y la interfaz lo avisa sin cambiar la preferencia. Atajos: `1`–`4` (niveles), `B` y `A` (Básico/Avanzado de la Mesa).

### Persistencia y migración de Básico y Avanzado

- Clave nueva: `ciencia.nivel.simulador-quimica` ∈ {`preuniversitario`, `universitario`, `quimico`, `cientifico`}.
- Si no existe, se migra desde la clave antigua `quimica.nivel`: `basico` → Preuniversitario, `avanzado` → Universitario. La clave antigua **no se borra**.
- Al guardar un nivel se escribe también la clave antigua con el detalle equivalente (`basico` si es Preuniversitario, `avanzado` en los demás), de modo que una versión anterior sigue leyendo algo coherente.
- Los controles de la Mesa (Construir, Enlaces, Formulación, Reacciones, Casos) siguen usando Básico/Avanzado: «Básico» = Preuniversitario; «Avanzado» = desde Universitario (si ya estás en Químico o Científico, no baja de nivel). El selector «Detalle de la mesa» está en la barra de la Mesa.

## Motor de ejercicios

Capas, de los datos a la pantalla (todo lo anterior a la vista es TypeScript puro, sin React ni Electron):

| Capa | Archivo | Contenido |
|---|---|---|
| Bancos | `practica/bancos.ts` | Listas escritas a mano: compuestos, ecuaciones, estructuras con su nombre y grupo, isómeros, descriptores R/S y E/Z, reacciones orgánicas documentadas. |
| Generadores | `practica/familias/*.ts` | Una *familia* por tipo de problema: elige datos con una semilla, valida condiciones y construye enunciado, datos con unidades, respuesta esperada, método, hipótesis, pistas, resolución, error frecuente y fuente. |
| Solucionadores | `practica/solucionadores.ts`, `practica/modelosSimulacion.ts` y los motores de `nucleo/` | Regresión lineal, incertidumbre de una concentración interpolada, ajuste de órdenes cinéticos; los cinco modelos de simulación; ajuste de ecuaciones, estequiometría, equilibrio y termoquímica ya existentes. |
| Validación de entradas | `practica/numeros.ts` | Lectura de números con coma o punto, notación científica, fracciones y separación de la unidad. |
| Corrección | `practica/correccion.ts` | Veredictos por tipo de respuesta. |
| Presentación | `modos/VistaEjercicios.tsx`, `modos/Catalogo.tsx` | Interfaz. |
| Estado | `practica/estado.ts` | Intento actual e intentos abiertos recuperables. |

Identificadores: cada familia tiene un id estable (`general.mol-masa`, `analitica.ph`, …) y cada ejercicio `familia~nivel~semilla`, que se regenera de forma idéntica. Las pruebas comprueban reproducibilidad, que todo dato aparece en el enunciado, que cada ejercicio tiene pistas, resolución, error frecuente y fuente, que los niveles Químico y Científico muestran hipótesis y comprobación, y que la respuesta de referencia se corrige como correcta.

### Entrega C: identidad, progreso y razonamiento nuevo

Detalle, inventario por rama y nivel, formato guardado y verificación en `docs/ENTREGA-C-PRACTICAS.md`. Resumen: 10 familias nuevas (45 variantes) en `practica/familias/razonamiento*.ts`; el intento se identifica por `ejercicioId` (`familia~nivel~semilla`) y `huella`, los registros anteriores se resuelven con la regla antigua congelada (`rengEjercicioLegado`); persistencia versionada en `ciencia.practica.simulador-quimica` (v2) con borrador separado del logro (*Pendiente* / *Revisada* / *Resuelta*, aciertos y repeticiones); «Continuar práctica» y «Elegir tema»; nivel temporal dentro del ejercicio; «Repasar la lección», «Volver a la práctica» (Lección, Simulación y Mesa); gráficas con ejes, unidades y tabla equivalente.

### Tipos de respuesta y veredictos

`numero` (con unidad), `formula`, `nombre`, `ecuacion`, `estructura` (igual o isómero con un grupo dado) y `opcion`. Veredictos: `correcto`, `incorrecto`, `entrada-invalida`, `unidad-incompatible`, `ambigua` y `simplificable`; cada uno lleva un `motivo` estable (`alto`, `bajo`, `cerca`, `factor-potencia-10`, `error-frecuente`, `no-equilibrada`, `isomero-constitucional`, `estereoisomero`, …).

- Números: coma o punto decimal; `1.234` (un punto y tres cifras) es ambiguo y se pide aclararlo. Tolerancia = máximo entre la relativa del ejercicio, la absoluta y medio paso del redondeo indicado. Se convierte cualquier unidad compatible (`50 mmol/L` = `0,0500 mol/L`, `25 °C` = 298,15 K); una unidad de otra magnitud es «unidad incompatible».
- Ecuaciones: se comprueba conservación de cada elemento y de la carga (con electrones), que sean las especies del enunciado y, si se piden coeficientes mínimos, que no tengan divisor común (si lo tienen: «simplificable»).
- Estructuras: equivalencia por código canónico de openchemlib; se distingue el isómero constitucional (misma fórmula, otra conectividad: etanol y dimetil éter son C₂H₆O) y, si el ejercicio lo exige, el estereoisómero. Una fórmula molecular que corresponde a varias sustancias es «ambigua».
- Fórmulas: se leen con el analizador existente; una entrada solo en minúsculas que admite varias lecturas (`co`) es ambigua.

### Familias disponibles (22 temas, 5 ramas)

| Rama | Familias | Niveles |
|---|---|---|
| General | mol y masa molar; concentración y dilución; ajuste de ecuaciones; estequiometría, limitante y rendimiento | 1–4 / 1–4 / 1–3 / 1–3 |
| Inorgánica | formular y nombrar (banco y corrección originales); números de oxidación; enlace iónico y covalente; semirreacciones y ajuste redox ion-electrón | 1–3 / 1–3 / 1–3 / 1–3 |
| Orgánica | grupos funcionales; nomenclatura IUPAC; escribir estructuras; isomería constitucional; estereoquímica R/S y E/Z; reacciones orgánicas con condiciones | 1–2 / 1–3 / 1–3 / 1–3 / 2–3 / 1–3 |
| Analítica | pH; valoración ácido–base; dilución y patrones; calibración e incertidumbre | 1–4 / 1–4 / 1–3 / 3–4 |
| Fisicoquímica | cinética; equilibrio; termoquímica y energía libre; ajuste de datos cinéticos (compara órdenes 0, 1 y 2 con R² y estima k) | 1–3 / 1–4 / 1–4 / 3–4 |

## Simulaciones (rediseño anterior) y Entrega D

La Entrega D (`docs/ENTREGA-D-LABORATORIO.md`) añade a las escenas una ficha de modelo versionada, resultado desactualizado visible, diagnósticos de dominio, guardado y reapertura en el Cuaderno, y la mesa de dilución.

Los modelos están en `practica/modelosSimulacion.ts` (entradas con unidades y dominio, validación con diagnóstico, cálculo y ecuaciones/supuestos/procedencia que muestra el panel «Modelo, dominio y supuestos»). Las escenas viven en `modos/simulacion/` y `modos/MezclaAcidoBase.tsx`.

- Escenas de estado final (Ácidos y bases, Mezcla ácido–base, Equilibrio, Energía): se configuran los datos y se pulsa «Calcular» (o «Actualizar» si hay cambios sin calcular). La Mezcla conserva «Guardar en cuaderno» y la reapertura desde el Cuaderno.
- Escena temporal (Velocidad de reacción): se abre en pausa en t = 0 con «Iniciar», «Pausar» y «Reiniciar», y un control de tiempo.
- «Simular este ejercicio» aparece en los ejercicios de pH, valoración, cinética, equilibrio y termoquímica cuya transferencia es válida. Copia las entradas validadas; la práctica y la simulación no comparten estado. Las pruebas comprueban que la simulación y la respuesta del ejercicio coinciden dentro de la tolerancia (más de 40 casos).
- Diagnósticos: faltan datos (nombra qué falta), fuera de dominio (campo, valor y límite), ácido o reacción no incluidos, equilibrio indeterminado, reacción sin entropías (no se inventa ΔG) y agua líquida fuera de 273–373 K.
- Cada panel de modelo distingue el tipo de cálculo (equilibrio, termodinámico o de velocidad) y recuerda que la geometría molecular se consulta en la Mesa. El nivel Científico añade una línea de sensibilidad.
- «Abrir en Mesa molecular» (ejercicios con estructura): si la Mesa está vacía se carga directamente; si no, se pregunta entre añadir, reemplazar o cancelar. Se conservan la carga y la estereoquímica del SMILES.

## Selector visual y pantalla de resolución

Archivos: `modos/EjerciciosQuimica.tsx` (orquesta selector y resolución), `modos/SelectorEjercicios.tsx`, `modos/VistaEjercicios.tsx` (resolución), `vista/ExploradorTemas.tsx` y `vista/TarjetaTema.tsx` (compartidos con el Catálogo y, en la tarjeta, con la Simulación), `practica/fichasTema.ts` (pregunta, palabras clave y miniatura de cada tema, indexadas por el identificador del banco), `vista/miniaturasTema.ts` y `miniaturas/*.svg`.

**Selector**

- Al entrar en Prácticas por nivel (pestaña, menú lateral o buscador) se muestra el selector. Si hay un intento abierto aparece «Continuar práctica» y «Elegir tema»; los intentos guardados se recuperan o descartan desde la misma pantalla. Continuar y Recuperar devuelven la respuesta, la variante y las pistas ya abiertas.
- Los accesos directos al ejercicio concreto (tarjeta del Catálogo, «Practicar formular y nombrar» de la Mesa y «Volver al ejercicio» desde una simulación copiada de un ejercicio) abren la resolución sin pasar por el selector.
- Cada tarjeta es un único botón (miniatura 16:9, nombre, pregunta y, como texto, los niveles con práctica; el preferido en negrita). Se abre con clic, Intro o Espacio. En el Catálogo, «Simular» es un botón aparte dentro de la misma tarjeta.
- Filtros: «Todas» y las cinco ramas; búsqueda sin tildes ni mayúsculas, por nombre, resumen, pregunta y palabras clave (todas las palabras deben aparecer y un plural coincide con su singular). Sin resultados se ofrece «Limpiar filtros», que borra texto y rama. Los filtros se conservan al abrir un tema y volver, y el foco regresa a la tarjeta de origen.
- «Nivel preferido» (cuatro niveles) es la preferencia guardada (`ciencia.nivel.simulador-quimica`). Al abrir un tema solo se ofrecen los niveles con práctica; si se aplica el más cercano, se indica junto al selector y la preferencia no cambia.

**Resolución**

- Barra compacta: «← Volver a temas», nombre del tema, rama y nivel. Debajo: enunciado, «Se pide», estructura 2D o tabla si las hay y los datos con sus unidades (siempre visibles).
- Respuesta y «Comprobar» (botón principal) con «Pista» (secundario) en la columna izquierda; la corrección aparece a la derecha cuando el contenedor mide al menos 760 px y debajo si no. «Otra variante» está junto al número de variante.
- «Simular este ejercicio» y «Abrir en Mesa molecular» aparecen tras comprobar o abrir la resolución. Con la Mesa ocupada se mantiene la confirmación (añadir, reemplazar o cancelar).
- Paneles desplegables: «Hipótesis y supuestos» (abierto por defecto en Químico y Científico), «Resolución paso a paso» (abrirla cuenta como ver la resolución y queda en el intento) y «Fuente y condiciones de los datos».
- Simulación: cabecera con «Volver a fenómenos», el título, «Volver al ejercicio» (si los datos vienen de un ejercicio) y «Modelo y supuestos» (abre y enfoca el panel de modelo, que ya no está dentro de cada escena). Mesa: el visor ocupa el centro, «Vista» (estilo, etiquetas, cargas) es un desplegable sobre el visor y la barra inferior agrupa «Sustancia» y «Editar».

**Miniaturas**

- 22 miniaturas de tema y 5 de respaldo por rama en `miniaturas/`, generadas con `node scripts/generar-miniaturas.mjs` (determinista; se regeneran todas). Son SVG autónomos de 320 × 180, de paleta fija oscura (se leen igual en Día y Noche), sin scripts, enlaces ni imágenes incrustadas (el texto usa las fuentes del sistema). Se cargan como archivos locales (sin escenas 3D por tarjeta) y funcionan sin conexión.
- Las estructuras 2D se dibujan con openchemlib y el script aborta si la fórmula molecular no coincide con la declarada: C₉H₈O₄ (ácido acetilsalicílico, con éster y ácido carboxílico resaltados), C₈H₁₈ (3,4-dimetilhexano con la cadena numerada), C₆H₁₂O (ciclohexanol), C₅H₁₀O (pentanal y 3-metilbutanal, isómeros), C₄H₉Cl (2-clorobutano, con enlaces en cuña), C₃H₅Br (1-bromopropeno), C₆H₁₀ → C₆H₁₂ (ciclohexeno y ciclohexano) y C₆H₆ (respaldo de Orgánica). Ninguna aparece en el banco de ejercicios, de modo que la miniatura ilustra la familia sin revelar una respuesta.
- Los gráficos (balanza, matraces, partículas, barras de reactivo limitante, escala de oxidación, curvas de pH, de calibrado, cinéticas, de equilibrio y de energía) son esquemas hechos con funciones simples (exponenciales y logística) y datos didácticos: no son mediciones ni resultados de ningún ejercicio. Los ángulos y proporciones son esquemáticos.
- Si falla la imagen de un tema se muestra la de su rama; si también falla, la tarjeta conserva su forma y sigue siendo operativa. Créditos en `licencias/CREDITOS-DATOS.txt`.

## Fuentes y límites de los datos

- Todo ejercicio lleva su fuente y una etiqueta: *dato didáctico*, *referencia consultada* o *medición publicada*. **No se incluye ninguna medición publicada**: los datos de los enunciados se generan con fines didácticos.
- Las masas atómicas de la tabla periódica siguen sin fuente registrada (`docs/DATOS.md`); los ejercicios lo dicen y usan una tolerancia del 1 %. En las pruebas se contrastan con masas atómicas estándar de la IUPAC escritas a mano.
- ΔfH°, pKa y pKw conservan el nivel de verificación de `nucleo/termoquimica.ts` y `nucleo/acidoBase.ts` (consultadas en una fuente secundaria o de libro sin consultar). S° y las K de los equilibrios de ejemplo no están verificadas y la interfaz lo indica.
- La lista de reacciones orgánicas y los recuentos de isómeros (C₄H₁₀ = 2, C₅H₁₂ = 3, C₆H₁₄ = 5, C₃H₈O = 3, C₄H₁₀O = 7) son valores de libro revisados a mano: no se consultó una obra concreta. Cada isómero listado se verifica por programa (fórmula igual, estructura distinta), pero la exhaustividad del recuento no.
- Los modelos asumen actividades ≈ concentraciones, volúmenes aditivos, agua a 25 °C, ΔH° y ΔS° constantes con T y una sola fase (detalle en cada panel).

## Verificación realizada

Ver el informe de la entrega. Pendiente: firma digital del instalador (sin cambios), verificación de las simulaciones con mediciones publicadas y revisión de las fuentes marcadas «libro».
