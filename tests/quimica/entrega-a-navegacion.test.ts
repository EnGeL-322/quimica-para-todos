import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RENG_ACCESOS_QUIMICA } from '../../src/renderer/modules/simulador-quimica/accesos'
import { RENG_MENU_QUIMICA } from '../../src/renderer/modules/simulador-quimica/menu'
import { RENG_DESTINOS_QUIMICA, RENG_NAV_INICIAL, rengDescripcionNav, rengNavDeSubruta, rengSubrutaDeNav } from '../../src/renderer/modules/simulador-quimica/navegacion'
import { rengNivelesDeTema, RENG_TEMAS } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { rengResolverRuta } from '../../src/renderer/shell/nucleo/rutas'

const RENG_RAIZ = join(import.meta.dirname, '../../src/renderer/modules/simulador-quimica')
const rengLeer = (rengP: string): string => readFileSync(join(RENG_RAIZ, rengP), 'utf8')

describe('Entrega A: orden y nombres', () => {
  it('el menú, la fila de destinos y el buscador usan el mismo orden y los mismos nombres', () => {
    const rengDestinos = RENG_DESTINOS_QUIMICA.map((rengD) => rengD.id)
    expect(rengDestinos).toEqual(['catalogo', 'temario', 'aprender', 'practicas', 'simulacion', 'casos', 'mesa'])
    const rengMenu = RENG_MENU_QUIMICA.filter((rengE) => !rengE.modulo)
    expect(rengMenu.map((rengE) => rengE.nombre)).toEqual(RENG_DESTINOS_QUIMICA.map((rengD) => (rengD.id === 'aprender' ? 'Aprender' : rengD.nombre)))
    const rengAccesos = RENG_ACCESOS_QUIMICA.map((rengA) => rengA.sub)
    expect(rengAccesos.indexOf('catalogo')).toBeLessThan(rengAccesos.indexOf('aprender'))
    expect(rengAccesos.indexOf('aprender')).toBeLessThan(rengAccesos.indexOf('practicas'))
    expect(rengAccesos.indexOf('practicas')).toBeLessThan(rengAccesos.indexOf('simulacion'))
    expect(rengAccesos.indexOf('casos')).toBeLessThan(rengAccesos.indexOf('mesa'))
    expect(rengAccesos).not.toContain('ejercicios')
    expect(RENG_ACCESOS_QUIMICA.find((rengA) => rengA.sub === 'practicas')!.etiquetas).toContain('ejercicios')
  })
  it('la Mesa molecular es el último destino de Química y la tabla periódica sigue en Consulta', () => {
    expect(RENG_DESTINOS_QUIMICA.at(-1)!.id).toBe('mesa')
    expect(RENG_MENU_QUIMICA.at(-1)).toMatchObject({ modulo: 'tabla-periodica', seccion: 'Consulta' })
  })
  it('el título de cada destino coincide con el nombre visible', () => {
    expect(rengDescripcionNav(rengNavDeSubruta(RENG_NAV_INICIAL, 'practicas')).titulo).toBe('Prácticas por nivel')
    expect(rengDescripcionNav(rengNavDeSubruta(RENG_NAV_INICIAL, 'ejercicios')).titulo).toBe('Prácticas por nivel')
    expect(rengDescripcionNav(rengNavDeSubruta(RENG_NAV_INICIAL, 'aprender')).titulo).toBe('Aprender')
  })
})

describe('Entrega A: rutas antiguas y enlaces profundos', () => {
  const rengExiste = (rengId: string): boolean => rengId === 'simulador-quimica'
  it('las rutas con tema pasan la validación del shell (una sola subruta, hasta 41 caracteres)', () => {
    for (const rengTema of RENG_TEMAS) {
      for (const rengPrefijo of ['aprender-', 'practicas-', 'ejercicios-']) {
        const rengSub = `${rengPrefijo}${rengTema.id}`
        expect(rengResolverRuta(`#/simulador-quimica/${rengSub}`, rengExiste).ruta.sub, rengSub).toBe(rengSub)
      }
    }
  })
  it('cada enlace profundo identifica el tema y el destino; la subruta normalizada no lo conserva', () => {
    for (const rengTema of RENG_TEMAS) {
      const rengAntiguo = rengNavDeSubruta(RENG_NAV_INICIAL, `ejercicios-${rengTema.id}`)
      expect(rengAntiguo.destino).toBe('practicas')
      expect(rengAntiguo.tema).toBe(rengTema.id)
      expect(rengSubrutaDeNav(rengAntiguo)).toBe('practicas')
      expect(rengNavDeSubruta(RENG_NAV_INICIAL, `aprender-${rengTema.id}`)).toMatchObject({ destino: 'aprender', tema: rengTema.id })
    }
  })
  it('la pantalla consume el tema una sola vez y valida que exista en el banco', () => {
    const rengVista = rengLeer('View.tsx')
    expect(rengVista).toMatch(/rengTemaPorId\(rengNav\.tema\)/)
    expect(rengVista).toMatch(/\{ \.\.\.rengN, tema: null \}/)
  })
  it('la página de inicio apunta a la ruta nueva', () => {
    const rengInicio = readFileSync(join(import.meta.dirname, '../../src/renderer/inicio.ts'), 'utf8')
    expect(rengInicio).toMatch(/sub: 'practicas'/)
    expect(rengInicio).not.toMatch(/sub: 'ejercicios'/)
  })
})

describe('Entrega A: filtros y encabezados sin duplicar', () => {
  it('el filtro por nivel solo agrupa temas que tienen práctica en ese nivel', () => {
    const rengPorNivel = (rengN: 'preuniversitario' | 'universitario' | 'quimico' | 'cientifico'): string[] => RENG_TEMAS.filter((rengT) => rengNivelesDeTema(rengT.id).includes(rengN)).map((rengT) => rengT.id)
    expect(rengPorNivel('preuniversitario').length).toBeGreaterThan(rengPorNivel('cientifico').length)
    expect(rengPorNivel('cientifico')).toContain('calibracion')
    expect(rengPorNivel('cientifico')).not.toContain('grupos')
  })
  it('Prácticas no repite el filtro de nivel (ya tiene «Nivel preferido») y la fila global solo aparece donde hace falta', () => {
    expect(rengLeer('modos/SelectorEjercicios.tsx')).toMatch(/filtroNivel=\{false\}/)
    expect(rengLeer('View.tsx')).toMatch(/rengDestino === 'casos' &&/)
  })
  it('Catálogo, Aprender y Prácticas titulan distinto su pantalla', () => {
    const rengTitulos = ['modos/Catalogo.tsx', 'modos/Aprender.tsx', 'modos/SelectorEjercicios.tsx'].map((rengF) => rengLeer(rengF).match(/<h2>([^<]+)<\/h2>/)![1])
    expect(new Set(rengTitulos).size).toBe(3)
  })
})

describe('Entrega A: rendimiento y estabilidad', () => {
  it('los bucles de animación no admiten un paso de tiempo negativo (el primer fotograma puede ser anterior a performance.now())', () => {
    expect(rengLeer('modos/simulacion/EscenaCinetica.tsx')).toMatch(/Math\.max\(0, rengAhora - rengPrevio\)/)
    expect(rengLeer('modos/simulacion/EscenaCinetica.tsx')).toMatch(/Math\.max\(0, Math\.min\(rengTmax/)
    expect(rengLeer('vista/useSecuencia.ts')).toMatch(/Math\.max\(0, Math\.min\(0\.05/)
  })
  it('el perfil de pruebas solo se admite sin empaquetar y con una ruta absoluta', () => {
    const rengMain = readFileSync(join(import.meta.dirname, '../../src/main/index.ts'), 'utf8')
    expect(rengMain).toMatch(/!app\.isPackaged && !!RENG_PERFIL_PRUEBA && isAbsolute\(RENG_PERFIL_PRUEBA\)/)
  })
})
