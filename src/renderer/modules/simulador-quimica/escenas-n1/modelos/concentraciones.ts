import { RENG_PROCEDENCIA_MASAS, rengCalculado, rengDidactico, rengIdealizado } from '../../aprender/n1/procedencia'
import { rengFraccionesMolares, rengMolalidad, rengMolaridad, rengNormalidad, rengPorcentajeMasa, rengPorcentajeMasaVolumen, rengPpm } from '../../nucleo/estequiometria'
import { rengMasaMolarDe } from '../../nucleo/formula'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../tipos'

export const RENG_KF_AGUA_DIDACTICO = 1.86
const RENG_M_AGUA = rengMasaMolarDe('H2O')

const rengNum = (rengV: number, rengC = 3): string => {
  const rengA = Math.abs(rengV)
  return (rengA !== 0 && (rengA >= 1e5 || rengA < 1e-3) ? rengV.toExponential(rengC - 1).replace('e', '·10^') : String(Number(rengV.toPrecision(rengC)))).replace('.', ',')
}

export function rengLecturasConcentraciones(rengV: RengValoresEscenaN1): RengValoresEscenaN1 {
  const rengMs = rengV.ms!
  const rengMd = rengV.md!
  const rengN = rengMs / rengV.M!
  const rengVol = (rengMs + rengMd) / rengV.rho!
  const rengMolar = rengMolaridad(rengN, rengVol / 1000)
  const rengMolal = rengMolalidad(rengN, rengMd / 1000)
  return {
    pmm: rengPorcentajeMasa(rengMs, rengMs + rengMd),
    vol: rengVol,
    pmv: rengPorcentajeMasaVolumen(rengMs, rengVol),
    molar: rengMolar,
    molal: rengMolal,
    x: rengFraccionesMolares([rengN, rengMd / RENG_M_AGUA])[0]!,
    normal: rengNormalidad(rengMolar, rengV.eq!),
    ppm: rengPpm(rengMs, rengMs + rengMd),
    dTf: RENG_KF_AGUA_DIDACTICO * rengMolal * rengV.i!
  }
}

export const RENG_ESCENA_CONCENTRACIONES: RengModeloEscenaN1 = {
  id: 'concentraciones',
  nombre: 'Concentraciones de una disolución',
  subtemas: ['n1-b1-s12', 'n1-b1-s13', 'n1-b9-s8', 'n1-b9-s10', 'n1-b9-s11', 'n1-b9-s12', 'n1-b9-s13', 'n1-b9-s14', 'n1-b9-s15', 'n1-b9-s16', 'n1-b9-s20'],
  pregunta: '¿Cómo se expresa con distintas medidas la concentración de una misma disolución acuosa?',
  parametros: [
    { clave: 'ms', etiqueta: 'Masa de soluto', unidad: 'g', min: 0.001, max: 50, paso: 0.001, inicial: 5.85 },
    { clave: 'M', etiqueta: 'Masa molar del soluto', unidad: 'g/mol', min: 10, max: 400, paso: 0.01, inicial: 58.44 },
    { clave: 'md', etiqueta: 'Masa de agua (disolvente)', unidad: 'g', min: 50, max: 2000, paso: 10, inicial: 250 },
    { clave: 'rho', etiqueta: 'Densidad de la disolución', unidad: 'g/mL', min: 0.95, max: 1.5, paso: 0.005, inicial: 1.015 },
    { clave: 'eq', etiqueta: 'Equivalentes por mol de soluto', unidad: 'sin unidad', min: 1, max: 3, paso: 1, inicial: 1 },
    { clave: 'i', etiqueta: 'Partículas por fórmula disuelta (i)', unidad: 'sin unidad', min: 1, max: 3, paso: 1, inicial: 2 }
  ],
  tiempo: null,
  magnitudes: [
    { clave: 'pmm', etiqueta: 'Porcentaje en masa', unidad: '%', cifras: 4 },
    { clave: 'vol', etiqueta: 'Volumen de disolución', unidad: 'mL', cifras: 4 },
    { clave: 'pmv', etiqueta: 'Porcentaje masa-volumen (g/100 mL)', unidad: '%', cifras: 4 },
    { clave: 'molar', etiqueta: 'Molaridad', unidad: 'mol/L', cifras: 4 },
    { clave: 'molal', etiqueta: 'Molalidad', unidad: 'mol/kg', cifras: 4 },
    { clave: 'x', etiqueta: 'Fracción molar del soluto', unidad: 'sin unidad', cifras: 4 },
    { clave: 'normal', etiqueta: 'Normalidad', unidad: 'eq/L', cifras: 4 },
    { clave: 'ppm', etiqueta: 'Partes por millón (en masa)', unidad: 'ppm', cifras: 4 },
    { clave: 'dTf', etiqueta: 'Descenso del punto de congelación (K_f didáctico)', unidad: 'K', cifras: 3 }
  ],
  lecturas: (rengV) => rengLecturasConcentraciones(rengV),
  enPalabras: (rengV, _rengT, rengL) =>
    `${rengNum(rengV.ms!)} g de soluto (M = ${rengNum(rengV.M!, 4)} g/mol) en ${rengNum(rengV.md!)} g de agua forman ${rengNum(rengL.vol!)} mL de disolución. Es un ${rengNum(rengL.pmm!)} % en masa, ${rengNum(rengL.molar!)} mol/L (${rengNum(rengL.normal!)} eq/L), ${rengNum(rengL.molal!)} mol/kg, fracción molar ${rengNum(rengL.x!)} y ${rengNum(rengL.ppm!)} ppm. Con i = ${rengNum(rengV.i!)} y el K_f didáctico, el agua congelaría ${rengNum(rengL.dTf!)} K por debajo de lo normal.`,
  grafica: {
    tituloX: 'masa de soluto (g)',
    tituloY: 'concentración',
    ejeX: () => [0, 50],
    ejeY: (rengV) => [0, Math.max(1, rengLecturasConcentraciones({ ...rengV, ms: 50 }).molal! * 1.1, rengLecturasConcentraciones({ ...rengV, ms: 50 }).molar! * 1.1)],
    curvas: (rengV) => {
      const rengPts = Array.from({ length: 51 }, (_rengX, rengI) => Math.max(0.001, rengI))
      return [
        { nombre: 'molalidad (mol/kg)', puntos: rengPts.map((rengM) => [rengM, rengLecturasConcentraciones({ ...rengV, ms: rengM }).molal!] as const) },
        { nombre: 'molaridad (mol/L)', puntos: rengPts.map((rengM) => [rengM, rengLecturasConcentraciones({ ...rengV, ms: rengM }).molar!] as const) }
      ]
    },
    cursor: (rengV, _rengT, rengL) => [rengV.ms!, rengL.molal!]
  },
  ficha: {
    descripcion: 'Disolución acuosa de un soluto genérico. A partir de la masa de soluto, su masa molar, la masa de agua y la densidad de la disolución se calculan todas las medidas de concentración del capítulo. El descenso del punto de congelación usa una K_f didáctica y el modelo de disolución diluida ideal.',
    ecuaciones: [
      { tex: String.raw`\% m/m = \frac{m_s}{m_s + m_d} \times 100`, texto: '% m/m = m_s / (m_s + m_d) × 100' },
      { tex: String.raw`c = \frac{n_s}{V}, \quad b = \frac{n_s}{m_d}`, texto: 'c = n_s / V,   b = n_s / m_d' },
      { tex: String.raw`x_s = \frac{n_s}{n_s + n_d}`, texto: 'x_s = n_s / (n_s + n_d)' },
      { tex: String.raw`\Delta T_f = K_f \cdot b \cdot i`, texto: 'ΔT_f = K_f · b · i' }
    ],
    supuestos: ['El volumen de la disolución se obtiene de su masa y de la densidad que tú eliges (no se calcula).', 'El disolvente es agua; su masa molar sale de la tabla de la app.', 'Para ΔT_f: disolución diluida ideal y disociación completa en i partículas.'],
    limites: [
      'La densidad es un dato libre: en una disolución real depende de la concentración y hay que medirla o buscarla.',
      'K_f = 1,86 K·kg/mol es un parámetro didáctico (valor de uso común para el agua, no contrastado con una fuente en esta entrega).',
      'A concentraciones altas, la disociación es incompleta y los iones interactúan: el descenso real es menor que K_f·b·i.',
      'La normalidad depende de la reacción en la que se use el soluto: «equivalentes por mol» es un dato que eliges.'
    ],
    condicionesIniciales: '5,85 g de un soluto de masa molar 58,44 g/mol (como la sal común) en 250 g de agua, densidad 1,015 g/mL, 1 equivalente por mol e i = 2.',
    procedencia: [RENG_PROCEDENCIA_MASAS, rengDidactico('Densidad, K_f = 1,86 K·kg/mol e i son parámetros didácticos que tú eliges.'), rengIdealizado('Disolución acuosa homogénea; volumen calculado con la densidad dada.'), rengCalculado('Medidas calculadas con las funciones de concentración del núcleo de la aplicación; las pruebas las recalculan con las definiciones y con la relación c = 10·%·ρ/M.')]
  },
  casos: [
    { nombre: 'El doble de soluto', valores: { ms: 11.7 } },
    { nombre: 'El doble de agua', valores: { md: 500 } },
    { nombre: 'Soluto de M = 180 g/mol', valores: { M: 180 } }
  ]
}
