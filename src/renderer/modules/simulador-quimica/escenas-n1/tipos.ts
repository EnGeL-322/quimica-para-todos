import type { RengProcedenciaN1 } from '../aprender/n1/tipos'
import type { RengSerieFigura } from '../aprender/figuras/geometria'

export type RengValoresEscenaN1 = Readonly<Record<string, number>>

export interface RengParametroEscenaN1 {
  clave: string
  etiqueta: string
  unidad: string
  min: number
  max: number
  paso: number
  inicial: number
}

export interface RengMagnitudEscenaN1 {
  clave: string
  etiqueta: string
  unidad: string
  cifras: number
}

export interface RengLecturaEscenaN1 extends RengMagnitudEscenaN1 {
  valor: number
}

export interface RengEcuacionEscenaN1 {
  tex: string
  texto: string
}

export interface RengCasoEscenaN1 {
  nombre: string
  valores: Readonly<Partial<Record<string, number>>>
}

export interface RengTiempoEscenaN1 {
  final: number
  porSegundo: number
  unidad: string
}

export interface RengGraficaEscenaN1 {
  tituloX: string
  tituloY: string
  ejeX: (rengV: RengValoresEscenaN1) => readonly [number, number]
  ejeY: (rengV: RengValoresEscenaN1) => readonly [number, number]
  curvas: (rengV: RengValoresEscenaN1) => readonly RengSerieFigura[]
  cursor?: (rengV: RengValoresEscenaN1, rengT: number, rengL: RengValoresEscenaN1) => readonly [number, number]
}

export interface RengFichaEscenaN1 {
  descripcion: string
  ecuaciones: readonly RengEcuacionEscenaN1[]
  supuestos: readonly string[]
  limites: readonly string[]
  condicionesIniciales: string
  procedencia: readonly RengProcedenciaN1[]
}

export interface RengModeloEscenaN1 {
  id: string
  nombre: string
  subtemas: readonly string[]
  pregunta: string
  parametros: readonly RengParametroEscenaN1[]
  tiempo: RengTiempoEscenaN1 | null
  magnitudes: readonly RengMagnitudEscenaN1[]
  lecturas: (rengV: RengValoresEscenaN1, rengT: number) => RengValoresEscenaN1
  enPalabras: (rengV: RengValoresEscenaN1, rengT: number, rengL: RengValoresEscenaN1) => string
  grafica: RengGraficaEscenaN1 | null
  ficha: RengFichaEscenaN1
  casos: readonly RengCasoEscenaN1[]
}

export const RENG_PATRON_ID_ESCENA_N1 = /^[a-z][a-z0-9-]{2,31}$/
