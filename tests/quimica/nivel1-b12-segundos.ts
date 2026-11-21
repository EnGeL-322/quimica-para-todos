import { rengPorSimbolo } from '../../src/renderer/modules/tabla-periodica/data'
import { rengLecturasCargaFormal } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/carga-formal'
import { rengLecturasPolimero } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/polimero'
import { rengAjustarEcuacion } from '../../src/renderer/modules/simulador-quimica/nucleo/ajuste'
import { rengMasaMolarDe } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { rengDesdeSmiles, type RengMoleculaGrafo } from '../../src/renderer/modules/simulador-quimica/nucleo/molecula'
import { rengGruposFuncionales, rengSmilesDesdeNombre } from '../../src/renderer/modules/simulador-quimica/nucleo/organica'
import { rengSemidesarrolladaASmiles } from '../../src/renderer/modules/simulador-quimica/nucleo/semidesarrollada'
import {
  RENG_ACIDOS_OR, RENG_ADICIONES_OR, RENG_ALCANOS_OR, RENG_ALCOHOLES_OR, RENG_ALDEHIDOS_OR, RENG_ALQUENOS_OR, RENG_ALQUINOS_OR, RENG_AMIDAS_OR, RENG_AMINAS_OR, RENG_AROMATICOS_OR, RENG_CETONAS_OR, RENG_CONDENSABLES_OR, RENG_DESHIDRATABLES_OR,
  RENG_ENTORNOS_OR, RENG_ESQUELETOS_OR, RENG_ESTERES_OR, RENG_ETERES_OR, RENG_ETERES_SIMETRICOS_OR, RENG_FAMILIAS_OR, RENG_HIDROCARBUROS_OR, RENG_INSATURADOS_OR, RENG_MOLECULAS_OR, RENG_MONOAMINAS_OR, RENG_MONOCLORADOS_OR, RENG_MONOMEROS_OR,
  RENG_NOMBRES_OR, RENG_OXIGENADOS_OR, RENG_PARES_ISOMEROS_OR, RENG_REACCIONES_OR, RENG_SEMI_OR
} from '../../src/renderer/modules/simulador-quimica/practicas-n1/b12-comun'
import { RENG_AMIDAS_DE_AMINA_OR } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b12-integradores'
import { RENG_CON_GI_OR, RENG_NO_GI1_OR, RENG_TIPOS_CADENA_OR } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b12-s01-s08'
import { RENG_PREGUNTAS_ISOMEROS } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b12-s09-s16'
import { RENG_NOMBRES_GI_OR } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b12-s17-s22'
import type { RengSegundoMetodo } from './nivel1-comun'

type D = Readonly<Record<string, number>>
type G = RengMoleculaGrafo
const A = (rengS: string): number => rengPorSimbolo.get(rengS)!.masa
const mm = rengMasaMolarDe
export const rengGrafoOr = (rengS: string): G => rengDesdeSmiles(rengS)
const g = rengGrafoOr
export const rengGrafoNombreOr = (rengN: string): G => g(rengSmilesDesdeNombre(rengN).smiles)
export const rengGrafoSemiOr = (rengT: string): G => { const rengS = rengSemidesarrolladaASmiles(rengT); if (!rengS) throw new Error(`No se pudo leer ${rengT}`); return g(rengS) }
const gN = rengGrafoNombreOr
const gS = rengGrafoSemiOr
export const rengCuentaOr = (rengM: G, rengEl: string): number => rengM.atomos.filter((rengA) => rengA.el === rengEl).length
const n = rengCuentaOr
export const rengMasaGrafoOr = (rengM: G): number => rengM.atomos.reduce((rengS, rengA) => rengS + A(rengA.el), 0)
const masa = rengMasaGrafoOr
const el = (rengM: G, rengI: number): string => rengM.atomos[rengI]!.el
const ordenes = (rengM: G): number => rengM.enlaces.reduce((rengS, rengE) => rengS + rengE.orden, 0)
export const rengEnlacesCCOr = (rengM: G, rengOrden?: number): number => rengM.enlaces.filter((rengE) => el(rengM, rengE.a) === 'C' && el(rengM, rengE.b) === 'C' && (rengOrden === undefined || rengE.orden === rengOrden)).length
const cc = rengEnlacesCCOr
const ordenesCC = (rengM: G): number => rengM.enlaces.filter((rengE) => el(rengM, rengE.a) === 'C' && el(rengM, rengE.b) === 'C').reduce((rengS, rengE) => rengS + rengE.orden, 0)
export const rengPiOr = (rengM: G): number => rengM.enlaces.reduce((rengS, rengE) => rengS + rengE.orden - 1, 0)
export const rengAnillosOr = (rengM: G): number => rengM.enlaces.length - rengM.atomos.length + 1
const pi = rengPiOr
const anillos = rengAnillosOr
const vecinosC = (rengM: G, rengI: number): number => rengM.enlaces.filter((rengE) => (rengE.a === rengI && el(rengM, rengE.b) === 'C') || (rengE.b === rengI && el(rengM, rengE.a) === 'C')).length
const primarios = (rengM: G): number => rengM.atomos.filter((rengA, rengI) => rengA.el === 'C' && vecinosC(rengM, rengI) === 1).length
const rep = (rengN: number): string => 'C'.repeat(Math.max(0, rengN))
export const rengPlantillaOr = (rengClave: string, rengC: number): string =>
  ({ alcohol: `${rep(rengC)}O`, eter: `${rep(rengC - 1)}OC`, aldehido: `${rep(rengC - 1)}C=O`, cetona: `CC(=O)${rep(rengC - 2)}`, acido: `${rep(rengC - 1)}C(=O)O`, ester: `${rep(rengC - 2)}C(=O)OC`, amina: `${rep(rengC)}N`, amida: `${rep(rengC - 1)}C(=O)N` })[rengClave]!
const plantilla = rengPlantillaOr
const grupos = (rengM: G, rengTipo: string): number => rengGruposFuncionales(rengM).filter((rengX) => rengX.tipo === rengTipo).length
const hLibres = (rengEnlaces: number): number => { for (let rengH = 0; rengH <= 4; rengH++) if (rengLecturasCargaFormal({ V: 4, L: 0, B: rengEnlaces + rengH }).cf === 0) return rengH; return Number.NaN }
const buscar = (rengDesde: number, rengHasta: number, rengOk: (rengK: number) => boolean): number => { for (let rengK = rengDesde; rengK <= rengHasta; rengK++) if (rengOk(rengK)) return rengK; return Number.NaN }
const cerca = (rengA: number, rengB: number): boolean => Math.abs(rengA - rengB) < 1e-6 * Math.max(1, Math.abs(rengB))
const mAlcano = (rengK: number): number => rengK * A('C') + (2 * rengK + 2) * A('H')
const o2 = (rengM: G): number => (2 * n(rengM, 'C') + n(rengM, 'H') / 2 - n(rengM, 'O')) / 2
const AGUA = (): number => masa(g('O'))
const CO2 = (): number => masa(g('O=C=O'))
const H2 = (): number => 2 * A('H')

const comb = (rengN: number, rengK: number): number => { let rengR = 1; for (let rengI = 1; rengI <= rengK; rengI++) rengR = (rengR * (rengN - rengK + rengI)) / rengI; return Math.round(rengR) }
const multis = (rengRad: readonly number[], rengTam: number, rengK: number, rengS: number): number => {
  if (rengTam === 0) return rengS === 0 ? 1 : 0
  let rengTotal = 0
  for (let rengJ = 0; rengJ <= rengK && rengJ * rengTam <= rengS; rengJ++) rengTotal += comb(rengRad[rengTam]! + rengJ - 1, rengJ) * multis(rengRad, rengTam - 1, rengK - rengJ, rengS - rengJ * rengTam)
  return rengTotal
}
export function rengIsomerosAlcanoOr(rengN: number): number {
  const rengRad: number[] = [1]
  for (let rengI = 1; rengI <= rengN; rengI++) rengRad.push(multis(rengRad, rengI - 1, 3, rengI - 1))
  const rengCentro = multis(rengRad, Math.floor((rengN - 1) / 2), 4, rengN - 1)
  const rengMitad = rengN % 2 === 0 ? rengRad[rengN / 2]! : 0
  return rengCentro + (rengMitad * (rengMitad + 1)) / 2
}
export function rengMonocloradosOr(rengSmiles: string): number {
  const rengIds = new Set<string>()
  for (let rengI = 0; rengI < rengSmiles.length; rengI++) {
    if (rengSmiles[rengI] !== 'C') continue
    let rengJ = rengI + 1
    while (rengJ < rengSmiles.length && /[0-9]/.test(rengSmiles[rengJ]!)) rengJ++
    try { rengIds.add(g(`${rengSmiles.slice(0, rengJ)}(Cl)${rengSmiles.slice(rengJ)}`).idSinEstereo) } catch { continue }
  }
  return rengIds.size
}

export const RENG_SEGUNDOS_B12: Readonly<Record<string, RengSegundoMetodo>> = {
  'n1-b12-s1-p1': (d: D) => ordenes(g(RENG_NO_GI1_OR[d.i!]![2])),
  'n1-b12-s1-p2': (d: D) => { const m = g(RENG_MOLECULAS_OR[d.i!]![2]); return (100 * n(m, 'C') * A('C')) / masa(m) },
  'n1-b12-s1-p3': (d: D) => { const m = g(RENG_MOLECULAS_OR[d.i!]![2]); return (d.x! / masa(m)) * n(m, 'C') * A('C') },
  'n1-b12-s2-p1': (d: D) => hLibres(RENG_ENTORNOS_OR[d.i!]![1]),
  'n1-b12-s2-p2': (d: D) => ordenesCC(g(RENG_HIDROCARBUROS_OR[d.i!]![2])),
  'n1-b12-s2-p3': (d: D) => buscar(1, 25, (k) => g(rep(k)).enlaces.length === 3 * d.x! + 1),
  'n1-b12-s3-p1': (d: D) => cc(g(RENG_TIPOS_CADENA_OR[d.i!]![1] === 1 ? `C1${rep(d.x! - 1)}1` : rep(d.x!))),
  'n1-b12-s3-p2': (d: D) => n(g(RENG_ESQUELETOS_OR[d.i!]![1]), 'H'),
  'n1-b12-s3-p3': (d: D) => primarios(g(`C${'C(C)'.repeat(d.x!)}${'C(C)(C)'.repeat(d.y!)}C`)),
  'n1-b12-s4-p1': (d: D) => n(gS(RENG_SEMI_OR[d.i!]![0]), 'H'),
  'n1-b12-s4-p2': (d: D) => masa(gS(RENG_SEMI_OR[d.i!]![0])),
  'n1-b12-s4-p3': (d: D) => gS(RENG_SEMI_OR[d.i!]![0]).enlaces.length,
  'n1-b12-s5-p1': (d: D) => { const m = g(RENG_CON_GI_OR[d.i!]![2]); return pi(m) + anillos(m) },
  'n1-b12-s5-p2': (d: D) => n(g(plantilla(RENG_FAMILIAS_OR[d.i!]!.clave, d.x!)), 'H'),
  'n1-b12-s5-p3': (d: D) => { const f = RENG_FAMILIAS_OR[d.i!]!; const objetivo = d.x! * (A('C') + 2 * A('H')) + f.hExtra * A('H') + f.O * A('O') + f.N * A('N'); return buscar(f.minC, 12, (k) => cerca(masa(g(plantilla(f.clave, k))), objetivo)) },
  'n1-b12-s6-p1': (d: D) => { const m = g(RENG_INSATURADOS_OR[d.i!]![2]); return 2 * (pi(m) + anillos(m)) },
  'n1-b12-s6-p2': (d: D) => d.x! * o2(g(RENG_HIDROCARBUROS_OR[d.i!]![2])),
  'n1-b12-s6-p3': (d: D) => { const m = g(RENG_HIDROCARBUROS_OR[d.i!]![2]); return (d.x! / masa(m)) * n(m, 'C') * CO2() },
  'n1-b12-s7-p1': (d: D) => n(gN(RENG_ALCANOS_OR[d.i!]![0]), 'H'),
  'n1-b12-s7-p2': (d: D) => masa(g(rep(d.x!))),
  'n1-b12-s7-p3': (d: D) => buscar(1, 25, (k) => cerca(masa(g(rep(k))), mAlcano(d.x!))),
  'n1-b12-s8-p1': (d: D) => n(gN(RENG_ALQUENOS_OR[d.i!]![0]), 'H'),
  'n1-b12-s8-p2': (d: D) => { const m = g(RENG_ALQUENOS_OR[d.i!]![2]); return (d.x! / masa(m)) * cc(m, 2) * H2() },
  'n1-b12-s8-p3': (d: D) => { const m = g(RENG_ALQUENOS_OR[d.i!]![2]); return d.x! + (d.x! / masa(m)) * cc(m, 2) * 2 * A('Br') },
  'n1-b12-s9-p1': (d: D) => n(gN(RENG_ALQUINOS_OR[d.i!]![0]), 'H'),
  'n1-b12-s9-p2': (d: D) => { const m = g(RENG_ALQUINOS_OR[d.i!]![2]); return (d.x! / masa(m)) * 2 * cc(m, 3) * H2() },
  'n1-b12-s9-p3': (d: D) => buscar(2, 25, (k) => cerca(masa(g(`C#C${rep(k - 2)}`)), mAlcano(d.x!) - 4 * A('H'))),
  'n1-b12-s10-p1': (d: D) => { const m = g(RENG_AROMATICOS_OR[d.i!]![2]); return pi(m) + anillos(m) },
  'n1-b12-s10-p2': (d: D) => { const m = g(RENG_AROMATICOS_OR[d.i!]![2]); return (100 * n(m, 'C') * A('C')) / masa(m) },
  'n1-b12-s10-p3': (d: D) => 2 * pi(g(RENG_AROMATICOS_OR[d.i!]![2])),
  'n1-b12-s11-p1': (d: D) => rengIsomerosAlcanoOr(d.x!) + RENG_PREGUNTAS_ISOMEROS[d.i!]![1],
  'n1-b12-s11-p2': (d: D) => masa(g(RENG_PARES_ISOMEROS_OR[d.i!]![4])),
  'n1-b12-s11-p3': (d: D) => rengMonocloradosOr(RENG_MONOCLORADOS_OR[d.i!]![2]),
  'n1-b12-s12-p1': (d: D) => d.x! / masa(g(RENG_ALCOHOLES_OR[d.i!]![2])),
  'n1-b12-s12-p2': (d: D) => d.x! * o2(g(RENG_ALCOHOLES_OR[d.i!]![2])),
  'n1-b12-s12-p3': (d: D) => { const m = g(RENG_DESHIDRATABLES_OR[d.i!]![2]); return d.x! - (d.x! / masa(m)) * AGUA() },
  'n1-b12-s13-p1': (d: D) => { const m = g(RENG_ETERES_OR[d.i!]![2]); return (d.x! * n(m, 'O') * A('O')) / masa(m) },
  'n1-b12-s13-p2': (d: D) => { const [, f, , fa] = RENG_ETERES_SIMETRICOS_OR[d.i!]!; return (d.x! / mm(f)) * (2 * mm(fa) - mm(f)) },
  'n1-b12-s13-p3': (d: D) => { const [, f] = RENG_ETERES_SIMETRICOS_OR[d.i!]!; return d.x! + (d.x! / mm(f)) * AGUA() },
  'n1-b12-s14-p1': (d: D) => n(g(plantilla('aldehido', d.x!)), 'H'),
  'n1-b12-s14-p2': (d: D) => { const m = g(RENG_ALDEHIDOS_OR[d.i!]![2]); return (d.x! / masa(m)) * masa(g(plantilla('acido', n(m, 'C')))) },
  'n1-b12-s14-p3': (d: D) => { const m = g(RENG_ALDEHIDOS_OR[d.i!]![2]); return (d.x! / masa(m)) * (masa(g(plantilla('alcohol', n(m, 'C')))) - masa(m)) },
  'n1-b12-s15-p1': (d: D) => buscar(3, 25, (k) => cerca(masa(g(plantilla('cetona', k))), d.x! * (A('C') + 2 * A('H')) + A('O'))),
  'n1-b12-s15-p2': (d: D) => { const c = RENG_CETONAS_OR[d.i!]!; return (d.x! / masa(g(c[5]))) * masa(g(c[2])) },
  'n1-b12-s15-p3': (d: D) => { const m = g(RENG_CETONAS_OR[d.i!]![2]); return (d.x! / masa(m)) * n(m, 'C') * CO2() },
  'n1-b12-s16-p1': (d: D) => { const m = g(RENG_ACIDOS_OR[d.i!]![2]); return (d.x! / masa(m)) * grupos(m, 'acido-carboxilico') * mm('NaOH') },
  'n1-b12-s16-p2': (d: D) => { const m = g(RENG_ACIDOS_OR[d.i!]![2]); return d.x! + (d.x! / masa(m)) * grupos(m, 'acido-carboxilico') * (mm('NaOH') - AGUA()) },
  'n1-b12-s16-p3': (d: D) => { const m = g(RENG_ACIDOS_OR[d.i!]![2]); return ((d.x! / masa(m)) * grupos(m, 'acido-carboxilico')) / (d.y! / 1000) },
  'n1-b12-s17-p1': (d: D) => masa(g(RENG_ESTERES_OR[d.i!]!.smiles)),
  'n1-b12-s17-p2': (d: D) => { const e = RENG_ESTERES_OR[d.i!]!; return (d.x! / masa(g(plantilla('acido', e.a)))) * masa(g(e.smiles)) },
  'n1-b12-s17-p3': (d: D) => { const e = RENG_ESTERES_OR[d.i!]!; return ((d.x! / masa(g(plantilla('acido', e.a)))) * masa(g(e.smiles)) * d.y!) / 100 },
  'n1-b12-s18-p1': (d: D) => { const m = g(RENG_MONOAMINAS_OR[d.i!]![2]); return vecinosC(m, m.atomos.findIndex((a) => a.el === 'N')) },
  'n1-b12-s18-p2': (d: D) => { const m = g(RENG_AMINAS_OR[d.i!]![2]); return (d.x! * n(m, 'N') * A('N')) / masa(m) },
  'n1-b12-s18-p3': (d: D) => { const m = g(RENG_AMINAS_OR[d.i!]![2]); return (d.x! / masa(m)) * n(m, 'N') * mm('HCl') },
  'n1-b12-s19-p1': (d: D) => masa(g(RENG_AMIDAS_OR[d.i!]!.smiles)),
  'n1-b12-s19-p2': (d: D) => { const a = RENG_AMIDAS_OR[d.i!]!; const m = masa(g(a.smiles)); return (d.x! / m) * (masa(g(plantilla('acido', a.a))) + masa(g(`N${rep(a.c)}`)) - m) },
  'n1-b12-s19-p3': (d: D) => { const a = RENG_AMIDAS_OR[d.i!]!; return (d.x! / masa(g(a.smiles))) * masa(g(plantilla('acido', a.a))) },
  'n1-b12-s20-p1': (d: D) => n(gN(RENG_NOMBRES_OR[d.i!]![0]), 'C'),
  'n1-b12-s20-p2': (d: D) => { const m = gN(RENG_NOMBRES_GI_OR[d.i!]![0]); return pi(m) + anillos(m) },
  'n1-b12-s20-p3': (d: D) => masa(gN(RENG_NOMBRES_OR[d.i!]![0])),
  'n1-b12-s21-p1': (d: D) => { const r = rengAjustarEcuacion(`${RENG_OXIGENADOS_OR[d.i!]![1]} + O2 -> CO2 + H2O`); return r.reactivos[1]!.coef / r.reactivos[0]!.coef },
  'n1-b12-s21-p2': (d: D) => { const [, f, , , , prod] = RENG_ADICIONES_OR[d.i!]!; return (d.x! / mm(f)) * masa(g(prod)) },
  'n1-b12-s21-p3': (d: D) => { const [, r, , s] = RENG_REACCIONES_OR[d.i!]!; return 100 - (100 * s[1] * mm(s[0])) / r.reduce((t, [f, k]) => t + k * mm(f), 0) },
  'n1-b12-s22-p1': (d: D) => rengLecturasPolimero({ m0: mm(RENG_MONOMEROS_OR[d.i!]![1]), n: d.x!, agua: 0 }).masa!,
  'n1-b12-s22-p2': (d: D) => { const m0 = mm(RENG_MONOMEROS_OR[d.i!]![1]); return buscar(1, 10, (k) => cerca(rengLecturasPolimero({ m0, n: 500 * k, agua: 0 }).masa!, d.x! * m0)) * 500 },
  'n1-b12-s22-p3': (d: D) => rengLecturasPolimero({ m0: mm(RENG_CONDENSABLES_OR[d.i!]![1]), n: d.x!, agua: 1 }).masa!,
  'n1-b12-i1': (d: D) => masa(g(`C${'C(C)'.repeat(d.y!)}${rep(d.x! - d.y! - 1)}`)),
  'n1-b12-i2': (d: D) => { const m = gS(RENG_SEMI_OR[d.i!]![0]); return (100 * n(m, 'H') * A('H')) / masa(m) },
  'n1-b12-i3': (d: D) => { const e = RENG_ESTERES_OR[d.i!]!; return ((d.x! / masa(g(plantilla('alcohol', e.b)))) * masa(g(e.smiles)) * d.y!) / 100 },
  'n1-b12-i4': (d: D) => { const a = RENG_AMIDAS_DE_AMINA_OR[d.i!]!; return (d.x! / masa(g(`N${rep(a.c)}`))) * masa(g(a.smiles)) },
  'n1-b12-i5': (d: D) => buscar(1, 12, (k) => { const m = g(rep(k)); return cerca((n(m, 'C') * CO2()) / ((n(m, 'H') / 2) * AGUA()), (d.x! * CO2()) / ((d.x! + 1) * AGUA())) }),
  'n1-b12-i6': (d: D) => (d.x! * 1e6) / rengLecturasPolimero({ m0: mm(RENG_MONOMEROS_OR[d.i!]![1]), n: d.y!, agua: 0 }).masa!
}
