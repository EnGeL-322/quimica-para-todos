import { describe, expect, it } from 'vitest'
import { RENG_CASOS, RENG_CATEGORIAS_CASOS, RENG_FUENTES, type RengCategoria } from '../../src/renderer/modules/simulador-quimica/datos/casos'
import { rengAjustarEcuacion } from '../../src/renderer/modules/simulador-quimica/nucleo/ajuste'
import { rengFraccionFluor, rengPorcentajeParaPpm, rengPpmDePorcentaje } from '../../src/renderer/modules/simulador-quimica/nucleo/casos'
import { rengFragmentoDe } from '../../src/renderer/modules/simulador-quimica/nucleo/fragmentoSustancia'
import { rengClaveComposicion } from '../../src/renderer/modules/simulador-quimica/nucleo/reaccionesConocidas'
import { rengInterpretarSustancia } from '../../src/renderer/modules/simulador-quimica/nucleo/sustancia'

describe('datos de los casos', () => {
  it('hay casos de hogar, naturaleza, espacio y Tesla, con id único y ninguno del cuerpo', () => {
    const rengIds = RENG_CASOS.map((rengC) => rengC.id)
    expect(new Set(rengIds).size).toBe(rengIds.length)
    for (const rengCat of Object.keys(RENG_CATEGORIAS_CASOS) as RengCategoria[]) expect(RENG_CASOS.filter((rengC) => rengC.categoria === rengCat).length, rengCat).toBeGreaterThanOrEqual(2)
    expect(RENG_CASOS.length).toBe(15)
    expect(RENG_CASOS.some((rengC) => (rengC.categoria as string) === 'cuerpo')).toBe(false)
  })
  it('cada caso tiene a lo sumo 3 ideas, límites declarados y fuentes que existen', () => {
    const rengIds = new Set(RENG_FUENTES.map((rengF) => rengF.id))
    for (const rengC of RENG_CASOS) {
      expect(rengC.ideas.length, rengC.id).toBeGreaterThan(0)
      expect(rengC.ideas.length, rengC.id).toBeLessThanOrEqual(3)
      expect(rengC.limites.length, rengC.id).toBeGreaterThan(0)
      const rengUsadas = [...rengC.ideas, ...rengC.detalles, ...rengC.ecuaciones, ...(rengC.cronologia ?? []), ...(rengC.datos ?? [])].map((rengX) => rengX.fuente)
      for (const rengF of rengUsadas) if (rengF) expect(rengIds.has(rengF), `${rengC.id}: ${rengF}`).toBe(true)
    }
    for (const rengF of RENG_FUENTES) {
      expect(['abierta', 'resumen']).toContain(rengF.acceso)
      expect(rengF.url, rengF.id).toMatch(/^https:\/\//)
      expect(rengF.consultada, rengF.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})

describe('simulaciones enlazadas', () => {
  it('cada simulación relacionada nombra el experimento de Física para Todos y por qué', () => {
    const rengPedidas = RENG_CASOS.flatMap((rengC) => (rengC.simulaciones ?? []).map((rengS) => ({ caso: rengC.id, ...rengS })))
    expect(rengPedidas.length).toBeGreaterThan(5)
    for (const rengP of rengPedidas) {
      expect(rengP.id, rengP.caso).toMatch(/^[a-z][a-z0-9-]+$/)
      expect(rengP.nombre.length, rengP.caso).toBeGreaterThan(2)
      expect(rengP.porque.length, rengP.caso).toBeGreaterThan(10)
    }
  })
})

describe('casos de Nikola Tesla', () => {
  const rengTesla = RENG_CASOS.filter((rengC) => rengC.categoria === 'tesla')
  it('hay al menos 4 y cada hecho con fecha tiene fuente', () => {
    expect(rengTesla.length).toBeGreaterThanOrEqual(4)
    for (const rengC of rengTesla) for (const rengX of rengC.cronologia ?? []) expect(rengX.fuente, `${rengC.id}: ${rengX.cuando}`).not.toBeNull()
  })
  it('las fechas de las patentes coinciden con las consultadas', () => {
    const rengMotor = JSON.stringify(RENG_CASOS.find((rengC) => rengC.id === 'tesla-motor'))
    expect(rengMotor).toContain('381 968')
    expect(rengMotor).toContain('12-oct-1887')
    expect(rengMotor).toContain('1-may-1888')
    const rengOzono = JSON.stringify(RENG_CASOS.find((rengC) => rengC.id === 'tesla-ozono'))
    expect(rengOzono).toContain('568 177')
    expect(rengOzono).toContain('17-jun-1896')
    expect(rengOzono).toContain('22-sep-1896')
  })
  it('lo no verificado se declara: la compañía de ozono NO se afirma', () => {
    const rengOzono = RENG_CASOS.find((rengC) => rengC.id === 'tesla-ozono')!
    expect(rengOzono.limites.join(' ')).toMatch(/NO se afirma/)
    expect(JSON.stringify(rengOzono.ideas)).not.toMatch(/Ozone Company/)
  })
})

describe('las sustancias de los casos', () => {
  const rengTodas = RENG_CASOS.flatMap((rengC) => rengC.componentes.map((rengK) => ({ caso: rengC.id, ...rengK })))
  it.each(rengTodas.filter((rengK) => rengK.entrada))('«%s»: se interpreta y su composición es la declarada', (rengK) => {
    const rengR = rengInterpretarSustancia(rengK.entrada!)
    expect(rengR.tipo, `${rengK.caso}/${rengK.nombre}`).toBe('ok')
    if (rengR.tipo !== 'ok') return
    expect(rengClaveComposicion(rengR.sustancia.formula), `${rengK.caso}/${rengK.nombre}: ${rengR.sustancia.formula} ≠ ${rengK.formula}`).toBe(rengClaveComposicion(rengK.formula))
  })
  it.each(rengTodas.filter((rengK) => rengK.entrada))('«%s»: se puede poner en la mesa', (rengK) => {
    const rengR = rengInterpretarSustancia(rengK.entrada!)
    if (rengR.tipo !== 'ok') throw new Error('no interpretable')
    const rengF = rengFragmentoDe(rengR.sustancia)
    expect(rengF.ok, `${rengK.caso}/${rengK.nombre}: ${'motivo' in rengF ? rengF.motivo : ''}`).toBe(true)
  })
})

describe('ecuaciones de los casos', () => {
  const rengEqs = RENG_CASOS.flatMap((rengC) => rengC.ecuaciones.map((rengE) => ({ caso: rengC.id, ...rengE })))
  it.each(rengEqs)('«$nombre» está balanceada (coeficientes = los del ajuste de la app)', (rengE) => {
    const rengLado = (rengXs: Array<{ formula: string }>): string => rengXs.map((rengX) => rengX.formula).join(' + ')
    const rengAj = rengAjustarEcuacion(`${rengLado(rengE.reactivos)} -> ${rengLado(rengE.productos)}`)
    expect(rengAj.reactivos.map((rengT) => rengT.coef)).toEqual(rengE.reactivos.map((rengX) => rengX.coef))
    expect(rengAj.productos.map((rengT) => rengT.coef)).toEqual(rengE.productos.map((rengX) => rengX.coef))
  })
})

describe('flúor de la pasta dental (calculado)', () => {
  it('fracciones en masa de F: NaF ≈ 45,2 %, SnF₂ ≈ 24,2 %, Na₂PO₃F ≈ 13,2 %', () => {
    expect(rengFraccionFluor('NaF')! * 100).toBeCloseTo(45.2, 0)
    expect(rengFraccionFluor('SnF2')! * 100).toBeCloseTo(24.2, 0)
    expect(rengFraccionFluor('Na2PO3F')! * 100).toBeCloseTo(13.2, 0)
  })
  it('para 1000 ppm de F: NaF ≈ 0,22 %, SnF₂ ≈ 0,41 %, MFP ≈ 0,76 %', () => {
    expect(rengPorcentajeParaPpm('NaF', 1000)!).toBeCloseTo(0.221, 2)
    expect(rengPorcentajeParaPpm('SnF2', 1000)!).toBeCloseTo(0.412, 2)
    expect(rengPorcentajeParaPpm('Na2PO3F', 1000)!).toBeCloseTo(0.758, 2)
  })
  it('ida y vuelta entre ppm y porcentaje', () => {
    const rengP = rengPorcentajeParaPpm('NaF', 1450)!
    expect(rengPpmDePorcentaje('NaF', rengP)!).toBeCloseTo(1450, 6)
  })
  it('sin flúor no hay cálculo', () => {
    expect(rengFraccionFluor('NaCl')).toBeNull()
    expect(rengPorcentajeParaPpm('H2O', 1000)).toBeNull()
  })
})
