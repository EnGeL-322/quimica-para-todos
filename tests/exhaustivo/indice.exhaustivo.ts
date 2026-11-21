import { describe, expect, it } from 'vitest'
import { rengIndiceSustancias } from '../../src/renderer/modules/simulador-quimica/nucleo/indiceSustancias'
import { rengInterpretarSustancia } from '../../src/renderer/modules/simulador-quimica/nucleo/sustancia'

describe('índice de sustancias (exhaustivo)', () => {
  it('cada entrada se puede abrir: su texto de entrada se interpreta', () => {
    const rengFallos = rengIndiceSustancias()
      .filter((rengE) => rengInterpretarSustancia(rengE.entrada).tipo === 'error')
      .map((rengE) => `${rengE.nombre} → ${rengE.entrada}`)
    expect(rengFallos).toEqual([])
  })
})
