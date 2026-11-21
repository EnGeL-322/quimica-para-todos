import { describe, expect, it } from 'vitest'
import { RENG_BIBLIOTECA } from '../src/renderer/modules/simulador-quimica/datos/biblioteca'
import { rengBuscarSustancias, rengCoberturaSustancias, rengSustanciasRelacionadas, RENG_SUSTANCIAS } from '../src/renderer/modules/tabla-periodica/catalogoSustancias'
import { RENG_ELEMENTOS, rengMasaMolar } from '../src/renderer/modules/tabla-periodica/data'
import { RENG_FORMAS_PELIGRO, rengFormasDeElemento, RENG_PELIGROS, rengPeligroDeForma, rengRadioactividadDe, RENG_TIPO_PELIGRO } from '../src/renderer/modules/tabla-periodica/peligros'
import { rengPropiedadesAdicionales } from '../src/renderer/modules/tabla-periodica/propiedadesReferencia'

describe('cobertura y procedencia de la tabla de peligros', () => {
  it('los 118 elementos tienen una forma explícita y un estado reconocible', () => {
    expect(RENG_ELEMENTOS).toHaveLength(118)
    for (const { z: rengZ } of RENG_ELEMENTOS) {
      const rengFormas = rengFormasDeElemento(rengZ)
      expect(rengFormas.length).toBeGreaterThan(0)
      for (const rengForma of rengFormas) {
        expect(rengForma.z).toBe(rengZ)
        expect(RENG_PELIGROS[rengPeligroDeForma(rengForma)].nombre).toBeTruthy()
      }
    }
    expect(rengPeligroDeForma(rengFormasDeElemento(118)[0])).toBe('insuficiente')
    expect(rengPeligroDeForma(null)).toBe('insuficiente')
    expect(rengRadioactividadDe(118)).toBeTruthy()
    expect(rengRadioactividadDe(83)).toBeTruthy()
    expect(rengRadioactividadDe(8)).toBeUndefined()
  })

  it('cada forma de peligro tiene identidad, procedencia y alcance', () => {
    expect(new Set(RENG_FORMAS_PELIGRO.map((rengF) => rengF.id)).size).toBe(RENG_FORMAS_PELIGRO.length)
    const rengNombres = new Set(RENG_BIBLIOTECA.map((rengE) => rengE.nombre))
    for (const rengForma of RENG_FORMAS_PELIGRO) {
      expect(rengForma.formula).toBeTruthy()
      expect(rengForma.registros.length).toBeGreaterThan(0)
      if (rengForma.biblioteca) expect(rengNombres.has(rengForma.biblioteca)).toBe(true)
      if (rengForma.cas) expect(rengForma.cas).toMatch(/^\d{2,7}-\d{2}-\d$/)
      for (const { fuente: rengFuente, nivel: rengNivel, indicaciones: rengIndicaciones, pictogramas: rengPictogramas } of rengForma.registros) {
        expect(rengFuente.url).toMatch(/^https:\/\//)
        expect(rengFuente.organismo.trim()).not.toBe('')
        expect(rengFuente.alcance.trim()).not.toBe('')
        expect(rengFuente.consulta).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        if (rengNivel !== 'no-clasificado') expect(rengIndicaciones.length).toBeGreaterThan(0)
        expect(rengPictogramas?.every((rengP) => /^GHS0[1-9]$/.test(rengP)) ?? true).toBe(true)
        for (const rengI of rengIndicaciones) {
          expect(RENG_TIPO_PELIGRO[rengI.tipo]).toBeDefined()
          if (rengI.codigo) expect(rengI.codigo).toMatch(/^(?:EU)?H\d{3}[A-Za-z]*(?:\s*\+\s*H\d{3}[A-Za-z]*)*$/)
        }
      }
    }
  })

  it('incluye toda la biblioteca y contabiliza cada sustancia una vez', () => {
    for (const rengE of RENG_BIBLIOTECA) expect(RENG_SUSTANCIAS.some((rengS) => rengS.nombre === rengE.nombre)).toBe(true)
    expect(new Set(RENG_SUSTANCIAS.map((rengS) => rengS.id)).size).toBe(RENG_SUSTANCIAS.length)
    expect(RENG_SUSTANCIAS.filter((rengS) => !rengS.formula || rengS.elementos.length === 0).map((rengS) => rengS.nombre)).toEqual([])
    const rengC = rengCoberturaSustancias()
    expect(rengC.verificadas + rengC.parciales + rengC.pendientes).toBe(rengC.total)
    expect(rengC.verificadas).toBeGreaterThan(0)
    expect(rengC.parciales).toBeGreaterThan(0)
    expect(rengC.pendientes).toBeGreaterThan(0)
  })
})

describe('identidad, formas y búsquedas', () => {
  it('diferencia el cloro y el sodio metálico del cloruro de sodio', () => {
    const rengCloro = rengFormasDeElemento(17)[0]!
    const rengSodio = rengFormasDeElemento(11)[0]!
    const rengSal = rengBuscarSustancias('NaCl').find((rengS) => rengS.id === 'cloruro-de-sodio')!
    expect(rengPeligroDeForma(rengCloro)).toBe('peligro')
    expect(rengPeligroDeForma(rengSodio)).toBe('peligro')
    expect(rengSal.formas.map(rengPeligroDeForma)).toEqual(['no-clasificado', 'insuficiente'])
    expect(rengSustanciasRelacionadas('Cl')).toContain(rengSal)
    expect(rengSustanciasRelacionadas('Na')).toContain(rengSal)
    expect(rengBuscarSustancias('7782-50-5').some((rengS) => rengS.id === 'cloro')).toBe(true)
  })

  it('distingue oxígeno comprimido y ozono', () => {
    const rengFormas = rengFormasDeElemento(8)
    expect(rengFormas[0]?.formula).toBe('O2')
    expect(rengFormas.some((rengF) => rengF.formula === 'O3' && rengPeligroDeForma(rengF) === 'peligro')).toBe(true)
    expect(rengBuscarSustancias('O₃').map((rengS) => rengS.id)).toEqual(['ozono'])
  })

  it('limita cada ficha de HCl y de peróxido de hidrógeno a su forma documentada', () => {
    const rengCloruro = rengBuscarSustancias('HCl').find((rengS) => rengS.id === 'cloruro-de-hidrogeno')!
    expect(rengCloruro.formula).toBe('HCl')
    expect(rengPeligroDeForma(rengCloruro.formas.find((rengF) => rengF.id === 'hcl-anhidro'))).toBe('peligro')
    expect(rengPeligroDeForma(rengCloruro.formas.find((rengF) => rengF.id === 'hcl-01n'))).toBe('atencion')
    expect(rengPeligroDeForma(rengCloruro.formas.find((rengF) => rengF.id === 'hcl-acuoso-sin-concentracion'))).toBe('insuficiente')
    const rengPeroxido = rengBuscarSustancias('agua oxigenada').find((rengS) => rengS.id === 'peroxido-de-hidrogeno')!
    expect(rengPeroxido.formas.map(rengPeligroDeForma)).toContain('peligro')
    expect(rengPeligroDeForma(rengPeroxido.formas.find((rengF) => rengF.id === 'h2o2-sin-concentracion'))).toBe('insuficiente')
  })

  it('busca con alias, filtra por peligro y ofrece los isómeros de la fórmula sin asignarles la misma ficha', () => {
    expect(rengBuscarSustancias('sosa caustica')[0]?.id).toBe('hidroxido-de-sodio')
    expect(rengBuscarSustancias('acetona', 'inflamabilidad').map((rengS) => rengS.id)).toContain('acetona')
    expect(rengBuscarSustancias('acetona', 'oxidante')).toEqual([])
    const rengIsomeros = rengBuscarSustancias('C2H6O')
    expect(rengIsomeros.map((rengS) => rengS.id)).toEqual(expect.arrayContaining(['etanol', 'metoximetano']))
    expect(rengIsomeros.find((rengS) => rengS.id === 'etanol')?.formas[0]?.id).not.toBe(rengIsomeros.find((rengS) => rengS.id === 'metoximetano')?.formas[0]?.id)
  })

  it('mantiene la masa molar y permite consultar propiedades adicionales de referencia', () => {
    expect(rengMasaMolar('Ca(OH)2').total).toBeCloseTo(74.092, 2)
    expect(rengPropiedadesAdicionales(8)).toMatchObject({ electronegatividad: 3.44, fuente: 'https://pubchem.ncbi.nlm.nih.gov/element/8' })
    expect(rengPropiedadesAdicionales(2).electronegatividad).toBeUndefined()
  })
})
