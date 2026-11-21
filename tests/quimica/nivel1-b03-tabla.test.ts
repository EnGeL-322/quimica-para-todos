import { describe, expect, it } from 'vitest'
import { rengResolverRuta } from '../../src/renderer/shell/nucleo/rutas'
import { RENG_LECCIONES_TABLA } from '../../src/renderer/modules/simulador-quimica/aprender/n1/tabla/lecciones'
import { rengLeccionN1PorId } from '../../src/renderer/modules/simulador-quimica/aprender/n1/registro'
import { RENG_PATRON_ID_LECCION_N1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/tipos'
import { RENG_ELEMENTOS } from '../../src/renderer/modules/tabla-periodica/data'
import { rengPropiedadesAdicionales } from '../../src/renderer/modules/tabla-periodica/propiedadesReferencia'
import { RENG_AE_KJ, RENG_EI_KJ, RENG_ESCENA_TENDENCIAS, RENG_GRUPOS_REPRESENTATIVOS, RENG_RADIO_ION_PM, RENG_RADIO_PM, rengLecturasTendencias } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/tendencias-periodicas'
import { rengComprobarEscenaN1, rengValidarModeloEscenaN1 } from '../../src/renderer/modules/simulador-quimica/escenas-n1/kit'
import { RENG_AFINIDAD_EV, RENG_IONIZACION_EV, RENG_KJMOL_POR_EV, RENG_RADIO_IONICO } from '../../src/renderer/modules/simulador-quimica/nucleo/datosEnlace'
import { rengElectronegatividad } from '../../src/renderer/modules/simulador-quimica/nucleo/electronegatividad'
import { RENG_NAV_INICIAL, rengNavDeSubruta } from '../../src/renderer/modules/simulador-quimica/navegacion'
import { RENG_TEMAS } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_GRUPOS_PRACTICAS_N1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/registro'
import { rengCatalogoReal, RENG_TEMARIO } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import { rengClaveRecurso } from '../../src/renderer/modules/simulador-quimica/temario/recursos'
import { RENG_DECISIONES_PASO0_N1 } from '../../src/renderer/modules/simulador-quimica/temario/retiradas-n1'
import { rengProbarGrupo, rengProbarPractica } from './nivel1-comun'
import { RENG_SEGUNDOS_B03 } from './nivel1-b03-segundos'

const RENG_BLOQUE = 3
const rengGruposBloque = RENG_GRUPOS_PRACTICAS_N1.filter((rengG) => rengG.bloque === RENG_BLOQUE)

describe('Nivel 1 · bloque 3 · prácticas (69)', () => {
  it('hay 23 grupos de 3 prácticas y un segundo método para cada una (más los 6 integradores)', () => {
    expect(rengGruposBloque.map((rengG) => rengG.posicion)).toEqual(Array.from({ length: 23 }, (_, rengI) => rengI + 1))
    const rengIds = rengGruposBloque.flatMap((rengG) => rengG.practicas.map((rengP) => rengP.id))
    expect(rengIds).toHaveLength(69)
    expect(new Set(rengIds).size).toBe(69)
    const rengConSegundo = Object.keys(RENG_SEGUNDOS_B03).filter((rengK) => !rengK.includes('-i'))
    expect(rengConSegundo.sort()).toEqual([...rengIds].sort())
  })
  for (const rengG of rengGruposBloque) {
    describe(rengG.subtema, () => {
      rengProbarGrupo(rengG.subtema, rengG.practicas)
      for (const rengP of rengG.practicas) rengProbarPractica(rengP, RENG_SEGUNDOS_B03[rengP.id])
    })
  }
})

describe('Nivel 1 · bloque 3 · lecciones', () => {
  const rengSubtemas = RENG_TEMARIO.niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!.subtemas

  it('una lección por subtema, en orden, con el título del temario', () => {
    expect(RENG_LECCIONES_TABLA).toHaveLength(23)
    expect(RENG_LECCIONES_TABLA.map((rengL) => rengL.subtema)).toEqual(rengSubtemas.map((rengS) => rengS.id))
    RENG_LECCIONES_TABLA.forEach((rengL, rengI) => {
      expect(`${rengL.nombre}.`, rengL.id).toBe(rengSubtemas[rengI]!.titulo)
      expect(rengL.posicion).toBe(rengI + 1)
    })
  })

  it('ids con patrón, sin chocar con temas, con ruta aprender-<id> válida', () => {
    const rengTemas = new Set(RENG_TEMAS.map((rengT) => rengT.id))
    for (const rengL of RENG_LECCIONES_TABLA) {
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
    for (const rengL of RENG_LECCIONES_TABLA) {
      const rengNiveles = rengL.procedencia.map((rengP) => rengP.nivel)
      expect(rengNiveles, rengL.id).toEqual(expect.arrayContaining(['parametro-didactico', 'ejemplo-idealizado', 'dato-calculado', 'sin-verificar']))
      expect(rengNiveles, rengL.id).not.toContain('fuente-verificada')
    }
  })
})

describe('Nivel 1 · bloque 3 · Paso 0, cobertura y escena', () => {
  const rengCat = rengCatalogoReal().niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!

  it('las decisiones del Paso 0 se reflejan en el catálogo y no queda nada por revisar', () => {
    for (const rengD of RENG_DECISIONES_PASO0_N1.filter((rengX) => rengX.subtema.startsWith('n1-b3-'))) {
      const rengS = rengCat.subtemas.find((rengX) => rengX.id === rengD.subtema)!
      const rengClaves = [...rengS.confirmados, ...rengS.porRevisar].map(rengClaveRecurso)
      expect(rengClaves.includes(rengClaveRecurso(rengD.recurso)), `${rengD.subtema} ${rengClaveRecurso(rengD.recurso)}`).toBe(rengD.decision === 'confirmada')
      expect(rengD.motivo.length).toBeGreaterThan(40)
    }
    expect(rengCat.conteo.porRevisar).toBe(0)
  })

  it('los 23 subtemas tienen lección y prácticas confirmadas, 19 con simulación, y quedan en Parcial solo por la atestación', () => {
    for (const rengS of rengCat.subtemas) {
      expect(rengS.evaluacion.estado, rengS.id).toBe('parcial')
      expect(rengS.evaluacion.faltanParaCompletado, rengS.id).toContain('Falta la atestación registrada de que la lección y la práctica tratan este subtema')
    }
    expect(rengCat.conteo.porCapa).toMatchObject({ aprender: 23, practica: 23, simulacion: 19 })
  })

  it('escena «tendencias-periodicas»: contrato, cada lectura coincide con la tabla de datos y con la posición en la tabla de la app, y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_TENDENCIAS)).toEqual([])
    const rengComprobar = (rengV: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengPeriodo = Math.round(rengV.periodo!)
      const rengColumna = Math.round(rengV.columna!)
      const rengE = RENG_ELEMENTOS.find((rengX) => rengX.periodo === rengPeriodo && rengX.grupo === RENG_GRUPOS_REPRESENTATIVOS[rengColumna - 1])!
      if (rengL.Z !== rengE.z || rengL.grupo !== rengE.grupo) return 'posición'
      if (rengL.valencia !== rengColumna) return 'valencia'
      if (rengL.radio !== RENG_RADIO_PM[rengE.simbolo]) return 'radio'
      if (rengL.ei !== RENG_EI_KJ[rengE.simbolo]) return 'energía de ionización'
      if (rengL.en !== (rengPropiedadesAdicionales(rengE.z).electronegatividad ?? 0)) return 'electronegatividad'
      const rengMetal = rengE.categoria === 'metaloide' ? 0.5 : ['no-metal', 'halogeno', 'gas-noble'].includes(rengE.categoria) ? 0 : 1
      if (rengL.metal !== rengMetal) return 'carácter metálico'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_TENDENCIAS, rengComprobar, 8)).toEqual([])
    expect(rengLecturasTendencias({ periodo: 3, columna: 1 })).toMatchObject({ Z: 11, grupo: 1, radio: 186, ei: 496, en: 0.93, metal: 1 })
    expect(rengLecturasTendencias({ periodo: 3, columna: 4 }).metal).toBe(0.5)
    const rengRoto = { ...RENG_ESCENA_TENDENCIAS, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasTendencias(rengV), radio: rengLecturasTendencias(rengV).ei! }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 8).length).toBeGreaterThan(0)
  })

  it('tabla de datos periódicos: completa, positiva y coherente con las tendencias generales que enseñan las lecciones', () => {
    const rengDe = (rengPeriodo: number, rengGrupo: number): string => RENG_ELEMENTOS.find((rengX) => rengX.periodo === rengPeriodo && rengX.grupo === rengGrupo)!.simbolo
    for (const rengPeriodo of [2, 3, 4, 5]) {
      for (const rengGrupo of RENG_GRUPOS_REPRESENTATIVOS) {
        const rengS = rengDe(rengPeriodo, rengGrupo)
        expect(RENG_RADIO_PM[rengS], rengS).toBeGreaterThan(0)
        expect(RENG_EI_KJ[rengS], rengS).toBeGreaterThan(0)
      }
      expect(RENG_RADIO_PM[rengDe(rengPeriodo, 1)]!).toBeGreaterThan(RENG_RADIO_PM[rengDe(rengPeriodo, 17)]!)
      expect(RENG_EI_KJ[rengDe(rengPeriodo, 18)]!).toBe(Math.max(...RENG_GRUPOS_REPRESENTATIVOS.map((rengG) => RENG_EI_KJ[rengDe(rengPeriodo, rengG)]!)))
      expect(RENG_EI_KJ[rengDe(rengPeriodo, 1)]!).toBe(Math.min(...RENG_GRUPOS_REPRESENTATIVOS.map((rengG) => RENG_EI_KJ[rengDe(rengPeriodo, rengG)]!)))
    }
    for (const rengGrupo of [1, 2, 17, 18]) {
      for (const rengPeriodo of [2, 3, 4]) {
        expect(RENG_RADIO_PM[rengDe(rengPeriodo + 1, rengGrupo)]!, `radio grupo ${rengGrupo}`).toBeGreaterThan(RENG_RADIO_PM[rengDe(rengPeriodo, rengGrupo)]!)
        expect(RENG_EI_KJ[rengDe(rengPeriodo + 1, rengGrupo)]!, `Ei grupo ${rengGrupo}`).toBeLessThan(RENG_EI_KJ[rengDe(rengPeriodo, rengGrupo)]!)
      }
    }
    for (const [rengS, [rengQ, rengR]] of Object.entries(RENG_RADIO_ION_PM)) {
      if (rengQ > 0) expect(rengR, rengS).toBeLessThan(RENG_RADIO_PM[rengS]!)
      else expect(rengR, rengS).toBeGreaterThan(RENG_RADIO_PM[rengS]!)
    }
    expect(Math.max(...Object.values(RENG_AE_KJ))).toBe(RENG_AE_KJ.Cl)
    expect(Object.values(RENG_AE_KJ).every((rengX) => rengX > 0)).toBe(true)
    expect(RENG_EI_KJ.He).toBe(Math.max(...Object.values(RENG_EI_KJ)))
  })

  it('los valores recordados coinciden con los datos con fuente que ya guarda la app (NIST, CRC y Shannon) donde se solapan', () => {
    for (const rengS of ['Na', 'Mg', 'Ca']) expect(Math.abs(RENG_EI_KJ[rengS]! - RENG_IONIZACION_EV[rengS]!.valor[0]! * RENG_KJMOL_POR_EV), `Ei ${rengS}`).toBeLessThan(1)
    for (const rengS of ['Cl', 'F', 'O']) expect(Math.abs(RENG_AE_KJ[rengS]! - RENG_AFINIDAD_EV[rengS]!.valor * RENG_KJMOL_POR_EV), `afinidad ${rengS}`).toBeLessThan(1)
    for (const [rengS, rengIon] of [['Na', 'Na+'], ['Mg', 'Mg2+'], ['Cl', 'Cl-'], ['O', 'O2-']] as const) expect(RENG_RADIO_ION_PM[rengS]![1], rengIon).toBeCloseTo(RENG_RADIO_IONICO[rengIon]!.valor.r * 100, 6)
    for (const rengE of RENG_ELEMENTOS.filter((rengX) => rengX.z <= 54)) {
      const rengPub = rengPropiedadesAdicionales(rengE.z).electronegatividad
      const rengNucleo = rengElectronegatividad(rengE.simbolo)
      if (rengPub !== undefined && rengNucleo !== null) expect(Math.abs(rengPub - rengNucleo), `electronegatividad ${rengE.simbolo}`).toBeLessThan(0.011)
    }
  })
})
