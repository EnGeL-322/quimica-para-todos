import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { rengArrancarPractica, rengGuardarPractica } from '../../src/renderer/modules/simulador-quimica/practica/arranque'
import { RENG_FAMILIAS, RENG_RESOLVEDOR_PRACTICA, rengCorreccionCompleta, rengEjercicioDeIntento, rengEjercicioDeTema, rengEjercicioLegado, rengEjercicioPorId, rengGenerarDeFamilia, rengHuellaEjercicio, rengReferenciaLegada, rengReferenciaNueva, rengReferenciaPorId, rengRespuestaTexto } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import { rengEstadoEjercicio, rengEstadoPracticaInicial, rengIntentoAbierto, rengPractica, type RengEstadoPractica } from '../../src/renderer/modules/simulador-quimica/practica/estado'
import { RENG_CLAVE_PRACTICA, rengLeerPractica, rengSerializarPractica } from '../../src/renderer/modules/simulador-quimica/practica/persistencia'
import { rengNivelParaTema } from '../../src/renderer/modules/simulador-quimica/practica/banco'
import type { RengNivelPractica } from '../../src/renderer/modules/simulador-quimica/practica/niveles'

interface RengInstantanea {
  filas: Array<[string, RengNivelPractica, number, string, string]>
}

const rengInstantanea = JSON.parse(readFileSync(join(import.meta.dirname, '../fixtures/practica-v1-instantanea.json'), 'utf8')) as RengInstantanea
const RENG_RAIZ = join(import.meta.dirname, '../../src/renderer/modules/simulador-quimica')
const rengFuente = (rengP: string): string => readFileSync(join(RENG_RAIZ, rengP), 'utf8')

const rengAbrir = (rengE: RengEstadoPractica, rengId: string): RengEstadoPractica => {
  const rengRef = rengReferenciaPorId(rengId)!
  return rengPractica(rengE, { tipo: 'elegir', tema: rengRef.tema, nivel: rengRef.nivel, semilla: rengRef.semilla, ejercicioId: rengRef.ejercicioId, huella: rengRef.huella })
}

const rengVariante = (rengFamilia: string, rengVar: string, rengNivel: RengNivelPractica) => {
  const rengF = RENG_FAMILIAS.find((rengX) => rengX.id === rengFamilia)!
  for (let rengS = 1; rengS < 300; rengS++) {
    const rengE = rengGenerarDeFamilia(rengF, rengNivel, rengS)
    if (rengE?.variante === rengVar) return rengE
  }
  throw new Error('sin variante')
}

const rengComprobar = (rengE: RengEstadoPractica, rengEj: ReturnType<typeof rengVariante>, rengRespuesta: string, rengMetodo: string | null): RengEstadoPractica => {
  const rengConEntrada = rengPractica(rengPractica(rengE, { tipo: 'escribir', texto: rengRespuesta }), { tipo: 'metodo', id: rengMetodo })
  const rengC = rengCorreccionCompleta(rengEj, rengRespuesta, rengMetodo)
  return rengPractica(rengConEntrada, { tipo: 'veredicto', veredicto: rengC.veredicto, metodo: rengC.metodo, completa: rengC.completa })
}

describe('Entrega C · identidad estable de familia, nivel y variante', () => {
  it('la instantánea anterior a la entrega cubre todos los temas y niveles', () => {
    expect(rengInstantanea.filas.length).toBeGreaterThan(1000)
    expect(new Set(rengInstantanea.filas.map((rengF) => rengF[0])).size).toBe(21)
  })
  it('el resolutor de registros antiguos reproduce exactamente el ejercicio de la instantánea (mismo id y mismo contenido) aunque haya familias nuevas', () => {
    for (const [rengTema, rengNivel, rengSemilla, rengId, rengHash] of rengInstantanea.filas) {
      const rengE = rengEjercicioLegado(rengTema, rengNivel, rengSemilla)
      expect(rengE?.id, `${rengTema}/${rengNivel}/${rengSemilla}`).toBe(rengId)
      expect(rengE ? rengHuellaEjercicio(rengE) : '', `${rengId} contenido`).toBe(rengHash.padStart(8, '0'))
    }
  })
  it('los identificadores familia~nivel~semilla siguen resolviendo el mismo problema (enlaces e intentos por id)', () => {
    for (const [, , , rengId, rengHash] of rengInstantanea.filas) {
      const rengE = rengEjercicioPorId(rengId)
      expect(rengE, rengId).not.toBeNull()
      expect(rengHuellaEjercicio(rengE!), rengId).toBe(rengHash.padStart(8, '0'))
    }
  })
  it('añadir familias SÍ cambia lo que elegiría la regla nueva para algunas combinaciones: por eso la identidad se guarda y no se deduce', () => {
    const rengCambiadas = rengInstantanea.filas.filter(([rengTema, rengNivel, rengSemilla, rengId]) => rengEjercicioDeTema(rengTema, rengNivel, rengSemilla)?.id !== rengId)
    expect(rengCambiadas.length).toBeGreaterThan(20)
    const rengTemas = new Set(rengCambiadas.map((rengF) => rengF[0]))
    for (const rengT of ['concentracion', 'estequiometria', 'isomeria', 'valoracion', 'equilibrio']) expect(rengTemas.has(rengT), rengT).toBe(true)
  })
  it('un intento guardado por identidad no cambia aunque la regla de elección cambie; uno sin identidad usa la regla antigua', () => {
    const rengRef = rengReferenciaLegada('concentracion', 'preuniversitario', 2)!
    const rengIntento = rengPractica(rengEstadoPracticaInicial('general', 'concentracion', 'preuniversitario'), { tipo: 'elegir', tema: 'concentracion', nivel: 'preuniversitario', semilla: 2, ejercicioId: rengRef.ejercicioId, huella: rengRef.huella }).actual
    expect(rengEjercicioDeIntento(rengIntento)!.id).toBe(rengRef.ejercicioId)
    expect(rengEjercicioDeTema('concentracion', 'preuniversitario', 2)!.id).not.toBe(rengRef.ejercicioId)
    expect(rengEjercicioDeIntento({ ejercicioId: null, tema: 'concentracion', nivel: 'preuniversitario', semilla: 2 })!.id).toBe(rengRef.ejercicioId)
  })
  it('una referencia nueva usa la regla actual e incluye todas las familias del tema', () => {
    const rengFamilias = new Set([1, 2, 3, 4, 5, 6].map((rengS) => rengReferenciaNueva('concentracion', 'universitario', rengS)?.ejercicioId.split('~')[0]))
    expect(rengFamilias.has('general.unidades-preparacion')).toBe(true)
    expect(rengFamilias.has('general.concentracion')).toBe(true)
  })
  it('el orden de las opciones se reconstruye igual (método y respuesta de opción) para la misma identidad', () => {
    const rengE = rengVariante('general.limitante-tabla', 'limitante.tabla-moles', 'universitario')
    const rengOtra = rengEjercicioPorId(rengE.id)!
    expect(JSON.stringify(rengOtra.metodo)).toBe(JSON.stringify(rengE.metodo))
    expect(JSON.stringify(rengOtra.respuesta)).toBe(JSON.stringify(rengE.respuesta))
  })
})

describe('Entrega C · lectura de almacenamiento válido, antiguo y dañado', () => {
  const rengEj = rengVariante('general.unidades-preparacion', 'unidades.masa-mg-como-g', 'preuniversitario')
  const rengBase = (): RengEstadoPractica => {
    let rengE = rengAbrir(rengEstadoPracticaInicial('general', 'concentracion', 'preuniversitario'), rengEj.id)
    rengE = rengPractica(rengE, { tipo: 'escribir', texto: '0,0125 mol/L' })
    rengE = rengPractica(rengE, { tipo: 'metodo', id: rengEj.metodo!.opciones[1]!.id })
    rengE = rengPractica(rengE, { tipo: 'pista', maximo: 3 })
    rengE = rengPractica(rengE, { tipo: 'pista', maximo: 3 })
    const rengC = rengCorreccionCompleta(rengEj, '0,0125 mol/L', rengE.actual.metodo)
    return rengPractica(rengE, { tipo: 'veredicto', veredicto: rengC.veredicto, metodo: rengC.metodo, completa: rengC.completa })
  }
  it('ida y vuelta v2: se recuperan respuesta con unidad, método, pistas, comprobaciones y corrección', () => {
    const rengE = rengBase()
    const rengTexto = rengSerializarPractica(rengE, rengIntentoAbierto)
    const rengL = rengLeerPractica(rengTexto, RENG_RESOLVEDOR_PRACTICA)
    expect(rengL.formato).toBe('v2')
    expect(rengL.avisos).toEqual([])
    const rengA = rengL.practica!.actual!
    expect(rengA.ejercicioId).toBe(rengEj.id)
    expect(rengA.respuesta).toBe('0,0125 mol/L')
    expect(rengA.metodo).toBe(rengE.actual.metodo)
    expect(rengA.pistas).toBe(2)
    expect(rengA.comprobaciones).toBe(1)
    expect(rengA.veredicto?.tipo).toBe(rengE.actual.veredicto?.tipo)
    expect(rengA.veredictoMetodo?.tipo).toBe(rengE.actual.veredictoMetodo?.tipo)
    expect(rengA.resuelto).toBe(rengE.actual.resuelto)
  })
  it('el almacén de verdad: guardar y arrancar recupera el borrador («Continuar práctica») y separa el logro', () => {
    const rengAlmacen = new Map<string, string>()
    const rengFalso = { getItem: (rengK: string) => rengAlmacen.get(rengK) ?? null, setItem: (rengK: string, rengV: string) => void rengAlmacen.set(rengK, rengV) }
    let rengE = rengAbrir(rengEstadoPracticaInicial('general', 'concentracion', 'preuniversitario'), rengEj.id)
    rengE = rengPractica(rengE, { tipo: 'escribir', texto: '12' })
    rengE = rengPractica(rengE, { tipo: 'pista', maximo: 3 })
    expect(rengGuardarPractica(rengFalso, rengE)).toBe(true)
    expect(rengAlmacen.has(RENG_CLAVE_PRACTICA)).toBe(true)
    const rengArranque = rengArrancarPractica(rengFalso, 'preuniversitario')
    expect(rengIntentoAbierto(rengArranque.estado.actual)).toBe(true)
    expect(rengArranque.estado.actual.respuesta).toBe('12')
    expect(rengArranque.estado.actual.pistas).toBe(1)
    expect(rengArranque.estado.actual.ejercicioId).toBe(rengEj.id)
    expect(rengArranque.avisos).toEqual([])
    expect(rengArrancarPractica({ getItem: () => null, setItem: () => undefined }, 'preuniversitario').estado.actual.ejercicioId).toMatch(/^general\.mol-masa~/)
  })
  it('el logro sobrevive al borrador: resolver, guardar y volver a empezar conserva «Resuelta»', () => {
    let rengE = rengBase()
    const rengC = rengCorreccionCompleta(rengEj, rengRespuestaTexto(rengEj), rengEj.metodo!.correcta)
    rengE = rengPractica(rengE, { tipo: 'escribir', texto: rengRespuestaTexto(rengEj) })
    rengE = rengPractica(rengE, { tipo: 'metodo', id: rengEj.metodo!.correcta })
    rengE = rengPractica(rengE, { tipo: 'veredicto', veredicto: rengC.veredicto, metodo: rengC.metodo, completa: rengC.completa })
    expect(rengEstadoEjercicio(rengE.logros, rengEj.id)).toBe('resuelta')
    const rengL = rengLeerPractica(rengSerializarPractica(rengE, rengIntentoAbierto), RENG_RESOLVEDOR_PRACTICA).practica!
    expect(rengL.logros[rengEj.id]!.estado).toBe('resuelta')
    expect(rengL.logros[rengEj.id]!.aciertos).toBe(1)
    expect(rengL.actual?.acertado).toBe(true)
    expect(rengIntentoAbierto(rengL.actual!)).toBe(false)
  })
  it('formato v1 (tema, nivel, semilla): se migra a la identidad correcta y los que no se pueden resolver se informan sin asociarlos a otro ejercicio', () => {
    const rengIntento = (rengTema: string, rengNivel: string, rengSemilla: number, rengRespuesta: string): Record<string, unknown> => ({ tema: rengTema, nivel: rengNivel, semilla: rengSemilla, respuesta: rengRespuesta, metodo: null, pistas: 1, resolucion: false, comprobaciones: 0, resuelto: false })
    const rengDoc = JSON.stringify({ v: 1, rama: 'general', actual: rengIntento('concentracion', 'preuniversitario', 2, '0,05'), pendientes: [rengIntento('estequiometria', 'universitario', 5, 'a'), rengIntento('mol', 'cientifico-inexistente', 1, 'x'), rengIntento('tema-que-no-existe', 'quimico', 1, 'y'), rengIntento('formular-nombrar', 'universitario', 3, 'z'), rengIntento('mol', 'quimico', 0, 'w')] })
    const rengL = rengLeerPractica(rengDoc, RENG_RESOLVEDOR_PRACTICA)
    expect(rengL.formato).toBe('v1')
    const rengLegado = rengReferenciaLegada('concentracion', 'preuniversitario', 2)!
    expect(rengL.practica!.actual!.ejercicioId).toBe(rengLegado.ejercicioId)
    expect(rengL.practica!.actual!.respuesta).toBe('0,05')
    expect(rengL.practica!.pendientes).toHaveLength(1)
    expect(rengL.practica!.pendientes[0]!.ejercicioId).toBe(rengReferenciaLegada('estequiometria', 'universitario', 5)!.ejercicioId)
    expect(rengL.avisos.length).toBe(4)
    expect(rengL.avisos.join(' ')).toMatch(/no se pudo asociar con certeza|descartó/)
  })
  it('un borrador cuyo ejercicio ya no existe o cambió de contenido se descarta con aviso (huella distinta o identificador desconocido)', () => {
    const rengResuelto = rengComprobar(rengBase(), rengEj, rengRespuestaTexto(rengEj), rengEj.metodo!.correcta)
    expect(rengEstadoEjercicio(rengResuelto.logros, rengEj.id)).toBe('resuelta')
    const rengBueno = JSON.parse(rengSerializarPractica(rengResuelto, rengIntentoAbierto)) as Record<string, Record<string, unknown>>
    const rengCambiado = JSON.parse(JSON.stringify(rengBueno)) as typeof rengBueno
    rengCambiado['actual']!['huella'] = 'deadbeef'
    const rengL1 = rengLeerPractica(JSON.stringify(rengCambiado), RENG_RESOLVEDOR_PRACTICA)
    expect(rengL1.practica!.actual).toBeNull()
    expect(rengL1.avisos.join(' ')).toMatch(/cambió desde que guardaste/)
    const rengDesconocido = JSON.parse(JSON.stringify(rengBueno)) as typeof rengBueno
    rengDesconocido['actual']!['id'] = 'familia.inventada~quimico~3'
    const rengL2 = rengLeerPractica(JSON.stringify(rengDesconocido), RENG_RESOLVEDOR_PRACTICA)
    expect(rengL2.practica!.actual).toBeNull()
    expect(rengL2.avisos.join(' ')).toMatch(/ya no corresponde a ningún ejercicio/)
    expect(Object.keys(rengL2.practica!.logros)).toContain(rengEj.id)
  })
  it('almacenamiento dañado: nunca lanza y nunca inventa un intento', () => {
    const rengMalos = ['', 'no-json', '[]', '"texto"', '123', 'null', '{"v":99}', '{"v":2}', '{"v":2,"actual":5,"pendientes":"x","logros":[]}', '{"v":2,"actual":{"id":1},"pendientes":[null,1,"a"],"logros":{"a":1}}', '{"v":2,"actual":{"id":"general.mol-masa~preuniversitario~1","huella":"x","respuesta":{"a":1}},"pendientes":[],"logros":{}}', JSON.stringify({ v: 2, actual: null, pendientes: [], logros: { [`${rengEj.id}`]: { estado: 'resuelta', aciertos: 0, repeticiones: 0, conResolucion: false, comprobaciones: 0 } } }), JSON.stringify({ v: 2, actual: null, pendientes: [], logros: { [`${rengEj.id}`]: { estado: 'resuelta', aciertos: -3, repeticiones: 1.5, conResolucion: 'sí', comprobaciones: 0 } } })]
    for (const rengT of rengMalos) {
      const rengL = rengLeerPractica(rengT, RENG_RESOLVEDOR_PRACTICA)
      expect(rengL.practica?.actual ?? null, rengT).toBeNull()
      expect(Object.keys(rengL.practica?.logros ?? {}), rengT).toEqual([])
    }
    const rengLargo = JSON.stringify({ ...JSON.parse(rengSerializarPractica(rengBase(), rengIntentoAbierto)), pendientes: [] })
    const rengConTexto = JSON.parse(rengLargo) as { actual: { respuesta: string } }
    rengConTexto.actual.respuesta = 'x'.repeat(5000)
    expect(rengLeerPractica(JSON.stringify(rengConTexto), RENG_RESOLVEDOR_PRACTICA).practica!.actual).toBeNull()
    expect(rengArrancarPractica({ getItem: () => { throw new Error('bloqueado') }, setItem: () => undefined }, 'universitario').estado.actual.tema).toBe('mol')
    expect(rengGuardarPractica({ getItem: () => null, setItem: () => { throw new Error('lleno') } }, rengBase())).toBe(false)
    expect(rengGuardarPractica(null, rengBase())).toBe(false)
  })
  it('si lo guardado no se puede leer, el aviso lo dice y la práctica arranca limpia', () => {
    const rengAlmacen = { getItem: () => '{roto', setItem: () => undefined }
    const rengA = rengArrancarPractica(rengAlmacen, 'preuniversitario')
    expect(rengA.avisos.join(' ')).toMatch(/dañado/)
    expect(rengIntentoAbierto(rengA.estado.actual)).toBe(false)
  })
})

describe('Entrega C · revisar, resolver y repetir sin duplicar aciertos', () => {
  const rengEj = rengVariante('general.unidades-preparacion', 'unidades.volumen-ml-como-l', 'preuniversitario')
  const rengInicio = (): RengEstadoPractica => rengAbrir(rengEstadoPracticaInicial('general', 'concentracion', 'preuniversitario'), rengEj.id)
  const rengCorrecta = rengRespuestaTexto(rengEj)
  const rengMetodoOk = rengEj.metodo!.correcta
  const rengMetodoMal = rengEj.metodo!.opciones.find((rengO) => rengO.id !== rengMetodoOk)!.id

  it('«Pendiente» al empezar; abrir la resolución la marca «Revisada» sin crédito', () => {
    let rengE = rengInicio()
    expect(rengEstadoEjercicio(rengE.logros, rengEj.id)).toBe('pendiente')
    rengE = rengPractica(rengE, { tipo: 'resolucion' })
    expect(rengEstadoEjercicio(rengE.logros, rengEj.id)).toBe('revisada')
    expect(rengE.logros[rengEj.id]!.aciertos).toBe(0)
    expect(rengPractica(rengE, { tipo: 'resolucion' })).toBe(rengE)
  })
  it('«Resuelta» solo con la respuesta completa: resultado correcto y método correcto', () => {
    let rengE = rengComprobar(rengInicio(), rengEj, rengCorrecta, rengMetodoMal)
    expect(rengEstadoEjercicio(rengE.logros, rengEj.id)).toBe('pendiente')
    expect(rengE.actual.veredicto?.tipo).toBe('correcto')
    expect(rengE.actual.resuelto).toBe(false)
    rengE = rengComprobar(rengE, rengEj, rengCorrecta, rengMetodoOk)
    expect(rengEstadoEjercicio(rengE.logros, rengEj.id)).toBe('resuelta')
    expect(rengE.logros[rengEj.id]!.aciertos).toBe(1)
    expect(rengIntentoAbierto(rengE.actual)).toBe(false)
  })
  it('un método sin respuesta correcta tampoco resuelve', () => {
    const rengE = rengComprobar(rengInicio(), rengEj, '999 mol/L', rengMetodoOk)
    expect(rengEstadoEjercicio(rengE.logros, rengEj.id)).toBe('pendiente')
  })
  it('volver a comprobar una respuesta recién aceptada, o editarla y comprobarla de nuevo, no suma un acierto', () => {
    let rengE = rengComprobar(rengInicio(), rengEj, rengCorrecta, rengMetodoOk)
    rengE = rengComprobar(rengE, rengEj, rengCorrecta, rengMetodoOk)
    rengE = rengComprobar(rengE, rengEj, rengCorrecta.replace(',', '.') + ' ', rengMetodoOk)
    expect(rengE.logros[rengEj.id]!.aciertos).toBe(1)
    expect(rengE.logros[rengEj.id]!.comprobaciones).toBe(3)
  })
  it('un error posterior no borra el logro', () => {
    let rengE = rengComprobar(rengInicio(), rengEj, rengCorrecta, rengMetodoOk)
    rengE = rengComprobar(rengE, rengEj, '1 mol/L', rengMetodoOk)
    expect(rengE.actual.resuelto).toBe(false)
    expect(rengEstadoEjercicio(rengE.logros, rengEj.id)).toBe('resuelta')
    expect(rengE.logros[rengEj.id]!.aciertos).toBe(1)
    expect(rengIntentoAbierto(rengE.actual)).toBe(false)
  })
  it('ver la resolución antes de acertar deja constancia («con la resolución a la vista») pero el estado final es «Resuelta»', () => {
    let rengE = rengPractica(rengInicio(), { tipo: 'resolucion' })
    rengE = rengComprobar(rengE, rengEj, rengCorrecta, rengMetodoOk)
    expect(rengEstadoEjercicio(rengE.logros, rengEj.id)).toBe('resuelta')
    expect(rengE.logros[rengEj.id]!.conResolucion).toBe(true)
    let rengLimpio = rengComprobar(rengInicio(), rengEj, rengCorrecta, rengMetodoOk)
    rengLimpio = rengPractica(rengLimpio, { tipo: 'resolucion' })
    expect(rengLimpio.logros[rengEj.id]!.conResolucion).toBe(false)
  })
  it('rehacer deliberadamente una variante resuelta suma una repetición, limpia el borrador y su nuevo acierto se cuenta una vez', () => {
    let rengE = rengComprobar(rengInicio(), rengEj, rengCorrecta, rengMetodoOk)
    rengE = rengPractica(rengE, { tipo: 'repetir' })
    expect(rengE.logros[rengEj.id]!.repeticiones).toBe(1)
    expect(rengE.actual.respuesta).toBe('')
    expect(rengE.actual.acertado).toBe(false)
    expect(rengEstadoEjercicio(rengE.logros, rengEj.id)).toBe('resuelta')
    rengE = rengComprobar(rengE, rengEj, rengCorrecta, rengMetodoOk)
    rengE = rengComprobar(rengE, rengEj, rengCorrecta, rengMetodoOk)
    expect(rengE.logros[rengEj.id]!.aciertos).toBe(2)
    expect(rengE.logros[rengEj.id]!.repeticiones).toBe(1)
    expect(rengPractica(rengInicio(), { tipo: 'repetir' }).logros).toEqual({})
  })
  it('un tipo de respuesta sin método se resuelve solo con el resultado', () => {
    const rengO = rengVariante('organica.comparar-estructuras', 'comparar.identidad-o-isomero', 'preuniversitario')
    expect(rengO.metodo).toBeUndefined()
    let rengE = rengAbrir(rengEstadoPracticaInicial('organica', 'isomeria', 'preuniversitario'), rengO.id)
    rengE = rengComprobar(rengE, rengO, rengRespuestaTexto(rengO), null)
    expect(rengEstadoEjercicio(rengE.logros, rengO.id)).toBe('resuelta')
  })
  it('cambiar de ejercicio guarda el borrador abierto y volver a él lo recupera tal cual', () => {
    let rengE = rengPractica(rengInicio(), { tipo: 'escribir', texto: '7 mol/L' })
    rengE = rengPractica(rengE, { tipo: 'pista', maximo: 3 })
    const rengOtro = rengVariante('general.unidades-preparacion', 'unidades.masa-mg-como-g', 'preuniversitario')
    rengE = rengAbrir(rengE, rengOtro.id)
    expect(rengE.pendientes).toHaveLength(1)
    rengE = rengAbrir(rengE, rengEj.id)
    expect(rengE.actual.respuesta).toBe('7 mol/L')
    expect(rengE.actual.pistas).toBe(1)
  })
})

describe('Entrega C · nivel preferido, regreso al mismo intento y recorridos', () => {
  const rengVista = rengFuente('modos/VistaEjercicios.tsx')
  const rengVistaView = rengFuente('View.tsx')
  it('cambiar de nivel dentro del ejercicio es temporal: no llama al nivel global y lo anuncia', () => {
    expect(rengVista).not.toMatch(/rengOnNivel/)
    expect(rengVista).toMatch(/Nivel temporal:/)
    expect(rengVista).toMatch(/tu nivel preferido sigue siendo/)
    expect(rengVista).toMatch(/rengAbrirVariante\(rengN, 1\)/)
    expect(rengNivelParaTema('ajuste-cinetico', 'universitario')).not.toBeNull()
  })
  it('Prácticas guarda en cada cambio y recupera al arrancar (borrador separado del logro)', () => {
    expect(rengVistaView).toMatch(/rengGuardarPractica\(rengAlmacenLocal\(\), rengPract\)/)
    expect(rengVistaView).toMatch(/rengArrancarPractica\(rengAlmacenLocal\(\), rengLeerNivelPractica\(rengAlmacenLocal\(\)\)\)/)
  })
  it('regreso al mismo intento: Lección y Mesa vuelven a la práctica con los mismos datos (la Simulación es libre y ya no ofrece volver)', () => {
    expect(rengVistaView).toMatch(/rengRepasarLeccion/)
    expect(rengVistaView).toMatch(/volverAPractica=\{rengRepasoDesdePractica \? rengVolverAlEjercicio : undefined\}/)
    expect(rengVistaView).toMatch(/Volver a la práctica/)
    expect(rengVistaView).toMatch(/rengAbrirEnMesa\(rengS, rengM, true\)/)
    expect(rengFuente('modos/Simulaciones.tsx')).not.toMatch(/Volver a la práctica/)
    expect(rengFuente('modos/Aprender.tsx')).toMatch(/Volver a la práctica/)
    expect(rengVista).toMatch(/Repasar la lección/)
    expect(rengVista).toMatch(/Rehacer esta variante/)
  })
  it('las prácticas sin escena compatible siguen siendo utilizables por sí mismas (no ofrecen «Simular»)', () => {
    for (const rengF of RENG_FAMILIAS.filter((rengX) => ['curva-equivalencia', 'interpolar-calibracion', 'modelo-cinetico', 'comparar-estructuras', 'unidades-preparacion'].some((rengY) => rengX.id.endsWith(rengY)))) {
      for (const rengN of rengF.niveles) {
        const rengE = rengGenerarDeFamilia(rengF, rengN, 1) ?? rengGenerarDeFamilia(rengF, rengN, 2) ?? rengGenerarDeFamilia(rengF, rengN, 3)
        if (rengE) expect(rengE.simulacion, rengE.id).toBeUndefined()
      }
    }
  })
})
