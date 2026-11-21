import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import temml from 'temml'
import { describe, expect, it } from 'vitest'
import { rengTexDeFormulaQuimica } from '../../src/renderer/lib/ecuaciones/formula'
import { RENG_LONGITUD_MAXIMA_TEX, RENG_OPCIONES_TEMML, rengRenderizarTexATexto, rengTextoDeMathml, rengValidarFormulaQuimica, rengValidarTex } from '../../src/renderer/lib/ecuaciones/validarTex'
import { RENG_LECCIONES_GASES } from '../../src/renderer/modules/simulador-quimica/aprender/n1/gases/lecciones'
import { RENG_LECCIONES_N1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/registro'

const RENG_RAIZ = join(import.meta.dirname, '..', '..')
const rengLeer = (rengRuta: string): string => readFileSync(join(RENG_RAIZ, rengRuta), 'utf8').replace(/\r\n/g, '\n')

const RENG_SUBINDICES: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', '²': '2', ū: 'u' }

function rengHuellaSimbolos(rengTexto: string): string {
  return [...rengTexto.normalize('NFC')]
    .map((rengC) => RENG_SUBINDICES[rengC] ?? rengC)
    .join('')
    .replace(/[\s ⁡-⁤·⋅()/√_^¯‾̄̅{}]/g, '')
    .replace(/−/g, '-')
    .replace(/…|⋯/g, '...')
}

function rengTexCoincideConTexto(rengTex: string, rengTexto: string): boolean {
  return rengHuellaSimbolos(rengTextoDeMathml(rengRenderizarTexATexto(rengTex, true))) === rengHuellaSimbolos(rengTexto)
}

function rengDerivarCssLocal(): string {
  const rengOriginal = rengLeer('node_modules/temml/dist/Temml-Local.css')
  const rengPila = `"Cambria Math", 'STIXTwoMath-Regular', 'NotoSansMath-Regular', math`
  return rengOriginal.replace(/^\/\*[\s\S]*?\*\/\n\n@font-face \{[\s\S]*?\}\n\n/, '').replace(/font-family: "?Temml"?;/g, `font-family: ${rengPila};`)
}

const RENG_RUTA_ECUACION = '../../src/renderer/modules/simulador-quimica/vista/tex/EcuacionTex'
type RengComponente = (rengP: Record<string, unknown>) => ReturnType<typeof createElement>
const rengComponentes = async (): Promise<{ RengEcuacionTex: RengComponente; RengFormulaQuimica: RengComponente }> => (await import(/* @vite-ignore */ RENG_RUTA_ECUACION)) as { RengEcuacionTex: RengComponente; RengFormulaQuimica: RengComponente }

const RENG_HUELLA_TEXTOS_B08 = '666b6a5af3bda20eafca4febeb3072b42731c83b576884c87d08611bc2f473fc'

describe('Entrega 0 · Temml 0.14.0 y mhchem', () => {
  it('temml está fijado a la versión exacta 0.14.0 en package.json y en el lock, como dependencia de producción', () => {
    const rengPaquete = JSON.parse(rengLeer('package.json')) as { dependencies: Record<string, string>; devDependencies: Record<string, string> }
    expect(rengPaquete.dependencies.temml).toBe('0.14.0')
    expect(rengPaquete.devDependencies.temml).toBeUndefined()
    const rengBloqueo = JSON.parse(rengLeer('package-lock.json')) as { packages: Record<string, { version: string; dev?: boolean; license: string }> }
    expect(rengBloqueo.packages['node_modules/temml']?.version).toBe('0.14.0')
    expect(rengBloqueo.packages['node_modules/temml']?.dev).toBeUndefined()
    expect(JSON.parse(rengLeer('node_modules/temml/package.json')).version).toBe('0.14.0')
  })

  it('la compilación ESM de temml trae \\ce y \\pu (mhchem) sin cargar nada más', () => {
    for (const rengTex of [String.raw`\ce{2H2 + O2 -> 2H2O}`, String.raw`\ce{N2(g) + 3H2(g) <=> 2NH3(g)}`, String.raw`\ce{SO4^2-}`, String.raw`\pu{8.314 J mol^-1 K^-1}`]) {
      expect(rengValidarTex(rengTex), rengTex).toEqual({ ok: true })
    }
    expect(rengHuellaSimbolos(rengTextoDeMathml(rengRenderizarTexATexto(String.raw`\ce{SO4^2-}`)))).toContain('SO42')
  })

  it('las licencias de temml (MIT) y de mhchem (Apache 2.0) quedan registradas en licencias/', () => {
    const rengAvisos = rengLeer('licencias/AVISOS-TERCEROS.txt')
    expect(rengAvisos).toContain('temml 0.14.0 — licencia MIT')
    expect(rengAvisos).toContain('Copyright (c) 2020 Ron Kok')
    expect(rengAvisos).toContain('The MathJax Consortium')
    expect(rengAvisos).toContain('Martin Hensel')
    expect(rengAvisos).toContain('Licencia Apache 2.0 (parte mhchem incluida en temml)')
    expect(rengAvisos).toContain('TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION')
    const rengApache = rengLeer('licencias/LICENCIA-APACHE-2.0.txt')
    expect(rengApache).toMatch(/Apache License\s+Version 2\.0, January 2004/)
    expect(rengApache.trim().endsWith('END OF TERMS AND CONDITIONS')).toBe(true)
    expect(rengLeer('node_modules/temml/dist/temml.mjs')).toContain('Licensed under the Apache License, Version 2.0')
    expect(rengLeer('licencias/PENDIENTES-ANTES-DE-DISTRIBUIR.md')).toContain('| 12 | temml 0.14.0')
  })
})

describe('Entrega 0 · validación de TeX y de fórmulas químicas', () => {
  it('opciones seguras: sin trust, sin anotaciones y con límite de expansión', () => {
    expect(RENG_OPCIONES_TEMML).toMatchObject({ trust: false, annotate: false, maxExpand: 200 })
    const rengSalida = temml.renderToString(String.raw`\href{https://ejemplo.invalido}{x}`, { ...RENG_OPCIONES_TEMML })
    expect(rengSalida).not.toMatch(/href="https/)
  })

  it('acepta TeX válido y rechaza vacío, demasiado largo, sintaxis rota y órdenes inexistentes con motivo estable', () => {
    expect(rengValidarTex(String.raw`\frac{P_1 V_1}{T_1}`)).toEqual({ ok: true })
    expect(rengValidarTex('   ')).toMatchObject({ ok: false, motivo: 'vacia' })
    expect(rengValidarTex('x'.repeat(RENG_LONGITUD_MAXIMA_TEX + 1))).toMatchObject({ ok: false, motivo: 'demasiado-larga' })
    expect(rengValidarTex(String.raw`\frac{a}{`)).toMatchObject({ ok: false, motivo: 'error-de-sintaxis' })
    expect(rengValidarTex(String.raw`\ordenquenoexiste{x}`)).toMatchObject({ ok: false, motivo: 'error-de-sintaxis' })
  })

  it('las fórmulas químicas solo admiten caracteres de fórmula (sin barras invertidas ni llaves) y se envuelven en \\ce', () => {
    expect(rengTexDeFormulaQuimica('H2O')).toBe(String.raw`\ce{H2O}`)
    expect(rengTexDeFormulaQuimica(' CuSO4 * 5H2O ')).toBe(String.raw`\ce{CuSO4 * 5H2O}`)
    expect(rengTexDeFormulaQuimica(String.raw`H2O}\href{x}{y`)).toBeNull()
    expect(rengTexDeFormulaQuimica('')).toBeNull()
    expect(rengValidarFormulaQuimica('2H2 + O2 -> 2H2O')).toEqual({ ok: true })
    expect(rengValidarFormulaQuimica(String.raw`\alpha`)).toMatchObject({ ok: false, motivo: 'formula-no-valida' })
  })

  it('el CSS local es exactamente la derivación del CSS de temml sin la fuente Temml.woff2', () => {
    const rengLocal = rengLeer('src/renderer/lib/ecuaciones/temml-local.css')
    const rengCuerpo = rengLocal.replace(/^\/\*[\s\S]*?\*\/\n\n/, '')
    expect(rengCuerpo).toBe(rengDerivarCssLocal())
    expect(rengCuerpo).not.toMatch(/@font-face|\.woff2?|url\(['"]?Temml/)
    expect(rengCuerpo).not.toMatch(/font-family:\s*"?Temml"?;/)
  })

  it('sabotaje: la derivación detecta un CSS que vuelve a traer la fuente', () => {
    const rengConFuente = rengLeer('node_modules/temml/dist/Temml-Local.css')
    expect(rengConFuente).toMatch(/@font-face/)
    expect(rengConFuente).not.toBe(rengDerivarCssLocal())
  })
})

describe('Entrega 0 · migración de las ecuaciones del bloque 8', () => {
  const rengEcuaciones = RENG_LECCIONES_GASES.flatMap((rengL) => rengL.formalizar.ecuaciones.map((rengQ, rengI) => ({ leccion: rengL, ecuacion: rengQ, numero: `${rengL.bloque}.${rengL.posicion}.${rengI + 1}` })))

  it('los textos legibles (nombre, texto y lectura) son byte a byte los de antes de la migración', () => {
    const rengTextos = rengEcuaciones.map(({ ecuacion: rengQ }) => [rengQ.nombre, rengQ.texto, rengQ.lectura])
    expect(rengTextos).toHaveLength(48)
    expect(createHash('sha256').update(JSON.stringify(rengTextos), 'utf8').digest('hex')).toBe(RENG_HUELLA_TEXTOS_B08)
  })

  it('cada ecuación del bloque 8 tiene TeX válido, sin marca de error, y numeración única', () => {
    const rengNumeros = new Set<string>()
    for (const { ecuacion: rengQ, numero: rengN } of rengEcuaciones) {
      expect(rengQ.tex, rengN).toBeTruthy()
      expect(rengValidarTex(rengQ.tex!), `${rengN}: ${rengQ.tex}`).toEqual({ ok: true })
      expect(rengNumeros.has(rengN)).toBe(false)
      rengNumeros.add(rengN)
    }
  })

  it('el TeX de cada ecuación dice lo mismo que su texto (mismos símbolos en el mismo orden)', () => {
    for (const { ecuacion: rengQ, numero: rengN } of rengEcuaciones) expect(rengTexCoincideConTexto(rengQ.tex!, rengQ.texto), `${rengN}: «${rengQ.texto}» frente a ${rengQ.tex}`).toBe(true)
  })

  it('sabotajes: numerador y denominador intercambiados, un subíndice cambiado o un TeX roto se detectan', () => {
    expect(rengTexCoincideConTexto(String.raw`P_2 = \frac{V_2}{P_1 \cdot V_1}`, 'P₂ = P₁ · V₁ / V₂')).toBe(false)
    expect(rengTexCoincideConTexto(String.raw`P_1 \cdot V_2 = P_2 \cdot V_1`, 'P₁ · V₁ = P₂ · V₂')).toBe(false)
    expect(rengTexCoincideConTexto(String.raw`\rho = \frac{P \cdot M}{R \cdot T}`, 'ρ = P · M / (R · T)')).toBe(true)
    expect(rengValidarTex(String.raw`\rho = \frac{P \cdot M}{R \cdot T`)).toMatchObject({ ok: false })
  })

  it('las lecciones sin TeX siguen funcionando (el campo es opcional) y el registro no cambió de tamaño', () => {
    expect(RENG_LECCIONES_N1.length).toBeGreaterThanOrEqual(20)
    for (const rengL of RENG_LECCIONES_N1) for (const rengQ of rengL.formalizar.ecuaciones) expect(rengQ.tex === null || typeof rengQ.tex === 'string').toBe(true)
  })
})

describe('Entrega 0 · componente de ecuación accesible', () => {
  it('antes de cargar Temml muestra el texto legible (nunca queda vacío) y el número de la ecuación', async () => {
    const { RengEcuacionTex } = await rengComponentes()
    const rengHtml = renderToStaticMarkup(createElement(RengEcuacionTex, { tex: String.raw`\rho = \frac{m}{V}`, texto: 'ρ = m / V', bloque: true, numero: '8.1.1' }))
    expect(rengHtml).toContain('data-ecuacion="cargando"')
    expect(rengHtml).toMatch(/class="q-ec-texto"[^>]*>ρ = m \/ V</)
    expect(rengHtml).toContain('(8.1.1)')
  })

  it('en modo texto no se carga MathML y el texto es visible; una fórmula rechazada muestra su texto legible', async () => {
    const { RengEcuacionTex, RengFormulaQuimica } = await rengComponentes()
    expect(renderToStaticMarkup(createElement(RengEcuacionTex, { tex: 'x', texto: 'x legible', bloque: true, modoTexto: true }))).toContain('data-ecuacion="texto"')
    const rengRechazada = renderToStaticMarkup(createElement(RengFormulaQuimica, { formula: String.raw`H2O}\href{x}{y`, texto: 'H₂O', bloque: true }))
    expect(rengRechazada).toContain('H₂O')
  })

  it('Temml no entra en el fragmento principal: el componente lo importa de forma diferida', () => {
    const rengComp = rengLeer('src/renderer/modules/simulador-quimica/vista/tex/EcuacionTex.tsx')
    expect(rengComp).toContain("import('@/lib/ecuaciones/dibujar')")
    expect(rengComp).not.toMatch(/from '[^']*(temml|validarTex|dibujar)'/)
    expect(rengLeer('src/renderer/lib/ecuaciones/formula.ts')).not.toContain('temml')
  })
})
