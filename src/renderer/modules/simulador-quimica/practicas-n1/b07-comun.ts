import { rengSeccionEsteq } from '../aprender/n1/estequiometria/lecciones-a'
import { RENG_PROCEDENCIA_MASAS, RENG_PROCEDENCIA_NA_KB, RENG_PROCEDENCIA_R } from '../aprender/n1/procedencia'
import type { RengProcedenciaN1, RengToleranciaN1 } from '../aprender/n1/tipos'
import { rengAjustarEcuacion } from '../nucleo/ajuste'
import { rengAnalizarFormula, rengMasaMolarDe, rengSubindice } from '../nucleo/formula'
import { rengPorSimbolo } from '../../tabla-periodica/data'
import { rengTx } from '../aprender/n1/gases/constantes'

export const RENG_TOL_EST: RengToleranciaN1 = { rel: 0.01, abs: 1e-9 }
export const RENG_TOL_PCT: RengToleranciaN1 = { rel: 0.01, abs: 0.05 }

export const rengFuentesEst = (rengSeccion: '3.1' | '3.2' | '4.3' | '4.4' | '4.5', rengPara: string, ...rengExtra: ReadonlyArray<'masas' | 'na' | 'r'>): readonly RengProcedenciaN1[] => {
  const rengTitulos = { '3.1': '3.1 Formula Mass and the Mole Concept', '3.2': '3.2 Determining Empirical and Molecular Formulas', '4.3': '4.3 Reaction Stoichiometry', '4.4': '4.4 Reaction Yields', '4.5': '4.5 Quantitative Chemical Analysis' }
  const rengMapa = { masas: RENG_PROCEDENCIA_MASAS, na: RENG_PROCEDENCIA_NA_KB, r: RENG_PROCEDENCIA_R }
  return [rengSeccionEsteq(rengTitulos[rengSeccion], rengPara), ...rengExtra.map((rengE) => rengMapa[rengE])]
}

export const rengMmEst = (rengF: string): number => rengMasaMolarDe(rengF)
export const rengTexto = (rengF: string): string => rengSubindice(rengF)
export const rengAtomosDe = (rengF: string): Map<string, number> => rengAnalizarFormula(rengF).atomos
export const rengMasaAt = (rengEl: string): number => rengPorSimbolo.get(rengEl)!.masa
export const rengNumeroAtomico = (rengEl: string): number => rengPorSimbolo.get(rengEl)!.z
export const rengMasaSinSubindices = (rengF: string): number => [...rengAtomosDe(rengF).keys()].reduce((rengS, rengEl) => rengS + rengMasaAt(rengEl), 0)
export const rengMasaConZ = (rengF: string): number => [...rengAtomosDe(rengF).entries()].reduce((rengS, [rengEl, rengN]) => rengS + rengNumeroAtomico(rengEl) * rengN, 0)
export const rengDatoMasa = (rengF: string): readonly [string, string] => [`M(${rengTexto(rengF)})`, `${rengTx(rengMmEst(rengF), 5)} g/mol`]
export const rengTextoMasasAt = (rengF: string): string => [...rengAtomosDe(rengF).keys()].map((rengEl) => `${rengEl} ${rengTx(rengMasaAt(rengEl), 5)}`).join(' · ')

export const RENG_COMPUESTOS_MOLECULARES = ['H2O', 'CO2', 'NH3', 'CH4', 'C2H6', 'C3H8', 'C6H12O6', 'C2H5OH', 'H2SO4', 'HNO3', 'C12H22O11', 'CH3COOH', 'SO2', 'N2O', 'C6H6'] as const
export const RENG_COMPUESTOS_IONICOS = ['NaCl', 'CaCl2', 'K2SO4', 'MgO', 'Al2O3', 'Ca3(PO4)2', 'Na2CO3', 'KNO3', 'CaF2', 'FeCl3', 'NH4Cl', 'Mg(OH)2', 'Ca(OH)2', 'Al2(SO4)3'] as const
export const RENG_COMPUESTOS_MASA = [...RENG_COMPUESTOS_MOLECULARES, ...RENG_COMPUESTOS_IONICOS] as const

export const RENG_HIDRATOS: ReadonlyArray<readonly [anhidro: string, agua: number]> = [['CuSO4', 5], ['MgSO4', 7], ['CaSO4', 2], ['Na2CO3', 10], ['CoCl2', 6], ['BaCl2', 2]]
export const rengTextoHidrato = (rengH: readonly [string, number]): string => `${rengTexto(rengH[0])}·${rengH[1]}H₂O`

export interface RengEspecieReaccion {
  formula: string
  texto: string
  coef: number
}

export interface RengReaccionEst {
  clave: string
  texto: string
  reactivos: readonly RengEspecieReaccion[]
  productos: readonly RengEspecieReaccion[]
}

function rengReaccion(rengEcuacion: string): RengReaccionEst {
  const rengA = rengAjustarEcuacion(rengEcuacion)
  const rengEsp = (rengT: (typeof rengA.reactivos)[number]): RengEspecieReaccion => ({ formula: rengT.entrada, texto: rengTexto(rengT.entrada), coef: rengT.coef })
  return { clave: rengEcuacion, texto: rengA.texto, reactivos: rengA.reactivos.map(rengEsp), productos: rengA.productos.map(rengEsp) }
}

export const RENG_REACCIONES_EST: readonly RengReaccionEst[] = [
  'H2 + O2 = H2O',
  'N2 + H2 = NH3',
  'CH4 + O2 = CO2 + H2O',
  'C3H8 + O2 = CO2 + H2O',
  'Mg + O2 = MgO',
  'Fe2O3 + CO = Fe + CO2',
  'Fe + O2 = Fe2O3',
  'C2H6 + O2 = CO2 + H2O',
  'C2H5OH + O2 = CO2 + H2O',
  'Zn + HCl = ZnCl2 + H2',
  'CaCO3 + HCl = CaCl2 + H2O + CO2',
  'Al + O2 = Al2O3'
].map(rengReaccion)

export const RENG_REACCIONES_DOS_REACTIVOS = RENG_REACCIONES_EST.filter((rengR) => rengR.reactivos.length === 2)
export const RENG_COMBUSTIONES = RENG_REACCIONES_EST.filter((rengR) => rengR.reactivos.some((rengE) => rengE.formula === 'O2') && rengR.productos.some((rengE) => rengE.formula === 'CO2'))

export const RENG_REACCIONES_GAS: ReadonlyArray<{ reaccion: RengReaccionEst; solido: string; gas: string }> = [
  { reaccion: rengReaccion('Zn + HCl = ZnCl2 + H2'), solido: 'Zn', gas: 'H2' },
  { reaccion: rengReaccion('Mg + HCl = MgCl2 + H2'), solido: 'Mg', gas: 'H2' },
  { reaccion: rengReaccion('CaCO3 + HCl = CaCl2 + H2O + CO2'), solido: 'CaCO3', gas: 'CO2' },
  { reaccion: rengReaccion('NaHCO3 = Na2CO3 + H2O + CO2'), solido: 'NaHCO3', gas: 'CO2' },
  { reaccion: rengReaccion('CaCO3 = CaO + CO2'), solido: 'CaCO3', gas: 'CO2' }
]

export const rengCoefDe = (rengR: RengReaccionEst, rengF: string): number => [...rengR.reactivos, ...rengR.productos].find((rengE) => rengE.formula === rengF)!.coef
export const rengTextoDe = (rengF: string): string => rengTexto(rengF)

export const RENG_OXIDOS_METAL: ReadonlyArray<{ oxido: string; metal: string }> = [
  { oxido: 'Fe2O3', metal: 'Fe' },
  { oxido: 'Fe3O4', metal: 'Fe' },
  { oxido: 'CuO', metal: 'Cu' },
  { oxido: 'Cu2O', metal: 'Cu' },
  { oxido: 'ZnO', metal: 'Zn' },
  { oxido: 'Al2O3', metal: 'Al' },
  { oxido: 'SnO2', metal: 'Sn' }
]

export const RENG_EMPIRICAS: ReadonlyArray<readonly [formula: string, c: number, h: number, o: number]> = [
  ['CH2O', 1, 2, 1],
  ['C2H6O', 2, 6, 1],
  ['C3H8O', 3, 8, 1],
  ['CH4O', 1, 4, 1],
  ['C2H4O', 2, 4, 1],
  ['C3H6O', 3, 6, 1],
  ['C4H10O', 4, 10, 1],
  ['C2H3O', 2, 3, 1],
  ['C3H4O3', 3, 4, 3],
  ['C4H8O2', 4, 8, 2]
]

export const RENG_HIDROCARBUROS: ReadonlyArray<readonly [formula: string, c: number, h: number]> = [
  ['CH4', 1, 4], ['C2H6', 2, 6], ['C3H8', 3, 8], ['C2H4', 2, 4], ['C3H6', 3, 6], ['C2H2', 2, 2], ['C4H10', 4, 10], ['C6H6', 6, 6], ['C7H8', 7, 8], ['C8H18', 8, 18], ['C5H12', 5, 12], ['C3H4', 3, 4]
]
