import { rengConvertir } from '../../src/renderer/lib/unidades'
import { rengPorSimbolo } from '../../src/renderer/modules/tabla-periodica/data'
import { rengBiseccion } from '../../src/renderer/modules/simulador-quimica/aprender/n1/numericos'
import { rengConcentracionH } from '../../src/renderer/modules/simulador-quimica/nucleo/acidoBase'
import { rengGradoDisociacionDimero, rengKcDeKp } from '../../src/renderer/modules/simulador-quimica/nucleo/equilibrio'
import { rengDilucion, rengMolaridad } from '../../src/renderer/modules/simulador-quimica/nucleo/estequiometria'
import { rengAnalizarFormula } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { RENG_ADUCTOS_AB, RENG_COMPLEJOS_AB, RENG_HIDROXIDOS_1, RENG_HIDROXIDOS_2, RENG_POLIPROTICOS_AB, RENG_REACCIONES_KP_AB, RENG_SALES_AMORTIGUADOR_AB, RENG_SALES_MX2_AB } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b10-comun'
import type { RengSegundoMetodo } from './nivel1-comun'

type D = Readonly<Record<string, number>>
const KW = 1e-14
const R = 0.08314462618
const M = (rengF: string): number => [...rengAnalizarFormula(rengF).atomos.entries()].reduce((rengS, [rengEl, rengN]) => rengS + rengPorSimbolo.get(rengEl)!.masa * rengN, 0)
const bis = (rengF: (rengX: number) => number, rengA: number, rengB: number): number => rengBiseccion(rengF, rengA, rengB)
const ph = (rengH: number): number => -Math.log(rengH) / Math.LN10
const K = (d: D): number => d.km! * 10 ** -d.ke!
const C = (d: D): number => d.cm! * 10 ** -d.ce!
const xDebil = (rengK: number, rengC: number): number => bis((rengX) => (rengX * rengX) / (rengC - rengX) - rengK, 0, rengC * 0.999999)
const mL = (rengL: number): number => rengConvertir(rengL, 'L', 'mL')
const L = (rengMl: number): number => rengConvertir(rengMl, 'mL', 'L')
const qpAlfa = (rengKp: number, rengT: number, rengN0: number, rengV: number): number =>
  bis((rengA) => { const rengPA = (rengN0 * (1 - rengA) * R * rengT) / rengV; const rengPB = (2 * rengN0 * rengA * R * rengT) / rengV; return (rengPB * rengPB) / rengPA - rengKp }, 1e-12, 0.999999999)
const FV = [0.25, 0.5, 2, 4]

export const RENG_SEGUNDOS_B10: Readonly<Record<string, RengSegundoMetodo>> = {
  'n1-b10-s1-p1': (d: D) => rengConvertir(rengMolaridad(d.m! / M(RENG_HIDROXIDOS_1[d.h!]!), L(d.v!)), 'mol/L', 'mmol/L'),
  'n1-b10-s1-p2': (d: D) => 2 * rengConvertir(rengMolaridad(d.m! / M(RENG_HIDROXIDOS_2[d.h!]!), L(d.v!)), 'mol/L', 'mmol/L'),
  'n1-b10-s1-p3': (d: D) => ph(KW / (2 * rengMolaridad(d.m! / M(RENG_HIDROXIDOS_2[d.h!]!), L(d.v!)))),
  'n1-b10-s2-p1': (d: D) => ph(KW / 10 ** -d.p!),
  'n1-b10-s2-p2': (d: D) => ph(KW / K(d)),
  'n1-b10-s2-p3': (d: D) => { const rengR = 10 ** (d.h! - d.p!); return (100 * rengR) / (1 + rengR) },
  'n1-b10-s3-p1': (d: D) => { const rengA = RENG_ADUCTOS_AB[d.a!]!; return d.m! + (d.m! / M(rengA.base)) * M(rengA.acido) },
  'n1-b10-s3-p2': (d: D) => bis((rengX) => rengX / M('NH3') / RENG_COMPLEJOS_AB[d.c!]!.k - d.n!, 0, 1e4),
  'n1-b10-s3-p3': (d: D) => mL((d.n! * RENG_COMPLEJOS_AB[d.c!]!.k) / 1000 / d.cn!),
  'n1-b10-s4-p1': (d: D) => ph(rengConcentracionH(C(d), 1e6, 0, KW)),
  'n1-b10-s4-p2': (d: D) => ph(rengDilucion({ C1: d.c1!, V1: d.v1!, V2: d.v1! * [2, 5, 10, 20, 50, 100][d.f!]! }).C2),
  'n1-b10-s4-p3': (d: D) => { const rengV = d.v1! + d.v2!; return ph(rengDilucion({ C1: d.c1!, V1: d.v1!, V2: rengV }).C2 + rengDilucion({ C1: d.c2!, V1: d.v2!, V2: rengV }).C2) },
  'n1-b10-s5-p1': (d: D) => ph(xDebil(K(d), d.c!)),
  'n1-b10-s5-p2': (d: D) => (100 * xDebil(K(d), d.c!)) / d.c!,
  'n1-b10-s5-p3': (d: D) => ph(xDebil(K(d), d.c!)),
  'n1-b10-s6-p1': (d: D) => ph(KW / C(d)),
  'n1-b10-s6-p2': (d: D) => ph(KW / (2 * C(d))),
  'n1-b10-s6-p3': (d: D) => ph(KW / rengMolaridad(d.m! / M(RENG_HIDROXIDOS_1[d.h!]!), L(d.v!))),
  'n1-b10-s7-p1': (d: D) => ph(KW / xDebil(K(d), d.c!)),
  'n1-b10-s7-p2': (d: D) => ph(KW / xDebil(KW / 10 ** -d.p!, d.c!)),
  'n1-b10-s7-p3': (d: D) => (100 * xDebil(K(d), d.c!)) / d.c!,
  'n1-b10-s8-p1': (d: D) => ph(bis((rengX) => rengX * rengX - d.m! * 1e-14, 0, 1e-5)),
  'n1-b10-s8-p2': (d: D) => rengConvertir(bis((rengX) => rengX * rengX - d.m! * 1e-14, 0, 1e-5), 'mol/L', 'nmol/L'),
  'n1-b10-s8-p3': (d: D) => ph(rengConcentracionH(C(d), 1e6, 0, KW)),
  'n1-b10-s9-p1': (d: D) => -Math.log(C(d)) / Math.LN10,
  'n1-b10-s9-p2': (d: D) => rengConvertir(Math.exp(-d.h! * Math.LN10), 'mol/L', 'µmol/L'),
  'n1-b10-s9-p3': (d: D) => 10 ** -d.h1! / 10 ** -(d.h1! + d.d!),
  'n1-b10-s10-p1': (d: D) => d.ce! - Math.log10(d.cm!),
  'n1-b10-s10-p2': (d: D) => ph(KW / 10 ** -d.h!),
  'n1-b10-s10-p3': (d: D) => rengConvertir(KW / 10 ** -d.h!, 'mol/L', 'mmol/L'),
  'n1-b10-s11-p1': (d: D) => rengConvertir(10 ** -(14 - ph(C(d))), 'mol/L', 'nmol/L'),
  'n1-b10-s11-p2': (d: D) => ph(d.m! * 1e-14) - ph(C(d)),
  'n1-b10-s11-p3': (d: D) => ph((10 ** -d.h!) ** 2),
  'n1-b10-s12-p1': (d: D) => -Math.log(K(d)) / Math.LN10,
  'n1-b10-s12-p2': (d: D) => ph(bis((rengK) => (-rengK + Math.sqrt(rengK * rengK + 4 * rengK * d.c!)) / 2 - 10 ** -d.h!, 1e-14, 10)),
  'n1-b10-s12-p3': (d: D) => ph(bis((rengK) => (-rengK + Math.sqrt(rengK * rengK + 4 * rengK * d.c!)) / 2 / d.c! - d.a! / 100, 1e-14, 100)),
  'n1-b10-s13-p1': (d: D) => ph(KW / K(d)),
  'n1-b10-s13-p2': (d: D) => ph(bis((rengK) => (-rengK + Math.sqrt(rengK * rengK + 4 * rengK * d.c!)) / 2 - 10 ** (d.h! - 14), 1e-14, 10)),
  'n1-b10-s13-p3': (d: D) => 14 - ph(bis((rengK) => (-rengK + Math.sqrt(rengK * rengK + 4 * rengK * d.c!)) / 2 - 10 ** (d.h! - 14), 1e-14, 10)),
  'n1-b10-s14-p1': (d: D) => mL((L(d.va!) * d.ca! * RENG_POLIPROTICOS_AB[d.a!]!.eq) / d.cb!),
  'n1-b10-s14-p2': (d: D) => { const rengV = d.va! + d.vb!; return ph(rengConcentracionH((d.ca! * d.va!) / rengV, 1e6, (d.cb! * d.vb!) / rengV, KW)) },
  'n1-b10-s14-p3': (d: D) => { const rengVb = (d.ca! * d.va!) / d.cb!; const rengC = (d.ca! * d.va!) / (d.va! + rengVb); return ph(KW / xDebil(KW / 10 ** -d.p!, rengC)) },
  'n1-b10-s15-p1': (d: D) => { const rengR = 10 ** (d.h! - d.k!); return (100 * rengR) / (1 + rengR) },
  'n1-b10-s15-p2': (d: D) => bis((rengP) => 100 / (1 + 10 ** (d.k! - rengP)) - d.f!, -5, 20),
  'n1-b10-s15-p3': (d: D) => { const rengF = 1 / (1 + 10 ** -d.d!); return rengF / (1 - rengF) },
  'n1-b10-s16-p1': (d: D) => ph(KW / xDebil(KW / K(d), d.c!)),
  'n1-b10-s16-p2': (d: D) => ph(xDebil(KW / K(d), d.c!)),
  'n1-b10-s16-p3': (d: D) => bis((rengP) => ph(KW / xDebil(KW / 10 ** -rengP, d.c!)) - d.h!, 0, 14),
  'n1-b10-s17-p1': (d: D) => ph((10 ** -d.p! * d.ca!) / d.cs!),
  'n1-b10-s17-p2': (d: D) => ph((10 ** -d.p! * (d.na! - d.n!)) / (d.ns! + d.n!)),
  'n1-b10-s17-p3': (d: D) => { const rengS = RENG_SALES_AMORTIGUADOR_AB[d.s!]!; return bis((rengM) => Math.log10(rengM / M(rengS.formula) / (d.c! * d.v!)) - d.d!, 1e-9, 1e5) },
  'n1-b10-s18-p1': (d: D) => bis((rengX) => (rengX * (d.cs! + rengX)) / (d.c! - rengX) - K(d), 0, d.c! * 0.999999) * 1e6,
  'n1-b10-s18-p2': (d: D) => bis((rengS) => rengS * (C(d) + rengS) - K(d), 0, 1) * 1e6,
  'n1-b10-s18-p3': (d: D) => {
    let rengS = Math.sqrt(K(d) / (4 * C(d)))
    for (let rengI = 0; rengI < 60; rengI++) rengS -= ((C(d) + rengS) * 4 * rengS * rengS - K(d)) / (4 * rengS * rengS + 8 * rengS * (C(d) + rengS))
    return rengS * 1e6
  },
  'n1-b10-s19-p1': (d: D) => 10 ** (Math.log10(d.c!) - Math.log10(d.a!) - Math.log10(d.b!)),
  'n1-b10-s19-p2': (d: D) => bis((rengK) => 2 * d.c0! * rengGradoDisociacionDimero(d.c0!, rengK) - d.f! * d.c0!, 1e-9, 1e6),
  'n1-b10-s19-p3': (d: D) => 2 * bis((rengX) => (4 * rengX * rengX) / (d.c0! - rengX) - d.k!, 0, d.c0! * 0.999999) * 1000,
  'n1-b10-s20-p1': (d: D) => bis((rengKp) => rengKcDeKp(rengKp, d.t!, 1) - d.k!, 0, 1e6),
  'n1-b10-s20-p2': (d: D) => bis((rengKp) => rengKcDeKp(rengKp, d.t!, RENG_REACCIONES_KP_AB[d.r!]!.dn) - d.k!, 1e-9, 1e9),
  'n1-b10-s20-p3': (d: D) => 100 * qpAlfa(d.kp!, d.t!, d.n0!, d.v!),
  'n1-b10-s21-p1': (d: D) => 100 * qpAlfa(d.kp!, 298, d.n0!, d.v1! * FV[d.f!]!),
  'n1-b10-s21-p2': (d: D) => { const rengK = (d.b! * d.b!) / d.a!; const rengY = bis((rengY0) => (d.b! + d.d! - 2 * rengY0) ** 2 / (d.a! + rengY0) - rengK, 0, ((d.b! + d.d!) / 2) * 0.999999); return (d.b! + d.d! - 2 * rengY) * 1000 },
  'n1-b10-s21-p3': (d: D) => { const rengF = [2, 3, 4][d.f!]!; return (d.b! / rengF) ** 2 / (d.a! / rengF) },
  'n1-b10-s22-p1': (d: D) => bis((rengS) => rengS * rengS - K(d), 0, 1) * 1e6,
  'n1-b10-s22-p2': (d: D) => bis((rengS) => 4 * rengS ** 3 - K(d), 0, 1) * 1e6,
  'n1-b10-s22-p3': (d: D) => ph(4 * rengMolaridad(d.g! / M(RENG_SALES_MX2_AB[d.f!]!), 1) ** 3),
  'n1-b10-i1': (d: D) => rengConvertir(10 ** -(14 - d.h!), 'mol/L', 'nmol/L'),
  'n1-b10-i2': (d: D) => ph(2 * rengMolaridad(d.m! / M(RENG_HIDROXIDOS_2[d.h!]!), L(d.v!))),
  'n1-b10-i3': (d: D) => { const rengVa = (d.cb! * d.vb!) / d.ca!; return ph(xDebil(KW / K(d), (d.cb! * d.vb!) / (d.vb! + rengVa))) },
  'n1-b10-i4': (d: D) => ph((10 ** -d.h! * d.cs!) / d.ca!),
  'n1-b10-i5': (d: D) => { const rengA = d.a! / 100; const rengPA = (d.n0! * (1 - rengA) * R * d.t!) / d.v!; const rengPB = (2 * d.n0! * rengA * R * d.t!) / d.v!; return (rengPB * rengPB) / rengPA },
  'n1-b10-i6': (d: D) => ph((10 ** -d.p! * (1 - d.f!)) / d.f!)
}
