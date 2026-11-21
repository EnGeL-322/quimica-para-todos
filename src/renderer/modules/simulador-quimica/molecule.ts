import * as THREE from 'three'
import { rengDetectarEnlaces, RENG_ELEMENTOS, type RengMolecula } from './chemistry'

export type RengEstilo = 'bolas' | 'espacio'

export function rengBuildMolecule(rengMol: RengMolecula, rengEstilo: RengEstilo): THREE.Group {
  const rengG = new THREE.Group()
  const rengSphereGeo = new THREE.SphereGeometry(1, 40, 28)
  rengMol.atomos.forEach((rengA, rengI) => {
    const rengInfo = RENG_ELEMENTOS[rengA.el] ?? { color: 0xff00ff, rc: 0.8, rv: 1.5 }
    const rengMesh = new THREE.Mesh(rengSphereGeo, new THREE.MeshStandardMaterial({ color: rengInfo.color, roughness: 0.28, metalness: 0.15 }))
    const rengR = rengEstilo === 'espacio' ? rengInfo.rv : Math.max(0.2, rengInfo.rc * 0.42)
    rengMesh.scale.setScalar(rengR)
    rengMesh.position.set(...rengA.p)
    rengMesh.userData = { atomo: rengI, elemento: rengA.el, escala: rengR }
    rengG.add(rengMesh)
  })

  if (rengEstilo === 'bolas') {
    const rengUp = new THREE.Vector3(0, 1, 0)
    const rengLista = rengMol.enlaces ?? rengDetectarEnlaces(rengMol.atomos).map((rengE) => ({ ...rengE, orden: rengMol.orden?.[`${Math.min(rengE.a, rengE.b)}-${Math.max(rengE.a, rengE.b)}`] ?? 1 }))
    for (const rengE of rengLista) {
      const RENG_A = new THREE.Vector3(...rengMol.atomos[rengE.a]!.p)
      const RENG_B = new THREE.Vector3(...rengMol.atomos[rengE.b]!.p)
      const rengDir = RENG_B.clone().sub(RENG_A)
      const rengLen = rengDir.length()
      const rengN = rengE.orden
      const rengPerp = new THREE.Vector3().crossVectors(rengDir, new THREE.Vector3(0, 0, 1))
      if (rengPerp.lengthSq() < 1e-6) rengPerp.crossVectors(rengDir, new THREE.Vector3(0, 1, 0))
      rengPerp.normalize()
      const rengOffsets = rengN === 1 ? [0] : rengN === 2 ? [-0.1, 0.1] : [-0.16, 0, 0.16]
      for (const rengOff of rengOffsets) {
        const rengCyl = new THREE.Mesh(new THREE.CylinderGeometry(rengN === 1 ? 0.085 : 0.055, rengN === 1 ? 0.085 : 0.055, rengLen, 16), new THREE.MeshStandardMaterial({ color: 0xaab4d6, roughness: 0.4, metalness: 0.3 }))
        rengCyl.position.copy(RENG_A).add(RENG_B).multiplyScalar(0.5).add(rengPerp.clone().multiplyScalar(rengOff))
        rengCyl.quaternion.setFromUnitVectors(rengUp, rengDir.clone().normalize())
        rengG.add(rengCyl)
      }
    }
  }

  const rengBox = new THREE.Box3().setFromObject(rengG)
  rengG.position.sub(rengBox.getCenter(new THREE.Vector3()))
  const rengWrap = new THREE.Group()
  rengWrap.add(rengG)
  return rengWrap
}

export function rengResaltarElemento(rengModelo: THREE.Object3D, rengSimbolo: string | null, rengColor: number): void {
  rengModelo.traverse((rengO) => {
    const rengEl = rengO.userData.elemento as string | undefined
    if (rengEl === undefined) return
    const rengMat = (rengO as THREE.Mesh).material as THREE.MeshStandardMaterial
    const rengActivo = rengSimbolo !== null && rengEl === rengSimbolo
    rengMat.emissive.setHex(rengActivo ? rengColor : 0x000000)
    rengMat.emissiveIntensity = rengActivo ? 0.9 : 0
    const rengBase = rengO.userData.escala as number | undefined
    if (rengBase !== undefined) rengO.scale.setScalar(rengActivo ? rengBase * 1.2 : rengBase)
  })
}

export function rengResaltarAtomos(rengModelo: THREE.Object3D, rengIndices: number[] | null, rengColor: number): void {
  const rengSet = new Set(rengIndices ?? [])
  rengModelo.traverse((rengO) => {
    const rengI = rengO.userData.atomo as number | undefined
    if (rengI === undefined) return
    const rengMat = (rengO as THREE.Mesh).material as THREE.MeshStandardMaterial
    const rengActivo = rengSet.has(rengI)
    rengMat.emissive.setHex(rengActivo ? rengColor : 0x000000)
    rengMat.emissiveIntensity = rengActivo ? 0.85 : 0
    const rengBase = rengO.userData.escala as number | undefined
    if (rengBase !== undefined) rengO.scale.setScalar(rengActivo ? rengBase * 1.15 : rengBase)
  })
}

export function rengAtomoSuelto(rengEl: string): THREE.Group {
  const rengInfo = RENG_ELEMENTOS[rengEl] ?? { color: 0xff00ff, rc: 0.8, rv: 1.5 }
  const rengM = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), new THREE.MeshStandardMaterial({ color: rengInfo.color, roughness: 0.28, metalness: 0.15 }))
  rengM.scale.setScalar(rengInfo.rv)
  rengM.userData = { atomo: 0, elemento: rengEl, escala: rengInfo.rv }
  const rengG = new THREE.Group()
  rengG.add(rengM)
  return rengG
}
