import { describe, expect, it } from 'vitest'
import { rengExistencia } from '../../src/renderer/modules/simulador-quimica/nucleo/compuestosConocidos'
import { rengBanco } from '../../src/renderer/modules/simulador-quimica/nucleo/ejerciciosFormulacion'
import { rengCatalogo, rengFormularDesdeNombre, rengInterpretar, rengNombrar } from '../../src/renderer/modules/simulador-quimica/nucleo/nomenclatura'

describe('a) óxidos neutros', () => {
  it.each([
    ['CO', 'monóxido de carbono', 'óxido de carbono(II)'],
    ['NO', 'monóxido de nitrógeno', 'óxido de nitrógeno(II)'],
    ['N2O', 'monóxido de dinitrógeno', 'óxido de nitrógeno(I)']
  ])('%s es óxido neutro, sin «anhídrido»', (rengF, rengSist, rengStock) => {
    const rengK = rengNombrar(rengF)
    expect(rengK.funcion).toBe('oxido-neutro')
    expect(rengK.nombres).toMatchObject({ sistematica: rengSist, stock: rengStock, tradicional: null })
    expect(rengK.nombres.notas.join(' ')).toMatch(/no es un «anhídrido»/)
    expect(rengFormularDesdeNombre(rengSist).formula).toBe(rengF)
  })
  it('CO₂ sigue siendo óxido ácido (anhídrido carbónico)', () => {
    expect(rengNombrar('CO2')).toMatchObject({ funcion: 'oxido-acido', nombres: { tradicional: 'anhídrido carbónico' } })
  })
})

describe('b) todo nombre mostrado se puede escribir de vuelta', () => {
  it('«bicarbonato de sodio», «bisulfato de potasio»…', () => {
    expect(rengFormularDesdeNombre('bicarbonato de sodio').formula).toBe('NaHCO3')
    expect(rengFormularDesdeNombre('Bicarbonato de Sodio').formula).toBe('NaHCO3')
    expect(rengFormularDesdeNombre('bisulfato de potasio').formula).toBe('KHSO4')
    expect(rengFormularDesdeNombre('bicarbonato de calcio').formula).toBe('Ca(HCO3)2')
    expect(rengNombrar('NaHCO3').nombres.comunes).toContain('bicarbonato de sodio')
  })
  it('ida y vuelta en TODO el catálogo (y los hidratos de la práctica)', () => {
    const rengFallos: string[] = []
    const rengComprobar = (rengFormula: string, rengNombres: Array<string | null>): void => {
      for (const rengN of rengNombres) {
        if (!rengN) continue
        try {
          const rengF = rengFormularDesdeNombre(rengN).formula
          if (rengF !== rengFormula) rengFallos.push(`«${rengN}» → ${rengF}, esperado ${rengFormula}`)
        } catch (rengE) {
          rengFallos.push(`«${rengN}» (${rengFormula}): ${(rengE as Error).message}`)
        }
      }
    }
    for (const rengK of rengCatalogo()) rengComprobar(rengK.formula, [rengK.nombres.sistematica, rengK.nombres.stock, rengK.nombres.tradicional, ...rengK.nombres.comunes, rengK.nombres.principal])
    for (const rengK of rengBanco()[3].filter((rengX) => rengX.agua > 0)) rengComprobar(rengK.formula, [rengK.nombres.sistematica, rengK.nombres.stock, rengK.nombres.tradicional, rengK.nombres.principal])
    expect(rengFallos).toEqual([])
    expect(rengCatalogo().length).toBeGreaterThan(1500)
  })
})

describe('c) existencia confirmada o solo formulada por reglas', () => {
  it.each([
    ['NaCl', 'confirmado'],
    ['Fe2(SO4)3', 'confirmado'],
    ['CuSO4·5H2O', 'confirmado'],
    ['Fe3O4', 'confirmado'],
    ['P2O5', 'confirmado'],
    ['HClO', 'disolucion'],
    ['H2CO3', 'disolucion'],
    ['Au2(SO4)3', 'no-confirmado'],
    ['Fe(ClO4)2', 'no-confirmado']
  ])('%s → %s', (rengF, rengEstado) => {
    expect(rengExistencia(rengF).estado).toBe(rengEstado)
    const rengK = rengInterpretar(rengF).compuesto
    expect(rengK.existe?.estado).toBe(rengEstado)
    if (rengEstado !== 'no-confirmado') expect(rengK.existe?.fuente?.trim()).toBeTruthy()
  })
  it('los iones sueltos no llevan etiqueta de existencia', () => {
    expect(rengInterpretar('SO4^2-').compuesto.existe).toBeNull()
  })
})
