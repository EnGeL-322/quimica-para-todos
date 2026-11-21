export type RengDimension = readonly [number, number, number, number, number, number, number, number]

export const RENG_BASES = ['L', 'M', 'T', 'I', 'Θ', 'N', 'J', 'ángulo'] as const

export const RENG_ADIMENSIONAL: RengDimension = [0, 0, 0, 0, 0, 0, 0, 0]

export function rengDim(rengE: Partial<Record<'L' | 'M' | 'T' | 'I' | 'Θ' | 'N' | 'J' | 'A', number>>): RengDimension {
  return [rengE.L ?? 0, rengE.M ?? 0, rengE.T ?? 0, rengE.I ?? 0, rengE['Θ'] ?? 0, rengE.N ?? 0, rengE.J ?? 0, rengE.A ?? 0]
}

export const rengDimMul = (rengA: RengDimension, rengB: RengDimension): RengDimension => rengA.map((rengX, rengI) => rengX + (rengB[rengI] ?? 0)) as unknown as RengDimension
export const rengDimDiv = (rengA: RengDimension, rengB: RengDimension): RengDimension => rengA.map((rengX, rengI) => rengX - (rengB[rengI] ?? 0)) as unknown as RengDimension
export const rengDimPow = (rengA: RengDimension, rengN: number): RengDimension => rengA.map((rengX) => rengX * rengN) as unknown as RengDimension
export const rengDimIgual = (rengA: RengDimension, rengB: RengDimension): boolean => rengA.every((rengX, rengI) => Math.abs(rengX - (rengB[rengI] ?? 0)) < 1e-12)
export const rengEsAdimensional = (rengA: RengDimension): boolean => rengDimIgual(rengA, RENG_ADIMENSIONAL)

const RENG_SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '.': '·', '/': 'ᐟ' }
export const rengSuperindice = (rengN: number): string => (rengN === 1 ? '' : String(rengN).replace(/./g, (rengC) => RENG_SUP[rengC] ?? rengC))

export function rengFormatearDimension(rengD: RengDimension): string {
  const rengPartes = RENG_BASES.slice(0, 7)
    .map((rengB, rengI) => [rengB, rengD[rengI] ?? 0] as const)
    .filter(([, rengE]) => rengE !== 0)
    .map(([rengB, rengE]) => `${rengB}${rengSuperindice(rengE)}`)
  const rengBase = `[${rengPartes.length ? rengPartes.join('·') : '1'}]`
  const rengA = rengD[7] ?? 0
  return rengA === 0 ? rengBase : `${rengBase} · ángulo${rengSuperindice(rengA)}`
}
