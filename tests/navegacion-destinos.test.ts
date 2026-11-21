import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { rengPestanaPorTecla } from '../src/renderer/shell/nucleo/pestanas'

const RENG_MODULOS = join(import.meta.dirname, '../src/renderer/modules')
function rengFuentes(rengDir: string): string[] {
  return readdirSync(rengDir).flatMap((rengF) => {
    const rengP = join(rengDir, rengF)
    return statSync(rengP).isDirectory() ? rengFuentes(rengP) : /\.(ts|tsx)$/.test(rengF) ? [rengP] : []
  })
}
const rengLeer = (rengP: string): string => readFileSync(rengP, 'utf8')

describe('teclado en una lista de pestañas', () => {
  const rengIds = ['simulacion', 'ejercicios'] as const
  it('← y → pasan a la otra (con vuelta); Inicio y Fin a los extremos; otras teclas no hacen nada', () => {
    expect(rengPestanaPorTecla(rengIds, 'simulacion', 'ArrowRight')).toBe('ejercicios')
    expect(rengPestanaPorTecla(rengIds, 'ejercicios', 'ArrowRight')).toBe('simulacion')
    expect(rengPestanaPorTecla(rengIds, 'simulacion', 'ArrowLeft')).toBe('ejercicios')
    expect(rengPestanaPorTecla(rengIds, 'ejercicios', 'Home')).toBe('simulacion')
    expect(rengPestanaPorTecla(rengIds, 'simulacion', 'End')).toBe('ejercicios')
    for (const rengT of ['a', ' ', 'Enter', 'Tab', 'ArrowUp', 'ArrowDown', '1']) expect(rengPestanaPorTecla(rengIds, 'simulacion', rengT)).toBeNull()
    expect(rengPestanaPorTecla([], 'x', 'ArrowRight')).toBeNull()
  })
})

describe('lo que no está a la vista se suspende', () => {
  const rengQuimica = rengFuentes(join(RENG_MODULOS, 'simulador-quimica'))
  it('cada componente de Química que crea un motor 3D lo activa/suspende según su vista', () => {
    const rengConMotor = [...rengQuimica].filter((rengF) => /rengCreateEngine\(/.test(rengLeer(rengF)))
    expect(rengConMotor.length).toBeGreaterThanOrEqual(2)
    for (const rengF of rengConMotor) expect(/\.activar\(/.test(rengLeer(rengF)), rengF).toBe(true)
  })
  it('cada atajo de teclado global comprueba que su vista esté activa', () => {
    const rengConAtajos = [...rengQuimica].filter((rengF) => /addEventListener\('keydown'/.test(rengLeer(rengF)))
    expect(rengConAtajos.length).toBeGreaterThan(0)
    for (const rengF of rengConAtajos) expect(/[aA]ctiv[oa]/.test(rengLeer(rengF)), rengF).toBe(true)
  })
  it('Formulación ya no aloja la práctica: está en «Prácticas por nivel» (Inorgánica › Formular y nombrar), un destino propio de Química', () => {
    const rengFormulacion = rengLeer(join(RENG_MODULOS, 'simulador-quimica/modos/Formulacion.tsx'))
    expect(rengFormulacion).not.toMatch(/RengPracticaFormulacion/)
    expect(rengFormulacion).not.toMatch(/'practicar'/)
    const rengView = rengLeer(join(RENG_MODULOS, 'simulador-quimica/View.tsx'))
    expect(rengView).toMatch(/RENG_DESTINOS_QUIMICA/)
    expect(rengView).toMatch(/onPracticar=\{\(\) => rengPracticarTema\('formular-nombrar'\)\}/)
    expect(rengLeer(join(RENG_MODULOS, 'simulador-quimica/navegacion.ts'))).toMatch(/'Prácticas por nivel'/)
    expect(rengLeer(join(RENG_MODULOS, 'simulador-quimica/modos/VistaEjercicios.tsx'))).toMatch(/<RengPracticaFormulacion /)
  })
})
