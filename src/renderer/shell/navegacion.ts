import { useEffect, useState } from 'react'
import { rengFindModule } from '@/registry'
import { rengAnadirReciente, rengLeerRecientes, type RengReciente } from './nucleo/recientes'
import { rengHashDe, rengResolverRuta, type RengRutaResuelta } from './nucleo/rutas'

const rengExiste = (rengId: string): boolean => !!rengFindModule(rengId)

export const rengRutaActual = (): RengRutaResuelta => rengResolverRuta(location.hash, rengExiste)

export function rengIrA(rengId: string, rengSub?: string | null): void {
  const rengH = rengHashDe(rengId, rengSub)
  if (location.hash === rengH) window.dispatchEvent(new HashChangeEvent('hashchange'))
  else location.hash = rengH
}

export function rengReemplazarSubruta(rengId: string, rengSub: string | null): void {
  if (rengRutaActual().ruta.id !== rengId) return
  try {
    if (location.hash === rengHashDe(rengId, rengSub)) return
    history.replaceState(history.state, '', rengHashDe(rengId, rengSub))
    window.dispatchEvent(new Event(RENG_EVENTO_SUBRUTA))
  } catch {
  }
}

export const RENG_EVENTO_SUBRUTA = 'ciencia:subruta'

export function useRengSubruta(rengId: string): { sub: string | null; n: number } {
  const [rengEstado, rengSetEstado] = useState(() => {
    const rengR = rengRutaActual().ruta
    return { sub: rengR.id === rengId ? rengR.sub : null, n: 0 }
  })
  useEffect(() => {
    const rengAlCambiar = (): void => {
      const rengR = rengRutaActual().ruta
      if (rengR.id === rengId) rengSetEstado((rengE) => ({ sub: rengR.sub, n: rengE.n + 1 }))
    }
    window.addEventListener('hashchange', rengAlCambiar)
    return () => window.removeEventListener('hashchange', rengAlCambiar)
  }, [rengId])
  return rengEstado
}

const RENG_CLAVE_RECIENTES = 'ciencia.trabajo-reciente'
const RENG_EVENTO = 'ciencia:recientes'

const rengAlmacen = (): Storage | null => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function rengLeerTrabajoReciente(): RengReciente[] {
  try {
    return rengLeerRecientes(rengAlmacen()?.getItem(RENG_CLAVE_RECIENTES) ?? null, rengExiste)
  } catch {
    return []
  }
}

export function rengRegistrarReciente(rengR: Omit<RengReciente, 'fecha'>): void {
  try {
    const rengLista = rengAnadirReciente(rengLeerTrabajoReciente(), { ...rengR, fecha: Date.now() })
    rengAlmacen()?.setItem(RENG_CLAVE_RECIENTES, JSON.stringify(rengLista))
    window.dispatchEvent(new Event(RENG_EVENTO))
  } catch {
  }
}

export function rengBorrarTrabajoReciente(): void {
  try {
    rengAlmacen()?.removeItem(RENG_CLAVE_RECIENTES)
    window.dispatchEvent(new Event(RENG_EVENTO))
  } catch {
  }
}

export function useRengTrabajoReciente(): RengReciente[] {
  const [rengLista, rengSetLista] = useState(rengLeerTrabajoReciente)
  useEffect(() => {
    const rengLeer = (): void => rengSetLista(rengLeerTrabajoReciente())
    window.addEventListener(RENG_EVENTO, rengLeer)
    window.addEventListener('storage', rengLeer)
    return () => {
      window.removeEventListener(RENG_EVENTO, rengLeer)
      window.removeEventListener('storage', rengLeer)
    }
  }, [])
  return rengLista
}
