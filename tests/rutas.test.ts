import { describe, expect, it } from 'vitest'
import { rengAnadirReciente, rengHaceCuanto, rengLeerRecientes, RENG_MAX_RECIENTES, type RengReciente } from '../src/renderer/shell/nucleo/recientes'
import { rengHashDe, rengResolverRuta, RENG_RUTAS_RETIRADAS } from '../src/renderer/shell/nucleo/rutas'

const RENG_MODULOS = new Set(['simulador-fisica', 'simulador-quimica', 'laboratorio', 'tabla-periodica', 'matematicas-fisica', 'visor-metadatos', 'limpiador-exif', 'escaner-red'])
const rengExiste = (rengId: string): boolean => RENG_MODULOS.has(rengId)

describe('resolverRuta', () => {
  it('vacío o «inicio» → Inicio', () => {
    for (const rengH of ['', '#', '#/', '#/inicio']) expect(rengResolverRuta(rengH, rengExiste)).toEqual({ ruta: { id: 'inicio', sub: null }, retirada: null, desconocida: false })
  })
  it('las rutas de siempre de los módulos que permanecen siguen abriendo el módulo', () => {
    for (const rengId of RENG_MODULOS) expect(rengResolverRuta(`#/${rengId}`, rengExiste).ruta).toEqual({ id: rengId, sub: null })
  })
  it('con subruta: módulo + subruta validada', () => {
    expect(rengResolverRuta('#/simulador-fisica/orbita', rengExiste).ruta).toEqual({ id: 'simulador-fisica', sub: 'orbita' })
    expect(rengResolverRuta('#/simulador-quimica/acidobase', rengExiste).ruta).toEqual({ id: 'simulador-quimica', sub: 'acidobase' })
    expect(rengResolverRuta('#/laboratorio/<script>', rengExiste).ruta).toEqual({ id: 'laboratorio', sub: null })
  })
  it('las funciones retiradas (Traductor, Editor de subtítulos) van a Inicio con aviso', () => {
    for (const [rengId, rengNombre] of Object.entries(RENG_RUTAS_RETIRADAS)) {
      for (const rengH of [`#/${rengId}`, `#/${rengId}/algo`]) {
        const rengR = rengResolverRuta(rengH, rengExiste)
        expect(rengR.ruta).toEqual({ id: 'inicio', sub: null })
        expect(rengR.retirada).toBe(rengNombre)
      }
    }
    expect(Object.keys(RENG_RUTAS_RETIRADAS).sort()).toEqual(['subtitulador', 'traductor'])
  })
  it('desconocido, mal formado o con escapes inválidos → Inicio, sin cargar nada', () => {
    for (const rengH of ['#/no-existe', '#/../core', '#/A', '#/simulador-fisica/a/b', '#/%E0%A4%A', '#/constructor', '#/__proto__']) {
      const rengR = rengResolverRuta(rengH, rengExiste)
      expect(rengR.ruta.id, rengH).toBe('inicio')
      expect(rengR.desconocida, rengH).toBe(true)
    }
  })
  it('hashDe es la inversa para rutas válidas', () => {
    for (const [rengId, rengSub] of [['inicio', null], ['simulador-fisica', null], ['simulador-fisica', 'proyectil'], ['laboratorio', 'datos']] as const) {
      const rengR = rengResolverRuta(rengHashDe(rengId, rengSub), rengExiste).ruta
      expect(rengR).toEqual({ id: rengId, sub: rengId === 'inicio' ? null : rengSub })
    }
  })
})

describe('trabajo reciente', () => {
  const rengR = (rengId: string, rengSub: string | null, rengFecha: number): RengReciente => ({ id: rengId, sub: rengSub, titulo: `${rengId}/${rengSub}`, contexto: 'x', fecha: rengFecha })
  it('la más nueva primero, sin duplicados por módulo + subruta, con tope', () => {
    let rengL: RengReciente[] = []
    rengL = rengAnadirReciente(rengL, rengR('simulador-fisica', 'proyectil', 1))
    rengL = rengAnadirReciente(rengL, rengR('simulador-quimica', 'mesa', 2))
    rengL = rengAnadirReciente(rengL, rengR('simulador-fisica', 'proyectil', 3))
    expect(rengL.map((rengX) => rengX.sub)).toEqual(['proyectil', 'mesa'])
    expect(rengL[0]!.fecha).toBe(3)
    for (let rengI = 0; rengI < 20; rengI++) rengL = rengAnadirReciente(rengL, rengR('laboratorio', `h${rengI}`, 10 + rengI))
    expect(rengL).toHaveLength(RENG_MAX_RECIENTES)
  })
  it('una entrada inválida no se añade', () => {
    expect(rengAnadirReciente([], { ...rengR('simulador-fisica', 'x', 1), titulo: '' })).toEqual([])
    expect(rengAnadirReciente([], rengR('Mal Id', null, 1))).toEqual([])
  })
  it('leer: tolera JSON roto, descarta lo inválido y lo de módulos que ya no existen', () => {
    expect(rengLeerRecientes(null, rengExiste)).toEqual([])
    expect(rengLeerRecientes('{no es json', rengExiste)).toEqual([])
    expect(rengLeerRecientes('{"a":1}', rengExiste)).toEqual([])
    const rengGuardado = JSON.stringify([
      rengR('traductor', null, 5),
      rengR('simulador-fisica', 'orbita', 4),
      { id: 'simulador-quimica', sub: 'mesa', titulo: 7, contexto: 'x', fecha: 3 },
      { ...rengR('laboratorio', '../x', 2) },
      rengR('simulador-fisica', 'orbita', 1),
      rengR('laboratorio', 'calc', 1)
    ])
    expect(rengLeerRecientes(rengGuardado, rengExiste).map((rengX) => `${rengX.id}/${rengX.sub}`)).toEqual(['simulador-fisica/orbita', 'laboratorio/calc'])
    expect(rengLeerRecientes('x'.repeat(30_000), rengExiste)).toEqual([])
  })
  it('haceCuanto en lenguaje corriente', () => {
    const rengAhora = Date.UTC(2026, 10, 9, 12)
    expect(rengHaceCuanto(rengAhora - 20_000, rengAhora)).toBe('hace un momento')
    expect(rengHaceCuanto(rengAhora - 5 * 60_000, rengAhora)).toBe('hace 5 min')
    expect(rengHaceCuanto(rengAhora - 3 * 3_600_000, rengAhora)).toBe('hace 3 h')
    expect(rengHaceCuanto(rengAhora - 30 * 3_600_000, rengAhora)).toBe('ayer')
    expect(rengHaceCuanto(rengAhora - 4 * 86_400_000, rengAhora)).toBe('hace 4 días')
    expect(rengHaceCuanto(rengAhora - 40 * 86_400_000, rengAhora)).toMatch(/^\d+\/\d+\/2026$/)
  })
})
