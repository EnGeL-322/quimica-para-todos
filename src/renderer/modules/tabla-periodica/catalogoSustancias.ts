import { RENG_BIBLIOTECA, RENG_CATEGORIAS, type RengEntradaBiblioteca } from '../simulador-quimica/datos/biblioteca'
import { rengAnalizarFormula, rengFormulaHill, rengMasaMolarDe } from '../simulador-quimica/nucleo/formula'
import { rengDesdeSmiles } from '../simulador-quimica/nucleo/molecula'
import { RENG_FORMAS_PELIGRO, type RengFormaPeligro, type RengTipoPeligro } from './peligros'

export interface RengSustanciaCatalogo {
  id: string
  nombre: string
  formula: string
  sinonimos: readonly string[]
  categoria: string
  masaMolar?: number
  smiles?: string | null
  formas: readonly RengFormaPeligro[]
  fuenteIdentidad?: string
  elementos: readonly string[]
}

const rengNormalizar = (rengS: string): string => rengS.normalize('NFKD').replace(/\p{M}/gu, '').trim().toLowerCase()
const rengSlug = (rengS: string): string => rengNormalizar(rengS).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function rengClaveFormula(rengS: string): string | undefined {
  try {
    const rengF = rengAnalizarFormula(rengS)
    return rengF.electron ? undefined : rengFormulaHill(rengF.atomos, rengF.carga)
  } catch {
    return undefined
  }
}

function rengIdentidadFormula(rengFormula: string): { elementos: string[]; masaMolar?: number } {
  try {
    const rengF = rengAnalizarFormula(rengFormula)
    return { elementos: [...rengF.atomos.keys()], masaMolar: rengMasaMolarDe(rengF) }
  } catch {
    return { elementos: [] }
  }
}

const rengFormaPendiente = (rengId: string, rengNombre: string, rengFormula: string): RengFormaPeligro => ({ id: rengId, nombre: rengNombre, formula: rengFormula, registros: [] })

function rengDesdeBiblioteca(rengE: RengEntradaBiblioteca): RengSustanciaCatalogo {
  const rengId = rengSlug(rengE.nombre)
  let rengFormula = rengE.entrada
  if (rengE.smiles) {
    try {
      const rengCalculada = rengDesdeSmiles(rengE.smiles).formula
      const rengEscrita = rengClaveFormula(rengE.entrada)
      rengFormula = rengEscrita && rengEscrita === rengClaveFormula(rengCalculada) ? rengE.entrada : rengCalculada
    } catch {
      rengFormula = rengClaveFormula(rengE.entrada) ? rengE.entrada : ''
    }
  }
  const rengFormas = RENG_FORMAS_PELIGRO.filter((rengForma) => rengForma.biblioteca === rengE.nombre)
  if (rengFormas.length === 0) rengFormas.push(rengFormaPendiente(`${rengId}-sin-forma`, 'Presentación sin ficha de peligro contrastada', rengFormula))
  if (rengE.nombre === 'cloruro de hidrógeno') rengFormas.push(rengFormaPendiente('hcl-acuoso-sin-concentracion', 'Solución acuosa · concentración sin especificar', rengFormula))
  if (rengE.nombre === 'cloruro de sodio') rengFormas.push(rengFormaPendiente('nacl-sin-forma', 'Otra presentación o grado', rengFormula))
  return { id: rengId, nombre: rengE.nombre, formula: rengFormula, sinonimos: rengE.otros ?? [], categoria: RENG_CATEGORIAS[rengE.categoria], smiles: rengE.smiles, formas: rengFormas, fuenteIdentidad: rengE.fuente, ...rengIdentidadFormula(rengFormula) }
}

function rengDesdeForma(rengForma: RengFormaPeligro): RengSustanciaCatalogo {
  return {
    id: `forma-${rengForma.id}`, nombre: rengForma.nombre, formula: rengForma.formula, sinonimos: [],
    categoria: rengForma.z ? 'Sustancia elemental' : 'Otras sustancias', formas: [rengForma],
    ...rengIdentidadFormula(rengForma.formula)
  }
}

function rengCrearCatalogo(): RengSustanciaCatalogo[] {
  const rengBiblioteca = RENG_BIBLIOTECA.map(rengDesdeBiblioteca)
  const rengFormas = RENG_FORMAS_PELIGRO.filter((rengForma) => !rengForma.biblioteca)
  const rengPeroxido = rengFormas.filter((rengForma) => rengForma.formula === 'H2O2' && rengForma.id.startsWith('h2o2'))
  const rengOtras = rengFormas.filter((rengForma) => !rengPeroxido.includes(rengForma)).map(rengDesdeForma)
  const rengItemPeroxido: RengSustanciaCatalogo = {
    id: 'peroxido-de-hidrogeno', nombre: 'peróxido de hidrógeno', formula: 'H2O2', sinonimos: ['agua oxigenada'],
    categoria: 'Otras inorgánicas', formas: [...rengPeroxido, rengFormaPendiente('h2o2-sin-concentracion', 'Solución acuosa · concentración sin especificar', 'H2O2')],
    ...rengIdentidadFormula('H2O2')
  }
  return [...rengBiblioteca, ...rengOtras, rengItemPeroxido].sort((rengA, rengB) => rengA.nombre.localeCompare(rengB.nombre, 'es'))
}

export const RENG_SUSTANCIAS: readonly RengSustanciaCatalogo[] = rengCrearCatalogo()

const rengIndice = RENG_SUSTANCIAS.map((rengSustancia) => ({
  sustancia: rengSustancia,
  nombres: [rengSustancia.nombre, ...rengSustancia.sinonimos, ...rengSustancia.formas.map((rengForma) => rengForma.nombre)].map(rengNormalizar),
  formula: rengClaveFormula(rengSustancia.formula),
  cas: rengSustancia.formas.flatMap((rengForma) => rengForma.cas ? [rengForma.cas] : []),
  peligros: new Set(rengSustancia.formas.flatMap((rengForma) => rengForma.registros.flatMap((rengR) => rengR.indicaciones.map((rengP) => rengP.tipo))))
}))

export function rengBuscarSustancias(rengQ: string, rengTipo?: RengTipoPeligro): RengSustanciaCatalogo[] {
  const rengConsulta = rengNormalizar(rengQ).slice(0, 160)
  const rengFormula = rengClaveFormula(rengQ.trim().slice(0, 160))
  const rengCandidatos = rengIndice.filter((rengE) => !rengTipo || rengE.peligros.has(rengTipo))
  if (!rengConsulta) return rengCandidatos.map((rengE) => rengE.sustancia)
  if (rengFormula && rengCandidatos.some((rengE) => rengE.formula === rengFormula)) return rengCandidatos.filter((rengE) => rengE.formula === rengFormula).map((rengE) => rengE.sustancia)
  return rengCandidatos.filter((rengE) => rengE.cas.some((rengCas) => rengCas.includes(rengConsulta)) || rengE.nombres.some((rengNombre) => rengNombre.includes(rengConsulta)) || rengNormalizar(rengE.sustancia.formula) === rengConsulta).map((rengE) => rengE.sustancia)
}

export function rengSustanciasRelacionadas(rengSimbolo: string): RengSustanciaCatalogo[] {
  return RENG_SUSTANCIAS.filter((rengSustancia) => rengSustancia.elementos.length > 1 && rengSustancia.elementos.includes(rengSimbolo))
}

export function rengCoberturaSustancias(): { total: number; verificadas: number; parciales: number; pendientes: number } {
  const rengCobertura = { total: RENG_SUSTANCIAS.length, verificadas: 0, parciales: 0, pendientes: 0 }
  for (const { formas: rengFormas } of RENG_SUSTANCIAS) {
    if (rengFormas.every((rengForma) => rengForma.registros.length > 0)) rengCobertura.verificadas++
    else if (rengFormas.some((rengForma) => rengForma.registros.length > 0)) rengCobertura.parciales++
    else rengCobertura.pendientes++
  }
  return rengCobertura
}
