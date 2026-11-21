import { rengClase } from './constructor'
import { RENG_CONTEXTO_LIBRE, rengEvaluarUnion, type RengContextoUnion, type RengResultadoUnion, type RengTipoUnion } from './enlazar'

export type RengVec3 = readonly [number, number, number]

export interface RengAtomoMesa {
  id: number
  el: string
  carga: number
  p: RengVec3
}

export interface RengEnlaceMesa {
  a: number
  b: number
  orden: number
  tipo: RengTipoUnion
  electrones: number
  noConfirmado?: boolean
}

export interface RengAnotacionEstereo {
  ids: readonly number[]
  smiles: string
  idSinEstereo: string
}

export interface RengMesa {
  atomos: RengAtomoMesa[]
  enlaces: RengEnlaceMesa[]
  siguiente: number
  estereo?: readonly RengAnotacionEstereo[]
}

export const rengMesaVacia = (): RengMesa => ({ atomos: [], enlaces: [], siguiente: 1 })

export const rengSumar = (rengA: RengVec3, rengB: RengVec3): RengVec3 => [rengA[0] + rengB[0], rengA[1] + rengB[1], rengA[2] + rengB[2]]
export const rengRestar = (rengA: RengVec3, rengB: RengVec3): RengVec3 => [rengA[0] - rengB[0], rengA[1] - rengB[1], rengA[2] - rengB[2]]
export const rengEscalar = (rengA: RengVec3, rengK: number): RengVec3 => [rengA[0] * rengK, rengA[1] * rengK, rengA[2] * rengK]
export const rengNorma = (rengA: RengVec3): number => Math.hypot(rengA[0], rengA[1], rengA[2])
export const rengDistancia = (rengA: RengVec3, rengB: RengVec3): number => rengNorma(rengRestar(rengA, rengB))

export const rengAtomo = (rengM: RengMesa, rengId: number): RengAtomoMesa | undefined => rengM.atomos.find((rengX) => rengX.id === rengId)
export const rengEnlaceEntre = (rengM: RengMesa, rengA: number, rengB: number): RengEnlaceMesa | undefined => rengM.enlaces.find((rengE) => (rengE.a === rengA && rengE.b === rengB) || (rengE.a === rengB && rengE.b === rengA))
export const rengEnlacesDe = (rengM: RengMesa, rengId: number): RengEnlaceMesa[] => rengM.enlaces.filter((rengE) => rengE.a === rengId || rengE.b === rengId)
export const rengVecinosDe = (rengM: RengMesa, rengId: number): number[] => rengEnlacesDe(rengM, rengId).map((rengE) => (rengE.a === rengId ? rengE.b : rengE.a))

export function rengAnadirAtomo(rengM: RengMesa, rengEl: string, rengP: RengVec3, rengCarga = 0): { mesa: RengMesa; id: number } {
  const rengId = rengM.siguiente
  return { mesa: { ...rengM, atomos: [...rengM.atomos, { id: rengId, el: rengEl, carga: rengCarga, p: rengP }], siguiente: rengId + 1 }, id: rengId }
}

export function rengAnadirFragmento(
  rengM: RengMesa,
  rengAtomos: ReadonlyArray<{ el: string; carga: number; p: RengVec3 }>,
  rengEnlaces: ReadonlyArray<{ a: number; b: number; orden: number; tipo: RengTipoUnion; electrones?: number }>,
  rengCentro: RengVec3,
  rengEstereo?: { smiles: string; idSinEstereo: string }
): { mesa: RengMesa; ids: number[] } {
  const rengC = rengAtomos.length ? rengEscalar(rengAtomos.reduce<RengVec3>((rengS, rengX) => rengSumar(rengS, rengX.p), [0, 0, 0]), 1 / rengAtomos.length) : ([0, 0, 0] as RengVec3)
  const rengIds = rengAtomos.map((_, rengI) => rengM.siguiente + rengI)
  const rengNuevos = rengAtomos.map((rengX, rengI) => ({ id: rengIds[rengI]!, el: rengX.el, carga: rengX.carga, p: rengSumar(rengRestar(rengX.p, rengC), rengCentro) }))
  const rengEnl = rengEnlaces.map((rengE) => ({ a: rengIds[rengE.a]!, b: rengIds[rengE.b]!, orden: rengE.orden, tipo: rengE.tipo, electrones: rengE.electrones ?? 0 }))
  const rengAnotaciones = rengEstereo ? [...(rengM.estereo ?? []), { ids: rengIds, smiles: rengEstereo.smiles, idSinEstereo: rengEstereo.idSinEstereo }] : rengM.estereo
  return { mesa: { ...rengM, atomos: [...rengM.atomos, ...rengNuevos], enlaces: [...rengM.enlaces, ...rengEnl], siguiente: rengM.siguiente + rengAtomos.length, ...(rengAnotaciones ? { estereo: rengAnotaciones } : {}) }, ids: rengIds }
}

export const rengFijarPosiciones = (rengM: RengMesa, rengPos: ReadonlyMap<number, RengVec3>): RengMesa => ({ ...rengM, atomos: rengM.atomos.map((rengX) => (rengPos.has(rengX.id) ? { ...rengX, p: rengPos.get(rengX.id)! } : rengX)) })

export const rengMoverAtomos = (rengM: RengMesa, rengIds: ReadonlySet<number>, rengD: RengVec3): RengMesa => ({ ...rengM, atomos: rengM.atomos.map((rengX) => (rengIds.has(rengX.id) ? { ...rengX, p: rengSumar(rengX.p, rengD) } : rengX)) })

export function rengSepararAtomo(rengM: RengMesa, rengId: number): RengMesa {
  const rengQuitar = rengEnlacesDe(rengM, rengId)
  return rengRecalcularCargas({ ...rengM, enlaces: rengM.enlaces.filter((rengE) => !rengQuitar.includes(rengE)) }, rengQuitar)
}

export function rengBorrarAtomos(rengM: RengMesa, rengIds: ReadonlySet<number>): RengMesa {
  const rengQuitar = rengM.enlaces.filter((rengE) => rengIds.has(rengE.a) || rengIds.has(rengE.b))
  const rengR = rengRecalcularCargas({ ...rengM, enlaces: rengM.enlaces.filter((rengE) => !rengQuitar.includes(rengE)) }, rengQuitar)
  return { ...rengR, atomos: rengR.atomos.filter((rengX) => !rengIds.has(rengX.id)) }
}

function rengRecalcularCargas(rengM: RengMesa, rengQuitados: RengEnlaceMesa[]): RengMesa {
  const rengDelta = new Map<number, number>()
  for (const rengE of rengQuitados.filter((rengX) => rengX.tipo === 'ionico')) {
    const [rengCat, rengAn] = rengCargaIonica(rengM, rengE)
    rengDelta.set(rengCat, (rengDelta.get(rengCat) ?? 0) - rengE.electrones)
    rengDelta.set(rengAn, (rengDelta.get(rengAn) ?? 0) + rengE.electrones)
  }
  return { ...rengM, atomos: rengM.atomos.map((rengX) => (rengDelta.has(rengX.id) ? { ...rengX, carga: rengX.carga + rengDelta.get(rengX.id)! } : rengX)) }
}

function rengCargaIonica(rengM: RengMesa, rengE: RengEnlaceMesa): [number, number] {
  const rengA = rengAtomo(rengM, rengE.a)
  return rengA && rengA.carga > 0 ? [rengE.a, rengE.b] : [rengE.b, rengE.a]
}

export function rengContexto(rengM: RengMesa, rengA: number, rengB: number): RengContextoUnion {
  const rengCov = (rengId: number): number => rengEnlacesDe(rengM, rengId).filter((rengE) => rengE.tipo !== 'ionico' && rengE.tipo !== 'metalico').reduce((rengS, rengE) => rengS + rengE.orden, 0)
  const rengIon = (rengId: number): number => rengEnlacesDe(rengM, rengId).filter((rengE) => rengE.tipo === 'ionico').reduce((rengS, rengE) => rengS + rengE.electrones, 0)
  const RENG_A = rengAtomo(rengM, rengA)
  const RENG_B = rengAtomo(rengM, rengB)
  const rengIonA = rengIon(rengA)
  const rengIonB = rengIon(rengB)
  return {
    ordenEntre: rengEnlaceEntre(rengM, rengA, rengB)?.orden ?? 0,
    enlacesA: rengCov(rengA),
    enlacesB: rengCov(rengB),
    ionicoA: rengIonA,
    ionicoB: rengIonB,
    cargaA: (RENG_A?.carga ?? 0) - (RENG_A && RENG_A.carga > 0 ? rengIonA : -rengIonA),
    cargaB: (RENG_B?.carga ?? 0) - (RENG_B && RENG_B.carga > 0 ? rengIonB : -rengIonB)
  }
}

export function rengEvaluar(rengM: RengMesa, rengA: number, rengB: number): RengResultadoUnion {
  const RENG_A = rengAtomo(rengM, rengA)
  const RENG_B = rengAtomo(rengM, rengB)
  if (!RENG_A || !RENG_B || rengA === rengB) return { ...rengEvaluarUnion('H', 'H', RENG_CONTEXTO_LIBRE), permitida: false, forzable: false, motivo: 'Elige dos átomos distintos.' }
  return rengEvaluarUnion(RENG_A.el, RENG_B.el, rengContexto(rengM, rengA, rengB))
}

export function rengUnir(rengM: RengMesa, rengA: number, rengB: number, rengForzar = false): { mesa: RengMesa; r: RengResultadoUnion; hecho: boolean } {
  const rengR = rengEvaluar(rengM, rengA, rengB)
  if (!rengR.permitida && !(rengForzar && rengR.forzable)) return { mesa: rengM, r: rengR, hecho: false }
  const rengTipo = rengR.tipo ?? 'covalente-polar'
  const rengExistente = rengEnlaceEntre(rengM, rengA, rengB)
  let rengEnlaces = rengM.enlaces
  if (rengExistente) rengEnlaces = rengEnlaces.map((rengE) => (rengE === rengExistente ? { ...rengE, orden: rengR.orden } : rengE))
  else rengEnlaces = [...rengEnlaces, { a: rengA, b: rengB, orden: Math.max(1, rengR.orden), tipo: rengTipo, electrones: rengR.electrones, noConfirmado: !rengR.permitida || undefined }]
  let rengAtomos = rengM.atomos
  if (rengTipo === 'ionico' && rengR.electrones > 0) {
    const RENG_A = rengAtomo(rengM, rengA)!
    const rengCat = rengEsMetal(RENG_A.el) ? rengA : rengB
    const rengAn = rengCat === rengA ? rengB : rengA
    rengAtomos = rengAtomos.map((rengX) => (rengX.id === rengCat ? { ...rengX, carga: rengX.carga + rengR.electrones } : rengX.id === rengAn ? { ...rengX, carga: rengX.carga - rengR.electrones } : rengX))
  }
  return { mesa: { ...rengM, atomos: rengAtomos, enlaces: rengEnlaces }, r: rengR, hecho: true }
}

export const rengEsMetal = (rengS: string): boolean => rengClase(rengS) === 'metal'

export function rengFragmentos(rengM: RengMesa): number[][] {
  const rengVistos = new Set<number>()
  const rengOut: number[][] = []
  for (const rengX of rengM.atomos) {
    if (rengVistos.has(rengX.id)) continue
    const rengPila = [rengX.id]
    const rengF: number[] = []
    rengVistos.add(rengX.id)
    while (rengPila.length) {
      const rengId = rengPila.pop()!
      rengF.push(rengId)
      for (const rengV of rengVecinosDe(rengM, rengId))
        if (!rengVistos.has(rengV)) {
          rengVistos.add(rengV)
          rengPila.push(rengV)
        }
    }
    rengOut.push(rengF.sort((rengP, rengQ) => rengP - rengQ))
  }
  return rengOut
}

export const rengFragmentoDe = (rengM: RengMesa, rengId: number): number[] => rengFragmentos(rengM).find((rengF) => rengF.includes(rengId)) ?? [rengId]
