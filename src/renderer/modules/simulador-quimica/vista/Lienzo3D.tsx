import { useEffect, useImperativeHandle, useRef, type ReactNode, type Ref } from 'react'
import * as THREE from 'three'
import { rengDisposeObject } from '../../../lib/three/dispose'
import { rengCreateEngine, type RengEngine } from '../../../lib/three/engine'
import { useRengActivo, useRengActivoRef } from './actividad'
import { rengEsCampoDeTexto } from './nivel'
import { RengLimite3D } from '@/shell/Limite3D'

interface RengProps {
  modelo: THREE.Object3D | null
  distancia: number
  autoRotar?: boolean
  onHoverAtomo?: (rengIndice: number | null) => void
  etiqueta: string
  onHoverElemento?: (rengSimbolo: string | null) => void
  onFrame?: (rengDt: number, rengCamara: THREE.PerspectiveCamera) => void
  children?: ReactNode
  botones?: boolean
  atajos?: boolean
  apiRef?: Ref<RengCamaraApi>
}

export interface RengCamaraApi {
  reiniciar: () => void
  acercar: (rengFactor: number) => void
  girar: (rengHorizontal: number, rengVertical: number) => void
  desplazar: (rengDx: number, rengDy: number) => void
}

function rengVisibleEnArbol(rengO: THREE.Object3D | null): boolean {
  for (let rengX = rengO; rengX; rengX = rengX.parent) if (!rengX.visible) return false
  return true
}

export function RengLienzo3D(rengProps: RengProps): React.JSX.Element {
  return (
    <RengLimite3D etiqueta="La vista 3D">
      <RengLienzo3DInterno {...rengProps} />
    </RengLimite3D>
  )
}

function RengLienzo3DInterno({ modelo: rengModelo, distancia: rengDistancia, autoRotar: rengAutoRotar = false, onHoverAtomo: rengOnHoverAtomo, onHoverElemento: rengOnHoverElemento, onFrame: rengOnFrame, etiqueta: rengEtiqueta, children: rengChildren, botones: rengBotones = true, atajos: rengAtajos = true, apiRef: rengApiRef }: RengProps): React.JSX.Element {
  const rengZona = useRef<HTMLDivElement>(null)
  const rengCanvas = useRef<HTMLCanvasElement>(null)
  const rengEngine = useRef<RengEngine | null>(null)
  const rengActual = useRef<THREE.Object3D | null>(null)
  const rengActivo = useRengActivo()
  const rengActivoRef = useRengActivoRef()
  const rengRotar = useRef(rengAutoRotar)
  const rengDist = useRef(rengDistancia)
  const rengHover = useRef(rengOnHoverAtomo)
  const rengHoverEl = useRef(rengOnHoverElemento)
  rengHoverEl.current = rengOnHoverElemento
  const rengFotograma = useRef(rengOnFrame)
  rengFotograma.current = rengOnFrame
  rengRotar.current = rengAutoRotar
  rengDist.current = rengDistancia
  rengHover.current = rengOnHoverAtomo

  const rengReiniciar = (): void => rengEngine.current?.frame([0, 0, 0], rengDist.current)
  useImperativeHandle(
    rengApiRef,
    () => ({
      reiniciar: rengReiniciar,
      acercar: (rengF) => {
        const rengE = rengEngine.current
        if (!rengE || !(rengF > 0)) return
        const rengD = rengE.camera.position.clone().sub(rengE.controls.target).multiplyScalar(rengF)
        const rengL = Math.min(Math.max(rengD.length(), rengDist.current * 0.2), rengDist.current * 6)
        rengE.camera.position.copy(rengE.controls.target).add(rengD.setLength(rengL))
        rengE.controls.update()
      },
      girar: (rengH, rengV) => {
        const rengE = rengEngine.current
        if (!rengE) return
        const rengS = new THREE.Spherical().setFromVector3(rengE.camera.position.clone().sub(rengE.controls.target))
        rengS.theta -= rengH
        rengS.phi = Math.min(Math.PI - 0.05, Math.max(0.05, rengS.phi - rengV))
        rengE.camera.position.copy(rengE.controls.target).add(new THREE.Vector3().setFromSpherical(rengS))
        rengE.camera.lookAt(rengE.controls.target)
        rengE.controls.update()
      },
      desplazar: (rengDx, rengDy) => {
        const rengE = rengEngine.current
        if (!rengE) return
        const rengAlto = 2 * rengE.camera.position.distanceTo(rengE.controls.target) * Math.tan((rengE.camera.fov * Math.PI) / 360)
        const rengV = new THREE.Vector3()
          .setFromMatrixColumn(rengE.camera.matrix, 0)
          .multiplyScalar(rengDx * rengAlto)
          .add(new THREE.Vector3().setFromMatrixColumn(rengE.camera.matrix, 1).multiplyScalar(rengDy * rengAlto))
        rengE.camera.position.add(rengV)
        rengE.controls.target.add(rengV)
        rengE.controls.update()
      }
    }),
    []
  )
  const rengPantallaCompleta = (): void => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined)
    else void rengZona.current?.requestFullscreen().catch(() => undefined)
  }

  useEffect(() => {
    if (!rengCanvas.current) return
    const rengE = rengCreateEngine(rengCanvas.current)
    rengEngine.current = rengE
    rengE.onFrame((rengDt) => {
      if (rengRotar.current && rengActual.current) rengActual.current.rotation.y += rengDt * 0.45
      rengFotograma.current?.(rengDt, rengE.camera)
    })
    const rengRay = new THREE.Raycaster()
    const rengP = new THREE.Vector2()
    let rengUltimo: number | null = null
    let rengUltimoEl: string | null = null
    const rengMover = (rengEv: PointerEvent): void => {
      const rengM = rengActual.current
      const rengC = rengCanvas.current
      if (!rengM || !rengC || (!rengHover.current && !rengHoverEl.current)) return
      const rengR = rengC.getBoundingClientRect()
      rengP.set(((rengEv.clientX - rengR.left) / rengR.width) * 2 - 1, -((rengEv.clientY - rengR.top) / rengR.height) * 2 + 1)
      rengRay.setFromCamera(rengP, rengE.camera)
      const rengHits = rengRay.intersectObject(rengM, true).filter((rengH) => rengVisibleEnArbol(rengH.object))
      const rengHit = rengHits.find((rengH) => rengH.object.userData.atomo !== undefined)
      const rengIdx = rengHit ? (rengHit.object.userData.atomo as number) : null
      if (rengIdx !== rengUltimo) {
        rengUltimo = rengIdx
        rengHover.current?.(rengIdx)
      }
      const rengHitEl = rengHits.find((rengH) => rengH.object.userData.elemento !== undefined)
      const rengEl = rengHitEl ? (rengHitEl.object.userData.elemento as string) : null
      if (rengEl !== rengUltimoEl) {
        rengUltimoEl = rengEl
        rengHoverEl.current?.(rengEl)
      }
    }
    const rengSalir = (): void => {
      if (rengUltimo !== null) {
        rengUltimo = null
        rengHover.current?.(null)
      }
      if (rengUltimoEl !== null) {
        rengUltimoEl = null
        rengHoverEl.current?.(null)
      }
    }
    const rengC = rengCanvas.current
    rengC.addEventListener('pointermove', rengMover)
    rengC.addEventListener('pointerleave', rengSalir)
    return () => {
      rengC.removeEventListener('pointermove', rengMover)
      rengC.removeEventListener('pointerleave', rengSalir)
      if (rengActual.current) {
        rengE.scene.remove(rengActual.current)
        rengDisposeObject(rengActual.current)
        rengActual.current = null
      }
      rengE.dispose()
      rengEngine.current = null
    }
  }, [])

  useEffect(() => {
    const rengE = rengEngine.current
    if (!rengE || !rengModelo) return
    rengE.scene.add(rengModelo)
    rengActual.current = rengModelo
    rengE.frame([0, 0, 0], rengDist.current)
    return () => {
      rengE.scene.remove(rengModelo)
      rengDisposeObject(rengModelo)
      if (rengActual.current === rengModelo) rengActual.current = null
    }
  }, [rengModelo])

  useEffect(() => rengEngine.current?.activar(rengActivo), [rengActivo])

  const rengConAtajos = useRef(rengAtajos)
  rengConAtajos.current = rengAtajos
  useEffect(() => {
    const rengTecla = (rengEv: KeyboardEvent): void => {
      if (!rengConAtajos.current || !rengActivoRef.current || rengEv.ctrlKey || rengEv.metaKey || rengEv.altKey || rengEsCampoDeTexto(rengEv.target)) return
      const rengK = rengEv.key.toLowerCase()
      if (rengK === 'r') rengReiniciar()
      else if (rengK === 'f') rengPantallaCompleta()
      else return
      rengEv.preventDefault()
    }
    window.addEventListener('keydown', rengTecla)
    return () => window.removeEventListener('keydown', rengTecla)
  }, [])

  return (
    <div className="zonas-lienzo" ref={rengZona}>
      <canvas ref={rengCanvas} role="img" aria-label={rengEtiqueta} />
      {rengChildren}
      {rengBotones && (
        <div className="lienzo-botones">
          <button className="btn sm" onClick={rengReiniciar} title="Reiniciar vista (R)">
            ⟲ Vista
          </button>
          <button className="btn sm" onClick={rengPantallaCompleta} title="Pantalla completa (F)">
            ⛶
          </button>
        </div>
      )}
    </div>
  )
}
