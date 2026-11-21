import { rengCalculado, rengDidactico, rengIdealizado, rengSinVerificar } from '../../aprender/n1/procedencia'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const rengNum = (rengV: number): string => `${rengV > 0 ? '+' : rengV < 0 ? '−' : ''}${Math.abs(Math.round(rengV))}`

export function rengLecturasCargaFormal(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengVal = Math.round(rengV.V!)
  const rengLibres = Math.round(rengV.L!)
  const rengEnlaces = Math.round(rengV.B!)
  const rengAlrededor = rengLibres + 2 * rengEnlaces
  return { cf: rengVal - rengLibres - rengEnlaces, alrededor: rengAlrededor, pares: rengLibres / 2, octeto: rengAlrededor === 8 ? 1 : 0, propios: rengLibres + rengEnlaces }
}

export const RENG_ESCENA_CARGA_FORMAL: RengModeloEscenaN1 = {
  id: 'carga-formal',
  nombre: 'Carga formal y octeto de un átomo',
  subtemas: ['n1-b4-s1', 'n1-b4-s2', 'n1-b4-s3', 'n1-b4-s4', 'n1-b4-s8'],
  pregunta: '¿Cuántos electrones rodean a un átomo en una estructura de Lewis y qué carga formal le corresponde?',
  parametros: [
    { clave: 'V', etiqueta: 'Electrones de valencia del átomo libre', unidad: 'sin unidad', min: 1, max: 8, paso: 1, inicial: 6 },
    { clave: 'L', etiqueta: 'Electrones no enlazantes (en pares libres)', unidad: 'sin unidad', min: 0, max: 8, paso: 1, inicial: 4 },
    { clave: 'B', etiqueta: 'Enlaces (pares compartidos)', unidad: 'sin unidad', min: 0, max: 6, paso: 1, inicial: 2 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'cf', etiqueta: 'Carga formal', unidad: 'sin unidad', cifras: 2 },
    { clave: 'alrededor', etiqueta: 'Electrones alrededor del átomo', unidad: 'sin unidad', cifras: 3 },
    { clave: 'pares', etiqueta: 'Pares libres', unidad: 'sin unidad', cifras: 2 },
    { clave: 'octeto', etiqueta: 'Cumple el octeto (1 sí, 0 no)', unidad: 'sin unidad', cifras: 1 },
    { clave: 'propios', etiqueta: 'Electrones asignados al átomo', unidad: 'sin unidad', cifras: 3 }
  ],
  lecturas: (rengV) => rengLecturasCargaFormal(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `Un átomo con ${Math.round(rengV.V!)} electrones de valencia tiene en esta estructura ${Math.round(rengV.L!)} electrones no enlazantes y ${Math.round(rengV.B!)} enlaces. Le rodean ${Math.round(rengL.alrededor!)} electrones, así que ${rengL.octeto === 1 ? 'cumple' : 'no cumple'} el octeto. Se le asignan ${Math.round(rengL.propios!)} electrones (los no enlazantes y la mitad de los compartidos) y su carga formal es ${rengNum(rengL.cf!)}.`,
  grafica: {
    tituloX: 'enlaces',
    tituloY: 'carga formal',
    ejeX: () => [0, 6],
    ejeY: () => [-8, 8],
    curvas: (rengV) => [{ nombre: 'carga formal', puntos: Array.from({ length: 7 }, (_rengX, rengI) => [rengI, rengLecturasCargaFormal({ ...rengV, B: rengI }).cf!] as const) }],
    cursor: (rengV, _rengT, rengL) => [Math.round(rengV.B!), rengL.cf!]
  },
  ficha: {
    descripcion: 'En una estructura de Lewis, cada enlace es un par de electrones compartido. La carga formal reparte esos pares a medias: es el número de electrones de valencia del átomo libre menos los no enlazantes y menos un electrón por cada enlace. Los electrones que rodean al átomo son los no enlazantes más dos por cada enlace; con ocho se cumple el octeto.',
    ecuaciones: [
      { tex: String.raw`CF = V - L - B`, texto: 'carga formal = valencia − no enlazantes − enlaces' },
      { tex: String.raw`N = L + 2B`, texto: 'electrones alrededor = no enlazantes + 2·enlaces' }
    ],
    supuestos: ['Cada enlace es un par compartido a partes iguales (modelo de Lewis).', 'Un enlace doble cuenta como dos enlaces y uno triple, como tres.'],
    limites: [
      'La carga formal es una contabilidad, no la carga real del átomo.',
      'La escena no comprueba que la estructura completa de la molécula sea posible.',
      'El hidrógeno se completa con dos electrones, no con ocho.'
    ],
    condicionesIniciales: 'Oxígeno del agua: 6 electrones de valencia, 4 no enlazantes y 2 enlaces; carga formal 0.',
    procedencia: [rengSinVerificar('Definición de carga formal y regla del octeto: reglas generales de enseñanza, no contrastadas con una edición concreta en esta entrega.'), rengDidactico('Los electrones y los enlaces los eliges tú.'), rengIdealizado('Modelo de Lewis de pares localizados.'), rengCalculado('Las pruebas comprueban la carga formal y el recuento de electrones en todas las combinaciones y que la suma de electrones asignados y carga formal recupera la valencia.')]
  },
  casos: [
    { nombre: 'Nitrógeno del amonio, NH₄⁺', valores: { V: 5, L: 0, B: 4 } },
    { nombre: 'Oxígeno del hidróxido, OH⁻', valores: { V: 6, L: 6, B: 1 } },
    { nombre: 'Carbono del monóxido de carbono', valores: { V: 4, L: 2, B: 3 } }
  ]
}
