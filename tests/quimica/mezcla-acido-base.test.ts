import { describe, expect, it } from 'vitest'
import {
  rengCurvaMezclaAcidoBase,
  rengResolverMezclaAcidoBase,
  type RengEntradaMezclaAcidoBase,
  type RengResultadoMezclaAcidoBase
} from '../../src/renderer/modules/simulador-quimica/nucleo/mezclaAcidoBase'

const rengHcl: RengEntradaMezclaAcidoBase = {
  acido: 'hcl', concentracionAcido: 0.01, volumenAcidoMl: 25, concentracionBase: 0.01, volumenBaseMl: 0
}
const rengAcetico: RengEntradaMezclaAcidoBase = { ...rengHcl, acido: 'acetico' }
const rengConcentracion = (rengR: RengResultadoMezclaAcidoBase, rengFormula: string): number => rengR.especies.find((rengE) => rengE.formula === rengFormula)!.concentracion

describe('mezcla acuosa a 25 °C', () => {
  it('HCl antes, en y después de la equivalencia', () => {
    const rengAntes = rengResolverMezclaAcidoBase({ ...rengHcl, volumenBaseMl: 10 })
    const rengEquivalente = rengResolverMezclaAcidoBase({ ...rengHcl, volumenBaseMl: 25 })
    const rengDespues = rengResolverMezclaAcidoBase({ ...rengHcl, volumenBaseMl: 50 })
    expect(rengAntes.pH).toBeCloseTo(-Math.log10(0.01 * 15 / 35), 6)
    expect(rengEquivalente.volumenEquivalenciaMl).toBe(25)
    expect(rengEquivalente.pH).toBeCloseTo(6.995, 12)
    expect(rengDespues.pH).toBeCloseTo(13.99 + Math.log10(0.01 * 25 / 75), 6)
    expect(rengConcentracion(rengEquivalente, 'Na⁺')).toBeCloseTo(0.005, 12)
    expect(rengConcentracion(rengEquivalente, 'Cl⁻')).toBeCloseTo(0.005, 12)
  })

  it('ácido acético sin base, en semiequivalencia y en equivalencia', () => {
    const rengInicial = rengResolverMezclaAcidoBase(rengAcetico)
    const rengMitad = rengResolverMezclaAcidoBase({ ...rengAcetico, volumenBaseMl: 12.5 })
    const rengEquivalente = rengResolverMezclaAcidoBase({ ...rengAcetico, volumenBaseMl: 25 })
    const rengKa = 1.754e-5
    const rengH = (Math.sqrt(rengKa * rengKa + 4 * rengKa * 0.01) - rengKa) / 2
    expect(rengInicial.pH).toBeCloseTo(-Math.log10(rengH), 7)
    expect(rengMitad.pH).toBeCloseTo(-Math.log10(rengKa), 2)
    const rengOh = Math.sqrt((10 ** -13.99 / rengKa) * 0.005)
    expect(rengEquivalente.pH).toBeCloseTo(13.99 + Math.log10(rengOh), 2)
    expect(rengEquivalente.pH).toBeGreaterThan(7)
  })

  it('conserva materia y carga al diluir con volúmenes y concentraciones distintos', () => {
    const rengR = rengResolverMezclaAcidoBase({ ...rengAcetico, concentracionAcido: 0.008, volumenAcidoMl: 35, concentracionBase: 0.004, volumenBaseMl: 23 })
    expect(rengR.volumenTotalMl).toBe(58)
    expect(rengR.molesAcido).toBeCloseTo(0.00028, 12)
    expect(rengR.molesBase).toBeCloseTo(0.000092, 12)
    const rengSumaAcido = rengConcentracion(rengR, 'CH₃COOH') + rengConcentracion(rengR, 'CH₃COO⁻')
    expect(rengSumaAcido * 0.058).toBeCloseTo(0.00028, 12)
    expect(rengConcentracion(rengR, 'Na⁺') * 0.058).toBeCloseTo(0.000092, 12)
    const rengH = rengConcentracion(rengR, 'H₃O⁺')
    expect(rengH * rengConcentracion(rengR, 'OH⁻') / 10 ** -13.99).toBeCloseTo(1, 12)
    expect(rengH * rengConcentracion(rengR, 'CH₃COO⁻') / (rengConcentracion(rengR, 'CH₃COOH') * 1.754e-5)).toBeCloseTo(1, 12)
    const rengSumaCarga = rengR.especies.reduce((rengSuma, rengE) => rengSuma + rengE.carga * rengE.concentracion, 0)
    expect(Math.abs(rengSumaCarga)).toBeLessThan(1e-13)
    expect(Math.abs(rengR.residuoCarga)).toBeLessThan(1e-13)
    expect(Math.abs(rengR.residuoAcido)).toBeLessThan(1e-13)
    expect(rengR.especies.every((rengE) => rengE.concentracion >= 0 && Number.isFinite(rengE.concentracion))).toBe(true)
  })

  it('cero volumen de base y base de concentración cero tienen significados distintos', () => {
    const rengSinBase = rengResolverMezclaAcidoBase(rengHcl)
    const rengDiluida = rengResolverMezclaAcidoBase({ ...rengHcl, concentracionBase: 0, volumenBaseMl: 25 })
    expect(rengSinBase.pH).toBeCloseTo(2, 6)
    expect(rengDiluida.pH).toBeCloseTo(-Math.log10(0.005), 6)
    expect(rengDiluida.volumenEquivalenciaMl).toBeNull()
    expect(rengConcentracion(rengDiluida, 'Na⁺')).toBe(0)
    for (const rengEntrada of [rengHcl, rengAcetico]) {
      const rengAgua = rengResolverMezclaAcidoBase({ ...rengEntrada, concentracionAcido: 0, concentracionBase: 0, volumenBaseMl: 10 })
      expect(rengAgua.pH).toBeCloseTo(6.995, 12)
      expect(rengConcentracion(rengAgua, 'H₃O⁺')).toBeCloseTo(rengConcentracion(rengAgua, 'OH⁻'), 14)
    }
  })

  it('rechaza concentraciones fuera del dominio diluido y volúmenes inválidos', () => {
    expect(() => rengResolverMezclaAcidoBase({ ...rengHcl, concentracionAcido: 0.0101 })).toThrow(/mezcla diluida/)
    expect(() => rengResolverMezclaAcidoBase({ ...rengHcl, concentracionBase: NaN })).toThrow(/concentraciones/)
    expect(() => rengResolverMezclaAcidoBase({ ...rengHcl, volumenAcidoMl: 0 })).toThrow(/volúmenes|disolución ácida/)
    expect(() => rengResolverMezclaAcidoBase({ ...rengHcl, volumenBaseMl: -1 })).toThrow(/disolución básica/)
    expect(() => rengResolverMezclaAcidoBase({ ...rengHcl, volumenBaseMl: Infinity })).toThrow(/disolución básica/)
  })

  it('la curva incluye el punto actual y la equivalencia aunque no caigan en el muestreo regular', () => {
    const rengEntrada = { ...rengAcetico, volumenAcidoMl: 24.7, volumenBaseMl: 13.37 }
    const rengResultado = rengResolverMezclaAcidoBase(rengEntrada)
    const rengCurva = rengCurvaMezclaAcidoBase(rengEntrada)
    expect(rengCurva[0]?.volumenBaseMl).toBe(0)
    expect(rengCurva).toContainEqual({ volumenBaseMl: rengEntrada.volumenBaseMl, pH: rengResultado.pH })
    expect(rengCurva.some((rengPunto) => rengPunto.volumenBaseMl === rengResultado.volumenEquivalenciaMl)).toBe(true)
    expect(rengCurva.at(-1)!.volumenBaseMl).toBeGreaterThan(rengEntrada.volumenBaseMl)
    expect(rengCurva.every((rengPunto, rengI) => rengI === 0 || rengPunto.pH >= rengCurva[rengI - 1]!.pH)).toBe(true)
  })
})
