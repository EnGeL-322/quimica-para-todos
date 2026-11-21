import { describe, expect, it } from 'vitest'
import { RENG_CODIGOS_SALES, RENG_FUENTES_KSP, RENG_SALES_DESCARTADAS, RENG_SALES_SOLUBILIDAD, rengConstruirSal, rengLeerPKspFila, rengLeerValorFila, rengSalRegistrada, rengValidarFuenteKsp, type RengDefinicionSal, type RengFuenteKsp } from '../../src/renderer/modules/simulador-quimica/datos/solubilidad'
import { rengAnalizarSolubilidad, rengCompararQKsp, rengPrecipitado, rengSolubilidadAguaPura, rengSolubilidadConIones, rengValidarEstequiometria, type RengParametrosSolubilidad } from '../../src/renderer/modules/simulador-quimica/nucleo/solubilidad'

const TOL_REL_MANO = 1e-3
const TOL_REL_FORMULA = 1e-12
const rengRel = (rengA: number, rengB: number): number => Math.abs(rengA - rengB) / Math.abs(rengB)

const rengPar = (rengId: string, rengCM: number, rengCA: number, rengSolido = 0): RengParametrosSolubilidad => {
  const rengS = rengSalRegistrada(rengId)
  return { ksp: rengS.ksp, nuM: rengS.cation.nu, nuA: rengS.anion.nu, zM: rengS.cation.carga, zA: rengS.anion.carga, cM: rengCM, cA: rengCA, solido: rengSolido, nombreM: rengS.cation.formula, nombreA: rengS.anion.formula }
}

describe('D4.2 · registro de sales: solo entra lo respaldado por una fuente abierta', () => {
  it('el conjunto es exactamente CaF₂, Mg(OH)₂ y CaCO₃ (calcita), cada uno con la fila literal de la fuente', () => {
    expect(RENG_SALES_SOLUBILIDAD.map((rengS) => rengS.id)).toEqual(['caf2', 'mgoh2', 'caco3'])
    expect([...RENG_CODIGOS_SALES]).toEqual(RENG_SALES_SOLUBILIDAD.map((rengS) => rengS.id))
    expect(rengSalRegistrada('caf2').ksp).toBe(3.9e-11)
    expect(rengSalRegistrada('mgoh2').ksp).toBe(7.1e-12)
    expect(rengSalRegistrada('caco3').ksp).toBe(4.5e-9)
    expect(rengSalRegistrada('caco3').solido).toMatch(/calcita/)
  })

  it('el Ksp se lee de la fila literal y concuerda con el pKsp de la misma fila (−log₁₀ Ksp, redondeo de 2 decimales)', () => {
    for (const rengS of RENG_SALES_SOLUBILIDAD) {
      expect(rengS.ksp, rengS.id).toBe(rengLeerValorFila(rengS.registro.filaLiteral))
      expect(rengS.pKspFuente, rengS.id).not.toBeNull()
      expect(Math.abs(rengS.pKspFuente! + Math.log10(rengS.ksp)), rengS.id).toBeLessThan(0.006)
    }
    expect([rengSalRegistrada('caf2').pKspFuente, rengSalRegistrada('mgoh2').pKspFuente, rengSalRegistrada('caco3').pKspFuente]).toEqual([10.41, 11.15, 8.35])
  })

  it('cada sal declara su fuente con enlace, fecha, alcance de la lectura, temperatura, fuerza iónica, origen y licencia', () => {
    for (const rengS of RENG_SALES_SOLUBILIDAD) {
      expect(rengS.fuente.id).toBe('harvey-16-10')
      expect(rengS.fuente.url).toMatch(/^https:\/\/chem\.libretexts\.org\//)
      expect(rengS.fuente.consultada).toBe('2026-11-15')
      expect(rengS.fuente.temperaturaC).toBe(25)
      expect(rengS.fuente.fuerzaIonica).toMatch(/cero/)
      expect(rengS.fuente.lectura).toBe('filas-literales')
      expect(rengS.fuente.alcanceLectura).toMatch(/No leí la página entera/)
      expect(rengS.fuente.origenDato).toMatch(/Martell/)
      expect(rengS.fuente.licencia).toMatch(/CC BY-NC-SA 4\.0/)
      expect(rengS.fuente.condicionReutilizacion).toMatch(/uso no comercial/)
      expect(rengS.fuente.disolvente).toMatch(/no declarado/)
    }
  })

  it('las otras fuentes abiertas discrepan y se registran sin usarse: una sola fuente por sal', () => {
    const rengCaco3 = rengSalRegistrada('caco3')
    expect(rengCaco3.otrasConValor.map((rengO) => [rengO.fuente.id, rengO.ksp])).toEqual([['libretexts-e3', 3.36e-9], ['openstax-lumen-10-10', 8.7e-9]])
    const rengTodos = [rengCaco3.ksp, ...rengCaco3.otrasConValor.map((rengO) => rengO.ksp)]
    expect(Math.max(...rengTodos) / Math.min(...rengTodos)).toBeCloseTo(8.7 / 3.36, 10)
    expect(rengSalRegistrada('caf2').otrasConValor.map((rengO) => rengO.ksp)).toEqual([3.45e-11, 4e-11])
    expect(rengSalRegistrada('mgoh2').otrasConValor.map((rengO) => rengO.ksp)).toEqual([5.61e-12, 8.9e-12])
    for (const rengS of RENG_SALES_SOLUBILIDAD) for (const rengO of rengS.otrasConValor) expect(rengO.ksp, `${rengS.id} ${rengO.fuente.id}`).not.toBe(rengS.ksp)
    expect(RENG_FUENTES_KSP.filter((rengF) => rengF.id !== 'harvey-16-10').every((rengF) => /no se usa ningún valor/.test(rengF.condicionReutilizacion))).toBe(true)
  })

  it('el CaSO₄ queda fuera con su motivo; no se puede cargar', () => {
    expect(RENG_SALES_DESCARTADAS.some((rengD) => rengD.formula === 'CaSO₄' && /valores distintos/.test(rengD.motivo))).toBe(true)
    expect(() => rengSalRegistrada('caso4')).toThrow(/no tiene fuente de Ksp registrada/)
  })

  it('una sal sin fuente registrada NO puede cargarse (por id, sin registro, con fuente inexistente o con fuente incompleta)', () => {
    for (const rengId of ['baso4', 'agcl', 'pbso4', 'caso4', 'ca3po42', '', 'CAF2']) expect(() => rengSalRegistrada(rengId), rengId).toThrow(/sin fuente|no tiene fuente de Ksp registrada/)
    const rengBase = RENG_SALES_SOLUBILIDAD[0]!
    const rengDef = (rengX: Partial<RengDefinicionSal>): RengDefinicionSal => ({ id: rengBase.id, nombre: rengBase.nombre, formula: rengBase.formula, solido: rengBase.solido, cation: rengBase.cation, anion: rengBase.anion, registro: rengBase.registro, otrasFuentes: [], hidrolisis: 'aviso', notaModelo: 'x', ...rengX })
    expect(() => rengConstruirSal(rengDef({}))).not.toThrow()
    expect(() => rengConstruirSal(rengDef({ registro: undefined as never }))).toThrow(/no tiene fuente de Ksp registrada/)
    expect(() => rengConstruirSal(rengDef({ registro: { fuenteId: '', filaLiteral: '', nota: '' } }))).toThrow(/no tiene fuente de Ksp registrada/)
    expect(() => rengConstruirSal(rengDef({ registro: { ...rengBase.registro, fuenteId: 'inventada' } }))).toThrow(/no está registrada/)
    for (const rengCampo of ['titulo', 'url', 'alcanceLectura', 'origenDato', 'fuerzaIonica', 'licencia', 'condicionReutilizacion', 'consultada'] as const) {
      const rengFuentes: RengFuenteKsp[] = [{ ...RENG_FUENTES_KSP[0]!, [rengCampo]: '' }]
      expect(() => rengConstruirSal(rengDef({}), rengFuentes), rengCampo).toThrow(/no puede respaldar|no tiene/)
    }
    expect(() => rengValidarFuenteKsp({ ...RENG_FUENTES_KSP[0]!, url: 'http://sin-cifrado.example' })).toThrow(/https/)
    expect(() => rengValidarFuenteKsp({ ...RENG_FUENTES_KSP[0]!, consultada: 'ayer' })).toThrow(/fecha/)
    expect(() => rengValidarFuenteKsp({ ...RENG_FUENTES_KSP[0]!, temperaturaC: Number.NaN })).toThrow(/temperatura/)
  })

  it('un valor no respaldado por su fila (pKsp inconsistente, fila ilegible, iones no neutros) tampoco carga', () => {
    const rengBase = RENG_SALES_SOLUBILIDAD[0]!
    const rengDef = (rengX: Partial<RengDefinicionSal>): RengDefinicionSal => ({ id: 'x', nombre: 'x', formula: 'x', solido: 'x', cation: rengBase.cation, anion: rengBase.anion, registro: rengBase.registro, otrasFuentes: [], hidrolisis: 'aviso', notaModelo: 'x', ...rengX })
    expect(() => rengConstruirSal(rengDef({ registro: { ...rengBase.registro, filaLiteral: '| \\(\\mathrm{CaF2}\\) | 9.00 | \\(3.9 \\times 10^{-11}\\) |' } }))).toThrow(/no concuerda con el pKsp/)
    expect(() => rengConstruirSal(rengDef({ registro: { ...rengBase.registro, filaLiteral: 'CaF2 sin valor' } }))).toThrow(/No se pudo leer/)
    expect(() => rengConstruirSal(rengDef({ anion: { formula: 'F⁻', carga: -1, nu: 1 } }))).toThrow(/no es neutra/)
    expect(() => rengConstruirSal(rengDef({ cation: { formula: 'Ca', carga: 0, nu: 1 } }))).toThrow(/ion mal definido/)
  })

  it('lectura de las tres formas de fila que aparecieron en las fuentes', () => {
    expect(rengLeerValorFila('| \\(\\mathrm{CaF2}\\) | 10.41 | \\(3.9 \\times 10^{-11}\\) |')).toBe(3.9e-11)
    expect(rengLeerValorFila('Calcium fluoride | CaF2 | 3.45 × 10−11')).toBe(3.45e-11)
    expect(rengLeerValorFila('CaF2 | 4.0 \\times {10}^{-11}')).toBe(4e-11)
    expect(rengLeerPKspFila('| \\(\\mathrm{CaCO3}\\) (calcite) | 8.35 | \\(4.5 \\times 10^{-9}\\) |')).toBe(8.35)
    expect(rengLeerPKspFila('CaF2 | 4.0 \\times {10}^{-11}')).toBeNull()
  })
})

describe('D4.2 · solubilidad molar en agua pura (√Ksp y su generalización) contra cifras hechas a mano', () => {
  it('CaCO₃ (1:1): s = √(4,5·10⁻⁹) = 6,7082·10⁻⁵ mol/L', () => {
    const rengS = rengSolubilidadAguaPura(4.5e-9, 1, 1)
    expect(rengS).toBeCloseTo(6.7082e-5, 9)
    expect(rengRel(rengS, 6.7082e-5)).toBeLessThan(TOL_REL_MANO)
    expect(rengRel(rengS, Math.sqrt(4.5e-9))).toBeLessThan(TOL_REL_FORMULA)
  })

  it('Mg(OH)₂ (1:2): Ksp = 4s³ → s = (7,1·10⁻¹²/4)^(1/3) = 1,2108·10⁻⁴ mol/L', () => {
    const rengS = rengSolubilidadAguaPura(7.1e-12, 1, 2)
    expect(rengRel(rengS, 1.2108e-4)).toBeLessThan(TOL_REL_MANO)
    expect(rengRel(4 * rengS ** 3, 7.1e-12)).toBeLessThan(TOL_REL_FORMULA)
  })

  it('CaF₂ (1:2): s = (3,9·10⁻¹¹/4)^(1/3) = 2,1364·10⁻⁴ mol/L; [F⁻] = 2s', () => {
    const rengS = rengSolubilidadAguaPura(3.9e-11, 1, 2)
    expect(rengRel(rengS, 2.1364e-4)).toBeLessThan(TOL_REL_MANO)
    expect(rengRel(rengS * (2 * rengS) ** 2, 3.9e-11)).toBeLessThan(TOL_REL_FORMULA)
  })

  it('2:1 (M₂A) es la simétrica de 1:2: mismo s con el Ksp igual', () => {
    expect(rengSolubilidadAguaPura(3.9e-11, 2, 1)).toBeCloseTo(rengSolubilidadAguaPura(3.9e-11, 1, 2), 18)
  })

  it('estequiometrías no soportadas y Ksp no válido: error explicado', () => {
    expect(() => rengSolubilidadAguaPura(1e-25, 3, 2)).toThrow(/Estequiometría 3:2 no soportada/)
    expect(() => rengValidarEstequiometria(2, 2)).toThrow(/no soportada/)
    expect(() => rengValidarEstequiometria(1.5, 1)).toThrow(RangeError)
    expect(() => rengValidarEstequiometria(1, 3)).toThrow(/solo resuelve sales 1:1, 1:2 y 2:1/)
    for (const rengK of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) expect(() => rengSolubilidadAguaPura(rengK, 1, 1), String(rengK)).toThrow(/finito y positivo/)
  })
})

describe('D4.2 · efecto de ion común: la cuadrática (1:1) y los casos 1:2 contra cifras hechas a mano', () => {
  it('CaCO₃ con 1,0·10⁻³ mol/L de Ca²⁺: s² + 1,0·10⁻³ s − 4,5·10⁻⁹ = 0 → s = 4,4802·10⁻⁶ mol/L', () => {
    const rengS = rengSolubilidadConIones(4.5e-9, 1, 1, 1e-3, 0)
    expect(rengRel(rengS, 4.4802e-6)).toBeLessThan(TOL_REL_MANO)
    const rengCuadratica = (-1e-3 + Math.sqrt(1e-6 + 4 * 4.5e-9)) / 2
    expect(rengRel(rengS, rengCuadratica)).toBeLessThan(1e-9)
    expect(rengRel(rengS, 4.5e-9 / 1e-3)).toBeLessThan(0.01)
  })

  it('la cuadrática con los dos iones presentes: (a + s)(b + s) = Ksp', () => {
    const rengA = 2e-5
    const rengB = 1e-5
    const rengS = rengSolubilidadConIones(4.5e-9, 1, 1, rengA, rengB)
    const rengFormula = (-(rengA + rengB) + Math.sqrt((rengA + rengB) ** 2 - 4 * (rengA * rengB - 4.5e-9))) / 2
    expect(rengRel(rengS, rengFormula)).toBeLessThan(1e-9)
    expect(rengRel((rengA + rengS) * (rengB + rengS), 4.5e-9)).toBeLessThan(1e-9)
  })

  it('CaF₂ con 0,010 mol/L de F⁻: s(2s + 0,010)² = 3,9·10⁻¹¹ → s = 3,899·10⁻⁷ mol/L (≈ Ksp/[F⁻]²)', () => {
    const rengS = rengSolubilidadConIones(3.9e-11, 1, 2, 0, 0.01)
    expect(rengRel(rengS, 3.899e-7)).toBeLessThan(TOL_REL_MANO)
    expect(rengRel(rengS * (0.01 + 2 * rengS) ** 2, 3.9e-11)).toBeLessThan(1e-9)
    expect(rengRel(rengS, 3.9e-11 / 1e-4)).toBeLessThan(0.01)
    expect(rengS / rengSolubilidadAguaPura(3.9e-11, 1, 2)).toBeCloseTo(1.825e-3, 5)
  })

  it('Mg(OH)₂ con 1,0·10⁻³ mol/L de Mg²⁺: (c + s)(2s)² = Ksp', () => {
    const rengS = rengSolubilidadConIones(7.1e-12, 1, 2, 1e-3, 0)
    expect(rengRel((1e-3 + rengS) * (2 * rengS) ** 2, 7.1e-12)).toBeLessThan(1e-9)
    expect(rengS).toBeLessThan(rengSolubilidadAguaPura(7.1e-12, 1, 2))
  })

  it('el ion común siempre baja la solubilidad y es monótono (barrido de 60 concentraciones, 3 sales, los 2 iones)', () => {
    for (const rengSal of RENG_SALES_SOLUBILIDAD) {
      const rengS0 = rengSolubilidadAguaPura(rengSal.ksp, rengSal.cation.nu, rengSal.anion.nu)
      for (const [rengCatión, rengAnión] of [[true, false], [false, true]] as const) {
        let rengPrevio = rengS0
        for (let rengI = 0; rengI <= 60; rengI++) {
          const rengC = rengI === 0 ? 0 : 10 ** (-7 + (rengI * 7) / 60)
          const rengS = rengSolubilidadConIones(rengSal.ksp, rengSal.cation.nu, rengSal.anion.nu, rengCatión ? rengC : 0, rengAnión ? rengC : 0)
          expect(rengS, `${rengSal.id} c=${rengC}`).toBeLessThanOrEqual(rengPrevio * (1 + 1e-12))
          expect(rengS).toBeLessThanOrEqual(rengS0 * (1 + 1e-12))
          if (rengS > 0) expect(rengRel(rengSolubilidadAguaPura(rengSal.ksp, rengSal.cation.nu, rengSal.anion.nu) > 0 ? (rengC + (rengCatión ? rengSal.cation.nu : rengSal.anion.nu) * rengS) ** (rengCatión ? rengSal.cation.nu : rengSal.anion.nu) * (rengS * (rengCatión ? rengSal.anion.nu : rengSal.cation.nu)) ** (rengCatión ? rengSal.anion.nu : rengSal.cation.nu) : 0, rengSal.ksp), `${rengSal.id} residuo`).toBeLessThan(1e-9)
          rengPrevio = rengS
        }
      }
    }
  })

  it('con Q ≥ Ksp la capacidad de disolver más es 0', () => {
    expect(rengSolubilidadConIones(4.5e-9, 1, 1, 1e-4, 1e-4)).toBe(0)
    expect(rengSolubilidadConIones(4.5e-9, 1, 1, Math.sqrt(4.5e-9), Math.sqrt(4.5e-9))).toBe(0)
    expect(() => rengSolubilidadConIones(4.5e-9, 1, 1, -1, 0)).toThrow(/≥ 0/)
  })
})

describe('D4.2 · Q frente a Ksp: disuelve, equilibrio o precipita', () => {
  it('tolerancia explícita compartida con el equilibrio (|ln(Q/Ksp)| < 1e-9)', () => {
    expect(rengCompararQKsp(4.5e-9, 4.5e-9)).toBe('equilibrio')
    expect(rengCompararQKsp(4.5e-9 * (1 + 1e-10), 4.5e-9)).toBe('equilibrio')
    expect(rengCompararQKsp(4.5e-9 * (1 + 1e-6), 4.5e-9)).toBe('precipita')
    expect(rengCompararQKsp(4.5e-9 * (1 - 1e-6), 4.5e-9)).toBe('disuelve')
    expect(rengCompararQKsp(0, 4.5e-9)).toBe('disuelve')
    expect(() => rengCompararQKsp(Number.NaN, 1)).toThrow(RangeError)
    expect(() => rengCompararQKsp(1, 0)).toThrow(RangeError)
  })

  it('CaCO₃ con 1,0·10⁻⁴ de cada ion: Q = 1,0·10⁻⁸ > Ksp → precipita x = 1,0·10⁻⁴ − √Ksp = 3,2918·10⁻⁵ mol/L', () => {
    const rengR = rengAnalizarSolubilidad(rengPar('caco3', 1e-4, 1e-4))
    expect(rengR.q).toBeCloseTo(1e-8, 20)
    expect(rengR.veredicto).toBe('precipita')
    expect(rengRel(rengR.precipitado, 3.2918e-5)).toBeLessThan(TOL_REL_MANO)
    expect(rengRel(rengR.cMFinal, 6.7082e-5)).toBeLessThan(TOL_REL_MANO)
    expect(rengRel(rengR.cAFinal, 6.7082e-5)).toBeLessThan(TOL_REL_MANO)
    expect(rengRel(rengR.qFinal, 4.5e-9)).toBeLessThan(1e-9)
    expect(rengR.s).toBe(0)
    expect(rengR.solidoFinal).toBeCloseTo(rengR.precipitado, 15)
  })

  it('Mg(OH)₂ con 1,0·10⁻⁴ de Mg²⁺ y 1,0·10⁻³ de OH⁻: precipita x ≈ 8,95·10⁻⁵ y queda Mg²⁺ ≈ 1,053·10⁻⁵ mol/L', () => {
    const rengR = rengAnalizarSolubilidad(rengPar('mgoh2', 1e-4, 1e-3))
    expect(rengR.veredicto).toBe('precipita')
    expect(rengRel(rengR.cMFinal, 1.053e-5)).toBeLessThan(5e-3)
    expect(rengRel(rengR.precipitado, 1e-4 - rengR.cMFinal)).toBeLessThan(1e-9)
    expect(rengRel(rengR.cAFinal, 1e-3 - 2 * rengR.precipitado)).toBeLessThan(1e-9)
    expect(rengRel(rengR.qFinal, 7.1e-12)).toBeLessThan(1e-9)
  })

  it('en el equilibrio (Q = Ksp) no hay evolución', () => {
    const rengC = Math.sqrt(4.5e-9)
    const rengR = rengAnalizarSolubilidad(rengPar('caco3', rengC, rengC, 0.001))
    expect(rengR.veredicto).toBe('equilibrio')
    expect(rengR.precipitado).toBe(0)
    expect(rengR.disuelto).toBe(0)
    expect(rengR.solidoFinal).toBe(0.001)
  })

  it('Q < Ksp con sólido presente: se disuelve hasta saturar (5,7082·10⁻⁵ mol/L) y queda sólido', () => {
    const rengR = rengAnalizarSolubilidad(rengPar('caco3', 1e-5, 1e-5, 1e-3))
    expect(rengR.veredicto).toBe('disuelve')
    expect(rengRel(rengR.disuelto, 5.7082e-5)).toBeLessThan(TOL_REL_MANO)
    expect(rengRel(rengR.cMFinal, 6.7082e-5)).toBeLessThan(TOL_REL_MANO)
    expect(rengR.solidoFinal).toBeCloseTo(1e-3 - rengR.disuelto, 15)
    expect(rengR.diagnosticos.some((rengD) => rengD.codigo === 'sol-solido-sobra')).toBe(true)
  })

  it('Q < Ksp con poco sólido: se disuelve todo y queda sin saturar; sin sólido no hay nada que disolver', () => {
    const rengTodo = rengAnalizarSolubilidad(rengPar('caco3', 1e-5, 1e-5, 1e-6))
    expect(rengTodo.disuelto).toBeCloseTo(1e-6, 18)
    expect(rengTodo.solidoFinal).toBeCloseTo(0, 18)
    expect(rengTodo.qFinal).toBeLessThan(4.5e-9)
    expect(rengTodo.diagnosticos.some((rengD) => rengD.codigo === 'sol-solido-agotado')).toBe(true)
    const rengNada = rengAnalizarSolubilidad(rengPar('caco3', 1e-5, 1e-5, 0))
    expect(rengNada.disuelto).toBe(0)
    expect(rengNada.diagnosticos.some((rengD) => rengD.codigo === 'sol-sin-solido' && /no hay sólido presente/.test(rengD.texto))).toBe(true)
  })

  it('la masa se conserva: sólido + iones salidos del sólido = constante, para 300 casos aleatorios en las 3 sales', () => {
    let rengSemilla = 3
    const rengAzar = (): number => ((rengSemilla = (rengSemilla * 1664525 + 1013904223) % 4294967296) / 4294967296)
    for (let rengI = 0; rengI < 300; rengI++) {
      const rengSal = RENG_SALES_SOLUBILIDAD[rengI % 3]!
      const rengCM = rengAzar() < 0.15 ? 0 : 10 ** (rengAzar() * 5 - 7)
      const rengCA = rengAzar() < 0.15 ? 0 : 10 ** (rengAzar() * 5 - 7)
      const rengSolido = rengAzar() < 0.3 ? 0 : 10 ** (rengAzar() * 4 - 6)
      const rengR = rengAnalizarSolubilidad(rengPar(rengSal.id, rengCM, rengCA, rengSolido))
      const rengP = rengSal.cation.nu
      const rengQ = rengSal.anion.nu
      expect(rengR.solidoFinal, JSON.stringify([rengSal.id, rengCM, rengCA, rengSolido])).toBeGreaterThanOrEqual(-1e-18)
      expect(rengR.cMFinal).toBeGreaterThanOrEqual(-1e-18)
      expect(rengR.cAFinal).toBeGreaterThanOrEqual(-1e-18)
      expect((rengR.cMFinal - rengCM) / rengP + (rengR.solidoFinal - rengSolido)).toBeCloseTo(0, 12)
      expect((rengR.cAFinal - rengCA) / rengQ + (rengR.solidoFinal - rengSolido)).toBeCloseTo(0, 12)
      if (rengR.veredicto === 'precipita') expect(rengRel(rengR.qFinal, rengSal.ksp)).toBeLessThan(1e-8)
      else expect(rengR.qFinal).toBeLessThanOrEqual(rengSal.ksp * (1 + 1e-8))
      expect(rengR.s).toBeLessThanOrEqual(rengR.s0 * (1 + 1e-12))
    }
  })

  it('PREDICCIÓN: el veredicto de Q/Ksp coincide con comparar Q recalculado con otra expresión (barrido)', () => {
    for (const rengSal of RENG_SALES_SOLUBILIDAD) {
      for (let rengI = -8; rengI <= -1; rengI++) {
        for (let rengJ = -8; rengJ <= -1; rengJ++) {
          const rengCM = 10 ** rengI
          const rengCA = 10 ** rengJ
          const rengR = rengAnalizarSolubilidad(rengPar(rengSal.id, rengCM, rengCA))
          const rengQ = Math.exp(rengSal.cation.nu * Math.log(rengCM) + rengSal.anion.nu * Math.log(rengCA))
          expect(rengR.veredicto, `${rengSal.id} ${rengCM} ${rengCA}`).toBe(Math.abs(Math.log(rengQ / rengSal.ksp)) < 1e-9 ? 'equilibrio' : rengQ > rengSal.ksp ? 'precipita' : 'disuelve')
        }
      }
    }
  })
})

describe('D4.2 · diagnósticos del modelo ideal (códigos propios «sol-»)', () => {
  it('faltan especies: sin iones o sin uno de ellos', () => {
    const rengVacio = rengAnalizarSolubilidad(rengPar('caf2', 0, 0, 0))
    expect(rengVacio.diagnosticos.find((rengD) => rengD.codigo === 'sol-sin-iones')!.texto).toMatch(/Sin sólido tampoco hay nada que disolver/)
    expect(rengVacio.veredicto).toBe('disuelve')
    expect(rengVacio.q).toBe(0)
    const rengConSolido = rengAnalizarSolubilidad(rengPar('caf2', 0, 0, 1e-3))
    expect(rengConSolido.disuelto).toBeCloseTo(rengSolubilidadAguaPura(3.9e-11, 1, 2), 15)
    expect(rengConSolido.diagnosticos.find((rengD) => rengD.codigo === 'sol-sin-iones')!.texto).toMatch(/solubilidad del agua pura/)
    const rengSinAnion = rengAnalizarSolubilidad(rengPar('caf2', 1e-3, 0, 0))
    expect(rengSinAnion.diagnosticos.find((rengD) => rengD.codigo === 'sol-falta-ion')!.texto).toMatch(/Falta F⁻/)
    expect(rengAnalizarSolubilidad(rengPar('caf2', 0, 1e-3, 0)).diagnosticos.find((rengD) => rengD.codigo === 'sol-falta-ion')!.texto).toMatch(/Falta Ca²⁺/)
  })

  it('fuerza iónica: solo avisa por encima de 0,01 mol/L, con el umbral rotulado como convención del proyecto', () => {
    expect(rengAnalizarSolubilidad(rengPar('caco3', 1e-4, 1e-4)).diagnosticos.some((rengD) => rengD.codigo === 'sol-fuerza-ionica')).toBe(false)
    const rengAlta = rengAnalizarSolubilidad(rengPar('caf2', 0.05, 0.5, 0))
    const rengD = rengAlta.diagnosticos.find((rengX) => rengX.codigo === 'sol-fuerza-ionica')!
    expect(rengD.severidad).toBe('aviso')
    expect(rengD.texto).toMatch(/fuerza iónica cero/)
    expect(rengD.texto).toMatch(/criterio convencional de este proyecto/)
    expect(rengD.texto).toMatch(/no un valor de una fuente/)
    expect(rengAlta.fuerzaIonica).toBeCloseTo(0.5 * (rengAlta.cMFinal * 4 + rengAlta.cAFinal), 12)
  })

  it('los iones espectadores no cuentan en la fuerza iónica y se dice', () => {
    expect(rengAnalizarSolubilidad(rengPar('caco3', 1e-4, 0)).diagnosticos.find((rengD) => rengD.codigo === 'sol-espectadores')!.texto).toMatch(/un mínimo/)
  })

  it('dominio de entradas: negativos, no finitos y fuera de 0–1 mol/L se rechazan', () => {
    for (const rengMal of [{ cM: -1 }, { cA: Number.NaN }, { solido: -1 }, { cM: 2 }, { cA: 1.5 }, { solido: 2 }, { nuM: 3, nuA: 2 }]) expect(() => rengAnalizarSolubilidad({ ...rengPar('caco3', 1e-4, 1e-4), ...rengMal }), JSON.stringify(rengMal)).toThrow(RangeError)
  })

  it('los códigos de diagnóstico propios no chocan con los de otras escenas', () => {
    const rengOtros = new Set(['entrada', 'avisos-entrada', 'actividades', 'poliprotico', 'balance', 'sin-base', 'agotado', 'falta-especie', 'k-extrema', 'sin-convergencia', 'extrapolacion', 'sin-entropia', 'k-fuera-de-rango', 'aditivos', 'objetivo', 'extrapolacion-curva', 'negativa-patron', 'negativa-muestra', 'repetidos', 'pendiente-negativa', 'tres-patrones', 'saturacion', 'rango-recomendado'])
    const rengVistos = new Set<string>()
    for (const rengSal of RENG_SALES_SOLUBILIDAD) for (const rengX of [[0, 0, 0], [1e-3, 0, 0], [1e-5, 1e-5, 1e-6], [1e-5, 1e-5, 1e-3], [0.05, 0.5, 0], [1e-4, 1e-4, 0]] as const) for (const rengD of rengAnalizarSolubilidad(rengPar(rengSal.id, rengX[0], rengX[1], rengX[2])).diagnosticos) rengVistos.add(rengD.codigo)
    expect([...rengVistos].length).toBeGreaterThan(4)
    for (const rengC of rengVistos) {
      expect(rengC.startsWith('sol-'), rengC).toBe(true)
      expect(rengOtros.has(rengC), rengC).toBe(false)
    }
  })

  it('precipitación: con iones en Q ≤ Ksp no precipita nada', () => {
    expect(rengPrecipitado(4.5e-9, 1, 1, 1e-5, 1e-5)).toBe(0)
    expect(() => rengPrecipitado(4.5e-9, 3, 2, 1, 1)).toThrow(/no soportada/)
  })
})

describe('D4.2 · integración en el marco de escenas', async () => {
  const { rengProyectoNuevo, rengValidarProyecto } = await import('../../src/shared/cuaderno')
  const { rengAnadirCorrida, rengCrearCorrida } = await import('../../src/renderer/lib/cuaderno/proyecto')
  const { rengCompatibilidad } = await import('../../src/renderer/lib/cuaderno/modelos')
  const { rengAptitudComparacion } = await import('../../src/renderer/lib/cuaderno/comparar')
  const { rengCorridaEscena, rengEntradasDeCorrida, RENG_CODIGOS_V1 } = await import('../../src/renderer/modules/simulador-quimica/practica/corridaEscena')
  const { rengCalcularEscena, rengEntradasPorDefecto, rengValidarEntradasSim, RENG_MODELOS_ESCENA } = await import('../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion')
  const { rengDiagnosticosDominio, rengEntradasLegibles, rengResumenEscena, rengSensibilidadEscena } = await import('../../src/renderer/modules/simulador-quimica/practica/reglasEscena')
  const rengEj = { sal: 'caco3', cM: 1e-4, cA: 1e-4, sol0: 0 }

  it('el caso por defecto es válido y precipita (Mg(OH)₂ con Mg²⁺ 1e-4 y OH⁻ 1e-3 mol/L)', () => {
    const rengD = rengEntradasPorDefecto('solubilidad')
    expect(rengD).toEqual({ sal: 'mgoh2', cM: 1e-4, cA: 1e-3, sol0: 0 })
    const rengS = rengCalcularEscena('solubilidad', rengD)
    expect(rengS['ver']).toBe(-1)
    expect(rengS['x']).toBeGreaterThan(0)
    expect(rengS['qf']! / 7.1e-12).toBeCloseTo(1, 8)
  })

  it('el marco da las mismas cifras que el núcleo y las de la mano (CaCO₃ 1e-4 + 1e-4)', () => {
    const rengS = rengCalcularEscena('solubilidad', rengEj)
    expect(rengS['ver']).toBe(-1)
    expect(rengS['x']).toBeCloseTo(3.2918e-5, 8)
    expect(rengS['s0']).toBeCloseTo(6.7082e-5, 9)
    expect(rengS['s']).toBe(0)
    expect(rengS['cMf']).toBeCloseTo(6.7082e-5, 9)
  })

  it('una sal sin fuente, una entrada fuera de dominio o un campo ausente se rechazan con su explicación y sin cifras', () => {
    const rengVal = (rengE: Record<string, number | string>): { ok: boolean; texto: string } => {
      const rengV = rengValidarEntradasSim('solubilidad', rengE)
      return { ok: rengV.ok, texto: rengV.ok ? '' : rengV.diagnostico }
    }
    expect(rengVal({ ...rengEj, sal: 'caso4' }).texto).toMatch(/no tiene fuente de Ksp registrada/)
    expect(rengVal({ ...rengEj, sal: 'baso4' }).ok).toBe(false)
    expect(rengVal({ ...rengEj, cM: 2 }).ok).toBe(false)
    expect(rengVal({ ...rengEj, cA: -1 }).ok).toBe(false)
    expect(rengVal({ ...rengEj, sol0: 5 }).ok).toBe(false)
    expect(rengVal({ sal: 'caco3', cM: 1e-4 } as Record<string, number | string>).ok).toBe(false)
    expect(rengValidarEntradasSim('solubilidad', { ...rengEj, sal: 'baso4' }).ok).toBe(false)
    const rengR = rengResumenEscena('solubilidad', { ...rengEj, sal: 'caso4' })
    expect(rengR.ok).toBe(false)
    expect(rengR.resultados).toEqual([])
    expect(rengCorridaEscena('solubilidad', { ...rengEj, sal: 'caso4' }).estado).toBe('entrada-invalida')
    expect(rengCorridaEscena('solubilidad', { ...rengEj, sal: 'caso4' }).resultados).toEqual([])
  })

  it('la ficha declara versión, evidencia, condiciones con temperatura y una fila de parámetros por sal con su fuente consultada', () => {
    const rengF = RENG_MODELOS_ESCENA.solubilidad
    expect(rengF.version).toBe('1')
    expect(rengF.evidencia).toBe('calculo-verificado')
    expect(rengF.condiciones.join(' ')).toMatch(/25 °C/)
    for (const rengFormula of ['CaF₂', 'Mg(OH)₂', 'CaCO₃']) {
      const rengP = rengF.parametros.find((rengX) => rengX.nombre.startsWith(`Ksp de ${rengFormula}`))!
      expect(rengP.verificacion).toBe('consultada')
      expect(rengP.fuente).toMatch(/https:\/\/chem\.libretexts\.org\//)
      expect(rengP.fuente).toMatch(/consultada 2026-11-15/)
      expect(rengP.fuente).toMatch(/No leí la página entera/)
      expect(rengP.fuente).toMatch(/fuerza iónica: cero/)
      expect(rengP.fuente).toMatch(/CC BY-NC-SA 4\.0/)
      expect(rengP.fuente).toMatch(/Otras tablas abiertas dan valores distintos \(no se usan\)/)
    }
    expect(rengF.parametros.find((rengP) => /fuerza iónica/.test(rengP.nombre))!.verificacion).toBe('libro')
    expect(rengF.parametros.find((rengP) => /fuerza iónica/.test(rengP.nombre))!.fuente).toMatch(/no procede de ninguna fuente/)
    expect(rengF.limites.join(' ')).toMatch(/CaSO₄ quedó fuera/)
    expect(rengF.supuestos.join(' ')).toMatch(/ninguna fuente consultada los cuantifica/)
    expect(rengF.campos.find((rengC) => rengC.clave === 'sal')!.requerido).toBe(true)
  })

  it('diagnósticos del marco: hidrólisis (aviso en CaF₂ y CaCO₃, informativo en Mg(OH)₂), discrepancia entre tablas y estado de la corrida', () => {
    const rengDiag = (rengSal: string): ReturnType<typeof rengDiagnosticosDominio> => rengDiagnosticosDominio('solubilidad', { sal: rengSal, cM: 1e-4, cA: 1e-4, sol0: 0 })
    expect(rengDiag('caco3').find((rengD) => rengD.codigo === 'sol-hidrolisis')!.severidad).toBe('aviso')
    expect(rengDiag('caf2').find((rengD) => rengD.codigo === 'sol-hidrolisis')!.severidad).toBe('aviso')
    expect(rengDiag('mgoh2').find((rengD) => rengD.codigo === 'sol-hidrolisis')!.severidad).toBe('info')
    const rengDisc = rengDiag('caco3').find((rengD) => rengD.codigo === 'sol-ksp-discrepa')!
    expect(rengDisc.severidad).toBe('info')
    expect(rengDisc.texto).toMatch(/un factor 2,59/)
    expect(rengDisc.texto).toMatch(/Esa incertidumbre entre fuentes no se propaga/)
    expect(rengCorridaEscena('solubilidad', { sal: 'caco3', cM: 1e-4, cA: 1e-4, sol0: 0 }).estado).toBe('aproximacion')
    expect(rengCorridaEscena('solubilidad', { sal: 'mgoh2', cM: 1e-4, cA: 1e-3, sol0: 0 }).estado).toBe('calculado')
    expect(rengCorridaEscena('solubilidad', { sal: 'mgoh2', cM: 0.05, cA: 0.5, sol0: 0 }).estado).toBe('aproximacion')
  })

  it('la corrida pasa la validación del cuaderno, se reabre idéntica, guarda el veredicto y la serie del ion común', () => {
    for (const rengSal of ['caf2', 'mgoh2', 'caco3']) {
      const rengE = { sal: rengSal, cM: 1e-4, cA: 1e-3, sol0: 1e-4 }
      const rengC = rengCrearCorrida('corrida-0001', rengCorridaEscena('solubilidad', rengE), { nombre: 'solubilidad' }, new Date('2026-11-15T12:00:00Z'))
      const rengP = rengAnadirCorrida(rengProyectoNuevo('proyecto-prueba-1', 'P', new Date('2026-11-15T12:00:00Z')), rengC)
      expect(rengValidarProyecto(JSON.parse(JSON.stringify(rengP))), rengSal).toEqual(rengP)
      expect(rengC.modelo.id).toBe('sim-solubilidad')
      expect(rengC.parametros.find((rengX) => rengX.clave === 'sal')!.valor).toBe(RENG_CODIGOS_V1.sal.indexOf(rengSal as 'caf2'))
      expect(rengC.parametros.find((rengX) => rengX.clave === 'Ttabla')).toEqual({ clave: 'Ttabla', nombre: 'Temperatura de la tabla de Ksp (fija)', valor: 25, unidad: '°C' })
      expect(rengC.resultados.find((rengX) => rengX.clave === 'ver')!.valor).toBe(-1)
      expect(rengC.serie.columnas.map((rengX) => rengX.clave)).toEqual(['c_comun', 's'])
      expect(rengC.serie.filas).toHaveLength(41)
      const { entradas, avisos } = rengEntradasDeCorrida('solubilidad', rengC.origen.entradas)
      expect(avisos).toEqual([])
      expect(entradas['sal']).toBe(rengSal)
      expect(rengCorridaEscena('solubilidad', entradas)).toEqual(rengCorridaEscena('solubilidad', rengE))
      expect(rengCompatibilidad('sim-solubilidad', '1').tipo).toBe('actual')
      expect(rengAptitudComparacion(rengC).apta).toBe(rengC.estado === 'calculado' || rengC.estado === 'aproximacion')
    }
  })

  it('la serie baja de forma monótona con el ion común y cada punto cumple la ecuación de Ksp', () => {
    const rengC = rengCorridaEscena('solubilidad', { sal: 'caf2', cM: 0, cA: 0.001, sol0: 0 })
    const rengY = rengC.serie.filas.map((rengF) => rengF[1]!)
    for (let rengI = 1; rengI < rengY.length; rengI++) expect(rengY[rengI]!).toBeLessThanOrEqual(rengY[rengI - 1]!)
    for (const [rengCa, rengS] of rengC.serie.filas) expect((0 + rengS!) * (rengCa! + 2 * rengS!) ** 2 / 3.9e-11).toBeCloseTo(1, 6)
  })

  it('una sal desconocida al reabrir una corrida antigua se avisa y no inventa un Ksp', () => {
    const rengR = rengEntradasDeCorrida('solubilidad', { sal: 99, cM: 1e-4, cA: 1e-4 })
    expect(rengR.entradas['sal']).toBe('mgoh2')
    expect(rengR.avisos.some((rengA) => /Sal/.test(rengA) && /valor por defecto/.test(rengA))).toBe(true)
  })

  it('datos aplicados legibles y sensibilidad: la salida principal depende de si precipita', () => {
    expect(rengEntradasLegibles('solubilidad', { sal: 'caf2', cM: 0, cA: 0.01, sol0: 0 })).toEqual(['sal: CaF₂', 'concentración del catión en disolución: 0 mol/L', 'concentración del anión en disolución: 0,01 mol/L', 'sólido presente (por litro de disolución): 0 mol/L'])
    expect(rengSensibilidadEscena('solubilidad', rengEj).salida.clave).toBe('x')
    const rengS = rengSensibilidadEscena('solubilidad', { sal: 'caco3', cM: 1e-5, cA: 1e-5, sol0: 1e-3 })
    expect(rengS.salida.clave).toBe('s')
    expect(rengS.filas.some((rengF) => rengF.clave === 'cM')).toBe(true)
    expect(rengS.filas.some((rengF) => rengF.clave === 'sal')).toBe(false)
    expect(() => rengSensibilidadEscena('solubilidad', { ...rengEj, sal: 'caso4' })).toThrow(/no tiene fuente/)
  })

  it('no hay práctica de solubilidad: la identidad de las prácticas no se toca', async () => {
    const { RENG_TEMAS } = await import('../../src/renderer/modules/simulador-quimica/practica/banco')
    expect(RENG_TEMAS.some((rengT) => (rengT.escena as string | null) === 'solubilidad')).toBe(false)
  })
})
