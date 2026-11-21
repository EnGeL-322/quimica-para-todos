import { rengCalculado, rengDeclarada, rengDidactico, rengIdealizado, rengSinVerificar } from '../../aprender/n1/procedencia'
import { RENG_FUENTE_EN, rengCaracterIonico, rengTipoPorDiferencia } from '../../nucleo/electronegatividad'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

export const RENG_DEBYE_POR_E_PM = 1.602176634e-19 * 1e-12 / 3.33564e-30
const RENG_TIPO: Readonly<Record<string, number>> = { apolar: 0, polar: 1, ionico: 2 }
const RENG_NOMBRE_TIPO = ['covalente apolar', 'covalente polar', 'predominantemente iónico']
const rengNum = (rengV: number, rengC = 3): string => String(Number(rengV.toPrecision(rengC))).replace('.', ',')

export function rengLecturasPolaridad(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengDelta = Math.abs(rengV.chiA! - rengV.chiB!)
  const rengIonico = rengCaracterIonico(rengDelta)
  return { dchi: rengDelta, ionico: rengIonico, tipo: RENG_TIPO[rengTipoPorDiferencia(rengDelta)]!, mu: (rengIonico / 100) * rengV.d! * RENG_DEBYE_POR_E_PM }
}

export const RENG_ESCENA_POLARIDAD: RengModeloEscenaN1 = {
  id: 'polaridad-enlace',
  nombre: 'Polaridad de un enlace',
  subtemas: ['n1-b4-s6', 'n1-b4-s7', 'n1-b4-s10', 'n1-b4-s11', 'n1-b4-s21'],
  pregunta: '¿Cómo cambia un enlace al aumentar la diferencia de electronegatividad entre sus átomos?',
  parametros: [
    { clave: 'chiA', etiqueta: 'Electronegatividad del átomo A', unidad: 'sin unidad', min: 0.7, max: 4, paso: 0.01, inicial: 2.2 },
    { clave: 'chiB', etiqueta: 'Electronegatividad del átomo B', unidad: 'sin unidad', min: 0.7, max: 4, paso: 0.01, inicial: 3.16 },
    { clave: 'd', etiqueta: 'Longitud del enlace', unidad: 'pm', min: 70, max: 300, paso: 1, inicial: 127 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'dchi', etiqueta: 'Diferencia de electronegatividad', unidad: 'sin unidad', cifras: 3 },
    { clave: 'ionico', etiqueta: 'Carácter iónico (Pauling)', unidad: '%', cifras: 3 },
    { clave: 'tipo', etiqueta: 'Tipo (0 apolar, 1 polar, 2 iónico)', unidad: 'sin unidad', cifras: 1 },
    { clave: 'mu', etiqueta: 'Momento dipolar estimado', unidad: 'D', cifras: 3 }
  ],
  lecturas: (rengV) => rengLecturasPolaridad(rengV),
  enPalabras: (_rengV, _rengT, rengL) =>
    `La diferencia de electronegatividad es ${rengNum(rengL.dchi!)}: el enlace es ${RENG_NOMBRE_TIPO[rengL.tipo!]}, con un ${rengNum(rengL.ionico!)} % de carácter iónico según la relación de Pauling. Si esa fracción de carga estuviera separada a la longitud del enlace, el momento dipolar sería de unos ${rengNum(rengL.mu!)} D. Cuanto mayor es la diferencia, más desplazados están los electrones hacia el átomo más electronegativo.`,
  grafica: {
    tituloX: 'diferencia de electronegatividad',
    tituloY: 'carácter iónico (%)',
    ejeX: () => [0, 3.3],
    ejeY: () => [0, 100],
    curvas: () => [{ nombre: 'Pauling', puntos: Array.from({ length: 34 }, (_rengX, rengI) => [rengI / 10, rengCaracterIonico(rengI / 10)] as const) }],
    cursor: (_rengV, _rengT, rengL) => [rengL.dchi!, rengL.ionico!]
  },
  ficha: {
    descripcion: 'La diferencia de electronegatividad entre dos átomos orienta sobre el tipo de enlace: por debajo de 0,4 se considera covalente apolar; hasta 1,7, covalente polar; y por encima, predominantemente iónico. La relación empírica de Pauling estima el porcentaje de carácter iónico, y con él se obtiene un momento dipolar aproximado.',
    ecuaciones: [
      { tex: String.raw`\%\,\text{iónico} = 100\left(1 - e^{-\Delta\chi^2/4}\right)`, texto: '% iónico = 100·(1 − e^(−Δχ²/4))' },
      { tex: String.raw`\mu \approx \delta\, e\, d`, texto: 'μ ≈ δ·e·d' }
    ],
    supuestos: ['Los límites 0,4 y 1,7 son los que usa la app para clasificar los enlaces.', 'La carga parcial se toma igual a la fracción de carácter iónico.'],
    limites: [
      'Los límites entre tipos de enlace son orientativos, no fronteras físicas.',
      'El momento dipolar estimado puede diferir bastante del medido (para el HCl se mide 1,08 D).',
      'No trata moléculas con varios enlaces, donde los dipolos se suman como vectores.'
    ],
    condicionesIniciales: 'Enlace H–Cl: electronegatividades 2,20 y 3,16 y longitud 127 pm.',
    procedencia: [
      rengDeclarada(`Electronegatividades de la app: ${RENG_FUENTE_EN}; no se abrieron de nuevo en esta entrega.`),
      rengSinVerificar('Relación de Pauling para el carácter iónico, límites 0,4 y 1,7 y momento dipolar del HCl (1,08 D): valores y reglas de uso común recordados, no contrastados en esta entrega.'),
      rengDidactico('Las electronegatividades y la longitud las eliges tú.'),
      rengIdealizado('Carga parcial igual al carácter iónico.'),
      rengCalculado('Las pruebas comprueban la diferencia, el porcentaje, la clasificación y el momento dipolar con cálculos independientes.')
    ]
  },
  casos: [
    { nombre: 'H–H: covalente apolar', valores: { chiA: 2.2, chiB: 2.2, d: 74 } },
    { nombre: 'O–H: covalente polar', valores: { chiA: 3.44, chiB: 2.2, d: 96 } },
    { nombre: 'Na–Cl: iónico', valores: { chiA: 0.93, chiB: 3.16, d: 236 } }
  ]
}
