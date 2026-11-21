import { RENG_TEMARIO_GENERADO } from '../../temario/datos.generado'
import { rengNormalizarTermino, rengProblemasGlosario } from './calidad'
import { RENG_PATRON_ID_CAPITULO_N1, type RengCapituloN1, type RengLeccionN1, type RengTerminoN1 } from './tipos'

export interface RengEspecCapituloN1 {
  bloque: number
  introduccion: string
  objetivos: readonly string[]
  ruta: readonly string[]
  resumen: readonly string[]
}

export const rengIdCapituloN1 = (rengBloque: number): string => `capitulo-b${rengBloque}`
export const rengIdIntegradoresN1 = (rengBloque: number): string => `n1-b${rengBloque}-int`

export function rengGlosarioCapituloN1(rengLecciones: readonly RengLeccionN1[]): RengTerminoN1[] {
  const rengPorTermino = new Map<string, RengTerminoN1>()
  for (const rengL of rengLecciones) for (const rengT of rengL.glosario) if (!rengPorTermino.has(rengNormalizarTermino(rengT.termino))) rengPorTermino.set(rengNormalizarTermino(rengT.termino), rengT)
  return [...rengPorTermino.values()].sort((rengA, rengB) => rengA.termino.localeCompare(rengB.termino, 'es'))
}

export function rengProblemasCapituloN1(rengE: RengEspecCapituloN1, rengLecciones: readonly RengLeccionN1[]): string[] {
  const rengP: string[] = []
  const rengBloque = RENG_TEMARIO_GENERADO.niveles.flatMap((rengN) => rengN.bloques).find((rengB) => rengB.numero === rengE.bloque)
  if (!rengBloque) return [`el bloque ${rengE.bloque} no existe en el temario`]
  if (rengE.introduccion.trim().length < 120) rengP.push('la portada necesita una introducción')
  if (rengE.objetivos.length < 3 || rengE.objetivos.length > 8 || rengE.objetivos.some((rengO) => rengO.trim().length < 30)) rengP.push('la portada necesita de 3 a 8 objetivos verificables')
  if (rengE.resumen.length < 4 || rengE.resumen.length > 10 || rengE.resumen.some((rengL) => rengL.trim().length < 30)) rengP.push('el cierre necesita un resumen de 4 a 10 líneas')
  const rengIds = rengBloque.subtemas.map((rengS) => rengS.id)
  const rengDeLecciones = rengLecciones.filter((rengL) => rengL.bloque === rengE.bloque).map((rengL) => rengL.subtema)
  if ([...rengE.ruta].sort().join() !== [...rengDeLecciones].sort().join()) rengP.push('la ruta sugerida debe recorrer exactamente los subtemas con lección del bloque')
  if (rengE.ruta.some((rengS) => !rengIds.includes(rengS))) rengP.push('la ruta incluye subtemas de otro bloque')
  const rengPosicion = new Map(rengE.ruta.map((rengS, rengI) => [rengS, rengI]))
  for (const rengL of rengLecciones.filter((rengX) => rengX.bloque === rengE.bloque)) {
    for (const rengPre of rengL.conexiones.prerrequisitos) {
      const rengA = rengPosicion.get(rengPre)
      const rengB = rengPosicion.get(rengL.subtema)
      if (rengA !== undefined && rengB !== undefined && rengA > rengB) rengP.push(`la ruta sugerida pone ${rengL.subtema} antes de su prerrequisito ${rengPre}`)
    }
  }
  rengP.push(...rengProblemasGlosario(rengLecciones.filter((rengL) => rengL.bloque === rengE.bloque).flatMap((rengL) => rengL.glosario), 'glosario del capítulo'))
  return rengP
}

export function rengCapituloN1(rengE: RengEspecCapituloN1, rengLecciones: readonly RengLeccionN1[]): RengCapituloN1 {
  const rengProblemas = rengProblemasCapituloN1(rengE, rengLecciones)
  if (rengProblemas.length > 0) throw new Error(`Capítulo del bloque ${rengE.bloque} incompleto: ${rengProblemas.join('; ')}`)
  const rengId = rengIdCapituloN1(rengE.bloque)
  if (!RENG_PATRON_ID_CAPITULO_N1.test(rengId)) throw new Error(`Id de capítulo fuera de patrón: ${rengId}`)
  const rengDelBloque = rengLecciones.filter((rengL) => rengL.bloque === rengE.bloque)
  return {
    id: rengId,
    bloque: rengE.bloque,
    titulo: RENG_TEMARIO_GENERADO.niveles.flatMap((rengN) => rengN.bloques).find((rengB) => rengB.numero === rengE.bloque)!.titulo,
    introduccion: rengE.introduccion,
    objetivos: [...rengE.objetivos],
    ruta: [...rengE.ruta],
    resumen: [...rengE.resumen],
    glosario: rengGlosarioCapituloN1(rengDelBloque),
    integradores: rengIdIntegradoresN1(rengE.bloque)
  }
}
