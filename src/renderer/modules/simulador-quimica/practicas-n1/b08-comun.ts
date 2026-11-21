import { RENG_PROCEDENCIA_ATM, RENG_PROCEDENCIA_KELVIN, RENG_PROCEDENCIA_MASAS, RENG_PROCEDENCIA_NA_KB, RENG_PROCEDENCIA_R, rengSeccionGases, type RengClaveSeccionGases } from '../aprender/n1/procedencia'
import type { RengProcedenciaN1, RengToleranciaN1 } from '../aprender/n1/tipos'
import { RENG_GASES_N1, rengGas, rengTx, type RengGasN1 } from '../aprender/n1/gases/constantes'
import { rengIndice, type RengGeneradorN1 } from './aleatorio'

export const RENG_TOL_GAS: RengToleranciaN1 = { rel: 0.01, abs: 0.001 }
export const RENG_TOL_CELSIUS: RengToleranciaN1 = { rel: 0.005, abs: 1 }
export const RENG_TOL_KELVIN: RengToleranciaN1 = { rel: 0.005, abs: 0.5 }
export const RENG_TOL_PORCENTAJE: RengToleranciaN1 = { rel: 0.01, abs: 0.05 }

export type RengConstanteUsada = 'R' | 'atm' | 'K' | 'NA' | 'M'

const RENG_PROCEDENCIAS: Readonly<Record<RengConstanteUsada, RengProcedenciaN1>> = {
  R: RENG_PROCEDENCIA_R,
  atm: RENG_PROCEDENCIA_ATM,
  K: RENG_PROCEDENCIA_KELVIN,
  NA: RENG_PROCEDENCIA_NA_KB,
  M: RENG_PROCEDENCIA_MASAS
}

export const rengFuentesGas = (rengSeccion: RengClaveSeccionGases, rengPara: string, ...rengUsadas: readonly RengConstanteUsada[]): readonly RengProcedenciaN1[] => [rengSeccionGases(rengSeccion, rengPara), ...rengUsadas.map((rengU) => RENG_PROCEDENCIAS[rengU])]

export const rengIndiceGas = (rengRng: RengGeneradorN1): number => rengIndice(rengRng, RENG_GASES_N1.length)

export const rengNombreGas = (rengG: RengGasN1): string => `${rengG.nombre} (${rengG.texto})`

export const rengDatoMasaMolar = (rengG: RengGasN1): readonly [string, string] => [`M(${rengG.texto})`, `${rengTx(rengG.M, 4)} g/mol`]

export { rengGas }
