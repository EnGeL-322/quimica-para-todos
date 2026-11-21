import { RENG_MINIATURAS_RAMA, rengFichaDeTema } from '../practica/fichasTema'
import type { RengRama } from '../practica/tipos'

const RENG_ARCHIVOS = import.meta.glob<string>('../miniaturas/*.svg', { eager: true, query: '?url', import: 'default' })

const rengPorNombre = new Map<string, string>(Object.entries(RENG_ARCHIVOS).map(([rengRuta, rengUrl]) => [rengRuta.slice(rengRuta.lastIndexOf('/') + 1, -4), rengUrl]))

export const rengUrlMiniatura = (rengNombre: string): string | null => rengPorNombre.get(rengNombre) ?? null

export const rengUrlMiniaturaTema = (rengTema: string): string | null => {
  const rengFichaT = rengFichaDeTema(rengTema)
  return rengFichaT ? rengUrlMiniatura(rengFichaT.miniatura) : null
}

export const rengUrlMiniaturaRama = (rengRama: RengRama): string | null => rengUrlMiniatura(RENG_MINIATURAS_RAMA[rengRama])

export const RENG_NOMBRES_MINIATURA: readonly string[] = [...rengPorNombre.keys()].sort()
