import { rengCapas, rengConfiguracion, rengPorSimbolo } from '../../tabla-periodica/data'

export interface RengPasoEnlace {
  titulo: string
  texto: string
  notaciones: string[]
  nota?: string
  avanzado?: Array<[string, string]>
  duracion: number
}

export interface RengBase {
  id: string
  nombre: string
  formula: string
  pasos: RengPasoEnlace[]
  saberMas: string[]
  fuentes: string[]
}

export interface RengSecuenciaIonica extends RengBase {
  tipo: 'ionico'
  metal: { el: string; carga: number }
  noMetal: { el: string; carga: number; n: number }
  estructura: string
}

export interface RengSecuenciaCovalente extends RengBase {
  tipo: 'covalente'
  centro: string
  vecinos: Array<{ el: string; dir: [number, number, number]; longitud: number }>
  diatomica: string | null
  polar: boolean
}


export interface RengSecuenciaMultiple extends RengBase {
  tipo: 'multiple'
  centro: string
  orden: 2 | 3
  hibridacion: 'sp' | 'sp2'
  hidrogenos: number
  longitud: number
  longitudH: number
  anguloHCH: number | null
  diatomica: string | null
  rigidez: boolean
}

export interface RengSecuenciaDativa extends RengBase {
  tipo: 'dativo'
  dador: 'NH3' | 'H2O'
  aceptor: 'H+' | 'BF3' | 'Cu2+'
  nDadores: number
}

export interface RengSecuenciaMetalica extends RengBase {
  tipo: 'metalico'
  elemento: string
  estructura: string
  electronesPorAtomo: number
}

export interface RengSecuenciaIntermolecular extends RengBase {
  tipo: 'intermolecular'
}

export type RengSecuencia = RengSecuenciaIonica | RengSecuenciaCovalente | RengSecuenciaMultiple | RengSecuenciaDativa | RengSecuenciaMetalica | RengSecuenciaIntermolecular
export type RengTipoEnlace = RengSecuencia['tipo']

export const RENG_TIPOS_ENLACE: Array<{ tipo: RengTipoEnlace; etiqueta: string; icono: string; descripcion: string }> = [
  { tipo: 'ionico', etiqueta: 'Iónico', icono: '±', descripcion: 'Un metal cede electrones a un no metal y los iones se atraen.' },
  { tipo: 'covalente', etiqueta: 'Covalente', icono: '—', descripcion: 'Dos no metales comparten un par de electrones.' },
  { tipo: 'multiple', etiqueta: 'Doble y triple', icono: '≡', descripcion: 'Un enlace σ más uno o dos enlaces π.' },
  { tipo: 'dativo', etiqueta: 'Dativo', icono: '→', descripcion: 'Un mismo átomo aporta los dos electrones.' },
  { tipo: 'metalico', etiqueta: 'Metálico', icono: 'e⁻', descripcion: 'Cationes en un mar de electrones.' },
  { tipo: 'intermolecular', etiqueta: 'Entre moléculas', icono: '⋯', descripcion: 'Atracciones débiles: puente de H, dipolos, London.' }
]

export const rengComa = (rengX: number, rengD = 2): string => rengX.toFixed(rengD).replace('.', ',')
export const RENG_NOBLES: Record<number, string> = { 2: 'helio', 10: 'neón', 18: 'argón', 36: 'kriptón', 54: 'xenón' }
export const rengNombreEl = (rengS: string): string => (rengPorSimbolo.get(rengS)?.nombre ?? rengS).toLowerCase()
export const rengZ = (rengS: string): number => rengPorSimbolo.get(rengS)?.z ?? 0
export const rengIon = (rengEl: string, rengQ: number): string => `${rengEl}${Math.abs(rengQ) === 1 ? '' : Math.abs(rengQ)}${rengQ > 0 ? '+' : '-'}`
export const rengCapaExterna = (rengS: string): number => {
  const rengC = rengCapas(rengZ(rengS))
  return rengC[rengC.length - 1] ?? 0
}
export const rengConfig = (rengS: string): string => rengConfiguracion(rengZ(rengS), false)
export const rengElectrones = (rengN: number): string => (rengN === 1 ? '1 electrón' : `${rengN} electrones`)

