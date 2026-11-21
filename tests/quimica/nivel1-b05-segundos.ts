import { rengPorSimbolo } from '../../src/renderer/modules/tabla-periodica/data'
import { rengBiseccion } from '../../src/renderer/modules/simulador-quimica/aprender/n1/numericos'
import { rengAnalizarFormula, rengMasaMolarDe } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { rengFormularDesdeNombre } from '../../src/renderer/modules/simulador-quimica/nucleo/nomenclatura'
import { rengEstadosOxidacion } from '../../src/renderer/modules/simulador-quimica/nucleo/oxidacion'
import {
  RENG_ANHIDRIDOS_NO, RENG_CENTRAL_NO, RENG_ELEMENTO_NO, RENG_HIDRACIDOS_NO, RENG_HIDRATOS_NO, RENG_HIDROXIDOS_NO, RENG_HIDRUROS_NM_NO, RENG_HIDRUROS_NO, RENG_INTERPRETAR_NO, RENG_IONES_NO, RENG_METAL_OX_NO,
  RENG_OXIDO_A_HIDROXIDO_NO, RENG_OXIDOS_METAL_NO, RENG_OXIDOS_NM_NO, RENG_OXIDOS_SIS_NO, RENG_OXISALES_NO, RENG_OXOACIDOS_NO, RENG_PARENTESIS_NO, RENG_PEROXIDOS_NO, RENG_SALES_ACIDAS_NO, RENG_SALES_BASICAS_NO,
  RENG_SALES_BINARIAS_NO, RENG_SISTEMATICA_NO, RENG_STOCK_NO, RENG_TRADICIONAL_NO, type RengIonSimpleNo
} from '../../src/renderer/modules/simulador-quimica/practicas-n1/b05-comun'
import { RENG_BICARBONATOS_NO, RENG_PARES_NO, RENG_PARES_OXO_NO, RENG_PARES_POLI_NO } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b05-s15-s20'
import { RENG_BICARB_CLORURO_NO, RENG_CADENAS_NO, RENG_TRAD_I5_NO } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b05-integradores'
import type { RengSegundoMetodo } from './nivel1-comun'

type D = Readonly<Record<string, number>>
const Ae = (rengEl: string): number => rengPorSimbolo.get(rengEl)!.masa
const Fn = (rengN: string): string => rengFormularDesdeNombre(rengN).formula
const mm = (rengF: string): number => rengMasaMolarDe(rengF)
const cnt = (rengF: string, rengEl: string): number => rengAnalizarFormula(rengF).atomos.get(rengEl) ?? 0
const tot = (rengF: string): number => [...rengAnalizarFormula(rengF).atomos.values()].reduce((rengA, rengB) => rengA + rengB, 0)
const ox = (rengF: string, rengEl: string): number => rengEstadosOxidacion(rengAnalizarFormula(rengF))!.get(rengEl)!
const primero = (rengF: string): string => /[A-Z][a-z]?/.exec(rengF)![0]
const r3 = (rengX: number): number => Math.round(rengX * 1000) / 1000
const ionF = (rengI: RengIonSimpleNo, rengN: number): string => (rengN === 1 ? rengI.s : tot(rengI.s) > 1 ? `(${rengI.s})${rengN}` : `${rengI.s}${rengN}`)
const par = (rengC: RengIonSimpleNo, rengA: RengIonSimpleNo) => {
  let rengL = Math.max(rengC.z, rengA.z)
  while (rengL % rengC.z !== 0 || rengL % rengA.z !== 0) rengL++
  const rengNc = rengL / rengC.z
  const rengNa = rengL / rengA.z
  return { f: `${ionF(rengC, rengNc)}${ionF(rengA, rengNa)}`, nc: rengNc, na: rengNa }
}
const NO_SAL: Readonly<Record<string, number>> = { H: 1, O: -2, Cl: -1, N: 5, C: 4, S: 6 }
const oxBasica = (rengF: string, rengMetal: string): number => {
  let rengS = 0
  for (const [rengEl, rengN] of rengAnalizarFormula(rengF).atomos) if (rengEl !== rengMetal) rengS += NO_SAL[rengEl]! * rengN
  return -rengS / cnt(rengF, rengMetal)
}
const noOx = (rengF: string): string => [...rengAnalizarFormula(rengF).atomos.keys()].find((rengEl) => rengEl !== 'O' && rengEl !== 'H')!

export const RENG_SEGUNDOS_B05: Readonly<Record<string, RengSegundoMetodo>> = {
  'n1-b5-s1-p1': (d: D) => tot(Fn(RENG_PARENTESIS_NO[d.i!]![0])),
  'n1-b5-s1-p2': (d: D) => { const [n, , el] = RENG_ELEMENTO_NO[d.i!]!; const f = Fn(n); return (d.x! * cnt(f, el) * Ae(el)) / mm(f) },
  'n1-b5-s1-p3': (d: D) => { const [n, , el] = RENG_ELEMENTO_NO[d.i!]!; return d.x! * cnt(Fn(n), el) },
  'n1-b5-s2-p1': (d: D) => ox(RENG_CENTRAL_NO[d.i!]!.f, RENG_CENTRAL_NO[d.i!]!.el),
  'n1-b5-s2-p2': (d: D) => ox(RENG_METAL_OX_NO[d.i!]!.f, RENG_METAL_OX_NO[d.i!]!.el),
  'n1-b5-s2-p3': (d: D) => ox(RENG_IONES_NO[d.i!]!.acido, RENG_IONES_NO[d.i!]!.el),
  'n1-b5-s3-p1': (d: D) => mm(Fn(RENG_SISTEMATICA_NO[d.i!]!.n)),
  'n1-b5-s3-p2': (d: D) => { const f = Fn(RENG_OXIDOS_SIS_NO[d.i!]!.n); return (d.x! * cnt(f, 'O') * Ae('O')) / mm(f) },
  'n1-b5-s3-p3': (d: D) => d.x! / mm(Fn(RENG_SISTEMATICA_NO[d.i!]!.n)),
  'n1-b5-s4-p1': (d: D) => mm(Fn(RENG_STOCK_NO[d.i!]!.n)),
  'n1-b5-s4-p2': (d: D) => { const s = RENG_STOCK_NO[d.i!]!; const f = Fn(s.n); return (d.x! * cnt(f, s.metal) * Ae(s.metal)) / mm(f) },
  'n1-b5-s4-p3': (d: D) => { const s = RENG_STOCK_NO[d.i!]!; const f = Fn(s.n); return (d.x! * mm(f)) / (cnt(f, s.metal) * Ae(s.metal)) },
  'n1-b5-s5-p1': (d: D) => ox(Fn(RENG_OXOACIDOS_NO[d.i!]!.n), RENG_OXOACIDOS_NO[d.i!]!.el),
  'n1-b5-s5-p2': (d: D) => d.x! * mm(Fn(RENG_TRADICIONAL_NO[d.i!]!.n)),
  'n1-b5-s5-p3': (d: D) => { const o = RENG_OXOACIDOS_NO[d.i!]!; const f = Fn(o.n); return (d.x! * cnt(f, o.el) * Ae(o.el)) / mm(f) },
  'n1-b5-s6-p1': (d: D) => { const m = RENG_OXIDOS_METAL_NO[d.i!]!; const f = Fn(m.n); return (d.x! / Ae(m.metal)) * (cnt(f, 'O') / cnt(f, m.metal)) * Ae('O') },
  'n1-b5-s6-p2': (d: D) => { const m = RENG_OXIDOS_METAL_NO[d.i!]!; const f = Fn(m.n); return (d.x! / Ae(m.metal) / cnt(f, m.metal)) * mm(f) },
  'n1-b5-s6-p3': (d: D) => { const f = Fn(RENG_OXIDOS_METAL_NO[d.i!]!.n); return (d.x! / mm(f)) * cnt(f, 'O') },
  'n1-b5-s7-p1': (d: D) => ox(RENG_OXIDOS_NM_NO[d.i!]!.f, RENG_OXIDOS_NM_NO[d.i!]!.el),
  'n1-b5-s7-p2': (d: D) => { const b = RENG_OXIDOS_SIS_NO[d.i!]!; const f = Fn(b.n); return (d.x! / Ae(b.x) / cnt(f, b.x)) * mm(f) },
  'n1-b5-s7-p3': (d: D) => { const b = RENG_OXIDOS_SIS_NO[d.i!]!; const f = Fn(b.n); return (d.x! / Ae(b.x)) * (cnt(f, 'O') / cnt(f, b.x)) * Ae('O') },
  'n1-b5-s8-p1': (d: D) => d.x! - (d.x! / mm('H2O2')) * mm('H2O'),
  'n1-b5-s8-p2': (d: D) => (d.x! / mm(Fn(RENG_PEROXIDOS_NO[d.i!]!.n)) / 2) * mm('O2'),
  'n1-b5-s8-p3': (d: D) => (d.x! / mm('O2')) * 2 * mm(Fn(RENG_PEROXIDOS_NO[d.i!]!.n)),
  'n1-b5-s9-p1': (d: D) => { const f = Fn(RENG_HIDRUROS_NO[d.i!]!.n); return (d.x! / mm(f)) * cnt(f, 'H') * mm('H2') },
  'n1-b5-s9-p2': (d: D) => { const f = Fn(RENG_HIDRUROS_NO[d.i!]!.n); return (d.x! * cnt(f, 'H') * Ae('H')) / mm(f) },
  'n1-b5-s9-p3': (d: D) => Math.abs(ox(RENG_HIDRUROS_NM_NO[d.i!]!.f, RENG_HIDRUROS_NM_NO[d.i!]!.el)),
  'n1-b5-s10-p1': (d: D) => d.x! * mm(Fn(RENG_HIDROXIDOS_NO[d.i!]!.n)),
  'n1-b5-s10-p2': (d: D) => { const o = RENG_OXIDO_A_HIDROXIDO_NO[d.i!]!; const fo = Fn(o.oxido); const fh = Fn(o.hidroxido); return (d.x! / mm(fo)) * (cnt(fo, o.metal) / cnt(fh, o.metal)) * mm(fh) },
  'n1-b5-s10-p3': (d: D) => { const f = Fn(RENG_HIDROXIDOS_NO[d.i!]!.n); return (d.x! / mm(f)) * cnt(f, 'O') },
  'n1-b5-s11-p1': (d: D) => (d.x! / 1000) * d.y! * mm(Fn(RENG_HIDRACIDOS_NO[d.i!]!.gas)),
  'n1-b5-s11-p2': (d: D) => { const h = RENG_HIDRACIDOS_NO[d.i!]!; const f = Fn(h.gas); return (d.x! * cnt(f, h.x) * Ae(h.x)) / mm(f) },
  'n1-b5-s11-p3': (d: D) => { const h = RENG_HIDRACIDOS_NO[d.i!]!; const f = Fn(h.gas); return (d.x! / mm(f)) * (cnt(f, h.x) / cnt(h.sal, h.x)) * mm(h.sal) },
  'n1-b5-s12-p1': (d: D) => ox(RENG_OXOACIDOS_NO[d.i!]!.f, RENG_OXOACIDOS_NO[d.i!]!.el),
  'n1-b5-s12-p2': (d: D) => { const a = RENG_ANHIDRIDOS_NO[d.i!]!; const fo = Fn(a.oxido); const fa = Fn(a.acido); const el = noOx(fo); return (d.x! / mm(fo)) * (cnt(fo, el) / cnt(fa, el)) * mm(fa) },
  'n1-b5-s12-p3': (d: D) => { const f = Fn(RENG_OXOACIDOS_NO[d.i!]!.n); return (d.x! * cnt(f, 'O') * Ae('O')) / mm(f) },
  'n1-b5-s13-p1': (d: D) => mm(Fn(RENG_SALES_BINARIAS_NO[d.i!]!.n)),
  'n1-b5-s13-p2': (d: D) => { const s = RENG_SALES_BINARIAS_NO[d.i!]!; const f = Fn(s.n); return (d.x! * cnt(f, s.an) * Ae(s.an)) / mm(f) },
  'n1-b5-s13-p3': (d: D) => { const s = RENG_SALES_BINARIAS_NO[d.i!]!; const f = Fn(s.n); return (d.x! / Ae(s.cat) / cnt(f, s.cat)) * mm(f) },
  'n1-b5-s14-p1': (d: D) => d.x! * mm(Fn(RENG_OXISALES_NO[d.i!]!.n)),
  'n1-b5-s14-p2': (d: D) => { const s = RENG_OXISALES_NO[d.i!]!; const f = Fn(s.n); return (d.x! * cnt(f, s.el) * Ae(s.el)) / mm(f) },
  'n1-b5-s14-p3': (d: D) => { const s = RENG_OXISALES_NO[d.i!]!; const r = rengEstadosOxidacion(rengAnalizarFormula(Fn(s.n))); return r ? r.get(s.el)! : ox(`H${s.za === 1 ? '' : s.za}${s.an}`, s.el) },
  'n1-b5-s15-p1': (d: D) => mm(Fn(RENG_SALES_ACIDAS_NO[d.i!]!.n)),
  'n1-b5-s15-p2': (d: D) => { const f = Fn(RENG_SALES_ACIDAS_NO[d.i!]!.n); return (d.x! / mm(f)) * (cnt(f, 'H') - 4 * cnt(f, 'N')) },
  'n1-b5-s15-p3': (d: D) => { const f = Fn(RENG_BICARBONATOS_NO[d.i!]!.n); return (d.x! / mm(f)) * cnt(f, 'C') * mm('CO2') },
  'n1-b5-s16-p1': (d: D) => mm(RENG_SALES_BASICAS_NO[d.i!]!.f),
  'n1-b5-s16-p2': (d: D) => oxBasica(RENG_SALES_BASICAS_NO[d.i!]!.f, RENG_SALES_BASICAS_NO[d.i!]!.metal),
  'n1-b5-s16-p3': (d: D) => { const s = RENG_SALES_BASICAS_NO[d.i!]!; return (d.x! * cnt(s.f, s.metal) * Ae(s.metal)) / mm(s.f) },
  'n1-b5-s17-p1': (d: D) => { const h = RENG_HIDRATOS_NO[d.i!]!; const f = Fn(h.n); return (d.x! * (mm(f) - mm(h.sal))) / mm(f) },
  'n1-b5-s17-p2': (d: D) => { const h = RENG_HIDRATOS_NO[d.i!]!; const ma = r3((d.x! * mm(h.sal)) / mm(Fn(h.n))); return rengBiseccion((n) => (ma * (mm(h.sal) + n * mm('H2O'))) / mm(h.sal) - d.x!, 0, 30) },
  'n1-b5-s17-p3': (d: D) => (d.x! / 1000) * d.y! * mm(Fn(RENG_HIDRATOS_NO[d.i!]!.n)),
  'n1-b5-s18-p1': (d: D) => { const p = RENG_PARES_NO[d.i!]!; const q = par(p.c, p.a); return q.nc + q.na },
  'n1-b5-s18-p2': (d: D) => { const p = RENG_PARES_POLI_NO[d.i!]!; return mm(par(p.c, p.a).f) },
  'n1-b5-s18-p3': (d: D) => { const p = RENG_PARES_POLI_NO[d.i!]!; return tot(par(p.c, p.a).f) },
  'n1-b5-s19-p1': (d: D) => { const p = RENG_PARES_OXO_NO[d.i!]!; return cnt(par(p.c, p.a).f, 'O') },
  'n1-b5-s19-p2': (d: D) => { const p = RENG_PARES_NO[d.i!]!; const q = par(p.c, p.a); return (d.x! * q.nc * mm(p.c.s)) / mm(q.f) },
  'n1-b5-s19-p3': (d: D) => { const p = RENG_PARES_POLI_NO[d.i!]!; const q = par(p.c, p.a); return (d.x! * mm(q.f)) / (q.na * mm(p.a.s)) },
  'n1-b5-s20-p1': (d: D) => { const e = RENG_INTERPRETAR_NO[d.i!]!; const f = Fn(e.n); return (d.x! * cnt(f, e.el) * Ae(e.el)) / mm(f) },
  'n1-b5-s20-p2': (d: D) => d.x! / mm(Fn(RENG_INTERPRETAR_NO[d.i!]!.n)),
  'n1-b5-s20-p3': (d: D) => { const e = RENG_INTERPRETAR_NO[d.i!]!; const f = Fn(e.n); return (d.x! * mm(f)) / (cnt(f, e.el) * Ae(e.el)) },
  'n1-b5-i1': (d: D) => { const o = RENG_OXIDO_A_HIDROXIDO_NO[d.i!]!; const fh = Fn(o.hidroxido); return (d.m! / Ae(o.metal) / cnt(fh, o.metal)) * mm(fh) },
  'n1-b5-i2': (d: D) => { const c = RENG_CADENAS_NO[d.i!]!; const f = Fn(c.salNombre); return (d.m! / Ae(c.el) / cnt(f, c.el)) * mm(f) },
  'n1-b5-i3': (d: D) => { const h = RENG_HIDRATOS_NO[d.i!]!; const f = Fn(h.n); const el = primero(h.sal); return (d.m! * cnt(f, el) * Ae(el)) / mm(f) },
  'n1-b5-i4': (d: D) => { const s = RENG_BICARBONATOS_NO[d.i!]!; const f = Fn(s.n); const k = RENG_BICARB_CLORURO_NO[d.i!]!.cloruro; return (d.m! / mm(f)) * mm(k) },
  'n1-b5-i5': (d: D) => {
    const t = RENG_TRAD_I5_NO[d.i!]!
    const f1 = Fn(t.n)
    const an = primero(t.an)
    const rengL = (z: number): number => { let l = Math.max(z, t.za); while (l % z !== 0 || l % t.za !== 0) l++; return l / t.za / (l / z) }
    return cnt(f1, an) / cnt(f1, t.metal) / (rengL(t.otra) * cnt(t.an, an))
  },
  'n1-b5-i6': (d: D) => { const p = RENG_PEROXIDOS_NO[d.i!]!; const f = Fn(p.n); const fh = p.z === 1 ? `${p.metal}OH` : `${p.metal}(OH)${p.z}`; return (d.m! / mm(f)) * cnt(f, p.metal) * mm(fh) }
}
