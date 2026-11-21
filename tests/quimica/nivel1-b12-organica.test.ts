import { describe, expect, it } from 'vitest'
import { rengResolverRuta } from '../../src/renderer/shell/nucleo/rutas'
import { RENG_ISOMEROS_ALCANOS } from '../../src/renderer/modules/simulador-quimica/aprender/n1/organica/figuras'
import { RENG_LECCIONES_ORGANICA } from '../../src/renderer/modules/simulador-quimica/aprender/n1/organica/lecciones'
import { rengLeccionN1PorId } from '../../src/renderer/modules/simulador-quimica/aprender/n1/registro'
import { RENG_PATRON_ID_LECCION_N1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/tipos'
import { rengComprobarEscenaN1, rengValidarModeloEscenaN1 } from '../../src/renderer/modules/simulador-quimica/escenas-n1/kit'
import { RENG_ESCENA_FAMILIA_ORGANICA, RENG_FAMILIAS_ORGANICAS, rengLecturasFamilia } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/familia-organica'
import { RENG_ESCENA_HIDROCARBURO, rengLecturasHidrocarburo } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/hidrocarburo'
import { RENG_ESCENA_POLIMERO, rengLecturasPolimero } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/polimero'
import { rengAnalizarFormula, rengMasaMolarDe } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { rengGruposFuncionales } from '../../src/renderer/modules/simulador-quimica/nucleo/organica'
import {
  RENG_ACIDOS_OR, RENG_ADICIONES_OR, RENG_ALCOHOLES_OR, RENG_ALDEHIDOS_OR, RENG_ALQUENOS_OR, RENG_ALQUINOS_OR, RENG_AMIDAS_OR, RENG_AMINAS_OR, RENG_AROMATICOS_OR, RENG_CETONAS_OR, RENG_ESQUELETOS_OR, RENG_ESTERES_OR, RENG_ETERES_OR, RENG_FAMILIAS_OR,
  RENG_HIDROCARBUROS_OR, RENG_ISOMEROS_OR, RENG_MOLECULAS_OR, RENG_MONOCLORADOS_OR, RENG_MONOMEROS_OR, RENG_NOMBRES_OR, RENG_PARES_ISOMEROS_OR, RENG_REACCIONES_OR, RENG_SEMI_OR
} from '../../src/renderer/modules/simulador-quimica/practicas-n1/b12-comun'
import { RENG_NAV_INICIAL, rengNavDeSubruta } from '../../src/renderer/modules/simulador-quimica/navegacion'
import { RENG_TEMAS } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_GRUPOS_PRACTICAS_N1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/registro'
import { rengCatalogoReal, RENG_TEMARIO } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import { rengClaveRecurso } from '../../src/renderer/modules/simulador-quimica/temario/recursos'
import { RENG_DECISIONES_PASO0_N1 } from '../../src/renderer/modules/simulador-quimica/temario/retiradas-n1'
import { rengProbarGrupo, rengProbarPractica } from './nivel1-comun'
import {
  RENG_SEGUNDOS_B12, rengAnillosOr, rengCuentaOr, rengEnlacesCCOr, rengGrafoNombreOr, rengGrafoOr, rengGrafoSemiOr, rengIsomerosAlcanoOr, rengMasaGrafoOr, rengMonocloradosOr, rengPiOr, rengPlantillaOr
} from './nivel1-b12-segundos'

const RENG_BLOQUE = 12
const rengGruposBloque = RENG_GRUPOS_PRACTICAS_N1.filter((rengG) => rengG.bloque === RENG_BLOQUE)

describe('Nivel 1 · bloque 12 · prácticas (66)', () => {
  it('hay 22 grupos de 3 prácticas y un segundo método para cada una (más los 6 integradores)', () => {
    expect(rengGruposBloque.map((rengG) => rengG.posicion)).toEqual(Array.from({ length: 22 }, (_, rengI) => rengI + 1))
    const rengIds = rengGruposBloque.flatMap((rengG) => rengG.practicas.map((rengP) => rengP.id))
    expect(rengIds).toHaveLength(66)
    expect(new Set(rengIds).size).toBe(66)
    const rengConSegundo = Object.keys(RENG_SEGUNDOS_B12).filter((rengK) => !rengK.includes('-i'))
    expect(rengConSegundo.sort()).toEqual([...rengIds].sort())
  })
  for (const rengG of rengGruposBloque) {
    describe(rengG.subtema, () => {
      rengProbarGrupo(rengG.subtema, rengG.practicas)
      for (const rengP of rengG.practicas) rengProbarPractica(rengP, RENG_SEGUNDOS_B12[rengP.id])
    })
  }
})

describe('Nivel 1 · bloque 12 · lecciones', () => {
  const rengSubtemas = RENG_TEMARIO.niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!.subtemas

  it('una lección por subtema, en orden, con el título del temario', () => {
    expect(RENG_LECCIONES_ORGANICA).toHaveLength(22)
    expect(RENG_LECCIONES_ORGANICA.map((rengL) => rengL.subtema)).toEqual(rengSubtemas.map((rengS) => rengS.id))
    RENG_LECCIONES_ORGANICA.forEach((rengL, rengI) => {
      expect(`${rengL.nombre}.`, rengL.id).toBe(rengSubtemas[rengI]!.titulo)
      expect(rengL.posicion).toBe(rengI + 1)
    })
  })

  it('ids con patrón, sin chocar con temas, con ruta aprender-<id> válida', () => {
    const rengTemas = new Set(RENG_TEMAS.map((rengT) => rengT.id))
    for (const rengL of RENG_LECCIONES_ORGANICA) {
      expect(rengL.id).toMatch(RENG_PATRON_ID_LECCION_N1)
      expect(rengTemas.has(rengL.id), rengL.id).toBe(false)
      const rengSub = `aprender-${rengL.id}`
      expect(rengSub.length).toBeLessThanOrEqual(41)
      expect(rengResolverRuta(`#/simulador-quimica/${rengSub}`, () => true).ruta.sub).toBe(rengSub)
      expect(rengNavDeSubruta(RENG_NAV_INICIAL, rengSub)).toMatchObject({ destino: 'aprender', tema: rengL.id })
      expect(rengLeccionN1PorId(rengL.id)?.id).toBe(rengL.id)
    }
  })

  it('procedencia honesta: masas sin verificar, ninguna «fuente verificada»', () => {
    for (const rengL of RENG_LECCIONES_ORGANICA) {
      const rengNiveles = rengL.procedencia.map((rengP) => rengP.nivel)
      expect(rengNiveles, rengL.id).toEqual(expect.arrayContaining(['parametro-didactico', 'ejemplo-idealizado', 'dato-calculado', 'sin-verificar']))
      expect(rengNiveles, rengL.id).not.toContain('fuente-verificada')
    }
  })
})

describe('Nivel 1 · bloque 12 · Paso 0, cobertura y escenas', () => {
  const rengCat = rengCatalogoReal().niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!

  it('las decisiones del Paso 0 se reflejan en el catálogo y no queda nada por revisar', () => {
    for (const rengD of RENG_DECISIONES_PASO0_N1.filter((rengX) => rengX.subtema.startsWith('n1-b12-'))) {
      const rengS = rengCat.subtemas.find((rengX) => rengX.id === rengD.subtema)!
      const rengClaves = [...rengS.confirmados, ...rengS.porRevisar].map(rengClaveRecurso)
      expect(rengClaves.includes(rengClaveRecurso(rengD.recurso)), `${rengD.subtema} ${rengClaveRecurso(rengD.recurso)}`).toBe(rengD.decision === 'confirmada')
      expect(rengD.motivo.length).toBeGreaterThan(40)
    }
    expect(rengCat.conteo.porRevisar).toBe(0)
  })

  it('los 22 subtemas tienen lección y prácticas confirmadas, 22 con simulación, y quedan en Parcial solo por la atestación', () => {
    for (const rengS of rengCat.subtemas) {
      expect(rengS.evaluacion.estado, rengS.id).toBe('parcial')
      expect(rengS.evaluacion.faltanParaCompletado, rengS.id).toContain('Falta la atestación registrada de que la lección y la práctica tratan este subtema')
    }
    expect(rengCat.conteo.porCapa).toMatchObject({ aprender: 22, practica: 22, simulacion: 22 })
  })

  it('escena «hidrocarburo»: contrato, fórmula frente a moléculas reales, insaturación, combustión y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_HIDROCARBURO)).toEqual([])
    const rengComprobar = (rengCrudo: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const [rengC, rengD, rengT3, rengR] = [Math.round(rengCrudo.C!), Math.round(rengCrudo.dobles!), Math.round(rengCrudo.triples!), Math.round(rengCrudo.anillos!)]
      const rengH = Math.max(0, 2 * rengC + 2 - 2 * (rengD + rengR) - 4 * rengT3)
      if (rengL.H !== rengH) return 'hidrógenos'
      if (rengL.gi !== rengD + 2 * rengT3 + rengR || rengL.pi !== rengD + 2 * rengT3 || rengL.h2 !== rengL.pi) return 'insaturación'
      if (rengL.sigma !== rengC + rengH - 1 + rengR) return 'enlaces σ'
      if (Math.abs(rengL.o2! - (rengC + rengH / 4)) > 1e-12) return 'oxígeno'
      if (Math.abs(rengL.masa! - rengMasaMolarDe(`C${rengC}H${rengH}`.replace(/H0$/, ''))) > 1e-9) return 'masa molar'
      if (rengL.posible === 1 && rengL.gi !== (2 * rengC + 2 - rengH) / 2) return 'grado de insaturación'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_HIDROCARBURO, rengComprobar, 12)).toEqual([])
    const rengReales: ReadonlyArray<readonly [string, number, number, number, number]> = [['C', 1, 0, 0, 0], ['CCCCCC', 6, 0, 0, 0], ['C=C', 2, 1, 0, 0], ['C#C', 2, 0, 1, 0], ['C1CCCCC1', 6, 0, 0, 1], ['c1ccccc1', 6, 3, 0, 1], ['C=CC=C', 4, 2, 0, 0], ['C#CC#C', 4, 0, 2, 0], ['C1=CCCC1', 5, 1, 0, 1], ['C1CCC2CCCCC2C1', 10, 0, 0, 2], ['C=CCCCC#C', 7, 1, 1, 0], ['CC(C)(C)CC(C)C', 8, 0, 0, 0]]
    for (const [rengS, rengC, rengD, rengT3, rengR] of rengReales) {
      const rengM = rengGrafoOr(rengS)
      const rengL = rengLecturasHidrocarburo({ C: rengC, dobles: rengD, triples: rengT3, anillos: rengR })
      expect(rengL.posible, rengS).toBe(1)
      expect(rengL.H, rengS).toBe(rengCuentaOr(rengM, 'H'))
      expect(rengL.masa!, rengS).toBeCloseTo(rengMasaGrafoOr(rengM), 9)
      expect(rengL.pi, rengS).toBe(rengPiOr(rengM))
      expect(rengL.sigma, rengS).toBe(rengM.enlaces.length)
      expect(rengL.gi, rengS).toBe(rengPiOr(rengM) + rengAnillosOr(rengM))
    }
    expect(rengLecturasHidrocarburo({ C: 1, dobles: 1, triples: 0, anillos: 0 }).posible).toBe(0)
    expect(rengLecturasHidrocarburo({ C: 2, dobles: 0, triples: 2, anillos: 0 }).posible).toBe(0)
    const rengRoto = { ...RENG_ESCENA_HIDROCARBURO, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasHidrocarburo(rengV), H: Math.max(0, 2 * Math.round(rengV.C!) + 2 - 2 * (Math.round(rengV.dobles!) + Math.round(rengV.anillos!)) - 2 * Math.round(rengV.triples!)) }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 12).length).toBeGreaterThan(0)
  })

  it('escena «familia-organica»: contrato, fórmula y masa frente a moléculas reales de las ocho familias, grupo funcional detectado y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_FAMILIA_ORGANICA)).toEqual([])
    const rengTipoNucleo: Readonly<Record<string, string>> = { alcohol: 'alcohol', eter: 'eter', aldehido: 'aldehido', cetona: 'cetona', acido: 'acido-carboxilico', ester: 'ester', amina: 'amina', amida: 'amida' }
    const rengComprobar = (rengCrudo: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengF = RENG_FAMILIAS_ORGANICAS[Math.round(rengCrudo.familia!) - 1]!
      const rengC = Math.max(rengF.minC, Math.round(rengCrudo.C!))
      const rengM = rengGrafoOr(rengPlantillaOr(rengF.clave, rengC))
      if (rengL.carbonos !== rengCuentaOr(rengM, 'C') || rengL.H !== rengCuentaOr(rengM, 'H') || rengL.O !== rengCuentaOr(rengM, 'O') || rengL.N !== rengCuentaOr(rengM, 'N')) return `fórmula de ${rengF.clave} con ${rengC} carbonos`
      if (Math.abs(rengL.masa! - rengMasaGrafoOr(rengM)) > 1e-9) return 'masa molar'
      if (rengL.gi !== rengPiOr(rengM) + rengAnillosOr(rengM)) return 'grado de insaturación'
      if (!rengGruposFuncionales(rengM).some((rengX) => rengX.tipo === rengTipoNucleo[rengF.clave])) return `el núcleo no reconoce el grupo ${rengF.clave}`
      const rengDadores = rengM.enlaces.filter((rengE) => { const [rengA, rengB] = [rengM.atomos[rengE.a]!.el, rengM.atomos[rengE.b]!.el]; return (rengA === 'H' && (rengB === 'O' || rengB === 'N')) || (rengB === 'H' && (rengA === 'O' || rengA === 'N')) }).length
      if (rengL.dadores !== rengDadores) return 'hidrógenos unidos a O o N'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_FAMILIA_ORGANICA, rengComprobar, 10)).toEqual([])
    expect(RENG_FAMILIAS_ORGANICAS.map((rengF) => [rengF.clave, rengF.hExtra, rengF.O, rengF.N, rengF.minC, rengF.gi])).toEqual(RENG_FAMILIAS_OR.map((rengF) => [rengF.clave, rengF.hExtra, rengF.O, rengF.N, rengF.minC, rengF.gi]))
    expect(rengLecturasFamilia({ C: 1, familia: 4 }).carbonos).toBe(3)
    const rengRoto = { ...RENG_ESCENA_FAMILIA_ORGANICA, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasFamilia(rengV), H: rengLecturasFamilia(rengV).H! + 2 }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 10).length).toBeGreaterThan(0)
  })

  it('escena «polimero»: contrato, conservación de la masa en adición y condensación, y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_POLIMERO)).toEqual([])
    const rengAgua = rengMasaMolarDe('H2O')
    const rengComprobar = (rengV: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengN = Math.max(1, Math.round(rengV.n!))
      const rengCond = Math.round(rengV.agua!) >= 1
      if (rengL.enlaces !== rengN - 1) return 'uniones'
      if (Math.abs(rengL.masa! + rengL.perdida! - rengN * rengV.m0!) > 1e-6 * rengN * rengV.m0!) return 'conservación de la masa'
      if (Math.abs(rengL.perdida! - (rengCond ? (rengN - 1) * rengAgua : 0)) > 1e-6) return 'agua liberada'
      if (rengL.conservada! > 100 + 1e-9 || rengL.conservada! <= 0) return 'porcentaje conservado'
      if (Math.abs(rengL.unidad! * rengN - rengL.masa!) > 1e-6 * rengL.masa!) return 'masa por unidad'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_POLIMERO, rengComprobar, 6)).toEqual([])
    expect(rengLecturasPolimero({ m0: rengMasaMolarDe('C2H5NO2'), n: 2, agua: 1 }).masa!).toBeCloseTo(rengMasaGrafoOr(rengGrafoOr('NCC(=O)NCC(=O)O')), 6)
    expect(rengLecturasPolimero({ m0: rengMasaMolarDe('C2H4'), n: 3, agua: 0 }).masa!).toBeCloseTo(rengMasaGrafoOr(rengGrafoOr('C=CCCCC')), 6)
    const rengRoto = { ...RENG_ESCENA_POLIMERO, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasPolimero(rengV), masa: Math.max(1, Math.round(rengV.n!)) * (rengV.m0! - (Math.round(rengV.agua!) >= 1 ? rengAgua : 0)) }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 6).length).toBeGreaterThan(0)
  })

  it('cada compuesto de las listas tiene la fórmula de su estructura, y los nombres sistemáticos llevan a esa misma estructura', () => {
    const rengFormulaIgual = (rengF: string, rengS: string, rengEt: string): void => {
      const rengM = rengGrafoOr(rengS)
      const rengEsperada = rengAnalizarFormula(rengF).atomos
      for (const [rengEl, rengN] of rengEsperada) expect(rengCuentaOr(rengM, rengEl), `${rengEt}: ${rengEl}`).toBe(rengN)
      expect(rengM.atomos.length, rengEt).toBe([...rengEsperada.values()].reduce((rengA, rengB) => rengA + rengB, 0))
    }
    const rengTodos: Array<readonly [string, string, string]> = [
      ...RENG_HIDROCARBUROS_OR, ...RENG_MOLECULAS_OR, ...RENG_NOMBRES_OR, ...RENG_ETERES_OR, ...RENG_ALDEHIDOS_OR,
      ...RENG_ALCOHOLES_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const), ...RENG_ACIDOS_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const), ...RENG_AMINAS_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const),
      ...RENG_CETONAS_OR.flatMap((rengC) => [[rengC[0], rengC[1], rengC[2]] as const, [rengC[3], rengC[4], rengC[5]] as const]),
      ...RENG_ESTERES_OR.map((rengE) => [rengE.nombre, rengE.formula, rengE.smiles] as const), ...RENG_AMIDAS_OR.map((rengA) => [rengA.nombre, rengA.formula, rengA.smiles] as const),
      ...RENG_MONOCLORADOS_OR.map(([rengN, rengF, rengS]) => [rengN, rengF, rengS] as const), ...RENG_PARES_ISOMEROS_OR.flatMap((rengP) => [[rengP[0], rengP[1], rengP[2]] as const, [rengP[3], rengP[1], rengP[4]] as const])
    ]
    for (const [rengN, rengF, rengS] of rengTodos) rengFormulaIgual(rengF, rengS, rengN)
    for (const [rengT, rengF] of RENG_SEMI_OR) {
      const rengM = rengGrafoSemiOr(rengT)
      for (const [rengEl, rengN] of rengAnalizarFormula(rengF).atomos) expect(rengCuentaOr(rengM, rengEl), `${rengT}: ${rengEl}`).toBe(rengN)
    }
    for (const [rengN, , rengS] of RENG_NOMBRES_OR) expect(rengGrafoNombreOr(rengN).idSinEstereo, rengN).toBe(rengGrafoOr(rengS).idSinEstereo)
    for (const rengE of RENG_ESTERES_OR) {
      expect(rengGrafoNombreOr(rengE.nombre).idSinEstereo, rengE.nombre).toBe(rengGrafoOr(rengE.smiles).idSinEstereo)
      expect(rengGrafoNombreOr(rengE.acido).idSinEstereo, rengE.acido).toBe(rengGrafoOr(rengPlantillaOr('acido', rengE.a)).idSinEstereo)
      expect(rengGrafoNombreOr(rengE.alcohol).idSinEstereo, rengE.alcohol).toBe(rengGrafoOr(rengPlantillaOr('alcohol', rengE.b)).idSinEstereo)
    }
    for (const [rengN, , rengS, rengAlc, , rengSa] of RENG_CETONAS_OR) {
      expect(rengGrafoNombreOr(rengN).idSinEstereo, rengN).toBe(rengGrafoOr(rengS).idSinEstereo)
      expect(rengGrafoNombreOr(rengAlc).idSinEstereo, rengAlc).toBe(rengGrafoOr(rengSa).idSinEstereo)
    }
  })

  it('los recuentos declarados (enlaces múltiples, anillos, grupos, clase de amina, esqueletos) coinciden con la estructura', () => {
    for (const [rengN, , rengS, rengD] of RENG_ALQUENOS_OR) expect(rengEnlacesCCOr(rengGrafoOr(rengS), 2), rengN).toBe(rengD)
    for (const [rengN, , rengS, rengT3] of RENG_ALQUINOS_OR) expect(rengEnlacesCCOr(rengGrafoOr(rengS), 3), rengN).toBe(rengT3)
    for (const [rengN, , rengS, rengR] of RENG_AROMATICOS_OR) {
      expect(rengAnillosOr(rengGrafoOr(rengS)), rengN).toBe(rengR)
      expect(rengGruposFuncionales(rengGrafoOr(rengS)).some((rengX) => rengX.tipo === 'aromatico'), rengN).toBe(true)
    }
    for (const [rengN, , rengS, rengK] of RENG_ALCOHOLES_OR) expect(rengGruposFuncionales(rengGrafoOr(rengS)).filter((rengX) => rengX.tipo === 'alcohol').length, rengN).toBe(rengK)
    for (const [rengN, , rengS, rengK] of RENG_ACIDOS_OR) expect(rengGruposFuncionales(rengGrafoOr(rengS)).filter((rengX) => rengX.tipo === 'acido-carboxilico').length, rengN).toBe(rengK)
    for (const [rengN, , rengS] of RENG_ETERES_OR) expect(rengGruposFuncionales(rengGrafoOr(rengS)).map((rengX) => rengX.tipo), rengN).toContain('eter')
    for (const [rengN, , rengS] of RENG_ALDEHIDOS_OR) expect(rengGruposFuncionales(rengGrafoOr(rengS)).map((rengX) => rengX.tipo), rengN).toContain('aldehido')
    for (const [rengN, , rengS] of RENG_CETONAS_OR) expect(rengGruposFuncionales(rengGrafoOr(rengS)).map((rengX) => rengX.tipo), rengN).toContain('cetona')
    for (const rengE of RENG_ESTERES_OR) expect(rengGruposFuncionales(rengGrafoOr(rengE.smiles)).map((rengX) => rengX.tipo), rengE.nombre).toContain('ester')
    for (const rengA of RENG_AMIDAS_OR) expect(rengGruposFuncionales(rengGrafoOr(rengA.smiles)).map((rengX) => rengX.tipo), rengA.nombre).toContain('amida')
    for (const [rengN, , rengS, rengCn, rengNn] of RENG_AMINAS_OR) {
      const rengM = rengGrafoOr(rengS)
      expect(rengCuentaOr(rengM, 'N'), rengN).toBe(rengNn)
      const rengI = rengM.atomos.findIndex((rengA) => rengA.el === 'N')
      expect(rengM.enlaces.filter((rengE) => (rengE.a === rengI && rengM.atomos[rengE.b]!.el === 'C') || (rengE.b === rengI && rengM.atomos[rengE.a]!.el === 'C')).length, rengN).toBe(rengCn)
    }
    for (const [rengT, rengS, rengC, rengD, rengT3, rengR] of RENG_ESQUELETOS_OR) {
      const rengM = rengGrafoOr(rengS)
      expect([rengCuentaOr(rengM, 'C'), rengEnlacesCCOr(rengM, 2), rengEnlacesCCOr(rengM, 3), rengAnillosOr(rengM)], rengT).toEqual([rengC, rengD, rengT3, rengR])
    }
  })

  it('isómeros: la serie de los alcanos se recalcula contando esqueletos, los pares son isómeros distintos y los derivados monoclorados coinciden', () => {
    expect(RENG_ISOMEROS_OR.map((_rengX, rengI) => rengIsomerosAlcanoOr(rengI + 1))).toEqual([...RENG_ISOMEROS_OR])
    expect(RENG_ISOMEROS_ALCANOS).toEqual(RENG_ISOMEROS_OR.slice(0, RENG_ISOMEROS_ALCANOS.length))
    for (const [rengA, , rengSa, rengB, rengSb] of RENG_PARES_ISOMEROS_OR) {
      const [rengMa, rengMb] = [rengGrafoOr(rengSa), rengGrafoOr(rengSb)]
      expect(rengMa.formula, `${rengA} y ${rengB}`).toBe(rengMb.formula)
      expect(rengMa.idSinEstereo, `${rengA} y ${rengB}`).not.toBe(rengMb.idSinEstereo)
    }
    for (const [rengN, , rengS, rengD] of RENG_MONOCLORADOS_OR) expect(rengMonocloradosOr(rengS), rengN).toBe(rengD)
  })

  it('reacciones: las ecuaciones están ajustadas y los productos de adición tienen la fórmula del alqueno más el reactivo', () => {
    const rengSumar = (rengT: ReadonlyArray<readonly [string, number]>): Map<string, number> => {
      const rengM = new Map<string, number>()
      for (const [rengF, rengK] of rengT) for (const [rengEl, rengN] of rengAnalizarFormula(rengF).atomos) rengM.set(rengEl, (rengM.get(rengEl) ?? 0) + rengK * rengN)
      return rengM
    }
    for (const [rengTexto, rengR, rengP, rengS] of RENG_REACCIONES_OR) expect([...rengSumar(rengR)].sort(), rengTexto).toEqual([...rengSumar([rengP, rengS])].sort())
    for (const [rengA, rengF, , rengFr, rengProd, rengSp] of RENG_ADICIONES_OR) {
      const rengM = rengGrafoOr(rengSp)
      for (const [rengEl, rengN] of rengSumar([[rengF, 1], [rengFr, 1]])) expect(rengCuentaOr(rengM, rengEl), `${rengA} → ${rengProd}: ${rengEl}`).toBe(rengN)
      expect(rengPiOr(rengM), rengProd).toBe(0)
    }
    for (const [, rengF] of RENG_MONOMEROS_OR) expect(rengMasaMolarDe(rengF)).toBeGreaterThan(20)
  })
})
