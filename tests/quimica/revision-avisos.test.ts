import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ForceFieldMMFF94 } from 'openchemlib'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { rengDerivarTodos } from '../../src/renderer/modules/simulador-quimica/estado/derivados'
import { rengEstadoInicial, type RengTrabajo } from '../../src/renderer/modules/simulador-quimica/estado/trabajo'
import { rengAnadirSustancia } from '../../src/renderer/modules/simulador-quimica/estado/acciones'
import { rengDescribirDesplazamiento, rengPerturbar, type RengEspecieEq } from '../../src/renderer/modules/simulador-quimica/nucleo/equilibrio'
import { rengIdentificadaDeFragmento } from '../../src/renderer/modules/simulador-quimica/nucleo/identidad'
import { rengMesaVacia } from '../../src/renderer/modules/simulador-quimica/nucleo/mesa'
import { rengMezclar, type RengResultadoMezcla as RengResultado } from '../../src/renderer/modules/simulador-quimica/nucleo/mezclador'
import { rengAnadirSustanciaAMesa } from '../../src/renderer/modules/simulador-quimica/vista/anadirAMesa'
import { rengPlanFormaReal, rengProgramarFormaReal } from '../../src/renderer/modules/simulador-quimica/vista/formaReal'

const rengSinConverger = () => vi.spyOn(ForceFieldMMFF94.prototype, 'minimise').mockReturnValue(1)
afterEach(() => vi.restoreAllMocks())

describe('hallazgo 6: el aviso de no convergencia MMFF94s llega a Explorar', () => {
  it('añadir etanol con MMFF94s no convergido: mensaje visible y sin origen «calculada»', () => {
    rengSinConverger()
    const rengR = rengAnadirSustanciaAMesa(rengMesaVacia(), 'etanol')
    expect(rengR.ok).toBe(true)
    if (!rengR.ok) return
    expect(rengR.mensaje?.texto).toMatch(/NO convergió/)
    expect(rengR.mensaje?.tipo).toBe('info')
    expect(rengR.origen).toBeNull()
  })
  it('con la configuración normal: sin aviso y origen «calculada»', () => {
    const rengR = rengAnadirSustanciaAMesa(rengMesaVacia(), 'etanol')
    expect(rengR.ok && rengR.mensaje).toBeNull()
    expect(rengR.ok && rengR.origen?.origen).toBe('calculada')
  })
  it('la geometría experimental (agua) no depende de MMFF94s', () => {
    rengSinConverger()
    const rengR = rengAnadirSustanciaAMesa(rengMesaVacia(), 'H2O')
    expect(rengR.ok && rengR.origen?.origen).toBe('experimental')
  })
})

describe('hallazgo 6: «forma real» (Optimizar / Completar) explica por qué no anima', () => {
  const rengMesaEtanol = () => {
    const rengR = rengAnadirSustanciaAMesa(rengMesaVacia(), 'CCO')
    if (!rengR.ok) throw new Error('no se pudo añadir')
    return rengR
  }
  it('sin convergencia: plan «aviso» con el motivo', () => {
    const { mesa: rengMesa, ids: rengIds } = rengMesaEtanol()
    rengSinConverger()
    const rengP = rengPlanFormaReal(rengMesa, rengIds[0]!)
    expect(rengP.tipo).toBe('aviso')
    expect(rengP.tipo === 'aviso' && rengP.texto).toMatch(/No se muestra la forma real.*NO convergió/)
  })
  it('programarFormaReal entrega ese motivo al callback de aviso y no toca la mesa', () => {
    const { mesa: rengMesa, ids: rengIds } = rengMesaEtanol()
    rengSinConverger()
    const rengAviso = vi.fn()
    const rengAplicar = vi.fn()
    const rengT = { obtener: () => ({ ...rengEstadoInicial(), mesa: rengMesa }), aplicar: rengAplicar } as unknown as RengTrabajo
    rengProgramarFormaReal(rengT, rengMesa, rengIds[0]!, undefined, rengAviso)
    expect(rengAviso).toHaveBeenCalledTimes(1)
    expect(rengAviso.mock.calls[0]![0]).toMatch(/NO convergió/)
    expect(rengAplicar).not.toHaveBeenCalled()
  })
  it('con convergencia: plan «objetivo» calculado', () => {
    const { mesa: rengMesa, ids: rengIds } = rengMesaEtanol()
    const rengP = rengPlanFormaReal(rengMesa, rengIds[0]!)
    expect(rengP.tipo).toBe('objetivo')
    expect(rengP.tipo === 'objetivo' && rengP.origen).toBe('calculada')
  })
})

describe('hallazgo 7: equilibrio sin desplazamiento', () => {
  const RENG_HI: RengEspecieEq[] = [
    { nombre: 'H₂', nu: -1, c0: 1 },
    { nombre: 'I₂', nu: -1, c0: 1 },
    { nombre: 'HI', nu: 2, c0: 0 }
  ]
  const rengFmt = (rengV: number): string => String(Number(rengV.toPrecision(3)))
  it('preset H₂ + I₂ ⇌ 2 HI, K = 50, perturbación 0: resultado y explicación coinciden (ninguno)', () => {
    const { despues: rengDespues } = rengPerturbar(RENG_HI, 50, 0, 0)
    expect(rengDespues.sentido).toBe(0)
    expect(Math.abs(rengDespues.Q0 - 50)).toBeLessThan(1e-9)
    const rengT = rengDescribirDesplazamiento(rengDespues, 50, rengFmt)
    expect(rengT.resultado).toBe('ninguno: ya estaba en equilibrio')
    expect(rengT.explicacion).toMatch(/≈ K/)
    expect(rengT.explicacion).not.toMatch(/\S+ < K/)
    expect(rengT.explicacion).not.toMatch(/avanza hacia/)
  })
  it('añadir reactivo: hacia los productos en ambos textos; añadir producto: hacia los reactivos', () => {
    const rengMas = rengDescribirDesplazamiento(rengPerturbar(RENG_HI, 50, 0, 0.5).despues, 50, rengFmt)
    expect(rengMas.resultado).toMatch(/^hacia los productos/)
    expect(rengMas.explicacion).toMatch(/< K .*hacia los productos/)
    const rengProd = rengDescribirDesplazamiento(rengPerturbar(RENG_HI, 50, 2, 0.5).despues, 50, rengFmt)
    expect(rengProd.resultado).toMatch(/^hacia los reactivos/)
    expect(rengProd.explicacion).toMatch(/> K .*hacia los reactivos/)
  })
  it('para cualquier perturbación los dos textos dicen lo mismo', () => {
    for (const rengQuien of [0, 1, 2])
      for (const rengDelta of [-0.2, -1e-12, 0, 1e-12, 0.3, 2]) {
        let rengR
        try {
          rengR = rengPerturbar(RENG_HI, 50, rengQuien, rengDelta).despues
        } catch {
          continue
        }
        const rengT = rengDescribirDesplazamiento(rengR, 50, rengFmt)
        const rengEnResultado = rengT.resultado.startsWith('ninguno') ? 'ninguno' : rengT.resultado.includes('productos') ? 'productos' : 'reactivos'
        const rengEnExplicacion = rengT.explicacion.includes('no hay desplazamiento') ? 'ninguno' : rengT.explicacion.includes('hacia los productos') ? 'productos' : 'reactivos'
        expect(rengEnExplicacion, `quien=${rengQuien} delta=${rengDelta}`).toBe(rengEnResultado)
      }
  })
})

const RENG_RUTA_TARJETA = '../../src/renderer/modules/simulador-quimica/vista/ResultadoMezcla'
const rengTarjeta = async (rengRes: RengResultado): Promise<string> => {
  const { RengResultadoMezcla } = (await import(/* @vite-ignore */ RENG_RUTA_TARJETA)) as { RengResultadoMezcla: (rengP: { res: RengResultado }) => ReturnType<typeof createElement> }
  return renderToString(createElement(RengResultadoMezcla, { res: rengRes }))
}

describe('mensaje visible del mezclador (renderizado de la tarjeta)', () => {
  it('Na⁺ + H₂O desde la mesa muestra «Sin datos o modelo», no «Sodio con agua»', async () => {
    let rengE = rengEstadoInicial()
    for (const rengT of ['[Na+]', 'H2O']) {
      const rengR = rengAnadirSustancia(rengE, rengT)
      if (!rengR.ok) throw new Error(rengT)
      rengE = rengR.estado
    }
    const [rengA, rengB] = rengDerivarTodos(rengE).map(rengIdentificadaDeFragmento)
    const rengHtml = await rengTarjeta(rengMezclar(rengA!, rengB!))
    expect(rengHtml).toMatch(/Sin datos o modelo para predecirla/)
    expect(rengHtml).not.toMatch(/Sodio con agua/)
  })
  it('ácido acético + [Na+].[OH-] muestra la reacción del catálogo con «Referencia anotada, sin consultar»', async () => {
    const rengHtml = await rengTarjeta(rengMezclar('CC(=O)O', '[Na+].[OH-]'))
    expect(rengHtml).toMatch(/Neutralización del ácido acético/)
    expect(rengHtml).toMatch(/Referencia anotada, sin consultar/)
  })
})
