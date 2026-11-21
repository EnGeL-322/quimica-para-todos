import { rengConvertir } from '../../src/renderer/lib/unidades'
import { rengPorSimbolo } from '../../src/renderer/modules/tabla-periodica/data'
import { rengBiseccion } from '../../src/renderer/modules/simulador-quimica/aprender/n1/numericos'
import { rengValenciaDe } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/atomo'
import { rengLecturasCargaFormal } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/carga-formal'
import { rengLecturasVsepr } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/geometria-vsepr'
import { rengLecturasInteraccion } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/interaccion-molecular'
import { rengLecturasOrden } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/orden-enlace'
import { rengLecturasPolaridad } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/polaridad-enlace'
import { RENG_RADIO_ION_PM } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/tendencias-periodicas'
import { RENG_DIATOMICAS, RENG_ENERGIAS_INTERACCION, RENG_PARAMETRO_RED, rengEnergiaCoulombPar } from '../../src/renderer/modules/simulador-quimica/nucleo/datosEnlace'
import { rengCaracterIonico, rengElectronegatividad } from '../../src/renderer/modules/simulador-quimica/nucleo/electronegatividad'
import { rengAnalizarFormula, rengMasaMolarDe } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { RENG_REPRESENTATIVOS_TP } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b03-comun'
import {
  RENG_ANILLOS_EN, RENG_ATOMOS_CF_EN, RENG_ATOMOS_OCTETO_EN, RENG_CENTRALES_EN, RENG_CENTRALES_HASTA_4_EN, RENG_COMBUSTIBLES_EN, RENG_ENERGIA_MEDIA_EN, RENG_ENLACES_EN, RENG_ESPECIES_LEWIS_EN, RENG_FORMULAS_INSATURACION_EN, RENG_METALES_RED_EN,
  RENG_OM_EN, RENG_PARES_OM_EN, RENG_REACCIONES_EN, RENG_SIGMA_PI_EN, RENG_VSEPR_CON_PARES_EN, RENG_VSEPR_EN
} from '../../src/renderer/modules/simulador-quimica/practicas-n1/b04-comun'
import type { RengBalanceEn } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b04-comun'
import { RENG_ANGULARES_VSEPR_EN, RENG_CARGAS_MEDIAS_EN } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b04-integradores'
import {
  RENG_ACEPTORES_EN, RENG_CARGAS_EN, RENG_COMPARACIONES_IONICAS_EN, RENG_DADORES_EN, RENG_DIATOMICAS_EN, RENG_ESTRUCTURAS_CF_EN, RENG_EXPANDIDOS_EN, RENG_IONES_REPRESENTATIVOS_EN, RENG_LONGITUDES_EN, RENG_MOLECULAS_NEUTRAS_EN, RENG_PARES_IONICOS_EN,
  RENG_RESONANTES_EN
} from '../../src/renderer/modules/simulador-quimica/practicas-n1/b04-s01-s08'
import {
  RENG_ANGULARES_EN, RENG_ATOMOS_HIBRIDOS_EN, RENG_DESVIACIONES_EN, RENG_DIPOLOS_EN, RENG_FAMILIAS_EN, RENG_GEOMETRIAS_EN, RENG_HIBRIDOS_C_EN, RENG_UMBRALES_EN, RENG_VSEPR_3_4_EN
} from '../../src/renderer/modules/simulador-quimica/practicas-n1/b04-s09-s16'
import {
  RENG_APOLARES_EN, RENG_COCIENTES_VAP_EN, RENG_COMPARACIONES_EN, RENG_FUSIONES_EN, RENG_POLAR_APOLAR_EN, RENG_POZOS_EN, RENG_PUENTES_EN, RENG_SERIES_EBULLICION_EN, RENG_VAPORIZACION_EN, RENG_VAPORIZACION_POLARES_EN
} from '../../src/renderer/modules/simulador-quimica/practicas-n1/b04-s17-s22'
import type { RengSegundoMetodo } from './nivel1-comun'

type D = Readonly<Record<string, number>>
type L = Readonly<Record<string, number>>
const NA = 6.02214076e23
const EC = 1.602176634e-19
const DEBYE = 3.33564e-30
const Z = (rengS: string): number => rengPorSimbolo.get(rengS)!.z
const Ae = (rengS: string): number => rengPorSimbolo.get(rengS)!.masa
const mm = (rengF: string): number => rengMasaMolarDe(rengF)
const atomos = (rengF: string): Array<[string, number]> => [...rengAnalizarFormula(rengF).atomos.entries()]
const nAt = (rengF: string): number => atomos(rengF).reduce((a, [, n]) => a + n, 0)
const cnt = (rengF: string, rengS: string): number => rengAnalizarFormula(rengF).atomos.get(rengS) ?? 0
const val = (rengS: string): number => rengValenciaDe(Z(rengS))
const valTot = (rengF: string, rengQ = 0): number => atomos(rengF).reduce((a, [s, n]) => a + val(s) * n, 0) - rengQ
const elec = (rengF: string): number => atomos(rengF).reduce((a, [s, n]) => a + Z(s) * n, 0)
const octeto = (rengF: string, rengQ = 0): number => (8 * (nAt(rengF) - cnt(rengF, 'H')) + 2 * cnt(rengF, 'H') - valTot(rengF, rengQ)) / 2
const insat = (rengF: string): number => (2 * cnt(rengF, 'C') + 2 + cnt(rengF, 'N') - cnt(rengF, 'H') - ['F', 'Cl', 'Br', 'I'].reduce((a, h) => a + cnt(rengF, h), 0)) / 2
const cf = (rengV: number, rengL: number, rengB: number): L => rengLecturasCargaFormal({ V: rengV, L: rengL, B: rengB }) as L
const vs = (rengX: number, rengE: number): L => rengLecturasVsepr({ X: rengX, E: rengE }) as L
const oe = (rengB: number, rengA: number): number => rengLecturasOrden({ nb: rengB, na: rengA }).orden!
const chi = (rengS: string): number => rengElectronegatividad(rengS)!
const pol = (rengA: number, rengB: number): L => rengLecturasPolaridad({ chiA: rengA, chiB: rengB, d: 100 }) as L
const qi = (rengS: string): number => RENG_RADIO_ION_PM[rengS]![0]
const ri = (rengS: string): number => RENG_RADIO_ION_PM[rengS]![1]
const coul = (rengC: string, rengA: string): number => Math.abs(rengEnergiaCoulombPar(qi(rengC), qi(rengA), (ri(rengC) + ri(rengA)) / 100))
const dKj = (rengF: string): number => (rengConvertir(RENG_DIATOMICAS[rengF]!.D0, 'eV', 'J') * NA) / 1000
const pozo = (rengEps: number): number => -rengLecturasInteraccion({ eps: rengEps, rmin: 3.5, r: 3.5 }).E!
const kelvin = (rengT: number): number => rengConvertir(rengT, '°C', 'K')
const rad = (rengG: number): number => (rengG * Math.PI) / 180
const enlaces = (rengB: RengBalanceEn): number => { let s = 0; for (const [e, n] of rengB) for (let k = 0; k < Math.round(n * 2); k++) s += RENG_ENERGIA_MEDIA_EN[e]! / 2; return s }
const a0 = (rengS: string): number => RENG_PARAMETRO_RED[rengS]!.valor
const EH = RENG_ENERGIAS_INTERACCION.puenteH!.valor!
const EAR = RENG_ENERGIAS_INTERACCION.londonAr!.valor!
const fuertes = (): number[] => [RENG_ENERGIAS_INTERACCION.covalenteOH!.valor!, dKj('H2'), dKj('N2'), dKj('O2'), dKj('Cl2'), dKj('HCl'), coul('Na', 'Cl'), coul('Mg', 'O')]
const resultante = (rengM: number, rengT: number): number => Math.hypot(rengM * Math.cos(rad(rengT / 2)) + rengM * Math.cos(rad(-rengT / 2)), rengM * Math.sin(rad(rengT / 2)) + rengM * Math.sin(rad(-rengT / 2)))
const paresCentral = (rengS: string, rengX: number, rengQ: number): number => (val(rengS) - rengX - rengQ) / 2

export const RENG_SEGUNDOS_B04: Readonly<Record<string, RengSegundoMetodo>> = {
  'n1-b4-s1-p1': (d: D) => valTot(RENG_MOLECULAS_NEUTRAS_EN[d.i!]!),
  'n1-b4-s1-p2': (d: D) => { const [f, , q] = RENG_IONES_REPRESENTATIVOS_EN[d.i!]!; return valTot(f, q) },
  'n1-b4-s1-p3': (d: D) => { const v = val(RENG_REPRESENTATIVOS_TP[d.i!]!); const p = [0, 0, 0, 0]; for (let k = 0; k < v; k++) p[k % 4]! += 1; return p.filter((x) => x === 1).length },
  'n1-b4-s2-p1': (d: D) => { const [, v, l, b] = RENG_ATOMOS_OCTETO_EN[d.i!]!; return cf(v, l, b).alrededor! },
  'n1-b4-s2-p2': (d: D) => RENG_ESPECIES_LEWIS_EN[d.i!]![2],
  'n1-b4-s2-p3': (d: D) => { const [, x, e] = RENG_EXPANDIDOS_EN[d.i!]!; return cf(8, 2 * e, x).alrededor! },
  'n1-b4-s3-p1': (d: D) => { const [f, q] = RENG_ESPECIES_LEWIS_EN[d.i!]!; return valTot(f, q) / 2 - octeto(f, q) },
  'n1-b4-s3-p2': (d: D) => { const [f, , q] = RENG_IONES_REPRESENTATIVOS_EN[d.i!]!; return valTot(f, q) / 2 },
  'n1-b4-s3-p3': (d: D) => { const [f, , b] = RENG_ESPECIES_LEWIS_EN[d.i!]!; return b - (nAt(f) - 1) },
  'n1-b4-s4-p1': (d: D) => { const [, v, l, b] = RENG_ATOMOS_CF_EN[d.i!]!; return cf(v, l, b).cf! },
  'n1-b4-s4-p2': (d: D) => { for (let c = -12; c <= 12; c++) if (c + d.y! === d.x!) return c; return Number.NaN },
  'n1-b4-s4-p3': (d: D) => { const c = RENG_ESTRUCTURAS_CF_EN[d.i!]![1]; return c.filter((v) => v > 0).reduce((a, v) => a + v, 0) - c.filter((v) => v < 0).reduce((a, v) => a + v, 0) },
  'n1-b4-s5-p1': (d: D) => { const [, p, n] = RENG_RESONANTES_EN[d.i!]!; return 1 + (p - n) / n },
  'n1-b4-s5-p2': (d: D) => (2 * d.y! + (d.x! - d.y!)) / d.x!,
  'n1-b4-s5-p3': (d: D) => { const [, s, dd] = RENG_LONGITUDES_EN[d.i!]!; return dd + (2 - d.x!) * (s - dd) },
  'n1-b4-s6-p1': (d: D) => { const [c, a] = RENG_PARES_IONICOS_EN[d.i!]!; return coul(c, a) },
  'n1-b4-s6-p2': (d: D) => { const [c1, a1, c2, a2] = RENG_COMPARACIONES_IONICAS_EN[d.i!]!; return coul(c2, a2) / coul(c1, a1) },
  'n1-b4-s6-p3': (d: D) => { const [a, b] = RENG_CARGAS_EN[d.i!]!; return rengBiseccion((r) => Math.abs(rengEnergiaCoulombPar(a, -b, r)) - d.x!, 0.05, 200) },
  'n1-b4-s7-p1': (d: D) => d.x! * dKj(RENG_DIATOMICAS_EN[d.i!]!),
  'n1-b4-s7-p2': (d: D) => (d.x! * 1e22 * rengConvertir(RENG_DIATOMICAS[RENG_DIATOMICAS_EN[d.i!]!]!.D0, 'eV', 'J')) / 1000,
  'n1-b4-s7-p3': (d: D) => { const [, a, b] = RENG_REACCIONES_EN[d.i!]!; return enlaces(a) - enlaces(b) },
  'n1-b4-s8-p1': (d: D) => { const [, v, l, b] = RENG_DADORES_EN[d.i!]!; return cf(v, l - 2 * d.x!, b + d.x!).cf! },
  'n1-b4-s8-p2': (d: D) => { const [, c, , b] = RENG_ACEPTORES_EN[d.i!]!; return cf(c + b, 0, b + d.x!).cf! },
  'n1-b4-s8-p3': (d: D) => { const [, , , b] = RENG_ACEPTORES_EN[d.i!]!; return cf(8, 0, b + d.x!).alrededor! },
  'n1-b4-s9-p1': (d: D) => { const [s, n] = RENG_METALES_RED_EN[d.i!]!; return (d.x! * rengConvertir(n * Ae(s), 'u', 'g')) / (a0(s) * 1e-8) ** 3 },
  'n1-b4-s9-p2': (d: D) => { const [s, n] = RENG_METALES_RED_EN[d.i!]!; const r = n === 4 ? Math.sqrt(a0(s) ** 2 / 8) : Math.sqrt((3 * a0(s) ** 2) / 16); return d.x! * 1e6 * 2 * r * 1e-4 },
  'n1-b4-s9-p3': (d: D) => { const [s] = RENG_METALES_RED_EN[d.i!]!; return ((d.x! / mm(s)) * val(s) * NA) / 1e22 },
  'n1-b4-s10-p1': (d: D) => { const [a, b] = RENG_ENLACES_EN[d.i!]!; return pol(chi(a), chi(b)).dchi! },
  'n1-b4-s10-p2': (d: D) => rengBiseccion((x) => rengCaracterIonico(x) - d.x!, 0, 6),
  'n1-b4-s10-p3': (d: D) => { const [s, u] = RENG_UMBRALES_EN[d.i!]!; return rengBiseccion((c) => pol(c, chi(s)).dchi! - u, 0, chi(s)) },
  'n1-b4-s11-p1': (d: D) => ((d.x! / 100) * EC * d.y! * 1e-12) / DEBYE,
  'n1-b4-s11-p2': (d: D) => { const [, m, l] = RENG_DIPOLOS_EN[d.i!]!; return (m / ((EC * l * 1e-12) / DEBYE)) * 100 },
  'n1-b4-s11-p3': (d: D) => resultante(d.x!, RENG_ANGULARES_EN[d.i!]![1]),
  'n1-b4-s12-p1': (d: D) => { const [, l, t] = RENG_GEOMETRIAS_EN[d.i!]!; return Math.sqrt(2 * l * l * (1 - Math.cos(rad(t)))) },
  'n1-b4-s12-p2': (d: D) => { const [, i, r] = RENG_DESVIACIONES_EN[d.i!]!; return -(r - i) },
  'n1-b4-s12-p3': (d: D) => { const [, l, t] = RENG_GEOMETRIAS_EN[d.i!]!; const x = 2 * l * Math.sin(rad(t / 2)); return (Math.acos(1 - (x * x) / (2 * l * l)) * 180) / Math.PI },
  'n1-b4-s13-p1': (d: D) => { const [, x, e] = RENG_VSEPR_EN[d.i!]!; return vs(x, e).dominios! },
  'n1-b4-s13-p2': (d: D) => { const [, s, x, q] = RENG_CENTRALES_EN[d.i!]!; return paresCentral(s, x, q) },
  'n1-b4-s13-p3': (d: D) => { const [, x, e] = RENG_VSEPR_CON_PARES_EN[d.i!]!; return vs(x, e).angulo! },
  'n1-b4-s14-p1': (d: D) => { const [, x, e] = RENG_VSEPR_3_4_EN[d.i!]!; return 100 / vs(x, e).hibridos! },
  'n1-b4-s14-p2': (d: D) => { const [, f, , r] = RENG_HIBRIDOS_C_EN[d.i!]!; return 4 * cnt(f, 'C') - 2 * (insat(f) - r) },
  'n1-b4-s14-p3': (d: D) => vs(RENG_ATOMOS_HIBRIDOS_EN[d.i!]![1], 0).angulo!,
  'n1-b4-s15-p1': (d: D) => { const [, f, r] = RENG_SIGMA_PI_EN[d.i!]!; return nAt(f) - 1 + r },
  'n1-b4-s15-p2': (d: D) => d.x! - 1 + (2 * d.x! + 2),
  'n1-b4-s15-p3': (d: D) => { const [, h, r] = RENG_FAMILIAS_EN[d.i!]!; return d.x! - 1 + r + (2 * d.x! + h) },
  'n1-b4-s16-p1': (d: D) => { const [, f, r] = RENG_SIGMA_PI_EN[d.i!]!; return insat(f) - r },
  'n1-b4-s16-p2': (d: D) => { const f = RENG_FORMULAS_INSATURACION_EN[d.i!]!; const sat = 2 * cnt(f, 'C') + 2 + cnt(f, 'N'); const tiene = cnt(f, 'H') + ['F', 'Cl', 'Br', 'I'].reduce((a, h) => a + cnt(f, h), 0); return (sat - tiene) / 2 },
  'n1-b4-s16-p3': (d: D) => { const [, f, r] = RENG_ANILLOS_EN[d.i!]!; return octeto(f) - (nAt(f) - 1 + r) },
  'n1-b4-s17-p1': (d: D) => elec(RENG_APOLARES_EN[d.i!]!),
  'n1-b4-s17-p2': (d: D) => pozo(RENG_POZOS_EN[d.i!]![1]) * d.x!,
  'n1-b4-s17-p3': (d: D) => { const [, ta, , tb] = RENG_SERIES_EBULLICION_EN[d.i!]!; return kelvin(tb) - kelvin(ta) },
  'n1-b4-s18-p1': (d: D) => { const [, ta, , tb] = RENG_POLAR_APOLAR_EN[d.i!]!; return kelvin(tb) - kelvin(ta) },
  'n1-b4-s18-p2': (d: D) => { const [, ta, , tb] = RENG_POLAR_APOLAR_EN[d.i!]!; return kelvin(tb) / kelvin(ta) },
  'n1-b4-s18-p3': (d: D) => { const [, f, h] = RENG_VAPORIZACION_POLARES_EN[d.i!]!; return (d.x! / mm(f)) * h },
  'n1-b4-s19-p1': (d: D) => { const [, , dd, a] = RENG_PUENTES_EN[d.i!]!; let k = 0; for (let j = 0; j < dd; j++) k += 1; for (let j = 0; j < a; j++) k += 1; return k },
  'n1-b4-s19-p2': (d: D) => pozo(EH) * d.x!,
  'n1-b4-s19-p3': (d: D) => (4 * d.x! * NA) / 2 / 1e23,
  'n1-b4-s20-p1': (d: D) => { const [, f, h] = RENG_VAPORIZACION_EN[d.i!]!; return (d.x! / mm(f)) * h },
  'n1-b4-s20-p2': (d: D) => { const [i, j] = RENG_COCIENTES_VAP_EN[d.i!]!; return 1 / (RENG_VAPORIZACION_EN[j]![2] / RENG_VAPORIZACION_EN[i]![2]) },
  'n1-b4-s20-p3': (d: D) => { const [, , h, t] = RENG_VAPORIZACION_EN[d.i!]!; return rengConvertir(h, 'kJ', 'J') / kelvin(t) },
  'n1-b4-s21-p1': (d: D) => { const [i, j] = RENG_COMPARACIONES_EN[d.i!]!; return fuertes()[i]! / [EAR, EH][j]! },
  'n1-b4-s21-p2': (d: D) => { const [, f, a, b] = RENG_COMBUSTIBLES_EN[d.i!]!; return (d.x! / mm(f)) * (enlaces(b) - enlaces(a)) },
  'n1-b4-s21-p3': (d: D) => { const [, , ta, , , tb] = RENG_FUSIONES_EN[d.i!]!; return kelvin(ta) / kelvin(tb) },
  'n1-b4-s22-p1': (d: D) => { const [, b, a] = RENG_OM_EN[d.i!]!; return oe(b, a) },
  'n1-b4-s22-p2': (d: D) => { const [, b0, a00, , b1, a1] = RENG_PARES_OM_EN[d.i!]!; return oe(b1, a1) - oe(b0, a00) },
  'n1-b4-s22-p3': (d: D) => { const [, b, a] = RENG_OM_EN[d.i!]!; const n = b + a; const o = (b - a) / 2; for (let k = 0; k <= n; k++) if (oe(k, n - k) === o) return k; return Number.NaN },
  'n1-b4-i1': (d: D) => { const [f, q, b] = RENG_ESPECIES_LEWIS_EN[d.i!]!; return valTot(f, q) / 2 - b },
  'n1-b4-i2': (d: D) => { const [a, b] = RENG_ENLACES_EN[d.i!]!; return pol(chi(a), chi(b)).ionico! },
  'n1-b4-i3': (d: D) => { const [, q, n] = RENG_CARGAS_MEDIAS_EN[d.i!]!; const c = new Array<number>(n).fill(0); for (let k = 0; k < Math.abs(q); k++) c[k % n]! -= 1; return c.reduce((a, v) => a + v, 0) / n },
  'n1-b4-i4': (d: D) => { const [, x, e] = RENG_ANGULARES_VSEPR_EN[d.i!]!; return resultante(d.x!, vs(x, e).angulo!) },
  'n1-b4-i5': (d: D) => { const [, s, x, q] = RENG_CENTRALES_HASTA_4_EN[d.i!]!; return vs(x, paresCentral(s, x, q)).angulo! },
  'n1-b4-i6': (d: D) => { const [, f, , r] = RENG_HIBRIDOS_C_EN[d.i!]!; return insat(f) - r }
}
