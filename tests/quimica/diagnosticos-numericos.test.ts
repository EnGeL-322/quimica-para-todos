import { describe, expect, it } from 'vitest'
import { rengAnalizarEquilibrio, rengCociente, RengErrorEquilibrio, rengPerturbar, rengResolverEquilibrio, RENG_TOL_RESIDUO, type RengEspecieEq } from '../../src/renderer/modules/simulador-quimica/nucleo/equilibrio'
import { rengFragmentoDe } from '../../src/renderer/modules/simulador-quimica/nucleo/fragmentoSustancia'
import { rengDescribirOptimizacion, rengDesdeSmiles, rengGeometria3D, RENG_OPCIONES_MMFF } from '../../src/renderer/modules/simulador-quimica/nucleo/molecula'
import { rengSustanciaOError } from '../../src/renderer/modules/simulador-quimica/nucleo/sustancia'

describe('MMFF94s: se comprueba el código de retorno de minimise', () => {
  it('con las opciones normales, moléculas pequeñas convergen (código 0)', () => {
    for (const rengS of ['CCO', 'CC(=O)O', 'c1ccccc1', 'OCC(O)CO']) {
      const rengG = rengGeometria3D(rengS)
      expect(rengG.tiene3D, rengS).toBe(true)
      expect(rengG.optimizacion, rengS).toMatchObject({ metodo: 'MMFF94s', codigo: 0, convergio: true, maxIts: RENG_OPCIONES_MMFF.maxIts })
    }
  })
  it('si se agotan las iteraciones, hay coordenadas pero NO se declara convergida', () => {
    const rengG = rengGeometria3D('CCCCCCCCCCCCCCCC', 42, { maxIts: 5, gradTol: 1e-4 })
    expect(rengG.tiene3D).toBe(true)
    expect(rengG.optimizacion!.codigo).not.toBe(0)
    expect(rengG.optimizacion!.convergio).toBe(false)
    expect(rengDescribirOptimizacion(rengG.optimizacion)).toMatch(/NO convergió/)
  })
  it('coordenadas, convergencia y origen son datos separados', () => {
    const rengPlano = rengDesdeSmiles('CCO')
    expect(rengPlano.tiene3D).toBe(false)
    expect(rengPlano.optimizacion).toBeNull()
    expect(rengDescribirOptimizacion(rengPlano.optimizacion)).toMatch(/sin minimizar/)
    expect(rengDescribirOptimizacion(rengGeometria3D('CCO').optimizacion)).toMatch(/calculada, no experimental/)
  })
  it('el fragmento de la mesa de una molécula convergida es «calculada»; el agua usa la experimental', () => {
    const rengEtanol = rengFragmentoDe(rengSustanciaOError('etanol'))
    expect(rengEtanol.ok && rengEtanol.f.origen).toBe('calculada')
    const rengAgua = rengFragmentoDe(rengSustanciaOError('H2O'))
    expect(rengAgua.ok && rengAgua.f.origen).toBe('experimental')
  })
  it('la semilla fija hace la geometría reproducible', () => {
    const rengA = rengGeometria3D('CC(=O)O')
    const rengB = rengGeometria3D('CC(=O)O')
    expect(rengA.atomos.map((rengX) => [rengX.x, rengX.y, rengX.z])).toEqual(rengB.atomos.map((rengX) => [rengX.x, rengX.y, rengX.z]))
  })
})

describe('equilibrio: sistemas vacíos e intervalos degenerados', () => {
  const RENG_AB = (rengA: number, rengB: number): RengEspecieEq[] => [
    { nombre: 'A', nu: -1, c0: rengA },
    { nombre: 'B', nu: 1, c0: rengB }
  ]
  it('A ⇌ B con ambas concentraciones 0 y K = 4: sistema vacío, sin Q ni sentido', () => {
    const rengR = rengAnalizarEquilibrio(RENG_AB(0, 0), 4)
    expect(rengR.tipo).toBe('indeterminado')
    expect(rengR.tipo === 'indeterminado' && rengR.codigo).toBe('sistema-vacio')
    expect(rengR).not.toHaveProperty('Q0')
    expect(rengR).not.toHaveProperty('sentido')
    expect(() => rengResolverEquilibrio(RENG_AB(0, 0), 4)).toThrow(RengErrorEquilibrio)
  })
  it('A + B ⇌ C con A = C = 0: no puede avanzar en ningún sentido (Q = 0/0)', () => {
    const rengEsp: RengEspecieEq[] = [
      { nombre: 'A', nu: -1, c0: 0 },
      { nombre: 'B', nu: -1, c0: 1 },
      { nombre: 'C', nu: 1, c0: 0 }
    ]
    const rengR = rengAnalizarEquilibrio(rengEsp, 10)
    expect(rengR.tipo === 'indeterminado' && rengR.codigo).toBe('sin-avance')
  })
  it('entradas no finitas o fuera de dominio se rechazan con motivo', () => {
    for (const [rengEsp, RENG_K] of [
      [RENG_AB(Number.NaN, 1), 4],
      [RENG_AB(1, Infinity), 4],
      [RENG_AB(-1, 1), 4],
      [RENG_AB(1, 1), Number.NaN],
      [RENG_AB(1, 1), Infinity],
      [RENG_AB(1, 1), 0],
      [[{ nombre: 'A', nu: Number.NaN, c0: 1 }, { nombre: 'B', nu: 1, c0: 1 }], 4]
    ] as Array<[RengEspecieEq[], number]>) {
      const rengR = rengAnalizarEquilibrio(rengEsp, RENG_K)
      expect(rengR.tipo === 'indeterminado' && rengR.codigo, JSON.stringify({ esp: rengEsp, K: RENG_K })).toBe('entrada-no-valida')
    }
  })
  it('perturbar un sistema vacío tampoco inventa un equilibrio', () => {
    expect(() => rengPerturbar(RENG_AB(0, 0), 4, 0, 0)).toThrow(/vacío/)
  })
})

describe('equilibrio: convergencia respaldada por el residuo', () => {
  it('A ⇌ B: solución analítica ξ = K·a/(1+K) con residuo < tolerancia', () => {
    const rengR = rengResolverEquilibrio([{ nombre: 'A', nu: -1, c0: 1 }, { nombre: 'B', nu: 1, c0: 0 }], 4)
    expect(rengR.xi).toBeCloseTo(0.8, 12)
    expect(rengR.convergio).toBe(true)
    expect(rengR.residuo).toBeLessThan(RENG_TOL_RESIDUO)
    expect(rengCociente([{ nombre: 'A', nu: -1, c0: 0 }, { nombre: 'B', nu: 1, c0: 0 }], rengR.c)).toBeCloseTo(4, 8)
  })
  it('solo con producto o solo con reactivo el sentido sigue siendo el correcto', () => {
    expect(rengResolverEquilibrio([{ nombre: 'A', nu: -1, c0: 0 }, { nombre: 'B', nu: 1, c0: 1 }], 4).sentido).toBe(-1)
    expect(rengResolverEquilibrio([{ nombre: 'A', nu: -1, c0: 1 }, { nombre: 'B', nu: 1, c0: 0 }], 4).sentido).toBe(1)
  })
  it('ya en equilibrio: sentido 0 y ξ ≈ 0', () => {
    const rengR = rengResolverEquilibrio([{ nombre: 'A', nu: -1, c0: 0.2 }, { nombre: 'B', nu: 1, c0: 0.8 }], 4)
    expect(rengR.sentido).toBe(0)
    expect(Math.abs(rengR.xi)).toBeLessThan(1e-12)
  })
  it('K extremas: o converge de verdad o lo declara (nunca un falso «convergido»)', () => {
    for (const RENG_K of [1e-300, 1e-30, 1e30, 1e300]) {
      const rengR = rengResolverEquilibrio([{ nombre: 'A', nu: -1, c0: 1 }, { nombre: 'B', nu: 1, c0: 0 }], RENG_K)
      const rengLnQ = Math.log(rengR.c[1]! / rengR.c[0]!)
      expect(rengR.convergio, `K=${RENG_K}`).toBe(Math.abs(rengLnQ - Math.log(RENG_K)) < RENG_TOL_RESIDUO)
      expect(rengR.c.every((rengX) => Number.isFinite(rengX) && rengX >= 0)).toBe(true)
    }
  })
  it('balance de materia: Σ concentraciones de A y B se conserva', () => {
    const rengR = rengResolverEquilibrio([{ nombre: 'A', nu: -1, c0: 0.7 }, { nombre: 'B', nu: 1, c0: 0.3 }], 9)
    expect(rengR.c[0]! + rengR.c[1]!).toBeCloseTo(1, 14)
  })
})
