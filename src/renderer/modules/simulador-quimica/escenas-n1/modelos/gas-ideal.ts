import { RENG_PROCEDENCIA_NA_KB, RENG_PROCEDENCIA_R, rengCalculado, rengDidactico, rengIdealizado } from '../../aprender/n1/procedencia'
import { RENG_R_SI } from '../../aprender/n1/gases/constantes'
import { rengGasIdeal } from '../../nucleo/estequiometria'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const RENG_P_ATM_KPA = 101.325
const RENG_V_MAX = 50

const rengNum = (rengV: number, rengC = 3): string => String(Number(rengV.toPrecision(rengC))).replace('.', ',')

export function rengPresionGasIdealKPa(rengV: RengValoresEscenaN1): number {
  return rengGasIdeal({ n: rengV.n!, T: rengV.T!, V: rengV.V! }).P / 1000
}

export function rengLecturasGasIdeal(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengP = rengPresionGasIdealKPa(rengV)
  const rengN = rengV.n!
  const rengT = rengV.T!
  const rengVol = rengV.V!
  const rengM = rengV.M!
  return {
    P: rengP,
    Patm: rengP / RENG_P_ATM_KPA,
    R: (rengP * rengVol) / (rengN * rengT),
    Vm: rengVol / rengN,
    V1atm: (rengN * RENG_R_SI * rengT) / RENG_P_ATM_KPA,
    rho: (rengN * rengM) / rengVol,
    urms: Math.sqrt((3 * RENG_R_SI * rengT) / (rengM / 1000)),
    Ec: (1.5 * RENG_R_SI * rengT) / 1000
  }
}

const rengIsoterma = (rengN: number, rengT: number, rengYMax: number): Array<readonly [number, number]> =>
  Array.from({ length: 99 }, (_rengX, rengI) => 1 + (rengI * (RENG_V_MAX - 1)) / 98)
    .map((rengVol) => [rengVol, (rengN * RENG_R_SI * rengT) / rengVol] as const)
    .filter(([, rengP]) => rengP <= rengYMax)

export const RENG_ESCENA_GAS_IDEAL: RengModeloEscenaN1 = {
  id: 'gas-ideal',
  nombre: 'Gas ideal en un recipiente',
  subtemas: ['n1-b1-s8', 'n1-b1-s22', 'n1-b8-s1', 'n1-b8-s4', 'n1-b8-s5', 'n1-b8-s6', 'n1-b8-s7', 'n1-b8-s8', 'n1-b8-s9', 'n1-b8-s10', 'n1-b8-s11', 'n1-b8-s14', 'n1-b8-s15', 'n1-b8-s16', 'n1-b7-s12', 'n1-b7-s20'],
  pregunta: '¿Qué presión ejerce una cantidad de gas en un recipiente, y cómo cambia al variar el volumen, la temperatura o la cantidad?',
  parametros: [
    { clave: 'n', etiqueta: 'Cantidad de gas n', unidad: 'mol', min: 0.1, max: 5, paso: 0.05, inicial: 1 },
    { clave: 'T', etiqueta: 'Temperatura absoluta T', unidad: 'K', min: 150, max: 800, paso: 5, inicial: 300 },
    { clave: 'V', etiqueta: 'Volumen del recipiente V', unidad: 'L', min: 1, max: RENG_V_MAX, paso: 0.5, inicial: 24.5 },
    { clave: 'M', etiqueta: 'Masa molar del gas M', unidad: 'g/mol', min: 2, max: 150, paso: 1, inicial: 28 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'P', etiqueta: 'Presión P', unidad: 'kPa', cifras: 4 },
    { clave: 'Patm', etiqueta: 'Presión en atmósferas', unidad: 'atm', cifras: 4 },
    { clave: 'R', etiqueta: 'P·V/(n·T)', unidad: 'J/(mol·K)', cifras: 5 },
    { clave: 'Vm', etiqueta: 'Volumen molar V/n', unidad: 'L/mol', cifras: 4 },
    { clave: 'V1atm', etiqueta: 'Volumen que ocuparía a 1 atm', unidad: 'L', cifras: 4 },
    { clave: 'rho', etiqueta: 'Densidad ρ', unidad: 'g/L', cifras: 4 },
    { clave: 'urms', etiqueta: 'Velocidad cuadrática media', unidad: 'm/s', cifras: 4 },
    { clave: 'Ec', etiqueta: 'Energía cinética media por mol', unidad: 'kJ/mol', cifras: 4 }
  ],
  lecturas: (rengV) => rengLecturasGasIdeal(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `${rengNum(rengV.n!)} mol de gas a ${rengNum(rengV.T!, 4)} K en ${rengNum(rengV.V!)} L ejercen ${rengNum(rengL.P!)} kPa (${rengNum(rengL.Patm!)} atm). El cociente P·V/(n·T) vale ${rengNum(rengL.R!, 5)} J/(mol·K), que es R: así se comprueba la ecuación de estado. A 1 atm esa misma cantidad ocuparía ${rengNum(rengL.V1atm!)} L. Con M = ${rengNum(rengV.M!)} g/mol, la densidad es ${rengNum(rengL.rho!)} g/L y las moléculas se mueven con una velocidad cuadrática media de ${rengNum(rengL.urms!)} m/s.`,
  grafica: {
    tituloX: 'V (L)',
    tituloY: 'P (kPa)',
    ejeX: () => [0, RENG_V_MAX],
    ejeY: (rengV) => [0, Math.max(50, 3 * rengPresionGasIdealKPa(rengV))],
    curvas: (rengV) => {
      const rengYMax = Math.max(50, 3 * rengPresionGasIdealKPa(rengV))
      return [
        { nombre: `isoterma a ${rengNum(rengV.T!, 4)} K`, puntos: rengIsoterma(rengV.n!, rengV.T!, rengYMax) },
        { nombre: `isoterma a ${rengNum(rengV.T! + 100, 4)} K`, puntos: rengIsoterma(rengV.n!, rengV.T! + 100, rengYMax) }
      ]
    },
    cursor: (rengV, _rengT, rengL) => [rengV.V!, rengL.P!]
  },
  ficha: {
    descripcion: 'Modelo del gas ideal: la presión se calcula con P·V = n·R·T para la cantidad, la temperatura y el volumen elegidos. La masa molar solo interviene en la densidad y en la velocidad de las moléculas. La gráfica muestra dos isotermas (P frente a V a temperatura constante) y el estado actual.',
    ecuaciones: [
      { tex: String.raw`P \cdot V = n \cdot R \cdot T`, texto: 'P · V = n · R · T' },
      { tex: String.raw`\rho = \frac{n \cdot M}{V}`, texto: 'ρ = n · M / V' },
      { tex: String.raw`u_{\mathrm{rms}} = \sqrt{\frac{3 \cdot R \cdot T}{M}}`, texto: 'u_rms = √(3 · R · T / M)' },
      { tex: String.raw`E_c = \frac{3}{2} \cdot R \cdot T`, texto: 'E_c = (3/2) · R · T' }
    ],
    supuestos: ['Gas ideal: moléculas puntuales sin atracciones ni repulsiones, con choques elásticos.', 'Estado de equilibrio: la presión y la temperatura son las mismas en todo el recipiente.', 'Para u_rms, la masa molar se pasa a kg/mol.'],
    limites: [
      'Es un gas ideal: a presión alta o cerca de la condensación, un gas real se aparta del resultado (subtema 20); el modelo no lo avisa ni predice la licuación.',
      'No hay mezcla de gases, ni reacción, ni fugas: n es fija.',
      'Calcula estados de equilibrio; no muestra cómo ni cuánto tarda el gas en pasar de un estado a otro.',
      'La masa molar es un parámetro libre: no se elige un gas concreto con datos medidos.'
    ],
    condicionesIniciales: '1 mol de un gas de masa molar 28 g/mol a 300 K en un recipiente de 24,5 L (unos 102 kPa).',
    procedencia: [
      RENG_PROCEDENCIA_R,
      RENG_PROCEDENCIA_NA_KB,
      rengDidactico('Los intervalos de n, T, V y M y los valores iniciales son de elección didáctica, no mediciones.'),
      rengIdealizado('Recipiente rígido con un gas ideal en equilibrio térmico.'),
      rengCalculado('P se calcula con la función del núcleo de la aplicación para el gas ideal; las pruebas la recalculan con N·k_B·T/V en unidades del SI.')
    ]
  },
  casos: [
    { nombre: 'Volumen de 12 L', valores: { V: 12 } },
    { nombre: 'Temperatura de 600 K', valores: { T: 600 } },
    { nombre: 'Cantidad de 2 mol', valores: { n: 2 } }
  ]
}
