import { rengLeccionN1 } from '../constructor'
import { rengPreg } from '../gases/libro-comun'
import { RENG_PROCEDENCIA_MASAS, RENG_PROCEDENCIA_NA_KB, rengSinVerificar } from '../procedencia'
import type { RengLeccionN1, RengProcedenciaN1 } from '../tipos'
import { RENG_G7 } from './glosario'

export const rengSeccionEsteq = (rengSeccion: string, rengPara: string): RengProcedenciaN1 =>
  rengSinVerificar(`OpenStax, Chemistry 2e, sección «${rengSeccion}» (CC BY-NC-SA 4.0). Se menciona para: ${rengPara}. No se abrió en esta entrega: el título se recuerda de la estructura del libro y no se comprobó. El texto de la lección es propio.`)

const RENG_S31 = '3.1 Formula Mass and the Mole Concept'
const RENG_S32 = '3.2 Determining Empirical and Molecular Formulas'
const RENG_S43 = '4.3 Reaction Stoichiometry'

export const RENG_ESCENA_LIMITANTE_LIMITE = 'La escena hace las cuentas de una ecuación ajustada con dos reactivos: no dice si la reacción ocurre ni cuánto tarda, y el rendimiento es un dato que tú eliges.'

export const RENG_LECCIONES_ESTEQ_A: readonly RengLeccionN1[] = [
  rengLeccionN1({
    id: 'est-mol',
    subtema: 'n1-b7-s1',
    nombre: 'Concepto de mol',
    pregunta: '¿Cómo se cuentan partículas tan pequeñas que no se pueden contar una a una?',
    objetivo: 'Definir el mol como unidad de cantidad de sustancia y pasar de número de entidades a moles y al revés.',
    objetivosMas: ['Distinguir entre moles de moléculas y moles de átomos de un compuesto.'],
    porQueImporta: 'En una receta química no se pueden contar moléculas, pero las reacciones ocurren molécula a molécula. El mol permite trabajar con cantidades que se pesan en el laboratorio sabiendo cuántas partículas contienen, y es la unidad con la que se escriben todas las proporciones de las reacciones.',
    idea: 'El mol es la unidad de cantidad de sustancia del SI. Un mol contiene exactamente 6,02214076·10²³ entidades elementales, sean átomos, moléculas, iones o fórmulas unidad. Igual que una docena son 12 objetos, un mol es un número fijo de entidades, solo que enorme. Así, «2 mol de agua» significa 2 × 6,022·10²³ moléculas de agua, y esas moléculas contienen el doble de átomos de hidrógeno.',
    imagen: 'Unos 18 mL de agua, algo más que una cucharada sopera, son aproximadamente un mol de moléculas de agua.',
    analogia: 'El mol es como una resma de papel: nadie cuenta las hojas una a una; se cuentan resmas sabiendo cuántas hojas trae cada una.',
    analogiaLimite: 'Una resma tiene 500 hojas y se puede comprobar contando; un mol tiene un número tan grande que nunca se cuenta directamente, sino que se deduce pesando y usando la masa molar.',
    errores: [
      ['Confundir moles de moléculas con moles de átomos: decir que 1 mol de H₂O contiene 1 mol de hidrógeno.', '1 mol de H₂O contiene 2 mol de átomos de H y 1 mol de átomos de O: hay que leer los subíndices de la fórmula.'],
      ['Pensar que un mol de cualquier sustancia pesa lo mismo.', 'Un mol tiene siempre el mismo número de entidades, pero su masa depende de la sustancia: es su masa molar.']
    ],
    ecs: [
      ['Número de entidades', 'N = n · N_A', 'El número de entidades es la cantidad en moles por la constante de Avogadro.', String.raw`N = n \cdot N_A`],
      ['Cantidad de sustancia', 'n = N / N_A', 'Para pasar de entidades a moles se divide entre N_A.', String.raw`n = \frac{N}{N_A}`]
    ],
    vars: [['n', 'cantidad de sustancia', 'mol'], ['N', 'número de entidades', 'sin unidad'], ['N_A', 'constante de Avogadro', 'mol⁻¹']],
    supuestos: ['Se cuentan entidades bien definidas (moléculas, átomos, iones o fórmulas unidad).'],
    limites: 'El concepto de mol es exacto por definición; lo aproximado son las masas atómicas que luego se usan para pasar de moles a gramos.',
    ejemplos: ['ej-est-mol', 'ej-est-mol-2'],
    figuras: ['fig-est-masa-moles'],
    resumen: ['El mol es la unidad de cantidad de sustancia del SI.', 'Un mol contiene 6,02214076·10²³ entidades, valor exacto.', 'N = n·N_A y n = N/N_A.', 'Los subíndices de la fórmula dicen cuántos moles de cada átomo hay por mol de compuesto.'],
    glosario: [RENG_G7.mol, RENG_G7.cantidad, RENG_G7.entidad],
    comprobar: [
      rengPreg('¿Cuántas moléculas hay en 2,00 mol de CO₂?', ['Unas 1,20·10²⁴', true, 'Correcto: 2,00 × 6,022·10²³ = 1,20·10²⁴ moléculas.'], ['Unas 6,02·10²³', false, 'Ese es el número de moléculas de un solo mol; hay que multiplicar por 2.'], ['Unas 3,01·10²³', false, 'Ese resultado divide entre 2 en lugar de multiplicar.']),
      rengPreg('¿Cuántos moles de átomos de oxígeno hay en 1 mol de CO₂?', ['2 mol', true, 'Correcto: cada molécula de CO₂ tiene dos átomos de oxígeno.'], ['1 mol', false, 'Confusión entre moles de moléculas y de átomos: hay dos O por molécula.'], ['3 mol', false, 'Ese es el total de átomos por molécula (1 C y 2 O), no los de oxígeno.']),
      rengPreg('¿Qué tienen en común 1 mol de hierro y 1 mol de agua?', ['El mismo número de entidades', true, 'Correcto: un mol de cualquier sustancia contiene N_A entidades.'], ['La misma masa', false, 'La masa de un mol depende de la sustancia: es su masa molar.'], ['El mismo volumen', false, 'El volumen depende del estado y de la densidad; solo los gases ideales comparten volumen molar a igual P y T.'])
    ],
    anterior: 'n1-b6-s20',
    siguiente: 'n1-b7-s2',
    prerrequisitos: [],
    fuentes: [rengSeccionEsteq(RENG_S31, 'el concepto de mol'), RENG_PROCEDENCIA_NA_KB],
    idealizado: 'Muestras puras de una sola sustancia.',
    metodo: 'N = n·N_A y comprobación por la masa de la muestra'
  }),
  rengLeccionN1({
    id: 'est-avogadro',
    subtema: 'n1-b7-s2',
    nombre: 'Número de Avogadro',
    pregunta: '¿Qué tan grande es el número de Avogadro y qué dice de los átomos?',
    objetivo: 'Usar la constante de Avogadro para calcular la masa de una sola molécula y el número de moléculas de una muestra.',
    objetivosMas: ['Explicar por qué N_A tiene un valor exacto desde la redefinición del SI de 2019.'],
    porQueImporta: 'El número de Avogadro es el puente entre el mundo que se ve y se pesa y el de los átomos, que no se ve. Gracias a él se sabe que una gota de agua contiene más moléculas que estrellas hay en una galaxia, y se puede calcular cuánto pesa una sola molécula.',
    idea: 'La constante de Avogadro, N_A = 6,02214076·10²³ mol⁻¹, es el número de entidades que hay en un mol. Desde 2019 su valor es exacto por definición en el SI. Con ella, la masa de una molécula es su masa molar dividida entre N_A, y el número de moléculas de una muestra es su cantidad en moles por N_A. A igual masa, una sustancia de masa molar pequeña tiene muchas más moléculas.',
    imagen: 'Con granos de arena de un milímetro cúbico, 6·10²³ granos cubrirían toda la superficie de la Tierra con una capa de algo más de un metro (cálculo propio aproximado).',
    analogia: 'N_A es como el tipo de cambio entre dos monedas: convierte «moles», la moneda del químico, en «número de moléculas», la moneda de la naturaleza.',
    analogiaLimite: 'Un tipo de cambio varía con el mercado; N_A es un número fijo por definición. Y nadie paga con moléculas: el cambio solo sirve para razonar, no para contar físicamente.',
    errores: [
      ['Multiplicar por N_A para pasar de moléculas a moles.', 'De moléculas a moles se divide entre N_A; de moles a moléculas se multiplica.'],
      ['Creer que a igual masa todas las sustancias tienen el mismo número de moléculas.', 'A igual masa, el número de moléculas es inversamente proporcional a la masa molar.']
    ],
    ecs: [
      ['Masa de una molécula', 'm₁ = M / N_A', 'La masa de un mol repartida entre sus N_A moléculas.', String.raw`m_1 = \frac{M}{N_A}`],
      ['Moléculas de una muestra', 'N = (m / M) · N_A', 'Masa a moles y moles a moléculas.', String.raw`N = \frac{m}{M} \cdot N_A`]
    ],
    vars: [['N_A', 'constante de Avogadro', '6,02214076·10²³ mol⁻¹'], ['M', 'masa molar', 'g/mol'], ['m₁', 'masa de una molécula', 'g']],
    supuestos: ['Sustancia pura formada por moléculas o fórmulas unidad iguales.'],
    limites: 'N_A es exacto, pero las masas molares que se combinan con él vienen de masas atómicas medias (sin verificar en esta app).',
    ejemplos: ['ej-est-avogadro', 'ej-est-avogadro-2'],
    figuras: ['fig-est-masa-moles'],
    resumen: ['N_A = 6,02214076·10²³ mol⁻¹, exacto en el SI desde 2019.', 'La masa de una molécula es M/N_A, del orden de 10⁻²³ g.', 'N = (m/M)·N_A da las moléculas de una muestra.', 'A igual masa, hay más moléculas cuanto menor es la masa molar.'],
    glosario: [RENG_G7.avogadro, RENG_G7.entidad],
    comprobar: [
      rengPreg('¿En cuál de estas muestras hay más moléculas?', ['1 g de hidrógeno (H₂)', true, 'Correcto: tiene la menor masa molar, así que un gramo contiene más moles y más moléculas.'], ['1 g de agua (H₂O)', false, 'El agua tiene más masa molar que el H₂: en un gramo caben menos moléculas.'], ['1 g de dióxido de carbono (CO₂)', false, 'Es la de mayor masa molar de las tres: contiene menos moléculas por gramo.']),
      rengPreg('¿Qué se obtiene al dividir la masa molar del agua entre N_A?', ['La masa de una molécula de agua', true, 'Correcto: la masa de un mol repartida entre las N_A moléculas que lo forman.'], ['El número de moléculas de un gramo', false, 'Ese número es el cociente inverso, N_A/M.'], ['El volumen de una molécula', false, 'Con la masa molar y N_A solo se obtienen masas o números de moléculas, no volúmenes.']),
      rengPreg('¿Por qué el valor de N_A no tiene incertidumbre en el SI actual?', ['Porque desde 2019 se fija por definición', true, 'Correcto: el mol se define fijando el valor numérico de N_A.'], ['Porque se midió con precisión infinita', false, 'Ninguna medida tiene precisión infinita; el valor exacto procede de una definición.'], ['Porque es un número redondo', false, 'No es redondo: 6,02214076·10²³ tiene nueve cifras fijadas por convenio.'])
    ],
    anterior: 'n1-b7-s1',
    siguiente: 'n1-b7-s3',
    prerrequisitos: ['n1-b7-s1'],
    fuentes: [rengSeccionEsteq(RENG_S31, 'la constante de Avogadro'), RENG_PROCEDENCIA_NA_KB, RENG_PROCEDENCIA_MASAS],
    idealizado: 'Moléculas idénticas, sin variaciones isotópicas explícitas.',
    metodo: 'masa de una molécula como M/N_A e inverso del número de moléculas por gramo'
  }),
  rengLeccionN1({
    id: 'est-masa-molar',
    subtema: 'n1-b7-s3',
    nombre: 'Masa molar',
    pregunta: '¿Cuánto pesa un mol de una sustancia y cómo se calcula?',
    objetivo: 'Calcular la masa molar de un compuesto a partir de su fórmula y de las masas atómicas.',
    objetivosMas: ['Convertir entre masa y cantidad de sustancia con n = m/M.'],
    porQueImporta: 'En el laboratorio las sustancias se pesan, pero las reacciones se describen en moles. La masa molar es la herramienta que traduce los gramos de la balanza a moles, y sin ella no se puede preparar ninguna reacción en las proporciones correctas.',
    idea: 'La masa molar M es la masa de un mol de una sustancia, en g/mol. Se calcula sumando las masas atómicas de todos los átomos de la fórmula, cada una multiplicada por su número de átomos. Los paréntesis multiplican todo el grupo: en Ca(OH)₂ hay dos O y dos H. Con la masa molar, n = m/M convierte gramos en moles y m = n·M convierte moles en gramos.',
    imagen: 'Un mol de agua pesa unos 18 g, un mol de sal unos 58 g y un mol de azúcar común unos 342 g.',
    analogia: 'La masa molar es como el peso de una caja estándar de piezas: si se sabe cuánto pesa una caja llena, pesando un montón se sabe cuántas cajas hay.',
    analogiaLimite: 'Las cajas pueden no estar llenas del todo; un mol siempre contiene el mismo número de entidades. Y las masas atómicas son medias de los isótopos, no la masa de cada átomo concreto.',
    errores: [
      ['Olvidar que el subíndice tras un paréntesis multiplica todo el grupo.', 'En Ca(OH)₂ hay 2 átomos de O y 2 de H; en Al₂(SO₄)₃ hay 3 S y 12 O.'],
      ['Sumar las masas de los elementos distintos sin tener en cuenta cuántos átomos hay de cada uno.', 'Cada masa atómica se multiplica por el número de átomos de ese elemento en la fórmula.']
    ],
    ecs: [
      ['Masa molar', 'M = Σ (nᵢ · Aᵢ)', 'Suma de las masas atómicas por el número de átomos de cada elemento.', String.raw`M = \sum_i n_i \cdot A_i`],
      ['De masa a moles', 'n = m / M', 'Gramos entre g/mol dan mol.', String.raw`n = \frac{m}{M}`]
    ],
    vars: [['M', 'masa molar', 'g/mol'], ['Aᵢ', 'masa atómica del elemento i', 'g/mol'], ['nᵢ', 'átomos del elemento i en la fórmula', 'sin unidad'], ['m', 'masa', 'g']],
    supuestos: ['Masas atómicas de la tabla periódica de la app (medias isotópicas).'],
    limites: 'Las masas atómicas de la app no se han contrastado con una tabla oficial en esta entrega: los resultados son «sin verificar» en la cuarta o quinta cifra.',
    ejemplos: ['ej-est-masa-molar', 'ej-est-masa-molar-2'],
    figuras: ['fig-est-masa-moles'],
    resumen: ['La masa molar es la masa de un mol, en g/mol.', 'Se calcula sumando masas atómicas por número de átomos.', 'Los paréntesis multiplican todo el grupo.', 'n = m/M y m = n·M conectan gramos y moles.'],
    glosario: [RENG_G7.masaMolar, RENG_G7.masaAtomica],
    comprobar: [
      rengPreg('¿Cuántos átomos de oxígeno hay en una fórmula unidad de Al₂(SO₄)₃?', ['12', true, 'Correcto: 4 oxígenos en cada SO₄, y el 3 multiplica el grupo: 3 × 4 = 12.'], ['4', false, 'Ese es el número de O de un solo grupo sulfato; el subíndice 3 lo multiplica.'], ['7', false, 'Ese número suma subíndices en lugar de multiplicarlos.']),
      rengPreg('Una sustancia tiene M = 50 g/mol. ¿Cuántos moles hay en 25 g?', ['0,5 mol', true, 'Correcto: n = m/M = 25/50.'], ['2 mol', false, 'Ese resultado divide la masa molar entre la masa, al revés.'], ['1250 mol', false, 'Ese resultado multiplica en lugar de dividir.']),
      rengPreg('¿Por qué la masa molar del cloro (Cl) no es un número entero?', ['Porque es una media de sus isótopos', true, 'Correcto: el cloro natural es una mezcla de isótopos de distinta masa y la masa atómica es su media ponderada.'], ['Porque se mide mal', false, 'No es un error de medida: refleja la mezcla natural de isótopos.'], ['Porque los electrones pesan mucho', false, 'Los electrones aportan muy poca masa; no explican el valor no entero.'])
    ],
    anterior: 'n1-b7-s2',
    siguiente: 'n1-b7-s4',
    prerrequisitos: ['n1-b7-s1'],
    fuentes: [rengSeccionEsteq(RENG_S31, 'la masa molar'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Compuestos puros con la composición isotópica natural media.',
    metodo: 'suma manual de masas atómicas contrastada con el analizador de fórmulas'
  }),
  rengLeccionN1({
    id: 'est-masa-molecular',
    subtema: 'n1-b7-s4',
    nombre: 'Masa molecular',
    pregunta: '¿Qué diferencia hay entre la masa molecular y la masa molar?',
    objetivo: 'Calcular la masa molecular relativa de una molécula y relacionarla con su masa molar.',
    objetivosMas: ['Comparar masas de moléculas distintas usando masas moleculares relativas.'],
    porQueImporta: 'Muchas tablas y etiquetas dan la masa molecular de una sustancia sin unidades, y en espectrometría de masas se identifican moléculas por ella. Saber qué significa y cómo se relaciona con la masa molar evita confundir una propiedad de una molécula con la de un mol.',
    idea: 'La masa molecular relativa, M_r, es la suma de las masas atómicas relativas de los átomos de una molécula. Es un número sin unidades que compara la masa de la molécula con 1/12 de la masa de un átomo de carbono-12. Numéricamente coincide con la masa molar en g/mol, pero describe una sola molécula: la glucosa tiene M_r ≈ 180, y un mol de glucosa pesa unos 180 g.',
    imagen: 'Una molécula de glucosa pesa como unas diez moléculas de agua.',
    analogia: 'La masa molecular relativa es como decir que un camión «pesa lo que diez coches»: compara sin dar kilos.',
    analogiaLimite: 'En la comparación con coches cada coche pesa distinto; en química la referencia es fija (1/12 del carbono-12) y la relación entre masas relativas es exacta para cada molécula.',
    errores: [
      ['Poner g/mol como unidad de la masa molecular relativa.', 'M_r no tiene unidades; la masa molar sí (g/mol). Coinciden en número, no en significado.'],
      ['Usar «masa molecular» para un sólido iónico como el NaCl.', 'Los compuestos iónicos no forman moléculas: se habla de masa fórmula (subtema 5).']
    ],
    ecs: [
      ['Masa molecular relativa', 'M_r = Σ (nᵢ · A_r,ᵢ)', 'Suma de masas atómicas relativas de los átomos de la molécula.', String.raw`M_r = \sum_i n_i \cdot A_{r,i}`],
      ['Masa de una molécula', 'm₁ = M_r · (1 g/mol) / N_A', 'La masa real de la molécula en gramos.', String.raw`m_1 = \frac{M_r \cdot 1\ \mathrm{g/mol}}{N_A}`]
    ],
    vars: [['M_r', 'masa molecular relativa', 'sin unidad'], ['A_r', 'masa atómica relativa', 'sin unidad']],
    supuestos: ['La sustancia está formada por moléculas definidas.'],
    limites: 'La masa molecular relativa usa masas atómicas medias: una molécula concreta puede contener isótopos y pesar algo distinto.',
    ejemplos: ['ej-est-masa-molecular', 'ej-est-masa-molecular-2'],
    figuras: ['fig-est-masa-moles'],
    resumen: ['La masa molecular relativa suma las masas atómicas relativas de una molécula.', 'La masa molecular relativa no tiene unidades.', 'Numéricamente coincide con la masa molar en g/mol.', 'Solo se aplica a sustancias moleculares.'],
    glosario: [RENG_G7.masaMolecular, RENG_G7.masaAtomica],
    comprobar: [
      rengPreg('La masa molecular relativa del CO₂ es unos 44. ¿Cuánto pesa un mol de CO₂?', ['Unos 44 g', true, 'Correcto: la masa molar en g/mol coincide numéricamente con la masa molecular relativa.'], ['44 g por molécula', false, 'Una sola molécula pesa del orden de 10⁻²³ g; los 44 g son de un mol.'], ['Unos 44 kg', false, 'La correspondencia numérica es con gramos por mol, no con kilogramos.']),
      rengPreg('¿Qué unidad tiene la masa molecular relativa?', ['Ninguna', true, 'Correcto: es un cociente de masas (relativa a 1/12 del carbono-12).'], ['g/mol', false, 'g/mol es la unidad de la masa molar, no de la masa molecular relativa.'], ['gramos', false, 'Una molécula pesa una fracción minúscula de gramo; la masa relativa no está en gramos.']),
      rengPreg('¿Para cuál de estas sustancias tiene sentido hablar de masa molecular?', ['Glucosa', true, 'Correcto: está formada por moléculas de C₆H₁₂O₆.'], ['Cloruro de sodio', false, 'Es iónico: no hay moléculas, sino una red de iones; se usa la masa fórmula.'], ['Hierro metálico', false, 'Un metal no forma moléculas; se usa la masa atómica.'])
    ],
    anterior: 'n1-b7-s3',
    siguiente: 'n1-b7-s5',
    prerrequisitos: ['n1-b7-s3'],
    explorar: {
      modulo: 'simulador-quimica',
      sub: 'mesa',
      nombre: 'Mesa molecular',
      instruccion: 'Construye o carga una molécula en la Mesa molecular y consulta su fórmula y su masa: comprueba que coincide con la suma de masas atómicas de esta lección.',
      limite: 'La Mesa muestra moléculas aisladas y su composición; no calcula cantidades de sustancia ni hace estequiometría.'
    },
    fuentes: [rengSeccionEsteq(RENG_S31, 'la masa molecular'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Molécula con la composición isotópica natural media.',
    metodo: 'suma manual de masas atómicas contrastada con la unidad CH₂O del analizador'
  }),
  rengLeccionN1({
    id: 'est-masa-formula',
    subtema: 'n1-b7-s5',
    nombre: 'Masa fórmula',
    pregunta: '¿Cómo se calcula la masa de un compuesto que no forma moléculas?',
    objetivo: 'Calcular la masa fórmula de compuestos iónicos y de hidratos a partir de su fórmula unidad.',
    objetivosMas: ['Calcular el porcentaje de agua de un hidrato.'],
    porQueImporta: 'La sal de mesa, el yeso o el sulfato de cobre no están formados por moléculas, sino por redes de iones. Para usarlos en una reacción hay que saber cuánto pesa su fórmula unidad, y en los hidratos hay que contar también el agua que contienen, que se pierde al calentarlos.',
    idea: 'En un compuesto iónico no hay moléculas: los iones forman una red tridimensional. La fórmula unidad indica la proporción más sencilla de iones (NaCl, CaCl₂). Su masa fórmula se calcula igual que una masa molecular, sumando masas atómicas. En los hidratos, como CuSO₄·5H₂O, el punto indica cuántas moléculas de agua acompañan a cada fórmula unidad, y su masa se suma a la del resto.',
    imagen: 'El sulfato de cobre pentahidratado es azul; al calentarlo pierde el agua y queda un polvo casi blanco que pesa algo más de un tercio menos.',
    analogia: 'Una fórmula unidad es como la receta de un mosaico: «un azulejo blanco por cada negro» describe la proporción, aunque el mosaico tenga millones de azulejos.',
    analogiaLimite: 'Los azulejos se pueden contar en grupos aislados; en el cristal iónico no existe un «par» separado de los demás: la fórmula unidad es solo una proporción.',
    errores: [
      ['Olvidar el agua de un hidrato al calcular su masa fórmula.', 'En CuSO₄·5H₂O hay que sumar 5 veces la masa del agua a la del CuSO₄.'],
      ['Creer que NaCl es una molécula de un átomo de Na unido a uno de Cl.', 'El NaCl sólido es una red de iones Na⁺ y Cl⁻; la fórmula solo da su proporción 1 : 1.']
    ],
    ecs: [
      ['Masa fórmula', 'M_f = Σ (nᵢ · A_r,ᵢ)', 'Suma de masas atómicas de la fórmula unidad.', String.raw`M_f = \sum_i n_i \cdot A_{r,i}`],
      ['Agua de un hidrato', '% agua = k · M(H₂O) / M(hidrato) × 100', 'Fracción de la masa del hidrato que corresponde a sus k moléculas de agua.', String.raw`\%\,\mathrm{agua} = \frac{k \cdot M(\mathrm{H_2O})}{M(\mathrm{hidrato})} \times 100`]
    ],
    vars: [['M_f', 'masa fórmula', 'sin unidad (o g/mol como masa molar)'], ['k', 'moléculas de agua por fórmula unidad', 'sin unidad']],
    supuestos: ['Compuestos puros con la estequiometría que indica su fórmula.'],
    limites: 'Algunos sólidos reales no tienen una proporción exacta de iones o de agua; aquí se supone la fórmula ideal.',
    ejemplos: ['ej-est-masa-formula', 'ej-est-masa-formula-2'],
    figuras: ['fig-est-masa-moles'],
    resumen: ['Los compuestos iónicos no forman moléculas: se usa la fórmula unidad.', 'La masa fórmula se calcula sumando masas atómicas, como la molecular.', 'En los hidratos se suma el agua indicada tras el punto.', 'El porcentaje de agua de un hidrato es la masa de su agua entre la masa fórmula total.'],
    glosario: [RENG_G7.formulaUnidad, RENG_G7.masaFormula, RENG_G7.hidrato],
    comprobar: [
      rengPreg('¿Cuántos átomos de hidrógeno hay en una fórmula unidad de CuSO₄·5H₂O?', ['10', true, 'Correcto: cinco moléculas de agua con dos H cada una.'], ['2', false, 'Ese es el número de H de una sola molécula de agua; hay cinco.'], ['5', false, 'El 5 cuenta moléculas de agua, no átomos de hidrógeno.']),
      rengPreg('¿Por qué se habla de masa fórmula y no de masa molecular en el CaCl₂?', ['Porque es un compuesto iónico sin moléculas', true, 'Correcto: forma una red de iones Ca²⁺ y Cl⁻.'], ['Porque tiene dos elementos', false, 'El número de elementos no decide: el CO₂ también tiene dos y sí forma moléculas.'], ['Porque su masa se calcula de otra manera', false, 'Se calcula igual (sumando masas atómicas); lo que cambia es lo que representa.']),
      rengPreg('Un hidrato pierde agua al calentarse. ¿Qué le pasa a su masa?', ['Disminuye en la masa del agua perdida', true, 'Correcto: el agua escapa como vapor y el sólido anhidro pesa menos.'], ['Aumenta porque se forma un sólido nuevo', false, 'El sólido anhidro se forma perdiendo agua, no ganando masa.'], ['No cambia, porque la masa se conserva', false, 'La masa total se conserva, pero el agua sale del recipiente: el sólido pesa menos.'])
    ],
    anterior: 'n1-b7-s4',
    siguiente: 'n1-b7-s6',
    prerrequisitos: ['n1-b7-s3'],
    fuentes: [rengSeccionEsteq(RENG_S31, 'la masa fórmula de los compuestos iónicos'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Sólidos iónicos con estequiometría exacta.',
    metodo: 'suma manual de masas atómicas contrastada con el analizador de fórmulas'
  }),
  rengLeccionN1({
    id: 'est-composicion',
    subtema: 'n1-b7-s6',
    nombre: 'Composición porcentual',
    pregunta: '¿Qué parte de la masa de un compuesto aporta cada elemento?',
    objetivo: 'Calcular el porcentaje en masa de cada elemento de un compuesto a partir de su fórmula.',
    objetivosMas: ['Usar la composición porcentual para calcular la masa de un elemento en una muestra.'],
    porQueImporta: 'Las etiquetas de los fertilizantes indican cuánto nitrógeno, fósforo y potasio aportan; los minerales se valoran por el porcentaje de metal que contienen. La composición porcentual traduce una fórmula química en esa información práctica.',
    idea: 'La composición porcentual da qué fracción de la masa de un compuesto corresponde a cada elemento. Se calcula con la masa de ese elemento en un mol del compuesto (masa atómica por número de átomos) dividida entre la masa molar, por 100. Los porcentajes de todos los elementos suman 100 %. Como depende solo de la fórmula, cualquier muestra pura del compuesto tiene la misma composición.',
    imagen: 'El agua es siempre un 11 % de hidrógeno y un 89 % de oxígeno en masa, venga de donde venga.',
    analogia: 'La composición porcentual es como el desglose de una factura: del total, qué parte corresponde a cada concepto.',
    analogiaLimite: 'Una factura puede cambiar de un mes a otro; la composición de un compuesto puro es fija (ley de las proporciones definidas). Solo las mezclas tienen composición variable.',
    errores: [
      ['Calcular el porcentaje con el número de átomos en lugar de con sus masas.', 'Lo que se reparte es la masa: hay que multiplicar cada número de átomos por su masa atómica.'],
      ['Contar una sola vez un elemento que aparece en dos lugares de la fórmula, como el N del NH₄NO₃.', 'Hay que sumar todos los átomos del elemento: en NH₄NO₃ hay dos N.']
    ],
    ecs: [
      ['Porcentaje en masa de un elemento', '%X = nₓ · Aₓ / M × 100', 'Masa del elemento en un mol entre la masa molar.', String.raw`\%X = \frac{n_X \cdot A_X}{M} \times 100`],
      ['Masa de un elemento en una muestra', 'mₓ = m · %X / 100', 'La fracción en masa aplicada a la muestra.', String.raw`m_X = m \cdot \frac{\%X}{100}`]
    ],
    vars: [['%X', 'porcentaje en masa del elemento X', '%'], ['nₓ', 'átomos de X en la fórmula', 'sin unidad'], ['M', 'masa molar del compuesto', 'g/mol']],
    supuestos: ['Compuesto puro.'],
    limites: 'Para una mezcla o un producto comercial impuro, la composición real difiere de la calculada con la fórmula.',
    ejemplos: ['ej-est-composicion', 'ej-est-composicion-2'],
    figuras: ['fig-est-composicion-alcanos'],
    resumen: ['%X = masa de X en un mol / masa molar × 100.', 'Los porcentajes de todos los elementos suman 100 %.', 'Un compuesto puro tiene siempre la misma composición.', 'La fracción en masa permite saber cuánto de un elemento hay en una muestra.'],
    glosario: [RENG_G7.composicion, RENG_G7.masaMolar],
    comprobar: [
      rengPreg('En el agua, ¿qué elemento aporta más masa?', ['El oxígeno', true, 'Correcto: aunque hay dos H por cada O, el oxígeno es unas 16 veces más pesado y aporta cerca del 89 %.'], ['El hidrógeno, porque hay más átomos', false, 'Más átomos no significa más masa: cada H pesa muy poco.'], ['Los dos igual', false, 'La masa se reparte según masas atómicas, no a partes iguales.']),
      rengPreg('¿Cuánto suman los porcentajes en masa de todos los elementos de un compuesto?', ['100 %', true, 'Correcto: entre todos forman la masa completa del compuesto.'], ['Depende del compuesto', false, 'Cada porcentaje depende del compuesto, pero la suma siempre es 100 %.'], ['El número de elementos por 100', false, 'Cada porcentaje es una parte del total; no se suman cien por elemento.']),
      rengPreg('Dos muestras de CO₂ de distinto origen, ¿tienen el mismo porcentaje de carbono?', ['Sí, porque es el mismo compuesto puro', true, 'Correcto: la composición depende solo de la fórmula.'], ['No, depende de dónde se tome', false, 'Eso ocurre con las mezclas, no con un compuesto puro.'], ['Solo si tienen la misma masa', false, 'El porcentaje no depende del tamaño de la muestra.'])
    ],
    anterior: 'n1-b7-s5',
    siguiente: 'n1-b7-s7',
    prerrequisitos: ['n1-b7-s3'],
    fuentes: [rengSeccionEsteq(RENG_S32, 'la composición porcentual'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Compuestos puros.',
    metodo: 'cien menos los porcentajes de los demás elementos'
  }),
  rengLeccionN1({
    id: 'est-formula-empirica',
    subtema: 'n1-b7-s7',
    nombre: 'Fórmula empírica',
    pregunta: '¿Cómo se deduce la fórmula de un compuesto a partir de su análisis?',
    objetivo: 'Obtener la fórmula empírica de un compuesto a partir de su composición porcentual o de las masas de sus elementos.',
    objetivosMas: ['Deducir la proporción de C y H de un compuesto a partir de un análisis por combustión.'],
    porQueImporta: 'Cuando se descubre o se sintetiza una sustancia nueva, lo primero que se mide es su composición. La fórmula empírica es la primera información sobre su identidad, y el análisis por combustión, que la obtiene, sigue usándose en los laboratorios de química orgánica.',
    idea: 'La fórmula empírica da la proporción más sencilla de números enteros entre los átomos de un compuesto. Para obtenerla se toman 100 g de compuesto (así los porcentajes pasan a gramos), se convierte la masa de cada elemento a moles y se dividen todos los moles entre el más pequeño. Si salen números cercanos a enteros, esos son los subíndices; si salen fracciones como 1,5 o 1,33, se multiplican todos por un entero que las haga enteras.',
    imagen: 'El formaldehído (CH₂O), el ácido acético (C₂H₄O₂) y la glucosa (C₆H₁₂O₆) tienen la misma fórmula empírica.',
    analogia: 'La fórmula empírica es como simplificar una fracción: 6/12 y 2/4 se reducen a 1/2, igual que C₆H₁₂O₆ se reduce a CH₂O.',
    analogiaLimite: 'Al simplificar una fracción no se pierde el valor; al pasar a la fórmula empírica sí se pierde información: no dice cuántos átomos tiene de verdad la molécula.',
    errores: [
      ['Dividir los porcentajes entre sí sin pasarlos antes a moles.', 'La proporción de átomos es una proporción de moles: cada masa se divide entre su masa atómica antes de comparar.'],
      ['Redondear demasiado pronto, por ejemplo 1,5 a 2.', 'Un cociente como 1,5 indica multiplicar todos por 2; solo se redondean valores muy cercanos a un entero.']
    ],
    ecs: [
      ['Moles de cada elemento', 'nₓ = mₓ / Aₓ', 'Masa de cada elemento (en 100 g de muestra) entre su masa atómica.', String.raw`n_X = \frac{m_X}{A_X}`],
      ['Subíndices relativos', 'xᵢ = nᵢ / n_mín', 'Se dividen todos los moles entre el menor.', String.raw`x_i = \frac{n_i}{n_{\mathrm{min}}}`]
    ],
    vars: [['mₓ', 'masa del elemento X en la muestra', 'g'], ['nₓ', 'moles de átomos de X', 'mol'], ['xᵢ', 'subíndice relativo', 'sin unidad']],
    supuestos: ['Análisis sin error; todos los elementos del compuesto están medidos.'],
    limites: 'Los análisis reales tienen error: los cocientes no salen exactamente enteros y hay que decidir con criterio; con datos poco precisos se puede elegir mal la fórmula.',
    ejemplos: ['ej-est-formula-empirica', 'ej-est-formula-empirica-2'],
    figuras: ['fig-est-composicion-alcanos'],
    resumen: ['La fórmula empírica da la proporción entera más sencilla de átomos.', 'Se pasan las masas (o porcentajes en 100 g) a moles.', 'Se divide entre el menor número de moles.', 'Si aparecen fracciones sencillas, se multiplica todo por un entero.', 'En la combustión, el C se mide como CO₂ y el H como agua.'],
    glosario: [RENG_G7.empirica, RENG_G7.combustion],
    comprobar: [
      rengPreg('Al dividir entre el menor número de moles se obtiene C 1, H 1,5. ¿Cuál es la fórmula empírica?', ['C₂H₃', true, 'Correcto: 1,5 es una fracción sencilla; multiplicando por 2 salen enteros.'], ['CH₂', false, 'Redondear 1,5 a 2 cambia la proporción real de átomos.'], ['CH', false, 'Redondear 1,5 a 1 también cambia la proporción; hay que multiplicar, no redondear.']),
      rengPreg('¿Por qué conviene tomar 100 g de compuesto?', ['Porque así cada porcentaje pasa directamente a gramos', true, 'Correcto: es solo una comodidad; la fórmula no depende de la masa elegida.'], ['Porque las fórmulas solo valen para 100 g', false, 'La proporción de átomos es la misma para cualquier masa de muestra.'], ['Porque 100 g es un mol', false, 'Un mol pesa la masa molar, que en general no es 100 g.']),
      rengPreg('En un análisis por combustión, ¿de dónde sale la cantidad de hidrógeno del compuesto?', ['Del agua formada', true, 'Correcto: todo el H acaba en H₂O, con dos átomos de H por molécula.'], ['Del CO₂ formado', false, 'El CO₂ no contiene hidrógeno: sirve para el carbono.'], ['Del oxígeno consumido', false, 'El oxígeno consumido no permite separar cuánto H tenía el compuesto.'])
    ],
    anterior: 'n1-b7-s6',
    siguiente: 'n1-b7-s8',
    prerrequisitos: ['n1-b7-s6'],
    fuentes: [rengSeccionEsteq(RENG_S32, 'la fórmula empírica y el análisis por combustión'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Análisis elemental exacto de un compuesto puro.',
    metodo: 'razón de porcentajes corregida por las masas atómicas'
  }),
  rengLeccionN1({
    id: 'est-formula-molecular',
    subtema: 'n1-b7-s8',
    nombre: 'Fórmula molecular',
    pregunta: '¿Cuántos átomos tiene de verdad cada molécula?',
    objetivo: 'Obtener la fórmula molecular a partir de la fórmula empírica y de la masa molar.',
    objetivosMas: ['Explicar por qué compuestos distintos pueden compartir fórmula empírica.'],
    porQueImporta: 'El acetileno (C₂H₂), que se usa en soldadura, y el benceno (C₆H₆) tienen la misma fórmula empírica, CH, pero son sustancias muy distintas. Para saber de qué molécula se trata hace falta la fórmula molecular, que combina el análisis con una medida de la masa molar.',
    idea: 'La fórmula molecular indica cuántos átomos de cada elemento hay en una molécula. Siempre es un múltiplo entero de la fórmula empírica: (fórmula empírica)ₙ. El factor n se obtiene dividiendo la masa molar del compuesto, medida por otro método, entre la masa de la fórmula empírica. Si el cociente no sale cercano a un entero, hay un error en los datos.',
    imagen: 'CH es la unidad del acetileno (×2) y del benceno (×6).',
    analogia: 'Si la fórmula empírica es una pieza de LEGO, la molecular dice cuántas piezas iguales forman el modelo completo.',
    analogiaLimite: 'Con piezas iguales se pueden montar modelos distintos; en química, dos compuestos con la misma fórmula molecular (isómeros) también pueden ser distintos, y eso no lo resuelve ninguna de las dos fórmulas.',
    errores: [
      ['Dividir la masa molar entre la de un solo átomo en lugar de la de la unidad empírica.', 'n = M(compuesto) / M(fórmula empírica), con la masa de toda la unidad empírica.'],
      ['Creer que la fórmula molecular identifica por completo la sustancia.', 'Varias sustancias (isómeros) comparten fórmula molecular; hace falta la estructura para distinguirlas.']
    ],
    ecs: [
      ['Factor multiplicador', 'n = M / M_emp', 'Cuántas unidades empíricas caben en la masa molar.', String.raw`n = \frac{M}{M_{\mathrm{emp}}}`],
      ['Fórmula molecular', 'Fórmula molecular = (fórmula empírica)ₙ', 'Se multiplican todos los subíndices por n.', String.raw`\mathrm{F}_{\mathrm{molecular}} = (\mathrm{F}_{\mathrm{emp}})_n`]
    ],
    vars: [['M', 'masa molar del compuesto', 'g/mol'], ['M_emp', 'masa de la fórmula empírica', 'g/mol'], ['n', 'factor entero', 'sin unidad']],
    supuestos: ['La masa molar se conoce por otra medida (densidad de un gas, espectrometría de masas, etc.).'],
    limites: 'Si la masa molar medida es poco precisa, el cociente puede quedar lejos de un entero y la fórmula será dudosa.',
    ejemplos: ['ej-est-formula-molecular', 'ej-est-formula-molecular-2'],
    figuras: ['fig-est-composicion-alcanos'],
    resumen: ['La fórmula molecular es un múltiplo entero de la empírica.', 'n = masa molar / masa de la fórmula empírica.', 'Compuestos distintos pueden compartir fórmula empírica.', 'La masa molar debe conocerse por otra medida.'],
    glosario: [RENG_G7.molecular, RENG_G7.empirica],
    comprobar: [
      rengPreg('Un compuesto tiene fórmula empírica CH₂ y masa molar 42 g/mol. ¿Cuál es su fórmula molecular?', ['C₃H₆', true, 'Correcto: CH₂ pesa unos 14 g/mol y 42/14 = 3.'], ['CH₂', false, 'Esa es la empírica; su masa (14) no coincide con la molar (42).'], ['C₆H₁₂', false, 'Esa tendría masa molar 84 g/mol, el doble de la dada.']),
      rengPreg('¿Qué dato adicional hace falta, además del análisis, para obtener la fórmula molecular?', ['La masa molar', true, 'Correcto: con ella se calcula cuántas unidades empíricas forman la molécula.'], ['La densidad del sólido', false, 'La densidad de un sólido no da por sí sola la masa molar.'], ['El color del compuesto', false, 'El color no informa del número de átomos.']),
      rengPreg('El benceno (C₆H₆) y el acetileno (C₂H₂), ¿qué fórmula empírica comparten?', ['CH', true, 'Correcto: en los dos la proporción de C a H es 1 : 1.'], ['C₂H₂', false, 'Es la molecular del acetileno, no la proporción más sencilla.'], ['C₃H₃', false, 'No es la proporción entera más sencilla: se puede dividir entre 3.'])
    ],
    anterior: 'n1-b7-s7',
    siguiente: 'n1-b7-s9',
    prerrequisitos: ['n1-b7-s7'],
    fuentes: [rengSeccionEsteq(RENG_S32, 'la fórmula molecular'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Masa molar medida sin error.',
    metodo: 'masa de la unidad empírica sumada a mano y redondeo del cociente'
  }),
  rengLeccionN1({
    id: 'est-mol-mol',
    subtema: 'n1-b7-s9',
    nombre: 'Relaciones mol-mol',
    pregunta: '¿Qué dicen los coeficientes de una ecuación química?',
    objetivo: 'Usar los coeficientes de una ecuación ajustada como razones molares entre reactivos y productos.',
    objetivosMas: ['Comprobar una razón molar contando átomos a los dos lados de la ecuación.'],
    porQueImporta: 'Toda la estequiometría se apoya en esta idea: una ecuación ajustada es una receta en moles. Sabiendo cuántos moles de una sustancia intervienen, los coeficientes dan los de todas las demás, ya se trate de combustible y oxígeno en un motor o de nitrógeno e hidrógeno en una planta de amoníaco.',
    idea: 'En una ecuación ajustada, los coeficientes indican en qué proporción de moles reaccionan y se forman las sustancias. En N₂ + 3 H₂ → 2 NH₃, por cada mol de N₂ reaccionan 3 de H₂ y se forman 2 de NH₃. Cualquier par de coeficientes da una razón molar, que convierte moles de una especie en moles de otra. La razón solo vale si la ecuación está ajustada.',
    imagen: 'Para montar 2 bicicletas hacen falta 4 ruedas y 2 cuadros: la «ecuación» 2 cuadros + 4 ruedas → 2 bicicletas da las proporciones.',
    analogia: 'Los coeficientes son como las cantidades de una receta: si la receta pide 3 huevos por cada taza de harina, con 2 tazas hacen falta 6 huevos.',
    analogiaLimite: 'En una receta se puede poner un huevo de más y sale igual; en una reacción, lo que sobra de un reactivo queda sin reaccionar (reactivo en exceso, subtema 14).',
    errores: [
      ['Usar los coeficientes como proporción de masas.', 'Los coeficientes son proporciones de moles; para masas hay que pasar por las masas molares (subtema 10).'],
      ['Usar una ecuación sin ajustar.', 'Sin ajustar, los coeficientes no conservan los átomos y las razones molares son falsas.']
    ],
    ecs: [
      ['Razón molar', 'n_B = n_A · ν_B / ν_A', 'Moles de B a partir de moles de A con los coeficientes ν.', String.raw`n_B = n_A \cdot \frac{\nu_B}{\nu_A}`],
      ['Avance de reacción', 'ξ = Δn_i / ν_i', 'Todas las especies cambian en proporción a su coeficiente.', String.raw`\xi = \frac{\Delta n_i}{\nu_i}`]
    ],
    vars: [['ν', 'coeficiente estequiométrico', 'sin unidad'], ['n', 'cantidad de sustancia', 'mol'], ['ξ', 'avance de reacción', 'mol']],
    supuestos: ['Ecuación ajustada.', 'La reacción ocurre tal como está escrita, sin reacciones secundarias.'],
    limites: 'Las razones molares dicen cuánto reacciona si la reacción ocurre; no dicen si ocurre, cuánto tarda ni si llega al equilibrio.',
    ejemplos: ['ej-est-mol-mol', 'ej-est-mol-mol-2'],
    figuras: ['fig-est-proporcion'],
    resumen: ['Los coeficientes de una ecuación ajustada son razones molares.', 'n_B = n_A · ν_B/ν_A.', 'No son razones de masas.', 'La ecuación debe estar ajustada.'],
    glosario: [RENG_G7.coeficiente, RENG_G7.razonMolar, RENG_G7.avance],
    comprobar: [
      rengPreg('En 2 H₂ + O₂ → 2 H₂O, ¿cuántos moles de O₂ reaccionan con 6 mol de H₂?', ['3 mol', true, 'Correcto: la razón es 1 O₂ : 2 H₂.'], ['6 mol', false, 'Ese resultado supone una razón 1 : 1, pero el coeficiente del H₂ es 2.'], ['12 mol', false, 'Ese resultado multiplica por 2 en lugar de dividir.']),
      rengPreg('¿Qué representan los coeficientes de una ecuación ajustada?', ['Proporciones de moles', true, 'Correcto: también de moléculas, pero nunca de gramos.'], ['Proporciones de masas', false, 'Las masas de las especies son distintas; los coeficientes cuentan entidades, no gramos.'], ['Velocidades de reacción', false, 'Los coeficientes no informan de la rapidez de la reacción.']),
      rengPreg('¿Por qué hay que ajustar la ecuación antes de usar razones molares?', ['Porque sin ajustar no se conservan los átomos', true, 'Correcto: solo la ecuación ajustada respeta la conservación y da proporciones correctas.'], ['Porque así la reacción va más deprisa', false, 'Ajustar es una operación sobre el papel; no cambia la rapidez de la reacción.'], ['Porque los coeficientes deben ser iguales', false, 'Los coeficientes ajustados suelen ser distintos; lo que se iguala es el número de átomos.'])
    ],
    anterior: 'n1-b7-s8',
    siguiente: 'n1-b7-s10',
    prerrequisitos: ['n1-b7-s1'],
    escena: { id: 'reactivo-limitante', valores: { r: 1, n1: 2, n2: 6, rend: 100 }, instruccion: 'Con la síntesis del amoníaco y proporción exacta (2 mol de N₂ y 6 de H₂), comprueba que se forman 4 mol de NH₃: la razón molar 1 : 3 : 2 en acción.', limite: 'La escena hace las cuentas de una ecuación ajustada con dos reactivos: no dice si la reacción ocurre ni cuánto tarda, y el rendimiento es un dato que tú eliges.' },
    fuentes: [rengSeccionEsteq(RENG_S43, 'las razones molares')],
    idealizado: 'Reacción completa, tal como está escrita.',
    metodo: 'avance de reacción calculado con la función del núcleo'
  }),
  rengLeccionN1({
    id: 'est-masa-masa',
    subtema: 'n1-b7-s10',
    nombre: 'Relaciones masa-masa',
    pregunta: '¿Cuántos gramos de producto salen de unos gramos de reactivo?',
    objetivo: 'Calcular la masa de un producto o de un reactivo a partir de la masa de otro con el camino masa → mol → mol → masa.',
    objetivosMas: ['Comprobar un resultado con la conservación de la masa o de un elemento.'],
    porQueImporta: 'En la industria y en el laboratorio se compran, pesan y venden sustancias por su masa. Saber cuántos kilos de producto da una tonelada de materia prima, o cuánto CO₂ emite un depósito de combustible, exige convertir masas en masas pasando por los moles.',
    idea: 'Como los coeficientes son proporciones de moles, un cálculo masa-masa siempre pasa por moles: se convierte la masa conocida en moles con su masa molar, se aplica la razón molar de la ecuación y se convierte el resultado en masa con la masa molar de la otra sustancia. Es el camino masa → mol → (razón) → mol → masa. Una comprobación útil es la conservación: la masa de reactivos que reaccionan es igual a la de productos formados.',
    imagen: 'Quemar 1 kg de propano produce unos 3 kg de CO₂: el carbono del combustible se lleva consigo oxígeno del aire.',
    analogia: 'Es como cambiar dinero de una moneda a otra pasando por una tercera: euros → dólares → yenes. No hay tipo de cambio directo entre gramos de dos sustancias, pero sí a través de los moles.',
    analogiaLimite: 'En el cambio de moneda se pierde una comisión; en la conversión química no se pierde nada: si la reacción es completa, la masa total se conserva exactamente.',
    errores: [
      ['Aplicar la razón de coeficientes directamente a los gramos.', 'Primero hay que pasar los gramos a moles; los coeficientes no relacionan masas.'],
      ['Usar la masa molar de la sustancia equivocada en el último paso.', 'Para volver a gramos se usa la masa molar de la sustancia buscada, no la del dato.']
    ],
    ecs: [
      ['Camino masa-masa', 'm_B = (m_A / M_A) · (ν_B / ν_A) · M_B', 'Masa a moles, razón molar y moles a masa.', String.raw`m_B = \frac{m_A}{M_A} \cdot \frac{\nu_B}{\nu_A} \cdot M_B`],
      ['Conservación de la masa', 'Σ m(reactivos que reaccionan) = Σ m(productos)', 'Comprobación independiente.', String.raw`\sum m_{\mathrm{reactivos}} = \sum m_{\mathrm{productos}}`]
    ],
    vars: [['m', 'masa', 'g'], ['M', 'masa molar', 'g/mol'], ['ν', 'coeficiente', 'sin unidad']],
    supuestos: ['Reacción completa del reactivo considerado.', 'Masas molares de la tabla de la app.'],
    limites: 'Supone que todo el reactivo reacciona según la ecuación; en la práctica hay limitantes, pérdidas y reacciones secundarias (subtemas 13–17).',
    ejemplos: ['ej-est-masa-masa', 'ej-est-masa-masa-2'],
    figuras: ['fig-est-proporcion'],
    resumen: ['Un cálculo masa-masa pasa siempre por moles.', 'm_B = (m_A/M_A)·(ν_B/ν_A)·M_B.', 'La masa total se conserva en la reacción.', 'La conservación de un elemento da una comprobación rápida.'],
    glosario: [RENG_G7.conservacion, RENG_G7.razonMolar],
    comprobar: [
      rengPreg('En 2 H₂ + O₂ → 2 H₂O, ¿cuántos gramos de agua forman 4 g de H₂ con oxígeno suficiente?', ['Unos 36 g', true, 'Correcto: 4 g son unos 2 mol de H₂, que dan 2 mol de agua, unos 36 g.'], ['4 g', false, 'La masa de agua no es igual a la del hidrógeno: el agua incluye el oxígeno.'], ['Unos 72 g', false, 'Ese resultado duplica de más: la razón H₂ : H₂O es 1 : 1 en moles.']),
      rengPreg('¿Por qué un cálculo masa-masa debe pasar por moles?', ['Porque los coeficientes son proporciones de moles', true, 'Correcto: las masas de moléculas distintas no siguen los coeficientes.'], ['Porque las balanzas miden moles', false, 'Las balanzas miden masas; por eso hay que convertirlas.'], ['Porque los moles siempre son menores que los gramos', false, 'No es una cuestión de tamaño de los números, sino de qué relaciona la ecuación.']),
      rengPreg('Quemar 1 kg de combustible da unos 3 kg de CO₂. ¿Cómo puede haber más masa de producto?', ['Porque el producto incorpora oxígeno del aire', true, 'Correcto: la masa total se conserva contando también el oxígeno que reacciona.'], ['Porque la reacción crea masa', false, 'En una reacción química la masa total se conserva.'], ['Porque el CO₂ es un gas', false, 'Ser gas no añade masa; la masa extra viene del oxígeno consumido.'])
    ],
    anterior: 'n1-b7-s9',
    siguiente: 'n1-b7-s11',
    prerrequisitos: ['n1-b7-s3', 'n1-b7-s9'],
    escena: { id: 'reactivo-limitante', valores: { r: 2, n1: 1, n2: 5, rend: 100 }, instruccion: 'Con la combustión del metano y oxígeno en exceso, mira la masa teórica del CO₂ y la lectura «Masa consumida − masa formada»: vale cero, la masa se conserva.', limite: 'La escena hace las cuentas de una ecuación ajustada con dos reactivos: no dice si la reacción ocurre ni cuánto tarda, y el rendimiento es un dato que tú eliges.' },
    fuentes: [rengSeccionEsteq(RENG_S43, 'los cálculos masa-masa'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Reacción completa sin pérdidas.',
    metodo: 'conservación del carbono o de la masa total'
  }),
  rengLeccionN1({
    id: 'est-masa-mol',
    subtema: 'n1-b7-s11',
    nombre: 'Relaciones masa-mol',
    pregunta: '¿Cómo se pasa de gramos de una sustancia a moles de otra?',
    objetivo: 'Calcular los moles de una especie a partir de la masa de otra, y la masa necesaria para obtener unos moles dados.',
    objetivosMas: ['Elegir en qué sentido aplicar la masa molar según el dato y la incógnita.'],
    porQueImporta: 'Muchas veces se conoce la masa de un reactivo y se necesita la cantidad de producto en moles (para calcular un volumen de gas, una concentración o una energía), o al revés. Es el mismo camino que el masa-masa, pero detenido a mitad.',
    idea: 'Para pasar de la masa de A a los moles de B se convierte la masa en moles (n_A = m_A/M_A) y se aplica la razón molar. Para el camino inverso, moles de B → masa de A, se aplica la razón molar al revés y se multiplica por la masa molar de A. La masa molar solo se usa una vez, con la sustancia cuya masa interviene.',
    imagen: 'Un trozo de 5 g de hidrógeno, al arder, da unos 2,5 mol de agua.',
    analogia: 'Es como un viaje con transbordo en el que se baja en la estación intermedia: el trayecto masa → mol → mol se detiene antes del último tramo.',
    analogiaLimite: 'En un viaje no importa el sentido; aquí sí: en un sentido se divide entre la masa molar y en el otro se multiplica.',
    errores: [
      ['Usar la masa molar de B cuando el dato es la masa de A.', 'La masa molar se aplica a la sustancia cuya masa se conoce o se busca.'],
      ['Invertir la razón molar al pasar de una especie a otra.', 'Escribe la razón con la incógnita arriba: n_B = n_A · ν_B/ν_A.']
    ],
    ecs: [
      ['De masa de A a moles de B', 'n_B = (m_A / M_A) · (ν_B / ν_A)', 'Un solo uso de la masa molar.', String.raw`n_B = \frac{m_A}{M_A} \cdot \frac{\nu_B}{\nu_A}`],
      ['De moles de B a masa de A', 'm_A = n_B · (ν_A / ν_B) · M_A', 'El camino inverso.', String.raw`m_A = n_B \cdot \frac{\nu_A}{\nu_B} \cdot M_A`]
    ],
    vars: [['m_A', 'masa de A', 'g'], ['n_B', 'moles de B', 'mol'], ['M_A', 'masa molar de A', 'g/mol']],
    supuestos: ['Reacción completa según la ecuación ajustada.'],
    limites: 'Igual que en los demás cálculos estequiométricos: no considera rendimientos ni reacciones secundarias.',
    ejemplos: ['ej-est-masa-mol', 'ej-est-masa-mol-2'],
    figuras: ['fig-est-proporcion'],
    resumen: ['Masa de A → moles de A → moles de B.', 'O al revés: moles de B → moles de A → masa de A.', 'La masa molar se usa con la sustancia cuya masa interviene.', 'La razón molar se escribe con la incógnita arriba.'],
    glosario: [RENG_G7.razonMolar, RENG_G7.masaMolar],
    comprobar: [
      rengPreg('En 2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂, ¿cuántos moles de CO₂ dan 0,40 mol de NaHCO₃?', ['0,20 mol', true, 'Correcto: la razón es 1 CO₂ : 2 NaHCO₃.'], ['0,40 mol', false, 'Ese resultado supone razón 1 : 1, pero el coeficiente del bicarbonato es 2.'], ['0,80 mol', false, 'Ese resultado multiplica por 2 en lugar de dividir.']),
      rengPreg('Para obtener moles de producto a partir de gramos de reactivo, ¿qué masa molar se usa?', ['La del reactivo', true, 'Correcto: sirve para pasar sus gramos a moles; luego basta la razón molar.'], ['La del producto', false, 'La del producto solo haría falta si se pidiera su masa.'], ['Las dos', false, 'Como el resultado se pide en moles, la masa molar del producto no interviene.']),
      rengPreg('Si se duplican los gramos de reactivo, ¿qué pasa con los moles de producto?', ['Se duplican', true, 'Correcto: todas las relaciones son proporcionales.'], ['No cambian', false, 'Con más reactivo se forma más producto, en la misma proporción.'], ['Se reducen a la mitad', false, 'No hay ninguna relación inversa en este cálculo.'])
    ],
    anterior: 'n1-b7-s10',
    siguiente: 'n1-b7-s12',
    prerrequisitos: ['n1-b7-s3', 'n1-b7-s9'],
    escena: { id: 'reactivo-limitante', valores: { r: 0, n1: 2.5, n2: 5, rend: 100 }, instruccion: 'Con la formación del agua y 2,5 mol de H₂ con oxígeno suficiente, lee los moles de agua: 2,5 mol, la razón 2 : 2 de la ecuación.', limite: 'La escena hace las cuentas de una ecuación ajustada con dos reactivos: no dice si la reacción ocurre ni cuánto tarda, y el rendimiento es un dato que tú eliges.' },
    fuentes: [rengSeccionEsteq(RENG_S43, 'los cálculos masa-mol'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Reacción completa.',
    metodo: 'conservación del hidrógeno o de la masa total'
  })
]
