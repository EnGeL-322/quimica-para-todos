import { rengConvertir } from '../../src/renderer/lib/unidades'
import { rengPorSimbolo } from '../../src/renderer/modules/tabla-periodica/data'
import { rengBiseccion } from '../../src/renderer/modules/simulador-quimica/aprender/n1/numericos'
import { RENG_FARADAY } from '../../src/renderer/modules/simulador-quimica/datos/electroquimica'
import { rengLecturasCalorimetria } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/calorimetria'
import { rengLecturasElectrolisis } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/electrolisis'
import { rengAnalizarFormula } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { RENG_C_AGUA, RENG_R, rengCalorLiberado, rengConstanteDeG, rengEnergiaLibre, rengEntalpiaReaccion, rengEntropiaReaccion, rengVanTHoff } from '../../src/renderer/modules/simulador-quimica/nucleo/termoquimica'
import { RENG_ANODOS_TE, RENG_DEPOSITOS_TE, RENG_HIDROCARBUROS_TE, RENG_PARES_TE, RENG_REACCIONES_S_TE, RENG_REACCIONES_TE, RENG_SACRIFICIO_TE, RENG_SALES_DISOLUCION_TE } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b11-comun'
import type { RengSegundoMetodo } from './nivel1-comun'

type D = Readonly<Record<string, number>>
const C = RENG_C_AGUA
const F = RENG_FARADAY.valor
const R = RENG_R
const M = (rengF: string): number => [...rengAnalizarFormula(rengF).atomos.entries()].reduce((rengS, [rengEl, rengN]) => rengS + rengPorSimbolo.get(rengEl)!.masa * rengN, 0)
const bis = (rengF: (rengX: number) => number, rengA: number, rengB: number): number => rengBiseccion(rengF, rengA, rengB)
const suma = (rengL: readonly number[]): number => rengL.reduce((rengA, rengB) => rengA + rengB, 0)
const r2 = (rengX: number): number => Math.round(rengX * 100) / 100
const tf = (m1: number, c1: number, t1: number, m2: number, t2: number, k: number): number => rengLecturasCalorimetria({ m1, c1, T1: t1, m2, T2: t2, Ccal: k }).Tf!
const masa = (rengI: number, rengT: number, rengZ: number, rengM: number): number => rengLecturasElectrolisis({ I: rengI, t: rengT, z: rengZ, M: rengM, ef: 100 }).m!
const dhR = (rengI: number): number => rengEntalpiaReaccion(RENG_REACCIONES_TE[rengI]!.reaccion)
const nuC = (rengI: number): number => RENG_REACCIONES_TE[rengI]!.reaccion.reactivos[0]!.nu
const comb = (d: D, rengHf: number): number => { const rengH = RENG_HIDROCARBUROS_TE[d.i!]!; return suma([...Array(rengH.x).fill(-393.509), ...Array(rengH.y / 2).fill(-285.8)]) - rengHf }
const par = (a: number, b: number) => { const p = RENG_PARES_TE[a]!; const q = RENG_PARES_TE[b]!; return p.E > q.E ? { cat: p, an: q } : { cat: q, an: p } }
const nMin = (a: number, b: number): number => { let n = 1; while (n % a !== 0 || n % b !== 0) n++; return n }
const sacr = (d: D) => (d.a === RENG_SACRIFICIO_TE.length ? RENG_PARES_TE[0]! : RENG_SACRIFICIO_TE[d.a!]!)

export const RENG_SEGUNDOS_B11: Readonly<Record<string, RengSegundoMetodo>> = {
  'n1-b11-s1-p1': (d: D) => rengConvertir(d.m! * C * (rengConvertir(d.t1! + d.d!, '°C', 'K') - rengConvertir(d.t1!, '°C', 'K')), 'J', 'kJ'),
  'n1-b11-s1-p2': (d: D) => tf(d.m1!, C, d.t1!, d.m2!, d.t2!, 0),
  'n1-b11-s1-p3': (d: D) => bis((rengX) => tf(rengX, C, d.th!, d.m!, d.tc!, 0) - d.tf!, 1e-9, 1e7),
  'n1-b11-s2-p1': (d: D) => bis((rengK) => rengK * d.d! - rengConvertir(d.q!, 'kJ', 'J'), 0, 1e9),
  'n1-b11-s2-p2': (d: D) => rengLecturasCalorimetria({ m1: d.m!, c1: d.c!, T1: 50, m2: 100, T2: 20, Ccal: 0 }).C1!,
  'n1-b11-s2-p3': (d: D) => { const rengT = r2(tf(d.mh!, C, d.th!, d.mc!, d.tc!, d.k!)); return bis((rengK) => tf(d.mh!, C, d.th!, d.mc!, d.tc!, rengK) - rengT, 0, 1e5) },
  'n1-b11-s3-p1': (d: D) => bis((rengC) => d.m! * rengC * d.d! - d.q!, 0, 1000),
  'n1-b11-s3-p2': (d: D) => rengLecturasCalorimetria({ m1: d.m!, c1: d.c!, T1: 50, m2: 100, T2: 20, Ccal: 0 }).C1! * d.d!,
  'n1-b11-s3-p3': (d: D) => { const rengT = r2(tf(d.m1!, d.c!, d.t1!, d.m2!, d.t2!, 0)); return bis((rengC) => tf(d.m1!, rengC, d.t1!, d.m2!, d.t2!, 0) - rengT, 0.001, 100) },
  'n1-b11-s4-p1': (d: D) => -rengConvertir(2 * d.v! * C * d.d!, 'J', 'kJ') / (d.c! * rengConvertir(d.v!, 'mL', 'L')),
  'n1-b11-s4-p2': (d: D) => rengConvertir(d.mw! * C * d.d! + d.k! * d.d!, 'J', 'kJ') / d.ms!,
  'n1-b11-s4-p3': (d: D) => { const rengS = RENG_SALES_DISOLUCION_TE[d.s!]!; return (-rengS.signo * rengConvertir((d.mw! + d.ms!) * C * d.d!, 'J', 'kJ')) / (d.ms! / M(rengS.formula)) },
  'n1-b11-s5-p1': (d: D) => rengCalorLiberado(dhR(d.r!), nuC(d.r!), d.m! / M(RENG_REACCIONES_TE[d.r!]!.combustible)),
  'n1-b11-s5-p2': (d: D) => bis((rengX) => rengCalorLiberado(dhR(d.r!), nuC(d.r!), rengX / M(RENG_REACCIONES_TE[d.r!]!.combustible)) - d.q!, 0, 1e7),
  'n1-b11-s5-p3': (d: D) => bis((rengX) => rengCalorLiberado(dhR(d.r!), nuC(d.r!), rengX / M(RENG_REACCIONES_TE[d.r!]!.combustible)) * 1000 - d.mw! * 1000 * C * d.d!, 0, 1e8),
  'n1-b11-s6-p1': (d: D) => { const rengH = d.h!; const rengV = [rengH / 2, rengH + rengH, rengH + rengH + rengH, rengH / 3][d.k!]!; return d.inv === 1 ? 0 - rengV : rengV },
  'n1-b11-s6-p2': (d: D) => { const rengR = RENG_REACCIONES_TE[d.r!]!; return (dhR(d.r!) / rengR.nuProducto) * (d.m! / M(rengR.producto)) },
  'n1-b11-s6-p3': (d: D) => suma([...Array(d.c!).fill(d.hc!), ...Array(d.d!).fill(d.hd!)]) - suma([...Array(d.a!).fill(d.ha!), ...Array(d.b!).fill(0)]),
  'n1-b11-s7-p1': (d: D) => suma([d.h1!, -d.h2!]),
  'n1-b11-s7-p2': (d: D) => suma([...Array(d.a!).fill(d.h1!), ...Array(d.b!).fill(-d.h2!)]),
  'n1-b11-s7-p3': (d: D) => suma([d.h1!, d.h2!, d.h2!, -d.h3!]),
  'n1-b11-s8-p1': (d: D) => comb(d, d.hf!),
  'n1-b11-s8-p2': (d: D) => bis((rengX) => comb(d, rengX) - comb(d, d.hf!), -2000, 2000),
  'n1-b11-s8-p3': (d: D) => bis((rengX) => d.nz! * d.hz! - d.nx! * rengX - d.dh!, -1e5, 1e5),
  'n1-b11-s9-p1': (d: D) => suma([d.eaa!, d.ebb!]) - suma([d.eab!, d.eab!]),
  'n1-b11-s9-p2': (d: D) => suma([d.cc2!, d.hh!]) - suma([d.cc!, d.ch!, d.ch!]),
  'n1-b11-s9-p3': (d: D) => bis((rengX) => d.hh! + d.xx! - 2 * rengX - d.dh!, 0, 1e5),
  'n1-b11-s10-p1': (d: D) => rengVanTHoff(1, d.t1!, d.t1! + d.d!, d.ea!),
  'n1-b11-s10-p2': (d: D) => bis((rengE) => rengVanTHoff(1, d.t1!, d.t1! + d.d!, rengE) - d.r!, 0, 5000),
  'n1-b11-s10-p3': (d: D) => bis((rengT) => rengVanTHoff(1, d.t1!, rengT, d.ea!) - d.r!, d.t1!, 1e5),
  'n1-b11-s11-p1': (d: D) => rengEnergiaLibre(d.h!, d.s!, d.t!),
  'n1-b11-s11-p2': (d: D) => { const rengSg = d.sg === 1 ? -1 : 1; return bis((rengT) => rengEnergiaLibre(rengSg * d.h!, rengSg * d.s!, rengT), 1e-6, 1e6) },
  'n1-b11-s11-p3': (d: D) => { const rengRx = RENG_REACCIONES_S_TE[d.r!]!.reaccion; return rengEnergiaLibre(rengEntalpiaReaccion(rengRx), rengEntropiaReaccion(rengRx)!, d.t!) },
  'n1-b11-s12-p1': (d: D) => suma(Array(d.c!).fill(d.sc!)) - suma([...Array(d.a!).fill(d.sa!), ...Array(d.b!).fill(d.sb!)]),
  'n1-b11-s12-p2': (d: D) => rengConvertir(d.h!, 'kJ', 'J') / d.tb!,
  'n1-b11-s12-p3': (d: D) => { const rengRx = RENG_REACCIONES_S_TE[d.r!]!.reaccion; return rengEntropiaReaccion({ reactivos: rengRx.reactivos.map((rengT) => ({ ...rengT, nu: (rengT.nu * d.n!) / rengRx.productos[0]!.nu })), productos: rengRx.productos.map((rengT) => ({ ...rengT, nu: (rengT.nu * d.n!) / rengRx.productos[0]!.nu })) })! },
  'n1-b11-s13-p1': (d: D) => Math.log10(rengConstanteDeG(d.g!, d.t!)),
  'n1-b11-s13-p2': (d: D) => bis((rengG) => Math.log10(rengConstanteDeG(rengG, d.t!)) - Math.log10(d.km! * 10 ** d.ke!), -1e4, 1e4),
  'n1-b11-s13-p3': (d: D) => Math.log10(rengConstanteDeG(rengEnergiaLibre(d.h!, d.s!, d.t!), d.t!)),
  'n1-b11-s14-p1': (d: D) => Math.max(RENG_PARES_TE[d.a!]!.E, RENG_PARES_TE[d.b!]!.E) - Math.min(RENG_PARES_TE[d.a!]!.E, RENG_PARES_TE[d.b!]!.E),
  'n1-b11-s14-p2': (d: D) => { const rengP = par(d.a!, d.b!); return rengConvertir(-nMin(rengP.cat.z, rengP.an.z) * F * (rengP.cat.E - rengP.an.E), 'J', 'kJ') },
  'n1-b11-s14-p3': (d: D) => Math.log10(rengConstanteDeG((-d.n! * F * d.e!) / 1000, 298.15)),
  'n1-b11-s15-p1': (d: D) => { const rengA = RENG_ANODOS_TE[d.a!]!; return bis((rengX) => (rengX / M(rengA.metal)) * rengA.z - d.n!, 0, 1e5) },
  'n1-b11-s15-p2': (d: D) => { const rengC = RENG_DEPOSITOS_TE[d.c!]!; return masa(d.q! / 60, 1, rengC.z, M(rengC.metal)) },
  'n1-b11-s15-p3': (d: D) => { const rengA = RENG_ANODOS_TE[d.a!]!; const rengC = RENG_DEPOSITOS_TE[d.c!]!; const rengQ = (d.m! / M(rengA.metal)) * rengA.z * F; return masa(rengQ / 60, 1, rengC.z, M(rengC.metal)) },
  'n1-b11-s16-p1': (d: D) => rengConvertir(-((R * 298.15 * Math.LN10) / (2 * F)) * Math.log10(d.ca! / d.cc!), 'V', 'mV'),
  'n1-b11-s16-p2': (d: D) => rengConvertir(((R * 298.15 * Math.LN10) / (d.n! * F)) * Math.log10(d.cc! / (d.m! * 10 ** -d.ex!)), 'V', 'mV'),
  'n1-b11-s16-p3': (d: D) => bis((rengC) => d.e0! - ((R * 298.15) / (2 * F)) * Math.log(d.ca! / rengC) - (d.e0! - d.d!), 1e-15, 100) * 1000,
  'n1-b11-s17-p1': (d: D) => { const rengC = RENG_DEPOSITOS_TE[d.c!]!; return masa(d.i!, d.t!, rengC.z, M(rengC.metal)) },
  'n1-b11-s17-p2': (d: D) => { const rengC = RENG_DEPOSITOS_TE[d.c!]!; return bis((rengT) => masa(d.i!, rengT, rengC.z, M(rengC.metal)) - d.m!, 1e-9, 1e9) },
  'n1-b11-s17-p3': (d: D) => { const rengC = RENG_DEPOSITOS_TE[d.c!]!; return bis((rengI) => masa(rengI, d.t!, rengC.z, M(rengC.metal)) - d.m!, 1e-12, 1e6) },
  'n1-b11-s18-p1': (d: D) => { const rengP = RENG_PARES_TE[d.c!]!; return bis((rengT) => masa(1, rengT, rengP.z, M(rengP.metal)) - d.m!, 1e-9, 1e9) * 60 },
  'n1-b11-s18-p2': (d: D) => { const rengA = RENG_DEPOSITOS_TE[d.a!]!; const rengB = RENG_DEPOSITOS_TE[d.b!]!; const rengT = bis((rengX) => masa(1, rengX, rengA.z, M(rengA.metal)) - d.m!, 1e-9, 1e9); return masa(1, rengT, rengB.z, M(rengB.metal)) },
  'n1-b11-s18-p3': (d: D) => { const rengC = RENG_DEPOSITOS_TE[d.c!]!; const rengTeo = masa(d.i!, d.t!, rengC.z, M(rengC.metal)); return (Number(((rengTeo * d.ef!) / 100).toPrecision(4)) / rengTeo) * 100 },
  'n1-b11-s19-p1': (d: D) => masa(rengConvertir(d.i!, 'mA', 'A'), d.d! * 1440, 2, M('Fe')),
  'n1-b11-s19-p2': (d: D) => { const rengS = RENG_SACRIFICIO_TE[d.s!]!; return masa(rengConvertir(d.i!, 'mA', 'A'), d.d! * 1440, rengS.z, M(rengS.metal)) },
  'n1-b11-s19-p3': (d: D) => bis((rengI) => masa(rengConvertir(rengI, 'mA', 'A'), d.d! * 1440, 2, M('Fe')) - d.m!, 1e-9, 1e7),
  'n1-b11-s20-p1': (d: D) => rengConvertir(d.v! * d.ah! * rengConvertir(1, 'h', 's'), 'J', 'kJ'),
  'n1-b11-s20-p2': (d: D) => { const rengP = sacr(d); return masa(d.ah!, 60, rengP.z, M(rengP.metal)) },
  'n1-b11-s20-p3': (d: D) => bis((rengT) => masa(d.i!, rengT, 2, M('Zn')) - d.m!, 1e-9, 1e10) / 60,
  'n1-b11-i1': (d: D) => { const rengQ = rengCalorLiberado(dhR(d.r!), nuC(d.r!), d.m! / M(RENG_REACCIONES_TE[d.r!]!.combustible)) * 1000; return bis((rengDt) => d.mw! * C * rengDt - rengQ, 0, 1e5) },
  'n1-b11-i2': (d: D) => tf(d.m1!, d.c1!, d.t1!, d.m2!, d.t2!, d.k!),
  'n1-b11-i3': (d: D) => { const rengH = RENG_HIDROCARBUROS_TE[d.i!]!; const rengMm = suma([...Array(rengH.x).fill(12.011), ...Array(rengH.y).fill(1.008)]); return -(d.m! / rengMm) * comb(d, d.hf!) },
  'n1-b11-i4': (d: D) => { const rengP = par(d.a!, d.b!); return rengConvertir(rengP.cat.E - rengP.an.E - ((R * 298.15 * Math.LN10) / (2 * F)) * Math.log10(d.ca! / d.cc!), 'V', 'mV') },
  'n1-b11-i5': (d: D) => bis((rengT) => Math.log10(rengConstanteDeG(rengEnergiaLibre(d.h!, d.s!, rengT), rengT)) - d.lk!, 1, 1e5),
  'n1-b11-i6': (d: D) => (bis((rengT) => masa(1, rengT, 2, M('Cu')) - d.m!, 1e-9, 1e9) * 60 * d.v!) / 1000
}
