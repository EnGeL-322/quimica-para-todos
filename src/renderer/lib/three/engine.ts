import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { rengDisposeObject } from './dispose'

export { rengDisposeObject }

export interface RengEngine {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  onFrame: (rengCb: (rengDt: number) => void) => void
  frame: (rengCenter: [number, number, number], rengDistance: number, rengDir?: [number, number, number]) => void
  activar: (rengActivo: boolean) => void
  dispose: () => void
}

export function rengCreateEngine(rengCanvas: HTMLCanvasElement): RengEngine {
  const rengRenderer = new THREE.WebGLRenderer({ canvas: rengCanvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  rengRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  rengRenderer.setClearColor(0x000000, 0)

  const rengScene = new THREE.Scene()
  const rengCamera = new THREE.PerspectiveCamera(50, 1, 0.01, 5000)
  rengCamera.position.set(6, 4, 9)

  rengScene.add(new THREE.AmbientLight(0xffffff, 0.55))
  const rengSun = new THREE.DirectionalLight(0xffffff, 1.6)
  rengSun.position.set(6, 10, 8)
  rengScene.add(rengSun)
  const rengRim = new THREE.DirectionalLight(0x6a7bff, 0.6)
  rengRim.position.set(-8, -3, -6)
  rengScene.add(rengRim)

  const rengControls = new OrbitControls(rengCamera, rengCanvas)
  rengControls.enableDamping = true
  rengControls.dampingFactor = 0.08

  let rengCb: (rengDt: number) => void = () => undefined
  let rengRaf = 0
  let rengLast = performance.now()
  let rengAlive = true
  let rengActivo = true

  const rengResize = (): void => {
    const rengW = rengCanvas.clientWidth
    const rengH = rengCanvas.clientHeight
    if (rengW === 0 || rengH === 0) return
    rengRenderer.setSize(rengW, rengH, false)
    rengCamera.aspect = rengW / rengH
    rengCamera.updateProjectionMatrix()
  }
  const rengRo = new ResizeObserver(rengResize)
  rengRo.observe(rengCanvas)
  rengResize()

  const rengLoop = (rengNow: number): void => {
    if (!rengAlive) return
    rengRaf = requestAnimationFrame(rengLoop)
    const rengDt = Math.min(0.05, (rengNow - rengLast) / 1000)
    rengLast = rengNow
    if (document.hidden || !rengActivo) return
    rengCb(rengDt)
    rengControls.update()
    rengRenderer.render(rengScene, rengCamera)
  }
  rengRaf = requestAnimationFrame(rengLoop)

  return {
    scene: rengScene,
    camera: rengCamera,
    controls: rengControls,
    onFrame: (rengF) => {
      rengCb = rengF
    },
    frame: (rengC, rengDistance, rengDir = [0.55, 0.38, 1]) => {
      const rengV = new THREE.Vector3(...rengDir).normalize().multiplyScalar(rengDistance)
      rengControls.target.set(...rengC)
      rengCamera.position.set(rengC[0] + rengV.x, rengC[1] + rengV.y, rengC[2] + rengV.z)
      rengCamera.near = rengDistance / 1000
      rengCamera.far = rengDistance * 100
      rengCamera.updateProjectionMatrix()
      rengControls.update()
    },
    activar: (rengV) => {
      rengActivo = rengV
      if (rengV) rengResize()
    },
    dispose: () => {
      rengAlive = false
      cancelAnimationFrame(rengRaf)
      rengRo.disconnect()
      rengControls.dispose()
      rengDisposeObject(rengScene)
      rengRenderer.dispose()
    }
  }
}
