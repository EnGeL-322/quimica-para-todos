import type { RengProcedenciaAjuste } from '@shared/cuaderno'
import { rengValidarProcedencia } from '@shared/cuaderno'

const RENG_CLAVE_REABRIR = 'cuaderno.reabrir'

export interface RengPeticionReabrir {
  proyecto: string
  corrida: string
  nombre: string
  modulo: string
  sub: string
  entradas: Record<string, number>
  version: string
  ajuste?: RengProcedenciaAjuste | null
}

export function rengPedirReapertura(rengP: RengPeticionReabrir): void {
  try {
    sessionStorage.setItem(RENG_CLAVE_REABRIR, JSON.stringify(rengP))
  } catch {
  }
}

export function rengTomarReapertura(rengModulo: string, rengSub?: string): RengPeticionReabrir | null {
  try {
    const rengT = sessionStorage.getItem(RENG_CLAVE_REABRIR)
    if (!rengT) return null
    const rengO = JSON.parse(rengT) as Partial<RengPeticionReabrir>
    if (rengO.modulo !== rengModulo) return null
    if (rengSub !== undefined && rengO.sub !== rengSub) return null
    sessionStorage.removeItem(RENG_CLAVE_REABRIR)
    const rengEntradas: Record<string, number> = {}
    for (const [rengK, rengV] of Object.entries(rengO.entradas ?? {})) if (/^[A-Za-z][A-Za-z0-9_]{0,40}$/.test(rengK) && typeof rengV === 'number' && Number.isFinite(rengV)) rengEntradas[rengK] = rengV
    if (typeof rengO.sub !== 'string' || typeof rengO.corrida !== 'string' || typeof rengO.proyecto !== 'string') return null
    let rengAjuste: RengProcedenciaAjuste | null = null
    try {
      rengAjuste = rengValidarProcedencia(rengO.ajuste)
    } catch {
      rengAjuste = null
    }
    return { proyecto: rengO.proyecto, corrida: rengO.corrida, nombre: String(rengO.nombre ?? '').slice(0, 160), modulo: rengModulo, sub: rengO.sub, entradas: rengEntradas, version: String(rengO.version ?? '').slice(0, 20), ajuste: rengAjuste }
  } catch {
    return null
  }
}

export interface RengReaperturaPendiente {
  modulo: string
  sub: string
}

export function rengVerReapertura(rengAlmacen: { getItem: (rengClave: string) => string | null } | null): RengReaperturaPendiente | null {
  if (!rengAlmacen) return null
  try {
    const rengT = rengAlmacen.getItem(RENG_CLAVE_REABRIR)
    if (!rengT || rengT.length > 20000) return null
    const rengO = JSON.parse(rengT) as Partial<RengReaperturaPendiente> | null
    if (!rengO || typeof rengO.modulo !== 'string' || typeof rengO.sub !== 'string') return null
    return { modulo: rengO.modulo, sub: rengO.sub }
  } catch {
    return null
  }
}
