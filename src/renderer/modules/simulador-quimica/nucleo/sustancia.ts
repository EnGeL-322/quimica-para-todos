import { RENG_BIBLIOTECA, type RengEntradaBiblioteca } from '../datos/biblioteca'
import { rengPorSimbolo } from '../../tabla-periodica/data'
import { rengExistencia, type RengExistencia } from './compuestosConocidos'
import { RENG_ESTRUCTURAS } from './cristales'
import { rengAnalizarFormula, rengFormulaHill, rengMasaMolarDe } from './formula'
import { rengDesdeSmiles, type RengMoleculaGrafo } from './molecula'
import { rengFormularDesdeNombre, rengInterpretar, rengNormalizarNombre, type RengCompuesto } from './nomenclatura'
import { rengNombrarOrganico, rengSmilesDesdeNombre, type RengNombreOrganico } from './organica'
import { rengAyudaFormula, rengAyudaMinusculas } from './ayudaEntrada'
import { rengSemidesarrolladaASmiles } from './semidesarrollada'

export { rengSemidesarrolladaASmiles }

export type RengTipoSustancia = 'elemento' | 'molecula' | 'organico' | 'ionico' | 'ion' | 'mezcla'
export type RengVia = 'formula' | 'semidesarrollada' | 'nombre' | 'smiles' | 'elemento'

export const RENG_NOMBRE_TIPO: Record<RengTipoSustancia, string> = {
  elemento: 'Elemento',
  molecula: 'Sustancia molecular',
  organico: 'Compuesto orgánico',
  ionico: 'Compuesto iónico (red de iones)',
  ion: 'Ion',
  mezcla: 'Mezcla de sustancias (componentes separados)'
}
export const RENG_NOMBRE_VIA: Record<RengVia, string> = {
  formula: 'Fórmula',
  semidesarrollada: 'Fórmula semidesarrollada',
  nombre: 'Nombre',
  smiles: 'SMILES',
  elemento: 'Elemento'
}

export interface RengSustancia {
  entrada: string
  via: RengVia
  nombre: string
  otrosNombres: string[]
  formula: string
  smiles: string | null
  grafo: RengMoleculaGrafo | null
  inorganico: RengCompuesto | null
  organico: RengNombreOrganico | null
  carga: number
  masaMolar: number
  tipo: RengTipoSustancia
  idExperimental: string | null
  idRed: string | null
  existe: RengExistencia | null
  notas: string[]
}

export type RengResultadoEntrada =
  | { tipo: 'ok'; sustancia: RengSustancia }
  | { tipo: 'isomeros'; formula: string; opciones: RengEntradaBiblioteca[]; nota: string }
  | { tipo: 'error'; motivo: string; sugerencias: string[] }

const RENG_EXPERIMENTALES: Record<string, string> = { h2o: 'O', co2: 'O=C=O', ch4: 'C', nh3: 'N', c2h4: 'C=C', c2h2: 'C#C', c6h6: 'c1ccccc1', hcl: 'Cl', o2: 'O=O', n2: 'N#N' }
let RENG_ID_EXPERIMENTAL: Map<string, string> | null = null
function rengIdExperimental(rengG: RengMoleculaGrafo | null): string | null {
  if (!rengG) return null
  if (!RENG_ID_EXPERIMENTAL) RENG_ID_EXPERIMENTAL = new Map(Object.entries(RENG_EXPERIMENTALES).map(([rengId, rengS]) => [rengDesdeSmiles(rengS).id, rengId]))
  return RENG_ID_EXPERIMENTAL.get(rengG.id) ?? null
}

const RENG_REDES: Record<string, string> = { NaCl: 'NaCl', MgO: 'MgO', CaF2: 'CaF2', CsCl: 'CsCl', TiO2: 'TiO2' }

const rengHill = (rengF: string): string => rengFormulaHill(rengAnalizarFormula(rengF).atomos)
const rengSinCarga = (rengF: string): string => rengF.replace(/\^.*$/, '')
const RENG_BIBLIO_POR_NOMBRE = new Map<string, RengEntradaBiblioteca>()
for (const rengE of RENG_BIBLIOTECA) for (const rengN of [rengE.nombre, ...(rengE.otros ?? [])]) RENG_BIBLIO_POR_NOMBRE.set(rengNormalizarNombre(rengN), rengE)

function rengLevenshtein(rengA: string, rengB: string): number {
  const rengD = Array.from({ length: rengA.length + 1 }, (_, rengI) => [rengI, ...Array<number>(rengB.length).fill(0)])
  for (let rengJ = 1; rengJ <= rengB.length; rengJ++) rengD[0]![rengJ] = rengJ
  for (let rengI = 1; rengI <= rengA.length; rengI++)
    for (let rengJ = 1; rengJ <= rengB.length; rengJ++) rengD[rengI]![rengJ] = Math.min(rengD[rengI - 1]![rengJ]! + 1, rengD[rengI]![rengJ - 1]! + 1, rengD[rengI - 1]![rengJ - 1]! + (rengA[rengI - 1] === rengB[rengJ - 1] ? 0 : 1))
  return rengD[rengA.length]![rengB.length]!
}

function rengSugerencias(rengTexto: string): string[] {
  const rengN = rengNormalizarNombre(rengTexto)
  const rengNombres = RENG_BIBLIOTECA.flatMap((rengE) => [rengE.nombre, ...(rengE.otros ?? [])])
  return rengNombres
    .map((rengX) => ({ x: rengX, d: rengLevenshtein(rengN, rengNormalizarNombre(rengX)) }))
    .filter((rengO) => rengO.d <= Math.max(2, Math.floor(rengN.length / 4)))
    .sort((rengA, rengB) => rengA.d - rengB.d)
    .slice(0, 3)
    .map((rengO) => rengO.x)
}

function rengDesdeComponentes(rengEntrada: string, rengVia: RengVia, rengG: RengMoleculaGrafo, rengPartes: readonly string[]): RengSustancia {
  const rengSubs = rengPartes.map((rengP) => rengDesdeGrafo(rengP, rengVia, rengDesdeSmiles(rengP)))
  const rengIones = rengSubs.every((rengS) => rengS.carga !== 0)
  if (rengIones && rengG.carga === 0) {
    const rengInorg = (() => {
      try {
        return rengInterpretar(rengG.formula).compuesto
      } catch {
        return null
      }
    })()
    if (rengInorg && RENG_METALICOS.has(rengInorg.funcion)) {
      const rengS = rengDesdeInorganico(rengEntrada, rengVia, rengInorg)
      return { ...rengS, smiles: rengG.smiles, grafo: rengG, idExperimental: null, notas: [...rengS.notas, 'Escrito como iones separados: es la unidad fórmula de un compuesto iónico, no una molécula.'] }
    }
    return {
      entrada: rengEntrada, via: rengVia, nombre: `iones ${rengSubs.map((rengS) => rengS.formula).join(' y ')}`, otrosNombres: [], formula: rengG.formula, smiles: rengG.smiles, grafo: rengG, inorganico: null, organico: null, carga: 0, masaMolar: rengG.masaMolar,
      tipo: 'ionico', idExperimental: null, idRed: null, existe: null,
      notas: ['La app no reconoce esta sal: se muestran los iones que la forman. La fórmula está ordenada por el sistema de Hill.']
    }
  }
  const rengCuenta = new Map<string, { s: RengSustancia; n: number }>()
  for (const rengS of rengSubs) {
    const rengK = `${rengS.nombre}|${rengS.formula}`
    const rengX = rengCuenta.get(rengK)
    if (rengX) rengX.n++
    else rengCuenta.set(rengK, { s: rengS, n: 1 })
  }
  const rengLista = [...rengCuenta.values()]
  return {
    entrada: rengEntrada,
    via: rengVia,
    nombre: `Mezcla: ${rengLista.map(({ s: rengS, n: rengN }) => `${rengN > 1 ? `${rengN} × ` : ''}${rengS.nombre}`).join(' + ')}`,
    otrosNombres: [],
    formula: rengLista.map(({ s: rengS, n: rengN }) => `${rengN > 1 ? rengN : ''}${rengS.formula}`).join(' + '),
    smiles: rengG.smiles,
    grafo: rengG,
    inorganico: null,
    organico: null,
    carga: rengG.carga,
    masaMolar: NaN,
    tipo: 'mezcla',
    idExperimental: null,
    idRed: null,
    existe: null,
    notas: [`Son ${rengSubs.length} especies separadas (sin enlace entre ellas), no una sola sustancia: no tiene un nombre ni una masa molar únicos. En la mesa, cada una se identifica por separado.`]
  }
}

function rengDesdeGrafo(rengEntrada: string, rengVia: RengVia, rengG: RengMoleculaGrafo, rengExtra: { nombre?: string; otros?: string[]; notas?: string[]; formula?: string } = {}): RengSustancia {
  const rengPartes = rengG.componentes.length > 1 && rengG.smiles ? rengG.smiles.split('.') : []
  if (rengPartes.length > 1 && !rengExtra.nombre) return rengDesdeComponentes(rengEntrada, rengVia, rengG, rengPartes)
  let rengOrg: RengNombreOrganico | null = null
  const rengNotas = [...(rengExtra.notas ?? [])]
  try {
    rengOrg = rengNombrarOrganico(rengG)
  } catch (rengE) {
    if (rengG.atomos.some((rengA) => rengA.el === 'C')) rengNotas.push(rengE instanceof Error ? rengE.message : String(rengE))
  }
  const rengBiblio = RENG_BIBLIOTECA.find((rengB) => rengB.smiles && rengDesdeSmiles(rengB.smiles).id === rengG.id)
  const rengTieneC = rengG.atomos.some((rengA) => rengA.el === 'C')
  const rengInorg = (() => {
    try {
      return rengInterpretar(rengG.formula).compuesto
    } catch {
      return null
    }
  })()
  const rengNombresOrg = rengOrg ? [rengOrg.nombre, ...rengOrg.comunes] : []
  const rengNombre =
    rengExtra.nombre ??
    (rengInorg ? (rengBiblio?.nombre ?? rengInorg.nombres.principal) : undefined) ??
    (rengBiblio && rengOrg && !rengNombresOrg.includes(rengBiblio.nombre) ? rengBiblio.nombre : undefined) ??
    rengOrg?.nombre ??
    rengBiblio?.nombre ??
    rengG.formula
  const rengOtros = [...new Set([...(rengExtra.otros ?? []), ...(rengInorg ? [rengInorg.nombres.principal, rengInorg.nombres.sistematica, rengInorg.nombres.stock].filter((rengX): rengX is string => Boolean(rengX)) : []), ...(rengOrg && !rengInorg && rengNombresOrg.includes(rengNombre) ? rengNombresOrg : []), ...(rengBiblio ? [rengBiblio.nombre, ...(rengBiblio.otros ?? [])] : [])])].filter((rengX) => rengX !== rengNombre)
  return {
    entrada: rengEntrada,
    via: rengVia,
    nombre: rengNombre,
    otrosNombres: rengOtros,
    formula: rengExtra.formula ?? (rengG.carga ? rengG.formula : rengG.formula),
    smiles: rengG.smiles,
    grafo: rengG,
    inorganico: rengInorg,
    organico: rengOrg,
    carga: rengG.carga,
    masaMolar: rengG.masaMolar,
    tipo: rengG.carga !== 0 ? 'ion' : rengG.atomos.length === 1 || new Set(rengG.atomos.map((rengA) => rengA.el)).size === 1 ? 'elemento' : rengTieneC && !rengInorg ? 'organico' : 'molecula',
    idExperimental: rengIdExperimental(rengG),
    idRed: null,
    existe: rengInorg?.existe ?? null,
    notas: rengNotas
  }
}

const RENG_METALICOS = new Set(['oxido-basico', 'peroxido', 'hidruro-metalico', 'sal-binaria', 'hidroxido', 'oxisal', 'sal-acida', 'sal-hidratada', 'oxido-mixto'])

function rengDesdeInorganico(rengEntrada: string, rengVia: RengVia, rengK: RengCompuesto): RengSustancia {
  const rengBiblio = RENG_BIBLIOTECA.find((rengB) => rengB.smiles && (() => {
    try {
      return rengHill(rengB.entrada) === rengHill(rengSinCarga(rengK.formula)) && !rengK.formula.includes('·')
    } catch {
      return false
    }
  })())
  const rengGrafo = rengBiblio?.smiles ? rengDesdeSmiles(rengBiblio.smiles) : null
  const rengIonico = RENG_METALICOS.has(rengK.funcion) && rengK.cation?.tipo !== 'no-metal'
  const rengBase = rengK.formula.split('·')[0]!
  return {
    entrada: rengEntrada,
    via: rengVia,
    nombre: rengK.nombres.principal,
    otrosNombres: [rengK.nombres.sistematica, rengK.nombres.stock, rengK.nombres.tradicional, ...rengK.nombres.comunes].filter((rengX): rengX is string => Boolean(rengX) && rengX !== rengK.nombres.principal),
    formula: rengK.formula,
    smiles: rengIonico ? null : (rengGrafo?.smiles ?? null),
    grafo: rengIonico ? null : rengGrafo,
    inorganico: rengK,
    organico: null,
    carga: rengK.carga,
    masaMolar: rengMasaMolarDe(rengK.formula),
    tipo: rengK.carga !== 0 ? 'ion' : rengIonico ? 'ionico' : 'molecula',
    idExperimental: rengIonico ? null : rengIdExperimental(rengGrafo),
    idRed: RENG_REDES[rengBase] ?? null,
    existe: rengK.existe,
    notas: []
  }
}

const RENG_MOLECULAS_ELEMENTALES: Record<string, string> = { H2: '[H][H]', N2: 'N#N', O2: 'O=O', O3: '[O-][O+]=O', F2: 'FF', Cl2: 'ClCl', Br2: 'BrBr', I2: 'II', P4: 'P12P3P1P23', S8: 'S1SSSSSSS1' }
const RENG_DIATOMICOS = new Set(['H', 'N', 'O', 'F', 'Cl', 'Br', 'I'])

function rengElemento(rengEntrada: string, rengSim: string, rengN: number): RengResultadoEntrada {
  const rengE = rengPorSimbolo.get(rengSim)!
  const rengClave = `${rengSim}${rengN > 1 ? rengN : ''}`
  if (RENG_MOLECULAS_ELEMENTALES[rengClave]) {
    return { tipo: 'ok', sustancia: { ...rengDesdeGrafo(rengEntrada, 'elemento', rengDesdeSmiles(RENG_MOLECULAS_ELEMENTALES[rengClave]), { nombre: rengE.nombre.toLowerCase() }), tipo: 'elemento' } }
  }
  if (rengN > 1) {
    return {
      tipo: 'error',
      motivo: `«${rengEntrada}» no es la forma habitual del ${rengE.nombre.toLowerCase()}${RENG_DIATOMICOS.has(rengSim) ? '' : `: no forma moléculas ${rengSim}${rengN}`}. Escribe «${RENG_DIATOMICOS.has(rengSim) ? `${rengSim}2` : rengSim}».`,
      sugerencias: [RENG_DIATOMICOS.has(rengSim) ? `${rengSim}2` : rengSim]
    }
  }
  if (RENG_DIATOMICOS.has(rengSim)) {
    return {
      tipo: 'ok',
      sustancia: {
        ...rengVacio(rengEntrada, 'elemento', `átomo de ${rengE.nombre.toLowerCase()}`, rengSim),
        notas: [`El ${rengE.nombre.toLowerCase()} no existe como átomos sueltos en condiciones normales: forma moléculas ${rengSim}₂. Escribe «${rengSim}2» para verla.`]
      }
    }
  }
  const rengMetal = ['alcalino', 'alcalinoterreo', 'transicion', 'postransicion', 'lantanido', 'actinido'].includes(rengE.categoria)
  return {
    tipo: 'ok',
    sustancia: {
      ...rengVacio(rengEntrada, 'elemento', rengE.nombre.toLowerCase(), rengSim),
      idRed: RENG_ESTRUCTURAS[rengSim] ? rengSim : null,
      notas: rengMetal
        ? [RENG_ESTRUCTURAS[rengSim] ? `Metal: sus átomos forman una red metálica (${RENG_ESTRUCTURAS[rengSim]!.nombre}).` : 'Metal: sus átomos forman una red metálica (la app aún no tiene su estructura con datos verificados).']
        : rengE.categoria === 'gas-noble'
          ? ['Gas noble: existe como átomos sueltos (gas monoatómico).']
          : []
    }
  }
}

function rengVacio(rengEntrada: string, rengVia: RengVia, rengNombre: string, rengFormula: string): RengSustancia {
  return {
    entrada: rengEntrada,
    via: rengVia,
    nombre: rengNombre,
    otrosNombres: [],
    formula: rengFormula,
    smiles: null,
    grafo: null,
    inorganico: null,
    organico: null,
    carga: 0,
    masaMolar: rengMasaMolarDe(rengFormula),
    tipo: 'elemento',
    idExperimental: null,
    idRed: null,
    existe: null,
    notas: []
  }
}

const RENG_PARECE_SMILES = /[=#@/\\]|^[a-z]|[cnos][1-9]|\[[A-Z]/
const RENG_SOLO_SIMBOLO = /^([A-Z][a-z]?)(\d*)$/

let rengProfundidad = 0

export function rengInterpretarSustancia(rengTexto: string): RengResultadoEntrada {
  rengProfundidad++
  try {
    return rengInterpretarInterno(rengTexto)
  } finally {
    rengProfundidad--
  }
}

const rengReconoce = (rengF: string): string | null => {
  const rengR = rengInterpretarSustancia(rengF)
  return rengR.tipo === 'ok' ? rengR.sustancia.nombre : null
}

function rengInterpretarInterno(rengTexto: string): RengResultadoEntrada {
  const rengT = rengTexto.trim()
  if (!rengT) return { tipo: 'error', motivo: 'Escribe una fórmula, un nombre o un SMILES.', sugerencias: [] }
  const rengMotivos: string[] = []

  const rengBib = RENG_BIBLIO_POR_NOMBRE.get(rengNormalizarNombre(rengT))
  if (rengBib && rengBib.entrada !== rengT) {
    const rengR = rengInterpretarSustancia(rengBib.entrada)
    return rengR.tipo === 'ok' ? { tipo: 'ok', sustancia: { ...rengR.sustancia, entrada: rengT, via: 'nombre' } } : rengR
  }

  const rengEsFormula = /^[A-Z([]/.test(rengT) && !/\s[a-záéíóúñ]/i.test(rengT)
  const rengEl = RENG_SOLO_SIMBOLO.exec(rengT)
  if (rengEl && rengPorSimbolo.has(rengEl[1]!)) return rengElemento(rengT, rengEl[1]!, rengEl[2] ? Number(rengEl[2]) : 1)

  if (rengProfundidad === 1) {
    const rengAyuda = rengAyudaMinusculas(rengT, rengReconoce)
    if (rengAyuda) return { tipo: 'error', ...rengAyuda }
  }

  if (RENG_PARECE_SMILES.test(rengT) && !/\^/.test(rengT) && !/C[H]/.test(rengT)) {
    try {
      return { tipo: 'ok', sustancia: rengDesdeGrafo(rengT, 'smiles', rengDesdeSmiles(rengT)) }
    } catch (rengE) {
      rengMotivos.push(rengE instanceof Error ? rengE.message : String(rengE))
    }
  }

  if (rengEsFormula) {
    let rengErrorInorganico: string | null = null
    try {
      const rengK = rengInterpretar(rengT).compuesto
      return { tipo: 'ok', sustancia: rengDesdeInorganico(rengT, 'formula', rengK) }
    } catch (rengE) {
      rengErrorInorganico = rengE instanceof Error ? rengE.message : String(rengE)
    }
    let rengAtomos: Map<string, number> | null = null
    try {
      rengAtomos = rengAnalizarFormula(rengT.replace(/[=≡#–-]/g, '')).atomos
    } catch (rengE) {
      return { tipo: 'error', motivo: rengE instanceof Error ? rengE.message : String(rengE), sugerencias: rengSugerencias(rengT) }
    }
    if (rengAtomos.has('C')) {
      const rengSmi = rengSemidesarrolladaASmiles(rengT)
      if (rengSmi) {
        try {
          const rengG = rengDesdeSmiles(rengSmi)
          if (rengG.formula === rengFormulaHill(rengAtomos).replace(/[₀-₉]/g, (rengC) => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(rengC)))) {
            return { tipo: 'ok', sustancia: rengDesdeGrafo(rengT, 'semidesarrollada', rengG, { formula: rengT }) }
          }
        } catch {
        }
      }
      if (!rengAtomos.has('H') || /^[CNOSPFI]+$/i.test(rengT.replace(/Cl|Br|\d|\(|\)/g, ''))) {
        try {
          return { tipo: 'ok', sustancia: rengDesdeGrafo(rengT, 'smiles', rengDesdeSmiles(rengT)) }
        } catch (rengE) {
          const rengM = rengE instanceof Error ? rengE.message : String(rengE)
          if (/Valencia imposible|falta cerrar|sin abrir|cierre de anillo/.test(rengM)) return { tipo: 'error', motivo: rengM, sugerencias: [] }
        }
      }
      const rengClave = rengFormulaHill(rengAtomos)
      const rengOpciones = RENG_BIBLIOTECA.filter((rengB) => {
        try {
          return rengB.smiles !== null && rengFormulaHill(rengAnalizarFormula(rengDesdeSmiles(rengB.smiles).formula).atomos) === rengClave
        } catch {
          return false
        }
      })
      const rengNota =
        'Una fórmula molecular dice qué átomos hay, pero no cómo están unidos: puede corresponder a varias sustancias (isómeros). Elige una o escribe la fórmula semidesarrollada (p. ej. CH3CH2OH), un nombre o un SMILES.'
      if (rengOpciones.length) return { tipo: 'isomeros', formula: rengT, opciones: rengOpciones, nota: rengOpciones.length === 1 ? `${rengNota} La biblioteca solo tiene esta, pero puede haber otros isómeros.` : rengNota }
      return { tipo: 'error', motivo: `${rengT} es una fórmula molecular orgánica: corresponde a una o varias estructuras posibles (isómeros) y la app no tiene ninguna con esa fórmula en su biblioteca. ${rengNota}`, sugerencias: [] }
    }
    const rengMotivo = rengErrorInorganico ?? 'No sé interpretar esta fórmula.'
    if (rengProfundidad === 1) {
      const rengAyuda = rengAyudaFormula(rengT, rengMotivo, rengReconoce)
      return { tipo: 'error', motivo: rengAyuda.motivo, sugerencias: [...new Set([...rengAyuda.sugerencias, ...rengSugerencias(rengT)])] }
    }
    return { tipo: 'error', motivo: rengMotivo, sugerencias: rengSugerencias(rengT) }
  }

  try {
    return { tipo: 'ok', sustancia: rengDesdeInorganico(rengT, 'nombre', rengFormularDesdeNombre(rengT)) }
  } catch (rengE) {
    rengMotivos.push(rengE instanceof Error ? rengE.message : String(rengE))
  }
  try {
    const rengR = rengSmilesDesdeNombre(rengT)
    return { tipo: 'ok', sustancia: rengDesdeGrafo(rengT, 'nombre', rengDesdeSmiles(rengR.smiles), { notas: rengR.nota ? [rengR.nota] : [] }) }
  } catch (rengE) {
    rengMotivos.push(rengE instanceof Error ? rengE.message : String(rengE))
  }
  try {
    return { tipo: 'ok', sustancia: rengDesdeGrafo(rengT, 'smiles', rengDesdeSmiles(rengT)) }
  } catch (rengE) {
    rengMotivos.push(rengE instanceof Error ? rengE.message : String(rengE))
  }
  const rengEspecifico = rengMotivos.find((rengM) => /no tiene número de oxidación|gas noble|Falta el número|imposible|Falta el localizador|Valencia imposible/.test(rengM))
  const rengMotivo =
    rengEspecifico ??
    (/^[a-z]/.test(rengT) && /\d/.test(rengT)
      ? `«${rengT}» no es una fórmula: los símbolos de los elementos empiezan por mayúscula («${rengT.charAt(0)}» no lo es). Tampoco es un SMILES válido ni un nombre que la app conozca. Prueba con una fórmula (H2O, CH3COOH), un nombre (ácido acético) o un SMILES (CC(=O)O).`
      : `«${rengT}» no es un nombre que la app sepa interpretar, ni un SMILES válido. Revisa la ortografía, o escribe la fórmula (H2SO4, CH3COOH) o un SMILES (CC(=O)O).`)
  return { tipo: 'error', motivo: rengMotivo, sugerencias: rengSugerencias(rengT) }
}

export function rengSustanciaOError(rengTexto: string): RengSustancia {
  const rengR = rengInterpretarSustancia(rengTexto)
  if (rengR.tipo === 'ok') return rengR.sustancia
  if (rengR.tipo === 'isomeros') throw new Error(`Isómeros posibles: ${rengR.opciones.map((rengO) => rengO.nombre).join(', ')}`)
  throw new Error(rengR.motivo)
}
