import * as THREE from 'three'
import { rengCapas, rengPorSimbolo } from '../../tabla-periodica/data'
import { rengColor } from './lewis'
import type { RengSecuenciaIonica } from '../enlaces/secuencias'
import { RENG_ESTRUCTURAS } from '../nucleo/cristales'
import { RENG_RADIO_IONICO } from '../nucleo/datosEnlace'
import { rengDatos3D } from '../nucleo/elementos3d'
import { rengElectronegatividad } from '../nucleo/electronegatividad'
import { rengCrearRed } from './red'
import { rengMezclar, rengTramo } from './secuenciador'
import { rengAnillo, rengEsfera, rengEtiqueta, rengFlecha, rengOpacidad, type RengEscenaEnlace, type RengPaleta } from './util3d'

export type { RengEscenaEnlace }

const RENG_R0 = 0.55
const RENG_DR = 0.42
const rengRadioCapa = (rengK: number): number => RENG_R0 + RENG_DR * rengK
const rengComa = (rengX: number): string => rengX.toFixed(2).replace('.', ',')

interface RengAtomoBohr {
  grupo: THREE.Group
  nucleo: THREE.Mesh
  anillos: THREE.Mesh[]
  electrones: THREE.Mesh[][]
  rExt: number
}

function rengAtomoBohr(rengEl: string, rengPaleta: RengPaleta, rengAngulosExternos?: number[]): RengAtomoBohr {
  const rengGrupo = new THREE.Group()
  const rengNucleo = rengEsfera(rengColor(rengEl), 0.32, { elemento: rengEl })
  rengGrupo.add(rengNucleo)
  const rengCs = rengCapas(rengPorSimbolo.get(rengEl)!.z)
  const rengAnillos: THREE.Mesh[] = []
  const rengElectrones: THREE.Mesh[][] = []
  rengCs.forEach((rengN, rengK) => {
    const RENG_R = rengRadioCapa(rengK)
    const rengA = rengAnillo(RENG_R, rengPaleta.texto)
    rengGrupo.add(rengA)
    rengAnillos.push(rengA)
    const rengUltimo = rengK === rengCs.length - 1
    const rengAngs = rengUltimo && rengAngulosExternos ? rengAngulosExternos : Array.from({ length: rengN }, (_, rengJ) => (2 * Math.PI * rengJ) / rengN + rengK * 0.4)
    const rengEs = rengAngs.map((rengT) => {
      const rengE = rengEsfera(rengPaleta.electron, 0.085)
      rengE.position.set(RENG_R * Math.cos(rengT), RENG_R * Math.sin(rengT), 0)
      rengGrupo.add(rengE)
      return rengE
    })
    rengElectrones.push(rengEs)
  })
  return { grupo: rengGrupo, nucleo: rengNucleo, anillos: rengAnillos, electrones: rengElectrones, rExt: rengRadioCapa(rengCs.length - 1) }
}

export function rengEscenaIonica(rengSec: RengSecuenciaIonica, rengPaleta: RengPaleta): RengEscenaEnlace {
  const rengGrupo = new THREE.Group()
  const rengPar = new THREE.Group()
  rengGrupo.add(rengPar)
  const { el: RENG_M, carga: rengQM } = rengSec.metal
  const { el: RENG_X, carga: rengQX, n: rengNX } = rengSec.noMetal
  const rengCsX = rengCapas(rengPorSimbolo.get(RENG_X)!.z)
  const rengExtX = rengCsX[rengCsX.length - 1]!
  const rengSlotsX = rengExtX + rengQX
  const rengDAng = (2 * Math.PI) / rengSlotsX

  const rengRExtM = rengRadioCapa(rengCapas(rengPorSimbolo.get(RENG_M)!.z).length - 1)
  const rengRExtX = rengRadioCapa(rengCsX.length - 1)
  const RENG_D = rengRExtM + rengRExtX + 1.1
  const rengPosM = new THREE.Vector3(rengNX === 1 ? -RENG_D / 2 : 0, 0, 0)
  const rengPosX = rengNX === 1 ? [new THREE.Vector3(RENG_D / 2, 0, 0)] : [new THREE.Vector3(RENG_D, 0, 0), new THREE.Vector3(-RENG_D, 0, 0)]
  const rengHaciaM = rengPosX.map((rengP) => (rengP.x > rengPosM.x ? Math.PI : 0))

  const rengAngM = rengNX === 1 ? Array.from({ length: rengQM }, (_, rengI) => (rengI - (rengQM - 1) / 2) * 0.5) : rengPosX.map((rengP) => (rengP.x > 0 ? 0 : Math.PI))
  const rengBM = rengAtomoBohr(RENG_M, rengPaleta, rengAngM)
  rengBM.grupo.position.copy(rengPosM)
  rengPar.add(rengBM.grupo)

  const rengBX = rengPosX.map((rengP, rengI) => {
    const rengT0 = rengHaciaM[rengI]! - ((rengQX - 1) * rengDAng) / 2
    const rengAngs = Array.from({ length: rengExtX }, (_, rengJ) => rengT0 + (rengJ + rengQX) * rengDAng)
    const rengB = rengAtomoBohr(RENG_X, rengPaleta, rengAngs)
    rengB.grupo.position.copy(rengP)
    rengPar.add(rengB.grupo)
    return rengB
  })
  const rengHuecos = rengPosX.map((rengP, rengI) => {
    const rengT0 = rengHaciaM[rengI]! - ((rengQX - 1) * rengDAng) / 2
    return Array.from({ length: rengQX }, (_, rengJ) => new THREE.Vector3(rengRExtX * Math.cos(rengT0 + rengJ * rengDAng), rengRExtX * Math.sin(rengT0 + rengJ * rengDAng), 0).add(rengP))
  })

  const rengViajeros = rengBM.electrones[rengBM.electrones.length - 1]!.map((rengE, rengI) => {
    const rengInicio = rengE.position.clone().add(rengPosM)
    rengBM.grupo.remove(rengE)
    rengPar.add(rengE)
    const rengDestinoX = rengNX === 1 ? 0 : rengI
    const rengDestino = rengHuecos[rengDestinoX]![rengNX === 1 ? rengI : 0]!
    return { e: rengE, inicio: rengInicio, destino: rengDestino, destinoX: rengDestinoX }
  })
  const rengAnilloExtM = rengBM.anillos[rengBM.anillos.length - 1]!

  const rengEtqEN = [
    { sp: rengEtiqueta(`χ = ${rengComa(rengElectronegatividad(RENG_M)!)}`, rengPaleta, 0.42), pos: rengPosM, r: rengRExtM },
    ...rengPosX.map((rengP) => ({ sp: rengEtiqueta(`χ = ${rengComa(rengElectronegatividad(RENG_X)!)}`, rengPaleta, 0.42), pos: rengP, r: rengRExtX }))
  ]
  for (const rengT of rengEtqEN) {
    rengT.sp.position.set(rengT.pos.x, rengT.r + 0.55, 0)
    rengPar.add(rengT.sp)
  }

  const rengIM = `${RENG_M}${rengQM === 1 ? '' : rengQM}+`
  const rengIX = `${RENG_X}${rengQX === 1 ? '' : rengQX}-`
  const rengRIonM = RENG_RADIO_IONICO[rengIM]!.valor.r
  const rengRIonX = RENG_RADIO_IONICO[rengIX]!.valor.r
  const rengRAtM = rengDatos3D.get(RENG_M)!.rc!
  const rengRAtX = rengDatos3D.get(RENG_X)!.rc!
  const rengIonM = rengEsfera(rengColor(RENG_M), rengRAtM, { elemento: RENG_M })
  rengPar.add(rengIonM)
  const rengIonesX = rengPosX.map(() => {
    const rengM = rengEsfera(rengColor(RENG_X), rengRAtX, { elemento: RENG_X })
    rengPar.add(rengM)
    return rengM
  })
  const rengSup = (rengQ: number): string => `${Math.abs(rengQ) === 1 ? '' : Math.abs(rengQ)}${rengQ > 0 ? '+' : '−'}`
  const rengEtqM = rengEtiqueta(`${RENG_M}${rengSup(rengQM)}`, rengPaleta, 0.5, rengPaleta.positivo)
  const rengEtqX = rengPosX.map(() => rengEtiqueta(`${RENG_X}${rengSup(-rengQX)}`, rengPaleta, 0.5, rengPaleta.negativo))
  rengPar.add(rengEtqM, ...rengEtqX)

  const rengFlechas = rengPosX.flatMap(() => [rengFlecha(rengPaleta.acento), rengFlecha(rengPaleta.acento)])
  rengPar.add(...rengFlechas)

  const rengRed = rengCrearRed(RENG_ESTRUCTURAS[rengSec.estructura]!, rengPaleta.acento)
  rengGrupo.add(rengRed.grupo)

  const rengAplicar = (rengS: number): void => {
    const rengAparece = rengTramo(rengS, 0, 0.6)
    const rengBohr = rengAparece * (1 - rengTramo(rengS, 3, 3.5))
    rengOpacidad(rengBM.grupo, rengBohr)
    rengBX.forEach((rengB) => rengOpacidad(rengB.grupo, rengBohr))
    rengOpacidad(rengAnilloExtM, rengBohr * (1 - rengTramo(rengS, 2.6, 3)))

    const rengEn = rengTramo(rengS, 1, 1.4) * (1 - rengTramo(rengS, 2.8, 3.2))
    rengEtqEN.forEach((rengT) => rengOpacidad(rengT.sp, rengEn))

    rengViajeros.forEach((rengW, rengI) => {
      const rengU = rengTramo(rengS, 2 + 0.12 * rengI, 2.85 + 0.12 * rengI)
      rengW.e.position.lerpVectors(rengW.inicio, rengW.destino, rengU)
      rengW.e.position.y += 1.3 * Math.sin(Math.PI * rengU)
      rengOpacidad(rengW.e, rengBohr)
    })

    const rengIon = rengTramo(rengS, 3.2, 3.6) * (1 - rengTramo(rengS, 5, 5.4))
    const rengFr = rengTramo(rengS, 3.4, 4)
    const rengJunta = rengTramo(rengS, 4.3, 5)
    const rengDC = rengRIonM + rengRIonX
    const rengPM = rengPosM.clone()
    if (rengNX === 1) rengPM.x = rengMezclar(rengPosM.x, -rengDC / 2, rengJunta)
    const rengPX = rengPosX.map((rengP) => {
      const rengC = rengP.clone()
      rengC.x = rengNX === 1 ? rengMezclar(rengP.x, rengDC / 2, rengJunta) : rengMezclar(rengP.x, Math.sign(rengP.x) * rengDC, rengJunta)
      return rengC
    })
    rengIonM.position.copy(rengPM)
    rengIonM.scale.setScalar(rengMezclar(rengRAtM, rengRIonM, rengFr))
    rengOpacidad(rengIonM, rengIon)
    rengIonesX.forEach((rengM, rengI) => {
      rengM.position.copy(rengPX[rengI]!)
      rengM.scale.setScalar(rengMezclar(rengRAtX, rengRIonX, rengFr))
      rengOpacidad(rengM, rengIon)
    })
    const rengCarga = rengTramo(rengS, 3.6, 4) * (1 - rengTramo(rengS, 5, 5.4))
    rengEtqM.position.set(rengPM.x, rengRIonM + 0.55, 0)
    rengOpacidad(rengEtqM, rengCarga)
    rengEtqX.forEach((rengT, rengI) => {
      rengT.position.set(rengPX[rengI]!.x, rengRIonX + 0.55, 0)
      rengOpacidad(rengT, rengCarga)
    })

    const rengFz = rengTramo(rengS, 4, 4.3) * (1 - rengTramo(rengS, 5, 5.3))
    rengPX.forEach((rengPx, rengI) => {
      const rengDir = rengPx.clone().sub(rengPM).normalize()
      const rengSep = rengPx.distanceTo(rengPM)
      const rengLargo = Math.max(0.35, rengSep / 2 - 0.25)
      const rengFA = rengFlechas[2 * rengI]!
      const rengFB = rengFlechas[2 * rengI + 1]!
      rengFA.position.copy(rengPM).add(new THREE.Vector3(0, 0, rengRIonM + 0.3))
      rengFA.setDirection(rengDir)
      rengFA.setLength(rengLargo, 0.25, 0.16)
      rengFB.position.copy(rengPx).add(new THREE.Vector3(0, 0, rengRIonX + 0.3))
      rengFB.setDirection(rengDir.clone().negate())
      rengFB.setLength(rengLargo, 0.25, 0.16)
      rengOpacidad(rengFA, rengFz)
      rengOpacidad(rengFB, rengFz)
    })

    rengRed.grupo.visible = rengS > 5.15
    if (rengRed.grupo.visible) {
      rengRed.colocar((rengD) => rengTramo(rengS, 5.2 + 0.5 * rengD, 5.5 + 0.5 * rengD))
      rengOpacidad(rengRed.celda, rengTramo(rengS, 5.6, 6))
      rengRed.celda.visible = rengS > 5.6
    }
  }
  rengAplicar(0)
  return { grupo: rengGrupo, distancia: 15, aplicar: rengAplicar }
}
