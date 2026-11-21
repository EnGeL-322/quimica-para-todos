import { rengAjustarEcuacion } from './ajuste'
import { rengIdentificar, type RengSustanciaIdentificada } from './identidad'
import { rengEscribirFormula, rengNombrar, type RengCompuesto } from './nomenclatura'
import { rengBuscarReaccion, RENG_MOTIVO_SIN_DATOS } from './reaccionesConocidas'

export interface RengTerminoMezcla {
  formula: string
  coef: number
  entrada: string
}

export interface RengReaccionMostrable {
  nombre: string
  reactivos: RengTerminoMezcla[]
  productos: RengTerminoMezcla[]
  condiciones: string
  observable: string | null
  fuente: string
  origen: 'catalogo' | 'regla-educativa'
  catalizador: { acepta: string[]; texto: string } | null
}

export type RengCausaNinguna = 'faltan-sustancias' | 'estructura-ambigua' | 'no-valida' | 'misma-sustancia' | 'gas-noble' | 'sin-datos'
export type RengResultadoMezcla = { tipo: 'reaccion'; r: RengReaccionMostrable } | { tipo: 'ninguna'; motivo: string; causa: RengCausaNinguna }

export type RengEntradaMezcla = string | RengSustanciaIdentificada

const RENG_GASES_NOBLES = new Set(['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'])
const RENG_NOTA_REGLA =
  'Regla educativa de neutralización de libro de texto (ácido + hidróxido → sal + agua), aplicada por la app; no se consultó una fuente concreta para esta pareja: sin verificar.'

const rengMcd = (rengA: number, rengB: number): number => (rengB === 0 ? Math.abs(rengA) : rengMcd(rengB, rengA % rengB))

function rengNeutralizacion(rengA: RengSustanciaIdentificada, rengB: RengSustanciaIdentificada): RengReaccionMostrable | null {
  const rengCa = rengA.sustancia.inorganico
  const rengCb = rengB.sustancia.inorganico
  if (!rengCa || !rengCb) return null
  const rengEsAcido = (rengC: RengCompuesto): boolean => rengC.funcion === 'oxoacido' || rengC.funcion === 'hidracido'
  const [rengAcido, rengBase] = rengEsAcido(rengCa) && rengCb.funcion === 'hidroxido' ? [rengCa, rengCb] : rengEsAcido(rengCb) && rengCa.funcion === 'hidroxido' ? [rengCb, rengCa] : [null, null]
  if (!rengAcido || !rengBase || !rengAcido.anion || !rengBase.cation) return null
  const rengQ = rengBase.cation.carga
  const rengN = Math.abs(rengAcido.anion.carga)
  if (rengQ <= 0 || rengN <= 0) return null
  const rengG = rengMcd(rengQ, rengN)
  const rengSal = rengEscribirFormula(rengBase.cation, rengAcido.anion, rengN / rengG, rengQ / rengG)
  let rengCs: RengCompuesto
  try {
    rengCs = rengNombrar(rengSal)
  } catch {
    return null
  }
  let rengAj
  try {
    rengAj = rengAjustarEcuacion(`${rengAcido.formula} + ${rengBase.formula} -> ${rengSal} + H2O`)
  } catch {
    return null
  }
  const rengTermino = (rengT: { coef: number; entrada: string }, rengEntrada?: string): RengTerminoMezcla => ({ formula: rengT.entrada, coef: rengT.coef, entrada: rengEntrada ?? rengT.entrada })
  return {
    nombre: 'Neutralización',
    reactivos: rengAj.reactivos.map((rengT) => rengTermino(rengT)),
    productos: rengAj.productos.map((rengT) => rengTermino(rengT)),
    condiciones: `Neutralización completa: ${rengCs.nombres.principal} y agua. Con menos base podría quedar una sal ácida.`,
    observable: null,
    fuente: RENG_NOTA_REGLA,
    origen: 'regla-educativa',
    catalizador: null
  }
}

const rengNinguna = (rengCausa: RengCausaNinguna, rengMotivo: string): RengResultadoMezcla => ({ tipo: 'ninguna', motivo: rengMotivo, causa: rengCausa })

function rengResolver(rengX: RengEntradaMezcla): { s: RengSustanciaIdentificada } | { fin: RengResultadoMezcla } {
  if (typeof rengX !== 'string') return { s: rengX }
  if (!rengX.trim()) return { fin: rengNinguna('faltan-sustancias', 'Elige dos sustancias para ver qué pasa al juntarlas.') }
  const rengI = rengIdentificar(rengX)
  if (rengI.tipo === 'ok') return { s: rengI.s }
  return { fin: rengNinguna(rengI.tipo === 'ambigua' ? 'estructura-ambigua' : 'no-valida', rengI.motivo) }
}

export function rengMezclar(rengA: RengEntradaMezcla, rengB: RengEntradaMezcla): RengResultadoMezcla {
  const rengRa = rengResolver(rengA)
  if ('fin' in rengRa) return rengRa.fin
  const rengRb = rengResolver(rengB)
  if ('fin' in rengRb) return rengRb.fin
  const [rengSa, rengSb] = [rengRa.s, rengRb.s]
  if (rengSa.identidad.clave === rengSb.identidad.clave) return rengNinguna('misma-sustancia', 'Son la misma sustancia: no hay nada que reaccione.')
  const rengNoble = [rengSa, rengSb].find((rengX) => RENG_GASES_NOBLES.has(rengX.formula))
  if (rengNoble) return rengNinguna('gas-noble', `El ${rengNoble.formula} es un gas noble: con la capa de valencia completa no suele reaccionar en condiciones normales (conocimiento general; hay excepciones como los fluoruros de xenón).`)
  const rengK = rengBuscarReaccion([rengSa.identidad.clave, rengSb.identidad.clave], '')
  if (rengK.tipo === 'conocida') {
    const rengR = rengK.r
    return {
      tipo: 'reaccion',
      r: {
        nombre: rengR.nombre,
        reactivos: rengR.reactivos.map((rengX) => ({ formula: rengX.formula, coef: rengX.coef, entrada: rengX.entrada })),
        productos: rengR.productos.map((rengX) => ({ formula: rengX.formula, coef: rengX.coef, entrada: rengX.entrada })),
        condiciones: rengR.condiciones,
        observable: rengR.observable,
        fuente: rengR.fuente,
        origen: 'catalogo',
        catalizador: rengR.catalizador ?? null
      }
    }
  }
  const rengN = rengNeutralizacion(rengSa, rengSb)
  if (rengN) return { tipo: 'reaccion', r: rengN }
  return rengNinguna('sin-datos', RENG_MOTIVO_SIN_DATOS)
}

export function rengEcuacionTexto(rengR: RengReaccionMostrable): string {
  const rengLado = (rengTs: RengTerminoMezcla[]): string => rengTs.map((rengT) => `${rengT.coef === 1 ? '' : rengT.coef}${rengT.formula}`).join(' + ')
  return `${rengLado(rengR.reactivos)} -> ${rengLado(rengR.productos)}`
}
