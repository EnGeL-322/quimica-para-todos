import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ForceFieldMMFF94 } from 'openchemlib'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { rengDerivarTodos } from '../../src/renderer/modules/simulador-quimica/estado/derivados'
import { rengEstadoInicial } from '../../src/renderer/modules/simulador-quimica/estado/trabajo'
import { rengMesaVacia, type RengMesa } from '../../src/renderer/modules/simulador-quimica/nucleo/mesa'
import { rengAnadirSustanciaAMesa } from '../../src/renderer/modules/simulador-quimica/vista/anadirAMesa'
import { rengRegistrarGeometria, rengSinProcedencias, type RengProcedencias } from '../../src/renderer/modules/simulador-quimica/vista/procedencia'

afterEach(() => vi.restoreAllMocks())
const rengSinConverger = () => vi.spyOn(ForceFieldMMFF94.prototype, 'minimise').mockReturnValue(1)

const RENG_RUTA_TARJETA = '../../src/renderer/modules/simulador-quimica/vista/AnalisisMesa'
async function rengTarjeta(rengMesa: RengMesa, rengProcedencias: RengProcedencias): Promise<string> {
  const { RengAnalisisMesa } = (await import(/* @vite-ignore */ RENG_RUTA_TARJETA)) as { RengAnalisisMesa: (rengP: { estado: unknown }) => ReturnType<typeof createElement> }
  const rengEstado = { mesa: rengMesa, procedencias: rengProcedencias, analisis: rengDerivarTodos({ ...rengEstadoInicial(), mesa: rengMesa }), formaReal: () => undefined, completarH: () => undefined, optimizar: () => undefined }
  return renderToString(createElement(RengAnalisisMesa, { estado: rengEstado }))
}
const rengVeces = (rengHtml: string, rengTexto: string): number => rengHtml.split(rengTexto).length - 1
const RENG_CALCULADA = 'Geometría calculada (MMFF94)'

function rengAnadir(rengM: RengMesa, rengP: RengProcedencias, rengEntrada: string, rengCentro: [number, number, number], rengReemplazar = false): { mesa: RengMesa; p: RengProcedencias } {
  const rengR = rengAnadirSustanciaAMesa(rengM, rengEntrada, rengCentro, rengReemplazar)
  if (!rengR.ok) throw new Error(rengEntrada)
  return { mesa: rengR.mesa, p: rengR.origen ? rengRegistrarGeometria(rengP, rengR.mesa, rengR.ids, rengR.origen.origen) : rengP }
}

describe('tarjeta: la etiqueta de geometría corresponde a las coordenadas actuales', () => {
  it('convergida y luego reemplazada por una NO convergida: la tarjeta ya no dice «calculada» (con registro anterior)', async () => {
    let rengE = rengAnadir(rengMesaVacia(), rengSinProcedencias(), 'CCO', [0, 0, 0])
    expect(rengVeces(await rengTarjeta(rengE.mesa, rengE.p), RENG_CALCULADA)).toBe(1)
    rengSinConverger()
    rengE = rengAnadir(rengE.mesa, rengE.p, 'CCO', [0, 0, 0], true)
    expect(rengE.p.size).toBe(1)
    const rengHtml = await rengTarjeta(rengE.mesa, rengE.p)
    expect(rengVeces(rengHtml, RENG_CALCULADA)).toBe(0)
    expect(rengHtml).toMatch(/C2H6O|C₂H₆O|etanol/)
  })
  it('dos fragmentos C2H6O, uno convergido y otro no: una sola etiqueta «calculada»', async () => {
    let rengE = rengAnadir(rengMesaVacia(), rengSinProcedencias(), 'CCO', [0, 0, 0])
    rengSinConverger()
    rengE = rengAnadir(rengE.mesa, rengE.p, 'CCO', [7, 0, 0])
    expect(rengDerivarTodos({ ...rengEstadoInicial(), mesa: rengE.mesa }).map((rengF) => rengF.formula)).toEqual(['C2H6O', 'C2H6O'])
    expect(rengVeces(await rengTarjeta(rengE.mesa, rengE.p), RENG_CALCULADA)).toBe(1)
  })
  it('dos reemplazos convergidos con los mismos ids (CCO → COC): el estado anterior conserva su etiqueta', async () => {
    const rengE1 = rengAnadir(rengMesaVacia(), rengSinProcedencias(), 'CCO', [0, 0, 0], true)
    const rengE2 = rengAnadir(rengE1.mesa, rengE1.p, 'COC', [0, 0, 0], true)
    const rengDeshecho = await rengTarjeta(rengE1.mesa, rengE2.p)
    expect(rengDeshecho).toMatch(/etanol/)
    expect(rengVeces(rengDeshecho, RENG_CALCULADA)).toBe(1)
    const rengRehecho = await rengTarjeta(rengE2.mesa, rengE2.p)
    expect(rengVeces(rengRehecho, RENG_CALCULADA)).toBe(1)
  })
})
