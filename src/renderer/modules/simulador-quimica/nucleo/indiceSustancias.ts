import { RENG_ELEMENTOS } from '../../tabla-periodica/data'
import { RENG_BIBLIOTECA } from '../datos/biblioteca'
import { RENG_COTIDIANOS } from '../datos/cotidianos'
import { rengCatalogo, rengNormalizarNombre } from './nomenclatura'
import { RENG_COMUNES } from './organica'
import { rengInterpretarSustancia } from './sustancia'

export type RengTipoIndice = 'elemento' | 'compuesto' | 'organico' | 'ion' | 'comun'

export const RENG_NOMBRE_TIPO_INDICE: Record<RengTipoIndice, string> = { elemento: 'elemento', compuesto: 'compuesto', organico: 'orgánico', ion: 'ion', comun: 'nombre común' }

export interface RengEntradaIndice {
  id: string
  nombre: string
  otros: string[]
  formula: string | null
  calcular: boolean
  nota?: string
  tipo: RengTipoIndice
  entrada: string
  destacada: boolean
  claves: string[]
}

export interface RengResultadoIndice {
  e: RengEntradaIndice
  nivel: number
  coincide: string
}

const rengNorm = (rengS: string): string => rengNormalizarNombre(rengS)
const rengNormFormula = (rengF: string): string => rengF.replace(/\^.*$/, '').replace(/[·.*]/g, '').toLowerCase()

const RENG_CARBONO_INORGANICO = new Set(['dióxido de carbono', 'monóxido de carbono', 'ácido carbónico', 'cianuro de hidrógeno'])

let RENG_INDICE: RengEntradaIndice[] | null = null

export function rengIndiceSustancias(): RengEntradaIndice[] {
  if (RENG_INDICE) return RENG_INDICE
  const rengOut: RengEntradaIndice[] = []
  const rengVistos = new Set<string>()
  const rengAdd = (rengE: Omit<RengEntradaIndice, 'claves'>, rengPermitirMismaEntrada = false): void => {
    const rengK = rengE.entrada
    if (!rengPermitirMismaEntrada) {
      if (rengVistos.has(rengK)) return
      rengVistos.add(rengK)
    }
    const rengClaves = [...new Set([rengE.nombre, ...rengE.otros].map(rengNorm).concat(rengE.formula ? [rengNormFormula(rengE.formula)] : []))]
    rengOut.push({ ...rengE, claves: rengClaves })
  }
  for (const rengC of RENG_COTIDIANOS)
    rengAdd({ id: `com:${rengC.nombre}`, nombre: rengC.nombre, otros: rengC.otros, formula: null, calcular: true, tipo: 'comun', entrada: rengC.entrada, destacada: true, nota: rengC.nota }, true)
  for (const rengB of RENG_BIBLIOTECA) {
    const rengEsSmiles = rengB.smiles !== null && rengB.entrada === rengB.smiles
    const rengOrganico = rengB.smiles !== null && /C(?![laorsu])|c/.test(rengB.smiles) && !RENG_CARBONO_INORGANICO.has(rengB.nombre)
    const rengTipo: RengTipoIndice = rengB.categoria === 'elementos' ? 'elemento' : rengOrganico ? 'organico' : 'compuesto'
    rengAdd({ id: `bib:${rengB.nombre}`, nombre: rengB.nombre, otros: rengB.otros ?? [], formula: rengEsSmiles ? null : rengB.entrada, calcular: rengEsSmiles, tipo: rengTipo, entrada: rengB.entrada, destacada: true })
  }
  for (const rengEl of RENG_ELEMENTOS) rengAdd({ id: `el:${rengEl.simbolo}`, nombre: rengEl.nombre.toLowerCase(), otros: [rengEl.simbolo], formula: rengEl.simbolo, calcular: false, tipo: 'elemento', entrada: rengEl.simbolo, destacada: true })
  for (const rengC of rengCatalogo()) {
    const rengIon = rengC.carga !== 0
    if (!rengIon && rengC.existe?.estado !== 'confirmado' && rengC.existe?.estado !== 'disolucion') continue
    const rengN = rengC.nombres
    const rengOtros = [rengN.sistematica, rengN.stock, rengN.tradicional, ...rengN.comunes].filter((rengX): rengX is string => !!rengX && rengX !== rengN.principal)
    rengAdd({ id: `cat:${rengC.formula}`, nombre: rengN.principal, otros: rengOtros, formula: rengC.formula, calcular: false, tipo: rengIon ? 'ion' : 'compuesto', entrada: rengC.formula, destacada: false })
  }
  for (const rengO of RENG_COMUNES) {
    const [rengNombre, ...rengOtros] = rengO.nombres
    if (rengNombre) rengAdd({ id: `org:${rengO.smiles}`, nombre: rengNombre, otros: rengOtros, formula: null, calcular: true, tipo: 'organico', entrada: rengNombre, destacada: false })
  }
  RENG_INDICE = rengOut
  return rengOut
}

const RENG_FORMULAS = new Map<string, string | null>()

export function rengFormulaVisible(rengE: RengEntradaIndice): string | null {
  if (!rengE.calcular) return rengE.formula
  if (RENG_FORMULAS.has(rengE.id)) return RENG_FORMULAS.get(rengE.id) ?? null
  const rengR = rengInterpretarSustancia(rengE.entrada)
  const rengF = rengR.tipo === 'ok' ? (rengR.sustancia.grafo && !rengR.sustancia.inorganico ? rengR.sustancia.grafo.formula : rengR.sustancia.formula) : null
  RENG_FORMULAS.set(rengE.id, rengF)
  return rengF
}

function rengUnaErrata(rengA: string, rengB: string): boolean {
  if (rengA === rengB) return true
  if (Math.abs(rengA.length - rengB.length) > 1) return false
  let rengI = 0
  let rengJ = 0
  let rengDif = 0
  while (rengI < rengA.length && rengJ < rengB.length) {
    if (rengA[rengI] === rengB[rengJ]) {
      rengI++
      rengJ++
      continue
    }
    if (++rengDif > 1) return false
    if (rengA.length > rengB.length) rengI++
    else if (rengB.length > rengA.length) rengJ++
    else {
      rengI++
      rengJ++
    }
  }
  return rengDif + (rengA.length - rengI) + (rengB.length - rengJ) <= 1
}

const rengPalabras = (rengK: string): string[] => rengK.split(/[\s()[\]\-,]+/).filter(Boolean)

function rengNivelDe(rengK: string, rengQ: string): number {
  if (rengK === rengQ) return 5
  if (rengK.startsWith(rengQ)) return 4
  if (rengPalabras(rengK).some((rengW) => rengW.startsWith(rengQ))) return 3
  if (rengK.includes(rengQ)) return 2
  if (rengQ.length >= 4 && (rengUnaErrata(rengK, rengQ) || rengPalabras(rengK).some((rengW) => rengW.length >= 4 && rengUnaErrata(rengW, rengQ)))) return 1
  return 0
}

export function rengBuscarSustancias(rengConsulta: string, rengMax = 10): RengResultadoIndice[] {
  const rengQ = rengNorm(rengConsulta)
  if (!rengQ) return []
  const rengQf = rengQ.replace(/\s/g, '')
  const rengR: Array<RengResultadoIndice & { i: number }> = []
  rengIndiceSustancias().forEach((rengE, rengI) => {
    let rengMejor = 0
    let rengCoincide = rengE.nombre
    const rengNombres = [rengE.nombre, ...rengE.otros]
    rengE.claves.forEach((rengK) => {
      const rengN = rengNivelDe(rengK, rengK.includes(' ') ? rengQ : rengQf)
      if (rengN > rengMejor) {
        rengMejor = rengN
        rengCoincide = rengNombres.find((rengX) => rengNorm(rengX) === rengK) ?? rengE.nombre
      }
    })
    if (rengMejor > 0) rengR.push({ e: rengE, nivel: rengE.destacada && rengMejor < 5 ? Math.min(4.5, rengMejor + 1) : rengMejor, coincide: rengCoincide, i: rengI })
  })
  rengR.sort((rengA, rengB) => rengB.nivel - rengA.nivel || Number(rengB.e.destacada) - Number(rengA.e.destacada) || rengA.e.nombre.length - rengB.e.nombre.length || rengA.i - rengB.i)
  return rengR.slice(0, rengMax).map(({ e: rengE, nivel: rengNivel, coincide: rengCoincide }) => ({ e: rengE, nivel: rengNivel, coincide: rengCoincide }))
}

export const rengContarSustancias = (rengConsulta: string): number => rengBuscarSustancias(rengConsulta, Infinity).length
