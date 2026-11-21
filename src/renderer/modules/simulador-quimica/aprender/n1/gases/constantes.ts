import { RENG_R_GASES } from '../../../datos/electroquimica'
import { RENG_KB, RENG_NA } from '../../../nucleo/estequiometria'
import { rengMasaMolarDe } from '../../../nucleo/formula'
import { rengTextoNumero } from '../../../practica/numeros'

export const RENG_R_SI = RENG_R_GASES.valor
export const RENG_PA_ATM = 101_325
export const RENG_KPA_ATM = RENG_PA_ATM / 1000
export const RENG_MMHG_ATM = 760
export const RENG_R_LATM = (RENG_R_SI * 1000) / RENG_PA_ATM
export const RENG_R_LKPA = RENG_R_SI
export const RENG_CERO_C = 273.15
export const RENG_NA_GAS = RENG_NA
export const RENG_KB_GAS = RENG_KB
export const RENG_G_N = 9.80665
export const RENG_RHO_HG = 13.5951

export interface RengGasN1 {
  formula: string
  texto: string
  nombre: string
  M: number
}

const RENG_DEFINICION_GASES: ReadonlyArray<readonly [formula: string, texto: string, nombre: string]> = [
  ['H2', 'H₂', 'hidrógeno'],
  ['He', 'He', 'helio'],
  ['CH4', 'CH₄', 'metano'],
  ['NH3', 'NH₃', 'amoníaco'],
  ['Ne', 'Ne', 'neón'],
  ['N2', 'N₂', 'nitrógeno'],
  ['O2', 'O₂', 'oxígeno'],
  ['Ar', 'Ar', 'argón'],
  ['CO2', 'CO₂', 'dióxido de carbono'],
  ['C3H8', 'C₃H₈', 'propano'],
  ['SO2', 'SO₂', 'dióxido de azufre'],
  ['Kr', 'Kr', 'criptón']
]

export const RENG_GASES_N1: readonly RengGasN1[] = RENG_DEFINICION_GASES.map(([rengF, rengT, rengN]) => ({ formula: rengF, texto: rengT, nombre: rengN, M: Math.round(rengMasaMolarDe(rengF) * 100) / 100 }))

export const rengGas = (rengI: number): RengGasN1 => RENG_GASES_N1[Math.max(0, Math.min(RENG_GASES_N1.length - 1, Math.round(rengI)))]!

export const rengGasPorFormula = (rengFormula: string): RengGasN1 => {
  const rengG = RENG_GASES_N1.find((rengX) => rengX.formula === rengFormula)
  if (!rengG) throw new Error(`Gas no registrado: ${rengFormula}`)
  return rengG
}

export const rengK = (rengC: number): number => rengC + RENG_CERO_C

export const rengTx = (rengX: number, rengCifras = 3): string => rengTextoNumero(rengX, rengCifras)

export const rengTxD = (rengX: number, rengDecimales: number): string => rengX.toFixed(rengDecimales).replace('.', ',')

export const rengRedondear = (rengX: number, rengCifras = 3): number => (rengX === 0 || !Number.isFinite(rengX) ? rengX : Number(rengX.toPrecision(rengCifras)))
