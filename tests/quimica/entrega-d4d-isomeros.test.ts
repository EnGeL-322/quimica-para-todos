import { describe, expect, it } from 'vitest'
import { RENG_CODIGOS_PAREJAS, RENG_PAREJAS_ISO, rengCargarGeometriaIsomero, rengCargarPareja, rengGeometriaDeModelo, rengVerificarRegistroPares, type RengParIsomeros } from '../../src/renderer/modules/simulador-quimica/datos/isomeros'
import {
  RENG_UMBRAL_DISTANCIA_IGUAL,
  rengAnguloEn,
  rengCaminoMasCorto,
  rengCompararIsomeros,
  rengDiedro,
  rengDiferenciaAngular,
  rengDistancia3,
  rengDistanciaDependeDeConformacion,
  rengEnAnillo,
  rengMedirSeleccion,
  type RengGeometriaIsomero,
  type RengVec
} from '../../src/renderer/modules/simulador-quimica/nucleo/isomeros'
import { rengModeloDeSmiles } from '../../src/renderer/modules/simulador-quimica/nucleo/modeloVisor'

const RENG_TOL_VECTOR = 1e-9
const RENG_TOL_FF_GRADOS = 10

const rengGeom = (rengNombre: string, rengFormula: string, rengPos: RengVec[], rengEnlaces: Array<[number, number, number?]>, rengOrigen: 'calculada' | 'experimental' = 'calculada', rengMetodo = 'método de prueba'): RengGeometriaIsomero => ({
  nombre: rengNombre,
  smiles: 'X',
  formula: rengFormula,
  atomos: rengPos.map((rengP, rengI) => ({ el: 'C', etiqueta: `C${rengI + 1}`, p: rengP })),
  enlaces: rengEnlaces.map(([rengA, rengB, rengO]) => ({ a: rengA, b: rengB, orden: rengO ?? 1, aromatico: false })),
  procedencia: { origen: rengOrigen, metodo: rengMetodo, texto: 'prueba', detalle: 'geometría de prueba resuelta a mano' }
})

describe('D4.4 · medidas contra coordenadas resueltas a mano (tolerancia 1e-9)', () => {
  it('distancia: 3-4-5 y 1-2-2', () => {
    expect(rengDistancia3([0, 0, 0], [3, 4, 0])).toBeCloseTo(5, 12)
    expect(rengDistancia3([1, 1, 1], [2, 3, 3])).toBeCloseTo(3, 12)
    expect(rengDistancia3([5, -2, 7], [5, -2, 7])).toBe(0)
  })

  it('ángulo: 90°, 45°, 60° (triángulo equilátero), 180° y el tetraédrico arccos(−1/3)', () => {
    expect(Math.abs(rengAnguloEn([1, 0, 0], [0, 0, 0], [0, 1, 0])! - 90)).toBeLessThan(RENG_TOL_VECTOR)
    expect(Math.abs(rengAnguloEn([1, 0, 0], [0, 0, 0], [1, 1, 0])! - 45)).toBeLessThan(RENG_TOL_VECTOR)
    expect(Math.abs(rengAnguloEn([1, 0, 0], [0, 0, 0], [0.5, Math.sqrt(3) / 2, 0])! - 60)).toBeLessThan(RENG_TOL_VECTOR)
    expect(Math.abs(rengAnguloEn([1, 0, 0], [0, 0, 0], [-2, 0, 0])! - 180)).toBeLessThan(RENG_TOL_VECTOR)
    expect(Math.abs(rengAnguloEn([1, 1, 1], [0, 0, 0], [1, -1, -1])! - (Math.acos(-1 / 3) * 180) / Math.PI)).toBeLessThan(RENG_TOL_VECTOR)
    expect(Math.abs(rengAnguloEn([1, 1, 1], [0, 0, 0], [1, -1, -1])! - 109.4712206344907)).toBeLessThan(1e-9)
  })

  it('ángulo con un vértice coincidente con un extremo no está definido', () => {
    expect(rengAnguloEn([0, 0, 0], [0, 0, 0], [1, 0, 0])).toBeNull()
  })

  it('diedro: cis 0°, trans 180°, +90° y −90° según el convenio de la IUPAC', () => {
    const rengP1: RengVec = [0, 1, 0]
    const rengP2: RengVec = [0, 0, 0]
    const rengP3: RengVec = [1, 0, 0]
    expect(Math.abs(rengDiedro(rengP1, rengP2, rengP3, [1, 1, 0])!)).toBeLessThan(RENG_TOL_VECTOR)
    expect(Math.abs(rengDiedro(rengP1, rengP2, rengP3, [1, -1, 0])! - 180)).toBeLessThan(RENG_TOL_VECTOR)
    expect(Math.abs(rengDiedro(rengP1, rengP2, rengP3, [1, 0, 1])! - 90)).toBeLessThan(RENG_TOL_VECTOR)
    expect(Math.abs(rengDiedro(rengP1, rengP2, rengP3, [1, 0, -1])! + 90)).toBeLessThan(RENG_TOL_VECTOR)
  })

  it('diedro: barrido de ángulos conocidos con p4 = (1, cos φ, sin φ)', () => {
    for (const rengFi of [-150, -120, -60, -30, 0, 15, 45, 60, 90, 120, 150, 175]) {
      const rengRad = (rengFi * Math.PI) / 180
      const rengD = rengDiedro([0, 1, 0], [0, 0, 0], [1, 0, 0], [1, Math.cos(rengRad), Math.sin(rengRad)])!
      expect(Math.abs(rengD - rengFi)).toBeLessThan(RENG_TOL_VECTOR)
    }
  })

  it('diedro: no cambia al invertir el orden de los cuatro átomos ni con una traslación o un giro', () => {
    const rengA: RengVec = [0.3, 1.1, -0.4]
    const rengB: RengVec = [0, 0, 0]
    const rengC: RengVec = [1.4, 0.1, 0.2]
    const rengD: RengVec = [1.9, -0.7, 1.3]
    const rengDir = rengDiedro(rengA, rengB, rengC, rengD)!
    expect(Math.abs(rengDiedro(rengD, rengC, rengB, rengA)! - rengDir)).toBeLessThan(RENG_TOL_VECTOR)
    const rengMover = (rengP: RengVec): RengVec => [-rengP[1] + 5, rengP[0] - 2, rengP[2] + 7]
    expect(Math.abs(rengDiedro(rengMover(rengA), rengMover(rengB), rengMover(rengC), rengMover(rengD))! - rengDir)).toBeLessThan(RENG_TOL_VECTOR)
    const rengEspejo = (rengP: RengVec): RengVec => [rengP[0], rengP[1], -rengP[2]]
    expect(Math.abs(rengDiedro(rengEspejo(rengA), rengEspejo(rengB), rengEspejo(rengC), rengEspejo(rengD))! + rengDir)).toBeLessThan(RENG_TOL_VECTOR)
  })

  it('diedro con tres átomos alineados no está definido', () => {
    expect(rengDiedro([0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 1, 0])).toBeNull()
  })

  it('diferencia angular con vuelta: 170→−170 = 20°, 0→180 = 180°, −179→179 = −2°', () => {
    expect(rengDiferenciaAngular(170, -170)).toBe(20)
    expect(rengDiferenciaAngular(0, 180)).toBe(180)
    expect(rengDiferenciaAngular(-179, 179)).toBe(-2)
    expect(rengDiferenciaAngular(10, 10)).toBe(0)
  })

  it('rengMedirSeleccion sobre una cadena en zigzag plana: distancia, ángulos y diedro', () => {
    const rengCis = rengGeom('cis', 'C4', [[0, 1, 0], [0, 0, 0], [1, 0, 0], [1, 1, 0]], [[0, 1], [1, 2, 2], [2, 3]])
    const rengM = rengMedirSeleccion(rengCis, [0, 1, 2, 3])
    expect(rengM.n).toBe(4)
    expect(Math.abs(rengM.distancia! - 1)).toBeLessThan(RENG_TOL_VECTOR)
    expect(Math.abs(rengM.angulo1! - 90)).toBeLessThan(RENG_TOL_VECTOR)
    expect(Math.abs(rengM.angulo2! - 90)).toBeLessThan(RENG_TOL_VECTOR)
    expect(Math.abs(rengM.diedro!)).toBeLessThan(RENG_TOL_VECTOR)
    expect(rengM.encadenados).toEqual([true, true, true])
    expect(rengM.diedroRotable).toBe(false)
    const rengTrans = rengGeom('trans', 'C4', [[0, 1, 0], [0, 0, 0], [1, 0, 0], [1, -1, 0]], [[0, 1], [1, 2, 2], [2, 3]])
    const rengT = rengMedirSeleccion(rengTrans, [0, 1, 2, 3])
    expect(Math.abs(rengT.distancia! - Math.sqrt(5))).toBeLessThan(RENG_TOL_VECTOR)
    expect(Math.abs(rengT.diedro! - 180)).toBeLessThan(RENG_TOL_VECTOR)
  })

  it('con 2 y 3 átomos solo se definen las medidas que corresponden', () => {
    const rengG = rengGeom('x', 'C4', [[0, 0, 0], [3, 0, 0], [3, 4, 0], [0, 4, 0]], [[0, 1], [1, 2], [2, 3]])
    const rengDos = rengMedirSeleccion(rengG, [0, 2])
    expect(rengDos.distancia).toBeCloseTo(5, 12)
    expect(rengDos.angulo1).toBeNull()
    expect(rengDos.diedro).toBeNull()
    expect(rengDos.encadenados).toEqual([false])
    const rengTres = rengMedirSeleccion(rengG, [0, 1, 2])
    expect(Math.abs(rengTres.angulo1! - 90)).toBeLessThan(RENG_TOL_VECTOR)
    expect(rengTres.angulo2).toBeNull()
    expect(rengTres.diedro).toBeNull()
    expect(rengMedirSeleccion(rengG, [0]).distancia).toBeNull()
    expect(rengMedirSeleccion(rengG, []).n).toBe(0)
  })

  it('selecciones inválidas: repetida, inexistente, fraccionaria y de más de 4', () => {
    const rengG = rengGeom('x', 'C4', [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0], [4, 0, 0]], [[0, 1], [1, 2], [2, 3], [3, 4]])
    expect(() => rengMedirSeleccion(rengG, [0, 1, 0])).toThrow(/iso-atomo-repetido/)
    expect(() => rengMedirSeleccion(rengG, [0, 9])).toThrow(/iso-atomo-inexistente/)
    expect(() => rengMedirSeleccion(rengG, [0, -1])).toThrow(/iso-atomo-inexistente/)
    expect(() => rengMedirSeleccion(rengG, [0, 1.5])).toThrow(/iso-atomo-inexistente/)
    expect(() => rengMedirSeleccion(rengG, [0, 1, 2, 3, 4])).toThrow(/iso-seleccion-larga/)
  })

  it('anillo y enlace giratorio: un enlace de un anillo no cuenta como giratorio', () => {
    const rengAnillo = rengGeom('ciclo', 'C4', [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [-1, 0, 0]], [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4]])
    expect(rengEnAnillo(rengAnillo, 0, 1)).toBe(true)
    expect(rengEnAnillo(rengAnillo, 0, 4)).toBe(false)
    expect(rengMedirSeleccion(rengAnillo, [3, 0, 1, 2]).diedroRotable).toBe(false)
    expect(rengMedirSeleccion(rengAnillo, [4, 0, 1, 2]).diedroRotable).toBe(false)
    const rengCadena = rengGeom('cadena', 'C4', [[0, 1, 0], [0, 0, 0], [1, 0, 0], [1, 1, 0]], [[0, 1], [1, 2], [2, 3]])
    expect(rengMedirSeleccion(rengCadena, [0, 1, 2, 3]).diedroRotable).toBe(true)
  })

  it('camino más corto y dependencia de la conformación de una distancia', () => {
    const rengCadena = rengGeom('cadena', 'C5', [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0], [4, 0, 0]], [[0, 1], [1, 2], [2, 3], [3, 4]])
    expect(rengCaminoMasCorto(rengCadena, 0, 3)).toEqual([0, 1, 2, 3])
    expect(rengCaminoMasCorto(rengCadena, 2, 2)).toEqual([2])
    expect(rengDistanciaDependeDeConformacion(rengCadena, 0, 2)).toBe(false)
    expect(rengDistanciaDependeDeConformacion(rengCadena, 0, 3)).toBe(true)
    expect(rengDistanciaDependeDeConformacion(rengCadena, 0, 1)).toBe(false)
    const rengDoble = rengGeom('doble', 'C4', [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0]], [[0, 1], [1, 2, 2], [2, 3]])
    expect(rengDistanciaDependeDeConformacion(rengDoble, 0, 3)).toBe(false)
    const rengSinCamino = rengGeom('aislados', 'C2', [[0, 0, 0], [1, 0, 0]], [])
    expect(rengCaminoMasCorto(rengSinCamino, 0, 1)).toBeNull()
    expect(rengDistanciaDependeDeConformacion(rengSinCamino, 0, 1)).toBe(false)
  })
})

describe('D4.4 · una geometría sin procedencia no se carga, ni se mide, ni se compara', () => {
  const rengBuena = rengGeom('buena', 'C4', [[0, 1, 0], [0, 0, 0], [1, 0, 0], [1, 1, 0]], [[0, 1], [1, 2], [2, 3]])
  const rengSin = (rengCambio: Partial<RengGeometriaIsomero>): RengGeometriaIsomero => ({ ...rengBuena, ...rengCambio })

  it('sin objeto de procedencia, con origen desconocido, método vacío o detalle vacío: se rechaza al medir', () => {
    const rengMalas: Array<Partial<RengGeometriaIsomero>> = [
      { procedencia: undefined },
      { procedencia: { ...rengBuena.procedencia, origen: 'esquematica' as never } },
      { procedencia: { ...rengBuena.procedencia, metodo: '' } },
      { procedencia: { ...rengBuena.procedencia, metodo: '   ' } },
      { procedencia: { ...rengBuena.procedencia, detalle: '' } },
      { procedencia: null as never }
    ]
    for (const rengM of rengMalas) expect(() => rengMedirSeleccion(rengSin(rengM), [0, 1])).toThrow(/iso-sin-procedencia/)
  })

  it('al comparar, basta que una de las dos no tenga procedencia', () => {
    expect(() => rengCompararIsomeros(rengBuena, rengSin({ procedencia: undefined }), [0, 1], [0, 1])).toThrow(/iso-sin-procedencia/)
    expect(() => rengCompararIsomeros(rengSin({ procedencia: undefined }), rengBuena, [0, 1], [0, 1])).toThrow(/iso-sin-procedencia/)
  })

  it('una geometría sin átomos o sin enlaces tampoco se acepta', () => {
    expect(() => rengMedirSeleccion(rengSin({ atomos: [] }), [])).toThrow(/iso-geometria-incompleta/)
    expect(() => rengMedirSeleccion(rengSin({ enlaces: undefined as never }), [0, 1])).toThrow(/iso-geometria-incompleta/)
  })

  it('el cargador rechaza modelos iónicos, átomos aislados, esquemáticos y sin geometría', () => {
    const rengIonico = rengGeometriaDeModelo(rengModeloDeSmiles('[Na+].[Cl-]', 'cloruro de sodio'), 'cloruro de sodio')
    expect(rengIonico.ok).toBe(false)
    const rengAtomo = rengGeometriaDeModelo(rengModeloDeSmiles('[Na+]', 'ion sodio'), 'ion sodio')
    expect(rengAtomo.ok).toBe(false)
    const rengMezcla = rengGeometriaDeModelo(rengModeloDeSmiles('CCO.CCCC', 'mezcla'), 'mezcla')
    expect(rengMezcla.ok).toBe(false)
    const rengInvalido = rengGeometriaDeModelo(rengModeloDeSmiles('esto no es un smiles ((', 'roto'), 'roto')
    expect(rengInvalido.ok).toBe(false)
    const rengBueno = rengModeloDeSmiles('CCO', 'etanol')
    expect(rengBueno.estado).toBe('modelo')
    if (rengBueno.estado === 'modelo') {
      const rengEsquematico = { ...rengBueno, procedencia: { ...rengBueno.procedencia, origen: 'esquematica' as const } }
      const rengR = rengGeometriaDeModelo(rengEsquematico, 'etanol')
      expect(rengR.ok).toBe(false)
      if (!rengR.ok) expect(rengR.codigo).toBe('iso-sin-procedencia')
    }
  })

  it('un modelo con procedencia calculada se carga con su método y sin coordenadas inventadas', () => {
    const rengR = rengCargarGeometriaIsomero({ smiles: 'CCO', nombre: 'etanol' })
    expect(rengR.ok).toBe(true)
    if (!rengR.ok) return
    expect(rengR.geometria.procedencia.origen).toBe('calculada')
    expect(rengR.geometria.procedencia.metodo).toMatch(/MMFF94s/)
    expect(rengR.geometria.formula).toBe('C2H6O')
    expect(rengR.geometria.atomos.length).toBe(9)
    expect(rengR.geometria.atomos.slice(0, 3).map((rengA) => rengA.etiqueta)).toEqual(['C1', 'C2', 'O1'])
  })
})

describe('D4.4 · el catálogo de pares y su candado', () => {
  it('cuatro pares, con los códigos congelados en este orden (la lista v1 del Cuaderno)', () => {
    expect([...RENG_CODIGOS_PAREJAS]).toEqual(['buteno', 'etanol-eter', 'butano', 'propanol'])
    expect(RENG_PAREJAS_ISO.map((rengP) => rengP.formula)).toEqual(['C4H8', 'C2H6O', 'C4H10', 'C3H8O'])
  })

  const rengBase = RENG_PAREJAS_ISO[1]!
  const rengCon = (rengCambio: Partial<RengParIsomeros>): RengParIsomeros => ({ ...rengBase, ...rengCambio })

  it('el registro real pasa el candado', () => {
    expect(() => rengVerificarRegistroPares()).not.toThrow()
  })

  it('sabotaje: fórmulas distintas → no son isómeros', () => {
    expect(() => rengVerificarRegistroPares([rengCon({ b: { smiles: 'CCCO', nombre: 'propan-1-ol' } })])).toThrow(/no son isómeros/)
  })

  it('sabotaje: la misma sustancia escrita de otra manera', () => {
    expect(() => rengVerificarRegistroPares([rengCon({ a: { smiles: 'CCO', nombre: 'etanol' }, b: { smiles: 'OCC', nombre: 'etanol otra vez' } })])).toThrow(/misma sustancia/)
  })

  it('sabotaje: un par que no sale del banco de la app', () => {
    expect(() => rengVerificarRegistroPares([rengCon({ b: { smiles: 'C(C)O', nombre: 'etanol' } })])).toThrow()
    expect(() => rengVerificarRegistroPares([rengCon({ formula: 'C2H6O', a: { smiles: 'OCC', nombre: 'etanol' }, b: { smiles: 'COC', nombre: 'éter' } })])).toThrow(/no sale del banco/)
  })

  it('sabotaje: un par geométrico sin estereoquímica definida o fuera del banco', () => {
    const rengBut = RENG_PAREJAS_ISO[0]!
    expect(() => rengVerificarRegistroPares([{ ...rengBut, a: { smiles: 'CC=CC', nombre: 'but-2-eno sin configuración' } }])).toThrow()
  })

  it('sabotaje: selección inicial inválida', () => {
    expect(() => rengVerificarRegistroPares([rengCon({ seleccionInicial: { a: [0], b: [0, 1] } })])).toThrow(/selección inicial/)
    expect(() => rengVerificarRegistroPares([rengCon({ seleccionInicial: { a: [0, 0], b: [0, 1] } })])).toThrow(/selección inicial/)
    expect(() => rengVerificarRegistroPares([rengCon({ seleccionInicial: { a: [0, 1, 2, 3, 4], b: [0, 1] } })])).toThrow(/selección inicial/)
  })

  it('sabotaje: un identificador repetido', () => {
    expect(() => rengVerificarRegistroPares([rengBase, rengBase])).toThrow(/repetido/)
  })

  it('las selecciones iniciales de cada par apuntan a átomos pesados que existen', () => {
    for (const rengP of RENG_PAREJAS_ISO) {
      const rengC = rengCargarPareja(rengP.id)
      expect(rengC.ok).toBe(true)
      if (!rengC.ok) continue
      for (const rengI of rengP.seleccionInicial.a) expect(rengC.a.atomos[rengI]?.el, `${rengP.id} A ${rengI}`).not.toBe('H')
      for (const rengI of rengP.seleccionInicial.b) expect(rengC.b.atomos[rengI]?.el, `${rengP.id} B ${rengI}`).not.toBe('H')
    }
  })
})

describe('D4.4 · geometrías reales de los pares (MMFF94s) contra su definición', () => {
  it('cada par: misma fórmula, procedencia calculada con el mismo método, sin átomos solapados', () => {
    for (const rengP of RENG_PAREJAS_ISO) {
      const rengC = rengCargarPareja(rengP.id)
      expect(rengC.ok, rengP.id).toBe(true)
      if (!rengC.ok) continue
      expect(rengC.a.formula).toBe(rengP.formula)
      expect(rengC.b.formula).toBe(rengP.formula)
      expect(rengC.a.procedencia.origen).toBe('calculada')
      expect(rengC.a.procedencia.metodo).toBe(rengC.b.procedencia.metodo)
      for (const rengG of [rengC.a, rengC.b]) {
        for (let rengI = 0; rengI < rengG.atomos.length; rengI++) for (let rengJ = rengI + 1; rengJ < rengG.atomos.length; rengJ++) expect(rengDistancia3(rengG.atomos[rengI]!.p, rengG.atomos[rengJ]!.p), `${rengG.nombre} ${rengI}-${rengJ}`).toBeGreaterThan(0.5)
      }
    }
  })

  it('but-2-eno: el cis tiene los metilos del mismo lado (diedro ≈ 0°) y el trans de lados opuestos (≈ 180°)', () => {
    const rengC = rengCargarPareja('buteno')
    expect(rengC.ok).toBe(true)
    if (!rengC.ok) return
    const rengCmp = rengCompararIsomeros(rengC.a, rengC.b, [0, 1, 2, 3], [0, 1, 2, 3])
    expect(Math.abs(rengCmp.a.diedro!)).toBeLessThan(RENG_TOL_FF_GRADOS)
    expect(Math.abs(rengCmp.b.diedro!)).toBeGreaterThan(180 - RENG_TOL_FF_GRADOS)
    expect(rengCmp.a.distancia!).toBeLessThan(rengCmp.b.distancia!)
    expect(rengCmp.mayorDistancia).toBe('b')
    expect(rengCmp.diferencias.distancia!).toBeGreaterThan(RENG_UMBRAL_DISTANCIA_IGUAL)
    expect(Math.abs(rengCmp.diferencias.diedro!)).toBeGreaterThan(180 - 2 * RENG_TOL_FF_GRADOS)
    expect(rengCmp.a.diedroRotable).toBe(false)
    const rengAProp = rengC.a.atomos.map((rengX) => rengX.p)
    const rengDirecto = Math.hypot(rengAProp[0]![0] - rengAProp[3]![0], rengAProp[0]![1] - rengAProp[3]![1], rengAProp[0]![2] - rengAProp[3]![2])
    expect(Math.abs(rengDirecto - rengCmp.a.distancia!)).toBeLessThan(RENG_TOL_VECTOR)
  })

  it('etanol y éter dimetílico: el ángulo en el oxígeno del éter y la distancia entre los extremos', () => {
    const rengC = rengCargarPareja('etanol-eter')
    expect(rengC.ok).toBe(true)
    if (!rengC.ok) return
    const rengCmp = rengCompararIsomeros(rengC.a, rengC.b, [0, 1, 2], [0, 1, 2])
    expect(rengC.a.atomos.slice(0, 3).map((rengX) => rengX.el)).toEqual(['C', 'C', 'O'])
    expect(rengC.b.atomos.slice(0, 3).map((rengX) => rengX.el)).toEqual(['C', 'O', 'C'])
    expect(rengCmp.a.encadenados).toEqual([true, true])
    expect(rengCmp.b.encadenados).toEqual([true, true])
    expect(rengCmp.a.angulo1!).toBeGreaterThan(90)
    expect(rengCmp.a.angulo1!).toBeLessThan(130)
    expect(rengCmp.b.angulo1!).toBeGreaterThan(90)
    expect(rengCmp.b.angulo1!).toBeLessThan(130)
    expect(rengCmp.diagnosticos.some((rengD) => rengD.codigo === 'iso-misma-procedencia')).toBe(true)
  })
})

describe('D4.4 · diagnósticos con prefijo iso- (comparación)', () => {
  const rengCis = rengGeom('A', 'C4H8', [[0, 1, 0], [0, 0, 0], [1, 0, 0], [1, 1, 0]], [[0, 1], [1, 2, 2], [2, 3]])
  const rengTrans = rengGeom('B', 'C4H8', [[0, 1, 0], [0, 0, 0], [1, 0, 0], [1, -1, 0]], [[0, 1], [1, 2, 2], [2, 3]])
  const rengCodigos = (rengR: ReturnType<typeof rengCompararIsomeros>): string[] => rengR.diagnosticos.map((rengD) => rengD.codigo)

  it('fórmulas distintas: no son isómeros, nada se compara', () => {
    const rengR = rengCompararIsomeros(rengCis, { ...rengTrans, formula: 'C4H10' }, [0, 1, 2, 3], [0, 1, 2, 3])
    expect(rengCodigos(rengR)).toEqual(['iso-formula-distinta'])
    expect(rengR.diagnosticos[0]!.severidad).toBe('fuera')
    expect(Object.values(rengR.comparables).every((rengX) => !rengX)).toBe(true)
    expect(rengR.mayorDistancia).toBeNull()
  })

  it('selección insuficiente en uno de los dos', () => {
    const rengR = rengCompararIsomeros(rengCis, rengTrans, [0], [0, 1])
    expect(rengCodigos(rengR)).toEqual(['iso-seleccion-insuficiente'])
    expect(rengR.diagnosticos[0]!.texto).toMatch(/A \(A\)/)
    expect(rengR.diagnosticos[0]!.texto).not.toMatch(/B \(B\)/)
    const rengAmbos = rengCompararIsomeros(rengCis, rengTrans, [], [])
    expect(rengAmbos.diagnosticos[0]!.texto).toMatch(/A \(A\) y B \(B\)/)
  })

  it('calculada frente a experimental: se muestran las medidas pero no se restan', () => {
    const rengExp = { ...rengTrans, procedencia: { ...rengTrans.procedencia, origen: 'experimental' as const, metodo: 'otra fuente' } }
    const rengR = rengCompararIsomeros(rengCis, rengExp, [0, 1, 2, 3], [0, 1, 2, 3])
    expect(rengCodigos(rengR)).toContain('iso-calculada-vs-experimental')
    expect(rengCodigos(rengR)).not.toContain('iso-misma-procedencia')
    expect(rengR.a.distancia).not.toBeNull()
    expect(rengR.b.distancia).not.toBeNull()
    expect(rengR.diferencias).toEqual({ distancia: null, angulo1: null, angulo2: null, diedro: null })
    expect(rengR.mayorDistancia).toBeNull()
  })

  it('métodos distintos aunque las dos sean calculadas: no se restan', () => {
    const rengOtro = { ...rengTrans, procedencia: { ...rengTrans.procedencia, metodo: 'otro campo de fuerzas' } }
    const rengR = rengCompararIsomeros(rengCis, rengOtro, [0, 1, 2, 3], [0, 1, 2, 3])
    expect(rengCodigos(rengR)).toContain('iso-metodos-distintos')
    expect(rengR.diferencias.distancia).toBeNull()
    expect(rengR.mayorDistancia).toBeNull()
  })

  it('número de átomos desigual: la distancia primero–último no se compara, los ángulos comunes sí', () => {
    const rengR = rengCompararIsomeros(rengCis, rengTrans, [0, 1, 2], [0, 1, 2, 3])
    expect(rengCodigos(rengR)).toContain('iso-seleccion-desigual')
    expect(rengR.comparables).toEqual({ distancia: false, angulo1: true, angulo2: false, diedro: false })
    expect(rengR.diferencias.distancia).toBeNull()
    expect(Math.abs(rengR.diferencias.angulo1!)).toBeLessThan(RENG_TOL_VECTOR)
  })

  it('átomos sin enlace entre sí: aviso de que no son ángulos de enlace', () => {
    const rengR = rengCompararIsomeros(rengCis, rengTrans, [0, 2, 3], [0, 1, 2])
    expect(rengCodigos(rengR)).toContain('iso-sin-enlace')
    expect(rengR.diagnosticos.find((rengD) => rengD.codigo === 'iso-sin-enlace')!.texto).toMatch(/C1–C3/)
  })

  it('diedro de un enlace simple que gira: aviso de dependencia de la conformación', () => {
    const rengGiro = rengGeom('A', 'C4H8', [[0, 1, 0], [0, 0, 0], [1, 0, 0], [1, 1, 0]], [[0, 1], [1, 2], [2, 3]])
    const rengR = rengCompararIsomeros(rengGiro, rengTrans, [0, 1, 2, 3], [0, 1, 2, 3])
    expect(rengCodigos(rengR)).toContain('iso-diedro-conformacional')
    expect(rengCodigos(rengR).filter((rengC) => rengC === 'iso-diedro-conformacional').length).toBe(1)
  })

  it('distancia que depende de giros: aviso', () => {
    const rengCadena = rengGeom('A', 'C4H8', [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0]], [[0, 1], [1, 2], [2, 3]])
    const rengR = rengCompararIsomeros(rengCadena, rengCadena, [0, 3], [0, 3])
    expect(rengCodigos(rengR)).toContain('iso-distancia-conformacional')
  })

  it('tres átomos alineados: diedro indefinido', () => {
    const rengRecta = rengGeom('A', 'C4H8', [[0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 1, 0]], [[0, 1], [1, 2], [2, 3]])
    const rengR = rengCompararIsomeros(rengRecta, rengTrans, [0, 1, 2, 3], [0, 1, 2, 3])
    expect(rengCodigos(rengR)).toContain('iso-diedro-indefinido')
    expect(rengR.comparables.diedro).toBe(false)
  })

  it('distancias casi iguales (menos de 0,05 Å) se declaran iguales; si no, se dice cuál es mayor', () => {
    const rengCasi = { ...rengCis, atomos: rengCis.atomos.map((rengA, rengI) => (rengI === 3 ? { ...rengA, p: [1.02, 1, 0] as const } : rengA)) }
    const rengIguales = rengCompararIsomeros(rengCis, rengCasi, [0, 1], [0, 3])
    expect(rengIguales.mayorDistancia).toBe('igual')
    expect(rengCodigos(rengIguales)).toContain('iso-distancias-iguales')
    const rengMas = rengCompararIsomeros(rengCis, rengTrans, [0, 1, 2, 3], [0, 1, 2, 3])
    expect(rengMas.mayorDistancia).toBe('b')
    const rengMenos = rengCompararIsomeros(rengTrans, rengCis, [0, 1, 2, 3], [0, 1, 2, 3])
    expect(rengMenos.mayorDistancia).toBe('a')
  })

  it('ningún código de diagnóstico del núcleo choca con los de otras escenas', () => {
    const rengTodos = [rengCompararIsomeros(rengCis, { ...rengTrans, formula: 'X' }, [0, 1], [0, 1]), rengCompararIsomeros(rengCis, rengTrans, [0], [0]), rengCompararIsomeros(rengCis, rengTrans, [0, 1, 2], [0, 1, 2, 3])]
    for (const rengR of rengTodos) for (const rengD of rengR.diagnosticos) expect(rengD.codigo.startsWith('iso-')).toBe(true)
  })
})
