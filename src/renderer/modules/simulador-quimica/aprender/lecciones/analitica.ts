import type { RengLeccion } from '../tipos'
import { rengFuenteOpenStax, RENG_FECHA_CONSULTA } from './comun'

export const RENG_LECCIONES_ANALITICA: readonly RengLeccion[] = [
  {
    tema: 'ph',
    objetivo: 'Calcular el pH de una disolución ácida o básica y decidir cuándo una aproximación es aceptable.',
    conceptos: [
      'El pH es −log₁₀ de la actividad del ion hidrógeno; en disoluciones diluidas se aproxima por la concentración molar [H₃O⁺]. A 25 °C, pH + pOH = 14 (pKw = 14,00).',
      'Un ácido fuerte se disocia por completo: [H₃O⁺] = C. Un ácido débil se disocia solo en parte y se describe con su constante Ka: Ka = x² / (C − x), donde x es [H₃O⁺] en el equilibrio.',
      'Si x es mucho menor que C (se suele aceptar menos del 5 %), se aproxima x ≈ √(Ka·C). Si no, se resuelve la ecuación de segundo grado. Siempre hay que comprobar la aproximación.'
    ],
    ejemplo: {
      titulo: 'Ácido débil con aproximación comprobada',
      enunciado: 'Un ácido débil monoprótico HA, con Ka = 4,0 × 10⁻⁵ (dato didáctico), tiene una concentración inicial de 0,020 mol/L a 25 °C. Calcula el pH con la ecuación exacta y compara con la aproximación √(Ka·C).',
      datos: [
        { etiqueta: 'Concentración inicial', valor: '0,020 mol/L' },
        { etiqueta: 'Ka (dato didáctico)', valor: '4,0 × 10⁻⁵' },
        { etiqueta: 'Temperatura', valor: '25 °C' }
      ],
      pasos: [
        { accion: 'Plantear el equilibrio: Ka = x² / (C − x) con x = [H₃O⁺] = [A⁻].', dato: 'C y Ka.', porQue: 'Un ácido débil no se disocia por completo: hay que usar la constante.', interpretar: 'La incógnita es x.' },
        { accion: 'Resolver sin aproximar: x² + Ka·x − Ka·C = 0 → x = 8,75 × 10⁻⁴ mol/L.', dato: 'x = [−Ka + √(Ka² + 4·Ka·C)] / 2.', porQue: 'La fórmula cuadrática es válida siempre.', interpretar: 'x es menos del 5 % de C (4,4 %).' },
        { accion: 'Calcular el pH: pH = −log(8,75 × 10⁻⁴) = 3,06.', dato: 'El valor de x.', porQue: 'pH se define con el logaritmo de [H₃O⁺].', interpretar: 'El ácido débil de 0,020 mol/L es bastante menos ácido que un fuerte de igual concentración (pH 1,70).' },
        { accion: 'Comparar con la aproximación: x ≈ √(4,0 × 10⁻⁵ · 0,020) = 8,94 × 10⁻⁴ → pH 3,05.', dato: 'La relación x/C.', porQue: 'Con x/C = 4,4 %, la aproximación es aceptable pero se acerca al límite del 5 %.', interpretar: 'La diferencia en pH es de 0,01 unidades: se puede usar si no se pide mayor exactitud.' }
      ],
      resultado: { texto: 'pH = 3,06 (exacto); 3,05 con la aproximación', valor: 3.06, unidad: '', tolRel: 0.005 },
      errorTipico: 'Aplicar la aproximación sin comprobarla: cuando x/C supera el 5 % o el ácido está muy diluido, el error crece.',
      revision: 'Sustituye x en Ka: (8,75 × 10⁻⁴)² / (0,020 − 8,75 × 10⁻⁴) debe dar 4,0 × 10⁻⁵.'
    },
    comprobacion: {
      pregunta: 'Un ácido fuerte y un ácido débil tienen la misma concentración 0,020 mol/L. ¿Cuál tiene menor pH?',
      opciones: [
        { id: 'a', texto: 'El ácido fuerte, porque se disocia por completo y aporta más H₃O⁺.' },
        { id: 'b', texto: 'El ácido débil, porque su Ka es pequeña.' },
        { id: 'c', texto: 'Igual: tienen la misma concentración.' }
      ],
      correcta: 'a',
      explicacion: 'El pH depende de [H₃O⁺], no de la concentración total del ácido. El fuerte da 0,020 mol/L (pH 1,70) y el débil unos 9 × 10⁻⁴ mol/L (pH ≈ 3).'
    },
    porNivel: {
      preuniversitario: 'Calcula el pH de ácidos y bases fuertes con −log[H⁺].',
      universitario: 'Calcula el pH de ácidos débiles con Ka y comprueba la aproximación.',
      quimico: 'Elige entre aproximación y solución exacta, y trata amortiguadores y sales hidrolizables.',
      cientifico: 'Contrasta con medidas, estima la sensibilidad del pH a Ka y discute actividades frente a concentraciones.'
    },
    prerrequisitos: ['concentracion'],
    observar: { texto: 'En «Ácidos y bases» elige un ácido, pulsa «Calcular» y compara su pH con el de esta lección.' },
    fuentes: [rengFuenteOpenStax('secciones 14.2 «pH and pOH» y 14.3 «Relative Strengths of Acids and Bases»')],
    recorrido: false
  },
  {
    tema: 'valoracion',
    objetivo: 'Calcular la concentración de un analito a partir del volumen de valorante en el punto de equivalencia e interpretar la curva de valoración.',
    conceptos: [
      'En una valoración se añade una disolución de concentración conocida (valorante) hasta que reacciona exactamente con el analito: es el punto de equivalencia. En ese punto n(ácido) = n(base) si la estequiometría es 1 : 1.',
      'El punto final es lo que se observa (cambio de color de un indicador): debe estar lo más cerca posible del de equivalencia, pero no son lo mismo. La diferencia es un error de la valoración.',
      'El pH en el punto de equivalencia depende de la fuerza de ácido y base: 7,00 a 25 °C para ácido fuerte con base fuerte; mayor que 7 para ácido débil con base fuerte; menor que 7 para base débil con ácido fuerte.'
    ],
    ejemplo: {
      titulo: 'Concentración de un ácido clorhídrico',
      enunciado: 'Se valoran 25,00 mL de HCl con NaOH 0,1000 mol/L; el punto de equivalencia se alcanza con 20,50 mL de NaOH. ¿Qué concentración tiene el HCl y qué pH hay en el punto de equivalencia?',
      datos: [
        { etiqueta: 'Volumen de HCl', valor: '25,00 mL' },
        { etiqueta: 'NaOH', valor: '0,1000 mol/L; gastado 20,50 mL' },
        { etiqueta: 'Reacción', valor: 'HCl + NaOH → NaCl + H₂O (1 : 1)' }
      ],
      pasos: [
        { accion: 'Moles de base gastados: n = 0,1000 mol/L · 0,02050 L = 2,050 × 10⁻³ mol.', dato: 'La concentración y el volumen del valorante en el equivalente.', porQue: 'La estequiometría exige comparar moles, no volúmenes.', interpretar: 'Eso es lo que reaccionó con el ácido.' },
        { accion: 'Moles de ácido: igual que los de base por la razón 1 : 1 → 2,050 × 10⁻³ mol.', dato: 'La ecuación ajustada.', porQue: 'En el equivalente reaccionan cantidades estequiométricas.', interpretar: 'El ácido tenía 2,050 mmol.' },
        { accion: 'Concentración del ácido: C = 2,050 × 10⁻³ mol / 0,02500 L = 0,0820 mol/L.', dato: 'El volumen inicial del analito.', porQue: 'La concentración se refiere al volumen de analito, no al total.', interpretar: 'El ácido es menos concentrado que el NaOH porque se gastó menos volumen que el inicial.' },
        { accion: 'pH en el equivalente: con ácido y base fuertes, la sal NaCl no hidroliza → pH = 7,00 a 25 °C.', dato: 'La fuerza del ácido y de la base.', porQue: 'No queda exceso de ácido ni de base.', interpretar: 'Un indicador con viraje cercano a 7 marca bien el punto final.' }
      ],
      resultado: { texto: '0,0820 mol/L; pH en el equivalente 7,00', valor: 0.0820, unidad: 'mol/L', tolRel: 0.01 },
      errorTipico: 'Igualar C₁V₁ = C₂V₂ sin comprobar que la estequiometría es 1 : 1 (con un ácido diprótico habría que multiplicar).',
      revision: 'La concentración del analito debe ser coherente con el volumen: se gastó menos NaOH que el volumen de ácido, por lo que C(ácido) < C(NaOH).'
    },
    comprobacion: {
      pregunta: 'Para valorar ácido acético (débil) con NaOH, ¿dónde queda el pH en el punto de equivalencia?',
      opciones: [
        { id: 'a', texto: 'Mayor que 7, porque el acetato formado es una base débil.' },
        { id: 'b', texto: 'Exactamente 7, como en toda neutralización.' },
        { id: 'c', texto: 'Menor que 7, porque queda ácido sin reaccionar.' }
      ],
      correcta: 'a',
      explicacion: 'En el equivalente no queda ácido: solo acetato, base conjugada de un ácido débil, que se hidroliza y da pH > 7.'
    },
    porNivel: {
      preuniversitario: 'Calcula la concentración del analito con 1 : 1 y datos del equivalente.',
      universitario: 'Calcula el pH en distintos puntos de la curva y la concentración con otras estequiometrías.',
      quimico: 'Elige indicador, justifica el pH del equivalente según la fuerza y estima el error de la valoración.',
      cientifico: 'Ajusta la curva con datos y estima la incertidumbre del equivalente.'
    },
    prerrequisitos: ['ph', 'estequiometria'],
    observar: { texto: 'En «Mezcla ácido–base» cambia los volúmenes y mira dónde cruza el pH 7; guarda la corrida en el Cuaderno si quieres compararla.' },
    fuentes: [rengFuenteOpenStax('sección 14.7 «Acid-Base Titrations» y 4.5 «Quantitative Chemical Analysis»')],
    recorrido: false
  },
  {
    tema: 'dilucion',
    objetivo: 'Preparar un patrón por dilución: calcular la alícuota, el factor de dilución y comprobar la concentración final.',
    conceptos: [
      'Preparar un patrón por dilución consiste en tomar una alícuota (volumen medido con precisión) de una disolución concentrada y llevarla con disolvente a un volumen final en un matraz aforado.',
      'El factor de dilución F = C₁ / C₂ = V₂ / V₁ resume cuántas veces se diluye. Con él la alícuota es V₁ = V₂ / F. Una serie de diluciones sucesivas multiplica los factores: dos diluciones 1 : 10 equivalen a 1 : 100.',
      'El material elegido condiciona la exactitud: la pipeta aforada y el matraz aforado tienen una tolerancia mucho menor que una probeta. Una dilución en serie arrastra y acumula el error de cada paso.'
    ],
    ejemplo: {
      titulo: 'Un patrón de 0,0200 mol/L a partir de un stock de 0,500 mol/L',
      enunciado: 'Se quiere preparar 100,0 mL de un patrón 0,0200 mol/L a partir de una disolución madre 0,500 mol/L. ¿Qué alícuota se toma y cuál es el factor de dilución?',
      datos: [
        { etiqueta: 'Disolución madre', valor: '0,500 mol/L' },
        { etiqueta: 'Patrón deseado', valor: '0,0200 mol/L en 100,0 mL' }
      ],
      pasos: [
        { accion: 'Calcular el factor de dilución: F = C₁ / C₂ = 0,500 / 0,0200 = 25.', dato: 'Las dos concentraciones.', porQue: 'El factor indica cuántas veces hay que diluir.', interpretar: 'El volumen final será 25 veces el de la alícuota.' },
        { accion: 'Calcular la alícuota: V₁ = V₂ / F = 100,0 mL / 25 = 4,00 mL.', dato: 'El volumen final deseado.', porQue: 'Como V₂ = F·V₁, V₁ = V₂/F.', interpretar: 'Se necesitan 4,00 mL de disolución madre.' },
        { accion: 'Describir el procedimiento: medir 4,00 mL con una pipeta, pasarlos a un matraz aforado de 100,0 mL, añadir agua hasta el aforo y homogeneizar.', dato: 'El material: pipeta y matraz aforado.', porQue: 'El aforo garantiza el volumen final conocido.', interpretar: 'La concentración final no depende del volumen de agua que se añada, sino de llegar al aforo.' },
        { accion: 'Comprobar: 0,500 mol/L · 4,00 mL = 2,00 mmol = 0,0200 mol/L · 100,0 mL.', dato: 'Los moles del soluto antes y después.', porQue: 'La cantidad de soluto no cambia al diluir.', interpretar: 'Los moles coinciden: el planteamiento es coherente.' }
      ],
      resultado: { texto: 'Alícuota 4,00 mL; F = 25', valor: 4.00, unidad: 'mL', tolRel: 0.01 },
      errorTipico: 'Añadir 100,0 mL de agua a los 4,00 mL: el volumen final sería 104,0 mL y la concentración quedaría por debajo de lo previsto (0,0192 mol/L).',
      revision: 'Comprueba que C₁V₁ = C₂V₂ y que C₂ < C₁ y V₂ > V₁.'
    },
    comprobacion: {
      pregunta: 'Se toman 25,0 mL de una disolución 0,200 mol/L y se llevan a 100,0 mL. ¿Cuál es la concentración final?',
      opciones: [
        { id: 'a', texto: '0,0500 mol/L' },
        { id: 'b', texto: '0,800 mol/L' },
        { id: 'c', texto: '0,0200 mol/L' }
      ],
      correcta: 'a',
      explicacion: 'F = 100,0 / 25,0 = 4; C₂ = 0,200 / 4 = 0,0500 mol/L. Los moles (5,00 mmol) son los mismos antes y después.'
    },
    porNivel: {
      preuniversitario: 'Calcula la alícuota de una dilución simple y el factor.',
      universitario: 'Prepara varios patrones y calcula diluciones en serie.',
      quimico: 'Elige el material, acumula tolerancias y decide qué patrón de la serie sirve para el rango de interés.'
    },
    prerrequisitos: ['concentracion'],
    observar: { texto: 'Prepara la dilución en papel y úsala en «Calibración» para construir la curva de patrones.' },
    fuentes: [rengFuenteOpenStax('secciones 3.3 «Molarity» y 3.4 «Other Units for Solution Concentrations»')],
    recorrido: true
  },
  {
    tema: 'calibracion',
    objetivo: 'Construir una curva de calibración, calcular la concentración de una muestra por interpolación y estimar su incertidumbre.',
    conceptos: [
      'Una curva de calibración relaciona una señal medida (por ejemplo, absorbancia) con la concentración de patrones conocidos. Si la respuesta es lineal, se ajusta una recta por mínimos cuadrados: A = m·c + b.',
      'La concentración de una muestra se calcula despejando c = (A − b) / m. Solo es válida dentro del intervalo de los patrones: fuera de él hay que extrapolar, y eso no está respaldado por los datos.',
      'La incertidumbre de c depende de la dispersión de los puntos alrededor de la recta (desviación típica de los residuos), del número de patrones y de lo lejos que esté la señal de la muestra del centro de la calibración.'
    ],
    ejemplo: {
      titulo: 'Concentración de una muestra interpolada',
      enunciado: 'Cinco patrones (dato didáctico, no medición publicada) dan absorbancias A = 0,003; 0,152; 0,301; 0,449 y 0,600 para concentraciones de 0; 2,0; 4,0; 6,0 y 8,0 mg/L. Una muestra da A = 0,375. Calcula su concentración y la incertidumbre.',
      datos: [
        { etiqueta: 'Concentraciones de los patrones', valor: '0; 2,0; 4,0; 6,0; 8,0 mg/L' },
        { etiqueta: 'Absorbancias', valor: '0,003; 0,152; 0,301; 0,449; 0,600' },
        { etiqueta: 'Muestra', valor: 'A = 0,375 (una lectura)' }
      ],
      pasos: [
        { accion: 'Ajustar la recta por mínimos cuadrados: m = Sxy / Sxx = 2,982 / 40 = 0,07455 L/mg; b = 0,0028.', dato: 'Los cinco pares (c, A), con c̄ = 4,0 mg/L.', porQue: 'La recta resume la relación señal–concentración con todos los patrones.', interpretar: 'La pendiente es la sensibilidad: 0,07455 de absorbancia por cada mg/L.' },
        { accion: 'Evaluar la calidad: R² = 0,99999 y desviación típica de los residuos s = 0,0008.', dato: 'Los residuos de cada punto respecto de la recta.', porQue: 'Un R² alto no basta: los residuos deben ser pequeños y sin patrón.', interpretar: 'El ajuste es excelente en este conjunto didáctico.' },
        { accion: 'Interpolar: c = (0,375 − 0,0028) / 0,07455 = 4,99 mg/L.', dato: 'La absorbancia de la muestra, entre 0,003 y 0,600.', porQue: 'La muestra queda dentro del intervalo calibrado: la interpolación es válida.', interpretar: 'La muestra contiene aproximadamente 5,0 mg/L.' },
        { accion: 'Estimar la incertidumbre: s_c = (s / m) · √(1/k + 1/n + (A − Ā)² / (m²·Sxx)) = 0,012 mg/L, con k = 1 lectura y n = 5 patrones.', dato: 's, m, Sxx y A − Ā.', porQue: 'La fórmula combina la dispersión de la recta y la posición de la muestra respecto del centro.', interpretar: 'Resultado: c = 4,99 ± 0,01 mg/L (incertidumbre típica).' }
      ],
      resultado: { texto: 'c = 4,99 ± 0,01 mg/L', valor: 4.99, unidad: 'mg/L', tolRel: 0.01 },
      errorTipico: 'Usar la recta para una señal fuera del intervalo de los patrones (por ejemplo, A = 0,9): sería extrapolar sin respaldo.',
      revision: 'Comprueba que la señal de la muestra queda entre la del patrón más bajo y la del más alto, y que no hay un patrón con residuo mucho mayor que los demás.'
    },
    comprobacion: {
      pregunta: 'Una muestra da A = 0,900 y la curva solo llega a 0,600. ¿Qué se debe hacer?',
      opciones: [
        { id: 'a', texto: 'Diluir la muestra y repetir la medida dentro del intervalo calibrado.' },
        { id: 'b', texto: 'Extrapolar la recta: como R² es 0,999 es seguro.' },
        { id: 'c', texto: 'Restar la diferencia a mano.' }
      ],
      correcta: 'a',
      explicacion: 'No hay datos que respalden la linealidad por encima de 0,600. La solución es diluir la muestra con un factor conocido y corregir después.'
    },
    porNivel: {
      quimico: 'Ajusta una recta, interpola y justifica si la señal cae dentro del intervalo calibrado.',
      cientifico: 'Estima la incertidumbre de la concentración, analiza residuos y decide si un punto debe descartarse.'
    },
    prerrequisitos: ['dilucion'],
    observar: { texto: 'Guarda la calibración como serie didáctica en el Cuaderno y compárala con otra medida (CSV) mediante residuos.' },
    fuentes: [
      rengFuenteOpenStax('sección 1.5 «Measurement Uncertainty, Accuracy, and Precision» (contexto de incertidumbre)'),
      { texto: 'Mínimos cuadrados ordinarios: fórmulas estándar de regresión lineal', enlace: '', consultada: RENG_FECHA_CONSULTA, alcance: 'No se consultó una obra concreta. Los números del ejemplo se comprueban en las pruebas con un cálculo independiente; los datos son didácticos.' }
    ],
    recorrido: false
  }
]
