import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { rengDisponerNiveles, rengEscalaLineal, rengFormatoEje, rengGeometriaFlecha, rengMarcasEje, rengPasoBonito, rengRutaSerie, type RengNivelDispuesto, type RengNivelEntrada } from '../../src/renderer/modules/simulador-quimica/aprender/figuras/geometria'

const RENG_RUTA_FIGURAS = '../../src/renderer/modules/simulador-quimica/vista/figuras/Figuras'
type RengComponente = (rengP: Record<string, unknown>) => ReturnType<typeof createElement>
const rengFiguras = async (): Promise<Record<'RengDiagramaNiveles' | 'RengEjesFigura' | 'RengFlechaReaccion', RengComponente>> => (await import(/* @vite-ignore */ RENG_RUTA_FIGURAS)) as Record<'RengDiagramaNiveles' | 'RengEjesFigura' | 'RengFlechaReaccion', RengComponente>

function rengPasoPorEnumeracion(rengIntervalo: number, rengObjetivo: number): number {
  const rengCandidatos: number[] = []
  for (let rengE = -12; rengE <= 12; rengE++) for (const rengF of [1, 2, 5]) rengCandidatos.push(rengF * 10 ** rengE)
  return rengCandidatos.filter((rengC) => rengC >= rengIntervalo / rengObjetivo * (1 - 1e-12)).sort((rengA, rengB) => rengA - rengB)[0]!
}

function rengComprobarNiveles(rengEntrada: readonly RengNivelEntrada[], rengSalida: readonly RengNivelDispuesto[], rengSep: number): string | null {
  if (rengSalida.length !== rengEntrada.length) return 'faltan niveles'
  const rengPorValor = [...rengEntrada].sort((rengA, rengB) => rengA.valor - rengB.valor).map((rengN) => rengN.id)
  const rengPorY = [...rengSalida].sort((rengA, rengB) => rengB.y - rengA.y).map((rengN) => rengN.id)
  if (rengPorValor.join() !== rengPorY.join()) return 'el orden vertical no sigue la energía'
  const rengEtiquetas = [...rengSalida].sort((rengA, rengB) => rengB.yEtiqueta - rengA.yEtiqueta)
  for (let rengI = 1; rengI < rengEtiquetas.length; rengI++) if (rengEtiquetas[rengI - 1]!.yEtiqueta - rengEtiquetas[rengI]!.yEtiqueta < rengSep - 1e-9) return 'etiquetas solapadas'
  return null
}

describe('Entrega 0 · kit de figuras: geometría pura', () => {
  it('la escala lineal lleva los extremos a los extremos y rechaza dominios de ancho cero o no finitos', () => {
    const rengE = rengEscalaLineal(0, 10, 50, 450)
    expect(rengE(0)).toBe(50)
    expect(rengE(10)).toBe(450)
    expect(rengE(2.5)).toBeCloseTo(150, 12)
    expect(() => rengEscalaLineal(1, 1, 0, 10)).toThrow()
    expect(() => rengEscalaLineal(0, Number.NaN, 0, 10)).toThrow()
  })

  it('las marcas del eje son múltiplos equiespaciados de 1, 2 o 5 × 10^k dentro del intervalo (segundo método: enumeración)', () => {
    const rengCasos: Array<[number, number]> = [[0, 10], [0, 30], [0, 1], [0.1, 2], [-5, 5], [0, 101.325], [273.15, 373.15], [0, 0.0012], [1e3, 5e5]]
    for (const [rengA, rengB] of rengCasos) {
      const rengM = rengMarcasEje(rengA, rengB)
      expect(rengM.length, `${rengA}-${rengB}`).toBeGreaterThanOrEqual(3)
      expect(rengM.length).toBeLessThanOrEqual(11)
      const rengPaso = rengPasoBonito(rengB - rengA, 5)
      expect(rengPaso / rengPasoPorEnumeracion(rengB - rengA, 5)).toBeCloseTo(1, 12)
      for (const rengV of rengM) {
        expect(rengV).toBeGreaterThanOrEqual(rengA - 1e-9)
        expect(rengV).toBeLessThanOrEqual(rengB + 1e-9)
      }
      for (let rengI = 1; rengI < rengM.length; rengI++) expect(rengM[rengI]! - rengM[rengI - 1]!).toBeCloseTo(rengPaso, 9)
    }
    expect(() => rengMarcasEje(5, 5)).toThrow()
  })

  it('el formato del eje usa coma decimal y signo menos tipográfico', () => {
    expect(rengFormatoEje(2.5)).toBe('2,5')
    expect(rengFormatoEje(-0.25)).toBe('−0,25')
    expect(rengFormatoEje(0)).toBe('0')
    expect(rengFormatoEje(Number.NaN)).toBe('—')
  })

  it('los niveles conservan el orden de energía y sus etiquetas no se solapan, incluso con niveles casi iguales', () => {
    const rengEntrada = [
      { id: 'a', valor: 0, etiqueta: 'A' },
      { id: 'b', valor: 3, etiqueta: 'B' },
      { id: 'c', valor: 3.05, etiqueta: 'C' },
      { id: 'd', valor: 3.1, etiqueta: 'D' }
    ]
    const rengSalida = rengDisponerNiveles(rengEntrada, 20, 260, 18)
    expect(rengComprobarNiveles(rengEntrada, rengSalida, 18)).toBeNull()
    expect(rengSalida.find((rengN) => rengN.id === 'a')!.y).toBeCloseTo(260, 9)
    expect(rengSalida.find((rengN) => rengN.id === 'd')!.y).toBeCloseTo(20, 9)
    expect(() => rengDisponerNiveles([{ id: 'x', valor: Number.NaN, etiqueta: 'x' }], 0, 10, 5)).toThrow()
    expect(() => rengDisponerNiveles([{ id: 'x', valor: 1, etiqueta: 'x' }, { id: 'x', valor: 2, etiqueta: 'y' }], 0, 10, 5)).toThrow()
  })

  it('sabotaje: un disponedor que deja las etiquetas donde caen los niveles falla la comprobación de solapes', () => {
    const rengEntrada = [
      { id: 'b', valor: 3, etiqueta: 'B' },
      { id: 'c', valor: 3.05, etiqueta: 'C' },
      { id: 'a', valor: 0, etiqueta: 'A' }
    ]
    const rengRoto = rengDisponerNiveles(rengEntrada, 20, 260, 18).map((rengN) => ({ ...rengN, yEtiqueta: rengN.y }))
    expect(rengComprobarNiveles(rengEntrada, rengRoto, 18)).toBe('etiquetas solapadas')
  })

  it('las flechas de reacción: directa con una punta a la derecha, equilibrio con dos semiflechas opuestas, resonancia con dos puntas', () => {
    const rengD = rengGeometriaFlecha('directa', 0, 60, 20)
    expect(rengD.trazos).toHaveLength(1)
    expect(rengD.puntas).toHaveLength(1)
    expect(rengD.puntas[0]!.startsWith('60,20')).toBe(true)
    const rengE = rengGeometriaFlecha('equilibrio', 0, 60, 20)
    expect(rengE.trazos).toHaveLength(2)
    expect(rengE.puntas[0]!.split(' ')[0]!.startsWith('60,')).toBe(true)
    expect(rengE.puntas[1]!.split(' ')[0]!.startsWith('0,')).toBe(true)
    const rengR = rengGeometriaFlecha('resonancia', 0, 60, 20)
    expect(rengR.puntas).toHaveLength(2)
    expect(() => rengGeometriaFlecha('directa', 0, 10, 20)).toThrow()
  })

  it('una serie con puntos no finitos no se dibuja en silencio', () => {
    const rengX = rengEscalaLineal(0, 1, 0, 100)
    expect(rengRutaSerie({ nombre: 's', puntos: [[0, 0], [1, 1]] }, rengX, rengX)).toBe('M0,0 L100,100')
    expect(() => rengRutaSerie({ nombre: 's', puntos: [[0, 0], [1, Number.NaN]] }, rengX, rengX)).toThrow(/no finitos/)
  })
})

describe('Entrega 0 · kit de figuras: componentes', () => {
  it('una figura de ejes es un <figure> con pie numerado, svg role=img con título y descripción, y series que no dependen solo del color', async () => {
    const { RengEjesFigura } = await rengFiguras()
    const rengHtml = renderToStaticMarkup(
      createElement(RengEjesFigura, {
        numero: '8.4',
        titulo: 'Isotermas',
        pie: 'Presión frente a volumen.',
        alternativo: 'Dos curvas decrecientes.',
        x: { min: 0, max: 10, titulo: 'V (L)' },
        y: { min: 0, max: 30, titulo: 'P (kPa)' },
        series: [
          { nombre: '300 K', puntos: [[1, 25], [5, 5], [10, 2.5]] },
          { nombre: '400 K', puntos: [[1, 30], [5, 6.6], [10, 3.3]] }
        ]
      })
    )
    expect(rengHtml).toMatch(/^<figure class="q-fig" data-figura="8.4">/)
    expect(rengHtml).toMatch(/<svg[^>]*role="img"[^>]*aria-labelledby="[^"]+-t [^"]+-d"/)
    expect(rengHtml).toContain('<title id=')
    expect(rengHtml).toContain('>Dos curvas decrecientes.</desc>')
    expect(rengHtml).toContain('<strong>Figura 8.4.</strong>')
    expect(rengHtml).toContain('stroke-dasharray="7 4"')
    expect(rengHtml).toContain('<rect')
    expect(rengHtml).toContain('>300 K</text>')
    expect(rengHtml).not.toMatch(/#[0-9a-f]{3,6}\b|rgb\(/i)
  })

  it('el diagrama de niveles dibuja cada nivel y cada transición; una transición a un nivel inexistente falla', async () => {
    const { RengDiagramaNiveles } = await rengFiguras()
    const rengBase = { numero: '1', titulo: 'Niveles', pie: 'p', alternativo: 'a', tituloEje: 'Energía', niveles: [{ id: 'e0', valor: 0, etiqueta: 'E0' }, { id: 'e1', valor: 1, etiqueta: 'E1' }] }
    const rengHtml = renderToStaticMarkup(createElement(RengDiagramaNiveles, { ...rengBase, transiciones: [{ desde: 'e0', hasta: 'e1', etiqueta: 'absorbe' }] }))
    expect(rengHtml.match(/data-nivel=/g)).toHaveLength(2)
    expect(rengHtml).toContain('data-transicion="e0-e1"')
    expect(() => renderToStaticMarkup(createElement(RengDiagramaNiveles, { ...rengBase, transiciones: [{ desde: 'e0', hasta: 'zz', etiqueta: 'x' }] }))).toThrow(/inexistente/)
  })

  it('la flecha de reacción tiene nombre accesible que explica su tipo y sus condiciones', async () => {
    const { RengFlechaReaccion } = await rengFiguras()
    const rengHtml = renderToStaticMarkup(createElement(RengFlechaReaccion, { tipo: 'equilibrio', abajo: '25 °C' }))
    expect(rengHtml).toContain('role="img"')
    expect(rengHtml).toMatch(/aria-label="flechas de equilibrio[^"]*debajo: 25 °C"/)
  })
})
