import * as THREE from 'three'
import { RENG_ELEMENTOS } from '../../chemistry'
import { rengSimboloConCarga, rengVecinosVisor, type RengModeloVisor } from '../../nucleo/modeloVisor'

type RengModelo = Extract<RengModeloVisor, { estado: 'modelo' }>

export interface RengEscena3D {
  grupo: THREE.Group
  orientarRotulos: (rengCamara: THREE.Camera) => void
  resaltar: (rengI: number | null, rengColor: number) => void
}

const rengRadioBola = (rengEl: string): number => Math.max(0.2, (RENG_ELEMENTOS[rengEl]?.rc ?? 0.8) * 0.42)
const rengColorDe = (rengEl: string): number => RENG_ELEMENTOS[rengEl]?.color ?? 0xff00ff
const RENG_COLOR_VARILLA = 0xaab4d6

function rengLuminancia(rengC: number): number {
  const rengLin = (rengV: number): number => {
    const rengS = rengV / 255
    return rengS <= 0.03928 ? rengS / 12.92 : ((rengS + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * rengLin((rengC >> 16) & 255) + 0.7152 * rengLin((rengC >> 8) & 255) + 0.0722 * rengLin(rengC & 255)
}

const rengTexturas = new Map<string, THREE.CanvasTexture>()
function rengTexturaRotulo(rengTexto: string, rengFondo: number): THREE.CanvasTexture {
  const rengTinta = rengLuminancia(rengFondo) > 0.35 ? '#0b1020' : '#ffffff'
  const rengK = `${rengTexto}|${rengTinta}`
  const rengGuardada = rengTexturas.get(rengK)
  if (rengGuardada) return rengGuardada
  const rengC = document.createElement('canvas')
  rengC.width = 128
  rengC.height = 64
  const rengG = rengC.getContext('2d')!
  rengG.font = '600 40px system-ui, "Segoe UI", sans-serif'
  rengG.textAlign = 'center'
  rengG.textBaseline = 'middle'
  rengG.lineWidth = 6
  rengG.strokeStyle = rengTinta === '#ffffff' ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.55)'
  rengG.strokeText(rengTexto, 64, 34)
  rengG.fillStyle = rengTinta
  rengG.fillText(rengTexto, 64, 34)
  const rengT = new THREE.CanvasTexture(rengC)
  rengT.colorSpace = THREE.SRGBColorSpace
  rengTexturas.set(rengK, rengT)
  return rengT
}

function rengPerpendicular(rengM: RengModelo, rengVec: ReturnType<typeof rengVecinosVisor>, rengA: number, rengB: number): THREE.Vector3 {
  const RENG_A = new THREE.Vector3(...rengM.atomos[rengA]!.p)
  const rengEje = new THREE.Vector3(...rengM.atomos[rengB]!.p).sub(RENG_A).normalize()
  const rengCandidatos = [...rengVec[rengA]!.filter((rengV) => rengV.i !== rengB).map((rengV) => rengV.i), ...rengVec[rengB]!.filter((rengV) => rengV.i !== rengA).map((rengV) => rengV.i)]
  for (const rengC of rengCandidatos) {
    const rengD = new THREE.Vector3(...rengM.atomos[rengC]!.p).sub(RENG_A)
    const rengP = rengD.sub(rengEje.clone().multiplyScalar(rengD.dot(rengEje)))
    if (rengP.lengthSq() > 1e-4) return rengP.normalize()
  }
  const rengP = new THREE.Vector3().crossVectors(rengEje, new THREE.Vector3(0, 0, 1))
  if (rengP.lengthSq() < 1e-6) rengP.crossVectors(rengEje, new THREE.Vector3(0, 1, 0))
  return rengP.normalize()
}

export function rengConstruirEscena(rengM: RengModelo): RengEscena3D {
  const rengGrupo = new THREE.Group()
  const rengEsfera = new THREE.SphereGeometry(1, 36, 24)
  const rengArriba = new THREE.Vector3(0, 1, 0)
  const rengVec = rengVecinosVisor(rengM.atomos.length, rengM.enlaces)
  const rengBolas: THREE.Mesh[] = []
  const rengRotulos: Array<{ s: THREE.Sprite; i: number; r: number }> = []

  rengM.atomos.forEach((rengX, rengI) => {
    const rengR = rengRadioBola(rengX.el)
    const rengMat = new THREE.MeshStandardMaterial({ color: rengColorDe(rengX.el), roughness: 0.3, metalness: 0.12 })
    const rengBola = new THREE.Mesh(rengEsfera, rengMat)
    rengBola.scale.setScalar(rengR)
    rengBola.position.set(...rengX.p)
    rengBola.userData = { atomo: rengI, elemento: rengX.el, escala: rengR }
    rengGrupo.add(rengBola)
    rengBolas.push(rengBola)
    const rengS = new THREE.Sprite(new THREE.SpriteMaterial({ map: rengTexturaRotulo(rengSimboloConCarga(rengX.el, rengX.carga), rengColorDe(rengX.el)), depthWrite: false, transparent: true }))
    const rengAlto = Math.max(0.26, rengR * 0.95)
    rengS.scale.set(rengAlto * 2, rengAlto, 1)
    rengS.position.set(...rengX.p)
    rengS.renderOrder = 2
    rengGrupo.add(rengS)
    rengRotulos.push({ s: rengS, i: rengI, r: rengR })
  })

  const rengVarillas = new Map<string, THREE.Mesh[]>()
  const rengVarilla = (RENG_A: THREE.Vector3, RENG_B: THREE.Vector3, rengRadio: number, rengClave: string): void => {
    const rengDir = RENG_B.clone().sub(RENG_A)
    const rengMesh = new THREE.Mesh(new THREE.CylinderGeometry(rengRadio, rengRadio, rengDir.length(), 14), new THREE.MeshStandardMaterial({ color: RENG_COLOR_VARILLA, roughness: 0.45, metalness: 0.25 }))
    rengMesh.position.copy(RENG_A).add(RENG_B).multiplyScalar(0.5)
    rengMesh.quaternion.setFromUnitVectors(rengArriba, rengDir.normalize())
    rengGrupo.add(rengMesh)
    rengVarillas.set(rengClave, [...(rengVarillas.get(rengClave) ?? []), rengMesh])
  }
  for (const rengE of rengM.enlaces) {
    const RENG_A = new THREE.Vector3(...rengM.atomos[rengE.a]!.p)
    const RENG_B = new THREE.Vector3(...rengM.atomos[rengE.b]!.p)
    const rengClave = `${Math.min(rengE.a, rengE.b)}-${Math.max(rengE.a, rengE.b)}`
    const rengPerp = rengPerpendicular(rengM, rengVec, rengE.a, rengE.b)
    if (rengE.aromatico) {
      rengVarilla(RENG_A, RENG_B, 0.075, rengClave)
      const rengOff = rengPerp.clone().multiplyScalar(0.16)
      const rengTramos = 5
      for (let rengK = 0; rengK < rengTramos; rengK++) {
        const rengT0 = (rengK + 0.15) / rengTramos
        const rengT1 = (rengK + 0.65) / rengTramos
        rengVarilla(RENG_A.clone().lerp(RENG_B, rengT0).add(rengOff), RENG_A.clone().lerp(RENG_B, rengT1).add(rengOff), 0.04, rengClave)
      }
      continue
    }
    const rengN = Math.max(1, Math.min(3, rengE.orden))
    const rengDesp = rengN === 1 ? [0] : rengN === 2 ? [-0.09, 0.09] : [-0.15, 0, 0.15]
    for (const rengD of rengDesp) {
      const rengOff = rengPerp.clone().multiplyScalar(rengD)
      rengVarilla(RENG_A.clone().add(rengOff), RENG_B.clone().add(rengOff), rengN === 1 ? 0.085 : 0.05, rengClave)
    }
  }

  const rengTmp = new THREE.Vector3()
  const rengCam = new THREE.Vector3()
  return {
    grupo: rengGrupo,
    orientarRotulos: (rengCamara) => {
      rengGrupo.updateMatrixWorld()
      rengCamara.getWorldPosition(rengCam)
      for (const { s: rengS, i: rengI, r: rengR } of rengRotulos) {
        rengTmp.set(...rengM.atomos[rengI]!.p).applyMatrix4(rengGrupo.matrixWorld)
        const rengHacia = rengCam.clone().sub(rengTmp).normalize().multiplyScalar(rengR * 1.2)
        rengS.position.set(...rengM.atomos[rengI]!.p).add(rengHacia.applyQuaternion(rengGrupo.getWorldQuaternion(new THREE.Quaternion()).invert()))
      }
    },
    resaltar: (rengSel, rengColor) => {
      rengBolas.forEach((rengB, rengI) => {
        const rengMat = rengB.material as THREE.MeshStandardMaterial
        const rengActivo = rengI === rengSel
        rengMat.emissive.setHex(rengActivo ? rengColor : 0x000000)
        rengMat.emissiveIntensity = rengActivo ? 0.8 : 0
        const rengBase = rengB.userData.escala as number
        rengB.scale.setScalar(rengActivo ? rengBase * 1.18 : rengBase)
      })
      for (const [rengK, rengMs] of rengVarillas) {
        const [rengA, rengB] = rengK.split('-').map(Number)
        const rengActivo = rengSel !== null && (rengA === rengSel || rengB === rengSel)
        for (const rengMesh of rengMs) (rengMesh.material as THREE.MeshStandardMaterial).emissive.setHex(rengActivo ? rengColor : 0x000000)
      }
    }
  }
}
