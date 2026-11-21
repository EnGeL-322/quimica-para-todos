import { RENG_LECCIONES_ANALITICA } from './lecciones/analitica'
import { RENG_LECCIONES_FISICOQUIMICA } from './lecciones/fisicoquimica'
import { RENG_LECCIONES_GENERAL } from './lecciones/general'
import { RENG_LECCIONES_INORGANICA } from './lecciones/inorganica'
import { RENG_LECCIONES_ORGANICA } from './lecciones/organica'
import type { RengLeccion } from './tipos'

export const RENG_LECCIONES: readonly RengLeccion[] = [...RENG_LECCIONES_GENERAL, ...RENG_LECCIONES_INORGANICA, ...RENG_LECCIONES_ORGANICA, ...RENG_LECCIONES_ANALITICA, ...RENG_LECCIONES_FISICOQUIMICA]

export const rengLeccionDeTema = (rengTema: string): RengLeccion | undefined => RENG_LECCIONES.find((rengL) => rengL.tema === rengTema)

export const RENG_RUTA_INICIACION: readonly string[] = ['mol', 'concentracion', 'ajuste', 'estequiometria', 'formular-nombrar', 'grupos', 'estructura', 'isomeria', 'dilucion', 'cinetica']

export function rengPrerrequisitosTransitivos(rengTema: string): string[] {
  const rengVistos = new Set<string>()
  const rengOrden: string[] = []
  const rengVisitar = (rengId: string): void => {
    for (const rengP of rengLeccionDeTema(rengId)?.prerrequisitos ?? []) {
      if (rengVistos.has(rengP)) continue
      rengVistos.add(rengP)
      rengVisitar(rengP)
      rengOrden.push(rengP)
    }
  }
  rengVisitar(rengTema)
  return rengOrden
}

export function rengHayCiclo(): boolean {
  const rengEstado = new Map<string, 'visitando' | 'listo'>()
  const rengVisitar = (rengId: string): boolean => {
    const rengE = rengEstado.get(rengId)
    if (rengE === 'visitando') return true
    if (rengE === 'listo') return false
    rengEstado.set(rengId, 'visitando')
    for (const rengP of rengLeccionDeTema(rengId)?.prerrequisitos ?? []) if (rengVisitar(rengP)) return true
    rengEstado.set(rengId, 'listo')
    return false
  }
  return RENG_LECCIONES.some((rengL) => rengVisitar(rengL.tema))
}
