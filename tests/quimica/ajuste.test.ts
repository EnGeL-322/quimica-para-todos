import { describe, expect, it } from 'vitest'
import { rengAjustarEcuacion, rengAjustarIonElectron, rengLeerEcuacion } from '../../src/renderer/modules/simulador-quimica/nucleo/ajuste'

const RENG_CASOS: Array<[string, number[]]> = [
  ['H2 + O2 -> H2O', [2, 1, 2]],
  ['N2 + H2 -> NH3', [1, 3, 2]],
  ['CH4 + O2 -> CO2 + H2O', [1, 2, 1, 2]],
  ['C3H8 + O2 -> CO2 + H2O', [1, 5, 3, 4]],
  ['C2H6 + O2 -> CO2 + H2O', [2, 7, 4, 6]],
  ['C6H12O6 + O2 -> CO2 + H2O', [1, 6, 6, 6]],
  ['C8H18 + O2 -> CO2 + H2O', [2, 25, 16, 18]],
  ['Fe + O2 -> Fe2O3', [4, 3, 2]],
  ['Al + O2 -> Al2O3', [4, 3, 2]],
  ['Na + H2O -> NaOH + H2', [2, 2, 2, 1]],
  ['Zn + HCl -> ZnCl2 + H2', [1, 2, 1, 1]],
  ['Zn + CuSO4 -> ZnSO4 + Cu', [1, 1, 1, 1]],
  ['KClO3 -> KCl + O2', [2, 2, 3]],
  ['CaCO3 -> CaO + CO2', [1, 1, 1]],
  ['H2O2 -> H2O + O2', [2, 2, 1]],
  ['NaOH + HCl -> NaCl + H2O', [1, 1, 1, 1]],
  ['H2SO4 + NaOH -> Na2SO4 + H2O', [1, 2, 1, 2]],
  ['Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O', [3, 2, 1, 6]],
  ['AgNO3 + NaCl -> AgCl + NaNO3', [1, 1, 1, 1]],
  ['BaCl2 + Na2SO4 -> BaSO4 + NaCl', [1, 1, 1, 2]],
  ['Pb(NO3)2 + KI -> PbI2 + KNO3', [1, 2, 1, 2]],
  ['Al + HCl -> AlCl3 + H2', [2, 6, 2, 3]],
  ['Fe2O3 + CO -> Fe + CO2', [1, 3, 2, 3]],
  ['Cu + HNO3 -> Cu(NO3)2 + NO + H2O', [3, 8, 3, 2, 4]],
  ['Cu + HNO3 -> Cu(NO3)2 + NO2 + H2O', [1, 4, 1, 2, 2]],
  ['KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O', [2, 16, 2, 2, 5, 8]],
  ['K2Cr2O7 + HCl -> KCl + CrCl3 + Cl2 + H2O', [1, 14, 2, 2, 3, 7]],
  ['FeS2 + O2 -> Fe2O3 + SO2', [4, 11, 2, 8]],
  ['NH3 + O2 -> NO + H2O', [4, 5, 4, 6]],
  ['Ca3(PO4)2 + SiO2 + C -> CaSiO3 + P4 + CO', [2, 6, 10, 6, 1, 10]],
  ['Au + HNO3 + HCl -> HAuCl4 + NO + H2O', [1, 1, 4, 1, 1, 2]],
  ['P4 + O2 -> P4O10', [1, 5, 1]],
  ['NaHCO3 -> Na2CO3 + H2O + CO2', [2, 1, 1, 1]],
  ['C2H5OH + O2 -> CO2 + H2O', [1, 3, 2, 3]],
  ['Mg + O2 -> MgO', [2, 1, 2]],
  ['SO2 + O2 -> SO3', [2, 1, 2]],
  ['NO2 + H2O -> HNO3 + NO', [3, 1, 2, 1]],
  ['Cl2 + NaOH -> NaCl + NaClO3 + H2O', [3, 6, 5, 1, 3]],
  ['MnO2 + HCl -> MnCl2 + Cl2 + H2O', [1, 4, 1, 1, 2]],
  ['CuSO4·5H2O -> CuSO4 + H2O', [1, 1, 5]],
  ['Fe + Cl2 -> FeCl3', [2, 3, 2]],
  ['KI + Cl2 -> KCl + I2', [2, 1, 2, 1]],
  ['MnO4^- + Fe^2+ + H^+ -> Mn^2+ + Fe^3+ + H2O', [1, 5, 8, 1, 5, 4]],
  ['Cr2O7^2- + Fe^2+ + H^+ -> Cr^3+ + Fe^3+ + H2O', [1, 6, 14, 2, 6, 7]],
  ['Ag+ + Cu -> Ag + Cu2+', [2, 1, 2, 1]],
  ['C12H22O11 + O2 -> CO2 + H2O', [1, 12, 12, 11]],
  ['Al2(SO4)3 + Ca(OH)2 -> Al(OH)3 + CaSO4', [1, 3, 2, 3]],
  ['NH4NO3 -> N2O + H2O', [1, 1, 2]],
  ['Na2S2O3 + I2 -> Na2S4O6 + NaI', [2, 1, 1, 2]],
  ['K4[Fe(CN)6] + KMnO4 + H2SO4 -> KHSO4 + Fe2(SO4)3 + MnSO4 + HNO3 + CO2 + H2O', [10, 122, 299, 162, 5, 122, 60, 60, 188]]
]

describe('ajuste algebraico (espacio nulo exacto)', () => {
  it('tiene 50 casos de libro', () => expect(RENG_CASOS).toHaveLength(50))

  for (const [rengEc, rengEsperado] of RENG_CASOS) {
    it(rengEc, () => {
      const rengA = rengAjustarEcuacion(rengEc)
      expect([...rengA.reactivos, ...rengA.productos].map((rengT) => rengT.coef)).toEqual(rengEsperado)
      for (const rengC of rengA.comprobacion) expect(rengC.izquierda).toBe(rengC.derecha)
    })
  }

  it('ignora coeficientes escritos y acepta otras flechas', () => {
    expect(rengAjustarEcuacion('3H2 + 7O2 = H2O').texto).toBe('2H₂ + O₂ → 2H₂O')
    expect(rengAjustarEcuacion('N2 + H2 ⇌ NH3').texto).toBe('N₂ + 3H₂ → 2NH₃')
    expect(rengAjustarEcuacion('H2+O2->H2O').texto).toBe('2H₂ + O₂ → 2H₂O')
    expect(rengLeerEcuacion('Fe3+ + Cu -> Fe2+ + Cu2+').reactivos).toEqual(['Fe3+', 'Cu'])
  })

  it('explica por qué no puede ajustar', () => {
    expect(() => rengAjustarEcuacion('H2 + O2 -> NaCl')).toThrow(/aparece/)
    expect(() => rengAjustarEcuacion('H2O -> H2O2')).toThrow(/otro lado|ningún ajuste|no participa/)
    expect(() => rengAjustarEcuacion('H2 -> H2O')).toThrow(/O aparece en los productos/)
    expect(() => rengAjustarEcuacion('KMnO4 + H2O2 + H2SO4 -> K2SO4 + MnSO4 + O2 + H2O')).toThrow(/no tiene un ajuste único/)
    expect(() => rengAjustarEcuacion('H2 + O2')).toThrow(/flecha/)
  })
})

describe('método ion-electrón', () => {
  it('permanganato + Fe²⁺ en medio ácido', () => {
    const rengA = rengAjustarIonElectron('MnO4- + Fe2+ -> Mn2+ + Fe3+', 'acido')
    expect(rengA.texto).toBe('MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O')
    expect(rengA.electronesTransferidos).toBe(5)
    const rengRed = rengA.semirreacciones.find((rengS) => rengS.tipo === 'reducción')!
    expect(rengRed.texto).toBe('MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O')
    expect(rengRed.cambios).toEqual(['Mn: +7 → +2'])
  })

  it('dicromato + Fe²⁺ en medio ácido', () => {
    const rengA = rengAjustarIonElectron('Cr2O7^2- + Fe^2+ -> Cr^3+ + Fe^3+', 'acido')
    expect(rengA.texto).toBe('Cr₂O₇²⁻ + 6Fe²⁺ + 14H⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O')
    expect(rengA.electronesTransferidos).toBe(6)
  })

  it('permanganato + H₂O₂ (O como elemento principal), donde el método algebraico no basta', () => {
    const rengA = rengAjustarIonElectron('MnO4- + H2O2 -> Mn2+ + O2', 'acido')
    expect(rengA.texto).toBe('2MnO₄⁻ + 5H₂O₂ + 6H⁺ → 2Mn²⁺ + 5O₂ + 8H₂O')
  })

  it('permanganato + yoduro en medio básico', () => {
    const rengA = rengAjustarIonElectron('MnO4- + I- -> MnO2 + I2', 'basico')
    expect(rengA.texto).toBe('2MnO₄⁻ + 6I⁻ + 4H₂O → 2MnO₂ + 3I₂ + 8OH⁻')
  })

  it('cromo(III) + clorato en medio básico', () => {
    const rengA = rengAjustarIonElectron('Cr(OH)3 + ClO3- -> CrO4^2- + Cl-', 'basico')
    expect(rengA.texto).toBe('2Cr(OH)₃ + ClO₃⁻ + 4OH⁻ → 2CrO₄²⁻ + Cl⁻ + 5H₂O')
  })

  it('dismutación del cloro en medio básico', () => {
    const rengA = rengAjustarIonElectron('Cl2 -> Cl- + ClO3-', 'basico')
    expect(rengA.texto).toBe('3Cl₂ + 6OH⁻ → 5Cl⁻ + ClO₃⁻ + 3H₂O')
  })

  it('Zn + H⁺: el H₂ se empareja con H⁺ aunque el usuario lo escriba', () => {
    expect(rengAjustarIonElectron('Zn + H+ -> Zn2+ + H2', 'acido').texto).toBe('Zn + 2H⁺ → Zn²⁺ + H₂')
  })

  it('rechaza lo que no es redox', () => {
    expect(() => rengAjustarIonElectron('Ag+ + Cl- -> AgCl', 'acido')).toThrow()
  })
})
