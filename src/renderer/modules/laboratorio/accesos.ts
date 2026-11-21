import type { RengAcceso } from '../../module-api'

export const RENG_ACCESOS_LABORATORIO: readonly RengAcceso[] = [
  { sub: 'cuaderno', nombre: 'Mi cuaderno', descripcion: 'Corridas y mediciones guardadas.', grupo: 'Laboratorio · Cuaderno', etiquetas: ['cuaderno', 'corridas', 'mediciones', 'proyecto', 'evidencia'] },
  { sub: 'datos', nombre: 'Datos y estadística', descripcion: 'Descriptiva, histograma y regresión.', grupo: 'Laboratorio · Mediciones y datos', etiquetas: ['estadistica', 'media', 'regresion', 'histograma', 'datos'] }
]
