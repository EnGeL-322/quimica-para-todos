export interface RengEntrada<RengT> {
  id: string
  valor: RengT
  grupo: string
  simbolos?: readonly string[]
  nombres?: readonly string[]
  alias?: readonly string[]
  grupos?: readonly string[]
  descripcion?: readonly string[]
}

export interface RengResultado<RengT> {
  entrada: RengEntrada<RengT>
  puntos: number
  indice: number
}

const RENG_SUPER: Readonly<Record<string, string>> = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '₀': '0', '₁': '1', '₂': '2' }

function rengNormChar(rengC: string): string {
  if (RENG_SUPER[rengC] !== undefined) return RENG_SUPER[rengC]!
  if (rengC === '^') return ''
  if (rengC === '·' || rengC === '⋅' || rengC === '•' || rengC === '*') return '*'
  if (rengC === 'µ' || rengC === 'μ') return 'u'
  if (rengC === 'º') return '°'
  if (/\s/.test(rengC)) return ' '
  return rengC.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function rengNormalizarConMapa(rengTexto: string): { t: string; mapa: number[] } {
  let rengT = ''
  const rengMapa: number[] = []
  let rengI = 0
  for (const rengC of rengTexto) {
    const rengN = rengNormChar(rengC)
    for (const rengX of rengN) {
      if (rengX === ' ' && (rengT === '' || rengT.endsWith(' '))) continue
      rengT += rengX
      rengMapa.push(rengI)
    }
    rengI += rengC.length
  }
  if (rengT.endsWith(' ')) {
    rengT = rengT.slice(0, -1)
    rengMapa.pop()
  }
  return { t: rengT, mapa: rengMapa }
}

export const rengNormalizar = (rengTexto: string): string => rengNormalizarConMapa(rengTexto).t

export const rengTokenizar = (rengTexto: string): string[] => rengNormalizar(rengTexto).split(/[\s,;]+/).filter(Boolean)

export function rengDistancia(rengA: string, rengB: string, rengMax = 2): number {
  if (Math.abs(rengA.length - rengB.length) > rengMax) return rengMax + 1
  let rengPrev = Array.from({ length: rengB.length + 1 }, (_, rengJ) => rengJ)
  for (let rengI = 1; rengI <= rengA.length; rengI++) {
    const rengCur = [rengI]
    let rengMinFila = rengI
    for (let rengJ = 1; rengJ <= rengB.length; rengJ++) {
      const rengV = Math.min(rengPrev[rengJ]! + 1, rengCur[rengJ - 1]! + 1, rengPrev[rengJ - 1]! + (rengA[rengI - 1] === rengB[rengJ - 1] ? 0 : 1))
      rengCur.push(rengV)
      rengMinFila = Math.min(rengMinFila, rengV)
    }
    if (rengMinFila > rengMax) return rengMax + 1
    rengPrev = rengCur
  }
  return rengPrev[rengB.length]!
}

const rengErratasPermitidas = (rengN: number): number => (rengN >= 8 ? 2 : rengN >= 4 ? 1 : 0)

const rengPalabras = (rengXs: readonly string[]): string[] => rengXs.flatMap((rengX) => rengNormalizar(rengX).split(/[\s/()*,]+/)).filter(Boolean)

export function rengPuntuar<RengT>(rengE: RengEntrada<RengT>, rengConsulta: string): number {
  const rengQ = rengNormalizar(rengConsulta)
  if (!rengQ) return 0
  const RENG_S = (rengE.simbolos ?? []).map(rengNormalizar)
  const RENG_N = (rengE.nombres ?? []).map(rengNormalizar)
  const RENG_A = (rengE.alias ?? []).map(rengNormalizar)
  const RENG_G = (rengE.grupos ?? []).map(rengNormalizar)
  const RENG_D = (rengE.descripcion ?? []).map(rengNormalizar)
  if (RENG_S.includes(rengQ)) return 1000
  if (RENG_G.includes(rengQ)) return 750
  if (RENG_N.includes(rengQ)) return 700
  if (RENG_A.includes(rengQ)) return 650
  if (RENG_S.some((rengS) => rengS.startsWith(rengQ))) return 600
  if (RENG_N.some((rengS) => rengS.startsWith(rengQ))) return 550
  if (RENG_A.some((rengS) => rengS.startsWith(rengQ))) return 500
  if (RENG_G.some((rengS) => rengS.startsWith(rengQ) || rengS.split(' ').some((rengW) => rengW.startsWith(rengQ)))) return 400
  const rengMax = rengErratasPermitidas(rengQ.length)
  if (rengMax > 0) {
    const rengD = Math.min(...[...RENG_N, ...RENG_A].map((rengS) => rengDistancia(rengQ, rengS, rengMax)), ...[...RENG_N, ...RENG_A, ...RENG_G].flatMap((rengS) => rengS.split(' ')).map((rengW) => (rengW.length >= 4 ? rengDistancia(rengQ, rengW, rengMax) : rengMax + 1)))
    if (rengD <= rengMax) return 300 - 50 * rengD
  }
  const rengTk = rengQ.split(' ').filter(Boolean)
  const rengTodas = rengPalabras([...(rengE.simbolos ?? []), ...(rengE.nombres ?? []), ...(rengE.alias ?? []), ...(rengE.grupos ?? [])])
  if (rengTk.length > 1 && rengTk.every((rengT) => rengTodas.some((rengW) => rengW.startsWith(rengT) || (rengT.length >= 4 && rengDistancia(rengT, rengW, 1) <= 1)))) return 200
  if (RENG_D.some((rengS) => rengS.includes(rengQ))) return 100
  return 0
}

export function rengBuscar<RengT>(rengEntradas: readonly RengEntrada<RengT>[], rengConsulta: string, rengMax = 50): RengResultado<RengT>[] {
  return rengEntradas
    .map((rengEntrada, rengIndice) => ({ entrada: rengEntrada, puntos: rengPuntuar(rengEntrada, rengConsulta), indice: rengIndice }))
    .filter((rengR) => rengR.puntos > 0)
    .sort((rengA, rengB) => rengB.puntos - rengA.puntos || rengA.indice - rengB.indice)
    .slice(0, rengMax)
}

export function rengAgrupar<RengT>(rengRs: readonly RengResultado<RengT>[]): Array<{ grupo: string; resultados: RengResultado<RengT>[] }> {
  const rengM = new Map<string, RengResultado<RengT>[]>()
  for (const rengR of rengRs) rengM.set(rengR.entrada.grupo, [...(rengM.get(rengR.entrada.grupo) ?? []), rengR])
  return [...rengM.entries()].map(([rengGrupo, rengResultados]) => ({ grupo: rengGrupo, resultados: rengResultados }))
}

export function rengGruposCercanos(rengNombres: readonly string[], rengConsulta: string, rengN = 4): string[] {
  const rengQ = rengNormalizar(rengConsulta)
  if (!rengQ) return []
  return [...new Set(rengNombres)]
    .map((rengG) => {
      const rengW = rengNormalizar(rengG)
      const rengD = Math.min(rengDistancia(rengQ, rengW, 4), ...rengW.split(' ').map((rengX) => rengDistancia(rengQ, rengX, 4)), rengW.includes(rengQ.slice(0, 3)) ? 2 : 9)
      return { g: rengG, d: rengD }
    })
    .filter((rengX) => rengX.d <= 4)
    .sort((rengA, rengB) => rengA.d - rengB.d)
    .slice(0, rengN)
    .map((rengX) => rengX.g)
}

export function rengResaltar(rengTexto: string, rengConsulta: string): Array<{ t: string; m: boolean }> {
  const { t: rengT, mapa: rengMapa } = rengNormalizarConMapa(rengTexto)
  const rengMarcas = new Array<boolean>(rengTexto.length).fill(false)
  const rengQ = rengNormalizar(rengConsulta)
  const rengPiezas = rengQ && rengT.includes(rengQ) ? [rengQ] : rengQ.split(' ').filter((rengX) => rengX.length > 0)
  for (const rengP of rengPiezas) {
    let rengDesde = 0
    for (;;) {
      const rengK = rengT.indexOf(rengP, rengDesde)
      if (rengK < 0) break
      const rengIni = rengMapa[rengK]!
      const rengFin = rengK + rengP.length - 1 < rengMapa.length ? rengMapa[rengK + rengP.length - 1]! : rengTexto.length - 1
      for (let rengI = rengIni; rengI <= rengFin; rengI++) rengMarcas[rengI] = true
      rengDesde = rengK + rengP.length
    }
  }
  const rengOut: Array<{ t: string; m: boolean }> = []
  for (let rengI = 0; rengI < rengTexto.length; rengI++) {
    const rengM = rengMarcas[rengI]!
    const rengUlt = rengOut[rengOut.length - 1]
    if (rengUlt && rengUlt.m === rengM) rengUlt.t += rengTexto[rengI]
    else rengOut.push({ t: rengTexto[rengI]!, m: rengM })
  }
  return rengOut
}
