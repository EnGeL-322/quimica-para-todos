import { rengSemillaValidaN1 } from './aleatorio'
import { RENG_MAX_SEMILLAS_N1, RENG_SEMILLA_MAXIMA_N1 } from './tipos'

export const RENG_CLAVE_PRACTICAS_N1 = 'ciencia.practicas-n1.simulador-quimica'
export const RENG_VERSION_PRACTICAS_N1 = 1
export const RENG_TAMANO_MAXIMO_PROGRESO_N1 = 400_000

export interface RengAvanceN1 {
  semilla: number
  resueltas: number[]
  revisadas: number[]
  intentos: number
}

export interface RengProgresoN1 {
  version: 1
  practicas: Record<string, RengAvanceN1>
  ultima: string | null
}

export interface RengAlmacenN1 {
  getItem(rengClave: string): string | null
  setItem(rengClave: string, rengValor: string): void
}

export const rengAvanceN1Inicial = (): RengAvanceN1 => ({ semilla: 0, resueltas: [], revisadas: [], intentos: 0 })
export const rengProgresoN1Vacio = (): RengProgresoN1 => ({ version: 1, practicas: {}, ultima: null })

const rengObjeto = (rengV: unknown): rengV is Record<string, unknown> => typeof rengV === 'object' && rengV !== null && !Array.isArray(rengV)
const rengListaSemillas = (rengV: unknown): number[] | null => (Array.isArray(rengV) && rengV.length <= RENG_MAX_SEMILLAS_N1 && rengV.every(rengSemillaValidaN1) ? [...new Set(rengV as number[])] : null)

export function rengLeerProgresoN1(rengAlmacen: Pick<RengAlmacenN1, 'getItem'> | null, rengEsPractica: (rengId: string) => boolean): RengProgresoN1 {
  const rengOut = rengProgresoN1Vacio()
  try {
    const rengTexto = rengAlmacen?.getItem(RENG_CLAVE_PRACTICAS_N1)
    if (!rengTexto || rengTexto.length > RENG_TAMANO_MAXIMO_PROGRESO_N1) return rengOut
    const rengBruto: unknown = JSON.parse(rengTexto)
    if (!rengObjeto(rengBruto) || rengBruto['version'] !== RENG_VERSION_PRACTICAS_N1 || !rengObjeto(rengBruto['practicas'])) return rengOut
    for (const [rengId, rengA] of Object.entries(rengBruto['practicas'])) {
      if (!rengEsPractica(rengId) || !rengObjeto(rengA)) continue
      const rengResueltas = rengListaSemillas(rengA['resueltas'])
      const rengRevisadas = rengListaSemillas(rengA['revisadas'])
      const rengIntentos = rengA['intentos']
      if (!rengSemillaValidaN1(rengA['semilla']) || !rengResueltas || !rengRevisadas || typeof rengIntentos !== 'number' || !Number.isSafeInteger(rengIntentos) || rengIntentos < 0) continue
      rengOut.practicas[rengId] = { semilla: rengA['semilla'], resueltas: rengResueltas, revisadas: rengRevisadas.filter((rengS) => !rengResueltas.includes(rengS)), intentos: rengIntentos }
    }
    const rengU = rengBruto['ultima']
    if (typeof rengU === 'string' && rengEsPractica(rengU)) rengOut.ultima = rengU
  } catch {
    return rengProgresoN1Vacio()
  }
  return rengOut
}

export function rengGuardarProgresoN1(rengAlmacen: RengAlmacenN1 | null, rengProgreso: RengProgresoN1): boolean {
  try {
    if (!rengAlmacen) return false
    rengAlmacen.setItem(RENG_CLAVE_PRACTICAS_N1, JSON.stringify(rengProgreso))
    return true
  } catch {
    return false
  }
}

export const rengAvanceN1 = (rengProgreso: RengProgresoN1, rengId: string): RengAvanceN1 => rengProgreso.practicas[rengId] ?? rengAvanceN1Inicial()

const rengAcotar = (rengLista: number[]): number[] => rengLista.slice(-RENG_MAX_SEMILLAS_N1)

export function rengRegistrarIntentoN1(rengAvance: RengAvanceN1, rengCorrecta: boolean): RengAvanceN1 {
  if (rengAvance.resueltas.includes(rengAvance.semilla) || rengAvance.revisadas.includes(rengAvance.semilla)) return rengAvance
  return { ...rengAvance, intentos: rengAvance.intentos + 1, resueltas: rengCorrecta ? rengAcotar([...rengAvance.resueltas, rengAvance.semilla]) : rengAvance.resueltas }
}

export function rengMarcarRevisadaN1(rengAvance: RengAvanceN1): RengAvanceN1 {
  if (rengAvance.resueltas.includes(rengAvance.semilla) || rengAvance.revisadas.includes(rengAvance.semilla)) return rengAvance
  return { ...rengAvance, revisadas: rengAcotar([...rengAvance.revisadas, rengAvance.semilla]) }
}

export function rengOtraSemillaN1(rengAvance: RengAvanceN1): RengAvanceN1 {
  const rengUsadas = new Set([...rengAvance.resueltas, ...rengAvance.revisadas])
  for (let rengI = 1; rengI <= RENG_SEMILLA_MAXIMA_N1 + 1; rengI++) {
    const rengCand = (rengAvance.semilla + rengI) % (RENG_SEMILLA_MAXIMA_N1 + 1)
    if (!rengUsadas.has(rengCand)) return { ...rengAvance, semilla: rengCand }
  }
  return rengAvance
}

export function rengActualizarAvanceN1(rengProgreso: RengProgresoN1, rengId: string, rengAvance: RengAvanceN1): RengProgresoN1 {
  return { version: 1, practicas: { ...rengProgreso.practicas, [rengId]: rengAvance }, ultima: rengId }
}

export const rengResumenN1 = (rengAvance: RengAvanceN1 | undefined): { resueltas: number; revisadas: number; resuelta: boolean } => ({ resueltas: rengAvance?.resueltas.length ?? 0, revisadas: rengAvance?.revisadas.length ?? 0, resuelta: (rengAvance?.resueltas.length ?? 0) > 0 })
