import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { rengPedirReapertura, rengTomarReapertura, rengVerReapertura } from '../../src/renderer/lib/cuaderno/reapertura'

const RENG_MODULO = join(import.meta.dirname, '../../src/renderer/modules/simulador-quimica')
const rengLeer = (rengRuta: string): string => readFileSync(join(RENG_MODULO, rengRuta), 'utf8')
const rengEscenas = readdirSync(join(RENG_MODULO, 'modos/simulacion')).filter((rengF) => rengF.endsWith('.tsx'))

const rengAlmacen = (): { datos: Record<string, string>; getItem: (rengK: string) => string | null; setItem: (rengK: string, rengV: string) => void; removeItem: (rengK: string) => void } => {
  const rengDatos: Record<string, string> = {}
  return { datos: rengDatos, getItem: (rengK) => rengDatos[rengK] ?? null, setItem: (rengK, rengV) => void (rengDatos[rengK] = rengV), removeItem: (rengK) => void delete rengDatos[rengK] }
}

describe('Entrega E · «Reabrir y repetir» sigue funcionando, sin ninguna relación con los ejercicios', () => {
  it('ver la reapertura NO la consume (la escena la sigue pudiendo tomar después)', () => {
    const rengA = rengAlmacen()
    expect(rengVerReapertura(rengA)).toBeNull()
    Object.defineProperty(globalThis, 'sessionStorage', { value: rengA, configurable: true })
    rengPedirReapertura({ proyecto: 'proyecto-prueba-1', corrida: 'corrida-0001', nombre: 'x', modulo: 'simulador-quimica', sub: 'dilucion', entradas: { c1: 0.2 }, version: '1' })
    expect(rengVerReapertura(rengA)).toEqual({ modulo: 'simulador-quimica', sub: 'dilucion' })
    expect(rengVerReapertura(rengA)).toEqual({ modulo: 'simulador-quimica', sub: 'dilucion' })
    expect(rengA.datos['cuaderno.reabrir']).toBeDefined()
    expect(rengTomarReapertura('simulador-quimica', 'dilucion')?.corrida).toBe('corrida-0001')
    expect(rengVerReapertura(rengA)).toBeNull()
  })

  it('una petición dañada o ajena se ignora sin lanzar', () => {
    const rengA = rengAlmacen()
    for (const rengV of ['{roto', 'null', '[]', '{"modulo":3,"sub":"x"}', '{"modulo":"simulador-quimica"}', 'x'.repeat(30000)]) {
      rengA.datos['cuaderno.reabrir'] = rengV
      expect(rengVerReapertura(rengA), rengV.slice(0, 20)).toBeNull()
    }
    expect(rengVerReapertura(null)).toBeNull()
    expect(rengVerReapertura({ getItem: () => { throw new Error('bloqueado') } })).toBeNull()
  })

  it('una petición de otra escena o de otro módulo no la toma una escena que no es la suya', () => {
    const rengA = rengAlmacen()
    Object.defineProperty(globalThis, 'sessionStorage', { value: rengA, configurable: true })
    rengPedirReapertura({ proyecto: 'p', corrida: 'c1', nombre: 'x', modulo: 'simulador-quimica', sub: 'solubilidad', entradas: {}, version: '1' })
    expect(rengTomarReapertura('simulador-quimica', 'dilucion')).toBeNull()
    expect(rengTomarReapertura('simulador-fisica', 'solubilidad')).toBeNull()
    expect(rengTomarReapertura('simulador-quimica', 'solubilidad')?.corrida).toBe('c1')
  })
})

describe('Entrega E · las simulaciones son libres: no dependen de ningún ejercicio, nivel de práctica ni progreso', () => {
  it('la transferencia ya no se guarda en el navegador: no existe el módulo ni la clave, y la vista no lee la reapertura', () => {
    expect(existsSync(join(RENG_MODULO, 'practica/transferenciaGuardada.ts'))).toBe(false)
    const rengVista = rengLeer('View.tsx')
    expect(rengVista).not.toMatch(/transferenciaGuardada|quimica\.transferencia-activa|sessionStorage|rengVerReapertura|ejercicioId: rengPract/)
    expect(rengVista).toMatch(/rengProbarEnLaboratorio/)
  })

  it('el componente de simulaciones no conoce el ejercicio, no ofrece «Volver a la práctica» ni avisa de que viene de un ejercicio', () => {
    const rengTexto = rengLeer('modos/Simulaciones.tsx')
    expect(rengTexto).not.toMatch(/Volver a la práctica|viene de un ejercicio|Datos copiados del ejercicio|No se pudieron copiar los datos del ejercicio|onVolverEjercicio|ejercicioId|restaurada/)
  })

  it('ninguna escena menciona ejercicios ni lee el nivel de práctica fuera del contexto fijado por la vista', () => {
    expect(rengEscenas.length).toBeGreaterThanOrEqual(10)
    for (const rengF of rengEscenas) expect(rengLeer(`modos/simulacion/${rengF}`), rengF).not.toMatch(/ejercicio|Volver a la práctica|sessionStorage/i)
    const rengVista = rengLeer('View.tsx')
    expect(rengVista).toMatch(/RENG_NIVEL_SIMULACION: RengNivelPractica = 'cientifico'/)
    expect(rengVista).toMatch(/<RengNivelPracticaContext\.Provider value=\{RENG_NIVEL_SIMULACION\}>\s*<RengSimulaciones /)
    expect(rengVista).not.toMatch(/\(rengDestino === 'simulacion' \|\| rengDestino === 'casos'\)/)
  })

  it('el botón del ejercicio es de ida: «Probarlo en el laboratorio», sin volver ni estado', () => {
    const rengTexto = rengLeer('modos/VistaEjercicios.tsx')
    expect(rengTexto).toMatch(/Probarlo en el laboratorio/)
    expect(rengTexto).not.toMatch(/Simular este ejercicio/)
  })

  it('sabotaje: el patrón de detección sí encuentra el acoplamiento si volviera a aparecer', () => {
    const rengPatron = /Volver a la práctica|viene de un ejercicio|ejercicioId|restaurada/
    expect(rengPatron.test('<button>Volver a la práctica</button>')).toBe(true)
    expect(rengPatron.test('Esta simulación viene de un ejercicio de práctica')).toBe(true)
    expect(rengPatron.test('const t = { ejercicioId: x }')).toBe(true)
    expect(rengPatron.test('Pulsa «Calcular» para ver el resultado')).toBe(false)
  })
})
