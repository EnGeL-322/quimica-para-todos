import type { RengEnlaceDerivado } from './derivados'

export interface RengFalta {
  id: number
  el: string
  libres: number
}

const rengEnlaces = (rengN: number): string => `${rengN} enlace${rengN === 1 ? '' : 's'}`

export function rengAgruparFaltan(rengFaltan: readonly RengFalta[]): string {
  const rengGrupos = new Map<string, { el: string; libres: number; n: number }>()
  for (const rengF of rengFaltan) {
    const rengK = `${rengF.el}|${rengF.libres}`
    const rengG = rengGrupos.get(rengK)
    if (rengG) rengG.n++
    else rengGrupos.set(rengK, { el: rengF.el, libres: rengF.libres, n: 1 })
  }
  return [...rengGrupos.values()]
    .map((rengG) => {
      const rengVerbo = rengG.libres === 1 ? 'falta' : 'faltan'
      return rengG.n === 1 ? `al ${rengG.el} le ${rengVerbo} ${rengEnlaces(rengG.libres)}` : `a ${rengG.n} ${rengG.el} les ${rengVerbo} ${rengEnlaces(rengG.libres)} cada uno`
    })
    .join('; ')
}

export interface RengGrupoEnlaces {
  clave: string
  etiqueta: string
  descripcion: string
  n: number
  pares: Array<[number, number]>
  atomos: number[]
}

export function rengAgruparEnlaces(rengLista: readonly RengEnlaceDerivado[]): RengGrupoEnlaces[] {
  const rengGrupos = new Map<string, RengGrupoEnlaces>()
  for (const rengX of rengLista) {
    const rengClave = `${rengX.etiqueta}|${rengX.tipo}|${rengX.descripcion}`
    let rengG = rengGrupos.get(rengClave)
    if (!rengG) {
      rengG = { clave: rengClave, etiqueta: rengX.etiqueta, descripcion: rengX.descripcion, n: 0, pares: [], atomos: [] }
      rengGrupos.set(rengClave, rengG)
    }
    rengG.n++
    rengG.pares.push([rengX.a, rengX.b])
    for (const rengId of [rengX.a, rengX.b]) if (!rengG.atomos.includes(rengId)) rengG.atomos.push(rengId)
  }
  return [...rengGrupos.values()]
}
