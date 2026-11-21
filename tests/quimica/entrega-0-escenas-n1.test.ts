import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { rengValidarTex } from '../../src/renderer/lib/ecuaciones/validarTex'
import { rengRK4 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/numericos'
import { rengAjustarValorN1, rengComprobarEscenaN1, rengFormatoLecturaN1, rengLeerEscenaN1, rengMuestrasEscenaN1, rengTiempoSiguienteN1, rengValidarModeloEscenaN1, rengValoresDeCasoN1, rengValoresInicialesN1 } from '../../src/renderer/modules/simulador-quimica/escenas-n1/kit'
import { RENG_ESCENAS_N1 } from '../../src/renderer/modules/simulador-quimica/escenas-n1/registro'
import type { RengModeloEscenaN1, RengValoresEscenaN1 } from '../../src/renderer/modules/simulador-quimica/escenas-n1/tipos'
import { RENG_MODELO_DEMO_KIT, RENG_MODELO_DEMO_ROTO } from '../../src/renderer/pruebas/modeloDemo'

const RENG_RAIZ = join(import.meta.dirname, '..', '..')
const RENG_RUTA_ESCENA = '../../src/renderer/modules/simulador-quimica/vista/EscenaN1'
const rengVistaEscena = async (): Promise<(rengP: { modelo: RengModeloEscenaN1 }) => ReturnType<typeof createElement>> => ((await import(/* @vite-ignore */ RENG_RUTA_ESCENA)) as { RengEscenaN1: (rengP: { modelo: RengModeloEscenaN1 }) => ReturnType<typeof createElement> }).RengEscenaN1
const RENG_TOL_REL = 1e-8

function rengComprobarPrimerOrden(rengV: RengValoresEscenaN1, rengT: number, rengL: RengValoresEscenaN1): string | null {
  const rengNumerico = rengRK4((_rengX, rengY) => -rengV.k! * rengY, 0, rengV.a0!, rengT, 4000)
  if (Math.abs(rengL.a! - rengNumerico) > RENG_TOL_REL * rengV.a0! + 1e-12) return `[A] = ${rengL.a} y RK4 da ${rengNumerico}`
  if (Math.abs(rengL.a! + rengL.b! - rengV.a0!) > 1e-12 * rengV.a0!) return 'no se conserva [A] + [B] = [A]₀'
  if (Math.abs(rengL.mediaVida! * rengV.k! - Math.LN2) > 1e-12) return 'la vida media no es ln 2 / k'
  if (rengL.t !== rengT) return 'la lectura del tiempo no es t'
  return null
}

describe('Entrega 0 · kit de escenas N1: contrato y utilidades puras', () => {
  it('el registro de escenas N1 empieza vacío (cada bloque añadirá una línea) y sin ids repetidos', () => {
    expect(Array.isArray(RENG_ESCENAS_N1)).toBe(true)
    expect(new Set(RENG_ESCENAS_N1.map((rengE) => rengE.id)).size).toBe(RENG_ESCENAS_N1.length)
    for (const rengE of RENG_ESCENAS_N1) expect(rengValidarModeloEscenaN1(rengE), rengE.id).toEqual([])
  })

  it('el modelo de demostración cumple el contrato y su TeX es válido', () => {
    expect(rengValidarModeloEscenaN1(RENG_MODELO_DEMO_KIT)).toEqual([])
    for (const rengQ of RENG_MODELO_DEMO_KIT.ficha.ecuaciones) expect(rengValidarTex(rengQ.tex)).toEqual({ ok: true })
  })

  it('comprobación analítica: [A](t) del modelo coincide con la integración RK4 de d[A]/dt = −k[A] y se conserva [A] + [B]', () => {
    const rengFallos = rengComprobarEscenaN1(RENG_MODELO_DEMO_KIT, rengComprobarPrimerOrden)
    expect(rengFallos).toEqual([])
    expect(rengMuestrasEscenaN1(RENG_MODELO_DEMO_KIT).length).toBeGreaterThanOrEqual(40)
  })

  it('sabotaje: el mismo comprobador falla con un modelo roto (NaN), con k duplicada y con una magnitud ausente', () => {
    expect(rengComprobarEscenaN1(RENG_MODELO_DEMO_ROTO, rengComprobarPrimerOrden).length).toBeGreaterThan(0)
    const rengDobleK: RengModeloEscenaN1 = { ...RENG_MODELO_DEMO_KIT, lecturas: (rengV, rengT) => ({ ...RENG_MODELO_DEMO_KIT.lecturas(rengV, rengT), a: rengV.a0! * Math.exp(-2 * rengV.k! * rengT), b: rengV.a0! - rengV.a0! * Math.exp(-2 * rengV.k! * rengT) }) }
    expect(rengComprobarEscenaN1(rengDobleK, rengComprobarPrimerOrden).some((rengF) => /RK4/.test(rengF.detalle))).toBe(true)
    const rengSinB: RengModeloEscenaN1 = { ...RENG_MODELO_DEMO_KIT, lecturas: (rengV, rengT) => { const { b: _rengB, ...rengResto } = RENG_MODELO_DEMO_KIT.lecturas(rengV, rengT); return rengResto } }
    expect(rengLeerEscenaN1(rengSinB, rengValoresInicialesN1(rengSinB), 1).problemas.join()).toMatch(/falta la magnitud/)
    const rengSinPalabras: RengModeloEscenaN1 = { ...RENG_MODELO_DEMO_KIT, enPalabras: () => '' }
    expect(rengLeerEscenaN1(rengSinPalabras, rengValoresInicialesN1(rengSinPalabras), 1).problemas.join()).toMatch(/En palabras/)
    const rengLanza: RengModeloEscenaN1 = { ...RENG_MODELO_DEMO_KIT, lecturas: () => { throw new Error('modelo roto') } }
    expect(rengLeerEscenaN1(rengLanza, rengValoresInicialesN1(rengLanza), 0).problemas.join()).toMatch(/modelo roto/)
  })

  it('sabotaje del contrato: sin límites, sin unidad, id fuera de patrón, intervalo vacío o escena temporal sin t se rechazan', () => {
    const rengM = RENG_MODELO_DEMO_KIT
    expect(rengValidarModeloEscenaN1({ ...rengM, ficha: { ...rengM.ficha, limites: [] } }).join()).toMatch(/límites/)
    expect(rengValidarModeloEscenaN1({ ...rengM, parametros: [{ ...rengM.parametros[0]!, unidad: '' }, rengM.parametros[1]!] }).join()).toMatch(/sin unidad/)
    expect(rengValidarModeloEscenaN1({ ...rengM, id: 'Escena Mal' }).join()).toMatch(/id fuera de patrón/)
    expect(rengValidarModeloEscenaN1({ ...rengM, parametros: [{ ...rengM.parametros[0]!, min: 2, max: 1 }, rengM.parametros[1]!] }).join()).toMatch(/intervalo/)
    expect(rengValidarModeloEscenaN1({ ...rengM, magnitudes: rengM.magnitudes.filter((rengG) => rengG.clave !== 't') }).join()).toMatch(/tiempo t/)
    expect(rengValidarModeloEscenaN1({ ...rengM, ficha: { ...rengM.ficha, procedencia: [] } }).join()).toMatch(/procedencia/)
  })

  it('los controles acotan al intervalo y no aceptan valores no finitos; el tiempo avanza acotado y se detiene al final', () => {
    expect(rengAjustarValorN1(RENG_MODELO_DEMO_KIT, 'k', 5, 0.1)).toBe(1)
    expect(rengAjustarValorN1(RENG_MODELO_DEMO_KIT, 'k', -1, 0.1)).toBe(0.01)
    expect(rengAjustarValorN1(RENG_MODELO_DEMO_KIT, 'k', Number.NaN, 0.1)).toBe(0.1)
    expect(rengAjustarValorN1(RENG_MODELO_DEMO_KIT, 'inexistente', 3, 0.1)).toBe(0.1)
    expect(rengTiempoSiguienteN1(RENG_MODELO_DEMO_KIT, 0, 0.1)).toBeCloseTo(1, 12)
    expect(rengTiempoSiguienteN1(RENG_MODELO_DEMO_KIT, 0, 30)).toBeCloseTo(2.5, 12)
    expect(rengTiempoSiguienteN1(RENG_MODELO_DEMO_KIT, 59.9, 0.25)).toBe(60)
    expect(rengValoresDeCasoN1(RENG_MODELO_DEMO_KIT, rengValoresInicialesN1(RENG_MODELO_DEMO_KIT), { nombre: 'x', valores: { k: 99 } }).k).toBe(1)
    expect(rengFormatoLecturaN1(0.5, 3)).toBe('0,5')
    expect(rengFormatoLecturaN1(Number.NaN, 3)).toBe('—')
  })

  it('las escenas son libres: el kit y la vista no leen progreso, nivel de práctica ni almacenamiento', () => {
    for (const rengRuta of ['src/renderer/modules/simulador-quimica/escenas-n1/kit.ts', 'src/renderer/modules/simulador-quimica/escenas-n1/tipos.ts', 'src/renderer/modules/simulador-quimica/escenas-n1/registro.ts', 'src/renderer/modules/simulador-quimica/vista/EscenaN1.tsx']) {
      const rengCodigo = readFileSync(join(RENG_RAIZ, rengRuta), 'utf8')
      expect(rengCodigo, rengRuta).not.toMatch(/localStorage|sessionStorage|ciencia\.|practicas-n1\/progreso|practica\/niveles|three|innerHTML/)
    }
  })
})

describe('Entrega 0 · kit de escenas N1: vista', () => {
  it('la vista muestra controles con unidad, reinicio a t = 0, lecturas con unidad, «En palabras», gráfica y ficha con límites', async () => {
    const RengEscenaN1 = await rengVistaEscena()
    const rengHtml = renderToStaticMarkup(createElement(RengEscenaN1, { modelo: RENG_MODELO_DEMO_KIT }))
    expect(rengHtml).toContain('data-escena-n1="demo-kit-primer-orden"')
    expect(rengHtml).toMatch(/Concentración inicial de A<span class="muted"> \(mol\/L\)/)
    expect(rengHtml).toContain('Reiniciar (t = 0)')
    expect(rengHtml).toContain('data-accion="iniciar"')
    expect(rengHtml).toMatch(/data-magnitud="a"><dt>Concentración de A<\/dt><dd>1 mol\/L/)
    expect(rengHtml).toMatch(/<output data-en-palabras[^>]*>A los 0,0 s queda 1,00 mol\/L de A/)
    expect(rengHtml).toContain('data-figura="1"')
    expect(rengHtml).toContain('data-casos')
    expect(rengHtml).toContain('Límites del modelo')
    expect(rengHtml).toContain('Modelo idealizado')
    expect(rengHtml).not.toContain('data-escena-problema')
  })

  it('sabotaje: con el modelo roto la vista avisa del problema y no dibuja gráfica con NaN', async () => {
    const RengEscenaN1 = await rengVistaEscena()
    const rengHtml = renderToStaticMarkup(createElement(RengEscenaN1, { modelo: RENG_MODELO_DEMO_ROTO }))
    expect(rengHtml).toContain('data-escena-problema')
    expect(rengHtml).not.toContain('data-figura=')
    expect(rengHtml).not.toMatch(/NaN/)
  })
})
