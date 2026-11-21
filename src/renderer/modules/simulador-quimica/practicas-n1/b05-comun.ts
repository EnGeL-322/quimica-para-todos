import { rengTx } from '../aprender/n1/gases/constantes'
import { RENG_PROCEDENCIA_NOMBRES, RENG_S24, RENG_S26, RENG_S27, RENG_S42N, rengSeccionNom } from '../aprender/n1/nomenclatura/comun'
import { RENG_PROCEDENCIA_MASAS } from '../aprender/n1/procedencia'
import type { RengToleranciaN1 } from '../aprender/n1/tipos'
import { rengPorSimbolo } from '../../tabla-periodica/data'
import { rengSubindice } from '../nucleo/formula'
import { rengEntreN1, rengIndice } from './aleatorio'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

export const RENG_TOL_NO: RengToleranciaN1 = { rel: 0.005, abs: 1e-6 }
export const RENG_TOL_NO_ENT: RengToleranciaN1 = { rel: 0.001, abs: 0.02 }

const RENG_SECCIONES_NO = { '2.4': RENG_S24, '2.6': RENG_S26, '2.7': RENG_S27, '4.2': RENG_S42N }

export const rengAtomosNo = (rengF: string): Map<string, number> => {
  const rengTotal = new Map<string, number>()
  const rengSumar = (rengDestino: Map<string, number>, rengOrigen: Map<string, number>, rengK: number): void => {
    for (const [rengEl, rengN] of rengOrigen) rengDestino.set(rengEl, (rengDestino.get(rengEl) ?? 0) + rengN * rengK)
  }
  const rengParte = (rengTexto: string): Map<string, number> => {
    const rengPila: Map<string, number>[] = [new Map()]
    let rengI = 0
    const rengNumero = (): number => {
      let rengS = ''
      while (rengI < rengTexto.length && /[0-9]/.test(rengTexto[rengI]!)) rengS += rengTexto[rengI++]
      return rengS === '' ? 1 : Number(rengS)
    }
    while (rengI < rengTexto.length) {
      const rengC = rengTexto[rengI]!
      if (rengC === '(') {
        rengPila.push(new Map())
        rengI++
      } else if (rengC === ')') {
        rengI++
        const rengDentro = rengPila.pop()!
        rengSumar(rengPila[rengPila.length - 1]!, rengDentro, rengNumero())
      } else {
        let rengEl = rengC
        rengI++
        while (rengI < rengTexto.length && /[a-z]/.test(rengTexto[rengI]!)) rengEl += rengTexto[rengI++]
        rengSumar(rengPila[rengPila.length - 1]!, new Map([[rengEl, 1]]), rengNumero())
      }
    }
    return rengPila[0]!
  }
  for (const rengTrozo of rengF.split('·')) {
    const rengM = /^([0-9]+)(.*)$/.exec(rengTrozo)
    rengSumar(rengTotal, rengParte(rengM ? rengM[2]! : rengTrozo), rengM ? Number(rengM[1]) : 1)
  }
  return rengTotal
}

export const rengAnNo = (rengEl: string): number => rengPorSimbolo.get(rengEl)!.masa
export const rengMNo = (rengF: string): number => [...rengAtomosNo(rengF).entries()].reduce((rengS, [rengEl, rengN]) => rengS + rengAnNo(rengEl) * rengN, 0)
export const rengTotalNo = (rengF: string): number => [...rengAtomosNo(rengF).values()].reduce((rengS, rengN) => rengS + rengN, 0)
export const rengDeNo = (rengF: string, rengEl: string): number => rengAtomosNo(rengF).get(rengEl) ?? 0
export const rengTxtNo = (rengF: string): string => rengSubindice(rengF)
export const RENG_M_AGUA_NO = (): number => rengMNo('H2O')

const rengMcdNo = (rengA: number, rengB: number): number => (rengB === 0 ? rengA : rengMcdNo(rengB, rengA % rengB))
export const rengEsPoliNo = (rengIon: string): boolean => rengTotalNo(rengIon) > 1
export const rengCruzarNo = (rengCat: string, rengZc: number, rengAn: string, rengZa: number): { f: string; nc: number; na: number } => {
  const rengD = rengMcdNo(rengZc, rengZa)
  const rengNc = rengZa / rengD
  const rengNa = rengZc / rengD
  const rengParte = (rengIon: string, rengN: number): string => (rengN === 1 ? rengIon : rengEsPoliNo(rengIon) ? `(${rengIon})${rengN}` : `${rengIon}${rengN}`)
  return { f: `${rengParte(rengCat, rengNc)}${rengParte(rengAn, rengNa)}`, nc: rengNc, na: rengNa }
}

export const rengFuentesNo = (rengSeccion: keyof typeof RENG_SECCIONES_NO, rengPara: string, rengNombres = true) => [rengSeccionNom(RENG_SECCIONES_NO[rengSeccion], rengPara), RENG_PROCEDENCIA_MASAS, ...(rengNombres ? [RENG_PROCEDENCIA_NOMBRES] : [])]

export type RengErrorNo = readonly [string, string, number, string]

export interface RengEspecNo<T> {
  id: string
  titulo: string
  dificultad: 'basica' | 'intermedia' | 'avanzada'
  objetivo: string
  unidad: string
  tolerancia?: RengToleranciaN1
  seccion: keyof typeof RENG_SECCIONES_NO
  para: string
  nombres?: boolean
  idealizado: string
  metodo: string
  sinVerificar?: readonly string[]
  lista: readonly T[]
  x?: readonly [number, number, number]
  y?: readonly [number, number, number]
  valida?: (rengE: T, rengX: number, rengY: number) => boolean
  respuesta: (rengE: T, rengX: number, rengY: number) => number
  errores: (rengE: T, rengX: number, rengY: number, rengR: number) => readonly RengErrorNo[]
  enunciado: (rengE: T, rengX: number, rengY: number) => string
  pregunta: string | ((rengE: T) => string)
  datos: (rengE: T, rengX: number, rengY: number) => ReadonlyArray<readonly [string, string]>
  pasos: (rengE: T, rengX: number, rengY: number, rengR: number) => readonly string[]
  pistas: readonly [string, string, string]
}

export function rengPracticaNo<T>(rengE: RengEspecNo<T>): RengPracticaN1 {
  const rengSub = rengE.id.replace(/-p[0-9]+$/, '')
  const E = (rengD: Readonly<Record<string, number>>): T => rengE.lista[rengD.i!]!
  return rengFabricarPracticaN1({
    id: rengE.id, subtema: rengSub, titulo: rengE.titulo, dificultad: rengE.dificultad, objetivo: rengE.objetivo, unidad: rengE.unidad, tolerancia: rengE.tolerancia ?? RENG_TOL_NO,
    fuentes: rengFuentesNo(rengE.seccion, rengE.para, rengE.nombres ?? true), idealizado: rengE.idealizado, metodo: rengE.metodo, ...(rengE.sinVerificar ? { sinVerificar: rengE.sinVerificar } : {}),
    parametros: (rengRng) => ({ i: rengIndice(rengRng, rengE.lista.length), x: rengE.x ? rengEntreN1(rengRng, rengE.x[0], rengE.x[1], rengE.x[2]) : 0, y: rengE.y ? rengEntreN1(rengRng, rengE.y[0], rengE.y[1], rengE.y[2]) : 0 }),
    valida: (rengD) => (rengE.valida ? rengE.valida(E(rengD), rengD.x!, rengD.y!) : true),
    respuesta: (rengD) => rengE.respuesta(E(rengD), rengD.x!, rengD.y!),
    errores: (rengD, rengR) => rengE.errores(E(rengD), rengD.x!, rengD.y!, rengR).map((rengX) => [...rengX] as [string, string, number, string]),
    enunciado: (rengD) => rengE.enunciado(E(rengD), rengD.x!, rengD.y!),
    pregunta: (rengD) => (typeof rengE.pregunta === 'string' ? rengE.pregunta : rengE.pregunta(E(rengD))),
    datos: (rengD) => rengE.datos(E(rengD), rengD.x!, rengD.y!),
    pasos: (rengD, rengR) => rengE.pasos(E(rengD), rengD.x!, rengD.y!, rengR),
    pistas: rengE.pistas
  })
}

export const rengDatoMNo = (rengF: string): readonly [string, string] => [`M(${rengTxtNo(rengF)})`, `${rengTx(rengMNo(rengF), 5)} g/mol`]

export type RengNombreNo = readonly [string, string]

export const RENG_PARENTESIS_NO: readonly RengNombreNo[] = [
  ['fosfato de calcio', 'Ca3(PO4)2'], ['sulfato de aluminio', 'Al2(SO4)3'], ['sulfato de amonio', '(NH4)2SO4'], ['nitrato de magnesio', 'Mg(NO3)2'],
  ['sulfato de hierro(III)', 'Fe2(SO4)3'], ['fosfato de magnesio', 'Mg3(PO4)2'], ['fosfato de amonio', '(NH4)3PO4'], ['nitrato de bario', 'Ba(NO3)2'],
  ['nitrato de hierro(III)', 'Fe(NO3)3'], ['nitrato de cobre(II)', 'Cu(NO3)2'], ['hidrogenocarbonato de calcio', 'Ca(HCO3)2'], ['dihidrogenofosfato de calcio', 'Ca(H2PO4)2'],
  ['perclorato de magnesio', 'Mg(ClO4)2'], ['carbonato de amonio', '(NH4)2CO3'], ['nitrato de aluminio', 'Al(NO3)3'], ['hidróxido de calcio', 'Ca(OH)2'], ['hidróxido de aluminio', 'Al(OH)3']
]

export type RengElementoNo = readonly [string, string, string]

export const RENG_ELEMENTO_NO: readonly RengElementoNo[] = [
  ['trióxido de dihierro', 'Fe2O3', 'Fe'], ['óxido de aluminio', 'Al2O3', 'Al'], ['carbonato de sodio', 'Na2CO3', 'Na'], ['sulfato de potasio', 'K2SO4', 'K'],
  ['cloruro de calcio', 'CaCl2', 'Cl'], ['fosfato de calcio', 'Ca3(PO4)2', 'Ca'], ['óxido de cobre(I)', 'Cu2O', 'Cu'], ['cloruro de magnesio', 'MgCl2', 'Cl'],
  ['sulfato de sodio', 'Na2SO4', 'Na'], ['sulfato de aluminio', 'Al2(SO4)3', 'Al'], ['carbonato de potasio', 'K2CO3', 'K'], ['cloruro de bario', 'BaCl2', 'Cl'],
  ['sulfato de amonio', '(NH4)2SO4', 'N'], ['fosfato de magnesio', 'Mg3(PO4)2', 'Mg'], ['fosfato de sodio', 'Na3PO4', 'Na'], ['óxido de cromo(III)', 'Cr2O3', 'Cr']
]

export interface RengCentralNo {
  f: string
  el: string
}

export const RENG_CENTRAL_NO: readonly RengCentralNo[] = [
  { f: 'H2SO4', el: 'S' }, { f: 'HNO3', el: 'N' }, { f: 'H3PO4', el: 'P' }, { f: 'HClO4', el: 'Cl' }, { f: 'HClO', el: 'Cl' }, { f: 'KMnO4', el: 'Mn' },
  { f: 'K2Cr2O7', el: 'Cr' }, { f: 'Na2SO3', el: 'S' }, { f: 'KClO3', el: 'Cl' }, { f: 'H2CO3', el: 'C' }, { f: 'HNO2', el: 'N' }, { f: 'K2CrO4', el: 'Cr' },
  { f: 'HIO4', el: 'I' }, { f: 'Mg(ClO4)2', el: 'Cl' }, { f: 'Ca3(PO4)2', el: 'P' }, { f: 'Na2CO3', el: 'C' }, { f: 'NaClO2', el: 'Cl' }, { f: 'H2CrO4', el: 'Cr' }
]

const RENG_CARGA_FIJA_NO: Readonly<Record<string, number>> = { H: 1, Li: 1, Na: 1, K: 1, Rb: 1, Cs: 1, Mg: 2, Ca: 2, Sr: 2, Ba: 2, O: -2 }
export const rengOxCentralNo = (rengC: RengCentralNo, rengOxigeno = -2): number => {
  let rengS = 0
  for (const [rengEl, rengN] of rengAtomosNo(rengC.f)) if (rengEl !== rengC.el) rengS += (rengEl === 'O' ? rengOxigeno : RENG_CARGA_FIJA_NO[rengEl]!) * rengN
  return -rengS / rengDeNo(rengC.f, rengC.el)
}

export interface RengMetalOxNo {
  f: string
  el: string
  za: number
  na: number
}

export const RENG_METAL_OX_NO: readonly RengMetalOxNo[] = [
  { f: 'Fe2O3', el: 'Fe', za: 2, na: 3 }, { f: 'Cr2O3', el: 'Cr', za: 2, na: 3 }, { f: 'Co2O3', el: 'Co', za: 2, na: 3 }, { f: 'V2O5', el: 'V', za: 2, na: 5 },
  { f: 'Au2O3', el: 'Au', za: 2, na: 3 }, { f: 'Al2O3', el: 'Al', za: 2, na: 3 }, { f: 'Al2(SO4)3', el: 'Al', za: 2, na: 3 },
  { f: 'Mn2O7', el: 'Mn', za: 2, na: 7 }, { f: 'Mn2O3', el: 'Mn', za: 2, na: 3 }, { f: 'Bi2O3', el: 'Bi', za: 2, na: 3 }, { f: 'Sb2O5', el: 'Sb', za: 2, na: 5 },
  { f: 'Al2S3', el: 'Al', za: 2, na: 3 }, { f: 'Ga2O3', el: 'Ga', za: 2, na: 3 }, { f: 'Ti2O3', el: 'Ti', za: 2, na: 3 }
]

export interface RengIonNo {
  ion: string
  texto: string
  q: number
  el: string
  acido: string
}

export const RENG_IONES_NO: readonly RengIonNo[] = [
  { ion: 'SO4', texto: 'SO₄²⁻', q: 2, el: 'S', acido: 'H2SO4' }, { ion: 'NO3', texto: 'NO₃⁻', q: 1, el: 'N', acido: 'HNO3' }, { ion: 'PO4', texto: 'PO₄³⁻', q: 3, el: 'P', acido: 'H3PO4' },
  { ion: 'ClO4', texto: 'ClO₄⁻', q: 1, el: 'Cl', acido: 'HClO4' }, { ion: 'ClO3', texto: 'ClO₃⁻', q: 1, el: 'Cl', acido: 'HClO3' }, { ion: 'ClO2', texto: 'ClO₂⁻', q: 1, el: 'Cl', acido: 'HClO2' },
  { ion: 'ClO', texto: 'ClO⁻', q: 1, el: 'Cl', acido: 'HClO' }, { ion: 'CO3', texto: 'CO₃²⁻', q: 2, el: 'C', acido: 'H2CO3' }, { ion: 'SO3', texto: 'SO₃²⁻', q: 2, el: 'S', acido: 'H2SO3' },
  { ion: 'NO2', texto: 'NO₂⁻', q: 1, el: 'N', acido: 'HNO2' }, { ion: 'MnO4', texto: 'MnO₄⁻', q: 1, el: 'Mn', acido: 'HMnO4' }, { ion: 'Cr2O7', texto: 'Cr₂O₇²⁻', q: 2, el: 'Cr', acido: 'H2Cr2O7' },
  { ion: 'CrO4', texto: 'CrO₄²⁻', q: 2, el: 'Cr', acido: 'H2CrO4' }, { ion: 'IO3', texto: 'IO₃⁻', q: 1, el: 'I', acido: 'HIO3' }, { ion: 'BrO3', texto: 'BrO₃⁻', q: 1, el: 'Br', acido: 'HBrO3' },
  { ion: 'IO4', texto: 'IO₄⁻', q: 1, el: 'I', acido: 'HIO4' }, { ion: 'HPO4', texto: 'HPO₄²⁻', q: 2, el: 'P', acido: 'H3PO4' }
]

export const rengOxIonNo = (rengI: RengIonNo, rengCarga: number): number => {
  const rengA = rengAtomosNo(rengI.ion)
  return (2 * (rengA.get('O') ?? 0) - (rengA.get('H') ?? 0) - rengCarga) / rengA.get(rengI.el)!
}

export interface RengBinarioNo {
  n: string
  x: string
  nx: number
  y: string
  ny: number
}

export const RENG_SISTEMATICA_NO: readonly RengBinarioNo[] = [
  { n: 'pentaóxido de difósforo', x: 'P', nx: 2, y: 'O', ny: 5 }, { n: 'trióxido de dinitrógeno', x: 'N', nx: 2, y: 'O', ny: 3 }, { n: 'dióxido de carbono', x: 'C', nx: 1, y: 'O', ny: 2 },
  { n: 'heptaóxido de dicloro', x: 'Cl', nx: 2, y: 'O', ny: 7 }, { n: 'dióxido de azufre', x: 'S', nx: 1, y: 'O', ny: 2 }, { n: 'trióxido de azufre', x: 'S', nx: 1, y: 'O', ny: 3 },
  { n: 'tetracloruro de carbono', x: 'C', nx: 1, y: 'Cl', ny: 4 }, { n: 'tricloruro de fósforo', x: 'P', nx: 1, y: 'Cl', ny: 3 }, { n: 'pentacloruro de fósforo', x: 'P', nx: 1, y: 'Cl', ny: 5 },
  { n: 'hexafluoruro de azufre', x: 'S', nx: 1, y: 'F', ny: 6 }, { n: 'monóxido de dicloro', x: 'Cl', nx: 2, y: 'O', ny: 1 }, { n: 'pentaóxido de dinitrógeno', x: 'N', nx: 2, y: 'O', ny: 5 },
  { n: 'dióxido de silicio', x: 'Si', nx: 1, y: 'O', ny: 2 }, { n: 'trióxido de dihierro', x: 'Fe', nx: 2, y: 'O', ny: 3 }, { n: 'trióxido de difósforo', x: 'P', nx: 2, y: 'O', ny: 3 },
  { n: 'pentaóxido de diyodo', x: 'I', nx: 2, y: 'O', ny: 5 }, { n: 'monóxido de carbono', x: 'C', nx: 1, y: 'O', ny: 1 }
]

const rengSub = (rengEl: string, rengN: number): string => (rengN === 1 ? rengEl : `${rengEl}${rengN}`)
export const rengFBinNo = (rengB: RengBinarioNo): string => `${rengSub(rengB.x, rengB.nx)}${rengSub(rengB.y, rengB.ny)}`
export const rengFBinInvNo = (rengB: RengBinarioNo): string => `${rengSub(rengB.x, rengB.ny)}${rengSub(rengB.y, rengB.nx)}`
export const RENG_OXIDOS_SIS_NO: readonly RengBinarioNo[] = RENG_SISTEMATICA_NO.filter((rengB) => rengB.y === 'O')

export interface RengStockNo {
  n: string
  metal: string
  z: number
  an: string
  za: number
}

export const RENG_STOCK_NO: readonly RengStockNo[] = [
  { n: 'cloruro de hierro(III)', metal: 'Fe', z: 3, an: 'Cl', za: 1 }, { n: 'cloruro de hierro(II)', metal: 'Fe', z: 2, an: 'Cl', za: 1 }, { n: 'óxido de cobre(I)', metal: 'Cu', z: 1, an: 'O', za: 2 },
  { n: 'óxido de cobre(II)', metal: 'Cu', z: 2, an: 'O', za: 2 }, { n: 'sulfato de hierro(II)', metal: 'Fe', z: 2, an: 'SO4', za: 2 }, { n: 'óxido de plomo(IV)', metal: 'Pb', z: 4, an: 'O', za: 2 },
  { n: 'óxido de plomo(II)', metal: 'Pb', z: 2, an: 'O', za: 2 }, { n: 'cloruro de estaño(II)', metal: 'Sn', z: 2, an: 'Cl', za: 1 }, { n: 'cloruro de estaño(IV)', metal: 'Sn', z: 4, an: 'Cl', za: 1 },
  { n: 'nitrato de cobre(II)', metal: 'Cu', z: 2, an: 'NO3', za: 1 }, { n: 'óxido de cromo(III)', metal: 'Cr', z: 3, an: 'O', za: 2 }, { n: 'sulfuro de hierro(II)', metal: 'Fe', z: 2, an: 'S', za: 2 },
  { n: 'óxido de manganeso(IV)', metal: 'Mn', z: 4, an: 'O', za: 2 }, { n: 'óxido de cobalto(III)', metal: 'Co', z: 3, an: 'O', za: 2 }, { n: 'cloruro de cobalto(II)', metal: 'Co', z: 2, an: 'Cl', za: 1 },
  { n: 'sulfato de hierro(III)', metal: 'Fe', z: 3, an: 'SO4', za: 2 }, { n: 'yoduro de plomo(II)', metal: 'Pb', z: 2, an: 'I', za: 1 }, { n: 'óxido de hierro(II)', metal: 'Fe', z: 2, an: 'O', za: 2 },
  { n: 'bromuro de cobre(I)', metal: 'Cu', z: 1, an: 'Br', za: 1 }, { n: 'óxido de níquel(II)', metal: 'Ni', z: 2, an: 'O', za: 2 }, { n: 'nitrato de hierro(III)', metal: 'Fe', z: 3, an: 'NO3', za: 1 },
  { n: 'hidróxido de hierro(III)', metal: 'Fe', z: 3, an: 'OH', za: 1 }, { n: 'hidróxido de cobre(II)', metal: 'Cu', z: 2, an: 'OH', za: 1 }, { n: 'óxido de vanadio(V)', metal: 'V', z: 5, an: 'O', za: 2 },
  { n: 'óxido de mercurio(II)', metal: 'Hg', z: 2, an: 'O', za: 2 }
]

export const rengFStockNo = (rengS: RengStockNo, rengZ = rengS.z) => rengCruzarNo(rengS.metal, rengZ, rengS.an, rengS.za)
export const rengMRomanoSubNo = (rengS: RengStockNo): number => rengS.z * rengAnNo(rengS.metal) + rengMNo(rengS.an)
export const rengMSinCruzarNo = (rengS: RengStockNo): number => rengAnNo(rengS.metal) + rengMNo(rengS.an)

export interface RengTradNo extends RengStockNo {
  otra: number
}

export const RENG_TRADICIONAL_NO: readonly RengTradNo[] = [
  { n: 'cloruro férrico', metal: 'Fe', z: 3, otra: 2, an: 'Cl', za: 1 }, { n: 'cloruro ferroso', metal: 'Fe', z: 2, otra: 3, an: 'Cl', za: 1 }, { n: 'óxido cuproso', metal: 'Cu', z: 1, otra: 2, an: 'O', za: 2 },
  { n: 'óxido cúprico', metal: 'Cu', z: 2, otra: 1, an: 'O', za: 2 }, { n: 'sulfato ferroso', metal: 'Fe', z: 2, otra: 3, an: 'SO4', za: 2 }, { n: 'sulfato férrico', metal: 'Fe', z: 3, otra: 2, an: 'SO4', za: 2 },
  { n: 'cloruro estánnico', metal: 'Sn', z: 4, otra: 2, an: 'Cl', za: 1 }, { n: 'cloruro estannoso', metal: 'Sn', z: 2, otra: 4, an: 'Cl', za: 1 }, { n: 'óxido plúmbico', metal: 'Pb', z: 4, otra: 2, an: 'O', za: 2 },
  { n: 'óxido plumboso', metal: 'Pb', z: 2, otra: 4, an: 'O', za: 2 }, { n: 'cloruro mercúrico', metal: 'Hg', z: 2, otra: 1, an: 'Cl', za: 1 }, { n: 'óxido niqueloso', metal: 'Ni', z: 2, otra: 3, an: 'O', za: 2 },
  { n: 'cloruro cobaltoso', metal: 'Co', z: 2, otra: 3, an: 'Cl', za: 1 }, { n: 'óxido áurico', metal: 'Au', z: 3, otra: 1, an: 'O', za: 2 }, { n: 'óxido ferroso', metal: 'Fe', z: 2, otra: 3, an: 'O', za: 2 },
  { n: 'óxido férrico', metal: 'Fe', z: 3, otra: 2, an: 'O', za: 2 }, { n: 'cloruro cuproso', metal: 'Cu', z: 1, otra: 2, an: 'Cl', za: 1 }, { n: 'cloruro cúprico', metal: 'Cu', z: 2, otra: 1, an: 'Cl', za: 1 },
  { n: 'nitrato férrico', metal: 'Fe', z: 3, otra: 2, an: 'NO3', za: 1 }
]

export interface RengOxoNo {
  n: string
  f: string
  el: string
  menos: string
}

export const RENG_OXOACIDOS_NO: readonly RengOxoNo[] = [
  { n: 'ácido hipocloroso', f: 'HClO', el: 'Cl', menos: 'HCl' }, { n: 'ácido cloroso', f: 'HClO2', el: 'Cl', menos: 'HClO' }, { n: 'ácido clórico', f: 'HClO3', el: 'Cl', menos: 'HClO2' },
  { n: 'ácido perclórico', f: 'HClO4', el: 'Cl', menos: 'HClO3' }, { n: 'ácido brómico', f: 'HBrO3', el: 'Br', menos: 'HBrO2' }, { n: 'ácido yódico', f: 'HIO3', el: 'I', menos: 'HIO2' },
  { n: 'ácido peryódico', f: 'HIO4', el: 'I', menos: 'HIO3' }, { n: 'ácido nitroso', f: 'HNO2', el: 'N', menos: 'HNO' }, { n: 'ácido nítrico', f: 'HNO3', el: 'N', menos: 'HNO2' },
  { n: 'ácido sulfuroso', f: 'H2SO3', el: 'S', menos: 'H2SO2' }, { n: 'ácido sulfúrico', f: 'H2SO4', el: 'S', menos: 'H2SO3' }, { n: 'ácido carbónico', f: 'H2CO3', el: 'C', menos: 'H2CO2' },
  { n: 'ácido fosfórico', f: 'H3PO4', el: 'P', menos: 'H3PO3' }, { n: 'ácido crómico', f: 'H2CrO4', el: 'Cr', menos: 'H2CrO3' }, { n: 'ácido permangánico', f: 'HMnO4', el: 'Mn', menos: 'HMnO3' }
]

export const rengOxAcidoNo = (rengF: string, rengEl: string): number => {
  const rengA = rengAtomosNo(rengF)
  return (2 * (rengA.get('O') ?? 0) - (rengA.get('H') ?? 0)) / rengA.get(rengEl)!
}

export interface RengMetalNo {
  n: string
  metal: string
  z: number
}

export const RENG_OXIDOS_METAL_NO: readonly RengMetalNo[] = [
  { n: 'óxido de sodio', metal: 'Na', z: 1 }, { n: 'óxido de potasio', metal: 'K', z: 1 }, { n: 'óxido de litio', metal: 'Li', z: 1 }, { n: 'óxido de plata', metal: 'Ag', z: 1 },
  { n: 'óxido de cesio', metal: 'Cs', z: 1 }, { n: 'óxido de rubidio', metal: 'Rb', z: 1 }, { n: 'óxido de aluminio', metal: 'Al', z: 3 }, { n: 'óxido de cobre(I)', metal: 'Cu', z: 1 },
  { n: 'óxido férrico', metal: 'Fe', z: 3 }, { n: 'óxido de cromo(III)', metal: 'Cr', z: 3 }, { n: 'óxido de cobalto(III)', metal: 'Co', z: 3 }, { n: 'óxido de plomo(IV)', metal: 'Pb', z: 4 },
  { n: 'óxido de manganeso(IV)', metal: 'Mn', z: 4 }, { n: 'óxido de vanadio(V)', metal: 'V', z: 5 }, { n: 'óxido áurico', metal: 'Au', z: 3 }, { n: 'óxido de calcio', metal: 'Ca', z: 2 },
  { n: 'óxido de magnesio', metal: 'Mg', z: 2 }, { n: 'óxido de bario', metal: 'Ba', z: 2 }, { n: 'óxido de cobre(II)', metal: 'Cu', z: 2 }, { n: 'óxido de níquel(II)', metal: 'Ni', z: 2 }
]

export const rengOxidoNo = (rengM: RengMetalNo) => rengCruzarNo(rengM.metal, rengM.z, 'O', 2)

export interface RengOxNmNo {
  f: string
  el: string
}

export const RENG_OXIDOS_NM_NO: readonly RengOxNmNo[] = [
  { f: 'CO', el: 'C' }, { f: 'CO2', el: 'C' }, { f: 'N2O3', el: 'N' }, { f: 'N2O5', el: 'N' }, { f: 'SO2', el: 'S' }, { f: 'SO3', el: 'S' }, { f: 'Cl2O', el: 'Cl' }, { f: 'Cl2O7', el: 'Cl' },
  { f: 'P2O5', el: 'P' }, { f: 'P2O3', el: 'P' }, { f: 'SiO2', el: 'Si' }, { f: 'I2O5', el: 'I' }, { f: 'NO', el: 'N' }, { f: 'NO2', el: 'N' }, { f: 'N2O', el: 'N' }, { f: 'Cl2O3', el: 'Cl' },
  { f: 'Cl2O5', el: 'Cl' }, { f: 'SeO2', el: 'Se' }, { f: 'SeO3', el: 'Se' }, { f: 'N2O4', el: 'N' }
]

export const RENG_PEROXIDOS_NO: readonly RengMetalNo[] = [
  { n: 'peróxido de sodio', metal: 'Na', z: 1 }, { n: 'peróxido de potasio', metal: 'K', z: 1 }, { n: 'peróxido de litio', metal: 'Li', z: 1 }, { n: 'peróxido de bario', metal: 'Ba', z: 2 },
  { n: 'peróxido de calcio', metal: 'Ca', z: 2 }, { n: 'peróxido de magnesio', metal: 'Mg', z: 2 }, { n: 'peróxido de estroncio', metal: 'Sr', z: 2 }, { n: 'peróxido de rubidio', metal: 'Rb', z: 1 },
  { n: 'peróxido de cesio', metal: 'Cs', z: 1 }
]

export const rengFPeroxidoNo = (rengM: RengMetalNo): string => (rengM.z === 1 ? `${rengM.metal}2O2` : `${rengM.metal}O2`)
export const rengFOxidoMetalNo = (rengM: RengMetalNo): string => rengCruzarNo(rengM.metal, rengM.z, 'O', 2).f

export const RENG_HIDRUROS_NO: readonly RengMetalNo[] = [
  { n: 'hidruro de litio', metal: 'Li', z: 1 }, { n: 'hidruro de sodio', metal: 'Na', z: 1 }, { n: 'hidruro de potasio', metal: 'K', z: 1 }, { n: 'hidruro de calcio', metal: 'Ca', z: 2 },
  { n: 'hidruro de magnesio', metal: 'Mg', z: 2 }, { n: 'hidruro de estroncio', metal: 'Sr', z: 2 }, { n: 'hidruro de bario', metal: 'Ba', z: 2 }, { n: 'hidruro de aluminio', metal: 'Al', z: 3 },
  { n: 'hidruro de rubidio', metal: 'Rb', z: 1 }, { n: 'hidruro de cesio', metal: 'Cs', z: 1 }, { n: 'hidruro de berilio', metal: 'Be', z: 2 }
]

export const rengFHidruroNo = (rengM: RengMetalNo): string => (rengM.z === 1 ? `${rengM.metal}H` : `${rengM.metal}H${rengM.z}`)

export const RENG_HIDRUROS_NM_NO: readonly RengOxNmNo[] = [
  { f: 'NH3', el: 'N' }, { f: 'CH4', el: 'C' }, { f: 'PH3', el: 'P' }, { f: 'H2S', el: 'S' }, { f: 'SiH4', el: 'Si' }, { f: 'H2Se', el: 'Se' }, { f: 'H2O', el: 'O' },
  { f: 'AsH3', el: 'As' }, { f: 'H2Te', el: 'Te' }, { f: 'SbH3', el: 'Sb' }, { f: 'GeH4', el: 'Ge' }, { f: 'B2H6', el: 'B' }, { f: 'N2H4', el: 'N' }, { f: 'C2H6', el: 'C' }, { f: 'HCl', el: 'Cl' }
]

export const RENG_HIDROXIDOS_NO: readonly RengMetalNo[] = [
  { n: 'hidróxido de sodio', metal: 'Na', z: 1 }, { n: 'hidróxido de potasio', metal: 'K', z: 1 }, { n: 'hidróxido de litio', metal: 'Li', z: 1 }, { n: 'hidróxido de calcio', metal: 'Ca', z: 2 },
  { n: 'hidróxido de magnesio', metal: 'Mg', z: 2 }, { n: 'hidróxido de bario', metal: 'Ba', z: 2 }, { n: 'hidróxido de aluminio', metal: 'Al', z: 3 }, { n: 'hidróxido de hierro(II)', metal: 'Fe', z: 2 },
  { n: 'hidróxido de níquel(II)', metal: 'Ni', z: 2 }, { n: 'hidróxido de cromo(III)', metal: 'Cr', z: 3 }, { n: 'hidróxido de estroncio', metal: 'Sr', z: 2 }, { n: 'hidróxido de cobalto(II)', metal: 'Co', z: 2 },
  { n: 'hidróxido de hierro(III)', metal: 'Fe', z: 3 }, { n: 'hidróxido de cobre(II)', metal: 'Cu', z: 2 }
]

export const rengFHidroxidoNo = (rengM: RengMetalNo): string => rengCruzarNo(rengM.metal, rengM.z, 'OH', 1).f

export interface RengOxHidNo {
  oxido: string
  hidroxido: string
  metal: string
  z: number
}

export const RENG_OXIDO_A_HIDROXIDO_NO: readonly RengOxHidNo[] = [
  { oxido: 'óxido de sodio', hidroxido: 'hidróxido de sodio', metal: 'Na', z: 1 }, { oxido: 'óxido de potasio', hidroxido: 'hidróxido de potasio', metal: 'K', z: 1 },
  { oxido: 'óxido de litio', hidroxido: 'hidróxido de litio', metal: 'Li', z: 1 }, { oxido: 'óxido de calcio', hidroxido: 'hidróxido de calcio', metal: 'Ca', z: 2 },
  { oxido: 'óxido de magnesio', hidroxido: 'hidróxido de magnesio', metal: 'Mg', z: 2 }, { oxido: 'óxido de bario', hidroxido: 'hidróxido de bario', metal: 'Ba', z: 2 },
  { oxido: 'óxido de estroncio', hidroxido: 'hidróxido de estroncio', metal: 'Sr', z: 2 }, { oxido: 'óxido de aluminio', hidroxido: 'hidróxido de aluminio', metal: 'Al', z: 3 },
  { oxido: 'óxido de hierro(II)', hidroxido: 'hidróxido de hierro(II)', metal: 'Fe', z: 2 }, { oxido: 'óxido férrico', hidroxido: 'hidróxido de hierro(III)', metal: 'Fe', z: 3 },
  { oxido: 'óxido de níquel(II)', hidroxido: 'hidróxido de níquel(II)', metal: 'Ni', z: 2 }, { oxido: 'óxido de cobre(II)', hidroxido: 'hidróxido de cobre(II)', metal: 'Cu', z: 2 },
  { oxido: 'óxido de cromo(III)', hidroxido: 'hidróxido de cromo(III)', metal: 'Cr', z: 3 }
]

export interface RengHidracidoNo {
  acido: string
  gas: string
  f: string
  x: string
  mal: string
  sal: string
  salMal: string
}

export const RENG_HIDRACIDOS_NO: readonly RengHidracidoNo[] = [
  { acido: 'ácido clorhídrico', gas: 'cloruro de hidrógeno', f: 'HCl', x: 'Cl', mal: 'H2Cl', sal: 'NaCl', salMal: 'Na2Cl' },
  { acido: 'ácido bromhídrico', gas: 'bromuro de hidrógeno', f: 'HBr', x: 'Br', mal: 'H2Br', sal: 'NaBr', salMal: 'Na2Br' },
  { acido: 'ácido yodhídrico', gas: 'yoduro de hidrógeno', f: 'HI', x: 'I', mal: 'H2I', sal: 'NaI', salMal: 'Na2I' },
  { acido: 'ácido fluorhídrico', gas: 'fluoruro de hidrógeno', f: 'HF', x: 'F', mal: 'H2F', sal: 'NaF', salMal: 'Na2F' },
  { acido: 'ácido sulfhídrico', gas: 'sulfuro de hidrógeno', f: 'H2S', x: 'S', mal: 'HS', sal: 'Na2S', salMal: 'NaS' },
  { acido: 'ácido selenhídrico', gas: 'seleniuro de hidrógeno', f: 'H2Se', x: 'Se', mal: 'HSe', sal: 'Na2Se', salMal: 'NaSe' },
  { acido: 'ácido telurhídrico', gas: 'telururo de hidrógeno', f: 'H2Te', x: 'Te', mal: 'HTe', sal: 'Na2Te', salMal: 'NaTe' }
]

export interface RengAnhidridoNo {
  oxido: string
  fo: string
  acido: string
  fa: string
  k: number
}

export const RENG_ANHIDRIDOS_NO: readonly RengAnhidridoNo[] = [
  { oxido: 'trióxido de azufre', fo: 'SO3', acido: 'ácido sulfúrico', fa: 'H2SO4', k: 1 }, { oxido: 'dióxido de azufre', fo: 'SO2', acido: 'ácido sulfuroso', fa: 'H2SO3', k: 1 },
  { oxido: 'dióxido de carbono', fo: 'CO2', acido: 'ácido carbónico', fa: 'H2CO3', k: 1 }, { oxido: 'pentaóxido de dinitrógeno', fo: 'N2O5', acido: 'ácido nítrico', fa: 'HNO3', k: 2 },
  { oxido: 'trióxido de dinitrógeno', fo: 'N2O3', acido: 'ácido nitroso', fa: 'HNO2', k: 2 }, { oxido: 'pentaóxido de difósforo', fo: 'P2O5', acido: 'ácido fosfórico', fa: 'H3PO4', k: 2 },
  { oxido: 'heptaóxido de dicloro', fo: 'Cl2O7', acido: 'ácido perclórico', fa: 'HClO4', k: 2 }, { oxido: 'monóxido de dicloro', fo: 'Cl2O', acido: 'ácido hipocloroso', fa: 'HClO', k: 2 },
  { oxido: 'pentaóxido de diyodo', fo: 'I2O5', acido: 'ácido yódico', fa: 'HIO3', k: 2 }
]

export interface RengSalNo {
  n: string
  cat: string
  z: number
  an: string
  za: number
}

export const RENG_SALES_BINARIAS_NO: readonly RengSalNo[] = [
  { n: 'cloruro de sodio', cat: 'Na', z: 1, an: 'Cl', za: 1 }, { n: 'bromuro de potasio', cat: 'K', z: 1, an: 'Br', za: 1 }, { n: 'yoduro de calcio', cat: 'Ca', z: 2, an: 'I', za: 1 },
  { n: 'fluoruro de calcio', cat: 'Ca', z: 2, an: 'F', za: 1 }, { n: 'sulfuro de sodio', cat: 'Na', z: 1, an: 'S', za: 2 }, { n: 'cloruro de aluminio', cat: 'Al', z: 3, an: 'Cl', za: 1 },
  { n: 'bromuro de magnesio', cat: 'Mg', z: 2, an: 'Br', za: 1 }, { n: 'cloruro de bario', cat: 'Ba', z: 2, an: 'Cl', za: 1 }, { n: 'fluoruro de aluminio', cat: 'Al', z: 3, an: 'F', za: 1 },
  { n: 'nitruro de magnesio', cat: 'Mg', z: 2, an: 'N', za: 3 }, { n: 'yoduro de potasio', cat: 'K', z: 1, an: 'I', za: 1 }, { n: 'cloruro de calcio', cat: 'Ca', z: 2, an: 'Cl', za: 1 },
  { n: 'bromuro de aluminio', cat: 'Al', z: 3, an: 'Br', za: 1 }, { n: 'sulfuro de aluminio', cat: 'Al', z: 3, an: 'S', za: 2 }, { n: 'fluoruro de sodio', cat: 'Na', z: 1, an: 'F', za: 1 },
  { n: 'cloruro de litio', cat: 'Li', z: 1, an: 'Cl', za: 1 }, { n: 'fosfuro de calcio', cat: 'Ca', z: 2, an: 'P', za: 3 }, { n: 'sulfuro de potasio', cat: 'K', z: 1, an: 'S', za: 2 },
  { n: 'cloruro de magnesio', cat: 'Mg', z: 2, an: 'Cl', za: 1 }, { n: 'cloruro de hierro(III)', cat: 'Fe', z: 3, an: 'Cl', za: 1 }, { n: 'yoduro de plomo(II)', cat: 'Pb', z: 2, an: 'I', za: 1 }
]

export const rengFSalNo = (rengS: RengSalNo) => rengCruzarNo(rengS.cat, rengS.z, rengS.an, rengS.za)

export interface RengOxisalNo extends RengSalNo {
  el: string
  ito: string
}

export const RENG_OXISALES_NO: readonly RengOxisalNo[] = [
  { n: 'nitrato de calcio', cat: 'Ca', z: 2, an: 'NO3', za: 1, el: 'N', ito: 'NO2' }, { n: 'sulfato de aluminio', cat: 'Al', z: 3, an: 'SO4', za: 2, el: 'S', ito: 'SO3' },
  { n: 'fosfato de calcio', cat: 'Ca', z: 2, an: 'PO4', za: 3, el: 'P', ito: 'PO3' }, { n: 'carbonato de sodio', cat: 'Na', z: 1, an: 'CO3', za: 2, el: 'C', ito: 'CO2' },
  { n: 'sulfato de cobre(II)', cat: 'Cu', z: 2, an: 'SO4', za: 2, el: 'S', ito: 'SO3' }, { n: 'nitrato de plata', cat: 'Ag', z: 1, an: 'NO3', za: 1, el: 'N', ito: 'NO2' },
  { n: 'clorato de potasio', cat: 'K', z: 1, an: 'ClO3', za: 1, el: 'Cl', ito: 'ClO2' }, { n: 'permanganato de potasio', cat: 'K', z: 1, an: 'MnO4', za: 1, el: 'Mn', ito: 'MnO3' },
  { n: 'sulfito de sodio', cat: 'Na', z: 1, an: 'SO3', za: 2, el: 'S', ito: 'SO2' }, { n: 'fosfato de sodio', cat: 'Na', z: 1, an: 'PO4', za: 3, el: 'P', ito: 'PO3' },
  { n: 'sulfato de amonio', cat: 'NH4', z: 1, an: 'SO4', za: 2, el: 'S', ito: 'SO3' }, { n: 'carbonato de calcio', cat: 'Ca', z: 2, an: 'CO3', za: 2, el: 'C', ito: 'CO2' },
  { n: 'perclorato de magnesio', cat: 'Mg', z: 2, an: 'ClO4', za: 1, el: 'Cl', ito: 'ClO3' }, { n: 'cromato de potasio', cat: 'K', z: 1, an: 'CrO4', za: 2, el: 'Cr', ito: 'CrO3' },
  { n: 'sulfato de magnesio', cat: 'Mg', z: 2, an: 'SO4', za: 2, el: 'S', ito: 'SO3' }, { n: 'nitrato de potasio', cat: 'K', z: 1, an: 'NO3', za: 1, el: 'N', ito: 'NO2' },
  { n: 'sulfato de sodio', cat: 'Na', z: 1, an: 'SO4', za: 2, el: 'S', ito: 'SO3' }, { n: 'yodato de potasio', cat: 'K', z: 1, an: 'IO3', za: 1, el: 'I', ito: 'IO2' },
  { n: 'nitrato de bario', cat: 'Ba', z: 2, an: 'NO3', za: 1, el: 'N', ito: 'NO2' }, { n: 'fosfato de magnesio', cat: 'Mg', z: 2, an: 'PO4', za: 3, el: 'P', ito: 'PO3' },
  { n: 'nitrato de aluminio', cat: 'Al', z: 3, an: 'NO3', za: 1, el: 'N', ito: 'NO2' }, { n: 'clorito de sodio', cat: 'Na', z: 1, an: 'ClO2', za: 1, el: 'Cl', ito: 'ClO' },
  { n: 'nitrato de magnesio', cat: 'Mg', z: 2, an: 'NO3', za: 1, el: 'N', ito: 'NO2' }, { n: 'fosfato de potasio', cat: 'K', z: 1, an: 'PO4', za: 3, el: 'P', ito: 'PO3' },
  { n: 'nitrato de hierro(III)', cat: 'Fe', z: 3, an: 'NO3', za: 1, el: 'N', ito: 'NO2' }, { n: 'sulfato de hierro(III)', cat: 'Fe', z: 3, an: 'SO4', za: 2, el: 'S', ito: 'SO3' }
]

export interface RengSalAcidaNo {
  n: string
  f: string
  neutra: string
  acido: string
  hAcido: number
}

export const RENG_SALES_ACIDAS_NO: readonly RengSalAcidaNo[] = [
  { n: 'hidrogenocarbonato de sodio', f: 'NaHCO3', neutra: 'Na2CO3', acido: 'H2CO3', hAcido: 2 }, { n: 'hidrogenocarbonato de potasio', f: 'KHCO3', neutra: 'K2CO3', acido: 'H2CO3', hAcido: 2 },
  { n: 'hidrogenosulfato de sodio', f: 'NaHSO4', neutra: 'Na2SO4', acido: 'H2SO4', hAcido: 2 }, { n: 'hidrogenosulfato de potasio', f: 'KHSO4', neutra: 'K2SO4', acido: 'H2SO4', hAcido: 2 },
  { n: 'dihidrogenofosfato de sodio', f: 'NaH2PO4', neutra: 'Na3PO4', acido: 'H3PO4', hAcido: 3 }, { n: 'hidrogenofosfato de sodio', f: 'Na2HPO4', neutra: 'Na3PO4', acido: 'H3PO4', hAcido: 3 },
  { n: 'dihidrogenofosfato de potasio', f: 'KH2PO4', neutra: 'K3PO4', acido: 'H3PO4', hAcido: 3 }, { n: 'hidrogenofosfato de potasio', f: 'K2HPO4', neutra: 'K3PO4', acido: 'H3PO4', hAcido: 3 },
  { n: 'hidrogenocarbonato de calcio', f: 'Ca(HCO3)2', neutra: 'CaCO3', acido: 'H2CO3', hAcido: 2 }, { n: 'dihidrogenofosfato de calcio', f: 'Ca(H2PO4)2', neutra: 'Ca3(PO4)2', acido: 'H3PO4', hAcido: 3 },
  { n: 'hidrogenocarbonato de amonio', f: 'NH4HCO3', neutra: '(NH4)2CO3', acido: 'H2CO3', hAcido: 2 }, { n: 'hidrogenocarbonato de magnesio', f: 'Mg(HCO3)2', neutra: 'MgCO3', acido: 'H2CO3', hAcido: 2 },
  { n: 'hidrogenocarbonato de litio', f: 'LiHCO3', neutra: 'Li2CO3', acido: 'H2CO3', hAcido: 2 }, { n: 'hidrogenofosfato de calcio', f: 'CaHPO4', neutra: 'Ca3(PO4)2', acido: 'H3PO4', hAcido: 3 },
  { n: 'dihidrogenofosfato de amonio', f: 'NH4H2PO4', neutra: '(NH4)3PO4', acido: 'H3PO4', hAcido: 3 }, { n: 'hidrogenofosfato de amonio', f: '(NH4)2HPO4', neutra: '(NH4)3PO4', acido: 'H3PO4', hAcido: 3 }
]

export const rengHAcidoNo = (rengS: RengSalAcidaNo): number => {
  const rengA = rengAtomosNo(rengS.f)
  return (rengA.get('H') ?? 0) - 4 * (rengA.get('N') ?? 0)
}
export const rengAnionesNo = (rengS: RengSalAcidaNo): number => {
  const rengA = rengAtomosNo(rengS.f)
  return (rengA.get('C') ?? 0) + (rengA.get('S') ?? 0) + (rengA.get('P') ?? 0)
}

export interface RengSalBasicaNo {
  n: string
  f: string
  metal: string
  z: number
  noh: number
  anion: string
  za: number
  nan: number
}

export const RENG_SALES_BASICAS_NO: readonly RengSalBasicaNo[] = [
  { n: 'cloruro hidróxido de magnesio', f: 'Mg(OH)Cl', metal: 'Mg', z: 2, noh: 1, anion: 'Cl', za: 1, nan: 1 },
  { n: 'cloruro hidróxido de calcio', f: 'Ca(OH)Cl', metal: 'Ca', z: 2, noh: 1, anion: 'Cl', za: 1, nan: 1 },
  { n: 'dicloruro hidróxido de aluminio', f: 'Al(OH)Cl2', metal: 'Al', z: 3, noh: 1, anion: 'Cl', za: 1, nan: 2 },
  { n: 'cloruro dihidróxido de aluminio', f: 'Al(OH)2Cl', metal: 'Al', z: 3, noh: 2, anion: 'Cl', za: 1, nan: 1 },
  { n: 'carbonato dihidróxido de dicobre (malaquita)', f: 'Cu2(OH)2CO3', metal: 'Cu', z: 2, noh: 2, anion: 'CO3', za: 2, nan: 1 },
  { n: 'cloruro hidróxido de cobre(II)', f: 'Cu(OH)Cl', metal: 'Cu', z: 2, noh: 1, anion: 'Cl', za: 1, nan: 1 },
  { n: 'cloruro hidróxido de bario', f: 'Ba(OH)Cl', metal: 'Ba', z: 2, noh: 1, anion: 'Cl', za: 1, nan: 1 },
  { n: 'sulfato hidróxido de aluminio', f: 'Al(OH)SO4', metal: 'Al', z: 3, noh: 1, anion: 'SO4', za: 2, nan: 1 },
  { n: 'cloruro hidróxido de plomo(II)', f: 'Pb(OH)Cl', metal: 'Pb', z: 2, noh: 1, anion: 'Cl', za: 1, nan: 1 },
  { n: 'cloruro trihidróxido de dicobre', f: 'Cu2(OH)3Cl', metal: 'Cu', z: 2, noh: 3, anion: 'Cl', za: 1, nan: 1 },
  { n: 'nitrato hidróxido de magnesio', f: 'Mg(OH)NO3', metal: 'Mg', z: 2, noh: 1, anion: 'NO3', za: 1, nan: 1 },
  { n: 'cloruro dihidróxido de hierro(III)', f: 'Fe(OH)2Cl', metal: 'Fe', z: 3, noh: 2, anion: 'Cl', za: 1, nan: 1 },
  { n: 'nitrato dihidróxido de bismuto', f: 'Bi(OH)2NO3', metal: 'Bi', z: 3, noh: 2, anion: 'NO3', za: 1, nan: 1 },
  { n: 'nitrato hidróxido de calcio', f: 'Ca(OH)NO3', metal: 'Ca', z: 2, noh: 1, anion: 'NO3', za: 1, nan: 1 },
  { n: 'dicloruro hidróxido de hierro(III)', f: 'Fe(OH)Cl2', metal: 'Fe', z: 3, noh: 1, anion: 'Cl', za: 1, nan: 2 },
  { n: 'nitrato hidróxido de plomo(II)', f: 'Pb(OH)NO3', metal: 'Pb', z: 2, noh: 1, anion: 'NO3', za: 1, nan: 1 }
]

export const rengNMetalBasicaNo = (rengS: RengSalBasicaNo): number => rengDeNo(rengS.f, rengS.metal)
export const RENG_SALES_BASICAS_DIDACTICO = 'Las sales básicas de estas prácticas son ejemplos de electroneutralidad; la app no las tiene en su catálogo y su existencia no se comprobó en esta entrega.'

export interface RengHidratoNo {
  n: string
  sal: string
  agua: number
}

export const RENG_HIDRATOS_NO: readonly RengHidratoNo[] = [
  { n: 'sulfato de cobre(II) pentahidratado', sal: 'CuSO4', agua: 5 }, { n: 'sulfato de magnesio heptahidratado', sal: 'MgSO4', agua: 7 }, { n: 'sulfato de calcio dihidratado', sal: 'CaSO4', agua: 2 },
  { n: 'carbonato de sodio decahidratado', sal: 'Na2CO3', agua: 10 }, { n: 'cloruro de cobalto(II) hexahidratado', sal: 'CoCl2', agua: 6 }, { n: 'cloruro de bario dihidratado', sal: 'BaCl2', agua: 2 },
  { n: 'sulfato de hierro(II) heptahidratado', sal: 'FeSO4', agua: 7 }, { n: 'sulfato de sodio decahidratado', sal: 'Na2SO4', agua: 10 }, { n: 'cloruro de calcio hexahidratado', sal: 'CaCl2', agua: 6 },
  { n: 'cloruro de níquel(II) hexahidratado', sal: 'NiCl2', agua: 6 }, { n: 'cloruro de magnesio hexahidratado', sal: 'MgCl2', agua: 6 }, { n: 'cloruro de aluminio hexahidratado', sal: 'AlCl3', agua: 6 },
  { n: 'nitrato de calcio tetrahidratado', sal: 'Ca(NO3)2', agua: 4 }, { n: 'sulfato de níquel(II) hexahidratado', sal: 'NiSO4', agua: 6 }
]

export const rengFHidratoNo = (rengH: RengHidratoNo): string => `${rengH.sal}·${rengH.agua}H2O`

export interface RengIonSimpleNo {
  s: string
  z: number
  n: string
}

export const RENG_CATIONES_NO: readonly RengIonSimpleNo[] = [
  { s: 'Na', z: 1, n: 'sodio' }, { s: 'K', z: 1, n: 'potasio' }, { s: 'Ag', z: 1, n: 'plata' }, { s: 'NH4', z: 1, n: 'amonio' }, { s: 'Ca', z: 2, n: 'calcio' }, { s: 'Mg', z: 2, n: 'magnesio' },
  { s: 'Ba', z: 2, n: 'bario' }, { s: 'Al', z: 3, n: 'aluminio' }, { s: 'Fe', z: 3, n: 'hierro(III)' }, { s: 'Fe', z: 2, n: 'hierro(II)' }, { s: 'Cu', z: 2, n: 'cobre(II)' }, { s: 'Cr', z: 3, n: 'cromo(III)' },
  { s: 'Sn', z: 4, n: 'estaño(IV)' }, { s: 'Pb', z: 2, n: 'plomo(II)' }
]

export const RENG_ANIONES_NO: readonly RengIonSimpleNo[] = [
  { s: 'Cl', z: 1, n: 'cloruro' }, { s: 'Br', z: 1, n: 'bromuro' }, { s: 'O', z: 2, n: 'óxido' }, { s: 'S', z: 2, n: 'sulfuro' }, { s: 'OH', z: 1, n: 'hidróxido' }, { s: 'NO3', z: 1, n: 'nitrato' },
  { s: 'SO4', z: 2, n: 'sulfato' }, { s: 'CO3', z: 2, n: 'carbonato' }, { s: 'PO4', z: 3, n: 'fosfato' }, { s: 'ClO4', z: 1, n: 'perclorato' }, { s: 'Cr2O7', z: 2, n: 'dicromato' }, { s: 'ClO3', z: 1, n: 'clorato' }
]

export const RENG_ANIONES_OXO_NO: readonly RengIonSimpleNo[] = RENG_ANIONES_NO.filter((rengA) => rengDeNo(rengA.s, 'O') > 0 && rengA.s !== 'O' && rengA.s !== 'OH')
export const RENG_ANIONES_POLI_NO: readonly RengIonSimpleNo[] = RENG_ANIONES_NO.filter((rengA) => rengEsPoliNo(rengA.s))

export const rengNombreParNo = (rengC: RengIonSimpleNo, rengA: RengIonSimpleNo): string => (rengA.s === 'O' ? `óxido de ${rengC.n}` : `${rengA.n} de ${rengC.n}`)
export const rengTxtIonNo = (rengI: RengIonSimpleNo, rengSigno: '+' | '−'): string => `${rengTxtNo(rengI.s)}${rengI.z === 1 ? '' : ['', '', '²', '³', '⁴'][rengI.z]}${rengSigno === '+' ? '⁺' : '⁻'}`

export interface RengInterpNo {
  n: string
  f: string
  el: string
}

export const RENG_INTERPRETAR_NO: readonly RengInterpNo[] = [
  { n: 'sulfato de amonio', f: '(NH4)2SO4', el: 'N' }, { n: 'nitrato de calcio', f: 'Ca(NO3)2', el: 'N' }, { n: 'fosfato de amonio', f: '(NH4)3PO4', el: 'N' }, { n: 'nitrato de potasio', f: 'KNO3', el: 'N' },
  { n: 'fosfato de calcio', f: 'Ca3(PO4)2', el: 'P' }, { n: 'dihidrogenofosfato de calcio', f: 'Ca(H2PO4)2', el: 'P' }, { n: 'sulfato de magnesio heptahidratado', f: 'MgSO4·7H2O', el: 'Mg' },
  { n: 'sulfato de cobre(II) pentahidratado', f: 'CuSO4·5H2O', el: 'Cu' }, { n: 'cloruro de calcio', f: 'CaCl2', el: 'Cl' }, { n: 'carbonato de calcio', f: 'CaCO3', el: 'Ca' },
  { n: 'sulfato de hierro(II) heptahidratado', f: 'FeSO4·7H2O', el: 'Fe' }, { n: 'hidrogenofosfato de amonio', f: '(NH4)2HPO4', el: 'N' }, { n: 'trióxido de dihierro', f: 'Fe2O3', el: 'Fe' },
  { n: 'hipoclorito de sodio', f: 'NaClO', el: 'Cl' }, { n: 'fluoruro de sodio', f: 'NaF', el: 'F' }, { n: 'yoduro de potasio', f: 'KI', el: 'I' }, { n: 'nitrato de amonio', f: 'NH4NO3', el: 'N' },
  { n: 'carbonato de sodio decahidratado', f: 'Na2CO3·10H2O', el: 'Na' }
]
