import { RENG_PROCEDENCIA_DIDACTICA_FU, RENG_S11, RENG_S12, RENG_S13, RENG_S14, RENG_S15, RENG_S16, RENG_S21, rengSeccionFu } from '../aprender/n1/fundamentos/comun'
import { RENG_PROCEDENCIA_MASAS } from '../aprender/n1/procedencia'
import type { RengProcedenciaN1, RengToleranciaN1 } from '../aprender/n1/tipos'
import { rengEntreN1, rengIndice } from './aleatorio'
import type { RengErrorNo } from './b05-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

export const RENG_TOL_FU: RengToleranciaN1 = { rel: 0.005, abs: 1e-6 }
export const RENG_TOL_FU_ENT: RengToleranciaN1 = { rel: 0.001, abs: 0.02 }
export const RENG_R_FU = 8.314462618
export const RENG_NA_FU = 6.02214076e23
export const RENG_C_AGUA_FU = 4.184
export const RENG_LF_FU = 334
export const RENG_LV_FU = 2260
export const RENG_DIDACTICO_FU = 'Los valores de referencia (calores latentes 334 y 2260 J/g, c del agua 4,184 J/(g·K), densidades de materiales comunes) son redondeados de uso común; no se contrastaron en esta entrega.'

const RENG_SECCIONES_FU = { '1.1': RENG_S11, '1.2': RENG_S12, '1.3': RENG_S13, '1.4': RENG_S14, '1.5': RENG_S15, '1.6': RENG_S16, '2.1': RENG_S21 }
export const rengFuentesFu = (rengSeccion: keyof typeof RENG_SECCIONES_FU, rengPara: string, rengMasas = false): readonly RengProcedenciaN1[] => [rengSeccionFu(RENG_SECCIONES_FU[rengSeccion], rengPara), RENG_PROCEDENCIA_DIDACTICA_FU, ...(rengMasas ? [RENG_PROCEDENCIA_MASAS] : [])]

export interface RengEspecFu<T> {
  id: string
  titulo: string
  objetivo: string
  unidad: string
  tolerancia?: RengToleranciaN1
  seccion: keyof typeof RENG_SECCIONES_FU
  para: string
  masas?: boolean
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

const RENG_DIFICULTAD = { 1: 'basica', 2: 'intermedia', 3: 'avanzada' } as const

export function rengPracticaFu<T>(rengE: RengEspecFu<T>): RengPracticaN1 {
  const rengSub = rengE.id.replace(/-p[0-9]+$/, '')
  const rengNivel = RENG_DIFICULTAD[Number(/-p([0-9]+)$/.exec(rengE.id)![1]) as 1 | 2 | 3]
  const E = (rengD: Readonly<Record<string, number>>): T => rengE.lista[rengD.i!]!
  return rengFabricarPracticaN1({
    id: rengE.id, subtema: rengSub, titulo: rengE.titulo, dificultad: rengNivel, objetivo: rengE.objetivo, unidad: rengE.unidad, tolerancia: rengE.tolerancia ?? RENG_TOL_FU,
    fuentes: rengFuentesFu(rengE.seccion, rengE.para, rengE.masas ?? false), idealizado: rengE.idealizado, metodo: rengE.metodo, sinVerificar: rengE.sinVerificar ?? [RENG_DIDACTICO_FU],
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

export type RengSustFu = readonly [string, string, string]
export const RENG_SUSTANCIAS_FU: readonly RengSustFu[] = [
  ['agua', 'H2O', 'H'], ['glucosa', 'C6H12O6', 'C'], ['dióxido de carbono', 'CO2', 'O'], ['carbonato de calcio', 'CaCO3', 'O'], ['amoníaco', 'NH3', 'H'], ['metano', 'CH4', 'H'],
  ['etanol', 'C2H6O', 'C'], ['ácido sulfúrico', 'H2SO4', 'O'], ['óxido de hierro(III)', 'Fe2O3', 'Fe'], ['óxido de aluminio', 'Al2O3', 'Al'], ['carbonato de sodio', 'Na2CO3', 'Na'],
  ['propano', 'C3H8', 'H'], ['sacarosa', 'C12H22O11', 'C'], ['peróxido de hidrógeno', 'H2O2', 'O'], ['cloruro de calcio', 'CaCl2', 'Cl']
]

export interface RengOxidoFu {
  metal: string
  oxido: string
  nm: number
  no: number
}

export const RENG_OXIDOS_FU: readonly RengOxidoFu[] = [
  { metal: 'Mg', oxido: 'MgO', nm: 1, no: 1 }, { metal: 'Al', oxido: 'Al2O3', nm: 2, no: 3 }, { metal: 'Ca', oxido: 'CaO', nm: 1, no: 1 }, { metal: 'Fe', oxido: 'Fe2O3', nm: 2, no: 3 },
  { metal: 'Cu', oxido: 'CuO', nm: 1, no: 1 }, { metal: 'Zn', oxido: 'ZnO', nm: 1, no: 1 }, { metal: 'Na', oxido: 'Na2O', nm: 2, no: 1 }, { metal: 'Li', oxido: 'Li2O', nm: 2, no: 1 },
  { metal: 'K', oxido: 'K2O', nm: 2, no: 1 }, { metal: 'Ba', oxido: 'BaO', nm: 1, no: 1 }, { metal: 'Sn', oxido: 'SnO2', nm: 1, no: 2 }, { metal: 'Cr', oxido: 'Cr2O3', nm: 2, no: 3 }
]

export interface RengParOxidosFu {
  x: string
  a: string
  b: string
}

export const RENG_PARES_OXIDOS_FU: readonly RengParOxidosFu[] = [
  { x: 'C', a: 'CO', b: 'CO2' }, { x: 'N', a: 'NO', b: 'NO2' }, { x: 'N', a: 'N2O', b: 'NO' }, { x: 'S', a: 'SO2', b: 'SO3' }, { x: 'Fe', a: 'FeO', b: 'Fe2O3' }, { x: 'Cu', a: 'Cu2O', b: 'CuO' },
  { x: 'N', a: 'N2O3', b: 'N2O5' }, { x: 'Cl', a: 'Cl2O', b: 'Cl2O7' }, { x: 'Pb', a: 'PbO', b: 'PbO2' }, { x: 'Sn', a: 'SnO', b: 'SnO2' }, { x: 'N', a: 'NO', b: 'N2O5' }, { x: 'Mn', a: 'MnO', b: 'MnO2' },
  { x: 'Cr', a: 'CrO', b: 'CrO3' }, { x: 'Co', a: 'CoO', b: 'Co2O3' }
]

export interface RengMaterialFu {
  n: string
  rho: number
}

export const RENG_METALES_FU: readonly RengMaterialFu[] = [
  { n: 'aluminio', rho: 2.7 }, { n: 'hierro', rho: 7.87 }, { n: 'cobre', rho: 8.96 }, { n: 'plomo', rho: 11.34 }, { n: 'plata', rho: 10.49 }, { n: 'oro', rho: 19.3 },
  { n: 'cinc', rho: 7.14 }, { n: 'estaño', rho: 7.31 }, { n: 'níquel', rho: 8.91 }, { n: 'titanio', rho: 4.51 }, { n: 'magnesio', rho: 1.74 }, { n: 'platino', rho: 21.45 }
]

export const RENG_LIQUIDOS_FU: readonly RengMaterialFu[] = [
  { n: 'agua', rho: 1 }, { n: 'etanol', rho: 0.789 }, { n: 'glicerina', rho: 1.26 }, { n: 'acetona', rho: 0.785 }, { n: 'aceite de oliva', rho: 0.92 }, { n: 'agua de mar', rho: 1.025 },
  { n: 'ácido acético', rho: 1.049 }, { n: 'hexano', rho: 0.655 }, { n: 'leche', rho: 1.03 }, { n: 'cloroformo', rho: 1.49 }, { n: 'mercurio', rho: 13.53 }, { n: 'gasolina', rho: 0.74 }
]

export const RENG_FLOTANTES_FU: readonly (RengMaterialFu & { liq: string; rhoL: number })[] = [
  { n: 'madera de pino', rho: 0.5, liq: 'agua', rhoL: 1 }, { n: 'hielo', rho: 0.917, liq: 'agua', rhoL: 1 }, { n: 'corcho', rho: 0.24, liq: 'agua', rhoL: 1 }, { n: 'polietileno', rho: 0.95, liq: 'agua', rhoL: 1 },
  { n: 'cera', rho: 0.9, liq: 'agua', rhoL: 1 }, { n: 'hielo', rho: 0.917, liq: 'agua de mar', rhoL: 1.025 }, { n: 'madera de roble', rho: 0.75, liq: 'agua', rhoL: 1 }, { n: 'cera', rho: 0.9, liq: 'glicerina', rhoL: 1.26 },
  { n: 'aluminio', rho: 2.7, liq: 'mercurio', rhoL: 13.53 }, { n: 'hierro', rho: 7.87, liq: 'mercurio', rhoL: 13.53 }, { n: 'plástico ABS', rho: 1.05, liq: 'glicerina', rhoL: 1.26 }, { n: 'madera de pino', rho: 0.5, liq: 'aceite de oliva', rhoL: 0.92 },
  { n: 'corcho', rho: 0.24, liq: 'agua de mar', rhoL: 1.025 }, { n: 'parafina', rho: 0.9, liq: 'agua de mar', rhoL: 1.025 }
]

export interface RengGasFu {
  n: string
  f: string
}

export const RENG_GASES_FU: readonly RengGasFu[] = [
  { n: 'oxígeno', f: 'O2' }, { n: 'nitrógeno', f: 'N2' }, { n: 'dióxido de carbono', f: 'CO2' }, { n: 'metano', f: 'CH4' }, { n: 'helio', f: 'He' }, { n: 'hidrógeno', f: 'H2' },
  { n: 'argón', f: 'Ar' }, { n: 'amoníaco', f: 'NH3' }, { n: 'cloro', f: 'Cl2' }, { n: 'dióxido de azufre', f: 'SO2' }, { n: 'propano', f: 'C3H8' }, { n: 'neón', f: 'Ne' }
]

export interface RengCarbonatoFu {
  n: string
  f: string
  oxido: string
  k: number
}

export const RENG_CARBONATOS_FU: readonly RengCarbonatoFu[] = [
  { n: 'carbonato de calcio', f: 'CaCO3', oxido: 'CaO', k: 1 }, { n: 'carbonato de magnesio', f: 'MgCO3', oxido: 'MgO', k: 1 }, { n: 'carbonato de cinc', f: 'ZnCO3', oxido: 'ZnO', k: 1 },
  { n: 'carbonato de cobre(II)', f: 'CuCO3', oxido: 'CuO', k: 1 }, { n: 'carbonato de bario', f: 'BaCO3', oxido: 'BaO', k: 1 }, { n: 'carbonato de hierro(II)', f: 'FeCO3', oxido: 'FeO', k: 1 },
  { n: 'carbonato de estroncio', f: 'SrCO3', oxido: 'SrO', k: 1 }, { n: 'carbonato de plomo(II)', f: 'PbCO3', oxido: 'PbO', k: 1 }, { n: 'carbonato de manganeso(II)', f: 'MnCO3', oxido: 'MnO', k: 1 },
  { n: 'carbonato de cadmio', f: 'CdCO3', oxido: 'CdO', k: 1 }, { n: 'carbonato de níquel(II)', f: 'NiCO3', oxido: 'NiO', k: 1 }, { n: 'carbonato de cobalto(II)', f: 'CoCO3', oxido: 'CoO', k: 1 }
]

export interface RengBinarioFu {
  n: string
  f: string
  a: string
  b: string
}

export const RENG_BINARIOS_FU: readonly RengBinarioFu[] = [
  { n: 'agua', f: 'H2O', a: 'H', b: 'O' }, { n: 'dióxido de carbono', f: 'CO2', a: 'C', b: 'O' }, { n: 'cloruro de sodio', f: 'NaCl', a: 'Na', b: 'Cl' }, { n: 'óxido de hierro(III)', f: 'Fe2O3', a: 'Fe', b: 'O' },
  { n: 'óxido de magnesio', f: 'MgO', a: 'Mg', b: 'O' }, { n: 'óxido de aluminio', f: 'Al2O3', a: 'Al', b: 'O' }, { n: 'amoníaco', f: 'NH3', a: 'N', b: 'H' }, { n: 'metano', f: 'CH4', a: 'C', b: 'H' },
  { n: 'dióxido de azufre', f: 'SO2', a: 'S', b: 'O' }, { n: 'óxido de calcio', f: 'CaO', a: 'Ca', b: 'O' }, { n: 'sulfuro de hierro(II)', f: 'FeS', a: 'Fe', b: 'S' }, { n: 'cloruro de magnesio', f: 'MgCl2', a: 'Mg', b: 'Cl' }
]

export interface RengSolutoFu {
  n: string
  f: string
}

export const RENG_ANALITOS_FU: readonly RengSolutoFu[] = [
  { n: 'glucosa', f: 'C6H12O6' }, { n: 'urea', f: 'CH4N2O' }, { n: 'colesterol', f: 'C27H46O' }, { n: 'creatinina', f: 'C4H7N3O' }, { n: 'ácido úrico', f: 'C5H4N4O3' }, { n: 'sacarosa', f: 'C12H22O11' },
  { n: 'cloruro de sodio', f: 'NaCl' }, { n: 'cloruro de potasio', f: 'KCl' }, { n: 'etanol', f: 'C2H6O' }, { n: 'cafeína', f: 'C8H10N4O2' }, { n: 'ácido ascórbico', f: 'C6H8O6' }, { n: 'fructosa', f: 'C6H12O6' }
]

export interface RengLiquidoMolFu {
  n: string
  f: string
  rho: number
}

export const RENG_LIQUIDOS_MOL_FU: readonly RengLiquidoMolFu[] = [
  { n: 'agua', f: 'H2O', rho: 1 }, { n: 'etanol', f: 'C2H6O', rho: 0.789 }, { n: 'acetona', f: 'C3H6O', rho: 0.785 }, { n: 'glicerina', f: 'C3H8O3', rho: 1.26 }, { n: 'ácido acético', f: 'C2H4O2', rho: 1.049 },
  { n: 'hexano', f: 'C6H14', rho: 0.655 }, { n: 'metanol', f: 'CH4O', rho: 0.792 }, { n: 'cloroformo', f: 'CHCl3', rho: 1.49 }, { n: 'benceno', f: 'C6H6', rho: 0.876 }, { n: 'tolueno', f: 'C7H8', rho: 0.867 },
  { n: 'propan-2-ol', f: 'C3H8O', rho: 0.786 }, { n: 'mercurio', f: 'Hg', rho: 13.53 }
]

export interface RengMedidaFu {
  t: string
  c: number
  d: number
}

export const RENG_MEDIDAS_FU: readonly RengMedidaFu[] = [
  { t: '0,00450', c: 3, d: 5 }, { t: '120,0', c: 4, d: 1 }, { t: '1,050', c: 4, d: 3 }, { t: '0,10', c: 2, d: 2 }, { t: '25,30', c: 4, d: 2 }, { t: '1001', c: 4, d: 0 },
  { t: '0,0007', c: 1, d: 4 }, { t: '9,80', c: 3, d: 2 }, { t: '0,5060', c: 4, d: 4 }, { t: '100,0', c: 4, d: 1 }, { t: '10,01', c: 4, d: 2 }, { t: '0,03040', c: 4, d: 5 },
  { t: '2,5', c: 2, d: 1 }, { t: '3,14159', c: 6, d: 5 }, { t: '0,200', c: 3, d: 3 }, { t: '45,0', c: 3, d: 1 }, { t: '7,0010', c: 5, d: 4 }, { t: '0,060', c: 2, d: 3 }
]

export const rengDigitosFu = (rengT: string): number => rengT.replace(/[^0-9]/g, '').length

export interface RengNotacionFu {
  a: number
  m: number
  b: number
  n: number
}

export const RENG_PRODUCTOS_FU: readonly RengNotacionFu[] = [
  { a: 5, m: 3, b: 4, n: 2 }, { a: 3.2, m: 6, b: 5, n: 4 }, { a: 6.022, m: 23, b: 2, n: 1 }, { a: 8, m: 5, b: 7, n: 3 }, { a: 2.5, m: 7, b: 6, n: 2 }, { a: 9.1, m: 4, b: 3.3, n: 5 },
  { a: 4.5, m: 2, b: 2.4, n: 8 }, { a: 7.5, m: 9, b: 1.6, n: 3 }, { a: 1.8, m: 12, b: 6, n: 4 }, { a: 3.3, m: 5, b: 4.4, n: 6 }, { a: 5.5, m: 10, b: 2.2, n: 2 }, { a: 6.4, m: 3, b: 2.5, n: 11 },
  { a: 9.9, m: 6, b: 1.2, n: 7 }, { a: 2.2, m: 15, b: 5, n: 3 }
]

export const RENG_COCIENTES_FU: readonly RengNotacionFu[] = [
  { a: 2, m: 9, b: 5, n: 3 }, { a: 1.5, m: 12, b: 3, n: 4 }, { a: 3.6, m: 20, b: 6, n: 5 }, { a: 1.2, m: 8, b: 4, n: 2 }, { a: 2.4, m: 15, b: 8, n: 6 }, { a: 4.2, m: 11, b: 7, n: 3 },
  { a: 1.1, m: 10, b: 5.5, n: 4 }, { a: 2.7, m: 18, b: 9, n: 7 }, { a: 6.3, m: 14, b: 9, n: 2 }, { a: 1.6, m: 9, b: 3.2, n: 5 }, { a: 3.3, m: 16, b: 6.6, n: 8 }, { a: 4.8, m: 13, b: 6, n: 4 }
]

export const rengSup = (rengN: number): string => String(rengN).split('').map((rengC) => (rengC === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(rengC)]!)).join('')
export const rengCientificoFu = (rengA: number, rengE: number): string => `${String(rengA).replace('.', ',')}·10${rengSup(rengE)}`
