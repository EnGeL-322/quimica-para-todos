import type { RengEntradaMenu } from '../../module-api'
import { RENG_ACCESOS_QUIMICA } from './accesos'
import { RENG_EXPERIMENTOS_QUIMICA, RENG_HERRAMIENTAS_MESA } from './navegacion'

const rengNombre = (rengSub: string): string => RENG_ACCESOS_QUIMICA.find((rengA) => rengA.sub === rengSub)?.nombre ?? rengSub

export const RENG_MENU_QUIMICA: readonly RengEntradaMenu[] = [
  { sub: 'catalogo', nombre: 'Catálogo', tambien: [null] },
  { sub: 'temario', nombre: 'Temario' },
  { sub: 'aprender', nombre: 'Aprender' },
  { sub: 'practicas', nombre: 'Prácticas por nivel', tambien: ['ejercicios'] },
  { sub: 'simulacion', nombre: 'Simulación', tambien: ['experimentos'], hijos: RENG_EXPERIMENTOS_QUIMICA.map((rengSub) => ({ sub: rengSub, nombre: rengNombre(rengSub) })) },
  { sub: 'casos', nombre: 'Casos reales' },
  { sub: 'mesa', nombre: 'Mesa molecular', tambien: RENG_HERRAMIENTAS_MESA.map((rengH) => rengH.id) },
  { sub: null, modulo: 'tabla-periodica', nombre: 'Tabla periódica', seccion: 'Consulta' }
]
