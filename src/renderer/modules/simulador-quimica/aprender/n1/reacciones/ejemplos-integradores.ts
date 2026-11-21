import { rengPorSimbolo } from '../../../../tabla-periodica/data'
import { rengLecturasCombustion } from '../../../escenas-n1/modelos/combustion'
import { rengLecturasLimitante } from '../../../escenas-n1/modelos/reactivo-limitante'
import { rengBiseccion } from '../numericos'
import type { RengEjemploN1 } from '../tipos'
import { rengTx } from '../estequiometria/datos'
import { rengCoefDe, rengCoefRedoxDe, rengCoefs, rengElectronesRedox, rengMmRq, rengOxRq } from './comun'

const T = { rel: 0.005, abs: 1e-12 }
const ej = (rengE: Omit<RengEjemploN1, 'tolerancia' | 'cifras'> & { cifras?: number }): RengEjemploN1 => ({ cifras: 3, tolerancia: T, ...rengE })
const A = (rengEl: string): number => rengPorSimbolo.get(rengEl)!.masa
const M = rengMmRq
const suma = (rengL: readonly number[]): number => rengL.reduce((rengA, rengB) => rengA + rengB, 0)
const prop = (rengE: string, rengDe: string, rengA: string, rengN: number): number => (rengN * rengCoefDe(rengE, rengA)) / rengCoefDe(rengE, rengDe)

export const RENG_EJEMPLOS_REACCIONES_INTEGRADORES: readonly RengEjemploN1[] = [
  ej({ id: 'ej-rq-concepto-2', titulo: 'Oxígeno que consume el carbón', enunciado: 'Se queman 12,0 g de carbono: C + O₂ → CO₂.', pregunta: '¿Qué masa de O₂ se consume, en g?', datos: [['C', '12,0 g']], unidad: 'g',
    analitico: () => (12 / A('C')) * M('O2'), segundo: () => (12 / A('C')) * M('CO2') - 12, metodoSegundo: 'conservación de la masa: CO₂ formado menos carbono',
    pasos: (rengR) => ['Los átomos se reorganizan y la masa se conserva (subtemas 1 y 4).', `m(O₂) = ${rengTx(rengR)} g.`], pistas: ['Pasa el carbono a moles.', 'Un O₂ por cada C.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-reactivos-2', titulo: 'El reactivo que se agota', enunciado: 'Se mezclan 2,00 mol de H₂ y 2,00 mol de O₂: 2 H₂ + O₂ → 2 H₂O.', pregunta: '¿Cuántos moles de agua se forman?', datos: [['H₂', '2,00 mol'], ['O₂', '2,00 mol']], unidad: 'mol',
    analitico: () => Math.min(2 / 2, 2 / 1) * 2, segundo: () => rengLecturasLimitante({ r: 0, n1: 2, n2: 2, rend: 100 }).nProducto!, metodoSegundo: 'escena «reactivo-limitante» con los mismos moles',
    pasos: (rengR) => ['El H₂ alcanza para 1 «vuelta» de la ecuación y el O₂ para 2: el H₂ se agota (subtema 2).', `n(H₂O) = ${rengTx(rengR)} mol.`], pistas: ['Divide moles entre coeficientes.', 'El menor cociente limita.', 'Calcula el producto con ese.'] }),
  ej({ id: 'ej-rq-ecuaciones-2', titulo: 'Oxígeno para el propano', enunciado: 'Se queman 3,00 mol de propano por completo.', pregunta: '¿Cuántos moles de O₂ se consumen?', datos: [['C₃H₈', '3,00 mol']], unidad: 'mol',
    analitico: () => 3 * 5, segundo: () => rengLecturasCombustion({ x: 3, y: 8, z: 0, n: 3 }).mo2! / M('O2'), metodoSegundo: 'escena «combustion» (masa de O₂ dividida entre su masa molar)',
    pasos: (rengR) => ['C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O (subtemas 3 y 14).', `n(O₂) = 5 × 3,00 = ${rengTx(rengR)} mol.`], pistas: ['Ajusta la combustión.', 'Lee el coeficiente del O₂.', 'Multiplica por los moles.'] }),
  ej({ id: 'ej-rq-conservacion-2', titulo: 'Masa que se escapa', enunciado: 'En un vaso abierto, 5,00 g de NaHCO₃ reaccionan con vinagre en exceso: NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂.', pregunta: '¿Cuánto disminuye la masa del vaso, en g?', datos: [['NaHCO₃', '5,00 g'], ['Recipiente', 'abierto']], unidad: 'g',
    analitico: () => (5 / M('NaHCO3')) * M('CO2'), segundo: () => prop('NaHCO3 + CH3COOH -> CH3COONa + H2O + CO2', 'NaHCO3', 'CO2', 5 / M('NaHCO3')) * M('CO2'), metodoSegundo: 'coeficientes del módulo de ajuste del núcleo',
    pasos: (rengR) => ['La masa se conserva, pero el CO₂ escapa del vaso abierto (subtema 4).', `Pérdida = m(CO₂) = ${rengTx(rengR)} g.`], pistas: ['¿Qué producto es un gas?', 'Calcula su masa.', 'Esa masa sale del vaso.'] }),
  ej({ id: 'ej-rq-tanteo-2', titulo: 'Óxido de aluminio formado', enunciado: 'Se oxidan 5,40 g de aluminio: Al + O₂ → Al₂O₃ (sin ajustar).', pregunta: '¿Qué masa de Al₂O₃ se forma, en g?', datos: [['Al', '5,40 g']], unidad: 'g',
    analitico: () => (5.4 / A('Al') / 2) * M('Al2O3'), segundo: () => prop('Al + O2 -> Al2O3', 'Al', 'Al2O3', 5.4 / A('Al')) * M('Al2O3'), metodoSegundo: 'coeficientes del módulo de ajuste del núcleo',
    pasos: (rengR) => ['Ajuste por tanteo: 4 Al + 3 O₂ → 2 Al₂O₃ (subtema 5).', `m = ${rengTx(rengR)} g.`], pistas: ['Ajusta la ecuación.', 'Relaciona Al con Al₂O₃.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-algebraico-2', titulo: 'Coeficientes de la respiración', enunciado: 'Ajusta C₆H₁₂O₆ + O₂ → CO₂ + H₂O.', pregunta: '¿Cuánto suman los coeficientes mínimos?', datos: [['Esquema', 'C₆H₁₂O₆ + O₂ → CO₂ + H₂O']], unidad: '',
    analitico: () => { const c = 6; const d = 6; const b = (2 * c + d - 6) / 2; return 1 + b + c + d }, segundo: () => suma(rengCoefs('C6H12O6 + O2 -> CO2 + H2O')), metodoSegundo: 'módulo de ajuste del núcleo',
    pasos: (rengR) => ['Con a = 1: c = 6, d = 6 y 2b + 6 = 2c + d → b = 6 (subtema 6).', `Suma = ${rengTx(rengR)}.`], pistas: ['Una ecuación por elemento.', 'Fija a = 1.', 'Despeja b con el oxígeno.'] }),
  ej({ id: 'ej-rq-redox-2', titulo: 'Agua oxigenada y permanganato', enunciado: 'En medio ácido, MnO₄⁻ + H₂O₂ → Mn²⁺ + O₂.', pregunta: '¿Cuántos electrones se transfieren en la ecuación ajustada mínima?', datos: [['Medio', 'ácido']], unidad: '',
    analitico: () => 2 * 5, segundo: () => rengElectronesRedox('MnO4- + H2O2 -> Mn2+ + O2', 'acido'), metodoSegundo: 'método del ion-electrón del núcleo',
    pasos: (rengR) => ['Mn: +7 → +2 (5 e⁻); cada H₂O₂ cede 2 e⁻ (O: −1 → 0) (subtemas 7 y 18).', `m.c.m. de 5 y 2: ${rengTx(rengR)} electrones.`], pistas: ['Electrones del Mn.', 'Electrones del H₂O₂.', 'Mínimo común múltiplo.'] }),
  ej({ id: 'ej-rq-sintesis-2', titulo: 'Amoníaco desde nitrógeno', enunciado: 'Se sintetiza NH₃ a partir de 14,0 g de N₂ con H₂ en exceso.', pregunta: '¿Qué masa de NH₃ se puede formar, en g?', datos: [['N₂', '14,0 g'], ['H₂', 'exceso']], unidad: 'g',
    analitico: () => (14 / M('N2')) * 2 * M('NH3'), segundo: () => rengLecturasLimitante({ r: 1, n1: 14 / M('N2'), n2: 10, rend: 100 }).mProducto!, metodoSegundo: 'escena «reactivo-limitante» con el H₂ en exceso',
    pasos: (rengR) => ['N₂ + 3 H₂ → 2 NH₃ (subtema 8).', `m(NH₃) = ${rengTx(rengR)} g.`], pistas: ['Pasa el N₂ a moles.', 'Un N₂ da dos NH₃.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-descomposicion-2', titulo: 'Oxígeno del agua oxigenada', enunciado: 'Se descomponen 3,40 g de H₂O₂: 2 H₂O₂ → 2 H₂O + O₂.', pregunta: '¿Qué masa de O₂ se forma, en g?', datos: [['H₂O₂', '3,40 g']], unidad: 'g',
    analitico: () => (3.4 / M('H2O2') / 2) * M('O2'), segundo: () => 3.4 - (3.4 / M('H2O2')) * M('H2O'), metodoSegundo: 'conservación de la masa: peróxido menos agua',
    pasos: (rengR) => ['Una sustancia da dos más sencillas (subtema 9).', `m(O₂) = ${rengTx(rengR)} g.`], pistas: ['Pasa a moles.', 'Dos H₂O₂ dan un O₂.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-desplazamiento-2', titulo: 'Hidrógeno del magnesio', enunciado: 'Se disuelven 2,43 g de Mg en HCl en exceso: Mg + HCl → MgCl₂ + H₂ (sin ajustar).', pregunta: '¿Qué masa de H₂ se desprende, en g?', datos: [['Mg', '2,43 g']], unidad: 'g',
    analitico: () => (2.43 / A('Mg')) * M('H2'), segundo: () => prop('Mg + HCl -> MgCl2 + H2', 'Mg', 'H2', 2.43 / A('Mg')) * M('H2'), metodoSegundo: 'coeficientes del módulo de ajuste del núcleo',
    pasos: (rengR) => ['Mg + 2 HCl → MgCl₂ + H₂: el Mg desplaza al hidrógeno (subtema 10).', `m(H₂) = ${rengTx(rengR)} g.`], pistas: ['Ajusta la ecuación.', 'Un Mg da un H₂.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-doble-2', titulo: 'Yoduro de plomo', enunciado: 'Pb(NO₃)₂ + KI → PbI₂ + KNO₃ (sin ajustar). Reaccionan 0,0100 mol de KI con exceso de nitrato de plomo.', pregunta: '¿Qué masa de PbI₂ precipita, en g?', datos: [['KI', '0,0100 mol']], unidad: 'g',
    analitico: () => (0.01 / 2) * M('PbI2'), segundo: () => prop('Pb(NO3)2 + KI -> PbI2 + KNO3', 'KI', 'PbI2', 0.01) * M('PbI2'), metodoSegundo: 'coeficientes del módulo de ajuste del núcleo',
    pasos: (rengR) => ['Pb(NO₃)₂ + 2 KI → PbI₂ + 2 KNO₃ (subtemas 11 y 12).', `m = ${rengTx(rengR)} g.`], pistas: ['Ajusta la ecuación.', 'Dos KI por PbI₂.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-precipitacion-2', titulo: 'Plata precipitada', enunciado: 'A 50,0 mL de AgNO₃ 0,100 mol/L se añade KCl en exceso.', pregunta: '¿Qué masa de AgCl precipita, en g?', datos: [['AgNO₃', '50,0 mL, 0,100 mol/L']], unidad: 'g',
    analitico: () => 0.05 * 0.1 * M('AgCl'), segundo: () => prop('AgNO3 + KCl -> AgCl + KNO3', 'AgNO3', 'AgCl', 0.005) * M('AgCl'), metodoSegundo: 'coeficientes del módulo de ajuste del núcleo',
    pasos: (rengR) => ['n(Ag⁺) = 0,00500 mol (subtema 12).', `m(AgCl) = ${rengTx(rengR)} g.`], pistas: ['Calcula los moles de Ag⁺.', 'Proporción 1:1.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-neutralizacion-2', titulo: 'Ácido diprótico', enunciado: 'Se neutralizan 20,0 mL de H₂SO₄ 0,0500 mol/L con NaOH 0,100 mol/L.', pregunta: '¿Qué volumen de NaOH se necesita, en mL?', datos: [['H₂SO₄', '20,0 mL, 0,0500 mol/L'], ['NaOH', '0,100 mol/L']], unidad: 'mL',
    analitico: () => (20 * 0.05 * 2) / 0.1, segundo: () => rengBiseccion((rengV) => 0.1 * rengV - prop('H2SO4 + NaOH -> Na2SO4 + H2O', 'H2SO4', 'NaOH', 20 * 0.05), 0, 1000), metodoSegundo: 'bisección con los coeficientes del núcleo',
    pasos: (rengR) => ['H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O (subtema 13).', `V = ${rengTx(rengR)} mL.`], pistas: ['Ajusta la ecuación.', 'Dos NaOH por ácido.', 'Divide entre la concentración.'] }),
  ej({ id: 'ej-rq-combustion-2', titulo: 'Oxígeno para el etanol', enunciado: 'Se queman 23,0 g de etanol, C₂H₆O.', pregunta: '¿Qué masa de O₂ se consume, en g?', datos: [['C₂H₆O', '23,0 g']], unidad: 'g',
    analitico: () => (23 / M('C2H6O')) * 3 * M('O2'), segundo: () => rengLecturasCombustion({ x: 2, y: 6, z: 1, n: 23 / (2 * A('C') + 6 * A('H') + A('O')) }).mo2!, metodoSegundo: 'escena «combustion» con los mismos moles',
    pasos: (rengR) => ['C₂H₆O + 3 O₂ → 2 CO₂ + 3 H₂O (subtemas 6 y 14).', `m(O₂) = ${rengTx(rengR)} g.`], pistas: ['Ajusta la combustión.', 'Tres O₂ por etanol.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-reversible-2', titulo: 'Yoduro de hidrógeno', enunciado: 'H₂ + I₂ ⇌ 2 HI. Se parte de 1,00 mol de cada reactivo y reacciona el 78,0 % hasta el equilibrio.', pregunta: '¿Cuántos moles de HI hay en el equilibrio?', datos: [['H₂ e I₂', '1,00 mol cada uno'], ['Conversión', '78,0 %']], unidad: 'mol',
    analitico: () => 2 * 0.78, segundo: () => prop('H2 + I2 -> HI', 'H2', 'HI', 0.78), metodoSegundo: 'coeficientes del módulo de ajuste del núcleo',
    pasos: (rengR) => ['La reacción se detiene en el equilibrio: quedan 0,22 mol de cada reactivo (subtema 15).', `n(HI) = ${rengTx(rengR)} mol.`], pistas: ['Calcula lo que reacciona.', 'Un H₂ da dos HI.', 'No todo se transforma.'] }),
  ej({ id: 'ej-rq-exotermica-2', titulo: 'Calentar agua con metano', enunciado: 'Se queman 1,60 g de CH₄ (ΔH = −890 kJ/mol) y todo el calor va a 1000 g de agua, c = 4,184 J/(g·K).', pregunta: '¿Cuánto sube la temperatura del agua, en K?', datos: [['CH₄', '1,60 g'], ['Agua', '1000 g']], unidad: 'K',
    analitico: () => ((1.6 / (A('C') + 4 * A('H'))) * 890000) / (1000 * 4.184), segundo: () => rengBiseccion((rengDt) => 1000 * 4.184 * rengDt - (1.6 / M('CH4')) * 890000, 0, 500), metodoSegundo: 'bisección del balance de calor con la masa molar del núcleo',
    pasos: (rengR) => ['q = n·|ΔH| (subtema 16) = m·c·ΔT (bloque 11).', `ΔT = ${rengTx(rengR)} K.`], pistas: ['Calcula el calor liberado.', 'Pásalo a julios.', 'ΔT = q/(m·c).'] }),
  ej({ id: 'ej-rq-endotermica-2', titulo: 'Energía de la fotosíntesis', enunciado: '6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂, ΔH = +2803 kJ por mol de glucosa.', pregunta: '¿Cuánta energía hace falta para formar 18,0 g de glucosa, en kJ?', datos: [['Glucosa', '18,0 g'], ['ΔH', '+2803 kJ/mol']], unidad: 'kJ',
    analitico: () => (18 / (6 * A('C') + 12 * A('H') + 6 * A('O'))) * 2803, segundo: () => rengBiseccion((rengQ) => rengQ / 2803 - 18 / M('C6H12O6'), 0, 10000), metodoSegundo: 'bisección con la masa molar del núcleo',
    pasos: (rengR) => ['La fotosíntesis absorbe energía (subtema 17).', `q = ${rengTx(rengR)} kJ.`], pistas: ['Pasa la glucosa a moles.', 'Multiplica por ΔH.', 'Endotérmica: absorbe.'] }),
  ej({ id: 'ej-rq-oxidacion-2', titulo: 'Azufre que se oxida', enunciado: 'El sulfuro de hidrógeno arde: H₂S → SO₂ (el azufre cambia de número de oxidación).', pregunta: '¿Cuántos electrones pierde cada átomo de azufre?', datos: [['Inicial', 'H₂S'], ['Final', 'SO₂']], unidad: '',
    analitico: () => 4 - -2, segundo: () => rengOxRq('SO2', 'S') - rengOxRq('H2S', 'S'), metodoSegundo: 'números de oxidación del núcleo',
    pasos: (rengR) => ['S: −2 en H₂S y +4 en SO₂ (subtemas 2 del bloque 5 y 18).', `Pierde ${rengTx(rengR)} electrones: se oxida.`], pistas: ['Calcula los dos números de oxidación.', 'Resta los dos valores.', 'Aumentar es oxidarse.'] }),
  ej({ id: 'ej-rq-oxidantes-2', titulo: 'Permanganato necesario', enunciado: 'En medio ácido, el MnO₄⁻ oxida al Fe²⁺. Hay que oxidar 0,0100 mol de Fe²⁺ con KMnO₄.', pregunta: '¿Qué masa de KMnO₄ se necesita, en g?', datos: [['Fe²⁺', '0,0100 mol']], unidad: 'g',
    analitico: () => (0.01 / 5) * M('KMnO4'), segundo: () => ((0.01 * rengCoefRedoxDe('MnO4- + Fe2+ -> Mn2+ + Fe3+', 'acido', 'MnO4-')) / rengCoefRedoxDe('MnO4- + Fe2+ -> Mn2+ + Fe3+', 'acido', 'Fe2+')) * M('KMnO4'), metodoSegundo: 'coeficientes del ion-electrón del núcleo',
    pasos: (rengR) => ['MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O (subtemas 7 y 19).', `m(KMnO₄) = ${rengTx(rengR)} g.`], pistas: ['Ajusta por ion-electrón.', 'Un MnO₄⁻ por cinco Fe²⁺.', 'Pasa a gramos.'] }),
  ej({ id: 'ej-rq-reductores-2', titulo: 'Electrones que cede el aluminio', enunciado: 'El aluminio actúa como reductor y pasa a Al³⁺. Reaccionan 2,70 g de Al.', pregunta: '¿Cuántos moles de electrones cede?', datos: [['Al', '2,70 g']], unidad: 'mol',
    analitico: () => (2.7 / A('Al')) * 3, segundo: () => (2.7 / A('Al')) * (rengOxRq('AlCl3', 'Al') - 0), metodoSegundo: 'número de oxidación del Al en una sal con el núcleo',
    pasos: (rengR) => ['Cada Al cede 3 e⁻: es el reductor (subtema 20).', `n(e⁻) = ${rengTx(rengR)} mol.`], pistas: ['Pasa el Al a moles.', 'Cada Al cede tres.', 'Multiplica.'] })
]
