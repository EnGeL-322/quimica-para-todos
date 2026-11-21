import { RENG_S131, RENG_S132, RENG_S133, RENG_S141, RENG_S142, RENG_S143, RENG_S144, RENG_S146, RENG_S147, RENG_S151, RENG_S152, RENG_S42, rengSeccionAb } from '../aprender/n1/acidos/comun'
import { RENG_PROCEDENCIA_MASAS, RENG_PROCEDENCIA_R } from '../aprender/n1/procedencia'
import type { RengProcedenciaN1, RengToleranciaN1 } from '../aprender/n1/tipos'
import { rengMasaMolarDe, rengSubindice } from '../nucleo/formula'
import { rengTx } from '../aprender/n1/gases/constantes'

export const RENG_TOL_AB: RengToleranciaN1 = { rel: 0.01, abs: 1e-9 }
export const RENG_TOL_PH: RengToleranciaN1 = { rel: 0.004, abs: 0.02 }
export const RENG_TOL_AB_PCT: RengToleranciaN1 = { rel: 0.01, abs: 0.05 }
export const RENG_KW_AB = 1.0e-14
export const RENG_R_BAR_AB = 0.08314462618
export const RENG_KW_SIN_VERIFICAR = 'Kw = 1,0·10⁻¹⁴ a 25 °C (pKw = 14,00) es el valor redondeado de uso común; no se contrastó con una fuente en esta entrega.'

const RENG_SECCIONES_AB = { '4.2': RENG_S42, '13.1': RENG_S131, '13.2': RENG_S132, '13.3': RENG_S133, '14.1': RENG_S141, '14.2': RENG_S142, '14.3': RENG_S143, '14.4': RENG_S144, '14.6': RENG_S146, '14.7': RENG_S147, '15.1': RENG_S151, '15.2': RENG_S152 } as const

export const rengFuentesAb = (rengSeccion: keyof typeof RENG_SECCIONES_AB, rengPara: string, ...rengExtra: ReadonlyArray<'masas' | 'r'>): readonly RengProcedenciaN1[] => [rengSeccionAb(RENG_SECCIONES_AB[rengSeccion], rengPara), ...rengExtra.map((rengE) => (rengE === 'masas' ? RENG_PROCEDENCIA_MASAS : RENG_PROCEDENCIA_R))]

export const rengMmAb = (rengF: string): number => rengMasaMolarDe(rengF)
export const rengTextoAb = (rengF: string): string => rengSubindice(rengF)
export const rengDatoMasaAb = (rengF: string): readonly [string, string] => [`M(${rengTextoAb(rengF)})`, `${rengTx(rengMmAb(rengF), 5)} g/mol`]

const RENG_SUP: Readonly<Record<string, string>> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' }
export const rengSup = (rengN: number): string => String(rengN).split('').map((rengC) => RENG_SUP[rengC] ?? rengC).join('')
export const rengCientifico = (rengM: number, rengE: number): string => `${rengTx(rengM, 2)}·10${rengSup(-rengE)}`
export const rengValorCient = (rengM: number, rengE: number): number => rengM * 10 ** -rengE

export const rengRaizCuadratica = (rengK: number, rengC: number): number => (-rengK + Math.sqrt(rengK * rengK + 4 * rengK * rengC)) / 2
export const rengLog = (rengX: number): number => Math.log10(rengX)

export const RENG_HIDROXIDOS_1: readonly string[] = ['NaOH', 'KOH', 'LiOH']
export const RENG_HIDROXIDOS_2: readonly string[] = ['Ca(OH)2', 'Ba(OH)2', 'Sr(OH)2']
export const RENG_POLIPROTICOS_AB: ReadonlyArray<{ formula: string; nombre: string; eq: number }> = [
  { formula: 'H2SO4', nombre: 'ácido sulfúrico', eq: 2 },
  { formula: 'H2C2O4', nombre: 'ácido oxálico', eq: 2 },
  { formula: 'H3PO4', nombre: 'ácido fosfórico', eq: 3 }
]
export const RENG_ADUCTOS_AB: ReadonlyArray<{ base: string; acido: string }> = [
  { base: 'NH3', acido: 'BF3' },
  { base: 'C3H9N', acido: 'BF3' },
  { base: 'NH3', acido: 'AlCl3' },
  { base: 'H2O', acido: 'BF3' }
]
export const RENG_COMPLEJOS_AB: ReadonlyArray<{ ion: string; k: number }> = [
  { ion: 'Cu²⁺', k: 4 },
  { ion: 'Ag⁺', k: 2 },
  { ion: 'Zn²⁺', k: 4 },
  { ion: 'Ni²⁺', k: 6 },
  { ion: 'Co³⁺', k: 6 }
]
export const RENG_SALES_AMORTIGUADOR_AB: ReadonlyArray<{ formula: string; acido: string; pKa: number }> = [
  { formula: 'CH3COONa', acido: 'CH3COOH', pKa: 4.76 },
  { formula: 'HCOONa', acido: 'HCOOH', pKa: 3.75 },
  { formula: 'NaF', acido: 'HF', pKa: 3.17 }
]
export const RENG_REACCIONES_KP_AB: ReadonlyArray<{ texto: string; dn: number }> = [
  { texto: 'N₂O₄(g) ⇌ 2 NO₂(g)', dn: 1 },
  { texto: 'PCl₅(g) ⇌ PCl₃(g) + Cl₂(g)', dn: 1 },
  { texto: '2 SO₂(g) + O₂(g) ⇌ 2 SO₃(g)', dn: -1 },
  { texto: 'CO(g) + Cl₂(g) ⇌ COCl₂(g)', dn: -1 }
]
export const RENG_SALES_MX2_AB: readonly string[] = ['CaF2', 'MgF2', 'BaF2', 'SrF2', 'Mg(OH)2']
