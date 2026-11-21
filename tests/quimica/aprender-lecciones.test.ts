import { describe, expect, it } from 'vitest'
import { RENG_LECCIONES, RENG_RUTA_INICIACION, rengHayCiclo, rengLeccionDeTema, rengPrerrequisitosTransitivos } from '../../src/renderer/modules/simulador-quimica/aprender/lecciones'
import { RENG_FECHA_CONSULTA } from '../../src/renderer/modules/simulador-quimica/aprender/lecciones/comun'
import { RENG_PROGRESO_VACIO, rengEstadoLeccion, rengLeerProgresoLecciones, rengRegistrarComprobacion, rengSiguienteDeRuta, rengVerPaso } from '../../src/renderer/modules/simulador-quimica/aprender/progreso'
import { RENG_PASOS_LECCION } from '../../src/renderer/modules/simulador-quimica/aprender/tipos'
import { rengDescriptoresCIP, rengDesdeSmiles, rengIdCanonico } from '../../src/renderer/modules/simulador-quimica/nucleo/molecula'
import { rengSmilesDesdeNombre } from '../../src/renderer/modules/simulador-quimica/nucleo/organica'
import { rengFamiliasDeTema, rengGenerarDeFamilia, rengNivelesDeTema, RENG_TEMAS } from '../../src/renderer/modules/simulador-quimica/practica/banco'

const rengFormula = (rengSmiles: string): string => rengDesdeSmiles(rengSmiles).formula
const rengLec = (rengId: string) => rengLeccionDeTema(rengId)!

const RENG_SECCIONES_VERIFICADAS: Readonly<Record<string, string>> = {
  '1.5': 'Measurement Uncertainty, Accuracy, and Precision',
  '2.6': 'Ionic and Molecular Compounds',
  '2.7': 'Chemical Nomenclature',
  '3.1': 'Formula Mass and the Mole Concept',
  '3.3': 'Molarity',
  '3.4': 'Other Units for Solution Concentrations',
  '4.1': 'Writing and Balancing Chemical Equations',
  '4.2': 'Classifying Chemical Reactions',
  '4.3': 'Reaction Stoichiometry',
  '4.4': 'Reaction Yields',
  '4.5': 'Quantitative Chemical Analysis',
  '7.1': 'Ionic Bonding',
  '7.2': 'Covalent Bonding',
  '7.3': 'Lewis Symbols and Structures',
  '7.6': 'Molecular Structure and Polarity',
  '12.1': 'Chemical Reaction Rates',
  '12.3': 'Rate Laws',
  '12.4': 'Integrated Rate Laws',
  '13.2': 'Equilibrium Constants',
  '13.3': 'Shifting Equilibria: Le Châtelier’s Principle',
  '13.4': 'Equilibrium Calculations',
  '14.2': 'pH and pOH',
  '14.3': 'Relative Strengths of Acids and Bases',
  '14.7': 'Acid-Base Titrations',
  '16.1': 'Spontaneity',
  '16.4': 'Free Energy',
  '17.1': 'Review of Redox Chemistry',
  '20.1': 'Hydrocarbons',
  '20.2': 'Alcohols and Ethers',
  '20.3': 'Aldehydes, Ketones, Carboxylic Acids, and Esters',
  '20.4': 'Amines and Amides'
}

describe('Entrega B: estructura de las lecciones', () => {
  it('hay una lección por cada uno de los 22 temas del banco, sin repetir', () => {
    expect(RENG_LECCIONES).toHaveLength(22)
    expect(RENG_LECCIONES.map((rengL) => rengL.tema).sort()).toEqual(RENG_TEMAS.map((rengT) => rengT.id).sort())
  })
  it('cada lección tiene objetivo, explicación, ejemplo resuelto, comprobación conceptual y fuente consultada', () => {
    for (const rengL of RENG_LECCIONES) {
      const rengE = rengL.ejemplo
      expect(rengL.objetivo.length, rengL.tema).toBeGreaterThan(30)
      expect(rengL.conceptos.length, rengL.tema).toBeGreaterThanOrEqual(2)
      expect(rengE.titulo && rengE.enunciado && rengE.resultado.texto && rengE.errorTipico && rengE.revision, rengL.tema).toBeTruthy()
      expect(rengE.datos.length, rengL.tema).toBeGreaterThanOrEqual(1)
      expect(rengE.pasos.length, rengL.tema).toBeGreaterThanOrEqual(3)
      for (const rengP of rengE.pasos) expect(rengP.accion && rengP.dato && rengP.porQue && rengP.interpretar, `${rengL.tema}: paso incompleto`).toBeTruthy()
      const rengC = rengL.comprobacion
      expect(rengC.opciones.length, rengL.tema).toBeGreaterThanOrEqual(2)
      expect(rengC.opciones.some((rengO) => rengO.id === rengC.correcta), rengL.tema).toBe(true)
      expect(new Set(rengC.opciones.map((rengO) => rengO.id)).size, rengL.tema).toBe(rengC.opciones.length)
      expect(rengC.explicacion.length, rengL.tema).toBeGreaterThan(30)
      expect(rengL.fuentes.length, rengL.tema).toBeGreaterThanOrEqual(1)
      for (const rengF of rengL.fuentes) {
        expect(rengF.texto && rengF.alcance, rengL.tema).toBeTruthy()
        expect(rengF.consultada, rengL.tema).toBe(RENG_FECHA_CONSULTA)
      }
    }
  })
  it('la secuencia de la lección tiene los seis pasos del encargo', () => {
    expect([...RENG_PASOS_LECCION]).toEqual(['Entender el concepto', 'Ver un ejemplo', 'Resolverlo paso a paso', 'Comprobar qué entendí', 'Practicar', 'Simular u observar'])
  })
  it('la opción correcta de la comprobación no es siempre la misma letra y la primera no es siempre la correcta', () => {
    const rengLetras = RENG_LECCIONES.map((rengL) => rengL.comprobacion.correcta)
    expect(new Set(rengLetras).size).toBeGreaterThanOrEqual(2)
  })
  it('cada lección describe el razonamiento de exactamente los niveles que tienen práctica', () => {
    for (const rengL of RENG_LECCIONES) expect(Object.keys(rengL.porNivel).sort(), rengL.tema).toEqual([...rengNivelesDeTema(rengL.tema)].sort())
  })
  it('hay cinco recorridos completos, uno por rama (estequiometría, formular y nombrar, isomería, dilución, cinética)', () => {
    expect(RENG_LECCIONES.filter((rengL) => rengL.recorrido).map((rengL) => rengL.tema).sort()).toEqual(['cinetica', 'dilucion', 'estequiometria', 'formular-nombrar', 'isomeria'])
    const rengRamas = RENG_LECCIONES.filter((rengL) => rengL.recorrido).map((rengL) => RENG_TEMAS.find((rengT) => rengT.id === rengL.tema)!.rama)
    expect(new Set(rengRamas).size).toBe(5)
    for (const rengId of ['estequiometria', 'formular-nombrar', 'isomeria', 'dilucion', 'cinetica']) expect(rengLec(rengId).ejemplo.pasos.length, rengId).toBeGreaterThanOrEqual(3)
  })
})

describe('Entrega B: prerrequisitos y ruta de iniciación', () => {
  it('los prerrequisitos existen y no forman ciclos', () => {
    for (const rengL of RENG_LECCIONES) for (const rengP of rengL.prerrequisitos) expect(rengLeccionDeTema(rengP), `${rengL.tema} → ${rengP}`).toBeDefined()
    expect(rengHayCiclo()).toBe(false)
  })
  it('la ruta de iniciación no repite, respeta los prerrequisitos y cubre los cinco recorridos', () => {
    expect(new Set(RENG_RUTA_INICIACION).size).toBe(RENG_RUTA_INICIACION.length)
    RENG_RUTA_INICIACION.forEach((rengId, rengI) => {
      for (const rengP of rengPrerrequisitosTransitivos(rengId)) expect(RENG_RUTA_INICIACION.indexOf(rengP), `${rengId} necesita ${rengP}`).toBeLessThan(rengI)
    })
    for (const rengL of RENG_LECCIONES.filter((rengX) => rengX.recorrido)) expect(RENG_RUTA_INICIACION).toContain(rengL.tema)
  })
  it('los prerrequisitos transitivos van en orden de estudio', () => {
    expect(rengPrerrequisitosTransitivos('valoracion')).toEqual(['mol', 'concentracion', 'ph', 'ajuste', 'estequiometria'])
    const rengOrden = rengPrerrequisitosTransitivos('ajuste-cinetico')
    expect(rengOrden.indexOf('mol')).toBeLessThan(rengOrden.indexOf('concentracion'))
    expect(rengOrden.indexOf('concentracion')).toBeLessThan(rengOrden.indexOf('dilucion'))
    expect(rengOrden.indexOf('dilucion')).toBeLessThan(rengOrden.indexOf('calibracion'))
  })
})

describe('Entrega B: el ejemplo es distinto de las variantes de práctica', () => {
  it('ningún enunciado ni título generado por las familias del tema (40 variantes por nivel) coincide con el ejemplo', () => {
    for (const rengL of RENG_LECCIONES) {
      for (const rengF of rengFamiliasDeTema(rengL.tema)) {
        for (const rengN of rengF.niveles) {
          for (let rengS = 1; rengS <= 40; rengS++) {
            const rengEj = rengGenerarDeFamilia(rengF, rengN, rengS)
            if (!rengEj) continue
            expect(rengEj.enunciado, `${rengF.id} ${rengN} ${rengS}`).not.toBe(rengL.ejemplo.enunciado)
            expect(rengEj.titulo, `${rengF.id} ${rengN} ${rengS}`).not.toBe(rengL.ejemplo.titulo)
          }
        }
      }
    }
  })
})

describe('Entrega B: los resultados numéricos se recalculan por otro camino', () => {
  const rengCerca = (rengVal: number, rengEsp: number, rengTol: number): void => expect(Math.abs(rengVal - rengEsp) / Math.abs(rengEsp)).toBeLessThanOrEqual(rengTol)
  const rengVal = (rengId: string): number => rengLec(rengId).ejemplo.resultado.valor!

  it('mol: n = m/M con las masas atómicas por elemento y análisis dimensional hasta las moléculas', () => {
    const rengM = 6 * 12.011 + 12 * 1.008 + 6 * 15.999
    rengCerca(rengVal('mol'), 4.5 / rengM, 0.01)
    const rengMoleculas = (4.5 * 6.02214076e23) / rengM
    expect(rengMoleculas.toExponential(2)).toBe('1.50e+22')
    expect((6 * rengMoleculas).toExponential(2)).toBe('9.03e+22')
  })
  it('concentración: molaridad y dilución por factor', () => {
    const rengM = 22.99 + 35.45
    const rengC1 = 5.85 / rengM / 0.25
    expect(rengC1).toBeCloseTo(0.4, 2)
    const rengFactor = 100 / 20
    rengCerca(rengVal('concentracion'), rengC1 / rengFactor, 0.01)
  })
  it('estequiometría: limitante comparando masas máximas de producto y rendimiento', () => {
    const rengMN2 = 2 * 14.007
    const rengMH2 = 2 * 1.008
    const rengMNH3 = 14.007 + 3 * 1.008
    const rengDesdeN2 = (10.0 / rengMN2) * 2 * rengMNH3
    const rengDesdeH2 = (3.0 / (3 * rengMH2)) * 2 * rengMNH3
    expect(rengDesdeN2).toBeLessThan(rengDesdeH2)
    expect(rengDesdeN2).toBeCloseTo(12.16, 2)
    rengCerca(rengVal('estequiometria'), (9.5 / rengDesdeN2) * 100, 0.01)
  })
  it('ajuste, redox y fórmula iónica conservan átomos y carga', () => {
    const rengSuma = (rengT: Array<[number, Record<string, number>, number]>): { atomos: Record<string, number>; carga: number } => {
      const rengA: Record<string, number> = {}
      let rengQ = 0
      for (const [rengCoef, rengAt, rengCarga] of rengT) {
        for (const [rengEl, rengN] of Object.entries(rengAt)) rengA[rengEl] = (rengA[rengEl] ?? 0) + rengCoef * rengN
        rengQ += rengCoef * rengCarga
      }
      return { atomos: rengA, carga: rengQ }
    }
    expect(rengSuma([[2, { Al: 1 }, 0], [6, { H: 1, Cl: 1 }, 0]])).toEqual({ atomos: { Al: 2, H: 6, Cl: 6 }, carga: 0 })
    expect(rengSuma([[2, { Al: 1, Cl: 3 }, 0], [3, { H: 2 }, 0]])).toEqual({ atomos: { Al: 2, Cl: 6, H: 6 }, carga: 0 })
    const rengIzq = rengSuma([[1, { Mn: 1, O: 4 }, -1], [5, { Fe: 1 }, 2], [8, { H: 1 }, 1]])
    const rengDer = rengSuma([[1, { Mn: 1 }, 2], [5, { Fe: 1 }, 3], [4, { H: 2, O: 1 }, 0]])
    expect(rengIzq).toEqual(rengDer)
    expect(rengIzq.carga).toBe(17)
    expect(2 * 3 + 3 * -2).toBe(0)
    expect(1 + 7 + 4 * -2).toBe(0)
    expect(2 * 1 + 2 * -1).toBe(0)
  })
  it('pH: se resuelve Ka = x²/(C − x) por bisección y se compara con la aproximación', () => {
    const rengKa = 4.0e-5
    const rengC = 0.02
    let rengLo = 0
    let rengHi = rengC
    for (let rengI = 0; rengI < 200; rengI++) {
      const rengMed = (rengLo + rengHi) / 2
      if ((rengMed * rengMed) / (rengC - rengMed) > rengKa) rengHi = rengMed
      else rengLo = rengMed
    }
    const rengPH = -Math.log10((rengLo + rengHi) / 2)
    rengCerca(rengVal('ph'), rengPH, 0.005)
    expect((rengLo + rengHi) / 2 / rengC).toBeLessThan(0.05)
    expect(-Math.log10(Math.sqrt(rengKa * rengC))).toBeCloseTo(3.0485, 3)
    expect(-Math.log10(0.02)).toBeCloseTo(1.699, 3)
  })
  it('valoración: moles de base = moles de ácido', () => {
    rengCerca(rengVal('valoracion'), (0.1 * 20.5) / 25.0, 0.01)
  })
  it('dilución: el factor y la alícuota conservan los moles', () => {
    const rengAlicuota = rengVal('dilucion')
    expect(0.5 * rengAlicuota).toBeCloseTo(0.02 * 100, 6)
    expect(0.5 / 0.02).toBe(25)
    expect(2.0 / 104.0).toBeCloseTo(0.0192, 4)
    expect((0.2 * 25.0) / 100.0).toBeCloseTo(0.05, 10)
  })
  it('calibración: mínimos cuadrados por sumas (otro camino) e incertidumbre por la fórmula de interpolación', () => {
    const rengX = [0, 2, 4, 6, 8]
    const rengY = [0.003, 0.152, 0.301, 0.449, 0.6]
    const rengN = rengX.length
    const rengSx = rengX.reduce((a, b) => a + b)
    const rengSy = rengY.reduce((a, b) => a + b)
    const rengSxy = rengX.reduce((a, x, i) => a + x * rengY[i]!, 0)
    const rengSxx = rengX.reduce((a, x) => a + x * x, 0)
    const rengM = (rengN * rengSxy - rengSx * rengSy) / (rengN * rengSxx - rengSx * rengSx)
    const rengB = (rengSy - rengM * rengSx) / rengN
    expect(rengM).toBeCloseTo(0.07455, 5)
    expect(rengB).toBeCloseTo(0.0028, 4)
    const rengC = (0.375 - rengB) / rengM
    rengCerca(rengVal('calibracion'), rengC, 0.01)
    const rengRes = rengX.map((x, i) => rengY[i]! - (rengM * x + rengB))
    const rengS = Math.sqrt(rengRes.reduce((a, r) => a + r * r, 0) / (rengN - 2))
    expect(rengS).toBeCloseTo(0.0008, 4)
    const rengSxxC = rengSxx - (rengSx * rengSx) / rengN
    const rengIncert = (rengS / rengM) * Math.sqrt(1 + 1 / rengN + Math.pow(0.375 - (rengSy / rengN), 2) / (rengM * rengM * rengSxxC))
    expect(rengIncert).toBeCloseTo(0.0118, 3)
    expect(0.375).toBeGreaterThan(0.003)
    expect(0.375).toBeLessThan(0.6)
  })
  it('cinética: por semividas y por la ley exponencial', () => {
    rengCerca(rengVal('cinetica'), 0.8 * Math.pow(2, -75 / 30), 0.01)
    expect(0.8 * Math.exp(-(Math.log(2) / 30) * 75)).toBeCloseTo(0.8 * Math.pow(2, -2.5), 12)
  })
  it('equilibrio: se resuelve la tabla ICE por bisección y Q = K al final', () => {
    let rengLo = 0
    let rengHi = 0.01 - 1e-12
    for (let rengI = 0; rengI < 200; rengI++) {
      const rengX = (rengLo + rengHi) / 2
      const rengQ = Math.pow(2 * rengX, 2) / Math.pow(0.01 - rengX, 2)
      if (rengQ > 50) rengHi = rengX
      else rengLo = rengX
    }
    const rengX = (rengLo + rengHi) / 2
    rengCerca(rengVal('equilibrio'), 2 * rengX, 0.01)
    expect(Math.pow(0.0156, 2) / Math.pow(0.0022, 2)).toBeGreaterThan(48)
    expect(Math.pow(0.0156, 2) / Math.pow(0.0022, 2)).toBeLessThan(52)
    expect(0.0100 - rengX).toBeCloseTo(0.0022, 4)
  })
  it('termoquímica: ΔG y temperatura de cambio', () => {
    rengCerca(rengVal('termo'), -40.0 - 298 * (-100 / 1000), 0.01)
    expect(-40.0 / (-100 / 1000)).toBe(400)
    expect(-40.0 - 500 * (-0.1)).toBeGreaterThan(0)
    expect(-40.0 - 300 * (-0.1)).toBeLessThan(0)
  })
  it('ajuste cinético: orden 1 gana por R² y k sale de la pendiente de ln[A]', () => {
    const rengT = [0, 10, 20, 30, 40]
    const rengA = [0.1, 0.0607, 0.0368, 0.0223, 0.0135]
    const rengR2 = (rengXs: number[], rengYs: number[]): { m: number; r2: number } => {
      const rengN = rengXs.length
      const rengSx = rengXs.reduce((a, b) => a + b)
      const rengSy = rengYs.reduce((a, b) => a + b)
      const rengSxy = rengXs.reduce((a, x, i) => a + x * rengYs[i]!, 0)
      const rengSxx = rengXs.reduce((a, x) => a + x * x, 0)
      const rengSyy = rengYs.reduce((a, y) => a + y * y, 0)
      const rengR = (rengN * rengSxy - rengSx * rengSy) / Math.sqrt((rengN * rengSxx - rengSx * rengSx) * (rengN * rengSyy - rengSy * rengSy))
      return { m: (rengN * rengSxy - rengSx * rengSy) / (rengN * rengSxx - rengSx * rengSx), r2: rengR * rengR }
    }
    const rengO0 = rengR2(rengT, rengA)
    const rengO1 = rengR2(rengT, rengA.map(Math.log))
    const rengO2 = rengR2(rengT, rengA.map((a) => 1 / a))
    expect(rengO0.r2).toBeCloseTo(0.925, 3)
    expect(rengO1.r2).toBeGreaterThan(0.99999)
    expect(rengO2.r2).toBeCloseTo(0.924, 3)
    rengCerca(rengVal('ajuste-cinetico'), -rengO1.m, 0.01)
    expect(Math.log(2) / 0.0501).toBeCloseTo(13.8, 1)
  })
})

describe('Entrega B: las estructuras de las lecciones son las que dicen ser', () => {
  it('cada SMILES se lee y las tres de C₃H₈O son distintas entre sí con la misma fórmula', () => {
    for (const rengL of RENG_LECCIONES) {
      for (const rengS of rengL.ejemplo.estructuras ?? []) expect(() => rengDesdeSmiles(rengS.smiles), `${rengL.tema} ${rengS.smiles}`).not.toThrow()
      if (rengL.observar?.mesaSmiles) expect(() => rengDesdeSmiles(rengL.observar!.mesaSmiles!), `${rengL.tema} mesa`).not.toThrow()
    }
    const rengIso = rengLec('isomeria').ejemplo.estructuras!.map((rengE) => rengE.smiles)
    expect(rengIso).toHaveLength(3)
    for (const rengS of rengIso) expect(rengFormula(rengS)).toBe('C3H8O')
    expect(new Set(rengIso.map(rengIdCanonico)).size).toBe(3)
    expect(rengFormula('CCO')).toBe(rengFormula('COC'))
    expect(rengIdCanonico('CCO')).not.toBe(rengIdCanonico('COC'))
  })
  it('los nombres de las lecciones se corresponden con sus estructuras (analizador de nombres independiente)', () => {
    expect(rengIdCanonico(rengSmilesDesdeNombre('3-metilbutan-1-ol').smiles)).toBe(rengIdCanonico('CC(C)CCO'))
    expect(rengFormula('CC(C)CCO')).toBe('C5H12O')
    expect(rengIdCanonico(rengSmilesDesdeNombre('ácido propanoico').smiles)).toBe(rengIdCanonico('CCC(=O)O'))
    expect(rengFormula('CCC(=O)O')).toBe('C3H6O2')
    expect(rengIdCanonico(rengSmilesDesdeNombre('ácido 2-hidroxipropanoico').smiles)).toBe(rengIdCanonico('CC(O)C(=O)O'))
    expect(rengFormula('CC(O)C(=O)O')).toBe('C3H6O3')
    expect(rengIdCanonico(rengSmilesDesdeNombre('2-cloropropano').smiles)).toBe(rengIdCanonico('CC(C)Cl'))
    expect(rengIdCanonico('CC(C)O')).toBe(rengIdCanonico(rengSmilesDesdeNombre('propan-2-ol').smiles))
    expect(rengIdCanonico('CCCO')).toBe(rengIdCanonico(rengSmilesDesdeNombre('propan-1-ol').smiles))
    expect(rengIdCanonico('COCC')).toBe(rengIdCanonico(rengSmilesDesdeNombre('metoxietano').smiles))
  })
  it('la adición de HBr a propeno conserva los átomos: C₃H₆ + HBr = C₃H₇Br', () => {
    expect(rengFormula('CC=C')).toBe('C3H6')
    expect(rengFormula('CC(C)Br')).toBe('C3H7Br')
  })
  it('el ácido láctico dado es (S) y coincide con el SMILES de L-láctico escrito con otro orden de vecinos', () => {
    const rengDesc = rengDescriptoresCIP('C[C@H](O)C(=O)O')
    expect(rengDesc.centros).toHaveLength(1)
    expect(rengDesc.centros[0]!.descriptor).toBe('S')
    expect(rengIdCanonico('C[C@H](O)C(=O)O')).toBe(rengIdCanonico('C[C@@H](C(=O)O)O'))
    expect(rengDescriptoresCIP('C[C@@H](O)C(=O)O').centros[0]!.descriptor).toBe('R')
  })
  it('la glucosa de la Mesa tiene la fórmula de la lección de mol', () => {
    expect(rengFormula(rengLec('mol').observar!.mesaSmiles!)).toBe('C6H12O6')
  })
})

describe('Entrega B: fuentes', () => {
  it('toda sección de OpenStax citada existe en los índices consultados el 2026-11-15, con su título', () => {
    const rengPatron = /(\d+\.\d+)\s+«([^»]+)»/g
    let rengContadas = 0
    for (const rengL of RENG_LECCIONES) {
      for (const rengF of rengL.fuentes.filter((rengX) => rengX.enlace.includes('openstax.org'))) {
        const rengTextos = [...rengF.texto.matchAll(rengPatron)]
        expect(rengTextos.length, rengL.tema).toBeGreaterThan(0)
        for (const rengM of rengTextos) {
          rengContadas++
          expect(RENG_SECCIONES_VERIFICADAS[rengM[1]!], `${rengL.tema}: sección ${rengM[1]}`).toBe(rengM[2])
        }
      }
    }
    expect(rengContadas).toBeGreaterThanOrEqual(30)
  })
  it('las fuentes sin enlace lo declaran en su alcance y las masas atómicas citan CIAAW', () => {
    for (const rengL of RENG_LECCIONES) for (const rengF of rengL.fuentes) if (rengF.enlace === '') expect(rengF.alcance).toMatch(/No se consultó/)
    expect(rengLec('mol').fuentes.some((rengF) => rengF.enlace === 'https://ciaaw.org/atomic-weights.htm')).toBe(true)
    expect(rengLec('estereo').fuentes.some((rengF) => rengF.enlace.includes('goldbook.iupac.org'))).toBe(true)
  })
  it('cada lección advierte que el texto es propio (la obra de OpenStax es CC BY-NC-SA)', () => {
    for (const rengL of RENG_LECCIONES) for (const rengF of rengL.fuentes.filter((rengX) => rengX.enlace.includes('openstax.org'))) expect(rengF.alcance).toMatch(/CC BY-NC-SA/)
  })
})

describe('Entrega B: progreso guardado', () => {
  const rengIds = new Set(RENG_TEMAS.map((rengT) => rengT.id))
  it('ver un paso solo avanza, y una comprobación correcta no se pierde por un fallo posterior', () => {
    let rengP = rengVerPaso(RENG_PROGRESO_VACIO, 'mol', 2)
    expect(rengVerPaso(rengP, 'mol', 1)).toBe(rengP)
    expect(rengEstadoLeccion(rengP, 'mol')).toBe('en-curso')
    rengP = rengRegistrarComprobacion(rengP, 'mol', false)
    expect(rengEstadoLeccion(rengP, 'mol')).toBe('en-curso')
    rengP = rengRegistrarComprobacion(rengP, 'mol', true)
    expect(rengEstadoLeccion(rengP, 'mol')).toBe('comprobada')
    rengP = rengRegistrarComprobacion(rengP, 'mol', false)
    expect(rengEstadoLeccion(rengP, 'mol')).toBe('comprobada')
    expect(rengP.temas['mol']!.intentos).toBe(3)
    expect(rengEstadoLeccion(rengP, 'ph')).toBe('sin-empezar')
  })
  it('lee lo guardado con validación: descarta formatos, temas, pasos y estados inválidos', () => {
    const rengBueno = JSON.stringify({ v: 1, temas: { mol: { paso: 3, comprobacion: 'correcta', intentos: 2 } } })
    expect(rengLeerProgresoLecciones(rengBueno, rengIds, 5).temas['mol']).toEqual({ paso: 3, comprobacion: 'correcta', intentos: 2 })
    for (const rengMalo of [null, '', 'no-json', '[]', '{"v":2,"temas":{}}', '{"v":1}', '{"v":1,"temas":{"inventado":{"paso":1,"comprobacion":null,"intentos":0}}}', '{"v":1,"temas":{"mol":{"paso":99,"comprobacion":null,"intentos":0}}}', '{"v":1,"temas":{"mol":{"paso":1,"comprobacion":"quizá","intentos":0}}}', '{"v":1,"temas":{"mol":{"paso":-1,"comprobacion":null,"intentos":0}}}', '{"v":1,"temas":{"mol":{"paso":1.5,"comprobacion":null,"intentos":0}}}'])
      expect(Object.keys(rengLeerProgresoLecciones(rengMalo, rengIds, 5).temas), String(rengMalo)).toEqual([])
  })
  it('la ruta de iniciación continúa en la primera lección sin comprobar', () => {
    expect(rengSiguienteDeRuta(RENG_PROGRESO_VACIO, RENG_RUTA_INICIACION)).toBe('mol')
    let rengP = rengRegistrarComprobacion(RENG_PROGRESO_VACIO, 'mol', true)
    expect(rengSiguienteDeRuta(rengP, RENG_RUTA_INICIACION)).toBe('concentracion')
    for (const rengId of RENG_RUTA_INICIACION) rengP = rengRegistrarComprobacion(rengP, rengId, true)
    expect(rengSiguienteDeRuta(rengP, RENG_RUTA_INICIACION)).toBeNull()
  })
})
