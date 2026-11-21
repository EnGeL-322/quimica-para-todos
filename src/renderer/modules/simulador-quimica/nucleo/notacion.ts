import { rengAnalizarFormula, rengDividirCarga } from './formula'

export type RengPieza =
  | { t: 'elemento'; v: string }
  | { t: 'sub'; v: string }
  | { t: 'sup'; v: string }
  | { t: 'num'; v: string }
  | { t: 'signo'; v: string }
  | { t: 'electron' }

export type RengEstado = 's' | 'l' | 'g' | 'aq'

export interface RengEspecieNotada {
  coef: string | null
  piezas: RengPieza[]
  estado: RengEstado | null
  formula: string
  carga: number
}

export interface RengFlecha {
  tipo: 'directa' | 'equilibrio'
  arriba: string | null
  abajo: string | null
}

export interface RengNotacion {
  izquierda: RengEspecieNotada[]
  derecha: RengEspecieNotada[]
  flecha: RengFlecha | null
}

export const RENG_NOMBRE_ESTADO: Record<RengEstado, string> = { s: 'sólido', l: 'líquido', g: 'gas', aq: 'disuelto en agua' }

const RENG_FLECHA = /-\[([^\]]*)\]->|(<=>|<->|⇌|⇄|->|→|⟶|=)(?:\[([^\]]*)\])?/

export function rengTextoSuperindice(rengCarga: number): string {
  if (rengCarga === 0) return ''
  return `${Math.abs(rengCarga) === 1 ? '' : Math.abs(rengCarga)}${rengCarga > 0 ? '+' : '−'}`
}

function rengPiezasCuerpo(rengCuerpo: string): RengPieza[] {
  const rengOut: RengPieza[] = []
  let rengI = 0
  while (rengI < rengCuerpo.length) {
    const rengCh = rengCuerpo[rengI] as string
    if (/[A-Z]/.test(rengCh)) {
      let rengSim = rengCh
      rengI++
      if (/[a-z]/.test(rengCuerpo[rengI] ?? '')) rengSim += rengCuerpo[rengI++]
      rengOut.push({ t: 'elemento', v: rengSim })
    } else if (/\d/.test(rengCh)) {
      let rengJ = rengI
      while (rengJ < rengCuerpo.length && /\d/.test(rengCuerpo[rengJ] ?? '')) rengJ++
      const rengPrev = rengOut[rengOut.length - 1]
      const rengEsSub = rengPrev !== undefined && (rengPrev.t === 'elemento' || (rengPrev.t === 'signo' && /[)\]}]/.test(rengPrev.v)))
      rengOut.push({ t: rengEsSub ? 'sub' : 'num', v: rengCuerpo.slice(rengI, rengJ) })
      rengI = rengJ
    } else {
      rengOut.push({ t: 'signo', v: rengCh === '·' ? '·' : rengCh })
      rengI++
    }
  }
  return rengOut
}

export function rengAnalizarEspecie(rengTexto: string): RengEspecieNotada {
  let rengS = rengTexto.trim()
  if (!rengS) throw new Error('Especie vacía.')
  let rengEstado: RengEstado | null = null
  const rengEst = /\((s|l|g|aq)\)$/.exec(rengS)
  if (rengEst) {
    rengEstado = rengEst[1] as RengEstado
    rengS = rengS.slice(0, rengEst.index).trim()
  }
  let rengCoef: string | null = null
  const rengC = /^(\d+\/\d+|\d+(?:[.,]\d+)?)\s*(?=[A-Z([{]|e(?:$|[-^⁻{]))/.exec(rengS)
  if (rengC) {
    rengCoef = (rengC[1] as string).replace('.', ',')
    rengS = rengS.slice(rengC[0].length).trim()
  }
  if (!rengS) throw new Error(`Falta la fórmula en «${rengTexto.trim()}».`)
  const rengF = rengAnalizarFormula(rengS)
  const { cuerpo: rengCuerpo, carga: rengCarga, electron: rengElectron } = rengDividirCarga(rengS)
  const rengPiezas: RengPieza[] = rengElectron ? [{ t: 'electron' }] : rengPiezasCuerpo(rengCuerpo)
  if (!rengElectron && rengCarga !== 0) rengPiezas.push({ t: 'sup', v: rengTextoSuperindice(rengCarga) })
  if (rengElectron) rengPiezas.push({ t: 'sup', v: '−' })
  return { coef: rengCoef, piezas: rengPiezas, estado: rengEstado, formula: rengS, carga: rengF.carga }
}

function rengPartirLado(rengLado: string): string[] {
  return rengLado
    .split(/\s+\+\s+/)
    .flatMap((rengT) => rengT.split(/\+(?=[A-Z[]|\((?!(?:s|l|g|aq)\))|e-|\d+\s*[A-Z([])/))
    .map((rengT) => rengT.trim())
    .filter(Boolean)
}

export function rengAnalizarNotacion(rengTexto: string): RengNotacion {
  const rengT = rengTexto.trim()
  if (!rengT) throw new Error('Escribe una fórmula o una ecuación.')
  const rengM = RENG_FLECHA.exec(rengT)
  if (!rengM) {
    return { izquierda: rengPartirLado(rengT).map(rengAnalizarEspecie), derecha: [], flecha: null }
  }
  const rengIzqTexto = rengT.slice(0, rengM.index)
  const rengDerTexto = rengT.slice(rengM.index + rengM[0].length)
  if (RENG_FLECHA.test(rengDerTexto)) throw new Error('La ecuación debe tener exactamente una flecha (->, → o =).')
  const rengCond = (rengM[1] ?? rengM[3] ?? '').trim()
  const [rengArriba, rengAbajo] = rengCond.split('|').map((rengX) => rengX.trim())
  const rengFlecha: RengFlecha = {
    tipo: rengM[2] && /<=>|<->|⇌|⇄/.test(rengM[2]) ? 'equilibrio' : 'directa',
    arriba: rengArriba || null,
    abajo: rengAbajo || null
  }
  const rengIzquierda = rengPartirLado(rengIzqTexto).map(rengAnalizarEspecie)
  const rengDerecha = rengPartirLado(rengDerTexto).map(rengAnalizarEspecie)
  if (!rengIzquierda.length || !rengDerecha.length) throw new Error('Faltan reactivos o productos.')
  return { izquierda: rengIzquierda, derecha: rengDerecha, flecha: rengFlecha }
}

const RENG_SUB = '₀₁₂₃₄₅₆₇₈₉'
const RENG_SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '−': '⁻' }

export function rengTextoEspecie(rengE: RengEspecieNotada, rengConCoef = true): string {
  const rengCuerpo = rengE.piezas
    .map((rengP) => {
      if (rengP.t === 'electron') return 'e'
      if (rengP.t === 'sub') return rengP.v.replace(/\d/g, (rengD) => RENG_SUB[Number(rengD)] ?? rengD)
      if (rengP.t === 'sup') return [...rengP.v].map((rengCh) => RENG_SUP[rengCh] ?? rengCh).join('')
      return rengP.v
    })
    .join('')
  return `${rengConCoef && rengE.coef ? rengE.coef : ''}${rengCuerpo}${rengE.estado ? `(${rengE.estado})` : ''}`
}

export function rengTextoPlano(rengN: RengNotacion): string {
  const rengIzq = rengN.izquierda.map((rengE) => rengTextoEspecie(rengE)).join(' + ')
  if (!rengN.flecha) return rengIzq
  const rengF = rengN.flecha.tipo === 'equilibrio' ? '⇌' : '→'
  const rengCond = [rengN.flecha.arriba, rengN.flecha.abajo].filter(Boolean).join('; ')
  return `${rengIzq} ${rengF}${rengCond ? `[${rengCond}]` : ''} ${rengN.derecha.map((rengE) => rengTextoEspecie(rengE)).join(' + ')}`
}

export function rengElementosDe(rengN: RengNotacion): string[] {
  const rengOut: string[] = []
  for (const rengE of [...rengN.izquierda, ...rengN.derecha]) for (const rengP of rengE.piezas) if (rengP.t === 'elemento' && !rengOut.includes(rengP.v)) rengOut.push(rengP.v)
  return rengOut
}
