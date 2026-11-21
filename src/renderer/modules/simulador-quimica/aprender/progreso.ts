export const RENG_CLAVE_PROGRESO_LECCIONES = 'ciencia.aprender.simulador-quimica'

export interface RengProgresoLeccion {
  paso: number
  comprobacion: 'correcta' | 'incorrecta' | null
  intentos: number
}

export interface RengProgresoLecciones {
  v: 1
  temas: Readonly<Record<string, RengProgresoLeccion>>
}

export const RENG_PROGRESO_VACIO: RengProgresoLecciones = { v: 1, temas: {} }

export const RENG_PROGRESO_LECCION_VACIO: RengProgresoLeccion = { paso: 0, comprobacion: null, intentos: 0 }

const rengEsRegistro = (rengX: unknown): rengX is Record<string, unknown> => typeof rengX === 'object' && rengX !== null && !Array.isArray(rengX)

export function rengLeerProgresoLecciones(rengTexto: string | null | undefined, rengIdsValidos: ReadonlySet<string>, rengMaxPaso: number): RengProgresoLecciones {
  if (!rengTexto) return RENG_PROGRESO_VACIO
  try {
    const rengDatos: unknown = JSON.parse(rengTexto)
    if (!rengEsRegistro(rengDatos) || rengDatos['v'] !== 1 || !rengEsRegistro(rengDatos['temas'])) return RENG_PROGRESO_VACIO
    const rengTemas: Record<string, RengProgresoLeccion> = {}
    for (const [rengId, rengV] of Object.entries(rengDatos['temas'])) {
      if (!rengIdsValidos.has(rengId) || !rengEsRegistro(rengV)) continue
      const rengPaso = rengV['paso']
      const rengComp = rengV['comprobacion']
      const rengInt = rengV['intentos']
      if (typeof rengPaso !== 'number' || !Number.isInteger(rengPaso) || rengPaso < 0 || rengPaso > rengMaxPaso) continue
      if (rengComp !== null && rengComp !== 'correcta' && rengComp !== 'incorrecta') continue
      if (typeof rengInt !== 'number' || !Number.isInteger(rengInt) || rengInt < 0 || rengInt > 1000) continue
      rengTemas[rengId] = { paso: rengPaso, comprobacion: rengComp, intentos: rengInt }
    }
    return { v: 1, temas: rengTemas }
  } catch {
    return RENG_PROGRESO_VACIO
  }
}

export const rengProgresoDe = (rengP: RengProgresoLecciones, rengTema: string): RengProgresoLeccion => rengP.temas[rengTema] ?? RENG_PROGRESO_LECCION_VACIO

export function rengVerPaso(rengP: RengProgresoLecciones, rengTema: string, rengPaso: number): RengProgresoLecciones {
  const rengActual = rengProgresoDe(rengP, rengTema)
  if (rengPaso <= rengActual.paso) return rengP
  return { v: 1, temas: { ...rengP.temas, [rengTema]: { ...rengActual, paso: rengPaso } } }
}

export function rengRegistrarComprobacion(rengP: RengProgresoLecciones, rengTema: string, rengCorrecta: boolean): RengProgresoLecciones {
  const rengActual = rengProgresoDe(rengP, rengTema)
  const rengPrevia = rengActual.comprobacion
  const rengNueva = rengPrevia === 'correcta' ? 'correcta' : rengCorrecta ? 'correcta' : 'incorrecta'
  return { v: 1, temas: { ...rengP.temas, [rengTema]: { ...rengActual, comprobacion: rengNueva, intentos: rengActual.intentos + 1 } } }
}

export type RengEstadoLeccion = 'sin-empezar' | 'en-curso' | 'comprobada'

export function rengEstadoLeccion(rengP: RengProgresoLecciones, rengTema: string): RengEstadoLeccion {
  const rengL = rengProgresoDe(rengP, rengTema)
  if (rengL.comprobacion === 'correcta') return 'comprobada'
  return rengL.paso > 0 || rengL.intentos > 0 ? 'en-curso' : 'sin-empezar'
}

export function rengSiguienteDeRuta(rengP: RengProgresoLecciones, rengRuta: readonly string[]): string | null {
  return rengRuta.find((rengId) => rengEstadoLeccion(rengP, rengId) !== 'comprobada') ?? null
}
