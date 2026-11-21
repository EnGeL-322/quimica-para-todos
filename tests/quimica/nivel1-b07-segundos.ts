import { rengPorSimbolo } from '../../src/renderer/modules/tabla-periodica/data'
import { rengBiseccion } from '../../src/renderer/modules/simulador-quimica/aprender/n1/numericos'
import { rengAjustarEcuacion } from '../../src/renderer/modules/simulador-quimica/nucleo/ajuste'
import { RENG_KB, RENG_NA, rengReactivoLimitante } from '../../src/renderer/modules/simulador-quimica/nucleo/estequiometria'
import { rengAnalizarFormula, rengMasaMolarDe } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { RENG_ATOMO_EN, RENG_PARES_COMPOSICION, rengPctEmp, rengPctHc } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b07-s01-s07'
import { RENG_COMBUSTIBLES_GAS, RENG_HIDROCARBUROS_MOL, RENG_NH3, RENG_RP, RENG_RR, RENG_RR_GAS } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b07-s08-s14'
import { RENG_GAS_HCL, RENG_MEZCLAS_INERTE } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b07-s15-s21'
import { RENG_COMBUSTIONES, RENG_COMPUESTOS_IONICOS, RENG_COMPUESTOS_MASA, RENG_COMPUESTOS_MOLECULARES, RENG_EMPIRICAS, RENG_HIDRATOS, RENG_HIDROCARBUROS, RENG_OXIDOS_METAL, RENG_REACCIONES_DOS_REACTIVOS, RENG_REACCIONES_GAS, type RengReaccionEst } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b07-comun'
import type { RengSegundoMetodo } from './nivel1-comun'

type D = Readonly<Record<string, number>>
const A = (rengEl: string): number => rengPorSimbolo.get(rengEl)!.masa
const atomos = (rengF: string): Map<string, number> => rengAnalizarFormula(rengF).atomos
const manual = (rengF: string): number => [...atomos(rengF).entries()].reduce((rengS, [rengEl, rengN]) => rengS + A(rengEl) * rengN, 0)
const nucleo = (rengF: string): number => rengMasaMolarDe(rengF)
const KT = (rengTc: number): number => RENG_KB * (rengTc + 273.15)
const volumenSI = (rengN: number, rengTc: number, rengPkPa: number): number => ((rengN * RENG_NA * KT(rengTc)) / (rengPkPa * 1000)) * 1000
const molesSI = (rengPkPa: number, rengVL: number, rengTc: number): number => (rengPkPa * 1000 * rengVL * 1e-3) / KT(rengTc) / RENG_NA

const limitante = (rengR: RengReaccionEst, rengMoles: readonly number[]) => rengReactivoLimitante(rengAjustarEcuacion(rengR.clave), rengMoles.map((rengN, rengI) => ({ indice: rengI, moles: rengN })))
const conExceso = (rengR: RengReaccionEst, rengI: number, rengN: number) => limitante(rengR, rengR.reactivos.map((_rengX, rengK) => (rengK === rengI ? rengN : 1e9)))
const productoDe = (rengR: RengReaccionEst, rengI: number, rengN: number, rengJ: number): number => conExceso(rengR, rengI, rengN).productos[rengJ]!.moles
const masaProductoDe = (rengR: RengReaccionEst, rengI: number, rengN: number, rengJ: number): number => conExceso(rengR, rengI, rengN).productos[rengJ]!.masa
const consumidoDe = (rengR: RengReaccionEst, rengI: number, rengN: number, rengK: number): number => conExceso(rengR, rengI, rengN).reactivos[rengK]!.consumido
const indiceEn = (rengR: RengReaccionEst, rengF: string): { lado: 'r' | 'p'; i: number } => {
  const rengI = rengR.reactivos.findIndex((rengE) => rengE.formula === rengF)
  return rengI >= 0 ? { lado: 'r', i: rengI } : { lado: 'p', i: rengR.productos.findIndex((rengE) => rengE.formula === rengF) }
}
const gasDeSolido = (rengG: (typeof RENG_REACCIONES_GAS)[number], rengMasa: number): number => productoDe(rengG.reaccion, indiceEn(rengG.reaccion, rengG.solido).i, rengMasa / manual(rengG.solido), indiceEn(rengG.reaccion, rengG.gas).i)

export const RENG_SEGUNDOS_B07: Readonly<Record<string, RengSegundoMetodo>> = {
  'n1-b7-s1-p1': (d: D) => {
    const rengM = manual(RENG_COMPUESTOS_MOLECULARES[d.f!]!)
    return ((d.a! * 10 ** d.e!) * (rengM / RENG_NA)) / rengM
  },
  'n1-b7-s1-p2': (d: D) => {
    const [rengF, rengEl] = RENG_ATOMO_EN[d.k!]!
    const rengMasa = d.n! * manual(rengF)
    return (rengMasa / (manual(rengF) / RENG_NA)) * atomos(rengF).get(rengEl)!
  },
  'n1-b7-s1-p3': (d: D) => {
    const [rengF, rengEl] = RENG_ATOMO_EN[d.k!]!
    const rengMasaEl = d.m! * ((atomos(rengF).get(rengEl)! * A(rengEl)) / manual(rengF))
    return rengMasaEl / (A(rengEl) / RENG_NA)
  },
  'n1-b7-s2-p1': (d: D) => 1 / (manual(RENG_COMPUESTOS_MOLECULARES[d.f!]!) / RENG_NA),
  'n1-b7-s2-p2': (d: D) => d.m! / (manual(RENG_COMPUESTOS_MOLECULARES[d.f!]!) / RENG_NA),
  'n1-b7-s2-p3': (d: D) => (d.m! / manual(RENG_COMPUESTOS_MOLECULARES[d.a!]!)) / (d.m! / manual(RENG_COMPUESTOS_MOLECULARES[d.b!]!)),
  'n1-b7-s3-p1': (d: D) => nucleo(RENG_COMPUESTOS_MASA[d.f!]!),
  'n1-b7-s3-p2': (d: D) => d.n! * RENG_NA * (manual(RENG_COMPUESTOS_MASA[d.f!]!) / RENG_NA),
  'n1-b7-s3-p3': (d: D) => ((d.m! * 1000 * RENG_NA) / manual(RENG_COMPUESTOS_MASA[d.f!]!)) / RENG_NA,
  'n1-b7-s4-p1': (d: D) => nucleo(RENG_COMPUESTOS_MOLECULARES[d.f!]!),
  'n1-b7-s4-p2': (d: D) => (manual(RENG_COMPUESTOS_MOLECULARES[d.a!]!) / RENG_NA) / (manual(RENG_COMPUESTOS_MOLECULARES[d.b!]!) / RENG_NA),
  'n1-b7-s4-p3': (d: D) => ((d.a! * 10 ** d.e!) / RENG_NA) * manual(RENG_COMPUESTOS_MOLECULARES[d.f!]!),
  'n1-b7-s5-p1': (d: D) => nucleo(RENG_COMPUESTOS_IONICOS[d.f!]!),
  'n1-b7-s5-p2': (d: D) => {
    const [rengS, rengK] = RENG_HIDRATOS[d.h!]!
    const rengAgua = rengK * (2 * A('H') + A('O'))
    const rengPct = (100 * rengAgua) / (manual(rengS) + rengAgua)
    return d.q === 0 ? rengPct : 100 - rengPct
  },
  'n1-b7-s5-p3': (d: D) => {
    const [rengS, rengK] = RENG_HIDRATOS[d.h!]!
    const rengN = d.m! / (manual(rengS) + rengK * manual('H2O'))
    return rengN * rengK * manual('H2O')
  },
  'n1-b7-s6-p1': (d: D) => {
    const [rengF, rengEl] = RENG_PARES_COMPOSICION[d.k!]!
    return 100 - [...atomos(rengF).entries()].filter(([rengX]) => rengX !== rengEl).reduce((rengS, [rengX, rengN]) => rengS + (100 * rengN * A(rengX)) / manual(rengF), 0)
  },
  'n1-b7-s6-p2': (d: D) => {
    const [rengF, rengEl] = RENG_PARES_COMPOSICION[d.k!]!
    return (d.m! / manual(rengF)) * atomos(rengF).get(rengEl)! * A(rengEl)
  },
  'n1-b7-s6-p3': (d: D) => {
    const [rengF, rengEl] = RENG_PARES_COMPOSICION[d.k!]!
    return (d.m! / A(rengEl) / atomos(rengF).get(rengEl)!) * manual(rengF)
  },
  'n1-b7-s7-p1': (d: D) => {
    const [rengC, rengH] = rengPctHc(RENG_HIDROCARBUROS[d.h!]!)
    const rengR = rengBiseccion((rengX) => rengX * A('H') * rengC - A('C') * rengH, 0, 20)
    return d.q === 0 ? rengR : 1 / rengR
  },
  'n1-b7-s7-p2': (d: D) => {
    const [rengC, rengH, rengO] = rengPctEmp(RENG_EMPIRICAS[d.e!]!)
    const rengNum = d.q === 0 ? rengC : rengH
    const rengA = d.q === 0 ? A('C') : A('H')
    return rengBiseccion((rengX) => rengX * rengA * rengO - A('O') * rengNum, 0, 50)
  },
  'n1-b7-s7-p3': (d: D) => {
    const rengE = RENG_EMPIRICAS[d.e!]!
    const rengN = d.m! / nucleo(rengE[0])
    const rengCO2 = Math.round(rengN * rengE[1] * nucleo('CO2') * 1000) / 1000
    const rengH2O = Math.round(((rengN * rengE[2]) / 2) * nucleo('H2O') * 1000) / 1000
    const rengMasaC = rengCO2 * (A('C') / manual('CO2'))
    const rengMasaH = rengH2O * ((2 * A('H')) / manual('H2O'))
    return rengMasaH / A('H') / (rengMasaC / A('C'))
  },
  'n1-b7-s8-p1': (d: D) => (Math.round(d.n! * nucleo(RENG_EMPIRICAS[d.e!]![0]) * 10) / 10) / manual(RENG_EMPIRICAS[d.e!]![0]),
  'n1-b7-s8-p2': (d: D) => {
    const rengE = RENG_EMPIRICAS[d.e!]!
    return Math.round((Math.round(d.n! * nucleo(rengE[0]) * 10) / 10) / manual(rengE[0])) * (d.x === 0 ? atomos(rengE[0]).get('H')! : atomos(rengE[0]).get('C')!)
  },
  'n1-b7-s8-p3': (d: D) => {
    const [rengF] = RENG_HIDROCARBUROS_MOL[d.h!]!
    const rengPctC = Math.round(((100 * RENG_HIDROCARBUROS_MOL[d.h!]![1] * A('C')) / nucleo(rengF)) * 100) / 100
    const rengM = Math.round(nucleo(rengF) * 10) / 10
    const rengMasaH = (rengM * (100 - rengPctC)) / 100
    return (rengM - rengMasaH) / A('C')
  },
  'n1-b7-s9-p1': (d: D) => { const [rengR, rengI, rengJ] = RENG_RP[d.p!]!; return productoDe(rengR, rengI, d.n!, rengJ) },
  'n1-b7-s9-p2': (d: D) => { const [rengR, rengI, rengK] = RENG_RR[d.p!]!; return consumidoDe(rengR, rengI, d.n!, rengK) },
  'n1-b7-s9-p3': (d: D) => { const [rengR, rengI, rengJ] = RENG_RP[d.p!]!; return rengBiseccion((rengX) => productoDe(rengR, rengI, rengX, rengJ) - d.n!, 1e-9, 1000) },
  'n1-b7-s10-p1': (d: D) => { const [rengR, rengI, rengJ] = RENG_RP[d.p!]!; return masaProductoDe(rengR, rengI, d.m! / manual(rengR.reactivos[rengI]!.formula), rengJ) },
  'n1-b7-s10-p2': (d: D) => { const [rengR, rengI, rengJ] = RENG_RP[d.p!]!; return rengBiseccion((rengX) => masaProductoDe(rengR, rengI, rengX / manual(rengR.reactivos[rengI]!.formula), rengJ) - d.m!, 1e-9, 1e5) },
  'n1-b7-s10-p3': (d: D) => {
    const rengR = RENG_COMBUSTIONES[d.c!]!
    const rengRes = conExceso(rengR, 0, d.m! / manual(rengR.reactivos[0]!.formula))
    return rengRes.productos.reduce((rengS, rengP) => rengS + rengP.masa, 0) - d.m!
  },
  'n1-b7-s11-p1': (d: D) => { const [rengR, rengI, rengJ] = RENG_RP[d.p!]!; return productoDe(rengR, rengI, d.m! / manual(rengR.reactivos[rengI]!.formula), rengJ) },
  'n1-b7-s11-p2': (d: D) => { const [rengR, rengI, rengJ] = RENG_RP[d.p!]!; return rengBiseccion((rengX) => productoDe(rengR, rengI, rengX / manual(rengR.reactivos[rengI]!.formula), rengJ) - d.n!, 1e-9, 1e5) },
  'n1-b7-s11-p3': (d: D) => gasDeSolido(RENG_REACCIONES_GAS[d.g!]!, d.m!),
  'n1-b7-s12-p1': (d: D) => { const [rengR, rengI, rengK] = RENG_RR_GAS[d.p!]!; return consumidoDe(rengR, rengI, d.v!, rengK) },
  'n1-b7-s12-p2': (d: D) => consumidoDe(RENG_COMBUSTIBLES_GAS[d.c!]!, 0, d.v!, 1) / 0.21,
  'n1-b7-s12-p3': (d: D) => limitante(RENG_NH3, [d.a!, d.b!]).productos[0]!.moles,
  'n1-b7-s13-p1': (d: D) => limitante(RENG_REACCIONES_DOS_REACTIVOS[d.r!]!, [d.a!, d.b!]).productos[0]!.moles,
  'n1-b7-s13-p2': (d: D) => {
    const rengR = RENG_REACCIONES_DOS_REACTIVOS[d.r!]!
    return limitante(rengR, [d.a! / manual(rengR.reactivos[0]!.formula), d.b! / manual(rengR.reactivos[1]!.formula)]).productos[0]!.masa
  },
  'n1-b7-s13-p3': (d: D) => {
    const rengR = RENG_COMBUSTIONES[d.c!]!
    return limitante(rengR, [d.a! / manual(rengR.reactivos[0]!.formula), d.b! / manual('O2')]).productos.find((rengP) => rengP.entrada === 'H2O')!.masa
  },
  'n1-b7-s14-p1': (d: D) => Math.max(...limitante(RENG_REACCIONES_DOS_REACTIVOS[d.r!]!, [d.a!, d.b!]).reactivos.map((rengX) => rengX.sobrante)),
  'n1-b7-s14-p2': (d: D) => {
    const rengR = RENG_REACCIONES_DOS_REACTIVOS[d.r!]!
    const rengRes = limitante(rengR, [d.a! / manual(rengR.reactivos[0]!.formula), d.b! / manual(rengR.reactivos[1]!.formula)])
    return d.a! + d.b! - rengRes.productos.reduce((rengS, rengP) => rengS + rengP.masa, 0)
  },
  'n1-b7-s14-p3': (d: D) => {
    const rengR = RENG_REACCIONES_DOS_REACTIVOS[d.r!]!
    const rengRes = limitante(rengR, [d.a! / manual(rengR.reactivos[0]!.formula), d.b! / manual(rengR.reactivos[1]!.formula)])
    const rengExc = rengRes.reactivos.findIndex((rengX) => rengX.sobrante > 1e-12)
    const rengLim = 1 - rengExc
    return rengRes.reactivos[rengExc]!.sobrante * (rengR.reactivos[rengLim]!.coef / rengR.reactivos[rengExc]!.coef) * manual(rengR.reactivos[rengLim]!.formula)
  },
  'n1-b7-s15-p1': (d: D) => { const rengO = RENG_OXIDOS_METAL[d.o!]!; return (d.m! / manual(rengO.oxido)) * atomos(rengO.oxido).get(rengO.metal)! * manual(rengO.metal) },
  'n1-b7-s15-p2': (d: D) => {
    const rengG = RENG_GAS_HCL[d.g!]!
    const rengS = indiceEn(rengG.reaccion, rengG.solido).i
    const rengMoles = rengG.reaccion.reactivos.map((rengE, rengI) => (rengI === rengS ? d.m! / manual(rengG.solido) : rengE.formula === 'HCl' ? d.h! : 1e9))
    return limitante(rengG.reaccion, rengMoles).productos[indiceEn(rengG.reaccion, rengG.gas).i]!.masa
  },
  'n1-b7-s15-p3': (d: D) => { const rengO = RENG_OXIDOS_METAL[d.o!]!; return ((d.t! * 1e6) / manual(rengO.oxido)) * atomos(rengO.oxido).get(rengO.metal)! * manual(rengO.metal) / 1000 },
  'n1-b7-s16-p1': (d: D) => d.t! - d.t! * (1 - d.r! / 100),
  'n1-b7-s16-p2': (d: D) => { const [rengR, rengI, rengJ] = RENG_RP[d.p!]!; return masaProductoDe(rengR, rengI, d.m! / manual(rengR.reactivos[rengI]!.formula), rengJ) * (d.r! / 100) },
  'n1-b7-s16-p3': (d: D) => { const [rengR, rengI, rengJ] = RENG_RP[d.p!]!; return rengBiseccion((rengX) => masaProductoDe(rengR, rengI, rengX / manual(rengR.reactivos[rengI]!.formula), rengJ) * (d.r! / 100) - d.m!, 1e-9, 1e6) },
  'n1-b7-s17-p1': (d: D) => { const rengReal = Math.round(d.t! * d.f! * 10) / 10; return 100 - ((d.t! - rengReal) / d.t!) * 100 },
  'n1-b7-s17-p2': (d: D) => {
    const [rengR, rengI, rengJ] = RENG_RP[d.p!]!
    const rengTeoricoMoles = productoDe(rengR, rengI, d.m! / manual(rengR.reactivos[rengI]!.formula), rengJ)
    const rengReal = Number((rengTeoricoMoles * manual(rengR.productos[rengJ]!.formula) * d.f!).toPrecision(4))
    return (rengReal / manual(rengR.productos[rengJ]!.formula) / rengTeoricoMoles) * 100
  },
  'n1-b7-s17-p3': (d: D) => {
    const rengG = RENG_REACCIONES_GAS[d.g!]!
    const rengN = gasDeSolido(rengG, d.m!)
    const rengV = Number(((rengN * d.f! * 8.314462618 * (d.t! + 273.15)) / 101.3).toPrecision(3))
    return (rengV / volumenSI(rengN, d.t!, 101.3)) * 100
  },
  'n1-b7-s18-p1': (d: D) => d.m! - d.m! * (1 - d.p! / 100),
  'n1-b7-s18-p2': (d: D) => { const rengG = RENG_REACCIONES_GAS[d.g!]!; return gasDeSolido(rengG, (d.m! * d.p!) / 100) * manual(rengG.gas) },
  'n1-b7-s18-p3': (d: D) => {
    const rengG = RENG_REACCIONES_GAS[d.g!]!
    const rengMedido = Number((gasDeSolido(rengG, (d.m! * d.p!) / 100) * manual(rengG.gas)).toPrecision(4))
    return rengBiseccion((rengP) => gasDeSolido(rengG, (d.m! * rengP) / 100) * manual(rengG.gas) - rengMedido, 0.01, 100)
  },
  'n1-b7-s19-p1': (d: D) => {
    const rengK = RENG_MEZCLAS_INERTE[d.k!]!
    const rengCO2 = Number((((d.m! * d.x!) / nucleo(rengK.reactivo)) * rengK.razon * nucleo('CO2')).toPrecision(4))
    return rengBiseccion((rengP) => ((d.m! * rengP) / 100 / manual(rengK.reactivo)) * rengK.razon * manual('CO2') - rengCO2, 0.01, 100)
  },
  'n1-b7-s19-p2': (d: D) => {
    const rengPerdida = Number((((d.m! * d.x!) / nucleo('NaHCO3') / 2) * (nucleo('H2O') + nucleo('CO2'))).toPrecision(4))
    const rengPorGramo = (manual('H2O') + manual('CO2')) / (2 * manual('NaHCO3'))
    return (rengPerdida / rengPorGramo / d.m!) * 100
  },
  'n1-b7-s19-p3': (d: D) => {
    const rengCO2 = Number((((d.m! * d.x!) / nucleo('CaCO3') + (d.m! * (1 - d.x!)) / nucleo('MgCO3')) * nucleo('CO2')).toPrecision(4))
    return rengBiseccion((rengX) => rengX / manual('CaCO3') + (d.m! - rengX) / manual('MgCO3') - rengCO2 / manual('CO2'), 0, d.m!)
  },
  'n1-b7-s20-p1': (d: D) => volumenSI(gasDeSolido(RENG_REACCIONES_GAS[d.g!]!, d.m!), d.t!, d.p!),
  'n1-b7-s20-p2': (d: D) => {
    const rengG = RENG_REACCIONES_GAS[d.g!]!
    const rengN = molesSI(d.p!, d.v!, d.t!)
    return rengBiseccion((rengX) => gasDeSolido(rengG, rengX) - rengN, 1e-9, 1e5)
  },
  'n1-b7-s20-p3': (d: D) => {
    const rengR = RENG_COMBUSTIONES[d.c!]!
    return volumenSI(consumidoDe(rengR, 0, d.m! / manual(rengR.reactivos[0]!.formula), 1), d.t!, d.p!)
  },
  'n1-b7-s21-p1': (d: D) => {
    let rengMat = 100
    for (const rengR of [d.a!, d.b!, d.c!, d.d!].slice(0, d.k!)) rengMat = rengMat * (rengR / 100)
    return rengMat
  },
  'n1-b7-s21-p2': (d: D) => {
    const rengCaO = (d.m! / manual('CaCO3')) * (d.a! / 100) * manual('CaO')
    return (rengCaO / manual('CaO')) * (d.b! / 100) * manual('Ca(OH)2')
  },
  'n1-b7-s21-p3': (d: D) => {
    const rengCaO = d.m! / manual('Ca(OH)2') / (d.b! / 100)
    return (rengCaO / (d.a! / 100)) * manual('CaCO3')
  },
  'n1-b7-i1': (d: D) => {
    const rengR = RENG_COMBUSTIONES[d.c!]!
    const rengF = rengR.reactivos[0]!.formula
    const rengMasaC = d.m! * ((atomos(rengF).get('C')! * A('C')) / manual(rengF))
    return rengMasaC * (manual('CO2') / A('C'))
  },
  'n1-b7-i2': (d: D) => { const rengO = RENG_OXIDOS_METAL[d.o!]!; return (((d.m! * 1000 * d.p!) / 100) / manual(rengO.oxido)) * atomos(rengO.oxido).get(rengO.metal)! * manual(rengO.metal) / 1000 },
  'n1-b7-i3': (d: D) => {
    const rengR = RENG_REACCIONES_DOS_REACTIVOS[d.r!]!
    return limitante(rengR, [d.a! / manual(rengR.reactivos[0]!.formula), d.b! / manual(rengR.reactivos[1]!.formula)]).productos[0]!.masa * (d.y! / 100)
  },
  'n1-b7-i4': (d: D) => {
    const rengE = RENG_EMPIRICAS[d.e!]!
    const rengM = Math.round(d.n! * nucleo(rengE[0]) * 10) / 10
    const rengCO2 = Math.round((d.m! / (d.n! * nucleo(rengE[0]))) * d.n! * rengE[1] * nucleo('CO2') * 1000) / 1000
    const rengMasaC = rengCO2 * (A('C') / manual('CO2'))
    return rengMasaC / A('C') / (d.m! / rengM)
  },
  'n1-b7-i5': (d: D) => {
    const rengV = Number(((((d.m! * d.p!) / 100 / nucleo('Zn')) * 8.314462618 * (d.t! + 273.15)) / d.q!).toPrecision(4))
    return ((molesSI(d.q!, rengV, d.t!) * manual('Zn')) / d.m!) * 100
  },
  'n1-b7-i6': (d: D) => {
    const rengZn = RENG_REACCIONES_EST_ZN
    const rengH2 = limitante(rengZn, [d.m! / manual('Zn'), d.h!]).productos.find((rengP) => rengP.entrada === 'H2')!.moles
    return volumenSI(rengH2 * (d.y! / 100), d.t!, 101.3)
  }
}

const RENG_REACCIONES_EST_ZN: RengReaccionEst = RENG_GAS_HCL.find((rengG) => rengG.solido === 'Zn')!.reaccion
