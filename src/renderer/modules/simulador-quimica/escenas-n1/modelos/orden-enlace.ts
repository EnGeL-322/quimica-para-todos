import { rengCalculado, rengDidactico, rengIdealizado, rengSinVerificar } from '../../aprender/n1/procedencia'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const rengNum = (rengV: number): string => String(Number(rengV.toPrecision(3))).replace('.', ',').replace('-', '−')

export function rengLecturasOrden(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengB = Math.round(rengV.nb!)
  const rengA = Math.round(rengV.na!)
  const rengOrden = (rengB - rengA) / 2
  const rengEntero = Number.isInteger(rengOrden) && rengOrden >= 1
  return { orden: rengOrden, estable: rengOrden > 0 ? 1 : 0, sigma: rengEntero ? 1 : 0, pi: rengEntero ? rengOrden - 1 : 0, total: rengB + rengA }
}

export const RENG_ESCENA_ORDEN: RengModeloEscenaN1 = {
  id: 'orden-enlace',
  nombre: 'Orden de enlace',
  subtemas: ['n1-b4-s15', 'n1-b4-s16', 'n1-b4-s22'],
  pregunta: '¿Cuántos enlaces unen dos átomos según los electrones enlazantes y antienlazantes?',
  parametros: [
    { clave: 'nb', etiqueta: 'Electrones en orbitales enlazantes', unidad: 'sin unidad', min: 0, max: 10, paso: 1, inicial: 8 },
    { clave: 'na', etiqueta: 'Electrones en orbitales antienlazantes', unidad: 'sin unidad', min: 0, max: 10, paso: 1, inicial: 2 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'orden', etiqueta: 'Orden de enlace', unidad: 'sin unidad', cifras: 2 },
    { clave: 'estable', etiqueta: 'Molécula estable (1 sí, 0 no)', unidad: 'sin unidad', cifras: 1 },
    { clave: 'sigma', etiqueta: 'Enlaces σ', unidad: 'sin unidad', cifras: 1 },
    { clave: 'pi', etiqueta: 'Enlaces π', unidad: 'sin unidad', cifras: 1 },
    { clave: 'total', etiqueta: 'Electrones considerados', unidad: 'sin unidad', cifras: 2 }
  ],
  lecturas: (rengV) => rengLecturasOrden(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `Con ${Math.round(rengV.nb!)} electrones enlazantes y ${Math.round(rengV.na!)} antienlazantes, el orden de enlace es ${rengNum(rengL.orden!)}. ${rengL.estable === 1 ? 'El orden es positivo: la molécula es estable.' : 'El orden no es positivo: la molécula no se forma.'}${rengL.sigma === 1 ? ` Un enlace de orden ${rengNum(rengL.orden!)} equivale a un enlace σ y ${rengNum(rengL.pi!)} enlace(s) π.` : ''} A mayor orden, el enlace es más corto y más fuerte.`,
  grafica: {
    tituloX: 'electrones antienlazantes',
    tituloY: 'orden de enlace',
    ejeX: () => [0, 10],
    ejeY: () => [-5, 5],
    curvas: (rengV) => [{ nombre: 'orden', puntos: Array.from({ length: 11 }, (_rengX, rengI) => [rengI, rengLecturasOrden({ ...rengV, na: rengI }).orden!] as const) }],
    cursor: (rengV, _rengT, rengL) => [Math.round(rengV.na!), rengL.orden!]
  },
  ficha: {
    descripcion: 'En la teoría de orbitales moleculares, los orbitales atómicos se combinan en orbitales enlazantes (que estabilizan la molécula) y antienlazantes (que la desestabilizan). El orden de enlace es la mitad de la diferencia entre los electrones de unos y otros. Un orden 1 es un enlace sencillo (σ); 2, un enlace doble (σ + π); 3, uno triple (σ + 2 π).',
    ecuaciones: [
      { tex: String.raw`OE = \frac{n_b - n_a}{2}`, texto: 'orden de enlace = (enlazantes − antienlazantes)/2' },
      { tex: String.raw`\pi = OE - 1`, texto: 'enlaces π = orden − 1 (orden entero)' }
    ],
    supuestos: ['Molécula diatómica.', 'Se cuentan los electrones de valencia; los internos se cancelan entre sí.'],
    limites: [
      'No calcula el diagrama de orbitales: los electrones enlazantes y antienlazantes los eliges tú.',
      'El reparto en σ y π solo se muestra para órdenes enteros.',
      'No predice la energía ni la longitud del enlace, solo su orden.'
    ],
    condicionesIniciales: 'Nitrógeno, N₂: 8 electrones de valencia enlazantes y 2 antienlazantes; orden 3.',
    procedencia: [rengSinVerificar('Ocupaciones de los orbitales moleculares de H₂, He₂, N₂ y O₂ usadas en los casos: valores de uso común recordados, no contrastados en esta entrega.'), rengDidactico('Los electrones de cada tipo los eliges tú.'), rengIdealizado('Teoría de orbitales moleculares elemental.'), rengCalculado('Las pruebas comprueban el orden, la estabilidad y el reparto en enlaces σ y π en todas las combinaciones.')]
  },
  casos: [
    { nombre: 'Hidrógeno, H₂: orden 1', valores: { nb: 2, na: 0 } },
    { nombre: 'Helio, He₂: no se forma', valores: { nb: 2, na: 2 } },
    { nombre: 'Oxígeno, O₂: orden 2', valores: { nb: 8, na: 4 } }
  ]
}
