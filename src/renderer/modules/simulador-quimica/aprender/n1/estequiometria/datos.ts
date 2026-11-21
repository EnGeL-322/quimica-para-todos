import { rengPorSimbolo } from '../../../../tabla-periodica/data'
import { RENG_NA } from '../../../nucleo/estequiometria'
import { rengMasaMolarDe } from '../../../nucleo/formula'
import { RENG_R_LKPA, rengK, rengTx } from '../gases/constantes'

export const RENG_NA_EST = RENG_NA

export const rengMm = (rengFormula: string): number => rengMasaMolarDe(rengFormula)

export function rengMasaAtomica(rengSimbolo: string): number {
  const rengE = rengPorSimbolo.get(rengSimbolo)
  if (!rengE) throw new Error(`Elemento desconocido: ${rengSimbolo}`)
  return rengE.masa
}

export const rengSumaManual = (rengAtomos: ReadonlyArray<readonly [string, number]>): number => rengAtomos.reduce((rengS, [rengEl, rengN]) => rengS + rengMasaAtomica(rengEl) * rengN, 0)

export const rengTextoMasas = (rengSimbolos: readonly string[]): string => rengSimbolos.map((rengS) => `${rengS} ${rengTx(rengMasaAtomica(rengS), 5)}`).join(' · ')

export const rengVolumenGas = (rengN: number, rengTc: number, rengPkPa: number): number => (rengN * RENG_R_LKPA * rengK(rengTc)) / rengPkPa

export { rengK, rengTx }
