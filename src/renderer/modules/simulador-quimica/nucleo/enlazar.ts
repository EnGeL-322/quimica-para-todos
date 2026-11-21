import { rengPorSimbolo } from '../../tabla-periodica/data'
import { RENG_COMPUESTOS_BINARIOS, RENG_ESTADOS_COMUNES } from './compuestosBinarios'
import { rengClase } from './constructor'
import { rengDatos3D } from './elementos3d'
import { rengElectronegatividad } from './electronegatividad'

export const RENG_NOTA_VALENCIAS = 'Valencias típicas y regla del octeto: reglas generales de enseñanza, sin verificar contra una edición concreta.'

export type RengTipoUnion = 'covalente-apolar' | 'covalente-polar' | 'ionico' | 'metalico'

export const RENG_NOMBRE_UNION: Record<RengTipoUnion, string> = { 'covalente-apolar': 'covalente apolar', 'covalente-polar': 'covalente polar', ionico: 'iónico', metalico: 'metálico' }

export interface RengContextoUnion {
  ordenEntre: number
  enlacesA: number
  enlacesB: number
  ionicoA: number
  ionicoB: number
  cargaA: number
  cargaB: number
}

export const RENG_CONTEXTO_LIBRE: RengContextoUnion = { ordenEntre: 0, enlacesA: 0, enlacesB: 0, ionicoA: 0, ionicoB: 0, cargaA: 0, cargaB: 0 }

export interface RengResultadoUnion {
  permitida: boolean
  forzable: boolean
  tipo: RengTipoUnion | null
  orden: number
  electrones: number
  longitud: number | null
  delta: number | null
  motivo: string
  avisos: string[]
}

const rengNombre = (rengS: string): string => (rengPorSimbolo.get(rengS)?.nombre ?? rengS).toLowerCase()
const rengEl = (rengS: string): string => rengNombre(rengS).replace(/^./, (rengC) => rengC.toUpperCase())
const rengComa = (rengX: number): string => rengX.toFixed(2).replace('.', ',')

const RENG_VALENCIAS: Record<string, { normal: number; max: number }> = {
  H: { normal: 1, max: 1 }, B: { normal: 3, max: 3 }, C: { normal: 4, max: 4 }, N: { normal: 3, max: 3 }, O: { normal: 2, max: 2 }, F: { normal: 1, max: 1 },
  Si: { normal: 4, max: 4 }, P: { normal: 3, max: 5 }, S: { normal: 2, max: 6 }, Cl: { normal: 1, max: 7 }, Ge: { normal: 4, max: 4 }, As: { normal: 3, max: 5 },
  Se: { normal: 2, max: 6 }, Br: { normal: 1, max: 5 }, Sb: { normal: 3, max: 5 }, Te: { normal: 2, max: 6 }, I: { normal: 1, max: 7 }, At: { normal: 1, max: 1 },
  Kr: { normal: 0, max: 2 }, Xe: { normal: 0, max: 6 }
}
const RENG_HIPER_CON = new Set(['F', 'O', 'Cl'])
const RENG_GAS_NOBLE_CON: Record<string, Set<string>> = { Xe: new Set(['F', 'O']), Kr: new Set(['F']) }

export const RENG_RARAS: Record<string, string> = {
  'Au-H': 'No se forma un hidruro de oro estable en condiciones normales; AuH solo se ha observado como molécula aislada en fase gaseosa.'
}

const rengGrupo = (rengS: string): number | null => rengPorSimbolo.get(rengS)?.grupo ?? null

export function rengValencia(rengS: string, rengCarga: number): { normal: number; max: number } | null {
  const rengV = RENG_VALENCIAS[rengS]
  if (!rengV) return null
  const rengG = rengGrupo(rengS)
  let rengD = 0
  if (rengG === 13) rengD = -rengCarga
  else if (rengG === 14) rengD = rengCarga === 0 ? 0 : -Math.abs(rengCarga)
  else if (rengG === 1) rengD = rengCarga === 0 ? 0 : -1
  else rengD = rengCarga
  return { normal: Math.max(0, rengV.normal + rengD), max: Math.max(0, rengV.max + rengD) }
}

const rengConocidoBinario = (rengA: string, rengB: string): boolean =>
  RENG_COMPUESTOS_BINARIOS.some((rengC) => {
    const rengEls: string[] = rengC.formula.match(/[A-Z][a-z]?/g) ?? []
    return new Set(rengEls).size === 2 && rengEls.includes(rengA) && rengEls.includes(rengB)
  })

const rengNo = (rengMotivo: string, rengExtra: Partial<RengResultadoUnion> = {}): RengResultadoUnion => ({ permitida: false, forzable: false, tipo: null, orden: 0, electrones: 0, longitud: null, delta: null, motivo: rengMotivo, avisos: [], ...rengExtra })

export function rengEvaluarUnion(rengA: string, rengB: string, rengCtx: RengContextoUnion = RENG_CONTEXTO_LIBRE): RengResultadoUnion {
  const rengRa = rengDatos3D.get(rengA)?.rc ?? null
  const rengRb = rengDatos3D.get(rengB)?.rc ?? null
  for (const [rengS, rengR] of [[rengA, rengRa], [rengB, rengRb]] as const)
    if (rengR === null) return rengNo(`No hay datos fiables (radio covalente) para unir el ${rengNombre(rengS)} (${rengS}): Cordero 2008 llega hasta Z = 96.`)
  const rengLongitud = (rengRa ?? 0) + (rengRb ?? 0)
  const rengCa = rengClase(rengA)
  const rengCb = rengClase(rengB)
  const rengXa = rengElectronegatividad(rengA)
  const rengXb = rengElectronegatividad(rengB)
  const rengDelta = rengXa !== null && rengXb !== null ? Math.abs(rengXa - rengXb) : null

  if (rengCa === 'gas-noble' || rengCb === 'gas-noble') {
    const rengG = rengCa === 'gas-noble' ? rengA : rengB
    const rengOtro = rengG === rengA ? rengB : rengA
    const rengPermitido = RENG_GAS_NOBLE_CON[rengG]?.has(rengOtro)
    if (!rengPermitido) {
      if (rengG === 'He') return rengNo('El helio no forma enlaces: capa de valencia completa.')
      if (rengG === 'Ne') return rengNo('El neón no forma enlaces: capa de valencia completa y electrones muy sujetos al núcleo.')
      return rengNo(`El ${rengNombre(rengG)} tiene la capa de valencia completa. Solo se conocen compuestos de Kr y Xe con los elementos más electronegativos (XeF₂, XeF₄, XeF₆, XeO₃, KrF₂).`)
    }
  }

  const rengMetalA = rengCa === 'metal'
  const rengMetalB = rengCb === 'metal'

  if (rengMetalA && rengMetalB) {
    if (rengCtx.ordenEntre > 0) return rengNo('Entre metales no hay enlaces dobles: los electrones de valencia ya están deslocalizados por toda la red.')
    return {
      permitida: true, forzable: false, tipo: 'metalico', orden: 1, electrones: 0, longitud: rengLongitud, delta: rengDelta,
      motivo: `Enlace metálico: ${rengA === rengB ? `los átomos de ${rengNombre(rengA)}` : `${rengNombre(rengA)} y ${rengNombre(rengB)}`} comparten un «mar» de electrones. Se forma una red${rengA === rengB ? '' : ' o aleación'}, no una molécula.`,
      avisos: ['En el sólido real hay muchísimos átomos; aquí se muestran solo dos.']
    }
  }

  if (rengMetalA !== rengMetalB) {
    const rengM = rengMetalA ? rengA : rengB
    const rengNm = rengMetalA ? rengB : rengA
    const rengClave = `${rengM}-${rengNm}`
    if (rengCtx.ordenEntre > 0) return rengNo(`El ${rengNombre(rengM)} y el ${rengNombre(rengNm)} ya forman un par iónico: los enlaces iónicos no tienen orden (no hay «doble iónico»).`)
    if (RENG_RARAS[rengClave]) return rengNo(RENG_RARAS[rengClave], { forzable: true, tipo: 'ionico', longitud: rengLongitud, delta: rengDelta })
    const rengPos = Math.max(0, ...(RENG_ESTADOS_COMUNES[rengM] ?? []).filter((rengX) => rengX > 0))
    const rengNeg = Math.max(0, ...(RENG_ESTADOS_COMUNES[rengNm] ?? []).filter((rengX) => rengX < 0).map((rengX) => -rengX))
    const rengUsadoM = rengMetalA ? rengCtx.ionicoA : rengCtx.ionicoB
    const rengUsadoN = rengMetalA ? rengCtx.ionicoB : rengCtx.ionicoA
    const rengCovN = rengMetalA ? rengCtx.enlacesB : rengCtx.enlacesA
    if (rengPos === 0) return rengNo(`No hay estados de oxidación positivos comunes del ${rengNombre(rengM)} en la tabla de la app: no se puede predecir el par iónico.`, { forzable: true, tipo: 'ionico', longitud: rengLongitud, delta: rengDelta })
    if (rengNeg === 0) return rengNo(`El ${rengNombre(rengNm)} no suele formar aniones (no tiene estados negativos comunes): no se espera un compuesto iónico con el ${rengNombre(rengM)}.`, { forzable: true, tipo: 'ionico', longitud: rengLongitud, delta: rengDelta })
    if (rengUsadoM >= rengPos) return rengNo(`El ${rengNombre(rengM)} ya ha cedido ${rengUsadoM === 1 ? 'su electrón' : `sus ${rengUsadoM} electrones`} (${rengM}${rengUsadoM > 1 ? rengUsadoM : ''}⁺): no tiene más que ceder.`)
    if (rengUsadoN + rengCovN >= rengNeg) return rengNo(`El ${rengNombre(rengNm)} ya tiene su capa completa (${rengUsadoN ? 'ha aceptado electrones' : 'tiene enlaces'}): no acepta otro electrón.`)
    const rengE = Math.min(rengPos - rengUsadoM, rengNeg - rengUsadoN - rengCovN)
    const rengConocido = rengConocidoBinario(rengM, rengNm)
    const rengAvisos = ['En el sólido no hay moléculas: forma una red de iones.']
    if (!rengConocido && rengGrupo(rengM) !== 1 && rengGrupo(rengM) !== 2) {
      return rengNo(`No figura en la lista verificada ningún compuesto de ${rengNombre(rengM)} y ${rengNombre(rengNm)}: no se puede confirmar que exista.`, { forzable: true, tipo: 'ionico', electrones: rengE, longitud: rengLongitud, delta: rengDelta })
    }
    if (!rengConocido) rengAvisos.push('Predicho por los estados de oxidación comunes; no figura en la lista verificada.')
    return {
      permitida: true, forzable: false, tipo: 'ionico', orden: 1, electrones: rengE, longitud: rengLongitud, delta: rengDelta,
      motivo: `Enlace iónico: el ${rengNombre(rengM)} cede ${rengE === 1 ? 'un electrón' : `${rengE} electrones`} al ${rengNombre(rengNm)}${rengDelta !== null ? ` (Δχ = ${rengComa(rengDelta)})` : ''}.`,
      avisos: rengAvisos
    }
  }

  const rengVa = rengValencia(rengA, rengCtx.cargaA)
  const rengVb = rengValencia(rengB, rengCtx.cargaB)
  for (const [rengS, rengV] of [[rengA, rengVa], [rengB, rengVb]] as const) if (!rengV) return rengNo(`La app no tiene la valencia típica del ${rengNombre(rengS)} (${rengS}).`)
  const rengNuevo = rengCtx.ordenEntre + 1
  if (rengNuevo > 3) return rengNo('Ya es un enlace triple: no existen enlaces cuádruples entre estos elementos de los grupos principales.')
  const rengComprobar = (rengS: string, rengV: { normal: number; max: number }, rengYa: number, rengOtro: string, rengCarga: number): string | null => {
    const rengTras = rengYa + 1
    const rengLimite = RENG_HIPER_CON.has(rengOtro) ? rengV.max : rengV.normal
    if (rengTras <= rengLimite) return null
    if (rengS === 'H') return rengCarga === 0 ? 'El H solo forma un enlace: su capa (1s) se completa con 2 electrones.' : 'Un H con carga no forma enlaces covalentes aquí.'
    if (rengS === 'O' && rengCarga === 0) return `El O ya tiene ${rengYa} enlace${rengYa === 1 ? '' : 's'}; un tercero necesitaría carga + (como en H₃O⁺) y no sería neutro.`
    if (rengS === 'N' && rengCarga === 0) return `El N ya tiene ${rengYa} enlaces; un cuarto necesitaría carga + (como en NH₄⁺) y no sería neutro.`
    if (rengS === 'C') return `El C ya tiene ${rengYa} enlaces: con 4 completa su octeto y no admite un quinto.`
    if (rengV.max > rengV.normal && !RENG_HIPER_CON.has(rengOtro)) return `El ${rengNombre(rengS)} ya tiene ${rengYa} enlaces; solo supera ${rengV.normal} (octeto expandido) con F, O o Cl.`
    return `El ${rengNombre(rengS)} ya tiene ${rengYa} enlace${rengYa === 1 ? '' : 's'}: es su máximo${rengCarga ? ` con carga ${rengCarga > 0 ? '+' : '−'}` : ''}.`
  }
  const rengErrA = rengComprobar(rengA, rengVa!, rengCtx.enlacesA + rengCtx.ionicoA, rengB, rengCtx.cargaA)
  if (rengErrA) return rengNo(rengErrA)
  const rengErrB = rengComprobar(rengB, rengVb!, rengCtx.enlacesB + rengCtx.ionicoB, rengA, rengCtx.cargaB)
  if (rengErrB) return rengNo(rengErrB)
  const rengAvisos: string[] = []
  for (const [rengS, rengV, rengYa] of [[rengA, rengVa!, rengCtx.enlacesA], [rengB, rengVb!, rengCtx.enlacesB]] as const)
    if (rengYa + 1 > rengV.normal) rengAvisos.push(`El ${rengNombre(rengS)} supera aquí ${rengV.normal} enlaces: octeto expandido (hipervalencia), posible en el periodo 3 y siguientes con F, O o Cl.`)
  const rengPolar = rengDelta !== null && rengDelta >= 0.4
  const rengTipo: RengTipoUnion = rengPolar ? 'covalente-polar' : 'covalente-apolar'
  const rengNombreOrden = rengNuevo === 1 ? 'sencillo' : rengNuevo === 2 ? 'doble' : 'triple'
  let rengMotivo = `Enlace covalente ${rengPolar ? 'polar' : 'apolar'} ${rengNombreOrden}`
  if (rengDelta !== null) rengMotivo += ` · Δχ = ${rengComa(rengDelta)}`
  if (rengPolar && rengXa !== null && rengXb !== null) rengMotivo += ` · δ⁺ en ${rengXa < rengXb ? rengA : rengB}, δ⁻ en ${rengXa < rengXb ? rengB : rengA}`
  return { permitida: true, forzable: false, tipo: rengTipo, orden: rengNuevo, electrones: 0, longitud: rengLongitud, delta: rengDelta, motivo: `${rengMotivo}.`, avisos: rengAvisos }
}

export const rengNombreElemento = rengEl
