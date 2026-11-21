import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { rengCompile, rengDerivada, RengErrorNumerico, rengIntegrar, RENG_MAX_EVALUACIONES, rengRaizVerificada } from '../src/renderer/modules/laboratorio/expr'
import { rengDescriptiva, rengHistograma, rengLeerNumeros, rengRegresionLineal } from '../src/renderer/modules/laboratorio/stats'

const rengFn = (rengE: string) => {
  const rengC = rengCompile(rengE)
  return (rengX: number): number => rengC({ x: rengX })
}

describe('cálculo numérico: dominio, presupuesto y verificación', () => {
  it('∫ sqrt(x) de −2 a −1: error localizado al primer punto, con muy pocas evaluaciones', () => {
    let rengN = 0
    const rengF = rengFn('sqrt(x)')
    const rengContada = (rengX: number): number => (rengN++, rengF(rengX))
    expect(() => rengIntegrar(rengContada, -2, -1)).toThrow(RengErrorNumerico)
    expect(() => rengIntegrar(rengF, -2, -1)).toThrow(/f\(−2\) no está definida/)
    expect(rengN).toBeLessThanOrEqual(1)
  })
  it('una función que nunca converge se corta en el tope de evaluaciones', () => {
    let rengN = 0
    const rengLoca = (rengX: number): number => (rengN++, Math.sin(1 / (rengX * rengX + 1e-12)) * 1e6)
    const rengT0 = performance.now()
    expect(() => rengIntegrar(rengLoca, -1, 1, 1e-14)).toThrow(/no converge con 20.000 evaluaciones/)
    expect(rengN).toBe(RENG_MAX_EVALUACIONES)
    expect(performance.now() - rengT0).toBeLessThan(500)
  })
  it('integral correcta informa evaluaciones y error estimado', () => {
    const rengR = rengIntegrar(Math.sin, 0, Math.PI)
    expect(Math.abs(rengR.valor - 2)).toBeLessThan(1e-9)
    expect(rengR.evaluaciones).toBeGreaterThan(3)
    expect(rengR.evaluaciones).toBeLessThan(RENG_MAX_EVALUACIONES)
    expect(rengR.errorEstimado).toBeLessThan(1e-8)
    expect(rengIntegrar(Math.exp, 1, 1)).toEqual({ valor: 0, evaluaciones: 0, errorEstimado: 0 })
  })
  it('1/x en [−1, 1]: cambia de signo pero no hay raíz verificada (discontinuidad)', () => {
    expect(() => rengRaizVerificada(rengFn('1/x'), -1, 1)).toThrow(/no hay raíz verificada. f\(0\) es infinita.*discontinuidad o un polo/)
    expect(() => rengRaizVerificada(rengFn('1/x'), -1, 2)).toThrow(/no hay raíz verificada.*\|f\| = .* no tiende a 0.*discontinuidad o un polo/)
  })
  it('raíz verificada: residuo y extremos', () => {
    const rengR = rengRaizVerificada(rengFn('x^3 - 2x - 5'), 2, 3)
    expect(Math.abs(rengR.x - 2.0945514815423265)).toBeLessThan(1e-11)
    expect(rengR.residuo).toBeLessThan(1e-9)
    expect(rengRaizVerificada((rengX) => rengX - 1, 1, 3)).toEqual({ x: 1, residuo: 0, iteraciones: 0 })
    expect(() => rengRaizVerificada((rengX) => rengX * rengX + 1, -1, 1)).toThrow(/mismo signo/)
    expect(() => rengRaizVerificada(rengFn('sqrt(x) - 1'), -1, 4)).toThrow(/f\(−1\) no está definida/)
    expect(() => rengRaizVerificada(Math.sin, NaN, 1)).toThrow(/finitos/)
  })
  it('derivada exige valores finitos alrededor del punto', () => {
    expect(() => rengDerivada(rengFn('sqrt(x)'), 0)).toThrow(/no está definida/)
    expect(Math.abs(rengDerivada(Math.sin, 0) - 1)).toBeLessThan(1e-10)
  })
})

describe('importación de números y estadística', () => {
  it('«1,2,3»: tres números con punto decimal; con coma decimal es un error informado', () => {
    expect(rengLeerNumeros('1,2,3', 'punto').numeros).toEqual([1, 2, 3])
    const rengComa = rengLeerNumeros('1,2,3', 'coma')
    expect(rengComa.numeros).toEqual([])
    expect(rengComa.invalidos).toEqual([{ texto: '1,2,3', posicion: 1 }])
    expect(rengLeerNumeros('1,5 2,25; 3', 'coma').numeros).toEqual([1.5, 2.25, 3])
    expect(rengLeerNumeros('1.5', 'coma').totalInvalidos).toBe(1)
  })
  it('«1 dos 3»: «dos» se informa con su posición', () => {
    const rengL = rengLeerNumeros('1 dos 3')
    expect(rengL.numeros).toEqual([1, 3])
    expect(rengL.invalidos).toEqual([{ texto: 'dos', posicion: 2 }])
    expect(rengL.totalInvalidos).toBe(1)
    expect(rengLeerNumeros('−2 1e3 .5').numeros).toEqual([-2, 1000, 0.5])
    expect(rengLeerNumeros('Infinity NaN 0x10').totalInvalidos).toBe(3)
  })
  it('serie constante: varianza 0, histograma de una clase; regresión con y constante: r indeterminado', () => {
    const rengD = rengDescriptiva([4, 4, 4, 4])
    expect(rengD.varianzaMuestral).toBe(0)
    expect(rengD.desvPoblacional).toBe(0)
    expect(rengD.indeterminadas).toEqual({})
    expect(rengHistograma([4, 4, 4, 4])).toEqual([{ desde: 4, hasta: 4, cuenta: 4 }])
    const rengR = rengRegresionLineal([1, 2, 3], [5, 5, 5])
    expect(rengR.pendiente).toBe(0)
    expect(rengR.intercepto).toBe(5)
    expect(rengR.r).toBeNaN()
    expect(rengR.indeterminado).toMatch(/r y R² no están definidos/)
    expect(rengRegresionLineal([1, 2, 3], [3, 5, 7]).indeterminado).toBeNull()
  })
  it('un solo dato: la dispersión muestral queda indeterminada con su motivo', () => {
    const rengD = rengDescriptiva([7])
    expect(rengD.varianzaMuestral).toBeNaN()
    expect(rengD.indeterminadas.desvMuestral).toMatch(/n − 1 = 0/)
  })
  it('series grandes (300 000 valores distintos) sin agotar la pila', () => {
    const rengDatos = Array.from({ length: 300_000 }, (_, rengI) => rengI * 0.5)
    const rengD = rengDescriptiva(rengDatos)
    expect(rengD.n).toBe(300_000)
    expect(rengD.max).toBe(149_999.5)
    expect(rengHistograma(rengDatos).reduce((rengS, rengB) => rengS + rengB.cuenta, 0)).toBe(300_000)
    expect(rengLeerNumeros(rengDatos.join(' ')).numeros).toHaveLength(300_000)
  })
})
