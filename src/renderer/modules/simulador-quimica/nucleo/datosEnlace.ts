const RENG_EV = 1.602176634e-19
const RENG_NA = 6.02214076e23
const RENG_C = 299792458
const RENG_U = 1.6605390666e-27
const RENG_H = 6.62607015e-34
export const RENG_KJMOL_POR_EV = (RENG_EV * RENG_NA) / 1000
export const RENG_COULOMB_KJ_A = (8.9875517923e9 * RENG_EV * RENG_EV * RENG_NA) / 1000 / 1e-10

export interface RengDatoConFuente<RengT> {
  valor: RengT
  fuente: string
}

const RENG_NIST_ASD = 'NIST Atomic Spectra Database, energías de ionización (Kramida et al.)'
const RENG_CRC_AE = 'CRC Handbook of Chemistry and Physics, «Electron Affinities»'
const RENG_SHANNON = 'R. D. Shannon, Acta Crystallogr. A 1976, 32, 751 (radios iónicos efectivos)'
const RENG_CRC_RED = 'CRC Handbook of Chemistry and Physics, «Crystal Structures and Lattice Parameters»'

export const RENG_IONIZACION_EV: Record<string, RengDatoConFuente<number[]>> = {
  Na: { valor: [5.139076], fuente: RENG_NIST_ASD },
  Mg: { valor: [7.646235, 15.035267], fuente: RENG_NIST_ASD },
  Ca: { valor: [6.11316, 11.87172], fuente: RENG_NIST_ASD },
  Cs: { valor: [3.893905], fuente: RENG_NIST_ASD }
}

export const RENG_AFINIDAD_EV: Record<string, RengDatoConFuente<number>> = {
  Cl: { valor: 3.612725, fuente: RENG_CRC_AE },
  F: { valor: 3.4011898, fuente: RENG_CRC_AE },
  O: { valor: 1.4611053, fuente: RENG_CRC_AE }
}

export const RENG_RADIO_IONICO: Record<string, RengDatoConFuente<{ r: number; nc: number }>> = {
  'Na+': { valor: { r: 1.02, nc: 6 }, fuente: RENG_SHANNON },
  'Mg2+': { valor: { r: 0.72, nc: 6 }, fuente: RENG_SHANNON },
  'Ca2+': { valor: { r: 1.12, nc: 8 }, fuente: RENG_SHANNON },
  'Cs+': { valor: { r: 1.74, nc: 8 }, fuente: RENG_SHANNON },
  'Ti4+': { valor: { r: 0.605, nc: 6 }, fuente: RENG_SHANNON },
  'Cl-': { valor: { r: 1.81, nc: 6 }, fuente: RENG_SHANNON },
  'O2-': { valor: { r: 1.4, nc: 6 }, fuente: RENG_SHANNON },
  'F-': { valor: { r: 1.31, nc: 4 }, fuente: RENG_SHANNON }
}

export const RENG_PARAMETRO_RED: Record<string, RengDatoConFuente<number>> = {
  NaCl: { valor: 5.64, fuente: RENG_CRC_RED },
  MgO: { valor: 4.211, fuente: RENG_CRC_RED },
  CaF2: { valor: 5.463, fuente: RENG_CRC_RED },
  CsCl: { valor: 4.123, fuente: RENG_CRC_RED },
  TiO2: { valor: 4.594, fuente: RENG_CRC_RED },
  TiO2c: { valor: 2.959, fuente: RENG_CRC_RED },
  Na: { valor: 4.2906, fuente: RENG_CRC_RED },
  Cu: { valor: 3.6149, fuente: RENG_CRC_RED },
  Fe: { valor: 2.8665, fuente: RENG_CRC_RED },
  Au: { valor: 4.0782, fuente: RENG_CRC_RED },
  Ag: { valor: 4.0862, fuente: RENG_CRC_RED },
  Al: { valor: 4.0495, fuente: RENG_CRC_RED }
}

export const rengEnergiaCoulombPar = (rengQ1: number, rengQ2: number, rengR: number): number => (RENG_COULOMB_KJ_A * rengQ1 * rengQ2) / rengR

export interface RengDiatomica {
  formula: string
  re: number
  we: number
  D0: number
  mu: number
  fuente: string
}

const RENG_HH = 'K. P. Huber y G. Herzberg, Constants of Diatomic Molecules (1979), vía NIST Chemistry WebBook'

export const RENG_DIATOMICAS: Record<string, RengDiatomica> = {
  H2: { formula: 'H2', re: 0.74144, we: 4401.21, D0: 4.4781, mu: 1.00782503 / 2, fuente: RENG_HH },
  HCl: { formula: 'HCl', re: 1.27455, we: 2990.946, D0: 4.4336, mu: (1.00782503 * 34.96885268) / (1.00782503 + 34.96885268), fuente: RENG_HH },
  Cl2: { formula: 'Cl2', re: 1.9879, we: 559.72, D0: 2.4794, mu: 34.96885268 / 2, fuente: RENG_HH },
  O2: { formula: 'O2', re: 1.20752, we: 1580.193, D0: 5.1156, mu: 15.99491462 / 2, fuente: RENG_HH },
  N2: { formula: 'N2', re: 1.09768, we: 2358.57, D0: 9.759, mu: 14.003074 / 2, fuente: RENG_HH }
}

const RENG_CCCBDB = 'NIST Computational Chemistry Comparison and Benchmark Database (CCCBDB), geometrías experimentales'

export const RENG_GEOMETRIAS: Record<string, RengDatoConFuente<{ enlaces: Record<string, number>; angulos?: Record<string, number> }>> = {
  C2H4: { valor: { enlaces: { 'C=C': 1.339, 'C–H': 1.087 }, angulos: { 'H–C–H': 117.4 } }, fuente: RENG_CCCBDB },
  C2H2: { valor: { enlaces: { 'C≡C': 1.203, 'C–H': 1.063 } }, fuente: RENG_CCCBDB },
  NH3: { valor: { enlaces: { 'N–H': 1.012 }, angulos: { 'H–N–H': 106.7 } }, fuente: RENG_CCCBDB },
  H2O: { valor: { enlaces: { 'O–H': 0.9572 }, angulos: { 'H–O–H': 104.52 } }, fuente: RENG_CCCBDB },
  BF3: { valor: { enlaces: { 'B–F': 1.307 }, angulos: { 'F–B–F': 120 } }, fuente: RENG_CCCBDB }
}

export const RENG_ENERGIAS_INTERACCION: Record<string, RengDatoConFuente<number | null> & { nombre: string; nota?: string }> = {
  covalenteOH: {
    nombre: 'Enlace covalente O–H (HO–H)',
    valor: 497.1,
    fuente: 'CRC Handbook of Chemistry and Physics, «Bond Dissociation Energies» (D₂₉₈ de HO–H)'
  },
  puenteH: {
    nombre: 'Puente de hidrógeno (dímero de agua)',
    valor: 13.2,
    fuente: 'B. E. Rocher-Casterline et al., J. Chem. Phys. 2011, 134, 211101 (D₀ = 1105 cm⁻¹)'
  },
  dipoloHCl: {
    nombre: 'Dipolo-dipolo (HCl···HCl)',
    valor: null,
    fuente: 'Sin valor verificado en la app',
    nota: 'Más débil que el puente de hidrógeno y más fuerte que la dispersión entre átomos de argón; no se muestra un número sin fuente fiable.'
  },
  londonAr: {
    nombre: 'Dispersión de London (Ar···Ar)',
    valor: 1.19,
    fuente: 'R. A. Aziz, J. Chem. Phys. 1993, 99, 4518 (profundidad del pozo ε/k ≈ 143 K)'
  }
}

export const RENG_DISTANCIAS_INTER: Record<string, RengDatoConFuente<number>> = {
  'O···O (dímero de agua)': { valor: 2.976, fuente: 'T. R. Dyke, K. M. Mack y J. S. Muenter, J. Chem. Phys. 1977, 66, 498' },
  'Ar···Ar (mínimo)': { valor: 3.757, fuente: 'R. A. Aziz, J. Chem. Phys. 1993, 99, 4518' }
}

export const RENG_EBULLICION_C: Record<string, RengDatoConFuente<number>> = {
  H2O: { valor: 100.0, fuente: 'CRC Handbook of Chemistry and Physics, «Physical Constants of Inorganic Compounds»' },
  H2S: { valor: -59.55, fuente: 'CRC Handbook of Chemistry and Physics, «Physical Constants of Inorganic Compounds»' },
  HCl: { valor: -85.05, fuente: 'CRC Handbook of Chemistry and Physics, «Physical Constants of Inorganic Compounds»' },
  Ar: { valor: -185.85, fuente: 'CRC Handbook of Chemistry and Physics, «Physical Constants of Inorganic Compounds»' }
}

export interface RengParametrosMorse {
  re: number
  De: number
  D0: number
  a: number
}

export function rengParametrosMorse(rengD: RengDiatomica): RengParametrosMorse {
  const rengZpeEV = (RENG_H * RENG_C * rengD.we * 100) / 2 / RENG_EV
  const RengDeEV = rengD.D0 + rengZpeEV
  const rengA = 2 * Math.PI * RENG_C * (rengD.we * 100) * Math.sqrt((rengD.mu * RENG_U) / (2 * RengDeEV * RENG_EV)) * 1e-10
  return { re: rengD.re, De: RengDeEV * RENG_KJMOL_POR_EV, D0: rengD.D0 * RENG_KJMOL_POR_EV, a: rengA }
}

export function rengMorse(rengP: RengParametrosMorse, rengR: number): number {
  const rengX = 1 - Math.exp(-rengP.a * (rengR - rengP.re))
  return rengP.De * rengX * rengX - rengP.De
}
