import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RENG_LECCIONES } from '../../src/renderer/modules/simulador-quimica/aprender/lecciones'
import { RENG_EJEMPLOS_N1, RENG_LECCIONES_N1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/registro'
import { RENG_CLAVE_PROGRESO_LECCIONES } from '../../src/renderer/modules/simulador-quimica/aprender/progreso'
import { RENG_CLAVE_NIVEL_PRACTICA } from '../../src/renderer/modules/simulador-quimica/practica/niveles'
import { RENG_CLAVE_PRACTICA } from '../../src/renderer/modules/simulador-quimica/practica/persistencia'
import { rengGeneradorN1, rengSemillaValidaN1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/aleatorio'
import { rengCorregirN1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/correccion'
import { rengFabricarPracticaN1, rengSeparadosN1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/fabrica'
import { RENG_CLAVE_PRACTICAS_N1, RENG_VERSION_PRACTICAS_N1, rengActualizarAvanceN1, rengAvanceN1Inicial, rengGuardarProgresoN1, rengLeerProgresoN1, rengMarcarRevisadaN1, rengOtraSemillaN1, rengProgresoN1Vacio, rengRegistrarIntentoN1, type RengAlmacenN1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/progreso'
import { RENG_GRUPOS_PRACTICAS_N1, RENG_PRACTICAS_N1, rengEsPracticaN1, rengGrupoN1, rengGrupoN1DeLeccion } from '../../src/renderer/modules/simulador-quimica/practicas-n1/registro'
import type { RengInstanciaN1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/tipos'
import { rengEsReproducible } from './nivel1-comun'

const RENG_TOL = { rel: 0.01, abs: 0.001 }

const rengEspecBase = {
  id: 'n1-b8-s1-p9',
  subtema: 'n1-b8-s1',
  titulo: 'Práctica de prueba',
  dificultad: 'basica' as const,
  objetivo: 'Comprobar la fábrica de prácticas con una práctica inventada para las pruebas.',
  unidad: 'kPa',
  tolerancia: RENG_TOL,
  fuentes: [],
  idealizado: 'Solo para pruebas.',
  metodo: 'ninguno',
  parametros: (rengRng: () => number) => ({ x: 10 + Math.floor(rengRng() * 90) }),
  respuesta: (rengD: { x: number }) => rengD.x * 2,
  errores: (rengD: { x: number }) => [['mitad', 'Mitad', rengD.x, 'Usaste la mitad del valor: multiplica por dos.'] as const, ['triple', 'Triple', rengD.x * 3, 'Multiplicaste por tres en lugar de por dos.'] as const],
  enunciado: (rengD: { x: number }) => `Dato ${rengD.x}.`,
  pregunta: () => '¿Cuánto vale el doble?',
  datos: (rengD: { x: number }) => [['x', String(rengD.x)], ['Factor', '2']] as const,
  pasos: (rengD: { x: number }, rengR: number) => [`2 × ${rengD.x}`, `= ${rengR}`],
  pistas: ['Multiplica el dato por dos.', 'El doble de x es 2·x.', 'Revisa la multiplicación.'] as const
}

const rengAlmacenFalso = (rengInicial: Record<string, string> = {}): RengAlmacenN1 & { datos: Map<string, string> } => {
  const rengDatos = new Map(Object.entries(rengInicial))
  return { datos: rengDatos, getItem: (rengK) => rengDatos.get(rengK) ?? null, setItem: (rengK, rengV) => void rengDatos.set(rengK, rengV) }
}

describe('Nivel 1 · fábrica de prácticas y separación', () => {
  it('genera una práctica válida con la especificación de prueba', () => {
    const rengP = rengFabricarPracticaN1(rengEspecBase)
    const rengI = rengP.generar(5)
    expect(rengI.respuesta).toBe(rengI.parametros.x! * 2)
    expect(rengSeparadosN1(rengI.respuesta, rengI.errores.map((rengE) => rengE.valor), RENG_TOL)).toBe(true)
    expect(rengP.procedencia.map((rengX) => rengX.nivel)).toEqual(['ejemplo-idealizado', 'parametro-didactico', 'dato-calculado'])
  })

  it('SABOTAJE: un error típico igual a la respuesta impide generar la variante', () => {
    const rengMala = rengFabricarPracticaN1({ ...rengEspecBase, errores: (rengD: { x: number }) => [['igual', 'Igual', rengD.x * 2, 'Este error típico coincide con la respuesta correcta.'] as const] })
    expect(() => rengMala.generar(1)).toThrow(RangeError)
  })

  it('SABOTAJE: una tolerancia demasiado ancha hace solapar respuesta y errores y se rechaza', () => {
    const rengAncha = rengFabricarPracticaN1({ ...rengEspecBase, tolerancia: { rel: 0.6, abs: 0.001 } })
    expect(() => rengAncha.generar(1)).toThrow(RangeError)
  })

  it('SABOTAJE: dos errores con el mismo mensaje se rechazan', () => {
    const rengRepetido = rengFabricarPracticaN1({ ...rengEspecBase, errores: (rengD: { x: number }) => [['a', 'A', rengD.x, 'Mismo mensaje para dos errores distintos.'] as const, ['b', 'B', rengD.x * 3, 'Mismo mensaje para dos errores distintos.'] as const] })
    expect(() => rengRepetido.generar(1)).toThrow(RangeError)
  })

  it('la separación exige ≥ 0,15 y ≥ 1,5 %, ventanas sin solape, números finitos y respuesta lejos de cero', () => {
    expect(rengSeparadosN1(10, [12, 20], RENG_TOL)).toBe(true)
    expect(rengSeparadosN1(10, [10.1], RENG_TOL)).toBe(false)
    expect(rengSeparadosN1(1, [1.1], RENG_TOL)).toBe(false)
    expect(rengSeparadosN1(1000, [1010], RENG_TOL)).toBe(false)
    expect(rengSeparadosN1(10, [Number.NaN], RENG_TOL)).toBe(false)
    expect(rengSeparadosN1(10, [Number.POSITIVE_INFINITY], RENG_TOL)).toBe(false)
    expect(rengSeparadosN1(0.002, [5], RENG_TOL)).toBe(false)
    expect(rengSeparadosN1(10, [12, 12.05], RENG_TOL)).toBe(false)
  })
})

describe('Nivel 1 · semillas reproducibles', () => {
  it('el mismo id y semilla dan la misma secuencia; otra semilla u otro id, otra', () => {
    const rengA = rengGeneradorN1('n1-b8-s1-p1', 3)
    const rengB = rengGeneradorN1('n1-b8-s1-p1', 3)
    const rengSecA = [rengA(), rengA(), rengA()]
    expect([rengB(), rengB(), rengB()]).toEqual(rengSecA)
    const rengC = rengGeneradorN1('n1-b8-s1-p1', 4)
    expect([rengC(), rengC(), rengC()]).not.toEqual(rengSecA)
    const rengD = rengGeneradorN1('n1-b8-s1-p2', 3)
    expect([rengD(), rengD(), rengD()]).not.toEqual(rengSecA)
    expect(rengSemillaValidaN1(0) && rengSemillaValidaN1(999_999)).toBe(true)
    expect(rengSemillaValidaN1(-1) || rengSemillaValidaN1(1_000_000) || rengSemillaValidaN1(2.5) || rengSemillaValidaN1('3')).toBe(false)
  })

  it('SABOTAJE: una práctica que usa Math.random no es reproducible y la comprobación lo detecta', () => {
    const rengAzar = rengFabricarPracticaN1({ ...rengEspecBase, parametros: () => ({ x: 10 + Math.floor(Math.random() * 1e6) }) })
    expect(rengEsReproducible(rengAzar, 7)).toBe(false)
    expect(rengEsReproducible(rengFabricarPracticaN1(rengEspecBase), 7)).toBe(true)
  })
})

describe('Nivel 1 · corrección (adaptador sobre la corrección numérica existente)', () => {
  const rengP = rengFabricarPracticaN1(rengEspecBase)
  const rengI: RengInstanciaN1 = rengP.generar(11)
  const rengR = rengI.respuesta

  it('acepta la respuesta con y sin unidad, en otra unidad compatible y con coma decimal', () => {
    expect(rengCorregirN1(String(rengR).replace('.', ','), rengP, rengI).tipo).toBe('correcto')
    expect(rengCorregirN1(`${rengR} kPa`, rengP, rengI).tipo).toBe('correcto')
    const rengEnPa = rengCorregirN1(`${rengR * 1000} Pa`, rengP, rengI)
    expect(rengEnPa.tipo).toBe('correcto')
    expect(rengEnPa.equivale).toMatch(/equivale/)
  })

  it('distingue error típico, error de unidades (potencia de 10), unidad incompatible, ilegible y no finito', () => {
    const rengMitad = rengCorregirN1(String(rengI.parametros.x), rengP, rengI)
    expect(rengMitad).toMatchObject({ tipo: 'error-tipico', errorId: 'mitad' })
    expect(rengCorregirN1(String(rengR * 1000), rengP, rengI).tipo).toBe('unidades')
    expect(rengCorregirN1(`${rengR} kg`, rengP, rengI).tipo).toBe('unidad-incompatible')
    expect(rengCorregirN1('dos', rengP, rengI).tipo).toBe('ilegible')
    expect(rengCorregirN1('1e999', rengP, rengI).tipo).toBe('ilegible')
    expect(rengCorregirN1('', rengP, rengI).tipo).toBe('ilegible')
    expect(['alto', 'bajo']).toContain(rengCorregirN1(String(rengR * 1.6), rengP, rengI).tipo)
  })

  it('SABOTAJE: si la respuesta guardada estuviera mal, la respuesta correcta deja de aceptarse', () => {
    const rengCorrupta = { ...rengI, respuesta: rengR * 1.07 }
    expect(rengCorregirN1(String(rengR), rengP, rengCorrupta).tipo).not.toBe('correcto')
  })

  it('SABOTAJE: con una tolerancia relajada se aceptaría un error típico; con la real, no', () => {
    expect(rengCorregirN1(String(rengR * 1.04), rengP, rengI).tipo).not.toBe('correcto')
    expect(rengCorregirN1(String(rengR * 1.04), { ...rengP, tolerancia: { rel: 0.05, abs: 0.001 } }, rengI).tipo).toBe('correcto')
  })
})

describe('Nivel 1 · progreso de prácticas en clave nueva', () => {
  it('clave nueva y versionada, distinta de todas las existentes', () => {
    expect(RENG_CLAVE_PRACTICAS_N1).toBe('ciencia.practicas-n1.simulador-quimica')
    expect(RENG_VERSION_PRACTICAS_N1).toBe(1)
    expect([RENG_CLAVE_PRACTICA, RENG_CLAVE_PROGRESO_LECCIONES, RENG_CLAVE_NIVEL_PRACTICA, 'quimica.nivel', 'quimica.historial', 'ciencia.temario.simulador-quimica']).not.toContain(RENG_CLAVE_PRACTICAS_N1)
  })

  it('ida y vuelta, intentos, revisadas y otra semilla', () => {
    const rengA = rengAlmacenFalso()
    const rengId = RENG_PRACTICAS_N1[0]!.id
    let rengAv = rengAvanceN1Inicial()
    rengAv = rengRegistrarIntentoN1(rengAv, false)
    rengAv = rengRegistrarIntentoN1(rengAv, true)
    expect(rengAv).toMatchObject({ intentos: 2, resueltas: [0] })
    expect(rengRegistrarIntentoN1(rengAv, true)).toBe(rengAv)
    rengAv = rengOtraSemillaN1(rengAv)
    expect(rengAv.semilla).toBe(1)
    rengAv = rengMarcarRevisadaN1(rengAv)
    expect(rengAv.revisadas).toEqual([1])
    const rengP = rengActualizarAvanceN1(rengProgresoN1Vacio(), rengId, rengAv)
    expect(rengGuardarProgresoN1(rengA, rengP)).toBe(true)
    expect(rengLeerProgresoN1(rengA, rengEsPracticaN1)).toEqual(rengP)
  })

  it('valida al leer: JSON roto, versión desconocida, ids inventados, semillas inválidas, tamaño excesivo y almacén que lanza', () => {
    const rengLeer = (rengT: string | null): ReturnType<typeof rengLeerProgresoN1> => rengLeerProgresoN1({ getItem: () => rengT }, rengEsPracticaN1)
    const rengId = RENG_PRACTICAS_N1[0]!.id
    expect(rengLeer(null)).toEqual(rengProgresoN1Vacio())
    expect(rengLeer('{roto')).toEqual(rengProgresoN1Vacio())
    expect(rengLeer(JSON.stringify({ version: 2, practicas: {}, ultima: null }))).toEqual(rengProgresoN1Vacio())
    const rengMezcla = rengLeer(JSON.stringify({ version: 1, practicas: { [rengId]: { semilla: 3, resueltas: [3, 3, 4], revisadas: [4, 5], intentos: 2 }, 'inventada-p1': { semilla: 1, resueltas: [], revisadas: [], intentos: 0 }, [RENG_PRACTICAS_N1[1]!.id]: { semilla: -4, resueltas: [], revisadas: [], intentos: 0 } }, ultima: 'inventada-p1' }))
    expect(Object.keys(rengMezcla.practicas)).toEqual([rengId])
    expect(rengMezcla.practicas[rengId]).toEqual({ semilla: 3, resueltas: [3, 4], revisadas: [5], intentos: 2 })
    expect(rengMezcla.ultima).toBeNull()
    expect(rengLeer('x'.repeat(500_000))).toEqual(rengProgresoN1Vacio())
    expect(rengLeerProgresoN1({ getItem: () => { throw new Error('bloqueado') } }, rengEsPracticaN1)).toEqual(rengProgresoN1Vacio())
    expect(rengGuardarProgresoN1({ getItem: () => null, setItem: () => { throw new Error('lleno') } }, rengProgresoN1Vacio())).toBe(false)
    expect(rengGuardarProgresoN1(null, rengProgresoN1Vacio())).toBe(false)
  })

  it('las claves antiguas quedan intactas byte a byte al leer y guardar el progreso nuevo', () => {
    const rengAntiguas = {
      [RENG_CLAVE_PRACTICA]: '{"v":2,"actual":{"tema":"mol"},"pendientes":[],"logros":{}}',
      [RENG_CLAVE_PROGRESO_LECCIONES]: '{"v":1,"temas":{"mol":{"paso":2,"comprobacion":"correcta","intentos":1}}}',
      [RENG_CLAVE_NIVEL_PRACTICA]: 'universitario',
      'quimica.nivel': 'avanzado'
    }
    const rengA = rengAlmacenFalso(rengAntiguas)
    const rengP = rengLeerProgresoN1(rengA, rengEsPracticaN1)
    rengGuardarProgresoN1(rengA, rengActualizarAvanceN1(rengP, RENG_PRACTICAS_N1[0]!.id, rengRegistrarIntentoN1(rengAvanceN1Inicial(), true)))
    for (const [rengK, rengV] of Object.entries(rengAntiguas)) expect(rengA.datos.get(rengK), rengK).toBe(rengV)
    expect([...rengA.datos.keys()].sort()).toEqual([...Object.keys(rengAntiguas), RENG_CLAVE_PRACTICAS_N1].sort())
  })

  it('SABOTAJE: un guardado que escribiera en la clave antigua de prácticas se detectaría', () => {
    const rengA = rengAlmacenFalso({ [RENG_CLAVE_PRACTICA]: 'original' })
    rengA.setItem(RENG_CLAVE_PRACTICA, JSON.stringify(rengProgresoN1Vacio()))
    expect(rengA.datos.get(RENG_CLAVE_PRACTICA)).not.toBe('original')
  })

  it('el código de las prácticas N1 solo escribe en su clave nueva', () => {
    const rengRaiz = join(import.meta.dirname, '../../src/renderer/modules/simulador-quimica')
    const rengVista = readFileSync(join(rengRaiz, 'vista/PracticasN1.tsx'), 'utf8')
    expect(rengVista).not.toMatch(/setItem\(/)
    expect(rengVista).not.toMatch(/sessionStorage/)
    expect(readFileSync(join(rengRaiz, 'vista/LeccionN1.tsx'), 'utf8')).not.toMatch(/Storage/)
    expect(readFileSync(join(rengRaiz, 'practicas-n1/progreso.ts'), 'utf8').match(/setItem\(/g)).toHaveLength(2)
  })
})

describe('Nivel 1 · registros sin duplicados y sin tocar lo existente', () => {
  it('las 22 lecciones de Aprender no cambian y no se mezclan con las lecciones por capas', () => {
    expect(RENG_LECCIONES).toHaveLength(22)
    const rengTemas = new Set(RENG_LECCIONES.map((rengL) => rengL.tema))
    expect(RENG_LECCIONES_N1.some((rengL) => rengTemas.has(rengL.id))).toBe(false)
    expect(RENG_CLAVE_PROGRESO_LECCIONES).toBe('ciencia.aprender.simulador-quimica')
  })

  it('lecciones, ejemplos, grupos y prácticas sin ids repetidos; cada grupo apunta a su lección', () => {
    expect(new Set(RENG_LECCIONES_N1.map((rengL) => rengL.id)).size).toBe(RENG_LECCIONES_N1.length)
    expect(new Set(RENG_LECCIONES_N1.map((rengL) => rengL.subtema)).size).toBe(RENG_LECCIONES_N1.length)
    expect(new Set(RENG_EJEMPLOS_N1.map((rengE) => rengE.id)).size).toBe(RENG_EJEMPLOS_N1.length)
    expect(new Set(RENG_PRACTICAS_N1.map((rengP) => rengP.id)).size).toBe(RENG_PRACTICAS_N1.length)
    expect(new Set(RENG_GRUPOS_PRACTICAS_N1.map((rengG) => rengG.subtema)).size).toBe(RENG_GRUPOS_PRACTICAS_N1.length)
    for (const rengL of RENG_LECCIONES_N1) expect(RENG_EJEMPLOS_N1.some((rengE) => rengE.id === rengL.ejemplo), rengL.id).toBe(true)
    for (const rengG of RENG_GRUPOS_PRACTICAS_N1) {
      expect(rengGrupoN1DeLeccion(rengG.leccion)).toBe(rengG)
      expect(rengG.practicas.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('SABOTAJE: un grupo sin lección o con prácticas de otro subtema no se puede registrar', () => {
    expect(() => rengGrupoN1('n2-b13-s2', [])).toThrow(/lección/)
    expect(() => rengGrupoN1('n1-b8-s1', RENG_GRUPOS_PRACTICAS_N1[1]!.practicas)).toThrow(/otro subtema/)
  })
})
