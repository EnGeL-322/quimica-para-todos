import * as THREE from 'three'
import { rengCapas, rengPorSimbolo } from '../../tabla-periodica/data'
import { RENG_ELEMENTOS } from '../chemistry'

export const rengColor = (rengEl: string): number => RENG_ELEMENTOS[rengEl]?.color ?? 0x9aa3b5
export const rengRc = (rengEl: string): number => RENG_ELEMENTOS[rengEl]?.rc ?? 0.8
export const rengRadioNucleo = (rengEl: string): number => Math.max(0.16, rengRc(rengEl) * 0.42)
export const rengRadioNube = (rengEl: string): number => Math.max(0.42, rengRc(rengEl) * 0.95)
export const rengRadioPunto = (rengEl: string): number => Math.max(0.42, rengRc(rengEl) * 1.05)

export function rengValencia(rengEl: string): number {
  const rengC = rengCapas(rengPorSimbolo.get(rengEl)!.z)
  return rengC[rengC.length - 1] ?? 0
}

const RENG_Z = new THREE.Vector3(0, 0, 1)
const RENG_X = new THREE.Vector3(1, 0, 0)

export function rengPerpendicular(rengB: THREE.Vector3): THREE.Vector3 {
  const rengP = new THREE.Vector3().crossVectors(rengB, RENG_Z)
  if (rengP.lengthSq() < 1e-8) rengP.crossVectors(rengB, RENG_X)
  return rengP.normalize()
}

export function rengHuecos(rengEnlaces: THREE.Vector3[]): THREE.Vector3[] {
  const rengBs = rengEnlaces.map((rengE) => rengE.clone().normalize())
  if (rengBs.length === 1) {
    const rengB = rengBs[0]!
    const rengP = rengPerpendicular(rengB)
    return [rengB, rengB.clone().negate(), rengP, rengP.clone().negate()]
  }
  if (rengBs.length === 2) {
    const [rengB1, rengB2] = rengBs as [THREE.Vector3, THREE.Vector3]
    if (Math.abs(rengB1.dot(rengB2)) > 0.99) {
      const rengP1 = rengPerpendicular(rengB1)
      const rengP2 = new THREE.Vector3().crossVectors(rengB1, rengP1).normalize()
      return [rengB1, rengB2, rengP1, rengP2]
    }
    const rengM = rengB1.clone().add(rengB2).normalize()
    const rengN = new THREE.Vector3().crossVectors(rengB1, rengB2).normalize()
    const rengT = (54.75 * Math.PI) / 180
    const rengL1 = rengM.clone().multiplyScalar(-Math.cos(rengT)).addScaledVector(rengN, Math.sin(rengT)).normalize()
    const rengL2 = rengM.clone().multiplyScalar(-Math.cos(rengT)).addScaledVector(rengN, -Math.sin(rengT)).normalize()
    return [rengB1, rengB2, rengL1, rengL2]
  }
  if (rengBs.length === 3) {
    const rengN = new THREE.Vector3().crossVectors(rengBs[0]!, rengBs[1]!).normalize()
    return [...rengBs, rengN]
  }
  return rengBs.slice(0, 4)
}

export function rengRepartoLewis(rengV: number, rengK: number): number[] {
  const rengCuenta: number[] = [0, 1, 2, 3].map((rengJ) => (rengJ < rengK ? 1 : 0))
  let rengResto = rengV - rengK
  for (let rengJ = rengK; rengJ < 4 && rengResto > 0; rengJ++, rengResto--) rengCuenta[rengJ] = 1
  for (let rengJ = rengK; rengJ < 4 && rengResto > 0; rengJ++, rengResto--) rengCuenta[rengJ] = 2
  return rengCuenta
}

export function rengPosicionPunto(rengBase: THREE.Vector3, rengDir: THREE.Vector3, rengR: number, rengLado: number, rengSeparacion = 0.11): THREE.Vector3 {
  return rengBase.clone().addScaledVector(rengDir, rengR).addScaledVector(rengPerpendicular(rengDir), rengSeparacion * rengLado)
}
