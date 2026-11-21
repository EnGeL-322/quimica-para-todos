import { rengAleatorio } from './aleatorio'
import { RENG_COMPUESTOS_BINARIOS } from './compuestosBinarios'
import { rengAnalizarFormula, rengFormulaHill } from './formula'
import {
  rengCatalogo,
  rengEscribirFormula,
  rengFormularDesdeNombre,
  rengNombrar,
  rengNormalizarNombre,
  RENG_NOMBRE_NOMENCLATURA,
  type RengCompuesto,
  type RengNomenclatura
} from './nomenclatura'

export type RengNivelEjercicio = 1 | 2 | 3
export const RENG_NIVELES: Record<RengNivelEjercicio, string> = { 1: 'Binarios', 2: 'Hidróxidos y oxoácidos', 3: 'Oxisales, sales ácidas e hidratos' }

export interface RengEjercicio {
  id: string
  tipo: 'formular' | 'nombrar'
  nivel: RengNivelEjercicio
  enunciado: string
  nomenclatura?: RengNomenclatura
  compuesto: RengCompuesto
}

export type RengTipoError = 'vacio' | 'sin-simplificar' | 'numero-oxidacion' | 'prefijo' | 'oso-ico' | 'parentesis' | 'desconocido' | 'otro'

export interface RengCorreccion {
  correcta: boolean
  error: RengTipoError | null
  mensaje: string
  soluciones: string[]
}

const RENG_METALES_HABITUALES = new Set(['Na', 'K', 'Li', 'Ca', 'Mg', 'Ba', 'Al', 'Fe', 'Cu', 'Zn', 'Ni', 'Pb', 'Sn', 'Ag', 'Co', 'Hg', 'Cr', 'Mn', 'NH4'])
const RENG_HIDRATOS = ['CuSO4·5H2O', 'MgSO4·7H2O', 'CaSO4·2H2O', 'Na2CO3·10H2O', 'CoCl2·6H2O', 'FeSO4·7H2O']

const rengClave = (rengF: string): string => rengFormulaHill(rengAnalizarFormula(rengF).atomos)
const RENG_CONOCIDOS = new Set(RENG_COMPUESTOS_BINARIOS.map((rengC) => rengClave(rengC.formula)))

let RENG_BANCO: Record<RengNivelEjercicio, RengCompuesto[]> | null = null

export function rengBanco(): Record<RengNivelEjercicio, RengCompuesto[]> {
  if (RENG_BANCO) return RENG_BANCO
  const rengCat = rengCatalogo()
  const rengHabitual = (rengK: RengCompuesto): boolean => rengK.cation !== null && RENG_METALES_HABITUALES.has(rengK.cation.unidad)
  RENG_BANCO = {
    1: rengCat.filter((rengK) => ['oxido-basico', 'oxido-acido', 'hidruro-metalico', 'sal-binaria', 'binario-no-metalico'].includes(rengK.funcion) && RENG_CONOCIDOS.has(rengClave(rengK.formula))),
    2: rengCat.filter((rengK) => (rengK.funcion === 'hidroxido' && rengHabitual(rengK)) || rengK.funcion === 'oxoacido'),
    3: [...rengCat.filter((rengK) => (rengK.funcion === 'oxisal' || rengK.funcion === 'sal-acida') && rengHabitual(rengK)), ...RENG_HIDRATOS.map((rengH) => rengNombrar(rengH))]
  }
  return RENG_BANCO
}

export function rengGenerarEjercicios(rengNivel: RengNivelEjercicio, rengN: number, rengSemilla: number): RengEjercicio[] {
  const rengAzar = rengAleatorio(rengSemilla)
  const rengPool = rengBanco()[rengNivel]
  const rengOut: RengEjercicio[] = []
  const rengUsados = new Set<string>()
  for (let rengI = 0; rengOut.length < rengN && rengI < rengN * 20; rengI++) {
    const rengK = rengPool[Math.floor(rengAzar() * rengPool.length)]!
    if (rengUsados.has(rengK.formula)) continue
    rengUsados.add(rengK.formula)
    const rengNombres = (['sistematica', 'stock', 'tradicional'] as const).filter((rengX) => rengK.nombres[rengX])
    if (rengAzar() < 0.5 && rengNombres.length) {
      const rengNom = rengNombres[Math.floor(rengAzar() * rengNombres.length)]!
      rengOut.push({ id: `${rengNivel}-${rengI}`, tipo: 'formular', nivel: rengNivel, enunciado: rengK.nombres[rengNom]!, nomenclatura: rengNom, compuesto: rengK })
    } else {
      rengOut.push({ id: `${rengNivel}-${rengI}`, tipo: 'nombrar', nivel: rengNivel, enunciado: rengK.formula, compuesto: rengK })
    }
  }
  return rengOut
}

const rengComposicion = (rengF: string): Map<string, number> => rengAnalizarFormula(rengF).atomos
const rengIgualComposicion = (rengA: Map<string, number>, rengB: Map<string, number>): boolean => rengA.size === rengB.size && [...rengA].every(([rengE, rengN]) => rengB.get(rengE) === rengN)
const rengSinEspacios = (rengS: string): string => rengS.replace(/\s+/g, '').replace(/[·•*.]/g, '·')

function rengSolucionesFormula(rengK: RengCompuesto): string[] {
  return [rengK.formula]
}

function rengCorregirFormula(rengK: RengCompuesto, rengRespuesta: string): RengCorreccion {
  const rengSoluciones = rengSolucionesFormula(rengK)
  const rengR = rengSinEspacios(rengRespuesta)
  let rengComp: Map<string, number>
  try {
    rengComp = rengComposicion(rengR)
  } catch (rengE) {
    return { correcta: false, error: 'otro', mensaje: rengE instanceof Error ? rengE.message : 'Fórmula mal escrita.', soluciones: rengSoluciones }
  }
  const rengOk = rengComposicion(rengK.formula)
  if (rengIgualComposicion(rengComp, rengOk)) {
    if (rengK.formula.includes('(') && !rengR.includes('(')) {
      return { correcta: false, error: 'parentesis', mensaje: 'Los átomos son los correctos, pero un ion de varios átomos que se repite va entre paréntesis.', soluciones: rengSoluciones }
    }
    return { correcta: true, error: null, mensaje: '¡Correcto!', soluciones: rengSoluciones }
  }
  const rengA = rengK.anion
  if (rengA && rengA.unidad.length > 1 && rengK.nAn > 1) {
    const rengArreglada = rengR.replace(new RegExp(`${rengA.unidad}(\\d+)`), `(${rengA.unidad})$1`)
    if (rengArreglada !== rengR) {
      try {
        if (rengIgualComposicion(rengComposicion(rengArreglada), rengOk)) {
          return { correcta: false, error: 'parentesis', mensaje: `Te faltan los paréntesis: el subíndice ${rengK.nAn} afecta a todo el ${rengA.unidad}, no solo al último átomo.`, soluciones: rengSoluciones }
        }
      } catch {
      }
    }
  }
  const rengFactores = [...rengOk].map(([rengE, rengN]) => (rengComp.get(rengE) ?? 0) / rengN)
  const rengF0 = rengFactores[0]!
  if (rengComp.size === rengOk.size && rengF0 > 1 && Number.isInteger(rengF0) && rengFactores.every((rengX) => rengX === rengF0)) {
    return { correcta: false, error: 'sin-simplificar', mensaje: `Has olvidado simplificar: todos los subíndices se pueden dividir entre ${rengF0}.`, soluciones: rengSoluciones }
  }
  if (rengK.cation && rengK.anion) {
    for (let rengOx = 1; rengOx <= 8; rengOx++) {
      if (rengOx === rengK.cation.carga) continue
      const rengG = rengMcdN(rengOx, Math.abs(rengK.anion.carga))
      const rengOtra = rengEscribirFormula({ ...rengK.cation, carga: rengOx }, rengK.anion, Math.abs(rengK.anion.carga) / rengG, rengOx / rengG)
      if (rengIgualComposicion(rengComposicion(rengOtra), rengComp)) {
        return {
          correcta: false,
          error: 'numero-oxidacion',
          mensaje: `Número de oxidación equivocado: tu fórmula usa ${rengK.cation.el} con +${rengOx}, pero aquí es +${rengK.cation.carga}.`,
          soluciones: rengSoluciones
        }
      }
    }
  }
  return { correcta: false, error: 'otro', mensaje: 'No es correcto. Revisa las cargas de los iones y crúzalas.', soluciones: rengSoluciones }
}

const rengMcdN = (rengA: number, rengB: number): number => (rengB === 0 ? Math.abs(rengA) : rengMcdN(rengB, rengA % rengB))

const RENG_PREFIJOS = /\b(mono|di|tri|tetra|penta|hexa|hepta|octa|bis|tris|tetrakis)(?=[a-z(\[])/g
const rengQuitarPrefijos = (rengS: string): string => rengS.replace(/monoxido/g, 'monooxido').replace(RENG_PREFIJOS, '')
const rengIntercambiarOsoIco = (rengS: string): string =>
  rengS.replace(/(oso|ico|ito|ato)\b/g, (rengM) => ({ oso: 'ico', ico: 'oso', ito: 'ato', ato: 'ito' })[rengM as 'oso'] ?? rengM)
const rengQuitarRomanos = (rengS: string): string => rengS.replace(/\([ivx]+\)/g, '')

function rengCorregirNombre(rengK: RengCompuesto, rengRespuesta: string): RengCorreccion {
  const rengSoluciones = (['sistematica', 'stock', 'tradicional'] as const)
    .filter((rengN) => rengK.nombres[rengN])
    .map((rengN) => `${RENG_NOMBRE_NOMENCLATURA[rengN]}: ${rengK.nombres[rengN]}`)
  const rengR = rengNormalizarNombre(rengRespuesta)
  let rengEncontrado: RengCompuesto | null = null
  try {
    rengEncontrado = rengFormularDesdeNombre(rengRespuesta)
  } catch {
    rengEncontrado = null
  }
  if (rengEncontrado && rengIgualComposicion(rengComposicion(rengEncontrado.formula.split('·')[0]!), rengComposicion(rengK.formula.split('·')[0]!)) && rengEncontrado.agua === rengK.agua) {
    return { correcta: true, error: null, mensaje: '¡Correcto!', soluciones: rengSoluciones }
  }
  const rengCorrectos = (['sistematica', 'stock', 'tradicional'] as const).map((rengN) => rengK.nombres[rengN]).filter((rengX): rengX is string => Boolean(rengX)).map(rengNormalizarNombre)
  if (rengCorrectos.some((rengC) => rengIntercambiarOsoIco(rengC) === rengR)) {
    return { correcta: false, error: 'oso-ico', mensaje: 'Has cambiado las terminaciones: -oso es el estado de oxidación menor y -ico el mayor (y en los aniones, -ito y -ato).', soluciones: rengSoluciones }
  }
  if (rengCorrectos.some((rengC) => rengQuitarRomanos(rengC) === rengQuitarRomanos(rengR) && rengC !== rengR)) {
    return { correcta: false, error: 'numero-oxidacion', mensaje: 'El número romano no es el correcto: es el número de oxidación del metal en este compuesto.', soluciones: rengSoluciones }
  }
  if (rengCorrectos.some((rengC) => rengQuitarPrefijos(rengC) === rengQuitarPrefijos(rengR) && rengC !== rengR)) {
    return { correcta: false, error: 'prefijo', mensaje: 'Un prefijo está mal puesto: cuenta cuántos átomos (o grupos) de cada clase hay en la fórmula.', soluciones: rengSoluciones }
  }
  if (rengEncontrado) {
    return { correcta: false, error: 'otro', mensaje: `Ese nombre corresponde a otra fórmula (${rengEncontrado.formula}).`, soluciones: rengSoluciones }
  }
  return { correcta: false, error: 'desconocido', mensaje: 'No reconozco ese nombre. Revisa la ortografía.', soluciones: rengSoluciones }
}

export function rengCorregir(rengE: RengEjercicio, rengRespuesta: string): RengCorreccion {
  if (!rengRespuesta.trim()) return { correcta: false, error: 'vacio', mensaje: 'Escribe una respuesta.', soluciones: [] }
  return rengE.tipo === 'formular' ? rengCorregirFormula(rengE.compuesto, rengRespuesta) : rengCorregirNombre(rengE.compuesto, rengRespuesta)
}

