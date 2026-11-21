import temml from 'temml'
import { rengTexDeFormulaQuimica } from './formula'

export const RENG_LONGITUD_MAXIMA_TEX = 4000

export const RENG_LONGITUD_VISIBLE_RESERVA = 300

export const RENG_OPCIONES_TEMML = {
  throwOnError: false,
  trust: false,
  strict: false,
  annotate: false,
  maxExpand: 200
} as const

export type RengMotivoTex = 'vacia' | 'demasiado-larga' | 'error-de-sintaxis' | 'formula-no-valida'

export type RengValidacionTex = { readonly ok: true } | { readonly ok: false; readonly motivo: RengMotivoTex; readonly detalle: string }

export function rengTexParaReserva(rengTex: string): string {
  const rengLimpio = rengTex.trim()
  return rengLimpio.length > RENG_LONGITUD_VISIBLE_RESERVA ? `${rengLimpio.slice(0, RENG_LONGITUD_VISIBLE_RESERVA)} …` : rengLimpio
}

export function rengValidarTex(rengTex: string): RengValidacionTex {
  if (rengTex.trim() === '') return { ok: false, motivo: 'vacia', detalle: 'la fórmula está vacía' }
  if (rengTex.length > RENG_LONGITUD_MAXIMA_TEX) return { ok: false, motivo: 'demasiado-larga', detalle: `la fórmula supera ${RENG_LONGITUD_MAXIMA_TEX} caracteres` }
  try {
    const rengSalida = temml.renderToString(rengTex, { ...RENG_OPCIONES_TEMML, throwOnError: true })
    if (/<merror|temml-error/.test(rengSalida)) return { ok: false, motivo: 'error-de-sintaxis', detalle: 'el resultado contiene una marca de error' }
    return { ok: true }
  } catch (rengError) {
    return { ok: false, motivo: 'error-de-sintaxis', detalle: rengError instanceof Error ? rengError.message.split('\n')[0]?.trim() || 'error de sintaxis' : 'error de sintaxis' }
  }
}

export function rengValidarFormulaQuimica(rengFormula: string): RengValidacionTex {
  const rengTex = rengTexDeFormulaQuimica(rengFormula)
  if (rengTex === null) return { ok: false, motivo: rengFormula.trim() === '' ? 'vacia' : 'formula-no-valida', detalle: 'la fórmula química contiene caracteres no admitidos (barras invertidas o llaves)' }
  return rengValidarTex(rengTex)
}

export function rengTextoDeMathml(rengHtml: string): string {
  return rengHtml
    .replace(/<annotation[\s\S]*?<\/annotation>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#x([0-9a-f]+);/gi, (_rengM, rengH: string) => String.fromCodePoint(parseInt(rengH, 16)))
    .replace(/&#(\d+);/g, (_rengM, rengD: string) => String.fromCodePoint(Number(rengD)))
}

export function rengRenderizarTexATexto(rengTex: string, rengBloque = false): string {
  return temml.renderToString(rengTex, { ...RENG_OPCIONES_TEMML, displayMode: rengBloque })
}
