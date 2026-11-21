import { rengIdCapituloN1, rengIdIntegradoresN1 } from '../aprender/n1/capitulo'
import { rengSubtemaExiste } from '../aprender/n1/calidad'
import { RENG_PATRON_ID_INTEGRADOR_N1, type RengGrupoPracticasN1, type RengPracticaN1 } from './tipos'

export const RENG_MINIMO_INTEGRADORES_N1 = 6

export function rengProblemasIntegradoresN1(rengBloque: number, rengPracticas: readonly RengPracticaN1[]): string[] {
  const rengP: string[] = []
  if (rengPracticas.length < RENG_MINIMO_INTEGRADORES_N1) rengP.push(`hay ${rengPracticas.length} problemas integradores y se exigen al menos ${RENG_MINIMO_INTEGRADORES_N1}`)
  for (const rengD of ['basica', 'intermedia', 'avanzada'] as const) if (rengPracticas.filter((rengX) => rengX.dificultad === rengD).length < 2) rengP.push(`faltan problemas integradores de dificultad ${rengD} (mínimo 2)`)
  for (const rengX of rengPracticas) {
    if (!RENG_PATRON_ID_INTEGRADOR_N1.test(rengX.id) || !rengX.id.startsWith(`n1-b${rengBloque}-i`)) rengP.push(`id de integrador fuera de patrón: ${rengX.id}`)
    if (rengX.subtema !== rengIdIntegradoresN1(rengBloque)) rengP.push(`${rengX.id}: no pertenece al grupo de integradores del bloque`)
    const rengSubs = rengX.subtemas ?? []
    if (new Set(rengSubs).size < 2) rengP.push(`${rengX.id}: un integrador debe combinar al menos 2 subtemas`)
    if (rengSubs.some((rengS) => !rengSubtemaExiste(rengS) || !rengS.startsWith(`n1-b${rengBloque}-s`))) rengP.push(`${rengX.id}: combina subtemas inexistentes o de otro bloque`)
  }
  if (new Set(rengPracticas.map((rengX) => rengX.id)).size !== rengPracticas.length) rengP.push('ids de integradores repetidos')
  return rengP
}

export function rengGrupoIntegradoresN1(rengBloque: number, rengPracticas: readonly RengPracticaN1[]): RengGrupoPracticasN1 {
  const rengProblemas = rengProblemasIntegradoresN1(rengBloque, rengPracticas)
  if (rengProblemas.length > 0) throw new Error(`Integradores del bloque ${rengBloque}: ${rengProblemas.join('; ')}`)
  return { subtema: rengIdIntegradoresN1(rengBloque), leccion: rengIdCapituloN1(rengBloque), bloque: rengBloque, posicion: 0, titulo: 'Problemas integradores del capítulo', practicas: rengPracticas }
}
