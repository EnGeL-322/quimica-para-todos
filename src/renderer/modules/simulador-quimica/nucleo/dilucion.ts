import { rengSepararNumeroUnidad } from '../practica/numeros'

export type RengModoDilucion = 0 | 1

export const RENG_MODO_AFORO: RengModoDilucion = 0
export const RENG_MODO_VOLUMEN_IGUAL: RengModoDilucion = 1

export interface RengEntradaDilucion {
  c1: number
  Va: number
  Vf: number
  modo: RengModoDilucion
  Vdisp: number
}

export interface RengResultadoDilucion {
  molesAlicuota: number
  molesFinales: number
  volumenTotalMl: number
  volumenDisolventeMl: number
  concentracionFinal: number
  factor: number
  restoEnRecipienteMl: number
  molesQueDanEnRecipiente: number
}

export const RENG_LIMITES_DILUCION = { c1Min: 1e-6, c1Max: 20, VaMin: 0.01, VaMax: 1000, VfMin: 1, VfMax: 5000, VdispMin: 0.01, VdispMax: 5000 } as const

export const RENG_NOMBRE_MODO_DILUCION: Record<RengModoDilucion, string> = {
  0: 'Añadir disolvente hasta el aforo (el volumen final es el del matraz)',
  1: 'Añadir un volumen de disolvente igual al volumen final (el total es alícuota + disolvente)'
}

export function rengDiluir(rengE: RengEntradaDilucion): RengResultadoDilucion {
  const rengL = RENG_LIMITES_DILUCION
  const rengFinito = (rengV: number, rengMin: number, rengMax: number, rengNombre: string): void => {
    if (!Number.isFinite(rengV) || rengV < rengMin || rengV > rengMax) throw new RangeError(`${rengNombre} debe estar entre ${rengMin} y ${rengMax}.`)
  }
  rengFinito(rengE.c1, rengL.c1Min, rengL.c1Max, 'La concentración inicial (mol/L)')
  rengFinito(rengE.Va, rengL.VaMin, rengL.VaMax, 'La alícuota (mL)')
  rengFinito(rengE.Vf, rengL.VfMin, rengL.VfMax, 'El volumen final (mL)')
  rengFinito(rengE.Vdisp, rengL.VdispMin, rengL.VdispMax, 'El volumen disponible (mL)')
  if (rengE.modo !== 0 && rengE.modo !== 1) throw new RangeError('El modo de dilución debe ser 0 (aforo) o 1 (volumen de disolvente igual al final).')
  if (rengE.Va > rengE.Vdisp) throw new RangeError(`La alícuota (${rengE.Va} mL) es mayor que el volumen disponible en el recipiente inicial (${rengE.Vdisp} mL): no se puede medir.`)
  if (rengE.modo === 0 && rengE.Vf < rengE.Va) throw new RangeError(`El volumen final (${rengE.Vf} mL) es menor que la alícuota transferida (${rengE.Va} mL): el matraz no puede contener la alícuota.`)
  const rengMolesAlicuota = (rengE.c1 * rengE.Va) / 1000
  const rengTotal = rengE.modo === 0 ? rengE.Vf : rengE.Va + rengE.Vf
  const rengDisolvente = rengE.modo === 0 ? rengE.Vf - rengE.Va : rengE.Vf
  const rengConcentracion = rengMolesAlicuota / (rengTotal / 1000)
  return {
    molesAlicuota: rengMolesAlicuota,
    molesFinales: rengConcentracion * (rengTotal / 1000),
    volumenTotalMl: rengTotal,
    volumenDisolventeMl: rengDisolvente,
    concentracionFinal: rengConcentracion,
    factor: rengTotal / rengE.Va,
    restoEnRecipienteMl: rengE.Vdisp - rengE.Va,
    molesQueDanEnRecipiente: (rengE.c1 * (rengE.Vdisp - rengE.Va)) / 1000
  }
}

export type RengMagnitudDilucion = 'volumen' | 'concentracion'

const RENG_A_BASE: Record<RengMagnitudDilucion, Record<string, number>> = {
  volumen: { mL: 1, ml: 1, 'cm³': 1, cm3: 1, L: 1000, l: 1000, µL: 1e-3, uL: 1e-3, μL: 1e-3 },
  concentracion: { 'mol/L': 1, 'mmol/L': 1e-3, 'µmol/L': 1e-6, 'umol/L': 1e-6, 'μmol/L': 1e-6, mM: 1e-3 }
}

const RENG_UNIDAD_BASE: Record<RengMagnitudDilucion, string> = { volumen: 'mL', concentracion: 'mol/L' }
const RENG_NOMBRE_MAGNITUD: Record<RengMagnitudDilucion, string> = { volumen: 'un volumen', concentracion: 'una concentración molar' }

export type RengLecturaMagnitud = { ok: true; valor: number; unidadLeida: string; convertido: boolean } | { ok: false; motivo: 'vacio' | 'ilegible' | 'unidad-incompatible'; mensaje: string }

export function rengLeerMagnitudDilucion(rengTexto: string, rengMagnitud: RengMagnitudDilucion): RengLecturaMagnitud {
  const rengL = rengSepararNumeroUnidad(rengTexto)
  if (!rengL.ok) return { ok: false, motivo: rengL.motivo === 'vacio' ? 'vacio' : 'ilegible', mensaje: rengL.motivo === 'vacio' ? 'Escribe un valor.' : rengL.motivo === 'separador-ambiguo' ? 'No se entiende el separador decimal.' : 'No se entiende el número.' }
  const rengUnidad = rengL.unidad === '' ? RENG_UNIDAD_BASE[rengMagnitud] : rengL.unidad
  const rengFactor = RENG_A_BASE[rengMagnitud][rengUnidad]
  if (rengFactor === undefined) return { ok: false, motivo: 'unidad-incompatible', mensaje: `«${rengTexto.trim()}» no es ${RENG_NOMBRE_MAGNITUD[rengMagnitud]}: usa ${Object.keys(RENG_A_BASE[rengMagnitud]).filter((rengK) => /^(mL|L|µL|mol\/L|mmol\/L|µmol\/L)$/.test(rengK)).join(', ')}.` }
  return { ok: true, valor: rengL.valor * rengFactor, unidadLeida: rengUnidad, convertido: rengFactor !== 1 }
}

export const RENG_SOLUCIONES_DILUCION: ReadonlyArray<{ id: string; nombre: string; soluto: string; concentracion: number; color: string }> = [
  { id: 'nacl', nombre: 'Cloruro de sodio, NaCl(aq)', soluto: 'NaCl', concentracion: 0.2, color: '#9bd4f2' },
  { id: 'glucosa', nombre: 'Glucosa, C₆H₁₂O₆(aq)', soluto: 'C₆H₁₂O₆', concentracion: 0.5, color: '#f4d58a' },
  { id: 'sacarosa', nombre: 'Sacarosa, C₁₂H₂₂O₁₁(aq)', soluto: 'C₁₂H₂₂O₁₁', concentracion: 0.1, color: '#e6c9a8' }
]
