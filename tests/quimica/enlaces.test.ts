import { describe, expect, it } from 'vitest'
import { rengAlternar, rengAnterior, rengAvanzar, rengEstadoInicial, rengPosicion, rengProgresoTotal, rengSiguiente, rengSuavizar, rengTramo } from '../../src/renderer/modules/simulador-quimica/escena/secuenciador'
import { rengCoordinacion, RENG_ESTRUCTURAS, rengIonesPorCelda, rengUnidadesFormula } from '../../src/renderer/modules/simulador-quimica/nucleo/cristales'
import {
  RENG_AFINIDAD_EV,
  RENG_DIATOMICAS,
  rengEnergiaCoulombPar,
  RENG_IONIZACION_EV,
  RENG_KJMOL_POR_EV,
  rengMorse,
  RENG_PARAMETRO_RED,
  rengParametrosMorse,
  RENG_RADIO_IONICO
} from '../../src/renderer/modules/simulador-quimica/nucleo/datosEnlace'
import { rengCaracterIonico, rengElectronegatividad, rengTipoPorDiferencia } from '../../src/renderer/modules/simulador-quimica/nucleo/electronegatividad'

const rengCerca = (rengA: number, rengB: number, rengTol: number): void => expect(Math.abs(rengA - rengB)).toBeLessThanOrEqual(rengTol)

describe('secuenciador', () => {
  const rengDur = [1, 2, 1]
  it('suavizado y tramos', () => {
    expect(rengSuavizar(0)).toBe(0)
    expect(rengSuavizar(1)).toBe(1)
    rengCerca(rengSuavizar(0.5), 0.5, 1e-12)
    expect(rengTramo(1.5, 2, 3)).toBe(0)
    expect(rengTramo(3.2, 2, 3)).toBe(1)
  })
  it('reproduce de seguido hasta el final', () => {
    let rengE = rengAlternar(rengEstadoInicial(), 3)
    rengE = rengAvanzar(rengE, 1.01, rengDur)
    expect(rengE.paso).toBe(1)
    rengE = rengAvanzar(rengAvanzar(rengE, 2.01, rengDur), 1.01, rengDur)
    expect(rengE).toMatchObject({ paso: 2, t: 1, reproduciendo: false })
    expect(rengProgresoTotal(rengE, 3)).toBe(1)
    expect(rengAlternar(rengE, 3)).toMatchObject({ paso: 0, t: 0, reproduciendo: true })
  })
  it('en pausa, «siguiente» reproduce solo ese paso y se detiene', () => {
    let rengE = rengSiguiente(rengEstadoInicial(), 3)
    expect(rengE).toMatchObject({ paso: 1, t: 0, reproduciendo: true, soloEstePaso: true })
    rengE = rengAvanzar(rengE, 5, rengDur)
    expect(rengE).toMatchObject({ paso: 1, t: 1, reproduciendo: false })
    expect(rengPosicion(rengE)).toBe(2)
    expect(rengAnterior(rengE, 3).paso).toBe(0)
    expect(rengAnterior(rengEstadoInicial(), 3).paso).toBe(0)
  })
  it('duración 0 (movimiento reducido) completa el paso al instante', () => {
    const rengE = rengAvanzar(rengSiguiente(rengEstadoInicial(), 3), 0.001, [0, 0, 0])
    expect(rengE).toMatchObject({ paso: 1, t: 1, reproduciendo: false })
  })
})

describe('electronegatividad (Pauling)', () => {
  it('valores de control y clasificación orientativa', () => {
    expect(rengElectronegatividad('F')).toBe(3.98)
    expect(rengElectronegatividad('Na')).toBe(0.93)
    expect(rengElectronegatividad('He')).toBeNull()
    const rengD = (rengA: string, rengB: string): number => Math.abs(rengElectronegatividad(rengA)! - rengElectronegatividad(rengB)!)
    expect(rengTipoPorDiferencia(rengD('Na', 'Cl'))).toBe('ionico')
    expect(rengTipoPorDiferencia(rengD('Mg', 'O'))).toBe('ionico')
    expect(rengTipoPorDiferencia(rengD('Ca', 'F'))).toBe('ionico')
    expect(rengTipoPorDiferencia(rengD('H', 'Cl'))).toBe('polar')
    expect(rengTipoPorDiferencia(rengD('O', 'H'))).toBe('polar')
    expect(rengTipoPorDiferencia(rengD('Cl', 'Cl'))).toBe('apolar')
    expect(rengTipoPorDiferencia(rengD('C', 'H'))).toBe('apolar')
    rengCerca(rengCaracterIonico(1.7), 51.4, 0.1)
  })
})

describe('datos del enlace iónico', () => {
  it('conversiones y valores en kJ/mol', () => {
    rengCerca(RENG_KJMOL_POR_EV, 96.485, 1e-3)
    rengCerca(RENG_IONIZACION_EV.Na!.valor[0]! * RENG_KJMOL_POR_EV, 495.8, 0.1)
    rengCerca(RENG_AFINIDAD_EV.Cl!.valor * RENG_KJMOL_POR_EV, 348.6, 0.1)
    rengCerca(rengEnergiaCoulombPar(1, -1, 2.82), -492.7, 0.2)
  })
  it('los radios de Shannon suman la distancia catión-anión de la red (±0,08 Å)', () => {
    const rengR = (rengIon: string): number => RENG_RADIO_IONICO[rengIon]!.valor.r
    rengCerca(RENG_PARAMETRO_RED.NaCl!.valor / 2, rengR('Na+') + rengR('Cl-'), 0.08)
    rengCerca(RENG_PARAMETRO_RED.MgO!.valor / 2, rengR('Mg2+') + rengR('O2-'), 0.08)
    rengCerca((RENG_PARAMETRO_RED.CaF2!.valor * Math.sqrt(3)) / 4, rengR('Ca2+') + rengR('F-'), 0.08)
    rengCerca((RENG_PARAMETRO_RED.CsCl!.valor * Math.sqrt(3)) / 2, rengR('Cs+') + rengR('Cl-'), 0.08)
  })
  it('el catión es más pequeño que su átomo y el anión más grande (coherencia con Cordero)', () => {
    expect(RENG_RADIO_IONICO['Na+']!.valor.r).toBeLessThan(1.66)
    expect(RENG_RADIO_IONICO['Cl-']!.valor.r).toBeGreaterThan(1.02)
  })
})

describe('curva de Morse', () => {
  for (const rengD of Object.values(RENG_DIATOMICAS)) {
    it(`${rengD.formula}: mínimo en r_e, profundidad D_e y curvatura k = μω²`, () => {
      const rengP = rengParametrosMorse(rengD)
      rengCerca(rengMorse(rengP, rengD.re), -rengP.De, 1e-9)
      expect(rengMorse(rengP, rengD.re * 0.98)).toBeGreaterThan(-rengP.De)
      expect(rengMorse(rengP, rengD.re * 1.02)).toBeGreaterThan(-rengP.De)
      rengCerca(rengMorse(rengP, 50), 0, 1e-6)
      expect(rengP.De).toBeGreaterThan(rengP.D0)
      const rengH = 1e-4
      const rengK = (rengMorse(rengP, rengD.re + rengH) - 2 * rengMorse(rengP, rengD.re) + rengMorse(rengP, rengD.re - rengH)) / (rengH * rengH)
      const rengKSI = (rengK * 1000) / 6.02214076e23 / 1e-20
      const rengW = 2 * Math.PI * 299792458 * rengD.we * 100
      rengCerca(rengKSI / (rengD.mu * 1.6605390666e-27 * rengW * rengW), 1, 1e-3)
    })
  }
  it('energías de enlace D₀ de referencia (kJ/mol)', () => {
    rengCerca(rengParametrosMorse(RENG_DIATOMICAS.H2!).D0, 432.1, 0.2)
    rengCerca(rengParametrosMorse(RENG_DIATOMICAS.HCl!).D0, 427.8, 0.2)
    rengCerca(rengParametrosMorse(RENG_DIATOMICAS.Cl2!).D0, 239.2, 0.2)
    rengCerca(rengParametrosMorse(RENG_DIATOMICAS.H2!).De / RENG_KJMOL_POR_EV, 4.7474, 0.01)
  })
})

describe('redes cristalinas', () => {
  it('NaCl: 4 unidades por celda y coordinación 6:6', () => {
    const rengE = RENG_ESTRUCTURAS.NaCl!
    expect(Object.fromEntries(rengIonesPorCelda(rengE))).toEqual({ 'Na+': 4, 'Cl-': 4 })
    expect(rengUnidadesFormula(rengE)).toBe(4)
    expect(rengCoordinacion(rengE, 'Na+').nc).toBe(6)
    expect(rengCoordinacion(rengE, 'Cl-').nc).toBe(6)
    rengCerca(rengCoordinacion(rengE, 'Na+').distancia, rengE.a / 2, 1e-9)
  })
  it('CsCl: 1 unidad y coordinación 8:8', () => {
    const rengE = RENG_ESTRUCTURAS.CsCl!
    expect(rengUnidadesFormula(rengE)).toBe(1)
    expect(rengCoordinacion(rengE, 'Cs+').nc).toBe(8)
    expect(rengCoordinacion(rengE, 'Cl-').nc).toBe(8)
  })
  it('CaF₂: 4 unidades y coordinación 8:4', () => {
    const rengE = RENG_ESTRUCTURAS.CaF2!
    expect(Object.fromEntries(rengIonesPorCelda(rengE))).toEqual({ 'Ca2+': 4, 'F-': 8 })
    expect(rengUnidadesFormula(rengE)).toBe(4)
    expect(rengCoordinacion(rengE, 'Ca2+').nc).toBe(8)
    expect(rengCoordinacion(rengE, 'F-').nc).toBe(4)
  })
  it('toda estructura y dato tiene fuente', () => {
    for (const rengE of Object.values(RENG_ESTRUCTURAS)) expect(rengE.fuente.trim()).not.toBe('')
    for (const rengT of [RENG_IONIZACION_EV, RENG_AFINIDAD_EV, RENG_RADIO_IONICO, RENG_PARAMETRO_RED]) for (const rengV of Object.values(rengT)) expect(rengV.fuente.trim()).not.toBe('')
    for (const rengD of Object.values(RENG_DIATOMICAS)) expect(rengD.fuente.trim()).not.toBe('')
  })
})

import { rengAjustarEcuacion as rengAjustar } from '../../src/renderer/modules/simulador-quimica/nucleo/ajuste'
import { rengAnalizarNotacion } from '../../src/renderer/modules/simulador-quimica/nucleo/notacion'
import { RENG_SECUENCIAS, RENG_TIPOS_ENLACE } from '../../src/renderer/modules/simulador-quimica/enlaces/secuencias'
import { rengDistanciaEnlace, RENG_LEJOS } from '../../src/renderer/modules/simulador-quimica/escena/trayectorias'

describe('secuencias de enlace', () => {
  it('hay secuencias de los seis tipos de enlace', () => {
    expect(RENG_SECUENCIAS.map((rengS) => rengS.id)).toEqual(['nacl', 'mgo', 'caf2', 'h2', 'cl2', 'hcl', 'h2o', 'o2', 'n2', 'c2h4', 'c2h2', 'nh4', 'h3o', 'nh3bf3', 'cunh3', 'na', 'cu', 'fe', 'inter'])
    expect(new Set(RENG_SECUENCIAS.map((rengS) => rengS.tipo))).toEqual(new Set(RENG_TIPOS_ENLACE.map((rengT) => rengT.tipo)))
    expect(new Set(RENG_SECUENCIAS.map((rengS) => rengS.id)).size).toBe(RENG_SECUENCIAS.length)
  })
  it('solo C₂H₄ tiene el paso de giro bloqueado; σ y π cuadran con el orden de enlace', () => {
    const rengM = RENG_SECUENCIAS.filter((rengS) => rengS.tipo === 'multiple')
    expect(rengM.map((rengS) => [rengS.id, rengS.pasos.length])).toEqual([
      ['o2', 4],
      ['n2', 4],
      ['c2h4', 5],
      ['c2h2', 4]
    ])
    const rengAvanz = (rengId: string): Record<string, string> => Object.fromEntries(rengM.find((rengS) => rengS.id === rengId)!.pasos[3]!.avanzado!)
    expect([rengAvanz('c2h4')['Enlaces σ'], rengAvanz('c2h4')['Enlaces π']]).toEqual(['5', '1'])
    expect([rengAvanz('c2h2')['Enlaces σ'], rengAvanz('c2h2')['Enlaces π']]).toEqual(['3', '2'])
    expect([rengAvanz('n2')['Enlaces σ'], rengAvanz('n2')['Enlaces π']]).toEqual(['1', '2'])
    expect(RENG_SECUENCIAS.find((rengS) => rengS.id === 'o2')!.saberMas.join(' ')).toMatch(/paramagnético/)
  })
  for (const rengS of RENG_SECUENCIAS) {
    it(`${rengS.formula}: notaciones legibles, ecuaciones bien ajustadas y fuentes`, () => {
      expect(rengS.pasos.length).toBeGreaterThanOrEqual(4)
      expect(rengS.fuentes.every((rengF) => rengF.trim() !== '')).toBe(true)
      for (const rengP of rengS.pasos) {
        expect(rengP.titulo.length).toBeGreaterThan(3)
        expect(rengP.duracion).toBeGreaterThan(0)
        for (const rengN of rengP.notaciones) {
          const rengNot = rengAnalizarNotacion(rengN)
          if (!rengNot.flecha) continue
          const rengAj = rengAjustar(rengN)
          const rengEscritos = [...rengNot.izquierda, ...rengNot.derecha].map((rengE) => Number(rengE.coef ?? '1'))
          const rengMinimos = [...rengAj.reactivos, ...rengAj.productos].map((rengT) => rengT.coef)
          const rengK = rengEscritos[0]! / rengMinimos[0]!
          rengEscritos.forEach((rengC, rengI) => expect(rengC).toBeCloseTo(rengK * rengMinimos[rengI]!, 9))
        }
      }
    })
  }
  it('la polaridad sale de las electronegatividades', () => {
    const rengPol = Object.fromEntries(RENG_SECUENCIAS.filter((rengS) => rengS.tipo === 'covalente').map((rengS) => [rengS.formula, rengS.tipo === 'covalente' && rengS.polar]))
    expect(rengPol).toEqual({ H2: false, Cl2: false, HCl: true, H2O: true })
  })
  it('la trayectoria de la distancia empieza lejos y acaba en rₑ', () => {
    expect(rengDistanciaEnlace(0, 1)).toBe(RENG_LEJOS)
    expect(rengDistanciaEnlace(2, 1)).toBeCloseTo(1, 9)
    expect(rengDistanciaEnlace(3, 1)).toBe(1)
    expect(rengDistanciaEnlace(5, 0.74)).toBe(0.74)
  })
})

import * as THREE from 'three'
import { rengAtomosPorCelda } from '../../src/renderer/modules/simulador-quimica/nucleo/cristales'
import { RENG_COMPUESTOS_BINARIOS, RENG_ESTADOS_COMUNES } from '../../src/renderer/modules/simulador-quimica/nucleo/compuestosBinarios'
import { rengCombinar } from '../../src/renderer/modules/simulador-quimica/nucleo/constructor'
import { RENG_DISTANCIAS_INTER, RENG_EBULLICION_C, RENG_ENERGIAS_INTERACCION, RENG_GEOMETRIAS } from '../../src/renderer/modules/simulador-quimica/nucleo/datosEnlace'
import { rengAnalizarFormula } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { rengHuecos, rengRepartoLewis } from '../../src/renderer/modules/simulador-quimica/escena/lewis'
import { rengAleatorio, rengGiroBloqueado } from '../../src/renderer/modules/simulador-quimica/escena/trayectorias'

describe('metales: bcc y fcc', () => {
  it('bcc (Na, Fe): coordinación 8 y 2 átomos por celda; fcc (Cu): 12 y 4', () => {
    for (const rengId of ['Na', 'Fe']) {
      expect(rengCoordinacion(RENG_ESTRUCTURAS[rengId]!, rengId).nc).toBe(8)
      expect(rengAtomosPorCelda(RENG_ESTRUCTURAS[rengId]!)).toBe(2)
      rengCerca(rengCoordinacion(RENG_ESTRUCTURAS[rengId]!, rengId).distancia, (RENG_ESTRUCTURAS[rengId]!.a * Math.sqrt(3)) / 2, 1e-9)
    }
    expect(rengCoordinacion(RENG_ESTRUCTURAS.Cu!, 'Cu').nc).toBe(12)
    expect(rengAtomosPorCelda(RENG_ESTRUCTURAS.Cu!)).toBe(4)
    rengCerca(rengCoordinacion(RENG_ESTRUCTURAS.Cu!, 'Cu').distancia, RENG_ESTRUCTURAS.Cu!.a / Math.SQRT2, 1e-9)
  })
  it('el ion sigue contando solo vecinos de carga opuesta', () => {
    expect(rengCoordinacion(RENG_ESTRUCTURAS.NaCl!, 'Na+').nc).toBe(6)
  })
})

describe('Morse de O₂ y N₂', () => {
  it('energías de enlace D₀ (kJ/mol)', () => {
    rengCerca(rengParametrosMorse(RENG_DIATOMICAS.O2!).D0, 493.6, 0.2)
    rengCerca(rengParametrosMorse(RENG_DIATOMICAS.N2!).D0, 941.6, 0.3)
  })
})

describe('piezas de Lewis', () => {
  it('reparto de electrones: O (enlace doble) deja dos sin emparejar; C sp² tiene uno en el orbital p', () => {
    expect(rengRepartoLewis(6, 1)).toEqual([1, 2, 2, 1])
    expect(rengRepartoLewis(5, 1)).toEqual([1, 2, 1, 1])
    expect(rengRepartoLewis(4, 3)).toEqual([1, 1, 1, 1])
    expect(rengRepartoLewis(1, 1)).toEqual([1, 0, 0, 0])
  })
  it('huecos sp: dos ejes perpendiculares al enlace', () => {
    const rengH = rengHuecos([new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0)])
    expect(Math.abs(rengH[2]!.x)).toBeLessThan(1e-9)
    expect(Math.abs(rengH[2]!.dot(rengH[3]!))).toBeLessThan(1e-9)
  })
  it('el giro del doble enlace vuelve a 0 (se bloquea)', () => {
    expect(rengGiroBloqueado(3.9)).toBe(0)
    expect(rengGiroBloqueado(4.4)).toBeGreaterThan(0.5)
    rengCerca(rengGiroBloqueado(4.85), 0, 1e-9)
  })
  it('el azar con semilla es reproducible (adelante y atrás dan lo mismo)', () => {
    const rengA = rengAleatorio(7)
    const rengB = rengAleatorio(7)
    const rengXa = [rengA(), rengA(), rengA()]
    expect([rengB(), rengB(), rengB()]).toEqual(rengXa)
    expect(rengXa.every((rengX) => rengX >= 0 && rengX < 1)).toBe(true)
  })
})

describe('constructor «Elige dos elementos»', () => {
  const rengFormulas = (rengA: string, rengB: string): string[] => rengCombinar(rengA, rengB).propuestas.map((rengP) => rengP.formula)
  const rengConocidas = (rengA: string, rengB: string): string[] => rengCombinar(rengA, rengB).propuestas.filter((rengP) => rengP.conocido).map((rengP) => rengP.formula)
  it('iónicos de libro', () => {
    for (const [rengA, rengB, rengF] of [
      ['Na', 'Cl', 'NaCl'],
      ['Mg', 'O', 'MgO'],
      ['Al', 'O', 'Al2O3'],
      ['Ca', 'F', 'CaF2'],
      ['Mg', 'N', 'Mg3N2']
    ] as const) {
      const rengR = rengCombinar(rengA, rengB)
      expect(rengR.tipo).toBe('ionico')
      expect(rengConocidas(rengA, rengB)).toContain(rengF)
      expect(rengCombinar(rengB, rengA).propuestas.map((rengP) => rengP.formula)).toEqual(rengFormulas(rengA, rengB))
    }
  })
  it('covalentes: H₂O, NH₃, CH₄, CO₂ y CO (con su explicación)', () => {
    expect(rengCombinar('H', 'O')).toMatchObject({ tipo: 'covalente-polar' })
    expect(rengConocidas('H', 'O')).toEqual(['H2O'])
    expect(rengConocidas('N', 'H')).toEqual(['NH3'])
    expect(rengConocidas('C', 'H')).toEqual(['CH4'])
    expect(rengCombinar('C', 'H').tipo).toBe('covalente-apolar')
    expect(rengConocidas('C', 'O')).toEqual(['CO2', 'CO'])
    expect(rengCombinar('C', 'O').propuestas.find((rengP) => rengP.formula === 'CO')!.nota).toMatch(/\+2/)
  })
  it('Fe + O muestra los dos estados de oxidación', () => {
    const rengR = rengCombinar('Fe', 'O')
    expect(rengR.propuestas.map((rengP) => [rengP.formula, rengP.estados[0]!.ox, rengP.conocido])).toEqual([
      ['FeO', 2, true],
      ['Fe2O3', 3, true]
    ])
  })
  it('sin metal nunca es iónico: HF, BF₃, SiF₄ y PF₅ son covalentes muy polares', () => {
    for (const [rengA, rengB] of [
      ['H', 'F'],
      ['B', 'F'],
      ['Si', 'F'],
      ['P', 'F']
    ] as const) {
      const rengR = rengCombinar(rengA, rengB)
      expect(rengR.tipo, `${rengA}+${rengB}`).toBe('covalente-polar')
      expect(rengR.titulo).toBe('Covalente muy polar')
      expect(rengR.razonamiento.join(' ')).toMatch(/regla de Δχ falla/)
    }
    expect(rengCombinar('Na', 'Cl').tipo).toBe('ionico')
    expect(rengCombinar('Ca', 'F').tipo).toBe('ionico')
  })
  it('marca como no verificada una predicción que no está en la lista', () => {
    const rengR = rengCombinar('P', 'H')
    expect(rengR.propuestas.find((rengP) => rengP.formula === 'PH3')!.conocido).toBe(true)
    expect(rengR.propuestas.find((rengP) => rengP.formula === 'PH5')!.conocido).toBe(false)
  })
  it('gases nobles: He + Ne no forman compuestos; Xe + F sí (XeF₂)', () => {
    const rengR = rengCombinar('He', 'Ne')
    expect(rengR.tipo).toBe('ninguno')
    expect(rengR.propuestas).toHaveLength(0)
    expect(rengR.razonamiento.join(' ')).toMatch(/helio y el neón/)
    expect(rengConocidas('Xe', 'F')).toContain('XeF2')
    expect(rengCombinar('Ar', 'F').tipo).toBe('ninguno')
  })
  it('Na + K: aleación, sin fórmula fija; Cu + Cu: metal', () => {
    const rengR = rengCombinar('Na', 'K')
    expect(rengR.tipo).toBe('metalico')
    expect(rengR.titulo).toMatch(/aleación/)
    expect(rengR.propuestas).toHaveLength(0)
    expect(rengCombinar('Cu', 'Cu')).toMatchObject({ tipo: 'metalico', secuencia: 'cu' })
  })
  it('enlaza con las animaciones existentes', () => {
    expect(rengCombinar('Na', 'Cl').secuencia).toBe('nacl')
    expect(rengCombinar('O', 'O').secuencia).toBe('o2')
    expect(rengCombinar('Al', 'O').secuencia).toBeNull()
  })
})

describe('fuentes de los datos nuevos', () => {
  it('compuestos binarios y estados de oxidación', () => {
    for (const rengC of RENG_COMPUESTOS_BINARIOS) {
      expect(rengC.fuente.trim()).not.toBe('')
      expect(rengAnalizarFormula(rengC.formula).atomos.size).toBe(2)
    }
    for (const [rengEl, rengEst] of Object.entries(RENG_ESTADOS_COMUNES)) expect(rengEst.length, rengEl).toBeGreaterThan(0)
  })
  it('geometrías, energías, distancias y ebulliciones', () => {
    for (const rengT of [RENG_GEOMETRIAS, RENG_DISTANCIAS_INTER, RENG_EBULLICION_C]) for (const rengV of Object.values(rengT)) expect(rengV.fuente.trim()).not.toBe('')
    for (const rengV of Object.values(RENG_ENERGIAS_INTERACCION)) {
      expect(rengV.fuente.trim()).not.toBe('')
      if (rengV.valor === null) expect(rengV.nota).toBeTruthy()
    }
  })
})
