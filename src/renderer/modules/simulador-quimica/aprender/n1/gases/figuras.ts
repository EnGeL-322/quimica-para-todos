import { rengFiguraN1, rengMuestrearN1 } from '../figuras'
import type { RengFiguraN1, RengSerieFiguraN1 } from '../tipos'
import { RENG_G_N, RENG_KB_GAS, RENG_KPA_ATM, RENG_NA_GAS, RENG_R_LATM, RENG_R_LKPA, RENG_RHO_HG, rengGasPorFormula } from './constantes'

const RENG_N2 = rengGasPorFormula('N2')

const rengTecho = (rengV: number, rengPaso: number): number => Math.ceil(rengV / rengPaso) * rengPaso
const rengMaximo = (rengSeries: readonly RengSerieFiguraN1[]): number => Math.max(...rengSeries.flatMap((rengS) => rengS.puntos.map(([, rengY]) => rengY)))

function rengMaxwell(rengM: number, rengT: number): (rengU: number) => number {
  const rengMasa = rengM / 1000 / RENG_NA_GAS
  const rengA = rengMasa / (2 * RENG_KB_GAS * rengT)
  return (rengU) => 1000 * 4 * Math.PI * (rengA / Math.PI) ** 1.5 * rengU * rengU * Math.exp(-rengA * rengU * rengU)
}

const RENG_A_VDW = 3.59
const RENG_B_VDW = 0.0427
const RENG_T_VDW = 400

function rengSerieZ(): RengSerieFiguraN1 {
  const rengPuntos: Array<readonly [number, number]> = []
  for (let rengI = 0; rengI <= 200; rengI++) {
    const rengV = 0.12 * Math.pow(25 / 0.12, rengI / 200)
    const rengP = (RENG_R_LATM * RENG_T_VDW) / (rengV - RENG_B_VDW) - RENG_A_VDW / (rengV * rengV)
    if (rengP > 0 && rengP <= 300) rengPuntos.push([rengP, (rengP * rengV) / (RENG_R_LATM * RENG_T_VDW)] as const)
  }
  return { nombre: 'van der Waals (gas hipotético)', puntos: rengPuntos.sort((rengA, rengB) => rengA[0] - rengB[0]) }
}

const rengSeriesMaxwell = [rengMuestrearN1('300 K', rengMaxwell(RENG_N2.M, 300), 0, 2000, 80), rengMuestrearN1('600 K', rengMaxwell(RENG_N2.M, 600), 0, 2000, 80)]
const rengSerieVdw = rengSerieZ()
const rengZMin = Math.floor(Math.min(...rengSerieVdw.puntos.map(([, rengZ]) => rengZ)) * 10) / 10
const rengZMax = Math.max(1.1, Math.ceil(Math.max(...rengSerieVdw.puntos.map(([, rengZ]) => rengZ)) * 10) / 10)

const rengSeriesColumnas = [rengMuestrearN1('mercurio', (rengH) => (RENG_RHO_HG * 1000 * RENG_G_N * rengH) / 1000, 0, 1, 20), rengMuestrearN1('agua (1000 kg/m³)', (rengH) => (1000 * RENG_G_N * rengH) / 1000, 0, 1, 20)]

export const RENG_FIGURAS_GASES: readonly RengFiguraN1[] = [
  rengFiguraN1({
    id: 'fig-gas-densidad-compresion',
    titulo: 'Densidad de un gas encerrado al comprimirlo',
    pie: 'Densidad de 0,250 g de aire encerrado según el volumen que ocupa. La masa no cambia; la densidad crece al reducir el volumen (valores de ejemplo).',
    alternativo: 'Una curva que baja: a 50 mL la densidad es 5 g/L y a 250 mL es 1 g/L; al reducir el volumen a la mitad la densidad se duplica.',
    x: { min: 0, max: 260, titulo: 'V (mL)' },
    y: { min: 0, max: 5.5, titulo: 'ρ (g/L)' },
    series: [rengMuestrearN1('0,250 g de aire', (rengV) => 0.25 / (rengV / 1000), 50, 250, 40)]
  }),
  rengFiguraN1({
    id: 'fig-gas-columnas',
    titulo: 'Presión de una columna de líquido',
    pie: 'Presión que ejerce una columna de mercurio y una de agua según su altura (P = ρ·g·h). Para la misma presión, la columna de agua debe ser unas 13,6 veces más alta.',
    alternativo: 'Dos rectas que salen del origen: la del mercurio sube hasta unos 133 kPa a 1 m; la del agua apenas llega a unos 10 kPa a 1 m.',
    x: { min: 0, max: 1, titulo: 'h (m)' },
    y: { min: 0, max: rengTecho(rengMaximo(rengSeriesColumnas), 20), titulo: 'P (kPa)' },
    series: rengSeriesColumnas
  }),
  rengFiguraN1({
    id: 'fig-gas-boyle',
    titulo: 'Isotermas de un gas ideal',
    pie: 'Presión frente a volumen para 1,00 mol de gas ideal a dos temperaturas (isotermas). A lo largo de cada curva, P·V es constante; pasar de una curva a otra exige cambiar la temperatura.',
    alternativo: 'Dos curvas que bajan y se aplanan: al doblar el volumen la presión se reduce a la mitad; la curva de 373 K va siempre por encima de la de 273 K.',
    x: { min: 0, max: 50, titulo: 'V (L)' },
    y: { min: 0, max: 350, titulo: 'P (kPa)' },
    series: [rengMuestrearN1('273 K', (rengV) => (RENG_R_LKPA * 273.15) / rengV, 7, 50, 43), rengMuestrearN1('373 K', (rengV) => (RENG_R_LKPA * 373.15) / rengV, 9, 50, 41)]
  }),
  rengFiguraN1({
    id: 'fig-gas-charles',
    titulo: 'Volumen y temperatura absoluta a presión constante',
    pie: 'Volumen de 1,00 mol y de 2,00 mol de gas ideal a 1 atm según la temperatura absoluta. Las rectas apuntan al origen: V es proporcional a T en kelvin (el gas real se licúa antes de llegar a 0 K).',
    alternativo: 'Dos rectas que crecen desde la izquierda; prolongadas pasarían por el origen. La de 2 mol tiene el doble de pendiente.',
    x: { min: 0, max: 600, titulo: 'T (K)' },
    y: { min: 0, max: 100, titulo: 'V (L)' },
    series: [rengMuestrearN1('1,00 mol', (rengT) => RENG_R_LATM * rengT, 50, 600, 22), rengMuestrearN1('2,00 mol', (rengT) => 2 * RENG_R_LATM * rengT, 50, 600, 22)]
  }),
  rengFiguraN1({
    id: 'fig-gas-gay-lussac',
    titulo: 'Presión y temperatura absoluta a volumen constante',
    pie: 'Presión de 1,00 mol de gas ideal en recipientes rígidos de 22,4 L y de 11,2 L según la temperatura absoluta. P es proporcional a T en kelvin.',
    alternativo: 'Dos rectas que crecen; la del recipiente pequeño tiene el doble de pendiente. A 273 K la de 22,4 L marca unos 101 kPa.',
    x: { min: 0, max: 600, titulo: 'T (K)' },
    y: { min: 0, max: 460, titulo: 'P (kPa)' },
    series: [rengMuestrearN1('22,4 L', (rengT) => (RENG_R_LKPA * rengT) / 22.4, 50, 600, 22), rengMuestrearN1('11,2 L', (rengT) => (RENG_R_LKPA * rengT) / 11.2, 50, 600, 22)]
  }),
  rengFiguraN1({
    id: 'fig-gas-avogadro',
    titulo: 'Volumen y cantidad de gas',
    pie: 'Volumen que ocupa una cantidad de gas ideal a 1 atm, a 0 °C y a 25 °C. V es proporcional a n; la pendiente es el volumen molar, que depende de la temperatura.',
    alternativo: 'Dos rectas que salen del origen; a 3 mol marcan unos 67 L (0 °C) y unos 73 L (25 °C).',
    x: { min: 0, max: 3, titulo: 'n (mol)' },
    y: { min: 0, max: 80, titulo: 'V (L)' },
    series: [rengMuestrearN1('0 °C', (rengN) => rengN * RENG_R_LATM * 273.15, 0, 3, 12), rengMuestrearN1('25 °C', (rengN) => rengN * RENG_R_LATM * 298.15, 0, 3, 12)]
  }),
  rengFiguraN1({
    id: 'fig-gas-ideal-n',
    titulo: 'Presión y cantidad de gas en un recipiente rígido',
    pie: 'Presión en un recipiente de 10,0 L según la cantidad de gas ideal, a dos temperaturas. Las dos rectas resumen P·V = n·R·T con V fijo.',
    alternativo: 'Dos rectas que salen del origen; la de 600 K tiene el doble de pendiente que la de 300 K.',
    x: { min: 0, max: 2, titulo: 'n (mol)' },
    y: { min: 0, max: 1000, titulo: 'P (kPa)' },
    series: [rengMuestrearN1('300 K', (rengN) => (rengN * RENG_R_LKPA * 300) / 10, 0, 2, 10), rengMuestrearN1('600 K', (rengN) => (rengN * RENG_R_LKPA * 600) / 10, 0, 2, 10)]
  }),
  rengFiguraN1({
    id: 'fig-gas-densidad-m',
    titulo: 'Densidad de un gas ideal según su masa molar',
    pie: 'Densidad de un gas ideal a 1 atm según su masa molar, a 0 °C y a 25 °C (ρ = P·M/(R·T)). A igual P y T, la densidad es proporcional a M.',
    alternativo: 'Dos rectas que salen del origen; a 100 g/mol la de 0 °C marca unos 4,5 g/L y la de 25 °C algo menos, unos 4,1 g/L.',
    x: { min: 0, max: 100, titulo: 'M (g/mol)' },
    y: { min: 0, max: 5, titulo: 'ρ (g/L)' },
    series: [rengMuestrearN1('0 °C', (rengM) => rengM / (RENG_R_LATM * 273.15), 0, 100, 10), rengMuestrearN1('25 °C', (rengM) => rengM / (RENG_R_LATM * 298.15), 0, 100, 10)]
  }),
  rengFiguraN1({
    id: 'fig-gas-parciales',
    titulo: 'Presión parcial según la fracción molar',
    pie: 'Presión parcial de un componente según su fracción molar, para dos presiones totales (p = x·P_total). La marca de x = 0,21 corresponde al oxígeno del aire seco.',
    alternativo: 'Dos rectas que salen del origen y acaban en la presión total cuando x = 1: 101,3 kPa y 70 kPa.',
    x: { min: 0, max: 1, titulo: 'x (fracción molar)' },
    y: { min: 0, max: 110, titulo: 'p (kPa)' },
    series: [rengMuestrearN1('P total 101,325 kPa', (rengX) => rengX * RENG_KPA_ATM, 0, 1, 10), rengMuestrearN1('P total 70 kPa', (rengX) => rengX * 70, 0, 1, 10), { nombre: 'oxígeno del aire (x = 0,21)', puntos: [[0.21, 0.21 * 70], [0.21, 0.21 * RENG_KPA_ATM]] }]
  }),
  rengFiguraN1({
    id: 'fig-gas-maxwell',
    titulo: 'Distribución de velocidades moleculares',
    pie: 'Distribución de Maxwell-Boltzmann de las velocidades de las moléculas de nitrógeno a 300 K y a 600 K, calculada con el modelo. Al calentar, el máximo se desplaza a velocidades mayores y la curva se ensancha.',
    alternativo: 'Dos curvas en forma de campana asimétrica; la de 300 K tiene el máximo cerca de 420 m/s y es más alta y estrecha; la de 600 K tiene el máximo cerca de 600 m/s.',
    x: { min: 0, max: 2000, titulo: 'u (m/s)' },
    y: { min: 0, max: rengTecho(rengMaximo(rengSeriesMaxwell), 0.5), titulo: 'fracción por cada km/s' },
    series: rengSeriesMaxwell
  }),
  rengFiguraN1({
    id: 'fig-gas-graham',
    titulo: 'Velocidad relativa de efusión',
    pie: 'Velocidad de efusión de un gas relativa a la del oxígeno según su masa molar (√(32/M), ley de Graham, modelo idealizado). Los gases ligeros escapan mucho más deprisa.',
    alternativo: 'Una curva que baja deprisa al principio: a 2 g/mol vale 4, a 32 g/mol vale 1 y a 128 g/mol vale 0,5.',
    x: { min: 0, max: 130, titulo: 'M (g/mol)' },
    y: { min: 0, max: 4.5, titulo: 'r / r(O₂)' },
    series: [rengMuestrearN1('√(32/M)', (rengM) => Math.sqrt(32 / rengM), 2, 128, 63)]
  }),
  rengFiguraN1({
    id: 'fig-gas-z',
    titulo: 'Factor de compresibilidad de un gas hipotético',
    pie: 'Factor de compresibilidad Z = P·V/(n·R·T) según la presión, para un gas hipotético de van der Waals (a = 3,59 L²·atm/mol², b = 0,0427 L/mol, didácticos) a 400 K, frente al gas ideal (Z = 1).',
    alternativo: 'Una recta horizontal en Z = 1 para el gas ideal y una curva que baja por debajo de 1 al aumentar la presión, por las atracciones; a presiones aún mayores volvería a subir.',
    x: { min: 0, max: 300, titulo: 'P (atm)' },
    y: { min: rengZMin, max: rengZMax, titulo: 'Z' },
    series: [{ nombre: 'gas ideal', puntos: [[0, 1], [300, 1]] }, rengSerieVdw]
  })
]
