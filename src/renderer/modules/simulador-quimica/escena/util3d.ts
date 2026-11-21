import * as THREE from 'three'

export interface RengPaleta {
  texto: number
  fondo: number
  acento: number
  electron: number
  positivo: number
  negativo: number
}

export interface RengEscenaEnlace {
  grupo: THREE.Group
  distancia: number
  aplicar: (rengS: number) => void
  curva?: { r: (rengS: number) => number; desdePaso: number }
}

export const RENG_GEO_ESFERA = (): THREE.SphereGeometry => new THREE.SphereGeometry(1, 32, 22)

export function rengEsfera(rengColor: number, rengRadio: number, rengOpciones: { transparente?: boolean; opacidad?: number; elemento?: string } = {}): THREE.Mesh {
  const rengMat = new THREE.MeshStandardMaterial({
    color: rengColor,
    roughness: 0.3,
    metalness: 0.1,
    transparent: rengOpciones.transparente ?? false,
    opacity: rengOpciones.opacidad ?? 1,
    depthWrite: !(rengOpciones.transparente ?? false)
  })
  const rengM = new THREE.Mesh(RENG_GEO_ESFERA(), rengMat)
  rengM.scale.setScalar(rengRadio)
  if (rengOpciones.elemento) rengM.userData = { elemento: rengOpciones.elemento }
  return rengM
}

const rengHex = (rengC: number): string => `#${rengC.toString(16).padStart(6, '0')}`

export function rengEtiqueta(rengTexto: string, rengPaleta: RengPaleta, rengAlto = 0.45, rengColor?: number): THREE.Sprite {
  const rengLienzo = document.createElement('canvas')
  const rengCtx = rengLienzo.getContext('2d') as CanvasRenderingContext2D
  const rengFuente = 64
  rengCtx.font = `700 ${rengFuente}px system-ui, sans-serif`
  const rengAncho = Math.ceil(rengCtx.measureText(rengTexto).width) + 36
  rengLienzo.width = rengAncho
  rengLienzo.height = rengFuente + 30
  rengCtx.font = `700 ${rengFuente}px system-ui, sans-serif`
  rengCtx.fillStyle = `${rengHex(rengPaleta.fondo)}cc`
  const rengR = 22
  rengCtx.beginPath()
  rengCtx.roundRect(0, 0, rengLienzo.width, rengLienzo.height, rengR)
  rengCtx.fill()
  rengCtx.fillStyle = rengHex(rengColor ?? rengPaleta.texto)
  rengCtx.textAlign = 'center'
  rengCtx.textBaseline = 'middle'
  rengCtx.fillText(rengTexto, rengLienzo.width / 2, rengLienzo.height / 2 + 3)
  const rengTex = new THREE.CanvasTexture(rengLienzo)
  rengTex.colorSpace = THREE.SRGBColorSpace
  const rengSp = new THREE.Sprite(new THREE.SpriteMaterial({ map: rengTex, transparent: true, depthTest: false }))
  rengSp.scale.set((rengAlto * rengLienzo.width) / rengLienzo.height, rengAlto, 1)
  rengSp.renderOrder = 10
  return rengSp
}

export function rengOpacidad(rengObj: THREE.Object3D, rengO: number): void {
  rengObj.visible = rengO > 0.01
  rengObj.traverse((rengH) => {
    const rengMats = (rengH as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined
    if (!rengMats) return
    for (const rengM of Array.isArray(rengMats) ? rengMats : [rengMats]) {
      if (rengM.userData.base === undefined) rengM.userData.base = rengM.opacity
      rengM.transparent = true
      rengM.opacity = (rengM.userData.base as number) * rengO
    }
  })
}

export function rengFlecha(rengColor: number): THREE.ArrowHelper {
  const rengF = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, rengColor, 0.3, 0.18)
  ;(rengF.line.material as THREE.Material).transparent = true
  ;(rengF.cone.material as THREE.Material).transparent = true
  return rengF
}

export function rengAnillo(rengRadio: number, rengColor: number): THREE.Mesh {
  const rengM = new THREE.Mesh(new THREE.TorusGeometry(rengRadio, 0.018, 8, 96), new THREE.MeshBasicMaterial({ color: rengColor, transparent: true, opacity: 0.45 }))
  return rengM
}

export function rengBarra(rengColor: number, rengRadio = 0.07): THREE.Mesh {
  const rengM = new THREE.Mesh(new THREE.CylinderGeometry(rengRadio, rengRadio, 1, 14), new THREE.MeshStandardMaterial({ color: rengColor, roughness: 0.4, metalness: 0.2, transparent: true }))
  return rengM
}

const RENG_ARRIBA = new THREE.Vector3(0, 1, 0)
export function rengColocarBarra(rengM: THREE.Object3D, rengA: THREE.Vector3, rengB: THREE.Vector3): void {
  const rengD = rengB.clone().sub(rengA)
  rengM.position.copy(rengA).add(rengB).multiplyScalar(0.5)
  rengM.scale.set(1, Math.max(1e-4, rengD.length()), 1)
  if (rengD.lengthSq() > 1e-10) rengM.quaternion.setFromUnitVectors(RENG_ARRIBA, rengD.normalize())
}

export function rengLineaPuntos(rengColor: number): THREE.Line {
  const rengG = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(1, 0, 0)])
  const rengL = new THREE.Line(rengG, new THREE.LineDashedMaterial({ color: rengColor, dashSize: 0.12, gapSize: 0.1, transparent: true }))
  rengL.computeLineDistances()
  return rengL
}

export function rengColocarPuntos(rengL: THREE.Line, rengA: THREE.Vector3, rengB: THREE.Vector3): void {
  const rengPos = rengL.geometry.getAttribute('position') as THREE.BufferAttribute
  rengPos.setXYZ(0, rengA.x, rengA.y, rengA.z)
  rengPos.setXYZ(1, rengB.x, rengB.y, rengB.z)
  rengPos.needsUpdate = true
  rengL.computeLineDistances()
  rengL.geometry.computeBoundingSphere()
}
