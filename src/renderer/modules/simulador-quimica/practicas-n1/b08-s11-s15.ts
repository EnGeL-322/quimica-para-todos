import { RENG_KPA_ATM, RENG_MMHG_ATM, RENG_NA_GAS, RENG_R_LATM, RENG_R_LKPA, RENG_R_SI, rengK, rengRedondear, rengTx, rengTxD } from '../aprender/n1/gases/constantes'
import { rengDidactico } from '../aprender/n1/procedencia'
import { rengEntreN1 } from './aleatorio'
import { RENG_TOL_GAS, rengDatoMasaMolar, rengFuentesGas, rengGas, rengIndiceGas, rengNombreGas } from './b08-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_MM_A_KPA = RENG_KPA_ATM / RENG_MMHG_ATM
const RENG_VM_0C_1ATM = RENG_R_LATM * 273.15

export const RENG_PRACTICAS_B08_S11: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s11-p1',
    subtema: 'n1-b8-s11',
    titulo: 'Masa molar a partir de una muestra',
    dificultad: 'basica',
    objetivo: 'Calcular la masa molar de un gas con M = mRT/(PV).',
    unidad: 'g/mol',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'masa molar de un gas', 'R', 'K'),
    idealizado: 'Gas ideal puro; la masa del enunciado se redondea a tres cifras.',
    metodo: 'masa de una molécula m = ρ·k_B·T/P en SI y M = m·N_A',
    parametros: (rengRng) => {
      const rengG = rengIndiceGas(rengRng)
      const rengP = rengEntreN1(rengRng, 0.8, 1.2, 0.01)
      const rengV = rengEntreN1(rengRng, 200, 1000, 10)
      const rengT = rengEntreN1(rengRng, 15, 40, 1)
      return { g: rengG, P: rengP, V: rengV, t: rengT, m: rengRedondear((rengP * (rengV / 1000) * rengGas(rengG).M) / (RENG_R_LATM * rengK(rengT))) }
    },
    respuesta: (rengD) => (rengD.m * RENG_R_LATM * rengK(rengD.t)) / (rengD.P * (rengD.V / 1000)),
    errores: (rengD, rengR) => [
      ['volumen-ml', 'Volumen en mL', rengR / 1000, 'Usaste el volumen en mL con R en L·atm/(mol·K): pásalo a litros.'],
      ['celsius', 'Temperatura en °C', (rengR * rengD.t) / rengK(rengD.t), 'Usaste la temperatura en °C: pásala a kelvin.']
    ],
    enunciado: (rengD) => `Un recipiente de ${rengTx(rengD.V)} mL contiene ${rengTx(rengD.m)} g de un gas desconocido a ${rengTx(rengD.P)} atm y ${rengTx(rengD.t)} °C.`,
    pregunta: () => '¿Cuál es la masa molar del gas, en g/mol?',
    datos: (rengD) => [['m', `${rengTx(rengD.m)} g`], ['V', `${rengTx(rengD.V)} mL`], ['P', `${rengTx(rengD.P)} atm`], ['t', `${rengTx(rengD.t)} °C`]],
    pasos: (rengD, rengR) => [`n = PV/(RT) = ${rengTx(rengD.P)} × ${rengTx(rengD.V / 1000)} / (0,08206 × ${rengTx(rengK(rengD.t), 5)}) = ${rengTx(rengD.m / rengR)} mol.`, `M = m/n = ${rengTx(rengR)} g/mol.`],
    pistas: ['Primero calcula cuántos moles hay.', 'n = PV/(RT) con V en litros y T en kelvin.', 'M = m / n, en g/mol.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s11-p2',
    subtema: 'n1-b8-s11',
    titulo: 'Masa molar a partir de la densidad',
    dificultad: 'intermedia',
    objetivo: 'Calcular la masa molar con M = ρRT/P eligiendo R según la unidad de presión.',
    unidad: 'g/mol',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'masa molar a partir de la densidad', 'R', 'K'),
    idealizado: 'Gas ideal puro; la densidad del enunciado se redondea a tres cifras.',
    metodo: 'masa de una molécula m = ρ·k_B·T/P en SI y M = m·N_A',
    parametros: (rengRng) => {
      const rengG = rengIndiceGas(rengRng)
      const rengP = rengEntreN1(rengRng, 80, 200, 1)
      const rengT = rengEntreN1(rengRng, 10, 60, 1)
      return { g: rengG, P: rengP, t: rengT, rho: rengRedondear((rengP * rengGas(rengG).M) / (RENG_R_LKPA * rengK(rengT))) }
    },
    respuesta: (rengD) => (rengD.rho * RENG_R_LKPA * rengK(rengD.t)) / rengD.P,
    errores: (rengD, rengR) => [
      ['celsius', 'Temperatura en °C', (rengR * rengD.t) / rengK(rengD.t), 'Usaste la temperatura en °C: pásala a kelvin.'],
      ['r-atm', 'R en L·atm con kPa', (rengD.rho * RENG_R_LATM * rengK(rengD.t)) / rengD.P, 'Usaste R en L·atm/(mol·K) con la presión en kPa: elige R = 8,314 L·kPa/(mol·K) o pasa la presión a atm.']
    ],
    enunciado: (rengD) => `Un gas tiene una densidad de ${rengTx(rengD.rho)} g/L a ${rengTx(rengD.P)} kPa y ${rengTx(rengD.t)} °C.`,
    pregunta: () => '¿Cuál es su masa molar, en g/mol?',
    datos: (rengD) => [['ρ', `${rengTx(rengD.rho)} g/L`], ['P', `${rengTx(rengD.P)} kPa`], ['t', `${rengTx(rengD.t)} °C`], ['R', '8,314 L·kPa/(mol·K)']],
    pasos: (rengD, rengR) => ['De ρ = PM/(RT): M = ρRT/P.', `M = ${rengTx(rengD.rho)} × 8,314 × ${rengTx(rengK(rengD.t), 5)} / ${rengTx(rengD.P)} = ${rengTx(rengR)} g/mol.`],
    pistas: ['Despeja M de la fórmula de la densidad de un gas.', 'R debe ir con kPa y L.', 'M = ρ·R·T / P.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s11-p3',
    subtema: 'n1-b8-s11',
    titulo: 'Pesar un matraz vacío y lleno',
    dificultad: 'avanzada',
    objetivo: 'Obtener la masa de gas por diferencia de pesadas y calcular su masa molar.',
    unidad: 'g/mol',
    tolerancia: RENG_TOL_GAS,
    fuentes: [...rengFuentesGas('g93', 'masa molar de un gas', 'R', 'K'), rengDidactico('Las masas del matraz son didácticas, con tres decimales de una balanza ideal.')],
    idealizado: 'Gas ideal puro; matraz rígido; balanza ideal al miligramo; se desprecia el empuje del aire.',
    metodo: 'masa de una molécula m = ρ·k_B·T/P en SI con la masa por diferencia, y M = m·N_A',
    parametros: (rengRng) => {
      const rengG = rengIndiceGas(rengRng)
      const rengV = rengEntreN1(rengRng, 250, 1000, 10)
      const rengP = rengEntreN1(rengRng, 0.95, 1.05, 0.01)
      const rengT = rengEntreN1(rengRng, 15, 35, 1)
      const rengM0 = rengEntreN1(rengRng, 80, 150, 0.001)
      const rengGasM = Math.round(((rengP * (rengV / 1000) * rengGas(rengG).M) / (RENG_R_LATM * rengK(rengT))) * 1000) / 1000
      return { g: rengG, V: rengV, P: rengP, t: rengT, m0: rengM0, m1: Math.round((rengM0 + rengGasM) * 1000) / 1000 }
    },
    valida: (rengD) => rengD.m1 - rengD.m0 >= 0.1,
    respuesta: (rengD) => ((rengD.m1 - rengD.m0) * RENG_R_LATM * rengK(rengD.t)) / (rengD.P * (rengD.V / 1000)),
    errores: (rengD, rengR) => [
      ['masa-lleno', 'Masa del matraz lleno', (rengD.m1 * RENG_R_LATM * rengK(rengD.t)) / (rengD.P * (rengD.V / 1000)), 'Usaste la masa del matraz lleno. La masa del gas es la diferencia entre las dos pesadas.'],
      ['celsius', 'Temperatura en °C', (rengR * rengD.t) / rengK(rengD.t), 'Usaste la temperatura en °C: pásala a kelvin.']
    ],
    enunciado: (rengD) => `Un matraz de ${rengTx(rengD.V)} mL pesa ${rengTxD(rengD.m0, 3)} g vacío y ${rengTxD(rengD.m1, 3)} g lleno de un gas desconocido a ${rengTx(rengD.P)} atm y ${rengTx(rengD.t)} °C.`,
    pregunta: () => '¿Cuál es la masa molar del gas, en g/mol?',
    datos: (rengD) => [['Matraz vacío', `${rengTxD(rengD.m0, 3)} g`], ['Matraz lleno', `${rengTxD(rengD.m1, 3)} g`], ['V', `${rengTx(rengD.V)} mL`], ['P', `${rengTx(rengD.P)} atm`], ['t', `${rengTx(rengD.t)} °C`]],
    pasos: (rengD, rengR) => [`m(gas) = ${rengTxD(rengD.m1, 3)} − ${rengTxD(rengD.m0, 3)} = ${rengTxD(rengD.m1 - rengD.m0, 3)} g.`, `n = PV/(RT) = ${rengTx(((rengD.m1 - rengD.m0) / rengR) * 1000)} mmol.`, `M = m/n = ${rengTx(rengR)} g/mol.`],
    pistas: ['La masa del gas no es la del matraz lleno.', 'Resta las dos pesadas.', 'Luego M = m·R·T/(P·V).']
  })
]

export const RENG_PRACTICAS_B08_S12: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s12-p1',
    subtema: 'n1-b8-s12',
    titulo: 'Presión parcial a partir de los moles',
    dificultad: 'basica',
    objetivo: 'Calcular una presión parcial con la fracción molar.',
    unidad: 'kPa',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'presiones parciales'),
    idealizado: 'Mezcla de gases ideales que no reaccionan.',
    metodo: 'volumen del recipiente deducido a una T auxiliar y presión que ejercería el gas solo, n·R·T/V',
    parametros: (rengRng) => ({ nA: rengEntreN1(rengRng, 0.1, 2, 0.01), nB: rengEntreN1(rengRng, 0.1, 2, 0.01), P: rengEntreN1(rengRng, 80, 300, 1) }),
    respuesta: (rengD) => (rengD.P * rengD.nA) / (rengD.nA + rengD.nB),
    errores: (rengD) => [
      ['razon', 'Dividido entre el otro gas', (rengD.P * rengD.nA) / rengD.nB, 'Dividiste entre los moles del otro gas. La fracción molar se calcula con los moles totales.'],
      ['otro-gas', 'Fracción del otro gas', (rengD.P * rengD.nB) / (rengD.nA + rengD.nB), 'Esa es la presión parcial del otro gas. Usa los moles del gas A en el numerador.']
    ],
    enunciado: (rengD) => `Una mezcla contiene ${rengTx(rengD.nA)} mol del gas A y ${rengTx(rengD.nB)} mol del gas B. La presión total es ${rengTx(rengD.P)} kPa.`,
    pregunta: () => '¿Cuál es la presión parcial del gas A, en kPa?',
    datos: (rengD) => [['n_A', `${rengTx(rengD.nA)} mol`], ['n_B', `${rengTx(rengD.nB)} mol`], ['P total', `${rengTx(rengD.P)} kPa`]],
    pasos: (rengD, rengR) => [`x_A = ${rengTx(rengD.nA)} / ${rengTx(rengD.nA + rengD.nB)} = ${rengTx(rengD.nA / (rengD.nA + rengD.nB))}.`, `p_A = x_A · P = ${rengTx(rengR)} kPa.`],
    pistas: ['Calcula primero los moles totales.', 'La fracción molar de A es n_A / n_total.', 'p_A = x_A · P_total.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s12-p2',
    subtema: 'n1-b8-s12',
    titulo: 'Presión parcial a partir de masas',
    dificultad: 'intermedia',
    objetivo: 'Pasar de masas a moles para obtener fracciones molares y presiones parciales.',
    unidad: 'kPa',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'presiones parciales', 'atm', 'M'),
    idealizado: 'Mezcla de gases ideales que no reaccionan.',
    metodo: 'presión que ejercería cada gas solo, n·R·T/V, en un volumen deducido a una T auxiliar',
    parametros: (rengRng) => ({ a: rengIndiceGas(rengRng), b: rengIndiceGas(rengRng), mA: rengEntreN1(rengRng, 1, 10, 0.1), mB: rengEntreN1(rengRng, 1, 10, 0.1), P: rengEntreN1(rengRng, 1, 5, 0.05) }),
    valida: (rengD) => rengD.a !== rengD.b && Math.abs(rengGas(rengD.a).M - rengGas(rengD.b).M) / Math.max(rengGas(rengD.a).M, rengGas(rengD.b).M) >= 0.25,
    respuesta: (rengD) => {
      const rengNA = rengD.mA / rengGas(rengD.a).M
      const rengNB = rengD.mB / rengGas(rengD.b).M
      return (rengNA / (rengNA + rengNB)) * rengD.P * RENG_KPA_ATM
    },
    errores: (rengD) => {
      const rengNA = rengD.mA / rengGas(rengD.a).M
      const rengNB = rengD.mB / rengGas(rengD.b).M
      return [
        ['fraccion-masica', 'Fracción en masa', (rengD.mA / (rengD.mA + rengD.mB)) * rengD.P * RENG_KPA_ATM, 'Repartiste la presión según la fracción en masa. La presión parcial va con la fracción molar: pasa antes las masas a moles.'],
        ['en-atm', 'Resultado en atm', (rengNA / (rengNA + rengNB)) * rengD.P, 'Ese valor está en atm; la pregunta lo pide en kPa (1 atm = 101,325 kPa).']
      ]
    },
    enunciado: (rengD) => `Una mezcla contiene ${rengTx(rengD.mA)} g de ${rengNombreGas(rengGas(rengD.a))} y ${rengTx(rengD.mB)} g de ${rengNombreGas(rengGas(rengD.b))}. La presión total es ${rengTx(rengD.P)} atm.`,
    pregunta: (rengD) => `¿Cuál es la presión parcial del ${rengGas(rengD.a).nombre}, en kPa?`,
    datos: (rengD) => [[`m(${rengGas(rengD.a).texto})`, `${rengTx(rengD.mA)} g`], [`m(${rengGas(rengD.b).texto})`, `${rengTx(rengD.mB)} g`], rengDatoMasaMolar(rengGas(rengD.a)), rengDatoMasaMolar(rengGas(rengD.b)), ['P total', `${rengTx(rengD.P)} atm`]],
    pasos: (rengD, rengR) => {
      const rengNA = rengD.mA / rengGas(rengD.a).M
      const rengNB = rengD.mB / rengGas(rengD.b).M
      return [`n(${rengGas(rengD.a).texto}) = ${rengTx(rengNA)} mol; n(${rengGas(rengD.b).texto}) = ${rengTx(rengNB)} mol.`, `x = ${rengTx(rengNA / (rengNA + rengNB))}.`, `p = x · ${rengTx(rengD.P)} atm × 101,325 = ${rengTx(rengR)} kPa.`]
    },
    pistas: ['Las presiones parciales se reparten por moles, no por masa.', 'n = m / M para cada gas.', 'p = x · P_total, y convierte a kPa.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s12-p3',
    subtema: 'n1-b8-s12',
    titulo: 'Presión parcial en un recipiente',
    dificultad: 'avanzada',
    objetivo: 'Calcular una presión parcial como la presión que ejercería el gas solo en el recipiente.',
    unidad: 'kPa',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'presiones parciales', 'R', 'K'),
    idealizado: 'Mezcla de gases ideales que no reaccionan.',
    metodo: 'presión total en unidades SI con N_A y k_B, multiplicada por la fracción molar',
    parametros: (rengRng) => ({ nA: rengEntreN1(rengRng, 0.05, 1, 0.005), nB: rengEntreN1(rengRng, 0.05, 1, 0.005), V: rengEntreN1(rengRng, 1, 10, 0.1), t: rengEntreN1(rengRng, 10, 60, 1) }),
    respuesta: (rengD) => (rengD.nA * RENG_R_LKPA * rengK(rengD.t)) / rengD.V,
    errores: (rengD) => [
      ['total', 'Presión total', ((rengD.nA + rengD.nB) * RENG_R_LKPA * rengK(rengD.t)) / rengD.V, 'Esa es la presión total de la mezcla. Para la parcial de A usa solo sus moles.'],
      ['celsius', 'Temperatura en °C', (rengD.nA * RENG_R_LKPA * rengD.t) / rengD.V, 'Usaste la temperatura en °C: pásala a kelvin.']
    ],
    enunciado: (rengD) => `Un recipiente de ${rengTx(rengD.V)} L contiene ${rengTx(rengD.nA)} mol del gas A y ${rengTx(rengD.nB)} mol del gas B a ${rengTx(rengD.t)} °C.`,
    pregunta: () => '¿Cuál es la presión parcial del gas A, en kPa?',
    datos: (rengD) => [['n_A', `${rengTx(rengD.nA)} mol`], ['n_B', `${rengTx(rengD.nB)} mol`], ['V', `${rengTx(rengD.V)} L`], ['t', `${rengTx(rengD.t)} °C`]],
    pasos: (rengD, rengR) => ['Cada gas ocupa todo el recipiente: p_A = n_A·R·T/V.', `T = ${rengTx(rengK(rengD.t), 5)} K.`, `p_A = ${rengTx(rengD.nA)} × 8,314 × ${rengTx(rengK(rengD.t), 5)} / ${rengTx(rengD.V)} = ${rengTx(rengR)} kPa.`],
    pistas: ['Cada gas de la mezcla se comporta como si estuviera solo.', 'Usa solo los moles de A.', 'p_A = n_A·R·T/V con R = 8,314 L·kPa/(mol·K).']
  })
]

export const RENG_PRACTICAS_B08_S13: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s13-p1',
    subtema: 'n1-b8-s13',
    titulo: 'Presión total en unidades mezcladas',
    dificultad: 'basica',
    objetivo: 'Sumar presiones parciales dadas en kPa, mmHg y atm.',
    unidad: 'kPa',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'ley de Dalton', 'atm'),
    idealizado: 'Mezcla de gases ideales que no reaccionan.',
    metodo: 'cada presión convertida a kPa con el catálogo de unidades y sumada',
    parametros: (rengRng) => ({ pA: rengEntreN1(rengRng, 10, 80, 0.1), pB: rengEntreN1(rengRng, 50, 400, 1), pC: rengEntreN1(rengRng, 0.05, 0.5, 0.01) }),
    respuesta: (rengD) => rengD.pA + rengD.pB * RENG_MM_A_KPA + rengD.pC * RENG_KPA_ATM,
    errores: (rengD) => [
      ['sin-convertir', 'Números sumados sin convertir', rengD.pA + rengD.pB + rengD.pC, 'Sumaste números en unidades distintas. Pasa todas las presiones a kPa antes de sumar.'],
      ['falta-uno', 'Falta un componente', rengD.pA + rengD.pB * RENG_MM_A_KPA, 'Te faltó la presión parcial del tercer gas (en atm). La total es la suma de todas.']
    ],
    enunciado: (rengD) => `Una mezcla de tres gases tiene presiones parciales de ${rengTx(rengD.pA)} kPa, ${rengTx(rengD.pB)} mmHg y ${rengTx(rengD.pC)} atm.`,
    pregunta: () => '¿Cuál es la presión total, en kPa?',
    datos: (rengD) => [['p₁', `${rengTx(rengD.pA)} kPa`], ['p₂', `${rengTx(rengD.pB)} mmHg`], ['p₃', `${rengTx(rengD.pC)} atm`]],
    pasos: (rengD, rengR) => [`p₂ = ${rengTx(rengD.pB)} × 101,325/760 = ${rengTx(rengD.pB * RENG_MM_A_KPA)} kPa.`, `p₃ = ${rengTx(rengD.pC)} × 101,325 = ${rengTx(rengD.pC * RENG_KPA_ATM)} kPa.`, `P = ${rengTx(rengR)} kPa.`],
    pistas: ['La ley de Dalton suma presiones parciales.', 'Antes de sumar, todas en la misma unidad.', '1 atm = 760 mmHg = 101,325 kPa.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s13-p2',
    subtema: 'n1-b8-s13',
    titulo: 'Gas recogido sobre agua',
    dificultad: 'intermedia',
    objetivo: 'Restar la presión del vapor de agua y calcular la cantidad de gas seco.',
    unidad: 'mmol',
    tolerancia: RENG_TOL_GAS,
    fuentes: [...rengFuentesGas('g93', 'gases recogidos sobre agua', 'R', 'atm', 'K'), rengDidactico('La presión del vapor de agua de cada variante es un valor didáctico del enunciado, no un dato de tabla.')],
    idealizado: 'Gas ideal saturado de vapor de agua; niveles igualados dentro y fuera del recipiente.',
    metodo: 'moles totales de la mezcla húmeda en SI multiplicados por la fracción molar del gas seco',
    parametros: (rengRng) => ({ Patm: rengEntreN1(rengRng, 730, 775, 1), pw: rengEntreN1(rengRng, 15, 35, 0.5), V: rengEntreN1(rengRng, 100, 500, 5), t: rengEntreN1(rengRng, 15, 35, 1) }),
    respuesta: (rengD) => ((((rengD.Patm - rengD.pw) / RENG_MMHG_ATM) * (rengD.V / 1000)) / (RENG_R_LATM * rengK(rengD.t))) * 1000,
    errores: (rengD) => [
      ['sin-restar', 'Sin restar el vapor', (((rengD.Patm / RENG_MMHG_ATM) * (rengD.V / 1000)) / (RENG_R_LATM * rengK(rengD.t))) * 1000, 'No restaste la presión del vapor de agua: parte de la presión medida se debe al agua, no al gas.'],
      ['sumando', 'Vapor sumado', ((((rengD.Patm + rengD.pw) / RENG_MMHG_ATM) * (rengD.V / 1000)) / (RENG_R_LATM * rengK(rengD.t))) * 1000, 'Sumaste la presión del vapor. Según Dalton, P_total = p_gas + p_agua, así que p_gas = P_total − p_agua.']
    ],
    enunciado: (rengD) => `Se recogen ${rengTx(rengD.V)} mL de un gas sobre agua a ${rengTx(rengD.t)} °C, con la presión atmosférica a ${rengTx(rengD.Patm)} mmHg. Toma ${rengTx(rengD.pw)} mmHg como presión del vapor de agua (valor didáctico del enunciado).`,
    pregunta: () => '¿Cuántos milimoles del gas seco se recogieron?',
    datos: (rengD) => [['V', `${rengTx(rengD.V)} mL`], ['t', `${rengTx(rengD.t)} °C`], ['P atmosférica', `${rengTx(rengD.Patm)} mmHg`], ['p vapor de agua', `${rengTx(rengD.pw)} mmHg (didáctico)`]],
    pasos: (rengD, rengR) => [`p_gas = ${rengTx(rengD.Patm)} − ${rengTx(rengD.pw)} = ${rengTx(rengD.Patm - rengD.pw)} mmHg = ${rengTx((rengD.Patm - rengD.pw) / RENG_MMHG_ATM)} atm.`, `n = pV/(RT) = ${rengTx(rengR / 1000)} mol = ${rengTx(rengR)} mmol.`],
    pistas: ['El gas recogido está mezclado con vapor de agua.', 'p_gas = P_atm − p_agua.', 'Luego n = pV/(RT) con unidades coherentes.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s13-p3',
    subtema: 'n1-b8-s13',
    titulo: 'Conectar dos recipientes',
    dificultad: 'avanzada',
    objetivo: 'Aplicar Dalton cuando dos gases se reparten por el volumen de dos recipientes conectados.',
    unidad: 'kPa',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'ley de Dalton'),
    idealizado: 'Gases ideales que no reaccionan; la temperatura no cambia al abrir la llave; volumen de la conexión despreciable.',
    metodo: 'moles de cada recipiente con PV = nRT a una T auxiliar y presión de la mezcla en el volumen total',
    parametros: (rengRng) => ({ VA: rengEntreN1(rengRng, 0.5, 5, 0.05), PA: rengEntreN1(rengRng, 50, 300, 1), VB: rengEntreN1(rengRng, 0.5, 5, 0.05), PB: rengEntreN1(rengRng, 50, 300, 1) }),
    respuesta: (rengD) => (rengD.PA * rengD.VA + rengD.PB * rengD.VB) / (rengD.VA + rengD.VB),
    errores: (rengD) => [
      ['suma', 'Presiones sumadas', rengD.PA + rengD.PB, 'Sumaste las presiones iniciales, pero cada gas pasa a ocupar el volumen total y su presión parcial baja.'],
      ['media', 'Media sin ponderar', (rengD.PA + rengD.PB) / 2, 'Promediaste las presiones sin tener en cuenta los volúmenes. Pondera cada presión por su volumen.']
    ],
    enunciado: (rengD) => `Un recipiente de ${rengTx(rengD.VA)} L contiene el gas A a ${rengTx(rengD.PA)} kPa y otro de ${rengTx(rengD.VB)} L contiene el gas B a ${rengTx(rengD.PB)} kPa, a la misma temperatura. Se abre la llave que los une.`,
    pregunta: () => '¿Cuál es la presión total final, en kPa?',
    datos: (rengD) => [['V_A', `${rengTx(rengD.VA)} L`], ['P_A', `${rengTx(rengD.PA)} kPa`], ['V_B', `${rengTx(rengD.VB)} L`], ['P_B', `${rengTx(rengD.PB)} kPa`]],
    pasos: (rengD, rengR) => [`p_A final = ${rengTx(rengD.PA)} × ${rengTx(rengD.VA)} / ${rengTx(rengD.VA + rengD.VB)} = ${rengTx((rengD.PA * rengD.VA) / (rengD.VA + rengD.VB))} kPa (Boyle).`, `p_B final = ${rengTx((rengD.PB * rengD.VB) / (rengD.VA + rengD.VB))} kPa.`, `P = p_A + p_B = ${rengTx(rengR)} kPa.`],
    pistas: ['Al abrir la llave, cada gas ocupa el volumen total.', 'Calcula la presión parcial final de cada gas con la ley de Boyle.', 'Súmalas (ley de Dalton).']
  })
]

export const RENG_PRACTICAS_B08_S14: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s14-p1',
    subtema: 'n1-b8-s14',
    titulo: 'Volumen de una masa de gas a 0 °C y 1 atm',
    dificultad: 'basica',
    objetivo: 'Pasar de masa a moles y de moles a volumen con el volumen molar a 0 °C y 1 atm.',
    unidad: 'L',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'volumen molar', 'R', 'M'),
    idealizado: 'Gas ideal a 0 °C y 1 atm.',
    metodo: 'número de moléculas N = (m/M)·N_A y V = N·k_B·T/P en SI',
    parametros: (rengRng) => ({ g: rengIndiceGas(rengRng), m: rengEntreN1(rengRng, 1, 50, 0.1) }),
    respuesta: (rengD) => (rengD.m / rengGas(rengD.g).M) * RENG_VM_0C_1ATM,
    errores: (rengD) => [
      ['sin-moles', 'Masa por volumen molar', rengD.m * RENG_VM_0C_1ATM, 'Multiplicaste la masa por el volumen molar: primero pasa la masa a moles (n = m/M).'],
      ['vm-25', 'Volumen molar de 25 °C', (rengD.m / rengGas(rengD.g).M) * RENG_R_LATM * 298.15, 'Usaste el volumen molar de 25 °C (unos 24,5 L/mol); a 0 °C y 1 atm es de unos 22,4 L/mol.']
    ],
    enunciado: (rengD) => `Se tienen ${rengTx(rengD.m)} g de ${rengNombreGas(rengGas(rengD.g))} a 0 °C y 1 atm.`,
    pregunta: () => '¿Qué volumen ocupan, en L?',
    datos: (rengD) => [['m', `${rengTx(rengD.m)} g`], rengDatoMasaMolar(rengGas(rengD.g)), ['Condiciones', '0 °C y 1 atm']],
    pasos: (rengD, rengR) => [`n = ${rengTx(rengD.m)} / ${rengTx(rengGas(rengD.g).M, 4)} = ${rengTx(rengD.m / rengGas(rengD.g).M)} mol.`, `V_m = R·T/P = 0,082057 × 273,15 / 1 = ${rengTx(RENG_VM_0C_1ATM, 4)} L/mol.`, `V = n · V_m = ${rengTx(rengR)} L.`],
    pistas: ['Pasa la masa a moles.', 'A 0 °C y 1 atm, un mol de gas ideal ocupa unos 22,4 L.', 'V = n · V_m.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s14-p2',
    subtema: 'n1-b8-s14',
    titulo: 'Volumen molar en otras condiciones',
    dificultad: 'intermedia',
    objetivo: 'Calcular el volumen molar a una presión y temperatura cualesquiera.',
    unidad: 'L/mol',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g93', 'volumen molar', 'R', 'K'),
    idealizado: 'Gas ideal.',
    metodo: 'volumen de N_A moléculas con V = N·k_B·T/P en SI',
    parametros: (rengRng) => ({ t: rengEntreN1(rengRng, -20, 100, 1), P: rengEntreN1(rengRng, 50, 200, 1) }),
    respuesta: (rengD) => (RENG_R_LKPA * rengK(rengD.t)) / rengD.P,
    errores: (rengD) => [
      ['celsius', 'Temperatura en °C', (RENG_R_LKPA * rengD.t) / rengD.P, 'Usaste la temperatura en °C: pásala a kelvin.'],
      ['siempre-22-4', 'Siempre 22,4 L/mol', RENG_VM_0C_1ATM, 'Usaste 22,4 L/mol, que solo vale a 0 °C y 1 atm. Calcula R·T/P con las condiciones del enunciado.']
    ],
    enunciado: (rengD) => `Se quiere el volumen que ocupa un mol de gas ideal a ${rengTx(rengD.t)} °C y ${rengTx(rengD.P)} kPa.`,
    pregunta: () => '¿Cuál es el volumen molar, en L/mol?',
    datos: (rengD) => [['t', `${rengTx(rengD.t)} °C`], ['P', `${rengTx(rengD.P)} kPa`], ['R', '8,314 L·kPa/(mol·K)']],
    pasos: (rengD, rengR) => [`T = ${rengTx(rengK(rengD.t), 5)} K.`, `V_m = R·T/P = 8,314 × ${rengTx(rengK(rengD.t), 5)} / ${rengTx(rengD.P)} = ${rengTx(rengR)} L/mol.`],
    pistas: ['V_m = V/n = RT/P.', 'Con P en kPa usa R = 8,314 L·kPa/(mol·K).', 'T en kelvin.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s14-p3',
    subtema: 'n1-b8-s14',
    titulo: 'Moléculas en un volumen de gas',
    dificultad: 'avanzada',
    objetivo: 'Calcular el número de moléculas de una muestra gaseosa con el volumen molar y la constante de Avogadro.',
    unidad: '',
    tolerancia: { rel: 0.01, abs: 1 },
    fuentes: rengFuentesGas('g93', 'volumen molar y número de moléculas', 'R', 'K', 'NA'),
    idealizado: 'Gas ideal.',
    metodo: 'N = P·V/(k_B·T) en unidades SI',
    parametros: (rengRng) => ({ V: rengEntreN1(rengRng, 10, 900, 10), t: rengEntreN1(rengRng, 10, 50, 1), P: rengEntreN1(rengRng, 80, 200, 1) }),
    respuesta: (rengD) => ((rengD.P * (rengD.V / 1000)) / (RENG_R_LKPA * rengK(rengD.t))) * RENG_NA_GAS,
    errores: (rengD, rengR) => [
      ['con-22-4', 'Con 22,4 L/mol', (rengD.V / 1000 / RENG_VM_0C_1ATM) * RENG_NA_GAS, 'Usaste 22,4 L/mol, que solo vale a 0 °C y 1 atm. Calcula los moles con PV/(RT).'],
      ['volumen-ml', 'Volumen en mL', rengR * 1000, 'Usaste el volumen en mL con R en L·kPa/(mol·K): pásalo a litros.']
    ],
    enunciado: (rengD) => `Un recipiente de ${rengTx(rengD.V)} mL contiene gas a ${rengTx(rengD.P)} kPa y ${rengTx(rengD.t)} °C.`,
    pregunta: () => '¿Cuántas moléculas de gas contiene? (Escribe, por ejemplo, 1,23e22.)',
    datos: (rengD) => [['V', `${rengTx(rengD.V)} mL`], ['P', `${rengTx(rengD.P)} kPa`], ['t', `${rengTx(rengD.t)} °C`], ['N_A', '6,022·10²³ mol⁻¹']],
    pasos: (rengD, rengR) => [`n = PV/(RT) = ${rengTx(rengD.P)} × ${rengTx(rengD.V / 1000)} / (8,314 × ${rengTx(rengK(rengD.t), 5)}) = ${rengTx(rengR / RENG_NA_GAS)} mol.`, `N = n · N_A = ${rengTx(rengR)} moléculas.`],
    pistas: ['Calcula primero los moles con PV = nRT.', 'No uses 22,4 L/mol: las condiciones no son 0 °C y 1 atm.', 'N = n · N_A.']
  })
]

export const RENG_PRACTICAS_B08_S15: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s15-p1',
    subtema: 'n1-b8-s15',
    titulo: 'Energía cinética media por mol',
    dificultad: 'basica',
    objetivo: 'Calcular la energía cinética media de traslación de un mol de gas, (3/2)RT.',
    unidad: 'kJ',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g95', 'energía cinética media', 'R', 'K'),
    idealizado: 'Gas ideal; solo energía de traslación.',
    metodo: '(3/2)·k_B·T por molécula multiplicado por N_A',
    parametros: (rengRng) => ({ t: rengEntreN1(rengRng, -50, 500, 5) }),
    respuesta: (rengD) => (1.5 * RENG_R_SI * rengK(rengD.t)) / 1000,
    errores: (rengD, rengR) => [
      ['celsius', 'Temperatura en °C', (1.5 * RENG_R_SI * rengD.t) / 1000, 'Usaste la temperatura en °C: la energía cinética media es proporcional a la temperatura absoluta.'],
      ['sin-tres-medios', 'Sin el factor 3/2', rengR / 1.5, 'Te faltó el factor 3/2: la energía cinética media de traslación por mol es (3/2)RT.']
    ],
    enunciado: (rengD) => `Un mol de gas ideal está a ${rengTx(rengD.t)} °C.`,
    pregunta: () => '¿Cuál es su energía cinética de traslación, en kJ?',
    datos: (rengD) => [['n', '1 mol'], ['t', `${rengTx(rengD.t)} °C`], ['R', '8,314 J/(mol·K)']],
    pasos: (rengD, rengR) => [`T = ${rengTx(rengK(rengD.t), 5)} K.`, `E_c = (3/2)·R·T = 1,5 × 8,314 × ${rengTx(rengK(rengD.t), 5)} J = ${rengTx(rengR)} kJ.`],
    pistas: ['La energía cinética media depende solo de T absoluta.', 'Por mol: E_c = (3/2)·R·T.', 'Pasa de J a kJ dividiendo entre 1000.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s15-p2',
    subtema: 'n1-b8-s15',
    titulo: 'Cuánto aumenta la energía al calentar',
    dificultad: 'intermedia',
    objetivo: 'Usar que la energía cinética media es proporcional a la temperatura absoluta.',
    unidad: '',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g95', 'energía cinética y temperatura', 'K'),
    idealizado: 'Gas ideal; solo energía de traslación.',
    metodo: 'energías medias (3/2)·k_B·T calculadas en valor absoluto para las dos temperaturas y divididas',
    parametros: (rengRng) => ({ t1: rengEntreN1(rengRng, -20, 60, 1), t2: rengEntreN1(rengRng, 100, 600, 5) }),
    valida: (rengD) => rengD.t1 !== 0,
    respuesta: (rengD) => rengK(rengD.t2) / rengK(rengD.t1),
    errores: (rengD, rengR) => [
      ['celsius', 'Cociente de °C', rengD.t2 / rengD.t1, 'Dividiste temperaturas en °C. La energía es proporcional a la temperatura absoluta.'],
      ['raiz', 'Con raíz cuadrada', Math.sqrt(rengR), 'Usaste la raíz cuadrada: eso sería el cociente de velocidades, no de energías.']
    ],
    enunciado: (rengD) => `Un gas se calienta de ${rengTx(rengD.t1)} °C a ${rengTx(rengD.t2)} °C.`,
    pregunta: () => '¿Por cuánto se multiplica la energía cinética media de sus moléculas?',
    datos: (rengD) => [['t₁', `${rengTx(rengD.t1)} °C`], ['t₂', `${rengTx(rengD.t2)} °C`]],
    pasos: (rengD, rengR) => [`T₁ = ${rengTx(rengK(rengD.t1), 5)} K; T₂ = ${rengTx(rengK(rengD.t2), 5)} K.`, `E₂/E₁ = T₂/T₁ = ${rengTx(rengR)}.`],
    pistas: ['E_c media ∝ T absoluta.', 'Pasa las dos temperaturas a kelvin.', 'El factor es T₂/T₁.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s15-p3',
    subtema: 'n1-b8-s15',
    titulo: 'Energía de traslación de una muestra',
    dificultad: 'avanzada',
    objetivo: 'Usar E = (3/2)·P·V para la energía cinética de traslación de una muestra, sin conocer ni n ni T.',
    unidad: 'J',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g95', 'energía cinética y PV', 'R'),
    idealizado: 'Gas ideal; solo energía de traslación.',
    metodo: 'moles a una T auxiliar con PV = nRT y energía (3/2)·n·R·T',
    parametros: (rengRng) => ({ P: rengEntreN1(rengRng, 50, 500, 5), V: rengEntreN1(rengRng, 0.5, 20, 0.1) }),
    respuesta: (rengD) => 1.5 * rengD.P * rengD.V,
    errores: (rengD) => [
      ['sin-tres-medios', 'Sin el factor 3/2', rengD.P * rengD.V, 'Calculaste P·V; la energía de traslación es (3/2)·P·V.'],
      ['triple', 'Factor 3 en lugar de 3/2', 3 * rengD.P * rengD.V, 'Usaste un factor 3; el factor correcto es 3/2.']
    ],
    enunciado: (rengD) => `Un recipiente de ${rengTx(rengD.V)} L contiene un gas ideal a ${rengTx(rengD.P)} kPa.`,
    pregunta: () => '¿Cuál es la energía cinética total de traslación de sus moléculas, en J?',
    datos: (rengD) => [['P', `${rengTx(rengD.P)} kPa`], ['V', `${rengTx(rengD.V)} L`], ['Equivalencia', '1 kPa·L = 1 J']],
    pasos: (rengD, rengR) => ['E = (3/2)·n·R·T, y n·R·T = P·V.', `E = 1,5 × ${rengTx(rengD.P)} kPa × ${rengTx(rengD.V)} L = ${rengTx(rengR)} J.`],
    pistas: ['No necesitas n ni T por separado.', 'En PV = nRT, el producto nRT es P·V.', 'E = (3/2)·P·V, con kPa·L = J.']
  })
]
