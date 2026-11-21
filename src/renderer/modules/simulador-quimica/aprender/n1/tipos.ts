import type { RengNivelVerificacion } from '../../temario/verificacion'

export interface RengProcedenciaN1 {
  nivel: RengNivelVerificacion
  detalle: string
}

export interface RengEcuacionN1 {
  nombre: string
  texto: string
  lectura: string
  tex: string | null
}

export interface RengVariableN1 {
  simbolo: string
  nombre: string
  unidad: string
}

export interface RengExplorarN1 {
  modulo: string
  sub: string
  nombre: string
  instruccion: string
  limite: string
}

export interface RengToleranciaN1 {
  rel: number
  abs: number
}

export interface RengEjemploN1 {
  id: string
  titulo: string
  enunciado: string
  pregunta: string
  datos: ReadonlyArray<readonly [string, string]>
  unidad: string
  cifras: number
  tolerancia: RengToleranciaN1
  analitico: () => number
  segundo: () => number
  metodoSegundo: string
  pasos: (rengResultado: number) => readonly string[]
  pistas: readonly [string, string, string]
}

export interface RengErrorFrecuenteN1 {
  error: string
  correccion: string
}

export interface RengTerminoN1 {
  termino: string
  definicion: string
}

export interface RengOpcionN1 {
  texto: string
  correcta: boolean
  retro: string
}

export interface RengPreguntaN1 {
  pregunta: string
  opciones: readonly RengOpcionN1[]
}

export interface RengConexionesN1 {
  anterior: string | null
  siguiente: string | null
  prerrequisitos: readonly string[]
}

export interface RengEscenaLeccionN1 {
  id: string
  valores: Readonly<Record<string, number>>
  instruccion: string
  limite: string
}

export interface RengLeccionN1 {
  id: string
  subtema: string
  bloque: number
  posicion: number
  nombre: string
  pregunta: string
  objetivo: string
  objetivos: readonly string[]
  porQueImporta: string
  comprender: { idea: string; imagen: string; errorFrecuente: string; analogia: string; analogiaLimite: string }
  formalizar: { ecuaciones: readonly RengEcuacionN1[]; variables: readonly RengVariableN1[]; supuestos: readonly string[]; limites: string }
  ejemplo: string
  ejemplos: readonly string[]
  figuras: readonly string[]
  errores: readonly RengErrorFrecuenteN1[]
  resumen: readonly string[]
  glosario: readonly RengTerminoN1[]
  comprobar: readonly RengPreguntaN1[]
  conexiones: RengConexionesN1
  explorar: RengExplorarN1 | null
  escena: RengEscenaLeccionN1 | null
  procedencia: readonly RengProcedenciaN1[]
}

export interface RengSerieFiguraN1 {
  nombre: string
  puntos: ReadonlyArray<readonly [number, number]>
}

export interface RengFiguraN1 {
  id: string
  titulo: string
  pie: string
  alternativo: string
  x: { min: number; max: number; titulo: string }
  y: { min: number; max: number; titulo: string }
  series: readonly RengSerieFiguraN1[]
}

export interface RengCapituloN1 {
  id: string
  bloque: number
  titulo: string
  introduccion: string
  objetivos: readonly string[]
  ruta: readonly string[]
  resumen: readonly string[]
  glosario: readonly RengTerminoN1[]
  integradores: string
}

export const RENG_LONGITUD_MAXIMA_ID_LECCION_N1 = 32

export const RENG_PATRON_ID_LECCION_N1 = /^[a-z][a-z0-9-]{2,31}$/

export const RENG_PATRON_ID_CAPITULO_N1 = /^capitulo-b\d{1,2}$/
