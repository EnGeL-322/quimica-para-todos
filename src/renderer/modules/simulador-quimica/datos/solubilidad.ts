export interface RengFuenteKsp {
  id: string
  titulo: string
  url: string
  consultada: string
  lectura: 'filas-literales' | 'fragmento' | 'indice'
  alcanceLectura: string
  origenDato: string
  temperaturaC: number
  fuerzaIonica: string
  disolvente: string
  licencia: string
  condicionReutilizacion: string
}

export interface RengFilaFuente {
  fuenteId: string
  filaLiteral: string
  nota: string
}

export interface RengIonSal {
  formula: string
  carga: number
  nu: number
}

export interface RengDefinicionSal {
  id: string
  nombre: string
  formula: string
  solido: string
  cation: RengIonSal
  anion: RengIonSal
  registro: RengFilaFuente
  otrasFuentes: readonly RengFilaFuente[]
  hidrolisis: 'aviso' | 'info'
  notaModelo: string
}

export interface RengSalSolubilidad extends RengDefinicionSal {
  ksp: number
  pKspFuente: number | null
  kspTexto: string
  fuente: RengFuenteKsp
  otrasConValor: ReadonlyArray<RengFilaFuente & { ksp: number; fuente: RengFuenteKsp }>
}

const RENG_CONSULTA = '2026-11-15'
const RENG_LECTURA = 'Filas literales citadas por la herramienta de lectura de páginas (WebFetch, que resume la página con un modelo pequeño). No leí la página entera: el valor llega como fragmento de tabla citado, y la herramienta indicó que el contenido parecía completo.'

export const RENG_FUENTES_KSP: readonly RengFuenteKsp[] = [
  {
    id: 'harvey-16-10',
    titulo: 'Analytical Chemistry 2.1 (D. Harvey), «16.10: Solubility Products»',
    url: 'https://chem.libretexts.org/Bookshelves/Analytical_Chemistry/Analytical_Chemistry_2.1_by_David_Harvey/Analytical_Chemistry_2.1_(Harvey)/16%3A_Appendix/16.10%3A_Solubility_Products',
    consultada: RENG_CONSULTA,
    lectura: 'filas-literales',
    alcanceLectura: RENG_LECTURA,
    origenDato: 'Martell, A. E.; Smith, R. M., Critical Stability Constants, Vol. 4, Plenum Press, Nueva York, 1976 (atribución que declara la página).',
    temperaturaC: 25,
    fuerzaIonica: 'cero (nota general de la página: «Unless otherwise stated, values are for 25 oC and zero ionic strength»; las filas usadas no declaran otra cosa)',
    disolvente: 'no declarado en la página',
    licencia: 'CC BY-NC-SA 4.0 (declarada en la página)',
    condicionReutilizacion: 'Atribución, uso no comercial y compartir igual. Se transcriben tres constantes (datos) con su atribución; si la aplicación se distribuyera con fines comerciales habría que revisar esta condición (ver licencias/CREDITOS-DATOS.txt).'
  },
  {
    id: 'libretexts-e3',
    titulo: 'LibreTexts, «E3: Solubility Constants for Compounds at 25°C»',
    url: 'https://chem.libretexts.org/Ancillary_Materials/Reference/Reference_Tables/Equilibrium_Constants/E3._Solubility_Constants_for_Compounds_at_25C',
    consultada: RENG_CONSULTA,
    lectura: 'filas-literales',
    alcanceLectura: RENG_LECTURA,
    origenDato: 'CRC Handbook of Chemistry and Physics, 84.ª edición (2004), según la página.',
    temperaturaC: 25,
    fuerzaIonica: 'no declarada',
    disolvente: 'agua (implícito en el texto de la página; no declarado para los valores)',
    licencia: 'CC BY-NC-SA 4.0 (declarada en la página)',
    condicionReutilizacion: 'Solo consultada para contrastar; no se usa ningún valor de esta fuente en los cálculos.'
  },
  {
    id: 'openstax-lumen-10-10',
    titulo: 'General Chemistry, Lecture and Lab (Lumen), «10.10: Solubility Products» (contenido de OpenStax Chemistry)',
    url: 'https://chem.libretexts.org/Courses/Lumen_Learning/Book%3A_General_Chemistry__Lecture_and_Lab_(Lumen)/10%3A_Appendices/10.10%3A_Solubility_Products',
    consultada: RENG_CONSULTA,
    lectura: 'filas-literales',
    alcanceLectura: RENG_LECTURA + ' Los valores están incrustados como imágenes LaTeX; la herramienta citó su texto alternativo.',
    origenDato: 'OpenStax College (la página no atribuye una fuente a cada valor).',
    temperaturaC: 25,
    fuerzaIonica: 'no declarada',
    disolvente: 'no declarado',
    licencia: 'CC BY 4.0 (declarada en la página)',
    condicionReutilizacion: 'Solo consultada para contrastar; no se usa ningún valor de esta fuente en los cálculos.'
  }
]

const RENG_DEFINICIONES: readonly RengDefinicionSal[] = [
  {
    id: 'caf2',
    nombre: 'Fluoruro de calcio',
    formula: 'CaF₂',
    solido: 'CaF₂(s)',
    cation: { formula: 'Ca²⁺', carga: 2, nu: 1 },
    anion: { formula: 'F⁻', carga: -1, nu: 2 },
    registro: { fuenteId: 'harvey-16-10', filaLiteral: '| \\(\\mathrm{CaF2}\\) | 10.41 | \\(3.9 \\times 10^{-11}\\) |', nota: 'Una sola fila para CaF2; la página no usa el nombre «fluorita».' },
    otrasFuentes: [
      { fuenteId: 'libretexts-e3', filaLiteral: 'Calcium fluoride | CaF2 | 3.45 × 10−11', nota: 'Sin polimorfo ni hidrato.' },
      { fuenteId: 'openstax-lumen-10-10', filaLiteral: 'CaF2 | 4.0 \\times {10}^{-11}', nota: '' }
    ],
    hidrolisis: 'aviso',
    notaModelo: 'El anión F⁻ es la base conjugada de un ácido débil: el modelo ignora su hidrólisis, la formación de complejos y el pH (ninguna fuente consultada lo cuantifica).'
  },
  {
    id: 'mgoh2',
    nombre: 'Hidróxido de magnesio',
    formula: 'Mg(OH)₂',
    solido: 'Mg(OH)₂(s)',
    cation: { formula: 'Mg²⁺', carga: 2, nu: 1 },
    anion: { formula: 'OH⁻', carga: -1, nu: 2 },
    registro: { fuenteId: 'harvey-16-10', filaLiteral: '| \\(\\mathrm{Mg(OH)2}\\) | 11.15 | \\(7.1 \\times 10^{-12}\\) |', nota: 'Una sola fila para Mg(OH)2; la página no usa el nombre «brucita».' },
    otrasFuentes: [
      { fuenteId: 'libretexts-e3', filaLiteral: 'Magnesium hydroxide | Mg(OH)2 | 5.61 × 10−12', nota: '' },
      { fuenteId: 'openstax-lumen-10-10', filaLiteral: 'Mg(OH)2 | 8.9 \\times {10}^{-12}', nota: '' }
    ],
    hidrolisis: 'info',
    notaModelo: 'Los iones OH⁻ del propio sólido fijan el pH; el modelo ignora la autoprotólisis del agua, la formación de complejos hidroxo y el CO₂ disuelto (ninguna fuente consultada lo cuantifica).'
  },
  {
    id: 'caco3',
    nombre: 'Carbonato de calcio (calcita)',
    formula: 'CaCO₃',
    solido: 'CaCO₃(s, calcita)',
    cation: { formula: 'Ca²⁺', carga: 2, nu: 1 },
    anion: { formula: 'CO₃²⁻', carga: -2, nu: 1 },
    registro: { fuenteId: 'harvey-16-10', filaLiteral: '| \\(\\mathrm{CaCO3}\\) (calcite) | 8.35 | \\(4.5 \\times 10^{-9}\\) |', nota: 'La página da dos filas (calcita y aragonito, 6.0 × 10^-9); se usa solo la de calcita.' },
    otrasFuentes: [
      { fuenteId: 'libretexts-e3', filaLiteral: 'Calcium carbonate | CaCO3 | 3.36 × 10−9', nota: 'Sin polimorfo especificado.' },
      { fuenteId: 'openstax-lumen-10-10', filaLiteral: 'CaCO3 | 8.7 \\times {10}^{-9}', nota: 'Sin polimorfo especificado.' }
    ],
    hidrolisis: 'aviso',
    notaModelo: 'El anión CO₃²⁻ es una base: su hidrólisis, el equilibrio con el CO₂ disuelto y el pH no están en el modelo (ninguna fuente consultada los cuantifica), y es la sal cuyas tablas más discrepan.'
  }
]

export function rengLeerValorFila(rengFila: string): number {
  const rengLatex = /(\d+(?:\.\d+)?)\s*\\times\s*\{?10\}?\^\{(-?\d+)\}/.exec(rengFila)
  if (rengLatex) return Number(`${rengLatex[1]}e${rengLatex[2]}`)
  const rengUnicode = /(\d+(?:\.\d+)?)\s*×\s*10([−-]\d+)/.exec(rengFila)
  if (rengUnicode) return Number(`${rengUnicode[1]}e${rengUnicode[2]!.replace('−', '-')}`)
  throw new RangeError(`No se pudo leer un valor «a × 10^b» de la fila «${rengFila.slice(0, 80)}».`)
}

export function rengLeerPKspFila(rengFila: string): number | null {
  const rengM = /\|\s*(\d+\.\d+)\s*\|\s*\\\(/.exec(rengFila)
  return rengM ? Number(rengM[1]) : null
}

const rengTextoKsp = (rengK: number): string => {
  const [rengMant, rengExp] = rengK.toExponential(2).split('e')
  return `${Number(rengMant).toString().replace('.', ',')} × 10${[...String(Number(rengExp))].map((rengC) => (rengC === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(rengC)])).join('')}`
}

const RENG_CAMPOS_FUENTE: ReadonlyArray<keyof RengFuenteKsp> = ['titulo', 'url', 'consultada', 'lectura', 'alcanceLectura', 'origenDato', 'fuerzaIonica', 'disolvente', 'licencia', 'condicionReutilizacion']

export function rengValidarFuenteKsp(rengF: RengFuenteKsp): RengFuenteKsp {
  for (const rengC of RENG_CAMPOS_FUENTE) {
    const rengV = rengF[rengC]
    if (typeof rengV !== 'string' || rengV.trim().length < 3) throw new RangeError(`La fuente «${rengF.id}» no registra «${rengC}»: no puede respaldar ningún valor.`)
  }
  if (!/^https:\/\//.test(rengF.url)) throw new RangeError(`La fuente «${rengF.id}» no tiene un enlace https.`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(rengF.consultada)) throw new RangeError(`La fuente «${rengF.id}» no tiene fecha de consulta.`)
  if (!Number.isFinite(rengF.temperaturaC)) throw new RangeError(`La fuente «${rengF.id}» no declara la temperatura.`)
  return rengF
}

export function rengConstruirSal(rengD: RengDefinicionSal, rengFuentes: readonly RengFuenteKsp[] = RENG_FUENTES_KSP): RengSalSolubilidad {
  const rengBuscar = (rengId: string): RengFuenteKsp => {
    const rengF = rengFuentes.find((rengX) => rengX.id === rengId)
    if (!rengF) throw new RangeError(`La sal «${rengD.id}» cita la fuente «${rengId}», que no está registrada: no se puede cargar.`)
    return rengValidarFuenteKsp(rengF)
  }
  if (!rengD.registro || !rengD.registro.fuenteId || !rengD.registro.filaLiteral) throw new RangeError(`La sal «${rengD.id}» no tiene fuente de Ksp registrada: no se puede cargar.`)
  const rengFuente = rengBuscar(rengD.registro.fuenteId)
  const rengKsp = rengLeerValorFila(rengD.registro.filaLiteral)
  if (!(rengKsp > 0) || !Number.isFinite(rengKsp)) throw new RangeError(`El Ksp de «${rengD.id}» no es positivo y finito.`)
  const rengPKsp = rengLeerPKspFila(rengD.registro.filaLiteral)
  if (rengPKsp !== null && Math.abs(rengPKsp + Math.log10(rengKsp)) > 0.006) throw new RangeError(`El Ksp de «${rengD.id}» no concuerda con el pKsp de su misma fila (${rengPKsp}).`)
  for (const rengIon of [rengD.cation, rengD.anion]) if (!Number.isInteger(rengIon.nu) || rengIon.nu < 1 || rengIon.carga === 0) throw new RangeError(`La sal «${rengD.id}» tiene un ion mal definido.`)
  if (rengD.cation.nu * rengD.cation.carga + rengD.anion.nu * rengD.anion.carga !== 0) throw new RangeError(`La sal «${rengD.id}» no es neutra con esa estequiometría.`)
  const rengOtras = rengD.otrasFuentes.map((rengO) => ({ ...rengO, ksp: rengLeerValorFila(rengO.filaLiteral), fuente: rengBuscar(rengO.fuenteId) }))
  return { ...rengD, ksp: rengKsp, pKspFuente: rengPKsp, kspTexto: rengTextoKsp(rengKsp), fuente: rengFuente, otrasConValor: rengOtras }
}

export const RENG_SALES_SOLUBILIDAD: readonly RengSalSolubilidad[] = RENG_DEFINICIONES.map((rengD) => rengConstruirSal(rengD))

export const RENG_SALES_DESCARTADAS: ReadonlyArray<{ formula: string; motivo: string }> = [
  { formula: 'CaSO₄', motivo: 'Las tres fuentes abiertas dan valores distintos (2,4 × 10⁻⁵; 4,93 × 10⁻⁵; 6,1 × 10⁻⁵ como dihidrato) y ninguna aclara con certeza qué sólido (anhidro o hidrato) corresponde al valor: no se puede afirmar el dato, así que no entra.' },
  { formula: 'BaSO₄', motivo: 'Sal de bario, descartada por la regla de no incluir sales de metales pesados o tóxicos aunque la propia sal sea insoluble (solo se vio su fila en la tabla E3 como comparación; no se usa).' },
  { formula: 'AgCl, PbSO₄, HgCl₂, CdS y similares', motivo: 'Metales tóxicos o reactivos peligrosos: fuera del alcance de los montajes interactivos.' }
]

export const RENG_CODIGOS_SALES: readonly string[] = ['caf2', 'mgoh2', 'caco3']

export function rengSalRegistrada(rengId: string): RengSalSolubilidad {
  const rengS = RENG_SALES_SOLUBILIDAD.find((rengX) => rengX.id === rengId)
  if (!rengS) throw new RangeError(`La sal «${rengId}» no tiene fuente de Ksp registrada: no se puede cargar.`)
  return rengS
}
