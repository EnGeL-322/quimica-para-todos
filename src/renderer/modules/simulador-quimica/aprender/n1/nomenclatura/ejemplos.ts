import { rengPorSimbolo } from '../../../../tabla-periodica/data'
import { rengAnalizarFormula } from '../../../nucleo/formula'
import { rengFormularDesdeNombre } from '../../../nucleo/nomenclatura'
import type { RengEjemploN1 } from '../tipos'
import { rengTx } from '../estequiometria/datos'
import { rengEstadoDe, rengMmNom } from './comun'

const T = { rel: 0.005, abs: 1e-12 }
const ej = (rengE: Omit<RengEjemploN1, 'tolerancia' | 'cifras'> & { cifras?: number }): RengEjemploN1 => ({ cifras: 3, tolerancia: T, ...rengE })
const A = (rengEl: string): number => rengPorSimbolo.get(rengEl)!.masa
const atomos = (rengF: string): number => [...rengAnalizarFormula(rengF).atomos.values()].reduce((rengS, rengN) => rengS + rengN, 0)
const deEl = (rengF: string, rengEl: string): number => rengAnalizarFormula(rengF).atomos.get(rengEl) ?? 0
const dNombre = (rengN: string): string => rengFormularDesdeNombre(rengN).formula

export const RENG_EJEMPLOS_NOMENCLATURA: readonly RengEjemploN1[] = [
  ej({ id: 'ej-no-simbolos', titulo: 'Átomos de una fórmula', enunciado: 'El fosfato de calcio tiene la fórmula Ca₃(PO₄)₂.', pregunta: '¿Cuántos átomos hay en una fórmula?', datos: [['Fórmula', 'Ca₃(PO₄)₂']], unidad: '',
    analitico: () => 3 + 2 * (1 + 4), segundo: () => atomos('Ca3(PO4)2'), metodoSegundo: 'analizador de fórmulas del núcleo',
    pasos: (rengR) => ['El subíndice 2 del paréntesis multiplica todo lo que hay dentro: 2 P y 8 O.', `Total: 3 Ca + 2 P + 8 O = ${rengTx(rengR)} átomos.`], pistas: ['Cuenta los átomos de cada símbolo.', 'El subíndice del paréntesis multiplica.', 'Suma todos los átomos.'] }),
  ej({ id: 'ej-no-oxidacion', titulo: 'Cromo en el dicromato de potasio', enunciado: 'El dicromato de potasio es K₂Cr₂O₇. El K actúa con +1 y el O con −2.', pregunta: '¿Cuál es el número de oxidación del cromo?', datos: [['K', '+1'], ['O', '−2'], ['Carga total', '0']], unidad: '',
    analitico: () => (0 - 2 * 1 - 7 * -2) / 2, segundo: () => rengEstadoDe('K2Cr2O7', 'Cr'), metodoSegundo: 'regla de suma cero del núcleo',
    pasos: (rengR) => ['La suma de números de oxidación es 0: 2(+1) + 2x + 7(−2) = 0.', `x = ${rengTx(rengR)}.`], pistas: ['La suma debe ser cero.', 'Multiplica por los subíndices.', 'Despeja el del cromo.'] }),
  ej({ id: 'ej-no-sistematica', titulo: 'Prefijos de un nombre sistemático', enunciado: 'Un compuesto se llama «pentaóxido de difósforo».', pregunta: '¿Cuántos átomos de oxígeno hay en su fórmula?', datos: [['Nombre', 'pentaóxido de difósforo']], unidad: '',
    analitico: () => 5, segundo: () => deEl(dNombre('pentaóxido de difósforo'), 'O'), metodoSegundo: 'formulación desde el nombre con el módulo de nomenclatura del núcleo',
    pasos: (rengR) => ['«penta» indica 5 y «di» indica 2: P₂O₅.', `Oxígenos: ${rengTx(rengR)}.`], pistas: ['Identifica los prefijos.', 'penta = 5, di = 2.', 'El prefijo va delante de cada elemento.'] }),
  ej({ id: 'ej-no-stock', titulo: 'El número romano de Stock', enunciado: 'Un compuesto se llama «óxido de hierro(III)».', pregunta: '¿Con qué número de oxidación actúa el hierro?', datos: [['Nombre', 'óxido de hierro(III)']], unidad: '',
    analitico: () => 3, segundo: () => rengEstadoDe(dNombre('óxido de hierro(III)'), 'Fe'), metodoSegundo: 'formulación desde el nombre y regla de suma cero del núcleo',
    pasos: (rengR) => ['En Stock, el número romano es el número de oxidación del metal.', `III = ${rengTx(rengR)}: la fórmula es Fe₂O₃.`], pistas: ['Lee el número romano.', 'Es el número de oxidación.', 'Cruza las cargas para la fórmula.'] }),
  ej({ id: 'ej-no-tradicional', titulo: 'Sufijo -ico', enunciado: 'El hierro actúa con +2 y +3. Un compuesto se llama «óxido férrico».', pregunta: '¿Con qué número de oxidación actúa el hierro?', datos: [['Valencias del Fe', '+2 y +3'], ['Sufijo', '-ico']], unidad: '',
    analitico: () => 3, segundo: () => rengEstadoDe(dNombre('óxido férrico'), 'Fe'), metodoSegundo: 'formulación desde el nombre tradicional con el núcleo',
    pasos: (rengR) => ['Con dos valencias, -oso es la menor y -ico la mayor.', `«férrico» → +${rengTx(rengR)}.`], pistas: ['¿Cuántas valencias tiene el elemento?', '-ico es la mayor.', '-oso es la menor.'] }),
  ej({ id: 'ej-no-oxido-metal', titulo: 'Masa fórmula del óxido de aluminio', enunciado: 'El aluminio actúa con +3 y el oxígeno con −2.', pregunta: '¿Cuál es la masa fórmula del óxido de aluminio, en g/mol?', datos: [['Al', `+3, ${rengTx(A('Al'), 5)} g/mol`], ['O', `−2, ${rengTx(A('O'), 5)} g/mol`]], unidad: 'g/mol',
    analitico: () => 2 * A('Al') + 3 * A('O'), segundo: () => rengMmNom(dNombre('óxido de aluminio')), metodoSegundo: 'formulación desde el nombre y masa molar del núcleo',
    pasos: (rengR) => ['Cargas cruzadas: Al₂O₃.', `M = 2 × ${rengTx(A('Al'), 5)} + 3 × ${rengTx(A('O'), 5)} = ${rengTx(rengR, 5)} g/mol.`], pistas: ['Cruza las cargas.', 'Escribe Al₂O₃.', 'Suma las masas atómicas.'] }),
  ej({ id: 'ej-no-oxido-nometal', titulo: 'Nitrógeno en el pentaóxido', enunciado: 'El pentaóxido de dinitrógeno es N₂O₅.', pregunta: '¿Cuál es el número de oxidación del nitrógeno?', datos: [['Fórmula', 'N₂O₅'], ['O', '−2']], unidad: '',
    analitico: () => (0 - 5 * -2) / 2, segundo: () => rengEstadoDe('N2O5', 'N'), metodoSegundo: 'regla de suma cero del núcleo',
    pasos: (rengR) => ['2x + 5(−2) = 0.', `x = +${rengTx(rengR)}: óxido de nitrógeno(V).`], pistas: ['La suma es cero.', 'El O vale −2.', 'Divide entre los dos N.'] }),
  ej({ id: 'ej-no-peroxido', titulo: 'Oxígeno en un peróxido', enunciado: 'El agua oxigenada es el peróxido de hidrógeno, H₂O₂.', pregunta: '¿Cuál es el número de oxidación del oxígeno?', datos: [['Fórmula', 'H₂O₂'], ['H', '+1']], unidad: '',
    analitico: () => (0 - 2 * 1) / 2, segundo: () => rengEstadoDe('H2O2', 'O'), metodoSegundo: 'regla de suma cero del núcleo',
    pasos: (rengR) => ['2(+1) + 2x = 0.', `x = ${rengTx(rengR)}: en los peróxidos el oxígeno actúa con −1.`], pistas: ['El H actúa con +1.', 'La suma es cero.', 'Hay dos oxígenos.'] }),
  ej({ id: 'ej-no-hidruro', titulo: 'Hidrógeno en un hidruro metálico', enunciado: 'El hidruro de sodio es NaH.', pregunta: '¿Cuál es el número de oxidación del hidrógeno?', datos: [['Fórmula', 'NaH'], ['Na', '+1']], unidad: '',
    analitico: () => 0 - 1, segundo: () => rengEstadoDe('NaH', 'H'), metodoSegundo: 'regla de prioridad del núcleo (alcalino +1 primero)',
    pasos: (rengR) => ['El Na, alcalino, actúa con +1.', `H = ${rengTx(rengR)}: en los hidruros metálicos el H es −1.`], pistas: ['¿Quién es el metal?', 'El alcalino actúa con +1.', 'La suma es cero.'] }),
  ej({ id: 'ej-no-hidroxido', titulo: 'Masa fórmula de un hidróxido', enunciado: 'El calcio actúa con +2 y el ion hidróxido es OH⁻.', pregunta: '¿Cuál es la masa fórmula del hidróxido de calcio, en g/mol?', datos: [['Ca²⁺', `${rengTx(A('Ca'), 5)} g/mol`], ['OH⁻', 'O + H']], unidad: 'g/mol',
    analitico: () => A('Ca') + 2 * (A('O') + A('H')), segundo: () => rengMmNom(dNombre('hidróxido de calcio')), metodoSegundo: 'formulación desde el nombre y masa molar del núcleo',
    pasos: (rengR) => ['Un Ca²⁺ necesita dos OH⁻: Ca(OH)₂.', `M = ${rengTx(rengR, 5)} g/mol.`], pistas: ['¿Cuántos OH⁻ necesita el Ca²⁺?', 'Escribe el paréntesis.', 'Suma las masas.'] }),
  ej({ id: 'ej-no-hidracido', titulo: 'Azufre en el sulfuro de hidrógeno', enunciado: 'El sulfuro de hidrógeno (en agua, ácido sulfhídrico) es H₂S.', pregunta: '¿Cuál es el número de oxidación del azufre?', datos: [['Fórmula', 'H₂S'], ['H', '+1']], unidad: '',
    analitico: () => 0 - 2 * 1, segundo: () => rengEstadoDe('H2S', 'S'), metodoSegundo: 'regla de suma cero del núcleo',
    pasos: (rengR) => ['2(+1) + x = 0.', `x = ${rengTx(rengR)}.`], pistas: ['El H actúa con +1.', 'La suma es cero.', 'Despeja el del S.'] }),
  ej({ id: 'ej-no-oxoacido', titulo: 'Fósforo en el ácido fosfórico', enunciado: 'El ácido fosfórico es H₃PO₄.', pregunta: '¿Cuál es el número de oxidación del fósforo?', datos: [['H', '+1'], ['O', '−2']], unidad: '',
    analitico: () => 0 - 3 * 1 - 4 * -2, segundo: () => rengEstadoDe('H3PO4', 'P'), metodoSegundo: 'regla de suma cero del núcleo',
    pasos: (rengR) => ['3(+1) + x + 4(−2) = 0.', `x = +${rengTx(rengR)}.`], pistas: ['La suma debe ser cero.', 'H +1 y O −2.', 'Despeja el P.'] }),
  ej({ id: 'ej-no-sal-binaria', titulo: 'Masa fórmula del sulfuro de sodio', enunciado: 'El sodio actúa con +1 y el azufre, en los sulfuros, con −2.', pregunta: '¿Cuál es la masa fórmula del sulfuro de sodio, en g/mol?', datos: [['Na⁺', `${rengTx(A('Na'), 5)} g/mol`], ['S²⁻', `${rengTx(A('S'), 5)} g/mol`]], unidad: 'g/mol',
    analitico: () => 2 * A('Na') + A('S'), segundo: () => rengMmNom(dNombre('sulfuro de sodio')), metodoSegundo: 'formulación desde el nombre y masa molar del núcleo',
    pasos: (rengR) => ['Dos Na⁺ por cada S²⁻: Na₂S.', `M = ${rengTx(rengR, 5)} g/mol.`], pistas: ['Cruza las cargas.', 'Escribe Na₂S.', 'Suma las masas.'] }),
  ej({ id: 'ej-no-oxisal', titulo: 'Azufre en el sulfato de sodio', enunciado: 'El sulfato de sodio es Na₂SO₄.', pregunta: '¿Cuál es el número de oxidación del azufre?', datos: [['Na', '+1'], ['O', '−2']], unidad: '',
    analitico: () => 0 - 2 * 1 - 4 * -2, segundo: () => rengEstadoDe('Na2SO4', 'S'), metodoSegundo: 'regla de suma cero del núcleo',
    pasos: (rengR) => ['2(+1) + x + 4(−2) = 0.', `x = +${rengTx(rengR)}: sulfato, del ácido sulfúrico.`], pistas: ['La suma debe ser cero.', 'Na +1 y O −2.', 'Despeja el S.'] }),
  ej({ id: 'ej-no-sal-acida', titulo: 'Masa fórmula del bicarbonato', enunciado: 'El hidrogenocarbonato de sodio (bicarbonato) es NaHCO₃.', pregunta: '¿Cuál es su masa fórmula, en g/mol?', datos: [['Fórmula', 'NaHCO₃']], unidad: 'g/mol',
    analitico: () => A('Na') + A('H') + A('C') + 3 * A('O'), segundo: () => rengMmNom(dNombre('hidrogenocarbonato de sodio')), metodoSegundo: 'formulación desde el nombre y masa molar del núcleo',
    pasos: (rengR) => ['El anión HCO₃⁻ conserva un H del ácido carbónico.', `M = ${rengTx(rengR, 5)} g/mol.`], pistas: ['Identifica el anión con hidrógeno.', 'Cuenta cada átomo.', 'Suma las masas.'] }),
  ej({ id: 'ej-no-sal-basica', titulo: 'Masa fórmula de una sal básica', enunciado: 'El hidroxicloruro de magnesio (cloruro básico de magnesio) es Mg(OH)Cl.', pregunta: '¿Cuál es su masa fórmula, en g/mol?', datos: [['Fórmula', 'Mg(OH)Cl']], unidad: 'g/mol',
    analitico: () => A('Mg') + A('O') + A('H') + A('Cl'), segundo: () => rengMmNom('Mg(OH)Cl'), metodoSegundo: 'masa molar del analizador de fórmulas del núcleo',
    pasos: (rengR) => ['La sal básica contiene OH⁻ y Cl⁻ con el Mg²⁺: cargas 2+ = 1− + 1−.', `M = ${rengTx(rengR, 5)} g/mol.`], pistas: ['Comprueba la neutralidad.', 'Cuenta los átomos.', 'Suma las masas.'] }),
  ej({ id: 'ej-no-hidrato', titulo: 'Agua en un hidrato', enunciado: 'El sulfato de cobre(II) pentahidratado es CuSO₄·5H₂O.', pregunta: '¿Qué porcentaje de su masa es agua?', datos: [['Fórmula', 'CuSO₄·5H₂O']], unidad: '%',
    analitico: () => (100 * 5 * rengMmNom('H2O')) / (rengMmNom('CuSO4') + 5 * rengMmNom('H2O')), segundo: () => (100 * 5 * (2 * A('H') + A('O'))) / rengMmNom(dNombre('sulfato de cobre(II) pentahidratado')), metodoSegundo: 'formulación desde el nombre del hidrato y masas atómicas',
    pasos: (rengR) => ['«penta» indica 5 moléculas de agua por fórmula.', `% agua = 5·M(H₂O)/M(hidrato) × 100 = ${rengTx(rengR)} %.`], pistas: ['Lee el prefijo del hidrato.', 'Calcula la masa del agua.', 'Divide entre la masa total.'] }),
  ej({ id: 'ej-no-formula', titulo: 'Átomos del sulfato de amonio', enunciado: 'El sulfato de amonio es (NH₄)₂SO₄.', pregunta: '¿Cuántos átomos hay en una fórmula?', datos: [['Fórmula', '(NH₄)₂SO₄']], unidad: '',
    analitico: () => 2 * (1 + 4) + 1 + 4, segundo: () => atomos(dNombre('sulfato de amonio')), metodoSegundo: 'formulación desde el nombre y analizador de fórmulas',
    pasos: (rengR) => ['El 2 multiplica al amonio: 2 N y 8 H.', `Total: 2 + 8 + 1 + 4 = ${rengTx(rengR)} átomos.`], pistas: ['Desarrolla el paréntesis.', 'Cuenta el anión.', 'Suma todos los átomos.'] }),
  ej({ id: 'ej-no-formulacion', titulo: 'Formular el sulfato de aluminio', enunciado: 'El catión es Al³⁺ y el anión, SO₄²⁻.', pregunta: '¿Cuántos átomos de oxígeno hay en una fórmula del compuesto?', datos: [['Catión', 'Al³⁺'], ['Anión', 'SO₄²⁻']], unidad: '',
    analitico: () => 3 * 4, segundo: () => deEl(dNombre('sulfato de aluminio'), 'O'), metodoSegundo: 'formulación desde el nombre con el núcleo',
    pasos: (rengR) => ['Cargas cruzadas: Al₂(SO₄)₃ (2·3 = 3·2).', `O = 3 × 4 = ${rengTx(rengR)}.`], pistas: ['Cruza las cargas.', 'Usa paréntesis para el anión.', 'Multiplica los oxígenos.'] }),
  ej({ id: 'ej-no-interpretar', titulo: 'Del nombre a la masa', enunciado: 'Un frasco dice «nitrato de calcio».', pregunta: '¿Cuál es la masa fórmula del compuesto, en g/mol?', datos: [['Nombre', 'nitrato de calcio'], ['Iones', 'Ca²⁺ y NO₃⁻']], unidad: 'g/mol',
    analitico: () => A('Ca') + 2 * (A('N') + 3 * A('O')), segundo: () => rengMmNom(dNombre('nitrato de calcio')), metodoSegundo: 'formulación desde el nombre y masa molar del núcleo',
    pasos: (rengR) => ['Nitrato es NO₃⁻ y el calcio Ca²⁺: Ca(NO₃)₂.', `M = ${rengTx(rengR, 5)} g/mol.`], pistas: ['Identifica el anión del nombre.', 'Cruza las cargas.', 'Suma las masas.'] })
]

