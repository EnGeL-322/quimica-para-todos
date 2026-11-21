import { RENG_ARCHIVO_ATESTACIONES } from './atestaciones.datos'
import { rengLeccionDeTema } from '../aprender/lecciones'
import { rengLeccionN1PorId } from '../aprender/n1/registro'
import { RENG_EXPERIMENTOS_QUIMICA } from '../navegacion'
import { rengFamiliasDeTema, rengTemaPorId } from '../practica/banco'
import { rengCapasDeRecurso, rengRecursoExiste, rengTemaTienePractica, type RengCapa } from './recursos'
import type { RengRecurso } from './tipos'
import { rengMasDebil, rengVerificacionDeRecurso, type RengEquivalenciaVerificacion, type RengNivelVerificacion } from './verificacion'

export type RengEstadoCobertura = 'sin-contenido' | 'en-desarrollo' | 'parcial' | 'completado' | 'verificado'

export const RENG_ESTADOS_COBERTURA: readonly RengEstadoCobertura[] = ['sin-contenido', 'en-desarrollo', 'parcial', 'completado', 'verificado']

export const RENG_NOMBRE_ESTADO_COBERTURA: Readonly<Record<RengEstadoCobertura, string>> = {
  'sin-contenido': 'Sin contenido',
  'en-desarrollo': 'En desarrollo',
  parcial: 'Parcial',
  completado: 'Completado',
  verificado: 'Verificado'
}

export const RENG_DEFINICION_ESTADO_COBERTURA: Readonly<Record<RengEstadoCobertura, string>> = {
  'sin-contenido': 'Ningún recurso confirmado. Un recurso «por revisar» no cuenta.',
  'en-desarrollo': 'Marcado a mano en el registro porque hay trabajo en curso sin entregar. Es el único estado manual.',
  parcial: 'Al menos un recurso confirmado (lección, práctica, simulación o consulta), pero no se cumplen todos los criterios de Completado.',
  completado: 'Un tema confirmado con lección y práctica con corrección, atestación registrada de que tratan este subtema y, si el tema tiene escena, esa simulación confirmada.',
  verificado: 'Completado, con verificación registrada (datos comprobables y revisor con fecha) y todos los recursos confirmados con nivel comprobable.'
}

export interface RengAtestacion {
  tema: string
  familia: string
  revisor: string
  fecha: string
}

export interface RengDatoRegistrado {
  descripcion: string
  nivel: RengNivelVerificacion
  comprobable: boolean
}

export interface RengVerificacionRegistrada {
  datos: readonly RengDatoRegistrado[]
  revisor: string
  fecha: string
}

export interface RengRegistroCobertura {
  enDesarrollo: ReadonlySet<string>
  atestaciones: ReadonlyMap<string, RengAtestacion>
  verificaciones: ReadonlyMap<string, RengVerificacionRegistrada>
}

export const RENG_REGISTRO_COBERTURA: RengRegistroCobertura = {
  enDesarrollo: new Set<string>(),
  atestaciones: new Map<string, RengAtestacion>(RENG_ARCHIVO_ATESTACIONES.atestaciones.map((rengA) => [rengA.subtema, { tema: rengA.tema, familia: rengA.familia, revisor: rengA.revisor, fecha: rengA.fecha }])),
  verificaciones: new Map<string, RengVerificacionRegistrada>()
}

export interface RengCriteriosCobertura {
  exigirTemaConLeccionYPractica: boolean
  exigirAtestacion: boolean
  exigirEscenaDelTema: boolean
  exigirVerificacionRegistrada: boolean
  exigirDatosComprobables: boolean
  exigirRecursosComprobables: boolean
}

export const RENG_CRITERIOS_COBERTURA: Readonly<RengCriteriosCobertura> = Object.freeze({
  exigirTemaConLeccionYPractica: true,
  exigirAtestacion: true,
  exigirEscenaDelTema: true,
  exigirVerificacionRegistrada: true,
  exigirDatosComprobables: true,
  exigirRecursosComprobables: true
})

export interface RengContextoCobertura {
  existe: (rengR: RengRecurso) => boolean
  temaCompleto: (rengTema: string) => boolean
  familiasDeTema: (rengTema: string) => readonly string[]
  escenaDeTema: (rengTema: string) => string | null
  escenaDeLeccionN1?: (rengLeccion: string) => string | null
  verificacionDeRecurso: (rengR: RengRecurso) => RengEquivalenciaVerificacion
}

export const rengEscenaDeLeccionN1Real = (rengId: string): string | null => {
  const rengL = rengLeccionN1PorId(rengId)
  if (rengL?.escena) return rengL.escena.id
  const rengSub = rengL?.explorar?.sub ?? null
  return rengSub !== null && (RENG_EXPERIMENTOS_QUIMICA as readonly string[]).includes(rengSub) ? rengSub : null
}

export const RENG_CONTEXTO_REAL: RengContextoCobertura = {
  existe: rengRecursoExiste,
  temaCompleto: (rengTema) => rengLeccionDeTema(rengTema) !== undefined && rengTemaTienePractica(rengTema),
  familiasDeTema: (rengTema) => rengFamiliasDeTema(rengTema).map((rengF) => rengF.id),
  escenaDeTema: (rengTema) => rengTemaPorId(rengTema)?.escena ?? null,
  escenaDeLeccionN1: rengEscenaDeLeccionN1Real,
  verificacionDeRecurso: (rengR) => {
    const { nivel: rengNivel, comprobable: rengComprobable } = rengVerificacionDeRecurso(rengR)
    return { nivel: rengNivel, comprobable: rengComprobable }
  }
}

export interface RengEvaluacionSubtema {
  estado: RengEstadoCobertura
  capas: readonly RengCapa[]
  faltanParaCompletado: readonly string[]
  faltanParaVerificado: readonly string[]
  verificacion: RengEquivalenciaVerificacion | null
}

const RENG_FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/
const RENG_NIVELES_QUE_CUENTAN: readonly RengNivelVerificacion[] = ['fuente-verificada', 'dato-calculado']

export function rengEvaluarSubtema(
  rengId: string,
  rengConfirmados: readonly RengRecurso[],
  rengRegistro: RengRegistroCobertura = RENG_REGISTRO_COBERTURA,
  rengCriterios: Readonly<RengCriteriosCobertura> = RENG_CRITERIOS_COBERTURA,
  rengContexto: RengContextoCobertura = RENG_CONTEXTO_REAL
): RengEvaluacionSubtema {
  const rengValidos = rengConfirmados.filter((rengR) => rengContexto.existe(rengR))
  if (rengValidos.length === 0) {
    return { estado: rengRegistro.enDesarrollo.has(rengId) ? 'en-desarrollo' : 'sin-contenido', capas: [], faltanParaCompletado: ['No hay ningún recurso confirmado'], faltanParaVerificado: ['No hay ningún recurso confirmado'], verificacion: null }
  }
  const rengCapas = [...new Set(rengValidos.flatMap((rengR) => rengCapasDeRecurso(rengR)))]
  const rengVerificacion = rengMasDebil(rengValidos.map((rengR) => rengContexto.verificacionDeRecurso(rengR)))
  const rengTemas = rengValidos.filter((rengR): rengR is Extract<RengRecurso, { tipo: 'tema' }> => rengR.tipo === 'tema').map((rengR) => rengR.id)
  const rengLeccionesN1 = rengValidos.filter((rengR): rengR is Extract<RengRecurso, { tipo: 'leccion-n1' }> => rengR.tipo === 'leccion-n1').map((rengR) => rengR.id)
  const rengPracticasN1 = rengValidos.filter((rengR): rengR is Extract<RengRecurso, { tipo: 'practica-n1' }> => rengR.tipo === 'practica-n1').map((rengR) => rengR.id)
  const rengParN1 = rengLeccionesN1.length > 0 && rengPracticasN1.length > 0
  const rengFaltaC: string[] = []

  if (rengCriterios.exigirTemaConLeccionYPractica && !rengTemas.some((rengT) => rengContexto.temaCompleto(rengT)) && !rengParN1) rengFaltaC.push('Falta un tema confirmado con lección y práctica con corrección')

  if (rengCriterios.exigirAtestacion) {
    const rengA = rengRegistro.atestaciones.get(rengId)
    const rengFamilias = rengA ? rengContexto.familiasDeTema(rengA.tema) : []
    const rengFamiliaValida = rengA ? (rengFamilias.length > 0 ? rengFamilias.includes(rengA.familia) : rengA.familia === rengA.tema) : false
    const rengPorTema = rengA !== undefined && rengTemas.includes(rengA.tema) && rengFamiliaValida
    const rengPorN1 = rengA !== undefined && rengLeccionesN1.includes(rengA.tema) && rengPracticasN1.includes(rengA.familia)
    const rengValida = rengA !== undefined && (rengPorTema || rengPorN1) && rengA.revisor.trim() !== '' && RENG_FECHA_ISO.test(rengA.fecha)
    if (!rengValida) rengFaltaC.push('Falta la atestación registrada de que la lección y la práctica tratan este subtema')
  }

  if (rengCriterios.exigirEscenaDelTema) {
    const rengEscenas = [...rengTemas.map((rengT) => rengContexto.escenaDeTema(rengT)), ...rengLeccionesN1.map((rengL) => rengContexto.escenaDeLeccionN1?.(rengL) ?? null)].filter((rengE): rengE is string => rengE !== null)
    const rengHay = new Set<string>(rengValidos.flatMap((rengR) => (rengR.tipo === 'escena' || rengR.tipo === 'escena-n1' ? [rengR.id] : [])))
    if (rengEscenas.some((rengE) => !rengHay.has(rengE))) rengFaltaC.push('Falta la simulación asociada al tema')
  }

  const rengFaltaV: string[] = [...rengFaltaC]
  if (rengCriterios.exigirVerificacionRegistrada) {
    const rengV = rengRegistro.verificaciones.get(rengId)
    if (!rengV || rengV.datos.length === 0 || rengV.revisor.trim() === '' || !RENG_FECHA_ISO.test(rengV.fecha)) rengFaltaV.push('Falta la verificación registrada (datos, revisor y fecha)')
    else if (rengCriterios.exigirDatosComprobables && rengV.datos.some((rengD) => !rengD.comprobable || !RENG_NIVELES_QUE_CUENTAN.includes(rengD.nivel))) rengFaltaV.push('Hay datos registrados sin fuente verificada ni cálculo comprobado')
  }
  if (rengCriterios.exigirRecursosComprobables && rengValidos.some((rengR) => !rengContexto.verificacionDeRecurso(rengR).comprobable)) rengFaltaV.push('Algún recurso confirmado no tiene un nivel de verificación comprobable')

  const rengEstado: RengEstadoCobertura = rengFaltaC.length === 0 ? (rengFaltaV.length === 0 ? 'verificado' : 'completado') : 'parcial'
  return { estado: rengEstado, capas: rengCapas, faltanParaCompletado: rengFaltaC, faltanParaVerificado: rengFaltaV, verificacion: rengVerificacion }
}

export function rengEstadoAgregado(rengEstados: readonly RengEstadoCobertura[]): RengEstadoCobertura {
  if (rengEstados.length === 0) return 'sin-contenido'
  if (rengEstados.every((rengE) => rengE === 'verificado')) return 'verificado'
  if (rengEstados.every((rengE) => rengE === 'completado' || rengE === 'verificado')) return 'completado'
  if (rengEstados.some((rengE) => rengE === 'parcial' || rengE === 'completado' || rengE === 'verificado')) return 'parcial'
  if (rengEstados.some((rengE) => rengE === 'en-desarrollo')) return 'en-desarrollo'
  return 'sin-contenido'
}
