import { rengGrupoN1DeSubtema } from '../practicas-n1/registro'
import type { RengBloqueCatalogo, RengCatalogoTemario } from './catalogo'
import { RENG_ESTADOS_COBERTURA, RENG_NOMBRE_ESTADO_COBERTURA, type RengEstadoCobertura } from './estado'

export const RENG_MARCA_INICIO_INFORME = '<!-- COBERTURA:INICIO -->'
export const RENG_MARCA_FIN_INFORME = '<!-- COBERTURA:FIN -->'

export interface RengContadoresBloqueN1 {
  subtemas: number
  lecciones: number
  conPracticas: number
  practicas: number
  simulaciones: number
  porRevisar: number
  estados: Readonly<Record<RengEstadoCobertura, number>>
}

export function rengContadoresBloqueN1(rengB: RengBloqueCatalogo): RengContadoresBloqueN1 {
  const rengEstados = Object.fromEntries(RENG_ESTADOS_COBERTURA.map((rengE) => [rengE, 0])) as Record<RengEstadoCobertura, number>
  let rengLecciones = 0
  let rengConPracticas = 0
  let rengPracticas = 0
  let rengSimulaciones = 0
  let rengPorRevisar = 0
  for (const rengS of rengB.subtemas) {
    rengEstados[rengS.evaluacion.estado]++
    if (rengS.correspondencia === 'revisar') rengPorRevisar++
    if (rengS.confirmados.some((rengR) => rengR.tipo === 'leccion-n1')) rengLecciones++
    const rengPract = rengS.confirmados.find((rengR) => rengR.tipo === 'practica-n1')
    if (rengPract && 'id' in rengPract) {
      rengConPracticas++
      rengPracticas += rengGrupoN1DeSubtema(rengPract.id)?.practicas.length ?? 0
    }
    if (rengS.confirmados.some((rengR) => rengR.tipo === 'escena' || rengR.tipo === 'escena-n1')) rengSimulaciones++
  }
  return { subtemas: rengB.subtemas.length, lecciones: rengLecciones, conPracticas: rengConPracticas, practicas: rengPracticas, simulaciones: rengSimulaciones, porRevisar: rengPorRevisar, estados: rengEstados }
}

const rengTextoEstados = (rengE: Readonly<Record<RengEstadoCobertura, number>>): string =>
  RENG_ESTADOS_COBERTURA.filter((rengX) => rengE[rengX] > 0)
    .map((rengX) => `${RENG_NOMBRE_ESTADO_COBERTURA[rengX]} ${rengE[rengX]}`)
    .join(', ')

export function rengInformeNivel1(rengCat: RengCatalogoTemario): string {
  const rengNivel = rengCat.niveles.find((rengN) => rengN.numero === 1)
  if (!rengNivel) throw new Error('El catálogo no tiene Nivel 1')
  const rengLineas: string[] = []
  const rengTotal = rengNivel.bloques.map(rengContadoresBloqueN1).reduce(
    (rengA, rengC) => ({ subtemas: rengA.subtemas + rengC.subtemas, lecciones: rengA.lecciones + rengC.lecciones, conPracticas: rengA.conPracticas + rengC.conPracticas, practicas: rengA.practicas + rengC.practicas }),
    { subtemas: 0, lecciones: 0, conPracticas: 0, practicas: 0 }
  )
  rengLineas.push(`Nivel 1: ${rengTotal.subtemas} subtemas · con lección por capas ${rengTotal.lecciones} · con prácticas nuevas ${rengTotal.conPracticas} (${rengTotal.practicas} prácticas) · Estados: ${rengTextoEstados(rengNivel.conteo.porEstado)}.`, '')
  for (const rengB of rengNivel.bloques) {
    const rengC = rengContadoresBloqueN1(rengB)
    rengLineas.push(`### Bloque ${rengB.numero} · ${rengB.titulo}`, '')
    rengLineas.push(`Lecciones por capas ${rengC.lecciones}/${rengC.subtemas} · Prácticas nuevas ${rengC.conPracticas}/${rengC.subtemas} (${rengC.practicas}) · Simulaciones ${rengC.simulaciones}/${rengC.subtemas} · Por revisar ${rengC.porRevisar} · Estados: ${rengTextoEstados(rengC.estados)}.`, '')
    if (rengC.lecciones === 0 && rengC.conPracticas === 0) continue
    rengLineas.push('| Subtema | Lección por capas | Prácticas nuevas | Otros recursos confirmados | Simulaciones | Estado |', '|---|---|---|---|---|---|')
    for (const rengS of rengB.subtemas) {
      const rengPract = rengS.confirmados.find((rengR) => rengR.tipo === 'practica-n1')
      const rengNuevas = rengPract && 'id' in rengPract ? (rengGrupoN1DeSubtema(rengPract.id)?.practicas.length ?? 0) : 0
      const rengOtros = rengS.confirmados.filter((rengR) => rengR.tipo !== 'leccion-n1' && rengR.tipo !== 'practica-n1' && rengR.tipo !== 'escena' && rengR.tipo !== 'escena-n1').length
      const rengEscenas = rengS.confirmados.filter((rengR) => rengR.tipo === 'escena').length
      const rengLeccion = rengS.confirmados.some((rengR) => rengR.tipo === 'leccion-n1')
      rengLineas.push(`| ${rengS.posicion}. ${rengS.titulo} | ${rengLeccion ? '✓' : '—'} | ${rengNuevas || '—'} | ${rengOtros || '—'} | ${rengEscenas || '—'} | ${RENG_NOMBRE_ESTADO_COBERTURA[rengS.evaluacion.estado]} |`)
    }
    rengLineas.push('')
  }
  return rengLineas.join('\n')
}

export function rengSustituirInforme(rengTexto: string, rengInforme: string): string {
  const rengNormal = rengTexto.replace(/\r\n/g, '\n')
  const rengI = rengNormal.indexOf(RENG_MARCA_INICIO_INFORME)
  const rengF = rengNormal.indexOf(RENG_MARCA_FIN_INFORME)
  if (rengI < 0 || rengF < rengI) throw new Error(`Faltan las marcas ${RENG_MARCA_INICIO_INFORME} y ${RENG_MARCA_FIN_INFORME}`)
  return `${rengNormal.slice(0, rengI + RENG_MARCA_INICIO_INFORME.length)}\n\n${rengInforme}\n${rengNormal.slice(rengF)}`
}
