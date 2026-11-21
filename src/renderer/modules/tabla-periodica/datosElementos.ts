import rengDatos from './datos-wikidata.json'
import type { RengEstado } from './data'

export interface RengMagnitud {
  valores: number[]
  conReferencia: boolean
  nota?: string
}

export type RengVerificacion = 'wikidata-con-referencia' | 'wikidata-sin-referencia'

export interface RengExtraElemento {
  fusionK?: RengMagnitud
  ebullicionK?: RengMagnitud
  densidadKgM3?: RengMagnitud
  anioDescubrimiento?: number
  descubridores?: string
  avisos?: string[]
}

export const RENG_FUENTE_DATOS = {
  fuente: rengDatos.fuente,
  licencia: rengDatos.licencia,
  obtenido: rengDatos.obtenido,
  nota: rengDatos.nota
}

interface RengCrudo {
  z: number
  fusionK?: Array<{ v: number; conReferencia: boolean }>
  ebullicionK?: Array<{ v: number; conReferencia: boolean }>
  densidadKgM3?: Array<{ v: number; conReferencia: boolean }>
  anioDescubrimiento?: number
  descubridores?: string
}

const RENG_POR_Z = new Map<number, RengCrudo>((rengDatos.elementos as RengCrudo[]).map((rengE) => [rengE.z, rengE]))

function rengMagnitud(rengLista: RengCrudo['fusionK'], rengDescartar?: (rengV: number) => boolean, rengMotivo?: string): RengMagnitud | undefined {
  if (!rengLista?.length) return undefined
  const rengBuenos = rengLista.filter((rengX) => !rengDescartar?.(rengX.v))
  if (!rengBuenos.length) return undefined
  const rengM: RengMagnitud = { valores: [...new Set(rengBuenos.map((rengX) => rengX.v))].sort((rengA, rengB) => rengA - rengB), conReferencia: rengBuenos.some((rengX) => rengX.conReferencia) }
  if (rengBuenos.length < rengLista.length && rengMotivo) rengM.nota = rengMotivo
  return rengM
}

export function rengExtraDe(rengZ: number, rengEstado: RengEstado): RengExtraElemento {
  const rengC = RENG_POR_Z.get(rengZ)
  if (!rengC) return {}
  const rengGas = rengEstado === 'gas'
  const rengR: RengExtraElemento = {
    fusionK: rengMagnitud(rengC.fusionK),
    ebullicionK: rengMagnitud(rengC.ebullicionK),
    densidadKgM3: rengMagnitud(rengC.densidadKgM3, rengGas ? (rengV) => rengV > 50 : undefined, 'Se descartó un valor que no corresponde al gas a 25 °C (probablemente de la fase líquida o sólida).'),
    anioDescubrimiento: rengC.anioDescubrimiento,
    descubridores: rengC.descubridores
  }
  if (rengR.fusionK && rengR.ebullicionK && rengR.ebullicionK.valores[rengR.ebullicionK.valores.length - 1]! < rengR.fusionK.valores[0]! * 0.95) {
    rengR.avisos = [`Wikidata da una ebullición (${rengR.ebullicionK.valores.join(', ')} K) menor que la fusión (${rengR.fusionK.valores.join(', ')} K): son incoherentes y no se muestran.`]
    rengR.fusionK = undefined
    rengR.ebullicionK = undefined
  }
  return rengR
}

export const rengVerificacionDe = (rengM: RengMagnitud): RengVerificacion => (rengM.conReferencia ? 'wikidata-con-referencia' : 'wikidata-sin-referencia')

export const rengACelsius = (rengK: number): number => rengK - 273.15

const rengF = (rengX: number, rengD: number): string => rengX.toFixed(rengD).replace('.', ',')

export function rengTextoTemperatura(rengM: RengMagnitud | undefined): string {
  if (!rengM) return 'sin dato'
  const [rengA, rengB] = [rengM.valores[0]!, rengM.valores[rengM.valores.length - 1]!]
  return rengM.valores.length === 1 ? `${rengF(rengA, rengA < 100 ? 2 : 1)} K (${rengF(rengACelsius(rengA), 1)} °C)` : `${rengF(rengA, 1)} – ${rengF(rengB, 1)} K`
}

export function rengTextoDensidad(rengM: RengMagnitud | undefined): string {
  if (!rengM) return 'sin dato'
  const rengGcm = (rengX: number): string => (rengX < 1 ? `${rengF(rengX, 5)} g/L` : `${rengF(rengX / 1000, 3)} g/cm³`)
  const [rengA, rengB] = [rengM.valores[0]!, rengM.valores[rengM.valores.length - 1]!]
  return rengM.valores.length === 1 ? rengGcm(rengA) : `${rengGcm(rengA)} – ${rengGcm(rengB)}`
}

export function rengTextoAnio(rengAnio: number | undefined): string {
  if (rengAnio === undefined) return 'sin dato'
  return rengAnio < 0 ? `conocido desde la antigüedad (≈ ${-rengAnio} a. C. según Wikidata)` : String(rengAnio)
}
