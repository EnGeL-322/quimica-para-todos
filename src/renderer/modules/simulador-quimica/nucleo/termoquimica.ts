export const RENG_R = 8.314462618

export interface RengDatoTermo {
  id: string
  formula: string
  nombre: string
  fase: 's' | 'l' | 'g'
  dHf: number
  S?: number
  fuenteH: string
  verificacionH: 'consultada' | 'libro'
}

const RENG_WP = 'Wikipedia «Standard enthalpy of formation»'
export const RENG_DATOS_TERMO: readonly RengDatoTermo[] = [
  { id: 'O2', formula: 'O₂', nombre: 'oxígeno', fase: 'g', dHf: 0, S: 205.15, fuenteH: 'Elemento en su estado estándar: 0 por definición', verificacionH: 'consultada' },
  { id: 'H2', formula: 'H₂', nombre: 'hidrógeno', fase: 'g', dHf: 0, S: 130.68, fuenteH: 'Elemento en su estado estándar: 0 por definición', verificacionH: 'consultada' },
  { id: 'N2', formula: 'N₂', nombre: 'nitrógeno', fase: 'g', dHf: 0, S: 191.61, fuenteH: 'Elemento en su estado estándar: 0 por definición', verificacionH: 'consultada' },
  { id: 'H2O_l', formula: 'H₂O', nombre: 'agua líquida', fase: 'l', dHf: -285.8, S: 69.91, fuenteH: RENG_WP, verificacionH: 'consultada' },
  { id: 'H2O_g', formula: 'H₂O', nombre: 'vapor de agua', fase: 'g', dHf: -241.818, S: 188.83, fuenteH: RENG_WP, verificacionH: 'consultada' },
  { id: 'CO2', formula: 'CO₂', nombre: 'dióxido de carbono', fase: 'g', dHf: -393.509, S: 213.79, fuenteH: RENG_WP, verificacionH: 'consultada' },
  { id: 'CH4', formula: 'CH₄', nombre: 'metano', fase: 'g', dHf: -74.9, S: 186.26, fuenteH: RENG_WP + ' (la página da −74,9 y −74,8)', verificacionH: 'consultada' },
  { id: 'C2H5OH', formula: 'C₂H₅OH', nombre: 'etanol líquido', fase: 'l', dHf: -277.0, fuenteH: RENG_WP, verificacionH: 'consultada' },
  { id: 'NH3', formula: 'NH₃', nombre: 'amoníaco', fase: 'g', dHf: -46.1, S: 192.77, fuenteH: RENG_WP, verificacionH: 'consultada' },
  { id: 'HCl', formula: 'HCl', nombre: 'cloruro de hidrógeno', fase: 'g', dHf: -92.3, fuenteH: RENG_WP, verificacionH: 'consultada' },
  { id: 'NaCl', formula: 'NaCl', nombre: 'cloruro de sodio', fase: 's', dHf: -411.12, fuenteH: RENG_WP, verificacionH: 'consultada' },
  { id: 'glucosa', formula: 'C₆H₁₂O₆', nombre: 'glucosa sólida', fase: 's', dHf: -1271, fuenteH: RENG_WP + ' (redondeada a 1 kJ/mol)', verificacionH: 'consultada' }
]

const rengPorId = new Map(RENG_DATOS_TERMO.map((rengD) => [rengD.id, rengD]))
export const rengDatoTermo = (rengId: string): RengDatoTermo => {
  const rengD = rengPorId.get(rengId)
  if (!rengD) throw new RangeError(`sin datos termodinámicos para «${rengId}»`)
  return rengD
}

export interface RengTermino {
  id: string
  nu: number
}
export interface RengReaccion {
  reactivos: RengTermino[]
  productos: RengTermino[]
}

export function rengEntalpiaReaccion(rengR: RengReaccion): number {
  const rengSuma = (rengTs: RengTermino[]): number => rengTs.reduce((rengS, rengT) => rengS + rengT.nu * rengDatoTermo(rengT.id).dHf, 0)
  return rengSuma(rengR.productos) - rengSuma(rengR.reactivos)
}

export function rengEntropiaReaccion(rengR: RengReaccion): number | null {
  let rengTotal = 0
  for (const [rengSigno, rengTs] of [[1, rengR.productos], [-1, rengR.reactivos]] as const)
    for (const rengT of rengTs) {
      const RENG_S = rengDatoTermo(rengT.id).S
      if (RENG_S === undefined) return null
      rengTotal += rengSigno * rengT.nu * RENG_S
    }
  return rengTotal
}

export const rengEnergiaLibre = (rengDH: number, rengDS: number, RENG_T: number): number => rengDH - (RENG_T * rengDS) / 1000

export const rengConstanteDeG = (rengDG: number, RENG_T: number): number => Math.exp((-rengDG * 1000) / (RENG_R * RENG_T))

export const rengVanTHoff = (RENG_K1: number, RENG_T1: number, RENG_T2: number, rengDH: number): number => RENG_K1 * Math.exp((-rengDH * 1000 / RENG_R) * (1 / RENG_T2 - 1 / RENG_T1))

export const rengCalorLiberado = (rengDHrxn: number, rengNu: number, rengMol: number): number => -(rengDHrxn * rengMol) / rengNu

export const RENG_C_AGUA = 4.184
export const rengAumentoTemperaturaAgua = (rengQKJ: number, rengMasaG: number): number => (rengQKJ * 1000) / (rengMasaG * RENG_C_AGUA)
