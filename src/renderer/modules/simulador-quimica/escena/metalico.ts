import * as THREE from 'three'
import type { RengSecuenciaMetalica } from '../enlaces/secuencias'
import { rengCoordinacion, RENG_ESTRUCTURAS, rengGenerarRed } from '../nucleo/cristales'
import { rengColor } from './lewis'
import { rengTramo } from './secuenciador'
import { rengAleatorio } from './trayectorias'
import { rengEsfera, rengEtiqueta, rengFlecha, rengOpacidad, type RengEscenaEnlace, type RengPaleta } from './util3d'

const RENG_TAMANO = 7

export function rengEscenaMetalica(rengSec: RengSecuenciaMetalica, rengPaleta: RengPaleta): RengEscenaEnlace {
  const rengGrupo = new THREE.Group()
  const rengEst = RENG_ESTRUCTURAS[rengSec.estructura]!
  const rengN = rengSec.estructura === 'Cu' ? 2 : 3
  const RENG_L = rengN * rengEst.a
  const rengK = RENG_TAMANO / RENG_L
  const rengVecino = rengCoordinacion(rengEst, rengSec.elemento).distancia * rengK
  const rengAtomos = rengGenerarRed(rengEst, rengN).map((rengA) => new THREE.Vector3(rengA.p[0] * rengK - RENG_TAMANO / 2, rengA.p[1] * rengK - RENG_TAMANO / 2, rengA.p[2] * rengK - RENG_TAMANO / 2))
  const rengNA = rengAtomos.length

  const rengGeo = new THREE.SphereGeometry(1, 18, 12)
  const rengCationes = new THREE.InstancedMesh(rengGeo, new THREE.MeshStandardMaterial({ color: rengColor(rengSec.elemento), roughness: 0.35, metalness: 0.4 }), rengNA)
  rengCationes.userData = { elemento: rengSec.elemento }
  const rengCapas = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 16, 10), new THREE.MeshStandardMaterial({ color: rengColor(rengSec.elemento), transparent: true, opacity: 0.12, depthWrite: false }), rengNA)
  rengGrupo.add(rengCationes, rengCapas)

  const rengNE = rengNA * rengSec.electronesPorAtomo
  const rengAzar = rengAleatorio(20240607)
  const rengElectrones = Array.from({ length: rengNE }, (_, rengI) => ({
    atomo: rengI % rengNA,
    fase: rengAzar() * Math.PI * 2,
    base: new THREE.Vector3(rengAzar(), rengAzar(), rengAzar()).multiplyScalar(RENG_TAMANO).subScalar(RENG_TAMANO / 2),
    w: [8 + rengAzar() * 6, 8 + rengAzar() * 6, 8 + rengAzar() * 6],
    f: [rengAzar() * 6.28, rengAzar() * 6.28, rengAzar() * 6.28]
  }))
  const rengMallaE = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshStandardMaterial({ color: rengPaleta.electron, emissive: rengPaleta.electron, emissiveIntensity: 0.35 }), rengNE)
  rengGrupo.add(rengMallaE)

  const rengPlacas = [-1, 1].map((rengSgn) => {
    const rengM = new THREE.Mesh(new THREE.BoxGeometry(0.12, RENG_TAMANO * 0.9, RENG_TAMANO * 0.9), new THREE.MeshStandardMaterial({ color: rengSgn < 0 ? rengPaleta.positivo : rengPaleta.negativo, transparent: true, opacity: 0.5 }))
    rengM.position.set(rengSgn * (RENG_TAMANO / 2 + 0.8), 0, 0)
    const rengE = rengEtiqueta(rengSgn < 0 ? '+' : '−', rengPaleta, 0.7, rengSgn < 0 ? rengPaleta.positivo : rengPaleta.negativo)
    rengE.position.set(rengSgn * (RENG_TAMANO / 2 + 0.8), RENG_TAMANO / 2 + 0.3, 0)
    rengGrupo.add(rengM, rengE)
    return [rengM, rengE] as const
  })
  const rengFlechaE = rengFlecha(rengPaleta.acento)
  rengFlechaE.position.set(RENG_TAMANO / 2 - 0.5, RENG_TAMANO / 2 + 0.9, 0)
  rengFlechaE.setDirection(new THREE.Vector3(-1, 0, 0))
  rengFlechaE.setLength(RENG_TAMANO - 1, 0.35, 0.22)
  const rengEtqE = rengEtiqueta('electrones → polo +', rengPaleta, 0.38)
  rengEtqE.position.set(0, RENG_TAMANO / 2 + 1.5, 0)
  rengGrupo.add(rengFlechaE, rengEtqE)

  const rengM = new THREE.Matrix4()
  const rengQ = new THREE.Quaternion()
  const rengV = new THREE.Vector3()
  const rengE = new THREE.Vector3()
  const rengEnvolver = (rengX: number): number => ((((rengX + RENG_TAMANO / 2) % RENG_TAMANO) + RENG_TAMANO) % RENG_TAMANO) - RENG_TAMANO / 2
  const rengRCat = rengVecino * 0.17
  const rengRCapa = rengVecino * 0.48

  const rengAplicar = (rengS: number): void => {
    const rengAparece = rengTramo(rengS, 0, 0.5)
    const rengLibre = rengTramo(rengS, 1, 1.9)
    const rengDeriva = rengS < 3 ? 0 : Math.min(1, rengS - 3) * RENG_TAMANO * 0.9
    const rengDesliz = rengTramo(rengS, 4.2, 4.9) * rengEst.a * rengK
    const rengMitad = 0
    rengAtomos.forEach((rengP, rengI) => {
      rengV.copy(rengP)
      if (rengP.y > rengMitad + 1e-6) rengV.x += rengDesliz
      rengM.compose(rengV, rengQ, rengE.setScalar(rengRCat * rengAparece + 1e-4))
      rengCationes.setMatrixAt(rengI, rengM)
      rengM.compose(rengV, rengQ, rengE.setScalar(rengRCapa * rengAparece * (1 - rengLibre) + 1e-4))
      rengCapas.setMatrixAt(rengI, rengM)
    })
    rengCationes.instanceMatrix.needsUpdate = true
    rengCapas.instanceMatrix.needsUpdate = true
    rengCapas.visible = rengLibre < 0.99

    rengElectrones.forEach((rengEl, rengI) => {
      const rengA = rengAtomos[rengEl.atomo]!
      const rengT = rengEl.fase + rengS * 6
      const rengLigado = new THREE.Vector3(rengA.x + rengRCapa * Math.cos(rengT), rengA.y + rengRCapa * Math.sin(rengT), rengA.z + rengRCapa * 0.4 * Math.sin(rengT * 0.7))
      const rengMar = new THREE.Vector3(
        rengEnvolver(rengEl.base.x + 0.35 * Math.sin(rengEl.w[0]! * rengS + rengEl.f[0]!) - rengDeriva),
        rengEl.base.y + 0.35 * Math.sin(rengEl.w[1]! * rengS + rengEl.f[1]!),
        rengEl.base.z + 0.35 * Math.sin(rengEl.w[2]! * rengS + rengEl.f[2]!)
      )
      if (rengEl.base.y > rengMitad) rengMar.x = rengEnvolver(rengMar.x + rengDesliz)
      rengV.copy(rengLigado).lerp(rengMar, rengLibre)
      rengM.compose(rengV, rengQ, rengE.setScalar(0.07 * rengAparece + 1e-4))
      rengMallaE.setMatrixAt(rengI, rengM)
    })
    rengMallaE.instanceMatrix.needsUpdate = true

    const rengCampo = rengTramo(rengS, 3, 3.3) * (1 - rengTramo(rengS, 4, 4.3))
    rengPlacas.forEach(([rengPl, rengEt]) => {
      rengOpacidad(rengPl, rengCampo)
      rengOpacidad(rengEt, rengCampo)
    })
    rengOpacidad(rengFlechaE, rengCampo)
    rengOpacidad(rengEtqE, rengCampo)
  }
  rengAplicar(0)
  return { grupo: rengGrupo, distancia: 15, aplicar: rengAplicar }
}

