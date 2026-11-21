import { describe, expect, it } from 'vitest'
import { rengAnadirSustancia, rengCambiarCarga, rengCambiarSubindice, rengCompletarActivo, rengFormulaConCarga, rengLlevarProductos, rengReemplazarActivo, rengSeleccionarEnlace } from '../../src/renderer/modules/simulador-quimica/estado/acciones'
import { rengDerivarActivo, rengDerivarTodos, rengExplicarIncompleto } from '../../src/renderer/modules/simulador-quimica/estado/derivados'
import { rengCrearTrabajo, rengEstadoInicial, rengNormalizar, type RengEstadoTrabajo } from '../../src/renderer/modules/simulador-quimica/estado/trabajo'
import { rengAnadirAtomo, rengUnir } from '../../src/renderer/modules/simulador-quimica/nucleo/mesa'
import { rengClaveIdentidad, rengIdentidadDeSustancia } from '../../src/renderer/modules/simulador-quimica/nucleo/identidad'
import { rengBuscarReaccion } from '../../src/renderer/modules/simulador-quimica/nucleo/reaccionesConocidas'

const rengCon = (rengTexto: string, rengBase: RengEstadoTrabajo = rengEstadoInicial()): RengEstadoTrabajo => {
  const rengR = rengReemplazarActivo(rengBase, rengTexto)
  if (!rengR.ok) throw new Error(`${rengTexto}: ${JSON.stringify(rengR)}`)
  return rengR.estado
}
const rengFirma = (rengE: RengEstadoTrabajo) => {
  const rengD = rengDerivarActivo(rengE)!
  return { formula: rengD.formula, nombre: rengD.nombre, carga: rengD.cargaNeta, enlaces: rengD.enlaces.map((rengX) => `${[rengX.elA, rengX.elB].sort().join('')}${rengX.orden}${rengX.tipo}`).sort() }
}

describe('contrato de sincronización: una sola función deriva lo que ven las cuatro pestañas', () => {
  const rengTextos = ['H2O', 'NH3', 'CH4', 'NaCl', 'H2SO4', 'CH3COOH', '[OH-]', 'CO2', 'N2', 'O2', 'HCl', 'CaF2', 'MgO', 'CH3CH2OH', 'C=C', 'C#C', 'HNO3', 'H3PO4', 'NaOH', 'CaCO3', 'H2O2', 'glucosa']
  it(`${rengTextos.length} construcciones: Explorar, Enlaces, Formulación y Reacciones reciben el MISMO derivado`, () => {
    for (const rengX of rengTextos) {
      const rengE = rengCon(rengX)
      const rengActivo = rengDerivarActivo(rengE)!
      const rengDeLaMesa = rengDerivarTodos(rengE).find((rengF) => rengF.id === rengE.activo)!
      expect(rengDeLaMesa, rengX).toBe(rengActivo)
      expect(rengFirma(rengCrearTrabajo(rengE).obtener()), rengX).toEqual(rengFirma(rengE))
    }
  }, 30_000)
})

describe('regresión OH (estado único)', () => {
  it('O + H enlazados: Enlaces ve O–H, no agua, y dice la verdad', () => {
    let rengE = rengEstadoInicial()
    const rengO = rengAnadirAtomo(rengE.mesa, 'O', [0, 0, 0])
    const rengH = rengAnadirAtomo(rengO.mesa, 'H', [1, 0, 0])
    rengE = { ...rengE, mesa: rengUnir(rengH.mesa, rengO.id, rengH.id).mesa }
    const rengT = rengCrearTrabajo(rengE)
    const rengD = rengDerivarActivo(rengT.obtener())!
    expect(rengD.formula).toBe('OH')
    expect(rengD.enlaces.map((rengX) => rengX.etiqueta)).toEqual(['O–H'])
    expect(rengExplicarIncompleto(rengD)).toMatch(/radical hidroxilo.*OH⁻/)
    const rengR = rengCompletarActivo(rengT.obtener())
    expect(rengR.ok).toBe(true)
    if (rengR.ok) rengT.aplicar(() => rengR.estado)
    expect(rengDerivarActivo(rengT.obtener())!.nombre).toBe('agua')
    const rengR2 = rengCambiarCarga(rengNormalizar(rengE), -1)
    expect(rengR2.ok && rengDerivarActivo(rengR2.estado)!.cargaNeta).toBe(-1)
  })
})

describe('ida y vuelta: mesa → fórmula → mesa', () => {
  for (const rengX of ['H2O', 'NH3', 'CH4', 'NaCl', 'H2SO4', '[OH-]'])
    it(rengX, () => {
      const rengE1 = rengCon(rengX)
      const rengD1 = rengDerivarActivo(rengE1)!
      const rengE2 = rengCon(rengFormulaConCarga(rengD1.formula, rengD1.cargaNeta), rengE1)
      expect(rengFirma(rengE2)).toEqual(rengFirma(rengE1))
    })
  it('CH₃COOH: su fórmula C₂H₄O₂ es ambigua y pide elegir; al elegir, la misma estructura', () => {
    const rengE1 = rengCon('CH3COOH')
    const rengR = rengReemplazarActivo(rengE1, rengDerivarActivo(rengE1)!.formula)
    expect(rengR.ok).toBe(false)
    expect('isomeros' in rengR && rengR.isomeros.map((rengO) => rengO.nombre)).toEqual(expect.arrayContaining(['ácido acético']))
    const rengR2 = rengReemplazarActivo(rengE1, 'C2H4O2', 'ácido acético')
    expect(rengR2.ok && rengFirma(rengR2.estado)).toEqual(rengFirma(rengE1))
  })
})

describe('ediciones', () => {
  it('una edición inválida no cambia el estado y da el motivo', () => {
    const rengT = rengCrearTrabajo(rengCon('H2O'))
    const rengAntes = rengT.obtener()
    const rengR = rengReemplazarActivo(rengAntes, 'Xq9')
    expect(rengR.ok).toBe(false)
    expect('error' in rengR && rengR.error.length).toBeGreaterThan(5)
    expect(rengT.obtener()).toBe(rengAntes)
  })
  it('fórmula ambigua (C₂H₆O) pide elegir entre etanol y metoximetano', () => {
    const rengR = rengReemplazarActivo(rengEstadoInicial(), 'C2H6O')
    expect(rengR.ok).toBe(false)
    expect('isomeros' in rengR && rengR.isomeros.map((rengO) => rengO.nombre)).toEqual(expect.arrayContaining(['etanol', 'metoximetano']))
  })
  it('subir un subíndice reconstruye (H₂O + O → H₂O₂); quitar lo que no hay no cambia nada', () => {
    const rengR = rengCambiarSubindice(rengCon('H2O'), 'O', 1)
    expect(rengR.ok && rengDerivarActivo(rengR.estado)!.formula).toBe('H2O2')
    const rengR2 = rengCambiarSubindice(rengCon('HCl'), 'Cl', -1)
    expect(rengR2.ok && rengDerivarActivo(rengR2.estado)!.formula).toBe('H')
    const rengR3 = rengCambiarSubindice(rengCon('H2O'), 'C', -1)
    expect(rengR3.ok).toBe(false)
  })
  it('deshacer y rehacer atraviesan pestañas (un solo historial)', () => {
    const rengT = rengCrearTrabajo()
    rengT.aplicar((rengE) => rengCon('H2O', rengE))
    const rengR = rengReemplazarActivo(rengT.obtener(), 'H2SO4')
    if (rengR.ok) rengT.aplicar(() => rengR.estado)
    rengT.aplicar((rengE) => rengSeleccionarEnlace(rengE, rengE.mesa.enlaces[0]!.a, rengE.mesa.enlaces[0]!.b), false)
    expect(rengDerivarActivo(rengT.obtener())!.formula).toBe('H2SO4')
    rengT.deshacer()
    expect(rengDerivarActivo(rengT.obtener())!.formula).toBe('H2O')
    rengT.rehacer()
    expect(rengDerivarActivo(rengT.obtener())!.formula).toBe('H2SO4')
  })
})

describe('Reacciones escribe en la mesa', () => {
  it('añadir «sodio» lo pone en la mesa; con agua es Na + H₂O; llevar productos los crea y se deshace', () => {
    const rengT = rengCrearTrabajo(rengCon('H2O'))
    const rengR = rengAnadirSustancia(rengT.obtener(), 'sodio')
    expect(rengR.ok).toBe(true)
    if (rengR.ok) rengT.aplicar(() => rengR.estado)
    const rengFrags = rengDerivarTodos(rengT.obtener())
    expect(rengFrags.map((rengF) => rengF.formula).sort()).toEqual(['H2O', 'Na'])
    const rengC = rengBuscarReaccion(rengFrags.map((rengF) => (rengF.sustancia ? rengIdentidadDeSustancia(rengF.sustancia).clave : null)), '')
    expect(rengC.tipo).toBe('conocida')
    if (rengC.tipo !== 'conocida') return
    expect(rengC.r.id).toBe('na-agua')
    const rengP = rengLlevarProductos(rengT.obtener(), rengC.r.productos)
    expect(rengP.ok).toBe(true)
    if (rengP.ok) rengT.aplicar(() => rengP.estado)
    expect(rengDerivarTodos(rengT.obtener()).map((rengF) => rengF.formula)).toEqual(expect.arrayContaining(['H2', 'NaOH']))
    rengT.deshacer()
    expect(rengDerivarTodos(rengT.obtener())).toHaveLength(2)
  })
  it('sin reacción conocida, no inventa: N₂ + H₂ sin catalizador no es apreciable', () => {
    expect(rengBuscarReaccion([rengClaveIdentidad('Au'), rengClaveIdentidad('H2')], '').tipo).toBe('ninguna')
    const rengC = rengBuscarReaccion([rengClaveIdentidad('N2'), rengClaveIdentidad('H2')], '')
    expect(rengC.tipo === 'conocida' && rengC.faltaCatalizador).toBe(true)
    const rengF = rengBuscarReaccion([rengClaveIdentidad('N2'), rengClaveIdentidad('H2')], 'Fe')
    expect(rengF.tipo === 'conocida' && rengF.faltaCatalizador).toBe(false)
  })
})
