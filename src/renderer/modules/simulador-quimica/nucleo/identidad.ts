import type { RengAnalisisFragmento } from './analisisMesa'
import { rengSmilesUnidadFormula } from './fragmentoSustancia'
import { rengAnalizarFormula, rengFormulaHill } from './formula'
import { rengDesdeSmiles } from './molecula'
import { rengInterpretarSustancia, type RengSustancia } from './sustancia'

export interface RengIdentidad {
  clave: string
  base: 'estructura' | 'composicion'
  estereo: 'definida' | 'parcial' | 'indefinida' | 'no-aplica' | 'desconocida'
  completa: boolean
  nota?: string
}

const rengMcd = (rengA: number, rengB: number): number => (rengB === 0 ? rengA : rengMcd(rengB, rengA % rengB))

function rengClaveDeComponentes(rengComponentes: readonly string[]): string {
  const rengCuenta = new Map<string, number>()
  for (const rengC of rengComponentes) rengCuenta.set(rengC, (rengCuenta.get(rengC) ?? 0) + 1)
  const rengG = [...rengCuenta.values()].reduce((rengA, rengB) => rengMcd(rengA, rengB))
  const rengPartes = [...rengCuenta.entries()].map(([rengId, rengN]) => [rengId, rengN / rengG] as const).sort(([rengA], [rengB]) => (rengA < rengB ? -1 : rengA > rengB ? 1 : 0))
  if (rengPartes.length === 1 && rengPartes[0]![1] === 1) return `g:${rengPartes[0]![0]}`
  return `m:${rengPartes.map(([rengId, rengN]) => `${rengN}*${rengId}`).join('+')}`
}

function rengComposicion(rengS: RengSustancia): string {
  try {
    return rengFormulaHill(rengAnalizarFormula(rengS.formula.replace(/\^.*$/, '')).atomos)
  } catch {
    return rengS.formula
  }
}

export function rengIdentidadDeSustancia(rengS: RengSustancia): RengIdentidad {
  if (rengS.grafo) return { clave: rengClaveDeComponentes(rengS.grafo.componentes), base: 'estructura', estereo: rengS.grafo.estereo, completa: true }
  const rengUf = rengS.inorganico ? rengSmilesUnidadFormula(rengS.inorganico) : null
  if (rengUf) {
    try {
      const rengG = rengDesdeSmiles(rengUf)
      if (rengG.carga === rengS.carga) return { clave: rengClaveDeComponentes(rengG.componentes), base: 'estructura', estereo: rengG.estereo, completa: true }
    } catch {
    }
  }
  return { clave: `f:${rengComposicion(rengS)}|${rengS.carga}`, base: 'composicion', estereo: 'desconocida', completa: true }
}

export interface RengSustanciaIdentificada {
  identidad: RengIdentidad
  formula: string
  nombre: string
  sustancia: RengSustancia
}

export const rengIdentificada = (rengS: RengSustancia): RengSustanciaIdentificada => rengConIdentidad(rengS, rengIdentidadDeSustancia(rengS))
const rengConIdentidad = (rengS: RengSustancia, rengIdentidad: RengIdentidad): RengSustanciaIdentificada => ({ identidad: rengIdentidad, formula: rengS.formula, nombre: rengS.nombre, sustancia: rengS })

export type RengFragmentoIdentificable = Pick<RengAnalisisFragmento, 'ids' | 'completa' | 'sustancia' | 'carga' | 'estereo'>

export function rengIdentidadDeFragmento(rengF: RengFragmentoIdentificable): { identidad: RengIdentidad; s: RengSustancia } | { motivo: string } {
  if (!(rengF.completa || rengF.ids.length === 1) || !rengF.sustancia) return { motivo: 'Fragmento incompleto o sin interpretar: sin identidad.' }
  if (rengF.sustancia.carga !== rengF.carga) return { motivo: `La sustancia interpretada tiene carga ${rengF.sustancia.carga} y el fragmento ${rengF.carga}: no se puede identificar sin ambigüedad.` }
  const rengIdentidad = rengIdentidadDeSustancia(rengF.sustancia)
  if (rengF.estereo === 'perdida')
    return {
      s: rengF.sustancia,
      identidad: { ...rengIdentidad, completa: false, nota: 'La estereoquímica de la sustancia añadida se perdió al editar el fragmento: su identidad ya no incluye la configuración (R/S, E/Z).' }
    }
  return { s: rengF.sustancia, identidad: rengIdentidad }
}

export function rengIdentificadaDeFragmento(rengF: RengFragmentoIdentificable): RengSustanciaIdentificada | null {
  const rengR = rengIdentidadDeFragmento(rengF)
  return 'motivo' in rengR ? null : rengConIdentidad(rengR.s, rengR.identidad)
}

export type RengIdentificacion =
  | { tipo: 'ok'; s: RengSustanciaIdentificada }
  | { tipo: 'ambigua'; formula: string; candidatas: string[]; motivo: string }
  | { tipo: 'invalida'; motivo: string }

export function rengIdentificar(rengTexto: string): RengIdentificacion {
  const rengR = rengInterpretarSustancia(rengTexto)
  if (rengR.tipo === 'ok') return { tipo: 'ok', s: rengIdentificada(rengR.sustancia) }
  if (rengR.tipo === 'isomeros') {
    const rengCandidatas = rengR.opciones.map((rengO) => rengO.nombre)
    return {
      tipo: 'ambigua',
      formula: rengR.formula,
      candidatas: rengCandidatas,
      motivo: `Falta identificar la estructura: la fórmula ${rengR.formula} no dice cómo están unidos los átomos y puede corresponder a varias sustancias${rengCandidatas.length ? ` (por ejemplo: ${rengCandidatas.join(', ')})` : ''}. Indica el nombre, la fórmula semidesarrollada o el SMILES.`
    }
  }
  return { tipo: 'invalida', motivo: rengR.motivo }
}

export function rengTextoEquivalente(rengX: RengSustanciaIdentificada): string | null {
  const rengQ = rengX.sustancia.carga
  const rengConCarga = rengQ === 0 ? rengX.formula : `${rengX.formula.replace(/\^.*$/, '')}^${Math.abs(rengQ) > 1 ? Math.abs(rengQ) : ''}${rengQ > 0 ? '+' : '-'}`
  const rengCandidatos = [rengX.nombre, rengX.sustancia.smiles, rengConCarga].filter((rengC): rengC is string => !!rengC)
  return rengCandidatos.find((rengC) => rengClaveIdentidad(rengC) === rengX.identidad.clave) ?? null
}

export const rengClaveIdentidad = (rengTexto: string): string | null => {
  const rengI = rengIdentificar(rengTexto)
  return rengI.tipo === 'ok' ? rengI.s.identidad.clave : null
}
