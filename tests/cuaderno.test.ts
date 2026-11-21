import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { rengGuardarProyecto, rengImportarProyecto, rengLeerProyecto, rengListarProyectos } from '../src/main/modules/laboratorio/almacen'
import { rengComparar, rengExtraerXY, rengInterpolar } from '../src/renderer/lib/cuaderno/comparar'
import { rengAnalizarCSV, rengCsvDeSerie } from '../src/renderer/lib/cuaderno/csv'
import { rengCompatibilidad, RENG_VERSIONES_MODELOS } from '../src/renderer/lib/cuaderno/modelos'
import { rengAnadirCorrida, rengAnadirMedicion, rengCrearCorrida, rengCrearMedicion, rengEditarEntrada, rengHistorialDe, rengQuitarEntrada, rengRenombrarProyecto } from '../src/renderer/lib/cuaderno/proyecto'
import { rengCorridaValoracion, RENG_MODELO_VALORACION } from '../src/renderer/modules/simulador-quimica/corrida'
import { RENG_ID_MODELO_CORRIDA } from '../src/renderer/modules/simulador-quimica/practica/corridaEscena'
import { RENG_ESCENAS, RENG_MODELOS_ESCENA } from '../src/renderer/modules/simulador-quimica/practica/modelosSimulacion'
import { RENG_LIMITES_CUADERNO, rengProyectoNuevo, rengValidarProyecto, type RengProyecto } from '../src/shared/cuaderno'

const RENG_ID = (rengN: number): string => `0000000${rengN}-aaaa-4bbb-8ccc-${String(rengN).padStart(12, '0')}`
const RENG_AHORA = new Date('2026-11-09T12:00:00Z')

function rengProyectoDePrueba(): RengProyecto {
  let rengP = rengProyectoNuevo(RENG_ID(1), 'Valoraciones', RENG_AHORA)
  const rengC1 = rengCrearCorrida(RENG_ID(2), rengCorridaValoracion({ acido: 'acetico', concentracionAcido: 0.01, volumenAcidoMl: 25, concentracionBase: 0.01, volumenBaseMl: 25 }), { nombre: 'Acético', objetivo: 'ver la curva' }, RENG_AHORA)
  const rengC2 = rengCrearCorrida(RENG_ID(3), rengCorridaValoracion({ acido: 'hcl', concentracionAcido: 0.01, volumenAcidoMl: 25, concentracionBase: 0.01, volumenBaseMl: 25 }), { nombre: 'Clorhídrico', anterior: rengC1.id }, RENG_AHORA)
  rengP = rengAnadirCorrida(rengAnadirCorrida(rengP, rengC1), rengC2)
  return rengP
}

const rengDirs: string[] = []
const rengCarpeta = (): string => {
  const rengD = mkdtempSync(join(tmpdir(), 'csl-cuaderno-'))
  rengDirs.push(rengD)
  return rengD
}
afterAll(() => {
  for (const rengD of rengDirs) rmSync(rengD, { recursive: true, force: true })
})

describe('contrato del proyecto', () => {
  it('un proyecto con corridas de los pilotos es válido y sobrevive a JSON', () => {
    const rengP = rengProyectoDePrueba()
    expect(rengValidarProyecto(JSON.parse(JSON.stringify(rengP)))).toEqual(rengP)
  })
  it('las corridas del piloto de química cumplen el contrato', () => {
    for (const rengD of [rengCorridaValoracion({ acido: 'acetico', concentracionAcido: 0.01, volumenAcidoMl: 25, concentracionBase: 0.01, volumenBaseMl: 25 }), rengCorridaValoracion({ acido: 'hcl', concentracionAcido: 0.005, volumenAcidoMl: 20, concentracionBase: 0.01, volumenBaseMl: 5 })]) {
      const rengP = rengAnadirCorrida(rengProyectoNuevo(RENG_ID(1), 'x', RENG_AHORA), rengCrearCorrida(RENG_ID(9), rengD, { nombre: rengD.modelo.nombre }, RENG_AHORA))
      expect(() => rengValidarProyecto(JSON.parse(JSON.stringify(rengP))), rengD.modelo.id).not.toThrow()
    }
  })
  it('descarta campos desconocidos y rechaza lo que no cumple, con mensaje', () => {
    const rengP = { ...rengProyectoDePrueba(), extra: 'x' } as unknown
    expect(rengValidarProyecto(rengP)).not.toHaveProperty('extra')
    const rengMal = (rengCambio: (rengP: RengProyecto) => unknown, rengRe: RegExp): void => {
      const rengX = rengCambio(structuredClone(rengProyectoDePrueba()))
      expect(() => rengValidarProyecto(rengX)).toThrow(rengRe)
    }
    rengMal((rengP) => ({ ...rengP, esquema: 'otro' }), /no es un proyecto del cuaderno/)
    rengMal((rengP) => ({ ...rengP, version: 2 }), /versión 2.*Actualiza la app/)
    rengMal((rengP) => ({ ...rengP, id: '../../../etc/passwd' }), /identificador válido/)
    rengMal((rengP) => ({ ...rengP, corridas: [rengP.corridas[0], rengP.corridas[0]] }), /identificadores repetidos/)
    rengMal((rengP) => {
      rengP.corridas[0]!.serie.filas[0]![1] = Number.NaN
      return rengP
    }, /número finito/)
    rengMal((rengP) => {
      rengP.corridas[0]!.serie.filas[0]!.pop()
      return rengP
    }, /debe tener 2 valores/)
    rengMal((rengP) => {
      rengP.corridas[0]!.origen.modulo = 'Mal Módulo'
      return rengP
    }, /módulo válido/)
    rengMal((rengP) => {
      ;(rengP.corridas[0] as { estado: string }).estado = 'perfecto'
      return rengP
    }, /estado/)
  })
  it('tope de celdas por proyecto', () => {
    const rengP = rengProyectoNuevo(RENG_ID(1), 'grande', RENG_AHORA)
    const rengFilas = Array.from({ length: RENG_LIMITES_CUADERNO.filas }, (_, rengI) => Array.from({ length: 32 }, () => rengI))
    const rengColumnas = Array.from({ length: 32 }, (_, rengI) => ({ clave: `c${rengI}`, nombre: `c${rengI}`, unidad: '' }))
    const rengM = (rengN: number) => rengCrearMedicion(RENG_ID(10 + rengN), { nombre: 'm', serie: { columnas: rengColumnas, filas: rengFilas }, procedencia: 'prueba', sintetica: true, incertidumbre: '', archivo: 'a.csv', formato: { separador: ';', decimal: '.' }, transformaciones: [] }, RENG_AHORA)
    const rengGrande = rengAnadirMedicion(rengAnadirMedicion(rengP, rengM(1)), rengM(2))
    expect(() => rengValidarProyecto(rengGrande)).toThrow(/celdas por proyecto/)
  })
})

describe('almacén local (proceso principal)', () => {
  it('guarda de forma atómica, relee y lista; actualiza «modificado»', async () => {
    const rengDir = rengCarpeta()
    const rengG = await rengGuardarProyecto(rengDir, rengProyectoDePrueba(), new Date('2026-11-10T00:00:00Z'))
    expect(rengG.modificado).toBe('2026-11-10T00:00:00.000Z')
    expect(readdirSync(rengDir)).toEqual([`${RENG_ID(1)}.json`])
    expect(await rengLeerProyecto(rengDir, RENG_ID(1))).toEqual(rengG)
    const rengL = await rengListarProyectos(rengDir)
    expect(rengL.proyectos).toEqual([{ id: RENG_ID(1), nombre: 'Valoraciones', modificado: rengG.modificado, corridas: 2, mediciones: 0 }])
    expect(rengL.problemas).toEqual([])
    await rengGuardarProyecto(rengDir, rengRenombrarProyecto(rengG, 'Valoraciones 2'))
    expect(readdirSync(rengDir)).toEqual([`${RENG_ID(1)}.json`])
    expect((await rengLeerProyecto(rengDir, RENG_ID(1))).nombre).toBe('Valoraciones 2')
  })
  it('lista vacía sin carpeta; archivo dañado se informa sin romper la lista; id inexistente', async () => {
    const rengDir = rengCarpeta()
    expect(await rengListarProyectos(join(rengDir, 'no-existe'))).toEqual({ proyectos: [], problemas: [] })
    await rengGuardarProyecto(rengDir, rengProyectoDePrueba())
    writeFileSync(join(rengDir, `${RENG_ID(5)}.json`), '{roto')
    const rengL = await rengListarProyectos(rengDir)
    expect(rengL.proyectos).toHaveLength(1)
    expect(rengL.problemas[0]).toMatch(/dañado/)
    await expect(rengLeerProyecto(rengDir, RENG_ID(7))).rejects.toMatchObject({ code: 'NOT_FOUND' })
    await expect(rengLeerProyecto(rengDir, '../x')).rejects.toThrow(/no válido/)
  })
  it('importar: valida, y si el id ya existe guarda una copia con otro id (nunca sobrescribe)', async () => {
    const rengDir = rengCarpeta()
    const rengOriginal = await rengGuardarProyecto(rengDir, rengProyectoDePrueba())
    const rengCopia = await rengImportarProyecto(rengDir, JSON.stringify(rengProyectoDePrueba()), RENG_ID(8))
    expect(rengCopia.id).toBe(RENG_ID(8))
    expect(rengCopia.nombre).toBe('Valoraciones (importado)')
    expect(await rengLeerProyecto(rengDir, RENG_ID(1))).toEqual(rengOriginal)
    await expect(rengImportarProyecto(rengDir, '{no json', RENG_ID(9))).rejects.toThrow(/no es JSON válido/)
    await expect(rengImportarProyecto(rengDir, JSON.stringify({ ...rengProyectoDePrueba(), version: 3 }), RENG_ID(9))).rejects.toMatchObject({ code: 'VERSION' })
  })
})

describe('operaciones sobre el proyecto', () => {
  it('repeticiones enlazadas, notas, quitar y topes', () => {
    let rengP = rengProyectoDePrueba()
    expect(rengHistorialDe(rengP, RENG_ID(3)).map((rengC) => rengC.nombre)).toEqual(['Acético', 'Clorhídrico'])
    rengP = rengEditarEntrada(rengP, RENG_ID(3), { notas: 'ácido fuerte', nombre: 'HCl' })
    expect(rengP.corridas[1]).toMatchObject({ nombre: 'HCl', notas: 'ácido fuerte' })
    rengP = rengQuitarEntrada(rengP, RENG_ID(2))
    expect(rengHistorialDe(rengP, RENG_ID(3)).map((rengC) => rengC.nombre)).toEqual(['HCl'])
    const rengLleno = { ...rengP, corridas: Array.from({ length: RENG_LIMITES_CUADERNO.corridas }, () => rengP.corridas[0]!) }
    expect(() => rengAnadirCorrida(rengLleno, rengP.corridas[0]!)).toThrow(/máximo/)
  })
})

describe('lector CSV', () => {
  const rengOp = { separador: 'auto', decimal: 'auto' } as const
  it('punto y coma con coma decimal, unidades entre paréntesis o corchetes, BOM y comentarios', () => {
    const rengR = rengAnalizarCSV('﻿# medido con regla\nt (s);h [cm]\n0;30,0\n10;24,5\n20;19,6\n', rengOp)
    expect(rengR.error).toBeNull()
    expect([rengR.separador, rengR.decimal]).toEqual([';', ','])
    expect(rengR.columnas).toEqual([{ clave: 't', nombre: 't', unidad: 's' }, { clave: 'h', nombre: 'h', unidad: 'cm' }])
    expect(rengR.filas).toEqual([[0, 30], [10, 24.5], [20, 19.6]])
    expect(rengR.comentarios).toEqual(['medido con regla'])
  })
  it('«1,2,3» como CSV con coma separadora; coma separadora y decimal a la vez es un error', () => {
    expect(rengAnalizarCSV('a,b,c\n1,2,3\n', rengOp).filas).toEqual([[1, 2, 3]])
    expect(rengAnalizarCSV('a,b,c\n1,2,3\n', { separador: ',', decimal: ',' }).error).toMatch(/no pueden ir separadas por comas/)
  })
  it('errores por fila (cantidad de valores, «dos»), faltantes y NaN, sin encabezado', () => {
    const rengR = rengAnalizarCSV('x (m),y (m)\n1,2\n2,dos\n3\n4,NaN\n5,\n', rengOp)
    expect(rengR.filas).toEqual([[1, 2], [4, null], [5, null]])
    expect(rengR.errores).toEqual([
      { linea: 3, mensaje: 'columna «y»: «dos» no es un número.' },
      { linea: 4, mensaje: 'tiene 1 valor y se esperaban 2.' }
    ])
    expect([rengR.nan, rengR.faltantes, rengR.filasOmitidas]).toEqual([1, 1, 2])
    const rengSin = rengAnalizarCSV('1 2\n3 4\n', rengOp)
    expect(rengSin.columnas.map((rengC) => rengC.clave)).toEqual(['c1', 'c2'])
    expect(rengSin.avisos.join(' ')).toMatch(/No hay fila de encabezado/)
  })
  it('encabezados vacíos o repetidos, unidad desconocida, punto con coma decimal', () => {
    expect(rengAnalizarCSV('t,,h\n1,2,3\n', rengOp).error).toMatch(/columna 2 está vacío/)
    const rengRep = rengAnalizarCSV('t;t\n1;2\n', rengOp)
    expect(rengRep.columnas.map((rengC) => rengC.clave)).toEqual(['t', 't_2'])
    expect(rengRep.avisos.join(' ')).toMatch(/repetido/)
    expect(rengAnalizarCSV('t (zorks);h\n1;2\n', rengOp).avisos.join(' ')).toMatch(/No reconozco la unidad «zorks»/)
    expect(rengAnalizarCSV('t;h\n1,5;2.5\n', { separador: ';', decimal: ',' }).errores[0]!.mensaje).toMatch(/«2.5» no es un número con coma decimal/)
  })
  it('topes de filas y columnas', () => {
    const rengCols = Array.from({ length: 40 }, (_, rengI) => `c${rengI}`).join(',')
    expect(rengAnalizarCSV(`${rengCols}\n`, rengOp).error).toMatch(/40 columnas/)
    const rengMuchas = `t,h\n${Array.from({ length: RENG_LIMITES_CUADERNO.filas + 1 }, (_, rengI) => `${rengI},${rengI}`).join('\n')}\n`
    expect(rengAnalizarCSV(rengMuchas, rengOp).error).toMatch(/más de 100.000 filas/)
  })
  it('lo exportado se vuelve a leer igual', () => {
    const rengD = rengCorridaValoracion({ acido: 'acetico', concentracionAcido: 0.01, volumenAcidoMl: 25, concentracionBase: 0.01, volumenBaseMl: 25 })
    const rengR = rengAnalizarCSV(rengCsvDeSerie(rengD.serie, ['x']), rengOp)
    expect(rengR.filas).toEqual(rengD.serie.filas)
    expect(rengR.columnas).toEqual(rengD.serie.columnas.map((rengC) => ({ clave: rengC.clave, nombre: rengC.clave, unidad: rengC.unidad })))
  })
})

describe('comparación de series', () => {
  const rengSerie = (rengNombre: string, rengXs: number[], rengF: (rengX: number) => number, rengUx = 's', rengUy = 'm') => ({ nombre: rengNombre, x: rengXs, y: rengXs.map(rengF), ux: rengUx, uy: rengUy })
  it('mismo muestreo: residuos punto a punto; series idénticas → RMSE 0', () => {
    const rengXs = [0, 1, 2, 3]
    const rengC = rengComparar(rengSerie('a', rengXs, (rengX) => rengX * rengX), rengSerie('b', rengXs, (rengX) => rengX * rengX))
    expect(rengC.ok && rengC.rmse).toBe(0)
    expect(rengC.ok && rengC.metodo).toMatch(/sin interpolar/)
  })
  it('convierte unidades (cm → m, ms → s), alinea por interpolación y calcula RMSE en la unidad de la referencia', () => {
    const rengRef = rengSerie('modelo', [0, 1, 2, 3, 4], (rengX) => 2 * rengX)
    const rengMed = rengSerie('medición', [500, 1500, 2500, 5000], (rengT) => 200 * (rengT / 1000) + 10, 'ms', 'cm')
    const rengC = rengComparar(rengRef, rengMed)
    if (!rengC.ok) throw new Error(rengC.motivo)
    expect(rengC.conversiones).toEqual(['x de «medición»: ms → s', 'y de «medición»: cm → m'])
    expect(rengC.n).toBe(3)
    expect(rengC.intervalo).toEqual([0.5, 4])
    expect(rengC.rmse).toBeCloseTo(0.1, 12)
    expect(rengC.unidad).toBe('m')
    expect(rengC.metodo).toMatch(/Interpolación lineal/)
  })
  it('magnitudes incompatibles o sin solape: no se compara y se dice por qué', () => {
    const rengA = rengSerie('a', [0, 1], (rengX) => rengX)
    const rengOtra = rengComparar(rengA, rengSerie('b', [0, 1], (rengX) => rengX, 's', 's'))
    expect(rengOtra.ok).toBe(false)
    expect(!rengOtra.ok && rengOtra.motivo).toMatch(/no son comparables \(s frente a m\)/)
    const rengLejos = rengComparar(rengA, rengSerie('c', [5, 6], (rengX) => rengX))
    expect(!rengLejos.ok && rengLejos.motivo).toMatch(/no se solapan/)
    expect(rengComparar(rengSerie('u', [1], (rengX) => rengX), rengA).ok).toBe(false)
  })
  it('interpolación lineal exacta y fuera de rango', () => {
    expect(rengInterpolar([0, 1, 3], [0, 10, 30], 2)).toBe(20)
    expect(rengInterpolar([0, 1], [0, 1], 2)).toBeNaN()
  })
})

describe('versiones de los modelos', () => {
  it('el registro del cuaderno coincide con la ficha de Química', () => {
    const rengEsperado: Record<string, string> = { [RENG_MODELO_VALORACION.id]: RENG_MODELO_VALORACION.version }
    for (const rengEscena of RENG_ESCENAS) rengEsperado[RENG_ID_MODELO_CORRIDA[rengEscena]] = RENG_MODELOS_ESCENA[rengEscena].version
    expect(RENG_VERSIONES_MODELOS).toEqual(rengEsperado)
    expect(rengCompatibilidad('mezcla-acido-base', '1')).toEqual({ tipo: 'actual' })
    expect(rengCompatibilidad('mezcla-acido-base', '0')).toEqual({ tipo: 'otra-version', actual: '1' })
    expect(rengCompatibilidad('no-existe', '1')).toEqual({ tipo: 'no-disponible' })
  })
})

describe('piloto: valoración ácido–base', () => {
  it('conserva el caso de 25 mL de ácido acético y 25 mL de NaOH 0,01 mol/L (pH ≈ 8,22) con residuos', () => {
    const rengD = rengCorridaValoracion({ acido: 'acetico', concentracionAcido: 0.01, volumenAcidoMl: 25, concentracionBase: 0.01, volumenBaseMl: 25 })
    expect(rengD.estado).toBe('calculado')
    const rengPH = rengD.resultados.find((rengR) => rengR.clave === 'pH')!.valor
    expect(rengPH).toBeCloseTo(8.22, 2)
    expect(rengD.resultados.find((rengR) => rengR.clave === 'Veq')!.valor).toBe(25)
    expect(Math.abs(rengD.resultados.find((rengR) => rengR.clave === 'resCarga')!.valor)).toBeLessThan(1e-12)
    expect(Math.abs(rengD.resultados.find((rengR) => rengR.clave === 'resMateria')!.valor)).toBeLessThan(1e-12)
    expect(rengD.serie.filas.some((rengF) => rengF[0] === 25 && rengF[1] === rengPH)).toBe(true)
    expect(rengD.origen).toEqual({ modulo: 'simulador-quimica', sub: 'mezcla', entradas: { acido: 1, cAcido: 0.01, VAcido: 25, cBase: 0.01, VBase: 25, T: 25 } })
  })
  it('fuera del dominio diluido: entrada inválida con el motivo del modelo', () => {
    const rengD = rengCorridaValoracion({ acido: 'hcl', concentracionAcido: 0.5, volumenAcidoMl: 25, concentracionBase: 0.01, volumenBaseMl: 25 })
    expect(rengD.estado).toBe('entrada-invalida')
    expect(rengD.diagnosticos[0]).toMatch(/0,01 mol\/L/)
    expect(rengD.serie.filas).toEqual([])
  })
})

describe('compatibilidad con proyectos del cuaderno original', () => {
  const rengMixto = (): unknown => JSON.parse(readFileSync(join(import.meta.dirname, 'fixtures/proyecto-mixto-original.json'), 'utf8'))
  it('un proyecto con corridas de física y química guardado por la app original se valida sin perder nada', () => {
    const rengP = rengValidarProyecto(rengMixto())
    expect(rengP).toEqual(rengMixto())
    expect(rengP.corridas.map((rengC) => rengC.origen.modulo)).toEqual(['simulador-fisica', 'simulador-quimica'])
  })
  it('se importa al almacén y la corrida de física queda visible pero no reabrible aquí', async () => {
    const rengDir = rengCarpeta()
    const rengP = await rengImportarProyecto(rengDir, JSON.stringify(rengMixto()), RENG_ID(20))
    expect(rengP.corridas).toHaveLength(2)
    expect(rengCompatibilidad('mezcla-acido-base', '1')).toEqual({ tipo: 'actual' })
    expect(rengCompatibilidad('vaciado-tanque', '1')).toEqual({ tipo: 'no-disponible' })
  })
})
