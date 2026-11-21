import { rengLeccionN1 } from '../constructor'
import { rengPreg } from '../gases/libro-comun'
import { RENG_PROCEDENCIA_MASAS, RENG_PROCEDENCIA_R } from '../procedencia'
import type { RengLeccionN1 } from '../tipos'
import { RENG_G7 } from './glosario'
import { RENG_ESCENA_LIMITANTE_LIMITE, rengSeccionEsteq } from './lecciones-a'

const RENG_S43 = '4.3 Reaction Stoichiometry'
const RENG_S44 = '4.4 Reaction Yields'
const RENG_S45 = '4.5 Quantitative Chemical Analysis'
const RENG_LIMITE_GAS = 'La escena calcula un gas ideal en equilibrio: no muestra la reacción, ni mezclas, ni el comportamiento de un gas real a presión alta.'

export const RENG_LECCIONES_ESTEQ_B: readonly RengLeccionN1[] = [
  rengLeccionN1({
    id: 'est-volumen-volumen',
    subtema: 'n1-b7-s12',
    nombre: 'Relaciones volumen-volumen',
    pregunta: '¿Se pueden usar volúmenes en lugar de moles cuando reaccionan gases?',
    objetivo: 'Calcular volúmenes de gases que reaccionan o se forman, medidos en las mismas condiciones, con los coeficientes de la ecuación.',
    objetivosMas: ['Justificar con la ley de Avogadro por qué los volúmenes siguen a los coeficientes.'],
    porQueImporta: 'En un quemador de gas o en una planta química los gases se dosifican por volumen, con caudalímetros. Si todos se miden a la misma presión y temperatura, los cálculos se simplifican mucho: los litros se comportan como moles y no hace falta ninguna masa molar.',
    idea: 'Según la ley de Avogadro, a igual presión y temperatura el volumen de un gas es proporcional a sus moles. Por eso, si todos los gases de una reacción se miden en las mismas condiciones, sus volúmenes guardan la misma proporción que los coeficientes. En CH₄ + 2 O₂ → CO₂ + 2 H₂O(g), 1 L de metano consume 2 L de oxígeno. Las sustancias que no son gases (líquidos, sólidos) no siguen esta regla.',
    imagen: 'Gay-Lussac observó que 2 volúmenes de hidrógeno se combinan con 1 de oxígeno: la proporción sencilla que hoy se explica con moléculas.',
    analogia: 'A igual P y T, cada mol de gas ocupa una «plaza» del mismo tamaño en un aparcamiento: contar plazas ocupadas es contar coches, sean grandes o pequeños.',
    analogiaLimite: 'Los coches de verdad sí ocupan espacio según su tamaño; en el gas ideal el volumen de las moléculas no cuenta. Y la regla deja de valer si los gases se miden en condiciones distintas o si un producto es líquido.',
    errores: [
      ['Aplicar la proporción de volúmenes a una sustancia líquida o sólida, como el agua condensada.', 'Solo los gases medidos a la misma P y T siguen los coeficientes en volumen; un líquido ocupa muchísimo menos.'],
      ['Comparar volúmenes medidos a temperaturas o presiones distintas.', 'Antes hay que llevar todos los volúmenes a las mismas condiciones (ley combinada) o pasar a moles.']
    ],
    ecs: [
      ['Volúmenes de combinación', 'V_B / V_A = ν_B / ν_A', 'A igual P y T, como los moles.', String.raw`\frac{V_B}{V_A} = \frac{\nu_B}{\nu_A}`],
      ['Ley de Avogadro', 'V = n · V_m', 'A P y T fijas, el volumen es proporcional a n.', String.raw`V = n \cdot V_m`]
    ],
    vars: [['V', 'volumen de gas', 'L'], ['V_m', 'volumen molar en las condiciones de medida', 'L/mol'], ['ν', 'coeficiente', 'sin unidad']],
    supuestos: ['Todos los gases se miden a la misma presión y temperatura.', 'Comportamiento de gas ideal.'],
    limites: 'Vale para gases ideales; a presión alta los gases reales se apartan y la proporción de volúmenes deja de ser exacta.',
    ejemplos: ['ej-est-volumen-volumen', 'ej-est-volumen-volumen-2'],
    figuras: ['fig-est-proporcion'],
    resumen: ['A igual P y T, los volúmenes de gas son proporcionales a los moles.', 'Por eso siguen a los coeficientes de la ecuación.', 'No hace falta ninguna masa molar.', 'Los líquidos y sólidos no siguen esta regla.'],
    glosario: [RENG_G7.volumenesCombinacion, RENG_G7.volumenMolar],
    comprobar: [
      rengPreg('En N₂ + 3 H₂ → 2 NH₃ con todo medido igual, ¿cuántos litros de NH₃ se forman con 3 L de N₂ y H₂ suficiente?', ['6 L', true, 'Correcto: la razón N₂ : NH₃ es 1 : 2 también en volumen.'], ['3 L', false, 'Ese resultado olvida el coeficiente 2 del amoníaco.'], ['9 L', false, 'Ese es el volumen de H₂ que se consume, no el de NH₃ que se forma.']),
      rengPreg('¿Qué condición hace falta para que los volúmenes sigan a los coeficientes?', ['Que todos los gases se midan a la misma P y T', true, 'Correcto: solo así el volumen es proporcional a los moles con la misma constante.'], ['Que los gases tengan la misma masa molar', false, 'La masa molar no interviene: un mol de cualquier gas ideal ocupa lo mismo.'], ['Que la reacción sea rápida', false, 'La rapidez no afecta a la proporción entre volúmenes.']),
      rengPreg('En 2 H₂ + O₂ → 2 H₂O, si el agua se condensa, ¿se forman 2 L de agua líquida por cada 2 L de H₂?', ['No: el agua líquida ocupa muchísimo menos', true, 'Correcto: la proporción de volúmenes solo vale para gases.'], ['Sí, porque los coeficientes son iguales', false, 'Los coeficientes iguales dan los mismos moles, pero un mol de líquido ocupa unos 18 mL, no litros.'], ['Sí, si la temperatura no cambia', false, 'Aunque no cambie la temperatura, el agua líquida no se comporta como un gas.'])
    ],
    anterior: 'n1-b7-s11',
    siguiente: 'n1-b7-s13',
    prerrequisitos: ['n1-b7-s9', 'n1-b8-s7'],
    escena: { id: 'gas-ideal', valores: { n: 1, T: 300, V: 24.5, M: 28 }, instruccion: 'Mueve la cantidad n y observa «Volumen que ocuparía a 1 atm»: es proporcional a n, por eso a igual P y T los litros se comportan como moles.', limite: RENG_LIMITE_GAS },
    fuentes: [rengSeccionEsteq(RENG_S43, 'las relaciones de volúmenes entre gases'), RENG_PROCEDENCIA_R],
    idealizado: 'Gases ideales medidos en las mismas condiciones.',
    metodo: 'moles a 25 °C y 1 atm y vuelta a volumen'
  }),
  rengLeccionN1({
    id: 'est-limitante',
    subtema: 'n1-b7-s13',
    nombre: 'Reactivo limitante',
    pregunta: '¿Qué reactivo decide cuánto producto se puede obtener?',
    objetivo: 'Identificar el reactivo limitante comparando los cocientes moles/coeficiente y calcular el producto máximo.',
    objetivosMas: ['Explicar por qué el limitante no es necesariamente el reactivo del que hay menos masa.'],
    porQueImporta: 'En casi ninguna reacción real los reactivos están en la proporción exacta. Saber cuál se agota primero permite calcular cuánto producto se obtendrá y decidir qué reactivo conviene poner en exceso, por ser más barato o más fácil de separar.',
    idea: 'Cuando se mezclan reactivos en una proporción distinta de la estequiométrica, uno se agota antes: es el reactivo limitante, y fija cuánto producto se forma. Para encontrarlo se divide los moles de cada reactivo entre su coeficiente; el menor cociente corresponde al limitante y es el avance máximo ξ de la reacción. Los productos se calculan con ese avance: n_P = ν_P · ξ. Comparar masas directamente lleva a error.',
    imagen: 'Con 10 panes y 6 lonchas de queso se pueden hacer 5 bocadillos de dos panes y una loncha: el pan limita aunque haya más panes que lonchas.',
    analogia: 'El limitante es como el ingrediente que se acaba primero en una receta: aunque sobre de todo lo demás, no se puede preparar ni una ración más.',
    analogiaLimite: 'En la cocina se puede improvisar con otro ingrediente; en una reacción no: sin limitante no hay más producto. Además, en la cocina se comparan unidades, y aquí hay que comparar moles divididos entre coeficientes.',
    errores: [
      ['Elegir como limitante el reactivo del que hay menos gramos.', 'Hay que comparar moles divididos entre su coeficiente; un reactivo puede tener menos masa y estar en exceso.'],
      ['Comparar moles sin dividir entre los coeficientes.', 'Si la ecuación pide 3 mol de B por cada mol de A, hay que comparar n_A/1 con n_B/3.']
    ],
    ecs: [
      ['Avance máximo', 'ξ = mín(n₁/ν₁, n₂/ν₂)', 'El menor cociente marca el limitante.', String.raw`\xi = \min\left(\frac{n_1}{\nu_1}, \frac{n_2}{\nu_2}\right)`],
      ['Producto máximo', 'n_P = ν_P · ξ', 'Los productos se calculan con el avance del limitante.', String.raw`n_{\mathrm{P}} = \nu_{\mathrm{P}} \cdot \xi`]
    ],
    vars: [['ξ', 'avance máximo de la reacción', 'mol'], ['n₁, n₂', 'moles iniciales de los reactivos', 'mol'], ['ν', 'coeficientes', 'sin unidad']],
    supuestos: ['La reacción avanza hasta agotar el limitante.', 'No hay reacciones secundarias.'],
    limites: 'Si la reacción llega a un equilibrio (bloque 10), no se agota por completo ningún reactivo; el cálculo da el máximo posible.',
    ejemplos: ['ej-est-limitante', 'ej-est-limitante-2'],
    figuras: ['fig-est-limitante'],
    resumen: ['El reactivo limitante se agota primero y fija el producto máximo.', 'Se identifica con el menor cociente moles/coeficiente.', 'Ese cociente es el avance máximo ξ.', 'Los productos se calculan con ξ, nunca con el reactivo en exceso.'],
    glosario: [RENG_G7.limitante, RENG_G7.avance],
    comprobar: [
      rengPreg('En N₂ + 3 H₂ → 2 NH₃ se mezclan 2 mol de N₂ y 3 mol de H₂. ¿Cuál es el limitante?', ['El H₂', true, 'Correcto: 3/3 = 1 frente a 2/1 = 2; el menor cociente es el del hidrógeno.'], ['El N₂, porque hay menos moles', false, 'Hay menos moles de N₂, pero la ecuación pide tres veces más H₂.'], ['Ninguno: están en proporción exacta', false, 'La proporción exacta sería 1 : 3; con 2 mol de N₂ harían falta 6 de H₂.']),
      rengPreg('En el caso anterior, ¿cuántos moles de NH₃ se forman como máximo?', ['2 mol', true, 'Correcto: ξ = 1 mol y n(NH₃) = 2·ξ.'], ['4 mol', false, 'Ese resultado usa el nitrógeno, que no es el limitante.'], ['6 mol', false, 'Ese resultado no tiene en cuenta que el hidrógeno se agota.']),
      rengPreg('Se tienen 10 g de hierro y 8 g de azufre (Fe + S → FeS). ¿Por qué el hierro puede ser el limitante si hay más gramos de él?', ['Porque cada átomo de hierro pesa más y hay menos moles', true, 'Correcto: 10 g de Fe son unos 0,18 mol y 8 g de S unos 0,25 mol.'], ['Porque el hierro reacciona más despacio', false, 'La velocidad no decide qué reactivo se agota; lo deciden los moles disponibles.'], ['No puede: el limitante es siempre el de menos gramos', false, 'Comparar gramos es el error típico: hay que comparar moles.'])
    ],
    anterior: 'n1-b7-s12',
    siguiente: 'n1-b7-s14',
    prerrequisitos: ['n1-b7-s10'],
    escena: { id: 'reactivo-limitante', valores: { r: 1, n1: 2, n2: 3, rend: 100 }, instruccion: 'Con 2 mol de N₂ y 3 de H₂, la escena indica que el limitante es el 2 (H₂). Sube el H₂ en la gráfica y mira dónde el producto deja de crecer: ahí pasa a limitar el N₂.', limite: RENG_ESCENA_LIMITANTE_LIMITE },
    fuentes: [rengSeccionEsteq(RENG_S44, 'el reactivo limitante'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Reacción completa hasta agotar el limitante.',
    metodo: 'función del núcleo para el reactivo limitante'
  }),
  rengLeccionN1({
    id: 'est-exceso',
    subtema: 'n1-b7-s14',
    nombre: 'Reactivo en exceso',
    pregunta: '¿Cuánto sobra del reactivo que no se agota?',
    objetivo: 'Calcular la cantidad que queda sin reaccionar del reactivo en exceso.',
    objetivosMas: ['Comprobar el resultado con la conservación de la masa.'],
    porQueImporta: 'En la industria se pone a propósito un reactivo en exceso, el más barato, para aprovechar del todo el más caro. Saber cuánto sobra permite recuperarlo, evitar residuos y calcular el coste real del proceso.',
    idea: 'Una vez identificado el limitante, el avance ξ dice cuánto se consume de cada reactivo: ν·ξ. Lo que queda del reactivo en exceso es su cantidad inicial menos lo consumido. Se puede comprobar con la conservación de la masa: la masa inicial total es igual a la masa de productos más la del exceso que sobra.',
    imagen: 'En una combustión con aire en exceso, el oxígeno que sobra sale con los gases de escape.',
    analogia: 'Es como pagar con un billete grande: lo que se gasta lo fija el precio (el limitante) y lo que sobra es el cambio.',
    analogiaLimite: 'El cambio se devuelve siempre; el reactivo en exceso queda mezclado con los productos y a veces hay que separarlo, lo que cuesta trabajo y dinero.',
    errores: [
      ['Restar las masas iniciales de los dos reactivos para saber lo que sobra.', 'Lo que sobra es la cantidad inicial del exceso menos lo que consume el limitante según la razón molar.'],
      ['Calcular lo consumido del exceso con la razón molar invertida.', 'Consumido del exceso = (moles del limitante) × ν_exceso / ν_limitante.']
    ],
    ecs: [
      ['Exceso que sobra', 'n_sobra = n_inicial − ν_exceso · ξ', 'Cantidad inicial menos lo que consume el avance.', String.raw`n_{\mathrm{sobra}} = n_{\mathrm{inicial}} - \nu_{\mathrm{exceso}} \cdot \xi`],
      ['Balance de masa', 'm_total = m_productos + m_sobra', 'Comprobación con la conservación.', String.raw`m_{\mathrm{total}} = m_{\mathrm{productos}} + m_{\mathrm{sobra}}`]
    ],
    vars: [['n_sobra', 'moles que sobran del reactivo en exceso', 'mol'], ['ξ', 'avance máximo', 'mol']],
    supuestos: ['Reacción completa hasta agotar el limitante.'],
    limites: 'Supone que el exceso no reacciona de otra forma; en la realidad puede dar reacciones secundarias.',
    ejemplos: ['ej-est-exceso', 'ej-est-exceso-2'],
    figuras: ['fig-est-limitante'],
    resumen: ['El reactivo en exceso no se agota.', 'Sobra n_inicial − ν·ξ.', 'La masa total se conserva: productos más exceso.', 'Poner en exceso el reactivo barato aprovecha el caro.'],
    glosario: [RENG_G7.exceso, RENG_G7.limitante],
    comprobar: [
      rengPreg('En 2 H₂ + O₂ → 2 H₂O, con 5 mol de H₂ y 2 mol de O₂, ¿cuánto H₂ sobra?', ['1 mol', true, 'Correcto: el O₂ limita (ξ = 2) y consume 4 mol de H₂; sobra 1.'], ['3 mol', false, 'Ese resultado resta 5 − 2, como si la razón fuera 1 : 1.'], ['0 mol', false, 'Con 5 mol de H₂ y solo 2 de O₂, el hidrógeno no se agota.']),
      rengPreg('¿Por qué en la industria se pone en exceso el reactivo más barato?', ['Para aprovechar al máximo el reactivo caro', true, 'Correcto: así el caro es el limitante y se consume casi por completo.'], ['Para que la reacción tenga más rendimiento teórico', false, 'El rendimiento teórico lo fija el limitante; el exceso no lo aumenta.'], ['Porque el exceso se convierte en más producto', false, 'Lo que sobra del exceso no se convierte en producto: queda sin reaccionar.']),
      rengPreg('¿Qué comprobación sirve para un cálculo de exceso?', ['La masa inicial total igual a productos más lo que sobra', true, 'Correcto: es la conservación de la masa.'], ['Que lo que sobra sea menor que la mitad', false, 'Lo que sobra puede ser cualquier cantidad; no hay tal regla.'], ['Que los moles finales sean iguales a los iniciales', false, 'Los moles totales pueden cambiar en una reacción; lo que se conserva es la masa.'])
    ],
    anterior: 'n1-b7-s13',
    siguiente: 'n1-b7-s15',
    prerrequisitos: ['n1-b7-s13'],
    escena: { id: 'reactivo-limitante', valores: { r: 0, n1: 5, n2: 2, rend: 100 }, instruccion: 'Con 5 mol de H₂ y 2 de O₂, lee «Reactivo en exceso que sobra»: 1 mol de hidrógeno. Cambia las cantidades y observa cuándo sobra el otro reactivo.', limite: RENG_ESCENA_LIMITANTE_LIMITE },
    fuentes: [rengSeccionEsteq(RENG_S44, 'el reactivo en exceso'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Reacción completa hasta agotar el limitante.',
    metodo: 'conservación de la masa total'
  }),
  rengLeccionN1({
    id: 'est-rendimiento-teorico',
    subtema: 'n1-b7-s15',
    nombre: 'Rendimiento teórico',
    pregunta: '¿Cuál es la máxima cantidad de producto que se puede obtener?',
    objetivo: 'Calcular el rendimiento teórico de un producto a partir del reactivo limitante.',
    objetivosMas: ['Relacionar el rendimiento teórico con la composición del reactivo cuando todo un elemento pasa al producto.'],
    porQueImporta: 'Antes de un experimento o de un proceso industrial hay que saber cuánto producto se puede esperar como máximo. Ese valor, el rendimiento teórico, sirve de referencia para juzgar si el proceso funciona bien y para planificar compras y costes.',
    idea: 'El rendimiento teórico es la cantidad de producto que se obtendría si todo el reactivo limitante reaccionara según la ecuación, sin pérdidas ni reacciones secundarias. Se calcula con el camino estequiométrico a partir del limitante. Es un máximo: ningún proceso real lo supera. Si todo un elemento del reactivo acaba en el producto, también se puede calcular con la fracción en masa de ese elemento.',
    imagen: 'Un alto horno no obtiene todo el hierro que contiene el mineral: el rendimiento teórico es lo que daría si lo aprovechara entero.',
    analogia: 'El rendimiento teórico es como la capacidad máxima de una fábrica: se calcula con los planos, aunque en la práctica nunca se alcance del todo.',
    analogiaLimite: 'Una fábrica puede ampliarse; el rendimiento teórico no: lo limita la cantidad de reactivo limitante y la ecuación química.',
    errores: [
      ['Calcular el rendimiento teórico con el reactivo en exceso.', 'Hay que usar el limitante; con el exceso saldría más producto del posible.'],
      ['Pensar que el rendimiento teórico es lo que se obtiene en el laboratorio.', 'Es un máximo calculado; lo que se obtiene es el rendimiento real, normalmente menor.']
    ],
    ecs: [
      ['Rendimiento teórico', 'm_teórica = n_lim · (ν_P / ν_lim) · M_P', 'Producto calculado desde el limitante.', String.raw`m_{\mathrm{te\acute{o}rica}} = n_{\mathrm{lim}} \cdot \frac{\nu_{\mathrm{P}}}{\nu_{\mathrm{lim}}} \cdot M_{\mathrm{P}}`],
      ['Por fracción en masa', 'm_teórica = m_reactivo · (masa del elemento en el reactivo / masa del reactivo)', 'Cuando todo un elemento pasa al producto (por ejemplo, el hierro del óxido).', String.raw`m_{\mathrm{te\acute{o}rica}} = m_{\mathrm{reactivo}} \cdot w_X`]
    ],
    vars: [['m_teórica', 'rendimiento teórico', 'g'], ['n_lim', 'moles del limitante', 'mol'], ['w_X', 'fracción en masa del elemento', 'sin unidad']],
    supuestos: ['Reacción completa del limitante, sin pérdidas.'],
    limites: 'Es un límite superior: ignora pérdidas, equilibrios y reacciones secundarias.',
    ejemplos: ['ej-est-rendimiento-teorico', 'ej-est-rendimiento-teorico-2'],
    figuras: ['fig-est-rendimiento'],
    resumen: ['El rendimiento teórico es el producto máximo posible.', 'Se calcula desde el reactivo limitante.', 'Ningún proceso real lo supera.', 'Si todo un elemento pasa al producto, basta su fracción en masa.'],
    glosario: [RENG_G7.teorico, RENG_G7.limitante],
    comprobar: [
      rengPreg('¿Con qué reactivo se calcula el rendimiento teórico?', ['Con el limitante', true, 'Correcto: es el que fija cuánto producto puede formarse.'], ['Con el que hay más masa', false, 'La masa no decide; el que esté en exceso daría un producto imposible de alcanzar.'], ['Con cualquiera, da lo mismo', false, 'Solo da lo mismo si los reactivos están en proporción exacta.']),
      rengPreg('Se obtiene más producto que el rendimiento teórico. ¿Qué indica?', ['Un error: producto húmedo, impuro o un cálculo mal hecho', true, 'Correcto: el teórico es el máximo posible.'], ['Que la reacción fue muy eficiente', false, 'Ninguna eficiencia permite superar el máximo que fija la estequiometría.'], ['Que se creó masa', false, 'En una reacción química la masa se conserva.']),
      rengPreg('Todo el hierro del Fe₂O₃ pasa a hierro metálico. ¿Qué basta para el rendimiento teórico?', ['La masa de óxido y la fracción en masa de hierro', true, 'Correcto: el hierro que contiene el óxido es el hierro máximo que puede obtenerse.'], ['La masa de CO usada', false, 'El CO suele estar en exceso; no limita el hierro obtenido.'], ['El volumen del horno', false, 'El volumen del horno no interviene en la estequiometría.'])
    ],
    anterior: 'n1-b7-s14',
    siguiente: 'n1-b7-s16',
    prerrequisitos: ['n1-b7-s13'],
    escena: { id: 'reactivo-limitante', valores: { r: 3, n1: 1, n2: 4, rend: 100 }, instruccion: 'Con la combustión del propano, mira la «Masa teórica del primer producto» (CO₂) y cómo la fija el reactivo limitante al cambiar las cantidades.', limite: RENG_ESCENA_LIMITANTE_LIMITE },
    fuentes: [rengSeccionEsteq(RENG_S44, 'el rendimiento teórico'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Reacción completa sin pérdidas.',
    metodo: 'fracción en masa del elemento que pasa al producto'
  }),
  rengLeccionN1({
    id: 'est-rendimiento-real',
    subtema: 'n1-b7-s16',
    nombre: 'Rendimiento real',
    pregunta: '¿Cuánto producto se obtiene de verdad?',
    objetivo: 'Calcular la cantidad de producto que se obtiene conociendo el rendimiento teórico y el rendimiento porcentual.',
    objetivosMas: ['Calcular cuánto reactivo hace falta para obtener una cantidad deseada de producto con un rendimiento dado.'],
    porQueImporta: 'Una empresa que necesita 500 kg de un producto no puede comprar solo el reactivo que da 500 kg teóricos: debe contar con las pérdidas. El rendimiento real, y su relación con el teórico, es lo que permite planificar la producción y calcular costes de verdad.',
    idea: 'El rendimiento real es la cantidad de producto que realmente se obtiene y se mide: siempre es menor o igual que el teórico, por reacciones incompletas, pérdidas al separar o purificar, o reacciones secundarias. Si se conoce el rendimiento porcentual R, el real es el teórico por R/100. Para planificar se razona al revés: el teórico necesario es el real deseado dividido entre R/100.',
    imagen: 'Al filtrar y secar un precipitado siempre queda algo en el papel de filtro y en las paredes del vaso.',
    analogia: 'El rendimiento real es lo que llega a casa de la compra después de que se rompan algunos huevos por el camino.',
    analogiaLimite: 'Los huevos rotos se ven; en química las pérdidas pueden estar en disolución, en el aire o en productos secundarios que no se ven.',
    errores: [
      ['Dividir entre el rendimiento cuando se busca el real a partir del teórico.', 'Real = teórico × R/100; se divide entre R/100 solo al buscar el teórico necesario.'],
      ['Aplicar el rendimiento dos veces, al reactivo y al producto.', 'El rendimiento porcentual se aplica una sola vez en el cálculo.']
    ],
    ecs: [
      ['Rendimiento real', 'm_real = m_teórica · R / 100', 'El rendimiento porcentual escala el teórico.', String.raw`m_{\mathrm{real}} = m_{\mathrm{te\acute{o}rica}} \cdot \frac{R}{100}`],
      ['Teórico necesario', 'm_teórica = m_deseada / (R / 100)', 'Para planificar una producción.', String.raw`m_{\mathrm{te\acute{o}rica}} = \frac{m_{\mathrm{deseada}}}{R/100}`]
    ],
    vars: [['m_real', 'rendimiento real', 'g'], ['R', 'rendimiento porcentual', '%']],
    supuestos: ['El rendimiento porcentual se conoce (por experiencia previa o dato).'],
    limites: 'El rendimiento porcentual resume muchas causas distintas en un solo número; puede cambiar con las condiciones del proceso.',
    ejemplos: ['ej-est-rendimiento-real', 'ej-est-rendimiento-real-2'],
    figuras: ['fig-est-rendimiento'],
    resumen: ['El rendimiento real es lo que se obtiene y se mide.', 'Siempre es menor o igual que el teórico.', 'Real = teórico × R/100.', 'Para planificar: teórico necesario = real deseado / (R/100).'],
    glosario: [RENG_G7.real, RENG_G7.teorico],
    comprobar: [
      rengPreg('El rendimiento teórico es 50 g y el porcentual 80 %. ¿Cuál es el real?', ['40 g', true, 'Correcto: real = teórico × R/100 = 50 × 0,80.'], ['62,5 g', false, 'Ese resultado divide entre 0,80; daría más que el teórico, lo que es imposible.'], ['30 g', false, 'Ese resultado resta 20 g en lugar de aplicar el 80 %.']),
      rengPreg('Para obtener 100 g de producto con un rendimiento del 50 %, ¿qué rendimiento teórico hace falta?', ['200 g', true, 'Correcto: con la mitad de aprovechamiento hay que partir de un teórico del doble.'], ['50 g', false, 'Ese es el real que se obtendría de un teórico de 100 g, no lo que se pide.'], ['150 g', false, 'Ese resultado suma el 50 % en lugar de dividir entre 0,50.']),
      rengPreg('¿Cuál de estas NO es una causa típica de un rendimiento real menor que el teórico?', ['Que la masa se destruya en la reacción', true, 'Correcto: la masa se conserva; las pérdidas son de producto que no se recoge o que no se forma.'], ['Pérdidas al filtrar y secar', false, 'Sí es una causa típica: parte del producto queda en el material.'], ['Reacciones secundarias', false, 'Sí es una causa típica: parte del reactivo forma otros productos.'])
    ],
    anterior: 'n1-b7-s15',
    siguiente: 'n1-b7-s17',
    prerrequisitos: ['n1-b7-s15'],
    escena: { id: 'reactivo-limitante', valores: { r: 1, n1: 2, n2: 6, rend: 80 }, instruccion: 'Con el rendimiento al 80 %, compara la masa teórica del amoníaco con la «Masa obtenida con ese rendimiento». Mueve el rendimiento y comprueba la proporción.', limite: RENG_ESCENA_LIMITANTE_LIMITE },
    fuentes: [rengSeccionEsteq(RENG_S44, 'el rendimiento real'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Rendimiento porcentual conocido y constante.',
    metodo: 'rendimiento aplicado al principio del cálculo'
  }),
  rengLeccionN1({
    id: 'est-rendimiento-porcentual',
    subtema: 'n1-b7-s17',
    nombre: 'Rendimiento porcentual',
    pregunta: '¿Qué tan eficiente fue una reacción?',
    objetivo: 'Calcular el rendimiento porcentual de una reacción a partir del rendimiento real y del teórico.',
    objetivosMas: ['Interpretar un rendimiento porcentual anómalo (mayor que 100 % o muy bajo).'],
    porQueImporta: 'El rendimiento porcentual es la nota de un proceso químico: permite comparar métodos, detectar problemas y decidir si una síntesis es rentable. En la industria farmacéutica, una mejora de unos pocos puntos puede ahorrar toneladas de materia prima.',
    idea: 'El rendimiento porcentual compara lo obtenido con lo máximo posible: R = (real/teórico) × 100. Ambos deben estar en la misma unidad (gramos o moles del mismo producto). Un valor por encima del 100 % es una señal de error: producto húmedo o impuro, o un cálculo mal hecho. Un valor muy bajo indica pérdidas o reacciones secundarias importantes.',
    imagen: 'Una síntesis escolar con un 80 % de rendimiento es buena; con más del 100 %, el producto no estaba bien seco.',
    analogia: 'El rendimiento porcentual es como el porcentaje de aciertos de un examen: lo conseguido entre lo máximo posible.',
    analogiaLimite: 'En un examen el máximo está fijado de antemano por quien lo pone; en química el máximo se calcula con la estequiometría y depende de qué reactivo limita.',
    errores: [
      ['Dividir el teórico entre el real.', 'R = real / teórico × 100: el real va arriba, y por eso R no supera el 100 % en un experimento correcto.'],
      ['Comparar la masa real de un producto con la teórica de otro.', 'Real y teórico deben referirse al mismo producto y en la misma unidad.']
    ],
    ecs: [
      ['Rendimiento porcentual', 'R = m_real / m_teórica × 100', 'Lo obtenido entre lo máximo.', String.raw`R = \frac{m_{\mathrm{real}}}{m_{\mathrm{te\acute{o}rica}}} \times 100`],
      ['En moles', 'R = n_real / n_teórica × 100', 'Equivalente si se usan moles del mismo producto.', String.raw`R = \frac{n_{\mathrm{real}}}{n_{\mathrm{te\acute{o}rica}}} \times 100`]
    ],
    vars: [['R', 'rendimiento porcentual', '%'], ['m_real', 'masa obtenida', 'g'], ['m_teórica', 'masa máxima posible', 'g']],
    supuestos: ['El producto se mide seco y puro.'],
    limites: 'Si el producto no está puro o seco, el rendimiento calculado es engañoso; el número por sí solo no dice la causa de las pérdidas.',
    ejemplos: ['ej-est-rendimiento-porcentual', 'ej-est-rendimiento-porcentual-2'],
    figuras: ['fig-est-rendimiento'],
    resumen: ['R = real / teórico × 100.', 'Real y teórico del mismo producto y en la misma unidad.', 'Más del 100 % indica un error.', 'Un R bajo indica pérdidas o reacciones secundarias.'],
    glosario: [RENG_G7.porcentual, RENG_G7.real, RENG_G7.teorico],
    comprobar: [
      rengPreg('Real 9 g y teórico 12 g. ¿Cuál es el rendimiento porcentual?', ['75 %', true, 'Correcto: R = real / teórico × 100 = 9/12 × 100.'], ['133 %', false, 'Ese resultado divide el teórico entre el real.'], ['3 %', false, 'Ese resultado resta las masas en lugar de dividirlas.']),
      rengPreg('Un estudiante obtiene un rendimiento del 108 %. ¿Qué es lo más probable?', ['Que el producto esté húmedo o impuro', true, 'Correcto: el agua o las impurezas suman masa que no es producto.'], ['Que la reacción fuera perfecta', false, 'Una reacción perfecta daría exactamente el 100 %, no más.'], ['Que se formara más producto del posible', false, 'La estequiometría no permite más producto que el teórico.']),
      rengPreg('¿Es correcto calcular R con la masa real del producto y los moles teóricos?', ['No: ambos deben estar en la misma unidad', true, 'Correcto: hay que comparar gramos con gramos o moles con moles.'], ['Sí, si el producto es puro', false, 'La pureza no arregla mezclar unidades distintas.'], ['Sí, porque el cociente da igual', false, 'Mezclar gramos y moles da un número sin sentido.'])
    ],
    anterior: 'n1-b7-s16',
    siguiente: 'n1-b7-s18',
    prerrequisitos: ['n1-b7-s16'],
    escena: { id: 'reactivo-limitante', valores: { r: 1, n1: 2, n2: 6, rend: 60 }, instruccion: 'Con un rendimiento del 60 %, divide la masa obtenida entre la teórica: recuperas el 60 %. Compara con los casos de la tabla.', limite: RENG_ESCENA_LIMITANTE_LIMITE },
    fuentes: [rengSeccionEsteq(RENG_S44, 'el rendimiento porcentual'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Producto seco y puro.',
    metodo: 'cociente de moles del mismo producto'
  }),
  rengLeccionN1({
    id: 'est-pureza',
    subtema: 'n1-b7-s18',
    nombre: 'Pureza de reactivos',
    pregunta: '¿Qué pasa cuando el reactivo no es puro?',
    objetivo: 'Calcular la masa de sustancia pura de una muestra impura y usarla en cálculos estequiométricos.',
    objetivosMas: ['Calcular la pureza de una muestra a partir de la cantidad de producto que forma.'],
    porQueImporta: 'Los minerales, los reactivos técnicos y muchas materias primas no son puros. Si se calcula como si lo fueran, se espera más producto del que se obtendrá. Además, medir cuánto producto da una muestra es una forma clásica de saber su pureza, que es la base del análisis químico cuantitativo.',
    idea: 'La pureza es el porcentaje en masa de la sustancia de interés en una muestra. Solo esa parte reacciona (se supone que las impurezas no lo hacen). Así, la masa pura es la masa de muestra por la pureza/100, y con ella se hace el cálculo estequiométrico. Al revés, si se mide el producto formado, se calcula cuánta sustancia pura había y se divide entre la masa de muestra.',
    imagen: 'Una caliza del 92 % contiene 92 g de carbonato de calcio por cada 100 g de roca.',
    analogia: 'Una muestra impura es como una bolsa de fruta con algunas piezas que no sirven: solo las buenas cuentan para hacer zumo.',
    analogiaLimite: 'En la bolsa se ven las piezas malas; en una muestra las impurezas están mezcladas a nivel microscópico y solo se conocen por análisis. Además, a veces las impurezas sí reaccionan, y el cálculo deja de valer.',
    errores: [
      ['Usar la masa de muestra completa en lugar de la masa pura.', 'Primero se multiplica por la pureza/100; solo esa masa reacciona.'],
      ['Aplicar la pureza al producto en vez de al reactivo.', 'La pureza se refiere a la muestra de partida; el producto se calcula después con la masa pura.']
    ],
    ecs: [
      ['Masa pura', 'm_pura = m_muestra · p / 100', 'Parte de la muestra que es la sustancia de interés.', String.raw`m_{\mathrm{pura}} = m_{\mathrm{muestra}} \cdot \frac{p}{100}`],
      ['Pureza a partir del análisis', 'p = m_pura / m_muestra × 100', 'Cuando se calcula la masa pura a partir del producto medido.', String.raw`p = \frac{m_{\mathrm{pura}}}{m_{\mathrm{muestra}}} \times 100`]
    ],
    vars: [['p', 'pureza', '%'], ['m_muestra', 'masa de la muestra', 'g'], ['m_pura', 'masa de sustancia pura', 'g']],
    supuestos: ['Las impurezas no reaccionan ni forman el producto medido.'],
    limites: 'Si las impurezas reaccionan o desprenden el mismo gas, la pureza calculada sale falsa; el análisis real debe descartarlo.',
    ejemplos: ['ej-est-pureza', 'ej-est-pureza-2'],
    figuras: ['fig-est-pureza'],
    resumen: ['La pureza es el porcentaje en masa de la sustancia útil.', 'm_pura = m_muestra · p/100.', 'Solo la masa pura entra en el cálculo estequiométrico.', 'Midiendo el producto se calcula la pureza de una muestra.'],
    glosario: [RENG_G7.pureza, RENG_G7.impureza],
    comprobar: [
      rengPreg('¿Cuánto CaCO₃ puro hay en 200 g de caliza del 90 %?', ['180 g', true, 'Correcto: masa pura = 200 g × 90/100.'], ['200 g', false, 'Ese es el total de la muestra, que incluye impurezas.'], ['20 g', false, 'Esa es la masa de las impurezas, no la del carbonato.']),
      rengPreg('Una muestra impura forma menos producto del esperado para una sustancia pura. ¿Qué se puede calcular?', ['Su pureza', true, 'Correcto: con el producto se obtiene la masa pura y se divide entre la de la muestra.'], ['Su masa molar', false, 'La masa molar es de la sustancia pura y se conoce por su fórmula.'], ['Su rendimiento teórico', false, 'El teórico se calcula a partir de la pureza, no al revés.']),
      rengPreg('¿Qué supuesto hace falta para calcular la pureza por el gas desprendido?', ['Que las impurezas no desprendan ese gas', true, 'Correcto: si lo hicieran, el gas no vendría solo de la sustancia de interés.'], ['Que la muestra sea líquida', false, 'El estado de la muestra no es la condición clave.'], ['Que la reacción sea lenta', false, 'La rapidez no afecta a la cantidad total de gas.'])
    ],
    anterior: 'n1-b7-s17',
    siguiente: 'n1-b7-s19',
    prerrequisitos: ['n1-b7-s10'],
    fuentes: [rengSeccionEsteq(RENG_S45, 'la pureza y el análisis cuantitativo'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Impurezas inertes.',
    metodo: 'conservación de la masa con el óxido residual'
  }),
  rengLeccionN1({
    id: 'est-mezclas',
    subtema: 'n1-b7-s19',
    nombre: 'Estequiometría de mezclas',
    pregunta: '¿Cómo se calcula la composición de una mezcla a partir de lo que produce?',
    objetivo: 'Plantear y resolver un balance para hallar la composición de una mezcla de dos sustancias que reaccionan de forma conocida.',
    objetivosMas: ['Usar la pérdida de masa al calentar como dato de un problema de mezclas.'],
    porQueImporta: 'Los materiales reales suelen ser mezclas: una roca con varios carbonatos, una levadura química con bicarbonato y otros componentes. Saber cuánto hay de cada uno a partir de un solo dato medido, como el gas desprendido o la masa perdida, es una aplicación directa de la estequiometría al análisis.',
    idea: 'En una mezcla, cada componente reacciona según su propia ecuación. Si se mide un dato común (la masa total de gas desprendido, la pérdida de masa), se escribe un balance: la suma de lo que aporta cada componente es igual a lo medido. Con dos componentes, llamando x a la masa de uno y (total − x) a la del otro, sale una ecuación de primer grado. Si solo reacciona uno de los componentes, el problema se reduce a un cálculo directo.',
    imagen: 'Al calentar una mezcla de bicarbonato y sal, solo el bicarbonato pierde masa (agua y CO₂); la sal queda igual.',
    analogia: 'Es como averiguar cuántas monedas de 1 y de 2 euros hay en una hucha sabiendo cuántas monedas y cuánto dinero hay en total.',
    analogiaLimite: 'Con monedas los valores son exactos; con sustancias, los datos medidos tienen error y, si las masas molares de los componentes se parecen mucho, el resultado es muy sensible a ese error.',
    errores: [
      ['Suponer que todos los componentes de la mezcla reaccionan igual.', 'Cada componente tiene su ecuación y su masa molar; hay que sumar sus aportaciones por separado.'],
      ['Usar la masa total de la mezcla como si fuera de un solo componente.', 'Hay que repartir la masa: x para uno y (total − x) para el otro.']
    ],
    ecs: [
      ['Balance de un producto común', 'x / M₁ · a₁ + (m − x) / M₂ · a₂ = n_medido', 'Cada componente aporta a_i moles de producto por mol.', String.raw`\frac{x}{M_1} a_1 + \frac{m - x}{M_2} a_2 = n_{\mathrm{medido}}`],
      ['Solución', 'x = (n_medido − m·a₂/M₂) / (a₁/M₁ − a₂/M₂)', 'Despeje de la masa del primer componente.', String.raw`x = \frac{n_{\mathrm{medido}} - m \cdot a_2/M_2}{a_1/M_1 - a_2/M_2}`]
    ],
    vars: [['x', 'masa del primer componente', 'g'], ['m', 'masa total de la mezcla', 'g'], ['a_i', 'moles de producto por mol de componente', 'sin unidad']],
    supuestos: ['Reacciones completas.', 'Sin otras sustancias que formen el producto medido.'],
    limites: 'Si las aportaciones por gramo de los dos componentes son parecidas, un pequeño error en el dato medido cambia mucho la composición calculada.',
    ejemplos: ['ej-est-mezclas', 'ej-est-mezclas-2'],
    figuras: ['fig-est-mezcla'],
    resumen: ['En una mezcla cada componente reacciona según su ecuación.', 'Un dato medido común da una ecuación de balance.', 'Con dos componentes: x y (total − x).', 'Si solo reacciona uno, el cálculo es directo.'],
    glosario: [RENG_G7.mezcla, RENG_G7.conservacion],
    comprobar: [
      rengPreg('Una mezcla de NaCl y NaHCO₃ pierde masa al calentarla. ¿Qué componente la pierde?', ['El NaHCO₃', true, 'Correcto: se descompone y desprende agua y CO₂; el NaCl no cambia.'], ['El NaCl', false, 'El cloruro de sodio no se descompone a esas temperaturas.'], ['Los dos por igual', false, 'Solo el bicarbonato se descompone; la sal no contribuye a la pérdida.']),
      rengPreg('En una mezcla de CaCO₃ y MgCO₃, ¿cuál da más CO₂ por gramo?', ['El MgCO₃', true, 'Correcto: tiene menor masa molar, así que un gramo contiene más moles de carbonato.'], ['El CaCO₃', false, 'El CaCO₃ tiene mayor masa molar: un gramo contiene menos moles.'], ['Los dos igual, porque dan 1 mol de CO₂ por mol', false, 'Dan lo mismo por mol, pero no por gramo.']),
      rengPreg('¿Cuántas incógnitas tiene un problema de mezcla de dos componentes con un dato medido?', ['Una, si se conoce la masa total', true, 'Correcto: la masa de uno es x y la del otro, total − x.'], ['Dos, siempre', false, 'La masa total relaciona las dos masas, que se reducen a una incógnita.'], ['Ninguna', false, 'La composición es precisamente lo que se desconoce.'])
    ],
    anterior: 'n1-b7-s18',
    siguiente: 'n1-b7-s20',
    prerrequisitos: ['n1-b7-s10', 'n1-b7-s18'],
    fuentes: [rengSeccionEsteq(RENG_S45, 'los problemas de mezclas'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Reacciones completas y datos exactos.',
    metodo: 'bisección numérica sobre el balance'
  }),
  rengLeccionN1({
    id: 'est-gases',
    subtema: 'n1-b7-s20',
    nombre: 'Estequiometría de gases',
    pregunta: '¿Cómo se calcula el volumen de gas que produce o consume una reacción?',
    objetivo: 'Combinar la estequiometría con la ecuación del gas ideal para calcular volúmenes de gases en condiciones dadas.',
    objetivosMas: ['Calcular la cantidad de un reactivo a partir de un volumen de gas medido.'],
    porQueImporta: 'Muchas reacciones producen o consumen gases: la levadura que hace subir el pan, un airbag, la respiración. Para saber qué volumen ocupará el gas, o para medir una reacción por el gas que desprende, hay que unir la estequiometría con la ecuación de los gases.',
    idea: 'Cuando interviene un gas, la estequiometría da sus moles y la ecuación del gas ideal los convierte en volumen: V = n·R·T/P, con la temperatura en kelvin y unidades coherentes con R. El camino inverso, de volumen medido a moles con n = P·V/(R·T), permite calcular cuánto reactivo había. Si el gas se recoge sobre agua, hay que restar la presión de vapor (bloque 8).',
    imagen: 'Un airbag se infla en milésimas de segundo con el gas que produce una reacción química.',
    analogia: 'Es como cambiar el resultado de la estequiometría a otra moneda: los moles se convierten en litros con el «tipo de cambio» R·T/P, que depende de las condiciones.',
    analogiaLimite: 'Un tipo de cambio no depende del día de la semana; el volumen molar sí depende de la temperatura y la presión, y en un gas real a presión alta deja de ser R·T/P.',
    errores: [
      ['Usar 22,4 L/mol en cualquier condición.', 'Solo vale a 0 °C y 1 atm; en otras condiciones hay que calcular V = n·R·T/P.'],
      ['Olvidar la estequiometría y suponer que los moles de gas son los del reactivo.', 'Primero hay que aplicar la razón molar entre el reactivo y el gas.']
    ],
    ecs: [
      ['Volumen de gas', 'V = n · R · T / P', 'Moles de gas de la estequiometría convertidos en volumen.', String.raw`V = \frac{n \cdot R \cdot T}{P}`],
      ['Moles de gas medido', 'n = P · V / (R · T)', 'Para el camino inverso.', String.raw`n = \frac{P \cdot V}{R \cdot T}`]
    ],
    vars: [['V', 'volumen de gas', 'L'], ['P', 'presión', 'kPa'], ['T', 'temperatura absoluta', 'K'], ['R', 'constante de los gases', '8,314 L·kPa/(mol·K)']],
    supuestos: ['Gas ideal, seco.', 'Reacción completa.'],
    limites: 'A presión alta o cerca de la condensación el gas se aparta del ideal (bloque 8, subtema 20).',
    ejemplos: ['ej-est-gases', 'ej-est-gases-2'],
    figuras: ['fig-gas-avogadro'],
    resumen: ['La estequiometría da los moles de gas.', 'V = n·R·T/P los convierte en volumen.', 'Temperatura en kelvin y unidades coherentes con R.', '22,4 L/mol solo vale a 0 °C y 1 atm.'],
    glosario: [RENG_G7.volumenMolar, RENG_G7.razonMolar],
    comprobar: [
      rengPreg('¿Qué volumen ocupa 1 mol de gas ideal a 25 °C y 1 atm?', ['Unos 24,5 L', true, 'Correcto: V = R·T/P = 0,08206 × 298,15.'], ['22,4 L', false, 'Ese es el volumen molar a 0 °C, no a 25 °C.'], ['1 L', false, 'Un mol de gas ocupa mucho más que un litro en esas condiciones.']),
      rengPreg('En Zn + 2 HCl → ZnCl₂ + H₂, ¿cuántos moles de H₂ da 1 mol de Zn?', ['1 mol', true, 'Correcto: la razón Zn : H₂ es 1 : 1.'], ['2 mol', false, 'El 2 es el coeficiente del HCl, no del hidrógeno.'], ['0,5 mol', false, 'No hay ningún coeficiente que divida a la mitad el hidrógeno.']),
      rengPreg('Si el H₂ se recoge sobre agua, ¿qué presión se usa para sus moles?', ['La total menos la del vapor de agua', true, 'Correcto: la ley de Dalton separa el hidrógeno del vapor.'], ['La total', false, 'La total incluye el vapor de agua, que no es hidrógeno.'], ['La del vapor de agua', false, 'Esa es la parte que hay que descontar.'])
    ],
    anterior: 'n1-b7-s19',
    siguiente: 'n1-b7-s21',
    prerrequisitos: ['n1-b7-s11', 'n1-b8-s9'],
    escena: { id: 'gas-ideal', valores: { n: 0.05, T: 298, V: 1.5, M: 2 }, instruccion: 'Pon la cantidad de gas que da tu cálculo estequiométrico y lee el «Volumen que ocuparía a 1 atm» a la temperatura de trabajo.', limite: RENG_LIMITE_GAS },
    fuentes: [rengSeccionEsteq(RENG_S43, 'la estequiometría con gases'), RENG_PROCEDENCIA_R, RENG_PROCEDENCIA_MASAS],
    idealizado: 'Gas ideal seco y reacción completa.',
    metodo: 'P·V = N·k_B·T en unidades del SI'
  }),
  rengLeccionN1({
    id: 'est-consecutivas',
    subtema: 'n1-b7-s21',
    nombre: 'Problemas con reacciones consecutivas',
    pregunta: '¿Cómo se encadenan varias reacciones en un mismo cálculo?',
    objetivo: 'Resolver problemas en los que el producto de una reacción es el reactivo de la siguiente, incluidos sus rendimientos.',
    objetivosMas: ['Calcular el rendimiento global de una secuencia y la materia prima necesaria para un producto final.'],
    porQueImporta: 'Casi ningún producto industrial o farmacéutico se obtiene en una sola reacción: se encadenan varias etapas. Como los rendimientos se multiplican, una secuencia larga puede perder la mayor parte del material, y saber calcularlo es clave para diseñar procesos viables.',
    idea: 'En reacciones consecutivas, la cantidad de producto de una etapa es la cantidad de reactivo de la siguiente. Se pueden encadenar las razones molares de todas las etapas en un solo cálculo, o hacerlo paso a paso. Si cada etapa tiene su rendimiento, el rendimiento global es el producto de todos (en fracción). Para obtener una cantidad dada de producto final, se divide entre el rendimiento global.',
    imagen: 'Una síntesis de seis etapas, cada una con un 85 % de rendimiento, solo aprovecha un 38 % del material inicial.',
    analogia: 'Es como una cadena de traducciones: si cada traductor conserva el 90 % del sentido, después de varios queda bastante menos del original.',
    analogiaLimite: 'En las traducciones la pérdida es difícil de medir; en química cada rendimiento es un número medible, y el global se calcula exactamente multiplicándolos.',
    errores: [
      ['Sumar o promediar los rendimientos de las etapas.', 'El rendimiento global es el producto de los rendimientos en fracción: 0,90 × 0,95 = 0,855.'],
      ['Olvidar las razones molares de la segunda etapa.', 'Cada etapa tiene su ecuación: hay que aplicar todas las razones molares de la cadena.']
    ],
    ecs: [
      ['Rendimiento global', 'R_global = R₁ · R₂ · … · Rₖ', 'Producto de los rendimientos en fracción.', String.raw`R_{\mathrm{global}} = R_1 \cdot R_2 \cdots R_k`],
      ['Cadena de razones molares', 'n_final = n_inicial · (ν₂/ν₁)ₑₜₐₚₐ₁ · (ν₃/ν₂)ₑₜₐₚₐ₂ · R_global', 'Todas las etapas en un solo cálculo.', String.raw`n_{\mathrm{final}} = n_{\mathrm{inicial}} \cdot \prod_j \frac{\nu_{\mathrm{sale},j}}{\nu_{\mathrm{entra},j}} \cdot R_{\mathrm{global}}`]
    ],
    vars: [['R_global', 'rendimiento global', 'sin unidad (fracción)'], ['Rᵢ', 'rendimiento de cada etapa', 'sin unidad (fracción)'], ['k', 'número de etapas', 'sin unidad']],
    supuestos: ['El producto de cada etapa pasa entero a la siguiente salvo lo indicado por su rendimiento.'],
    limites: 'Supone rendimientos fijos e independientes; en la realidad las impurezas de una etapa pueden empeorar la siguiente.',
    ejemplos: ['ej-est-consecutivas', 'ej-est-consecutivas-2'],
    figuras: ['fig-est-consecutivas'],
    resumen: ['El producto de una etapa es el reactivo de la siguiente.', 'Las razones molares se encadenan.', 'El rendimiento global es el producto de los de cada etapa.', 'Las secuencias largas pierden mucho material aunque cada etapa sea buena.'],
    glosario: [RENG_G7.consecutivas, RENG_G7.global],
    comprobar: [
      rengPreg('Dos etapas con rendimientos del 80 % y del 50 %. ¿Rendimiento global?', ['40 %', true, 'Correcto: 0,80 × 0,50 = 0,40.'], ['65 %', false, 'Ese es el promedio; los rendimientos se multiplican.'], ['130 %', false, 'Ese resultado suma los rendimientos, lo que daría más del máximo.']),
      rengPreg('En CaCO₃ → CaO + CO₂ y CaO + H₂O → Ca(OH)₂, ¿cuántos moles de Ca(OH)₂ da 1 mol de CaCO₃ con rendimientos del 100 %?', ['1 mol', true, 'Correcto: las dos razones molares son 1 : 1.'], ['2 mol', false, 'No hay ningún coeficiente 2 en la cadena.'], ['0,5 mol', false, 'Ninguna etapa divide la cantidad a la mitad.']),
      rengPreg('¿Por qué las síntesis de muchas etapas tienen rendimientos globales bajos?', ['Porque los rendimientos se multiplican y cada factor es menor que 1', true, 'Correcto: aunque cada etapa sea buena, el producto de muchas fracciones baja deprisa.'], ['Porque cada etapa destruye masa', false, 'La masa se conserva; se pierde producto útil, no masa.'], ['Porque las etapas se estorban entre sí', false, 'La causa principal es aritmética: el producto de fracciones menores que 1.'])
    ],
    anterior: 'n1-b7-s20',
    siguiente: 'n1-b8-s1',
    prerrequisitos: ['n1-b7-s16'],
    fuentes: [rengSeccionEsteq(RENG_S44, 'los rendimientos de varias etapas'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Rendimientos constantes por etapa.',
    metodo: 'cálculo paso a paso con la masa intermedia'
  })
]
