import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { RENG_ELEMENTOS, type RengElemento } from '../src/renderer/modules/tabla-periodica/data'
import { rengFormasDeElemento, type RengFormaPeligro } from '../src/renderer/modules/tabla-periodica/peligros'

const RENG_RUTA_TABLA = '../src/renderer/modules/tabla-periodica/View'
const RENG_RUTA_FICHA = '../src/renderer/modules/tabla-periodica/FichaElemento'

async function rengRenderizarFicha(rengEl: RengElemento, rengForma: RengFormaPeligro | undefined): Promise<string> {
  const { RengFichaElemento } = (await import(/* @vite-ignore */ RENG_RUTA_FICHA)) as {
    RengFichaElemento: (rengProps: {
      el: RengElemento
      forma?: RengFormaPeligro
      formas: readonly RengFormaPeligro[]
      alElegirForma: () => void
      alAbrirSustancia: () => void
    }) => ReturnType<typeof createElement>
  }
  return renderToStaticMarkup(createElement(RengFichaElemento, {
    el: rengEl,
    forma: rengForma,
    formas: rengFormasDeElemento(rengEl.z),
    alElegirForma: () => undefined,
    alAbrirSustancia: () => undefined
  }))
}

describe('interfaz de la tabla periódica', () => {
  it('expone los 118 elementos, el modo de peligro y los tres destinos accesibles', async () => {
    const { default: RengTabla } = (await import(/* @vite-ignore */ RENG_RUTA_TABLA)) as { default: () => ReturnType<typeof createElement> }
    const rengHtml = renderToStaticMarkup(createElement(RengTabla))
    expect(rengHtml.match(/data-elemento="\d+"/g)).toHaveLength(118)
    expect(rengHtml).toContain('aria-label="Cloro, número atómico 17"')
    expect(rengHtml).toContain('aria-controls="tabla-periodica-panel-elementos"')
    expect(rengHtml).toContain('aria-controls="tabla-periodica-panel-sustancias"')
    expect(rengHtml).toContain('aria-controls="tabla-periodica-panel-molar"')
    expect(rengHtml).toContain('Colorear por peligro')
    expect(rengHtml).toContain('Modelo de Bohr. Electrones por capa: 1')
    expect(rengHtml).toContain('Ca(OH)2')
    expect(rengHtml).toContain('g/mol')
  })

  it('muestra la forma elegida y su fuente específica cuando un elemento tiene varios alótropos', async () => {
    const rengOxigeno = RENG_ELEMENTOS[7]!
    const rengOzono = rengFormasDeElemento(rengOxigeno.z).find((rengF) => rengF.formula === 'O3')!
    const rengHtml = await rengRenderizarFicha(rengOxigeno, rengOzono)
    expect(rengHtml).toContain('Forma elemental')
    expect(rengHtml).toContain('referencia de la tabla')
    expect(rengHtml).toContain('Ozono')
    expect(rengHtml).toContain('0068')
    expect(rengHtml).toContain('Sustancias y compuestos relacionados')
  })

  it('presenta la radiactividad por separado de un estado químico sin ficha', async () => {
    const rengUranio = RENG_ELEMENTOS[91]!
    const rengHtml = await rengRenderizarFicha(rengUranio, undefined)
    expect(rengHtml).toContain('Datos insuficientes')
    expect(rengHtml).toContain('Propiedad nuclear')
    expect(rengHtml).toContain('Todos sus isótopos conocidos son radiactivos')
  })
})
