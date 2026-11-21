import { RENG_PROCEDENCIA_MASAS, rengCalculado, rengDidactico, rengIdealizado } from '../../aprender/n1/procedencia'
import { rengAjustarEcuacion, type RengAjuste } from '../../nucleo/ajuste'
import { rengReactivoLimitante } from '../../nucleo/estequiometria'
import { rengMasaMolarDe, rengSubindice } from '../../nucleo/formula'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

export const RENG_REACCIONES_LIMITANTE: readonly string[] = ['2H2 + O2 = 2H2O', 'N2 + 3H2 = 2NH3', 'CH4 + 2O2 = CO2 + 2H2O', 'C3H8 + 5O2 = 3CO2 + 4H2O']

export const RENG_AJUSTES_LIMITANTE: readonly RengAjuste[] = RENG_REACCIONES_LIMITANTE.map((rengE) => rengAjustarEcuacion(rengE))

const rengNum = (rengV: number, rengC = 3): string => String(Number(rengV.toPrecision(rengC))).replace('.', ',')

export const rengAjusteDe = (rengV: RengValoresEscenaN1): RengAjuste => RENG_AJUSTES_LIMITANTE[Math.max(0, Math.min(RENG_AJUSTES_LIMITANTE.length - 1, Math.round(rengV.r!)))]!

export function rengLecturasLimitante(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengA = rengAjusteDe(rengV)
  const rengR = rengReactivoLimitante(rengA, [
    { indice: 0, moles: rengV.n1! },
    { indice: 1, moles: rengV.n2! }
  ])
  const rengProducto = rengR.productos[0]!
  const rengRend = rengV.rend! / 100
  const rengMasaConsumida = rengR.reactivos.reduce((rengS, rengT, rengI) => rengS + rengT.consumido * rengMasaMolarDe(rengA.reactivos[rengI]!.formula), 0)
  const rengMasaFormada = rengR.productos.reduce((rengS, rengP) => rengS + rengP.masa, 0)
  return {
    limitante: rengR.limitante + 1,
    avance: rengR.avance,
    nProducto: rengProducto.moles,
    mProducto: rengProducto.masa,
    mReal: rengProducto.masa * rengRend,
    sobrante: Math.max(rengR.reactivos[0]!.sobrante, rengR.reactivos[1]!.sobrante),
    balance: rengMasaConsumida - rengMasaFormada
  }
}

const rengCurva = (rengV: RengValoresEscenaN1, rengMax: number): Array<readonly [number, number]> =>
  Array.from({ length: 81 }, (_rengX, rengI) => (rengI * rengMax) / 80).map((rengN2) => [rengN2, rengLecturasLimitante({ ...rengV, n2: Math.max(rengN2, 1e-9) }).nProducto!] as const)

export const RENG_ESCENA_LIMITANTE: RengModeloEscenaN1 = {
  id: 'reactivo-limitante',
  nombre: 'Reactivo limitante y rendimiento',
  subtemas: ['n1-b6-s2', 'n1-b6-s8', 'n1-b7-s9', 'n1-b7-s10', 'n1-b7-s11', 'n1-b7-s13', 'n1-b7-s14', 'n1-b7-s15', 'n1-b7-s16', 'n1-b7-s17'],
  pregunta: '¿Cuál de los dos reactivos se agota primero, cuánto producto puede formarse y cuánto se obtiene con un rendimiento dado?',
  parametros: [
    { clave: 'r', etiqueta: 'Reacción (0: agua, 1: amoníaco, 2: metano, 3: propano)', unidad: 'sin unidad', min: 0, max: 3, paso: 1, inicial: 1 },
    { clave: 'n1', etiqueta: 'Moles del primer reactivo', unidad: 'mol', min: 0.1, max: 10, paso: 0.1, inicial: 2 },
    { clave: 'n2', etiqueta: 'Moles del segundo reactivo', unidad: 'mol', min: 0.1, max: 10, paso: 0.1, inicial: 4 },
    { clave: 'rend', etiqueta: 'Rendimiento porcentual', unidad: '%', min: 10, max: 100, paso: 5, inicial: 100 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'limitante', etiqueta: 'Reactivo limitante (1 o 2)', unidad: 'sin unidad', cifras: 1 },
    { clave: 'avance', etiqueta: 'Avance de reacción ξ', unidad: 'mol', cifras: 4 },
    { clave: 'nProducto', etiqueta: 'Primer producto, teórico', unidad: 'mol', cifras: 4 },
    { clave: 'mProducto', etiqueta: 'Masa teórica del primer producto', unidad: 'g', cifras: 4 },
    { clave: 'mReal', etiqueta: 'Masa obtenida con ese rendimiento', unidad: 'g', cifras: 4 },
    { clave: 'sobrante', etiqueta: 'Reactivo en exceso que sobra', unidad: 'mol', cifras: 4 },
    { clave: 'balance', etiqueta: 'Masa consumida − masa formada', unidad: 'g', cifras: 2 }
  ],
  lecturas: (rengV) => rengLecturasLimitante(rengV),
  enPalabras: (rengV, _rengT, rengL) => {
    const rengA = rengAjusteDe(rengV)
    const rengLim = rengSubindice(rengA.reactivos[rengL.limitante! - 1]!.entrada)
    const rengExc = rengSubindice(rengA.reactivos[2 - rengL.limitante!]!.entrada)
    const rengProd = rengSubindice(rengA.productos[0]!.entrada)
    return `En ${rengA.texto}, con ${rengNum(rengV.n1!)} mol de ${rengSubindice(rengA.reactivos[0]!.entrada)} y ${rengNum(rengV.n2!)} mol de ${rengSubindice(rengA.reactivos[1]!.entrada)}, el limitante es ${rengLim}: la reacción avanza ξ = ${rengNum(rengL.avance!)} mol. Se pueden formar ${rengNum(rengL.nProducto!)} mol de ${rengProd} (${rengNum(rengL.mProducto!)} g); con un rendimiento del ${rengNum(rengV.rend!)} % se obtienen ${rengNum(rengL.mReal!)} g. Sobran ${rengNum(rengL.sobrante!)} mol de ${rengExc}. La masa consumida es igual a la formada (conservación de la masa).`
  },
  grafica: {
    tituloX: 'moles del segundo reactivo',
    tituloY: 'moles del primer producto',
    ejeX: () => [0, 10],
    ejeY: (rengV) => [0, Math.max(0.5, rengLecturasLimitante({ ...rengV, n2: 10 }).nProducto! * 1.1)],
    curvas: (rengV) => [{ nombre: `con ${rengNum(rengV.n1!)} mol del primero`, puntos: rengCurva(rengV, 10) }],
    cursor: (rengV, _rengT, rengL) => [rengV.n2!, rengL.nProducto!]
  },
  ficha: {
    descripcion: 'Estequiometría de una reacción ajustada con dos reactivos: el avance máximo ξ es el menor de los cocientes moles/coeficiente; el reactivo que da ese cociente es el limitante. Los productos teóricos son coeficiente × ξ; el rendimiento solo escala la masa obtenida del primer producto. La gráfica muestra cómo crece el producto al añadir el segundo reactivo hasta que el primero pasa a ser el limitante.',
    ecuaciones: [
      { tex: String.raw`\xi = \min\left(\frac{n_1}{\nu_1}, \frac{n_2}{\nu_2}\right)`, texto: 'ξ = mín(n₁/ν₁, n₂/ν₂)' },
      { tex: String.raw`n_{\mathrm{P}} = \nu_{\mathrm{P}} \cdot \xi`, texto: 'n_P = ν_P · ξ' },
      { tex: String.raw`m_{\mathrm{real}} = \frac{R}{100} \cdot n_{\mathrm{P}} \cdot M_{\mathrm{P}}`, texto: 'm_real = (R/100) · n_P · M_P' }
    ],
    supuestos: ['La reacción va hasta que se agota el limitante (sin equilibrio).', 'Ecuación ajustada por el motor de la aplicación.', 'El rendimiento es un número dado, no se calcula.'],
    limites: [
      'No predice la velocidad ni si la reacción ocurre de verdad en esas condiciones: solo hace las cuentas de la ecuación ajustada.',
      'El rendimiento se aplica solo al primer producto y como un factor; en el laboratorio las pérdidas tienen causas concretas que el modelo no describe.',
      'Las masas molares salen de la tabla de la aplicación (sin verificar).'
    ],
    condicionesIniciales: 'Síntesis del amoníaco con 2 mol de N₂ y 4 mol de H₂ y rendimiento del 100 %.',
    procedencia: [RENG_PROCEDENCIA_MASAS, rengDidactico('Los intervalos de cantidades y rendimiento son de elección didáctica.'), rengIdealizado('Reacción completa hasta agotar el limitante.'), rengCalculado('Avance y cantidades con la función del núcleo de la aplicación para el reactivo limitante; las pruebas lo recalculan con un balance de átomos independiente.')]
  },
  casos: [
    { nombre: 'Proporción exacta (2 : 6)', valores: { n1: 2, n2: 6 } },
    { nombre: 'Exceso del primero', valores: { n1: 5 } },
    { nombre: 'Rendimiento del 60 %', valores: { rend: 60 } }
  ]
}
