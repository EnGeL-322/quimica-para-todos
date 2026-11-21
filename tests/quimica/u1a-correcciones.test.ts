import { describe, expect, it } from 'vitest'
import { rengCambiarSubindice, rengReemplazarActivo, rengSeleccionarGrupo } from '../../src/renderer/modules/simulador-quimica/estado/acciones'
import { rengAgruparEnlaces, rengAgruparFaltan } from '../../src/renderer/modules/simulador-quimica/estado/agrupar'
import { rengDerivarActivo, rengExplicarIncompleto } from '../../src/renderer/modules/simulador-quimica/estado/derivados'
import { rengAplicable, rengCompuestoDeFragmento } from '../../src/renderer/modules/simulador-quimica/estado/formulacionActiva'
import { rengCrearTrabajo, rengEstadoInicial, rengNormalizar, type RengEstadoTrabajo } from '../../src/renderer/modules/simulador-quimica/estado/trabajo'
import { rengPropuestasValencia } from '../../src/renderer/modules/simulador-quimica/nucleo/completarValencias'
import { rengAnalizarFormula } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { rengPasosFormulacion } from '../../src/renderer/modules/simulador-quimica/nucleo/formulacion'
import { rengAnadirAtomo, rengAtomo, rengUnir, type RengMesa } from '../../src/renderer/modules/simulador-quimica/nucleo/mesa'
import { rengEstadosOxidacion } from '../../src/renderer/modules/simulador-quimica/nucleo/oxidacion'
import { rengFichaVisible } from '../../src/renderer/modules/simulador-quimica/vista/fichaElemento'
import { rengCon, rengOxoacidoSencillo } from './ayudasMesa'

const rengOx = (rengE: RengEstadoTrabajo): Record<string, number[]> => {
  const rengOut: Record<string, number[]> = {}
  for (const rengX of rengDerivarActivo(rengE)!.oxidacion) rengOut[rengX.el] = [...new Set([...(rengOut[rengX.el] ?? []), rengX.ox])].sort()
  return rengOut
}
const rengAplicarPropuesta = (rengE: RengEstadoTrabajo, rengId: string): RengEstadoTrabajo => {
  const rengD = rengDerivarActivo(rengE)!
  const rengP = rengPropuestasValencia(rengE.mesa, rengD.ids).find((rengX) => rengX.id === rengId)
  if (!rengP) throw new Error(`sin propuesta ${rengId}`)
  return { ...rengE, mesa: rengP.mesa }
}

describe('defecto 1: H2SO4 en Formulación con la mesa incompleta', () => {
  const rengE = rengOxoacidoSencillo('S', 4, 2)
  it('escribir la misma fórmula que la del fragmento incompleto SÍ se puede aplicar', () => {
    expect(rengAplicable('H2SO4', 'H2SO4', false)).toBe(true)
    expect(rengAplicable('H2SO4', 'H2SO4', true)).toBe(false)
    expect(rengAplicable('  ', 'H2SO4', false)).toBe(false)
  })
  it('se nombra por la fórmula (sistemático, tradicional) y «¿Cómo se formula?» tiene pasos', () => {
    const rengC = rengCompuestoDeFragmento(rengDerivarActivo(rengE)!)
    expect(rengC.origen).toBe('formula')
    expect(rengC.k?.nombres.tradicional).toBe('ácido sulfúrico')
    expect(rengC.k?.nombres.sistematica).toBeTruthy()
    expect(rengPasosFormulacion(rengC.k!).length).toBeGreaterThan(1)
  })
  it('el aviso de un subíndice dice que la fórmula es la que QUEDARÍA, no la escrita', () => {
    const rengR = rengCambiarSubindice(rengE, 'S', 1)
    expect(rengR.ok).toBe(false)
    if (!rengR.ok && 'error' in rengR) expect(rengR.error).toMatch(/^Con un S más quedaría H2S2O4/)
  })
  it('reemplazar por «H2SO4» da ácido sulfúrico completo', () => {
    const rengR = rengReemplazarActivo(rengE, 'H2SO4')
    expect(rengR.ok && rengDerivarActivo(rengR.estado)!.nombre).toBe('ácido sulfúrico')
  })
})

describe('defecto 2: números de oxidación', () => {
  it('H2SO4 incompleto: por la fórmula, S +6, O −2, H +1 (nunca S +4 ni O −1)', () => {
    const rengE = rengOxoacidoSencillo('S', 4, 2)
    expect(rengOx(rengE)).toEqual({ S: [6], O: [-2], H: [1] })
    expect(rengDerivarActivo(rengE)!.oxidacionOrigen).toBe('formula')
  })
  it.each([
    ['H2SO4', { S: [6], O: [-2], H: [1] }],
    ['HNO3', { N: [5], O: [-2], H: [1] }],
    ['H2O2', { O: [-1], H: [1] }]
  ])('%s construido: por los enlaces', (rengT, rengEsperado) => {
    const rengE = rengCon(rengT)
    expect(rengDerivarActivo(rengE)!.completa).toBe(true)
    expect(rengDerivarActivo(rengE)!.oxidacionOrigen).toBe('enlaces')
    expect(rengOx(rengE)).toEqual(rengEsperado)
  })
  it('Na2O2 construido (iónico, con O–O): Na +1, O −1', () => {
    expect(rengOx(rengCon('Na2O2'))).toEqual({ Na: [1], O: [-1] })
  })
  it('OF2 armado a mano (F–O–F): O +2 por los enlaces (la app aún no lo monta desde la fórmula)', () => {
    let rengM: RengMesa = rengEstadoInicial().mesa
    const rengO = rengAnadirAtomo(rengM, 'O', [0, 0, 0])
    const rengF1 = rengAnadirAtomo(rengO.mesa, 'F', [1.4, 0, 0])
    const rengF2 = rengAnadirAtomo(rengF1.mesa, 'F', [-1.4, 0, 0])
    rengM = rengUnir(rengUnir(rengF2.mesa, rengO.id, rengF1.id).mesa, rengO.id, rengF2.id).mesa
    const rengE = rengNormalizar({ ...rengEstadoInicial(), mesa: rengM })
    expect(rengDerivarActivo(rengE)!.completa).toBe(true)
    expect(rengOx(rengE)).toEqual({ O: [2], F: [-1] })
  })
  it.each([
    ['H2SO4', { S: 6, O: -2, H: 1 }],
    ['H2SeO4', { Se: 6, O: -2, H: 1 }],
    ['H2O2', { O: -1, H: 1 }],
    ['Na2O2', { O: -1, Na: 1 }],
    ['OF2', { O: 2, F: -1 }],
    ['HNO3', { N: 5, O: -2, H: 1 }],
    ['KMnO4', { K: 1, Mn: 7, O: -2 }]
  ])('%s por la fórmula (reglas IUPAC)', (rengT, rengEsperado) => {
    expect(Object.fromEntries(rengEstadosOxidacion(rengAnalizarFormula(rengT))!)).toEqual(rengEsperado)
  })
  it('H2SeO4 por la estructura (2 Se=O): Se +6', () => {
    expect(rengOx(rengAplicarPropuesta(rengOxoacidoSencillo('Se', 4, 2), 'multiples'))).toEqual({ Se: [6], O: [-2], H: [1] })
  })
  it('O −1 solo si hay un enlace O–O', () => {
    for (const rengT of ['H2SO4', 'HNO3', 'H3PO4', 'H2O2', 'Na2O2', 'NaOH', 'CaCO3', 'CH3COOH', 'H2O', 'CO2', 'O2']) {
      const rengE = rengCon(rengT)
      const rengD = rengDerivarActivo(rengE)!
      const rengOo = rengE.mesa.enlaces.some((rengX) => rengAtomo(rengE.mesa, rengX.a)!.el === 'O' && rengAtomo(rengE.mesa, rengX.b)!.el === 'O')
      if (rengD.oxidacion.some((rengX) => rengX.el === 'O' && rengX.ox === -1)) expect(rengOo, rengT).toBe(true)
    }
  })
})

describe('defecto 3: Completar valencias', () => {
  const rengE = rengOxoacidoSencillo('S', 4, 2)
  const rengPs = rengPropuestasValencia(rengE.mesa, rengDerivarActivo(rengE)!.ids)
  it('dos propuestas: dos S=O (octeto expandido) y con cargas formales', () => {
    expect(rengPs.map((rengP) => rengP.id)).toEqual(['multiples', 'cargas'])
    expect(rengPs[0]!.nota).toMatch(/octeto expandido/)
    expect(rengPs[1]!.nota).toMatch(/cargas? formal/)
  })
  it.each(['multiples', 'cargas'])('%s → completo, «ácido sulfúrico», S +6', (rengId) => {
    const rengE2 = rengAplicarPropuesta(rengE, rengId)
    const rengD = rengDerivarActivo(rengE2)!
    expect(rengD.completa).toBe(true)
    expect(rengD.nombre).toBe('ácido sulfúrico')
    expect(rengOx(rengE2)).toEqual({ S: [6], O: [-2], H: [1] })
  })
  it('la de enlaces múltiples tiene exactamente dos S=O; la de cargas, S +2 y dos O −1', () => {
    expect(rengPs[0]!.mesa.enlaces.filter((rengX) => rengX.orden === 2)).toHaveLength(2)
    const rengCargas = rengPs[1]!.mesa.atomos.filter((rengA) => rengA.carga !== 0).map((rengA) => `${rengA.el}${rengA.carga}`).sort()
    expect(rengCargas).toEqual(['O-1', 'O-1', 'S2'])
  })
  it('se aplica con deshacer', () => {
    const rengT = rengCrearTrabajo(rengE)
    rengT.aplicar((rengX) => ({ ...rengX, mesa: rengPs[0]!.mesa }))
    expect(rengDerivarActivo(rengT.obtener())!.completa).toBe(true)
    rengT.deshacer()
    expect(rengT.obtener().mesa).toBe(rengE.mesa)
  })
  it('HNO3 armado con sencillos: el N no admite octeto expandido; solo la de cargas (N⁺, un N=O, un O⁻)', () => {
    const rengN = rengOxoacidoSencillo('N', 3, 1)
    const rengP = rengPropuestasValencia(rengN.mesa, rengDerivarActivo(rengN)!.ids)
    expect(rengP.map((rengX) => rengX.id)).toEqual(['cargas'])
    const rengE2 = { ...rengN, mesa: rengP[0]!.mesa }
    expect(rengDerivarActivo(rengE2)!.nombre).toBe('ácido nítrico')
    expect(rengOx(rengE2)).toEqual({ N: [5], O: [-2], H: [1] })
  })
  it('un fragmento completo no tiene propuestas', () => {
    const rengC = rengCon('H2O')
    expect(rengPropuestasValencia(rengC.mesa, rengDerivarActivo(rengC)!.ids)).toEqual([])
  })
})

describe('defecto 4: mensajes de valencia agrupados', () => {
  it('«a 2 O les falta 1 enlace cada uno», sin repetir', () => {
    const rengD = rengDerivarActivo(rengOxoacidoSencillo('S', 4, 2))!
    const rengT = rengExplicarIncompleto(rengD)!
    expect(rengT).toMatch(/a 2 O les falta 1 enlace cada uno/)
    expect(rengT.match(/O/g)!.length).toBeLessThan(4)
  })
  it('singular y plural', () => {
    expect(rengAgruparFaltan([{ id: 1, el: 'O', libres: 1 }])).toBe('al O le falta 1 enlace')
    expect(rengAgruparFaltan([{ id: 1, el: 'C', libres: 2 }])).toBe('al C le faltan 2 enlaces')
    expect(rengAgruparFaltan([{ id: 1, el: 'C', libres: 2 }, { id: 2, el: 'C', libres: 2 }, { id: 3, el: 'O', libres: 1 }])).toBe('a 2 C les faltan 2 enlaces cada uno; al O le falta 1 enlace')
  })
})

describe('defecto 5: enlaces agrupados', () => {
  const rengE = rengOxoacidoSencillo('S', 4, 2)
  const rengG = rengAgruparEnlaces(rengDerivarActivo(rengE)!.enlaces)
  it('S–O ×4 y O–H ×2', () => {
    expect(rengG.map((rengX) => `${rengX.etiqueta}×${rengX.n}`)).toEqual(['S–O×4', 'O–H×2'])
  })
  it('elegir un grupo resalta todos sus átomos', () => {
    const rengSo = rengG.find((rengX) => rengX.etiqueta === 'S–O')!
    const rengE2 = rengSeleccionarGrupo(rengE, rengSo.pares)
    expect(new Set(rengE2.seleccion.atomos).size).toBe(5)
    expect(rengE2.seleccion.enlace).toEqual(rengSo.pares[0])
  })
})

describe('defecto 6: la ficha del elemento muestra lo de bajo el cursor o lo enfocado, o nada', () => {
  it('sin cursor ni foco → nada (no se queda el último, «Cesio»)', () => {
    expect(rengFichaVisible({ sobre: null, foco: null })).toBeNull()
    expect(rengFichaVisible({ sobre: 'S', foco: 'Cs' })).toBe('S')
    expect(rengFichaVisible({ sobre: null, foco: 'S' })).toBe('S')
  })
})

