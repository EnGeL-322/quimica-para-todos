import { rengPorSimbolo } from '../../../../tabla-periodica/data'
import { rengLecturasCombustion } from '../../../escenas-n1/modelos/combustion'
import { rengBiseccion } from '../numericos'
import type { RengEjemploN1 } from '../tipos'
import { rengTx } from '../estequiometria/datos'
import { rengCoefDe, rengCoefs, rengElectronesRedox, rengMmRq, rengOxRq } from './comun'

const T = { rel: 0.005, abs: 1e-12 }
const ej = (rengE: Omit<RengEjemploN1, 'tolerancia' | 'cifras'> & { cifras?: number }): RengEjemploN1 => ({ cifras: 3, tolerancia: T, ...rengE })
const A = (rengEl: string): number => rengPorSimbolo.get(rengEl)!.masa
const M = rengMmRq
const suma = (rengL: readonly number[]): number => rengL.reduce((rengA, rengB) => rengA + rengB, 0)

export const RENG_EJEMPLOS_REACCIONES: readonly RengEjemploN1[] = [
  ej({ id: 'ej-rq-concepto', titulo: 'Átomos antes y después', enunciado: 'El hidrógeno arde con oxígeno: 2 H₂ + O₂ → 2 H₂O.', pregunta: '¿Cuántos átomos hay en total a la izquierda de la ecuación?', datos: [['Ecuación', '2 H₂ + O₂ → 2 H₂O']], unidad: '',
    analitico: () => 2 * 2 + 1 * 2, segundo: () => rengCoefs('H2 + O2 -> H2O')[2]! * 3, metodoSegundo: 'coeficientes del módulo de ajuste del núcleo, contando los átomos de los productos (se conservan)',
    pasos: (rengR) => ['Izquierda: 2 H₂ aportan 4 H y 1 O₂ aporta 2 O.', `Total: ${rengTx(rengR)} átomos, los mismos que en 2 H₂O.`], pistas: ['Multiplica coeficiente por subíndice.', 'Cuenta H y O por separado.', 'Compara con los productos.'] }),
  ej({ id: 'ej-rq-reactivos', titulo: 'Reactivo necesario', enunciado: 'El amoníaco se obtiene con N₂ + 3 H₂ → 2 NH₃.', pregunta: '¿Cuántos moles de H₂ reaccionan con 2,50 mol de N₂?', datos: [['N₂', '2,50 mol']], unidad: 'mol',
    analitico: () => 2.5 * 3, segundo: () => (2.5 * rengCoefDe('N2 + H2 -> NH3', 'H2')) / rengCoefDe('N2 + H2 -> NH3', 'N2'), metodoSegundo: 'coeficientes del módulo de ajuste del núcleo',
    pasos: (rengR) => ['La proporción es 3 mol de H₂ por cada mol de N₂.', `n(H₂) = 2,50 × 3 = ${rengTx(rengR)} mol.`], pistas: ['Lee los coeficientes.', 'Plantea la proporción.', 'Multiplica por los moles de N₂.'] }),
  ej({ id: 'ej-rq-ecuaciones', titulo: 'Suma de coeficientes', enunciado: 'La combustión del propano se escribe C₃H₈ + O₂ → CO₂ + H₂O sin ajustar.', pregunta: '¿Cuánto suman los coeficientes mínimos de la ecuación ajustada?', datos: [['Esquema', 'C₃H₈ + O₂ → CO₂ + H₂O']], unidad: '',
    analitico: () => 1 + 5 + 3 + 4, segundo: () => suma(rengCoefs('C3H8 + O2 -> CO2 + H2O')), metodoSegundo: 'módulo de ajuste del núcleo',
    pasos: (rengR) => ['C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O.', `Suma: ${rengTx(rengR)}.`], pistas: ['Iguala primero el carbono.', 'Después el hidrógeno.', 'Deja el oxígeno para el final.'] }),
  ej({ id: 'ej-rq-conservacion', titulo: 'Oxígeno que gana el magnesio', enunciado: `Se queman 4,86 g de magnesio y se forma MgO. Masas: Mg ${rengTx(A('Mg'), 5)}, O ${rengTx(A('O'), 5)} g/mol.`, pregunta: '¿Qué masa de oxígeno se ha combinado, en g?', datos: [['Mg', '4,86 g'], ['Producto', 'MgO']], unidad: 'g',
    analitico: () => (4.86 / A('Mg')) * A('O'), segundo: () => (4.86 / A('Mg')) * M('MgO') - 4.86, metodoSegundo: 'conservación de la masa: masa de MgO menos masa de Mg',
    pasos: (rengR) => ['n(O) = n(Mg) en MgO.', `m(O) = ${rengTx(rengR)} g: la masa del sólido aumenta en esa cantidad.`], pistas: ['Pasa el Mg a moles.', 'Un O por cada Mg.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-tanteo', titulo: 'Ajustar la oxidación del hierro', enunciado: 'Ajusta por tanteo: Fe + O₂ → Fe₂O₃.', pregunta: '¿Cuál es el coeficiente del O₂ en la ecuación ajustada mínima?', datos: [['Esquema', 'Fe + O₂ → Fe₂O₃']], unidad: '',
    analitico: () => 3, segundo: () => rengCoefDe('Fe + O2 -> Fe2O3', 'O2'), metodoSegundo: 'módulo de ajuste del núcleo',
    pasos: (rengR) => ['El O: 2 en O₂ y 3 en Fe₂O₃; mínimo común múltiplo 6: 3 O₂ y 2 Fe₂O₃.', `Hierro: 4 Fe. Coeficiente del O₂: ${rengTx(rengR)}.`], pistas: ['Iguala el oxígeno con el m.c.m.', 'Ajusta después el hierro.', 'Comprueba cada elemento.'] }),
  ej({ id: 'ej-rq-algebraico', titulo: 'Ajuste algebraico del etano', enunciado: 'Ajusta con incógnitas a C₂H₆ + b O₂ → c CO₂ + d H₂O.', pregunta: '¿Cuánto vale b en la ecuación ajustada mínima?', datos: [['Esquema', 'a C₂H₆ + b O₂ → c CO₂ + d H₂O']], unidad: '',
    analitico: () => { const a = 2; const c = 2 * a; const d = 3 * a; return (2 * c + d) / 2 }, segundo: () => rengCoefDe('C2H6 + O2 -> CO2 + H2O', 'O2'), metodoSegundo: 'módulo de ajuste del núcleo',
    pasos: (rengR) => ['C: 2a = c; H: 6a = 2d; O: 2b = 2c + d.', `Con a = 2: c = 4, d = 6 y b = ${rengTx(rengR)}.`], pistas: ['Una ecuación por elemento.', 'Elige a para que todo sea entero.', 'Despeja b de la del oxígeno.'] }),
  ej({ id: 'ej-rq-redox', titulo: 'Electrones del permanganato', enunciado: 'En medio ácido, MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺.', pregunta: '¿Cuántos electrones se transfieren en la ecuación ajustada?', datos: [['Reacción', 'MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺'], ['Medio', 'ácido']], unidad: '',
    analitico: () => (7 - 2) * 1, segundo: () => rengElectronesRedox('MnO4- + Fe2+ -> Mn2+ + Fe3+', 'acido'), metodoSegundo: 'método del ion-electrón del núcleo',
    pasos: (rengR) => ['El Mn pasa de +7 a +2: gana 5 e⁻; cada Fe²⁺ pierde 1 e⁻.', `Se necesitan 5 Fe²⁺ por MnO₄⁻: ${rengTx(rengR)} electrones.`], pistas: ['Calcula los números de oxidación.', 'Iguala electrones ganados y perdidos.', 'Usa el mínimo común múltiplo.'] }),
  ej({ id: 'ej-rq-sintesis', titulo: 'Agua formada por síntesis', enunciado: 'Se forma agua a partir de sus elementos: 2 H₂ + O₂ → 2 H₂O, con 4,00 g de H₂ y O₂ en exceso.', pregunta: '¿Qué masa de agua se forma, en g?', datos: [['H₂', '4,00 g'], ['O₂', 'exceso']], unidad: 'g',
    analitico: () => (4 / M('H2')) * M('H2O'), segundo: () => ((4 / M('H2')) * rengCoefDe('H2 + O2 -> H2O', 'H2O')) / rengCoefDe('H2 + O2 -> H2O', 'H2') * M('H2O'), metodoSegundo: 'coeficientes del módulo de ajuste del núcleo',
    pasos: (rengR) => ['2 mol de H₂ dan 2 mol de H₂O: proporción 1:1.', `m = ${rengTx(rengR)} g.`], pistas: ['Pasa el H₂ a moles.', 'Proporción 1:1.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-descomposicion', titulo: 'Descomponer caliza', enunciado: 'Se descomponen 50,0 g de CaCO₃: CaCO₃ → CaO + CO₂.', pregunta: '¿Qué masa de CO₂ se desprende, en g?', datos: [['CaCO₃', '50,0 g']], unidad: 'g',
    analitico: () => (50 / M('CaCO3')) * M('CO2'), segundo: () => 50 - (50 / M('CaCO3')) * M('CaO'), metodoSegundo: 'conservación de la masa: caliza menos cal formada',
    pasos: (rengR) => ['Un mol de CaCO₃ da un mol de CO₂.', `m(CO₂) = ${rengTx(rengR)} g.`], pistas: ['Pasa la caliza a moles.', 'Proporción 1:1.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-desplazamiento', titulo: 'Cobre desplazado por cinc', enunciado: 'Se añaden 6,54 g de Zn a CuSO₄ en exceso: Zn + CuSO₄ → ZnSO₄ + Cu.', pregunta: '¿Qué masa de cobre se deposita, en g?', datos: [['Zn', '6,54 g']], unidad: 'g',
    analitico: () => (6.54 / A('Zn')) * A('Cu'), segundo: () => ((6.54 / A('Zn')) * rengCoefDe('Zn + CuSO4 -> ZnSO4 + Cu', 'Cu')) / rengCoefDe('Zn + CuSO4 -> ZnSO4 + Cu', 'Zn') * A('Cu'), metodoSegundo: 'coeficientes del módulo de ajuste del núcleo',
    pasos: (rengR) => ['El cinc, más activo, desplaza al cobre: 1 Zn da 1 Cu.', `m(Cu) = ${rengTx(rengR)} g.`], pistas: ['Pasa el Zn a moles.', 'Proporción 1:1.', 'Usa la masa atómica del Cu.'] }),
  ej({ id: 'ej-rq-doble', titulo: 'Doble desplazamiento con plata', enunciado: 'Se mezclan disoluciones: AgNO₃ + KCl → AgCl + KNO₃. Reaccionan 0,0250 mol de KCl.', pregunta: '¿Qué masa de AgCl se forma, en g?', datos: [['KCl', '0,0250 mol']], unidad: 'g',
    analitico: () => 0.025 * M('AgCl'), segundo: () => ((0.025 * rengCoefDe('AgNO3 + KCl -> AgCl + KNO3', 'AgCl')) / rengCoefDe('AgNO3 + KCl -> AgCl + KNO3', 'KCl')) * M('AgCl'), metodoSegundo: 'coeficientes del módulo de ajuste del núcleo',
    pasos: (rengR) => ['Los iones se intercambian; 1 KCl da 1 AgCl.', `m = ${rengTx(rengR)} g.`], pistas: ['Escribe el intercambio de iones.', 'Proporción 1:1.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-precipitacion', titulo: 'Sulfato de bario precipitado', enunciado: 'A 25,0 mL de BaCl₂ 0,200 mol/L se añade Na₂SO₄ en exceso: BaCl₂ + Na₂SO₄ → BaSO₄ + 2 NaCl.', pregunta: '¿Qué masa de BaSO₄ precipita, en g?', datos: [['BaCl₂', '25,0 mL, 0,200 mol/L']], unidad: 'g',
    analitico: () => 0.025 * 0.2 * M('BaSO4'), segundo: () => ((0.005 * rengCoefDe('BaCl2 + Na2SO4 -> BaSO4 + NaCl', 'BaSO4')) / rengCoefDe('BaCl2 + Na2SO4 -> BaSO4 + NaCl', 'BaCl2')) * M('BaSO4'), metodoSegundo: 'coeficientes del módulo de ajuste del núcleo',
    pasos: (rengR) => ['n(Ba²⁺) = 0,0250 × 0,200 = 0,00500 mol.', `m(BaSO₄) = ${rengTx(rengR)} g.`], pistas: ['Calcula los moles de Ba²⁺.', 'Proporción 1:1.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-neutralizacion', titulo: 'Volumen de base', enunciado: 'Se neutralizan 25,0 mL de HCl 0,100 mol/L con NaOH 0,125 mol/L.', pregunta: '¿Qué volumen de NaOH se necesita, en mL?', datos: [['HCl', '25,0 mL, 0,100 mol/L'], ['NaOH', '0,125 mol/L']], unidad: 'mL',
    analitico: () => (25 * 0.1) / 0.125, segundo: () => rengBiseccion((rengV) => 0.125 * rengV - 25 * 0.1, 0, 1000), metodoSegundo: 'búsqueda por bisección del volumen que iguala los moles',
    pasos: (rengR) => ['HCl + NaOH → NaCl + H₂O: moles iguales.', `V = 2,50 mmol / 0,125 mol/L = ${rengTx(rengR)} mL.`], pistas: ['Calcula los mmol de ácido.', 'Proporción 1:1.', 'Divide entre la concentración.'] }),
  ej({ id: 'ej-rq-combustion', titulo: 'CO₂ de una combustión', enunciado: 'Se queman 16,0 g de metano por completo.', pregunta: '¿Qué masa de CO₂ se forma, en g?', datos: [['CH₄', '16,0 g']], unidad: 'g',
    analitico: () => (16 / M('CH4')) * M('CO2'), segundo: () => rengLecturasCombustion({ x: 1, y: 4, z: 0, n: 16 / (A('C') + 4 * A('H')) }).mco2!, metodoSegundo: 'escena «combustion» con los mismos moles',
    pasos: (rengR) => ['CH₄ + 2 O₂ → CO₂ + 2 H₂O.', `m(CO₂) = ${rengTx(rengR)} g.`], pistas: ['Ajusta la combustión.', 'Un CO₂ por CH₄.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-reversible', titulo: 'Amoníaco en el equilibrio', enunciado: 'En N₂ + 3 H₂ ⇌ 2 NH₃, de 1,00 mol de N₂ reacciona el 40,0 % antes de llegar al equilibrio.', pregunta: '¿Cuántos moles de NH₃ hay en el equilibrio?', datos: [['N₂ inicial', '1,00 mol'], ['Conversión', '40,0 %']], unidad: 'mol',
    analitico: () => 2 * 0.4, segundo: () => (0.4 * rengCoefDe('N2 + H2 -> NH3', 'NH3')) / rengCoefDe('N2 + H2 -> NH3', 'N2'), metodoSegundo: 'coeficientes del módulo de ajuste del núcleo',
    pasos: (rengR) => ['Reaccionan 0,400 mol de N₂; la reacción no llega al final.', `n(NH₃) = 2 × 0,400 = ${rengTx(rengR)} mol.`], pistas: ['Calcula el N₂ que reacciona.', 'Usa la proporción 1:2.', 'Queda N₂ sin reaccionar.'] }),
  ej({ id: 'ej-rq-exotermica', titulo: 'Calor de la combustión del metano', enunciado: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O, ΔH = −890 kJ/mol. Se queman 8,00 g de CH₄.', pregunta: '¿Cuánto calor se libera, en kJ?', datos: [['CH₄', '8,00 g'], ['ΔH', '−890 kJ/mol']], unidad: 'kJ',
    analitico: () => (8 / (A('C') + 4 * A('H'))) * 890, segundo: () => rengBiseccion((rengQ) => rengQ / 890 - 8 / M('CH4'), 0, 5000), metodoSegundo: 'búsqueda por bisección del calor con la masa molar del núcleo',
    pasos: (rengR) => ['n = 8,00/16,04 = 0,499 mol; ΔH < 0: se libera calor.', `q = n·|ΔH| = ${rengTx(rengR)} kJ.`], pistas: ['Pasa a moles.', 'Multiplica por |ΔH|.', 'Exotérmica: libera calor.'] }),
  ej({ id: 'ej-rq-endotermica', titulo: 'Calor para descomponer caliza', enunciado: 'CaCO₃ → CaO + CO₂, ΔH = +178 kJ/mol. Se descomponen 25,0 g.', pregunta: '¿Cuánto calor hay que aportar, en kJ?', datos: [['CaCO₃', '25,0 g'], ['ΔH', '+178 kJ/mol']], unidad: 'kJ',
    analitico: () => (25 / (A('Ca') + A('C') + 3 * A('O'))) * 178, segundo: () => rengBiseccion((rengQ) => rengQ / 178 - 25 / M('CaCO3'), 0, 5000), metodoSegundo: 'búsqueda por bisección del calor con la masa molar del núcleo',
    pasos: (rengR) => ['n = 25,0/100,09 mol; ΔH > 0: hay que aportar calor.', `q = ${rengTx(rengR)} kJ.`], pistas: ['Pasa a moles.', 'Multiplica por ΔH.', 'Endotérmica: absorbe calor.'] }),
  ej({ id: 'ej-rq-oxidacion', titulo: 'Electrones en la síntesis del cloruro férrico', enunciado: '2 Fe + 3 Cl₂ → 2 FeCl₃.', pregunta: '¿Cuántos electrones se transfieren en la ecuación tal como está escrita?', datos: [['Ecuación', '2 Fe + 3 Cl₂ → 2 FeCl₃']], unidad: '',
    analitico: () => 2 * 3, segundo: () => rengCoefDe('Fe + Cl2 -> FeCl3', 'Fe') * (rengOxRq('FeCl3', 'Fe') - 0), metodoSegundo: 'coeficientes y números de oxidación del núcleo',
    pasos: (rengR) => ['Cada Fe pasa de 0 a +3 (se oxida); cada Cl, de 0 a −1 (se reduce).', `Electrones: 2 × 3 = ${rengTx(rengR)}.`], pistas: ['Calcula los números de oxidación.', 'Multiplica por los átomos.', 'Comprueba con el cloro.'] }),
  ej({ id: 'ej-rq-oxidantes', titulo: 'El dicromato como oxidante', enunciado: 'En medio ácido, Cr₂O₇²⁻ oxida al Fe²⁺: Cr₂O₇²⁻ + Fe²⁺ → Cr³⁺ + Fe³⁺.', pregunta: '¿Cuántos moles de Fe²⁺ oxida 1 mol de dicromato?', datos: [['Oxidante', 'Cr₂O₇²⁻'], ['Reductor', 'Fe²⁺']], unidad: 'mol',
    analitico: () => (2 * (6 - 3)) / 1, segundo: () => rengElectronesRedox('Cr2O7^2- + Fe^2+ -> Cr^3+ + Fe^3+', 'acido'), metodoSegundo: 'método del ion-electrón del núcleo (electrones transferidos por dicromato)',
    pasos: (rengR) => ['Cada Cr pasa de +6 a +3: el dicromato gana 6 e⁻.', `Cada Fe²⁺ cede 1 e⁻: ${rengTx(rengR)} mol de Fe²⁺.`], pistas: ['Cuenta los electrones que gana el Cr.', 'Hay dos Cr.', 'Cada Fe²⁺ cede uno.'] }),
  ej({ id: 'ej-rq-reductores', titulo: 'Cinc como reductor', enunciado: 'El cinc reduce los iones cobre(II): Zn + Cu²⁺ → Zn²⁺ + Cu.', pregunta: '¿Qué masa de cinc hace falta para reducir 0,200 mol de Cu²⁺, en g?', datos: [['Cu²⁺', '0,200 mol']], unidad: 'g',
    analitico: () => 0.2 * A('Zn'), segundo: () => ((0.2 * rengCoefDe('Zn + Cu^2+ -> Zn^2+ + Cu', 'Zn')) / rengCoefDe('Zn + Cu^2+ -> Zn^2+ + Cu', 'Cu^2+')) * A('Zn'), metodoSegundo: 'coeficientes del módulo de ajuste del núcleo (con carga)',
    pasos: (rengR) => ['El Zn cede 2 e⁻ y el Cu²⁺ los gana: proporción 1:1.', `m(Zn) = ${rengTx(rengR)} g.`], pistas: ['Identifica quién cede electrones.', 'Proporción 1:1.', 'Pasa a gramos.'] })
]
