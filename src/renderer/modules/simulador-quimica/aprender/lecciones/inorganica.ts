import type { RengLeccion } from '../tipos'
import { rengFuenteOpenStax } from './comun'

export const RENG_LECCIONES_INORGANICA: readonly RengLeccion[] = [
  {
    tema: 'formular-nombrar',
    objetivo: 'Escribir la fórmula de un compuesto iónico a partir de las cargas de sus iones y nombrarlo, distinguiendo carga, composición y estructura.',
    conceptos: [
      'Tres cosas distintas: la carga es una propiedad de un ion (Fe³⁺, SO₄²⁻); la composición es la proporción de átomos o iones que indica la fórmula (Fe₂(SO₄)₃); la estructura es cómo están ordenados en el espacio. Un compuesto iónico no forma moléculas: su fórmula es una fórmula unidad que expresa la proporción mínima de iones.',
      'La suma de cargas de un compuesto neutro es cero. Para obtener la proporción se busca el mínimo común múltiplo de las cargas (o se cruzan las cargas y se simplifica). Los iones poliatómicos se escriben entre paréntesis cuando su subíndice es mayor que 1.',
      'El nombre se construye con el anión y luego el catión. Si el metal tiene varias cargas se indica con números romanos (nomenclatura de Stock): hierro(III) es Fe³⁺. Na y Na⁺ no son lo mismo: el primero es el átomo neutro y el segundo el ion.'
    ],
    ejemplo: {
      titulo: 'Sulfato de hierro(III)',
      enunciado: 'Escribe la fórmula del compuesto que forman el ion hierro(III) y el ion sulfato, y nómbralo.',
      datos: [
        { etiqueta: 'Catión', valor: 'Fe³⁺ (hierro(III))' },
        { etiqueta: 'Anión', valor: 'SO₄²⁻ (sulfato)' }
      ],
      pasos: [
        { accion: 'Escribir cada ion con su carga: Fe³⁺ y SO₄²⁻.', dato: 'El nombre «hierro(III)» indica la carga +3.', porQue: 'La fórmula sale de las cargas; si el metal tiene varias, el numeral romano elige una.', interpretar: 'Las cargas (+3 y −2) no se compensan una a una.' },
        { accion: 'Buscar la proporción que anula la carga: mcm(3, 2) = 6 → 2 Fe³⁺ (+6) y 3 SO₄²⁻ (−6).', dato: 'Las cargas +3 y −2.', porQue: 'El compuesto es neutro: la suma de cargas debe ser cero con los números enteros más pequeños.', interpretar: 'La proporción es 2 : 3.' },
        { accion: 'Escribir la fórmula con paréntesis en el ion poliatómico: Fe₂(SO₄)₃.', dato: 'El ion sulfato tiene cinco átomos y su subíndice es 3.', porQue: 'Sin paréntesis, SO₄₃ no se entiende: el subíndice afecta a todo el ion.', interpretar: 'La composición es 2 Fe, 3 S y 12 O.' },
        { accion: 'Nombrar: «sulfato de hierro(III)» (Stock); tradicional: sulfato férrico.', dato: 'El anión se nombra primero y el catión con su carga.', porQue: 'Así lo establece la nomenclatura de compuestos iónicos.', interpretar: 'Fe₂(SO₄)₃ es una fórmula unidad: en el sólido no hay moléculas de Fe₂(SO₄)₃.' }
      ],
      resultado: { texto: 'Fe₂(SO₄)₃, sulfato de hierro(III)' },
      errorTipico: 'Escribir FeSO₄ (que es sulfato de hierro(II)) porque se olvida cruzar las cargas, o escribir SO₄₃ sin paréntesis.',
      revision: 'Suma las cargas: 2 · (+3) + 3 · (−2) = 0. Si no da cero, la proporción es incorrecta.'
    },
    comprobacion: {
      pregunta: '¿Por qué el cloruro de magnesio es MgCl₂ y no MgCl?',
      opciones: [
        { id: 'a', texto: 'Porque el magnesio forma Mg²⁺ y cada Cl⁻ aporta solo −1: hacen falta dos para que la suma sea cero.' },
        { id: 'b', texto: 'Porque el magnesio tiene dos átomos por molécula de cloruro.' },
        { id: 'c', texto: 'Porque el cloro siempre lleva subíndice 2.' }
      ],
      correcta: 'a',
      explicacion: 'La fórmula de un compuesto iónico expresa la proporción de iones que anula la carga: Mg²⁺ + 2 Cl⁻. No hay moléculas MgCl₂ en el sólido, y el 2 no depende del cloro sino de la carga del magnesio.'
    },
    porNivel: {
      preuniversitario: 'Cruza cargas de iones monoatómicos y nombra con el numeral romano indicado.',
      universitario: 'Incluye iones poliatómicos, paréntesis y las tres nomenclaturas (sistemática, Stock y tradicional).',
      quimico: 'Distingue especie, carga, fórmula unidad y estructura; decide cuando una fórmula es ambigua y pide más datos.'
    },
    prerrequisitos: [],
    observar: { texto: 'En la Mesa, «Formular y nombrar»: escribe NaCl y compara NaOH con [Na+].[OH-]; el átomo Na y el ion Na⁺ se mantienen como identidades distintas.' },
    fuentes: [rengFuenteOpenStax('secciones 2.6 «Ionic and Molecular Compounds» y 2.7 «Chemical Nomenclature»')],
    recorrido: true
  },
  {
    tema: 'oxidacion',
    objetivo: 'Asignar el número de oxidación de cada elemento en un compuesto o ion con las reglas de prioridad.',
    conceptos: [
      'El número de oxidación es la carga que tendría un átomo si todos sus enlaces fuesen iónicos: es un recurso de contabilidad de electrones, no una carga real salvo en iones simples.',
      'La suma de los números de oxidación es 0 en un compuesto neutro y la carga del ion en un ion. Se asignan primero los más fiables: metales alcalinos +1, alcalinotérreos +2, flúor −1, hidrógeno +1 (−1 en hidruros metálicos), oxígeno −2 (−1 en peróxidos).',
      'El elemento restante se obtiene por diferencia. Si el resultado es absurdo (por ejemplo, un número fraccionario que no corresponda a un caso especial), se ha aplicado mal alguna regla.'
    ],
    ejemplo: {
      titulo: 'El manganeso en el permanganato de potasio',
      enunciado: '¿Qué número de oxidación tiene el manganeso en KMnO₄?',
      datos: [{ etiqueta: 'Compuesto', valor: 'KMnO₄ (neutro)' }],
      pasos: [
        { accion: 'Asignar K = +1 (alcalino) y O = −2.', dato: 'La fórmula: 1 K, 1 Mn, 4 O.', porQue: 'Se empieza por los elementos con número fijo.', interpretar: 'Quedan por determinar solo el Mn.' },
        { accion: 'Plantear la suma: (+1) + x + 4 · (−2) = 0.', dato: 'Es un compuesto neutro: la suma es cero.', porQue: 'La conservación de la carga total fija la incógnita.', interpretar: 'x − 7 = 0.' },
        { accion: 'Resolver: x = +7.', dato: 'El resultado del paso anterior.', porQue: 'Se despeja por diferencia.', interpretar: 'El manganeso está en su estado de oxidación más alto (+7): el KMnO₄ es un oxidante fuerte.' }
      ],
      resultado: { texto: 'Mn: +7' },
      errorTipico: 'Olvidar multiplicar el −2 del oxígeno por los 4 átomos de oxígeno.',
      revision: 'Sustituye: +1 + 7 − 8 = 0. Si no suma cero, hay un error.'
    },
    comprobacion: {
      pregunta: '¿Qué número de oxidación tiene el oxígeno en el peróxido de hidrógeno, H₂O₂?',
      opciones: [
        { id: 'a', texto: '−2, como siempre.' },
        { id: 'b', texto: '−1: con H = +1, la suma 2 · (+1) + 2x = 0 da x = −1.' },
        { id: 'c', texto: '0, porque hay enlace O–O.' }
      ],
      correcta: 'b',
      explicacion: 'El −2 del oxígeno es una regla general con excepción en los peróxidos. Con H = +1 y la suma cero, cada oxígeno vale −1.'
    },
    porNivel: {
      preuniversitario: 'Asigna números de oxidación en compuestos binarios y oxoácidos sencillos.',
      universitario: 'Resuelve iones poliatómicos y casos especiales (peróxidos, hidruros).',
      quimico: 'Distingue número de oxidación de carga formal y de carga real, y justifica los valores fraccionarios.'
    },
    prerrequisitos: ['formular-nombrar'],
    observar: { texto: 'Compara el número de oxidación con la polaridad de los enlaces en la Mesa (pestaña «Enlaces»).' },
    fuentes: [rengFuenteOpenStax('secciones 4.2 «Classifying Chemical Reactions» y 17.1 «Review of Redox Chemistry»')],
    recorrido: false
  },
  {
    tema: 'enlace',
    objetivo: 'Clasificar un enlace como iónico, covalente polar o covalente poco polar con la diferencia de electronegatividad y justificar que es un continuo.',
    conceptos: [
      'La electronegatividad mide la tendencia de un átomo a atraer los electrones de un enlace. La diferencia entre los dos átomos (ΔEN, escala de Pauling) indica cuánto se desplazan los electrones hacia uno de ellos.',
      'Como regla orientativa: ΔEN pequeña (< 0,4) → covalente poco polar; intermedia (0,4–1,7) → covalente polar; grande (> 1,7) → predominio iónico. Los límites son convenciones: no hay un salto brusco, sino un continuo.',
      'El tipo de enlace explica propiedades (puntos de fusión, conductividad), pero la clasificación depende del modelo: un compuesto con enlaces polares puede ser apolar si la geometría anula los dipolos.'
    ],
    ejemplo: {
      titulo: 'HCl frente a NaCl',
      enunciado: 'Clasifica el enlace en HCl y en NaCl con la electronegatividad de Pauling: H 2,20 · Na 0,93 · Cl 3,16.',
      datos: [
        { etiqueta: 'Electronegatividades', valor: 'H 2,20 · Na 0,93 · Cl 3,16' },
        { etiqueta: 'Criterio orientativo', valor: '< 0,4 poco polar; 0,4–1,7 polar; > 1,7 predominio iónico' }
      ],
      pasos: [
        { accion: 'HCl: ΔEN = 3,16 − 2,20 = 0,96.', dato: 'Las electronegatividades de H y Cl.', porQue: 'La diferencia mide el desplazamiento de los electrones del enlace.', interpretar: 'Cae en el tramo intermedio.' },
        { accion: 'NaCl: ΔEN = 3,16 − 0,93 = 2,23.', dato: 'Las electronegatividades de Na y Cl.', porQue: 'Mismo cálculo para el otro compuesto.', interpretar: 'Supera con holgura 1,7: predomina el carácter iónico.' },
        { accion: 'Concluir: HCl es covalente polar (el Cl atrae más los electrones); NaCl es iónico.', dato: 'Los dos valores de ΔEN.', porQue: 'Cada resultado se compara con el criterio, sabiendo que es una convención.', interpretar: 'Aun así, el enlace de NaCl no es 100 % iónico: la clasificación es una aproximación.' }
      ],
      resultado: { texto: 'HCl: covalente polar (ΔEN 0,96); NaCl: predominio iónico (ΔEN 2,23)' },
      errorTipico: 'Concluir que un enlace es iónico solo porque participa un metal, sin calcular la diferencia.',
      revision: 'Comprueba que restas la menor de la mayor (ΔEN no es negativa) y que usas la misma escala para ambos elementos.'
    },
    comprobacion: {
      pregunta: 'El CO₂ tiene enlaces C=O polares y, sin embargo, la molécula es apolar. ¿Por qué?',
      opciones: [
        { id: 'a', texto: 'Porque la molécula es lineal y los dos dipolos se cancelan.' },
        { id: 'b', texto: 'Porque el carbono y el oxígeno tienen la misma electronegatividad.' },
        { id: 'c', texto: 'Porque los enlaces dobles no son polares.' }
      ],
      correcta: 'a',
      explicacion: 'Cada enlace C=O es polar (el oxígeno atrae más los electrones), pero en una geometría lineal los dos dipolos tienen igual módulo y sentidos opuestos: la polaridad de la molécula depende también de la forma.'
    },
    porNivel: {
      preuniversitario: 'Clasifica enlaces con ΔEN y nombra qué átomo atrae más los electrones.',
      universitario: 'Calcula el carácter iónico aproximado y relaciona la clasificación con propiedades.',
      quimico: 'Justifica la clasificación como modelo (continuo) y combina polaridad de enlace con geometría.'
    },
    prerrequisitos: [],
    observar: { texto: 'En la Mesa, pestaña «Enlaces», compara el enlace en H₂O y en NaCl paso a paso.', mesaSmiles: 'O' },
    fuentes: [rengFuenteOpenStax('secciones 7.1 «Ionic Bonding», 7.2 «Covalent Bonding» y 7.6 «Molecular Structure and Polarity»')],
    recorrido: false
  },
  {
    tema: 'redox',
    objetivo: 'Identificar qué especie se oxida y cuál se reduce y ajustar la ecuación con el método ion-electrón.',
    conceptos: [
      'Oxidarse es perder electrones (aumenta el número de oxidación); reducirse es ganarlos. Ambos procesos ocurren a la vez: los electrones que pierde el reductor los gana el oxidante.',
      'El método ion-electrón separa dos semirreacciones, las ajusta por separado (átomos distintos de O y H, luego O con H₂O, H con H⁺ y la carga con electrones) y las suma tras igualar los electrones intercambiados.',
      'En medio básico se ajusta primero como si fuese ácido y luego se añaden OH⁻ a ambos lados para neutralizar los H⁺. En cualquier caso hay que comprobar que se conservan los átomos y la carga.'
    ],
    ejemplo: {
      titulo: 'Permanganato con hierro(II) en medio ácido',
      enunciado: 'Ajusta, en medio ácido: MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺',
      datos: [{ etiqueta: 'Medio', valor: 'Ácido (H⁺ y H₂O disponibles)' }],
      pasos: [
        { accion: 'Identificar: Mn pasa de +7 a +2 (se reduce); Fe pasa de +2 a +3 (se oxida).', dato: 'Los números de oxidación de Mn y Fe.', porQue: 'Separa qué semirreacción gana y cuál pierde electrones.', interpretar: 'El MnO₄⁻ es el oxidante y el Fe²⁺ el reductor.' },
        { accion: 'Semirreacción de reducción: MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O.', dato: 'Los 4 O del permanganato.', porQue: 'Los O se igualan con H₂O (4), los H con H⁺ (8) y la carga (−1 + 8 = +7 → +2) con 5 e⁻.', interpretar: 'Se ganan 5 electrones por cada MnO₄⁻.' },
        { accion: 'Semirreacción de oxidación: Fe²⁺ → Fe³⁺ + e⁻.', dato: 'El cambio de carga de +2 a +3.', porQue: 'Se pierde un electrón por cada ion de hierro.', interpretar: 'Para igualar los 5 e⁻ se necesitan 5 Fe²⁺.' },
        { accion: 'Sumar (×1 y ×5): MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O.', dato: 'Los electrones: 5 ganados = 5 perdidos.', porQue: 'Los electrones se cancelan y queda la ecuación iónica neta.', interpretar: 'Carga: −1 + 10 + 8 = +17 a la izquierda; +2 + 15 = +17 a la derecha.' }
      ],
      resultado: { texto: 'MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O' },
      errorTipico: 'Ajustar solo los átomos y olvidar la carga: la ecuación quedaría con los átomos bien pero con carga distinta a cada lado.',
      revision: 'Cuenta los átomos de cada elemento y suma las cargas a ambos lados (+17 y +17).'
    },
    comprobacion: {
      pregunta: 'En Zn + Cu²⁺ → Zn²⁺ + Cu, ¿quién es el agente reductor?',
      opciones: [
        { id: 'a', texto: 'El Zn, porque cede electrones y se oxida.' },
        { id: 'b', texto: 'El Cu²⁺, porque se reduce.' },
        { id: 'c', texto: 'Ninguno: no hay cambio de carga.' }
      ],
      correcta: 'a',
      explicacion: 'El agente reductor es la especie que se oxida (cede electrones): Zn → Zn²⁺ + 2 e⁻. El Cu²⁺ es el agente oxidante porque se reduce.'
    },
    porNivel: {
      preuniversitario: 'Identifica oxidación y reducción y ajusta semirreacciones sencillas.',
      universitario: 'Ajusta por ion-electrón en medio ácido y básico.',
      quimico: 'Elige el medio, comprueba la carga y relaciona el resultado con potenciales de electrodo.'
    },
    prerrequisitos: ['oxidacion', 'ajuste'],
    observar: { texto: 'En la Mesa, pestaña «Reacciones», introduce la ecuación iónica y comprueba el balance de carga.' },
    fuentes: [rengFuenteOpenStax('sección 17.1 «Review of Redox Chemistry»')],
    recorrido: false
  }
]
