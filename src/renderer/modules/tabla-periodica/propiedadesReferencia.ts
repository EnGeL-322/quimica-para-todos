import { RENG_ELEMENTOS } from './data'
import rengDatos from './propiedades-pubchem.json'

export const RENG_CONSULTA_PROPIEDADES = rengDatos.consulta

const RENG_USOS: Partial<Record<number, string>> = {
  8: 'El oxígeno se usa en la producción de acero para oxidar impurezas del metal fundido.',
  26: 'El hierro es el componente principal de los aceros y las fundiciones.',
  29: 'Las aleaciones de cobre incluyen el latón y el bronce, utilizados, entre otras aplicaciones, en monedas y ornamentos.'
}

export function rengPropiedadesAdicionales(rengZ: number): { electronegatividad?: number; oxidacion?: string; usos?: string; fuente?: string } {
  const rengFila = rengDatos.elementos[rengZ - 1]
  if (!rengFila || rengFila[0] !== RENG_ELEMENTOS[rengZ - 1]?.simbolo) return {}
  return {
    electronegatividad: typeof rengFila[1] === 'number' ? rengFila[1] : undefined,
    oxidacion: typeof rengFila[2] === 'string' ? rengFila[2] : undefined,
    usos: RENG_USOS[rengZ],
    fuente: `https://pubchem.ncbi.nlm.nih.gov/element/${rengZ}`
  }
}
