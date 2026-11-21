import { RENG_PROCEDENCIA_MASAS, rengCalculado, rengDidactico, rengIdealizado } from '../../aprender/n1/procedencia'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const rengNum = (rengV: number, rengC = 3): string => {
  const rengA = Math.abs(rengV)
  return (rengA !== 0 && (rengA >= 1e5 || rengA < 1e-3) ? rengV.toExponential(rengC - 1).replace('e', '·10^') : String(Number(rengV.toPrecision(rengC)))).replace('.', ',')
}

const rengMcd = (rengA: number, rengB: number): number => (rengB === 0 ? rengA : rengMcd(rengB, rengA % rengB))

export function rengLecturasFormulaIonica(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengZc = Math.round(rengV.zc!)
  const rengZa = Math.round(rengV.za!)
  const rengD = rengMcd(rengZc, rengZa)
  const rengNc = rengZa / rengD
  const rengNa = rengZc / rengD
  const rengMasa = rengNc * rengV.Mc! + rengNa * rengV.Ma!
  return { nc: rengNc, na: rengNa, carga: rengNc * rengZc - rengNa * rengZa, masa: rengMasa, pct: (100 * rengNc * rengV.Mc!) / rengMasa, iones: rengNc + rengNa }
}

export const RENG_ESCENA_FORMULA_IONICA: RengModeloEscenaN1 = {
  id: 'formula-ionica',
  nombre: 'Fórmula de un compuesto iónico',
  subtemas: ['n1-b5-s2', 'n1-b5-s6', 'n1-b5-s13', 'n1-b5-s14', 'n1-b5-s18', 'n1-b5-s19'],
  pregunta: '¿En qué proporción se combinan un catión y un anión para que el compuesto sea neutro, y cuánto pesa su fórmula?',
  parametros: [
    { clave: 'zc', etiqueta: 'Carga del catión', unidad: 'sin unidad', min: 1, max: 4, paso: 1, inicial: 3 },
    { clave: 'za', etiqueta: 'Carga del anión (en valor absoluto)', unidad: 'sin unidad', min: 1, max: 3, paso: 1, inicial: 2 },
    { clave: 'Mc', etiqueta: 'Masa molar del catión', unidad: 'g/mol', min: 1, max: 250, paso: 0.01, inicial: 55.85 },
    { clave: 'Ma', etiqueta: 'Masa molar del anión', unidad: 'g/mol', min: 1, max: 250, paso: 0.01, inicial: 16 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'nc', etiqueta: 'Cationes por fórmula', unidad: 'sin unidad', cifras: 3 },
    { clave: 'na', etiqueta: 'Aniones por fórmula', unidad: 'sin unidad', cifras: 3 },
    { clave: 'carga', etiqueta: 'Carga total de la fórmula', unidad: 'sin unidad', cifras: 3 },
    { clave: 'masa', etiqueta: 'Masa fórmula', unidad: 'g/mol', cifras: 5 },
    { clave: 'pct', etiqueta: 'Porcentaje en masa del catión', unidad: '%', cifras: 4 },
    { clave: 'iones', etiqueta: 'Iones por fórmula', unidad: 'sin unidad', cifras: 3 }
  ],
  lecturas: (rengV) => rengLecturasFormulaIonica(rengV),
  enPalabras: (_rengV, _rengT, rengL) =>
    `Para que la carga total sea ${rengNum(rengL.carga!)}, hacen falta ${rengNum(rengL.nc!)} cationes por cada ${rengNum(rengL.na!)} aniones: los subíndices son las cargas cruzadas y simplificadas. Cada fórmula reúne ${rengNum(rengL.iones!)} iones, pesa ${rengNum(rengL.masa!, 5)} g/mol y el catión aporta el ${rengNum(rengL.pct!, 4)} % de la masa.`,
  grafica: {
    tituloX: 'masa molar del anión (g/mol)',
    tituloY: '% en masa del catión',
    ejeX: () => [1, 250],
    ejeY: () => [0, 100],
    curvas: (rengV) => [{ nombre: '% del catión', puntos: Array.from({ length: 50 }, (_rengX, rengI) => [1 + rengI * 5, rengLecturasFormulaIonica({ ...rengV, Ma: 1 + rengI * 5 }).pct!] as const) }],
    cursor: (rengV, _rengT, rengL) => [rengV.Ma!, rengL.pct!]
  },
  ficha: {
    descripcion: 'Un catión y un anión se combinan en la proporción que hace nula la carga total: los subíndices son las cargas cruzadas y simplificadas por su máximo común divisor. Con las masas molares de los iones se obtiene la masa fórmula y la composición.',
    ecuaciones: [
      { tex: String.raw`n_c \cdot z_c = n_a \cdot z_a`, texto: 'n_c·z_c = n_a·|z_a|' },
      { tex: String.raw`M = n_c M_c + n_a M_a`, texto: 'M = n_c·M_c + n_a·M_a' }
    ],
    supuestos: ['Compuesto iónico neutro con un solo tipo de catión y de anión.', 'La masa de los electrones ganados o perdidos se desprecia.'],
    limites: [
      'No decide si el compuesto existe ni qué carga tiene cada ion: esas cargas las eliges tú.',
      'No sirve para compuestos moleculares (como los óxidos de no metales), cuyas fórmulas no salen de cargas iónicas.',
      'No incluye sales hidratadas ni sales con más de dos tipos de iones.'
    ],
    condicionesIniciales: 'Catión de carga 3+ y masa 55,85 g/mol (como Fe³⁺) con anión de carga 2− y masa 16 g/mol (como O²⁻): da Fe₂O₃.',
    procedencia: [RENG_PROCEDENCIA_MASAS, rengDidactico('Cargas y masas molares de los iones son parámetros que tú eliges.'), rengIdealizado('Compuesto iónico neutro de dos iones.'), rengCalculado('Los subíndices salen de la electroneutralidad; las pruebas comprueban carga total cero, subíndices mínimos y la masa fórmula en cada combinación.')]
  },
  casos: [
    { nombre: 'Sal 1:1 (como NaCl)', valores: { zc: 1, za: 1, Mc: 22.99, Ma: 35.45 } },
    { nombre: 'Catión 2+ y anión 1− (como CaCl₂)', valores: { zc: 2, za: 1, Mc: 40.08, Ma: 35.45 } },
    { nombre: 'Cargas 2 y 2 (se simplifican)', valores: { zc: 2, za: 2 } }
  ]
}
