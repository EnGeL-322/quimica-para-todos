import { RENG_PROCEDENCIA_DHF, RENG_PROCEDENCIA_F, RENG_S125, RENG_S161, RENG_S162, RENG_S164, RENG_S172, RENG_S173, RENG_S175, RENG_S176, RENG_S177, RENG_S51, RENG_S52, RENG_S53, RENG_S75, rengSeccionTermo } from '../aprender/n1/termo/comun'
import { RENG_PROCEDENCIA_MASAS, RENG_PROCEDENCIA_R } from '../aprender/n1/procedencia'
import type { RengProcedenciaN1, RengToleranciaN1 } from '../aprender/n1/tipos'
import { RENG_FARADAY } from '../datos/electroquimica'
import { rengMasaMolarDe } from '../nucleo/formula'
import { RENG_C_AGUA, RENG_R, rengEntalpiaReaccion, rengEntropiaReaccion, type RengReaccion } from '../nucleo/termoquimica'

export const RENG_TOL_TE: RengToleranciaN1 = { rel: 0.01, abs: 1e-9 }
export const RENG_TOL_TE_T: RengToleranciaN1 = { rel: 0.005, abs: 0.05 }
export const RENG_F_TE = RENG_FARADAY.valor
export const RENG_R_TE = RENG_R
export const RENG_C_AGUA_TE = RENG_C_AGUA
export const RENG_E_SIN_VERIFICAR = 'Los potenciales estándar de reducción son valores de uso común no contrastados con una fuente en esta entrega.'
export const RENG_C_AGUA_SIN_VERIFICAR = 'c(agua) = 4,184 J/(g·K) es el valor del núcleo de la app; no se contrastó con una fuente en esta entrega.'

const RENG_SECCIONES_TE = { '5.1': RENG_S51, '5.2': RENG_S52, '5.3': RENG_S53, '7.5': RENG_S75, '12.5': RENG_S125, '16.1': RENG_S161, '16.2': RENG_S162, '16.4': RENG_S164, '17.2': RENG_S172, '17.3': RENG_S173, '17.5': RENG_S175, '17.6': RENG_S176, '17.7': RENG_S177 } as const

export const rengFuentesTe = (rengSeccion: keyof typeof RENG_SECCIONES_TE, rengPara: string, ...rengExtra: ReadonlyArray<'masas' | 'r' | 'f' | 'dhf'>): readonly RengProcedenciaN1[] => [
  rengSeccionTermo(RENG_SECCIONES_TE[rengSeccion], rengPara),
  ...rengExtra.map((rengE) => ({ masas: RENG_PROCEDENCIA_MASAS, r: RENG_PROCEDENCIA_R, f: RENG_PROCEDENCIA_F, dhf: RENG_PROCEDENCIA_DHF })[rengE])
]

export const rengMmTe = (rengF: string): number => rengMasaMolarDe(rengF)

export interface RengParRedox {
  ion: string
  metal: string
  z: number
  E: number
}

export const RENG_PARES_TE: readonly RengParRedox[] = [
  { ion: 'Li⁺', metal: 'Li', z: 1, E: -3.04 },
  { ion: 'Mg²⁺', metal: 'Mg', z: 2, E: -2.37 },
  { ion: 'Al³⁺', metal: 'Al', z: 3, E: -1.66 },
  { ion: 'Zn²⁺', metal: 'Zn', z: 2, E: -0.76 },
  { ion: 'Fe²⁺', metal: 'Fe', z: 2, E: -0.44 },
  { ion: 'Ni²⁺', metal: 'Ni', z: 2, E: -0.26 },
  { ion: 'Cu²⁺', metal: 'Cu', z: 2, E: 0.34 },
  { ion: 'Ag⁺', metal: 'Ag', z: 1, E: 0.8 }
]

export const RENG_DEPOSITOS_TE: readonly RengParRedox[] = RENG_PARES_TE.filter((rengP) => ['Ni', 'Cu', 'Ag', 'Zn'].includes(rengP.metal))
export const RENG_SACRIFICIO_TE: readonly RengParRedox[] = RENG_PARES_TE.filter((rengP) => ['Zn', 'Mg', 'Al'].includes(rengP.metal))
export const RENG_ANODOS_TE: readonly RengParRedox[] = RENG_PARES_TE.filter((rengP) => ['Zn', 'Fe', 'Ni', 'Al', 'Mg'].includes(rengP.metal))

export interface RengReaccionTe {
  texto: string
  reaccion: RengReaccion
  combustible: string
  producto: string
  nuProducto: number
}

const rengRx = (rengTexto: string, rengR: RengReaccion, rengComb: string, rengProd: string, rengNu: number): RengReaccionTe => ({ texto: rengTexto, reaccion: rengR, combustible: rengComb, producto: rengProd, nuProducto: rengNu })

export const RENG_REACCIONES_TE: readonly RengReaccionTe[] = [
  rengRx('CH₄ + 2 O₂ → CO₂ + 2 H₂O(l)', { reactivos: [{ id: 'CH4', nu: 1 }, { id: 'O2', nu: 2 }], productos: [{ id: 'CO2', nu: 1 }, { id: 'H2O_l', nu: 2 }] }, 'CH4', 'H2O', 2),
  rengRx('C₂H₅OH + 3 O₂ → 2 CO₂ + 3 H₂O(l)', { reactivos: [{ id: 'C2H5OH', nu: 1 }, { id: 'O2', nu: 3 }], productos: [{ id: 'CO2', nu: 2 }, { id: 'H2O_l', nu: 3 }] }, 'C2H5OH', 'CO2', 2),
  rengRx('2 H₂ + O₂ → 2 H₂O(l)', { reactivos: [{ id: 'H2', nu: 2 }, { id: 'O2', nu: 1 }], productos: [{ id: 'H2O_l', nu: 2 }] }, 'H2', 'H2O', 2),
  rengRx('C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O(l)', { reactivos: [{ id: 'glucosa', nu: 1 }, { id: 'O2', nu: 6 }], productos: [{ id: 'CO2', nu: 6 }, { id: 'H2O_l', nu: 6 }] }, 'C6H12O6', 'CO2', 6)
]
export const rengDhTe = (rengI: number): number => rengEntalpiaReaccion(RENG_REACCIONES_TE[rengI]!.reaccion)
export const rengNuCombustible = (rengI: number): number => RENG_REACCIONES_TE[rengI]!.reaccion.reactivos[0]!.nu

export const RENG_REACCIONES_S_TE: ReadonlyArray<{ texto: string; reaccion: RengReaccion }> = [
  { texto: 'N₂ + 3 H₂ → 2 NH₃', reaccion: { reactivos: [{ id: 'N2', nu: 1 }, { id: 'H2', nu: 3 }], productos: [{ id: 'NH3', nu: 2 }] } },
  { texto: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O(l)', reaccion: RENG_REACCIONES_TE[0]!.reaccion },
  { texto: '2 H₂ + O₂ → 2 H₂O(l)', reaccion: RENG_REACCIONES_TE[2]!.reaccion }
]
export const rengDhSTe = (rengI: number): number => rengEntalpiaReaccion(RENG_REACCIONES_S_TE[rengI]!.reaccion)
export const rengDsSTe = (rengI: number): number => rengEntropiaReaccion(RENG_REACCIONES_S_TE[rengI]!.reaccion)!

export const RENG_HIDROCARBUROS_TE: ReadonlyArray<{ formula: string; x: number; y: number }> = [
  { formula: 'CH₄', x: 1, y: 4 },
  { formula: 'C₂H₆', x: 2, y: 6 },
  { formula: 'C₃H₈', x: 3, y: 8 },
  { formula: 'C₂H₄', x: 2, y: 4 },
  { formula: 'C₄H₁₀', x: 4, y: 10 }
]
export const RENG_DHF_CO2 = -393.509
export const RENG_DHF_H2O = -285.8

export const RENG_SALES_DISOLUCION_TE: ReadonlyArray<{ formula: string; signo: number }> = [
  { formula: 'NH4NO3', signo: -1 },
  { formula: 'KNO3', signo: -1 },
  { formula: 'NH4Cl', signo: -1 },
  { formula: 'CaCl2', signo: 1 },
  { formula: 'NaOH', signo: 1 }
]
