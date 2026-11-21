import { describe, expect, it } from 'vitest'
import { RENG_ELEMENTOS } from '../../src/renderer/modules/simulador-quimica/chemistry'
import { rengAjustarEcuacion } from '../../src/renderer/modules/simulador-quimica/nucleo/ajuste'
import { RENG_DATOS_3D, RENG_FUENTES_3D, rengDatos3D } from '../../src/renderer/modules/simulador-quimica/nucleo/elementos3d'
import {
  rengAKelvin,
  rengDilucion,
  rengFraccionesMolares,
  rengGasIdeal,
  rengMasaPura,
  rengMolalidadDesdeMolaridad,
  rengMolaridad,
  rengMolaridadDesdePorcentaje,
  rengMolesDesdeMasa,
  rengPpm,
  RENG_R,
  RENG_R_LATM,
  rengReactivoLimitante,
  rengRendimientoPorcentual,
  RENG_VM_CN,
  RENG_VM_STP_IUPAC
} from '../../src/renderer/modules/simulador-quimica/nucleo/estequiometria'
import { RENG_ELEMENTOS as RENG_TABLA } from '../../src/renderer/modules/tabla-periodica/data'

const rengCerca = (rengA: number, rengB: number, rengTol: number): void => expect(Math.abs(rengA - rengB)).toBeLessThanOrEqual(rengTol)

describe('constantes CODATA 2018', () => {
  it('R y volúmenes molares', () => {
    rengCerca(RENG_R, 8.314462618, 1e-9)
    rengCerca(RENG_R_LATM, 0.082057366, 1e-9)
    rengCerca((RENG_R * 273.15) / 101325 * 1000, RENG_VM_CN, 1e-6)
    rengCerca((RENG_R * 273.15) / 100000 * 1000, RENG_VM_STP_IUPAC, 1e-6)
  })
})

describe('reactivo limitante', () => {
  it('2H₂ + O₂: 4 g de H₂ y 16 g de O₂ → limita el O₂, salen 18,015 g de agua', () => {
    const rengA = rengAjustarEcuacion('H2 + O2 -> H2O')
    const rengR = rengReactivoLimitante(rengA, [
      { indice: 0, moles: rengMolesDesdeMasa(4, 'H2') },
      { indice: 1, moles: rengMolesDesdeMasa(16, 'O2') }
    ])
    expect(rengR.limitante).toBe(1)
    rengCerca(rengR.productos[0]!.masa, 18.015, 0.01)
    rengCerca(rengR.reactivos[0]!.masaSobrante, 4 - 1.008 * 2, 0.01)
  })

  it('Zn + 2HCl: 0,10 mol de Zn y 0,10 mol de HCl → limita el HCl', () => {
    const rengR = rengReactivoLimitante(rengAjustarEcuacion('Zn + HCl -> ZnCl2 + H2'), [
      { indice: 0, moles: 0.1 },
      { indice: 1, moles: 0.1 }
    ])
    expect(rengR.limitante).toBe(1)
    rengCerca(rengR.productos[1]!.moles, 0.05, 1e-12)
    rengCerca(rengR.reactivos[0]!.sobrante, 0.05, 1e-12)
  })

  it('rendimiento y pureza', () => {
    rengCerca(rengRendimientoPorcentual(15, 20), 75, 1e-12)
    rengCerca(rengMasaPura(50, 80), 40, 1e-12)
    expect(() => rengMasaPura(10, 120)).toThrow()
  })
})

describe('gases ideales', () => {
  it('1 mol a 273,15 K y 1 atm ocupa 22,414 L', () => {
    rengCerca(rengGasIdeal({ P: 101325, n: 1, T: 273.15 }).V, 22.414, 1e-3)
  })
  it('despeja cualquier variable de forma coherente', () => {
    const rengBase = { P: 2 * 101325, V: 5, T: rengAKelvin(25, 'C') }
    const rengN = rengGasIdeal(rengBase).n
    rengCerca(rengN, (2 * 5) / (0.082057366 * 298.15), 1e-6)
    rengCerca(rengGasIdeal({ V: 5, n: rengN, T: 298.15 }).P, 2 * 101325, 1e-6)
    expect(() => rengGasIdeal({ P: 1 })).toThrow(/exactamente una/)
    expect(() => rengAKelvin(-300, 'C')).toThrow()
  })
})

describe('disoluciones', () => {
  it('molaridad, %m/m→M y M→m', () => {
    rengCerca(rengMolaridad(0.5, 0.25), 2, 1e-12)
    rengCerca(rengMolaridadDesdePorcentaje(37, 1.19, 36.46), 12.08, 0.01)
    const RENG_M = rengMolaridadDesdePorcentaje(37, 1.19, 36.46)
    rengCerca(rengMolalidadDesdeMolaridad(RENG_M, 1.19, 36.46), 37 / 36.46 / 0.063, 1e-9)
  })
  it('dilución C₁V₁ = C₂V₂', () => {
    rengCerca(rengDilucion({ C1: 12, C2: 1, V2: 0.5 }).V1, 0.5 / 12, 1e-12)
    expect(() => rengDilucion({ C1: 1, V1: 1, C2: 2 })).toThrow(/aumentar/)
  })
  it('ppm y fracción molar', () => {
    rengCerca(rengPpm(0.002, 1000), 2, 1e-12)
    const rengX = rengFraccionesMolares([1, 3])
    rengCerca(rengX[0]!, 0.25, 1e-12)
  })
})

describe('elementos 3D (118)', () => {
  it('cubre los 118 elementos de la tabla en el mismo orden', () => {
    expect(RENG_DATOS_3D).toHaveLength(118)
    RENG_DATOS_3D.forEach((rengD, rengI) => expect(rengD.simbolo).toBe(RENG_TABLA[rengI]!.simbolo))
    expect(Object.keys(RENG_ELEMENTOS)).toHaveLength(118)
  })
  it('valores de control contra las fuentes', () => {
    expect(rengDatos3D.get('C')!.rc).toBe(0.76)
    expect(rengDatos3D.get('Au')!.rc).toBe(1.36)
    expect(rengDatos3D.get('Cm')!.rc).toBe(1.69)
    expect(rengDatos3D.get('Bk')!.rc).toBeNull()
    expect(rengDatos3D.get('C')!.rv).toBe(1.7)
    expect(rengDatos3D.get('Cs')!.fuenteRv).toBe('Mantina 2009')
    expect(rengDatos3D.get('O')!.color).toBe(0xff0d0d)
    expect(rengDatos3D.get('Ds')!.colorGenerico).toBe(true)
  })
  it('todo radio presente tiene fuente', () => {
    for (const rengD of RENG_DATOS_3D) if (rengD.rv !== null) expect(rengD.fuenteRv).not.toBeNull()
    for (const rengF of Object.values(RENG_FUENTES_3D)) expect(rengF.length).toBeGreaterThan(10)
  })
  it('el dibujo marca como aproximado lo que no tiene dato', () => {
    expect(RENG_ELEMENTOS.Fe!.aproximado).toBe(true)
    expect(RENG_ELEMENTOS.C!.aproximado).toBe(false)
  })
})
