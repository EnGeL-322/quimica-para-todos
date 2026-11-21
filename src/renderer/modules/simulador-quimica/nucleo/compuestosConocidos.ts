import { RENG_COMPUESTOS_BINARIOS, RENG_FUENTE_COMPUESTOS } from './compuestosBinarios'
import { rengAnalizarFormula, rengFormulaHill } from './formula'

export const RENG_FUENTE_DISOLUCION = 'N. N. Greenwood y A. Earnshaw, Chemistry of the Elements, 2.ª ed. (1997): solo existe en disolución acuosa'

const RENG_EXISTEN = [
  'NaOH', 'KOH', 'LiOH', 'Ca(OH)2', 'Mg(OH)2', 'Ba(OH)2', 'Sr(OH)2', 'Al(OH)3', 'Fe(OH)2', 'Fe(OH)3', 'Cu(OH)2', 'Zn(OH)2', 'Ni(OH)2', 'Co(OH)2', 'Mn(OH)2', 'Cr(OH)3', 'Pb(OH)2',
  'H2O2', 'Na2O2', 'K2O2', 'Li2O2', 'BaO2', 'AlH3',
  'Fe3O4', 'Pb3O4', 'Mn3O4', 'Co3O4',
  'P2O5',
  'HNO3', 'H2SO4', 'H3PO4', 'HClO4', 'HIO3', 'HIO4',
  'Na2SO4', 'K2SO4', 'Li2SO4', 'CuSO4', 'FeSO4', 'Fe2(SO4)3', 'Al2(SO4)3', 'MgSO4', 'CaSO4', 'ZnSO4', 'BaSO4', 'SrSO4', '(NH4)2SO4', 'Ag2SO4', 'PbSO4', 'NiSO4', 'CoSO4', 'MnSO4', 'Cr2(SO4)3',
  'Na2SO3', 'K2SO3', 'Na2S2O3',
  'NaNO3', 'KNO3', 'LiNO3', 'AgNO3', 'Pb(NO3)2', 'Cu(NO3)2', 'Ca(NO3)2', 'Mg(NO3)2', 'Ba(NO3)2', 'Sr(NO3)2', 'NH4NO3', 'Zn(NO3)2', 'Fe(NO3)3', 'Al(NO3)3', 'Hg2(NO3)2', 'Hg(NO3)2', 'Ni(NO3)2', 'Co(NO3)2',
  'NaNO2', 'KNO2',
  'Na2CO3', 'K2CO3', 'Li2CO3', 'CaCO3', 'MgCO3', 'BaCO3', 'SrCO3', 'ZnCO3', 'FeCO3', 'PbCO3', 'MnCO3', '(NH4)2CO3',
  'Na3PO4', 'K3PO4', 'Li3PO4', 'Ca3(PO4)2', '(NH4)3PO4', 'AlPO4', 'FePO4', 'Ag3PO4',
  'KClO3', 'NaClO3', 'KClO4', 'NaClO4', 'NH4ClO4', 'Mg(ClO4)2', 'NaClO', 'Ca(ClO)2', 'KBrO3', 'NaBrO3', 'KIO3', 'NaIO3', 'NaIO4', 'KIO4',
  'K2CrO4', 'Na2CrO4', 'K2Cr2O7', 'Na2Cr2O7', '(NH4)2Cr2O7', 'PbCrO4', 'Ag2CrO4', 'BaCrO4',
  'KMnO4', 'NaMnO4', 'K2MnO4', 'Na4SiO4',
  'NaHCO3', 'KHCO3', 'NH4HCO3', 'NaHSO4', 'KHSO4', 'NaH2PO4', 'Na2HPO4', 'KH2PO4', 'K2HPO4', '(NH4)2HPO4', 'NH4H2PO4',
  'CuSO4·5H2O', 'MgSO4·7H2O', 'CaSO4·2H2O', 'Na2CO3·10H2O', 'CoCl2·6H2O', 'FeSO4·7H2O', 'ZnSO4·7H2O', 'NiSO4·6H2O', 'BaCl2·2H2O', 'Na2S2O3·5H2O'
]

const RENG_EN_DISOLUCION = ['HClO', 'HClO2', 'HNO2', 'H2SO3', 'H2CO3', 'HBrO3', 'HClO3', 'Ca(HCO3)2', 'Mg(HCO3)2']

export type RengEstadoExistencia = 'confirmado' | 'disolucion' | 'no-confirmado'
export interface RengExistencia {
  estado: RengEstadoExistencia
  fuente: string | null
}

export function rengClaveExistencia(rengFormula: string): string {
  const [rengBase, ...rengAgua] = rengFormula.replace(/\s+/g, '').split('·')
  return `${rengFormulaHill(rengAnalizarFormula(rengBase!).atomos)}${rengAgua.length ? `·${rengAgua.join('·')}` : ''}`
}

let RENG_MAPA: Map<string, RengExistencia> | null = null

function rengMapa(): Map<string, RengExistencia> {
  if (RENG_MAPA) return RENG_MAPA
  RENG_MAPA = new Map()
  for (const rengC of RENG_COMPUESTOS_BINARIOS) RENG_MAPA.set(rengClaveExistencia(rengC.formula), { estado: 'confirmado', fuente: rengC.fuente })
  for (const rengF of RENG_EXISTEN) RENG_MAPA.set(rengClaveExistencia(rengF), { estado: 'confirmado', fuente: RENG_FUENTE_COMPUESTOS })
  for (const rengF of RENG_EN_DISOLUCION) RENG_MAPA.set(rengClaveExistencia(rengF), { estado: 'disolucion', fuente: RENG_FUENTE_DISOLUCION })
  return RENG_MAPA
}

export function rengExistencia(rengFormula: string): RengExistencia {
  return rengMapa().get(rengClaveExistencia(rengFormula)) ?? { estado: 'no-confirmado', fuente: null }
}

export const RENG_TEXTO_EXISTENCIA: Record<RengEstadoExistencia, string> = {
  confirmado: 'Existe',
  disolucion: 'Existe solo en disolución acuosa',
  'no-confirmado': 'Formulado por reglas, no confirmado que exista'
}
