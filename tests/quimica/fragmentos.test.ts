import { describe, expect, it } from 'vitest'
import { rengAnalizarFragmento } from '../../src/renderer/modules/simulador-quimica/nucleo/analisisMesa'
import { RENG_ESTANTERIA } from '../../src/renderer/modules/simulador-quimica/datos/estanteria'
import { rengFragmentoDe, RENG_MAX_ATOMOS_MESA } from '../../src/renderer/modules/simulador-quimica/nucleo/fragmentoSustancia'
import { rengAnadirFragmento, rengFragmentos, rengMesaVacia } from '../../src/renderer/modules/simulador-quimica/nucleo/mesa'
import { rengInterpretarSustancia } from '../../src/renderer/modules/simulador-quimica/nucleo/sustancia'

const rengEnMesa = (rengEntrada: string) => {
  const rengR = rengInterpretarSustancia(rengEntrada)
  if (rengR.tipo !== 'ok') throw new Error(rengEntrada)
  const rengF = rengFragmentoDe(rengR.sustancia)
  if (!rengF.ok) throw new Error(`${rengEntrada}: ${rengF.motivo}`)
  const rengM = rengAnadirFragmento(rengMesaVacia(), rengF.f.atomos, rengF.f.enlaces, [0, 0, 0]).mesa
  return { m: rengM, f: rengF.f, a: rengAnalizarFragmento(rengM, rengFragmentos(rengM)[0]!) }
}

describe('sustancia → fragmento de la mesa', () => {
  it('agua: geometría experimental, completa y con su nombre', () => {
    const { f: rengF, a: rengA } = rengEnMesa('H2O')
    expect(rengF.origen).toBe('experimental')
    expect(rengA).toMatchObject({ completa: true, nombre: 'agua' })
  })
  it('NaCl y CaF₂: iones monoatómicos unidos por enlaces iónicos y neutros', () => {
    const rengNacl = rengEnMesa('NaCl')
    expect(rengNacl.m.atomos.map((rengX) => rengX.carga).sort()).toEqual([-1, 1])
    expect(rengNacl.a).toMatchObject({ completa: true, ionico: true, nombre: 'cloruro de sodio' })
    const rengCaf2 = rengEnMesa('CaF2')
    expect(rengCaf2.m.atomos.reduce((rengS, rengX) => rengS + rengX.carga, 0)).toBe(0)
    expect(rengCaf2.m.enlaces.every((rengE) => rengE.tipo === 'ionico')).toBe(true)
  })
  it('etanol: geometría calculada (MMFF94) con 9 átomos', () => {
    const { f: rengF, a: rengA } = rengEnMesa('CH3CH2OH')
    expect(rengF.origen).toBe('calculada')
    expect(rengF.atomos).toHaveLength(9)
    expect(rengA.completa).toBe(true)
  })
  it('CaCO₃ se monta como unidad fórmula (Ca²⁺ y CO₃²⁻) y lo dice', () => {
    const rengR = rengInterpretarSustancia('CaCO3')
    if (rengR.tipo !== 'ok') throw new Error('CaCO3')
    const rengF = rengFragmentoDe(rengR.sustancia)
    expect(rengF.ok).toBe(true)
    if (rengF.ok) expect(rengF.f.nota).toMatch(/unidad fórmula/)
  })
  it('un ion cuya estructura la app no tiene (MnO₄⁻) no se inventa: se explica', () => {
    const rengR = rengInterpretarSustancia('KMnO4')
    expect(rengR.tipo).toBe('ok')
    if (rengR.tipo !== 'ok') return
    const rengF = rengFragmentoDe(rengR.sustancia)
    expect(rengF.ok).toBe(false)
    if (!rengF.ok) expect(rengF.motivo).toMatch(/no tiene la estructura/)
  })
  it('cada ficha de la estantería se puede soltar en la mesa (≤ 60 átomos)', () => {
    expect(RENG_ESTANTERIA.length).toBeGreaterThanOrEqual(10)
    for (const rengFicha of RENG_ESTANTERIA) {
      const { f: rengF } = rengEnMesa(rengFicha.entrada)
      expect(rengF.atomos.length, rengFicha.nombre).toBeLessThanOrEqual(RENG_MAX_ATOMOS_MESA)
    }
  }, 30_000)
  it('NaOH ([Na+].[OH-]): Na⁺ unido iónicamente al O⁻ del hidróxido', () => {
    const { m: rengM } = rengEnMesa('[Na+].[OH-]')
    expect(rengM.enlaces.some((rengE) => rengE.tipo === 'ionico')).toBe(true)
    expect(rengFragmentos(rengM)).toHaveLength(1)
  })
})
