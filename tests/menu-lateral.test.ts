import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RENG_ACCESOS_LABORATORIO } from '../src/renderer/modules/laboratorio/accesos'
import { RENG_MENU_LABORATORIO } from '../src/renderer/modules/laboratorio/menu'
import { RENG_ACCESOS_QUIMICA } from '../src/renderer/modules/simulador-quimica/accesos'
import { RENG_MENU_QUIMICA } from '../src/renderer/modules/simulador-quimica/menu'
import { RENG_EXPERIMENTOS_QUIMICA, RENG_NAV_INICIAL, rengNavDeSubruta } from '../src/renderer/modules/simulador-quimica/navegacion'
import { rengAnfitrionEnCurso, rengClaveEnCurso, rengClaveEntrada, rengEntradaActiva, rengEntradasPlanas, rengGrupoContiene, rengProblemasMenu, rengRutaLegible } from '../src/renderer/shell/nucleo/menu'

const RENG_MODULOS = ['simulador-quimica', 'laboratorio', 'tabla-periodica']
const rengExiste = (rengId: string): boolean => RENG_MODULOS.includes(rengId)
const rengAbreQuimica = (rengSub: string | null): boolean => rengSub === null || rengNavDeSubruta(RENG_NAV_INICIAL, rengSub) !== RENG_NAV_INICIAL
const rengAbreLaboratorio = (rengSub: string | null): boolean => rengSub === null || RENG_ACCESOS_LABORATORIO.some((rengA) => rengA.sub === rengSub)

describe('cada entrada del menú abre algo que su módulo sabe abrir', () => {
  it('Química y Laboratorio sin subrutas desconocidas, claves repetidas ni anidación profunda', () => {
    expect(rengProblemasMenu('simulador-quimica', RENG_MENU_QUIMICA, rengAbreQuimica, rengExiste)).toEqual([])
    expect(rengProblemasMenu('laboratorio', RENG_MENU_LABORATORIO, rengAbreLaboratorio, rengExiste)).toEqual([])
  })
  it('detecta una subruta que el módulo no abre y un módulo enlazado que no existe', () => {
    const rengMalo = [{ sub: 'no-existe', nombre: 'X' }, { sub: null, nombre: 'Y', modulo: 'traductor' }]
    expect(rengProblemasMenu('simulador-quimica', rengMalo, rengAbreQuimica, rengExiste)).toHaveLength(2)
  })
  it('Química: catálogo, temario, aprender, prácticas por nivel, simulación (los once, con el nombre del buscador), casos y mesa al final; la tabla periódica va aparte', () => {
    expect(RENG_MENU_QUIMICA.map((rengE) => rengE.nombre)).toEqual(['Catálogo', 'Temario', 'Aprender', 'Prácticas por nivel', 'Simulación', 'Casos reales', 'Mesa molecular', 'Tabla periódica'])
    expect(RENG_MENU_QUIMICA.filter((rengE) => !rengE.modulo).at(-1)!.nombre).toBe('Mesa molecular')
    expect(RENG_MENU_QUIMICA.at(-1)!.seccion).toBe('Consulta')
    const rengExp = RENG_MENU_QUIMICA.find((rengE) => rengE.nombre === 'Simulación')!
    expect(rengExp.hijos!.map((rengH) => rengH.sub)).toEqual([...RENG_EXPERIMENTOS_QUIMICA])
    for (const rengH of rengExp.hijos!) expect(rengH.nombre).toBe(RENG_ACCESOS_QUIMICA.find((rengA) => rengA.sub === rengH.sub)!.nombre)
    expect(rengExp.hijos!.map((rengH) => rengH.nombre)).toEqual(['Ácidos y bases', 'Mezcla ácido–base', 'Velocidad de reacción', 'Equilibrio químico', 'Energía de reacción', 'Dilución con material de vidrio', 'Colorimetría: curva de calibración', 'Solubilidad: Q frente a Ksp', 'Electroquímica: celda galvánica', 'Isómeros: comparación geométrica', 'Mesa libre: combinar sustancias'])
    expect(RENG_MENU_QUIMICA.at(-1)!.modulo).toBe('tabla-periodica')
  })
  it('Laboratorio agrupa por tarea y cubre cada herramienta una sola vez', () => {
    const rengSecciones = [...new Set(RENG_MENU_LABORATORIO.map((rengE) => rengE.seccion))]
    expect(rengSecciones).toEqual(['Cuaderno', 'Mediciones y datos'])
    expect(RENG_MENU_LABORATORIO.map((rengE) => rengE.sub).sort()).toEqual(RENG_ACCESOS_LABORATORIO.map((rengA) => rengA.sub).sort())
    for (const rengE of RENG_MENU_LABORATORIO) expect(RENG_ACCESOS_LABORATORIO.find((rengA) => rengA.sub === rengE.sub)!.grupo).toBe(`Laboratorio · ${rengE.seccion}`)
  })
})

describe('entrada activa según la ruta', () => {
  const RENG_Q = 'simulador-quimica'
  it('subruta exacta, `tambien` y la vista inicial', () => {
    expect(rengEntradaActiva(RENG_Q, RENG_MENU_QUIMICA, { id: RENG_Q, sub: 'acidobase' })).toBe(`${RENG_Q}/acidobase`)
    expect(rengEntradaActiva(RENG_Q, RENG_MENU_QUIMICA, { id: RENG_Q, sub: 'enlaces' })).toBe(`${RENG_Q}/mesa`)
    expect(rengEntradaActiva(RENG_Q, RENG_MENU_QUIMICA, { id: RENG_Q, sub: null })).toBe(`${RENG_Q}/catalogo`)
    expect(rengEntradaActiva(RENG_Q, RENG_MENU_QUIMICA, { id: RENG_Q, sub: 'experimentos' })).toBe(`${RENG_Q}/simulacion`)
    expect(rengEntradaActiva(RENG_Q, RENG_MENU_QUIMICA, { id: RENG_Q, sub: 'ejercicios' })).toBe(`${RENG_Q}/practicas`)
    expect(rengEntradaActiva(RENG_Q, RENG_MENU_QUIMICA, { id: RENG_Q, sub: 'practicas' })).toBe(`${RENG_Q}/practicas`)
    expect(rengEntradaActiva(RENG_Q, RENG_MENU_QUIMICA, { id: RENG_Q, sub: 'aprender' })).toBe(`${RENG_Q}/aprender`)
    expect(rengEntradaActiva(RENG_Q, RENG_MENU_QUIMICA, { id: RENG_Q, sub: 'casos' })).toBe(`${RENG_Q}/casos`)
    expect(rengEntradaActiva('laboratorio', RENG_MENU_LABORATORIO, { id: 'laboratorio', sub: null })).toBe('laboratorio/cuaderno')
    expect(rengEntradaActiva('laboratorio', RENG_MENU_LABORATORIO, { id: 'laboratorio', sub: 'datos' })).toBe('laboratorio/datos')
  })
  it('la tabla periódica, enlazada desde Química, marca su entrada y su grupo', () => {
    const rengRuta = { id: 'tabla-periodica', sub: null }
    expect(rengEntradaActiva(RENG_Q, RENG_MENU_QUIMICA, rengRuta)).toBe('>tabla-periodica')
    expect(rengGrupoContiene(RENG_Q, RENG_MENU_QUIMICA, rengRuta)).toBe(true)
    expect(rengGrupoContiene('laboratorio', RENG_MENU_LABORATORIO, rengRuta)).toBe(false)
  })
  it('otra ruta no marca nada en el grupo', () => {
    expect(rengEntradaActiva(RENG_Q, RENG_MENU_QUIMICA, { id: 'inicio', sub: null })).toBeNull()
    expect(rengEntradaActiva(RENG_Q, RENG_MENU_QUIMICA, { id: RENG_Q, sub: 'desconocida' })).toBeNull()
  })
  it('claves únicas en cada grupo', () => {
    for (const [rengId, rengMenu] of [
      [RENG_Q, RENG_MENU_QUIMICA],
      ['laboratorio', RENG_MENU_LABORATORIO]
    ] as const) {
      const rengClaves = rengEntradasPlanas(rengMenu).map((rengE) => rengClaveEntrada(rengId, rengE))
      expect(new Set(rengClaves).size).toBe(rengClaves.length)
    }
  })
})

describe('cabecera: lo que se ve', () => {
  it('nombra la sección o el padre y el destino', () => {
    expect(rengRutaLegible('simulador-quimica', RENG_MENU_QUIMICA, RENG_ACCESOS_QUIMICA, { id: 'simulador-quimica', sub: 'acidobase' })).toBe('Simulación › Ácidos y bases')
    expect(rengRutaLegible('simulador-quimica', RENG_MENU_QUIMICA, RENG_ACCESOS_QUIMICA, { id: 'simulador-quimica', sub: 'formulacion' })).toBe('Mesa molecular')
    expect(rengRutaLegible('simulador-quimica', RENG_MENU_QUIMICA, RENG_ACCESOS_QUIMICA, { id: 'simulador-quimica', sub: 'ejercicios' })).toBe('Prácticas por nivel')
    expect(rengRutaLegible('laboratorio', RENG_MENU_LABORATORIO, RENG_ACCESOS_LABORATORIO, { id: 'laboratorio', sub: 'datos' })).toBe('Mediciones y datos › Datos y estadística')
    expect(rengRutaLegible('laboratorio', RENG_MENU_LABORATORIO, RENG_ACCESOS_LABORATORIO, { id: 'inicio', sub: null })).toBeNull()
  })
})

describe('regresiones sobre el código del menú', () => {
  const rengLeer = (rengP: string): string => readFileSync(join(import.meta.dirname, '..', rengP), 'utf8')
  it('las cabeceras de grupo despliegan con aria-expanded y aria-controls; las entradas marcan aria-current', () => {
    const rengApp = rengLeer('src/renderer/App.tsx')
    expect(rengApp).toMatch(/nav-grupo-cabecera/)
    expect(rengApp).toMatch(/aria-expanded=\{rengAbierto\}/)
    expect(rengApp).toMatch(/aria-controls=\{`nav-grupo-\$\{rengId\}`\}/)
    expect(rengApp).toMatch(/aria-current=\{rengEsActiva \? 'page' : undefined\}/)
    expect(rengApp).toMatch(/const RENG_ATAJOS = \['inicio', \.\.\.RENG_PRINCIPALES/)
    expect(rengApp).toMatch(/rengK === 'k'/)
  })
  it('las filas de navegación de la pantalla que repite el lateral están marcadas como redundantes', () => {
    expect(rengLeer('src/renderer/modules/simulador-quimica/View.tsx')).toMatch(/<RengDestinos [^>]*redundante>/)
    expect(rengLeer('src/renderer/modules/laboratorio/View.tsx')).toMatch(/className="nav-redundante"/)
    expect(rengLeer('src/renderer/styles/app.css')).toMatch(/\.app\[data-nav-lateral\] \.nav-redundante \{ display: none/)
  })
})
