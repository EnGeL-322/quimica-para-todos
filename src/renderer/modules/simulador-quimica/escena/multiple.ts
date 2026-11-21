import * as THREE from 'three'
import type { RengSecuenciaMultiple } from '../enlaces/secuencias'
import { rengColor, rengHuecos, rengPosicionPunto, rengRadioNucleo, rengRadioPunto, rengRepartoLewis, rengValencia } from './lewis'
import { rengTramo } from './secuenciador'
import { rengDistanciaMultiple, rengGiroBloqueado } from './trayectorias'
import { rengBarra, rengColocarBarra, rengEsfera, rengOpacidad, type RengEscenaEnlace, type RengPaleta } from './util3d'

const RENG_EJE_X = new THREE.Vector3(1, 0, 0)
const rengRad = (rengG: number): number => (rengG * Math.PI) / 180

function rengLobulo(rengColorL: number, rengDir: THREE.Vector3, rengLargo = 0.5, rengAncho = 0.19, rengOffset = 0.42): THREE.Mesh {
  const rengM = rengEsfera(rengColorL, 1, { transparente: true, opacidad: 0.42 })
  rengM.scale.set(rengLargo, rengAncho, rengAncho)
  rengM.quaternion.setFromUnitVectors(RENG_EJE_X, rengDir.clone().normalize())
  rengM.position.copy(rengDir.clone().normalize().multiplyScalar(rengOffset))
  return rengM
}

interface RengFragmento {
  grupo: THREE.Group
  puntos: THREE.Mesh[]
  hibridos: THREE.Mesh[]
  haciaPareja: THREE.Mesh
  orbitalesP: THREE.Mesh[]
}

export function rengEscenaMultiple(rengSec: RengSecuenciaMultiple, rengPaleta: RengPaleta): RengEscenaEnlace {
  const rengGrupo = new THREE.Group()
  const rengEl = rengSec.centro
  const rengSp2 = rengSec.hibridacion === 'sp2'

  function rengFragmento(rengLado: number): RengFragmento {
    const rengG = new THREE.Group()
    rengGrupo.add(rengG)
    rengG.add(rengEsfera(rengColor(rengEl), rengRadioNucleo(rengEl), { elemento: rengEl }))
    const rengPareja = new THREE.Vector3(-rengLado, 0, 0)
    const rengOtros = rengSp2
      ? [rengRad(rengSec.anguloHCH ? rengSec.anguloHCH / 2 : 60), -rengRad(rengSec.anguloHCH ? rengSec.anguloHCH / 2 : 60)].map((rengA) => new THREE.Vector3(rengLado * Math.cos(rengA), Math.sin(rengA), 0))
      : [new THREE.Vector3(rengLado, 0, 0)]
    rengOtros.slice(0, rengSec.hidrogenos).forEach((rengD) => {
      const rengPH = rengD.clone().multiplyScalar(rengSec.longitudH)
      const rengH = rengEsfera(rengColor('H'), rengRadioNucleo('H'), { elemento: 'H' })
      rengH.position.copy(rengPH)
      const rengB = rengBarra(rengPaleta.texto, 0.05)
      rengColocarBarra(rengB, new THREE.Vector3(), rengPH)
      rengG.add(rengH, rengB)
    })
    const rengVecinos = [rengPareja, ...rengOtros.slice(0, rengSec.hidrogenos)]
    const rengHs = rengHuecos(rengVecinos)
    const rengCuenta = rengRepartoLewis(rengValencia(rengEl), rengVecinos.length)
    const rengPuntos: THREE.Mesh[] = []
    rengHs.forEach((rengD, rengJ) => {
      for (let rengE = 0; rengE < rengCuenta[rengJ]!; rengE++) {
        const rengP = rengEsfera(rengPaleta.electron, 0.065)
        rengP.position.copy(rengPosicionPunto(new THREE.Vector3(), rengD, rengRadioPunto(rengEl), rengCuenta[rengJ] === 2 ? (rengE === 0 ? -1 : 1) : 0))
        rengG.add(rengP)
        rengPuntos.push(rengP)
      }
    })
    const rengHaciaPareja = rengLobulo(rengPaleta.acento, rengPareja)
    const rengHibridos = [rengHaciaPareja, ...rengOtros.map((rengD) => rengLobulo(rengPaleta.acento, rengD))]
    const rengEjesP = rengSp2 ? [new THREE.Vector3(0, 0, 1)] : [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0)]
    const rengOrbitalesP = rengEjesP.flatMap((rengE) => [rengLobulo(rengPaleta.positivo, rengE, 0.42, 0.2, 0.38), rengLobulo(rengPaleta.positivo, rengE.clone().negate(), 0.42, 0.2, 0.38)])
    rengG.add(...rengHibridos, ...rengOrbitalesP)
    return { grupo: rengG, puntos: rengPuntos, hibridos: rengHibridos, haciaPareja: rengHaciaPareja, orbitalesP: rengOrbitalesP }
  }

  const RENG_A = rengFragmento(-1)
  const RENG_B = rengFragmento(1)

  const rengSigma = rengEsfera(rengPaleta.acento, 1, { transparente: true, opacidad: 0.35 })
  rengGrupo.add(rengSigma)
  const rengEjesPi = rengSp2 ? [new THREE.Vector3(0, 0, 1)] : [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0)]
  const rengPis = rengEjesPi.flatMap((rengE) =>
    [1, -1].map((rengSgn) => {
      const rengM = rengEsfera(rengPaleta.positivo, 1, { transparente: true, opacidad: 0.32 })
      rengGrupo.add(rengM)
      return { m: rengM, eje: rengE.clone().multiplyScalar(rengSgn) }
    })
  )

  const rengAplicar = (rengS: number): void => {
    const rengD = rengDistanciaMultiple(rengS, rengSec.longitud)
    RENG_A.grupo.position.set(-rengD / 2, 0, 0)
    RENG_B.grupo.position.set(rengD / 2, 0, 0)
    const rengGiro = rengSec.rigidez ? rengGiroBloqueado(rengS) : 0
    RENG_B.grupo.rotation.x = rengGiro

    const rengAparece = rengTramo(rengS, 0, 0.5)
    const rengLewis = rengAparece * (1 - rengTramo(rengS, 1, 1.4))
    const rengHib = rengTramo(rengS, 1.2, 1.8)
    const rengFormaSigma = rengTramo(rengS, 2.4, 3)
    const rengFormaPi = rengTramo(rengS, 3, 3.7)
    for (const rengF of [RENG_A, RENG_B]) {
      rengOpacidad(rengF.grupo, rengAparece)
      rengF.puntos.forEach((rengP) => rengOpacidad(rengP, rengLewis))
      rengF.hibridos.forEach((rengH) => rengOpacidad(rengH, rengHib))
      rengOpacidad(rengF.haciaPareja, rengHib * (1 - rengFormaSigma))
      rengF.orbitalesP.forEach((rengO) => rengOpacidad(rengO, rengHib * (1 - rengTramo(rengS, 3.3, 3.8))))
    }
    rengSigma.position.set(0, 0, 0)
    rengSigma.scale.set(rengD / 2 + 0.25, 0.22, 0.22)
    rengOpacidad(rengSigma, rengFormaSigma)
    const rengSolape = Math.cos(rengGiro) ** 2
    for (const rengP of rengPis) {
      rengP.m.position.copy(rengP.eje).multiplyScalar(0.42)
      rengP.m.scale.set(rengD / 2 + 0.35, 0.2, 0.2)
      rengP.m.scale.setComponent(Math.abs(rengP.eje.y) > 0.5 ? 1 : 2, 0.2)
      rengOpacidad(rengP.m, rengFormaPi * rengSolape)
    }
  }
  rengAplicar(0)
  return {
    grupo: rengGrupo,
    distancia: Math.max(5.5, 2.4 * rengSec.longitud * 1.4 + 3),
    aplicar: rengAplicar,
    curva: rengSec.diatomica ? { r: (rengS) => rengDistanciaMultiple(rengS, rengSec.longitud), desdePaso: 2 } : undefined
  }
}
