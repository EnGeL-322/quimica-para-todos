import { describe, expect, it } from 'vitest'
import { rengDerivarActivo } from '../../src/renderer/modules/simulador-quimica/estado/derivados'
import { rengCompuestoDeFragmento } from '../../src/renderer/modules/simulador-quimica/estado/formulacionActiva'
import { rengNormalizar } from '../../src/renderer/modules/simulador-quimica/estado/trabajo'
import { rengAnadirAtomo, rengUnir } from '../../src/renderer/modules/simulador-quimica/nucleo/mesa'
import { rengInterpretarSustancia } from '../../src/renderer/modules/simulador-quimica/nucleo/sustancia'
import { rengCon, rengOxoacidoSencillo } from './ayudasMesa'

describe('defecto 7: fórmulas no reconocidas', () => {
  it('H2SeO4: existe (PubChem) pero no está en la lista; sugiere el análogo con S', () => {
    const rengR = rengInterpretarSustancia('H2SeO4')
    expect(rengR.tipo).toBe('error')
    if (rengR.tipo !== 'error') return
    expect(rengR.motivo).toMatch(/existe/)
    expect(rengR.motivo).toMatch(/PubChem/)
    expect(rengR.motivo).toMatch(/no está en la lista de la app/)
    expect(rengR.motivo).toMatch(/S \(azufre\)/)
    expect(rengR.sugerencias).toContain('H2SO4')
  })
  it('H2S2O4: no está en la lista y la app NO dice que no exista', () => {
    const rengR = rengInterpretarSustancia('H2S2O4')
    expect(rengR.tipo === 'error' && rengR.motivo).toMatch(/no está en la lista de la app/)
    expect(rengR.tipo === 'error' && rengR.motivo).not.toMatch(/no existe/)
  })
  it('una fórmula imposible por las reglas lo dice', () => {
    const rengR = rengInterpretarSustancia('NaCl3')
    expect(rengR.tipo === 'error' && rengR.motivo).toMatch(/Según las reglas de la app/)
  })
  it.each([
    ['co', ['CO', 'Co']],
    ['no', ['NO', 'No']],
    ['hf', ['HF', 'Hf']],
    ['sn', ['Sn']],
    ['h2so4', ['H2SO4']]
  ])('minúsculas «%s»: no adivina, ofrece %j', (rengT, rengLecturas) => {
    const rengR = rengInterpretarSustancia(rengT)
    expect(rengR.tipo).toBe('error')
    if (rengR.tipo !== 'error') return
    for (const rengL of rengLecturas) expect(rengR.sugerencias).toContain(rengL)
    expect(rengR.motivo).toMatch(/¿Querías decir/)
  })
  it('co: nombra las dos lecturas', () => {
    const rengR = rengInterpretarSustancia('co')
    expect(rengR.tipo === 'error' && rengR.motivo).toMatch(/CO \(monóxido de carbono\).*Co \(cobalto\)/)
  })
  it('sin romper lo que ya funcionaba: nombres y SMILES en minúsculas con anillo', () => {
    expect(rengInterpretarSustancia('agua').tipo).toBe('ok')
    expect(rengInterpretarSustancia('cobre').tipo).toBe('ok')
    const rengB = rengInterpretarSustancia('c1ccccc1')
    expect(rengB.tipo === 'ok' && rengB.sustancia.nombre).toBe('benceno')
  })
})

describe('defecto 8: Formulación nunca deja la zona en blanco', () => {
  it.each(['H2SO4', 'CH4', 'H2S2O4'])('%s: o hay compuesto, o un motivo útil', (rengT) => {
    const rengE = rengT === 'H2S2O4' ? (() => {
      let rengX = rengOxoacidoSencillo('S', 4, 2)
      const rengS2 = rengAnadirAtomo(rengX.mesa, 'S', [3, 3, 0])
      rengX = rengNormalizar({ ...rengX, mesa: rengUnir(rengS2.mesa, rengX.mesa.atomos[0]!.id, rengS2.id).mesa })
      return rengX
    })() : rengCon(rengT)
    const rengC = rengCompuestoDeFragmento(rengDerivarActivo(rengE)!)
    expect(rengC.k !== null || (rengC.motivo ?? '').length > 20, rengT).toBe(true)
  })
})
