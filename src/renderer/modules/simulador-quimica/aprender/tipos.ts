import type { RengNivelPractica } from '../practica/niveles'

export interface RengPasoLeccion {
  accion: string
  dato: string
  porQue: string
  interpretar: string
}

export interface RengDatoLeccion {
  etiqueta: string
  valor: string
}

export interface RengEstructuraLeccion {
  smiles: string
  descripcion: string
  numeracion?: string
}

export interface RengResultadoLeccion {
  texto: string
  valor?: number
  unidad?: string
  tolRel?: number
}

export interface RengEjemploLeccion {
  titulo: string
  enunciado: string
  datos: readonly RengDatoLeccion[]
  pasos: readonly RengPasoLeccion[]
  resultado: RengResultadoLeccion
  errorTipico: string
  revision: string
  estructuras?: readonly RengEstructuraLeccion[]
}

export interface RengOpcionComprobacion {
  id: string
  texto: string
}

export interface RengComprobacionLeccion {
  pregunta: string
  opciones: readonly RengOpcionComprobacion[]
  correcta: string
  explicacion: string
}

export interface RengObservarLeccion {
  texto: string
  mesaSmiles?: string
}

export interface RengFuenteLeccion {
  texto: string
  enlace: string
  consultada: string
  alcance: string
}

export interface RengLeccion {
  tema: string
  objetivo: string
  conceptos: readonly string[]
  ejemplo: RengEjemploLeccion
  comprobacion: RengComprobacionLeccion
  porNivel: Partial<Record<RengNivelPractica, string>>
  prerrequisitos: readonly string[]
  observar: RengObservarLeccion | null
  fuentes: readonly RengFuenteLeccion[]
  recorrido: boolean
}

export const RENG_PASOS_LECCION = ['Entender el concepto', 'Ver un ejemplo', 'Resolverlo paso a paso', 'Comprobar qué entendí', 'Practicar', 'Simular u observar'] as const

export type RengPasoSecuencia = (typeof RENG_PASOS_LECCION)[number]
