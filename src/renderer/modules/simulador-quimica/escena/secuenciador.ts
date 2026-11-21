export interface RengEstadoSecuencia {
  paso: number
  t: number
  reproduciendo: boolean
  soloEstePaso: boolean
}

export const rengEstadoInicial = (): RengEstadoSecuencia => ({ paso: 0, t: 0, reproduciendo: false, soloEstePaso: false })

export function rengSuavizar(rengX: number): number {
  const rengC = Math.min(1, Math.max(0, rengX))
  return rengC < 0.5 ? 4 * rengC * rengC * rengC : 1 - (-2 * rengC + 2) ** 3 / 2
}

export function rengTramo(rengS: number, rengA: number, rengB: number): number {
  if (rengB <= rengA) return rengS >= rengB ? 1 : 0
  return rengSuavizar((rengS - rengA) / (rengB - rengA))
}

export const rengMezclar = (rengA: number, rengB: number, rengF: number): number => rengA + (rengB - rengA) * rengF

export const rengPosicion = (rengE: RengEstadoSecuencia): number => rengE.paso + rengSuavizar(rengE.t)

export function rengAvanzar(rengE: RengEstadoSecuencia, rengDt: number, rengDuraciones: number[]): RengEstadoSecuencia {
  if (!rengE.reproduciendo) return rengE
  const rengD = rengDuraciones[rengE.paso] ?? 0
  const rengT = rengD <= 0 ? 1 : rengE.t + rengDt / rengD
  if (rengT < 1) return { ...rengE, t: rengT }
  const rengUltimo = rengE.paso >= rengDuraciones.length - 1
  if (rengE.soloEstePaso || rengUltimo) return { ...rengE, t: 1, reproduciendo: false, soloEstePaso: false }
  return { ...rengE, paso: rengE.paso + 1, t: 0 }
}

export function rengAlternar(rengE: RengEstadoSecuencia, rengTotal: number): RengEstadoSecuencia {
  if (rengE.reproduciendo) return { ...rengE, reproduciendo: false, soloEstePaso: false }
  if (rengE.paso >= rengTotal - 1 && rengE.t >= 1) return { paso: 0, t: 0, reproduciendo: true, soloEstePaso: false }
  return { ...rengE, reproduciendo: true, soloEstePaso: false }
}

export function rengIrA(rengE: RengEstadoSecuencia, rengPaso: number, rengTotal: number): RengEstadoSecuencia {
  const rengP = Math.max(0, Math.min(rengTotal - 1, rengPaso))
  return { paso: rengP, t: 0, reproduciendo: true, soloEstePaso: !rengE.reproduciendo }
}

export const rengSiguiente = (rengE: RengEstadoSecuencia, rengTotal: number): RengEstadoSecuencia => (rengE.paso >= rengTotal - 1 ? { ...rengE, t: 1, reproduciendo: false } : rengIrA(rengE, rengE.paso + 1, rengTotal))
export const rengAnterior = (rengE: RengEstadoSecuencia, rengTotal: number): RengEstadoSecuencia => rengIrA(rengE, rengE.paso - 1, rengTotal)

export const rengProgresoTotal = (rengE: RengEstadoSecuencia, rengTotal: number): number => (rengTotal <= 0 ? 0 : Math.min(1, (rengE.paso + rengE.t) / rengTotal))
