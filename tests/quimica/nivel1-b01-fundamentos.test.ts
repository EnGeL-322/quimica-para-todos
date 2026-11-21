import { describe, expect, it } from 'vitest'
import { rengResolverRuta } from '../../src/renderer/shell/nucleo/rutas'
import { RENG_LECCIONES_FUNDAMENTOS } from '../../src/renderer/modules/simulador-quimica/aprender/n1/fundamentos/lecciones'
import { rengLeccionN1PorId } from '../../src/renderer/modules/simulador-quimica/aprender/n1/registro'
import { RENG_PATRON_ID_LECCION_N1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/tipos'
import { RENG_ESCENA_DENSIDAD, rengLecturasDensidad } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/densidad'
import { rengComprobarEscenaN1, rengValidarModeloEscenaN1 } from '../../src/renderer/modules/simulador-quimica/escenas-n1/kit'
import { RENG_NAV_INICIAL, rengNavDeSubruta } from '../../src/renderer/modules/simulador-quimica/navegacion'
import { RENG_TEMAS } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_GRUPOS_PRACTICAS_N1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/registro'
import { rengCatalogoReal, RENG_TEMARIO } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import { rengClaveRecurso } from '../../src/renderer/modules/simulador-quimica/temario/recursos'
import { RENG_DECISIONES_PASO0_N1 } from '../../src/renderer/modules/simulador-quimica/temario/retiradas-n1'
import { rengProbarGrupo, rengProbarPractica } from './nivel1-comun'
import { RENG_SEGUNDOS_B01 } from './nivel1-b01-segundos'

const RENG_BLOQUE = 1
const rengGruposBloque = RENG_GRUPOS_PRACTICAS_N1.filter((rengG) => rengG.bloque === RENG_BLOQUE)

describe('Nivel 1 · bloque 1 · prácticas (69)', () => {
  it('hay 23 grupos de 3 prácticas y un segundo método para cada una (más los 6 integradores)', () => {
    expect(rengGruposBloque.map((rengG) => rengG.posicion)).toEqual(Array.from({ length: 23 }, (_, rengI) => rengI + 1))
    const rengIds = rengGruposBloque.flatMap((rengG) => rengG.practicas.map((rengP) => rengP.id))
    expect(rengIds).toHaveLength(69)
    expect(new Set(rengIds).size).toBe(69)
    const rengConSegundo = Object.keys(RENG_SEGUNDOS_B01).filter((rengK) => !rengK.includes('-i'))
    expect(rengConSegundo.sort()).toEqual([...rengIds].sort())
  })
  for (const rengG of rengGruposBloque) {
    describe(rengG.subtema, () => {
      rengProbarGrupo(rengG.subtema, rengG.practicas)
      for (const rengP of rengG.practicas) rengProbarPractica(rengP, RENG_SEGUNDOS_B01[rengP.id])
    })
  }
})

describe('Nivel 1 · bloque 1 · lecciones', () => {
  const rengSubtemas = RENG_TEMARIO.niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!.subtemas

  it('una lección por subtema, en orden, con el título del temario', () => {
    expect(RENG_LECCIONES_FUNDAMENTOS).toHaveLength(23)
    expect(RENG_LECCIONES_FUNDAMENTOS.map((rengL) => rengL.subtema)).toEqual(rengSubtemas.map((rengS) => rengS.id))
    RENG_LECCIONES_FUNDAMENTOS.forEach((rengL, rengI) => {
      expect(`${rengL.nombre}.`, rengL.id).toBe(rengSubtemas[rengI]!.titulo)
      expect(rengL.posicion).toBe(rengI + 1)
    })
  })

  it('ids con patrón, sin chocar con temas, con ruta aprender-<id> válida', () => {
    const rengTemas = new Set(RENG_TEMAS.map((rengT) => rengT.id))
    for (const rengL of RENG_LECCIONES_FUNDAMENTOS) {
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
    for (const rengL of RENG_LECCIONES_FUNDAMENTOS) {
      const rengNiveles = rengL.procedencia.map((rengP) => rengP.nivel)
      expect(rengNiveles, rengL.id).toEqual(expect.arrayContaining(['parametro-didactico', 'ejemplo-idealizado', 'dato-calculado', 'sin-verificar']))
      expect(rengNiveles, rengL.id).not.toContain('fuente-verificada')
    }
  })
})

describe('Nivel 1 · bloque 1 · Paso 0, cobertura y escena', () => {
  const rengCat = rengCatalogoReal().niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!

  it('las decisiones del Paso 0 se reflejan en el catálogo y no queda nada por revisar', () => {
    for (const rengD of RENG_DECISIONES_PASO0_N1.filter((rengX) => rengX.subtema.startsWith('n1-b1-'))) {
      const rengS = rengCat.subtemas.find((rengX) => rengX.id === rengD.subtema)!
      const rengClaves = [...rengS.confirmados, ...rengS.porRevisar].map(rengClaveRecurso)
      expect(rengClaves.includes(rengClaveRecurso(rengD.recurso)), `${rengD.subtema} ${rengClaveRecurso(rengD.recurso)}`).toBe(rengD.decision === 'confirmada')
      expect(rengD.motivo.length).toBeGreaterThan(40)
    }
    expect(rengCat.conteo.porRevisar).toBe(0)
  })

  it('los 23 subtemas tienen lección y prácticas confirmadas, 16 con simulación, y quedan en Parcial solo por la atestación', () => {
    for (const rengS of rengCat.subtemas) {
      expect(rengS.evaluacion.estado, rengS.id).toBe('parcial')
      expect(rengS.evaluacion.faltanParaCompletado, rengS.id).toContain('Falta la atestación registrada de que la lección y la práctica tratan este subtema')
    }
    expect(rengCat.conteo.porCapa).toMatchObject({ aprender: 23, practica: 23, simulacion: 16 })
  })

  it('escena «densidad»: contrato, ρ = m/V, kg/m³, flotación y fracción sumergida (tolerancia 1e-9) y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_DENSIDAD)).toEqual([])
    const rengComprobar = (rengV: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengRho = rengV.m! / rengV.V!
      if (Math.abs(rengL.rho! - rengRho) > 1e-9 * rengRho) return 'densidad'
      if (Math.abs(rengL.rhoSI! - 1000 * rengRho) > 1e-9 * 1000 * rengRho) return 'kg/m³'
      if (rengL.flota !== (rengRho < rengV.rhoL! ? 1 : 0)) return 'flotación'
      if (Math.abs(rengL.sumergido! - Math.min(100, (100 * rengRho) / rengV.rhoL!)) > 1e-9 * 100) return 'sumergido'
      if (Math.abs(rengLecturasDensidad({ ...rengV, m: 2 * rengV.m!, V: 2 * rengV.V! }).rho! - rengRho) > 1e-9 * rengRho) return 'no es intensiva'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_DENSIDAD, rengComprobar, 3)).toEqual([])
    const rengRoto = { ...RENG_ESCENA_DENSIDAD, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasDensidad(rengV), rhoSI: rengLecturasDensidad(rengV).rho! * 1e6 }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 3).length).toBeGreaterThan(0)
  })
})
