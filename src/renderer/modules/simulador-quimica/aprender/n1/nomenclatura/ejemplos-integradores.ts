import { rengPorSimbolo } from '../../../../tabla-periodica/data'
import { rengAnalizarFormula } from '../../../nucleo/formula'
import { rengFormularDesdeNombre } from '../../../nucleo/nomenclatura'
import { rengLecturasFormulaIonica } from '../../../escenas-n1/modelos/formula-ionica'
import { rengBiseccion } from '../numericos'
import type { RengEjemploN1 } from '../tipos'
import { rengTx } from '../estequiometria/datos'
import { rengEstadoDe, rengMmNom } from './comun'

const T = { rel: 0.005, abs: 1e-12 }
const ej = (rengE: Omit<RengEjemploN1, 'tolerancia' | 'cifras'> & { cifras?: number }): RengEjemploN1 => ({ cifras: 3, tolerancia: T, ...rengE })
const A = (rengEl: string): number => rengPorSimbolo.get(rengEl)!.masa
const deEl = (rengF: string, rengEl: string): number => rengAnalizarFormula(rengF).atomos.get(rengEl) ?? 0
const dNombre = (rengN: string): string => rengFormularDesdeNombre(rengN).formula
const pct = (rengF: string, rengEl: string): number => (100 * deEl(rengF, rengEl) * A(rengEl)) / rengMmNom(rengF)

export const RENG_EJEMPLOS_NOMENCLATURA_INTEGRADORES: readonly RengEjemploN1[] = [
  ej({ id: 'ej-no-simbolos-2', titulo: 'Hierro en una muestra de óxido', enunciado: `Una muestra de 50,0 g de Fe₂O₃. Masas de la tabla de la app: Fe ${rengTx(A('Fe'), 5)}, O ${rengTx(A('O'), 5)} g/mol.`, pregunta: '¿Qué masa de hierro contiene, en g?', datos: [['Muestra', '50,0 g de Fe₂O₃']], unidad: 'g',
    analitico: () => (50 * 2 * A('Fe')) / (2 * A('Fe') + 3 * A('O')), segundo: () => (50 * pct('Fe2O3', 'Fe')) / 100, metodoSegundo: 'porcentaje en masa del Fe calculado con el analizador del núcleo',
    pasos: (rengR) => ['Los símbolos y subíndices dicen que hay 2 Fe por fórmula (subtema 1).', `m(Fe) = 50,0 × 2·M(Fe)/M(Fe₂O₃) = ${rengTx(rengR)} g (bloque 7).`], pistas: ['¿Cuántos Fe hay por fórmula?', 'Calcula la fracción en masa del Fe.', 'Multiplica por la masa de la muestra.'] }),
  ej({ id: 'ej-no-oxidacion-2', titulo: 'Manganeso en el permanganato', enunciado: 'El permanganato de potasio es KMnO₄.', pregunta: '¿Cuál es el número de oxidación del manganeso?', datos: [['K', '+1'], ['O', '−2']], unidad: '',
    analitico: () => 0 - 1 - 4 * -2, segundo: () => rengEstadoDe('KMnO4', 'Mn'), metodoSegundo: 'regla de suma cero del núcleo',
    pasos: (rengR) => ['+1 + x + 4(−2) = 0 (subtema 2).', `x = +${rengTx(rengR)}: el «per-…-ato» de la tradicional indica la valencia más alta (subtema 5).`], pistas: ['La suma debe ser cero.', 'K +1 y O −2.', 'Despeja el Mn.'] }),
  ej({ id: 'ej-no-sistematica-2', titulo: 'Masa fórmula desde un nombre sistemático', enunciado: 'Un compuesto se llama «trióxido de dihierro».', pregunta: '¿Cuál es su masa fórmula, en g/mol?', datos: [['Nombre', 'trióxido de dihierro']], unidad: 'g/mol',
    analitico: () => 2 * A('Fe') + 3 * A('O'), segundo: () => rengMmNom(dNombre('trióxido de dihierro')), metodoSegundo: 'formulación desde el nombre y masa molar del núcleo',
    pasos: (rengR) => ['«tri» 3 O y «di» 2 Fe: Fe₂O₃ (subtema 3).', `M = ${rengTx(rengR, 5)} g/mol.`], pistas: ['Traduce los prefijos.', 'Escribe la fórmula.', 'Suma las masas.'] }),
  ej({ id: 'ej-no-stock-2', titulo: 'Masa del cloruro de cobre(II)', enunciado: 'Un frasco dice «cloruro de cobre(II)».', pregunta: '¿Cuál es la masa fórmula del compuesto, en g/mol?', datos: [['Nombre', 'cloruro de cobre(II)']], unidad: 'g/mol',
    analitico: () => A('Cu') + 2 * A('Cl'), segundo: () => rengMmNom(dNombre('cloruro de cobre(II)')), metodoSegundo: 'formulación desde el nombre y masa molar del núcleo',
    pasos: (rengR) => ['(II): Cu²⁺; con Cl⁻ se necesitan dos: CuCl₂ (subtemas 4 y 13).', `M = ${rengTx(rengR, 5)} g/mol.`], pistas: ['Lee el número romano.', 'Cruza las cargas.', 'Suma las masas.'] }),
  ej({ id: 'ej-no-tradicional-2', titulo: 'Masa del ácido sulfuroso', enunciado: 'El azufre forma los ácidos sulfuroso (S +4) y sulfúrico (S +6).', pregunta: '¿Cuál es la masa fórmula del ácido sulfuroso, en g/mol?', datos: [['Valencia en -oso', '+4']], unidad: 'g/mol',
    analitico: () => 2 * A('H') + A('S') + 3 * A('O'), segundo: () => rengMmNom(dNombre('ácido sulfuroso')), metodoSegundo: 'formulación desde el nombre tradicional y masa molar del núcleo',
    pasos: (rengR) => ['S +4 con H +1 y O −2: H₂SO₃ (subtemas 5 y 12).', `M = ${rengTx(rengR, 5)} g/mol.`], pistas: ['-oso es la valencia menor.', 'Ajusta H y O para que la suma sea cero.', 'Suma las masas.'] }),
  ej({ id: 'ej-no-oxido-metal-2', titulo: 'Oxígeno para formar un óxido', enunciado: `Se queman 4,60 g de sodio para formar Na₂O. Masas: Na ${rengTx(A('Na'), 5)}, O ${rengTx(A('O'), 5)} g/mol.`, pregunta: '¿Qué masa de oxígeno se combina, en g?', datos: [['Na', '4,60 g'], ['Producto', 'Na₂O']], unidad: 'g',
    analitico: () => (4.6 / A('Na') / 2) * A('O'), segundo: () => rengMmNom('Na2O') * (4.6 / (2 * A('Na'))) - 4.6, metodoSegundo: 'masa de óxido formada menos la masa de sodio',
    pasos: (rengR) => ['Na₂O: dos Na por cada O (subtema 6).', `n(O) = n(Na)/2; m(O) = ${rengTx(rengR)} g (bloque 7).`], pistas: ['Escribe la fórmula del óxido.', 'Relaciona moles de Na y de O.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-no-oxido-nometal-2', titulo: 'Trióxido de azufre a partir de azufre', enunciado: `Todo el azufre de 3,20 g de S pasa a SO₃. Masas: S ${rengTx(A('S'), 5)}, O ${rengTx(A('O'), 5)} g/mol.`, pregunta: '¿Qué masa de SO₃ se obtiene, en g?', datos: [['S', '3,20 g'], ['Producto', 'trióxido de azufre']], unidad: 'g',
    analitico: () => (3.2 / A('S')) * rengMmNom('SO3'), segundo: () => rengBiseccion((rengM) => (rengM * A('S')) / rengMmNom(dNombre('trióxido de azufre')) - 3.2, 0, 100), metodoSegundo: 'búsqueda por bisección de la masa con la fracción de S en la fórmula del nombre',
    pasos: (rengR) => ['«trióxido de azufre» = SO₃: un S por fórmula (subtema 7).', `m = ${rengTx(rengR)} g.`], pistas: ['Escribe la fórmula del nombre.', 'Un S por fórmula.', 'Conserva los moles de S.'] }),
  ej({ id: 'ej-no-peroxido-2', titulo: 'Oxígeno de un peróxido', enunciado: 'El peróxido de hidrógeno se descompone: 2 H₂O₂ → 2 H₂O + O₂. Se descomponen 34,0 g.', pregunta: '¿Qué masa de O₂ se libera, en g?', datos: [['H₂O₂', '34,0 g']], unidad: 'g',
    analitico: () => (34 / rengMmNom('H2O2') / 2) * rengMmNom('O2'), segundo: () => 34 - (34 / rengMmNom('H2O2')) * rengMmNom('H2O'), metodoSegundo: 'conservación de la masa: peróxido menos agua formada',
    pasos: (rengR) => ['En el peróxido el O es −1; pasa a −2 (agua) y a 0 (O₂) (subtemas 8 y 2).', `m(O₂) = ${rengTx(rengR)} g.`], pistas: ['Pasa el peróxido a moles.', 'Dos H₂O₂ dan un O₂.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-no-hidruro-2', titulo: 'Hidrógeno de un hidruro', enunciado: 'El hidruro de calcio reacciona con agua: CaH₂ + 2 H₂O → Ca(OH)₂ + 2 H₂. Reaccionan 4,21 g de CaH₂.', pregunta: '¿Qué masa de H₂ se obtiene, en g?', datos: [['CaH₂', '4,21 g']], unidad: 'g',
    analitico: () => (4.21 / rengMmNom('CaH2')) * 2 * rengMmNom('H2'), segundo: () => (4.21 / rengMmNom(dNombre('hidruro de calcio'))) * 4 * A('H'), metodoSegundo: 'formulación desde el nombre y recuento de átomos de H',
    pasos: (rengR) => ['CaH₂: el H del hidruro (−1) y el del agua (+1) forman H₂ (subtemas 9 y 2).', `m(H₂) = ${rengTx(rengR)} g.`], pistas: ['Escribe la fórmula del hidruro.', 'Un CaH₂ da 2 H₂.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-no-hidroxido-2', titulo: 'Hidróxido de hierro(III) formado', enunciado: 'Se precipitan 0,100 mol de Fe³⁺ como hidróxido de hierro(III).', pregunta: '¿Qué masa de hidróxido se forma, en g?', datos: [['Fe³⁺', '0,100 mol']], unidad: 'g',
    analitico: () => 0.1 * (A('Fe') + 3 * (A('O') + A('H'))), segundo: () => 0.1 * rengMmNom(dNombre('hidróxido de hierro(III)')), metodoSegundo: 'formulación desde el nombre y masa molar del núcleo',
    pasos: (rengR) => ['Fe³⁺ necesita tres OH⁻: Fe(OH)₃ (subtemas 10 y 4).', `m = 0,100 × M = ${rengTx(rengR)} g.`], pistas: ['¿Cuántos OH⁻ necesita Fe³⁺?', 'Calcula la masa fórmula.', 'Multiplica por los moles.'] }),
  ej({ id: 'ej-no-hidracido-2', titulo: 'Bromuro de hidrógeno en una disolución', enunciado: 'Se preparan 250 mL de ácido bromhídrico 0,200 mol/L.', pregunta: '¿Qué masa de HBr contiene, en g?', datos: [['Volumen', '250 mL'], ['c', '0,200 mol/L']], unidad: 'g',
    analitico: () => 0.25 * 0.2 * (A('H') + A('Br')), segundo: () => 0.05 * rengMmNom(dNombre('bromuro de hidrógeno')), metodoSegundo: 'formulación desde el nombre y masa molar del núcleo',
    pasos: (rengR) => ['Ácido bromhídrico = HBr en agua (subtema 11).', `n = 0,0500 mol; m = ${rengTx(rengR)} g (bloque 9).`], pistas: ['Escribe la fórmula del hidrácido.', 'Calcula los moles con n = c·V.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-no-oxoacido-2', titulo: 'Moles de ácido nítrico', enunciado: 'Una muestra contiene 126 g de ácido nítrico.', pregunta: '¿Cuántos moles son?', datos: [['Masa', '126 g'], ['Nombre', 'ácido nítrico']], unidad: 'mol',
    analitico: () => 126 / (A('H') + A('N') + 3 * A('O')), segundo: () => 126 / rengMmNom(dNombre('ácido nítrico')), metodoSegundo: 'formulación desde el nombre y masa molar del núcleo',
    pasos: (rengR) => ['Ácido nítrico: N +5, HNO₃ (subtema 12).', `n = 126 / M = ${rengTx(rengR)} mol.`], pistas: ['Escribe la fórmula.', 'Calcula la masa molar.', 'Divide para obtener el resultado.'] }),
  ej({ id: 'ej-no-sal-binaria-2', titulo: 'Cloro en el cloruro de calcio', enunciado: 'El cloruro de calcio se usa para deshacer el hielo.', pregunta: '¿Qué porcentaje en masa es cloro?', datos: [['Nombre', 'cloruro de calcio']], unidad: '%',
    analitico: () => (100 * 2 * A('Cl')) / (A('Ca') + 2 * A('Cl')), segundo: () => pct(dNombre('cloruro de calcio'), 'Cl'), metodoSegundo: 'formulación desde el nombre y porcentaje con el analizador',
    pasos: (rengR) => ['Ca²⁺ y Cl⁻: CaCl₂ (subtema 13).', `% Cl = ${rengTx(rengR)} % (bloque 7, subtema 6).`], pistas: ['Escribe la fórmula.', 'Hay dos Cl.', 'Divide entre la masa fórmula.'] }),
  ej({ id: 'ej-no-oxisal-2', titulo: 'Masa del nitrato de calcio', enunciado: 'Un fertilizante contiene nitrato de calcio.', pregunta: '¿Qué porcentaje en masa es nitrógeno?', datos: [['Nombre', 'nitrato de calcio']], unidad: '%',
    analitico: () => (100 * 2 * A('N')) / (A('Ca') + 2 * (A('N') + 3 * A('O'))), segundo: () => pct(dNombre('nitrato de calcio'), 'N'), metodoSegundo: 'formulación desde el nombre y porcentaje con el analizador',
    pasos: (rengR) => ['Ca(NO₃)₂: dos nitratos por calcio (subtema 14).', `% N = ${rengTx(rengR)} %.`], pistas: ['Escribe la fórmula.', 'Cuenta los N.', 'Divide entre la masa fórmula.'] }),
  ej({ id: 'ej-no-sal-acida-2', titulo: 'Oxígenos de una sal ácida', enunciado: 'El dihidrogenofosfato de calcio es Ca(H₂PO₄)₂.', pregunta: '¿Cuántos átomos de oxígeno hay en una fórmula?', datos: [['Fórmula', 'Ca(H₂PO₄)₂']], unidad: '',
    analitico: () => 2 * 4, segundo: () => deEl('Ca(H2PO4)2', 'O'), metodoSegundo: 'analizador de fórmulas del núcleo',
    pasos: (rengR) => ['El anión H₂PO₄⁻ conserva 2 H (subtema 15); Ca²⁺ necesita dos.', `O = 2 × 4 = ${rengTx(rengR)}.`], pistas: ['Identifica el anión.', '¿Cuántos aniones por Ca?', 'Multiplica los O.'] }),
  ej({ id: 'ej-no-sal-basica-2', titulo: 'Cobre en la malaquita', enunciado: 'La malaquita, una sal básica, es Cu₂(OH)₂CO₃.', pregunta: '¿Cuál es el número de oxidación del cobre?', datos: [['OH⁻', '−1 cada uno'], ['CO₃²⁻', '−2']], unidad: '',
    analitico: () => (0 - 2 * -1 - -2) / 2, segundo: () => rengBiseccion((rengX) => 2 * rengX + 2 * -1 + -2, 0, 4), metodoSegundo: 'búsqueda por bisección de la carga del Cu con la suma de cargas',
    pasos: (rengR) => ['Cargas: 2x + 2(−1) + (−2) = 0 (subtemas 16 y 2).', `x = +${rengTx(rengR)}: carbonato básico de cobre(II).`], pistas: ['Suma las cargas de los aniones.', 'La fórmula es neutra.', 'Divide entre los dos Cu.'] }),
  ej({ id: 'ej-no-hidrato-2', titulo: 'Agua de un hidrato desconocido', enunciado: 'Al calentar 2,50 g de CuSO₄·nH₂O quedan 1,60 g de CuSO₄ anhidro.', pregunta: '¿Cuánto vale n (moles de agua por mol de sal)?', datos: [['Hidrato', '2,50 g'], ['Anhidro', '1,60 g']], unidad: '',
    analitico: () => ((2.5 - 1.6) / rengMmNom('H2O')) / (1.6 / rengMmNom('CuSO4')), segundo: () => rengBiseccion((rengN) => (1.6 / rengMmNom('CuSO4')) * (rengMmNom('CuSO4') + rengN * rengMmNom('H2O')) - 2.5, 0, 20), metodoSegundo: 'búsqueda por bisección de n que reproduce la masa del hidrato',
    pasos: (rengR) => ['Agua perdida: 0,90 g (subtema 17).', `n = moles de agua / moles de sal = ${rengTx(rengR)} ≈ 5: pentahidratado.`], pistas: ['Calcula el agua perdida.', 'Pasa agua y sal a moles.', 'Divide para obtener el resultado.'] }),
  ej({ id: 'ej-no-formula-2', titulo: 'Nitrógeno en un fertilizante', enunciado: 'El sulfato de amonio es (NH₄)₂SO₄.', pregunta: '¿Qué porcentaje en masa es nitrógeno?', datos: [['Fórmula', '(NH₄)₂SO₄']], unidad: '%',
    analitico: () => (100 * 2 * A('N')) / (2 * (A('N') + 4 * A('H')) + A('S') + 4 * A('O')), segundo: () => pct('(NH4)2SO4', 'N'), metodoSegundo: 'porcentaje con el analizador de fórmulas del núcleo',
    pasos: (rengR) => ['Hay 2 N por fórmula (subtema 18).', `% N = ${rengTx(rengR)} % (bloque 7).`], pistas: ['Cuenta los N.', 'Calcula la masa fórmula.', 'Divide y multiplica por 100.'] }),
  ej({ id: 'ej-no-formulacion-2', titulo: 'Formular y pesar', enunciado: 'Se combina el catión Fe³⁺ con el anión NO₃⁻.', pregunta: '¿Cuál es la masa fórmula del compuesto, en g/mol?', datos: [['Catión', 'Fe³⁺'], ['Anión', 'NO₃⁻']], unidad: 'g/mol',
    analitico: () => A('Fe') + 3 * (A('N') + 3 * A('O')), segundo: () => rengLecturasFormulaIonica({ zc: 3, za: 1, Mc: A('Fe'), Ma: A('N') + 3 * A('O') }).masa!, metodoSegundo: 'escena «fórmula iónica» con las mismas cargas y masas',
    pasos: (rengR) => ['Fe³⁺ necesita tres NO₃⁻: Fe(NO₃)₃, nitrato de hierro(III) (subtemas 19 y 14).', `M = ${rengTx(rengR, 5)} g/mol.`], pistas: ['Cruza las cargas.', 'Usa paréntesis para el nitrato.', 'Suma las masas.'] }),
  ej({ id: 'ej-no-interpretar-2', titulo: 'Nitrógeno en una masa de sal', enunciado: 'Un saco contiene 1,00 kg de sulfato de amonio.', pregunta: '¿Qué masa de nitrógeno contiene, en g?', datos: [['Masa', '1,00 kg'], ['Nombre', 'sulfato de amonio']], unidad: 'g',
    analitico: () => (1000 * 2 * A('N')) / rengMmNom('(NH4)2SO4'), segundo: () => (1000 * pct(dNombre('sulfato de amonio'), 'N')) / 100, metodoSegundo: 'formulación desde el nombre y porcentaje con el analizador',
    pasos: (rengR) => ['Sulfato de amonio = (NH₄)₂SO₄ (subtema 20).', `m(N) = ${rengTx(rengR)} g.`], pistas: ['Escribe la fórmula del nombre.', 'Calcula el % de N.', 'Aplícalo a 1000 g.'] })
]
