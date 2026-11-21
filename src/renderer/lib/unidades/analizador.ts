import { rengMagnitud, rengMagnitudDeSimbolo, RENG_MAGNITUDES, RENG_PREFIJOS, type RengMagnitud, type RengUnidad } from './catalogo'
import { RENG_ADIMENSIONAL, rengDimDiv, rengDimIgual, rengDimMul, rengDimPow, type RengDimension } from './dimension'

export interface RengUnidadAnalizada {
  texto: string
  factor: number
  desplazamiento: number
  dimension: RengDimension
  unidad: RengUnidad | null
}

export interface RengUnidadPropia {
  simbolo: string
  nombre: string
  factor: number
  dimension: RengDimension
  definicion: string
}

let RENG_PROPIAS: readonly RengUnidadPropia[] = []
export function rengFijarUnidadesPropias(rengUs: readonly RengUnidadPropia[]): void {
  RENG_PROPIAS = [...rengUs]
}

export type RengResultadoUnidad = { ok: true; u: RengUnidadAnalizada } | { ok: false; error: string }

export const RENG_AMBIGUOS: Readonly<Record<string, string>> = {
  cal: '«cal» es ambiguo: elige caloría termoquímica (cal_th = 4,184 J) o caloría internacional (cal_IT = 4,1868 J).',
  kcal: '«kcal» es ambiguo: elige kcal_th (4184 J) o kcal_IT (4186,8 J).',
  Btu: '«Btu» tiene varias definiciones; aquí se usa BTU_IT (1055,05585262 J).',
  ton: '«ton» es ambiguo (tonelada métrica, corta o larga); usa t (1000 kg).'
}

const RENG_PREFIJABLES: Readonly<Record<string, string>> = {
  m: 'longitud', g: 'masa', s: 'tiempo', N: 'fuerza', J: 'energia', W: 'potencia', Pa: 'presion', Hz: 'frecuencia', C: 'carga', V: 'potencial',
  A: 'corriente', Ω: 'resistencia', F: 'capacidad', H: 'inductancia', T: 'campo_b', L: 'volumen', eV: 'energia', mol: 'cantidad', K: 'temperatura', Wb: 'flujo_b', bar: 'presion'
}

const RENG_SUPER: Readonly<Record<string, string>> = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' }
const rengSinTildes = (rengS: string): string => rengS.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC')
const rengPlano = (rengS: string): string => rengSinTildes(rengS.toLowerCase()).replace(/\s+/g, ' ').trim()

interface RengValor {
  factor: number
  desplazamiento: number
  dimension: RengDimension
  unidad: RengUnidad | null
}

const rengDeUnidad = (rengX: RengUnidad): RengValor => ({ factor: rengX.factor, desplazamiento: rengX.desplazamiento, dimension: (rengMagnitud(rengX.magnitud) as RengMagnitud).dimension, unidad: rengX })

function rengBuscarEntera(rengT: string, rengCtx: RengMagnitud | null): RengUnidad | null {
  const rengEn = (rengMs: readonly RengMagnitud[], rengF: (rengX: RengUnidad) => boolean): RengUnidad | null => {
    for (const rengM of rengMs) {
      const rengX = rengM.unidades.find(rengF)
      if (rengX) return rengX
    }
    return null
  }
  const rengContexto = rengCtx ? [rengCtx] : []
  const rengExacto = (rengX: RengUnidad): boolean => rengX.simbolo === rengT || rengX.alias.includes(rengT)
  const rengR = rengEn(rengContexto, rengExacto)
  if (rengR) return rengR
  const rengPrincipal = rengMagnitudDeSimbolo(rengT)
  if (rengPrincipal) return rengEn([rengPrincipal], rengExacto)
  const rengP = rengPlano(rengT)
  const rengPorNombre = (rengX: RengUnidad): boolean => rengPlano(rengX.nombre) === rengP || rengPlano(rengX.plural) === rengP || rengX.alias.some((rengA) => rengPlano(rengA) === rengP)
  return rengEn(rengContexto, rengPorNombre) ?? rengEn(RENG_MAGNITUDES, rengPorNombre)
}

function rengAtomo(rengT: string, rengCtx: RengMagnitud | null): RengValor | string {
  if (rengT === '1') return { factor: 1, desplazamiento: 0, dimension: RENG_ADIMENSIONAL, unidad: null }
  if (RENG_AMBIGUOS[rengT]) return RENG_AMBIGUOS[rengT]
  const rengX = rengBuscarEntera(rengT, rengCtx)
  if (rengX) return rengDeUnidad(rengX)
  const rengPropia = RENG_PROPIAS.find((rengP) => rengP.simbolo === rengT)
  if (rengPropia) return { factor: rengPropia.factor, desplazamiento: 0, dimension: rengPropia.dimension, unidad: null }
  for (const [rengPref, { factor: rengFactor }] of Object.entries(RENG_PREFIJOS).sort((rengA, rengB) => rengB[0].length - rengA[0].length)) {
    const rengVariantes = rengPref === 'µ' ? ['µ', 'μ', 'u'] : [rengPref]
    for (const rengV of rengVariantes) {
      if (!rengT.startsWith(rengV) || rengT.length <= rengV.length) continue
      const rengBase = rengT.slice(rengV.length)
      const rengMagId = RENG_PREFIJABLES[rengBase]
      const rengUb = rengMagId ? rengMagnitud(rengMagId)?.unidades.find((rengY) => rengY.simbolo === rengBase) : undefined
      if (rengUb) return { factor: rengFactor * rengUb.factor, desplazamiento: 0, dimension: (rengMagnitud(rengMagId!) as RengMagnitud).dimension, unidad: null }
    }
  }
  return `No conozco la unidad «${rengT}».`
}

type RengToken = { k: 'atomo'; v: string } | { k: 'num'; v: number } | { k: '('; v?: undefined } | { k: ')' } | { k: '/' } | { k: '·' } | { k: '^' }

function rengTokenizar(rengTexto: string): RengToken[] | string {
  const rengOut: RengToken[] = []
  let rengI = 0
  const rengS = rengTexto.trim()
  while (rengI < rengS.length) {
    const rengC = rengS[rengI]!
    if (rengC === '(' || rengC === ')' || rengC === '/' || rengC === '^') {
      rengOut.push({ k: rengC } as RengToken)
      rengI++
    } else if (rengC === '·' || rengC === '*' || rengC === '⋅' || rengC === '•' || (rengC === '.' && !/\d/.test(rengS[rengI + 1] ?? ''))) {
      rengOut.push({ k: '·' })
      rengI++
    } else if (/\s/.test(rengC)) {
      let rengJ = rengI
      while (rengJ < rengS.length && /\s/.test(rengS[rengJ]!)) rengJ++
      const rengPrev = rengOut[rengOut.length - 1]
      const rengSig = rengS[rengJ] ?? ''
      if (rengPrev && (rengPrev.k === 'atomo' || rengPrev.k === ')' || rengPrev.k === 'num') && rengSig && !'/·*⋅^)'.includes(rengSig)) rengOut.push({ k: '·' })
      rengI = rengJ
    } else if (RENG_SUPER[rengC] !== undefined) {
      let rengJ = rengI
      let rengN = ''
      while (rengJ < rengS.length && RENG_SUPER[rengS[rengJ]!] !== undefined) rengN += RENG_SUPER[rengS[rengJ++]!]
      if (!/^-?\d+$/.test(rengN)) return `Exponente no válido en «${rengTexto}».`
      rengOut.push({ k: '^' }, { k: 'num', v: Number(rengN) })
      rengI = rengJ
    } else if (/[\d-]/.test(rengC)) {
      const rengM = /^-?\d+(?:\.\d+)?/.exec(rengS.slice(rengI))
      if (!rengM) return `No entiendo «${rengS.slice(rengI)}».`
      const rengPrev = rengOut[rengOut.length - 1]
      if (rengPrev && (rengPrev.k === 'atomo' || rengPrev.k === ')') && !/\s/.test(rengS[rengI - 1] ?? ' ')) rengOut.push({ k: '^' })
      rengOut.push({ k: 'num', v: Number(rengM[0]) })
      rengI += rengM[0].length
    } else {
      let rengJ = rengI
      while (rengJ < rengS.length && !/[()/^·*⋅•\s\d-]/.test(rengS[rengJ]!) && RENG_SUPER[rengS[rengJ]!] === undefined && !(rengS[rengJ] === '.' && !/\d/.test(rengS[rengJ + 1] ?? ''))) rengJ++
      rengOut.push({ k: 'atomo', v: rengS.slice(rengI, rengJ) })
      rengI = rengJ
    }
  }
  return rengOut
}

class RengAnalizador {
  i = 0
  constructor(
    private rengT: RengToken[],
    private rengCtx: RengMagnitud | null
  ) {}
  rengVer(): RengToken | undefined {
    return this.rengT[this.i]
  }
  rengExpresion(): RengValor {
    let rengV = this.rengProducto()
    while (this.rengVer()?.k === '/') {
      this.i++
      rengV = rengDiv(rengV, this.rengProducto())
    }
    return rengV
  }
  rengProducto(): RengValor {
    let rengV = this.factor()
    while (this.rengVer()?.k === '·') {
      this.i++
      rengV = rengMul(rengV, this.factor())
    }
    return rengV
  }
  factor(): RengValor {
    const rengTk = this.rengVer()
    let rengV: RengValor
    if (rengTk?.k === '(') {
      this.i++
      rengV = this.rengExpresion()
      if (this.rengVer()?.k !== ')') throw new Error('Falta cerrar un paréntesis.')
      this.i++
    } else if (rengTk?.k === 'atomo') {
      this.i++
      const rengA = rengAtomo(rengTk.v, this.rengCtx)
      if (typeof rengA === 'string') throw new Error(rengA)
      rengV = rengA
    } else if (rengTk?.k === 'num' && rengTk.v === 1) {
      this.i++
      rengV = { factor: 1, desplazamiento: 0, dimension: RENG_ADIMENSIONAL, unidad: null }
    } else throw new Error(rengTk ? 'Hay un símbolo fuera de lugar.' : 'Falta una unidad.')
    if (this.rengVer()?.k === '^') {
      this.i++
      const rengN = this.rengVer()
      if (rengN?.k !== 'num') throw new Error('Falta el exponente después de «^».')
      this.i++
      rengV = rengPow(rengV, rengN.v)
    }
    return rengV
  }
}

const rengMul = (rengA: RengValor, rengB: RengValor): RengValor => ({ factor: rengA.factor * rengB.factor, desplazamiento: 0, dimension: rengDimMul(rengA.dimension, rengB.dimension), unidad: null })
const rengDiv = (rengA: RengValor, rengB: RengValor): RengValor => ({ factor: rengA.factor / rengB.factor, desplazamiento: 0, dimension: rengDimDiv(rengA.dimension, rengB.dimension), unidad: null })
const rengPow = (rengA: RengValor, rengN: number): RengValor => (rengN === 1 ? rengA : { factor: rengA.factor ** rengN, desplazamiento: 0, dimension: rengDimPow(rengA.dimension, rengN), unidad: null })

export function rengAnalizarUnidad(rengTexto: string, rengContexto?: string): RengResultadoUnidad {
  const rengT = rengTexto.trim()
  const rengCtx = rengContexto ? rengMagnitud(rengContexto) : null
  if (rengT === '') {
    const rengSin = rengCtx?.unidades.find((rengX) => rengX.simbolo === '') ?? (rengMagnitud('adimensional') as RengMagnitud).unidades[0]!
    return { ok: true, u: { texto: '', ...rengDeUnidad(rengSin) } }
  }
  if (RENG_AMBIGUOS[rengT]) return { ok: false, error: RENG_AMBIGUOS[rengT] }
  const rengEntera = rengBuscarEntera(rengT, rengCtx)
  if (rengEntera) return { ok: true, u: { texto: rengT, ...rengDeUnidad(rengEntera) } }
  const rengTk = rengTokenizar(rengT)
  if (typeof rengTk === 'string') return { ok: false, error: rengTk }
  try {
    const rengA = new RengAnalizador(rengTk, rengCtx)
    const rengV = rengA.rengExpresion()
    if (rengA.i < rengTk.length) return { ok: false, error: `No entiendo la unidad «${rengT}».` }
    return { ok: true, u: { texto: rengT, factor: rengV.factor, desplazamiento: rengV.desplazamiento, dimension: rengV.dimension, unidad: rengV.unidad } }
  } catch (rengE) {
    return { ok: false, error: rengE instanceof Error ? rengE.message : String(rengE) }
  }
}

export function rengCompatibles(rengA: string, rengB: string, rengContexto?: string): boolean {
  const rengX = rengAnalizarUnidad(rengA, rengContexto)
  const rengY = rengAnalizarUnidad(rengB, rengContexto)
  return rengX.ok && rengY.ok && rengDimIgual(rengX.u.dimension, rengY.u.dimension)
}
