import { rengConvertir } from '../../src/renderer/lib/unidades'
import { rengPorSimbolo } from '../../src/renderer/modules/tabla-periodica/data'
import { rengBiseccion } from '../../src/renderer/modules/simulador-quimica/aprender/n1/numericos'
import { rengLecturasCalorimetria } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/calorimetria'
import { rengLecturasDensidad } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/densidad'
import { rengLecturasGasIdeal } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/gas-ideal'
import { rengAjustarEcuacion } from '../../src/renderer/modules/simulador-quimica/nucleo/ajuste'
import { rengAnalizarFormula, rengMasaMolarDe } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import {
  RENG_ANALITOS_FU, RENG_BINARIOS_FU, RENG_CARBONATOS_FU, RENG_COCIENTES_FU, RENG_FLOTANTES_FU, RENG_GASES_FU, RENG_LIQUIDOS_FU, RENG_LIQUIDOS_MOL_FU, RENG_METALES_FU, RENG_OXIDOS_FU,
  RENG_PARES_OXIDOS_FU, RENG_PRODUCTOS_FU, RENG_SUSTANCIAS_FU
} from '../../src/renderer/modules/simulador-quimica/practicas-n1/b01-comun'
import { RENG_COMBUSTIBLES_FU } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b01-s01-s08'
import { RENG_PUROS_FU } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b01-s09-s16'
import { RENG_ACIDOS_FU, RENG_MEDIDAS_CERO_FU, RENG_PARES_CIFRAS_FU, RENG_PARES_DECIMALES_FU } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b01-s17-s23'
import { RENG_HIDRATOS_NO } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b05-comun'
import type { RengSegundoMetodo } from './nivel1-comun'

type D = Readonly<Record<string, number>>
const R = 8.314462618
const NA = 6.02214076e23
const Ae = (rengEl: string): number => rengPorSimbolo.get(rengEl)!.masa
const mm = (rengF: string): number => rengMasaMolarDe(rengF)
const cnt = (rengF: string, rengEl: string): number => rengAnalizarFormula(rengF).atomos.get(rengEl) ?? 0
const tot = (rengF: string): number => [...rengAnalizarFormula(rengF).atomos.values()].reduce((rengA, rengB) => rengA + rengB, 0)
const r2 = (rengX: number): number => Math.round(rengX * 100) / 100
const rho = (rengM: number, rengV: number): number => rengLecturasDensidad({ m: rengM, V: rengV, rhoL: 1 }).rho!
const sig = (rengT: string): number => rengT.replace(',', '').replace(/^0+/, '').length
const dec = (rengT: string): number => rengT.split(',')[1]?.length ?? 0
const kj = (rengJ: number): number => rengConvertir(rengJ, 'J', 'kJ')
const miscibles = RENG_LIQUIDOS_FU.filter((rengL) => ['etanol', 'glicerina', 'acetona', 'ácido acético'].includes(rengL.n))
const capas = RENG_LIQUIDOS_FU.filter((rengL) => ['aceite de oliva', 'hexano', 'cloroformo', 'gasolina'].includes(rengL.n))
const capas2 = RENG_LIQUIDOS_FU.filter((rengL) => ['aceite de oliva', 'hexano', 'cloroformo', 'gasolina', 'mercurio'].includes(rengL.n))
const densos = [...RENG_METALES_FU, ...RENG_LIQUIDOS_FU]
const vGas = (rengN: number, rengT: number, rengP: number): number => rengBiseccion((rengV) => rengLecturasGasIdeal({ n: rengN, T: rengT, V: rengV, M: 28 }).P! - rengP, 0.01, 10000)

export const RENG_SEGUNDOS_B01: Readonly<Record<string, RengSegundoMetodo>> = {
  'n1-b1-s1-p1': (d: D) => { const [, f, el] = RENG_SUSTANCIAS_FU[d.i!]!; return (100 * cnt(f, el) * Ae(el)) / mm(f) },
  'n1-b1-s1-p2': (d: D) => { const [, f, el] = RENG_SUSTANCIAS_FU[d.i!]!; return (d.x! * cnt(f, el) * Ae(el)) / mm(f) },
  'n1-b1-s1-p3': (d: D) => { const [, f, el] = RENG_SUSTANCIAS_FU[d.i!]!; return (d.x! * mm(f)) / (cnt(f, el) * Ae(el)) },
  'n1-b1-s2-p1': (d: D) => { const o = RENG_OXIDOS_FU[d.i!]!; return (d.x! / Ae(o.metal) / cnt(o.oxido, o.metal)) * cnt(o.oxido, 'O') * Ae('O') },
  'n1-b1-s2-p2': (d: D) => { const [, f, el] = RENG_SUSTANCIAS_FU[d.i!]!; return (d.y! * cnt(f, el) * Ae(el)) / mm(f) },
  'n1-b1-s2-p3': (d: D) => { const p = RENG_PARES_OXIDOS_FU[d.i!]!; return (cnt(p.b, 'O') / cnt(p.b, p.x)) / (cnt(p.a, 'O') / cnt(p.a, p.x)) },
  'n1-b1-s3-p1': (d: D) => (d.x! - d.y! + d.x! + d.y! + d.x! - d.y! / 2 + d.x! + d.y! / 2) / 4,
  'n1-b1-s3-p2': (d: D) => { const m = RENG_METALES_FU[d.i!]!; const med = m.rho * (1 + (d.y === 1 ? 1 : -1) * (d.x! / 100)); return (100 * Math.abs(med - m.rho)) / m.rho },
  'n1-b1-s3-p3': (d: D) => { const l = RENG_LIQUIDOS_FU[d.i!]!; return (l.rho * (d.x! + 50) + 25 - (l.rho * d.x! + 25)) / 50 },
  'n1-b1-s4-p1': (d: D) => kj(d.x! * 4.184 * d.y!),
  'n1-b1-s4-p2': (d: D) => rengLecturasCalorimetria({ m1: d.x!, c1: 4.184, T1: 80, m2: d.y!, T2: 15, Ccal: 0 }).Tf!,
  'n1-b1-s4-p3': (d: D) => rengBiseccion((m) => m * 4.184 * d.y! - d.x! * 1000, 0, 1e7),
  'n1-b1-s5-p1': (d: D) => d.x! * d.x! * d.x!,
  'n1-b1-s5-p2': (d: D) => rho(RENG_METALES_FU[d.i!]!.rho * d.x!, d.x!),
  'n1-b1-s5-p3': (d: D) => rengBiseccion((m) => rho(m, d.x! ** 3) - RENG_METALES_FU[d.i!]!.rho, 0, 1e5),
  'n1-b1-s6-p1': (d: D) => kj(d.x! * 334),
  'n1-b1-s6-p2': (d: D) => kj(d.x! * 2260),
  'n1-b1-s6-p3': (d: D) => { const c = RENG_COMBUSTIBLES_FU[d.i!]!; const a = rengAjustarEcuacion(`${c.f} + O2 -> CO2 + H2O`); return (d.x! / mm(c.f) / a.reactivos[0]!.coef) * a.reactivos[1]!.coef * mm('O2') },
  'n1-b1-s7-p1': (d: D) => rengBiseccion((m) => m - d.x! - d.y!, 0, 1e5),
  'n1-b1-s7-p2': (d: D) => { const m = RENG_METALES_FU[d.i!]!; return rho(m.rho * d.y!, d.y!) },
  'n1-b1-s7-p3': (d: D) => { const l = miscibles[d.i!]!; return rengLecturasDensidad({ m: d.x! + d.y! * l.rho, V: d.x! + d.y!, rhoL: 1 }).rhoSI! },
  'n1-b1-s8-p1': (d: D) => vGas(1, d.x! + 273.15, d.y!),
  'n1-b1-s8-p2': (d: D) => { const g = RENG_GASES_FU[d.i!]!; return rengLecturasGasIdeal({ n: 1, T: d.x!, V: (R * d.x!) / d.y!, M: mm(g.f) }).rho! },
  'n1-b1-s8-p3': (d: D) => rengConvertir(((d.x! / mm('H2O')) * R * 373.15) / 101.325, 'L', 'mL') / d.x!,
  'n1-b1-s9-p1': (d: D) => kj(d.x! * 4.184 * (100 - d.y!) + d.x! * 2260),
  'n1-b1-s9-p2': (d: D) => { const c = RENG_CARBONATOS_FU[d.i!]!; return d.x! - (d.x! / mm(c.f)) * mm(c.oxido) },
  'n1-b1-s9-p3': (d: D) => { const h = RENG_HIDRATOS_NO[d.i!]!; const f = `${h.sal}·${h.agua}H2O`; return d.x! - (d.x! * h.agua * mm('H2O')) / mm(f) },
  'n1-b1-s10-p1': (d: D) => 100 - (100 * (d.x! - r2((d.x! * d.y!) / 100))) / d.x!,
  'n1-b1-s10-p2': (d: D) => d.x! - (d.x! * d.y!) / 100,
  'n1-b1-s10-p3': (d: D) => { const [, f] = RENG_PUROS_FU[d.i!]!; return (d.x! * d.y!) / 100 / mm(f) },
  'n1-b1-s11-p1': (d: D) => { const b = RENG_BINARIOS_FU[d.i!]!; return (d.x! * cnt(b.f, b.b) * Ae(b.b)) / (cnt(b.f, b.a) * Ae(b.a)) },
  'n1-b1-s11-p2': (d: D) => (d.x! * NA * tot(RENG_SUSTANCIAS_FU[d.i!]![1])) / 1e23,
  'n1-b1-s11-p3': (d: D) => { const [, f, el] = RENG_SUSTANCIAS_FU[d.i!]!; return (d.x! / mm(f)) * cnt(f, el) },
  'n1-b1-s12-p1': (d: D) => 100 - (100 * d.y!) / (d.x! + d.y!),
  'n1-b1-s12-p2': (d: D) => rengBiseccion((m) => (100 * m) / d.x! - d.y!, 0, 1e5),
  'n1-b1-s12-p3': (d: D) => d.x! / rengConvertir(d.y!, 'mL', 'L'),
  'n1-b1-s13-p1': (d: D) => d.x! * rengConvertir(d.y!, 'mL', 'L'),
  'n1-b1-s13-p2': (d: D) => 100 - (100 * r2((d.x! * d.y!) / 100)) / d.x!,
  'n1-b1-s13-p3': (d: D) => (r2((d.x! * 0.5 * d.y!) / 100) / d.x!) * 200,
  'n1-b1-s14-p1': (d: D) => { const l = capas[d.i!]!; return rengLecturasDensidad({ m: d.x! + d.y! * l.rho, V: d.x! + d.y!, rhoL: 1 }).rhoSI! },
  'n1-b1-s14-p2': (d: D) => { const f = RENG_FLOTANTES_FU[d.i!]!; return rengLecturasDensidad({ m: f.rho * 100, V: 100, rhoL: f.rhoL }).sumergido! },
  'n1-b1-s14-p3': (d: D) => { const l = capas2[d.i!]!; return rengBiseccion((m) => m + d.x! * l.rho - (d.y! + d.x! * l.rho), 0, 1e5) },
  'n1-b1-s15-p1': (d: D) => { const o = RENG_OXIDOS_FU[d.i!]!; return (d.x! / Ae(o.metal) / cnt(o.oxido, o.metal)) * mm(o.oxido) },
  'n1-b1-s15-p2': (d: D) => rengBiseccion((v) => rho(d.x!, v) - 0.917, d.x! * 0.5, d.x! * 2) - d.x!,
  'n1-b1-s15-p3': (d: D) => vGas(d.x! / Ae('C'), 298.15, 101.325),
  'n1-b1-s16-p1': (d: D) => rengConvertir(d.x!, 'km/h', 'm/s'),
  'n1-b1-s16-p2': (d: D) => rengConvertir(d.x!, 'L', 'mL') / rengConvertir(1, 'min', 's'),
  'n1-b1-s16-p3': (d: D) => rengConvertir(d.x!, 'm³', 'L'),
  'n1-b1-s17-p1': (d: D) => rengConvertir(d.x!, 'mg', 'g'),
  'n1-b1-s17-p2': (d: D) => rengConvertir(RENG_METALES_FU[d.i!]!.rho, 'g/cm³', 'kg/m³'),
  'n1-b1-s17-p3': (d: D) => rengConvertir(d.x! * 1e-6, 'g', 'mg'),
  'n1-b1-s18-p1': (d: D) => { const p = RENG_PRODUCTOS_FU[d.i!]!; return Math.floor(Math.log10(p.a * p.b)) + p.m + p.n },
  'n1-b1-s18-p2': (d: D) => { const p = RENG_COCIENTES_FU[d.i!]!; return Math.floor(Math.log10(p.a / p.b)) + p.m - p.n },
  'n1-b1-s18-p3': (d: D) => ((d.x! / mm(RENG_GASES_FU[d.i!]!.f)) * NA) / 1e22,
  'n1-b1-s19-p1': (d: D) => sig(RENG_MEDIDAS_CERO_FU[d.i!]!.t),
  'n1-b1-s19-p2': (d: D) => { const [a, b] = RENG_PARES_CIFRAS_FU[d.i!]!; return Math.min(sig(a.t), sig(b.t)) },
  'n1-b1-s19-p3': (d: D) => { const [a, b] = RENG_PARES_DECIMALES_FU[d.i!]!; return Math.min(dec(a.t), dec(b.t)) },
  'n1-b1-s20-p1': (d: D) => (rengConvertir(d.x!, 'mg', 'g') / rengConvertir(100, 'mL', 'L') / mm(RENG_ANALITOS_FU[d.i!]!.f)) * 1000,
  'n1-b1-s20-p2': (d: D) => rengConvertir(d.x! / mm(RENG_ANALITOS_FU[d.i!]!.f), 'mol', 'mmol'),
  'n1-b1-s20-p3': (d: D) => { const l = RENG_LIQUIDOS_MOL_FU[d.i!]!; return rengBiseccion((m) => rho(m, d.x!) - l.rho, 0, 1e5) / mm(l.f) },
  'n1-b1-s21-p1': (d: D) => rho(d.x!, d.y!),
  'n1-b1-s21-p2': (d: D) => rengBiseccion((v) => rho(d.x!, v) - densos[d.i!]!.rho, 1e-6, 1e6),
  'n1-b1-s21-p3': (d: D) => rengBiseccion((m) => rho(m, d.x!) - RENG_LIQUIDOS_FU[d.i!]!.rho, 0, 1e6),
  'n1-b1-s22-p1': (d: D) => rengConvertir(d.x!, '°C', 'K'),
  'n1-b1-s22-p2': (d: D) => rengConvertir(d.x!, '°F', '°C'),
  'n1-b1-s22-p3': (d: D) => rengLecturasGasIdeal({ n: 1, T: d.x! + 273.15, V: (R * 293.15) / d.y!, M: 28 }).P!,
  'n1-b1-s23-p1': (d: D) => rengBiseccion((v) => RENG_ACIDOS_FU[d.i!]!.c * v - d.y! * d.x!, 0, 1e5),
  'n1-b1-s23-p2': (d: D) => { const a = RENG_ACIDOS_FU.filter((rengA) => rengA.f !== 'C2H4O2')[d.i!]!; return rengConvertir(d.x!, 'mL', 'L') * d.y! * a.h * mm('NaHCO3') },
  'n1-b1-s23-p3': (d: D) => rengBiseccion((f) => d.x! / f - d.y!, 1, 1e4),
  'n1-b1-i1': (d: D) => rho(RENG_METALES_FU[d.i!]!.rho * d.a! ** 3, d.a! ** 3),
  'n1-b1-i2': (d: D) => rengConvertir(d.d! / d.v!, 'h', 's'),
  'n1-b1-i3': (d: D) => 100 - (100 * d.w!) / ((d.m! * d.p!) / 100 + d.w!),
  'n1-b1-i4': (d: D) => rengBiseccion((n) => rengLecturasGasIdeal({ n, T: d.t! + 273.15, V: d.V!, M: 28 }).P! - d.P!, 1e-6, 1e4),
  'n1-b1-i5': (d: D) => kj(d.m! * 334 + d.m! * 4.184 * d.t!),
  'n1-b1-i6': (d: D) => ((d.v! / mm('H2O')) * NA) / 1e23
}
