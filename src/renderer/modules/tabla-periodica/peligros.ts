import { RENG_ELEMENTOS } from './data'
import { RENG_FORMAS_ICSC } from './datosPeligros'
import { RENG_FORMAS_SALES } from './datosPeligrosSales'

export type RengNivelPeligro = 'peligro' | 'atencion' | 'documentado' | 'no-clasificado' | 'insuficiente'

export const RENG_PELIGROS: Record<RengNivelPeligro, { nombre: string; corto: string; marca: string }> = {
  peligro: { nombre: 'Peligro', corto: 'Peligro', marca: '!' },
  atencion: { nombre: 'Atención', corto: 'Atención', marca: '△' },
  documentado: { nombre: 'Peligros documentados', corto: 'Documentado', marca: 'i' },
  'no-clasificado': { nombre: 'Sin clasificación de peligro según la fuente', corto: 'Sin clasificar', marca: '○' },
  insuficiente: { nombre: 'Datos insuficientes', corto: 'Sin datos', marca: '?' }
}

export type RengTipoPeligro = 'inflamabilidad' | 'explosion' | 'oxidante' | 'presion' | 'reactividad' | 'corrosion-metales' | 'corrosion' | 'toxicidad-aguda' | 'irritacion' | 'sensibilizacion' | 'efectos-cronicos' | 'asfixia' | 'ambiental'

export const RENG_TIPO_PELIGRO: Record<RengTipoPeligro, { nombre: string; grupo: 'fisicos' | 'salud' | 'ambiente' }> = {
  inflamabilidad: { nombre: 'Inflamabilidad', grupo: 'fisicos' },
  explosion: { nombre: 'Explosión', grupo: 'fisicos' },
  oxidante: { nombre: 'Comburente', grupo: 'fisicos' },
  presion: { nombre: 'Gas a presión', grupo: 'fisicos' },
  reactividad: { nombre: 'Reactividad', grupo: 'fisicos' },
  'corrosion-metales': { nombre: 'Corrosión de metales', grupo: 'fisicos' },
  corrosion: { nombre: 'Corrosión o daño ocular grave', grupo: 'salud' },
  'toxicidad-aguda': { nombre: 'Toxicidad aguda', grupo: 'salud' },
  irritacion: { nombre: 'Irritación', grupo: 'salud' },
  sensibilizacion: { nombre: 'Sensibilización', grupo: 'salud' },
  'efectos-cronicos': { nombre: 'Efectos crónicos', grupo: 'salud' },
  asfixia: { nombre: 'Asfixia', grupo: 'salud' },
  ambiental: { nombre: 'Peligro ambiental', grupo: 'ambiente' }
}

export interface RengFuentePeligro {
  tipo: 'icsc' | 'armonizada' | 'notificada' | 'fds'
  organismo: string
  url: string
  revision?: string
  consulta: string
  alcance: string
}

export interface RengRegistroPeligro {
  nivel: Exclude<RengNivelPeligro, 'insuficiente'>
  fuente: RengFuentePeligro
  indicaciones: readonly { tipo: RengTipoPeligro; descripcion: string; codigo?: string }[]
  pictogramas?: readonly string[]
}

export interface RengFormaPeligro {
  id: string
  nombre: string
  formula: string
  cas?: string
  condicion?: string
  z?: number
  referencia?: true
  biblioteca?: string
  registros: readonly RengRegistroPeligro[]
}

export const RENG_VERSION_PELIGROS = '2026-11-09.1'
export const RENG_FUENTE_RADIOACTIVIDAD = 'https://iupac.org/iptei/'

export const RENG_FORMAS_PELIGRO: readonly RengFormaPeligro[] = [...RENG_FORMAS_ICSC, ...RENG_FORMAS_SALES]

export function rengPeligroDeForma(rengForma?: RengFormaPeligro | null): RengNivelPeligro {
  return rengForma?.registros[0]?.nivel ?? 'insuficiente'
}

const rengFormasPorZ = new Map<number, readonly RengFormaPeligro[]>(RENG_ELEMENTOS.map((rengElemento) => {
  const rengOpciones = RENG_FORMAS_PELIGRO.filter((rengForma) => rengForma.z === rengElemento.z)
  const rengReferencia = rengOpciones.find((rengForma) => rengForma.referencia)
  const rengSinEspecificar: RengFormaPeligro = {
    id: `elemento-${rengElemento.z}-sin-forma`, nombre: `${rengElemento.nombre} · forma elemental sin especificar`,
    formula: rengElemento.simbolo, z: rengElemento.z, registros: []
  }
  return [rengElemento.z, [rengReferencia ?? rengSinEspecificar, ...rengOpciones.filter((rengForma) => rengForma !== rengReferencia)]]
}))

export function rengFormasDeElemento(rengZ: number): readonly RengFormaPeligro[] {
  return rengFormasPorZ.get(rengZ) ?? []
}

export function rengRadioactividadDe(rengZ: number): string | undefined {
  if (rengZ === 43 || rengZ === 61 || (rengZ >= 83 && rengZ <= 118)) {
    return 'Todos sus isótopos conocidos son radiactivos. La actividad depende del isótopo y de la cantidad.'
  }
  return undefined
}
