import { ForceFieldMMFF94 } from 'openchemlib'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { rengFragmentoDe } from '../../src/renderer/modules/simulador-quimica/nucleo/fragmentoSustancia'
import { rengDesdeSmiles, rengEstadoCacheLectura, rengGeometria3D, RENG_LIMITES_CACHE_LECTURA, rengVaciarCacheLectura, type RengMoleculaGrafo } from '../../src/renderer/modules/simulador-quimica/nucleo/molecula'
import { rengSustanciaOError } from '../../src/renderer/modules/simulador-quimica/nucleo/sustancia'

beforeEach(() => rengVaciarCacheLectura())
afterEach(() => vi.restoreAllMocks())

function rengObjetos(rengV: unknown, rengOut = new Set<object>()): Set<object> {
  if (rengV !== null && typeof rengV === 'object' && !rengOut.has(rengV)) {
    rengOut.add(rengV)
    for (const rengX of Object.values(rengV)) rengObjetos(rengX, rengOut)
  }
  return rengOut
}
const rengCompartidos = (rengA: unknown, rengB: unknown): object[] => {
  const rengDeB = rengObjetos(rengB)
  return [...rengObjetos(rengA)].filter((rengO) => rengDeB.has(rengO))
}

function rengMutar(rengG: RengMoleculaGrafo): void {
  rengG.atomos[0]!.el = 'U'
  rengG.atomos[0]!.x = 99
  rengG.atomos[0]!.carga = 5
  rengG.atomos.push({ el: 'Xe', carga: 0, aromatico: false, x: 0, y: 0, z: 0 })
  rengG.enlaces[0]!.orden = 3
  rengG.enlaces.pop()
  rengG.componentes.push('falso')
  rengG.componentes.reverse()
  rengG.formula = 'X'
  rengG.id = 'X'
  rengG.idSinEstereo = 'X'
  rengG.smiles = 'X'
  rengG.carga = 7
  rengG.masaMolar = -1
  rengG.estereo = 'definida'
  rengG.tiene3D = true
  rengG.optimizacion = { metodo: 'MMFF94s', codigo: 9, convergio: true, maxIts: 1, gradTol: 1 }
}

function rengRelleno(rengN: number, rengExcluir: readonly string[] = []): string[] {
  const rengOut: string[] = []
  let rengCapa = ['']
  while (rengOut.length < rengN) {
    rengCapa = rengCapa.flatMap((rengP) => ['C', 'N', 'O'].map((rengX) => rengP + rengX))
    for (const rengS of rengCapa) if (rengOut.length < rengN && !rengExcluir.includes(rengS)) rengOut.push(rengS)
  }
  return rengOut
}

describe('caché de desdeSmiles: mismo resultado', () => {
  const RENG_CASOS = ['CCO', 'OCC', 'COC', '[Na]', '[Na+]', '[Na+].[OH-]', '[OH-].[Na+]', 'C/C=C/C', 'C/C=C\\C', 'C[C@H](N)C(=O)O', 'C[C@@H](N)C(=O)O', 'C[C@H](O)C(O)CC', 'CC(N)C(=O)O', 'c1ccccc1', 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O', '[O-][O+]=O']
  it('un acierto devuelve exactamente lo mismo que la primera lectura', () => {
    const rengPrimeras = RENG_CASOS.map((rengS) => structuredClone(rengDesdeSmiles(rengS)))
    expect(rengEstadoCacheLectura()).toMatchObject({ entradas: RENG_CASOS.length, aciertos: 0, fallos: RENG_CASOS.length })
    RENG_CASOS.forEach((rengS, rengI) => expect(rengDesdeSmiles(rengS), rengS).toEqual(rengPrimeras[rengI]))
    expect(rengEstadoCacheLectura()).toMatchObject({ aciertos: RENG_CASOS.length, fallos: RENG_CASOS.length })
  })
  it('las identidades de la caché distinguen isómeros, cargas, E/Z, enantiómeros y estereoquímica parcial', () => {
    for (let rengVuelta = 0; rengVuelta < 2; rengVuelta++) {
      const rengG = (rengS: string) => rengDesdeSmiles(rengS)
      expect(rengG('CCO').id).toBe(rengG('OCC').id)
      expect(rengG('CCO').id).not.toBe(rengG('COC').id)
      expect(rengG('[Na]').carga).toBe(0)
      expect(rengG('[Na+]').carga).toBe(1)
      expect(rengG('[Na+].[OH-]').componentes).toEqual(rengG('[OH-].[Na+]').componentes)
      expect(rengG('C/C=C/C').id).not.toBe(rengG('C/C=C\\C').id)
      expect(rengG('C/C=C/C').idSinEstereo).toBe(rengG('C/C=C\\C').idSinEstereo)
      expect(rengG('C[C@H](N)C(=O)O').id).not.toBe(rengG('C[C@@H](N)C(=O)O').id)
      expect(rengG('C[C@H](O)C(O)CC').estereo).toBe('parcial')
      expect(rengG('CC(N)C(=O)O').estereo).toBe('indefinida')
    }
    expect(rengEstadoCacheLectura().aciertos).toBeGreaterThan(0)
  })
})

describe('caché de desdeSmiles: cada lectura es independiente', () => {
  it('fallo (primera lectura): modificar el resultado no cambia la caché ni la lectura siguiente', () => {
    const rengG1 = rengDesdeSmiles('CC(=O)O')
    const rengRef = structuredClone(rengG1)
    rengMutar(rengG1)
    const rengG2 = rengDesdeSmiles('CC(=O)O')
    expect(rengEstadoCacheLectura()).toMatchObject({ aciertos: 1, fallos: 1 })
    expect(rengG2).toEqual(rengRef)
  })
  it('acierto: modificar una copia no cambia la caché ni las demás copias', () => {
    rengDesdeSmiles('[Na+].[OH-]')
    const rengG2 = rengDesdeSmiles('[Na+].[OH-]')
    const rengRef = structuredClone(rengG2)
    const rengG3 = rengDesdeSmiles('[Na+].[OH-]')
    rengMutar(rengG2)
    expect(rengG3).toEqual(rengRef)
    expect(rengDesdeSmiles('[Na+].[OH-]')).toEqual(rengRef)
    expect(rengEstadoCacheLectura()).toMatchObject({ aciertos: 3, fallos: 1 })
  })
  it('ninguna lectura comparte objetos (átomos, enlaces, componentes ni ningún otro) con otra', () => {
    const rengA = rengDesdeSmiles('C[C@H](O)C(O)CC')
    const rengB = rengDesdeSmiles('C[C@H](O)C(O)CC')
    const rengC = rengDesdeSmiles(' C[C@H](O)C(O)CC ')
    expect(rengEstadoCacheLectura()).toMatchObject({ aciertos: 2, fallos: 1 })
    expect(rengCompartidos(rengA, rengB)).toEqual([])
    expect(rengCompartidos(rengB, rengC)).toEqual([])
    expect(rengCompartidos(rengA, rengC)).toEqual([])
  })
  it('la sustancia interpretada tampoco comparte su grafo con la siguiente', () => {
    const rengS1 = rengSustanciaOError('CCO')
    rengMutar(rengS1.grafo!)
    const rengS2 = rengSustanciaOError('CCO')
    expect(rengS2.grafo!.formula).toBe('C2H6O')
    expect(rengS2.grafo!.atomos[0]!.el).toBe('C')
    expect(rengS2.nombre).toBe('etanol')
  })
})

describe('caché de desdeSmiles: clave', () => {
  it('texto exacto sin espacios exteriores: « CCO » es la misma entrada que «CCO»', () => {
    rengDesdeSmiles('CCO')
    expect(rengDesdeSmiles(' CCO ')).toEqual(rengDesdeSmiles('CCO'))
    expect(rengEstadoCacheLectura()).toMatchObject({ entradas: 1, aciertos: 2, fallos: 1 })
  })
  it('no usa el id canónico: CCO y OCC son entradas distintas y cada una conserva su orden de átomos', () => {
    const rengCcoA = rengDesdeSmiles('CCO')
    const rengOccA = rengDesdeSmiles('OCC')
    expect(rengCcoA.id).toBe(rengOccA.id)
    expect(rengEstadoCacheLectura().entradas).toBe(2)
    expect(rengDesdeSmiles('CCO').atomos.map((rengA) => rengA.el)).toEqual(rengCcoA.atomos.map((rengA) => rengA.el))
    expect(rengDesdeSmiles('OCC').atomos.map((rengA) => rengA.el)).toEqual(rengOccA.atomos.map((rengA) => rengA.el))
    expect(rengCcoA.atomos[0]!.el).toBe('C')
    expect(rengOccA.atomos[0]!.el).toBe('O')
  })
  it('mayúsculas, cargas, @, / y \\ forman parte de la clave', () => {
    const rengPares: Array<[string, string]> = [
      ['c1ccccc1', 'C1CCCCC1'],
      ['[Na]', '[Na+]'],
      ['C[C@H](N)C(=O)O', 'C[C@@H](N)C(=O)O'],
      ['C/C=C/C', 'C/C=C\\C']
    ]
    for (const [rengA, rengB] of rengPares) {
      const rengGa = rengDesdeSmiles(rengA)
      const rengGb = rengDesdeSmiles(rengB)
      expect(rengGa.id, `${rengA} / ${rengB}`).not.toBe(rengGb.id)
      expect(rengDesdeSmiles(rengA).id).toBe(rengGa.id)
      expect(rengDesdeSmiles(rengB).id).toBe(rengGb.id)
    }
    expect(rengDesdeSmiles('c1ccccc1').formula).toBe('C6H6')
    expect(rengDesdeSmiles('C1CCCCC1').formula).toBe('C6H12')
    expect(rengEstadoCacheLectura().entradas).toBe(2 * rengPares.length)
  })
})

describe('caché de desdeSmiles: errores, límites y expulsión', () => {
  it('los errores no se memorizan: el mismo mensaje cada vez y la caché no crece', () => {
    for (const rengS of ['C(C)(C)(C)(C)C', 'CC(', 'C1CC', '', '   ']) {
      const rengMensaje = (() => {
        try {
          rengDesdeSmiles(rengS)
          return null
        } catch (rengE) {
          return (rengE as Error).message
        }
      })()
      expect(rengMensaje, rengS).not.toBeNull()
      expect(() => rengDesdeSmiles(rengS)).toThrow(rengMensaje!)
    }
    expect(rengEstadoCacheLectura()).toMatchObject({ entradas: 0, aciertos: 0 })
  })
  it('al superar el límite sale la entrada usada hace más tiempo y, al volver a pedirla, se lee igual', () => {
    const rengRef = structuredClone(rengDesdeSmiles('CC(=O)O'))
    for (const rengS of rengRelleno(RENG_LIMITES_CACHE_LECTURA.entradas)) rengDesdeSmiles(rengS)
    expect(rengEstadoCacheLectura().entradas).toBe(RENG_LIMITES_CACHE_LECTURA.entradas)
    const rengFallos = rengEstadoCacheLectura().fallos
    expect(rengDesdeSmiles('CC(=O)O')).toEqual(rengRef)
    expect(rengEstadoCacheLectura().fallos).toBe(rengFallos + 1)
    expect(rengEstadoCacheLectura().entradas).toBe(RENG_LIMITES_CACHE_LECTURA.entradas)
  })
  it('LRU: un acierto renueva la entrada y sale la más antigua sin usar', () => {
    const rengOtras = rengRelleno(RENG_LIMITES_CACHE_LECTURA.entradas, ['CCO'])
    const rengRef = structuredClone(rengDesdeSmiles('CCO'))
    for (const rengS of rengOtras.slice(0, -1)) rengDesdeSmiles(rengS)
    expect(rengDesdeSmiles('CCO')).toEqual(rengRef)
    rengDesdeSmiles(rengOtras.at(-1)!)
    const { aciertos: rengAciertos, fallos: rengFallos } = rengEstadoCacheLectura()
    expect(rengDesdeSmiles('CCO')).toEqual(rengRef)
    expect(rengEstadoCacheLectura().aciertos).toBe(rengAciertos + 1)
    expect(rengDesdeSmiles(rengOtras[0]!).formula).toBe(rengDesdeSmiles(rengOtras[0]!).formula)
    expect(rengEstadoCacheLectura().fallos).toBe(rengFallos + 1)
  })
  it('las entradas desproporcionadas (texto o número de átomos) no se guardan y se leen igual', () => {
    const { caracteres: rengCaracteres, atomos: rengAtomos } = RENG_LIMITES_CACHE_LECTURA
    const rengLargo = 'C'.repeat(rengCaracteres + 1)
    expect(rengDesdeSmiles(rengLargo).formula).toBe(`C${rengCaracteres + 1}H${2 * (rengCaracteres + 1) + 2}`)
    expect(rengEstadoCacheLectura().entradas).toBe(0)
    const rengN = Math.floor((rengAtomos - 2) / 3)
    expect(rengDesdeSmiles('C'.repeat(rengN)).atomos.length).toBeLessThanOrEqual(rengAtomos)
    expect(rengEstadoCacheLectura().entradas).toBe(1)
    const rengGrande = rengDesdeSmiles('C'.repeat(rengN + 1))
    expect(rengGrande.atomos.length).toBeGreaterThan(rengAtomos)
    expect(rengEstadoCacheLectura().entradas).toBe(1)
    rengMutar(rengGrande)
    expect(rengDesdeSmiles('C'.repeat(rengN + 1)).formula).toBe(`C${rengN + 1}H${2 * (rengN + 1) + 2}`)
  })
})

describe('geometria3D queda fuera de la caché', () => {
  it('la minimización MMFF94s real se ejecuta en cada llamada aunque el SMILES esté en la caché', () => {
    rengDesdeSmiles('CCO')
    rengDesdeSmiles('CCO')
    const rengEspia = vi.spyOn(ForceFieldMMFF94.prototype, 'minimise')
    const rengA = rengGeometria3D('CCO')
    const rengB = rengGeometria3D('CCO')
    expect(rengEspia).toHaveBeenCalledTimes(2)
    expect(rengA.optimizacion).toMatchObject({ codigo: 0, convergio: true })
    expect(rengB.atomos.map((rengX) => [rengX.x, rengX.y, rengX.z])).toEqual(rengA.atomos.map((rengX) => [rengX.x, rengX.y, rengX.z]))
    expect(rengDesdeSmiles('CCO')).toMatchObject({ tiene3D: false, optimizacion: null })
    expect(rengDesdeSmiles('CCO').atomos.every((rengX) => rengX.x === 0 && rengX.y === 0 && rengX.z === 0)).toBe(true)
  })
  it('con el espía de no convergencia, cada fragmento de la mesa lo observa (no se reutiliza un resultado anterior)', () => {
    const rengConvergido = rengFragmentoDe(rengSustanciaOError('etanol'))
    expect(rengConvergido.ok && rengConvergido.f.origen).toBe('calculada')
    const rengEspia = vi.spyOn(ForceFieldMMFF94.prototype, 'minimise').mockReturnValue(1)
    for (let rengK = 1; rengK <= 2; rengK++) {
      const rengR = rengFragmentoDe(rengSustanciaOError('etanol'))
      expect(rengEspia).toHaveBeenCalledTimes(rengK)
      expect(rengR.ok && rengR.f.origen).toBe('aproximada')
      expect(rengR.ok && rengR.f.nota).toMatch(/NO convergió/)
    }
    rengEspia.mockRestore()
    const rengOtraVez = rengFragmentoDe(rengSustanciaOError('etanol'))
    expect(rengOtraVez.ok && rengOtraVez.f.origen).toBe('calculada')
  })
})
