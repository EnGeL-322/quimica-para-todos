export type RengNivelPractica = 'preuniversitario' | 'universitario' | 'quimico' | 'cientifico'
export type RengDetalleMesa = 'basico' | 'avanzado'

export const RENG_NIVELES_PRACTICA: readonly RengNivelPractica[] = ['preuniversitario', 'universitario', 'quimico', 'cientifico']

export const RENG_INFO_NIVEL_PRACTICA: Record<RengNivelPractica, { nombre: string; corto: string; descripcion: string; tecla: string }> = {
  preuniversitario: { nombre: 'Preuniversitario', corto: 'Preuniv.', descripcion: 'Enunciado breve, datos guiados con unidades, una incógnita y pistas progresivas.', tecla: '1' },
  universitario: { nombre: 'Universitario', corto: 'Univ.', descripcion: 'Varios pasos, elección del método, conversiones de unidades y datos experimentales sencillos.', tecla: '2' },
  quimico: { nombre: 'Químico', corto: 'Químico', descripcion: 'Problemas integrados: justificar el método, identificar las especies o el modelo y comprobar el resultado.', tecla: '3' },
  cientifico: { nombre: 'Científico', corto: 'Científico', descripcion: 'Ajuste, incertidumbre, residuos, sensibilidad o comparación de modelos, con los supuestos a la vista.', tecla: '4' }
}

export const RENG_NIVEL_PRACTICA_INICIAL: RengNivelPractica = 'preuniversitario'
export const RENG_CLAVE_NIVEL_PRACTICA = 'ciencia.nivel.simulador-quimica'
export const RENG_CLAVE_NIVEL_ANTIGUA = 'quimica.nivel'

export const rengEsNivelPractica = (rengX: unknown): rengX is RengNivelPractica => typeof rengX === 'string' && (RENG_NIVELES_PRACTICA as readonly string[]).includes(rengX)

export const rengIndiceNivelPractica = (rengN: RengNivelPractica): number => RENG_NIVELES_PRACTICA.indexOf(rengN)

export const rengNivelPermite = (rengActual: RengNivelPractica, rengMinimo: RengNivelPractica): boolean => rengIndiceNivelPractica(rengActual) >= rengIndiceNivelPractica(rengMinimo)

export function rengNivelDeTecla(rengTecla: string): RengNivelPractica | null {
  const rengI = ['1', '2', '3', '4'].indexOf(rengTecla)
  return rengI >= 0 ? (RENG_NIVELES_PRACTICA[rengI] ?? null) : null
}

export const rengDetalleDeNivel = (rengN: RengNivelPractica): RengDetalleMesa => (rengN === 'preuniversitario' ? 'basico' : 'avanzado')

export const rengNivelDeDetalle = (rengDetalle: RengDetalleMesa, rengActual: RengNivelPractica): RengNivelPractica => {
  if (rengDetalle === 'basico') return 'preuniversitario'
  return rengActual === 'preuniversitario' ? 'universitario' : rengActual
}

export const rengMigrarNivelAntiguo = (rengV: string | null | undefined): RengNivelPractica | null => {
  if (rengV === 'basico') return 'preuniversitario'
  if (rengV === 'avanzado') return 'universitario'
  return null
}

export interface RengAlmacenNivel {
  getItem: (rengK: string) => string | null
  setItem: (rengK: string, rengV: string) => void
}

export function rengLeerNivelPractica(rengA: RengAlmacenNivel | null): RengNivelPractica {
  try {
    const rengActual = rengA?.getItem(RENG_CLAVE_NIVEL_PRACTICA)
    if (rengEsNivelPractica(rengActual)) return rengActual
    const rengMigrado = rengMigrarNivelAntiguo(rengA?.getItem(RENG_CLAVE_NIVEL_ANTIGUA))
    if (rengMigrado) {
      rengA?.setItem(RENG_CLAVE_NIVEL_PRACTICA, rengMigrado)
      return rengMigrado
    }
    return RENG_NIVEL_PRACTICA_INICIAL
  } catch {
    return RENG_NIVEL_PRACTICA_INICIAL
  }
}

export function rengGuardarNivelPractica(rengA: RengAlmacenNivel | null, rengN: RengNivelPractica): boolean {
  try {
    if (!rengA) return false
    rengA.setItem(RENG_CLAVE_NIVEL_PRACTICA, rengN)
    rengA.setItem(RENG_CLAVE_NIVEL_ANTIGUA, rengDetalleDeNivel(rengN))
    return true
  } catch {
    return false
  }
}
