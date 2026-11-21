import { describe, expect, it } from 'vitest'
import { rengProyectoNuevo, rengValidarProyecto } from '../../src/shared/cuaderno'
import { rengAnadirCorrida, rengCrearCorrida } from '../../src/renderer/lib/cuaderno/proyecto'
import { RENG_SOLUCIONES_DILUCION, rengDiluir, rengLeerMagnitudDilucion } from '../../src/renderer/modules/simulador-quimica/nucleo/dilucion'
import { rengCorridaEscena, rengEntradasDeCorrida } from '../../src/renderer/modules/simulador-quimica/practica/corridaEscena'
import { rengCalcularEscena, rengEntradasPorDefecto, rengValidarEntradasSim } from '../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion'
import { rengDiagnosticosDominio, rengResumenEscena, rengSensibilidadEscena } from '../../src/renderer/modules/simulador-quimica/practica/reglasEscena'

const RENG_ACEPTACION = { c1: 0.2, Va: 25, Vf: 100, modo: 0, Vdisp: 250 } as const

describe('D3 · caso de aceptación: 25,0 mL de 0,200 mol/L aforados a 100,0 mL', () => {
  it('conserva 0,00500 mol de soluto y produce 0,0500 mol/L (núcleo)', () => {
    const rengR = rengDiluir({ ...RENG_ACEPTACION, modo: 0 })
    expect(rengR.molesAlicuota).toBeCloseTo(0.005, 15)
    expect(rengR.molesFinales).toBeCloseTo(0.005, 15)
    expect(rengR.concentracionFinal).toBeCloseTo(0.05, 15)
    expect(rengR.factor).toBe(4)
    expect(rengR.volumenDisolventeMl).toBe(75)
    expect(rengR.volumenTotalMl).toBe(100)
  })

  it('cálculo independiente: c₁V₁ = c₂V₂ y n = c·V con cifras escritas a mano', () => {
    const rengN = 0.2 * 0.025
    expect(rengN).toBeCloseTo(0.005, 15)
    expect(rengN / 0.1).toBeCloseTo(0.05, 15)
    expect(0.2 * 25).toBeCloseTo(0.05 * 100, 12)
  })

  it('a través del marco de escenas (validación, cálculo, resumen y corrida) da las mismas cifras', () => {
    expect(rengValidarEntradasSim('dilucion', RENG_ACEPTACION).ok).toBe(true)
    const rengS = rengCalcularEscena('dilucion', RENG_ACEPTACION)
    expect(rengS['n']).toBeCloseTo(0.005, 15)
    expect(rengS['c2']).toBeCloseTo(0.05, 15)
    const rengResumen = rengResumenEscena('dilucion', RENG_ACEPTACION)
    expect(rengResumen.resultados.find((rengR) => rengR.clave === 'c2')).toEqual({ clave: 'c2', nombre: 'Concentración final', valor: rengS['c2']!, unidad: 'mol/L' })
    const rengC = rengCorridaEscena('dilucion', RENG_ACEPTACION)
    expect(rengC.estado).toBe('calculado')
    expect(rengC.resultados.find((rengR) => rengR.clave === 'n')!.valor).toBeCloseTo(0.005, 15)
    expect(rengC.resultados.find((rengR) => rengR.clave === 'c2')!.valor).toBeCloseTo(0.05, 15)
  })

  it('los valores por defecto del marco son el caso de aceptación', () => {
    expect(rengCalcularEscena('dilucion', rengEntradasPorDefecto('dilucion'))['c2']).toBeCloseTo(0.05, 15)
  })
})

describe('D3 · «hasta el aforo» frente a «volumen de disolvente igual al volumen final»', () => {
  it('son dos preparaciones distintas con la misma alícuota y el mismo valor de Vf', () => {
    const rengAforo = rengDiluir({ ...RENG_ACEPTACION, modo: 0 })
    const rengIgual = rengDiluir({ ...RENG_ACEPTACION, modo: 1 })
    expect(rengAforo.concentracionFinal).toBeCloseTo(0.05, 15)
    expect(rengAforo.volumenDisolventeMl).toBe(75)
    expect(rengIgual.volumenTotalMl).toBe(125)
    expect(rengIgual.volumenDisolventeMl).toBe(100)
    expect(rengIgual.concentracionFinal).toBeCloseTo(0.04, 15)
    expect(rengIgual.molesFinales).toBeCloseTo(rengAforo.molesFinales, 15)
    expect(rengIgual.factor).toBe(5)
  })

  it('el modo «volumen igual» avisa de que no cabe en el matraz aforado y de la aditividad', () => {
    const rengD = rengDiagnosticosDominio('dilucion', { ...RENG_ACEPTACION, modo: 1 })
    const rengAviso = rengD.find((rengX) => rengX.codigo === 'aditivos')!
    expect(rengAviso.severidad).toBe('aviso')
    expect(rengAviso.texto).toMatch(/125 mL/)
    expect(rengAviso.texto).toMatch(/no cabe en un matraz aforado de 100 mL/)
    expect(rengDiagnosticosDominio('dilucion', { ...RENG_ACEPTACION, modo: 0 }).some((rengX) => rengX.codigo === 'aditivos')).toBe(false)
    expect(rengCorridaEscena('dilucion', { ...RENG_ACEPTACION, modo: 1 }).estado).toBe('aproximacion')
  })

  it('en 300 casos: los moles se conservan y c₁V_alícuota = c₂V_total en ambos modos', () => {
    let rengSemilla = 5
    const rengAzar = (): number => ((rengSemilla = (rengSemilla * 1664525 + 1013904223) % 4294967296) / 4294967296)
    for (let rengI = 0; rengI < 300; rengI++) {
      const rengE = { c1: 10 ** (rengAzar() * 4 - 3), Va: 0.5 + rengAzar() * 200, Vf: 1 + rengAzar() * 1000, modo: (rengAzar() < 0.5 ? 0 : 1) as 0 | 1, Vdisp: 250 + rengAzar() * 1000 }
      if (rengE.modo === 0 && rengE.Vf < rengE.Va) continue
      const rengR = rengDiluir(rengE)
      expect(rengR.molesFinales / rengR.molesAlicuota).toBeCloseTo(1, 12)
      expect((rengE.c1 * rengE.Va) / (rengR.concentracionFinal * rengR.volumenTotalMl)).toBeCloseTo(1, 12)
      expect(rengR.factor).toBeCloseTo(rengE.c1 / rengR.concentracionFinal, 9)
      expect(rengR.concentracionFinal).toBeLessThanOrEqual(rengE.c1 * (1 + 1e-12))
    }
  })
})

describe('D3 · diagnósticos', () => {
  it('alícuota mayor que el volumen disponible', () => {
    const rengV = rengValidarEntradasSim('dilucion', { c1: 0.2, Va: 150, Vf: 500, modo: 0, Vdisp: 100 })
    expect(rengV.ok).toBe(false)
    expect(!rengV.ok && rengV.diagnostico).toMatch(/alícuota \(150 mL\) es mayor que el volumen disponible/)
    expect(() => rengDiluir({ c1: 0.2, Va: 150, Vf: 500, modo: 0, Vdisp: 100 })).toThrow(RangeError)
  })

  it('volumen final menor que el transferido (con aforo); con «volumen igual» no es un error', () => {
    const rengV = rengValidarEntradasSim('dilucion', { c1: 0.2, Va: 25, Vf: 20, modo: 0, Vdisp: 100 })
    expect(rengV.ok).toBe(false)
    expect(!rengV.ok && rengV.diagnostico).toMatch(/volumen final \(20 mL\) es menor que la alícuota transferida \(25 mL\)/)
    expect(rengValidarEntradasSim('dilucion', { c1: 0.2, Va: 25, Vf: 20, modo: 1, Vdisp: 100 }).ok).toBe(true)
  })

  it('el resumen y la corrida de una entrada inválida no inventan números', () => {
    const rengR = rengResumenEscena('dilucion', { c1: 0.2, Va: 25, Vf: 20, modo: 0, Vdisp: 100 })
    expect(rengR.ok).toBe(false)
    expect(rengR.resultados).toEqual([])
    const rengC = rengCorridaEscena('dilucion', { c1: 0.2, Va: 25, Vf: 20, modo: 0, Vdisp: 100 })
    expect(rengC.estado).toBe('entrada-invalida')
    expect(rengC.resultados).toEqual([])
    expect(rengC.diagnosticos[0]).toMatch(/menor que la alícuota/)
  })

  it('entradas fuera del dominio de cada campo, no finitas y modo desconocido', () => {
    for (const rengMala of [{ c1: 0 }, { c1: 25 }, { Va: 0 }, { Vf: 0.5 }, { Vf: 6000 }, { Va: Number.NaN }, { modo: 2 }, { c2obj: 0 }] as Array<Record<string, number>>) {
      expect(rengValidarEntradasSim('dilucion', { ...RENG_ACEPTACION, ...rengMala }).ok, JSON.stringify(rengMala)).toBe(false)
    }
  })

  it('unidades: se aceptan mL, L, µL y cm³ para volúmenes y mol/L, mmol/L y M para concentraciones', () => {
    const rengOk = (rengT: string, rengM: 'volumen' | 'concentracion', rengV: number): void => {
      const rengL = rengLeerMagnitudDilucion(rengT, rengM)
      expect(rengL.ok, rengT).toBe(true)
      if (rengL.ok) expect(rengL.valor).toBeCloseTo(rengV, 12)
    }
    rengOk('25,0 mL', 'volumen', 25)
    rengOk('0,025 L', 'volumen', 25)
    rengOk('25000 µL', 'volumen', 25)
    rengOk('25 cm³', 'volumen', 25)
    rengOk('25', 'volumen', 25)
    rengOk('0,200 M', 'concentracion', 0.2)
    rengOk('200 mmol/L', 'concentracion', 0.2)
    rengOk('0.2', 'concentracion', 0.2)
    const rengConvertido = rengLeerMagnitudDilucion('0,025 L', 'volumen')
    expect(rengConvertido.ok && rengConvertido.convertido).toBe(true)
  })

  it('unidades incompatibles: «20 g» o «25 mol/L» como volumen y «25 mL» como concentración no se interpretan como correctos', () => {
    for (const [rengT, rengM] of [['20 g', 'volumen'], ['25 mol/L', 'volumen'], ['25 mL', 'concentracion'], ['0,2 s', 'concentracion']] as const) {
      const rengL = rengLeerMagnitudDilucion(rengT, rengM)
      expect(rengL.ok, rengT).toBe(false)
      expect(!rengL.ok && rengL.motivo).toBe('unidad-incompatible')
      expect(!rengL.ok && rengL.mensaje).toContain(rengT)
    }
    expect(rengLeerMagnitudDilucion('', 'volumen')).toMatchObject({ ok: false, motivo: 'vacio' })
    expect(rengLeerMagnitudDilucion('mucho', 'volumen')).toMatchObject({ ok: false, motivo: 'ilegible' })
  })
})

describe('D3 · objetivo, sensibilidad, serie y corrida', () => {
  it('compara con la concentración objetivo', () => {
    const rengAcierto = rengDiagnosticosDominio('dilucion', { ...RENG_ACEPTACION, c2obj: 0.05 }).find((rengX) => rengX.codigo === 'objetivo')!
    expect(rengAcierto.texto).toMatch(/Alcanzas el objetivo/)
    const rengFallo = rengDiagnosticosDominio('dilucion', { ...RENG_ACEPTACION, c2obj: 0.1 }).find((rengX) => rengX.codigo === 'objetivo')!
    expect(rengFallo.texto).toMatch(/se desvía 50 %/)
    expect(rengCalcularEscena('dilucion', { ...RENG_ACEPTACION, c2obj: 0.1 })['desv']).toBeCloseTo(-50, 10)
  })

  it('sensibilidad: c₂ = c₁·V_a/V_f → ∂c₂ por +1 % es ±1 % y la incertidumbre del 1 % en cada entrada es √3·1 %', () => {
    const rengS = rengSensibilidadEscena('dilucion', RENG_ACEPTACION)
    expect(rengS.salida.clave).toBe('c2')
    expect(rengS.incertidumbre / rengS.valor).toBeCloseTo(Math.sqrt(3) * 0.01, 3)
    expect(rengS.filas.map((rengF) => rengF.clave).sort()).toEqual(['Va', 'Vf', 'c1'])
    expect(rengS.filas.find((rengF) => rengF.clave === 'Vf')!.cambioPorCiento).toBeLessThan(0)
  })

  it('la corrida pasa la validación del cuaderno, guarda la serie c₂(V_f) y se repite idéntica', () => {
    const rengC = rengCrearCorrida('corrida-0001', rengCorridaEscena('dilucion', RENG_ACEPTACION), { nombre: 'dilución' }, new Date('2026-11-15T12:00:00Z'))
    const rengP = rengAnadirCorrida(rengProyectoNuevo('proyecto-prueba-1', 'P', new Date('2026-11-15T12:00:00Z')), rengC)
    expect(rengValidarProyecto(JSON.parse(JSON.stringify(rengP)))).toEqual(rengP)
    expect(rengC.modelo.id).toBe('sim-dilucion')
    const rengY = rengC.serie.filas.map((rengF) => rengF[1]!)
    for (let rengI = 1; rengI < rengY.length; rengI++) expect(rengY[rengI]!).toBeLessThan(rengY[rengI - 1]!)
    for (const [rengVf, rengC2] of rengC.serie.filas) expect(rengC2! * rengVf!).toBeCloseTo(0.2 * 25, 9)
    const { entradas, avisos } = rengEntradasDeCorrida('dilucion', rengC.origen.entradas)
    expect(avisos).toEqual([])
    expect(rengCorridaEscena('dilucion', entradas)).toEqual(rengCorridaEscena('dilucion', RENG_ACEPTACION))
  })

  it('con una alícuota menor que 1 mL la serie sigue siendo válida', () => {
    const rengC = rengCorridaEscena('dilucion', { c1: 0.2, Va: 0.5, Vf: 10, modo: 0, Vdisp: 100 })
    expect(rengC.estado).toBe('calculado')
    expect(rengC.serie.filas[0]![0]).toBe(1)
  })

  it('el montaje solo ofrece disoluciones inocuas (las sustancias peligrosas quedan fuera de los montajes interactivos)', () => {
    expect(RENG_SOLUCIONES_DILUCION.map((rengS) => rengS.id)).toEqual(['nacl', 'glucosa', 'sacarosa'])
    expect(RENG_SOLUCIONES_DILUCION[0]!.concentracion).toBe(0.2)
  })
})

describe('D3 · la práctica de dilución se simula con sus datos sin revelar la respuesta ni cambiar su identidad', () => {
  it('la transferencia se deriva del enunciado (C₁, volumen del matraz, objetivo) y no incluye la alícuota que se pide', async () => {
    const { rengEjercicioPorId, rengHuellaEjercicio } = await import('../../src/renderer/modules/simulador-quimica/practica/banco')
    const { rengSimulacionDeEjercicio, rengTransferirEjercicio } = await import('../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion')
    let rengCasos = 0
    for (let rengSemilla = 1; rengSemilla <= 30; rengSemilla++) {
      const rengE = rengEjercicioPorId(`analitica.dilucion~preuniversitario~${rengSemilla}`)!
      expect(rengE.simulacion).toBeUndefined()
      const rengSim = rengSimulacionDeEjercicio(rengE)!
      expect(rengSim.escena).toBe('dilucion')
      const rengDato = (rengK: string): number => Number(rengE.datos.find((rengD) => rengD.clave === rengK)!.valor)
      expect(rengSim.entradas).toEqual({ c1: rengDato('C1'), Vf: rengDato('V2'), modo: 0, c2obj: rengDato('C2') })
      expect(rengSim.entradas['Va']).toBeUndefined()
      const rengT = rengTransferirEjercicio(rengSim)
      expect(rengT.ok).toBe(true)
      const rengRespuesta = (rengDato('C2') * rengDato('V2')) / rengDato('C1')
      if (rengT.ok) {
        const rengC = rengCalcularEscena('dilucion', { ...rengT.entradas, Va: rengRespuesta })
        expect(rengC['c2']).toBeCloseTo(rengDato('C2'), 12)
        expect(rengC['desv']).toBeCloseTo(0, 9)
      }
      expect(rengHuellaEjercicio(rengE)).toMatch(/^[0-9a-f]{8}$/)
      rengCasos++
    }
    expect(rengCasos).toBe(30)
  })

  it('los demás niveles de dilución no tienen simulación', async () => {
    const { rengEjercicioPorId } = await import('../../src/renderer/modules/simulador-quimica/practica/banco')
    const { rengSimulacionDeEjercicio } = await import('../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion')
    expect(rengSimulacionDeEjercicio(rengEjercicioPorId('analitica.dilucion~universitario~1')!)).toBeUndefined()
    expect(rengSimulacionDeEjercicio(rengEjercicioPorId('analitica.dilucion~quimico~1')!)).toBeUndefined()
  })
})
