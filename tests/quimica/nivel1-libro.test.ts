import { describe, expect, it } from 'vitest'
import { rengConvertir } from '../../src/renderer/lib/unidades'
import { rengValidarTex } from '../../src/renderer/lib/ecuaciones/validarTex'
import { RENG_MINIMOS_LECCION_N1, RENG_UMBRAL_SIMILITUD_N1, rengCiclosPrerrequisitos, rengProblemasConexiones, rengProblemasErrores, rengProblemasGlosario, rengProblemasPreguntas, rengSimilitudTextos } from '../../src/renderer/modules/simulador-quimica/aprender/n1/calidad'
import { rengProblemasCapituloN1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/capitulo'
import { rengLeccionN1, rengProblemasLeccionN1, type RengEspecLeccionN1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/constructor'
import { rengProblemasFiguraN1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/figuras'
import { RENG_CAPITULOS_N1, RENG_FIGURAS_N1, RENG_LECCIONES_N1, rengEjemploN1PorId, rengFiguraN1PorId } from '../../src/renderer/modules/simulador-quimica/aprender/n1/registro'
import { RENG_PATRON_ID_CAPITULO_N1, type RengLeccionN1 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/tipos'
import { RENG_KPA_ATM, RENG_MMHG_ATM, rengGasPorFormula, rengK } from '../../src/renderer/modules/simulador-quimica/aprender/n1/gases/constantes'
import { rengRK4 } from '../../src/renderer/modules/simulador-quimica/aprender/n1/numericos'
import { RENG_KB, RENG_NA } from '../../src/renderer/modules/simulador-quimica/nucleo/estequiometria'
import { rengMasaMolarDe } from '../../src/renderer/modules/simulador-quimica/nucleo/formula'
import { RENG_INTEGRADORES_B08 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/b08-integradores'
import { rengProblemasIntegradoresN1 } from '../../src/renderer/modules/simulador-quimica/practicas-n1/integradores'
import { RENG_GRUPOS_INTEGRADORES_N1, rengEsPracticaN1, rengGrupoN1PorId } from '../../src/renderer/modules/simulador-quimica/practicas-n1/registro'
import { RENG_TEMARIO } from '../../src/renderer/modules/simulador-quimica/temario/catalogo'
import { rengCercaRel, rengProbarPractica, type RengSegundoMetodo } from './nivel1-comun'
import { RENG_SEGUNDOS_B07 } from './nivel1-b07-segundos'
import { RENG_SEGUNDOS_B09 } from './nivel1-b09-segundos'
import { RENG_SEGUNDOS_B10 } from './nivel1-b10-segundos'
import { RENG_SEGUNDOS_B11 } from './nivel1-b11-segundos'
import { RENG_SEGUNDOS_B05 } from './nivel1-b05-segundos'
import { RENG_SEGUNDOS_B06 } from './nivel1-b06-segundos'
import { RENG_SEGUNDOS_B01 } from './nivel1-b01-segundos'
import { RENG_SEGUNDOS_B02 } from './nivel1-b02-segundos'
import { RENG_SEGUNDOS_B03 } from './nivel1-b03-segundos'
import { RENG_SEGUNDOS_B04 } from './nivel1-b04-segundos'
import { RENG_SEGUNDOS_B12 } from './nivel1-b12-segundos'

const RENG_REFS_I6 = [rengGasPorFormula('O2'), rengGasPorFormula('N2'), rengGasPorFormula('CH4'), rengGasPorFormula('Ne')]
const rengMasaMolecula = (rengM: number): number => rengM / 1000 / RENG_NA

const RENG_SEGUNDOS_INTEGRADORES_B08: Readonly<Record<string, RengSegundoMetodo>> = {
  'n1-b8-i1': (rengD) => rengRK4((rengV, rengP) => -rengP / rengV, rengD.V1!, rengConvertir(rengD.P1!, 'mmHg', 'kPa'), rengD.V2!, 4000),
  'n1-b8-i2': (rengD) => {
    const rengP = (rengD.n1! * RENG_NA * RENG_KB * rengK(rengD.t1!)) / rengD.V1!
    return (rengD.n2! * RENG_NA * RENG_KB * rengK(rengD.t2!)) / rengP
  },
  'n1-b8-i3': (rengD) => {
    const rengN = (rengD.P! * 1000 * (rengD.V! * 1e-6)) / (RENG_KB * rengK(rengD.t!))
    return (rengD.m! * RENG_NA) / rengN
  },
  'n1-b8-i4': (rengD) => {
    const rengDensidadNumero = (rengD.P! * 1000) / (RENG_KB * rengK(rengD.t!))
    return rengDensidadNumero * (rengD.x! * rengMasaMolecula(rengGasPorFormula('He').M) + (1 - rengD.x!) * rengMasaMolecula(rengGasPorFormula('Ar').M))
  },
  'n1-b8-i5': (rengD) => {
    const rengMoleculas = (rengD.m! / rengMasaMolarDe('NaHCO3') / 2) * RENG_NA
    return ((rengMoleculas * RENG_KB * rengK(rengD.t!)) / (rengD.P! * 1000)) * 1000
  },
  'n1-b8-i6': (rengD) => {
    const rengRef = RENG_REFS_I6[rengD.g!]!
    const rengURef = Math.sqrt((3 * RENG_KB * rengD.T!) / rengMasaMolecula(rengRef.M))
    return (rengURef * rengD.tr!) / rengD.tx!
  }
}

const RENG_SEGUNDOS_INTEGRADORES: Readonly<Record<string, RengSegundoMetodo>> = { ...RENG_SEGUNDOS_INTEGRADORES_B08, ...Object.fromEntries([...Object.entries(RENG_SEGUNDOS_B07), ...Object.entries(RENG_SEGUNDOS_B09), ...Object.entries(RENG_SEGUNDOS_B10), ...Object.entries(RENG_SEGUNDOS_B11), ...Object.entries(RENG_SEGUNDOS_B05), ...Object.entries(RENG_SEGUNDOS_B06), ...Object.entries(RENG_SEGUNDOS_B01), ...Object.entries(RENG_SEGUNDOS_B02), ...Object.entries(RENG_SEGUNDOS_B03), ...Object.entries(RENG_SEGUNDOS_B04), ...Object.entries(RENG_SEGUNDOS_B12)].filter(([rengK]) => /-i\d$/.test(rengK))) }

const rengTextosParaSimilitud = (rengL: RengLeccionN1): readonly string[] => [rengL.porQueImporta, rengL.comprender.idea, rengL.comprender.analogia, rengL.comprender.analogiaLimite, rengL.resumen.join(' '), rengL.errores.map((rengE) => rengE.correccion).join(' ')]

function rengMaximaSimilitud(rengLecciones: readonly RengLeccionN1[]): { valor: number; par: string } {
  let rengMax = { valor: 0, par: '' }
  for (let rengI = 0; rengI < rengLecciones.length; rengI++) {
    for (let rengJ = rengI + 1; rengJ < rengLecciones.length; rengJ++) {
      const rengA = rengLecciones[rengI]!
      const rengB = rengLecciones[rengJ]!
      rengTextosParaSimilitud(rengA).forEach((rengTa, rengK) => {
        const rengS = rengSimilitudTextos(rengTa, rengTextosParaSimilitud(rengB)[rengK]!)
        if (rengS > rengMax.valor) rengMax = { valor: rengS, par: `${rengA.id} / ${rengB.id} (campo ${rengK})` }
      })
    }
  }
  return rengMax
}

const RENG_ESPEC_VALIDA: RengEspecLeccionN1 = {
  id: 'prueba-libro',
  subtema: 'n1-b8-s4',
  nombre: 'Lección de prueba',
  pregunta: '¿Funciona el constructor con todo completo?',
  objetivo: 'Comprobar que una lección completa se construye sin errores.',
  objetivosMas: ['Comprobar que cada mínimo se valida por separado en el constructor.'],
  porQueImporta: 'Una lección incompleta deja al estudiante sin la motivación, sin la práctica guiada o sin la comprobación; por eso el constructor exige cada sección y falla si falta alguna antes de llegar a la aplicación.',
  idea: 'Idea central de prueba con texto suficiente para ser una explicación completa del tema de la lección de prueba.',
  imagen: 'Imagen de prueba suficientemente larga para pasar.',
  analogia: 'Una analogía de prueba con la longitud mínima exigida por el contrato.',
  analogiaLimite: 'El límite de la analogía de prueba también tiene la longitud mínima.',
  errores: [['Primer error frecuente de prueba con texto largo.', 'Corrección del primer error con texto largo.'], ['Segundo error frecuente de prueba con texto largo.', 'Corrección del segundo error con texto largo.']],
  ecs: [['Ecuación', 'a = b', 'Lectura de la ecuación de prueba.', 'a = b']],
  vars: [['a', 'magnitud a', 'sin unidad'], ['b', 'magnitud b', 'sin unidad']],
  supuestos: ['Supuesto de prueba.'],
  limites: 'Límites del modelo de prueba con texto suficiente.',
  ejemplos: ['ej-gas-boyle', 'ej-gas-boyle-2'],
  figuras: ['fig-gas-boyle'],
  resumen: ['Primera línea del resumen de prueba.', 'Segunda línea del resumen de prueba.', 'Tercera línea del resumen de prueba.', 'Cuarta línea del resumen de prueba.'],
  glosario: [['término uno', 'Definición del término uno con longitud suficiente.'], ['término dos', 'Definición del término dos con longitud suficiente.']],
  comprobar: [1, 2, 3].map((rengN) => ({
    pregunta: `Pregunta de prueba número ${rengN} con enunciado suficiente.`,
    opciones: [
      ['Opción correcta', true, 'Retroalimentación de la opción correcta con texto suficiente.'],
      ['Opción incorrecta A', false, 'Retroalimentación de la opción A con la confusión típica.'],
      ['Opción incorrecta B', false, 'Retroalimentación de la opción B con otra confusión típica.']
    ] as const
  })),
  anterior: 'n1-b8-s3',
  siguiente: 'n1-b8-s5',
  prerrequisitos: ['n1-b8-s2'],
  fuentes: [],
  idealizado: 'Prueba.',
  metodo: 'prueba'
}

describe('Nivel 1 · contrato «libro» de las lecciones', () => {
  it('la especificación de control es válida y construye una lección', () => {
    expect(rengProblemasLeccionN1(RENG_ESPEC_VALIDA)).toEqual([])
    expect(rengLeccionN1(RENG_ESPEC_VALIDA).comprobar).toHaveLength(3)
  })

  it('SABOTAJES: cada mínimo que falta hace fallar al constructor', () => {
    const rengCasos: ReadonlyArray<readonly [string, Partial<RengEspecLeccionN1>, RegExp]> = [
      ['quitar una pregunta', { comprobar: RENG_ESPEC_VALIDA.comprobar.slice(0, 2) }, /exactamente 3/],
      ['un solo ejemplo', { ejemplos: ['ej-gas-boyle'] }, /al menos 2/],
      ['sin figuras', { figuras: [] }, /ninguna figura/],
      ['un solo error frecuente', { errores: RENG_ESPEC_VALIDA.errores.slice(0, 1) }, /errores frecuentes/],
      ['resumen de 3 líneas', { resumen: RENG_ESPEC_VALIDA.resumen.slice(0, 3) }, /resumen/],
      ['glosario con colisión', { glosario: [...RENG_ESPEC_VALIDA.glosario, ['Término uno', 'Otra definición distinta del mismo término uno.']] }, /dos definiciones/],
      ['siguiente inexistente', { siguiente: 'n1-b8-s99' }, /no existe/],
      ['anterior inexistente', { anterior: 'n1-b99-s1' }, /no existe/],
      ['prerrequisito de sí mismo', { prerrequisitos: ['n1-b8-s4'] }, /sí mismo/],
      ['sin analogía', { analogia: '' }, /analogía/],
      ['sin límite de la analogía', { analogiaLimite: 'corto' }, /dónde falla/],
      ['sin por qué importa', { porQueImporta: 'corto' }, /Por qué importa/],
      ['un solo objetivo', { objetivosMas: [] }, /objetivos/],
      ['dos opciones correctas', { comprobar: [{ pregunta: 'Pregunta saboteada con dos correctas.', opciones: [['A', true, 'Retroalimentación larga de la opción A.'], ['B', true, 'Retroalimentación larga de la opción B.'], ['C', false, 'Retroalimentación larga de la opción C.']] }, ...RENG_ESPEC_VALIDA.comprobar.slice(1)] }, /exactamente una opción correcta/],
      ['retroalimentación corta', { comprobar: [{ pregunta: 'Pregunta saboteada con retro corta.', opciones: [['A', true, 'Bien.'], ['B', false, 'Retroalimentación larga de la opción B.'], ['C', false, 'Retroalimentación larga de la opción C.']] }, ...RENG_ESPEC_VALIDA.comprobar.slice(1)] }, /menos de 26/]
    ]
    for (const [rengNombre, rengCambio, rengPatron] of rengCasos) {
      const rengEspec = { ...RENG_ESPEC_VALIDA, ...rengCambio }
      expect(rengProblemasLeccionN1(rengEspec).join(' | '), rengNombre).toMatch(rengPatron)
      expect(() => rengLeccionN1(rengEspec), rengNombre).toThrow(/incompleta/)
    }
  })

  it('SABOTAJE: una figura sin texto alternativo, con puntos no finitos o fuera de los ejes se rechaza', () => {
    const rengF = RENG_FIGURAS_N1[0]!
    expect(rengProblemasFiguraN1(rengF)).toEqual([])
    expect(rengProblemasFiguraN1({ ...rengF, alternativo: '' }).join()).toMatch(/texto alternativo/)
    expect(rengProblemasFiguraN1({ ...rengF, series: [{ nombre: 's', puntos: [[0, Number.NaN], [1, 1]] }] }).join()).toMatch(/no finitos/)
    expect(rengProblemasFiguraN1({ ...rengF, series: [{ nombre: 's', puntos: [[0, 0], [rengF.x.max * 3, 0]] }] }).join()).toMatch(/fuera de los ejes/)
  })

  it('cada lección registrada cumple todos los mínimos ya construida', () => {
    const rengM = RENG_MINIMOS_LECCION_N1
    for (const rengL of RENG_LECCIONES_N1) {
      expect(rengL.objetivos.length, rengL.id).toBeGreaterThanOrEqual(rengM.objetivosMin)
      expect(rengL.objetivos.length, rengL.id).toBeLessThanOrEqual(rengM.objetivosMax)
      expect(rengL.porQueImporta.length, rengL.id).toBeGreaterThanOrEqual(rengM.porQueImporta)
      expect(rengL.comprender.analogia.length, rengL.id).toBeGreaterThanOrEqual(rengM.analogia)
      expect(rengL.comprender.analogiaLimite.length, rengL.id).toBeGreaterThanOrEqual(rengM.analogiaLimite)
      expect(rengL.ejemplos[0], rengL.id).toBe(rengL.ejemplo)
      expect(rengProblemasErrores(rengL.errores), rengL.id).toEqual([])
      expect(rengL.comprender.errorFrecuente).toBe(rengL.errores[0]!.error)
      expect(rengL.resumen.length, rengL.id).toBeGreaterThanOrEqual(rengM.resumenMin)
      expect(rengL.resumen.length, rengL.id).toBeLessThanOrEqual(rengM.resumenMax)
      expect(rengProblemasGlosario(rengL.glosario), rengL.id).toEqual([])
      expect(rengProblemasPreguntas(rengL.comprobar), rengL.id).toEqual([])
      expect(rengProblemasConexiones(rengL.subtema, rengL.conexiones), rengL.id).toEqual([])
    }
  })

  it('cada lección tiene al menos 2 ejemplos existentes, y en cada uno el resultado analítico coincide con el segundo método', () => {
    for (const rengL of RENG_LECCIONES_N1) {
      expect(rengL.ejemplos.length, rengL.id).toBeGreaterThanOrEqual(2)
      for (const rengId of rengL.ejemplos) {
        const rengE = rengEjemploN1PorId(rengId)
        expect(rengE, `${rengL.id} → ${rengId}`).toBeDefined()
        const rengA = rengE!.analitico()
        const rengB = rengE!.segundo()
        expect(rengCercaRel(rengA, rengB), `${rengId}: ${rengA} frente a ${rengB}`).toBe(true)
        expect(rengE!.pasos(rengA).length, rengId).toBeGreaterThanOrEqual(2)
        for (const rengP of rengE!.pistas) expect(rengP.length, rengId).toBeGreaterThanOrEqual(RENG_MINIMOS_LECCION_N1.pista)
        expect(rengE!.metodoSegundo.length, rengId).toBeGreaterThan(20)
      }
    }
  })

  it('cada figura citada existe, es válida y tiene pie, título y texto alternativo; las figuras sin uso no se registran', () => {
    const rengUsadas = new Set(RENG_LECCIONES_N1.flatMap((rengL) => rengL.figuras))
    for (const rengId of rengUsadas) {
      const rengF = rengFiguraN1PorId(rengId)
      expect(rengF, rengId).toBeDefined()
      expect(rengProblemasFiguraN1(rengF!), rengId).toEqual([])
    }
    for (const rengF of RENG_FIGURAS_N1) expect(rengUsadas.has(rengF.id), `figura sin uso: ${rengF.id}`).toBe(true)
    expect(new Set(RENG_FIGURAS_N1.map((rengF) => rengF.id)).size).toBe(RENG_FIGURAS_N1.length)
  })

  it('los prerrequisitos no forman ciclos (y el detector de ciclos detecta un ciclo saboteado)', () => {
    const rengAristas = new Map(RENG_LECCIONES_N1.map((rengL) => [rengL.subtema, rengL.conexiones.prerrequisitos] as const))
    expect(rengCiclosPrerrequisitos(rengAristas)).toEqual([])
    const rengConCiclo = new Map(rengAristas)
    rengConCiclo.set('n1-b8-s2', ['n1-b8-s4'])
    expect(rengCiclosPrerrequisitos(rengConCiclo).length).toBeGreaterThan(0)
  })

  it(`similitud entre lecciones de un mismo bloque por debajo del umbral (${RENG_UMBRAL_SIMILITUD_N1}, Jaccard de grupos de 4 palabras) y el sabotaje la detecta`, () => {
    const rengBloques = [...new Set(RENG_LECCIONES_N1.map((rengL) => rengL.bloque))]
    for (const rengB of rengBloques) {
      const rengMax = rengMaximaSimilitud(RENG_LECCIONES_N1.filter((rengL) => rengL.bloque === rengB))
      expect(rengMax.valor, `bloque ${rengB}: ${rengMax.par}`).toBeLessThan(RENG_UMBRAL_SIMILITUD_N1)
    }
    const [rengA, rengB] = RENG_LECCIONES_N1
    const rengCopia: RengLeccionN1 = { ...rengB!, porQueImporta: rengA!.porQueImporta }
    expect(rengMaximaSimilitud([rengA!, rengCopia]).valor).toBeGreaterThanOrEqual(RENG_UMBRAL_SIMILITUD_N1)
  })

  it('el glosario de cada bloque no tiene un mismo término con definiciones distintas', () => {
    for (const rengC of RENG_CAPITULOS_N1) expect(rengProblemasGlosario(RENG_LECCIONES_N1.filter((rengL) => rengL.bloque === rengC.bloque).flatMap((rengL) => rengL.glosario)), `bloque ${rengC.bloque}`).toEqual([])
  })

  it('cada lección con escena declara instrucción y límite, y su escena existe con el subtema en su lista', async () => {
    const { rengEscenaN1PorId } = await import('../../src/renderer/modules/simulador-quimica/escenas-n1/registro')
    for (const rengL of RENG_LECCIONES_N1.filter((rengX) => rengX.escena !== null)) {
      const rengE = rengEscenaN1PorId(rengL.escena!.id)
      expect(rengE, rengL.id).toBeDefined()
      expect(rengE!.subtemas, rengL.id).toContain(rengL.subtema)
      for (const rengK of Object.keys(rengL.escena!.valores)) expect(rengE!.parametros.some((rengP) => rengP.clave === rengK), `${rengL.id}: ${rengK}`).toBe(true)
    }
  })
})

describe('Nivel 1 · capítulos (portada y cierre)', () => {
  it('cada bloque con lecciones tiene su capítulo válido, con id de patrón y ruta que respeta los prerrequisitos', () => {
    const rengBloques = [...new Set(RENG_LECCIONES_N1.map((rengL) => rengL.bloque))].sort((rengA, rengB) => rengA - rengB)
    expect(RENG_CAPITULOS_N1.map((rengC) => rengC.bloque).sort((rengA, rengB) => rengA - rengB)).toEqual(rengBloques)
    for (const rengC of RENG_CAPITULOS_N1) {
      expect(rengC.id).toMatch(RENG_PATRON_ID_CAPITULO_N1)
      expect(`aprender-${rengC.id}`.length).toBeLessThanOrEqual(41)
      expect(rengProblemasCapituloN1(rengC, RENG_LECCIONES_N1)).toEqual([])
      expect(rengC.glosario.length).toBeGreaterThanOrEqual(10)
    }
  })

  it('SABOTAJE: una ruta que pone un subtema antes que su prerrequisito se detecta', () => {
    const rengC = RENG_CAPITULOS_N1[0]!
    const rengRuta = [...rengC.ruta].reverse()
    expect(rengProblemasCapituloN1({ ...rengC, ruta: rengRuta }, RENG_LECCIONES_N1).join()).toMatch(/antes de su prerrequisito/)
  })

  it('cada capítulo tiene al menos 6 integradores (2 básicos, 2 intermedios, 2 avanzados) que combinan 2 o más subtemas', () => {
    for (const rengC of RENG_CAPITULOS_N1) {
      const rengG = rengGrupoN1PorId(rengC.integradores)
      expect(rengG, rengC.id).toBeDefined()
      expect(rengProblemasIntegradoresN1(rengC.bloque, rengG!.practicas)).toEqual([])
      for (const rengP of rengG!.practicas) expect(rengEsPracticaN1(rengP.id)).toBe(true)
    }
  })

  it('SABOTAJES: integradores de menos, de un solo subtema o sin segundo método se detectan', () => {
    expect(rengProblemasIntegradoresN1(8, RENG_INTEGRADORES_B08.slice(0, 5)).join()).toMatch(/al menos 6/)
    expect(rengProblemasIntegradoresN1(8, RENG_INTEGRADORES_B08.map((rengP, rengI) => (rengI === 0 ? { ...rengP, subtemas: ['n1-b8-s2'] } : rengP))).join()).toMatch(/al menos 2 subtemas/)
    const rengSinSegundo = RENG_GRUPOS_INTEGRADORES_N1.flatMap((rengG) => rengG.practicas).filter((rengP) => !(rengP.id in RENG_SEGUNDOS_INTEGRADORES))
    expect(rengSinSegundo).toEqual([])
    const rengSaboteado: Record<string, RengSegundoMetodo> = { ...RENG_SEGUNDOS_INTEGRADORES }
    delete rengSaboteado['n1-b8-i3']
    expect(RENG_INTEGRADORES_B08.filter((rengP) => !(rengP.id in rengSaboteado)).map((rengP) => rengP.id)).toEqual(['n1-b8-i3'])
  })

  for (const rengG of RENG_GRUPOS_INTEGRADORES_N1) {
    describe(rengG.subtema, () => {
      for (const rengP of rengG.practicas) rengProbarPractica(rengP, RENG_SEGUNDOS_INTEGRADORES[rengP.id])
    })
  }
})

describe('Nivel 1 · escena gas ideal (primera escena real del kit)', () => {
  it('el bloque 8 del temario tiene sus subtemas (comprobación cruzada del recuento)', () => {
    expect(RENG_TEMARIO.niveles[0]!.bloques.find((rengB) => rengB.numero === 8)!.subtemas).toHaveLength(20)
  })

  it('las ecuaciones de la ficha de la escena son TeX válido', async () => {
    const { RENG_ESCENA_GAS_IDEAL } = await import('../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/gas-ideal')
    for (const rengQ of RENG_ESCENA_GAS_IDEAL.ficha.ecuaciones) expect(rengValidarTex(rengQ.tex)).toEqual({ ok: true })
  })

  it('comprobación analítica en una rejilla de parámetros (tolerancia relativa 1e-9) y sabotaje con la temperatura en °C', async () => {
    const { RENG_ESCENA_GAS_IDEAL } = await import('../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/gas-ideal')
    const { rengComprobarEscenaN1, rengValidarModeloEscenaN1 } = await import('../../src/renderer/modules/simulador-quimica/escenas-n1/kit')
    expect(rengValidarModeloEscenaN1(RENG_ESCENA_GAS_IDEAL)).toEqual([])
    const rengComprobar = (rengV: Readonly<Record<string, number>>, _rengT: number, rengL: Readonly<Record<string, number>>): string | null => {
      const rengN = rengV.n! * RENG_NA
      const rengPSI = (rengN * RENG_KB * rengV.T!) / (rengV.V! / 1000)
      const rengMasa = rengMasaMolecula(rengV.M!)
      const rengTol = (rengA: number, rengB: number): boolean => Math.abs(rengA - rengB) <= 1e-9 * Math.max(Math.abs(rengA), Math.abs(rengB))
      if (!rengTol(rengL.P! * 1000, rengPSI)) return `P = ${rengL.P} kPa y N·k_B·T/V da ${rengPSI / 1000}`
      if (!rengTol(rengL.R!, RENG_NA * RENG_KB)) return 'P·V/(n·T) no es R'
      if (!rengTol(rengL.rho!, (rengN * rengMasa * 1000) / rengV.V!)) return 'densidad distinta de N·m/V'
      if (!rengTol(rengL.urms!, Math.sqrt((3 * RENG_KB * rengV.T!) / rengMasa))) return 'u_rms distinta de √(3·k_B·T/m)'
      if (!rengTol(rengL.Ec!, (1.5 * RENG_NA * RENG_KB * rengV.T!) / 1000)) return 'energía cinética molar distinta'
      if (!rengTol(rengL.Vm! * rengV.n!, rengV.V!)) return 'V_m·n distinto de V'
      return null
    }
    expect(rengComprobarEscenaN1(RENG_ESCENA_GAS_IDEAL, rengComprobar, 3)).toEqual([])
    const rengCelsius = { ...RENG_ESCENA_GAS_IDEAL, lecturas: (rengV: Readonly<Record<string, number>>, rengT: number) => RENG_ESCENA_GAS_IDEAL.lecturas({ ...rengV, T: rengV.T! - 273.15 }, rengT) }
    expect(rengComprobarEscenaN1(rengCelsius, rengComprobar, 3).length).toBeGreaterThan(0)
  })

  it('valores de referencia: 1 mol a 273,15 K en 22,414 L da 101,325 kPa (comprobación con kPa/atm del catálogo)', async () => {
    const { rengLecturasGasIdeal } = await import('../../src/renderer/modules/simulador-quimica/escenas-n1/modelos/gas-ideal')
    const rengL = rengLecturasGasIdeal({ n: 1, T: 273.15, V: 22.41396954, M: 28 })
    expect(rengCercaRel(rengL.P!, RENG_KPA_ATM, 1e-6)).toBe(true)
    expect(rengCercaRel(rengL.Patm!, 1, 1e-6)).toBe(true)
    expect(rengCercaRel(rengConvertir(rengL.P!, 'kPa', 'mmHg'), RENG_MMHG_ATM, 1e-6)).toBe(true)
  })
})
