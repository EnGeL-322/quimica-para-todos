import { RENG_ESTADOS_COMUNES } from './compuestosBinarios'
import { rengElectronegatividad } from './electronegatividad'
import { rengEvaluarUnion, rengValencia } from './enlazar'
import { rengFormulaHill } from './formula'
import { rengIndiceSustancias } from './indiceSustancias'
import { rengAnadirAtomo, rengAtomo, rengEnlaceEntre, rengEnlacesDe, rengEsMetal, rengSumar, rengEscalar, rengRestar, rengNorma, type RengMesa, type RengVec3 } from './mesa'
import { rengNormalizarNombre } from './nomenclatura'
import { rengLongitudEnlace } from './relajar'
import { rengDesdeSmiles } from './molecula'
import { rengInterpretarSustancia, type RengSustancia } from './sustancia'

export interface RengAnalisisFragmento {
  ids: number[]
  formula: string
  libres: number
  completa: boolean
  estado: string
  ionico: boolean
  metalico: boolean
  smiles: string | null
  nombre: string | null
  sustancia: RengSustancia | null
  existencia: string | null
  noConfirmado: boolean
  carga: number
  estereo: 'conservada' | 'perdida' | null
}

export const rengTextoAtomoSuelto = (rengEl: string, rengCarga: number): string => (rengCarga === 0 ? rengEl : `[${rengEl}${rengCarga > 0 ? '+' : '-'}${Math.abs(rengCarga) > 1 ? Math.abs(rengCarga) : ''}]`)

function rengIdSinEstereoDe(rengSmiles: string): string | null {
  try {
    return rengDesdeSmiles(rengSmiles).idSinEstereo
  } catch {
    return null
  }
}

const RENG_HIDRUROS_H_AL_FINAL = new Set(['N', 'P', 'As', 'Sb', 'B', 'Si', 'Ge'])

export function rengFormulaConvencional(rengEls: readonly string[]): string {
  const rengCuenta = new Map<string, number>()
  for (const rengE of rengEls) rengCuenta.set(rengE, (rengCuenta.get(rengE) ?? 0) + 1)
  if (rengCuenta.size === 2 && rengCuenta.get('O') === 1 && rengCuenta.get('H') === 1) return 'OH'
  const rengMetal = [...rengCuenta.keys()].find((rengX) => rengX !== 'O' && rengX !== 'H')
  if (rengCuenta.size === 3 && rengMetal && rengCuenta.get('O') === rengCuenta.get('H') && (rengElectronegatividad(rengMetal) ?? 9) < 1.7) {
    const rengN = rengCuenta.get('O')!
    return `${rengMetal}${rengCuenta.get(rengMetal)! > 1 ? rengCuenta.get(rengMetal) : ''}${rengN > 1 ? `(OH)${rengN}` : 'OH'}`
  }
  if (rengCuenta.has('C')) return rengFormulaHill(rengCuenta).replace(/[₀-₉]/g, (rengC) => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(rengC)))
  const rengOrden = [...rengCuenta.keys()].sort((rengA, rengB) => (rengElectronegatividad(rengA) ?? 0) - (rengElectronegatividad(rengB) ?? 0))
  if (rengCuenta.has('H') && rengOrden.some((rengE) => RENG_HIDRUROS_H_AL_FINAL.has(rengE)) && rengCuenta.size === 2) rengOrden.push(rengOrden.splice(rengOrden.indexOf('H'), 1)[0]!)
  return rengOrden.map((rengE) => `${rengE}${rengCuenta.get(rengE)! > 1 ? rengCuenta.get(rengE) : ''}`).join('')
}

export function rengLibresDe(rengM: RengMesa, rengId: number): number {
  const rengA = rengAtomo(rengM, rengId)
  if (!rengA || rengEsMetal(rengA.el)) return 0
  const rengEnl = rengEnlacesDe(rengM, rengId)
  const rengIon = rengEnl.filter((rengE) => rengE.tipo === 'ionico').reduce((rengS, rengE) => rengS + rengE.electrones, 0)
  const rengCov = rengEnl.filter((rengE) => rengE.tipo !== 'ionico' && rengE.tipo !== 'metalico').reduce((rengS, rengE) => rengS + rengE.orden, 0)
  const rengPropia = rengA.carga + rengIon
  const rengV = rengValencia(rengA.el, rengPropia)
  if (!rengV) return 0
  return Math.max(0, rengV.normal - rengCov - rengIon)
}

export function rengSmilesFragmento(rengM: RengMesa, rengIds: readonly number[]): string | null {
  const rengEnl = rengM.enlaces.filter((rengE) => rengIds.includes(rengE.a))
  if (rengEnl.some((rengE) => rengE.tipo === 'ionico' || rengE.tipo === 'metalico')) return null
  const rengVisit = new Set<number>()
  const rengCierres = new Map<string, number>()
  let rengSiguienteCierre = 1
  const rengSim = (rengO: number): string => (rengO === 2 ? '=' : rengO === 3 ? '#' : '')
  const rengAtom = (rengId: number): string => {
    const rengA = rengAtomo(rengM, rengId)!
    const rengQ = rengA.carga === 0 ? '' : rengA.carga > 0 ? `+${rengA.carga > 1 ? rengA.carga : ''}` : `-${rengA.carga < -1 ? -rengA.carga : ''}`
    return `[${rengA.el}${rengQ}]`
  }
  const rengArbol = new Set<string>()
  const rengPadre = new Map<number, number>()
  const rengDfs1 = (rengId: number): void => {
    rengVisit.add(rengId)
    for (const rengE of rengM.enlaces.filter((rengX) => rengX.a === rengId || rengX.b === rengId)) {
      const rengV = rengE.a === rengId ? rengE.b : rengE.a
      if (!rengVisit.has(rengV)) {
        rengArbol.add([rengId, rengV].sort((rengX, rengY) => rengX - rengY).join('-'))
        rengPadre.set(rengV, rengId)
        rengDfs1(rengV)
      }
    }
  }
  rengDfs1(rengIds[0]!)
  const rengAnillos = rengM.enlaces.filter((rengE) => rengIds.includes(rengE.a) && !rengArbol.has([rengE.a, rengE.b].sort((rengX, rengY) => rengX - rengY).join('-')))
  const rengEscrito = new Set<number>()
  const rengEscribir = (rengId: number): string => {
    rengEscrito.add(rengId)
    let rengS = rengAtom(rengId)
    for (const rengE of rengAnillos.filter((rengX) => rengX.a === rengId || rengX.b === rengId)) {
      const rengK = [rengE.a, rengE.b].sort((rengX, rengY) => rengX - rengY).join('-')
      if (!rengCierres.has(rengK)) rengCierres.set(rengK, rengSiguienteCierre++)
      rengS += `${rengSim(rengE.orden)}${rengCierres.get(rengK)}`
    }
    const rengHijos = [...rengPadre.entries()].filter(([, rengP]) => rengP === rengId).map(([rengH]) => rengH)
    rengHijos.forEach((rengH, rengI) => {
      const rengT = `${rengSim(rengEnlaceEntre(rengM, rengId, rengH)!.orden)}${rengEscribir(rengH)}`
      rengS += rengI < rengHijos.length - 1 ? `(${rengT})` : rengT
    })
    return rengS
  }
  return rengEscribir(rengIds[0]!)
}

const rengConocidoEnIndice = (rengNombre: string): boolean => {
  const rengN = rengNormalizarNombre(rengNombre)
  return rengIndiceSustancias().some((rengE) => rengNormalizarNombre(rengE.nombre) === rengN || rengE.otros.some((rengO) => rengNormalizarNombre(rengO) === rengN))
}

export function rengAnalizarFragmento(rengM: RengMesa, rengIds: number[]): RengAnalisisFragmento {
  const rengEls = rengIds.map((rengId) => rengAtomo(rengM, rengId)!.el)
  const rengEnl = rengM.enlaces.filter((rengE) => rengIds.includes(rengE.a))
  const rengIonico = rengEnl.some((rengE) => rengE.tipo === 'ionico')
  const rengMetalico = rengEnl.some((rengE) => rengE.tipo === 'metalico')
  const rengNoConfirmado = rengEnl.some((rengE) => rengE.noConfirmado === true)
  const rengFormula = rengFormulaConvencional(rengEls)
  const rengLibres = rengIds.reduce((rengS, rengId) => rengS + rengLibresDe(rengM, rengId), 0)
  const rengCargaTotal = rengIds.reduce((rengS, rengId) => rengS + rengAtomo(rengM, rengId)!.carga, 0)
  const rengMetalesOk = rengIds.every((rengId) => {
    const rengA = rengAtomo(rengM, rengId)!
    return !rengEsMetal(rengA.el) || !rengIonico || (RENG_ESTADOS_COMUNES[rengA.el] ?? []).includes(rengA.carga)
  })
  const rengAnotaciones = (rengM.estereo ?? []).filter((rengX) => rengX.ids.some((rengId) => rengIds.includes(rengId)))
  const rengEstereoPerdida = rengAnotaciones.length > 0 ? ('perdida' as const) : null
  const rengBase = { ids: rengIds, formula: rengFormula, libres: rengLibres, ionico: rengIonico, metalico: rengMetalico, noConfirmado: rengNoConfirmado, smiles: null, nombre: null, sustancia: null, existencia: null, carga: rengCargaTotal, estereo: rengEstereoPerdida }
  if (rengIds.length === 1) {
    const rengR = rengInterpretarSustancia(rengTextoAtomoSuelto(rengEls[0]!, rengAtomo(rengM, rengIds[0]!)!.carga))
    return { ...rengBase, completa: false, estado: 'Átomo suelto: acércale otro para unirlos.', nombre: rengR.tipo === 'ok' ? rengR.sustancia.nombre : rengEls[0]!, sustancia: rengR.tipo === 'ok' ? rengR.sustancia : null }
  }
  if (rengMetalico) return { ...rengBase, completa: false, estado: 'Enlace metálico: en la realidad es una red o una aleación, no una molécula.' }
  if (rengLibres > 0) return { ...rengBase, completa: false, estado: `Faltan ${rengLibres} enlace${rengLibres === 1 ? '' : 's'} (por ejemplo, ${rengLibres} H) para completar las valencias.` }
  if (rengIonico && (!rengMetalesOk || rengCargaTotal !== 0))
    return { ...rengBase, completa: false, estado: rengCargaTotal !== 0 ? `Carga total ${rengCargaTotal > 0 ? '+' : '−'}${Math.abs(rengCargaTotal)}: faltan iones para que sea neutro.` : 'Algún metal no tiene aquí un estado de oxidación habitual: faltan iones.' }
  const rengSmilesMesa = rengIonico ? null : rengSmilesFragmento(rengM, rengIds)
  const rengActualSinEstereo = rengSmilesMesa && rengAnotaciones.length ? rengIdSinEstereoDe(rengSmilesMesa) : null
  const rengValida = rengAnotaciones.find((rengX) => rengX.ids.length === rengIds.length && rengX.ids.every((rengId) => rengIds.includes(rengId)) && rengX.idSinEstereo === rengActualSinEstereo)
  const rengSmiles = rengValida ? rengValida.smiles : rengSmilesMesa
  const rengPorFormula = !rengValida && (!rengEls.includes('C') || /^(CO|CO2|CS2)$/.test(rengFormula)) ? rengInterpretarSustancia(rengFormula) : null
  const rengR = rengValida ? rengInterpretarSustancia(rengValida.smiles) : rengPorFormula && rengPorFormula.tipo === 'ok' && rengPorFormula.sustancia.existe?.estado === 'confirmado' ? rengPorFormula : rengSmiles ? rengInterpretarSustancia(rengSmiles) : (rengPorFormula ?? rengInterpretarSustancia(rengFormula))
  const rengS = rengR.tipo === 'ok' ? rengR.sustancia : null
  const rengNombre = rengS && rengS.nombre !== rengS.grafo?.formula && rengS.nombre !== rengFormula ? rengS.nombre : null
  const rengConocido = !!rengS && (rengS.existe?.estado === 'confirmado' || rengS.existe?.estado === 'disolucion' || (rengNombre !== null && rengConocidoEnIndice(rengNombre)))
  const rengExistencia = rengNoConfirmado ? 'No confirmado que exista: incluye una unión que no figura en la lista verificada.' : rengConocido ? `Compuesto conocido: ${rengNombre}.` : 'Estructura válida, no figura en la lista verificada.'
  return { ...rengBase, completa: true, estado: 'Valencias completas.', smiles: rengSmiles, nombre: rengNombre, sustancia: rengS, existencia: rengExistencia, estereo: rengValida ? 'conservada' : rengEstereoPerdida }
}

export function rengComposicionConocida(rengFormula: string, rengNAtomos: number): boolean {
  if (rengNAtomos < 2) return false
  const rengR = rengInterpretarSustancia(rengFormula)
  return rengR.tipo === 'ok' && rengR.sustancia.existe?.estado === 'confirmado'
}

export function rengCompletarConH(rengM: RengMesa, rengIds: readonly number[]): RengMesa {
  let rengMesa = rengM
  for (const rengId of rengIds) {
    const rengLibres = rengLibresDe(rengMesa, rengId)
    const rengA = rengAtomo(rengMesa, rengId)!
    const rengVec = rengEnlacesDe(rengMesa, rengId).map((rengE) => rengRestar(rengAtomo(rengMesa, rengE.a === rengId ? rengE.b : rengE.a)!.p, rengA.p))
    const rengDentro = rengVec.length ? rengEscalar(rengVec.reduce<RengVec3>((rengS, rengV) => rengSumar(rengS, rengEscalar(rengV, 1 / (rengNorma(rengV) || 1))), [0, 0, 0]), -1) : ([1, 0, 0] as RengVec3)
    const rengBase = rengNorma(rengDentro) > 1e-6 ? rengEscalar(rengDentro, 1 / rengNorma(rengDentro)) : ([1, 0, 0] as RengVec3)
    for (let rengK = 0; rengK < rengLibres; rengK++) {
      const rengAng = (2 * Math.PI * rengK) / Math.max(1, rengLibres) + 0.5
      const rengDir = rengSumar(rengBase, [0.6 * Math.cos(rengAng) * (rengLibres > 1 ? 1 : 0), 0.6 * Math.sin(rengAng) * (rengLibres > 1 ? 1 : 0), 0.3 * (rengK % 2 ? 1 : -1) * (rengLibres > 2 ? 1 : 0)])
      const rengD = rengEscalar(rengDir, rengLongitudEnlace(rengA.el, 'H') / (rengNorma(rengDir) || 1))
      const rengR = rengAnadirAtomo(rengMesa, 'H', rengSumar(rengA.p, rengD))
      rengMesa = { ...rengR.mesa, enlaces: [...rengR.mesa.enlaces, { a: rengId, b: rengR.id, orden: 1, tipo: rengEvaluarUnion(rengA.el, 'H').tipo ?? 'covalente-polar', electrones: 0 }] }
    }
  }
  return rengMesa
}
