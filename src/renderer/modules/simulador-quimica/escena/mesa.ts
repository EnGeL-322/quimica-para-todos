import * as THREE from 'three'
import { rengDisposeObject } from '../../../lib/three/dispose'
import { RENG_ELEMENTOS } from '../chemistry'
import type { RengEnlaceMesa, RengMesa } from '../nucleo/mesa'
import { RengEfectosMesa, rengPolaridad } from './mesaEfectos'
import { rengEtiqueta, type RengPaleta } from './util3d'

export interface RengOpcionesMesa {
  estilo: 'bolas' | 'espacio'
  etiquetas: boolean
  parciales: boolean
  reducido: boolean
}

interface RengVisAtomo {
  malla: THREE.Mesh
  actual: THREE.Vector3
  objetivo: THREE.Vector3
  radio: number
  rotulo: THREE.Sprite | null
  claveRotulo: string
  carga: number
  parpadeo: number
}

const rengClaveEnlace = (rengE: { a: number; b: number }): string => `${Math.min(rengE.a, rengE.b)}-${Math.max(rengE.a, rengE.b)}`
const RENG_SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const rengTextoCarga = (rengQ: number): string => (rengQ === 0 ? '' : `${Math.abs(rengQ) > 1 ? [...String(Math.abs(rengQ))].map((rengD) => RENG_SUP[Number(rengD)]).join('') : ''}${rengQ > 0 ? '⁺' : '⁻'}`)

export class RengEscenaMesa {
  readonly grupo = new THREE.Group()
  readonly efectos: RengEfectosMesa
  private atomos = new Map<number, RengVisAtomo>()
  private enlaces = new Map<string, { grupo: THREE.Group; e: RengEnlaceMesa; crecer: number }>()
  private previa: THREE.Line | null = null
  private op: RengOpcionesMesa = { estilo: 'bolas', etiquetas: true, parciales: true, reducido: false }
  private mesa: RengMesa = { atomos: [], enlaces: [], siguiente: 1 }

  constructor(private rengPaleta: RengPaleta) {
    this.efectos = new RengEfectosMesa(this.grupo, rengPaleta, (rengId) => this.atomos.get(rengId)?.actual ?? null, (rengId) => this.atomos.get(rengId)?.malla.scale.x ?? 0.3)
  }

  private radio(rengEl: string, rengCarga: number, rengIonico: boolean): number {
    const rengD = RENG_ELEMENTOS[rengEl]
    const rengBase = this.op.estilo === 'espacio' ? (rengD?.rv ?? (rengD?.rc ?? 0.8) * 1.6) : 0.22 + 0.32 * (rengD?.rc ?? 0.8)
    return rengIonico && rengCarga > 0 ? rengBase * 0.72 : rengIonico && rengCarga < 0 ? rengBase * 1.28 : rengBase
  }

  rengSincronizar(rengM: RengMesa, rengOp: RengOpcionesMesa, rengNuevos: ReadonlySet<string> = new Set()): void {
    this.mesa = rengM
    this.op = rengOp
    const rengIds = new Set(rengM.atomos.map((rengA) => rengA.id))
    for (const [rengId, rengV] of this.atomos)
      if (!rengIds.has(rengId)) {
        this.grupo.remove(rengV.malla)
        if (rengV.rotulo) this.grupo.remove(rengV.rotulo)
        rengDisposeObject(rengV.malla)
        if (rengV.rotulo) rengDisposeObject(rengV.rotulo)
        this.atomos.delete(rengId)
      }
    const rengIonicos = new Set(rengM.enlaces.filter((rengE) => rengE.tipo === 'ionico').flatMap((rengE) => [rengE.a, rengE.b]))
    for (const rengA of rengM.atomos) {
      let rengV = this.atomos.get(rengA.id)
      if (!rengV) {
        const rengColor = RENG_ELEMENTOS[rengA.el]?.color ?? 0x9aa3b5
        const rengMalla = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), new THREE.MeshStandardMaterial({ color: rengColor, roughness: 0.35, metalness: 0.1 }))
        rengMalla.userData = { idAtomo: rengA.id, el: rengA.el }
        const rengP = new THREE.Vector3(...rengA.p)
        rengV = { malla: rengMalla, actual: rengP.clone(), objetivo: rengP.clone(), radio: 0.3, rotulo: null, claveRotulo: '', carga: rengA.carga, parpadeo: 0 }
        rengMalla.position.copy(rengP)
        rengMalla.scale.setScalar(rengOp.reducido ? this.radio(rengA.el, rengA.carga, false) : 0.01)
        this.grupo.add(rengMalla)
        this.atomos.set(rengA.id, rengV)
      }
      rengV.objetivo.set(...rengA.p)
      if (rengV.carga !== rengA.carga) {
        rengV.carga = rengA.carga
        if (!rengOp.reducido) rengV.parpadeo = 0.6
      }
      rengV.radio = this.radio(rengA.el, rengA.carga, rengIonicos.has(rengA.id))
      const rengTexto = rengOp.etiquetas || rengA.carga !== 0 ? `${rengA.el}${rengTextoCarga(rengA.carga)}` : ''
      if (rengTexto !== rengV.claveRotulo) {
        if (rengV.rotulo) {
          this.grupo.remove(rengV.rotulo)
          rengDisposeObject(rengV.rotulo)
        }
        rengV.rotulo = rengTexto ? rengEtiqueta(rengTexto, this.rengPaleta, 0.32, rengA.carga > 0 ? this.rengPaleta.positivo : rengA.carga < 0 ? this.rengPaleta.negativo : undefined) : null
        if (rengV.rotulo) this.grupo.add(rengV.rotulo)
        rengV.claveRotulo = rengTexto
      }
    }
    const rengClaves = new Set(rengM.enlaces.map(rengClaveEnlace))
    for (const [rengK, rengB] of this.enlaces)
      if (!rengClaves.has(rengK) || rengB.e.orden !== rengM.enlaces.find((rengE) => rengClaveEnlace(rengE) === rengK)?.orden || rengB.e.tipo !== rengM.enlaces.find((rengE) => rengClaveEnlace(rengE) === rengK)?.tipo) {
        this.grupo.remove(rengB.grupo)
        rengDisposeObject(rengB.grupo)
        this.enlaces.delete(rengK)
      }
    for (const rengE of rengM.enlaces) {
      const rengK = rengClaveEnlace(rengE)
      if (this.enlaces.has(rengK)) continue
      const rengG = new THREE.Group()
      rengG.userData = { enlace: rengK }
      if (rengE.tipo === 'ionico') {
        const rengLinea = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 1, 0)]), new THREE.LineDashedMaterial({ color: this.rengPaleta.electron, dashSize: 0.12, gapSize: 0.08 }))
        rengLinea.computeLineDistances()
        rengG.add(rengLinea)
      } else if (rengE.tipo === 'metalico') {
        rengG.add(this.efectos.rengMarElectrones())
      } else {
        for (let rengI = 0; rengI < rengE.orden; rengI++) {
          const rengC = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 14), new THREE.MeshStandardMaterial({ color: rengE.noConfirmado ? this.rengPaleta.negativo : 0xb8c2d8, roughness: 0.4 }))
          rengC.userData = { enlace: rengK, desfase: rengE.orden === 1 ? 0 : (rengI - (rengE.orden - 1) / 2) * 0.16 }
          rengG.add(rengC)
        }
      }
      this.grupo.add(rengG)
      const rengNuevo = rengNuevos.has(rengK)
      this.enlaces.set(rengK, { grupo: rengG, e: rengE, crecer: rengNuevo && !rengOp.reducido ? 0 : 1 })
      if (rengNuevo) this.efectos.rengAlFormar(rengE, rengOp.reducido)
    }
    this.rengSeleccionar(this.seleccion)
    const rengSignos = new Map<number, number>()
    if (rengOp.parciales)
      for (const rengE of rengM.enlaces.filter((rengX) => rengX.tipo === 'covalente-polar')) {
        const rengP = rengPolaridad(this.mesa, rengE)
        rengSignos.set(rengP.positivo, (rengSignos.get(rengP.positivo) ?? 0) + rengP.delta)
        rengSignos.set(rengP.negativo, (rengSignos.get(rengP.negativo) ?? 0) - rengP.delta)
      }
    this.efectos.parciales(new Map([...rengSignos].map(([rengId, rengQ]) => [rengId, Math.abs(rengQ) < 0.05 ? 0 : Math.sign(rengQ)])))
  }

  rengPrevisualizar(rengA: THREE.Vector3 | null, rengB?: THREE.Vector3, rengOk = true): void {
    if (this.previa) {
      this.grupo.remove(this.previa)
      rengDisposeObject(this.previa)
      this.previa = null
    }
    if (!rengA || !rengB) return
    const rengMat = rengOk ? new THREE.LineBasicMaterial({ color: this.rengPaleta.acento, linewidth: 2 }) : new THREE.LineDashedMaterial({ color: this.rengPaleta.negativo, dashSize: 0.12, gapSize: 0.1 })
    const rengL = new THREE.Line(new THREE.BufferGeometry().setFromPoints([rengA, rengB]), rengMat)
    rengL.computeLineDistances()
    this.previa = rengL
    this.grupo.add(rengL)
  }

  private seleccion: ReadonlySet<number> = new Set()
  rengSeleccionar(rengIds: ReadonlySet<number>): void {
    this.seleccion = rengIds
    for (const [rengId, rengV] of this.atomos) {
      const rengMat = rengV.malla.material as THREE.MeshStandardMaterial
      rengMat.emissive.setHex(rengIds.has(rengId) ? this.rengPaleta.acento : 0x000000)
      rengMat.emissiveIntensity = rengIds.has(rengId) ? 0.45 : 0
    }
  }

  posicion = (rengId: number): THREE.Vector3 | null => this.atomos.get(rengId)?.actual ?? null

  rengFijar(rengPos: ReadonlyMap<number, THREE.Vector3>): void {
    for (const [rengId, rengP] of rengPos) {
      const rengV = this.atomos.get(rengId)
      if (!rengV) continue
      rengV.actual.copy(rengP)
      rengV.objetivo.copy(rengP)
    }
  }

  rengAtomoEn(rengRay: THREE.Raycaster): number | null {
    const rengHit = rengRay.intersectObjects([...this.atomos.values()].map((rengV) => rengV.malla), false)[0]
    return rengHit ? (rengHit.object.userData.idAtomo as number) : null
  }

  rengEnlaceEn(rengRay: THREE.Raycaster): string | null {
    const rengHit = rengRay.intersectObjects([...this.enlaces.values()].map((rengB) => rengB.grupo), true)[0]
    return rengHit ? (rengHit.object.userData.enlace as string | undefined) ?? (rengHit.object.parent?.userData.enlace as string | undefined) ?? null : null
  }

  rengActualizar(rengDt: number, rengCamara: THREE.Camera): void {
    const rengK = this.op.reducido ? 1 : Math.min(1, rengDt * 9)
    for (const rengV of this.atomos.values()) {
      rengV.actual.lerp(rengV.objetivo, rengK)
      rengV.malla.position.copy(rengV.actual)
      const rengR = rengV.malla.scale.x + (rengV.radio - rengV.malla.scale.x) * (this.op.reducido ? 1 : Math.min(1, rengDt * 8))
      rengV.malla.scale.setScalar(rengR)
      if (rengV.rotulo) rengV.rotulo.position.copy(rengV.actual).add(new THREE.Vector3(0, rengR + 0.22, 0))
      if (rengV.parpadeo > 0) {
        rengV.parpadeo = Math.max(0, rengV.parpadeo - rengDt)
        const rengMat = rengV.malla.material as THREE.MeshStandardMaterial
        rengMat.emissive.setHex(this.rengPaleta.electron)
        rengMat.emissiveIntensity = rengV.parpadeo > 0 ? 0.6 * Math.abs(Math.sin(rengV.parpadeo * 15)) : 0
        if (rengV.parpadeo === 0) this.rengSeleccionar(this.seleccion)
      }
    }
    const rengArriba = new THREE.Vector3()
    for (const rengB of this.enlaces.values()) {
      rengB.crecer = Math.min(1, rengB.crecer + rengDt / 0.45)
      const rengPa = this.atomos.get(rengB.e.a)?.actual
      const rengPb = this.atomos.get(rengB.e.b)?.actual
      if (!rengPa || !rengPb) continue
      const rengFin = rengPa.clone().lerp(rengPb, rengB.crecer)
      const rengDir = rengFin.clone().sub(rengPa)
      const rengLargo = rengDir.length()
      const rengQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), rengDir.clone().normalize())
      rengArriba.copy(rengCamara.position).sub(rengPa).cross(rengDir).normalize()
      for (const rengC of rengB.grupo.children) {
        if (rengC instanceof THREE.Line) {
          rengC.geometry.setFromPoints([rengPa, rengFin])
          rengC.computeLineDistances()
          continue
        }
        if (rengC.userData.mar) {
          this.efectos.rengColocarMar(rengC, rengPa, rengPb)
          continue
        }
        rengC.position.copy(rengPa).add(rengFin).multiplyScalar(0.5).addScaledVector(rengArriba, rengC.userData.desfase as number)
        rengC.quaternion.copy(rengQ)
        rengC.scale.set(0.07, Math.max(0.001, rengLargo), 0.07)
      }
    }
    this.efectos.rengActualizar(rengDt)
  }

  rengLiberar(): void {
    this.rengPrevisualizar(null)
    this.efectos.rengLiberar()
    rengDisposeObject(this.grupo)
    this.atomos.clear()
    this.enlaces.clear()
  }
}
