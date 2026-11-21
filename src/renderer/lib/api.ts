import { useEffect, useRef } from 'react'

export function rengCall<RengT = unknown>(rengModuleId: string, rengAction: string, rengPayload?: unknown): Promise<RengT> {
  if (!window.ciencia) return Promise.reject(new Error('Esta función necesita la aplicación de escritorio (no hay conexión con el proceso principal).'))
  return window.ciencia.invoke<RengT>(rengModuleId, rengAction, rengPayload)
}

export function useRengMainEvent<RengT>(rengModuleId: string, rengEvent: string, rengHandler: (rengData: RengT) => void): void {
  const rengRef = useRef(rengHandler)
  rengRef.current = rengHandler
  useEffect(() => (window.ciencia ? window.ciencia.on<RengT>(rengModuleId, rengEvent, (rengD) => rengRef.current(rengD)) : undefined), [rengModuleId, rengEvent])
}

export const rengErrMsg = (rengE: unknown): string => (rengE instanceof Error ? rengE.message : 'Error desconocido.')

export const rengFmtBytes = (rengN: number): string => {
  if (rengN < 1024) return `${rengN} B`
  const rengU = ['KB', 'MB', 'GB', 'TB']
  let rengV = rengN / 1024
  let rengI = 0
  while (rengV >= 1024 && rengI < rengU.length - 1) {
    rengV /= 1024
    rengI++
  }
  return `${rengV.toFixed(rengV < 10 ? 2 : 1)} ${rengU[rengI]}`
}

export interface RengPickedFile {
  path: string
  name: string
  size: number
  ext: string
}
