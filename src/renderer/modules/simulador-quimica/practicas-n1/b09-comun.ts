import { RENG_S111, RENG_S112, RENG_S113, RENG_S114, RENG_S33, RENG_S34, rengSeccionSol } from '../aprender/n1/soluciones/comun'
import { RENG_PROCEDENCIA_MASAS } from '../aprender/n1/procedencia'
import type { RengProcedenciaN1, RengToleranciaN1 } from '../aprender/n1/tipos'
import { rengMasaMolarDe, rengSubindice } from '../nucleo/formula'
import { rengTx } from '../aprender/n1/gases/constantes'

export const RENG_TOL_SOL: RengToleranciaN1 = { rel: 0.01, abs: 1e-9 }
export const RENG_TOL_SOL_PCT: RengToleranciaN1 = { rel: 0.01, abs: 0.05 }
export const RENG_KF_SOL = 1.86
export const RENG_DENSIDAD_ETANOL_SOL = 0.789

const RENG_SECCIONES_SOL = { '3.3': RENG_S33, '3.4': RENG_S34, '11.1': RENG_S111, '11.2': RENG_S112, '11.3': RENG_S113, '11.4': RENG_S114 } as const

export const rengFuentesSol = (rengSeccion: keyof typeof RENG_SECCIONES_SOL, rengPara: string, rengMasas = false): readonly RengProcedenciaN1[] => [rengSeccionSol(RENG_SECCIONES_SOL[rengSeccion], rengPara), ...(rengMasas ? [RENG_PROCEDENCIA_MASAS] : [])]

export const rengMmSol = (rengF: string): number => rengMasaMolarDe(rengF)
export const rengTextoSol = (rengF: string): string => rengSubindice(rengF)
export const rengDatoMasaSol = (rengF: string): readonly [string, string] => [`M(${rengTextoSol(rengF)})`, `${rengTx(rengMmSol(rengF), 5)} g/mol`]

export interface RengElectrolitoSol {
  formula: string
  cation: string
  nc: number
  zc: number
  anion: string
  na: number
  za: number
}

const rengE = (rengFormula: string, rengCation: string, rengNc: number, rengZc: number, rengAnion: string, rengNa: number, rengZa: number): RengElectrolitoSol => ({ formula: rengFormula, cation: rengCation, nc: rengNc, zc: rengZc, anion: rengAnion, na: rengNa, za: rengZa })

export const RENG_ELECTROLITOS_SOL: readonly RengElectrolitoSol[] = [
  rengE('NaCl', 'Na⁺', 1, 1, 'Cl⁻', 1, 1),
  rengE('KNO3', 'K⁺', 1, 1, 'NO₃⁻', 1, 1),
  rengE('KBr', 'K⁺', 1, 1, 'Br⁻', 1, 1),
  rengE('MgSO4', 'Mg²⁺', 1, 2, 'SO₄²⁻', 1, 2),
  rengE('CaCl2', 'Ca²⁺', 1, 2, 'Cl⁻', 2, 1),
  rengE('MgCl2', 'Mg²⁺', 1, 2, 'Cl⁻', 2, 1),
  rengE('Ca(NO3)2', 'Ca²⁺', 1, 2, 'NO₃⁻', 2, 1),
  rengE('Na2SO4', 'Na⁺', 2, 1, 'SO₄²⁻', 1, 2),
  rengE('K2SO4', 'K⁺', 2, 1, 'SO₄²⁻', 1, 2),
  rengE('(NH4)2SO4', 'NH₄⁺', 2, 1, 'SO₄²⁻', 1, 2),
  rengE('Na3PO4', 'Na⁺', 3, 1, 'PO₄³⁻', 1, 3),
  rengE('AlCl3', 'Al³⁺', 1, 3, 'Cl⁻', 3, 1),
  rengE('FeCl3', 'Fe³⁺', 1, 3, 'Cl⁻', 3, 1),
  rengE('Al2(SO4)3', 'Al³⁺', 2, 3, 'SO₄²⁻', 3, 2)
]

export const RENG_ELECTROLITOS_MULTI_SOL: readonly RengElectrolitoSol[] = RENG_ELECTROLITOS_SOL.filter((rengX) => rengX.nc + rengX.na >= 3)

export interface RengSolutoSol {
  formula: string
  nombre: string
  i: number
}

export const RENG_SOLUTOS_SOL: readonly RengSolutoSol[] = [
  { formula: 'C6H12O6', nombre: 'glucosa', i: 1 },
  { formula: 'C12H22O11', nombre: 'sacarosa', i: 1 },
  { formula: 'CH4N2O', nombre: 'urea', i: 1 },
  { formula: 'C3H8O3', nombre: 'glicerina', i: 1 },
  { formula: 'NaCl', nombre: 'cloruro de sodio', i: 2 },
  { formula: 'KCl', nombre: 'cloruro de potasio', i: 2 },
  { formula: 'KNO3', nombre: 'nitrato de potasio', i: 2 },
  { formula: 'MgSO4', nombre: 'sulfato de magnesio', i: 2 },
  { formula: 'CaCl2', nombre: 'cloruro de calcio', i: 3 },
  { formula: 'Na2SO4', nombre: 'sulfato de sodio', i: 3 },
  { formula: 'NaOH', nombre: 'hidróxido de sodio', i: 2 },
  { formula: 'NH4Cl', nombre: 'cloruro de amonio', i: 2 }
]

export const RENG_SOLUTOS_ELECTROLITOS_SOL: readonly RengSolutoSol[] = RENG_SOLUTOS_SOL.filter((rengS) => rengS.i >= 2)
export const RENG_NO_ELECTROLITOS_SOL: readonly RengSolutoSol[] = RENG_SOLUTOS_SOL.filter((rengS) => rengS.i === 1)

export const RENG_REACTIVOS_LAB_SOL: ReadonlyArray<{ formula: string; nombre: string }> = [
  { formula: 'HCl', nombre: 'ácido clorhídrico' },
  { formula: 'HNO3', nombre: 'ácido nítrico' },
  { formula: 'H2SO4', nombre: 'ácido sulfúrico' },
  { formula: 'H3PO4', nombre: 'ácido fosfórico' },
  { formula: 'CH3COOH', nombre: 'ácido acético' },
  { formula: 'NH3', nombre: 'amoníaco' },
  { formula: 'NaOH', nombre: 'hidróxido de sodio' },
  { formula: 'KOH', nombre: 'hidróxido de potasio' }
]

export const RENG_ACIDOS_BASES_EQ_SOL: ReadonlyArray<{ formula: string; nombre: string; eq: number; tipo: 'ácido' | 'base'; unidad: 'H⁺' | 'OH⁻' }> = [
  { formula: 'HCl', nombre: 'ácido clorhídrico', eq: 1, tipo: 'ácido', unidad: 'H⁺' },
  { formula: 'HNO3', nombre: 'ácido nítrico', eq: 1, tipo: 'ácido', unidad: 'H⁺' },
  { formula: 'H2SO4', nombre: 'ácido sulfúrico', eq: 2, tipo: 'ácido', unidad: 'H⁺' },
  { formula: 'H3PO4', nombre: 'ácido fosfórico', eq: 3, tipo: 'ácido', unidad: 'H⁺' },
  { formula: 'H2C2O4', nombre: 'ácido oxálico', eq: 2, tipo: 'ácido', unidad: 'H⁺' },
  { formula: 'NaOH', nombre: 'hidróxido de sodio', eq: 1, tipo: 'base', unidad: 'OH⁻' },
  { formula: 'KOH', nombre: 'hidróxido de potasio', eq: 1, tipo: 'base', unidad: 'OH⁻' },
  { formula: 'Ca(OH)2', nombre: 'hidróxido de calcio', eq: 2, tipo: 'base', unidad: 'OH⁻' },
  { formula: 'Ba(OH)2', nombre: 'hidróxido de bario', eq: 2, tipo: 'base', unidad: 'OH⁻' }
]

export const RENG_ACIDOS_SOL = RENG_ACIDOS_BASES_EQ_SOL.filter((rengX) => rengX.tipo === 'ácido')
export const RENG_BASES_SOL = RENG_ACIDOS_BASES_EQ_SOL.filter((rengX) => rengX.tipo === 'base')
export const RENG_POLIPROTICOS_SOL = RENG_ACIDOS_BASES_EQ_SOL.filter((rengX) => rengX.eq >= 2)

export const RENG_POCO_SOLUBLES_SOL = ['CaSO4', 'SrSO4', 'BaF2', 'CaF2', 'MgF2', 'Li2CO3', 'Ag2SO4', 'SrF2'] as const

export const RENG_IONES_AGUA_SOL: ReadonlyArray<{ formula: string; nombre: string }> = [
  { formula: 'Ca', nombre: 'calcio' },
  { formula: 'Mg', nombre: 'magnesio' },
  { formula: 'Na', nombre: 'sodio' },
  { formula: 'K', nombre: 'potasio' },
  { formula: 'F', nombre: 'fluoruro' },
  { formula: 'Fe', nombre: 'hierro' },
  { formula: 'Zn', nombre: 'cinc' },
  { formula: 'NO3', nombre: 'nitrato' },
  { formula: 'SO4', nombre: 'sulfato' }
]

export const RENG_HIDRATOS_SOL: ReadonlyArray<readonly [anhidro: string, agua: number]> = [['CuSO4', 5], ['MgSO4', 7], ['Na2CO3', 10], ['CoCl2', 6], ['BaCl2', 2], ['Na2SO4', 10], ['ZnSO4', 7]]
export const rengTextoHidratoSol = (rengH: readonly [string, number]): string => `${rengTextoSol(rengH[0])}·${rengH[1]}H₂O`
export const rengMasaHidratoSol = (rengH: readonly [string, number]): number => rengMmSol(rengH[0]) + rengH[1] * rengMmSol('H2O')

export const RENG_FACTORES_DILUCION_SOL = [2, 4, 5, 10, 20, 25, 50] as const
export const RENG_VOLUMENES_MATRAZ_SOL = [50, 100, 250, 500, 1000, 2000] as const

export const rengIonDe = (rengE0: RengElectrolitoSol, rengK: number): { nombre: string; nu: number } => (rengK === 0 ? { nombre: rengE0.cation, nu: rengE0.nc } : { nombre: rengE0.anion, nu: rengE0.na })
