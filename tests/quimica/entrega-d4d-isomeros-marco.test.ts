import { describe, expect, it } from 'vitest'
import { RENG_VERSIONES_MODELOS } from '../../src/renderer/lib/cuaderno/modelos'
import { RENG_MOLECULAS } from '../../src/renderer/modules/simulador-quimica/chemistry'
import { RENG_PAREJAS_ISO, rengCargarPareja } from '../../src/renderer/modules/simulador-quimica/datos/isomeros'
import { rengAlternarAtomo, rengDiferenciaAngular, rengEtiquetasSeleccion, rengMedirSeleccion, type RengGeometriaIsomero, type RengVec } from '../../src/renderer/modules/simulador-quimica/nucleo/isomeros'
import { RENG_CODIGOS_V1, RENG_ID_MODELO_CORRIDA, rengCodificarEntradas, rengCorridaEscena, rengDecodificarEntradas, rengEntradasDeCorrida } from '../../src/renderer/modules/simulador-quimica/practica/corridaEscena'
import { RENG_ESCENAS, RENG_MODELOS_ESCENA, rengCalcularEscena, rengCompararIsomerosEntradas, rengEntradasIsoPorDefecto, rengEntradasPorDefecto, rengLeerSeleccionIso, rengValidarEntradasSim } from '../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion'
import { rengDiagnosticosDominio, rengEntradasLegibles, rengResumenEscena } from '../../src/renderer/modules/simulador-quimica/practica/reglasEscena'

const RENG_TOL_VECTOR = 1e-9
const RENG_TOL_FF_GRADOS = 10

const rengGeom = (rengNombre: string, rengPos: RengVec[], rengEnlaces: Array<[number, number]>): RengGeometriaIsomero => ({
  nombre: rengNombre,
  smiles: 'X',
  formula: 'X',
  atomos: rengPos.map((rengP, rengI) => ({ el: 'C', etiqueta: `C${rengI + 1}`, p: rengP })),
  enlaces: rengEnlaces.map(([rengA, rengB]) => ({ a: rengA, b: rengB, orden: 1, aromatico: false })),
  procedencia: { origen: 'calculada', metodo: 'prueba', texto: 'prueba', detalle: 'prueba' }
})

describe('D4.4 · segunda vía independiente para las medidas de las geometrías reales', () => {
  const rengCruzV = (rengA: RengVec, rengB: RengVec): RengVec => [rengA[1] * rengB[2] - rengA[2] * rengB[1], rengA[2] * rengB[0] - rengA[0] * rengB[2], rengA[0] * rengB[1] - rengA[1] * rengB[0]]
  const rengPuntoV = (rengA: RengVec, rengB: RengVec): number => rengA[0] * rengB[0] + rengA[1] * rengB[1] + rengA[2] * rengB[2]
  const rengDiedroAlterno = (rengP: RengVec[]): number => {
    const rengV = (rengA: RengVec, rengB: RengVec): RengVec => [rengB[0] - rengA[0], rengB[1] - rengA[1], rengB[2] - rengA[2]]
    const rengB1 = rengV(rengP[0]!, rengP[1]!)
    const rengB2 = rengV(rengP[1]!, rengP[2]!)
    const rengB3 = rengV(rengP[2]!, rengP[3]!)
    const rengN1 = rengCruzV(rengB1, rengB2)
    const rengN2 = rengCruzV(rengB2, rengB3)
    const rengLong = Math.hypot(...rengB2)
    const rengM1 = rengCruzV(rengN1, [rengB2[0] / rengLong, rengB2[1] / rengLong, rengB2[2] / rengLong])
    return (Math.atan2(rengPuntoV(rengM1, rengN2), rengPuntoV(rengN1, rengN2)) * -180) / Math.PI
  }

  it('el diedro de la fórmula alterna (normales y vector m₁) coincide con el del módulo en todas las selecciones posibles de 4 átomos de los 4 pares', () => {
    for (const rengP of RENG_PAREJAS_ISO) {
      const rengC = rengCargarPareja(rengP.id)
      if (!rengC.ok) throw new Error(rengP.id)
      for (const rengG of [rengC.a, rengC.b]) {
        const rengPesados = rengG.atomos.map((_, rengI) => rengI)
        let rengContados = 0
        for (const rengA of rengPesados)
          for (const rengB of rengPesados)
            for (const rengCc of rengPesados)
              for (const rengD of rengPesados) {
                const rengSel = [rengA, rengB, rengCc, rengD]
                if (new Set(rengSel).size < 4) continue
                const rengDm = rengMedirSeleccion(rengG, rengSel).diedro
                if (rengDm === null) continue
                const rengDa = rengDiedroAlterno(rengSel.map((rengI) => rengG.atomos[rengI]!.p) as RengVec[])
                expect(Math.abs(rengDiferenciaAngular(rengDm, rengDa)), `${rengG.nombre} ${rengSel.join(',')}`).toBeLessThan(1e-7)
                rengContados++
              }
        expect(rengContados, rengG.nombre).toBeGreaterThan(0)
      }
    }
  })

  it('la distancia y el ángulo coinciden con Math.hypot y con la ley de los cosenos sobre las coordenadas del modelo', () => {
    const rengC = rengCargarPareja('etanol-eter')
    if (!rengC.ok) throw new Error('etanol-eter')
    for (const rengG of [rengC.a, rengC.b]) {
      const rengM = rengMedirSeleccion(rengG, [0, 1, 2])
      const [rengP0, rengP1, rengP2] = [0, 1, 2].map((rengI) => rengG.atomos[rengI]!.p) as [RengVec, RengVec, RengVec]
      const rengL01 = Math.hypot(rengP0[0] - rengP1[0], rengP0[1] - rengP1[1], rengP0[2] - rengP1[2])
      const rengL12 = Math.hypot(rengP1[0] - rengP2[0], rengP1[1] - rengP2[1], rengP1[2] - rengP2[2])
      const rengL02 = Math.hypot(rengP0[0] - rengP2[0], rengP0[1] - rengP2[1], rengP0[2] - rengP2[2])
      expect(Math.abs(rengM.distancia! - rengL02)).toBeLessThan(RENG_TOL_VECTOR)
      const rengCos = (rengL01 ** 2 + rengL12 ** 2 - rengL02 ** 2) / (2 * rengL01 * rengL12)
      expect(Math.abs(rengM.angulo1! - (Math.acos(rengCos) * 180) / Math.PI)).toBeLessThan(1e-7)
    }
  })

  it('ninguna fórmula de los pares coincide con las moléculas de geometría experimental de la app: todas las geometrías de los pares son calculadas', () => {
    const rengFormulasExp = RENG_MOLECULAS.map((rengM) => rengM.formula.replace(/[₀-₉]/g, (rengD) => String(rengD.charCodeAt(0) - 0x2080)))
    for (const rengP of RENG_PAREJAS_ISO) {
      expect(rengFormulasExp, rengP.formula).not.toContain(rengP.formula)
      const rengC = rengCargarPareja(rengP.id)
      if (!rengC.ok) throw new Error(rengP.id)
      expect(rengC.a.procedencia.origen).toBe('calculada')
      expect(rengC.b.procedencia.origen).toBe('calculada')
    }
  })
})

describe('D4.4 · selección de átomos (lógica pura)', () => {
  it('alternar añade al final, quita conservando el orden y no pasa de 4', () => {
    expect(rengAlternarAtomo([], 3)).toEqual({ seleccion: [3], aviso: null })
    expect(rengAlternarAtomo([3, 1], 0).seleccion).toEqual([3, 1, 0])
    expect(rengAlternarAtomo([3, 1, 0], 1).seleccion).toEqual([3, 0])
    const rengLlena = rengAlternarAtomo([0, 1, 2, 3], 7)
    expect(rengLlena.seleccion).toEqual([0, 1, 2, 3])
    expect(rengLlena.aviso).toMatch(/Ya hay 4 átomos/)
    expect(rengAlternarAtomo([0, 1, 2, 3], 2).seleccion).toEqual([0, 1, 3])
  })

  it('las etiquetas siguen el orden de selección', () => {
    const rengG = rengGeom('x', [[0, 0, 0], [1, 0, 0], [2, 0, 0]], [[0, 1], [1, 2]])
    expect(rengEtiquetasSeleccion(rengG, [2, 0])).toEqual(['C3', 'C1'])
    expect(rengEtiquetasSeleccion(rengG, [9])).toEqual(['#9'])
  })
})

describe('D4.4 · la escena en el marco: validación, cálculo, diagnósticos y Cuaderno', () => {
  it('está registrada con ficha completa y versión coincidente con la del Cuaderno', () => {
    expect(RENG_ESCENAS).toContain('isomeros')
    const rengM = RENG_MODELOS_ESCENA.isomeros
    expect(rengM.version).toBe('1')
    expect(rengM.evidencia).toBe('modelo-calculado')
    expect(RENG_VERSIONES_MODELOS[RENG_ID_MODELO_CORRIDA.isomeros]).toBe(rengM.version)
    expect(RENG_ID_MODELO_CORRIDA.isomeros).toBe('sim-isomeros')
    expect(rengM.campos.map((rengC) => rengC.clave)).toEqual(['pareja', 'atA1', 'atA2', 'atA3', 'atA4', 'atB1', 'atB2', 'atB3', 'atB4'])
    expect(rengM.parametros.some((rengP) => /Ninguna geometría de este catálogo es experimental/.test(rengP.fuente))).toBe(true)
  })

  it('la lista de pares v1 del Cuaderno queda congelada: no se puede reordenar sin romper corridas guardadas', () => {
    expect([...RENG_CODIGOS_V1.pareja]).toEqual(['buteno', 'etanol-eter', 'butano', 'propanol'])
  })

  it('las entradas por defecto de cada par validan y calculan', () => {
    for (const rengP of RENG_PAREJAS_ISO) {
      const rengE = rengEntradasIsoPorDefecto(rengP.id)
      expect(rengValidarEntradasSim('isomeros', rengE).ok, rengP.id).toBe(true)
      const rengR = rengCalcularEscena('isomeros', rengE)
      expect(rengR['nA']).toBe(rengP.seleccionInicial.a.length)
      expect(rengR['dA']).toBeGreaterThan(0)
      expect(rengR['dB']).toBeGreaterThan(0)
    }
  })

  it('cálculo: cis/trans con la segunda vía de las coordenadas', () => {
    const rengE = rengEntradasIsoPorDefecto('buteno')
    const rengR = rengCalcularEscena('isomeros', rengE)
    const rengC = rengCompararIsomerosEntradas(rengE)
    const rengDistManual = (rengG: RengGeometriaIsomero): number => {
      const [rengP, rengQ] = [rengG.atomos[0]!.p, rengG.atomos[3]!.p]
      return Math.hypot(rengP[0] - rengQ[0], rengP[1] - rengQ[1], rengP[2] - rengQ[2])
    }
    expect(Math.abs(rengR['dA']! - rengDistManual(rengC.a))).toBeLessThan(RENG_TOL_VECTOR)
    expect(Math.abs(rengR['dB']! - rengDistManual(rengC.b))).toBeLessThan(RENG_TOL_VECTOR)
    expect(rengR['mayor']).toBe(1)
    expect(Math.abs(Math.abs(rengR['ddie']!) - 180)).toBeLessThan(RENG_TOL_FF_GRADOS)
  })

  it('validación: par desconocido, huecos en la selección, repetidos, fuera de rango, no enteros y datos que faltan', () => {
    const rengBase = rengEntradasIsoPorDefecto('buteno')
    const rengFalla = (rengCambio: Record<string, number | string>, rengQuitar: string[] = []): string => {
      const rengE: Record<string, number | string> = { ...rengBase, ...rengCambio }
      for (const rengK of rengQuitar) delete rengE[rengK]
      const rengV = rengValidarEntradasSim('isomeros', rengE)
      expect(rengV.ok).toBe(false)
      return rengV.ok ? '' : rengV.diagnostico
    }
    expect(rengFalla({ pareja: 'agua-hielo' })).toMatch(/no está en el catálogo/)
    expect(rengFalla({}, ['atA2'])).toMatch(/en orden, sin saltarte ninguno/)
    expect(rengFalla({ atA2: 0 })).toMatch(/elegido dos veces/)
    expect(rengFalla({ atA1: 99 })).toMatch(/supera el dominio/)
    expect(rengFalla({ atA1: -1 })).toMatch(/por debajo del dominio/)
    expect(rengFalla({ atA1: 40 })).toMatch(/no existe/)
    expect(rengFalla({ atA1: 1.5 })).toMatch(/entero/)
    expect(rengFalla({}, ['pareja'])).toMatch(/Faltan datos/)
  })

  it('sin átomos o con uno solo: la validación pasa pero no se mide nada (datos insuficientes)', () => {
    const rengE: Record<string, number | string> = { pareja: 'buteno' }
    expect(rengValidarEntradasSim('isomeros', rengE).ok).toBe(true)
    expect(rengCalcularEscena('isomeros', rengE)).toEqual({ nA: 0, nB: 0 })
    expect(rengCalcularEscena('isomeros', { pareja: 'buteno', atA1: 0, atB1: 0, atB2: 1 })).toEqual({ nA: 1, nB: 2 })
    expect(rengDiagnosticosDominio('isomeros', rengE).map((rengD) => rengD.codigo)).toContain('iso-seleccion-insuficiente')
  })

  it('los códigos de diagnóstico llevan el prefijo iso- (salvo el genérico «entrada») y no chocan con los de otras escenas', () => {
    const rengCasos: Array<Record<string, number | string>> = [
      rengEntradasIsoPorDefecto('buteno'),
      rengEntradasIsoPorDefecto('etanol-eter'),
      { pareja: 'butano', atA1: 0, atA2: 1, atA3: 2, atA4: 3, atB1: 0, atB2: 1, atB3: 2, atB4: 3 },
      { pareja: 'propanol' },
      { pareja: 'buteno', atA1: 0, atA2: 1, atA3: 2, atB1: 0, atB2: 1, atB3: 2, atB4: 3 },
      { pareja: 'inexistente' }
    ]
    const rengIso = new Set<string>()
    for (const rengE of rengCasos) for (const rengD of rengDiagnosticosDominio('isomeros', rengE)) rengIso.add(rengD.codigo)
    expect([...rengIso].filter((rengC) => !rengC.startsWith('iso-')).sort()).toEqual(['entrada'])
    const rengOtros = new Set<string>()
    for (const rengEscena of RENG_ESCENAS.filter((rengX) => rengX !== 'isomeros')) for (const rengD of rengDiagnosticosDominio(rengEscena, rengEntradasPorDefecto(rengEscena))) rengOtros.add(rengD.codigo)
    expect([...rengIso].filter((rengC) => rengC.startsWith('iso-') && rengOtros.has(rengC))).toEqual([])
    expect([...rengOtros].filter((rengC) => rengC.startsWith('iso-'))).toEqual([])
  })

  it('el resumen y las entradas legibles nombran los átomos por su etiqueta', () => {
    const rengE = rengEntradasIsoPorDefecto('etanol-eter')
    expect(rengEntradasLegibles('isomeros', rengE)).toEqual(['pareja: Etanol y éter dimetílico', 'átomos de A (etanol): C1, C2, O1', 'átomos de B (éter dimetílico (metoximetano)): C1, O1, C2'])
    const rengS = rengResumenEscena('isomeros', rengE)
    expect(rengS.ok).toBe(true)
    expect(rengS.resultados.map((rengR) => rengR.clave)).toEqual(expect.arrayContaining(['dA', 'dB', 'angA', 'angB', 'ddist', 'dang', 'mayor']))
    expect(rengS.resultados.find((rengR) => rengR.clave === 'dA')!.unidad).toBe('Å')
  })

  it('corrida: parámetros como índices, sin serie, con procedencia y sin coordenadas', () => {
    const rengD = rengCorridaEscena('isomeros', rengEntradasIsoPorDefecto('buteno'))
    expect(rengD.modelo.id).toBe('sim-isomeros')
    expect(rengD.estado).toBe('calculado')
    expect(rengD.serie.filas).toEqual([])
    expect(rengD.parametros.map((rengP) => `${rengP.clave}=${rengP.valor}`)).toEqual(['pareja=0', 'atA1=0', 'atA2=1', 'atA3=2', 'atA4=3', 'atB1=0', 'atB2=1', 'atB3=2', 'atB4=3'])
    expect(rengD.origen.entradas).toEqual({ pareja: 0, atA1: 0, atA2: 1, atA3: 2, atA4: 3, atB1: 0, atB2: 1, atB3: 2, atB4: 3 })
    expect(rengD.muestreo).toMatch(/Sin serie/)
    expect(rengD.muestreo).toMatch(/0 = C1, 1 = C2, 2 = C3, 3 = C4/)
    expect(rengD.muestreo).toMatch(/calculada, MMFF94s/)
    expect(rengD.muestreo).toMatch(/Las coordenadas no se guardan/)
    expect(rengD.fuentes.join(' ')).toMatch(/openchemlib/)
    expect(rengD.resultados.find((rengR) => rengR.clave === 'mayor')!.valor).toBe(1)
    const rengCoordenadas = JSON.stringify(rengD).match(/-?\d+\.\d{5,}/g) ?? []
    for (const rengX of rengCoordenadas) expect(Math.abs(Number(rengX)), `valor con muchos decimales: ${rengX}`).not.toBeNaN()
    expect(rengD.parametros.every((rengP) => Number.isInteger(rengP.valor))).toBe(true)
  })

  it('estados: 4 átomos en butano → aproximación; selección insuficiente → datos insuficientes; entrada inválida → entrada inválida', () => {
    const rengBut = rengCorridaEscena('isomeros', { pareja: 'butano', atA1: 0, atA2: 1, atA3: 2, atA4: 3, atB1: 0, atB2: 1, atB3: 2, atB4: 3 })
    expect(rengBut.estado).toBe('aproximacion')
    expect(rengBut.diagnosticos.join(' ')).toMatch(/puede girar/)
    expect(rengCorridaEscena('isomeros', { pareja: 'buteno', atA1: 0, atB1: 0, atB2: 1 }).estado).toBe('datos-insuficientes')
    const rengMal = rengCorridaEscena('isomeros', { pareja: 'nada' })
    expect(rengMal.estado).toBe('entrada-invalida')
    expect(rengMal.parametros).toEqual([])
  })

  it('ida y vuelta: codificar y decodificar devuelve lo mismo; una pareja desconocida al reabrir se avisa y usa la de por defecto', () => {
    for (const rengP of RENG_PAREJAS_ISO) {
      const rengE = rengEntradasIsoPorDefecto(rengP.id)
      const rengCod = rengCodificarEntradas('isomeros', rengE)
      expect(rengCod['pareja']).toBe(RENG_CODIGOS_V1.pareja.indexOf(rengP.id))
      expect(rengDecodificarEntradas('isomeros', rengCod)).toEqual(rengE)
      expect(rengEntradasDeCorrida('isomeros', rengCod).entradas).toEqual(rengE)
    }
    const rengRaro = rengEntradasDeCorrida('isomeros', { pareja: 99, atA1: 0, atA2: 1 })
    expect(rengRaro.entradas['pareja']).toBe('buteno')
    expect(rengRaro.avisos.join(' ')).toMatch(/Pareja de isómeros/)
  })

  it('una selección parcial reabierta no recupera los átomos por defecto', () => {
    const rengE = { pareja: 'etanol-eter', atA1: 0, atA2: 2, atB1: 0, atB2: 2 }
    const rengCod = rengCodificarEntradas('isomeros', rengE)
    expect(rengEntradasDeCorrida('isomeros', rengCod).entradas).toEqual(rengE)
    expect(rengLeerSeleccionIso(rengEntradasDeCorrida('isomeros', rengCod).entradas)).toEqual({ a: [0, 2], b: [0, 2] })
  })
})
