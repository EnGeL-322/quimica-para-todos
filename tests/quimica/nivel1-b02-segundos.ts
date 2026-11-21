import { rengConvertir } from '../../src/renderer/lib/unidades'
import { rengOcupacion, rengPorSimbolo } from '../../src/renderer/modules/tabla-periodica/data'
import { rengBiseccion } from '../../src/renderer/modules/simulador-quimica/aprender/n1/numericos'
import { rengLecturasAtomo, rengValenciaDe } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/atomo'
import { rengLecturasEspectro } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/espectro-hidrogeno'
import { rengAnalizarFormula } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { RENG_CATIONES_AT, RENG_ELEMENTOS_AUFBAU_AT, RENG_IONES_AT, RENG_ISOBAROS_AT, RENG_BETA_AT, RENG_NUCLIDOS_AT, RENG_PARES_ISO_AT, RENG_REPRESENTATIVOS_AT } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b02-comun'
import { RENG_IONES_GAS_NOBLE_AT, RENG_Z_CAPA3_AT } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b02-integradores'
import {
  RENG_COMPUESTOS_DALTON_AT, RENG_ENLACE_AT, RENG_ESPECIES_BOHR_AT, RENG_MAQUETAS_AT, RENG_PARES_MULTIPLES_AT, RENG_TIPOS_CAPA_AT, rengRadioNucleoAt
} from '../../src/renderer/modules/simulador-quimica/practicas-n1/b02-s01-s08'
import { RENG_ELEMENTOS_UMA_AT, RENG_IONES_GAS_AT, RENG_PARES_LIGEROS_AT } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b02-s09-s16'
import { RENG_IONES_TRANSICION_AT, RENG_MOLECULAS_VALENCIA_AT, RENG_SUB_CONFIG_AT, RENG_SUBNIVELES_AT, RENG_TIPOS_SUB_AT } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b02-s17-s25'
import type { RengSegundoMetodo } from './nivel1-comun'

type D = Readonly<Record<string, number>>
const NA = 6.02214076e23
const H = 6.62607015e-34
const C = 299792458
const MP = 1.007276
const ME = 0.00054858
const eJ = rengConvertir(1, 'eV', 'J')
const Z = (rengS: string): number => rengPorSimbolo.get(rengS)!.z
const Ae = (rengS: string): number => rengPorSimbolo.get(rengS)!.masa
const at = (rengZ: number, rengN: number, rengQ = 0): Readonly<Record<string, number>> => rengLecturasAtomo({ Z: rengZ, N: rengN, q: rengQ }) as Readonly<Record<string, number>>
const esp = (rengA: number, rengB: number): Readonly<Record<string, number>> => rengLecturasEspectro({ nAlto: rengA, nBajo: rengB }) as Readonly<Record<string, number>>
const cnt = (rengF: string, rengEl: string): number => rengAnalizarFormula(rengF).atomos.get(rengEl) ?? 0
const L = 'spdf'
const cap = (rengSub: string): number => 2 * (2 * L.indexOf(rengSub[1]!) + 1)
const oc = (rengZ: number): Array<[string, number]> => [...rengOcupacion(rengZ).entries()].filter(([, rengK]) => rengK > 0)
const ocSub = (rengZ: number, rengSub: string): number => rengOcupacion(rengZ).get(rengSub) ?? 0
const ocCapa = (rengZ: number, rengN: number): number => oc(rengZ).filter(([rengS]) => Number(rengS[0]) === rengN).reduce((rengA, [, rengK]) => rengA + rengK, 0)
const madelung = (rengS: string): number => (Number(rengS[0]) + L.indexOf(rengS[1]!)) * 10 + Number(rengS[0])
const ultimo = (rengZ: number): [string, number] => oc(rengZ).sort((rengA, rengB) => madelung(rengA[0]) - madelung(rengB[0])).at(-1)!
const buscarZ = (rengOk: (rengZ: number) => boolean): number => { for (let rengZ = 1; rengZ <= 110; rengZ++) if (rengOk(rengZ)) return rengZ; return Number.NaN }
const media = (rengI: number): number => { const p = RENG_PARES_ISO_AT[rengI]!; return p.m1 + (p.m2 - p.m1) * (1 - p.x1) }
const repartir = (rengE: number, rengOrb: number): number => { const o = new Array<number>(rengOrb).fill(0); for (let k = 0; k < rengE; k++) o[k % rengOrb]! += 1; return o.filter((v) => v === 1).length }
const dIon = (rengS: string, rengQ: number): number => ocSub(Z(rengS), '3d') + ocSub(Z(rengS), '4s') - rengQ
const gases = [2, 10, 18, 36, 54]
const cargaOcteto = (rengZ: number): number => [1, -1, 2, -2, 3, -3].find((rengQ) => gases.includes(rengZ - rengQ))!
const esfera = (rengD: number): number => (4 / 3) * Math.PI * (rengD / 2) ** 3

export const RENG_SEGUNDOS_B02: Readonly<Record<string, RengSegundoMetodo>> = {
  'n1-b2-s1-p1': (d: D) => rengConvertir(d.x! * 1e-10, 'm', 'nm') / rengConvertir(d.y! * 1e-15, 'm', 'nm') / 1000,
  'n1-b2-s1-p2': (d: D) => esfera(d.x! * 1e-10) / esfera(d.y! * 1e-15) / 1e12,
  'n1-b2-s1-p3': (d: D) => rengConvertir((RENG_MAQUETAS_AT[d.i!]![1] * (d.x! * 1e-10)) / (d.y! * 1e-15), 'cm', 'm'),
  'n1-b2-s2-p1': (d: D) => { const [, f, a, b] = RENG_COMPUESTOS_DALTON_AT[d.i!]!; return (d.x! * cnt(f, b)) / cnt(f, a) },
  'n1-b2-s2-p2': (d: D) => { const [, f, a, b] = RENG_COMPUESTOS_DALTON_AT[d.i!]!; return (d.x! / (cnt(f, a) * Ae(a))) * cnt(f, b) * Ae(b) },
  'n1-b2-s2-p3': (d: D) => { const [el, f1, f2] = RENG_PARES_MULTIPLES_AT[d.i!]!; return (cnt(f2, 'O') * cnt(f1, el)) / (cnt(f2, el) * cnt(f1, 'O')) },
  'n1-b2-s3-p1': (d: D) => (d.x! * 1.602176634e-19) / eJ,
  'n1-b2-s3-p2': (d: D) => d.x! / 1000 / eJ / 1e15,
  'n1-b2-s3-p3': (d: D) => { const [, a, q] = RENG_CATIONES_AT[d.i!]!; return rengConvertir(a, 'u', 'kg') / q / rengConvertir(ME, 'u', 'kg') / 1000 },
  'n1-b2-s4-p1': (d: D) => rengConvertir(d.x!, 'µm', 'nm') / 0.288 / 1000,
  'n1-b2-s4-p2': (d: D) => ((Math.PI * (d.x! * 1e-15) ** 2) / (Math.PI * (d.y! * 1e-12) ** 2)) * 1e9,
  'n1-b2-s4-p3': (d: D) => { const [, a] = RENG_NUCLIDOS_AT[d.i!]!; const v = (4 / 3) * Math.PI * (rengRadioNucleoAt(a) * 1e-15) ** 3; return rengBiseccion((rho) => rho * 1e17 * v - rengConvertir(a, 'u', 'kg'), 0, 100) },
  'n1-b2-s5-p1': (d: D) => { const [, z] = RENG_ESPECIES_BOHR_AT[d.i!]!; return -esp(8, d.x!).Ebajo! * z * z },
  'n1-b2-s5-p2': (d: D) => esp(d.x!, d.y!).dE!,
  'n1-b2-s5-p3': (d: D) => (rengConvertir(esp(d.x!, d.y!).dE!, 'eV', 'J') * NA) / 1000,
  'n1-b2-s6-p1': (d: D) => { const [t] = RENG_TIPOS_CAPA_AT[d.i!]!; let sub = 0; let orb = 0; for (let l = 0; l < d.x!; l++) { sub += 1; for (let m = -l; m <= l; m++) orb += 1 } return t === 'subniveles' ? sub : t === 'orbitales' ? orb : 2 * orb },
  'n1-b2-s6-p2': (d: D) => rengBiseccion((lam) => lam * 1e-9 * 9.1093837e-31 * d.x! * 1e6 - H, 1e-6, 1e6),
  'n1-b2-s6-p3': (d: D) => { let orb = 0; for (let n = 1; n <= d.x!; n++) for (let l = 0; l < n; l++) orb += 2 * l + 1; return d.i === 0 ? orb : 2 * orb },
  'n1-b2-s7-p1': (d: D) => { const [s, a] = RENG_NUCLIDOS_AT[d.i!]!; return at(Z(s), a - Z(s)).masa! },
  'n1-b2-s7-p2': (d: D) => rengBiseccion((k) => k * ME - d.x! * MP, 0, 1e6),
  'n1-b2-s7-p3': (d: D) => { const [s, a, m] = RENG_ENLACE_AT[d.i!]!; return rengConvertir((at(Z(s), a - Z(s)).masa! - m) * 931.494e6, 'eV', 'MeV') },
  'n1-b2-s8-p1': (d: D) => { const [s, a] = RENG_NUCLIDOS_AT[d.i!]!; return at(Z(s), a - Z(s)).n! },
  'n1-b2-s8-p2': (d: D) => { const [s, a, q] = RENG_IONES_AT[d.i!]!; return at(Z(s), a - Z(s), q).e! },
  'n1-b2-s8-p3': (d: D) => { const [s, a, q] = RENG_IONES_AT[d.i!]!; const r = at(Z(s), a - Z(s), q); return r.p! + r.n! + r.e! },
  'n1-b2-s9-p1': (d: D) => { const [s, , q] = RENG_IONES_AT[d.i!]!; const e = Z(s) - q; return buscarZ((z) => at(z, 0, q).e === e && at(z, 0, q).carga === q) },
  'n1-b2-s9-p2': (d: D) => { const [s, a] = RENG_NUCLIDOS_AT[d.i!]!; const n = a - Z(s); return buscarZ((z) => at(z, n).A === a) },
  'n1-b2-s9-p3': (d: D) => { const [s, a] = RENG_NUCLIDOS_AT[d.i!]!; const n = a - Z(s); const t = a + Z(s); return buscarZ((z) => { const r = at(z, n); return r.p! + r.n! + r.e! === t }) },
  'n1-b2-s10-p1': (d: D) => { const [s, a] = RENG_NUCLIDOS_AT[d.i!]!; return at(Z(s), a - Z(s)).A! },
  'n1-b2-s10-p2': (d: D) => { const [s, a, q] = RENG_IONES_AT[d.i!]!; return at(Z(s), a - Z(s), q).A! },
  'n1-b2-s10-p3': (d: D) => { const [, a] = RENG_NUCLIDOS_AT[d.i!]!; return rengConvertir(d.x! * 1e20 * a, 'u', 'mg') },
  'n1-b2-s11-p1': (d: D) => { const p = RENG_PARES_ISO_AT[d.i!]!; return at(Z(p.s), p.a2 - Z(p.s)).n! },
  'n1-b2-s11-p2': (d: D) => { const p = RENG_PARES_ISO_AT[d.i!]!; return p.m1 + (p.m2 - p.m1) * (1 - d.x! / 100) },
  'n1-b2-s11-p3': (d: D) => { const p = RENG_PARES_ISO_AT[d.i!]!; const m = media(d.i!); return rengBiseccion((x) => p.m1 * (x / 100) + p.m2 * (1 - x / 100) - m, 0, 100) },
  'n1-b2-s12-p1': (d: D) => { const [, a, s2] = RENG_ISOBAROS_AT[d.i!]!; return at(Z(s2), a - Z(s2)).n! },
  'n1-b2-s12-p2': (d: D) => { const [s, a] = RENG_BETA_AT[d.i!]!; const r = at(Z(s) + 1, a - Z(s) - 1); return r.A === a ? r.n! : Number.NaN },
  'n1-b2-s12-p3': (d: D) => { const [, a, s2] = RENG_ISOBAROS_AT[d.i!]!; const n = a - Z(s2); return buscarZ((z) => at(z, n).A === a) },
  'n1-b2-s13-p1': (d: D) => { const [s, a] = RENG_NUCLIDOS_AT[d.i!]!; return at(Z(s) + d.x!, a - Z(s)).A! },
  'n1-b2-s13-p2': (d: D) => { const [s, a] = RENG_NUCLIDOS_AT[d.i!]!; const n = a - Z(s); return buscarZ((z) => at(z, n).A === a + d.x!) },
  'n1-b2-s13-p3': (d: D) => { const [s, a] = RENG_NUCLIDOS_AT[d.i!]!; const n = at(Z(s), a - Z(s)).n!; return buscarZ((z) => at(z, n).A === a + d.x!) },
  'n1-b2-s14-p1': (d: D) => { const [s, a, q] = RENG_IONES_AT[d.i!]!; return at(Z(s), a - Z(s), q).carga! },
  'n1-b2-s14-p2': (d: D) => cargaOcteto(Z(RENG_IONES_GAS_AT[d.i!]![0])),
  'n1-b2-s14-p3': (d: D) => { const [, , q] = RENG_IONES_AT[d.i!]!; return (d.x! / 1000) * q * (eJ * NA) },
  'n1-b2-s15-p1': (d: D) => media(d.i!),
  'n1-b2-s15-p2': (d: D) => { const p = RENG_PARES_ISO_AT[d.i!]!; const m = media(d.i!); return rengBiseccion((m2) => p.m1 * p.x1 + m2 * (1 - p.x1) - m, 0, 400) },
  'n1-b2-s15-p3': (d: D) => { const p = RENG_PARES_LIGEROS_AT[d.i!]!; return d.y! * (p.m1 + (p.m2 - p.m1) * (1 - d.x! / 100)) },
  'n1-b2-s16-p1': (d: D) => rengConvertir(Ae(RENG_ELEMENTOS_UMA_AT[d.i!]!), 'u', 'g') * 1e23,
  'n1-b2-s16-p2': (d: D) => (d.x! / 1000 / Ae(RENG_ELEMENTOS_UMA_AT[d.i!]!)) * NA / 1e19,
  'n1-b2-s16-p3': (d: D) => Ae(RENG_ELEMENTOS_UMA_AT[d.i!]!),
  'n1-b2-s17-p1': (d: D) => rengBiseccion((nu) => nu * 1e12 * d.x! * 1e-9 - C, 0, 1e7),
  'n1-b2-s17-p2': (d: D) => rengConvertir((H * C) / rengConvertir(d.x!, 'nm', 'm'), 'J', 'eV'),
  'n1-b2-s17-p3': (d: D) => (rengConvertir(rengConvertir((H * C) / (d.x! * 1e-9), 'J', 'eV'), 'eV', 'J') * NA) / 1000,
  'n1-b2-s18-p1': (d: D) => esp(d.x!, d.y!).lambda!,
  'n1-b2-s18-p2': (d: D) => { let k = 0; for (let a = d.y!; a <= d.x!; a++) for (let b = d.y!; b < a; b++) k += 1; return k },
  'n1-b2-s18-p3': (d: D) => { const lam = esp(d.x!, d.y!).lambda!; let mejor = 0; let dif = Infinity; for (let n = d.y! + 1; n <= 8; n++) { const e = Math.abs(esp(n, d.y!).lambda! - lam); if (e < dif) { dif = e; mejor = n } } return mejor },
  'n1-b2-s19-p1': (d: D) => { let k = 0; for (let m = -d.y!; m <= d.y!; m++) k += 2; return k },
  'n1-b2-s19-p2': (d: D) => { let k = 0; for (let l = 0; l < d.x!; l++) if (Math.abs(d.y!) <= l) k += 2; return k },
  'n1-b2-s19-p3': (d: D) => { let k = 0; for (let n = 1; n <= d.x!; n++) for (let l = 0; l < n; l++) if (l === d.y!) k += 2 * (2 * l + 1); return k },
  'n1-b2-s20-p1': (d: D) => { const l = L.indexOf(RENG_SUBNIVELES_AT[d.i!]![1]!); let k = 0; for (let m = -l; m <= l; m++) k += 1; return k },
  'n1-b2-s20-p2': (d: D) => oc(RENG_ELEMENTOS_AUFBAU_AT[d.i!]!).reduce((a, [s, k]) => a + Math.min(k, cap(s) / 2), 0),
  'n1-b2-s20-p3': (d: D) => oc(RENG_ELEMENTOS_AUFBAU_AT[d.i!]!).filter(([s]) => s[1] === 'p').reduce((a, [, k]) => a + k, 0),
  'n1-b2-s21-p1': (d: D) => ultimo(RENG_ELEMENTOS_AUFBAU_AT[d.i!]!)[1],
  'n1-b2-s21-p2': (d: D) => ocCapa([21, 22, 23, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38][d.i!]!, 3),
  'n1-b2-s21-p3': (d: D) => oc(RENG_ELEMENTOS_AUFBAU_AT[d.i!]!).length,
  'n1-b2-s22-p1': (d: D) => { let k = 0; for (let n = d.x!; n <= d.y!; n++) for (let l = 0; l < n; l++) for (let m = -l; m <= l; m++) k += 2; return k },
  'n1-b2-s22-p2': (d: D) => oc(RENG_ELEMENTOS_AUFBAU_AT[d.i!]!).reduce((a, [s, k]) => a + Math.max(0, k - cap(s) / 2), 0),
  'n1-b2-s22-p3': (d: D) => { const [s, k] = ultimo(RENG_ELEMENTOS_AUFBAU_AT[d.i!]!); return cap(s) - k },
  'n1-b2-s23-p1': (d: D) => oc(RENG_ELEMENTOS_AUFBAU_AT[d.i!]!).reduce((a, [s, k]) => a + (k <= cap(s) / 2 ? k : cap(s) - k), 0),
  'n1-b2-s23-p2': (d: D) => { const [, c] = RENG_TIPOS_SUB_AT[d.i!]!; const orb = c / 2; return d.x! <= orb ? repartir(d.x!, orb) : orb - (d.x! - orb) },
  'n1-b2-s23-p3': (d: D) => { const [s, q] = RENG_IONES_TRANSICION_AT[d.i!]!; const n = repartirD(dIon(s, q)); return Math.sqrt(n * n + 2 * n) },
  'n1-b2-s24-p1': (d: D) => { const [z, s] = RENG_SUB_CONFIG_AT[d.i!]!; return ocSub(z, s) },
  'n1-b2-s24-p2': (d: D) => { const z = RENG_ELEMENTOS_AUFBAU_AT[d.i!]!; return z - Math.max(...[2, 10, 18, 36].filter((g) => g < z)) },
  'n1-b2-s24-p3': (d: D) => { const [s, q] = RENG_IONES_TRANSICION_AT[d.i!]!; return dIon(s, q) },
  'n1-b2-s25-p1': (d: D) => rengValenciaDe(RENG_REPRESENTATIVOS_AT[d.i!]!),
  'n1-b2-s25-p2': (d: D) => { const z = Z(RENG_IONES_GAS_AT[d.i!]![0]); const r = at(z, z, cargaOcteto(z)); return r.carga! },
  'n1-b2-s25-p3': (d: D) => [...rengAnalizarFormula(RENG_MOLECULAS_VALENCIA_AT[d.i!]!).atomos.entries()].reduce((a, [s, n]) => a + rengValenciaDe(Z(s)) * n, 0),
  'n1-b2-i1': (d: D) => { const [s, a, q] = RENG_IONES_AT[d.i!]!; const r = at(Z(s), a - Z(s), q); return r.n! + r.e! },
  'n1-b2-i2': (d: D) => rengConvertir(media(d.i!), 'u', 'g') * 1e23,
  'n1-b2-i3': (d: D) => esp(d.a!, d.b!).nu! * 100,
  'n1-b2-i4': (d: D) => 18 - ocCapa(RENG_Z_CAPA3_AT[d.i!]!, 3),
  'n1-b2-i5': (d: D) => { const [s, a] = RENG_NUCLIDOS_AT[d.i!]!; return ((d.x! / 1000 / rengConvertir(a, 'u', 'g')) * at(Z(s), a - Z(s)).n!) / 1e20 },
  'n1-b2-i6': (d: D) => { const [s, a, q] = RENG_IONES_GAS_NOBLE_AT[d.i!]!; const e = Z(s) - q; const z = buscarZ((k) => at(k, 0, q).e === e && at(k, 0, q).carga === q); return at(z, a - z, q).n! }
}

function repartirD(rengD: number): number {
  const rengOrb = new Array<number>(5).fill(0)
  for (let rengK = 0; rengK < rengD; rengK++) rengOrb[rengK % 5]! += 1
  return rengOrb.filter((rengV) => rengV === 1).length
}
