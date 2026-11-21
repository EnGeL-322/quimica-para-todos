import { rengMezclar, rengTramo } from './secuenciador'

export const RENG_LEJOS = 3.2

export function rengDistanciaEnlace(rengS: number, rengRe: number): number {
  if (rengS < 1) return RENG_LEJOS * rengRe
  if (rengS < 2) return rengMezclar(RENG_LEJOS * rengRe, rengRe, rengTramo(rengS, 1, 2))
  if (rengS < 3) {
    const rengU = rengS - 2
    return rengRe * (1 + 0.12 * Math.sin(2 * Math.PI * 3 * rengU) * (1 - rengU))
  }
  return rengRe
}

export function rengDistanciaMultiple(rengS: number, RENG_L: number): number {
  return rengMezclar(2.4 * RENG_L, RENG_L, rengTramo(rengS, 2, 2.8))
}

export function rengGiroBloqueado(rengS: number): number {
  if (rengS < 4 || rengS > 5) return 0
  const rengU = rengS - 4
  return ((40 * Math.PI) / 180) * Math.sin(Math.PI * Math.min(1, rengU * 1.25)) * (rengU < 0.8 ? 1 : (1 - rengU) / 0.2)
}

export { rengAleatorio } from '../nucleo/aleatorio'
