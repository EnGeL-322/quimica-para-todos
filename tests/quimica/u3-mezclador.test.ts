import { describe, expect, it } from 'vitest'
import { rengEcuacionTexto, rengMezclar } from '../../src/renderer/modules/simulador-quimica/nucleo/mezclador'

const rengEq = (rengA: string, rengB: string): string => {
  const rengR = rengMezclar(rengA, rengB)
  if (rengR.tipo !== 'reaccion') throw new Error(`${rengA}+${rengB}: ${rengR.motivo}`)
  return rengEcuacionTexto(rengR.r).replace(/\s+/g, '')
}

describe('mezclador · neutralización por regla', () => {
  it('H2SO4 + NaOH → Na2SO4 + H2O ajustada (1, 2 → 1, 2)', () => {
    expect(rengEq('H2SO4', 'NaOH')).toBe('H2SO4+2NaOH->Na2SO4+2H2O')
  })
  it('no depende del orden de los reactivos', () => {
    expect(rengEq('NaOH', 'H2SO4')).toBe(rengEq('H2SO4', 'NaOH'))
  })
  it('HCl + NaOH → NaCl + H2O', () => {
    expect(rengEq('HCl', 'NaOH')).toBe('HCl+NaOH->NaCl+H2O')
  })
  it('HNO3 + Ca(OH)2 → Ca(NO3)2 + 2 H2O', () => {
    expect(rengEq('HNO3', 'Ca(OH)2')).toBe('2HNO3+Ca(OH)2->Ca(NO3)2+2H2O')
  })
  it('la regla se declara como regla educativa sin verificar, no como catálogo', () => {
    const rengR = rengMezclar('HNO3', 'Ca(OH)2')
    expect(rengR.tipo === 'reaccion' && rengR.r.origen).toBe('regla-educativa')
    expect(rengR.tipo === 'reaccion' && rengR.r.fuente).toMatch(/sin verificar/)
  })
})

describe('mezclador · catálogo y honestidad', () => {
  it('HCl + NaOH ya está en el catálogo (no se duplica como regla)', () => {
    const rengR = rengMezclar('HCl', 'NaOH')
    expect(rengR.tipo === 'reaccion' && rengR.r.origen).toBe('catalogo')
  })
  it('sodio + agua sale del catálogo', () => {
    const rengR = rengMezclar('Na', 'H2O')
    expect(rengR.tipo === 'reaccion' && rengR.r.origen).toBe('catalogo')
  })
  it('un gas noble no reacciona y se explica', () => {
    const rengR = rengMezclar('He', 'O2')
    expect(rengR.tipo).toBe('ninguna')
    expect(rengR.tipo === 'ninguna' && rengR.motivo).toMatch(/gas noble/)
  })
  it('una pareja sin datos no inventa productos ni afirma que sea imposible (Au + H2)', () => {
    const rengR = rengMezclar('Au', 'H2')
    expect(rengR.tipo).toBe('ninguna')
    expect(rengR.tipo === 'ninguna' && rengR.motivo).toMatch(/Sin datos o modelo para predecirla/)
  })
  it('lo vacío y lo repetido se explican', () => {
    expect(rengMezclar('', 'NaOH').tipo).toBe('ninguna')
    const rengR = rengMezclar('NaOH', 'NaOH')
    expect(rengR.tipo === 'ninguna' && rengR.motivo).toMatch(/misma sustancia/)
  })
})
