import { rengPorSimbolo } from '../../tabla-periodica/data'
import { rengDatos3D } from './elementos3d'
import type { RengTipoUnion } from './enlazar'

type RengV = [number, number, number]

export interface RengEnlaceRelajar {
  a: number
  b: number
  orden: number
  tipo: RengTipoUnion
}

export function rengElectronesValencia(rengEl: string): number | null {
  const rengG = rengPorSimbolo.get(rengEl)?.grupo ?? null
  if (rengEl === 'H') return 1
  if (rengG === null || (rengG >= 3 && rengG <= 12)) return null
  return rengG <= 2 ? rengG : rengG - 10
}

export function rengParesSolitarios(rengEl: string, rengOrden: number, rengCarga: number): number {
  const rengE = rengElectronesValencia(rengEl)
  if (rengE === null || rengEl === 'H') return 0
  return Math.max(0, Math.floor((rengE - rengCarga - rengOrden) / 2))
}

export function rengAnguloIdeal(rengNumeroEsterico: number): number {
  if (rengNumeroEsterico <= 2) return 180
  if (rengNumeroEsterico === 3) return 120
  if (rengNumeroEsterico === 4) return 109.47
  return 90
}

export const rengLongitudEnlace = (rengA: string, rengB: string): number => (rengDatos3D.get(rengA)?.rc ?? 0.75) + (rengDatos3D.get(rengB)?.rc ?? 0.75)

export function rengRelajar(
  rengPosiciones: ReadonlyArray<readonly [number, number, number]>,
  rengElementos: readonly string[],
  rengCargas: readonly number[],
  rengEnlaces: readonly RengEnlaceRelajar[],
  rengOpciones: { pasos?: number; fijos?: ReadonlySet<number> } = {}
): Array<[number, number, number]> {
  const rengN = rengPosiciones.length
  const rengP: RengV[] = rengPosiciones.map((rengX, rengI) => [rengX[0] + 0.02 * Math.sin(rengI * 1.7 + 0.3), rengX[1] + 0.02 * Math.cos(rengI * 2.3 + 0.1), rengX[2] + 0.02 * Math.sin(rengI * 0.9 + 0.7)])
  const rengFijos = rengOpciones.fijos ?? new Set<number>()
  const rengVecinos: number[][] = Array.from({ length: rengN }, () => [])
  const rengOrden = new Array<number>(rengN).fill(0)
  for (const rengE of rengEnlaces) {
    rengVecinos[rengE.a]!.push(rengE.b)
    rengVecinos[rengE.b]!.push(rengE.a)
    if (rengE.tipo !== 'ionico' && rengE.tipo !== 'metalico') {
      rengOrden[rengE.a]! += rengE.orden
      rengOrden[rengE.b]! += rengE.orden
    }
  }
  const rengMuelles: Array<{ i: number; j: number; L: number; k: number }> = []
  for (const rengE of rengEnlaces) rengMuelles.push({ i: rengE.a, j: rengE.b, L: rengLongitudEnlace(rengElementos[rengE.a]!, rengElementos[rengE.b]!), k: 0.5 })
  for (let rengC = 0; rengC < rengN; rengC++) {
    const rengV = rengVecinos[rengC]!
    const rengCovalente = rengEnlaces.filter((rengE) => (rengE.a === rengC || rengE.b === rengC) && rengE.tipo !== 'ionico' && rengE.tipo !== 'metalico').length === rengV.length
    if (rengV.length < 2 || !rengCovalente) continue
    const rengNe = rengV.length + rengParesSolitarios(rengElementos[rengC]!, rengOrden[rengC]!, rengCargas[rengC] ?? 0)
    const rengTh = (rengAnguloIdeal(rengNe) * Math.PI) / 180
    for (let rengX = 0; rengX < rengV.length; rengX++)
      for (let rengY = rengX + 1; rengY < rengV.length; rengY++) {
        const rengL1 = rengLongitudEnlace(rengElementos[rengC]!, rengElementos[rengV[rengX]!]!)
        const rengL2 = rengLongitudEnlace(rengElementos[rengC]!, rengElementos[rengV[rengY]!]!)
        rengMuelles.push({ i: rengV[rengX]!, j: rengV[rengY]!, L: Math.sqrt(rengL1 * rengL1 + rengL2 * rengL2 - 2 * rengL1 * rengL2 * Math.cos(rengTh)), k: rengNe <= 2 ? 0.6 : 0.25 })
      }
  }
  const rengLineales: Array<[number, number, number]> = []
  for (let rengC = 0; rengC < rengN; rengC++) {
    const rengV = rengVecinos[rengC]!
    if (rengV.length === 2 && rengV.length + rengParesSolitarios(rengElementos[rengC]!, rengOrden[rengC]!, rengCargas[rengC] ?? 0) === 2) rengLineales.push([rengC, rengV[0]!, rengV[1]!])
  }
  const rengPasos = rengOpciones.pasos ?? 80
  for (let rengIt = 0; rengIt < rengPasos; rengIt++) {
    const rengF: RengV[] = rengP.map(() => [0, 0, 0])
    for (const rengM of rengMuelles) {
      const rengD: RengV = [rengP[rengM.j]![0] - rengP[rengM.i]![0], rengP[rengM.j]![1] - rengP[rengM.i]![1], rengP[rengM.j]![2] - rengP[rengM.i]![2]]
      const rengR = Math.hypot(...rengD) || 1e-6
      const rengS = (rengM.k * (rengR - rengM.L)) / rengR
      for (let rengK = 0; rengK < 3; rengK++) {
        rengF[rengM.i]![rengK]! += rengS * rengD[rengK]!
        rengF[rengM.j]![rengK]! -= rengS * rengD[rengK]!
      }
    }
    for (let rengI = 0; rengI < rengN; rengI++)
      for (let rengJ = rengI + 1; rengJ < rengN; rengJ++) {
        if (rengVecinos[rengI]!.includes(rengJ)) continue
        const rengD: RengV = [rengP[rengJ]![0] - rengP[rengI]![0], rengP[rengJ]![1] - rengP[rengI]![1], rengP[rengJ]![2] - rengP[rengI]![2]]
        const rengR = Math.hypot(...rengD) || 1e-6
        if (rengR > 1.6) continue
        const rengS = (0.08 * (1.6 - rengR)) / rengR
        for (let rengK = 0; rengK < 3; rengK++) {
          rengF[rengI]![rengK]! -= rengS * rengD[rengK]!
          rengF[rengJ]![rengK]! += rengS * rengD[rengK]!
        }
      }
    for (const [rengC, rengX, rengY] of rengLineales)
      for (let rengK = 0; rengK < 3; rengK++) {
        const rengD = 0.3 * ((rengP[rengX]![rengK]! + rengP[rengY]![rengK]!) / 2 - rengP[rengC]![rengK]!)
        rengF[rengC]![rengK]! += rengD
        rengF[rengX]![rengK]! -= rengD / 2
        rengF[rengY]![rengK]! -= rengD / 2
      }
    for (let rengI = 0; rengI < rengN; rengI++) if (!rengFijos.has(rengI)) for (let rengK = 0; rengK < 3; rengK++) rengP[rengI]![rengK]! += rengF[rengI]![rengK]!
  }
  return rengP
}

export function rengAngulo(rengP: ReadonlyArray<readonly number[]>, rengA: number, rengV: number, rengB: number): number {
  const rengU = [0, 1, 2].map((rengK) => rengP[rengA]![rengK]! - rengP[rengV]![rengK]!)
  const rengW = [0, 1, 2].map((rengK) => rengP[rengB]![rengK]! - rengP[rengV]![rengK]!)
  const rengD = rengU[0]! * rengW[0]! + rengU[1]! * rengW[1]! + rengU[2]! * rengW[2]!
  return (Math.acos(Math.max(-1, Math.min(1, rengD / (Math.hypot(...rengU) * Math.hypot(...rengW))))) * 180) / Math.PI
}
