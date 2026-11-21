import { rengPorSimbolo } from '../../tabla-periodica/data'

export interface RengFormula {
  texto: string
  atomos: Map<string, number>
  carga: number
  electron: boolean
}

const RENG_SUB = '₀₁₂₃₄₅₆₇₈₉'
const RENG_SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'

export const rengSubindice = (rengN: number | string): string => String(rengN).replace(/\d/g, (rengD) => RENG_SUB[Number(rengD)] ?? rengD)
export const rengSuperindice = (rengN: number | string): string =>
  String(rengN)
    .replace(/\d/g, (rengD) => RENG_SUP[Number(rengD)] ?? rengD)
    .replace(/\+/g, '⁺')
    .replace(/-/g, '⁻')

function rengNormalizar(rengEntrada: string): string {
  let rengS = rengEntrada.trim().replace(/[−–]/g, '-').replace(/[•∙⋅*]/g, '·')
  rengS = rengS.replace(/[₀-₉]/g, (rengC) => String(RENG_SUB.indexOf(rengC)))
  const rengSupFinal = /([⁰-⁹¹²³]*[⁺⁻]+|[⁺⁻][⁰-⁹¹²³]*)$/.exec(rengS)
  if (rengSupFinal) {
    const rengCrudo = rengSupFinal[0].replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (rengC) => String(RENG_SUP.indexOf(rengC))).replace(/⁺/g, '+').replace(/⁻/g, '-')
    rengS = `${rengS.slice(0, rengSupFinal.index)}^${rengCrudo}`
  }
  return rengS
}

function rengLeerCarga(rengT: string, rengOriginal: string): number {
  const rengM = /^(\d*)([+-]+)$/.exec(rengT) ?? /^([+-])(\d+)$/.exec(rengT)
  if (!rengM) throw new Error(`No entiendo la carga «${rengT}» en «${rengOriginal}». Ejemplos válidos: SO4^2-, Fe^3+, NH4+.`)
  if (/^[+-]\d+$/.test(rengT)) return (rengT[0] === '-' ? -1 : 1) * Number(rengT.slice(1))
  const rengSignos = rengM[2] as string
  if (new Set(rengSignos).size > 1) throw new Error(`Carga con signos mezclados en «${rengOriginal}».`)
  const rengSentido = rengSignos[0] === '-' ? -1 : 1
  const rengMag = rengM[1] ? Number(rengM[1]) : 1
  if (rengM[1] && rengSignos.length > 1) throw new Error(`Carga ambigua «${rengT}» en «${rengOriginal}».`)
  return rengSentido * rengMag * (rengM[1] ? 1 : rengSignos.length)
}

const rengEsElementoSolo = (rengS: string): boolean => /^[A-Z][a-z]?$/.test(rengS) && rengPorSimbolo.has(rengS)

function rengSepararCarga(rengS: string, rengOriginal: string): { cuerpo: string; carga: number } {
  const rengCaret = rengS.lastIndexOf('^')
  if (rengCaret >= 0) return { cuerpo: rengS.slice(0, rengCaret), carga: rengLeerCarga(rengS.slice(rengCaret + 1), rengOriginal) }
  const rengLlave = /^(.*)\{([^{}]*[+-][^{}]*)\}$/.exec(rengS)
  if (rengLlave) return { cuerpo: rengLlave[1] as string, carga: rengLeerCarga(rengLlave[2] as string, rengOriginal) }
  const rengEspacio = /^(\S+)\s+(\d*[+-]+|[+-]\d+)$/.exec(rengS)
  if (rengEspacio) return { cuerpo: rengEspacio[1] as string, carga: rengLeerCarga(rengEspacio[2] as string, rengOriginal) }
  const rengSignoNum = /^(.*?[A-Za-z)\]])([+-])(\d+)$/.exec(rengS)
  if (rengSignoNum) return { cuerpo: rengSignoNum[1] as string, carga: (rengSignoNum[2] === '-' ? -1 : 1) * Number(rengSignoNum[3]) }
  const rengFin = /^(.*?)(\d*)([+-]+)$/.exec(rengS)
  if (!rengFin) return { cuerpo: rengS, carga: 0 }
  const rengBase = rengFin[1] as string
  const rengDigitos = rengFin[2] as string
  const rengSignos = rengFin[3] as string
  if (new Set(rengSignos).size > 1) throw new Error(`Carga con signos mezclados en «${rengOriginal}».`)
  const rengSentido = rengSignos[0] === '-' ? -1 : 1
  if (rengDigitos && rengEsElementoSolo(rengBase)) {
    if (rengSignos.length > 1) throw new Error(`Carga ambigua en «${rengOriginal}».`)
    return { cuerpo: rengBase, carga: rengSentido * Number(rengDigitos) }
  }
  if (rengDigitos.length >= 2) {
    throw new Error(`Carga ambigua en «${rengOriginal}»: ¿los dígitos son subíndice o carga? Escribe, por ejemplo, SO4^2- o SO4{2-}.`)
  }
  return { cuerpo: rengBase + rengDigitos, carga: rengSentido * rengSignos.length }
}

function rengLeerGrupo(rengS: string, rengOriginal: string): Map<string, number> {
  let rengI = 0
  const rengPila: Array<Map<string, number>> = [new Map()]
  const rengAperturas: string[] = []
  const rengNumero = (): number => {
    let rengJ = rengI
    while (rengJ < rengS.length && /\d/.test(rengS[rengJ] ?? '')) rengJ++
    const rengN = rengJ > rengI ? Number(rengS.slice(rengI, rengJ)) : 1
    rengI = rengJ
    return rengN
  }
  const RENG_PAR: Record<string, string> = { ')': '(', ']': '[', '}': '{' }
  while (rengI < rengS.length) {
    const rengCh = rengS[rengI] as string
    if (rengCh === '(' || rengCh === '[' || rengCh === '{') {
      rengPila.push(new Map())
      rengAperturas.push(rengCh)
      rengI++
    } else if (rengCh === ')' || rengCh === ']' || rengCh === '}') {
      if (rengAperturas.pop() !== RENG_PAR[rengCh]) throw new Error(`Paréntesis desbalanceados en «${rengOriginal}».`)
      rengI++
      const rengK = rengNumero()
      if (rengK === 0) throw new Error(`Subíndice 0 no válido en «${rengOriginal}».`)
      const rengDentro = rengPila.pop() as Map<string, number>
      const rengArriba = rengPila[rengPila.length - 1] as Map<string, number>
      for (const [rengEl, rengC] of rengDentro) rengArriba.set(rengEl, (rengArriba.get(rengEl) ?? 0) + rengC * rengK)
    } else if (/[A-Z]/.test(rengCh)) {
      let rengSim = rengCh
      rengI++
      if (/[a-z]/.test(rengS[rengI] ?? '')) rengSim += rengS[rengI++]
      if (!rengPorSimbolo.has(rengSim)) {
        throw new Error(`Elemento desconocido: «${rengSim}» en «${rengOriginal}». Recuerda: mayúscula + minúscula (Cl, no CL).`)
      }
      const rengK = rengNumero()
      if (rengK === 0) throw new Error(`Subíndice 0 no válido en «${rengOriginal}».`)
      const rengArriba = rengPila[rengPila.length - 1] as Map<string, number>
      rengArriba.set(rengSim, (rengArriba.get(rengSim) ?? 0) + rengK)
    } else {
      throw new Error(`Carácter no válido «${rengCh}» en «${rengOriginal}».`)
    }
  }
  if (rengPila.length !== 1) throw new Error(`Paréntesis desbalanceados en «${rengOriginal}».`)
  return rengPila[0] as Map<string, number>
}

export function rengDividirCarga(rengEntrada: string): { cuerpo: string; carga: number; electron: boolean } {
  const rengOriginal = rengEntrada.trim()
  if (!rengOriginal) throw new Error('Escribe una fórmula.')
  const rengS = rengNormalizar(rengOriginal)
  if (/^e(\^?-|\{-\}|-1)?$/.test(rengS)) return { cuerpo: 'e', carga: -1, electron: true }
  const { cuerpo: rengCuerpo, carga: rengCarga } = rengSepararCarga(rengS, rengOriginal)
  return { cuerpo: rengCuerpo.replace(/\s+/g, ''), carga: rengCarga, electron: false }
}

export function rengAnalizarFormula(rengEntrada: string): RengFormula {
  const rengOriginal = rengEntrada.trim()
  if (!rengOriginal) throw new Error('Escribe una fórmula.')
  const rengS = rengNormalizar(rengOriginal)
  if (/^e(\^?-|\{-\}|-1)?$/.test(rengS)) return { texto: 'e-', atomos: new Map(), carga: -1, electron: true }
  const { cuerpo: rengCuerpo, carga: rengCarga } = rengSepararCarga(rengS, rengOriginal)
  const rengLimpio = rengCuerpo.replace(/\s+/g, '')
  if (!rengLimpio) throw new Error(`Falta la fórmula en «${rengOriginal}».`)
  const rengAtomos = new Map<string, number>()
  rengLimpio.split('·').forEach((rengParte, rengIdx) => {
    if (!rengParte) throw new Error(`Hidrato mal escrito en «${rengOriginal}».`)
    const rengM = /^(\d+)(.*)$/.exec(rengParte)
    if (rengM && rengIdx === 0) throw new Error(`«${rengOriginal}» empieza con un número. En una fórmula suelta no se pone coeficiente.`)
    const rengMult = rengM ? Number(rengM[1]) : 1
    for (const [rengEl, rengC] of rengLeerGrupo(rengM ? (rengM[2] ?? '') : rengParte, rengOriginal)) rengAtomos.set(rengEl, (rengAtomos.get(rengEl) ?? 0) + rengC * rengMult)
  })
  const rengTextoCarga = rengCarga === 0 ? '' : `^${Math.abs(rengCarga) === 1 ? '' : Math.abs(rengCarga)}${rengCarga > 0 ? '+' : '-'}`
  return { texto: rengLimpio + rengTextoCarga, atomos: rengAtomos, carga: rengCarga, electron: false }
}

const rengComoFormula = (rengF: RengFormula | string): RengFormula => (typeof rengF === 'string' ? rengAnalizarFormula(rengF) : rengF)

export function rengMasaMolarDe(rengF: RengFormula | string): number {
  let rengTotal = 0
  for (const [rengEl, rengC] of rengComoFormula(rengF).atomos) rengTotal += (rengPorSimbolo.get(rengEl)?.masa ?? NaN) * rengC
  return rengTotal
}

export function rengElementosSinMasaEstandar(rengF: RengFormula | string): string[] {
  return [...rengComoFormula(rengF).atomos.keys()].filter((rengEl) => rengPorSimbolo.get(rengEl)?.masaAproximada)
}

export interface RengParteComposicion {
  simbolo: string
  cantidad: number
  masa: number
  porcentaje: number
}

export function rengComposicionCentesimal(rengF: RengFormula | string): RengParteComposicion[] {
  const rengFo = rengComoFormula(rengF)
  const RENG_M = rengMasaMolarDe(rengFo)
  return [...rengFo.atomos.entries()].map(([rengSimbolo, rengCantidad]) => {
    const rengMasa = (rengPorSimbolo.get(rengSimbolo)?.masa ?? NaN) * rengCantidad
    return { simbolo: rengSimbolo, cantidad: rengCantidad, masa: rengMasa, porcentaje: (100 * rengMasa) / RENG_M }
  })
}

export function rengOrdenHill(rengAtomos: Map<string, number>): Array<[string, number]> {
  const rengE = [...rengAtomos.entries()].filter(([, rengC]) => rengC !== 0)
  const rengAlfa = (rengA: [string, number], rengB: [string, number]): number => (rengA[0] < rengB[0] ? -1 : rengA[0] > rengB[0] ? 1 : 0)
  if (!rengAtomos.has('C')) return rengE.sort(rengAlfa)
  const rengResto = rengE.filter(([rengS]) => rengS !== 'C' && rengS !== 'H').sort(rengAlfa)
  return [['C', rengAtomos.get('C') as number], ...(rengAtomos.has('H') ? [['H', rengAtomos.get('H') as number] as [string, number]] : []), ...rengResto]
}

export const rengTextoCarga = (rengCarga: number): string =>
  rengCarga === 0 ? '' : rengSuperindice(`${Math.abs(rengCarga) === 1 ? '' : Math.abs(rengCarga)}${rengCarga > 0 ? '+' : '-'}`)

export function rengFormulaHill(rengAtomos: Map<string, number>, rengCarga = 0): string {
  return rengOrdenHill(rengAtomos).map(([rengS, rengC]) => rengS + (rengC === 1 ? '' : rengSubindice(rengC))).join('') + rengTextoCarga(rengCarga)
}

export function rengBonita(rengEntrada: string): string {
  try {
    const rengF = rengAnalizarFormula(rengEntrada)
    if (rengF.electron) return 'e⁻'
    const rengCaret = rengF.texto.lastIndexOf('^')
    const rengCuerpo = rengCaret >= 0 ? rengF.texto.slice(0, rengCaret) : rengF.texto
    return rengCuerpo.replace(/([A-Za-z)\]}])(\d+)/g, (_, rengA: string, rengN: string) => rengA + rengSubindice(rengN)) + rengTextoCarga(rengF.carga)
  } catch {
    return rengEntrada
  }
}

export interface RengResultadoEmpirica {
  atomos: Map<string, number>
  formula: string
  pasos: string[]
}

export function rengFormulaEmpirica(rengDatos: Array<{ simbolo: string; porcentaje: number }>): RengResultadoEmpirica {
  if (rengDatos.length === 0) throw new Error('Añade al menos un elemento.')
  const rengPasos: string[] = []
  const rengSuma = rengDatos.reduce((rengA, rengD) => rengA + rengD.porcentaje, 0)
  if (rengDatos.some((rengD) => !(rengD.porcentaje > 0))) throw new Error('Todos los porcentajes deben ser positivos.')
  if (Math.abs(rengSuma - 100) > 1) rengPasos.push(`Aviso: los porcentajes suman ${rengSuma.toFixed(2)} %, no 100 %. Se usan tal cual.`)
  const rengMoles = rengDatos.map((rengD) => {
    const rengEl = rengPorSimbolo.get(rengD.simbolo)
    if (!rengEl) throw new Error(`Elemento desconocido: «${rengD.simbolo}».`)
    const rengN = rengD.porcentaje / rengEl.masa
    rengPasos.push(`${rengD.simbolo}: ${rengD.porcentaje} g ÷ ${rengEl.masa} g/mol = ${rengN.toFixed(4)} mol`)
    return { simbolo: rengD.simbolo, n: rengN }
  })
  const rengMenor = Math.min(...rengMoles.map((rengM) => rengM.n))
  const rengRazones = rengMoles.map((rengM) => ({ simbolo: rengM.simbolo, r: rengM.n / rengMenor }))
  rengPasos.push(`Dividir entre el menor (${rengMenor.toFixed(4)}): ${rengRazones.map((rengR) => `${rengR.simbolo} ${rengR.r.toFixed(3)}`).join(', ')}`)
  for (let rengK = 1; rengK <= 12; rengK++) {
    if (rengRazones.every((rengR) => Math.abs(rengR.r * rengK - Math.round(rengR.r * rengK)) < 0.1)) {
      const rengAtomos = new Map(rengRazones.map((rengR) => [rengR.simbolo, Math.round(rengR.r * rengK)]))
      if (rengK > 1) rengPasos.push(`Multiplicar por ${rengK} para obtener enteros.`)
      const rengFormula = rengFormulaHill(rengAtomos)
      rengPasos.push(`Fórmula empírica: ${rengFormula}`)
      return { atomos: rengAtomos, formula: rengFormula, pasos: rengPasos }
    }
  }
  throw new Error('No se encontró una proporción entera sencilla (hasta ×12). Revisa los porcentajes.')
}

export interface RengResultadoMolecular {
  atomos: Map<string, number>
  formula: string
  n: number
  pasos: string[]
}

export function rengFormulaMolecular(rengEmpirica: Map<string, number>, rengMasaMolarExperimental: number): RengResultadoMolecular {
  if (!(rengMasaMolarExperimental > 0)) throw new Error('La masa molar debe ser positiva.')
  const RengMemp = rengMasaMolarDe({ texto: '', atomos: rengEmpirica, carga: 0, electron: false })
  const rengRazon = rengMasaMolarExperimental / RengMemp
  const rengN = Math.round(rengRazon)
  if (rengN < 1 || Math.abs(rengRazon - rengN) > 0.1) {
    throw new Error(`La masa molar (${rengMasaMolarExperimental}) no es múltiplo entero de la empírica (${RengMemp.toFixed(3)}): razón ${rengRazon.toFixed(3)}.`)
  }
  const rengAtomos = new Map([...rengEmpirica].map(([rengS, rengC]) => [rengS, rengC * rengN]))
  const rengFormula = rengFormulaHill(rengAtomos)
  return {
    atomos: rengAtomos,
    formula: rengFormula,
    n: rengN,
    pasos: [`M(empírica) = ${RengMemp.toFixed(3)} g/mol`, `n = ${rengMasaMolarExperimental} ÷ ${RengMemp.toFixed(3)} = ${rengRazon.toFixed(3)} ≈ ${rengN}`, `Fórmula molecular: ${rengFormula}`]
  }
}
