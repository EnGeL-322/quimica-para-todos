import { RENG_PROCEDENCIA_OR_ESTRUCTURAS, RENG_PROCEDENCIA_OR_NOMBRES, RENG_PROCEDENCIA_OR_TABLAS, RENG_S201, RENG_S202, RENG_S203, RENG_S204, rengSeccionOr } from '../aprender/n1/organica/comun'
import { RENG_PROCEDENCIA_MASAS } from '../aprender/n1/procedencia'
import type { RengProcedenciaN1, RengToleranciaN1 } from '../aprender/n1/tipos'
import { rengEntreN1, rengIndice } from './aleatorio'
import type { RengErrorNo } from './b05-comun'
import { rengAnNo, rengAtomosNo, rengMNo, rengTotalNo } from './b05-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

export const RENG_TOL_OR: RengToleranciaN1 = { rel: 0.005, abs: 1e-6 }
export const RENG_TOL_OR_ENT: RengToleranciaN1 = { rel: 0.001, abs: 0.02 }

const RENG_SECCIONES_OR = { '20.1': RENG_S201, '20.2': RENG_S202, '20.3': RENG_S203, '20.4': RENG_S204 }
export type RengSeccionOrClave = keyof typeof RENG_SECCIONES_OR
export interface RengExtraOr { nombres?: boolean; estructuras?: boolean; tablas?: boolean; masas?: boolean }
export const rengFuentesOr = (rengSeccion: RengSeccionOrClave, rengPara: string, rengExtra: RengExtraOr = {}): readonly RengProcedenciaN1[] => [
  rengSeccionOr(RENG_SECCIONES_OR[rengSeccion], rengPara),
  ...(rengExtra.nombres ? [RENG_PROCEDENCIA_OR_NOMBRES] : []),
  ...(rengExtra.estructuras ? [RENG_PROCEDENCIA_OR_ESTRUCTURAS] : []),
  ...(rengExtra.tablas ? [RENG_PROCEDENCIA_OR_TABLAS] : []),
  ...(rengExtra.masas ? [RENG_PROCEDENCIA_MASAS] : [])
]

export interface RengEspecOr<T> extends RengExtraOr {
  id: string
  titulo: string
  objetivo: string
  unidad: string
  tolerancia?: RengToleranciaN1
  seccion: RengSeccionOrClave
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

export function rengPracticaOr<T>(rengE: RengEspecOr<T>): RengPracticaN1 {
  const rengSub = rengE.id.replace(/-p[0-9]+$/, '')
  const rengNivel = RENG_DIFICULTAD[Number(/-p([0-9]+)$/.exec(rengE.id)![1]) as 1 | 2 | 3]
  const E = (rengD: Readonly<Record<string, number>>): T => rengE.lista[rengD.i!]!
  return rengFabricarPracticaN1({
    id: rengE.id, subtema: rengSub, titulo: rengE.titulo, dificultad: rengNivel, objetivo: rengE.objetivo, unidad: rengE.unidad, tolerancia: rengE.tolerancia ?? RENG_TOL_OR,
    fuentes: rengFuentesOr(rengE.seccion, rengE.para, rengE), idealizado: rengE.idealizado, metodo: rengE.metodo, sinVerificar: rengE.sinVerificar ?? [],
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

export const RENG_HALOGENOS_OR: readonly string[] = ['F', 'Cl', 'Br', 'I']
export const rengDeOr = (rengF: string, rengEl: string): number => rengAtomosNo(rengF).get(rengEl) ?? 0
export const rengCOr = (rengF: string): number => rengDeOr(rengF, 'C')
export const rengHOr = (rengF: string): number => rengDeOr(rengF, 'H')
export const rengOOr = (rengF: string): number => rengDeOr(rengF, 'O')
export const rengNOr = (rengF: string): number => rengDeOr(rengF, 'N')
export const rengXOr = (rengF: string): number => RENG_HALOGENOS_OR.reduce((rengS, rengX) => rengS + rengDeOr(rengF, rengX), 0)
export const rengGiOr = (rengF: string): number => (2 * rengCOr(rengF) + 2 + rengNOr(rengF) - rengHOr(rengF) - rengXOr(rengF)) / 2
export const rengEnlacesOr = (rengF: string): number => (4 * rengCOr(rengF) + rengHOr(rengF) + 2 * rengOOr(rengF) + 3 * rengNOr(rengF) + rengXOr(rengF)) / 2
export const rengO2Or = (rengF: string): number => rengCOr(rengF) + rengHOr(rengF) / 4 - rengOOr(rengF) / 2
export const rengMCh2Or = (): number => rengAnNo('C') + 2 * rengAnNo('H')
export const rengMAguaOr = (): number => rengMNo('H2O')
export const rengMH2Or = (): number => rengMNo('H2')
export const rengMCo2Or = (): number => rengMNo('CO2')

export type RengCompuestoOr = readonly [nombre: string, formula: string, smiles: string]
export type RengCompuestoNOr = readonly [nombre: string, formula: string, smiles: string, n: number]

export const RENG_ALCANOS_LINEALES_OR: readonly RengCompuestoOr[] = [
  ['metano', 'CH4', 'C'], ['etano', 'C2H6', 'CC'], ['propano', 'C3H8', 'CCC'], ['butano', 'C4H10', 'CCCC'], ['pentano', 'C5H12', 'CCCCC'], ['hexano', 'C6H14', 'CCCCCC'], ['heptano', 'C7H16', 'CCCCCCC'], ['octano', 'C8H18', 'CCCCCCCC'],
  ['nonano', 'C9H20', 'CCCCCCCCC'], ['decano', 'C10H22', 'CCCCCCCCCC']
]
export const RENG_ALCANOS_RAMIFICADOS_OR: readonly RengCompuestoOr[] = [
  ['2-metilpropano', 'C4H10', 'CC(C)C'], ['2-metilbutano', 'C5H12', 'CC(C)CC'], ['2,2-dimetilpropano', 'C5H12', 'CC(C)(C)C'], ['2-metilpentano', 'C6H14', 'CC(C)CCC'], ['3-metilpentano', 'C6H14', 'CCC(C)CC'], ['2,2-dimetilbutano', 'C6H14', 'CC(C)(C)CC'],
  ['2,3-dimetilbutano', 'C6H14', 'CC(C)C(C)C'], ['3-etilpentano', 'C7H16', 'CCC(CC)CC'], ['2,2,4-trimetilpentano', 'C8H18', 'CC(C)(C)CC(C)C']
]
export const RENG_ALCANOS_OR: readonly RengCompuestoOr[] = [...RENG_ALCANOS_LINEALES_OR, ...RENG_ALCANOS_RAMIFICADOS_OR]
export const RENG_ALQUENOS_OR: readonly RengCompuestoNOr[] = [
  ['eteno', 'C2H4', 'C=C', 1], ['propeno', 'C3H6', 'C=CC', 1], ['but-1-eno', 'C4H8', 'C=CCC', 1], ['but-2-eno', 'C4H8', 'CC=CC', 1], ['2-metilpropeno', 'C4H8', 'C=C(C)C', 1], ['pent-1-eno', 'C5H10', 'C=CCCC', 1], ['2-metilbut-2-eno', 'C5H10', 'CC(C)=CC', 1],
  ['hex-1-eno', 'C6H12', 'C=CCCCC', 1], ['oct-1-eno', 'C8H16', 'C=CCCCCCC', 1], ['dec-1-eno', 'C10H20', 'C=CCCCCCCCC', 1], ['buta-1,3-dieno', 'C4H6', 'C=CC=C', 2], ['penta-1,3-dieno', 'C5H8', 'C=CC=CC', 2], ['penta-1,4-dieno', 'C5H8', 'C=CCC=C', 2],
  ['2-metilbuta-1,3-dieno', 'C5H8', 'C=C(C)C=C', 2], ['hexa-1,5-dieno', 'C6H10', 'C=CCCC=C', 2], ['hexa-1,3,5-trieno', 'C6H8', 'C=CC=CC=C', 3]
]
export const RENG_ALQUINOS_OR: readonly RengCompuestoNOr[] = [
  ['etino', 'C2H2', 'C#C', 1], ['propino', 'C3H4', 'C#CC', 1], ['but-1-ino', 'C4H6', 'C#CCC', 1], ['but-2-ino', 'C4H6', 'CC#CC', 1], ['pent-1-ino', 'C5H8', 'C#CCCC', 1], ['pent-2-ino', 'C5H8', 'CC#CCC', 1], ['hex-1-ino', 'C6H10', 'C#CCCCC', 1],
  ['hex-3-ino', 'C6H10', 'CCC#CCC', 1], ['hept-1-ino', 'C7H12', 'C#CCCCCC', 1], ['oct-1-ino', 'C8H14', 'C#CCCCCCC', 1], ['non-1-ino', 'C9H16', 'C#CCCCCCCC', 1], ['buta-1,3-diino', 'C4H2', 'C#CC#C', 2], ['hexa-1,5-diino', 'C6H6', 'C#CCCC#C', 2],
  ['hepta-1,6-diino', 'C7H8', 'C#CCCCC#C', 2]
]
export const RENG_AROMATICOS_OR: readonly RengCompuestoNOr[] = [
  ['benceno', 'C6H6', 'c1ccccc1', 1], ['metilbenceno', 'C7H8', 'Cc1ccccc1', 1], ['etilbenceno', 'C8H10', 'CCc1ccccc1', 1], ['1,2-dimetilbenceno', 'C8H10', 'Cc1ccccc1C', 1], ['1,3-dimetilbenceno', 'C8H10', 'Cc1cccc(C)c1', 1],
  ['1,4-dimetilbenceno', 'C8H10', 'Cc1ccc(C)cc1', 1], ['1,3,5-trimetilbenceno', 'C9H12', 'Cc1cc(C)cc(C)c1', 1], ['propilbenceno', 'C9H12', 'CCCc1ccccc1', 1], ['butilbenceno', 'C10H14', 'CCCCc1ccccc1', 1], ['naftaleno', 'C10H8', 'c1ccc2ccccc2c1', 2],
  ['bifenilo', 'C12H10', 'c1ccc(cc1)c1ccccc1', 2], ['antraceno', 'C14H10', 'c1ccc2cc3ccccc3cc2c1', 3], ['fenantreno', 'C14H10', 'c1ccc2c(c1)ccc1ccccc12', 3], ['pireno', 'C16H10', 'c1cc2ccc3cccc4ccc(c1)c2c34', 4]
]
export const RENG_HIDROCARBUROS_OR: readonly RengCompuestoOr[] = [
  ...RENG_ALCANOS_OR,
  ...RENG_ALQUENOS_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
  ...RENG_ALQUINOS_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
  ...RENG_AROMATICOS_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const)
]
export const RENG_INSATURADOS_OR: readonly RengCompuestoOr[] = RENG_HIDROCARBUROS_OR.filter(([, rengF]) => rengGiOr(rengF) > 0)

export const RENG_ALCOHOLES_OR: readonly RengCompuestoNOr[] = [
  ['metanol', 'CH4O', 'CO', 1], ['etanol', 'C2H6O', 'CCO', 1], ['propan-1-ol', 'C3H8O', 'CCCO', 1], ['propan-2-ol', 'C3H8O', 'CC(O)C', 1], ['butan-1-ol', 'C4H10O', 'CCCCO', 1], ['butan-2-ol', 'C4H10O', 'CC(O)CC', 1],
  ['2-metilpropan-2-ol', 'C4H10O', 'CC(O)(C)C', 1], ['pentan-1-ol', 'C5H12O', 'CCCCCO', 1], ['hexan-1-ol', 'C6H14O', 'CCCCCCO', 1], ['octan-1-ol', 'C8H18O', 'CCCCCCCCO', 1], ['etano-1,2-diol', 'C2H6O2', 'OCCO', 2],
  ['propano-1,2,3-triol', 'C3H8O3', 'OCC(O)CO', 3]
]
export const RENG_DESHIDRATABLES_OR: readonly RengCompuestoNOr[] = RENG_ALCOHOLES_OR.filter(([, rengF, , rengN]) => rengN === 1 && rengCOr(rengF) >= 2)
export const RENG_ETERES_OR: readonly RengCompuestoOr[] = [
  ['metoximetano', 'C2H6O', 'COC'], ['metoxietano', 'C3H8O', 'CCOC'], ['etoxietano', 'C4H10O', 'CCOCC'], ['1-metoxipropano', 'C4H10O', 'CCCOC'], ['1-etoxipropano', 'C5H12O', 'CCCOCC'], ['1-propoxipropano', 'C6H14O', 'CCCOCCC'],
  ['1-butoxibutano', 'C8H18O', 'CCCCOCCCC']
]
export const RENG_ETERES_SIMETRICOS_OR: ReadonlyArray<readonly [eter: string, formula: string, alcohol: string, formulaAlcohol: string]> = [
  ['metoximetano', 'C2H6O', 'metanol', 'CH4O'], ['etoxietano', 'C4H10O', 'etanol', 'C2H6O'], ['1-propoxipropano', 'C6H14O', 'propan-1-ol', 'C3H8O'], ['1-butoxibutano', 'C8H18O', 'butan-1-ol', 'C4H10O']
]
export const RENG_ALDEHIDOS_OR: readonly RengCompuestoOr[] = [
  ['metanal', 'CH2O', 'C=O'], ['etanal', 'C2H4O', 'CC=O'], ['propanal', 'C3H6O', 'CCC=O'], ['butanal', 'C4H8O', 'CCCC=O'], ['pentanal', 'C5H10O', 'CCCCC=O'], ['hexanal', 'C6H12O', 'CCCCCC=O'], ['heptanal', 'C7H14O', 'CCCCCCC=O']
]
export const RENG_CETONAS_OR: ReadonlyArray<readonly [nombre: string, formula: string, smiles: string, alcohol: string, formulaAlcohol: string, smilesAlcohol: string]> = [
  ['propanona', 'C3H6O', 'CC(=O)C', 'propan-2-ol', 'C3H8O', 'CC(O)C'], ['butanona', 'C4H8O', 'CC(=O)CC', 'butan-2-ol', 'C4H10O', 'CC(O)CC'], ['pentan-2-ona', 'C5H10O', 'CC(=O)CCC', 'pentan-2-ol', 'C5H12O', 'CC(O)CCC'],
  ['pentan-3-ona', 'C5H10O', 'CCC(=O)CC', 'pentan-3-ol', 'C5H12O', 'CCC(O)CC'], ['hexan-3-ona', 'C6H12O', 'CCC(=O)CCC', 'hexan-3-ol', 'C6H14O', 'CCC(O)CCC'], ['heptan-2-ona', 'C7H14O', 'CC(=O)CCCCC', 'heptan-2-ol', 'C7H16O', 'CC(O)CCCCC']
]
export const RENG_ACIDOS_OR: readonly RengCompuestoNOr[] = [
  ['ácido metanoico', 'CH2O2', 'OC=O', 1], ['ácido etanoico', 'C2H4O2', 'CC(=O)O', 1], ['ácido propanoico', 'C3H6O2', 'CCC(=O)O', 1], ['ácido butanoico', 'C4H8O2', 'CCCC(=O)O', 1], ['ácido pentanoico', 'C5H10O2', 'CCCCC(=O)O', 1],
  ['ácido hexanoico', 'C6H12O2', 'CCCCCC(=O)O', 1], ['ácido decanoico', 'C10H20O2', 'CCCCCCCCCC(=O)O', 1], ['ácido benzoico', 'C7H6O2', 'OC(=O)c1ccccc1', 1], ['ácido etanodioico', 'C2H2O4', 'OC(=O)C(=O)O', 2],
  ['ácido propanodioico', 'C3H4O4', 'OC(=O)CC(=O)O', 2], ['ácido butanodioico', 'C4H6O4', 'OC(=O)CCC(=O)O', 2], ['ácido hexanodioico', 'C6H10O4', 'OC(=O)CCCCC(=O)O', 2]
]
const RENG_RAIZ_OR: readonly string[] = ['met', 'et', 'prop', 'but', 'pent', 'hex']
const RENG_ALQUILO_OR: readonly string[] = ['metilo', 'etilo', 'propilo', 'butilo']
const RENG_ALCOHOL_LINEAL_OR: readonly string[] = ['metanol', 'etanol', 'propan-1-ol', 'butan-1-ol']
const rengRepetir = (rengN: number): string => 'C'.repeat(rengN)
export const rengFAcidoOr = (rengA: number): string => `C${rengA}H${2 * rengA}O2`.replace('C1H', 'CH')
export const rengFAlcoholOr = (rengB: number): string => `C${rengB}H${2 * rengB + 2}O`.replace('C1H', 'CH')
export interface RengEsterOr { a: number; b: number; nombre: string; acido: string; alcohol: string; formula: string; smiles: string }
export const RENG_ESTERES_OR: readonly RengEsterOr[] = RENG_RAIZ_OR.flatMap((rengR, rengI) =>
  RENG_ALQUILO_OR.map((rengQ, rengJ) => ({
    a: rengI + 1, b: rengJ + 1, nombre: `${rengR}anoato de ${rengQ}`, acido: `ácido ${rengR}anoico`, alcohol: RENG_ALCOHOL_LINEAL_OR[rengJ]!, formula: `C${rengI + rengJ + 2}H${2 * (rengI + rengJ + 2)}O2`, smiles: `${rengRepetir(rengI)}C(=O)O${rengRepetir(rengJ + 1)}`
  }))
)
export type RengAminaOr = readonly [nombre: string, formula: string, smiles: string, carbonosN: number, nitrogenos: number]
export const RENG_AMINAS_OR: readonly RengAminaOr[] = [
  ['metanamina', 'CH5N', 'CN', 1, 1], ['etanamina', 'C2H7N', 'CCN', 1, 1], ['propan-1-amina', 'C3H9N', 'CCCN', 1, 1], ['propan-2-amina', 'C3H9N', 'CC(N)C', 1, 1], ['butan-1-amina', 'C4H11N', 'CCCCN', 1, 1], ['pentan-1-amina', 'C5H13N', 'CCCCCN', 1, 1],
  ['hexan-1-amina', 'C6H15N', 'CCCCCCN', 1, 1], ['anilina', 'C6H7N', 'Nc1ccccc1', 1, 1], ['N-metilmetanamina (dimetilamina)', 'C2H7N', 'CNC', 2, 1], ['N-metiletanamina', 'C3H9N', 'CCNC', 2, 1], ['N-etiletanamina (dietilamina)', 'C4H11N', 'CCNCC', 2, 1],
  ['N-metilpropan-1-amina', 'C4H11N', 'CCCNC', 2, 1], ['N,N-dimetilmetanamina (trimetilamina)', 'C3H9N', 'CN(C)C', 3, 1], ['N,N-dietiletanamina (trietilamina)', 'C6H15N', 'CCN(CC)CC', 3, 1], ['etano-1,2-diamina', 'C2H8N2', 'NCCN', 1, 2],
  ['hexano-1,6-diamina', 'C6H16N2', 'NCCCCCCN', 1, 2]
]
export const RENG_MONOAMINAS_OR: readonly RengAminaOr[] = RENG_AMINAS_OR.filter((rengA) => rengA[4] === 1)
const RENG_BASE_AMIDA_OR: ReadonlyArray<readonly [nombre: string, formula: string, prefijo: string]> = [['amoníaco', 'NH3', ''], ['metanamina', 'CH5N', 'N-metil'], ['etanamina', 'C2H7N', 'N-etil']]
export interface RengAmidaOr { a: number; c: number; nombre: string; acido: string; amina: string; formulaAmina: string; formula: string; smiles: string }
export const RENG_AMIDAS_OR: readonly RengAmidaOr[] = RENG_RAIZ_OR.flatMap((rengR, rengI) =>
  RENG_BASE_AMIDA_OR.map(([rengNombre, rengFormula, rengPrefijo], rengC) => ({
    a: rengI + 1, c: rengC, nombre: `${rengPrefijo}${rengR}anamida`, acido: `ácido ${rengR}anoico`, amina: rengNombre, formulaAmina: rengFormula, formula: `C${rengI + 1 + rengC}H${2 * (rengI + 1 + rengC) + 1}NO`.replace('C1H', 'CH'),
    smiles: `${rengRepetir(rengI)}C(=O)N${rengRepetir(rengC)}`
  }))
)

export const RENG_MOLECULAS_OR: readonly RengCompuestoOr[] = [
  ...RENG_HIDROCARBUROS_OR.filter((_rengX, rengI) => rengI % 2 === 0),
  ...RENG_ALCOHOLES_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
  ...RENG_ETERES_OR.slice(0, 4),
  ...RENG_ALDEHIDOS_OR.slice(0, 5),
  ...RENG_CETONAS_OR.slice(0, 4).map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
  ...RENG_ACIDOS_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
  ...RENG_ESTERES_OR.filter((rengE) => rengE.a <= 2 && rengE.b <= 2).map((rengE) => [rengE.nombre, rengE.formula, rengE.smiles] as const),
  ...RENG_AMINAS_OR.slice(0, 8).map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
  ...RENG_AMIDAS_OR.filter((rengA) => rengA.c === 0 && rengA.a <= 4).map((rengA) => [rengA.nombre, rengA.formula, rengA.smiles] as const),
  ['clorometano', 'CH3Cl', 'CCl'], ['cloroetano', 'C2H5Cl', 'CCCl'], ['diclorometano', 'CH2Cl2', 'ClCCl'], ['2-cloropropano', 'C3H7Cl', 'CC(Cl)C'], ['1,2-dibromoetano', 'C2H4Br2', 'BrCCBr'], ['clorobenceno', 'C6H5Cl', 'Clc1ccccc1']
]
export const RENG_OXIGENADOS_OR: readonly RengCompuestoOr[] = RENG_MOLECULAS_OR.filter(([, rengF]) => rengOOr(rengF) > 0 && rengNOr(rengF) === 0 && rengXOr(rengF) === 0)
export const RENG_NOMBRES_OR: readonly RengCompuestoOr[] = [
  ...RENG_ALCANOS_OR,
  ...RENG_ALQUENOS_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
  ...RENG_ALQUINOS_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
  ...RENG_AROMATICOS_OR.slice(0, 8).map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
  ...RENG_ALCOHOLES_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
  ...RENG_ETERES_OR.slice(0, 5),
  ...RENG_ALDEHIDOS_OR,
  ...RENG_CETONAS_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
  ...RENG_ACIDOS_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
  ...RENG_ESTERES_OR.filter((rengE) => rengE.a + rengE.b <= 6).map((rengE) => [rengE.nombre, rengE.formula, rengE.smiles] as const),
  ...RENG_AMINAS_OR.filter((rengA) => rengA[3] === 1 && rengA[0] !== 'anilina').map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
  ...RENG_AMIDAS_OR.filter((rengA) => rengA.c === 0).map((rengA) => [rengA.nombre, rengA.formula, rengA.smiles] as const),
  ['clorometano', 'CH3Cl', 'CCl'], ['cloroetano', 'C2H5Cl', 'CCCl'], ['diclorometano', 'CH2Cl2', 'ClCCl'], ['triclorometano', 'CHCl3', 'ClC(Cl)Cl'], ['2-cloropropano', 'C3H7Cl', 'CC(Cl)C'], ['1,2-dibromoetano', 'C2H4Br2', 'BrCCBr'], ['clorobenceno', 'C6H5Cl', 'Clc1ccccc1']
]

export type RengSemiOr = readonly [texto: string, formula: string]
export const RENG_SEMI_OR: readonly RengSemiOr[] = [
  ['CH3-CH3', 'C2H6'], ['CH3-CH2-CH3', 'C3H8'], ['CH3-CH2-CH2-CH3', 'C4H10'], ['CH3-CH(CH3)-CH3', 'C4H10'], ['CH3-CH2-CH2-CH2-CH3', 'C5H12'], ['CH3-C(CH3)2-CH3', 'C5H12'], ['CH3-CH2-CH(CH3)-CH3', 'C5H12'], ['CH2=CH2', 'C2H4'],
  ['CH2=CH-CH3', 'C3H6'], ['CH3-CH=CH-CH3', 'C4H8'], ['CH2=CH-CH=CH2', 'C4H6'], ['CH≡CH', 'C2H2'], ['CH≡C-CH3', 'C3H4'], ['CH3-C≡C-CH3', 'C4H6'], ['CH3-CH2-OH', 'C2H6O'], ['CH3-CH2-CH2-OH', 'C3H8O'], ['CH3-CH(OH)-CH3', 'C3H8O'],
  ['CH3-CH2-CH2-CH2-OH', 'C4H10O'], ['CH3-O-CH3', 'C2H6O'], ['CH3-CH2-O-CH2-CH3', 'C4H10O'], ['CH3-CHO', 'C2H4O'], ['CH3-CH2-CHO', 'C3H6O'], ['CH3-CH2-CH2-CHO', 'C4H8O'], ['CH3-CO-CH3', 'C3H6O'], ['CH3-CH2-CO-CH3', 'C4H8O'],
  ['CH3-COOH', 'C2H4O2'], ['CH3-CH2-COOH', 'C3H6O2'], ['CH3-CH2-CH2-COOH', 'C4H8O2'], ['CH3-COO-CH3', 'C3H6O2'], ['CH3-COO-CH2-CH3', 'C4H8O2'], ['CH3-NH2', 'CH5N'], ['CH3-NH-CH3', 'C2H7N'], ['CH3-CO-NH2', 'C2H5NO'], ['CH3-CH2-Cl', 'C2H5Cl']
]
const RENG_SUBINDICES_OR = '₀₁₂₃₄₅₆₇₈₉'
export const rengSemiTextoOr = (rengT: string): string => rengT.replace(/[0-9]/g, (rengD) => RENG_SUBINDICES_OR[Number(rengD)]!).replace(/-/g, '–')
export const rengLetrasHOr = (rengT: string): number => (rengT.match(/H/g) ?? []).length

export type RengEsqueletoOr = readonly [texto: string, smiles: string, C: number, dobles: number, triples: number, anillos: number]
export const RENG_ESQUELETOS_OR: readonly RengEsqueletoOr[] = [
  ['una cadena abierta de 5 carbonos con un enlace doble', 'C=CCCC', 5, 1, 0, 0], ['un anillo de 6 carbonos sin enlaces múltiples', 'C1CCCCC1', 6, 0, 0, 1], ['un anillo de 6 carbonos con un enlace doble', 'C1=CCCCC1', 6, 1, 0, 1],
  ['una cadena abierta de 4 carbonos con un enlace triple', 'C#CCC', 4, 0, 1, 0], ['una cadena abierta de 6 carbonos con dos enlaces dobles', 'C=CCCC=C', 6, 2, 0, 0], ['un anillo de 5 carbonos sin enlaces múltiples', 'C1CCCC1', 5, 0, 0, 1],
  ['una cadena abierta de 7 carbonos con un enlace doble y uno triple', 'C=CCCCC#C', 7, 1, 1, 0], ['dos anillos de 6 carbonos que comparten un lado (10 carbonos), sin enlaces múltiples', 'C1CCC2CCCCC2C1', 10, 0, 0, 2],
  ['un anillo de 3 carbonos sin enlaces múltiples', 'C1CC1', 3, 0, 0, 1], ['un anillo de 4 carbonos con un metilo (5 carbonos en total)', 'CC1CCC1', 5, 0, 0, 1], ['una cadena abierta de 6 carbonos con un enlace triple', 'CC#CCCC', 6, 0, 1, 0],
  ['un anillo de 6 carbonos con dos enlaces dobles', 'C1=CC=CCC1', 6, 2, 0, 1], ['una cadena abierta de 5 carbonos con dos enlaces dobles', 'C=CCC=C', 5, 2, 0, 0], ['un anillo de 5 carbonos con un enlace doble', 'C1=CCCC1', 5, 1, 0, 1],
  ['una cadena abierta de 9 carbonos con un enlace doble', 'C=CCCCCCCC', 9, 1, 0, 0], ['una cadena ramificada de 6 carbonos con un enlace doble', 'CC(C)=CCC', 6, 1, 0, 0], ['una cadena abierta de 8 carbonos con dos enlaces triples', 'C#CCCCCC#C', 8, 0, 2, 0],
  ['un anillo de 8 carbonos con un enlace doble', 'C1=CCCCCCC1', 8, 1, 0, 1]
]
export type RengEntornoOr = readonly [texto: string, ordenes: number]
export const RENG_ENTORNOS_OR: readonly RengEntornoOr[] = [
  ['por un enlace sencillo a otro carbono', 1], ['por enlaces sencillos a dos carbonos', 2], ['por enlaces sencillos a tres carbonos', 3], ['por un enlace doble a otro carbono', 2], ['por un enlace doble a un carbono y por uno sencillo a otro', 3],
  ['por un enlace triple a otro carbono', 3], ['por un enlace doble a un oxígeno', 2], ['por un enlace doble a un oxígeno y por uno sencillo a un carbono', 3], ['por un enlace sencillo a un oxígeno', 1], ['por enlaces sencillos a un carbono y a un oxígeno', 2],
  ['por un enlace sencillo a un nitrógeno', 1], ['por enlaces sencillos a un carbono y a un cloro', 2], ['por enlaces sencillos a dos carbonos y a un oxígeno', 3], ['por un enlace sencillo a un cloro', 1], ['por enlaces sencillos a dos cloros', 2],
  ['por un enlace triple a un nitrógeno', 3]
]

export const RENG_ISOMEROS_OR: readonly number[] = [1, 1, 1, 2, 3, 5, 9, 18, 35, 75, 159, 355, 802]
export type RengParIsomerosOr = readonly [a: string, formula: string, smilesA: string, b: string, smilesB: string, tipo: string]
export const RENG_PARES_ISOMEROS_OR: readonly RengParIsomerosOr[] = [
  ['butano', 'C4H10', 'CCCC', '2-metilpropano', 'CC(C)C', 'cadena'], ['pentano', 'C5H12', 'CCCCC', '2-metilbutano', 'CC(C)CC', 'cadena'], ['pentano', 'C5H12', 'CCCCC', '2,2-dimetilpropano', 'CC(C)(C)C', 'cadena'],
  ['hexano', 'C6H14', 'CCCCCC', '2,3-dimetilbutano', 'CC(C)C(C)C', 'cadena'], ['but-1-eno', 'C4H8', 'C=CCC', 'but-2-eno', 'CC=CC', 'posición'], ['but-1-ino', 'C4H6', 'C#CCC', 'but-2-ino', 'CC#CC', 'posición'],
  ['propan-1-ol', 'C3H8O', 'CCCO', 'propan-2-ol', 'CC(O)C', 'posición'], ['pentan-2-ona', 'C5H10O', 'CC(=O)CCC', 'pentan-3-ona', 'CCC(=O)CC', 'posición'], ['propan-1-amina', 'C3H9N', 'CCCN', 'propan-2-amina', 'CC(N)C', 'posición'],
  ['etanol', 'C2H6O', 'CCO', 'metoximetano', 'COC', 'función'], ['propanal', 'C3H6O', 'CCC=O', 'propanona', 'CC(=O)C', 'función'], ['ácido etanoico', 'C2H4O2', 'CC(=O)O', 'metanoato de metilo', 'C(=O)OC', 'función'],
  ['butan-1-ol', 'C4H10O', 'CCCCO', 'etoxietano', 'CCOCC', 'función'], ['but-1-ino', 'C4H6', 'C#CCC', 'buta-1,3-dieno', 'C=CC=C', 'función'], ['pent-1-eno', 'C5H10', 'C=CCCC', 'ciclopentano', 'C1CCCC1', 'función'],
  ['ácido propanoico', 'C3H6O2', 'CCC(=O)O', 'etanoato de metilo', 'CC(=O)OC', 'función']
]
export type RengMonocloradoOr = readonly [nombre: string, formula: string, smiles: string, derivados: number]
export const RENG_MONOCLORADOS_OR: readonly RengMonocloradoOr[] = [
  ['metano', 'CH4', 'C', 1], ['etano', 'C2H6', 'CC', 1], ['propano', 'C3H8', 'CCC', 2], ['butano', 'C4H10', 'CCCC', 2], ['2-metilpropano', 'C4H10', 'CC(C)C', 2], ['pentano', 'C5H12', 'CCCCC', 3], ['2-metilbutano', 'C5H12', 'CC(C)CC', 4],
  ['2,2-dimetilpropano', 'C5H12', 'CC(C)(C)C', 1], ['hexano', 'C6H14', 'CCCCCC', 3], ['2-metilpentano', 'C6H14', 'CC(C)CCC', 5], ['3-metilpentano', 'C6H14', 'CCC(C)CC', 4], ['2,2-dimetilbutano', 'C6H14', 'CC(C)(C)CC', 3],
  ['2,3-dimetilbutano', 'C6H14', 'CC(C)C(C)C', 2], ['heptano', 'C7H16', 'CCCCCCC', 4], ['octano', 'C8H18', 'CCCCCCCC', 4], ['ciclopentano', 'C5H10', 'C1CCCC1', 1], ['ciclohexano', 'C6H12', 'C1CCCCC1', 1]
]

export interface RengFamiliaOr { clave: string; nombre: string; plural: string; hExtra: number; O: number; N: number; minC: number; gi: number }
export const RENG_FAMILIAS_OR: readonly RengFamiliaOr[] = [
  { clave: 'alcohol', nombre: 'un alcohol', plural: 'los alcoholes', hExtra: 2, O: 1, N: 0, minC: 1, gi: 0 },
  { clave: 'eter', nombre: 'un éter', plural: 'los éteres', hExtra: 2, O: 1, N: 0, minC: 2, gi: 0 },
  { clave: 'aldehido', nombre: 'un aldehído', plural: 'los aldehídos', hExtra: 0, O: 1, N: 0, minC: 1, gi: 1 },
  { clave: 'cetona', nombre: 'una cetona', plural: 'las cetonas', hExtra: 0, O: 1, N: 0, minC: 3, gi: 1 },
  { clave: 'acido', nombre: 'un ácido carboxílico', plural: 'los ácidos carboxílicos', hExtra: 0, O: 2, N: 0, minC: 1, gi: 1 },
  { clave: 'ester', nombre: 'un éster', plural: 'los ésteres', hExtra: 0, O: 2, N: 0, minC: 2, gi: 1 },
  { clave: 'amina', nombre: 'una amina primaria', plural: 'las aminas primarias', hExtra: 3, O: 0, N: 1, minC: 1, gi: 0 },
  { clave: 'amida', nombre: 'una amida primaria', plural: 'las amidas primarias', hExtra: 1, O: 1, N: 1, minC: 1, gi: 1 }
]
export const rengHFamiliaOr = (rengF: RengFamiliaOr, rengC: number): number => 2 * rengC + rengF.hExtra
export const rengBaseFamiliaOr = (rengF: RengFamiliaOr): number => rengF.hExtra * rengAnNo('H') + rengF.O * rengAnNo('O') + rengF.N * rengAnNo('N')
export const rengMFamiliaOr = (rengF: RengFamiliaOr, rengC: number): number => rengC * rengMCh2Or() + rengBaseFamiliaOr(rengF)
export const rengFormulaFamiliaOr = (rengF: RengFamiliaOr): string => `CₙH₂ₙ${rengF.hExtra > 0 ? `₊${RENG_SUBINDICES_OR[rengF.hExtra]}` : ''}${rengF.N > 0 ? 'N' : ''}${rengF.O > 0 ? `O${rengF.O > 1 ? RENG_SUBINDICES_OR[rengF.O] : ''}` : ''}`

export type RengAdicionOr = readonly [alqueno: string, formula: string, reactivo: string, formulaReactivo: string, producto: string, smilesProducto: string]
export const RENG_ADICIONES_OR: readonly RengAdicionOr[] = [
  ['eteno', 'C2H4', 'hidrógeno, H₂', 'H2', 'etano', 'CC'], ['eteno', 'C2H4', 'bromo, Br₂', 'Br2', '1,2-dibromoetano', 'BrCCBr'], ['eteno', 'C2H4', 'cloruro de hidrógeno, HCl', 'HCl', 'cloroetano', 'CCCl'], ['eteno', 'C2H4', 'agua', 'H2O', 'etanol', 'CCO'],
  ['propeno', 'C3H6', 'hidrógeno, H₂', 'H2', 'propano', 'CCC'], ['propeno', 'C3H6', 'bromo, Br₂', 'Br2', '1,2-dibromopropano', 'BrCC(Br)C'], ['propeno', 'C3H6', 'bromuro de hidrógeno, HBr', 'HBr', '2-bromopropano', 'CC(Br)C'],
  ['propeno', 'C3H6', 'agua', 'H2O', 'propan-2-ol', 'CC(O)C'], ['but-2-eno', 'C4H8', 'hidrógeno, H₂', 'H2', 'butano', 'CCCC'], ['but-2-eno', 'C4H8', 'cloro, Cl₂', 'Cl2', '2,3-diclorobutano', 'CC(Cl)C(Cl)C'],
  ['but-2-eno', 'C4H8', 'cloruro de hidrógeno, HCl', 'HCl', '2-clorobutano', 'CC(Cl)CC'], ['but-2-eno', 'C4H8', 'agua', 'H2O', 'butan-2-ol', 'CC(O)CC'], ['ciclohexeno', 'C6H10', 'hidrógeno, H₂', 'H2', 'ciclohexano', 'C1CCCCC1'],
  ['ciclohexeno', 'C6H10', 'bromo, Br₂', 'Br2', '1,2-dibromociclohexano', 'BrC1CCCCC1Br']
]
export type RengTerminoOr = readonly [formula: string, coeficiente: number]
export type RengReaccionOr = readonly [texto: string, reactivos: readonly RengTerminoOr[], producto: RengTerminoOr, subproducto: RengTerminoOr, tipo: string]
export const RENG_REACCIONES_OR: readonly RengReaccionOr[] = [
  ['CH₄ + Cl₂ → CH₃Cl + HCl', [['CH4', 1], ['Cl2', 1]], ['CH3Cl', 1], ['HCl', 1], 'sustitución'], ['C₂H₆ + Br₂ → C₂H₅Br + HBr', [['C2H6', 1], ['Br2', 1]], ['C2H5Br', 1], ['HBr', 1], 'sustitución'],
  ['C₆H₆ + Br₂ → C₆H₅Br + HBr', [['C6H6', 1], ['Br2', 1]], ['C6H5Br', 1], ['HBr', 1], 'sustitución'], ['C₆H₆ + Cl₂ → C₆H₅Cl + HCl', [['C6H6', 1], ['Cl2', 1]], ['C6H5Cl', 1], ['HCl', 1], 'sustitución'],
  ['C₂H₅Cl + NaOH → C₂H₅OH + NaCl', [['C2H5Cl', 1], ['NaOH', 1]], ['C2H6O', 1], ['NaCl', 1], 'sustitución'], ['CH₃Cl + NaOH → CH₃OH + NaCl', [['CH3Cl', 1], ['NaOH', 1]], ['CH4O', 1], ['NaCl', 1], 'sustitución'],
  ['C₂H₅OH → C₂H₄ + H₂O', [['C2H6O', 1]], ['C2H4', 1], ['H2O', 1], 'eliminación'], ['C₃H₇OH → C₃H₆ + H₂O', [['C3H8O', 1]], ['C3H6', 1], ['H2O', 1], 'eliminación'], ['C₄H₉OH → C₄H₈ + H₂O', [['C4H10O', 1]], ['C4H8', 1], ['H2O', 1], 'eliminación'],
  ['CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O', [['C2H4O2', 1], ['C2H6O', 1]], ['C4H8O2', 1], ['H2O', 1], 'condensación'], ['CH₃COOH + CH₃OH → CH₃COOCH₃ + H₂O', [['C2H4O2', 1], ['CH4O', 1]], ['C3H6O2', 1], ['H2O', 1], 'condensación'],
  ['HCOOH + CH₃OH → HCOOCH₃ + H₂O', [['CH2O2', 1], ['CH4O', 1]], ['C2H4O2', 1], ['H2O', 1], 'condensación'], ['CH₃CH₂COOH + C₂H₅OH → CH₃CH₂COOC₂H₅ + H₂O', [['C3H6O2', 1], ['C2H6O', 1]], ['C5H10O2', 1], ['H2O', 1], 'condensación'],
  ['CH₃COOH + NH₃ → CH₃CONH₂ + H₂O', [['C2H4O2', 1], ['NH3', 1]], ['C2H5NO', 1], ['H2O', 1], 'condensación'], ['C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂', [['C6H12O6', 1]], ['C2H6O', 2], ['CO2', 2], 'fermentación'],
  ['2 C₂H₅OH → C₂H₅OC₂H₅ + H₂O', [['C2H6O', 2]], ['C4H10O', 1], ['H2O', 1], 'condensación']
]
export const rengMasaTerminosOr = (rengT: readonly RengTerminoOr[]): number => rengT.reduce((rengS, [rengF, rengK]) => rengS + rengK * rengMNo(rengF), 0)

export type RengMonomeroOr = readonly [nombre: string, formula: string, polimero: string]
export const RENG_MONOMEROS_OR: readonly RengMonomeroOr[] = [
  ['eteno', 'C2H4', 'polietileno'], ['propeno', 'C3H6', 'polipropileno'], ['cloroeteno (cloruro de vinilo)', 'C2H3Cl', 'PVC'], ['etenilbenceno (estireno)', 'C8H8', 'poliestireno'], ['tetrafluoroeteno', 'C2F4', 'teflón'],
  ['propenonitrilo (acrilonitrilo)', 'C3H3N', 'poliacrilonitrilo'], ['metacrilato de metilo', 'C5H8O2', 'metacrilato (PMMA)']
]
export type RengCondensableOr = readonly [nombre: string, formula: string, cadena: string]
export const RENG_CONDENSABLES_OR: readonly RengCondensableOr[] = [
  ['glucosa', 'C6H12O6', 'un polisacárido'], ['glicina', 'C2H5NO2', 'un péptido'], ['alanina', 'C3H7NO2', 'un péptido'], ['serina', 'C3H7NO3', 'un péptido'], ['valina', 'C5H11NO2', 'un péptido'], ['ácido láctico', 'C3H6O3', 'un poliéster'],
  ['ácido glicólico', 'C2H4O3', 'un poliéster'], ['ácido 6-aminohexanoico', 'C6H13NO2', 'una poliamida']
]
export const rengTotalOr = rengTotalNo
