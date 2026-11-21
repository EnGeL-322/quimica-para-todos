import { rengCalculado, rengDeclarada, rengDidactico, rengIdealizado } from '../../aprender/n1/procedencia'
import { rengOcupacion } from '../../../tabla-periodica/data'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

export const RENG_MP_U = 1.007276
export const RENG_MN_U = 1.008665
export const RENG_ME_U = 0.00054858

const rengNum = (rengV: number, rengC = 3): string => String(Number(rengV.toPrecision(rengC))).replace('.', ',')

export function rengValenciaDe(rengElectrones: number): number {
  if (rengElectrones <= 0) return 0
  const rengOcc = rengOcupacion(rengElectrones)
  const rengNmax = Math.max(...[...rengOcc.entries()].filter(([, rengV]) => rengV > 0).map(([rengK]) => Number(rengK[0])))
  let rengS = 0
  for (const [rengK, rengV] of rengOcc) if (Number(rengK[0]) === rengNmax && (rengK[1] === 's' || rengK[1] === 'p')) rengS += rengV
  return rengS
}

export function rengLecturasAtomo(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengZ = Math.round(rengV.Z!)
  const rengN = Math.round(rengV.N!)
  const rengQ = Math.round(rengV.q!)
  const rengE = Math.max(0, rengZ - rengQ)
  return { p: rengZ, e: rengE, n: rengN, A: rengZ + rengN, masa: rengZ * RENG_MP_U + rengN * RENG_MN_U + rengE * RENG_ME_U, valencia: rengValenciaDe(rengE), carga: rengZ - rengE }
}

export const RENG_ESCENA_ATOMO: RengModeloEscenaN1 = {
  id: 'atomo',
  nombre: 'Composición de un átomo',
  subtemas: ['n1-b2-s1', 'n1-b2-s7', 'n1-b2-s8', 'n1-b2-s9', 'n1-b2-s10', 'n1-b2-s11', 'n1-b2-s12', 'n1-b2-s13', 'n1-b2-s14', 'n1-b2-s15', 'n1-b2-s16', 'n1-b2-s25', 'n1-b3-s16', 'n1-b3-s21'],
  pregunta: '¿Cuántos protones, neutrones y electrones tiene un átomo o un ion, y cuánto pesa?',
  parametros: [
    { clave: 'Z', etiqueta: 'Número atómico Z (protones)', unidad: 'sin unidad', min: 1, max: 36, paso: 1, inicial: 6 },
    { clave: 'N', etiqueta: 'Neutrones N', unidad: 'sin unidad', min: 0, max: 50, paso: 1, inicial: 6 },
    { clave: 'q', etiqueta: 'Carga del ion', unidad: 'sin unidad', min: -3, max: 3, paso: 1, inicial: 0 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'p', etiqueta: 'Protones', unidad: 'sin unidad', cifras: 3 },
    { clave: 'e', etiqueta: 'Electrones', unidad: 'sin unidad', cifras: 3 },
    { clave: 'n', etiqueta: 'Neutrones', unidad: 'sin unidad', cifras: 3 },
    { clave: 'A', etiqueta: 'Número másico A', unidad: 'sin unidad', cifras: 3 },
    { clave: 'masa', etiqueta: 'Masa de las partículas', unidad: 'u', cifras: 6 },
    { clave: 'valencia', etiqueta: 'Electrones de la capa más externa (s y p)', unidad: 'sin unidad', cifras: 3 },
    { clave: 'carga', etiqueta: 'Carga neta', unidad: 'sin unidad', cifras: 3 }
  ],
  lecturas: (rengV) => rengLecturasAtomo(rengV),
  enPalabras: (_rengV, _rengT, rengL) =>
    `Hay ${rengNum(rengL.p!)} protones, ${rengNum(rengL.n!)} neutrones y ${rengNum(rengL.e!)} electrones: número másico ${rengNum(rengL.A!)} y carga neta ${rengNum(rengL.carga!)}. La suma de las masas de las partículas es ${rengNum(rengL.masa!, 6)} u, algo mayor que la masa real del átomo porque la escena no descuenta la energía de enlace del núcleo. En la capa más externa hay ${rengNum(rengL.valencia!)} electrones s y p.`,
  grafica: {
    tituloX: 'neutrones N',
    tituloY: 'suma de masas (u)',
    ejeX: () => [0, 50],
    ejeY: (rengV) => [0, Math.max(10, rengLecturasAtomo({ ...rengV, N: 50 }).masa! * 1.05)],
    curvas: (rengV) => [{ nombre: 'masa', puntos: Array.from({ length: 51 }, (_rengX, rengI) => [rengI, rengLecturasAtomo({ ...rengV, N: rengI }).masa!] as const) }],
    cursor: (rengV, _rengT, rengL) => [rengV.N!, rengL.masa!]
  },
  ficha: {
    descripcion: 'Un átomo tiene Z protones y N neutrones en el núcleo, y tantos electrones como protones si es neutro; un ion tiene electrones de más (anión) o de menos (catión). El número másico es A = Z + N. La masa se aproxima sumando las masas de las partículas.',
    ecuaciones: [
      { tex: String.raw`A = Z + N`, texto: 'A = Z + N' },
      { tex: String.raw`e^- = Z - q`, texto: 'electrones = Z − carga' }
    ],
    supuestos: ['Masas del protón, del neutrón y del electrón en u (valores recordados, sin verificar).', 'La suma de masas no descuenta la energía de enlace nuclear (defecto de masa).'],
    limites: [
      'No decide si el núclido existe ni si es estable: algunas combinaciones de Z y N no existen.',
      'La masa calculada supera la real en torno a un 1 % por el defecto de masa.',
      'Los electrones de valencia se cuentan en la capa más externa (s y p); en los metales de transición los d también pueden participar.'
    ],
    condicionesIniciales: 'Carbono-12 neutro: 6 protones, 6 neutrones y 6 electrones.',
    procedencia: [rengDeclarada('Masas del protón (1,007276 u), del neutrón (1,008665 u) y del electrón (0,00054858 u): valores de uso común recordados, no contrastados en esta entrega.'), rengDidactico('Z, N y la carga los eliges tú.'), rengIdealizado('Partículas sin energía de enlace.'), rengCalculado('Las pruebas comprueban A = Z + N, la carga, la masa y los electrones de valencia frente a la configuración electrónica de la tabla.')]
  },
  casos: [
    { nombre: 'Carbono-14 (isótopo)', valores: { Z: 6, N: 8, q: 0 } },
    { nombre: 'Ion cloruro, ³⁵Cl⁻', valores: { Z: 17, N: 18, q: -1 } },
    { nombre: 'Ion hierro(III), ⁵⁶Fe³⁺', valores: { Z: 26, N: 30, q: 3 } }
  ]
}
