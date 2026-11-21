import type { RengOrden } from '../nucleo/cinetica'

export interface RengCalibracion {
  c: number[]
  y: number[]
  m: number
  b: number
  sr: number
  sxx: number
  ym: number
  xm: number
}

export function rengRegresionLineal(rengX: number[], rengY: number[]): RengCalibracion {
  const rengN = rengX.length
  const rengXm = rengX.reduce((rengA, rengB) => rengA + rengB, 0) / rengN
  const rengYm = rengY.reduce((rengA, rengB) => rengA + rengB, 0) / rengN
  let rengSxx = 0
  let rengSxy = 0
  for (let rengI = 0; rengI < rengN; rengI++) {
    rengSxx += (rengX[rengI]! - rengXm) ** 2
    rengSxy += (rengX[rengI]! - rengXm) * (rengY[rengI]! - rengYm)
  }
  const rengM = rengSxy / rengSxx
  const rengB = rengYm - rengM * rengXm
  const rengSsr = rengX.reduce((rengA, rengXi, rengI) => rengA + (rengY[rengI]! - (rengB + rengM * rengXi)) ** 2, 0)
  return { c: rengX, y: rengY, m: rengM, b: rengB, sr: Math.sqrt(rengSsr / (rengN - 2)), sxx: rengSxx, ym: rengYm, xm: rengXm }
}

export function rengIncertidumbreInterpolada(rengCal: RengCalibracion, rengY0: number, rengReplicas = 1): number {
  return (rengCal.sr / Math.abs(rengCal.m)) * Math.sqrt(1 / rengReplicas + 1 / rengCal.c.length + (rengY0 - rengCal.ym) ** 2 / (rengCal.m ** 2 * rengCal.sxx))
}

function rengLinealizar(rengOrden: RengOrden, rengT: number[], rengA: number[]): number[] {
  return rengA.map((rengX) => (rengOrden === 0 ? rengX : rengOrden === 1 ? Math.log(rengX) : 1 / rengX))
}

export function rengAjustarOrdenes(rengT: number[], rengA: number[]): Array<{ orden: RengOrden; r2: number; k: number; pendiente: number; ordenada: number }> {
  return ([0, 1, 2] as RengOrden[]).map((rengO) => {
    const rengYl = rengLinealizar(rengO, rengT, rengA)
    const rengReg = rengRegresionLineal(rengT, rengYl)
    const rengSst = rengYl.reduce((rengS, rengY) => rengS + (rengY - rengReg.ym) ** 2, 0)
    const rengSsr = rengYl.reduce((rengS, rengY, rengI) => rengS + (rengY - (rengReg.b + rengReg.m * rengT[rengI]!)) ** 2, 0)
    return { orden: rengO, r2: 1 - rengSsr / rengSst, k: rengO === 2 ? rengReg.m : -rengReg.m, pendiente: rengReg.m, ordenada: rengReg.b }
  })
}
