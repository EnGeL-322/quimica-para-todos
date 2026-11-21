import { afterEach, describe, expect, it, vi } from 'vitest'
import { rengProyectoNuevo, rengValidarProyecto, type RengCorrida } from '../../src/shared/cuaderno'
import { rengPedirReapertura, rengTomarReapertura } from '../../src/renderer/lib/cuaderno/reapertura'
import { rengAptitudComparacion, rengAvisosProcedencia, rengComparar, rengExtraerXY } from '../../src/renderer/lib/cuaderno/comparar'
import { rengAnalizarCSV } from '../../src/renderer/lib/cuaderno/csv'
import { RENG_VERSIONES_MODELOS, rengCompatibilidad } from '../../src/renderer/lib/cuaderno/modelos'
import { rengAnadirCorrida, rengAnadirMedicion, rengCrearCorrida, rengCrearMedicion } from '../../src/renderer/lib/cuaderno/proyecto'
import { rengCorridaValoracion } from '../../src/renderer/modules/simulador-quimica/corrida'
import { RENG_ACIDOS } from '../../src/renderer/modules/simulador-quimica/nucleo/acidoBase'
import { RENG_CODIGOS_V1, RENG_ID_MODELO_CORRIDA, rengCodificarEntradas, rengCorridaEscena, rengDecodificarEntradas, rengEntradasDeCorrida, rengTextoVersionModelo } from '../../src/renderer/modules/simulador-quimica/practica/corridaEscena'
import { RENG_ESCENAS, RENG_MODELOS_ESCENA, RENG_PRESETS_EQ, RENG_REACCIONES_TERMO, rengCalcularEscena, rengEntradasPorDefecto, type RengEscena } from '../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion'

const rengGuardada = (rengEscena: RengEscena, rengEntradas: Record<string, number | string>, rengId = 'corrida-0001'): RengCorrida => rengCrearCorrida(rengId, rengCorridaEscena(rengEscena, rengEntradas), { nombre: `prueba ${rengEscena}` }, new Date('2026-11-15T12:00:00Z'))

const rengAlmacenSesion = (): Record<string, string> => {
  const rengDatos: Record<string, string> = {}
  vi.stubGlobal('sessionStorage', { getItem: (rengK: string) => rengDatos[rengK] ?? null, setItem: (rengK: string, rengV: string) => void (rengDatos[rengK] = rengV), removeItem: (rengK: string) => void delete rengDatos[rengK] })
  return rengDatos
}

afterEach(() => vi.unstubAllGlobals())

describe('D2 · cada escena produce una corrida válida para el esquema del cuaderno', () => {
  for (const rengEscena of RENG_ESCENAS) {
    it(`${rengEscena}: pasa la validación del proyecto (la misma que hace el proceso principal) y sobrevive a JSON`, () => {
      const rengC = rengGuardada(rengEscena, rengEntradasPorDefecto(rengEscena))
      const rengP = rengAnadirCorrida(rengProyectoNuevo('proyecto-prueba-1', 'Prueba', new Date('2026-11-15T12:00:00Z')), rengC)
      const rengLeido = rengValidarProyecto(JSON.parse(JSON.stringify(rengP)))
      expect(rengLeido).toEqual(rengP)
      expect(rengLeido.corridas[0]!.modelo.id).toBe(RENG_ID_MODELO_CORRIDA[rengEscena])
      expect(rengLeido.corridas[0]!.modelo.version).toBe(RENG_MODELOS_ESCENA[rengEscena].version)
      expect(rengLeido.corridas[0]!.origen).toEqual({ modulo: 'simulador-quimica', sub: rengEscena, entradas: expect.any(Object) })
      expect(rengLeido.corridas[0]!.resultados.length).toBeGreaterThan(0)
      expect(rengLeido.corridas[0]!.fuentes.length).toBeGreaterThan(0)
      if (rengEscena === 'mezcla') expect(rengLeido.corridas[0]!.parametros.some((rengP) => rengP.clave === 'T' && rengP.unidad === '°C')).toBe(true)
      else expect(rengLeido.corridas[0]!.modelo.metodo).toMatch(/Condiciones:/)
    })

    it(`${rengEscena}: «Reabrir y repetir» reproduce exactamente entradas, resultados, serie y diagnósticos`, () => {
      const rengC = rengGuardada(rengEscena, rengEntradasPorDefecto(rengEscena))
      const { entradas: rengDec, avisos: rengAvisos } = rengEntradasDeCorrida(rengEscena, rengC.origen.entradas)
      expect(rengAvisos).toEqual([])
      const rengOtra = rengCorridaEscena(rengEscena, rengDec)
      expect(rengOtra.parametros).toEqual(rengC.parametros)
      expect(rengOtra.resultados).toEqual(rengC.resultados)
      expect(rengOtra.serie).toEqual(rengC.serie)
      expect(rengOtra.diagnosticos).toEqual(rengC.diagnosticos)
      expect(rengOtra.estado).toBe(rengC.estado)
      expect(rengOtra.origen.entradas).toEqual(rengC.origen.entradas)
    })

    it(`${rengEscena}: la versión registrada para reabrir coincide con la de la ficha`, () => {
      expect(RENG_VERSIONES_MODELOS[RENG_ID_MODELO_CORRIDA[rengEscena]]).toBe(RENG_MODELOS_ESCENA[rengEscena].version)
      expect(rengCompatibilidad(RENG_ID_MODELO_CORRIDA[rengEscena], RENG_MODELOS_ESCENA[rengEscena].version).tipo).toBe('actual')
    })
  }

  it('los códigos de lista guardados están congelados y coinciden con las listas vivas', () => {
    expect([...RENG_CODIGOS_V1.acido]).toEqual(RENG_ACIDOS.map((rengA) => rengA.id))
    expect([...RENG_CODIGOS_V1.reaccionEquilibrio]).toEqual(RENG_PRESETS_EQ.map((rengP) => rengP.id))
    expect([...RENG_CODIGOS_V1.reaccionTermo]).toEqual(RENG_REACCIONES_TERMO.map((rengR) => rengR.id))
  })

  it('una categoría desconocida al guardar es un error; al reabrir se ignora y se avisa', () => {
    expect(() => rengCodificarEntradas('termo', { reaccion: 'inexistente', T: 300 })).toThrow(RangeError)
    const rengR = rengEntradasDeCorrida('termo', { reaccion: 99, T: 300, mol: 1, masaAgua: 1000 })
    expect(rengR.entradas['reaccion']).toBe('metano')
    expect(rengR.avisos.some((rengA) => /Reacción/.test(rengA) && /valor por defecto/.test(rengA))).toBe(true)
    expect(rengDecodificarEntradas('termo', { reaccion: 3 })['reaccion']).toBe('etanol')
  })
})

describe('D2 · contenido de cada corrida frente a un cálculo independiente', () => {
  it('Ácidos y bases: la serie V–pH cruza pH = pKa en la semiequivalencia y guarda los balances', () => {
    const rengC = rengGuardada('acidobase', { acido: 'acetico', C: 0.01, Va: 25, Cb: 0.01, Vb: 12.5 })
    expect(rengC.estado).toBe('calculado')
    const rengConcentrada = rengGuardada('acidobase', { acido: 'acetico', C: 0.1, Va: 25, Cb: 0.1, Vb: 12.5 })
    expect(rengConcentrada.estado).toBe('aproximacion')
    expect(rengConcentrada.diagnosticos.join(' ')).toMatch(/Fuerza iónica estimada/)
    const rengXY = rengExtraerXY('a', rengC.serie, 'V_NaOH', 'pH')!
    expect(rengXY.x[0]).toBe(0)
    const rengPHsemi = rengXY.y[rengXY.x.findIndex((rengX) => Math.abs(rengX - 12.5) < 0.2)]!
    expect(rengPHsemi).toBeGreaterThan(4.6)
    expect(rengPHsemi).toBeLessThan(4.9)
    expect(rengC.resultados.find((rengR) => rengR.clave === 'resCarga')!.valor).toBeLessThan(1e-9)
    expect(rengC.parametros.find((rengP) => rengP.clave === 'acido')!.valor).toBe(1)
    expect(rengC.parametros.find((rengP) => rengP.clave === 'Tmodelo')).toEqual({ clave: 'Tmodelo', nombre: 'Temperatura del modelo (fija)', valor: 25, unidad: '°C' })
  })

  it('Cinética: la serie [A](t) pasa por [A]₀/2 en t½ (orden 1: ln 2/k) y guarda el instante en pausa', () => {
    const rengC = rengGuardada('cinetica', { orden: 1, A0: 2, k: 0.5, t: 1.5 })
    const rengXY = rengExtraerXY('c', rengC.serie, 't', 'A')!
    const rengTh = Math.LN2 / 0.5
    const rengAprox = rengXY.y[rengXY.x.findIndex((rengX) => rengX >= rengTh)]!
    expect(rengAprox).toBeLessThan(1.01)
    expect(rengAprox).toBeGreaterThan(0.85)
    expect(rengC.origen.entradas['t']).toBe(1.5)
    expect(rengC.resultados.find((rengR) => rengR.clave === 't12')!.valor).toBeCloseTo(rengTh, 12)
    expect(rengC.resultados.find((rengR) => rengR.clave === 'At')!.valor).toBeCloseTo(2 * Math.exp(-0.5 * 1.5), 12)
    expect(rengC.parametros.find((rengP) => rengP.clave === 'k')!.unidad).toBe('')
    expect(rengGuardada('cinetica', { orden: 2, A0: 1, k: 0.5 }).parametros.find((rengP) => rengP.clave === 'k')!.unidad).toBe('')
  })

  it('Cinética de orden 0 más allá del agotamiento: se guarda con aviso, [A] = 0 y sigue siendo comparable como aproximación', () => {
    const rengC = rengGuardada('cinetica', { orden: 0, A0: 1, k: 0.5, t: 3 })
    expect(rengC.estado).toBe('aproximacion')
    expect(rengC.diagnosticos.join(' ')).toMatch(/se agota en t = 2 s/)
    expect(rengC.resultados.find((rengR) => rengR.clave === 'At')!.valor).toBe(0)
    expect(rengAptitudComparacion(rengC).apta).toBe(true)
  })

  it('Equilibrio: guarda estado inicial, equilibrio y perturbación; Q = K con las concentraciones guardadas', () => {
    const rengC = rengGuardada('equilibrio', { reaccion: 'hi', K: 50, c0_0: 1, c0_1: 1, c0_2: 0, quien: 0, delta: 0.5 })
    expect(rengC.serie.columnas.map((rengX) => rengX.clave)).toEqual(['especie', 'c0', 'c_eq', 'c_pert'])
    const [rengA, rengB, rengH] = rengC.serie.filas.map((rengF) => rengF[2]!)
    expect((rengH! ** 2) / (rengA! * rengB!)).toBeCloseTo(50, 6)
    const rengPert = rengC.serie.filas.map((rengF) => rengF[3]!)
    expect((rengPert[2]! ** 2) / (rengPert[0]! * rengPert[1]!)).toBeCloseTo(50, 6)
    expect(rengC.origen.entradas).toMatchObject({ reaccion: 0, quien: 0, delta: 0.5, K: 50 })
    const rengDec = rengEntradasDeCorrida('equilibrio', rengC.origen.entradas).entradas
    expect(rengDec).toMatchObject({ reaccion: 'hi', quien: 0, delta: 0.5 })
  })

  it('Equilibrio: quitar más de lo que hay no rompe la corrida: se guarda el equilibrio y se explica', () => {
    const rengC = rengGuardada('equilibrio', { reaccion: 'hi', K: 50, c0_0: 1, c0_1: 1, c0_2: 0, quien: 0, delta: -5 })
    expect(rengC.estado).toBe('aproximacion')
    expect(rengC.serie.columnas.map((rengX) => rengX.clave)).toEqual(['especie', 'c0', 'c_eq'])
    expect(rengC.diagnosticos.join(' ')).toMatch(/quitar más sustancia de la que hay/)
  })

  it('Energía: la serie ΔG(T) cumple ΔG = ΔH − TΔS y la reacción sin S° queda sin serie y con estado «datos insuficientes»', () => {
    const rengC = rengGuardada('termo', { reaccion: 'agua', T: 298.15, mol: 1, masaAgua: 1000 })
    const rengDH = rengC.resultados.find((rengR) => rengR.clave === 'dH')!.valor
    const rengDS = rengC.resultados.find((rengR) => rengR.clave === 'dS')!.valor
    for (const [rengT, rengG] of rengC.serie.filas) expect(rengG).toBeCloseTo(rengDH - (rengT! * rengDS) / 1000, 9)
    expect(rengC.parametros.find((rengP) => rengP.clave === 'Tref')!.valor).toBe(298.15)
    const rengSin = rengGuardada('termo', { reaccion: 'etanol', T: 298.15, mol: 1, masaAgua: 1000 })
    expect(rengSin.estado).toBe('datos-insuficientes')
    expect(rengSin.serie.filas).toEqual([])
    expect(rengSin.diagnosticos.join(' ')).toMatch(/No hay S° para C₂H₅OH/)
    expect(rengSin.diagnosticos.join(' ')).toMatch(/No entra en el comparador/)
    const rengApt = rengAptitudComparacion(rengSin)
    expect(rengApt.apta).toBe(false)
  })

  it('Energía a 1 K: K fuera de rango no se guarda como número; el estado es aproximación', () => {
    const rengC = rengGuardada('termo', { reaccion: 'metano', T: 1, mol: 1, masaAgua: 1000 })
    expect(rengC.resultados.some((rengR) => rengR.clave === 'K')).toBe(false)
    expect(rengC.resultados.every((rengR) => Number.isFinite(rengR.valor))).toBe(true)
    expect(rengC.estado).toBe('aproximacion')
  })

  it('una entrada inválida guarda el diagnóstico y no inventa resultados', () => {
    const rengC = rengGuardada('mezcla', { acido: 'acetico', cAcido: 0.5, VAcido: 25, cBase: 0.01, VBase: 10 })
    expect(rengC.estado).toBe('entrada-invalida')
    expect(rengC.resultados).toEqual([])
    expect(rengC.serie.filas).toEqual([])
    expect(rengC.diagnosticos[0]).toMatch(/0,01 mol\/L/)
    expect(rengAptitudComparacion(rengC)).toEqual({ apta: false, motivo: 'no tiene serie con datos' })
  })

  it('fosfórico más allá de la primera equivalencia: «fuera del dominio», con su diagnóstico y fuera del comparador', () => {
    const rengC = rengGuardada('acidobase', { acido: 'fosforico1', C: 0.1, Va: 25, Cb: 0.1, Vb: 40 })
    expect(rengC.estado).toBe('fuera-de-dominio')
    expect(rengC.diagnosticos.join(' ')).toMatch(/primera equivalencia/)
    expect(rengC.diagnosticos.join(' ')).toMatch(/No entra en el comparador/)
    const rengApt = rengAptitudComparacion(rengC)
    expect(rengApt.apta).toBe(false)
    expect(!rengApt.apta && rengApt.motivo).toMatch(/fuera del dominio del modelo/)
  })
})

describe('D2 · compatibilidad con corridas antiguas y versiones del modelo', () => {
  it('una valoración guardada antes (acido 0/1) se reabre en Mezcla con el mismo ácido', () => {
    const rengAntigua = rengCorridaValoracion({ acido: 'hcl', concentracionAcido: 0.01, volumenAcidoMl: 25, concentracionBase: 0.01, volumenBaseMl: 10 })
    const rengDec = rengEntradasDeCorrida('mezcla', rengAntigua.origen.entradas)
    expect(rengDec.avisos).toEqual([])
    expect(rengDec.entradas).toMatchObject({ acido: 'hcl', cAcido: 0.01, VAcido: 25, cBase: 0.01, VBase: 10 })
    const rengNueva = rengCorridaEscena('mezcla', rengDec.entradas)
    expect(rengNueva.resultados).toEqual(rengAntigua.resultados)
    expect(rengNueva.serie).toEqual(rengAntigua.serie)
    expect(rengNueva.modelo.version).toBe(rengAntigua.modelo.version)
  })

  it('con otra versión se conservan los resultados históricos y se dice qué versión se usará al repetir', () => {
    expect(rengTextoVersionModelo('termo', '1')).toBeNull()
    const rengT = rengTextoVersionModelo('termo', '0')!
    expect(rengT).toMatch(/versión 0/)
    expect(rengT).toMatch(/usa la 1/)
    expect(rengT).toMatch(/resultados guardados no cambian/)
    expect(rengCompatibilidad('sim-termo', '0')).toEqual({ tipo: 'otra-version', actual: '1' })
    const rengGuardadaVieja = { ...rengGuardada('termo', rengEntradasPorDefecto('termo')), modelo: { ...rengGuardada('termo', rengEntradasPorDefecto('termo')).modelo, version: '0' } }
    expect(rengGuardadaVieja.resultados).toEqual(rengGuardada('termo', rengEntradasPorDefecto('termo')).resultados)
  })

  it('un campo obligatorio ausente se completa con el valor por defecto y se avisa', () => {
    const rengR = rengEntradasDeCorrida('cinetica', { orden: 1, A0: 1 })
    expect(rengR.entradas['k']).toBe(0.2)
    expect(rengR.avisos[0]).toMatch(/constante de velocidad k|Constante de velocidad k/i)
  })
})

describe('D2 · una repetición se enlaza con la original', () => {
  it('la corrida repetida guarda el identificador de la anterior y el historial se reconstruye', () => {
    const rengOriginal = rengGuardada('termo', rengEntradasPorDefecto('termo'), 'corrida-0001')
    const rengRepetida = rengCrearCorrida('corrida-0002', rengCorridaEscena('termo', { ...rengEntradasPorDefecto('termo'), T: 350 }), { nombre: 'repetición', anterior: rengOriginal.id })
    const rengP = rengAnadirCorrida(rengAnadirCorrida(rengProyectoNuevo('proyecto-prueba-1', 'P'), rengOriginal), rengRepetida)
    const rengLeido = rengValidarProyecto(JSON.parse(JSON.stringify(rengP)))
    expect(rengLeido.corridas[1]!.anterior).toBe('corrida-0001')
    expect(rengLeido.corridas[0]!.resultados).toEqual(rengOriginal.resultados)
  })
})

describe('D2 · la petición de reapertura solo la consume la escena a la que va dirigida', () => {
  it('otra escena no la consume; la correcta sí, una sola vez', () => {
    const rengDatos = rengAlmacenSesion()
    rengPedirReapertura({ proyecto: 'proyecto-prueba-1', corrida: 'corrida-0001', nombre: 'x', modulo: 'simulador-quimica', sub: 'cinetica', entradas: { orden: 1, A0: 1, k: 0.2, t: 2 }, version: '1' })
    expect(rengTomarReapertura('simulador-quimica', 'mezcla')).toBeNull()
    expect(rengTomarReapertura('simulador-quimica', 'acidobase')).toBeNull()
    expect(rengDatos['cuaderno.reabrir']).toBeDefined()
    const rengP = rengTomarReapertura('simulador-quimica', 'cinetica')
    expect(rengP).toMatchObject({ sub: 'cinetica', entradas: { orden: 1, A0: 1, k: 0.2, t: 2 }, version: '1' })
    expect(rengTomarReapertura('simulador-quimica', 'cinetica')).toBeNull()
    expect(rengDatos['cuaderno.reabrir']).toBeUndefined()
  })

  it('sin indicar escena conserva el comportamiento anterior', () => {
    rengAlmacenSesion()
    rengPedirReapertura({ proyecto: 'proyecto-prueba-1', corrida: 'corrida-0001', nombre: 'x', modulo: 'simulador-quimica', sub: 'mezcla', entradas: { acido: 1 }, version: '1' })
    expect(rengTomarReapertura('simulador-quimica')?.sub).toBe('mezcla')
  })
})

describe('D2 · comparación con mediciones CSV', () => {
  const rengOp = { separador: ',', decimal: '.' } as const
  const rengMedicion = (rengCsv: string, rengColumnas: Array<{ clave: string; nombre: string; unidad: string }>) => {
    const rengR = rengAnalizarCSV(rengCsv, rengOp)
    expect(rengR.error).toBeFalsy()
    return rengCrearMedicion('medicion-0001', { nombre: 'medición de prueba', serie: { columnas: rengColumnas, filas: rengR.filas }, procedencia: 'datos de prueba', sintetica: true, incertidumbre: '', archivo: 'm.csv', formato: { separador: ',', decimal: '.' }, transformaciones: [] })
  }
  const rengCorrida = rengGuardada('acidobase', { acido: 'acetico', C: 0.1, Va: 25, Cb: 0.1, Vb: 0 })
  const rengRef = rengExtraerXY('modelo', rengCorrida.serie, 'V_NaOH', 'pH')!

  it('magnitudes compatibles en otras unidades (L → mL): se convierte, se comparan solo los puntos dentro del intervalo y se dice cuántos quedan fuera', () => {
    const rengM = rengMedicion('V,pH\n0.005,4.15\n0.0125,4.78\n0.0250,8.6\n0.2,12.7\n', [{ clave: 'V', nombre: 'volumen de NaOH añadido', unidad: 'L' }, { clave: 'pH', nombre: 'pH', unidad: '' }])
    const rengC = rengComparar(rengRef, rengExtraerXY('medición', rengM.serie, 'V', 'pH')!)
    if (!rengC.ok) throw new Error(rengC.motivo)
    expect(rengC.conversiones).toEqual(['x de «medición»: L → mL'])
    expect(rengC.excluidos).toBe(1)
    expect(rengC.n).toBe(3)
    expect(rengC.intervalo[0]).toBeCloseTo(5, 9)
    expect(rengC.intervalo[1]).toBeCloseTo(rengRef.x[rengRef.x.length - 1]!, 9)
    expect(rengC.metodo).toMatch(/1 de los 4 puntos de «medición» quedan fuera del intervalo común y no se usaron: no se extrapola/)
    expect(rengC.puntos.every((rengP) => rengP.x <= rengRef.x[rengRef.x.length - 1]! && rengP.x >= rengRef.x[0]!)).toBe(true)
    expect(rengC.advertencias).toEqual([])
    const rengMan = Math.sqrt(rengC.puntos.reduce((rengS, rengP) => rengS + rengP.residuo ** 2, 0) / rengC.puntos.length)
    expect(rengC.rmse).toBeCloseTo(rengMan, 12)
  })

  it('una medición de otra magnitud (mol/L frente a pH) no se compara y se explica', () => {
    const rengM = rengMedicion('V,c\n5,0.001\n10,0.002\n', [{ clave: 'V', nombre: 'volumen', unidad: 'mL' }, { clave: 'c', nombre: 'concentración', unidad: 'mol/L' }])
    const rengC = rengComparar(rengRef, rengExtraerXY('medición', rengM.serie, 'V', 'c')!)
    expect(rengC.ok).toBe(false)
    expect(!rengC.ok && rengC.motivo).toMatch(/Las magnitudes no son comparables \(mol\/L frente a sin unidad\)/)
  })

  it('un eje incompatible (tiempo frente a volumen) tampoco se compara', () => {
    const rengM = rengMedicion('t,pH\n1,4\n2,5\n', [{ clave: 't', nombre: 'tiempo', unidad: 's' }, { clave: 'pH', nombre: 'pH', unidad: '' }])
    const rengC = rengComparar(rengRef, rengExtraerXY('medición', rengM.serie, 't', 'pH')!)
    expect(rengC.ok).toBe(false)
    expect(!rengC.ok && rengC.motivo).toMatch(/Las x no son comparables \(s frente a mL\)/)
  })

  it('sin solape no se extrapola: se rechaza con los dos intervalos', () => {
    const rengM = rengMedicion('V,pH\n500,12\n600,12.5\n', [{ clave: 'V', nombre: 'volumen', unidad: 'mL' }, { clave: 'pH', nombre: 'pH', unidad: '' }])
    const rengC = rengComparar(rengRef, rengExtraerXY('medición', rengM.serie, 'V', 'pH')!)
    expect(rengC.ok).toBe(false)
    expect(!rengC.ok && rengC.motivo).toMatch(/no se solapan/)
  })

  it('dos magnitudes adimensionales con nombres distintos generan una advertencia explícita', () => {
    const rengM = rengMedicion('V,f\n5,0.1\n10,0.2\n', [{ clave: 'V', nombre: 'volumen de NaOH añadido', unidad: 'mL' }, { clave: 'f', nombre: 'fracción ionizada', unidad: '' }])
    const rengC = rengComparar(rengRef, rengExtraerXY('medición', rengM.serie, 'V', 'f')!)
    if (!rengC.ok) throw new Error(rengC.motivo)
    expect(rengC.advertencias).toHaveLength(1)
    expect(rengC.advertencias[0]).toMatch(/adimensionales pero se llaman distinto/)
  })

  it('si la corrida se ajustó a esa misma medición, la comparación lo etiqueta como ajuste', () => {
    const rengM = rengMedicion('V,pH\n5,4.1\n10,4.5\n', [{ clave: 'V', nombre: 'volumen', unidad: 'mL' }, { clave: 'pH', nombre: 'pH', unidad: '' }])
    const rengAjustada = { ...rengCorrida, ajuste: { tipo: 'ajuste' as const, parametro: 'pKa', valor: 4.7, errorEstandar: 0.1, proyecto: 'proyecto-prueba-1', medicion: rengM.id, medicionNombre: rengM.nombre, sintetica: true, condiciones: [], cambios: [] } }
    const rengAvisos = rengAvisosProcedencia(rengAjustada, rengM)
    expect(rengAvisos).toHaveLength(1)
    expect(rengAvisos[0]).toMatch(/se ajustó a esta misma medición/)
    expect(rengAvisos[0]).toMatch(/no valida el modelo/)
    const rengP = rengAnadirMedicion(rengAnadirCorrida(rengProyectoNuevo('proyecto-prueba-1', 'P'), rengAjustada), rengM)
    expect(rengValidarProyecto(JSON.parse(JSON.stringify(rengP)))).toEqual(rengP)
  })
})
