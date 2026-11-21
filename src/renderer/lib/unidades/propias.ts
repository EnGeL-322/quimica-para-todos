import { rengAnalizarUnidad, rengFijarUnidadesPropias, type RengUnidadPropia } from './analizador'
import { rengDimIgual, rengFormatearDimension } from './dimension'

export type { RengUnidadPropia }

export interface RengAlmacenUnidades {
  getItem: (rengK: string) => string | null
  setItem: (rengK: string, rengV: string) => void
}

const RENG_CLAVE = 'ciencia.unidades-propias'

export function rengCrearUnidadPropia(rengNombre: string, rengSimbolo: string, rengEquivale: number, rengReferencia: string): RengUnidadPropia | string {
  const rengS = rengSimbolo.trim()
  const rengN = rengNombre.trim()
  if (!rengN) return 'Falta el nombre.'
  if (!rengS || /[\s()/^·*]/.test(rengS)) return 'El símbolo no puede estar vacío ni contener espacios, paréntesis, «/», «^», «·» o «*».'
  if (rengAnalizarUnidad(rengS).ok) return `«${rengS}» ya existe como unidad.`
  if (!Number.isFinite(rengEquivale) || rengEquivale <= 0) return 'La equivalencia debe ser un número positivo.'
  const rengR = rengAnalizarUnidad(rengReferencia)
  if (!rengR.ok) return rengR.error
  if (rengR.u.desplazamiento !== 0) return 'No se admiten escalas con desplazamiento (como °C o °F).'
  return { simbolo: rengS, nombre: rengN, factor: rengEquivale * rengR.u.factor, dimension: rengR.u.dimension, definicion: `1 ${rengS} = ${rengEquivale} ${rengReferencia}` }
}

const rengValida = (rengX: unknown): rengX is RengUnidadPropia => {
  const rengU = rengX as RengUnidadPropia
  return typeof rengU?.simbolo === 'string' && typeof rengU.nombre === 'string' && Number.isFinite(rengU.factor) && rengU.factor > 0 && Array.isArray(rengU.dimension) && rengU.dimension.length === 8 && rengU.dimension.every((rengD) => Number.isFinite(rengD))
}

export function rengLeerUnidadesPropias(rengA: RengAlmacenUnidades | null): RengUnidadPropia[] {
  try {
    const rengV: unknown = JSON.parse(rengA?.getItem(RENG_CLAVE) ?? '[]')
    return Array.isArray(rengV) ? rengV.filter(rengValida) : []
  } catch {
    return []
  }
}

export function rengGuardarUnidadesPropias(rengA: RengAlmacenUnidades | null, rengUs: RengUnidadPropia[]): boolean {
  try {
    if (!rengA) return false
    rengA.setItem(RENG_CLAVE, JSON.stringify(rengUs))
    return true
  } catch {
    return false
  }
}

export function rengCargarUnidadesPropias(rengA: RengAlmacenUnidades | null): RengUnidadPropia[] {
  const rengUs = rengLeerUnidadesPropias(rengA)
  rengFijarUnidadesPropias(rengUs)
  return rengUs
}

export const rengPropiasDeDimension = (rengUs: readonly RengUnidadPropia[], rengD: readonly number[]): RengUnidadPropia[] => rengUs.filter((rengU) => rengDimIgual(rengU.dimension, rengD as never))

export const rengDescribirPropia = (rengU: RengUnidadPropia): string => `${rengU.nombre} (${rengU.definicion}) ${rengFormatearDimension(rengU.dimension)}`
