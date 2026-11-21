import type * as THREE from 'three'

export function rengDisposeObject(rengObj: THREE.Object3D): void {
  rengObj.traverse((rengO) => {
    const rengM = rengO as THREE.Mesh
    rengM.geometry?.dispose?.()
    const rengMat = rengM.material as THREE.Material | THREE.Material[] | undefined
    const rengLiberar = (rengX: THREE.Material): void => {
      ;(rengX as THREE.MeshBasicMaterial).map?.dispose()
      rengX.dispose()
    }
    if (Array.isArray(rengMat)) rengMat.forEach(rengLiberar)
    else if (rengMat) rengLiberar(rengMat)
  })
}
