import { rengCalculado, rengDeclarada, rengDidactico, rengIdealizado } from '../../aprender/n1/procedencia'
import { rengConfiguracion, rengOcupacion } from '../../../tabla-periodica/data'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const RENG_LETRAS = 'spdf'
const rengCapacidad = (rengSub: string): number => 2 * (2 * RENG_LETRAS.indexOf(rengSub[1]!) + 1)
const rengNum = (rengV: number): string => String(Math.round(rengV))

export function rengLecturasConfig(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengZ = Math.round(rengV.Z!)
  const rengOcc = [...rengOcupacion(rengZ).entries()].filter(([, rengK]) => rengK > 0)
  const rengDe = (rengLetra: string): number => rengOcc.filter(([rengS]) => rengS[1] === rengLetra).reduce((rengA, [, rengK]) => rengA + rengK, 0)
  const rengCapa = Math.max(...rengOcc.map(([rengS]) => Number(rengS[0])))
  return {
    s: rengDe('s'),
    p: rengDe('p'),
    d: rengDe('d'),
    capa: rengCapa,
    subniveles: rengOcc.length,
    orbitales: rengOcc.reduce((rengA, [rengS, rengK]) => rengA + Math.min(rengK, rengCapacidad(rengS) / 2), 0),
    desapareados: rengOcc.reduce((rengA, [rengS, rengK]) => rengA + Math.min(rengK, rengCapacidad(rengS) - rengK), 0),
    externa: rengOcc.filter(([rengS]) => Number(rengS[0]) === rengCapa).reduce((rengA, [, rengK]) => rengA + rengK, 0)
  }
}

export const RENG_ESCENA_CONFIG: RengModeloEscenaN1 = {
  id: 'config-electronica',
  nombre: 'Configuración electrónica',
  subtemas: ['n1-b2-s19', 'n1-b2-s20', 'n1-b2-s21', 'n1-b2-s22', 'n1-b2-s23', 'n1-b2-s24', 'n1-b3-s4', 'n1-b3-s12'],
  pregunta: '¿Cómo se reparten los electrones de un átomo en subniveles y orbitales?',
  parametros: [{ clave: 'Z', etiqueta: 'Número atómico Z', unidad: 'sin unidad', min: 1, max: 36, paso: 1, inicial: 8 }],
  tiempo: null,
  magnitudes: [
    { clave: 's', etiqueta: 'Electrones en subniveles s', unidad: 'sin unidad', cifras: 3 },
    { clave: 'p', etiqueta: 'Electrones en subniveles p', unidad: 'sin unidad', cifras: 3 },
    { clave: 'd', etiqueta: 'Electrones en subniveles d', unidad: 'sin unidad', cifras: 3 },
    { clave: 'capa', etiqueta: 'Capa más externa (n)', unidad: 'sin unidad', cifras: 3 },
    { clave: 'subniveles', etiqueta: 'Subniveles ocupados', unidad: 'sin unidad', cifras: 3 },
    { clave: 'orbitales', etiqueta: 'Orbitales ocupados', unidad: 'sin unidad', cifras: 3 },
    { clave: 'desapareados', etiqueta: 'Electrones desapareados', unidad: 'sin unidad', cifras: 3 },
    { clave: 'externa', etiqueta: 'Electrones en la capa más externa', unidad: 'sin unidad', cifras: 3 }
  ],
  lecturas: (rengV) => rengLecturasConfig(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `El átomo de Z = ${rengNum(rengV.Z!)} tiene la configuración ${rengConfiguracion(Math.round(rengV.Z!), false)}. Reparte ${rengNum(rengL.s!)} electrones en subniveles s, ${rengNum(rengL.p!)} en p y ${rengNum(rengL.d!)} en d, en ${rengNum(rengL.subniveles!)} subniveles y ${rengNum(rengL.orbitales!)} orbitales. Según la regla de Hund quedan ${rengNum(rengL.desapareados!)} electrones desapareados. Su capa más externa es n = ${rengNum(rengL.capa!)}, con ${rengNum(rengL.externa!)} electrones.`,
  grafica: {
    tituloX: 'número atómico Z',
    tituloY: 'electrones desapareados',
    ejeX: () => [1, 36],
    ejeY: () => [0, 7],
    curvas: () => [{ nombre: 'desapareados', puntos: Array.from({ length: 36 }, (_rengX, rengI) => [rengI + 1, rengLecturasConfig({ Z: rengI + 1 }).desapareados!] as const) }],
    cursor: (rengV, _rengT, rengL) => [rengV.Z!, rengL.desapareados!]
  },
  ficha: {
    descripcion: 'Los electrones ocupan los subniveles por orden de energía (regla de n + l), con dos electrones como máximo por orbital (Pauli) y repartidos de uno en uno antes de aparearse (Hund). La escena usa las configuraciones de la tabla periódica de la app, que incluyen las excepciones del cromo y el cobre.',
    ecuaciones: [
      { tex: String.raw`1s\,2s\,2p\,3s\,3p\,4s\,3d\,4p`, texto: 'orden: 1s 2s 2p 3s 3p 4s 3d 4p' },
      { tex: String.raw`\text{capacidad} = 2(2l+1)`, texto: 'capacidad de un subnivel = 2(2l + 1)' }
    ],
    supuestos: ['Átomo neutro aislado en su estado fundamental.', 'Dentro de cada subnivel, los electrones se reparten según la regla de Hund.'],
    limites: [
      'Solo llega hasta Z = 36 (kriptón).',
      'No muestra iones ni estados excitados.',
      'El recuento de desapareados supone el átomo aislado; en un compuesto puede cambiar.'
    ],
    condicionesIniciales: 'Oxígeno (Z = 8): 1s² 2s² 2p⁴, con dos electrones desapareados.',
    procedencia: [rengDeclarada('Configuraciones electrónicas del estado fundamental (con las excepciones de Cr y Cu): datos de la tabla periódica de la app, no contrastados de nuevo en esta entrega.'), rengDidactico('El número atómico lo eliges tú.'), rengIdealizado('Átomo aislado en el estado fundamental.'), rengCalculado('Las pruebas comprueban que los electrones suman Z, que ningún subnivel supera su capacidad y el recuento de orbitales y desapareados con un reparto explícito.')]
  },
  casos: [
    { nombre: 'Nitrógeno: tres desapareados', valores: { Z: 7 } },
    { nombre: 'Cromo: excepción 3d⁵ 4s¹', valores: { Z: 24 } },
    { nombre: 'Hierro: [Ar] 4s² 3d⁶', valores: { Z: 26 } }
  ]
}
