import type { RengAcceso, RengEntradaMenu } from '../../module-api'

export interface RengRutaMenu {
  id: string
  sub: string | null
}

export const rengClaveEntrada = (rengModuloId: string, rengE: RengEntradaMenu): string => (rengE.modulo ? `>${rengE.modulo}` : `${rengModuloId}/${rengE.sub ?? ''}`)

export const rengClaveEnCurso = (rengModuloId: string, rengE: RengEntradaMenu, rengSub: string): string => `${rengClaveEntrada(rengModuloId, rengE)}#${rengSub}`

export const rengEntradasPlanas = (rengMenu: readonly RengEntradaMenu[]): RengEntradaMenu[] => rengMenu.flatMap((rengE) => [rengE, ...(rengE.hijos ?? [])])

export const rengAnfitrionEnCurso = (rengMenu: readonly RengEntradaMenu[], rengSub: string | null): RengEntradaMenu | null =>
  rengSub === null ? null : (rengEntradasPlanas(rengMenu).find((rengE) => !rengE.modulo && rengE.enCurso?.includes(rengSub)) ?? null)

export function rengEntradaActiva(rengModuloId: string, rengMenu: readonly RengEntradaMenu[], rengRuta: RengRutaMenu): string | null {
  const rengPlanas = rengEntradasPlanas(rengMenu)
  const rengEnlazada = rengPlanas.find((rengE) => rengE.modulo && rengE.modulo === rengRuta.id)
  if (rengEnlazada) return rengClaveEntrada(rengModuloId, rengEnlazada)
  if (rengRuta.id !== rengModuloId) return null
  const rengExacta = rengPlanas.find((rengE) => !rengE.modulo && rengE.sub === rengRuta.sub)
  if (rengExacta) return rengClaveEntrada(rengModuloId, rengExacta)
  const rengTambien = rengPlanas.find((rengE) => !rengE.modulo && rengE.tambien?.includes(rengRuta.sub))
  if (rengTambien) return rengClaveEntrada(rengModuloId, rengTambien)
  const rengAnfitrion = rengAnfitrionEnCurso(rengMenu, rengRuta.sub)
  return rengAnfitrion && rengRuta.sub ? rengClaveEnCurso(rengModuloId, rengAnfitrion, rengRuta.sub) : null
}

export const rengGrupoContiene = (rengModuloId: string, rengMenu: readonly RengEntradaMenu[], rengRuta: RengRutaMenu): boolean =>
  rengRuta.id === rengModuloId || rengEntradasPlanas(rengMenu).some((rengE) => rengE.modulo === rengRuta.id)

export const rengNombreAcceso = (rengAccesos: readonly RengAcceso[] | undefined, rengSub: string): string | null => rengAccesos?.find((rengA) => rengA.sub === rengSub)?.nombre ?? null

export function rengRutaLegible(rengModuloId: string, rengMenu: readonly RengEntradaMenu[], rengAccesos: readonly RengAcceso[] | undefined, rengRuta: RengRutaMenu): string | null {
  if (rengRuta.id !== rengModuloId) return null
  for (const rengE of rengMenu) {
    for (const rengX of [rengE, ...(rengE.hijos ?? [])]) {
      if (rengX.modulo) continue
      const rengPadre = rengX === rengE ? (rengE.seccion ?? null) : rengE.nombre
      const rengPrefijo = rengPadre && !rengX.nombre.startsWith(rengPadre) ? `${rengPadre} › ` : ''
      if (rengX.sub === rengRuta.sub || rengX.tambien?.includes(rengRuta.sub)) return `${rengPrefijo}${rengX.nombre}`
      if (rengRuta.sub && rengX.enCurso?.includes(rengRuta.sub)) return `${rengPadre ?? rengX.nombre} › ${rengNombreAcceso(rengAccesos, rengRuta.sub) ?? rengRuta.sub}`
    }
  }
  return null
}

export function rengProblemasMenu(rengModuloId: string, rengMenu: readonly RengEntradaMenu[], rengAbre: (rengSub: string | null) => boolean, rengExisteModulo: (rengId: string) => boolean): string[] {
  const rengOut: string[] = []
  const rengVistas = new Set<string>()
  for (const rengE of rengMenu) {
    if (rengE.hijos?.some((rengH) => rengH.hijos?.length)) rengOut.push(`«${rengE.nombre}»: solo se admite un nivel de hijos`)
  }
  for (const rengE of rengEntradasPlanas(rengMenu)) {
    const rengK = rengClaveEntrada(rengModuloId, rengE)
    if (rengVistas.has(rengK)) rengOut.push(`clave repetida: ${rengK}`)
    rengVistas.add(rengK)
    if (rengE.modulo) {
      if (!rengExisteModulo(rengE.modulo)) rengOut.push(`«${rengE.nombre}» enlaza un módulo que no existe: ${rengE.modulo}`)
    } else if (!rengAbre(rengE.sub)) rengOut.push(`«${rengE.nombre}» usa una subruta que el módulo no abre: ${rengE.sub}`)
    for (const rengS of rengE.enCurso ?? []) if (!rengAbre(rengS)) rengOut.push(`«${rengE.nombre}»: el acceso en curso ${rengS} no se abre`)
  }
  return rengOut
}
