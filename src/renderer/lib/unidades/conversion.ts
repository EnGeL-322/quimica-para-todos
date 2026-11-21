import { rengAnalizarUnidad, type RengUnidadAnalizada } from './analizador'
import { rengMagnitud, RENG_MAGNITUDES, rengUnidadSI, type RengMagnitud } from './catalogo'
import { rengDimIgual, rengEsAdimensional, rengFormatearDimension } from './dimension'

export class RengErrorUnidad extends Error {}

function rengExigir(rengTexto: string, rengContexto?: string): RengUnidadAnalizada {
  const rengR = rengAnalizarUnidad(rengTexto, rengContexto)
  if (!rengR.ok) throw new RengErrorUnidad(rengR.error)
  return rengR.u
}

export const rengASI = (rengV: number, rengU: RengUnidadAnalizada): number => rengV * rengU.factor + rengU.desplazamiento
export const rengDesdeSI = (rengV: number, rengU: RengUnidadAnalizada): number => (rengV - rengU.desplazamiento) / rengU.factor

export function rengConvertir(rengV: number, rengDe: string, rengA: string, rengMagnitudId?: string): number {
  if (rengDe === rengA) return rengV
  const rengUd = rengExigir(rengDe, rengMagnitudId)
  const rengUa = rengExigir(rengA, rengMagnitudId)
  if (!rengDimIgual(rengUd.dimension, rengUa.dimension)) throw new RengErrorUnidad(`No se puede convertir ${rengDe || 'sin unidad'} a ${rengA || 'sin unidad'}: miden cosas distintas.`)
  return rengDesdeSI(rengASI(rengV, rengUd), rengUa)
}

export function rengMagnitudDeDimension(rengU: RengUnidadAnalizada): RengMagnitud | null {
  if (rengU.unidad) return rengMagnitud(rengU.unidad.magnitud)
  return RENG_MAGNITUDES.find((rengM) => !rengM.aislada && rengDimIgual(rengM.dimension, rengU.dimension)) ?? RENG_MAGNITUDES.find((rengM) => rengDimIgual(rengM.dimension, rengU.dimension)) ?? null
}

export function rengMensajeIncompatible(rengTexto: string, rengMagnitudId: string, rengConSI = true): string {
  const rengM = rengMagnitud(rengMagnitudId)
  const rengNecesita = rengM ? `${rengM.nombre}${rengConSI ? ` (${rengUnidadSI(rengM).simbolo || 'sin unidad'})` : ''}` : 'otra magnitud'
  const rengR = rengAnalizarUnidad(rengTexto, rengMagnitudId)
  if (!rengR.ok) return rengR.error
  const rengMu = rengMagnitudDeDimension(rengR.u)
  const rengEs = rengMu ? `una unidad de ${rengMu.nombre}` : rengEsAdimensional(rengR.u.dimension) ? 'adimensional' : `de dimensión ${rengFormatearDimension(rengR.u.dimension)}`
  return `«${rengTexto}» es ${rengEs}; aquí se necesita ${rengNecesita}.`
}

const RENG_NUMERO = /^\s*([+-−]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:\s*(?:[eE][+-−]?\d+|[×x*]\s*10\s*(?:\^\s*[+-−]?\d+|[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)))?)\s*(.*)$/
const RENG_SUPER: Readonly<Record<string, string>> = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' }

export function rengLeerNumero(rengT: string): number | null {
  let rengS = rengT.replace(/\s/g, '').replace(/−/g, '-')
  rengS = rengS.replace(/[×x*]10\^?([+-]?\d+)/, 'e$1').replace(/[×x*]10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/, (_, rengE: string) => `e${[...rengE].map((rengC) => RENG_SUPER[rengC] ?? rengC).join('')}`)
  if (rengS.includes(',') && !rengS.includes('.')) rengS = rengS.replace(',', '.')
  else rengS = rengS.replace(/,/g, '')
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(rengS)) return null
  const rengN = Number(rengS)
  return Number.isFinite(rengN) ? rengN : null
}

export function rengSepararNumeroYUnidad(rengTexto: string): { numero: number; unidad: string } | null {
  const rengM = RENG_NUMERO.exec(rengTexto)
  if (!rengM) return null
  const rengN = rengLeerNumero(rengM[1]!)
  return rengN === null ? null : { numero: rengN, unidad: (rengM[2] ?? '').trim() }
}

export type RengEntrada =
  | { ok: true; valor: number; unidadEscrita: string | null }
  | { ok: false; tipo: 'ilegible' | 'dimension' | 'unidad'; mensaje: string; sugerencia?: { valor: number; unidad: string } }

export function rengInterpretarEntrada(rengTexto: string, rengUnidad: string, rengMagnitudId?: string): RengEntrada {
  const rengT = rengTexto.trim()
  const rengP = rengSepararNumeroYUnidad(rengT)
  if (!rengP) return { ok: false, tipo: 'ilegible', mensaje: `No entendí «${rengT}». Escribe solo el número y elige la unidad en la lista.` }
  if (rengP.unidad === '' || rengP.unidad === rengUnidad) return { ok: true, valor: rengP.numero, unidadEscrita: null }
  const rengR = rengAnalizarUnidad(rengP.unidad, rengMagnitudId)
  if (!rengR.ok) return { ok: false, tipo: 'unidad', mensaje: `No entendí «${rengT}»: ${rengR.error} Escribe solo el número y elige la unidad en la lista.` }
  const rengDestino = rengAnalizarUnidad(rengUnidad, rengMagnitudId)
  if (!rengDestino.ok) return { ok: false, tipo: 'unidad', mensaje: rengDestino.error }
  if (!rengDimIgual(rengR.u.dimension, rengDestino.u.dimension)) {
    const rengM = rengMagnitudId ? rengMagnitud(rengMagnitudId) : null
    const rengBase = rengMagnitudId ? rengMensajeIncompatible(rengP.unidad, rengMagnitudId, false) : `«${rengP.unidad}» no mide lo mismo que ${rengUnidad}.`
    return { ok: false, tipo: 'dimension', mensaje: `${rengBase} ¿Querías ${rengUnidad || rengM?.nombre || 'otra unidad'}?`, sugerencia: { valor: rengP.numero, unidad: rengUnidad } }
  }
  return { ok: true, valor: rengDesdeSI(rengASI(rengP.numero, rengR.u), rengDestino.u), unidadEscrita: rengP.unidad }
}
