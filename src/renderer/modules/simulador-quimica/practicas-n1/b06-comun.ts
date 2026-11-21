import { rengTx } from '../aprender/n1/gases/constantes'
import { RENG_PROCEDENCIA_AJUSTE, RENG_S131, RENG_S151, RENG_S171, RENG_S41, RENG_S42R, RENG_S43, RENG_S53R, rengSeccionRq } from '../aprender/n1/reacciones/comun'
import { RENG_PROCEDENCIA_MASAS } from '../aprender/n1/procedencia'
import type { RengProcedenciaN1, RengToleranciaN1 } from '../aprender/n1/tipos'
import { rengEntreN1, rengIndice } from './aleatorio'
import { rengAtomosNo, rengMNo, rengTxtNo, type RengErrorNo } from './b05-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

export const RENG_TOL_RQ: RengToleranciaN1 = { rel: 0.005, abs: 1e-6 }
export const RENG_TOL_RQ_ENT: RengToleranciaN1 = { rel: 0.001, abs: 0.02 }

const RENG_SECCIONES_RQ = { '4.1': RENG_S41, '4.2': RENG_S42R, '4.3': RENG_S43, '5.3': RENG_S53R, '13.1': RENG_S131, '15.1': RENG_S151, '17.1': RENG_S171 }
export const rengFuentesRq = (rengSeccion: keyof typeof RENG_SECCIONES_RQ, rengPara: string): readonly RengProcedenciaN1[] => [rengSeccionRq(RENG_SECCIONES_RQ[rengSeccion], rengPara), RENG_PROCEDENCIA_AJUSTE, RENG_PROCEDENCIA_MASAS]

export interface RengRxRq {
  esp: readonly string[]
  nu: readonly number[]
  nr: number
}

export const rengRx = (rengTexto: string): RengRxRq => {
  const [rengIzq, rengDer] = rengTexto.split(' -> ')
  const rengTerm = (rengS: string) => rengS.split(' + ').map((rengT) => { const rengM = /^([0-9]*)(.+)$/.exec(rengT.trim())!; return { nu: rengM[1] === '' ? 1 : Number(rengM[1]), f: rengM[2]! } })
  const rengA = rengTerm(rengIzq!)
  const rengB = rengTerm(rengDer!)
  return { esp: [...rengA, ...rengB].map((rengX) => rengX.f), nu: [...rengA, ...rengB].map((rengX) => rengX.nu), nr: rengA.length }
}

const rengTerminoTxt = (rengNu: number, rengF: string): string => `${rengNu === 1 ? '' : `${rengNu} `}${rengTxtNo(rengF)}`
export const rengTxtRx = (rengR: RengRxRq): string => `${rengR.esp.slice(0, rengR.nr).map((rengF, rengI) => rengTerminoTxt(rengR.nu[rengI]!, rengF)).join(' + ')} → ${rengR.esp.slice(rengR.nr).map((rengF, rengI) => rengTerminoTxt(rengR.nu[rengR.nr + rengI]!, rengF)).join(' + ')}`
export const rengSinAjustarRx = (rengR: RengRxRq): string => `${rengR.esp.slice(0, rengR.nr).map(rengTxtNo).join(' + ')} → ${rengR.esp.slice(rengR.nr).map(rengTxtNo).join(' + ')}`
export const rengCoreRx = (rengR: RengRxRq): string => `${rengR.esp.slice(0, rengR.nr).join(' + ')} -> ${rengR.esp.slice(rengR.nr).join(' + ')}`
export const rengMRq = (rengF: string): number => rengMNo(rengF)
export const rengMasaDesde = (rengR: RengRxRq, rengI: number, rengX: number, rengJ: number): number => (rengX / rengMRq(rengR.esp[rengI]!) / rengR.nu[rengI]!) * rengR.nu[rengJ]! * rengMRq(rengR.esp[rengJ]!)
export const rengAtomosLado = (rengR: RengRxRq, rengDesde: number, rengHasta: number, rengConCoef = true): number => {
  let rengS = 0
  for (let rengI = rengDesde; rengI < rengHasta; rengI++) rengS += (rengConCoef ? rengR.nu[rengI]! : 1) * [...rengAtomosNo(rengR.esp[rengI]!).values()].reduce((rengA, rengB) => rengA + rengB, 0)
  return rengS
}
export const rengSumaNu = (rengR: RengRxRq): number => rengR.nu.reduce((rengA, rengB) => rengA + rengB, 0)

const rx = rengRx
export const RENG_SINTESIS_RQ: readonly RengRxRq[] = ['2H2 + O2 -> 2H2O', 'N2 + 3H2 -> 2NH3', '2Mg + O2 -> 2MgO', '4Al + 3O2 -> 2Al2O3', '4Fe + 3O2 -> 2Fe2O3', 'CaO + H2O -> Ca(OH)2', '2Na + Cl2 -> 2NaCl', 'S + O2 -> SO2', '2SO2 + O2 -> 2SO3', 'C + O2 -> CO2', '2Ca + O2 -> 2CaO', 'H2 + Cl2 -> 2HCl', 'SO3 + H2O -> H2SO4', '2Cu + O2 -> 2CuO', '4Li + O2 -> 2Li2O'].map(rx)
export const RENG_DESCOMPOSICION_RQ: readonly RengRxRq[] = ['CaCO3 -> CaO + CO2', '2H2O2 -> 2H2O + O2', '2H2O -> 2H2 + O2', '2NaHCO3 -> Na2CO3 + H2O + CO2', 'MgCO3 -> MgO + CO2', '2HgO -> 2Hg + O2', 'CuCO3 -> CuO + CO2', 'Cu(OH)2 -> CuO + H2O', '2Ag2O -> 4Ag + O2', 'NH4Cl -> NH3 + HCl', 'ZnCO3 -> ZnO + CO2', 'Ca(OH)2 -> CaO + H2O', 'BaCO3 -> BaO + CO2'].map(rx)
export const RENG_DESPLAZAMIENTO_RQ: readonly RengRxRq[] = ['Zn + CuSO4 -> ZnSO4 + Cu', 'Fe + CuSO4 -> FeSO4 + Cu', 'Mg + 2HCl -> MgCl2 + H2', 'Zn + 2HCl -> ZnCl2 + H2', 'Cu + 2AgNO3 -> Cu(NO3)2 + 2Ag', '2Al + 6HCl -> 2AlCl3 + 3H2', 'Fe + 2HCl -> FeCl2 + H2', 'Mg + CuSO4 -> MgSO4 + Cu', 'Zn + 2AgNO3 -> Zn(NO3)2 + 2Ag', '2Al + 3CuSO4 -> Al2(SO4)3 + 3Cu', 'Cl2 + 2KBr -> 2KCl + Br2', 'Mg + ZnSO4 -> MgSO4 + Zn', 'Ca + 2H2O -> Ca(OH)2 + H2', '2Na + 2H2O -> 2NaOH + H2'].map(rx)
export const RENG_DOBLE_RQ: readonly RengRxRq[] = ['AgNO3 + KCl -> AgCl + KNO3', 'Pb(NO3)2 + 2KI -> PbI2 + 2KNO3', 'BaCl2 + Na2SO4 -> BaSO4 + 2NaCl', 'CaCl2 + Na2CO3 -> CaCO3 + 2NaCl', 'CuSO4 + 2NaOH -> Cu(OH)2 + Na2SO4', 'FeCl3 + 3NaOH -> Fe(OH)3 + 3NaCl', 'AgNO3 + KBr -> AgBr + KNO3', 'MgCl2 + 2KOH -> Mg(OH)2 + 2KCl', 'Na2S + CuSO4 -> CuS + Na2SO4', 'BaCl2 + K2CO3 -> BaCO3 + 2KCl', 'ZnCl2 + 2KOH -> Zn(OH)2 + 2KCl', 'Pb(NO3)2 + K2SO4 -> PbSO4 + 2KNO3', 'Ba(NO3)2 + K2SO4 -> BaSO4 + 2KNO3'].map(rx)
export const RENG_NEUTRALIZACION_RQ: readonly RengRxRq[] = ['HCl + NaOH -> NaCl + H2O', 'H2SO4 + 2NaOH -> Na2SO4 + 2H2O', 'HNO3 + KOH -> KNO3 + H2O', '2HCl + Ca(OH)2 -> CaCl2 + 2H2O', 'H3PO4 + 3NaOH -> Na3PO4 + 3H2O', 'H2SO4 + Ba(OH)2 -> BaSO4 + 2H2O', '2HNO3 + Mg(OH)2 -> Mg(NO3)2 + 2H2O', 'HCl + KOH -> KCl + H2O', 'CH3COOH + NaOH -> CH3COONa + H2O', 'H2SO4 + 2KOH -> K2SO4 + 2H2O', '2HCl + Ba(OH)2 -> BaCl2 + 2H2O', 'HBr + NaOH -> NaBr + H2O'].map(rx)
export const RENG_TODAS_RQ: readonly RengRxRq[] = [...RENG_SINTESIS_RQ, ...RENG_DESCOMPOSICION_RQ, ...RENG_DESPLAZAMIENTO_RQ, ...RENG_DOBLE_RQ]
export const RENG_DOS_REACTIVOS_RQ: readonly RengRxRq[] = RENG_TODAS_RQ.filter((rengR) => rengR.nr === 2)
export const RENG_AJUSTE_RQ: readonly RengRxRq[] = ['4Fe + 3O2 -> 2Fe2O3', '4Al + 3O2 -> 2Al2O3', 'N2 + 3H2 -> 2NH3', '2Al + 6HCl -> 2AlCl3 + 3H2', 'Fe2O3 + 3CO -> 2Fe + 3CO2', 'Fe2O3 + 3C -> 2Fe + 3CO', 'Fe2O3 + 3H2 -> 2Fe + 3H2O', '4NH3 + 5O2 -> 4NO + 6H2O', '2C2H6 + 7O2 -> 4CO2 + 6H2O', 'P4 + 5O2 -> P4O10', '2Al + 3Cl2 -> 2AlCl3', 'Ca3(PO4)2 + 3H2SO4 -> 3CaSO4 + 2H3PO4', '3NO2 + H2O -> 2HNO3 + NO', 'C3H8 + 5O2 -> 3CO2 + 4H2O', '2Na + 2H2O -> 2NaOH + H2', 'Mg3N2 + 6H2O -> 3Mg(OH)2 + 2NH3', '2H2S + 3O2 -> 2SO2 + 2H2O', 'C2H4 + 3O2 -> 2CO2 + 2H2O', '2Fe + 3Cl2 -> 2FeCl3', 'CaC2 + 2H2O -> Ca(OH)2 + C2H2', '4Na + O2 -> 2Na2O', 'SiCl4 + 2H2O -> SiO2 + 4HCl', 'Cu + 2H2SO4 -> CuSO4 + SO2 + 2H2O'].map(rx)

export interface RengGasRq {
  rx: RengRxRq
  gas: number
}

export const RENG_GAS_ABIERTO_RQ: readonly RengGasRq[] = [
  { rx: rx('CaCO3 + 2HCl -> CaCl2 + H2O + CO2'), gas: 4 }, { rx: rx('NaHCO3 + HCl -> NaCl + H2O + CO2'), gas: 4 }, { rx: rx('Na2CO3 + 2HCl -> 2NaCl + H2O + CO2'), gas: 4 },
  { rx: rx('Zn + 2HCl -> ZnCl2 + H2'), gas: 3 }, { rx: rx('Mg + 2HCl -> MgCl2 + H2'), gas: 3 }, { rx: rx('CaCO3 -> CaO + CO2'), gas: 2 }, { rx: rx('2H2O2 -> 2H2O + O2'), gas: 2 },
  { rx: rx('MgCO3 -> MgO + CO2'), gas: 2 }, { rx: rx('K2CO3 + 2HCl -> 2KCl + H2O + CO2'), gas: 4 }, { rx: rx('Fe + 2HCl -> FeCl2 + H2'), gas: 3 }, { rx: rx('KHCO3 + HCl -> KCl + H2O + CO2'), gas: 4 },
  { rx: rx('MgCO3 + 2HCl -> MgCl2 + H2O + CO2'), gas: 4 }
]

export interface RengRedoxRq {
  ec: string
  texto: string
  medio: 'acido' | 'basico'
  ox: string
  red: string
  nOx: number
  nRed: number
  eOx: number
  eRed: number
}

export const RENG_REDOX_RQ: readonly RengRedoxRq[] = [
  { ec: 'MnO4- + Fe2+ -> Mn2+ + Fe3+', texto: 'MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺', medio: 'acido', ox: 'MnO4-', red: 'Fe2+', nOx: 1, nRed: 5, eOx: 5, eRed: 1 },
  { ec: 'Cr2O7^2- + Fe^2+ -> Cr^3+ + Fe^3+', texto: 'Cr₂O₇²⁻ + Fe²⁺ → Cr³⁺ + Fe³⁺', medio: 'acido', ox: 'Cr2O7^2-', red: 'Fe^2+', nOx: 1, nRed: 6, eOx: 6, eRed: 1 },
  { ec: 'MnO4- + H2O2 -> Mn2+ + O2', texto: 'MnO₄⁻ + H₂O₂ → Mn²⁺ + O₂', medio: 'acido', ox: 'MnO4-', red: 'H2O2', nOx: 2, nRed: 5, eOx: 5, eRed: 2 },
  { ec: 'Cu + NO3- -> Cu2+ + NO', texto: 'Cu + NO₃⁻ → Cu²⁺ + NO', medio: 'acido', ox: 'NO3-', red: 'Cu', nOx: 2, nRed: 3, eOx: 3, eRed: 2 },
  { ec: 'MnO4- + I- -> MnO2 + I2', texto: 'MnO₄⁻ + I⁻ → MnO₂ + I₂', medio: 'basico', ox: 'MnO4-', red: 'I-', nOx: 2, nRed: 6, eOx: 3, eRed: 1 },
  { ec: 'MnO4- + SO3^2- -> Mn2+ + SO4^2-', texto: 'MnO₄⁻ + SO₃²⁻ → Mn²⁺ + SO₄²⁻', medio: 'acido', ox: 'MnO4-', red: 'SO3^2-', nOx: 2, nRed: 5, eOx: 5, eRed: 2 },
  { ec: 'Cr2O7^2- + I- -> Cr^3+ + I2', texto: 'Cr₂O₇²⁻ + I⁻ → Cr³⁺ + I₂', medio: 'acido', ox: 'Cr2O7^2-', red: 'I-', nOx: 1, nRed: 6, eOx: 6, eRed: 1 },
  { ec: 'MnO4- + C2O4^2- -> Mn2+ + CO2', texto: 'MnO₄⁻ + C₂O₄²⁻ → Mn²⁺ + CO₂', medio: 'acido', ox: 'MnO4-', red: 'C2O4^2-', nOx: 2, nRed: 5, eOx: 5, eRed: 2 },
  { ec: 'Fe3+ + Sn2+ -> Fe2+ + Sn4+', texto: 'Fe³⁺ + Sn²⁺ → Fe²⁺ + Sn⁴⁺', medio: 'acido', ox: 'Fe3+', red: 'Sn2+', nOx: 2, nRed: 1, eOx: 1, eRed: 2 },
  { ec: 'Ag+ + Cu -> Ag + Cu2+', texto: 'Ag⁺ + Cu → Ag + Cu²⁺', medio: 'acido', ox: 'Ag+', red: 'Cu', nOx: 2, nRed: 1, eOx: 1, eRed: 2 },
  { ec: 'Zn + NO3- -> Zn2+ + NH4+', texto: 'Zn + NO₃⁻ → Zn²⁺ + NH₄⁺', medio: 'acido', ox: 'NO3-', red: 'Zn', nOx: 1, nRed: 4, eOx: 8, eRed: 2 },
  { ec: 'Al + Cu2+ -> Al3+ + Cu', texto: 'Al + Cu²⁺ → Al³⁺ + Cu', medio: 'acido', ox: 'Cu2+', red: 'Al', nOx: 3, nRed: 2, eOx: 2, eRed: 3 },
  { ec: 'MnO4- + Cl- -> Mn2+ + Cl2', texto: 'MnO₄⁻ + Cl⁻ → Mn²⁺ + Cl₂', medio: 'acido', ox: 'MnO4-', red: 'Cl-', nOx: 2, nRed: 10, eOx: 5, eRed: 1 },
  { ec: 'Cr2O7^2- + SO3^2- -> Cr^3+ + SO4^2-', texto: 'Cr₂O₇²⁻ + SO₃²⁻ → Cr³⁺ + SO₄²⁻', medio: 'acido', ox: 'Cr2O7^2-', red: 'SO3^2-', nOx: 1, nRed: 3, eOx: 6, eRed: 2 },
  { ec: 'ClO- + Fe2+ -> Cl- + Fe3+', texto: 'ClO⁻ + Fe²⁺ → Cl⁻ + Fe³⁺', medio: 'acido', ox: 'ClO-', red: 'Fe2+', nOx: 1, nRed: 2, eOx: 2, eRed: 1 },
  { ec: 'BrO3- + Fe2+ -> Br- + Fe3+', texto: 'BrO₃⁻ + Fe²⁺ → Br⁻ + Fe³⁺', medio: 'acido', ox: 'BrO3-', red: 'Fe2+', nOx: 1, nRed: 6, eOx: 6, eRed: 1 }
]

export const rengETotalRq = (rengR: RengRedoxRq): number => rengR.nOx * rengR.eOx

export interface RengEspecRq<T> {
  id: string
  titulo: string
  objetivo: string
  unidad: string
  tolerancia?: RengToleranciaN1
  seccion: keyof typeof RENG_SECCIONES_RQ
  para: string
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

export function rengPracticaRq<T>(rengE: RengEspecRq<T>): RengPracticaN1 {
  const rengSub = rengE.id.replace(/-p[0-9]+$/, '')
  const rengNivel = RENG_DIFICULTAD[Number(/-p([0-9]+)$/.exec(rengE.id)![1]) as 1 | 2 | 3]
  const E = (rengD: Readonly<Record<string, number>>): T => rengE.lista[rengD.i!]!
  return rengFabricarPracticaN1({
    id: rengE.id, subtema: rengSub, titulo: rengE.titulo, dificultad: rengNivel, objetivo: rengE.objetivo, unidad: rengE.unidad, tolerancia: rengE.tolerancia ?? RENG_TOL_RQ,
    fuentes: rengFuentesRq(rengE.seccion, rengE.para), idealizado: rengE.idealizado, metodo: rengE.metodo, ...(rengE.sinVerificar ? { sinVerificar: rengE.sinVerificar } : {}),
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

export const rengDatoRx = (rengR: RengRxRq): readonly [string, string] => ['Ecuación ajustada', rengTxtRx(rengR)]
export const rengTxRq = rengTx
export const RENG_DH_SIN_VERIFICAR_RQ = 'Las entalpías de reacción de estas prácticas son valores redondeados de uso común o didácticos; no se contrastaron con una fuente en esta entrega.'

export const RENG_SAL_OXIDANTE_RQ: Readonly<Record<string, string>> = { 'MnO4-': 'KMnO4', 'Cr2O7^2-': 'K2Cr2O7', 'NO3-': 'KNO3', 'Fe3+': 'FeCl3', 'Ag+': 'AgNO3', 'Cu2+': 'CuSO4', 'ClO-': 'NaClO', 'BrO3-': 'KBrO3' }

export interface RengCombustibleRq {
  n: string
  x: number
  y: number
  z: number
}

export const RENG_COMBUSTIBLES_RQ: readonly RengCombustibleRq[] = [
  { n: 'metano', x: 1, y: 4, z: 0 }, { n: 'etano', x: 2, y: 6, z: 0 }, { n: 'propano', x: 3, y: 8, z: 0 }, { n: 'butano', x: 4, y: 10, z: 0 }, { n: 'pentano', x: 5, y: 12, z: 0 },
  { n: 'hexano', x: 6, y: 14, z: 0 }, { n: 'heptano', x: 7, y: 16, z: 0 }, { n: 'octano', x: 8, y: 18, z: 0 }, { n: 'eteno', x: 2, y: 4, z: 0 }, { n: 'etino', x: 2, y: 2, z: 0 },
  { n: 'benceno', x: 6, y: 6, z: 0 }, { n: 'metanol', x: 1, y: 4, z: 1 }, { n: 'etanol', x: 2, y: 6, z: 1 }, { n: 'propan-1-ol', x: 3, y: 8, z: 1 }, { n: 'propanona (acetona)', x: 3, y: 6, z: 1 },
  { n: 'glucosa', x: 6, y: 12, z: 6 }, { n: 'ácido acético', x: 2, y: 4, z: 2 }
]

export const rengFCombRq = (rengC: RengCombustibleRq): string => `C${rengC.x === 1 ? '' : rengC.x}H${rengC.y}${rengC.z === 0 ? '' : rengC.z === 1 ? 'O' : `O${rengC.z}`}`
