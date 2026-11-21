export interface RengRacional {
  n: bigint
  d: bigint
}

export function rengMcd(rengA: bigint, rengB: bigint): bigint {
  rengA = rengA < 0n ? -rengA : rengA
  rengB = rengB < 0n ? -rengB : rengB
  while (rengB !== 0n) [rengA, rengB] = [rengB, rengA % rengB]
  return rengA
}

export function rengMcm(rengA: bigint, rengB: bigint): bigint {
  if (rengA === 0n || rengB === 0n) return 0n
  const rengM = (rengA / rengMcd(rengA, rengB)) * rengB
  return rengM < 0n ? -rengM : rengM
}

export function rengQ(rengN: bigint | number, rengD: bigint | number = 1n): RengRacional {
  let RENG_N = BigInt(rengN)
  let RENG_D = BigInt(rengD)
  if (RENG_D === 0n) throw new Error('División entre cero en aritmética racional.')
  if (RENG_D < 0n) {
    RENG_N = -RENG_N
    RENG_D = -RENG_D
  }
  const rengG = rengMcd(RENG_N, RENG_D) || 1n
  return { n: RENG_N / rengG, d: RENG_D / rengG }
}

export const RENG_CERO = rengQ(0)
export const RENG_UNO = rengQ(1)
export const rengSuma = (rengA: RengRacional, rengB: RengRacional): RengRacional => rengQ(rengA.n * rengB.d + rengB.n * rengA.d, rengA.d * rengB.d)
export const rengResta = (rengA: RengRacional, rengB: RengRacional): RengRacional => rengQ(rengA.n * rengB.d - rengB.n * rengA.d, rengA.d * rengB.d)
export const rengMul = (rengA: RengRacional, rengB: RengRacional): RengRacional => rengQ(rengA.n * rengB.n, rengA.d * rengB.d)
export const rengDiv = (rengA: RengRacional, rengB: RengRacional): RengRacional => rengQ(rengA.n * rengB.d, rengA.d * rengB.n)
export const rengEsCero = (rengA: RengRacional): boolean => rengA.n === 0n
export const rengANumero = (rengA: RengRacional): number => Number(rengA.n) / Number(rengA.d)

export function rengEspacioNulo(rengMatriz: RengRacional[][], rengColumnas: number): RengRacional[][] {
  const RENG_A = rengMatriz.map((rengF) => rengF.slice())
  const rengPivotes: number[] = []
  let rengFila = 0
  for (let rengC = 0; rengC < rengColumnas && rengFila < RENG_A.length; rengC++) {
    let rengP = -1
    for (let rengR = rengFila; rengR < RENG_A.length; rengR++) if (!rengEsCero(RENG_A[rengR]![rengC]!)) {
      rengP = rengR
      break
    }
    if (rengP < 0) continue
    ;[RENG_A[rengFila], RENG_A[rengP]] = [RENG_A[rengP]!, RENG_A[rengFila]!]
    const rengPiv = RENG_A[rengFila]![rengC]!
    RENG_A[rengFila] = RENG_A[rengFila]!.map((rengX) => rengDiv(rengX, rengPiv))
    for (let rengR = 0; rengR < RENG_A.length; rengR++) {
      if (rengR === rengFila || rengEsCero(RENG_A[rengR]![rengC]!)) continue
      const rengF = RENG_A[rengR]![rengC]!
      RENG_A[rengR] = RENG_A[rengR]!.map((rengX, rengK) => rengResta(rengX, rengMul(rengF, RENG_A[rengFila]![rengK]!)))
    }
    rengPivotes.push(rengC)
    rengFila++
  }
  const rengLibres = Array.from({ length: rengColumnas }, (_, rengI) => rengI).filter((rengC) => !rengPivotes.includes(rengC))
  return rengLibres.map((rengLibre) => {
    const rengV: RengRacional[] = Array.from({ length: rengColumnas }, () => RENG_CERO)
    rengV[rengLibre] = RENG_UNO
    rengPivotes.forEach((rengPc, rengR) => {
      rengV[rengPc] = rengQ(-RENG_A[rengR]![rengLibre]!.n, RENG_A[rengR]![rengLibre]!.d)
    })
    return rengV
  })
}

export function rengAEnteros(rengV: RengRacional[]): bigint[] {
  const rengDen = rengV.reduce((rengAcc, rengX) => rengMcm(rengAcc, rengX.d), 1n)
  const rengEnts = rengV.map((rengX) => (rengX.n * rengDen) / rengX.d)
  const rengG = rengEnts.reduce((rengAcc, rengX) => rengMcd(rengAcc, rengX), 0n) || 1n
  return rengEnts.map((rengX) => rengX / rengG)
}
