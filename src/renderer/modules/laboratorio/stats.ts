export interface RengDescriptiva {
  n: number
  suma: number
  media: number
  mediana: number
  moda: number[]
  min: number
  max: number
  rango: number
  q1: number
  q3: number
  varianzaMuestral: number
  desvMuestral: number
  desvPoblacional: number
  errorEstandar: number
  indeterminadas: Partial<Record<'varianzaMuestral' | 'desvMuestral' | 'errorEstandar', string>>
}

export const RENG_MAX_NUMEROS = 1_000_000

export type RengFormatoDecimal = 'punto' | 'coma'

export interface RengLecturaNumeros {
  numeros: number[]
  invalidos: Array<{ texto: string; posicion: number }>
  totalInvalidos: number
  recorte: string | null
}

const RENG_NUM = /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/

export function rengLeerNumeros(rengTexto: string, rengFormato: RengFormatoDecimal = 'punto'): RengLecturaNumeros {
  const rengSep = rengFormato === 'punto' ? /[\s;,]+/ : /[\s;]+/
  const rengFragmentos = rengTexto.replace(/[−–]/g, '-').split(rengSep).filter(Boolean)
  const rengNumeros: number[] = []
  const rengInvalidos: RengLecturaNumeros['invalidos'] = []
  let rengTotalInvalidos = 0
  let rengRecorte: string | null = null
  for (const [rengI, rengF] of rengFragmentos.entries()) {
    if (rengNumeros.length >= RENG_MAX_NUMEROS) {
      rengRecorte = `Se leyeron los primeros ${RENG_MAX_NUMEROS.toLocaleString('es')} números (máximo admitido); el resto se ignoró.`
      break
    }
    const rengT = rengFormato === 'coma' ? (rengF.includes('.') ? '·' : rengF.replace(',', '.')) : rengF
    const rengN = RENG_NUM.test(rengT) ? Number(rengT) : NaN
    if (Number.isFinite(rengN)) rengNumeros.push(rengN)
    else {
      rengTotalInvalidos++
      if (rengInvalidos.length < 20) rengInvalidos.push({ texto: rengF.slice(0, 30), posicion: rengI + 1 })
    }
  }
  return { numeros: rengNumeros, invalidos: rengInvalidos, totalInvalidos: rengTotalInvalidos, recorte: rengRecorte }
}

export const rengParseNumeros = (rengTexto: string, rengFormato: RengFormatoDecimal = 'punto'): number[] => rengLeerNumeros(rengTexto, rengFormato).numeros

export function rengCuantil(rengOrdenado: number[], rengQ: number): number {
  const rengPos = (rengOrdenado.length - 1) * rengQ
  const rengLo = Math.floor(rengPos)
  const rengHi = Math.ceil(rengPos)
  return (rengOrdenado[rengLo] as number) + ((rengOrdenado[rengHi] as number) - (rengOrdenado[rengLo] as number)) * (rengPos - rengLo)
}

export function rengDescriptiva(rengDatos: number[]): RengDescriptiva {
  if (rengDatos.length === 0) throw new Error('No hay datos.')
  const rengS = [...rengDatos].sort((rengA, rengB) => rengA - rengB)
  const rengN = rengS.length
  const rengSuma = rengS.reduce((rengA, rengB) => rengA + rengB, 0)
  const rengMedia = rengSuma / rengN
  const rengSs = rengS.reduce((rengA, rengB) => rengA + (rengB - rengMedia) ** 2, 0)
  const rengConteo = new Map<number, number>()
  for (const rengV of rengS) rengConteo.set(rengV, (rengConteo.get(rengV) ?? 0) + 1)
  let rengMaxC = 0
  for (const rengC of rengConteo.values()) if (rengC > rengMaxC) rengMaxC = rengC
  const rengModa = rengMaxC > 1 ? [...rengConteo.entries()].filter(([, rengC]) => rengC === rengMaxC).map(([rengV]) => rengV) : []
  const rengVarM = rengN > 1 ? rengSs / (rengN - 1) : NaN
  const rengIndeterminadas: RengDescriptiva['indeterminadas'] = {}
  if (rengN === 1) {
    const rengMotivo = 'con un solo dato no hay dispersión muestral (se divide por n − 1 = 0)'
    rengIndeterminadas.varianzaMuestral = rengMotivo
    rengIndeterminadas.desvMuestral = rengMotivo
    rengIndeterminadas.errorEstandar = rengMotivo
  }
  return {
    n: rengN, suma: rengSuma, media: rengMedia, mediana: rengCuantil(rengS, 0.5), moda: rengModa, min: rengS[0] as number, max: rengS[rengN - 1] as number, rango: (rengS[rengN - 1] as number) - (rengS[0] as number),
    q1: rengCuantil(rengS, 0.25), q3: rengCuantil(rengS, 0.75), varianzaMuestral: rengVarM, desvMuestral: Math.sqrt(rengVarM), desvPoblacional: Math.sqrt(rengSs / rengN), errorEstandar: Math.sqrt(rengVarM / rengN),
    indeterminadas: rengIndeterminadas
  }
}

export interface RengRegresion {
  pendiente: number
  intercepto: number
  r: number
  r2: number
  n: number
  indeterminado: string | null
}

export function rengRegresionLineal(rengX: number[], rengY: number[]): RengRegresion {
  const rengN = Math.min(rengX.length, rengY.length)
  if (rengN < 2) throw new Error('Se necesitan al menos 2 puntos.')
  const rengMx = rengX.slice(0, rengN).reduce((rengA, rengB) => rengA + rengB, 0) / rengN
  const rengMy = rengY.slice(0, rengN).reduce((rengA, rengB) => rengA + rengB, 0) / rengN
  let rengSxy = 0, rengSxx = 0, rengSyy = 0
  for (let rengI = 0; rengI < rengN; rengI++) {
    const rengDx = (rengX[rengI] as number) - rengMx
    const rengDy = (rengY[rengI] as number) - rengMy
    rengSxy += rengDx * rengDy
    rengSxx += rengDx * rengDx
    rengSyy += rengDy * rengDy
  }
  if (rengSxx === 0) throw new Error('Todos los valores de x son iguales: no se puede ajustar una recta.')
  const rengPendiente = rengSxy / rengSxx
  if (rengSyy === 0) return { pendiente: rengPendiente, intercepto: rengMy - rengPendiente * rengMx, r: NaN, r2: NaN, n: rengN, indeterminado: 'Todos los valores de y son iguales: la recta ajustada es horizontal y exacta, pero r y R² no están definidos (no hay variación de y que explicar).' }
  const rengR = rengSxy / Math.sqrt(rengSxx * rengSyy)
  return { pendiente: rengPendiente, intercepto: rengMy - rengPendiente * rengMx, r: rengR, r2: rengR * rengR, n: rengN, indeterminado: null }
}

export function rengHistograma(rengDatos: number[]): Array<{ desde: number; hasta: number; cuenta: number }> {
  const rengS = [...rengDatos].sort((rengA, rengB) => rengA - rengB)
  const rengLo = rengS[0] as number
  const rengHi = rengS[rengS.length - 1] as number
  if (rengHi === rengLo) return [{ desde: rengLo, hasta: rengHi, cuenta: rengS.length }]
  const rengK = Math.max(1, Math.ceil(Math.log2(rengS.length) + 1))
  const rengW = (rengHi - rengLo) / rengK || 1
  const rengBins = Array.from({ length: rengK }, (_, rengI) => ({ desde: rengLo + rengI * rengW, hasta: rengLo + (rengI + 1) * rengW, cuenta: 0 }))
  for (const rengV of rengS) rengBins[Math.min(rengK - 1, Math.floor((rengV - rengLo) / rengW))]!.cuenta++
  return rengBins
}
