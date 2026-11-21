import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'
import { rengDerivarTodos } from '../estado/derivados'
import { rengIdFragmento, type RengTrabajo } from '../estado/trabajo'
import { rengAnalizarFragmento, rengCompletarConH } from '../nucleo/analisisMesa'
import type { RengResultadoUnion } from '../nucleo/enlazar'
import { RENG_MAX_ATOMOS_MESA } from '../nucleo/fragmentoSustancia'
import { rengAnadirAtomo, rengAtomo, rengFijarPosiciones, rengFragmentoDe, rengMesaVacia, rengUnir, type RengMesa, type RengVec3 } from '../nucleo/mesa'
import { rengRelajar } from '../nucleo/relajar'
import { rengAnadirSustanciaAMesa, type RengMensajeMesa } from './anadirAMesa'
import { rengProgramarFormaReal } from './formaReal'
import { rengRegistrarGeometria, rengSinProcedencias, type RengProcedencias } from './procedencia'

export type { RengMensajeMesa }

export const rengClaveEnlace = (rengA: number, rengB: number): string => `${Math.min(rengA, rengB)}-${Math.max(rengA, rengB)}`

export function rengRelajarFragmento(rengM: RengMesa, rengIds: number[], rengFijos: ReadonlySet<number> = new Set()): RengMesa {
  const rengIdx = new Map(rengIds.map((rengId, rengI) => [rengId, rengI]))
  const rengEnl = rengM.enlaces.filter((rengE) => rengIdx.has(rengE.a)).map((rengE) => ({ a: rengIdx.get(rengE.a)!, b: rengIdx.get(rengE.b)!, orden: rengE.orden, tipo: rengE.tipo }))
  const rengAts = rengIds.map((rengId) => rengAtomo(rengM, rengId)!)
  const rengP = rengRelajar(rengAts.map((rengA) => rengA.p), rengAts.map((rengA) => rengA.el), rengAts.map((rengA) => rengA.carga), rengEnl, { pasos: 160, fijos: new Set([...rengFijos].filter((rengF) => rengIdx.has(rengF)).map((rengF) => rengIdx.get(rengF)!)) })
  return rengFijarPosiciones(rengM, new Map(rengIds.map((rengId, rengI) => [rengId, rengP[rengI]!])))
}

export function useRengMesa(rengT: RengTrabajo) {
  const rengEstadoTrabajo = useSyncExternalStore(rengT.suscribir, rengT.obtener)
  const rengMesa = rengEstadoTrabajo.mesa
  const [rengNuevos, rengSetNuevos] = useState<ReadonlySet<string>>(new Set())
  const [rengMensaje, rengSetMensaje] = useState<RengMensajeMesa | null>(null)
  const [rengProcedencias, rengSetProcedencias] = useState<RengProcedencias>(rengSinProcedencias)
  const [rengUltimo, rengSetUltimo] = useState<{ a: number; b: number; r: RengResultadoUnion } | null>(null)
  const rengActual = useMemo(() => ({ get current(): RengMesa { return rengT.obtener().mesa } }), [rengT])

  const rengPoner = useCallback((rengM: RengMesa, rengRegistrar = true, rengNuevosEnlaces: string[] = [], rengActivar?: number): void => {
    rengT.aplicar((rengE) => ({ ...rengE, mesa: rengM, activo: rengActivar !== undefined && rengAtomo(rengM, rengActivar) ? rengIdFragmento(rengFragmentoDe(rengM, rengActivar)) : rengE.activo }), rengRegistrar)
    rengSetNuevos(new Set(rengNuevosEnlaces))
  }, [rengT])

  const rengFormaReal = useCallback(
    (rengM: RengMesa, rengId: number): void =>
      rengProgramarFormaReal(
        rengT,
        rengM,
        rengId,
        (rengR) => rengSetProcedencias((rengP) => rengRegistrarGeometria(rengP, rengR.mesa, rengR.ids, rengR.origen)),
        (rengTexto) => rengSetMensaje({ texto: rengTexto, tipo: 'info' })
      ),
    [rengT]
  )

  const rengIntentarUnir = useCallback(
    (rengBase: RengMesa, rengA: number, rengB: number, rengForzar = false): RengResultadoUnion => {
      const rengR = rengUnir(rengBase, rengA, rengB, rengForzar)
      if (!rengR.hecho) {
        rengSetMensaje({ texto: rengR.r.motivo, tipo: 'err', forzar: rengR.r.forzable ? () => rengIntentarUnir(rengBase, rengA, rengB, true) : undefined })
        return rengR.r
      }
      const rengRelajada = rengRelajarFragmento(rengR.mesa, rengFragmentoDe(rengR.mesa, rengA))
      rengPoner(rengRelajada, true, [rengClaveEnlace(rengA, rengB)], rengA)
      rengSetUltimo({ a: rengA, b: rengB, r: rengR.r })
      const rengAnalisis = rengAnalizarFragmento(rengRelajada, rengFragmentoDe(rengRelajada, rengA))
      const rengAvisos = rengR.r.tipo === 'metalico' ? [rengR.r.motivo, ...rengR.r.avisos] : rengR.r.avisos
      if (rengForzar) rengSetMensaje({ texto: `${rengR.r.motivo} Construida igualmente: no confirmado que exista.`, tipo: 'info' })
      else if (rengAvisos.length) rengSetMensaje({ texto: rengAvisos.join(' '), tipo: 'info', red: rengAnalisis.completa ? (rengAnalisis.sustancia?.idRed ?? undefined) : undefined })
      else rengSetMensaje(null)
      rengFormaReal(rengRelajada, rengA)
      return rengR.r
    },
    [rengPoner, rengFormaReal]
  )

  const rengAnadirElemento = useCallback((rengEl: string, rengP: RengVec3 = [0, 0, 0]): number => {
    if (rengActual.current.atomos.length >= RENG_MAX_ATOMOS_MESA) {
      rengSetMensaje({ texto: `La mesa admite hasta ${RENG_MAX_ATOMOS_MESA} átomos.`, tipo: 'err' })
      return -1
    }
    const rengR = rengAnadirAtomo(rengActual.current, rengEl, rengP)
    rengPoner(rengR.mesa, true, [], rengR.id)
    return rengR.id
  }, [rengPoner, rengActual])

  const rengAnadirSustancia = useCallback((rengEntrada: string, rengCentro: RengVec3 = [0, 0, 0], rengReemplazar = false): number[] | null => {
    const rengR = rengAnadirSustanciaAMesa(rengActual.current, rengEntrada, rengCentro, rengReemplazar)
    if (!rengR.ok) {
      rengSetMensaje(rengR.mensaje)
      return null
    }
    rengPoner(rengR.mesa, true, [], rengR.ids[0])
    const rengOrigen = rengR.origen
    if (rengOrigen) rengSetProcedencias((rengP) => rengRegistrarGeometria(rengP, rengR.mesa, rengR.ids, rengOrigen.origen))
    rengSetMensaje(rengR.mensaje)
    return rengR.ids
  }, [rengPoner, rengActual])

  const rengDeshacer = useCallback((): void => {
    rengT.deshacer()
    rengSetNuevos(new Set())
  }, [rengT])
  const rengRehacer = useCallback((): void => {
    rengT.rehacer()
    rengSetNuevos(new Set())
  }, [rengT])
  const rengLimpiar = useCallback((): void => {
    if (rengActual.current.atomos.length) rengPoner(rengMesaVacia())
    rengSetMensaje(null)
    rengSetUltimo(null)
  }, [rengPoner, rengActual])

  const rengCompletarH = useCallback((rengIds: number[]): void => {
    const rengM = rengCompletarConH(rengActual.current, rengIds)
    const rengRelajada = rengRelajarFragmento(rengM, rengFragmentoDe(rengM, rengIds[0]!))
    rengPoner(rengRelajada, true, [], rengIds[0])
    rengFormaReal(rengRelajada, rengIds[0]!)
  }, [rengPoner, rengFormaReal, rengActual])

  const rengOptimizar = useCallback((rengIds: number[]): void => {
    rengPoner(rengRelajarFragmento(rengActual.current, rengIds))
    rengFormaReal(rengActual.current, rengIds[0]!)
  }, [rengPoner, rengFormaReal, rengActual])

  const rengAnalisis = useMemo(() => rengDerivarTodos(rengEstadoTrabajo), [rengEstadoTrabajo])

  return {
    mesa: rengMesa, actual: rengActual, nuevos: rengNuevos, mensaje: rengMensaje, setMensaje: rengSetMensaje, procedencias: rengProcedencias, ultimo: rengUltimo, analisis: rengAnalisis, almacen: rengT,
    puedeDeshacer: rengT.puedeDeshacer(),
    puedeRehacer: rengT.puedeRehacer(),
    poner: rengPoner, intentarUnir: rengIntentarUnir, anadirElemento: rengAnadirElemento, anadirSustancia: rengAnadirSustancia, deshacer: rengDeshacer, rehacer: rengRehacer, limpiar: rengLimpiar, completarH: rengCompletarH, optimizar: rengOptimizar, formaReal: rengFormaReal
  }
}

export type RengEstadoMesa = ReturnType<typeof useRengMesa>
