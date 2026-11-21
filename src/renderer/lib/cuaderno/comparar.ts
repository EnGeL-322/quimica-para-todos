import { RENG_NOMBRE_ESTADO, type RengCorrida, type RengMedicion, type RengSerie } from '@shared/cuaderno'
import { rengConvertir } from '../unidades'

type RengEntradaCuaderno = RengCorrida | RengMedicion

export function rengAptitudComparacion(rengE: RengEntradaCuaderno): { apta: true; aviso: string | null } | { apta: false; motivo: string } {
  if (rengE.serie.filas.length === 0) return { apta: false, motivo: 'no tiene serie con datos' }
  if (rengE.tipo === 'medicion') return { apta: true, aviso: null }
  if (rengE.estado === 'calculado') return { apta: true, aviso: null }
  if (rengE.estado === 'aproximacion') return { apta: true, aviso: `«${rengE.nombre}» es una aproximación en el límite del modelo: ${rengE.diagnosticos[0] ?? 'vale con reservas.'}` }
  return { apta: false, motivo: `${RENG_NOMBRE_ESTADO[rengE.estado].toLowerCase()}: su serie no es un resultado válido del modelo` }
}

export function rengAvisosProcedencia(rengA: RengEntradaCuaderno, rengB: RengEntradaCuaderno): string[] {
  const rengOut: string[] = []
  for (const [rengC, rengM] of [
    [rengA, rengB],
    [rengB, rengA]
  ] as const) {
    if (rengC.tipo !== 'corrida' || rengM.tipo !== 'medicion' || !rengC.ajuste || rengC.ajuste.medicion !== rengM.id) continue
    if (rengC.ajuste.tipo === 'ajuste') rengOut.push(`«${rengC.nombre}» se ajustó a esta misma medición («${rengM.nombre}»): el residuo mide la calidad del ajuste, no valida el modelo. Para validar, compárala con otra medición.`)
    else rengOut.push(`«${rengC.nombre}» reutiliza el ${rengC.ajuste.parametro} ajustado a «${rengM.nombre}» en otras condiciones (${rengC.ajuste.cambios.join('; ')}): no reproduce esa medición, así que el residuo no es una validación.`)
  }
  return rengOut
}

export interface RengSerieXY {
  nombre: string
  x: number[]
  y: number[]
  ux: string
  uy: string
  nx?: string
  ny?: string
}

export function rengExtraerXY(rengNombre: string, rengSerie: RengSerie, rengClaveX: string, rengClaveY: string): RengSerieXY | null {
  const rengIx = rengSerie.columnas.findIndex((rengC) => rengC.clave === rengClaveX)
  const rengIy = rengSerie.columnas.findIndex((rengC) => rengC.clave === rengClaveY)
  if (rengIx < 0 || rengIy < 0) return null
  const rengPares: Array<[number, number]> = []
  for (const rengF of rengSerie.filas) {
    const rengX = rengF[rengIx]
    const rengY = rengF[rengIy]
    if (typeof rengX === 'number' && typeof rengY === 'number' && Number.isFinite(rengX) && Number.isFinite(rengY)) rengPares.push([rengX, rengY])
  }
  rengPares.sort((rengA, rengB) => rengA[0] - rengB[0])
  const rengX: number[] = []
  const rengY: number[] = []
  for (const [rengA, rengB] of rengPares) {
    if (rengX.length > 0 && rengA === rengX[rengX.length - 1]) continue
    rengX.push(rengA)
    rengY.push(rengB)
  }
  return { nombre: rengNombre, x: rengX, y: rengY, ux: rengSerie.columnas[rengIx]!.unidad, uy: rengSerie.columnas[rengIy]!.unidad, nx: rengSerie.columnas[rengIx]!.nombre, ny: rengSerie.columnas[rengIy]!.nombre }
}

export function rengInterpolar(rengXs: readonly number[], rengYs: readonly number[], rengX: number): number {
  const rengN = rengXs.length
  if (rengN === 0 || rengX < rengXs[0]! || rengX > rengXs[rengN - 1]!) return NaN
  let rengLo = 0
  let rengHi = rengN - 1
  while (rengHi - rengLo > 1) {
    const rengMid = (rengLo + rengHi) >> 1
    if (rengXs[rengMid]! <= rengX) rengLo = rengMid
    else rengHi = rengMid
  }
  const rengX0 = rengXs[rengLo]!
  const rengX1 = rengXs[rengHi]!
  if (rengX1 === rengX0) return rengYs[rengLo]!
  return rengYs[rengLo]! + ((rengYs[rengHi]! - rengYs[rengLo]!) * (rengX - rengX0)) / (rengX1 - rengX0)
}

export interface RengPuntoComparado {
  x: number
  ref: number
  otra: number
  residuo: number
}

export type RengComparacion =
  | {
      ok: true
      ref: RengSerieXY
      otra: RengSerieXY
      conversiones: string[]
      metodo: string
      advertencias: string[]
      excluidos: number
      intervalo: [number, number]
      puntos: RengPuntoComparado[]
      n: number
      rmse: number
      mae: number
      maxAbs: number
      unidad: string
    }
  | { ok: false; motivo: string }

const rengFmt = (rengV: number): string => (Math.abs(rengV) >= 1e-3 && Math.abs(rengV) < 1e6 ? Number(rengV.toPrecision(4)).toLocaleString('es') : rengV.toExponential(3).replace('.', ','))
const rengNombreU = (rengU: string): string => (rengU === '' ? 'sin unidad' : rengU)

function rengAUnidad(rengV: readonly number[], rengDe: string, rengA: string): number[] | string {
  if (rengDe === rengA) return [...rengV]
  try {
    return rengV.map((rengX) => rengConvertir(rengX, rengDe, rengA))
  } catch (rengE) {
    return rengE instanceof Error ? rengE.message : String(rengE)
  }
}

export function rengComparar(rengRef: RengSerieXY, rengOtra: RengSerieXY): RengComparacion {
  if (rengRef.x.length < 2) return { ok: false, motivo: `«${rengRef.nombre}» necesita al menos dos puntos para interpolar.` }
  if (rengOtra.x.length < 1) return { ok: false, motivo: `«${rengOtra.nombre}» no tiene puntos con x e y numéricos.` }
  const rengConversiones: string[] = []
  const rengX = rengAUnidad(rengOtra.x, rengOtra.ux, rengRef.ux)
  if (typeof rengX === 'string') return { ok: false, motivo: `Las x no son comparables (${rengNombreU(rengOtra.ux)} frente a ${rengNombreU(rengRef.ux)}): ${rengX}` }
  const rengY = rengAUnidad(rengOtra.y, rengOtra.uy, rengRef.uy)
  if (typeof rengY === 'string') return { ok: false, motivo: `Las magnitudes no son comparables (${rengNombreU(rengOtra.uy)} frente a ${rengNombreU(rengRef.uy)}): ${rengY}` }
  if (rengOtra.ux !== rengRef.ux) rengConversiones.push(`x de «${rengOtra.nombre}»: ${rengNombreU(rengOtra.ux)} → ${rengNombreU(rengRef.ux)}`)
  if (rengOtra.uy !== rengRef.uy) rengConversiones.push(`y de «${rengOtra.nombre}»: ${rengNombreU(rengOtra.uy)} → ${rengNombreU(rengRef.uy)}`)
  const rengConv: RengSerieXY = { nombre: rengOtra.nombre, x: rengX, y: rengY, ux: rengRef.ux, uy: rengRef.uy }
  const rengAdvertencias: string[] = []
  const rengMismoNombre = (rengP: string | undefined, rengQ: string | undefined): boolean => rengP === undefined || rengQ === undefined || rengP.trim().toLowerCase() === rengQ.trim().toLowerCase()
  if (rengRef.uy === '' && rengOtra.uy === '' && !rengMismoNombre(rengRef.ny, rengOtra.ny)) rengAdvertencias.push(`Las dos y son adimensionales pero se llaman distinto («${rengRef.ny}» frente a «${rengOtra.ny}»): comprueba que midan la misma magnitud antes de interpretar los residuos.`)
  if (rengRef.ux === '' && rengOtra.ux === '' && !rengMismoNombre(rengRef.nx, rengOtra.nx)) rengAdvertencias.push(`Las dos x son adimensionales pero se llaman distinto («${rengRef.nx}» frente a «${rengOtra.nx}»): comprueba que sean el mismo eje.`)
  const rengA = Math.max(rengRef.x[0]!, rengX[0]!)
  const rengB = Math.min(rengRef.x[rengRef.x.length - 1]!, rengX[rengX.length - 1]!)
  if (!(rengA <= rengB)) return { ok: false, motivo: `Las series no se solapan en x: «${rengRef.nombre}» cubre [${rengFmt(rengRef.x[0]!)}, ${rengFmt(rengRef.x[rengRef.x.length - 1]!)}] y «${rengOtra.nombre}» [${rengFmt(rengX[0]!)}, ${rengFmt(rengX[rengX.length - 1]!)}] ${rengNombreU(rengRef.ux)}.` }
  const rengPuntos: RengPuntoComparado[] = []
  for (let rengI = 0; rengI < rengX.length; rengI++) {
    const rengXi = rengX[rengI]!
    if (rengXi < rengA || rengXi > rengB) continue
    const rengR = rengInterpolar(rengRef.x, rengRef.y, rengXi)
    if (!Number.isFinite(rengR)) continue
    rengPuntos.push({ x: rengXi, ref: rengR, otra: rengY[rengI]!, residuo: rengY[rengI]! - rengR })
  }
  if (rengPuntos.length === 0) return { ok: false, motivo: 'No hay puntos de la segunda serie dentro del intervalo común.' }
  const rengMismos = rengX.length === rengRef.x.length && rengX.every((rengV, rengI) => rengV === rengRef.x[rengI])
  const rengExcluidos = rengX.length - rengPuntos.length
  const rengTextoExcluidos = rengExcluidos > 0 ? ` ${rengExcluidos} de los ${rengX.length} puntos de «${rengOtra.nombre}» quedan fuera del intervalo común y no se usaron: no se extrapola «${rengRef.nombre}» más allá de sus datos.` : ' Todos los puntos de la segunda serie cayeron dentro del intervalo común.'
  const rengMetodo = (rengMismos
    ? `Mismos puntos de muestreo: residuos punto a punto, sin interpolar (${rengPuntos.length} puntos).`
    : `Interpolación lineal de «${rengRef.nombre}» en los ${rengPuntos.length} valores de x de «${rengOtra.nombre}» dentro del intervalo común [${rengFmt(rengA)}, ${rengFmt(rengB)}] ${rengNombreU(rengRef.ux)}.`) + rengTextoExcluidos
  const rengN = rengPuntos.length
  const rengRmse = Math.sqrt(rengPuntos.reduce((rengS, rengP) => rengS + rengP.residuo * rengP.residuo, 0) / rengN)
  const rengMae = rengPuntos.reduce((rengS, rengP) => rengS + Math.abs(rengP.residuo), 0) / rengN
  const rengMaxAbs = rengPuntos.reduce((rengM, rengP) => Math.max(rengM, Math.abs(rengP.residuo)), 0)
  return { ok: true, ref: rengRef, otra: rengConv, conversiones: rengConversiones, metodo: rengMetodo, advertencias: rengAdvertencias, excluidos: rengExcluidos, intervalo: [rengA, rengB], puntos: rengPuntos, n: rengN, rmse: rengRmse, mae: rengMae, maxAbs: rengMaxAbs, unidad: rengRef.uy }
}
