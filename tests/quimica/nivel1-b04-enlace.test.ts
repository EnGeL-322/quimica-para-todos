import { describe, expect, it } from 'vitest'
import { rengResolverRuta } from '../../src/renderer/shell/nucleo/rutas'
import { RENG_LECCIONES_ENLACE } from '../../src/renderer/modules/simulador-quimica/aprender/n1/enlace/lecciones'
import { rengLeccionN1PorId } from '../../src/renderer/modules/simulador-quimica/aprender/n1/registro'
import { RENG_PATRON_ID_LECCION_N1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/tipos'
import { rengComprobarEscenaN1, rengValidarModeloEscenaN1 } from '../../src/renderer/modules/simulador-quimica/escenas-n1/kit'
import { RENG_ESCENA_CARGA_FORMAL, rengLecturasCargaFormal } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/carga-formal'
import { RENG_ANGULO_VSEPR, RENG_ESCENA_VSEPR, rengFormaVsepr, rengLecturasVsepr } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/geometria-vsepr'
import { RENG_ESCENA_INTERACCION, rengLecturasInteraccion } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/interaccion-molecular'
import { RENG_ESCENA_ORDEN, rengLecturasOrden } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/orden-enlace'
import { RENG_ESCENA_POLARIDAD, rengLecturasPolaridad } from '../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/polaridad-enlace'
import { RENG_ESPECIES_LEWIS_EN, RENG_SIGMA_PI_EN, rengAtomosTotalesEn, rengInsaturacionEn, rengParesOctetoEn } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b04-comun'
import { RENG_NAV_INICIAL, rengNavDeSubruta } from '../../src/renderer/modules/simulador-quimica/navegacion'
import { RENG_TEMAS } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_GRUPOS_PRACTICAS_N1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/registro'
import { rengCatalogoReal, RENG_TEMARIO } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import { rengClaveRecurso } from '../../src/renderer/modules/simulador-quimica/temario/recursos'
import { RENG_DECISIONES_PASO0_N1 } from '../../src/renderer/modules/simulador-quimica/temario/retiradas-n1'
import { rengProbarGrupo, rengProbarPractica } from './nivel1-comun'
import { RENG_SEGUNDOS_B04 } from './nivel1-b04-segundos'

const RENG_BLOQUE = 4
const rengGruposBloque = RENG_GRUPOS_PRACTICAS_N1.filter((rengG) => rengG.bloque === RENG_BLOQUE)

describe('Nivel 1 · bloque 4 · prácticas (66)', () => {
  it('hay 22 grupos de 3 prácticas y un segundo método para cada una (más los 6 integradores)', () => {
    expect(rengGruposBloque.map((rengG) => rengG.posicion)).toEqual(Array.from({ length: 22 }, (_, rengI) => rengI + 1))
    const rengIds = rengGruposBloque.flatMap((rengG) => rengG.practicas.map((rengP) => rengP.id))
    expect(rengIds).toHaveLength(66)
    expect(new Set(rengIds).size).toBe(66)
    const rengConSegundo = Object.keys(RENG_SEGUNDOS_B04).filter((rengK) => !rengK.includes('-i'))
    expect(rengConSegundo.sort()).toEqual([...rengIds].sort())
  })
  for (const rengG of rengGruposBloque) {
    describe(rengG.subtema, () => {
      rengProbarGrupo(rengG.subtema, rengG.practicas)
      for (const rengP of rengG.practicas) rengProbarPractica(rengP, RENG_SEGUNDOS_B04[rengP.id])
    })
  }
})

describe('Nivel 1 · bloque 4 · lecciones', () => {
  const rengSubtemas = RENG_TEMARIO.niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!.subtemas

  it('una lección por subtema, en orden, con el título del temario', () => {
    expect(RENG_LECCIONES_ENLACE).toHaveLength(22)
    expect(RENG_LECCIONES_ENLACE.map((rengL) => rengL.subtema)).toEqual(rengSubtemas.map((rengS) => rengS.id))
    RENG_LECCIONES_ENLACE.forEach((rengL, rengI) => {
      expect(`${rengL.nombre}.`, rengL.id).toBe(rengSubtemas[rengI]!.titulo)
      expect(rengL.posicion).toBe(rengI + 1)
    })
  })

  it('ids con patrón, sin chocar con temas, con ruta aprender-<id> válida', () => {
    const rengTemas = new Set(RENG_TEMAS.map((rengT) => rengT.id))
    for (const rengL of RENG_LECCIONES_ENLACE) {
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
    for (const rengL of RENG_LECCIONES_ENLACE) {
      const rengNiveles = rengL.procedencia.map((rengP) => rengP.nivel)
      expect(rengNiveles, rengL.id).toEqual(expect.arrayContaining(['parametro-didactico', 'ejemplo-idealizado', 'dato-calculado', 'sin-verificar']))
      expect(rengNiveles, rengL.id).not.toContain('fuente-verificada')
    }
  })
})

describe('Nivel 1 · bloque 4 · Paso 0, cobertura y escenas', () => {
  const rengCat = rengCatalogoReal().niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!

  it('las decisiones del Paso 0 se reflejan en el catálogo y no queda nada por revisar', () => {
    for (const rengD of RENG_DECISIONES_PASO0_N1.filter((rengX) => rengX.subtema.startsWith('n1-b4-'))) {
      const rengS = rengCat.subtemas.find((rengX) => rengX.id === rengD.subtema)!
      const rengClaves = [...rengS.confirmados, ...rengS.porRevisar].map(rengClaveRecurso)
      expect(rengClaves.includes(rengClaveRecurso(rengD.recurso)), `${rengD.subtema} ${rengClaveRecurso(rengD.recurso)}`).toBe(rengD.decision === 'confirmada')
      expect(rengD.motivo.length).toBeGreaterThan(40)
    }
    expect(rengCat.conteo.porRevisar).toBe(0)
  })

  it('los 22 subtemas tienen lección y prácticas confirmadas, 20 con simulación, y quedan en Parcial solo por la atestación', () => {
    for (const rengS of rengCat.subtemas) {
      expect(rengS.evaluacion.estado, rengS.id).toBe('parcial')
      expect(rengS.evaluacion.faltanParaCompletado, rengS.id).toContain('Falta la atestación registrada de que la lección y la práctica tratan este subtema')
    }
    expect(rengCat.conteo.porCapa).toMatchObject({ aprender: 22, practica: 22, simulacion: 20 })
  })

  it('escena «carga-formal»: contrato, CF = V − L − B, recuento de electrones y octeto, y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_CARGA_FORMAL)).toEqual([])
    const rengComprobar = (rengCrudo: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const [rengV, rengLib, rengB] = [Math.round(rengCrudo.V!), Math.round(rengCrudo.L!), Math.round(rengCrudo.B!)]
      if (rengL.cf !== rengV - rengLib - rengB) return 'carga formal'
      if (rengL.alrededor !== rengLib + 2 * rengB) return 'electrones alrededor'
      if (rengL.propios! + rengL.cf! !== rengV) return 'electrones asignados'
      if (rengL.octeto !== (rengLib + 2 * rengB === 8 ? 1 : 0)) return 'octeto'
      if (rengL.pares !== rengLib / 2) return 'pares libres'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_CARGA_FORMAL, rengComprobar, 4)).toEqual([])
    expect(rengLecturasCargaFormal({ V: 5, L: 0, B: 4 })).toMatchObject({ cf: 1, alrededor: 8, octeto: 1 })
    const rengRoto = { ...RENG_ESCENA_CARGA_FORMAL, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasCargaFormal(rengV), cf: Math.round(rengV.V!) - Math.round(rengV.L!) - 2 * Math.round(rengV.B!) }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 4).length).toBeGreaterThan(0)
  })

  it('escena «polaridad-enlace»: contrato, Δχ, relación de Pauling, clasificación con 0,4 y 1,7 y momento dipolar, y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_POLARIDAD)).toEqual([])
    const rengComprobar = (rengV: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengD = Math.max(rengV.chiA!, rengV.chiB!) - Math.min(rengV.chiA!, rengV.chiB!)
      if (Math.abs(rengL.dchi! - rengD) > 1e-12) return 'diferencia'
      const rengIon = 100 - 100 / Math.E ** ((rengD * rengD) / 4)
      if (Math.abs(rengL.ionico! - rengIon) > 1e-9) return 'carácter iónico'
      if (rengL.tipo !== (rengD < 0.4 ? 0 : rengD <= 1.7 ? 1 : 2)) return 'tipo'
      const rengMu = ((rengIon / 100) * 1.602176634e-19 * rengV.d! * 1e-12) / 3.33564e-30
      if (Math.abs(rengL.mu! - rengMu) > 1e-9 * Math.max(1, rengMu)) return 'momento dipolar'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_POLARIDAD, rengComprobar, 5)).toEqual([])
    expect(rengLecturasPolaridad({ chiA: 2.2, chiB: 3.16, d: 127 }).tipo).toBe(1)
    expect(rengLecturasPolaridad({ chiA: 0.93, chiB: 3.16, d: 236 }).tipo).toBe(2)
    expect(rengLecturasPolaridad({ chiA: 2.2, chiB: 2.2, d: 74 })).toMatchObject({ tipo: 0, ionico: 0, mu: 0 })
    const rengRoto = { ...RENG_ESCENA_POLARIDAD, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasPolaridad(rengV), ionico: 100 * (1 - Math.exp(-Math.abs(rengV.chiA! - rengV.chiB!) / 4)) }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 5).length).toBeGreaterThan(0)
  })

  it('escena «geometria-vsepr»: contrato, dominios, ángulo, híbridos, simetría y formas conocidas, y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_VSEPR)).toEqual([])
    const rengComprobar = (rengCrudo: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengX = Math.round(rengCrudo.X!)
      const rengE = Math.min(Math.round(rengCrudo.E!), 6 - rengX)
      if (rengL.dominios !== rengX + rengE || rengL.libres !== rengE) return 'dominios'
      if (rengL.dominios! > 6) return 'más de seis dominios'
      if (rengL.angulo !== RENG_ANGULO_VSEPR[rengX + rengE]) return 'ángulo'
      if (rengL.hibridos !== rengL.dominios) return 'híbridos'
      if (rengE === 0 && rengL.simetrica !== 1) return 'simetría sin pares libres'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_VSEPR, rengComprobar, 6)).toEqual([])
    const rengFormas: ReadonlyArray<readonly [number, number, string, number]> = [[2, 0, 'lineal', 180], [3, 0, 'trigonal plana', 120], [2, 1, 'angular', 120], [4, 0, 'tetraédrica', 109.5], [3, 1, 'pirámide trigonal', 109.5], [2, 2, 'angular', 109.5], [5, 0, 'bipirámide trigonal', 90], [6, 0, 'octaédrica', 90], [4, 2, 'plano cuadrada', 90], [2, 3, 'lineal', 90]]
    for (const [rengX, rengE, rengForma, rengAngulo] of rengFormas) {
      expect(rengFormaVsepr({ X: rengX, E: rengE }), `${rengX}-${rengE}`).toBe(rengForma)
      expect(rengLecturasVsepr({ X: rengX, E: rengE }).angulo, `${rengX}-${rengE}`).toBe(rengAngulo)
    }
    expect(rengLecturasVsepr({ X: 2, E: 2 }).simetrica).toBe(0)
    expect(rengLecturasVsepr({ X: 4, E: 2 }).simetrica).toBe(1)
    const rengRoto = { ...RENG_ESCENA_VSEPR, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasVsepr(rengV), angulo: RENG_ANGULO_VSEPR[Math.round(rengV.X!)]! }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 6).length).toBeGreaterThan(0)
  })

  it('escena «interaccion-molecular»: contrato, mínimo −ε en r_m, cero en r_m/2^(1/6), límite a gran distancia y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_INTERACCION)).toEqual([])
    const rengComprobar = (rengV: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengQ = (rengV.rmin! / rengV.r!) ** 6
      const rengE = rengV.eps! * (rengQ * rengQ - 2 * rengQ)
      if (Math.abs(rengL.E! - rengE) > 1e-9 * Math.max(1, Math.abs(rengE))) return 'energía'
      if (rengL.E! < -rengV.eps! - 1e-9) return 'por debajo del pozo'
      if (rengL.atractiva !== (rengV.r! > rengV.rmin! ? 1 : 0)) return 'sentido de la fuerza'
      if (Math.abs(rengLecturasInteraccion({ ...rengV, r: rengV.rmin! }).E! + rengV.eps!) > 1e-9 * rengV.eps!) return 'mínimo'
      if (Math.abs(rengLecturasInteraccion({ ...rengV, r: rengL.sigma! }).E!) > 1e-9 * rengV.eps!) return 'cero'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_INTERACCION, rengComprobar, 4)).toEqual([])
    expect(Math.abs(rengLecturasInteraccion({ eps: 1.19, rmin: 3.757, r: 10 }).E!)).toBeLessThan(0.01)
    expect(rengLecturasInteraccion({ eps: 1.19, rmin: 3.757, r: 3 }).E!).toBeGreaterThan(0)
    const rengRoto = { ...RENG_ESCENA_INTERACCION, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasInteraccion(rengV), E: rengV.eps! * ((rengV.rmin! / rengV.r!) ** 12 - (rengV.rmin! / rengV.r!) ** 6) }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 4).length).toBeGreaterThan(0)
  })

  it('escena «orden-enlace»: contrato, orden, estabilidad y reparto en σ y π, y sabotaje', () => {
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_ORDEN)).toEqual([])
    const rengComprobar = (rengCrudo: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const [rengB, rengA] = [Math.round(rengCrudo.nb!), Math.round(rengCrudo.na!)]
      if (rengL.orden !== (rengB - rengA) / 2) return 'orden'
      if (rengL.estable !== (rengB > rengA ? 1 : 0)) return 'estabilidad'
      if (rengL.total !== rengB + rengA) return 'total'
      if (Number.isInteger(rengL.orden!) && rengL.orden! >= 1 && (rengL.sigma !== 1 || rengL.sigma! + rengL.pi! !== rengL.orden)) return 'σ y π'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_ORDEN, rengComprobar, 11)).toEqual([])
    expect(rengLecturasOrden({ nb: 8, na: 2 })).toMatchObject({ orden: 3, sigma: 1, pi: 2, estable: 1 })
    expect(rengLecturasOrden({ nb: 2, na: 2 })).toMatchObject({ orden: 0, estable: 0 })
    const rengRoto = { ...RENG_ESCENA_ORDEN, lecturas: (rengV: Readonly<Record<string, number>>) => ({ ...rengLecturasOrden(rengV), orden: Math.round(rengV.nb!) - Math.round(rengV.na!) }) }
    expect(rengComprobarEscenaN1(rengRoto, rengComprobar, 11).length).toBeGreaterThan(0)
  })

  it('las listas estructurales recordadas coinciden con la fórmula del octeto y el grado de insaturación', () => {
    for (const [rengF, rengQ, rengB] of RENG_ESPECIES_LEWIS_EN) expect(rengParesOctetoEn(rengF, rengQ), rengF).toBe(rengB)
    for (const [rengN, rengF, rengR, rengS, rengP] of RENG_SIGMA_PI_EN) {
      expect(rengAtomosTotalesEn(rengF) - 1 + rengR, `σ de ${rengN}`).toBe(rengS)
      expect(rengInsaturacionEn(rengF) - rengR, `π de ${rengN}`).toBe(rengP)
    }
  })
})
