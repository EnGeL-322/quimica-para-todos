import { rengConvertir } from '../../../../../lib/unidades'
import { rengMasaMolarDe } from '../../../nucleo/formula'
import { rengRK4 } from '../numericos'
import type { RengEjemploN1 } from '../tipos'
import { RENG_G_N, RENG_KB_GAS, RENG_KPA_ATM, RENG_NA_GAS, RENG_PA_ATM, RENG_R_LATM, RENG_R_LKPA, RENG_R_SI, RENG_RHO_HG, rengGasPorFormula, rengK, rengTx } from './constantes'

const RENG_TOL = { rel: 0.005, abs: 1e-9 }
const RENG_M_AIRE = 28.96
const RENG_RHO_AGUA = 1000

const RENG_HE = rengGasPorFormula('He')
const RENG_AR = rengGasPorFormula('Ar')
const RENG_O2 = rengGasPorFormula('O2')
const RENG_H2 = rengGasPorFormula('H2')
const RENG_CO2 = rengGasPorFormula('CO2')
const RENG_NE = rengGasPorFormula('Ne')
const RENG_M_CACO3 = rengMasaMolarDe('CaCO3')

const rengPBurbuja = RENG_PA_ATM + RENG_RHO_AGUA * RENG_G_N * 10
const rengPNeumatico1 = 220 + RENG_KPA_ATM
const rengVanDerWaals = (rengN: number, rengV: number, rengT: number, rengA: number, rengB: number): number => (rengN * RENG_R_LATM * rengT) / (rengV - rengN * rengB) - (rengA * rengN * rengN) / (rengV * rengV)
const rengRazonGraham = Math.sqrt(RENG_CO2.M / RENG_H2.M)

export const RENG_EJEMPLOS_GASES_INTEGRADORES: readonly RengEjemploN1[] = [
  {
    id: 'ej-gas-propiedades-2',
    titulo: 'Cuánto se contrae un gas al licuarse',
    enunciado: 'Una muestra de 1,00 g de una sustancia ocupa, como gas, el volumen que corresponde a una densidad de 1,15 g/L; como líquido, su densidad es 0,808 g/mL (densidades didácticas de una sustancia hipotética).',
    pregunta: '¿Cuántas veces mayor es el volumen del gas que el del líquido?',
    datos: [['Masa', '1,00 g'], ['Densidad del gas', '1,15 g/L'], ['Densidad del líquido', '0,808 g/mL']],
    unidad: '',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (0.808 * 1000) / 1.15,
    segundo: () => {
      const rengVGas = rengConvertir(1 / 1.15, 'L', 'mL')
      const rengVLiq = 1 / 0.808
      return rengVGas / rengVLiq
    },
    metodoSegundo: 'volumen de cada fase calculado por separado (V = m/ρ) y pasado a la misma unidad con el catálogo antes de dividir',
    pasos: (rengR) => [
      'Integra la densidad (subtema 1) con el cambio de unidades (subtema 2): la masa es la misma en las dos fases.',
      'Pasa las densidades a la misma unidad: 0,808 g/mL = 808 g/L.',
      'A igual masa, V_gas / V_líquido = ρ_líquido / ρ_gas.',
      `V_gas / V_líquido = 808 / 1,15 = ${rengTx(rengR)}: el gas ocupa unas ${rengTx(rengR, 2)} veces más.`
    ],
    pistas: ['¿Cambia la masa al pasar de gas a líquido?', 'Pon las dos densidades en g/L antes de comparar.', 'A igual masa, el volumen es inverso a la densidad.']
  },
  {
    id: 'ej-gas-presion-2',
    titulo: 'Manómetro abierto y conversión a kPa',
    enunciado: 'Un manómetro de mercurio de tubo abierto está conectado a un recipiente con gas. El mercurio está 38 mm más alto en el lado abierto, así que el gas empuja más que el aire. La presión atmosférica es 752 mmHg.',
    pregunta: '¿Cuál es la presión del gas, en kPa?',
    datos: [['Presión atmosférica', '752 mmHg'], ['Diferencia de niveles', '38 mm de mercurio, a favor del gas'], ['Equivalencia', '760 mmHg = 101,325 kPa']],
    unidad: 'kPa',
    cifras: 4,
    tolerancia: RENG_TOL,
    analitico: () => ((752 + 38) * RENG_KPA_ATM) / 760,
    segundo: () => rengConvertir(752, 'mmHg', 'kPa') + rengConvertir(38, 'mmHg', 'kPa'),
    metodoSegundo: 'cada término convertido por separado a kPa con el catálogo de unidades y sumado después',
    pasos: (rengR) => [
      'El gas empuja más que el aire: P_gas = P_atm + h.',
      'P_gas = 752 mmHg + 38 mmHg = 790 mmHg (las dos en la misma unidad).',
      `Conversión: 790 mmHg × 101,325 kPa / 760 mmHg = ${rengTx(rengR, 4)} kPa.`,
      'Interpretación: algo más que una atmósfera estándar, como cabe esperar si el gas empuja más que el aire.'
    ],
    pistas: ['¿Quién empuja más: el gas o el aire?', 'Suma en mmHg antes de convertir.', 'Usa 760 mmHg = 101,325 kPa.']
  },
  {
    id: 'ej-gas-atmosferica-2',
    titulo: 'Un barómetro de agua',
    enunciado: 'Se imagina un barómetro idealizado en el que el líquido es agua (densidad didáctica 1000 kg/m³) en lugar de mercurio, a presión atmosférica estándar (101,325 kPa) y g = 9,80665 m/s².',
    pregunta: '¿Qué altura alcanzaría la columna de agua, en m?',
    datos: [['Presión', '101,325 kPa'], ['Densidad del agua', '1000 kg/m³ (didáctica)'], ['g', '9,80665 m/s²']],
    unidad: 'm',
    cifras: 4,
    tolerancia: RENG_TOL,
    analitico: () => RENG_PA_ATM / (RENG_RHO_AGUA * RENG_G_N),
    segundo: () => (RENG_RHO_HG * 1000 * 0.76) / RENG_RHO_AGUA,
    metodoSegundo: 'igualdad de presiones de dos columnas, ρ_Hg·h_Hg = ρ_agua·h_agua, con la columna de 760 mm de mercurio que define la atmósfera estándar',
    pasos: (rengR) => [
      'La columna se sostiene cuando su peso por unidad de área iguala la presión del aire: P = ρ·g·h.',
      'Despeja la altura: h = P / (ρ·g).',
      `h = 101 325 Pa / (1000 kg/m³ × 9,80665 m/s²) = ${rengTx(rengR, 4)} m.`,
      'Comprobación: el mercurio es unas 13,6 veces más denso y necesita 0,760 m; 0,760 × 13,6 ≈ 10,3 m.'
    ],
    pistas: ['Escribe la presión de una columna de líquido.', 'Pasa los kPa a Pa antes de despejar.', 'h = P / (ρ·g).']
  },
  {
    id: 'ej-gas-boyle-2',
    titulo: 'Una burbuja que sube desde el fondo',
    enunciado: 'Una burbuja de aire de 2,00 mL se forma a 10,0 m de profundidad en agua (densidad didáctica 1000 kg/m³) y sube hasta la superficie, donde la presión es 101,325 kPa. Su temperatura no cambia.',
    pregunta: '¿Qué volumen tiene al llegar a la superficie, en mL?',
    datos: [['Volumen en el fondo', '2,00 mL'], ['Profundidad', '10,0 m'], ['Presión en la superficie', '101,325 kPa'], ['g', '9,80665 m/s²']],
    unidad: 'mL',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (2 * rengPBurbuja) / RENG_PA_ATM,
    segundo: () => rengRK4((rengP, rengV) => -rengV / rengP, rengPBurbuja, 2, RENG_PA_ATM, 4000),
    metodoSegundo: 'integración RK4 de la ley de Boyle en forma diferencial, dV/dP = −V/P, desde la presión del fondo hasta la de la superficie',
    pasos: (rengR) => [
      `Presión en el fondo (subtema 3): P₁ = P_atm + ρ·g·h = 101 325 Pa + 1000 × 9,80665 × 10,0 Pa = ${rengTx(rengPBurbuja / 1000, 4)} kPa.`,
      'La temperatura y la cantidad de aire no cambian: se aplica Boyle, P₁·V₁ = P₂·V₂.',
      `V₂ = V₁ · P₁ / P₂ = 2,00 mL × ${rengTx(rengPBurbuja / 1000, 4)} / 101,325 = ${rengTx(rengR)} mL.`,
      'Interpretación: a 10 m la presión es casi el doble que arriba, así que la burbuja casi duplica su volumen.'
    ],
    pistas: ['Primero calcula la presión a 10 m de profundidad.', 'La presión del agua se suma a la del aire.', 'Después aplica P₁·V₁ = P₂·V₂.']
  },
  {
    id: 'ej-gas-charles-2',
    titulo: 'El aire que sale de un globo de aire caliente',
    enunciado: 'La envoltura de un globo de aire caliente está abierta por abajo, así que su volumen y la presión del aire de dentro no cambian. El aire interior se calienta de 15,0 °C a 95,0 °C.',
    pregunta: '¿Qué porcentaje de la masa de aire inicial sale del globo?',
    datos: [['Temperatura inicial', '15,0 °C'], ['Temperatura final', '95,0 °C'], ['Volumen y presión', 'constantes']],
    unidad: '%',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (1 - rengK(15) / rengK(95)) * 100,
    segundo: () => {
      const rengRho = (rengT: number): number => (RENG_KPA_ATM * RENG_M_AIRE) / (RENG_R_LKPA * rengT)
      return (1 - rengRho(rengK(95)) / rengRho(rengK(15))) * 100
    },
    metodoSegundo: 'densidad del aire a cada temperatura con ρ = P·M/(R·T) (M = 28,96 g/mol, didáctica) y fracción de masa perdida 1 − ρ₂/ρ₁',
    pasos: (rengR) => [
      'A presión constante, la ley de Charles dice cuánto querría crecer el aire: V ∝ T absoluta.',
      `T₁ = 288,15 K y T₂ = 368,15 K. El aire caliente necesitaría V₂ = V₁ · T₂/T₁ = ${rengTx(rengK(95) / rengK(15), 4)}·V₁.`,
      'Como la envoltura no crece, solo cabe la fracción T₁/T₂ del aire inicial; el resto sale.',
      `Fracción que sale: 1 − T₁/T₂ = 1 − 288,15/368,15 = ${rengTx(rengR)} %.`
    ],
    pistas: ['¿Qué permanece constante: el volumen, la presión o la masa?', 'Usa temperaturas absolutas.', 'La masa que cabe es proporcional a T₁/T₂.']
  },
  {
    id: 'ej-gas-gay-lussac-2',
    titulo: 'La presión de un neumático después de rodar',
    enunciado: 'Un manómetro de neumático marca 220 kPa a 10,0 °C. El manómetro mide la presión por encima de la atmosférica (101,325 kPa). Tras rodar, el aire del neumático está a 45,0 °C; se supone que el volumen del neumático no cambia.',
    pregunta: '¿Qué marcará el manómetro, en kPa?',
    datos: [['Lectura inicial', '220 kPa (manométrica)'], ['Presión atmosférica', '101,325 kPa'], ['Temperaturas', '10,0 °C → 45,0 °C']],
    unidad: 'kPa',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (rengPNeumatico1 * rengK(45)) / rengK(10) - RENG_KPA_ATM,
    segundo: () => rengRK4((rengT, rengP) => rengP / rengT, rengK(10), rengPNeumatico1, rengK(45), 4000) - RENG_KPA_ATM,
    metodoSegundo: 'integración RK4 de dP/dT = P/T (Gay-Lussac en forma diferencial) sobre la presión absoluta, y resta de la atmosférica al final',
    pasos: (rengR) => [
      `El manómetro mide sobre la atmósfera (subtema 2): P₁ absoluta = 220 + 101,325 = ${rengTx(rengPNeumatico1, 4)} kPa.`,
      'Volumen y cantidad constantes: P₂ = P₁ · T₂/T₁ con temperaturas absolutas.',
      `P₂ = ${rengTx(rengPNeumatico1, 4)} × 318,15 / 283,15 = ${rengTx(rengR + RENG_KPA_ATM, 4)} kPa absolutos.`,
      `Lectura del manómetro: ${rengTx(rengR + RENG_KPA_ATM, 4)} − 101,325 = ${rengTx(rengR)} kPa.`
    ],
    pistas: ['¿El manómetro da la presión absoluta?', 'Aplica Gay-Lussac a la presión absoluta.', 'Al final, vuelve a restar la atmosférica.']
  },
  {
    id: 'ej-gas-avogadro-2',
    titulo: 'Volúmenes en la combustión del propano',
    enunciado: 'Se queman por completo 2,00 L de propano: C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O. Todos los volúmenes se miden a la misma presión y a una temperatura a la que el agua es gas.',
    pregunta: '¿Qué volumen total de productos gaseosos se forma, en L?',
    datos: [['Volumen de propano', '2,00 L'], ['Ecuación', 'C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O(g)'], ['Condiciones', 'mismas P y T']],
    unidad: 'L',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 2 * (3 + 4),
    segundo: () => {
      const rengT = 473.15
      const rengN = (RENG_KPA_ATM * 2) / (RENG_R_LKPA * rengT)
      return ((3 + 4) * rengN * RENG_R_LKPA * rengT) / RENG_KPA_ATM
    },
    metodoSegundo: 'moles de propano con P·V = n·R·T en unas condiciones elegidas (101,325 kPa, 473,15 K), estequiometría en moles y vuelta a volumen',
    pasos: (rengR) => [
      'Ley de Avogadro: a igual P y T, los volúmenes de gas son proporcionales a los moles, así que siguen a los coeficientes.',
      'Por cada volumen de propano se forman 3 de CO₂ y 4 de vapor de agua: 7 volúmenes de productos.',
      `V_productos = 2,00 L × 7 = ${rengTx(rengR)} L.`,
      'Cuidado: si el agua condensara, solo contaría el CO₂ (6,00 L); el enunciado pide agua en estado gaseoso.'
    ],
    pistas: ['A igual P y T, volumen y moles van juntos.', 'Lee los coeficientes de los productos gaseosos.', 'Multiplica el volumen de propano por la suma de coeficientes.']
  },
  {
    id: 'ej-gas-combinada-2',
    titulo: 'Un globo sonda en altura',
    enunciado: 'Un globo sonda se llena con 5,00 m³ de helio a 101 kPa y 20,0 °C. A cierta altura, la presión exterior es 30,0 kPa y la temperatura −40,0 °C. Se supone que la envoltura se estira sin oponer presión.',
    pregunta: '¿Qué volumen ocupa el helio a esa altura, en m³?',
    datos: [['Estado inicial', '5,00 m³, 101 kPa, 20,0 °C'], ['Estado final', '30,0 kPa, −40,0 °C']],
    unidad: 'm³',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => 5 * (101 / 30) * (rengK(-40) / rengK(20)),
    segundo: () => {
      const rengN = (101 * 5000) / (RENG_R_LKPA * rengK(20))
      return (rengN * RENG_R_LKPA * rengK(-40)) / 30 / 1000
    },
    metodoSegundo: 'moles de helio calculados en el estado inicial con P·V = n·R·T (en L y kPa) y volumen final con la misma ecuación',
    pasos: (rengR) => [
      'Cambian la presión y la temperatura a la vez; la cantidad de helio no cambia: ley combinada.',
      'V₂ = V₁ · (P₁/P₂) · (T₂/T₁), con temperaturas absolutas: 293,15 K y 233,15 K.',
      `La presión baja a menos de un tercio (factor ${rengTx(101 / 30, 3)}) y el frío reduce un poco (factor ${rengTx(rengK(-40) / rengK(20), 3)}).`,
      `V₂ = 5,00 × ${rengTx(101 / 30, 4)} × ${rengTx(rengK(-40) / rengK(20), 4)} = ${rengTx(rengR)} m³.`
    ],
    pistas: ['¿Qué se mantiene constante?', 'Usa temperaturas absolutas.', 'Cada cociente actúa por separado.']
  },
  {
    id: 'ej-gas-ideal-2',
    titulo: 'Masa de oxígeno en una botella',
    enunciado: `Una botella de 2,50 L contiene oxígeno a 5,00 atm y 25,0 °C. Masa molar del O₂: ${rengTx(RENG_O2.M, 4)} g/mol (tabla de la app, sin verificar).`,
    pregunta: '¿Cuántos gramos de oxígeno contiene?',
    datos: [['Volumen', '2,50 L'], ['Presión', '5,00 atm'], ['Temperatura', '25,0 °C'], ['R', '0,08206 L·atm/(mol·K)']],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => ((5 * 2.5) / (RENG_R_LATM * rengK(25))) * RENG_O2.M,
    segundo: () => {
      const rengMoleculas = (5 * RENG_PA_ATM * 2.5e-3) / (RENG_KB_GAS * rengK(25))
      return (rengMoleculas * RENG_O2.M) / RENG_NA_GAS
    },
    metodoSegundo: 'número de moléculas N = P·V/(k_B·T) en unidades del SI y masa = N·M/N_A',
    pasos: (rengR) => [
      'Cantidad de gas con la ecuación de estado: n = P·V / (R·T).',
      `n = 5,00 atm × 2,50 L / (0,08206 × 298,15) = ${rengTx(rengR / RENG_O2.M, 4)} mol.`,
      `Masa (subtema 11 al revés): m = n·M = ${rengTx(rengR / RENG_O2.M, 4)} mol × ${rengTx(RENG_O2.M, 4)} g/mol = ${rengTx(rengR)} g.`,
      'Límite: a presiones mucho mayores (como en las botellas de buceo) el gas ideal ya no basta.'
    ],
    pistas: ['Primero los moles con P·V = n·R·T.', 'Usa R en L·atm/(mol·K) porque P está en atm.', 'Masa = moles × masa molar.']
  },
  {
    id: 'ej-gas-densidad-2',
    titulo: 'Cuánto levanta un globo de helio',
    enunciado: `Un globo de 10,0 L lleno de helio está rodeado de aire a 1,00 atm y 25,0 °C. Masa molar media del aire: 28,96 g/mol (valor didáctico de una mezcla); helio: ${rengTx(RENG_HE.M, 4)} g/mol (tabla de la app).`,
    pregunta: '¿Cuántos gramos más pesa el aire desplazado que el helio del globo (empuje neto, sin contar la goma)?',
    datos: [['Volumen', '10,0 L'], ['Presión y temperatura', '1,00 atm y 25,0 °C'], ['M aire', '28,96 g/mol (didáctica)'], ['M helio', `${rengTx(RENG_HE.M, 4)} g/mol`]],
    unidad: 'g',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (((RENG_M_AIRE - RENG_HE.M) * 1) / (RENG_R_LATM * rengK(25))) * 10,
    segundo: () => {
      const rengN = (RENG_KPA_ATM * 10) / (RENG_R_LKPA * rengK(25))
      return rengN * RENG_M_AIRE - rengN * RENG_HE.M
    },
    metodoSegundo: 'moles que caben en 10,0 L (los mismos para el aire y el helio, por Avogadro) y diferencia de masas n·M',
    pasos: (rengR) => [
      'Densidad de un gas ideal: ρ = P·M/(R·T). A igual P y T, la diferencia de densidades depende solo de la diferencia de masas molares.',
      `ρ_aire − ρ_He = (28,96 − ${rengTx(RENG_HE.M, 4)}) × 1,00 / (0,08206 × 298,15) = ${rengTx(rengR / 10, 4)} g/L.`,
      `En 10,0 L: ${rengTx(rengR / 10, 4)} g/L × 10,0 L = ${rengTx(rengR)} g.`,
      'Interpretación: el globo puede levantar unos pocos gramos (menos la masa de la goma).'
    ],
    pistas: ['Compara las densidades de los dos gases en las mismas condiciones.', 'ρ = P·M/(R·T).', 'Multiplica la diferencia de densidades por el volumen.']
  },
  {
    id: 'ej-gas-masa-molar-2',
    titulo: 'Identificar un gas por su densidad',
    enunciado: 'Un gas desconocido tiene una densidad de 1,96 g/L a 0,00 °C y 1,00 atm (dato didáctico).',
    pregunta: '¿Cuál es su masa molar, en g/mol?',
    datos: [['Densidad', '1,96 g/L'], ['Temperatura', '0,00 °C'], ['Presión', '1,00 atm']],
    unidad: 'g/mol',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (1.96 * RENG_R_LATM * rengK(0)) / 1,
    segundo: () => {
      const rengVm = (RENG_R_SI * rengK(0)) / RENG_KPA_ATM
      return 1.96 * rengVm
    },
    metodoSegundo: 'volumen molar a 0 °C y 1 atm calculado con R en L·kPa/(mol·K) y masa molar como masa de un volumen molar (M = ρ·V_m)',
    pasos: (rengR) => [
      'De la densidad del gas ideal (subtema 10): M = ρ·R·T / P.',
      `M = 1,96 g/L × 0,08206 × 273,15 K / 1,00 atm = ${rengTx(rengR)} g/mol.`,
      'Otra lectura: un mol ocupa unos 22,4 L a 0 °C y 1 atm, y 22,4 L de este gas tienen esa masa.',
      'Candidatos con esa masa molar: el dióxido de carbono y el propano (unos 44 g/mol); la densidad sola no los distingue.'
    ],
    pistas: ['Parte de ρ = P·M/(R·T).', 'Despeja la masa molar M.', 'Temperatura en kelvin.']
  },
  {
    id: 'ej-gas-parciales-2',
    titulo: 'Presión parcial a partir de las masas',
    enunciado: `Un recipiente de 5,00 L contiene 2,00 g de helio y 8,00 g de argón a 25,0 °C. Masas molares de la tabla de la app: He ${rengTx(RENG_HE.M, 4)} g/mol, Ar ${rengTx(RENG_AR.M, 4)} g/mol.`,
    pregunta: '¿Cuál es la presión parcial del helio, en kPa?',
    datos: [['Volumen', '5,00 L'], ['Helio', '2,00 g'], ['Argón', '8,00 g'], ['Temperatura', '25,0 °C']],
    unidad: 'kPa',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => ((2 / RENG_HE.M) * RENG_R_LKPA * rengK(25)) / 5,
    segundo: () => {
      const rengNHe = 2 / RENG_HE.M
      const rengNAr = 8 / RENG_AR.M
      const rengPTotal = ((rengNHe + rengNAr) * RENG_R_LKPA * rengK(25)) / 5
      return (rengNHe / (rengNHe + rengNAr)) * rengPTotal
    },
    metodoSegundo: 'presión total de la mezcla y reparto por la fracción molar, p = x·P_total',
    pasos: (rengR) => [
      `Moles (subtema 11 al revés): n_He = 2,00/${rengTx(RENG_HE.M, 4)} = ${rengTx(2 / RENG_HE.M, 4)} mol; n_Ar = 8,00/${rengTx(RENG_AR.M, 4)} = ${rengTx(8 / RENG_AR.M, 4)} mol.`,
      'Cada gas se comporta como si estuviera solo en el recipiente: p_He = n_He·R·T/V.',
      `p_He = ${rengTx(2 / RENG_HE.M, 4)} × 8,314 × 298,15 / 5,00 = ${rengTx(rengR)} kPa.`,
      'Aunque hay cuatro veces más masa de argón, el helio tiene más moles y más presión parcial.'
    ],
    pistas: ['Pasa cada masa a moles.', 'La presión parcial depende de los moles, no de la masa.', 'p = n·R·T/V con R en L·kPa/(mol·K).']
  },
  {
    id: 'ej-gas-dalton-2',
    titulo: 'Conectar dos recipientes',
    enunciado: 'Un matraz de 1,00 L con helio a 150 kPa se conecta mediante una llave con otro de 2,00 L con neón a 60,0 kPa. Los dos están a la misma temperatura, que no cambia. Se abre la llave y los gases se mezclan.',
    pregunta: '¿Cuál es la presión total final, en kPa?',
    datos: [['Matraz A', '1,00 L de helio a 150 kPa'], ['Matraz B', '2,00 L de neón a 60,0 kPa'], ['Temperatura', 'constante']],
    unidad: 'kPa',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (150 * 1 + 60 * 2) / 3,
    segundo: () => {
      const rengT = 298.15
      const rengNA = (150 * 1) / (RENG_R_LKPA * rengT)
      const rengNB = (60 * 2) / (RENG_R_LKPA * rengT)
      return ((rengNA + rengNB) * RENG_R_LKPA * rengT) / 3
    },
    metodoSegundo: 'moles de cada gas con P·V = n·R·T a una temperatura cualquiera (298,15 K) y presión de la suma de moles en 3,00 L',
    pasos: (rengR) => [
      `Cada gas pasa a ocupar 3,00 L (Boyle): p_He = 150 × 1,00/3,00 = ${rengTx(50)} kPa; p_Ne = 60,0 × 2,00/3,00 = ${rengTx(40)} kPa.`,
      'Ley de Dalton: la presión total es la suma de las parciales.',
      `P_total = 50,0 + 40,0 = ${rengTx(rengR)} kPa.`,
      'Error que se evita: sumar 150 + 60 sin tener en cuenta que el volumen se triplicó.'
    ],
    pistas: ['¿Qué volumen ocupa cada gas después de abrir la llave?', 'Aplica Boyle a cada gas por separado.', 'Suma las presiones parciales.']
  },
  {
    id: 'ej-gas-volumen-molar-2',
    titulo: 'Volumen de CO₂ al descomponer caliza',
    enunciado: `Al calentar 10,0 g de carbonato de calcio se descompone por completo: CaCO₃ → CaO + CO₂. El CO₂ se mide a 25,0 °C y 1,00 atm. Masa molar del CaCO₃: ${rengTx(RENG_M_CACO3, 4)} g/mol (tabla de la app, sin verificar).`,
    pregunta: '¿Qué volumen de CO₂ se obtiene, en L?',
    datos: [['Masa de CaCO₃', '10,0 g'], ['Ecuación', 'CaCO₃ → CaO + CO₂'], ['Condiciones del gas', '25,0 °C y 1,00 atm']],
    unidad: 'L',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (10 / RENG_M_CACO3) * RENG_R_LATM * rengK(25),
    segundo: () => {
      const rengN = 10 / RENG_M_CACO3
      return (rengN * RENG_R_SI * rengK(25)) / RENG_PA_ATM * 1000
    },
    metodoSegundo: 'volumen en m³ con R en J/(mol·K) y P en Pa, pasado a litros',
    pasos: (rengR) => [
      `Moles de CaCO₃: n = 10,0 g / ${rengTx(RENG_M_CACO3, 4)} g/mol = ${rengTx(10 / RENG_M_CACO3, 4)} mol; por la ecuación, se forman los mismos moles de CO₂.`,
      `Volumen molar a 25,0 °C y 1,00 atm: V_m = R·T/P = 0,08206 × 298,15 = ${rengTx(RENG_R_LATM * rengK(25), 4)} L/mol.`,
      `V = n · V_m = ${rengTx(rengR)} L.`,
      'Usar 22,4 L/mol (que es para 0 °C) daría un resultado un 8 % menor.'
    ],
    pistas: ['Pasa la masa de CaCO₃ a moles.', 'Un mol de CaCO₃ da un mol de CO₂.', 'Volumen molar a 25 °C, no a 0 °C.']
  },
  {
    id: 'ej-gas-cinetica-2',
    titulo: 'Energía de traslación de las moléculas de un frasco',
    enunciado: 'Un frasco de 2,00 L contiene aire a 101,325 kPa y 25,0 °C.',
    pregunta: '¿Cuánta energía cinética de traslación tienen, en total, sus moléculas, en J?',
    datos: [['Volumen', '2,00 L'], ['Presión', '101,325 kPa'], ['Temperatura', '25,0 °C']],
    unidad: 'J',
    cifras: 4,
    tolerancia: RENG_TOL,
    analitico: () => 1.5 * RENG_KPA_ATM * 2,
    segundo: () => {
      const rengN = (RENG_KPA_ATM * 2) / (RENG_R_LKPA * rengK(25))
      return 1.5 * rengN * RENG_R_SI * rengK(25)
    },
    metodoSegundo: 'moles con P·V = n·R·T y energía molar (3/2)·R·T multiplicada por los moles',
    pasos: (rengR) => [
      'Teoría cinética: la energía de traslación de n moles es (3/2)·n·R·T.',
      'Como P·V = n·R·T (subtema 9), esa energía también vale (3/2)·P·V: no hace falta conocer n ni T.',
      `E = 1,5 × 101,325 kPa × 2,00 L = ${rengTx(rengR, 4)} J (kPa·L = J).`,
      'Interpretación: es la energía de movimiento desordenado; no se puede convertir entera en trabajo útil.'
    ],
    pistas: ['Relaciona n·R·T con P·V.', 'E = (3/2)·n·R·T.', 'Recuerda que 1 kPa·L = 1 J.']
  },
  {
    id: 'ej-gas-velocidad-2',
    titulo: 'Hidrógeno tan lento como el oxígeno',
    enunciado: `El oxígeno (O₂, M = ${rengTx(RENG_O2.M, 4)} g/mol) está a 300 K. Se quiere saber a qué temperatura el hidrógeno (H₂, M = ${rengTx(RENG_H2.M, 4)} g/mol) tendría la misma velocidad cuadrática media. Masas de la tabla de la app.`,
    pregunta: '¿A qué temperatura, en K?',
    datos: [['Oxígeno', `${rengTx(RENG_O2.M, 4)} g/mol a 300 K`], ['Hidrógeno', `${rengTx(RENG_H2.M, 4)} g/mol`]],
    unidad: 'K',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (300 * RENG_H2.M) / RENG_O2.M,
    segundo: () => {
      const rengU = Math.sqrt((3 * RENG_KB_GAS * 300) / (RENG_O2.M / 1000 / RENG_NA_GAS))
      return (rengU * rengU * (RENG_H2.M / 1000 / RENG_NA_GAS)) / (3 * RENG_KB_GAS)
    },
    metodoSegundo: 'u_rms del oxígeno calculada en el SI con la masa de una molécula y despeje de T para la molécula de hidrógeno',
    pasos: (rengR) => [
      'u_rms = √(3·R·T/M): para que dos gases tengan la misma u_rms, T/M debe ser igual.',
      'T_H₂ = T_O₂ · M_H₂ / M_O₂.',
      `T_H₂ = 300 K × ${rengTx(RENG_H2.M, 4)} / ${rengTx(RENG_O2.M, 4)} = ${rengTx(rengR)} K.`,
      'A esa temperatura el hidrógeno real ya estaría cerca de condensarse: el resultado es del modelo ideal.'
    ],
    pistas: ['Iguala las dos velocidades cuadráticas medias.', 'Se cancelan 3 y R.', 'T/M debe ser la misma para los dos gases.']
  },
  {
    id: 'ej-gas-difusion-2',
    titulo: 'Difusión a partir de densidades',
    enunciado: 'Dos gases, A y B, tienen densidades de 0,714 g/L y 1,25 g/L medidas a 0,00 °C y 1,00 atm (datos didácticos). En el modelo idealizado de difusión, cada gas avanza con rapidez proporcional a 1/√M.',
    pregunta: '¿Cuántas veces más distancia recorre el gas A que el B en el mismo tiempo?',
    datos: [['Densidad de A', '0,714 g/L'], ['Densidad de B', '1,25 g/L'], ['Condiciones', '0,00 °C y 1,00 atm, las mismas para los dos']],
    unidad: '',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => Math.sqrt(1.25 / 0.714),
    segundo: () => {
      const rengMA = 0.714 * RENG_R_LATM * rengK(0)
      const rengMB = 1.25 * RENG_R_LATM * rengK(0)
      return Math.sqrt(rengMB / rengMA)
    },
    metodoSegundo: 'masa molar de cada gas a partir de su densidad (M = ρ·R·T/P) y razón de Graham con las masas molares',
    pasos: (rengR) => [
      'A igual P y T, la densidad de un gas ideal es proporcional a su masa molar (subtema 10): ρ_B/ρ_A = M_B/M_A.',
      'En el modelo idealizado, d_A/d_B = v_A/v_B = √(M_B/M_A) = √(ρ_B/ρ_A).',
      `d_A/d_B = √(1,25/0,714) = ${rengTx(rengR)}.`,
      'No hace falta calcular las masas molares: basta con comparar densidades medidas en las mismas condiciones.'
    ],
    pistas: ['¿Qué relación hay entre densidad y masa molar a igual P y T?', 'La rapidez va con 1/√M.', 'Compara densidades dentro de la raíz.']
  },
  {
    id: 'ej-gas-efusion-2',
    titulo: 'Enriquecer una mezcla por efusión',
    enunciado: `Una mezcla equimolar de hidrógeno (H₂) y dióxido de carbono (CO₂) efunde por un orificio diminuto. Masas molares de la tabla de la app: ${rengTx(RENG_H2.M, 4)} y ${rengTx(RENG_CO2.M, 4)} g/mol.`,
    pregunta: '¿Qué fracción molar de hidrógeno tiene el gas que sale al principio?',
    datos: [['Mezcla inicial', '50 % H₂ y 50 % CO₂ en moles'], ['M H₂', `${rengTx(RENG_H2.M, 4)} g/mol`], ['M CO₂', `${rengTx(RENG_CO2.M, 4)} g/mol`]],
    unidad: '',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => rengRazonGraham / (1 + rengRazonGraham),
    segundo: () => {
      const rengVelocidad = (rengM: number, rengN: number): number => rengN / Math.sqrt(rengM)
      const rengH = rengVelocidad(RENG_H2.M, 0.5)
      const rengC = rengVelocidad(RENG_CO2.M, 0.5)
      return rengH / (rengH + rengC)
    },
    metodoSegundo: 'velocidad de efusión de cada componente proporcional a su cantidad dividida por √M, y fracción del caudal total',
    pasos: (rengR) => [
      `Graham (subtema 19): r_H₂ / r_CO₂ = √(M_CO₂/M_H₂) = ${rengTx(rengRazonGraham, 4)} para la misma cantidad de cada gas.`,
      'Por cada mol de CO₂ que sale, salen ese número de moles de H₂.',
      `x_H₂ = ${rengTx(rengRazonGraham, 4)} / (1 + ${rengTx(rengRazonGraham, 4)}) = ${rengTx(rengR)}.`,
      'El gas que escapa al principio se enriquece en el componente ligero; repetir la etapa lo enriquece más.'
    ],
    pistas: ['¿Cuál de los dos gases escapa más deprisa?', 'La razón de velocidades es √(M_pesado/M_ligero).', 'Fracción = parte del H₂ sobre el total que sale.']
  },
  {
    id: 'ej-gas-graham-2',
    titulo: 'Masa molar a partir de tiempos de efusión',
    enunciado: `La misma cantidad de un gas desconocido tarda 105 s en efundir por un orificio, y la de oxígeno (O₂, ${rengTx(RENG_O2.M, 4)} g/mol, tabla de la app) tarda 75,0 s en las mismas condiciones (datos didácticos).`,
    pregunta: '¿Cuál es la masa molar del gas desconocido, en g/mol?',
    datos: [['Tiempo del gas X', '105 s'], ['Tiempo del oxígeno', '75,0 s'], ['M O₂', `${rengTx(RENG_O2.M, 4)} g/mol`]],
    unidad: 'g/mol',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => RENG_O2.M * (105 / 75) ** 2,
    segundo: () => {
      const rengRazonVelocidades = 75 / 105
      return RENG_O2.M / (rengRazonVelocidades * rengRazonVelocidades)
    },
    metodoSegundo: 'razón de velocidades r_X/r_O₂ = t_O₂/t_X y despeje de M_X = M_O₂/(r_X/r_O₂)²',
    pasos: (rengR) => [
      'Para la misma cantidad, la velocidad es inversa al tiempo (subtema 18): tardar más significa efundir más despacio.',
      'Graham con tiempos: t_X / t_O₂ = √(M_X / M_O₂).',
      `M_X = M_O₂ · (t_X/t_O₂)² = ${rengTx(RENG_O2.M, 4)} × (105/75,0)² = ${rengTx(rengR)} g/mol.`,
      'Comprobación: tarda más que el oxígeno, así que debe ser más pesado; sale casi el doble.'
    ],
    pistas: ['¿Tardar más significa ser más ligero o más pesado?', 'Escribe Graham con tiempos.', 'Eleva al cuadrado al despejar M.']
  },
  {
    id: 'ej-gas-desviaciones-2',
    titulo: 'Factor de compresibilidad según van der Waals',
    enunciado: 'Para 1,00 mol de un gas hipotético en 0,500 L a 300 K se usan los parámetros didácticos de van der Waals a = 3,59 L²·atm/mol² y b = 0,0427 L/mol.',
    pregunta: '¿Qué factor de compresibilidad Z = P·V/(n·R·T) predice van der Waals?',
    datos: [['Cantidad', '1,00 mol'], ['Volumen', '0,500 L'], ['Temperatura', '300 K'], ['a y b', '3,59 L²·atm/mol² y 0,0427 L/mol (didácticos)']],
    unidad: '',
    cifras: 3,
    tolerancia: RENG_TOL,
    analitico: () => (rengVanDerWaals(1, 0.5, 300, 3.59, 0.0427) * 0.5) / (RENG_R_LATM * 300),
    segundo: () => 0.5 / (0.5 - 0.0427) - (3.59 * 1) / (0.5 * RENG_R_LATM * 300),
    metodoSegundo: 'forma reordenada Z = V/(V − n·b) − a·n/(V·R·T), que no calcula la presión',
    pasos: (rengR) => [
      `Presión de van der Waals (subtema 20): P = n·R·T/(V − n·b) − a·n²/V² = ${rengTx(rengVanDerWaals(1, 0.5, 300, 3.59, 0.0427), 4)} atm.`,
      `El modelo ideal daría P = n·R·T/V = ${rengTx((RENG_R_LATM * 300) / 0.5, 4)} atm.`,
      `Z = P·V/(n·R·T) = ${rengTx(rengR)}.`,
      'Z < 1: domina la atracción entre moléculas, que reduce la presión respecto del gas ideal.'
    ],
    pistas: ['Calcula primero la presión de van der Waals.', 'Divide por la presión ideal o usa Z = PV/(nRT).', 'Z < 1 indica que dominan las atracciones.']
  }
]
