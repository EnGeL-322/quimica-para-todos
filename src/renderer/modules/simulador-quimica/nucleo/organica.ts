import { rengDesdeSmiles, type RengMoleculaGrafo } from './molecula'
import { rengNormalizarNombre } from './nomenclatura'

export const RENG_FUENTE_IUPAC_ORGANICA = 'IUPAC, Nomenclature of Organic Chemistry: Recommendations and Preferred Names 2013 (Favre y Powell, RSC 2014)'

export type RengTipoGrupo =
  | 'alcano'
  | 'alqueno'
  | 'alquino'
  | 'aromatico'
  | 'haluro'
  | 'alcohol'
  | 'fenol'
  | 'eter'
  | 'aldehido'
  | 'cetona'
  | 'acido-carboxilico'
  | 'carboxilato'
  | 'ester'
  | 'amina'
  | 'amida'
  | 'nitrilo'

export const RENG_NOMBRE_GRUPO: Record<RengTipoGrupo, string> = {
  alcano: 'Alcano',
  alqueno: 'Alqueno (C=C)',
  alquino: 'Alquino (C≡C)',
  aromatico: 'Anillo aromático',
  haluro: 'Haluro (C–X)',
  alcohol: 'Alcohol (–OH)',
  fenol: 'Fenol (–OH en anillo aromático)',
  eter: 'Éter (C–O–C)',
  aldehido: 'Aldehído (–CHO)',
  cetona: 'Cetona (C–CO–C)',
  'acido-carboxilico': 'Ácido carboxílico (–COOH)',
  carboxilato: 'Carboxilato (–COO⁻)',
  ester: 'Éster (–COO–C)',
  amina: 'Amina (–N)',
  amida: 'Amida (–CO–N)',
  nitrilo: 'Nitrilo (–C≡N)'
}

export interface RengGrupoFuncional {
  tipo: RengTipoGrupo
  atomos: number[]
}

interface RengVecino {
  j: number
  orden: number
  aromatico: boolean
}

function rengAdyacencia(rengM: RengMoleculaGrafo): RengVecino[][] {
  const rengAdj: RengVecino[][] = rengM.atomos.map(() => [])
  for (const rengE of rengM.enlaces) {
    rengAdj[rengE.a]!.push({ j: rengE.b, orden: rengE.orden, aromatico: rengE.aromatico })
    rengAdj[rengE.b]!.push({ j: rengE.a, orden: rengE.orden, aromatico: rengE.aromatico })
  }
  return rengAdj
}

const RENG_HALOGENOS = new Set(['F', 'Cl', 'Br', 'I'])

export function rengGruposFuncionales(rengM: RengMoleculaGrafo): RengGrupoFuncional[] {
  const rengAdj = rengAdyacencia(rengM)
  const rengEl = (rengI: number): string => rengM.atomos[rengI]!.el
  const rengGrupos: RengGrupoFuncional[] = []
  const rengUsados = new Set<number>()
  for (let rengI = 0; rengI < rengM.atomos.length; rengI++) {
    if (rengEl(rengI) !== 'C') continue
    const rengDO = rengAdj[rengI]!.find((rengV) => rengEl(rengV.j) === 'O' && rengV.orden === 2 && !rengV.aromatico)
    if (rengDO) {
      const rengOtros = rengAdj[rengI]!.filter((rengV) => rengV.j !== rengDO.j)
      const rengOS = rengOtros.find((rengV) => rengEl(rengV.j) === 'O' && rengV.orden === 1)
      const rengNS = rengOtros.find((rengV) => rengEl(rengV.j) === 'N' && rengV.orden === 1)
      rengUsados.add(rengDO.j)
      if (rengOS) {
        const rengO = rengOS.j
        rengUsados.add(rengO)
        const rengH = rengAdj[rengO]!.find((rengV) => rengEl(rengV.j) === 'H')
        if (rengM.atomos[rengO]!.carga === -1) rengGrupos.push({ tipo: 'carboxilato', atomos: [rengI, rengDO.j, rengO] })
        else if (rengH) rengGrupos.push({ tipo: 'acido-carboxilico', atomos: [rengI, rengDO.j, rengO, rengH.j] })
        else rengGrupos.push({ tipo: 'ester', atomos: [rengI, rengDO.j, rengO] })
      } else if (rengNS) {
        rengUsados.add(rengNS.j)
        rengGrupos.push({ tipo: 'amida', atomos: [rengI, rengDO.j, rengNS.j] })
      } else {
        const rengNH = rengOtros.filter((rengV) => rengEl(rengV.j) === 'H').length
        rengGrupos.push({ tipo: rengNH > 0 ? 'aldehido' : 'cetona', atomos: [rengI, rengDO.j] })
      }
    }
    const rengTN = rengAdj[rengI]!.find((rengV) => rengEl(rengV.j) === 'N' && rengV.orden === 3)
    if (rengTN) {
      rengUsados.add(rengTN.j)
      rengGrupos.push({ tipo: 'nitrilo', atomos: [rengI, rengTN.j] })
    }
    for (const rengV of rengAdj[rengI]!) if (RENG_HALOGENOS.has(rengEl(rengV.j))) rengGrupos.push({ tipo: 'haluro', atomos: [rengI, rengV.j] })
  }
  for (let rengO = 0; rengO < rengM.atomos.length; rengO++) {
    if (rengEl(rengO) !== 'O' || rengUsados.has(rengO)) continue
    const rengCs = rengAdj[rengO]!.filter((rengV) => rengEl(rengV.j) === 'C' && rengV.orden === 1)
    const rengHs = rengAdj[rengO]!.filter((rengV) => rengEl(rengV.j) === 'H')
    if (rengHs.length === 1 && rengCs.length === 1) rengGrupos.push({ tipo: rengM.atomos[rengCs[0]!.j]!.aromatico ? 'fenol' : 'alcohol', atomos: [rengO, rengCs[0]!.j, rengHs[0]!.j] })
    else if (rengCs.length === 2 && rengHs.length === 0) rengGrupos.push({ tipo: 'eter', atomos: [rengCs[0]!.j, rengO, rengCs[1]!.j] })
  }
  for (let rengN = 0; rengN < rengM.atomos.length; rengN++) {
    if (rengEl(rengN) !== 'N' || rengUsados.has(rengN) || rengM.atomos[rengN]!.aromatico || rengM.atomos[rengN]!.carga !== 0) continue
    if (rengAdj[rengN]!.some((rengV) => rengEl(rengV.j) === 'O')) continue
    const rengCs = rengAdj[rengN]!.filter((rengV) => rengEl(rengV.j) === 'C')
    if (rengCs.length) rengGrupos.push({ tipo: 'amina', atomos: [rengN, ...rengCs.map((rengV) => rengV.j)] })
  }
  for (const rengE of rengM.enlaces) {
    if (rengE.aromatico || rengEl(rengE.a) !== 'C' || rengEl(rengE.b) !== 'C') continue
    if (rengE.orden === 2) rengGrupos.push({ tipo: 'alqueno', atomos: [rengE.a, rengE.b] })
    if (rengE.orden === 3) rengGrupos.push({ tipo: 'alquino', atomos: [rengE.a, rengE.b] })
  }
  const rengVisto = new Set<number>()
  for (let rengI = 0; rengI < rengM.atomos.length; rengI++) {
    if (!rengM.atomos[rengI]!.aromatico || rengVisto.has(rengI)) continue
    const rengComp: number[] = []
    const rengPila = [rengI]
    rengVisto.add(rengI)
    while (rengPila.length) {
      const rengX = rengPila.pop()!
      rengComp.push(rengX)
      for (const rengV of rengAdj[rengX]!) if (rengM.atomos[rengV.j]!.aromatico && !rengVisto.has(rengV.j)) {
        rengVisto.add(rengV.j)
        rengPila.push(rengV.j)
      }
    }
    rengGrupos.push({ tipo: 'aromatico', atomos: rengComp })
  }
  if (rengGrupos.length === 0 && rengM.atomos.every((rengA) => rengA.el === 'C' || rengA.el === 'H') && rengM.atomos.some((rengA) => rengA.el === 'C')) {
    rengGrupos.push({ tipo: 'alcano', atomos: rengM.atomos.map((rengA, rengI) => (rengA.el === 'C' ? rengI : -1)).filter((rengI) => rengI >= 0) })
  }
  return rengGrupos
}

const RENG_RAIZ = ['', 'met', 'et', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec']
const RENG_MULT = ['', '', 'di', 'tri', 'tetra']
const RENG_ALQUILO = ['', 'metil', 'etil', 'propil', 'butil']
const RENG_ALCOXI = ['', 'metoxi', 'etoxi', 'propoxi', 'butoxi']
const RENG_ALQUILO_ESTER = ['', 'metilo', 'etilo', 'propilo', 'butilo', 'pentilo', 'hexilo']

type RengPrincipal = 'acido' | 'ester' | 'amida' | 'nitrilo' | 'aldehido' | 'cetona' | 'alcohol' | 'amina'
const RENG_PRIORIDAD: RengPrincipal[] = ['acido', 'ester', 'amida', 'nitrilo', 'aldehido', 'cetona', 'alcohol', 'amina']
const RENG_TERMINAL: RengPrincipal[] = ['acido', 'ester', 'amida', 'nitrilo', 'aldehido']
const RENG_SUFIJO: Record<RengPrincipal, string> = { acido: 'oico', ester: 'oato', amida: 'amida', nitrilo: 'nitrilo', aldehido: 'al', cetona: 'ona', alcohol: 'ol', amina: 'amina' }

export interface RengNombreOrganico {
  nombre: string
  comunes: string[]
  notas: string[]
}

export const RENG_COMUNES: Array<{ nombres: string[]; smiles: string }> = [
  { nombres: ['ácido acético'], smiles: 'CC(=O)O' },
  { nombres: ['ácido fórmico'], smiles: 'OC=O' },
  { nombres: ['acetona'], smiles: 'CC(C)=O' },
  { nombres: ['formaldehído'], smiles: 'C=O' },
  { nombres: ['acetaldehído'], smiles: 'CC=O' },
  { nombres: ['tolueno'], smiles: 'Cc1ccccc1' },
  { nombres: ['anilina'], smiles: 'Nc1ccccc1' },
  { nombres: ['benzaldehído'], smiles: 'O=Cc1ccccc1' },
  { nombres: ['cloroformo'], smiles: 'ClC(Cl)Cl' },
  { nombres: ['glicerina', 'glicerol'], smiles: 'OCC(O)CO' },
  { nombres: ['etilenglicol'], smiles: 'OCCO' },
  { nombres: ['éter dietílico', 'dietiléter'], smiles: 'CCOCC' },
  { nombres: ['acetato de etilo'], smiles: 'CCOC(C)=O' },
  { nombres: ['alcohol etílico'], smiles: 'CCO' },
  { nombres: ['alcohol metílico'], smiles: 'CO' },
  { nombres: ['alcohol isopropílico', 'isopropanol'], smiles: 'CC(C)O' },
  { nombres: ['metilamina'], smiles: 'CN' },
  { nombres: ['etilamina'], smiles: 'CCN' },
  { nombres: ['acetonitrilo'], smiles: 'CC#N' },
  { nombres: ['acetileno'], smiles: 'C#C' },
  { nombres: ['etileno'], smiles: 'C=C' },
  { nombres: ['propileno'], smiles: 'C=CC' },
  { nombres: ['isobutano'], smiles: 'CC(C)C' }
]

class RengFueraDeAlcance extends Error {}

interface RengSust {
  nombre: string
  loc: number
}

function rengRamaLineal(rengM: RengMoleculaGrafo, rengAdj: RengVecino[][], rengDesde: number, rengProhibidos: Set<number>): number[] {
  const rengOut: number[] = []
  let rengActual = rengDesde
  let rengPrevio = -1
  for (;;) {
    rengOut.push(rengActual)
    const rengSig = rengAdj[rengActual]!.filter((rengV) => rengV.j !== rengPrevio && !rengProhibidos.has(rengV.j) && rengM.atomos[rengV.j]!.el !== 'H')
    if (rengSig.some((rengV) => rengM.atomos[rengV.j]!.el !== 'C' || rengV.orden !== 1)) throw new RengFueraDeAlcance('un sustituyente contiene heteroátomos o enlaces múltiples.')
    if (rengSig.length === 0) return rengOut
    if (rengSig.length > 1) throw new RengFueraDeAlcance('tiene un sustituyente ramificado (isopropil, isobutil, terc-butil…), que la app aún no nombra.')
    rengPrevio = rengActual
    rengActual = rengSig[0]!.j
  }
}

const rengCompararVectores = (rengA: number[], rengB: number[]): number => {
  for (let rengI = 0; rengI < Math.max(rengA.length, rengB.length); rengI++) {
    const rengX = rengA[rengI] ?? Infinity
    const rengY = rengB[rengI] ?? Infinity
    if (rengX !== rengY) return rengX - rengY
  }
  return 0
}

function rengBloquePrefijos(rengSust: RengSust[], rengConLocantes: boolean): string {
  const rengPorNombre = new Map<string, number[]>()
  for (const rengS of rengSust) rengPorNombre.set(rengS.nombre, [...(rengPorNombre.get(rengS.nombre) ?? []), rengS.loc])
  const rengOrdenados = [...rengPorNombre.entries()].sort((rengA, rengB) => (rengA[0] < rengB[0] ? -1 : 1))
  return rengOrdenados
    .map(([rengNom, rengLocs]) => {
      const rengL = rengLocs.sort((rengX, rengY) => rengX - rengY)
      return `${rengConLocantes ? `${rengL.join(',')}-` : ''}${RENG_MULT[rengL.length] ?? ''}${rengNom}`
    })
    .join(rengConLocantes ? '-' : '')
}

export function rengNombrarOrganico(rengM: RengMoleculaGrafo): RengNombreOrganico {
  const rengNotas: string[] = []
  const rengComunes = RENG_COMUNES.filter((rengC) => {
    try {
      return rengDesdeSmiles(rengC.smiles).id === rengM.id
    } catch {
      return false
    }
  }).flatMap((rengC) => rengC.nombres)
  try {
    const rengNombre = rengNombrarInterno(rengM)
    return { nombre: rengNombre, comunes: rengComunes, notas: rengNotas }
  } catch (rengE) {
    if (rengE instanceof RengFueraDeAlcance) throw new Error(`La app aún no sabe nombrar esta estructura: ${rengE.message}`)
    throw rengE
  }
}

function rengNombrarInterno(rengM: RengMoleculaGrafo): string {
  const rengAdj = rengAdyacencia(rengM)
  const rengEl = (rengI: number): string => rengM.atomos[rengI]!.el
  if (rengM.carga !== 0) throw new RengFueraDeAlcance('tiene carga neta (es un ion).')
  if (!rengM.atomos.some((rengA) => rengA.el === 'C')) throw new RengFueraDeAlcance('no contiene carbono.')
  const rengRaros = [...new Set(rengM.atomos.map((rengA) => rengA.el))].filter((rengE) => !['C', 'H', 'O', 'N', 'F', 'Cl', 'Br', 'I'].includes(rengE))
  if (rengRaros.length) throw new RengFueraDeAlcance(`contiene ${rengRaros.join(', ')}.`)
  const rengPesados = rengM.atomos.map((rengA, rengI) => (rengA.el !== 'H' ? rengI : -1)).filter((rengI) => rengI >= 0)
  const rengEnlacesPesados = rengM.enlaces.filter((rengE) => rengEl(rengE.a) !== 'H' && rengEl(rengE.b) !== 'H')
  const rengAnillos = rengEnlacesPesados.length - rengPesados.length + 1
  if (rengAnillos > 0) return rengNombrarCiclico(rengM, rengAdj, rengAnillos)

  const rengGrupos = rengGruposFuncionales(rengM)
  const rengTipos = (rengT: RengTipoGrupo): RengGrupoFuncional[] => rengGrupos.filter((rengG) => rengG.tipo === rengT)
  const rengMapaPrincipal: Record<RengPrincipal, RengGrupoFuncional[]> = {
    acido: rengTipos('acido-carboxilico'),
    ester: rengTipos('ester'),
    amida: rengTipos('amida'),
    nitrilo: rengTipos('nitrilo'),
    aldehido: rengTipos('aldehido'),
    cetona: rengTipos('cetona'),
    alcohol: rengTipos('alcohol'),
    amina: rengTipos('amina')
  }
  if (rengTipos('carboxilato').length) throw new RengFueraDeAlcance('es un carboxilato (ion).')
  const rengPrincipal = RENG_PRIORIDAD.find((rengP) => rengMapaPrincipal[rengP].length > 0) ?? null
  for (const rengA of rengTipos('amina')) if (rengA.atomos.length > 2) throw new RengFueraDeAlcance('tiene una amina secundaria o terciaria.')
  for (const rengA of rengTipos('amida')) if (rengAdj[rengA.atomos[2]!]!.filter((rengV) => rengEl(rengV.j) === 'C').length > 1) throw new RengFueraDeAlcance('tiene una amida sustituida en el N.')

  const rengProhibidos = new Set<number>()
  let rengAlquiloEster: string | null = null
  if (rengPrincipal === 'ester') {
    if (rengMapaPrincipal.ester.length > 1) throw new RengFueraDeAlcance('tiene más de un éster.')
    const [rengCC, , rengO] = rengMapaPrincipal.ester[0]!.atomos as [number, number, number]
    const rengCAlq = rengAdj[rengO]!.find((rengV) => rengV.j !== rengCC && rengEl(rengV.j) === 'C')!.j
    const rengRama = rengRamaLineal(rengM, rengAdj, rengCAlq, new Set([rengO]))
    rengRama.forEach((rengX) => rengProhibidos.add(rengX))
    rengAlquiloEster = RENG_ALQUILO_ESTER[rengRama.length] ?? null
    if (!rengAlquiloEster) throw new RengFueraDeAlcance('el grupo alquilo del éster es demasiado largo.')
  }
  const rengAlcoxi = new Map<number, string>()
  for (const rengG of rengTipos('eter')) {
    const [rengC1, rengO, rengC2] = rengG.atomos as [number, number, number]
    const rengLado = (rengC: number): number[] => {
      const rengVis = new Set([rengO, rengC])
      const rengPila = [rengC]
      while (rengPila.length) {
        const rengX = rengPila.pop()!
        for (const rengV of rengAdj[rengX]!) if (!rengVis.has(rengV.j) && rengEl(rengV.j) !== 'H') {
          rengVis.add(rengV.j)
          rengPila.push(rengV.j)
        }
      }
      rengVis.delete(rengO)
      return [...rengVis]
    }
    const rengL1 = rengLado(rengC1)
    const rengL2 = rengLado(rengC2)
    const rengTienePG = (rengL: number[]): boolean => rengPrincipal !== null && rengMapaPrincipal[rengPrincipal].some((rengGr) => rengGr.atomos.some((rengA) => rengL.includes(rengA)))
    let rengMenor: number[]
    let rengCPadre: number
    if (rengTienePG(rengL1) !== rengTienePG(rengL2)) [rengMenor, rengCPadre] = rengTienePG(rengL1) ? [rengL2, rengC1] : [rengL1, rengC2]
    else [rengMenor, rengCPadre] = rengL1.length <= rengL2.length ? [rengL1, rengC2] : [rengL2, rengC1]
    const rengRama = rengRamaLineal(rengM, rengAdj, rengMenor.includes(rengC1) ? rengC1 : rengC2, new Set([rengO]))
    rengRama.forEach((rengX) => rengProhibidos.add(rengX))
    rengProhibidos.add(rengO)
    rengAlcoxi.set(rengCPadre, RENG_ALCOXI[rengRama.length] ?? '')
    if (!RENG_ALCOXI[rengRama.length]) throw new RengFueraDeAlcance('un grupo alcoxi es demasiado largo.')
  }

  const rengCarbonos = rengPesados.filter((rengI) => rengEl(rengI) === 'C' && !rengProhibidos.has(rengI))
  const rengEnEsq = new Set(rengCarbonos)
  const rengVecC = (rengI: number): number[] => rengAdj[rengI]!.filter((rengV) => rengEnEsq.has(rengV.j)).map((rengV) => rengV.j)
  const rengPgCarbono = (rengG: RengGrupoFuncional, rengP: RengPrincipal): number => (rengP === 'alcohol' || rengP === 'amina' ? rengG.atomos[1]! : rengG.atomos[0]!)
  const rengPgC = rengPrincipal ? rengMapaPrincipal[rengPrincipal].map((rengG) => rengPgCarbono(rengG, rengPrincipal)) : []
  if (rengCarbonos.length > 10) throw new RengFueraDeAlcance('la cadena tiene más de 10 carbonos.')

  const rengHojas = rengCarbonos.filter((rengC) => rengVecC(rengC).length <= 1)
  const rengCaminos: number[][] = []
  const rengCamino = (rengA: number, rengB: number): number[] | null => {
    const rengPrev = new Map<number, number>([[rengA, -1]])
    const rengCola = [rengA]
    while (rengCola.length) {
      const rengX = rengCola.shift()!
      if (rengX === rengB) break
      for (const rengY of rengVecC(rengX)) if (!rengPrev.has(rengY)) {
        rengPrev.set(rengY, rengX)
        rengCola.push(rengY)
      }
    }
    if (!rengPrev.has(rengB)) return null
    const rengOut: number[] = []
    for (let rengX = rengB; rengX !== -1; rengX = rengPrev.get(rengX)!) rengOut.push(rengX)
    return rengOut.reverse()
  }
  for (const rengA of rengHojas) for (const rengB of rengHojas) {
    const rengP = rengA === rengB ? [rengA] : rengCamino(rengA, rengB)
    if (rengP) rengCaminos.push(rengP)
  }
  if (rengCarbonos.length === 1) rengCaminos.push([rengCarbonos[0]!])

  const rengOrdenEnlace = (rengX: number, rengY: number): number => rengAdj[rengX]!.find((rengV) => rengV.j === rengY)?.orden ?? 1

  interface RengCandidata {
    cadena: number[]
    clave: Array<number | number[]>
    pg: number[]
    mult: Array<{ loc: number; orden: number }>
    sust: RengSust[]
  }
  const rengCandidatas: RengCandidata[] = []
  for (const rengCad of rengCaminos) {
    const rengSet = new Set(rengCad)
    if (RENG_TERMINAL.includes(rengPrincipal!) && rengPgC.some((rengC) => rengSet.has(rengC) && rengC !== rengCad[0] && rengC !== rengCad[rengCad.length - 1])) continue
    const rengNPG = rengPgC.filter((rengC) => rengSet.has(rengC)).length
    const rengMult = rengCad.slice(0, -1).map((rengC, rengK) => ({ loc: rengK + 1, orden: rengOrdenEnlace(rengC, rengCad[rengK + 1]!) })).filter((rengX) => rengX.orden > 1)
    let rengSust: RengSust[]
    try {
      rengSust = []
      rengCad.forEach((rengC, rengK) => {
        const rengLoc = rengK + 1
        for (const rengV of rengAdj[rengC]!) {
          if (rengSet.has(rengV.j)) continue
          const rengE = rengEl(rengV.j)
          if (rengE === 'H') continue
          if (rengE === 'C') {
            if (rengProhibidos.has(rengV.j)) continue
            if (rengV.orden !== 1) throw new RengFueraDeAlcance('hay un enlace múltiple fuera de la cadena principal.')
            const rengRama = rengRamaLineal(rengM, rengAdj, rengV.j, new Set([rengC]))
            if (rengRama.some((rengX) => rengPgC.includes(rengX))) throw new RengFueraDeAlcance('el grupo principal queda en una rama.')
            if (!RENG_ALQUILO[rengRama.length]) throw new RengFueraDeAlcance('una rama es demasiado larga.')
            rengSust.push({ nombre: RENG_ALQUILO[rengRama.length]!, loc: rengLoc })
          } else if (RENG_HALOGENOS.has(rengE)) rengSust.push({ nombre: { F: 'fluoro', Cl: 'cloro', Br: 'bromo', I: 'yodo' }[rengE]!, loc: rengLoc })
          else if (rengE === 'O') {
            if (rengProhibidos.has(rengV.j)) {
              const rengPref = rengAlcoxi.get(rengC)
              if (rengPref) rengSust.push({ nombre: rengPref, loc: rengLoc })
              continue
            }
            if (rengV.orden === 2) {
              if (rengPrincipal !== 'cetona' && !(RENG_TERMINAL.includes(rengPrincipal!) && rengPgC.includes(rengC))) rengSust.push({ nombre: 'oxo', loc: rengLoc })
            } else if (!(RENG_TERMINAL.includes(rengPrincipal!) && rengPgC.includes(rengC)) && rengPrincipal !== 'alcohol') rengSust.push({ nombre: 'hidroxi', loc: rengLoc })
          } else if (rengE === 'N') {
            if (rengV.orden === 3 || (rengPrincipal === 'amida' && rengPgC.includes(rengC))) continue
            if (rengPrincipal !== 'amina') rengSust.push({ nombre: 'amino', loc: rengLoc })
          }
        }
      })
    } catch (rengEr) {
      if (rengEr instanceof RengFueraDeAlcance) continue
      throw rengEr
    }
    const rengPg = rengPrincipal
      ? rengMapaPrincipal[rengPrincipal]
          .map((rengG) => rengCad.indexOf(rengPgCarbono(rengG, rengPrincipal)) + 1)
          .filter((rengX) => rengX > 0)
          .sort((rengA, rengB) => rengA - rengB)
      : []
    const rengMultLocs = rengMult.map((rengX) => rengX.loc).sort((rengA, rengB) => rengA - rengB)
    const rengDoblesLocs = rengMult.filter((rengX) => rengX.orden === 2).map((rengX) => rengX.loc)
    const rengSustLocs = rengSust.map((rengS) => rengS.loc).sort((rengA, rengB) => rengA - rengB)
    const rengAlfa = [...rengSust].sort((rengA, rengB) => (rengA.nombre < rengB.nombre ? -1 : rengA.nombre > rengB.nombre ? 1 : rengA.loc - rengB.loc)).map((rengS) => rengS.loc)
    rengCandidatas.push({ cadena: rengCad, clave: [-rengNPG, -rengCad.length, -rengMult.length, -rengDoblesLocs.length, rengPg, rengMultLocs, rengDoblesLocs, rengSustLocs, rengAlfa], pg: rengPg, mult: rengMult, sust: rengSust })
  }
  if (!rengCandidatas.length) throw new RengFueraDeAlcance('no se encontró una cadena principal válida con estas reglas.')
  rengCandidatas.sort((rengA, rengB) => {
    for (let rengK = 0; rengK < rengA.clave.length; rengK++) {
      const rengX = rengA.clave[rengK]!
      const rengY = rengB.clave[rengK]!
      const rengD = Array.isArray(rengX) ? rengCompararVectores(rengX, rengY as number[]) : rengX - (rengY as number)
      if (rengD !== 0) return rengD
    }
    return 0
  })
  const rengMejor = rengCandidatas[0]!
  if (rengPrincipal && rengMejor.pg.length < rengPgC.length) throw new RengFueraDeAlcance('no todos los grupos principales caben en una cadena.')
  return rengMontarNombre(rengMejor.cadena.length, rengPrincipal, rengMejor.pg, rengMejor.mult, rengMejor.sust, rengAlquiloEster)
}

function rengMontarNombre(rengN: number, rengPrincipal: RengPrincipal | null, rengPg: number[], rengMult: Array<{ loc: number; orden: number }>, rengSust: RengSust[], rengAlquiloEster: string | null): string {
  const rengRaiz = RENG_RAIZ[rengN]!
  const rengOtros = rengSust.length > 0 || rengMult.length > 0
  const rengSinLocPref = rengN === 1 || (rengN === 2 && rengSust.length === 1 && !rengPrincipal && rengMult.length === 0)
  const rengPref = rengBloquePrefijos(rengSust, !rengSinLocPref)
  const rengDobles = rengMult.filter((rengX) => rengX.orden === 2).map((rengX) => rengX.loc)
  const rengTriples = rengMult.filter((rengX) => rengX.orden === 3).map((rengX) => rengX.loc)
  const rengSinLocMult = !rengPrincipal && rengSust.length === 0 && rengMult.length === 1 && rengN <= 3
  const rengParte = (rengLocs: number[], rengInf: string): string => (rengLocs.length ? `${rengSinLocMult ? '' : `-${rengLocs.join(',')}-`}${RENG_MULT[rengLocs.length] ?? ''}${rengInf}` : '')
  const rengEufonia = rengDobles.length > 1 || rengTriples.length > 1 ? 'a' : ''
  let rengTallo = rengMult.length ? `${rengRaiz}${rengEufonia}${rengParte(rengDobles, 'en')}${rengParte(rengTriples, 'in')}` : `${rengRaiz}an`
  if (!rengPrincipal) return `${rengPref}${rengTallo}o`
  const rengSuf = RENG_SUFIJO[rengPrincipal]
  const rengNPG = rengPg.length
  const rengTerminal = RENG_TERMINAL.includes(rengPrincipal)
  const rengPosibles = (): number => {
    if (rengTerminal) return 1
    if (rengPrincipal === 'cetona') return rengN <= 4 ? 1 : 2
    return rengN <= 2 ? 1 : 2
  }
  const rengSinLocPG = rengTerminal || rengN === 1 || (!rengOtros && rengNPG === 1 && rengPosibles() === 1)
  const rengMultSuf = RENG_MULT[rengNPG] ?? ''
  const rengSufCompleto = `${rengMultSuf}${rengSuf}`
  const rengEmpiezaVocal = /^[aeiou]/.test(rengSufCompleto)
  if (!rengEmpiezaVocal) rengTallo += 'o'
  const rengLoc = rengSinLocPG ? '' : `-${rengPg.join(',')}-`
  if (rengPrincipal === 'acido') return `ácido ${rengPref}${rengTallo}${rengLoc}${rengSufCompleto}`
  if (rengPrincipal === 'ester') return `${rengPref}${rengTallo}${rengSufCompleto} de ${rengAlquiloEster}`
  return `${rengPref}${rengTallo}${rengLoc}${rengSufCompleto}`
}

function rengNombrarCiclico(rengM: RengMoleculaGrafo, rengAdj: RengVecino[][], rengAnillos: number): string {
  const rengEl = (rengI: number): string => rengM.atomos[rengI]!.el
  if (rengAnillos > 1) throw new RengFueraDeAlcance('tiene más de un anillo.')
  const rengAromaticos = rengM.atomos.map((rengA, rengI) => (rengA.aromatico ? rengI : -1)).filter((rengI) => rengI >= 0)
  if (rengAromaticos.length === 0) {
    const rengC = rengM.atomos.filter((rengA) => rengA.el === 'C').length
    if (rengM.atomos.some((rengA) => rengA.el !== 'C' && rengA.el !== 'H') || rengM.enlaces.some((rengE) => rengE.orden !== 1)) throw new RengFueraDeAlcance('es un anillo no aromático con heteroátomos o enlaces múltiples.')
    if (rengM.atomos.some((rengA, rengI) => rengA.el === 'C' && rengAdj[rengI]!.filter((rengV) => rengEl(rengV.j) === 'C').length !== 2)) throw new RengFueraDeAlcance('es un cicloalcano con sustituyentes.')
    if (rengC < 3 || rengC > 10) throw new RengFueraDeAlcance('el anillo tiene un tamaño fuera de 3–10.')
    return `ciclo${RENG_RAIZ[rengC]}ano`
  }
  if (rengAromaticos.length !== 6 || rengAromaticos.some((rengI) => rengEl(rengI) !== 'C')) throw new RengFueraDeAlcance('el anillo aromático no es un benceno.')
  const rengAnillo: number[] = [rengAromaticos[0]!]
  while (rengAnillo.length < 6) {
    const rengUlt = rengAnillo[rengAnillo.length - 1]!
    const rengSig = rengAdj[rengUlt]!.find((rengV) => rengM.atomos[rengV.j]!.aromatico && !rengAnillo.includes(rengV.j))
    if (!rengSig) break
    rengAnillo.push(rengSig.j)
  }
  const rengEnAnillo = new Set(rengAnillo)
  type RengS = { nombre: string; clase: 'acido' | 'aldehido' | 'fenol' | 'anilina' | 'prefijo' }
  const rengSusts: Array<RengS | null> = rengAnillo.map((rengC) => {
    const rengFuera = rengAdj[rengC]!.filter((rengV) => !rengEnAnillo.has(rengV.j) && rengEl(rengV.j) !== 'H')
    if (rengFuera.length === 0) return null
    if (rengFuera.length > 1) throw new RengFueraDeAlcance('un carbono del anillo tiene dos sustituyentes.')
    const rengX = rengFuera[0]!.j
    const rengE = rengEl(rengX)
    if (RENG_HALOGENOS.has(rengE)) return { nombre: { F: 'fluoro', Cl: 'cloro', Br: 'bromo', I: 'yodo' }[rengE]!, clase: 'prefijo' }
    if (rengE === 'O') {
      if (rengAdj[rengX]!.some((rengV) => rengEl(rengV.j) === 'H')) return { nombre: 'hidroxi', clase: 'fenol' }
      throw new RengFueraDeAlcance('tiene un éter en el anillo.')
    }
    if (rengE === 'N') {
      if (rengAdj[rengX]!.filter((rengV) => rengEl(rengV.j) === 'H').length === 2) return { nombre: 'amino', clase: 'anilina' }
      throw new RengFueraDeAlcance('tiene un nitrógeno sustituido.')
    }
    if (rengE === 'C') {
      const rengDO = rengAdj[rengX]!.find((rengV) => rengEl(rengV.j) === 'O' && rengV.orden === 2)
      if (rengDO) {
        const rengOh = rengAdj[rengX]!.find((rengV) => rengEl(rengV.j) === 'O' && rengV.orden === 1)
        if (rengOh) return { nombre: 'carboxi', clase: 'acido' }
        if (rengAdj[rengX]!.some((rengV) => rengEl(rengV.j) === 'H')) return { nombre: 'formil', clase: 'aldehido' }
        throw new RengFueraDeAlcance('tiene una cetona aromática.')
      }
      const rengRama = rengRamaLineal(rengM, rengAdj, rengX, new Set([rengC]))
      if (!RENG_ALQUILO[rengRama.length]) throw new RengFueraDeAlcance('una rama es demasiado larga.')
      return { nombre: RENG_ALQUILO[rengRama.length]!, clase: 'prefijo' }
    }
    throw new RengFueraDeAlcance(`tiene un sustituyente de ${rengE}.`)
  })
  const rengPrioridad = ['acido', 'aldehido', 'fenol', 'anilina'] as const
  const rengPadre = rengPrioridad.find((rengP) => rengSusts.some((rengS) => rengS?.clase === rengP)) ?? null
  if (rengPadre && rengSusts.filter((rengS) => rengS?.clase === rengPadre).length > 1) throw new RengFueraDeAlcance('tiene el grupo principal repetido en el anillo.')
  let rengMejor: { loc: RengSust[]; clave: number[]; alfa: number[] } | null = null
  for (let rengIni = 0; rengIni < 6; rengIni++)
    for (const rengSentido of [1, -1]) {
      const rengPos = (rengK: number): number => (((rengIni + rengSentido * rengK) % 6) + 6) % 6
      if (rengPadre && rengSusts[rengPos(0)]?.clase !== rengPadre) continue
      const rengLoc: RengSust[] = []
      for (let rengK = 0; rengK < 6; rengK++) {
        const rengS = rengSusts[rengPos(rengK)]
        if (rengS && rengS.clase !== rengPadre) rengLoc.push({ nombre: rengS.nombre, loc: rengK + 1 })
      }
      const rengClave = rengLoc.map((rengX) => rengX.loc).sort((rengA, rengB) => rengA - rengB)
      const rengAlfa = [...rengLoc].sort((rengA, rengB) => (rengA.nombre < rengB.nombre ? -1 : 1)).map((rengX) => rengX.loc)
      if (!rengMejor || rengCompararVectores(rengClave, rengMejor.clave) < 0 || (rengCompararVectores(rengClave, rengMejor.clave) === 0 && rengCompararVectores(rengAlfa, rengMejor.alfa) < 0)) rengMejor = { loc: rengLoc, clave: rengClave, alfa: rengAlfa }
    }
  const rengLoc = rengMejor!.loc
  const rengBase = { acido: 'benzoico', aldehido: 'benzaldehído', fenol: 'fenol', anilina: 'anilina' }
  const rengConLoc = rengPadre ? rengLoc.length > 0 : rengLoc.length > 1
  const rengPref = rengBloquePrefijos(rengLoc, rengConLoc)
  if (rengPadre === 'acido') return `ácido ${rengPref}${rengBase.acido}`
  if (rengPadre) return `${rengPref}${rengBase[rengPadre]}`
  return `${rengPref}benceno`
}

const RENG_PREF_SMILES: Record<string, string> = {
  metil: 'C', etil: 'CC', propil: 'CCC', butil: 'CCCC',
  fluoro: 'F', cloro: 'Cl', bromo: 'Br', yodo: 'I',
  hidroxi: 'O', amino: 'N', oxo: '=O', metoxi: 'OC', etoxi: 'OCC', propoxi: 'OCCC', butoxi: 'OCCCC'
}
const RENG_PREFIJO_RE = new RegExp(`(?:(\\d+(?:,\\d+)*)-)?(di|tri|tetra)?(${Object.keys(RENG_PREF_SMILES).sort((rengA, rengB) => rengB.length - rengA.length).join('|')})-?`, 'y')

function rengLeerPrefijos(rengS: string): RengSust[] {
  const rengOut: RengSust[] = []
  RENG_PREFIJO_RE.lastIndex = 0
  let rengI = 0
  while (rengI < rengS.length) {
    RENG_PREFIJO_RE.lastIndex = rengI
    const rengM = RENG_PREFIJO_RE.exec(rengS)
    if (!rengM) throw new Error(`No entiendo «${rengS.slice(rengI)}» como sustituyente (metil, etil, cloro, bromo, hidroxi, amino…).`)
    const rengMult = rengM[2] ? RENG_MULT.indexOf(rengM[2]) : 1
    const rengLocs = rengM[1] ? rengM[1].split(',').map(Number) : Array.from({ length: rengMult }, () => 1)
    if (rengLocs.length !== rengMult) throw new Error(`Los localizadores de «${rengM[0]}» no coinciden con el prefijo multiplicador.`)
    for (const rengL of rengLocs) rengOut.push({ nombre: rengM[3]!, loc: rengL })
    rengI = RENG_PREFIJO_RE.lastIndex
  }
  return rengOut
}

export function rengSmilesDesdeNombre(rengNombre: string): { smiles: string; nota: string | null } {
  const rengN = rengNormalizarNombre(rengNombre)
  const rengComun = RENG_COMUNES.find((rengC) => rengC.nombres.some((rengX) => rengNormalizarNombre(rengX) === rengN))
  if (rengComun) return { smiles: rengComun.smiles, nota: null }
  const rengSmiles = rengConstruir(rengN)
  let rengNota: string | null = null
  try {
    const rengCorrecto = rengNombrarOrganico(rengDesdeSmiles(rengSmiles)).nombre
    if (rengNormalizarNombre(rengCorrecto) !== rengN) rengNota = `El nombre IUPAC correcto es «${rengCorrecto}».`
  } catch {
    rengNota = null
  }
  return { smiles: rengSmiles, nota: rengNota }
}


const RENG_SUFIJO_RE = /(?:-([\d,]+)-)?(di|tri|tetra)?(nitrilo|amida|amina|oico|ona|ol|al|o)$/
const RENG_PRINCIPAL_DE: Record<string, RengPrincipal | null> = { nitrilo: 'nitrilo', amida: 'amida', amina: 'amina', oico: 'acido', ona: 'cetona', ol: 'alcohol', al: 'aldehido', o: null }
const rengLeerLocs = (rengS: string | undefined): number[] | null => (rengS ? rengS.split(',').map(Number) : null)

function rengConstruir(rengNombre: string): string {
  const rengEst = /^(.*)oato de (met|et|prop|but|pent|hex)ilo$/.exec(rengNombre)
  if (rengEst) {
    const rengAcido = rengConstruir(`acido ${rengEst[1]}oico`)
    if (!rengAcido.startsWith('C(=O)(O)')) throw new Error('No entiendo la parte ácida del éster.')
    return `C(=O)(O${'C'.repeat(RENG_RAIZ.indexOf(rengEst[2]!))})${rengAcido.slice('C(=O)(O)'.length)}`
  }
  let rengResto = rengNombre
  const rengEsAcido = rengResto.startsWith('acido ')
  if (rengEsAcido) rengResto = rengResto.slice(6)

  const rengBen = /^(.*?)(benceno|fenol|anilina|benzoico|benzaldehido)$/.exec(rengResto)
  if (rengBen) {
    const rengPadre = rengBen[2]!
    if ((rengPadre === 'benzoico') !== rengEsAcido) throw new Error('«benzoico» se usa con «ácido» delante: «ácido benzoico».')
    const rengSust = rengLeerPrefijos(rengBen[1]!)
    const rengAnillo = ['', '', '', '', '', '']
    const rengGrupoPadre: Record<string, string> = { fenol: 'O', anilina: 'N', benzoico: 'C(=O)O', benzaldehido: 'C=O' }
    if (rengPadre !== 'benceno') rengAnillo[0] = rengGrupoPadre[rengPadre]!
    if (rengPadre === 'benceno' && rengSust.length === 1 && !/^\d/.test(rengBen[1]!)) rengSust[0]!.loc = 1
    for (const rengS of rengSust) {
      if (rengS.loc < 1 || rengS.loc > 6) throw new Error(`Localizador ${rengS.loc} imposible en el benceno (van del 1 al 6).`)
      if (rengAnillo[rengS.loc - 1]) throw new Error(`El carbono ${rengS.loc} del anillo ya está ocupado.`)
      if (rengS.nombre === 'oxo') throw new Error('«oxo» no es posible en un anillo aromático.')
      rengAnillo[rengS.loc - 1] = RENG_PREF_SMILES[rengS.nombre]!
    }
    return rengAnillo.map((rengS, rengK) => `c${rengK === 0 || rengK === 5 ? '1' : ''}${rengS ? `(${rengS})` : ''}`).join('')
  }

  const rengCiclo = /^ciclo(prop|but|pent|hex|hept|oct|non|dec)ano$/.exec(rengResto)
  if (rengCiclo) {
    const rengK = RENG_RAIZ.indexOf(rengCiclo[1]!)
    return `C1${'C'.repeat(rengK - 1)}1`
  }

  const rengMs = RENG_SUFIJO_RE.exec(rengResto)
  if (!rengMs) throw new Error('No reconozco la terminación del nombre (-ano, -eno, -ino, -ol, -al, -ona, -oico, -amina, -amida, -nitrilo).')
  const rengPrincipal = RENG_PRINCIPAL_DE[rengMs[3]!]!
  if (rengEsAcido !== (rengPrincipal === 'acido')) throw new Error(rengEsAcido ? 'Un ácido carboxílico termina en «-oico».' : 'Los nombres en «-oico» llevan «ácido» delante.')
  const rengMultPG = rengMs[2] ? RENG_MULT.indexOf(rengMs[2]) : 1
  let rengLocsPG = rengLeerLocs(rengMs[1])
  let rengTallo = rengResto.slice(0, rengMs.index)
  const rengSufCompleto = `${rengMs[2] ?? ''}${rengMs[3]}`
  if (rengMs[3] !== 'o' && !/^[aeiou]/.test(rengSufCompleto) && rengTallo.endsWith('o')) rengTallo = rengTallo.slice(0, -1)
  const rengInsat: Array<{ orden: number; locs: number[] | null; mult: number }> = []
  for (;;) {
    const rengMu = /(?:-([\d,]+)-)?(di|tri)?(en|in)$/.exec(rengTallo)
    if (!rengMu) break
    rengInsat.unshift({ orden: rengMu[3] === 'en' ? 2 : 3, locs: rengLeerLocs(rengMu[1]), mult: rengMu[2] ? RENG_MULT.indexOf(rengMu[2]) : 1 })
    rengTallo = rengTallo.slice(0, rengMu.index)
  }
  if (!rengInsat.length) {
    if (!rengTallo.endsWith('an')) throw new Error('Falta la parte «-an-», «-en-» o «-in-» que indica el tipo de enlaces de la cadena.')
    rengTallo = rengTallo.slice(0, -2)
  }
  let rengN_ = 0
  let rengPrefijos: RengSust[] = []
  let rengOk = false
  for (let rengK = 10; rengK >= 1 && !rengOk; rengK--) {
    for (const rengR of [RENG_RAIZ[rengK]!, `${RENG_RAIZ[rengK]}a`]) {
      if (!rengTallo.endsWith(rengR)) continue
      try {
        rengPrefijos = rengLeerPrefijos(rengTallo.slice(0, rengTallo.length - rengR.length))
        rengN_ = rengK
        rengOk = true
        break
      } catch {
      }
    }
  }
  if (!rengOk) throw new Error('No reconozco la raíz de la cadena (met-, et-, prop-, but-, pent-, hex-, hept-, oct-, non-, dec-) o algún sustituyente.')
  const rengN = rengN_
  const rengTerminal = rengPrincipal !== null && RENG_TERMINAL.includes(rengPrincipal)
  if (rengPrincipal && !rengLocsPG) {
    if (rengTerminal) rengLocsPG = rengMultPG === 2 ? [1, rengN] : [1]
    else if (rengPrincipal === 'cetona' && (rengN === 3 || rengN === 4) && rengMultPG === 1) rengLocsPG = [2]
    else if (rengN <= 2 && rengMultPG === 1) rengLocsPG = [1]
    else throw new Error(`Falta el localizador del grupo: ¿en qué carbono está? (p. ej. «${rengTallo}an-2-${rengMs[3]}»).`)
  }
  if (rengLocsPG && rengLocsPG.length !== rengMultPG) throw new Error('El número de localizadores del grupo principal no coincide con di/tri.')
  const rengEnlaces = Array.from({ length: rengN }, () => 1)
  for (const rengU of rengInsat) {
    const rengLocs = rengU.locs ?? (rengU.mult === 1 && rengN <= 3 ? [1] : null)
    if (!rengLocs) throw new Error(`Falta el localizador del enlace ${rengU.orden === 2 ? 'doble' : 'triple'}: p. ej. «but-2-eno».`)
    if (rengLocs.length !== rengU.mult) throw new Error('El número de localizadores de los enlaces múltiples no coincide con di/tri.')
    for (const rengL of rengLocs) {
      if (rengL < 1 || rengL >= rengN) throw new Error(`Localizador ${rengL} imposible para un enlace en una cadena de ${rengN} C.`)
      rengEnlaces[rengL] = rengU.orden
    }
  }
  const rengRamas: string[][] = Array.from({ length: rengN + 1 }, () => [])
  const RENG_GRUPO: Record<RengPrincipal, string[]> = { acido: ['=O', 'O'], ester: ['=O', 'O'], amida: ['=O', 'N'], nitrilo: ['#N'], aldehido: ['=O'], cetona: ['=O'], alcohol: ['O'], amina: ['N'] }
  for (const rengL of rengLocsPG ?? []) {
    if (rengL < 1 || rengL > rengN) throw new Error(`Localizador ${rengL} imposible en una cadena de ${rengN} C.`)
    rengRamas[rengL]!.push(...RENG_GRUPO[rengPrincipal!])
  }
  for (const rengP of rengPrefijos) {
    if (rengP.loc < 1 || rengP.loc > rengN) throw new Error(`Localizador ${rengP.loc} imposible en una cadena de ${rengN} C.`)
    rengRamas[rengP.loc]!.push(RENG_PREF_SMILES[rengP.nombre]!)
  }
  let rengSmiles = ''
  for (let rengK = 1; rengK <= rengN; rengK++) {
    if (rengK > 1) rengSmiles += rengEnlaces[rengK - 1] === 2 ? '=' : rengEnlaces[rengK - 1] === 3 ? '#' : ''
    rengSmiles += `C${rengRamas[rengK]!.map((rengB) => `(${rengB})`).join('')}`
  }
  try {
    rengDesdeSmiles(rengSmiles)
  } catch (rengE) {
    throw new Error(`Ese nombre describe una estructura imposible. ${rengE instanceof Error ? rengE.message : ''}`)
  }
  return rengSmiles
}
