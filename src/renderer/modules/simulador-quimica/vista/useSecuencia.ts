import { useCallback, useEffect, useRef, useState } from 'react'
import { rengAlternar, rengAnterior, rengAvanzar, rengEstadoInicial, rengIrA, rengSiguiente, type RengEstadoSecuencia } from '../escena/secuenciador'
import { useRengActivo } from './actividad'
import { rengEsCampoDeTexto, rengMovimientoReducido } from './nivel'

export interface RengControlSecuencia {
  estado: RengEstadoSecuencia
  alternar: () => void
  siguiente: () => void
  anterior: () => void
  ir: (rengPaso: number) => void
}

export function useRengSecuencia(rengDuraciones: number[], rengClave: string, rengAtajos = true): RengControlSecuencia {
  const rengActivo = useRengActivo()
  const rengDur = rengMovimientoReducido() ? rengDuraciones.map(() => 0) : rengDuraciones
  const rengTotal = rengDur.length
  const [rengEstado, rengSetEstado] = useState<RengEstadoSecuencia>(rengEstadoInicial)
  const rengRef = useRef(rengEstado)
  rengRef.current = rengEstado
  const rengDurRef = useRef(rengDur)
  rengDurRef.current = rengDur

  useEffect(() => {
    rengSetEstado(rengIrA(rengEstadoInicial(), 0, Math.max(1, rengTotal)))
  }, [rengClave, rengTotal])

  useEffect(() => {
    if (!rengEstado.reproduciendo || !rengActivo) return
    let rengRaf = 0
    let rengUltimo = performance.now()
    const rengBucle = (rengT: number): void => {
      const rengDt = Math.max(0, Math.min(0.05, (rengT - rengUltimo) / 1000))
      rengUltimo = rengT
      const rengNuevo = rengAvanzar(rengRef.current, rengDt, rengDurRef.current)
      rengSetEstado(rengNuevo)
      if (rengNuevo.reproduciendo) rengRaf = requestAnimationFrame(rengBucle)
    }
    rengRaf = requestAnimationFrame(rengBucle)
    return () => cancelAnimationFrame(rengRaf)
  }, [rengEstado.reproduciendo, rengEstado.paso, rengActivo])

  const rengAcc = useCallback((rengF: (rengE: RengEstadoSecuencia, rengN: number) => RengEstadoSecuencia) => rengSetEstado((rengE) => rengF(rengE, Math.max(1, rengTotal))), [rengTotal])

  useEffect(() => {
    if (!rengAtajos || !rengActivo) return
    const rengTecla = (rengEv: KeyboardEvent): void => {
      if (rengEv.ctrlKey || rengEv.metaKey || rengEv.altKey || rengEsCampoDeTexto(rengEv.target)) return
      const rengEnBoton = (rengEv.target as HTMLElement | null)?.closest?.('button, summary, a')
      if (rengEv.key === ' ' && !rengEnBoton) rengAcc(rengAlternar)
      else if (rengEv.key === 'ArrowRight') rengAcc(rengSiguiente)
      else if (rengEv.key === 'ArrowLeft') rengAcc(rengAnterior)
      else return
      rengEv.preventDefault()
    }
    window.addEventListener('keydown', rengTecla)
    return () => window.removeEventListener('keydown', rengTecla)
  }, [rengAcc, rengAtajos, rengActivo])

  return {
    estado: { ...rengEstado, paso: Math.min(rengEstado.paso, Math.max(0, rengTotal - 1)) },
    alternar: () => rengAcc(rengAlternar),
    siguiente: () => rengAcc(rengSiguiente),
    anterior: () => rengAcc(rengAnterior),
    ir: (rengP) => rengAcc((rengE, rengN) => rengIrA(rengE, rengP, rengN))
  }
}
