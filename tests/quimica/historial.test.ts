import { describe, expect, it } from 'vitest'
import {
  rengAnadirHistorial,
  rengBorrarDeHistorial,
  RENG_CLAVE_HISTORIAL,
  rengGuardarHistorial,
  rengLeerHistorial,
  RENG_MAX_HISTORIAL,
  rengMigrarHistorial,
  rengPrepararDeshacer,
  rengPuedeDeshacer,
  type RengAlmacenHistorial
} from '../../src/renderer/modules/simulador-quimica/nucleo/historial'

const rengMemoria = (rengInicial?: string): RengAlmacenHistorial & { m: Map<string, string> } => {
  const rengM = new Map<string, string>()
  if (rengInicial !== undefined) rengM.set(RENG_CLAVE_HISTORIAL, rengInicial)
  return { m: rengM, getItem: (rengK) => rengM.get(rengK) ?? null, setItem: (rengK, rengV) => void rengM.set(rengK, rengV) }
}
const rengE = (rengEntrada: string, rengNombre = rengEntrada) => ({ entrada: rengEntrada, nombre: rengNombre, tipo: 'molécula' })

describe('historial de sustancias', () => {
  it('añade arriba con id, nombre, tipo y fecha', () => {
    const rengL = rengAnadirHistorial([], rengE('H2O', 'agua'), new Date('2026-11-03T10:00:00Z'))
    expect(rengL).toHaveLength(1)
    expect(rengL[0]).toMatchObject({ entrada: 'H2O', nombre: 'agua', tipo: 'molécula', fecha: '2026-11-03T10:00:00.000Z' })
    expect(rengL[0]!.id).toMatch(/^h/)
  })
  it('sin duplicados: repetir sube la entrada (sin tildes ni mayúsculas)', () => {
    let rengL = rengAnadirHistorial([], rengE('ácido acético'))
    rengL = rengAnadirHistorial(rengL, rengE('H2O'))
    rengL = rengAnadirHistorial(rengL, rengE('ACIDO ACETICO'))
    expect(rengL.map((rengX) => rengX.entrada)).toEqual(['ACIDO ACETICO', 'H2O'])
  })
  it('borrar solo una y limpiar', () => {
    let rengL = rengAnadirHistorial([], rengE('a'))
    rengL = rengAnadirHistorial(rengL, rengE('b'))
    const rengId = rengL.find((rengX) => rengX.entrada === 'a')!.id
    expect(rengBorrarDeHistorial(rengL, rengId).map((rengX) => rengX.entrada)).toEqual(['b'])
  })
  it('deshacer durante 8 s', () => {
    const rengL = rengAnadirHistorial([], rengE('a'))
    const rengD = rengPrepararDeshacer(rengL, 'Historial limpiado', 1000)
    expect(rengPuedeDeshacer(rengD, 8999)).toBe(true)
    expect(rengPuedeDeshacer(rengD, 9000)).toBe(false)
    expect(rengD.anterior).toEqual(rengL)
    expect(rengPuedeDeshacer(null, 0)).toBe(false)
  })
  it('máximo 50', () => {
    let rengL = rengAnadirHistorial([], rengE('x0'))
    for (let rengI = 1; rengI < 70; rengI++) rengL = rengAnadirHistorial(rengL, rengE(`x${rengI}`))
    expect(rengL).toHaveLength(RENG_MAX_HISTORIAL)
    expect(rengL[0]!.entrada).toBe('x69')
  })
  it('migra el formato antiguo (string[]) sin perder nada', () => {
    const rengA = rengMemoria(JSON.stringify(['agua', 'CH3COOH', 'Au', 'agua']))
    const rengL = rengLeerHistorial(rengA)
    expect(rengL.map((rengX) => rengX.entrada)).toEqual(['agua', 'CH3COOH', 'Au'])
    expect(rengL.every((rengX) => rengX.tipo === 'anterior' && rengX.nombre === rengX.entrada)).toBe(true)
    expect(rengGuardarHistorial(rengA, rengL)).toBe(true)
    expect(rengLeerHistorial(rengA).map((rengX) => rengX.entrada)).toEqual(['agua', 'CH3COOH', 'Au'])
  })
  it('tolera datos corruptos y almacenamiento roto', () => {
    expect(rengLeerHistorial(rengMemoria('{no es json'))).toEqual([])
    expect(rengMigrarHistorial({ x: 1 })).toEqual([])
    expect(rengMigrarHistorial([1, null, { id: 'z' }, 'ok']).map((rengX) => rengX.entrada)).toEqual(['ok'])
    const rengRoto: RengAlmacenHistorial = {
      getItem: () => {
        throw new Error('sin permiso')
      },
      setItem: () => {
        throw new Error('lleno')
      }
    }
    expect(rengLeerHistorial(rengRoto)).toEqual([])
    expect(rengGuardarHistorial(rengRoto, [])).toBe(false)
    expect(rengGuardarHistorial(null, [])).toBe(false)
  })
})
