import { rengConvertir } from '../../src/renderer/lib/unidades'
import { rengPorSimbolo } from '../../src/renderer/modules/tabla-periodica/data'
import { rengBiseccion } from '../../src/renderer/modules/simulador-quimica/aprender/n1/numericos'
import { rengDilucion, rengFraccionesMolares, rengMolalidad, rengMolalidadDesdeMolaridad, rengMolaridad, rengMolaridadDesdePorcentaje, rengNormalidad, rengPorcentajeMasa, rengPorcentajeMasaVolumen, rengPpm } from '../../src/renderer/modules/simulador-quimica/nucleo/estequiometria'
import { rengAnalizarFormula } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { RENG_ACIDOS_SOL, RENG_BASES_SOL, RENG_ELECTROLITOS_MULTI_SOL, RENG_FACTORES_DILUCION_SOL, RENG_HIDRATOS_SOL, RENG_IONES_AGUA_SOL, RENG_POCO_SOLUBLES_SOL, RENG_POLIPROTICOS_SOL, RENG_REACTIVOS_LAB_SOL, RENG_SOLUTOS_ELECTROLITOS_SOL, RENG_SOLUTOS_SOL, RENG_VOLUMENES_MATRAZ_SOL } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b09-comun'
import { RENG_SATURADAS_FORMULAS } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b09-s01-s07'
import { RENG_SALES_CLORURO_SOL } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b09-s15-s20'
import type { RengSegundoMetodo } from './nivel1-comun'

type D = Readonly<Record<string, number>>
const KF = 1.86
const M = (rengF: string): number => [...rengAnalizarFormula(rengF).atomos.entries()].reduce((rengS, [rengEl, rengN]) => rengS + rengPorSimbolo.get(rengEl)!.masa * rengN, 0)
const MW = M('H2O')
const raiz = (rengF: (rengX: number) => number, rengA: number, rengB: number): number => rengBiseccion(rengF, rengA, rengB)
const lineal = (rengD: D, rengT: number): number => rengD.a! + rengD.b! * rengT
const electro = (rengD: D) => RENG_ELECTROLITOS_MULTI_SOL[rengD.e!]!
const ionNeutro = (rengD: D, rengC: number): number => {
  const rengE = electro(rengD)
  return rengD.k === 0 ? (rengE.na * rengC * rengE.za) / rengE.zc : (rengE.nc * rengC * rengE.zc) / rengE.za
}
const soluto = (rengD: D) => RENG_SOLUTOS_SOL[rengD.s!]!
const mmolL = (rengX: number): number => rengConvertir(rengX, 'mol/L', 'mmol/L')

export const RENG_SEGUNDOS_B09: Readonly<Record<string, RengSegundoMetodo>> = {
  'n1-b9-s1-p1': (d: D) => rengConvertir(rengConvertir(d.ms!, 'g', 'kg') + rengConvertir(d.md!, 'g', 'kg'), 'kg', 'g'),
  'n1-b9-s1-p2': (d: D) => raiz((rengX) => rengPorcentajeMasa(d.mt! - rengX, d.mt!) - d.w!, 0, d.mt!),
  'n1-b9-s1-p3': (d: D) => rengConvertir(rengConvertir(d.ms! + d.md!, 'g', 'kg') / d.rho!, 'L', 'mL'),
  'n1-b9-s2-p1': (d: D) => d.n! * electro(d).nc + (d.n! * electro(d).nc * electro(d).zc) / electro(d).za,
  'n1-b9-s2-p2': (d: D) => ionNeutro(d, d.c!),
  'n1-b9-s2-p3': (d: D) => raiz((rengX) => (rengX / M(electro(d).formula)) * (d.k === 0 ? electro(d).nc : electro(d).na) - d.ni!, 0, 1e5),
  'n1-b9-s3-p1': (d: D) => raiz((rengX) => rengX / d.mw! - d.S! / 100, 0, 1e5),
  'n1-b9-s3-p2': (d: D) => {
    const rengP = rengPorcentajeMasa(d.mr!, d.msat!)
    return (rengP / (100 - rengP)) * 100
  },
  'n1-b9-s3-p3': (d: D) => mmolL(rengMolaridad(d.s! / M(RENG_POCO_SOLUBLES_SOL[d.f!]!), 1)),
  'n1-b9-s4-p1': (d: D) => (d.c1! / rengConvertir(d.p1!, 'atm', 'kPa')) * rengConvertir(d.p2!, 'atm', 'kPa'),
  'n1-b9-s4-p2': (d: D) => {
    const rengS0 = lineal(d, 0)
    const rengS100 = lineal(d, 100)
    return ((rengS0 + ((rengS100 - rengS0) * d.T!) / 100) * d.mw!) / 100
  },
  'n1-b9-s4-p3': (d: D) => d.mw! + (lineal(d, d.T1!) * d.mw!) / 100 - (d.mw! + (lineal(d, d.T2!) * d.mw!) / 100),
  'n1-b9-s5-p1': (d: D) => d.mw! + raiz((rengX) => rengX / d.mw! - d.S! / 100, 0, 1e5),
  'n1-b9-s5-p2': (d: D) => rengPorcentajeMasa(2.5 * d.S!, 250 + 2.5 * d.S!),
  'n1-b9-s5-p3': (d: D) => rengMolalidad(d.p! / M(RENG_SATURADAS_FORMULAS[d.f!]!), rengConvertir(100 - d.p!, 'g', 'kg')),
  'n1-b9-s6-p1': (d: D) => raiz((rengX) => ((d.ms! + rengX) / d.mw!) * 100 - d.S!, 0, 1e5),
  'n1-b9-s6-p2': (d: D) => ((d.ms! * 100) / d.mw! / d.S!) * 100,
  'n1-b9-s6-p3': (d: D) => raiz((rengX) => (d.ms! / (d.mw! - rengX)) * 100 - d.S!, 0, d.mw! * 0.999999),
  'n1-b9-s7-p1': (d: D) => d.mw! + d.ms! - (d.mw! + (d.S! * d.mw!) / 100),
  'n1-b9-s7-p2': (d: D) => (d.x! / d.S! - 1) * 100,
  'n1-b9-s7-p3': (d: D) => {
    const rengM1 = 2.5 * lineal(d, d.T1!)
    const rengM2 = 2.5 * lineal(d, d.T2!)
    return ((rengM1 - rengM2) / rengM1) * 100
  },
  'n1-b9-s8-p1': (d: D) => rengPorcentajeMasa(d.ms!, d.ms! + d.md!),
  'n1-b9-s8-p2': (d: D) => raiz((rengX) => rengPorcentajeMasa(rengX, d.mt!) - d.p!, 0, d.mt!),
  'n1-b9-s8-p3': (d: D) => raiz((rengX) => rengPorcentajeMasa((d.m1! * d.p1!) / 100, d.m1! + rengX) - d.p2!, 0, 1e7),
  'n1-b9-s9-p1': (d: D) => (rengConvertir(d.vs!, 'mL', 'L') / rengConvertir(d.vt!, 'mL', 'L')) * 100,
  'n1-b9-s9-p2': (d: D) => rengConvertir((rengConvertir(d.vt!, 'mL', 'L') * d.p!) / 100, 'L', 'mL'),
  'n1-b9-s9-p3': (d: D) => rengConvertir((d.vt! * d.p!) / 100, 'mL', 'L') * 789,
  'n1-b9-s10-p1': (d: D) => rengPorcentajeMasaVolumen(d.ms!, d.v!),
  'n1-b9-s10-p2': (d: D) => raiz((rengX) => rengPorcentajeMasaVolumen(rengX, d.v!) - d.p!, 0, 1e5),
  'n1-b9-s10-p3': (d: D) => mmolL(rengMolaridad(d.p! / M(soluto(d).formula), rengConvertir(100, 'mL', 'L'))),
  'n1-b9-s11-p1': (d: D) => rengMolaridad(d.m! / M(soluto(d).formula), rengConvertir(d.v!, 'mL', 'L')),
  'n1-b9-s11-p2': (d: D) => rengConvertir(d.c! * rengConvertir(d.v!, 'mL', 'L'), 'mol', 'mmol'),
  'n1-b9-s11-p3': (d: D) => rengMolaridadDesdePorcentaje(d.p!, d.rho!, M(RENG_REACTIVOS_LAB_SOL[d.r!]!.formula)),
  'n1-b9-s12-p1': (d: D) => rengMolalidad(d.m! / M(soluto(d).formula), rengConvertir(d.md!, 'g', 'kg')),
  'n1-b9-s12-p2': (d: D) => raiz((rengX) => rengMolalidad(rengX / M(soluto(d).formula), d.md! / 1000) - d.b!, 0, 1e5),
  'n1-b9-s12-p3': (d: D) => rengMolalidadDesdeMolaridad(d.c!, d.rho!, M(soluto(d).formula)),
  'n1-b9-s13-p1': (d: D) => rengFraccionesMolares([d.ms! / M(soluto(d).formula), d.md! / MW])[0]! * 100,
  'n1-b9-s13-p2': (d: D) => raiz((rengX) => rengFraccionesMolares([d.ms! / M(soluto(d).formula), rengX / MW])[0]! - d.x!, 1e-6, 1e7),
  'n1-b9-s13-p3': (d: D) => rengMolalidad(d.x!, ((1 - d.x!) * MW) / 1000),
  'n1-b9-s14-p1': (d: D) => rengNormalidad(d.c!, RENG_POLIPROTICOS_SOL[d.a!]!.eq),
  'n1-b9-s14-p2': (d: D) => {
    const rengH = (d.ca! * d.va!) / 1000 * RENG_ACIDOS_SOL[d.a!]!.eq
    return (rengH / RENG_BASES_SOL[d.b!]!.eq / d.cb!) * 1000
  },
  'n1-b9-s14-p3': (d: D) => {
    const rengA = RENG_POLIPROTICOS_SOL[d.a!]!
    return raiz((rengX) => rengNormalidad(rengMolaridad(rengX / M(rengA.formula), d.v! / 1000), rengA.eq) - d.N!, 0, 1e5)
  },
  'n1-b9-s15-p1': (d: D) => rengPpm(rengConvertir(d.mg!, 'mg', 'g'), rengConvertir(d.kg!, 'kg', 'g')),
  'n1-b9-s15-p2': (d: D) => rengConvertir(d.c!, 'mg/kg', '') * rengConvertir(d.v!, 'kg', 'mg'),
  'n1-b9-s15-p3': (d: D) => rengConvertir(rengMolaridad(rengConvertir(d.c!, 'mg', 'g') / M(RENG_IONES_AGUA_SOL[d.i!]!.formula), 1), 'mol/L', 'µmol/L'),
  'n1-b9-s16-p1': (d: D) => rengConvertir(d.c!, 'mg/kg', 'µg/kg'),
  'n1-b9-s16-p2': (d: D) => rengPpm(rengConvertir(d.ug!, 'µg', 'g'), rengConvertir(d.kg!, 'kg', 'g')) * 1000,
  'n1-b9-s16-p3': (d: D) => rengConvertir(d.c! * d.v! * 1000, 'µg', 'g'),
  'n1-b9-s17-p1': (d: D) => rengDilucion({ C1: d.c1!, V1: d.v1!, V2: d.v1! * RENG_FACTORES_DILUCION_SOL[d.f!]! }).C2,
  'n1-b9-s17-p2': (d: D) => rengDilucion({ C1: d.c1!, C2: d.c2!, V2: d.v2! }).V1,
  'n1-b9-s17-p3': (d: D) => mmolL(rengDilucion({ C1: rengDilucion({ C1: d.c0!, V1: d.a!, V2: d.a! * RENG_FACTORES_DILUCION_SOL[d.f1!]! }).C2, V1: d.b!, V2: d.b! * RENG_FACTORES_DILUCION_SOL[d.f2!]! }).C2),
  'n1-b9-s18-p1': (d: D) => {
    const rengV = d.v1! + d.v2!
    return rengDilucion({ C1: d.c1!, V1: d.v1!, V2: rengV }).C2 + rengDilucion({ C1: d.c2!, V1: d.v2!, V2: rengV }).C2
  },
  'n1-b9-s18-p2': (d: D) => ((d.c1! * d.v1!) / 1000 + (RENG_SALES_CLORURO_SOL[d.s!]!.nu * d.c2! * d.v2!) / 1000) / rengConvertir(d.v1! + d.v2!, 'mL', 'L'),
  'n1-b9-s18-p3': (d: D) => raiz((rengV) => (d.c1! * d.v1! + d.c2! * rengV) / (d.v1! + rengV) - d.c!, 0, 1e7),
  'n1-b9-s19-p1': (d: D) => raiz((rengX) => rengMolaridad(rengX / M(soluto(d).formula), RENG_VOLUMENES_MATRAZ_SOL[d.v!]! / 1000) - d.c!, 0, 1e5),
  'n1-b9-s19-p2': (d: D) => {
    const [rengAnh, rengK] = RENG_HIDRATOS_SOL[d.h!]!
    const rengMh = M(rengAnh) + rengK * MW
    return raiz((rengX) => rengMolaridad(rengX / rengMh, RENG_VOLUMENES_MATRAZ_SOL[d.v!]! / 1000) - d.c!, 0, 1e5)
  },
  'n1-b9-s19-p3': (d: D) => rengDilucion({ C1: rengMolaridadDesdePorcentaje(d.p!, d.rho!, M(RENG_REACTIVOS_LAB_SOL[d.r!]!.formula)), C2: d.c2!, V2: RENG_VOLUMENES_MATRAZ_SOL[d.v!]! }).V1,
  'n1-b9-s20-p1': (d: D) => KF * rengMolalidad(d.b! * soluto(d).i * 2, 2),
  'n1-b9-s20-p2': (d: D) => KF * rengMolalidad(d.m! / M(soluto(d).formula), rengConvertir(d.md!, 'g', 'kg')) * soluto(d).i,
  'n1-b9-s20-p3': (d: D) => raiz((rengX) => KF * rengMolalidad(d.ms! / rengX, d.md! / 1000) - d.dT!, 1, 1e5),
  'n1-b9-i1': (d: D) => mmolL(ionNeutro(d, rengMolaridad(d.m! / M(electro(d).formula), rengConvertir(d.v!, 'mL', 'L')))),
  'n1-b9-i2': (d: D) => rengConvertir(d.p! * 10, 'g', 'mg'),
  'n1-b9-i3': (d: D) => rengDilucion({ C1: rengMolaridad(d.m! / M(soluto(d).formula), d.v0! / 1000), C2: d.c2!, V2: d.v2! }).V1,
  'n1-b9-i4': (d: D) => {
    const rengS = RENG_SOLUTOS_ELECTROLITOS_SOL[d.s!]!
    return KF * rengMolalidadDesdeMolaridad(d.c!, d.rho!, M(rengS.formula)) * rengS.i
  },
  'n1-b9-i5': (d: D) => rengPorcentajeMasa(2.5 * lineal(d, d.T2!), 250 + 2.5 * lineal(d, d.T2!)),
  'n1-b9-i6': (d: D) => rengFraccionesMolares([(2.5 * d.p!) / M(soluto(d).formula), (2.5 * (100 - d.p!)) / MW])[0]! * 100
}
