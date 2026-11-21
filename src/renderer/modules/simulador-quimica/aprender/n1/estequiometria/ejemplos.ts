import { rengReactivoLimitante } from '../../../nucleo/estequiometria'
import { rengAjustarEcuacion } from '../../../nucleo/ajuste'
import type { RengEjemploN1 } from '../tipos'
import { RENG_R_SI } from '../gases/constantes'
import { RENG_NA_EST, rengK, rengMasaAtomica, rengMm, rengSumaManual, rengTextoMasas, rengTx, rengVolumenGas } from './datos'

const RENG_TOL = { rel: 0.005, abs: 1e-12 }

const M_H2O = rengMm('H2O')
const M_CAOH2 = rengMm('Ca(OH)2')
const M_GLU = rengMm('C6H12O6')
const M_NACL = rengMm('NaCl')
const M_NH4NO3 = rengMm('NH4NO3')
const M_C3H8 = rengMm('C3H8')
const M_CO2 = rengMm('CO2')
const M_H2 = rengMm('H2')
const M_O2 = rengMm('O2')
const M_FE2O3 = rengMm('Fe2O3')
const M_FE = rengMm('Fe')
const M_CACO3 = rengMm('CaCO3')
const M_ZN = rengMm('Zn')
const M_CAO = rengMm('CaO')
const M_NAHCO3 = rengMm('NaHCO3')

const RENG_EMP = { C: 40.0, H: 6.71, O: 53.29 }
const rengMolesEmp = (rengX: typeof RENG_EMP): [number, number, number] => [rengX.C / rengMasaAtomica('C'), rengX.H / rengMasaAtomica('H'), rengX.O / rengMasaAtomica('O')]

export const RENG_EJEMPLOS_ESTEQUIOMETRIA: readonly RengEjemploN1[] = [
  {
    id: 'ej-est-mol',
    titulo: 'Contar moléculas en moles',
    enunciado: 'Una muestra de agua contiene 3,01·10²⁴ moléculas.',
    pregunta: '¿Cuántos moles de agua son?',
    datos: [['Número de moléculas', '3,01·10²⁴'], ['Constante de Avogadro', '6,02214076·10²³ mol⁻¹']],
    unidad: 'mol',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 3.01e24 / RENG_NA_EST,
    segundo: () => {
      const rengMasa = 3.01e24 * (M_H2O / RENG_NA_EST)
      return rengMasa / M_H2O
    },
    metodoSegundo: 'masa de la muestra calculada molécula a molécula (N · M/N_A) y dividida después entre la masa molar',
    pasos: (rengR) => ['Un mol contiene N_A = 6,02214076·10²³ entidades: n = N / N_A.', `n = 3,01·10²⁴ / 6,022·10²³ mol⁻¹ = ${rengTx(rengR)} mol.`, 'Interpretación: unas cinco «docenas de Avogadro» de moléculas.'],
    pistas: ['¿Cuántas moléculas hay en un mol?', 'Divide el número de moléculas entre N_A.', 'Cuida las potencias de diez al dividir.']
  },
  {
    id: 'ej-est-avogadro',
    titulo: 'Masa de una sola molécula de agua',
    enunciado: `La masa molar del agua es ${rengTx(M_H2O, 5)} g/mol (tabla de la app, sin verificar).`,
    pregunta: '¿Cuál es la masa de una sola molécula de agua, en gramos?',
    datos: [['Masa molar del agua', `${rengTx(M_H2O, 5)} g/mol`], ['Constante de Avogadro', '6,02214076·10²³ mol⁻¹']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => M_H2O / RENG_NA_EST,
    segundo: () => 1 / (RENG_NA_EST / M_H2O),
    metodoSegundo: 'número de moléculas que hay en 1 g de agua (N_A/M) e inverso de ese número',
    pasos: (rengR) => ['Un mol de agua pesa M gramos y contiene N_A moléculas.', `m(molécula) = M / N_A = ${rengTx(M_H2O, 5)} g / 6,022·10²³ = ${rengTx(rengR)} g.`, 'Es tan pequeña que hacen falta unos 3·10²² moléculas para tener un solo gramo.'],
    pistas: ['¿Cuántas moléculas hay en un mol?', 'Reparte la masa de un mol entre sus moléculas.', 'm = M / N_A.']
  },
  {
    id: 'ej-est-masa-molar',
    titulo: 'Masa molar del hidróxido de calcio',
    enunciado: `Se quiere la masa molar del Ca(OH)₂. Masas atómicas de la tabla de la app (sin verificar): ${rengTextoMasas(['Ca', 'O', 'H'])} g/mol.`,
    pregunta: '¿Cuál es la masa molar del Ca(OH)₂, en g/mol?',
    datos: [['Fórmula', 'Ca(OH)₂'], ['Masas atómicas', `${rengTextoMasas(['Ca', 'O', 'H'])} g/mol`]],
    unidad: 'g/mol',
    cifras: 4,
    tolerancia: RENG_TOL,
    analitico: () => rengSumaManual([['Ca', 1], ['O', 2], ['H', 2]]),
    segundo: () => M_CAOH2,
    metodoSegundo: 'masa molar calculada por el analizador de fórmulas de la aplicación a partir de la cadena «Ca(OH)2»',
    pasos: (rengR) => ['El subíndice 2 afecta a todo el grupo OH: hay 1 Ca, 2 O y 2 H.', `M = 1·${rengTx(rengMasaAtomica('Ca'), 5)} + 2·${rengTx(rengMasaAtomica('O'), 5)} + 2·${rengTx(rengMasaAtomica('H'), 4)} = ${rengTx(rengR, 4)} g/mol.`, 'Un mol de Ca(OH)₂ pesa esos gramos.'],
    pistas: ['Cuenta los átomos de cada elemento.', 'El subíndice tras el paréntesis multiplica todo el grupo.', 'Suma cada masa atómica por su número de átomos.']
  },
  {
    id: 'ej-est-masa-molecular',
    titulo: 'Masa molecular de la glucosa',
    enunciado: `La glucosa tiene fórmula C₆H₁₂O₆. Masas atómicas relativas de la tabla de la app: ${rengTextoMasas(['C', 'H', 'O'])}.`,
    pregunta: '¿Cuál es su masa molecular relativa (sin unidades)?',
    datos: [['Fórmula', 'C₆H₁₂O₆'], ['Masas atómicas relativas', rengTextoMasas(['C', 'H', 'O'])]],
    unidad: '',
    cifras: 4,
    tolerancia: RENG_TOL,
    analitico: () => rengSumaManual([['C', 6], ['H', 12], ['O', 6]]),
    segundo: () => 6 * rengMm('CH2O'),
    metodoSegundo: 'seis veces la masa de la unidad CH₂O calculada por el analizador de fórmulas (la glucosa es (CH₂O)₆)',
    pasos: (rengR) => ['La masa molecular relativa suma las masas atómicas relativas de todos los átomos de la molécula.', `M_r = 6·${rengTx(rengMasaAtomica('C'), 5)} + 12·${rengTx(rengMasaAtomica('H'), 4)} + 6·${rengTx(rengMasaAtomica('O'), 5)} = ${rengTx(rengR, 5)}.`, 'Numéricamente coincide con la masa molar en g/mol, pero no tiene unidades.'],
    pistas: ['Cuenta los átomos de cada elemento de la molécula.', 'Multiplica cada masa atómica por su número de átomos.', 'La masa molecular relativa no lleva unidades.']
  },
  {
    id: 'ej-est-masa-formula',
    titulo: 'Masa fórmula del cloruro de sodio',
    enunciado: `El cloruro de sodio es un sólido iónico: no forma moléculas. Masas atómicas relativas de la tabla de la app: ${rengTextoMasas(['Na', 'Cl'])}.`,
    pregunta: '¿Cuál es la masa fórmula relativa del NaCl?',
    datos: [['Fórmula unidad', 'NaCl'], ['Masas atómicas relativas', rengTextoMasas(['Na', 'Cl'])]],
    unidad: '',
    cifras: 4,
    tolerancia: RENG_TOL,
    analitico: () => rengMasaAtomica('Na') + rengMasaAtomica('Cl'),
    segundo: () => M_NACL,
    metodoSegundo: 'masa calculada por el analizador de fórmulas a partir de la cadena «NaCl»',
    pasos: (rengR) => ['En un sólido iónico se usa la fórmula unidad: la proporción más sencilla de iones (1 Na⁺ por cada Cl⁻).', `Masa fórmula = ${rengTx(rengMasaAtomica('Na'), 5)} + ${rengTx(rengMasaAtomica('Cl'), 4)} = ${rengTx(rengR, 4)}.`, 'Se calcula igual que una masa molecular, pero no describe una molécula.'],
    pistas: ['¿Forma moléculas el cloruro de sodio?', 'Usa la fórmula unidad.', 'Suma las masas de un Na y un Cl.']
  },
  {
    id: 'ej-est-composicion',
    titulo: 'Porcentaje de nitrógeno en el nitrato de amonio',
    enunciado: `El nitrato de amonio, NH₄NO₃, se usa como fertilizante. Masas atómicas de la tabla de la app: ${rengTextoMasas(['N', 'H', 'O'])} g/mol.`,
    pregunta: '¿Qué porcentaje en masa de nitrógeno tiene?',
    datos: [['Fórmula', 'NH₄NO₃'], ['Masas atómicas', `${rengTextoMasas(['N', 'H', 'O'])} g/mol`]],
    unidad: '%',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (100 * 2 * rengMasaAtomica('N')) / M_NH4NO3,
    segundo: () => 100 - (100 * (4 * rengMasaAtomica('H') + 3 * rengMasaAtomica('O'))) / rengSumaManual([['N', 2], ['H', 4], ['O', 3]]),
    metodoSegundo: 'cien menos los porcentajes de hidrógeno y oxígeno, con la masa molar sumada a mano',
    pasos: (rengR) => [`Masa molar: M = 2·N + 4·H + 3·O = ${rengTx(M_NH4NO3, 4)} g/mol (hay dos N: uno en NH₄⁺ y otro en NO₃⁻).`, `Masa de nitrógeno por mol: 2 × ${rengTx(rengMasaAtomica('N'), 5)} = ${rengTx(2 * rengMasaAtomica('N'), 4)} g.`, `%N = ${rengTx(2 * rengMasaAtomica('N'), 4)} / ${rengTx(M_NH4NO3, 4)} × 100 = ${rengTx(rengR)} %.`],
    pistas: ['¿Cuántos átomos de N hay en la fórmula?', 'Calcula la masa molar completa.', '% = masa del elemento / masa molar × 100.']
  },
  {
    id: 'ej-est-formula-empirica',
    titulo: 'Fórmula empírica a partir de porcentajes',
    enunciado: 'Un compuesto tiene 40,0 % de C, 6,71 % de H y 53,29 % de O en masa (datos didácticos).',
    pregunta: '¿Cuántos átomos de H hay por cada átomo de C en la fórmula empírica?',
    datos: [['Carbono', '40,0 %'], ['Hidrógeno', '6,71 %'], ['Oxígeno', '53,29 %'], ['Masas atómicas', `${rengTextoMasas(['C', 'H', 'O'])} g/mol`]],
    unidad: '',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => {
      const [rengC, rengH] = rengMolesEmp(RENG_EMP)
      return rengH / rengC
    },
    segundo: () => (RENG_EMP.H / RENG_EMP.C) * (rengMm('C') / rengMm('H')),
    metodoSegundo: 'cociente de porcentajes en masa corregido por el cociente de masas atómicas calculadas por el analizador de fórmulas',
    pasos: (rengR) => {
      const [rengC, rengH, rengO] = rengMolesEmp(RENG_EMP)
      return ['Se toman 100 g: los porcentajes pasan a gramos.', `Moles: C ${rengTx(rengC, 4)}, H ${rengTx(rengH, 4)}, O ${rengTx(rengO, 4)}.`, `Dividiendo entre el menor: C 1, H ${rengTx(rengR)}, O ${rengTx(rengO / rengC)}.`, 'Redondeando a enteros: CH₂O.']
    },
    pistas: ['Toma 100 g de compuesto.', 'Pasa cada masa a moles.', 'Divide todos los moles entre el más pequeño.']
  },
  {
    id: 'ej-est-formula-molecular',
    titulo: 'De la fórmula empírica a la molecular',
    enunciado: `Un azúcar tiene fórmula empírica CH₂O y masa molar 180,2 g/mol (dato didáctico). Masa de CH₂O con la tabla de la app: ${rengTx(rengMm('CH2O'), 4)} g/mol.`,
    pregunta: '¿Por qué número entero hay que multiplicar los subíndices de CH₂O?',
    datos: [['Fórmula empírica', 'CH₂O'], ['Masa molar del compuesto', '180,2 g/mol'], ['Masa de CH₂O', `${rengTx(rengMm('CH2O'), 4)} g/mol`]],
    unidad: '',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => Math.round(180.2 / rengMm('CH2O')),
    segundo: () => Math.round(180.2 / rengSumaManual([['C', 1], ['H', 2], ['O', 1]])),
    metodoSegundo: 'masa de la unidad empírica sumada a mano con las masas atómicas y redondeo del cociente',
    pasos: (rengR) => [`Masa de la unidad empírica: ${rengTx(rengMm('CH2O'), 4)} g/mol.`, `n = 180,2 / ${rengTx(rengMm('CH2O'), 4)} = ${rengTx(180.2 / rengMm('CH2O'), 4)} ≈ ${rengR}.`, `Fórmula molecular: (CH₂O)${rengR} = C${rengR}H${2 * rengR}O${rengR}, la de la glucosa.`],
    pistas: ['Calcula la masa de la fórmula empírica.', 'Divide la masa molar entre ella.', 'El resultado debe ser casi entero.']
  },
  {
    id: 'ej-est-mol-mol',
    titulo: 'Oxígeno para quemar propano',
    enunciado: 'El propano arde según C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O. Se queman 2,50 mol de propano.',
    pregunta: '¿Cuántos moles de oxígeno se consumen?',
    datos: [['Ecuación', 'C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O'], ['Propano', '2,50 mol']],
    unidad: 'mol',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 2.5 * 5,
    segundo: () => rengReactivoLimitante(rengAjustarEcuacion('C3H8 + O2 = CO2 + H2O'), [{ indice: 0, moles: 2.5 }, { indice: 1, moles: 1e6 }]).reactivos[1]!.consumido,
    metodoSegundo: 'ecuación ajustada por el motor de la aplicación y avance de reacción con oxígeno en gran exceso',
    pasos: (rengR) => ['Los coeficientes dan la razón molar: 5 mol de O₂ por cada mol de C₃H₈.', `n(O₂) = 2,50 mol × 5/1 = ${rengTx(rengR)} mol.`],
    pistas: ['Lee los coeficientes de la ecuación ajustada.', 'La razón es 5 O₂ : 1 C₃H₈.', 'Multiplica los moles de propano por esa razón.']
  },
  {
    id: 'ej-est-masa-masa',
    titulo: 'Dióxido de carbono de 10 g de propano',
    enunciado: `Se queman 10,0 g de propano: C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O. Masas molares de la tabla de la app: C₃H₈ ${rengTx(M_C3H8, 4)} g/mol, CO₂ ${rengTx(M_CO2, 4)} g/mol.`,
    pregunta: '¿Qué masa de CO₂ se forma, en g?',
    datos: [['Masa de propano', '10,0 g'], ['Ecuación', 'C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (10 / M_C3H8) * 3 * M_CO2,
    segundo: () => {
      const rengFraccionC = (3 * rengMasaAtomica('C')) / M_C3H8
      const rengMasaC = 10 * rengFraccionC
      return rengMasaC * (M_CO2 / rengMasaAtomica('C'))
    },
    metodoSegundo: 'conservación del carbono: masa de C en el propano y masa de CO₂ que contiene ese carbono',
    pasos: (rengR) => [`Moles de propano: 10,0 / ${rengTx(M_C3H8, 4)} = ${rengTx(10 / M_C3H8, 4)} mol.`, `Razón 3 CO₂ : 1 C₃H₈ → ${rengTx((30 / M_C3H8), 4)} mol de CO₂.`, `Masa: ${rengTx(30 / M_C3H8, 4)} × ${rengTx(M_CO2, 4)} = ${rengTx(rengR)} g.`],
    pistas: ['Pasa la masa de propano a moles.', 'Usa la razón molar de la ecuación.', 'Vuelve a gramos con la masa molar del CO₂.']
  },
  {
    id: 'ej-est-masa-mol',
    titulo: 'Agua que se forma con 5 g de hidrógeno',
    enunciado: `El hidrógeno arde según 2 H₂ + O₂ → 2 H₂O. Se queman 5,00 g de H₂ con oxígeno suficiente. Masa molar del H₂ (tabla de la app): ${rengTx(M_H2, 4)} g/mol.`,
    pregunta: '¿Cuántos moles de agua se forman?',
    datos: [['Masa de H₂', '5,00 g'], ['Ecuación', '2 H₂ + O₂ → 2 H₂O']],
    unidad: 'mol',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (5 / M_H2) * (2 / 2),
    segundo: () => (5 / rengMasaAtomica('H')) / 2,
    metodoSegundo: 'conservación del hidrógeno: moles de átomos de H en 5,00 g y dos átomos de H por molécula de agua',
    pasos: (rengR) => [`n(H₂) = 5,00 / ${rengTx(M_H2, 4)} = ${rengTx(5 / M_H2, 4)} mol.`, 'La razón es 2 H₂O : 2 H₂, es decir, 1 : 1.', `n(H₂O) = ${rengTx(rengR)} mol.`],
    pistas: ['Pasa los gramos de H₂ a moles.', 'Compara los coeficientes de H₂ y de H₂O.', 'La razón aquí es 1 : 1.']
  },
  {
    id: 'ej-est-volumen-volumen',
    titulo: 'Oxígeno para quemar metano, en litros',
    enunciado: 'El metano arde según CH₄ + 2 O₂ → CO₂ + 2 H₂O. Se queman 4,00 L de metano y todos los gases se miden a la misma presión y temperatura.',
    pregunta: '¿Qué volumen de oxígeno se consume, en L?',
    datos: [['Ecuación', 'CH₄ + 2 O₂ → CO₂ + 2 H₂O'], ['Metano', '4,00 L'], ['Condiciones', 'mismas P y T']],
    unidad: 'L',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 4 * 2,
    segundo: () => {
      const rengN = (101.325 * 4) / (RENG_R_SI * 298.15)
      return rengVolumenGas(2 * rengN, 25, 101.325)
    },
    metodoSegundo: 'moles de metano con P·V = n·R·T a 25 °C y 1 atm, razón molar y vuelta a volumen en las mismas condiciones',
    pasos: (rengR) => ['A igual P y T, los volúmenes de gas son proporcionales a los moles (ley de Avogadro).', `V(O₂) = 4,00 L × 2/1 = ${rengTx(rengR)} L.`],
    pistas: ['A igual P y T, volumen y moles son proporcionales.', 'La razón es 2 O₂ : 1 CH₄.', 'No hace falta calcular moles.']
  },
  {
    id: 'ej-est-limitante',
    titulo: 'Quién se agota al formar agua',
    enunciado: `Se hacen reaccionar 10,0 g de H₂ con 64,0 g de O₂: 2 H₂ + O₂ → 2 H₂O. Masas molares de la tabla de la app: H₂ ${rengTx(M_H2, 4)}, O₂ ${rengTx(M_O2, 4)} y H₂O ${rengTx(M_H2O, 4)} g/mol.`,
    pregunta: '¿Qué masa de agua puede formarse como máximo, en g?',
    datos: [['Masa de H₂', '10,0 g'], ['Masa de O₂', '64,0 g'], ['Ecuación', '2 H₂ + O₂ → 2 H₂O']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => Math.min(10 / M_H2 / 2, 64 / M_O2 / 1) * 2 * M_H2O,
    segundo: () => rengReactivoLimitante(rengAjustarEcuacion('H2 + O2 = H2O'), [{ indice: 0, moles: 10 / M_H2 }, { indice: 1, moles: 64 / M_O2 }]).productos[0]!.masa,
    metodoSegundo: 'función del núcleo para el reactivo limitante sobre la ecuación ajustada por el motor',
    pasos: (rengR) => [`Moles: H₂ ${rengTx(10 / M_H2, 4)} mol; O₂ ${rengTx(64 / M_O2, 4)} mol.`, `Cocientes moles/coeficiente: H₂ ${rengTx(10 / M_H2 / 2, 4)}; O₂ ${rengTx(64 / M_O2, 4)}. El menor es el del O₂: el oxígeno es el limitante.`, `Agua: 2 × ${rengTx(64 / M_O2, 4)} mol × ${rengTx(M_H2O, 4)} g/mol = ${rengTx(rengR)} g.`],
    pistas: ['Pasa las dos masas a moles.', 'Divide cada cantidad entre su coeficiente.', 'El menor cociente marca el limitante.']
  },
  {
    id: 'ej-est-exceso',
    titulo: 'Cuánto hidrógeno sobra',
    enunciado: `Con los mismos datos (10,0 g de H₂ y 64,0 g de O₂; 2 H₂ + O₂ → 2 H₂O), el oxígeno es el limitante. Masa molar del H₂: ${rengTx(M_H2, 4)} g/mol.`,
    pregunta: '¿Qué masa de hidrógeno queda sin reaccionar, en g?',
    datos: [['Masa de H₂', '10,0 g'], ['Masa de O₂', '64,0 g'], ['Ecuación', '2 H₂ + O₂ → 2 H₂O']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 10 - 2 * (64 / M_O2) * M_H2,
    segundo: () => {
      const rengAgua = rengReactivoLimitante(rengAjustarEcuacion('H2 + O2 = H2O'), [{ indice: 0, moles: 10 / M_H2 }, { indice: 1, moles: 64 / M_O2 }]).productos[0]!.masa
      return 10 + 64 - rengAgua
    },
    metodoSegundo: 'conservación de la masa: masa inicial total menos la masa de agua formada (el O₂ se agota entero)',
    pasos: (rengR) => [`El O₂ (${rengTx(64 / M_O2, 4)} mol) consume el doble de moles de H₂: ${rengTx(2 * 64 / M_O2, 4)} mol.`, `Masa de H₂ consumida: ${rengTx(2 * 64 / M_O2, 4)} × ${rengTx(M_H2, 4)} = ${rengTx(2 * (64 / M_O2) * M_H2, 4)} g.`, `Sobran 10,0 − ${rengTx(2 * (64 / M_O2) * M_H2, 4)} = ${rengTx(rengR)} g de H₂.`],
    pistas: ['¿Cuánto H₂ consume todo el oxígeno?', 'Usa la razón 2 H₂ : 1 O₂.', 'Resta lo consumido de lo inicial.']
  },
  {
    id: 'ej-est-rendimiento-teorico',
    titulo: 'Hierro que puede obtenerse de un óxido',
    enunciado: `En un alto horno, Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂. Se parte de 1,00 kg de Fe₂O₃ con CO en exceso. Masas molares de la tabla de la app: Fe₂O₃ ${rengTx(M_FE2O3, 4)} y Fe ${rengTx(M_FE, 4)} g/mol.`,
    pregunta: '¿Cuál es el rendimiento teórico de hierro, en g?',
    datos: [['Masa de Fe₂O₃', '1,00 kg'], ['Ecuación', 'Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (1000 / M_FE2O3) * 2 * M_FE,
    segundo: () => 1000 * ((2 * M_FE) / rengSumaManual([['Fe', 2], ['O', 3]])),
    metodoSegundo: 'fracción en masa de hierro en el óxido (todo el hierro pasa al metal) aplicada a 1000 g',
    pasos: (rengR) => [`Moles de Fe₂O₃: 1000 g / ${rengTx(M_FE2O3, 4)} = ${rengTx(1000 / M_FE2O3, 4)} mol.`, 'Cada mol de óxido da 2 mol de Fe.', `Masa de Fe: ${rengTx(2000 / M_FE2O3, 4)} mol × ${rengTx(M_FE, 4)} = ${rengTx(rengR)} g.`],
    pistas: ['Pasa el óxido a moles (en gramos).', 'Razón 2 Fe : 1 Fe₂O₃.', 'Masa de hierro con su masa molar.']
  },
  {
    id: 'ej-est-rendimiento-real',
    titulo: 'Hierro que se obtiene de verdad',
    enunciado: `Del caso anterior, el rendimiento teórico es ${rengTx((1000 / M_FE2O3) * 2 * M_FE, 4)} g de hierro; el proceso tiene un rendimiento del 85,0 % (dato didáctico).`,
    pregunta: '¿Qué masa de hierro se obtiene realmente, en g?',
    datos: [['Rendimiento teórico', `${rengTx((1000 / M_FE2O3) * 2 * M_FE, 4)} g`], ['Rendimiento porcentual', '85,0 %']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (1000 / M_FE2O3) * 2 * M_FE * 0.85,
    segundo: () => (1000 * 0.85 / M_FE2O3) * 2 * M_FE,
    metodoSegundo: 'el rendimiento aplicado al principio (solo reacciona de forma útil el 85 % del óxido) y estequiometría después',
    pasos: (rengR) => ['Rendimiento real = rendimiento teórico × (rendimiento porcentual / 100).', `m_real = ${rengTx((1000 / M_FE2O3) * 2 * M_FE, 4)} g × 0,850 = ${rengTx(rengR)} g.`, 'El resto se pierde en escorias, reacciones secundarias o no llega a reducirse.'],
    pistas: ['¿Qué significa un rendimiento del 85 %?', 'Multiplica el teórico por 0,850.', 'El real nunca supera al teórico.']
  },
  {
    id: 'ej-est-rendimiento-porcentual',
    titulo: 'Rendimiento de una síntesis',
    enunciado: 'En una síntesis, el rendimiento teórico de producto es 12,4 g y se recogen 10,1 g de producto seco y puro (datos didácticos).',
    pregunta: '¿Cuál es el rendimiento porcentual?',
    datos: [['Rendimiento teórico', '12,4 g'], ['Rendimiento real', '10,1 g']],
    unidad: '%',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (10.1 / 12.4) * 100,
    segundo: () => 100 - ((12.4 - 10.1) / 12.4) * 100,
    metodoSegundo: 'cien menos el porcentaje de producto perdido',
    pasos: (rengR) => ['Rendimiento porcentual = real / teórico × 100.', `R = 10,1 / 12,4 × 100 = ${rengTx(rengR)} %.`, 'Un valor por encima del 100 % indicaría producto húmedo, impuro o un error de cálculo.'],
    pistas: ['¿Cuál es el real y cuál el teórico?', 'Divide el real entre el teórico.', 'Multiplica por 100.']
  },
  {
    id: 'ej-est-pureza',
    titulo: 'CO₂ de una caliza impura',
    enunciado: `Una muestra de 50,0 g de caliza contiene un 92,0 % en masa de CaCO₃; el resto no desprende gas (datos didácticos). Al calentar: CaCO₃ → CaO + CO₂. Masas molares de la tabla de la app: CaCO₃ ${rengTx(M_CACO3, 4)} y CO₂ ${rengTx(M_CO2, 4)} g/mol.`,
    pregunta: '¿Qué masa de CO₂ se desprende, en g?',
    datos: [['Masa de muestra', '50,0 g'], ['Pureza', '92,0 % de CaCO₃'], ['Ecuación', 'CaCO₃ → CaO + CO₂']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => ((50 * 0.92) / M_CACO3) * M_CO2,
    segundo: () => 50 * 0.92 - ((50 * 0.92) / M_CACO3) * M_CAO,
    metodoSegundo: 'conservación de la masa: masa de CaCO₃ puro menos la masa de CaO que queda',
    pasos: (rengR) => ['Solo el 92,0 % de la muestra es carbonato: m(CaCO₃) = 50,0 × 0,920 = 46,0 g.', `Moles: 46,0 / ${rengTx(M_CACO3, 4)} = ${rengTx(46 / M_CACO3, 4)} mol; se forman los mismos moles de CO₂.`, `Masa de CO₂: ${rengTx(46 / M_CACO3, 4)} × ${rengTx(M_CO2, 4)} = ${rengTx(rengR)} g.`],
    pistas: ['¿Qué parte de la muestra es carbonato?', 'Pasa esa masa a moles.', 'Razón 1 : 1 entre CaCO₃ y CO₂.']
  },
  {
    id: 'ej-est-mezclas',
    titulo: 'Bicarbonato en una mezcla con sal',
    enunciado: `Una mezcla de 20,0 g de NaHCO₃ y NaCl se calienta; solo el bicarbonato se descompone: 2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂, y el agua y el CO₂ escapan. La masa baja 4,50 g (datos didácticos). Masas molares de la tabla de la app: NaHCO₃ ${rengTx(M_NAHCO3, 4)}, H₂O ${rengTx(M_H2O, 4)} y CO₂ ${rengTx(M_CO2, 4)} g/mol.`,
    pregunta: '¿Qué porcentaje en masa de NaHCO₃ tenía la mezcla?',
    datos: [['Masa de la mezcla', '20,0 g'], ['Pérdida de masa', '4,50 g (H₂O + CO₂)'], ['Ecuación', '2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂']],
    unidad: '%',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => {
      const rengPorMol = (M_H2O + M_CO2) / 2
      return (((4.5 / rengPorMol) * M_NAHCO3) / 20) * 100
    },
    segundo: () => {
      const rengPerdidaPorGramo = (M_H2O + M_CO2) / (2 * M_NAHCO3)
      return (4.5 / rengPerdidaPorGramo / 20) * 100
    },
    metodoSegundo: 'pérdida de masa por gramo de bicarbonato y masa de bicarbonato necesaria para perder 4,50 g',
    pasos: (rengR) => [`Por cada 2 mol de NaHCO₃ se pierden 1 mol de H₂O y 1 de CO₂: ${rengTx(M_H2O + M_CO2, 4)} g.`, `Moles de NaHCO₃: 2 × 4,50 / ${rengTx(M_H2O + M_CO2, 4)} = ${rengTx((2 * 4.5) / (M_H2O + M_CO2), 4)} mol → ${rengTx((rengR / 100) * 20, 4)} g.`, `Porcentaje: ${rengTx((rengR / 100) * 20, 4)} / 20,0 × 100 = ${rengTx(rengR)} %.`],
    pistas: ['¿Qué componente pierde masa al calentar?', 'Relaciona la masa perdida con los moles de bicarbonato.', 'Divide la masa de bicarbonato entre la de la mezcla.']
  },
  {
    id: 'ej-est-gases',
    titulo: 'Hidrógeno de un trozo de cinc',
    enunciado: `Se disuelven 3,27 g de cinc en ácido clorhídrico en exceso: Zn + 2 HCl → ZnCl₂ + H₂. El hidrógeno se recoge seco a 25,0 °C y 101,325 kPa. Masa molar del Zn (tabla de la app): ${rengTx(M_ZN, 4)} g/mol.`,
    pregunta: '¿Qué volumen de H₂ se obtiene, en L?',
    datos: [['Masa de cinc', '3,27 g'], ['Ecuación', 'Zn + 2 HCl → ZnCl₂ + H₂'], ['Condiciones', '25,0 °C y 101,325 kPa']],
    unidad: 'L',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => rengVolumenGas(3.27 / M_ZN, 25, 101.325),
    segundo: () => ((3.27 / M_ZN) * RENG_NA_EST * 1.380649e-23 * rengK(25)) / 101325 * 1000,
    metodoSegundo: 'número de moléculas de H₂ y P·V = N·k_B·T en el SI, pasado a litros',
    pasos: (rengR) => [`Moles de Zn: 3,27 / ${rengTx(M_ZN, 4)} = ${rengTx(3.27 / M_ZN, 4)} mol; se forma el mismo número de moles de H₂.`, `V = n·R·T/P = ${rengTx(3.27 / M_ZN, 4)} × 8,314 × 298,15 / 101,325 = ${rengTx(rengR)} L.`],
    pistas: ['Pasa el cinc a moles.', 'Razón 1 H₂ : 1 Zn.', 'Volumen con P·V = n·R·T.']
  },
  {
    id: 'ej-est-consecutivas',
    titulo: 'De caliza a cal apagada en dos pasos',
    enunciado: `Se calcinan 100 g de CaCO₃ (CaCO₃ → CaO + CO₂, rendimiento 90,0 %) y la cal viva obtenida se hidrata (CaO + H₂O → Ca(OH)₂, rendimiento 95,0 %). Masas molares de la tabla de la app: CaCO₃ ${rengTx(M_CACO3, 4)} y Ca(OH)₂ ${rengTx(M_CAOH2, 4)} g/mol.`,
    pregunta: '¿Qué masa de Ca(OH)₂ se obtiene, en g?',
    datos: [['Masa de CaCO₃', '100 g'], ['Rendimiento del paso 1', '90,0 %'], ['Rendimiento del paso 2', '95,0 %']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (100 / M_CACO3) * 0.9 * 0.95 * M_CAOH2,
    segundo: () => {
      const rengCaO = (100 / M_CACO3) * 0.9 * M_CAO
      return (rengCaO / M_CAO) * 0.95 * M_CAOH2
    },
    metodoSegundo: 'cálculo paso a paso pasando por la masa de CaO obtenida en el primer paso',
    pasos: (rengR) => [`Paso 1: ${rengTx(100 / M_CACO3, 4)} mol de CaCO₃ dan ${rengTx((100 / M_CACO3) * 0.9, 4)} mol de CaO (90,0 %).`, `Paso 2: se hidratan con un 95,0 %: ${rengTx((100 / M_CACO3) * 0.855, 4)} mol de Ca(OH)₂.`, `Masa: ${rengTx((100 / M_CACO3) * 0.855, 4)} × ${rengTx(M_CAOH2, 4)} = ${rengTx(rengR)} g. El rendimiento global es 0,900 × 0,950 = 85,5 %.`],
    pistas: ['Calcula los moles de CaCO₃.', 'Aplica el rendimiento de cada paso.', 'Los rendimientos se multiplican.']
  }
]
