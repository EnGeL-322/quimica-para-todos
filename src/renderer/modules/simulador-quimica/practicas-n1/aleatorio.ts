import { rengCrearAzar, rengElegir, rengEntre } from '../practica/numeros'
import { RENG_SEMILLA_MAXIMA_N1 } from './tipos'

export type RengGeneradorN1 = () => number

export const rengSemillaValidaN1 = (rengS: unknown): rengS is number => typeof rengS === 'number' && Number.isSafeInteger(rengS) && rengS >= 0 && rengS <= RENG_SEMILLA_MAXIMA_N1

export function rengHashTextoN1(rengTexto: string): number {
  let rengH = 2166136261
  for (let rengI = 0; rengI < rengTexto.length; rengI++) {
    rengH ^= rengTexto.charCodeAt(rengI)
    rengH = Math.imul(rengH, 16777619)
  }
  return rengH >>> 0
}

export function rengGeneradorN1(rengId: string, rengSemilla: number): RengGeneradorN1 {
  if (!rengSemillaValidaN1(rengSemilla)) throw new RangeError(`Semilla no válida: ${String(rengSemilla)}`)
  return rengCrearAzar((rengHashTextoN1(rengId) ^ Math.imul(rengSemilla + 1, 2654435761)) >>> 0)
}

export const rengUnoDe = <T>(rengRng: RengGeneradorN1, rengLista: readonly T[]): T => rengElegir(rengRng, rengLista)

export const rengEntreN1 = (rengRng: RengGeneradorN1, rengMin: number, rengMax: number, rengPaso: number): number => rengEntre(rengRng, rengMin, rengMax, rengPaso)

export const rengIndice = (rengRng: RengGeneradorN1, rengN: number): number => Math.min(rengN - 1, Math.floor(rengRng() * rengN))

export function rengGenerarValidaN1<T>(rengRng: RengGeneradorN1, rengFabricar: () => T, rengEsValida: (rengX: T) => boolean, rengIntentos = 400): T {
  for (let rengI = 0; rengI < rengIntentos; rengI++) {
    const rengX = rengFabricar()
    if (rengEsValida(rengX)) return rengX
  }
  throw new RangeError('No se encontró una combinación válida de datos para esta semilla')
}
