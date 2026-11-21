import { describe, expect, it } from 'vitest'
import {
  rengAnalizarFormula,
  rengBonita,
  rengComposicionCentesimal,
  rengFormulaEmpirica,
  rengFormulaHill,
  rengFormulaMolecular,
  rengMasaMolarDe
} from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { rengEstadosOxidacion, rengTextoEstado } from '../../src/renderer/modules/simulador-quimica/nucleo/oxidacion'

const rengCerca = (rengA: number, rengB: number, rengTol: number): void => expect(Math.abs(rengA - rengB)).toBeLessThanOrEqual(rengTol)
const rengAtomos = (rengF: string): Record<string, number> => Object.fromEntries(rengAnalizarFormula(rengF).atomos)

describe('analizarFormula', () => {
  it('lee grupos, corchetes e hidratos', () => {
    expect(rengAtomos('Ca(OH)2')).toEqual({ Ca: 1, O: 2, H: 2 })
    expect(rengAtomos('Al2(SO4)3')).toEqual({ Al: 2, S: 3, O: 12 })
    expect(rengAtomos('K4[Fe(CN)6]')).toEqual({ K: 4, Fe: 1, C: 6, N: 6 })
    expect(rengAtomos('CuSO4·5H2O')).toEqual({ Cu: 1, S: 1, O: 9, H: 10 })
    expect(rengAtomos('CuSO4*5H2O')).toEqual({ Cu: 1, S: 1, O: 9, H: 10 })
    expect(rengAtomos('C₆H₁₂O₆')).toEqual({ C: 6, H: 12, O: 6 })
  })

  it('lee cargas en todas las notaciones documentadas', () => {
    const rengCarga = (rengF: string): number => rengAnalizarFormula(rengF).carga
    expect(rengCarga('SO4^2-')).toBe(-2)
    expect(rengCarga('SO4{2-}')).toBe(-2)
    expect(rengCarga('SO4 2-')).toBe(-2)
    expect(rengCarga('SO₄²⁻')).toBe(-2)
    expect(rengCarga('NH4+')).toBe(1)
    expect(rengAtomos('NH4+')).toEqual({ N: 1, H: 4 })
    expect(rengCarga('MnO4-')).toBe(-1)
    expect(rengCarga('Fe3+')).toBe(3)
    expect(rengAtomos('Fe3+')).toEqual({ Fe: 1 })
    expect(rengCarga('Fe+3')).toBe(3)
    expect(rengCarga('Fe+++')).toBe(3)
    expect(rengCarga('S2-')).toBe(-2)
    expect(rengCarga('Cr2O7^2-')).toBe(-2)
    expect(rengCarga('H2O')).toBe(0)
    expect(rengAnalizarFormula('e-').electron).toBe(true)
  })

  it('rechaza con mensajes claros', () => {
    expect(() => rengAnalizarFormula('')).toThrow()
    expect(() => rengAnalizarFormula('Xx2')).toThrow(/desconocido/)
    expect(() => rengAnalizarFormula('CL')).toThrow(/desconocido/)
    expect(() => rengAnalizarFormula('Ca(OH')).toThrow(/Paréntesis/)
    expect(() => rengAnalizarFormula('Ca(OH]2')).toThrow(/Paréntesis/)
    expect(() => rengAnalizarFormula('H2O$')).toThrow(/no válido/)
    expect(() => rengAnalizarFormula('SO42-')).toThrow(/ambigua/)
    expect(() => rengAnalizarFormula('2H2O')).toThrow(/número/)
  })

  it('escribe en Hill y en forma bonita', () => {
    expect(rengFormulaHill(rengAnalizarFormula('C2H5OH').atomos)).toBe('C₂H₆O')
    expect(rengFormulaHill(rengAnalizarFormula('H2SO4').atomos)).toBe('H₂O₄S')
    expect(rengBonita('Ca(OH)2')).toBe('Ca(OH)₂')
    expect(rengBonita('SO4^2-')).toBe('SO₄²⁻')
    expect(rengBonita('Fe3+')).toBe('Fe³⁺')
    expect(rengBonita('CuSO4·5H2O')).toBe('CuSO₄·5H₂O')
  })
})

describe('masa molar (pesos atómicos abreviados CIAAW/IUPAC de la tabla de la app)', () => {
  it('coincide con los valores de referencia', () => {
    rengCerca(rengMasaMolarDe('H2O'), 18.015, 1e-3)
    rengCerca(rengMasaMolarDe('C6H12O6'), 180.156, 1e-3)
    rengCerca(rengMasaMolarDe('H2SO4'), 98.072, 1e-3)
    rengCerca(rengMasaMolarDe('H2SO4'), 98.079, 0.01)
    rengCerca(rengMasaMolarDe('NaCl'), 58.44, 0.01)
    rengCerca(rengMasaMolarDe('CuSO4·5H2O'), 249.68, 0.02)
    rengCerca(rengMasaMolarDe('K4[Fe(CN)6]'), 368.35, 0.02)
  })

  it('la composición centesimal suma 100 %', () => {
    const rengC = rengComposicionCentesimal('C6H12O6')
    rengCerca(rengC.reduce((rengA, rengP) => rengA + rengP.porcentaje, 0), 100, 1e-9)
    rengCerca(rengC.find((rengP) => rengP.simbolo === 'C')!.porcentaje, 40.0, 0.01)
    const rengAgua = rengComposicionCentesimal('H2O')
    rengCerca(rengAgua.find((rengP) => rengP.simbolo === 'O')!.porcentaje, 88.81, 0.01)
  })
})

describe('fórmula empírica y molecular', () => {
  it('glucosa: 40,00 % C, 6,71 % H, 53,29 % O → CH₂O → C₆H₁₂O₆', () => {
    const rengE = rengFormulaEmpirica([
      { simbolo: 'C', porcentaje: 40.0 },
      { simbolo: 'H', porcentaje: 6.71 },
      { simbolo: 'O', porcentaje: 53.29 }
    ])
    expect(rengE.formula).toBe('CH₂O')
    expect(rengFormulaMolecular(rengE.atomos, 180.16).formula).toBe('C₆H₁₂O₆')
  })

  it('óxido de hierro: 69,94 % Fe y 30,06 % O → Fe₂O₃ (necesita multiplicar ×2)', () => {
    const rengE = rengFormulaEmpirica([
      { simbolo: 'Fe', porcentaje: 69.94 },
      { simbolo: 'O', porcentaje: 30.06 }
    ])
    expect(rengE.formula).toBe('Fe₂O₃')
  })

  it('benceno: 92,26 % C, 7,74 % H → CH → C₆H₆ con M = 78,11', () => {
    const rengE = rengFormulaEmpirica([
      { simbolo: 'C', porcentaje: 92.26 },
      { simbolo: 'H', porcentaje: 7.74 }
    ])
    expect(rengE.formula).toBe('CH')
    expect(rengFormulaMolecular(rengE.atomos, 78.11).n).toBe(6)
    expect(() => rengFormulaMolecular(rengE.atomos, 50)).toThrow(/múltiplo/)
  })
})

describe('estados de oxidación', () => {
  const rengOx = (rengF: string, rengEl: string): number | undefined => rengEstadosOxidacion(rengAnalizarFormula(rengF))?.get(rengEl)
  it('aplica las reglas por prioridad', () => {
    expect(rengOx('KMnO4', 'Mn')).toBe(7)
    expect(rengOx('Cr2O7^2-', 'Cr')).toBe(6)
    expect(rengOx('H2O2', 'O')).toBe(-1)
    expect(rengOx('NaH', 'H')).toBe(-1)
    expect(rengOx('OF2', 'O')).toBe(2)
    expect(rengOx('NH4+', 'N')).toBe(-3)
    expect(rengOx('Fe3+', 'Fe')).toBe(3)
    expect(rengOx('O2', 'O')).toBe(0)
    expect(rengOx('ClO3-', 'Cl')).toBe(5)
    expect(rengTextoEstado(rengOx('Fe3O4', 'Fe')!)).toBe('+8/3')
  })
  it('no inventa cuando las reglas no bastan', () => {
    expect(rengEstadosOxidacion(rengAnalizarFormula('K4[Fe(CN)6]'))).toBeNull()
  })
})
