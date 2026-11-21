import type { RengCompuesto } from '../nucleo/nomenclatura'
import { rengInterpretarSustancia } from '../nucleo/sustancia'
import { rengFormulaConCarga } from './acciones'
import { rengAgruparFaltan } from './agrupar'
import type { RengDerivadoFragmento } from './derivados'

export interface RengFormulacionActiva {
  k: RengCompuesto | null
  origen: 'estructura' | 'formula' | null
  motivo: string | null
}

export const rengAplicable = (rengTexto: string, rengValor: string, rengCompleta: boolean): boolean => rengTexto.trim() !== '' && (rengTexto !== rengValor || !rengCompleta)

export function rengCompuestoDeFragmento(rengD: RengDerivadoFragmento): RengFormulacionActiva {
  if (rengD.completa) {
    const rengK = rengD.sustancia?.inorganico ?? null
    if (rengK) return { k: rengK, origen: 'estructura', motivo: null }
    if (rengD.sustancia) return { k: null, origen: null, motivo: `«${rengD.nombre ?? rengD.formula}» es una sustancia ${rengD.sustancia.tipo === 'organico' ? 'orgánica' : 'molecular'}: se nombra con la nomenclatura IUPAC de orgánica (arriba). Las tres nomenclaturas inorgánicas no se aplican.` }
    return { k: null, origen: null, motivo: `${rengD.formula}: la estructura está completa, pero la app no la tiene en su lista y no sabe nombrarla.` }
  }
  if (rengD.ids.length < 2) return { k: null, origen: null, motivo: `${rengD.formula} es un átomo suelto. En Explorar, acércale otros átomos para formar un compuesto.` }
  const rengFaltan = rengAgruparFaltan(rengD.faltan)
  const rengR = rengInterpretarSustancia(rengFormulaConCarga(rengD.formula, rengD.cargaNeta))
  const rengK = rengR.tipo === 'ok' ? rengR.sustancia.inorganico : null
  if (rengK)
    return {
      k: rengK,
      origen: 'formula',
      motivo: `La estructura de la mesa aún está incompleta${rengFaltan ? ` (${rengFaltan})` : ''}, pero su composición, ${rengD.formula}, ya dice qué es. Para terminarla, usa «Completar valencias» o escribe la fórmula y pulsa Intro.`
    }
  const rengPorque = rengR.tipo === 'error' ? ` ${rengR.motivo}` : ''
  return { k: null, origen: null, motivo: `${rengD.formula}: estructura incompleta${rengFaltan ? ` (${rengFaltan})` : ''}.${rengPorque}` }
}
