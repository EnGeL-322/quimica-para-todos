import { RENG_VERSION_ATESTACIONES, type RengArchivoAtestaciones } from './atestaciones.datos'
import type { RengGrupoCorrespondencia, RengTemario } from './tipos'

export const RENG_MIN_MOTIVO = 40

export interface RengContextoAtestaciones {
  familiasDeTema: (rengTema: string) => readonly string[]
  temaCompleto: (rengTema: string) => boolean
}

const RENG_FECHA = /^(\d{4})-(\d{2})-(\d{2})$/

export function rengFechaIsoValida(rengFecha: string): boolean {
  const rengM = RENG_FECHA.exec(rengFecha)
  if (!rengM) return false
  const rengA = Number(rengM[1])
  const rengMes = Number(rengM[2])
  const rengD = Number(rengM[3])
  const rengFechaJs = new Date(Date.UTC(rengA, rengMes - 1, rengD))
  return rengA >= 2026 && rengFechaJs.getUTCFullYear() === rengA && rengFechaJs.getUTCMonth() === rengMes - 1 && rengFechaJs.getUTCDate() === rengD
}

export function rengProblemasAtestaciones(
  rengArchivo: RengArchivoAtestaciones,
  rengTemario: RengTemario,
  rengCorrespondencias: Readonly<Record<number, readonly RengGrupoCorrespondencia[]>>,
  rengContexto: RengContextoAtestaciones
): string[] {
  const rengProblemas: string[] = []
  if (rengArchivo.version !== RENG_VERSION_ATESTACIONES) rengProblemas.push(`versión ${rengArchivo.version} no soportada`)
  const rengSubtemas = new Map<string, { bloque: number; posicion: number; tipo: string }>()
  for (const rengN of rengTemario.niveles) for (const rengB of rengN.bloques) rengB.subtemas.forEach((rengS, rengI) => rengSubtemas.set(rengS.id, { bloque: rengB.numero, posicion: rengI + 1, tipo: rengB.tipo }))
  const rengVistos = new Set<string>()
  for (const rengA of rengArchivo.atestaciones) {
    const rengEt = rengA.subtema
    const rengInfo = rengSubtemas.get(rengA.subtema)
    if (!rengInfo) {
      rengProblemas.push(`${rengEt}: el subtema no existe`)
      continue
    }
    if (rengVistos.has(rengA.subtema)) rengProblemas.push(`${rengEt}: atestación repetida`)
    rengVistos.add(rengA.subtema)
    if (rengA.revisor.trim() === '') rengProblemas.push(`${rengEt}: falta el revisor`)
    if (!rengFechaIsoValida(rengA.fecha)) rengProblemas.push(`${rengEt}: fecha inválida «${rengA.fecha}»`)
    if (rengA.motivo.trim().length < RENG_MIN_MOTIVO) rengProblemas.push(`${rengEt}: el motivo debe tener al menos ${RENG_MIN_MOTIVO} caracteres`)
    const rengGrupo = rengInfo.tipo === 'curso' ? (rengCorrespondencias[rengInfo.bloque] ?? []).find((rengG) => rengG.posiciones.includes(rengInfo.posicion)) : undefined
    if (!rengGrupo || rengGrupo.estado !== 'confirmado') {
      rengProblemas.push(`${rengEt}: el subtema no tiene recursos confirmados`)
      continue
    }
    if (rengGrupo.recursos.some((rengR) => rengR.tipo === 'leccion-n1' && rengR.id === rengA.tema)) {
      if (!rengGrupo.recursos.some((rengR) => rengR.tipo === 'practica-n1' && rengR.id === rengA.familia)) rengProblemas.push(`${rengEt}: la lista de prácticas «${rengA.familia}» no está entre los recursos confirmados de este subtema`)
      continue
    }
    if (!rengGrupo.recursos.some((rengR) => rengR.tipo === 'tema' && rengR.id === rengA.tema)) rengProblemas.push(`${rengEt}: el tema «${rengA.tema}» no está entre los recursos confirmados de este subtema`)
    if (!rengContexto.temaCompleto(rengA.tema)) rengProblemas.push(`${rengEt}: el tema «${rengA.tema}» no tiene lección y práctica`)
    const rengFamilias = rengContexto.familiasDeTema(rengA.tema)
    const rengFamiliaOk = rengFamilias.length > 0 ? rengFamilias.includes(rengA.familia) : rengA.familia === rengA.tema
    if (!rengFamiliaOk) rengProblemas.push(`${rengEt}: la familia «${rengA.familia}» no pertenece al tema «${rengA.tema}»`)
  }
  return rengProblemas
}
