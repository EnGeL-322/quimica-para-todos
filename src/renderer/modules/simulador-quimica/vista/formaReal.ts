import type { RengTrabajo } from '../estado/trabajo'
import { rengAnalizarFragmento } from '../nucleo/analisisMesa'
import { rengObjetivoConDiagnostico, rengPosicionesFinales } from '../nucleo/geometriaFinal'
import { rengAtomo, rengFijarPosiciones, rengFragmentoDe, type RengMesa, type RengVec3 } from '../nucleo/mesa'
import type { RengOrigenGeometria } from './procedencia'

export type RengPlanFormaReal =
  | { tipo: 'ninguno' }
  | { tipo: 'aviso'; texto: string }
  | { tipo: 'objetivo'; ids: number[]; fin: RengVec3[]; formula: string; origen: 'experimental' | 'calculada' }

export function rengPlanFormaReal(rengM: RengMesa, rengId: number): RengPlanFormaReal {
  const rengIds = rengFragmentoDe(rengM, rengId)
  const rengA = rengAnalizarFragmento(rengM, rengIds)
  if (!rengA.completa || rengA.ionico || !rengA.sustancia) return { tipo: 'ninguno' }
  const { objetivo: rengObjetivo, motivo: rengMotivo } = rengObjetivoConDiagnostico(rengA.sustancia.idExperimental ?? null, rengA.smiles)
  if (!rengObjetivo) return rengMotivo ? { tipo: 'aviso', texto: rengMotivo } : { tipo: 'ninguno' }
  const rengAts = rengIds.map((rengX) => rengAtomo(rengM, rengX)!)
  const rengIdx = new Map(rengIds.map((rengX, rengI) => [rengX, rengI]))
  const rengFin = rengPosicionesFinales({ el: rengAts.map((rengX) => rengX.el), enlaces: rengM.enlaces.filter((rengE) => rengIdx.has(rengE.a)).map((rengE) => [rengIdx.get(rengE.a)!, rengIdx.get(rengE.b)!] as const), pos: rengAts.map((rengX) => [...rengX.p] as [number, number, number]) }, rengObjetivo)
  if (!rengFin) return { tipo: 'ninguno' }
  return { tipo: 'objetivo', ids: rengIds, fin: rengFin.map((rengP) => rengP as RengVec3), formula: rengA.formula, origen: rengObjetivo.origen }
}

export function rengProgramarFormaReal(
  rengT: RengTrabajo,
  rengM: RengMesa,
  rengId: number,
  rengAlTerminar?: (rengR: { ids: number[]; mesa: RengMesa; formula: string; origen: RengOrigenGeometria }) => void,
  rengAlAviso?: (rengTexto: string) => void
): void {
  const rengPlan = rengPlanFormaReal(rengM, rengId)
  if (rengPlan.tipo === 'aviso') rengAlAviso?.(rengPlan.texto)
  if (rengPlan.tipo !== 'objetivo') return
  globalThis.setTimeout(() => {
    if (rengT.obtener().mesa !== rengM) return
    const rengNueva = rengFijarPosiciones(rengM, new Map(rengPlan.ids.map((rengX, rengI) => [rengX, rengPlan.fin[rengI]!])))
    rengT.aplicar((rengE) => (rengE.mesa === rengM ? { ...rengE, mesa: rengNueva } : rengE), false)
    rengAlTerminar?.({ ids: rengPlan.ids, mesa: rengNueva, formula: rengPlan.formula, origen: rengPlan.origen })
  }, 450)
}
