import { type RengAjuste } from './ajuste'
import { rengMasaMolarDe, rengSuperindice } from './formula'

export const RENG_NA = 6.02214076e23
export const RENG_KB = 1.380649e-23
export const RENG_R = RENG_NA * RENG_KB
export const RENG_R_LATM = RENG_R / 101.325
export const RENG_VM_CN = 22.41396954
export const RENG_VM_STP_IUPAC = 22.71095464

export type RengUnidadPresion = 'Pa' | 'kPa' | 'atm' | 'bar' | 'mmHg'
export const RENG_PRESION: Record<RengUnidadPresion, number> = { Pa: 1, kPa: 1000, atm: 101325, bar: 1e5, mmHg: 101325 / 760 }
export type RengUnidadVolumen = 'L' | 'mL' | 'm3' | 'cm3'
export const RENG_VOLUMEN: Record<RengUnidadVolumen, number> = { L: 1, mL: 1e-3, m3: 1000, cm3: 1e-3 }
export type RengUnidadTemperatura = 'K' | 'C' | 'F'

export function rengAKelvin(rengT: number, rengU: RengUnidadTemperatura): number {
  const rengK = rengU === 'K' ? rengT : rengU === 'C' ? rengT + 273.15 : ((rengT - 32) * 5) / 9 + 273.15
  if (!(rengK > 0)) throw new Error('La temperatura absoluta debe ser mayor que 0 K.')
  return rengK
}
export const rengDesdeKelvin = (rengK: number, rengU: RengUnidadTemperatura): number => (rengU === 'K' ? rengK : rengU === 'C' ? rengK - 273.15 : ((rengK - 273.15) * 9) / 5 + 32)

export function rengMolesDesdeMasa(rengMasa_g: number, rengFormula: string): number {
  if (!(rengMasa_g >= 0)) throw new Error('La masa no puede ser negativa.')
  return rengMasa_g / rengMasaMolarDe(rengFormula)
}
export const rengMasaDesdeMoles = (rengN: number, rengFormula: string): number => rengN * rengMasaMolarDe(rengFormula)
export const rengParticulas = (rengN: number): number => rengN * RENG_NA
export function rengMasaPura(rengMasaMuestra: number, rengPurezaPct: number): number {
  if (!(rengPurezaPct > 0 && rengPurezaPct <= 100)) throw new Error('La pureza debe estar entre 0 y 100 %.')
  return (rengMasaMuestra * rengPurezaPct) / 100
}
export function rengRendimientoPorcentual(rengReal: number, rengTeorico: number): number {
  if (!(rengTeorico > 0)) throw new Error('El rendimiento teórico debe ser positivo.')
  return (100 * rengReal) / rengTeorico
}

export interface RengCantidadReactivo {
  indice: number
  moles: number
}

export interface RengResultadoLimitante {
  limitante: number
  avance: number
  reactivos: Array<{ entrada: string; inicial: number; consumido: number; sobrante: number; masaSobrante: number }>
  productos: Array<{ entrada: string; moles: number; masa: number }>
  pasos: string[]
}

export function rengReactivoLimitante(rengAjuste: RengAjuste, rengCantidades: RengCantidadReactivo[]): RengResultadoLimitante {
  if (rengCantidades.length === 0) throw new Error('Indica la cantidad de al menos un reactivo.')
  const rengPasos: string[] = []
  let rengAvance = Infinity
  let rengLimitante = -1
  for (const rengC of rengCantidades) {
    const rengT = rengAjuste.reactivos[rengC.indice]
    if (!rengT) throw new Error('Reactivo fuera de rango.')
    if (!(rengC.moles >= 0) || !Number.isFinite(rengC.moles)) throw new Error(`Cantidad no válida para ${rengT.entrada}.`)
    const rengX = rengC.moles / rengT.coef
    rengPasos.push(`${rengT.entrada}: ${rengFmt(rengC.moles)} mol ÷ ${rengT.coef} = ${rengFmt(rengX)} mol de reacción`)
    if (rengX < rengAvance) {
      rengAvance = rengX
      rengLimitante = rengC.indice
    }
  }
  rengPasos.push(`Limitante: ${rengAjuste.reactivos[rengLimitante]?.entrada} (el menor cociente, ξ = ${rengFmt(rengAvance)} mol).`)
  const rengReactivos = rengAjuste.reactivos.map((rengT, rengI) => {
    const rengDada = rengCantidades.find((rengC) => rengC.indice === rengI)
    const rengConsumido = rengT.coef * rengAvance
    const rengInicial = rengDada ? rengDada.moles : NaN
    const rengSobrante = rengDada ? Math.max(0, rengInicial - rengConsumido) : NaN
    return { entrada: rengT.entrada, inicial: rengInicial, consumido: rengConsumido, sobrante: rengSobrante, masaSobrante: rengSobrante * rengMasaMolarDe(rengT.formula) }
  })
  const rengProductos = rengAjuste.productos.map((rengT) => {
    const rengMoles = rengT.coef * rengAvance
    return { entrada: rengT.entrada, moles: rengMoles, masa: rengT.formula.electron ? 0 : rengMoles * rengMasaMolarDe(rengT.formula) }
  })
  for (const rengP of rengProductos) rengPasos.push(`${rengP.entrada}: ${rengFmt(rengP.moles)} mol → ${rengFmt(rengP.masa)} g (rendimiento teórico)`)
  return { limitante: rengLimitante, avance: rengAvance, reactivos: rengReactivos, productos: rengProductos, pasos: rengPasos }
}

export interface RengEstadoGas {
  P?: number
  V?: number
  n?: number
  T?: number
}

export function rengGasIdeal(rengE: RengEstadoGas): Required<RengEstadoGas> & { incognita: keyof RengEstadoGas } {
  const rengFaltan = (['P', 'V', 'n', 'T'] as const).filter((rengK) => rengE[rengK] === undefined)
  if (rengFaltan.length !== 1) throw new Error('Deja vacía exactamente una de las cuatro variables (P, V, n, T).')
  for (const rengK of ['P', 'V', 'n', 'T'] as const) if (rengE[rengK] !== undefined && !((rengE[rengK] as number) > 0)) throw new Error(`${rengK} debe ser positiva.`)
  const RengRl = RENG_R
  const { P: RENG_P, V: RENG_V, n: rengN, T: RENG_T } = rengE
  const rengInc = rengFaltan[0] as keyof RengEstadoGas
  if (rengInc === 'P') return { P: (rengN! * RengRl * RENG_T!) / (RENG_V! / 1000), V: RENG_V!, n: rengN!, T: RENG_T!, incognita: rengInc }
  if (rengInc === 'V') return { P: RENG_P!, V: ((rengN! * RengRl * RENG_T!) / RENG_P!) * 1000, n: rengN!, T: RENG_T!, incognita: rengInc }
  if (rengInc === 'n') return { P: RENG_P!, V: RENG_V!, n: (RENG_P! * (RENG_V! / 1000)) / (RengRl * RENG_T!), T: RENG_T!, incognita: rengInc }
  return { P: RENG_P!, V: RENG_V!, n: rengN!, T: (RENG_P! * (RENG_V! / 1000)) / (rengN! * RengRl), incognita: rengInc }
}

export const rengDensidadGas = (RengP_Pa: number, RENG_M: number, RENG_T: number): number => (RengP_Pa * RENG_M) / (RENG_R * RENG_T) / 1000

export const rengMolaridad = (rengN: number, RENG_V_L: number): number => {
  if (!(RENG_V_L > 0)) throw new Error('El volumen debe ser positivo.')
  return rengN / RENG_V_L
}
export const rengMolalidad = (rengN: number, rengKgDisolvente: number): number => {
  if (!(rengKgDisolvente > 0)) throw new Error('La masa de disolvente debe ser positiva.')
  return rengN / rengKgDisolvente
}
export const rengNormalidad = (RENG_M: number, rengEquivalentesPorMol: number): number => RENG_M * rengEquivalentesPorMol
export const rengPorcentajeMasa = (rengMasaSoluto: number, rengMasaDisolucion: number): number => (100 * rengMasaSoluto) / rengMasaDisolucion
export const rengPorcentajeMasaVolumen = (rengMasaSoluto_g: number, rengVolumen_mL: number): number => (100 * rengMasaSoluto_g) / rengVolumen_mL
export const rengPpm = (rengMasaSoluto_g: number, rengMasaDisolucion_g: number): number => (1e6 * rengMasaSoluto_g) / rengMasaDisolucion_g
export function rengFraccionesMolares(rengMoles: number[]): number[] {
  const rengT = rengMoles.reduce((rengA, rengB) => rengA + rengB, 0)
  if (!(rengT > 0)) throw new Error('La suma de moles debe ser positiva.')
  return rengMoles.map((rengN) => rengN / rengT)
}

export const rengMolaridadDesdePorcentaje = (rengPct: number, rengDensidad_g_mL: number, RengMm: number): number => (10 * rengPct * rengDensidad_g_mL) / RengMm

export function rengMolalidadDesdeMolaridad(RENG_M: number, rengDensidad_g_mL: number, RengMm: number): number {
  const rengKgDisolventePorL = rengDensidad_g_mL - (RENG_M * RengMm) / 1000
  if (!(rengKgDisolventePorL > 0)) throw new Error('Datos incoherentes: la masa de soluto supera la de la disolución.')
  return RENG_M / rengKgDisolventePorL
}

export interface RengDilucion {
  C1?: number
  V1?: number
  C2?: number
  V2?: number
}

export function rengDilucion(rengD: RengDilucion): Required<RengDilucion> {
  const rengFaltan = (['C1', 'V1', 'C2', 'V2'] as const).filter((rengK) => rengD[rengK] === undefined)
  if (rengFaltan.length !== 1) throw new Error('Deja vacía exactamente una variable (C₁, V₁, C₂ o V₂).')
  for (const rengK of ['C1', 'V1', 'C2', 'V2'] as const) if (rengD[rengK] !== undefined && !((rengD[rengK] as number) > 0)) throw new Error(`${rengK} debe ser positiva.`)
  const { C1: RENG_C1, V1: RENG_V1, C2: RENG_C2, V2: RENG_V2 } = rengD
  let rengR: Required<RengDilucion>
  if (RENG_C1 === undefined) rengR = { C1: (RENG_C2! * RENG_V2!) / RENG_V1!, V1: RENG_V1!, C2: RENG_C2!, V2: RENG_V2! }
  else if (RENG_V1 === undefined) rengR = { C1: RENG_C1, V1: (RENG_C2! * RENG_V2!) / RENG_C1, C2: RENG_C2!, V2: RENG_V2! }
  else if (RENG_C2 === undefined) rengR = { C1: RENG_C1, V1: RENG_V1, C2: (RENG_C1 * RENG_V1) / RENG_V2!, V2: RENG_V2! }
  else rengR = { C1: RENG_C1, V1: RENG_V1, C2: RENG_C2, V2: (RENG_C1 * RENG_V1) / RENG_C2 }
  if (rengR.C2 > rengR.C1 + 1e-12) throw new Error('Una dilución no puede aumentar la concentración (C₂ > C₁).')
  return rengR
}

export function rengFmt(rengX: number): string {
  if (!Number.isFinite(rengX)) return '—'
  if (rengX === 0) return '0'
  const rengA = Math.abs(rengX)
  if (rengA >= 1e5 || rengA < 1e-3) {
    const [rengM, rengE] = rengX.toExponential(3).split('e')
    return `${(rengM as string).replace('.', ',')} × 10${rengSuperindice(Number(rengE))}`
  }
  return Number(rengX.toPrecision(4)).toLocaleString('es', { maximumFractionDigits: 6 })
}
