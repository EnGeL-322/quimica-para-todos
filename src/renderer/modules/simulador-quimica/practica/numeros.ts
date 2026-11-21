const RENG_SUPER: Readonly<Record<string, string>> = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' }

export type RengLecturaNumero = { ok: true; valor: number } | { ok: false; motivo: 'vacio' | 'ilegible' | 'separador-ambiguo' }

function rengMantisa(rengT: string): RengLecturaNumero {
  if (!/^[+-]?[\d.,]*\d[\d.,]*$/.test(rengT)) return { ok: false, motivo: 'ilegible' }
  const rengSigno = rengT.startsWith('-') ? -1 : 1
  const rengCuerpo = rengT.replace(/^[+-]/, '')
  const rengPuntos = (rengCuerpo.match(/\./g) ?? []).length
  const rengComas = (rengCuerpo.match(/,/g) ?? []).length
  const rengMilesValidos = (rengS: string, rengSep: string): boolean => {
    const rengGrupos = rengS.split(rengSep)
    return rengGrupos.length > 1 && /^\d{1,3}$/.test(rengGrupos[0]!) && rengGrupos[0] !== '0' && rengGrupos.slice(1).every((rengG) => /^\d{3}$/.test(rengG))
  }
  let rengTexto: string
  if (rengPuntos > 0 && rengComas > 0) {
    const rengDecimal = rengCuerpo.lastIndexOf('.') > rengCuerpo.lastIndexOf(',') ? '.' : ','
    const rengMiles = rengDecimal === '.' ? ',' : '.'
    const rengPartes = rengCuerpo.split(rengDecimal)
    if (rengPartes.length !== 2 || rengPartes[1]!.includes(rengMiles) || !rengMilesValidos(rengPartes[0]!, rengMiles)) return { ok: false, motivo: 'ilegible' }
    rengTexto = rengPartes[0]!.split(rengMiles).join('') + '.' + rengPartes[1]
  } else if (rengPuntos + rengComas > 1) {
    const rengSep = rengPuntos > 0 ? '.' : ','
    if (!rengMilesValidos(rengCuerpo, rengSep)) return { ok: false, motivo: 'ilegible' }
    rengTexto = rengCuerpo.split(rengSep).join('')
  } else if (rengPuntos + rengComas === 1) {
    const rengSep = rengPuntos > 0 ? '.' : ','
    const [rengEntera, rengFraccion = ''] = rengCuerpo.split(rengSep)
    if (rengSep === '.' && rengFraccion.length === 3 && /^[1-9]\d{0,2}$/.test(rengEntera!)) return { ok: false, motivo: 'separador-ambiguo' }
    rengTexto = `${rengEntera === '' ? '0' : rengEntera}.${rengFraccion}`
  } else rengTexto = rengCuerpo
  const rengN = Number(rengTexto)
  return Number.isFinite(rengN) ? { ok: true, valor: rengSigno * rengN } : { ok: false, motivo: 'ilegible' }
}

const RENG_EXPONENTE = /^(.*?)\s*(?:[eE]\s*([+-]?\d+)|[×x*·]\s*10\s*(?:\^\s*\(?([+-]?\d+)\)?|([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)))$/

export function rengLeerNumeroEs(rengEntrada: string): RengLecturaNumero {
  const rengT = rengEntrada.trim().replace(/−/g, '-').replace(/\s+/g, ' ')
  if (rengT === '') return { ok: false, motivo: 'vacio' }
  const rengFraccion = /^([+-]?\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)$/.exec(rengT)
  if (rengFraccion) {
    const rengA = rengMantisa(rengFraccion[1]!)
    const rengB = rengMantisa(rengFraccion[2]!)
    if (!rengA.ok) return rengA
    if (!rengB.ok) return rengB
    return rengB.valor === 0 ? { ok: false, motivo: 'ilegible' } : { ok: true, valor: rengA.valor / rengB.valor }
  }
  const rengE = RENG_EXPONENTE.exec(rengT)
  if (rengE) {
    const rengM = rengMantisa(rengE[1]!.replace(/\s/g, ''))
    if (!rengM.ok) return rengM
    const rengExp = rengE[2] ?? rengE[3] ?? [...(rengE[4] ?? '')].map((rengC) => RENG_SUPER[rengC] ?? rengC).join('')
    const rengN = Number(rengExp)
    return Number.isFinite(rengN) ? { ok: true, valor: rengM.valor * 10 ** rengN } : { ok: false, motivo: 'ilegible' }
  }
  return rengMantisa(rengT.replace(/\s/g, ''))
}

export interface RengNumeroConUnidad {
  valor: number
  unidad: string
}

export type RengLecturaConUnidad = ({ ok: true } & RengNumeroConUnidad) | { ok: false; motivo: 'vacio' | 'ilegible' | 'separador-ambiguo' }

const RENG_ALIAS_UNIDAD: ReadonlyArray<[RegExp, string]> = [
  [/\bM\b/g, 'mol/L'],
  [/\bmolar\b/gi, 'mol/L'],
  [/\bppm\b/gi, 'mg/kg']
]

export const rengNormalizarUnidad = (rengU: string): string => RENG_ALIAS_UNIDAD.reduce((rengS, [rengR, rengA]) => rengS.replace(rengR, rengA), rengU.trim())

export function rengSepararNumeroUnidad(rengEntrada: string): RengLecturaConUnidad {
  const rengT = rengEntrada.trim().replace(/−/g, '-')
  if (rengT === '') return { ok: false, motivo: 'vacio' }
  const rengM = /^([+-]?(?:\d[\d.,]*|[.,]\d+)(?:\s*(?:[eE][+-]?\d+|[×x*·]\s*10\s*(?:\^\s*\(?[+-]?\d+\)?|[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)))?(?:\s*\/\s*\d+(?:[.,]\d+)?)?)\s*(.*)$/.exec(rengT)
  if (!rengM) return { ok: false, motivo: 'ilegible' }
  const rengLectura = rengLeerNumeroEs(rengM[1]!.trim())
  if (!rengLectura.ok) return rengLectura
  return { ok: true, valor: rengLectura.valor, unidad: rengNormalizarUnidad(rengM[2] ?? '') }
}

export function rengRedondearCifras(rengX: number, rengCifras: number): number {
  if (!Number.isFinite(rengX) || rengX === 0) return rengX
  return Number(rengX.toPrecision(Math.max(1, Math.min(15, rengCifras))))
}

export const rengRedondearDecimales = (rengX: number, rengDecimales: number): number => (Number.isFinite(rengX) ? Number(rengX.toFixed(Math.max(0, Math.min(12, rengDecimales)))) : rengX)

export function rengTextoNumero(rengX: number, rengCifras = 3): string {
  if (!Number.isFinite(rengX)) return '—'
  if (rengX === 0) return '0'
  const rengA = Math.abs(rengX)
  if (rengA >= 1e5 || rengA < 1e-3) {
    const [rengM, rengE] = rengX.toExponential(Math.max(0, rengCifras - 1)).split('e')
    return `${rengM!.replace('.', ',')}·10${rengE!.replace('+', '').replace(/(-?)(\d+)/, (_, rengS: string, rengD: string) => `${rengS ? '⁻' : ''}${[...rengD].map((rengC) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(rengC)]).join('')}`)}`
  }
  const rengDecimales = Math.max(0, rengCifras - 1 - Math.floor(Math.log10(rengA)))
  return rengX.toFixed(Math.min(12, rengDecimales)).replace('.', ',')
}

export const rengTextoDecimales = (rengX: number, rengDecimales: number): string => rengX.toFixed(Math.max(0, rengDecimales)).replace('.', ',')

export function rengCrearAzar(rengSemilla: number): () => number {
  let rengA = rengSemilla >>> 0
  return () => {
    rengA = (rengA + 0x6d2b79f5) >>> 0
    let rengT = rengA
    rengT = Math.imul(rengT ^ (rengT >>> 15), rengT | 1)
    rengT ^= rengT + Math.imul(rengT ^ (rengT >>> 7), rengT | 61)
    return ((rengT ^ (rengT >>> 14)) >>> 0) / 4294967296
  }
}

export const rengElegir = <RengT,>(rengAzar: () => number, rengLista: readonly RengT[]): RengT => rengLista[Math.floor(rengAzar() * rengLista.length)]!

export const rengEntre = (rengAzar: () => number, rengMin: number, rengMax: number, rengPaso: number): number => {
  const rengN = Math.round((rengMax - rengMin) / rengPaso)
  return Number((rengMin + Math.floor(rengAzar() * (rengN + 1)) * rengPaso).toFixed(10))
}
