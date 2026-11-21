import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ForceFieldMMFF94 } from 'openchemlib'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { rengCrearTrabajo } from '../../src/renderer/modules/simulador-quimica/estado/trabajo'
import { rengDerivarTodos } from '../../src/renderer/modules/simulador-quimica/estado/derivados'
import { rengMesaVacia, rengMoverAtomos } from '../../src/renderer/modules/simulador-quimica/nucleo/mesa'
import { rengAnadirSustanciaAMesa } from '../../src/renderer/modules/simulador-quimica/vista/anadirAMesa'
import { rengOrigenGeometria, rengRegistrarGeometria, rengSinProcedencias } from '../../src/renderer/modules/simulador-quimica/vista/procedencia'
import { useRengMesa } from '../../src/renderer/modules/simulador-quimica/vista/useMesa'

const rengR = vi.hoisted(() => ({ slots: [] as unknown[], i: 0 }))
vi.mock('react', async (rengOriginal) => ({
  ...(await rengOriginal<typeof import('react')>()),
  useState: <RengT,>(rengInicial: RengT | (() => RengT)) => {
    const rengK = rengR.i++
    if (!(rengK in rengR.slots)) rengR.slots[rengK] = typeof rengInicial === 'function' ? (rengInicial as () => RengT)() : rengInicial
    return [rengR.slots[rengK] as RengT, (rengV: RengT | ((rengX: RengT) => RengT)) => void (rengR.slots[rengK] = typeof rengV === 'function' ? (rengV as (rengX: RengT) => RengT)(rengR.slots[rengK] as RengT) : rengV)]
  },
  useCallback: <RengF,>(rengF: RengF) => rengF,
  useMemo: <RengT,>(rengF: () => RengT) => rengF(),
  useSyncExternalStore: <RengT,>(_rengS: unknown, rengObtener: () => RengT) => rengObtener()
}))

const rengSinConverger = () => vi.spyOn(ForceFieldMMFF94.prototype, 'minimise').mockReturnValue(1)
beforeEach(() => {
  rengR.slots = []
  rengR.i = 0
})
afterEach(() => vi.restoreAllMocks())

const rengMontar = () => {
  const rengT = rengCrearTrabajo()
  const rengRender = () => {
    rengR.i = 0
    return useRengMesa(rengT)
  }
  return { t: rengT, render: rengRender }
}
const rengTarjetas = (rengH: ReturnType<ReturnType<typeof rengMontar>['render']>) =>
  rengH.analisis.map((rengA) => ({ formula: rengA.formula, ids: rengA.ids, origen: rengOrigenGeometria(rengH.procedencias, rengH.mesa, rengA.ids) }))

describe('procedencia.ts (puro)', () => {
  it('vale para esos átomos y sus distancias; resiste traslaciones; no se aplica a otros átomos', () => {
    const rengA = rengAnadirSustanciaAMesa(rengMesaVacia(), 'CCO')
    if (!rengA.ok) throw new Error('etanol')
    let rengP = rengRegistrarGeometria(rengSinProcedencias(), rengA.mesa, rengA.ids, 'calculada')
    expect(rengOrigenGeometria(rengP, rengA.mesa, rengA.ids)).toBe('calculada')
    const rengMovida = rengMoverAtomos(rengA.mesa, new Set(rengA.ids), [5, -1, 2])
    expect(rengOrigenGeometria(rengP, rengMovida, rengA.ids)).toBe('calculada')
    const rengDeformada = rengMoverAtomos(rengA.mesa, new Set([rengA.ids[0]!]), [0.3, 0, 0])
    expect(rengOrigenGeometria(rengP, rengDeformada, rengA.ids)).toBeNull()
    expect(rengOrigenGeometria(rengP, rengA.mesa, rengA.ids.slice(1))).toBeNull()
    const rengOtra = rengAnadirSustanciaAMesa(rengMesaVacia(), 'COC')
    if (!rengOtra.ok) throw new Error('éter')
    expect(rengOtra.ids).toEqual(rengA.ids)
    expect(rengOrigenGeometria(rengP, rengOtra.mesa, rengOtra.ids)).toBeNull()
    const rengCambiada = { ...rengA.mesa, atomos: rengA.mesa.atomos.map((rengX) => (rengX.el === 'O' ? { ...rengX, el: 'S' } : rengX)) }
    expect(rengOrigenGeometria(rengP, rengCambiada, rengA.ids)).toBeNull()
    rengP = rengRegistrarGeometria(rengP, rengOtra.mesa, rengOtra.ids, 'calculada')
    expect(rengOrigenGeometria(rengP, rengOtra.mesa, rengOtra.ids)).toBe('calculada')
  })
})

describe('procedencia.ts: versiones para unos mismos ids', () => {
  it('CCO y COC con los ids 1…9: cada geometría conserva su versión; re-registrar las mismas coordenadas solo cambia esa', () => {
    const rengEtanol = rengAnadirSustanciaAMesa(rengMesaVacia(), 'CCO', [0, 0, 0], true)
    const rengEter = rengAnadirSustanciaAMesa(rengMesaVacia(), 'COC', [0, 0, 0], true)
    if (!rengEtanol.ok || !rengEter.ok) throw new Error('sustancias')
    expect(rengEter.ids).toEqual(rengEtanol.ids)
    let rengP = rengRegistrarGeometria(rengSinProcedencias(), rengEtanol.mesa, rengEtanol.ids, 'calculada')
    rengP = rengRegistrarGeometria(rengP, rengEter.mesa, rengEter.ids, 'calculada')
    expect(rengP.size).toBe(1)
    expect(rengP.get(rengEtanol.ids.join(','))).toHaveLength(2)
    expect(rengOrigenGeometria(rengP, rengEtanol.mesa, rengEtanol.ids)).toBe('calculada')
    expect(rengOrigenGeometria(rengP, rengEter.mesa, rengEter.ids)).toBe('calculada')
    rengP = rengRegistrarGeometria(rengP, rengEtanol.mesa, rengEtanol.ids, 'experimental')
    expect(rengP.get(rengEtanol.ids.join(','))).toHaveLength(2)
    expect(rengOrigenGeometria(rengP, rengEtanol.mesa, rengEtanol.ids)).toBe('experimental')
    expect(rengOrigenGeometria(rengP, rengEter.mesa, rengEter.ids)).toBe('calculada')
  })
})

describe('useMesa: procedencia al reemplazar y con fórmulas repetidas', () => {
  it('convergida → reemplazo NO convergido: aviso visible y SIN etiqueta de geometría calculada', () => {
    const { render: rengRender } = rengMontar()
    rengRender().anadirSustancia('CCO')
    let rengH = rengRender()
    expect(rengTarjetas(rengH)).toEqual([expect.objectContaining({ formula: 'C2H6O', origen: 'calculada' })])
    const rengPrevio = rengH.procedencias.size
    expect(rengPrevio).toBe(1)
    rengSinConverger()
    rengH.anadirSustancia('CCO', [0, 0, 0], true)
    rengH = rengRender()
    expect(rengH.mensaje?.texto).toMatch(/NO convergió/)
    expect(rengTarjetas(rengH)).toEqual([expect.objectContaining({ formula: 'C2H6O', origen: null })])
  })
  it('dos fragmentos con la misma fórmula y distinto origen se distinguen', () => {
    const { render: rengRender } = rengMontar()
    rengRender().anadirSustancia('CCO', [0, 0, 0])
    const rengEspia = rengSinConverger()
    rengRender().anadirSustancia('CCO', [6, 0, 0])
    rengEspia.mockRestore()
    const rengH = rengRender()
    const rengT = rengTarjetas(rengH)
    expect(rengT.map((rengX) => rengX.formula)).toEqual(['C2H6O', 'C2H6O'])
    expect(rengT.map((rengX) => rengX.origen).sort()).toEqual(['calculada', null])
  })
  it('deshacer el reemplazo devuelve las coordenadas convergidas y su etiqueta; rehacer la quita', () => {
    const { t: rengT, render: rengRender } = rengMontar()
    rengRender().anadirSustancia('CCO')
    rengSinConverger()
    rengRender().anadirSustancia('CCO', [0, 0, 0], true)
    vi.restoreAllMocks()
    let rengH = rengRender()
    rengH.deshacer()
    rengH = rengRender()
    expect(rengTarjetas(rengH).map((rengX) => rengX.origen)).toEqual(['calculada'])
    rengH.rehacer()
    rengH = rengRender()
    expect(rengTarjetas(rengH).map((rengX) => rengX.origen)).toEqual([null])
    expect(rengDerivarTodos(rengT.obtener())).toHaveLength(1)
  })
  it('la geometría experimental (agua) sigue etiquetada; una sustancia sin procedencia no hereda la de otra', () => {
    const { render: rengRender } = rengMontar()
    rengRender().anadirSustancia('H2O', [0, 0, 0])
    rengSinConverger()
    rengRender().anadirSustancia('CCO', [6, 0, 0])
    const rengH = rengRender()
    const rengT = rengTarjetas(rengH)
    expect(rengT.find((rengX) => rengX.formula === 'H2O')!.origen).toBe('experimental')
    expect(rengT.find((rengX) => rengX.formula === 'C2H6O')!.origen).toBeNull()
  })
  it('dos reemplazos CONVERGIDOS que reutilizan ids (CCO → COC): deshacer y rehacer conservan la etiqueta de cada uno', async () => {
    const { render: rengRender } = rengMontar()
    rengRender().anadirSustancia('CCO', [0, 0, 0], true)
    let rengH = rengRender()
    const rengIdsEtanol = rengH.analisis[0]!.ids
    expect(rengTarjetas(rengH)).toEqual([expect.objectContaining({ formula: 'C2H6O', origen: 'calculada' })])
    rengH.anadirSustancia('COC', [0, 0, 0], true)
    rengH = rengRender()
    expect(rengH.analisis[0]!.ids).toEqual(rengIdsEtanol)
    expect(rengTarjetas(rengH)).toEqual([expect.objectContaining({ formula: 'C2H6O', origen: 'calculada' })])
    expect(rengVeces(await rengTarjetaHtml(rengH), RENG_CALCULADA)).toBe(1)
    rengH.deshacer()
    rengH = rengRender()
    expect(rengH.analisis[0]!.nombre).toBe('etanol')
    expect(rengTarjetas(rengH)[0]!.origen).toBe('calculada')
    expect(rengVeces(await rengTarjetaHtml(rengH), RENG_CALCULADA)).toBe(1)
    rengH.rehacer()
    rengH = rengRender()
    expect(rengH.analisis[0]!.nombre).not.toBe('etanol')
    expect(rengTarjetas(rengH)[0]!.origen).toBe('calculada')
    expect(rengVeces(await rengTarjetaHtml(rengH), RENG_CALCULADA)).toBe(1)
    rengH.deshacer()
    rengH = rengRender()
    expect(rengVeces(await rengTarjetaHtml(rengH), RENG_CALCULADA)).toBe(1)
  })
})

const RENG_RUTA_TARJETA = '../../src/renderer/modules/simulador-quimica/vista/AnalisisMesa'
const RENG_CALCULADA = 'Geometría calculada (MMFF94)'
const rengVeces = (rengHtml: string, rengTexto: string): number => rengHtml.split(rengTexto).length - 1
async function rengTarjetaHtml(rengEstado: unknown): Promise<string> {
  const { RengAnalisisMesa } = (await import(/* @vite-ignore */ RENG_RUTA_TARJETA)) as { RengAnalisisMesa: (rengP: { estado: unknown }) => ReturnType<typeof createElement> }
  return renderToString(createElement(RengAnalisisMesa, { estado: rengEstado }))
}
