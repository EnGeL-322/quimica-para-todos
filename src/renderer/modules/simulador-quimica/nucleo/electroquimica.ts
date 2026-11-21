export const RENG_T_REFERENCIA_K = 298.15
export const RENG_C_MIN_ELECTRO = 1e-6
export const RENG_C_MAX_ELECTRO = 1
export const RENG_C_IDEAL_ELECTRO = 0.01
export const RENG_TOL_E_EQUILIBRIO = 1e-9

export type RengSeveridadEle = 'info' | 'aviso' | 'fuera'

export interface RengDiagnosticoEle {
  codigo: string
  severidad: RengSeveridadEle
  texto: string
}

export interface RengSemiceldaCore {
  id: string
  oxidante: string
  reductor: string
  nu: number
  carga: number
  n: number
  E0: number
  gas: boolean
}

export interface RengParametrosCelda {
  anodo: RengSemiceldaCore
  catodo: RengSemiceldaCore
  cA: number
  cC: number
  F: number
  R: number
}

export interface RengResultadoCelda {
  nCelda: number
  factorCatodo: number
  factorAnodo: number
  ecuacion: string
  E0Celda: number
  deltaG0: number
  lnK: number
  K: number | null
  Q: number | null
  E: number | null
  deltaG: number | null
  coeficienteNernst: number
  espontaneaEstandar: boolean
  espontanea: boolean
  enEquilibrio: boolean
  catodoReal: 'propuesto' | 'invertido'
  diagnosticos: RengDiagnosticoEle[]
}

const rengN = (rengX: number, rengD = 4): string => (Number.isFinite(rengX) ? String(Number(rengX.toPrecision(rengD))).replace('.', ',') : '—')

export function rengMcm(rengA: number, rengB: number): number {
  if (!Number.isInteger(rengA) || !Number.isInteger(rengB) || rengA < 1 || rengB < 1) throw new RangeError('Los números de electrones deben ser enteros positivos.')
  const rengMcd = (rengX: number, rengY: number): number => (rengY === 0 ? rengX : rengMcd(rengY, rengX % rengY))
  return (rengA * rengB) / rengMcd(rengA, rengB)
}

const rengCoef = (rengX: number): string => (rengX === 1 ? '' : `${rengX} `)

export function rengEcuacionCelda(rengAnodo: RengSemiceldaCore, rengCatodo: RengSemiceldaCore, rengFA: number, rengFC: number): string {
  const rengIzq = `${rengCoef(rengFA)}${rengAnodo.reductor} + ${rengCoef(rengFC * rengCatodo.nu)}${rengCatodo.oxidante}`
  const rengDer = `${rengCoef(rengFA * rengAnodo.nu)}${rengAnodo.oxidante} + ${rengCoef(rengFC)}${rengCatodo.reductor}`
  return `${rengIzq} → ${rengDer}`
}

function rengValidarSemicelda(rengS: RengSemiceldaCore): void {
  if (!Number.isInteger(rengS.n) || rengS.n < 1) throw new RangeError(`La semicelda «${rengS.id}» necesita un número entero de electrones ≥ 1.`)
  if (!Number.isInteger(rengS.nu) || rengS.nu < 1) throw new RangeError(`La semicelda «${rengS.id}» necesita un coeficiente entero ≥ 1 para el oxidante.`)
  if (!Number.isFinite(rengS.E0)) throw new RangeError(`La semicelda «${rengS.id}» no tiene un potencial estándar finito.`)
}

export function rengPotencialSemicelda(rengS: RengSemiceldaCore, rengC: number, rengF: number, rengR: number, rengTK = RENG_T_REFERENCIA_K): number {
  if (!(rengC > 0)) throw new RangeError('La concentración debe ser mayor que 0 para aplicar la ecuación de Nernst.')
  return rengS.E0 + ((rengR * rengTK) / (rengS.n * rengF)) * Math.log(rengC ** rengS.nu)
}

export function rengAnalizarCelda(rengP: RengParametrosCelda): RengResultadoCelda {
  const { anodo: rengAn, catodo: rengCa } = rengP
  rengValidarSemicelda(rengAn)
  rengValidarSemicelda(rengCa)
  if (!(rengP.F > 0) || !(rengP.R > 0) || !Number.isFinite(rengP.F) || !Number.isFinite(rengP.R)) throw new RangeError('Las constantes F y R deben ser números finitos y positivos.')
  for (const [rengV, rengNombre] of [[rengP.cA, 'La concentración en el ánodo'], [rengP.cC, 'La concentración en el cátodo']] as const) {
    if (!Number.isFinite(rengV) || rengV < 0) throw new RangeError(`${rengNombre} debe ser un número finito y ≥ 0.`)
    if (rengV > RENG_C_MAX_ELECTRO) throw new RangeError(`${rengNombre} debe ser como máximo ${RENG_C_MAX_ELECTRO} mol/L: más allá, las concentraciones no representan actividades.`)
  }
  const rengTK = RENG_T_REFERENCIA_K
  const rengNe = rengMcm(rengAn.n, rengCa.n)
  const rengFA = rengNe / rengAn.n
  const rengFC = rengNe / rengCa.n
  const rengE0 = rengCa.E0 - rengAn.E0
  const rengDeltaG0 = -rengNe * rengP.F * rengE0 + 0
  const rengLnK = (rengNe * rengP.F * rengE0) / (rengP.R * rengTK)
  const rengK = Number.isFinite(Math.exp(rengLnK)) && Math.exp(rengLnK) > 0 ? Math.exp(rengLnK) : null
  const rengCoefN = (rengP.R * rengTK) / (rengNe * rengP.F)
  const rengDiag: RengDiagnosticoEle[] = []
  const rengFalta: string[] = []
  if (rengP.cA === 0) rengFalta.push(`${rengAn.oxidante} del ánodo`)
  if (rengP.cC === 0) rengFalta.push(`${rengCa.oxidante} del cátodo`)
  let rengQ: number | null = null
  let rengE: number | null = null
  let rengDeltaG: number | null = null
  if (rengFalta.length === 0) {
    rengQ = (rengP.cA ** (rengAn.nu * rengFA)) / (rengP.cC ** (rengCa.nu * rengFC))
    rengE = rengE0 - rengCoefN * Math.log(rengQ)
    rengDeltaG = -rengNe * rengP.F * rengE + 0
  } else rengDiag.push({ codigo: 'ele-falta-ion', severidad: 'fuera', texto: `Falta ${rengFalta.join(' y ')} (0 mol/L): Q no está definido y la ecuación de Nernst no se puede aplicar, así que no se calcula el potencial con concentraciones. El potencial estándar sí está definido (condiciones estándar: actividad 1).` })

  const rengReferencia = rengE ?? rengE0
  const rengEquilibrio = Math.abs(rengReferencia) < RENG_TOL_E_EQUILIBRIO
  const rengEspontanea = rengReferencia > RENG_TOL_E_EQUILIBRIO
  if (rengAn.id === rengCa.id) rengDiag.push({ codigo: 'ele-misma-pareja', severidad: 'aviso', texto: `Las dos semiceldas son el mismo par (${rengAn.oxidante}/${rengAn.reductor}): E° de la celda = 0, ΔG° = 0 y K = 1. Solo puede haber diferencia de potencial si las concentraciones difieren (una pila de concentración); con concentraciones iguales no hay celda.` })
  if (!rengEspontanea && !rengEquilibrio) rengDiag.push({ codigo: 'ele-no-espontanea', severidad: 'info', texto: `Tal como la planteas, la reacción no es espontánea (${rengE === null ? 'E°' : 'E'} < 0): la celda real funcionaría al revés, con ${rengCa.reductor} como ánodo y ${rengAn.reductor} como cátodo.` })
  if (rengEquilibrio && rengAn.id !== rengCa.id) rengDiag.push({ codigo: 'ele-equilibrio', severidad: 'info', texto: 'El potencial de la celda es 0: está en equilibrio, no hay corriente.' })
  for (const [rengC, rengS, rengLado] of [[rengP.cA, rengAn, 'ánodo'], [rengP.cC, rengCa, 'cátodo']] as const) {
    if (rengC > 0 && rengC < RENG_C_MIN_ELECTRO) rengDiag.push({ codigo: 'ele-muy-diluida', severidad: 'aviso', texto: `${rengS.oxidante} del ${rengLado} a ${rengN(rengC, 3)} mol/L está por debajo de ${rengN(RENG_C_MIN_ELECTRO, 1)} mol/L: con disoluciones tan diluidas la ecuación de Nernst deja de ser fiable (hidrólisis, impurezas y actividades). Criterio convencional de este proyecto, sin fuente.` })
    if (rengC > RENG_C_IDEAL_ELECTRO && rengC < RENG_C_MAX_ELECTRO) rengDiag.push({ codigo: 'ele-actividades', severidad: 'aviso', texto: `${rengS.oxidante} del ${rengLado} a ${rengN(rengC, 3)} mol/L supera ${rengN(RENG_C_IDEAL_ELECTRO, 2)} mol/L: la aproximación «actividades ≈ concentraciones» pierde fiabilidad y los potenciales pueden desviarse de lo calculado. Ese umbral es un criterio convencional de este proyecto (el mismo que usan Mezcla y Solubilidad), no un valor de una fuente.` })
  }
  if (rengFalta.length === 0 && rengP.cA === RENG_C_MAX_ELECTRO && rengP.cC === RENG_C_MAX_ELECTRO) rengDiag.push({ codigo: 'ele-condiciones-estandar', severidad: 'info', texto: 'Las dos concentraciones valen 1 mol/L: son las condiciones estándar de la fuente (actividad 1), así que la ecuación de Nernst da E = E°. 1 mol/L se toma como actividad 1; en una disolución real las actividades de iones a esa concentración se alejan mucho de 1.' })
  if (rengAn.gas || rengCa.gas) rengDiag.push({ codigo: 'ele-gas-presion', severidad: 'info', texto: 'El electrodo de hidrógeno se supone a la presión parcial de gas de la fuente (101,325 kPa); la fuente avisa de que no es el estado estándar actual (100 kPa). Variar la presión no está modelado.' })
  rengDiag.push({ codigo: 'ele-perdidas', severidad: 'info', texto: 'Celda ideal: no se modelan la resistencia interna, el sobrepotencial de los electrodos, la polarización ni el potencial de unión líquida del puente salino, así que el potencial calculado es el máximo teórico, sin corriente. Tampoco se modela que el metal real reaccione con el agua o se pasive.' })
  return {
    nCelda: rengNe,
    factorCatodo: rengFC,
    factorAnodo: rengFA,
    ecuacion: rengEcuacionCelda(rengAn, rengCa, rengFA, rengFC),
    E0Celda: rengE0,
    deltaG0: rengDeltaG0,
    lnK: rengLnK,
    K: rengK,
    Q: rengQ,
    E: rengE,
    deltaG: rengDeltaG,
    coeficienteNernst: rengCoefN,
    espontaneaEstandar: rengE0 > RENG_TOL_E_EQUILIBRIO,
    espontanea: rengEspontanea,
    enEquilibrio: rengEquilibrio,
    catodoReal: rengReferencia >= -RENG_TOL_E_EQUILIBRIO ? 'propuesto' : 'invertido',
    diagnosticos: rengDiag
  }
}

export interface RengSerieNernst {
  max: number
  filas: Array<[number, number]>
}

export function rengSerieNernst(rengP: RengParametrosCelda, rengN = 40): RengSerieNernst {
  const rengFilas: Array<[number, number]> = []
  for (let rengI = 0; rengI <= rengN; rengI++) {
    const rengLog = -6 + (6 * rengI) / rengN
    const rengC = 10 ** rengLog
    const rengR = rengAnalizarCelda({ ...rengP, cC: rengC })
    if (rengR.E !== null) rengFilas.push([rengLog, rengR.E])
  }
  return { max: 0, filas: rengFilas }
}
