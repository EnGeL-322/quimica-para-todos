import { rengAnalizarUnidad, rengConvertir, rengDimIgual, RengErrorUnidad } from '../../../lib/unidades'
import { RENG_ELEMENTOS } from '../chemistry'
import { rengAnalizarFormula, rengFormulaHill, rengTextoCarga } from '../nucleo/formula'
import { rengDesdeSmiles, type RengMoleculaGrafo } from '../nucleo/molecula'
import { rengAnalizarNotacion } from '../nucleo/notacion'
import { rengGruposFuncionales } from '../nucleo/organica'
import { rengSmilesDesdeNombre } from '../nucleo/organica'
import { rengNormalizarNombre } from '../nucleo/nomenclatura'
import { rengInterpretarSustancia } from '../nucleo/sustancia'
import { rengLeerNumeroEs, rengSepararNumeroUnidad, rengTextoNumero } from './numeros'
import { rengVeredicto, type RengRespuestaEsperada, type RengRespuestaNumero, type RengTerminoEcuacion, type RengVeredicto } from './tipos'

const RENG_MENSAJE_ILEGIBLE = 'No entendí tu respuesta como un número. Escribe, por ejemplo, 0,0500 o 5,00e-2, con la unidad si quieres (0,0500 mol/L).'

export function rengCorregirNumero(rengTexto: string, rengEsperada: RengRespuestaNumero): RengVeredicto {
  const rengLectura = rengSepararNumeroUnidad(rengTexto)
  if (!rengLectura.ok) {
    if (rengLectura.motivo === 'vacio') return rengVeredicto('entrada-invalida', 'vacia', 'Escribe una respuesta.')
    if (rengLectura.motivo === 'separador-ambiguo') return rengVeredicto('entrada-invalida', 'separador-ambiguo', 'No está claro si el separador es decimal o de miles. Escribe el número sin separador de miles (por ejemplo 1,234 o 1234).')
    return rengVeredicto('entrada-invalida', 'ilegible', RENG_MENSAJE_ILEGIBLE)
  }
  const rengUnidadEsperada = rengEsperada.unidad
  let rengValor = rengLectura.valor
  let rengEquivale: string | undefined
  if (rengLectura.unidad !== '' && rengLectura.unidad !== rengUnidadEsperada) {
    if (rengUnidadEsperada === '') return rengVeredicto('unidad-incompatible', 'sin-unidad', `Esta magnitud no lleva unidad; quita «${rengLectura.unidad}».`)
    const rengEscrita = rengAnalizarUnidad(rengLectura.unidad)
    if (!rengEscrita.ok) return rengVeredicto('unidad-incompatible', 'unidad-desconocida', `No reconozco la unidad «${rengLectura.unidad}». La respuesta va en ${rengUnidadEsperada}.`)
    const rengObjetivo = rengAnalizarUnidad(rengUnidadEsperada)
    if (rengObjetivo.ok && !rengDimIgual(rengEscrita.u.dimension, rengObjetivo.u.dimension)) {
      return rengVeredicto('unidad-incompatible', 'dimension', `«${rengLectura.unidad}» no mide lo mismo que se pide: la respuesta va en ${rengUnidadEsperada}.`)
    }
    try {
      rengValor = rengConvertir(rengLectura.valor, rengLectura.unidad, rengUnidadEsperada)
    } catch (rengE) {
      if (rengE instanceof RengErrorUnidad) return rengVeredicto('unidad-incompatible', 'conversion', rengE.message)
      throw rengE
    }
    rengEquivale = `Tu respuesta equivale a ${rengTextoNumero(rengValor, 4)} ${rengUnidadEsperada}.`
  }
  const rengTol = Math.max(rengEsperada.tolRel * Math.abs(rengEsperada.valor), rengEsperada.tolAbs, rengEsperada.decimales === null ? 0 : 0.5 * 10 ** -rengEsperada.decimales)
  const rengDif = Math.abs(rengValor - rengEsperada.valor)
  if (rengDif <= rengTol * (1 + 1e-9) + 1e-12) return rengVeredicto('correcto', 'correcta', `¡Correcto! ${rengTextoNumero(rengEsperada.valor, 4)}${rengUnidadEsperada ? ` ${rengUnidadEsperada}` : ''}.`, { equivale: rengEquivale })
  for (const rengE of rengEsperada.erroresComunes) {
    if (Math.abs(rengValor - rengE.valor) <= Math.max(0.01 * Math.abs(rengE.valor), rengEsperada.tolAbs)) {
      return rengVeredicto('incorrecto', 'error-frecuente', 'Aún no: tu valor coincide con un error frecuente.', { equivale: rengEquivale, errorFrecuente: rengE.mensaje })
    }
  }
  if (rengEsperada.valor !== 0 && rengValor !== 0 && Math.sign(rengValor) === Math.sign(rengEsperada.valor)) {
    const rengLog = Math.log10(Math.abs(rengValor / rengEsperada.valor))
    if (Math.abs(rengLog) >= 0.99 && Math.abs(rengLog - Math.round(rengLog)) < 0.02) {
      return rengVeredicto('incorrecto', 'factor-potencia-10', `Aún no: tu valor es ${rengLog > 0 ? 'mayor' : 'menor'} en un factor 10${Math.abs(Math.round(rengLog)) === 1 ? '' : `^${Math.abs(Math.round(rengLog))}`}. Revisa las conversiones de unidades (mL↔L, g↔mg, kJ↔J).`, { equivale: rengEquivale })
    }
  }
  if (rengDif <= Math.max(0.05 * Math.abs(rengEsperada.valor), 5 * rengTol)) {
    return rengVeredicto('incorrecto', 'cerca', 'Estás cerca, pero fuera de la tolerancia. Revisa los redondeos intermedios y las cifras significativas.', { equivale: rengEquivale })
  }
  const rengAlto = rengValor > rengEsperada.valor
  return rengVeredicto('incorrecto', rengAlto ? 'alto' : 'bajo', `Aún no: tu valor es demasiado ${rengAlto ? 'alto' : 'bajo'}. Revisa las pistas.`, { equivale: rengEquivale })
}

const rengSimbolosElemento = new Set(Object.keys(RENG_ELEMENTOS))

function rengLecturasMinusculas(rengTexto: string): string[] {
  const rengTrozos = rengTexto.split(/([a-z]+)/).filter((rengT) => rengT !== '')
  let rengCandidatos = ['']
  for (const rengTrozo of rengTrozos) {
    if (!/^[a-z]+$/.test(rengTrozo)) {
      rengCandidatos = rengCandidatos.map((rengC) => rengC + rengTrozo)
      continue
    }
    const rengPartes: string[][] = []
    const rengDividir = (rengResto: string, rengActual: string[]): void => {
      if (rengPartes.length > 12) return
      if (rengResto === '') {
        rengPartes.push(rengActual)
        return
      }
      for (const rengN of [1, 2]) {
        const rengSim = rengResto.slice(0, rengN)
        if (rengSim.length === rengN && rengSimbolosElemento.has(rengSim[0]!.toUpperCase() + rengSim.slice(1))) rengDividir(rengResto.slice(rengN), [...rengActual, rengSim[0]!.toUpperCase() + rengSim.slice(1)])
      }
    }
    rengDividir(rengTrozo, [])
    if (rengPartes.length === 0) return []
    rengCandidatos = rengCandidatos.flatMap((rengC) => rengPartes.map((rengP) => rengC + rengP.join(''))).slice(0, 24)
  }
  return rengCandidatos
}

export function rengLecturasAmbiguas(rengTexto: string): string[] | null {
  const rengT = rengTexto.trim()
  if (rengT === '' || /[A-Z]/.test(rengT) || !/[a-z]/.test(rengT)) return null
  const rengVistas = new Map<string, string>()
  for (const rengC of rengLecturasMinusculas(rengT)) {
    try {
      const rengF = rengAnalizarFormula(rengC)
      rengVistas.set(`${rengFormulaHill(rengF.atomos)}|${rengF.carga}`, rengC)
    } catch {
    }
  }
  return rengVistas.size > 1 ? [...rengVistas.values()] : null
}

export const rengClaveFormula = (rengTexto: string): string => {
  const rengF = rengAnalizarFormula(rengTexto)
  return rengF.electron ? 'e-' : `${rengFormulaHill(rengF.atomos)}${rengTextoCarga(rengF.carga)}`
}

export function rengCorregirFormula(rengTexto: string, rengEsperada: string): RengVeredicto {
  if (rengTexto.trim() === '') return rengVeredicto('entrada-invalida', 'vacia', 'Escribe una fórmula.')
  const rengAmbigua = rengLecturasAmbiguas(rengTexto)
  if (rengAmbigua) return rengVeredicto('ambigua', 'mayusculas', `«${rengTexto.trim()}» se puede leer de varias formas: ${rengAmbigua.join(' o ')}. Escribe los símbolos con su mayúscula (Co ≠ CO).`, { detalle: rengAmbigua })
  let rengObtenida
  try {
    rengObtenida = rengAnalizarFormula(rengTexto)
  } catch (rengE) {
    return rengVeredicto('entrada-invalida', 'formula-no-valida', rengE instanceof Error ? rengE.message : 'Fórmula mal escrita.')
  }
  const rengBuscada = rengAnalizarFormula(rengEsperada)
  const rengIgualAtomos = rengFormulaHill(rengObtenida.atomos) === rengFormulaHill(rengBuscada.atomos)
  if (rengIgualAtomos && rengObtenida.carga === rengBuscada.carga) return rengVeredicto('correcto', 'correcta', `¡Correcto! ${rengClaveFormula(rengEsperada)}.`)
  if (rengIgualAtomos) return rengVeredicto('incorrecto', 'carga', `Los átomos coinciden, pero la carga no: escribiste ${rengObtenida.carga > 0 ? '+' : ''}${rengObtenida.carga} y la especie pedida tiene ${rengBuscada.carga > 0 ? '+' : ''}${rengBuscada.carga}.`)
  const rengFactores = [...rengBuscada.atomos].map(([rengEl, rengN]) => (rengObtenida.atomos.get(rengEl) ?? 0) / rengN)
  const rengF0 = rengFactores[0]!
  if (rengObtenida.atomos.size === rengBuscada.atomos.size && rengF0 > 1 && Number.isInteger(rengF0) && rengFactores.every((rengX) => rengX === rengF0)) {
    return rengVeredicto('simplificable', 'sin-simplificar', `Los subíndices se pueden dividir entre ${rengF0}: la fórmula no está simplificada.`)
  }
  return rengVeredicto('incorrecto', 'otra-formula', 'No es la fórmula pedida. Revisa los elementos, los subíndices y la carga.')
}

interface RengTerminoLeido {
  clave: string
  formula: string
  coef: number
  atomos: Map<string, number>
  carga: number
}

function rengLeerCoeficiente(rengC: string | null): number | null {
  if (rengC === null) return 1
  const rengL = rengLeerNumeroEs(rengC)
  return rengL.ok && rengL.valor > 0 ? rengL.valor : null
}

function rengMcdEnteros(rengValores: number[]): number {
  const rengMcd = (rengA: number, rengB: number): number => (rengB === 0 ? rengA : rengMcd(rengB, rengA % rengB))
  return rengValores.reduce((rengA, rengB) => rengMcd(rengA, rengB))
}

function rengFundir(rengLado: RengTerminoLeido[]): Map<string, RengTerminoLeido> {
  const rengMapa = new Map<string, RengTerminoLeido>()
  for (const rengT of rengLado) {
    const rengPrevio = rengMapa.get(rengT.clave)
    rengMapa.set(rengT.clave, rengPrevio ? { ...rengPrevio, coef: rengPrevio.coef + rengT.coef } : rengT)
  }
  return rengMapa
}

const rengTextoEspecie = (rengClave: string): string => (rengClave === 'e-' ? 'e⁻' : rengClave)

export function rengCorregirEcuacion(rengTexto: string, rengEsperada: { reactivos: RengTerminoEcuacion[]; productos: RengTerminoEcuacion[]; coeficientesMinimos: boolean }): RengVeredicto {
  if (rengTexto.trim() === '') return rengVeredicto('entrada-invalida', 'vacia', 'Escribe la ecuación completa, por ejemplo 2 H2 + O2 -> 2 H2O.')
  let rengNotacion
  try {
    rengNotacion = rengAnalizarNotacion(rengTexto)
  } catch (rengE) {
    return rengVeredicto('entrada-invalida', 'ecuacion-no-valida', rengE instanceof Error ? rengE.message : 'Ecuación mal escrita.')
  }
  if (!rengNotacion.flecha) return rengVeredicto('entrada-invalida', 'sin-flecha', 'Falta la flecha (->, → o =) entre reactivos y productos.')
  const rengLeer = (rengLado: typeof rengNotacion.izquierda): RengTerminoLeido[] | string => {
    const rengOut: RengTerminoLeido[] = []
    for (const rengE of rengLado) {
      const rengCoef = rengLeerCoeficiente(rengE.coef)
      if (rengCoef === null) return `El coeficiente «${rengE.coef}» no es válido.`
      const rengF = rengAnalizarFormula(rengE.formula)
      rengOut.push({ clave: rengClaveFormula(rengE.formula), formula: rengE.formula, coef: rengCoef, atomos: rengF.atomos, carga: rengF.carga })
    }
    return rengOut
  }
  let rengIzq: RengTerminoLeido[] | string
  let rengDer: RengTerminoLeido[] | string
  try {
    rengIzq = rengLeer(rengNotacion.izquierda)
    rengDer = rengLeer(rengNotacion.derecha)
  } catch (rengE) {
    return rengVeredicto('entrada-invalida', 'especie-no-valida', rengE instanceof Error ? rengE.message : 'Fórmula mal escrita.')
  }
  if (typeof rengIzq === 'string') return rengVeredicto('entrada-invalida', 'coeficiente', rengIzq)
  if (typeof rengDer === 'string') return rengVeredicto('entrada-invalida', 'coeficiente', rengDer)
  const rengMIzq = rengFundir(rengIzq)
  const rengMDer = rengFundir(rengDer)
  const rengClavesEsperadas = (rengL: RengTerminoEcuacion[]): Set<string> => new Set(rengL.map((rengT) => rengClaveFormula(rengT.formula)))
  const rengEIzq = rengClavesEsperadas(rengEsperada.reactivos)
  const rengEDer = rengClavesEsperadas(rengEsperada.productos)
  const rengFalta = [...rengEIzq].filter((rengK) => !rengMIzq.has(rengK)).concat([...rengEDer].filter((rengK) => !rengMDer.has(rengK)))
  const rengSobra = [...rengMIzq.keys()].filter((rengK) => !rengEIzq.has(rengK)).concat([...rengMDer.keys()].filter((rengK) => !rengEDer.has(rengK)))
  const rengElementos = new Set<string>()
  for (const rengT of [...rengMIzq.values(), ...rengMDer.values()]) for (const rengEl of rengT.atomos.keys()) rengElementos.add(rengEl)
  const rengCuenta = (rengM: Map<string, RengTerminoLeido>, rengEl: string): number => [...rengM.values()].reduce((rengA, rengT) => rengA + rengT.coef * (rengT.atomos.get(rengEl) ?? 0), 0)
  const rengCarga = (rengM: Map<string, RengTerminoLeido>): number => [...rengM.values()].reduce((rengA, rengT) => rengA + rengT.coef * rengT.carga, 0)
  const rengDesajustes: string[] = []
  for (const rengEl of rengElementos) {
    const rengA = rengCuenta(rengMIzq, rengEl)
    const rengB = rengCuenta(rengMDer, rengEl)
    if (Math.abs(rengA - rengB) > 1e-9) rengDesajustes.push(`${rengEl}: ${rengTextoNumero(rengA, 6)} a la izquierda y ${rengTextoNumero(rengB, 6)} a la derecha`)
  }
  const rengCI = rengCarga(rengMIzq)
  const rengCD = rengCarga(rengMDer)
  if (Math.abs(rengCI - rengCD) > 1e-9) rengDesajustes.push(`carga: ${rengTextoNumero(rengCI, 6)} a la izquierda y ${rengTextoNumero(rengCD, 6)} a la derecha`)
  if (rengFalta.length > 0 || rengSobra.length > 0) {
    const rengDetalle = [...rengFalta.map((rengK) => `Falta ${rengTextoEspecie(rengK)}`), ...rengSobra.map((rengK) => `Sobra o está en otro lado: ${rengTextoEspecie(rengK)}`)]
    return rengVeredicto('incorrecto', rengDesajustes.length === 0 ? 'otras-especies' : 'no-equilibrada', rengDesajustes.length === 0 ? 'Está equilibrada, pero no usa las especies del enunciado en el lado pedido.' : 'No es la ecuación pedida: las especies no coinciden y además no se conserva todo.', { detalle: [...rengDetalle, ...rengDesajustes] })
  }
  if (rengDesajustes.length > 0) return rengVeredicto('incorrecto', 'no-equilibrada', 'La ecuación no está ajustada: no se conserva la materia o la carga.', { detalle: rengDesajustes })
  const rengCoefs = [...rengMIzq.values(), ...rengMDer.values()].map((rengT) => rengT.coef)
  if (rengCoefs.some((rengC) => !Number.isInteger(rengC))) {
    return rengVeredicto('simplificable', 'fraccionarios', 'Está equilibrada, pero con coeficientes fraccionarios. Multiplica todos para obtener enteros mínimos.')
  }
  const rengG = rengMcdEnteros(rengCoefs)
  if (rengEsperada.coeficientesMinimos && rengG > 1) {
    return rengVeredicto('simplificable', 'sin-simplificar', `Está equilibrada, pero aún se puede simplificar: todos los coeficientes se dividen entre ${rengG}.`, { detalle: [`Coeficientes mínimos: divide cada uno entre ${rengG}.`] })
  }
  return rengVeredicto('correcto', 'correcta', '¡Correcto! Se conservan los elementos y la carga, con coeficientes enteros mínimos.')
}

export type RengLecturaEstructura = { ok: true; grafo: RengMoleculaGrafo } | { ok: false; tipo: 'ambigua' | 'invalida' | 'no-molecular'; mensaje: string }

export function rengLeerEstructura(rengTexto: string): RengLecturaEstructura {
  const rengT = rengTexto.trim()
  if (rengT === '') return { ok: false, tipo: 'invalida', mensaje: 'Escribe una estructura: fórmula semidesarrollada (CH3CH2OH), SMILES (CCO) o nombre.' }
  const rengR = rengInterpretarSustancia(rengT)
  if (rengR.tipo === 'isomeros') {
    return { ok: false, tipo: 'ambigua', mensaje: `${rengR.formula} corresponde a más de una sustancia (${rengR.opciones.map((rengO) => rengO.nombre).join(', ')}). Escribe la fórmula semidesarrollada o el SMILES para indicar cuál.` }
  }
  if (rengR.tipo === 'error') return { ok: false, tipo: 'invalida', mensaje: rengR.motivo }
  const rengS = rengR.sustancia
  if (rengS.grafo) return { ok: true, grafo: rengS.grafo }
  if (rengS.smiles) return { ok: true, grafo: rengDesdeSmiles(rengS.smiles) }
  return { ok: false, tipo: 'no-molecular', mensaje: 'Eso no se puede representar como una estructura molecular con enlaces. Escribe una molécula orgánica o covalente.' }
}

export function rengCorregirEstructura(rengTexto: string, rengEsperada: Extract<RengRespuestaEsperada, { tipo: 'estructura' }>): RengVeredicto {
  const rengLectura = rengLeerEstructura(rengTexto)
  if (!rengLectura.ok) return rengVeredicto(rengLectura.tipo === 'ambigua' ? 'ambigua' : 'entrada-invalida', rengLectura.tipo === 'ambigua' ? 'formula-molecular' : rengLectura.tipo, rengLectura.mensaje)
  const rengG = rengLectura.grafo
  const rengRef = rengDesdeSmiles(rengEsperada.smiles)
  const rengMismaFormula = rengG.formula === rengRef.formula && rengG.carga === rengRef.carga
  if (rengEsperada.modo === 'igual') {
    const rengIgual = rengEsperada.estereo === 'exigir' ? rengG.id === rengRef.id : rengG.idSinEstereo === rengRef.idSinEstereo
    if (rengIgual) return rengVeredicto('correcto', 'correcta', '¡Correcto! Es la misma estructura, aunque esté escrita de otra forma.')
    if (rengG.idSinEstereo === rengRef.idSinEstereo) return rengVeredicto('incorrecto', 'estereoisomero', 'La conectividad es la correcta, pero la estereoquímica no: es otro estereoisómero.')
    if (rengMismaFormula) return rengVeredicto('incorrecto', 'isomero-constitucional', `Tiene la misma fórmula molecular (${rengRef.formula}) pero los átomos están enlazados de otra forma: es un isómero constitucional, no la sustancia pedida.`)
    if (rengG.formula === rengRef.formula) return rengVeredicto('incorrecto', 'carga', `La composición coincide, pero la carga no (${rengG.carga} frente a ${rengRef.carga}).`)
    return rengVeredicto('incorrecto', 'otra-sustancia', `Tu estructura es ${rengG.formula}; se pedía ${rengRef.formula}.`)
  }
  if (!rengMismaFormula) return rengVeredicto('incorrecto', 'formula-distinta', `Un isómero conserva la fórmula molecular ${rengEsperada.formula}; tu estructura es ${rengG.formula}.`)
  if (rengG.idSinEstereo === rengRef.idSinEstereo) return rengVeredicto('incorrecto', 'mismo-compuesto', 'Es la misma sustancia que la del enunciado, no un isómero distinto.')
  if (rengEsperada.grupo && !rengGruposFuncionales(rengG).some((rengX) => rengX.tipo === rengEsperada.grupo)) {
    return rengVeredicto('incorrecto', 'grupo-distinto', `Es un isómero de ${rengEsperada.formula}, pero no contiene el grupo funcional pedido.`)
  }
  return rengVeredicto('correcto', 'correcta', `¡Correcto! Es un isómero constitucional de ${rengEsperada.formula} con el grupo pedido.`)
}

export function rengCorregirNombre(rengTexto: string, rengEsperada: Extract<RengRespuestaEsperada, { tipo: 'nombre' }>): RengVeredicto {
  const rengT = rengTexto.trim()
  if (rengT === '') return rengVeredicto('entrada-invalida', 'vacia', 'Escribe el nombre.')
  const rengNormal = rengNormalizarNombre(rengT)
  if (rengEsperada.aceptados.some((rengN) => rengNormalizarNombre(rengN) === rengNormal)) return rengVeredicto('correcto', 'correcta', `¡Correcto! ${rengEsperada.aceptados[0]}.`)
  try {
    const rengDesdeNombre = rengSmilesDesdeNombre(rengT)
    const rengA = rengDesdeSmiles(rengDesdeNombre.smiles)
    const rengRef = rengDesdeSmiles(rengEsperada.smiles)
    if (rengA.idSinEstereo === rengRef.idSinEstereo) return rengVeredicto('correcto', 'correcta', `¡Correcto! Es otro nombre válido de la misma sustancia (${rengEsperada.aceptados[0]}).`)
    if (rengA.formula === rengRef.formula) return rengVeredicto('incorrecto', 'isomero-constitucional', `Ese nombre corresponde a un isómero (${rengA.formula}), no a la estructura del enunciado.`)
    return rengVeredicto('incorrecto', 'otra-sustancia', 'Ese nombre corresponde a otra sustancia. Revisa la cadena principal, la numeración y los sustituyentes.')
  } catch {
    return rengVeredicto('incorrecto', 'nombre-desconocido', 'No reconozco ese nombre. Revisa la ortografía y la numeración (por ejemplo, butan-2-ol).')
  }
}

export function rengCorregirOpcion(rengElegida: string | null, rengEsperada: Extract<RengRespuestaEsperada, { tipo: 'opcion' }>): RengVeredicto {
  if (!rengElegida) return rengVeredicto('entrada-invalida', 'vacia', 'Elige una de las opciones.')
  if (rengElegida === rengEsperada.correcta) return rengVeredicto('correcto', 'correcta', `¡Correcto! ${rengEsperada.opciones.find((rengO) => rengO.id === rengEsperada.correcta)?.texto ?? ''}`.trim())
  return rengVeredicto('incorrecto', 'opcion', 'Aún no. Revisa las pistas y vuelve a elegir.')
}

export function rengCorregirRespuesta(rengTexto: string, rengEsperada: RengRespuestaEsperada): RengVeredicto {
  switch (rengEsperada.tipo) {
    case 'numero':
      return rengCorregirNumero(rengTexto, rengEsperada)
    case 'formula':
      return rengCorregirFormula(rengTexto, rengEsperada.formula)
    case 'ecuacion':
      return rengCorregirEcuacion(rengTexto, rengEsperada)
    case 'estructura':
      return rengCorregirEstructura(rengTexto, rengEsperada)
    case 'nombre':
      return rengCorregirNombre(rengTexto, rengEsperada)
    case 'opcion':
      return rengCorregirOpcion(rengTexto === '' ? null : rengTexto, rengEsperada)
  }
}

export function rengTextoEcuacionEsperada(rengE: { reactivos: RengTerminoEcuacion[]; productos: RengTerminoEcuacion[] }): string {
  const rengLado = (rengL: RengTerminoEcuacion[]): string => rengL.map((rengT) => `${rengT.coef === 1 ? '' : rengT.coef} ${rengT.formula}`.trim()).join(' + ')
  return `${rengLado(rengE.reactivos)} -> ${rengLado(rengE.productos)}`
}
