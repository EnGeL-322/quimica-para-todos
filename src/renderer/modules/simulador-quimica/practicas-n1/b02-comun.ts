import { RENG_PROCEDENCIA_ISOTOPOS, RENG_PROCEDENCIA_PARTICULAS, RENG_S21A, RENG_S22A, RENG_S23A, RENG_S61, RENG_S62, RENG_S63, RENG_S64, rengSeccionAt } from '../aprender/n1/atomo/comun'
import { RENG_PROCEDENCIA_MASAS } from '../aprender/n1/procedencia'
import type { RengProcedenciaN1, RengToleranciaN1 } from '../aprender/n1/tipos'
import { RENG_ELEMENTOS, rengPorSimbolo } from '../../tabla-periodica/data'
import { rengEntreN1, rengIndice } from './aleatorio'
import type { RengErrorNo } from './b05-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

export const RENG_TOL_AT: RengToleranciaN1 = { rel: 0.005, abs: 1e-6 }
export const RENG_TOL_AT_ENT: RengToleranciaN1 = { rel: 0.001, abs: 0.02 }
export const RENG_U_G_AT = 1.66054e-24
export const RENG_NA_AT = 6.02214076e23
export const RENG_E_AT = 1.602176634e-19
export const RENG_H_AT = 6.62607015e-34
export const RENG_C_AT = 299792458
export const RENG_ME_KG_AT = 9.1093837e-31
export const RENG_MEV_U_AT = 931.494
export const RENG_HC_EVNM_AT = (RENG_H_AT * RENG_C_AT) / RENG_E_AT / 1e-9
export const RENG_DIDACTICO_AT = 'Las constantes recordadas (masa del electrón 9,1093837·10⁻³¹ kg, 1 u = 1,66054·10⁻²⁴ g = 931,494 MeV, 13,6 eV del hidrógeno y r₀ ≈ 1,2 fm) son valores de uso común no contrastados en esta entrega; h, c, e y N_A son exactos en el SI.'

const RENG_SECCIONES_AT = { '2.1': RENG_S21A, '2.2': RENG_S22A, '2.3': RENG_S23A, '6.1': RENG_S61, '6.2': RENG_S62, '6.3': RENG_S63, '6.4': RENG_S64 }
export type RengSeccionAtClave = keyof typeof RENG_SECCIONES_AT
export const rengFuentesAt = (rengSeccion: RengSeccionAtClave, rengPara: string, rengExtra: { particulas?: boolean; isotopos?: boolean; masas?: boolean } = {}): readonly RengProcedenciaN1[] => [
  rengSeccionAt(RENG_SECCIONES_AT[rengSeccion], rengPara),
  ...(rengExtra.particulas ? [RENG_PROCEDENCIA_PARTICULAS] : []),
  ...(rengExtra.isotopos ? [RENG_PROCEDENCIA_ISOTOPOS] : []),
  ...(rengExtra.masas ? [RENG_PROCEDENCIA_MASAS] : [])
]

export interface RengEspecAt<T> {
  id: string
  titulo: string
  objetivo: string
  unidad: string
  tolerancia?: RengToleranciaN1
  seccion: RengSeccionAtClave
  para: string
  particulas?: boolean
  isotopos?: boolean
  masas?: boolean
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

export function rengPracticaAt<T>(rengE: RengEspecAt<T>): RengPracticaN1 {
  const rengSub = rengE.id.replace(/-p[0-9]+$/, '')
  const rengNivel = RENG_DIFICULTAD[Number(/-p([0-9]+)$/.exec(rengE.id)![1]) as 1 | 2 | 3]
  const E = (rengD: Readonly<Record<string, number>>): T => rengE.lista[rengD.i!]!
  return rengFabricarPracticaN1({
    id: rengE.id, subtema: rengSub, titulo: rengE.titulo, dificultad: rengNivel, objetivo: rengE.objetivo, unidad: rengE.unidad, tolerancia: rengE.tolerancia ?? RENG_TOL_AT,
    fuentes: rengFuentesAt(rengE.seccion, rengE.para, { particulas: rengE.particulas, isotopos: rengE.isotopos, masas: rengE.masas }), idealizado: rengE.idealizado, metodo: rengE.metodo, sinVerificar: rengE.sinVerificar ?? [RENG_DIDACTICO_AT],
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

const RENG_SUP: Readonly<Record<string, string>> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
export const rengSupAt = (rengN: number): string => String(rengN).split('').map((rengC) => RENG_SUP[rengC] ?? rengC).join('')
export const rengZAt = (rengS: string): number => rengPorSimbolo.get(rengS)!.z
export const rengNombreAt = (rengS: string): string => rengPorSimbolo.get(rengS)!.nombre.toLowerCase()
export const rengSimboloDeZAt = (rengZ: number): string => RENG_ELEMENTOS[rengZ - 1]!.simbolo
export const rengNuclidoAt = (rengS: string, rengA: number): string => `${rengSupAt(rengA)}${rengS}`
export const rengCargaAt = (rengQ: number): string => (rengQ === 0 ? '' : `${Math.abs(rengQ) > 1 ? rengSupAt(Math.abs(rengQ)) : ''}${rengQ > 0 ? '⁺' : '⁻'}`)
export const rengIonAt = (rengS: string, rengQ: number): string => `${rengS}${rengCargaAt(rengQ)}`

export type RengNuclidoAt = readonly [simbolo: string, a: number]
export const RENG_NUCLIDOS_AT: readonly RengNuclidoAt[] = [
  ['C', 12], ['C', 13], ['C', 14], ['N', 14], ['N', 15], ['O', 16], ['O', 18], ['F', 19], ['Na', 23], ['Mg', 24], ['Mg', 26], ['Al', 27], ['Si', 28], ['P', 31], ['S', 32], ['Cl', 35], ['Cl', 37],
  ['Ar', 40], ['K', 39], ['K', 40], ['Ca', 40], ['Fe', 56], ['Co', 59], ['Ni', 58], ['Cu', 63], ['Zn', 64], ['Br', 79], ['Ag', 107], ['I', 127], ['Au', 197], ['U', 235], ['U', 238]
]

export type RengIonAt = readonly [simbolo: string, a: number, q: number]
export const RENG_IONES_AT: readonly RengIonAt[] = [
  ['Na', 23, 1], ['Mg', 24, 2], ['Al', 27, 3], ['K', 39, 1], ['Ca', 40, 2], ['F', 19, -1], ['Cl', 35, -1], ['O', 16, -2], ['S', 32, -2], ['N', 14, -3], ['Fe', 56, 2], ['Fe', 56, 3],
  ['Zn', 64, 2], ['Br', 79, -1], ['Li', 7, 1], ['Be', 9, 2], ['P', 31, -3], ['Cu', 63, 2], ['Ag', 107, 1], ['I', 127, -1], ['Ba', 138, 2], ['Sr', 88, 2], ['Se', 80, -2]
]
export const RENG_CATIONES_AT: readonly RengIonAt[] = [
  ['Mg', 24, 2], ['Al', 27, 3], ['Ca', 40, 2], ['Fe', 56, 2], ['Fe', 56, 3], ['Zn', 64, 2], ['Be', 9, 2], ['Cu', 63, 2], ['Ba', 138, 2], ['Sr', 88, 2], ['Ni', 58, 2], ['Co', 59, 2],
  ['Mn', 55, 2], ['Cr', 52, 3], ['Sc', 45, 3], ['Ti', 48, 4]
]

export interface RengParIsoAt {
  s: string
  a1: number
  m1: number
  a2: number
  m2: number
  x1: number
}
export const RENG_PARES_ISO_AT: readonly RengParIsoAt[] = [
  { s: 'Li', a1: 6, m1: 6.0151, a2: 7, m2: 7.016, x1: 0.0759 }, { s: 'B', a1: 10, m1: 10.0129, a2: 11, m2: 11.0093, x1: 0.199 },
  { s: 'N', a1: 14, m1: 14.0031, a2: 15, m2: 15.0001, x1: 0.99636 }, { s: 'Cl', a1: 35, m1: 34.9689, a2: 37, m2: 36.9659, x1: 0.7576 },
  { s: 'Cu', a1: 63, m1: 62.9296, a2: 65, m2: 64.9278, x1: 0.6915 }, { s: 'Ga', a1: 69, m1: 68.9256, a2: 71, m2: 70.9247, x1: 0.60108 },
  { s: 'Br', a1: 79, m1: 78.9183, a2: 81, m2: 80.9163, x1: 0.5069 }, { s: 'Rb', a1: 85, m1: 84.9118, a2: 87, m2: 86.9092, x1: 0.7217 },
  { s: 'Ag', a1: 107, m1: 106.9051, a2: 109, m2: 108.9048, x1: 0.51839 }, { s: 'Sb', a1: 121, m1: 120.9038, a2: 123, m2: 122.9042, x1: 0.5721 },
  { s: 'In', a1: 113, m1: 112.9041, a2: 115, m2: 114.9039, x1: 0.0429 }, { s: 'Eu', a1: 151, m1: 150.9199, a2: 153, m2: 152.9212, x1: 0.4781 },
  { s: 'Tl', a1: 203, m1: 202.9723, a2: 205, m2: 204.9744, x1: 0.2952 }, { s: 'Re', a1: 185, m1: 184.953, a2: 187, m2: 186.9558, x1: 0.374 }
]
export const rengMediaIsoAt = (rengP: RengParIsoAt): number => rengP.m1 * rengP.x1 + rengP.m2 * (1 - rengP.x1)

export type RengParNuclidosAt = readonly [s1: string, a1: number, s2: string, a2: number]
export const RENG_ISOBAROS_AT: readonly RengParNuclidosAt[] = [
  ['C', 14, 'N', 14], ['Ar', 40, 'K', 40], ['K', 40, 'Ca', 40], ['H', 3, 'He', 3], ['Co', 60, 'Ni', 60], ['Sr', 90, 'Y', 90], ['I', 131, 'Xe', 131], ['Cs', 137, 'Ba', 137],
  ['P', 32, 'S', 32], ['Na', 24, 'Mg', 24], ['Mo', 99, 'Tc', 99], ['Cu', 64, 'Zn', 64], ['F', 18, 'O', 18], ['C', 11, 'B', 11], ['Rb', 87, 'Sr', 87], ['Na', 22, 'Ne', 22]
]
export const RENG_BETA_AT: readonly RengNuclidoAt[] = [
  ['C', 14], ['H', 3], ['P', 32], ['Co', 60], ['Sr', 90], ['I', 131], ['Cs', 137], ['K', 40], ['Na', 24], ['Mo', 99], ['Pb', 210], ['Rb', 87], ['Fe', 59], ['S', 35], ['Ca', 45], ['Au', 198], ['Be', 10], ['Mg', 27], ['Al', 28], ['Si', 31], ['P', 33], ['Cl', 36], ['Ar', 39], ['K', 42]
]

export const RENG_ELEMENTOS_AUFBAU_AT: readonly number[] = [5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 37, 38]
export const RENG_REPRESENTATIVOS_AT: readonly number[] = [3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 31, 32, 33, 34, 35, 37, 38]

const RENG_LETRA_L = ['s', 'p', 'd', 'f']
export const RENG_ORDEN_AT: readonly string[] = (() => {
  const rengT: Array<[number, number]> = []
  for (let rengN = 1; rengN <= 7; rengN++) for (let rengL = 0; rengL < Math.min(rengN, 4); rengL++) rengT.push([rengN, rengL])
  rengT.sort((rengA, rengB) => rengA[0] + rengA[1] - (rengB[0] + rengB[1]) || rengA[0] - rengB[0])
  return rengT.map(([rengN, rengL]) => `${rengN}${RENG_LETRA_L[rengL]}`)
})()
export const rengCapacidadAt = (rengSub: string): number => 2 * (2 * RENG_LETRA_L.indexOf(rengSub[1]!) + 1)

export function rengLlenarAt(rengElectrones: number): ReadonlyArray<readonly [string, number]> {
  const rengR: Array<readonly [string, number]> = []
  let rengQuedan = rengElectrones
  for (const rengSub of RENG_ORDEN_AT) {
    if (rengQuedan <= 0) break
    const rengK = Math.min(rengQuedan, rengCapacidadAt(rengSub))
    rengR.push([rengSub, rengK])
    rengQuedan -= rengK
  }
  return rengR
}
export const rengEnSubAt = (rengZ: number, rengSub: string): number => rengLlenarAt(rengZ).find(([rengS]) => rengS === rengSub)?.[1] ?? 0
export const rengEnCapaAt = (rengZ: number, rengN: number): number => rengLlenarAt(rengZ).filter(([rengS]) => Number(rengS[0]) === rengN).reduce((rengA, [, rengK]) => rengA + rengK, 0)
export const rengCapaMaxAt = (rengZ: number): number => Math.max(...rengLlenarAt(rengZ).map(([rengS]) => Number(rengS[0])))
export const rengValenciaAt = (rengZ: number): number => rengLlenarAt(rengZ).filter(([rengS]) => Number(rengS[0]) === rengCapaMaxAt(rengZ) && (rengS[1] === 's' || rengS[1] === 'p')).reduce((rengA, [, rengK]) => rengA + rengK, 0)
export const rengDesapSubAt = (rengE: number, rengC: number): number => Math.min(rengE, rengC - rengE)
export const rengDesapareadosAt = (rengZ: number): number => rengLlenarAt(rengZ).reduce((rengA, [rengS, rengK]) => rengA + rengDesapSubAt(rengK, rengCapacidadAt(rengS)), 0)
export const rengOrbitalesOcupadosAt = (rengZ: number): number => rengLlenarAt(rengZ).reduce((rengA, [rengS, rengK]) => rengA + Math.min(rengK, rengCapacidadAt(rengS) / 2), 0)
export const rengOrbitalesLlenosAt = (rengZ: number): number => rengLlenarAt(rengZ).reduce((rengA, [rengS, rengK]) => rengA + Math.max(0, rengK - rengCapacidadAt(rengS) / 2), 0)
export const rengUltimoSubAt = (rengZ: number): string => rengLlenarAt(rengZ).at(-1)![0]
export const rengConfigAt = (rengZ: number): string => rengLlenarAt(rengZ).map(([rengS, rengK]) => `${rengS}${rengSupAt(rengK)}`).join(' ')
export const RENG_GASES_NOBLES_AT: readonly number[] = [2, 10, 18, 36, 54, 86]
export const rengGasAnteriorAt = (rengZ: number): number => [0, ...RENG_GASES_NOBLES_AT].filter((rengG) => rengG < rengZ).at(-1)!
