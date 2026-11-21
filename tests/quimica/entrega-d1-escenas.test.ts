import { describe, expect, it } from 'vitest'
import { RENG_NIVELES_EVIDENCIA } from '../../src/shared/cuaderno'
import { rengAnalizarEquilibrio, RENG_TOL_RESIDUO, type RengEspecieEq } from '../../src/renderer/modules/simulador-quimica/nucleo/equilibrio'
import { rengResolverMezclaAcidoBase } from '../../src/renderer/modules/simulador-quimica/nucleo/mezclaAcidoBase'
import { RENG_ESCENAS, RENG_MODELOS_ESCENA, RENG_PRESETS_EQ, rengCalcularEscena, rengEntradasPorDefecto, rengEspeciesDe, rengValidarEntradasSim } from '../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion'
import {
  RENG_TOL_BALANCE,
  rengBalancesAcidoBase,
  rengCompararQK,
  rengConvertirUnidad,
  rengDiagnosticosDominio,
  rengFaltaEquilibrio,
  rengRegionValoracion,
  rengResumenEscena,
  rengSensibilidadEscena,
  rengTipoUnidadDe,
  rengEntradasLegibles,
  rengVerificarBalancesMezcla
} from '../../src/renderer/modules/simulador-quimica/practica/reglasEscena'

const RENG_PKW = 13.9965

describe('D1 · ficha del modelo de cada escena', () => {
  for (const rengId of RENG_ESCENAS) {
    it(`${rengId}: declara ecuaciones, entradas con unidades, condiciones, especies, versión, fuente y nivel de evidencia`, () => {
      const rengM = RENG_MODELOS_ESCENA[rengId]
      expect(rengM.version).toMatch(/^\d+$/)
      expect(RENG_NIVELES_EVIDENCIA).toContain(rengM.evidencia)
      expect(rengM.verificacion.length).toBeGreaterThan(30)
      expect(rengM.ecuaciones.length).toBeGreaterThan(0)
      expect(rengM.dominio.length).toBeGreaterThan(0)
      expect(rengM.condiciones.length).toBeGreaterThan(0)
      expect(rengM.especiesFases.length).toBeGreaterThan(0)
      expect(rengM.salidas.length).toBeGreaterThan(0)
      expect(rengM.parametros.length).toBeGreaterThan(0)
      for (const rengP of rengM.parametros) expect(rengP.fuente.length).toBeGreaterThan(5)
      for (const rengC of rengM.campos) expect(rengC.unidad).not.toBeUndefined()
      expect(rengM.condiciones.join(' ')).toMatch(/°C|K|temperatura/i)
    })
  }

  it('los valores publicados y los de libro no consultado van separados (S° de libro no se declara «consultada»)', () => {
    const rengTermo = RENG_MODELOS_ESCENA.termo.parametros
    const rengS = rengTermo.find((rengP) => /S°/.test(rengP.nombre))
    expect(rengS).toBeDefined()
    expect(rengS!.verificacion).toBe('libro')
    expect(rengTermo.find((rengP) => /ΔfH/.test(rengP.nombre))!.verificacion).toBe('consultada')
  })
})

describe('D1 · Ácidos y bases: balances, región de la valoración y verificación independiente', () => {
  it('HCl 0,1 mol/L: pH = −log C y los balances se cumplen', () => {
    const rengB = rengBalancesAcidoBase('hcl', 0.1, 25, 0.1, 0)
    expect(rengB.pH).toBeCloseTo(1, 4)
    expect(rengB.cumple).toBe(true)
    expect(rengB.region.region).toBe('sin-base')
  })

  it('ácido acético 0,1 mol/L coincide con la cuadrática H² + Ka·H − Ka·C = 0 (cálculo independiente sin Kw)', () => {
    const rengKa = 10 ** -4.756
    const rengH = (-rengKa + Math.sqrt(rengKa * rengKa + 4 * rengKa * 0.1)) / 2
    expect(rengBalancesAcidoBase('acetico', 0.1, 25, 0.1, 0).pH).toBeCloseTo(-Math.log10(rengH), 4)
  })

  it('semiequivalencia: pH ≈ pKa; equivalencia: básico y sin exceso; después: sobra NaOH y pH = pKw + log[OH⁻]', () => {
    const rengSemi = rengBalancesAcidoBase('acetico', 0.1, 25, 0.1, 12.5)
    expect(rengSemi.pH).toBeCloseTo(4.756, 1)
    expect(rengSemi.region.region).toBe('antes')
    expect(rengSemi.region.reactivoExceso).toBe('acido')
    expect(rengSemi.region.excesoMol).toBeCloseTo(0.1 * 0.0125, 12)
    const rengEq = rengBalancesAcidoBase('acetico', 0.1, 25, 0.1, 25)
    expect(rengEq.region.region).toBe('equivalencia')
    expect(rengEq.region.reactivoExceso).toBeNull()
    expect(rengEq.pH).toBeGreaterThan(8)
    const rengDespues = rengBalancesAcidoBase('hcl', 0.1, 25, 0.1, 40)
    expect(rengDespues.region.region).toBe('despues')
    expect(rengDespues.region.reactivoExceso).toBe('base')
    const rengOh = (0.1 * 0.015) / 0.065
    expect(rengDespues.pH).toBeCloseTo(RENG_PKW + Math.log10(rengOh), 4)
  })

  it('HCl con NaOH en la equivalencia: pH = pKw/2 (ácido fuerte con base fuerte)', () => {
    expect(rengBalancesAcidoBase('hcl', 0.1, 25, 0.1, 25).pH).toBeCloseTo(RENG_PKW / 2, 4)
  })

  it('los balances de carga y materia se cumplen dentro de la tolerancia en una rejilla de ácidos, concentraciones y volúmenes', () => {
    for (const rengId of ['hcl', 'acetico', 'fosforico1', 'fluorhidrico', 'formico', 'amonio']) {
      for (const rengC of [1e-6, 1e-4, 1e-2, 0.1, 1]) {
        for (const rengVb of [0, 5, 12.5, 24.9, 25, 25.1, 40, 100]) {
          const rengB = rengBalancesAcidoBase(rengId, rengC, 25, rengC, rengVb)
          expect(rengB.relativoCarga, `${rengId} C=${rengC} Vb=${rengVb}`).toBeLessThan(RENG_TOL_BALANCE)
          expect(rengB.relativoMateria, `${rengId} C=${rengC} Vb=${rengVb}`).toBeLessThan(RENG_TOL_BALANCE)
        }
      }
    }
  })

  it('región de la valoración con tolerancia explícita y rechazo de datos no físicos', () => {
    expect(rengRegionValoracion(1e-3, 0).region).toBe('sin-base')
    expect(rengRegionValoracion(1e-3, 1e-3 * (1 + 1e-12)).region).toBe('equivalencia')
    expect(rengRegionValoracion(1e-3, 1e-3 * (1 + 1e-6)).region).toBe('despues')
    expect(() => rengRegionValoracion(0, 1)).toThrow(RangeError)
    expect(() => rengRegionValoracion(1, -1)).toThrow(RangeError)
    expect(() => rengRegionValoracion(Number.NaN, 1)).toThrow(RangeError)
  })

  it('el punto de la curva (Vb) se valida y se calcula con la misma entrada validada', () => {
    expect(rengValidarEntradasSim('acidobase', { acido: 'acetico', C: 0.1, Va: 25, Cb: 0.1, Vb: -1 }).ok).toBe(false)
    expect(rengValidarEntradasSim('acidobase', { acido: 'acetico', C: 0.1, Va: 25, Cb: 0.1, Vb: Number.NaN }).ok).toBe(false)
    const rengS = rengCalcularEscena('acidobase', { acido: 'acetico', C: 0.1, Va: 25, Cb: 0.1, Vb: 12.5 })
    expect(rengS['pHVb']).toBeCloseTo(rengBalancesAcidoBase('acetico', 0.1, 25, 0.1, 12.5).pH, 10)
  })

  it('contraste entre las dos escenas: la mezcla (pKw = 13,99) y Ácidos y bases (pKw = 13,9965) difieren menos de 0,01 unidades de pH', () => {
    for (const [rengAcido, rengVb] of [['acetico', 0], ['acetico', 12.5], ['acetico', 25], ['acetico', 30], ['hcl', 12.5], ['hcl', 25], ['hcl', 30]] as const) {
      const rengA = rengBalancesAcidoBase(rengAcido, 0.01, 25, 0.01, rengVb).pH
      const rengM = rengResolverMezclaAcidoBase({ acido: rengAcido, concentracionAcido: 0.01, volumenAcidoMl: 25, concentracionBase: 0.01, volumenBaseMl: rengVb }).pH
      expect(Math.abs(rengA - rengM), `${rengAcido} Vb=${rengVb}`).toBeLessThan(0.01)
    }
  })
})

describe('D1 · diagnósticos de dominio', () => {
  it('fosfórico más allá de la primera equivalencia: fuera del dominio (solo se modela el primer protón)', () => {
    const rengD = rengDiagnosticosDominio('acidobase', { acido: 'fosforico1', C: 0.1, Va: 25, Cb: 0.1, Vb: 40 })
    expect(rengD.some((rengX) => rengX.codigo === 'poliprotico' && rengX.severidad === 'fuera')).toBe(true)
    expect(rengDiagnosticosDominio('acidobase', { acido: 'fosforico1', C: 0.1, Va: 25, Cb: 0.1, Vb: 10 }).some((rengX) => rengX.codigo === 'poliprotico')).toBe(false)
  })

  it('1 mol/L supera la fuerza iónica en la que actividades ≈ concentraciones; 1e-3 mol/L no', () => {
    expect(rengDiagnosticosDominio('acidobase', { acido: 'hcl', C: 1, Va: 25, Cb: 1, Vb: 0 }).some((rengX) => rengX.codigo === 'actividades')).toBe(true)
    expect(rengDiagnosticosDominio('acidobase', { acido: 'hcl', C: 1e-3, Va: 25, Cb: 1e-3, Vb: 0 }).some((rengX) => rengX.codigo === 'actividades')).toBe(false)
  })

  it('orden 0 después del agotamiento: el modelo de velocidad constante deja de aplicar', () => {
    const rengD = rengDiagnosticosDominio('cinetica', { orden: 0, A0: 1, k: 0.5, t: 3 })
    expect(rengD.some((rengX) => rengX.codigo === 'agotado' && /2/.test(rengX.texto))).toBe(true)
    expect(rengDiagnosticosDominio('cinetica', { orden: 0, A0: 1, k: 0.5, t: 1 }).some((rengX) => rengX.codigo === 'agotado')).toBe(false)
  })

  it('energía: extrapolación lejos de 298,15 K, falta de S° y K fuera de rango numérico (sin número ficticio)', () => {
    expect(rengDiagnosticosDominio('termo', { reaccion: 'metano', T: 1000, mol: 1, masaAgua: 1000 }).some((rengX) => rengX.codigo === 'extrapolacion')).toBe(true)
    expect(rengDiagnosticosDominio('termo', { reaccion: 'metano', T: 300, mol: 1, masaAgua: 1000 }).some((rengX) => rengX.codigo === 'extrapolacion')).toBe(false)
    expect(rengDiagnosticosDominio('termo', { reaccion: 'etanol', T: 298.15, mol: 1, masaAgua: 1000 }).some((rengX) => rengX.codigo === 'sin-entropia' && /C₂H₅OH/.test(rengX.texto))).toBe(true)
    const rengExtremo = rengDiagnosticosDominio('termo', { reaccion: 'metano', T: 1, mol: 1, masaAgua: 1000 })
    expect(rengExtremo.some((rengX) => rengX.codigo === 'k-fuera-de-rango' && /ln K/.test(rengX.texto))).toBe(true)
  })

  it('una entrada inválida devuelve su diagnóstico como «fuera» y no lanza', () => {
    const rengD = rengDiagnosticosDominio('mezcla', { acido: 'acetico', cAcido: 0.5, VAcido: 25, cBase: 0.01, VBase: 10 })
    expect(rengD[0]!.severidad).toBe('fuera')
  })
})

describe('D1 · Equilibrio: Q frente a K con una sola regla y datos que faltan', () => {
  const rengHI = (rengC: number[]): RengEspecieEq[] => RENG_PRESETS_EQ[0]!.esp.map((rengE, rengI) => ({ ...rengE, c0: rengC[rengI]! }))

  it('la comparación de la escena coincide con el sentido que devuelve el cálculo en 400 casos', () => {
    let rengSemilla = 7
    const rengAzar = (): number => ((rengSemilla = (rengSemilla * 1664525 + 1013904223) % 4294967296) / 4294967296)
    for (let rengI = 0; rengI < 400; rengI++) {
      const rengC = [0, 1, 2].map(() => (rengAzar() < 0.15 ? 0 : 10 ** (rengAzar() * 4 - 2)))
      const rengK = 10 ** (rengAzar() * 6 - 3)
      const rengA = rengAnalizarEquilibrio(rengHI(rengC), rengK)
      if (rengA.tipo !== 'equilibrio') continue
      const rengVeredicto = rengCompararQK(rengA.Q0, rengK)
      expect(rengVeredicto, `c0=${rengC} K=${rengK}`).toBe(rengA.sentido === 0 ? 'equilibrio' : rengA.sentido > 0 ? 'productos' : 'reactivos')
    }
  })

  it('Q = K exacta es equilibrio; una diferencia mayor que la tolerancia compartida no lo es', () => {
    expect(rengCompararQK(50, 50)).toBe('equilibrio')
    expect(rengCompararQK(50 * (1 + 0.1 * RENG_TOL_RESIDUO), 50)).toBe('equilibrio')
    expect(rengCompararQK(50 * (1 + 10 * RENG_TOL_RESIDUO), 50)).toBe('reactivos')
    expect(rengCompararQK(0, 50)).toBe('productos')
    expect(rengCompararQK(Infinity, 50)).toBe('reactivos')
    expect(rengCompararQK(Number.NaN, 50)).toBe('indeterminado')
    expect(rengCompararQK(1, 0)).toBe('indeterminado')
  })

  it('nombra qué especies faltan y por qué no se puede concluir', () => {
    const rengSoloProducto = rengFaltaEquilibrio(rengHI([0, 0, 0.5]))
    expect(rengSoloProducto.codigo).toBe('sin-reactivos')
    expect(rengSoloProducto.ausentes).toEqual(['H₂', 'I₂'])
    expect(rengSoloProducto.texto).toMatch(/Q → ∞/)
    expect(rengFaltaEquilibrio(rengHI([1, 1, 0])).codigo).toBe('sin-productos')
    const rengVacio = rengFaltaEquilibrio(rengHI([0, 0, 0]))
    expect(rengVacio.codigo).toBe('vacio')
    expect(rengVacio.texto).toMatch(/Indica la concentración/)
    expect(rengFaltaEquilibrio(rengHI([1, 1, 0.2])).codigo).toBe('ninguna')
    const rengUnReactivo = rengFaltaEquilibrio(rengHI([1, 0, 0.2]))
    expect(rengUnReactivo.codigo).toBe('sin-reactivos')
    expect(rengUnReactivo.ausentes).toEqual(['I₂'])
    const rengIndeterminado = rengFaltaEquilibrio(rengHI([1, 0, 0]))
    expect(rengIndeterminado.codigo).toBe('sin-ambos')
    expect(rengIndeterminado.ausentes).toEqual(['I₂', 'HI'])
    expect(rengIndeterminado.texto).toMatch(/Q = 0\/0/)
    expect(rengIndeterminado.texto).toContain('I₂')
    expect(rengIndeterminado.texto).toContain('HI')
  })

  it('«no se puede concluir» (indeterminado) ocurre exactamente cuando el diagnóstico dice vacío o sin-ambos, en 300 casos', () => {
    let rengSemilla = 11
    const rengAzar = (): number => ((rengSemilla = (rengSemilla * 1664525 + 1013904223) % 4294967296) / 4294967296)
    for (let rengI = 0; rengI < 300; rengI++) {
      const rengEsp = RENG_PRESETS_EQ[rengI % RENG_PRESETS_EQ.length]!.esp.map((rengE) => ({ ...rengE, c0: rengAzar() < 0.4 ? 0 : 10 ** (rengAzar() * 2 - 1) }))
      const rengF = rengFaltaEquilibrio(rengEsp)
      const rengA = rengAnalizarEquilibrio(rengEsp, 5)
      expect(rengA.tipo === 'indeterminado', JSON.stringify(rengEsp)).toBe(rengF.codigo === 'vacio' || rengF.codigo === 'sin-ambos')
      if (rengA.tipo === 'indeterminado') for (const rengN of rengF.ausentes) expect(rengA.motivo).toContain(rengN)
    }
  })

  it('las concentraciones de equilibrio cumplen Q = K recalculada con otra expresión', () => {
    const rengEn = { reaccion: 'hi', K: 50, c0_0: 1, c0_1: 1, c0_2: 0 }
    const rengS = rengCalcularEscena('equilibrio', rengEn)
    expect((rengS['c_2']! ** 2) / (rengS['c_0']! * rengS['c_1']!)).toBeCloseTo(50, 6)
    expect(rengS['c_0']! + rengS['c_2']! / 2).toBeCloseTo(1, 12)
    expect(rengEspeciesDe(rengEn)!.length).toBe(3)
  })
})

describe('D1 · sensibilidad e incertidumbre propagada (supuesta, no medida)', () => {
  it('HCl: ∂pH por 1 % de C = −log₁₀(1,01/0,99)/2 y la incertidumbre del 1 % de C da ese mismo valor', () => {
    const rengS = rengSensibilidadEscena('acidobase', { acido: 'hcl', C: 0.1, Va: 25, Cb: 0.1 })
    const rengEsperado = Math.log10(1.01 / 0.99) / 2
    const rengFila = rengS.filas.find((rengF) => rengF.clave === 'C')!
    expect(Math.abs(rengFila.cambioPorCiento)).toBeCloseTo(rengEsperado, 4)
    expect(rengS.incertidumbre).toBeCloseTo(rengEsperado, 4)
    expect(rengS.filas.some((rengF) => rengF.clave === 'Va')).toBe(false)
  })

  it('cinética de orden 1: t½ = ln 2/k tiene incertidumbre relativa igual a la de k (1 %) y no depende de [A]₀', () => {
    const rengS = rengSensibilidadEscena('cinetica', { orden: 1, A0: 1, k: 0.2 })
    expect(rengS.valor).toBeCloseTo(Math.LN2 / 0.2, 12)
    expect(rengS.incertidumbre / rengS.valor).toBeCloseTo(0.01, 3)
    expect(rengS.filas.map((rengF) => rengF.clave)).toEqual(['k'])
  })

  it('cinética de orden 2: t½ = 1/(k·[A]₀) combina ambas entradas en cuadratura (√2 · 1 %)', () => {
    const rengS = rengSensibilidadEscena('cinetica', { orden: 2, A0: 1, k: 0.2 })
    expect(rengS.incertidumbre / rengS.valor).toBeCloseTo(Math.SQRT2 * 0.01, 3)
  })

  it('energía: ΔG depende de T con pendiente −ΔS°', () => {
    const rengS = rengSensibilidadEscena('termo', { reaccion: 'agua', T: 298.15, mol: 1, masaAgua: 1000 })
    expect(rengS.salida.clave).toBe('dG')
    const rengDS = rengCalcularEscena('termo', { reaccion: 'agua', T: 298.15, mol: 1, masaAgua: 1000 })['dS']!
    expect(Math.abs(rengS.filas.find((rengF) => rengF.clave === 'T')!.cambioPorCiento)).toBeCloseTo((Math.abs(rengDS) * 298.15 * 0.01) / 1000, 6)
  })

  it('con una reacción sin S° la salida principal es el calor liberado, no un ΔG inventado', () => {
    expect(rengSensibilidadEscena('termo', { reaccion: 'etanol', T: 298.15, mol: 1, masaAgua: 1000 }).salida.clave).toBe('q')
  })

  it('la incertidumbre es lineal en la incertidumbre relativa supuesta', () => {
    const rengUno = rengSensibilidadEscena('mezcla', { acido: 'acetico', cAcido: 0.01, VAcido: 25, cBase: 0.01, VBase: 12.5 }, 0.01).incertidumbre
    const rengDos = rengSensibilidadEscena('mezcla', { acido: 'acetico', cAcido: 0.01, VAcido: 25, cBase: 0.01, VBase: 12.5 }, 0.02).incertidumbre
    expect(rengDos / rengUno).toBeCloseTo(2, 6)
  })

  it('rechaza entradas inválidas en lugar de devolver números', () => {
    expect(() => rengSensibilidadEscena('equilibrio', { reaccion: 'hi', K: -1, c0_0: 1, c0_1: 1, c0_2: 0 })).toThrow(RangeError)
  })
})

describe('D1 · unidades editables', () => {
  it('conversiones exactas con base interna del modelo', () => {
    expect(rengConvertirUnidad(25, 'volumen', 'mL', 'L')).toBeCloseTo(0.025, 12)
    expect(rengConvertirUnidad(0.025, 'volumen', 'L', 'mL')).toBeCloseTo(25, 12)
    expect(rengConvertirUnidad(0.2, 'concentracion', 'mol/L', 'mmol/L')).toBeCloseTo(200, 10)
    expect(rengConvertirUnidad(25, 'temperatura', '°C', 'K')).toBeCloseTo(298.15, 12)
    expect(rengConvertirUnidad(298.15, 'temperatura', 'K', '°C')).toBeCloseTo(25, 12)
    expect(rengConvertirUnidad(2, 'tiempo', 'min', 's')).toBe(120)
    expect(rengConvertirUnidad(1, 'masa', 'kg', 'g')).toBe(1000)
  })

  it('unidades incompatibles lanzan error en lugar de convertir', () => {
    expect(() => rengConvertirUnidad(1, 'volumen', 'mL', 'mol/L')).toThrow(RangeError)
    expect(() => rengConvertirUnidad(1, 'concentracion', 'L', 'mol/L')).toThrow(RangeError)
  })

  it('cada unidad base de los campos del modelo con alternativas se reconoce', () => {
    expect(rengTipoUnidadDe('mol/L')).toBe('concentracion')
    expect(rengTipoUnidadDe('mL')).toBe('volumen')
    expect(rengTipoUnidadDe('K')).toBe('temperatura')
    expect(rengTipoUnidadDe('s')).toBe('tiempo')
    expect(rengTipoUnidadDe('g')).toBe('masa')
    expect(rengTipoUnidadDe('según el orden')).toBeNull()
  })
})

describe('D1 · resumen de resultados por escena', () => {
  for (const rengId of RENG_ESCENAS) {
    it(`${rengId}: el caso por defecto produce resultados finitos con unidad`, () => {
      const rengR = rengResumenEscena(rengId, rengEntradasPorDefecto(rengId))
      expect(rengR.ok).toBe(true)
      expect(rengR.resultados.length).toBeGreaterThan(0)
      for (const rengX of rengR.resultados) expect(Number.isFinite(rengX.valor)).toBe(true)
    })
  }

  it('una entrada inválida no produce números: devuelve el diagnóstico', () => {
    const rengR = rengResumenEscena('termo', { reaccion: 'metano', T: -5, mol: 1, masaAgua: 1000 })
    expect(rengR.ok).toBe(false)
    expect(rengR.resultados).toEqual([])
    expect(rengR.diagnosticos[0]!.severidad).toBe('fuera')
  })

  it('K fuera de rango no se presenta como número', () => {
    const rengR = rengResumenEscena('termo', { reaccion: 'metano', T: 1, mol: 1, masaAgua: 1000 })
    expect(rengR.resultados.some((rengX) => rengX.clave === 'K')).toBe(false)
    expect(rengR.resultados.some((rengX) => rengX.clave === 'dG')).toBe(true)
  })
})

describe('D1 · Mezcla ácido–base: verificación de balances y descripción de los datos aplicados', () => {
  it('los residuos relativos de carga y materia son ≤ tolerancia en una rejilla; HCl marca la materia «por construcción»', () => {
    for (const rengAcido of ['hcl', 'acetico'] as const) {
      for (const rengC of [1e-5, 1e-3, 0.01]) {
        for (const rengVb of [0, 5, 12.5, 25, 40]) {
          const rengR = rengResolverMezclaAcidoBase({ acido: rengAcido, concentracionAcido: rengC, volumenAcidoMl: 25, concentracionBase: rengC, volumenBaseMl: rengVb })
          const rengB = rengVerificarBalancesMezcla(rengR, rengAcido)
          expect(rengB.cumple, `${rengAcido} C=${rengC} Vb=${rengVb}`).toBe(true)
          expect(rengB.materiaPorConstruccion).toBe(rengAcido === 'hcl')
        }
      }
    }
  })

  it('describe los datos aplicados con etiqueta, valor y unidad', () => {
    const rengT = rengEntradasLegibles('termo', { reaccion: 'metano', T: 298.15, mol: 1, masaAgua: 1000 })
    expect(rengT[0]).toMatch(/^reacción: CH₄ \+ 2 O₂ → CO₂/)
    expect(rengT).toContain('temperatura: 298,15 K')
    expect(rengEntradasLegibles('acidobase', { acido: 'acetico', C: 0.1, Va: 25 })).toEqual(['ácido: CH₃COOH', 'concentración del ácido: 0,1 mol/L', 'volumen de ácido: 25 mL'])
    expect(rengEntradasLegibles('equilibrio', { reaccion: 'hi', K: 50, c0_0: 1, c0_1: 0.5, c0_2: 0 })).toEqual(['reacción: H₂ + I₂ ⇌ 2 HI', 'constante de equilibrio K (en concentraciones): 50', '[H₂] inicial: 1 mol/L', '[I₂] inicial: 0,5 mol/L', '[HI] inicial: 0 mol/L'])
    expect(rengEntradasLegibles('acidobase', { acido: 'acetico', C: 0.1, Cb: 0.05, Vb: 3 })).toEqual(expect.arrayContaining(['concentración de NaOH: 0,05 mol/L', 'NaOH añadido (punto de la curva): 3 mL']))
  })
})
