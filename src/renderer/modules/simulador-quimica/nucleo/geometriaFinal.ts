import { rengDetectarEnlaces, RENG_MOLECULAS } from '../chemistry'
import { rengDescribirOptimizacion, rengGeometria3D } from './molecula'

type RengV = [number, number, number]

export interface RengGrafoSimple {
  el: readonly string[]
  enlaces: ReadonlyArray<readonly [number, number]>
}

export interface RengObjetivo extends RengGrafoSimple {
  pos: RengV[]
  origen: 'experimental' | 'calculada'
}

export function rengEmparejar(rengA: RengGrafoSimple, rengB: RengGrafoSimple): number[] | null {
  const rengN = rengA.el.length
  if (rengN !== rengB.el.length || rengA.enlaces.length !== rengB.enlaces.length) return null
  const rengVec = (rengG: RengGrafoSimple): Array<Set<number>> => {
    const rengV = Array.from({ length: rengG.el.length }, () => new Set<number>())
    for (const [rengX, rengY] of rengG.enlaces) {
      rengV[rengX]!.add(rengY)
      rengV[rengY]!.add(rengX)
    }
    return rengV
  }
  const rengVa = rengVec(rengA)
  const rengVb = rengVec(rengB)
  const rengOrden = [...Array(rengN).keys()].sort((rengX, rengY) => rengVa[rengY]!.size - rengVa[rengX]!.size)
  const rengMapa = new Array<number>(rengN).fill(-1)
  const rengUsado = new Set<number>()
  const rengProbar = (rengK: number): boolean => {
    if (rengK === rengN) return true
    const rengI = rengOrden[rengK]!
    for (let rengJ = 0; rengJ < rengN; rengJ++) {
      if (rengUsado.has(rengJ) || rengB.el[rengJ] !== rengA.el[rengI] || rengVb[rengJ]!.size !== rengVa[rengI]!.size) continue
      let rengOk = true
      for (const rengW of rengVa[rengI]!) if (rengMapa[rengW]! >= 0 && !rengVb[rengJ]!.has(rengMapa[rengW]!)) rengOk = false
      if (!rengOk) continue
      rengMapa[rengI] = rengJ
      rengUsado.add(rengJ)
      if (rengProbar(rengK + 1)) return true
      rengMapa[rengI] = -1
      rengUsado.delete(rengJ)
    }
    return false
  }
  return rengProbar(0) ? rengMapa : null
}

function rengVectorPropioMayor(RENG_M: number[][]): number[] {
  const RENG_A = RENG_M.map((rengF) => [...rengF])
  const RengVm: number[][] = [0, 1, 2, 3].map((rengI) => [0, 1, 2, 3].map((rengJ) => (rengI === rengJ ? 1 : 0)))
  for (let rengIt = 0; rengIt < 60; rengIt++) {
    let rengP: number = 0
    let rengQ: number = 1
    for (let rengI = 0; rengI < 4; rengI++)
      for (let rengJ = rengI + 1; rengJ < 4; rengJ++)
        if (Math.abs(RENG_A[rengI]![rengJ]!) > Math.abs(RENG_A[rengP]![rengQ]!)) {
          rengP = rengI
          rengQ = rengJ
        }
    if (Math.abs(RENG_A[rengP]![rengQ]!) < 1e-12) break
    const rengTh = 0.5 * Math.atan2(2 * RENG_A[rengP]![rengQ]!, RENG_A[rengQ]![rengQ]! - RENG_A[rengP]![rengP]!)
    const rengC = Math.cos(rengTh)
    const rengS = Math.sin(rengTh)
    for (let rengK = 0; rengK < 4; rengK++) {
      const rengAkp = RENG_A[rengK]![rengP]!
      const rengAkq = RENG_A[rengK]![rengQ]!
      RENG_A[rengK]![rengP] = rengC * rengAkp - rengS * rengAkq
      RENG_A[rengK]![rengQ] = rengS * rengAkp + rengC * rengAkq
    }
    for (let rengK = 0; rengK < 4; rengK++) {
      const rengApk = RENG_A[rengP]![rengK]!
      const rengAqk = RENG_A[rengQ]![rengK]!
      RENG_A[rengP]![rengK] = rengC * rengApk - rengS * rengAqk
      RENG_A[rengQ]![rengK] = rengS * rengApk + rengC * rengAqk
    }
    for (let rengK = 0; rengK < 4; rengK++) {
      const rengVkp = RengVm[rengK]![rengP]!
      const rengVkq = RengVm[rengK]![rengQ]!
      RengVm[rengK]![rengP] = rengC * rengVkp - rengS * rengVkq
      RengVm[rengK]![rengQ] = rengS * rengVkp + rengC * rengVkq
    }
  }
  let rengMejor = 0
  for (let rengI = 1; rengI < 4; rengI++) if (RENG_A[rengI]![rengI]! > RENG_A[rengMejor]![rengMejor]!) rengMejor = rengI
  return [0, 1, 2, 3].map((rengK) => RengVm[rengK]![rengMejor]!)
}

const rengCentro = (rengP: readonly RengV[]): RengV => {
  const rengC: RengV = [0, 0, 0]
  for (const rengX of rengP) for (let rengK = 0; rengK < 3; rengK++) rengC[rengK]! += rengX[rengK]! / rengP.length
  return rengC
}

export function rengAlinear(rengObjetivo: readonly RengV[], rengActual: readonly RengV[]): RengV[] {
  const rengCo = rengCentro(rengObjetivo)
  const rengCa = rengCentro(rengActual)
  const rengO = rengObjetivo.map((rengX) => rengX.map((rengV, rengK) => rengV - rengCo[rengK]!) as RengV)
  const rengA = rengActual.map((rengX) => rengX.map((rengV, rengK) => rengV - rengCa[rengK]!) as RengV)
  const RENG_S = [0, 1, 2].map((rengI) => [0, 1, 2].map((rengJ) => rengO.reduce((rengS, rengX, rengN) => rengS + rengX[rengI]! * rengA[rengN]![rengJ]!, 0)))
  const [[rengXx, rengXy, rengXz], [rengYx, rengYy, rengYz], [rengZx, rengZy, rengZz]] = RENG_S as [[number, number, number], [number, number, number], [number, number, number]]
  const RENG_N = [
    [rengXx + rengYy + rengZz, rengYz - rengZy, rengZx - rengXz, rengXy - rengYx],
    [rengYz - rengZy, rengXx - rengYy - rengZz, rengXy + rengYx, rengZx + rengXz],
    [rengZx - rengXz, rengXy + rengYx, -rengXx + rengYy - rengZz, rengYz + rengZy],
    [rengXy - rengYx, rengZx + rengXz, rengYz + rengZy, -rengXx - rengYy + rengZz]
  ]
  const [rengW, rengX, rengY, rengZ] = rengVectorPropioMayor(RENG_N) as [number, number, number, number]
  const RENG_R = [
    [rengW * rengW + rengX * rengX - rengY * rengY - rengZ * rengZ, 2 * (rengX * rengY - rengW * rengZ), 2 * (rengX * rengZ + rengW * rengY)],
    [2 * (rengX * rengY + rengW * rengZ), rengW * rengW - rengX * rengX + rengY * rengY - rengZ * rengZ, 2 * (rengY * rengZ - rengW * rengX)],
    [2 * (rengX * rengZ - rengW * rengY), 2 * (rengY * rengZ + rengW * rengX), rengW * rengW - rengX * rengX - rengY * rengY + rengZ * rengZ]
  ]
  return rengO.map((rengP) => [0, 1, 2].map((rengI) => RENG_R[rengI]![0]! * rengP[0] + RENG_R[rengI]![1]! * rengP[1] + RENG_R[rengI]![2]! * rengP[2] + rengCa[rengI]!) as RengV)
}

export function rengObjetivoConDiagnostico(rengIdExperimental: string | null, rengSmiles: string | null): { objetivo: RengObjetivo | null; motivo: string | null } {
  if (rengIdExperimental) {
    const rengM = RENG_MOLECULAS.find((rengX) => rengX.id === rengIdExperimental)
    if (rengM) {
      const rengEnl = rengM.enlaces?.map((rengE) => [rengE.a, rengE.b] as const) ?? rengDetectarEnlaces(rengM.atomos).map((rengE) => [rengE.a, rengE.b] as const)
      return { objetivo: { el: rengM.atomos.map((rengX) => rengX.el), enlaces: rengEnl, pos: rengM.atomos.map((rengX) => [...rengX.p] as RengV), origen: 'experimental' }, motivo: null }
    }
  }
  if (!rengSmiles) return { objetivo: null, motivo: null }
  let rengG
  try {
    rengG = rengGeometria3D(rengSmiles)
  } catch {
    return { objetivo: null, motivo: null }
  }
  if (!rengG.optimizacion?.convergio) return { objetivo: null, motivo: `No se muestra la forma real: ${rengDescribirOptimizacion(rengG.optimizacion)}` }
  return { objetivo: { el: rengG.atomos.map((rengX) => rengX.el), enlaces: rengG.enlaces.map((rengE) => [rengE.a, rengE.b] as const), pos: rengG.atomos.map((rengX) => [rengX.x, rengX.y, rengX.z] as RengV), origen: 'calculada' }, motivo: null }
}

export const rengObjetivoPara = (rengIdExperimental: string | null, rengSmiles: string | null): RengObjetivo | null => rengObjetivoConDiagnostico(rengIdExperimental, rengSmiles).objetivo

export function rengPosicionesFinales(rengActual: RengGrafoSimple & { pos: readonly RengV[] }, rengObj: RengObjetivo): RengV[] | null {
  const rengMapa = rengEmparejar(rengActual, rengObj)
  if (!rengMapa) return null
  const rengObjetivoEnOrden = rengMapa.map((rengJ) => rengObj.pos[rengJ]!)
  return rengAlinear(rengObjetivoEnOrden, rengActual.pos)
}
