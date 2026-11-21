import type { RengProcedenciaN1, RengToleranciaN1 } from '../aprender/n1/tipos'

export type RengDificultadN1 = 'basica' | 'intermedia' | 'avanzada'

export const RENG_DIFICULTADES_N1: readonly RengDificultadN1[] = ['basica', 'intermedia', 'avanzada']

export const RENG_ETIQUETA_DIFICULTAD_N1: Readonly<Record<RengDificultadN1, string>> = { basica: 'Básica', intermedia: 'Intermedia', avanzada: 'Avanzada' }

export interface RengErrorTipicoN1 {
  id: string
  nombre: string
  valor: number
  mensaje: string
}

export interface RengInstanciaN1 {
  semilla: number
  parametros: Readonly<Record<string, number>>
  enunciado: string
  pregunta: string
  datos: ReadonlyArray<readonly [string, string]>
  respuesta: number
  pasos: readonly string[]
  pistas: readonly [string, string, string]
  errores: readonly RengErrorTipicoN1[]
}

export interface RengPracticaN1 {
  id: string
  subtema: string
  subtemas?: readonly string[]
  titulo: string
  dificultad: RengDificultadN1
  objetivo: string
  unidad: string
  cifras: number
  tolerancia: RengToleranciaN1
  procedencia: readonly RengProcedenciaN1[]
  generar: (rengSemilla: number) => RengInstanciaN1
}

export interface RengGrupoPracticasN1 {
  subtema: string
  leccion: string
  bloque: number
  posicion: number
  titulo: string
  practicas: readonly RengPracticaN1[]
}

export const RENG_SEMILLA_MAXIMA_N1 = 999_999
export const RENG_MAX_SEMILLAS_N1 = 200
export const RENG_PATRON_ID_PRACTICA_N1 = /^n1-b\d{1,2}-s\d{1,2}-p[1-3]$/
export const RENG_PATRON_ID_INTEGRADOR_N1 = /^n1-b\d{1,2}-i[1-9]$/
