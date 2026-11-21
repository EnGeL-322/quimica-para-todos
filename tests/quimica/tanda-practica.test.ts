import { describe, expect, it } from 'vitest'
import { rengCorregir, rengGenerarEjercicios } from '../../src/renderer/modules/simulador-quimica/nucleo/ejerciciosFormulacion'
import { rengAciertosDe, RENG_EJERCICIOS_POR_TANDA, rengEjerciciosDe, rengTanda, rengTandaInicial, type RengEstadoTanda } from '../../src/renderer/modules/simulador-quimica/nucleo/tandaPractica'

const rengRespuestaCorrecta = (rengE: ReturnType<typeof rengEjerciciosDe>[number]): string => (rengE.tipo === 'formular' ? rengE.compuesto.formula : rengE.compuesto.nombres.principal)

describe('tanda de ejercicios de química', () => {
  it('empieza en dificultad 1 con los mismos 5 ejercicios que generaba la práctica de Formulación', () => {
    const rengT = rengTandaInicial()
    expect(rengT).toEqual({ dificultad: 1, semilla: 1, respuestas: {}, correcciones: {} })
    const rengEj = rengEjerciciosDe(rengT)
    expect(rengEj).toHaveLength(RENG_EJERCICIOS_POR_TANDA)
    expect(rengEj).toEqual(rengGenerarEjercicios(1, 5, 1 * 97 + 1))
  })
  it('escribir y comprobar: una bien y otra mal, con el contador de aciertos', () => {
    let rengT = rengTandaInicial()
    const [rengA, rengB] = rengEjerciciosDe(rengT)
    rengT = rengTanda(rengT, { tipo: 'escribir', id: rengA!.id, texto: rengRespuestaCorrecta(rengA!) })
    rengT = rengTanda(rengT, { tipo: 'comprobar', ejercicio: rengA! })
    rengT = rengTanda(rengT, { tipo: 'escribir', id: rengB!.id, texto: 'XyZ inventado' })
    rengT = rengTanda(rengT, { tipo: 'comprobar', ejercicio: rengB! })
    expect(rengT.correcciones[rengA!.id]!.correcta).toBe(true)
    expect(rengT.correcciones[rengB!.id]!.correcta).toBe(false)
    expect(rengT.correcciones[rengB!.id]!.mensaje.length).toBeGreaterThan(0)
    expect(rengT.correcciones[rengB!.id]).toEqual(rengCorregir(rengB!, 'XyZ inventado'))
    expect(rengAciertosDe(rengT, rengEjerciciosDe(rengT))).toBe(1)
    expect(rengT.respuestas[rengB!.id]).toBe('XyZ inventado')
  })
  it('las acciones no modifican el estado anterior (cada paso es una copia)', () => {
    const rengT0 = rengTandaInicial()
    const rengCopia = structuredClone(rengT0)
    const [rengA] = rengEjerciciosDe(rengT0)
    rengTanda(rengTanda(rengT0, { tipo: 'escribir', id: rengA!.id, texto: 'NaCl' }), { tipo: 'comprobar', ejercicio: rengA! })
    expect(rengT0).toEqual(rengCopia)
  })
  it('cambiar la dificultad o pedir nuevos ejercicios reinicia la tanda; la misma dificultad no', () => {
    let rengT: RengEstadoTanda = rengTandaInicial()
    const [rengA] = rengEjerciciosDe(rengT)
    rengT = rengTanda(rengTanda(rengT, { tipo: 'escribir', id: rengA!.id, texto: 'x' }), { tipo: 'comprobar', ejercicio: rengA! })
    expect(rengTanda(rengT, { tipo: 'dificultad', dificultad: 1 })).toBe(rengT)
    const rengD2 = rengTanda(rengT, { tipo: 'dificultad', dificultad: 2 })
    expect(rengD2).toMatchObject({ dificultad: 2, semilla: 1, respuestas: {}, correcciones: {} })
    expect(rengEjerciciosDe(rengD2).every((rengE) => rengE.nivel === 2)).toBe(true)
    const rengNuevos = rengTanda(rengT, { tipo: 'nuevos' })
    expect(rengNuevos).toMatchObject({ dificultad: 1, semilla: 2, respuestas: {}, correcciones: {} })
    expect(rengEjerciciosDe(rengNuevos).map((rengE) => rengE.enunciado)).not.toEqual(rengEjerciciosDe(rengT).map((rengE) => rengE.enunciado))
  })
  it('las tres dificultades generan tandas completas', () => {
    for (const rengD of [1, 2, 3] as const) expect(rengEjerciciosDe({ dificultad: rengD, semilla: 1 })).toHaveLength(RENG_EJERCICIOS_POR_TANDA)
  })
})
