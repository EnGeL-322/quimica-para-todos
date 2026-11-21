import { rengAnalizarFragmento, rengLibresDe, type RengAnalisisFragmento } from '../nucleo/analisisMesa'
import { rengElectronegatividad } from '../nucleo/electronegatividad'
import { RENG_NOMBRE_UNION, type RengTipoUnion } from '../nucleo/enlazar'
import { rengAnalizarFormula } from '../nucleo/formula'
import { rengEstadosOxidacion } from '../nucleo/oxidacion'
import { rengPorSimbolo } from '../../tabla-periodica/data'
import { rengAtomo, type RengMesa } from '../nucleo/mesa'
import { rengAgruparFaltan } from './agrupar'
import { rengFragmentosConId, type RengEstadoTrabajo } from './trabajo'

export interface RengEnlaceDerivado {
  a: number
  b: number
  elA: string
  elB: string
  orden: number
  tipo: RengTipoUnion
  delta: number | null
  etiqueta: string
  descripcion: string
}

export interface RengDerivadoFragmento extends RengAnalisisFragmento {
  id: string
  cargaNeta: number
  enlaces: RengEnlaceDerivado[]
  oxidacion: Array<{ id: number; el: string; ox: number }>
  oxidacionOrigen: 'enlaces' | 'formula' | 'provisional'
  faltan: Array<{ id: number; el: string; libres: number }>
}

const rengComa = (rengX: number): string => rengX.toFixed(2).replace('.', ',')
const RENG_SIMBOLO_ORDEN = ['', '–', '=', '≡']
const RENG_SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const rengSup = (rengQ: number): string => (rengQ === 0 ? '' : `${Math.abs(rengQ) > 1 ? [...String(Math.abs(rengQ))].map((rengD) => RENG_SUP[Number(rengD)]).join('') : ''}${rengQ > 0 ? '⁺' : '⁻'}`)

const rengClave = (rengM: RengMesa, rengIds: readonly number[]): string =>
  JSON.stringify([
    rengIds.map((rengId) => [rengId, rengAtomo(rengM, rengId)!.el, rengAtomo(rengM, rengId)!.carga]),
    rengM.enlaces.filter((rengE) => rengIds.includes(rengE.a)).map((rengE) => [rengE.a, rengE.b, rengE.orden, rengE.tipo, rengE.electrones, rengE.noConfirmado ?? 0]),
    (rengM.estereo ?? []).filter((rengX) => rengX.ids.some((rengId) => rengIds.includes(rengId))).map((rengX) => [rengX.ids, rengX.smiles])
  ])

const RENG_CACHE = new Map<string, RengDerivadoFragmento>()

export function rengDerivarFragmento(rengM: RengMesa, rengIds: number[], rengId: string): RengDerivadoFragmento {
  const rengK = `${rengId}|${rengClave(rengM, rengIds)}`
  const rengHit = RENG_CACHE.get(rengK)
  if (rengHit) return rengHit
  const rengBase = rengAnalizarFragmento(rengM, rengIds)
  const rengEnlaces: RengEnlaceDerivado[] = rengM.enlaces
    .filter((rengE) => rengIds.includes(rengE.a))
    .map((rengE) => {
      const rengGrado = (rengId: number): number => rengM.enlaces.filter((rengX) => rengX.a === rengId || rengX.b === rengId).length
      const [rengIa, rengIb] = rengGrado(rengE.a) !== rengGrado(rengE.b) ? (rengGrado(rengE.a) > rengGrado(rengE.b) ? [rengE.a, rengE.b] : [rengE.b, rengE.a]) : (rengPorSimbolo.get(rengAtomo(rengM, rengE.a)!.el)?.z ?? 0) >= (rengPorSimbolo.get(rengAtomo(rengM, rengE.b)!.el)?.z ?? 0) ? [rengE.a, rengE.b] : [rengE.b, rengE.a]
      const RENG_A = rengAtomo(rengM, rengIa)!
      const RENG_B = rengAtomo(rengM, rengIb)!
      const rengXa = rengElectronegatividad(RENG_A.el)
      const rengXb = rengElectronegatividad(RENG_B.el)
      const rengDelta = rengXa !== null && rengXb !== null ? Math.abs(rengXa - rengXb) : null
      const rengEtiqueta = rengE.tipo === 'ionico' ? `${RENG_A.el}${rengSup(RENG_A.carga)} ${RENG_B.el}${rengSup(RENG_B.carga)}` : rengE.tipo === 'metalico' ? `${RENG_A.el}···${RENG_B.el}` : `${RENG_A.el}${RENG_SIMBOLO_ORDEN[rengE.orden] ?? '–'}${RENG_B.el}`
      let rengDescripcion = RENG_NOMBRE_UNION[rengE.tipo] + (rengE.orden > 1 ? (rengE.orden === 2 ? ' doble' : ' triple') : '')
      if (rengDelta !== null) rengDescripcion += ` · Δχ = ${rengComa(rengDelta)}`
      if (rengE.tipo === 'covalente-polar' && rengXa !== null && rengXb !== null) rengDescripcion += ` · δ⁺ en ${rengXa < rengXb ? RENG_A.el : RENG_B.el}, δ⁻ en ${rengXa < rengXb ? RENG_B.el : RENG_A.el}`
      if (rengE.noConfirmado) rengDescripcion += ' · no confirmado que exista'
      return { a: rengIa, b: rengIb, elA: RENG_A.el, elB: RENG_B.el, orden: rengE.orden, tipo: rengE.tipo, delta: rengDelta, etiqueta: rengEtiqueta, descripcion: rengDescripcion }
    })
  const rengPorEnlaces = rengIds.map((rengAid) => {
    const RENG_A = rengAtomo(rengM, rengAid)!
    let rengOx = RENG_A.carga
    for (const rengE of rengM.enlaces.filter((rengX) => (rengX.a === rengAid || rengX.b === rengAid) && rengX.tipo !== 'ionico' && rengX.tipo !== 'metalico')) {
      const rengOtro = rengAtomo(rengM, rengE.a === rengAid ? rengE.b : rengE.a)!
      const rengYo = rengElectronegatividad(RENG_A.el) ?? 0
      const rengEl = rengElectronegatividad(rengOtro.el) ?? 0
      if (rengEl > rengYo) rengOx += rengE.orden
      else if (rengEl < rengYo) rengOx -= rengE.orden
    }
    return { id: rengAid, el: RENG_A.el, ox: rengOx }
  })
  const rengCargaNeta = rengIds.reduce((rengS, rengAid) => rengS + rengAtomo(rengM, rengAid)!.carga, 0)
  let rengOxidacion = rengPorEnlaces
  let rengOxidacionOrigen: RengDerivadoFragmento['oxidacionOrigen'] = 'enlaces'
  if (!rengBase.completa) {
    const rengF = (() => {
      try {
        return rengEstadosOxidacion({ ...rengAnalizarFormula(rengBase.formula), carga: rengCargaNeta })
      } catch {
        return null
      }
    })()
    rengOxidacion = rengF ? rengPorEnlaces.map((rengX) => ({ ...rengX, ox: rengF.get(rengX.el) ?? rengX.ox })) : rengPorEnlaces
    rengOxidacionOrigen = rengF ? 'formula' : 'provisional'
  }
  const rengFaltan = rengIds.map((rengAid) => ({ id: rengAid, el: rengAtomo(rengM, rengAid)!.el, libres: rengLibresDe(rengM, rengAid) })).filter((rengX) => rengX.libres > 0)
  const rengD: RengDerivadoFragmento = { ...rengBase, id: rengId, cargaNeta: rengCargaNeta, enlaces: rengEnlaces, oxidacion: rengOxidacion, oxidacionOrigen: rengOxidacionOrigen, faltan: rengFaltan }
  if (RENG_CACHE.size > 400) RENG_CACHE.clear()
  RENG_CACHE.set(rengK, rengD)
  return rengD
}

export const rengDerivarTodos = (rengE: RengEstadoTrabajo): RengDerivadoFragmento[] => rengFragmentosConId(rengE.mesa).map((rengF) => rengDerivarFragmento(rengE.mesa, rengF.ids, rengF.id))

export function rengDerivarActivo(rengE: RengEstadoTrabajo): RengDerivadoFragmento | null {
  const rengF = rengFragmentosConId(rengE.mesa).find((rengX) => rengX.id === rengE.activo)
  return rengF ? rengDerivarFragmento(rengE.mesa, rengF.ids, rengF.id) : null
}

export function rengExplicarIncompleto(rengD: RengDerivadoFragmento): string | null {
  if (rengD.completa || rengD.ids.length < 2) return null
  if (rengD.formula === 'OH' && rengD.cargaNeta === 0) return 'OH: al oxígeno le falta un enlace. Es el radical hidroxilo, o el ion hidróxido OH⁻ si le añades la carga.'
  return `${rengD.formula}: ${rengAgruparFaltan(rengD.faltan) || rengD.estado}`
}
