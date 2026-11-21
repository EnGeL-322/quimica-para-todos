import { RENG_LIMITES_CUADERNO, type RengCorrida, type RengDatosCorrida, type RengMedicion, type RengProcedenciaAjuste, type RengProyecto, type RengSerie } from '@shared/cuaderno'

export interface RengMetaCorrida {
  nombre: string
  objetivo?: string
  etiquetas?: string[]
  notas?: string
  anterior?: string | null
  ajuste?: RengProcedenciaAjuste | null
}

const rengRecortar = (rengS: string, rengN: number): string => rengS.trim().slice(0, rengN)

export function rengCrearCorrida(rengId: string, rengDatos: RengDatosCorrida, rengMeta: RengMetaCorrida, rengAhora = new Date()): RengCorrida {
  return {
    tipo: 'corrida',
    id: rengId,
    nombre: rengRecortar(rengMeta.nombre, RENG_LIMITES_CUADERNO.nombre) || rengDatos.modelo.nombre,
    objetivo: rengRecortar(rengMeta.objetivo ?? '', RENG_LIMITES_CUADERNO.texto),
    fecha: rengAhora.toISOString(),
    etiquetas: (rengMeta.etiquetas ?? []).map((rengE) => rengRecortar(rengE, 60)).filter(Boolean).slice(0, RENG_LIMITES_CUADERNO.etiquetas),
    notas: rengRecortar(rengMeta.notas ?? '', RENG_LIMITES_CUADERNO.texto),
    anterior: rengMeta.anterior ?? null,
    ajuste: rengMeta.ajuste ?? null,
    ...rengDatos
  }
}

export function rengAnadirCorrida(rengP: RengProyecto, rengC: RengCorrida): RengProyecto {
  if (rengP.corridas.length >= RENG_LIMITES_CUADERNO.corridas) throw new Error(`El proyecto ya tiene ${RENG_LIMITES_CUADERNO.corridas} corridas (máximo). Crea otro proyecto.`)
  return { ...rengP, corridas: [...rengP.corridas, rengC] }
}

export function rengAnadirMedicion(rengP: RengProyecto, rengM: RengMedicion): RengProyecto {
  if (rengP.mediciones.length >= RENG_LIMITES_CUADERNO.mediciones) throw new Error(`El proyecto ya tiene ${RENG_LIMITES_CUADERNO.mediciones} mediciones (máximo). Crea otro proyecto.`)
  return { ...rengP, mediciones: [...rengP.mediciones, rengM] }
}

export const rengRenombrarProyecto = (rengP: RengProyecto, rengNombre: string): RengProyecto => ({ ...rengP, nombre: rengRecortar(rengNombre, RENG_LIMITES_CUADERNO.nombre) || rengP.nombre })

export function rengEditarEntrada(rengP: RengProyecto, rengId: string, rengCambios: { nombre?: string; objetivo?: string; notas?: string }): RengProyecto {
  const rengNombre = rengCambios.nombre === undefined ? undefined : rengRecortar(rengCambios.nombre, RENG_LIMITES_CUADERNO.nombre)
  const rengAjustar = <RengT extends { nombre: string; notas: string }>(rengX: RengT): RengT => ({
    ...rengX,
    ...(rengNombre ? { nombre: rengNombre } : {}),
    ...(rengCambios.notas !== undefined ? { notas: rengRecortar(rengCambios.notas, RENG_LIMITES_CUADERNO.texto) } : {}),
    ...(rengCambios.objetivo !== undefined && 'objetivo' in rengX ? { objetivo: rengRecortar(rengCambios.objetivo, RENG_LIMITES_CUADERNO.texto) } : {})
  })
  return { ...rengP, corridas: rengP.corridas.map((rengC) => (rengC.id === rengId ? rengAjustar(rengC) : rengC)), mediciones: rengP.mediciones.map((rengM) => (rengM.id === rengId ? rengAjustar(rengM) : rengM)) }
}

export const rengQuitarEntrada = (rengP: RengProyecto, rengId: string): RengProyecto => ({ ...rengP, corridas: rengP.corridas.filter((rengC) => rengC.id !== rengId), mediciones: rengP.mediciones.filter((rengM) => rengM.id !== rengId) })

export function rengHistorialDe(rengP: RengProyecto, rengId: string): RengCorrida[] {
  const rengOut: RengCorrida[] = []
  const rengVistos = new Set<string>()
  let rengActual = rengP.corridas.find((rengC) => rengC.id === rengId)
  while (rengActual && !rengVistos.has(rengActual.id)) {
    rengOut.unshift(rengActual)
    rengVistos.add(rengActual.id)
    rengActual = rengActual.anterior ? rengP.corridas.find((rengC) => rengC.id === rengActual!.anterior) : undefined
  }
  return rengOut
}

export interface RengDatosMedicion {
  nombre: string
  serie: RengSerie
  procedencia: string
  sintetica: boolean
  incertidumbre: string
  archivo: string
  formato: { separador: string; decimal: string }
  transformaciones: string[]
  notas?: string
}

export function rengCrearMedicion(rengId: string, rengD: RengDatosMedicion, rengAhora = new Date()): RengMedicion {
  return {
    tipo: 'medicion',
    id: rengId,
    nombre: rengRecortar(rengD.nombre, RENG_LIMITES_CUADERNO.nombre) || 'Medición sin nombre',
    fecha: rengAhora.toISOString(),
    notas: rengRecortar(rengD.notas ?? '', RENG_LIMITES_CUADERNO.texto),
    serie: rengD.serie,
    procedencia: rengRecortar(rengD.procedencia, RENG_LIMITES_CUADERNO.texto),
    sintetica: rengD.sintetica,
    incertidumbre: rengRecortar(rengD.incertidumbre, 2000),
    archivo: rengD.archivo.replace(/^.*[\\/]/, '').slice(0, 260),
    formato: rengD.formato,
    transformaciones: rengD.transformaciones.slice(0, RENG_LIMITES_CUADERNO.lista)
  }
}

export const rengProyectoJSON = (rengP: RengProyecto): string => `${JSON.stringify(rengP, null, 1)}\n`
