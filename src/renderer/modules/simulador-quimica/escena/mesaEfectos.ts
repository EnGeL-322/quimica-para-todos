import * as THREE from 'three'
import { rengDisposeObject } from '../../../lib/three/dispose'
import { rengClase } from '../nucleo/constructor'
import { rengElectronegatividad } from '../nucleo/electronegatividad'
import type { RengEnlaceMesa, RengMesa } from '../nucleo/mesa'
import { rengEtiqueta, type RengPaleta } from './util3d'

interface RengTransitorio {
  obj: THREE.Object3D
  t: number
  dur: number
  paso: (rengU: number) => void
}

const rengMaterial = (rengColor: number, rengOpacidad: number): THREE.MeshStandardMaterial =>
  new THREE.MeshStandardMaterial({ color: rengColor, transparent: true, opacity: rengOpacidad, depthWrite: false, emissive: rengColor, emissiveIntensity: 0.35 })

export class RengEfectosMesa {
  private transitorios: RengTransitorio[] = []
  private deltas = new Map<number, { sprite: THREE.Sprite; signo: number }>()
  private reloj = 0
  private mares: THREE.Object3D[] = []

  constructor(
    private rengGrupo: THREE.Group,
    private rengPaleta: RengPaleta,
    private rengPos: (rengId: number) => THREE.Vector3 | null,
    private rengRadio: (rengId: number) => number
  ) {}

  private rengAnimar(rengObj: THREE.Object3D, rengDur: number, rengPaso: (rengU: number) => void): void {
    this.rengGrupo.add(rengObj)
    this.transitorios.push({ obj: rengObj, t: 0, dur: rengDur, paso: rengPaso })
    rengPaso(0)
  }

  rengAlFormar(rengE: RengEnlaceMesa, rengReducido: boolean): void {
    if (rengReducido) return
    const rengPa = (): THREE.Vector3 => this.rengPos(rengE.a) ?? new THREE.Vector3()
    const rengPb = (): THREE.Vector3 => this.rengPos(rengE.b) ?? new THREE.Vector3()
    if (rengE.tipo === 'ionico') {
      const [rengDe, rengA] = this.rengEsMetal(rengE.a) ? [rengPa, rengPb] : [rengPb, rengPa]
      const rengEl = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), rengMaterial(this.rengPaleta.electron, 1))
      this.rengAnimar(rengEl, 0.6, (rengU) => rengEl.position.copy(rengDe()).lerp(rengA(), rengU).add(new THREE.Vector3(0, Math.sin(rengU * Math.PI) * 0.5, 0)))
      return
    }
    if (rengE.tipo === 'metalico') return
    for (const [rengLado, rengOtro] of [[rengPa, rengPb], [rengPb, rengPa]] as const) {
      const rengNube = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 14), rengMaterial(this.rengPaleta.acento, 0.18))
      this.rengAnimar(rengNube, 0.6, (rengU) => {
        rengNube.position.copy(rengLado()).lerp(rengOtro(), 0.25 * rengU)
        ;(rengNube.material as THREE.MeshStandardMaterial).opacity = 0.22 * Math.sin(rengU * Math.PI)
      })
    }
    const rengXa = rengElectronegatividad(this.elementoDe(rengE.a)) ?? 0
    const rengXb = rengElectronegatividad(this.elementoDe(rengE.b)) ?? 0
    const rengSesgo = rengE.tipo === 'covalente-polar' ? (rengXa > rengXb ? 0.35 : 0.65) : 0.5
    for (const rengS of [-1, 1]) {
      const rengD = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), rengMaterial(this.rengPaleta.electron, 1))
      this.rengAnimar(rengD, 1.6, (rengU) => {
        const rengC = rengPa().lerp(rengPb(), rengSesgo)
        rengD.position.copy(rengC).add(new THREE.Vector3(0, 0.12 * rengS, 0))
        ;(rengD.material as THREE.MeshStandardMaterial).opacity = rengU < 0.3 ? rengU / 0.3 : rengU > 0.8 ? (1 - rengU) / 0.2 : 1
      })
    }
  }

  private elementoDe = (rengId: number): string => (this.rengGrupo.children.find((rengC) => rengC.userData.idAtomo === rengId) as THREE.Mesh | undefined)?.userData.el ?? ''
  private rengEsMetal(rengId: number): boolean {
    const rengEl = this.elementoDe(rengId)
    try {
      return rengEl ? rengClase(rengEl) === 'metal' : false
    } catch {
      return false
    }
  }

  rengMarElectrones(): THREE.Mesh {
    const rengM = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), rengMaterial(this.rengPaleta.electron, 0.2))
    rengM.userData = { mar: true }
    this.mares.push(rengM)
    return rengM
  }

  rengColocarMar(rengObj: THREE.Object3D, rengPa: THREE.Vector3, rengPb: THREE.Vector3): void {
    const rengD = rengPb.clone().sub(rengPa)
    const rengOnda = 1 + 0.08 * Math.sin(this.reloj * 3 + rengObj.id)
    rengObj.position.copy(rengPa).add(rengPb).multiplyScalar(0.5)
    rengObj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rengD.clone().normalize())
    rengObj.scale.set(0.55 * rengOnda, (rengD.length() / 2 + 0.5) * rengOnda, 0.55 * rengOnda)
  }

  parciales(rengSignos: ReadonlyMap<number, number>): void {
    for (const [rengId, rengD] of this.deltas)
      if (rengSignos.get(rengId) !== rengD.signo) {
        this.rengGrupo.remove(rengD.sprite)
        rengDisposeObject(rengD.sprite)
        this.deltas.delete(rengId)
      }
    for (const [rengId, rengSigno] of rengSignos) {
      if (rengSigno === 0 || this.deltas.has(rengId)) continue
      const rengSprite = rengEtiqueta(rengSigno > 0 ? 'δ⁺' : 'δ⁻', this.rengPaleta, 0.26, rengSigno > 0 ? this.rengPaleta.positivo : this.rengPaleta.negativo)
      this.rengGrupo.add(rengSprite)
      this.deltas.set(rengId, { sprite: rengSprite, signo: rengSigno })
    }
  }

  rengActualizar(rengDt: number): void {
    this.reloj += rengDt
    this.transitorios = this.transitorios.filter((rengT) => {
      rengT.t += rengDt
      const rengU = Math.min(1, rengT.t / rengT.dur)
      rengT.paso(rengU)
      if (rengU < 1) return true
      this.rengGrupo.remove(rengT.obj)
      rengDisposeObject(rengT.obj)
      return false
    })
    for (const [rengId, rengD] of this.deltas) {
      const rengP = this.rengPos(rengId)
      if (rengP) rengD.sprite.position.copy(rengP).add(new THREE.Vector3(0, -(this.rengRadio(rengId) + 0.2), 0))
    }
  }

  rengLiberar(): void {
    for (const rengT of this.transitorios) rengDisposeObject(rengT.obj)
    this.transitorios = []
    for (const rengD of this.deltas.values()) rengDisposeObject(rengD.sprite)
    this.deltas.clear()
    this.mares = []
  }
}

export function rengPolaridad(rengM: RengMesa, rengE: RengEnlaceMesa): { positivo: number; negativo: number; delta: number } {
  const RENG_A = rengM.atomos.find((rengX) => rengX.id === rengE.a)!
  const RENG_B = rengM.atomos.find((rengX) => rengX.id === rengE.b)!
  const rengXa = rengElectronegatividad(RENG_A.el) ?? 0
  const rengXb = rengElectronegatividad(RENG_B.el) ?? 0
  const rengDelta = Math.abs(rengXa - rengXb)
  return rengXa < rengXb ? { positivo: rengE.a, negativo: rengE.b, delta: rengDelta } : { positivo: rengE.b, negativo: rengE.a, delta: rengDelta }
}
