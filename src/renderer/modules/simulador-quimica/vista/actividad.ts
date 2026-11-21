import { createContext, useContext, useRef, type MutableRefObject } from 'react'

export const RengActividadContext = createContext(true)

export const useRengActivo = (): boolean => useContext(RengActividadContext)

export function useRengActivoRef(): MutableRefObject<boolean> {
  const rengActivo = useRengActivo()
  const rengRef = useRef(rengActivo)
  rengRef.current = rengActivo
  return rengRef
}
