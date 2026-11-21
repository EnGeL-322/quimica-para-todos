import { describe, expect, it } from 'vitest'
import { rengFormulaHill, rengAnalizarFormula } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { rengAnguloAtomos, rengDesdeSmiles, rengDesviacionPlano, rengDistanciaAtomos, rengGeometria3D, rengVecinos } from '../../src/renderer/modules/simulador-quimica/nucleo/molecula'
import { rengInterpretarSustancia, rengSemidesarrolladaASmiles, rengSustanciaOError, type RengSustancia } from '../../src/renderer/modules/simulador-quimica/nucleo/sustancia'
import { RENG_BIBLIOTECA } from '../../src/renderer/modules/simulador-quimica/datos/biblioteca'

const RENG_SUB = '₀₁₂₃₄₅₆₇₈₉'
const rengAscii = (rengS: string): string => rengS.replace(/[₀-₉]/g, (rengC) => String(RENG_SUB.indexOf(rengC)))
function rengHillDe(rengS: RengSustancia): string {
  if (rengS.grafo) return rengS.grafo.formula
  const rengBase = rengS.formula.split('·')[0]!.replace(/\^.*$/, '').replace(/[+-]+$/, '')
  return rengAscii(rengFormulaHill(rengAnalizarFormula(rengBase).atomos))
}

const RENG_CASOS: Array<[string, string]> = [
  ['H2O', 'H2O'], ['NaCl', 'ClNa'], ['Ca(OH)2', 'CaH2O2'], ['CuSO4·5H2O', 'CuO4S'], ['H2SO4', 'H2O4S'], ['HNO3', 'HNO3'], ['KMnO4', 'KMnO4'],
  ['NaHCO3', 'CHNaO3'], ['Fe2(SO4)3', 'Fe2O12S3'], ['CO2', 'CO2'], ['CO', 'CO'], ['NH3', 'H3N'], ['CH4', 'CH4'], ['HCl', 'ClH'], ['NaOH', 'HNaO'],
  ['CaCO3', 'CCaO3'], ['Al2O3', 'Al2O3'], ['FeCl3', 'Cl3Fe'], ['AgNO3', 'AgNO3'], ['K2Cr2O7', 'Cr2K2O7'], ['Fe^3+', 'Fe'], ['SO4^2-', 'O4S'], ['NH4+', 'H4N'],
  ['Hg2Cl2', 'Cl2Hg2'], ['H2O2', 'H2O2'], ['CCl4', 'CCl4'],
  ['CH3COOH', 'C2H4O2'], ['CH3CH2OH', 'C2H6O'], ['CH3OH', 'CH4O'], ['CH3CHO', 'C2H4O'], ['CH3COCH3', 'C3H6O'], ['HCOOH', 'CH2O2'], ['CH3COOCH2CH3', 'C4H8O2'],
  ['CH3OCH3', 'C2H6O'], ['CH2=CH2', 'C2H4'], ['CH≡CH', 'C2H2'], ['CH3CH2NH2', 'C2H7N'], ['CH3CN', 'C2H3N'], ['CHCl3', 'CHCl3'], ['CH2Cl2', 'CH2Cl2'],
  ['(CH3)2CHOH', 'C3H8O'], ['CH3CH(CH3)CH3', 'C4H10'], ['C6H5OH', 'C6H6O'], ['C6H5CH3', 'C7H8'], ['CH3CH2COOH', 'C3H6O2'], ['CH3CONH2', 'C2H5NO'], ['HCHO', 'CH2O'],
  ['CC(=O)O', 'C2H4O2'], ['c1ccccc1', 'C6H6'], ['OCC', 'C2H6O'], ['CCO', 'C2H6O'], ['CC(C)=O', 'C3H6O'], ['C1CCCCC1', 'C6H12'], ['CC(=O)Oc1ccccc1C(=O)O', 'C9H8O4'],
  ['Cn1cnc2c1c(=O)n(C)c(=O)n2C', 'C8H10N4O2'], ['C=CC=C', 'C4H6'], ['C#N', 'CHN'], ['O=C=O', 'CO2'], ['[NH4+]', 'H4N'], ['CC(C)Cc1ccc(cc1)C(C)C(=O)O', 'C13H18O2'],
  ['OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O', 'C6H12O6'], ['CCCCCCCCCC', 'C10H22'],
  ['Au', 'Au'], ['H2', 'H2'], ['Na', 'Na'], ['O2', 'O2'], ['He', 'He'], ['N2', 'N2'], ['Cl2', 'Cl2'], ['Fe', 'Fe'], ['Cu', 'Cu'], ['S8', 'S8'], ['P4', 'P4'], ['I2', 'I2'],
  ['ácido acético', 'C2H4O2'], ['etanol', 'C2H6O'], ['acetona', 'C3H6O'], ['benceno', 'C6H6'], ['tolueno', 'C7H8'], ['glucosa', 'C6H12O6'],
  ['sulfato de hierro(III)', 'Fe2O12S3'], ['ácido sulfúrico', 'H2O4S'], ['cloruro de sodio', 'ClNa'], ['bicarbonato de sodio', 'CHNaO3'], ['propan-2-ol', 'C3H8O'],
  ['but-2-eno', 'C4H8'], ['2-metilbutano', 'C5H12'], ['ácido etanoico', 'C2H4O2'], ['etanoato de etilo', 'C4H8O2'], ['agua', 'H2O'], ['amoniaco', 'H3N'], ['metano', 'CH4'],
  ['cafeína', 'C8H10N4O2'], ['aspirina', 'C9H8O4'], ['paracetamol', 'C8H9NO2'], ['óxido de cobre(II)', 'CuO'], ['hidróxido de calcio', 'CaH2O2'],
  ['permanganato de potasio', 'KMnO4'], ['dióxido de carbono', 'CO2'], ['Ácido Nítrico', 'HNO3'], ['ETANOL', 'C2H6O'], ['acido acetico', 'C2H4O2']
]

describe('entrada universal: 100 sustancias variadas', () => {
  it('hay al menos 100 casos', () => expect(RENG_CASOS.length).toBeGreaterThanOrEqual(100))
  for (const [rengEntrada, rengHill] of RENG_CASOS) {
    it(rengEntrada, () => expect(rengHillDe(rengSustanciaOError(rengEntrada))).toBe(rengHill))
  }
  it('detecta la vía y el tipo', () => {
    expect(rengSustanciaOError('CCO')).toMatchObject({ via: 'smiles', tipo: 'organico', nombre: 'etanol' })
    expect(rengSustanciaOError('CH3COOH')).toMatchObject({ via: 'semidesarrollada', nombre: 'ácido etanoico' })
    expect(rengSustanciaOError('NaCl')).toMatchObject({ via: 'formula', tipo: 'ionico', idRed: 'NaCl' })
    expect(rengSustanciaOError('Au')).toMatchObject({ via: 'elemento', tipo: 'elemento', idRed: 'Au' })
    expect(rengSustanciaOError('H2O')).toMatchObject({ idExperimental: 'h2o' })
    expect(rengSustanciaOError('SO4^2-')).toMatchObject({ tipo: 'ion', carga: -2 })
    expect(rengSustanciaOError('ácido acético').otrosNombres).toContain('ácido acético')
    expect(rengSustanciaOError('etanol').via).toBe('nombre')
    expect(rengSustanciaOError('H2SO4').smiles).toBeTruthy()
  })
})

describe('fórmulas moleculares ambiguas: isómeros, nunca una elección en silencio', () => {
  it('C2H6O → etanol o metoximetano (dimetiléter)', () => {
    const rengR = rengInterpretarSustancia('C2H6O')
    expect(rengR.tipo).toBe('isomeros')
    if (rengR.tipo === 'isomeros') expect(rengR.opciones.map((rengO) => rengO.nombre).sort()).toEqual(['etanol', 'metoximetano'])
  })
  it('C6H12O6 → la glucosa de la biblioteca, avisando de que puede haber otros isómeros', () => {
    const rengR = rengInterpretarSustancia('C6H12O6')
    expect(rengR.tipo).toBe('isomeros')
    if (rengR.tipo === 'isomeros') {
      expect(rengR.opciones.map((rengO) => rengO.nombre)).toContain('glucosa')
      expect(rengR.nota).toMatch(/otros isómeros/)
    }
  })
  it('una fórmula molecular sin isómeros conocidos lo explica', () => {
    const rengR = rengInterpretarSustancia('C9H20O3')
    expect(rengR.tipo).toBe('error')
    if (rengR.tipo === 'error') expect(rengR.motivo).toMatch(/isómeros/)
  })
})

describe('errores con motivo concreto, nunca solo «no reconocido»', () => {
  it.each([
    ['xyz123', /empiezan por mayúscula/],
    ['Xy2', /Elemento desconocido/],
    ['Ca(OH', /Paréntesis/],
    ['C(C)(C)(C)(C)C', /Valencia imposible/],
    ['C(C', /Paréntesis|cerrar/],
    ['NaCl3', /sodio no tiene número de oxidación \+3/],
    ['óxido de neón', /gas noble/],
    ['Na2', /no es la forma habitual/],
    ['', /Escribe/]
  ])('«%s»', (rengEntrada, rengRe) => {
    const rengR = rengInterpretarSustancia(rengEntrada)
    expect(rengR.tipo).toBe('error')
    if (rengR.tipo === 'error') {
      expect(rengR.motivo).toMatch(rengRe)
      expect(rengR.motivo).not.toMatch(/^no reconocido/i)
    }
  })
  it('sugiere nombres parecidos', () => {
    const rengR = rengInterpretarSustancia('acetonna')
    expect(rengR.tipo).toBe('error')
    if (rengR.tipo === 'error') expect(rengR.sugerencias).toContain('acetona')
  })
})

describe('semidesarrolladas → SMILES', () => {
  it.each([
    ['CH3COOH', 'CC(=O)O'],
    ['(CH3)2CHOH', 'C(C)(C)O'],
    ['CHCl3', 'C(Cl)(Cl)Cl'],
    ['CH2=CH2', 'C=C'],
    ['C6H5OH', 'c1ccccc1O']
  ])('%s → %s', (rengF, rengS) => expect(rengSemidesarrolladaASmiles(rengF)).toBe(rengS))
})

describe('geometrías calculadas (MMFF94s) razonables', () => {
  it('H₂O ≈ 104,5° ± 3°', () => {
    const rengM = rengGeometria3D('O')
    expect(Math.abs(rengAnguloAtomos(rengM, 1, 0, 2) - 104.5)).toBeLessThanOrEqual(3)
  })
  it('CH₄ ≈ 109,5° ± 1°', () => {
    const rengM = rengGeometria3D('C')
    for (const [rengA, rengB] of [
      [1, 2],
      [1, 3],
      [2, 4]
    ] as const)
      expect(Math.abs(rengAnguloAtomos(rengM, rengA, 0, rengB) - 109.47)).toBeLessThanOrEqual(1)
  })
  it('benceno plano y C=C ≈ 1,34 Å ± 0,03', () => {
    const rengB = rengGeometria3D('c1ccccc1')
    const rengAnillo = rengB.atomos.map((rengA, rengI) => (rengA.el === 'C' ? rengI : -1)).filter((rengI) => rengI >= 0)
    expect(rengDesviacionPlano(rengB, rengAnillo)).toBeLessThan(0.01)
    const rengE = rengGeometria3D('C=C')
    expect(Math.abs(rengDistanciaAtomos(rengE, 0, 1) - 1.34)).toBeLessThanOrEqual(0.03)
  })
  it('reproducible (misma semilla, mismas coordenadas) y con todos los H', () => {
    const rengA = rengGeometria3D('CCO')
    const rengB = rengGeometria3D('CCO')
    expect(rengA.atomos.map((rengX) => rengX.x)).toEqual(rengB.atomos.map((rengX) => rengX.x))
    expect(rengA.atomos.filter((rengX) => rengX.el === 'H')).toHaveLength(6)
    expect(rengVecinos(rengA, 0).length).toBe(4)
  })
  it('los metales y gases nobles no tienen parámetros MMFF: se dice', () => {
    expect(() => rengGeometria3D('[Au]')).toThrow(/MMFF94/)
  })
})

describe('biblioteca', () => {
  it('unas 80 entradas o más, todas con fuente y que se interpretan', () => {
    expect(RENG_BIBLIOTECA.length).toBeGreaterThanOrEqual(80)
    for (const rengB of RENG_BIBLIOTECA) {
      expect(rengB.fuente.trim()).not.toBe('')
      if (rengB.smiles) expect(() => rengDesdeSmiles(rengB.smiles!)).not.toThrow()
      expect(rengInterpretarSustancia(rengB.entrada).tipo, rengB.nombre).toBe('ok')
    }
  })
})
