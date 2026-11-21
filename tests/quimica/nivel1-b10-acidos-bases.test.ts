import { describe, expect, it } from 'vitest'
import { rengResolverRuta } from '../../src/renderer/shell/nucleo/rutas'
import { RENG_LECCIONES_ACIDOS } from '../../src/renderer/modules/simulador-quimica/aprender/n1/acidos/lecciones'
import { rengLeccionN1PorId } from '../../src/renderer/modules/simulador-quimica/aprender/n1/registro'
import { RENG_PATRON_ID_LECCION_N1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/tipos'
import { RENG_ESCENA_ACIDO_BASE, rengLecturasAcidoBase } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/acido-base'
import { RENG_ESCENA_EQUILIBRIO_GAS, rengLecturasEquilibrioGas } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/equilibrio-gas'
import { RENG_KW_25C, RENG_PKW_25C } from '../../src/renderer/modules/simulador-quimica/nucleo/acidoBase'
import { rengComprobarEscenaN1, rengValidarModeloEscenaN1 } from '../../src/renderer/modules/simulador-quimica/escenas-n1/kit'
import { RENG_NAV_INICIAL, rengNavDeSubruta } from '../../src/renderer/modules/simulador-quimica/navegacion'
import { RENG_TEMAS } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_GRUPOS_PRACTICAS_N1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/registro'
import { rengCatalogoReal, RENG_TEMARIO } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import { rengClaveRecurso } from '../../src/renderer/modules/simulador-quimica/temario/recursos'
import { RENG_DECISIONES_PASO0_N1 } from '../../src/renderer/modules/simulador-quimica/temario/retiradas-n1'
import { rengProbarGrupo, rengProbarPractica } from './nivel1-comun'
import { RENG_SEGUNDOS_B10 } from './nivel1-b10-segundos'

const RENG_BLOQUE = 10
const rengGruposBloque = RENG_GRUPOS_PRACTICAS_N1.filter((rengG) => rengG.bloque === RENG_BLOQUE)

describe('Nivel 1 · bloque 10 · prácticas (66)', () => {
  it('hay 22 grupos de 3 prácticas y un segundo método para cada una (más los 6 integradores)', () => {
    expect(rengGruposBloque.map((rengG) => rengG.posicion)).toEqual(Array.from({ length: 22 }, (_, rengI) => rengI + 1))
    const rengIds = rengGruposBloque.flatMap((rengG) => rengG.practicas.map((rengP) => rengP.id))
    expect(rengIds).toHaveLength(66)
    expect(new Set(rengIds).size).toBe(66)
    const rengConSegundo = Object.keys(RENG_SEGUNDOS_B10).filter((rengK) => !rengK.includes('-i'))
    expect(rengConSegundo.sort()).toEqual([...rengIds].sort())
  })
  for (const rengG of rengGruposBloque) {
    describe(rengG.subtema, () => {
      rengProbarGrupo(rengG.subtema, rengG.practicas)
      for (const rengP of rengG.practicas) rengProbarPractica(rengP, RENG_SEGUNDOS_B10[rengP.id])
    })
  }
})

describe('Nivel 1 · bloque 10 · lecciones', () => {
  const rengSubtemas = RENG_TEMARIO.niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!.subtemas

  it('una lección por subtema, en orden, con el título del temario', () => {
    expect(RENG_LECCIONES_ACIDOS).toHaveLength(22)
    expect(RENG_LECCIONES_ACIDOS.map((rengL) => rengL.subtema)).toEqual(rengSubtemas.map((rengS) => rengS.id))
    RENG_LECCIONES_ACIDOS.forEach((rengL, rengI) => {
      expect(`${rengL.nombre}.`, rengL.id).toBe(rengSubtemas[rengI]!.titulo)
      expect(rengL.posicion).toBe(rengI + 1)
    })
  })

  it('ids con patrón, sin chocar con temas, con ruta aprender-<id> válida', () => {
    const rengTemas = new Set(RENG_TEMAS.map((rengT) => rengT.id))
    for (const rengL of RENG_LECCIONES_ACIDOS) {
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
    for (const rengL of RENG_LECCIONES_ACIDOS) {
      const rengNiveles = rengL.procedencia.map((rengP) => rengP.nivel)
      expect(rengNiveles, rengL.id).toEqual(expect.arrayContaining(['parametro-didactico', 'ejemplo-idealizado', 'dato-calculado', 'sin-verificar']))
      expect(rengNiveles, rengL.id).not.toContain('fuente-verificada')
    }
  })
})

describe('Nivel 1 · bloque 10 · Paso 0, cobertura y escena', () => {
  const rengCat = rengCatalogoReal().niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!

  it('las decisiones del Paso 0 se reflejan en el catálogo y no queda nada por revisar', () => {
    for (const rengD of RENG_DECISIONES_PASO0_N1.filter((rengX) => rengX.subtema.startsWith('n1-b10-'))) {
      const rengS = rengCat.subtemas.find((rengX) => rengX.id === rengD.subtema)!
      const rengClaves = [...rengS.confirmados, ...rengS.porRevisar].map(rengClaveRecurso)
      expect(rengClaves.includes(rengClaveRecurso(rengD.recurso)), `${rengD.subtema} ${rengClaveRecurso(rengD.recurso)}`).toBe(rengD.decision === 'confirmada')
      expect(rengD.motivo.length).toBeGreaterThan(40)
    }
    expect(rengCat.conteo.porRevisar).toBe(0)
  })

  it('los 22 subtemas tienen lección y prácticas confirmadas, 21 con simulación, y quedan en Parcial solo por la atestación', () => {
    for (const rengS of rengCat.subtemas) {
      expect(rengS.evaluacion.estado, rengS.id).toBe('parcial')
      expect(rengS.evaluacion.faltanParaCompletado, rengS.id).toContain('Falta la atestación registrada de que la lección y la práctica tratan este subtema')
    }
    expect(rengCat.conteo.porCapa).toMatchObject({ aprender: 22, practica: 22, simulacion: 21 })
  })

  it('escena «acido-base»: contrato, balance de carga y pH + pOH = pKw (tolerancia 1e-9) y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_ACIDO_BASE)).toEqual([])
    const rengComprobar = (rengV: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengKa = 10 ** -rengV.pKa!
      const rengEscala = Math.max(rengL.H!, rengL.OH!, rengV.Ca! + rengV.Cs! + rengV.Cb!, 1e-7)
      const rengResto = rengL.H! + rengV.Cs! + rengV.Cb! - rengL.OH! - ((rengV.Ca! + rengV.Cs!) * rengKa) / (rengKa + rengL.H!)
      if (Math.abs(rengResto) > 1e-9 * rengEscala) return `balance de carga ${rengResto}`
      if (Math.abs(rengL.pH! + rengL.pOH! - RENG_PKW_25C) > 1e-9) return 'pH + pOH'
      if (Math.abs(rengL.kw! / RENG_KW_25C - 1) > 1e-9) return 'Kw'
      if (Math.abs(rengL.pKb! + rengV.pKa! - RENG_PKW_25C) > 1e-9) return 'pKb'
      if (Math.abs(rengL.ind! - 100 / (1 + 10 ** (rengV.pKin! - rengL.pH!))) > 1e-9) return 'indicador'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_ACIDO_BASE, rengComprobar, 3)).toEqual([])
    const rengRoto = { ...RENG_ESCENA_ACIDO_BASE, lecturas: (rengV: Readonly<Record<string, number>>) => { const rengL = rengLecturasAcidoBase(rengV); const rengH = rengL.H! * 1.01; return { ...rengL, H: rengH, pH: -Math.log10(rengH) } } }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 3).length).toBeGreaterThan(0)
  })

  it('escena «equilibrio-gas»: contrato, Qp = Kp, Kc = Kp/(RT) y conservación de A (tolerancia 1e-9) y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_EQUILIBRIO_GAS)).toEqual([])
    const rengComprobar = (rengV: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengRT = 0.08314462618 * rengV.T!
      if (Math.abs(rengL.Qp! / rengV.Kp! - 1) > 1e-9) return `Qp ${rengL.Qp} frente a Kp ${rengV.Kp}`
      if (Math.abs(rengL.Kc! * rengRT / rengV.Kp! - 1) > 1e-9) return 'Kc'
      if (Math.abs((rengL.cA! + rengL.cB! / 2) / (rengV.n0! / rengV.V!) - 1) > 1e-9) return 'conservación de A'
      if (Math.abs(rengL.Ptot! - (rengL.cA! + rengL.cB!) * rengRT) > 1e-9 * rengL.Ptot!) return 'presión total'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_EQUILIBRIO_GAS, rengComprobar, 3)).toEqual([])
    const rengRoto = { ...RENG_ESCENA_EQUILIBRIO_GAS, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasEquilibrioGas({ ...rengV, Kp: rengV.Kp! * 0.08314462618 * rengV.T! }), Kc: rengV.Kp! }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 3).length).toBeGreaterThan(0)
  })
})
