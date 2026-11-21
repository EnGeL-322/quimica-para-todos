import { describe, it, expect } from 'vitest'
import { RENG_ACIDOS, rengConcentracionH, rengCurvaValoracion, rengFracciones, rengHendersonHasselbalch, rengPH, rengPHAcido, rengPHAmortiguador, rengPHBase, rengVolumenEquivalencia } from '../../src/renderer/modules/simulador-quimica/nucleo/acidoBase'
import { rengAumentoTemperaturaAgua, rengCalorLiberado, rengConstanteDeG, RENG_DATOS_TERMO, rengEnergiaLibre, rengEntalpiaReaccion, rengEntropiaReaccion, rengVanTHoff } from '../../src/renderer/modules/simulador-quimica/nucleo/termoquimica'
import { rengArrhenius, rengConcentracion, rengConsecutivaAnalitica, rengConsecutivaNumerica, rengEnergiaActivacion, rengKEnT, rengTiempoMaximoB, rengVidaMedia } from '../../src/renderer/modules/simulador-quimica/nucleo/cinetica'
import { rengCociente, rengGradoDisociacionDimero, rengPerturbar, rengResolverEquilibrio } from '../../src/renderer/modules/simulador-quimica/nucleo/equilibrio'

const rengAcetico = RENG_ACIDOS.find((rengA) => rengA.id === 'acetico')!

describe('ácido-base (balance de carga exacto)', () => {
  it('HCl 0,1 M → pH 1', () => expect(rengPHAcido(0.1, -6.3)).toBeCloseTo(1, 4))
  it('HCl 1e-8 M → pH 6,98 (el agua aporta H⁺: no es 8)', () => {
    const rengH = (1e-8 + Math.sqrt(1e-16 + 4 * 10 ** -13.9965)) / 2
    expect(rengPHAcido(1e-8, -6.3)).toBeCloseTo(-Math.log10(rengH), 3)
    expect(rengPHAcido(1e-8, -6.3)).toBeCloseTo(6.98, 2)
  })
  it('ácido acético 0,1 M coincide con la fórmula cuadrática', () => {
    const RengKa = 10 ** -rengAcetico.pKa
    const rengH = (-RengKa + Math.sqrt(RengKa * RengKa + 4 * RengKa * 0.1)) / 2
    expect(Math.abs(rengConcentracionH(0.1, RengKa) / rengH - 1)).toBeLessThan(1e-4)
    expect(rengPHAcido(0.1, rengAcetico.pKa)).toBeCloseTo(2.88, 2)
  })
  it('amoníaco 0,1 M → pH ≈ 11,12 (Kb = 10^-4,75)', () => expect(rengPHBase(0.1, 9.25)).toBeCloseTo(11.125, 2))
  it('agua pura → pH 7 (a 25 °C pKw/2 = 6,998)', () => expect(rengPH(rengConcentracionH(0, 1e-5))).toBeCloseTo(6.998, 3))
  it('amortiguador 1:1 → pH = pKa y coincide con Henderson–Hasselbalch', () => {
    expect(rengPHAmortiguador(0.1, 0.1, rengAcetico.pKa)).toBeCloseTo(rengAcetico.pKa, 2)
    expect(rengPHAmortiguador(0.2, 0.1, rengAcetico.pKa)).toBeCloseTo(rengHendersonHasselbalch(0.2, 0.1, rengAcetico.pKa), 2)
  })
  it('valoración: pH = pKa en la semiequivalencia, pH básico en la equivalencia y coherencia con pHBase', () => {
    const RengVeq = rengVolumenEquivalencia(0.1, 25, 0.1)
    expect(RengVeq).toBeCloseTo(25, 10)
    const rengCurva = rengCurvaValoracion(0.1, 25, rengAcetico.pKa, 0.1, 50, 100)
    const rengEn = (RENG_V: number): number => rengCurva.reduce((rengM, rengP) => (Math.abs(rengP.V - RENG_V) < Math.abs(rengM.V - RENG_V) ? rengP : rengM)).pH
    expect(rengEn(12.5)).toBeCloseTo(rengAcetico.pKa, 1)
    expect(rengEn(25)).toBeCloseTo(rengPHBase(0.05, rengAcetico.pKa), 3)
    expect(rengEn(25)).toBeGreaterThan(8)
    for (let rengI = 1; rengI < rengCurva.length; rengI++) expect(rengCurva[rengI]!.pH).toBeGreaterThanOrEqual(rengCurva[rengI - 1]!.pH - 1e-9)
    expect(rengCurva[rengCurva.length - 1]!.pH).toBeCloseTo(14 - -Math.log10(0.1 * 25 / 75), 1)
  })
  it('fracciones α suman 1 y valen ½ en pH = pKa', () => {
    const rengA = rengFracciones(rengAcetico.pKa, rengAcetico.pKa)
    expect(rengA.HA).toBeCloseTo(0.5, 12)
    expect(rengA.HA + rengA.A).toBeCloseTo(1, 12)
  })
  it('rechaza datos no físicos', () => {
    expect(() => rengConcentracionH(-1, 1e-5)).toThrow()
    expect(() => rengCurvaValoracion(0, 25, 4.7, 0.1, 50)).toThrow()
  })
  it('todo valor trae fuente', () => {
    for (const rengA of RENG_ACIDOS) expect(rengA.fuente.length, rengA.id).toBeGreaterThan(10)
  })
})

describe('termoquímica', () => {
  const rengMetano = { reactivos: [{ id: 'CH4', nu: 1 }, { id: 'O2', nu: 2 }], productos: [{ id: 'CO2', nu: 1 }, { id: 'H2O_l', nu: 2 }] }
  const rengAgua = { reactivos: [{ id: 'H2', nu: 1 }, { id: 'O2', nu: 0.5 }], productos: [{ id: 'H2O_l', nu: 1 }] }
  it('combustión del metano: ΔH° ≈ −890 kJ/mol (Hess)', () => expect(rengEntalpiaReaccion(rengMetano)).toBeCloseTo(-890.209, 3))
  it('formación del agua líquida: ΔG° ≈ −237 kJ/mol a 298,15 K', () => {
    const rengDS = rengEntropiaReaccion(rengAgua)!
    expect(rengDS).toBeCloseTo(-163.345, 2)
    expect(rengEnergiaLibre(rengEntalpiaReaccion(rengAgua), rengDS, 298.15)).toBeCloseTo(-237.1, 0)
  })
  it('si falta S° de alguna especie no se inventa: devuelve null', () => {
    expect(rengEntropiaReaccion({ reactivos: [{ id: 'HCl', nu: 1 }], productos: [{ id: 'H2', nu: 0.5 }] })).toBeNull()
  })
  it('K = exp(−ΔG/RT): ΔG = 0 → 1; ΔG = −5,708 kJ → ≈ 10 a 298,15 K', () => {
    expect(rengConstanteDeG(0, 300)).toBe(1)
    expect(rengConstanteDeG(-5.7078, 298.15)).toBeCloseTo(10, 2)
  })
  it('van \'t Hoff: reacción exotérmica → K baja al subir T; ΔH = 0 → K no cambia', () => {
    expect(rengVanTHoff(100, 298, 400, -50)).toBeLessThan(100)
    expect(rengVanTHoff(100, 298, 400, 50)).toBeGreaterThan(100)
    expect(rengVanTHoff(100, 298, 400, 0)).toBe(100)
  })
  it('calor: quemar 16,04 g (1 mol) de metano libera 890 kJ y calienta 1 kg de agua ≈ 213 K (sin pérdidas)', () => {
    const rengQ = rengCalorLiberado(rengEntalpiaReaccion(rengMetano), 1, 1)
    expect(rengQ).toBeCloseTo(890.209, 3)
    expect(rengAumentoTemperaturaAgua(rengQ, 1000)).toBeCloseTo(212.8, 0)
  })
  it('cada dato trae fuente y las sustancias elementales valen 0', () => {
    for (const rengD of RENG_DATOS_TERMO) expect(rengD.fuenteH.length, rengD.id).toBeGreaterThan(10)
    for (const rengId of ['O2', 'H2', 'N2']) expect(RENG_DATOS_TERMO.find((rengD) => rengD.id === rengId)!.dHf).toBe(0)
  })
})

describe('cinética', () => {
  it('orden 1: [A] cae a la mitad en t½ = ln2/k, orden 2 en 1/(k·A0), orden 0 en A0/2k', () => {
    for (const rengO of [0, 1, 2] as const) expect(rengConcentracion(rengO, 2, 0.3, rengVidaMedia(rengO, 2, 0.3))).toBeCloseTo(1, 12)
  })
  it('orden 0 no baja de cero', () => expect(rengConcentracion(0, 1, 1, 5)).toBe(0))
  it('Arrhenius: k(T) con Ea=50 kJ/mol casi se duplica al subir de 298 a 308 K (regla empírica ≈ 2)', () => {
    const rengR = rengArrhenius(1e10, 50, 308.15) / rengArrhenius(1e10, 50, 298.15)
    expect(rengR).toBeGreaterThan(1.8)
    expect(rengR).toBeLessThan(2.2)
  })
  it('Ea se recupera de dos medidas de k y kEnT es su inversa', () => {
    const rengK1 = rengArrhenius(3e9, 75, 300)
    const rengK2 = rengArrhenius(3e9, 75, 340)
    expect(rengEnergiaActivacion(rengK1, 300, rengK2, 340)).toBeCloseTo(75, 8)
    expect(rengKEnT(rengK1, 300, 340, 75)).toBeCloseTo(rengK2, 12 - Math.log10(rengK2) | 0)
  })
  it('A→B→C: analítica = RK4 (1e-9), conserva la masa y B es máxima en ln(k1/k2)/(k1−k2)', () => {
    const [RENG_A0, rengK1, rengK2] = [1, 0.8, 0.2]
    for (const rengT of [0.5, 2, 10]) {
      const rengA = rengConsecutivaAnalitica(RENG_A0, rengK1, rengK2, rengT)
      const rengN = rengConsecutivaNumerica(RENG_A0, rengK1, rengK2, rengT)
      expect(Math.abs(rengA.A - rengN.A)).toBeLessThan(1e-9)
      expect(Math.abs(rengA.B - rengN.B)).toBeLessThan(1e-9)
      expect(rengA.A + rengA.B + rengA.C).toBeCloseTo(RENG_A0, 12)
    }
    const rengTm = rengTiempoMaximoB(rengK1, rengK2)
    const RENG_B = (rengT: number): number => rengConsecutivaAnalitica(RENG_A0, rengK1, rengK2, rengT).B
    expect(RENG_B(rengTm)).toBeGreaterThan(RENG_B(rengTm * 0.9))
    expect(RENG_B(rengTm)).toBeGreaterThan(RENG_B(rengTm * 1.1))
  })
  it('k1 = k2 usa el límite continuo', () => {
    const rengA = rengConsecutivaAnalitica(1, 0.5, 0.5, 2)
    expect(rengA.B).toBeCloseTo(rengConsecutivaNumerica(1, 0.5, 0.5, 2).B, 9)
  })
})

describe('equilibrio químico', () => {
  it('H₂ + I₂ ⇌ 2 HI con K = 50 desde 1 M: ξ = √50/(2+√50)', () => {
    const rengEsp = [{ nombre: 'H₂', nu: -1, c0: 1 }, { nombre: 'I₂', nu: -1, c0: 1 }, { nombre: 'HI', nu: 2, c0: 0 }]
    const rengR = rengResolverEquilibrio(rengEsp, 50)
    const rengS = Math.sqrt(50)
    expect(rengR.xi).toBeCloseTo(rengS / (2 + rengS), 10)
    expect(rengCociente(rengEsp, rengR.c)).toBeCloseTo(50, 8)
    expect(rengR.sentido).toBe(1)
  })
  it('N₂O₄ ⇌ 2 NO₂: coincide con la fórmula del grado de disociación', () => {
    const [rengC0, RENG_K] = [0.1, 0.15]
    const rengR = rengResolverEquilibrio([{ nombre: 'N₂O₄', nu: -1, c0: rengC0 }, { nombre: 'NO₂', nu: 2, c0: 0 }], RENG_K)
    expect(rengR.xi / rengC0).toBeCloseTo(rengGradoDisociacionDimero(rengC0, RENG_K), 10)
  })
  it('parte desde los productos: el sentido es hacia los reactivos y llega al mismo equilibrio', () => {
    const rengA = rengResolverEquilibrio([{ nombre: 'A', nu: -1, c0: 1 }, { nombre: 'B', nu: 1, c0: 0 }], 4)
    const rengB = rengResolverEquilibrio([{ nombre: 'A', nu: -1, c0: 0 }, { nombre: 'B', nu: 1, c0: 1 }], 4)
    expect(rengA.c[1]).toBeCloseTo(rengB.c[1]!, 10)
    expect(rengA.c[1]).toBeCloseTo(0.8, 10)
    expect(rengB.sentido).toBe(-1)
  })
  it('Le Chatelier: añadir reactivo desplaza hacia productos; añadir producto, hacia reactivos', () => {
    const rengEsp = [{ nombre: 'H₂', nu: -1, c0: 1 }, { nombre: 'I₂', nu: -1, c0: 1 }, { nombre: 'HI', nu: 2, c0: 0 }]
    const rengP1 = rengPerturbar(rengEsp, 50, 0, 0.5)
    expect(rengP1.despues.c[2]).toBeGreaterThan(rengP1.antes.c[2]!)
    const rengP2 = rengPerturbar(rengEsp, 50, 2, 0.5)
    expect(rengP2.despues.c[2]! - 0.5).toBeLessThan(rengP2.antes.c[2]!)
    expect(rengP2.despues.c[0]).toBeGreaterThan(rengP2.antes.c[0]!)
  })
  it('rechaza K ≤ 0 y datos sin reactivos o productos', () => {
    expect(() => rengResolverEquilibrio([{ nombre: 'A', nu: -1, c0: 1 }, { nombre: 'B', nu: 1, c0: 0 }], 0)).toThrow()
    expect(() => rengResolverEquilibrio([{ nombre: 'A', nu: -1, c0: 1 }], 1)).toThrow()
  })
})
