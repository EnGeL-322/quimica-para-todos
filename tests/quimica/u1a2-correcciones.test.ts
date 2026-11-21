import { describe, expect, it } from 'vitest'
import { rengDerivarActivo } from '../../src/renderer/modules/simulador-quimica/estado/derivados'
import { rengComposicionConocida } from '../../src/renderer/modules/simulador-quimica/nucleo/analisisMesa'
import { rengNombrar } from '../../src/renderer/modules/simulador-quimica/nucleo/nomenclatura'
import { rengSemidesarrolladaASmiles, rengInterpretarSustancia } from '../../src/renderer/modules/simulador-quimica/nucleo/sustancia'
import { rengOxoacidoSencillo } from './ayudasMesa'

describe('U1a-2 · OF2 y el oxígeno positivo', () => {
  it('OF2 se nombra y figura como confirmado', () => {
    const rengC = rengNombrar('OF2')
    expect(rengC.nombres.principal).toBe('difluoruro de oxígeno')
    expect(rengC.existe?.estado).toBe('confirmado')
    const rengR = rengInterpretarSustancia('F2O')
    expect(rengR.tipo === 'ok' && rengR.sustancia.nombre).toBe('difluoruro de oxígeno')
  })
  it('el oxígeno solo es positivo con flúor: OCl2 sigue siendo el óxido de cloro', () => {
    expect(rengNombrar('OCl2').nombres.principal).toBe('monóxido de dicloro')
  })
  it('O2F2: el mensaje ya no afirma algo falso', () => {
    const rengR = rengInterpretarSustancia('O2F2')
    expect(rengR.tipo).toBe('error')
    if (rengR.tipo !== 'error') return
    expect(rengR.motivo).toMatch(/solo tiene número de oxidación positivo con flúor/)
    expect(rengR.motivo).toMatch(/no figura en la lista de la app/)
    expect(rengR.motivo).not.toMatch(/no forma compuestos/)
  })
})

describe('U1a-2 · nombres y «Completar con H»', () => {
  it('el nombre nunca es la fórmula de Hill (H2SeO4 y H2SO3 completos)', () => {
    for (const [rengC, rengNO, rengNH] of [['Se', 4, 2], ['S', 3, 2]] as const) {
      const rengE = rengOxoacidoSencillo(rengC, rengNO, rengNH)
      const rengD = rengDerivarActivo(rengE)!
      expect(rengD.nombre === null || !/^H2O\d(Se|S)$/.test(rengD.nombre)).toBe(true)
    }
  })
  it('composicionConocida: H2SO4 (7 átomos) sí; CH2 o un átomo suelto no', () => {
    expect(rengComposicionConocida('H2SO4', 7)).toBe(true)
    expect(rengComposicionConocida('CH2', 3)).toBe(false)
    expect(rengComposicionConocida('H2O', 1)).toBe(false)
  })
})

describe('U1a-2 · división de sustancia.ts', () => {
  it('semidesarrolladaASmiles sigue exportada con el mismo resultado', () => {
    expect(rengSemidesarrolladaASmiles('CH3CH2OH')).toBeTruthy()
    expect(rengSemidesarrolladaASmiles('CH3COOH')).toBeTruthy()
  })
})
