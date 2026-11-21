import { rengPorSimbolo } from '../../tabla-periodica/data'
import { RENG_ESTADOS_COMUNES } from './compuestosBinarios'
import { rengClase } from './constructor'
import { rengElectronegatividad } from './electronegatividad'
import { rengExistencia, type RengExistencia } from './compuestosConocidos'
import { rengAnalizarFormula, rengDividirCarga, rengFormulaHill } from './formula'
import {
  RENG_ADJETIVO_ACIDO,
  RENG_ADJETIVO_METAL,
  RENG_ANIONES,
  RENG_CATIONES_POLIATOMICOS,
  RENG_FUENTE_IUPAC,
  RENG_FUENTE_TRADICIONAL,
  RENG_HIDRUROS_NO_METALICOS,
  type RengAnion
} from './iones'
import { rengEstadosOxidacion } from './oxidacion'

export type RengFuncion =
  | 'oxido-basico'
  | 'oxido-acido'
  | 'oxido-neutro'
  | 'oxido-mixto'
  | 'peroxido'
  | 'hidruro-metalico'
  | 'hidruro-no-metalico'
  | 'hidracido'
  | 'sal-binaria'
  | 'binario-no-metalico'
  | 'hidroxido'
  | 'oxoacido'
  | 'oxisal'
  | 'sal-acida'
  | 'sal-hidratada'
  | 'cation'
  | 'anion'
  | 'oxoanion'

export const RENG_NOMBRE_FUNCION: Record<RengFuncion, string> = {
  'oxido-basico': 'Óxido básico (metal + oxígeno)',
  'oxido-acido': 'Óxido ácido (no metal + oxígeno)',
  'oxido-neutro': 'Óxido neutro (no forma ácido con agua)',
  'oxido-mixto': 'Óxido mixto',
  peroxido: 'Peróxido (contiene O₂²⁻)',
  'hidruro-metalico': 'Hidruro metálico',
  'hidruro-no-metalico': 'Hidruro no metálico',
  hidracido: 'Hidrácido (H + no metal)',
  'sal-binaria': 'Sal binaria (metal + no metal)',
  'binario-no-metalico': 'Compuesto binario de no metales',
  hidroxido: 'Hidróxido (contiene OH⁻)',
  oxoacido: 'Oxoácido (H + no metal + O)',
  oxisal: 'Oxisal (catión + oxoanión)',
  'sal-acida': 'Sal ácida (con H en el anión)',
  'sal-hidratada': 'Sal hidratada',
  cation: 'Catión',
  anion: 'Anión',
  oxoanion: 'Oxoanión'
}

export type RengNomenclatura = 'sistematica' | 'stock' | 'tradicional'
export const RENG_NOMBRE_NOMENCLATURA: Record<RengNomenclatura, string> = { sistematica: 'Sistemática', stock: 'Stock', tradicional: 'Tradicional' }

export interface RengCation {
  unidad: string
  carga: number
  el: string
  ox: number
  tipo: 'metal' | 'no-metal' | 'hidrogeno' | 'poliatomico'
  stock: string
  adjetivo: string | null
  enComposicion: string
  ambiguo: boolean
}

export interface RengNombres {
  sistematica: string | null
  stock: string | null
  tradicional: string | null
  comunes: string[]
  recomendadas: RengNomenclatura[]
  principal: string
  notas: string[]
}

export interface RengCompuesto {
  formula: string
  funcion: RengFuncion
  cation: RengCation | null
  anion: RengAnion | null
  nCat: number
  nAn: number
  agua: number
  carga: number
  nombres: RengNombres
  existe: RengExistencia | null
}

const RENG_PREF = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona', 'deca']
const RENG_MULT = ['', '', 'bis', 'tris', 'tetrakis', 'pentakis', 'hexakis', 'heptakis', 'octakis']
const RENG_ROMANO = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
const rengMcd = (rengA: number, rengB: number): number => (rengB === 0 ? Math.abs(rengA) : rengMcd(rengB, rengA % rengB))
const rengNombreEl = (rengS: string): string => (rengPorSimbolo.get(rengS)?.nombre ?? rengS).toLowerCase()

function rengJuntar(rengPrefijo: string, rengRaiz: string): string {
  if (rengPrefijo === 'mono' && rengRaiz.startsWith('óxido')) return `mon${rengRaiz}`
  return rengPrefijo + rengRaiz
}

export function rengNormalizarNombre(rengS: string): string {
  return rengS
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[−–]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/\s*([([])\s*/g, '$1')
    .replace(/\s*([)\]])/g, '$1')
    .trim()
}

export function rengEstadosPositivos(rengEl: string): number[] {
  const rengS = new Set<number>([...(RENG_ESTADOS_COMUNES[rengEl] ?? []).filter((rengX) => rengX > 0)])
  for (const rengK of Object.keys(RENG_ADJETIVO_METAL[rengEl] ?? {})) rengS.add(Number(rengK))
  for (const rengK of Object.keys(RENG_ADJETIVO_ACIDO[rengEl] ?? {})) rengS.add(Number(rengK))
  return [...rengS].sort((rengA, rengB) => rengA - rengB)
}

const rengCargaTexto = (rengQ: number): string => `${Math.abs(rengQ)}${rengQ > 0 ? '+' : '−'}`

function rengCationElemento(rengEl: string, rengOx: number): RengCation {
  const rengMetal = rengClase(rengEl) === 'metal'
  const rengAmbiguo = rengEstadosPositivos(rengEl).length > 1
  const rengNombre = rengNombreEl(rengEl)
  return {
    unidad: rengEl,
    carga: rengOx,
    el: rengEl,
    ox: rengOx,
    tipo: rengMetal ? 'metal' : 'no-metal',
    stock: rengAmbiguo ? `${rengNombre}(${RENG_ROMANO[rengOx]})` : rengNombre,
    adjetivo: rengMetal ? (RENG_ADJETIVO_METAL[rengEl]?.[rengOx] ?? null) : null,
    enComposicion: rengNombre,
    ambiguo: rengAmbiguo
  }
}

const RENG_HIDROGENO: RengCation = { unidad: 'H', carga: 1, el: 'H', ox: 1, tipo: 'hidrogeno', stock: 'hidrógeno', adjetivo: null, enComposicion: 'hidrógeno', ambiguo: false }

function rengCationesTodos(): RengCation[] {
  const rengOut: RengCation[] = []
  for (const rengEl of Object.keys(RENG_ESTADOS_COMUNES)) {
    if (rengEl === 'H' || !rengPorSimbolo.has(rengEl)) continue
    for (const rengOx of (RENG_ESTADOS_COMUNES[rengEl] ?? []).filter((rengX) => rengX > 0)) rengOut.push(rengCationElemento(rengEl, rengOx))
  }
  rengOut.push(rengCationElemento('O', 2))
  for (const rengP of RENG_CATIONES_POLIATOMICOS) {
    if (rengP.unidad === 'H3O') continue
    rengOut.push({ unidad: rengP.unidad, carga: rengP.carga, el: rengP.el, ox: rengP.ox, tipo: 'poliatomico', stock: rengP.stock, adjetivo: rengP.adjetivo, enComposicion: rengP.enComposicion, ambiguo: false })
  }
  return rengOut
}

const RENG_ALCALINOS_TERREOS = new Set(['alcalino', 'alcalinoterreo'])
const rengCategoria = (rengEl: string): string => rengPorSimbolo.get(rengEl)?.categoria ?? ''

function rengCompatible(rengC: RengCation, rengA: RengAnion): boolean {
  if (rengC.tipo === 'hidrogeno') {
    if (rengA.tipo === 'oxoanion') return true
    if (rengA.tipo === 'peroxido') return true
    if (rengA.unidad === 'O') return true
    return rengA.tipo === 'monoatomico' && ['F', 'Cl', 'Br', 'I', 'S', 'Se', 'Te'].includes(rengA.unidad)
  }
  if (rengC.tipo === 'poliatomico') {
    if (rengC.unidad === 'NH4') return !['O', 'O2', 'H', 'OH', 'N', 'P'].includes(rengA.unidad)
    if (rengC.unidad === 'Hg2') return (rengA.tipo === 'monoatomico' && ['F', 'Cl', 'Br', 'I'].includes(rengA.unidad)) || rengA.tipo === 'oxoanion'
    return false
  }
  if (rengC.tipo === 'no-metal') {
    const rengBinario = rengA.unidad === 'O' || (rengA.tipo === 'monoatomico' && ['F', 'Cl', 'Br', 'I', 'S'].includes(rengA.unidad))
    if (!rengBinario || rengC.el === rengA.central) return false
    const rengXc = rengElectronegatividad(rengC.el)
    const rengXa = rengElectronegatividad(rengA.central)
    return rengXc !== null && rengXa !== null && rengXc < rengXa
  }
  if (rengA.unidad === 'O') return true
  if (rengC.ox > 4) return false
  if (rengA.tipo === 'peroxido') return RENG_ALCALINOS_TERREOS.has(rengCategoria(rengC.el))
  if (rengA.unidad === 'H' || rengA.unidad === 'N' || rengA.unidad === 'P') return RENG_ALCALINOS_TERREOS.has(rengCategoria(rengC.el)) || rengC.el === 'Al'
  return true
}

const rengEsPoli = (rengA: RengAnion): boolean => rengA.tipo === 'oxoanion' || rengA.tipo === 'hidrogenoanion' || rengA.tipo === 'hidroxido'

export function rengEscribirFormula(rengC: RengCation, rengA: RengAnion, rengNCat: number, rengNAn: number): string {
  const rengCat = rengC.tipo === 'poliatomico' && rengNCat > 1 && rengC.unidad !== 'Hg2' ? `(${rengC.unidad})${rengNCat}` : `${rengC.unidad}${rengNCat > 1 ? rengNCat : ''}`
  const rengAn = rengEsPoli(rengA) && rengNAn > 1 ? `(${rengA.unidad})${rengNAn}` : rengA.tipo === 'peroxido' ? (rengNAn > 1 ? `(O2)${rengNAn}` : 'O2') : `${rengA.unidad}${rengNAn > 1 ? rengNAn : ''}`
  return rengCat + rengAn
}

function rengFuncionDe(rengC: RengCation, rengA: RengAnion): RengFuncion {
  if (rengC.tipo === 'hidrogeno') {
    if (rengA.unidad === 'O') return 'hidruro-no-metalico'
    if (rengA.tipo === 'peroxido') return 'peroxido'
    if (rengA.tipo === 'oxoanion') return 'oxoacido'
    return 'hidracido'
  }
  if (rengC.tipo === 'no-metal') return rengA.unidad === 'O' ? 'oxido-acido' : 'binario-no-metalico'
  if (rengA.unidad === 'O') return rengC.ox >= 5 ? 'oxido-acido' : 'oxido-basico'
  if (rengA.tipo === 'peroxido') return 'peroxido'
  if (rengA.unidad === 'H') return 'hidruro-metalico'
  if (rengA.tipo === 'hidroxido') return 'hidroxido'
  if (rengA.tipo === 'oxoanion') return 'oxisal'
  if (rengA.tipo === 'hidrogenoanion') return 'sal-acida'
  return 'sal-binaria'
}

function rengEncerrar(rengS: string): string {
  return rengS.includes('(') ? `[${rengS}]` : `(${rengS})`
}

function rengNombreSistematico(rengC: RengCation, rengA: RengAnion, rengNCat: number, rengNAn: number, rengF: RengFuncion): string | null {
  const rengPrefCat = rengNCat > 1 ? RENG_PREF[rengNCat]! : ''
  const rengDeCat = `de ${rengPrefCat}${rengC.enComposicion}`
  if (rengF === 'oxoacido') return rengA.sistematica ? `${rengNCat > 1 ? RENG_PREF[rengNCat] : ''}hidrogeno${rengEncerrar(rengA.sistematica)}` : null
  if (rengA.tipo === 'peroxido') return `${rengJuntar(RENG_PREF[2 * rengNAn]!, 'óxido')} ${rengDeCat}`
  if (rengA.tipo === 'oxoanion' || rengA.tipo === 'hidrogenoanion') {
    if (!rengA.sistematica) return null
    return rengNAn === 1 ? `${rengA.sistematica} ${rengDeCat}` : `${RENG_MULT[rengNAn]}${rengEncerrar(rengA.sistematica)} ${rengDeCat}`
  }
  const rengConMono = rengC.ambiguo
  return `${rengJuntar(rengNAn === 1 ? (rengConMono ? 'mono' : '') : RENG_PREF[rengNAn]!, rengA.sistematica ?? rengA.sal)} ${rengDeCat}`
}

function rengNombreStock(rengC: RengCation, rengA: RengAnion, rengF: RengFuncion): string | null {
  if (rengF === 'oxoacido' || rengF === 'hidruro-no-metalico') return null
  return `${rengA.sal} de ${rengC.stock}`
}

function rengNombreTradicional(rengC: RengCation, rengA: RengAnion, rengF: RengFuncion): string | null {
  if (rengF === 'hidracido' || rengF === 'oxoacido') return rengA.acido ?? null
  if (rengF === 'oxido-acido') {
    const rengAdj = RENG_ADJETIVO_ACIDO[rengC.el]?.[rengC.ox]
    return rengAdj ? `anhídrido ${rengAdj}` : null
  }
  if (rengF === 'binario-no-metalico' || rengF === 'hidruro-no-metalico' || rengC.tipo === 'hidrogeno') return null
  if (!rengC.adjetivo) return null
  const rengSal = rengA.tipo === 'hidrogenoanion' ? rengA.salTradicional : rengA.sal
  return rengSal ? `${rengSal} ${rengC.adjetivo}` : null
}

const RENG_NOTA_TRAD_SAL = 'La IUPAC 2005 ya no recomienda las terminaciones -oso/-ico para el metal; se mantienen en el uso tradicional.'

function rengRecomendaciones(rengF: RengFuncion, rengN: { sistematica: string | null; stock: string | null; tradicional: string | null }, rengComunes: string[]): Pick<RengNombres, 'recomendadas' | 'principal' | 'notas'> {
  const rengNotas: string[] = []
  let rengRec: RengNomenclatura[]
  let rengPrincipal: string | null
  switch (rengF) {
    case 'oxido-neutro':
      rengRec = ['sistematica', 'stock']
      rengPrincipal = rengN.sistematica
      rengNotas.push('Es un óxido neutro: con agua no forma un ácido, así que no es un «anhídrido».')
      break
    case 'oxido-acido':
    case 'binario-no-metalico':
      rengRec = ['sistematica', 'stock']
      rengPrincipal = rengN.sistematica
      if (rengN.tradicional) rengNotas.push('El nombre «anhídrido» es tradicional; la IUPAC 2005 no lo recomienda.')
      break
    case 'hidracido':
      rengRec = ['sistematica', 'stock']
      rengPrincipal = rengN.sistematica
      rengNotas.push(`«${rengN.tradicional}» es el nombre de su disolución en agua.`)
      break
    case 'oxoacido':
      rengRec = ['tradicional', 'sistematica']
      rengPrincipal = rengN.tradicional
      rengNotas.push('La IUPAC 2005 acepta los nombres tradicionales de los oxoácidos. El número de Stock no se usa en ellos.')
      break
    case 'hidruro-no-metalico':
      rengRec = ['sistematica']
      rengPrincipal = rengComunes[0] ?? rengN.sistematica
      rengNotas.push('La IUPAC 2005 acepta los nombres comunes «agua» y «amoniaco» y los de hidruro progenitor (azano, metano, fosfano, silano…).')
      break
    default:
      rengRec = ['stock', 'sistematica']
      rengPrincipal = rengN.stock ?? rengN.sistematica
      if (rengN.tradicional) rengNotas.push(RENG_NOTA_TRAD_SAL)
  }
  return { recomendadas: rengRec.filter((rengR) => rengN[rengR] !== null), principal: rengPrincipal ?? rengN.sistematica ?? rengN.stock ?? rengN.tradicional ?? '', notas: rengNotas }
}

const RENG_OXIDOS_NEUTROS = new Set(['CO', 'NO', 'N2O'])

function rengCrearCompuesto(rengC: RengCation, rengA: RengAnion): RengCompuesto {
  const rengG = rengMcd(rengC.carga, Math.abs(rengA.carga))
  const rengNCat = Math.abs(rengA.carga) / rengG
  const rengNAn = rengC.carga / rengG
  const rengFormula = rengEscribirFormula(rengC, rengA, rengNCat, rengNAn)
  const rengF: RengFuncion = RENG_OXIDOS_NEUTROS.has(rengFormula) ? 'oxido-neutro' : rengFuncionDe(rengC, rengA)
  const rengSistematica = rengNombreSistematico(rengC, rengA, rengNCat, rengNAn, rengF)
  const rengStock = rengNombreStock(rengC, rengA, rengF)
  const rengTradicional = rengNombreTradicional(rengC, rengA, rengF)
  const rengComunes: string[] = []
  if (rengFormula === 'H2O') rengComunes.push('agua', 'oxidano')
  if (rengFormula === 'H2O2') rengComunes.push('agua oxigenada')
  if (rengA.tipo === 'hidrogenoanion' && rengA.salTradicional && rengC.tipo !== 'hidrogeno') rengComunes.push(`${rengA.salTradicional} de ${rengC.stock}`)
  const rengN = { sistematica: rengSistematica, stock: rengStock, tradicional: rengTradicional }
  return { formula: rengFormula, funcion: rengF, cation: rengC, anion: rengA, nCat: rengNCat, nAn: rengNAn, agua: 0, carga: 0, nombres: { ...rengN, comunes: rengComunes, ...rengRecomendaciones(rengF, rengN, rengComunes) }, existe: rengExistencia(rengFormula) }
}

function rengHidruroNoMetalico(rengH: (typeof RENG_HIDRUROS_NO_METALICOS)[number]): RengCompuesto {
  const rengSistematica = `${RENG_PREF[rengH.n]}hidruro de ${rengNombreEl(rengH.el)}`
  const rengComunes = [...(rengH.comun ? [rengH.comun] : []), rengH.progenitor]
  const rengN = { sistematica: rengSistematica, stock: null, tradicional: null }
  return { formula: rengH.formula, funcion: 'hidruro-no-metalico', cation: null, anion: null, nCat: 0, nAn: 0, agua: 0, carga: 0, nombres: { ...rengN, comunes: rengComunes, ...rengRecomendaciones('hidruro-no-metalico', rengN, rengComunes) }, existe: rengExistencia(rengH.formula) }
}

function rengIonCation(rengC: RengCation): RengCompuesto {
  const rengSist = rengC.tipo === 'poliatomico' ? RENG_CATIONES_POLIATOMICOS.find((rengP) => rengP.unidad === rengC.unidad)!.sistematica : `${rengNombreEl(rengC.el)}(${rengCargaTexto(rengC.carga)})`
  const rengTrad = rengC.tipo === 'poliatomico' ? RENG_CATIONES_POLIATOMICOS.find((rengP) => rengP.unidad === rengC.unidad)!.tradicional : rengC.adjetivo
  const rengN = { sistematica: rengSist, stock: `ion ${rengC.stock}`, tradicional: rengTrad ? `ion ${rengTrad}` : null }
  const rengFormula = `${rengC.unidad}^${rengC.carga === 1 ? '' : rengC.carga}+`
  return {
    formula: rengFormula,
    funcion: 'cation',
    cation: rengC,
    anion: null,
    nCat: 1,
    nAn: 0,
    agua: 0,
    carga: rengC.carga,
    nombres: { ...rengN, comunes: [], recomendadas: ['stock', 'sistematica'], principal: rengN.stock, notas: rengC.adjetivo ? [RENG_NOTA_TRAD_SAL] : [] },
    existe: null
  }
}

function rengIonAnion(rengA: RengAnion): RengCompuesto {
  const rengOxo = rengA.tipo === 'oxoanion' || rengA.tipo === 'hidrogenoanion'
  const rengSistBase = rengA.tipo === 'peroxido' ? 'dióxido' : rengA.sistematica
  const rengN = { sistematica: rengSistBase ? `${rengSistBase}(${rengCargaTexto(rengA.carga)})` : null, stock: null, tradicional: `ion ${rengA.tipo === 'hidrogenoanion' && rengA.salTradicional ? rengA.salTradicional : rengA.sal}` }
  const rengFormula = `${rengA.unidad}^${Math.abs(rengA.carga) === 1 ? '' : Math.abs(rengA.carga)}-`
  return {
    formula: rengFormula,
    funcion: rengOxo ? 'oxoanion' : 'anion',
    cation: null,
    anion: rengA,
    nCat: 0,
    nAn: 1,
    agua: 0,
    carga: rengA.carga,
    nombres: { ...rengN, comunes: [`ion ${rengA.sal}`], recomendadas: ['tradicional', 'sistematica'], principal: `ion ${rengA.sal}`, notas: [] },
    existe: null
  }
}

const rengClaveComposicion = (rengAtomos: Map<string, number>, rengCarga: number): string => `${rengFormulaHill(rengAtomos)}|${rengCarga}`

interface RengIndices {
  catalogo: RengCompuesto[]
  porComposicion: Map<string, RengCompuesto[]>
  porNombre: Map<string, RengCompuesto | null>
}

let RENG_INDICES: RengIndices | null = null

function rengIndices(): RengIndices {
  if (RENG_INDICES) return RENG_INDICES
  const rengCatalogo: RengCompuesto[] = []
  const rengCationes = rengCationesTodos()
  for (const rengA of RENG_ANIONES) {
    for (const rengC of [RENG_HIDROGENO, ...rengCationes]) if (rengCompatible(rengC, rengA)) rengCatalogo.push(rengCrearCompuesto(rengC, rengA))
    rengCatalogo.push(rengIonAnion(rengA))
  }
  for (const rengC of rengCationes) rengCatalogo.push(rengIonCation(rengC))
  const rengH3o = RENG_CATIONES_POLIATOMICOS.find((rengP) => rengP.unidad === 'H3O')!
  rengCatalogo.push(rengIonCation({ unidad: 'H3O', carga: 1, el: 'O', ox: -2, tipo: 'poliatomico', stock: rengH3o.stock, adjetivo: null, enComposicion: rengH3o.enComposicion, ambiguo: false }))
  for (const rengH of RENG_HIDRUROS_NO_METALICOS) rengCatalogo.push(rengHidruroNoMetalico(rengH))
  const rengOxido = RENG_ANIONES.find((rengA) => rengA.unidad === 'O')!
  for (const rengOx of [2, 1]) rengCatalogo.push(rengCrearCompuesto(rengCationElemento('N', rengOx), rengOxido))

  const rengPorComposicion = new Map<string, RengCompuesto[]>()
  const rengPorNombre = new Map<string, RengCompuesto | null>()
  for (const rengK of rengCatalogo) {
    const rengF = rengAnalizarFormula(rengK.formula)
    const rengClave = rengClaveComposicion(rengF.atomos, rengF.carga)
    rengPorComposicion.set(rengClave, [...(rengPorComposicion.get(rengClave) ?? []), rengK])
    const rengNombres = [rengK.nombres.sistematica, rengK.nombres.stock, rengK.nombres.tradicional, ...rengK.nombres.comunes].filter((rengX): rengX is string => Boolean(rengX))
    for (const rengNom of rengNombres) {
      for (const rengVariante of [rengNom, rengNom.replace(/^ion /, '')]) {
        const rengNn = rengNormalizarNombre(rengVariante)
        const rengPrevio = rengPorNombre.get(rengNn)
        if (rengPrevio === undefined) rengPorNombre.set(rengNn, rengK)
        else if (rengPrevio !== null && rengPrevio.formula !== rengK.formula) rengPorNombre.set(rengNn, null)
      }
    }
  }
  RENG_INDICES = { catalogo: rengCatalogo, porComposicion: rengPorComposicion, porNombre: rengPorNombre }
  return RENG_INDICES
}

export const rengCatalogo = (): RengCompuesto[] => rengIndices().catalogo

function rengHidratar(rengBase: RengCompuesto, rengN: number): RengCompuesto {
  const rengSuf = ` ${RENG_PREF[rengN]}hidratado`
  const rengNom = (rengS: string | null): string | null => (rengS ? rengS + rengSuf : null)
  const rengNombres: RengNombres = {
    sistematica: rengNom(rengBase.nombres.sistematica),
    stock: rengNom(rengBase.nombres.stock),
    tradicional: rengNom(rengBase.nombres.tradicional),
    comunes: [],
    recomendadas: rengBase.nombres.recomendadas,
    principal: rengBase.nombres.principal + rengSuf,
    notas: [...rengBase.nombres.notas, `La IUPAC 2005 también lo escribe con la proporción de agua, p. ej. «${rengBase.nombres.stock ?? rengBase.nombres.sistematica}—agua (1/${rengN})».`]
  }
  const rengFormula = `${rengBase.formula}·${rengN === 1 ? '' : rengN}H2O`
  return { ...rengBase, formula: rengFormula, funcion: 'sal-hidratada', agua: rengN, nombres: rengNombres, existe: rengExistencia(rengFormula) }
}

const RENG_ROMANOS_TXT: Record<string, number> = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8 }
const rengLista = (rengXs: number[]): string => rengXs.map((rengX) => `+${rengX}`).join(', ')

export function rengNombrar(rengTexto: string): RengCompuesto {
  const { cuerpo: rengCuerpo, carga: rengCarga } = rengDividirCarga(rengTexto)
  rengAnalizarFormula(rengTexto)
  const rengPartes = rengCuerpo.split('·')
  let rengAgua = 0
  for (const rengP of rengPartes.slice(1)) {
    const rengM = /^(\d*)H2O$/.exec(rengP)
    if (!rengM) throw new Error(`Solo sé nombrar hidratos con agua (·nH₂O); «${rengP}» no lo es.`)
    rengAgua += rengM[1] ? Number(rengM[1]) : 1
  }
  const rengPrincipal = rengAnalizarFormula(rengPartes[0]! + (rengCarga === 0 ? '' : `^${Math.abs(rengCarga)}${rengCarga > 0 ? '+' : '-'}`))
  const rengCandidatos = rengIndices().porComposicion.get(rengClaveComposicion(rengPrincipal.atomos, rengCarga))
  if (rengCandidatos?.length) {
    const rengBase = rengCandidatos[0]!
    if (rengAgua > 0) {
      if (!['oxisal', 'sal-binaria', 'sal-acida'].includes(rengBase.funcion)) throw new Error('Solo las sales forman hidratos en la app.')
      return rengHidratar(rengBase, rengAgua)
    }
    return rengBase
  }
  throw new Error(rengDiagnosticarFormula(rengPrincipal.atomos))
}

function rengDiagnosticarFormula(rengAtomos: Map<string, number>): string {
  const rengEls = [...rengAtomos.keys()]
  const rengNoble = rengEls.find((rengE) => rengClase(rengE) === 'gas-noble' && !(RENG_ESTADOS_COMUNES[rengE]?.length))
  if (rengNoble) return `El ${rengNombreEl(rengNoble)} es un gas noble con la capa de valencia completa: no forma compuestos como este.`
  if (rengEls.length === 2 && rengEls.includes('O')) {
    const rengM = rengEls.find((rengE) => rengE !== 'O')!
    const rengOx = rengEstadosOxidacion({ texto: '', atomos: rengAtomos, carga: 0, electron: false })?.get(rengM)
    if (rengOx !== undefined && !Number.isInteger(rengOx)) {
      return `Óxido mixto: el número de oxidación medio del ${rengNombreEl(rengM)} sale ${rengOx.toFixed(2).replace('.', ',')}, que no es entero. Contiene ${rengNombreEl(rengM)} en dos estados a la vez (p. ej. Fe₃O₄ = FeO·Fe₂O₃). No tiene un nombre de Stock ni tradicional único.`
    }
  }
  if (rengEls.length === 2) {
    const [rengA, rengB] = rengEls as [string, string]
    const rengXa = rengElectronegatividad(rengA) ?? 0
    const rengXb = rengElectronegatividad(rengB) ?? 0
    const [rengPos, rengNeg] = rengXa <= rengXb ? [rengA, rengB] : [rengB, rengA]
    const rengNegativo = Math.min(...(RENG_ESTADOS_COMUNES[rengNeg] ?? [0]))
    if (rengNegativo < 0) {
      const rengV = (-rengNegativo * rengAtomos.get(rengNeg)!) / rengAtomos.get(rengPos)!
      const rengEstados = rengEstadosPositivos(rengPos)
      if (Number.isInteger(rengV) && !rengEstados.includes(rengV)) {
        return rengEstados.length
          ? `El ${rengNombreEl(rengPos)} no tiene número de oxidación +${rengV} (lo exigiría ${rengNeg} con −${-rengNegativo}). Sus estados positivos habituales son ${rengLista(rengEstados)}.`
          : rengPos === 'O'
            ? 'El oxígeno solo tiene número de oxidación positivo con flúor (OF₂, O₂F₂); esta composición no figura en la lista de la app.'
            : `El ${rengNombreEl(rengPos)} no forma compuestos con número de oxidación positivo en las tablas de la app.`
      }
    }
  }
  return 'No sé nombrar esta fórmula: no encaja en ninguna de las funciones que conoce la app (óxidos, hidruros, sales, hidróxidos, oxoácidos, oxisales y sus iones).'
}

export function rengNombreOxidoMixto(rengTexto: string): string | null {
  const rengF = rengAnalizarFormula(rengTexto)
  const rengEls = [...rengF.atomos.keys()]
  if (rengEls.length !== 2 || !rengEls.includes('O')) return null
  const rengM = rengEls.find((rengE) => rengE !== 'O')!
  if (rengClase(rengM) !== 'metal') return null
  const rengOx = rengEstadosOxidacion(rengF)?.get(rengM)
  if (rengOx === undefined || Number.isInteger(rengOx)) return null
  return `${rengJuntar(RENG_PREF[rengF.atomos.get('O')!]!, 'óxido')} de ${RENG_PREF[rengF.atomos.get(rengM)!]}${rengNombreEl(rengM)}`
}

export function rengFormularDesdeNombre(rengNombre: string): RengCompuesto {
  const rengN = rengNormalizarNombre(rengNombre)
  if (!rengN) throw new Error('Escribe un nombre.')
  const rengHid = /^(.*) (mono|di|tri|tetra|penta|hexa|hepta|octa|nona|deca)hidrat(?:ado|o)$/.exec(rengN)
  const rengBase = rengHid ? rengHid[1]! : rengN
  const rengEncontrado = rengIndices().porNombre.get(rengBase)
  if (rengEncontrado === null) throw new Error(`El nombre «${rengNombre}» es ambiguo: corresponde a más de una fórmula.`)
  if (rengEncontrado) return rengHid ? rengHidratar(rengEncontrado, RENG_PREF.indexOf(rengHid[2]!)) : rengEncontrado
  throw new Error(rengDiagnosticarNombre(rengBase, rengNombre))
}

function rengDiagnosticarNombre(rengN: string, rengOriginal: string): string {
  const rengElementos = [...rengPorSimbolo.values()].map((rengE) => ({ s: rengE.simbolo, nom: rengNormalizarNombre(rengE.nombre), bonito: rengE.nombre.toLowerCase() })).sort((rengA, rengB) => rengB.nom.length - rengA.nom.length)
  const rengRomano = /\(([ivx]+)\)/.exec(rengN)
  for (const rengE of rengElementos) {
    const rengRe = new RegExp(`(^|[ (])${rengE.nom}(\\(|$| )`)
    if (!rengRe.test(rengN)) continue
    if (rengClase(rengE.s) === 'gas-noble' && !(RENG_ESTADOS_COMUNES[rengE.s]?.length)) return `El ${rengE.bonito} es un gas noble con la capa de valencia completa: no forma óxidos, sales ni otros compuestos así.`
    if (rengRomano) {
      const rengV = RENG_ROMANOS_TXT[rengRomano[1]!]
      const rengPos = rengEstadosPositivos(rengE.s)
      if (rengV !== undefined && !rengPos.includes(rengV)) return `El ${rengE.bonito} no tiene número de oxidación +${rengV}. Sus estados positivos habituales son ${rengLista(rengPos) || 'ninguno'}.`
    } else if (/ de /.test(rengN) && rengEstadosPositivos(rengE.s).length > 1 && rengClase(rengE.s) === 'metal' && rengN.endsWith(rengE.nom)) {
      return `Falta el número de oxidación: el ${rengE.bonito} puede actuar con ${rengLista(rengEstadosPositivos(rengE.s))}. Escríbelo entre paréntesis, p. ej. «${rengOriginal.trim()}(${RENG_ROMANO[rengEstadosPositivos(rengE.s)[0]!]})».`
    }
  }
  return `No reconozco «${rengOriginal}» como un nombre que la app sepa formular. Revisa la ortografía o prueba con otra nomenclatura.`
}

export function rengPareceFormula(rengTexto: string): boolean {
  const rengT = rengTexto.trim()
  return /^[A-Z([]/.test(rengT) && !/[a-záéíóúñ]{3,}\s/i.test(rengT) && !/\s[a-záéíóú]/.test(rengT)
}

export interface RengInterpretacion {
  via: 'formula' | 'nombre'
  compuesto: RengCompuesto
}

export function rengInterpretar(rengTexto: string): RengInterpretacion {
  const rengT = rengTexto.trim()
  if (!rengT) throw new Error('Escribe una fórmula o un nombre.')
  if (rengPareceFormula(rengT)) {
    const rengMixto = (() => {
      try {
        return rengNombreOxidoMixto(rengT)
      } catch {
        return null
      }
    })()
    if (rengMixto) return { via: 'formula', compuesto: rengOxidoMixto(rengT, rengMixto) }
    try {
      return { via: 'formula', compuesto: rengNombrar(rengT) }
    } catch (rengE) {
      try {
        return { via: 'nombre', compuesto: rengFormularDesdeNombre(rengT) }
      } catch {
        throw rengE
      }
    }
  }
  return { via: 'nombre', compuesto: rengFormularDesdeNombre(rengT) }
}

function rengOxidoMixto(rengFormula: string, rengSistematica: string): RengCompuesto {
  const rengNombres: RengNombres = {
    sistematica: rengSistematica,
    stock: null,
    tradicional: null,
    comunes: [],
    recomendadas: ['sistematica'],
    principal: rengSistematica,
    notas: [rengDiagnosticarFormula(rengAnalizarFormula(rengFormula).atomos), 'Solo se da el nombre de composición, que no exige asignar un número de oxidación a cada átomo.']
  }
  return { formula: rengFormula, funcion: 'oxido-mixto', cation: null, anion: null, nCat: 0, nAn: 0, agua: 0, carga: 0, nombres: rengNombres, existe: rengExistencia(rengFormula) }
}

export function rengEstadosDe(rengK: RengCompuesto): Array<{ el: string; ox: number }> {
  const rengOut = new Map<string, number>()
  if (rengK.cation) {
    rengOut.set(rengK.cation.el, rengK.cation.ox)
    if (rengK.cation.unidad === 'NH4' || rengK.cation.unidad === 'H3O') rengOut.set('H', 1)
  }
  if (rengK.anion) {
    const rengA = rengK.anion
    if (rengA.tipo === 'peroxido') rengOut.set('O', -1)
    else if (rengA.unidad === 'H') rengOut.set('H', -1)
    else {
      if (rengA.unidad !== 'O' && rengA.tipo !== 'hidroxido') rengOut.set(rengA.central, rengA.ox)
      if (rengA.unidad.includes('O')) rengOut.set('O', -2)
      if (rengA.tipo === 'hidroxido' || rengA.tipo === 'hidrogenoanion') rengOut.set('H', 1)
    }
  }
  if (!rengK.cation && !rengK.anion) {
    const rengE = rengEstadosOxidacion(rengAnalizarFormula(rengK.formula.split('·')[0]!))
    if (rengE) for (const [rengEl, rengV] of rengE) rengOut.set(rengEl, rengV)
  }
  if (rengK.agua > 0) {
    rengOut.set('H', 1)
    rengOut.set('O', rengOut.get('O') ?? -2)
  }
  return [...rengOut.entries()].map(([rengEl, rengOx]) => ({ el: rengEl, ox: rengOx }))
}

export const RENG_FUENTES_NOMENCLATURA = [RENG_FUENTE_IUPAC, RENG_FUENTE_TRADICIONAL]
