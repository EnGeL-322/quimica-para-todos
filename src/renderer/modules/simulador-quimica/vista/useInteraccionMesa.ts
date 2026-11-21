import { useCallback, useRef, useState } from 'react'
import * as THREE from 'three'
import type { RengEngine } from '../../../lib/three/engine'
import type { RengEscenaMesa, RengOpcionesMesa } from '../escena/mesa'
import { rengAnalizarFragmento } from '../nucleo/analisisMesa'
import { rengDatos3D } from '../nucleo/elementos3d'
import type { RengResultadoUnion } from '../nucleo/enlazar'
import { rengFragmentoDe as rengFragmentoDeSustancia } from '../nucleo/fragmentoSustancia'
import { rengAnadirAtomo, rengAnadirFragmento, rengAtomo, rengEvaluar, rengFijarPosiciones, rengFragmentoDe, rengSepararAtomo, type RengMesa, type RengVec3 } from '../nucleo/mesa'
import { rengInterpretarSustancia } from '../nucleo/sustancia'
import type { RengItemArrastre } from './arrastre'
import { rengClaveEnlace, type RengEstadoMesa } from './useMesa'

interface RengCandidato {
  m: number
  t: number
  r: RengResultadoUnion
  rango: number
  d: number
}

interface RengOperacion {
  modo: 'mover' | 'enlace'
  base: RengMesa
  ids: Set<number>
  agarrado: number
  inicio: Map<number, THREE.Vector3>
  puntoInicio: THREE.Vector3
  plano: THREE.Plane
  candidato: RengCandidato | null
  enganchado: string | null
  pos: Map<number, THREE.Vector3>
  nuevo: boolean
  movido: boolean
}

export interface RengPista {
  texto: string
  ok: boolean
}

const rengRc = (rengEl: string): number | null => rengDatos3D.get(rengEl)?.rc ?? null
const rengV3 = (rengP: RengVec3): THREE.Vector3 => new THREE.Vector3(rengP[0], rengP[1], rengP[2])
const rengAVec = (rengP: THREE.Vector3): RengVec3 => [rengP.x, rengP.y, rengP.z]

export function useRengInteraccionMesa(rengEstado: RengEstadoMesa, rengEngine: React.RefObject<RengEngine | null>, rengEscena: React.RefObject<RengEscenaMesa | null>, rengOpciones: RengOpcionesMesa) {
  const rengOp = useRef<RengOperacion | null>(null)
  const [rengPista, rengSetPista] = useState<RengPista | null>(null)

  const rengPlano = (rengOrigen: THREE.Vector3): THREE.Plane => {
    const rengCam = rengEngine.current!.camera
    const rengN = new THREE.Vector3()
    rengCam.getWorldDirection(rengN)
    return new THREE.Plane().setFromNormalAndCoplanarPoint(rengN, rengOrigen)
  }

  const rengEmpezar = useCallback(
    (rengModo: RengOperacion['modo'], rengBase: RengMesa, rengIds: Iterable<number>, rengAgarrado: number, rengPunto: THREE.Vector3, rengNuevo: boolean): void => {
      const rengInicio = new Map(rengBase.atomos.map((rengA) => [rengA.id, rengV3(rengA.p)]))
      rengOp.current = { modo: rengModo, base: rengBase, ids: new Set(rengIds), agarrado: rengAgarrado, inicio: rengInicio, puntoInicio: rengPunto.clone(), plano: rengPlano(rengPunto), candidato: null, enganchado: null, pos: new Map(), nuevo: rengNuevo, movido: false }
      if (rengNuevo || rengBase !== rengEstado.actual.current) rengEscena.current?.rengSincronizar(rengBase, rengOpciones)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rengOpciones]
  )

  const rengMoverA = useCallback((rengP: THREE.Vector3): void => {
    const rengO = rengOp.current
    const rengE = rengEscena.current
    if (!rengO || !rengE) return
    rengO.movido = true
    if (rengO.modo === 'enlace') {
      rengE.rengPrevisualizar(rengO.inicio.get(rengO.agarrado)!, rengP, true)
      return
    }
    const rengDelta = rengP.clone().sub(rengO.puntoInicio)
    const rengPos = new Map([...rengO.ids].map((rengId) => [rengId, rengO.inicio.get(rengId)!.clone().add(rengDelta)]))
    let rengMejor: RengCandidato | null = null
    for (const rengM of rengO.ids) {
      const rengAm = rengAtomo(rengO.base, rengM)!
      const rengRm = rengRc(rengAm.el)
      for (const rengT of rengO.base.atomos) {
        if (rengO.ids.has(rengT.id)) continue
        const rengRt = rengRc(rengT.el)
        const rengRango = 1.25 * ((rengRm ?? 0.8) + (rengRt ?? 0.8))
        const rengD = rengPos.get(rengM)!.distanceTo(rengO.inicio.get(rengT.id)!)
        const rengLimite = rengO.enganchado === rengClaveEnlace(rengM, rengT.id) ? 1.6 * rengRango : rengRango
        if (rengD <= rengLimite && (!rengMejor || rengD / rengRango < rengMejor.d / rengMejor.rango)) rengMejor = { m: rengM, t: rengT.id, r: rengEvaluar(rengO.base, rengM, rengT.id), rango: rengRango, d: rengD }
      }
    }
    rengO.candidato = rengMejor
    if (rengMejor && rengMejor.r.permitida && rengMejor.r.longitud) {
      const rengPt = rengO.inicio.get(rengMejor.t)!
      const rengDir = rengPos.get(rengMejor.m)!.clone().sub(rengPt)
      if (rengDir.lengthSq() < 1e-6) rengDir.set(1, 0, 0)
      const rengObjetivo = rengPt.clone().add(rengDir.normalize().multiplyScalar(rengMejor.r.longitud))
      const rengAjuste = rengObjetivo.sub(rengPos.get(rengMejor.m)!)
      for (const rengQ of rengPos.values()) rengQ.add(rengAjuste)
      rengO.enganchado = rengClaveEnlace(rengMejor.m, rengMejor.t)
      rengE.rengPrevisualizar(rengPos.get(rengMejor.m)!, rengPt, true)
      rengSetPista({ texto: rengMejor.r.motivo, ok: true })
    } else if (rengMejor) {
      rengO.enganchado = null
      rengE.rengPrevisualizar(rengPos.get(rengMejor.m)!, rengO.inicio.get(rengMejor.t)!, false)
      rengSetPista({ texto: rengMejor.r.motivo, ok: false })
    } else {
      rengO.enganchado = null
      rengE.rengPrevisualizar(null)
      rengSetPista(null)
    }
    rengO.pos = rengPos
    rengE.rengFijar(rengPos)
  }, [rengEscena])

  const rengTerminar = useCallback((): void => {
    const rengO = rengOp.current
    rengOp.current = null
    rengEscena.current?.rengPrevisualizar(null)
    rengSetPista(null)
    rengEngine.current && (rengEngine.current.controls.enabled = true)
    if (!rengO) return
    if (rengO.modo === 'enlace') return
    const rengMovida = rengFijarPosiciones(rengO.base, new Map([...rengO.pos].map(([rengId, rengP]) => [rengId, rengAVec(rengP)])))
    const rengC = rengO.candidato
    if (rengC && rengC.r.permitida && rengO.enganchado === rengClaveEnlace(rengC.m, rengC.t)) {
      rengEstado.intentarUnir(rengMovida, rengC.m, rengC.t)
      return
    }
    if (rengC && !rengC.r.permitida && rengC.d <= rengC.rango) {
      const rengPt = rengO.inicio.get(rengC.t)!
      const rengPm = rengO.pos.get(rengC.m) ?? rengO.inicio.get(rengC.m)!
      const rengDir = rengPm.clone().sub(rengPt)
      if (rengDir.lengthSq() < 1e-6) rengDir.set(1, 0, 0)
      const rengAjuste = rengPt.clone().add(rengDir.normalize().multiplyScalar(1.6 * rengC.rango)).sub(rengPm)
      const rengRebotada = rengFijarPosiciones(rengMovida, new Map([...rengO.ids].map((rengId) => [rengId, rengAVec((rengO.pos.get(rengId) ?? rengO.inicio.get(rengId)!).clone().add(rengAjuste))])))
      rengEstado.poner(rengRebotada)
      const rengDestino = rengAnalizarFragmento(rengO.base, rengFragmentoDe(rengO.base, rengC.t))
      const rengOrigen = rengAnalizarFragmento(rengO.base, [...rengO.ids])
      const rengTexto = rengDestino.completa && rengDestino.nombre
        ? `No hay enlace directo entre ${rengOrigen.nombre ?? rengOrigen.formula} y ${rengDestino.nombre}: ${rengC.r.motivo.charAt(0).toLowerCase()}${rengC.r.motivo.slice(1)} Podrían reaccionar: eso lo calculará la pestaña Reacciones.`
        : rengC.r.motivo
      rengEstado.setMensaje({ texto: rengTexto, tipo: 'err', forzar: rengC.r.forzable ? () => rengEstado.intentarUnir(rengRebotada, rengC.m, rengC.t, true) : undefined })
      return
    }
    if (rengO.movido || rengO.nuevo) rengEstado.poner(rengMovida)
    else rengEscena.current?.rengSincronizar(rengEstado.actual.current, rengOpciones)
  }, [rengEngine, rengEscena, rengEstado, rengOpciones])

  const rengPulsarAtomo = useCallback(
    (rengId: number, rengPunto: THREE.Vector3, rengMods: { alt: boolean; mayus: boolean }): void => {
      const rengM = rengEstado.actual.current
      if (rengMods.mayus) rengEmpezar('enlace', rengM, [rengId], rengId, rengPunto, false)
      else if (rengMods.alt) rengEmpezar('mover', rengSepararAtomo(rengM, rengId), [rengId], rengId, rengPunto, false)
      else rengEmpezar('mover', rengM, rengFragmentoDe(rengM, rengId), rengId, rengPunto, false)
      if (rengEngine.current) rengEngine.current.controls.enabled = false
    },
    [rengEmpezar, rengEngine, rengEstado]
  )

  const rengTerminarEnlaceSobre = useCallback(
    (rengDestino: number | null): void => {
      const rengO = rengOp.current
      if (rengO?.modo === 'enlace' && rengDestino !== null && rengDestino !== rengO.agarrado) rengEstado.intentarUnir(rengEstado.actual.current, rengO.agarrado, rengDestino)
      rengTerminar()
    },
    [rengEstado, rengTerminar]
  )

  const rengEntrarItem = useCallback(
    (rengItem: RengItemArrastre, rengPunto: THREE.Vector3): boolean => {
      const rengM = rengEstado.actual.current
      if (rengItem.tipo === 'elemento') {
        const rengR = rengAnadirAtomo(rengM, rengItem.el, rengAVec(rengPunto))
        rengEmpezar('mover', rengR.mesa, [rengR.id], rengR.id, rengPunto, true)
        return true
      }
      const rengS = rengInterpretarSustancia(rengItem.entrada)
      const rengF = rengS.tipo === 'ok' ? rengFragmentoDeSustancia(rengS.sustancia) : null
      if (!rengF || !rengF.ok) {
        rengEstado.setMensaje({ texto: rengF && !rengF.ok ? rengF.motivo : `No se pudo interpretar «${rengItem.nombre}».`, tipo: 'err' })
        return false
      }
      const rengR = rengAnadirFragmento(rengM, rengF.f.atomos, rengF.f.enlaces, rengAVec(rengPunto), rengF.f.estereo)
      rengEmpezar('mover', rengR.mesa, rengR.ids, rengR.ids[0]!, rengPunto, true)
      return true
    },
    [rengEmpezar, rengEstado]
  )

  const rengCancelar = useCallback((): void => {
    rengOp.current = null
    rengEscena.current?.rengPrevisualizar(null)
    rengEscena.current?.rengSincronizar(rengEstado.actual.current, rengOpciones)
    rengSetPista(null)
    if (rengEngine.current) rengEngine.current.controls.enabled = true
  }, [rengEngine, rengEscena, rengEstado, rengOpciones])

  return { op: rengOp, pista: rengPista, plano: rengPlano, moverA: rengMoverA, terminar: rengTerminar, pulsarAtomo: rengPulsarAtomo, terminarEnlaceSobre: rengTerminarEnlaceSobre, entrarItem: rengEntrarItem, cancelar: rengCancelar }
}

export type RengInteraccionMesa = ReturnType<typeof useRengInteraccionMesa>
