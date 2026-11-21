import { rengConvertir } from '../../../../../lib/unidades'
import { rengRK4 } from '../numericos'
import type { RengEjemploN1 } from '../tipos'
import { RENG_G_N, RENG_KB_GAS, RENG_KPA_ATM, RENG_MMHG_ATM, RENG_NA_GAS, RENG_PA_ATM, RENG_R_LATM, RENG_R_LKPA, RENG_R_SI, RENG_RHO_HG, rengGasPorFormula, rengK, rengTx } from './constantes'

const RENG_TOL = { rel: 0.005, abs: 1e-9 }

const rengVelocidadMediaSI = (rengM: number, rengT: number): number => Math.sqrt((8 * RENG_KB_GAS * rengT) / (Math.PI * (rengM / 1000 / RENG_NA_GAS)))
const rengUrmsSI = (rengM: number, rengT: number): number => Math.sqrt((3 * RENG_KB_GAS * rengT) / (rengM / 1000 / RENG_NA_GAS))

const RENG_CO2 = rengGasPorFormula('CO2')
const RENG_N2 = rengGasPorFormula('N2')
const RENG_HE = rengGasPorFormula('He')
const RENG_AR = rengGasPorFormula('Ar')
const RENG_O2 = rengGasPorFormula('O2')
const RENG_H2 = rengGasPorFormula('H2')

export const RENG_EJEMPLOS_GASES: readonly RengEjemploN1[] = [
  {
    id: 'ej-gas-propiedades',
    titulo: 'Comprimir el aire de una jeringa',
    enunciado: 'Una jeringa sellada contiene 0,250 g de aire en 200 mL. Se empuja el émbolo hasta que el aire ocupa 50,0 mL, sin que entre ni salga gas.',
    pregunta: '¿Cuál es la densidad del aire comprimido, en g/L?',
    datos: [['Masa de aire', '0,250 g'], ['Volumen inicial', '200 mL'], ['Volumen final', '50,0 mL']],
    unidad: 'g/L',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 0.25 / (50 / 1000),
    segundo: () => (rengConvertir(0.25 / 200, 'g/mL', 'g/L') * 200) / 50,
    metodoSegundo: 'densidad inicial convertida con el catálogo de unidades y escalada por V₁/V₂ porque la masa no cambia',
    pasos: (rengR) => [
      'La masa no cambia: la jeringa está sellada.',
      'Volumen final en litros: 50,0 mL = 0,0500 L.',
      `ρ = m / V = 0,250 g / 0,0500 L = ${rengTx(rengR)} g/L.`,
      'Comprobación: la densidad inicial era 1,25 g/L y el volumen se redujo a la cuarta parte, así que la densidad se cuadruplica.'
    ],
    pistas: ['¿Cambia la masa de aire al empujar el émbolo?', 'Pasa los mililitros a litros antes de dividir.', 'Densidad = masa / volumen.']
  },
  {
    id: 'ej-gas-presion',
    titulo: 'Pasar una lectura de mmHg a kPa',
    enunciado: 'Un barómetro marca 745 mmHg.',
    pregunta: '¿Cuánto es esa presión en kPa?',
    datos: [['Lectura', '745 mmHg'], ['Equivalencia', '760 mmHg = 101,325 kPa']],
    unidad: 'kPa',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (745 * RENG_KPA_ATM) / RENG_MMHG_ATM,
    segundo: () => rengConvertir(745, 'mmHg', 'kPa'),
    metodoSegundo: 'conversión directa con el catálogo de unidades (mmHg convencional = 133,322387415 Pa)',
    pasos: (rengR) => ['Factor de conversión: 101,325 kPa / 760 mmHg.', `P = 745 mmHg × 101,325 kPa / 760 mmHg = ${rengTx(rengR)} kPa.`, 'Es un poco menos de 1 atm, como cabe esperar de 745 < 760 mmHg.'],
    pistas: ['Busca una equivalencia que contenga mmHg y kPa a la vez.', '760 mmHg y 101,325 kPa son la misma presión: 1 atm.', 'Multiplica por la fracción que cancela los mmHg.']
  },
  {
    id: 'ej-gas-atmosferica',
    titulo: 'Altura de un barómetro de mercurio',
    enunciado: 'En un día con presión atmosférica de 98,6 kPa se usa un barómetro de mercurio idealizado. Densidad del mercurio: 13,5951 g/cm³; g = 9,80665 m/s².',
    pregunta: '¿Qué altura alcanza la columna de mercurio, en mm?',
    datos: [['Presión', '98,6 kPa'], ['Densidad del mercurio', '13,5951 g/cm³'], ['g', '9,80665 m/s²']],
    unidad: 'mm',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => ((98.6 * 1000) / (RENG_RHO_HG * 1000 * RENG_G_N)) * 1000,
    segundo: () => (RENG_MMHG_ATM * 98.6) / RENG_KPA_ATM,
    metodoSegundo: 'proporción con la presión estándar: 760 mm de mercurio equivalen a 101,325 kPa',
    pasos: (rengR) => ['Unidades SI: P = 98 600 Pa; ρ = 13 595,1 kg/m³.', 'De P = ρ·g·h se despeja h = P / (ρ·g).', `h = 98 600 / (13 595,1 × 9,80665) m = ${rengTx(rengR / 1000)} m = ${rengTx(rengR)} mm.`, 'Algo menos que 760 mm, porque la presión es algo menor que 1 atm.'],
    pistas: ['La columna se sostiene porque su peso por unidad de área iguala la presión del aire.', 'Usa P = ρ·g·h y despeja h.', 'Pasa la densidad a kg/m³ y la presión a Pa.']
  },
  {
    id: 'ej-gas-boyle',
    titulo: 'Comprimir a temperatura constante',
    enunciado: 'Un gas ocupa 2,50 L a 1,00 atm. Se comprime lentamente, sin cambiar su temperatura ni su cantidad, hasta 0,800 L.',
    pregunta: '¿Cuál es la presión final, en atm?',
    datos: [['P₁', '1,00 atm'], ['V₁', '2,50 L'], ['V₂', '0,800 L']],
    unidad: 'atm',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (1 * 2.5) / 0.8,
    segundo: () => rengRK4((rengV, rengP) => -rengP / rengV, 2.5, 1, 0.8),
    metodoSegundo: 'integración numérica (Runge–Kutta 4) de dP/dV = −P/V desde 2,50 L hasta 0,800 L, sin usar la fórmula cerrada',
    pasos: (rengR) => ['Temperatura y cantidad constantes: se aplica P₁·V₁ = P₂·V₂.', 'Despeje: P₂ = P₁·V₁ / V₂.', `P₂ = 1,00 atm × 2,50 L / 0,800 L = ${rengTx(rengR)} atm.`, 'El volumen bajó a menos de la tercera parte y la presión subió algo más de tres veces: es coherente.'],
    pistas: ['¿Qué magnitudes se mantienen constantes?', 'Con T y n constantes, el producto P·V no cambia.', 'Despeja P₂ de P₁·V₁ = P₂·V₂.']
  },
  {
    id: 'ej-gas-charles',
    titulo: 'Calentar a presión constante',
    enunciado: 'Un globo flexible contiene 1,50 L de gas a 20,0 °C. Se calienta a presión constante hasta 80,0 °C.',
    pregunta: '¿Qué volumen ocupa, en L?',
    datos: [['V₁', '1,50 L'], ['t₁', '20,0 °C'], ['t₂', '80,0 °C']],
    unidad: 'L',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (1.5 * rengK(80)) / rengK(20),
    segundo: () => rengRK4((rengT, rengV) => rengV / rengT, rengK(20), 1.5, rengK(80)),
    metodoSegundo: 'integración numérica (Runge–Kutta 4) de dV/dT = V/T entre 293,15 K y 353,15 K',
    pasos: (rengR) => ['Las temperaturas, en kelvin: T₁ = 293,15 K y T₂ = 353,15 K.', 'A P y n constantes: V₁/T₁ = V₂/T₂, de donde V₂ = V₁·T₂/T₁.', `V₂ = 1,50 L × 353,15 / 293,15 = ${rengTx(rengR)} L.`, 'Con grados Celsius saldría 6,00 L, un aumento absurdo del 300 %: por eso se usa kelvin.'],
    pistas: ['La ley de Charles solo funciona con temperatura absoluta.', 'Suma 273,15 a cada temperatura en °C.', 'V₂ = V₁ · T₂ / T₁.']
  },
  {
    id: 'ej-gas-gay-lussac',
    titulo: 'Calentar un recipiente rígido',
    enunciado: 'Un recipiente rígido y cerrado contiene gas a 200 kPa y 25,0 °C. Se calienta hasta 75,0 °C.',
    pregunta: '¿Cuál es la nueva presión, en kPa?',
    datos: [['P₁', '200 kPa'], ['t₁', '25,0 °C'], ['t₂', '75,0 °C']],
    unidad: 'kPa',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (200 * rengK(75)) / rengK(25),
    segundo: () => rengRK4((rengT, rengP) => rengP / rengT, rengK(25), 200, rengK(75)),
    metodoSegundo: 'integración numérica (Runge–Kutta 4) de dP/dT = P/T entre 298,15 K y 348,15 K',
    pasos: (rengR) => ['Volumen y cantidad constantes: P₁/T₁ = P₂/T₂.', 'T₁ = 298,15 K; T₂ = 348,15 K.', `P₂ = 200 kPa × 348,15 / 298,15 = ${rengTx(rengR)} kPa.`, 'Sube un 17 %, igual que la temperatura absoluta.'],
    pistas: ['El recipiente es rígido: ¿qué magnitud no cambia?', 'Usa temperaturas en kelvin.', 'P₂ = P₁ · T₂ / T₁.']
  },
  {
    id: 'ej-gas-avogadro',
    titulo: 'Inflar un globo con más gas',
    enunciado: 'Un globo contiene 0,0820 mol de gas y ocupa 2,00 L. Se añade gas, a la misma presión y temperatura, hasta tener 0,123 mol.',
    pregunta: '¿Qué volumen ocupa ahora, en L?',
    datos: [['V₁', '2,00 L'], ['n₁', '0,0820 mol'], ['n₂', '0,123 mol']],
    unidad: 'L',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (2 * 0.123) / 0.082,
    segundo: () => rengRK4((rengN, rengV) => rengV / rengN, 0.082, 2, 0.123),
    metodoSegundo: 'integración numérica (Runge–Kutta 4) de dV/dn = V/n, añadiendo el gas en muchos pasos pequeños',
    pasos: (rengR) => ['A P y T constantes, V es proporcional a n: V₁/n₁ = V₂/n₂.', 'V₂ = V₁ · n₂ / n₁.', `V₂ = 2,00 L × 0,123 / 0,0820 = ${rengTx(rengR)} L.`, 'La cantidad de gas aumenta un 50 % y el volumen también.'],
    pistas: ['¿Qué pasa con el volumen si hay más moléculas a la misma P y T?', 'El cociente V/n se mantiene.', 'V₂ = V₁ · n₂ / n₁.']
  },
  {
    id: 'ej-gas-combinada',
    titulo: 'Llevar un gas a 0 °C y 1 atm',
    enunciado: 'Se miden 500 mL de gas a 25,0 °C y 98,0 kPa. Se quiere saber qué volumen ocuparía la misma cantidad a 0,00 °C y 101,325 kPa.',
    pregunta: '¿Cuál es ese volumen, en mL?',
    datos: [['V₁', '500 mL'], ['P₁', '98,0 kPa'], ['t₁', '25,0 °C'], ['P₂', '101,325 kPa'], ['t₂', '0,00 °C']],
    unidad: 'mL',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (500 * 98 * rengK(0)) / (rengK(25) * 101.325),
    segundo: () => {
      const rengTrasBoyle = rengRK4((rengP, rengV) => -rengV / rengP, 98, 500, 101.325)
      return rengRK4((rengT, rengV) => rengV / rengT, rengK(25), rengTrasBoyle, rengK(0))
    },
    metodoSegundo: 'dos tramos integrados numéricamente: primero a T constante (dV/dP = −V/P) y después a P constante (dV/dT = V/T)',
    pasos: (rengR) => ['Misma cantidad de gas: P₁V₁/T₁ = P₂V₂/T₂.', 'V₂ = V₁ · (P₁/P₂) · (T₂/T₁).', 'T₁ = 298,15 K; T₂ = 273,15 K.', `V₂ = 500 mL × (98,0/101,325) × (273,15/298,15) = ${rengTx(rengR)} mL.`, 'Al enfriar y comprimir, el volumen baja: es coherente.'],
    pistas: ['Junta las leyes de Boyle y de Charles.', 'Las presiones pueden quedar en kPa si las dos lo están; las temperaturas, en kelvin.', 'V₂ = V₁ · P₁ · T₂ / (P₂ · T₁).']
  },
  {
    id: 'ej-gas-ideal',
    titulo: 'Presión de un gas en un recipiente',
    enunciado: 'En un recipiente de 5,00 L hay 0,350 mol de gas a 30,0 °C.',
    pregunta: '¿Qué presión ejerce, en kPa?',
    datos: [['n', '0,350 mol'], ['V', '5,00 L'], ['t', '30,0 °C'], ['R', '8,314 L·kPa/(mol·K)']],
    unidad: 'kPa',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (0.35 * RENG_R_LKPA * rengK(30)) / 5,
    segundo: () => (0.35 * RENG_NA_GAS * RENG_KB_GAS * rengK(30)) / (5 / 1000) / 1000,
    metodoSegundo: 'contar moléculas, N = n·N_A, y usar P = N·k_B·T / V en unidades SI',
    pasos: (rengR) => ['PV = nRT, con R = 8,314 L·kPa/(mol·K) para obtener kPa con litros.', 'T = 303,15 K.', `P = 0,350 × 8,314 × 303,15 / 5,00 = ${rengTx(rengR)} kPa.`, 'Es algo menos de 2 atm.'],
    pistas: ['Elige el valor de R que encaja con L y kPa.', 'La temperatura, en kelvin.', 'P = nRT / V.']
  },
  {
    id: 'ej-gas-densidad',
    titulo: 'Densidad del dióxido de carbono',
    enunciado: `Se considera dióxido de carbono como gas ideal a 1,00 atm y 25,0 °C. Masa molar: ${rengTx(RENG_CO2.M, 4)} g/mol (tabla de la app).`,
    pregunta: '¿Cuál es su densidad, en g/L?',
    datos: [['P', '1,00 atm'], ['t', '25,0 °C'], ['M', `${rengTx(RENG_CO2.M, 4)} g/mol`], ['R', '0,08206 L·atm/(mol·K)']],
    unidad: 'g/L',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (1 * RENG_CO2.M) / (RENG_R_LATM * rengK(25)),
    segundo: () => (RENG_PA_ATM * (RENG_CO2.M / 1000 / RENG_NA_GAS)) / (RENG_KB_GAS * rengK(25)),
    metodoSegundo: 'masa de una molécula (M/N_A) y ρ = P·m / (k_B·T) en unidades SI (kg/m³ = g/L)',
    pasos: (rengR) => ['De PV = nRT y n = m/M sale ρ = m/V = P·M / (R·T).', 'T = 298,15 K.', `ρ = 1,00 × ${rengTx(RENG_CO2.M, 4)} / (0,082057 × 298,15) = ${rengTx(rengR)} g/L.`, 'Es más denso que el aire en las mismas condiciones porque su masa molar es mayor.'],
    pistas: ['La densidad es masa entre volumen; escribe n como m/M.', 'Reordena PV = (m/M)RT.', 'ρ = P·M / (R·T), con T en kelvin.']
  },
  {
    id: 'ej-gas-masa-molar',
    titulo: 'Identificar un gas por su masa molar',
    enunciado: 'Un matraz de 250 mL contiene 0,500 g de un gas desconocido a 1,00 atm y 27,0 °C (datos didácticos).',
    pregunta: '¿Cuál es la masa molar del gas, en g/mol?',
    datos: [['m', '0,500 g'], ['V', '250 mL'], ['P', '1,00 atm'], ['t', '27,0 °C']],
    unidad: 'g/mol',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (0.5 * RENG_R_LATM * rengK(27)) / (1 * 0.25),
    segundo: () => {
      const rengRho = 0.5 / (250 / 1e6) / 1000
      return ((rengRho * RENG_KB_GAS * rengK(27)) / RENG_PA_ATM) * RENG_NA_GAS * 1000
    },
    metodoSegundo: 'densidad en kg/m³, masa de una molécula m = ρ·k_B·T / P y M = m·N_A',
    pasos: (rengR) => ['n = PV/(RT) y M = m/n, así que M = m·R·T / (P·V).', 'V = 0,250 L; T = 300,15 K.', `M = 0,500 × 0,082057 × 300,15 / (1,00 × 0,250) = ${rengTx(rengR)} g/mol.`, 'Con los datos didácticos sale cerca de 49 g/mol; con datos reales se compararía con las masas molares de gases candidatos.'],
    pistas: ['Primero calcula cuántos moles hay.', 'n = PV/(RT) con V en litros.', 'M = m / n, en g/mol.']
  },
  {
    id: 'ej-gas-parciales',
    titulo: 'Oxígeno en el aire a otra presión',
    enunciado: 'El aire seco tiene una fracción molar de oxígeno de 0,21 (21 %, ver el caso real «El aire que respiras»). En un lugar alto la presión total es 95,0 kPa.',
    pregunta: '¿Cuál es la presión parcial del oxígeno, en kPa?',
    datos: [['x(O₂)', '0,21'], ['P total', '95,0 kPa']],
    unidad: 'kPa',
    cifras: 2,
    tolerancia: RENG_TOL,
    analitico: () => 0.21 * 95,
    segundo: () => {
      const rengT = 298.15
      const rengNTotal = (95 * 1) / (RENG_R_LKPA * rengT)
      return (0.21 * rengNTotal * RENG_R_LKPA * rengT) / 1
    },
    metodoSegundo: 'camino por cantidades de sustancia: moles totales en 1 L a una T auxiliar, moles de O₂ y presión que ejercerían solos',
    pasos: (rengR) => ['La presión parcial es la fracción molar por la presión total: p = x·P.', `p(O₂) = 0,21 × 95,0 kPa = ${rengTx(rengR, 3)} kPa ≈ ${rengTx(rengR, 2)} kPa.`, 'Se da con dos cifras porque la fracción 0,21 solo tiene dos.'],
    pistas: ['¿Qué parte de las moléculas son de oxígeno?', 'La fracción molar reparte la presión total.', 'p = x · P_total.']
  },
  {
    id: 'ej-gas-dalton',
    titulo: 'Gas recogido sobre agua',
    enunciado: 'Se recogen 250 mL de un gas sobre agua a 22,0 °C y presión atmosférica de 99,0 kPa. En el enunciado se toma 2,6 kPa como presión del vapor de agua (valor didáctico, no de tabla).',
    pregunta: '¿Cuántos milimoles del gas se recogieron?',
    datos: [['V', '250 mL'], ['t', '22,0 °C'], ['P atmosférica', '99,0 kPa'], ['p vapor de agua', '2,6 kPa (didáctico)']],
    unidad: 'mmol',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (((99 - 2.6) * 0.25) / (RENG_R_LKPA * rengK(22))) * 1000,
    segundo: () => {
      const rengNTotal = (99 * 0.25) / (RENG_R_LKPA * rengK(22))
      return rengNTotal * (1 - 2.6 / 99) * 1000
    },
    metodoSegundo: 'moles totales de la mezcla húmeda y fracción molar del gas seco, 1 − p_agua/P',
    pasos: (rengR) => ['Ley de Dalton: P = p(gas) + p(agua).', 'p(gas) = 99,0 − 2,6 = 96,4 kPa.', `n = p·V/(R·T) = 96,4 × 0,250 / (8,314 × 295,15) mol = ${rengTx(rengR)} mmol.`, 'Sin restar el vapor saldría un valor algo mayor.'],
    pistas: ['El gas recogido está mezclado con vapor de agua.', 'Resta la presión del vapor a la presión total.', 'Luego n = pV/(RT), y pasa a milimoles.']
  },
  {
    id: 'ej-gas-volumen-molar',
    titulo: 'Volumen molar a 25 °C',
    enunciado: 'Se quiere el volumen que ocupa un mol de gas ideal a 25,0 °C y 1,00 atm.',
    pregunta: '¿Cuál es el volumen molar, en L/mol?',
    datos: [['t', '25,0 °C'], ['P', '1,00 atm'], ['R', '0,082057 L·atm/(mol·K)']],
    unidad: 'L/mol',
    cifras: 4,
    tolerancia: RENG_TOL,
    analitico: () => (RENG_R_LATM * rengK(25)) / 1,
    segundo: () => ((RENG_NA_GAS * RENG_KB_GAS * rengK(25)) / RENG_PA_ATM) * 1000,
    metodoSegundo: 'volumen de N_A moléculas con V = N·k_B·T / P en unidades SI',
    pasos: (rengR) => ['Para n = 1 mol: V_m = R·T / P.', 'T = 298,15 K.', `V_m = 0,082057 × 298,15 / 1,00 = ${rengTx(rengR, 4)} L/mol.`, 'A 0 °C y 1 atm saldría 22,41 L/mol: el valor depende de las condiciones.'],
    pistas: ['El volumen molar es V/n.', 'De PV = nRT: V/n = RT/P.', 'Usa T en kelvin y R en L·atm/(mol·K).']
  },
  {
    id: 'ej-gas-cinetica',
    titulo: 'Energía cinética media de un mol de gas',
    enunciado: 'Según la teoría cinético-molecular, la energía cinética media de traslación depende solo de la temperatura absoluta.',
    pregunta: '¿Cuánta energía cinética de traslación tiene 1 mol de gas ideal a 25,0 °C, en kJ?',
    datos: [['n', '1 mol'], ['t', '25,0 °C'], ['R', '8,314 J/(mol·K)']],
    unidad: 'kJ',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (1.5 * RENG_R_SI * rengK(25)) / 1000,
    segundo: () => (1.5 * RENG_KB_GAS * rengK(25) * RENG_NA_GAS) / 1000,
    metodoSegundo: 'energía media de una molécula, (3/2)·k_B·T, multiplicada por N_A',
    pasos: (rengR) => ['E_c = (3/2)·n·R·T.', 'T = 298,15 K.', `E_c = 1,5 × 8,314 × 298,15 J = ${rengTx(rengR * 1000, 4)} J = ${rengTx(rengR)} kJ.`, 'No depende de qué gas sea: solo de T.'],
    pistas: ['La energía media de traslación es proporcional a T.', 'Por mol: (3/2)·R·T.', 'Recuerda pasar de J a kJ.']
  },
  {
    id: 'ej-gas-velocidad',
    titulo: 'Velocidad cuadrática media del nitrógeno',
    enunciado: `Se considera nitrógeno (N₂, M = ${rengTx(RENG_N2.M, 4)} g/mol, tabla de la app) a 25,0 °C.`,
    pregunta: '¿Cuál es su velocidad cuadrática media, en m/s?',
    datos: [['M', `${rengTx(RENG_N2.M, 4)} g/mol`], ['t', '25,0 °C'], ['R', '8,314 J/(mol·K)']],
    unidad: 'm/s',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => Math.sqrt((3 * RENG_R_SI * rengK(25)) / (RENG_N2.M / 1000)),
    segundo: () => rengUrmsSI(RENG_N2.M, rengK(25)),
    metodoSegundo: 'igualar (1/2)·m·u² = (3/2)·k_B·T para una molécula de masa m = M/N_A',
    pasos: (rengR) => ['u_rms = √(3RT/M) con M en kg/mol.', `M = ${rengTx(RENG_N2.M / 1000, 4)} kg/mol; T = 298,15 K.`, `u_rms = √(3 × 8,314 × 298,15 / ${rengTx(RENG_N2.M / 1000, 4)}) = ${rengTx(rengR)} m/s.`, 'Del orden de cientos de metros por segundo, como la velocidad del sonido en el aire.'],
    pistas: ['La fórmula usa la masa molar en kg/mol, no en g/mol.', 'Con R en J/(mol·K) las unidades salen en m/s.', 'u_rms = √(3RT/M).']
  },
  {
    id: 'ej-gas-difusion',
    titulo: 'Dónde se encuentran dos gases en un tubo',
    enunciado: 'En los extremos de un tubo de 100 cm se liberan a la vez helio (He) y argón (Ar). En un modelo idealizado, cada frente avanza con una rapidez proporcional a 1/√M.',
    pregunta: '¿A qué distancia del extremo del helio se encuentran los frentes, en cm?',
    datos: [['Longitud', '100 cm'], ['M(He)', `${rengTx(RENG_HE.M, 4)} g/mol`], ['M(Ar)', `${rengTx(RENG_AR.M, 4)} g/mol`]],
    unidad: 'cm',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 100 / (1 + Math.sqrt(RENG_HE.M / RENG_AR.M)),
    segundo: () => {
      const rengVa = 1 / Math.sqrt(RENG_HE.M)
      const rengVb = 1 / Math.sqrt(RENG_AR.M)
      const rengDt = 0.01
      let rengT = 0
      while (rengVa * (rengT + rengDt) < 100 - rengVb * (rengT + rengDt)) rengT += rengDt
      const rengHueco = 100 - rengVb * rengT - rengVa * rengT
      return rengVa * (rengT + rengHueco / (rengVa + rengVb))
    },
    metodoSegundo: 'simulación directa: los dos frentes avanzan paso a paso hasta tocarse',
    pasos: (rengR) => ['En el mismo tiempo, cada gas recorre una distancia proporcional a su rapidez.', 'd(He)/d(Ar) = √(M(Ar)/M(He)).', 'Como d(He) + d(Ar) = 100 cm: d(He) = 100 / (1 + √(M(He)/M(Ar))).', `d(He) = ${rengTx(rengR)} cm: el gas más ligero recorre más.`],
    pistas: ['¿Cuál de los dos gases es más ligero?', 'Las distancias recorridas están en la misma razón que las rapideces.', 'Plantea d(He) + d(Ar) = 100 cm.']
  },
  {
    id: 'ej-gas-efusion',
    titulo: 'Tiempo de efusión del oxígeno',
    enunciado: 'Por un orificio diminuto escapa cierta cantidad de helio en 10,0 s. En las mismas condiciones se mide cuánto tarda en escapar la misma cantidad de oxígeno (O₂).',
    pregunta: '¿Cuánto tarda el oxígeno, en s?',
    datos: [['t(He)', '10,0 s'], ['M(He)', `${rengTx(RENG_HE.M, 4)} g/mol`], ['M(O₂)', `${rengTx(RENG_O2.M, 4)} g/mol`]],
    unidad: 's',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 10 * Math.sqrt(RENG_O2.M / RENG_HE.M),
    segundo: () => (10 * rengVelocidadMediaSI(RENG_HE.M, 298.15)) / rengVelocidadMediaSI(RENG_O2.M, 298.15),
    metodoSegundo: 'cociente de las velocidades medias moleculares √(8RT/(πM)) calculadas en valor absoluto a 298,15 K',
    pasos: (rengR) => ['Ley de Graham: la velocidad de efusión es inversamente proporcional a √M.', 'El tiempo para la misma cantidad es inversamente proporcional a la velocidad: t ∝ √M.', `t(O₂) = 10,0 s × √(${rengTx(RENG_O2.M, 4)} / ${rengTx(RENG_HE.M, 4)}) = ${rengTx(rengR)} s.`, 'El oxígeno, más pesado, tarda casi tres veces más.'],
    pistas: ['¿Escapa más rápido el gas ligero o el pesado?', 'Más rapidez significa menos tiempo.', 't₂ = t₁·√(M₂/M₁).']
  },
  {
    id: 'ej-gas-graham',
    titulo: 'Hidrógeno frente a oxígeno',
    enunciado: 'Se comparan la velocidad de efusión del hidrógeno (H₂) y la del oxígeno (O₂) a la misma presión y temperatura.',
    pregunta: '¿Cuántas veces más rápido efunde el hidrógeno?',
    datos: [['M(H₂)', `${rengTx(RENG_H2.M, 4)} g/mol`], ['M(O₂)', `${rengTx(RENG_O2.M, 4)} g/mol`]],
    unidad: '',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => Math.sqrt(RENG_O2.M / RENG_H2.M),
    segundo: () => rengUrmsSI(RENG_H2.M, 300) / rengUrmsSI(RENG_O2.M, 300),
    metodoSegundo: 'cociente de las velocidades cuadráticas medias calculadas en valor absoluto a 300 K',
    pasos: (rengR) => ['Ley de Graham: v₁/v₂ = √(M₂/M₁).', `v(H₂)/v(O₂) = √(${rengTx(RENG_O2.M, 4)} / ${rengTx(RENG_H2.M, 4)}) = ${rengTx(rengR)}.`, 'Casi cuatro veces: la raíz cuadrada suaviza la gran diferencia de masas (16 veces).'],
    pistas: ['El gas más ligero es el más rápido.', 'La relación va con la raíz cuadrada de las masas molares.', 'Pon la masa del gas lento arriba.']
  },
  {
    id: 'ej-gas-desviaciones',
    titulo: 'Factor de compresibilidad',
    enunciado: 'En un ensayo didáctico, 1,00 mol de un gas en 0,500 L a 300 K ejerce 44,0 atm. El modelo ideal predice otra presión.',
    pregunta: '¿Cuál es el factor de compresibilidad Z = PV/(nRT)?',
    datos: [['n', '1,00 mol'], ['V', '0,500 L'], ['T', '300 K'], ['P medida (didáctica)', '44,0 atm']],
    unidad: '',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (44 * 0.5) / (1 * RENG_R_LATM * 300),
    segundo: () => (44 * RENG_PA_ATM * (0.5 / 1000)) / (1 * RENG_NA_GAS * RENG_KB_GAS * 300),
    metodoSegundo: 'mismo cociente en unidades SI, con R = N_A·k_B, Pa y m³',
    pasos: (rengR) => ['Presión ideal: nRT/V = 1,00 × 0,082057 × 300 / 0,500 = 49,2 atm.', `Z = P_medida / P_ideal = 44,0 / 49,2 = ${rengTx(rengR)}.`, 'Z < 1: a esta presión dominan las atracciones entre moléculas y el gas se deja comprimir más que uno ideal.'],
    pistas: ['Z compara el gas medido con uno ideal.', 'Calcula primero la presión que tendría un gas ideal.', 'Z = PV/(nRT) = P_medida / P_ideal.']
  }
]
