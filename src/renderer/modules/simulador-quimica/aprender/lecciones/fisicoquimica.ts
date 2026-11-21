import type { RengLeccion } from '../tipos'
import { rengFuenteOpenStax } from './comun'

export const RENG_LECCIONES_FISICOQUIMICA: readonly RengLeccion[] = [
  {
    tema: 'cinetica',
    objetivo: 'Relacionar el orden de una reacción con la evolución de la concentración y calcular constante, semivida y concentración en un instante.',
    conceptos: [
      'La cinética estudia con qué rapidez cambia la concentración. La ley de velocidad (v = k[A]ⁿ) tiene un orden n que se determina con experimentos, no con la ecuación estequiométrica.',
      'Orden 0: la concentración baja linealmente. Orden 1: baja exponencialmente, [A] = [A]₀·e^(−kt), y la semivida t½ = ln 2 / k no depende de la concentración. Orden 2: 1/[A] crece linealmente y cada semivida dura el doble que la anterior.',
      'La constante k depende de la temperatura (ecuación de Arrhenius): subirla aumenta k. Sus unidades dependen del orden (1/s en orden 1, L/(mol·s) en orden 2).'
    ],
    ejemplo: {
      titulo: 'Orden 1: cuánto queda tras 75 minutos',
      enunciado: 'Una sustancia A se descompone con cinética de orden 1 y semivida de 30,0 min. Si [A]₀ = 0,800 mol/L, ¿cuánto queda después de 75,0 min?',
      datos: [
        { etiqueta: 'Orden', valor: '1' },
        { etiqueta: 'Semivida', valor: '30,0 min' },
        { etiqueta: 'Concentración inicial', valor: '0,800 mol/L' },
        { etiqueta: 'Tiempo', valor: '75,0 min' }
      ],
      pasos: [
        { accion: 'Calcular k: k = ln 2 / t½ = 0,693 / 30,0 min = 0,0231 min⁻¹.', dato: 'La semivida, que en orden 1 es independiente de [A]₀.', porQue: 'La semivida fija la constante de velocidad.', interpretar: 'Cada minuto se pierde un 2,3 % de lo que hay.' },
        { accion: 'Aplicar la ley integrada: [A] = [A]₀ · e^(−kt) = 0,800 · e^(−0,0231 · 75,0) = 0,141 mol/L.', dato: 'k, t y [A]₀.', porQue: 'Es la ecuación del orden 1.', interpretar: 'Queda aproximadamente el 18 % de la cantidad inicial.' },
        { accion: 'Comprobar con semividas: 75 min / 30 min = 2,5 semividas → 0,800 · 2^(−2,5) = 0,141 mol/L.', dato: 'Número de semividas transcurridas.', porQue: 'Es un cálculo independiente del anterior: solo usa que cada semivida divide la concentración entre 2.', interpretar: 'Ambos caminos coinciden.' }
      ],
      resultado: { texto: '0,141 mol/L', valor: 0.141, unidad: 'mol/L', tolRel: 0.01 },
      errorTipico: 'Usar la fórmula de orden 0 ([A] = [A]₀ − kt) con el valor de k de orden 1: da una concentración sin sentido físico.',
      revision: 'La concentración debe quedar entre 0 y [A]₀ y entre 2 y 3 semividas debe estar entre 1/4 y 1/8 de [A]₀ (0,100 a 0,200 mol/L).'
    },
    comprobacion: {
      pregunta: 'En una reacción de orden 1, ¿cómo cambia la semivida si se duplica la concentración inicial?',
      opciones: [
        { id: 'a', texto: 'No cambia: t½ = ln 2 / k.' },
        { id: 'b', texto: 'Se duplica.' },
        { id: 'c', texto: 'Se reduce a la mitad.' }
      ],
      correcta: 'a',
      explicacion: 'En orden 1 la semivida depende solo de k. Es una forma experimental de reconocer el orden 1: la semivida es constante a lo largo de la reacción.'
    },
    porNivel: {
      preuniversitario: 'Interpreta curvas y calcula una semivida de orden 1.',
      universitario: 'Aplica leyes integradas de orden 0, 1 y 2 y calcula concentraciones en un instante.',
      quimico: 'Deduce el orden con velocidades iniciales o semividas y usa Arrhenius con dos temperaturas.'
    },
    prerrequisitos: ['estequiometria', 'concentracion'],
    observar: { texto: 'En «Velocidad de reacción» elige el orden 1 con k = 0,2 y compara cómo cae la curva; la escena se abre en pausa en t = 0.' },
    fuentes: [rengFuenteOpenStax('secciones 12.1 «Chemical Reaction Rates», 12.3 «Rate Laws» y 12.4 «Integrated Rate Laws»')],
    recorrido: true
  },
  {
    tema: 'equilibrio',
    objetivo: 'Comparar Q con K para predecir el sentido de una reacción y calcular concentraciones de equilibrio con una tabla ICE.',
    conceptos: [
      'En el equilibrio las velocidades directa e inversa se igualan y las concentraciones dejan de cambiar. La constante K relaciona las concentraciones de equilibrio de productos y reactivos con sus coeficientes: no depende de las cantidades iniciales, sí de la temperatura.',
      'El cociente de reacción Q tiene la misma forma que K pero con las concentraciones del momento. Si Q < K la reacción avanza hacia los productos; si Q > K, hacia los reactivos; si Q ≈ K (dentro de la tolerancia) el sistema está en equilibrio.',
      'La tabla ICE (inicial, cambio, equilibrio) organiza el cálculo: se llama x al avance, se escriben las concentraciones de equilibrio en función de x y se resuelve K = ... para x.'
    ],
    ejemplo: {
      titulo: 'H₂ + I₂ ⇌ 2 HI con tabla ICE',
      enunciado: 'Para H₂ + I₂ ⇌ 2 HI con Kc = 50 (dato didáctico, a cierta temperatura), se parte de [H₂]₀ = [I₂]₀ = 0,010 mol/L y [HI]₀ = 0. Halla las concentraciones de equilibrio.',
      datos: [
        { etiqueta: 'Kc (dato didáctico)', valor: '50' },
        { etiqueta: 'Concentraciones iniciales', valor: '[H₂] = [I₂] = 0,010 mol/L; [HI] = 0' }
      ],
      pasos: [
        { accion: 'Comparar Q con K: Q = 0² / (0,010 · 0,010) = 0 < 50.', dato: 'Las concentraciones iniciales.', porQue: 'Q < K indica que la reacción avanza hacia los productos.', interpretar: 'Se formará HI.' },
        { accion: 'Tabla ICE: [H₂] = [I₂] = 0,010 − x y [HI] = 2x.', dato: 'La estequiometría 1 : 1 : 2.', porQue: 'Por cada x que reacciona de H₂ y de I₂ se forman 2x de HI.', interpretar: 'x es el avance en mol/L.' },
        { accion: 'Resolver: (2x)² / (0,010 − x)² = 50 → 2x / (0,010 − x) = √50 = 7,071 → x = 7,795 × 10⁻³ mol/L.', dato: 'El cuadrado perfecto permite sacar la raíz cuadrada en ambos lados.', porQue: 'Evita resolver una ecuación de segundo grado.', interpretar: 'Se ha consumido el 78 % del H₂.' },
        { accion: 'Concentraciones: [HI] = 2x = 0,0156 mol/L; [H₂] = [I₂] = 0,00220 mol/L. Comprobar: Q = 0,0156² / 0,00220² = 50.', dato: 'El valor de x.', porQue: 'La comprobación con K confirma la solución.', interpretar: 'En el equilibrio, Q ≈ K dentro de la tolerancia del redondeo.' }
      ],
      resultado: { texto: '[HI] = 0,0156 mol/L; [H₂] = [I₂] = 0,00220 mol/L', valor: 0.0156, unidad: 'mol/L', tolRel: 0.01 },
      errorTipico: 'Escribir [HI] = x en lugar de 2x, olvidando el coeficiente estequiométrico (cambia el resultado).',
      revision: 'Sustituye las concentraciones de equilibrio en K y comprueba que recuperas 50.'
    },
    comprobacion: {
      pregunta: 'Un sistema tiene Q = 120 y K = 50 a la misma temperatura. ¿Hacia dónde evoluciona?',
      opciones: [
        { id: 'a', texto: 'Hacia los reactivos, porque Q > K.' },
        { id: 'b', texto: 'Hacia los productos, porque Q es grande.' },
        { id: 'c', texto: 'No evoluciona: ya está en equilibrio.' }
      ],
      correcta: 'a',
      explicacion: 'Q > K significa que hay demasiado producto respecto del equilibrio: la reacción inversa predomina hasta que Q baje hasta K.'
    },
    porNivel: {
      preuniversitario: 'Compara Q con K y predice el sentido con ejemplos cualitativos.',
      universitario: 'Resuelve tablas ICE sencillas y aplica Le Chatelier.',
      quimico: 'Elige entre aproximar y resolver por completo, y trata cambios de volumen o de temperatura.',
      cientifico: 'Estima la sensibilidad del equilibrio a K y a las condiciones, y discute la validez del modelo.'
    },
    prerrequisitos: ['estequiometria', 'concentracion'],
    observar: { texto: 'En «Equilibrio químico» añade o quita una sustancia y compara las barras del equilibrio inicial y del nuevo.' },
    fuentes: [rengFuenteOpenStax('secciones 13.2 «Equilibrium Constants», 13.3 «Shifting Equilibria: Le Châtelier’s Principle» y 13.4 «Equilibrium Calculations»')],
    recorrido: false
  },
  {
    tema: 'termo',
    objetivo: 'Decidir si una reacción es espontánea con ΔG = ΔH − TΔS y hallar la temperatura de cambio.',
    conceptos: [
      'ΔH indica si la reacción libera calor (exotérmica, ΔH < 0) o lo absorbe (endotérmica, ΔH > 0). ΔS mide el cambio en el desorden molecular. ΔG combina ambos: ΔG = ΔH − TΔS.',
      'Una reacción es espontánea (termodinámicamente favorable) cuando ΔG < 0. Espontánea no significa rápida: la velocidad depende de la cinética, no de ΔG.',
      'Si ΔH y ΔS tienen el mismo signo, la espontaneidad depende de la temperatura: hay una temperatura T = ΔH/ΔS a partir de la cual cambia el signo de ΔG. Esto supone ΔH y ΔS constantes, lo que solo es una aproximación.'
    ],
    ejemplo: {
      titulo: 'Reacción exotérmica con ΔS negativo',
      enunciado: 'Una reacción tiene ΔH = −40,0 kJ y ΔS = −100 J/K (datos didácticos). ¿Es espontánea a 298 K? ¿A qué temperatura cambia?',
      datos: [
        { etiqueta: 'ΔH (didáctico)', valor: '−40,0 kJ' },
        { etiqueta: 'ΔS (didáctico)', valor: '−100 J/K = −0,100 kJ/K' },
        { etiqueta: 'Temperatura', valor: '298 K' }
      ],
      pasos: [
        { accion: 'Unificar unidades: ΔS = −100 J/K = −0,100 kJ/K.', dato: 'ΔH en kJ y ΔS en J/K.', porQue: 'Los términos de ΔG deben tener la misma unidad.', interpretar: 'Mezclar kJ con J daría un error de factor 1000.' },
        { accion: 'Calcular ΔG a 298 K: ΔG = −40,0 − 298 · (−0,100) = −10,2 kJ.', dato: 'ΔH, ΔS y T.', porQue: 'ΔG < 0 indica espontaneidad.', interpretar: 'A 298 K la reacción es espontánea.' },
        { accion: 'Hallar la temperatura de cambio: ΔG = 0 → T = ΔH/ΔS = −40,0 / −0,100 = 400 K.', dato: 'Ambos signos son negativos.', porQue: 'ΔG cambia de signo cuando TΔS = ΔH.', interpretar: 'Por encima de 400 K el término −TΔS domina y la reacción deja de ser espontánea.' }
      ],
      resultado: { texto: 'ΔG(298 K) = −10,2 kJ: espontánea; cambia a 400 K', valor: -10.2, unidad: 'kJ', tolRel: 0.01 },
      errorTipico: 'Mezclar kJ con J (usar ΔS = −100 en lugar de −0,100): ΔG saldría −40 + 29 800 kJ.',
      revision: 'Comprueba que a la temperatura de cambio ΔG vale cero y que a T menor y mayor tiene signos opuestos.'
    },
    comprobacion: {
      pregunta: 'Una reacción tiene ΔG < 0. ¿Qué se puede afirmar?',
      opciones: [
        { id: 'a', texto: 'Es termodinámicamente favorable, pero no dice nada sobre su velocidad.' },
        { id: 'b', texto: 'Ocurrirá de forma rápida.' },
        { id: 'c', texto: 'Es exotérmica.' }
      ],
      correcta: 'a',
      explicacion: 'ΔG < 0 es el criterio de espontaneidad termodinámica. Puede ser lentísima si su energía de activación es alta, y puede ser endotérmica si el término TΔS compensa.'
    },
    porNivel: {
      preuniversitario: 'Clasifica una reacción como exotérmica o endotérmica y predice el signo de ΔG con ΔH y ΔS.',
      universitario: 'Calcula ΔG y la temperatura de cambio con unidades coherentes.',
      quimico: 'Relaciona ΔG° con K y discute ΔH y ΔS constantes como aproximación.',
      cientifico: 'Propaga la incertidumbre de ΔH° y ΔS° y evalúa la sensibilidad de ΔG a la temperatura.'
    },
    prerrequisitos: ['estequiometria'],
    observar: { texto: 'En «Energía de reacción» elige una reacción y cambia la temperatura para ver cuándo ΔG cambia de signo.' },
    fuentes: [rengFuenteOpenStax('secciones 16.1 «Spontaneity» y 16.4 «Free Energy»')],
    recorrido: false
  },
  {
    tema: 'ajuste-cinetico',
    objetivo: 'Decidir qué orden describe mejor unos datos [A] frente a t comparando linealizaciones y estimar la constante k.',
    conceptos: [
      'Cada orden tiene una linealización: [A] frente a t es recta en orden 0, ln[A] frente a t es recta en orden 1 y 1/[A] frente a t es recta en orden 2. La pendiente da k (con el signo y las unidades de cada orden).',
      'Se ajusta una recta por mínimos cuadrados a cada linealización y se comparan el coeficiente de determinación R² y los residuos. Un R² mayor no basta por sí solo: los residuos de un buen modelo no muestran un patrón (curvatura).',
      'Los datos reales tienen ruido: con pocos puntos puede haber varios modelos compatibles. La conclusión debe nombrar el intervalo de tiempo ajustado y las limitaciones, no solo el mejor R².'
    ],
    ejemplo: {
      titulo: 'Comparar órdenes con cinco puntos',
      enunciado: 'Se registran [A] (mol/L) = 0,100; 0,0607; 0,0368; 0,0223; 0,0135 a t = 0; 10; 20; 30; 40 min (datos didácticos). Decide el orden y estima k.',
      datos: [
        { etiqueta: 't (min)', valor: '0; 10; 20; 30; 40' },
        { etiqueta: '[A] (mol/L)', valor: '0,100; 0,0607; 0,0368; 0,0223; 0,0135' }
      ],
      pasos: [
        { accion: 'Linealizar de tres formas: [A], ln[A] y 1/[A] frente a t.', dato: 'Las cinco parejas (t, [A]).', porQue: 'Solo el orden correcto da una recta.', interpretar: 'Se necesitan tres ajustes por mínimos cuadrados.' },
        { accion: 'Calcular R²: orden 0 → 0,925; orden 1 → 0,999999; orden 2 → 0,924.', dato: 'El resultado de cada ajuste.', porQue: 'R² cuantifica qué fracción de la variación explica la recta.', interpretar: 'Solo el orden 1 describe los datos con precisión; las otras dos curvan.' },
        { accion: 'Estimar k en el ajuste de orden 1: pendiente de ln[A] = −0,0501 min⁻¹ → k = 0,0501 min⁻¹.', dato: 'La pendiente de la recta de ln[A] frente a t.', porQue: 'En orden 1, ln[A] = ln[A]₀ − kt: la pendiente es −k.', interpretar: 'Semivida: ln 2 / 0,0501 = 13,8 min.' },
        { accion: 'Revisar los residuos de orden 1: no muestran curvatura; los de órdenes 0 y 2 sí.', dato: 'Las diferencias entre dato y recta.', porQue: 'Los residuos con forma indican un modelo inadecuado aunque R² parezca alto.', interpretar: 'Se acepta orden 1 en el intervalo 0–40 min, con k = 0,050 min⁻¹.' }
      ],
      resultado: { texto: 'Orden 1; k = 0,0501 min⁻¹', valor: 0.0501, unidad: 'min⁻¹', tolRel: 0.01 },
      errorTipico: 'Elegir el modelo con R² «más alto» sin mirar los residuos, o comparar R² de ajustes con distinto número de puntos.',
      revision: 'Comprueba que la pendiente es negativa en ln[A] y que k tiene las unidades de un orden 1 (1/min).'
    },
    comprobacion: {
      pregunta: 'Los datos dan R² = 0,925 en orden 0 y R² = 0,9999 en orden 1, pero los residuos de orden 1 muestran una curvatura clara. ¿Qué se concluye?',
      opciones: [
        { id: 'a', texto: 'Que el orden 1 no es del todo adecuado: la curvatura sugiere otro modelo o una causa experimental.' },
        { id: 'b', texto: 'Que el orden 1 es correcto porque su R² es mayor.' },
        { id: 'c', texto: 'Que no existe ningún modelo.' }
      ],
      correcta: 'a',
      explicacion: 'Un R² alto no demuestra un modelo si los residuos tienen estructura. Hay que revisar el intervalo, los errores de medida y otros órdenes antes de concluir.'
    },
    porNivel: {
      quimico: 'Deduce el orden de reacción a partir de cómo cambia la semivida y justifica la elección con lo observado.',
      cientifico: 'Ajusta, compara órdenes con R² y residuos, estima k con su incertidumbre y declara qué afirmaciones sostienen los datos.'
    },
    prerrequisitos: ['cinetica', 'calibracion'],
    observar: { texto: 'En «Velocidad de reacción» simula la curva de orden 1 con k = 0,05 y compárala con tus puntos.' },
    fuentes: [rengFuenteOpenStax('secciones 12.3 «Rate Laws» y 12.4 «Integrated Rate Laws»')],
    recorrido: false
  }
]
