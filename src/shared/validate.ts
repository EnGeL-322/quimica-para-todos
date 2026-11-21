import { RengAppError } from './ipc'

const rengBad = (rengCampo: string, rengWhy: string): never => {
  throw new RengAppError('VALIDATION', `Dato inválido en «${rengCampo}»: ${rengWhy}`)
}

export function rengAsObject(rengV: unknown, rengCampo = 'payload'): Record<string, unknown> {
  if (typeof rengV !== 'object' || rengV === null || Array.isArray(rengV)) return rengBad(rengCampo, 'se esperaba un objeto')
  return rengV as Record<string, unknown>
}

export function rengAsString(rengV: unknown, rengCampo: string, rengOpts: { max?: number; min?: number } = {}): string {
  if (typeof rengV !== 'string') return rengBad(rengCampo, 'se esperaba texto')
  const { max: rengMax = 100_000, min: rengMin = 0 } = rengOpts
  if (rengV.length < rengMin) return rengBad(rengCampo, `mínimo ${rengMin} caracteres`)
  if (rengV.length > rengMax) return rengBad(rengCampo, `máximo ${rengMax} caracteres`)
  return rengV
}

export function rengAsInt(rengV: unknown, rengCampo: string, rengMin: number, rengMax: number): number {
  if (typeof rengV !== 'number' || !Number.isInteger(rengV)) return rengBad(rengCampo, 'se esperaba un entero')
  if (rengV < rengMin || rengV > rengMax) return rengBad(rengCampo, `debe estar entre ${rengMin} y ${rengMax}`)
  return rengV
}

export function rengAsBool(rengV: unknown, rengCampo: string): boolean {
  if (typeof rengV !== 'boolean') return rengBad(rengCampo, 'se esperaba verdadero/falso')
  return rengV
}

export function rengAsEnum<RengT extends string>(rengV: unknown, rengCampo: string, rengValid: readonly RengT[]): RengT {
  if (typeof rengV !== 'string' || !rengValid.includes(rengV as RengT)) return rengBad(rengCampo, `valores permitidos: ${rengValid.join(', ')}`)
  return rengV as RengT
}

export function rengAsStringArray(rengV: unknown, rengCampo: string, rengOpts: { maxItems?: number; maxLen?: number } = {}): string[] {
  if (!Array.isArray(rengV)) return rengBad(rengCampo, 'se esperaba una lista')
  const { maxItems: rengMaxItems = 500, maxLen: rengMaxLen = 4096 } = rengOpts
  if (rengV.length > rengMaxItems) return rengBad(rengCampo, `máximo ${rengMaxItems} elementos`)
  return rengV.map((rengX, rengI) => rengAsString(rengX, `${rengCampo}[${rengI}]`, { max: rengMaxLen }))
}
