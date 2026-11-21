import { RENG_CASOS_ESPACIO } from './espacio'
import { RENG_CASOS_HOGAR } from './hogar'
import { RENG_CASOS_NATURALEZA } from './naturaleza'
import { RENG_CASOS_TESLA } from './tesla'
import type { RengCaso } from './tipos'

export * from './tipos'
export { RENG_FUENTES, rengFuentePorId } from './fuentes'

export const RENG_CASOS: RengCaso[] = [...RENG_CASOS_HOGAR, ...RENG_CASOS_NATURALEZA, ...RENG_CASOS_ESPACIO, ...RENG_CASOS_TESLA]

export const rengCasoPorId = (rengId: string): RengCaso | undefined => RENG_CASOS.find((rengC) => rengC.id === rengId)
