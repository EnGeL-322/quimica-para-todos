import { rengCalculado, rengDeclarada, rengDidactico, rengIdealizado } from '../../aprender/n1/procedencia'
import { RENG_FARADAY } from '../../datos/electroquimica'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

const rengNum = (rengV: number, rengC = 3): string => {
  const rengA = Math.abs(rengV)
  return (rengA !== 0 && (rengA >= 1e5 || rengA < 1e-3) ? rengV.toExponential(rengC - 1).replace('e', '·10^') : String(Number(rengV.toPrecision(rengC)))).replace('.', ',')
}

export const RENG_F_ESCENA = RENG_FARADAY.valor

export function rengLecturasElectrolisis(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengQ = rengV.I! * rengV.t! * 60
  const rengNe = rengQ / RENG_F_ESCENA
  const rengUtil = rengNe * (rengV.ef! / 100)
  const rengN = rengUtil / rengV.z!
  return { Q: rengQ, ne: rengNe, n: rengN, m: rengN * rengV.M!, mmax: (rengNe / rengV.z!) * rengV.M! }
}

export const RENG_ESCENA_ELECTROLISIS: RengModeloEscenaN1 = {
  id: 'electrolisis',
  nombre: 'Electrólisis y leyes de Faraday',
  subtemas: ['n1-b11-s17', 'n1-b11-s18', 'n1-b11-s19'],
  pregunta: '¿Cuánta sustancia se deposita (o se disuelve) al pasar una corriente durante un tiempo?',
  parametros: [
    { clave: 'I', etiqueta: 'Intensidad de corriente', unidad: 'A', min: 0.01, max: 20, paso: 0.01, inicial: 2 },
    { clave: 't', etiqueta: 'Tiempo', unidad: 'min', min: 1, max: 600, paso: 1, inicial: 60 },
    { clave: 'z', etiqueta: 'Electrones por átomo depositado', unidad: 'sin unidad', min: 1, max: 3, paso: 1, inicial: 2 },
    { clave: 'M', etiqueta: 'Masa molar del metal', unidad: 'g/mol', min: 1, max: 250, paso: 0.01, inicial: 63.55 },
    { clave: 'ef', etiqueta: 'Eficiencia de la corriente', unidad: '%', min: 1, max: 100, paso: 1, inicial: 100 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'Q', etiqueta: 'Carga que circula', unidad: 'C', cifras: 4 },
    { clave: 'ne', etiqueta: 'Moles de electrones', unidad: 'mol', cifras: 4 },
    { clave: 'n', etiqueta: 'Moles de metal depositado', unidad: 'mol', cifras: 4 },
    { clave: 'm', etiqueta: 'Masa depositada', unidad: 'g', cifras: 4 },
    { clave: 'mmax', etiqueta: 'Masa con eficiencia del 100 %', unidad: 'g', cifras: 4 }
  ],
  lecturas: (rengV) => rengLecturasElectrolisis(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `Una corriente de ${rengNum(rengV.I!)} A durante ${rengNum(rengV.t!)} min hace circular ${rengNum(rengL.Q!, 4)} C, es decir, ${rengNum(rengL.ne!, 4)} mol de electrones. Con ${rengNum(rengV.z!)} electrones por átomo y una eficiencia del ${rengNum(rengV.ef!)} %, se depositan ${rengNum(rengL.n!, 4)} mol de metal: ${rengNum(rengL.m!, 4)} g. En la corrosión ocurre lo mismo al revés: esa masa de metal se disolvería en el ánodo.`,
  grafica: {
    tituloX: 'tiempo (min)',
    tituloY: 'masa depositada (g)',
    ejeX: () => [0, 600],
    ejeY: (rengV) => [0, Math.max(1e-3, rengLecturasElectrolisis({ ...rengV, t: 600 }).m! * 1.05)],
    curvas: (rengV) => [{ nombre: 'masa depositada', puntos: Array.from({ length: 61 }, (_rengX, rengI) => [rengI * 10, rengI === 0 ? 0 : rengLecturasElectrolisis({ ...rengV, t: rengI * 10 }).m!] as const) }],
    cursor: (rengV, _rengT, rengL) => [rengV.t!, rengL.m!]
  },
  ficha: {
    descripcion: 'Celda electrolítica en la que una corriente constante deposita un metal en el cátodo (o lo disuelve en el ánodo). La carga Q = I·t se convierte en moles de electrones con la constante de Faraday y, con los electrones por átomo, en moles y gramos de metal.',
    ecuaciones: [
      { tex: String.raw`Q = I \cdot t, \quad n_{e^-} = \frac{Q}{F}`, texto: 'Q = I·t;  n(e⁻) = Q / F' },
      { tex: String.raw`m = \frac{Q}{z F} \cdot M \cdot \eta`, texto: 'm = Q / (z·F) · M · η' }
    ],
    supuestos: ['Corriente constante.', 'Solo una reacción en el electrodo; la eficiencia η reparte la carga perdida en otras reacciones.', 'F con el valor CODATA registrado en el proyecto.'],
    limites: [
      'No calcula el voltaje necesario ni la energía consumida.',
      'La eficiencia real depende de reacciones secundarias (como la formación de H₂) que la escena no modela: es un dato que eliges.',
      'La corrosión real depende del medio y del oxígeno; aquí solo se relaciona una corriente con la masa de metal que se disuelve.'
    ],
    condicionesIniciales: '2 A durante 60 min sobre un metal de 63,55 g/mol (como el cobre) que necesita 2 electrones por átomo, con eficiencia del 100 %.',
    procedencia: [rengDeclarada('F = 96 485,33212 C/mol, constante registrada en el proyecto (datos/electroquimica.ts, filas CODATA 2018 y 2022 contrastadas). No se reabrió la fuente en esta entrega.'), rengDidactico('Corriente, tiempo, electrones por átomo, masa molar y eficiencia son parámetros que tú eliges.'), rengIdealizado('Corriente constante y una sola reacción útil en el electrodo.'), rengCalculado('Las pruebas comprueban m = I·t·M·η/(z·F) y la proporcionalidad con el tiempo en cada combinación.')]
  },
  casos: [
    { nombre: 'Plata (1 electrón)', valores: { z: 1, M: 107.87 } },
    { nombre: 'Aluminio (3 electrones)', valores: { z: 3, M: 26.98 } },
    { nombre: 'Eficiencia del 80 %', valores: { ef: 80 } }
  ]
}
