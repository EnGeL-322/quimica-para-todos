import { RENG_PROCEDENCIA_PARTICULAS } from '../aprender/n1/atomo/comun'
import { RENG_PROCEDENCIA_MASAS, rengDeclarada } from '../aprender/n1/procedencia'
import { RENG_PROCEDENCIA_HISTORIA, RENG_PROCEDENCIA_PUBCHEM, RENG_PROCEDENCIA_TENDENCIAS, RENG_S181T, RENG_S191T, RENG_S25T, RENG_S64T, RENG_S65T, rengSeccionTp } from '../aprender/n1/tabla/comun'
import type { RengProcedenciaN1, RengToleranciaN1 } from '../aprender/n1/tipos'
import { RENG_EI_KJ, RENG_GRUPOS_REPRESENTATIVOS, RENG_RADIO_PM, rengElectronegatividadDe, rengElementoDe } from '../escenas-n1/modelos/tendencias-periodicas'
import { RENG_ELEMENTOS, rengPorSimbolo } from '../../tabla-periodica/data'
import { rengExtraDe } from '../../tabla-periodica/datosElementos'
import { rengEntreN1, rengIndice } from './aleatorio'
import type { RengErrorNo } from './b05-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

export const RENG_TOL_TP: RengToleranciaN1 = { rel: 0.005, abs: 1e-6 }
export const RENG_TOL_TP_ENT: RengToleranciaN1 = { rel: 0.001, abs: 0.02 }
export const RENG_VM_TP = 22.414
export const RENG_EV_KJMOL_TP = 96.485
export const RENG_HC_EVNM_TP = 1239.84
export const RENG_DIDACTICO_TP = 'El volumen molar normal (22,414 L/mol), la equivalencia 1 eV por átomo = 96,485 kJ/mol y h·c = 1239,84 eV·nm son valores de uso común recordados, no contrastados en esta entrega.'
export const RENG_PROCEDENCIA_WIKIDATA = rengDeclarada('Años de descubrimiento de los elementos: datos de Wikidata (CC0) guardados en la tabla periódica de la app, no abiertos de nuevo en esta entrega.')

const RENG_SECCIONES_TP = { '2.5': RENG_S25T, '6.4': RENG_S64T, '6.5': RENG_S65T, '18.1': RENG_S181T, '19.1': RENG_S191T }
export type RengSeccionTpClave = keyof typeof RENG_SECCIONES_TP
export interface RengExtraTp { tendencias?: boolean; pubchem?: boolean; masas?: boolean; particulas?: boolean; historia?: boolean; wikidata?: boolean }
export const rengFuentesTp = (rengSeccion: RengSeccionTpClave, rengPara: string, rengExtra: RengExtraTp = {}): readonly RengProcedenciaN1[] => [
  rengSeccionTp(RENG_SECCIONES_TP[rengSeccion], rengPara),
  ...(rengExtra.tendencias ? [RENG_PROCEDENCIA_TENDENCIAS] : []),
  ...(rengExtra.pubchem ? [RENG_PROCEDENCIA_PUBCHEM] : []),
  ...(rengExtra.masas ? [RENG_PROCEDENCIA_MASAS] : []),
  ...(rengExtra.particulas ? [RENG_PROCEDENCIA_PARTICULAS] : []),
  ...(rengExtra.historia ? [RENG_PROCEDENCIA_HISTORIA] : []),
  ...(rengExtra.wikidata ? [RENG_PROCEDENCIA_WIKIDATA] : [])
]

export interface RengEspecTp<T> extends RengExtraTp {
  id: string
  titulo: string
  objetivo: string
  unidad: string
  tolerancia?: RengToleranciaN1
  seccion: RengSeccionTpClave
  para: string
  idealizado: string
  metodo: string
  sinVerificar?: readonly string[]
  lista: readonly T[]
  x?: readonly [number, number, number]
  y?: readonly [number, number, number]
  valida?: (rengE: T, rengX: number, rengY: number) => boolean
  respuesta: (rengE: T, rengX: number, rengY: number) => number
  errores: (rengE: T, rengX: number, rengY: number, rengR: number) => readonly RengErrorNo[]
  enunciado: (rengE: T, rengX: number, rengY: number) => string
  pregunta: string | ((rengE: T, rengX: number, rengY: number) => string)
  datos: (rengE: T, rengX: number, rengY: number) => ReadonlyArray<readonly [string, string]>
  pasos: (rengE: T, rengX: number, rengY: number, rengR: number) => readonly string[]
  pistas: readonly [string, string, string]
}

const RENG_DIFICULTAD = { 1: 'basica', 2: 'intermedia', 3: 'avanzada' } as const

export function rengPracticaTp<T>(rengE: RengEspecTp<T>): RengPracticaN1 {
  const rengSub = rengE.id.replace(/-p[0-9]+$/, '')
  const rengNivel = RENG_DIFICULTAD[Number(/-p([0-9]+)$/.exec(rengE.id)![1]) as 1 | 2 | 3]
  const E = (rengD: Readonly<Record<string, number>>): T => rengE.lista[rengD.i!]!
  return rengFabricarPracticaN1({
    id: rengE.id, subtema: rengSub, titulo: rengE.titulo, dificultad: rengNivel, objetivo: rengE.objetivo, unidad: rengE.unidad, tolerancia: rengE.tolerancia ?? RENG_TOL_TP,
    fuentes: rengFuentesTp(rengE.seccion, rengE.para, rengE), idealizado: rengE.idealizado, metodo: rengE.metodo, sinVerificar: rengE.sinVerificar ?? [],
    parametros: (rengRng) => ({ i: rengIndice(rengRng, rengE.lista.length), x: rengE.x ? rengEntreN1(rengRng, rengE.x[0], rengE.x[1], rengE.x[2]) : 0, y: rengE.y ? rengEntreN1(rengRng, rengE.y[0], rengE.y[1], rengE.y[2]) : 0 }),
    valida: (rengD) => (rengE.valida ? rengE.valida(E(rengD), rengD.x!, rengD.y!) : true),
    respuesta: (rengD) => rengE.respuesta(E(rengD), rengD.x!, rengD.y!),
    errores: (rengD, rengR) => rengE.errores(E(rengD), rengD.x!, rengD.y!, rengR).map((rengX) => [...rengX] as [string, string, number, string]),
    enunciado: (rengD) => rengE.enunciado(E(rengD), rengD.x!, rengD.y!),
    pregunta: (rengD) => (typeof rengE.pregunta === 'string' ? rengE.pregunta : rengE.pregunta(E(rengD), rengD.x!, rengD.y!)),
    datos: (rengD) => rengE.datos(E(rengD), rengD.x!, rengD.y!),
    pasos: (rengD, rengR) => rengE.pasos(E(rengD), rengD.x!, rengD.y!, rengR),
    pistas: rengE.pistas
  })
}

export const rengZTp = (rengS: string): number => rengPorSimbolo.get(rengS)!.z
export const rengATp = (rengS: string): number => rengPorSimbolo.get(rengS)!.masa
export const rengNombreTp = (rengS: string): string => rengPorSimbolo.get(rengS)!.nombre.toLowerCase()
export const rengPeriodoTp = (rengS: string): number => rengPorSimbolo.get(rengS)!.periodo
export const rengGrupoTp = (rengS: string): number => rengPorSimbolo.get(rengS)!.grupo!
export const rengValenciaTp = (rengS: string): number => { const g = rengGrupoTp(rengS); return g <= 2 ? g : g - 10 }
export const rengRadioTp = (rengS: string): number => RENG_RADIO_PM[rengS]!
export const rengEiTp = (rengS: string): number => RENG_EI_KJ[rengS]!
export const rengEnTp = (rengS: string): number => rengElectronegatividadDe(rengZTp(rengS))
export const rengAnioTp = (rengS: string): number => { const e = rengPorSimbolo.get(rengS)!; return rengExtraDe(e.z, e.estado).anioDescubrimiento! }
export const RENG_GASES_Z_TP: readonly number[] = [2, 10, 18, 36, 54, 86, 118]
export const rengGasPrevioTp = (rengZ: number): number => [0, ...RENG_GASES_Z_TP].filter((rengG) => rengG < rengZ).at(-1)!
export const rengGasPeriodoTp = (rengZ: number): number => RENG_GASES_Z_TP.find((rengG) => rengG >= rengZ)!
export const RENG_LONGITUD_PERIODO_TP: readonly number[] = [2, 8, 8, 18, 18, 32, 32]

export const RENG_REPRESENTATIVOS_TP: readonly string[] = [2, 3, 4, 5].flatMap((rengP) => RENG_GRUPOS_REPRESENTATIVOS.map((rengG) => rengElementoDe(rengP, rengG).simbolo))
export const RENG_BLOQUE_P_TP: readonly string[] = RENG_REPRESENTATIVOS_TP.filter((rengS) => rengGrupoTp(rengS) >= 13)
export const RENG_CON_EN_TP: readonly string[] = RENG_REPRESENTATIVOS_TP.filter((rengS) => rengEnTp(rengS) > 0)
export const rengVecinoGrupoTp = (rengS: string, rengSalto: number): string => rengElementoDe(rengPeriodoTp(rengS) + rengSalto, rengGrupoTp(rengS)).simbolo

export type RengTriadaTp = readonly [string, string, string]
export const RENG_TRIADAS_TP: readonly RengTriadaTp[] = [1, 2, 13, 14, 15, 16, 17].flatMap((rengG) => [2, 3].map((rengP) => [rengElementoDe(rengP, rengG).simbolo, rengElementoDe(rengP + 1, rengG).simbolo, rengElementoDe(rengP + 2, rengG).simbolo] as const))
export const RENG_TRIADAS_18_TP: readonly RengTriadaTp[] = [...RENG_TRIADAS_TP, ...[2, 3].map((rengP) => [rengElementoDe(rengP, 18).simbolo, rengElementoDe(rengP + 1, 18).simbolo, rengElementoDe(rengP + 2, 18).simbolo] as const)]

export type RengParTp = readonly [string, string]
export const RENG_PARES_GRUPO_TP: readonly RengParTp[] = RENG_GRUPOS_REPRESENTATIVOS.flatMap((rengG) => [[2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5]].map(([rengA, rengB]) => [rengElementoDe(rengA!, rengG).simbolo, rengElementoDe(rengB!, rengG).simbolo] as const))
export const RENG_PARES_PERIODO_TP: readonly RengParTp[] = [2, 3, 4, 5].flatMap((rengP) => [[1, 14], [1, 15], [1, 16], [1, 17], [2, 15], [2, 16], [2, 17], [13, 17], [14, 17]].map(([rengA, rengB]) => [rengElementoDe(rengP, rengA!).simbolo, rengElementoDe(rengP, rengB!).simbolo] as const))

export const RENG_TODOS_TP = RENG_ELEMENTOS
