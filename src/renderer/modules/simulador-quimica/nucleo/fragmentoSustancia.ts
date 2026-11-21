import { rengDetectarEnlaces, RENG_MOLECULAS } from '../chemistry'
import { rengEvaluarUnion, type RengTipoUnion } from './enlazar'
import { rengDescribirOptimizacion, rengDesdeSmiles, rengGeometria3D, type RengMoleculaGrafo } from './molecula'
import { rengRelajar } from './relajar'
import type { RengSustancia } from './sustancia'
import type { RengVec3 } from './mesa'

export const RENG_MAX_ATOMOS_MESA = 60

export interface RengFragmento {
  atomos: Array<{ el: string; carga: number; p: RengVec3 }>
  enlaces: Array<{ a: number; b: number; orden: number; tipo: RengTipoUnion; electrones: number }>
  origen: 'experimental' | 'calculada' | 'aproximada'
  nota?: string
  estereo?: { smiles: string; idSinEstereo: string }
}

export type RengResultadoFragmento = { ok: true; f: RengFragmento } | { ok: false; motivo: string }

const rengTipoDe = (rengA: string, rengB: string): RengTipoUnion => rengEvaluarUnion(rengA, rengB).tipo ?? 'covalente-polar'

function rengEnlacesIonicos(rengAtomos: RengFragmento['atomos']): RengFragmento['enlaces'] {
  const rengResto = rengAtomos.map((rengX) => rengX.carga)
  const rengOut: RengFragmento['enlaces'] = []
  rengAtomos.forEach((rengC, rengI) => {
    if (rengC.carga <= 0) return
    rengAtomos.forEach((rengAn, rengJ) => {
      if (rengResto[rengI]! <= 0 || rengResto[rengJ]! >= 0 || rengAn.carga >= 0) return
      const rengE = Math.min(rengResto[rengI]!, -rengResto[rengJ]!)
      rengOut.push({ a: rengI, b: rengJ, orden: 1, tipo: 'ionico', electrones: rengE })
      rengResto[rengI]! -= rengE
      rengResto[rengJ]! += rengE
    })
  })
  return rengOut
}

function rengColocar(rengAtomos: RengFragmento['atomos'], rengEnlaces: RengFragmento['enlaces']): RengFragmento['atomos'] {
  const rengIni = rengAtomos.map((_, rengI) => [Math.cos(rengI * 2.4) * (0.6 + rengI * 0.25), Math.sin(rengI * 2.4) * (0.6 + rengI * 0.25), ((rengI % 3) - 1) * 0.4] as const)
  const rengP = rengRelajar(rengIni, rengAtomos.map((rengX) => rengX.el), rengAtomos.map((rengX) => rengX.carga), rengEnlaces, { pasos: 250 })
  return rengAtomos.map((rengX, rengI) => ({ ...rengX, p: rengP[rengI]! }))
}

function rengDesdeGrafo(rengG: RengMoleculaGrafo, rengOrigen: RengFragmento['origen']): RengFragmento {
  const rengAtomos = rengG.atomos.map((rengA) => ({ el: rengA.el, carga: rengA.carga, p: [rengA.x, rengA.y, rengA.z] as RengVec3 }))
  const rengEnlaces: RengFragmento['enlaces'] = rengG.enlaces.map((rengE) => ({ a: rengE.a, b: rengE.b, orden: rengE.orden, tipo: rengTipoDe(rengG.atomos[rengE.a]!.el, rengG.atomos[rengE.b]!.el), electrones: 0 }))
  rengEnlaces.push(...rengEnlacesIonicos(rengAtomos))
  return { atomos: rengG.tiene3D ? rengAtomos : rengColocar(rengAtomos, rengEnlaces), enlaces: rengEnlaces, origen: rengOrigen }
}

export function rengFragmentoDe(rengS: RengSustancia): RengResultadoFragmento {
  const rengR = rengFragmentoSinEstereo(rengS)
  if (!rengR.ok || (rengS.grafo?.estereo !== 'definida' && rengS.grafo?.estereo !== 'parcial')) return rengR
  return { ok: true, f: { ...rengR.f, estereo: { smiles: rengS.grafo.smiles, idSinEstereo: rengS.grafo.idSinEstereo } } }
}

function rengFragmentoSinEstereo(rengS: RengSustancia): RengResultadoFragmento {
  if (rengS.idExperimental) {
    const rengM = RENG_MOLECULAS.find((rengX) => rengX.id === rengS.idExperimental)
    if (rengM) {
      const rengEnl = rengM.enlaces ?? rengDetectarEnlaces(rengM.atomos).map((rengE) => ({ ...rengE, orden: rengM.orden?.[`${Math.min(rengE.a, rengE.b)}-${Math.max(rengE.a, rengE.b)}`] ?? 1 }))
      return {
        ok: true,
        f: {
          atomos: rengM.atomos.map((rengA) => ({ el: rengA.el, carga: 0, p: rengA.p })),
          enlaces: rengEnl.map((rengE) => ({ a: rengE.a, b: rengE.b, orden: rengE.orden, tipo: rengTipoDe(rengM.atomos[rengE.a]!.el, rengM.atomos[rengE.b]!.el), electrones: 0 })),
          origen: 'experimental'
        }
      }
    }
  }
  if (rengS.smiles) {
    let rengG: RengMoleculaGrafo
    try {
      rengG = rengDesdeSmiles(rengS.smiles)
    } catch (rengE) {
      return { ok: false, motivo: rengE instanceof Error ? rengE.message : String(rengE) }
    }
    if (rengG.atomos.length > RENG_MAX_ATOMOS_MESA) return { ok: false, motivo: `Tiene ${rengG.atomos.length} átomos y la mesa admite hasta ${RENG_MAX_ATOMOS_MESA}: se ve en Información.` }
    try {
      const rengG3d = rengGeometria3D(rengS.smiles)
      if (!rengG3d.optimizacion?.convergio) return { ok: true, f: { ...rengDesdeGrafo(rengG3d, 'aproximada'), nota: rengDescribirOptimizacion(rengG3d.optimizacion) } }
      return { ok: true, f: rengDesdeGrafo(rengG3d, 'calculada') }
    } catch {
      return { ok: true, f: rengDesdeGrafo(rengG, 'aproximada') }
    }
  }
  if (rengS.tipo === 'elemento' && /^[A-Z][a-z]?$/.test(rengS.formula)) return { ok: true, f: { atomos: [{ el: rengS.formula, carga: 0, p: [0, 0, 0] }], enlaces: [], origen: 'aproximada' } }
  const rengK = rengS.inorganico
  if (rengK && rengK.cation && rengK.anion && rengK.carga === 0 && rengK.cation.tipo === 'metal' && /^[A-Z][a-z]?$/.test(rengK.anion.unidad) && /^[A-Z][a-z]?$/.test(rengK.cation.unidad)) {
    const rengQc = rengK.cation.carga
    const rengQa = rengK.anion.carga
    const rengAtomos: RengFragmento['atomos'] = [
      ...Array.from({ length: rengK.nCat }, () => ({ el: rengK.cation!.unidad, carga: rengQc, p: [0, 0, 0] as RengVec3 })),
      ...Array.from({ length: rengK.nAn }, () => ({ el: rengK.anion!.unidad, carga: rengQa, p: [0, 0, 0] as RengVec3 }))
    ]
    const rengEnlaces = rengEnlacesIonicos(rengAtomos)
    return { ok: true, f: { atomos: rengColocar(rengAtomos, rengEnlaces), enlaces: rengEnlaces, origen: 'aproximada' } }
  }
  const rengUf = rengK ? rengSmilesUnidadFormula(rengK) : null
  if (rengUf) {
    try {
      const rengF = rengDesdeGrafo(rengDesdeSmiles(rengUf), 'aproximada')
      return { ok: true, f: { ...rengF, nota: rengK!.cation && rengK!.anion && rengK!.cation.tipo !== 'hidrogeno' ? 'Se muestra la unidad fórmula (los iones que la forman); en el sólido hay una red de iones.' : undefined } }
    } catch (rengE) {
      return { ok: false, motivo: rengE instanceof Error ? rengE.message : String(rengE) }
    }
  }
  return { ok: false, motivo: 'Esta sustancia no se puede montar átomo a átomo en la mesa (todavía): la app no tiene la estructura de alguno de sus iones. Su ficha está en Información.' }
}

const RENG_ANION_SMILES: Record<string, string> = {
  OH: '[OH-]', O2: '[O-][O-]', ClO: '[O-]Cl', ClO2: '[O-]Cl=O', ClO3: '[O-]Cl(=O)=O', ClO4: '[O-]Cl(=O)(=O)=O', BrO3: '[O-]Br(=O)=O', IO3: '[O-]I(=O)=O',
  NO2: '[O-]N=O', NO3: '[O-][N+](=O)[O-]', SO3: '[O-]S(=O)[O-]', SO4: '[O-]S(=O)(=O)[O-]', PO4: '[O-]P(=O)([O-])[O-]', CO3: '[O-]C(=O)[O-]',
  HCO3: 'OC(=O)[O-]', HSO4: 'OS(=O)(=O)[O-]', HPO4: 'OP(=O)([O-])[O-]', H2PO4: 'OP(=O)(O)[O-]'
}
const RENG_CATION_SMILES: Record<string, string> = { NH4: '[NH4+]', H3O: '[OH3+]' }

const rengIonSimple = (rengEl: string, rengQ: number): string => `[${rengEl}${rengQ > 0 ? '+' : '-'}${Math.abs(rengQ) > 1 ? Math.abs(rengQ) : ''}]`

export function rengSmilesUnidadFormula(rengK: NonNullable<RengSustancia['inorganico']>): string | null {
  if (rengK.cation?.tipo === 'hidrogeno') return rengK.anion?.unidad === 'O2' && rengK.anion.tipo === 'peroxido' ? 'OO' : null
  const rengCat = rengK.cation ? (RENG_CATION_SMILES[rengK.cation.unidad] ?? (/^[A-Z][a-z]?$/.test(rengK.cation.unidad) ? rengIonSimple(rengK.cation.unidad, rengK.cation.carga) : null)) : ''
  const rengAn = rengK.anion ? (RENG_ANION_SMILES[rengK.anion.unidad] ?? (/^[A-Z][a-z]?$/.test(rengK.anion.unidad) ? rengIonSimple(rengK.anion.unidad, rengK.anion.carga) : null)) : ''
  if (rengCat === null || rengAn === null || (!rengCat && !rengAn)) return null
  const rengPartes = [...Array.from({ length: rengK.cation ? rengK.nCat : 0 }, () => rengCat), ...Array.from({ length: rengK.anion ? rengK.nAn : 0 }, () => rengAn), ...Array.from({ length: rengK.agua }, () => 'O')]
  return rengPartes.filter(Boolean).join('.')
}
