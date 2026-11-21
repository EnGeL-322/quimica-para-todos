export type RengEscala = (rengV: number) => number

export function rengEscalaLineal(rengD0: number, rengD1: number, rengR0: number, rengR1: number): RengEscala {
  if (![rengD0, rengD1, rengR0, rengR1].every(Number.isFinite)) throw new Error('Escala con valores no finitos')
  if (rengD0 === rengD1) throw new Error('Escala con dominio de ancho cero')
  const rengK = (rengR1 - rengR0) / (rengD1 - rengD0)
  return (rengV) => rengR0 + (rengV - rengD0) * rengK
}

export function rengPasoBonito(rengIntervalo: number, rengObjetivo: number): number {
  if (!(rengIntervalo > 0) || !Number.isFinite(rengIntervalo) || rengObjetivo < 1) throw new Error('Intervalo de eje no válido')
  const rengBruto = rengIntervalo / rengObjetivo
  const rengPotencia = 10 ** Math.floor(Math.log10(rengBruto))
  const rengFraccion = rengBruto / rengPotencia
  const rengFactor = rengFraccion <= 1 ? 1 : rengFraccion <= 2 ? 2 : rengFraccion <= 5 ? 5 : 10
  return rengFactor * rengPotencia
}

export function rengMarcasEje(rengMin: number, rengMax: number, rengObjetivo = 5): number[] {
  if (!Number.isFinite(rengMin) || !Number.isFinite(rengMax) || rengMax <= rengMin) throw new Error('Eje con extremos no válidos')
  const rengPaso = rengPasoBonito(rengMax - rengMin, rengObjetivo)
  const rengDecimales = Math.max(0, -Math.floor(Math.log10(rengPaso)) + 1)
  const rengInicio = Math.ceil(rengMin / rengPaso - 1e-9)
  const rengFin = Math.floor(rengMax / rengPaso + 1e-9)
  const rengMarcas: number[] = []
  for (let rengI = rengInicio; rengI <= rengFin; rengI++) rengMarcas.push(Number((rengI * rengPaso).toFixed(rengDecimales)))
  return rengMarcas
}

export function rengFormatoEje(rengV: number): string {
  if (!Number.isFinite(rengV)) return '—'
  if (rengV === 0) return '0'
  const rengA = Math.abs(rengV)
  const rengTexto = rengA >= 1e5 || rengA < 1e-3 ? rengV.toExponential(1).replace('e', '·10^') : String(Number(rengV.toPrecision(4)))
  return rengTexto.replace('.', ',').replace('-', '−')
}

export interface RengNivelEntrada {
  id: string
  valor: number
  etiqueta: string
}

export interface RengNivelDispuesto {
  id: string
  y: number
  yEtiqueta: number
  etiqueta: string
}

export function rengDisponerNiveles(rengNiveles: readonly RengNivelEntrada[], rengArriba: number, rengAbajo: number, rengSeparacion: number): RengNivelDispuesto[] {
  if (rengNiveles.length === 0) return []
  if (!(rengAbajo > rengArriba) || !(rengSeparacion > 0)) throw new Error('Diagrama de niveles con geometría no válida')
  if (!rengNiveles.every((rengN) => Number.isFinite(rengN.valor))) throw new Error('Nivel con valor no finito')
  if (new Set(rengNiveles.map((rengN) => rengN.id)).size !== rengNiveles.length) throw new Error('Niveles con id repetido')
  const rengValores = rengNiveles.map((rengN) => rengN.valor)
  const rengMin = Math.min(...rengValores)
  const rengMax = Math.max(...rengValores)
  const rengEscala = rengMin === rengMax ? () => (rengArriba + rengAbajo) / 2 : rengEscalaLineal(rengMin, rengMax, rengAbajo, rengArriba)
  const rengOrden = rengNiveles.map((rengN) => ({ id: rengN.id, etiqueta: rengN.etiqueta, y: rengEscala(rengN.valor) })).sort((rengA, rengB) => rengB.y - rengA.y)
  const rengEtiquetas = rengOrden.map((rengN) => rengN.y)
  for (let rengI = 1; rengI < rengEtiquetas.length; rengI++) rengEtiquetas[rengI] = Math.min(rengEtiquetas[rengI]!, rengEtiquetas[rengI - 1]! - rengSeparacion)
  const rengExceso = rengArriba - rengEtiquetas[rengEtiquetas.length - 1]!
  if (rengExceso > 0) {
    for (let rengI = rengEtiquetas.length - 1; rengI >= 0; rengI--) rengEtiquetas[rengI] = rengEtiquetas[rengI]! + rengExceso
    for (let rengI = rengEtiquetas.length - 2; rengI >= 0; rengI--) rengEtiquetas[rengI] = Math.max(rengEtiquetas[rengI]!, rengEtiquetas[rengI + 1]! + rengSeparacion)
  }
  return rengOrden.map((rengN, rengI) => ({ id: rengN.id, etiqueta: rengN.etiqueta, y: rengN.y, yEtiqueta: rengEtiquetas[rengI]! }))
}

export type RengTipoFlecha = 'directa' | 'equilibrio' | 'resonancia'

export interface RengGeometriaFlecha {
  trazos: string[]
  puntas: string[]
}

const rengP = (rengX: number, rengY: number): string => `${Number(rengX.toFixed(2))},${Number(rengY.toFixed(2))}`

export function rengGeometriaFlecha(rengTipo: RengTipoFlecha, rengX0: number, rengX1: number, rengY: number, rengPunta = 7): RengGeometriaFlecha {
  if (![rengX0, rengX1, rengY, rengPunta].every(Number.isFinite) || rengX1 - rengX0 <= 2 * rengPunta) throw new Error('Flecha demasiado corta o no finita')
  const rengMedia = rengPunta * 0.55
  if (rengTipo === 'directa') {
    return {
      trazos: [`M${rengP(rengX0, rengY)} L${rengP(rengX1 - rengPunta, rengY)}`],
      puntas: [`${rengP(rengX1, rengY)} ${rengP(rengX1 - rengPunta, rengY - rengMedia)} ${rengP(rengX1 - rengPunta, rengY + rengMedia)}`]
    }
  }
  if (rengTipo === 'resonancia') {
    return {
      trazos: [`M${rengP(rengX0 + rengPunta, rengY)} L${rengP(rengX1 - rengPunta, rengY)}`],
      puntas: [
        `${rengP(rengX1, rengY)} ${rengP(rengX1 - rengPunta, rengY - rengMedia)} ${rengP(rengX1 - rengPunta, rengY + rengMedia)}`,
        `${rengP(rengX0, rengY)} ${rengP(rengX0 + rengPunta, rengY - rengMedia)} ${rengP(rengX0 + rengPunta, rengY + rengMedia)}`
      ]
    }
  }
  const rengSep = rengPunta * 0.45
  return {
    trazos: [`M${rengP(rengX0, rengY - rengSep)} L${rengP(rengX1, rengY - rengSep)}`, `M${rengP(rengX0, rengY + rengSep)} L${rengP(rengX1, rengY + rengSep)}`],
    puntas: [
      `${rengP(rengX1, rengY - rengSep)} ${rengP(rengX1 - rengPunta, rengY - rengSep - rengMedia)} ${rengP(rengX1 - rengPunta, rengY - rengSep)}`,
      `${rengP(rengX0, rengY + rengSep)} ${rengP(rengX0 + rengPunta, rengY + rengSep + rengMedia)} ${rengP(rengX0 + rengPunta, rengY + rengSep)}`
    ]
  }
}

export const RENG_NOMBRE_FLECHA: Record<RengTipoFlecha, string> = {
  directa: 'flecha de reacción en un sentido',
  equilibrio: 'flechas de equilibrio (la reacción ocurre en los dos sentidos)',
  resonancia: 'flecha de resonancia (dos formas de escribir la misma especie, no una reacción)'
}

export interface RengSerieFigura {
  nombre: string
  puntos: ReadonlyArray<readonly [number, number]>
}

export function rengRutaSerie(rengS: RengSerieFigura, rengX: RengEscala, rengY: RengEscala): string {
  const rengValidos = rengS.puntos.filter(([rengA, rengB]) => Number.isFinite(rengA) && Number.isFinite(rengB))
  if (rengValidos.length !== rengS.puntos.length) throw new Error(`La serie «${rengS.nombre}» tiene puntos no finitos`)
  return rengValidos.map(([rengA, rengB], rengI) => `${rengI === 0 ? 'M' : 'L'}${rengP(rengX(rengA), rengY(rengB))}`).join(' ')
}
