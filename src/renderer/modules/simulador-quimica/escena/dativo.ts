import * as THREE from 'three'
import type { RengSecuenciaDativa } from '../enlaces/secuencias'
import { RENG_GEOMETRIAS } from '../nucleo/datosEnlace'
import { rengColor, rengRadioNucleo } from './lewis'
import { rengMezclar, rengTramo } from './secuenciador'
import { rengBarra, rengColocarBarra, rengEsfera, rengEtiqueta, rengFlecha, rengOpacidad, type RengEscenaEnlace, type RengPaleta } from './util3d'

const rengRad = (rengG: number): number => (rengG * Math.PI) / 180
const RENG_EJE_X = new THREE.Vector3(1, 0, 0)

const rengPhiC3v = (rengBeta: number): number => Math.acos(Math.sqrt((2 * Math.cos(rengRad(rengBeta)) + 1) / 3))

function rengDireccionesH(rengPhi: number, rengN: number, rengEje: THREE.Vector3): THREE.Vector3[] {
  const rengQ = new THREE.Quaternion().setFromUnitVectors(RENG_EJE_X, rengEje.clone().normalize())
  return Array.from({ length: rengN }, (_, rengK) => {
    const rengT = (2 * Math.PI * rengK) / 3
    return new THREE.Vector3(-Math.cos(rengPhi), Math.sin(rengPhi) * Math.cos(rengT), Math.sin(rengPhi) * Math.sin(rengT)).applyQuaternion(rengQ)
  })
}

function rengMalla(rengColorM: number, rengRadio: number): THREE.Mesh {
  const rengM = new THREE.Mesh(new THREE.SphereGeometry(rengRadio, 14, 10), new THREE.MeshBasicMaterial({ color: rengColorM, wireframe: true, transparent: true, opacity: 0.55 }))
  return rengM
}

interface RengDador {
  grupo: THREE.Group
  inicio: THREE.Vector3
  fin: THREE.Vector3
  eje: THREE.Vector3
  hs: THREE.Mesh[]
  barras: THREE.Mesh[]
  dirH0: THREE.Vector3[]
  dirH1: THREE.Vector3[]
  largoH: number
  par: THREE.Mesh[]
  lobuloPar: THREE.Mesh
  nuevo: THREE.Mesh
  flecha: THREE.ArrowHelper
}

export function rengEscenaDativa(rengSec: RengSecuenciaDativa, rengPaleta: RengPaleta): RengEscenaEnlace {
  const rengGrupo = new THREE.Group()
  const rengElD = rengSec.dador === 'NH3' ? 'N' : 'O'
  const rengNH = rengSec.dador === 'NH3' ? 3 : 2
  const rengGeo = RENG_GEOMETRIAS[rengSec.dador]!.valor
  const rengLargoH = rengSec.dador === 'NH3' ? rengGeo.enlaces['N–H']! : rengGeo.enlaces['O–H']!
  const rengPhi0 = rengPhiC3v(rengSec.dador === 'NH3' ? rengGeo.angulos!['H–N–H']! : 109.47)
  const rengPhiFinal = rengPhiC3v(109.47)
  const rengComplejo = rengSec.aceptor === 'Cu2+'
  const rengDEnlace = rengSec.aceptor === 'H+' ? rengLargoH : rengSec.aceptor === 'BF3' ? 1.65 : 2.0
  const rengDLejos = rengDEnlace + 2.6

  const rengEjes = rengComplejo ? [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, -1, 0)] : [RENG_EJE_X.clone()]

  const rengDadores: RengDador[] = rengEjes.map((rengEje) => {
    const rengHaciaAceptor = rengComplejo ? rengEje.clone().negate() : rengEje.clone()
    const rengG = new THREE.Group()
    rengGrupo.add(rengG)
    const rengNucleo = rengEsfera(rengColor(rengElD), rengRadioNucleo(rengElD), { elemento: rengElD })
    rengG.add(rengNucleo)
    const rengDirH0 = rengDireccionesH(rengPhi0, rengNH, rengHaciaAceptor)
    const rengDirH1 = rengDireccionesH(rengPhiFinal, rengNH, rengHaciaAceptor)
    const rengHs = rengDirH0.map(() => rengEsfera(rengColor('H'), rengRadioNucleo('H'), { elemento: 'H' }))
    const rengBarras = rengDirH0.map(() => rengBarra(rengPaleta.texto, 0.05))
    rengG.add(...rengHs, ...rengBarras)
    const rengPar = [-1, 1].map(() => rengEsfera(rengPaleta.electron, 0.07))
    rengG.add(...rengPar)
    const rengLobuloPar = rengEsfera(rengPaleta.electron, 1, { transparente: true, opacidad: 0.28 })
    rengLobuloPar.scale.set(0.42, 0.24, 0.24)
    rengLobuloPar.quaternion.setFromUnitVectors(RENG_EJE_X, rengHaciaAceptor)
    rengG.add(rengLobuloPar)
    const rengNuevo = rengBarra(rengPaleta.acento, 0.06)
    rengGrupo.add(rengNuevo)
    const rengF = rengFlecha(rengPaleta.acento)
    rengGrupo.add(rengF)
    const rengFin = rengComplejo ? rengEje.clone().multiplyScalar(rengDEnlace) : new THREE.Vector3()
    const rengInicio = rengComplejo ? rengEje.clone().multiplyScalar(rengDLejos) : new THREE.Vector3()
    return { grupo: rengG, inicio: rengInicio, fin: rengFin, eje: rengHaciaAceptor, hs: rengHs, barras: rengBarras, dirH0: rengDirH0, dirH1: rengDirH1, largoH: rengLargoH, par: rengPar, lobuloPar: rengLobuloPar, nuevo: rengNuevo, flecha: rengF }
  })
  if (rengSec.dador === 'H2O') {
    const rengD = rengDadores[0]!
    const rengOtro = rengDireccionesH(rengPhiFinal, 3, rengD.eje)[2]!
    for (const rengSgn of [-1, 1]) {
      const rengP = rengEsfera(rengPaleta.electron, 0.07)
      rengP.position.copy(rengOtro.clone().multiplyScalar(0.55)).add(new THREE.Vector3(0, 0, 0.09 * rengSgn))
      rengD.grupo.add(rengP)
    }
  }

  const rengAceptor = new THREE.Group()
  rengGrupo.add(rengAceptor)
  const rengElA = rengSec.aceptor === 'H+' ? 'H' : rengSec.aceptor === 'BF3' ? 'B' : 'Cu'
  rengAceptor.add(rengEsfera(rengColor(rengElA), rengRadioNucleo(rengElA) * (rengElA === 'Cu' ? 0.8 : 1), { elemento: rengElA }))
  const rengVacios: THREE.Mesh[] = []
  if (rengSec.aceptor === 'H+') rengVacios.push(rengMalla(rengPaleta.texto, 0.4))
  else if (rengSec.aceptor === 'BF3') {
    for (const rengSgn of [-1, 1]) {
      const rengV = rengMalla(rengPaleta.texto, 1)
      rengV.scale.set(0.45, 0.22, 0.22)
      rengV.position.set(0.42 * rengSgn, 0, 0)
      rengVacios.push(rengV)
    }
  } else {
    for (const rengE of rengEjes) {
      const rengV = rengMalla(rengPaleta.texto, 1)
      rengV.scale.set(0.5, 0.24, 0.24)
      rengV.quaternion.setFromUnitVectors(RENG_EJE_X, rengE)
      rengV.position.copy(rengE).multiplyScalar(0.55)
      rengVacios.push(rengV)
    }
  }
  rengAceptor.add(...rengVacios)
  const rengEtqVacio = rengEtiqueta('orbital vacío', rengPaleta, 0.32)
  rengEtqVacio.position.set(0, 0.9, 0)
  rengAceptor.add(rengEtqVacio)
  const rengFluor = rengSec.aceptor === 'BF3' ? [0, 1, 2].map(() => ({ at: rengEsfera(rengColor('F'), rengRadioNucleo('F'), { elemento: 'F' }), b: rengBarra(rengPaleta.texto, 0.05) })) : []
  for (const rengF of rengFluor) rengAceptor.add(rengF.at, rengF.b)
  const rengLargoBF = RENG_GEOMETRIAS.BF3!.valor.enlaces['B–F']!

  const rengCarga = rengEtiqueta(rengSec.aceptor === 'BF3' ? 'H₃N→BF₃' : rengSec.aceptor === 'H+' ? (rengSec.dador === 'NH3' ? 'NH₄⁺' : 'H₃O⁺') : '[Cu(NH₃)₄]²⁺', rengPaleta, 0.42, rengPaleta.positivo)
  rengGrupo.add(rengCarga)
  const rengNc = rengComplejo ? rengEtiqueta('número de coordinación = 4', rengPaleta, 0.34) : null
  if (rengNc) rengGrupo.add(rengNc)

  const rengBorraFlecha = rengSec.aceptor === 'H+'
  const rengPosAceptor = new THREE.Vector3()

  const rengAplicar = (rengS: number): void => {
    const rengAcerca = rengTramo(rengS, 2, 2.7)
    const rengFinal = rengTramo(rengS, 3, 3.8)
    if (rengComplejo) rengPosAceptor.set(0, 0, 0)
    else rengPosAceptor.set(rengMezclar(rengDLejos, rengDEnlace, rengAcerca), 0, 0)
    rengAceptor.position.copy(rengPosAceptor)
    rengOpacidad(rengAceptor, rengTramo(rengS, 1, 1.5))
    rengVacios.forEach((rengV) => rengOpacidad(rengV, rengTramo(rengS, 1, 1.5) * (1 - rengTramo(rengS, 2.4, 3))))
    rengOpacidad(rengEtqVacio, rengTramo(rengS, 1.2, 1.6) * (1 - rengTramo(rengS, 2.2, 2.6)))

    for (const rengD of rengDadores) {
      const rengPD = rengD.inicio.clone().lerp(rengD.fin, rengAcerca)
      rengD.grupo.position.copy(rengPD)
      rengOpacidad(rengD.grupo, rengTramo(rengS, 0, 0.5))
      rengD.hs.forEach((rengH, rengK) => {
        const rengDir = rengD.dirH0[rengK]!.clone().lerp(rengD.dirH1[rengK]!, rengSec.aceptor === 'H+' ? rengFinal : 0).normalize()
        rengH.position.copy(rengDir).multiplyScalar(rengD.largoH)
        rengColocarBarra(rengD.barras[rengK]!, new THREE.Vector3(), rengH.position)
      })
      const rengDir = rengD.eje
      const rengDestino = rengPosAceptor.clone().sub(rengPD)
      const rengMitad = rengDestino.clone().multiplyScalar(0.5)
      const rengLateral = new THREE.Vector3(0, 0, 1)
      rengD.par.forEach((rengP, rengK) => {
        const rengPropio = rengDir.clone().multiplyScalar(0.55).addScaledVector(rengLateral, (rengK === 0 ? -1 : 1) * 0.09)
        const rengEnEnlace = rengMitad.clone().addScaledVector(rengLateral, (rengK === 0 ? -1 : 1) * 0.09)
        rengP.position.copy(rengPropio).lerp(rengEnEnlace, rengTramo(rengS, 2.3, 3))
        rengOpacidad(rengP, rengTramo(rengS, 0, 0.5) * (1 - rengTramo(rengS, 3, 3.5)))
      })
      rengD.lobuloPar.position.copy(rengDir).multiplyScalar(0.5)
      rengOpacidad(rengD.lobuloPar, rengTramo(rengS, 0.2, 0.7) * (1 - rengTramo(rengS, 2.3, 2.8)))
      rengColocarBarra(rengD.nuevo, rengPD, rengPosAceptor)
      rengOpacidad(rengD.nuevo, rengTramo(rengS, 2.6, 3))
      const rengLargo = rengPD.distanceTo(rengPosAceptor)
      rengD.flecha.position.copy(rengPD).add(new THREE.Vector3(0, 0, 0.35))
      rengD.flecha.setDirection(rengPosAceptor.clone().sub(rengPD).normalize())
      rengD.flecha.setLength(Math.max(0.3, rengLargo), 0.22, 0.14)
      rengOpacidad(rengD.flecha, rengTramo(rengS, 2.6, 3) * (rengBorraFlecha ? 1 - rengTramo(rengS, 3.1, 3.6) : 1))
      if (rengBorraFlecha) (rengD.nuevo.material as THREE.MeshStandardMaterial).color.setHex(rengFinal > 0.5 ? rengPaleta.texto : rengPaleta.acento)
    }
    const rengIncl = rengMezclar(0, rengRad(19.47), rengFinal)
    rengFluor.forEach((rengF, rengK) => {
      const rengT = (2 * Math.PI * rengK) / 3
      const rengDir = new THREE.Vector3(Math.sin(rengIncl), Math.cos(rengIncl) * Math.cos(rengT), Math.cos(rengIncl) * Math.sin(rengT))
      rengF.at.position.copy(rengDir).multiplyScalar(rengLargoBF)
      rengColocarBarra(rengF.b, new THREE.Vector3(), rengF.at.position)
    })
    rengCarga.position.set(rengComplejo ? 0 : rengPosAceptor.x / 2, rengComplejo ? 3.4 : 1.7, 0)
    rengOpacidad(rengCarga, rengFinal)
    if (rengNc) {
      rengNc.position.set(0, -3.4, 0)
      rengOpacidad(rengNc, rengFinal)
    }
  }
  if (!rengComplejo) rengGrupo.position.x = -(rengDEnlace + 0.6) / 2
  rengAplicar(0)
  return { grupo: rengGrupo, distancia: rengComplejo ? 11 : 7, aplicar: rengAplicar }
}
