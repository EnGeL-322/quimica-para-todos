import * as THREE from 'three'
import type { RengSecuenciaIntermolecular } from '../enlaces/secuencias'
import { RENG_DIATOMICAS, RENG_DISTANCIAS_INTER, RENG_GEOMETRIAS } from '../nucleo/datosEnlace'
import { rengColor, rengRadioNube, rengRadioNucleo } from './lewis'
import { rengTramo } from './secuenciador'
import { rengBarra, rengColocarBarra, rengColocarPuntos, rengEsfera, rengEtiqueta, rengLineaPuntos, rengOpacidad, type RengEscenaEnlace, type RengPaleta } from './util3d'

const rengRad = (rengG: number): number => (rengG * Math.PI) / 180
const RENG_OH = RENG_GEOMETRIAS.H2O!.valor.enlaces['O–H']!
const RENG_HOH = RENG_GEOMETRIAS.H2O!.valor.angulos!['H–O–H']!
const RENG_OO = RENG_DISTANCIAS_INTER['O···O (dímero de agua)']!.valor
const RENG_ARAR = RENG_DISTANCIAS_INTER['Ar···Ar (mínimo)']!.valor
const RENG_HCL = RENG_DIATOMICAS.HCl!.re

function rengAgua(rengPaleta: RengPaleta, rengO: THREE.Vector3, rengDirs: THREE.Vector3[]): { g: THREE.Group; hs: THREE.Vector3[] } {
  const rengG = new THREE.Group()
  const rengAt = rengEsfera(rengColor('O'), rengRadioNucleo('O'), { elemento: 'O' })
  rengAt.position.copy(rengO)
  rengG.add(rengAt)
  const rengHs = rengDirs.map((rengD) => rengO.clone().addScaledVector(rengD.clone().normalize(), RENG_OH))
  for (const rengH of rengHs) {
    const rengM = rengEsfera(rengColor('H'), rengRadioNucleo('H'), { elemento: 'H' })
    rengM.position.copy(rengH)
    const rengB = rengBarra(rengPaleta.texto, 0.05)
    rengColocarBarra(rengB, rengO, rengH)
    rengG.add(rengM, rengB)
  }
  return { g: rengG, hs: rengHs }
}

function rengDosH(rengB: THREE.Vector3, rengN: THREE.Vector3): THREE.Vector3[] {
  const rengBb = rengB.clone().normalize()
  const rengNn = rengN.clone().sub(rengBb.clone().multiplyScalar(rengN.dot(rengBb))).normalize()
  const rengH = rengRad(RENG_HOH / 2)
  return [-1, 1].map((rengS) => rengBb.clone().multiplyScalar(Math.cos(rengH)).addScaledVector(rengNn, rengS * Math.sin(rengH)))
}

function rengPuntos(rengPaleta: RengPaleta, rengG: THREE.Group, rengA: THREE.Vector3, rengB: THREE.Vector3): void {
  const rengL = rengLineaPuntos(rengPaleta.acento)
  rengColocarPuntos(rengL, rengA, rengB)
  rengG.add(rengL)
}

export function rengEscenaIntermolecular(_rengSec: RengSecuenciaIntermolecular, rengPaleta: RengPaleta): RengEscenaEnlace {
  const rengGrupo = new THREE.Group()

  const rengDimero = new THREE.Group()
  {
    const rengO1 = new THREE.Vector3(-RENG_OO / 2, 0, 0)
    const rengO2 = new THREE.Vector3(RENG_OO / 2, 0, 0)
    const rengHEnlace = new THREE.Vector3(1, 0, 0)
    const rengOtroH = new THREE.Vector3(Math.cos(rengRad(180 - RENG_HOH)), Math.sin(rengRad(180 - RENG_HOH)), 0)
    const rengA = rengAgua(rengPaleta, rengO1, [rengHEnlace, rengOtroH])
    const rengB = rengAgua(rengPaleta, rengO2, rengDosH(new THREE.Vector3(Math.cos(rengRad(55)), Math.sin(rengRad(55)), 0), new THREE.Vector3(0, 0, 1)))
    rengDimero.add(rengA.g, rengB.g)
    rengPuntos(rengPaleta, rengDimero, rengA.hs[0]!, rengO2)
    const rengD1 = rengEtiqueta('δ+', rengPaleta, 0.34, rengPaleta.positivo)
    rengD1.position.copy(rengA.hs[0]!).add(new THREE.Vector3(0, 0.45, 0))
    const rengD2 = rengEtiqueta('δ−', rengPaleta, 0.34, rengPaleta.negativo)
    rengD2.position.copy(rengO2).add(new THREE.Vector3(0, -0.55, 0))
    rengDimero.add(rengD1, rengD2)
  }

  const rengGrupoAgua = new THREE.Group()
  {
    const rengT = [new THREE.Vector3(1, 1, 1), new THREE.Vector3(-1, -1, 1), new THREE.Vector3(-1, 1, -1), new THREE.Vector3(1, -1, -1)].map((rengX) => rengX.normalize())
    const rengCentro = rengAgua(rengPaleta, new THREE.Vector3(), [rengT[0]!, rengT[1]!])
    rengGrupoAgua.add(rengCentro.g)
    rengT.forEach((rengDir, rengI) => {
      const rengO = rengDir.clone().multiplyScalar(RENG_OO)
      if (rengI < 2) {
        const rengW = rengAgua(rengPaleta, rengO, rengDosH(rengDir, new THREE.Vector3(0, 0, 1).cross(rengDir).lengthSq() > 1e-6 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0)))
        rengGrupoAgua.add(rengW.g)
        rengPuntos(rengPaleta, rengGrupoAgua, rengCentro.hs[rengI]!, rengO)
      } else {
        const rengHaciaCentro = rengDir.clone().negate()
        const rengOtro = rengHaciaCentro.clone().applyAxisAngle(new THREE.Vector3().crossVectors(rengDir, new THREE.Vector3(0, 0, 1)).normalize(), rengRad(RENG_HOH))
        const rengW = rengAgua(rengPaleta, rengO, [rengHaciaCentro, rengOtro])
        rengGrupoAgua.add(rengW.g)
        rengPuntos(rengPaleta, rengGrupoAgua, rengW.hs[0]!, new THREE.Vector3())
      }
    })
  }

  const rengHcl = new THREE.Group()
  {
    const rengSep = 2.4
    const rengX0 = -(2 * RENG_HCL + rengSep) / 2
    const rengPos = [rengX0, rengX0 + RENG_HCL, rengX0 + RENG_HCL + rengSep, rengX0 + 2 * RENG_HCL + rengSep]
    const rengEls = ['H', 'Cl', 'H', 'Cl']
    const rengAt = rengPos.map((rengX, rengI) => {
      const rengM = rengEsfera(rengColor(rengEls[rengI]!), rengRadioNucleo(rengEls[rengI]!), { elemento: rengEls[rengI] })
      rengM.position.set(rengX, 0, 0)
      rengHcl.add(rengM)
      return rengM.position
    })
    for (const [rengA, rengB] of [
      [0, 1],
      [2, 3]
    ] as const) {
      const rengBr = rengBarra(rengPaleta.texto, 0.06)
      rengColocarBarra(rengBr, rengAt[rengA]!, rengAt[rengB]!)
      rengHcl.add(rengBr)
    }
    rengPuntos(rengPaleta, rengHcl, rengAt[1]!, rengAt[2]!)
    rengAt.forEach((rengP, rengI) => {
      const rengE = rengEtiqueta(rengI % 2 === 0 ? 'δ+' : 'δ−', rengPaleta, 0.34, rengI % 2 === 0 ? rengPaleta.positivo : rengPaleta.negativo)
      rengE.position.copy(rengP).add(new THREE.Vector3(0, 0.75, 0))
      rengHcl.add(rengE)
    })
  }

  const rengLondon = new THREE.Group()
  const rengArPos = [-RENG_ARAR / 2, RENG_ARAR / 2].map((rengX) => new THREE.Vector3(rengX, 0, 0))
  const rengNubesAr = rengArPos.map((rengP) => {
    const rengNuc = rengEsfera(rengColor('Ar'), rengRadioNucleo('Ar'), { elemento: 'Ar' })
    rengNuc.position.copy(rengP)
    const rengNube = rengEsfera(rengColor('Ar'), rengRadioNube('Ar') * 1.25, { transparente: true, opacidad: 0.22 })
    rengLondon.add(rengNuc, rengNube)
    return rengNube
  })
  rengPuntos(rengPaleta, rengLondon, rengArPos[0]!, rengArPos[1]!)
  const rengEtqL = rengArPos.map(() => {
    const rengA = rengEtiqueta('δ+', rengPaleta, 0.3, rengPaleta.positivo)
    const rengB = rengEtiqueta('δ−', rengPaleta, 0.3, rengPaleta.negativo)
    rengLondon.add(rengA, rengB)
    return [rengA, rengB] as const
  })

  rengGrupo.add(rengDimero, rengGrupoAgua, rengHcl, rengLondon)

  const rengAplicar = (rengS: number): void => {
    rengOpacidad(rengDimero, rengTramo(rengS, 0, 0.5) * (1 - rengTramo(rengS, 1, 1.4)))
    rengOpacidad(rengGrupoAgua, rengTramo(rengS, 1.2, 1.6) * (1 - rengTramo(rengS, 2, 2.4)) + rengTramo(rengS, 4, 4.4))
    rengOpacidad(rengHcl, rengTramo(rengS, 2.2, 2.6) * (1 - rengTramo(rengS, 3, 3.4)))
    const rengVl = rengTramo(rengS, 3.2, 3.6) * (1 - rengTramo(rengS, 4, 4.4))
    rengOpacidad(rengLondon, rengVl)
    const rengX = 0.3 * Math.sin(2 * Math.PI * 3 * (rengS - 3))
    rengNubesAr.forEach((rengNube, rengI) => rengNube.position.copy(rengArPos[rengI]!).add(new THREE.Vector3(rengX, 0, 0)))
    rengEtqL.forEach(([rengMas, rengMenos], rengI) => {
      const rengP = rengArPos[rengI]!
      const rengSgn = Math.sign(rengX) || 1
      rengMenos.position.copy(rengP).add(new THREE.Vector3(rengSgn * 0.9, 1.2, 0))
      rengMas.position.copy(rengP).add(new THREE.Vector3(-rengSgn * 0.9, 1.2, 0))
      const rengVisible = rengVl * Math.min(1, Math.abs(rengX) / 0.15)
      rengOpacidad(rengMas, rengVisible)
      rengOpacidad(rengMenos, rengVisible)
    })
  }
  rengAplicar(0)
  return { grupo: rengGrupo, distancia: 12, aplicar: rengAplicar }
}
