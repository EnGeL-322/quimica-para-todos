import { createContext, useContext, useSyncExternalStore } from 'react'
import { rengCrearTrabajo, type RengEstadoTrabajo, type RengTrabajo } from '../estado/trabajo'

export const RengTrabajoContext = createContext<RengTrabajo>(rengCrearTrabajo())

export const useRengAlmacen = (): RengTrabajo => useContext(RengTrabajoContext)

export function useRengTrabajo<RengT>(rengSelector: (rengE: RengEstadoTrabajo) => RengT): RengT {
  const rengT = useRengAlmacen()
  return useSyncExternalStore(rengT.suscribir, () => rengSelector(rengT.obtener()))
}
