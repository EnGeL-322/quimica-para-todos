import { rengConvertir } from '../../src/renderer/lib/unidades'
import { RENG_ELEMENTOS, rengOcupacion, rengPorSimbolo, type RengElemento } from '../../src/renderer/modules/tabla-periodica/data'
import rengWikidata from '../../src/renderer/modules/tabla-periodica/datos-wikidata.json'
import { rengPropiedadesAdicionales } from '../../src/renderer/modules/tabla-periodica/propiedadesReferencia'
import { rengBiseccion } from '../../src/renderer/modules/simulador-quimica/aprender/n1/numericos'
import { rengLecturasAtomo } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/atomo'
import { rengLecturasGasIdeal } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/gas-ideal'
import { RENG_AE_KJ, RENG_EI_KJ, RENG_GRUPOS_REPRESENTATIVOS, RENG_RADIO_ION_PM, rengCaracterDe, rengLecturasTendencias } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/tendencias-periodicas'
import { rengAnalizarFormula, rengMasaMolarDe } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { rengEstadosOxidacion } from '../../src/renderer/modules/simulador-quimica/nucleo/oxidacion'
import { RENG_BLOQUE_P_TP, RENG_PARES_GRUPO_TP, RENG_PARES_PERIODO_TP, RENG_REPRESENTATIVOS_TP, RENG_TRIADAS_TP } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b03-comun'
import { RENG_BINARIOS_MAX_TP, RENG_OXIDOS_EO_TP, RENG_SALES_ALCALINAS_TP, RENG_SOCIOS_TP, RENG_TRIADAS_EN_TP } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b03-integradores'
import {
  RENG_ALCALINOS_EI_TP, RENG_ALCALINOS_TP, RENG_BLOQUE_COLUMNA_TP, RENG_BLOQUE_PERIODO_TP, RENG_COMPUESTOS_METALOIDE_TP, RENG_HASTA_P4_TP, RENG_INTERIORES_TP, RENG_METALES_ION_TP, RENG_NO_METALES_TP, RENG_OXIDOS_METAL_TP,
  RENG_OXIDOS_NO_METAL_TP, RENG_P_DESDE_3_TP, RENG_POSTERIORES_TP, RENG_SIN_GASES_TP
} from '../../src/renderer/modules/simulador-quimica/practicas-n1/b03-s01-s08'
import {
  RENG_ACTINIDOS_TP, RENG_ALCALINOTERREOS_TP, RENG_COMPUESTOS_TRANSICION_TP, RENG_DESPLAZAMIENTOS_TP, RENG_GASES_NOBLES_TP, RENG_HALOGENOS_TP, RENG_IONES_RADIO_TP, RENG_ISOELECTRONICOS_TP, RENG_LANTANIDOS_OXIDO_TP, RENG_LANTANIDOS_TP,
  RENG_MINERALES_TP, RENG_SALES_TP, rengSalTp
} from '../../src/renderer/modules/simulador-quimica/practicas-n1/b03-s09-s16'
import {
  RENG_ANALOGOS_TP, RENG_CON_AE_TP, RENG_CON_EI_TP, RENG_ENLACES_TP, RENG_EO_MAXIMO_TP, RENG_INTERPOLACIONES_TP, RENG_IONES_POLI_TP, RENG_MENOS_QUE_CLORO_TP, RENG_OXIDOS_BASICOS_TP, RENG_OXOACIDOS_TP, RENG_TRANSFERENCIAS_TP
} from '../../src/renderer/modules/simulador-quimica/practicas-n1/b03-s17-s23'
import type { RengSegundoMetodo } from './nivel1-comun'

type D = Readonly<Record<string, number>>
const NA = 6.02214076e23
const H = 6.62607015e-34
const C = 299792458
const eJ = rengConvertir(1, 'eV', 'J')
const el = (rengS: string): RengElemento => rengPorSimbolo.get(rengS)!
const Z = (rengS: string): number => el(rengS).z
const Ae = (rengS: string): number => el(rengS).masa
const mm = (rengF: string): number => rengMasaMolarDe(rengF)
const cnt = (rengF: string, rengEl: string): number => rengAnalizarFormula(rengF).atomos.get(rengEl) ?? 0
const en = (rengS: string): number => rengPropiedadesAdicionales(Z(rengS)).electronegatividad ?? Number.NaN
const esc = (rengS: string): Readonly<Record<string, number>> => rengLecturasTendencias({ periodo: el(rengS).periodo, columna: RENG_GRUPOS_REPRESENTATIVOS.indexOf(el(rengS).grupo!) + 1 }) as Readonly<Record<string, number>>
const rad = (rengS: string): number => esc(rengS).radio!
const ei = (rengS: string): number => (el(rengS).periodo === 1 ? RENG_EI_KJ[rengS]! : esc(rengS).ei!)
const val = (rengS: string): number => esc(rengS).valencia!
const at = (rengZ: number, rengN: number, rengQ = 0): Readonly<Record<string, number>> => rengLecturasAtomo({ Z: rengZ, N: rengN, q: rengQ }) as Readonly<Record<string, number>>
const enTabla = (rengPeriodo: number, rengGrupo: number): RengElemento => RENG_ELEMENTOS.find((rengE) => rengE.periodo === rengPeriodo && rengE.grupo === rengGrupo)!
const anio = (rengS: string): number => (rengWikidata.elementos as unknown as Array<{ z: number; anioDescubrimiento?: number }>).find((rengE) => rengE.z === Z(rengS))!.anioDescubrimiento!
const litros = (rengN: number, rengT = 273.15): number => rengBiseccion((rengV) => rengLecturasGasIdeal({ n: rengN, T: rengT, V: rengV, M: 28 }).P! - 101.325, 1e-6, 1e6)
const gasSiguiente = (rengZ: number): number => [2, 10, 18, 36, 54, 86, 118].find((rengG) => rengG >= rengZ)!
const esfera = (rengR: number): number => (4 / 3) * Math.PI * rengR ** 3
const rIon = (rengS: string): number => RENG_RADIO_ION_PM[rengS]![1]
const ocD = (rengS: string): number => (rengOcupacion(Z(rengS)).get('3d') ?? 0) + (rengOcupacion(Z(rengS)).get('4s') ?? 0)
const eoMetal = (rengM: string, rengF: string, rengA: string, rengQ: number): number => rengEstadosOxidacion(rengAnalizarFormula(rengF))?.get(rengM) ?? (cnt(rengF, rengA) * rengQ) / cnt(rengF, rengM)
const L = 'spdf'
const mcd = (rengA: number, rengB: number): number => (rengB === 0 ? rengA : mcd(rengB, rengA % rengB))
const prop = (rengS: string, rengP: string): number => (rengP === 'radio' ? rad(rengS) : ei(rengS))
const formulaCruzada = (rengM: string, rengQm: number, rengX: string, rengQx: number): string => { const g = mcd(rengQm, rengQx); const a = rengQx / g; const b = rengQm / g; return `${rengM}${a > 1 ? a : ''}${rengX}${b > 1 ? b : ''}` }
const oxidoEo = (rengM: string, rengEo: number): string => formulaCruzada(rengM, rengEo, 'O', 2)

export const RENG_SEGUNDOS_B03: Readonly<Record<string, RengSegundoMetodo>> = {
  'n1-b3-s1-p1': (d: D) => { const [a, , c] = RENG_TRIADAS_TP[d.i!]!; return Ae(a) + (Ae(c) - Ae(a)) / 2 },
  'n1-b3-s1-p2': (d: D) => anio(RENG_POSTERIORES_TP[d.i!]!) - 1869,
  'n1-b3-s1-p3': (d: D) => { const e = el(RENG_INTERIORES_TP[d.i!]!); const v = (enTabla(e.periodo - 1, e.grupo!).masa + enTabla(e.periodo + 1, e.grupo!).masa) / 2; const h = (RENG_ELEMENTOS[e.z - 2]!.masa + RENG_ELEMENTOS[e.z]!.masa) / 2; return (v + h) / 2 },
  'n1-b3-s2-p1': (d: D) => { const e = el(RENG_HASTA_P4_TP[d.i!]!); return enTabla(e.periodo + 1, e.grupo!).z },
  'n1-b3-s2-p2': (d: D) => { const e = el(RENG_SIN_GASES_TP[d.i!]!); return RENG_ELEMENTOS.filter((x) => x.periodo === e.periodo && x.z >= e.z).length },
  'n1-b3-s2-p3': (d: D) => { const e = el(RENG_P_DESDE_3_TP[d.i!]!); return enTabla(e.periodo, e.grupo!).z },
  'n1-b3-s3-p1': (d: D) => el(RENG_BLOQUE_P_TP[d.i!]!).grupo!,
  'n1-b3-s3-p2': (d: D) => val(RENG_BLOQUE_P_TP[d.i!]!),
  'n1-b3-s3-p3': (d: D) => RENG_ELEMENTOS.filter((x) => x.periodo >= d.x! && x.periodo <= d.y!).length,
  'n1-b3-s4-p1': (d: D) => { const l = L.indexOf(RENG_BLOQUE_PERIODO_TP[d.i!]![0]); let k = 0; for (let m = -l; m <= l; m++) k += 2; return k },
  'n1-b3-s4-p2': (d: D) => { const [b, n, k] = RENG_BLOQUE_COLUMNA_TP[d.i!]!; return enTabla(n, b === 'd' ? k + 2 : k + 12).z },
  'n1-b3-s4-p3': (d: D) => { const [b, n] = RENG_BLOQUE_PERIODO_TP[d.i!]!; const l = L.indexOf(b); const inicio = [1, 2, 4, 6][l]!; let k = 0; for (let p = inicio; p <= n; p++) for (let m = -l; m <= l; m++) k += 2; return k },
  'n1-b3-s5-p1': (d: D) => { const [s, q] = RENG_METALES_ION_TP[d.i!]!; return d.x! * (Z(s) - at(Z(s), 0, q).e!) },
  'n1-b3-s5-p2': (d: D) => { const [s, f] = RENG_OXIDOS_METAL_TP[d.i!]!; return (d.x! / mm(s) / cnt(f, s)) * mm(f) },
  'n1-b3-s5-p3': (d: D) => { const [s, q] = RENG_METALES_ION_TP[d.i!]!; return (d.x! / mm(s)) * at(Z(s), 0, q).carga! },
  'n1-b3-s6-p1': (d: D) => { const s = RENG_NO_METALES_TP[d.i!]!; return d.x! * (gasSiguiente(Z(s)) - Z(s)) },
  'n1-b3-s6-p2': (d: D) => { const s = RENG_NO_METALES_TP[d.i!]!; return (d.x! / mm(s)) * (gasSiguiente(Z(s)) - Z(s)) * mm('H') },
  'n1-b3-s6-p3': (d: D) => { const [s, f] = RENG_OXIDOS_NO_METAL_TP[d.i!]!; return (d.x! / mm(s) / cnt(f, s)) * mm(f) },
  'n1-b3-s7-p1': (d: D) => { const [s, f] = RENG_COMPUESTOS_METALOIDE_TP[d.i!]!; return (100 * cnt(f, s) * mm(s)) / mm(f) },
  'n1-b3-s7-p2': (d: D) => (d.x! * 1e22) / (d.y! * 1e6) / 1e16,
  'n1-b3-s7-p3': (d: D) => { const [s, f] = RENG_COMPUESTOS_METALOIDE_TP[d.i!]!; return ((d.x! * cnt(f, s) * mm(s)) / mm(f)) * (d.y! / 100) },
  'n1-b3-s8-p1': (d: D) => litros(d.x! / mm(RENG_ALCALINOS_TP[d.i!]!) / 2),
  'n1-b3-s8-p2': (d: D) => { const s = RENG_ALCALINOS_TP[d.i!]!; return (d.x! / mm(s)) * mm(`${s}OH`) },
  'n1-b3-s8-p3': (d: D) => { const s = RENG_ALCALINOS_EI_TP[d.i!]!; return (d.x! / mm(s)) * ei(s) },
  'n1-b3-s9-p1': (d: D) => { const s = RENG_ALCALINOTERREOS_TP[d.i!]!; return (d.x! / mm(s)) * mm(`${s}O`) },
  'n1-b3-s9-p2': (d: D) => litros(d.x! / mm(RENG_ALCALINOTERREOS_TP[d.i!]!)),
  'n1-b3-s9-p3': (d: D) => (d.x! / mm(RENG_ALCALINOTERREOS_TP[d.i!]!)) * 2 * eJ * NA,
  'n1-b3-s10-p1': (d: D) => { const [m, h] = RENG_SALES_TP[d.i!]!; const f = rengSalTp(m, h); return (((2 * d.x!) / mm(`${h}2`)) / cnt(f, h)) * mm(f) },
  'n1-b3-s10-p2': (d: D) => { const [a, b] = RENG_DESPLAZAMIENTOS_TP[d.i!]!; return (d.x! / mm(`${a}2`)) * mm(`${b}2`) },
  'n1-b3-s10-p3': (d: D) => { const s = RENG_HALOGENOS_TP[d.i!]!; return (d.x! / mm(s)) * RENG_AE_KJ[s]! },
  'n1-b3-s11-p1': (d: D) => litros(d.x! / mm(RENG_GASES_NOBLES_TP[d.i!]!)),
  'n1-b3-s11-p2': (d: D) => mm(RENG_GASES_NOBLES_TP[d.i!]!) / litros(1, d.x! + 273.15),
  'n1-b3-s11-p3': (d: D) => (d.x! / litros(1)) * RENG_EI_KJ[RENG_GASES_NOBLES_TP[d.i!]!]!,
  'n1-b3-s12-p1': (d: D) => { const [m, f, a, q] = RENG_COMPUESTOS_TRANSICION_TP[d.i!]!; return eoMetal(m, f, a, q) },
  'n1-b3-s12-p2': (d: D) => { const [s, f] = RENG_MINERALES_TP[d.i!]!; return (d.x! * cnt(f, s) * mm(s)) / mm(f) },
  'n1-b3-s12-p3': (d: D) => { const [m, f, a, q] = RENG_COMPUESTOS_TRANSICION_TP[d.i!]!; return ocD(m) - eoMetal(m, f, a, q) },
  'n1-b3-s13-p1': (d: D) => { const z = Z(RENG_LANTANIDOS_TP[d.i!]!); return at(z, 0, 3).e! },
  'n1-b3-s13-p2': (d: D) => { const o = rengOcupacion(Z(RENG_LANTANIDOS_TP[d.i!]!)); return (o.get('4f') ?? 0) + (o.get('5d') ?? 0) + (o.get('6s') ?? 0) - 3 },
  'n1-b3-s13-p3': (d: D) => { const s = RENG_LANTANIDOS_OXIDO_TP[d.i!]!; return (d.x! / mm(s) / 2) * mm(`${s}2O3`) },
  'n1-b3-s14-p1': (d: D) => { const [s, a] = RENG_ACTINIDOS_TP[d.i!]!; return at(Z(s), a - Z(s)).n! },
  'n1-b3-s14-p2': (d: D) => { const [s, a] = RENG_ACTINIDOS_TP[d.i!]!; let z = Z(s); let n = a - z; for (let k = 0; k < d.x!; k++) { z -= 2; n -= 2 } return at(z, n).p! },
  'n1-b3-s14-p3': (d: D) => { let z = Z(RENG_ACTINIDOS_TP[d.i!]![0]); for (let k = 0; k < d.x!; k++) z -= 2; for (let k = 0; k < d.y!; k++) z += 1; return z },
  'n1-b3-s15-p1': (d: D) => { const [a, b] = RENG_PARES_GRUPO_TP[d.i!]!; return rad(b) / rad(a) },
  'n1-b3-s15-p2': (d: D) => { const [a, b] = RENG_PARES_PERIODO_TP[d.i!]!; return esfera(rad(a)) / esfera(rad(b)) },
  'n1-b3-s15-p3': (d: D) => val(RENG_REPRESENTATIVOS_TP[d.i!]!),
  'n1-b3-s16-p1': (d: D) => { const s = RENG_IONES_RADIO_TP[d.i!]!; return 100 - ((rad(s) - rIon(s)) / rad(s)) * 100 },
  'n1-b3-s16-p2': (d: D) => { const [a, b] = RENG_ISOELECTRONICOS_TP[d.i!]!; return 1 / (rIon(b) / rIon(a)) },
  'n1-b3-s16-p3': (d: D) => { const s = RENG_IONES_RADIO_TP[d.i!]!; return (esfera(rIon(s)) / esfera(rad(s))) * 100 },
  'n1-b3-s17-p1': (d: D) => d.x! * ei(RENG_CON_EI_TP[d.i!]!),
  'n1-b3-s17-p2': (d: D) => rengConvertir((ei(RENG_CON_EI_TP[d.i!]!) * 1000) / NA, 'J', 'eV'),
  'n1-b3-s17-p3': (d: D) => ((H * C) / ((ei(RENG_CON_EI_TP[d.i!]!) * 1000) / NA)) * 1e9,
  'n1-b3-s18-p1': (d: D) => d.x! * RENG_AE_KJ[RENG_CON_AE_TP[d.i!]!]!,
  'n1-b3-s18-p2': (d: D) => { const [m, x] = RENG_TRANSFERENCIAS_TP[d.i!]!; return ei(m) - RENG_AE_KJ[x]! },
  'n1-b3-s18-p3': (d: D) => rengConvertir((RENG_AE_KJ[RENG_CON_AE_TP[d.i!]!]! * 1000) / NA, 'J', 'eV'),
  'n1-b3-s19-p1': (d: D) => { const [a, b] = RENG_ENLACES_TP[d.i!]!; return Math.max(en(a), en(b)) - Math.min(en(a), en(b)) },
  'n1-b3-s19-p2': (d: D) => { const [a, b] = RENG_ENLACES_TP[d.i!]!; const x = en(a) - en(b); return 100 - 100 / Math.E ** ((x * x) / 4) },
  'n1-b3-s19-p3': (d: D) => { const s = RENG_MENOS_QUE_CLORO_TP[d.i!]!; const dx = en('Cl') - en(s); return rengBiseccion((x) => en('Cl') - x - dx, 0, 4) },
  'n1-b3-s20-p1': (d: D) => { const [a, b] = RENG_PARES_GRUPO_TP[d.i!]!; return ei(a) / ei(b) },
  'n1-b3-s20-p2': (d: D) => d.y! + 1 - RENG_ELEMENTOS.filter((e) => e.z >= d.x! && e.z <= d.x! + d.y! && rengCaracterDe(e) !== 1).length,
  'n1-b3-s20-p3': (d: D) => { const [o, h, k] = RENG_OXIDOS_BASICOS_TP[d.i!]!; return (d.x! / mm(o)) * k * mm(h) },
  'n1-b3-s21-p1': (d: D) => val(RENG_EO_MAXIMO_TP[d.i!]!),
  'n1-b3-s21-p2': (d: D) => { const [f, x] = RENG_OXOACIDOS_TP[d.i!]!; return rengEstadosOxidacion(rengAnalizarFormula(f))?.get(x) ?? (2 * cnt(f, 'O') - cnt(f, 'H')) / cnt(f, x) },
  'n1-b3-s21-p3': (d: D) => { const [f, x, q] = RENG_IONES_POLI_TP[d.i!]!; return (q - (-2 * cnt(f, 'O') + cnt(f, 'H'))) / cnt(f, x) },
  'n1-b3-s22-p1': (d: D) => { const [a, b] = RENG_PARES_PERIODO_TP[d.i!]!; return rad(a) - rad(b) },
  'n1-b3-s22-p2': (d: D) => { const [a, b] = RENG_PARES_PERIODO_TP[d.i!]!; return (ei(b) / ei(a) - 1) * 100 },
  'n1-b3-s22-p3': (d: D) => { const [a, b] = RENG_PARES_PERIODO_TP[d.i!]!; return (rad(a) - rad(b)) / (val(b) - val(a)) },
  'n1-b3-s23-p1': (d: D) => { const [[a, , c], p] = RENG_INTERPOLACIONES_TP[d.i!]!; return prop(a, p) + (prop(c, p) - prop(a, p)) / 2 },
  'n1-b3-s23-p2': (d: D) => { const [[a, b, c], p] = RENG_INTERPOLACIONES_TP[d.i!]!; return Math.abs((prop(a, p) + prop(c, p)) / 2 / prop(b, p) - 1) * 100 },
  'n1-b3-s23-p3': (d: D) => { const [m, qm, x, qx] = RENG_ANALOGOS_TP[d.i!]!; return mm(formulaCruzada(m, qm, x, qx)) },
  'n1-b3-i1': (d: D) => { const [x, y] = RENG_BINARIOS_MAX_TP[d.i!]!; return val(x) / (gasSiguiente(Z(y)) - Z(y)) },
  'n1-b3-i2': (d: D) => { const s = RENG_IONES_RADIO_TP[d.i!]!; return Math.max(rad(s), rIon(s)) - Math.min(rad(s), rIon(s)) },
  'n1-b3-i3': (d: D) => { const s = RENG_CON_AE_TP[d.i!]!; return ei(s) - (ei(s) - RENG_AE_KJ[s]!) / 2 },
  'n1-b3-i4': (d: D) => { const [m, h] = RENG_SALES_ALCALINAS_TP[d.i!]!; return (d.x! / mm(m)) * mm(`${m}${h}`) },
  'n1-b3-i5': (d: D) => { const [m, eo] = RENG_OXIDOS_EO_TP[d.i!]!; const f = oxidoEo(m, eo); return (d.x! * cnt(f, m) * mm(m)) / mm(f) },
  'n1-b3-i6': (d: D) => { const [a, , c] = RENG_TRIADAS_EN_TP[d.i!]!; const s = en(RENG_SOCIOS_TP[d.j!]!); const m = en(a) + (en(c) - en(a)) / 2; return Math.max(s, m) - Math.min(s, m) }
}
