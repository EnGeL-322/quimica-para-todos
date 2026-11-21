import { rengPorSimbolo } from '../../tabla-periodica/data'
import { rengAnalizarFormula, rengMasaMolarDe } from './formula'

export function rengFraccionFluor(rengFormula: string): number | null {
  const rengF = rengAnalizarFormula(rengFormula)
  const rengN = rengF.atomos.get('F')
  const rengMasaF = rengPorSimbolo.get('F')?.masa
  if (!rengN || !rengMasaF) return null
  return (rengN * rengMasaF) / rengMasaMolarDe(rengF)
}

export function rengPorcentajeParaPpm(rengFormula: string, rengPpm: number): number | null {
  const rengX = rengFraccionFluor(rengFormula)
  return rengX === null ? null : rengPpm / 1e4 / rengX
}

export function rengPpmDePorcentaje(rengFormula: string, rengPorcentaje: number): number | null {
  const rengX = rengFraccionFluor(rengFormula)
  return rengX === null ? null : rengPorcentaje * 1e4 * rengX
}
