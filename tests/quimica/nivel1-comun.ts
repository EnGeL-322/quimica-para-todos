import { expect, it } from 'vitest'
import { rengAnalizarUnidad, rengConvertir } from '../../src/renderer/lib/unidades'
import { rengCorregirN1, rengTextoRespuestaN1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/correccion'
import { rengLimiteToleranciaN1, rengSeparadosN1, rengVentanaErrorN1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/fabrica'
import { RENG_PATRON_ID_INTEGRADOR_N1, RENG_PATRON_ID_PRACTICA_N1, type RengInstanciaN1, type RengPracticaN1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/tipos'

export type RengSegundoMetodo = (rengD: Readonly<Record<string, number>>) => number

export const RENG_SEMILLAS_PRUEBA = 300

export const RENG_UNIDAD_ALTERNATIVA: Readonly<Record<string, string>> = {
  kPa: 'Pa',
  atm: 'kPa',
  mmHg: 'kPa',
  L: 'mL',
  mL: 'L',
  'g/L': 'kg/m³',
  K: '°C',
  '°C': 'K',
  m: 'cm',
  kN: 'N',
  s: 'min',
  mmol: 'mol',
  'g/mol': 'kg/mol',
  'm/s': 'km/h',
  J: 'kJ',
  kJ: 'J',
  'L/mol': 'm³/mol',
  g: 'mg',
  mol: 'mmol'
}

export const rengEsReproducible = (rengP: Pick<RengPracticaN1, 'generar'>, rengSemilla: number): boolean => JSON.stringify(rengP.generar(rengSemilla)) === JSON.stringify(rengP.generar(rengSemilla))

export const rengSeparacionInstancia = (rengP: RengPracticaN1, rengI: RengInstanciaN1): boolean => rengSeparadosN1(rengI.respuesta, rengI.errores.map((rengE) => rengE.valor), rengP.tolerancia)

export const rengTextoSinDefectos = (rengT: string): boolean => rengT.trim().length > 0 && !/NaN|undefined|Infinity|\[object/.test(rengT)

export function rengCercaRel(rengA: number, rengB: number, rengRel = 1e-5, rengAbs = 1e-9): boolean {
  return Number.isFinite(rengA) && Number.isFinite(rengB) && Math.abs(rengA - rengB) <= Math.max(rengAbs, rengRel * Math.max(Math.abs(rengA), Math.abs(rengB)))
}

export function rengProbarPractica(rengP: RengPracticaN1, rengSegundo: RengSegundoMetodo | undefined): void {
  it(`${rengP.id}: identidad, unidad, tolerancia y procedencia`, () => {
    if (rengP.subtemas) {
      expect(rengP.id).toMatch(RENG_PATRON_ID_INTEGRADOR_N1)
      expect(new Set(rengP.subtemas).size).toBeGreaterThanOrEqual(2)
    } else {
      expect(rengP.id).toMatch(RENG_PATRON_ID_PRACTICA_N1)
      expect(rengP.id.startsWith(`${rengP.subtema}-p`)).toBe(true)
    }
    expect(rengP.titulo.length).toBeGreaterThan(5)
    expect(rengP.objetivo.length).toBeGreaterThan(20)
    expect(rengAnalizarUnidad(rengP.unidad).ok, `unidad «${rengP.unidad}»`).toBe(true)
    expect(rengP.tolerancia.rel).toBeGreaterThan(0)
    expect(rengP.tolerancia.rel).toBeLessThanOrEqual(0.02)
    expect(rengP.tolerancia.abs).toBeGreaterThan(0)
    const rengNiveles = rengP.procedencia.map((rengX) => rengX.nivel)
    expect(rengNiveles).toContain('dato-calculado')
    expect(rengNiveles).toContain('parametro-didactico')
    expect(rengNiveles).toContain('ejemplo-idealizado')
    expect(rengNiveles).not.toContain('fuente-verificada')
    expect(rengSegundo, `falta el segundo método de ${rengP.id}`).toBeTypeOf('function')
  })

  it(`${rengP.id}: ${RENG_SEMILLAS_PRUEBA} semillas reproducibles, separadas, con texto sano y segundo método`, () => {
    const rengVariantes = new Set<string>()
    for (let rengS = 0; rengS < RENG_SEMILLAS_PRUEBA; rengS++) {
      const rengI = rengP.generar(rengS)
      const rengEt = `${rengP.id} semilla ${rengS}`
      expect(JSON.stringify(rengP.generar(rengS)), rengEt).toBe(JSON.stringify(rengI))
      expect(rengI.semilla).toBe(rengS)
      expect(Number.isFinite(rengI.respuesta), rengEt).toBe(true)
      expect(rengTextoSinDefectos(rengI.enunciado), rengEt).toBe(true)
      expect(rengTextoSinDefectos(rengI.pregunta), rengEt).toBe(true)
      expect(rengI.datos.length, rengEt).toBeGreaterThanOrEqual(2)
      for (const [rengK, rengV] of rengI.datos) expect(rengTextoSinDefectos(rengK) && rengTextoSinDefectos(rengV), `${rengEt} dato ${rengK}`).toBe(true)
      expect(rengI.pasos.length, rengEt).toBeGreaterThanOrEqual(2)
      for (const rengPaso of rengI.pasos) expect(rengTextoSinDefectos(rengPaso), `${rengEt} paso`).toBe(true)
      for (const rengPista of rengI.pistas) expect(rengPista.length, `${rengEt} pista`).toBeGreaterThanOrEqual(11)
      expect(rengI.errores.length, rengEt).toBeGreaterThanOrEqual(2)
      for (const rengE of rengI.errores) expect(rengE.mensaje.length, `${rengEt} ${rengE.id}`).toBeGreaterThanOrEqual(26)
      expect(new Set(rengI.errores.map((rengE) => rengE.id)).size).toBe(rengI.errores.length)
      expect(rengSeparacionInstancia(rengP, rengI), rengEt).toBe(true)
      const rengDos = rengSegundo!(rengI.parametros)
      expect(rengCercaRel(rengDos, rengI.respuesta), `${rengEt}: segundo método ${rengDos} frente a ${rengI.respuesta}`).toBe(true)
      rengVariantes.add(`${rengI.enunciado}|${rengI.pregunta}`)
    }
    expect(rengVariantes.size, `${rengP.id}: variantes distintas`).toBeGreaterThanOrEqual(12)
  })

  it(`${rengP.id}: la corrección acepta la respuesta, detecta cada error típico, las unidades y los no finitos`, () => {
    for (const rengS of [0, 1, 7, 42, 137, 299]) {
      const rengI = rengP.generar(rengS)
      const rengEt = `${rengP.id} semilla ${rengS}`
      expect(rengCorregirN1(rengTextoRespuestaN1(rengI.respuesta), rengP, rengI).tipo, rengEt).toBe('correcto')
      expect(rengCorregirN1(`${rengTextoRespuestaN1(rengI.respuesta)} ${rengP.unidad}`.trim(), rengP, rengI).tipo, rengEt).toBe('correcto')
      for (const rengE of rengI.errores) {
        const rengV = rengCorregirN1(rengTextoRespuestaN1(rengE.valor), rengP, rengI)
        expect(rengV.tipo, `${rengEt} ${rengE.id}`).toBe('error-tipico')
        expect(rengV.errorId, `${rengEt} ${rengE.id}`).toBe(rengE.id)
        expect(rengV.mensaje).toBe(rengE.mensaje)
      }
      const rengAlt = RENG_UNIDAD_ALTERNATIVA[rengP.unidad]
      if (rengAlt) {
        const rengEquivalente = rengConvertir(rengI.respuesta, rengP.unidad, rengAlt)
        const rengV = rengCorregirN1(`${rengTextoRespuestaN1(rengEquivalente, 7)} ${rengAlt}`, rengP, rengI)
        expect(rengV.tipo, `${rengEt} en ${rengAlt}`).toBe('correcto')
        expect(rengV.equivale ?? '', rengEt).toContain('equivale')
      }
      const rengAjena = ['kg', 'g', 'mg', 'u'].includes(rengP.unidad) ? 's' : 'kg'
      expect(rengCorregirN1(`${rengTextoRespuestaN1(rengI.respuesta)} ${rengAjena}`, rengP, rengI).tipo, `${rengEt} unidad ajena`).toBe('unidad-incompatible')
      expect(rengCorregirN1('1e400', rengP, rengI).tipo, rengEt).toBe('ilegible')
      expect(rengCorregirN1('Infinity', rengP, rengI).tipo, rengEt).toBe('ilegible')
      expect(rengCorregirN1('', rengP, rengI).tipo, rengEt).toBe('ilegible')
      const rengCien = rengI.respuesta * 100
      const rengChoca = rengI.errores.some((rengE) => Math.abs(rengE.valor - rengCien) <= rengVentanaErrorN1(rengE.valor, rengP.tolerancia))
      if (!rengChoca) expect(rengCorregirN1(rengTextoRespuestaN1(rengCien), rengP, rengI).tipo, `${rengEt} ×100`).toBe('unidades')
      const rengFuera = rengI.respuesta + 3 * rengLimiteToleranciaN1(rengI.respuesta, rengP.tolerancia) * Math.sign(rengI.respuesta || 1) + 0.2 * Math.abs(rengI.respuesta)
      const rengNoEsError = rengI.errores.every((rengE) => Math.abs(rengE.valor - rengFuera) > rengVentanaErrorN1(rengE.valor, rengP.tolerancia))
      if (rengNoEsError) expect(['alto', 'bajo', 'cerca', 'unidades'], `${rengEt} fuera`).toContain(rengCorregirN1(rengTextoRespuestaN1(rengFuera), rengP, rengI).tipo)
    }
  })

  it(`${rengP.id}: rechaza semillas no válidas`, () => {
    for (const rengS of [-1, 1.5, 1_000_000, Number.NaN]) expect(() => rengP.generar(rengS)).toThrow(RangeError)
  })
}

export function rengProbarGrupo(rengSubtema: string, rengPracticas: readonly RengPracticaN1[]): void {
  it(`${rengSubtema}: tres prácticas distintas (básica, intermedia, avanzada) del mismo subtema`, () => {
    expect(rengPracticas.map((rengP) => rengP.dificultad)).toEqual(['basica', 'intermedia', 'avanzada'])
    expect(rengPracticas.every((rengP) => rengP.subtema === rengSubtema)).toBe(true)
    expect(new Set(rengPracticas.map((rengP) => rengP.titulo)).size).toBe(3)
    const rengPrimeras = rengPracticas.map((rengP) => rengP.generar(0).enunciado)
    expect(new Set(rengPrimeras).size).toBe(3)
  })
}
