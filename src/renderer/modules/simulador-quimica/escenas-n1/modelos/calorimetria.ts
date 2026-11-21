import { RENG_PROCEDENCIA_KELVIN, rengCalculado, rengDidactico, rengIdealizado, rengSinVerificar } from '../../aprender/n1/procedencia'
import { RENG_C_AGUA } from '../../nucleo/termoquimica'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const rengNum = (rengV: number, rengC = 3): string => {
  const rengA = Math.abs(rengV)
  return (rengA !== 0 && (rengA >= 1e5 || rengA < 1e-3) ? rengV.toExponential(rengC - 1).replace('e', '·10^') : String(Number(rengV.toPrecision(rengC)))).replace('.', ',')
}

export function rengLecturasCalorimetria(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengC1 = rengV.m1! * rengV.c1!
  const rengC2 = rengV.m2! * RENG_C_AGUA + rengV.Ccal!
  const rengTf = (rengC1 * rengV.T1! + rengC2 * rengV.T2!) / (rengC1 + rengC2)
  const rengQ1 = rengC1 * (rengTf - rengV.T1!)
  const rengQ2 = rengV.m2! * RENG_C_AGUA * (rengTf - rengV.T2!)
  const rengQcal = rengV.Ccal! * (rengTf - rengV.T2!)
  return { Tf: rengTf, C1: rengC1, C2: rengC2, q1: rengQ1, q2: rengQ2, qcal: rengQcal, balance: rengQ1 + rengQ2 + rengQcal, dT1: rengTf - rengV.T1!, dT2: rengTf - rengV.T2! }
}

export const RENG_ESCENA_CALORIMETRIA: RengModeloEscenaN1 = {
  id: 'calorimetria',
  nombre: 'Calorímetro de mezclas',
  subtemas: ['n1-b1-s4', 'n1-b1-s9', 'n1-b11-s1', 'n1-b11-s2', 'n1-b11-s3', 'n1-b11-s4'],
  pregunta: '¿A qué temperatura llegan un cuerpo caliente y el agua de un calorímetro, y cuánto calor pasa de uno a otro?',
  parametros: [
    { clave: 'm1', etiqueta: 'Masa del cuerpo', unidad: 'g', min: 1, max: 500, paso: 1, inicial: 100 },
    { clave: 'c1', etiqueta: 'Calor específico del cuerpo', unidad: 'J/(g·K)', min: 0.1, max: 4.2, paso: 0.01, inicial: 0.45 },
    { clave: 'T1', etiqueta: 'Temperatura inicial del cuerpo', unidad: '°C', min: 0, max: 100, paso: 0.5, inicial: 95 },
    { clave: 'm2', etiqueta: 'Masa de agua', unidad: 'g', min: 10, max: 1000, paso: 5, inicial: 200 },
    { clave: 'T2', etiqueta: 'Temperatura inicial del agua', unidad: '°C', min: 0, max: 100, paso: 0.5, inicial: 20 },
    { clave: 'Ccal', etiqueta: 'Capacidad calorífica del calorímetro', unidad: 'J/K', min: 0, max: 300, paso: 1, inicial: 0 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'Tf', etiqueta: 'Temperatura final de equilibrio', unidad: '°C', cifras: 4 },
    { clave: 'q1', etiqueta: 'Calor que recibe el cuerpo (negativo si cede)', unidad: 'J', cifras: 4 },
    { clave: 'q2', etiqueta: 'Calor que recibe el agua', unidad: 'J', cifras: 4 },
    { clave: 'qcal', etiqueta: 'Calor que recibe el calorímetro', unidad: 'J', cifras: 4 },
    { clave: 'balance', etiqueta: 'Suma de calores (debe ser 0)', unidad: 'J', cifras: 3 },
    { clave: 'C1', etiqueta: 'Capacidad calorífica del cuerpo', unidad: 'J/K', cifras: 4 },
    { clave: 'C2', etiqueta: 'Capacidad calorífica del agua y el calorímetro', unidad: 'J/K', cifras: 4 },
    { clave: 'dT1', etiqueta: 'Cambio de temperatura del cuerpo', unidad: 'K', cifras: 4 },
    { clave: 'dT2', etiqueta: 'Cambio de temperatura del agua', unidad: 'K', cifras: 4 }
  ],
  lecturas: (rengV) => rengLecturasCalorimetria(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `Un cuerpo de ${rengNum(rengV.m1!)} g (c = ${rengNum(rengV.c1!)} J/(g·K)) a ${rengNum(rengV.T1!)} °C se mete en ${rengNum(rengV.m2!)} g de agua a ${rengNum(rengV.T2!)} °C. Todo acaba a ${rengNum(rengL.Tf!, 4)} °C: el cuerpo cede ${rengNum(-rengL.q1!, 4)} J y el agua y el calorímetro los reciben. La temperatura del cuerpo cambia ${rengNum(rengL.dT1!)} K y la del agua ${rengNum(rengL.dT2!)} K, porque sus capacidades caloríficas son ${rengNum(rengL.C1!)} y ${rengNum(rengL.C2!)} J/K.`,
  grafica: {
    tituloX: 'masa de agua (g)',
    tituloY: 'temperatura final (°C)',
    ejeX: () => [10, 1000],
    ejeY: () => [0, 100],
    curvas: (rengV) => [{ nombre: 'T final según el agua', puntos: Array.from({ length: 100 }, (_rengX, rengI) => [10 * (rengI + 1), rengLecturasCalorimetria({ ...rengV, m2: 10 * (rengI + 1) }).Tf!] as const) }],
    cursor: (rengV, _rengT, rengL) => [rengV.m2!, rengL.Tf!]
  },
  ficha: {
    descripcion: 'Calorímetro aislado con agua y un cuerpo que se introduce a otra temperatura. El calor que cede el cuerpo lo reciben el agua y el propio calorímetro hasta igualar temperaturas: la suma de calores es cero.',
    ecuaciones: [
      { tex: String.raw`q = m\,c\,\Delta T, \quad C = m\,c`, texto: 'q = m·c·ΔT;  C = m·c' },
      { tex: String.raw`q_1 + q_{\mathrm{agua}} + q_{\mathrm{cal}} = 0`, texto: 'q₁ + q_agua + q_cal = 0' },
      { tex: String.raw`T_f = \frac{C_1 T_1 + C_2 T_2}{C_1 + C_2}`, texto: 'T_f = (C₁·T₁ + C₂·T₂) / (C₁ + C₂)' }
    ],
    supuestos: ['Calorímetro perfectamente aislado: no se pierde calor al exterior.', 'Calores específicos constantes en el intervalo de temperaturas.', 'No hay cambios de estado ni reacciones.', 'c(agua) = 4,184 J/(g·K), valor del núcleo de la app.'],
    limites: [
      'Un calorímetro real pierde calor: la temperatura final medida suele quedar algo por debajo de la calculada.',
      'Si la temperatura final pasara de 100 °C o bajara de 0 °C habría cambios de estado, que la escena no modela.',
      'El calor específico del cuerpo es un dato que eliges; el de un material concreto hay que buscarlo en una tabla.'
    ],
    condicionesIniciales: 'Un cuerpo de 100 g con c = 0,45 J/(g·K) (del orden del hierro) a 95 °C en 200 g de agua a 20 °C, sin capacidad propia del calorímetro.',
    procedencia: [rengSinVerificar('c(agua) = 4,184 J/(g·K) es el valor del núcleo de la app; no se contrastó con una fuente en esta entrega.'), RENG_PROCEDENCIA_KELVIN, rengDidactico('Masas, temperaturas, calor específico del cuerpo y capacidad del calorímetro son parámetros que tú eliges.'), rengIdealizado('Calorímetro aislado sin pérdidas ni cambios de estado.'), rengCalculado('La temperatura final sale del balance de calor; las pruebas comprueban que la suma de calores es cero y que T_f queda entre las temperaturas iniciales.')]
  },
  casos: [
    { nombre: 'Cuerpo de calor específico alto', valores: { c1: 2.4 } },
    { nombre: 'Mucha más agua', valores: { m2: 800 } },
    { nombre: 'Calorímetro con capacidad propia', valores: { Ccal: 150 } }
  ]
}
