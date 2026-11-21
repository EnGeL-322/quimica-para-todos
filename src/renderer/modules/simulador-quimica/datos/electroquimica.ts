export interface RengFuenteE {
  id: string
  titulo: string
  url: string
  consultada: string
  lectura: 'filas-literales' | 'fragmento' | 'indice'
  alcanceLectura: string
  origenDato: string
  temperatura: string
  convenio: string
  actividad: string
  presion: string
  fuerzaIonica: string
  licencia: string
  condicionReutilizacion: string
}

export interface RengFilaE {
  fuenteId: string
  filaLiteral: string
  referenciaFila: string
}

export interface RengDefinicionPar {
  id: string
  nombre: string
  oxidante: { formula: string; carga: number; nu: number }
  reductor: { formula: string; estado: 's' | 'g' }
  n: number
  registro: RengFilaE
  otrasFuentes: readonly RengFilaE[]
  nota: string
}

export interface RengParElectroquimico extends RengDefinicionPar {
  E0: number
  fuente: RengFuenteE
  otrasConValor: ReadonlyArray<RengFilaE & { E0: number; fuente: RengFuenteE }>
}

const RENG_CONSULTA = '2026-11-15'
const RENG_LECTURA = 'Filas literales citadas por la herramienta de lectura de páginas (WebFetch, que resume la página con un modelo pequeño). No leí la página entera: el valor llega como fragmento de tabla citado, y la herramienta indicó que el contenido parecía completo.'
const RENG_NO_DECLARADO = 'no declarado en la página'

export const RENG_FUENTES_E: readonly RengFuenteE[] = [
  {
    id: 'wikipedia-datos-e',
    titulo: 'Wikipedia, «Standard electrode potential (data page)»',
    url: 'https://en.wikipedia.org/wiki/Standard_electrode_potential_(data_page)',
    consultada: RENG_CONSULTA,
    lectura: 'filas-literales',
    alcanceLectura: RENG_LECTURA,
    origenDato: 'Cada fila cita su propia referencia (ver «referencia de la fila» de cada par): libros de referencia como el CRC Handbook of Chemistry and Physics, Bard, Parsons y Jordan (1985) o Atkins (1997), según la lista de la página. La fila del H₂ no cita ninguna.',
    temperatura: '298,15 K (25,00 °C)',
    convenio: 'electrodo estándar de hidrógeno (SHE) como referencia; potenciales de reducción',
    actividad: 'especies acuosas y amalgamadas a actividad 1 mol/dm³; sólidos y líquidos puros a actividad unidad',
    presion: 'gases a 101,325 kPa de presión parcial: convención de la mayor parte de la literatura, no el estado estándar actual de 100 kPa (la propia página lo advierte)',
    fuerzaIonica: RENG_NO_DECLARADO,
    licencia: 'CC BY-SA 4.0 («additional terms may apply», según la página)',
    condicionReutilizacion: 'Atribución y compartir igual; el uso comercial lo permite la licencia, pero la página avisa de que pueden aplicarse términos adicionales a contenido de terceros: revisar si la aplicación se distribuye (ver licencias/CREDITOS-DATOS.txt).'
  },
  {
    id: 'harvey-16-13',
    titulo: 'Analytical Chemistry 2.1 (D. Harvey), «16.13: Standard Reduction Potentials»',
    url: 'https://chem.libretexts.org/Bookshelves/Analytical_Chemistry/Analytical_Chemistry_2.1_by_David_Harvey/Analytical_Chemistry_2.1_(Harvey)/16%3A_Appendix/16.13%3A_Standard_Reduction_Potentials',
    consultada: RENG_CONSULTA,
    lectura: 'filas-literales',
    alcanceLectura: RENG_LECTURA + ' Algunas filas llegaron con el formato descolocado (Fe³⁺/Fe²⁺, Tl³⁺/Tl⁺); las usadas estaban intactas.',
    origenDato: 'Bard, Parsons y Jordan (1985); Milazzo, Caroli y Sharma (1978); Swift y Butler (1972); Bratsch (1989, J. Phys. Chem. Ref. Data); Latimer (1952), según la página. La página advierte de que «en unos pocos casos las diferencias no son insignificantes».',
    temperatura: RENG_NO_DECLARADO,
    convenio: RENG_NO_DECLARADO,
    actividad: 'solo dice que sólidos, gases y líquidos se identifican y el resto son especies acuosas; no declara actividades ni concentración',
    presion: RENG_NO_DECLARADO,
    fuerzaIonica: RENG_NO_DECLARADO,
    licencia: 'CC BY-NC-SA 4.0 (declarada en la página)',
    condicionReutilizacion: 'Solo consultada para contrastar y mostrar la discrepancia (valores «no usados»); no declara las condiciones que el modelo necesita. Atribución, uso no comercial y compartir igual: ver licencias/CREDITOS-DATOS.txt.'
  },
  {
    id: 'nist-codata-2018',
    titulo: 'NIST, «Fundamental Physical Constants — Complete Listing» (ajuste CODATA 2018)',
    url: 'https://physics.nist.gov/cuu/Constants/ArchiveASCII/allascii_2018.txt',
    consultada: RENG_CONSULTA,
    lectura: 'filas-literales',
    alcanceLectura: RENG_LECTURA,
    origenDato: 'Ajuste CODATA 2018 (el documento se identifica así); es la edición que ya usa el proyecto para R.',
    temperatura: 'no aplica (constante física)',
    convenio: 'constante exacta (la columna de incertidumbre dice «(exact)»); los puntos suspensivos indican dígitos truncados en el listado',
    actividad: 'no aplica',
    presion: 'no aplica',
    fuerzaIonica: 'no aplica',
    licencia: 'no declarada en el listado',
    condicionReutilizacion: 'El listado no declara condiciones de reutilización; se trata de una constante física (dato), citada con su origen.'
  },
  {
    id: 'nist-codata-2022',
    titulo: 'NIST, «Fundamental Physical Constants — Complete Listing» (ajuste CODATA 2022)',
    url: 'https://physics.nist.gov/cuu/Constants/Table/allascii.txt',
    consultada: RENG_CONSULTA,
    lectura: 'filas-literales',
    alcanceLectura: RENG_LECTURA,
    origenDato: 'Ajuste CODATA 2022 (el documento se identifica así); es la edición que NIST sirve hoy en esa dirección.',
    temperatura: 'no aplica (constante física)',
    convenio: 'constante exacta (la columna de incertidumbre dice «(exact)»); dígitos truncados con puntos suspensivos',
    actividad: 'no aplica',
    presion: 'no aplica',
    fuerzaIonica: 'no aplica',
    licencia: 'no declarada en el listado',
    condicionReutilizacion: 'Solo para contrastar con la edición 2018: no declara condiciones de reutilización.'
  }
]

export interface RengConstanteCodata {
  id: 'F' | 'R'
  nombre: string
  unidad: string
  filaLiteral: string
  valor: number
  fuente: RengFuenteE
  contraste: { filaLiteral: string; valor: number; fuente: RengFuenteE }
}

const RENG_FILAS_CODATA = {
  F: { nombre: 'Constante de Faraday', unidad: 'C/mol', f2018: 'Faraday constant                                            96 485.332 12...         (exact)                  C mol^-1', f2022: 'Faraday constant                                            96 485.332 12...         (exact)                  C mol^-1' },
  R: { nombre: 'Constante molar de los gases', unidad: 'J/(mol·K)', f2018: 'molar gas constant                                          8.314 462 618...         (exact)                  J mol^-1 K^-1', f2022: 'molar gas constant                                          8.314 462 618...         (exact)                  J mol^-1 K^-1' }
} as const

export function rengLeerValorCodata(rengFila: string): number {
  if (!/\(exact\)/.test(rengFila)) throw new RangeError(`La fila «${rengFila.slice(0, 40)}» no está marcada como exacta: el modelo no maneja incertidumbre de constantes.`)
  const rengM = /^\s*[A-Za-z][A-Za-z ]*?\s{2,}(\d[\d ]*(?:\.\d[\d ]*)?)(?:\.\.\.)?\s*\(exact\)/.exec(rengFila)
  if (!rengM) throw new RangeError(`No se pudo leer un valor numérico de la fila «${rengFila.slice(0, 60)}».`)
  const rengV = Number(rengM[1]!.replace(/\s+/g, ''))
  if (!Number.isFinite(rengV) || !(rengV > 0)) throw new RangeError('La constante leída no es un número positivo y finito.')
  return rengV
}

const RENG_CAMPOS_FUENTE: ReadonlyArray<keyof RengFuenteE> = ['titulo', 'url', 'consultada', 'lectura', 'alcanceLectura', 'origenDato', 'temperatura', 'convenio', 'actividad', 'presion', 'fuerzaIonica', 'licencia', 'condicionReutilizacion']

export function rengValidarFuenteE(rengF: RengFuenteE): RengFuenteE {
  for (const rengC of RENG_CAMPOS_FUENTE) {
    const rengV = rengF[rengC]
    if (typeof rengV !== 'string' || rengV.trim().length < 3) throw new RangeError(`La fuente «${rengF.id}» no registra «${rengC}»: no puede respaldar ningún valor.`)
  }
  if (!/^https:\/\//.test(rengF.url)) throw new RangeError(`La fuente «${rengF.id}» no tiene un enlace https.`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(rengF.consultada)) throw new RangeError(`La fuente «${rengF.id}» no tiene fecha de consulta.`)
  return rengF
}

export function rengConstruirConstante(rengId: 'F' | 'R', rengFuentes: readonly RengFuenteE[] = RENG_FUENTES_E): RengConstanteCodata {
  const rengD = RENG_FILAS_CODATA[rengId]
  const rengBuscar = (rengFid: string): RengFuenteE => {
    const rengF = rengFuentes.find((rengX) => rengX.id === rengFid)
    if (!rengF) throw new RangeError(`La constante «${rengId}» cita la fuente «${rengFid}», que no está registrada: no se puede cargar.`)
    return rengValidarFuenteE(rengF)
  }
  const rengValor = rengLeerValorCodata(rengD.f2018)
  const rengContraste = rengLeerValorCodata(rengD.f2022)
  if (rengValor !== rengContraste) throw new RangeError(`Las ediciones CODATA 2018 y 2022 abiertas dan valores distintos para «${rengId}»: hay que elegir una y registrarlo.`)
  return { id: rengId, nombre: rengD.nombre, unidad: rengD.unidad, filaLiteral: rengD.f2018, valor: rengValor, fuente: rengBuscar('nist-codata-2018'), contraste: { filaLiteral: rengD.f2022, valor: rengContraste, fuente: rengBuscar('nist-codata-2022') } }
}

export const RENG_FARADAY = rengConstruirConstante('F')
export const RENG_R_GASES = rengConstruirConstante('R')
export const RENG_T_ELECTRO_K = 298.15

const RENG_DEFINICIONES: readonly RengDefinicionPar[] = [
  {
    id: 'zn',
    nombre: 'Zinc',
    oxidante: { formula: 'Zn²⁺', carga: 2, nu: 1 },
    reductor: { formula: 'Zn', estado: 's' },
    n: 2,
    registro: { fuenteId: 'wikipedia-datos-e', filaLiteral: 'Zn | Zn2+ + 2 e– ⇌ [Zn(s)] | −0.7618 | 2 | [10]', referenciaFila: '[10] Vanýsek, P. (2012), «Electrochemical Series», en Haynes (ed.), Handbook of Chemistry and Physics, 93.ª ed., CRC Press' },
    otrasFuentes: [{ fuenteId: 'harvey-16-13', filaLiteral: '| \\(\\text{Zn}^{2+} + 2e^- \\rightleftharpoons \\text{Zn}(s)\\) | –0.7618 |  |', referenciaFila: 'Harvey (compilación; ver la lista de fuentes de la página)' }],
    nota: 'La página también lista Zn(Hg) a −0,7628 V; no se usa.'
  },
  {
    id: 'cu',
    nombre: 'Cobre',
    oxidante: { formula: 'Cu²⁺', carga: 2, nu: 1 },
    reductor: { formula: 'Cu', estado: 's' },
    n: 2,
    registro: { fuenteId: 'wikipedia-datos-e', filaLiteral: 'Cu | Cu2+ + 2 e– ⇌ [Cu(s)] | 0.337 | 2 | [13]', referenciaFila: '[13] Bard, A. J.; Parsons, R.; Jordan, J. (1985), Standard Potentials in Aqueous Solution, CRC Press' },
    otrasFuentes: [{ fuenteId: 'harvey-16-13', filaLiteral: '| \\(\\text{Cu}^{2+} + 2e^- \\rightleftharpoons \\text{Cu}(s)\\) | 0.3419 |  |', referenciaFila: 'Harvey (compilación; ver la lista de fuentes de la página)' }],
    nota: ''
  },
  {
    id: 'fe',
    nombre: 'Hierro',
    oxidante: { formula: 'Fe²⁺', carga: 2, nu: 1 },
    reductor: { formula: 'Fe', estado: 's' },
    n: 2,
    registro: { fuenteId: 'wikipedia-datos-e', filaLiteral: 'Fe | [Fe2+] + 2 e– ⇌ Fe(s) | −0.44 | 2 | [7]', referenciaFila: '[7] Atkins, P. W. (1997), Physical Chemistry, 6.ª ed., W. H. Freeman' },
    otrasFuentes: [{ fuenteId: 'harvey-16-13', filaLiteral: '| \\(\\text{Fe}^{2+} + 2e^- \\rightleftharpoons \\text{Fe}(s)\\) | –0.44 |  |', referenciaFila: 'Harvey (compilación; ver la lista de fuentes de la página)' }],
    nota: 'El valor solo tiene dos cifras decimales en la fuente.'
  },
  {
    id: 'mg',
    nombre: 'Magnesio',
    oxidante: { formula: 'Mg²⁺', carga: 2, nu: 1 },
    reductor: { formula: 'Mg', estado: 's' },
    n: 2,
    registro: { fuenteId: 'wikipedia-datos-e', filaLiteral: 'Mg | Mg2+ + 2 e– ⇌ [Mg(s)] | −2.372 | 2 | [5]', referenciaFila: '[5] Vanýsek, P. (2011), «Electrochemical Series», en Haynes (ed.), CRC Handbook of Chemistry and Physics, 92.ª ed., CRC Press' },
    otrasFuentes: [{ fuenteId: 'harvey-16-13', filaLiteral: '| \\(\\text{Mg}^{2+} + 2e^- \\rightleftharpoons \\text{Mg}(s)\\) | –2.356 |  |', referenciaFila: 'Harvey (compilación; ver la lista de fuentes de la página)' }],
    nota: 'El magnesio metálico reacciona con el agua y los ácidos: el potencial es el de la semirreacción ideal, no el de un electrodo real sumergido sin protección.'
  },
  {
    id: 'al',
    nombre: 'Aluminio',
    oxidante: { formula: 'Al³⁺', carga: 3, nu: 1 },
    reductor: { formula: 'Al', estado: 's' },
    n: 3,
    registro: { fuenteId: 'wikipedia-datos-e', filaLiteral: 'Al | Al3+ + 3 e– ⇌ [Al(s)] | −1.662 | 3 | [1]', referenciaFila: '[1] Lide, D. R. (ed.) (2006), CRC Handbook of Chemistry and Physics, 87.ª ed., CRC Press' },
    otrasFuentes: [{ fuenteId: 'harvey-16-13', filaLiteral: '| \\(\\text{Al}^{3+} + 3e^- \\rightleftharpoons \\text{Al}(s)\\) | –1.676 |  |', referenciaFila: 'Harvey (compilación; ver la lista de fuentes de la página)' }],
    nota: 'El aluminio real se recubre de óxido; el potencial es el de la semirreacción ideal.'
  },
  {
    id: 'h2',
    nombre: 'Hidrógeno (electrodo estándar de hidrógeno)',
    oxidante: { formula: 'H⁺', carga: 1, nu: 2 },
    reductor: { formula: 'H₂', estado: 'g' },
    n: 2,
    registro: { fuenteId: 'wikipedia-datos-e', filaLiteral: 'H | 2 H+ + 2 e– ⇌ H2(g) | 0 | 2', referenciaFila: 'La fila no cita referencia; la página declara el electrodo estándar de hidrógeno como referencia de todos los potenciales' },
    otrasFuentes: [{ fuenteId: 'harvey-16-13', filaLiteral: '| \\(2\\text{H}^+ + 2e^- \\rightleftharpoons \\text{H}\\_2 (g)\\) | 0.00000 |  |', referenciaFila: 'Harvey (compilación; ver la lista de fuentes de la página)' }],
    nota: 'Gas a la presión estándar de la fuente (101,325 kPa); la concentración que se pide es la de H⁺ (actividad ≈ concentración).'
  }
]

export function rengLeerEFilaWikipedia(rengFila: string): { E0: number; n: number; nReaccion: number } {
  const rengCeldas = rengFila.split('|').map((rengC) => rengC.trim())
  if (rengCeldas.length < 4) throw new RangeError(`La fila «${rengFila.slice(0, 60)}» no tiene las columnas esperadas (elemento | semirreacción | E | n | referencia).`)
  const rengE = Number(rengCeldas[2]!.replace(/[−–]/g, '-'))
  const rengN = Number(rengCeldas[3])
  const rengElectrones = /(\d*)\s*e[–-]/.exec(rengCeldas[1]!)
  if (!Number.isFinite(rengE)) throw new RangeError(`No se pudo leer el potencial de la fila «${rengFila.slice(0, 60)}».`)
  if (!Number.isInteger(rengN) || rengN < 1) throw new RangeError(`No se pudo leer el número de electrones de la fila «${rengFila.slice(0, 60)}».`)
  if (!rengElectrones) throw new RangeError(`La semirreacción de la fila «${rengFila.slice(0, 60)}» no muestra electrones.`)
  return { E0: rengE, n: rengN, nReaccion: rengElectrones[1] === '' ? 1 : Number(rengElectrones[1]) }
}

export function rengLeerEFilaContraste(rengFila: string): number {
  const rengTodos = [...rengFila.matchAll(/[+\-−–]?\d+\.\d+/g)]
  const rengUltimo = rengTodos[rengTodos.length - 1]
  if (!rengUltimo) throw new RangeError(`No se pudo leer un potencial de la fila «${rengFila.slice(0, 60)}».`)
  return Number(rengUltimo[0].replace(/[−–]/g, '-'))
}

export const RENG_TOLERANCIA_CONTRASTE_E = 0.05

export function rengConstruirPar(rengD: RengDefinicionPar, rengFuentes: readonly RengFuenteE[] = RENG_FUENTES_E): RengParElectroquimico {
  const rengBuscar = (rengId: string): RengFuenteE => {
    const rengF = rengFuentes.find((rengX) => rengX.id === rengId)
    if (!rengF) throw new RangeError(`El par «${rengD.id}» cita la fuente «${rengId}», que no está registrada: no se puede cargar.`)
    return rengValidarFuenteE(rengF)
  }
  if (!rengD.registro || !rengD.registro.fuenteId || !rengD.registro.filaLiteral) throw new RangeError(`El par «${rengD.id}» no tiene fuente de potencial registrada: no se puede cargar.`)
  const rengFuente = rengBuscar(rengD.registro.fuenteId)
  const rengFila = rengLeerEFilaWikipedia(rengD.registro.filaLiteral)
  if (rengFila.n !== rengFila.nReaccion) throw new RangeError(`El par «${rengD.id}»: el número de electrones de la columna (${rengFila.n}) no coincide con el de la semirreacción (${rengFila.nReaccion}).`)
  if (rengFila.n !== rengD.n || rengD.oxidante.nu * rengD.oxidante.carga !== rengD.n) throw new RangeError(`El par «${rengD.id}» tiene un número de electrones incoherente con su definición.`)
  if (rengD.oxidante.nu < 1 || rengD.oxidante.carga < 1) throw new RangeError(`El par «${rengD.id}» tiene un oxidante mal definido.`)
  const rengOtras = rengD.otrasFuentes.map((rengO) => ({ ...rengO, E0: rengLeerEFilaContraste(rengO.filaLiteral), fuente: rengBuscar(rengO.fuenteId) }))
  for (const rengO of rengOtras) if (Math.abs(rengO.E0 - rengFila.E0) > RENG_TOLERANCIA_CONTRASTE_E) throw new RangeError(`El potencial de «${rengD.id}» (${rengFila.E0} V) difiere más de ${RENG_TOLERANCIA_CONTRASTE_E} V de la otra tabla abierta (${rengO.E0} V): probable error de transcripción.`)
  return { ...rengD, E0: rengFila.E0, fuente: rengFuente, otrasConValor: rengOtras }
}

export const RENG_PARES_ELECTRO: readonly RengParElectroquimico[] = RENG_DEFINICIONES.map((rengD) => rengConstruirPar(rengD))
export const RENG_CODIGOS_PARES: readonly string[] = ['zn', 'cu', 'fe', 'mg', 'al', 'h2']

export const RENG_PARES_DESCARTADOS: ReadonlyArray<{ par: string; motivo: string }> = [
  { par: 'Ni²⁺/Ni y Sn²⁺/Sn', motivo: 'Aparecen en las tablas de Harvey y Toronto, pero su fila no se leyó en la fuente elegida (la única que declara las condiciones); sin una fila literal de esa fuente no entran. (Además, las sales de níquel son sensibilizantes y cancerígenas.)' },
  { par: 'Fe³⁺/Fe²⁺', motivo: 'Es un par con dos iones en disolución: este modelo usa una sola concentración por semicelda.' },
  { par: 'Ag⁺/Ag, Pb²⁺/Pb, Hg²⁺/Hg, Cd²⁺/Cd, Cr₂O₇²⁻/Cr³⁺ (cromo(VI))', motivo: 'Metales o reactivos tóxicos: fuera del alcance de los montajes interactivos.' },
  { par: 'Na⁺/Na, Li⁺/Li, K⁺/K, Ca²⁺/Ca', motivo: 'Metales que reaccionan violentamente con el agua: no se ofrecen como electrodos.' },
  { par: 'Cl₂/Cl⁻, Br₂/Br⁻, F₂/F⁻', motivo: 'Gases o líquidos corrosivos y tóxicos: fuera del alcance.' }
]

export function rengParRegistrado(rengId: string): RengParElectroquimico {
  const rengP = RENG_PARES_ELECTRO.find((rengX) => rengX.id === rengId)
  if (!rengP) throw new RangeError(`El par «${rengId}» no tiene fuente de potencial registrada: no se puede cargar.`)
  return rengP
}
