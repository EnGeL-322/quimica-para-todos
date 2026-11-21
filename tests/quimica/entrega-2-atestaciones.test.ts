import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RENG_ARCHIVO_ATESTACIONES, RENG_VERSION_ATESTACIONES, type RengAtestacionRegistrada } from '../../src/renderer/modules/simulador-quimica/temario/atestaciones.datos'
import { RENG_MIN_MOTIVO, rengFechaIsoValida, rengProblemasAtestaciones, type RengContextoAtestaciones } from '../../src/renderer/modules/simulador-quimica/temario/atestaciones'
import { RENG_CORRESPONDENCIAS } from '../../src/renderer/modules/simulador-quimica/temario/correspondencias'
import { RENG_TEMARIO, rengCatalogoReal } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import { RENG_CONTEXTO_REAL, RENG_REGISTRO_COBERTURA, rengEvaluarSubtema, type RengRegistroCobertura } from '../../src/renderer/modules/simulador-quimica/temario/estado'

const rengContexto: RengContextoAtestaciones = { familiasDeTema: RENG_CONTEXTO_REAL.familiasDeTema, temaCompleto: RENG_CONTEXTO_REAL.temaCompleto }
const rengProblemas = (rengA: readonly RengAtestacionRegistrada[], rengVersion = RENG_VERSION_ATESTACIONES): string[] => rengProblemasAtestaciones({ version: rengVersion, atestaciones: rengA }, RENG_TEMARIO, RENG_CORRESPONDENCIAS, rengContexto)

const RENG_BUENA: RengAtestacionRegistrada = {
  subtema: 'n1-b5-s2',
  tema: 'oxidacion',
  familia: 'inorganica.oxidacion',
  revisor: 'Revisor de prueba',
  fecha: '2026-11-16',
  motivo: 'La lección y la práctica de números de oxidación tratan este subtema (prueba, no es una atestación real).'
}

describe('Atestaciones · archivo de datos (Entrega 2, paso a)', () => {
  it('el archivo real es válido, versionado y empieza vacío', () => {
    expect(RENG_ARCHIVO_ATESTACIONES.version).toBe(RENG_VERSION_ATESTACIONES)
    expect(rengProblemasAtestaciones(RENG_ARCHIVO_ATESTACIONES, RENG_TEMARIO, RENG_CORRESPONDENCIAS, rengContexto)).toEqual([])
  })

  it('el registro de cobertura se construye desde el archivo, sin entradas ocultas', () => {
    expect(RENG_REGISTRO_COBERTURA.atestaciones.size).toBe(RENG_ARCHIVO_ATESTACIONES.atestaciones.length)
    expect([...RENG_REGISTRO_COBERTURA.atestaciones.keys()].sort()).toEqual(RENG_ARCHIVO_ATESTACIONES.atestaciones.map((rengA) => rengA.subtema).sort())
    expect(RENG_REGISTRO_COBERTURA.enDesarrollo.size).toBe(0)
  })

  it('una atestación correcta pasa la validación', () => {
    expect(rengProblemas([RENG_BUENA])).toEqual([])
  })

  it('SABOTAJE: sin revisor, con revisor en blanco', () => {
    expect(rengProblemas([{ ...RENG_BUENA, revisor: '' }]).join('|')).toContain('falta el revisor')
    expect(rengProblemas([{ ...RENG_BUENA, revisor: '   ' }]).join('|')).toContain('falta el revisor')
  })

  it('SABOTAJE: fecha inválida (formato, día inexistente, anterior al proyecto)', () => {
    for (const rengF of ['16/11/2026', '2026-02-30', '2026-13-01', '', '2026-11-1', '1999-01-01', 'hoy']) expect(rengProblemas([{ ...RENG_BUENA, fecha: rengF }]).join('|'), rengF).toContain('fecha inválida')
    expect(rengFechaIsoValida('2028-02-29')).toBe(true)
    expect(rengFechaIsoValida('2027-02-29')).toBe(false)
  })

  it('SABOTAJE: subtema inexistente', () => {
    expect(rengProblemas([{ ...RENG_BUENA, subtema: 'n1-b5-s99' }]).join('|')).toContain('el subtema no existe')
    expect(rengProblemas([{ ...RENG_BUENA, subtema: 'n9-b1-s1' }]).join('|')).toContain('el subtema no existe')
  })

  it('SABOTAJE: subtema sin recurso confirmado (por revisar, sin recurso o del bloque 64)', () => {
    expect(rengProblemas([{ ...RENG_BUENA, subtema: 'n2-b13-s3' }]).join('|')).toContain('no tiene recursos confirmados')
    expect(rengProblemas([{ ...RENG_BUENA, subtema: 'n2-b13-s1' }]).join('|')).toContain('no tiene recursos confirmados')
    expect(rengProblemas([{ ...RENG_BUENA, subtema: 'n8-b64-s1' }]).join('|')).toContain('no tiene recursos confirmados')
  })

  it('SABOTAJE: un tema que no cubre ese subtema (no está entre sus recursos confirmados)', () => {
    expect(rengProblemas([{ ...RENG_BUENA, tema: 'ph', familia: 'analitica.ph' }]).join('|')).toContain('no está entre los recursos confirmados')
    expect(rengProblemas([{ ...RENG_BUENA, tema: 'tema-inventado', familia: 'x' }]).join('|')).toContain('no está entre los recursos confirmados')
  })

  it('SABOTAJE: un tema solo «por revisar» no vale como cobertura', () => {
    const rengRevisar = { 5: [{ estado: 'revisar' as const, posiciones: [2], recursos: [{ tipo: 'tema' as const, id: 'oxidacion' }] }] }
    expect(rengProblemasAtestaciones({ version: 1, atestaciones: [RENG_BUENA] }, RENG_TEMARIO, rengRevisar, rengContexto).join('|')).toContain('no tiene recursos confirmados')
  })

  it('SABOTAJE: familia que no es del tema, motivo corto, repetida y versión desconocida', () => {
    expect(rengProblemas([{ ...RENG_BUENA, familia: 'analitica.ph' }]).join('|')).toContain('no pertenece al tema')
    expect(rengProblemas([{ ...RENG_BUENA, motivo: 'porque sí' }]).join('|')).toContain(`al menos ${RENG_MIN_MOTIVO}`)
    expect(rengProblemas([RENG_BUENA, RENG_BUENA]).join('|')).toContain('repetida')
    expect(rengProblemas([RENG_BUENA], 2).join('|')).toContain('versión 2')
  })

  it('SABOTAJE: un tema sin lección y práctica no puede atestiguar', () => {
    const rengSinLeccion: RengContextoAtestaciones = { ...rengContexto, temaCompleto: () => false }
    expect(rengProblemasAtestaciones({ version: 1, atestaciones: [RENG_BUENA] }, RENG_TEMARIO, RENG_CORRESPONDENCIAS, rengSinLeccion).join('|')).toContain('no tiene lección y práctica')
  })

  it('una atestación válida lleva el subtema a Completado (nunca a Verificado) y una errónea lo deja en Parcial', () => {
    const rengSub = rengCatalogoReal().niveles[0]!.bloques.find((rengB) => rengB.numero === 5)!.subtemas[1]!
    const rengRegistro = (rengA: RengAtestacionRegistrada): RengRegistroCobertura => ({ ...RENG_REGISTRO_COBERTURA, atestaciones: new Map([[rengA.subtema, { tema: rengA.tema, familia: rengA.familia, revisor: rengA.revisor, fecha: rengA.fecha }]]) })
    expect(rengEvaluarSubtema(rengSub.id, rengSub.confirmados, rengRegistro(RENG_BUENA)).estado).toBe('completado')
    expect(rengEvaluarSubtema(rengSub.id, rengSub.confirmados, rengRegistro({ ...RENG_BUENA, tema: 'ph', familia: 'analitica.ph' })).estado).toBe('parcial')
    expect(rengEvaluarSubtema(rengSub.id, rengSub.confirmados, rengRegistro({ ...RENG_BUENA, revisor: '' })).estado).toBe('parcial')
  })

  it('con el archivo real vacío no hay Completado ni Verificado', () => {
    expect(RENG_ARCHIVO_ATESTACIONES.atestaciones).toHaveLength(0)
    const rengP = rengCatalogoReal().cobertura.porEstado
    expect(rengP.completado).toBe(0)
    expect(rengP.verificado).toBe(0)
  })

  it('la interfaz no puede editarlo: ningún componente .tsx menciona las atestaciones', () => {
    const rengRaiz = join(import.meta.dirname, '../../src/renderer')
    const rengArchivos: string[] = []
    const rengRec = (rengD: string): void => {
      for (const rengN of readdirSync(rengD, { withFileTypes: true })) {
        const rengP = join(rengD, rengN.name)
        if (rengN.isDirectory()) rengRec(rengP)
        else if (/\.tsx$/.test(rengN.name)) rengArchivos.push(rengP)
      }
    }
    rengRec(rengRaiz)
    expect(rengArchivos.length).toBeGreaterThan(20)
    for (const rengA of rengArchivos) expect(readFileSync(rengA, 'utf8'), rengA).not.toMatch(/atestaci/i)
  })
})
