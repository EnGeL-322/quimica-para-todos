import { rengCalculado, rengDidactico, rengIdealizado, rengSinVerificar } from '../aprender/n1/procedencia'
import type { RengProcedenciaN1, RengToleranciaN1 } from '../aprender/n1/tipos'
import { rengGeneradorN1, rengGenerarValidaN1, type RengGeneradorN1 } from './aleatorio'
import type { RengDificultadN1, RengPracticaN1 } from './tipos'

export type RengDatosPracticaN1 = Readonly<Record<string, number>>
export type RengErrorEspecN1 = readonly [id: string, nombre: string, valor: number, mensaje: string]

export interface RengEspecPracticaN1<D extends RengDatosPracticaN1> {
  id: string
  subtema: string
  subtemas?: readonly string[]
  titulo: string
  dificultad: RengDificultadN1
  objetivo: string
  unidad: string
  cifras?: number
  tolerancia: RengToleranciaN1
  fuentes: readonly RengProcedenciaN1[]
  idealizado: string
  metodo: string
  sinVerificar?: readonly string[]
  parametros: (rengRng: RengGeneradorN1) => D
  valida?: (rengD: D) => boolean
  respuesta: (rengD: D) => number
  errores: (rengD: D, rengR: number) => readonly RengErrorEspecN1[]
  enunciado: (rengD: D) => string
  pregunta: (rengD: D) => string
  datos: (rengD: D) => ReadonlyArray<readonly [string, string]>
  pasos: (rengD: D, rengR: number) => readonly string[]
  pistas: readonly [string, string, string]
}

export const RENG_SEPARACION_MINIMA_ABS = 0.15
export const RENG_SEPARACION_MINIMA_REL = 0.015
export const RENG_VENTANA_ERROR_REL = 0.01

export const rengLimiteToleranciaN1 = (rengEsperado: number, rengTol: RengToleranciaN1): number => Math.max(rengTol.abs, rengTol.rel * Math.abs(rengEsperado))

export const rengVentanaErrorN1 = (rengValor: number, rengTol: RengToleranciaN1): number => Math.max(rengTol.abs, RENG_VENTANA_ERROR_REL * Math.abs(rengValor))

export function rengSeparadosN1(rengRespuesta: number, rengErrores: readonly number[], rengTol: RengToleranciaN1): boolean {
  const rengTodos = [rengRespuesta, ...rengErrores]
  if (!rengTodos.every((rengV) => Number.isFinite(rengV))) return false
  if (!(Math.abs(rengRespuesta) > 5 * rengTol.abs)) return false
  const rengVentana = (rengI: number, rengV: number): number => (rengI === 0 ? rengLimiteToleranciaN1(rengV, rengTol) : rengVentanaErrorN1(rengV, rengTol))
  for (let rengI = 0; rengI < rengTodos.length; rengI++) {
    for (let rengJ = rengI + 1; rengJ < rengTodos.length; rengJ++) {
      const rengA = rengTodos[rengI]!
      const rengB = rengTodos[rengJ]!
      const rengDif = Math.abs(rengA - rengB)
      if (rengDif < Math.max(RENG_SEPARACION_MINIMA_ABS, RENG_SEPARACION_MINIMA_REL * Math.max(Math.abs(rengA), Math.abs(rengB)))) return false
      if (rengDif <= rengVentana(rengI, rengA) + rengVentana(rengJ, rengB)) return false
    }
  }
  return true
}

export function rengProcedenciaPracticaN1(rengE: Pick<RengEspecPracticaN1<RengDatosPracticaN1>, 'fuentes' | 'idealizado' | 'metodo' | 'sinVerificar'>): readonly RengProcedenciaN1[] {
  return [
    ...rengE.fuentes,
    rengIdealizado(rengE.idealizado),
    rengDidactico('Los datos de cada variante salen de intervalos elegidos para la práctica y de la semilla; no son mediciones reales ni datos de una muestra concreta.'),
    rengCalculado(`La respuesta de cada variante se calcula con lógica pura a partir de sus datos. Las pruebas la recalculan con un segundo método (${rengE.metodo}). Ninguna persona ha revisado todavía las respuestas.`),
    ...(rengE.sinVerificar ?? []).map((rengT) => rengSinVerificar(rengT))
  ]
}

export function rengFabricarPracticaN1<D extends RengDatosPracticaN1>(rengE: RengEspecPracticaN1<D>): RengPracticaN1 {
  const rengAceptable = (rengD: D): boolean => {
    if (rengE.valida && !rengE.valida(rengD)) return false
    const rengR = rengE.respuesta(rengD)
    const rengErrores = rengE.errores(rengD, rengR)
    if (new Set(rengErrores.map((rengX) => rengX[3])).size !== rengErrores.length) return false
    return rengSeparadosN1(rengR, rengErrores.map((rengX) => rengX[2]), rengE.tolerancia)
  }
  return {
    id: rengE.id,
    subtema: rengE.subtema,
    ...(rengE.subtemas ? { subtemas: [...rengE.subtemas] } : {}),
    titulo: rengE.titulo,
    dificultad: rengE.dificultad,
    objetivo: rengE.objetivo,
    unidad: rengE.unidad,
    cifras: rengE.cifras ?? 3,
    tolerancia: rengE.tolerancia,
    procedencia: rengProcedenciaPracticaN1(rengE),
    generar(rengSemilla) {
      const rengRng = rengGeneradorN1(rengE.id, rengSemilla)
      const rengD = rengGenerarValidaN1(rengRng, () => rengE.parametros(rengRng), rengAceptable)
      const rengR = rengE.respuesta(rengD)
      return {
        semilla: rengSemilla,
        parametros: { ...rengD },
        enunciado: rengE.enunciado(rengD),
        pregunta: rengE.pregunta(rengD),
        datos: rengE.datos(rengD),
        respuesta: rengR,
        pasos: rengE.pasos(rengD, rengR),
        pistas: rengE.pistas,
        errores: rengE.errores(rengD, rengR).map((rengX) => ({ id: rengX[0], nombre: rengX[1], valor: rengX[2], mensaje: rengX[3] }))
      }
    }
  }
}
