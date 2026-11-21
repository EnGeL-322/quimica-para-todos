import { rengCalculado, rengDidactico, rengIdealizado, rengSinVerificar } from '../../aprender/n1/procedencia'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

export const RENG_ANGULO_VSEPR: Readonly<Record<number, number>> = { 1: 180, 2: 180, 3: 120, 4: 109.5, 5: 90, 6: 90 }
export const RENG_HIBRIDACION_VSEPR: Readonly<Record<number, string>> = { 1: 's', 2: 'sp', 3: 'sp²', 4: 'sp³', 5: 'sp³d', 6: 'sp³d²' }
export const RENG_DISPOSICION_VSEPR: Readonly<Record<number, string>> = { 1: 'lineal', 2: 'lineal', 3: 'trigonal plana', 4: 'tetraédrica', 5: 'bipirámide trigonal', 6: 'octaédrica' }
const RENG_FORMAS: Readonly<Record<string, string>> = {
  '2-0': 'lineal', '3-0': 'trigonal plana', '3-1': 'angular', '4-0': 'tetraédrica', '4-1': 'pirámide trigonal', '4-2': 'angular',
  '5-0': 'bipirámide trigonal', '5-1': 'balancín', '5-2': 'forma de T', '5-3': 'lineal', '6-0': 'octaédrica', '6-1': 'pirámide cuadrada', '6-2': 'plano cuadrada', '6-3': 'forma de T'
}
const RENG_SIMETRICAS = new Set(['2-0', '3-0', '4-0', '5-0', '5-3', '6-0', '6-2'])

export const rengDominiosVsepr = (rengV: RengValoresEscenaN1): { x: number; e: number; n: number } => {
  const rengX = Math.min(6, Math.max(1, Math.round(rengV.X!)))
  const rengE = Math.min(Math.max(0, Math.round(rengV.E!)), 6 - rengX, 3)
  return { x: rengX, e: rengE, n: rengX + rengE }
}
export const rengFormaVsepr = (rengV: RengValoresEscenaN1): string => { const { x: rengX, e: rengE, n: rengN } = rengDominiosVsepr(rengV); return rengX === 1 ? 'lineal (molécula diatómica)' : (RENG_FORMAS[`${rengN}-${rengE}`] ?? 'lineal') }

export function rengLecturasVsepr(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const { x: rengX, e: rengE, n: rengN } = rengDominiosVsepr(rengV)
  return { dominios: rengN, libres: rengE, angulo: RENG_ANGULO_VSEPR[rengN]!, hibridos: rengN, simetrica: rengX === 1 || RENG_SIMETRICAS.has(`${rengN}-${rengE}`) ? 1 : 0 }
}

export const RENG_ESCENA_VSEPR: RengModeloEscenaN1 = {
  id: 'geometria-vsepr',
  nombre: 'Geometría molecular (VSEPR)',
  subtemas: ['n1-b4-s12', 'n1-b4-s13', 'n1-b4-s14'],
  pregunta: '¿Qué forma adopta una molécula según los átomos y los pares libres que rodean al átomo central?',
  parametros: [
    { clave: 'X', etiqueta: 'Átomos unidos al átomo central', unidad: 'sin unidad', min: 1, max: 6, paso: 1, inicial: 2 },
    { clave: 'E', etiqueta: 'Pares libres del átomo central', unidad: 'sin unidad', min: 0, max: 3, paso: 1, inicial: 2 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'dominios', etiqueta: 'Dominios electrónicos', unidad: 'sin unidad', cifras: 2 },
    { clave: 'libres', etiqueta: 'Pares libres considerados', unidad: 'sin unidad', cifras: 2 },
    { clave: 'angulo', etiqueta: 'Ángulo ideal entre dominios', unidad: '°', cifras: 4 },
    { clave: 'hibridos', etiqueta: 'Orbitales híbridos del átomo central', unidad: 'sin unidad', cifras: 2 },
    { clave: 'simetrica', etiqueta: 'Forma simétrica (1 sí, 0 no)', unidad: 'sin unidad', cifras: 1 }
  ],
  lecturas: (rengV) => rengLecturasVsepr(rengV),
  enPalabras: (rengV, _rengT, rengL) => {
    const { x: rengX, e: rengE, n: rengN } = rengDominiosVsepr(rengV)
    return `El átomo central tiene ${rengX} ${rengX === 1 ? 'átomo unido' : 'átomos unidos'} y ${rengE} ${rengE === 1 ? 'par libre' : 'pares libres'}: ${rengN} dominios electrónicos, que se disponen en forma ${RENG_DISPOSICION_VSEPR[rengN]} con un ángulo ideal de ${String(rengL.angulo).replace('.', ',')}°. La forma de la molécula es ${rengFormaVsepr(rengV)} y la hibridación asociada es ${RENG_HIBRIDACION_VSEPR[rengN]}. ${rengL.simetrica === 1 ? 'Si todos los átomos unidos son iguales, los dipolos de enlace se anulan.' : 'La forma no es simétrica: si los enlaces son polares, la molécula es polar.'}`
  },
  grafica: {
    tituloX: 'dominios electrónicos',
    tituloY: 'ángulo ideal (°)',
    ejeX: () => [1, 7],
    ejeY: () => [0, 200],
    curvas: () => [{ nombre: 'ángulo ideal', puntos: [2, 3, 4, 5, 6].map((rengN) => [rengN, RENG_ANGULO_VSEPR[rengN]!] as const) }],
    cursor: (_rengV, _rengT, rengL) => [rengL.dominios!, rengL.angulo!]
  },
  ficha: {
    descripcion: 'La teoría VSEPR supone que los dominios electrónicos (enlaces y pares libres) del átomo central se repelen y se sitúan lo más lejos posible entre sí. El número de dominios fija la disposición y el ángulo ideal; la forma de la molécula se nombra mirando solo los átomos. La hibridación usa tantos orbitales híbridos como dominios.',
    ecuaciones: [
      { tex: String.raw`n = X + E`, texto: 'dominios = átomos unidos + pares libres' },
      { tex: String.raw`2 \to 180^\circ,\ 3 \to 120^\circ,\ 4 \to 109{,}5^\circ`, texto: '2 → 180°, 3 → 120°, 4 → 109,5°' }
    ],
    supuestos: ['Un enlace doble o triple cuenta como un solo dominio.', 'Con cinco dominios hay dos ángulos (90° y 120°); la escena muestra el menor.'],
    limites: [
      'Los pares libres repelen más y cierran los ángulos reales (104,5° en el agua y 107° en el amoníaco, frente a 109,5°).',
      'Admite como máximo seis dominios: si la suma supera seis, reduce los pares libres.',
      'No dibuja la molécula ni decide qué átomo es el central.'
    ],
    condicionesIniciales: 'Agua: dos átomos unidos y dos pares libres; cuatro dominios, forma angular.',
    procedencia: [rengSinVerificar('Formas y ángulos ideales de la teoría VSEPR y ángulos del agua y del amoníaco: valores de uso común recordados, no contrastados en esta entrega.'), rengDidactico('Los átomos unidos y los pares libres los eliges tú.'), rengIdealizado('Dominios equivalentes con ángulos ideales.'), rengCalculado('Las pruebas comprueban el recuento de dominios, el ángulo, la hibridación y la simetría en todas las combinaciones.')]
  },
  casos: [
    { nombre: 'Metano: tetraédrica', valores: { X: 4, E: 0 } },
    { nombre: 'Amoníaco: pirámide trigonal', valores: { X: 3, E: 1 } },
    { nombre: 'Dióxido de carbono: lineal', valores: { X: 2, E: 0 } }
  ]
}
