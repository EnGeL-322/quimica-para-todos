import { rengCalculado, rengDidactico, rengIdealizado, RENG_PROCEDENCIA_MASAS } from '../../aprender/n1/procedencia'
import { rengPorSimbolo } from '../../../tabla-periodica/data'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

export const RENG_M_AGUA_POLIMERO = 2 * rengPorSimbolo.get('H')!.masa + rengPorSimbolo.get('O')!.masa
const rengNum = (rengV: number, rengCifras = 4): string => String(Number(rengV.toPrecision(rengCifras))).replace('.', ',')

export function rengLecturasPolimero(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengN = Math.max(1, Math.round(rengV.n!))
  const rengAgua = Math.round(rengV.agua!) >= 1 ? 1 : 0
  const rengPerdida = rengAgua * (rengN - 1) * RENG_M_AGUA_POLIMERO
  const rengMasa = rengN * rengV.m0! - rengPerdida
  return { masa: rengMasa, enlaces: rengN - 1, perdida: rengPerdida, conservada: (100 * rengMasa) / (rengN * rengV.m0!), unidad: rengMasa / rengN }
}

export const RENG_ESCENA_POLIMERO: RengModeloEscenaN1 = {
  id: 'polimero',
  nombre: 'Masa molar de un polímero',
  subtemas: ['n1-b12-s22'],
  pregunta: '¿Cuánto pesa una cadena formada por muchas unidades iguales?',
  parametros: [
    { clave: 'm0', etiqueta: 'Masa molar del monómero', unidad: 'g/mol', min: 20, max: 300, paso: 0.01, inicial: 28.05 },
    { clave: 'n', etiqueta: 'Unidades en la cadena', unidad: 'sin unidad', min: 1, max: 5000, paso: 1, inicial: 1000 },
    { clave: 'agua', etiqueta: 'Agua perdida por unión (0 adición, 1 condensación)', unidad: 'sin unidad', min: 0, max: 1, paso: 1, inicial: 0 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'masa', etiqueta: 'Masa molar de la cadena', unidad: 'g/mol', cifras: 5 },
    { clave: 'enlaces', etiqueta: 'Uniones entre unidades', unidad: 'sin unidad', cifras: 4 },
    { clave: 'perdida', etiqueta: 'Agua liberada', unidad: 'g/mol', cifras: 5 },
    { clave: 'conservada', etiqueta: 'Masa de los monómeros que queda en la cadena', unidad: '%', cifras: 4 },
    { clave: 'unidad', etiqueta: 'Masa media por unidad', unidad: 'g/mol', cifras: 5 }
  ],
  lecturas: (rengV) => rengLecturasPolimero(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `Una cadena de ${Math.max(1, Math.round(rengV.n!))} unidades de ${rengNum(rengV.m0!, 5)} g/mol tiene ${rengL.enlaces} uniones y una masa molar de ${rengNum(rengL.masa!, 5)} g/mol. ${Math.round(rengV.agua!) >= 1 ? `Es una condensación: cada unión libera una molécula de agua, ${rengNum(rengL.perdida!, 5)} g/mol en total, y en la cadena queda el ${rengNum(rengL.conservada!)} % de la masa de los monómeros. Así se forman las proteínas, el almidón y el nailon.` : 'Es una adición: los monómeros se unen sin perder átomos, como en el polietileno, y la masa de la cadena es la suma de las de sus unidades.'}`,
  grafica: {
    tituloX: 'unidades en la cadena',
    tituloY: 'masa molar (g/mol)',
    ejeX: () => [0, 5000],
    ejeY: (rengV) => [0, 5000 * rengV.m0!],
    curvas: (rengV) => [{ nombre: 'cadena', puntos: Array.from({ length: 26 }, (_rengX, rengI) => [Math.max(1, rengI * 200), rengLecturasPolimero({ ...rengV, n: Math.max(1, rengI * 200) }).masa!] as const) }],
    cursor: (rengV, _rengT, rengL) => [Math.max(1, Math.round(rengV.n!)), rengL.masa!]
  },
  ficha: {
    descripcion: 'Un polímero es una molécula muy grande formada por la unión de muchas unidades pequeñas, los monómeros. En la polimerización por adición los monómeros se suman sin perder átomos. En la polimerización por condensación cada unión libera una molécula pequeña, casi siempre agua: así se forman las proteínas a partir de aminoácidos y los polisacáridos a partir de azúcares.',
    ecuaciones: [
      { tex: String.raw`M = n\,M_0`, texto: 'adición: M = n·M₀' },
      { tex: String.raw`M = n\,M_0 - (n - 1)\,M_{H_2O}`, texto: 'condensación: M = n·M₀ − (n − 1)·18,015' }
    ],
    supuestos: ['Todas las unidades son iguales.', 'Cadena lineal: n unidades forman n − 1 uniones.'],
    limites: [
      'Un polímero real es una mezcla de cadenas de distinta longitud; aquí todas tienen el mismo número de unidades.',
      'En la adición se ignoran los grupos de los extremos de la cadena.',
      'No describe polímeros de dos monómeros distintos ni cadenas ramificadas o entrecruzadas.'
    ],
    condicionesIniciales: 'Mil unidades de eteno (28,05 g/mol) unidas por adición: polietileno de unos 28 000 g/mol.',
    procedencia: [RENG_PROCEDENCIA_MASAS, rengDidactico('La masa del monómero y el número de unidades los eliges tú.'), rengIdealizado('Cadenas lineales, todas de la misma longitud.'), rengCalculado('Las pruebas comprueban la conservación de la masa en todo el dominio.')]
  },
  casos: [
    { nombre: 'Polietileno: 1000 unidades de eteno', valores: { m0: 28.05, n: 1000, agua: 0 } },
    { nombre: 'Almidón: 500 unidades de glucosa', valores: { m0: 180.16, n: 500, agua: 1 } },
    { nombre: 'Dipéptido: dos unidades de glicina', valores: { m0: 75.07, n: 2, agua: 1 } }
  ]
}
