import { rengCorregir, rengGenerarEjercicios, type RengCorreccion, type RengEjercicio, type RengNivelEjercicio } from './ejerciciosFormulacion'

export const RENG_EJERCICIOS_POR_TANDA = 5

export interface RengEstadoTanda {
  dificultad: RengNivelEjercicio
  semilla: number
  respuestas: Readonly<Record<string, string>>
  correcciones: Readonly<Record<string, RengCorreccion>>
}

export type RengAccionTanda =
  | { tipo: 'dificultad'; dificultad: RengNivelEjercicio }
  | { tipo: 'nuevos' }
  | { tipo: 'escribir'; id: string; texto: string }
  | { tipo: 'comprobar'; ejercicio: RengEjercicio }

export const rengTandaInicial = (): RengEstadoTanda => ({ dificultad: 1, semilla: 1, respuestas: {}, correcciones: {} })

export const rengEjerciciosDe = (rengT: Pick<RengEstadoTanda, 'dificultad' | 'semilla'>): RengEjercicio[] => rengGenerarEjercicios(rengT.dificultad, RENG_EJERCICIOS_POR_TANDA, rengT.semilla * 97 + rengT.dificultad)

export function rengTanda(rengT: RengEstadoTanda, rengA: RengAccionTanda): RengEstadoTanda {
  switch (rengA.tipo) {
    case 'dificultad':
      return rengA.dificultad === rengT.dificultad ? rengT : { dificultad: rengA.dificultad, semilla: rengT.semilla, respuestas: {}, correcciones: {} }
    case 'nuevos':
      return { dificultad: rengT.dificultad, semilla: rengT.semilla + 1, respuestas: {}, correcciones: {} }
    case 'escribir':
      return { ...rengT, respuestas: { ...rengT.respuestas, [rengA.id]: rengA.texto } }
    case 'comprobar':
      return { ...rengT, correcciones: { ...rengT.correcciones, [rengA.ejercicio.id]: rengCorregir(rengA.ejercicio, rengT.respuestas[rengA.ejercicio.id] ?? '') } }
  }
}

export const rengAciertosDe = (rengT: RengEstadoTanda, rengEjercicios: readonly RengEjercicio[]): number => rengEjercicios.filter((rengE) => rengT.correcciones[rengE.id]?.correcta).length
