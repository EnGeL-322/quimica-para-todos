# Tabla periódica y catálogo de peligros

La vista **Elementos** permite elegir una forma elemental por celda. El distintivo isotópico de radiactividad es independiente de la clasificación de peligro químico. **Sustancias y compuestos** incorpora la biblioteca de Química y formas adicionales respaldadas. La búsqueda por composición ofrece coincidencias, y la ficha solo muestra el peligro de la presentación elegida.

El catálogo de peligros se distribuye con la aplicación. Los pictogramas están empaquetados y la ficha ofrece la dirección seleccionable y un botón para copiarla. Abrir esa referencia fuera de la app requiere conexión. [Pictogramas de OSHA](https://www.osha.gov/hazcom/pictograms)

## Alcance de los datos

- **Peligro** y **Atención** reproducen la palabra asignada por la fuente a la forma mostrada. **Peligros documentados** agrupa casos con indicaciones y sin palabra explícita en la ficha consultada.
- **Sin clasificación de peligro según la fuente** exige una declaración explícita de esa ficha. Puede coexistir con indicaciones descriptivas como irritación mecánica por polvo.
- **Datos insuficientes** indica que falta una fuente aplicable a esa forma. La clasificación de una concentración, un estado físico, un grado comercial, un alótropo o un hidrato se limita a su alcance. El catálogo no estima el riesgo en condiciones de uso concretas.
- El indicador **Verificadas** cuenta entradas cuyas formas listadas tienen al menos un registro contrastado. **Parciales** indica que la entrada reúne formas con ficha y formas pendientes. **Pendientes** cuenta entradas sin ficha aplicable. Los totales se calculan desde el catálogo cargado.

La edición `2026-11-09.1` incluye 114 entradas (104 de la biblioteca de Química), con 95 verificadas, 3 parciales y 16 pendientes. Hay 103 formas con ficha contrastada. De los 118 elementos, 20 tienen una forma de referencia documentada y 3 más ofrecen fichas para alguna presentación específica.

## Actualización reproducible

1. Contrasta la identidad y la presentación exacta en la fuente original. Usa la sección de clasificación de ICSC o la sección 2 de una ficha de seguridad concreta. Si se cita ECHA, registra si el dato es armonizado o notificado. Anota el CAS, revisión, fecha de consulta, URL y alcance.
2. Añade o actualiza el registro en `datosPeligros.ts` o `datosPeligrosSales.ts`. Usa un identificador de forma estable. Enlaza a la biblioteca por su nombre exacto solo después de contrastar la identidad. Usa el número atómico para formas elementales y marca una sola forma de referencia por elemento. Conserva las formas alternativas como registros distintos.
3. Resume las indicaciones en español. Registra la palabra de advertencia, códigos H y pictogramas solo cuando la fuente los respalde. Mantén el primer registro como fuente explícita del color y conserva separados los otros alcances. Actualiza `VERSION_PELIGROS` y ejecuta las pruebas de tabla.
4. Para refrescar la electronegatividad de Pauling y los estados de oxidación tabulados, ejecuta `node scripts/obtener-propiedades-tabla.mjs AAAA-MM-DD`. El script admite como segundo argumento el JSON oficial descargado. Comprueba los valores ausentes, la coincidencia de símbolos y la advertencia sobre predicciones de elementos superpesados. Los datos de fusión, ebullición y densidad conservan sus sellos originales de procedencia.

[ICSC de la OIT y la OMS](https://www.ilo.org/resource/other/ilo-who-international-chemical-safety-cards-icscs) · [Sistema GHS, UNECE](https://unece.org/transport/dangerous-goods/ghs-rev11-2025) · [Inventario de ECHA](https://echa.europa.eu/en-GB/web/guest/regulations/clp/cl-inventory) · [Propiedades de elementos de PubChem](https://pubchem.ncbi.nlm.nih.gov/docs/elements) · [Isótopos de IUPAC](https://iupac.org/iptei/)
