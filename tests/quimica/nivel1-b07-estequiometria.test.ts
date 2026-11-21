import { describe, expect, it } from 'vitest'
import { rengResolverRuta } from '../../src/renderer/shell/nucleo/rutas'
import { RENG_LECCIONES_ESTEQUIOMETRIA } from '../../src/renderer/modules/simulador-quimica/aprender/n1/estequiometria/lecciones'
import { rengLeccionN1PorId } from '../../src/renderer/modules/simulador-quimica/aprender/n1/registro'
import { RENG_PATRON_ID_LECCION_N1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/tipos'
import { RENG_ESCENA_LIMITANTE, RENG_REACCIONES_LIMITANTE, rengLecturasLimitante } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/reactivo-limitante'
import { rengComprobarEscenaN1, rengValidarModeloEscenaN1 } from '../../src/renderer/modules/simulador-quimica/escenas-n1/kit'
import { RENG_NAV_INICIAL, rengNavDeSubruta } from '../../src/renderer/modules/simulador-quimica/navegacion'
import { rengAnalizarFormula } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { RENG_TEMAS } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_GRUPOS_PRACTICAS_N1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/registro'
import { rengCatalogoReal, RENG_TEMARIO } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import { rengClaveRecurso } from '../../src/renderer/modules/simulador-quimica/temario/recursos'
import { RENG_DECISIONES_PASO0_N1 } from '../../src/renderer/modules/simulador-quimica/temario/retiradas-n1'
import { rengPorSimbolo } from '../../src/renderer/modules/tabla-periodica/data'
import { rengProbarGrupo, rengProbarPractica } from './nivel1-comun'
import { RENG_SEGUNDOS_B07 } from './nivel1-b07-segundos'

const RENG_BLOQUE = 7
const rengGruposBloque = RENG_GRUPOS_PRACTICAS_N1.filter((rengG) => rengG.bloque === RENG_BLOQUE)

describe('Nivel 1 · bloque 7 · prácticas (63)', () => {
  it('hay 21 grupos de 3 prácticas y un segundo método para cada una (más los 6 integradores)', () => {
    expect(rengGruposBloque.map((rengG) => rengG.posicion)).toEqual(Array.from({ length: 21 }, (_, rengI) => rengI + 1))
    const rengIds = rengGruposBloque.flatMap((rengG) => rengG.practicas.map((rengP) => rengP.id))
    expect(rengIds).toHaveLength(63)
    expect(new Set(rengIds).size).toBe(63)
    const rengConSegundo = Object.keys(RENG_SEGUNDOS_B07).filter((rengK) => !rengK.includes('-i'))
    expect(rengConSegundo.sort()).toEqual([...rengIds].sort())
  })
  for (const rengG of rengGruposBloque) {
    describe(rengG.subtema, () => {
      rengProbarGrupo(rengG.subtema, rengG.practicas)
      for (const rengP of rengG.practicas) rengProbarPractica(rengP, RENG_SEGUNDOS_B07[rengP.id])
    })
  }
})

describe('Nivel 1 · bloque 7 · lecciones', () => {
  const rengSubtemas = RENG_TEMARIO.niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!.subtemas

  it('una lección por subtema, en orden, con el título del temario', () => {
    expect(RENG_LECCIONES_ESTEQUIOMETRIA).toHaveLength(21)
    expect(RENG_LECCIONES_ESTEQUIOMETRIA.map((rengL) => rengL.subtema)).toEqual(rengSubtemas.map((rengS) => rengS.id))
    RENG_LECCIONES_ESTEQUIOMETRIA.forEach((rengL, rengI) => {
      expect(`${rengL.nombre}.`, rengL.id).toBe(rengSubtemas[rengI]!.titulo)
      expect(rengL.posicion).toBe(rengI + 1)
    })
  })

  it('ids con patrón, sin chocar con temas, con ruta aprender-<id> válida', () => {
    const rengTemas = new Set(RENG_TEMAS.map((rengT) => rengT.id))
    for (const rengL of RENG_LECCIONES_ESTEQUIOMETRIA) {
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
    for (const rengL of RENG_LECCIONES_ESTEQUIOMETRIA) {
      const rengNiveles = rengL.procedencia.map((rengP) => rengP.nivel)
      expect(rengNiveles, rengL.id).toEqual(expect.arrayContaining(['parametro-didactico', 'ejemplo-idealizado', 'dato-calculado', 'sin-verificar']))
      expect(rengNiveles, rengL.id).not.toContain('fuente-verificada')
    }
  })
})

describe('Nivel 1 · bloque 7 · Paso 0, cobertura y escena', () => {
  const rengCat = rengCatalogoReal().niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!

  it('las decisiones del Paso 0 se reflejan en el catálogo y no queda nada por revisar', () => {
    for (const rengD of RENG_DECISIONES_PASO0_N1.filter((rengX) => rengX.subtema.startsWith('n1-b7-'))) {
      const rengS = rengCat.subtemas.find((rengX) => rengX.id === rengD.subtema)!
      const rengClaves = [...rengS.confirmados, ...rengS.porRevisar].map(rengClaveRecurso)
      expect(rengClaves.includes(rengClaveRecurso(rengD.recurso)), `${rengD.subtema} ${rengClaveRecurso(rengD.recurso)}`).toBe(rengD.decision === 'confirmada')
      expect(rengD.motivo.length).toBeGreaterThan(40)
    }
    expect(rengCat.conteo.porRevisar).toBe(0)
  })

  it('los 21 subtemas tienen lección y prácticas confirmadas, 10 con simulación, y quedan en Parcial solo por la atestación', () => {
    for (const rengS of rengCat.subtemas) {
      expect(rengS.evaluacion.estado, rengS.id).toBe('parcial')
      expect(rengS.evaluacion.faltanParaCompletado, rengS.id).toContain('Falta la atestación registrada de que la lección y la práctica tratan este subtema')
    }
    expect(rengCat.conteo.porCapa).toMatchObject({ aprender: 21, practica: 21, simulacion: 10 })
  })

  it('escena «reactivo limitante»: contrato, comprobación por balance de átomos (tolerancia 1e-9) y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_LIMITANTE)).toEqual([])
    const rengAtomos = (rengF: string): Map<string, number> => rengAnalizarFormula(rengF).atomos
    const rengMasa = (rengF: string): number => [...rengAtomos(rengF).entries()].reduce((rengS, [rengEl, rengN]) => rengS + rengPorSimbolo.get(rengEl)!.masa * rengN, 0)
    const rengComprobar = (rengV: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const [rengIzq, rengDer] = RENG_REACCIONES_LIMITANTE[Math.round(rengV.r!)]!.split('=').map((rengX) => rengX.trim().split('+').map((rengY) => rengY.trim()))
      const rengEsp = (rengTxt: string): { c: number; f: string } => { const rengM = /^(\d*)(.+)$/.exec(rengTxt)!; return { c: rengM[1] ? Number(rengM[1]) : 1, f: rengM[2]! } }
      const [rengA, rengB] = rengIzq!.map(rengEsp)
      const rengP = rengEsp(rengDer![0]!)
      const rengXi = Math.min(rengV.n1! / rengA!.c, rengV.n2! / rengB!.c)
      const rengTol = (rengX: number, rengY: number): boolean => Math.abs(rengX - rengY) <= 1e-9 * Math.max(1, Math.abs(rengX), Math.abs(rengY))
      if (!rengTol(rengL.avance!, rengXi)) return `avance ${rengL.avance} frente a ${rengXi}`
      if (!rengTol(rengL.nProducto!, rengP.c * rengXi)) return 'moles de producto'
      if (!rengTol(rengL.mProducto!, rengP.c * rengXi * rengMasa(rengP.f))) return 'masa de producto'
      if (!rengTol(rengL.mReal!, rengP.c * rengXi * rengMasa(rengP.f) * (rengV.rend! / 100))) return 'masa real'
      const rengSobra = Math.max(rengV.n1! - rengA!.c * rengXi, rengV.n2! - rengB!.c * rengXi)
      if (!rengTol(rengL.sobrante!, rengSobra)) return 'sobrante'
      if (Math.abs(rengL.balance!) > 1e-9 * rengMasa(rengP.f) * 100) return `balance de masa ${rengL.balance}`
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_LIMITANTE, rengComprobar, 3)).toEqual([])
    const rengRoto = { ...RENG_ESCENA_LIMITANTE, lecturas: (rengV: Readonly<Record<string, number>>, rengT: number) => ({ ...rengLecturasLimitante({ ...rengV, n1: Math.max(rengV.n1!, rengV.n2!), n2: Math.max(rengV.n1!, rengV.n2!) }), _t: rengT }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 3).length).toBeGreaterThan(0)
  })
})
