import { RENG_PROCEDENCIA_MASAS, rengCalculado, rengDidactico, rengIdealizado } from '../../aprender/n1/procedencia'
import { rengPorSimbolo } from '../../../tabla-periodica/data'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const rengNum = (rengV: number, rengC = 3): string => {
  const rengA = Math.abs(rengV)
  return (rengA !== 0 && (rengA >= 1e5 || rengA < 1e-3) ? rengV.toExponential(rengC - 1).replace('e', '·10^') : String(Number(rengV.toPrecision(rengC)))).replace('.', ',')
}

const RENG_AC = (): number => rengPorSimbolo.get('C')!.masa
const RENG_AH = (): number => rengPorSimbolo.get('H')!.masa
const RENG_AO = (): number => rengPorSimbolo.get('O')!.masa

export function rengCoeficientesCombustion(rengX: number, rengY: number, rengZ: number): { a: number; b: number; c: number; d: number } {
  for (const rengK of [1, 2, 4]) {
    const rengB = rengK * (rengX + rengY / 4 - rengZ / 2)
    const rengD = (rengK * rengY) / 2
    if (Number.isInteger(rengB) && Number.isInteger(rengD)) return { a: rengK, b: rengB, c: rengK * rengX, d: rengD }
  }
  throw new Error('Combustión sin coeficientes enteros')
}

export function rengLecturasCombustion(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengX = Math.round(rengV.x!)
  const rengY = Math.round(rengV.y!)
  const rengZ = Math.round(rengV.z!)
  const { a, b, c, d } = rengCoeficientesCombustion(rengX, rengY, rengZ)
  const rengMf = rengX * RENG_AC() + rengY * RENG_AH() + rengZ * RENG_AO()
  const rengN = rengV.n!
  const rengMfuel = rengN * rengMf
  const rengMo2 = ((rengN * b) / a) * 2 * RENG_AO()
  const rengMco2 = ((rengN * c) / a) * (RENG_AC() + 2 * RENG_AO())
  const rengMh2o = ((rengN * d) / a) * (2 * RENG_AH() + RENG_AO())
  return { a, b, c, d, mf: rengMfuel, mo2: rengMo2, mco2: rengMco2, mh2o: rengMh2o, balance: rengMfuel + rengMo2 - rengMco2 - rengMh2o, oIzq: a * rengZ + 2 * b, oDer: 2 * c + d }
}

const rengFormulaTexto = (rengV: RengValoresEscenaN1): string => {
  const rengSub = (rengN: number): string => (rengN === 1 ? '' : String(rengN).split('').map((rengC) => '₀₁₂₃₄₅₆₇₈₉'[Number(rengC)]).join(''))
  const rengZ = Math.round(rengV.z!)
  return `C${rengSub(Math.round(rengV.x!))}H${rengSub(Math.round(rengV.y!))}${rengZ === 0 ? '' : `O${rengSub(rengZ)}`}`
}

export const RENG_ESCENA_COMBUSTION: RengModeloEscenaN1 = {
  id: 'combustion',
  nombre: 'Ajuste de una combustión',
  subtemas: ['n1-b1-s2', 'n1-b1-s15', 'n1-b6-s3', 'n1-b6-s4', 'n1-b6-s5', 'n1-b6-s6', 'n1-b6-s14'],
  pregunta: '¿Qué coeficientes ajustan la combustión completa de un compuesto de C, H y O, y se conserva la masa?',
  parametros: [
    { clave: 'x', etiqueta: 'Átomos de carbono del combustible', unidad: 'sin unidad', min: 1, max: 10, paso: 1, inicial: 3 },
    { clave: 'y', etiqueta: 'Átomos de hidrógeno del combustible', unidad: 'sin unidad', min: 2, max: 22, paso: 2, inicial: 8 },
    { clave: 'z', etiqueta: 'Átomos de oxígeno del combustible', unidad: 'sin unidad', min: 0, max: 2, paso: 1, inicial: 0 },
    { clave: 'n', etiqueta: 'Combustible que se quema', unidad: 'mol', min: 0.1, max: 10, paso: 0.1, inicial: 1 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'a', etiqueta: 'Coeficiente del combustible', unidad: 'sin unidad', cifras: 3 },
    { clave: 'b', etiqueta: 'Coeficiente del O₂', unidad: 'sin unidad', cifras: 3 },
    { clave: 'c', etiqueta: 'Coeficiente del CO₂', unidad: 'sin unidad', cifras: 3 },
    { clave: 'd', etiqueta: 'Coeficiente del H₂O', unidad: 'sin unidad', cifras: 3 },
    { clave: 'oIzq', etiqueta: 'Átomos de O a la izquierda', unidad: 'sin unidad', cifras: 3 },
    { clave: 'oDer', etiqueta: 'Átomos de O a la derecha', unidad: 'sin unidad', cifras: 3 },
    { clave: 'mf', etiqueta: 'Masa de combustible', unidad: 'g', cifras: 4 },
    { clave: 'mo2', etiqueta: 'Masa de O₂ consumida', unidad: 'g', cifras: 4 },
    { clave: 'mco2', etiqueta: 'Masa de CO₂ formada', unidad: 'g', cifras: 4 },
    { clave: 'mh2o', etiqueta: 'Masa de H₂O formada', unidad: 'g', cifras: 4 },
    { clave: 'balance', etiqueta: 'Reactivos − productos (masa)', unidad: 'g', cifras: 3 }
  ],
  lecturas: (rengV) => rengLecturasCombustion(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `La ecuación ajustada es ${rengNum(rengL.a!) === '1' ? '' : rengNum(rengL.a!) + ' '}${rengFormulaTexto(rengV)} + ${rengNum(rengL.b!)} O₂ → ${rengNum(rengL.c!)} CO₂ + ${rengNum(rengL.d!)} H₂O: hay ${rengNum(rengL.oIzq!)} átomos de oxígeno a cada lado. Al quemar ${rengNum(rengV.n!)} mol se consumen ${rengNum(rengL.mo2!, 4)} g de O₂ y la masa de los reactivos (${rengNum(rengL.mf! + rengL.mo2!, 4)} g) es igual a la de los productos.`,
  grafica: {
    tituloX: 'combustible quemado (mol)',
    tituloY: 'masa (g)',
    ejeX: () => [0, 10],
    ejeY: (rengV) => [0, rengLecturasCombustion({ ...rengV, n: 10 }).mco2! * 1.1 + 1],
    curvas: (rengV) => [
      { nombre: 'O₂ consumido', puntos: Array.from({ length: 21 }, (_rengX, rengI) => [rengI * 0.5, rengLecturasCombustion({ ...rengV, n: rengI * 0.5 }).mo2!] as const) },
      { nombre: 'CO₂ formado', puntos: Array.from({ length: 21 }, (_rengX, rengI) => [rengI * 0.5, rengLecturasCombustion({ ...rengV, n: rengI * 0.5 }).mco2!] as const) }
    ],
    cursor: (rengV, _rengT, rengL) => [rengV.n!, rengL.mco2!]
  },
  ficha: {
    descripcion: 'Combustión completa de un compuesto CₓHᵧO_z: todo el carbono pasa a CO₂ y todo el hidrógeno a H₂O. Los coeficientes son los enteros mínimos que igualan C, H y O; con ellos se calculan las masas, que cumplen la conservación de la masa.',
    ecuaciones: [
      { tex: String.raw`\ce{C_xH_yO_z + (x + \tfrac{y}{4} - \tfrac{z}{2}) O2 -> x CO2 + \tfrac{y}{2} H2O}`, texto: 'CₓHᵧO_z + (x + y/4 − z/2) O₂ → x CO₂ + y/2 H₂O' },
      { tex: String.raw`m_{reactivos} = m_{productos}`, texto: 'm(reactivos) = m(productos)' }
    ],
    supuestos: ['Combustión completa con oxígeno suficiente.', 'Las masas molares salen de las masas atómicas de la app.'],
    limites: [
      'No decide si el compuesto existe: con algunos valores de x, y y z la fórmula no corresponde a ninguna sustancia estable.',
      'No modela la combustión incompleta (CO u hollín) ni la energía liberada.',
      'No contiene combustibles con otros elementos (N, S…).'
    ],
    condicionesIniciales: 'Propano, C₃H₈, 1 mol: C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O.',
    procedencia: [RENG_PROCEDENCIA_MASAS, rengDidactico('Los átomos del combustible y los moles quemados son parámetros que tú eliges.'), rengIdealizado('Combustión completa.'), rengCalculado('Los coeficientes salen de igualar C, H y O; las pruebas comprueban la igualdad de átomos, los enteros mínimos y la conservación de la masa en cada combinación.')]
  },
  casos: [
    { nombre: 'Metano, CH₄', valores: { x: 1, y: 4, z: 0, n: 1 } },
    { nombre: 'Etanol, C₂H₆O', valores: { x: 2, y: 6, z: 1, n: 1 } },
    { nombre: 'Octano, C₈H₁₈ (coeficientes pares)', valores: { x: 8, y: 18, z: 0, n: 1 } }
  ]
}
