import { RENG_R } from './termoquimica'

export type RengOrden = 0 | 1 | 2

export function rengConcentracion(rengOrden: RengOrden, RENG_A0: number, rengK: number, rengT: number): number {
  if (!(RENG_A0 >= 0) || !(rengK >= 0) || !(rengT >= 0)) throw new RangeError('A0, k y t deben ser ≥ 0')
  if (rengOrden === 0) return Math.max(0, RENG_A0 - rengK * rengT)
  if (rengOrden === 1) return RENG_A0 * Math.exp(-rengK * rengT)
  return RENG_A0 / (1 + rengK * RENG_A0 * rengT)
}

export function rengVidaMedia(rengOrden: RengOrden, RENG_A0: number, rengK: number): number {
  if (!(rengK > 0) || !(RENG_A0 > 0)) throw new RangeError('k y A0 deben ser > 0')
  if (rengOrden === 0) return RENG_A0 / (2 * rengK)
  if (rengOrden === 1) return Math.LN2 / rengK
  return 1 / (rengK * RENG_A0)
}

export const rengArrhenius = (RENG_A: number, RengEaKJ: number, RENG_T: number): number => RENG_A * Math.exp((-RengEaKJ * 1000) / (RENG_R * RENG_T))

export const rengEnergiaActivacion = (rengK1: number, RENG_T1: number, rengK2: number, RENG_T2: number): number => (RENG_R * Math.log(rengK2 / rengK1)) / (1 / RENG_T1 - 1 / RENG_T2) / 1000

export const rengKEnT = (rengK1: number, RENG_T1: number, RENG_T2: number, RengEaKJ: number): number => rengK1 * Math.exp(((RengEaKJ * 1000) / RENG_R) * (1 / RENG_T1 - 1 / RENG_T2))

export const rengFactorBoltzmann = (RengEaKJ: number, RENG_T: number): number => Math.exp((-RengEaKJ * 1000) / (RENG_R * RENG_T))

export interface RengEstadoABC {
  A: number
  B: number
  C: number
}

export function rengConsecutivaAnalitica(RENG_A0: number, rengK1: number, rengK2: number, rengT: number): RengEstadoABC {
  const RENG_A = RENG_A0 * Math.exp(-rengK1 * rengT)
  const RENG_B = Math.abs(rengK1 - rengK2) < 1e-12 * Math.max(rengK1, rengK2) ? RENG_A0 * rengK1 * rengT * Math.exp(-rengK1 * rengT) : (RENG_A0 * rengK1 * (Math.exp(-rengK1 * rengT) - Math.exp(-rengK2 * rengT))) / (rengK2 - rengK1)
  return { A: RENG_A, B: RENG_B, C: RENG_A0 - RENG_A - RENG_B }
}

export function rengConsecutivaNumerica(RENG_A0: number, rengK1: number, rengK2: number, rengT: number, rengPasos = 2000): RengEstadoABC {
  const rengF = (rengY: number[]): number[] => [-rengK1 * rengY[0]!, rengK1 * rengY[0]! - rengK2 * rengY[1]!, rengK2 * rengY[1]!]
  let rengY = [RENG_A0, 0, 0]
  const rengH = rengT / rengPasos
  for (let rengI = 0; rengI < rengPasos; rengI++) {
    const rengA = rengF(rengY)
    const rengB = rengF(rengY.map((rengV, rengJ) => rengV + (rengH / 2) * rengA[rengJ]!))
    const rengC = rengF(rengY.map((rengV, rengJ) => rengV + (rengH / 2) * rengB[rengJ]!))
    const rengD = rengF(rengY.map((rengV, rengJ) => rengV + rengH * rengC[rengJ]!))
    rengY = rengY.map((rengV, rengJ) => rengV + (rengH / 6) * (rengA[rengJ]! + 2 * rengB[rengJ]! + 2 * rengC[rengJ]! + rengD[rengJ]!))
  }
  return { A: rengY[0]!, B: rengY[1]!, C: rengY[2]! }
}

export const rengTiempoMaximoB = (rengK1: number, rengK2: number): number => (Math.abs(rengK1 - rengK2) < 1e-12 ? 1 / rengK1 : Math.log(rengK1 / rengK2) / (rengK1 - rengK2))
