import type { RengProyecto, RengResumenProyecto } from '@shared/cuaderno'
import { rengProyectoNuevo } from '@shared/cuaderno'
import { rengCall } from '../api'

export const RENG_EVENTO_CUADERNO = 'ciencia:cuaderno'
const RENG_CLAVE_ULTIMO = 'cuaderno.ultimo-proyecto'

export const rengNuevoId = (): string => crypto.randomUUID()

export const rengListarProyectos = (): Promise<{ proyectos: RengResumenProyecto[]; problemas: string[] }> => rengCall('laboratorio', 'proyectos')
export const rengAbrirProyecto = (rengId: string): Promise<RengProyecto> => rengCall('laboratorio', 'abrir', { id: rengId })

export async function rengGuardarProyecto(rengP: RengProyecto): Promise<RengProyecto> {
  const rengG = await rengCall<RengProyecto>('laboratorio', 'guardar', { proyecto: rengP })
  rengRecordarUltimo(rengG.id)
  window.dispatchEvent(new CustomEvent(RENG_EVENTO_CUADERNO, { detail: rengG.id }))
  return rengG
}

export async function rengImportarProyecto(rengContenido: string): Promise<RengProyecto> {
  const rengG = await rengCall<RengProyecto>('laboratorio', 'importar', { contenido: rengContenido })
  window.dispatchEvent(new CustomEvent(RENG_EVENTO_CUADERNO, { detail: rengG.id }))
  return rengG
}

export const rengCrearProyecto = (rengNombre: string): Promise<RengProyecto> => rengGuardarProyecto(rengProyectoNuevo(rengNuevoId(), rengNombre))

export function rengUltimoProyecto(): string | null {
  try {
    return localStorage.getItem(RENG_CLAVE_ULTIMO)
  } catch {
    return null
  }
}
export function rengRecordarUltimo(rengId: string): void {
  try {
    localStorage.setItem(RENG_CLAVE_ULTIMO, rengId)
  } catch {
  }
}

export { rengPedirReapertura, rengTomarReapertura, type RengPeticionReabrir } from './reapertura'
