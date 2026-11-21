import { rengCompletarConH } from '../nucleo/analisisMesa'
import { rengElectronegatividad } from '../nucleo/electronegatividad'
import { rengFragmentoDe as rengFragmentoDeSustancia, RENG_MAX_ATOMOS_MESA } from '../nucleo/fragmentoSustancia'
import { rengAnadirFragmento, rengAtomo, rengBorrarAtomos, rengEscalar, rengFragmentoDe, rengSumar, type RengMesa, type RengVec3 } from '../nucleo/mesa'
import { rengInterpretarSustancia } from '../nucleo/sustancia'
import { rengDerivarActivo } from './derivados'
import { rengFragmentosConId, rengIdFragmento, type RengEstadoTrabajo } from './trabajo'

export type RengResultado = { ok: true; estado: RengEstadoTrabajo; nota?: string } | { ok: false; error: string } | { ok: false; isomeros: Array<{ nombre: string }>; nota: string }

const rengCentroDe = (rengM: RengMesa, rengIds: readonly number[]): RengVec3 => rengEscalar(rengIds.reduce<RengVec3>((rengS, rengId) => rengSumar(rengS, rengAtomo(rengM, rengId)!.p), [0, 0, 0]), 1 / Math.max(1, rengIds.length))

export function rengPuntoLibre(rengM: RengMesa): RengVec3 {
  const rengOcupado = (rengP: RengVec3): boolean => rengM.atomos.some((rengA) => Math.hypot(rengA.p[0] - rengP[0], rengA.p[1] - rengP[1], rengA.p[2] - rengP[2]) < 2.6)
  for (let rengK = 0; rengK < 60; rengK++) {
    const rengP: RengVec3 = rengK === 0 ? [0, 0, 0] : [Math.cos(rengK * 2.4) * (1.5 + rengK * 0.5), Math.sin(rengK * 2.4) * (1.5 + rengK * 0.5), 0]
    if (!rengOcupado(rengP)) return rengP
  }
  return [0, 0, 0]
}

function rengConstruir(rengTexto: string, rengEleccion?: string) {
  const rengR = rengInterpretarSustancia(rengEleccion ?? rengTexto)
  if (rengR.tipo === 'isomeros') return { tipo: 'isomeros' as const, opciones: rengR.opciones, nota: rengR.nota }
  if (rengR.tipo === 'error') return { tipo: 'error' as const, error: rengR.motivo }
  const rengF = rengFragmentoDeSustancia(rengR.sustancia)
  if (!rengF.ok) return { tipo: 'error' as const, error: rengF.motivo }
  return { tipo: 'ok' as const, f: rengF.f, s: rengR.sustancia }
}

export function rengReemplazarActivo(rengE: RengEstadoTrabajo, rengTexto: string, rengEleccion?: string): RengResultado {
  if (!rengTexto.trim()) return { ok: false, error: 'Escribe una fórmula, un nombre o un SMILES.' }
  const rengC = rengConstruir(rengTexto, rengEleccion)
  if (rengC.tipo === 'isomeros') return { ok: false, isomeros: rengC.opciones, nota: rengC.nota }
  if (rengC.tipo === 'error') return { ok: false, error: rengC.error }
  const rengActivo = rengFragmentosConId(rengE.mesa).find((rengF) => rengF.id === rengE.activo)
  const rengBase = rengActivo ? rengBorrarAtomos(rengE.mesa, new Set(rengActivo.ids)) : rengE.mesa
  if (rengBase.atomos.length + rengC.f.atomos.length > RENG_MAX_ATOMOS_MESA) return { ok: false, error: `No cabe: la mesa admite hasta ${RENG_MAX_ATOMOS_MESA} átomos.` }
  const rengR = rengAnadirFragmento(rengBase, rengC.f.atomos, rengC.f.enlaces, rengActivo ? rengCentroDe(rengE.mesa, rengActivo.ids) : rengPuntoLibre(rengBase), rengC.f.estereo)
  return { ok: true, estado: { ...rengE, mesa: rengR.mesa, activo: rengIdFragmento(rengFragmentoDe(rengR.mesa, rengR.ids[0]!)), seleccion: { atomos: [], enlace: null } }, nota: rengC.f.nota }
}

export function rengAnadirSustancia(rengE: RengEstadoTrabajo, rengTexto: string, rengEleccion?: string): RengResultado {
  const rengC = rengConstruir(rengTexto, rengEleccion)
  if (rengC.tipo === 'isomeros') return { ok: false, isomeros: rengC.opciones, nota: rengC.nota }
  if (rengC.tipo === 'error') return { ok: false, error: rengC.error }
  if (rengE.mesa.atomos.length + rengC.f.atomos.length > RENG_MAX_ATOMOS_MESA) return { ok: false, error: `No cabe: la mesa admite hasta ${RENG_MAX_ATOMOS_MESA} átomos.` }
  const rengR = rengAnadirFragmento(rengE.mesa, rengC.f.atomos, rengC.f.enlaces, rengPuntoLibre(rengE.mesa), rengC.f.estereo)
  return { ok: true, estado: { ...rengE, mesa: rengR.mesa, activo: rengIdFragmento(rengFragmentoDe(rengR.mesa, rengR.ids[0]!)) }, nota: rengC.f.nota }
}

const RENG_SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
export const rengFormulaConCarga = (rengFormula: string, rengCarga: number): string => (rengCarga === 0 ? rengFormula : `${rengFormula}^${Math.abs(rengCarga) > 1 ? Math.abs(rengCarga) : ''}${rengCarga > 0 ? '+' : '-'}`)
export const rengTextoCarga = (rengQ: number): string => (rengQ === 0 ? '' : `${Math.abs(rengQ) > 1 ? [...String(Math.abs(rengQ))].map((rengD) => RENG_SUP[Number(rengD)]).join('') : ''}${rengQ > 0 ? '⁺' : '⁻'}`)

export function rengCambiarSubindice(rengE: RengEstadoTrabajo, rengEl: string, rengDelta: number): RengResultado {
  const rengD = rengDerivarActivo(rengE)
  if (!rengD) return { ok: false, error: 'No hay ningún fragmento activo.' }
  const rengCuenta = new Map<string, number>()
  for (const rengId of rengD.ids) rengCuenta.set(rengAtomo(rengE.mesa, rengId)!.el, (rengCuenta.get(rengAtomo(rengE.mesa, rengId)!.el) ?? 0) + 1)
  const rengN = (rengCuenta.get(rengEl) ?? 0) + rengDelta
  if (rengN < 0) return { ok: false, error: `No hay ${rengEl} que quitar.` }
  if (rengN === 0) rengCuenta.delete(rengEl)
  else rengCuenta.set(rengEl, rengN)
  if (rengCuenta.size === 0) return { ok: false, error: 'Quedaría vacío.' }
  const rengOrden = [...rengD.formula.matchAll(/[A-Z][a-z]?/g)].map((rengX) => rengX[0])
  const rengEls = [...new Set([...rengOrden.filter((rengX) => rengCuenta.has(rengX)), ...rengCuenta.keys()])]
  const rengFormula = rengEls.map((rengX) => `${rengX}${rengCuenta.get(rengX)! > 1 ? rengCuenta.get(rengX) : ''}`).join('')
  const rengR = rengReemplazarActivo(rengE, rengFormulaConCarga(rengFormula, rengD.cargaNeta))
  const rengCambio = rengDelta > 0 ? `Con un ${rengEl} más` : `Con un ${rengEl} menos`
  if (!rengR.ok && 'error' in rengR) return { ok: false, error: `${rengCambio} quedaría ${rengFormulaConCarga(rengFormula, rengD.cargaNeta)}, y no se puede montar: ${rengR.error} La mesa no ha cambiado.` }
  return rengR
}

export function rengCambiarCarga(rengE: RengEstadoTrabajo, rengDelta: 1 | -1): RengResultado {
  const rengD = rengDerivarActivo(rengE)
  if (!rengD) return { ok: false, error: 'No hay ningún fragmento activo.' }
  const rengCandidatos = (rengD.faltan.length ? rengD.faltan.map((rengF) => rengF.id) : rengD.ids).map((rengId) => rengAtomo(rengE.mesa, rengId)!)
  const rengOrden = [...rengCandidatos].sort((rengA, rengB) => (rengElectronegatividad(rengB.el) ?? 0) - (rengElectronegatividad(rengA.el) ?? 0))
  const rengElegido = rengDelta < 0 ? rengOrden[0] : rengOrden[rengOrden.length - 1]
  if (!rengElegido) return { ok: false, error: 'No hay átomos.' }
  const rengMesa = { ...rengE.mesa, atomos: rengE.mesa.atomos.map((rengA) => (rengA.id === rengElegido.id ? { ...rengA, carga: rengA.carga + rengDelta } : rengA)) }
  return { ok: true, estado: { ...rengE, mesa: rengMesa } }
}

export function rengCompletarActivo(rengE: RengEstadoTrabajo): RengResultado {
  const rengD = rengDerivarActivo(rengE)
  if (!rengD) return { ok: false, error: 'No hay ningún fragmento activo.' }
  if (rengD.libres === 0) return { ok: false, error: 'No le faltan enlaces.' }
  return { ok: true, estado: { ...rengE, mesa: rengCompletarConH(rengE.mesa, rengD.ids) } }
}

export const rengSeleccionarEnlace = (rengE: RengEstadoTrabajo, rengA: number, rengB: number): RengEstadoTrabajo => ({ ...rengE, seleccion: { atomos: [rengA, rengB], enlace: [rengA, rengB] }, activo: rengIdFragmento(rengFragmentoDe(rengE.mesa, rengA)) })

export function rengSeleccionarGrupo(rengE: RengEstadoTrabajo, rengPares: ReadonlyArray<readonly [number, number]>): RengEstadoTrabajo {
  const rengPrimero = rengPares[0]
  if (!rengPrimero) return rengE
  const rengAtomos = [...new Set(rengPares.flat())]
  return { ...rengE, seleccion: { atomos: rengAtomos, enlace: [rengPrimero[0], rengPrimero[1]] }, activo: rengIdFragmento(rengFragmentoDe(rengE.mesa, rengPrimero[0])) }
}

export function rengLlevarProductos(rengE: RengEstadoTrabajo, rengEntradas: ReadonlyArray<{ entrada: string; formula: string }>): RengResultado {
  let rengEstado = rengE
  for (const rengP of rengEntradas) {
    const rengR = rengAnadirSustancia(rengEstado, rengP.entrada)
    if (!rengR.ok) return { ok: false, error: `${rengP.formula}: ${'error' in rengR ? rengR.error : rengR.nota}` }
    rengEstado = rengR.estado
  }
  return { ok: true, estado: { ...rengEstado, productos: rengEntradas.map((rengP) => rengP.formula) } }
}
