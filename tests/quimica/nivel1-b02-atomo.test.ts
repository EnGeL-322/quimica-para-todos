import { describe, expect, it } from 'vitest'
import { rengResolverRuta } from '../../src/renderer/shell/nucleo/rutas'
import { RENG_LECCIONES_ATOMO } from '../../src/renderer/modules/simulador-quimica/aprender/n1/atomo/lecciones'
import { rengLeccionN1PorId } from '../../src/renderer/modules/simulador-quimica/aprender/n1/registro'
import { RENG_PATRON_ID_LECCION_N1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/tipos'
import { rengOcupacion } from '../../src/renderer/modules/tabla-periodica/data'
import { RENG_ESCENA_ATOMO, RENG_ME_U, RENG_MN_U, RENG_MP_U, rengLecturasAtomo } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/atomo'
import { RENG_ESCENA_CONFIG, rengLecturasConfig } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/config-electronica'
import { RENG_ESCENA_ESPECTRO, rengLecturasEspectro } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/espectro-hidrogeno'
import { rengComprobarEscenaN1, rengValidarModeloEscenaN1 } from '../../src/renderer/modules/simulador-quimica/escenas-n1/kit'
import { RENG_NAV_INICIAL, rengNavDeSubruta } from '../../src/renderer/modules/simulador-quimica/navegacion'
import { RENG_TEMAS } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_GRUPOS_PRACTICAS_N1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/registro'
import { rengCatalogoReal, RENG_TEMARIO } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import { rengClaveRecurso } from '../../src/renderer/modules/simulador-quimica/temario/recursos'
import { RENG_DECISIONES_PASO0_N1 } from '../../src/renderer/modules/simulador-quimica/temario/retiradas-n1'
import { rengProbarGrupo, rengProbarPractica } from './nivel1-comun'
import { RENG_SEGUNDOS_B02 } from './nivel1-b02-segundos'

const RENG_BLOQUE = 2
const rengGruposBloque = RENG_GRUPOS_PRACTICAS_N1.filter((rengG) => rengG.bloque === RENG_BLOQUE)

describe('Nivel 1 · bloque 2 · prácticas (75)', () => {
  it('hay 25 grupos de 3 prácticas y un segundo método para cada una (más los 6 integradores)', () => {
    expect(rengGruposBloque.map((rengG) => rengG.posicion)).toEqual(Array.from({ length: 25 }, (_, rengI) => rengI + 1))
    const rengIds = rengGruposBloque.flatMap((rengG) => rengG.practicas.map((rengP) => rengP.id))
    expect(rengIds).toHaveLength(75)
    expect(new Set(rengIds).size).toBe(75)
    const rengConSegundo = Object.keys(RENG_SEGUNDOS_B02).filter((rengK) => !rengK.includes('-i'))
    expect(rengConSegundo.sort()).toEqual([...rengIds].sort())
  })
  for (const rengG of rengGruposBloque) {
    describe(rengG.subtema, () => {
      rengProbarGrupo(rengG.subtema, rengG.practicas)
      for (const rengP of rengG.practicas) rengProbarPractica(rengP, RENG_SEGUNDOS_B02[rengP.id])
    })
  }
})

describe('Nivel 1 · bloque 2 · lecciones', () => {
  const rengSubtemas = RENG_TEMARIO.niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!.subtemas

  it('una lección por subtema, en orden, con el título del temario', () => {
    expect(RENG_LECCIONES_ATOMO).toHaveLength(25)
    expect(RENG_LECCIONES_ATOMO.map((rengL) => rengL.subtema)).toEqual(rengSubtemas.map((rengS) => rengS.id))
    RENG_LECCIONES_ATOMO.forEach((rengL, rengI) => {
      expect(`${rengL.nombre}.`, rengL.id).toBe(rengSubtemas[rengI]!.titulo)
      expect(rengL.posicion).toBe(rengI + 1)
    })
  })

  it('ids con patrón, sin chocar con temas, con ruta aprender-<id> válida', () => {
    const rengTemas = new Set(RENG_TEMAS.map((rengT) => rengT.id))
    for (const rengL of RENG_LECCIONES_ATOMO) {
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
    for (const rengL of RENG_LECCIONES_ATOMO) {
      const rengNiveles = rengL.procedencia.map((rengP) => rengP.nivel)
      expect(rengNiveles, rengL.id).toEqual(expect.arrayContaining(['parametro-didactico', 'ejemplo-idealizado', 'dato-calculado', 'sin-verificar']))
      expect(rengNiveles, rengL.id).not.toContain('fuente-verificada')
    }
  })
})

describe('Nivel 1 · bloque 2 · Paso 0, cobertura y escenas', () => {
  const rengCat = rengCatalogoReal().niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!

  it('las decisiones del Paso 0 se reflejan en el catálogo y no queda nada por revisar', () => {
    for (const rengD of RENG_DECISIONES_PASO0_N1.filter((rengX) => rengX.subtema.startsWith('n1-b2-'))) {
      const rengS = rengCat.subtemas.find((rengX) => rengX.id === rengD.subtema)!
      const rengClaves = [...rengS.confirmados, ...rengS.porRevisar].map(rengClaveRecurso)
      expect(rengClaves.includes(rengClaveRecurso(rengD.recurso)), `${rengD.subtema} ${rengClaveRecurso(rengD.recurso)}`).toBe(rengD.decision === 'confirmada')
      expect(rengD.motivo.length).toBeGreaterThan(40)
    }
    expect(rengCat.conteo.porRevisar).toBe(0)
  })

  it('los 25 subtemas tienen lección y prácticas confirmadas, 22 con simulación, y quedan en Parcial solo por la atestación', () => {
    for (const rengS of rengCat.subtemas) {
      expect(rengS.evaluacion.estado, rengS.id).toBe('parcial')
      expect(rengS.evaluacion.faltanParaCompletado, rengS.id).toContain('Falta la atestación registrada de que la lección y la práctica tratan este subtema')
    }
    expect(rengCat.conteo.porCapa).toMatchObject({ aprender: 25, practica: 25, simulacion: 22 })
  })

  it('escena «atomo»: contrato, recuento de partículas, A, carga, masa y valencia (tolerancia 1e-9) y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_ATOMO)).toEqual([])
    const rengComprobar = (rengCrudo: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengV = { Z: Math.round(rengCrudo.Z!), N: Math.round(rengCrudo.N!), q: Math.round(rengCrudo.q!) }
      const rengE = Math.max(0, rengV.Z! - rengV.q!)
      if (rengL.p !== rengV.Z || rengL.n !== rengV.N) return 'núcleo'
      if (rengL.e !== rengE) return 'electrones'
      if (rengL.A !== rengV.Z! + rengV.N!) return 'número másico'
      if (rengL.carga !== rengV.Z! - rengE) return 'carga'
      const rengMasa = rengV.Z! * RENG_MP_U + rengV.N! * RENG_MN_U + rengE * RENG_ME_U
      if (Math.abs(rengL.masa! - rengMasa) > 1e-9 * rengMasa) return 'masa'
      const rengOcc = [...rengOcupacion(rengE).entries()].filter(([, rengK]) => rengK > 0)
      const rengCapa = Math.max(0, ...rengOcc.map(([rengS]) => Number(rengS[0])))
      const rengVal = rengOcc.filter(([rengS]) => Number(rengS[0]) === rengCapa && 'sp'.includes(rengS[1]!)).reduce((rengA, [, rengK]) => rengA + rengK, 0)
      if (rengL.valencia !== rengVal) return 'valencia'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_ATOMO, rengComprobar, 3)).toEqual([])
    const rengRoto = { ...RENG_ESCENA_ATOMO, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasAtomo(rengV), e: Math.round(rengV.Z!) + Math.round(rengV.q!) }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 3).length).toBeGreaterThan(0)
  })

  it('escena «espectro-hidrogeno»: contrato, ΔE de Bohr, λ·ΔE = hc, c = λ·ν, franja visible y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_ESPECTRO)).toEqual([])
    const rengHc = (6.62607015e-34 * 299792458) / 1.602176634e-19 / 1e-9
    const rengComprobar = (rengV: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengB = Math.min(rengV.nBajo!, rengV.nAlto! - 1)
      if (rengL.bajo !== rengB) return 'nivel de llegada'
      const rengDe = 13.6 * (1 / (rengB * rengB) - 1 / (rengV.nAlto! * rengV.nAlto!))
      if (Math.abs(rengL.dE! - rengDe) > 1e-9 * rengDe) return 'energía'
      if (Math.abs(rengL.Ealto! - rengL.Ebajo! - rengDe) > 1e-9 * rengDe) return 'niveles'
      if (Math.abs(rengL.lambda! * rengL.dE! - rengHc) > 1e-9 * rengHc) return 'longitud de onda'
      if (Math.abs(rengL.nu! * 1e14 * rengL.lambda! * 1e-9 - 299792458) > 1e-9 * 299792458) return 'frecuencia'
      if (rengL.visible !== (rengL.lambda! >= 380 && rengL.lambda! <= 750 ? 1 : 0)) return 'visible'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_ESPECTRO, rengComprobar, 3)).toEqual([])
    expect(rengLecturasEspectro({ nAlto: 3, nBajo: 2 }).lambda!).toBeGreaterThan(655)
    expect(rengLecturasEspectro({ nAlto: 3, nBajo: 2 }).lambda!).toBeLessThan(657)
    const rengRoto = { ...RENG_ESCENA_ESPECTRO, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasEspectro(rengV), dE: 13.6 * (1 / Math.min(rengV.nBajo!, rengV.nAlto! - 1) - 1 / rengV.nAlto!) }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 3).length).toBeGreaterThan(0)
  })

  it('escena «config-electronica»: contrato, los electrones suman Z, capacidades, orbitales y desapareados por reparto explícito, y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_CONFIG)).toEqual([])
    const rengComprobar = (rengV: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      if (rengL.s! + rengL.p! + rengL.d! !== rengV.Z) return 'no suman Z'
      let rengOrb = 0
      let rengDes = 0
      let rengSub = 0
      for (const [rengS, rengK] of rengOcupacion(rengV.Z!)) {
        if (rengK <= 0) continue
        const rengN = 2 * 'spdf'.indexOf(rengS[1]!) + 1
        if (rengK > 2 * rengN) return 'capacidad'
        const rengCajas = new Array<number>(rengN).fill(0)
        for (let rengI = 0; rengI < rengK; rengI++) rengCajas[rengI % rengN]! += 1
        rengOrb += rengCajas.filter((rengX) => rengX > 0).length
        rengDes += rengCajas.filter((rengX) => rengX === 1).length
        rengSub += 1
      }
      if (rengL.orbitales !== rengOrb) return 'orbitales'
      if (rengL.desapareados !== rengDes) return 'desapareados'
      if (rengL.subniveles !== rengSub) return 'subniveles'
      if (rengL.externa! < 1 || rengL.externa! > 8 || rengL.capa! < 1 || rengL.capa! > 4) return 'capa externa'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_CONFIG, rengComprobar, 36)).toEqual([])
    expect(rengLecturasConfig({ Z: 24 }).desapareados).toBe(6)
    expect(rengLecturasConfig({ Z: 7 }).desapareados).toBe(3)
    expect(rengLecturasConfig({ Z: 26 })).toMatchObject({ s: 8, p: 12, d: 6, desapareados: 4, capa: 4, externa: 2 })
    const rengRoto = { ...RENG_ESCENA_CONFIG, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasConfig(rengV), desapareados: rengV.Z! % 2 }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 36).length).toBeGreaterThan(0)
  })
})
