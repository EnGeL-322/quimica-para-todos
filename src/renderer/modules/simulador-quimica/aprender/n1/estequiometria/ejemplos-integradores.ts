import { rengAjustarEcuacion } from '../../../nucleo/ajuste'
import { RENG_KB, rengReactivoLimitante } from '../../../nucleo/estequiometria'
import { rengBiseccion } from '../numericos'
import type { RengEjemploN1 } from '../tipos'
import { RENG_R_SI } from '../gases/constantes'
import { RENG_NA_EST, rengK, rengMasaAtomica, rengMm, rengSumaManual, rengTx, rengVolumenGas } from './datos'

const RENG_TOL = { rel: 0.005, abs: 1e-12 }

const M_CH4 = rengMm('CH4')
const M_H2 = rengMm('H2')
const M_O2 = rengMm('O2')
const M_CAOH2 = rengMm('Ca(OH)2')
const M_GLU = rengMm('C6H12O6')
const M_H2O = rengMm('H2O')
const M_CUSO4 = rengMm('CuSO4')
const M_NH4NO3 = rengMm('NH4NO3')
const M_CO2 = rengMm('CO2')
const M_C3H8 = rengMm('C3H8')
const M_NAHCO3 = rengMm('NaHCO3')
const M_NA2CO3 = rengMm('Na2CO3')
const M_FE = rengMm('Fe')
const M_S = rengMm('S')
const M_FES = rengMm('FeS')
const M_CACO3 = rengMm('CaCO3')
const M_CACL2 = rengMm('CaCl2')
const M_FE2O3 = rengMm('Fe2O3')
const M_MG = rengMm('Mg')
const M_MGO = rengMm('MgO')
const M_ZN = rengMm('Zn')
const M_MGCO3 = rengMm('MgCO3')
const M_H2O2 = rengMm('H2O2')

const rengMolesCO2Mezcla = (rengX: number): number => rengX / M_CACO3 + (5 - rengX) / M_MGCO3
const RENG_N_CO2_MEZCLA = 2.4 / M_CO2

export const RENG_EJEMPLOS_ESTEQUIOMETRIA_INTEGRADORES: readonly RengEjemploN1[] = [
  {
    id: 'ej-est-mol-2',
    titulo: 'Átomos de hidrógeno en una muestra de metano',
    enunciado: 'Se tienen 0,250 mol de metano, CH₄.',
    pregunta: '¿Cuántos átomos de hidrógeno contienen?',
    datos: [['Cantidad de CH₄', '0,250 mol'], ['Átomos de H por molécula', '4'], ['N_A', '6,02214076·10²³ mol⁻¹']],
    unidad: '',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 0.25 * 4 * RENG_NA_EST,
    segundo: () => ((0.25 * M_CH4) / (M_CH4 / RENG_NA_EST)) * 4,
    metodoSegundo: 'masa de la muestra (n·M) dividida entre la masa de una molécula (M/N_A) y multiplicada por 4 átomos de H',
    pasos: (rengR) => [`Moléculas: 0,250 mol × 6,022·10²³ = ${rengTx(0.25 * RENG_NA_EST)}.`, 'Cada molécula de CH₄ tiene 4 átomos de hidrógeno (y aquí se integra la lectura de la fórmula).', `Átomos de H: ${rengTx(0.25 * RENG_NA_EST)} × 4 = ${rengTx(rengR)}.`],
    pistas: ['Pasa primero los moles a moléculas.', 'Lee en la fórmula cuántos H tiene cada molécula.', 'Multiplica moléculas por átomos de H por molécula.']
  },
  {
    id: 'ej-est-avogadro-2',
    titulo: 'Más moléculas en un gramo de hidrógeno',
    enunciado: `Se comparan 1,00 g de hidrógeno (H₂, ${rengTx(M_H2, 4)} g/mol) y 1,00 g de oxígeno (O₂, ${rengTx(M_O2, 4)} g/mol). Masas de la tabla de la app.`,
    pregunta: '¿Cuántas veces más moléculas hay en el gramo de hidrógeno?',
    datos: [['Masa de cada muestra', '1,00 g'], ['M(H₂)', `${rengTx(M_H2, 4)} g/mol`], ['M(O₂)', `${rengTx(M_O2, 4)} g/mol`]],
    unidad: '',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => M_O2 / M_H2,
    segundo: () => ((1 / M_H2) * RENG_NA_EST) / ((1 / M_O2) * RENG_NA_EST),
    metodoSegundo: 'número de moléculas de cada muestra calculado por separado (m/M·N_A) y cociente de los dos',
    pasos: (rengR) => ['A igual masa, el número de moléculas es inverso a la masa molar: N = (m/M)·N_A.', `N(H₂)/N(O₂) = M(O₂)/M(H₂) = ${rengTx(M_O2, 4)} / ${rengTx(M_H2, 4)} = ${rengTx(rengR)}.`, 'Las moléculas de hidrógeno son mucho más ligeras, así que caben muchas más en un gramo.'],
    pistas: ['¿Cuántos moles hay en cada gramo?', 'El número de moléculas es proporcional a los moles.', 'Se cancelan la masa y N_A.']
  },
  {
    id: 'ej-est-masa-molar-2',
    titulo: 'Pesar 0,350 mol de hidróxido de calcio',
    enunciado: `Hay que pesar 0,350 mol de Ca(OH)₂ para una práctica. Masa molar de la tabla de la app: ${rengTx(M_CAOH2, 4)} g/mol.`,
    pregunta: '¿Cuántos gramos hay que pesar?',
    datos: [['Cantidad', '0,350 mol'], ['M(Ca(OH)₂)', `${rengTx(M_CAOH2, 4)} g/mol`]],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 0.35 * M_CAOH2,
    segundo: () => 0.35 * RENG_NA_EST * (rengSumaManual([['Ca', 1], ['O', 2], ['H', 2]]) / RENG_NA_EST),
    metodoSegundo: 'número de fórmulas unidad por la masa de cada una, con la masa molar sumada a mano',
    pasos: (rengR) => ['La masa molar convierte moles en gramos: m = n·M.', `m = 0,350 mol × ${rengTx(M_CAOH2, 4)} g/mol = ${rengTx(rengR)} g.`],
    pistas: ['¿Qué magnitud pasa de moles a gramos?', 'Masa = moles × masa molar: m = n · M.', 'Comprueba que se cancelan los moles.']
  },
  {
    id: 'ej-est-masa-molecular-2',
    titulo: 'Moléculas de agua que pesan como una de glucosa',
    enunciado: `Masas moleculares relativas de la tabla de la app: glucosa ${rengTx(M_GLU, 5)}, agua ${rengTx(M_H2O, 5)}.`,
    pregunta: '¿Cuántas moléculas de agua tienen, juntas, la masa de una molécula de glucosa?',
    datos: [['M_r de la glucosa', rengTx(M_GLU, 5)], ['M_r del agua', rengTx(M_H2O, 5)]],
    unidad: '',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => M_GLU / M_H2O,
    segundo: () => (M_GLU / RENG_NA_EST) / (M_H2O / RENG_NA_EST),
    metodoSegundo: 'masa de cada molécula en gramos (M/N_A) y cociente de las dos masas',
    pasos: (rengR) => ['Las masas moleculares relativas comparan masas de moléculas.', `Cociente: ${rengTx(M_GLU, 5)} / ${rengTx(M_H2O, 5)} = ${rengTx(rengR)}.`, 'Una molécula de glucosa pesa como unas diez de agua.'],
    pistas: ['Compara las dos masas moleculares.', 'Divide la mayor entre la menor.', 'El resultado no tiene unidades.']
  },
  {
    id: 'ej-est-masa-formula-2',
    titulo: 'Agua en un hidrato: CuSO₄·5H₂O',
    enunciado: `El sulfato de cobre pentahidratado contiene 5 moléculas de agua por fórmula unidad. Masas de la tabla de la app: CuSO₄ ${rengTx(M_CUSO4, 5)}, H₂O ${rengTx(M_H2O, 5)}.`,
    pregunta: '¿Qué porcentaje de su masa es agua?',
    datos: [['Fórmula', 'CuSO₄·5H₂O'], ['Masa de CuSO₄', rengTx(M_CUSO4, 5)], ['Masa de H₂O', rengTx(M_H2O, 5)]],
    unidad: '%',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (100 * 5 * M_H2O) / (M_CUSO4 + 5 * M_H2O),
    segundo: () => (100 * (10 * rengMasaAtomica('H') + 5 * rengMasaAtomica('O'))) / rengSumaManual([['Cu', 1], ['S', 1], ['O', 9], ['H', 10]]),
    metodoSegundo: 'masa fórmula sumada átomo a átomo (Cu, S, 9 O, 10 H) y masa del agua a partir de 10 H y 5 O',
    pasos: (rengR) => [`Masa fórmula del hidrato: ${rengTx(M_CUSO4, 5)} + 5 × ${rengTx(M_H2O, 5)} = ${rengTx(M_CUSO4 + 5 * M_H2O, 5)}.`, `Masa del agua: 5 × ${rengTx(M_H2O, 5)} = ${rengTx(5 * M_H2O, 5)}.`, `% agua = ${rengTx(rengR)} %. Al calentar el hidrato, pierde esa fracción de su masa.`],
    pistas: ['El punto de la fórmula suma las 5 moléculas de agua.', 'Calcula la masa fórmula completa.', 'Divide la masa del agua entre la total.']
  },
  {
    id: 'ej-est-composicion-2',
    titulo: 'Nitrógeno en un saco de fertilizante',
    enunciado: `Un saco contiene 2,00 kg de NH₄NO₃ puro. Masa molar de la tabla de la app: ${rengTx(M_NH4NO3, 4)} g/mol.`,
    pregunta: '¿Qué masa de nitrógeno aporta, en g?',
    datos: [['Masa de NH₄NO₃', '2,00 kg'], ['M(NH₄NO₃)', `${rengTx(M_NH4NO3, 4)} g/mol`]],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (2000 * 2 * rengMasaAtomica('N')) / M_NH4NO3,
    segundo: () => (2000 / M_NH4NO3) * 2 * rengMm('N'),
    metodoSegundo: 'moles de fertilizante, dos moles de átomos de N por mol y masa con la masa molar del N',
    pasos: (rengR) => [`%N = ${rengTx((200 * rengMasaAtomica('N')) / M_NH4NO3)} % (subtema 6).`, `Masa de N = 2000 g × ${rengTx((2 * rengMasaAtomica('N')) / M_NH4NO3, 4)} = ${rengTx(rengR)} g.`],
    pistas: ['Calcula la fracción en masa de nitrógeno.', 'Pasa los kilogramos a gramos.', 'Multiplica la masa del saco por esa fracción.']
  },
  {
    id: 'ej-est-formula-empirica-2',
    titulo: 'Fórmula empírica por combustión',
    enunciado: 'Al quemar 0,250 g de un compuesto con C, H y O se obtienen 0,366 g de CO₂ y 0,150 g de H₂O (datos didácticos).',
    pregunta: '¿Cuántos átomos de H hay por cada átomo de C?',
    datos: [['Masa de CO₂', '0,366 g'], ['Masa de H₂O', '0,150 g'], ['Masas molares', `CO₂ ${rengTx(M_CO2, 4)}, H₂O ${rengTx(M_H2O, 4)} g/mol`]],
    unidad: '',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => ((2 * 0.15) / M_H2O) / (0.366 / M_CO2),
    segundo: () => {
      const rengMC = 0.366 * (rengMasaAtomica('C') / M_CO2)
      const rengMH = 0.15 * ((2 * rengMasaAtomica('H')) / M_H2O)
      return rengMH / rengMasaAtomica('H') / (rengMC / rengMasaAtomica('C'))
    },
    metodoSegundo: 'masas de C y de H contenidas en el CO₂ y el agua (fracciones en masa) y paso de cada masa a moles de átomos',
    pasos: (rengR) => [`Todo el C acaba en CO₂: n(C) = 0,366 / ${rengTx(M_CO2, 4)} = ${rengTx(0.366 / M_CO2, 4)} mol.`, `Todo el H acaba en agua, con 2 H por molécula: n(H) = 2 × 0,150 / ${rengTx(M_H2O, 4)} = ${rengTx(0.3 / M_H2O, 4)} mol.`, `H/C = ${rengTx(rengR)} ≈ 2: la fórmula empírica tiene dos H por cada C.`],
    pistas: ['¿Adónde va todo el carbono al quemar?', 'Cada molécula de agua tiene dos átomos de H.', 'Compara moles de átomos, no masas.']
  },
  {
    id: 'ej-est-formula-molecular-2',
    titulo: 'Fórmula molecular desde la composición y la masa molar',
    enunciado: 'Un hidrocarburo tiene 85,6 % de C y 14,4 % de H en masa, y su masa molar es 56,1 g/mol (datos didácticos).',
    pregunta: '¿Cuántos átomos de carbono tiene cada molécula?',
    datos: [['Carbono', '85,6 %'], ['Hidrógeno', '14,4 %'], ['Masa molar', '56,1 g/mol']],
    unidad: '',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => Math.round((56.1 * 0.856) / rengMasaAtomica('C')),
    segundo: () => {
      const rengRazon = (14.4 / rengMasaAtomica('H')) / (85.6 / rengMasaAtomica('C'))
      const rengUnidad = rengMasaAtomica('C') + Math.round(rengRazon) * rengMasaAtomica('H')
      return Math.round(56.1 / rengUnidad)
    },
    metodoSegundo: 'fórmula empírica (CH₂) a partir de los porcentajes y número de unidades empíricas en la masa molar',
    pasos: (rengR) => [`Masa de C en un mol: 56,1 × 0,856 = ${rengTx(56.1 * 0.856, 4)} g → ${rengTx((56.1 * 0.856) / rengMasaAtomica('C'), 4)} mol de átomos de C.`, `Redondeando, ${rengR} átomos de C por molécula; con el mismo cálculo salen ${Math.round((56.1 * 0.144) / rengMasaAtomica('H'))} de H: C${rengR}H${Math.round((56.1 * 0.144) / rengMasaAtomica('H'))}.`, 'La fórmula empírica es CH₂ y la molecular, cuatro veces esa unidad.'],
    pistas: ['Calcula la masa de carbono en un mol.', 'Pásala a moles de átomos de C.', 'Redondea al entero más cercano.']
  },
  {
    id: 'ej-est-mol-mol-2',
    titulo: 'Hidrógeno para fabricar amoníaco',
    enunciado: 'En la síntesis N₂ + 3 H₂ → 2 NH₃ se quieren obtener 5,00 mol de amoníaco.',
    pregunta: '¿Cuántos moles de hidrógeno hacen falta?',
    datos: [['Ecuación', 'N₂ + 3 H₂ → 2 NH₃'], ['Amoníaco', '5,00 mol']],
    unidad: 'mol',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (5 * 3) / 2,
    segundo: () => rengBiseccion((rengX) => rengReactivoLimitante(rengAjustarEcuacion('N2 + H2 = NH3'), [{ indice: 0, moles: 1e6 }, { indice: 1, moles: rengX }]).productos[0]!.moles - 5, 0, 100),
    metodoSegundo: 'búsqueda por bisección de la cantidad de H₂ que, con nitrógeno en exceso, hace que la función del núcleo para el limitante dé 5,00 mol de NH₃',
    pasos: (rengR) => ['Razón molar: 3 mol de H₂ por cada 2 mol de NH₃.', `n(H₂) = 5,00 × 3/2 = ${rengTx(rengR)} mol.`, 'Comprobación con átomos: 5,00 × 3 = 15,0 mol de H, y cada H₂ aporta 2.'],
    pistas: ['Lee los coeficientes de H₂ y de NH₃.', 'La razón es 3 : 2.', 'Multiplica por 3 y divide entre 2.']
  },
  {
    id: 'ej-est-masa-masa-2',
    titulo: 'Oxígeno que consume la combustión del propano',
    enunciado: `Se queman 10,0 g de propano: C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O. Masas molares de la tabla de la app: C₃H₈ ${rengTx(M_C3H8, 4)}, O₂ ${rengTx(M_O2, 4)}, CO₂ ${rengTx(M_CO2, 4)}, H₂O ${rengTx(M_H2O, 4)} g/mol.`,
    pregunta: '¿Qué masa de oxígeno se consume, en g?',
    datos: [['Masa de propano', '10,0 g'], ['Ecuación', 'C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (10 / M_C3H8) * 5 * M_O2,
    segundo: () => {
      const rengN = 10 / M_C3H8
      return rengN * 3 * M_CO2 + rengN * 4 * M_H2O - 10
    },
    metodoSegundo: 'conservación de la masa: masa de productos (CO₂ y agua) menos masa de propano',
    pasos: (rengR) => [`Moles de propano: ${rengTx(10 / M_C3H8, 4)} mol.`, `O₂ necesario: 5 × ${rengTx(10 / M_C3H8, 4)} = ${rengTx(50 / M_C3H8, 4)} mol.`, `Masa: ${rengTx(50 / M_C3H8, 4)} × ${rengTx(M_O2, 4)} = ${rengTx(rengR)} g; se gasta más masa de oxígeno que de combustible.`],
    pistas: ['Pasa el propano a moles.', 'Razón 5 O₂ : 1 C₃H₈.', 'Vuelve a gramos con la masa molar del O₂.']
  },
  {
    id: 'ej-est-masa-mol-2',
    titulo: 'Bicarbonato para obtener un volumen de gas',
    enunciado: `Se quieren obtener 0,150 mol de CO₂ calentando bicarbonato: 2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂. Masa molar del NaHCO₃ (tabla de la app): ${rengTx(M_NAHCO3, 4)} g/mol.`,
    pregunta: '¿Qué masa de NaHCO₃ hay que calentar, en g?',
    datos: [['CO₂ deseado', '0,150 mol'], ['Ecuación', '2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 0.15 * 2 * M_NAHCO3,
    segundo: () => 0.15 * M_NA2CO3 + 0.15 * M_H2O + 0.15 * M_CO2,
    metodoSegundo: 'conservación de la masa: suma de las masas de Na₂CO₃, agua y CO₂ que se forman con un avance de 0,150 mol',
    pasos: (rengR) => ['Razón: 2 mol de NaHCO₃ por cada mol de CO₂.', `n(NaHCO₃) = 2 × 0,150 = 0,300 mol.`, `m = 0,300 × ${rengTx(M_NAHCO3, 4)} = ${rengTx(rengR)} g.`],
    pistas: ['Lee la razón entre NaHCO₃ y CO₂.', 'Calcula los moles de bicarbonato.', 'Pásalos a gramos.']
  },
  {
    id: 'ej-est-volumen-volumen-2',
    titulo: 'Amoníaco a partir de dos volúmenes de gas',
    enunciado: 'Se mezclan 10,0 L de N₂ y 24,0 L de H₂, medidos a la misma P y T, y reaccionan por completo según N₂ + 3 H₂ → 2 NH₃.',
    pregunta: '¿Qué volumen de NH₃ se forma, medido igual, en L?',
    datos: [['Nitrógeno', '10,0 L'], ['Hidrógeno', '24,0 L'], ['Ecuación', 'N₂ + 3 H₂ → 2 NH₃']],
    unidad: 'L',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 2 * Math.min(10 / 1, 24 / 3),
    segundo: () => rengReactivoLimitante(rengAjustarEcuacion('N2 + H2 = NH3'), [{ indice: 0, moles: 10 }, { indice: 1, moles: 24 }]).productos[0]!.moles,
    metodoSegundo: 'función del núcleo para el reactivo limitante usando los volúmenes como si fueran moles (son proporcionales a igual P y T)',
    pasos: (rengR) => ['A igual P y T los volúmenes se tratan como moles (subtema 12) y hay que buscar el limitante (subtema 13).', 'Cocientes: N₂ 10,0/1 = 10,0; H₂ 24,0/3 = 8,00. El H₂ es el limitante.', `V(NH₃) = 2 × 8,00 = ${rengTx(rengR)} L. Sobran 2,00 L de N₂.`],
    pistas: ['Trata los volúmenes como moles.', 'Divide cada volumen entre su coeficiente.', 'El menor cociente marca el limitante.']
  },
  {
    id: 'ej-est-limitante-2',
    titulo: 'Hierro y azufre',
    enunciado: `Se calientan 10,0 g de hierro con 8,00 g de azufre: Fe + S → FeS. Masas molares de la tabla de la app: Fe ${rengTx(M_FE, 4)}, S ${rengTx(M_S, 4)}, FeS ${rengTx(M_FES, 4)} g/mol.`,
    pregunta: '¿Qué masa de FeS se forma como máximo, en g?',
    datos: [['Hierro', '10,0 g'], ['Azufre', '8,00 g'], ['Ecuación', 'Fe + S → FeS']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => Math.min(10 / M_FE, 8 / M_S) * M_FES,
    segundo: () => rengReactivoLimitante(rengAjustarEcuacion('Fe + S = FeS'), [{ indice: 0, moles: 10 / M_FE }, { indice: 1, moles: 8 / M_S }]).productos[0]!.masa,
    metodoSegundo: 'función del núcleo para el reactivo limitante con la ecuación ajustada por el motor',
    pasos: (rengR) => [`Moles: Fe ${rengTx(10 / M_FE, 4)}; S ${rengTx(8 / M_S, 4)}. La razón es 1 : 1.`, 'Hay menos moles de hierro: el hierro es el limitante, aunque su masa sea mayor.', `FeS: ${rengTx(10 / M_FE, 4)} mol × ${rengTx(M_FES, 4)} = ${rengTx(rengR)} g.`],
    pistas: ['No compares gramos: compara moles.', 'Con razón 1 : 1, limita el que tenga menos moles.', 'Masa de producto con la masa molar del FeS.']
  },
  {
    id: 'ej-est-exceso-2',
    titulo: 'Azufre que sobra',
    enunciado: `Con 10,0 g de Fe y 8,00 g de S (Fe + S → FeS), el hierro es el limitante. Masas molares: Fe ${rengTx(M_FE, 4)}, S ${rengTx(M_S, 4)} g/mol (tabla de la app).`,
    pregunta: '¿Qué masa de azufre queda sin reaccionar, en g?',
    datos: [['Hierro', '10,0 g'], ['Azufre', '8,00 g']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 8 - (10 / M_FE) * M_S,
    segundo: () => 10 + 8 - (10 / M_FE) * M_FES,
    metodoSegundo: 'conservación de la masa: masa inicial total menos la masa de FeS formada',
    pasos: (rengR) => [`Azufre consumido: ${rengTx(10 / M_FE, 4)} mol × ${rengTx(M_S, 4)} = ${rengTx((10 / M_FE) * M_S, 4)} g.`, `Sobra: 8,00 − ${rengTx((10 / M_FE) * M_S, 4)} = ${rengTx(rengR)} g.`],
    pistas: ['¿Cuánto azufre consume todo el hierro?', 'Razón 1 : 1 en moles.', 'Resta de la masa inicial.']
  },
  {
    id: 'ej-est-rendimiento-teorico-2',
    titulo: 'Rendimiento teórico con un limitante',
    enunciado: `Se añaden 5,00 g de CaCO₃ a una disolución con 0,0800 mol de HCl: CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂. Masas molares de la tabla de la app: CaCO₃ ${rengTx(M_CACO3, 4)}, CaCl₂ ${rengTx(M_CACL2, 4)} g/mol.`,
    pregunta: '¿Cuál es el rendimiento teórico de CaCl₂, en g?',
    datos: [['CaCO₃', '5,00 g'], ['HCl', '0,0800 mol'], ['Ecuación', 'CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => Math.min(5 / M_CACO3, 0.08 / 2) * M_CACL2,
    segundo: () => rengReactivoLimitante(rengAjustarEcuacion('CaCO3 + HCl = CaCl2 + H2O + CO2'), [{ indice: 0, moles: 5 / M_CACO3 }, { indice: 1, moles: 0.08 }]).productos.find((rengP) => rengP.entrada === 'CaCl2')!.masa,
    metodoSegundo: 'función del núcleo para el reactivo limitante y masa del producto CaCl₂',
    pasos: (rengR) => [`Cocientes: CaCO₃ ${rengTx(5 / M_CACO3, 4)}/1; HCl 0,0800/2 = 0,0400. El HCl es el limitante.`, `CaCl₂: 0,0400 mol × ${rengTx(M_CACL2, 4)} = ${rengTx(rengR)} g.`, 'El rendimiento teórico lo fija el limitante, no el reactivo del que hay más masa.'],
    pistas: ['Busca primero el reactivo limitante.', 'Fíjate en el coeficiente 2 del HCl.', 'El producto sale del limitante.']
  },
  {
    id: 'ej-est-rendimiento-real-2',
    titulo: 'Cuánto óxido hace falta para 500 g de hierro',
    enunciado: `Se quieren obtener 500 g de hierro con Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂ y un rendimiento del 85,0 % (didáctico). Masas molares de la tabla de la app: Fe₂O₃ ${rengTx(M_FE2O3, 4)}, Fe ${rengTx(M_FE, 4)} g/mol.`,
    pregunta: '¿Qué masa de Fe₂O₃ hay que usar, en g?',
    datos: [['Hierro deseado', '500 g'], ['Rendimiento', '85,0 %']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => ((500 / 0.85) / M_FE / 2) * M_FE2O3,
    segundo: () => (500 / 0.85) / ((2 * M_FE) / rengSumaManual([['Fe', 2], ['O', 3]])),
    metodoSegundo: 'fracción en masa de hierro en el óxido (sumada a mano) aplicada al rendimiento teórico necesario',
    pasos: (rengR) => [`Con un 85,0 %, el rendimiento teórico debe ser 500 / 0,850 = ${rengTx(500 / 0.85, 4)} g de Fe.`, `Moles de Fe: ${rengTx(500 / 0.85 / M_FE, 4)}; de óxido, la mitad: ${rengTx(500 / 0.85 / M_FE / 2, 4)} mol.`, `Masa de Fe₂O₃: ${rengTx(rengR)} g.`],
    pistas: ['Primero el rendimiento teórico necesario.', 'Divide el real deseado entre 0,850.', 'Después la estequiometría hacia atrás.']
  },
  {
    id: 'ej-est-rendimiento-porcentual-2',
    titulo: 'Rendimiento al quemar magnesio',
    enunciado: `Se queman 2,00 g de magnesio (2 Mg + O₂ → 2 MgO) y se recogen 3,10 g de MgO (datos didácticos). Masas molares de la tabla de la app: Mg ${rengTx(M_MG, 4)}, MgO ${rengTx(M_MGO, 4)} g/mol.`,
    pregunta: '¿Cuál es el rendimiento porcentual?',
    datos: [['Magnesio', '2,00 g'], ['MgO recogido', '3,10 g']],
    unidad: '%',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (3.1 / ((2 / M_MG) * M_MGO)) * 100,
    segundo: () => (3.1 / M_MGO / (2 / M_MG)) * 100,
    metodoSegundo: 'cociente entre los moles de MgO obtenidos y los moles de Mg de partida (razón 1 : 1)',
    pasos: (rengR) => [`Rendimiento teórico: ${rengTx(2 / M_MG, 4)} mol de Mg → ${rengTx(2 / M_MG, 4)} mol de MgO → ${rengTx((2 / M_MG) * M_MGO, 4)} g.`, `R = 3,10 / ${rengTx((2 / M_MG) * M_MGO, 4)} × 100 = ${rengTx(rengR)} %.`],
    pistas: ['Calcula primero el rendimiento teórico.', 'Razón 1 : 1 entre Mg y MgO.', 'Divide real entre teórico.']
  },
  {
    id: 'ej-est-pureza-2',
    titulo: 'Pureza de un cinc a partir del gas',
    enunciado: `Una muestra de 10,0 g de cinc impuro se disuelve en HCl en exceso (Zn + 2 HCl → ZnCl₂ + H₂) y desprende 3,20 L de H₂ seco a 25,0 °C y 101,325 kPa. Las impurezas no desprenden gas (datos didácticos). M(Zn) = ${rengTx(M_ZN, 4)} g/mol (tabla de la app).`,
    pregunta: '¿Qué pureza tiene la muestra, en %?',
    datos: [['Muestra', '10,0 g'], ['H₂', '3,20 L a 25,0 °C y 101,325 kPa']],
    unidad: '%',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (((101.325 * 3.2) / (RENG_R_SI * rengK(25))) * M_ZN * 100) / 10,
    segundo: () => (((101325 * 3.2e-3) / (RENG_KB * rengK(25)) / RENG_NA_EST) * M_ZN * 100) / 10,
    metodoSegundo: 'número de moléculas de H₂ con P·V = N·k_B·T en el SI y paso a moles con N_A',
    pasos: (rengR) => [`Moles de H₂ (subtema 20): n = P·V/(R·T) = ${rengTx((101.325 * 3.2) / (RENG_R_SI * rengK(25)), 4)} mol.`, 'Razón 1 : 1 → los mismos moles de cinc puro.', `Masa de Zn: ${rengTx(((101.325 * 3.2) / (RENG_R_SI * rengK(25))) * M_ZN, 4)} g → pureza ${rengTx(rengR)} %.`],
    pistas: ['Calcula los moles de gas con P·V = n·R·T.', 'Relaciona el gas con el cinc puro.', 'Pureza = masa pura / masa de muestra × 100.']
  },
  {
    id: 'ej-est-mezclas-2',
    titulo: 'Carbonatos de calcio y de magnesio',
    enunciado: `5,00 g de una mezcla de CaCO₃ y MgCO₃ se calientan hasta descomponerse por completo (cada uno da su óxido y CO₂) y desprenden 2,40 g de CO₂ (datos didácticos). Masas molares de la tabla de la app: CaCO₃ ${rengTx(M_CACO3, 4)}, MgCO₃ ${rengTx(M_MGCO3, 4)}, CO₂ ${rengTx(M_CO2, 4)} g/mol.`,
    pregunta: '¿Qué masa de CaCO₃ había en la mezcla, en g?',
    datos: [['Mezcla', '5,00 g'], ['CO₂ desprendido', '2,40 g']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (RENG_N_CO2_MEZCLA - 5 / M_MGCO3) / (1 / M_CACO3 - 1 / M_MGCO3),
    segundo: () => rengBiseccion((rengX) => rengMolesCO2Mezcla(rengX) - RENG_N_CO2_MEZCLA, 0, 5),
    metodoSegundo: 'bisección numérica sobre el balance de moles de CO₂ en función de la masa de CaCO₃',
    pasos: (rengR) => ['Llamando x a la masa de CaCO₃: cada carbonato da 1 mol de CO₂ por mol.', `Balance: x/${rengTx(M_CACO3, 4)} + (5,00 − x)/${rengTx(M_MGCO3, 4)} = 2,40/${rengTx(M_CO2, 4)} = ${rengTx(RENG_N_CO2_MEZCLA, 4)} mol.`, `Despejando: x = ${rengTx(rengR)} g de CaCO₃ (y ${rengTx(5 - rengR)} g de MgCO₃).`],
    pistas: ['Llama x a la masa de uno de los carbonatos.', 'Escribe los moles de CO₂ que da cada uno.', 'Iguala a los moles de CO₂ medidos y despeja.']
  },
  {
    id: 'ej-est-gases-2',
    titulo: 'Oxígeno de un agua oxigenada',
    enunciado: `Se descompone por completo el peróxido de hidrógeno de 50,0 mL de una disolución al 3,00 % (m/v, 3,00 g por cada 100 mL): 2 H₂O₂ → 2 H₂O + O₂. El oxígeno se mide a 25,0 °C y 101,325 kPa. M(H₂O₂) = ${rengTx(M_H2O2, 4)} g/mol (tabla de la app).`,
    pregunta: '¿Qué volumen de O₂ se obtiene, en L?',
    datos: [['Disolución', '50,0 mL al 3,00 % (m/v)'], ['Ecuación', '2 H₂O₂ → 2 H₂O + O₂'], ['Condiciones', '25,0 °C y 101,325 kPa']],
    unidad: 'L',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => rengVolumenGas((1.5 / M_H2O2) / 2, 25, 101.325),
    segundo: () => (((1.5 / M_H2O2 / 2) * RENG_NA_EST * RENG_KB * rengK(25)) / 101325) * 1000,
    metodoSegundo: 'número de moléculas de O₂ y P·V = N·k_B·T en el SI',
    pasos: (rengR) => ['Masa de H₂O₂: 50,0 mL × 3,00 g/100 mL = 1,50 g (como en el subtema 18, solo cuenta la parte que reacciona).', `Moles: 1,50 / ${rengTx(M_H2O2, 4)} = ${rengTx(1.5 / M_H2O2, 4)} mol; O₂, la mitad: ${rengTx(1.5 / M_H2O2 / 2, 4)} mol.`, `V = n·R·T/P = ${rengTx(rengR)} L.`],
    pistas: ['Calcula la masa de peróxido en 50,0 mL.', 'Razón 1 O₂ : 2 H₂O₂.', 'Volumen con P·V = n·R·T.']
  },
  {
    id: 'ej-est-consecutivas-2',
    titulo: 'Caliza necesaria para 50 g de cal apagada',
    enunciado: `Se quiere obtener 50,0 g de Ca(OH)₂ con las dos reacciones CaCO₃ → CaO + CO₂ (90,0 %) y CaO + H₂O → Ca(OH)₂ (95,0 %). Masas molares de la tabla de la app: CaCO₃ ${rengTx(M_CACO3, 4)}, Ca(OH)₂ ${rengTx(M_CAOH2, 4)} g/mol.`,
    pregunta: '¿Qué masa de CaCO₃ hay que calcinar, en g?',
    datos: [['Ca(OH)₂ deseado', '50,0 g'], ['Rendimientos', '90,0 % y 95,0 %']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (50 / M_CAOH2 / (0.9 * 0.95)) * M_CACO3,
    segundo: () => {
      const rengCaONecesario = 50 / M_CAOH2 / 0.95
      return (rengCaONecesario / 0.9) * M_CACO3
    },
    metodoSegundo: 'cálculo hacia atrás paso a paso: CaO necesario para el segundo paso y CaCO₃ necesario para ese CaO',
    pasos: (rengR) => [`Moles de Ca(OH)₂ deseados: ${rengTx(50 / M_CAOH2, 4)} mol.`, 'Rendimiento global: 0,900 × 0,950 = 0,855.', `CaCO₃ necesario: ${rengTx(50 / M_CAOH2, 4)} / 0,855 = ${rengTx(50 / M_CAOH2 / 0.855, 4)} mol → ${rengTx(rengR)} g.`],
    pistas: ['Calcula los moles del producto final.', 'Divide entre el rendimiento global.', 'Pasa a gramos de caliza.']
  }
]

