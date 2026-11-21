import type { RengNivelEvidencia } from '@shared/cuaderno'
import { rengLeccionN1PorId } from '../aprender/n1/registro'
import type { RengProcedenciaN1 } from '../aprender/n1/tipos'
import { RENG_MODELOS_ESCENA } from '../practica/modelosSimulacion'
import { rengGrupoN1DeSubtema } from '../practicas-n1/registro'
import { rengEscenaN1PorId } from '../escenas-n1/registro'
import type { RengVerificacionDato } from '../practica/tipos'
import type { RengRecurso } from './tipos'

export type RengNivelVerificacion = 'fuente-verificada' | 'bibliografica-declarada' | 'dato-calculado' | 'parametro-didactico' | 'ejemplo-idealizado' | 'sin-verificar'

export const RENG_NIVELES_VERIFICACION: readonly RengNivelVerificacion[] = ['fuente-verificada', 'bibliografica-declarada', 'dato-calculado', 'parametro-didactico', 'ejemplo-idealizado', 'sin-verificar']

export const RENG_NOMBRE_VERIFICACION: Readonly<Record<RengNivelVerificacion, string>> = {
  'fuente-verificada': 'Fuente verificada',
  'bibliografica-declarada': 'Bibliográfica declarada',
  'dato-calculado': 'Dato calculado',
  'parametro-didactico': 'Parámetro didáctico',
  'ejemplo-idealizado': 'Ejemplo idealizado',
  'sin-verificar': 'Sin verificar'
}

export interface RengEquivalenciaVerificacion {
  nivel: RengNivelVerificacion
  comprobable: boolean
}

export type RengEtiquetaDatosMd = 'fuente-consultada' | 'wikidata-con-referencia' | 'wikidata-sin-referencia' | 'calculada-sin-contrastar' | 'conocimiento-general' | 'sin-verificar'

export const RENG_EQUIVALENCIA_EJERCICIO: Readonly<Record<RengVerificacionDato, RengEquivalenciaVerificacion>> = {
  didactico: { nivel: 'parametro-didactico', comprobable: false },
  referencia: { nivel: 'bibliografica-declarada', comprobable: false },
  publicado: { nivel: 'fuente-verificada', comprobable: true }
}

export const RENG_EQUIVALENCIA_CUADERNO: Readonly<Record<RengNivelEvidencia, RengEquivalenciaVerificacion>> = {
  'modelo-calculado': { nivel: 'dato-calculado', comprobable: false },
  'calculo-verificado': { nivel: 'dato-calculado', comprobable: true },
  'comparado-con-mediciones': { nivel: 'fuente-verificada', comprobable: true }
}

export const RENG_EQUIVALENCIA_DATOS_MD: Readonly<Record<Exclude<RengEtiquetaDatosMd, 'fuente-consultada'>, RengEquivalenciaVerificacion>> = {
  'wikidata-con-referencia': { nivel: 'bibliografica-declarada', comprobable: false },
  'wikidata-sin-referencia': { nivel: 'sin-verificar', comprobable: false },
  'calculada-sin-contrastar': { nivel: 'dato-calculado', comprobable: false },
  'conocimiento-general': { nivel: 'sin-verificar', comprobable: false },
  'sin-verificar': { nivel: 'sin-verificar', comprobable: false }
}

export const rengEquivalenciaDatosMd = (rengEtiqueta: RengEtiquetaDatosMd, rengPaginaAbierta: boolean): RengEquivalenciaVerificacion => {
  if (rengEtiqueta === 'fuente-consultada') return rengPaginaAbierta ? { nivel: 'fuente-verificada', comprobable: true } : { nivel: 'bibliografica-declarada', comprobable: false }
  return RENG_EQUIVALENCIA_DATOS_MD[rengEtiqueta]
}

export const rengRangoVerificacion = (rengNivel: RengNivelVerificacion): number => RENG_NIVELES_VERIFICACION.indexOf(rengNivel)

export const rengMasDebil = (rengLista: readonly RengEquivalenciaVerificacion[]): RengEquivalenciaVerificacion | null => {
  let rengPeor: RengEquivalenciaVerificacion | null = null
  for (const rengE of rengLista) if (rengPeor === null || rengRangoVerificacion(rengE.nivel) > rengRangoVerificacion(rengPeor.nivel) || (rengE.nivel === rengPeor.nivel && !rengE.comprobable)) rengPeor = rengE
  return rengPeor
}

export interface RengVerificacionRecurso extends RengEquivalenciaVerificacion {
  motivo: string
}

export function rengVerificacionDeRecurso(rengR: RengRecurso): RengVerificacionRecurso {
  switch (rengR.tipo) {
    case 'tema':
    case 'practica':
      return { ...RENG_EQUIVALENCIA_EJERCICIO.didactico, motivo: 'Los datos de lecciones y enunciados son didácticos; ninguno es una medición publicada.' }
    case 'escena': {
      const rengModelo = rengR.id === 'mesalibre' ? null : RENG_MODELOS_ESCENA[rengR.id]
      if (!rengModelo) return { nivel: 'sin-verificar', comprobable: false, motivo: 'La Mesa libre no es una escena del marco y no tiene ficha de modelo propia.' }
      return { ...RENG_EQUIVALENCIA_CUADERNO[rengModelo.evidencia], motivo: `Evidencia declarada en la ficha del modelo: ${rengModelo.evidencia}.` }
    }
    case 'mesa':
      return { nivel: 'sin-verificar', comprobable: false, motivo: 'Los datos de la Mesa molecular no se han auditado uno a uno.' }
    case 'tabla':
      return { nivel: 'sin-verificar', comprobable: false, motivo: 'Las masas atómicas de la tabla no tienen fuente registrada y la configuración electrónica se calcula sin contrastar.' }
    case 'sustancia':
      return { nivel: 'bibliografica-declarada', comprobable: false, motivo: 'Cada sustancia declara su fuente (por ejemplo, la estructura de referencia de PubChem).' }
    case 'caso':
      return { nivel: 'bibliografica-declarada', comprobable: false, motivo: 'Cada afirmación declara su fuente; algunas solo se vieron en un resumen de búsqueda.' }
    case 'laboratorio':
      return { nivel: 'dato-calculado', comprobable: false, motivo: 'Cálculo propio, no contrastado en esta entrega.' }
    case 'peligros':
      return { nivel: 'bibliografica-declarada', comprobable: false, motivo: 'Fichas contrastadas con ICSC o ECHA según el catálogo; no se reabrieron en esta entrega.' }
    case 'cristal':
      return { nivel: 'bibliografica-declarada', comprobable: false, motivo: 'Cada estructura cita su fuente; los parámetros no se contrastaron en esta entrega.' }
    case 'glosario':
      return { nivel: 'bibliografica-declarada', comprobable: false, motivo: 'Cada entrada cita el Gold Book de la IUPAC o el Libro Rojo.' }
    case 'leccion-n1':
      return rengVerificacionDeProcedencia(rengLeccionN1PorId(rengR.id)?.procedencia ?? [], 'Nivel más débil de la procedencia declarada en la lección por capas.')
    case 'practica-n1':
      return rengVerificacionDeProcedencia(rengGrupoN1DeSubtema(rengR.id)?.practicas.flatMap((rengP) => rengP.procedencia) ?? [], 'Nivel más débil de la procedencia declarada en las prácticas del subtema.')
    case 'escena-n1':
      return rengVerificacionDeProcedencia(rengEscenaN1PorId(rengR.id)?.ficha.procedencia ?? [], 'Nivel más débil de la procedencia declarada en la ficha de la simulación.')
  }
}

export function rengVerificacionDeProcedencia(rengLista: readonly RengProcedenciaN1[], rengMotivo: string): RengVerificacionRecurso {
  const rengPeor = rengMasDebil(rengLista.map((rengP) => ({ nivel: rengP.nivel, comprobable: false })))
  return rengPeor ? { ...rengPeor, motivo: rengMotivo } : { nivel: 'sin-verificar', comprobable: false, motivo: 'Sin procedencia declarada.' }
}
