import { describe, expect, it } from 'vitest'
import { rengAnadirSustancia, rengCompletarActivo } from '../../src/renderer/modules/simulador-quimica/estado/acciones'
import { rengDerivarTodos } from '../../src/renderer/modules/simulador-quimica/estado/derivados'
import { rengCrearTrabajo, rengEstadoInicial, type RengEstadoTrabajo } from '../../src/renderer/modules/simulador-quimica/estado/trabajo'
import { rengAnalizarFragmento } from '../../src/renderer/modules/simulador-quimica/nucleo/analisisMesa'
import { rengClaveIdentidad, rengIdentidadDeFragmento, rengIdentificadaDeFragmento, rengIdentificar } from '../../src/renderer/modules/simulador-quimica/nucleo/identidad'
import { rengBorrarAtomos, rengMoverAtomos } from '../../src/renderer/modules/simulador-quimica/nucleo/mesa'
import { rengMezclar } from '../../src/renderer/modules/simulador-quimica/nucleo/mezclador'
import { rengBuscarReaccion } from '../../src/renderer/modules/simulador-quimica/nucleo/reaccionesConocidas'

const rengOk = (rengR: ReturnType<typeof rengAnadirSustancia>): RengEstadoTrabajo => {
  if (!rengR.ok) throw new Error(JSON.stringify(rengR))
  return rengR.estado
}
const rengMesaCon = (...rengTextos: string[]): RengEstadoTrabajo => rengTextos.reduce((rengE, rengT) => rengOk(rengAnadirSustancia(rengE, rengT)), rengEstadoInicial())
const rengClaveFrag = (rengF: Parameters<typeof rengIdentidadDeFragmento>[0]): string | null => {
  const rengR = rengIdentidadDeFragmento(rengF)
  return 'motivo' in rengR ? null : rengR.identidad.clave
}

describe('hallazgo 1: Na⁺ no se convierte en sodio metálico al pasar por la mesa', () => {
  it('el fragmento Na⁺ conserva la carga en la sustancia derivada y en su identidad', () => {
    const rengFs = rengDerivarTodos(rengMesaCon('[Na+]', 'H2O'))
    expect(rengFs.map((rengF) => rengF.cargaNeta)).toEqual([1, 0])
    const rengNa = rengFs[0]!
    expect(rengNa.sustancia!.carga).toBe(1)
    expect(rengClaveFrag(rengNa)).toBe(rengClaveIdentidad('[Na+]'))
    expect(rengClaveFrag(rengNa)).not.toBe(rengClaveIdentidad('Na'))
  })
  it('Na⁺ + H₂O desde la mesa NO es «Sodio con agua» (mezclar y buscarReaccion)', () => {
    const rengFs = rengDerivarTodos(rengMesaCon('[Na+]', 'H2O'))
    const [rengA, rengB] = rengFs.map(rengIdentificadaDeFragmento)
    const rengR = rengMezclar(rengA!, rengB!)
    expect(rengR.tipo).toBe('ninguna')
    expect(rengR.tipo === 'ninguna' && rengR.causa).toBe('sin-datos')
    expect(rengBuscarReaccion(rengFs.map(rengClaveFrag), '').tipo).toBe('ninguna')
  })
  it('el sodio metálico de la mesa sí reacciona con agua (catálogo)', () => {
    const rengFs = rengDerivarTodos(rengMesaCon('Na', 'H2O'))
    const [rengA, rengB] = rengFs.map(rengIdentificadaDeFragmento)
    const rengR = rengMezclar(rengA!, rengB!)
    expect(rengR.tipo === 'reaccion' && rengR.r.nombre).toBe('Sodio con agua')
  })
  it('otros iones sueltos: Cl⁻ y Ca²⁺ conservan su carga', () => {
    for (const [rengTexto, rengQ] of [['[Cl-]', -1], ['[Ca+2]', 2]] as const) {
      const [rengF] = rengDerivarTodos(rengMesaCon(rengTexto))
      expect(rengF!.sustancia!.carga, rengTexto).toBe(rengQ)
      expect(rengClaveFrag(rengF!), rengTexto).toBe(rengClaveIdentidad(rengTexto))
    }
  })
  it('una sustancia derivada con distinta carga que el fragmento no se identifica', () => {
    const [rengF] = rengDerivarTodos(rengMesaCon('Na'))
    const rengR = rengIdentidadDeFragmento({ ...rengF!, carga: 1 })
    expect('motivo' in rengR && rengR.motivo).toMatch(/carga/)
  })
})

describe('hallazgo 2: representaciones equivalentes de una sal tienen la misma identidad', () => {
  it('NaOH = [Na+].[OH-] = [OH-].[Na+] = hidróxido de sodio = 2 unidades fórmula', () => {
    const rengK = rengClaveIdentidad('NaOH')
    expect(rengK).not.toBeNull()
    for (const rengT of ['[Na+].[OH-]', '[OH-].[Na+]', 'hidróxido de sodio', '[Na+].[Na+].[OH-].[OH-]']) expect(rengClaveIdentidad(rengT), rengT).toBe(rengK)
  })
  it('ácido acético + [Na+].[OH-] da lo mismo que con NaOH', () => {
    const rengA = rengMezclar('CC(=O)O', 'NaOH')
    const rengB = rengMezclar('CC(=O)O', '[Na+].[OH-]')
    expect(rengA.tipo === 'reaccion' && rengA.r.nombre).toBe('Neutralización del ácido acético')
    expect(rengB.tipo === 'reaccion' && rengB.r.nombre).toBe('Neutralización del ácido acético')
  })
  it('otras sales: NaCl, CaCl₂, Na₂SO₄ y el ion OH⁻ escrito de dos formas', () => {
    expect(rengClaveIdentidad('NaCl')).toBe(rengClaveIdentidad('[Na+].[Cl-]'))
    expect(rengClaveIdentidad('CaCl2')).toBe(rengClaveIdentidad('[Cl-].[Ca+2].[Cl-]'))
    expect(rengClaveIdentidad('Na2SO4')).toBe(rengClaveIdentidad('[Na+].[Na+].[O-]S(=O)(=O)[O-]'))
    expect(rengClaveIdentidad('NaCl')).not.toBe(rengClaveIdentidad('CaCl2'))
  })
  it('la equivalencia no vuelve a confundir isómeros por composición', () => {
    expect(rengClaveIdentidad('[NH4+].[O-]C#N')).not.toBe(rengClaveIdentidad('NC(N)=O'))
    expect(rengIdentificar('CH4N2O').tipo).not.toBe('ok')
    expect(rengClaveIdentidad('[Na+]')).not.toBe(rengClaveIdentidad('Na'))
  })
  it('el NaOH de la mesa, el escrito y el del catálogo coinciden', () => {
    const [rengF] = rengDerivarTodos(rengMesaCon('[Na+].[OH-]'))
    expect(rengClaveFrag(rengF!)).toBe(rengClaveIdentidad('NaOH'))
    const [rengG] = rengDerivarTodos(rengMesaCon('NaOH'))
    expect(rengClaveFrag(rengG!)).toBe(rengClaveIdentidad('NaOH'))
  })
})

describe('hallazgo 3: la estereoquímica sobrevive a la mesa o se declara perdida', () => {
  const rengParejas: Array<[string, string]> = [
    ['C[C@H](N)C(=O)O', 'C[C@@H](N)C(=O)O'],
    ['C/C=C/C', 'C/C=C\\C']
  ]
  for (const [rengA, rengB] of rengParejas) {
    it(`${rengA} y ${rengB} siguen siendo distintas tras añadirlas a la mesa`, () => {
      const [rengFa] = rengDerivarTodos(rengMesaCon(rengA))
      const [rengFb] = rengDerivarTodos(rengMesaCon(rengB))
      expect(rengFa!.estereo).toBe('conservada')
      expect(rengClaveFrag(rengFa!)).toBe(rengClaveIdentidad(rengA))
      expect(rengClaveFrag(rengFb!)).toBe(rengClaveIdentidad(rengB))
      expect(rengClaveFrag(rengFa!)).not.toBe(rengClaveFrag(rengFb!))
      const rengRa = rengIdentidadDeFragmento(rengFa!)
      expect('identidad' in rengRa && rengRa.identidad.completa && rengRa.identidad.estereo).toBe('definida')
    })
  }
  it('mover átomos y deshacer/rehacer conservan la estereoquímica', () => {
    const rengT = rengCrearTrabajo(rengMesaCon('C[C@H](N)C(=O)O'))
    const rengIds = new Set(rengT.obtener().mesa.atomos.map((rengX) => rengX.id))
    rengT.aplicar((rengE) => ({ ...rengE, mesa: rengMoverAtomos(rengE.mesa, rengIds, [3, 1, 0]) }))
    expect(rengClaveFrag(rengDerivarTodos(rengT.obtener())[0]!)).toBe(rengClaveIdentidad('C[C@H](N)C(=O)O'))
    rengT.deshacer()
    rengT.rehacer()
    expect(rengClaveFrag(rengDerivarTodos(rengT.obtener())[0]!)).toBe(rengClaveIdentidad('C[C@H](N)C(=O)O'))
  })
  it('una edición que cambia los átomos invalida la anotación: identidad incompleta y con nota', () => {
    let rengE = rengMesaCon('C[C@H](N)C(=O)O')
    const [rengF] = rengDerivarTodos(rengE)
    const rengH = rengE.mesa.enlaces.map((rengX) => [rengX.a, rengX.b]).flat().find((rengId) => rengE.mesa.atomos.find((rengA) => rengA.id === rengId)!.el === 'H')!
    rengE = { ...rengE, mesa: rengBorrarAtomos(rengE.mesa, new Set([rengH])), activo: rengF!.id }
    rengE = rengOk(rengCompletarActivo(rengE))
    const [rengG] = rengDerivarTodos(rengE)
    expect(rengG!.estereo).toBe('perdida')
    const rengR = rengIdentidadDeFragmento(rengG!)
    expect('identidad' in rengR && rengR.identidad.completa).toBe(false)
    expect('identidad' in rengR && rengR.identidad.nota).toMatch(/estereoquímica/)
    expect(rengClaveFrag(rengG!)).toBe(rengClaveIdentidad('CC(N)C(=O)O'))
  })
  it('sin estereoquímica en la entrada: estado «indefinida», sin anotación', () => {
    const [rengF] = rengDerivarTodos(rengMesaCon('CC(N)C(=O)O'))
    expect(rengF!.estereo).toBeNull()
    const rengR = rengIdentidadDeFragmento(rengF!)
    expect('identidad' in rengR && rengR.identidad.estereo).toBe('indefinida')
    const [rengG] = rengDerivarTodos(rengMesaCon('CCO'))
    const rengRg = rengIdentidadDeFragmento(rengG!)
    expect('identidad' in rengRg && rengRg.identidad.estereo).toBe('no-aplica')
  })
  it('la forma real se calcula desde el SMILES isomérico (no se invierte la configuración)', () => {
    const rengE = rengMesaCon('C[C@@H](N)C(=O)O')
    const rengIds = rengE.mesa.atomos.map((rengX) => rengX.id)
    expect(rengAnalizarFragmento(rengE.mesa, rengIds).smiles).toMatch(/@/)
  })
})

describe('texto visible al tomar sustancias de la mesa', () => {
  it('el texto equivalente de Na⁺ se reinterpreta como Na⁺, no como sodio metálico', async () => {
    const { rengTextoEquivalente } = await import('../../src/renderer/modules/simulador-quimica/nucleo/identidad')
    const [rengNa] = rengDerivarTodos(rengMesaCon('[Na+]')).map(rengIdentificadaDeFragmento)
    const rengT = rengTextoEquivalente(rengNa!)
    expect(rengT).not.toBeNull()
    expect(rengClaveIdentidad(rengT!)).toBe(rengClaveIdentidad('[Na+]'))
    expect(rengT).not.toBe('Na')
  })
  it('para moléculas y sales con nombre conocido devuelve un texto con la misma identidad', async () => {
    const { rengTextoEquivalente } = await import('../../src/renderer/modules/simulador-quimica/nucleo/identidad')
    for (const rengEntrada of ['CC(=O)O', 'NaOH', 'H2O', 'C[C@H](N)C(=O)O']) {
      const [rengX] = rengDerivarTodos(rengMesaCon(rengEntrada)).map(rengIdentificadaDeFragmento)
      const rengT = rengTextoEquivalente(rengX!)
      expect(rengT, rengEntrada).not.toBeNull()
      expect(rengClaveIdentidad(rengT!), rengEntrada).toBe(rengX!.identidad.clave)
    }
  })
})

describe('segunda revisión, caso 1: estereoquímica PARCIAL a través de la mesa', () => {
  const rengParcial: [string, string] = ['C[C@H](O)C(O)CC', 'C[C@@H](O)C(O)CC']
  it('las entradas se reconocen como «parcial», no como «indefinida»', () => {
    for (const rengT of rengParcial) {
      const rengI = rengIdentificar(rengT)
      expect(rengI.tipo === 'ok' && rengI.s.identidad.estereo, rengT).toBe('parcial')
    }
    expect(rengClaveIdentidad(rengParcial[0])).not.toBe(rengClaveIdentidad(rengParcial[1]))
  })
  it('tras añadirlas a la mesa siguen siendo distintas, completas y con la parte definida conservada', () => {
    const rengFs = rengParcial.map((rengT) => rengDerivarTodos(rengMesaCon(rengT))[0]!)
    rengFs.forEach((rengF, rengI) => {
      expect(rengF.estereo, rengParcial[rengI]).toBe('conservada')
      expect(rengClaveFrag(rengF), rengParcial[rengI]).toBe(rengClaveIdentidad(rengParcial[rengI]!))
      const rengR = rengIdentidadDeFragmento(rengF)
      expect('identidad' in rengR && rengR.identidad.completa, rengParcial[rengI]).toBe(true)
      expect('identidad' in rengR && rengR.identidad.estereo, rengParcial[rengI]).toBe('parcial')
    })
    expect(rengClaveFrag(rengFs[0]!)).not.toBe(rengClaveFrag(rengFs[1]!))
    expect(rengClaveFrag(rengFs[0]!)).not.toBe(rengClaveIdentidad('CC(O)C(O)CC'))
  })
  it('mover el fragmento entero y deshacer/rehacer conservan la configuración parcial', () => {
    const rengT = rengCrearTrabajo(rengMesaCon(rengParcial[1]))
    const rengIds = new Set(rengT.obtener().mesa.atomos.map((rengX) => rengX.id))
    rengT.aplicar((rengE) => ({ ...rengE, mesa: rengMoverAtomos(rengE.mesa, rengIds, [-2, 0.5, 1]) }))
    expect(rengClaveFrag(rengDerivarTodos(rengT.obtener())[0]!)).toBe(rengClaveIdentidad(rengParcial[1]))
    rengT.deshacer()
    expect(rengClaveFrag(rengDerivarTodos(rengT.obtener())[0]!)).toBe(rengClaveIdentidad(rengParcial[1]))
    rengT.rehacer()
    expect(rengClaveFrag(rengDerivarTodos(rengT.obtener())[0]!)).toBe(rengClaveIdentidad(rengParcial[1]))
  })
  it('una edición que cambia los átomos lo declara: identidad incompleta, con nota, sin afirmar la configuración', () => {
    let rengE = rengMesaCon(rengParcial[0])
    const [rengF] = rengDerivarTodos(rengE)
    const rengH = rengE.mesa.atomos.find((rengA) => rengA.el === 'H')!.id
    rengE = { ...rengE, mesa: rengBorrarAtomos(rengE.mesa, new Set([rengH])), activo: rengF!.id }
    rengE = rengOk(rengCompletarActivo(rengE))
    const [rengG] = rengDerivarTodos(rengE)
    expect(rengG!.estereo).toBe('perdida')
    const rengR = rengIdentidadDeFragmento(rengG!)
    expect('identidad' in rengR && rengR.identidad.completa).toBe(false)
    expect('identidad' in rengR && rengR.identidad.nota).toMatch(/estereoquímica/)
    expect(rengClaveFrag(rengG!)).toBe(rengClaveIdentidad('CC(O)C(O)CC'))
  })
  it('recorrido completo hasta el mezclador: la identidad que llega es la parcial', () => {
    for (const rengT of rengParcial) {
      const [rengX] = rengDerivarTodos(rengMesaCon(rengT)).map(rengIdentificadaDeFragmento)
      expect(rengX!.identidad.clave, rengT).toBe(rengClaveIdentidad(rengT))
      expect(rengX!.identidad.estereo, rengT).toBe('parcial')
    }
  })
})
