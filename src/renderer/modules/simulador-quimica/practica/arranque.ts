import { RENG_RESOLVEDOR_PRACTICA, rengReferenciaNueva, rengTemaPorId } from './banco'
import { rengEstadoPracticaInicial, rengIntentoAbierto, type RengEstadoPractica } from './estado'
import { rengNivelParaTema } from './banco'
import type { RengNivelPractica } from './niveles'
import { RENG_CLAVE_PRACTICA, rengLeerPractica, rengSerializarPractica } from './persistencia'

export interface RengAlmacenPractica {
  getItem: (rengK: string) => string | null
  setItem: (rengK: string, rengV: string) => void
}

export function rengEstadoPorDefecto(rengNivel: RengNivelPractica): RengEstadoPractica {
  const rengNivelTema = rengNivelParaTema('mol', rengNivel) ?? 'preuniversitario'
  const rengRef = rengReferenciaNueva('mol', rengNivelTema, 1)
  const rengBase = rengEstadoPracticaInicial('general', 'mol', rengNivelTema, rengRef ? { ejercicioId: rengRef.ejercicioId, huella: rengRef.huella } : undefined)
  return rengRef ? { ...rengBase, actual: { ...rengBase.actual, semilla: rengRef.semilla } } : rengBase
}

export function rengArrancarPractica(rengAlmacen: RengAlmacenPractica | null, rengNivel: RengNivelPractica): { estado: RengEstadoPractica; avisos: string[] } {
  const rengBase = rengEstadoPorDefecto(rengNivel)
  let rengTexto: string | null = null
  try {
    rengTexto = rengAlmacen?.getItem(RENG_CLAVE_PRACTICA) ?? null
  } catch {
    rengTexto = null
  }
  const rengLectura = rengLeerPractica(rengTexto, RENG_RESOLVEDOR_PRACTICA)
  const rengP = rengLectura.practica
  if (!rengP) return { estado: rengBase, avisos: rengLectura.avisos }
  const rengActual = rengP.actual && rengTemaPorId(rengP.actual.tema) ? rengP.actual : rengBase.actual
  return { estado: { rama: rengP.rama ?? rengBase.rama, actual: rengActual, pendientes: rengP.pendientes, logros: rengP.logros }, avisos: rengLectura.avisos }
}

export function rengGuardarPractica(rengAlmacen: RengAlmacenPractica | null, rengEstado: RengEstadoPractica): boolean {
  try {
    if (!rengAlmacen) return false
    rengAlmacen.setItem(RENG_CLAVE_PRACTICA, rengSerializarPractica(rengEstado, rengIntentoAbierto))
    return true
  } catch {
    return false
  }
}
