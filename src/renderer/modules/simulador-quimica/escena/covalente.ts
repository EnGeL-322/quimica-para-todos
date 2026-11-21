import * as THREE from 'three'
import type { RengSecuenciaCovalente } from '../enlaces/secuencias'
import { rengElectronegatividad } from '../nucleo/electronegatividad'
import { rengColor, rengHuecos, rengPosicionPunto, rengRadioNube, rengRadioNucleo, rengRadioPunto, rengRc, rengRepartoLewis, rengValencia } from './lewis'
import { rengTramo } from './secuenciador'
import { rengDistanciaEnlace, RENG_LEJOS } from './trayectorias'
import { rengEsfera, rengEtiqueta, rengFlecha, rengOpacidad, type RengEscenaEnlace, type RengPaleta } from './util3d'

interface RengPunto {
  malla: THREE.Mesh
  atomo: number
  dir: THREE.Vector3
  lado: number
  vecino: number | null
}

export function rengEscenaCovalente(rengSec: RengSecuenciaCovalente, rengPaleta: RengPaleta): RengEscenaEnlace {
  const rengGrupo = new THREE.Group()
  const rengInterior = new THREE.Group()
  rengGrupo.add(rengInterior)
  const rengEls = [rengSec.centro, ...rengSec.vecinos.map((rengV) => rengV.el)]
  const rengDirs = rengSec.vecinos.map((rengV) => new THREE.Vector3(...rengV.dir).normalize())
  const rengPos = rengEls.map(() => new THREE.Vector3())

  const rengNucleos = rengEls.map((rengEl) => {
    const rengM = rengEsfera(rengColor(rengEl), rengRadioNucleo(rengEl), { elemento: rengEl })
    rengInterior.add(rengM)
    return rengM
  })
  const rengNubes = rengEls.map((rengEl) => {
    const rengM = rengEsfera(rengColor(rengEl), rengRadioNube(rengEl), { transparente: true, opacidad: 0.13 })
    rengInterior.add(rengM)
    return rengM
  })
  const rengRPunto = (rengI: number): number => rengRadioPunto(rengEls[rengI]!)

  const rengPuntos: RengPunto[] = []
  rengEls.forEach((rengEl, rengI) => {
    const rengHaciaVecinos = rengI === 0 ? rengDirs : [rengDirs[rengI - 1]!.clone().negate()]
    const rengHs = rengHuecos(rengHaciaVecinos)
    const rengK = rengHaciaVecinos.length
    const rengCuenta = rengRepartoLewis(rengValencia(rengEl), rengK)
    rengHs.forEach((rengD, rengJ) => {
      const rengN = rengCuenta[rengJ]!
      for (let rengE = 0; rengE < rengN; rengE++) {
        const rengMalla = rengEsfera(rengPaleta.electron, 0.07)
        rengInterior.add(rengMalla)
        rengPuntos.push({ malla: rengMalla, atomo: rengI, dir: rengD, lado: rengN === 2 ? (rengE === 0 ? -1 : 1) : 0, vecino: rengJ < rengK ? (rengI === 0 ? rengJ + 1 : 0) : null })
      }
    })
  })

  const rengNubesEnlace = rengSec.vecinos.map(() => {
    const rengM = rengEsfera(rengPaleta.acento, 1, { transparente: true, opacidad: 0.22 })
    rengInterior.add(rengM)
    return rengM
  })

  const rengXs = rengEls.map((rengE) => rengElectronegatividad(rengE) ?? 0)
  const rengEtqDelta = rengEls.map((_, rengI) => {
    const rengSigno = rengXs[rengI]! > Math.min(...rengXs) + 0.01 ? 'δ−' : 'δ+'
    const rengSp = rengEtiqueta(rengSigno, rengPaleta, 0.42, rengSigno === 'δ−' ? rengPaleta.negativo : rengPaleta.positivo)
    rengInterior.add(rengSp)
    return rengSp
  })
  const rengDipolo = rengFlecha(rengPaleta.acento)
  rengInterior.add(rengDipolo)

  const RENG_Z = new THREE.Vector3(0, 0, 1)

  const rengAplicar = (rengS: number): void => {
    rengPos[0]!.set(0, 0, 0)
    rengSec.vecinos.forEach((rengV, rengI) => rengPos[rengI + 1]!.copy(rengDirs[rengI]!).multiplyScalar(rengDistanciaEnlace(rengS, rengV.longitud)))
    const rengC = rengPos.reduce((rengA, rengP) => rengA.add(rengP), new THREE.Vector3()).multiplyScalar(1 / rengPos.length)
    rengInterior.position.copy(rengC.negate())

    const rengAparece = rengTramo(rengS, 0, 0.6)
    const rengComparte = rengTramo(rengS, 1.4, 2)
    const rengPolar = rengSec.polar ? rengTramo(rengS, 3, 3.8) : 0

    rengNucleos.forEach((rengM, rengI) => {
      rengM.position.copy(rengPos[rengI]!)
      rengOpacidad(rengM, rengAparece)
    })
    rengNubes.forEach((rengM, rengI) => {
      rengM.position.copy(rengPos[rengI]!)
      const rengGanador = rengXs[rengI]! >= Math.max(...rengXs) - 1e-9
      rengM.scale.setScalar(rengRadioNube(rengEls[rengI]!) * (1 + (rengSec.polar ? (rengGanador ? 0.18 : -0.15) * rengPolar : 0)))
      rengOpacidad(rengM, rengAparece)
    })

    for (const rengP of rengPuntos) {
      const rengBase = rengPos[rengP.atomo]!
      const rengPropio = rengPosicionPunto(rengBase, rengP.dir, rengRPunto(rengP.atomo), rengP.lado)
      if (rengP.vecino === null) {
        rengP.malla.position.copy(rengPropio)
      } else {
        const rengOtro = rengPos[rengP.vecino]!
        const rengMasEN = rengXs[rengP.vecino]! > rengXs[rengP.atomo]! ? rengOtro : rengBase
        const rengMenosEN = rengMasEN === rengOtro ? rengBase : rengOtro
        const rengW = 0.5 + 0.2 * rengPolar
        const rengMedio = rengMenosEN.clone().lerp(rengMasEN, rengSec.polar ? rengW : 0.5)
        const rengEje = rengOtro.clone().sub(rengBase).normalize()
        const rengLat = new THREE.Vector3().crossVectors(rengEje, RENG_Z).normalize()
        const rengSigno = rengP.atomo === 0 ? -1 : 1
        const rengCompartido = rengMedio.addScaledVector(rengLat, 0.1 * rengSigno)
        rengP.malla.position.lerpVectors(rengPropio, rengCompartido, rengComparte)
      }
      rengOpacidad(rengP.malla, rengAparece)
    }

    rengNubesEnlace.forEach((rengM, rengI) => {
      const rengA = rengPos[0]!
      const rengB = rengPos[rengI + 1]!
      const rengD = rengA.distanceTo(rengB)
      const rengMasEN = rengXs[rengI + 1]! > rengXs[0]! ? rengB : rengA
      const rengMenosEN = rengMasEN === rengB ? rengA : rengB
      rengM.position.copy(rengMenosEN.clone().lerp(rengMasEN, rengSec.polar ? 0.5 + 0.15 * rengPolar : 0.5))
      rengM.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), rengB.clone().sub(rengA).normalize())
      const rengAncho = Math.max(0.3, Math.min(rengRc(rengEls[0]!), rengRc(rengEls[rengI + 1]!)) * 0.75)
      rengM.scale.set(rengD / 2 + rengAncho * 0.6, rengAncho, rengAncho)
      rengOpacidad(rengM, rengComparte)
    })

    const rengDelta = rengPolar * (rengSec.polar ? 1 : 0)
    rengEtqDelta.forEach((rengSp, rengI) => {
      rengSp.position.copy(rengPos[rengI]!).add(new THREE.Vector3(0, rengRadioNube(rengEls[rengI]!) + 0.35, 0))
      rengOpacidad(rengSp, rengDelta)
    })

    if (rengSec.polar) {
      const rengINeg = rengXs.indexOf(Math.max(...rengXs))
      const rengPos_ = rengPos.filter((_, rengI) => rengXs[rengI]! < rengXs[rengINeg]! - 0.01)
      const rengDesde = rengPos_.reduce((rengA, rengP) => rengA.add(rengP), new THREE.Vector3()).multiplyScalar(1 / rengPos_.length)
      const rengHasta = rengPos[rengINeg]!.clone()
      const rengDir = rengHasta.clone().sub(rengDesde)
      const rengOffset = rengSec.vecinos.length === 1 ? new THREE.Vector3(0, -1.1, 0) : new THREE.Vector3(1.7, 0, 0)
      rengDipolo.position.copy(rengDesde).add(rengOffset)
      rengDipolo.setDirection(rengDir.clone().normalize())
      rengDipolo.setLength(Math.max(0.5, rengDir.length()), 0.25, 0.16)
      rengOpacidad(rengDipolo, rengTramo(rengS, 3.4, 3.9))
    } else {
      rengOpacidad(rengDipolo, 0)
    }
  }
  rengAplicar(0)
  const RengLmax = Math.max(...rengSec.vecinos.map((rengV) => rengV.longitud))
  const rengRe = rengSec.vecinos[0]!.longitud
  return { grupo: rengGrupo, distancia: Math.max(4.5, RENG_LEJOS * RengLmax * 1.2 + 2), aplicar: rengAplicar, curva: rengSec.diatomica ? { r: (rengS) => rengDistanciaEnlace(rengS, rengRe), desdePaso: 1 } : undefined }
}

