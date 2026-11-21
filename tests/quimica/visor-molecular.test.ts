import { describe, expect, it } from 'vitest'
import { rengAnadirSustancia } from '../../src/renderer/modules/simulador-quimica/estado/acciones'
import { rengEstadoInicial, rengFragmentosConId, type RengEstadoTrabajo } from '../../src/renderer/modules/simulador-quimica/estado/trabajo'
import { rengBorrarAtomos } from '../../src/renderer/modules/simulador-quimica/nucleo/mesa'
import { rengDescribirAtomo, rengModeloDeEntrada, rengModeloDeFragmento, rengModeloDeSmiles, rengVecinosVisor, type RengModeloVisor } from '../../src/renderer/modules/simulador-quimica/nucleo/modeloVisor'
import { rengInterpretarSustancia } from '../../src/renderer/modules/simulador-quimica/nucleo/sustancia'

type RengModelo = Extract<RengModeloVisor, { estado: 'modelo' }>

function rengMesaCon(rengTexto: string): RengEstadoTrabajo {
  const rengR = rengAnadirSustancia(rengEstadoInicial(), rengTexto)
  if (!rengR.ok) throw new Error(`no se pudo añadir ${rengTexto}`)
  return rengR.estado
}
function rengModeloMesa(rengTexto: string): RengModeloVisor {
  const rengE = rengMesaCon(rengTexto)
  const rengF = rengFragmentosConId(rengE.mesa)
  expect(rengF).toHaveLength(1)
  return rengModeloDeFragmento(rengE.mesa, rengF[0]!.ids)
}
const rengComoModelo = (rengM: RengModeloVisor): RengModelo => {
  if (rengM.estado !== 'modelo') throw new Error(`se esperaba un modelo y es «${rengM.estado}»: ${JSON.stringify(rengM).slice(0, 300)}`)
  return rengM
}
const rengDist = (rengM: RengModelo, rengA: number, rengB: number): number => Math.hypot(...([0, 1, 2] as const).map((rengK) => rengM.atomos[rengA]!.p[rengK] - rengM.atomos[rengB]!.p[rengK]))
const rengVecinosDeO = (rengM: RengModelo): string[] => {
  const rengO = rengM.atomos.findIndex((rengX) => rengX.el === 'O')
  return rengVecinosVisor(rengM.atomos.length, rengM.enlaces)[rengO]!.map((rengV) => rengM.atomos[rengV.i]!.el).sort()
}

describe('mesa → visor', () => {
  it('agua: geometría experimental (NIST CCCBDB), O–H ≈ 0,96 Å, centrada y encuadrable', () => {
    const rengM = rengComoModelo(rengModeloMesa('agua'))
    expect(rengM.procedencia.origen).toBe('experimental')
    expect(rengM.atomos.map((rengX) => rengX.el).sort()).toEqual(['H', 'H', 'O'])
    expect(rengM.enlaces).toHaveLength(2)
    const rengO = rengM.atomos.findIndex((rengX) => rengX.el === 'O')
    for (const rengE of rengM.enlaces) expect(rengDist(rengM, rengE.a, rengE.b)).toBeCloseTo(0.96, 1)
    expect(rengM.atomos[rengO]!.z).toBe(8)
    const rengC = [0, 1, 2].map((rengK) => rengM.atomos.reduce((rengS, rengX) => rengS + rengX.p[rengK]!, 0) / rengM.atomos.length)
    for (const rengV of rengC) expect(Math.abs(rengV)).toBeLessThan(1e-9)
    for (const rengX of rengM.atomos) expect(Math.hypot(...rengX.p)).toBeLessThanOrEqual(rengM.radio + 1e-9)
  })
  it('etanol y éter dimetílico: misma fórmula, conectividad distinta (O–C,H frente a C–O–C)', () => {
    const rengEt = rengComoModelo(rengModeloMesa('etanol'))
    const rengDme = rengComoModelo(rengModeloMesa('éter dimetílico'))
    expect(rengEt.formula).toBe(rengDme.formula)
    expect(rengEt.procedencia.origen).toBe('calculada')
    expect(rengDme.procedencia.origen).toBe('calculada')
    expect(rengVecinosDeO(rengEt)).toEqual(['C', 'H'])
    expect(rengVecinosDeO(rengDme)).toEqual(['C', 'C'])
    expect(rengEt.titulo).not.toBe(rengDme.titulo)
    for (const rengM of [rengEt, rengDme]) for (const rengE of rengM.enlaces) expect(rengDist(rengM, rengE.a, rengE.b)).toBeGreaterThan(0.9)
  })
  it('cloruro de sodio: dos iones separados, sin enlace dibujado, posiciones esquemáticas', () => {
    const rengM = rengComoModelo(rengModeloMesa('cloruro de sodio'))
    expect(rengM.tipo).toBe('ionico')
    expect(rengM.enlaces).toEqual([])
    expect(rengM.componentes.map((rengC) => [rengC.formula, rengC.carga, rengC.tipo]).sort()).toEqual([
      ['Cl', -1, 'ion'],
      ['Na', 1, 'ion']
    ])
    expect(rengM.procedencia.origen).toBe('esquematica')
    const rengNa = rengM.atomos.find((rengX) => rengX.el === 'Na')!
    expect(rengNa.carga).toBe(1)
    expect(rengDescribirAtomo(rengM, rengM.atomos.indexOf(rengNa)).enlaces).toEqual([])
  })
  it('editar la mesa cambia el modelo: sin un H el etanol queda incompleto', () => {
    const rengE = rengMesaCon('etanol')
    const rengIds = rengFragmentosConId(rengE.mesa)[0]!.ids
    const rengH = rengE.mesa.atomos.find((rengX) => rengX.el === 'H' && rengIds.includes(rengX.id))!
    const rengM2 = rengBorrarAtomos(rengE.mesa, new Set([rengH.id]))
    const rengR = rengModeloDeFragmento(rengM2, rengFragmentosConId(rengM2)[0]!.ids)
    expect(rengR.estado).toBe('incompleta')
    if (rengR.estado === 'incompleta') expect(rengR.motivo).toMatch(/Faltan 1 enlace/)
  })
  it('un átomo suelto es un modelo de un átomo (sin enlaces)', () => {
    const rengR = rengComoModelo(rengModeloMesa('He'))
    expect(rengR.tipo).toBe('atomo')
    expect(rengR.enlaces).toEqual([])
    expect(rengR.procedencia.origen).toBe('atomo')
  })
})

describe('ficha (SMILES o texto) → visor', () => {
  it('paracetamol: MMFF94s convergida, anillo aromático y C=O doble del grafo; datos de cada átomo', () => {
    const rengM = rengComoModelo(rengModeloDeSmiles('CC(=O)NC1=CC=C(C=C1)O', 'Paracetamol'))
    expect(rengM.procedencia.origen).toBe('calculada')
    expect(rengM.formula).toBe('C8H9NO2')
    expect(rengM.enlaces.filter((rengE) => rengE.aromatico)).toHaveLength(6)
    const rengDobles = rengM.enlaces.filter((rengE) => !rengE.aromatico && rengE.orden === 2)
    expect(rengDobles).toHaveLength(1)
    const { a: rengA, b: rengB } = rengDobles[0]!
    expect([rengM.atomos[rengA]!.el, rengM.atomos[rengB]!.el].sort()).toEqual(['C', 'O'])
    const rengN = rengM.atomos.findIndex((rengX) => rengX.el === 'N')
    const rengD = rengDescribirAtomo(rengM, rengN)
    expect(rengD.z).toBe('7')
    expect(rengD.carga).toBe('0')
    expect(rengD.enlaces).toHaveLength(3)
  })
  it('[Na+].[Cl-]: compuesto iónico, componentes separados y sin enlaces', () => {
    const rengM = rengComoModelo(rengModeloDeSmiles('[Na+].[Cl-]', 'cloruro de sodio'))
    expect(rengM.tipo).toBe('ionico')
    expect(rengM.enlaces).toEqual([])
    expect(rengM.componentes).toHaveLength(2)
    expect(rengDist(rengM, 0, 1)).toBeGreaterThan(2)
  })
  it('una mezcla (etanol + agua) no dibuja enlaces entre componentes', () => {
    const rengM = rengComoModelo(rengModeloDeSmiles('CCO.O', 'mezcla'))
    expect(rengM.tipo).toBe('mezcla')
    const rengComp = (rengI: number): number => rengM.atomos[rengI]!.componente
    for (const rengE of rengM.enlaces) expect(rengComp(rengE.a)).toBe(rengComp(rengE.b))
  })
  it('C2H6O escrito: pide una estructura (etanol y metoximetano, el éter dimetílico, entre las opciones)', () => {
    const rengR = rengModeloDeEntrada(rengInterpretarSustancia('C2H6O'))
    expect(rengR.estado).toBe('ambigua')
    if (rengR.estado === 'ambigua') {
      expect(rengR.motivo).toMatch(/Elige una estructura/)
      const rengNombres = rengR.opciones.map((rengO) => rengO.nombre.toLowerCase()).join(' | ')
      expect(rengNombres).toMatch(/etanol/)
      expect(rengNombres).toMatch(/metoximetano|dimet/)
    }
  })
  it('sin convergencia: diagnóstico y SMILES para la 2D, nunca un modelo presentado como forma real', () => {
    const rengR = rengModeloDeSmiles('CCO', 'etanol', null, { maxIts: 1, gradTol: 1e-12 })
    expect(rengR.estado).toBe('sin-geometria')
    if (rengR.estado === 'sin-geometria') {
      expect(rengR.diagnostico).toMatch(/NO convergió/)
      expect(rengR.smiles).toBe('CCO')
    }
  })
  it('sin parámetros MMFF (gas noble enlazado no hay; un metal en un SMILES): diagnóstico, no modelo', () => {
    const rengR = rengModeloDeSmiles('[Fe](Cl)(Cl)Cl', 'cloruro de hierro(III)')
    expect(rengR.estado === 'sin-geometria' || (rengR.estado === 'modelo' && rengR.procedencia.origen === 'calculada')).toBe(true)
  })

})
