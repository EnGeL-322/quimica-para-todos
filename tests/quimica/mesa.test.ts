import { describe, expect, it } from 'vitest'
import { rengAnalizarFragmento, rengCompletarConH, rengFormulaConvencional, rengSmilesFragmento } from '../../src/renderer/modules/simulador-quimica/nucleo/analisisMesa'
import { rengEvaluarUnion } from '../../src/renderer/modules/simulador-quimica/nucleo/enlazar'
import { rengAlinear, rengEmparejar, rengObjetivoPara, rengPosicionesFinales } from '../../src/renderer/modules/simulador-quimica/nucleo/geometriaFinal'
import { rengAnadirAtomo, rengBorrarAtomos, rengFragmentos, rengMesaVacia, rengSepararAtomo, rengUnir, type RengMesa } from '../../src/renderer/modules/simulador-quimica/nucleo/mesa'
import { rengAngulo, rengRelajar } from '../../src/renderer/modules/simulador-quimica/nucleo/relajar'

function rengConstruir(rengEls: string[], rengUniones: Array<[number, number]>): RengMesa {
  let rengM = rengMesaVacia()
  const rengIds: number[] = []
  rengEls.forEach((rengEl, rengI) => {
    const rengR = rengAnadirAtomo(rengM, rengEl, [rengI * 1.5, (rengI % 2) * 0.7, 0])
    rengM = rengR.mesa
    rengIds.push(rengR.id)
  })
  for (const [rengA, rengB] of rengUniones) {
    const rengR = rengUnir(rengM, rengIds[rengA]!, rengIds[rengB]!)
    if (!rengR.hecho) throw new Error(`${rengEls[rengA]}–${rengEls[rengB]}: ${rengR.r.motivo}`)
    rengM = rengR.mesa
  }
  return rengM
}
const rengAnalisis = (rengM: RengMesa) => rengAnalizarFragmento(rengM, rengFragmentos(rengM)[0]!)

describe('reglas de unión (evaluarUnion)', () => {
  it('H–H sí; un segundo enlace H–H no', () => {
    expect(rengEvaluarUnion('H', 'H').permitida).toBe(true)
    const rengM = rengConstruir(['H', 'H'], [[0, 1]])
    const rengR = rengUnir(rengM, 1, 2)
    expect(rengR.hecho).toBe(false)
    expect(rengR.r.motivo).toBe('El H solo forma un enlace: su capa (1s) se completa con 2 electrones.')
  })
  it('O con 3 enlaces no, con su motivo', () => {
    const rengM = rengConstruir(['O', 'H', 'H', 'H'], [[0, 1], [0, 2]])
    const rengR = rengUnir(rengM, 1, 4)
    expect(rengR.hecho).toBe(false)
    expect(rengR.r.motivo).toBe('El O ya tiene 2 enlaces; un tercero necesitaría carga + (como en H₃O⁺) y no sería neutro.')
  })
  it('C con 5 enlaces no', () => {
    const rengM = rengConstruir(['C', 'H', 'H', 'H', 'H', 'H'], [[0, 1], [0, 2], [0, 3], [0, 4]])
    expect(rengUnir(rengM, 1, 6).r.motivo).toBe('El C ya tiene 4 enlaces: con 4 completa su octeto y no admite un quinto.')
  })
  it('He–H no; Na–Cl iónico; Na–Na metálico; Xe–F sí; F–F sí; Au–H explicado', () => {
    expect(rengEvaluarUnion('He', 'H')).toMatchObject({ permitida: false, motivo: 'El helio no forma enlaces: capa de valencia completa.' })
    expect(rengEvaluarUnion('Na', 'Cl')).toMatchObject({ permitida: true, tipo: 'ionico', electrones: 1 })
    expect(rengEvaluarUnion('Na', 'Na')).toMatchObject({ permitida: true, tipo: 'metalico' })
    expect(rengEvaluarUnion('Na', 'Na').motivo).toContain('Enlace metálico')
    expect(rengEvaluarUnion('Xe', 'F')).toMatchObject({ permitida: true, tipo: 'covalente-polar' })
    expect(rengEvaluarUnion('F', 'F')).toMatchObject({ permitida: true, tipo: 'covalente-apolar' })
    const rengAu = rengEvaluarUnion('Au', 'H')
    expect(rengAu).toMatchObject({ permitida: false, forzable: true })
    expect(rengAu.motivo).toBe('No se forma un hidruro de oro estable en condiciones normales; AuH solo se ha observado como molécula aislada en fase gaseosa.')
    expect(rengEvaluarUnion('Ar', 'Cl').permitida).toBe(false)
    expect(rengEvaluarUnion('Cm', 'Bk').motivo).toMatch(/radio covalente/)
  })
  it('cada motivo de rechazo es un texto distinto', () => {
    const rengMotivos = [rengEvaluarUnion('He', 'H').motivo, rengEvaluarUnion('Ne', 'F').motivo, rengEvaluarUnion('Ar', 'Cl').motivo, rengEvaluarUnion('Au', 'H').motivo, rengEvaluarUnion('Cm', 'Bk').motivo]
    expect(new Set(rengMotivos).size).toBe(rengMotivos.length)
  })
  it('N≡N: dos uniones más suben el orden hasta triple; un cuarto, no', () => {
    const rengM = rengConstruir(['N', 'N'], [[0, 1], [0, 1], [0, 1]])
    expect(rengM.enlaces[0]!.orden).toBe(3)
    expect(rengUnir(rengM, 1, 2).hecho).toBe(false)
  })
  it('Na⁺ Cl⁻: cargas por la transferencia; el Na no cede un segundo electrón', () => {
    const rengM = rengConstruir(['Na', 'Cl', 'Cl'], [[0, 1]])
    expect(rengM.atomos.map((rengA) => rengA.carga)).toEqual([1, -1, 0])
    expect(rengUnir(rengM, 1, 3).r.motivo).toMatch(/ya ha cedido su electrón/)
  })
  it('MgCl₂: el Mg cede un electrón a cada Cl y queda Mg²⁺', () => {
    const rengM = rengConstruir(['Mg', 'Cl', 'Cl'], [[0, 1], [0, 2]])
    expect(rengM.atomos.map((rengA) => rengA.carga)).toEqual([2, -1, -1])
    expect(rengAnalisis(rengM)).toMatchObject({ completa: true, formula: 'MgCl2', nombre: 'cloruro de magnesio' })
  })
  it('hipervalencia: S con 6 F sí (con aviso), S con 3 H no', () => {
    const rengM = rengConstruir(['S', 'F', 'F', 'F', 'F', 'F', 'F'], [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]])
    expect(rengAnalisis(rengM)).toMatchObject({ completa: true, formula: 'SF6' })
    expect(rengEvaluarUnion('S', 'H', { ordenEntre: 0, enlacesA: 2, enlacesB: 0, ionicoA: 0, ionicoB: 0, cargaA: 0, cargaB: 0 }).permitida).toBe(false)
  })
})

describe('construir moléculas con operaciones puras: fórmula, nombre y SMILES', () => {
  const rengCasos: Array<[string, string[], Array<[number, number]>, string, string]> = [
    ['agua', ['O', 'H', 'H'], [[0, 1], [0, 2]], 'H2O', 'agua'],
    ['metano', ['C', 'H', 'H', 'H', 'H'], [[0, 1], [0, 2], [0, 3], [0, 4]], 'CH4', 'metano'],
    ['amoniaco', ['N', 'H', 'H', 'H'], [[0, 1], [0, 2], [0, 3]], 'H3N', 'amoniaco'],
    ['dióxido de carbono', ['O', 'C', 'O'], [[0, 1], [0, 1], [1, 2], [1, 2]], 'CO2', 'dióxido de carbono'],
    ['eteno', ['C', 'C', 'H', 'H', 'H', 'H'], [[0, 1], [0, 1], [0, 2], [0, 3], [1, 4], [1, 5]], 'C2H4', 'eteno'],
    ['nitrógeno', ['N', 'N'], [[0, 1], [0, 1], [0, 1]], 'N2', 'nitrógeno'],
    ['cloruro de hidrógeno', ['H', 'Cl'], [[0, 1]], 'HCl', 'cloruro de hidrógeno']
  ]
  for (const [rengTitulo, rengEls, rengUniones, rengFormula, rengNombre] of rengCasos)
    it(rengTitulo, () => {
      const rengA = rengAnalisis(rengConstruir(rengEls, rengUniones))
      expect(rengA.completa).toBe(true)
      expect(rengA.formula.replace('H3N', 'H3N')).toBe(rengFormula === 'H3N' ? 'NH3' : rengFormula)
      expect(rengA.nombre).toBe(rengNombre)
      expect(rengA.existencia).toMatch(/^Compuesto conocido/)
      if (!rengA.ionico) expect(rengA.smiles).not.toBeNull()
    })
  it('NaCl: par iónico, sin SMILES, nombre por la fórmula', () => {
    const rengA = rengAnalisis(rengConstruir(['Na', 'Cl'], [[0, 1]]))
    expect(rengA).toMatchObject({ completa: true, ionico: true, formula: 'NaCl', nombre: 'cloruro de sodio', smiles: null })
  })
  it('incompleto: «faltan 2 H» y «Completar con H» lo cierra como agua', () => {
    const rengM = rengConstruir(['O'], [])
    const rengM2 = rengConstruir(['O', 'H'], [[0, 1]])
    expect(rengAnalisis(rengM2)).toMatchObject({ completa: false, libres: 1 })
    const rengO = rengAnalisis(rengM)
    expect(rengO.completa).toBe(false)
    const rengLleno = rengCompletarConH(rengM, [1])
    expect(rengAnalisis(rengLleno)).toMatchObject({ completa: true, formula: 'H2O', nombre: 'agua' })
  })
  it('fórmula convencional', () => {
    expect(rengFormulaConvencional(['Cl', 'Na'])).toBe('NaCl')
    expect(rengFormulaConvencional(['N', 'H', 'H', 'H'])).toBe('NH3')
    expect(rengFormulaConvencional(['F', 'Xe', 'F'])).toBe('XeF2')
    expect(rengFormulaConvencional(['O', 'C', 'O'])).toBe('CO2')
  })
  it('SMILES con anillo: ciclopropano', () => {
    const rengM = rengConstruir(['C', 'C', 'C'], [[0, 1], [1, 2], [2, 0]])
    expect(rengSmilesFragmento(rengM, [1, 2, 3])).toBe('[C]1[C][C]1')
  })
  it('separar y borrar devuelven las cargas iónicas', () => {
    const rengM = rengConstruir(['Na', 'Cl'], [[0, 1]])
    expect(rengSepararAtomo(rengM, 1).atomos.map((rengA) => rengA.carga)).toEqual([0, 0])
    expect(rengBorrarAtomos(rengM, new Set([2])).atomos).toEqual([{ id: 1, el: 'Na', carga: 0, p: [0, 0, 0] }])
  })
})

describe('forma: relajación VSEPR y geometría final', () => {
  it('relajación: CH₄ ≈ tetraédrico y CO₂ lineal', () => {
    const rengP = rengRelajar([[0, 0, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0.1], [0, -1, 0.2]], ['C', 'H', 'H', 'H', 'H'], [0, 0, 0, 0, 0], [1, 2, 3, 4].map((rengI) => ({ a: 0, b: rengI, orden: 1, tipo: 'covalente-apolar' as const })), { pasos: 300 })
    for (const [rengA, rengB] of [[1, 2], [1, 3], [2, 4]] as const) expect(Math.abs(rengAngulo(rengP, rengA, 0, rengB) - 109.47)).toBeLessThan(3)
    const rengQ = rengRelajar([[-1, 0.3, 0], [0, 0, 0], [1, 0.2, 0]], ['O', 'C', 'O'], [0, 0, 0], [{ a: 0, b: 1, orden: 2, tipo: 'covalente-polar' }, { a: 1, b: 2, orden: 2, tipo: 'covalente-polar' }], { pasos: 300 })
    expect(rengAngulo(rengQ, 0, 1, 2)).toBeGreaterThan(175)
  })
  it('agua: la geometría final es la experimental (104,5°), emparejada y alineada', () => {
    const rengObj = rengObjetivoPara('h2o', null)!
    const rengActual = { el: ['H', 'O', 'H'], enlaces: [[1, 0], [1, 2]] as Array<[number, number]>, pos: [[1, 0, 0], [0, 0, 0], [0, 1, 0]] as Array<[number, number, number]> }
    const rengFin = rengPosicionesFinales(rengActual, rengObj)!
    expect(rengAngulo(rengFin, 0, 1, 2)).toBeCloseTo(104.52, 1)
    expect(rengObj.origen).toBe('experimental')
  })
  it('CH₄ 109,5° y CO₂ 180° experimentales', () => {
    const rengCh4 = rengObjetivoPara('ch4', null)!
    expect(rengAngulo(rengCh4.pos, 1, 0, 2)).toBeCloseTo(109.47, 1)
    const rengCo2 = rengObjetivoPara('co2', null)!
    expect(rengAngulo(rengCo2.pos, 0, 1, 2)).toBeCloseTo(180, 3)
  })
  it('alinear: una copia girada vuelve a superponerse', () => {
    const rengP: Array<[number, number, number]> = [[0, 0, 0], [1, 0, 0], [0, 1.2, 0], [0, 0, 0.8]]
    const rengGiro = rengP.map(([rengX, rengY, rengZ]) => [rengY + 3, -rengX, rengZ + 1] as [number, number, number])
    const rengA = rengAlinear(rengGiro, rengP)
    for (let rengI = 0; rengI < rengP.length; rengI++) for (let rengK = 0; rengK < 3; rengK++) expect(rengA[rengI]![rengK]).toBeCloseTo(rengP[rengI]![rengK]!, 6)
  })
  it('emparejar respeta elementos y conectividad', () => {
    expect(rengEmparejar({ el: ['H', 'O', 'H'], enlaces: [[0, 1], [1, 2]] }, { el: ['O', 'H', 'H'], enlaces: [[0, 1], [0, 2]] })).toEqual([1, 0, 2])
    expect(rengEmparejar({ el: ['H', 'O'], enlaces: [[0, 1]] }, { el: ['H', 'H'], enlaces: [[0, 1]] })).toBeNull()
  })
})
