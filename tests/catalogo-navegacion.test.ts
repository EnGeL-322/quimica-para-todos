import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RENG_ACCESOS_QUIMICA } from '../src/renderer/modules/simulador-quimica/accesos'
import { RENG_ACCESOS_LABORATORIO } from '../src/renderer/modules/laboratorio/accesos'
import { RENG_DESTINOS_QUIMICA, RENG_EXPERIMENTOS_QUIMICA, RENG_HERRAMIENTAS_MESA, RENG_NAV_INICIAL, rengNavDeSubruta, rengSubrutaDeNav, type RengNavQuimica } from '../src/renderer/modules/simulador-quimica/navegacion'

describe('accesos del buscador', () => {
  it('Química: cada acceso abre exactamente lo que nombra, venga de donde venga', () => {
    expect(RENG_ACCESOS_QUIMICA.length).toBeGreaterThan(5)
    const rengDesde: RengNavQuimica[] = [RENG_NAV_INICIAL, { destino: 'practicas', herramienta: 'reacciones', experimento: 'termo', tema: null }, { destino: 'simulacion', herramienta: 'enlaces', experimento: null, tema: null }]
    for (const rengA of RENG_ACCESOS_QUIMICA) {
      for (const rengNav of rengDesde) expect(rengSubrutaDeNav(rengNavDeSubruta(rengNav, rengA.sub)), rengA.sub).toBe(rengA.sub)
    }
  })
  it('Laboratorio: el cuaderno y el análisis de datos', () => {
    expect(RENG_ACCESOS_LABORATORIO.map((rengA) => rengA.sub)).toEqual(['cuaderno', 'datos'])
  })
  it('los dos destinos principales son Química y Laboratorio', () => {
    const RENG_MODULOS = join(import.meta.dirname, '../src/renderer/modules')
    for (const [rengId, rengCorto] of [['simulador-quimica', 'Química'], ['laboratorio', 'Laboratorio']] as const) {
      const rengT = readFileSync(join(RENG_MODULOS, rengId, 'index.ts'), 'utf8')
      expect(rengT, rengId).toMatch(/^\s*principal: true,$/m)
      expect(rengT, rengId).toContain(`nombreCorto: '${rengCorto}'`)
    }
    const rengOtros = ['tabla-periodica']
    for (const rengId of rengOtros) expect(readFileSync(join(RENG_MODULOS, rengId, 'index.ts'), 'utf8'), rengId).not.toMatch(/principal: true/)
  })
})

describe('navegación de Química', () => {
  it('siete destinos en una fila: Catálogo, Temario, Aprender, Prácticas por nivel, Simulación, Casos reales, Mesa molecular (al final)', () => {
    expect(RENG_DESTINOS_QUIMICA.map((rengD) => rengD.nombre)).toEqual(['Catálogo', 'Temario', 'Aprender', 'Prácticas por nivel', 'Simulación', 'Casos reales', 'Mesa molecular'])
    expect(RENG_NAV_INICIAL.destino).toBe('catalogo')
    expect(RENG_HERRAMIENTAS_MESA.map((rengH) => rengH.id)).toEqual(['explorar', 'enlaces', 'formulacion', 'reacciones'])
  })
  it('subruta → navegación → subruta es estable para todo lo que se puede abrir', () => {
    for (const rengSub of ['catalogo', 'simulacion', 'mesa', 'enlaces', 'formulacion', 'reacciones', ...RENG_EXPERIMENTOS_QUIMICA, 'casos', 'aprender', 'practicas', 'temario']) {
      expect(rengSubrutaDeNav(rengNavDeSubruta(RENG_NAV_INICIAL, rengSub)), rengSub).toBe(rengSub)
    }
    expect(rengSubrutaDeNav(rengNavDeSubruta(RENG_NAV_INICIAL, 'explorar'))).toBe('mesa')
  })
  it('lo desconocido o vacío no cambia nada; «mesa» abre Construir; la ruta antigua «experimentos» abre la Simulación y conserva la escena elegida', () => {
    const rengNav = rengNavDeSubruta(RENG_NAV_INICIAL, 'formulacion')
    expect(rengNavDeSubruta(rengNav, null)).toBe(rengNav)
    expect(rengNavDeSubruta(rengNav, 'no-existe')).toBe(rengNav)
    expect(rengNavDeSubruta(rengNavDeSubruta(rengNav, 'practicas'), 'mesa')).toEqual({ ...rengNav, destino: 'mesa', herramienta: 'explorar' })
    const rengCin = rengNavDeSubruta(rengNav, 'cinetica')
    expect(rengNavDeSubruta(rengNavDeSubruta(rengCin, 'practicas'), 'experimentos')).toEqual({ ...rengCin, destino: 'simulacion' })
    expect(rengNavDeSubruta(rengCin, 'simulacion')).toEqual({ ...rengCin, destino: 'simulacion', experimento: null })
    expect(rengNavDeSubruta(rengNav, 'catalogo').destino).toBe('catalogo')
  })
  it('la ruta antigua «ejercicios» abre Prácticas por nivel y su enlace profundo conserva el tema; «aprender-<tema>» y «practicas-<tema>» también', () => {
    expect(rengNavDeSubruta(RENG_NAV_INICIAL, 'ejercicios')).toEqual({ ...RENG_NAV_INICIAL, destino: 'practicas' })
    expect(rengNavDeSubruta(RENG_NAV_INICIAL, 'ejercicios-formular-nombrar')).toEqual({ ...RENG_NAV_INICIAL, destino: 'practicas', tema: 'formular-nombrar' })
    expect(rengNavDeSubruta(RENG_NAV_INICIAL, 'practicas-ph')).toEqual({ ...RENG_NAV_INICIAL, destino: 'practicas', tema: 'ph' })
    expect(rengNavDeSubruta(RENG_NAV_INICIAL, 'aprender-ajuste-cinetico')).toEqual({ ...RENG_NAV_INICIAL, destino: 'aprender', tema: 'ajuste-cinetico' })
    expect(rengNavDeSubruta(RENG_NAV_INICIAL, 'practicas-')).toBe(RENG_NAV_INICIAL)
    expect(rengSubrutaDeNav(rengNavDeSubruta(RENG_NAV_INICIAL, 'ejercicios'))).toBe('practicas')
  })
})
