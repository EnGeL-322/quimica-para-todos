import * as THREE from 'three'
import { rengEjes, rengGenerarRed, type RengEstructura } from '../nucleo/cristales'
import { RENG_RADIO_IONICO } from '../nucleo/datosEnlace'
import { rengColor } from './lewis'

export interface RengRed {
  grupo: THREE.Group
  celda: THREE.LineSegments
  colocar: (rengCrecer?: (rengD: number) => number) => void
}

export function rengCrearRed(rengEst: RengEstructura, rengColorCelda: number, rengOpciones: { n?: number; tamano?: number; escalaRadio?: number } = {}): RengRed {
  const rengN = rengOpciones.n ?? 2
  const RENG_L = rengEjes(rengEst)
  const rengGrupo = new THREE.Group()
  rengGrupo.scale.setScalar((rengOpciones.tamano ?? 6.5) / (rengN * Math.max(...RENG_L)))
  const rengAtomos = rengGenerarRed(rengEst, rengN)
  const rengCentro = RENG_L.map((rengX) => (rengN * rengX) / 2) as [number, number, number]
  const rengDMax = Math.hypot(...rengCentro)
  const rengPorIon = new Map<string, typeof rengAtomos>()
  for (const rengA of rengAtomos) rengPorIon.set(rengA.ion, [...(rengPorIon.get(rengA.ion) ?? []), rengA])
  const rengInstancias = [...rengPorIon.entries()].map(([rengIon, rengLista]) => {
    const rengEl = rengLista[0]!.elemento
    const rengMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 20, 14), new THREE.MeshStandardMaterial({ color: rengColor(rengEl), roughness: 0.3, metalness: 0.1 }), rengLista.length)
    rengMesh.userData = { elemento: rengEl }
    rengGrupo.add(rengMesh)
    return { mesh: rengMesh, lista: rengLista, r: (RENG_RADIO_IONICO[rengIon]?.valor.r ?? 1) * (rengOpciones.escalaRadio ?? 0.42) }
  })
  const rengCelda = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(RENG_L[0], RENG_L[1], RENG_L[2])), new THREE.LineBasicMaterial({ color: rengColorCelda, transparent: true }))
  rengCelda.position.set(RENG_L[0] / 2 - rengCentro[0], RENG_L[1] / 2 - rengCentro[1], RENG_L[2] / 2 - rengCentro[2])
  rengGrupo.add(rengCelda)
  const rengM = new THREE.Matrix4()
  const rengQ = new THREE.Quaternion()
  const rengV = new THREE.Vector3()
  const rengE = new THREE.Vector3()
  const rengColocar = (rengCrecer: (rengD: number) => number = () => 1): void => {
    for (const { mesh: rengMesh, lista: rengLista, r: rengR } of rengInstancias) {
      rengLista.forEach((rengA, rengK) => {
        rengV.set(rengA.p[0] - rengCentro[0], rengA.p[1] - rengCentro[1], rengA.p[2] - rengCentro[2])
        rengE.setScalar(rengR * rengCrecer(rengV.length() / rengDMax) + 1e-4)
        rengM.compose(rengV, rengQ, rengE)
        rengMesh.setMatrixAt(rengK, rengM)
      })
      rengMesh.instanceMatrix.needsUpdate = true
    }
  }
  rengColocar()
  return { grupo: rengGrupo, celda: rengCelda, colocar: rengColocar }
}
