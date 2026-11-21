import { rengBiseccion } from '../../src/renderer/modules/simulador-quimica/aprender/n1/numericos'
import { rengAjustarEcuacion, rengAjustarIonElectron } from '../../src/renderer/modules/simulador-quimica/nucleo/ajuste'
import { rengAnalizarFormula, rengMasaMolarDe } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { rengEstadosOxidacion } from '../../src/renderer/modules/simulador-quimica/nucleo/oxidacion'
import {
  RENG_AJUSTE_RQ, RENG_COMBUSTIBLES_RQ, RENG_DESPLAZAMIENTO_RQ, RENG_DOS_REACTIVOS_RQ, RENG_GAS_ABIERTO_RQ, RENG_NEUTRALIZACION_RQ, RENG_REDOX_RQ, RENG_SAL_OXIDANTE_RQ, RENG_SINTESIS_RQ,
  rengCoreRx, rengFCombRq, type RengRxRq
} from '../../src/renderer/modules/simulador-quimica/practicas-n1/b06-comun'
import { RENG_AJUSTE_DOS, RENG_OXIDACION_METAL, RENG_SINTESIS_SIMPLE_RQ } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b06-s01-s07'
import { RENG_DESC_GAS, RENG_DOBLE_PPT, RENG_METAL_ACIDO, RENG_SINTESIS_DOS_RQ } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b06-s08-s14'
import { RENG_CAMBIOS_OX_RQ, RENG_ENDOTERMICAS_RQ, RENG_EXOTERMICAS_RQ, RENG_METALES_ACIDO_RQ, RENG_OXIDANTES_RQ, RENG_REDUCTORES_RQ, RENG_REVERSIBLES_RQ } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b06-s15-s20'
import { RENG_REV_DOS_RQ } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b06-integradores'
import type { RengSegundoMetodo } from './nivel1-comun'

type D = Readonly<Record<string, number>>
const mm = (rengF: string): number => rengMasaMolarDe(rengF)
const tot = (rengF: string): number => [...rengAnalizarFormula(rengF).atomos.values()].reduce((rengA, rengB) => rengA + rengB, 0)
const cnt = (rengF: string, rengEl: string): number => rengAnalizarFormula(rengF).atomos.get(rengEl) ?? 0
const ox = (rengF: string, rengEl: string): number => rengEstadosOxidacion(rengAnalizarFormula(rengF))!.get(rengEl)!
const cf = (rengR: RengRxRq): number[] => { const rengA = rengAjustarEcuacion(rengCoreRx(rengR)); return [...rengA.reactivos, ...rengA.productos].map((rengT) => rengT.coef) }
const masa = (rengR: RengRxRq, rengI: number, rengX: number, rengJ: number): number => { const c = cf(rengR); return (rengX / mm(rengR.esp[rengI]!) / c[rengI]!) * c[rengJ]! * mm(rengR.esp[rengJ]!) }
const ult = (rengR: RengRxRq): number => rengR.esp.length - 1
const comb = (rengI: number): number[] => { const rengA = rengAjustarEcuacion(`${rengFCombRq(RENG_COMBUSTIBLES_RQ[rengI]!)} + O2 -> CO2 + H2O`); return [...rengA.reactivos, ...rengA.productos].map((rengT) => rengT.coef) }
const redox = (rengI: number) => { const r = RENG_REDOX_RQ[rengI]!; const a = rengAjustarIonElectron(r.ec, r.medio); const t = [...a.reactivos, ...a.productos]; return { cOx: t.find((x) => x.entrada === r.ox)!.coef, cRed: t.find((x) => x.entrada === r.red)!.coef, e: a.electronesTransferidos } }
const eAg = (rengF: string, rengEl: string, rengP: string): number => cnt(rengF, rengEl) * Math.abs(ox(rengF, rengEl) - ox(rengP, rengEl))

export const RENG_SEGUNDOS_B06: Readonly<Record<string, RengSegundoMetodo>> = {
  'n1-b6-s1-p1': (d: D) => { const r = RENG_AJUSTE_RQ[d.i!]!; const c = cf(r); return r.esp.reduce((s, f, j) => s + (j >= r.nr ? c[j]! * tot(f) : 0), 0) },
  'n1-b6-s1-p2': (d: D) => { const r = RENG_SINTESIS_RQ[d.i!]!; return masa(r, 0, d.x!, ult(r)) },
  'n1-b6-s1-p3': (d: D) => masa(RENG_SINTESIS_SIMPLE_RQ[d.i!]!, 0, d.x!, 1),
  'n1-b6-s2-p1': (d: D) => { const c = cf(RENG_DOS_REACTIVOS_RQ[d.i!]!); return (d.x! * c[1]!) / c[0]! },
  'n1-b6-s2-p2': (d: D) => { const r = RENG_DOS_REACTIVOS_RQ[d.i!]!; const c = cf(r); return (d.x! * c[r.nr]!) / c[0]! },
  'n1-b6-s2-p3': (d: D) => { const r = RENG_DOS_REACTIVOS_RQ[d.i!]!; const c = cf(r); return Math.min(d.x! / c[0]!, d.y! / c[1]!) * c[r.nr]! },
  'n1-b6-s3-p1': (d: D) => cf(RENG_AJUSTE_RQ[d.i!]!).reduce((a, b) => a + b, 0),
  'n1-b6-s3-p2': (d: D) => { const r = RENG_AJUSTE_DOS[d.i!]!; const c = cf(r); return r.esp.slice(0, r.nr).reduce((s, f, j) => s + ((d.x! * c[j]!) / c[0]!) * mm(f), 0) },
  'n1-b6-s3-p3': (d: D) => { const r = RENG_AJUSTE_RQ[d.i!]!; return masa(r, 0, d.x!, ult(r)) },
  'n1-b6-s4-p1': (d: D) => masa(RENG_SINTESIS_SIMPLE_RQ[d.i!]!, 0, d.x!, 2),
  'n1-b6-s4-p2': (d: D) => masa(RENG_OXIDACION_METAL[d.i!]!, 0, d.x!, 2) - d.x!,
  'n1-b6-s4-p3': (d: D) => { const g = RENG_GAS_ABIERTO_RQ[d.i!]!; return masa(g.rx, 0, d.x!, g.gas) },
  'n1-b6-s5-p1': (d: D) => Math.max(...cf(RENG_AJUSTE_RQ[d.i!]!)),
  'n1-b6-s5-p2': (d: D) => { const r = RENG_AJUSTE_RQ[d.i!]!; return cf(r)[r.nr]! },
  'n1-b6-s5-p3': (d: D) => masa(RENG_AJUSTE_DOS[d.i!]!, 0, d.x!, 1),
  'n1-b6-s6-p1': (d: D) => comb(d.i!)[1]!,
  'n1-b6-s6-p2': (d: D) => comb(d.i!).reduce((a, b) => a + b, 0),
  'n1-b6-s6-p3': (d: D) => comb(d.i!)[1]! / comb(d.i!)[0]!,
  'n1-b6-s7-p1': (d: D) => redox(d.i!).cRed / redox(d.i!).cOx,
  'n1-b6-s7-p2': (d: D) => redox(d.i!).e,
  'n1-b6-s7-p3': (d: D) => ((d.x! * redox(d.i!).cOx) / redox(d.i!).cRed) * mm(RENG_SAL_OXIDANTE_RQ[RENG_REDOX_RQ[d.i!]!.ox]!),
  'n1-b6-s8-p1': (d: D) => { const r = RENG_SINTESIS_DOS_RQ[d.i!]!; return masa(r, 1, d.x!, ult(r)) },
  'n1-b6-s8-p2': (d: D) => { const r = RENG_SINTESIS_DOS_RQ[d.i!]!; return masa(r, ult(r), d.x!, 0) },
  'n1-b6-s8-p3': (d: D) => { const r = RENG_SINTESIS_DOS_RQ[d.i!]!; return Math.min(masa(r, 0, d.x!, ult(r)), masa(r, 1, d.y!, ult(r))) },
  'n1-b6-s9-p1': (d: D) => { const g = RENG_DESC_GAS[d.i!]!; return masa(g.r, 0, d.x!, g.gas) },
  'n1-b6-s9-p2': (d: D) => { const g = RENG_DESC_GAS[d.i!]!; let s = 0; for (let j = g.r.nr; j < g.r.esp.length; j++) if (j !== g.gas) s += masa(g.r, 0, d.x!, j); return s },
  'n1-b6-s9-p3': (d: D) => { const g = RENG_DESC_GAS[d.i!]!; return masa(g.r, g.gas, d.x!, 0) },
  'n1-b6-s10-p1': (d: D) => { const r = RENG_DESPLAZAMIENTO_RQ[d.i!]!; return masa(r, 0, d.x!, ult(r)) },
  'n1-b6-s10-p2': (d: D) => { const r = RENG_DESPLAZAMIENTO_RQ[d.i!]!; return masa(r, ult(r), d.x!, 0) },
  'n1-b6-s10-p3': (d: D) => { const r = RENG_METAL_ACIDO[d.i!]!; const c = cf(r); return (d.x! / mm(r.esp[0]!) / c[0]!) * c[ult(r)]! },
  'n1-b6-s11-p1': (d: D) => { const g = RENG_DOBLE_PPT[d.i!]!; return masa(g.r, 0, d.x!, g.ppt) },
  'n1-b6-s11-p2': (d: D) => masa(RENG_DOBLE_PPT[d.i!]!.r, 0, d.x!, 1),
  'n1-b6-s11-p3': (d: D) => { const g = RENG_DOBLE_PPT[d.i!]!; return masa(g.r, 0, d.x!, g.ppt + 1) },
  'n1-b6-s12-p1': (d: D) => { const g = RENG_DOBLE_PPT[d.i!]!; const c = cf(g.r); return ((d.x! / 1000) * d.y! / c[0]!) * c[g.ppt]! * mm(g.r.esp[g.ppt]!) },
  'n1-b6-s12-p2': (d: D) => { const c = cf(RENG_DOBLE_PPT[d.i!]!.r); return rengBiseccion((v) => v * d.y! - (d.x! * d.y! * c[1]!) / c[0]!, 0, 10000) },
  'n1-b6-s12-p3': (d: D) => { const g = RENG_DOBLE_PPT[d.i!]!; const c = cf(g.r); return Math.min((d.x! / 1000) * 0.1 / c[0]!, (d.y! / 1000) * 0.1 / c[1]!) * c[g.ppt]! * mm(g.r.esp[g.ppt]!) },
  'n1-b6-s13-p1': (d: D) => { const c = cf(RENG_NEUTRALIZACION_RQ[d.i!]!); return rengBiseccion((v) => 0.1 * v - (d.x! * d.y! * c[1]!) / c[0]!, 0, 100000) },
  'n1-b6-s13-p2': (d: D) => { const c = cf(RENG_NEUTRALIZACION_RQ[d.i!]!); return rengBiseccion((cc) => (cc / 1000) * 25 - (d.x! * 0.1 * c[0]!) / c[1]!, 0, 100000) },
  'n1-b6-s13-p3': (d: D) => { const r = RENG_NEUTRALIZACION_RQ[d.i!]!; const c = cf(r); return ((d.x! * c[r.nr]!) / c[0]!) * mm(r.esp[r.nr]!) },
  'n1-b6-s14-p1': (d: D) => { const c = comb(d.i!); const n = d.x! / mm(rengFCombRq(RENG_COMBUSTIBLES_RQ[d.i!]!)); return ((n * c[2]!) / c[0]!) * mm('CO2') },
  'n1-b6-s14-p2': (d: D) => { const c = comb(d.i!); const n = d.x! / mm(rengFCombRq(RENG_COMBUSTIBLES_RQ[d.i!]!)); return ((n * c[1]!) / c[0]!) * mm('O2') },
  'n1-b6-s14-p3': (d: D) => { const c = comb(d.i!); const n = d.x! / mm(rengFCombRq(RENG_COMBUSTIBLES_RQ[d.i!]!)); return ((n * c[3]!) / c[0]!) * mm('H2O') },
  'n1-b6-s15-p1': (d: D) => { const r = RENG_REVERSIBLES_RQ[d.i!]!; const c = cf(r); return ((d.x! * d.y!) / 100) * (c[r.nr]! / c[0]!) },
  'n1-b6-s15-p2': (d: D) => d.x! - (d.x! * d.y!) / 100,
  'n1-b6-s15-p3': (d: D) => { const r = RENG_REVERSIBLES_RQ[d.i!]!; const c = cf(r); const np = ((d.x! * d.y!) / 100) * (r.nu[r.nr]! / r.nu[0]!); return ((np * c[0]!) / c[r.nr]! / d.x!) * 100 },
  'n1-b6-s16-p1': (d: D) => { const e = RENG_EXOTERMICAS_RQ[d.i!]!; return (d.x! / mm(e.f)) * Math.abs(e.dh) },
  'n1-b6-s16-p2': (d: D) => { const e = RENG_EXOTERMICAS_RQ[d.i!]!; return rengBiseccion((m) => (m / mm(e.f)) * Math.abs(e.dh) - d.x!, 0, 1e6) },
  'n1-b6-s16-p3': (d: D) => { const e = RENG_EXOTERMICAS_RQ[d.i!]!; return rengBiseccion((dt) => d.y! * 4.184 * dt - (d.x! / mm(e.f)) * Math.abs(e.dh) * 1000, 0, 1000) },
  'n1-b6-s17-p1': (d: D) => { const e = RENG_ENDOTERMICAS_RQ[d.i!]!; return (d.x! / mm(e.f)) * e.dh },
  'n1-b6-s17-p2': (d: D) => { const e = RENG_ENDOTERMICAS_RQ[d.i!]!; return rengBiseccion((m) => (m / mm(e.f)) * e.dh - d.x!, 0, 1e6) },
  'n1-b6-s17-p3': (d: D) => { const e = RENG_ENDOTERMICAS_RQ[d.i!]!; const q = (d.x! / mm(e.f)) * e.dh; return q / (d.x! / mm(e.f)) },
  'n1-b6-s18-p1': (d: D) => { const c = RENG_CAMBIOS_OX_RQ[d.i!]!; return Math.abs(ox(c.a, c.el) - ox(c.de, c.el)) },
  'n1-b6-s18-p2': (d: D) => { const c = RENG_CAMBIOS_OX_RQ[d.i!]!; return d.x! * Math.abs(ox(c.a, c.el) - ox(c.de, c.el)) * cnt(c.de, c.el) },
  'n1-b6-s18-p3': (d: D) => { const c = RENG_CAMBIOS_OX_RQ[d.i!]!; return (d.x! / (Math.abs(ox(c.a, c.el) - ox(c.de, c.el)) * cnt(c.de, c.el))) * mm(c.de) },
  'n1-b6-s19-p1': (d: D) => { const a = RENG_OXIDANTES_RQ[d.i!]!; return eAg(a.f, a.el, a.prod) },
  'n1-b6-s19-p2': (d: D) => { const a = RENG_OXIDANTES_RQ.filter((x) => x.f !== 'FeCl3')[d.i!]!; return d.x! * eAg(a.f, a.el, a.prod) },
  'n1-b6-s19-p3': (d: D) => { const a = RENG_OXIDANTES_RQ.filter((x) => x.f !== 'FeCl3')[d.i!]!; return (d.x! / eAg(a.f, a.el, a.prod)) * mm(a.f) },
  'n1-b6-s20-p1': (d: D) => { const a = RENG_REDUCTORES_RQ[d.i!]!; return (d.x! / mm(a.f)) * eAg(a.f, a.el, a.prod) },
  'n1-b6-s20-p2': (d: D) => { const a = RENG_REDUCTORES_RQ[d.i!]!; return (d.x! / eAg(a.f, a.el, a.prod)) * mm(a.f) },
  'n1-b6-s20-p3': (d: D) => { const a = RENG_METALES_ACIDO_RQ[d.i!]!; const r = rengAjustarEcuacion(`${a.f} + HCl -> ${a.prod} + H2`); const t = [...r.reactivos, ...r.productos]; return (d.x! / mm(a.f) / t[0]!.coef) * t[3]!.coef },
  'n1-b6-i1': (d: D) => { const c = comb(d.i!); const n = d.m! / mm(rengFCombRq(RENG_COMBUSTIBLES_RQ[d.i!]!)); return (n / c[0]!) * (c[2]! * mm('CO2') + c[3]! * mm('H2O')) },
  'n1-b6-i2': (d: D) => { const a = rengAjustarEcuacion('H2SO4 + Ba(OH)2 -> BaSO4 + H2O'); return (d.v! / 1000) * d.c! * (a.productos[0]!.coef / a.reactivos[0]!.coef) * mm('BaSO4') },
  'n1-b6-i3': (d: D) => (d.m! / mm('Cu')) * (ox('CuCl2', 'Cu') - 0),
  'n1-b6-i4': (d: D) => { const a = rengAjustarEcuacion('H2 + O2 -> H2O'); return (d.m! / mm('H2')) * (a.productos[0]!.coef / a.reactivos[0]!.coef) * 286 },
  'n1-b6-i5': (d: D) => { const a = rengAjustarIonElectron('MnO4- + Fe2+ -> Mn2+ + Fe3+', 'acido'); const t = [...a.reactivos, ...a.productos]; return ((d.c! * d.v! * t.find((x) => x.entrada === 'Fe2+')!.coef) / t.find((x) => x.entrada === 'MnO4-')!.coef / 25) * 1000 },
  'n1-b6-i6': (d: D) => { const r = RENG_REV_DOS_RQ[d.i!]!; const c = cf(r); return Math.min(d.a! / c[0]!, d.b! / c[1]!) * (d.p! / 100) * c[r.nr]! }
}
