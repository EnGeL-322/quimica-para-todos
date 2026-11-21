import { rengNormalizarNombre } from './nomenclatura'

export const RENG_CLAVE_HISTORIAL = 'quimica.historial'
export const RENG_MAX_HISTORIAL = 50

export interface RengEntradaHistorial {
  id: string
  entrada: string
  nombre: string
  tipo: string
  fecha: string
}

export interface RengAlmacenHistorial {
  getItem: (rengK: string) => string | null
  setItem: (rengK: string, rengV: string) => void
}

let rengContador = 0
const rengNuevoId = (rengAhora: Date): string => `h${rengAhora.getTime().toString(36)}${(rengContador++).toString(36)}`
const rengMismo = (rengA: string, rengB: string): boolean => rengNormalizarNombre(rengA) === rengNormalizarNombre(rengB)

const rengValida = (rengX: unknown): rengX is RengEntradaHistorial => {
  const rengE = rengX as RengEntradaHistorial
  return typeof rengE?.id === 'string' && typeof rengE.entrada === 'string' && typeof rengE.nombre === 'string' && typeof rengE.tipo === 'string' && typeof rengE.fecha === 'string'
}

export function rengMigrarHistorial(rengCrudo: unknown, rengAhora = new Date(0)): RengEntradaHistorial[] {
  if (!Array.isArray(rengCrudo)) return []
  const rengOut: RengEntradaHistorial[] = []
  for (const rengX of rengCrudo) {
    if (typeof rengX === 'string' && rengX.trim()) rengOut.push({ id: rengNuevoId(rengAhora), entrada: rengX, nombre: rengX, tipo: 'anterior', fecha: rengAhora.toISOString() })
    else if (rengValida(rengX)) rengOut.push(rengX)
  }
  return rengQuitarDuplicados(rengOut).slice(0, RENG_MAX_HISTORIAL)
}

const rengQuitarDuplicados = (rengL: RengEntradaHistorial[]): RengEntradaHistorial[] => rengL.filter((rengE, rengI) => rengL.findIndex((rengO) => rengMismo(rengO.entrada, rengE.entrada)) === rengI)

export function rengAnadirHistorial(rengL: readonly RengEntradaHistorial[], rengE: Omit<RengEntradaHistorial, 'id' | 'fecha'>, rengAhora = new Date()): RengEntradaHistorial[] {
  const rengNueva: RengEntradaHistorial = { ...rengE, id: rengNuevoId(rengAhora), fecha: rengAhora.toISOString() }
  return [rengNueva, ...rengL.filter((rengX) => !rengMismo(rengX.entrada, rengE.entrada))].slice(0, RENG_MAX_HISTORIAL)
}

export const rengBorrarDeHistorial = (rengL: readonly RengEntradaHistorial[], rengId: string): RengEntradaHistorial[] => rengL.filter((rengX) => rengX.id !== rengId)

export function rengLeerHistorial(rengA: RengAlmacenHistorial | null): RengEntradaHistorial[] {
  try {
    return rengMigrarHistorial(JSON.parse(rengA?.getItem(RENG_CLAVE_HISTORIAL) ?? '[]'), new Date())
  } catch {
    return []
  }
}

export function rengGuardarHistorial(rengA: RengAlmacenHistorial | null, rengL: readonly RengEntradaHistorial[]): boolean {
  try {
    if (!rengA) return false
    rengA.setItem(RENG_CLAVE_HISTORIAL, JSON.stringify(rengL.slice(0, RENG_MAX_HISTORIAL)))
    return true
  } catch {
    return false
  }
}

export interface RengDeshacible {
  anterior: RengEntradaHistorial[]
  texto: string
  hasta: number
}

export const rengPrepararDeshacer = (rengAnterior: readonly RengEntradaHistorial[], rengTexto: string, rengAhora: number, rengMs = 8000): RengDeshacible => ({ anterior: [...rengAnterior], texto: rengTexto, hasta: rengAhora + rengMs })
export const rengPuedeDeshacer = (rengD: RengDeshacible | null, rengAhora: number): rengD is RengDeshacible => !!rengD && rengAhora < rengD.hasta
