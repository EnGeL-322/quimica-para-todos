import { RENG_TOL_RESIDUO } from './equilibrio'

export const RENG_I_MAX_SOLUBILIDAD = 0.01
export const RENG_LIMITES_SOLUBILIDAD = { cMin: 0, cMax: 1, solidoMax: 1 } as const

export type RengSeveridadSol = 'info' | 'aviso' | 'fuera'

export interface RengDiagnosticoSol {
  codigo: string
  severidad: RengSeveridadSol
  texto: string
}

export interface RengParametrosSolubilidad {
  ksp: number
  nuM: number
  nuA: number
  zM: number
  zA: number
  cM: number
  cA: number
  solido: number
  nombreM?: string
  nombreA?: string
}

export type RengVeredictoSol = 'precipita' | 'equilibrio' | 'disuelve'

export interface RengResultadoSolubilidad {
  q: number
  ksp: number
  veredicto: RengVeredictoSol
  s0: number
  s: number
  razon: number
  precipitado: number
  disuelto: number
  solidoFinal: number
  cMFinal: number
  cAFinal: number
  qFinal: number
  fuerzaIonica: number
  diagnosticos: RengDiagnosticoSol[]
}

const rengN = (rengX: number, rengD = 3): string => (Number.isFinite(rengX) ? (rengX !== 0 && (Math.abs(rengX) < 1e-3 || Math.abs(rengX) >= 1e4) ? rengX.toExponential(rengD - 1).replace('.', ',') : String(Number(rengX.toPrecision(rengD))).replace('.', ',')) : '—')

export function rengValidarEstequiometria(rengNuM: number, rengNuA: number): void {
  const rengOk = (rengP: number, rengQ: number): boolean => (rengP === 1 && rengQ === 1) || (rengP === 1 && rengQ === 2) || (rengP === 2 && rengQ === 1)
  if (!Number.isInteger(rengNuM) || !Number.isInteger(rengNuA) || !rengOk(rengNuM, rengNuA)) throw new RangeError(`Estequiometría ${rengNuM}:${rengNuA} no soportada: el modelo solo resuelve sales 1:1, 1:2 y 2:1. Una sal como M₃A₂ (por ejemplo un fosfato) además exige equilibrios del anión que no están modelados.`)
}

export function rengSolubilidadAguaPura(rengKsp: number, rengNuM: number, rengNuA: number): number {
  rengValidarEstequiometria(rengNuM, rengNuA)
  if (!(rengKsp > 0) || !Number.isFinite(rengKsp)) throw new RangeError('Ksp debe ser un número finito y positivo.')
  return (rengKsp / (rengNuM ** rengNuM * rengNuA ** rengNuA)) ** (1 / (rengNuM + rengNuA))
}

const rengProducto = (rengCM: number, rengCA: number, rengP: number, rengQ: number): number => rengCM ** rengP * rengCA ** rengQ

export function rengQDe(rengCM: number, rengCA: number, rengNuM: number, rengNuA: number): number {
  return rengProducto(rengCM, rengCA, rengNuM, rengNuA)
}

export function rengSolubilidadConIones(rengKsp: number, rengNuM: number, rengNuA: number, rengCM: number, rengCA: number): number {
  const rengS0 = rengSolubilidadAguaPura(rengKsp, rengNuM, rengNuA)
  if (!(rengCM >= 0) || !(rengCA >= 0) || !Number.isFinite(rengCM) || !Number.isFinite(rengCA)) throw new RangeError('Las concentraciones iniciales deben ser números finitos y ≥ 0.')
  if (rengProducto(rengCM, rengCA, rengNuM, rengNuA) >= rengKsp) return 0
  let rengLo = 0
  let rengHi = rengS0
  for (let rengI = 0; rengI < 300 && rengHi - rengLo > 0; rengI++) {
    const rengMid = (rengLo + rengHi) / 2
    if (rengMid <= rengLo || rengMid >= rengHi) break
    if (rengProducto(rengCM + rengNuM * rengMid, rengCA + rengNuA * rengMid, rengNuM, rengNuA) < rengKsp) rengLo = rengMid
    else rengHi = rengMid
  }
  return (rengLo + rengHi) / 2
}

export function rengPrecipitado(rengKsp: number, rengNuM: number, rengNuA: number, rengCM: number, rengCA: number): number {
  rengValidarEstequiometria(rengNuM, rengNuA)
  if (rengProducto(rengCM, rengCA, rengNuM, rengNuA) <= rengKsp) return 0
  let rengLo = 0
  let rengHi = Math.min(rengCM / rengNuM, rengCA / rengNuA)
  for (let rengI = 0; rengI < 300 && rengHi - rengLo > 0; rengI++) {
    const rengMid = (rengLo + rengHi) / 2
    if (rengMid <= rengLo || rengMid >= rengHi) break
    if (rengProducto(rengCM - rengNuM * rengMid, rengCA - rengNuA * rengMid, rengNuM, rengNuA) > rengKsp) rengLo = rengMid
    else rengHi = rengMid
  }
  return (rengLo + rengHi) / 2
}

export function rengCompararQKsp(rengQ: number, rengKsp: number): RengVeredictoSol {
  if (!(rengKsp > 0) || !Number.isFinite(rengKsp) || !(rengQ >= 0) || !Number.isFinite(rengQ)) throw new RangeError('Q y Ksp deben ser números finitos, Q ≥ 0 y Ksp > 0.')
  if (rengQ === 0) return 'disuelve'
  const rengL = Math.log(rengQ / rengKsp)
  if (Math.abs(rengL) < RENG_TOL_RESIDUO) return 'equilibrio'
  return rengL < 0 ? 'disuelve' : 'precipita'
}

export function rengAnalizarSolubilidad(rengP: RengParametrosSolubilidad): RengResultadoSolubilidad {
  rengValidarEstequiometria(rengP.nuM, rengP.nuA)
  const rengL = RENG_LIMITES_SOLUBILIDAD
  for (const [rengV, rengNombre] of [[rengP.cM, 'La concentración del catión'], [rengP.cA, 'La concentración del anión'], [rengP.solido, 'La cantidad de sólido']] as const) if (!Number.isFinite(rengV) || rengV < 0) throw new RangeError(`${rengNombre} debe ser un número finito y ≥ 0.`)
  if (rengP.cM > rengL.cMax || rengP.cA > rengL.cMax) throw new RangeError(`Las concentraciones de los iones deben ser como máximo ${rengL.cMax} mol/L: más allá el modelo ideal no tiene ningún sentido.`)
  if (rengP.solido > rengL.solidoMax) throw new RangeError(`La cantidad de sólido debe ser como máximo ${rengL.solidoMax} mol por litro de disolución.`)
  const rengNM = rengP.nombreM ?? 'el catión'
  const rengNA = rengP.nombreA ?? 'el anión'
  const rengQ = rengProducto(rengP.cM, rengP.cA, rengP.nuM, rengP.nuA)
  const rengVeredicto = rengCompararQKsp(rengQ, rengP.ksp)
  const rengS0 = rengSolubilidadAguaPura(rengP.ksp, rengP.nuM, rengP.nuA)
  const rengS = rengSolubilidadConIones(rengP.ksp, rengP.nuM, rengP.nuA, rengP.cM, rengP.cA)
  let rengX = 0
  let rengD = 0
  if (rengVeredicto === 'precipita') rengX = rengPrecipitado(rengP.ksp, rengP.nuM, rengP.nuA, rengP.cM, rengP.cA)
  else if (rengVeredicto === 'disuelve') rengD = Math.min(rengP.solido, rengS)
  const rengMFin = rengP.cM - rengP.nuM * rengX + rengP.nuM * rengD
  const rengAFin = rengP.cA - rengP.nuA * rengX + rengP.nuA * rengD
  const rengSolidoFin = rengVeredicto === 'precipita' ? rengP.solido + rengX : rengP.solido - rengD
  const rengI = 0.5 * (rengMFin * rengP.zM ** 2 + rengAFin * rengP.zA ** 2)

  const rengDiag: RengDiagnosticoSol[] = []
  if (rengP.cM === 0 && rengP.cA === 0) rengDiag.push({ codigo: 'sol-sin-iones', severidad: 'info', texto: `No hay iones en disolución (${rengNM} y ${rengNA} a 0 mol/L): Q = 0 y no puede precipitar nada.${rengP.solido > 0 ? ' Con sólido presente se disuelve hasta la solubilidad del agua pura.' : ' Sin sólido tampoco hay nada que disolver: no hay evolución.'}` })
  else if (rengP.cM === 0 || rengP.cA === 0) rengDiag.push({ codigo: 'sol-falta-ion', severidad: 'info', texto: `Falta ${rengP.cM === 0 ? rengNM : rengNA} (0 mol/L): Q = 0, así que no puede precipitar mientras falte. Si hay sólido, al disolverse aporta los dos iones.` })
  if (rengVeredicto === 'disuelve' && rengP.solido === 0 && rengQ > 0) rengDiag.push({ codigo: 'sol-sin-solido', severidad: 'info', texto: `Q < Ksp y no hay sólido presente: no hay nada que disolver ni que precipite. La disolución admite todavía hasta ${rengN(rengS)} mol/L de la sal antes de saturarse.` })
  if (rengVeredicto === 'disuelve' && rengP.solido > 0 && rengP.solido < rengS - 1e-15) rengDiag.push({ codigo: 'sol-solido-agotado', severidad: 'info', texto: `Todo el sólido (${rengN(rengP.solido)} mol/L) se disuelve y la disolución queda sin saturar: podría disolver ${rengN(rengS)} mol/L en total.` })
  if (rengVeredicto === 'disuelve' && rengP.solido > rengS + 1e-15) rengDiag.push({ codigo: 'sol-solido-sobra', severidad: 'info', texto: `Se disuelven ${rengN(rengS)} mol/L y quedan ${rengN(rengP.solido - rengS)} mol/L de sólido: la disolución queda saturada.` })
  if (rengI > RENG_I_MAX_SOLUBILIDAD) rengDiag.push({ codigo: 'sol-fuerza-ionica', severidad: 'aviso', texto: `Fuerza iónica estimada ${rengN(rengI)} mol/L (solo con ${rengNM} y ${rengNA}): el Ksp tabulado corresponde a fuerza iónica cero (actividades) y aquí se usan concentraciones. Por encima de ${rengN(RENG_I_MAX_SOLUBILIDAD)} mol/L la aproximación «actividades ≈ concentraciones» pierde fiabilidad; ese umbral es un criterio convencional de este proyecto (el mismo que usa Mezcla ácido–base), no un valor de una fuente. El resultado es orientativo.` })
  if (rengP.cM > 0 || rengP.cA > 0) rengDiag.push({ codigo: 'sol-espectadores', severidad: 'info', texto: 'La fuerza iónica solo cuenta los iones del equilibrio. Los iones espectadores que acompañen al ion común (el contraión de la sal soluble que lo aporta) no se incluyen, así que la cifra es un mínimo.' })
  return { q: rengQ, ksp: rengP.ksp, veredicto: rengVeredicto, s0: rengS0, s: rengS, razon: rengS0 > 0 ? rengS / rengS0 : 0, precipitado: rengX, disuelto: rengD, solidoFinal: rengSolidoFin, cMFinal: rengMFin, cAFinal: rengAFin, qFinal: rengProducto(rengMFin, rengAFin, rengP.nuM, rengP.nuA), fuerzaIonica: rengI, diagnosticos: rengDiag }
}

export interface RengSerieIonComun {
  ion: 'anion' | 'cation'
  max: number
  filas: Array<[number, number]>
}

export function rengSerieIonComun(rengKsp: number, rengNuM: number, rengNuA: number, rengCM: number, rengCA: number, rengN = 40): RengSerieIonComun {
  const rengVariaAnion = rengCA > 0
  const rengBase = Math.max(rengVariaAnion ? rengCA : rengCM, 1e-3)
  const rengMax = Math.min(4 * rengBase, RENG_LIMITES_SOLUBILIDAD.cMax)
  const rengFilas: Array<[number, number]> = []
  for (let rengI = 0; rengI <= rengN; rengI++) {
    const rengC = (rengMax * rengI) / rengN
    rengFilas.push([rengC, rengSolubilidadConIones(rengKsp, rengNuM, rengNuA, rengVariaAnion ? rengCM : rengC, rengVariaAnion ? rengC : rengCA)])
  }
  return { ion: rengVariaAnion ? 'anion' : 'cation', max: rengMax, filas: rengFilas }
}
