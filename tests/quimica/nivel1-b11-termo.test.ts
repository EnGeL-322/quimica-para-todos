import { describe, expect, it } from 'vitest'
import { rengResolverRuta } from '../../src/renderer/shell/nucleo/rutas'
import { RENG_LECCIONES_TERMO } from '../../src/renderer/modules/simulador-quimica/aprender/n1/termo/lecciones'
import { rengLeccionN1PorId } from '../../src/renderer/modules/simulador-quimica/aprender/n1/registro'
import { RENG_PATRON_ID_LECCION_N1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/tipos'
import { RENG_ESCENA_CALORIMETRIA, rengLecturasCalorimetria } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/calorimetria'
import { RENG_ESCENA_ELECTROLISIS, RENG_F_ESCENA, rengLecturasElectrolisis } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/electrolisis'
import { rengComprobarEscenaN1, rengValidarModeloEscenaN1 } from '../../src/renderer/modules/simulador-quimica/escenas-n1/kit'
import { RENG_NAV_INICIAL, rengNavDeSubruta } from '../../src/renderer/modules/simulador-quimica/navegacion'
import { RENG_TEMAS } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_GRUPOS_PRACTICAS_N1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/registro'
import { rengCatalogoReal, RENG_TEMARIO } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import { rengClaveRecurso } from '../../src/renderer/modules/simulador-quimica/temario/recursos'
import { RENG_DECISIONES_PASO0_N1 } from '../../src/renderer/modules/simulador-quimica/temario/retiradas-n1'
import { rengProbarGrupo, rengProbarPractica } from './nivel1-comun'
import { RENG_SEGUNDOS_B11 } from './nivel1-b11-segundos'

const RENG_BLOQUE = 11
const rengGruposBloque = RENG_GRUPOS_PRACTICAS_N1.filter((rengG) => rengG.bloque === RENG_BLOQUE)

describe('Nivel 1 · bloque 11 · prácticas (60)', () => {
  it('hay 20 grupos de 3 prácticas y un segundo método para cada una (más los 6 integradores)', () => {
    expect(rengGruposBloque.map((rengG) => rengG.posicion)).toEqual(Array.from({ length: 20 }, (_, rengI) => rengI + 1))
    const rengIds = rengGruposBloque.flatMap((rengG) => rengG.practicas.map((rengP) => rengP.id))
    expect(rengIds).toHaveLength(60)
    expect(new Set(rengIds).size).toBe(60)
    const rengConSegundo = Object.keys(RENG_SEGUNDOS_B11).filter((rengK) => !rengK.includes('-i'))
    expect(rengConSegundo.sort()).toEqual([...rengIds].sort())
  })
  for (const rengG of rengGruposBloque) {
    describe(rengG.subtema, () => {
      rengProbarGrupo(rengG.subtema, rengG.practicas)
      for (const rengP of rengG.practicas) rengProbarPractica(rengP, RENG_SEGUNDOS_B11[rengP.id])
    })
  }
})

describe('Nivel 1 · bloque 11 · lecciones', () => {
  const rengSubtemas = RENG_TEMARIO.niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!.subtemas

  it('una lección por subtema, en orden, con el título del temario', () => {
    expect(RENG_LECCIONES_TERMO).toHaveLength(20)
    expect(RENG_LECCIONES_TERMO.map((rengL) => rengL.subtema)).toEqual(rengSubtemas.map((rengS) => rengS.id))
    RENG_LECCIONES_TERMO.forEach((rengL, rengI) => {
      expect(`${rengL.nombre}.`, rengL.id).toBe(rengSubtemas[rengI]!.titulo)
      expect(rengL.posicion).toBe(rengI + 1)
    })
  })

  it('ids con patrón, sin chocar con temas, con ruta aprender-<id> válida', () => {
    const rengTemas = new Set(RENG_TEMAS.map((rengT) => rengT.id))
    for (const rengL of RENG_LECCIONES_TERMO) {
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
    for (const rengL of RENG_LECCIONES_TERMO) {
      const rengNiveles = rengL.procedencia.map((rengP) => rengP.nivel)
      expect(rengNiveles, rengL.id).toEqual(expect.arrayContaining(['parametro-didactico', 'ejemplo-idealizado', 'dato-calculado', 'sin-verificar']))
      expect(rengNiveles, rengL.id).not.toContain('fuente-verificada')
    }
  })
})

describe('Nivel 1 · bloque 11 · Paso 0, cobertura y escena', () => {
  const rengCat = rengCatalogoReal().niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!

  it('las decisiones del Paso 0 se reflejan en el catálogo y no queda nada por revisar', () => {
    for (const rengD of RENG_DECISIONES_PASO0_N1.filter((rengX) => rengX.subtema.startsWith('n1-b11-'))) {
      const rengS = rengCat.subtemas.find((rengX) => rengX.id === rengD.subtema)!
      const rengClaves = [...rengS.confirmados, ...rengS.porRevisar].map(rengClaveRecurso)
      expect(rengClaves.includes(rengClaveRecurso(rengD.recurso)), `${rengD.subtema} ${rengClaveRecurso(rengD.recurso)}`).toBe(rengD.decision === 'confirmada')
      expect(rengD.motivo.length).toBeGreaterThan(40)
    }
    expect(rengCat.conteo.porRevisar).toBe(0)
  })

  it('los 20 subtemas tienen lección y prácticas confirmadas, 19 con simulación, y quedan en Parcial solo por la atestación', () => {
    for (const rengS of rengCat.subtemas) {
      expect(rengS.evaluacion.estado, rengS.id).toBe('parcial')
      expect(rengS.evaluacion.faltanParaCompletado, rengS.id).toContain('Falta la atestación registrada de que la lección y la práctica tratan este subtema')
    }
    expect(rengCat.conteo.porCapa).toMatchObject({ aprender: 20, practica: 20, simulacion: 19 })
  })

  it('escena «calorimetria»: contrato, suma de calores nula y T_f entre las iniciales (tolerancia 1e-9) y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_CALORIMETRIA)).toEqual([])
    const rengComprobar = (rengV: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengQ1 = rengV.m1! * rengV.c1! * (rengL.Tf! - rengV.T1!)
      const rengQ2 = rengV.m2! * 4.184 * (rengL.Tf! - rengV.T2!)
      const rengQc = rengV.Ccal! * (rengL.Tf! - rengV.T2!)
      const rengEscala = Math.max(1, Math.abs(rengQ1), Math.abs(rengQ2))
      if (Math.abs(rengQ1 + rengQ2 + rengQc) > 1e-9 * rengEscala) return `balance ${rengQ1 + rengQ2 + rengQc}`
      if (rengL.Tf! < Math.min(rengV.T1!, rengV.T2!) - 1e-9 || rengL.Tf! > Math.max(rengV.T1!, rengV.T2!) + 1e-9) return 'T_f fuera de las iniciales'
      if (Math.abs(rengL.q1! - rengQ1) > 1e-9 * rengEscala) return 'q1'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_CALORIMETRIA, rengComprobar, 3)).toEqual([])
    const rengRoto = { ...RENG_ESCENA_CALORIMETRIA, lecturas: (rengV: Readonly<Record<string, number>>) => rengLecturasCalorimetria({ ...rengV, Ccal: 0 }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 3).length).toBeGreaterThan(0)
  })

  it('escena «electrolisis»: contrato, m = I·t·M·η/(zF) y proporcionalidad con el tiempo (tolerancia 1e-9) y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_ELECTROLISIS)).toEqual([])
    expect(Math.abs(RENG_F_ESCENA - 96485.33212)).toBeLessThan(1e-6)
    const rengComprobar = (rengV: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengM = (rengV.I! * rengV.t! * 60 * rengV.M! * (rengV.ef! / 100)) / (rengV.z! * 96485.33212)
      if (Math.abs(rengL.m! - rengM) > 1e-9 * Math.max(1e-12, rengM)) return `masa ${rengL.m} frente a ${rengM}`
      if (Math.abs(rengL.Q! - rengV.I! * rengV.t! * 60) > 1e-9 * rengL.Q!) return 'carga'
      if (Math.abs(rengLecturasElectrolisis({ ...rengV, t: 2 * rengV.t! }).m! / rengL.m! - 2) > 1e-9) return 'proporcionalidad con t'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_ELECTROLISIS, rengComprobar, 3)).toEqual([])
    const rengRoto = { ...RENG_ESCENA_ELECTROLISIS, lecturas: (rengV: Readonly<Record<string, number>>) => rengLecturasElectrolisis({ ...rengV, t: rengV.t! / 60 }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 3).length).toBeGreaterThan(0)
  })
})
