import type { RengEntradaMenu } from '../../module-api'

export const RENG_MENU_LABORATORIO: readonly RengEntradaMenu[] = [
  { sub: 'cuaderno', nombre: 'Mi cuaderno', seccion: 'Cuaderno', tambien: [null] },
  { sub: 'datos', nombre: 'Datos y estadística', seccion: 'Mediciones y datos' }
]
