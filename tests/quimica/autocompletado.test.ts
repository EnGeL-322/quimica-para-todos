import { describe, expect, it } from 'vitest'
import { rengBuscarSustancias, rengContarSustancias, rengFormulaVisible, rengIndiceSustancias, type RengEntradaIndice } from '../../src/renderer/modules/simulador-quimica/nucleo/indiceSustancias'
import { RENG_COTIDIANOS } from '../../src/renderer/modules/simulador-quimica/datos/cotidianos'
import { RENG_ELEMENTOS } from '../../src/renderer/modules/tabla-periodica/data'
import { rengInterpretarSustancia } from '../../src/renderer/modules/simulador-quimica/nucleo/sustancia'

const rengNombres = (rengQ: string, rengMax = 10): string[] => rengBuscarSustancias(rengQ, rengMax).map((rengR) => rengR.e.nombre)

function rengMuestraIndice(): RengEntradaIndice[] {
  const rengIx = rengIndiceSustancias()
  const rengFijas = rengIx.filter((rengE) => rengE.tipo === 'organico' || rengE.tipo === 'comun')
  const rengResto = rengIx.filter((rengE) => !rengFijas.includes(rengE))
  const rengFaltan = Math.max(0, 40 - rengFijas.length)
  const rengPaso = Math.max(1, Math.floor(rengResto.length / Math.max(1, rengFaltan)))
  return [...rengFijas, ...rengResto.filter((_, rengI) => rengI % rengPaso === 0).slice(0, Math.max(rengFaltan, 10))]
}

describe('índice de sustancias', () => {
  it('incluye los 118 elementos, la biblioteca, compuestos e iones, sin compuestos no confirmados', () => {
    const rengIx = rengIndiceSustancias()
    const rengSimbolos = new Set(rengIx.map((rengE) => rengE.entrada))
    expect(RENG_ELEMENTOS.filter((rengEl) => !rengSimbolos.has(rengEl.simbolo)).map((rengEl) => rengEl.simbolo)).toEqual([])
    expect(rengNombres('hidrógeno').length).toBeGreaterThanOrEqual(2)
    expect(rengIx.some((rengE) => rengE.tipo === 'ion')).toBe(true)
    expect(rengIx.some((rengE) => rengE.tipo === 'organico')).toBe(true)
    expect(rengNombres('sulfato de oro')).not.toContain('sulfato de oro(III)')
  })
  it('una muestra representativa se puede abrir (todas las orgánicas y las de nombre común + otras hasta 40)', () => {
    const rengFallos = rengMuestraIndice()
      .filter((rengE) => rengInterpretarSustancia(rengE.entrada).tipo === 'error')
      .map((rengE) => `${rengE.nombre} → ${rengE.entrada}`)
    expect(rengFallos).toEqual([])
  }, 20_000)
})

describe('autocompletado (casos de la especificación)', () => {
  it('«ag» incluye agua y plata (Ag)', () => {
    const rengR = rengNombres('ag')
    expect(rengR).toContain('agua')
    expect(rengR).toContain('plata')
  })
  it('«acet» incluye ácido acético y acetona', () => {
    const rengR = rengNombres('acet')
    expect(rengR).toContain('ácido acético')
    expect(rengR).toContain('acetona')
  })
  it('«sulf» encuentra ácido sulfúrico y sulfato de hierro(III)', () => {
    expect(rengNombres('sulf')).toContain('ácido sulfúrico')
    expect(rengNombres('sulf', Infinity)).toContain('sulfato de hierro(III)')
    expect(rengNombres('sulfato de hie')).toContain('sulfato de hierro(III)')
    expect(rengContarSustancias('sulf')).toBeGreaterThan(10)
  })
  it('«nacl» → cloruro de sodio', () => {
    expect(rengNombres('nacl')[0]).toBe('cloruro de sodio')
  })
  it('contiene, no solo empieza: «oxigenada» encuentra agua oxigenada', () => {
    const rengR = rengBuscarSustancias('oxigenada')
    expect(rengR.map((rengX) => rengX.e.nombre.toLowerCase().includes('oxigenada') || rengX.coincide.toLowerCase().includes('oxigenada'))).toContain(true)
  })
  it('sin tildes ni mayúsculas y con una errata desde 4 letras', () => {
    expect(rengNombres('ACIDO ACETICO')[0]).toBe('ácido acético')
    expect(rengNombres('metanp')).toContain('metano')
    expect(rengNombres('agu')).toContain('agua')
  })
  it('orden: exacto > empieza por > empieza palabra > contiene', () => {
    const rengR = rengBuscarSustancias('cobre')
    expect(rengR[0]!.e.nombre).toBe('cobre')
    const rengNiveles = rengR.map((rengX) => rengX.nivel)
    expect([...rengNiveles].sort((rengA, rengB) => rengB - rengA)).toEqual(rengNiveles)
  })
  it('orden estable entre llamadas y máximo 10', () => {
    expect(rengNombres('ca')).toEqual(rengNombres('ca'))
    expect(rengNombres('a').length).toBeLessThanOrEqual(10)
  })
  it('rendimiento: < 5 ms por pulsación con el índice construido (límite amplio aquí: 50 ms)', () => {
    rengIndiceSustancias()
    const rengConsultas = ['a', 'ag', 'agu', 'agua', 'sulf', 'sulfato', 'cloruro de s', 'xyzw']
    const rengT0 = performance.now()
    for (let rengK = 0; rengK < 5; rengK++) for (const rengQ of rengConsultas) rengBuscarSustancias(rengQ)
    const rengPorPulsacion = (performance.now() - rengT0) / (5 * rengConsultas.length)
    expect(rengPorPulsacion).toBeLessThan(50)
  })
})

describe('fórmula mostrada en las sugerencias', () => {
  it('ninguna entrada muestra un SMILES como fórmula', () => {
    const rengHill = (rengF: string): boolean => {
      const rengEls = [...rengF.matchAll(/([A-Z][a-z]?)\d*/g)].map((rengM) => rengM[1])
      return /^([A-Z][a-z]?\d*)+$/.test(rengF) && new Set(rengEls).size === rengEls.length
    }
    const rengEsSmiles = (rengT: string): boolean => {
      const rengR = rengInterpretarSustancia(rengT)
      return rengR.tipo === 'ok' && rengR.sustancia.via === 'smiles'
    }
    const rengMalas = rengIndiceSustancias()
      .filter((rengE) => rengE.calcular && rengEsSmiles(rengE.entrada))
      .map((rengE) => ({ nombre: rengE.nombre, entrada: rengE.entrada, f: rengFormulaVisible(rengE) }))
      .filter((rengX) => rengX.f !== null && (rengX.f === rengX.entrada || !rengHill(rengX.f)))
    expect(rengMalas).toEqual([])
    for (const rengE of rengIndiceSustancias().filter((rengX) => rengX.id.startsWith('bib:') && !rengX.calcular)) expect(rengE.formula, rengE.nombre).toBe(rengE.entrada)
  }, 20_000)
  it('los orgánicos de la biblioteca se etiquetan como orgánicos aunque su entrada sea una fórmula; el CO₂ no', () => {
    const rengTipo = (rengN: string) => rengIndiceSustancias().find((rengE) => rengE.nombre === rengN)!.tipo
    expect(rengTipo('etanol')).toBe('organico')
    expect(rengTipo('ácido acético')).toBe('organico')
    expect(rengTipo('dióxido de carbono')).toBe('compuesto')
    expect(rengTipo('cloruro de sodio')).toBe('compuesto')
  })
  it('etano → C₂H₆ (orgánico) y metoximetano → C₂H₆O', () => {
    const rengEtano = rengIndiceSustancias().find((rengE) => rengE.nombre === 'etano')!
    expect(rengEtano.tipo).toBe('organico')
    expect(rengFormulaVisible(rengEtano)).toBe('C2H6')
    const rengEter = rengIndiceSustancias().find((rengE) => rengE.nombre === 'metoximetano')!
    expect(rengEter.tipo).toBe('organico')
    expect(rengFormulaVisible(rengEter)).toBe('C2H6O')
  })
})

describe('nombres cotidianos', () => {
  const rengPedidos = ['vinagre', 'azúcar', 'lejía', 'sal de mesa', 'cal viva', 'cal apagada', 'agua oxigenada', 'sosa cáustica', 'yeso', 'arena', 'alcohol', 'herrumbre']
  it('cada nombre pedido aparece en el autocompletado como «nombre común»', () => {
    for (const rengN of rengPedidos) {
      const rengR = rengBuscarSustancias(rengN)[0]
      expect(rengR?.e.nombre, rengN).toBe(rengN)
      expect(rengR?.e.tipo, rengN).toBe('comun')
    }
  })
  it('cada nombre común abre una sustancia válida y tiene fuente y nota', () => {
    for (const rengC of RENG_COTIDIANOS) {
      expect(rengInterpretarSustancia(rengC.entrada).tipo, rengC.nombre).toBe('ok')
      expect(rengC.fuente.length, rengC.nombre).toBeGreaterThan(10)
      expect(rengC.nota.length, rengC.nombre).toBeGreaterThan(5)
    }
  }, 20_000)
  it('las mezclas y disoluciones lo dicen en la nota', () => {
    for (const rengC of RENG_COTIDIANOS.filter((rengX) => rengX.clase !== 'sustancia')) expect(rengC.nota, rengC.nombre).toMatch(/disolución|mezcla/)
    expect(RENG_COTIDIANOS.find((rengC) => rengC.nombre === 'vinagre')!.clase).toBe('disolucion')
    expect(RENG_COTIDIANOS.find((rengC) => rengC.nombre === 'arena')!.clase).toBe('mezcla')
  })
  it('el nombre común no tapa al compuesto: «cloruro de sodio» sigue en el índice', () => {
    expect(rengNombres('cloruro de sodio')[0]).toBe('cloruro de sodio')
    expect(rengNombres('azúcar')[0]).toBe('azúcar')
    expect(rengFormulaVisible(rengIndiceSustancias().find((rengE) => rengE.nombre === 'azúcar')!)).toBe('C12H22O11')
  })
})
