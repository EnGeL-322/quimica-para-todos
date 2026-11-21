export const RENG_VERSIONES_MODELOS: Readonly<Record<string, string>> = {
  'mezcla-acido-base': '1',
  'sim-acidobase': '1',
  'sim-cinetica': '1',
  'sim-equilibrio': '1',
  'sim-termo': '1',
  'sim-dilucion': '1',
  'sim-colorimetria': '1',
  'sim-solubilidad': '1',
  'sim-electroquimica': '1',
  'sim-isomeros': '1'
}

export type RengCompatibilidad = { tipo: 'actual' } | { tipo: 'otra-version'; actual: string } | { tipo: 'no-disponible' }

export function rengCompatibilidad(rengModeloId: string, rengVersion: string): RengCompatibilidad {
  const rengActual = RENG_VERSIONES_MODELOS[rengModeloId]
  if (rengActual === undefined) return { tipo: 'no-disponible' }
  return rengActual === rengVersion ? { tipo: 'actual' } : { tipo: 'otra-version', actual: rengActual }
}

export function rengTextoCompatibilidad(rengC: RengCompatibilidad, rengVersion: string): string {
  if (rengC.tipo === 'actual') return `Modelo en su versión actual (${rengVersion}).`
  if (rengC.tipo === 'otra-version') return `Guardada con la versión ${rengVersion} del modelo; la app usa la ${rengC.actual}. Se muestran los resultados guardados tal cual; reabrirla la repite con la versión actual.`
  return 'Este modelo no está en esta app (las corridas de física se reabren en Física para Todos): se muestran los resultados guardados, pero no se puede reabrir ni repetir aquí.'
}
