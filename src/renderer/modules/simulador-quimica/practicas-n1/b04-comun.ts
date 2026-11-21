import {
  RENG_PROCEDENCIA_EN_NUCLEO, RENG_PROCEDENCIA_ENLACE_NUCLEO, RENG_PROCEDENCIA_LEWIS, RENG_PROCEDENCIA_TABLAS_ENLACE, RENG_S101E, RENG_S105E, RENG_S71E, RENG_S72E, RENG_S73E, RENG_S74E, RENG_S75E, RENG_S76E, RENG_S81E, RENG_S82E, RENG_S83E,
  RENG_S84E, rengSeccionEn
} from '../aprender/n1/enlace/comun'
import { RENG_PROCEDENCIA_MASAS } from '../aprender/n1/procedencia'
import type { RengProcedenciaN1, RengToleranciaN1 } from '../aprender/n1/tipos'
import { RENG_KJMOL_POR_EV, RENG_COULOMB_KJ_A } from '../nucleo/datosEnlace'
import { rengElectronegatividad } from '../nucleo/electronegatividad'
import { rengPorSimbolo } from '../../tabla-periodica/data'
import { rengEntreN1, rengIndice } from './aleatorio'
import type { RengErrorNo } from './b05-comun'
import { rengAtomosNo } from './b05-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

export const RENG_TOL_EN: RengToleranciaN1 = { rel: 0.005, abs: 1e-6 }
export const RENG_TOL_EN_ENT: RengToleranciaN1 = { rel: 0.001, abs: 0.02 }
export const RENG_K_EN = RENG_COULOMB_KJ_A
export const RENG_EV_EN = RENG_KJMOL_POR_EV
export const RENG_D_E_PM_EN = 0.048032
export const RENG_NA_EN = 6.02214076e23

const RENG_SECCIONES_EN = { '7.1': RENG_S71E, '7.2': RENG_S72E, '7.3': RENG_S73E, '7.4': RENG_S74E, '7.5': RENG_S75E, '7.6': RENG_S76E, '8.1': RENG_S81E, '8.2': RENG_S82E, '8.3': RENG_S83E, '8.4': RENG_S84E, '10.1': RENG_S101E, '10.5': RENG_S105E }
export type RengSeccionEnClave = keyof typeof RENG_SECCIONES_EN
export interface RengExtraEn { lewis?: boolean; nucleo?: boolean; en?: boolean; tablas?: boolean; masas?: boolean }
export const rengFuentesEn = (rengSeccion: RengSeccionEnClave, rengPara: string, rengExtra: RengExtraEn = {}): readonly RengProcedenciaN1[] => [
  rengSeccionEn(RENG_SECCIONES_EN[rengSeccion], rengPara),
  ...(rengExtra.lewis ? [RENG_PROCEDENCIA_LEWIS] : []),
  ...(rengExtra.nucleo ? [RENG_PROCEDENCIA_ENLACE_NUCLEO] : []),
  ...(rengExtra.en ? [RENG_PROCEDENCIA_EN_NUCLEO] : []),
  ...(rengExtra.tablas ? [RENG_PROCEDENCIA_TABLAS_ENLACE] : []),
  ...(rengExtra.masas ? [RENG_PROCEDENCIA_MASAS] : [])
]

export interface RengEspecEn<T> extends RengExtraEn {
  id: string
  titulo: string
  objetivo: string
  unidad: string
  tolerancia?: RengToleranciaN1
  seccion: RengSeccionEnClave
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

export function rengPracticaEn<T>(rengE: RengEspecEn<T>): RengPracticaN1 {
  const rengSub = rengE.id.replace(/-p[0-9]+$/, '')
  const rengNivel = RENG_DIFICULTAD[Number(/-p([0-9]+)$/.exec(rengE.id)![1]) as 1 | 2 | 3]
  const E = (rengD: Readonly<Record<string, number>>): T => rengE.lista[rengD.i!]!
  return rengFabricarPracticaN1({
    id: rengE.id, subtema: rengSub, titulo: rengE.titulo, dificultad: rengNivel, objetivo: rengE.objetivo, unidad: rengE.unidad, tolerancia: rengE.tolerancia ?? RENG_TOL_EN,
    fuentes: rengFuentesEn(rengE.seccion, rengE.para, rengE), idealizado: rengE.idealizado, metodo: rengE.metodo, sinVerificar: rengE.sinVerificar ?? [],
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

export const rengZEn = (rengS: string): number => rengPorSimbolo.get(rengS)!.z
export const rengAEn = (rengS: string): number => rengPorSimbolo.get(rengS)!.masa
export const rengNombreEn = (rengS: string): string => rengPorSimbolo.get(rengS)!.nombre.toLowerCase()
export const rengChiEn = (rengS: string): number => rengElectronegatividad(rengS)!
export const rengValEn = (rengS: string): number => { const g = rengPorSimbolo.get(rengS)!.grupo!; return g <= 2 ? g : g - 10 }
export const rengAtomosTotalesEn = (rengF: string): number => [...rengAtomosNo(rengF).values()].reduce((rengA, rengN) => rengA + rengN, 0)
export const rengValenciaTotalEn = (rengF: string, rengQ = 0): number => [...rengAtomosNo(rengF).entries()].reduce((rengA, [rengS, rengN]) => rengA + rengValEn(rengS) * rengN, 0) - rengQ
export const rengElectronesEn = (rengF: string): number => [...rengAtomosNo(rengF).entries()].reduce((rengA, [rengS, rengN]) => rengA + rengZEn(rengS) * rengN, 0)
export const rengParesOctetoEn = (rengF: string, rengQ = 0): number => { const a = rengAtomosNo(rengF); const h = a.get('H') ?? 0; return (8 * (rengAtomosTotalesEn(rengF) - h) + 2 * h - rengValenciaTotalEn(rengF, rengQ)) / 2 }
export const rengInsaturacionEn = (rengF: string): number => { const a = rengAtomosNo(rengF); const x = ['F', 'Cl', 'Br', 'I'].reduce((rengS, rengH) => rengS + (a.get(rengH) ?? 0), 0); return (2 * (a.get('C') ?? 0) + 2 + (a.get('N') ?? 0) - (a.get('H') ?? 0) - x) / 2 }

export type RengEspecieLewis = readonly [formula: string, carga: number, enlaces: number]
export const RENG_ESPECIES_LEWIS_EN: readonly RengEspecieLewis[] = [
  ['H2O', 0, 2], ['CO2', 0, 4], ['NH3', 0, 3], ['N2', 0, 3], ['O2', 0, 2], ['HCN', 0, 4], ['OH', -1, 1], ['H3O', 1, 3], ['CO3', -2, 4], ['NO3', -1, 4], ['SO4', -2, 4], ['CN', -1, 3], ['O3', 0, 3], ['SO2', 0, 3], ['CH2O', 0, 4],
  ['H2O2', 0, 3], ['CCl4', 0, 4], ['PCl3', 0, 3], ['HCl', 0, 1], ['Cl2', 0, 1], ['CO', 0, 3], ['NO2', -1, 3], ['H2S', 0, 2], ['NF3', 0, 3], ['OF2', 0, 2], ['CS2', 0, 4], ['SO3', 0, 4], ['PO4', -3, 4], ['C2H4', 0, 6], ['C2H2', 0, 5], ['HNO3', 0, 5], ['CH2O2', 0, 5], ['COCl2', 0, 4], ['HNO2', 0, 4]
]

export type RengAtomoLewis = readonly [texto: string, v: number, l: number, b: number]
export const RENG_ATOMOS_CF_EN: readonly RengAtomoLewis[] = [
  ['el nitrógeno del ion amonio, NH₄⁺', 5, 0, 4], ['el oxígeno del ion hidronio, H₃O⁺', 6, 2, 3], ['el oxígeno del ion hidróxido, OH⁻', 6, 6, 1], ['el carbono del monóxido de carbono, CO', 4, 2, 3], ['el oxígeno del monóxido de carbono, CO', 6, 2, 3],
  ['el nitrógeno del ion nitrato, NO₃⁻', 5, 0, 4], ['un oxígeno con enlace sencillo del ion nitrato, NO₃⁻', 6, 6, 1], ['el azufre del ion sulfato, SO₄²⁻, con cuatro enlaces sencillos', 6, 0, 4], ['el boro del ion tetrafluoroborato, BF₄⁻', 3, 0, 4],
  ['el oxígeno del ion hipoclorito, ClO⁻', 6, 6, 1], ['el carbono del ion cianuro, CN⁻', 4, 2, 3], ['el oxígeno central del ozono, O₃', 6, 2, 3], ['el oxígeno con enlace sencillo del ozono, O₃', 6, 6, 1], ['el carbono del catión metilo, CH₃⁺', 4, 0, 3],
  ['el carbono del anión metilo, CH₃⁻', 4, 2, 3], ['el aluminio del ion tetracloroaluminato, AlCl₄⁻', 3, 0, 4], ['el nitrógeno del ion amiduro, NH₂⁻', 5, 4, 2], ['el nitrógeno central del óxido de dinitrógeno, N≡N–O', 5, 0, 4],
  ['el oxígeno del óxido de dinitrógeno, N≡N–O', 6, 6, 1], ['el cloro del ion perclorato, ClO₄⁻, con cuatro enlaces sencillos', 7, 0, 4], ['el fósforo del ion fosfato, PO₄³⁻, con cuatro enlaces sencillos', 5, 0, 4],
  ['el nitrógeno del ion nitronio, NO₂⁺', 5, 0, 4], ['el azufre del trióxido de azufre, SO₃, con un enlace doble y dos sencillos', 6, 0, 4], ['un oxígeno con enlace sencillo del ion carbonato, CO₃²⁻', 6, 6, 1],
  ['el boro del ion borohidruro, BH₄⁻', 3, 0, 4], ['el nitrógeno del ion tetrametilamonio, N(CH₃)₄⁺', 5, 0, 4], ['el oxígeno del ion metóxido, CH₃O⁻', 6, 6, 1], ['el azufre del dióxido de azufre, SO₂, con un enlace doble y uno sencillo', 6, 2, 3]
]
export const RENG_ATOMOS_OCTETO_EN: readonly RengAtomoLewis[] = [
  ...RENG_ATOMOS_CF_EN, ['el oxígeno del agua, H₂O', 6, 4, 2], ['el nitrógeno del amoníaco, NH₃', 5, 2, 3], ['el carbono del dióxido de carbono, CO₂', 4, 0, 4], ['el cloro del cloruro de hidrógeno, HCl', 7, 6, 1],
  ['el azufre del sulfuro de hidrógeno, H₂S', 6, 4, 2], ['el fósforo del tricloruro de fósforo, PCl₃', 5, 2, 3], ['el oxígeno con enlace doble del dióxido de carbono, CO₂', 6, 4, 2], ['un nitrógeno de la molécula N₂', 5, 2, 3]
]

export type RengVsepr = readonly [formula: string, x: number, e: number]
export const RENG_VSEPR_EN: readonly RengVsepr[] = [
  ['CO2', 2, 0], ['BeCl2', 2, 0], ['BF3', 3, 0], ['SO3', 3, 0], ['SO2', 2, 1], ['O3', 2, 1], ['CH4', 4, 0], ['CCl4', 4, 0], ['NH3', 3, 1], ['PCl3', 3, 1], ['H2O', 2, 2], ['H2S', 2, 2], ['OF2', 2, 2], ['PCl5', 5, 0], ['SF4', 4, 1],
  ['ClF3', 3, 2], ['XeF2', 2, 3], ['SF6', 6, 0], ['BrF5', 5, 1], ['XeF4', 4, 2], ['HCN', 2, 0], ['CH2O', 3, 0], ['SiCl4', 4, 0], ['NF3', 3, 1], ['PH3', 3, 1], ['SCl2', 2, 2], ['SnCl2', 2, 1], ['AsCl3', 3, 1], ['CS2', 2, 0], ['SiH4', 4, 0]
]
export const RENG_VSEPR_CON_PARES_EN: readonly RengVsepr[] = [
  ['SO2', 2, 1], ['O3', 2, 1], ['SnCl2', 2, 1], ['NH3', 3, 1], ['PCl3', 3, 1], ['NF3', 3, 1], ['PH3', 3, 1], ['AsCl3', 3, 1], ['H2O', 2, 2], ['H2S', 2, 2], ['OF2', 2, 2], ['SCl2', 2, 2], ['H2Se', 2, 2], ['NCl3', 3, 1], ['PF3', 3, 1], ['Cl2O', 2, 2],
  ['H2Te', 2, 2], ['SbCl3', 3, 1], ['GeCl2', 2, 1], ['PbCl2', 2, 1]
]
export type RengCentralEn = readonly [formula: string, central: string, x: number, q: number]
export const RENG_CENTRALES_EN: readonly RengCentralEn[] = [
  ['H2O', 'O', 2, 0], ['NH3', 'N', 3, 0], ['H2S', 'S', 2, 0], ['PCl3', 'P', 3, 0], ['SF4', 'S', 4, 0], ['ClF3', 'Cl', 3, 0], ['XeF2', 'Xe', 2, 0], ['XeF4', 'Xe', 4, 0], ['BrF5', 'Br', 5, 0], ['H3O', 'O', 3, 1], ['NH2', 'N', 2, -1], ['OF2', 'O', 2, 0],
  ['SCl2', 'S', 2, 0], ['NF3', 'N', 3, 0], ['PH3', 'P', 3, 0], ['BrF3', 'Br', 3, 0], ['IF5', 'I', 5, 0], ['ClF5', 'Cl', 5, 0], ['SeF4', 'Se', 4, 0], ['TeCl4', 'Te', 4, 0], ['AsCl3', 'As', 3, 0], ['ICl4', 'I', 4, -1], ['ICl2', 'I', 2, -1], ['XeF6', 'Xe', 6, 0], ['H2Se', 'Se', 2, 0], ['NCl3', 'N', 3, 0], ['PF3', 'P', 3, 0], ['Cl2O', 'O', 2, 0], ['SbCl3', 'Sb', 3, 0], ['H2Te', 'Te', 2, 0]
]
export const RENG_CENTRALES_HASTA_4_EN: readonly RengCentralEn[] = RENG_CENTRALES_EN.filter((rengC) => rengC[2] + (rengValEn(rengC[1]) - rengC[2] - rengC[3]) / 2 <= 4)
export const rengParesCentralEn = ([, rengC, rengX, rengQ]: RengCentralEn): number => (rengValEn(rengC) - rengX - rengQ) / 2

export type RengMoleculaSp = readonly [nombre: string, formula: string, anillos: number, sigma: number, pi: number]
export const RENG_SIGMA_PI_EN: readonly RengMoleculaSp[] = [
  ['eteno', 'C2H4', 0, 5, 1], ['etino', 'C2H2', 0, 3, 2], ['dióxido de carbono', 'CO2', 0, 2, 2], ['nitrógeno', 'N2', 0, 1, 2], ['cianuro de hidrógeno', 'HCN', 0, 2, 2], ['metanal', 'CH2O', 0, 3, 1], ['propeno', 'C3H6', 0, 8, 1], ['benceno', 'C6H6', 1, 12, 3],
  ['ácido acético', 'C2H4O2', 0, 7, 1], ['oxígeno', 'O2', 0, 1, 1], ['propino', 'C3H4', 0, 6, 2], ['cloroeteno', 'C2H3Cl', 0, 5, 1], ['acetonitrilo', 'C2H3N', 0, 5, 2], ['ácido fórmico', 'CH2O2', 0, 4, 1], ['1,3-butadieno', 'C4H6', 0, 9, 2],
  ['fosgeno', 'COCl2', 0, 3, 1], ['acetona', 'C3H6O', 0, 9, 1], ['urea', 'CH4N2O', 0, 7, 1], ['etanal', 'C2H4O', 0, 6, 1], ['tolueno', 'C7H8', 1, 15, 3], ['ciclohexeno', 'C6H10', 1, 16, 1], ['acrilonitrilo', 'C3H3N', 0, 6, 3]
]
export type RengAnilloEn = readonly [nombre: string, formula: string, anillos: number]
export const RENG_ANILLOS_EN: readonly RengAnilloEn[] = [
  ['benceno', 'C6H6', 1], ['naftaleno', 'C10H8', 2], ['tolueno', 'C7H8', 1], ['estireno', 'C8H8', 1], ['ciclopentadieno', 'C5H6', 1], ['fenol', 'C6H6O', 1], ['piridina', 'C5H5N', 1], ['furano', 'C4H4O', 1], ['anilina', 'C6H7N', 1],
  ['ácido benzoico', 'C7H6O2', 1], ['fenilacetileno', 'C8H6', 1], ['benzaldehído', 'C7H6O', 1], ['1,3-ciclohexadieno', 'C6H8', 1], ['antraceno', 'C14H10', 3], ['bifenilo', 'C12H10', 2], ['ciclohexeno', 'C6H10', 1], ['ciclobuteno', 'C4H6', 1], ['ciclohexanona', 'C6H10O', 1]
]
export const RENG_FORMULAS_INSATURACION_EN: readonly string[] = ['C2H4', 'C2H2', 'C6H6', 'C3H6', 'C4H6', 'C3H4', 'C6H12', 'C5H8', 'C7H8', 'C8H8', 'C2H3Cl', 'C3H3N', 'C2H3N', 'C2H4O', 'C3H6O', 'C6H6O', 'C4H4O', 'C5H5N', 'CH2O', 'C10H8']

export type RengOm = readonly [texto: string, nb: number, na: number]
export const RENG_OM_EN: readonly RengOm[] = [
  ['H₂', 2, 0], ['H₂⁺', 1, 0], ['He₂⁺', 2, 1], ['Li₂', 2, 0], ['B₂', 4, 2], ['C₂', 6, 2], ['N₂', 8, 2], ['N₂⁺', 7, 2], ['O₂', 8, 4], ['O₂⁺', 8, 3], ['O₂⁻', 8, 5], ['O₂²⁻', 8, 6], ['F₂', 8, 6], ['NO', 8, 3], ['CO', 8, 2], ['CN⁻', 8, 2], ['NO⁺', 8, 2], ['C₂²⁻', 8, 2], ['F₂⁺', 8, 5], ['B₂⁺', 3, 2]
]
export type RengParOm = readonly [neutra: string, nb0: number, na0: number, ion: string, nb1: number, na1: number]
export const RENG_PARES_OM_EN: readonly RengParOm[] = [
  ['N₂', 8, 2, 'N₂⁺', 7, 2], ['N₂', 8, 2, 'N₂⁻', 8, 3], ['O₂', 8, 4, 'O₂⁺', 8, 3], ['O₂', 8, 4, 'O₂⁻', 8, 5], ['O₂', 8, 4, 'O₂²⁻', 8, 6], ['F₂', 8, 6, 'F₂⁺', 8, 5], ['C₂', 6, 2, 'C₂⁻', 7, 2], ['C₂', 6, 2, 'C₂⁺', 5, 2], ['B₂', 4, 2, 'B₂⁺', 3, 2],
  ['H₂', 2, 0, 'H₂⁺', 1, 0], ['H₂', 2, 0, 'H₂⁻', 2, 1], ['NO', 8, 3, 'NO⁺', 8, 2], ['NO', 8, 3, 'NO⁻', 8, 4], ['CO', 8, 2, 'CO⁺', 7, 2], ['He₂', 2, 2, 'He₂⁺', 2, 1], ['Li₂', 2, 0, 'Li₂⁺', 1, 0], ['CN', 7, 2, 'CN⁻', 8, 2], ['Ne₂', 8, 8, 'Ne₂⁺', 8, 7]
]

export const RENG_ENLACES_EN: ReadonlyArray<readonly [string, string]> = [
  ['H', 'Cl'], ['H', 'F'], ['H', 'O'], ['C', 'H'], ['C', 'O'], ['C', 'Cl'], ['N', 'H'], ['Na', 'Cl'], ['K', 'Br'], ['Mg', 'O'], ['Li', 'F'], ['C', 'N'], ['S', 'O'], ['P', 'Cl'], ['Si', 'O'], ['H', 'Br'], ['H', 'I'], ['C', 'F'], ['Ca', 'O'], ['Al', 'Cl'],
  ['K', 'F'], ['Na', 'F'], ['N', 'O'], ['B', 'F'], ['Be', 'Cl'], ['Cs', 'F'], ['Si', 'H'], ['S', 'H']
]
export const rengDeltaChiEn = ([rengA, rengB]: readonly [string, string]): number => Math.abs(rengChiEn(rengA) - rengChiEn(rengB))

export const RENG_ENERGIA_MEDIA_EN: Readonly<Record<string, number>> = {
  'C–H': 413, 'O=O': 498, 'C=O': 799, 'O–H': 463, 'H–H': 436, 'Cl–Cl': 242, 'H–Cl': 431, 'N≡N': 945, 'N–H': 391, 'C–C': 347, 'C=C': 614, 'C≡C': 839, 'C–Cl': 339, 'Br–Br': 193, 'H–Br': 366, 'F–F': 155, 'H–F': 567, 'C–O': 358, 'I–I': 151, 'H–I': 299, 'C≡O': 1072
}
export type RengBalanceEn = ReadonlyArray<readonly [string, number]>
export type RengReaccionEn = readonly [texto: string, rotos: RengBalanceEn, formados: RengBalanceEn]
export const RENG_REACCIONES_EN: readonly RengReaccionEn[] = [
  ['H₂ + Cl₂ → 2 HCl', [['H–H', 1], ['Cl–Cl', 1]], [['H–Cl', 2]]],
  ['H₂ + F₂ → 2 HF', [['H–H', 1], ['F–F', 1]], [['H–F', 2]]],
  ['H₂ + Br₂ → 2 HBr', [['H–H', 1], ['Br–Br', 1]], [['H–Br', 2]]],
  ['2 H₂ + O₂ → 2 H₂O', [['H–H', 2], ['O=O', 1]], [['O–H', 4]]],
  ['N₂ + 3 H₂ → 2 NH₃', [['N≡N', 1], ['H–H', 3]], [['N–H', 6]]],
  ['CH₄ + 2 O₂ → CO₂ + 2 H₂O', [['C–H', 4], ['O=O', 2]], [['C=O', 2], ['O–H', 4]]],
  ['C₂H₄ + H₂ → C₂H₆', [['C=C', 1], ['H–H', 1]], [['C–C', 1], ['C–H', 2]]],
  ['CH₄ + Cl₂ → CH₃Cl + HCl', [['C–H', 1], ['Cl–Cl', 1]], [['C–Cl', 1], ['H–Cl', 1]]],
  ['H₂ + I₂ → 2 HI', [['H–H', 1], ['I–I', 1]], [['H–I', 2]]],
  ['C₂H₄ + Cl₂ → C₂H₄Cl₂', [['C=C', 1], ['Cl–Cl', 1]], [['C–C', 1], ['C–Cl', 2]]],
  ['C₂H₄ + HCl → C₂H₅Cl', [['C=C', 1], ['H–Cl', 1]], [['C–C', 1], ['C–H', 1], ['C–Cl', 1]]],
  ['2 CO + O₂ → 2 CO₂', [['C≡O', 2], ['O=O', 1]], [['C=O', 4]]],
  ['C₂H₂ + 2 H₂ → C₂H₆', [['C≡C', 1], ['H–H', 2]], [['C–C', 1], ['C–H', 4]]],
  ['C₂H₄ + H₂O → C₂H₅OH', [['C=C', 1], ['O–H', 1]], [['C–C', 1], ['C–H', 1], ['C–O', 1]]],
  ['2 C₂H₆ + 7 O₂ → 4 CO₂ + 6 H₂O', [['C–C', 2], ['C–H', 12], ['O=O', 7]], [['C=O', 8], ['O–H', 12]]],
  ['C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O', [['C–C', 2], ['C–H', 8], ['O=O', 5]], [['C=O', 6], ['O–H', 8]]],
  ['C₂H₄ + 3 O₂ → 2 CO₂ + 2 H₂O', [['C=C', 1], ['C–H', 4], ['O=O', 3]], [['C=O', 4], ['O–H', 4]]],
  ['CO + 2 H₂ → CH₃OH', [['C≡O', 1], ['H–H', 2]], [['C–H', 3], ['C–O', 1], ['O–H', 1]]],
  ['C₂H₂ + H₂ → C₂H₄', [['C≡C', 1], ['H–H', 1]], [['C=C', 1], ['C–H', 2]]],
  ['CH₄ + 2 Cl₂ → CH₂Cl₂ + 2 HCl', [['C–H', 2], ['Cl–Cl', 2]], [['C–Cl', 2], ['H–Cl', 2]]]
]
export const rengSumaEnlacesEn = (rengB: RengBalanceEn, rengCoef = true): number => rengB.reduce((rengA, [rengE, rengN]) => rengA + RENG_ENERGIA_MEDIA_EN[rengE]! * (rengCoef ? rengN : 1), 0)
export const rengTextoBalanceEn = (rengB: RengBalanceEn): string => rengB.map(([rengE, rengN]) => `${String(rengN).replace('.', ',')} ${rengE}`).join(', ')
export type RengCombustibleEn = readonly [nombre: string, formula: string, rotos: RengBalanceEn, formados: RengBalanceEn]
export const RENG_COMBUSTIBLES_EN: readonly RengCombustibleEn[] = [
  ['hidrógeno', 'H2', [['H–H', 1], ['O=O', 0.5]], [['O–H', 2]]],
  ['metano', 'CH4', [['C–H', 4], ['O=O', 2]], [['C=O', 2], ['O–H', 4]]],
  ['eteno', 'C2H4', [['C=C', 1], ['C–H', 4], ['O=O', 3]], [['C=O', 4], ['O–H', 4]]],
  ['etino', 'C2H2', [['C≡C', 1], ['C–H', 2], ['O=O', 2.5]], [['C=O', 4], ['O–H', 2]]],
  ['etano', 'C2H6', [['C–C', 1], ['C–H', 6], ['O=O', 3.5]], [['C=O', 4], ['O–H', 6]]],
  ['propano', 'C3H8', [['C–C', 2], ['C–H', 8], ['O=O', 5]], [['C=O', 6], ['O–H', 8]]],
  ['metanol', 'CH4O', [['C–H', 3], ['C–O', 1], ['O–H', 1], ['O=O', 1.5]], [['C=O', 2], ['O–H', 4]]],
  ['etanol', 'C2H6O', [['C–C', 1], ['C–H', 5], ['C–O', 1], ['O–H', 1], ['O=O', 3]], [['C=O', 4], ['O–H', 6]]],
  ['monóxido de carbono', 'CO', [['C≡O', 1], ['O=O', 0.5]], [['C=O', 2]]]
]

export type RengMetalEn = readonly [simbolo: string, atomos: number, red: string, valencia: number]
export const RENG_METALES_RED_EN: readonly RengMetalEn[] = [['Na', 2, 'cúbica centrada en el cuerpo', 1], ['Fe', 2, 'cúbica centrada en el cuerpo', 2], ['Cu', 4, 'cúbica centrada en las caras', 1], ['Au', 4, 'cúbica centrada en las caras', 1], ['Ag', 4, 'cúbica centrada en las caras', 1], ['Al', 4, 'cúbica centrada en las caras', 3]]
