import { RENG_NIVELES_PLEGADOS_POR_DEFECTO, RENG_TEMARIO } from './catalogo'

export const RENG_CLAVE_PLEGADO_TEMARIO = 'ciencia.temario.simulador-quimica'
export const RENG_VERSION_PLEGADO_TEMARIO = 1

export interface RengPlegadoTemario {
  niveles: Readonly<Record<string, boolean>>
  bloques: Readonly<Record<string, boolean>>
  ruta: number | null
}

export const RENG_PLEGADO_VACIO: RengPlegadoTemario = { niveles: {}, bloques: {}, ruta: null }

export interface RengAlmacenTemario {
  getItem: (rengK: string) => string | null
  setItem: (rengK: string, rengV: string) => void
}

const RENG_NIVELES_VALIDOS = new Set(RENG_TEMARIO.niveles.map((rengN) => String(rengN.numero)))
const RENG_BLOQUES_VALIDOS = new Set(RENG_TEMARIO.niveles.flatMap((rengN) => rengN.bloques.map((rengB) => rengB.id)))
const RENG_MAX_BYTES = 8000

const rengEsRegistro = (rengX: unknown): rengX is Record<string, unknown> => typeof rengX === 'object' && rengX !== null && !Array.isArray(rengX)

function rengMapaBooleano(rengX: unknown, rengValidos: ReadonlySet<string>): Record<string, boolean> {
  const rengSalida: Record<string, boolean> = {}
  if (!rengEsRegistro(rengX)) return rengSalida
  for (const [rengK, rengV] of Object.entries(rengX)) if (rengValidos.has(rengK) && typeof rengV === 'boolean') rengSalida[rengK] = rengV
  return rengSalida
}

export function rengLeerPlegado(rengAlmacen: RengAlmacenTemario | null): RengPlegadoTemario {
  try {
    const rengCrudo = rengAlmacen?.getItem(RENG_CLAVE_PLEGADO_TEMARIO)
    if (typeof rengCrudo !== 'string' || rengCrudo.length > RENG_MAX_BYTES) return RENG_PLEGADO_VACIO
    const rengDatos: unknown = JSON.parse(rengCrudo)
    if (!rengEsRegistro(rengDatos) || rengDatos['v'] !== RENG_VERSION_PLEGADO_TEMARIO) return RENG_PLEGADO_VACIO
    const rengRuta = rengDatos['ruta']
    return {
      niveles: rengMapaBooleano(rengDatos['niveles'], RENG_NIVELES_VALIDOS),
      bloques: rengMapaBooleano(rengDatos['bloques'], RENG_BLOQUES_VALIDOS),
      ruta: typeof rengRuta === 'number' && Number.isInteger(rengRuta) && RENG_NIVELES_VALIDOS.has(String(rengRuta)) ? rengRuta : null
    }
  } catch {
    return RENG_PLEGADO_VACIO
  }
}

export function rengGuardarPlegado(rengAlmacen: RengAlmacenTemario | null, rengPlegado: RengPlegadoTemario): boolean {
  try {
    if (!rengAlmacen) return false
    rengAlmacen.setItem(RENG_CLAVE_PLEGADO_TEMARIO, JSON.stringify({ v: RENG_VERSION_PLEGADO_TEMARIO, niveles: rengPlegado.niveles, bloques: rengPlegado.bloques, ruta: rengPlegado.ruta }))
    return true
  } catch {
    return false
  }
}

export const rengNivelAbierto = (rengPlegado: RengPlegadoTemario, rengNivel: number): boolean => rengPlegado.niveles[String(rengNivel)] ?? !RENG_NIVELES_PLEGADOS_POR_DEFECTO.includes(rengNivel)

export const rengBloqueAbierto = (rengPlegado: RengPlegadoTemario, rengBloque: string): boolean => rengPlegado.bloques[rengBloque] ?? false

export const rengAlternarNivel = (rengPlegado: RengPlegadoTemario, rengNivel: number): RengPlegadoTemario => ({ ...rengPlegado, niveles: { ...rengPlegado.niveles, [String(rengNivel)]: !rengNivelAbierto(rengPlegado, rengNivel) } })

export const rengAlternarBloque = (rengPlegado: RengPlegadoTemario, rengBloque: string): RengPlegadoTemario => ({ ...rengPlegado, bloques: { ...rengPlegado.bloques, [rengBloque]: !rengBloqueAbierto(rengPlegado, rengBloque) } })

export const rengElegirRuta = (rengPlegado: RengPlegadoTemario, rengRuta: number | null): RengPlegadoTemario => ({ ...rengPlegado, ruta: rengRuta })
