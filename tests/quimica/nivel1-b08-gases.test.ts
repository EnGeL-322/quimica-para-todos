import { describe, expect, it } from 'vitest'
import { rengConvertir } from '../../src/renderer/lib/unidades'
import { rengResolverRuta } from '../../src/renderer/shell/nucleo/rutas'
import { RENG_GASES_N1, RENG_R_LATM, rengGas, rengGasPorFormula } from '../../src/renderer/modules/simulador-quimica/aprender/n1/gases/constantes'
import { RENG_EJEMPLOS_GASES } from '../../src/renderer/modules/simulador-quimica/aprender/n1/gases/ejemplos'
import { RENG_LECCIONES_GASES } from '../../src/renderer/modules/simulador-quimica/aprender/n1/gases/lecciones'
import { rengBiseccion, rengRK4 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/numericos'
import { rengEjemploN1PorId, rengLeccionN1PorId } from '../../src/renderer/modules/simulador-quimica/aprender/n1/registro'
import { RENG_PATRON_ID_LECCION_N1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/tipos'
import { RENG_CASOS } from '../../src/renderer/modules/simulador-quimica/datos/casos'
import { RENG_NAV_INICIAL, rengNavDeSubruta } from '../../src/renderer/modules/simulador-quimica/navegacion'
import { RENG_KB, RENG_NA, RENG_VM_CN, rengDensidadGas, rengGasIdeal } from '../../src/renderer/modules/simulador-quimica/nucleo/estequiometria'
import { RENG_TEMAS } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_REACCIONES_GASEOSAS } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b08-s06-s10'
import { RENG_GRUPOS_PRACTICAS_N1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/registro'
import { rengProblemasAtestaciones } from '../../src/renderer/modules/simulador-quimica/temario/atestaciones'
import { rengCatalogoReal, rengConstruirCatalogo, RENG_TEMARIO } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import { RENG_CORRESPONDENCIAS } from '../../src/renderer/modules/simulador-quimica/temario/correspondencias'
import { RENG_CONTEXTO_REAL, RENG_CRITERIOS_COBERTURA, RENG_REGISTRO_COBERTURA, rengEvaluarSubtema, type RengRegistroCobertura } from '../../src/renderer/modules/simulador-quimica/temario/estado'
import { rengAccionesDeRecurso, rengClaveRecurso, rengRecursoExiste } from '../../src/renderer/modules/simulador-quimica/temario/recursos'
import { RENG_DECISIONES_PASO0_N1 } from '../../src/renderer/modules/simulador-quimica/temario/retiradas-n1'
import { rengVerificacionDeRecurso } from '../../src/renderer/modules/simulador-quimica/temario/verificacion'
import { rengCercaRel, rengProbarGrupo, rengProbarPractica, rengTextoSinDefectos, type RengSegundoMetodo } from './nivel1-comun'

const RENG_BLOQUE = 8
const rengConv = (rengV: number, rengDe: string, rengA: string): number => rengConvertir(rengV, rengDe, rengA)
const rengAK = (rengC: number): number => rengConvertir(rengC, '°C', 'K')
const rengMg = (rengI: number): number => rengGas(rengI).M
const rengUMedia = (rengM: number, rengT: number): number => Math.sqrt((8 * RENG_KB * rengT) / (Math.PI * (rengM / 1000 / RENG_NA)))
const rengURms = (rengM: number, rengT: number): number => Math.sqrt((3 * RENG_KB * rengT) / (rengM / 1000 / RENG_NA))
const rengRhoSI = (rengPPa: number, rengMgmol: number, rengTk: number): number => (rengPPa * (rengMgmol / 1000 / RENG_NA)) / (RENG_KB * rengTk)
const RENG_M_O2 = rengGasPorFormula('O2').M

function rengEncuentro(rengL: number, rengVa: number, rengVb: number): number {
  const rengDt = 0.01 / Math.max(rengVa, rengVb)
  let rengT = 0
  while (rengVa * (rengT + rengDt) < rengL - rengVb * (rengT + rengDt)) rengT += rengDt
  const rengHueco = rengL - (rengVa + rengVb) * rengT
  return rengVa * (rengT + rengHueco / (rengVa + rengVb))
}

const rengVdWSI = (rengN: number, rengVL: number, rengTk: number, rengA: number, rengB: number): number => {
  const rengV = rengVL / 1000
  const rengAs = rengA * 101325 * 1e-6
  const rengBs = rengB / 1000
  return rengConv((rengN * RENG_NA * RENG_KB * rengTk) / (rengV - rengN * rengBs) - (rengAs * rengN * rengN) / (rengV * rengV), 'Pa', 'atm')
}

export const RENG_SEGUNDOS_B08: Readonly<Record<string, RengSegundoMetodo>> = {
  'n1-b8-s1-p1': (rengD) => rengConv(rengD.m! / rengD.V!, 'g/mL', 'g/L'),
  'n1-b8-s1-p2': (rengD) => rengConv((rengConv(rengD.rho1!, 'g/L', 'g/mL') * rengD.V1!) / rengD.V2!, 'g/mL', 'g/L'),
  'n1-b8-s1-p3': (rengD) => rengConv(1 / rengD.rhoG!, 'L', 'mL') / (1 / rengD.rhoL!),
  'n1-b8-s2-p1': (rengD) => rengConv(rengD.F! / rengConv(rengD.A!, 'cm²', 'm²'), 'Pa', 'kPa'),
  'n1-b8-s2-p2': (rengD) => rengConv(rengD.P!, 'mmHg', 'kPa'),
  'n1-b8-s2-p3': (rengD) => {
    const rengPatm = rengConv(rengD.Patm!, 'mmHg', 'Pa')
    const rengDp = (13595.1 * 9.80665 * rengD.h!) / 1000
    return rengConv(rengD.caso === 0 ? rengPatm + rengDp : rengPatm - rengDp, 'Pa', 'kPa')
  },
  'n1-b8-s3-p1': (rengD) => (0.76 * (rengD.P! / 101.325) * 13.5951) / rengD.rho!,
  'n1-b8-s3-p2': (rengD) => (13595.1 * 9.80665 * (rengD.hHg! / 1000)) / (rengD.rhoL! * 1000 * 9.80665),
  'n1-b8-s3-p3': (rengD) => rengConv(rengConv(rengD.P!, 'kPa', 'Pa') * rengConv(rengD.l! * rengD.a!, 'cm²', 'm²'), 'N', 'kN'),
  'n1-b8-s4-p1': (rengD) => rengRK4((rengV, rengP) => -rengP / rengV, rengD.V1!, rengD.P1!, rengD.V2!),
  'n1-b8-s4-p2': (rengD) => rengRK4((rengP, rengV) => -rengV / rengP, rengConv(rengD.P1!, 'mmHg', 'atm'), rengD.V1!, rengD.P2!),
  'n1-b8-s4-p3': (rengD) => (1 - rengRK4((rengP, rengV) => -rengV / rengP, 1, 1, 1 + rengD.X! / 100)) * 100,
  'n1-b8-s5-p1': (rengD) => rengRK4((rengT, rengV) => rengV / rengT, rengAK(rengD.t1!), rengD.V1!, rengAK(rengD.t2!)),
  'n1-b8-s5-p2': (rengD) => rengConv(rengBiseccion((rengTx) => (rengD.V1! * rengTx) / rengAK(rengD.t1!) - rengD.V2!, rengAK(rengD.t1!), 3000), 'K', '°C'),
  'n1-b8-s5-p3': (rengD) => rengBiseccion((rengTx) => (rengTx + rengD.dt!) / rengTx - (1 + rengD.p! / 100), 50, 5000),
  'n1-b8-s6-p1': (rengD) => rengRK4((rengT, rengP) => rengP / rengT, rengAK(rengD.t1!), rengD.P1!, rengAK(rengD.t2!)),
  'n1-b8-s6-p2': (rengD) => rengRK4((rengT, rengP) => rengP / rengT, rengD.T1!, rengConv(rengD.P1!, 'atm', 'mmHg'), rengD.T2!),
  'n1-b8-s6-p3': (rengD) => rengConv(rengBiseccion((rengTx) => (rengD.P1! * rengTx) / rengAK(rengD.t1!) - rengD.Pmax!, rengAK(rengD.t1!), 3000), 'K', '°C'),
  'n1-b8-s7-p1': (rengD) => rengRK4((rengN, rengV) => rengV / rengN, rengD.n1!, rengD.V1!, rengD.n2!),
  'n1-b8-s7-p2': (rengD) => rengRK4((rengN, rengV) => rengV / rengN, rengD.m1! / rengMg(rengD.g!), rengD.V1!, (rengD.m1! + rengD.madd!) / rengMg(rengD.g!)),
  'n1-b8-s7-p3': (rengD) => {
    const rengX = RENG_REACCIONES_GASEOSAS[rengD.r!]!
    const rengP = 101325
    const rengTk = 400
    const rengN = (rengP * rengConv(rengD.V!, 'L', 'm³')) / (RENG_NA * RENG_KB * rengTk)
    return rengConv(((rengN * rengX.nuA) / rengX.nuDe) * RENG_NA * RENG_KB * rengTk / rengP, 'm³', 'L')
  },
  'n1-b8-s8-p1': (rengD) => rengRK4((rengT, rengV) => rengV / rengT, rengAK(rengD.t1!), rengRK4((rengP, rengV) => -rengV / rengP, rengD.P1!, rengD.V1!, rengD.P2!), rengAK(rengD.t2!)),
  'n1-b8-s8-p2': (rengD) => rengRK4((rengT, rengP) => rengP / rengT, rengAK(rengD.t1!), rengRK4((rengV, rengP) => -rengP / rengV, rengD.V1!, rengD.P1!, rengD.V2!), rengAK(rengD.t2!)),
  'n1-b8-s8-p3': (rengD) => rengConv(rengBiseccion((rengTx) => (rengD.P2! * rengD.V2!) / rengTx - (rengD.P1! * rengD.V1!) / rengAK(rengD.t1!), 1, 5000), 'K', '°C'),
  'n1-b8-s9-p1': (rengD) => rengConv((rengD.n! * RENG_NA * RENG_KB * rengAK(rengD.t!)) / rengConv(rengD.V!, 'L', 'm³'), 'Pa', 'kPa'),
  'n1-b8-s9-p2': (rengD) => rengConv((rengConv(rengD.P!, 'mmHg', 'Pa') * rengConv(rengD.V!, 'mL', 'm³')) / (RENG_NA * RENG_KB * rengAK(rengD.t!)), 'mol', 'mmol'),
  'n1-b8-s9-p3': (rengD) => rengBiseccion((rengTx) => (rengD.n! * RENG_NA * RENG_KB * rengTx) / rengConv(rengD.V!, 'L', 'm³') - rengConv(rengD.P!, 'atm', 'Pa'), 1, 10000),
  'n1-b8-s10-p1': (rengD) => rengRhoSI(rengConv(rengD.P!, 'atm', 'Pa'), rengMg(rengD.g!), rengAK(rengD.t!)),
  'n1-b8-s10-p2': (rengD) => rengRhoSI(101325, rengMg(rengD.a!), 300) / rengRhoSI(101325, rengMg(rengD.b!), 300),
  'n1-b8-s10-p3': (rengD) => {
    const rengMkg = (rengD.rho1! * RENG_NA * RENG_KB * rengAK(rengD.t1!)) / rengConv(rengD.P1!, 'kPa', 'Pa')
    return (rengConv(rengD.P2!, 'kPa', 'Pa') * rengMkg) / (RENG_NA * RENG_KB * rengAK(rengD.t2!))
  },
  'n1-b8-s11-p1': (rengD) => (((rengD.m! / 1000 / rengConv(rengD.V!, 'mL', 'm³')) * RENG_KB * rengAK(rengD.t!)) / rengConv(rengD.P!, 'atm', 'Pa')) * RENG_NA * 1000,
  'n1-b8-s11-p2': (rengD) => ((rengD.rho! * RENG_KB * rengAK(rengD.t!)) / rengConv(rengD.P!, 'kPa', 'Pa')) * RENG_NA * 1000,
  'n1-b8-s11-p3': (rengD) => ((((rengD.m1! - rengD.m0!) / 1000 / rengConv(rengD.V!, 'mL', 'm³')) * RENG_KB * rengAK(rengD.t!)) / rengConv(rengD.P!, 'atm', 'Pa')) * RENG_NA * 1000,
  'n1-b8-s12-p1': (rengD) => {
    const rengV = ((rengD.nA! + rengD.nB!) * RENG_NA * RENG_KB * 300) / (rengD.P! * 1000)
    return (rengD.nA! * RENG_NA * RENG_KB * 300) / rengV / 1000
  },
  'n1-b8-s12-p2': (rengD) => {
    const rengNA = rengD.mA! / rengMg(rengD.a!)
    const rengNB = rengD.mB! / rengMg(rengD.b!)
    const rengV = ((rengNA + rengNB) * RENG_NA * RENG_KB * 300) / rengConv(rengD.P!, 'atm', 'Pa')
    return rengConv((rengNA * RENG_NA * RENG_KB * 300) / rengV, 'Pa', 'kPa')
  },
  'n1-b8-s12-p3': (rengD) => {
    const rengPtot = ((rengD.nA! + rengD.nB!) * RENG_NA * RENG_KB * rengAK(rengD.t!)) / rengConv(rengD.V!, 'L', 'm³')
    return rengConv((rengPtot * rengD.nA!) / (rengD.nA! + rengD.nB!), 'Pa', 'kPa')
  },
  'n1-b8-s13-p1': (rengD) => rengD.pA! + rengConv(rengD.pB!, 'mmHg', 'kPa') + rengConv(rengD.pC!, 'atm', 'kPa'),
  'n1-b8-s13-p2': (rengD) => rengConv(((rengConv(rengD.Patm!, 'mmHg', 'Pa') * rengConv(rengD.V!, 'mL', 'm³')) / (RENG_NA * RENG_KB * rengAK(rengD.t!))) * (1 - rengD.pw! / rengD.Patm!), 'mol', 'mmol'),
  'n1-b8-s13-p3': (rengD) => {
    const rengNA = (rengD.PA! * 1000 * (rengD.VA! / 1000)) / (RENG_NA * RENG_KB * 300)
    const rengNB = (rengD.PB! * 1000 * (rengD.VB! / 1000)) / (RENG_NA * RENG_KB * 300)
    return ((rengNA + rengNB) * RENG_NA * RENG_KB * 300) / ((rengD.VA! + rengD.VB!) / 1000) / 1000
  },
  'n1-b8-s14-p1': (rengD) => rengConv(((rengD.m! / rengMg(rengD.g!)) * RENG_NA * RENG_KB * 273.15) / 101325, 'm³', 'L'),
  'n1-b8-s14-p2': (rengD) => rengConv((RENG_NA * RENG_KB * rengAK(rengD.t!)) / rengConv(rengD.P!, 'kPa', 'Pa'), 'm³', 'L'),
  'n1-b8-s14-p3': (rengD) => (rengConv(rengD.P!, 'kPa', 'Pa') * rengConv(rengD.V!, 'mL', 'm³')) / (RENG_KB * rengAK(rengD.t!)),
  'n1-b8-s15-p1': (rengD) => (1.5 * RENG_KB * rengAK(rengD.t!) * RENG_NA) / 1000,
  'n1-b8-s15-p2': (rengD) => (1.5 * RENG_KB * rengAK(rengD.t2!)) / (1.5 * RENG_KB * rengAK(rengD.t1!)),
  'n1-b8-s15-p3': (rengD) => {
    const rengN = (rengD.P! * 1000 * rengConv(rengD.V!, 'L', 'm³')) / (RENG_NA * RENG_KB * 300)
    return 1.5 * rengN * RENG_NA * RENG_KB * 300
  },
  'n1-b8-s16-p1': (rengD) => rengURms(rengMg(rengD.g!), rengAK(rengD.t!)),
  'n1-b8-s16-p2': (rengD) => rengUMedia(rengMg(rengD.g!), rengAK(rengD.t!)),
  'n1-b8-s16-p3': (rengD) => rengBiseccion((rengTx) => rengURms(rengMg(rengD.g!), rengTx) - rengD.v!, 1, 100000),
  'n1-b8-s17-p1': (rengD) => rengUMedia(rengMg(rengD.a!), 300) / rengUMedia(rengMg(rengD.b!), 300),
  'n1-b8-s17-p2': (rengD) => rengEncuentro(rengD.L!, rengUMedia(rengMg(rengD.a!), 300), rengUMedia(rengMg(rengD.b!), 300)),
  'n1-b8-s17-p3': (rengD) => {
    const rengVa = rengD.d1! / rengD.tA!
    const rengVb = (rengVa * rengUMedia(rengMg(rengD.b!), 300)) / rengUMedia(rengMg(rengD.a!), 300)
    return rengD.d2! / rengVb
  },
  'n1-b8-s18-p1': (rengD) => (rengD.tA! * rengUMedia(rengMg(rengD.a!), 300)) / rengUMedia(rengMg(rengD.b!), 300),
  'n1-b8-s18-p2': (rengD) => (rengD.nA! * rengUMedia(rengMg(rengD.b!), 300)) / rengUMedia(rengMg(rengD.a!), 300),
  'n1-b8-s18-p3': (rengD) => {
    let rengX = rengD.x0!
    for (let rengI = 0; rengI < rengD.k!; rengI++) rengX *= rengUMedia(rengMg(rengD.a!), 300) / rengUMedia(rengMg(rengD.b!), 300)
    return rengX
  },
  'n1-b8-s19-p1': (rengD) => rengBiseccion((rengMx) => rengUMedia(rengMx, 300) / rengUMedia(rengMg(rengD.ref!), 300) - rengD.k!, 0.5, 5000),
  'n1-b8-s19-p2': (rengD) => rengBiseccion((rengMx) => rengUMedia(rengMg(rengD.ref!), 300) / rengUMedia(rengMx, 300) - rengD.tX! / rengD.tref!, 0.5, 5000),
  'n1-b8-s19-p3': (rengD) => {
    const rengMY = rengBiseccion((rengMy) => rengRhoSI(101325, rengMy, 300) / rengRhoSI(101325, RENG_M_O2, 300) - rengD.d!, 0.1, 5000)
    return rengBiseccion((rengMx) => rengURms(rengMx, 300) / rengURms(rengMY, 300) - rengD.k!, 0.1, 5000)
  },
  'n1-b8-s20-p1': (rengD) => (rengConv(rengD.P!, 'atm', 'Pa') * rengConv(rengD.V!, 'L', 'm³')) / (rengD.n! * RENG_NA * RENG_KB * rengAK(rengD.t!)),
  'n1-b8-s20-p2': (rengD) => rengVdWSI(rengD.n!, rengD.V!, rengD.T!, rengD.a!, rengD.b!),
  'n1-b8-s20-p3': (rengD) => {
    const rengPi = rengConv((rengD.n! * RENG_NA * RENG_KB * rengD.T!) / (rengD.V! / 1000), 'Pa', 'atm')
    const rengPv = rengVdWSI(rengD.n!, rengD.V!, rengD.T!, rengD.a!, rengD.b!)
    return ((rengPi - rengPv) / rengPv) * 100
  }
}

const rengGruposBloque = RENG_GRUPOS_PRACTICAS_N1.filter((rengG) => rengG.bloque === RENG_BLOQUE)

describe('Nivel 1 · bloque 8 · prácticas (60)', () => {
  it('hay 20 grupos de 3 prácticas y un segundo método para cada una, sin sobrantes', () => {
    expect(rengGruposBloque.map((rengG) => rengG.posicion)).toEqual(Array.from({ length: 20 }, (_, rengI) => rengI + 1))
    const rengIds = rengGruposBloque.flatMap((rengG) => rengG.practicas.map((rengP) => rengP.id))
    expect(rengIds).toHaveLength(60)
    expect(new Set(rengIds).size).toBe(60)
    expect(Object.keys(RENG_SEGUNDOS_B08).sort()).toEqual([...rengIds].sort())
  })
  for (const rengG of rengGruposBloque) {
    describe(rengG.subtema, () => {
      rengProbarGrupo(rengG.subtema, rengG.practicas)
      for (const rengP of rengG.practicas) rengProbarPractica(rengP, RENG_SEGUNDOS_B08[rengP.id])
    })
  }
})

describe('Nivel 1 · bloque 8 · lecciones por capas (20) y ejemplos', () => {
  const rengSubtemas = RENG_TEMARIO.niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!.subtemas

  it('una lección por subtema, en orden, con el título del temario', () => {
    expect(RENG_LECCIONES_GASES).toHaveLength(20)
    expect(RENG_LECCIONES_GASES.map((rengL) => rengL.subtema)).toEqual(rengSubtemas.map((rengS) => rengS.id))
    RENG_LECCIONES_GASES.forEach((rengL, rengI) => {
      expect(`${rengL.nombre}.`, rengL.id).toBe(rengSubtemas[rengI]!.titulo)
      expect(rengL.bloque).toBe(RENG_BLOQUE)
      expect(rengL.posicion).toBe(rengI + 1)
    })
  })

  it('ids únicos, con patrón, sin chocar con los temas y con ruta aprender-<id> dentro del límite del shell', () => {
    const rengIds = RENG_LECCIONES_GASES.map((rengL) => rengL.id)
    expect(new Set(rengIds).size).toBe(20)
    const rengTemas = new Set(RENG_TEMAS.map((rengT) => rengT.id))
    for (const rengId of rengIds) {
      expect(rengId).toMatch(RENG_PATRON_ID_LECCION_N1)
      expect(rengTemas.has(rengId), rengId).toBe(false)
      const rengSub = `aprender-${rengId}`
      expect(rengSub.length, rengId).toBeLessThanOrEqual(41)
      expect(rengResolverRuta(`#/simulador-quimica/${rengSub}`, () => true).ruta.sub).toBe(rengSub)
      expect(rengNavDeSubruta(RENG_NAV_INICIAL, rengSub)).toMatchObject({ destino: 'aprender', tema: rengId })
      expect(rengLeccionN1PorId(rengId)?.id).toBe(rengId)
    }
  })

  it('SABOTAJE: un id demasiado largo rompería la ruta en silencio y se detecta', () => {
    const rengLargo = `gas-${'x'.repeat(33)}`
    expect(RENG_PATRON_ID_LECCION_N1.test(rengLargo)).toBe(false)
    expect(rengResolverRuta(`#/simulador-quimica/aprender-${rengLargo}`, () => true).ruta.sub).toBeNull()
    expect(RENG_PATRON_ID_LECCION_N1.test('Gas_Mal')).toBe(false)
  })

  it('cada lección tiene sus capas completas, sin relleno vacío, y procedencia honesta', () => {
    for (const rengL of RENG_LECCIONES_GASES) {
      expect(rengL.pregunta.length, rengL.id).toBeGreaterThan(15)
      expect(rengL.objetivo.length, rengL.id).toBeGreaterThan(30)
      expect(rengL.comprender.idea.length, rengL.id).toBeGreaterThan(120)
      expect(rengL.comprender.imagen.length, rengL.id).toBeGreaterThan(30)
      expect(rengL.comprender.errorFrecuente.length, rengL.id).toBeGreaterThan(30)
      expect(rengL.formalizar.ecuaciones.length, rengL.id).toBeGreaterThanOrEqual(2)
      expect(rengL.formalizar.variables.length, rengL.id).toBeGreaterThanOrEqual(2)
      expect(rengL.formalizar.supuestos.length, rengL.id).toBeGreaterThanOrEqual(1)
      expect(rengL.formalizar.limites.length, rengL.id).toBeGreaterThan(30)
      const rengTextos = [rengL.pregunta, rengL.objetivo, rengL.comprender.idea, rengL.comprender.imagen, rengL.comprender.errorFrecuente, rengL.formalizar.limites, ...rengL.formalizar.supuestos, ...rengL.formalizar.ecuaciones.flatMap((rengE) => [rengE.nombre, rengE.texto, rengE.lectura])]
      for (const rengT of rengTextos) expect(rengTextoSinDefectos(rengT), rengL.id).toBe(true)
      const rengNiveles = rengL.procedencia.map((rengP) => rengP.nivel)
      expect(rengNiveles, rengL.id).toEqual(expect.arrayContaining(['parametro-didactico', 'ejemplo-idealizado', 'dato-calculado', 'sin-verificar']))
      expect(rengNiveles, rengL.id).not.toContain('fuente-verificada')
      expect(new Set(rengL.procedencia.map((rengP) => rengP.detalle)).size, rengL.id).toBe(rengL.procedencia.length)
    }
  })

  it('solo el subtema 12 tiene capa Explorar, y apunta a un recurso confirmado que el navegador abre', () => {
    const rengConExplorar = RENG_LECCIONES_GASES.filter((rengL) => rengL.explorar !== null)
    expect(rengConExplorar.map((rengL) => rengL.subtema)).toEqual(['n1-b8-s12'])
    const rengE = rengConExplorar[0]!.explorar!
    expect(rengE.modulo).toBe('simulador-quimica')
    expect(rengNavDeSubruta(RENG_NAV_INICIAL, rengE.sub).destino).toBe('casos')
    expect(rengE.limite).toMatch(/no calcula/i)
    const rengS12 = rengCatalogoReal().niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!.subtemas[11]!
    expect(rengS12.confirmados.some((rengR) => rengR.tipo === 'caso' && rengR.id === 'aire')).toBe(true)
  })

  it('cada ejemplo: solución analítica = segundo método independiente, con datos, pasos y pistas', () => {
    expect(RENG_EJEMPLOS_GASES).toHaveLength(20)
    expect(new Set(RENG_EJEMPLOS_GASES.map((rengE) => rengE.id)).size).toBe(20)
    for (const rengL of RENG_LECCIONES_GASES) {
      const rengE = rengEjemploN1PorId(rengL.ejemplo)
      expect(rengE, rengL.id).toBeDefined()
      const rengA = rengE!.analitico()
      const rengB = rengE!.segundo()
      expect(rengCercaRel(rengA, rengB), `${rengE!.id}: ${rengA} frente a ${rengB}`).toBe(true)
      expect(rengE!.datos.length, rengE!.id).toBeGreaterThanOrEqual(2)
      expect(rengE!.pasos(rengA).length, rengE!.id).toBeGreaterThanOrEqual(2)
      for (const rengP of rengE!.pasos(rengA)) expect(rengTextoSinDefectos(rengP), rengE!.id).toBe(true)
      for (const rengP of rengE!.pistas) expect(rengP.length, rengE!.id).toBeGreaterThan(10)
      expect(rengE!.metodoSegundo.length, rengE!.id).toBeGreaterThan(20)
    }
  })

  it('valores de referencia de los ejemplos, contrastados con funciones del núcleo escritas antes (tercer camino)', () => {
    const rengEj = (rengId: string): number => rengEjemploN1PorId(rengId)!.analitico()
    expect(rengCercaRel(rengEj('ej-gas-ideal'), rengGasIdeal({ n: 0.35, T: 303.15, V: 5 }).P / 1000)).toBe(true)
    expect(rengCercaRel(rengEj('ej-gas-densidad'), rengDensidadGas(101325, rengGasPorFormula('CO2').M, 298.15))).toBe(true)
    expect(rengCercaRel(RENG_R_LATM * 273.15, RENG_VM_CN)).toBe(true)
    expect(rengEj('ej-gas-boyle')).toBeCloseTo(3.125, 10)
    expect(rengEj('ej-gas-avogadro')).toBeCloseTo(3, 10)
    expect(rengEj('ej-gas-parciales')).toBeCloseTo(19.95, 10)
    expect(rengEj('ej-gas-volumen-molar')).toBeCloseTo(24.465, 2)
  })

  it('las masas molares de los gases salen de la tabla de la app (sin verificar) y son finitas', () => {
    expect(RENG_GASES_N1.length).toBeGreaterThanOrEqual(10)
    for (const rengG of RENG_GASES_N1) expect(Number.isFinite(rengG.M) && rengG.M > 1, rengG.formula).toBe(true)
  })
})

describe('Nivel 1 · bloque 8 · Paso 0 y cobertura del bloque', () => {
  const rengB8 = (): ReturnType<typeof rengCatalogoReal>['niveles'][number]['bloques'][number] => rengCatalogoReal().niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!

  it('Paso 0: las retiradas ya no están y las confirmadas sí, con motivo y fecha', () => {
    const rengCat = rengB8()
    for (const rengD of RENG_DECISIONES_PASO0_N1.filter((rengX) => rengX.subtema.startsWith('n1-b8-'))) {
      const rengS = rengCat.subtemas.find((rengX) => rengX.id === rengD.subtema)!
      const rengClaves = [...rengS.confirmados, ...rengS.porRevisar].map(rengClaveRecurso)
      expect(rengClaves.includes(rengClaveRecurso(rengD.recurso)), `${rengD.subtema} ${rengClaveRecurso(rengD.recurso)}`).toBe(rengD.decision === 'confirmada')
      expect(rengD.motivo.length).toBeGreaterThan(40)
      expect(rengD.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
    expect(rengCat.conteo.porRevisar).toBe(0)
  })

  it('el caso «El aire que respiras» muestra la composición que usa la lección del subtema 12 (valor fijado)', () => {
    const rengCaso = RENG_CASOS.find((rengC) => rengC.id === 'aire')!
    expect((rengCaso.datos ?? []).some((rengD) => /Oxígeno/.test(rengD.magnitud) && rengD.valor === '21 %')).toBe(true)
    expect(rengEjemploN1PorId('ej-gas-parciales')!.datos).toContainEqual(['x(O₂)', '0,21'])
  })

  it('los 20 subtemas tienen lección por capas y lista de prácticas confirmadas, y quedan en Parcial solo por falta de atestación', () => {
    const rengCat = rengB8()
    expect(rengCat.subtemas).toHaveLength(20)
    for (const rengS of rengCat.subtemas) {
      expect(rengS.correspondencia, rengS.id).toBe('confirmado')
      expect(rengS.confirmados.some((rengR) => rengR.tipo === 'leccion-n1')).toBe(true)
      expect(rengS.confirmados.some((rengR) => rengR.tipo === 'practica-n1' && rengR.id === rengS.id)).toBe(true)
      expect(rengS.evaluacion.estado, rengS.id).toBe('parcial')
      expect(rengS.evaluacion.faltanParaCompletado, rengS.id).toEqual(['Falta la atestación registrada de que la lección y la práctica tratan este subtema'])
      expect(rengS.evaluacion.capas).toEqual(expect.arrayContaining(['aprender', 'practica']))
    }
    expect(rengCat.conteo.porCapa).toMatchObject({ aprender: 20, practica: 20, simulacion: 12 })
    expect(rengCat.estado).toBe('parcial')
  })

  it('cada recurso N1 existe y sus acciones abren destinos reales del módulo', () => {
    for (const rengS of rengB8().subtemas) {
      for (const rengR of rengS.confirmados) {
        expect(rengRecursoExiste(rengR), rengClaveRecurso(rengR)).toBe(true)
        for (const rengA of rengAccionesDeRecurso(rengR)) {
          if (rengA.modulo !== 'simulador-quimica') continue
          expect(rengA.sub!.length).toBeLessThanOrEqual(41)
          expect(rengNavDeSubruta(RENG_NAV_INICIAL, rengA.sub)).not.toEqual(RENG_NAV_INICIAL)
        }
      }
    }
    expect(rengNavDeSubruta(RENG_NAV_INICIAL, 'practicas-n1-b8-s4')).toMatchObject({ destino: 'practicas', tema: 'n1-b8-s4' })
  })

  it('SABOTAJE: un vínculo roto a una lección o a una lista de prácticas inexistente se detecta y no da cobertura', () => {
    expect(rengRecursoExiste({ tipo: 'leccion-n1', id: 'gas-no-existe' })).toBe(false)
    expect(rengRecursoExiste({ tipo: 'practica-n1', id: 'n2-b13-s2' })).toBe(false)
    expect(rengAccionesDeRecurso({ tipo: 'leccion-n1', id: 'gas-no-existe' })).toEqual([])
    expect(rengEvaluarSubtema('n1-b8-s1', [{ tipo: 'leccion-n1', id: 'gas-no-existe' }]).estado).toBe('sin-contenido')
    const rengRoto = { ...RENG_CORRESPONDENCIAS, 8: [{ estado: 'confirmado' as const, posiciones: [1], recursos: [{ tipo: 'leccion-n1' as const, id: 'gas-no-existe' }] }] }
    expect(rengConstruirCatalogo(undefined, rengRoto).niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!.subtemas[0]!.evaluacion.estado).toBe('sin-contenido')
  })

  it('SABOTAJE: relajar el criterio de atestación haría Completado el bloque 8; con los criterios reales no lo es', () => {
    const rengRelajado = rengConstruirCatalogo(undefined, undefined, RENG_REGISTRO_COBERTURA, { ...RENG_CRITERIOS_COBERTURA, exigirAtestacion: false })
    expect(rengRelajado.niveles[0]!.bloques.find((rengB) => rengB.numero === RENG_BLOQUE)!.subtemas.every((rengS) => rengS.evaluacion.estado === 'completado')).toBe(true)
    expect(rengB8().subtemas.some((rengS) => rengS.evaluacion.estado === 'completado' || rengS.evaluacion.estado === 'verificado')).toBe(false)
  })

  it('una atestación de cobertura bien formada llevaría a Completado (nunca a Verificado); mal formada, no', () => {
    const rengS = rengB8().subtemas[3]!
    const rengReg = (rengTema: string, rengFamilia: string, rengRevisor = 'Revisión de prueba'): RengRegistroCobertura => ({ ...RENG_REGISTRO_COBERTURA, atestaciones: new Map([[rengS.id, { tema: rengTema, familia: rengFamilia, revisor: rengRevisor, fecha: '2026-11-18' }]]) })
    expect(rengEvaluarSubtema(rengS.id, rengS.confirmados, rengReg('gas-ley-boyle', 'n1-b8-s4')).estado).toBe('completado')
    expect(rengEvaluarSubtema(rengS.id, rengS.confirmados, rengReg('gas-ley-boyle', 'n1-b8-s5')).estado).toBe('parcial')
    expect(rengEvaluarSubtema(rengS.id, rengS.confirmados, rengReg('gas-ley-charles', 'n1-b8-s4')).estado).toBe('parcial')
    expect(rengEvaluarSubtema(rengS.id, rengS.confirmados, rengReg('gas-ley-boyle', 'n1-b8-s4', ' ')).estado).toBe('parcial')
    const rengContexto = { familiasDeTema: RENG_CONTEXTO_REAL.familiasDeTema, temaCompleto: RENG_CONTEXTO_REAL.temaCompleto }
    const rengBase = { subtema: rengS.id, tema: 'gas-ley-boyle', familia: 'n1-b8-s4', revisor: 'Revisión de prueba', fecha: '2026-11-18', motivo: 'Prueba: la lección y las tres prácticas tratan la ley de Boyle (no es una atestación real).' }
    expect(rengProblemasAtestaciones({ version: 1, atestaciones: [rengBase] }, RENG_TEMARIO, RENG_CORRESPONDENCIAS, rengContexto)).toEqual([])
    expect(rengProblemasAtestaciones({ version: 1, atestaciones: [{ ...rengBase, familia: 'n1-b8-s5' }] }, RENG_TEMARIO, RENG_CORRESPONDENCIAS, rengContexto).join('|')).toContain('no está entre los recursos confirmados')
  })

  it('el nivel de verificación de las lecciones y prácticas N1 es el más débil declarado y nunca comprobable', () => {
    for (const rengS of rengB8().subtemas) {
      for (const rengR of rengS.confirmados.filter((rengX) => rengX.tipo === 'leccion-n1' || rengX.tipo === 'practica-n1')) {
        const rengV = rengVerificacionDeRecurso(rengR)
        expect(rengV.nivel, rengClaveRecurso(rengR)).toBe('sin-verificar')
        expect(rengV.comprobable).toBe(false)
      }
    }
  })
})
