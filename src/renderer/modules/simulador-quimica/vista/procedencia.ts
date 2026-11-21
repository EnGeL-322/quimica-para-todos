import { rengAtomo, type RengMesa } from '../nucleo/mesa'

export type RengOrigenGeometria = 'experimental' | 'calculada'

export interface RengRegistroGeometria {
  ids: readonly number[]
  firma: string
  distancias: readonly number[]
  origen: RengOrigenGeometria
}

export type RengProcedencias = ReadonlyMap<string, readonly RengRegistroGeometria[]>

export const RENG_TOL_GEOMETRIA = 1e-6
const RENG_MAX_CLAVES = 200
const RENG_MAX_VERSIONES = 50

export const rengSinProcedencias = (): RengProcedencias => new Map()

const rengOrdenados = (rengIds: readonly number[]): number[] => [...rengIds].sort((rengA, rengB) => rengA - rengB)
const rengClave = (rengIds: readonly number[]): string => rengOrdenados(rengIds).join(',')

function rengFirmaDe(rengM: RengMesa, rengIds: readonly number[]): string | null {
  const rengO = rengOrdenados(rengIds)
  const rengAts = rengO.map((rengId) => rengAtomo(rengM, rengId))
  if (rengAts.some((rengA) => !rengA)) return null
  const rengDentro = new Set(rengO)
  const rengEnlaces = rengM.enlaces
    .filter((rengE) => rengDentro.has(rengE.a) && rengDentro.has(rengE.b))
    .map((rengE) => `${Math.min(rengE.a, rengE.b)}-${Math.max(rengE.a, rengE.b)}:${rengE.orden}:${rengE.tipo}`)
    .sort()
  return `${rengAts.map((rengA) => `${rengA!.id}${rengA!.el}${rengA!.carga}`).join(' ')}|${rengEnlaces.join(' ')}`
}

function rengDistancias(rengM: RengMesa, rengIds: readonly number[]): number[] | null {
  const rengPs = rengOrdenados(rengIds).map((rengId) => rengAtomo(rengM, rengId)?.p)
  if (rengPs.some((rengP) => !rengP)) return null
  const rengD: number[] = []
  for (let rengI = 0; rengI < rengPs.length; rengI++)
    for (let rengJ = rengI + 1; rengJ < rengPs.length; rengJ++) {
      const rengA = rengPs[rengI]!
      const rengB = rengPs[rengJ]!
      rengD.push(Math.hypot(rengA[0] - rengB[0], rengA[1] - rengB[1], rengA[2] - rengB[2]))
    }
  return rengD
}

const rengCoincide = (rengR: RengRegistroGeometria, rengFirma: string, rengD: readonly number[]): boolean =>
  rengR.firma === rengFirma && rengR.distancias.length === rengD.length && rengD.every((rengX, rengI) => Math.abs(rengX - rengR.distancias[rengI]!) <= RENG_TOL_GEOMETRIA)

export function rengRegistrarGeometria(rengP: RengProcedencias, rengM: RengMesa, rengIds: readonly number[], rengOrigen: RengOrigenGeometria): RengProcedencias {
  const rengD = rengDistancias(rengM, rengIds)
  const rengFirma = rengFirmaDe(rengM, rengIds)
  if (!rengD || rengFirma === null) return rengP
  const rengK = rengClave(rengIds)
  const rengVersiones = (rengP.get(rengK) ?? []).filter((rengR) => !rengCoincide(rengR, rengFirma, rengD))
  const rengNuevo = new Map(rengP)
  rengNuevo.delete(rengK)
  rengNuevo.set(rengK, [...rengVersiones, { ids: rengOrdenados(rengIds), firma: rengFirma, distancias: rengD, origen: rengOrigen }].slice(-RENG_MAX_VERSIONES))
  while (rengNuevo.size > RENG_MAX_CLAVES) rengNuevo.delete(rengNuevo.keys().next().value!)
  return rengNuevo
}

export function rengOrigenGeometria(rengP: RengProcedencias, rengM: RengMesa, rengIds: readonly number[]): RengOrigenGeometria | null {
  const rengVersiones = rengP.get(rengClave(rengIds))
  if (!rengVersiones?.length) return null
  const rengFirma = rengFirmaDe(rengM, rengIds)
  const rengD = rengDistancias(rengM, rengIds)
  if (rengFirma === null || !rengD) return null
  for (let rengI = rengVersiones.length - 1; rengI >= 0; rengI--) if (rengCoincide(rengVersiones[rengI]!, rengFirma, rengD)) return rengVersiones[rengI]!.origen
  return null
}
