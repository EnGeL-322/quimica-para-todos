export interface RengEvalOptions {
  grados?: boolean
}

export type RengCompiled = (rengVars?: Record<string, number>) => number

type RengTok = { t: 'num'; v: number } | { t: 'id'; v: string } | { t: 'op'; v: string }

const rengOwn = <RengT>(rengO: Record<string, RengT>, rengK: string): RengT | undefined => (Object.hasOwn(rengO, rengK) ? rengO[rengK] : undefined)

const RENG_CONST: Record<string, number> = { pi: Math.PI, π: Math.PI, e: Math.E, phi: (1 + Math.sqrt(5)) / 2, tau: 2 * Math.PI }

const rengFactorial = (rengN: number): number => {
  if (rengN < 0 || !Number.isInteger(rengN)) return NaN
  if (rengN > 170) return Infinity
  let rengR = 1
  for (let rengI = 2; rengI <= rengN; rengI++) rengR *= rengI
  return rengR
}

function rengTokenize(rengSrc: string): RengTok[] {
  const rengOut: RengTok[] = []
  let rengI = 0
  while (rengI < rengSrc.length) {
    const rengC = rengSrc[rengI] as string
    if (/\s/.test(rengC)) {
      rengI++
    } else if (/[0-9.]/.test(rengC)) {
      const rengM = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(rengSrc.slice(rengI))
      if (!rengM) throw new Error(`Número mal formado cerca de «${rengSrc.slice(rengI, rengI + 6)}»`)
      rengOut.push({ t: 'num', v: Number(rengM[0]) })
      rengI += rengM[0].length
    } else if (/[A-Za-zπ_]/.test(rengC)) {
      const rengM = /^[A-Za-zπ_][A-Za-z0-9π_]*/.exec(rengSrc.slice(rengI)) as RegExpExecArray
      rengOut.push({ t: 'id', v: rengM[0].toLowerCase() })
      rengI += rengM[0].length
    } else if ('+-*/^(),!%'.includes(rengC) || rengC === '×' || rengC === '÷' || rengC === '−') {
      rengOut.push({ t: 'op', v: rengC === '×' ? '*' : rengC === '÷' ? '/' : rengC === '−' ? '-' : rengC })
      rengI++
    } else {
      throw new Error(`Carácter no permitido: «${rengC}»`)
    }
  }
  return rengOut
}

function rengWithImplicit(rengToks: RengTok[]): RengTok[] {
  const rengOut: RengTok[] = []
  rengToks.forEach((rengTk, rengI) => {
    const rengPrev = rengToks[rengI - 1]
    if (rengPrev) {
      const rengPrevEnds = rengPrev.t === 'num' || (rengPrev.t === 'id') || (rengPrev.t === 'op' && (rengPrev.v === ')' || rengPrev.v === '!' || rengPrev.v === '%'))
      const rengCurStarts = rengTk.t === 'num' || rengTk.t === 'id' || (rengTk.t === 'op' && rengTk.v === '(')
      const rengIsCall = rengPrev.t === 'id' && rengTk.t === 'op' && rengTk.v === '(' && rengOwn(RENG_FUNCS, rengPrev.v) !== undefined
      if (rengPrevEnds && rengCurStarts && !rengIsCall) rengOut.push({ t: 'op', v: '*' })
    }
    rengOut.push(rengTk)
  })
  return rengOut
}

type RengFn = (rengX: number, rengRad: (rengV: number) => number, rengDeg: (rengV: number) => number) => number

const RENG_FUNCS: Record<string, RengFn> = {
  sin: (rengX, rengR) => Math.sin(rengR(rengX)),
  cos: (rengX, rengR) => Math.cos(rengR(rengX)),
  tan: (rengX, rengR) => Math.tan(rengR(rengX)),
  asin: (rengX, _rengR, rengD) => rengD(Math.asin(rengX)),
  acos: (rengX, _rengR, rengD) => rengD(Math.acos(rengX)),
  atan: (rengX, _rengR, rengD) => rengD(Math.atan(rengX)),
  sinh: (rengX) => Math.sinh(rengX),
  cosh: (rengX) => Math.cosh(rengX),
  tanh: (rengX) => Math.tanh(rengX),
  exp: (rengX) => Math.exp(rengX),
  ln: (rengX) => Math.log(rengX),
  log: (rengX) => Math.log10(rengX),
  log10: (rengX) => Math.log10(rengX),
  log2: (rengX) => Math.log2(rengX),
  sqrt: (rengX) => Math.sqrt(rengX),
  cbrt: (rengX) => Math.cbrt(rengX),
  abs: (rengX) => Math.abs(rengX),
  floor: (rengX) => Math.floor(rengX),
  ceil: (rengX) => Math.ceil(rengX),
  round: (rengX) => Math.round(rengX),
  sign: (rengX) => Math.sign(rengX),
  fact: (rengX) => rengFactorial(rengX)
}

type RengNode = (rengV: Record<string, number>) => number

export function rengCompile(rengSrc: string, rengOpts: RengEvalOptions = {}): RengCompiled {
  if (rengSrc.length > 500) throw new Error('Expresión demasiado larga (máx. 500 caracteres).')
  const rengToks = rengWithImplicit(rengTokenize(rengSrc))
  let rengP = 0
  const rengRad = rengOpts.grados ? (rengV: number): number => (rengV * Math.PI) / 180 : (rengV: number): number => rengV
  const rengDeg = rengOpts.grados ? (rengV: number): number => (rengV * 180) / Math.PI : (rengV: number): number => rengV

  const rengPeek = (): RengTok | undefined => rengToks[rengP]
  const rengEat = (rengV: string): boolean => {
    const rengT = rengPeek()
    if (rengT?.t === 'op' && rengT.v === rengV) {
      rengP++
      return true
    }
    return false
  }

  const rengExpr = (): RengNode => {
    let rengLeft = rengTerm()
    for (;;) {
      if (rengEat('+')) {
        const rengA = rengLeft, rengB = rengTerm()
        rengLeft = (rengV) => rengA(rengV) + rengB(rengV)
      } else if (rengEat('-')) {
        const rengA = rengLeft, rengB = rengTerm()
        rengLeft = (rengV) => rengA(rengV) - rengB(rengV)
      } else return rengLeft
    }
  }
  const rengTerm = (): RengNode => {
    let rengLeft = rengUnary()
    for (;;) {
      if (rengEat('*')) {
        const rengA = rengLeft, rengB = rengUnary()
        rengLeft = (rengV) => rengA(rengV) * rengB(rengV)
      } else if (rengEat('/')) {
        const rengA = rengLeft, rengB = rengUnary()
        rengLeft = (rengV) => rengA(rengV) / rengB(rengV)
      } else return rengLeft
    }
  }
  const rengUnary = (): RengNode => {
    if (rengEat('-')) {
      const rengA = rengUnary()
      return (rengV) => -rengA(rengV)
    }
    if (rengEat('+')) return rengUnary()
    return rengPower()
  }
  const rengPower = (): RengNode => {
    const rengBase = rengPostfix()
    if (rengEat('^')) {
      const rengExp = rengUnary()
      return (rengV) => Math.pow(rengBase(rengV), rengExp(rengV))
    }
    return rengBase
  }
  const rengPostfix = (): RengNode => {
    let rengA = rengPrimary()
    for (;;) {
      if (rengEat('!')) {
        const rengX = rengA
        rengA = (rengV) => rengFactorial(rengX(rengV))
      } else if (rengEat('%')) {
        const rengX = rengA
        rengA = (rengV) => rengX(rengV) / 100
      } else return rengA
    }
  }
  const rengPrimary = (): RengNode => {
    const rengT = rengPeek()
    if (!rengT) throw new Error('La expresión está incompleta.')
    if (rengT.t === 'num') {
      rengP++
      const rengN = rengT.v
      return () => rengN
    }
    if (rengT.t === 'id') {
      rengP++
      const rengName = rengT.v
      const rengFn = rengOwn(RENG_FUNCS, rengName)
      if (rengFn && rengEat('(')) {
        const rengArg = rengExpr()
        if (!rengEat(')')) throw new Error('Falta cerrar un paréntesis.')
        return (rengV) => rengFn(rengArg(rengV), rengRad, rengDeg)
      }
      const rengC = rengOwn(RENG_CONST, rengName)
      if (rengC !== undefined) {
        return () => rengC
      }
      if (rengFn) throw new Error(`«${rengName}» necesita paréntesis: ${rengName}(…)`)
      return (rengV) => {
        if (!Object.hasOwn(rengV, rengName)) throw new Error(`Variable desconocida: «${rengName}»`)
        return rengV[rengName] as number
      }
    }
    if (rengT.v === '(') {
      rengP++
      const rengE = rengExpr()
      if (!rengEat(')')) throw new Error('Falta cerrar un paréntesis.')
      return rengE
    }
    throw new Error(`No se esperaba «${rengT.v}».`)
  }

  const rengRoot = rengExpr()
  if (rengP < rengToks.length) throw new Error(`Sobra «${(rengToks[rengP] as RengTok).v}» en la expresión.`)
  return (rengVars = {}) => rengRoot(rengVars)
}

export function rengEvaluate(rengSrc: string, rengVars: Record<string, number> = {}, rengOpts: RengEvalOptions = {}): number {
  return rengCompile(rengSrc, rengOpts)(rengVars)
}

export function rengFormatNumber(rengN: number): string {
  if (Number.isNaN(rengN)) return 'indefinido'
  if (!Number.isFinite(rengN)) return rengN > 0 ? '∞' : '−∞'
  if (rengN === 0) return '0'
  const rengA = Math.abs(rengN)
  if (rengA >= 1e12 || rengA < 1e-6) return rengN.toExponential(8).replace(/\.?0+e/, 'e')
  return String(Number(rengN.toPrecision(12)))
}

type RengF = (rengX: number) => number

export const RENG_MAX_EVALUACIONES = 20_000

export class RengErrorNumerico extends Error {
  override name = 'ErrorNumerico'
}

const rengFx = (rengX: number): string => rengFormatNumber(rengX).replace('-', '−')

function rengFinito(rengF: RengF, rengX: number, rengCalculo: string): number {
  const rengY = rengF(rengX)
  if (Number.isFinite(rengY)) return rengY
  throw new RengErrorNumerico(`${rengCalculo}: f(${rengFx(rengX)}) ${Number.isNaN(rengY) ? 'no está definida (x fuera del dominio de f)' : 'es infinita (singularidad)'}.`)
}

const rengLimites = (rengA: number, rengB: number): void => {
  if (!Number.isFinite(rengA) || !Number.isFinite(rengB)) throw new RengErrorNumerico('Los extremos a y b deben ser números finitos.')
}

export function rengDerivada(rengF: RengF, rengX: number, rengH = 1e-3): number {
  if (!Number.isFinite(rengX)) throw new RengErrorNumerico('Derivada: el punto debe ser un número finito.')
  const rengG = (rengT: number): number => rengFinito(rengF, rengT, 'Derivada')
  const rengD = (rengHh: number): number => (rengG(rengX + rengHh) - rengG(rengX - rengHh)) / (2 * rengHh)
  return (4 * rengD(rengH / 2) - rengD(rengH)) / 3
}

export interface RengResultadoIntegral {
  valor: number
  evaluaciones: number
  errorEstimado: number
}

export function rengIntegrar(rengF: RengF, rengA: number, rengB: number, rengTol = 1e-10, rengMaxEval = RENG_MAX_EVALUACIONES): RengResultadoIntegral {
  rengLimites(rengA, rengB)
  if (rengA === rengB) return { valor: 0, evaluaciones: 0, errorEstimado: 0 }
  let rengEvaluaciones = 0
  let rengErrorEstimado = 0
  const rengEv = (rengX: number): number => {
    if (++rengEvaluaciones > rengMaxEval) throw new RengErrorNumerico(`Integral: no converge con ${rengMaxEval.toLocaleString('es')} evaluaciones (cerca de x = ${rengFx(rengX)} la función oscila o crece demasiado). Divide el intervalo o revisa f.`)
    return rengFinito(rengF, rengX, 'Integral')
  }
  const rengSimpson = (rengFa: number, rengFm: number, rengFb: number, rengLo: number, rengHi: number): number => ((rengHi - rengLo) / 6) * (rengFa + 4 * rengFm + rengFb)
  const rengRec = (rengLo: number, rengHi: number, rengFa: number, rengFm: number, rengFb: number, rengWhole: number, rengEps: number, rengDepth: number): number => {
    const rengMid = (rengLo + rengHi) / 2
    const rengFlm = rengEv((rengLo + rengMid) / 2)
    const rengFrm = rengEv((rengMid + rengHi) / 2)
    const rengLeft = rengSimpson(rengFa, rengFlm, rengFm, rengLo, rengMid)
    const rengRight = rengSimpson(rengFm, rengFrm, rengFb, rengMid, rengHi)
    if (rengDepth <= 0 || Math.abs(rengLeft + rengRight - rengWhole) <= 15 * rengEps) {
      rengErrorEstimado += Math.abs(rengLeft + rengRight - rengWhole) / 15
      return rengLeft + rengRight + (rengLeft + rengRight - rengWhole) / 15
    }
    return rengRec(rengLo, rengMid, rengFa, rengFlm, rengFm, rengLeft, rengEps / 2, rengDepth - 1) + rengRec(rengMid, rengHi, rengFm, rengFrm, rengFb, rengRight, rengEps / 2, rengDepth - 1)
  }
  const rengFa = rengEv(rengA)
  const rengFb = rengEv(rengB)
  const rengFm = rengEv((rengA + rengB) / 2)
  const rengValor = rengRec(rengA, rengB, rengFa, rengFm, rengFb, rengSimpson(rengFa, rengFm, rengFb, rengA, rengB), rengTol, 40)
  return { valor: rengValor, evaluaciones: rengEvaluaciones, errorEstimado: rengErrorEstimado }
}

export const rengIntegral = (rengF: RengF, rengA: number, rengB: number, rengTol = 1e-10): number => rengIntegrar(rengF, rengA, rengB, rengTol).valor

export interface RengResultadoRaiz {
  x: number
  residuo: number
  iteraciones: number
}

export function rengRaizVerificada(rengF: RengF, rengA: number, rengB: number, rengTol = 1e-12): RengResultadoRaiz {
  rengLimites(rengA, rengB)
  const rengG = (rengX: number): number => rengFinito(rengF, rengX, 'Raíz')
  let rengLo = Math.min(rengA, rengB)
  let rengHi = Math.max(rengA, rengB)
  let rengFlo = rengG(rengLo)
  const rengFhi = rengG(rengHi)
  if (rengFlo === 0) return { x: rengLo, residuo: 0, iteraciones: 0 }
  if (rengFhi === 0) return { x: rengHi, residuo: 0, iteraciones: 0 }
  if (rengFlo * rengFhi > 0) throw new RengErrorNumerico('Raíz: f(a) y f(b) tienen el mismo signo, así que la bisección no garantiza ninguna raíz en el intervalo. Elige extremos donde f cambie de signo.')
  const rengEscala = Math.max(Math.abs(rengFlo), Math.abs(rengFhi))
  const rengDentro = (rengX: number): number => {
    const rengY = rengF(rengX)
    if (Number.isFinite(rengY)) return rengY
    throw new RengErrorNumerico(`Raíz: no hay raíz verificada. f(${rengFx(rengX)}) ${Number.isNaN(rengY) ? 'no está definida' : 'es infinita'} dentro del intervalo: el cambio de signo se debe a una discontinuidad o un polo, no a un cero.`)
  }
  let rengI = 0
  for (; rengI < 200 && rengHi - rengLo > rengTol * Math.max(1, Math.abs(rengLo), Math.abs(rengHi)); rengI++) {
    const rengMid = (rengLo + rengHi) / 2
    const rengFm = rengDentro(rengMid)
    if (rengFm === 0) return { x: rengMid, residuo: 0, iteraciones: rengI + 1 }
    if (rengFlo * rengFm < 0) rengHi = rengMid
    else {
      rengLo = rengMid
      rengFlo = rengFm
    }
  }
  const rengX = (rengLo + rengHi) / 2
  const rengResiduo = Math.abs(rengDentro(rengX))
  if (rengResiduo > 1e-6 * Math.max(1, rengEscala))
    throw new RengErrorNumerico(`Raíz: no hay raíz verificada. f cambia de signo cerca de x = ${rengFx(rengX)}, pero allí |f| = ${rengFx(rengResiduo)} no tiende a 0: hay una discontinuidad o un polo, no un cero.`)
  return { x: rengX, residuo: rengResiduo, iteraciones: rengI }
}

export const rengRaiz = (rengF: RengF, rengA: number, rengB: number, rengTol = 1e-12): number => rengRaizVerificada(rengF, rengA, rengB, rengTol).x
