import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RENG_TEMAS } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { RENG_FICHAS_TEMA, RENG_MINIATURA_ESCENA, RENG_MINIATURAS_RAMA, rengFiltrarTemas, rengNormalizarBusqueda, rengPreguntaDeTema } from '../../src/renderer/modules/simulador-quimica/practica/fichasTema'
import { RENG_ESCENAS } from '../../src/renderer/modules/simulador-quimica/practica/modelosSimulacion'
import { RENG_RAMAS } from '../../src/renderer/modules/simulador-quimica/practica/tipos'
import { RENG_NOMBRES_MINIATURA, rengUrlMiniatura, rengUrlMiniaturaRama, rengUrlMiniaturaTema } from '../../src/renderer/modules/simulador-quimica/vista/miniaturasTema'

const RENG_CARPETA = join(import.meta.dirname, '../../src/renderer/modules/simulador-quimica/miniaturas')
const rengIds = (rengTemas: ReadonlyArray<{ id: string }>): string[] => rengTemas.map((rengT) => rengT.id)

describe('fichas de los temas de ejercicios', () => {
  it('hay una ficha por cada uno de los 22 temas del banco y ninguna de sobra', () => {
    expect(RENG_TEMAS).toHaveLength(22)
    expect(Object.keys(RENG_FICHAS_TEMA).sort()).toEqual(rengIds(RENG_TEMAS).sort())
  })

  it('cada ficha tiene una pregunta breve, palabras clave sin repetir y una miniatura propia', () => {
    for (const rengT of RENG_TEMAS) {
      const rengF = RENG_FICHAS_TEMA[rengT.id]!
      expect(rengF.pregunta.startsWith('¿') && rengF.pregunta.endsWith('?'), rengT.id).toBe(true)
      expect(rengF.pregunta.length, rengT.id).toBeLessThan(80)
      expect(rengPreguntaDeTema(rengT)).toBe(rengF.pregunta)
      expect(new Set(rengF.claves).size, rengT.id).toBe(rengF.claves.length)
      expect(rengF.claves.every((rengC) => rengC === rengNormalizarBusqueda(rengC)), `${rengT.id}: claves sin tildes ni mayúsculas`).toBe(true)
      expect(rengF.miniatura, rengT.id).toBe(rengT.id)
    }
  })

  it('las preguntas no repiten el nombre del tema ni contienen respuestas numéricas', () => {
    for (const rengT of RENG_TEMAS) {
      const rengP = RENG_FICHAS_TEMA[rengT.id]!.pregunta
      expect(rengNormalizarBusqueda(rengP), rengT.id).not.toBe(rengNormalizarBusqueda(rengT.nombre))
      expect(/\d/.test(rengP), rengT.id).toBe(false)
    }
  })
})

describe('búsqueda y filtro por rama del selector', () => {
  it('encuentra los ejemplos del encargo', () => {
    expect(rengIds(rengFiltrarTemas('ácidos', null))).toEqual(expect.arrayContaining(['ph', 'valoracion', 'formular-nombrar']))
    expect(rengIds(rengFiltrarTemas('isomería', null))).toContain('isomeria')
    expect(rengIds(rengFiltrarTemas('redox', null))).toEqual(expect.arrayContaining(['redox', 'oxidacion']))
    expect(rengIds(rengFiltrarTemas('valoración', null))).toContain('valoracion')
  })

  it('ignora tildes, mayúsculas y espacios sobrantes; todas las palabras deben aparecer', () => {
    expect(rengIds(rengFiltrarTemas('  ISOMERIA ', null))).toEqual(rengIds(rengFiltrarTemas('isomería', null)))
    expect(rengIds(rengFiltrarTemas('ácido base', null))).toEqual(expect.arrayContaining(['ph', 'valoracion']))
    expect(rengIds(rengFiltrarTemas('isomería equilibrio', null))).toEqual([])
  })

  it('sin texto ni rama devuelve los 22 temas; cada rama devuelve los suyos; el texto se combina con la rama', () => {
    expect(rengFiltrarTemas('', null)).toHaveLength(22)
    expect(rengFiltrarTemas('   ', null)).toHaveLength(22)
    for (const rengR of RENG_RAMAS) expect(rengIds(rengFiltrarTemas('', rengR.id)), rengR.id).toEqual(rengIds(RENG_TEMAS.filter((rengT) => rengT.rama === rengR.id)))
    expect(rengIds(rengFiltrarTemas('ácidos', 'analitica')).sort()).toEqual(['ph', 'valoracion'])
    expect(rengFiltrarTemas('isomería', 'general')).toEqual([])
  })

  it('un texto sin coincidencias no devuelve nada', () => {
    expect(rengFiltrarTemas('zzzz-no-existe', null)).toEqual([])
  })
})

describe('miniaturas locales', () => {
  const rengArchivos = readdirSync(RENG_CARPETA).filter((rengN) => rengN.endsWith('.svg'))

  it('hay una miniatura por tema y una de respaldo por rama, sin archivos huérfanos', () => {
    const rengEsperadas = [...Object.values(RENG_FICHAS_TEMA).map((rengF) => rengF.miniatura), ...Object.values(RENG_MINIATURAS_RAMA)].sort()
    expect(rengArchivos.map((rengN) => rengN.slice(0, -4)).sort()).toEqual(rengEsperadas)
    expect(Object.keys(RENG_MINIATURAS_RAMA).sort()).toEqual(RENG_RAMAS.map((rengR) => rengR.id).sort())
  })

  it('las cinco escenas de simulación reutilizan una miniatura existente de su rama', () => {
    expect(Object.keys(RENG_MINIATURA_ESCENA).sort()).toEqual([...RENG_ESCENAS].sort())
    for (const rengE of RENG_ESCENAS) {
      const rengM = RENG_MINIATURA_ESCENA[rengE]
      expect(existsSync(join(RENG_CARPETA, `${rengM.miniatura}.svg`)), rengE).toBe(true)
      expect(RENG_FICHAS_TEMA[rengM.miniatura]?.miniatura ?? rengM.miniatura, rengE).toBe(rengM.miniatura)
    }
  })

  it('todas son SVG autónomos de 320 × 180, ligeros y sin scripts, imágenes ni enlaces externos', () => {
    for (const rengN of rengArchivos) {
      const rengT = readFileSync(join(RENG_CARPETA, rengN), 'utf8')
      expect(rengT.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'), rengN).toBe(true)
      expect(rengT, rengN).toContain('viewBox="0 0 320 180"')
      expect(rengT, rengN).toContain('width="320" height="180"')
      expect(rengT, `${rengN}: firma de autoría`).toContain('ramiroengelbert')
      expect(statSync(join(RENG_CARPETA, rengN)).size, rengN).toBeLessThan(8000)
      expect(/<script|<image|<foreignObject|href=|xlink:|onload|onerror|url\((?!#)/i.test(rengT), rengN).toBe(false)
      expect((rengT.match(/<svg\b/g) ?? []).length - (rengT.match(/<\/svg>/g) ?? []).length, `${rengN}: etiquetas svg equilibradas`).toBe(0)
    }
  })

  it('la resolución del renderer devuelve una dirección para cada tema, escena y rama', () => {
    expect([...RENG_NOMBRES_MINIATURA].sort()).toEqual(rengArchivos.map((rengN) => rengN.slice(0, -4)).sort())
    for (const rengT of RENG_TEMAS) expect(rengUrlMiniaturaTema(rengT.id), rengT.id).toBeTruthy()
    for (const rengR of RENG_RAMAS) expect(rengUrlMiniaturaRama(rengR.id), rengR.id).toBeTruthy()
    expect(rengUrlMiniatura('no-existe')).toBeNull()
    expect(rengUrlMiniaturaTema('no-existe')).toBeNull()
  })
})
